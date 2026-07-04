"use client";

import "../grafo.css";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { usePlanner } from "@/components/planner/state";
import { computeGraphLayout } from "@/lib/planner/layoutGraph";
import { byId } from "@/lib/planner/model";

/**
 * Mapa de correlativas. Reemplaza vis-network (planner.js renderGraph) por un
 * SVG nativo con layout jerárquico LR (computeGraphLayout) dentro de un viewport
 * con pan y zoom hechos a mano — sin librería de grafos.
 *
 * El DAG (95 materias, 122 aristas) es más grande que cualquier caja fija, así
 * que en vez de recortarse: arrastrar panea, la rueda / los botones +/− hacen
 * zoom, y "Ajustar" encuadra todo. La transformación se aplica imperativamente
 * sobre el grupo <g> (translate+scale) — no se re-layoutea por frame.
 *
 * Static-export safe: todo acceso a window / ResizeObserver ocurre dentro de
 * useEffect (cliente, post-hidratación). El componente ya es isla `"use client"`.
 */

const MIN_SCALE = 0.3; // piso del zoom manual (rueda / botones)
const MAX_SCALE = 2.4;
const FIT_PAD = 40; // padding del fit() en píxeles de pantalla
// El fit() puede bajar por debajo de MIN_SCALE: así SIEMPRE encuadra todo el
// grafo dentro del viewport, aunque el DAG sea más grande que la caja. Es la
// garantía de "cero overflow": el contenido nunca queda más grande que la vista.
const FIT_MIN_SCALE = 0.06;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

