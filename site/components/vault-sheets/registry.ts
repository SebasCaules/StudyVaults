import type { VaultId } from "@/lib/content/vaults";
import type { Sheet } from "./types";
import { probaFormulas, probaConceptos } from "./data/proba";
import { mnaFormulas, mnaConceptos } from "./data/mna";
import { economiaFormulas, economiaConceptos } from "./data/economia";
import { pawConceptos } from "./data/paw";
import { inge2Conceptos } from "./data/inge2";

// id de materia → hojas de estudio disponibles. Lo consume la ruta
// app/[vault]/hojas/page.tsx. Fórmulas solo en materias de mate; conceptos
// en todas las que tienen toolkit. Debe mantenerse en sync con el flag
// `sheets: true` de lib/content/vaults.ts.
export interface VaultSheets {
  formulas?: Sheet;
  conceptos?: Sheet;
}

export const SHEETS: Partial<Record<VaultId, VaultSheets>> = {
  mna: { formulas: mnaFormulas, conceptos: mnaConceptos },
  economia: { formulas: economiaFormulas, conceptos: economiaConceptos },
  proba: { formulas: probaFormulas, conceptos: probaConceptos },
  paw: { conceptos: pawConceptos },
  inge2: { conceptos: inge2Conceptos },
};
