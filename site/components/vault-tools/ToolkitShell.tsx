"use client";

import { useState, type ReactNode } from "react";

export interface Tool {
  key: string;
  label: string;
  node: ReactNode;
}

/**
 * Shell común de los toolkits por materia: una intro opcional + tabs
 * (segmented control) que conmutan entre herramientas. Solo monta la
 * herramienta activa (cada una mantiene su propio estado interno).
 */
export default function ToolkitShell({
  intro,
  tools,
}: {
  intro?: ReactNode;
  tools: Tool[];
}) {
  const [active, setActive] = useState(tools[0]?.key);
  const cur = tools.find((t) => t.key === active) ?? tools[0];

  return (
    <div className="vtool">
      {intro && <p className="vtool__intro">{intro}</p>}
      <div className="vtool-tabs" role="tablist" aria-label="Herramientas">
        {tools.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.key === cur.key}
            className={`vtool-tab${t.key === cur.key ? " is-active" : ""}`}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel">{cur?.node}</div>
    </div>
  );
}
