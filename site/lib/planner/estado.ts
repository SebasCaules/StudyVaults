// Helpers PUROS del estado académico de una materia (2 niveles: cursada/final).
// Viven en lib/ para que los consuman tanto la UI (EstadoControl, vistas) como
// el reducer (state.tsx) sin ciclos de import. Fuente única: no duplicar esta
// lógica en componentes.
import { charsOf } from "@/lib/planner/programa";

/** Estado académico de una materia. Ausente en los sets = "pendiente". */
export type Estado = "pendiente" | "regular" | "final";

/** ¿La materia rinde final (2 niveles) o promociona / no rinde (1 nivel)? */
export function tieneFinal(code: string): boolean {
  const d = charsOf(code);
  if (!d) return true; // sin ficha (típico de obligatorias) → asumimos que rinde final
  if (d.promocionable === true) return false;
  if (d.tieneFinal === false) return false;
  return true;
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
