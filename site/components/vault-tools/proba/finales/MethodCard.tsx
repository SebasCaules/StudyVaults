"use client";

import { useState } from "react";
import { withBase } from "@/lib/content/slug";
import Blocks from "./Blocks";
import { WIKI_HREF } from "./wiki-hrefs";
import type { GenericMethod } from "./types";

/* ============================================================================
 * Tarjeta del MÉTODO GENÉRICO de un tipo de ejercicio: la "receta" que
 * generaliza los ejercicios más tomados de ese tipo. Se muestra arriba de la
 * lista al entrar a un tipo, para entender el método antes de ver casos.
 * ========================================================================== */
export default function MethodCard({ method }: { method: GenericMethod }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="vfin-method">
      <div className="vfin-method__head">
        <div className="vfin-method__titlerow">
          <span className="vfin-method__tag">Método genérico</span>
          <h4 className="vfin-method__title">{method.title}</h4>
        </div>
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? "Ocultar método" : "Ver método"}
        </button>
      </div>

      {method.frequency && (
        <p className="vfin-method__freq">{method.frequency}</p>
      )}

      {open && (
        <div className="vfin-method__body">
          <div className="vfin-method__section">
            <div className="vfin-eyebrow">Cómo reconocerlo</div>
            <Blocks blocks={method.recognize} />
          </div>

          <div className="vfin-method__section">
            <div className="vfin-eyebrow">Método paso a paso</div>
            {method.steps.map((st, i) => (
              <div key={i} className="vfin-step">
                <div className="vfin-step__label">{st.label}</div>
                <Blocks blocks={st.blocks} />
              </div>
            ))}
          </div>

          {method.pitfalls && method.pitfalls.length > 0 && (
            <div className="vfin-method__section">
              <Blocks blocks={method.pitfalls} />
            </div>
          )}

          {method.cites.length > 0 && (
            <div className="vfin-ex__links">
              <span className="vfin-ex__links-label">Teoremas / conceptos:</span>
              {method.cites.map((l, i) => {
                const href = WIKI_HREF[l.slug];
                return href ? (
                  <a
                    key={i}
                    className="vfin-ex__link"
                    href={withBase(href)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {l.label}
                  </a>
                ) : (
                  <span key={i} className="vfin-ex__link">
                    {l.label}
                  </span>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
