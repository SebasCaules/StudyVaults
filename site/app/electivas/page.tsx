import type { Metadata } from "next";
import PlannerApp from "@/components/planner/PlannerApp";

export const metadata: Metadata = {
  title: "Planificador de electivas",
  description:
    "Planificador de la carrera de Ingeniería en Informática del ITBA: mapa de correlativas, áreas y minors, cómputo de créditos y armado del horario cuatrimestral.",
};

export default function ElectivasPage() {
  return <PlannerApp />;
}
