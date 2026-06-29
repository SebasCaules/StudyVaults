"use client";

import { useMemo, useState } from "react";
import { Panel, SubPanel, Note, Field, TextInput, Chip } from "@studyvaults/ui";
import { normalCdf, normalQuantile, fmt } from "../lib/stats";
import { PlotFrame, PlotLegend, polyline } from "./plot";

/* ============================================================================
 * Potencia y error tipo II — prueba de la media con σ conocida.
 *
 * β(μ1), potencia = 1 − β(μ1) y diseño de tamaño muestral, según las fórmulas
 * de Proba/wiki/conceptos/error-tipo-i-y-tipo-ii.md y
 * Proba/wiki/tecnicas/diseno-de-prueba-tamano-muestral.md.
 * ========================================================================== */

// Parser numérico tolerante con fallback. Acepta coma o punto decimal.
function num(s: string, fallback = NaN): number {
  if (s.trim() === "") return fallback;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

type Tail = "two" | "right" | "left";

const TAIL_LABEL: Record<Tail, string> = {
  two: "Dos colas (μ ≠ μ₀)",
  right: "Cola derecha (μ > μ₀)",
  left: "Cola izquierda (μ < μ₀)",
};

const Φ = normalCdf;

type Xc =
  | { kind: "one"; v: number }
  | { kind: "two"; lo: number; hi: number };

type Core =
  | { ok: false; err: string }
  | {
      ok: true;
      m0: number;
      s: number;
      nn: number;
      a: number;
      m1: number;
      se: number;
      beta: number;
      power: number;
      xc: Xc;
    };

/**
 * β(μ1) para la prueba de la media con σ conocida.
 * d = (μ0 − μ1)/(σ/√n).
 *   Dos colas:      β = Φ(z_{1-α/2} + d) − Φ(−z_{1-α/2} + d)
 *   Cola derecha:   β = Φ(z_{1-α}   + d)
 *   Cola izquierda: β = 1 − Φ(−z_{1-α} + d)
 */
function betaAt(
  mu1: number,
  mu0: number,
  sigma: number,
  n: number,
  alpha: number,
  tail: Tail,
): number {
  const se = sigma / Math.sqrt(n);
  const d = (mu0 - mu1) / se;
  if (tail === "two") {
    const za = normalQuantile(1 - alpha / 2);
    return Φ(za + d) - Φ(-za + d);
  }
  const za = normalQuantile(1 - alpha);
  if (tail === "right") return Φ(za + d);
  // izquierda
  return 1 - Φ(-za + d);
}

export default function PotenciaErrorTool() {
  // Parámetros de la prueba (strings para tolerar edición parcial).
  const [mu0, setMu0] = useState("5000");
  const [sigma, setSigma] = useState("120");
  const [n, setN] = useState("50");
  const [alphaStr, setAlphaStr] = useState("0.05");
  const [tail, setTail] = useState<Tail>("left");
  const [mu1, setMu1] = useState("4960");

  // Diseño: β* objetivo (usa el mismo μ1 de arriba como valor alternativo).
  const [betaStar, setBetaStar] = useState("0.10");

  /* -------------------------------------------------------------------------
   * Validación y cálculo de β / potencia en μ1.
   * ---------------------------------------------------------------------- */
  const core = useMemo<Core>(() => {
    const m0 = num(mu0);
    const s = num(sigma);
    const nn = num(n);
    const a = num(alphaStr);
    const m1 = num(mu1);

    if (
      !Number.isFinite(m0) ||
      !Number.isFinite(s) ||
      !Number.isFinite(nn) ||
      !Number.isFinite(a) ||
      !Number.isFinite(m1)
    )
      return { ok: false, err: "Completá μ₀, σ, n, α y μ₁ con valores numéricos." };
    if (s <= 0) return { ok: false, err: "σ debe ser mayor que 0." };
    if (!Number.isInteger(nn) || nn < 1)
      return { ok: false, err: "n debe ser un entero ≥ 1." };
    if (a <= 0 || a >= 1) return { ok: false, err: "α debe estar en (0, 1)." };

    const se = s / Math.sqrt(nn);
    const beta = betaAt(m1, m0, s, nn, a, tail);
    const power = 1 - beta;

    // Valor crítico de la media muestral (sólo informativo, una cola).
    // Dos colas: dos fronteras simétricas; mostramos ambas.
    let xc: Xc;
    if (tail === "two") {
      const za = normalQuantile(1 - a / 2);
      xc = { kind: "two", lo: m0 - za * se, hi: m0 + za * se };
    } else {
      const za = normalQuantile(1 - a);
      xc = { kind: "one", v: tail === "right" ? m0 + za * se : m0 - za * se };
    }

    return { ok: true, m0, s, nn, a, m1, se, beta, power, xc };
  }, [mu0, sigma, n, alphaStr, tail, mu1]);

  /* -------------------------------------------------------------------------
   * Curva de potencia 1 − β(μ1) en μ0 ± 4·σ/√n.
   * ---------------------------------------------------------------------- */
  const plot = useMemo(() => {
    if (!core.ok) return null;
    const { m0, s, nn, a, m1, se } = core;
    const half = 4 * se;
    const xLo = m0 - half;
    const xHi = m0 + half;
    const N = 200;
    const pts: { x: number; power: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const x = xLo + ((xHi - xLo) * i) / N;
      pts.push({ x, power: 1 - betaAt(x, m0, s, nn, a, tail) });
    }
    // μ1 actual marcado (clamp al rango visible).
    const m1Clamped = Math.max(xLo, Math.min(xHi, m1));
    const m1InRange = m1 >= xLo && m1 <= xHi;
    return { xLo, xHi, pts, m1Clamped, m1InRange };
  }, [core, tail]);

  /* -------------------------------------------------------------------------
   * Diseño: despejar n (1 cola) y x̄_c para β* objetivo y este μ1.
   *   n = ((z_{1-α} + z_{1-β*})·σ / (μ1 − μ0))²  → redondeo hacia arriba.
   *   x̄_c = μ0 + z_{1-α}·σ/√n   (cola derecha; izquierda con signo −).
   * ---------------------------------------------------------------------- */
  const design = useMemo(() => {
    if (!core.ok) return null;
    const { m0, s, m1, a } = core;
    const bStar = num(betaStar);
    if (!Number.isFinite(bStar))
      return { err: "Ingresá un β* objetivo numérico." } as const;
    if (bStar <= 0 || bStar >= 1)
      return { err: "β* debe estar en (0, 1)." } as const;
    const delta = m1 - m0;
    if (Math.abs(delta) < 1e-12)
      return {
        err: "El diseño requiere μ₁ ≠ μ₀ (efecto a detectar no nulo).",
      } as const;

    const z1a = normalQuantile(1 - a);
    const z1b = normalQuantile(1 - bStar);
    const nReal = Math.pow(((z1a + z1b) * s) / delta, 2);
    const nCeil = Math.ceil(nReal);
    const se = s / Math.sqrt(nCeil);
    // Frontera de un lado, según el sentido del efecto.
    const xc = delta > 0 ? m0 + z1a * se : m0 - z1a * se;
    // β alcanzado con ese n entero (misma cola unilateral que el efecto).
    const tailEff: Tail = delta > 0 ? "right" : "left";
    const betaHit = betaAt(m1, m0, s, nCeil, a, tailEff);

    return { bStar, z1a, z1b, nReal, nCeil, xc, betaHit, delta } as const;
  }, [core, betaStar]);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Potencia y error tipo II</h3>
        <p>
          β(μ₁), potencia 1−β y diseño del tamaño muestral para la prueba de la
          media con σ conocida.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* Controles */}
        <div className="vtool-stack">
          <div className="vtool-row">
            <Field label="μ₀ (nula)" htmlFor="pe-mu0" style={{ flex: 1 }}>
              <TextInput
                id="pe-mu0"
                value={mu0}
                onChange={(e) => setMu0(e.target.value)}
                inputMode="decimal"
              />
            </Field>
            <Field label={<>σ &gt; 0</>} htmlFor="pe-sigma" style={{ flex: 1 }}>
              <TextInput
                id="pe-sigma"
                value={sigma}
                onChange={(e) => setSigma(e.target.value)}
                inputMode="decimal"
              />
            </Field>
          </div>

          <div className="vtool-row">
            <Field label="n (entero ≥ 1)" htmlFor="pe-n" style={{ flex: 1 }}>
              <TextInput
                id="pe-n"
                value={n}
                onChange={(e) => setN(e.target.value)}
                inputMode="numeric"
              />
            </Field>
            <Field label="α ∈ (0, 1)" htmlFor="pe-alpha" style={{ flex: 1 }}>
              <TextInput
                id="pe-alpha"
                value={alphaStr}
                onChange={(e) => setAlphaStr(e.target.value)}
                inputMode="decimal"
              />
            </Field>
          </div>

          <div className="vtool-field">
            <label className="vtool-label">
              <span>Tipo de prueba (cola)</span>
            </label>
            <div className="vtool-row" style={{ marginTop: 8 }}>
              {(Object.keys(TAIL_LABEL) as Tail[]).map((t) => (
                <Chip key={t} active={tail === t} onClick={() => setTail(t)}>
                  {t === "two" ? "Dos colas" : t === "right" ? "Derecha" : "Izquierda"}
                </Chip>
              ))}
            </div>
            <Note style={{ marginTop: 8 }}>{TAIL_LABEL[tail]}.</Note>
          </div>

          <Field
            label="μ₁ (valor alternativo)"
            hint="el μ real bajo H₁"
            htmlFor="pe-mu1"
          >
            <TextInput
              id="pe-mu1"
              value={mu1}
              onChange={(e) => setMu1(e.target.value)}
              inputMode="decimal"
            />
          </Field>

          {/* β y potencia en μ1 */}
          {!core.ok ? (
            <Note tone="error">{core.err}</Note>
          ) : (
            <SubPanel>
              <div className="vtool-eyebrow">En μ₁ = {fmt(core.m1, 2)}</div>
              <div className="vtool-readout" style={{ marginTop: 8 }}>
                <div className="vtool-kv">
                  <span className="k">β(μ₁) — error tipo II</span>
                  <span className="v coral">{fmt(core.beta)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Potencia = 1 − β(μ₁)</span>
                  <span className="v acc">{fmt(core.power)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">σ/√n (error estándar)</span>
                  <span className="v">{fmt(core.se)}</span>
                </div>
                {core.xc.kind === "one" ? (
                  <div className="vtool-kv">
                    <span className="k">x̄_c (frontera)</span>
                    <span className="v">{fmt(core.xc.v)}</span>
                  </div>
                ) : (
                  <div className="vtool-kv">
                    <span className="k">x̄_c (dos fronteras)</span>
                    <span className="v">
                      {fmt(core.xc.lo, 2)} · {fmt(core.xc.hi, 2)}
                    </span>
                  </div>
                )}
              </div>
            </SubPanel>
          )}
        </div>

        {/* Salida: curva de potencia + diseño */}
        <div className="vtool-stack">
          {!core.ok ? (
            <Note tone="error">{core.err}</Note>
          ) : (
            plot && (
              <>
                <PlotFrame
                  xLo={plot.xLo}
                  xHi={plot.xHi}
                  yMax={1}
                  yTicks={4}
                  xDecimals={core.se >= 10 ? 0 : 2}
                  yDecimals={1}
                  ariaLabel="Curva de potencia 1 − β(μ₁) en función de μ₁"
                >
                  {(s) => (
                    <>
                      {/* línea de potencia = α en μ0 (β(μ0)=1−α) */}
                      <line
                        x1={s.sx(s.xLo)}
                        x2={s.sx(s.xHi)}
                        y1={s.syUnit(core.a)}
                        y2={s.syUnit(core.a)}
                        stroke="var(--hairline-strong)"
                        strokeWidth={1}
                        strokeDasharray="2 3"
                      />
                      {/* curva de potencia */}
                      <path
                        d={polyline(
                          plot.pts.map((p) => ({
                            x: s.sx(p.x),
                            y: s.syUnit(p.power),
                          })),
                        )}
                        fill="none"
                        stroke="var(--vault-tint, var(--primary))"
                        strokeWidth={1.8}
                      />
                      {/* μ0 (referencia) */}
                      <line
                        x1={s.sx(core.m0)}
                        x2={s.sx(core.m0)}
                        y1={s.yTopPx}
                        y2={s.yBase}
                        stroke="var(--hairline-strong)"
                        strokeWidth={1}
                      />
                      <text
                        x={s.sx(core.m0)}
                        y={s.yBase - 4}
                        textAnchor="middle"
                        fontSize={8}
                        fontFamily="var(--font-mono)"
                        fill="var(--text-secondary)"
                      >
                        μ₀
                      </text>
                      {/* μ1 actual marcado */}
                      {plot.m1InRange && (
                        <>
                          <line
                            x1={s.sx(plot.m1Clamped)}
                            x2={s.sx(plot.m1Clamped)}
                            y1={s.yTopPx}
                            y2={s.yBase}
                            stroke="var(--accent)"
                            strokeWidth={1.4}
                            strokeDasharray="4 3"
                          />
                          <circle
                            cx={s.sx(plot.m1Clamped)}
                            cy={s.syUnit(core.power)}
                            r={3}
                            fill="var(--accent)"
                          />
                          <text
                            x={s.sx(plot.m1Clamped)}
                            y={s.yTopPx + 2}
                            textAnchor="middle"
                            fontSize={9}
                            fontFamily="var(--font-mono)"
                            fill="var(--accent-text)"
                          >
                            μ₁ = {fmt(core.m1, 2)}
                          </text>
                        </>
                      )}
                    </>
                  )}
                </PlotFrame>
                <PlotLegend
                  items={[
                    { kind: "line", label: "Potencia 1 − β(μ₁)" },
                    {
                      kind: "dashed",
                      color: "var(--accent)",
                      label: "μ₁ actual",
                    },
                    {
                      kind: "dashed",
                      color: "var(--hairline-strong)",
                      label: <>α en μ₀</>,
                    },
                  ]}
                />
                <Note>
                  En μ₀ la potencia vale α (es decir β(μ₀) = 1 − α): la prueba
                  rechaza con la misma probabilidad que el nivel de significación.
                  La potencia crece (β baja) a medida que μ₁ se aleja de μ₀ hacia
                  H₁.
                </Note>
              </>
            )
          )}

          {/* Diseño del tamaño muestral */}
          <SubPanel>
            <div className="vtool-eyebrow">Diseño: despejar n y x̄_c</div>
            <Field
              label="β* objetivo ∈ (0, 1)"
              hint="error tipo II tolerado en μ₁"
              htmlFor="pe-betastar"
              style={{ marginTop: 8 }}
            >
              <TextInput
                id="pe-betastar"
                value={betaStar}
                onChange={(e) => setBetaStar(e.target.value)}
                inputMode="decimal"
              />
            </Field>

            {!design ? (
              <Note tone="error" style={{ marginTop: 10 }}>
                Corregí los parámetros de la prueba para diseñar.
              </Note>
            ) : "err" in design ? (
              <Note tone="error" style={{ marginTop: 10 }}>
                {design.err}
              </Note>
            ) : (
              <>
                <div className="vtool-bignum" style={{ marginTop: 12 }}>
                  {design.nCeil}
                  <small> = n mínimo (⌈{fmt(design.nReal, 2)}⌉)</small>
                </div>
                <div className="vtool-readout" style={{ marginTop: 10 }}>
                  <div className="vtool-kv">
                    <span className="k">z₁₋α</span>
                    <span className="v">{fmt(design.z1a)}</span>
                  </div>
                  <div className="vtool-kv">
                    <span className="k">z₁₋β*</span>
                    <span className="v">{fmt(design.z1b)}</span>
                  </div>
                  <div className="vtool-kv">
                    <span className="k">x̄_c con n = {design.nCeil}</span>
                    <span className="v acc">{fmt(design.xc)}</span>
                  </div>
                  <div className="vtool-kv">
                    <span className="k">β(μ₁) con ese n</span>
                    <span className="v coral">{fmt(design.betaHit)}</span>
                  </div>
                </div>
                <Note style={{ marginTop: 10 }}>
                  Diseño de una cola: n = ⌈((z₁₋α + z₁₋β*)·σ / (μ₁ − μ₀))²⌉ y
                  x̄_c = μ₀ {design.delta > 0 ? "+" : "−"} z₁₋α·σ/√n. Detectar
                  efectos más chicos (|μ₁ − μ₀| menor) cuadruplica n al partir la
                  brecha a la mitad.
                </Note>
              </>
            )}
          </SubPanel>
        </div>
      </div>
    </Panel>
  );
}