export default function GrafoView() {
  const { state, dispatch } = usePlanner();
  const approved = state.approved;

  // Layout puro y determinístico → memo sin deps (no depende del estado).
  const layout = useMemo(() => computeGraphLayout(), []);
  const { nodes, edges, columns, width, height, nodeW, nodeH, headerH } =
    layout;

  // Posiciones por id para anclar las aristas a los recuadros.
  const pos = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    nodes.forEach((n) => m.set(n.id, { x: n.x, y: n.y }));
    return m;
  }, [nodes]);

  // Conjunto de ids presentes en el grafo (para resaltar sólo lo que existe).
  const nodeIds = useMemo(() => new Set(nodes.map((n) => n.id)), [nodes]);

  // Adyacencias directa (habilita) e inversa (requiere) para la cadena.
  const { adj, radj } = useMemo(() => {
    const a = new Map<string, string[]>();
    const r = new Map<string, string[]>();
    edges.forEach((e) => {
      (a.get(e.from) ?? a.set(e.from, []).get(e.from)!).push(e.to);
      (r.get(e.to) ?? r.set(e.to, []).get(e.to)!).push(e.from);
    });
    return { adj: a, radj: r };
  }, [edges]);

  // Cadena completa de una materia: ella + todos sus prerrequisitos (aguas
  // arriba) + todo lo que habilita (aguas abajo).
  const chainOf = useCallback(
    (id: string) => {
      const set = new Set<string>([id]);
      const up = (x: string) => {
        (radj.get(x) || []).forEach((p) => {
          if (!set.has(p)) {
            set.add(p);
            up(p);
          }
        });
      };
      const down = (x: string) => {
        (adj.get(x) || []).forEach((d) => {
          if (!set.has(d)) {
            set.add(d);
            down(d);
          }
        });
      };
      up(id);
      down(id);
      return set;
    },
    [adj, radj],
  );

  // Aristas como curvas cúbicas Bézier (LR): del medio-derecho del origen al
  // medio-izquierdo del destino, con tangentes horizontales.
  const paths = useMemo(() => {
    const out: { from: string; to: string; d: string; key: string }[] = [];
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
        from: e.from,
        to: e.to,
        key: `${e.from}-${e.to}-${i}`,
        d: `M ${x1} ${y1} C ${cx} ${y1} ${cx} ${y2} ${x2} ${y2}`,
      });
    });
    return out;
  }, [edges, pos, nodeW, nodeH]);

  // Extensión vertical ocupada por los nodos → posiciona las guías de columna y
  // las etiquetas de cuatrimestre sin depender de las constantes internas del layout.
  const bounds = useMemo(() => {
    let top = Infinity;
    let bottom = -Infinity;
    nodes.forEach((n) => {
      if (n.y < top) top = n.y;
      if (n.y + nodeH > bottom) bottom = n.y + nodeH;
    });
    if (!Number.isFinite(top)) {
      top = 0;
      bottom = 0;
    }
    return { top, bottom };
  }, [nodes, nodeH]);

  // ---------- refs de DOM + estado de la transformación (imperativo) ----------
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const stageRef = useRef<SVGGElement | null>(null);
  const readoutRef = useRef<HTMLDivElement | null>(null);

  // scale/tx/ty en un ref → panear/zoomear NO re-renderiza React (sólo muta el
  // atributo transform del grupo). userInteracted evita que un resize re-encuadre
  // luego de que el usuario tomó control.
  const tf = useRef({ scale: 1, tx: 0, ty: 0 });
  const userInteracted = useRef(false);
  const [ready, setReady] = useState(false);

  const applyTransform = useCallback(() => {
    const g = stageRef.current;
    if (g) {
      const { tx, ty, scale } = tf.current;
      g.setAttribute("transform", `translate(${tx} ${ty}) scale(${scale})`);
    }
    const r = readoutRef.current;
    if (r) r.textContent = `${Math.round(tf.current.scale * 100)}%`;
  }, []);

  const fit = useCallback(() => {
    const vp = viewportRef.current;
    if (!vp || !width || !height) return;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    if (!vw || !vh) return;
    // ancho/alto disponibles descontando el padding (nunca negativos)
    const availW = Math.max(1, vw - 2 * FIT_PAD);
    const availH = Math.max(1, vh - 2 * FIT_PAD);
    // sin clamp hacia arriba a MIN_SCALE: el fit prioriza CONTENER todo.
    const s = clamp(
      Math.min(availW / width, availH / height),
      FIT_MIN_SCALE,
      MAX_SCALE,
    );
    tf.current.scale = s;
    // centrado exacto → el contenido queda simétrico dentro del viewport.
    tf.current.tx = (vw - width * s) / 2;
    tf.current.ty = (vh - height * s) / 2;
    applyTransform();
  }, [width, height, applyTransform]);

  // zoom anclado a un punto (px,py) en coordenadas del svg (1 unidad = 1px,
  // sin viewBox), manteniendo ese punto fijo en pantalla.
  const zoomAt = useCallback(
    (px: number, py: number, factor: number) => {
      const t = tf.current;
      const ns = clamp(t.scale * factor, MIN_SCALE, MAX_SCALE);
      const k = ns / t.scale;
      t.tx = px - (px - t.tx) * k;
      t.ty = py - (py - t.ty) * k;
      t.scale = ns;
      applyTransform();
    },
    [applyTransform],
  );

  const zoomCenter = useCallback(
    (factor: number) => {
      const vp = viewportRef.current;
      if (!vp) return;
      userInteracted.current = true;
      zoomAt(vp.clientWidth / 2, vp.clientHeight / 2, factor);
    },
    [zoomAt],
  );

  const onFit = useCallback(() => {
    userInteracted.current = false;
    fit();
  }, [fit]);

  // Encuadre inicial + refit ante resize (sólo si el usuario no tomó control).
  // Todo dentro de useEffect → nunca corre en SSR (static-export safe).
  useEffect(() => {
    // Doble rAF: el primero deja al layout medir el viewport; el segundo encuadra
    // ya con el tamaño final (evita un fit con dimensiones a medio calcular).
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      fit();
      raf2 = requestAnimationFrame(() => {
        fit();
        setReady(true);
      });
    });
    let ro: ResizeObserver | null = null;
    const vp = viewportRef.current;
    if (vp && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        if (!userInteracted.current) fit();
      });
      ro.observe(vp);
    }
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (ro) ro.disconnect();
    };
  }, [fit]);

  // Zoom con rueda: listener nativo con {passive:false} para poder
  // preventDefault (React lo adjunta passive y ahí el preventDefault no aplica).
  useEffect(() => {
    const vp = viewportRef.current;
    const svg = svgRef.current;
    if (!vp || !svg) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = svg.getBoundingClientRect();
      const f = Math.pow(1.0016, -e.deltaY);
      userInteracted.current = true;
      zoomAt(e.clientX - r.left, e.clientY - r.top, f);
    };
    vp.addEventListener("wheel", onWheel, { passive: false });
    return () => vp.removeEventListener("wheel", onWheel);
  }, [zoomAt]);

  // ---------- pan por puntero + detección click/drag ----------
  const drag = useRef({
    down: false,
    moved: false,
    x0: 0,
    y0: 0,
    tx0: 0,
    ty0: 0,
    code: null as string | null,
  });

  const nodeCodeFromTarget = (t: EventTarget | null): string | null => {
    const el = (t as Element | null)?.closest?.("[data-code]");
    return el ? el.getAttribute("data-code") : null;
  };

  const onPointerDown = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    const d = drag.current;
    d.down = true;
    d.moved = false;
    d.x0 = e.clientX;
    d.y0 = e.clientY;
    d.tx0 = tf.current.tx;
    d.ty0 = tf.current.ty;
    d.code = nodeCodeFromTarget(e.target);
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* no-op */
    }
  }, []);

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d.down) return;
      const dx = e.clientX - d.x0;
      const dy = e.clientY - d.y0;
      if (!d.moved && Math.hypot(dx, dy) > 5) {
        d.moved = true;
        userInteracted.current = true;
        viewportRef.current?.classList.add("panning");
      }
      if (d.moved) {
        tf.current.tx = d.tx0 + dx;
        tf.current.ty = d.ty0 + dy;
        applyTransform();
      }
    },
    [applyTransform],
  );

  const endPointer = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      const d = drag.current;
      if (!d.down) return;
      d.down = false;
      viewportRef.current?.classList.remove("panning");
      // click limpio sobre un nodo → abre el drawer de detalle (mecanismo del
      // planner; no duplicamos panel). Un drag no dispara apertura.
      if (!d.moved && d.code) {
        dispatch({ type: "OPEN_DRAWER", code: d.code });
      }
      d.code = null;
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* no-op */
      }
    },
    [dispatch],
  );

  // ---------- resaltado de cadena (hover / foco / selección) ----------
  const [hoverId, setHoverId] = useState<string | null>(null);
  const drawerCode = state.drawerCode;
  const selectedId =
    drawerCode && nodeIds.has(drawerCode) ? drawerCode : null;
  const activeId = hoverId ?? selectedId;
  const chain = useMemo(
    () => (activeId && nodeIds.has(activeId) ? chainOf(activeId) : null),
    [activeId, nodeIds, chainOf],
  );

  const onNodeKeyDown = (e: ReactKeyboardEvent<SVGGElement>, code: string) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      dispatch({ type: "OPEN_DRAWER", code });
    }
  };

  return (
    <section className="view-panel grafo-view" id="panel-grafo">
      <div className="panel-head">
        <h2>Mapa de correlativas</h2>
      </div>

      <div className="grafo-toolbar">
        <div className="grafo-toolbar-lead">
          <div className="grafo-legend" aria-label="Referencia de colores">
            <span className="lg">
              <span className="sw ob" /> Obligatoria
            </span>
            <span className="lg">
              <span className="sw el" /> Electiva
            </span>
            <span className="lg">
              <span className="sw ap" /> Aprobada
            </span>
          </div>
          <details className="grafo-help">
            <summary>¿Cómo se usa?</summary>
            <div className="grafo-help__body">
              Cada columna es un cuatrimestre de la carrera (1º·1c &rarr; 5º·2c):
              las correlativas fluyen de izquierda a derecha. Tono pizarra,
              obligatorias; tono latón, electivas. Arrastrá para moverte, usá la
              rueda o los botones +/&minus; para el zoom, y &laquo;Ajustar&raquo;
              encuadra todo el mapa. Pasá el mouse por una materia para iluminar
              su cadena; hacé click para ver el detalle.
            </div>
          </details>
        </div>
        <div className="grafo-count">
          <b>{nodes.length}</b> materias &middot; <b>{edges.length}</b>{" "}
          correlativas
        </div>
      </div>

      <div
        ref={viewportRef}
        className="grafo-viewport"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endPointer}
        onPointerCancel={endPointer}
      >
        <svg
          ref={svgRef}
          className="grafo-svg"
          xmlns="http://www.w3.org/2000/svg"
          aria-label="Grafo de correlativas — arrastrá para mover, rueda para zoom"
        >
          <defs>
            <marker
              id="grafo-arrow"
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path className="grafo-arrow" d="M0 0 L10 5 L0 10 z" />
            </marker>
            <marker
              id="grafo-arrow-lit"
              viewBox="0 0 10 10"
              refX="8.5"
              refY="5"
              markerWidth="7.4"
              markerHeight="7.4"
              orient="auto-start-reverse"
            >
              <path className="grafo-arrow-lit" d="M0 0 L10 5 L0 10 z" />
            </marker>
          </defs>

          <g ref={stageRef} className={`grafo-stage${ready ? " ready" : ""}`}>
            {/* banda de cuatrimestres: guías verticales + etiquetas año/cuatri.
                Refuerza la lectura "alineado por año/cuatri" de izq. a der. */}
            <g className="grafo-columns" aria-hidden="true">
              {columns.map((c, i) => (
                <g key={`col-${i}`} className="grafo-col">
                  <line
                    className="grafo-col-guide"
                    x1={c.x}
                    x2={c.x}
                    y1={bounds.top - 14}
                    y2={bounds.bottom + 14}
                  />
                  <text
                    className="grafo-col-anio"
                    x={c.x}
                    y={bounds.top - headerH + 13}
                    textAnchor="middle"
                  >
                    {c.top}
                  </text>
                  <text
                    className="grafo-col-cuatri"
                    x={c.x}
                    y={bounds.top - headerH + 26}
                    textAnchor="middle"
                  >
                    {c.sub}
                  </text>
                </g>
              ))}
            </g>

            <g className="grafo-edges">
              {paths.map((p) => {
                const lit = chain ? chain.has(p.from) && chain.has(p.to) : false;
                const dim = chain ? !lit : false;
                return (
                  <path
                    key={p.key}
                    className={`grafo-edge${lit ? " lit" : ""}${dim ? " dim" : ""}`}
                    d={p.d}
                    markerEnd={
                      lit ? "url(#grafo-arrow-lit)" : "url(#grafo-arrow)"
                    }
                  />
                );
              })}
            </g>

            <g className="grafo-nodes">
              {nodes.map((n) => {
                const ap = approved.has(n.id);
                const dim = chain ? !chain.has(n.id) : false;
                const sel = n.id === selectedId;
                // nombre completo para el tooltip nativo en hover (el nodo sólo
                // muestra abreviatura + código): mejora el reconocimiento sin
                // abrir el drawer. `title` de SVG = tooltip del navegador.
                const fullName = byId.get(n.id)?.nombre ?? n.abbr;
                const cls =
                  "grafo-node " +
                  (n.ob ? "ob" : "el") +
                  (ap ? " ap" : "") +
                  (dim ? " dim" : "") +
                  (sel ? " sel" : "");
                return (
                  <g
                    key={n.id}
                    className={cls}
                    data-code={n.id}
                    transform={`translate(${n.x} ${n.y})`}
                    tabIndex={0}
                    role="button"
                    aria-label={`${n.abbr}, código ${n.id}, ${
                      n.ob ? "obligatoria" : "electiva"
                    }${ap ? ", aprobada" : ""}`}
                    onMouseEnter={() => setHoverId(n.id)}
                    onMouseLeave={() =>
                      setHoverId((cur) => (cur === n.id ? null : cur))
                    }
                    onFocus={() => setHoverId(n.id)}
                    onBlur={() =>
                      setHoverId((cur) => (cur === n.id ? null : cur))
                    }
                    onKeyDown={(e) => onNodeKeyDown(e, n.id)}
                  >
                    <title>{fullName}</title>
                    <rect
                      className="gn-rect"
                      width={nodeW}
                      height={nodeH}
                      rx={7}
                      ry={7}
                    />
                    <text
                      className="gn-abbr"
                      x={nodeW / 2}
                      y={nodeH / 2 - 3}
                      textAnchor="middle"
                    >
                      {n.abbr}
                    </text>
                    <text
                      className="gn-code"
                      x={nodeW / 2}
                      y={nodeH / 2 + 12}
                      textAnchor="middle"
                    >
                      {n.id}
                    </text>
                    {ap && (
                      <g className="gn-badge">
                        <circle cx={nodeW - 12} cy={12} r={8} />
                        <path
                          d={`M ${nodeW - 15.2} 12 L ${nodeW - 13} 14.4 L ${
                            nodeW - 8.6
                          } 9`}
                        />
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </g>
        </svg>

        <div className="grafo-hint" aria-hidden="true">
          arrastrá para mover &middot; rueda para zoom
        </div>

        <div className="grafo-controls">
          <div className="grafo-zoom" ref={readoutRef} aria-hidden="true">
            100%
          </div>
          <button
            type="button"
            className="grafo-btn"
            onClick={() => zoomCenter(1.25)}
            aria-label="Acercar"
            title="Acercar"
          >
            +
          </button>
          <button
            type="button"
            className="grafo-btn"
            onClick={() => zoomCenter(0.8)}
            aria-label="Alejar"
            title="Alejar"
          >
            &minus;
          </button>
          <button
            type="button"
            className="grafo-btn fit"
            onClick={onFit}
            aria-label="Ajustar a la vista"
            title="Ajustar a la vista"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.9}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" />
            </svg>
            Ajustar
          </button>
        </div>
      </div>
    </section>
  );
}
