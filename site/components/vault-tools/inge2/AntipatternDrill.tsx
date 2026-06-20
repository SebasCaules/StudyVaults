"use client";

/* ──────────────────────────────────────────────────────────────────────────
   Inge2 study toolkit — anti-patrones "2 automático" (§11 de la cheat-sheet).

   Dos modos:
     • "Spotter" (default): drill de frases-decisión barajadas. Por cada frase
       el alumno juzga si es un anti-patrón de parcial o una decisión válida;
       al responder se revela el anti-patrón dueño (name/why/fix) o se confirma
       la decisión. Persiste seen/correct por frase y publica su contribución a
       la unidad "metodo-parcial".
     • "Catálogo": referencia — todos los ANTIPATTERNS como SubPanels con why y
       la corrección, con deep-link al wiki para repasar.

   Persiste el historial por frase (clave "<id>#<índice>") bajo
   toolKey("antipattern"). Static-export safe: todo acceso a
   window/localStorage/Math.random vive en useEffect/handlers (mismo patrón de
   hidratación → persistencia que ReviewChecklist / MechanismPicker).
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useMemo, useState } from "react";
import { Panel, SubPanel, Note, Chip, Button, Badge, BigNum } from "@studyvaults/ui";

import { ANTIPATTERNS } from "./data/antipatterns";
import {
  publishContribution,
  toolKey,
  loadJSON,
  saveJSON,
  clamp01,
  type Contribution,
} from "./progress";

/* ──────────────────────────────── tipos ───────────────────────────────── */

/** Historial persistido por frase de spot. */
interface SpotStat {
  seen: number;
  correct: number;
}
type History = Record<string, SpotStat>;

/**
 * Frase de spot aplanada: el texto a juzgar + el anti-patrón dueño (para el
 * reveal) + una clave estable independiente del barajado.
 */
interface FlatSpot {
  /** Clave estable: "<antipatternId>#<índiceDeFrase>". */
  key: string;
  text: string;
  isAntipattern: boolean;
  ownerId: string;
  name: string;
  why: string;
  fix: string;
  wiki?: string;
}

const HISTORY_KEY = toolKey("antipattern");

/* ──────────────────────────────── utils ───────────────────────────────── */

/** Fisher-Yates — barajado de una COPIA (sólo en handlers/effects). */
function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Aplana todas las frases `spot` de todos los anti-patrones (orden estable). */
function flattenSpots(): FlatSpot[] {
  const out: FlatSpot[] = [];
  for (const ap of ANTIPATTERNS) {
    ap.spot.forEach((s, i) => {
      out.push({
        key: `${ap.id}#${i}`,
        text: s.text,
        isAntipattern: s.isAntipattern,
        ownerId: ap.id,
        name: ap.name,
        why: ap.why,
        fix: ap.fix,
        wiki: ap.wiki,
      });
    });
  }
  return out;
}

/**
 * Construye la contribución a la unidad "metodo-parcial" desde el historial.
 *   total   = nº total de frases spot en ANTIPATTERNS
 *   seen    = frases respondidas ≥ 1 vez
 *   mastery = Σ correct / Σ seen sobre las frases (clamp01)
 */
