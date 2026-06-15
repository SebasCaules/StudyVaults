"use client";

import { useMemo } from "react";
import { usePlanner } from "@/components/planner/state";
import { computeGraphLayout } from "@/lib/planner/layoutGraph";

/**
 * Mapa de correlativas. Reemplaza vis-network (planner.js renderGraph)
 * por un SVG nativo con el layout jerárquico LR de computeGraphLayout().
 */
export default function GrafoView() {
  const { dispatch } = usePlanner();

  // Layout puro y determinístico → memo sin deps (no depende del estado).
  const layout = useMemo(() => computeGraphLayout(), []);
  const { nodes, edges, width, height, nodeW, nodeH } = layout;

  // Posiciones por id para anclar las aristas a los recuadros.
  const pos = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    nodes.forEach((n) => m.set(n.id, { x: n.x, y: n.y }));
    return m;
  }, [nodes]);

  // Aristas como curvas cúbicas Bézier (LR): del medio-derecho del origen
  // al medio-izquierdo del destino, con tangentes horizontales.
  const paths = useMemo(() => {
    const out: { d: string; key: string }[] = [];
    edges.forEach((e, i) => {
      const a = pos.get(e.from);
      const b = pos.get(e.to);
      if (!a || !b) return;
      const x1 = a.x + nodeW;
      const y1 = a.y + nodeH / 2;
      const x2 = b.x;
      const y2 = b.y + nodeH / 2;
      const cx = (x1 + x2) / 2;
      out.push({
        key: `${e.from}-${e.to}-${i}`,
        d: `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`,
      });
    });
    return out;
  }, [edges, pos, nodeW, nodeH]);

  return (
    <section className="view-panel" id="panel-grafo">
      <div className="panel-head">
        <h2>Mapa de correlativas</h2>
        <p>
          Flujo de correlativas en orden cronológico. Tono pizarra:
          obligatorias. Tono latón: electivas.
        </p>
      </div>
      <div id="network" className="network">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <marker
              id="grafo-arrow"
              viewBox="0 0 8 8"
              refX="7"
              refY="4"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M0 0 L8 4 L0 8 Z" fill="var(--faint)" />
            </marker>
          </defs>

          <g className="grafo-edges">
            {paths.map((p) => (
              <path
                key={p.key}
                d={p.d}
                fill="none"
                stroke="var(--faint)"
                strokeWidth={1}
                markerEnd="url(#grafo-arrow)"
              />
            ))}
          </g>

          <g className="grafo-nodes">
            {nodes.map((n) => (
              <g
                key={n.id}
                className="grafo-node"
                style={{ cursor: "pointer" }}
                onClick={() => dispatch({ type: "OPEN_DRAWER", code: n.id })}
              >
                <rect
                  x={n.x}
                  y={n.y}
                  width={nodeW}
                  height={nodeH}
                  rx={6}
                  ry={6}
                  fill="var(--panel-2)"
                  stroke={n.ob ? "var(--primary)" : "var(--accent)"}
                  strokeWidth={1.2}
                />
                <text
                  x={n.x + nodeW / 2}
                  y={n.y + nodeH / 2 - 4}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--ink)"
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                >
                  {n.abbr}
                </text>
                <text
                  x={n.x + nodeW / 2}
                  y={n.y + nodeH / 2 + 9}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="var(--muted)"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                >
                  {n.id}
                </text>
              </g>
            ))}
          </g>
        </svg>
      </div>
    </section>
  );
}
