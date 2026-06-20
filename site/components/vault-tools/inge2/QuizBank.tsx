"use client";

/* ──────────────────────────────────────────────────────────────────────────
   Inge2 study toolkit — banco de preguntas graduable (quiz).

   Máquina de estados de 3 pantallas (setup → run → results). Persiste el
   historial por pregunta bajo toolKey("quiz") y publica su contribución por
   unidad al dashboard compartido vía publishContribution. Static-export safe:
   todo acceso a window/localStorage vive en useEffect/handlers (mismo patrón
   de hidratación → persistencia que ReviewChecklist en Inge2Tools.tsx).
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useMemo, useState } from "react";
import { Panel, SubPanel, Note, Chip, Button, Badge, BigNum, Select } from "@studyvaults/ui";

import type { Difficulty, QuizQuestion, UnitId } from "./types";
import { QUIZ } from "./data/quiz";
import { UNITS, UNIT_LIST } from "./data/units";
import {
  publishContribution,
  toolKey,
  loadJSON,
  saveJSON,
  clamp01,
  type Contribution,
} from "./progress";

/* ──────────────────────────────── tipos ───────────────────────────────── */

/** Historial persistido por pregunta. */
interface QStat {
  seen: number;
  correct: number;
}
type History = Record<string, QStat>;

type Screen = "setup" | "run" | "results";

/** Resultado registrado de una pregunta dentro del run en curso. */
interface Answered {
  qid: string;
  picked: number[];
  ok: boolean;
}

const DIFFS: { id: Difficulty; label: string }[] = [
  { id: "basico", label: "Básico" },
  { id: "intermedio", label: "Intermedio" },
  { id: "avanzado", label: "Avanzado" },
];

const DIFF_LABEL: Record<Difficulty, string> = {
  basico: "Básico",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
};

const HISTORY_KEY = toolKey("quiz");

/* ──────────────────────────────── utils ───────────────────────────────── */

/** Compara dos sets de índices por igualdad exacta (orden-independiente). */
function sameSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort((x, y) => x - y);
  const sb = [...b].sort((x, y) => x - y);
  return sa.every((v, i) => v === sb[i]);
}

/** Fisher-Yates — barajado in-place de una COPIA (sólo en handlers). */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Construye el mapa de contribución por unidad a partir del historial.
 * Para cada unidad cubierta por QUIZ:
 *   total   = preguntas de esa unidad en QUIZ
 *   seen    = preguntas distintas respondidas ≥ 1 vez
 *   mastery = Σ correct / Σ seen sobre las preguntas de esa unidad (clamp01)
 */
function contributionFrom(history: History): Partial<Record<UnitId, Contribution>> {
  const byUnit: Partial<Record<UnitId, Contribution>> = {};
  for (const q of QUIZ) {
    const prev = byUnit[q.unit] ?? { mastery: 0, seen: 0, total: 0 };
    const stat = history[q.id];
    const seen = stat && stat.seen > 0 ? 1 : 0;
    byUnit[q.unit] = {
      total: prev.total + 1,
      seen: prev.seen + seen,
      // acumulamos sumas crudas en mastery; normalizamos al final
      mastery: prev.mastery + (stat ? stat.correct / Math.max(1, stat.seen) : 0),
    };
  }
  // normalizar mastery: promedio sobre las preguntas vistas de la unidad
  for (const u of Object.keys(byUnit) as UnitId[]) {
    const c = byUnit[u]!;
    c.mastery = clamp01(c.seen > 0 ? c.mastery / c.seen : 0);
  }
  return byUnit;
}

