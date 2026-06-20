"use client";

/* ──────────────────────────────────────────────────────────────────────────
   Inge2 study toolkit — drill "problema → mecanismo" (§9 de la cheat-sheet).

   Entrena el mapeo (atributo de calidad + problema) → mecanismo arquitectónico
   correcto. Filtro opcional por atributo + drill de un ítem por vez con
   feedback inmediato (correcta en accent, elegida-incorrecta atenuada) y un
   caveat "cuándo NO / trampa".

   Persiste el historial por ítem bajo toolKey("mechanism") y publica su
   contribución por unidad al dashboard compartido vía publishContribution.
   Static-export safe: todo acceso a window/localStorage/Math.random vive en
   useEffect/handlers (mismo patrón de hidratación → persistencia que
   ReviewChecklist / QuizBank).
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useMemo, useState } from "react";
import { Panel, SubPanel, Note, Chip, Button, Badge, BigNum } from "@studyvaults/ui";

import type { MechanismItem, UnitId } from "./types";
import { MECHANISMS } from "./data/mechanisms";
import {
  publishContribution,
  toolKey,
  loadJSON,
  saveJSON,
  clamp01,
  type Contribution,
} from "./progress";

/* ──────────────────────────────── tipos ───────────────────────────────── */

/** Historial persistido por ítem. */
interface MStat {
  seen: number;
  correct: number;
}
type History = Record<string, MStat>;

const HISTORY_KEY = toolKey("mechanism");

/** Sentinela del filtro "Todos los atributos". */
const ALL = "__all__";

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

/**
 * Construye el mapa de contribución por unidad a partir del historial.
 * Para cada unidad cubierta por MECHANISMS:
 *   total   = ítems de esa unidad en MECHANISMS
 *   seen    = ítems distintos respondidos ≥ 1 vez
 *   mastery = Σ correct / Σ seen sobre los ítems de esa unidad (clamp01)
 */
