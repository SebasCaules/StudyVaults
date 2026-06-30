"use client";

import { Fragment } from "react";
import { Math } from "../../../vault-sheets/SheetMath";
import { withBase } from "@/lib/content/slug";
import { WIKI_HREF } from "./wiki-hrefs";
import type { Block } from "./types";

/* ============================================================================
 * Render de bloques de contenido (enunciado / pasos / respuesta).
 *
 * `FinText` extiende el render de texto del banco: math inline ($...$) vía
 * KaTeX, `código`, **negrita** y wikilinks [[slug|label]] → enlace a la página
 * del wiki (resuelto con wiki-hrefs.ts + basePath; abre en otra pestaña).
 * ========================================================================== */

const RICH = /(\$[^$]*\$)|(`[^`]*`)|(\[\[[^\]]*\]\])|(\*\*[^*]+\*\*)/g;

export function FinText({ text }: { text: string }) {
  const out: React.ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(RICH)) {
    const i = m.index ?? 0;
    if (i > last) out.push(<Fragment key={key++}>{text.slice(last, i)}</Fragment>);
    const tok = m[0];
    if (tok.startsWith("$")) {
      out.push(<Math key={key++} tex={tok.slice(1, -1)} inline />);
    } else if (tok.startsWith("`")) {
      out.push(
        <code key={key++} className="sheet-code">
          {tok.slice(1, -1)}
        </code>,
      );
    } else if (tok.startsWith("[[")) {
      const inner = tok.slice(2, -2);
      const [slug, label] = inner.split("|");
      const text2 = label ?? slug.replace(/-/g, " ");
      const href = WIKI_HREF[slug];
      out.push(
        href ? (
          <a
            key={key++}
            className="vfin-wikilink"
            href={withBase(href)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {text2}
          </a>
        ) : (
          <span key={key++} className="vfin-wikilink vfin-wikilink--dead">
            {text2}
          </span>
        ),
      );
    } else {
      // **negrita**
      out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    }
    last = i + tok.length;
  }
  if (last < text.length) out.push(<Fragment key={key++}>{text.slice(last)}</Fragment>);
  return <>{out}</>;
}

function BlockView({ b }: { b: Block }) {
  switch (b.t) {
    case "text":
      return (
        <p className="vfin-text">
          <FinText text={b.md} />
        </p>
      );
    case "math":
      return (
        <div className="vfin-math">
          <Math tex={b.tex} />
        </div>
      );
    case "list":
      return (
        <ul className="vfin-list">
          {b.items.map((it, i) => (
            <li key={i}>
              <FinText text={it} />
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <div className={`vfin-note vfin-note--${b.tone ?? "tip"}`}>
          {b.label && <span className="vfin-note__label">{b.label}</span>}
          <span className="vfin-note__body">
            <FinText text={b.md} />
          </span>
        </div>
      );
  }
}

export default function Blocks({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((b, i) => (
        <BlockView key={i} b={b} />
      ))}
    </>
  );
}
