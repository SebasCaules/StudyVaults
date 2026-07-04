"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePlanner } from "@/components/planner/state";
import { EstadoControl } from "@/components/planner/EstadoControl";
import { estadoOf, tieneFinal } from "@/lib/planner/estado";
import { PLAN, hasHorario } from "@/lib/planner/model";
import { isAvailable } from "@/lib/planner/metrics";
import { charsOf } from "@/lib/planner/programa";
import { MinorBadges } from "@/components/planner/MinorBadge";
import { MinorIcon } from "@/components/planner/MinorIcon";
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
 *  abierto/verde = cursable (cumplís correlativas), cerrado/ámbar = requisitos.
 *  `decorative` lo vuelve un ícono mudo (cuando el texto vecino ya lo nombra). */
function AvailLock({ ok, decorative }: { ok: boolean; decorative?: boolean }) {
  return (
    <span
      className={"avail-lock " + (ok ? "avail-lock--go" : "avail-lock--wait")}
      role={decorative ? undefined : "img"}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : ok ? "Cursable" : "Requisitos pendientes"}
      title={
        decorative
          ? undefined
          : ok
            ? "Cursable — cumplís las correlativas"
            : "Requisitos pendientes: te faltan correlativas"
      }
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

/** Barra de filtros de electivas: control Y leyenda a la vez, en contexto sobre
 *  la grilla (antes los filtros vivían solo en el sidebar, a 800px).
 *   · buscador inline (debounce local, como el del Sidebar) → SET_SEARCH
 *   · pills de minor clickeables (con su glyph, que además hace de leyenda) → TOGGLE_AREA
 *   · chips "solo disponibles" / "con horario" → SET_FILTER
 *  La vista ya filtra por estos estados; acá solo se suman los controles. */
function ElectFilterBar() {
  const { state, dispatch } = usePlanner();
  const { areasOn, search, fDisp, fHor } = state;

  // Búsqueda con debounce ~140ms y timer local (mismo patrón que el Sidebar).
  const [searchInput, setSearchInput] = useState(search);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => setSearchInput(search), [search]);
  const onSearch = (value: string) => {
    setSearchInput(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      dispatch({ type: "SET_SEARCH", value: value.trim().toLowerCase() });
    }, 140);
  };
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  return (
    <div className="efbar">
      <div className="efbar__search">
        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <input
          type="text"
          placeholder="Buscar código o materia"
          autoComplete="off"
          aria-label="Buscar electiva por código o nombre"
          value={searchInput}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="efbar__pills" role="group" aria-label="Filtrar por minor">
        {MINORS.map((m) => {
          const on = areasOn.has(m.id);
          return (
            <button
              type="button"
              key={m.id}
              className="efb-pill"
              aria-pressed={on}
              title={on ? `Ocultar ${m.name}` : `Mostrar ${m.name}`}
              style={{ ["--minor-color" as string]: m.color }}
              onClick={() => dispatch({ type: "TOGGLE_AREA", area: m.id })}
            >
              <MinorIcon minor={m} className="efb-pill__glyph" />
              <span>{m.short}</span>
            </button>
          );
        })}
      </div>

      <div className="efbar__chips" role="group" aria-label="Filtros de la grilla">
        <button
          type="button"
          className="efb-chip"
          aria-pressed={fDisp}
          title="Mostrar solo materias cuyas correlativas ya cumplís"
          onClick={() => dispatch({ type: "SET_FILTER", key: "fDisp", value: !fDisp })}
        >
          <AvailLock ok decorative />
          solo disponibles
        </button>
        <button
          type="button"
          className="efb-chip"
          aria-pressed={fHor}
          title="Mostrar solo materias con horario publicado para 2C 2026"
          onClick={() => dispatch({ type: "SET_FILTER", key: "fHor", value: !fHor })}
        >
          <span className="hor-dot" aria-hidden="true" />
          con horario
        </button>
      </div>
    </div>
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
        <h2>Electivas</h2>
        <p>
          {PLAN.electivas.length} materias. Filtrá por minor, disponibilidad u
          horario desde la barra de acá abajo. En cada card marcás tu avance con
          el interruptor de estado, la sumás al combinador de horarios, y tocás
          el título para ver horarios y correlativas.
        </p>
      </div>
      <ElectFilterBar />
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
    const estado = estadoOf(m.codigo, approved, finalDone);
    const has2 = tieneFinal(m.codigo);
    // Correspondencia estado↔estilo (misma regla que el plan por cuatrimestre):
    // el tachado se reserva para lo TERMINADO (final aprobado o promoción);
    // "cursada — falta el final" queda atenuada sin tachar.
    const terminal = estado === "final" || (estado === "regular" && !has2);
    const cursadaFaltaFinal = estado === "regular" && has2;
    const avail = isAvailable(m, approved);
    const inCombo = combo.has(m.codigo);
    const hor = hasHorario(m.codigo);
    const reg = regimeOf(m.codigo);
    const openDrawer = () => dispatch({ type: "OPEN_DRAWER", code: m.codigo });
    return (
      <article
        className={
          "card t-electiva" +
          (terminal ? " appr" : "") +
          (cursadaFaltaFinal ? " is-cursada" : "")
        }
        onClick={(e) => {
          if (!(e.target as HTMLElement).closest("button")) openDrawer();
        }}
      >
        <div className="card__top">
          <span className="code">{m.codigo}</span>
          <span className="card__cred">{m.creditos} cr</span>
        </div>
        {/* zona principal = link al detalle (hit-area grande, sin botón fantasma) */}
        <button
          type="button"
          className="card__title"
          aria-label={`${m.nombre} — ver horarios y correlativas`}
          onClick={openDrawer}
        >
          <span className="card__abbr">{m.abbr}</span>
          <span className="card__name">{m.nombre}</span>
        </button>
        <div className="card__meta">
          <MinorBadges areas={m.areas} variant="logo" />
          {reg ? <RegimeIcon kind={reg} /> : null}
        </div>
        <div className="card__acts">
          {/* dos controles DISTINTOS, mismos que el resto de la app:
              · estado académico — interruptor canónico etiquetado (idéntico al
                del plan por cuatrimestre); en pendiente nombra la disponibilidad
                (cursable/requisitos), así que el candado del meta ya no hace falta.
              · combinar — agregar/quitar del combinador de horarios (on/off). */}
          <EstadoControl code={m.codigo} withLabel available={avail} />
          <button
            type="button"
            className="co-toggle"
            aria-pressed={inCombo}
            disabled={!hor}
            title={
              !hor
                ? "Sin horario publicado para 2C 2026"
                : inCombo
                  ? "Quitar del combinador de horarios"
                  : "Agregar al combinador de horarios"
            }
            onClick={(e) => {
              e.stopPropagation();
              if (hor) dispatch({ type: "TOGGLE_COMBO", code: m.codigo });
            }}
          >
            <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              {inCombo ? <path d="M3 8.5 6.5 12 13 4.5" /> : <path d="M8 3.5v9M3.5 8h9" />}
            </svg>
            Combinar
          </button>
        </div>
      </article>
    );
  }
}
