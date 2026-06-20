"use client";

import { useMemo, useState } from "react";
import {
  Panel,
  SubPanel,
  Note,
  Field,
  TextInput,
  TextArea,
  Select,
  Slider,
  Chip,
} from "@studyvaults/ui";
import ToolkitShell, { type Tool } from "./ToolkitShell";
import {
  binomial,
  poisson,
  geometric,
  uniformDisc,
  normal,
  exponential,
  normalPdf,
  normalCdf,
  normalQuantile,
  parseNumbers,
  describe,
  histogram,
  fmt,
} from "./lib/stats";

/* ============================================================================
 * Utilidades de render compartidas
 * ========================================================================== */

// Parser numérico tolerante con fallback. Acepta coma o punto decimal.
function num(s: string, fallback = NaN): number {
  if (s.trim() === "") return fallback;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

// Marco de ejes SVG reutilizable para los plots.
const PLOT_W = 520;
const PLOT_H = 230;
const PAD = { l: 38, r: 12, t: 14, b: 26 };
const innerW = PLOT_W - PAD.l - PAD.r;
const innerH = PLOT_H - PAD.t - PAD.b;

function ticks(lo: number, hi: number, n: number): number[] {
  if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo === hi) return [lo];
  const out: number[] = [];
  for (let i = 0; i <= n; i++) out.push(lo + ((hi - lo) * i) / n);
  return out;
}

/* ============================================================================
 * Tool 1 — Explorador de distribuciones
 * ========================================================================== */

type DistKey =
  | "normal"
  | "binomial"
  | "poisson"
  | "exponential"
  | "uniformDisc"
  | "geometric";

const DIST_LABELS: Record<DistKey, string> = {
  normal: "Normal (μ, σ)",
  binomial: "Binomial (n, p)",
  poisson: "Poisson (λ)",
  exponential: "Exponencial (λ)",
  uniformDisc: "Uniforme discreta (a, b)",
  geometric: "Geométrica (p)",
};

