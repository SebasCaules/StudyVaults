"use client";

import { useEffect, useMemo, useState } from "react";
import { Html } from "./Html";
import { UNIT_NAMES, type QuizQ } from "./data";

/* ──────────────────────────────────────────────────────────────────────────
   Banco de práctica — quiz corregido al instante. Reúne en un solo motor las
   209 preguntas de la app "estudio interactivo" + las 202 del "quiz", para el
   2.º parcial (units 6-9 + integradoras).

   Tipos soportados: verdadero/falso, opción simple, multi-selección y
   "asociación" (revelado, sin corrección automática). Client-only: todo acceso
   a localStorage va detrás de useEffect / handlers (static-export safe).
   ────────────────────────────────────────────────────────────────────────── */

const KIND_LABEL: Record<QuizQ["kind"], string> = {
  vf: "Verdadero / Falso",
  single: "Opción múltiple",
  multi: "Multi-selección",
  reveal: "Asociación",
};

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const sameSet = (a: number[], b: number[]) =>
  a.length === b.length && a.every((x) => b.includes(x));

type Stats = Record<string, 0 | 1>;
interface Answer {
  picked: number[];
  checked: boolean;
  ok: boolean;
}

export default function PracticeBank({
  bank,
  storageKey,
  units,
}: {
  bank: QuizQ[];
  storageKey: string;
  units: number[];
}) {
  const [unit, setUnit] = useState<number | "all">("all");
  const [onlyReal, setOnlyReal] = useState(false);
  const hasReal = useMemo(() => bank.some((q) => q.real), [bank]);

  // Banco filtrado + orden barajado. Cualquier cambio de filtro reinicia.
  const pool = useMemo(
    () =>
      bank.filter(
        (q) => (unit === "all" || q.unit === unit) && (!onlyReal || q.real),
      ),
    [bank, unit, onlyReal],
  );

  const [order, setOrder] = useState<QuizQ[]>(() => pool);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [stats, setStats] = useState<Stats>({});

  // Reinicia el recorrido cuando cambia el filtro.
  useEffect(() => {
    setOrder(shuffle(pool));
    setIdx(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, onlyReal]);

  // Progreso persistido (aciertos por pregunta) para el panel por-unidad.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setStats(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  const persist = (next: Stats) => {
    setStats(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const q = order[idx];
  const ans = q ? answers[q.id] : undefined;

  const setPicked = (picked: number[]) => {
    if (!q || ans?.checked) return;
    setAnswers((s) => ({ ...s, [q.id]: { picked, checked: false, ok: false } }));
  };

  const togglePick = (i: number) => {
    if (!q || ans?.checked) return;
    if (q.kind === "multi") {
      const cur = ans?.picked ?? [];
      setPicked(cur.includes(i) ? cur.filter((x) => x !== i) : [...cur, i]);
    } else {
      setPicked([i]);
    }
  };

  const check = () => {
    if (!q) return;
    if (q.kind === "reveal") {
      setAnswers((s) => ({ ...s, [q.id]: { picked: [], checked: true, ok: true } }));
      return;
    }
    const picked = ans?.picked ?? [];
    if (!picked.length) return;
    let ok = false;
    if (q.kind === "multi") ok = sameSet(picked, q.correct as number[]);
    else ok = picked[0] === (q.correct as number);
    setAnswers((s) => ({ ...s, [q.id]: { picked, checked: true, ok } }));
    persist({ ...stats, [q.id]: ok ? 1 : 0 });
  };

  const go = (d: number) => setIdx((i) => Math.min(order.length - 1, Math.max(0, i + d)));

  const resetProgress = () => {
    setAnswers({});
    persist({});
    setOrder(shuffle(pool));
    setIdx(0);
  };

  // Marcador de la sesión actual.
  const session = order.reduce(
    (acc, qq) => {
      const a = answers[qq.id];
      if (a?.checked && qq.kind !== "reveal") {
        acc.done++;
        if (a.ok) acc.ok++;
      }
      return acc;
    },
    { done: 0, ok: 0 },
  );

  // Precisión histórica por unidad (de stats persistidas).
  const perUnit = units.map((u) => {
    const ids = bank.filter((x) => x.unit === u && x.kind !== "reveal").map((x) => x.id);
    const done = ids.filter((id) => id in stats);
    const ok = done.filter((id) => stats[id] === 1);
    return { unit: u, total: ids.length, done: done.length, ok: ok.length };
  });

  if (!q) {
    return (
      <div className="dvt">
        <p className="vtool__intro">No hay preguntas para este filtro.</p>
      </div>
    );
  }

  const optionState = (i: number): "idle" | "picked" | "ok" | "bad" | "miss" => {
    const picked = ans?.picked ?? [];
    if (!ans?.checked) return picked.includes(i) ? "picked" : "idle";
    const correct = q.kind === "multi" ? (q.correct as number[]) : [q.correct as number];
    if (correct.includes(i)) return picked.includes(i) ? "ok" : "miss";
    return picked.includes(i) ? "bad" : "idle";
  };

  return (
    <div className="dvt dq">
      {/* filtros */}
      <div className="dq__filters">
        <div className="dq__chips" role="group" aria-label="Filtrar por unidad">
          <button
            type="button"
            className={`dvt-chip${unit === "all" ? " is-active" : ""}`}
            onClick={() => setUnit("all")}
          >
            Todas
          </button>
          {units.map((u) => (
            <button
              key={u}
              type="button"
              className={`dvt-chip${unit === u ? " is-active" : ""}`}
              onClick={() => setUnit(u)}
              title={UNIT_NAMES[u]}
            >
              {u === 0 ? "Mix" : `U${u}`}
            </button>
          ))}
        </div>
        {hasReal && (
          <button
            type="button"
            className={`dvt-chip dvt-chip--accent${onlyReal ? " is-active" : ""}`}
            onClick={() => setOnlyReal((v) => !v)}
            title="Sólo preguntas tomadas de parciales reales"
          >
            ★ Sólo reales
          </button>
        )}
        <span className="dq__score" aria-live="polite">
          {session.ok}/{session.done} en esta sesión
        </span>
      </div>

      {/* tarjeta de pregunta */}
      <article className="dvt-panel dq__card">
        <header className="dq__head">
          <span className="dvt-tag">{q.unit === 0 ? "Integradora" : `Unidad ${q.unit}`}</span>
          <span className="dvt-tag dvt-tag--muted">{KIND_LABEL[q.kind]}</span>
          {q.real && <span className="dvt-tag dvt-tag--accent">parcial real</span>}
          {q.trap && <span className="dvt-tag dvt-tag--warn">trampa</span>}
          <span className="dq__count">
            {idx + 1} / {order.length}
          </span>
        </header>

        <Html className="dq__q" html={q.q} />

        {q.kind === "reveal" ? (
          <ol className="dq__assoc">
            {q.opts.map((o, i) => (
              <li key={i}>{o}</li>
            ))}
          </ol>
        ) : (
          <ul className="dq__opts">
            {q.opts.map((o, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={`dq__opt dq__opt--${optionState(i)}`}
                  onClick={() => togglePick(i)}
                  disabled={ans?.checked}
                >
                  <span className="dq__opt-mark" aria-hidden="true">
                    {q.kind === "multi" ? "▢" : String.fromCharCode(65 + i)}
                  </span>
                  <span>{o}</span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {ans?.checked && (
          <div className={`dq__expl${ans.ok ? " is-ok" : " is-bad"}`}>
            <span className="dq__verdict">
              {q.kind === "reveal" ? "Respuesta" : ans.ok ? "✓ Correcto" : "✗ Incorrecto"}
            </span>
            {q.kind === "reveal" && q.reveal && (
              <ul className="dq__assoc-ans">
                {q.reveal.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            )}
            <Html className="dq__expl-text" html={q.expl} />
            {q.cite && <span className="dq__cite">{q.cite}</span>}
          </div>
        )}

        <footer className="dq__nav">
          <button
            type="button"
            className="dvt-btn"
            onClick={() => go(-1)}
            disabled={idx === 0}
          >
            ← Anterior
          </button>
          {!ans?.checked ? (
            <button
              type="button"
              className="dvt-btn dvt-btn--primary"
              onClick={check}
              disabled={q.kind !== "reveal" && !(ans?.picked?.length)}
            >
              {q.kind === "reveal" ? "Ver respuesta" : "Comprobar"}
            </button>
          ) : (
            <button
              type="button"
              className="dvt-btn dvt-btn--primary"
              onClick={() => go(1)}
              disabled={idx === order.length - 1}
            >
              Siguiente →
            </button>
          )}
          <button
            type="button"
            className="dvt-btn"
            onClick={() => go(1)}
            disabled={idx === order.length - 1}
          >
            Saltar
          </button>
        </footer>
      </article>

      {/* progreso por unidad */}
      <div className="dvt-sub dq__progress">
        <div className="dq__progress-head">
          <span>Tu progreso por unidad</span>
          <button type="button" className="dvt-link" onClick={resetProgress}>
            Reiniciar
          </button>
        </div>
        <div className="dq__bars">
          {perUnit.map((p) => {
            const acc = p.done ? Math.round((p.ok / p.done) * 100) : 0;
            return (
              <div key={p.unit} className="dq__bar">
                <span className="dq__bar-label">{p.unit === 0 ? "Mix" : `U${p.unit}`}</span>
                <span className="dq__bar-track">
                  <span
                    className="dq__bar-fill"
                    style={{ width: `${p.done ? Math.max(4, (p.done / p.total) * 100) : 0}%` }}
                  />
                </span>
                <span className="dq__bar-num">
                  {p.done ? `${acc}% · ${p.done}/${p.total}` : `0/${p.total}`}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
