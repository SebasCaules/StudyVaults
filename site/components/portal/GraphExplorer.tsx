"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { withBase } from "@/lib/content/slug";
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
}: {
  variant?: "full" | "hero";
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

  useEffect(() => {
    const readLight = () =>
      document.documentElement.getAttribute("data-theme") === "light";
    setLight(readLight());
    setMotion(!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);
    const onTheme = () => setLight(readLight());
    window.addEventListener("sv:themechange", onTheme);
    return () => window.removeEventListener("sv:themechange", onTheme);
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
    return (
      <div className="hero-graph">
        <div className="hero-graph__cap" aria-hidden="true">
          <span>
            <span className="hero-graph__live" />
            grafo de notas · 3D
          </span>
          <span className="hero-graph__count">
            {total > 0 ? `${total} nodos` : "cargando…"}
          </span>
        </div>
        <div
          className="hero-graph__canvas hero-graph__canvas--3d"
          role="img"
          aria-label="Grafo 3D interactivo de las notas del wiki: cada punto es una página; cada línea, un enlace entre notas. Constelaciones por materia."
        >
          {data && (
            <ForceGraph3DInner
              nodes={data.nodes}
              links={data.links}
              light={light}
              selected={null}
              motion={motion}
              onOpen={(u) => router.push(u)}
            />
          )}
        </div>
        <p className="hero-graph__hint">
          Cada punto es una nota · arrastrá para girar · click para abrirla
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
