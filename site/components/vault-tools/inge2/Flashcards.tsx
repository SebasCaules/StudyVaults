"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Panel, SubPanel, Note, Chip, Button } from "@studyvaults/ui";
import type { UnitId } from "./types";
import { FLASHCARDS } from "./data/flashcards";
import { UNIT_LIST } from "./data/units";
import {
  publishContribution,
  toolKey,
  loadJSON,
  saveJSON,
  clamp01,
} from "./progress";

/* ──────────────────────────────────────────────────────────────────────────
   Ingeniería del Software II — Flashcards (recuerdo activo · Leitner / SRS).

   Repetición espaciada con cajas de Leitner: cada card vive en una caja 1..5.
   Calificar "Bien" la sube de caja (intervalo más largo); "Otra vez" la manda
   a la caja 1; "Fácil" salta dos cajas. El `due` se recalcula al graduar.

   Static-export safe: el estado persistido (cajas/due/reviews) arranca vacío
   en SSR y se hidrata en un useEffect de montaje; Date.now() sólo se evalúa en
   handlers/effects (nunca en render directo). Patrón calcado de ReviewChecklist
   en Inge2Tools.tsx (hydrated → load → persist).
   ────────────────────────────────────────────────────────────────────────── */

/* ───────────────────────── Modelo de scheduling ────────────────────────── */

const MAX_BOX = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

/** Intervalo (ms) hasta el próximo repaso según la caja destino. */
const BOX_INTERVAL_MS: Record<number, number> = {
  1: 0, // ya — vuelve al pozo de vencidas
  2: 1 * DAY_MS,
  3: 3 * DAY_MS,
  4: 7 * DAY_MS,
  5: 16 * DAY_MS,
};

/** Estado persistido por card. */
interface CardState {
  box: number; // 1..MAX_BOX
  due: number; // timestamp ms; <= now ⇒ vencida
  reviews: number;
}

type StateMap = Record<string, CardState>;

const DEFAULT_STATE: CardState = { box: 1, due: 0, reviews: 0 };
const STORAGE_KEY = toolKey("flashcards");

function stateFor(map: StateMap, id: string): CardState {
  return map[id] ?? DEFAULT_STATE;
}

/** Dominio de una card: cuán arriba en las cajas está (0..1). */
function cardMastery(s: CardState): number {
  return clamp01((s.box - 1) / (MAX_BOX - 1));
}

/* ─────────────────────────── ProgressBar local ─────────────────────────── */
/* Clon del de Inge2Tools.tsx (mismo lenguaje visual). */
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
  const byUnit: Partial<
    Record<UnitId, { mastery: number; seen: number; total: number }>
  > = {};
  // Acumuladores por unidad.
  const acc: Partial<Record<UnitId, { total: number; seen: number; sum: number }>> =
    {};
  for (const card of FLASHCARDS) {
    const a = acc[card.unit] ?? { total: 0, seen: 0, sum: 0 };
    const s = stateFor(map, card.id);
    a.total += 1;
    if (s.reviews > 0) a.seen += 1;
    a.sum += cardMastery(s);
    acc[card.unit] = a;
  }
  for (const unit of Object.keys(acc) as UnitId[]) {
    const a = acc[unit]!;
    byUnit[unit] = {
      total: a.total,
      seen: a.seen,
      mastery: a.total ? clamp01(a.sum / a.total) : 0,
    };
  }
  return byUnit;
}

/* ──────────────────────────────── Componente ───────────────────────────── */

type UnitFilter = UnitId | "all";