function contributionFrom(history: History): Partial<Record<UnitId, Contribution>> {
  // acumuladores crudos por unidad
  interface Acc {
    total: number;
    seen: number;
    sumCorrect: number;
    sumSeen: number;
  }
  const acc = new Map<UnitId, Acc>();
  const get = (u: UnitId): Acc => {
    let a = acc.get(u);
    if (!a) {
      a = { total: 0, seen: 0, sumCorrect: 0, sumSeen: 0 };
      acc.set(u, a);
    }
    return a;
  };

  for (const m of MECHANISMS) {
    const a = get(m.unit);
    a.total += 1;
    const stat = history[m.id];
    if (stat && stat.seen > 0) {
      a.seen += 1;
      a.sumCorrect += stat.correct;
      a.sumSeen += stat.seen;
    }
  }

  const byUnit: Partial<Record<UnitId, Contribution>> = {};
  for (const [u, a] of acc) {
    byUnit[u] = {
      total: a.total,
      seen: a.seen,
      mastery: clamp01(a.sumSeen > 0 ? a.sumCorrect / a.sumSeen : 0),
    };
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

/* ════════════════════════════ MechanismPicker ══════════════════════════════ */

export default function MechanismPicker() {
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
    publishContribution("mechanism", contributionFrom(history));
  }, [history, hydrated]);

  /* ---- filtro por atributo ---- */
  const [attr, setAttr] = useState<string>(ALL);

  /** Atributos distintos presentes + su contador, en orden de aparición. */
  const attributes = useMemo(() => {
    const counts = new Map<string, number>();
    for (const m of MECHANISMS) counts.set(m.attribute, (counts.get(m.attribute) ?? 0) + 1);
    return [...counts.entries()].map(([name, count]) => ({ name, count }));
  }, []);

  /** Ítems que matchean el filtro actual. */
  const matching = useMemo(
    () => (attr === ALL ? MECHANISMS : MECHANISMS.filter((m) => m.attribute === attr)),
    [attr],
  );

  /* ---- estado del drill ---- */
  const [order, setOrder] = useState<MechanismItem[]>([]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correctRun, setCorrectRun] = useState(0);
  const [done, setDone] = useState(false);

  /** (Re)inicia el drill barajando el pool actual. Sólo en handlers/effects. */
  const startSet = (pool: MechanismItem[]) => {
    setOrder(shuffle(pool));
    setIdx(0);
    setPicked(null);
    setCorrectRun(0);
    setDone(false);
  };

  /* Barajar al hidratar y cada vez que cambia el filtro (en effect → safe). */
  useEffect(() => {
    if (!hydrated) return;
    startSet(matching);
  }, [hydrated, attr]); // eslint-disable-line react-hooks/exhaustive-deps

  const current = order[idx];
  const total = order.length;
  const answered = idx + (picked != null ? 1 : 0);

  /* ---- responder / avanzar ---- */
  const handlePick = (i: number) => {
    if (picked != null || !current) return; // ya respondido o sin ítem
    const ok = i === current.correct;
    setPicked(i);
    if (ok) setCorrectRun((n) => n + 1);
    setHistory((prev) => {
      const cur = prev[current.id] ?? { seen: 0, correct: 0 };
      return {
        ...prev,
        [current.id]: { seen: cur.seen + 1, correct: cur.correct + (ok ? 1 : 0) },
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
      "¿Reiniciar el progreso de este drill? Se borra tu historial de mecanismos (no afecta otras herramientas).",
    );
    if (!ok) return;
    setHistory({});
    startSet(matching);
  };

  const pickAttr = (name: string) => setAttr(name);

  /* ══════════════════════════ render ══════════════════════════ */
  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Drill de parcial</span>
        <h3>¿Qué mecanismo?</h3>
        <p>
          Dado un atributo de calidad y un problema, elegí el mecanismo arquitectónico que lo
          resuelve. Feedback inmediato con el caveat "cuándo NO" de cada decisión. Tu historial
          se guarda en el navegador y alimenta el plan de recu.{" "}
          {!hydrated && "Cargando tu progreso…"}
        </p>
      </div>

      {MECHANISMS.length === 0 ? (
        <Note>
          Todavía no hay ítems cargados en este drill. Volvé cuando el banco de mecanismos esté
          disponible.
        </Note>
      ) : (
        <div className="vtool-stack">
          {/* Filtro por atributo */}
          <div className="vtool-field">
            <span className="vtool-label">
              <span>Atributo de calidad</span>
            </span>
            <div className="vtool-row">
              <Chip active={attr === ALL} onClick={() => pickAttr(ALL)}>
                Todos · {MECHANISMS.length}
              </Chip>
              {attributes.map((a) => (
                <Chip key={a.name} active={attr === a.name} onClick={() => pickAttr(a.name)}>
                  {a.name} · {a.count}
                </Chip>
              ))}
            </div>
          </div>

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
              <Button variant="ghost" size="sm" onClick={handleResetProgress}>
                Reiniciar progreso
              </Button>
            </div>
          </SubPanel>

          {/* Drill activo */}
          {!done && current && (
            <SubPanel>
              <div className="vtool-row" style={{ gap: 8, marginBottom: 10 }}>
                <Badge>{current.attribute}</Badge>
              </div>

              <p
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 17,
                  lineHeight: 1.45,
                  color: "var(--ink-strong)",
                  margin: "0 0 6px",
                }}
              >
                {current.problem}
              </p>
              <Note style={{ marginTop: 0, marginBottom: 12 }}>
                ¿Qué mecanismo resuelve esto?
              </Note>

              <div className="vtool-stack" style={{ gap: 8 }} role="group" aria-label="Opciones">
                {current.options.map((opt, i) => {
                  const isCorrect = i === current.correct;
                  const isPicked = i === picked;
                  const revealed = picked != null;

                  // colores de feedback tras responder
                  let color = "var(--text-primary)";
                  let weight: number | undefined;
                  let strike = false;
                  let border = "1px solid var(--hairline)";
                  let background = "transparent";
                  if (revealed) {
                    if (isCorrect) {
                      color = "var(--accent)";
                      weight = 600;
                      border = "1px solid var(--accent)";
                      background = "color-mix(in srgb, var(--accent) 10%, transparent)";
                    } else if (isPicked) {
                      color = "var(--text-secondary)";
                      strike = true;
                    }
                  }

                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handlePick(i)}
                      disabled={revealed}
                      aria-pressed={revealed ? isPicked : undefined}
                      autoFocus={!revealed && i === 0}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        cursor: revealed ? "default" : "pointer",
                        padding: "10px 12px",
                        borderRadius: 8,
                        border,
                        background,
                        color,
                        fontWeight: weight,
                        fontSize: 14,
                        lineHeight: 1.5,
                        textDecoration: strike ? "line-through" : "none",
                        fontFamily: "inherit",
                      }}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {picked != null && (
                <>
                  <SubPanel style={{ marginTop: 14 }}>
                    <span className="vtool-eyebrow">
                      {picked === current.correct ? "Correcto" : "Incorrecto"}
                    </span>
                    <Note style={{ marginTop: 6 }}>
                      <strong style={{ color: "var(--ink-strong)" }}>Cuándo NO / trampa:</strong>{" "}
                      {current.caveat}
                    </Note>
                    {current.wiki && (
                      <div className="vtool-row" style={{ marginTop: 10 }}>
                        <Button variant="ghost" size="sm" href={`/inge2/${current.wiki}/`}>
                          Repasar
                        </Button>
                      </div>
                    )}
                  </SubPanel>
                  <div className="vtool-row" style={{ marginTop: 14 }}>
                    <Button variant="primary" size="sm" onClick={handleNext}>
                      {idx + 1 >= total ? "Ver resultado" : "Siguiente"}
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
              <div className="vtool-row" style={{ gap: 10, marginTop: 14 }}>
                <Button variant="primary" size="sm" onClick={() => startSet(order)}>
                  Repetir
                </Button>
                <Button variant="secondary" size="sm" onClick={() => startSet(matching)}>
                  Mezclar de nuevo
                </Button>
              </div>
            </SubPanel>
          )}
        </div>
      )}
    </Panel>
  );
}
