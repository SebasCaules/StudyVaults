"use client";

// Grafo 3D de notas/wikilinks — "constelación" del hero. Port de
// _design-review/graph-3d-notas.html a react-force-graph-3d:
//  · nodos PLANOS (iluminación aplanada → sin brillo "3D viejo"), en dark y light
//  · clusters juntos por materia (fuerza suave hacia anclas de Fibonacci)
//  · nube difusa + etiqueta con el nombre de la materia por constelación
//    (overlay DOM proyectado con graph2ScreenCoords → crisp en ambos temas)
//  · auto-órbita de la cámara (OrbitControls), pausada al hover
// Toda la inicialización imperativa se hace en UN loop rAF auto-arrancable (no
// depende de onEngineTick/ready). SOLO cliente: import dinámico ssr:false.
import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import type { ForceGraphMethods } from "react-force-graph-3d";
import type * as THREETYPES from "three";
import type { GNode, GLink } from "./ForceGraphInner";

const VIVID: Record<string, string> = {
  derecho: "#E06B4F",
  economia: "#E6B23C",
  paw: "#5FC486",
  proba: "#37C6B6",
  mna: "#4FA1F0",
  inge2: "#9A88F2",
  sds: "#E67CB2",
};
const NAMES: Record<string, string> = {
  mna: "MNA",
  derecho: "Derecho",
  economia: "Economía",
  proba: "Proba",
  paw: "PAW",
  sds: "SDS",
  inge2: "Inge2",
};
const VORDER = ["mna", "derecho", "economia", "proba", "paw", "sds", "inge2"];
const colorOf = (v: string) => VIVID[v] ?? "#8fb3e0";

// Anclas de clúster (esfera de Fibonacci, radio corto → clusters juntos).
const R_ANCHOR = 80;
function buildAnchors(): Record<string, [number, number, number]> {
  const out: Record<string, [number, number, number]> = {};
  const N = VORDER.length;
  VORDER.forEach((id, i) => {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = Math.PI * (3 - Math.sqrt(5)) * i;
    out[id] = [
      Math.cos(th) * rad * R_ANCHOR,
      y * R_ANCHOR * 0.62,
      Math.sin(th) * rad * R_ANCHOR,
    ];
  });
  return out;
}

type N3 = GNode & { vx?: number; vy?: number; vz?: number; x?: number; y?: number; z?: number };

