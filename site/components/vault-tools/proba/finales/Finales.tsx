"use client";

import { useEffect, useMemo, useState } from "react";
import { Note } from "@studyvaults/ui";
import ExerciseCard from "./ExerciseCard";
import MethodCard from "./MethodCard";
import TFDeck from "./TFDeck";
import { EX_TYPES, EXAMS, TPS } from "./catalog";
import { EXERCISES, TF_ITEMS } from "./data";
import { METHOD_BY_TYPE } from "./metodos";
import type { ExType, ExamKind } from "./types";

/* ============================================================================
 * Banco de finales — file system de exámenes resueltos paso a paso. Cada examen
 * y cada tipo de ejercicio abre su propia vista (drill-down con breadcrumb).
 * Modos: Exámenes · Por tipo · Propuestos (TPs) · Verdadero/Falso.
 * ========================================================================== */

type Mode = "examenes" | "tipo" | "tps" | "vf";

const MODES: { id: Mode; label: string }[] = [
  { id: "examenes", label: "Exámenes" },
  { id: "tipo", label: "Por tipo" },
  { id: "tps", label: "Propuestos (TPs)" },
  { id: "vf", label: "Verdadero / Falso" },
];

const KIND_GROUPS: { kind: ExamKind; label: string }[] = [
  { kind: "parcial1", label: "Primeros parciales" },
  { kind: "parcial2", label: "Segundos parciales" },
  { kind: "recu", label: "Recuperatorios" },
  { kind: "final", label: "Finales" },
  { kind: "parcialito", label: "Parcialitos por TP" },
];

const SOLVED_LABEL: Record<string, string> = {
  full: "resuelto",
  partial: "comentado",
  answers: "respuestas",
  none: "sin resolución",
};

const PROGRESS_KEY = "proba.v1.finales.done";

function loadDone(): Record<string, boolean> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(PROGRESS_KEY) || "{}");
  } catch {
    return {};
  }
}

