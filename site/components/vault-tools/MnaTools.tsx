"use client";

import { useMemo, useState, type ReactNode } from "react";
import { Panel, SubPanel, Note, Chip } from "@studyvaults/ui";
import ToolkitShell, { type Tool } from "./ToolkitShell";
import {
  rows,
  isSquare,
  clone,
  identity,
  transpose,
  multiply,
  det,
  inverse,
  rank,
  luDecompose,
  qrGramSchmidt,
  frobenius,
  norm1,
  normInf,
  jacobiEigenSymmetric,
  svd,
  cond2,
  eig2x2,
  fmt,
  type Mat,
} from "./lib/linalg";

/* ──────────────────────────────────────────────────────────────────────────
   Helpers de matriz (estado = number[][])
   ────────────────────────────────────────────────────────────────────────── */

function makeMatrix(n: number, fill: (i: number, j: number) => number): Mat {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => fill(i, j)),
  );
}

const DEFAULT_A = (n: number): Mat => {
  // matriz "viva" por defecto: diagonal dominante, no trivial
  const seed = [
    [4, 1, 2, 0, 1],
    [1, 3, 0, 1, 0],
    [2, 0, 5, 1, 1],
    [0, 1, 1, 4, 2],
    [1, 0, 1, 2, 3],
  ];
  return makeMatrix(n, (i, j) => seed[i][j]);
};

const DEFAULT_B = (n: number): Mat =>
  makeMatrix(n, (i, j) => (i === j ? 1 : i < j ? 2 : 0));

function resizeMatrix(M: Mat, n: number, fill: (i: number, j: number) => number): Mat {
  return makeMatrix(n, (i, j) =>
    i < M.length && j < (M[0]?.length ?? 0) ? M[i][j] : fill(i, j),
  );
}

function isSymmetric(A: Mat, tol = 1e-9): boolean {
  if (!isSquare(A)) return false;
  const n = rows(A);
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++)
      if (Math.abs(A[i][j] - A[j][i]) > tol) return false;
  return true;
}

function randInt(): number {
  // entero pequeño centrado en 0, agradable para mostrar
  return Math.floor(Math.random() * 11) - 5;
}

/* ──────────────────────────────────────────────────────────────────────────
   Componentes de presentación
   ────────────────────────────────────────────────────────────────────────── */

/** Editor de matriz n×n con celdas <input>. */
function MatrixEditor({
  label,
  A,
  n,
  onCell,
}: {
  label: ReactNode;
  A: Mat;
  n: number;
  onCell: (i: number, j: number, raw: string) => void;
}) {
  return (
    <div className="vtool-field">
      <span className="vtool-label">{label}</span>
      <div
        className="vtool-matrix"
        style={{ gridTemplateColumns: `repeat(${n}, max-content)` }}
        role="group"
        aria-label="Celdas de la matriz"
      >
        {Array.from({ length: n }, (_, i) =>
          Array.from({ length: n }, (_, j) => (
            <input
              key={`${i}-${j}`}
              inputMode="decimal"
              value={Number.isFinite(A[i]?.[j]) ? String(A[i][j]) : ""}
              aria-label={`fila ${i + 1} columna ${j + 1}`}
              onChange={(e) => onCell(i, j, e.target.value)}
            />
          )),
        )}
      </div>
    </div>
  );
}

