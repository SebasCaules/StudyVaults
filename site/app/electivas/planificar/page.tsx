import type { Metadata } from "next";
import PlannerApp from "@/components/planner/PlannerApp";

export const metadata: Metadata = {
  title: "Planificador de electivas",
  description:
    "Planificador de la carrera de Ingeniería en Informática del ITBA: mapa de correlativas, áreas y minors, cómputo de créditos, armado del horario cuatrimestral y combinación de finales.",
};

/** La herramienta real. La pseudo-landing explicativa vive en /electivas y
 *  enlaza acá con su CTA (ver app/electivas/page.tsx). */
export default function PlanificarPage() {
  return <PlannerApp />;
}
