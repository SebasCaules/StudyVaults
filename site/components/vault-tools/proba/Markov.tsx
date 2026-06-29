"use client";

import { useMemo, useState } from "react";
import { Panel, SubPanel, Note, Field, Select } from "@studyvaults/ui";
import { fmt } from "../lib/stats";
import { multiply, identity, transpose, matVec } from "../lib/linalg";

/* ============================================================================
 * Cadenas de Markov (tiempo discreto)
 * Matriz de transición P (estocástica por filas), vector inicial π₀ y n pasos.
 * Calcula Pⁿ, la distribución tras n pasos π_n = π₀·Pⁿ y la estacionaria π por
 * iteración. Convención del vault: vectores fila, filas de P suman 1.
 * ========================================================================== */

// Parser numérico tolerante con fallback. Acepta coma o punto decimal.
function num(s: string, fallback = NaN): number {
  if (s.trim() === "") return fallback;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

const SIZES = [2, 3, 4] as const;
type Size = (typeof SIZES)[number];

const STATE_NAMES = ["s₁", "s₂", "s₃", "s₄"];

// Presets de P (estocásticas por filas) por tamaño, como grilla de strings.
const PRESET_P: Record<Size, string[][]> = {
  2: [
    ["0.7", "0.3"],
    ["0.4", "0.6"],
  ],
  // Ej. 17 del TP6 (vendedor viajero): cadena regular de 3 estados.
  3: [
    ["0.3", "0.4", "0.3"],
    ["1", "0", "0"],
    ["0", "0.3", "0.7"],
  ],
  4: [
    ["0.5", "0.3", "0.1", "0.1"],
    ["0.2", "0.5", "0.2", "0.1"],
    ["0.1", "0.2", "0.5", "0.2"],
    ["0.1", "0.1", "0.3", "0.5"],
  ],
};

const PRESET_PI0: Record<Size, string[]> = {
  2: ["1", "0"],
  3: ["1", "0", "0"],
  4: ["1", "0", "0", "0"],
};

// Matriz de strings (k×k) → matriz numérica, con NaN donde no parsea.
function parseMatrix(grid: string[][]): number[][] {
  return grid.map((row) => row.map((c) => num(c)));
}

// Vector de strings → vector numérico.
function parseVec(cells: string[]): number[] {
  return cells.map((c) => num(c));
}

export default function MarkovTool() {
  const [size, setSize] = useState<Size>(3);
  const [n, setN] = useState(4);
  // P y π₀ como grillas de strings (toleran edición parcial). Se siembran con
  // el preset del tamaño activo, que es estocástico por filas (un preset de otro
  // tamaño recortado dejaría de sumar 1, así que cada tamaño carga el suyo).
  const [pGrid, setPGrid] = useState<string[][]>(
    PRESET_P[3].map((r) => r.slice()),
  );
  const [pi0, setPi0] = useState<string[]>(PRESET_PI0[3].slice());

  const k = size;

  // Vistas recortadas al tamaño activo.
  const Pstr = useMemo(
    () => pGrid.slice(0, k).map((r) => r.slice(0, k)),
    [pGrid, k],
  );
  const pi0str = useMemo(() => pi0.slice(0, k), [pi0, k]);

  const setSize2 = (s: Size) => {
    // Al cambiar de tamaño cargamos el preset de ese tamaño: garantiza una
    // matriz estocástica por filas válida (recortar/crecer un estocástico
    // rompería la suma de filas).
    setPGrid(PRESET_P[s].map((r) => r.slice()));
    setPi0(PRESET_PI0[s].slice());
    setSize(s);
  };

  const setCell = (i: number, j: number, val: string) => {
    setPGrid((prev) => {
      const next = prev.map((r) => r.slice());
      while (next.length <= i) next.push([]);
      next[i][j] = val;
      return next;
    });
  };

  const setPi0Cell = (i: number, val: string) => {
    setPi0((prev) => {
      const next = prev.slice();
      next[i] = val;
      return next;
    });
  };

  // Validación + cálculos.
  const result = useMemo(() => {
    const P = parseMatrix(Pstr);
    const p0 = parseVec(pi0str);

    // ¿Todas las celdas de P numéricas?
    for (let i = 0; i < k; i++)
      for (let j = 0; j < k; j++)
        if (!Number.isFinite(P[i][j]))
          return {
            err: `La celda P[${i + 1},${j + 1}] no es un número válido.`,
          };
    // Probabilidades en [0, 1].
    for (let i = 0; i < k; i++)
      for (let j = 0; j < k; j++)
        if (P[i][j] < 0 || P[i][j] > 1)
          return {
            err: `P[${i + 1},${j + 1}] = ${fmt(
              P[i][j],
            )} fuera de [0, 1]. Las entradas son probabilidades.`,
          };
    // Estocástica por filas: cada fila suma ≈ 1.
    const rowSums = P.map((row) => row.reduce((s, v) => s + v, 0));
    const badRow = rowSums.findIndex((s) => Math.abs(s - 1) > 1e-6);
    if (badRow >= 0)
      return {
        err: `La fila ${badRow + 1} suma ${fmt(
          rowSums[badRow],
        )} (debe sumar 1). Cada fila de P es una distribución condicional.`,
        rowSums,
      };

    // π₀ válido.
    for (let i = 0; i < k; i++)
      if (!Number.isFinite(p0[i]))
        return { err: `π₀[${i + 1}] no es un número válido.`, rowSums };
    for (let i = 0; i < k; i++)
      if (p0[i] < 0)
        return {
          err: `π₀[${i + 1}] = ${fmt(
            p0[i],
          )} es negativo. La distribución inicial no puede tener masa negativa.`,
          rowSums,
        };
    const sum0 = p0.reduce((s, v) => s + v, 0);
    if (Math.abs(sum0 - 1) > 1e-6)
      return {
        err: `π₀ suma ${fmt(sum0)} (debe sumar 1).`,
        rowSums,
      };

    // (a) Pⁿ = P·P·…·P (n veces), desde la identidad.
    let Pn: number[][] = identity(k);
    for (let step = 0; step < n; step++) {
      const m = multiply(Pn, P);
      if (!m) return { err: "No se pudo multiplicar la matriz.", rowSums };
      Pn = m;
    }

    // (b) Distribución tras n pasos: π_n = π₀·Pⁿ (vector fila × matriz).
    // Como matVec hace A·x (columna), usamos transpose(Pⁿ)·π₀ᵀ.
    const piN = matVec(transpose(Pn), p0);
    if (!piN) return { err: "No se pudo propagar la distribución.", rowSums };

    // (c) Estacionaria por iteración: arrancamos de la uniforme y aplicamos
    // π_{m+1} = π_m·P hasta |Δ| < 1e-10 o 500 pasos. Vale para cadenas regulares.
    let pi: number[] = new Array(k).fill(1 / k);
    const Pt = transpose(P);
    let iters = 0;
    let converged = false;
    for (let m = 0; m < 500; m++) {
      iters = m + 1;
      const next = matVec(Pt, pi);
      if (!next) break;
      let delta = 0;
      for (let i = 0; i < k; i++) delta += Math.abs(next[i] - pi[i]);
      pi = next;
      if (delta < 1e-10) {
        converged = true;
        break;
      }
    }
    // Renormaliza por seguridad numérica.
    const piSum = pi.reduce((s, v) => s + v, 0);
    if (piSum > 0) pi = pi.map((v) => v / piSum);

    return { P, p0, Pn, piN, pi, rowSums, iters, converged };
  }, [Pstr, pi0str, k, n]);

  const ok = !("err" in result);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Cadenas de Markov</h3>
        <p>
          Editá la matriz de transición P (filas que suman 1) y la distribución
          inicial π₀; obtené Pⁿ, la distribución tras n pasos y la estacionaria.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* Controles */}
        <div className="vtool-stack">
          <div className="vtool-row">
            <Field label="Estados (k)" htmlFor="mk-size" style={{ flex: 1 }}>
              <Select
                id="mk-size"
                value={String(size)}
                onChange={(e) => setSize2(Number(e.target.value) as Size)}
              >
                {SIZES.map((s) => (
                  <option key={s} value={s}>
                    {s} estados
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Pasos (n)" htmlFor="mk-n" style={{ flex: 1 }}>
              <Select
                id="mk-n"
                value={String(n)}
                onChange={(e) => setN(Number(e.target.value))}
              >
                {Array.from({ length: 50 }, (_, i) => i + 1).map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          {/* Matriz de transición P */}
          <div className="vtool-field">
            <div className="vtool-label">
              <span>Matriz de transición P (cada fila suma 1)</span>
            </div>
            <table className="vtool-matrix" style={{ marginTop: 6 }}>
              <thead>
                <tr>
                  <th />
                  {Array.from({ length: k }, (_, j) => (
                    <th key={j} className="vtool-mono">
                      {STATE_NAMES[j]}
                    </th>
                  ))}
                  <th className="vtool-mono">Σ</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: k }, (_, i) => {
                  const s = ok
                    ? result.rowSums[i]
                    : "rowSums" in result
                      ? (result.rowSums as number[])[i]
                      : NaN;
                  const bad = Number.isFinite(s)
                    ? Math.abs(s - 1) > 1e-6
                    : true;
                  return (
                    <tr key={i}>
                      <th className="vtool-mono">{STATE_NAMES[i]}</th>
                      {Array.from({ length: k }, (_, j) => (
                        <td key={j}>
                          <input
                            className="vtool-mono"
                            value={Pstr[i]?.[j] ?? ""}
                            onChange={(e) => setCell(i, j, e.target.value)}
                            inputMode="decimal"
                            aria-label={`P[${i + 1},${j + 1}]`}
                            style={{
                              width: "100%",
                              boxSizing: "border-box",
                              textAlign: "center",
                              background: "transparent",
                              border: "none",
                              color: "var(--ink-strong)",
                              fontFamily: "var(--font-mono)",
                            }}
                          />
                        </td>
                      ))}
                      <td
                        className="vtool-mono"
                        style={{
                          textAlign: "center",
                          color: bad
                            ? "var(--accent-text)"
                            : "var(--text-secondary)",
                        }}
                      >
                        {Number.isFinite(s) ? fmt(s, 3) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Vector inicial π₀ */}
          <div className="vtool-field">
            <div className="vtool-label">
              <span>Distribución inicial π₀ (fila, suma 1)</span>
            </div>
            <table className="vtool-matrix" style={{ marginTop: 6 }}>
              <thead>
                <tr>
                  {Array.from({ length: k }, (_, j) => (
                    <th key={j} className="vtool-mono">
                      {STATE_NAMES[j]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {Array.from({ length: k }, (_, j) => (
                    <td key={j}>
                      <input
                        className="vtool-mono"
                        value={pi0str[j] ?? ""}
                        onChange={(e) => setPi0Cell(j, e.target.value)}
                        inputMode="decimal"
                        aria-label={`π₀[${j + 1}]`}
                        style={{
                          width: "100%",
                          boxSizing: "border-box",
                          textAlign: "center",
                          background: "transparent",
                          border: "none",
                          color: "var(--ink-strong)",
                          fontFamily: "var(--font-mono)",
                        }}
                      />
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="vtool-row">
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => {
                setPGrid(PRESET_P[k].map((r) => r.slice()));
                setPi0(PRESET_PI0[k].slice());
              }}
            >
              Cargar ejemplo
            </button>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => {
                // Identidad (cada estado absorbente) — punto de partida limpio.
                setPGrid((prev) => {
                  const next = prev.map((r) => r.slice());
                  for (let i = 0; i < k; i++) {
                    if (!next[i]) next[i] = [];
                    for (let j = 0; j < k; j++)
                      next[i][j] = i === j ? "1" : "0";
                  }
                  return next;
                });
              }}
            >
              Reiniciar P
            </button>
          </div>

          <Note>
            Convención de fila (la del vault): π es un vector fila y avanza un
            paso con π·P. Cada fila de P es la distribución condicional "a dónde
            voy si estoy en ese estado".
          </Note>
        </div>

        {/* Salida */}
        <div className="vtool-stack">
          {"err" in result ? (
            <Note tone="error">{result.err}</Note>
          ) : (
            <>
              <SubPanel>
                <div className="vtool-eyebrow">Distribución tras n pasos</div>
                <div className="vtool-bignum" style={{ marginTop: 6 }}>
                  π
                  <sub>{n}</sub>
                  <small> = π₀·P{toSup(n)}</small>
                </div>
                <table className="vtool-table" style={{ marginTop: 10 }}>
                  <thead>
                    <tr>
                      <th>Estado</th>
                      {Array.from({ length: k }, (_, j) => (
                        <th key={j}>{STATE_NAMES[j]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>
                        π<sub>{n}</sub>
                      </td>
                      {result.piN.map((v, j) => (
                        <td key={j}>
                          <code>{fmt(v)}</code>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </SubPanel>

              <SubPanel>
                <div className="vtool-eyebrow">
                  Matriz de n pasos · P{toSup(n)}
                </div>
                <div style={{ overflowX: "auto", marginTop: 8 }}>
                  <table className="vtool-table">
                    <thead>
                      <tr>
                        <th />
                        {Array.from({ length: k }, (_, j) => (
                          <th key={j}>{STATE_NAMES[j]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.Pn.map((row, i) => (
                        <tr key={i}>
                          <td style={{ fontWeight: 600 }}>{STATE_NAMES[i]}</td>
                          {row.map((v, j) => (
                            <td key={j}>
                              <code>{fmt(v)}</code>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Note style={{ marginTop: 10 }}>
                  (P{toSup(n)})<sub>ij</sub> suma las probabilidades de todos los
                  caminos de i a j en exactamente n pasos.
                </Note>
              </SubPanel>

              <SubPanel>
                <div className="vtool-eyebrow">Distribución estacionaria π</div>
                <table className="vtool-table" style={{ marginTop: 8 }}>
                  <thead>
                    <tr>
                      <th>Estado</th>
                      {Array.from({ length: k }, (_, j) => (
                        <th key={j}>{STATE_NAMES[j]}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>π</td>
                      {result.pi.map((v, j) => (
                        <td key={j}>
                          <code className="acc">{fmt(v)}</code>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
                <div className="vtool-readout" style={{ marginTop: 10 }}>
                  <div className="vtool-kv">
                    <span className="k">Iteraciones</span>
                    <span className="v">{result.iters}</span>
                  </div>
                  <div className="vtool-kv">
                    <span className="k">Convergió (|Δ| &lt; 1e-10)</span>
                    <span className="v acc">
                      {result.converged ? "sí" : "no"}
                    </span>
                  </div>
                </div>
                <Note style={{ marginTop: 10 }}>
                  Aproximada iterando π<sub>m+1</sub> = π<sub>m</sub>·P desde la
                  uniforme. Resuelve π = π·P con Σπ = 1.{" "}
                  <b>Vale para cadenas regulares</b> (existe n con Pⁿ &gt; 0); en
                  cadenas periódicas o reducibles el límite puede no existir o
                  depender del inicio.
                </Note>
              </SubPanel>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

// Exponente en superíndice para etiquetas (P², P¹⁰, …).
function toSup(num: number): string {
  const map: Record<string, string> = {
    "0": "⁰",
    "1": "¹",
    "2": "²",
    "3": "³",
    "4": "⁴",
    "5": "⁵",
    "6": "⁶",
    "7": "⁷",
    "8": "⁸",
    "9": "⁹",
  };
  return String(num)
    .split("")
    .map((c) => map[c] ?? c)
    .join("");
}
