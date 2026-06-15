// Álgebra lineal numérica para el toolkit de MNA (sin dependencias).
// Matrices = number[][] (fila-mayor). Funciones puras; toleran no-cuadradas
// donde tiene sentido. Pensadas para n ≤ ~6 (uso didáctico), priorizando
// claridad y correctitud sobre rendimiento. Coincide con los métodos del curso:
// LU/PLU (Doolittle con pivoteo parcial), QR (Gram–Schmidt), SVD vía Jacobi de AᵀA.

export type Mat = number[][];
export type Vec = number[];

const EPS = 1e-12;

export const rows = (A: Mat) => A.length;
export const cols = (A: Mat) => (A.length ? A[0].length : 0);
export const isSquare = (A: Mat) => rows(A) === cols(A) && rows(A) > 0;

export function clone(A: Mat): Mat {
  return A.map((r) => r.slice());
}

export function identity(n: number): Mat {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );
}

export function transpose(A: Mat): Mat {
  const m = rows(A);
  const n = cols(A);
  return Array.from({ length: n }, (_, j) =>
    Array.from({ length: m }, (_, i) => A[i][j]),
  );
}

export function multiply(A: Mat, B: Mat): Mat | null {
  if (cols(A) !== rows(B)) return null;
  const m = rows(A);
  const n = cols(B);
  const k = cols(A);
  const C: Mat = Array.from({ length: m }, () => new Array(n).fill(0));
  for (let i = 0; i < m; i++)
    for (let j = 0; j < n; j++) {
      let s = 0;
      for (let p = 0; p < k; p++) s += A[i][p] * B[p][j];
      C[i][j] = s;
    }
  return C;
}

export function matVec(A: Mat, x: Vec): Vec | null {
  if (cols(A) !== x.length) return null;
  return A.map((row) => row.reduce((s, v, j) => s + v * x[j], 0));
}

/** LU con pivoteo parcial (Doolittle): PA = LU. Devuelve también el nº de swaps. */
export function luDecompose(
  A: Mat,
): { L: Mat; U: Mat; P: Mat; perm: number[]; swaps: number } | null {
  if (!isSquare(A)) return null;
  const n = rows(A);
  const U = clone(A);
  const L = identity(n);
  const perm = Array.from({ length: n }, (_, i) => i);
  let swaps = 0;

  for (let k = 0; k < n; k++) {
    // pivoteo parcial: fila con mayor |U[i][k]|
    let piv = k;
    let best = Math.abs(U[k][k]);
    for (let i = k + 1; i < n; i++) {
      const v = Math.abs(U[i][k]);
      if (v > best) {
        best = v;
        piv = i;
      }
    }
    if (best < EPS) continue; // columna ~nula: matriz singular, seguimos
    if (piv !== k) {
      [U[k], U[piv]] = [U[piv], U[k]];
      [perm[k], perm[piv]] = [perm[piv], perm[k]];
      // permutar la parte ya construida de L (columnas < k)
      for (let j = 0; j < k; j++) [L[k][j], L[piv][j]] = [L[piv][j], L[k][j]];
      swaps++;
    }
    for (let i = k + 1; i < n; i++) {
      const f = U[i][k] / U[k][k];
      L[i][k] = f;
      for (let j = k; j < n; j++) U[i][j] -= f * U[k][j];
    }
  }

  const P = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (perm[i] === j ? 1 : 0)),
  );
  return { L, U, P, perm, swaps };
}

/** Determinante vía LU (∏ U_ii · (-1)^swaps). */
export function det(A: Mat): number | null {
  if (!isSquare(A)) return null;
  const lu = luDecompose(A);
  if (!lu) return null;
  let d = lu.swaps % 2 === 0 ? 1 : -1;
  for (let i = 0; i < rows(A); i++) d *= lu.U[i][i];
  return d;
}

/** Inversa vía Gauss–Jordan; null si es singular. */
export function inverse(A: Mat): Mat | null {
  if (!isSquare(A)) return null;
  const n = rows(A);
  const M = A.map((r, i) => [...r, ...identity(n)[i]]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    let best = Math.abs(M[col][col]);
    for (let i = col + 1; i < n; i++) {
      if (Math.abs(M[i][col]) > best) {
        best = Math.abs(M[i][col]);
        piv = i;
      }
    }
    if (best < EPS) return null;
    [M[col], M[piv]] = [M[piv], M[col]];
    const pivot = M[col][col];
    for (let j = 0; j < 2 * n; j++) M[col][j] /= pivot;
    for (let i = 0; i < n; i++) {
      if (i === col) continue;
      const f = M[i][col];
      if (f === 0) continue;
      for (let j = 0; j < 2 * n; j++) M[i][j] -= f * M[col][j];
    }
  }
  return M.map((r) => r.slice(n));
}

/** Rango por eliminación gaussiana con tolerancia relativa. */
export function rank(A: Mat, tol = 1e-9): number {
  const M = clone(A);
  const m = rows(M);
  const n = cols(M);
  let r = 0;
  for (let col = 0; col < n && r < m; col++) {
    let piv = r;
    let best = Math.abs(M[r][col]);
    for (let i = r + 1; i < m; i++) {
      if (Math.abs(M[i][col]) > best) {
        best = Math.abs(M[i][col]);
        piv = i;
      }
    }
    if (best < tol) continue;
    [M[r], M[piv]] = [M[piv], M[r]];
    for (let i = 0; i < m; i++) {
      if (i === r) continue;
      const f = M[i][col] / M[r][col];
      for (let j = col; j < n; j++) M[i][j] -= f * M[r][j];
    }
    r++;
  }
  return r;
}

