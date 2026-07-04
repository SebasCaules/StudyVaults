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
  available,
  withLabel = false,
}: {
  code: string;
  className?: string;
  /** frena la propagación del click (útil dentro de cards clickeables). */
  stopPropagation?: boolean;
  /** disponibilidad (correlativas cumplidas). Solo afecta al caso PENDIENTE:
   *  con la etiqueta decide "cursable" (true) vs "requisitos" (false). Ausente
   *  ⇒ comportamiento clásico ("Pendiente", glifo transparente). */
  available?: boolean;
  /** muestra la palabra canónica del estado dentro del control, convirtiéndolo en
   *  un interruptor ancho y etiquetado (hit-area ≥30px) para el plan por cuatri. */
  withLabel?: boolean;
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

  // Variante etiquetada (withLabel): tonos y vocabulario CANÓNICOS, únicos entre la
  // leyenda y las cards del plan por cuatrimestre. El caso pendiente se divide
  // por disponibilidad (cursable / requisitos). Clases `ec-*` propias (no `st-*`)
  // para no chocar con los estilos base del control en planner.css.
  const toneKey =
    estado === "final"
      ? "final"
      : estado === "regular"
        ? has2
          ? "cursada"
          : "promo"
        : available === false
          ? "lock"
          : "ok";
  const word =
    estado === "final"
      ? "final"
      : estado === "regular"
        ? has2
          ? "cursada"
          : "promociona"
        : available === false
          ? "requisitos"
          : "cursable";

  // Variante clásica (sin etiqueta, cuadro 22px): mismas clases de siempre.
  const legacyCls =
    estado === "pendiente"
      ? "st-pending"
      : estado === "final"
        ? "st-final"
        : has2
          ? "st-regular"
          : "st-promo";

  const label =
    estado === "final"
      ? "Final aprobado"
      : estado === "regular"
        ? has2
          ? "Cursada regular — falta el final"
          : "Promociona / terminada"
        : available === false
          ? "Requisitos pendientes — te faltan correlativas"
          : available === true
            ? "Cursable — cumplís las correlativas"
            : "Pendiente";

  const cls =
    "estado-ctl " +
    (withLabel ? "estado-ctl--labeled ec-" + toneKey : legacyCls) +
    (className ? " " + className : "");

  return (
    <button
      type="button"
      className={cls}
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
      {withLabel ? <span className="estado-ctl__w">{word}</span> : null}
    </button>
  );
}