export default function ForceGraph3DInner({
  nodes,
  links,
  light,
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
  const wrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods<GNode, GLink> | undefined>(undefined);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const hoverRef = useRef(false);

  const anchors = useMemo(buildAnchors, []);
  const graphData = useMemo(
    () => ({ nodes: nodes.map((n) => ({ ...n })) as N3[], links: links.map((l) => ({ ...l })) }),
    [nodes, links],
  );

  // medir el contenedor (react-force-graph-3d necesita width/height explícitos)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    measure();
    return () => ro.disconnect();
  }, []);

  // loop único: (1) setup imperativo una vez que fg está listo, (2) posición de
  // etiquetas/nubes por frame vía graph2ScreenCoords.
  useEffect(() => {
    let raf = 0;
    let stopped = false;
    let setup = false;
    let fitted = 0;
    const loop = () => {
      if (stopped) return;
      const fg = fgRef.current;
      const overlay = overlayRef.current;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyFg = fg as any;
      if (fg && overlay && anyFg.d3Force && anyFg.d3Force("charge")) {
        if (!setup) {
          setup = true;
          // fuerza de clúster hacia el ancla de cada materia
          let nds: N3[] = [];
          const cluster = (alpha: number) => {
            const S = 0.1 * alpha;
            for (const n of nds) {
              const a = anchors[n.v];
              if (!a || n.x === undefined) continue;
              n.vx = (n.vx ?? 0) + (a[0] - (n.x ?? 0)) * S;
              n.vy = (n.vy ?? 0) + (a[1] - (n.y ?? 0)) * S;
              n.vz = (n.vz ?? 0) + (a[2] - (n.z ?? 0)) * S;
            }
          };
          (cluster as unknown as { initialize: (ns: N3[]) => void }).initialize = (ns) => {
            nds = ns;
          };
          anyFg.d3Force("cluster", cluster);
          anyFg.d3Force("charge").strength(-10);
          anyFg.d3Force("link")?.distance(16).strength(0.6);
          anyFg.d3ReheatSimulation?.();
          // iluminación PLANA (nodos como puntos, sin brillo "3D viejo").
          fg.scene().traverse((o: THREETYPES.Object3D) => {
            const l = o as THREETYPES.Light;
            if (l.isLight)
              l.intensity = (l as THREETYPES.AmbientLight).isAmbientLight ? 3.1 : 0.12;
          });
          // auto-órbita de la cámara
          const ctr = anyFg.controls?.();
          if (ctr) {
            ctr.autoRotate = motion;
            ctr.autoRotateSpeed = 0.5;
          }
        }
        // pausar auto-rotación con el cursor sobre un nodo
        const ctr = anyFg.controls?.();
        if (ctr && motion) ctr.autoRotate = !hoverRef.current;
        // encuadrar unas cuantas veces mientras se asienta
        if (fitted < 4) {
          fitted++;
          setTimeout(() => fgRef.current?.zoomToFit?.(500, 24), fitted * 400);
        }
        // posicionar etiquetas/nubes en el centroide vivo de cada materia
        const toScreen = anyFg.graph2ScreenCoords;
        if (typeof toScreen === "function") {
          const w = overlay.clientWidth;
          const h = overlay.clientHeight;
          const kids = overlay.children;
          const cen: Record<string, { x: number; y: number; z: number; n: number }> = {};
          for (const nd of graphData.nodes) {
            if (nd.x === undefined) continue;
            const c = (cen[nd.v] ||= { x: 0, y: 0, z: 0, n: 0 });
            c.x += nd.x;
            c.y += nd.y ?? 0;
            c.z += nd.z ?? 0;
            c.n++;
          }
          for (let i = 0; i < VORDER.length; i++) {
            const el = kids[i] as HTMLElement | undefined;
            const c = cen[VORDER[i]];
            if (!el) continue;
            if (!c || !c.n) {
              el.style.opacity = "0";
              continue;
            }
            const s = toScreen.call(fg, c.x / c.n, c.y / c.n, c.z / c.n) as {
              x: number;
              y: number;
            };
            const on = !!s && s.x > -80 && s.x < w + 80 && s.y > -80 && s.y < h + 80;
            el.style.opacity = on ? "1" : "0";
            if (on) el.style.transform = `translate(-50%,-50%) translate(${s.x}px, ${s.y}px)`;
          }
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
    };
  }, [anchors, graphData, motion]);

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0 }}>
      {size.w > 0 && (
        <ForceGraph3D<GNode, GLink>
          ref={fgRef}
          width={size.w}
          height={size.h}
          graphData={graphData}
          controlType="orbit"
          backgroundColor="rgba(0,0,0,0)"
          showNavInfo={false}
          enableNodeDrag={false}
          nodeRelSize={2.3}
          nodeVal={(n) => 1 + (n.deg || 0)}
          nodeColor={(n) => colorOf(n.v)}
          nodeOpacity={1}
          nodeResolution={12}
          nodeLabel={(n) => `<div class="fg3d-tip">${escapeHtml(n.t)}</div>`}
          linkColor={() => (light ? "#c3b6a6" : "#3c4b6b")}
          linkOpacity={light ? 0.5 : 0.34}
          linkWidth={0}
          warmupTicks={40}
          cooldownTicks={160}
          onNodeHover={(n) => {
            hoverRef.current = !!n;
            if (wrapRef.current)
              wrapRef.current.style.cursor = n ? "pointer" : "grab";
          }}
          onNodeClick={(n) => n?.u && onOpen(n.u)}
        />
      )}
      {/* nubes difusas + etiquetas por materia (overlay, proyectado por frame) */}
      <div className="fg3d-labels" ref={overlayRef} aria-hidden="true">
        {VORDER.map((v) => (
          <div
            key={v}
            className="fg3d-cluster"
            style={{ ["--c" as string]: colorOf(v) }}
          >
            <span className="fg3d-neb" />
            <span className="fg3d-lab">{NAMES[v] ?? v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function escapeHtml(s: string): string {
  return String(s ?? "").replace(
    /[&<>"]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!,
  );
}