function contributionFrom(
  history: History,
  total: number,
): Partial<Record<"metodo-parcial", Contribution>> {
  let seen = 0;
  let sumCorrect = 0;
  let sumSeen = 0;
  for (const stat of Object.values(history)) {
    if (stat.seen > 0) {
      seen += 1;
      sumCorrect += stat.correct;
      sumSeen += stat.seen;
    }
  }
  return {
    "metodo-parcial": {
      total,
      seen,
      mastery: clamp01(sumSeen > 0 ? sumCorrect / sumSeen : 0),
    },
  };
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

/* ════════════════════════════ AntipatternDrill ═════════════════════════════ */

type Mode = "spotter" | "catalog";

export default function AntipatternDrill() {
  /* Universo de frases (estable, derivado de los datos). */
  const allSpots = useMemo(() => flattenSpots(), []);
  const totalSpots = allSpots.length;

  /* ---- historial persistente (hidratación → persistencia) ---- */
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
    publishContribution("antipattern", contributionFrom(history, totalSpots));
  }, [history, hydrated, totalSpots]);

  /* ---- modo ---- */
  const [mode, setMode] = useState<Mode>("spotter");

  /* ---- estado del drill spotter ---- */
  const [order, setOrder] = useState<FlatSpot[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<boolean | null>(null); // lo elegido: ¿dijo "anti-patrón"?
  const [correctRun, setCorrectRun] = useState(0);
  const [done, setDone] = useState(false);

  /** (Re)inicia el drill barajando el universo. Sólo en handlers/effects. */
  const startSet = () => {
    setOrder(shuffle(allSpots));
    setIdx(0);
    setPicked(null);
    setCorrectRun(0);
    setDone(false);
  };

  /* Barajar al hidratar (en effect → safe). */
  useEffect(() => {
    if (!hydrated) return;
    startSet();
  }, [hydrated]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = order[idx];
  const total = order.length;
  const answered = idx + (picked != null ? 1 : 0);

  /* ---- responder / avanzar ---- */
  const handleAnswer = (saidAntipattern: boolean) => {
    if (picked != null || !current) return; // ya respondido o sin ítem
    const ok = saidAntipattern === current.isAntipattern;
    setPicked(saidAntipattern);
    if (ok) setCorrectRun((n) => n + 1);
    setHistory((prev) => {
      const cur = prev[current.key] ?? { seen: 0, correct: 0 };
      return {
        ...prev,
        [current.key]: { seen: cur.seen + 1, correct: cur.correct + (ok ? 1 : 0) },
      };
    });
  };

  const handleNext = () => {
    if (idx + 1 >= total) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  };

  /* ---- reset del progreso de ESTE drill ---- */
  const handleResetProgress = () => {
    if (typeof window === "undefined") return;
    const ok = window.confirm(
      "¿Reiniciar el progreso de este drill? Se borra tu historial de anti-patrones (no afecta otras herramientas).",
    );
    if (!ok) return;
    setHistory({});
    startSet();
  };

  /* ══════════════════════════ render ══════════════════════════ */
  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">2 automático</span>
        <h3>Anti-patrones del parcial</h3>
        <p>
          Las decisiones que descalifican una respuesta de entrada. Entrená el ojo en modo
          spotter (¿anti-patrón o decisión válida?) o repasá el catálogo con la corrección de
          cada una. Tu historial se guarda en el navegador y alimenta el plan de recu.{" "}
          {!hydrated && "Cargando tu progreso…"}
        </p>
      </div>

      {ANTIPATTERNS.length === 0 ? (
        <Note>
          Todavía no hay anti-patrones cargados. Volvé cuando el catálogo esté disponible.
        </Note>
      ) : (
        <div className="vtool-stack">
          {/* Conmutador de modo */}
          <div className="vtool-field">
            <span className="vtool-label">
              <span>Modo</span>
            </span>
            <div className="vtool-row">
              <Chip active={mode === "spotter"} onClick={() => setMode("spotter")}>
                Spotter · {totalSpots}
              </Chip>
              <Chip active={mode === "catalog"} onClick={() => setMode("catalog")}>
                Catálogo · {ANTIPATTERNS.length}
              </Chip>
            </div>
          </div>

          {mode === "spotter" ? (
            <SpotterMode
              current={current}
              total={total}
              answered={answered}
              picked={picked}
              correctRun={correctRun}
              done={done}
              isLast={idx + 1 >= total}
              onAnswer={handleAnswer}
              onNext={handleNext}
              onShuffle={startSet}
              onResetProgress={handleResetProgress}
            />
          ) : (
            <CatalogMode />
          )}
        </div>
      )}
    </Panel>
  );
}

/* ──────────────────────────── modo Spotter ─────────────────────────────── */

interface SpotterModeProps {
  current: FlatSpot | undefined;
  total: number;
  answered: number;
  picked: boolean | null;
  correctRun: number;
  done: boolean;
  isLast: boolean;
  onAnswer: (saidAntipattern: boolean) => void;
  onNext: () => void;
  onShuffle: () => void;
  onResetProgress: () => void;
}

