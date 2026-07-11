"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { withBase } from "@/lib/content/slug";
import HeroFallback from "./HeroFallback";
import type { GNode, GLink } from "./ForceGraphInner";

// react-force-graph-2d toca `window` al importarse → SOLO cliente. next/dynamic
// con ssr:false garantiza que el módulo (y su import de la librería) nunca se
// evalúe en el prerender del static export.
const ForceGraphInner = dynamic(() => import("./ForceGraphInner"), {
  ssr: false,
});
// Variante 3D (react-force-graph-3d / three) para el hero — también solo cliente.
const ForceGraph3DInner = dynamic(() => import("./ForceGraph3DInner"), {
  ssr: false,
});

type RawNode = {
  v: string;
  t: string;
  u: string;
  s: string;
  cDark: string;
  cLight: string;
  x: number;
  y: number;
  r: number;
};
type GData = {
  nodes: RawNode[];
  links: [number, number][];
  vaults: { id: string; short: string }[];
};
type Chip = {
  id: string;
  short: string;
  count: number;
  cDark: string;
  cLight: string;
};

// Grafo interactivo de las páginas: clusters por materia, física real
// (react-force-graph). Las tabs de arriba enfocan una materia (zoomToFit al
// cluster); hover resalta el vecindario; click abre la nota; arrastrá para
// panear/mover nodos; scroll para zoom.
//
// `variant`:
//   · "full" — sección dedicada, con tabs por materia (uso en /interno u otros).
//   · "hero" — tarjeta compacta para el costado del hero: sin tabs, más chica,
//     conserva hover/click. Es el MISMO grafo real de notas, solo que acotado.
export default function GraphExplorer({
  variant = "full",
  total: totalProp,
}: {
  variant?: "full" | "hero";
  /** Conteo canónico de páginas (el del stat del hero); si falta, usa los nodos del grafo. */
  total?: number;
}) {
  const router = useRouter();
  const [data, setData] = useState<{ nodes: GNode[]; links: GLink[] } | null>(
    null,
  );
  const [chips, setChips] = useState<Chip[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [light, setLight] = useState(false);
  const [motion, setMotion] = useState(true);
  // Feature-detect de WebGL: null = sin resolver todavía; false = no hay contexto
  // (GPU vieja, aceleración off, VM). El grafo 3D solo se monta con `true`.
  const [webgl, setWebgl] = useState<boolean | null>(null);
  // Gate de visibilidad: recién montamos la escena (y disparamos el import de
  // three) cuando la tarjeta entra en viewport. Hasta entonces se ve el fallback.
  const [inView, setInView] = useState(false);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const readLight = () =>
      document.documentElement.getAttribute("data-theme") === "light";
    setLight(readLight());
    setMotion(!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    let ok = false;
    try {
      const c = document.createElement("canvas");
      ok = !!(
        window.WebGLRenderingContext &&
        (c.getContext("webgl") || c.getContext("experimental-webgl"))
      );
    } catch {
      ok = false;
    }
    setWebgl(ok);
    const onTheme = () => setLight(readLight());
    window.addEventListener("sv:themechange", onTheme);
    return () => window.removeEventListener("sv:themechange", onTheme);
  }, []);

  // La escena 3D del hero solo importa el bundle three cuando la tarjeta es
  // visible. En SSR o sin IntersectionObserver, degradá a "visible".
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    let alive = true;
    fetch(withBase("/graph.json"))
      .then((r) => r.json())
      .then((d: GData) => {
        if (!alive) return;
        const nodes: GNode[] = d.nodes.map((n) => ({
          id: n.u,
          v: n.v,
          t: n.t,
          u: n.u,
          cDark: n.cDark,
          cLight: n.cLight,
          x: n.x,
          y: n.y,
          deg: 0,
        }));
        const links: GLink[] = d.links.map(([a, b]) => ({
          source: d.nodes[a].u,
          target: d.nodes[b].u,
        }));
        d.links.forEach(([a, b]) => {
          nodes[a].deg++;
          nodes[b].deg++;
        });
        setData({ nodes, links });
        setTotal(nodes.length);

        const acc: Record<string, { n: number; cDark: string; cLight: string }> =
          {};
        d.nodes.forEach((n) => {
          const c = (acc[n.v] ||= { n: 0, cDark: n.cDark, cLight: n.cLight });
          c.n++;
        });
        setChips(
          d.vaults
            .filter((v) => acc[v.id])
            .map((v) => ({
              id: v.id,
              short: v.short,
              count: acc[v.id].n,
              cDark: acc[v.id].cDark,
              cLight: acc[v.id].cLight,
            })),
        );
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  const choose = (id: string | null) =>
    setSelected((s) => (s === id ? null : id));
  const dotColor = (c: Chip) => (light ? c.cLight : c.cDark);

  // --- variante HERO: tarjeta compacta al costado del hero de la home ---
  if (variant === "hero") {
    // La escena 3D se monta solo con WebGL disponible, sin reduced-motion y
    // cuando la tarjeta ya es visible. En cualquier otro caso se ve el panel
    // estático (HeroFallback), navegable y sin costo de three.js.
    const show3D = !!data && webgl === true && motion && inView;
    return (
      <div className="hero-graph">
        <div className="hero-graph__cap" aria-hidden="true">
          <span>
            <span className="hero-graph__live" />
            carta del wiki · voronoi 3D
          </span>
          <span className="hero-graph__count">
            {(totalProp ?? total) > 0
              ? `${totalProp ?? total} en la carta`
              : "cargando…"}
          </span>
        </div>
        <div
          ref={canvasRef}
          className="hero-graph__canvas hero-graph__canvas--3d"
          role="img"
          aria-label={
            show3D
              ? "Carta 3D interactiva del wiki: cada punto es una nota, elevada según sus enlaces; cada materia ocupa su territorio voronoi, sembrado en su nota más conectada."
              : "Mapa del wiki por materia: cada materia con su cantidad de notas, enlazada a su vault."
          }
        >
          {show3D ? (
            <ForceGraph3DInner
              nodes={data!.nodes}
              links={data!.links}
              light={light}
              selected={null}
              motion={motion}
              onOpen={(u) => router.push(u)}
            />
          ) : (
            <HeroFallback chips={chips} light={light} />
          )}
        </div>
        <p className="hero-graph__hint">
          {show3D
            ? "Cada punto es una nota (su altura: cuántos enlaces tiene) · movés el cursor y la red se enciende · arrastrá para girar · click la abre"
            : "Cada materia del wiki con su cantidad de notas · abrí una para explorar su red"}
        </p>
      </div>
    );
  }

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
          onClick={() => setSelected(null)}
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
            style={{ "--tab-color": dotColor(c) } as CSSProperties}
          >
            <span
              className="graph__tab-dot"
              style={{ background: dotColor(c) }}
            />
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
        {data && (
          <ForceGraphInner
            nodes={data.nodes}
            links={data.links}
            light={light}
            selected={selected}
            motion={motion}
            onOpen={(u) => router.push(u)}
          />
        )}
      </div>
      <p className="graph__hint">
        Cada región es una materia (sembrada en su nota más conectada) · hover
        para ver una nota · click para abrirla · elegí una materia arriba para
        resaltarla
      </p>
    </div>
  );
}
