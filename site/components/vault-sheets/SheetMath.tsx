"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import katex from "katex";
import { tokenize } from "./richtext";

// useLayoutEffect avisa en SSR; en static export el render inicial es server.
const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

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
 * Fórmula display que se ESCALA para caber en su columna: nunca scrollea ni se
 * recorta. Mide el ancho natural del KaTeX y, si excede la columna, aplica
 * `zoom` (achica también la caja de layout → sin overflow ni scroll fantasma,
 * y el alto se reajusta solo). Recalcula al cambiar el ancho disponible
 * (ResizeObserver: densidad, columnas, viewport) y tras cargar las fuentes.
 */
export function FitMath({ tex }: { tex: string }) {
  const html = useMemo(() => render(tex, true), [tex]);
  const innerRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const inner = innerRef.current;
    const container = inner?.parentElement;
    if (!inner || !container) return;

    const fit = () => {
      const avail = container.clientWidth;
      inner.style.setProperty("zoom", "1"); // reset para medir el ancho natural
      const natW = inner.offsetWidth;
      const s = avail > 0 && natW > avail ? avail / natW : 1;
      if (s < 1) inner.style.setProperty("zoom", String(s));
      else inner.style.removeProperty("zoom");
    };

    fit();
    // El zoom achica el inner pero no el ancho del contenedor (bloque a ancho de
    // columna), así que el observer solo dispara con cambios reales de columna.
    const ro = new ResizeObserver(() => fit());
    ro.observe(container);

    let cancelled = false;
    // Las fuentes de KaTeX cargan async: el primer measure puede ser con
    // fallback. Recalculamos cuando estén listas.
    document.fonts?.ready.then(() => {
      if (!cancelled) fit();
    });

    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [html]);

  return (
    <span
      ref={innerRef}
      className="sheet-math sheet-math--fit"
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