export default function Flashcards() {
  const [state, setState] = useState<StateMap>({});
  const [hydrated, setHydrated] = useState(false);

  // `now` se siembra en montaje (NO en render directo) para decidir vencidas.
  const [now, setNow] = useState(0);

  const [unitFilter, setUnitFilter] = useState<UnitFilter>("all");
  const [onlyDue, setOnlyDue] = useState(true);
  const [revealed, setRevealed] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  /* ── Hidratación: cargar estado persistido + sembrar `now` (client only). ── */
  useEffect(() => {
    setState(loadJSON<StateMap>(STORAGE_KEY, {}));
    setNow(Date.now());
    setHydrated(true);
  }, []);

  /* ── Persistir + publicar progreso tras cada cambio (post-hidratación). ── */
  useEffect(() => {
    if (!hydrated) return;
    saveJSON(STORAGE_KEY, state);
    publishContribution("flashcards", buildContribution(state));
  }, [state, hydrated]);

  /* ── Conteos por unidad (estables: dependen sólo del corpus). ── */
  const unitCounts = useMemo(() => {
    const counts: Partial<Record<UnitId, number>> = {};
    for (const card of FLASHCARDS) {
      counts[card.unit] = (counts[card.unit] ?? 0) + 1;
    }
    return counts;
  }, []);

  const unitsWithCards = useMemo(
    () => UNIT_LIST.filter((u) => (unitCounts[u.id] ?? 0) > 0),
    [unitCounts],
  );

  /* ── Resumen del mazo (depende de `state` + `now`). ── */
  const summary = useMemo(() => {
    let due = 0;
    let mature = 0;
    for (const card of FLASHCARDS) {
      const s = stateFor(state, card.id);
      if (s.due <= now) due += 1;
      if (s.box >= 4) mature += 1;
    }
    return { total: FLASHCARDS.length, due, mature };
  }, [state, now]);

  /* ── Dominio por unidad para las mini-barras. ── */
  const unitMastery = useMemo(() => {
    const out: Partial<Record<UnitId, number>> = {};
    const acc: Partial<Record<UnitId, { sum: number; total: number }>> = {};
    for (const card of FLASHCARDS) {
      const a = acc[card.unit] ?? { sum: 0, total: 0 };
      a.sum += cardMastery(stateFor(state, card.id));
      a.total += 1;
      acc[card.unit] = a;
    }
    for (const unit of Object.keys(acc) as UnitId[]) {
      const a = acc[unit]!;
      out[unit] = a.total ? a.sum / a.total : 0;
    }
    return out;
  }, [state]);

  /* ── Set filtrado + ordenado (vencidas primero, luego box ascendente). ── */
  const queue = useMemo(() => {
    const filtered = FLASHCARDS.filter((card) => {
      if (unitFilter !== "all" && card.unit !== unitFilter) return false;
      if (onlyDue && stateFor(state, card.id).due > now) return false;
      return true;
    });
    return filtered.sort((a, b) => {
      const sa = stateFor(state, a.id);
      const sb = stateFor(state, b.id);
      const dueA = sa.due <= now ? 0 : 1;
      const dueB = sb.due <= now ? 0 : 1;
      if (dueA !== dueB) return dueA - dueB; // vencidas primero
      return sa.box - sb.box; // luego por caja ascendente
    });
  }, [state, now, unitFilter, onlyDue]);

  const current = queue[0];

  // Al cambiar de card (o filtro), ocultar el reverso de nuevo.
  useEffect(() => {
    setRevealed(false);
  }, [current?.id]);

  /* ── Calificar: recoloca caja, recalcula due, persiste, avanza. ── */
  function grade(kind: "again" | "good" | "easy") {
    if (!current) return;
    const ts = Date.now();
    setNow(ts);
    setState((prev) => {
      const s = stateFor(prev, current.id);
      let box: number;
      if (kind === "again") box = 1;
      else if (kind === "good") box = Math.min(MAX_BOX, s.box + 1);
      else box = Math.min(MAX_BOX, s.box + 2);
      const due = ts + (BOX_INTERVAL_MS[box] ?? 0);
      return {
        ...prev,
        [current.id]: { box, due, reviews: s.reviews + 1 },
      };
    });
    setRevealed(false);
  }

  function reveal() {
    setRevealed(true);
  }

  function resetDeck() {
    if (typeof window === "undefined") return;
    const ok = window.confirm(
      "¿Reiniciar el mazo de flashcards? Se borra el progreso de cajas y repasos (sólo de flashcards).",
    );
    if (!ok) return;
    setNow(Date.now());
    setState({});
    setRevealed(false);
  }

  /* ── Atajos de teclado sobre la card activa. ── */
  useEffect(() => {
    if (!current) return;
    function onKey(e: KeyboardEvent) {
      // No secuestrar tipeo en inputs.
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (!revealed) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          reveal();
        }
        return;
      }
      if (e.key === "1") {
        e.preventDefault();
        grade("again");
      } else if (e.key === "2") {
        e.preventDefault();
        grade("good");
      } else if (e.key === "3") {
        e.preventDefault();
        grade("easy");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, revealed]);

  const curState = current ? stateFor(state, current.id) : null;

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Recuerdo activo</span>
        <h3>Flashcards</h3>
        <p>
          Repetición espaciada con cajas de Leitner: repasá una card por vez,
          revelá la respuesta y calificá tu recuerdo. El progreso se guarda en tu
          navegador. {!hydrated && "Cargando tu estado guardado…"}
        </p>
      </div>

      {/* ── Resumen del mazo ── */}
      <SubPanel style={{ marginBottom: 16 }}>
        <div
          className="vtool-row"
          style={{ justifyContent: "space-between", alignItems: "baseline" }}
        >
          <strong style={{ color: "var(--ink-strong)" }}>Estado del mazo</strong>
          <span className="vtool-mono">
            {summary.total} cards · {summary.due} vencidas · {summary.mature} maduras
          </span>
        </div>

        <div className="vtool-stack" style={{ gap: 8, marginTop: 12 }}>
          {unitsWithCards.map((u) => {
            const pct = Math.round((unitMastery[u.id] ?? 0) * 100);
            return (
              <div key={u.id} className="vtool-field" style={{ gap: 2 }}>
                <div
                  className="vtool-row"
                  style={{
                    justifyContent: "space-between",
                    alignItems: "baseline",
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--text-primary)" }}>
                    {u.label}
                  </span>
                  <span className="vtool-mono" style={{ fontSize: 12 }}>
                    {pct}%
                  </span>
                </div>
                <ProgressBar pct={pct} />
              </div>
            );
          })}
        </div>

        <div className="vtool-row" style={{ marginTop: 12 }}>
          <Button variant="ghost" size="sm" onClick={resetDeck}>
            Reiniciar mazo
          </Button>
        </div>
      </SubPanel>

      {/* ── Filtros ── */}
      <div className="vtool-stack" style={{ marginBottom: 16 }}>
        <div className="vtool-field">
          <label className="vtool-label">
            <b>Filtrar por unidad</b>
          </label>
          <div className="vtool-row">
            <Chip
              active={unitFilter === "all"}
              onClick={() => setUnitFilter("all")}
              aria-label={`Todas las unidades, ${FLASHCARDS.length} cards`}
            >
              Todas · {FLASHCARDS.length}
            </Chip>
            {unitsWithCards.map((u) => (
              <Chip
                key={u.id}
                active={unitFilter === u.id}
                onClick={() => setUnitFilter(u.id)}
                aria-label={`${u.label}, ${unitCounts[u.id] ?? 0} cards`}
              >
                {u.label} · {unitCounts[u.id] ?? 0}
              </Chip>
            ))}
          </div>
        </div>

        <div className="vtool-row" style={{ alignItems: "center", gap: 10 }}>
          <Chip
            active={onlyDue}
            onClick={() => setOnlyDue((v) => !v)}
            aria-pressed={onlyDue}
          >
            Solo vencidas
          </Chip>
          <Note style={{ margin: 0 }}>
            {onlyDue
              ? "Mostrando sólo las cards que tocan repasar hoy."
              : "Mostrando todas las cards del filtro, vencidas o no."}
          </Note>
        </div>
      </div>

      {/* ── Sesión de estudio ── */}
      {!current ? (
        <SubPanel>
          <strong
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 16,
              color: "var(--ink-strong)",
            }}
          >
            ¡Mazo al día!
          </strong>
          <Note style={{ marginTop: 6 }}>
            {onlyDue
              ? "No quedan cards vencidas en este filtro. Volvé más tarde o desactivá “Solo vencidas” para repasar igual."
              : "No hay cards en este filtro. Probá con otra unidad o con “Todas”."}
          </Note>
        </SubPanel>
      ) : (
        <SubPanel>
          <div
            ref={cardRef}
            tabIndex={0}
            aria-label="Card de estudio. Espacio o Enter revela la respuesta."
            style={{ outline: "none" }}
          >
            <div
              className="vtool-row"
              style={{ justifyContent: "space-between", alignItems: "baseline" }}
            >
              <span className="vtool-eyebrow">
                {queue.length} {queue.length === 1 ? "card" : "cards"} en cola
              </span>
              <span className="vtool-mono" style={{ fontSize: 12 }}>
                caja {curState?.box ?? 1}/{MAX_BOX} · {curState?.reviews ?? 0} repasos
              </span>
            </div>

            {/* Anverso */}
            <p
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                lineHeight: 1.5,
                color: "var(--ink-strong)",
                margin: "12px 0 0",
              }}
            >
              {current.front}
            </p>

            {current.tags && current.tags.length > 0 && (
              <div className="vtool-row" style={{ gap: 6, marginTop: 10 }}>
                {current.tags.map((t) => (
                  <span
                    key={t}
                    className="vtool-mono"
                    style={{ fontSize: 11, color: "var(--text-secondary)" }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}

            {/* Reverso (revelado) */}
            {revealed ? (
              <SubPanel style={{ marginTop: 14 }}>
                <span className="vtool-eyebrow">Respuesta</span>
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
                  {current.back}
                </p>
                {current.wiki && (
                  <div className="vtool-row" style={{ marginTop: 12 }}>
                    <Button
                      variant="ghost"
                      size="sm"
                      href={`/inge2/${current.wiki}/`}
                    >
                      Repasar en el wiki
                    </Button>
                  </div>
                )}
              </SubPanel>
            ) : (
              <div className="vtool-row" style={{ marginTop: 16 }}>
                <Button variant="primary" size="sm" onClick={reveal}>
                  Mostrar respuesta
                </Button>
                <Note style={{ margin: 0 }}>
                  Atajo: Espacio o Enter.
                </Note>
              </div>
            )}

            {/* Calificación */}
            {revealed && (
              <div className="vtool-stack" style={{ gap: 8, marginTop: 16 }}>
                <div className="vtool-row">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => grade("again")}
                    aria-label="Otra vez — vuelve a la caja 1 (tecla 1)"
                  >
                    Otra vez
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => grade("good")}
                    aria-label="Bien — sube una caja (tecla 2)"
                  >
                    Bien
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => grade("easy")}
                    aria-label="Fácil — sube dos cajas (tecla 3)"
                  >
                    Fácil
                  </Button>
                </div>
                <Note style={{ margin: 0 }}>
                  Atajos: 1 = Otra vez · 2 = Bien · 3 = Fácil.
                </Note>
              </div>
            )}
          </div>
        </SubPanel>
      )}
    </Panel>
  );
}
