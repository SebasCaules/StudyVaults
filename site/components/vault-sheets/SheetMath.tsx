"use client";

import { useMemo, type ReactNode } from "react";
import katex from "katex";
import { tokenize } from "./richtext";

/* ──────────────────────────────────────────────────────────────────────────
   Render de LaTeX client-only sobre KaTeX (la CSS la importa la ruta).
   `renderToString` es puro/síncrono → seguro en static export. `strict:false`
   y `throwOnError:false` para que un macro suelto no tumbe la página: cae a
   texto rojo con el código fuente.
   ────────────────────────────────────────────────────────────────────────── */

function render(tex: string, displayMode: boolean): string {
  try {
    return katex.renderToString(tex, {
      displayMode,
      throwOnError: false,
      strict: false,
      output: "htmlAndMathml",
    });
  } catch {
    return `<span class="sheet-math-err">${tex.replace(/</g, "&lt;")}</span>`;
  }
}

/** Una fórmula LaTeX (display por defecto, inline con `inline`). */
export function Math({ tex, inline = false }: { tex: string; inline?: boolean }) {
  const html = useMemo(() => render(tex, !inline), [tex, inline]);
  return (
    <span
      className={inline ? "sheet-math sheet-math--inline" : "sheet-math"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

/**
 * Texto enriquecido: math inline (`$...$`) → KaTeX, código (`` `...` ``) →
 * <code>, el resto texto. Ver richtext.ts para el tokenizador.
 */
export function RichText({ text }: { text: string }): ReactNode {
  const parts = useMemo(() => tokenize(text), [text]);
  return (
    <>
      {parts.map((p, i) =>
        p.type === "math" ? (
          <span
            key={i}
            className="sheet-math sheet-math--inline"
            dangerouslySetInnerHTML={{ __html: render(p.value, false) }}
          />
        ) : p.type === "code" ? (
          <code key={i} className="sheet-code">
            {p.value}
          </code>
        ) : (
          <span key={i}>{p.value}</span>
        ),
      )}
    </>
  );
}