function SpotterMode({
  current,
  total,
  answered,
  picked,
  correctRun,
  done,
  isLast,
  onAnswer,
  onNext,
  onShuffle,
  onResetProgress,
}: SpotterModeProps) {
  const ok = current != null && picked != null && picked === current.isAntipattern;

  return (
    <>
      {/* Barra superior: progreso del set + aciertos */}
      <SubPanel>
        <div
          className="vtool-row"
          style={{ justifyContent: "space-between", alignItems: "baseline" }}
        >
          <span className="vtool-mono">
            {done ? total : Math.min(answered + (picked == null ? 1 : 0), total)} / {total}
          </span>
          <span className="vtool-mono">
            Aciertos: {correctRun}/{answered}
          </span>
        </div>
        <ProgressBar pct={total ? Math.round((answered / total) * 100) : 0} />
        <div className="vtool-row" style={{ marginTop: 12 }}>
          <Button variant="ghost" size="sm" onClick={onResetProgress}>
            Reiniciar progreso
          </Button>
        </div>
      </SubPanel>

      {/* Frase activa */}
      {!done && current && (
        <SubPanel>
          <p
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              lineHeight: 1.45,
              color: "var(--ink-strong)",
              margin: "0 0 6px",
            }}
          >
            {current.text}
          </p>
          <Note style={{ marginTop: 0, marginBottom: 12 }}>¿Es un anti-patrón de parcial?</Note>

          <div className="vtool-row" style={{ gap: 10 }} role="group" aria-label="Tu juicio">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAnswer(true)}
              disabled={picked != null}
            >
              ✗ Anti-patrón
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onAnswer(false)}
              disabled={picked != null}
            >
              ✓ Decisión válida
            </Button>
          </div>

          {picked != null && (
            <>
              <SubPanel style={{ marginTop: 14 }}>
                <span className="vtool-eyebrow">{ok ? "Correcto" : "Incorrecto"}</span>
                {current.isAntipattern ? (
                  <>
                    <p
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 15,
                        color: "var(--ink-strong)",
                        margin: "8px 0 6px",
                      }}
                    >
                      {current.name}{" "}
                      <Badge variant="solid">2 automático</Badge>
                    </p>
                    <Note style={{ marginTop: 6 }}>
                      <strong style={{ color: "var(--ink-strong)" }}>Por qué descalifica:</strong>{" "}
                      {current.why}
                    </Note>
                    <Note style={{ marginTop: 6 }}>
                      <strong style={{ color: "var(--ink-strong)" }}>Corrección:</strong>{" "}
                      {current.fix}
                    </Note>
                  </>
                ) : (
                  <Note style={{ marginTop: 6 }}>
                    Decisión válida — no descalifica. Es una elección legítima cuando el contexto
                    la justifica; bien argumentada, suma.
                  </Note>
                )}
                {current.wiki && (
                  <div className="vtool-row" style={{ marginTop: 10 }}>
                    <Button variant="ghost" size="sm" href={`/inge2/${current.wiki}/`}>
                      Repasar
                    </Button>
                  </div>
                )}
              </SubPanel>
              <div className="vtool-row" style={{ marginTop: 14 }}>
                <Button variant="primary" size="sm" onClick={onNext}>
                  {isLast ? "Ver resultado" : "Siguiente"}
                </Button>
              </div>
            </>
          )}
        </SubPanel>
      )}

      {/* Resumen al terminar el set */}
      {done && (
        <SubPanel>
          <div
            className="vtool-row"
            style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <div>
              <span className="vtool-eyebrow">Resultado del set</span>
              <span className="vtool-mono" style={{ display: "block", marginTop: 4 }}>
                {correctRun} / {total} correctas
              </span>
            </div>
            <BigNum value={`${total ? Math.round((correctRun / total) * 100) : 0}`} unit="%" />
          </div>
          <ProgressBar pct={total ? Math.round((correctRun / total) * 100) : 0} />
          <div className="vtool-row" style={{ marginTop: 14 }}>
            <Button variant="primary" size="sm" onClick={onShuffle}>
              Mezclar de nuevo
            </Button>
          </div>
        </SubPanel>
      )}
    </>
  );
}

/* ──────────────────────────── modo Catálogo ────────────────────────────── */

function CatalogMode() {
  return (
    <div className="vtool-stack">
      {ANTIPATTERNS.map((ap) => (
        <SubPanel key={ap.id}>
          <div
            className="vtool-row"
            style={{ justifyContent: "space-between", alignItems: "baseline", gap: 10 }}
          >
            <strong
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 16,
                color: "var(--ink-strong)",
              }}
            >
              {ap.name}
            </strong>
            <Badge variant="solid">2 automático</Badge>
          </div>
          <Note style={{ marginTop: 8 }}>
            <strong style={{ color: "var(--ink-strong)" }}>Por qué descalifica:</strong> {ap.why}
          </Note>
          <Note style={{ marginTop: 6 }}>
            <strong style={{ color: "var(--ink-strong)" }}>Corrección:</strong> {ap.fix}
          </Note>
          {ap.wiki && (
            <div className="vtool-row" style={{ marginTop: 10 }}>
              <Button variant="ghost" size="sm" href={`/inge2/${ap.wiki}/`}>
                Repasar
              </Button>
            </div>
          )}
        </SubPanel>
      ))}
    </div>
  );
}
