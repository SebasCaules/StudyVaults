import type { VaultId } from "@/lib/content/vaults";

/* ──────────────────────────────────────────────────────────────────────────
   Hojas de estudio (cheat sheets) — schema de datos.

   Una "hoja" es un documento denso, color-coded e imprimible (mínimas hojas)
   que se exporta a PDF (vía print), .tex y .md. Hay dos tipos por materia:
   - "formulas"  → hoja de fórmulas (materias de mate: MNA, Economía, Proba)
   - "conceptos" → hoja de conceptos (todas las materias con toolkit)

   El schema sirve a la vez para: render en pantalla, layout de impresión,
   y los exportadores LaTeX / Markdown. Por eso es puro-datos y serializable.
   ────────────────────────────────────────────────────────────────────────── */

/** Categoría semántica de una entrada → determina el color-coding. */
export type EntryKind =
  | "def" // definición / notación — azul
  | "theorem" // teorema / propiedad / ley — púrpura
  | "formula" // fórmula central / resultado — verde
  | "method" // técnica / receta / paso a paso — ámbar
  | "caution" // condición de validez / error común / cuidado — coral
  | "example"; // ejemplo / caso / intuición — gris

/**
 * Una variable de la leyenda de una fórmula: el símbolo y su significado.
 * Pensada para hojas académicas donde cada fórmula declara qué es cada letra
 * ("donde $\\mu$ es la media…"). Se renderiza una variable por renglón.
 */
export interface SheetVar {
  /** Símbolo en LaTeX SIN delimitadores `$` (ej. "\\mu", "n", "\\sigma^2"). */
  sym: string;
  /** Significado del símbolo (texto breve; admite matemática inline `$...$`). */
  desc: string;
}

export interface SheetEntry {
  /** Nombre corto del ítem (ej. "Varianza", "TCL", "Singleton"). */
  label: string;
  /** Categoría semántica → color. Default por tipo de hoja si se omite. */
  kind?: EntryKind;
  /**
   * LaTeX de la fórmula, SIN delimitadores `$`. Se renderiza en display salvo
   * que `inline` sea true. Principal en hojas de fórmulas. Para mostrar varias
   * fórmulas, una por renglón, usar un entorno `\\begin{aligned}…\\\\…\\end{aligned}`.
   */
  tex?: string;
  /** Renderizar `tex` inline (en línea con el label) en vez de en display. */
  inline?: boolean;
  /**
   * Texto breve de la entrada. Puede contener matemática inline con `$...$`.
   * Principal en hojas de conceptos.
   */
  body?: string;
  /**
   * Leyenda de variables de la fórmula: cada símbolo con su significado, uno
   * por renglón ("donde …"). Da legibilidad académica a las hojas de fórmulas.
   */
  vars?: SheetVar[];
  /** Condición de validez o "cuándo aplica" (texto breve, admite `$...$`). */
  cond?: string;
  /** Nota / caveat / error común (texto breve, admite `$...$`). */
  note?: string;
}

export interface SheetGroup {
  /** Título de la sección. */
  title: string;
  /** Subtítulo / pista breve opcional (admite `$...$`). */
  hint?: string;
  /**
   * Unidad a la que pertenece la sección (ej. "1".."9"). Varias secciones
   * pueden compartir unidad; la hoja las agrupa bajo un encabezado de unidad
   * y permite filtrar por unidad. Si se omite, la sección queda "sin unidad".
   */
  unit?: string;
  /** Título humano de la unidad (opcional; coherente entre secciones del mismo unit). */
  unitTitle?: string;
  entries: SheetEntry[];
}

export interface Sheet {
  vault: VaultId;
  kind: "formulas" | "conceptos";
  /** Título humano de la hoja (ej. "Probabilidad y Estadística"). */
  title: string;
  /** Subtítulo opcional bajo el título. */
  subtitle?: string;
  /** Línea de notación / convenciones global (admite `$...$`). */
  notation?: string;
  groups: SheetGroup[];
  /** Fecha ISO de última edición. */
  updated?: string;
}

/** Metadata de presentación de cada categoría (label + variable CSS de color). */
export const KIND_META: Record<EntryKind, { label: string; cssVar: string }> = {
  def: { label: "def", cssVar: "--sheet-def" },
  theorem: { label: "teorema", cssVar: "--sheet-theorem" },
  formula: { label: "fórmula", cssVar: "--sheet-formula" },
  method: { label: "técnica", cssVar: "--sheet-method" },
  caution: { label: "cuidado", cssVar: "--sheet-caution" },
  example: { label: "ejemplo", cssVar: "--sheet-example" },
};

/** Kind por defecto según el tipo de hoja, cuando la entrada no lo declara. */
export function defaultKind(sheetKind: Sheet["kind"]): EntryKind {
  return sheetKind === "formulas" ? "formula" : "def";
}
