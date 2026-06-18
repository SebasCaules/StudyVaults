"use client";

import { useState, type ReactNode } from "react";
import { Tabs } from "@studyvaults/ui";

export interface Tool {
  key: string;
  label: string;
  node: ReactNode;
}

/**
 * Shell común de los toolkits por materia: una intro opcional + tabs
 * (segmented control de @studyvaults/ui) que conmutan entre herramientas.
 * Solo monta la herramienta activa (cada una mantiene su propio estado
 * interno mientras está visible).
 */
export default function ToolkitShell({
  intro,
  tools,
}: {
  intro?: ReactNode;
  tools: Tool[];
}) {
  const [active, setActive] = useState(tools[0]?.key);
  const panels = Object.fromEntries(tools.map((t) => [t.key, t.node]));

  return (
    <div className="vtool">
      {intro && <p className="vtool__intro">{intro}</p>}
      <Tabs
        tabs={tools.map((t) => ({ id: t.key, label: t.label }))}
        value={active}
        onChange={setActive}
        panels={panels}
      />
    </div>
  );
}
