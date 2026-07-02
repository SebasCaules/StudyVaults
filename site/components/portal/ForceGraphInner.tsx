"use client";

// Mapa de temas acotado, estilo Voronoi + red neuronal, con react-force-graph-2d.
// Se carga SOLO en cliente (next/dynamic ssr:false desde GraphExplorer).
//   · RECINTO fijo con borde: la cámara está clavada al box (sin pan/zoom); una
//     fuerza de "bound" clampa los nodos adentro. Nada de canvas infinito.
//   · REGIONES tipo Voronoi: por cada tema, una nube difuminada del color del
//     tema, sembrada en su nodo MÁS FUERTE (más conexiones). Se dibujan detrás.
//   · NODOS: color de tema, tamaño/glow por grado (los hubs mandan); la semilla
//     de cada tema, resaltada. Aura radial que respira + pulsos sinápticos.
import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import type { ForceGraphMethods } from "react-force-graph-2d";
import { forceCollide, forceX, forceY } from "d3-force";

export type GNode = {
  id: string;
  v: string;
  t: string;
  u: string;
  deg: number;
  cDark: string;
  cLight: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
};
export type GLink = { source: string; target: string };

const TAU = Math.PI * 2;
// tamaño por grado (ponderancia por conexiones): los hubs, más grandes.
const NODE_R = (n: GNode) => 3 + Math.sqrt(n.deg) * 1.7;

const rgbOf = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16),
];
const rgbCss = (c: [number, number, number]) => `rgb(${c[0]},${c[1]},${c[2]})`;
const rgbaCss = (c: [number, number, number], a: number) =>
  `rgba(${c[0]},${c[1]},${c[2]},${a})`;
const idOf = (v: string | { id?: string }) =>
  typeof v === "object" ? v.id ?? "" : v;
const hash = (s: string) => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h) % 100;
};

