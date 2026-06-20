"use client";

import { useMemo, useState } from "react";
import { Html } from "./Html";
import {
  REPETIDAS,
  REPETIDAS_FEATURES,
  UNIT_NAMES,
} from "./data";

/* ──────────────────────────────────────────────────────────────────────────
   Preguntas repetidas — 2.º parcial. Cruce de nueve parciales anteriores: las
   preguntas que más se repiten, con su frecuencia, respuesta y fundamento.
   Incluye los tres "destacados" de desarrollo (tablas) y el banco por unidad
   con respuesta revelable. Imprimible.
   ────────────────────────────────────────────────────────────────────────── */

function QaItem({ q, a, freq, trap }: { q: string; a: string; freq: string; trap: boolean }) {
  const [open, setOpen] = useState(false);
  return (
    <li className="drep__qa">
      <button type="button" className="drep__q" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="drep__q-arrow" aria-hidden="true">
          {open ? "▾" : "▸"}
        </span>
        <span className="drep__q-text">{q}</span>
        {freq && <span className="drep__freq">{freq}</span>}
        {trap && <span className="dvt-tag dvt-tag--warn">trampa</span>}
      </button>
      {open && <Html className="drep__a dvt-rich" html={a} />}
    </li>
  );
}

export default function Repetidas() {
  const units = useMemo(
    () => REPETIDAS.map((r) => r.unit).sort((a, b) => a - b),
    [],
  );
  const [unit, setUnit] = useState<number | "all">("all");

  const shown = REPETIDAS.filter((r) => unit === "all" || r.unit === unit).sort(
    (a, b) => a.unit - b.unit,
  );
  const features =
    unit === "all" ? REPETIDAS_FEATURES : REPETIDAS_FEATURES.filter((f) => f.unit === unit);

  const print = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <div className="dvt drep">
      <div className="dq__filters">
        <div className="dq__chips" role="group" aria-label="Filtrar por unidad">
          <button
            type="button"
            className={`dvt-chip${unit === "all" ? " is-active" : ""}`}
            onClick={() => setUnit("all")}
          >
            Todas
          </button>
          {units.map((u) => (
            <button
              key={u}
              type="button"
              className={`dvt-chip${unit === u ? " is-active" : ""}`}
              onClick={() => setUnit(u)}
              title={UNIT_NAMES[u]}
            >
              U{u}
            </button>
          ))}
        </div>
        <button type="button" className="dvt-btn" onClick={print}>
          ⎙ Imprimir / PDF
        </button>
      </div>

      {features.length > 0 && (
        <div className="drep__features">
          {features.map((f, i) => (
            <section key={i} className="dvt-panel drep__feature dvt-rich">
              <header className="drep__feature-head">
                <span className="dvt-tag">{`Unidad ${f.unit}`}</span>
                <h4>{f.title}</h4>
                {f.freq && <span className="drep__freq">{f.freq}</span>}
              </header>
              <Html html={f.html} />
            </section>
          ))}
        </div>
      )}

      {shown.map((u) => (
        <section key={u.unit} className="drep__unit">
          <h3 className="drep__unit-head">
            <span className="drp__unit-num">U{u.unit}</span>
            {u.name}
            <span className="drep__unit-count">{u.items.length}</span>
          </h3>
          <ul className="drep__list">
            {u.items.map((it, i) => (
              <QaItem key={i} {...it} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
