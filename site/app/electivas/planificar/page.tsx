import type { CSSProperties } from "react";
import type { Metadata } from "next";
import PlannerApp from "@/components/planner/PlannerApp";

export const metadata: Metadata = {
  title: "Planificador de electivas",
  description:
    "Planificador de la carrera de Ingeniería en Informática del ITBA: mapa de correlativas, áreas y minors, cómputo de créditos, armado del horario cuatrimestral y combinación de finales.",
};

// Oculto a la vista y a AT (aria-hidden): existe solo para que la búsqueda
// global (Pagefind en "body mode") indexe esta ruta, que de otro modo es una
// app 100% client-side sin texto server-rendered en el HTML estático.
const srOnly: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0,0,0,0)",
  whiteSpace: "nowrap",
  border: 0,
};

/** La herramienta real. La pseudo-landing explicativa vive en /electivas y
 *  enlaza acá con su CTA (ver app/electivas/page.tsx). */
export default function PlanificarPage() {
  return (
    <>
      <div
        data-pagefind-body
        data-pagefind-filter="materia:Electivas"
        aria-hidden="true"
        style={srOnly}
      >
        <h1 data-pagefind-meta="title">Planificador de electivas</h1>
        <p>
          Combinador de horarios y planificador de la cursada de Ingeniería en
          Informática del ITBA: mapa de correlativas, áreas y minors, cómputo de
          créditos, armado del horario cuatrimestral sin choques y combinación
          de finales. Elegí tus materias aprobadas y armá tu plan.
        </p>
      </div>
      <PlannerApp />
    </>
  );
}
