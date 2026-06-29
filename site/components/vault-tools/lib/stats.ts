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

/* ============================================================================
 * EXTENSIONES — toolkit ampliado de Proba (unidades 2–9)
 *
 * Funciones especiales (gamma/beta incompletas regularizadas), distribuciones
 * adicionales del programa (Bernoulli, binomial negativa, hipergeométrica,
 * gamma/Erlang, ji-cuadrado, t de Student), cuantiles por bisección y
 * combinatoria de conteo. Todo funciones puras; correctitud > velocidad.
 *
 * Convenciones de la cátedra (ver wiki):
 *  - geométrica y binomial negativa cuentan FRACASOS (soporte ℕ₀) por defecto;
 *    `geometric` (arriba) es la versión "nº de ensayos" (ℕ). Acá sumamos
 *    `geometricFailures` y `binomialNegative` con la convención de fracasos.
 * ========================================================================== */

/* ---------- funciones especiales: gamma y beta incompletas ---------- */

const SF_ITMAX = 300;
const SF_FPMIN = 1e-300;
const SF_EPS = 1e-14;

// Serie de potencias para P(a,x) — válida para x < a+1 (Numerical Recipes §6.2).
function gammaPSeries(a: number, x: number): number {
  if (x <= 0) return 0;
  let ap = a;
  let del = 1 / a;
  let sum = del;
  for (let n = 0; n < SF_ITMAX; n++) {
    ap += 1;
    del *= x / ap;
    sum += del;
    if (Math.abs(del) < Math.abs(sum) * SF_EPS) break;
  }
  return sum * Math.exp(-x + a * Math.log(x) - logGamma(a));
}

// Fracción continua para Q(a,x)=1−P(a,x) — válida para x ≥ a+1 (NR §6.2).
function gammaQContinuedFraction(a: number, x: number): number {
  let b = x + 1 - a;
  let c = 1 / SF_FPMIN;
  let d = 1 / b;
  let h = d;
  for (let i = 1; i < SF_ITMAX; i++) {
    const an = -i * (i - a);
    b += 2;
    d = an * d + b;
    if (Math.abs(d) < SF_FPMIN) d = SF_FPMIN;
    c = b + an / c;
    if (Math.abs(c) < SF_FPMIN) c = SF_FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < SF_EPS) break;
  }
  return Math.exp(-x + a * Math.log(x) - logGamma(a)) * h;
}

/** P(a,x): gamma incompleta regularizada inferior γ(a,x)/Γ(a) (a>0, x≥0). */
export function gammaPRegularized(a: number, x: number): number {
  if (x <= 0 || a <= 0) return 0;
  return x < a + 1 ? gammaPSeries(a, x) : 1 - gammaQContinuedFraction(a, x);
}

// Fracción continua de Lentz para I_x(a,b) (NR §6.4 betacf).
function betaContinuedFraction(x: number, a: number, b: number): number {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < SF_FPMIN) d = SF_FPMIN;
  d = 1 / d;
  let h = d;
  for (let m = 1; m < SF_ITMAX; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < SF_FPMIN) d = SF_FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < SF_FPMIN) c = SF_FPMIN;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < SF_FPMIN) d = SF_FPMIN;
    c = 1 + aa / c;
    if (Math.abs(c) < SF_FPMIN) c = SF_FPMIN;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < SF_EPS) break;
  }
  return h;
}

/** I_x(a,b): beta incompleta regularizada (x∈[0,1], a,b>0). */
export function betaIRegularized(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const lfront =
    logGamma(a + b) -
    logGamma(a) -
    logGamma(b) +
    a * Math.log(x) +
    b * Math.log(1 - x);
  const front = Math.exp(lfront);
  if (x < (a + 1) / (a + b + 2)) {
    return (front * betaContinuedFraction(x, a, b)) / a;
  }
  return 1 - (front * betaContinuedFraction(1 - x, b, a)) / b;
}

// Bisección genérica sobre una CDF monótona: devuelve x con cdf(x)=p.
function bisectQuantile(
  cdf: (x: number) => number,
  p: number,
  lo: number,
  hi: number,
): number {
  let a = lo;
  let b = hi;
  // expandir el extremo superior hasta cubrir p
  for (let i = 0; i < 200 && cdf(b) < p; i++) b += b - a || 1;
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (a + b);
    if (cdf(m) < p) a = m;
    else b = m;
  }
  return 0.5 * (a + b);
}

