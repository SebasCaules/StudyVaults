"use client";

import { useMemo, useState } from "react";
import { Panel, SubPanel, Note, TextInput, Badge } from "@studyvaults/ui";
import { fmt } from "../lib/stats";

/* ============================================================================
 * Teoría de la decisión / valor esperado (criterio bayesiano)
 *
 * Matriz de pagos: columnas = estados de la naturaleza (cada uno con su
 * probabilidad pⱼ), filas = alternativas/acciones. Cada celda vᵢⱼ es el pago
 * de la acción i bajo el estado j. Se calcula por fila E[aᵢ] = Σⱼ pⱼ·vᵢⱼ y se
 * resalta la de mayor valor esperado. Como contraste, sin probabilidades:
 * maximin = máxᵢ mínⱼ vᵢⱼ y maximax = máxᵢ máxⱼ vᵢⱼ.
 *
 * Ejemplo por defecto: vendedor de diarios (newsvendor) del TP3, ej. 11.
 * Compra a $0,40, vende a $1; la demanda incierta no se penaliza. Las acciones
 * son cuántos diarios comprar (k) y los estados son la demanda observada.
 * G(k, x) = x − 0,40·k si x < k (sobran), y 0,60·k si x ≥ k (vende todo).
 * ========================================================================== */

// Parser numérico tolerante con fallback. Acepta coma o punto decimal.
function num(s: string, fallback = NaN): number {
  if (s.trim() === "") return fallback;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

const MIN_DIM = 2;
const MAX_DIM = 5;

interface DefaultMatrix {
  states: string[];
  probs: string[];
  actions: string[];
  payoffs: string[][];
}

// Vendedor de diarios: acciones k ∈ {66, 67, 68, 69}, estados de demanda
// x ∈ {66, 67, 68, 69} con sus probabilidades del TP3. Pago G(k, x).
function newsvendorPayoff(k: number, x: number): number {
  return x < k ? x - 0.4 * k : 0.6 * k;
}

const DEFAULT: DefaultMatrix = (() => {
  const ks = [66, 67, 68, 69];
  const xs = [66, 67, 68, 69];
  const ps = ["0.08", "0.15", "0.28", "0.22"]; // suma 0,73 → renormalizada abajo
  // Renormalizamos a 1 para que el ejemplo arranque consistente.
  const total = ps.reduce((acc, p) => acc + num(p), 0);
  const probs = ps.map((p) => (num(p) / total).toFixed(3));
  return {
    states: xs.map((x) => `Demanda ${x}`),
    probs,
    actions: ks.map((k) => `Comprar ${k}`),
    payoffs: ks.map((k) => xs.map((x) => newsvendorPayoff(k, x).toFixed(2))),
  };
})();

export default function DecisionTool() {
  const [states, setStates] = useState<string[]>(DEFAULT.states);
  const [probs, setProbs] = useState<string[]>(DEFAULT.probs);
  const [actions, setActions] = useState<string[]>(DEFAULT.actions);
  const [payoffs, setPayoffs] = useState<string[][]>(DEFAULT.payoffs);

  const nStates = states.length;
  const nActions = actions.length;

  /* -- Mutadores de la matriz (filas = acciones, columnas = estados) -------- */

  function addState() {
    if (nStates >= MAX_DIM) return;
    setStates((s) => [...s, `Estado ${s.length + 1}`]);
    setProbs((p) => [...p, "0"]);
    setPayoffs((m) => m.map((row) => [...row, "0"]));
  }
  function removeState() {
    if (nStates <= MIN_DIM) return;
    setStates((s) => s.slice(0, -1));
    setProbs((p) => p.slice(0, -1));
    setPayoffs((m) => m.map((row) => row.slice(0, -1)));
  }
  function addAction() {
    if (nActions >= MAX_DIM) return;
    setActions((a) => [...a, `Acción ${a.length + 1}`]);
    setPayoffs((m) => [...m, Array(nStates).fill("0")]);
  }
  function removeAction() {
    if (nActions <= MIN_DIM) return;
    setActions((a) => a.slice(0, -1));
    setPayoffs((m) => m.slice(0, -1));
  }
  function loadExample() {
    setStates(DEFAULT.states);
    setProbs(DEFAULT.probs);
    setActions(DEFAULT.actions);
    setPayoffs(DEFAULT.payoffs);
  }

  function setProb(j: number, val: string) {
    setProbs((p) => p.map((x, idx) => (idx === j ? val : x)));
  }
  function setStateName(j: number, val: string) {
    setStates((s) => s.map((x, idx) => (idx === j ? val : x)));
  }
  function setActionName(i: number, val: string) {
    setActions((a) => a.map((x, idx) => (idx === i ? val : x)));
  }
  function setPayoff(i: number, j: number, val: string) {
    setPayoffs((m) =>
      m.map((row, ri) =>
        ri === i ? row.map((c, ci) => (ci === j ? val : c)) : row,
      ),
    );
  }

  /* -- Cálculo: validación + E[aᵢ], maximin, maximax ------------------------ */

  const result = useMemo(() => {
    const pj = probs.map((p) => num(p));
    if (pj.some((p) => !Number.isFinite(p))) {
      return { err: "Todas las probabilidades de los estados deben ser numéricas." };
    }
    if (pj.some((p) => p < 0)) {
      return { err: "Las probabilidades no pueden ser negativas." };
    }

    const grid: number[][] = payoffs.map((row) => row.map((c) => num(c)));
    if (grid.some((row) => row.some((v) => !Number.isFinite(v)))) {
      return { err: "Todos los pagos de la matriz deben ser numéricos." };
    }

    const sumP = pj.reduce((acc, p) => acc + p, 0);

    // E[aᵢ] = Σⱼ pⱼ·vᵢⱼ ; maximin = máxᵢ mínⱼ vᵢⱼ ; maximax = máxᵢ máxⱼ vᵢⱼ.
    const rows = grid.map((row, i) => {
      const ev = row.reduce((acc, v, j) => acc + pj[j] * v, 0);
      const worst = Math.min(...row);
      const best = Math.max(...row);
      return { i, ev, worst, best };
    });

    const bayesIdx = rows.reduce(
      (bestI, r) => (r.ev > rows[bestI].ev ? r.i : bestI),
      0,
    );
    const maximinIdx = rows.reduce(
      (bestI, r) => (r.worst > rows[bestI].worst ? r.i : bestI),
      0,
    );
    const maximaxIdx = rows.reduce(
      (bestI, r) => (r.best > rows[bestI].best ? r.i : bestI),
      0,
    );

    const probOk = Math.abs(sumP - 1) <= 1e-6;

    return {
      rows,
      sumP,
      probOk,
      bayesIdx,
      maximinIdx,
      maximaxIdx,
    };
  }, [probs, payoffs]);

  const ok = !("err" in result);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Teoría de la decisión — valor esperado</h3>
        <p>
          Matriz de pagos con estados (columnas, cada uno con su probabilidad) y
          acciones (filas). Elegí la de mayor valor esperado E[aᵢ] = Σⱼ pⱼ·vᵢⱼ.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* ------------------------------- Controles ------------------------ */}
        <div className="vtool-stack">
          <div className="vtool-field">
            <span className="vtool-label">
              <span>Estados de la naturaleza</span>
            </span>
            <div className="vtool-row" style={{ marginTop: 6 }}>
              <button
                type="button"
                className="btn btn--sm btn--ghost"
                onClick={addState}
                disabled={nStates >= MAX_DIM}
              >
                + Agregar estado
              </button>
              <button
                type="button"
                className="btn btn--sm btn--ghost"
                onClick={removeState}
                disabled={nStates <= MIN_DIM}
              >
                − Quitar estado
              </button>
            </div>
          </div>

          <div className="vtool-field">
            <span className="vtool-label">
              <span>Alternativas / acciones</span>
            </span>
            <div className="vtool-row" style={{ marginTop: 6 }}>
              <button
                type="button"
                className="btn btn--sm btn--ghost"
                onClick={addAction}
                disabled={nActions >= MAX_DIM}
              >
                + Agregar acción
              </button>
              <button
                type="button"
                className="btn btn--sm btn--ghost"
                onClick={removeAction}
                disabled={nActions <= MIN_DIM}
              >
                − Quitar acción
              </button>
            </div>
            <Note style={{ marginTop: 8 }}>
              Entre {MIN_DIM} y {MAX_DIM} estados y acciones. Editá nombres,
              probabilidades y pagos directamente en la tabla.
            </Note>
          </div>

          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={loadExample}
          >
            Ejemplo: vendedor de diarios
          </button>

          {ok ? (
            <SubPanel>
              <div className="vtool-eyebrow">Σ de probabilidades</div>
              <div className="vtool-bignum" style={{ marginTop: 6 }}>
                {fmt(result.sumP, 3)}
                <small> = Σ pⱼ</small>
              </div>
              {!result.probOk && (
                <Note tone="error" style={{ marginTop: 10 }}>
                  Las probabilidades de los estados suman {fmt(result.sumP, 4)};
                  deben sumar 1 para que E[aᵢ] sea un valor esperado válido.
                </Note>
              )}
            </SubPanel>
          ) : (
            <Note tone="error">{result.err}</Note>
          )}
        </div>

        {/* --------------------------- Matriz + salida ---------------------- */}
        <div className="vtool-stack">
          <SubPanel>
            <div className="vtool-eyebrow">Matriz de pagos</div>
            <div style={{ overflowX: "auto", marginTop: 8 }}>
              <table className="vtool-table">
                <thead>
                  <tr>
                    <th>Acción \ Estado</th>
                    {states.map((s, j) => (
                      <th key={`st-${j}`}>
                        <TextInput
                          value={s}
                          onChange={(e) => setStateName(j, e.target.value)}
                          aria-label={`Nombre del estado ${j + 1}`}
                        />
                      </th>
                    ))}
                    <th>E[aᵢ]</th>
                  </tr>
                  <tr>
                    <th style={{ fontStyle: "italic" }}>pⱼ →</th>
                    {probs.map((p, j) => (
                      <th key={`pr-${j}`}>
                        <TextInput
                          value={p}
                          onChange={(e) => setProb(j, e.target.value)}
                          inputMode="decimal"
                          aria-label={`Probabilidad del estado ${j + 1}`}
                        />
                      </th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {actions.map((a, i) => {
                    const isBest =
                      ok && result.probOk && result.bayesIdx === i;
                    return (
                      <tr
                        key={`ac-${i}`}
                        style={
                          isBest
                            ? {
                                background:
                                  "color-mix(in srgb, var(--accent) 14%, transparent)",
                              }
                            : undefined
                        }
                      >
                        <td>
                          <TextInput
                            value={a}
                            onChange={(e) => setActionName(i, e.target.value)}
                            aria-label={`Nombre de la acción ${i + 1}`}
                          />
                        </td>
                        {states.map((_, j) => (
                          <td key={`cell-${i}-${j}`}>
                            <TextInput
                              value={payoffs[i]?.[j] ?? ""}
                              onChange={(e) => setPayoff(i, j, e.target.value)}
                              inputMode="decimal"
                              aria-label={`Pago de acción ${i + 1} en estado ${
                                j + 1
                              }`}
                            />
                          </td>
                        ))}
                        <td>
                          {ok ? (
                            <code
                              style={
                                isBest
                                  ? {
                                      color: "var(--accent-text)",
                                      fontWeight: 700,
                                    }
                                  : undefined
                              }
                            >
                              {fmt(result.rows[i].ev, 3)}
                            </code>
                          ) : (
                            <code>—</code>
                          )}
                          {isBest && (
                            <>
                              {" "}
                              <Badge variant="solid">mejor</Badge>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {ok && (
              <Note style={{ marginTop: 10 }}>
                E[aᵢ] = Σⱼ pⱼ·vᵢⱼ. La decisión óptima (criterio bayesiano) es la
                acción de mayor valor esperado, resaltada cuando Σ pⱼ = 1.
              </Note>
            )}
          </SubPanel>

          {ok && (
            <SubPanel>
              <div className="vtool-eyebrow">
                Sin probabilidades (criterios de contraste)
              </div>
              <table className="vtool-table" style={{ marginTop: 8 }}>
                <thead>
                  <tr>
                    <th>Criterio</th>
                    <th>Acción elegida</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <b>Maximin</b>
                      <div className="vtool-sub">mejor de los peores</div>
                    </td>
                    <td>{actions[result.maximinIdx]}</td>
                    <td>
                      <code>{fmt(result.rows[result.maximinIdx].worst, 3)}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Maximax</b>
                      <div className="vtool-sub">mejor de los mejores</div>
                    </td>
                    <td>{actions[result.maximaxIdx]}</td>
                    <td>
                      <code>{fmt(result.rows[result.maximaxIdx].best, 3)}</code>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Valor esperado</b>
                      <div className="vtool-sub">criterio bayesiano</div>
                    </td>
                    <td>
                      {result.probOk ? (
                        actions[result.bayesIdx]
                      ) : (
                        <span className="vtool-sub">requiere Σ pⱼ = 1</span>
                      )}
                    </td>
                    <td>
                      <code>
                        {result.probOk
                          ? fmt(result.rows[result.bayesIdx].ev, 3)
                          : "—"}
                      </code>
                    </td>
                  </tr>
                </tbody>
              </table>
              <Note style={{ marginTop: 10 }}>
                Maximin = máxᵢ mínⱼ vᵢⱼ (pesimista); maximax = máxᵢ máxⱼ vᵢⱼ
                (optimista). No usan las probabilidades: sirven para contrastar
                con la decisión bayesiana.
              </Note>
            </SubPanel>
          )}
        </div>
      </div>
    </Panel>
  );
}
