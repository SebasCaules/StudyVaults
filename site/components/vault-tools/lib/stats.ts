// Probabilidad y estadística para el toolkit de Proba (sin dependencias).
// Distribuciones (PMF/PDF, CDF, cuantil), normal estándar (Φ y Φ⁻¹) de alta
// precisión, y estadística descriptiva. Funciones puras. Correctitud > velocidad.

/* ---------- núcleo: erf, gamma, combinatoria ---------- */

// erf por aproximación de Abramowitz & Stegun 7.1.26 (|error| ≤ 1.5e-7).
export function erf(x: number): number {
  const sign = Math.sign(x);
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax);
  return sign * y;
}

// ln Γ(x) — Lanczos g=7, n=9 (estable para combinatoria de n grande).
const LG = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];
export function logGamma(x: number): number {
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - logGamma(1 - x);
  x -= 1;
  let a = LG[0];
  const t = x + 7.5;
  for (let i = 1; i < 9; i++) a += LG[i] / (x + i);
  return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

export const logFactorial = (n: number) => logGamma(n + 1);
export function logChoose(n: number, k: number): number {
  if (k < 0 || k > n) return -Infinity;
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
}
export const choose = (n: number, k: number) => Math.round(Math.exp(logChoose(n, k)));

/* ---------- normal estándar ---------- */

export const normalPdf = (z: number, mu = 0, sigma = 1) =>
  Math.exp(-((z - mu) ** 2) / (2 * sigma * sigma)) / (sigma * Math.sqrt(2 * Math.PI));

/** Φ: CDF normal. */
export const normalCdf = (x: number, mu = 0, sigma = 1) =>
  0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)));

/**
 * Φ⁻¹: cuantil normal estándar inverso (algoritmo de Acklam, |error| ~1e-9).
 * p ∈ (0,1). Devuelve mu + sigma·z.
 */
