"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel, SubPanel, Note, Chip, Button, Badge } from "@studyvaults/ui";
import type { UnitId, TradeoffItem } from "./types";
import { TRADEOFFS } from "./data/tradeoffs";
import {
  publishContribution,
  toolKey,
  loadJSON,
  saveJSON,
  clamp01,
} from "./progress";

/* ──────────────────────────────────────────────────────────────────────────
   Ingeniería del Software II — Entrenador de trade-offs canónicos (§10).

   Cada trade-off canónico gana un atributo (`attrA`) a costa de sacrificar otro
   (`attrB`), evidenciado por un `mechanism`, y se resuelve en la práctica de una
   forma concreta (`resolution`). Esta herramienta los entrena de dos maneras:

     • Repaso — flashcard de trade-off: revelás la resolución y te autocalificás
       ("La sé" / "Repasar").
     • Quiz — "¿qué se sacrifica?": dado el mecanismo y el atributo que se gana,
       elegís cuál se sacrifica entre 4 opciones.

   Static-export safe: el estado persistido arranca vacío en SSR y se hidrata en
   un useEffect de montaje; Math.random() sólo se invoca en handlers (barajar el
   quiz / próxima carta), nunca en render. Patrón calcado de Flashcards.tsx
   (hydrated → load → persist) y de ReviewChecklist en Inge2Tools.tsx.
   ────────────────────────────────────────────────────────────────────────── */

/* ──────────────────────────── Modelo persistido ────────────────────────── */

/** Calificación de cada trade-off: lo sé bien o lo tengo que repasar. */
type Grade = "known" | "review";

type StateMap = Record<string, Grade>;

const STORAGE_KEY = toolKey("tradeoff");

/* ─────────────────────────── ProgressBar local ─────────────────────────── */
/* Clon del de Inge2Tools.tsx / Flashcards.tsx (mismo lenguaje visual). */
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

/* ──────────────────────── Agregación de progreso ───────────────────────── */

/** Construye el mapa de contribución por unidad para `publishContribution`. */
function buildContribution(
  map: StateMap,
): Partial<Record<UnitId, { mastery: number; seen: number; total: number }>> {
  const acc: Partial<
    Record<UnitId, { total: number; seen: number; known: number }>
  > = {};
  for (const item of TRADEOFFS) {
    const a = acc[item.unit] ?? { total: 0, seen: 0, known: 0 };
    a.total += 1;
    const g = map[item.id];
    if (g) a.seen += 1;
    if (g === "known") a.known += 1;
    acc[item.unit] = a;
  }
  const byUnit: Partial<
    Record<UnitId, { mastery: number; seen: number; total: number }>
  > = {};
  for (const unit of Object.keys(acc) as UnitId[]) {
    const a = acc[unit]!;
    byUnit[unit] = {
      total: a.total,
      seen: a.seen,
      mastery: a.total ? clamp01(a.known / a.total) : 0,
    };
  }
  return byUnit;
}

/* ─────────────────────────────── Helpers ───────────────────────────────── */

type Mode = "review" | "quiz";

