"use client";

// Grafo 3D de notas/wikilinks — "constelación" del hero. Estética moderna:
//  · nodos = SPRITES luminosos (punto de luz que siempre encara la cámara →
//    sin sombreado de esfera "3D viejo"); tamaño por grado, tinte por materia
//  · UnrealBloomPass sobre el composer → glow real de constelación (la firma
//    moderna que reemplaza las nubes difusas viejas)
//  · links finos y tenues (la telaraña de la constelación) + niebla de
//    profundidad (los nodos lejanos se disuelven en el fondo)
//  · etiquetas de materia en PRIMERÍSIMO plano: pills nítidas con backdrop-blur,
//    proyectadas por frame (graph2ScreenCoords) y con anti-solape 2D para que
//    nunca se pisen entre sí
//  · auto-órbita lenta de la cámara (OrbitControls), pausada al hover
// Toda la inicialización imperativa se hace en UN loop rAF auto-arrancable (no
// depende de onEngineTick/ready). SOLO cliente: import dinámico ssr:false.
import { useEffect, useMemo, useRef, useState } from "react";
import ForceGraph3D from "react-force-graph-3d";
import type { ForceGraphMethods } from "react-force-graph-3d";
import * as THREE from "three";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
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

// Anclas de clúster (esfera de Fibonacci). Radio medio → constelación cohesiva
// que llena la tarjeta a cualquier ángulo; el anti-solape 2D separa las
// etiquetas aunque los clusters queden cerca en proyección.
const R_ANCHOR = 96;
function buildAnchors(): Record<string, [number, number, number]> {
  const out: Record<string, [number, number, number]> = {};
  const N = VORDER.length;
  VORDER.forEach((id, i) => {
    const y = 1 - (i / (N - 1)) * 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const th = Math.PI * (3 - Math.sqrt(5)) * i;
    out[id] = [
      Math.cos(th) * rad * R_ANCHOR,
      y * R_ANCHOR * 0.66,
      Math.sin(th) * rad * R_ANCHOR,
    ];
  });
  return out;
}

type N3 = GNode & { vx?: number; vy?: number; vz?: number; x?: number; y?: number; z?: number };