export default function Finales() {
  const [mode, setMode] = useState<Mode>("examenes");
  const [selExam, setSelExam] = useState<string | null>(null);
  const [selType, setSelType] = useState<ExType | null>(null);
  const [pos, setPos] = useState(0);
  const [vfType, setVfType] = useState<ExType | "all">("all");

  // Progreso (static-export safe: valor por defecto en SSR; carga en montaje).
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setDone(loadDone());
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(done));
  }, [done, hydrated]);
  const toggleDone = (id: string) => setDone((d) => ({ ...d, [id]: !d[id] }));

  const byId = useMemo(
    () => Object.fromEntries(EXERCISES.map((e) => [e.id, e])),
    [],
  );
  const doneCount = useMemo(
    () => EXERCISES.filter((e) => done[e.id]).length,
    [done],
  );

  const switchMode = (m: Mode) => {
    setMode(m);
    setSelExam(null);
    setSelType(null);
    setPos(0);
  };

  const typeCount = (t: ExType) =>
    EXERCISES.filter((e) => e.types.includes(t)).length;

  const ofType = useMemo(
    () => (selType ? EXERCISES.filter((e) => e.types.includes(selType)) : []),
    [selType],
  );
  const current = ofType[pos];
  const openType = (t: ExType) => {
    setSelType(t);
    setPos(0);
  };

  const vfItems = useMemo(
    () =>
      vfType === "all" ? TF_ITEMS : TF_ITEMS.filter((i) => i.type === vfType),
    [vfType],
  );

  const exam = selExam ? EXAMS.find((e) => e.id === selExam) : null;
  const typeMeta = selType ? EX_TYPES.find((t) => t.id === selType) : null;

  return (
    <div className="vfin">
      <div className="vtool-head">
        <h3>Banco de finales</h3>
        <p>
          Parciales y finales resueltos paso a paso (resoluciones de la cátedra),
          navegables como un file system: cada examen y cada tipo de ejercicio
          abre su propia vista. En <strong>Por tipo</strong>, cada categoría abre
          su <strong>método genérico paso a paso</strong> (cómo reconocer el
          ejercicio, la receta y los teoremas que se usan) antes de los casos
          concretos. Con TPs propuestos y un mazo de verdadero/falso.
        </p>
      </div>

      <div className="vfin__modes" role="tablist" aria-label="Modo">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="tab"
            aria-selected={mode === m.id}
            className={`vfin__mode ${mode === m.id ? "is-active" : ""}`}
            onClick={() => switchMode(m.id)}
          >
            {m.label}
          </button>
        ))}
        <span className="vfin__progress">
          {doneCount}/{EXERCISES.length} hechos
        </span>
      </div>

      {/* ── Exámenes ── */}
      {mode === "examenes" && !exam && (
        <div className="vfin__deck">
          {KIND_GROUPS.map((g) => {
            const exams = EXAMS.filter((e) => e.kind === g.kind);
            if (!exams.length) return null;
            return (
              <section key={g.kind} className="vfin__group">
                <h4 className="vfin__group-head">
                  <span>{g.label}</span>
                  <span className="vfin__group-rule" aria-hidden="true" />
                  <span className="vfin__group-count">
                    {String(exams.length).padStart(2, "0")}
                  </span>
                </h4>
                <div className="vfin__examgrid">
                  {exams.map((e) => {
                    const n = e.exerciseIds.filter((id) => byId[id]).length;
                    return (
                      <button
                        key={e.id}
                        type="button"
                        className="vfin-examrow"
                        onClick={() => setSelExam(e.id)}
                        disabled={n === 0}
                        title={n === 0 ? "Sin ejercicios transcriptos" : undefined}
                      >
                        <span className="vfin-examrow__name">{e.name}</span>
                        <span className="vfin-examrow__meta">
                          <span className={`vfin-exam__solved is-${e.solved}`}>
                            {SOLVED_LABEL[e.solved]}
                          </span>
                          <span className="vfin-examrow__n">
                            {n > 0 ? `${n} ej.` : "—"}
                          </span>
                          {n > 0 && (
                            <span className="vfin-examrow__arrow" aria-hidden="true">
                              →
                            </span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {/* ── Vista de un examen ── */}
      {mode === "examenes" && exam && (
        <div className="vfin__detail">
          <button
            type="button"
            className="vfin-back"
            onClick={() => setSelExam(null)}
          >
            ← Exámenes
          </button>
          <div className="vfin-detail__head">
            <h4 className="vfin-detail__title">{exam.name}</h4>
            <span className={`vfin-exam__solved is-${exam.solved}`}>
              {SOLVED_LABEL[exam.solved]}
            </span>
          </div>
          <p className="vfin-detail__topics">{exam.topics}</p>
          {exam.exerciseIds
            .map((id) => byId[id])
            .filter(Boolean)
            .map((e) => (
              <ExerciseCard
                key={e.id}
                ex={e}
                done={done[e.id]}
                onToggleDone={() => toggleDone(e.id)}
              />
            ))}
        </div>
      )}

      {/* ── Por tipo ── */}
      {mode === "tipo" && !selType && (
        <div className="vfin__typegrid">
          {EX_TYPES.map((t) => {
            const n = typeCount(t.id);
            const hasMethod = !!METHOD_BY_TYPE[t.id];
            return (
              <button
                key={t.id}
                type="button"
                className="vfin-typecard"
                onClick={() => openType(t.id)}
                disabled={n === 0 && !hasMethod}
              >
                <span className="vfin-typecard__top">
                  <span className="vfin-typecard__label">{t.label}</span>
                  <span className="vfin-typecard__n">{n}</span>
                </span>
                <span className="vfin-typecard__blurb">{t.blurb}</span>
                <span className="vfin-typecard__foot">
                  <span className="vfin-typecard__units">{t.units}</span>
                  {hasMethod && (
                    <span className="vfin-typecard__method">método paso a paso</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Vista de un tipo (uno por uno) ── */}
      {mode === "tipo" && selType && typeMeta && (
        <div className="vfin__detail">
          <button
            type="button"
            className="vfin-back"
            onClick={() => setSelType(null)}
          >
            ← Por tipo
          </button>
          <div className="vfin-detail__head">
            <h4 className="vfin-detail__title">{typeMeta.label}</h4>
            <span className="vfin-detail__sub">{typeMeta.blurb}</span>
          </div>
          {METHOD_BY_TYPE[selType] && (
            <MethodCard method={METHOD_BY_TYPE[selType]!} />
          )}
          {ofType.length === 0 ? (
            <Note>
              Todavía no hay ejercicios concretos transcriptos de este tipo en el
              banco, pero el método genérico de arriba cubre el patrón general.
            </Note>
          ) : (
            <>
              <div className="vfin-onebyone__head">
                <span className="vfin-eyebrow">Ejercicios resueltos del tipo</span>
              </div>
              <div className="vfin-onebyone">
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() =>
                    setPos((p) => (p - 1 + ofType.length) % ofType.length)
                  }
                  disabled={ofType.length < 2}
                >
                  ← Anterior
                </button>
                <span className="vfin-onebyone__count">
                  {pos + 1} / {ofType.length}
                </span>
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() => setPos((p) => (p + 1) % ofType.length)}
                  disabled={ofType.length < 2}
                >
                  Siguiente →
                </button>
              </div>
              {current && (
                <ExerciseCard
                  ex={current}
                  done={done[current.id]}
                  onToggleDone={() => toggleDone(current.id)}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* ── TPs propuestos ── */}
      {mode === "tps" && (
        <div className="vfin__tps">
          <Note>
            Las guías de TP de la cátedra: los ejercicios propuestos por unidad.
            Practicá la guía completa y volvé a los parciales para entrenar el
            reconocimiento del método.
          </Note>
          <div className="vfin-tps">
            {TPS.map((tp) => (
              <div key={tp.id} className="vfin-tp">
                <div className="vfin-tp__top">
                  <span className="vfin-tp__n">TP{tp.n}</span>
                  <span className="vfin-tp__unit">{tp.unit}</span>
                </div>
                <div className="vfin-tp__title">{tp.title}</div>
                <p className="vfin-tp__blurb">{tp.blurb}</p>
                <div className="vfin-tp__types">
                  {tp.types.map((t) => (
                    <span key={t} className="vfin-ex__type">
                      {EX_TYPES.find((x) => x.id === t)?.label ?? t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Verdadero / Falso ── */}
      {mode === "vf" && (
        <div className="vfin__vf">
          <div className="vfin-types">
            <button
              type="button"
              className={`vfin-type ${vfType === "all" ? "is-active" : ""}`}
              onClick={() => setVfType("all")}
            >
              Todos
              <span className="vfin-type__n">{TF_ITEMS.length}</span>
            </button>
            {EX_TYPES.map((t) => {
              const n = TF_ITEMS.filter((i) => i.type === t.id).length;
              if (n === 0) return null;
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`vfin-type ${vfType === t.id ? "is-active" : ""}`}
                  onClick={() => setVfType(t.id)}
                >
                  {t.label}
                  <span className="vfin-type__n">{n}</span>
                </button>
              );
            })}
          </div>
          <TFDeck key={vfType} items={vfItems} />
        </div>
      )}
    </div>
  );
}
