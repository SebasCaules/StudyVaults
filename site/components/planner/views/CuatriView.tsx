"use client";

import { useMemo } from "react";
import { usePlanner } from "@/components/planner/state";
import { PLAN, hasHorario } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import { EstadoControl, estadoOf, tieneFinal } from "@/components/planner/EstadoControl";
import { MinorBadges } from "@/components/planner/MinorBadge";
import type { Materia } from "@/lib/planner/types";
import "../cards.css";

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
          Materias obligatorias del plan, ordenadas por año. Cliqueá el control
          de cada materia para ir marcando tu avance; cada card dice en palabras
          si tenés la cursada o también el final.
        </p>
      </div>
      <div className="estado-legend" role="note" aria-label="Cómo leer el estado de cada materia">
        <span className="el-item">
          <span className="estado-ctl st-regular" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
          </span>
          <b>✓ cursada</b> — falta el final
        </span>
        <span className="el-sep" aria-hidden="true" />
        <span className="el-item">
          <span className="estado-ctl st-final" aria-hidden="true">
            <svg viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 8.5 6 12 11.5 4.5" /><path d="M9.5 8.5 13 12 18.5 4.5" /></svg>
          </span>
          <b>✓✓ final</b> — aprobado
        </span>
        <span className="el-sep" aria-hidden="true" />
        <span className="el-item">
          <span className="estado-ctl st-promo" aria-hidden="true">
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><path d="M3 8.5 6.5 12 13 4.5" /></svg>
          </span>
          <b>promociona</b> — sin final
        </span>
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
  const estado = estadoOf(m.codigo, state.approved, state.finalDone);
  const has2 = tieneFinal(m.codigo);

  // Etiqueta de texto: hace explícito cursada vs final (no depende solo del ícono).
  const status: { cls: string; label: string; title: string } =
    estado === "final"
      ? { cls: "tag--final", label: "✓✓ final", title: "Final aprobado" }
      : estado === "regular"
        ? has2
          ? { cls: "tag--reg", label: "✓ cursada", title: "Cursada aprobada — falta el final" }
          : { cls: "tag--promo", label: "promociona", title: "Aprobada por promoción (sin final)" }
        : locked
          ? { cls: "tag--lock", label: "requisitos", title: "Requisitos pendientes" }
          : { cls: "tag--ok", label: "cursable", title: "Cursable — cumplís las correlativas" };

  return (
    <div
      className={"qcard" + (appr ? " appr" : "") + (locked ? " locked" : "")}
      onClick={(e) => {
        if (!(e.target as HTMLElement).closest("button"))
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
        <EstadoControl code={m.codigo} />
        <span className={"tag " + status.cls} title={status.title}>{status.label}</span>
        <MinorBadges areas={m.areas} variant="logo" />
      </div>
    </div>
  );
}
