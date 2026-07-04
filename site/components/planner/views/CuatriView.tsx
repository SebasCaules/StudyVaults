"use client";

// Plan por cuatrimestre — timeline por año (rework HCI 2026-07).
// Un año = una carta partida en sus dos cuatrimestres; cada materia es una
// fila tipo checklist: [EstadoControl] código nombre … señal · créditos.
// El estado vive en UNA sola codificación (el control + la leyenda); la
// disponibilidad usa el mismo candado que Electivas (consistencia entre vistas).
import { useMemo } from "react";
import { usePlanner } from "@/components/planner/state";
import { PLAN, hasHorario } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import {
  EstadoControl,
  estadoOf,
  tieneFinal,
  CheckSingle,
  CheckDouble,
} from "@/components/planner/EstadoControl";
import { AvailLock } from "@/components/planner/CardSignals";
import type { Materia } from "@/lib/planner/types";
import "../cards.css";

const CUATRI_LABEL: Record<string, string> = { "1": "1.º cuatrimestre", "2": "2.º cuatrimestre" };

type SemGroup = { cuatri: number; ms: Materia[] };
type YearGroup = { anio: number; ciclos: string[]; sems: SemGroup[] };

/** Buckets de avance de un conjunto de materias:
 *  done = final aprobado o promocionada (terminal) · mid = cursada, debe final. */
function bucketsOf(
  ms: Materia[],
  approved: Set<string>,
  finalDone: Set<string>,
) {
  let done = 0;
  let mid = 0;
  ms.forEach((m) => {
    const e = estadoOf(m.codigo, approved, finalDone);
    if (e === "pendiente") return;
    if (e === "final" || !tieneFinal(m.codigo)) done++;
    else mid++;
  });
  return { done, mid, avance: done + mid };
}

/** Leyenda colapsable: decodifica control de avance + candado una sola vez. */
function CuatriLegend() {
  return (
    <details className="legend-details">
      <summary>Cómo leer las señales</summary>
      <div className="card-legend" role="note" aria-label="Cómo leer las señales de cada materia">
        <div className="cl-group">
          <span className="cl-h">Avance — cliqueá el control de la fila</span>
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
            <span className="cl-row">
              <span className="estado-ctl st-promo" aria-hidden="true"><CheckSingle /></span> promociona (sin final)
            </span>
          </span>
        </div>
        <div className="cl-group">
          <span className="cl-h">Disponibilidad</span>
          <span className="cl-items">
            <span className="cl-row"><AvailLock ok /> cursable</span>
            <span className="cl-row"><AvailLock ok={false} /> requisitos pendientes</span>
          </span>
        </div>
      </div>
    </details>
  );
}

export default function CuatriView() {
  const { state } = usePlanner();
  const { approved, finalDone, search, fDisp, fHor } = state;

  const years = useMemo<YearGroup[]>(() => {
    const q = search.toLowerCase();
    const passSearch = (m: Materia) =>
      !q || `${m.codigo} ${m.nombre} ${m.abbr}`.toLowerCase().includes(q);

    let list = PLAN.obligatorias.filter(passSearch);
    if (fDisp)
      list = list.filter((m) => isAvailable(m, approved) || approved.has(m.codigo));
    if (fHor) list = list.filter((m) => hasHorario(m.codigo));

    const byYear = new Map<number, Materia[]>();
    list.forEach((m) => {
      const anio = m.anio ?? 0;
      const arr = byYear.get(anio) ?? [];
      arr.push(m);
      byYear.set(anio, arr);
    });

    return [...byYear.entries()]
      .sort((a, b) => a[0] - b[0])
      .map(([anio, ms]) => {
        const sems: SemGroup[] = [1, 2]
          .map((c) => ({
            cuatri: c,
            ms: ms
              .filter((m) => m.cuatri === c)
              .sort((a, b) => a.codigo.localeCompare(b.codigo)),
          }))
          .filter((s) => s.ms.length > 0);
        const ciclos = [
          ...new Set(ms.map((m) => m.ciclo).filter((c): c is string => !!c)),
        ];
        return { anio, ciclos, sems };
      });
  }, [approved, search, fDisp, fHor]);

  return (
    <section className="view-panel">
      <div className="panel-head">
        <h2>Plan por cuatrimestre</h2>
        <p>
          Las obligatorias del plan, año por año: un toque en el control marca
          la cursada, dos el final, y el resto del planner se recalcula solo.
        </p>
      </div>
      <CuatriLegend />
      {years.length === 0 ? (
        <div className="empty">No hay obligatorias que cumplan los filtros.</div>
      ) : (
        <div className="cq-years">
          {years.map((y) => {
            const all = y.sems.flatMap((s) => s.ms);
            const { done, mid, avance } = bucketsOf(all, approved, finalDone);
            const pctDone = (done / all.length) * 100;
            const pctMid = (mid / all.length) * 100;
            return (
              <section className="cq-year" key={y.anio}>
                <header className="cq-year__h">
                  <h3 className="cq-year__t">Año {y.anio}</h3>
                  <span className="cq-year__ciclo">{y.ciclos.join(" · ")}</span>
                  <div
                    className="cq-year__prog"
                    title={`${done} terminadas · ${mid} cursadas con final pendiente · ${all.length - avance} pendientes`}
                  >
                    <span className="cq-year__bar" aria-hidden="true">
                      <i className="seg-done" style={{ width: `${pctDone}%` }} />
                      <i className="seg-mid" style={{ width: `${pctMid}%` }} />
                    </span>
                    <span className="cq-year__n">
                      <b>{avance}</b>/{all.length}
                    </span>
                  </div>
                </header>
                <div
                  className={
                    "cq-year__cols" + (y.sems.length === 1 ? " cq-year__cols--solo" : "")
                  }
                >
                  {y.sems.map((s) => {
                    const b = bucketsOf(s.ms, approved, finalDone);
                    return (
                      <div className="cq-sem" key={s.cuatri}>
                        <h4 className="cq-sem__h">
                          {CUATRI_LABEL[String(s.cuatri)] ?? `${s.cuatri}.º cuatrimestre`}
                          <span className="cq-sem__n">
                            {b.avance}/{s.ms.length}
                          </span>
                        </h4>
                        <ul
                          className="cq-list"
                          aria-label={`Año ${y.anio}, ${s.cuatri}.º cuatrimestre`}
                        >
                          {s.ms.map((m) => (
                            <QRow key={m.codigo} m={m} />
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </section>
  );
}

function QRow({ m }: { m: Materia }) {
  const { state, dispatch } = usePlanner();
  const estado = estadoOf(m.codigo, state.approved, state.finalDone);
  const has2 = tieneFinal(m.codigo);
  const pend = estado === "pendiente";
  const avail = isAvailable(m, state.approved);
  const done = estado === "final" || (estado === "regular" && !has2);
  const debeFinal = estado === "regular" && has2;

  return (
    <li
      className={
        "qrow" +
        (done ? " is-done" : "") +
        (pend && !avail ? " is-locked" : "")
      }
    >
      <EstadoControl code={m.codigo} stopPropagation={false} />
      <button
        type="button"
        className="qrow__open"
        title={`${m.codigo} · ${m.nombre} — ver detalle`}
        onClick={() => dispatch({ type: "OPEN_DRAWER", code: m.codigo })}
      >
        <span className="qrow__code" aria-hidden="true">{m.codigo}</span>
        <span className="qrow__name">{m.nombre}</span>
      </button>
      {debeFinal && <span className="qrow__due">falta final</span>}
      {pend && <AvailLock ok={avail} />}
      <span className="qrow__cr">{m.creditos} cr</span>
    </li>
  );
}
