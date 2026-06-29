"use client";

import { useMemo, useState } from "react";
import { Panel, SubPanel, Note, Field, TextInput, Chip } from "@studyvaults/ui";
import {
  normalPdf,
  normalCdf,
  normalQuantile,
  fmt,
} from "../lib/stats";
import { PlotFrame, PlotLegend, polyline } from "./plot";

/* ============================================================================
 * Tabla normal + estandarización
 *
 * Cuatro modos:
 *   z→Φ(z)        — cuantil estándar → probabilidad acumulada
 *   p→z=Φ⁻¹(p)    — probabilidad → cuantil estándar (problema inverso)
 *   X~N(μ,σ): x   — estandarizar un valor x de una normal cualquiera
 *   P(a≤X≤b)      — probabilidad de un intervalo en N(μ,σ)
 *
 * Fórmulas (la matemática vive en lib/stats):
 *   z = (x−μ)/σ
 *   Φ(z) = normalCdf(z) = normalCdf(x, μ, σ)
 *   P(a≤X≤b) = Φ((b−μ)/σ) − Φ((a−μ)/σ)
 *   p→z: normalQuantile(p);  dos colas: 2·(1 − Φ(|z|))
 * ========================================================================== */

// Parser numérico tolerante con fallback. Acepta coma o punto decimal.
function num(s: string, fallback = NaN): number {
  if (s.trim() === "") return fallback;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

type Mode = "z2p" | "p2z" | "std" | "between";

const MODE_LABELS: Record<Mode, string> = {
  z2p: "z → Φ(z)",
  p2z: "p → z = Φ⁻¹(p)",
  std: "Estandarizar X~N(μ,σ)",
  between: "P(a ≤ X ≤ b) en N(μ,σ)",
};

// Curva N(0,1) precalculada para los modos estándar (z2p / p2z).
const STD_CURVE = (() => {
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
})();

export default function TablaNormalTool() {
  const [mode, setMode] = useState<Mode>("z2p");
  // Modos estándar.
  const [zStr, setZStr] = useState("1.96");
  const [pStr, setPStr] = useState("0.975");
  // Modos sobre N(μ,σ).
  const [muStr, setMuStr] = useState("78");
  const [sigStr, setSigStr] = useState("6");
  const [xStr, setXStr] = useState("84");
  const [aStr, setAStr] = useState("72");
  const [bStr, setBStr] = useState("84");

  /* ----- Modos estándar: z2p / p2z (curva N(0,1), cola izquierda hasta z) -- */
  const stdRes = useMemo(() => {
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
    // p2z
    const p = num(pStr);
    if (!Number.isFinite(p)) return { err: "Ingresá una probabilidad p." };
    if (p <= 0 || p >= 1) return { err: "p debe estar en (0, 1)." };
    const z = normalQuantile(p);
    // Dos colas a partir de |z| para que valga también con p < 0.5 (z < 0):
    // P(|Z| ≥ |z|) = 2·(1 − Φ(|z|)).
    return {
      z,
      phi: p,
      upper: 1 - p,
      two: 2 * (1 - normalCdf(Math.abs(z))),
      pdf: normalPdf(z),
    };
  }, [mode, zStr, pStr]);

  /* ----- Modo estandarizar: x → z, Φ(z)=P(X≤x), P(X≥x), φ ----------------- */
  const stdize = useMemo(() => {
    const mu = num(muStr);
    const sigma = num(sigStr);
    const x = num(xStr);
    if (!Number.isFinite(mu) || !Number.isFinite(sigma))
      return { err: "Ingresá μ y σ numéricos." };
    if (sigma <= 0) return { err: "σ debe ser mayor que 0." };
    if (!Number.isFinite(x)) return { err: "Ingresá un x numérico." };
    const z = (x - mu) / sigma;
    const phi = normalCdf(x, mu, sigma); // = Φ((x−μ)/σ)
    return {
      mu,
      sigma,
      x,
      z,
      phi,
      upper: 1 - phi,
      pdf: normalPdf(z),
    };
  }, [muStr, sigStr, xStr]);

  /* ----- Modo intervalo: P(a≤X≤b) = Φ((b−μ)/σ) − Φ((a−μ)/σ) -------------- */
  const between = useMemo(() => {
    const mu = num(muStr);
    const sigma = num(sigStr);
    const a = num(aStr);
    const b = num(bStr);
    if (!Number.isFinite(mu) || !Number.isFinite(sigma))
      return { err: "Ingresá μ y σ numéricos." };
    if (sigma <= 0) return { err: "σ debe ser mayor que 0." };
    if (!Number.isFinite(a) || !Number.isFinite(b))
      return { err: "Ingresá a y b numéricos." };
    if (b < a) return { err: "Se requiere a ≤ b." };
    const za = (a - mu) / sigma;
    const zb = (b - mu) / sigma;
    const prob = normalCdf(b, mu, sigma) - normalCdf(a, mu, sigma);
    return { mu, sigma, a, b, za, zb, prob };
  }, [muStr, sigStr, aStr, bStr]);

  /* ----- Curva de N(μ,σ) para los modos sobre normal cualquiera ----------- */
  const muSigCurve = useMemo(() => {
    const mu = num(muStr);
    const sigma = num(sigStr);
    if (!Number.isFinite(mu) || !Number.isFinite(sigma) || sigma <= 0)
      return null;
    const lo = mu - 4 * sigma;
    const hi = mu + 4 * sigma;
    const N = 200;
    const pts: { x: number; y: number }[] = [];
    let maxY = 0;
    for (let i = 0; i <= N; i++) {
      const x = lo + ((hi - lo) * i) / N;
      const y = normalPdf(x, mu, sigma);
      pts.push({ x, y });
      if (y > maxY) maxY = y;
    }
    return { lo, hi, pts, maxY };
  }, [muStr, sigStr]);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Tabla normal + estandarización</h3>
        <p>
          Φ(z) = P(Z ≤ z) con Z ~ N(0, 1). Convertí z ↔ probabilidad,
          estandarizá X ~ N(μ, σ) y calculá probabilidades de intervalo.
        </p>
      </div>

      <div className="vtool-row" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        {(Object.keys(MODE_LABELS) as Mode[]).map((m) => (
          <Chip key={m} active={mode === m} onClick={() => setMode(m)}>
            {MODE_LABELS[m]}
          </Chip>
        ))}
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* ===================== Controles + lecturas ===================== */}
        <div className="vtool-stack">
          {/* --- Modos estándar (z2p / p2z) --- */}
          {(mode === "z2p" || mode === "p2z") && (
            <>
              {mode === "z2p" ? (
                <Field label="z" hint="cuantil estandarizado" htmlFor="tn-z">
                  <TextInput
                    id="tn-z"
                    value={zStr}
                    onChange={(e) => setZStr(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
              ) : (
                <Field label="p ∈ (0, 1)" hint="prob. acumulada" htmlFor="tn-p">
                  <TextInput
                    id="tn-p"
                    value={pStr}
                    onChange={(e) => setPStr(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
              )}

              {"err" in stdRes ? (
                <Note tone="error">{stdRes.err}</Note>
              ) : (
                <SubPanel>
                  <div className="vtool-bignum">
                    {mode === "z2p" ? fmt(stdRes.phi) : fmt(stdRes.z)}
                    <small> {mode === "z2p" ? "= Φ(z)" : "= z"}</small>
                  </div>
                  <div className="vtool-readout" style={{ marginTop: 12 }}>
                    <div className="vtool-kv">
                      <span className="k">z</span>
                      <span className="v">{fmt(stdRes.z)}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">Φ(z) = P(Z ≤ z)</span>
                      <span className="v acc">{fmt(stdRes.phi)}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">1 − Φ(z) = P(Z ≥ z)</span>
                      <span className="v">{fmt(stdRes.upper)}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">2·(1 − Φ(|z|)) — dos colas</span>
                      <span className="v coral">{fmt(stdRes.two)}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">φ(z) — densidad</span>
                      <span className="v">{fmt(stdRes.pdf)}</span>
                    </div>
                  </div>
                </SubPanel>
              )}
            </>
          )}

          {/* --- Parámetros comunes a los modos sobre N(μ,σ) --- */}
          {(mode === "std" || mode === "between") && (
            <div className="vtool-row">
              <Field label="μ (media)" htmlFor="tn-mu" style={{ flex: 1 }}>
                <TextInput
                  id="tn-mu"
                  value={muStr}
                  onChange={(e) => setMuStr(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
              <Field label={<>σ &gt; 0</>} htmlFor="tn-sig" style={{ flex: 1 }}>
                <TextInput
                  id="tn-sig"
                  value={sigStr}
                  onChange={(e) => setSigStr(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
            </div>
          )}

          {/* --- Modo estandarizar --- */}
          {mode === "std" && (
            <>
              <Field label="x" hint="valor de X" htmlFor="tn-x">
                <TextInput
                  id="tn-x"
                  value={xStr}
                  onChange={(e) => setXStr(e.target.value)}
                  inputMode="decimal"
                />
              </Field>

              {"err" in stdize ? (
                <Note tone="error">{stdize.err}</Note>
              ) : (
                <SubPanel>
                  <div className="vtool-bignum">
                    {fmt(stdize.z)}
                    <small> = z = (x − μ)/σ</small>
                  </div>
                  <div className="vtool-readout" style={{ marginTop: 12 }}>
                    <div className="vtool-kv">
                      <span className="k">z = (x − μ)/σ</span>
                      <span className="v">{fmt(stdize.z)}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">Φ(z) = P(X ≤ x)</span>
                      <span className="v acc">{fmt(stdize.phi)}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">P(X ≥ x) = 1 − Φ(z)</span>
                      <span className="v">{fmt(stdize.upper)}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">φ(z) — densidad estándar</span>
                      <span className="v">{fmt(stdize.pdf)}</span>
                    </div>
                  </div>
                </SubPanel>
              )}
            </>
          )}

          {/* --- Modo intervalo P(a ≤ X ≤ b) --- */}
          {mode === "between" && (
            <>
              <div className="vtool-row">
                <Field label="a" htmlFor="tn-a" style={{ flex: 1 }}>
                  <TextInput
                    id="tn-a"
                    value={aStr}
                    onChange={(e) => setAStr(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
                <Field label="b ≥ a" htmlFor="tn-b" style={{ flex: 1 }}>
                  <TextInput
                    id="tn-b"
                    value={bStr}
                    onChange={(e) => setBStr(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
              </div>

              {"err" in between ? (
                <Note tone="error">{between.err}</Note>
              ) : (
                <SubPanel>
                  <div className="vtool-bignum">
                    {fmt(between.prob)}
                    <small> = P(a ≤ X ≤ b)</small>
                  </div>
                  <div className="vtool-readout" style={{ marginTop: 12 }}>
                    <div className="vtool-kv">
                      <span className="k">z_a = (a − μ)/σ</span>
                      <span className="v">{fmt(between.za)}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">z_b = (b − μ)/σ</span>
                      <span className="v">{fmt(between.zb)}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">Φ(z_b) − Φ(z_a)</span>
                      <span className="v acc">{fmt(between.prob)}</span>
                    </div>
                    <div className="vtool-kv">
                      <span className="k">P(X &lt; a) + P(X &gt; b)</span>
                      <span className="v coral">{fmt(1 - between.prob)}</span>
                    </div>
                  </div>
                </SubPanel>
              )}
            </>
          )}
        </div>

        {/* ============================ Gráfico ============================ */}
        <div className="vtool-stack">
          {/* --- Curva N(0,1) con cola izquierda hasta z (modos estándar) --- */}
          {(mode === "z2p" || mode === "p2z") &&
            (() => {
              const z: number = "z" in stdRes ? Number(stdRes.z) : NaN;
              const zClamped = Number.isFinite(z)
                ? Math.max(STD_CURVE.lo, Math.min(STD_CURVE.hi, z))
                : null;
              const shaded =
                zClamped !== null
                  ? STD_CURVE.pts.filter((pt) => pt.x <= zClamped)
                  : [];
              return (
                <>
                  <PlotFrame
                    xLo={STD_CURVE.lo}
                    xHi={STD_CURVE.hi}
                    yMax={STD_CURVE.maxY}
                    xTicks={8}
                    xDecimals={0}
                    showYGrid={false}
                    ariaLabel="Densidad normal estándar con área sombreada hasta z"
                  >
                    {(s) => (
                      <>
                        {/* área sombreada P(Z ≤ z) */}
                        {shaded.length > 1 && zClamped !== null && (
                          <path
                            d={
                              `M ${s.sx(shaded[0].x)} ${s.yBase} ` +
                              shaded
                                .map((pt) => `L ${s.sx(pt.x)} ${s.syTop(pt.y)}`)
                                .join(" ") +
                              ` L ${s.sx(zClamped)} ${s.yBase} Z`
                            }
                            fill={s.fills.area}
                          />
                        )}
                        {/* curva normal */}
                        <path
                          d={polyline(
                            STD_CURVE.pts.map((pt) => ({
                              x: s.sx(pt.x),
                              y: s.syTop(pt.y),
                            })),
                          )}
                          fill="none"
                          stroke="var(--vault-tint, var(--primary))"
                          strokeWidth={1.8}
                          {...s.curve()}
                        />
                        {/* línea vertical en z + etiqueta */}
                        {zClamped !== null && (
                          <>
                            <line
                              x1={s.sx(zClamped)}
                              x2={s.sx(zClamped)}
                              y1={s.yTopPx}
                              y2={s.yBase}
                              stroke="var(--accent)"
                              strokeWidth={1.4}
                              strokeDasharray="4 3"
                            />
                            <text
                              x={s.sx(zClamped)}
                              y={s.yTopPx + 2}
                              textAnchor="middle"
                              fontSize={9}
                              fontFamily="var(--font-mono)"
                              fill="var(--accent-text)"
                            >
                              z = {fmt(z, 2)}
                            </text>
                          </>
                        )}
                      </>
                    )}
                  </PlotFrame>
                  <PlotLegend
                    items={[
                      { kind: "line", label: "φ(z) — N(0, 1)" },
                      { kind: "area", label: "Φ(z) = P(Z ≤ z)" },
                      { kind: "dashed", color: "var(--accent)", label: "z" },
                    ]}
                  />
                </>
              );
            })()}

          {/* --- Curva N(μ,σ) con cola izquierda hasta x (modo estandarizar) --- */}
          {mode === "std" &&
            muSigCurve &&
            !("err" in stdize) &&
            (() => {
              const c = muSigCurve;
              const xClamped = Math.max(c.lo, Math.min(c.hi, stdize.x));
              const shaded = c.pts.filter((pt) => pt.x <= xClamped);
              return (
                <>
                  <PlotFrame
                    xLo={c.lo}
                    xHi={c.hi}
                    yMax={c.maxY}
                    xTicks={8}
                    xDecimals={1}
                    showYGrid={false}
                    ariaLabel="Densidad N(μ,σ) con área sombreada hasta x"
                  >
                    {(s) => (
                      <>
                        {shaded.length > 1 && (
                          <path
                            d={
                              `M ${s.sx(shaded[0].x)} ${s.yBase} ` +
                              shaded
                                .map((pt) => `L ${s.sx(pt.x)} ${s.syTop(pt.y)}`)
                                .join(" ") +
                              ` L ${s.sx(xClamped)} ${s.yBase} Z`
                            }
                            fill={s.fills.area}
                          />
                        )}
                        <path
                          d={polyline(
                            c.pts.map((pt) => ({
                              x: s.sx(pt.x),
                              y: s.syTop(pt.y),
                            })),
                          )}
                          fill="none"
                          stroke="var(--vault-tint, var(--primary))"
                          strokeWidth={1.8}
                          {...s.curve()}
                        />
                        <line
                          x1={s.sx(xClamped)}
                          x2={s.sx(xClamped)}
                          y1={s.yTopPx}
                          y2={s.yBase}
                          stroke="var(--accent)"
                          strokeWidth={1.4}
                          strokeDasharray="4 3"
                        />
                        <text
                          x={s.sx(xClamped)}
                          y={s.yTopPx + 2}
                          textAnchor="middle"
                          fontSize={9}
                          fontFamily="var(--font-mono)"
                          fill="var(--accent-text)"
                        >
                          x = {fmt(stdize.x, 2)}
                        </text>
                      </>
                    )}
                  </PlotFrame>
                  <PlotLegend
                    items={[
                      { kind: "line", label: "f(x) — N(μ, σ)" },
                      { kind: "area", label: "P(X ≤ x)" },
                      { kind: "dashed", color: "var(--accent)", label: "x" },
                    ]}
                  />
                </>
              );
            })()}

          {/* --- Curva N(μ,σ) con área entre a y b (modo intervalo) --- */}
          {mode === "between" &&
            muSigCurve &&
            !("err" in between) &&
            (() => {
              const c = muSigCurve;
              const aClamped = Math.max(c.lo, Math.min(c.hi, between.a));
              const bClamped = Math.max(c.lo, Math.min(c.hi, between.b));
              const shaded = c.pts.filter(
                (pt) => pt.x >= aClamped && pt.x <= bClamped,
              );
              return (
                <>
                  <PlotFrame
                    xLo={c.lo}
                    xHi={c.hi}
                    yMax={c.maxY}
                    xTicks={8}
                    xDecimals={1}
                    showYGrid={false}
                    ariaLabel="Densidad N(μ,σ) con área sombreada entre a y b"
                  >
                    {(s) => (
                      <>
                        {shaded.length > 1 && (
                          <path
                            d={
                              `M ${s.sx(aClamped)} ${s.yBase} ` +
                              shaded
                                .map((pt) => `L ${s.sx(pt.x)} ${s.syTop(pt.y)}`)
                                .join(" ") +
                              ` L ${s.sx(bClamped)} ${s.yBase} Z`
                            }
                            fill={s.fills.area}
                          />
                        )}
                        <path
                          d={polyline(
                            c.pts.map((pt) => ({
                              x: s.sx(pt.x),
                              y: s.syTop(pt.y),
                            })),
                          )}
                          fill="none"
                          stroke="var(--vault-tint, var(--primary))"
                          strokeWidth={1.8}
                          {...s.curve()}
                        />
                        {/* líneas verticales en a y b + etiquetas */}
                        <line
                          x1={s.sx(aClamped)}
                          x2={s.sx(aClamped)}
                          y1={s.yTopPx}
                          y2={s.yBase}
                          stroke="var(--accent)"
                          strokeWidth={1.4}
                          strokeDasharray="4 3"
                        />
                        <line
                          x1={s.sx(bClamped)}
                          x2={s.sx(bClamped)}
                          y1={s.yTopPx}
                          y2={s.yBase}
                          stroke="var(--accent)"
                          strokeWidth={1.4}
                          strokeDasharray="4 3"
                        />
                        <text
                          x={s.sx(aClamped)}
                          y={s.yTopPx + 2}
                          textAnchor="middle"
                          fontSize={9}
                          fontFamily="var(--font-mono)"
                          fill="var(--accent-text)"
                        >
                          a = {fmt(between.a, 2)}
                        </text>
                        <text
                          x={s.sx(bClamped)}
                          y={s.yTopPx + 2}
                          textAnchor="middle"
                          fontSize={9}
                          fontFamily="var(--font-mono)"
                          fill="var(--accent-text)"
                        >
                          b = {fmt(between.b, 2)}
                        </text>
                      </>
                    )}
                  </PlotFrame>
                  <PlotLegend
                    items={[
                      { kind: "line", label: "f(x) — N(μ, σ)" },
                      { kind: "area", label: "P(a ≤ X ≤ b)" },
                      {
                        kind: "dashed",
                        color: "var(--accent)",
                        label: "a, b",
                      },
                    ]}
                  />
                </>
              );
            })()}

          {/* Aviso si la curva N(μ,σ) no se puede dibujar por parámetros inválidos */}
          {(mode === "std" || mode === "between") && !muSigCurve && (
            <Note tone="error">
              Ingresá μ y σ &gt; 0 numéricos para ver la curva.
            </Note>
          )}

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