/* ---------- ji-cuadrado, gamma/Erlang, t de Student (pdf/cdf/cuantil) ---------- */

export const gammaPdf = (x: number, alpha: number, lambda: number) =>
  x <= 0
    ? 0
    : Math.exp(
        alpha * Math.log(lambda) +
          (alpha - 1) * Math.log(x) -
          lambda * x -
          logGamma(alpha),
      );
export const gammaCdf = (x: number, alpha: number, lambda: number) =>
  x <= 0 ? 0 : gammaPRegularized(alpha, lambda * x);

export const chiSquarePdf = (x: number, k: number) => gammaPdf(x, k / 2, 0.5);
export const chiSquareCdf = (x: number, k: number) =>
  x <= 0 ? 0 : gammaPRegularized(k / 2, x / 2);

export const studentTPdf = (t: number, df: number) =>
  Math.exp(
    logGamma((df + 1) / 2) -
      logGamma(df / 2) -
      0.5 * Math.log(df * Math.PI),
  ) * Math.pow(1 + (t * t) / df, -(df + 1) / 2);
export const studentTCdf = (t: number, df: number) => {
  const x = df / (df + t * t);
  const ib = 0.5 * betaIRegularized(x, df / 2, 0.5);
  return t > 0 ? 1 - ib : ib;
};

/** Cuantil t de Student F⁻¹(p) con df g.l. (p∈(0,1)); simétrico en 0. */
export function studentTQuantile(p: number, df: number): number {
  if (p <= 0) return -Infinity;
  if (p >= 1) return Infinity;
  if (p === 0.5) return 0;
  const cdf = (t: number) => studentTCdf(t, df);
  let lo = -1;
  let hi = 1;
  while (cdf(lo) > p) lo *= 2;
  while (cdf(hi) < p) hi *= 2;
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (lo + hi);
    if (cdf(m) < p) lo = m;
    else hi = m;
  }
  return 0.5 * (lo + hi);
}

/** Cuantil ji-cuadrado F⁻¹(p) con k g.l. (p∈(0,1)). */
export function chiSquareQuantile(p: number, k: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  return bisectQuantile((x) => chiSquareCdf(x, k), p, 0, Math.max(10, 2 * k));
}

/** Cuantil Gamma(α,λ) F⁻¹(p) (p∈(0,1)). */
export function gammaQuantile(p: number, alpha: number, lambda: number): number {
  if (p <= 0) return 0;
  if (p >= 1) return Infinity;
  return bisectQuantile(
    (x) => gammaCdf(x, alpha, lambda),
    p,
    0,
    Math.max(1, (alpha + 4 * Math.sqrt(alpha)) / lambda),
  );
}

/* ---------- distribuciones adicionales (mismo shape {pmf|pdf,cdf,mean,…}) ---------- */

// Bernoulli(p): un ensayo éxito/fracaso. Soporte {0,1}.
export const bernoulli = (p: number) => ({
  discrete: true,
  pmf: (k: number) => (k === 0 ? 1 - p : k === 1 ? p : 0),
  cdf: (k: number) => (k < 0 ? 0 : k < 1 ? 1 - p : 1),
  mean: p,
  variance: p * (1 - p),
  support: [0, 1] as [number, number],
});

// Geométrica — convención "nº de fracasos" antes del 1.er éxito (ℕ₀): E=q/p.
export const geometricFailures = (p: number) => ({
  discrete: true,
  pmf: (k: number) =>
    k < 0 || !Number.isInteger(k) ? 0 : Math.pow(1 - p, k) * p,
  cdf: (k: number) => (k < 0 ? 0 : 1 - Math.pow(1 - p, Math.floor(k) + 1)),
  mean: (1 - p) / p,
  variance: (1 - p) / (p * p),
  support: [0, Math.max(10, Math.ceil(Math.log(0.01) / Math.log(1 - p)))] as [
    number,
    number,
  ],
});

// Binomial negativa (Pascal) — "nº de fracasos" antes del r-ésimo éxito (ℕ₀).
export const binomialNegative = (r: number, p: number) => {
  const mean = (r * (1 - p)) / p;
  const variance = (r * (1 - p)) / (p * p);
  return {
    discrete: true,
    pmf: (k: number) =>
      k < 0 || !Number.isInteger(k)
        ? 0
        : Math.exp(
            logChoose(k + r - 1, k) + r * Math.log(p) + k * Math.log(1 - p),
          ),
    cdf: (k: number) => {
      if (k < 0) return 0;
      let s = 0;
      const kk = Math.floor(k);
      for (let i = 0; i <= kk; i++)
        s += Math.exp(
          logChoose(i + r - 1, i) + r * Math.log(p) + i * Math.log(1 - p),
        );
      return Math.min(1, s);
    },
    mean,
    variance,
    support: [0, Math.max(10, Math.ceil(mean + 4 * Math.sqrt(variance)))] as [
      number,
      number,
    ],
  };
};

