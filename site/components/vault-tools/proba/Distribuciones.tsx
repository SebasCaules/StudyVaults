"use client";

import { useMemo, useState } from "react";
import {
  Panel,
  SubPanel,
  Note,
  Field,
  TextInput,
  Select,
  Chip,
} from "@studyvaults/ui";
import {
  normal,
  binomial,
  poisson,
  geometric,
  geometricFailures,
  uniformDisc,
  uniformCont,
  exponential,
  bernoulli,
  binomialNegative,
  hypergeometric,
  gamma,
  erlang,
  chiSquare,
  studentT,
  fmt,
} from "../lib/stats";
import { PlotFrame, PlotLegend, polyline } from "./plot";

/* ============================================================================
 * Distribuciones — explorador ampliado
 *
 * Calculadora pura: elegís una distribución, ajustás parámetros y leés
 * momentos (E[X]/Var/σ/tipo), probabilidades P(X≤x)/P(X≥x)/P(a≤X≤b) y el
 * gráfico PMF/PDF + CDF. Todo se monta sobre el shape estándar de stats.ts
 * ({ discrete, pmf|pdf, cdf, mean, variance, support }) y dibuja con el frame
 * compartido de ./plot. Sin window/localStorage: estado en useState.
 * ========================================================================== */

// Parser numérico tolerante con coma o punto; fallback ante entrada vacía.
function num(s: string, fallback = NaN): number {
  if (s.trim() === "") return fallback;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

type DistKey =
  | "normal"
  | "binomial"
  | "poisson"
  | "geometric"
  | "uniformDisc"
  | "exponential"
  | "bernoulli"
  | "binomialNegative"
  | "hypergeometric"
  | "uniformCont"
  | "gamma"
  | "erlang"
  | "chiSquare"
  | "studentT";

const DIST_LABELS: Record<DistKey, string> = {
  normal: "Normal (μ, σ)",
  binomial: "Binomial (n, p)",
  poisson: "Poisson (λ)",
  geometric: "Geométrica (p)",
  uniformDisc: "Uniforme discreta (a, b)",
  exponential: "Exponencial (λ)",
  bernoulli: "Bernoulli (p)",
  binomialNegative: "Binomial negativa (r, p)",
  hypergeometric: "Hipergeométrica (N, K, n)",
  uniformCont: "Uniforme continua (a, b)",
  gamma: "Gamma (α, λ)",
  erlang: "Erlang (k, λ)",
  chiSquare: "Ji-cuadrado (df)",
  studentT: "t de Student (df)",
};

// Distribución estándar devuelta por las factorías de stats.ts.
type Dist = {
  discrete: boolean;
  pmf?: (k: number) => number;
  pdf?: (x: number) => number;
  cdf: (x: number) => number;
  mean: number;
  variance: number;
  support: [number, number];
};

type Built = { dist: Dist } | { err: string };

export default function DistribucionesTool() {
  const [kind, setKind] = useState<DistKey>("normal");
  // Convención de la geométrica: "fracasos" ℕ₀ (default cátedra) o "ensayos" ℕ.
  const [geoMode, setGeoMode] = useState<"failures" | "trials">("failures");

  // Parámetros (strings para tolerar edición parcial).
  const [mu, setMu] = useState("0");
  const [sigma, setSigma] = useState("1");
  const [n, setN] = useState("10");
  const [p, setP] = useState("0.5");
  const [lambda, setLambda] = useState("2");
  const [a, setA] = useState("1");
  const [b, setB] = useState("6");
  const [pGeo, setPGeo] = useState("0.3");
  const [pBer, setPBer] = useState("0.5");
  const [rNeg, setRNeg] = useState("3");
  const [pNeg, setPNeg] = useState("0.4");
  const [bigN, setBigN] = useState("20");
  const [bigK, setBigK] = useState("7");
  const [smallN, setSmallN] = useState("5");
  const [aCont, setACont] = useState("0");
  const [bCont, setBCont] = useState("1");
  const [alpha, setAlpha] = useState("2");
  const [lamG, setLamG] = useState("1");
  const [kErl, setKErl] = useState("3");
  const [lamErl, setLamErl] = useState("1");
  const [dfChi, setDfChi] = useState("4");
  const [dfT, setDfT] = useState("5");

  // Calculadora.
  const [xVal, setXVal] = useState("0");
  const [aVal, setAVal] = useState("-1");
  const [bVal, setBVal] = useState("1");

  const built: Built = useMemo(() => {
    try {
      switch (kind) {
        case "normal": {
          const m = num(mu);
          const s = num(sigma);
          if (!Number.isFinite(m) || !Number.isFinite(s))
            return { err: "Ingresá μ y σ numéricos." };
          if (s <= 0) return { err: "σ debe ser mayor que 0." };
          return { dist: normal(m, s) };
        }
        case "binomial": {
          const nn = num(n);
          const pp = num(p);
          if (!Number.isFinite(nn) || !Number.isFinite(pp))
            return { err: "Ingresá n y p numéricos." };
          if (!Number.isInteger(nn) || nn < 0)
            return { err: "n debe ser un entero ≥ 0." };
          if (pp <= 0 || pp >= 1) return { err: "p debe estar en (0, 1)." };
          return { dist: binomial(nn, pp) };
        }
        case "poisson": {
          const l = num(lambda);
          if (!Number.isFinite(l)) return { err: "Ingresá λ numérico." };
          if (l <= 0) return { err: "λ debe ser mayor que 0." };
          return { dist: poisson(l) };
        }
        case "geometric": {
          const pp = num(pGeo);
          if (!Number.isFinite(pp)) return { err: "Ingresá p numérico." };
          if (pp <= 0 || pp >= 1) return { err: "p debe estar en (0, 1)." };
          return {
            dist: geoMode === "failures" ? geometricFailures(pp) : geometric(pp),
          };
        }
        case "uniformDisc": {
          const aa = num(a);
          const bb = num(b);
          if (!Number.isFinite(aa) || !Number.isFinite(bb))
            return { err: "Ingresá a y b numéricos." };
          if (!Number.isInteger(aa) || !Number.isInteger(bb))
            return { err: "a y b deben ser enteros." };
          if (bb < aa) return { err: "Se requiere a ≤ b." };
          return { dist: uniformDisc(aa, bb) };
        }
        case "exponential": {
          const l = num(lambda);
          if (!Number.isFinite(l)) return { err: "Ingresá λ numérico." };
          if (l <= 0) return { err: "λ debe ser mayor que 0." };
          return { dist: exponential(l) };
        }
        case "bernoulli": {
          const pp = num(pBer);
          if (!Number.isFinite(pp)) return { err: "Ingresá p numérico." };
          if (pp < 0 || pp > 1) return { err: "p debe estar en [0, 1]." };
          return { dist: bernoulli(pp) };
        }
        case "binomialNegative": {
          const r = num(rNeg);
          const pp = num(pNeg);
          if (!Number.isFinite(r) || !Number.isFinite(pp))
            return { err: "Ingresá r y p numéricos." };
          if (!Number.isInteger(r) || r < 1)
            return { err: "r debe ser un entero ≥ 1." };
          if (pp <= 0 || pp >= 1) return { err: "p debe estar en (0, 1)." };
          return { dist: binomialNegative(r, pp) };
        }
        case "hypergeometric": {
          const N = num(bigN);
          const K = num(bigK);
          const nn = num(smallN);
          if (!Number.isFinite(N) || !Number.isFinite(K) || !Number.isFinite(nn))
            return { err: "Ingresá N, K y n numéricos." };
          if (!Number.isInteger(N) || !Number.isInteger(K) || !Number.isInteger(nn))
            return { err: "N, K y n deben ser enteros." };
          if (N < 1) return { err: "N debe ser ≥ 1." };
          if (K < 0 || K > N) return { err: "Se requiere 0 ≤ K ≤ N." };
          if (nn < 0 || nn > N) return { err: "Se requiere 0 ≤ n ≤ N." };
          return { dist: hypergeometric(N, K, nn) };
        }
        case "uniformCont": {
          const aa = num(aCont);
          const bb = num(bCont);
          if (!Number.isFinite(aa) || !Number.isFinite(bb))
            return { err: "Ingresá a y b numéricos." };
          if (bb <= aa) return { err: "Se requiere a < b." };
          return { dist: uniformCont(aa, bb) };
        }
        case "gamma": {
          const al = num(alpha);
          const l = num(lamG);
          if (!Number.isFinite(al) || !Number.isFinite(l))
            return { err: "Ingresá α y λ numéricos." };
          if (al <= 0) return { err: "α debe ser mayor que 0." };
          if (l <= 0) return { err: "λ debe ser mayor que 0." };
          return { dist: gamma(al, l) };
        }
        case "erlang": {
          const k = num(kErl);
          const l = num(lamErl);
          if (!Number.isFinite(k) || !Number.isFinite(l))
            return { err: "Ingresá k y λ numéricos." };
          if (!Number.isInteger(k) || k < 1)
            return { err: "k debe ser un entero ≥ 1." };
          if (l <= 0) return { err: "λ debe ser mayor que 0." };
          return { dist: erlang(k, l) };
        }
        case "chiSquare": {
          const df = num(dfChi);
          if (!Number.isFinite(df)) return { err: "Ingresá df numérico." };
          if (!Number.isInteger(df) || df < 1)
            return { err: "df debe ser un entero ≥ 1." };
          return { dist: chiSquare(df) };
        }
        case "studentT": {
          const df = num(dfT);
          if (!Number.isFinite(df)) return { err: "Ingresá df numérico." };
          if (!Number.isInteger(df) || df < 1)
            return { err: "df debe ser un entero ≥ 1." };
          return { dist: studentT(df) };
        }
      }
    } catch {
      return { err: "Parámetros inválidos." };
    }
    return { err: "Distribución desconocida." };
  }, [
    kind,
    geoMode,
    mu,
    sigma,
    n,
    p,
    lambda,
    a,
    b,
    pGeo,
    pBer,
    rNeg,
    pNeg,
    bigN,
    bigK,
    smallN,
    aCont,
    bCont,
    alpha,
    lamG,
    kErl,
    lamErl,
    dfChi,
    dfT,
  ]);

  const dist = "dist" in built ? built.dist : null;

  // Calculadora de probabilidades.
  const calc = useMemo(() => {
    if (!dist) return null;
    const d = dist;
    const x = num(xVal);
    const lo = num(aVal);
    const hi = num(bVal);
    const out: { leX?: number; geX?: number; between?: number } = {};
    if (Number.isFinite(x)) {
      const le = d.cdf(x);
      out.leX = le;
      if (d.discrete && d.pmf) {
        // P(X ≥ x) = 1 − P(X ≤ x) + P(X = x); incluye el extremo.
        out.geX = 1 - le + d.pmf(x);
      } else {
        out.geX = 1 - le;
      }
    }
    if (Number.isFinite(lo) && Number.isFinite(hi) && hi >= lo) {
      if (d.discrete && d.pmf) {
        // P(a ≤ X ≤ b) = cdf(b) − cdf(a) + P(X = a); incluye ambos extremos.
        out.between = d.cdf(hi) - d.cdf(lo) + d.pmf(lo);
      } else {
        out.between = d.cdf(hi) - d.cdf(lo);
      }
    }
    return out;
  }, [dist, xVal, aVal, bVal]);

  // Datos para el plot.
  const plot = useMemo(() => {
    if (!dist) return null;
    const d = dist;
    const [sLo, sHi] = d.support;
    if (d.discrete && d.pmf) {
      const pmfFn = d.pmf;
      const lo = Math.floor(sLo);
      const hi = Math.ceil(sHi);
      const bars: { k: number; pmf: number; cdf: number }[] = [];
      const maxBars = 60;
      const step = Math.max(1, Math.ceil((hi - lo + 1) / maxBars));
      let maxP = 0;
      for (let k = lo; k <= hi; k += step) {
        const pm = pmfFn(k);
        bars.push({ k, pmf: pm, cdf: d.cdf(k) });
        if (pm > maxP) maxP = pm;
      }
      return { discrete: true as const, lo, hi, bars, maxP: maxP || 1 };
    }
    if (!d.pdf) return null;
    const pdfFn = d.pdf;
    const lo = sLo;
    const hi = sHi;
    const N = 160;
    const pts: { x: number; pdf: number; cdf: number }[] = [];
    let maxP = 0;
    for (let i = 0; i <= N; i++) {
      const x = lo + ((hi - lo) * i) / N;
      const pd = pdfFn(x);
      pts.push({ x, pdf: pd, cdf: d.cdf(x) });
      if (pd > maxP) maxP = pd;
    }
    return { discrete: false as const, lo, hi, pts, maxP: maxP || 1 };
  }, [dist]);

  // σ y momentos pueden ser NaN/Infinity (t de Student con df bajo): se muestran "—".
  const showNum = (v: number | undefined) =>
    v !== undefined && Number.isFinite(v) ? fmt(v) : "—";

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Explorador de distribuciones</h3>
        <p>
          Elegí una distribución, ajustá sus parámetros y leé la PMF/PDF, la CDF
          y probabilidades puntuales o de intervalo.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* Controles */}
        <div className="vtool-stack">
          <Field label="Distribución" htmlFor="dist-kind">
            <Select
              id="dist-kind"
              value={kind}
              onChange={(e) => setKind(e.target.value as DistKey)}
            >
              {(Object.keys(DIST_LABELS) as DistKey[]).map((k) => (
                <option key={k} value={k}>
                  {DIST_LABELS[k]}
                </option>
              ))}
            </Select>
          </Field>

          {/* Parámetros según la distribución */}
          {kind === "normal" && (
            <div className="vtool-row">
              <Field label="μ (media)" htmlFor="p-mu" style={{ flex: 1 }}>
                <TextInput
                  id="p-mu"
                  value={mu}
                  onChange={(e) => setMu(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
              <Field label={<>σ &gt; 0</>} htmlFor="p-sigma" style={{ flex: 1 }}>
                <TextInput
                  id="p-sigma"
                  value={sigma}
                  onChange={(e) => setSigma(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
            </div>
          )}
          {kind === "binomial" && (
            <div className="vtool-row">
              <Field label="n (entero ≥ 0)" htmlFor="p-n" style={{ flex: 1 }}>
                <TextInput
                  id="p-n"
                  value={n}
                  onChange={(e) => setN(e.target.value)}
                  inputMode="numeric"
                />
              </Field>
              <Field label="p ∈ (0, 1)" htmlFor="p-p" style={{ flex: 1 }}>
                <TextInput
                  id="p-p"
                  value={p}
                  onChange={(e) => setP(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
            </div>
          )}
          {(kind === "poisson" || kind === "exponential") && (
            <Field label={<>λ &gt; 0</>} htmlFor="p-lambda">
              <TextInput
                id="p-lambda"
                value={lambda}
                onChange={(e) => setLambda(e.target.value)}
                inputMode="decimal"
              />
            </Field>
          )}
          {kind === "geometric" && (
            <div className="vtool-field">
              <div className="vtool-row" style={{ marginBottom: 10 }}>
                <Chip
                  active={geoMode === "failures"}
                  onClick={() => setGeoMode("failures")}
                >
                  Fracasos (ℕ₀)
                </Chip>
                <Chip
                  active={geoMode === "trials"}
                  onClick={() => setGeoMode("trials")}
                >
                  Ensayos (ℕ)
                </Chip>
              </div>
              <label className="vtool-label" htmlFor="p-pgeo">
                <span>p ∈ (0, 1)</span>
              </label>
              <TextInput
                id="p-pgeo"
                value={pGeo}
                onChange={(e) => setPGeo(e.target.value)}
                inputMode="decimal"
              />
              <Note style={{ marginTop: 8 }}>
                Doble convención. <b>Fracasos</b> (default cátedra): cuenta los
                fracasos antes del 1.er éxito (soporte k = 0, 1, …), con E[X] =
                q/p. <b>Ensayos</b>: cuenta el nº de ensayos hasta el 1.er éxito
                incluido (soporte k = 1, 2, …), con E[X] = 1/p. Las dos difieren
                en 1.
              </Note>
            </div>
          )}
          {kind === "uniformDisc" && (
            <div className="vtool-row">
              <Field label="a (entero)" htmlFor="p-a" style={{ flex: 1 }}>
                <TextInput
                  id="p-a"
                  value={a}
                  onChange={(e) => setA(e.target.value)}
                  inputMode="numeric"
                />
              </Field>
              <Field label="b ≥ a (entero)" htmlFor="p-b" style={{ flex: 1 }}>
                <TextInput
                  id="p-b"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  inputMode="numeric"
                />
              </Field>
            </div>
          )}
          {kind === "bernoulli" && (
            <Field label="p ∈ [0, 1]" htmlFor="p-pber">
              <TextInput
                id="p-pber"
                value={pBer}
                onChange={(e) => setPBer(e.target.value)}
                inputMode="decimal"
              />
            </Field>
          )}
          {kind === "binomialNegative" && (
            <>
              <div className="vtool-row">
                <Field label="r (entero ≥ 1)" htmlFor="p-rneg" style={{ flex: 1 }}>
                  <TextInput
                    id="p-rneg"
                    value={rNeg}
                    onChange={(e) => setRNeg(e.target.value)}
                    inputMode="numeric"
                  />
                </Field>
                <Field label="p ∈ (0, 1)" htmlFor="p-pneg" style={{ flex: 1 }}>
                  <TextInput
                    id="p-pneg"
                    value={pNeg}
                    onChange={(e) => setPNeg(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
              </div>
              <Note style={{ marginTop: 8 }}>
                Convención cátedra: X = nº de <b>fracasos</b> antes del r-ésimo
                éxito (soporte ℕ₀). E[X] = rq/p, Var(X) = rq/p². Caso r = 1 = la
                geométrica de fracasos.
              </Note>
            </>
          )}
          {kind === "hypergeometric" && (
            <>
              <div className="vtool-row">
                <Field label="N (población)" htmlFor="p-bign" style={{ flex: 1 }}>
                  <TextInput
                    id="p-bign"
                    value={bigN}
                    onChange={(e) => setBigN(e.target.value)}
                    inputMode="numeric"
                  />
                </Field>
                <Field label="K (éxitos, ≤ N)" htmlFor="p-bigk" style={{ flex: 1 }}>
                  <TextInput
                    id="p-bigk"
                    value={bigK}
                    onChange={(e) => setBigK(e.target.value)}
                    inputMode="numeric"
                  />
                </Field>
                <Field label="n (muestra, ≤ N)" htmlFor="p-smalln" style={{ flex: 1 }}>
                  <TextInput
                    id="p-smalln"
                    value={smallN}
                    onChange={(e) => setSmallN(e.target.value)}
                    inputMode="numeric"
                  />
                </Field>
              </div>
              <Note style={{ marginTop: 8 }}>
                Muestreo <b>sin reposición</b>: tomás n de una población de N con
                K éxitos. E[X] = nK/N (misma media que una binomial con p = K/N,
                pero menos varianza por el factor de corrección).
              </Note>
            </>
          )}
          {kind === "uniformCont" && (
            <div className="vtool-row">
              <Field label="a" htmlFor="p-acont" style={{ flex: 1 }}>
                <TextInput
                  id="p-acont"
                  value={aCont}
                  onChange={(e) => setACont(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
              <Field label="b > a" htmlFor="p-bcont" style={{ flex: 1 }}>
                <TextInput
                  id="p-bcont"
                  value={bCont}
                  onChange={(e) => setBCont(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
            </div>
          )}
          {kind === "gamma" && (
            <div className="vtool-row">
              <Field label={<>α &gt; 0 (forma)</>} htmlFor="p-alpha" style={{ flex: 1 }}>
                <TextInput
                  id="p-alpha"
                  value={alpha}
                  onChange={(e) => setAlpha(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
              <Field label={<>λ &gt; 0 (tasa)</>} htmlFor="p-lamg" style={{ flex: 1 }}>
                <TextInput
                  id="p-lamg"
                  value={lamG}
                  onChange={(e) => setLamG(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
            </div>
          )}
          {kind === "erlang" && (
            <>
              <div className="vtool-row">
                <Field label="k (entero ≥ 1)" htmlFor="p-kerl" style={{ flex: 1 }}>
                  <TextInput
                    id="p-kerl"
                    value={kErl}
                    onChange={(e) => setKErl(e.target.value)}
                    inputMode="numeric"
                  />
                </Field>
                <Field label={<>λ &gt; 0 (tasa)</>} htmlFor="p-lamerl" style={{ flex: 1 }}>
                  <TextInput
                    id="p-lamerl"
                    value={lamErl}
                    onChange={(e) => setLamErl(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
              </div>
              <Note style={{ marginTop: 8 }}>
                Erlang(k, λ) = Gamma con forma entera k: el tiempo hasta la
                k-ésima ocurrencia de un proceso de Poisson de tasa λ.
              </Note>
            </>
          )}
          {kind === "chiSquare" && (
            <Field label="df (grados de libertad, entero ≥ 1)" htmlFor="p-dfchi">
              <TextInput
                id="p-dfchi"
                value={dfChi}
                onChange={(e) => setDfChi(e.target.value)}
                inputMode="numeric"
              />
            </Field>
          )}
          {kind === "studentT" && (
            <>
              <Field label="df (grados de libertad, entero ≥ 1)" htmlFor="p-dft">
                <TextInput
                  id="p-dft"
                  value={dfT}
                  onChange={(e) => setDfT(e.target.value)}
                  inputMode="numeric"
                />
              </Field>
              <Note style={{ marginTop: 8 }}>
                Simétrica en 0. E[X] = 0 solo si df &gt; 1; Var(X) = df/(df−2)
                solo si df &gt; 2 (con df ≤ 2 la varianza no es finita).
              </Note>
            </>
          )}

          {/* Momentos de la distribución */}
          <SubPanel>
            <div className="vtool-eyebrow">Momentos</div>
            <div className="vtool-readout" style={{ marginTop: 8 }}>
              <div className="vtool-kv">
                <span className="k">E[X] (media)</span>
                <span className="v acc">{dist ? showNum(dist.mean) : "—"}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Var(X)</span>
                <span className="v">{dist ? showNum(dist.variance) : "—"}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">σ = √Var</span>
                <span className="v">
                  {dist ? showNum(Math.sqrt(dist.variance)) : "—"}
                </span>
              </div>
              <div className="vtool-kv">
                <span className="k">Tipo</span>
                <span className="v">
                  {dist ? (dist.discrete ? "Discreta" : "Continua") : "—"}
                </span>
              </div>
            </div>
          </SubPanel>
        </div>

        {/* Salida: plot + calculadora */}
        <div className="vtool-stack">
          {"err" in built ? (
            <Note tone="error">{built.err}</Note>
          ) : (
            plot && (
              <>
                <PlotFrame
                  xLo={plot.lo}
                  xHi={plot.hi}
                  yMax={plot.maxP}
                  xDecimals={plot.discrete ? 0 : 2}
                  ariaLabel={`Gráfico de ${DIST_LABELS[kind]}`}
                >
                  {(s) => (
                    <>
                      {/* PMF (barras) o PDF (área + curva) */}
                      {plot.discrete ? (
                        <g>
                          {plot.bars.map((bar, i) => {
                            const cx = s.sx(bar.k);
                            const span =
                              plot.bars.length > 1
                                ? (innerSpan(s) / (plot.bars.length - 1)) * 0.62
                                : innerSpan(s) * 0.3;
                            const bw = Math.max(2, Math.min(span, 22));
                            const y = s.syTop(bar.pmf);
                            return (
                              <rect
                                key={`bar-${i}`}
                                x={cx - bw / 2}
                                y={y}
                                width={bw}
                                height={s.yBase - y}
                                fill="var(--vault-tint, var(--primary))"
                                fillOpacity={0.55}
                                stroke="var(--vault-tint, var(--primary))"
                                strokeWidth={1}
                              />
                            );
                          })}
                        </g>
                      ) : (
                        <g>
                          <path
                            d={
                              `M ${s.sx(plot.pts[0].x)} ${s.yBase} ` +
                              plot.pts
                                .map((pt) => `L ${s.sx(pt.x)} ${s.syTop(pt.pdf)}`)
                                .join(" ") +
                              ` L ${s.sx(plot.pts[plot.pts.length - 1].x)} ${
                                s.yBase
                              } Z`
                            }
                            fill={s.fills.area}
                          />
                          <path
                            d={polyline(
                              plot.pts.map((pt) => ({
                                x: s.sx(pt.x),
                                y: s.syTop(pt.pdf),
                              })),
                            )}
                            fill="none"
                            stroke="var(--vault-tint, var(--primary))"
                            strokeWidth={1.8}
                            {...s.curve()}
                          />
                        </g>
                      )}

                      {/* CDF superpuesta (eje normalizado 0..1) */}
                      <path
                        d={polyline(
                          (plot.discrete
                            ? plot.bars.map((bar) => ({ x: bar.k, cdf: bar.cdf }))
                            : plot.pts.map((pt) => ({ x: pt.x, cdf: pt.cdf }))
                          ).map((d) => ({ x: s.sx(d.x), y: s.syUnit(d.cdf) })),
                        )}
                        fill="none"
                        stroke="var(--accent)"
                        strokeWidth={1.5}
                        strokeDasharray="4 3"
                      />
                    </>
                  )}
                </PlotFrame>
                <PlotLegend
                  items={[
                    { kind: "line", label: plot.discrete ? "PMF" : "PDF" },
                    { kind: "dashed", color: "var(--accent)", label: "CDF (0→1)" },
                  ]}
                />
              </>
            )
          )}

          {/* Calculadora de probabilidades */}
          <SubPanel>
            <div className="vtool-eyebrow">Calculadora de probabilidades</div>
            <div className="vtool-row" style={{ marginTop: 10 }}>
              <Field label="x" htmlFor="c-x" style={{ flex: 1 }}>
                <TextInput
                  id="c-x"
                  value={xVal}
                  onChange={(e) => setXVal(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
              <Field label="a" htmlFor="c-a" style={{ flex: 1 }}>
                <TextInput
                  id="c-a"
                  value={aVal}
                  onChange={(e) => setAVal(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
              <Field label="b" htmlFor="c-b" style={{ flex: 1 }}>
                <TextInput
                  id="c-b"
                  value={bVal}
                  onChange={(e) => setBVal(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
            </div>
            {dist && calc ? (
              <div className="vtool-readout" style={{ marginTop: 10 }}>
                <div className="vtool-kv">
                  <span className="k">P(X ≤ x)</span>
                  <span className="v acc">
                    {calc.leX !== undefined ? fmt(calc.leX) : "—"}
                  </span>
                </div>
                <div className="vtool-kv">
                  <span className="k">P(X ≥ x)</span>
                  <span className="v">
                    {calc.geX !== undefined ? fmt(calc.geX) : "—"}
                  </span>
                </div>
                <div className="vtool-kv">
                  <span className="k">P(a ≤ X ≤ b)</span>
                  <span className="v coral">
                    {calc.between !== undefined ? fmt(calc.between) : "—"}
                  </span>
                </div>
              </div>
            ) : (
              <Note style={{ marginTop: 10 }}>
                Ingresá valores numéricos para evaluar.
              </Note>
            )}
            {dist?.discrete && (
              <Note style={{ marginTop: 10 }}>
                En discretas: P(X ≥ x) y P(a ≤ X ≤ b) incluyen los extremos.
              </Note>
            )}
          </SubPanel>
        </div>
      </div>
    </Panel>
  );
}

// Ancho del área de dibujo en px, derivado de las escalas del frame.
function innerSpan(s: { sx: (v: number) => number; xLo: number; xHi: number }) {
  return s.xHi === s.xLo ? 100 : Math.abs(s.sx(s.xHi) - s.sx(s.xLo));
}
