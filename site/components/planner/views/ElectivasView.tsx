"use client";

import { useMemo } from "react";
import { usePlanner } from "@/components/planner/state";
import {
  EstadoControl,
  CheckSingle,
  CheckDouble,
} from "@/components/planner/EstadoControl";
import { estadoOf, tieneFinal } from "@/lib/planner/estado";
import { PLAN, hasHorario } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import { FICHAS } from "@/lib/planner/fichas";
import { MinorBadge, MinorBadges } from "@/components/planner/MinorBadge";
import { AvailLock } from "@/components/planner/CardSignals";
import { MINORS } from "@/lib/planner/minors";
import type { Materia } from "@/lib/planner/types";
import "../cards.css";

/** Leyenda colapsable (cerrada por defecto): decodifica de una vez las familias
 *  de señales de la card (avance · minor · disponibilidad). Como se lee una sola
 *  vez, va en un <details> discreto y no empuja la grilla. El bloque "Avance"
 *  es consistente con la leyenda de CuatriView (misma codificación del control). */
function CardLegend() {
  return (
    <details className="legend-details">
      <summary>Cómo leer las señales</summary>
      <div className="card-legend" role="note" aria-label="Cómo leer las señales de cada card">
        <div className="cl-group">
          <span className="cl-h">Avance — tocá el círculo</span>
          <span className="cl-items">
            <span className="cl-row">
              <span className="estado-ctl st-pending" aria-hidden="true" /> pendiente
            </span>
            <span className="cl-row">
              <span className="estado-ctl st-regular" aria-hidden="true"><CheckSingle /></span> cursada — falta el final
            </span>
            <span className="cl-row">
              <span className="estado-ctl st-final" aria-hidden="true"><CheckDouble /></span> final aprobado
            </span>
          </span>
        </div>
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

  // ¿Hay algún filtro activo que limpiar? (incluye áreas apagadas). Solo con
  // esto mostramos el atajo "Limpiar filtros" en el empty state.
  const hasFilters =
    search !== "" || fDisp || fHor || areasOn.size < PLAN.areas.length;
  const clearFilters = () => {
    dispatch({ type: "SET_SEARCH", value: "" });
    dispatch({ type: "SET_FILTER", key: "fDisp", value: false });
    dispatch({ type: "SET_FILTER", key: "fHor", value: false });
    // re-enciende toda área apagada (TOGGLE_AREA alterna, así que solo las que faltan).
    for (const a of PLAN.areas) {
      if (!areasOn.has(a)) dispatch({ type: "TOGGLE_AREA", area: a });
    }
  };

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
      <div className="card-grid card-grid--el">
        {list.length === 0 ? (
          <div className="empty">
            Ninguna electiva cumple los filtros.
            {hasFilters && (
              <button type="button" className="empty__clear" onClick={clearFilters}>
                Limpiar filtros
              </button>
            )}
          </div>
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
    // cursada aprobada que todavía debe el final (mismo microcopy que qrow__due).
    const debeFinal = estado === "regular" && tieneFinal(m.codigo);
    const avail = isAvailable(m, approved);
    const inCombo = combo.has(m.codigo);
    const hor = hasHorario(m.codigo);
    // Solo las electivas con programa analítico tienen ficha completa.
    const hasFicha = !!FICHAS[m.codigo];
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
        <h3 className="card__name" title={m.nombre}>{m.nombre}</h3>
        {/* fila de señales — alto reservado (1 renglón) para que todas las
            cards midan igual; sin wrap: badges + candado + "falta final". */}
        <div className="card__meta">
          <MinorBadges areas={m.areas} variant="logo" />
          {!appr ? <AvailLock ok={avail} /> : null}
          {debeFinal ? <span className="card__due">falta final</span> : null}
        </div>
        {/* acciones en UNA sola fila: estado · combinar · ficha↗ (a la derecha).
            La ficha ya no es un renglón full-width extra — inline y compacta. */}
        <div className="card__acts">
          {/* tri-estado canónico (pendiente → ✓ cursada → ✓✓ final); el span
              sólo centra verticalmente el control frente al botón vecino. */}
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <EstadoControl code={m.codigo} />
          </span>
          <button
            className={"mini btn-co" + (inCombo ? " on plan" : "")}
            disabled={!hor}
            title={!hor ? "Sin horario publicado este cuatrimestre" : undefined}
            onClick={(e) => {
              e.stopPropagation();
              if (hor) dispatch({ type: "TOGGLE_COMBO", code: m.codigo });
            }}
          >
            {inCombo ? "combinar ✓" : "combinar"}
          </button>
          {hasFicha ? (
            <button
              className="card__read"
              onClick={(e) => { e.stopPropagation(); dispatch({ type: "OPEN_FICHA", code: m.codigo }); }}
              aria-label={`Leer ficha de ${m.nombre}`}
            >
              ficha ↗
            </button>
          ) : null}
        </div>
      </article>
    );
  }
}
