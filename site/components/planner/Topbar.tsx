"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePlanner } from "./state";
import { PLAN } from "@/lib/planner/model";
import {
  approvedCredits,
  electiveCredits,
  availableCount,
} from "@/lib/planner/metrics";

// créditos electivos requeridos por el plan de estudios (misma fuente que PlanView)
const ELEC_REQ = PLAN.creditosElectivasReq ?? 27;

/** Barra superior con las cuatro tarjetas de métricas (port de updateMetrics)
 *  y el botón "Compartir" (la URL ya refleja vista/filtros/drawer → deep-link). */
export default function Topbar() {
  const { state } = usePlanner();
  const { approved } = state;
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimer.current) clearTimeout(copiedTimer.current);
    };
  }, []);

  const statCreditos = useMemo(() => approvedCredits(approved), [approved]);
  const statElec = useMemo(
    () => Math.min(electiveCredits(approved), ELEC_REQ),
    [approved]
  );
  const statDisp = useMemo(() => availableCount(approved), [approved]);
  const statRestan = useMemo(
    () => PLAN.obligatorias.filter((m) => !approved.has(m.codigo)).length,
    [approved]
  );

  const handleShare = () => {
    if (typeof window === "undefined" || typeof navigator === "undefined")
      return;
    if (!navigator.clipboard) return;
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopied(true);
        if (copiedTimer.current) clearTimeout(copiedTimer.current);
        copiedTimer.current = setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {
        /* clipboard bloqueado (permisos/HTTP) — sin feedback, sin romper nada */
      });
  };

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
            <i>&#8202;/&#8202;{ELEC_REQ}</i>
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
      <button
        type="button"
        className={`share-btn${copied ? " is-copied" : ""}`}
        onClick={handleShare}
        aria-label="Copiar el link de esta vista del planificador"
      >
        {copied ? (
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg
            viewBox="0 0 24 24"
            width="14"
            height="14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
            <path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
          </svg>
        )}
        <span aria-live="polite">{copied ? "¡Copiado!" : "Compartir"}</span>
      </button>
    </header>
  );
}
