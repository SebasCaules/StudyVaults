"use client";

// Control tri-estado (doble-check estilo WhatsApp) para marcar el avance real de
// una materia en la pestaña de aprobadas:
//   pendiente → ✓ cursada regular (falta el final) → ✓✓ final aprobado → pendiente
// Las materias que promocionan / no rinden final tienen un solo nivel terminal
// (una tilde teal). Fuente única del control; lo consume CuatriView (aprobadas)
// y puede reusarlo la vista de finales.
import { usePlanner } from "@/components/planner/state";
import { estadoOf, tieneFinal, type Estado } from "@/lib/planner/estado";

// Re-export de compatibilidad: la fuente única ahora es lib/planner/estado.ts
// (helpers puros, consumibles también por el reducer sin ciclos de import).
export { estadoOf, tieneFinal };

export const CheckSingle = () => (
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

export const CheckDouble = () => (
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

  // Tri-estado real para lectores de pantalla: sin avance = false; cursada que
  // todavía debe final = "mixed" (parcial); final/promoción/terminada = true.
  const ariaChecked: boolean | "mixed" =
    estado === "pendiente" ? false : estado === "regular" && has2 ? "mixed" : true;

  return (
    <button
      type="button"
      className={"estado-ctl " + stateCls + (className ? " " + className : "")}
      role="checkbox"
      aria-checked={ariaChecked}
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
      ) : (
        // Affordance de "agregable": un + fantasma señala que el círculo hueco
        // es clickeable (un toque lo marca cursada). Su opacidad la fija cards.css.
        <svg
          className="ctl-plus"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M8 4.2v7.6M4.2 8h7.6" />
        </svg>
      )}
    </button>
  );
}