/** QR por Gram–Schmidt modificado (columnas de A). Q ortonormal, R triangular sup. */
export function qrGramSchmidt(A: Mat): { Q: Mat; R: Mat } | null {
  const m = rows(A);
  const n = cols(A);
  if (m === 0 || n === 0 || m < n) return null;
  const At = transpose(A); // At[j] = columna j
  const Q: Vec[] = [];
  const R: Mat = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) {
    let v = At[j].slice();
    for (let i = 0; i < j; i++) {
      const rij = dot(Q[i], At[j]);
      R[i][j] = rij;
      v = v.map((vk, k) => vk - rij * Q[i][k]);
    }
    const norm = Math.hypot(...v);
    R[j][j] = norm;
    Q.push(norm < EPS ? v.map(() => 0) : v.map((vk) => vk / norm));
  }
  return { Q: transpose(Q), R };
}

export function dot(a: Vec, b: Vec): number {
  return a.reduce((s, v, i) => s + v * b[i], 0);
}

export const norm2Vec = (v: Vec) => Math.hypot(...v);

/** Norma de Frobenius. */
export function frobenius(A: Mat): number {
  let s = 0;
  for (const row of A) for (const v of row) s += v * v;
  return Math.sqrt(s);
}

/** Norma 1 (máx suma de columnas) e ∞ (máx suma de filas). */
export function norm1(A: Mat): number {
  const n = cols(A);
  let best = 0;
  for (let j = 0; j < n; j++) {
    let s = 0;
    for (let i = 0; i < rows(A); i++) s += Math.abs(A[i][j]);
    best = Math.max(best, s);
  }
  return best;
}
export function normInf(A: Mat): number {
  let best = 0;
  for (const row of A) best = Math.max(best, row.reduce((s, v) => s + Math.abs(v), 0));
  return best;
}

/**
 * Jacobi cíclico para matrices SIMÉTRICAS: autovalores reales + autovectores
 * ortonormales (columnas de V). Robusto para n ≤ ~8.
 */
export function jacobiEigenSymmetric(
  S: Mat,
  maxSweeps = 100,
): { values: number[]; vectors: Mat } {
  const n = rows(S);
  const a = clone(S);
  const V = identity(n);
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += a[p][q] * a[p][q];
    if (off < 1e-24) break;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(a[p][q]) < 1e-18) continue;
        const theta = (a[q][q] - a[p][p]) / (2 * a[p][q]);
        const t =
          Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let i = 0; i < n; i++) {
          const aip = a[i][p];
          const aiq = a[i][q];
          a[i][p] = c * aip - s * aiq;
          a[i][q] = s * aip + c * aiq;
        }
        for (let i = 0; i < n; i++) {
          const api = a[p][i];
          const aqi = a[q][i];
          a[p][i] = c * api - s * aqi;
          a[q][i] = s * api + c * aqi;
        }
        for (let i = 0; i < n; i++) {
          const vip = V[i][p];
          const viq = V[i][q];
          V[i][p] = c * vip - s * viq;
          V[i][q] = s * vip + c * viq;
        }
      }
    }
  }
  const values = a.map((_, i) => a[i][i]);
  return { values, vectors: V };
}

/**
 * SVD didáctica vía Jacobi de AᵀA (el método del curso): A = U Σ Vᵀ.
 * Devuelve valores singulares descendentes y matrices U (m×r), V (n×r).
 */
export function svd(
  A: Mat,
): { U: Mat; S: number[]; V: Mat } | null {
  const m = rows(A);
  const n = cols(A);
  if (m === 0 || n === 0) return null;
  const AtA = multiply(transpose(A), A); // n×n simétrica
  if (!AtA) return null;
  const { values, vectors } = jacobiEigenSymmetric(AtA);
  // ordenar por valor singular descendente
  const idx = values
    .map((v, i) => i)
    .sort((i, j) => values[j] - values[i]);
  const sigmas = idx.map((i) => Math.sqrt(Math.max(0, values[i])));
  const Vcols = idx.map((i) => vectors.map((row) => row[i])); // cada uno length n
  // U_k = A v_k / σ_k
  const Ucols: Vec[] = Vcols.map((v, k) => {
    const av = matVec(A, v)!;
    const s = sigmas[k];
    return s > 1e-12 ? av.map((x) => x / s) : av.map(() => 0);
  });
  return {
    U: transpose(Ucols),
    S: sigmas,
    V: transpose(Vcols),
  };
}

/** Número de condición 2-norma = σ_max / σ_min (Infinity si singular). */
export function cond2(A: Mat): number | null {
  const s = svd(A);
  if (!s) return null;
  const nz = s.S.filter((x) => x > 1e-12);
  if (!nz.length) return Infinity;
  const smin = s.S[s.S.length - 1];
  return smin < 1e-12 ? Infinity : s.S[0] / smin;
}

/** Autovalores de una 2×2 (posiblemente complejos): λ = t/2 ± sqrt(d). */
export function eig2x2(
  A: Mat,
): { re: number; im: number }[] {
  const [a, b] = A[0];
  const [c, d] = A[1];
  const tr = a + d;
  const det2 = a * d - b * c;
  const disc = (tr * tr) / 4 - det2;
  if (disc >= 0) {
    const r = Math.sqrt(disc);
    return [
      { re: tr / 2 + r, im: 0 },
      { re: tr / 2 - r, im: 0 },
    ];
  }
  const r = Math.sqrt(-disc);
  return [
    { re: tr / 2, im: r },
    { re: tr / 2, im: -r },
  ];
}

/** Formatea un número para mostrar: recorta ruido flotante, ~4 sig. */
export function fmt(x: number, dp = 4): string {
  if (!isFinite(x)) return x > 0 ? "∞" : "−∞";
  if (Math.abs(x) < 1e-10) return "0";
  const r = Number(x.toFixed(dp));
  return Object.is(r, -0) ? "0" : String(r);
}