/* ─────────────────────────── ProgressBar local ─────────────────────────── */
/* Clon del ProgressBar de Inge2Tools.tsx (mismo lenguaje visual). */
function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      style={{
        marginTop: 10,
        height: 8,
        borderRadius: 999,
        background: "var(--hairline)",
        overflow: "hidden",
      }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: clamped === 100 ? "var(--accent)" : "var(--primary)",
          transition: "width 180ms ease",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════ QuizBank ═════════════════════════════════ */

export default function QuizBank() {
  /* ---- historial persistente (hidratación → persistencia, à la ReviewChecklist) ---- */
  const [history, setHistory] = useState<History>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHistory(loadJSON<History>(HISTORY_KEY, {}));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    saveJSON(HISTORY_KEY, history);
  }, [history, hydrated]);

  /* Publicar contribución cada vez que cambia el historial (post-hidratación). */
  useEffect(() => {
    if (!hydrated) return;
    publishContribution("quiz", contributionFrom(history));
  }, [history, hydrated]);

  /* ---- estado de pantalla / setup ---- */
  const [screen, setScreen] = useState<Screen>("setup");

  // "Todas" = conjunto vacío de unidades seleccionadas explícitamente.
  const [units, setUnits] = useState<Set<UnitId>>(new Set());
  const [diff, setDiff] = useState<Difficulty | "all">("all");
  const [amount, setAmount] = useState<string>("10"); // "10" | "20" | "all"

  /* ---- estado de run ---- */
  const [run, setRun] = useState<QuizQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [answers, setAnswers] = useState<Answered[]>([]);

  /* ---- preguntas que matchean el filtro actual (para el contador del setup) ---- */
  const matching = useMemo(() => {
    return QUIZ.filter((q) => {
      const unitOk = units.size === 0 || units.has(q.unit);
      const diffOk = diff === "all" || q.difficulty === diff;
      return unitOk && diffOk;
    });
  }, [units, diff]);

  const toggleUnit = (u: UnitId) =>
    setUnits((prev) => {
      const next = new Set(prev);
      if (next.has(u)) next.delete(u);
      else next.add(u);
      return next;
    });

  /* ─────────────────────── arrancar un run ─────────────────────── */
  function startRun(pool: QuizQuestion[]) {
    if (pool.length === 0) return;
    setRun(pool);
    setIdx(0);
    setPicked([]);
    setRevealed(false);
    setAnswers([]);
    setScreen("run");
  }

  const handleStart = () => {
    const shuffled = shuffle(matching);
    const n = amount === "all" ? shuffled.length : Math.min(Number(amount), shuffled.length);
    startRun(shuffled.slice(0, n));
  };

  /* ─────────────────────── responder / avanzar ─────────────────────── */
  const current = run[idx];

  const togglePick = (i: number) => {
    if (revealed || !current) return;
    if (current.kind === "multi") {
      setPicked((prev) =>
        prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i],
      );
    } else {
      setPicked([i]); // mcq / tf → selección única
    }
  };

  const handleAnswer = () => {
    if (!current || picked.length === 0 || revealed) return;
    // "correcto" en multi ⇒ el set elegido == el set correcto exactamente.
    const ok = sameSet(picked, current.correct);
    setRevealed(true);
    setAnswers((prev) => [...prev, { qid: current.id, picked: [...picked], ok }]);
    setHistory((prev) => {
      const cur = prev[current.id] ?? { seen: 0, correct: 0 };
      return {
        ...prev,
        [current.id]: { seen: cur.seen + 1, correct: cur.correct + (ok ? 1 : 0) },
      };
    });
  };

  const handleNext = () => {
    if (idx + 1 >= run.length) {
      setScreen("results");
      return;
    }
    setIdx((i) => i + 1);
    setPicked([]);
    setRevealed(false);
  };

  /* score corriente del run */
  const runCorrect = answers.reduce((n, a) => (a.ok ? n + 1 : n), 0);

  /* ─────────────────────── resultados ─────────────────────── */
  const finalCorrect = answers.reduce((n, a) => (a.ok ? n + 1 : n), 0);
  const finalTotal = answers.length;
  const finalPct = finalTotal ? Math.round((finalCorrect / finalTotal) * 100) : 0;

  /** Desglose por unidad SOBRE las preguntas respondidas en este run. */
  const breakdown = useMemo(() => {
    const map = new Map<UnitId, { correct: number; total: number }>();
    for (const a of answers) {
      const q = run.find((x) => x.id === a.qid);
      if (!q) continue;
      const e = map.get(q.unit) ?? { correct: 0, total: 0 };
      e.total += 1;
      if (a.ok) e.correct += 1;
      map.set(q.unit, e);
    }
    return [...map.entries()]
      .map(([unit, v]) => ({
        unit,
        ...v,
        mastery: v.total ? v.correct / v.total : 0,
      }))
      .sort((a, b) => a.mastery - b.mastery);
  }, [answers, run]);

  /** Preguntas falladas (con su explicación) para la lista de repaso. */
  const failed = useMemo(() => {
    const out: { q: QuizQuestion; picked: number[] }[] = [];
    for (const a of answers) {
      if (a.ok) continue;
      const q = run.find((x) => x.id === a.qid);
      if (q) out.push({ q, picked: a.picked });
    }
    return out;
  }, [answers, run]);

  const retryFailed = () => startRun(shuffle(failed.map((f) => f.q)));
  const newAttempt = () => setScreen("setup");

  /* ══════════════════════════ render ══════════════════════════ */
  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Práctica graduada</span>
        <h3>Banco de preguntas</h3>
        <p>
          Quiz autocorregible por unidad y dificultad. Elegí el alcance, respondé con
          feedback inmediato y revisá tu desglose por unidad. Tu historial se guarda en el
          navegador y alimenta el plan de recu. {!hydrated && "Cargando tu progreso…"}
        </p>
      </div>

      {screen === "setup" && (
        <SetupScreen
          units={units}
          toggleUnit={toggleUnit}
          setAllUnits={() => setUnits(new Set())}
          diff={diff}
          setDiff={setDiff}
          amount={amount}
          setAmount={setAmount}
          matchCount={matching.length}
          onStart={handleStart}
        />
      )}

      {screen === "run" && current && (
        <RunScreen
          q={current}
          index={idx}
          total={run.length}
          score={runCorrect}
          picked={picked}
          revealed={revealed}
          onPick={togglePick}
          onAnswer={handleAnswer}
          onNext={handleNext}
          isLast={idx + 1 >= run.length}
        />
      )}

      {screen === "results" && (
        <ResultsScreen
          correct={finalCorrect}
          total={finalTotal}
          pct={finalPct}
          breakdown={breakdown}
          failed={failed}
          onRetryFailed={failed.length > 0 ? retryFailed : undefined}
          onNewAttempt={newAttempt}
        />
      )}
    </Panel>
  );
}