// rect redondeado en coords de grafo (recinto y chip de etiqueta)
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export default function ForceGraphInner({
  nodes,
  links,
  light,
  selected,
  motion,
  onOpen,
}: {
  nodes: GNode[];
  links: GLink[];
  light: boolean;
  selected: string | null;
  motion: boolean;
  onOpen: (u: string) => void;
}) {
  const fgRef = useRef<ForceGraphMethods<GNode, GLink> | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 0, h: 0 });

  const hoverRef = useRef<string | null>(null);
  const neighRef = useRef<Set<string>>(new Set());
  const selRef = useRef<string | null>(selected);
  selRef.current = selected;
  const lightRef = useRef(light);
  lightRef.current = light;
  const timeRef = useRef(0);
  const hwRef = useRef(700); // semiancho del recinto (se ajusta al aspecto)

  const nodesById = useMemo(() => {
    const m = new Map<string, GNode>();
    nodes.forEach((n) => m.set(n.id, n));
    return m;
  }, [nodes]);

  // estilo por nodo: color de TEMA (cDark/cLight) + intensidad/tamaño por grado.
  const nodeStyle = useMemo(() => {
    let maxDeg = 1;
    nodes.forEach((n) => {
      if (n.deg > maxDeg) maxDeg = n.deg;
    });
    type St = {
      t: number;
      dark: [number, number, number];
      light: [number, number, number];
      phase: number;
      speed: number;
    };
    const m = new Map<string, St>();
    nodes.forEach((n) => {
      m.set(n.id, {
        t: Math.min(1, Math.sqrt(n.deg / maxDeg)),
        dark: rgbOf(n.cDark),
        light: rgbOf(n.cLight),
        phase: (hash(n.id) / 100) * TAU,
        speed: 0.5 + (hash("s" + n.id) / 100),
      });
    });
    return m;
  }, [nodes]);

  // semilla de región = nodo con MÁS conexiones por tema; + nodos por tema.
  const { seeds, seedIds, nodesByVault } = useMemo(() => {
    const byV = new Map<string, GNode[]>();
    nodes.forEach((n) => {
      let a = byV.get(n.v);
      if (!a) {
        a = [];
        byV.set(n.v, a);
      }
      a.push(n);
    });
    const seeds: {
      v: string;
      node: GNode;
      dark: [number, number, number];
      light: [number, number, number];
    }[] = [];
    const seedIds = new Set<string>();
    byV.forEach((arr, v) => {
      let best = arr[0];
      for (const n of arr) if (n.deg > best.deg) best = n;
      seeds.push({
        v,
        node: best,
        dark: rgbOf(best.cDark),
        light: rgbOf(best.cLight),
      });
      seedIds.add(best.id);
    });
    return { seeds, seedIds, nodesByVault: byV };
  }, [nodes]);

  const adj = useMemo(() => {
    const m = new Map<string, Set<string>>();
    nodes.forEach((n) => m.set(n.id, new Set()));
    links.forEach((l) => {
      const s = idOf(l.source);
      const t = idOf(l.target);
      m.get(s)?.add(t);
      m.get(t)?.add(s);
    });
    return m;
  }, [nodes, links]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setDims({ w: el.clientWidth, h: el.clientHeight });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // mantener el semiancho del recinto según el aspecto (la fuerza `bound` lo usa)
  // encuadre con zoomToFit: encuadra el bbox REAL de nodos → centra en el
  // contenido y lo hace llenar el canvas (arregla el "mitad vacía / descentrado").
  const frame = (ms = 400) => {
    const fg = fgRef.current;
    const el = wrapRef.current;
    const dbg = window as unknown as { __frame?: unknown };
    if (!fg || !el || !el.clientWidth) {
      dbg.__frame = "no-fg-el";
      return;
    }
    let bbox: { x: [number, number]; y: [number, number] } | undefined;
    try {
      bbox = fg.getGraphBbox();
    } catch (e) {
      dbg.__frame = "throw:" + String(e).slice(0, 40);
      return;
    }
    if (!bbox || !Number.isFinite(bbox.x[0])) {
      dbg.__frame = "badbbox";
      return;
    }
    const bw = Math.max(1, bbox.x[1] - bbox.x[0]);
    const bh = Math.max(1, bbox.y[1] - bbox.y[0]);
    const cx = (bbox.x[0] + bbox.x[1]) / 2;
    const cy = (bbox.y[0] + bbox.y[1]) / 2;
    const zoom = Math.min(el.clientWidth / bw, el.clientHeight / bh) * 0.95;
    fg.centerAt(cx, cy, ms);
    fg.zoom(zoom, ms);
    dbg.__frame = {
      bw: Math.round(bw),
      bh: Math.round(bh),
      cx: Math.round(cx),
      cy: Math.round(cy),
      zoom: +zoom.toFixed(3),
      curZoom: +fg.zoom().toFixed(3),
    };
  };
  useEffect(() => {
    if (dims.w > 0) frame(0);
    const timers = [200, 700, 1500, 2800].map((d) =>
      setTimeout(() => frame(400), d),
    );
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dims.w, dims.h]);

  // fuerzas: charge que ESPARCE para llenar el recinto + leve centro (denso al
  // medio, sin hueco) + colisión + clamp de recinto (bordes fijos).
  useEffect(() => {
    const fg = fgRef.current;
    if (!fg) return;
    const charge = fg.d3Force("charge");
    if (charge)
      (charge as unknown as { strength: (n: number) => { distanceMax: (n: number) => void } })
        .strength(-26)
        .distanceMax(130);
    const link = fg.d3Force("link");
    if (link)
      (link as unknown as { distance: (n: number) => { strength: (n: number) => void } })
        .distance(18)
        .strength(0.32);
    fg.d3Force(
      "collide",
      forceCollide<GNode>((n) => NODE_R(n) + 0.6).strength(0.85) as unknown as never,
    );
    // Gravedad al centro FUERTE y simétrica → bola cohesiva y compacta, SIN
    // outliers que agranden el bbox (eso descentraba y achicaba todo).
    fg.d3Force("x", forceX(0).strength(0.09) as unknown as never);
    fg.d3Force("y", forceY(0).strength(0.09) as unknown as never);
    fg.d3ReheatSimulation();
  }, [nodes, links]);

  const nodeAlpha = (n: GNode) => {
    if (hoverRef.current) return neighRef.current.has(n.id) ? 1 : 0.12;
    const sel = selRef.current;
    if (sel) return n.v === sel ? 1 : 0.1;
    return 1;
  };

  const linkColor = (l: GLink) => {
    const s = idOf(l.source);
    const t = idOf(l.target);
    const faint = lightRef.current
      ? "rgba(36,18,8,0.10)"
      : "rgba(210,225,255,0.07)";
    if (hoverRef.current) {
      return neighRef.current.has(s) && neighRef.current.has(t)
        ? lightRef.current
          ? "rgba(36,18,8,0.42)"
          : "rgba(220,232,255,0.4)"
        : "rgba(0,0,0,0)";
    }
    const sel = selRef.current;
    if (sel)
      return nodesById.get(s)?.v === sel && nodesById.get(t)?.v === sel
        ? faint
        : "rgba(0,0,0,0)";
    return faint;
  };

  return (
    <div ref={wrapRef} style={{ width: "100%", height: "100%" }}>
      {dims.w > 0 && dims.h > 0 && (
        <ForceGraph2D<GNode, GLink>
          ref={fgRef}
          width={dims.w}
          height={dims.h}
          graphData={{ nodes, links }}
          backgroundColor="rgba(0,0,0,0)"
          minZoom={0.05}
          maxZoom={60}
          autoPauseRedraw={false}
          onRenderFramePre={(ctx) => {
            timeRef.current = performance.now() / 1000;
            // --- REGIONES tipo Voronoi: nubes difuminadas por tema (fondo) ---
            const sel = selRef.current;
            for (const s of seeds) {
              const sx = s.node.x;
              const sy = s.node.y;
              if (sx == null || sy == null) continue;
              const arr = nodesByVault.get(s.v);
              let sum = 0;
              let cnt = 0;
              let mx = 0;
              if (arr)
                for (const n of arr) {
                  if (n.x == null || n.y == null) continue;
                  const d = Math.hypot(n.x - sx, n.y - sy);
                  sum += d;
                  cnt++;
                  if (d > mx) mx = d;
                }
              const R = Math.max(80, (cnt ? sum / cnt : 0) * 1.7 + mx * 0.25);
              const col = lightRef.current ? s.light : s.dark;
              const w = sel ? (s.v === sel ? 1 : 0.18) : 1;
              const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, R);
              grad.addColorStop(0, rgbaCss(col, (lightRef.current ? 0.15 : 0.24) * w));
              grad.addColorStop(0.5, rgbaCss(col, (lightRef.current ? 0.07 : 0.11) * w));
              grad.addColorStop(1, rgbaCss(col, 0));
              ctx.fillStyle = grad;
              ctx.beginPath();
              ctx.arc(sx, sy, R, 0, TAU);
              ctx.fill();
            }
          }}
          onRenderFramePost={(ctx, globalScale) => {
            const k = 1 / globalScale;
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = 1;
            // --- etiqueta de hover en primer plano (ninguna arista la tapa) ---
            const id = hoverRef.current;
            if (!id) return;
            const n = nodesById.get(id);
            if (!n || n.x == null || n.y == null) return;
            const fs = 13 * k;
            ctx.font = `600 ${fs}px Newsreader, Georgia, serif`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            const text = n.t;
            const tw = ctx.measureText(text).width;
            const padX = 9 * k;
            const padY = 6 * k;
            const bw = tw + padX * 2;
            const bh = fs + padY * 2;
            const byTop = n.y - NODE_R(n) - 8 * k - bh;
            const bx = n.x - bw / 2;
            roundRectPath(ctx, bx, byTop, bw, bh, 6 * k);
            ctx.fillStyle = lightRef.current
              ? "rgba(255,255,255,0.95)"
              : "rgba(14,10,7,0.94)";
            ctx.fill();
            ctx.lineWidth = 1 * k;
            ctx.strokeStyle = lightRef.current
              ? "rgba(36,18,8,0.18)"
              : "rgba(255,255,255,0.18)";
            ctx.stroke();
            ctx.fillStyle = lightRef.current ? "#241208" : "#ffffff";
            ctx.fillText(text, n.x, byTop + bh / 2);
          }}
          nodeId="id"
          nodeLabel={() => ""}
          nodeCanvasObject={(node, ctx) => {
            const n = node as GNode;
            const st = nodeStyle.get(n.id);
            const rgb: [number, number, number] = st
              ? lightRef.current
                ? st.light
                : st.dark
              : [136, 170, 255];
            const tt = st?.t ?? 0;
            const isSeed = seedIds.has(n.id);
            const r = NODE_R(n) * (isSeed ? 1.55 : 1);
            const a = nodeAlpha(n);
            const x = node.x ?? 0;
            const y = node.y ?? 0;
            const pulse = st
              ? 0.5 + 0.5 * Math.sin(timeRef.current * st.speed + st.phase)
              : 0.5;
            const glowR = r * (2 + 2.6 * tt) * (0.8 + 0.5 * pulse) * (isSeed ? 1.3 : 1);
            const glowA =
              a *
              (lightRef.current ? 0.16 : 0.26) *
              (0.45 + 0.9 * tt) *
              (0.4 + 0.75 * pulse) *
              (isSeed ? 1.4 : 1);
            // glow BARATO: 2 discos aditivos que respiran (sin gradiente por
            // nodo → mucho más liviano que createRadialGradient por frame).
            ctx.globalCompositeOperation = lightRef.current
              ? "source-over"
              : "lighter";
            ctx.fillStyle = rgbCss(rgb);
            ctx.globalAlpha = glowA * 0.5;
            ctx.beginPath();
            ctx.arc(x, y, glowR, 0, TAU);
            ctx.fill();
            ctx.globalAlpha = glowA;
            ctx.beginPath();
            ctx.arc(x, y, glowR * 0.55, 0, TAU);
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
            ctx.globalAlpha = a * (0.82 + 0.18 * pulse);
            ctx.fillStyle = rgbCss(rgb);
            ctx.beginPath();
            ctx.arc(x, y, r, 0, TAU);
            ctx.fill();
            if (isSeed) {
              // aro fino en la semilla (la "capital" del tema)
              ctx.globalAlpha = a * 0.9;
              ctx.lineWidth = Math.max(0.6, r * 0.14);
              ctx.strokeStyle = lightRef.current
                ? "rgba(20,12,7,0.55)"
                : "rgba(255,255,255,0.75)";
              ctx.beginPath();
              ctx.arc(x, y, r + r * 0.35, 0, TAU);
              ctx.stroke();
            }
            ctx.globalAlpha = 1;
          }}
          nodePointerAreaPaint={(node, color, ctx) => {
            const n = node as GNode;
            const r = NODE_R(n) * (seedIds.has(n.id) ? 1.55 : 1);
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(node.x ?? 0, node.y ?? 0, r + 2, 0, TAU);
            ctx.fill();
          }}
          linkColor={linkColor as never}
          linkWidth={0.6}
          linkDirectionalParticles={(l) =>
            hash(idOf((l as GLink).source) + idOf((l as GLink).target)) < 5
              ? 1
              : 0
          }
          linkDirectionalParticleWidth={1.6}
          linkDirectionalParticleSpeed={0.005}
          linkDirectionalParticleColor={(l) => {
            const st = nodeStyle.get(idOf((l as GLink).source));
            return st ? rgbCss(lightRef.current ? st.light : st.dark) : "#8ab4ff";
          }}
          d3VelocityDecay={0.4}
          warmupTicks={motion ? 45 : 160}
          cooldownTicks={motion ? 220 : 0}
          onEngineStop={() => frame(400)}
          onNodeHover={(n) => {
            const node = n as GNode | null;
            hoverRef.current = node ? node.id : null;
            const set = new Set<string>();
            if (node) {
              set.add(node.id);
              adj.get(node.id)?.forEach((x) => set.add(x));
            }
            neighRef.current = set;
            if (wrapRef.current)
              wrapRef.current.style.cursor = node ? "pointer" : "default";
          }}
          onNodeClick={(n) => onOpen((n as GNode).u)}
        />
      )}
    </div>
  );
}
