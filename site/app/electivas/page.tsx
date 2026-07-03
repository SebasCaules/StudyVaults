import type { Metadata } from "next";
import PlannerIntro from "@/components/portal/PlannerIntro";

export const metadata: Metadata = {
  title: "Planificador de electivas — cómo funciona",
  description:
    "Armá tu carrera cuatrimestre por cuatrimestre: correlativas, minors, combinador de horarios y de finales, todo en una vista. Conocé cada feature y abrí el planificador.",
};

/** Pseudo-landing de electivas: explica cada feature con animaciones y baja al
 *  CTA que abre la herramienta real en /electivas/planificar. (La app vive en
 *  esa subruta; ver app/electivas/planificar/page.tsx.) */
export default function ElectivasLandingPage() {
  return <PlannerIntro />;
}
