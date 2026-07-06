import type { Metadata } from "next";
import PlannerIntro from "@/components/portal/PlannerIntro";

export const metadata: Metadata = {
  title: "Planificador de electivas — cómo funciona",
  description:
    "Marcá tus materias aprobadas y armá tu cursada: correlativas, horarios y finales sin choques, cuatrimestre por cuatrimestre. Sin cuenta — se guarda en tu navegador.",
};

/** Pseudo-landing de electivas: explica cada feature con animaciones y baja al
 *  CTA que abre la herramienta real en /electivas/planificar. (La app vive en
 *  esa subruta; ver app/electivas/planificar/page.tsx.) */
export default function ElectivasLandingPage() {
  return <PlannerIntro />;
}
