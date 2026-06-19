"use client";

import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from "react";
import { cn } from "@studyvaults/ui";

export interface Tool {
  key: string;
  label: string;
  node: ReactNode;
  /** Categoría opcional: agrupa la herramienta en la grilla (con encabezado). */
  group?: string;
}

/**
 * Shell de los toolkits por materia — una "grilla de cards-lanzador": por
 * defecto muestra una tarjeta por herramienta, agrupadas por `group` (con
 * encabezado de grupo cuando lo hay; sin `group` caen en un único bloque sin
 * encabezado). Al abrir una card se monta solo la herramienta activa a ancho
 * completo, con un breadcrumb para volver a la grilla o saltar a otra tool.
 *
 * Cada herramienta conserva su estado mientras está visible; al cambiar de
 * tool el panel se remonta (`key={active}`) para disparar la entrada y el
 * cleanup de la anterior (p.ej. la pizarra de diagramas).
 *
 * Compatible hacia atrás: la interfaz `Tool` y la firma de `ToolkitShell`
 * no cambian — sólo cambia la presentación.
 */
export default function ToolkitShell({
  intro,
  tools,
}: {
  intro?: ReactNode;
  tools: Tool[];
}) {
  const base = useId();
  const [active, setActive] = useState<string | null>(null);

  const order = useMemo(() => tools.map((t) => t.key), [tools]);
  const activeIdx = active ? order.indexOf(active) : -1;
  const activeTool = activeIdx >= 0 ? tools[activeIdx] : undefined;

  // Agrupar preservando el orden original. Tramos contiguos con el mismo
  // `group` (o sin group) forman un bloque; el número es el índice global 1-based.
  const groups = useMemo(() => {
    const out: { name: string | null; items: { tool: Tool; n: number }[] }[] = [];
    tools.forEach((tool, i) => {
      const name = tool.group ?? null;
      const last = out[out.length - 1];
      if (!last || last.name !== name) out.push({ name, items: [{ tool, n: i + 1 }] });
      else last.items.push({ tool, n: i + 1 });
    });
    return out;
  }, [tools]);

  const cardId = (k: string) => `${base}-tk-card-${k}`;
  const total = String(tools.length).padStart(2, "0");

  // Al abrir una herramienta, llevar el foco al encabezado del panel (a11y).
  const headRef = useRef<HTMLDivElement | null>(null);
  // Al volver a la grilla, devolver el foco a la card que estaba abierta.
  const returnKey = useRef<string | null>(null);
  const [pendingFocus, setPendingFocus] = useState<string | null>(null);

  const open = (k: string) => {
    returnKey.current = k;
    setActive(k);
  };
  const back = () => {
    setPendingFocus(returnKey.current);
    setActive(null);
  };

  useEffect(() => {
    if (active) headRef.current?.focus();
  }, [active]);

  useEffect(() => {
    if (active === null && pendingFocus) {
      document.getElementById(cardId(pendingFocus))?.focus();
      setPendingFocus(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, pendingFocus]);

  // ---- vista: grilla de cards ----
  if (!activeTool) {
    return (
      <div className="tk">
        {intro && <p className="tk__intro">{intro}</p>}

        <div className="tk__deck">
          {groups.map((g, gi) => (
            <section className="tk__set" key={g.name ?? `g${gi}`} aria-label={g.name ?? undefined}>
              {g.name && (
                <h3 className="tk__set-head">
                  <span className="tk__set-name">{g.name}</span>
                  <span className="tk__set-rule" aria-hidden="true" />
                  <span className="tk__set-count">
                    {String(g.items.length).padStart(2, "0")}
                  </span>
                </h3>
              )}
              <div className="tk__grid">
                {g.items.map(({ tool, n }) => (
                  <button
                    key={tool.key}
                    id={cardId(tool.key)}
                    type="button"
                    className="tk__card"
                    onClick={() => open(tool.key)}
                  >
                    <span className="tk__card-top">
                      <span className="tk__card-num" aria-hidden="true">
                        {String(n).padStart(2, "0")}
                      </span>
                      <span className="tk__card-eyebrow">Herramienta</span>
                    </span>
                    <span className="tk__card-label">{tool.label}</span>
                    <span className="tk__card-cta" aria-hidden="true">
                      Abrir
                      <i className="tk__card-arrow">→</i>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    );
  }

  // ---- vista: herramienta abierta ----
  return (
    <div className="tk tk--open">
      <div className="tk__bar">
        <button type="button" className="tk__back" onClick={back}>
          <span className="tk__back-arrow" aria-hidden="true">
            ←
          </span>
          Herramientas
        </button>

        <span className="tk__crumb" aria-hidden="true">
          <span className="tk__crumb-sep">/</span>
          <span className="tk__crumb-idx">{String(activeIdx + 1).padStart(2, "0")}</span>
          {activeTool.group && <span className="tk__crumb-group">{activeTool.group}</span>}
          <span className="tk__crumb-label">{activeTool.label}</span>
        </span>

        <nav className="tk__jump" aria-label="Cambiar de herramienta">
          {tools.map((t) => (
            <button
              key={t.key}
              type="button"
              className={cn("tk__jump-btn", t.key === active && "is-active")}
              aria-current={t.key === active ? "true" : undefined}
              title={t.label}
              onClick={() => open(t.key)}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      {/* key={active} → remonta al cambiar: dispara la entrada y desmonta
          la herramienta anterior (cleanup, p.ej. la pizarra). */}
      <div key={active} className="tk__open">
        <div
          ref={headRef}
          className="tk__open-head"
          tabIndex={-1}
          role="group"
          aria-label={activeTool.label}
        >
          <span className="tk__open-idx" aria-hidden="true">
            {String(activeIdx + 1).padStart(2, "0")}
            <i>/{total}</i>
          </span>
          {activeTool.group && <span className="tk__open-group">{activeTool.group}</span>}
          <span className="tk__open-title">{activeTool.label}</span>
        </div>

        <div className="tk__open-body">{activeTool.node}</div>
      </div>
    </div>
  );
}
