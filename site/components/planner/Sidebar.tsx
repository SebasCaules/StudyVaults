"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { usePlanner } from "./state";
import { PLAN, AREA_COLOR, credOf, byId } from "@/lib/planner/model";
import { electiveCredits } from "@/lib/planner/metrics";
import type { ViewKey } from "@/lib/planner/types";

const VIEWS: { view: ViewKey; label: string }[] = [
  { view: "cuatri", label: "Plan por cuatrimestre" },
  { view: "elect", label: "Electivas" },
  { view: "combo", label: "Combinador de horarios" },
  { view: "plan", label: "Plan de cursada" },
  { view: "grafo", label: "Correlativas" },
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

  return (
    <aside className="side">
      <button
        className="sidetoggle"
        aria-label="Mostrar u ocultar el panel"
        title="Mostrar / ocultar panel"
        onClick={() => dispatch({ type: "TOGGLE_SIDEBAR" })}
      >
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <line x1="9.5" y1="4" x2="9.5" y2="20" />
        </svg>
      </button>

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

      <nav className="views">
        {VIEWS.map((v) => (
          <button
            key={v.view}
            className={"view" + (view === v.view ? " is-active" : "")}
            onClick={() => dispatch({ type: "SET_VIEW", view: v.view })}
          >
            {v.label}
          </button>
        ))}
      </nav>

      <section className="block">
        <div className="block__h">Filtros</div>
        <label className="chk">
          <input type="checkbox" checked readOnly />
          <span>Obligatorias</span>
        </label>
        <label className="chk">
          <input type="checkbox" checked readOnly />
          <span>Electivas</span>
        </label>
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

      <section className="block">
        <div className="block__h">Áreas · Minors</div>
        <div className="areas">
          {PLAN.areas.map((a) => (
            <button
              key={a}
              className={"area-pill" + (areasOn.has(a) ? "" : " off")}
              onClick={() => dispatch({ type: "TOGGLE_AREA", area: a })}
            >
              <span className="swatch" style={{ background: AREA_COLOR[a] }} />
              {a}
            </button>
          ))}
        </div>
      </section>

      <section className="block">
        <div className="block__h">Progreso de minors</div>
        <div className="minors">
          {PLAN.areas.map((a) => {
            const s = minorCred[a] || 0;
            return (
              <div className="minor" key={a}>
                <div className="minor__top">
                  <span>{a}</span>
                  <b>{s}/14</b>
                </div>
                <div className="minibar">
                  <i
                    style={{
                      width: Math.min(100, (s / 14) * 100) + "%",
                      background: AREA_COLOR[a],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="block">
        <div className="block__h">
          Electivas <span className="hk">27 créditos</span>
        </div>
        <div className="bar">
          <div
            className="bar__fill"
            style={{ width: Math.min(100, (ec / 27) * 100) + "%" }}
          />
        </div>
        <p className="muted">
          {ec} / 27{ec >= 27 ? " · completo" : ""}
        </p>
      </section>

      <button
        className="reset"
        onClick={() => {
          if (
            !window.confirm(
              "¿Restablecer las materias aprobadas a tu estado actual (1.º a 3.º + economía, derecho, simulación, ISW II)?"
            )
          )
            return;
          dispatch({ type: "RESET_APPROVED" });
        }}
      >
        Restablecer materias aprobadas
      </button>

      <p className="foot">
        Horarios del SGA, 2.<sup>do</sup> cuatrimestre 2026. El progreso se guarda
        en este navegador.
      </p>
    </aside>
  );
}
