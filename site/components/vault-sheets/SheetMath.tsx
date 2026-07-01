"use client";

import {
  Fragment,
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
      // Solo HTML (sin MathML): la hoja tiene cientos de fórmulas y el árbol
      // MathML paralelo duplicaría los nodos → layout multi-columna más lento.
      output: "html",
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

/* ──────────────────────────────────────────────────────────────────────────
   Controlador de "fit" COMPARTIDO por TODAS las instancias de FitMath.

   El problema de perf: la hoja tiene cientos de fórmulas display. Antes cada
   una creaba su propio ResizeObserver y en cada resize hacía
   `zoom=1` (write) → leer `offsetWidth` (read) → `zoom=s` (write): un
   read-after-write que fuerza un reflow SINCRÓNICO. Con N fórmulas y layout
   multi-columna (caro de por sí), arrastrar el split view disparaba N reflows
   forzados intercalados por frame → el jank que se veía en Chrome.

   La solución: un único ResizeObserver alimenta un ciclo batched en rAF que
   SEPARA las fases: reset de zoom de todos (write) → medir todos (un solo
   reflow para el batch) → aplicar zoom de todos (write). Costo por frame
   ~O(1) reflows en vez de O(N).
   ────────────────────────────────────────────────────────────────────────── */

const fitTargets = new Set<HTMLElement>();
let fitRO: ResizeObserver | null = null;
let fitRaf = 0;
let fontsHooked = false;

function scheduleFit() {
  if (fitRaf || typeof window === "undefined") return;
  fitRaf = requestAnimationFrame(flushFit);
}

function flushFit() {
  fitRaf = 0;
  const items: { inner: HTMLElement; container: HTMLElement }[] = [];
  for (const inner of fitTargets) {
    const container = inner.parentElement;
    if (container) items.push({ inner, container });
  }
  if (!items.length) return;
  // WRITE: reset de todos los zoom para medir el ancho natural
  for (const { inner } of items) inner.style.setProperty("zoom", "1");
  // READ: medir todos de una (el primer read tras el batch de writes fuerza un
  // único reflow; los siguientes reads no vuelven a hacerlo al no intercalar writes)
  const measured = items.map(({ inner, container }) => ({
    inner,
    natW: inner.offsetWidth,
    avail: container.clientWidth,
  }));
  // WRITE: aplicar el encogido por zoom
  for (const { inner, natW, avail } of measured) {
    const s = avail > 0 && natW > avail ? avail / natW : 1;
    if (s < 1) inner.style.setProperty("zoom", String(s));
    else inner.style.removeProperty("zoom");
  }
}

/** Alta de una fórmula en el controlador; devuelve la baja. */
function registerFit(inner: HTMLElement): () => void {
  fitTargets.add(inner);
  if (!fitRO) fitRO = new ResizeObserver(() => scheduleFit());
  const container = inner.parentElement;
  // El zoom achica el inner pero no el ancho del contenedor (bloque a ancho de
  // columna), así que observar el contenedor no genera loop de feedback.
  if (container) fitRO.observe(container);
  if (!fontsHooked && typeof document !== "undefined") {
    fontsHooked = true;
    // Las fuentes de KaTeX cargan async: el primer measure puede ser con
    // fallback. Un solo hook global recalcula todo cuando estén listas.
    document.fonts?.ready.then(() => scheduleFit());
  }
  scheduleFit();
  return () => {
    fitTargets.delete(inner);
    if (fitRO && container) fitRO.unobserve(container);
  };
}

/**
 * Fórmula display que se ESCALA para caber en su columna: nunca scrollea ni se
 * recorta. Se apoya en el controlador compartido (arriba) para medir y aplicar
 * el `zoom` de forma batched, sin reflows forzados por fórmula.
 */
export function FitMath({ tex }: { tex: string }) {
  const html = useMemo(() => render(tex, true), [tex]);
  const innerRef = useRef<HTMLSpanElement>(null);

  useIsoLayoutEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    return registerFit(inner);
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
      {parts.map((p, i) => {
        const node =
          p.type === "math" ? (
            <span
              className="sheet-math sheet-math--inline"
              dangerouslySetInnerHTML={{ __html: render(p.value, false) }}
            />
          ) : p.type === "code" ? (
            <code className="sheet-code">{p.value}</code>
          ) : (
            <>{p.value}</>
          );
        return (
          <Fragment key={i}>
            {p.strong ? <strong className="sheet-strong">{node}</strong> : node}
          </Fragment>
        );
      })}
    </>
  );
}
