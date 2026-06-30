"use client";

import { useState } from "react";
import { Badge } from "@studyvaults/ui";
import { withBase } from "@/lib/content/slug";
import Blocks from "./Blocks";
import { WIKI_HREF } from "./wiki-hrefs";
import { EX_TYPES, EXAMS } from "./catalog";
import type { Exercise, ExType } from "./types";

const TYPE_LABEL: Record<ExType, string> = EX_TYPES.reduce(
  (m, t) => ({ ...m, [t.id]: t.label }),
  {} as Record<ExType, string>,
);
const EXAM_NAME: Record<string, string> = EXAMS.reduce(
  (m, e) => ({ ...m, [e.id]: e.name }),
  {} as Record<string, string>,
);

/**
 * Tarjeta de un ejercicio: enunciado siempre visible; resolución y respuesta
 * se revelan con un botón (modo "intentá primero, después mirá").
 */
export default function ExerciseCard({
  ex,
  done,
  onToggleDone,
}: {
  ex: Exercise;
  done?: boolean;
  onToggleDone?: () => void;
}) {
  const [showSolution, setShowSolution] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div className="vfin-ex">
      <div className="vfin-ex__head">
        <div className="vfin-ex__titlerow">
          <span className="vfin-ex__num">
            {String(ex.num).padStart(2, "0")}
          </span>
          <h4 className="vfin-ex__title">{ex.title}</h4>
        </div>
        <div className="vfin-ex__meta">
          <Badge>{EXAM_NAME[ex.examId] ?? ex.examId}</Badge>
          {ex.types.map((t) => (
            <span key={t} className="vfin-ex__type">
              {TYPE_LABEL[t] ?? t}
            </span>
          ))}
          {onToggleDone && (
            <button
              type="button"
              className={`vfin-done ${done ? "is-done" : ""}`}
              onClick={onToggleDone}
              aria-pressed={done}
              title={done ? "Marcar como pendiente" : "Marcar como hecho"}
            >
              {done ? "✓ hecho" : "marcar hecho"}
            </button>
          )}
        </div>
      </div>

      <div className="vfin-ex__statement">
        <div className="vfin-eyebrow">Enunciado</div>
        <Blocks blocks={ex.statement} />
      </div>

      <div className="vfin-ex__actions">
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          onClick={() => setShowSolution((s) => !s)}
          aria-expanded={showSolution}
        >
          {showSolution ? "Ocultar resolución" : "Mostrar resolución paso a paso"}
        </button>
        {ex.answer && ex.answer.length > 0 && (
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={() => setShowAnswer((s) => !s)}
            aria-expanded={showAnswer}
          >
            {showAnswer ? "Ocultar respuesta" : "Ver respuesta"}
          </button>
        )}
      </div>

      {showSolution && (
        <div className="vfin-ex__solution">
          {ex.steps.map((st, i) => (
            <div key={i} className="vfin-step">
              <div className="vfin-step__label">{st.label}</div>
              <Blocks blocks={st.blocks} />
            </div>
          ))}
        </div>
      )}

      {showAnswer && ex.answer && (
        <div className="vfin-ex__answer">
          <div className="vfin-eyebrow">Respuesta</div>
          <Blocks blocks={ex.answer} />
        </div>
      )}

      {ex.wikiLinks.length > 0 && (
        <div className="vfin-ex__links">
          <span className="vfin-ex__links-label">Repasar:</span>
          {ex.wikiLinks.map((l, i) => {
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
  );
}
