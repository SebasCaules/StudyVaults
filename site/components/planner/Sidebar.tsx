"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { usePlanner } from "./state";
import { PLAN, AREA_COLOR, credOf, byId } from "@/lib/planner/model";
import { electiveCredits } from "@/lib/planner/metrics";
import { MINOR_REQ } from "@/lib/planner/minors";
import type { ViewKey } from "@/lib/planner/types";

// créditos electivos requeridos por el plan de estudios (misma fuente que PlanView)
const ELEC_REQ = PLAN.creditosElectivasReq ?? 27;

// Labels = título (H1) de cada vista, para que el usuario confirme que aterrizó
// donde clickeó (consistencia nav↔página). "Mi avance" ≠ "Plan de cursada":
// el primero es el estado actual, el segundo el roadmap a futuro.
const VIEWS: { view: ViewKey; label: string }[] = [
  { view: "cuatri", label: "Mi avance" },
  { view: "elect", label: "Electivas" },
  { view: "combo", label: "Combinador de horarios" },
  { view: "finales", label: "Combinador de finales" },
  { view: "plan", label: "Plan de cursada" },
  { view: "grafo", label: "Mapa de correlativas" },
  { view: "ref", label: "Referencias" },
];

/**
 * Panel de control izquierdo. Port de renderAreas, renderMinorSkeleton, las
 * partes de minors/electivas de updateMetrics y los binds de
 * búsqueda/filtros/reset/vistas de bindUI.
 */
export default function Sidebar() {
  const { state, dispatch } = usePlanner();
  const { approved, areasOn, view, fDisp, fHor, search } = state;

  // Búsqueda con debounce ~140ms y timer local, como el original.
  const [searchInput, setSearchInput] = useState(search);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Si el estado de búsqueda cambia desde fuera (p. ej. reset), refleja el input.
  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  const onSearch = (value: string) => {
    setSearchInput(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      dispatch({ type: "SET_SEARCH", value: value.trim().toLowerCase() });
    }, 140);
  };

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  // Progreso de minors: créditos electivos aprobados por área (sobre 14).
  const minorCred = useMemo(() => {
    const out: Record<string, number> = {};
    // Recorrido fiel a updateMetrics.
    PLAN.areas.forEach((a) => {
      let s = 0;
      approved.forEach((c) => {
        const m = byId.get(c);
        if (m && m.tipo === "electiva" && (m.areas || []).includes(a))
          s += credOf(c);
      });
      out[a] = s;
    });
    return out;
  }, [approved]);

  const ec = useMemo(() => electiveCredits(approved), [approved]);

  // Sidebar modular: cada vista muestra solo los controles que consume.
  //  · búsqueda + filtros → solo "Mi avance" (Electivas tiene su propia barra
  //    de filtros en contexto, arriba de la grilla — no duplicar controles).
  //  · áreas/minors + gauge de electivas → solo "Electivas" (aporta el
  //    progreso de créditos por área, que la barra in-view no muestra).
  //  · el resto de las vistas (combinador/plan/correlativas/referencias) tienen
  //    su propia búsqueda interna, así que el rail queda solo con la navegación.
  const showFilters = view === "cuatri";
  const showElect = view === "elect";

  return (
    <aside className="side">
      <div className="side__head">
        <span className="side__title">Panel de control</span>
        <button
          type="button"
          className="side__collapse"
          aria-label="Ocultar el panel de control"
          title="Ocultar panel"
          onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
        >
          <svg
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <path
              d="M14.5 6.5 9 12l5.5 5.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {showFilters && (
        <div className="field">
          <svg
            className="field__ic"
            viewBox="0 0 24 24"
            width="15"
            height="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            type="text"
            placeholder="Buscar código o materia"
            autoComplete="off"
            value={searchInput}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      )}

      <nav className="views">
        {VIEWS.map((v, i) => (
          <button
            key={v.view}
            className={"view" + (view === v.view ? " is-active" : "")}
            onClick={() => dispatch({ type: "SET_VIEW", view: v.view })}
          >
            <span className="view__ix" aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="view__lb">{v.label}</span>
          </button>
        ))}
      </nav>

      {showFilters && (
        <section className="block">
          <div className="block__h"><span>Filtros</span></div>
          <label className="chk">
            <input
              type="checkbox"
              checked={fDisp}
              onChange={(e) =>
                dispatch({ type: "SET_FILTER", key: "fDisp", value: e.target.checked })
              }
            />
            <span>Solo disponibles</span>
          </label>
          <label className="chk">
            <input
              type="checkbox"
              checked={fHor}
              onChange={(e) =>
                dispatch({ type: "SET_FILTER", key: "fHor", value: e.target.checked })
              }
            />
            <span>Solo con horario 2C&nbsp;2026</span>
          </label>
        </section>
      )}

      {showElect && (
        <>
      <section className="block">
        <div className="block__h"><span>Minors · áreas</span></div>
        <div className="minors">
          {PLAN.areas.map((a) => {
            const s = minorCred[a] || 0;
            const on = areasOn.has(a);
            return (
              <button
                type="button"
                key={a}
                className={"minrow" + (on ? "" : " off")}
                aria-pressed={on}
                title={on ? "Ocultar esta área del filtro" : "Incluir esta área en el filtro"}
                onClick={() => dispatch({ type: "TOGGLE_AREA", area: a })}
              >
                <span className="minrow__top">
                  <span className="swatch" style={{ background: AREA_COLOR[a] }} />
                  <span className="minrow__name">{a}</span>
                  <b>{s}/{MINOR_REQ}</b>
                </span>
                <span className="minibar">
                  <i
                    style={{
                      width: Math.min(100, (s / MINOR_REQ) * 100) + "%",
                      background: AREA_COLOR[a],
                    }}
                  />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="block side__gauge">
        <div className="block__h">
          <span>Electivas</span>
        </div>
        <div className="gauge__read">
          <b>{ec}</b>
          <span className="gauge__of">/ {ELEC_REQ} créditos</span>
          {ec >= ELEC_REQ ? <span className="gauge__done">completo</span> : null}
        </div>
        <div className="bar">
          <div
            className="bar__fill"
            style={{ width: Math.min(100, (ec / ELEC_REQ) * 100) + "%" }}
          />
        </div>
      </section>
        </>
      )}

      {/* región propia al pie: acción destructiva separada de la navegación
          (que no se lea como un 8.º ítem del nav) */}
      <div className="side__danger">
        <button
          className="reset"
          onClick={() => {
            if (
              !window.confirm(
                "¿Restablecer todas las materias a pendiente? Esta acción no se puede deshacer."
              )
            )
              return;
            dispatch({ type: "RESET_APPROVED" });
          }}
        >
          Restablecer materias aprobadas
        </button>
      </div>

      <p className="foot">
        Horarios del SGA, 2.<sup>do</sup> cuatrimestre 2026. El progreso se guarda
        en este navegador.
      </p>
    </aside>
  );
}
