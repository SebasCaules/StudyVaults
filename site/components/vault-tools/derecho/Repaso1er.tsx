"use client";

import { useState } from "react";
import { Html } from "./Html";
import {
  CONCEPTS_1ER,
  ERRORES_1ER,
  CHECKLIST_1ER,
  type UnitConcepts,
} from "./data";

/* ──────────────────────────────────────────────────────────────────────────
   Repaso completo — 1.º parcial. La "página completa para estudiar": resumen
   ejecutivo de conceptos clave por unidad (1-5) con los artículos exactos, los
   errores críticos a memorizar y un checklist pre-parcial marcable. Construido
   desde resumen-conceptos-clave.tex.
   ────────────────────────────────────────────────────────────────────────── */

function UnitSection({ u }: { u: UnitConcepts }) {
  return (
    <section id={`u${u.unit}`} className="drp__unit">
      <h3 className="drp__unit-head">
        <span className="drp__unit-num">U{u.unit}</span>
        {u.name}
      </h3>
      <dl className="drp__defs dvt-rich">
        {u.concepts.map((c, i) => (
          <div className="drp__def" key={i}>
            <dt>
              <Html as="span" html={c.term} />
            </dt>
            <dd>
              <Html as="span" html={c.def} />
            </dd>
          </div>
        ))}
      </dl>
      {u.errores && (
        <p className="drp__err dvt-rich">
          <Html as="span" html={u.errores} />
        </p>
      )}
    </section>
  );
}

export default function Repaso1er() {
  const [done, setDone] = useState<Record<number, boolean>>({});
  const toggle = (i: number) => setDone((s) => ({ ...s, [i]: !s[i] }));
  const checked = Object.values(done).filter(Boolean).length;

  const jump = (id: string) => {
    if (typeof document === "undefined") return;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="dvt drp">
      <p className="vtool__intro">
        Resumen ejecutivo del 1.º parcial: conceptos clave por unidad con los
        artículos exactos, los errores que más se repiten y un checklist final.
        Lectura rápida antes del parcial.
      </p>

      {/* navegación interna */}
      <nav className="drp__nav" aria-label="Secciones del repaso">
        <button type="button" className="dvt-chip dvt-chip--accent" onClick={() => jump("errores")}>
          ⚠ Errores críticos
        </button>
        {CONCEPTS_1ER.map((u) => (
          <button key={u.unit} type="button" className="dvt-chip" onClick={() => jump(`u${u.unit}`)}>
            U{u.unit}
          </button>
        ))}
        <button type="button" className="dvt-chip" onClick={() => jump("checklist")}>
          ✓ Checklist
        </button>
      </nav>

      {/* errores críticos */}
      <section id="errores" className="dvt-panel drp__critical">
        <h3 className="drp__critical-head">Errores críticos — estudiar urgente</h3>
        <ol className="drp__critical-list dvt-rich">
          {ERRORES_1ER.map((e, i) => (
            <li key={i}>
              <Html as="span" html={e} />
            </li>
          ))}
        </ol>
      </section>

      {/* conceptos por unidad */}
      <div className="dvt-panel drp__concepts">
        {CONCEPTS_1ER.map((u) => (
          <UnitSection key={u.unit} u={u} />
        ))}
      </div>

      {/* checklist */}
      <section id="checklist" className="dvt-panel drp__checklist dvt-rich">
        <div className="drp__checklist-head">
          <h3>Checklist pre-parcial</h3>
          <span className="drp__checklist-count">
            {checked}/{CHECKLIST_1ER.length}
          </span>
        </div>
        <ul>
          {CHECKLIST_1ER.map((c, i) => (
            <li key={i}>
              <label className={`drp__check${done[i] ? " is-done" : ""}`}>
                <input type="checkbox" checked={!!done[i]} onChange={() => toggle(i)} />
                <Html as="span" html={c} />
              </label>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