/** Baraja una copia del array (Fisher–Yates). Sólo se llama en handlers. */
function shuffle<T>(arr: T[]): T[] {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/**
 * Arma 4 opciones de atributo para el quiz: el `attrB` correcto del ítem +
 * 3 distractores tomados de los `attrB`/`attrA` de OTROS ítems (dedup, sin
 * colisionar con el correcto). Devuelve las opciones ya barajadas y el índice
 * de la correcta. Robusto si hay pocos ítems.
 */
function buildQuizOptions(item: TradeoffItem): { options: string[]; correct: number } {
  const correct = item.attrB;
  const pool: string[] = [];
  for (const other of TRADEOFFS) {
    if (other.id === item.id) continue;
    pool.push(other.attrB, other.attrA);
  }
  const distractors: string[] = [];
  const seen = new Set<string>([correct.toLowerCase()]);
  for (const cand of shuffle(pool)) {
    const key = cand.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    distractors.push(cand);
    if (distractors.length === 3) break;
  }
  const options = shuffle([correct, ...distractors]);
  return { options, correct: options.indexOf(correct) };
}

/* ──────────────────────────────── Componente ───────────────────────────── */

export default function TradeoffTrainer() {
  const [state, setState] = useState<StateMap>({});
  const [hydrated, setHydrated] = useState(false);

  const [mode, setMode] = useState<Mode>("review");

  // Índice de la carta/pregunta actual dentro del mazo.
  const [index, setIndex] = useState(0);

  // Repaso: ¿se reveló la resolución?
  const [revealed, setRevealed] = useState(false);

  // Quiz: opciones barajadas (se siembran en handlers), elección y resultado.
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);

  const total = TRADEOFFS.length;
  const current: TradeoffItem | undefined = TRADEOFFS[index];

  /* ── Hidratación: cargar estado persistido (client only). ── */
  useEffect(() => {
    setState(loadJSON<StateMap>(STORAGE_KEY, {}));
    setHydrated(true);
  }, []);

  /* ── Persistir + publicar progreso tras cada cambio (post-hidratación). ── */
  useEffect(() => {
    if (!hydrated) return;
    saveJSON(STORAGE_KEY, state);
    publishContribution("tradeoff", buildContribution(state));
  }, [state, hydrated]);

  /* ── Conteo de "sé" sobre el total. ── */
  const knownCount = useMemo(
    () => TRADEOFFS.reduce((n, it) => n + (state[it.id] === "known" ? 1 : 0), 0),
    [state],
  );
  const gradedCount = useMemo(
    () => TRADEOFFS.reduce((n, it) => n + (state[it.id] ? 1 : 0), 0),
    [state],
  );
  const pct = total ? Math.round((knownCount / total) * 100) : 0;

  /* ── Al sembrar/avanzar una pregunta de quiz, recalcular sus opciones. ── */
  function seedQuiz(i: number) {
    const item = TRADEOFFS[i];
    if (!item) {
      setQuizOptions([]);
      setQuizCorrect(0);
      setPicked(null);
      return;
    }
    const { options, correct } = buildQuizOptions(item);
    setQuizOptions(options);
    setQuizCorrect(correct);
    setPicked(null);
  }

  /* ── Cambiar de modo: reinicia la posición de la sesión (no el progreso). ── */
  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setIndex(0);
    setRevealed(false);
    if (next === "quiz") seedQuiz(0);
  }

  // Sembrar el primer quiz una vez hidratado, si arrancáramos en ese modo.
  useEffect(() => {
    if (hydrated && mode === "quiz" && quizOptions.length === 0 && total > 0) {
      seedQuiz(index);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  /* ── Avanzar a la próxima carta/pregunta (wrap-around). ── */
  function advance() {
    if (total === 0) return;
    const next = (index + 1) % total;
    setIndex(next);
    setRevealed(false);
    if (mode === "quiz") seedQuiz(next);
  }

  /* ── Repaso: calificar y avanzar. ── */
  function grade(g: Grade) {
    if (!current) return;
    setState((prev) => ({ ...prev, [current.id]: g }));
    advance();
  }

  /* ── Quiz: elegir una opción (revela el resultado, registra acierto). ── */
  function pick(i: number) {
    if (!current || picked !== null) return;
    setPicked(i);
    const ok = i === quizCorrect;
    // Acertar cuenta como "known"; fallar lo marca para repasar.
    setState((prev) => ({ ...prev, [current.id]: ok ? "known" : "review" }));
  }

  function reset() {
    if (typeof window === "undefined") return;
    const ok = window.confirm(
      "¿Reiniciar el entrenador de trade-offs? Se borra qué trade-offs marcaste como sabidos o a repasar (sólo de esta herramienta).",
    );
    if (!ok) return;
    setState({});
    setIndex(0);
    setRevealed(false);
    if (mode === "quiz") seedQuiz(0);
  }

  const currentGrade = current ? state[current.id] : undefined;

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Trade-offs canónicos</span>
        <h3>Entrenador de trade-offs</h3>
        <p>
          Cada trade-off canónico gana un atributo a costa de otro: entrenalos
          repasando la resolución o adivinando qué se sacrifica. El progreso se
          guarda en tu navegador. {!hydrated && "Cargando tu estado guardado…"}
        </p>
      </div>

      {/* ── Resumen del mazo ── */}
      <SubPanel style={{ marginBottom: 16 }}>
        <div
          className="vtool-row"
          style={{ justifyContent: "space-between", alignItems: "baseline" }}
        >
          <strong style={{ color: "var(--ink-strong)" }}>Dominio</strong>
          <span className="vtool-mono">
            sé {knownCount} / {total}
            {gradedCount > 0 && total > 0 ? ` · ${gradedCount} calificados` : ""}
          </span>
        </div>
        <ProgressBar pct={pct} />
        <div className="vtool-row" style={{ marginTop: 12 }}>
          <Button variant="ghost" size="sm" onClick={reset}>
            Reiniciar
          </Button>
        </div>
      </SubPanel>

      {/* ── Conmutador de modo ── */}
      <div className="vtool-row" style={{ marginBottom: 16 }}>
        <Chip active={mode === "review"} onClick={() => switchMode("review")}>
          Repaso
        </Chip>
        <Chip active={mode === "quiz"} onClick={() => switchMode("quiz")}>
          Quiz · ¿qué se sacrifica?
        </Chip>
      </div>

      {/* ── Sesión ── */}
      {!current ? (
        <SubPanel>
          <strong
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              color: "var(--ink-strong)",
            }}
          >
            Sin trade-offs cargados
          </strong>
          <Note style={{ marginTop: 6 }}>
            No hay trade-offs disponibles para entrenar todavía.
          </Note>
        </SubPanel>
      ) : mode === "review" ? (
        /* ───────────────────────── Modo Repaso ───────────────────────── */
        <SubPanel>
          <div
            className="vtool-row"
            style={{ justifyContent: "space-between", alignItems: "baseline" }}
          >
            <span className="vtool-eyebrow">
              Trade-off {index + 1} / {total}
            </span>
            {currentGrade && (
              <Badge variant={currentGrade === "known" ? "status" : "default"}>
                {currentGrade === "known" ? "La sé" : "A repasar"}
              </Badge>
            )}
          </div>

          {/* Anverso: el trade-off + el mecanismo que lo evidencia. */}
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              lineHeight: 1.5,
              color: "var(--ink-strong)",
              margin: "12px 0 0",
            }}
          >
            <strong style={{ color: "var(--accent)" }}>{current.attrA}</strong> ↔{" "}
            <strong style={{ color: "var(--primary)" }}>{current.attrB}</strong>
          </p>
          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              margin: "8px 0 0",
            }}
          >
            Lo evidencia: {current.mechanism}
          </p>

          {revealed ? (
            <SubPanel style={{ marginTop: 14 }}>
              <span className="vtool-eyebrow">¿Cómo se resuelve este trade-off?</span>
              <p
                className="v"
                style={{
                  textAlign: "left",
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--text-primary)",
                  margin: "8px 0 0",
                }}
              >
                {current.resolution}
              </p>
              {current.wiki && (
                <div className="vtool-row" style={{ marginTop: 12 }}>
                  <Button variant="ghost" size="sm" href={`/inge2/${current.wiki}/`}>
                    Repasar en el wiki
                  </Button>
                </div>
              )}

              <div className="vtool-row" style={{ marginTop: 16 }}>
                <Button variant="primary" size="sm" onClick={() => grade("known")}>
                  La sé
                </Button>
                <Button variant="ghost" size="sm" onClick={() => grade("review")}>
                  Repasar
                </Button>
              </div>
            </SubPanel>
          ) : (
            <div className="vtool-row" style={{ marginTop: 16 }}>
              <Button variant="primary" size="sm" onClick={() => setRevealed(true)}>
                Mostrar resolución
              </Button>
            </div>
          )}
        </SubPanel>
      ) : (
        /* ────────────────────────── Modo Quiz ────────────────────────── */
        <SubPanel>
          <div
            className="vtool-row"
            style={{ justifyContent: "space-between", alignItems: "baseline" }}
          >
            <span className="vtool-eyebrow">
              Pregunta {index + 1} / {total}
            </span>
          </div>

          <p
            style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: "var(--text-secondary)",
              margin: "12px 0 0",
            }}
          >
            {current.mechanism}
          </p>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              lineHeight: 1.5,
              color: "var(--ink-strong)",
              margin: "8px 0 0",
            }}
          >
            Gana <strong style={{ color: "var(--accent)" }}>{current.attrA}</strong>,
            ¿qué <strong>sacrifica</strong>?
          </p>

          <div className="vtool-stack" style={{ gap: 8, marginTop: 14 }}>
            {quizOptions.map((opt, i) => {
              const isPicked = picked === i;
              const isCorrect = i === quizCorrect;
              const answered = picked !== null;
              // Tras responder: la correcta en accent; la elegida-incorrecta en primary.
              let borderColor = "var(--hairline)";
              let textColor = "var(--text-primary)";
              if (answered && isCorrect) {
                borderColor = "var(--accent)";
                textColor = "var(--accent)";
              } else if (answered && isPicked) {
                borderColor = "var(--primary)";
                textColor = "var(--primary)";
              }
              return (
                <button
                  key={`${opt}-${i}`}
                  type="button"
                  onClick={() => pick(i)}
                  disabled={answered}
                  aria-pressed={isPicked}
                  className="vtool-row"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 10,
                    width: "100%",
                    textAlign: "left",
                    cursor: answered ? "default" : "pointer",
                    padding: "10px 12px",
                    borderRadius: 8,
                    border: `1px solid ${borderColor}`,
                    background: "transparent",
                    color: textColor,
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  <span>{opt}</span>
                  {answered && isCorrect && (
                    <Badge variant="status">Sacrifica esto</Badge>
                  )}
                </button>
              );
            })}
          </div>

          {picked !== null && (
            <SubPanel style={{ marginTop: 14 }}>
              <span className="vtool-eyebrow">
                {picked === quizCorrect ? "¡Bien!" : "No — se sacrifica " + current.attrB}
              </span>
              <p
                className="v"
                style={{
                  textAlign: "left",
                  fontWeight: 400,
                  fontSize: 15,
                  lineHeight: 1.6,
                  color: "var(--text-primary)",
                  margin: "8px 0 0",
                }}
              >
                {current.resolution}
              </p>
              {current.wiki && (
                <div className="vtool-row" style={{ marginTop: 12 }}>
                  <Button variant="ghost" size="sm" href={`/inge2/${current.wiki}/`}>
                    Repasar en el wiki
                  </Button>
                </div>
              )}
              <div className="vtool-row" style={{ marginTop: 16 }}>
                <Button variant="primary" size="sm" onClick={advance}>
                  Siguiente
                </Button>
              </div>
            </SubPanel>
          )}
        </SubPanel>
      )}
    </Panel>
  );
}