/** Matriz de solo lectura como tabla .vtool-mout. */
function MatrixOut({
  M,
  caption,
}: {
  M: Mat | null;
  caption?: ReactNode;
}) {
  if (!M || !M.length) {
    return <Note>Sin resultado.</Note>;
  }
  return (
    <div className="vtool-field">
      {caption && <span className="vtool-label">{caption}</span>}
      <div className="vtool-mout">
        <table>
          <tbody>
            {M.map((row, i) => (
              <tr key={i}>
                {row.map((v, j) => (
                  <td key={j}>{fmt(v)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Selector de tamaño n (2..5). */
function SizePicker({
  n,
  onChange,
}: {
  n: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="vtool-field">
      <span className="vtool-label">
        Tamaño <b>n × n</b>
      </span>
      <div className="vtool-row">
        {[2, 3, 4, 5].map((k) => (
          <Chip
            key={k}
            active={k === n}
            aria-pressed={k === n}
            onClick={() => onChange(k)}
          >
            {k}×{k}
          </Chip>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Hook de estado de matriz (n + celdas + resize coherente)
   ────────────────────────────────────────────────────────────────────────── */

function useMatrixState(initial: (n: number) => Mat, n0 = 3) {
  const [n, setN] = useState(n0);
  const [A, setA] = useState<Mat>(() => initial(n0));

  function setCell(i: number, j: number, raw: string) {
    setA((prev) => {
      const next = clone(prev);
      const parsed = raw.trim() === "" || raw.trim() === "-" ? NaN : Number(raw);
      next[i][j] = Number.isFinite(parsed) ? parsed : NaN;
      return next;
    });
  }

  function resize(nn: number) {
    setN(nn);
    setA((prev) => resizeMatrix(prev, nn, () => 0));
  }

  function load(builder: (n: number) => Mat) {
    setA(builder(n));
  }

  return { n, A, setCell, resize, load, setA };
}

/** ¿Hay celdas vacías / inválidas? */
function hasInvalid(A: Mat): boolean {
  return A.some((row) => row.some((v) => !Number.isFinite(v)));
}

/* ──────────────────────────────────────────────────────────────────────────
   TOOL 1 — Calculadora de matrices
   ────────────────────────────────────────────────────────────────────────── */

function MatrixCalc() {
  const a = useMatrixState(DEFAULT_A, 3);
  const [useB, setUseB] = useState(true);
  const [B, setB] = useState<Mat>(() => DEFAULT_B(3));

  function setBCell(i: number, j: number, raw: string) {
    setB((prev) => {
      const next = clone(prev);
      const parsed = raw.trim() === "" || raw.trim() === "-" ? NaN : Number(raw);
      next[i][j] = Number.isFinite(parsed) ? parsed : NaN;
      return next;
    });
  }

  function resizeAll(nn: number) {
    a.resize(nn);
    setB((prev) => resizeMatrix(prev, nn, () => 0));
  }

  const invalidA = hasInvalid(a.A);
  const invalidB = hasInvalid(B);

  const detA = useMemo(() => (invalidA ? null : det(a.A)), [a.A, invalidA]);
  const invA = useMemo(() => (invalidA ? null : inverse(a.A)), [a.A, invalidA]);
  const rankA = useMemo(() => (invalidA ? null : rank(a.A)), [a.A, invalidA]);
  const trA = useMemo(() => transpose(a.A), [a.A]);
  const prod = useMemo(
    () => (invalidA || invalidB || !useB ? null : multiply(a.A, B)),
    [a.A, B, invalidA, invalidB, useB],
  );

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Calculadora de matrices</h3>
        <p>
          Determinante, inversa, rango, traspuesta y producto A·B sobre matrices
          n×n editables. Recalcula al escribir.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <SizePicker n={a.n} onChange={resizeAll} />

          <MatrixEditor
            label={
              <>
                Matriz <b>A</b>
              </>
            }
            A={a.A}
            n={a.n}
            onCell={a.setCell}
          />

          <div className="vtool-row">
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => a.load(identity)}
            >
              A = I
            </button>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => a.load((nn) => makeMatrix(nn, () => randInt()))}
            >
              A aleatoria
            </button>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => a.load((nn) => makeMatrix(nn, () => 0))}
            >
              Limpiar A
            </button>
          </div>

          <label className="vtool-row" style={{ cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={useB}
              onChange={(e) => setUseB(e.target.checked)}
            />
            <span className="vtool-label" style={{ textTransform: "none" }}>
              Calcular producto A·B con una matriz <b>B</b>
            </span>
          </label>

          {useB && (
            <>
              <MatrixEditor
                label={
                  <>
                    Matriz <b>B</b>
                  </>
                }
                A={B}
                n={a.n}
                onCell={setBCell}
              />
              <div className="vtool-row">
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() => setB(identity(a.n))}
                >
                  B = I
                </button>
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() => setB(makeMatrix(a.n, () => randInt()))}
                >
                  B aleatoria
                </button>
                <button
                  type="button"
                  className="btn btn--sm btn--ghost"
                  onClick={() => setB(makeMatrix(a.n, () => 0))}
                >
                  Limpiar B
                </button>
              </div>
            </>
          )}
        </div>

        <div className="vtool-stack">
          {invalidA ? (
            <Note tone="error">
              Hay celdas vacías o no numéricas en A. Completá todas las celdas
              para calcular.
            </Note>
          ) : (
            <>
              <div className="vtool-readout">
                <div className="vtool-kv">
                  <span className="k">det(A)</span>
                  <span className="v acc">{detA !== null ? fmt(detA) : "—"}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">rango(A)</span>
                  <span className="v">
                    {rankA !== null ? rankA : "—"} / {a.n}
                  </span>
                </div>
                <div className="vtool-kv">
                  <span className="k">¿inversible?</span>
                  <span className={`v ${invA ? "" : "coral"}`}>
                    {invA ? "sí" : "no (singular)"}
                  </span>
                </div>
              </div>

              <MatrixOut
                M={trA}
                caption={
                  <>
                    Traspuesta <b>Aᵀ</b>
                  </>
                }
              />

              {invA ? (
                <MatrixOut
                  M={invA}
                  caption={
                    <>
                      Inversa <b>A⁻¹</b>
                    </>
                  }
                />
              ) : (
                <Note>
                  A⁻¹ no existe: la matriz es singular (det ≈ 0, rango &lt; n).
                </Note>
              )}
            </>
          )}

          {useB &&
            !invalidA &&
            (invalidB ? (
              <Note tone="error">
                Completá todas las celdas de B para calcular A·B.
              </Note>
            ) : prod ? (
              <MatrixOut
                M={prod}
                caption={
                  <>
                    Producto <b>A · B</b>
                  </>
                }
              />
            ) : (
              <Note>
                A·B no está definido para estas dimensiones.
              </Note>
            ))}
        </div>
      </div>
    </Panel>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TOOL 2 — Factorizaciones LU y QR
   ────────────────────────────────────────────────────────────────────────── */

function Factorizations() {
  const a = useMatrixState(DEFAULT_A, 3);
  const invalidA = hasInvalid(a.A);

  const lu = useMemo(() => (invalidA ? null : luDecompose(a.A)), [a.A, invalidA]);
  const qr = useMemo(() => (invalidA ? null : qrGramSchmidt(a.A)), [a.A, invalidA]);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Factorizaciones LU y QR</h3>
        <p>
          Descomposición PA = LU (Doolittle con pivoteo parcial) y A = QR
          (Gram–Schmidt) de una matriz cuadrada editable.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <SizePicker n={a.n} onChange={a.resize} />
          <MatrixEditor
            label={
              <>
                Matriz <b>A</b> (n×n)
              </>
            }
            A={a.A}
            n={a.n}
            onCell={a.setCell}
          />
          <div className="vtool-row">
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => a.load(identity)}
            >
              A = I
            </button>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => a.load((nn) => makeMatrix(nn, () => randInt()))}
            >
              Aleatoria
            </button>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => a.load(DEFAULT_A)}
            >
              Ejemplo
            </button>
          </div>
          <Note>
            <b>LU (Doolittle):</b> eliminación gaussiana con pivoteo parcial. La
            permutación de filas P evita pivotes nulos y mejora la estabilidad;
            L es triangular inferior unitaria, U triangular superior.
            <br />
            <b>QR (Gram–Schmidt):</b> ortonormaliza las columnas de A → Q
            ortogonal (QᵀQ = I), R triangular superior.
          </Note>
        </div>

        <div className="vtool-stack">
          {invalidA ? (
            <Note tone="error">
              Completá todas las celdas de A para factorizar.
            </Note>
          ) : (
            <>
              <span className="vtool-eyebrow">PA = LU</span>
              {lu ? (
                <>
                  <div className="vtool-readout">
                    <div className="vtool-kv">
                      <span className="k">intercambios de fila</span>
                      <span className="v">{lu.swaps}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">det(A) = (−1)^swaps · ∏Uᵢᵢ</span>
                      <span className="v acc">
                        {fmt(
                          (lu.swaps % 2 === 0 ? 1 : -1) *
                            lu.U.reduce((p, _r, i) => p * lu.U[i][i], 1),
                        )}
                      </span>
                    </div>
                  </div>
                  <MatrixOut M={lu.P} caption={<>Permutación P</>} />
                  <MatrixOut M={lu.L} caption={<>L (triangular inf. unitaria)</>} />
                  <MatrixOut M={lu.U} caption={<>U (triangular superior)</>} />
                </>
              ) : (
                <Note>
                  La factorización LU requiere una matriz cuadrada.
                </Note>
              )}

              <span className="vtool-eyebrow">A = QR</span>
              {qr ? (
                <>
                  <MatrixOut M={qr.Q} caption={<>Q (columnas ortonormales)</>} />
                  <MatrixOut M={qr.R} caption={<>R (triangular superior)</>} />
                </>
              ) : (
                <Note>
                  Gram–Schmidt necesita columnas linealmente independientes
                  (rango completo). Si A es singular, R tendrá diagonal nula.
                </Note>
              )}
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TOOL 3 — Autovalores y SVD
   ────────────────────────────────────────────────────────────────────────── */

function EigenSvd() {
  const a = useMatrixState(DEFAULT_A, 3);
  const invalidA = hasInvalid(a.A);
  const sym = useMemo(() => isSymmetric(a.A), [a.A]);

  const s = useMemo(() => (invalidA ? null : svd(a.A)), [a.A, invalidA]);
  const kappa = useMemo(() => (invalidA ? null : cond2(a.A)), [a.A, invalidA]);

  const eigBlock = useMemo<ReactNode>(() => {
    if (invalidA) return null;
    if (a.n === 2) {
      const ev = eig2x2(a.A);
      return (
        <div className="vtool-readout">
          {ev.map((l, i) => (
            <div className="vtool-kv" key={i}>
              <span className="k">λ{i + 1}</span>
              <span className="v acc">
                {l.im === 0
                  ? fmt(l.re)
                  : `${fmt(l.re)} ${l.im >= 0 ? "+" : "−"} ${fmt(
                      Math.abs(l.im),
                    )}·i`}
              </span>
            </div>
          ))}
        </div>
      );
    }
    if (sym) {
      const { values, vectors } = jacobiEigenSymmetric(a.A);
      // ordenar descendente, reordenando también los autovectores (columnas)
      const order = values.map((_v, i) => i).sort((i, j) => values[j] - values[i]);
      const vals = order.map((i) => values[i]);
      const V = transpose(order.map((i) => vectors.map((row) => row[i])));
      return (
        <>
          <div className="vtool-readout">
            {vals.map((v, i) => (
              <div className="vtool-kv" key={i}>
                <span className="k">λ{i + 1}</span>
                <span className="v acc">{fmt(v)}</span>
              </div>
            ))}
          </div>
          <MatrixOut M={V} caption={<>Autovectores (columnas de V)</>} />
        </>
      );
    }
    return (
      <Note>
        Para n ≥ 3 los autovalores se calculan por el método de Jacobi, que
        requiere una matriz <b>simétrica</b> (A = Aᵀ). Editá A para hacerla
        simétrica, usá una matriz 2×2, o mirá los valores singulares (SVD)
        abajo, que existen para cualquier A.
      </Note>
    );
  }, [a.A, a.n, sym, invalidA]);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Autovalores y SVD</h3>
        <p>
          Autovalores (2×2 vía fórmula, n×n simétrica vía Jacobi) y
          descomposición en valores singulares A = UΣVᵀ, con normas y número de
          condición.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <SizePicker n={a.n} onChange={a.resize} />
          <MatrixEditor
            label={
              <>
                Matriz <b>A</b>
              </>
            }
            A={a.A}
            n={a.n}
            onCell={a.setCell}
          />
          <div className="vtool-row">
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() =>
                a.load((nn) => {
                  const R = makeMatrix(nn, () => randInt());
                  // simetrizar: (R + Rᵀ)/2 con enteros
                  return makeMatrix(nn, (i, j) => R[i][j] + R[j][i]);
                })
              }
            >
              Simétrica aleatoria
            </button>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => a.load((nn) => makeMatrix(nn, () => randInt()))}
            >
              Aleatoria
            </button>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => a.load(DEFAULT_A)}
            >
              Ejemplo
            </button>
          </div>
          <div className="vtool-row">
            <span className={`vtool-chip ${sym ? "ok" : ""}`}>
              {sym ? "A = Aᵀ (simétrica)" : "A no simétrica"}
            </span>
          </div>
        </div>

        <div className="vtool-stack">
          {invalidA ? (
            <Note tone="error">
              Completá todas las celdas de A para calcular autovalores y SVD.
            </Note>
          ) : (
            <>
              <span className="vtool-eyebrow">Autovalores</span>
              {eigBlock}

              <span className="vtool-eyebrow">Valores singulares (SVD)</span>
              {s && s.S.length ? (
                <>
                  <div className="vtool-readout">
                    {s.S.map((sigma, i) => (
                      <div className="vtool-kv" key={i}>
                        <span className="k">σ{i + 1}</span>
                        <span className="v">{fmt(sigma)}</span>
                      </div>
                    ))}
                  </div>
                  <MatrixOut M={s.U} caption={<>U (vectores izquierdos)</>} />
                  <MatrixOut M={s.V} caption={<>V (vectores derechos)</>} />
                </>
              ) : (
                <Note>No se pudo calcular la SVD.</Note>
              )}

              <span className="vtool-eyebrow">Normas y condición</span>
              <div className="vtool-readout">
                <div className="vtool-kv">
                  <span className="k">κ₂(A) = σmax / σmin</span>
                  <span className="v coral">
                    {kappa === null
                      ? "—"
                      : kappa === Infinity
                        ? "∞ (singular)"
                        : fmt(kappa, 3)}
                  </span>
                </div>
                <div className="vtool-kv">
                  <span className="k">‖A‖F (Frobenius)</span>
                  <span className="v">{fmt(frobenius(a.A))}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">‖A‖₁ (máx suma col.)</span>
                  <span className="v">{fmt(norm1(a.A))}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">‖A‖∞ (máx suma fila)</span>
                  <span className="v">{fmt(normInf(a.A))}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   TOOL 4 — Formulario (referencia estática)
   ────────────────────────────────────────────────────────────────────────── */

function Reference() {
  return (
    <Panel>
      <div className="vtool-head">
        <h3>Formulario</h3>
        <p>
          Definiciones y propiedades clave de álgebra lineal numérica:
          normas, condicionamiento y factorizaciones.
        </p>
      </div>

      <SubPanel>
        <span className="vtool-eyebrow">Normas matriciales</span>
        <table className="vtool-table">
          <thead>
            <tr>
              <th>Norma</th>
              <th>Definición</th>
              <th>Interpretación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>‖A‖₁</code>
              </td>
              <td>
                máx<sub>j</sub> Σ<sub>i</sub> |a<sub>ij</sub>|
              </td>
              <td>máxima suma de valores absolutos por columna</td>
            </tr>
            <tr>
              <td>
                <code>‖A‖∞</code>
              </td>
              <td>
                máx<sub>i</sub> Σ<sub>j</sub> |a<sub>ij</sub>|
              </td>
              <td>máxima suma de valores absolutos por fila</td>
            </tr>
            <tr>
              <td>
                <code>‖A‖₂</code>
              </td>
              <td>σ<sub>max</sub>(A)</td>
              <td>mayor valor singular (norma espectral)</td>
            </tr>
            <tr>
              <td>
                <code>‖A‖F</code>
              </td>
              <td>√( Σ<sub>i,j</sub> a<sub>ij</sub>² ) = √(Σ σ<sub>k</sub>²)</td>
              <td>norma de Frobenius (vectorización entrada a entrada)</td>
            </tr>
          </tbody>
        </table>
      </SubPanel>

      <SubPanel>
        <span className="vtool-eyebrow">Número de condición</span>
        <table className="vtool-table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Definición / propiedad</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>κ(A)</code>
              </td>
              <td>
                κ(A) = ‖A‖ · ‖A⁻¹‖ ≥ 1. En 2-norma, κ₂(A) = σ
                <sub>max</sub> / σ<sub>min</sub>.
              </td>
            </tr>
            <tr>
              <td>Sensibilidad</td>
              <td>
                Acota el error relativo: en A x = b, ‖δx‖/‖x‖ ≤ κ(A)·‖δb‖/‖b‖.
              </td>
            </tr>
            <tr>
              <td>Mal condicionada</td>
              <td>
                κ(A) ≫ 1 ⇒ pequeñas perturbaciones causan grandes cambios en la
                solución. κ(A) = ∞ ⇔ A singular.
              </td>
            </tr>
            <tr>
              <td>Ortogonales</td>
              <td>Si Q es ortogonal, κ₂(Q) = 1 (óptimo).</td>
            </tr>
          </tbody>
        </table>
      </SubPanel>

      <SubPanel>
        <span className="vtool-eyebrow">Factorizaciones</span>
        <table className="vtool-table">
          <thead>
            <tr>
              <th>Factorización</th>
              <th>Forma</th>
              <th>Propiedades / uso</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>LU / PLU</code>
              </td>
              <td>PA = LU</td>
              <td>
                L tri. inferior unitaria, U tri. superior; P permutación
                (pivoteo parcial). Resuelve A x = b por sustitución. det(A) =
                (−1)<sup>swaps</sup>·∏ U<sub>ii</sub>.
              </td>
            </tr>
            <tr>
              <td>
                <code>QR</code>
              </td>
              <td>A = QR</td>
              <td>
                Q ortogonal (QᵀQ = I), R tri. superior. Estable para mínimos
                cuadrados; existe para toda A de rango completo por columnas.
              </td>
            </tr>
            <tr>
              <td>
                <code>Cholesky</code>
              </td>
              <td>A = LLᵀ</td>
              <td>
                Solo si A es simétrica definida positiva. Mitad de costo que LU.
              </td>
            </tr>
            <tr>
              <td>
                <code>SVD</code>
              </td>
              <td>A = U Σ Vᵀ</td>
              <td>
                Existe para <em>toda</em> matriz (m×n). U, V ortogonales; Σ
                diagonal con σ<sub>1</sub> ≥ … ≥ σ<sub>r</sub> &gt; 0.
                rango(A) = nº de σ no nulos.
              </td>
            </tr>
          </tbody>
        </table>
      </SubPanel>

      <SubPanel>
        <span className="vtool-eyebrow">Inversa, rango y autovalores</span>
        <table className="vtool-table">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Condición / relación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Existe A⁻¹</td>
              <td>
                A cuadrada y det(A) ≠ 0 ⇔ rango(A) = n ⇔ columnas
                independientes ⇔ ningún autovalor (ni valor singular) es cero.
              </td>
            </tr>
            <tr>
              <td>Rango–nulidad</td>
              <td>
                Para A de m×n: rango(A) + dim(núcleo A) = n (nº de columnas).
              </td>
            </tr>
            <tr>
              <td>Autovalores</td>
              <td>
                det(A − λI) = 0. Σ λ<sub>i</sub> = traza(A); ∏ λ<sub>i</sub> =
                det(A).
              </td>
            </tr>
            <tr>
              <td>Simétrica real</td>
              <td>
                Autovalores reales y autovectores ortogonales (diagonalizable
                por Q ortogonal: A = QΛQᵀ).
              </td>
            </tr>
            <tr>
              <td>Singulares vs. propios</td>
              <td>
                σ<sub>i</sub>(A) = √(λ<sub>i</sub>(AᵀA)). Si A es simétrica
                definida positiva, σ<sub>i</sub> = λ<sub>i</sub>.
              </td>
            </tr>
          </tbody>
        </table>
      </SubPanel>

      <Note>
        Convención: índices desde 1, normas inducidas salvo Frobenius. Los
        cálculos del toolkit usan pivoteo parcial (LU), Gram–Schmidt (QR) y
        Jacobi sobre AᵀA (SVD), coherentes con el método del curso.
      </Note>
    </Panel>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Afiches bespoke del runner (micro-ilustraciones tinteadas por --k-color)
   ────────────────────────────────────────────────────────────────────────── */

/** Matriz n×n con la diagonal resaltada — determinante, inversa, rango. */
const PosterMatrix = (
  <svg viewBox="0 0 288 150" fill="none">
    <path d="M100 30 H90 V120 H100" stroke="var(--border)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    <path d="M188 30 H198 V120 H188" stroke="var(--border)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
    <rect x="106" y="36" width="24" height="24" rx="3" fill="color-mix(in srgb, var(--k-color) 24%, transparent)" stroke="var(--k-color)" strokeWidth={1.3} />
    <rect x="132" y="63" width="24" height="24" rx="3" fill="color-mix(in srgb, var(--k-color) 24%, transparent)" stroke="var(--k-color)" strokeWidth={1.3} />
    <rect x="158" y="90" width="24" height="24" rx="3" fill="color-mix(in srgb, var(--k-color) 24%, transparent)" stroke="var(--k-color)" strokeWidth={1.3} />
    <g fill="var(--text-secondary)" opacity={0.55}>
      <circle cx="144" cy="48" r="2.1" /><circle cx="170" cy="48" r="2.1" />
      <circle cx="118" cy="75" r="2.1" /><circle cx="170" cy="75" r="2.1" />
      <circle cx="118" cy="102" r="2.1" /><circle cx="144" cy="102" r="2.1" />
    </g>
    <text x="90" y="140" fill="var(--text-secondary)" fontSize={11} style={{ fontFamily: "var(--font-mono)" }}>det · A⁻¹ · rango</text>
  </svg>
);

/** Círculo unitario → elipse con ejes σ: cómo una matriz estira el espacio. */
const PosterSvd = (
  <svg viewBox="0 0 288 150" fill="none">
    <circle cx="92" cy="72" r="32" stroke="var(--border)" strokeWidth={1.6} opacity={0.65} />
    <ellipse cx="198" cy="72" rx="48" ry="26" fill="color-mix(in srgb, var(--k-color) 12%, transparent)" stroke="var(--k-color)" strokeWidth={2} />
    <path d="M198 72 H246" stroke="var(--k-color)" strokeWidth={1.6} strokeLinecap="round" />
    <path d="M198 72 V46" stroke="var(--k-color)" strokeWidth={1.6} strokeLinecap="round" opacity={0.72} />
    <circle cx="198" cy="72" r="2.6" fill="var(--k-color)" />
    <path d="M132 72 H158 M151 66 L159 72 L151 78" stroke="var(--text-secondary)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" />
    <text x="145" y="63" fill="var(--text-secondary)" fontSize={10} textAnchor="middle" style={{ fontFamily: "var(--font-mono)" }}>A·x</text>
    <text x="228" y="66" fill="var(--k-color)" fontSize={11} style={{ fontFamily: "var(--font-mono)" }}>σ₁</text>
    <text x="203" y="44" fill="var(--k-color)" fontSize={11} style={{ fontFamily: "var(--font-mono)" }}>σ₂</text>
  </svg>
);

/* ──────────────────────────────────────────────────────────────────────────
   Export
   ────────────────────────────────────────────────────────────────────────── */

export default function MnaTools() {
  const tools: Tool[] = [
    {
      key: "matriz",
      label: "Calculadora",
      icon: "matrixRows",
      tone: "def",
      verb: "Calcular",
      desc: "Escribí una matriz y obtené al instante su determinante, inversa, rango y número de condición.",
      poster: PosterMatrix,
      node: <MatrixCalc />,
    },
    {
      key: "factor",
      label: "LU y QR",
      icon: "luFactor",
      tone: "def",
      verb: "Factorizar",
      desc: "Descompone la matriz en factores LU y QR: el paso previo para resolver sistemas y mínimos cuadrados.",
      node: <Factorizations />,
    },
    {
      key: "svd",
      label: "Autovalores y SVD",
      icon: "eigen",
      tone: "def",
      verb: "Descomponer",
      desc: "Autovalores, autovectores y valores singulares: cómo una matriz estira y rota el espacio.",
      poster: PosterSvd,
      node: <EigenSvd />,
    },
    {
      key: "ref",
      label: "Formulario",
      icon: "document",
      tone: "example",
      verb: "Consultar",
      desc: "Las fórmulas y definiciones clave del curso, a mano para repasar antes del parcial.",
      node: <Reference />,
    },
  ];

  return (
    <ToolkitShell
      launcher={{
        code: "SYS.01",
        kicker: "Álgebra lineal numérica",
        title: "Métodos Numéricos Avanzados",
        accent: "var(--link)",
        pattern: "grid",
        variant: "flat",
        dek: "Kit compacto de álgebra lineal: factorizaciones, autovalores y operaciones matriciales sobre matrices editables n×n. Todo se recalcula al instante.",
        meta: (
          <>
            <span className="tk__hero-metaitem">
              <b>4</b> herramientas
            </span>
            <span className="tk__hero-metaitem">kit único</span>
            <span className="tk__hero-metaitem">/mna/herramientas</span>
          </>
        ),
        motif: (
          <svg viewBox="0 0 320 200" fill="none">
            <path
              d="M62 22 L50 22 L50 158 L62 158"
              stroke="var(--border)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <path
              d="M210 22 L222 22 L222 158 L210 158"
              stroke="var(--border)"
              strokeWidth={2.5}
              strokeLinecap="round"
            />
            <rect x="76" y="30" width="30" height="30" fill="color-mix(in srgb, var(--accent) 30%, transparent)" stroke="var(--accent)" strokeWidth={1.2} />
            <rect x="76" y="60" width="30" height="30" fill="color-mix(in srgb, var(--link) 16%, transparent)" />
            <rect x="106" y="60" width="30" height="30" fill="color-mix(in srgb, var(--accent) 30%, transparent)" stroke="var(--accent)" strokeWidth={1.2} />
            <rect x="76" y="90" width="30" height="30" fill="color-mix(in srgb, var(--link) 16%, transparent)" />
            <rect x="106" y="90" width="30" height="30" fill="color-mix(in srgb, var(--link) 16%, transparent)" />
            <rect x="136" y="90" width="30" height="30" fill="color-mix(in srgb, var(--accent) 30%, transparent)" stroke="var(--accent)" strokeWidth={1.2} />
            <rect x="76" y="120" width="30" height="30" fill="color-mix(in srgb, var(--link) 16%, transparent)" />
            <rect x="106" y="120" width="30" height="30" fill="color-mix(in srgb, var(--link) 16%, transparent)" />
            <rect x="136" y="120" width="30" height="30" fill="color-mix(in srgb, var(--link) 16%, transparent)" />
            <rect x="166" y="120" width="30" height="30" fill="color-mix(in srgb, var(--accent) 30%, transparent)" stroke="var(--accent)" strokeWidth={1.2} />
            <g stroke="var(--hairline)" strokeWidth={1}>
              <line x1="76" y1="30" x2="76" y2="150" />
              <line x1="106" y1="30" x2="106" y2="150" />
              <line x1="136" y1="30" x2="136" y2="150" />
              <line x1="166" y1="30" x2="166" y2="150" />
              <line x1="196" y1="30" x2="196" y2="150" />
              <line x1="76" y1="30" x2="196" y2="30" />
              <line x1="76" y1="60" x2="196" y2="60" />
              <line x1="76" y1="90" x2="196" y2="90" />
              <line x1="76" y1="120" x2="196" y2="120" />
              <line x1="76" y1="150" x2="196" y2="150" />
            </g>
            <text x="50" y="16" fill="var(--text-secondary)" fontSize={11} style={{ fontFamily: "var(--font-mono)" }}>
              A
            </text>
            <text x="76" y="175" fill="var(--text-secondary)" fontSize={12} style={{ fontFamily: "var(--font-mono)" }}>
              A = L · U
            </text>
          </svg>
        ),
      }}
      tools={tools}
    />
  );
}
