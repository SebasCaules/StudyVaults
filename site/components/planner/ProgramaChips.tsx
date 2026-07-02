"use client";

// Chips de características derivadas del programa analítico + badge "coming soon".
// Fuente única de verdad para DetailDrawer, FichaReader, ElectivasView y el
// Combinador, así el lenguaje visual queda consistente en toda la app.
// La derivación es heurística (ver lib/planner/programa.ts): se muestra un chip
// SOLO cuando la señal aparece explícita en el texto del programa; nunca se infiere.

import { charsOf, hasPrograma } from "@/lib/planner/programa";

/** Badge para materias sin programa analítico disponible ("próximamente"). */
export function ComingSoonBadge({ short = false }: { short?: boolean }) {
  return (
    <span className="prog-soon" title="El programa analítico todavía no está cargado">
      {short ? "Programa próx." : "Programa próximamente"}
    </span>
  );
}

/** Chips de características (régimen, asistencia, evaluación) de una materia.
 *  - Si no tiene ficha: no renderiza nada (usar <ComingSoonBadge/> aparte).
 *  - `eval` controla si se muestran los chips secundarios (Parcial/TP). */
export function ProgramaChips({
  codigo,
  showEval = true,
}: {
  codigo: string;
  showEval?: boolean;
}) {
  const d = charsOf(codigo);
  if (!hasPrograma(codigo) || !d) return null;

  const chips: { label: string; cls: string; title?: string }[] = [];

  if (d.promocionable === true) {
    chips.push({
      label: "Promociona",
      cls: "prog-chip--promo",
      title: "Se aprueba sin examen final (según el programa)",
    });
  } else if (d.tieneFinal) {
    chips.push({
      label: "Con final",
      cls: "prog-chip--final",
      title: "El programa menciona examen final",
    });
  }

  if (d.asistenciaObligatoria === true) {
    chips.push({
      label:
        d.asistenciaPct != null ? `Asistencia ${d.asistenciaPct}%` : "Asistencia",
      cls: "prog-chip--asist",
      title:
        d.asistenciaPct != null
          ? `Requiere ${d.asistenciaPct}% de asistencia`
          : "Requiere asistencia / presentismo",
    });
  }

  if (showEval) {
    if (d.tieneParcial)
      chips.push({ label: "Parcial", cls: "prog-chip--eval" });
    if (d.tieneTP) chips.push({ label: "TP", cls: "prog-chip--eval" });
  }

  if (!chips.length) return null;

  return (
    <div className="prog-chips">
      {chips.map((c, i) => (
        <span key={i} className={"prog-chip " + c.cls} title={c.title}>
          {c.label}
        </span>
      ))}
    </div>
  );
}
