// Helpers PUROS del estado académico de una materia (2 niveles: cursada/final).
// Viven en lib/ para que los consuman tanto la UI (EstadoControl, vistas) como
// el reducer (state.tsx) sin ciclos de import. Fuente única: no duplicar esta
// lógica en componentes.
import { CODIGOS_CON_FINAL } from "@/lib/planner/finalesFlags";
import { byId } from "@/lib/planner/model";
import { charsOf } from "@/lib/planner/programa";

/** Estado académico de una materia. Ausente en los sets = "pendiente". */
export type Estado = "pendiente" | "regular" | "final";

/** ¿La materia rinde final (2 niveles) o promociona / no rinde (1 nivel)?
 *  Prioridad de señales:
 *  1. Planilla oficial de finales: hay mesa publicada ⇒ rinde final. Manda por
 *     sobre la ficha — una materia "promocionable" con mesa en realidad tiene
 *     final reducido, no exención de final.
 *  2. Obligatoria SIN mesa ⇒ no rinde (la planilla cubre todas las obligatorias
 *     dictadas: Proyecto Final, Práctica Laboral, FG, Inglés no tienen mesa).
 *  3. Electiva sin mesa (p. ej. no dictada este ciclo): decide su ficha. */
export function tieneFinal(code: string): boolean {
  if (CODIGOS_CON_FINAL.has(code)) return true;
  if (byId.get(code)?.tipo === "obligatoria") return false;
  const d = charsOf(code);
  if (!d) return true; // electiva sin ficha ni mesa → asumimos que rinde final
  if (d.promocionable === true) return false;
  if (d.tieneFinal === false) return false;
  return true;
}

/** Finales aprobados "efectivos" para correlativas de final: los rendidos
 *  (`finalDone`) + las materias aprobadas que NO rinden final (promocionables /
 *  sin final) — su cursada aprobada cuenta como final aprobado. */
export function finalesAprobados(
  approved: Set<string>,
  finalDone: Set<string>,
): Set<string> {
  const out = new Set(finalDone);
  for (const c of approved) if (!tieneFinal(c)) out.add(c);
  return out;
}

/** Estado actual de una materia derivado de approved + finalDone. */
export function estadoOf(
  code: string,
  approved: Set<string>,
  finalDone: Set<string>,
): Estado {
  if (finalDone.has(code)) return "final";
  if (approved.has(code)) return "regular";
  return "pendiente";
}
