"use client";

import { useState } from "react";
import { FinText } from "./Blocks";
import type { TFItem } from "./types";

/* ============================================================================
 * Mazo de Verdadero/Falso: una afirmación por vez, revela la corrección + la
 * explicación y lleva el puntaje. Sin persistencia (estado en useState);
 * "mezclar" usa Math.random solo en handler (static-export safe).
 * ========================================================================== */

export default function TFDeck({ items }: { items: TFItem[] }) {
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [score, setScore] = useState({ ok: 0, total: 0 });

  if (items.length === 0) {
    return (
      <div className="vfin-tf">
        <p className="vfin-text">No hay afirmaciones para este filtro.</p>
      </div>
    );
  }

  const item = items[order[pos] ?? 0];
  const answered = choice !== null;
  const correct = answered && choice === item.answer;

  const answer = (v: boolean) => {
    if (answered) return;
    setChoice(v);
    setScore((s) => ({ ok: s.ok + (v === item.answer ? 1 : 0), total: s.total + 1 }));
  };
  const next = () => {
    setChoice(null);
    setPos((p) => (p + 1) % order.length);
  };
  const shuffle = () => {
    const a = items.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setOrder(a);
    setPos(0);
    setChoice(null);
    setScore({ ok: 0, total: 0 });
  };

  return (
    <div className="vfin-tf">
      <div className="vfin-tf__bar">
        <span className="vfin-tf__count">
          {pos + 1}/{order.length}
        </span>
        <span className="vfin-tf__score">
          aciertos {score.ok}/{score.total}
        </span>
        <button type="button" className="btn btn--sm btn--ghost" onClick={shuffle}>
          Mezclar
        </button>
      </div>

      <div className="vfin-tf__claim">
        <FinText text={item.claim} />
      </div>

      {!answered ? (
        <div className="vfin-tf__choices">
          <button
            type="button"
            className="vfin-tf__btn vfin-tf__btn--true"
            onClick={() => answer(true)}
          >
            Verdadero
          </button>
          <button
            type="button"
            className="vfin-tf__btn vfin-tf__btn--false"
            onClick={() => answer(false)}
          >
            Falso
          </button>
        </div>
      ) : (
        <div className="vfin-tf__reveal">
          <div
            className={`vfin-tf__verdict ${correct ? "is-ok" : "is-bad"}`}
          >
            {correct ? "✓ Correcto" : "✗ Incorrecto"} — la afirmación es{" "}
            <b>{item.answer ? "verdadera" : "falsa"}</b>
          </div>
          <div className="vfin-tf__explain">
            <FinText text={item.explain} />
          </div>
          <button type="button" className="btn btn--sm btn--ghost" onClick={next}>
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
