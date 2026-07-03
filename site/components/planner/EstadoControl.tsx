"use client";

// Control tri-estado (doble-check estilo WhatsApp) para marcar el avance real de
// una materia en la pestaña de aprobadas:
//   pendiente → ✓ cursada regular (falta el final) → ✓✓ final aprobado → pendiente
// Las materias que promocionan / no rinden final tienen un solo nivel terminal
// (una tilde teal). Fuente única del control; lo consume CuatriView (aprobadas)
// y puede reusarlo la vista de finales.
import { usePlanner, type Estado } from "@/components/planner/state";
import { charsOf } from "@/lib/planner/programa";

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

const CheckSingle = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 8.5L6.5 12L13 4.5" />
  </svg>
);

const CheckDouble = () => (
  <svg
    viewBox="0 0 24 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.2}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M2.5 8.5L6 12L11.5 4.5" />
    <path d="M9.5 8.5L13 12L18.5 4.5" />
  </svg>
);

export function EstadoControl({
  code,
  className,
  stopPropagation = true,
}: {
  code: string;
  className?: string;
  /** frena la propagación del click (útil dentro de cards clickeables). */
  stopPropagation?: boolean;
}) {
  const { state, dispatch } = usePlanner();
  const has2 = tieneFinal(code);
  const estado = estadoOf(code, state.approved, state.finalDone);

  const next = (): Estado => {
    if (!has2) return estado === "pendiente" ? "regular" : "pendiente";
    if (estado === "pendiente") return "regular";
    if (estado === "regular") return "final";
    return "pendiente";
  };

  const stateCls =
    estado === "pendiente"
      ? "st-pending"
      : estado === "final"
        ? "st-final"
        : has2
          ? "st-regular"
          : "st-promo";

  const label =
    estado === "pendiente"
      ? "Pendiente"
      : estado === "regular"
        ? has2
          ? "Cursada regular — falta el final"
          : "Promociona / terminada"
        : "Final aprobado";

  return (
    <button
      type="button"
      className={"estado-ctl " + stateCls + (className ? " " + className : "")}
      role="checkbox"
      aria-checked={estado !== "pendiente"}
      aria-label={label}
      title={label}
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        dispatch({ type: "SET_ESTADO", code, estado: next() });
      }}
    >
      {estado === "final" ? (
        <CheckDouble />
      ) : estado !== "pendiente" ? (
        <CheckSingle />
      ) : null}
    </button>
  );
}
