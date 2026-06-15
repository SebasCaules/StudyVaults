"use client";

import { useEffect, useRef } from "react";
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

// Grafo real de las páginas del wiki (datos en /graph.json, layout precomputado).
// Canvas 2D: dibuja y micro-anima. Pausa fuera de viewport y con pestaña oculta;
// respeta prefers-reduced-motion (frame estático). Color de nodo por tema.
export default function HeroGraph() {
  const cvRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();

  useEffect(() => {
    const cv = cvRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    let data: GData | null = null;
    let adj: number[][] = [];
    let raf = 0;
    let t = 0;
    let hover = -1;
    let focusV = 0;
    let hidden = false;
    let inView = true;
    const cam = { x: 500, y: 500, z: 1 };

    const isLight = () =>
      document.documentElement.getAttribute("data-theme") === "light";
    let light = isLight();
    const themeEdge = () =>
      (light = isLight())
        ? "rgba(36,18,8,0.13)"
        : "rgba(255,255,255,0.10)";
    let edge = themeEdge();
    const ink = () =>
      getComputedStyle(document.documentElement).getPropertyValue("--ink-strong").trim() ||
      (light ? "#241208" : "#fff");
    const nodeCol = (n: GNode) => (light ? n.cLight : n.cDark);

    const resize = () => {
      const w = cv.clientWidth,
        h = cv.clientHeight;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const toS = (x: number, y: number) => {
      const w = cv.clientWidth,
        h = cv.clientHeight,
        s = (Math.min(w, h) / 1000) * cam.z;
      return [w / 2 + (x - cam.x) * s, h / 2 + (y - cam.y) * s] as const;
    };
    const draw = () => {
      if (!data) return;
      const w = cv.clientWidth,
        h = cv.clientHeight;
      ctx.clearRect(0, 0, w, h);
      const hi = hover >= 0 ? new Set(adj[hover].concat(hover)) : null;
      const N = data.nodes;
      const focusId = data.vaults[focusV]?.id;
      ctx.lineWidth = 0.6;
      for (const [a, b] of data.links) {
        const both = hi ? hi.has(a) && hi.has(b) : false;
        const lit = !hi && !reduce && N[a].v === focusId;
        ctx.globalAlpha = hi ? (both ? 0.55 : 0.04) : lit ? 0.22 : 0.08;
        ctx.strokeStyle = both ? nodeCol(N[a]) : edge;
        const [x1, y1] = toS(N[a].x, N[a].y),
          [x2, y2] = toS(N[b].x, N[b].y);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
      for (let i = 0; i < N.length; i++) {
        const n = N[i];
        const [x, y] = toS(n.x, n.y);
        ctx.globalAlpha = hi
          ? hi.has(i)
            ? 1
            : 0.15
          : !reduce && n.v === focusId
            ? 1
            : 0.85;
        ctx.fillStyle = nodeCol(n);
        ctx.beginPath();
        ctx.arc(x, y, Math.max(1.3, n.r * cam.z * 0.55), 0, 6.283);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      if (hover >= 0) {
        const n = N[hover],
          [x, y] = toS(n.x, n.y);
        ctx.font = "600 13px Newsreader, Georgia, serif";
        const tw = ctx.measureText(n.t).width;
        const bx = Math.min(Math.max(x + 8, 4), w - tw - 12);
        const by = Math.min(Math.max(y - 8, 16), h - 8);
        ctx.fillStyle = ink();
        ctx.fillText(n.t, bx, by);
      }
    };

    const running = () => !reduce && !hidden && inView;
    const frame = (ts: number) => {
      if (!running()) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
      if (ts - t < 33) return;
      t = ts;
      if (data) focusV = Math.floor(ts / 6000) % data.vaults.length;
      draw();
    };
    const ensure = () => {
      if (!raf && running()) raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const pick = (mx: number, my: number) => {
      if (!data) return -1;
      let best = -1,
        bd = 120;
      for (let i = 0; i < data.nodes.length; i++) {
        const [x, y] = toS(data.nodes[i].x, data.nodes[i].y);
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
        resize();
        draw();
        ensure();
      })
      .catch(() => {});

    cv.onpointermove = (e) => {
      const r = cv.getBoundingClientRect();
      hover = pick(e.clientX - r.left, e.clientY - r.top);
      cv.style.cursor = hover >= 0 ? "pointer" : "default";
      if (!running()) draw();
    };
    cv.onpointerleave = () => {
      hover = -1;
      if (!running()) draw();
    };
    cv.onclick = () => {
      if (hover >= 0 && data) router.push(data.nodes[hover].u);
    };
    cv.onwheel = (e) => {
      // No atrapar el scroll de la página: zoom solo con ctrl/⌘.
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      cam.z = Math.min(3, Math.max(0.6, cam.z * (e.deltaY < 0 ? 1.1 : 0.9)));
      if (!running()) draw();
    };

    const onR = () => {
      resize();
      draw();
    };
    const onTheme = () => {
      edge = themeEdge();
      draw();
    };
    const onVis = () => {
      hidden = document.hidden;
      if (hidden) stop();
      else ensure();
    };
    const io = new IntersectionObserver(
      (es) => {
        inView = es[0]?.isIntersecting ?? true;
        if (!inView) stop();
        else ensure();
      },
      { threshold: 0.01 },
    );
    io.observe(cv);
    addEventListener("resize", onR);
    window.addEventListener("sv:themechange", onTheme);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      stop();
      io.disconnect();
      removeEventListener("resize", onR);
      window.removeEventListener("sv:themechange", onTheme);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [router]);

  return (
    <div
      className="hero-graph"
      role="img"
      aria-label="Grafo de las páginas del wiki, agrupadas por materia. Cada punto es una nota; cada línea, un enlace."
    >
      <canvas ref={cvRef} />
    </div>
  );
}
