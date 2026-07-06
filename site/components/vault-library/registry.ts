import type { VaultId } from "@/lib/content/vaults";
import type { VaultLibrary } from "./types";
import { inge2Library } from "./data/inge2";
import { fisica3Library } from "./data/fisica3";

// id de materia → biblioteca de PDFs disponible. Lo consume la ruta
// app/[vault]/biblioteca/page.tsx. Debe mantenerse en sync con el flag
// `library: true` de lib/content/vaults.ts.
export const LIBRARIES: Partial<Record<VaultId, VaultLibrary>> = {
  inge2: inge2Library,
  fisica3: fisica3Library,
};
