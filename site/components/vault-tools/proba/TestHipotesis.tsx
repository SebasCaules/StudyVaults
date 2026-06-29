"use client";

import { useMemo, useState } from "react";
import { Panel, SubPanel, Note, Field, TextInput, Select, Chip, Badge } from "@studyvaults/ui";
import {
  normalPdf,
  normalCdf,
  normalQuantile,
  studentTPdf,
  studentTCdf,
  studentTQuantile,
  fmt,
} from "../lib/stats";
import { PlotFrame, PlotLegend, polyline } from "./plot";

/* ============================================================================
 * Test de hipótesis — Z para la media (σ conocido), T para la media
 * (σ desconocido) y Z para una proporción. Calcula el estadístico observado,
 * el/los valor(es) crítico(s), la región de rechazo, el valor p y la decisión,
 * con un gráfico de la densidad de referencia (N(0,1) o t_{n-1}) sombreando la
 * región de rechazo y marcando el estadístico observado.
 * ========================================================================== */

// Parser numérico tolerante con coma o punto decimal.
function num(s: string, fb = NaN): number {
  if (s.trim() === "") return fb;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fb;
}

type TestKey = "mediaZ" | "mediaT" | "prop";
type Tail = "two" | "right" | "left";

const TEST_LABELS: Record<TestKey, string> = {
  mediaZ: "Media — Z (σ conocido)",
  mediaT: "Media — T (σ desconocido)",
  prop: "Proporción — Z",
};

// Cuál es el cuantil de referencia (Z o t) según el test.
function isT(kind: TestKey): boolean {
  return kind === "mediaT";
}

type Result =
  | { err: string }
  | {
      stat: number; // estadístico observado (z o t)
      df: number | null; // g.l. si es t; null si es Z
      crit: number; // |valor crítico| (z_{1-α/2}, z_{1-α}, …)
      pValue: number;
      reject: boolean;
      statLabel: string; // "Z" o "T"
    };

