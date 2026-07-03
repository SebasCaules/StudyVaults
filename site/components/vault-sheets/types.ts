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
  | "example" // ejemplo / caso / intuición — gris cálido
  | "code"; // bloque de código / pseudocódigo — neutral (no forma parte de la paleta de 6)

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

/**
 * Bloque de código / pseudocódigo de una entrada `kind:"code"`. Se muestra en un
 * bloque monoespaciado con una barra opcional (archivo + lenguaje), sin resaltado
 * de sintaxis (anti-IA: nada de decoración innecesaria). El texto es literal.
 */
export interface SheetCode {
  /** Código / pseudocódigo, con saltos de línea reales (`\n`). Se muestra tal cual. */
  text: string;
  /** Etiqueta de lenguaje mostrada en la barra (ej. "ts", "pseudocódigo"). */
  lang?: string;
  /** Nombre de archivo mostrado en la barra del bloque (ej. "binomial.ts"). */
  file?: string;
}

/**
 * Figura / gráfico de una entrada: un resumen tipo LaTeX no es solo texto y
 * fórmulas — a veces un dibujo (una campana, un boxplot, una oferta/demanda,
 * la convergencia de un método) comunica mejor. Se guarda como SVG inline
 * ESTÁTICO y serializable.
 *
 * Reglas del SVG (static-export safe + themeable):
 *  - Marcado SVG completo (`<svg …>…</svg>`), SIN `<script>`, SIN `<image>` ni
 *    URLs externas: se inyecta con `dangerouslySetInnerHTML` en el server render.
 *  - Colores por TOKENS de rol, no hex: trazos con `currentColor` (la figura hereda
 *    `--text-secondary`) y rellenos/curvas con `var(--sheet-formula)`, `var(--vault-tint)`,
 *    etc. Así respeta tema oscuro/claro e impresión sin duplicar la figura.
 *  - `viewBox` obligatorio y SIN `width`/`height` fijos (la CSS la escala al ancho
 *    de la columna con `max-width:100%`).
 */
export interface SheetFigure {
  /** SVG inline completo (ver reglas arriba). */
  svg: string;
  /** Epígrafe breve bajo la figura (admite `$...$` y `` `código` ``). */
  caption?: string;
  /** Texto accesible (`aria-label` del contenedor). Si se omite, usa `caption`. */
  alt?: string;
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
  /**
   * Bloque de código de la entrada. Pensado para `kind:"code"`, que lo muestra
   * en un bloque monoespaciado bajo el `body`. Serializable → también se exporta.
   */
  code?: SheetCode;
  /**
   * Figura / gráfico SVG de la entrada. Se muestra bajo el cuerpo, en cualquier
   * `kind` (no requiere uno especial). Ver `SheetFigure`.
   */
  figure?: SheetFigure;
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
  /**
   * Descripción breve de la unidad (una línea, admite `$...$`). Se muestra bajo
   * el título de la unidad en su encabezado. Coherente entre secciones del mismo
   * unit (se toma de la primera sección de la unidad).
   */
  unitDesc?: string;
  /**
   * Código de sub-unidad (ej. "2.1", "3.4") — el nivel intermedio Unidad →
   * Sub-unidad → entradas. Cada `SheetGroup` es una sub-unidad: su `title` es el
   * nombre de la sub-unidad y este código se muestra como prefijo mono/acento.
   * Opcional: sin código, la sección se renderiza solo con su `title`.
   */
  subunit?: string;
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

/**
 * Metadata de presentación de cada categoría: etiqueta, variable CSS de rol y
 * el par de hex (tema oscuro / claro) de la paleta semántica.
 *
 * Paleta "refinada" (rework 2026-07): tono más limpio y sobrio, subconjunto del
 * lenguaje cromático del sitio (method ≈ `--status-warn`, caution ≈ coral de acento),
 * con contraste AA verificado — dark: tag sobre pill oscuro ≥5.2:1; light/print:
 * texto sobre blanco ≥4.6:1; bordes ≥3:1 (componente UI).
 *
 * ⚠️ FUENTE DE VERDAD DE LA PALETA — sincronizada BYTE-A-BYTE (mismos hex) en los
 * 3 lugares de código de las hojas:
 *   1) este `KIND_META` (dark/light),
 *   2) `packages/ui/src/styles/sheets.css` (bloques light + dark + print),
 *   3) `exporters.ts` `TEX_COLOR_DEFS` (usa los hex de `light`, salida impresa).
 * Los 6 valores también viven en `DESIGN.md §12` (lo replica el overseer, no acá).
 * `code` es neutral y NO forma parte de los 6 sincronizados.
 */
export const KIND_META: Record<
  EntryKind,
  { label: string; cssVar: string; dark: string; light: string }
> = {
  def: { label: "def", cssVar: "--sheet-def", dark: "#9AC7EA", light: "#275C8C" },
  theorem: { label: "teorema", cssVar: "--sheet-theorem", dark: "#C4B0E8", light: "#5A3897" },
  formula: { label: "fórmula", cssVar: "--sheet-formula", dark: "#85CFB0", light: "#16745C" },
  method: { label: "técnica", cssVar: "--sheet-method", dark: "#E1B878", light: "#8A591C" },
  caution: { label: "cuidado", cssVar: "--sheet-caution", dark: "#EDA08D", light: "#B23A28" },
  example: { label: "ejemplo", cssVar: "--sheet-example", dark: "#C4BAB0", light: "#695D51" },
  code: { label: "código", cssVar: "--sheet-code-kind", dark: "#B4B4BC", light: "#5D5D65" },
};

/** Kind por defecto según el tipo de hoja, cuando la entrada no lo declara. */
export function defaultKind(sheetKind: Sheet["kind"]): EntryKind {
  return sheetKind === "formulas" ? "formula" : "def";
}
