"use client";

import { useMemo } from "react";
import { usePlanner } from "./state";
import { PLAN } from "@/lib/planner/model";
import {
  approvedCredits,
  electiveCredits,
  availableCount,
} from "@/lib/planner/metrics";

/** Barra superior con las cuatro tarjetas de métricas (port de updateMetrics). */
export default function Topbar() {
  const { state, dispatch } = usePlanner();
  const { approved } = state;

  const statCreditos = useMemo(() => approvedCredits(approved), [approved]);
  const statElec = useMemo(
    () => Math.min(electiveCredits(approved), 27),
    [approved]
  );
  const statDisp = useMemo(() => availableCount(approved), [approved]);
  const statRestan = useMemo(
    () => PLAN.obligatorias.filter((m) => !approved.has(m.codigo)).length,
    [approved]
  );

  return (
    <header className="topbar">
      <div className="stats">
        <div className="stat">
          <span className="stat__num">{statCreditos}</span>
          <span className="stat__lbl">Créditos aprobados</span>
        </div>
        <div className="stat">
          <span className="stat__num">
            <span>{statElec}</span>
            <i>&#8202;/&#8202;27</i>
          </span>
          <span className="stat__lbl">Créditos electivos</span>
        </div>
        <div className="stat">
          <span className="stat__num">{statDisp}</span>
          <span className="stat__lbl">Disponibles</span>
        </div>
        <div className="stat">
          <span className="stat__num">{statRestan}</span>
          <span className="stat__lbl">Obligatorias restantes</span>
        </div>
      </div>

      {state.sideCollapsed && (
        <button
          type="button"
          className="panelshow"
          aria-label="Mostrar el panel de control"
          title="Mostrar panel"
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
          Mostrar panel
        </button>
      )}
    </header>
  );
}
