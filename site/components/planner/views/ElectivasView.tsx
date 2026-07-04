"use client";

import { useMemo } from "react";
import { usePlanner } from "@/components/planner/state";
import { EstadoControl } from "@/components/planner/EstadoControl";
import { estadoOf } from "@/lib/planner/estado";
import { PLAN, hasHorario } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import { FICHAS } from "@/lib/planner/fichas";
import { charsOf } from "@/lib/planner/programa";
import { MinorBadge, MinorBadges } from "@/components/planner/MinorBadge";
import { AvailLock, RegimeIcon } from "@/components/planner/CardSignals";
import { MINORS } from "@/lib/planner/minors";
import type { Materia } from "@/lib/planner/types";
import "../cards.css";

/** Régimen derivable de la ficha para el ícono único de la card.
 *  Honesto: `null` cuando no hay ficha o la señal es dudosa (no se infiere). */
function regimeOf(codigo: string): "promo" | "final" | null {
  const d = charsOf(codigo);
  if (!d) return null;
  if (d.promocionable === true) return "promo";
  if (d.tieneFinal) return "final";
  return null;
}

/** Leyenda colapsable (cerrada por defecto): decodifica de una vez las tres
 *  familias de señales de la card (minor · disponibilidad · régimen). Como se
 *  lee una sola vez, va en un <details> discreto y no empuja la grilla. */
function CardLegend() {
  return (
    <details className="legend-details">
      <summary>Cómo leer las señales</summary>
      <div className="card-legend" role="note" aria-label="Cómo leer las señales de cada card">
        <div className="cl-group">
          <span className="cl-h">Minor que completa</span>
          <span className="cl-items">
            {MINORS.map((m) => (
              <MinorBadge key={m.id} minor={m} variant="logo" />
            ))}
          </span>
        </div>
        <div className="cl-group">
          <span className="cl-h">Disponibilidad</span>
          <span className="cl-items">
            <span className="cl-row"><AvailLock ok /> cursable</span>
            <span className="cl-row"><AvailLock ok={false} /> requisitos</span>
          </span>
        </div>
        <div className="cl-group">
          <span className="cl-h">Régimen</span>
          <span className="cl-items">
            <span className="cl-row"><RegimeIcon kind="promo" /> promociona</span>
            <span className="cl-row"><RegimeIcon kind="final" /> con final</span>
          </span>
        </div>
      </div>
    </details>
  );
}

export default function ElectivasView() {
  const { state, dispatch } = usePlanner();
  const { approved, finalDone, combo, areasOn, search, fDisp, fHor } = state;

  const list = useMemo(() => {
    const q = search.toLowerCase();
    const passSearch = (m: Materia) =>
      !q ||
      (m.codigo + " " + m.nombre + " " + m.abbr).toLowerCase().includes(q);
    let l = PLAN.electivas.filter(passSearch).filter((m) => {
      const a = m.areas || [];
      return !a.length || a.some((x) => areasOn.has(x));
    });
    if (fDisp) l = l.filter((m) => isAvailable(m, approved));
    if (fHor) l = l.filter((m) => hasHorario(m.codigo));
    l = [...l].sort((a, b) => a.codigo.localeCompare(b.codigo));
    return l;
  }, [search, areasOn, fDisp, fHor, approved]);

  return (
    <section className="view-panel">
      <div className="panel-head">
        <h2>Materias electivas</h2>
        <p>
          {PLAN.electivas.length} materias. Filtrá por área para orientar un
          minor.
        </p>
      </div>
      <CardLegend />
      <div className="card-grid">
        {list.length === 0 ? (
          <div className="empty">Ninguna electiva cumple los filtros.</div>
        ) : (
          list.map((m) => (
            <ElectCard key={m.codigo} m={m} />
          ))
        )}
      </div>
    </section>
  );

  function ElectCard({ m }: { m: Materia }) {
    // "aprobada" visual de la card = cualquier avance real (cursada o final);
    // el nivel exacto lo marca el EstadoControl de la fila de acciones.
    const estado = estadoOf(m.codigo, approved, finalDone);
    const appr = estado !== "pendiente";
    const avail = isAvailable(m, approved);
    const inCombo = combo.has(m.codigo);
    const hor = hasHorario(m.codigo);
    // Solo las electivas con programa analítico tienen ficha completa.
    const hasFicha = !!FICHAS[m.codigo];
    const reg = regimeOf(m.codigo);
    return (
      <article
        className={"card t-electiva" + (appr ? " appr" : "")}
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("button"))
            dispatch({ type: "OPEN_DRAWER", code: m.codigo });
        }}
      >
        <div className="card__top">
          <span className="code">{m.codigo}</span>
          <span className="card__cred">{m.creditos} cr</span>
        </div>
        <span className="card__abbr">{m.abbr}</span>
        <h3 className="card__name">{m.nombre}</h3>
        <div className="card__meta">
          <MinorBadges areas={m.areas} variant="logo" />
          {!appr ? <AvailLock ok={avail} /> : null}
          {reg ? <RegimeIcon kind={reg} /> : null}
        </div>
        <div className="card__acts">
          {/* tri-estado canónico (pendiente → ✓ cursada → ✓✓ final); el span
              sólo centra verticalmente el control frente al botón vecino. */}
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <EstadoControl code={m.codigo} />
          </span>
          <button
            className={"mini btn-co" + (inCombo ? " on plan" : "")}
            disabled={!hor}
            onClick={(e) => {
              e.stopPropagation();
              if (hor) dispatch({ type: "TOGGLE_COMBO", code: m.codigo });
            }}
          >
            {inCombo ? "combinar ✓" : "combinar"}
          </button>
        </div>
        {hasFicha ? (
          <button
            className="card__read"
            onClick={(e) => { e.stopPropagation(); dispatch({ type: "OPEN_FICHA", code: m.codigo }); }}
            aria-label={`Leer ficha de ${m.nombre}`}
          >
            Leer ficha ↗
          </button>
        ) : null}
      </article>
    );
  }
}
