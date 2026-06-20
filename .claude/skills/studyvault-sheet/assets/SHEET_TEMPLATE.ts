import type { Sheet } from "../types";

/* ──────────────────────────────────────────────────────────────────────────
   MOLDE de un módulo de datos de hoja de estudio (cheat sheet).

   Copialo a  site/components/vault-sheets/data/<vault>.ts , renombrá los
   exports a  <vault>Formulas / <vault>Conceptos  (camelCase del VaultId),
   y completá los datos. Es PURO DATO y serializable: lo consumen el render
   (SheetShell / SheetMath), la impresión y los exporters (.tex / .md).

   Reglas (ver SKILL.md y components/vault-sheets/types.ts):
   - `kind: "formulas"` SOLO en vaults con `math: true` (MNA/Economía/Proba).
     Para vaults `math: false` (PAW/Inge2/Derecho) usar `kind: "conceptos"`.
   - `tex` va SIN delimitadores `$` y debe ser LaTeX KaTeX-válido.
   - Rich text en label/body/cond/note/hint/notation: solo `$...$` (math, solo
     en vaults con math) y `` `...` `` (código). Nada de Markdown extra ni emojis.
   - EntryKind → color: def(azul) theorem(púrpura) formula(verde) method(ámbar)
     caution(coral) example(gris). Si se omite, se deriva del tipo de hoja.

   Cablear (si la hoja/vault es nueva):
   1) import + clave en SHEETS de  components/vault-sheets/registry.ts
   2) `sheets: true` en el VaultConfig de  lib/content/vaults.ts
   ────────────────────────────────────────────────────────────────────────── */

/* ── Hoja de FÓRMULAS (solo materias con math; borrar si no aplica) ───────── */
export const xxxFormulas: Sheet = {
  vault: "xxx", // ← VaultId real (mna · economia · proba · …)
  kind: "formulas",
  title: "Materia — título humano",
  subtitle: "Subtítulo opcional (alcance de la hoja)",
  notation: "Convenciones globales; admite math inline, ej. $X_i$ i.i.d., $\\mu=E[X]$",
  updated: "AAAA-MM-DD", // fecha ISO de hoy
  groups: [
    {
      title: "Sección 1",
      hint: "Pista breve opcional (admite $...$)",
      unit: "1", // opcional: agrupa por unidad
      unitTitle: "Nombre de la unidad", // opcional, coherente entre secciones del mismo unit
      entries: [
        {
          label: "Resultado central",
          kind: "formula",
          tex: "a^2 + b^2 = c^2", // LaTeX SIN delimitadores $
          cond: "Cuándo aplica (admite $...$)",
          note: "Caveat / error común (admite $...$)",
        },
        {
          label: "Definición",
          kind: "def",
          body: "Texto breve, con math inline $\\sigma^2 = V(X)$ si la materia usa math.",
        },
        {
          label: "Identidad inline",
          kind: "formula",
          tex: "e^{i\\pi} + 1 = 0",
          inline: true, // muestra la fórmula en línea con el label
        },
      ],
    },
  ],
};

/* ── Hoja de CONCEPTOS (todas las materias con toolkit) ───────────────────── */
export const xxxConceptos: Sheet = {
  vault: "xxx",
  kind: "conceptos",
  title: "Materia — título humano",
  subtitle: "Subtítulo opcional",
  // En vaults SIN math (PAW/Inge2/Derecho) NO usar $...$ en `notation`/textos.
  notation: "Convenciones / abreviaturas. En vaults sin math, texto plano y `código`.",
  updated: "AAAA-MM-DD",
  groups: [
    {
      title: "Sección de conceptos",
      hint: "Pista breve opcional",
      entries: [
        {
          label: "Concepto",
          kind: "def",
          body: "Definición en texto. Identificadores con `código`.",
          note: "Nota / caveat.",
        },
        {
          label: "Técnica",
          kind: "method",
          body: "Receta / pasos.",
          cond: "Cuándo conviene aplicarla.",
        },
      ],
    },
  ],
};