// Hipergeométrica(N,K,n): muestreo SIN reposición. K éxitos en la población.
export const hypergeometric = (N: number, K: number, n: number) => {
  const lo = Math.max(0, n - (N - K));
  const hi = Math.min(n, K);
  return {
    discrete: true,
    pmf: (k: number) =>
      k < lo || k > hi || !Number.isInteger(k)
        ? 0
        : Math.exp(
            logChoose(K, k) + logChoose(N - K, n - k) - logChoose(N, n),
          ),
    cdf: (k: number) => {
      if (k < lo) return 0;
      let s = 0;
      const kk = Math.min(hi, Math.floor(k));
      for (let i = lo; i <= kk; i++)
        s += Math.exp(
          logChoose(K, i) + logChoose(N - K, n - i) - logChoose(N, n),
        );
      return Math.min(1, s);
    },
    mean: (n * K) / N,
    variance: n * (K / N) * (1 - K / N) * ((N - n) / (N - 1)),
    support: [lo, hi] as [number, number],
  };
};

// Gamma(α,λ): forma α, tasa λ. cdf vía gamma incompleta regularizada.
export const gamma = (alpha: number, lambda: number) => ({
  discrete: false,
  pdf: (x: number) => gammaPdf(x, alpha, lambda),
  cdf: (x: number) => gammaCdf(x, alpha, lambda),
  quantile: (p: number) => gammaQuantile(p, alpha, lambda),
  mean: alpha / lambda,
  variance: alpha / (lambda * lambda),
  support: [0, (alpha + 5 * Math.sqrt(alpha) + 1) / lambda] as [number, number],
});

// Erlang(k,λ): Gamma de forma entera = tiempo de la k-ésima ocurrencia Poisson.
export const erlang = (k: number, lambda: number) => gamma(k, lambda);

// Ji-cuadrado con k grados de libertad = Gamma(k/2, 1/2).
export const chiSquare = (k: number) => ({
  discrete: false,
  pdf: (x: number) => chiSquarePdf(x, k),
  cdf: (x: number) => chiSquareCdf(x, k),
  quantile: (p: number) => chiSquareQuantile(p, k),
  mean: k,
  variance: 2 * k,
  support: [0, k + 5 * Math.sqrt(2 * k) + 2] as [number, number],
});

// t de Student con df grados de libertad. Simétrica; colas pesadas.
export const studentT = (df: number) => ({
  discrete: false,
  pdf: (t: number) => studentTPdf(t, df),
  cdf: (t: number) => studentTCdf(t, df),
  quantile: (p: number) => studentTQuantile(p, df),
  mean: df > 1 ? 0 : NaN,
  variance: df > 2 ? df / (df - 2) : df > 1 ? Infinity : NaN,
  support: [
    -Math.max(4, studentTQuantile(0.999, df)),
    Math.max(4, studentTQuantile(0.999, df)),
  ] as [number, number],
});

/* ---------- combinatoria de conteo (unidad 2) ---------- */

/** n! exacto (n entero ≥0); Infinity si n>170 (overflow de doble). */
export function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) return NaN;
  if (n > 170) return Infinity;
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}

/** Variaciones (permutaciones de k de n, ORDEN importa, SIN repetición): n!/(n−k)!. */
export function permutations(n: number, k: number): number {
  if (n < 0 || k < 0 || k > n || !Number.isInteger(n) || !Number.isInteger(k))
    return NaN;
  return Math.round(Math.exp(logFactorial(n) - logFactorial(n - k)));
}

/** Variaciones CON repetición: nᵏ. */
export function variationsWithRep(n: number, k: number): number {
  if (n < 0 || k < 0) return NaN;
  return Math.pow(n, k);
}

/** Combinaciones CON repetición: C(n+k−1, k). */
export function combinationsWithRep(n: number, k: number): number {
  if (n < 0 || k < 0 || !Number.isInteger(n) || !Number.isInteger(k))
    return NaN;
  return choose(n + k - 1, k);
}
