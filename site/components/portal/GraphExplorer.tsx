"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
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
  bounds?: { hx: number; hy: number };
};
type Chip = { id: string; short: string; count: number; color: string };

const TAU = Math.PI * 2;

// Grafo interactivo de las páginas: clusters por materia. Late como un cerebro
// —los nodos "disparan" y viajan pulsos de señal por las sinapsis (aristas)—
// vía un loop rAF continuo (pausado con reduced-motion y con la pestaña oculta).
// Las tabs de arriba enfocan la cámara sobre una materia y concentran la
// actividad ahí. Hover resalta el vecindario; click abre la nota; arrastrar
// panea; ⌘/ctrl+scroll hace zoom.
export default function GraphExplorer() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [chips, setChips] = useState<Chip[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const selRef = useRef<string | null>(null);
  const applyRef = useRef<(id: string | null) => void>(() => {});

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const motion = !window.matchMedia?.("(prefers-reduced-motion: reduce)")
      .matches;

    // Guard contra el doble-montaje de React StrictMode en dev: si el efecto
    // se limpió, el fetch que resuelve tarde NO debe arrancar un loop zombie.
    let alive = true;
    let data: GData | null = null;
    let adj: number[][] = [];
    let centroids: Record<string, { x: number; y: number }> = {};
    let camTargets: Record<string, { x: number; y: number; z: number }> = {};
    let vaultColor: Record<string, string> = {};
    let linksByVault: Record<string, number[]> = {};
    let nodePhase: Float32Array = new Float32Array(0);
    let nodeSpeed: Float32Array = new Float32Array(0);
    let fireArr: Float32Array = new Float32Array(0);
    let signals: { a: number; b: number; p: number; sp: number }[] = [];

    let hover = -1;
    let raf = 0;
    let dragging = false;
    let tweening = false;
    let lastX = 0;
    let lastY = 0;
    let t0 = performance.now();
    let last = t0;
    const cam = { x: 500, y: 500, z: 1 };
    const camTo = { x: 500, y: 500, z: 1 };

    const rnd = () => Math.random();

    const isLight = () =>
      document.documentElement.getAttribute("data-theme") === "light";
    let light = isLight();
    let edgeCol = light ? "rgba(36,18,8,0.14)" : "rgba(255,255,255,0.09)";
    let inkCol = light ? "#241208" : "#ffffff";
    const readTheme = () => {
      light = isLight();
      edgeCol = light ? "rgba(36,18,8,0.14)" : "rgba(255,255,255,0.09)";
      inkCol =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--ink-strong")
          .trim() || (light ? "#241208" : "#ffffff");
    };
    const nodeCol = (n: GNode) => (light ? n.cLight : n.cDark);

    // contain-fit a los semiejes reales del grafo (centrado en 500,500): llena
    // el eje más ajustado del canvas (el ancho en desktop) sin recortar. Cae al
    // encuadre 1000 previo si aún no llegó `bounds`.
    const scale = () => {
      const cw = cv.clientWidth,
        ch = cv.clientHeight;
      const b = data?.bounds;
      const base = b
        ? Math.min(cw / (b.hx * 2), ch / (b.hy * 2)) * 0.92
        : Math.min(cw, ch) / 1000;
      return base * cam.z;
    };
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

    // ---- reasignar los pulsos de señal al pool de la materia enfocada ----
    const poolFor = (sel: string | null): number[] | null => {
      if (!data) return null;
      if (sel) return linksByVault[sel]?.length ? linksByVault[sel] : null;
      return null; // null → todo el grafo
    };
    const respawn = (s: { a: number; b: number; p: number; sp: number }) => {
      if (!data) return;
      const pool = poolFor(selRef.current);
      const li = pool
        ? pool[(rnd() * pool.length) | 0]
        : (rnd() * data.links.length) | 0;
      const [a, b] = data.links[li];
      const fwd = rnd() < 0.5;
      s.a = fwd ? a : b;
      s.b = fwd ? b : a;
      s.p = rnd() * 0.15;
      s.sp = 0.28 + rnd() * 0.48;
    };
    const seedSignals = () => {
      if (!data) return;
      const pool = poolFor(selRef.current);
      const n = pool ? pool.length : data.links.length;
      const base = pool
        ? Math.min(46, Math.max(12, Math.round(n * 0.5)))
        : Math.min(64, Math.max(22, Math.round(n * 0.05)));
      signals = Array.from({ length: base }, () => {
        const s = { a: 0, b: 0, p: 0, sp: 0.5 };
        respawn(s);
        s.p = rnd(); // escalonar el arranque
        return s;
      });
    };

    // ---- dibujo de un frame en tiempo `t` (segundos) ----
    const draw = (t: number) => {
      if (!data) return;
      const w = cv.clientWidth,
        h = cv.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const sel = selRef.current;
      const N = data.nodes;
      const z = cam.z;
      const hi = hover >= 0 ? new Set(adj[hover].concat(hover)) : null;
      const breath = 0.5 + 0.5 * Math.sin(t * 0.5);

      // ---------- ARISTAS (batcheadas por estado) ----------
      ctx.lineWidth = 0.7;
      if (hi) {
        ctx.strokeStyle = edgeCol;
        ctx.globalAlpha = 0.045;
        ctx.beginPath();
        for (const [a, b] of data.links) {
          if (hi.has(a) && hi.has(b)) continue;
          const [x1, y1] = toS(N[a].x, N[a].y);
          const [x2, y2] = toS(N[b].x, N[b].y);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.stroke();
        ctx.globalAlpha = 0.6;
        for (const [a, b] of data.links) {
          if (!(hi.has(a) && hi.has(b))) continue;
          ctx.strokeStyle = nodeCol(N[a]);
          const [x1, y1] = toS(N[a].x, N[a].y);
          const [x2, y2] = toS(N[b].x, N[b].y);
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      } else if (sel) {
        ctx.strokeStyle = edgeCol;
        ctx.globalAlpha = 0.02;
        ctx.beginPath();
        for (const [a, b] of data.links) {
          if (N[a].v === sel && N[b].v === sel) continue;
          const [x1, y1] = toS(N[a].x, N[a].y);
          const [x2, y2] = toS(N[b].x, N[b].y);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.stroke();
        ctx.strokeStyle = vaultColor[sel] || edgeCol;
        ctx.globalAlpha = 0.22 + 0.12 * breath;
        ctx.beginPath();
        for (const [a, b] of data.links) {
          if (!(N[a].v === sel && N[b].v === sel)) continue;
          const [x1, y1] = toS(N[a].x, N[a].y);
          const [x2, y2] = toS(N[b].x, N[b].y);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.stroke();
      } else {
        ctx.strokeStyle = edgeCol;
        ctx.globalAlpha = 0.06 + 0.04 * breath;
        ctx.beginPath();
        for (const [a, b] of data.links) {
          const [x1, y1] = toS(N[a].x, N[a].y);
          const [x2, y2] = toS(N[b].x, N[b].y);
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.stroke();
      }

      // ---------- NODOS (núcleos, con pulso de "neurona") ----------
      for (let i = 0; i < N.length; i++) {
        const n = N[i];
        const fire = 0.5 + 0.5 * Math.sin(t * nodeSpeed[i] + nodePhase[i]);
        fireArr[i] = fire;
        let a: number;
        if (hi) a = hi.has(i) ? 1 : 0.1;
        else if (sel) a = n.v === sel ? 0.95 : 0.12;
        else a = 0.66 + 0.24 * fire;
        const [x, y] = toS(n.x, n.y);
        const r =
          Math.max(1.4, n.r * z * 0.62) * (0.9 + 0.16 * fire) *
          (hi && hi.has(i) ? 1.15 : 1);
        ctx.globalAlpha = a;
        ctx.fillStyle = nodeCol(n);
        ctx.beginPath();
        ctx.arc(x, y, r, 0, TAU);
        ctx.fill();
      }

      // ---------- CAPA ADITIVA: glow de disparo + pulsos de señal ----------
      // `glowZ` capa el tamaño del brillo al hacer zoom, para que un cluster
      // denso no se "queme" en blanco y los nodos sigan distinguiéndose.
      const glowZ = Math.min(z, 1.5);
      if (!light) ctx.globalCompositeOperation = "lighter";
      // halos de nodos que "disparan" (pocos a la vez → titilan)
      for (let i = 0; i < N.length; i++) {
        const n = N[i];
        const vis = hi ? hi.has(i) : sel ? n.v === sel : true;
        if (!vis) continue;
        const fire = fireArr[i];
        if (fire < 0.82) continue;
        const [x, y] = toS(n.x, n.y);
        const hr = Math.max(1.4, n.r * glowZ * 0.6) * 2.3;
        ctx.globalAlpha = (light ? 0.09 : 0.13) * (fire - 0.6);
        ctx.fillStyle = nodeCol(n);
        ctx.beginPath();
        ctx.arc(x, y, hr, 0, TAU);
        ctx.fill();
      }
      // pulsos viajando por las sinapsis
      for (const s of signals) {
        const na = N[s.a];
        const nb = N[s.b];
        const vis = sel ? na.v === sel : true;
        if (!vis) continue;
        const gx = na.x + (nb.x - na.x) * s.p;
        const gy = na.y + (nb.y - na.y) * s.p;
        const [x, y] = toS(gx, gy);
        // fundido en los extremos del recorrido → pulso que "nace" y "muere"
        const fade = Math.sin(s.p * Math.PI);
        const col = nodeCol(na);
        // halo
        ctx.globalAlpha = (light ? 0.26 : 0.36) * fade;
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(x, y, Math.max(2.5, 4 * glowZ), 0, TAU);
        ctx.fill();
        // núcleo brillante
        ctx.globalAlpha = (light ? 0.8 : 0.92) * fade;
        ctx.fillStyle = light ? col : "#ffffff";
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1.1, 1.5 * glowZ), 0, TAU);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;

      // ---------- ETIQUETAS DE CLUSTER ----------
      ctx.textAlign = "center";
      ctx.font = "600 13px 'JetBrains Mono', ui-monospace, monospace";
      for (const vlt of data.vaults) {
        if (sel && vlt.id !== sel) continue;
        const c = centroids[vlt.id];
        if (!c) continue;
        const [x, y] = toS(c.x, c.y);
        const label = vlt.short.toUpperCase();
        const tw = ctx.measureText(label).width;
        ctx.fillStyle = light ? "rgba(255,255,255,0.74)" : "rgba(20,12,7,0.62)";
        ctx.fillRect(x - tw / 2 - 7, y - 10, tw + 14, 19);
        ctx.fillStyle = inkCol;
        ctx.fillText(label, x, y + 4);
      }
      ctx.textAlign = "start";

      // ---------- TOOLTIP DE HOVER ----------
      if (hover >= 0) {
        const n = N[hover];
        const [x, y] = toS(n.x, n.y);
        ctx.font = "600 14px Newsreader, Georgia, serif";
        const tw = ctx.measureText(n.t).width;
        const bx = Math.min(Math.max(x + 18, 8), w - tw - 14);
        const by = Math.min(Math.max(y - 20, 22), h - 10);
        ctx.fillStyle = light ? "#ffffff" : "rgb(20,12,7)";
        ctx.fillRect(bx - 7, by - 16, tw + 14, 24);
        ctx.fillStyle = inkCol;
        ctx.fillText(n.t, bx, by);
      }
    };

    // ---- loop de animación (o draw único si reduced-motion) ----
    const frame = () => {
      const now = performance.now();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const t = (now - t0) / 1000;

      // tween de cámara hacia el foco de la materia
      if (tweening) {
        cam.x += (camTo.x - cam.x) * 0.1;
        cam.y += (camTo.y - cam.y) * 0.1;
        cam.z += (camTo.z - cam.z) * 0.1;
        if (
          Math.abs(camTo.x - cam.x) < 0.4 &&
          Math.abs(camTo.y - cam.y) < 0.4 &&
          Math.abs(camTo.z - cam.z) < 0.002
        ) {
          cam.x = camTo.x;
          cam.y = camTo.y;
          cam.z = camTo.z;
          tweening = false;
        }
      }

      // avanzar los pulsos
      for (const s of signals) {
        s.p += s.sp * dt;
        if (s.p >= 1) respawn(s);
      }

      draw(t);
      raf = requestAnimationFrame(frame);
    };
    const startLoop = () => {
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    const stopLoop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const drawStatic = () => draw((performance.now() - t0) / 1000);

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

    // ---- enfocar una materia (cámara + señales) ----
    const applySelection = (id: string | null) => {
      const tgt = (id && camTargets[id]) || { x: 500, y: 500, z: 1 };
      camTo.x = tgt.x;
      camTo.y = tgt.y;
      camTo.z = tgt.z;
      seedSignals();
      if (motion) {
        tweening = true;
        drawStatic(); // pinta el aislamiento ya mismo; el tween lo completa rAF
      } else {
        cam.x = tgt.x;
        cam.y = tgt.y;
        cam.z = tgt.z;
        drawStatic();
      }
    };
    applyRef.current = applySelection;

    fetch(withBase("/graph.json"))
      .then((r) => r.json())
      .then((d: GData) => {
        if (!alive) return;
        data = d;
        adj = d.nodes.map(() => []);
        linksByVault = {};
        for (let li = 0; li < d.links.length; li++) {
          const [a, b] = d.links[li];
          adj[a].push(b);
          adj[b].push(a);
          if (d.nodes[a].v === d.nodes[b].v) {
            (linksByVault[d.nodes[a].v] ||= []).push(li);
          }
        }
        // centroides + bounding box por materia
        const acc: Record<
          string,
          { x: number; y: number; n: number; minX: number; maxX: number; minY: number; maxY: number }
        > = {};
        for (const n of d.nodes) {
          const a = (acc[n.v] ||= {
            x: 0,
            y: 0,
            n: 0,
            minX: Infinity,
            maxX: -Infinity,
            minY: Infinity,
            maxY: -Infinity,
          });
          a.x += n.x;
          a.y += n.y;
          a.n += 1;
          if (n.x < a.minX) a.minX = n.x;
          if (n.x > a.maxX) a.maxX = n.x;
          if (n.y < a.minY) a.minY = n.y;
          if (n.y > a.maxY) a.maxY = n.y;
        }
        centroids = {};
        camTargets = {};
        vaultColor = {};
        for (const k in acc) {
          const a = acc[k];
          centroids[k] = { x: a.x / a.n, y: a.y / a.n };
          const span = Math.max(a.maxX - a.minX, a.maxY - a.minY, 1);
          camTargets[k] = {
            x: (a.minX + a.maxX) / 2,
            y: (a.minY + a.maxY) / 2,
            z: Math.min(2.3, Math.max(1.15, (1000 * 0.62) / span)),
          };
          const sample = d.nodes.find((nd) => nd.v === k);
          vaultColor[k] = (light ? sample?.cLight : sample?.cDark) || "#888";
        }
        // fase/velocidad de disparo por nodo (deterministas por índice)
        nodePhase = new Float32Array(d.nodes.length);
        nodeSpeed = new Float32Array(d.nodes.length);
        fireArr = new Float32Array(d.nodes.length);
        for (let i = 0; i < d.nodes.length; i++) {
          nodePhase[i] = rnd() * TAU;
          nodeSpeed[i] = 0.32 + rnd() * 0.78;
        }
        seedSignals();

        readTheme();
        resize();
        t0 = performance.now();
        drawStatic(); // primer frame sincrónico (visible aunque rAF tarde)
        if (motion) startLoop();

        setTotal(d.nodes.length);
        setChips(
          d.vaults.map((v) => ({
            id: v.id,
            short: v.short,
            count: acc[v.id]?.n ?? 0,
            color: vaultColor[v.id] || "#888",
          })),
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
        tweening = false;
        if (!motion) drawStatic();
        return;
      }
      const h = pick(mx, my);
      if (h !== hover) {
        hover = h;
        cv.style.cursor = h >= 0 ? "pointer" : "grab";
        if (!motion) drawStatic();
      }
    };
    cv.onpointerdown = (e) => {
      dragging = true;
      tweening = false;
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
        if (!motion) drawStatic();
      }
    };
    cv.onclick = () => {
      if (hover >= 0 && data) router.push(data.nodes[hover].u);
    };
    cv.onwheel = (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      cam.z = Math.min(4, Math.max(0.7, cam.z * (e.deltaY < 0 ? 1.12 : 0.9)));
      tweening = false;
      if (!motion) drawStatic();
    };

    const onR = () => {
      resize();
      if (!motion) drawStatic();
    };
    const onTheme = () => {
      readTheme();
      for (const k in vaultColor) {
        const sample = data?.nodes.find((nd) => nd.v === k);
        vaultColor[k] = (light ? sample?.cLight : sample?.cDark) || vaultColor[k];
      }
      if (!motion) drawStatic();
      setChips((cs) => cs.map((c) => ({ ...c, color: vaultColor[c.id] || c.color })));
    };
    const onVis = () => {
      if (!motion) return;
      if (document.hidden) stopLoop();
      else startLoop();
    };
    addEventListener("resize", onR);
    window.addEventListener("sv:themechange", onTheme);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      alive = false;
      stopLoop();
      removeEventListener("resize", onR);
      window.removeEventListener("sv:themechange", onTheme);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [router]);

  const choose = (id: string | null) => {
    const nv = id !== null && selRef.current === id ? null : id;
    selRef.current = nv;
    setSelected(nv);
    applyRef.current(nv);
  };

  return (
    <div className="graph">
      <div
        className="graph__tabs"
        role="group"
        aria-label="Ver el grafo por materia"
      >
        <button
          type="button"
          className={`graph__tab${selected === null ? " is-on" : ""}`}
          onClick={() => choose(null)}
          aria-pressed={selected === null}
        >
          <span className="graph__tab-dot graph__tab-dot--all" />
          Todas
          <span className="graph__cnt">{total}</span>
        </button>
        {chips.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`graph__tab${selected === c.id ? " is-on" : ""}`}
            onClick={() => choose(c.id)}
            aria-pressed={selected === c.id}
            style={{ "--tab-color": c.color } as CSSProperties}
          >
            <span className="graph__tab-dot" style={{ background: c.color }} />
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
        ⌘/Ctrl + scroll para zoom · elegí una materia arriba para enfocarla
      </p>
    </div>
  );
}
