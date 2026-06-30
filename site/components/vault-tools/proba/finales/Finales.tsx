"use client";

import { useEffect, useMemo, useState } from "react";
import { Note } from "@studyvaults/ui";
import ExerciseCard from "./ExerciseCard";
import TFDeck from "./TFDeck";
import { EX_TYPES, EXAMS, TPS } from "./catalog";
import { EXERCISES, TF_ITEMS } from "./data";
import type { ExType, ExamKind } from "./types";

/* ============================================================================
 * Banco de finales — file system de exámenes resueltos paso a paso, filtro por
 * tipo de ejercicio (visor uno por uno), ejercicios propuestos (TPs) y mazo de
 * verdadero/falso. Contenido fiel a las resoluciones de la cátedra.
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
  const [openExam, setOpenExam] = useState<string | null>(null);
  const [type, setType] = useState<ExType | null>(null);
  const [pos, setPos] = useState(0);
  const [vfType, setVfType] = useState<ExType | "all">("all");

  // Progreso (static-export safe: estado por defecto en SSR; carga en montaje).
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
  const toggleDone = (id: string) =>
    setDone((d) => ({ ...d, [id]: !d[id] }));

  const byId = useMemo(
    () => Object.fromEntries(EXERCISES.map((e) => [e.id, e])),
    [],
  );
  const doneCount = useMemo(
    () => EXERCISES.filter((e) => done[e.id]).length,
    [done],
  );

  // Filtro por tipo (visor uno por uno).
  const ofType = useMemo(
    () =>
      type ? EXERCISES.filter((e) => e.types.includes(type)) : [],
    [type],
  );
  const current = ofType[pos];
  const pickType = (t: ExType) => {
    setType(t);
    setPos(0);
  };

  const vfItems = useMemo(
    () => (vfType === "all" ? TF_ITEMS : TF_ITEMS.filter((i) => i.type === vfType)),
    [vfType],
  );

  const typeCount = (t: ExType) =>
    EXERCISES.filter((e) => e.types.includes(t)).length;

  return (
    <div className="vfin">
      <div className="vtool-head">
        <h3>Banco de finales</h3>
        <p>
          Parciales y finales resueltos paso a paso (resoluciones de la cátedra),
          navegables como un file system, filtrables por tipo de ejercicio, más
          los TPs propuestos y un mazo de verdadero/falso para repasar conceptos.
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
            onClick={() => setMode(m.id)}
          >
            {m.label}
          </button>
        ))}
        <span className="vfin__progress">
          {doneCount}/{EXERCISES.length} hechos
        </span>
      </div>

      {/* ── Exámenes (file system) ── */}
      {mode === "examenes" && (
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
                {exams.map((ex) => {
                  const exercises = ex.exerciseIds
                    .map((id) => byId[id])
                    .filter(Boolean);
                  const isOpen = openExam === ex.id;
                  return (
                    <div key={ex.id} className="vfin-exam">
                      <button
                        type="button"
                        className="vfin-exam__head"
                        onClick={() =>
                          setOpenExam(isOpen ? null : ex.id)
                        }
                        aria-expanded={isOpen}
                      >
                        <span className="vfin-exam__chevron" aria-hidden="true">
                          {isOpen ? "▾" : "▸"}
                        </span>
                        <span className="vfin-exam__name">{ex.name}</span>
                        <span
                          className={`vfin-exam__solved is-${ex.solved}`}
                        >
                          {SOLVED_LABEL[ex.solved]}
                        </span>
                        <span className="vfin-exam__n">
                          {exercises.length > 0
                            ? `${exercises.length} ej.`
                            : "—"}
                        </span>
                      </button>
                      {isOpen && (
                        <div className="vfin-exam__body">
                          <p className="vfin-exam__topics">{ex.topics}</p>
                          {exercises.length > 0 ? (
                            exercises.map((e) => (
                              <ExerciseCard
                                key={e.id}
                                ex={e}
                                done={done[e.id]}
                                onToggleDone={() => toggleDone(e.id)}
                              />
                            ))
                          ) : (
                            <Note>
                              En el catálogo de la cátedra; todavía sin
                              ejercicios transcriptos en el banco.
                            </Note>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </section>
            );
          })}
        </div>
      )}

      {/* ── Por tipo (visor uno por uno) ── */}
      {mode === "tipo" && (
        <div className="vfin__bytype">
          <div className="vfin-types">
            {EX_TYPES.map((t) => {
              const n = typeCount(t.id);
              return (
                <button
                  key={t.id}
                  type="button"
                  className={`vfin-type ${type === t.id ? "is-active" : ""}`}
                  onClick={() => pickType(t.id)}
                  disabled={n === 0}
                  title={t.blurb}
                >
                  {t.label}
                  <span className="vfin-type__n">{n}</span>
                </button>
              );
            })}
          </div>

          {!type ? (
            <Note>
              Elegí un tipo de ejercicio para recorrer, uno por uno, todos los que
              aparecieron en parciales y finales.
            </Note>
          ) : ofType.length === 0 ? (
            <Note>No hay ejercicios de este tipo en el banco.</Note>
          ) : (
            <>
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
                  {pos + 1} / {ofType.length} ·{" "}
                  {EX_TYPES.find((t) => t.id === type)?.label}
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
