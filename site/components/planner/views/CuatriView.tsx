"use client";

import { useMemo, type ReactNode } from "react";
import { usePlanner } from "@/components/planner/state";
import { PLAN, hasHorario } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import { EstadoControl, estadoOf, tieneFinal } from "@/components/planner/EstadoControl";
import { MinorBadges } from "@/components/planner/MinorBadge";
import type { Materia } from "@/lib/planner/types";
import "../cards.css";

/* Glifos de estado, idénticos a los del EstadoControl, para la leyenda. */
const CheckSingleMini = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 8.5 6.5 12 13 4.5" />
  </svg>
);
const CheckDoubleMini = () => (
  <svg viewBox="0 0 24 16" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 8.5 6 12 11.5 4.5" />
    <path d="M9.5 8.5 13 12 18.5 4.5" />
  </svg>
);

/** Ítem de leyenda: mismo chip {glifo+palabra} que muestran las cards. */
function LegendChip({
  tone,
  word,
  glyph,
  gloss,
}: {
  tone: string;
  word: string;
  glyph?: ReactNode;
  gloss: string;
}) {
  return (
    <span className="el-item">
      <span className={"estado-ctl estado-ctl--labeled ec-" + tone} aria-hidden="true">
        {glyph}
        <span className="estado-ctl__w">{word}</span>
      </span>
      <span className="el-gloss">{gloss}</span>
    </span>
  );
}

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
        <h2>Mi avance</h2>
        <p>
          Materias obligatorias del plan, ordenadas por año. Tocá el interruptor
          de cada materia para ir marcando tu avance; cada uno dice en palabras si
          la tenés cursable, cursada o con el final aprobado.
        </p>
      </div>
      <div className="estado-legend" role="note" aria-label="Cómo se lee el estado de cada materia">
        <LegendChip tone="ok" word="cursable" gloss="cumplís las correlativas" />
        <LegendChip tone="lock" word="requisitos" gloss="faltan correlativas" />
        <LegendChip tone="cursada" word="cursada" glyph={<CheckSingleMini />} gloss="falta el final" />
        <LegendChip tone="final" word="final" glyph={<CheckDoubleMini />} gloss="aprobado" />
        <LegendChip tone="promo" word="promociona" glyph={<CheckSingleMini />} gloss="sin final" />
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
  const estado = estadoOf(m.codigo, state.approved, state.finalDone);
  const has2 = tieneFinal(m.codigo);
  const avail = isAvailable(m, state.approved);
  const hor = hasHorario(m.codigo);

  // Correspondencia estado↔estilo (fix tachado): el tachado se RESERVA para lo
  // terminado (final aprobado o promoción, que no rinde final). "Cursada — falta
  // el final" queda solo atenuada, sin tachar (todavía debés algo).
  const terminal = estado === "final" || (estado === "regular" && !has2);
  const cursadaFaltaFinal = estado === "regular" && has2;
  const locked = estado === "pendiente" && !avail;

  return (
    <div
      className={
        "qcard" +
        (terminal ? " appr" : "") +
        (cursadaFaltaFinal ? " is-cursada" : "") +
        (locked ? " locked" : "")
      }
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
        {/* control único y grande (hit-area ≥30px): estado en un solo interruptor
            con la palabra canónica adentro (mismo vocabulario que la leyenda). */}
        <EstadoControl code={m.codigo} withLabel available={avail} />
        <MinorBadges areas={m.areas} variant="logo" />
      </div>
    </div>
  );
}
