"use client";

import { useMemo } from "react";
import { usePlanner } from "@/components/planner/state";
import { PLAN, AREA_COLOR, hasHorario } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import type { Materia } from "@/lib/planner/types";

export default function ElectivasView() {
  const { state, dispatch } = usePlanner();
  const { approved, combo, areasOn, search, fDisp, fHor } = state;

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
          91 materias. Filtrá por área para orientar un minor. La marca{" "}
          <span className="hor-dot"></span> indica horario publicado este
          cuatrimestre.
        </p>
      </div>
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
    const appr = approved.has(m.codigo);
    const avail = isAvailable(m, approved);
    const inCombo = combo.has(m.codigo);
    const hor = hasHorario(m.codigo);
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
          {(m.areas || []).map((a) => (
            <span
              key={a}
              className="tag tag--area"
              style={{ background: AREA_COLOR[a] }}
            >
              {a.split(" ")[0]}
            </span>
          ))}
          {hor ? <span className="tag tag--hor">horario</span> : null}
          {!appr ? (
            avail ? (
              <span className="tag tag--ok">disponible</span>
            ) : (
              <span className="tag tag--lock">requisitos</span>
            )
          ) : null}
        </div>
        <div className="card__acts">
          <button
            className={"mini btn-ap" + (appr ? " on" : "")}
            onClick={(e) => {
              e.stopPropagation();
              dispatch({ type: "TOGGLE_APPROVED", code: m.codigo });
            }}
          >
            {appr ? "aprobada ✓" : "aprobada"}
          </button>
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
      </article>
    );
  }
}
