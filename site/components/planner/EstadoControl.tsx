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

// Tilde RELLENA (silueta sólida) para el estado terminal de promoción. Distingue
// por FORMA — no sólo color — la materia saldada (promociona / no rinde final)
// de la cursada que todavía debe final (CheckSingle, contorno fino): quedan
// legibles aun sin percibir el color (daltonismo).
export const CheckFilled = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
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

  // Retroceso un paso, SIN pasar por "pendiente" desde "final": el escenario del
  // que vuelve y desaprobó el final (final → regular) es un solo paso, sin borrar
  // la cursada ni cascadear el plan. Desde "pendiente" no hay nada que deshacer.
  const prev = (): Estado | null => {
    if (estado === "pendiente") return null;
    if (!has2) return "pendiente";
    if (estado === "final") return "regular";
    return "pendiente";
  };

  const goBack = () => {
    const p = prev();
    if (p) dispatch({ type: "SET_ESTADO", code, estado: p });
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
          : "Promocionada — no rinde final"
        : "Final aprobado";

  // Retroceso disponible en todo estado avanzado: se documenta en el title
  // (affordance visible) y se expone por clic derecho + tecla Retroceso.
  const canGoBack = estado !== "pendiente";
  const title = canGoBack
    ? `${label} · clic: avanzar · clic derecho o Retroceso: volver atrás`
    : `${label} · clic para marcar cursada`;

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
      title={title}
      onClick={(e) => {
        if (stopPropagation) e.stopPropagation();
        dispatch({ type: "SET_ESTADO", code, estado: next() });
      }}
      onContextMenu={(e) => {
        if (!canGoBack) return;
        e.preventDefault();
        if (stopPropagation) e.stopPropagation();
        goBack();
      }}
      onKeyDown={(e) => {
        // Retroceso por teclado (secundario): Retroceso / flecha abajo.
        if (canGoBack && (e.key === "Backspace" || e.key === "ArrowDown")) {
          e.preventDefault();
          if (stopPropagation) e.stopPropagation();
          goBack();
        }
      }}
    >
      {estado === "final" ? (
        <CheckDouble />
      ) : estado === "regular" ? (
        has2 ? (
          <CheckSingle />
        ) : (
          <CheckFilled />
        )
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
