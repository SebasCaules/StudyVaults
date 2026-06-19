"use client";

import { useId, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@studyvaults/ui";

export interface Tool {
  key: string;
  label: string;
  node: ReactNode;
  /** Categoría opcional: agrupa la herramienta en el índice (con encabezado). */
  group?: string;
}

/**
 * Shell de los toolkits por materia — una "consola de instrumento": índice
 * vertical numerado y categorizado a la izquierda (sticky, con riel activo) +
 * escenario a la derecha que monta solo la herramienta activa (cada una
 * conserva su estado mientras está visible). Compatible hacia atrás: sin
 * `group`, las herramientas caen en un único bloque sin encabezado.
 *
 * Patrón ARIA tablist/tab/tabpanel con roving tabindex + navegación por
 * flechas / Home / End, igual que el segmented control del sistema.
 */
export default function ToolkitShell({
  intro,
  tools,
}: {
  intro?: ReactNode;
  tools: Tool[];
}) {
  const base = useId();
  const [active, setActive] = useState(tools[0]?.key);

  const order = useMemo(() => tools.map((t) => t.key), [tools]);
  const activeIdx = Math.max(0, order.indexOf(active));
  const activeTool = tools[activeIdx];

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

  const tabId = (k: string) => `${base}-tk-tab-${k}`;
  const panelId = (k: string) => `${base}-tk-panel-${k}`;
  const total = String(tools.length).padStart(2, "0");

  const onKeyNav = (e: KeyboardEvent<HTMLElement>) => {
    let next = activeIdx;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (activeIdx + 1) % order.length;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (activeIdx - 1 + order.length) % order.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = order.length - 1;
    else return;
    e.preventDefault();
    const k = order[next];
    setActive(k);
    document.getElementById(tabId(k))?.focus();
  };

  return (
    <div className="tk">
      {intro && <p className="tk__intro">{intro}</p>}

      <div className="tk__console">
        <nav
          className="tk__rail"
          role="tablist"
          aria-orientation="vertical"
          aria-label="Índice de herramientas"
          onKeyDown={onKeyNav}
        >
          <div className="tk__rail-head" aria-hidden="true">
            <span className="tk__rail-dot" />
            <span>Toolkit</span>
            <span className="tk__rail-count">{total}</span>
          </div>

          {groups.map((g, gi) => (
            <div className="tk__group" key={g.name ?? `g${gi}`}>
              {g.name && <span className="tk__group-label">{g.name}</span>}
              {g.items.map(({ tool, n }) => {
                const isActive = tool.key === active;
                return (
                  <button
                    key={tool.key}
                    id={tabId(tool.key)}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={panelId(tool.key)}
                    tabIndex={isActive ? 0 : -1}
                    className={cn("tk__item", isActive && "is-active")}
                    onClick={() => setActive(tool.key)}
                  >
                    <span className="tk__item-mark" aria-hidden="true" />
                    <span className="tk__item-num">{String(n).padStart(2, "0")}</span>
                    <span className="tk__item-label">{tool.label}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="tk__stage">
          <div className="tk__stage-bar" aria-hidden="true">
            <span className="tk__stage-idx">
              {String(activeIdx + 1).padStart(2, "0")}
              <i>/{total}</i>
            </span>
            {activeTool?.group && <span className="tk__stage-group">{activeTool.group}</span>}
          </div>

          {/* key={active} → remonta al cambiar: dispara la entrada y desmonta
              la herramienta anterior (cleanup, p.ej. la pizarra). */}
          <div
            key={active}
            className="tk__panel"
            role="tabpanel"
            id={panelId(active ?? "")}
            aria-labelledby={tabId(active ?? "")}
            tabIndex={0}
          >
            {activeTool?.node}
          </div>
        </div>
      </div>
    </div>
  );
}
