"use client";

import { useMemo, useState } from "react";
import { Html } from "./Html";
import { UNIT_NAMES, type ConceptBlock } from "./data";

/* ──────────────────────────────────────────────────────────────────────────
   Conceptos por unidad — resumen navegable de la teoría del 2.º parcial
   (TEORIA de la app "estudio interactivo"), con los artículos exactos. Para
   repasar antes de practicar o chequear una duda puntual.
   ────────────────────────────────────────────────────────────────────────── */

export default function ConceptBrowser({ blocks }: { blocks: ConceptBlock[] }) {
  const units = useMemo(
    () => Array.from(new Set(blocks.map((b) => b.unit))).sort((a, b) => a - b),
    [blocks],
  );
  const [unit, setUnit] = useState<number>(units[0]);

  const shown = blocks.filter((b) => b.unit === unit);

  return (
    <div className="dvt dc">
      <div className="dq__chips" role="group" aria-label="Elegir unidad">
        {units.map((u) => (
          <button
            key={u}
            type="button"
            className={`dvt-chip${unit === u ? " is-active" : ""}`}
            onClick={() => setUnit(u)}
          >
            U{u} · {UNIT_NAMES[u]}
          </button>
        ))}
      </div>

      <div className="dc__grid">
        {shown.map((b, i) => (
          <section key={i} className="dvt-panel dc__card dvt-rich">
            <h4 className="dc__title">{b.title}</h4>
            <Html html={b.html} />
          </section>
        ))}
      </div>
    </div>
  );
}