/* ══════════════════════════════ SETUP ══════════════════════════════════ */

function SetupScreen(props: {
  units: Set<UnitId>;
  toggleUnit: (u: UnitId) => void;
  setAllUnits: () => void;
  diff: Difficulty | "all";
  setDiff: (d: Difficulty | "all") => void;
  amount: string;
  setAmount: (a: string) => void;
  matchCount: number;
  onStart: () => void;
}) {
  const { units, toggleUnit, setAllUnits, diff, setDiff, amount, setAmount, matchCount, onStart } =
    props;

  return (
    <div className="vtool-stack">
      <SubPanel>
        <div className="vtool-field">
          <span className="vtool-label">
            <span>Unidades</span>
          </span>
          <div className="vtool-row">
            <Chip active={units.size === 0} onClick={setAllUnits}>
              Todas
            </Chip>
            {UNIT_LIST.map((u) => (
              <Chip key={u.id} active={units.has(u.id)} onClick={() => toggleUnit(u.id)}>
                {u.label}
              </Chip>
            ))}
          </div>
          <Note style={{ marginTop: 8 }}>
            Sin selección = todas las unidades del programa.
          </Note>
        </div>
      </SubPanel>

      <SubPanel>
        <div className="vtool-field">
          <span className="vtool-label">
            <span>Dificultad</span>
          </span>
          <div className="vtool-row">
            <Chip active={diff === "all"} onClick={() => setDiff("all")}>
              Todas
            </Chip>
            {DIFFS.map((d) => (
              <Chip key={d.id} active={diff === d.id} onClick={() => setDiff(d.id)}>
                {d.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="vtool-field" style={{ marginTop: 16 }}>
          <label className="vtool-label" htmlFor="quiz-amount">
            <span>Cantidad de preguntas</span>
          </label>
          <Select
            id="quiz-amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            options={[
              { value: "10", label: "10 preguntas" },
              { value: "20", label: "20 preguntas" },
              { value: "all", label: "Todas las que matcheen" },
            ]}
          />
        </div>
      </SubPanel>

      <div
        className="vtool-row"
        style={{ justifyContent: "space-between", alignItems: "baseline" }}
      >
        <span className="vtool-mono">
          {matchCount} {matchCount === 1 ? "pregunta" : "preguntas"} matchean
        </span>
        <Button variant="primary" size="sm" onClick={onStart} disabled={matchCount === 0}>
          Empezar
        </Button>
      </div>
      {matchCount === 0 && (
        <Note tone="error" style={{ marginTop: 4 }}>
          Ninguna pregunta coincide con el filtro. Ampliá unidades o dificultad.
        </Note>
      )}
    </div>
  );
}

/* ══════════════════════════════ RUN ════════════════════════════════════ */

function RunScreen(props: {
  q: QuizQuestion;
  index: number;
  total: number;
  score: number;
  picked: number[];
  revealed: boolean;
  onPick: (i: number) => void;
  onAnswer: () => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const { q, index, total, score, picked, revealed, onPick, onAnswer, onNext, isLast } = props;
  const isMulti = q.kind === "multi";
  const pct = total ? Math.round(((index + (revealed ? 1 : 0)) / total) * 100) : 0;
  const correctSet = new Set(q.correct);

  return (
    <div className="vtool-stack">
      {/* barra superior: progreso + score */}
      <div
        className="vtool-row"
        style={{ justifyContent: "space-between", alignItems: "baseline" }}
      >
        <span className="vtool-mono">
          Pregunta {index + 1}/{total}
        </span>
        <span className="vtool-mono">
          Aciertos: {score}/{index + (revealed ? 1 : 0)}
        </span>
      </div>
      <ProgressBar pct={pct} />

      <SubPanel>
        <div className="vtool-row" style={{ gap: 8, marginBottom: 10 }}>
          <Badge>{UNITS[q.unit].label}</Badge>
          <Badge variant="status">{DIFF_LABEL[q.difficulty]}</Badge>
          {isMulti && <Badge variant="sys">Selección múltiple</Badge>}
        </div>

        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 17,
            lineHeight: 1.45,
            color: "var(--ink-strong)",
            margin: "0 0 14px",
          }}
        >
          {q.prompt}
        </p>

        <fieldset
          style={{ border: 0, margin: 0, padding: 0 }}
          aria-label={isMulti ? "Elegí todas las correctas" : "Elegí una opción"}
        >
          <div className="vtool-stack" style={{ gap: 8 }}>
            {q.options.map((opt, i) => {
              const isPicked = picked.includes(i);
              const isCorrect = correctSet.has(i);
              const inputId = `${q.id}-opt-${i}`;

              // colores de feedback tras responder
              let color = "var(--text-primary)";
              let strike = false;
              let weight: number | undefined;
              if (revealed) {
                if (isCorrect) {
                  color = "var(--accent)";
                  weight = 600;
                } else if (isPicked) {
                  color = "var(--text-secondary)";
                  strike = true;
                }
              }

              return (
                <label
                  key={i}
                  htmlFor={inputId}
                  className="vtool-row"
                  style={{
                    gap: 10,
                    cursor: revealed ? "default" : "pointer",
                    alignItems: "flex-start",
                    flexWrap: "nowrap",
                    padding: "8px 10px",
                    borderRadius: 8,
                    border: "1px solid var(--hairline)",
                    background:
                      revealed && isCorrect ? "color-mix(in srgb, var(--accent) 10%, transparent)" : "transparent",
                  }}
                >
                  <input
                    id={inputId}
                    type={isMulti ? "checkbox" : "radio"}
                    name={`q-${q.id}`}
                    checked={isPicked}
                    disabled={revealed}
                    onChange={() => onPick(i)}
                    style={{ marginTop: 3, accentColor: "var(--accent)" }}
                  />
                  <span
                    style={{
                      color,
                      textDecoration: strike ? "line-through" : "none",
                      fontWeight: weight,
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {opt}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {!revealed ? (
          <div className="vtool-row" style={{ marginTop: 14 }}>
            <Button
              variant="primary"
              size="sm"
              onClick={onAnswer}
              disabled={picked.length === 0}
            >
              Responder
            </Button>
          </div>
        ) : (
          <>
            <SubPanel style={{ marginTop: 14 }}>
              <span className="vtool-eyebrow">{sameSetReveal(picked, q.correct)}</span>
              <Note style={{ marginTop: 6 }}>{q.explanation}</Note>
              {q.wiki && (
                <div className="vtool-row" style={{ marginTop: 10 }}>
                  <Button variant="ghost" size="sm" href={`/inge2/${q.wiki}/`}>
                    Repasar
                  </Button>
                </div>
              )}
            </SubPanel>
            <div className="vtool-row" style={{ marginTop: 14 }}>
              <Button variant="primary" size="sm" onClick={onNext}>
                {isLast ? "Ver resultados" : "Siguiente"}
              </Button>
            </div>
          </>
        )}
      </SubPanel>
    </div>
  );
}

/** Etiqueta corta del resultado de la pregunta recién respondida. */
function sameSetReveal(picked: number[], correct: number[]): string {
  return sameSet(picked, correct) ? "Correcto" : "Incorrecto";
}

/* ════════════════════════════ RESULTS ══════════════════════════════════ */

function ResultsScreen(props: {
  correct: number;
  total: number;
  pct: number;
  breakdown: { unit: UnitId; correct: number; total: number; mastery: number }[];
  failed: { q: QuizQuestion; picked: number[] }[];
  onRetryFailed?: () => void;
  onNewAttempt: () => void;
}) {
  const { correct, total, pct, breakdown, failed, onRetryFailed, onNewAttempt } = props;

  return (
    <div className="vtool-stack">
      <SubPanel>
        <div
          className="vtool-row"
          style={{ justifyContent: "space-between", alignItems: "center" }}
        >
          <div>
            <span className="vtool-eyebrow">Resultado</span>
            <span className="vtool-mono" style={{ display: "block", marginTop: 4 }}>
              {correct} / {total} correctas
            </span>
          </div>
          <BigNum value={`${pct}`} unit="%" />
        </div>
        <ProgressBar pct={pct} />
      </SubPanel>

      {breakdown.length > 0 && (
        <SubPanel>
          <strong
            style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink-strong)" }}
          >
            Desglose por unidad
          </strong>
          <div className="vtool-stack" style={{ gap: 12, marginTop: 12 }}>
            {breakdown.map((b) => {
              const weak = b.mastery < 0.6;
              return (
                <div key={b.unit}>
                  <div
                    className="vtool-row"
                    style={{ justifyContent: "space-between", alignItems: "baseline" }}
                  >
                    <span style={{ color: "var(--text-primary)", fontSize: 14 }}>
                      {UNITS[b.unit].label}
                      {weak && (
                        <Badge variant="solid" style={{ marginLeft: 8 }}>
                          A reforzar
                        </Badge>
                      )}
                    </span>
                    <span className="vtool-mono">
                      {b.correct}/{b.total}
                    </span>
                  </div>
                  <ProgressBar pct={Math.round(b.mastery * 100)} />
                </div>
              );
            })}
          </div>
        </SubPanel>
      )}

      {failed.length > 0 && (
        <SubPanel>
          <strong
            style={{ fontFamily: "var(--font-display)", fontSize: 16, color: "var(--ink-strong)" }}
          >
            Preguntas falladas ({failed.length})
          </strong>
          <div className="vtool-stack" style={{ gap: 10, marginTop: 12 }}>
            {failed.map(({ q }) => (
              <details
                key={q.id}
                style={{
                  border: "1px solid var(--hairline)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}
              >
                <summary
                  style={{
                    cursor: "pointer",
                    color: "var(--text-primary)",
                    fontSize: 14,
                    lineHeight: 1.45,
                  }}
                >
                  {q.prompt}
                </summary>
                <div className="vtool-row" style={{ gap: 8, margin: "10px 0 6px" }}>
                  <Badge>{UNITS[q.unit].label}</Badge>
                  <Badge variant="status">{DIFF_LABEL[q.difficulty]}</Badge>
                </div>
                <p style={{ color: "var(--accent)", fontSize: 13, margin: "0 0 6px" }}>
                  Correcta: {q.correct.map((i) => q.options[i]).join(" · ")}
                </p>
                <Note style={{ marginTop: 0 }}>{q.explanation}</Note>
                {q.wiki && (
                  <div className="vtool-row" style={{ marginTop: 8 }}>
                    <Button variant="ghost" size="sm" href={`/inge2/${q.wiki}/`}>
                      Repasar
                    </Button>
                  </div>
                )}
              </details>
            ))}
          </div>
        </SubPanel>
      )}

      <div className="vtool-row" style={{ gap: 10 }}>
        {onRetryFailed && (
          <Button variant="primary" size="sm" onClick={onRetryFailed}>
            Reintentar las que fallé
          </Button>
        )}
        <Button variant="secondary" size="sm" onClick={onNewAttempt}>
          Nuevo intento
        </Button>
      </div>
    </div>
  );
}
