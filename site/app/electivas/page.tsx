import type { CSSProperties } from "react";
import type { Metadata } from "next";
import PlannerIntro from "@/components/portal/PlannerIntro";

export const metadata: Metadata = {
  title: "Planificador de electivas — cómo funciona",
  description:
    "Marcá tus materias aprobadas y armá tu cursada: correlativas, horarios y finales sin choques, cuatrimestre por cuatrimestre. Sin cuenta — se guarda en tu navegador.",
};

// Oculto a la vista y a AT (aria-hidden): existe solo para que la búsqueda
// global (Pagefind en "body mode") indexe esta ruta, que de otro modo es una
// landing 100% client-side sin texto server-rendered en el HTML estático.
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

/** Pseudo-landing de electivas: explica cada feature con animaciones y baja al
 *  CTA que abre la herramienta real en /electivas/planificar. (La app vive en
 *  esa subruta; ver app/electivas/planificar/page.tsx.) */
export default function ElectivasLandingPage() {
  return (
    <>
      <div
        data-pagefind-body
        data-pagefind-filter="materia:Electivas"
        aria-hidden="true"
        style={srOnly}
      >
        <h1 data-pagefind-meta="title">
          Planificador de electivas — cómo funciona
        </h1>
        <p>
          Cómo funciona el planificador y el combinador de horarios de electivas:
          marcá tus materias aprobadas y armá tu cursada — correlativas, horarios
          y finales sin choques, cuatrimestre por cuatrimestre. Sin cuenta, se
          guarda en tu navegador.
        </p>
      </div>
      <PlannerIntro />
    </>
  );
}
