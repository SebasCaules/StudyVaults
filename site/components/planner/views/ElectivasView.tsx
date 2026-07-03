"use client";

import { useMemo } from "react";
import { usePlanner } from "@/components/planner/state";
import { PLAN, hasHorario } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import { FICHAS } from "@/lib/planner/fichas";
import { charsOf } from "@/lib/planner/programa";
import { MinorBadge, MinorBadges } from "@/components/planner/MinorBadge";
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

/** Disponibilidad como candado — silueta propia, distinta del minor y el régimen:
 *  abierto/verde = cursable (cumplís correlativas), cerrado/ámbar = requisitos. */
function AvailLock({ ok }: { ok: boolean }) {
  return (
    <span
      className={"avail-lock " + (ok ? "avail-lock--go" : "avail-lock--wait")}
      role="img"
      aria-label={ok ? "Cursable" : "Requisitos pendientes"}
      title={ok ? "Cursable — cumplís las correlativas" : "Requisitos pendientes: te faltan correlativas"}
    >
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="3.4" y="7.1" width="9.2" height="6.3" rx="1.5" strokeWidth={1.5} />
        {ok ? (
          <path d="M5.6 7.1V5.2a2.4 2.4 0 0 1 4.6-.9" strokeWidth={1.5} />
        ) : (
          <path d="M5.6 7.1V5.2a2.4 2.4 0 0 1 4.8 0V7.1" strokeWidth={1.5} />
        )}
        <circle cx="8" cy="10.1" r=".95" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

/** Ícono de régimen (uno solo): promociona (tilde teal) o con final (lápiz). */
function RegimeIcon({ kind }: { kind: "promo" | "final" }) {
  const promo = kind === "promo";
  return (
    <span
      className={"regime-icon " + (promo ? "regime-icon--promo" : "regime-icon--final")}
      role="img"
      aria-label={promo ? "Promociona" : "Con final"}
      title={promo ? "Promociona (sin examen final)" : "Con examen final"}
    >
      {promo ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 12.5l5 5L20 6.5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 20l4-1 10-10-3-3L5 16l-1 4Z" />
        </svg>
      )}
    </span>
  );
}

/** Leyenda compacta: decodifica de una vez las tres familias de señales de la
 *  card (minor · disponibilidad · régimen) para que cada ícono se lea solo. */
function CardLegend() {
  return (
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
  );
}

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
          {PLAN.electivas.length} materias. Filtrá por área para orientar un
          minor. Cada card lleva tres señales, cada una con su propio ícono; el
          detalle (horario, correlativas) queda a un click.
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
    const appr = approved.has(m.codigo);
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