function DistribucionesTool() {
  const [kind, setKind] = useState<DistKey>("normal");
  // Parámetros (strings para tolerar edición parcial).
  const [mu, setMu] = useState("0");
  const [sigma, setSigma] = useState("1");
  const [n, setN] = useState("10");
  const [p, setP] = useState("0.5");
  const [lambda, setLambda] = useState("2");
  const [a, setA] = useState("1");
  const [b, setB] = useState("6");
  const [pGeo, setPGeo] = useState("0.3");
  // Calculadora.
  const [xVal, setXVal] = useState("0");
  const [aVal, setAVal] = useState("-1");
  const [bVal, setBVal] = useState("1");

  const built = useMemo(() => {
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
        case "exponential": {
          const l = num(lambda);
          if (!Number.isFinite(l)) return { err: "Ingresá λ numérico." };
          if (l <= 0) return { err: "λ debe ser mayor que 0." };
          return { dist: exponential(l) };
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
        case "geometric": {
          const pp = num(pGeo);
          if (!Number.isFinite(pp)) return { err: "Ingresá p numérico." };
          if (pp <= 0 || pp >= 1) return { err: "p debe estar en (0, 1)." };
          return { dist: geometric(pp) };
        }
      }
    } catch {
      return { err: "Parámetros inválidos." };
    }
    return { err: "Distribución desconocida." };
  }, [kind, mu, sigma, n, p, lambda, a, b, pGeo]);

  // Calculadora de probabilidades.
  const calc = useMemo(() => {
    if (!("dist" in built) || !built.dist) return null;
    const d = built.dist;
    const x = num(xVal);
    const lo = num(aVal);
    const hi = num(bVal);
    const out: { leX?: number; geX?: number; between?: number } = {};
    if (Number.isFinite(x)) {
      const le = d.cdf(x);
      out.leX = le;
      if (d.discrete) {
        // P(X ≥ x) = 1 − P(X ≤ x−1) = 1 − cdf(⌈x⌉−1); usamos pmf en x.
        const pmf = (d as { pmf: (k: number) => number }).pmf(x);
        out.geX = 1 - le + pmf;
      } else {
        out.geX = 1 - le;
      }
    }
    if (Number.isFinite(lo) && Number.isFinite(hi) && hi >= lo) {
      if (d.discrete) {
        // P(a ≤ X ≤ b) = cdf(b) − cdf(a−1).
        const pmfLo = (d as { pmf: (k: number) => number }).pmf(lo);
        out.between = d.cdf(hi) - d.cdf(lo) + pmfLo;
      } else {
        out.between = d.cdf(hi) - d.cdf(lo);
      }
    }
    return out;
  }, [built, xVal, aVal, bVal]);

  // Datos para el plot.
  const plot = useMemo(() => {
    if (!("dist" in built) || !built.dist) return null;
    const d = built.dist;
    const [sLo, sHi] = d.support;
    if (d.discrete) {
      const lo = Math.max(Math.floor(sLo), sLo);
      const hi = Math.ceil(sHi);
      const bars: { k: number; pmf: number; cdf: number }[] = [];
      const maxBars = 60;
      const step = Math.max(1, Math.ceil((hi - lo + 1) / maxBars));
      const pmfFn = (d as { pmf: (k: number) => number }).pmf;
      let maxP = 0;
      for (let k = lo; k <= hi; k += step) {
        const pm = pmfFn(k);
        bars.push({ k, pmf: pm, cdf: d.cdf(k) });
        if (pm > maxP) maxP = pm;
      }
      return { discrete: true as const, lo, hi, bars, maxP: maxP || 1 };
    }
    const lo = sLo;
    const hi = sHi;
    const N = 160;
    const pts: { x: number; pdf: number; cdf: number }[] = [];
    const pdfFn = (d as { pdf: (x: number) => number }).pdf;
    let maxP = 0;
    for (let i = 0; i <= N; i++) {
      const x = lo + ((hi - lo) * i) / N;
      const pd = pdfFn(x);
      pts.push({ x, pdf: pd, cdf: d.cdf(x) });
      if (pd > maxP) maxP = pd;
    }
    return { discrete: false as const, lo, hi, pts, maxP: maxP || 1 };
  }, [built]);

  const dist = "dist" in built ? built.dist : null;

  // Escalas para el SVG.
  const sx = (v: number, lo: number, hi: number) =>
    PAD.l + (hi === lo ? innerW / 2 : ((v - lo) / (hi - lo)) * innerW);
  const syPdf = (v: number, maxP: number) =>
    PAD.t + innerH - (maxP === 0 ? 0 : (v / maxP) * innerH);
  const syCdf = (v: number) => PAD.t + innerH - v * innerH;

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
              <Field label="b ≥ a" htmlFor="p-b" style={{ flex: 1 }}>
                <TextInput
                  id="p-b"
                  value={b}
                  onChange={(e) => setB(e.target.value)}
                  inputMode="numeric"
                />
              </Field>
            </div>
          )}
          {kind === "geometric" && (
            <div className="vtool-field">
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
                Convención: nº de ensayos hasta el primer éxito (soporte k =
                1, 2, …).
              </Note>
            </div>
          )}

          {/* Momentos de la distribución */}
          <SubPanel>
            <div className="vtool-eyebrow">Momentos</div>
            <div className="vtool-readout" style={{ marginTop: 8 }}>
              <div className="vtool-kv">
                <span className="k">E[X] (media)</span>
                <span className="v acc">{dist ? fmt(dist.mean) : "—"}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Var(X)</span>
                <span className="v">{dist ? fmt(dist.variance) : "—"}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">σ = √Var</span>
                <span className="v">
                  {dist ? fmt(Math.sqrt(dist.variance)) : "—"}
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
          {"err" in built && built.err ? (
            <Note tone="error">{built.err}</Note>
          ) : (
            plot && (
              <>
                <div className="vtool-plot">
                  <svg
                    viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
                    role="img"
                    aria-label={`Gráfico de ${DIST_LABELS[kind]}`}
                  >
                    {/* gridlines horizontales (eje izquierdo = densidad/masa) */}
                    {ticks(0, plot.maxP, 4).map((t, i) => {
                      const y = syPdf(t, plot.maxP);
                      return (
                        <g key={`gh-${i}`}>
                          <line
                            x1={PAD.l}
                            x2={PLOT_W - PAD.r}
                            y1={y}
                            y2={y}
                            stroke="var(--hairline)"
                            strokeWidth={1}
                          />
                          <text
                            x={PAD.l - 5}
                            y={y + 3}
                            textAnchor="end"
                            fontSize={8}
                            fontFamily="var(--font-mono)"
                            fill="var(--text-secondary)"
                          >
                            {fmt(t, 2)}
                          </text>
                        </g>
                      );
                    })}
                    {/* eje X */}
                    <line
                      x1={PAD.l}
                      x2={PLOT_W - PAD.r}
                      y1={PAD.t + innerH}
                      y2={PAD.t + innerH}
                      stroke="var(--hairline-strong)"
                      strokeWidth={1}
                    />
                    {ticks(plot.lo, plot.hi, 5).map((t, i) => {
                      const x = sx(t, plot.lo, plot.hi);
                      return (
                        <text
                          key={`gx-${i}`}
                          x={x}
                          y={PLOT_H - 8}
                          textAnchor="middle"
                          fontSize={8}
                          fontFamily="var(--font-mono)"
                          fill="var(--text-secondary)"
                        >
                          {fmt(t, plot.discrete ? 0 : 2)}
                        </text>
                      );
                    })}

                    {/* PMF (barras) o PDF (área + curva) */}
                    {plot.discrete ? (
                      <g>
                        {plot.bars.map((bar, i) => {
                          const cx = sx(bar.k, plot.lo, plot.hi);
                          const span =
                            plot.bars.length > 1
                              ? (innerW / (plot.bars.length - 1)) * 0.62
                              : innerW * 0.3;
                          const bw = Math.max(2, Math.min(span, 22));
                          const y = syPdf(bar.pmf, plot.maxP);
                          return (
                            <rect
                              key={`bar-${i}`}
                              x={cx - bw / 2}
                              y={y}
                              width={bw}
                              height={PAD.t + innerH - y}
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
                            `M ${sx(plot.pts[0].x, plot.lo, plot.hi)} ${
                              PAD.t + innerH
                            } ` +
                            plot.pts
                              .map(
                                (pt) =>
                                  `L ${sx(pt.x, plot.lo, plot.hi)} ${syPdf(
                                    pt.pdf,
                                    plot.maxP,
                                  )}`,
                              )
                              .join(" ") +
                            ` L ${sx(
                              plot.pts[plot.pts.length - 1].x,
                              plot.lo,
                              plot.hi,
                            )} ${PAD.t + innerH} Z`
                          }
                          fill="var(--vault-tint, var(--primary))"
                          fillOpacity={0.14}
                        />
                        <path
                          d={
                            "M " +
                            plot.pts
                              .map(
                                (pt) =>
                                  `${sx(pt.x, plot.lo, plot.hi)} ${syPdf(
                                    pt.pdf,
                                    plot.maxP,
                                  )}`,
                              )
                              .join(" L ")
                          }
                          fill="none"
                          stroke="var(--vault-tint, var(--primary))"
                          strokeWidth={1.8}
                        />
                      </g>
                    )}

                    {/* CDF superpuesta (eje derecho normalizado 0..1) */}
                    <path
                      d={
                        "M " +
                        (plot.discrete
                          ? plot.bars.map(
                              (bar) =>
                                `${sx(bar.k, plot.lo, plot.hi)} ${syCdf(
                                  bar.cdf,
                                )}`,
                            )
                          : plot.pts.map(
                              (pt) =>
                                `${sx(pt.x, plot.lo, plot.hi)} ${syCdf(
                                  pt.cdf,
                                )}`,
                            )
                        ).join(" L ")
                      }
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth={1.5}
                      strokeDasharray="4 3"
                    />
                  </svg>
                </div>
                <div className="vtool-row" style={{ gap: 16 }}>
                  <span
                    className="vtool-mono"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 3,
                        background: "var(--vault-tint, var(--primary))",
                        display: "inline-block",
                      }}
                    />
                    {plot.discrete ? "PMF" : "PDF"}
                  </span>
                  <span
                    className="vtool-mono"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <span
                      style={{
                        width: 18,
                        height: 0,
                        borderTop: "2px dashed var(--accent)",
                        display: "inline-block",
                      }}
                    />
                    CDF (0→1)
                  </span>
                </div>
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

/* ============================================================================
 * Tool 2 — Tabla Z / normal estándar
 * ========================================================================== */

type NormalRes =
  | { err: string }
  | { z: number; phi: number; upper: number; two: number; pdf: number };

function NormalTool() {
  const [mode, setMode] = useState<"z2p" | "p2z">("z2p");
  const [zStr, setZStr] = useState("1.96");
  const [pStr, setPStr] = useState("0.975");

  const res = useMemo((): NormalRes => {
    if (mode === "z2p") {
      const z = num(zStr);
      if (!Number.isFinite(z)) return { err: "Ingresá un z numérico." };
      const phi = normalCdf(z);
      return {
        z,
        phi,
        upper: 1 - phi,
        two: 2 * (1 - normalCdf(Math.abs(z))),
        pdf: normalPdf(z),
      };
    }
    const p = num(pStr);
    if (!Number.isFinite(p)) return { err: "Ingresá una probabilidad p." };
    if (p <= 0 || p >= 1) return { err: "p debe estar en (0, 1)." };
    const z = normalQuantile(p);
    // Dos colas a partir de |z| para que sea correcto también con p < 0.5
    // (z < 0): P(|Z| ≥ |z|) = 2·(1 − Φ(|z|)).
    return {
      z,
      phi: p,
      upper: 1 - p,
      two: 2 * (1 - normalCdf(Math.abs(z))),
      pdf: normalPdf(z),
    };
  }, [mode, zStr, pStr]);

  const z = "z" in res ? res.z : NaN;

  // Plot N(0,1) con área sombreada bajo z (cola izquierda hasta z).
  const curve = useMemo(() => {
    const lo = -4;
    const hi = 4;
    const N = 200;
    const pts: { x: number; y: number }[] = [];
    let maxY = 0;
    for (let i = 0; i <= N; i++) {
      const x = lo + ((hi - lo) * i) / N;
      const y = normalPdf(x);
      pts.push({ x, y });
      if (y > maxY) maxY = y;
    }
    return { lo, hi, pts, maxY };
  }, []);

  const sx = (v: number) =>
    PAD.l + ((v - curve.lo) / (curve.hi - curve.lo)) * innerW;
  const sy = (v: number) => PAD.t + innerH - (v / curve.maxY) * innerH;

  const zClamped = Number.isFinite(z) ? Math.max(-4, Math.min(4, z)) : null;
  const shaded =
    zClamped !== null
      ? curve.pts.filter((pt) => pt.x <= zClamped)
      : [];

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Tabla Z / normal estándar</h3>
        <p>
          Convertí entre un valor z y su probabilidad acumulada Φ(z), en ambos
          sentidos. Φ(z) = P(Z ≤ z) con Z ~ N(0, 1).
        </p>
      </div>

      <div className="vtool-row" style={{ marginBottom: 16 }}>
        <Chip active={mode === "z2p"} onClick={() => setMode("z2p")}>
          z → Φ(z)
        </Chip>
        <Chip active={mode === "p2z"} onClick={() => setMode("p2z")}>
          p → z = Φ⁻¹(p)
        </Chip>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          {mode === "z2p" ? (
            <Field label="z" hint="cuantil estandarizado" htmlFor="z-in">
              <TextInput
                id="z-in"
                value={zStr}
                onChange={(e) => setZStr(e.target.value)}
                inputMode="decimal"
              />
            </Field>
          ) : (
            <Field label="p ∈ (0, 1)" hint="prob. acumulada" htmlFor="p-in">
              <TextInput
                id="p-in"
                value={pStr}
                onChange={(e) => setPStr(e.target.value)}
                inputMode="decimal"
              />
            </Field>
          )}

          {"err" in res ? (
            <Note tone="error">{res.err}</Note>
          ) : (
            <SubPanel>
              <div className="vtool-bignum">
                {mode === "z2p" ? fmt(res.phi) : fmt(res.z)}
                <small>
                  {" "}
                  {mode === "z2p" ? "= Φ(z)" : "= z"}
                </small>
              </div>
              <div className="vtool-readout" style={{ marginTop: 12 }}>
                <div className="vtool-kv">
                  <span className="k">z</span>
                  <span className="v">{fmt(res.z)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Φ(z) = P(Z ≤ z)</span>
                  <span className="v acc">{fmt(res.phi)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">1 − Φ(z) = P(Z ≥ z)</span>
                  <span className="v">{fmt(res.upper)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">2·(1 − Φ(|z|)) — dos colas</span>
                  <span className="v coral">{fmt(res.two)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">φ(z) — densidad</span>
                  <span className="v">{fmt(res.pdf)}</span>
                </div>
              </div>
            </SubPanel>
          )}
        </div>

        <div className="vtool-stack">
          <div className="vtool-plot">
            <svg
              viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
              role="img"
              aria-label="Densidad normal estándar con área sombreada"
            >
              {/* eje X */}
              <line
                x1={PAD.l}
                x2={PLOT_W - PAD.r}
                y1={PAD.t + innerH}
                y2={PAD.t + innerH}
                stroke="var(--hairline-strong)"
                strokeWidth={1}
              />
              {ticks(curve.lo, curve.hi, 8).map((t, i) => (
                <text
                  key={`zx-${i}`}
                  x={sx(t)}
                  y={PLOT_H - 8}
                  textAnchor="middle"
                  fontSize={8}
                  fontFamily="var(--font-mono)"
                  fill="var(--text-secondary)"
                >
                  {fmt(t, 0)}
                </text>
              ))}

              {/* área sombreada P(Z ≤ z) */}
              {shaded.length > 1 && zClamped !== null && (
                <path
                  d={
                    `M ${sx(shaded[0].x)} ${PAD.t + innerH} ` +
                    shaded
                      .map((pt) => `L ${sx(pt.x)} ${sy(pt.y)}`)
                      .join(" ") +
                    ` L ${sx(zClamped)} ${PAD.t + innerH} Z`
                  }
                  fill="var(--vault-tint, var(--primary))"
                  fillOpacity={0.22}
                />
              )}

              {/* curva normal */}
              <path
                d={
                  "M " +
                  curve.pts.map((pt) => `${sx(pt.x)} ${sy(pt.y)}`).join(" L ")
                }
                fill="none"
                stroke="var(--vault-tint, var(--primary))"
                strokeWidth={1.8}
              />

              {/* línea vertical en z */}
              {zClamped !== null && (
                <line
                  x1={sx(zClamped)}
                  x2={sx(zClamped)}
                  y1={PAD.t}
                  y2={PAD.t + innerH}
                  stroke="var(--accent)"
                  strokeWidth={1.4}
                  strokeDasharray="4 3"
                />
              )}
              {zClamped !== null && (
                <text
                  x={sx(zClamped)}
                  y={PAD.t + 2}
                  textAnchor="middle"
                  fontSize={9}
                  fontFamily="var(--font-mono)"
                  fill="var(--accent-text)"
                >
                  z = {fmt(z, 2)}
                </text>
              )}
            </svg>
          </div>
          <Note>
            <b>Teorema central del límite.</b> Si X₁, …, Xₙ son i.i.d. con media
            μ y varianza σ² finita, entonces para n grande la media muestral X̄
            se aproxima a una normal: (X̄ − μ) / (σ/√n) → N(0, 1). Por eso la
            tabla Z resuelve aproximadamente problemas sobre promedios y sumas
            de muchas variables, sin importar la distribución original.
          </Note>
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================================
 * Tool 3 — Estadística descriptiva
 * ========================================================================== */

const SAMPLE_DATA =
  "4.2 5.1 3.8 6.0 5.5 4.9 5.2 6.3 4.0 5.8 5.0 4.6 5.4 6.1 4.3 5.7 5.1 4.8 5.9 5.3";

function DescriptivaTool() {
  const [raw, setRaw] = useState(SAMPLE_DATA);
  const [bins, setBins] = useState(8);

  const xs = useMemo(() => parseNumbers(raw), [raw]);
  const stats = useMemo(() => describe(xs), [xs]);
  const hist = useMemo(
    () => (xs.length ? histogram(xs, Math.max(1, bins)) : []),
    [xs, bins],
  );

  const maxCount = hist.reduce((m, h) => Math.max(m, h.count), 0);
  const hLo = hist.length ? hist[0].lo : 0;
  const hHi = hist.length ? hist[hist.length - 1].hi : 1;

  const sxH = (v: number) =>
    PAD.l + (hHi === hLo ? innerW / 2 : ((v - hLo) / (hHi - hLo)) * innerW);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Estadística descriptiva</h3>
        <p>
          Pegá datos numéricos (separados por espacios, comas o saltos de línea)
          y obtené resumen de cinco números, dispersión e histograma.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <Field label="Datos" hint={`${xs.length} valores`} htmlFor="data-in">
            <TextArea
              id="data-in"
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              spellCheck={false}
              rows={5}
            />
          </Field>
          <div className="vtool-row">
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => setRaw(SAMPLE_DATA)}
            >
              Datos de ejemplo
            </button>
            <button
              type="button"
              className="btn btn--sm btn--ghost"
              onClick={() => setRaw("")}
            >
              Limpiar
            </button>
          </div>

          <Field label="Bins del histograma" hint={bins} htmlFor="bins-in">
            <Slider
              id="bins-in"
              min={2}
              max={20}
              step={1}
              value={bins}
              onChange={(e) => setBins(Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="vtool-stack">
          {!stats ? (
            <Note tone="error">
              No hay datos numéricos válidos. Ingresá al menos un valor.
            </Note>
          ) : (
            <>
              <SubPanel>
                <div className="vtool-eyebrow">Resumen</div>
                <table className="vtool-table" style={{ marginTop: 8 }}>
                  <tbody>
                    <tr>
                      <td>n</td>
                      <td>
                        <code>{stats.n}</code>
                      </td>
                      <td>Media</td>
                      <td>
                        <code>{fmt(stats.mean)}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Mín</td>
                      <td>
                        <code>{fmt(stats.min)}</code>
                      </td>
                      <td>Máx</td>
                      <td>
                        <code>{fmt(stats.max)}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Q1</td>
                      <td>
                        <code>{fmt(stats.q1)}</code>
                      </td>
                      <td>Q3</td>
                      <td>
                        <code>{fmt(stats.q3)}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Mediana</td>
                      <td>
                        <code>{fmt(stats.median)}</code>
                      </td>
                      <td>Rango</td>
                      <td>
                        <code>{fmt(stats.range)}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>IQR</td>
                      <td>
                        <code>{fmt(stats.q3 - stats.q1)}</code>
                      </td>
                      <td>Var. muestral</td>
                      <td>
                        <code>{fmt(stats.varSample)}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>σ muestral</td>
                      <td>
                        <code>{fmt(stats.sdSample)}</code>
                      </td>
                      <td>Var. poblac.</td>
                      <td>
                        <code>{fmt(stats.varPop)}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>σ poblac.</td>
                      <td>
                        <code>{fmt(stats.sdPop)}</code>
                      </td>
                      <td>CV</td>
                      <td>
                        <code>
                          {stats.mean !== 0
                            ? fmt(stats.sdSample / Math.abs(stats.mean))
                            : "—"}
                        </code>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Note style={{ marginTop: 10 }}>
                  Var. muestral usa divisor n−1 (insesgada); var. poblacional
                  usa n. CV = σ muestral / |media|.
                </Note>
              </SubPanel>

              <div className="vtool-plot">
                <svg
                  viewBox={`0 0 ${PLOT_W} ${PLOT_H}`}
                  role="img"
                  aria-label="Histograma de los datos"
                >
                  {/* gridlines de frecuencia */}
                  {maxCount > 0 &&
                    ticks(0, maxCount, Math.min(4, maxCount)).map((t, i) => {
                      const y =
                        PAD.t + innerH - (t / maxCount) * innerH;
                      return (
                        <g key={`hh-${i}`}>
                          <line
                            x1={PAD.l}
                            x2={PLOT_W - PAD.r}
                            y1={y}
                            y2={y}
                            stroke="var(--hairline)"
                            strokeWidth={1}
                          />
                          <text
                            x={PAD.l - 5}
                            y={y + 3}
                            textAnchor="end"
                            fontSize={8}
                            fontFamily="var(--font-mono)"
                            fill="var(--text-secondary)"
                          >
                            {Math.round(t)}
                          </text>
                        </g>
                      );
                    })}
                  {/* eje X */}
                  <line
                    x1={PAD.l}
                    x2={PLOT_W - PAD.r}
                    y1={PAD.t + innerH}
                    y2={PAD.t + innerH}
                    stroke="var(--hairline-strong)"
                    strokeWidth={1}
                  />
                  {/* barras */}
                  {hist.map((h, i) => {
                    const x0 = sxH(h.lo);
                    const x1 = sxH(h.hi);
                    const w = Math.max(1, x1 - x0 - 1.5);
                    const hgt =
                      maxCount > 0 ? (h.count / maxCount) * innerH : 0;
                    return (
                      <rect
                        key={`hb-${i}`}
                        x={x0 + 0.75}
                        y={PAD.t + innerH - hgt}
                        width={w}
                        height={hgt}
                        fill="var(--vault-tint, var(--primary))"
                        fillOpacity={0.5}
                        stroke="var(--vault-tint, var(--primary))"
                        strokeWidth={1}
                      />
                    );
                  })}
                  {/* ticks de borde inferior */}
                  {[hLo, (hLo + hHi) / 2, hHi].map((t, i) => (
                    <text
                      key={`hx-${i}`}
                      x={sxH(t)}
                      y={PLOT_H - 8}
                      textAnchor="middle"
                      fontSize={8}
                      fontFamily="var(--font-mono)"
                      fill="var(--text-secondary)"
                    >
                      {fmt(t, 2)}
                    </text>
                  ))}
                  {/* línea de la media */}
                  {Number.isFinite(stats.mean) &&
                    stats.mean >= hLo &&
                    stats.mean <= hHi && (
                      <line
                        x1={sxH(stats.mean)}
                        x2={sxH(stats.mean)}
                        y1={PAD.t}
                        y2={PAD.t + innerH}
                        stroke="var(--accent)"
                        strokeWidth={1.4}
                        strokeDasharray="4 3"
                      />
                    )}
                </svg>
              </div>
              <div className="vtool-row" style={{ gap: 16 }}>
                <span
                  className="vtool-mono"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{
                      width: 14,
                      height: 10,
                      background: "var(--vault-tint, var(--primary))",
                      opacity: 0.5,
                      display: "inline-block",
                    }}
                  />
                  frecuencia
                </span>
                <span
                  className="vtool-mono"
                  style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <span
                    style={{
                      width: 18,
                      height: 0,
                      borderTop: "2px dashed var(--accent)",
                      display: "inline-block",
                    }}
                  />
                  media
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================================
 * Tool 4 — Formulario (referencia estática)
 * ========================================================================== */

const DIST_REF: {
  name: string;
  support: string;
  pmf: string;
  ev: string;
  varx: string;
}[] = [
  {
    name: "Bernoulli(p)",
    support: "{0, 1}",
    pmf: "pˣ(1−p)¹⁻ˣ",
    ev: "p",
    varx: "p(1−p)",
  },
  {
    name: "Binomial(n, p)",
    support: "{0, …, n}",
    pmf: "C(n,k) pᵏ(1−p)ⁿ⁻ᵏ",
    ev: "np",
    varx: "np(1−p)",
  },
  {
    name: "Geométrica(p)",
    support: "{1, 2, …}",
    pmf: "(1−p)ᵏ⁻¹ p",
    ev: "1/p",
    varx: "(1−p)/p²",
  },
  {
    name: "Poisson(λ)",
    support: "{0, 1, …}",
    pmf: "e⁻ᵏ λᵏ / k!",
    ev: "λ",
    varx: "λ",
  },
  {
    name: "Uniforme disc.(a, b)",
    support: "{a, …, b}",
    pmf: "1 / (b−a+1)",
    ev: "(a+b)/2",
    varx: "((b−a+1)²−1)/12",
  },
  {
    name: "Exponencial(λ)",
    support: "x ≥ 0",
    pmf: "λ e⁻λˣ  (pdf)",
    ev: "1/λ",
    varx: "1/λ²",
  },
  {
    name: "Uniforme cont.(a, b)",
    support: "[a, b]",
    pmf: "1/(b−a)  (pdf)",
    ev: "(a+b)/2",
    varx: "(b−a)²/12",
  },
  {
    name: "Normal(μ, σ²)",
    support: "ℝ",
    pmf: "φ((x−μ)/σ)/σ  (pdf)",
    ev: "μ",
    varx: "σ²",
  },
];

function RefTool() {
  return (
    <Panel>
      <div className="vtool-head">
        <h3>Formulario</h3>
        <p>
          Esperanza, varianza y soporte de las distribuciones más usadas, más
          los teoremas centrales de la materia.
        </p>
      </div>

      <SubPanel>
        <div className="vtool-eyebrow">Distribuciones</div>
        <div style={{ overflowX: "auto", marginTop: 8 }}>
          <table className="vtool-table">
            <thead>
              <tr>
                <th>Distribución</th>
                <th>Soporte</th>
                <th>PMF / PDF</th>
                <th>E[X]</th>
                <th>Var(X)</th>
              </tr>
            </thead>
            <tbody>
              {DIST_REF.map((d) => (
                <tr key={d.name}>
                  <td style={{ fontWeight: 600 }}>{d.name}</td>
                  <td>
                    <code>{d.support}</code>
                  </td>
                  <td>
                    <code>{d.pmf}</code>
                  </td>
                  <td>
                    <code>{d.ev}</code>
                  </td>
                  <td>
                    <code>{d.varx}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SubPanel>

      <SubPanel style={{ marginTop: 16 }}>
        <div className="vtool-eyebrow">Teoremas clave</div>
        <table className="vtool-table" style={{ marginTop: 8 }}>
          <tbody>
            <tr>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                Teorema de Bayes
              </td>
              <td>
                <code>
                  P(A | B) = P(B | A) · P(A) / P(B)
                </code>
                , con{" "}
                <code>P(B) = Σᵢ P(B | Aᵢ) P(Aᵢ)</code> (probabilidad total)
                sobre una partición {"{Aᵢ}"}.
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                Teorema central del límite
              </td>
              <td>
                Si X₁, …, Xₙ son i.i.d. con media μ y varianza σ² &lt; ∞,
                entonces{" "}
                <code>(X̄ₙ − μ) / (σ/√n) →ᵈ N(0, 1)</code> cuando n → ∞.
                Equivalente:{" "}
                <code>Σ Xᵢ ≈ N(nμ, nσ²)</code>.
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                Desigualdad de Chebyshev
              </td>
              <td>
                Para toda X con media μ y varianza σ² y todo k &gt; 0:{" "}
                <code>P(|X − μ| ≥ kσ) ≤ 1/k²</code>. Acota la dispersión sin
                conocer la distribución.
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                Linealidad de E[·]
              </td>
              <td>
                <code>E[aX + bY] = a·E[X] + b·E[Y]</code> (siempre).{" "}
                <code>Var(aX + b) = a²·Var(X)</code>; si X, Y independientes,{" "}
                <code>Var(X + Y) = Var(X) + Var(Y)</code>.
              </td>
            </tr>
            <tr>
              <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                Ley de grandes números
              </td>
              <td>
                X̄ₙ → μ (en probabilidad / casi seguro) cuando n → ∞: el promedio
                muestral converge a la media teórica.
              </td>
            </tr>
          </tbody>
        </table>
      </SubPanel>
    </Panel>
  );
}

/* ============================================================================
 * Export
 * ========================================================================== */

const tools: Tool[] = [
  {
    key: "distribuciones",
    label: "Distribuciones",
    icon: "bell",
    verb: "Calcular",
    desc: "Elegí una distribución (binomial, Poisson, normal…), ajustá sus parámetros y mirá probabilidades y gráfico en vivo.",
    node: <DistribucionesTool />,
  },
  {
    key: "normal",
    label: "Tabla Z",
    icon: "matrix",
    verb: "Buscar",
    desc: "La tabla de la normal estándar interactiva: pasá de un valor z a su probabilidad y al revés, sin buscar a mano.",
    node: <NormalTool />,
  },
  {
    key: "descriptiva",
    label: "Descriptiva",
    icon: "bars",
    verb: "Analizar",
    desc: "Pegá tus datos y obtené media, desvío, cuartiles e histograma para resumir una muestra de un vistazo.",
    node: <DescriptivaTool />,
  },
  {
    key: "ref",
    label: "Formulario",
    icon: "formula",
    verb: "Consultar",
    desc: "Fórmulas, propiedades y definiciones del curso reunidas para repasar antes del parcial.",
    node: <RefTool />,
  },
];

export default function ProbaTools() {
  return (
    <ToolkitShell
      intro={
        <>
          Calculadora de distribuciones, tabla Z, estadística descriptiva y un
          formulario de referencia. Todo se recalcula en vivo sobre tus
          parámetros y datos.
        </>
      }
      tools={tools}
    />
  );
}
