"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { withBase } from "@/lib/content/slug";

type GNode = {
  v: string;
  t: string;
  u: string;
  s: string;
  x: number;
  y: number;
  r: number;
  cDark: string;
  cLight: string;
};
type GData = {
  nodes: GNode[];
  links: [number, number][];
  vaults: { id: string; short: string }[];
};
type Chip = { id: string; short: string; count: number; color: string };

// Grafo interactivo de las páginas: clusters por materia con etiqueta, leyenda
// para filtrar, hover (resalta vecindario + título), click (abre la nota),
// arrastrar (pan), ⌘/ctrl+scroll (zoom). Render por eventos (sin loop).
export default function GraphExplorer() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [chips, setChips] = useState<Chip[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const selRef = useRef<string | null>(null);
  const drawRef = useRef<() => void>(() => {});

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let data: GData | null = null;
    let adj: number[][] = [];
    let centroids: Record<string, { x: number; y: number }> = {};
    let hover = -1;
    let raf = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    const cam = { x: 500, y: 500, z: 1 };

    const isLight = () =>
      document.documentElement.getAttribute("data-theme") === "light";
    let light = isLight();
    let edgeCol = light ? "rgba(36,18,8,0.10)" : "rgba(255,255,255,0.07)";
    let inkCol = light ? "#241208" : "#ffffff";
    const readTheme = () => {
      light = isLight();
      edgeCol = light ? "rgba(36,18,8,0.10)" : "rgba(255,255,255,0.07)";
      inkCol =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--ink-strong")
          .trim() || (light ? "#241208" : "#ffffff");
    };
    const nodeCol = (n: GNode) => (light ? n.cLight : n.cDark);

    const scale = () =>
      (Math.min(cv.clientWidth, cv.clientHeight) / 1000) * cam.z;
    const toS = (x: number, y: number) => {
      const w = cv.clientWidth,
        h = cv.clientHeight,
        s = scale();
      return [w / 2 + (x - cam.x) * s, h / 2 + (y - cam.y) * s] as const;
    };
    const resize = () => {
      cv.width = Math.floor(cv.clientWidth * dpr);
      cv.height = Math.floor(cv.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!data) return;
      const w = cv.clientWidth,
        h = cv.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const sel = selRef.current;
      const N = data.nodes;
      const hi = hover >= 0 ? new Set(adj[hover].concat(hover)) : null;

      ctx.lineWidth = 0.7;
      for (const [a, b] of data.links) {
        const na = N[a];
        const both = hi ? hi.has(a) && hi.has(b) : false;
        const inSel = sel ? na.v === sel && N[b].v === sel : true;
        let alpha: number;
        if (hi) alpha = both ? 0.5 : 0.03;
        else if (sel) alpha = inSel ? 0.28 : 0.02;
        else alpha = 0.09;
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = both || (sel && inSel) ? nodeCol(na) : edgeCol;
        const [x1, y1] = toS(na.x, na.y),
          [x2, y2] = toS(N[b].x, N[b].y);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      for (let i = 0; i < N.length; i++) {
        const n = N[i];
        const [x, y] = toS(n.x, n.y);
        let a: number;
        if (hi) a = hi.has(i) ? 1 : 0.12;
        else if (sel) a = n.v === sel ? 1 : 0.14;
        else a = 0.9;
        ctx.globalAlpha = a;
        ctx.fillStyle = nodeCol(n);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1.5, n.r * cam.z * 0.7), 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // etiquetas de cluster
      ctx.textAlign = "center";
      ctx.font = "600 13px 'JetBrains Mono', ui-monospace, monospace";
      for (const vlt of data.vaults) {
        if (sel && vlt.id !== sel) continue;
        const c = centroids[vlt.id];
        if (!c) continue;
        const [x, y] = toS(c.x, c.y);
        const label = vlt.short.toUpperCase();
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = light ? "rgba(255,255,255,0.72)" : "rgba(20,12,7,0.6)";
        ctx.fillRect(x - tw / 2 - 7, y - 10, tw + 14, 19);
        ctx.fillStyle = inkCol;
        ctx.fillText(label, x, y + 4);
      }
      ctx.textAlign = "start";

      if (hover >= 0) {
        const n = N[hover];
        const [x, y] = toS(n.x, n.y);
        ctx.font = "600 14px Newsreader, Georgia, serif";
        const tw = ctx.measureText(n.t).width;
        const bx = Math.min(Math.max(x + 10, 8), w - tw - 14);
        const by = Math.min(Math.max(y - 12, 22), h - 10);
        ctx.fillStyle = light ? "rgba(255,255,255,0.94)" : "rgba(20,12,7,0.9)";
        ctx.fillRect(bx - 7, by - 16, tw + 14, 24);
        ctx.fillStyle = inkCol;
        ctx.fillText(n.t, bx, by);
      }
    };
    const requestDraw = () => {
      if (!raf)
        raf = requestAnimationFrame(() => {
          raf = 0;
          draw();
        });
    };
    drawRef.current = requestDraw;

    const pick = (mx: number, my: number) => {
      if (!data) return -1;
      const sel = selRef.current;
      let best = -1,
        bd = 150;
      for (let i = 0; i < data.nodes.length; i++) {
        const n = data.nodes[i];
        if (sel && n.v !== sel) continue;
        const [x, y] = toS(n.x, n.y);
        const d = (x - mx) ** 2 + (y - my) ** 2;
        if (d < bd) {
          bd = d;
          best = i;
        }
      }
      return best;
    };

    fetch(withBase("/graph.json"))
      .then((r) => r.json())
      .then((d: GData) => {
        data = d;
        adj = d.nodes.map(() => []);
        for (const [a, b] of d.links) {
          adj[a].push(b);
          adj[b].push(a);
        }
        const acc: Record<string, { x: number; y: number; n: number }> = {};
        for (const n of d.nodes) {
          if (!acc[n.v]) acc[n.v] = { x: 0, y: 0, n: 0 };
          acc[n.v].x += n.x;
          acc[n.v].y += n.y;
          acc[n.v].n += 1;
        }
        centroids = {};
        for (const k in acc)
          centroids[k] = { x: acc[k].x / acc[k].n, y: acc[k].y / acc[k].n };
        readTheme();
        resize();
        draw();
        setChips(
          d.vaults.map((v) => {
            const n = d.nodes.find((nd) => nd.v === v.id);
            return {
              id: v.id,
              short: v.short,
              count: acc[v.id]?.n ?? 0,
              color: (light ? n?.cLight : n?.cDark) || "#888",
            };
          }),
        );
      })
      .catch(() => {});

    cv.onpointermove = (e) => {
      const r = cv.getBoundingClientRect();
      const mx = e.clientX - r.left,
        my = e.clientY - r.top;
      if (dragging) {
        const s = scale();
        cam.x -= (mx - lastX) / s;
        cam.y -= (my - lastY) / s;
        lastX = mx;
        lastY = my;
        requestDraw();
        return;
      }
      const h = pick(mx, my);
      if (h !== hover) {
        hover = h;
        cv.style.cursor = h >= 0 ? "pointer" : "grab";
        requestDraw();
      }
    };
    cv.onpointerdown = (e) => {
      dragging = true;
      const r = cv.getBoundingClientRect();
      lastX = e.clientX - r.left;
      lastY = e.clientY - r.top;
      try {
        cv.setPointerCapture(e.pointerId);
      } catch {}
    };
    cv.onpointerup = (e) => {
      dragging = false;
      try {
        cv.releasePointerCapture(e.pointerId);
      } catch {}
    };
    cv.onpointerleave = () => {
      if (hover !== -1) {
        hover = -1;
        requestDraw();
      }
    };
    cv.onclick = () => {
      if (hover >= 0 && data) router.push(data.nodes[hover].u);
    };
    cv.onwheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      cam.z = Math.min(4, Math.max(0.7, cam.z * (e.deltaY < 0 ? 1.12 : 0.9)));
      requestDraw();
    };

    const onR = () => {
      resize();
      draw();
    };
    const onTheme = () => {
      readTheme();
      draw();
      setChips((cs) =>
        cs.map((c) => {
          const n = data?.nodes.find((nd) => nd.v === c.id);
          return { ...c, color: (light ? n?.cLight : n?.cDark) || c.color };
        }),
      );
    };
    addEventListener("resize", onR);
    window.addEventListener("sv:themechange", onTheme);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onR);
      window.removeEventListener("sv:themechange", onTheme);
    };
  }, [router]);

  const choose = (id: string | null) => {
    const nv = id !== null && selRef.current === id ? null : id;
    selRef.current = nv;
    setSelected(nv);
    drawRef.current();
  };

  return (
    <div className="graph">
      <div className="graph__legend" role="group" aria-label="Filtrar el grafo por materia">
        <button
          type="button"
          className={`graph__chip${selected === null ? " is-on" : ""}`}
          onClick={() => choose(null)}
          aria-pressed={selected === null}
        >
          Todas
        </button>
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`graph__chip${selected === c.id ? " is-on" : ""}`}
            onClick={() => choose(c.id)}
            aria-pressed={selected === c.id}
          >
            <span className="graph__dot" style={{ background: c.color }} />
            {c.short}
            <span className="graph__cnt">{c.count}</span>
          </button>
        ))}
      </div>
      <div
        className="graph__canvas"
        role="img"
        aria-label="Grafo interactivo de las páginas del wiki, agrupadas por materia. Cada punto es una nota; cada línea, un enlace."
      >
        <canvas ref={cvRef} />
      </div>
      <p className="graph__hint">
        Hover para ver una nota · click para abrirla · arrastrá para mover ·
        ⌘/Ctrl + scroll para zoom · elegí una materia arriba para aislarla
      </p>
    </div>
  );
}