export default function TestHipotesisTool() {
  const [kind, setKind] = useState<TestKey>("mediaZ");
  const [tail, setTail] = useState<Tail>("two");

  // Parámetros (strings para tolerar edición parcial).
  const [h0, setH0] = useState("100"); // μ0 o q0
  const [est, setEst] = useState("103"); // x̄ o p̂
  const [nStr, setN] = useState("36"); // tamaño muestral
  const [sd, setSd] = useState("8"); // σ ó S (no aplica a proporción)
  const [alphaStr, setAlpha] = useState("0.05");

  const res = useMemo((): Result => {
    const mu0 = num(h0); // valor de H0 (μ0 o q0)
    const obs = num(est); // estimador observado (x̄ o p̂)
    const n = num(nStr);
    const alpha = num(alphaStr);

    if (!Number.isFinite(mu0))
      return { err: `Ingresá el valor de H₀ (${kind === "prop" ? "q₀" : "μ₀"}).` };
    if (!Number.isFinite(obs))
      return {
        err: `Ingresá el estimador observado (${kind === "prop" ? "p̂" : "x̄"}).`,
      };
    if (!Number.isFinite(n)) return { err: "Ingresá n numérico." };
    if (!Number.isInteger(n) || n < 1)
      return { err: "n debe ser un entero ≥ 1." };
    if (!Number.isFinite(alpha)) return { err: "Ingresá α numérico." };
    if (alpha <= 0 || alpha >= 1) return { err: "α debe estar en (0, 1)." };

    let stat: number;
    let df: number | null = null;
    let statLabel: string;

    if (kind === "prop") {
      // Z_prop = (p̂ − q0) / √(q0(1−q0)/n).
      if (mu0 <= 0 || mu0 >= 1)
        return { err: "q₀ (proporción de H₀) debe estar en (0, 1)." };
      if (obs < 0 || obs > 1)
        return { err: "p̂ (proporción observada) debe estar en [0, 1]." };
      const se = Math.sqrt((mu0 * (1 - mu0)) / n);
      if (se === 0) return { err: "Error estándar nulo: revisá q₀ y n." };
      stat = (obs - mu0) / se;
      statLabel = "Z";
    } else {
      // Media: σ/√n (Z) o S/√n (T).
      const s = num(sd);
      const sName = kind === "mediaZ" ? "σ" : "S";
      if (!Number.isFinite(s)) return { err: `Ingresá ${sName} numérico.` };
      if (s <= 0) return { err: `${sName} debe ser mayor que 0.` };
      const se = s / Math.sqrt(n);
      stat = (obs - mu0) / se;
      if (kind === "mediaT") {
        if (n < 2) return { err: "Para la T se requiere n ≥ 2 (g.l. = n−1)." };
        df = n - 1;
        statLabel = "T";
      } else {
        statLabel = "Z";
      }
    }

    if (!Number.isFinite(stat))
      return { err: "El estadístico no es finito: revisá los parámetros." };

    // Cuantil crítico y valor p según la distribución de referencia.
    const useT = isT(kind);
    const quantile = (p: number) =>
      useT && df !== null ? studentTQuantile(p, df) : normalQuantile(p);
    const sf = (z: number) =>
      useT && df !== null ? 1 - studentTCdf(z, df) : 1 - normalCdf(z); // P(· ≥ z)
    const cdf = (z: number) =>
      useT && df !== null ? studentTCdf(z, df) : normalCdf(z); // P(· ≤ z)

    let crit: number;
    let pValue: number;
    let reject: boolean;
    if (tail === "two") {
      crit = quantile(1 - alpha / 2); // z_{1-α/2}
      pValue = 2 * sf(Math.abs(stat));
      reject = Math.abs(stat) > crit;
    } else if (tail === "right") {
      crit = quantile(1 - alpha); // z_{1-α}
      pValue = sf(stat);
      reject = stat > crit;
    } else {
      crit = quantile(1 - alpha); // |crítico| = z_{1-α}; el límite real es −crit
      pValue = cdf(stat);
      reject = stat < -crit;
    }

    return { stat, df, crit, pValue, reject, statLabel };
  }, [kind, tail, h0, est, nStr, sd, alphaStr]);

  const ok = !("err" in res);
  const stat = ok ? res.stat : NaN;
  const df = ok ? res.df : null;
  const crit = ok ? res.crit : NaN;

  // Densidad de referencia para el plot (N(0,1) o t_{n-1}).
  const curve = useMemo(() => {
    const lo = -4;
    const hi = 4;
    const N = 200;
    const pts: { x: number; y: number }[] = [];
    let maxY = 0;
    const pdf = (x: number) =>
      df !== null ? studentTPdf(x, df) : normalPdf(x);
    for (let i = 0; i <= N; i++) {
      const x = lo + ((hi - lo) * i) / N;
      const y = pdf(x);
      pts.push({ x, y });
      if (y > maxY) maxY = y;
    }
    return { lo, hi, pts, maxY: maxY || 1 };
  }, [df]);

  // Región(es) de rechazo recortadas al dominio del gráfico.
  const critClamped = Number.isFinite(crit)
    ? Math.max(curve.lo, Math.min(curve.hi, crit))
    : null;
  const statClamped = Number.isFinite(stat)
    ? Math.max(curve.lo, Math.min(curve.hi, stat))
    : null;

  // H₀ / H₁ legible según la cola y el parámetro.
  const param = kind === "prop" ? "q" : "μ";
  const h0h1: Record<Tail, { h0: string; h1: string }> = {
    two: { h0: `${param} = ${param}₀`, h1: `${param} ≠ ${param}₀` },
    right: { h0: `${param} ≤ ${param}₀`, h1: `${param} > ${param}₀` },
    left: { h0: `${param} ≥ ${param}₀`, h1: `${param} < ${param}₀` },
  };

  const refName = df !== null ? `t₍${df}₎` : "N(0, 1)";

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Test de hipótesis</h3>
        <p>
          Elegí el tipo de prueba y la cola, cargá los datos de la muestra y leé
          el estadístico, la región de rechazo, el valor p y la decisión.
        </p>
      </div>

      <div className="vtool-row" style={{ marginBottom: 16, flexWrap: "wrap" }}>
        <Chip active={tail === "two"} onClick={() => setTail("two")}>
          Dos colas ( = / ≠ )
        </Chip>
        <Chip active={tail === "right"} onClick={() => setTail("right")}>
          Cola derecha ( ≤ / &gt; )
        </Chip>
        <Chip active={tail === "left"} onClick={() => setTail("left")}>
          Cola izquierda ( ≥ / &lt; )
        </Chip>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* Controles */}
        <div className="vtool-stack">
          <Field label="Tipo de prueba" htmlFor="th-kind">
            <Select
              id="th-kind"
              value={kind}
              onChange={(e) => setKind(e.target.value as TestKey)}
            >
              {(Object.keys(TEST_LABELS) as TestKey[]).map((k) => (
                <option key={k} value={k}>
                  {TEST_LABELS[k]}
                </option>
              ))}
            </Select>
          </Field>

          <div className="vtool-row">
            <Field
              label={kind === "prop" ? "q₀ (H₀)" : "μ₀ (H₀)"}
              htmlFor="th-h0"
              style={{ flex: 1 }}
            >
              <TextInput
                id="th-h0"
                value={h0}
                onChange={(e) => setH0(e.target.value)}
                inputMode="decimal"
              />
            </Field>
            <Field
              label={kind === "prop" ? "p̂ (observada)" : "x̄ (observada)"}
              htmlFor="th-est"
              style={{ flex: 1 }}
            >
              <TextInput
                id="th-est"
                value={est}
                onChange={(e) => setEst(e.target.value)}
                inputMode="decimal"
              />
            </Field>
          </div>

          <div className="vtool-row">
            <Field label="n (entero ≥ 1)" htmlFor="th-n" style={{ flex: 1 }}>
              <TextInput
                id="th-n"
                value={nStr}
                onChange={(e) => setN(e.target.value)}
                inputMode="numeric"
              />
            </Field>
            {kind !== "prop" && (
              <Field
                label={kind === "mediaZ" ? "σ > 0 (conocido)" : "S > 0 (muestral)"}
                htmlFor="th-sd"
                style={{ flex: 1 }}
              >
                <TextInput
                  id="th-sd"
                  value={sd}
                  onChange={(e) => setSd(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
            )}
            <Field label="α ∈ (0, 1)" htmlFor="th-alpha" style={{ flex: 1 }}>
              <TextInput
                id="th-alpha"
                value={alphaStr}
                onChange={(e) => setAlpha(e.target.value)}
                inputMode="decimal"
              />
            </Field>
          </div>

          <SubPanel>
            <div className="vtool-eyebrow">Hipótesis y estadístico</div>
            <div className="vtool-readout" style={{ marginTop: 8 }}>
              <div className="vtool-kv">
                <span className="k">H₀</span>
                <span className="v">{h0h1[tail].h0}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">H₁</span>
                <span className="v acc">{h0h1[tail].h1}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Distribución bajo H₀</span>
                <span className="v">{refName}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Estadístico</span>
                <span className="v">
                  {kind === "prop"
                    ? "Z = (p̂ − q₀)/√(q₀(1−q₀)/n)"
                    : kind === "mediaT"
                      ? "T = (x̄ − μ₀)/(S/√n)"
                      : "Z = (x̄ − μ₀)/(σ/√n)"}
                </span>
              </div>
            </div>
          </SubPanel>
        </div>

        {/* Salida: resultado + plot */}
        <div className="vtool-stack">
          {!ok ? (
            <Note tone="error">{res.err}</Note>
          ) : (
            <>
              <SubPanel>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    flexWrap: "wrap",
                  }}
                >
                  <div className="vtool-bignum" style={{ margin: 0 }}>
                    {fmt(res.stat)}
                    <small> = {res.statLabel}_obs</small>
                  </div>
                  <span
                    style={{
                      color: res.reject
                        ? "var(--accent-text)"
                        : "var(--ink-strong)",
                    }}
                  >
                    <Badge variant="solid">
                      {res.reject ? "Rechazar H₀" : "No rechazar H₀"}
                    </Badge>
                  </span>
                </div>

                <div className="vtool-readout" style={{ marginTop: 12 }}>
                  <div className="vtool-kv">
                    <span className="k">{res.statLabel} observado</span>
                    <span className="v">{fmt(res.stat)}</span>
                  </div>
                  <div className="vtool-kv">
                    <span className="k">
                      {tail === "two"
                        ? "Valor(es) crítico(s)"
                        : "Valor crítico"}
                    </span>
                    <span className="v acc">
                      {tail === "two"
                        ? `±${fmt(res.crit)}`
                        : tail === "right"
                          ? `+${fmt(res.crit)}`
                          : `−${fmt(res.crit)}`}
                    </span>
                  </div>
                  <div className="vtool-kv">
                    <span className="k">Región de rechazo</span>
                    <span className="v">
                      {tail === "two"
                        ? `|${res.statLabel}| > ${fmt(res.crit)}`
                        : tail === "right"
                          ? `${res.statLabel} > ${fmt(res.crit)}`
                          : `${res.statLabel} < −${fmt(res.crit)}`}
                    </span>
                  </div>
                  <div className="vtool-kv">
                    <span className="k">Valor p</span>
                    <span className="v coral">{fmt(res.pValue)}</span>
                  </div>
                  <div className="vtool-kv">
                    <span className="k">Decisión (α = {fmt(num(alphaStr), 3)})</span>
                    <span className="v">
                      {res.reject ? "se rechaza H₀" : "no se rechaza H₀"}
                    </span>
                  </div>
                </div>
              </SubPanel>

              <PlotFrame
                xLo={curve.lo}
                xHi={curve.hi}
                yMax={curve.maxY}
                xTicks={8}
                xDecimals={0}
                showYGrid={false}
                ariaLabel={`Densidad ${refName} con región de rechazo y estadístico observado`}
              >
                  {({ sx, syTop, yBase, yTopPx, fills, curve: drawCurve }) => {
                    // Sombreado de la región de rechazo según la cola.
                    const shadeRight =
                      critClamped !== null && (tail === "two" || tail === "right")
                        ? curve.pts.filter((pt) => pt.x >= critClamped)
                        : [];
                    const shadeLeft =
                      critClamped !== null && (tail === "two" || tail === "left")
                        ? curve.pts.filter((pt) => pt.x <= -critClamped)
                        : [];
                    const areaPath = (
                      seg: { x: number; y: number }[],
                      edge: number,
                    ) => {
                      if (seg.length < 2) return "";
                      const inner = tail === "right" || (tail === "two" && edge > 0)
                        ? seg[0].x
                        : seg[seg.length - 1].x;
                      const outer = tail === "right" || (tail === "two" && edge > 0)
                        ? seg[seg.length - 1].x
                        : seg[0].x;
                      return (
                        `M ${sx(inner)} ${yBase} ` +
                        seg.map((pt) => `L ${sx(pt.x)} ${syTop(pt.y)}`).join(" ") +
                        ` L ${sx(outer)} ${yBase} Z`
                      );
                    };
                    return (
                      <>
                        {shadeRight.length > 1 && (
                          <path
                            d={areaPath(shadeRight, 1)}
                            fill={fills.areaAccent}
                          />
                        )}
                        {shadeLeft.length > 1 && (
                          <path
                            d={areaPath(shadeLeft, -1)}
                            fill={fills.areaAccent}
                          />
                        )}

                        {/* curva de densidad */}
                        <path
                          d={polyline(
                            curve.pts.map((pt) => ({
                              x: sx(pt.x),
                              y: syTop(pt.y),
                            })),
                          )}
                          fill="none"
                          stroke="var(--vault-tint, var(--primary))"
                          strokeWidth={1.8}
                          {...drawCurve()}
                        />

                        {/* límites críticos */}
                        {critClamped !== null &&
                          (tail === "two" || tail === "right") && (
                            <line
                              x1={sx(critClamped)}
                              x2={sx(critClamped)}
                              y1={syTop(0)}
                              y2={yTopPx}
                              stroke="var(--accent)"
                              strokeWidth={1}
                              strokeDasharray="3 3"
                            />
                          )}
                        {critClamped !== null &&
                          (tail === "two" || tail === "left") && (
                            <line
                              x1={sx(-critClamped)}
                              x2={sx(-critClamped)}
                              y1={syTop(0)}
                              y2={yTopPx}
                              stroke="var(--accent)"
                              strokeWidth={1}
                              strokeDasharray="3 3"
                            />
                          )}

                        {/* línea vertical en el estadístico observado */}
                        {statClamped !== null && (
                          <line
                            x1={sx(statClamped)}
                            x2={sx(statClamped)}
                            y1={syTop(0)}
                            y2={yTopPx}
                            stroke="var(--ink-strong)"
                            strokeWidth={1.6}
                          />
                        )}
                        {statClamped !== null && (
                          <text
                            x={sx(statClamped)}
                            y={yTopPx + 2}
                            textAnchor="middle"
                            fontSize={9}
                            fontFamily="var(--font-mono)"
                            fill="var(--ink-strong)"
                          >
                            {res.statLabel} = {fmt(stat, 2)}
                          </text>
                        )}
                      </>
                    );
                  }}
              </PlotFrame>
              <PlotLegend
                items={[
                  { kind: "line", label: <>densidad {refName}</> },
                  {
                    kind: "area",
                    color: "var(--accent)",
                    label: "región de rechazo",
                  },
                  {
                    kind: "line",
                    color: "var(--ink-strong)",
                    label: `${res.statLabel} observado`,
                  },
                ]}
              />
            </>
          )}

          <Note style={{ marginTop: 12 }}>
            Regla de decisión equivalente: se rechaza H₀ <b>⟺ valor p &lt; α</b>.
            El valor p es el α más chico al que todavía se rechazaría H₀.
          </Note>
        </div>
      </div>
    </Panel>
  );
}