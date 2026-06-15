import type { ComponentType } from "react";
import type { VaultId } from "@/lib/content/vaults";
import MnaTools from "./MnaTools";
import EconomiaTools from "./EconomiaTools";
import ProbaTools from "./ProbaTools";
import PawTools from "./PawTools";
import Inge2Tools from "./Inge2Tools";

// id de materia → componente de toolkit (island client). Lo consume la ruta
// app/[vault]/herramientas/page.tsx. Debe cubrir exactamente las vaults con
// `toolkit: true` en lib/content/vaults.ts.
export const TOOLKITS: Partial<Record<VaultId, ComponentType>> = {
  mna: MnaTools,
  economia: EconomiaTools,
  proba: ProbaTools,
  paw: PawTools,
  inge2: Inge2Tools,
};
