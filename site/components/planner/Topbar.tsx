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
  const { state } = usePlanner();
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
    </header>
  );
}
