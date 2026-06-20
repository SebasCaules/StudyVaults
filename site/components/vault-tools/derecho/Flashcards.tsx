"use client";

import { useEffect, useMemo, useState } from "react";
import { Html } from "./Html";
import { UNIT_NAMES, type Flashcard } from "./data";

/* ──────────────────────────────────────────────────────────────────────────
   Flashcards del 1.º parcial — las 70 preguntas tipo parcial de las sesiones de
   estudio (units 1-5 + integradoras). Modelo de revelado: el enunciado y, al
   pasar al dorso, la corrección autorizada (comentario del docente). Sirve para
   V/F, multiple choice, completar, desarrollo y casos por igual.
   ────────────────────────────────────────────────────────────────────────── */

const KIND_LABEL: Record<Flashcard["kind"], string> = {
  vf: "Verdadero / Falso",
  mc: "Opción múltiple",
  completar: "Completar",
  desarrollo: "Desarrollo",
  caso: "Caso práctico",
};

const KINDS: Flashcard["kind"][] = ["vf", "mc", "completar", "desarrollo", "caso"];

function shuffle<T>(arr: T[]): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards({
  cards,
  units,
}: {
  cards: Flashcard[];
  units: number[];
}) {
  const [unit, setUnit] = useState<number | "all">("all");
  const [kind, setKind] = useState<Flashcard["kind"] | "all">("all");

  const pool = useMemo(
    () =>
      cards.filter(
        (c) => (unit === "all" || c.unit === unit) && (kind === "all" || c.kind === kind),
      ),
    [cards, unit, kind],
  );

  const [order, setOrder] = useState<Flashcard[]>(() => pool);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setOrder(pool);
    setIdx(0);
    setFlipped(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit, kind]);

  const go = (d: number) => {
    setIdx((i) => {
      const n = Math.min(order.length - 1, Math.max(0, i + d));
      return n;
    });
    setFlipped(false);
  };

  const card = order[idx];

  if (!card) {
    return (
      <div className="dvt">
        <p className="vtool__intro">No hay tarjetas para este filtro.</p>
      </div>
    );
  }

  return (
    <div className="dvt df">
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
        <div className="dq__chips" role="group" aria-label="Filtrar por tipo">
          <button
            type="button"
            className={`dvt-chip${kind === "all" ? " is-active" : ""}`}
            onClick={() => setKind("all")}
          >
            Todo tipo
          </button>
          {KINDS.map((k) => (
            <button
              key={k}
              type="button"
              className={`dvt-chip${kind === k ? " is-active" : ""}`}
              onClick={() => setKind(k)}
            >
              {KIND_LABEL[k]}
            </button>
          ))}
        </div>
        <button type="button" className="dvt-chip" onClick={() => setOrder(shuffle(pool))}>
          ⤮ Barajar
        </button>
      </div>

      <article className={`dvt-panel df__card${flipped ? " is-flipped" : ""}`}>
        <header className="dq__head">
          <span className="dvt-tag">{card.unit === 0 ? "Integradora" : `Unidad ${card.unit}`}</span>
          <span className="dvt-tag dvt-tag--muted">{KIND_LABEL[card.kind]}</span>
          <span className="df__tema">{card.tema}</span>
          <span className="dq__count">
            {idx + 1} / {order.length}
          </span>
        </header>

        <Html className="df__enun" html={card.enunciado} />

        {card.opts && (
          <ul className="df__opts">
            {card.opts.map((o, i) => (
              <li key={i}>
                <span className="df__opt-mark" aria-hidden="true">
                  {String.fromCharCode(97 + i)}
                </span>
                {o}
              </li>
            ))}
          </ul>
        )}

        {flipped ? (
          <div className="df__back">
            <span className="df__back-label">Corrección</span>
            <Html className="df__resp" html={card.respuesta} />
          </div>
        ) : (
          <button type="button" className="dvt-btn dvt-btn--primary df__flip" onClick={() => setFlipped(true)}>
            Ver respuesta
          </button>
        )}

        <footer className="dq__nav">
          <button type="button" className="dvt-btn" onClick={() => go(-1)} disabled={idx === 0}>
            ← Anterior
          </button>
          <button
            type="button"
            className="dvt-btn dvt-btn--primary"
            onClick={() => go(1)}
            disabled={idx === order.length - 1}
          >
            Siguiente →
          </button>
        </footer>
      </article>
    </div>
  );
}