// Textura compartida: disco luminoso con núcleo brillante y halo suave. Se tiñe
// por-nodo vía material.color (multiplica) → punto de luz del color de materia.
function makeDotTexture(): THREE.Texture {
  const s = 128;
  const c = document.createElement("canvas");
  c.width = c.height = s;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0.0, "rgba(255,255,255,1)");
  g.addColorStop(0.28, "rgba(255,255,255,0.92)");
  g.addColorStop(0.55, "rgba(255,255,255,0.35)");
  g.addColorStop(0.82, "rgba(255,255,255,0.08)");
  g.addColorStop(1.0, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const tex = new THREE.Texture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

export default function ForceGraph3DInner({
  nodes,
  links,
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
  // El canvas es un inset OSCURO en ambos temas → parámetros fijos (no dependen
  // del tema de la página). El glow/bloom se lee siempre contra el fondo oscuro.
  const wrapRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const fgRef = useRef<ForceGraphMethods<GNode, GLink> | undefined>(undefined);
  const [size, setSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const hoverRef = useRef(false);

  const anchors = useMemo(buildAnchors, []);
  const dotTex = useMemo(makeDotTexture, []);
  useEffect(() => () => dotTex.dispose(), [dotTex]);

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
  // etiquetas por frame (proyección + anti-solape 2D).
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
          anyFg.d3Force("charge").strength(-12);
          anyFg.d3Force("link")?.distance(18).strength(0.55);
          anyFg.d3ReheatSimulation?.();

          // BLOOM: el composer ya trae un RenderPass base; sumamos glow + salida
          // gestionada (color/tono correctos en three r15x). Es la firma moderna.
          const composer = anyFg.postProcessingComposer?.();
          if (composer && composer.passes.length < 2) {
            const bloom = new UnrealBloomPass(
              new THREE.Vector2(size.w || 600, size.h || 400),
              0.68, // strength
              0.5, // radius
              0.16, // threshold
            );
            composer.addPass(bloom);
            composer.addPass(new OutputPass());
          }

          // auto-órbita lenta de la cámara
          const ctr = anyFg.controls?.();
          if (ctr) {
            ctr.autoRotate = motion;
            ctr.autoRotateSpeed = 0.42;
          }
        }
        // pausar auto-rotación con el cursor sobre un nodo
        const ctr = anyFg.controls?.();
        if (ctr && motion) ctr.autoRotate = !hoverRef.current;
        // encuadrar unas cuantas veces mientras se asienta
        if (fitted < 4) {
          fitted++;
          setTimeout(() => fgRef.current?.zoomToFit?.(600, 40), fitted * 400);
        }
        // ---- etiquetas de materia: proyectar centroide vivo + anti-solape 2D ----
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
          // posición objetivo (centroide proyectado, la pill un poco por encima)
          type Lab = { el: HTMLElement; x: number; y: number; hw: number; hh: number };
          const labs: Lab[] = [];
          for (let i = 0; i < VORDER.length; i++) {
            const el = kids[i] as HTMLElement | undefined;
            if (!el) continue;
            const c = cen[VORDER[i]];
            if (!c || !c.n) {
              el.style.opacity = "0";
              continue;
            }
            const s = toScreen.call(fg, c.x / c.n, c.y / c.n, c.z / c.n) as { x: number; y: number };
            const on = !!s && s.x > -60 && s.x < w + 60 && s.y > -60 && s.y < h + 60;
            if (!on) {
              el.style.opacity = "0";
              continue;
            }
            labs.push({
              el,
              x: s.x,
              y: s.y - 30,
              hw: (el.offsetWidth || 60) / 2,
              hh: (el.offsetHeight || 22) / 2,
            });
          }
          // separación iterativa: si dos pills se solapan, se empujan por el eje
          // de menor penetración. Barato para 7 etiquetas, corre por frame.
          const PAD = 5;
          for (let it = 0; it < 8; it++) {
            for (let a = 0; a < labs.length; a++) {
              for (let b = a + 1; b < labs.length; b++) {
                const A = labs[a];
                const B = labs[b];
                const dx = B.x - A.x;
                const dy = B.y - A.y;
                const ox = A.hw + B.hw + PAD - Math.abs(dx);
                const oy = A.hh + B.hh + PAD - Math.abs(dy);
                if (ox > 0 && oy > 0) {
                  if (ox < oy) {
                    const s = ((dx < 0 ? -1 : 1) * ox) / 2;
                    A.x -= s;
                    B.x += s;
                  } else {
                    const s = ((dy < 0 ? -1 : 1) * oy) / 2;
                    A.y -= s;
                    B.y += s;
                  }
                }
              }
            }
          }
          for (const L of labs) {
            const x = Math.max(L.hw + 2, Math.min(w - L.hw - 2, L.x));
            const y = Math.max(L.hh + 2, Math.min(h - L.hh - 2, L.y));
            L.el.style.opacity = "1";
            L.el.style.transform = `translate(-50%,-50%) translate(${x}px, ${y}px)`;
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
  }, [anchors, graphData, motion, size.w, size.h]);

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
          nodeThreeObject={(n) => {
            const mat = new THREE.SpriteMaterial({
              map: dotTex,
              color: new THREE.Color(colorOf(n.v)),
              transparent: true,
              depthWrite: false,
              blending: THREE.NormalBlending,
              fog: true,
            });
            const sp = new THREE.Sprite(mat);
            const sz = 5.5 + Math.sqrt(n.deg || 0) * 1.9;
            sp.scale.set(sz, sz, 1);
            return sp;
          }}
          nodeLabel={(n) => `<div class="fg3d-tip">${escapeHtml(n.t)}</div>`}
          linkColor={() => "#6f5f8f"}
          linkOpacity={0.13}
          linkWidth={0.4}
          warmupTicks={40}
          cooldownTicks={160}
          onNodeHover={(n) => {
            hoverRef.current = !!n;
            if (wrapRef.current) wrapRef.current.style.cursor = n ? "pointer" : "grab";
          }}
          onNodeClick={(n) => n?.u && onOpen(n.u)}
        />
      )}
      {/* etiquetas de materia en primer plano (overlay, proyectado por frame) */}
      <div className="fg3d-labels" ref={overlayRef} aria-hidden="true">
        {VORDER.map((v) => (
          <div key={v} className="fg3d-cluster" style={{ ["--c" as string]: colorOf(v) }}>
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