export function normalQuantile(p: number, mu = 0, sigma = 1): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2,
    1.38357751867269e2, -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2,
    6.680131188771972e1, -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838,
    -2.549732539343734, 4.374664141464968, 2.938163982698783,
  ];
  const d = [
    7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996,
    3.754408661907416,
  ];
  const plow = 0.02425;
  const phigh = 1 - plow;
  let z: number;
  if (p < plow) {
    const q = Math.sqrt(-2 * Math.log(p));
    z =
      (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  } else if (p <= phigh) {
    const q = p - 0.5;
    const r = q * q;
    z =
      ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) /
      (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  } else {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    z =
      -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
      ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  return mu + sigma * z;
}

/* ---------- distribuciones ---------- */
// Cada una expone {pmf|pdf, cdf, mean, variance, support}. Discretas → pmf.

export interface DistInfo {
  discrete: boolean;
  mean: number;
  variance: number;
  // soporte aproximado para graficar [lo, hi]
  support: [number, number];
}

export const binomial = (n: number, p: number) => ({
  discrete: true,
  pmf: (k: number) =>
    k < 0 || k > n || !Number.isInteger(k)
      ? 0
      : Math.exp(logChoose(n, k) + k * Math.log(p) + (n - k) * Math.log(1 - p)),
  cdf: (k: number) => {
    let s = 0;
    const kk = Math.floor(k);
    for (let i = 0; i <= kk; i++)
      s += Math.exp(logChoose(n, i) + i * Math.log(p) + (n - i) * Math.log(1 - p));
    return Math.min(1, s);
  },
  mean: n * p,
  variance: n * p * (1 - p),
  support: [0, n] as [number, number],
});

export const poisson = (lambda: number) => ({
  discrete: true,
  pmf: (k: number) =>
    k < 0 || !Number.isInteger(k)
      ? 0
      : Math.exp(-lambda + k * Math.log(lambda) - logFactorial(k)),
  cdf: (k: number) => {
    let s = 0;
    const kk = Math.floor(k);
    for (let i = 0; i <= kk; i++)
      s += Math.exp(-lambda + i * Math.log(lambda) - logFactorial(i));
    return Math.min(1, s);
  },
  mean: lambda,
  variance: lambda,
  support: [0, Math.max(10, Math.ceil(lambda + 4 * Math.sqrt(lambda)))] as [
    number,
    number,
  ],
});

// geométrica: nº de ensayos hasta el primer éxito, k = 1,2,...
export const geometric = (p: number) => ({
  discrete: true,
  pmf: (k: number) =>
    k < 1 || !Number.isInteger(k) ? 0 : Math.pow(1 - p, k - 1) * p,
  cdf: (k: number) => (k < 1 ? 0 : 1 - Math.pow(1 - p, Math.floor(k))),
  mean: 1 / p,
  variance: (1 - p) / (p * p),
  support: [1, Math.max(10, Math.ceil(Math.log(0.01) / Math.log(1 - p)))] as [
    number,
    number,
  ],
});

export const uniformDisc = (a: number, b: number) => {
  const n = b - a + 1;
  return {
    discrete: true,
    pmf: (k: number) => (k >= a && k <= b && Number.isInteger(k) ? 1 / n : 0),
    cdf: (k: number) =>
      k < a ? 0 : k >= b ? 1 : (Math.floor(k) - a + 1) / n,
    mean: (a + b) / 2,
    variance: (n * n - 1) / 12,
    support: [a, b] as [number, number],
  };
};

export const normal = (mu: number, sigma: number) => ({
  discrete: false,
  pdf: (x: number) => normalPdf(x, mu, sigma),
  cdf: (x: number) => normalCdf(x, mu, sigma),
  quantile: (p: number) => normalQuantile(p, mu, sigma),
  mean: mu,
  variance: sigma * sigma,
  support: [mu - 4 * sigma, mu + 4 * sigma] as [number, number],
});

export const exponential = (lambda: number) => ({
  discrete: false,
  pdf: (x: number) => (x < 0 ? 0 : lambda * Math.exp(-lambda * x)),
  cdf: (x: number) => (x < 0 ? 0 : 1 - Math.exp(-lambda * x)),
  quantile: (p: number) => -Math.log(1 - p) / lambda,
  mean: 1 / lambda,
  variance: 1 / (lambda * lambda),
  support: [0, 6 / lambda] as [number, number],
});

export const uniformCont = (a: number, b: number) => ({
  discrete: false,
  pdf: (x: number) => (x >= a && x <= b ? 1 / (b - a) : 0),
  cdf: (x: number) => (x < a ? 0 : x > b ? 1 : (x - a) / (b - a)),
  quantile: (p: number) => a + p * (b - a),
  mean: (a + b) / 2,
  variance: (b - a) ** 2 / 12,
  support: [a, b] as [number, number],
});

/* ---------- estadística descriptiva ---------- */

export function parseNumbers(text: string): number[] {
  return text
    .split(/[\s,;]+/)
    .map((t) => t.trim())
    .filter(Boolean)
    .map(Number)
    .filter((x) => Number.isFinite(x));
}

export function mean(xs: number[]): number {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : NaN;
}

/** Cuantil por interpolación lineal (método 7 de R, el usual). */
export function quantile(sorted: number[], q: number): number {
  if (!sorted.length) return NaN;
  if (sorted.length === 1) return sorted[0];
  const h = (sorted.length - 1) * q;
  const lo = Math.floor(h);
  const hi = Math.ceil(h);
  return sorted[lo] + (h - lo) * (sorted[hi] - sorted[lo]);
}

export interface Describe {
  n: number;
  mean: number;
  median: number;
  q1: number;
  q3: number;
  min: number;
  max: number;
  range: number;
  varSample: number;
  varPop: number;
  sdSample: number;
  sdPop: number;
}

export function describe(xs: number[]): Describe | null {
  const n = xs.length;
  if (!n) return null;
  const sorted = [...xs].sort((a, b) => a - b);
  const m = mean(xs);
  const ssq = xs.reduce((s, x) => s + (x - m) ** 2, 0);
  const varPop = ssq / n;
  const varSample = n > 1 ? ssq / (n - 1) : 0;
  return {
    n,
    mean: m,
    median: quantile(sorted, 0.5),
    q1: quantile(sorted, 0.25),
    q3: quantile(sorted, 0.75),
    min: sorted[0],
    max: sorted[n - 1],
    range: sorted[n - 1] - sorted[0],
    varSample,
    varPop,
    sdSample: Math.sqrt(varSample),
    sdPop: Math.sqrt(varPop),
  };
}

/** Histograma: cuenta por bins de igual ancho. */
export function histogram(
  xs: number[],
  bins: number,
): { lo: number; hi: number; count: number }[] {
  if (!xs.length) return [];
  const min = Math.min(...xs);
  const max = Math.max(...xs);
  if (min === max) return [{ lo: min, hi: max, count: xs.length }];
  const w = (max - min) / bins;
  const out = Array.from({ length: bins }, (_, i) => ({
    lo: min + i * w,
    hi: min + (i + 1) * w,
    count: 0,
  }));
  for (const x of xs) {
    let b = Math.floor((x - min) / w);
    if (b >= bins) b = bins - 1;
    out[b].count++;
  }
  return out;
}

export function fmt(x: number, dp = 4): string {
  if (!isFinite(x)) return x > 0 ? "∞" : "−∞";
  if (Number.isNaN(x)) return "—";
  if (Math.abs(x) < 1e-12) return "0";
  const r = Number(x.toFixed(dp));
  return Object.is(r, -0) ? "0" : String(r);
}
