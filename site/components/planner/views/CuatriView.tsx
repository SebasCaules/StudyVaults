"use client";

import { useMemo } from "react";
import { usePlanner } from "@/components/planner/state";
import { PLAN, hasHorario } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import type { Materia } from "@/lib/planner/types";

export default function CuatriView() {
  const { state } = usePlanner();
  const { approved, search, fDisp, fHor } = state;

  const groups = useMemo(() => {
    const q = search.toLowerCase();
    const passSearch = (m: Materia) =>
      !q || `${m.codigo} ${m.nombre} ${m.abbr}`.toLowerCase().includes(q);

    let list = PLAN.obligatorias.filter(passSearch);
    if (fDisp)
      list = list.filter((m) => isAvailable(m, approved) || approved.has(m.codigo));
    if (fHor) list = list.filter((m) => hasHorario(m.codigo));

    const map: Record<string, Materia[]> = {};
    list.forEach((m) => {
      (map[`${m.anio}.${m.cuatri}`] ||= []).push(m);
    });
    const keys = Object.keys(map).sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true })
    );
    return keys.map((k) => {
      const ms = map[k].slice().sort((a, b) => a.codigo.localeCompare(b.codigo));
      const [anio, cuatri] = k.split(".");
      const aprob = ms.filter((m) => approved.has(m.codigo)).length;
      return { key: k, ms, anio, cuatri, aprob };
    });
  }, [approved, search, fDisp, fHor]);

  return (
    <section className="view-panel">
      <div className="panel-head">
        <h2>Plan por cuatrimestre</h2>
        <p>
          Materias obligatorias del plan, ordenadas por año. Marcá las aprobadas
          para ver tu avance y qué queda habilitado.
        </p>
      </div>
      <div className="cuatri-grid">
        {groups.length === 0 ? (
          <div className="empty">No hay obligatorias que cumplan los filtros.</div>
        ) : (
          groups.map((g) => (
            <div className="qcol" key={g.key}>
              <div className="qcol__h">
                <div>
                  <div className="ciclo">{g.ms[0].ciclo}</div>
                  <h3>
                    Año {g.anio} · {g.cuatri}.º cuat.
                  </h3>
                </div>
                <div className="qc">
                  {g.aprob}/{g.ms.length}
                </div>
              </div>
              <div className="qcol__body">
                {g.ms.map((m) => (
                  <QCard key={m.codigo} m={m} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function QCard({ m }: { m: Materia }) {
  const { state, dispatch } = usePlanner();
  const appr = state.approved.has(m.codigo);
  const avail = isAvailable(m, state.approved);
  const locked = !appr && !avail;
  const hor = hasHorario(m.codigo);

  return (
    <div
      className={"qcard" + (appr ? " appr" : "") + (locked ? " locked" : "")}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("label"))
          dispatch({ type: "OPEN_DRAWER", code: m.codigo });
      }}
    >
      <div className="qcard__top">
        <span className="code">
          {m.codigo} · {m.abbr}
        </span>
        <span className="card__cred">
          {m.creditos} cr{hor ? " ·" : ""}
          {hor && <span className="hor-dot" />}
        </span>
      </div>
      <p className="qcard__n">{m.nombre}</p>
      <div className="qcard__f">
        <label>
          <input
            type="checkbox"
            className="chk-ap"
            checked={appr}
            onChange={(e) => {
              e.stopPropagation();
              dispatch({ type: "TOGGLE_APPROVED", code: m.codigo });
            }}
          />{" "}
          aprobada
        </label>
        {locked ? (
          <span className="tag tag--lock">requisitos</span>
        ) : appr ? null : (
          <span className="tag tag--ok">cursable</span>
        )}
      </div>
    </div>
  );
}
