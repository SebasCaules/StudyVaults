"use client";

import { useMemo, useState } from "react";
import { Panel, SubPanel, Note, Field, TextInput, Badge } from "@studyvaults/ui";
import { binomial, normalCdf, normalPdf, fmt } from "../lib/stats";
import { PlotFrame, PlotLegend, polyline } from "./plot";

/* ============================================================================
 * Aproximación normal de la binomial (De Moivre–Laplace)
 * Bin(n,p) ≈ N(np, √(npq)), con corrección por continuidad.
 * Backbone matemático en ../lib/stats; gráfico en ./plot.
 * ========================================================================== */

// Parser numérico tolerante con coma o punto. Fallback NaN.
function num(s: string, fb = NaN): number {
  if (s.trim() === "") return fb;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fb;
}

export default function AproxNormalTool() {
  // Parámetros como strings para tolerar edición parcial.
  const [nStr, setNStr] = useState("100");
  const [pStr, setPStr] = useState("0.8");
  const [aStr, setAStr] = useState("71");
  const [bStr, setBStr] = useState("89");

  const model = useMemo(() => {
    const n = num(nStr);
    const p = num(pStr);
    const a = num(aStr);
    const b = num(bStr);

    if (!Number.isFinite(n) || !Number.isFinite(p))
      return { err: "Ingresá n y p numéricos." as const };
    if (!Number.isInteger(n) || n < 1)
      return { err: "n debe ser un entero ≥ 1." as const };
    if (p <= 0 || p >= 1) return { err: "p debe estar en (0, 1)." as const };
    if (!Number.isFinite(a) || !Number.isFinite(b))
      return { err: "Ingresá el intervalo [a, b] con enteros." as const };
    if (!Number.isInteger(a) || !Number.isInteger(b))
      return { err: "a y b deben ser enteros." as const };
    if (b < a) return { err: "Se requiere a ≤ b." as const };

    const q = 1 - p;
    const np = n * p;
    const npq = np * q;
    const sigma = Math.sqrt(npq);

    const dist = binomial(n, p);

    // (1) Exacto binomial = Σ_{k=a}^{b} pmf(k) = cdf(b) − cdf(a−1).
    const exact = dist.cdf(b) - dist.cdf(a - 1);

    // (2) Normal SIN corrección = Φ((b−np)/σ) − Φ((a−np)/σ).
    const approxRaw = normalCdf((b - np) / sigma) - normalCdf((a - np) / sigma);

    // (3) Normal CON corrección por continuidad =
    //     Φ((b+½−np)/σ) − Φ((a−½−np)/σ).
    const approxCC =
      normalCdf((b + 0.5 - np) / sigma) - normalCdf((a - 0.5 - np) / sigma);

    // Regla práctica np ≥ 5 y nq ≥ 5.
    const nq = n * q;
    const ruleOk = np >= 5 && nq >= 5;

    return {
      n,
      p,
      q,
      np,
      nq,
      npq,
      sigma,
      a,
      b,
      dist,
      exact,
      approxRaw,
      approxCC,
      errRaw: Math.abs(approxRaw - exact),
      errCC: Math.abs(approxCC - exact),
      ruleOk,
    };
  }, [nStr, pStr, aStr, bStr]);

  // Datos del gráfico: barras de la binomial + curva normal superpuesta.
  const plot = useMemo(() => {
    if ("err" in model) return null;
    const { n, np, sigma, a, b, dist } = model;

    // Ventana de graficado centrada en la campana, recortada a [0, n].
    const lo = Math.max(0, Math.floor(np - 4 * sigma));
    const hi = Math.min(n, Math.ceil(np + 4 * sigma));

    // Limitar la cantidad de barras dibujadas para n grande.
    const maxBars = 70;
    const step = Math.max(1, Math.ceil((hi - lo + 1) / maxBars));

    const pmfFn = (dist as { pmf: (k: number) => number }).pmf;
    const bars: { k: number; pmf: number; inRange: boolean }[] = [];
    let maxP = 0;
    for (let k = lo; k <= hi; k += step) {
      const pm = pmfFn(k);
      bars.push({ k, pmf: pm, inRange: k >= a && k <= b });
      if (pm > maxP) maxP = pm;
    }

    // Curva N(np, σ) muestreada finamente sobre el mismo dominio.
    const N = 180;
    const curve: { x: number; y: number }[] = [];
    for (let i = 0; i <= N; i++) {
      const x = lo + ((hi - lo) * i) / N;
      const y = normalPdf(x, np, sigma);
      curve.push({ x, y });
      if (y > maxP) maxP = y;
    }

    // Sombra del intervalo continuo [a−0.5, b+0.5] bajo la curva normal.
    const shLo = a - 0.5;
    const shHi = b + 0.5;
    const shade = curve.filter((pt) => pt.x >= shLo && pt.x <= shHi);

    return {
      lo,
      hi,
      bars,
      curve,
      maxP: maxP || 1,
      shLo,
      shHi,
      shade,
    };
  }, [model]);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Aproximación normal de la binomial</h3>
        <p>
          De Moivre–Laplace: Bin(n, p) ≈ N(np, √(npq)). Compará el valor exacto
          con la normal sin y con corrección por continuidad.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* Controles */}
        <div className="vtool-stack">
          <div className="vtool-row">
            <Field label="n (entero ≥ 1)" htmlFor="an-n" style={{ flex: 1 }}>
              <TextInput
                id="an-n"
                value={nStr}
                onChange={(e) => setNStr(e.target.value)}
                inputMode="numeric"
              />
            </Field>
            <Field label="p ∈ (0, 1)" htmlFor="an-p" style={{ flex: 1 }}>
              <TextInput
                id="an-p"
                value={pStr}
                onChange={(e) => setPStr(e.target.value)}
                inputMode="decimal"
              />
            </Field>
          </div>

          <Field
            label="Intervalo entero [a, b]"
            hint="se calcula P(a ≤ X ≤ b)"
            htmlFor="an-a"
          >
            <div className="vtool-row">
              <TextInput
                id="an-a"
                value={aStr}
                onChange={(e) => setAStr(e.target.value)}
                inputMode="numeric"
                aria-label="a"
              />
              <TextInput
                id="an-b"
                value={bStr}
                onChange={(e) => setBStr(e.target.value)}
                inputMode="numeric"
                aria-label="b"
              />
            </div>
          </Field>

          {!("err" in model) && (
            <SubPanel>
              <div className="vtool-eyebrow">Parámetros de la normal</div>
              <div className="vtool-readout" style={{ marginTop: 8 }}>
                <div className="vtool-kv">
                  <span className="k">np = E[X]</span>
                  <span className="v acc">{fmt(model.np)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">npq = Var(X)</span>
                  <span className="v">{fmt(model.npq)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">σ = √(npq)</span>
                  <span className="v">{fmt(model.sigma)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">q = 1 − p</span>
                  <span className="v">{fmt(model.q)}</span>
                </div>
              </div>
            </SubPanel>
          )}
        </div>

        {/* Salida: error / readout + plot */}
        <div className="vtool-stack">
          {"err" in model ? (
            <Note tone="error">{model.err}</Note>
          ) : (
            <>
              <SubPanel>
                <div className="vtool-eyebrow">
                  P({model.a} ≤ X ≤ {model.b})
                </div>
                <table className="vtool-table" style={{ marginTop: 8 }}>
                  <thead>
                    <tr>
                      <th>Método</th>
                      <th>Valor</th>
                      <th>|aprox − exacto|</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Exacto (binomial)</td>
                      <td>
                        <code>{fmt(model.exact)}</code>
                      </td>
                      <td>
                        <code>—</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Normal sin corrección</td>
                      <td>
                        <code>{fmt(model.approxRaw)}</code>
                      </td>
                      <td>
                        <code>{fmt(model.errRaw)}</code>
                      </td>
                    </tr>
                    <tr>
                      <td>Normal con corrección</td>
                      <td>
                        <code>{fmt(model.approxCC)}</code>
                      </td>
                      <td>
                        <code>{fmt(model.errCC)}</code>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Note style={{ marginTop: 10 }}>
                  Corrección por continuidad: P(a ≤ X ≤ b) ≈ Φ((b+½−np)/σ) −
                  Φ((a−½−np)/σ). Como la binomial es discreta, ensancha el
                  intervalo a [a−½, b+½] y suele recortar el error frente a la
                  versión sin corrección.
                </Note>
              </SubPanel>

              {plot && (
                <>
                  <PlotFrame
                    xLo={plot.lo}
                    xHi={plot.hi}
                    yMax={plot.maxP}
                    xDecimals={0}
                    yDecimals={3}
                    ariaLabel={`Binomial(${model.n}, ${model.p}) con la normal N(${fmt(
                      model.np,
                      2,
                    )}, ${fmt(model.sigma, 2)}) superpuesta`}
                  >
                    {(s) => (
                      <>
                        {/* Sombra del intervalo continuo [a−½, b+½] bajo la normal */}
                        {plot.shade.length > 1 && (
                          <path
                            d={
                              `M ${s.sx(plot.shade[0].x)} ${s.yBase} ` +
                              plot.shade
                                .map((pt) => `L ${s.sx(pt.x)} ${s.syTop(pt.y)}`)
                                .join(" ") +
                              ` L ${s.sx(plot.shade[plot.shade.length - 1].x)} ${
                                s.yBase
                              } Z`
                            }
                            fill="var(--accent)"
                            fillOpacity={0.16}
                          />
                        )}

                        {/* Barras de la binomial; las del intervalo, resaltadas */}
                        {plot.bars.map((bar, i) => {
                          const cx = s.sx(bar.k);
                          const span =
                            plot.bars.length > 1
                              ? (s.sx(plot.hi) - s.sx(plot.lo)) /
                                (plot.bars.length - 1)
                              : 18;
                          const bw = Math.max(2, Math.min(span * 0.78, 18));
                          const y = s.syTop(bar.pmf);
                          return (
                            <rect
                              key={`bar-${i}`}
                              x={cx - bw / 2}
                              y={y}
                              width={bw}
                              height={s.yBase - y}
                              fill="var(--vault-tint, var(--primary))"
                              fillOpacity={bar.inRange ? 0.55 : 0.2}
                              stroke="var(--vault-tint, var(--primary))"
                              strokeWidth={1}
                              strokeOpacity={bar.inRange ? 1 : 0.5}
                            />
                          );
                        })}

                        {/* Curva normal N(np, σ) superpuesta */}
                        <path
                          d={polyline(
                            plot.curve.map((pt) => ({
                              x: s.sx(pt.x),
                              y: s.syTop(pt.y),
                            })),
                          )}
                          fill="none"
                          stroke="var(--accent)"
                          strokeWidth={1.8}
                        />

                        {/* Bordes del intervalo continuo */}
                        {[plot.shLo, plot.shHi].map((xv, i) => (
                          <line
                            key={`edge-${i}`}
                            x1={s.sx(xv)}
                            x2={s.sx(xv)}
                            y1={s.yTopPx}
                            y2={s.yBase}
                            stroke="var(--accent)"
                            strokeWidth={1.2}
                            strokeDasharray="4 3"
                          />
                        ))}
                      </>
                    )}
                  </PlotFrame>
                  <PlotLegend
                    items={[
                      { kind: "bar", label: "PMF Bin(n, p)" },
                      {
                        kind: "line",
                        color: "var(--accent)",
                        label: "N(np, √npq)",
                      },
                      {
                        kind: "area",
                        color: "var(--accent)",
                        label: "[a−½, b+½] (corrección)",
                      },
                    ]}
                  />
                </>
              )}

              <Note tone={model.ruleOk ? undefined : "error"}>
                <b>Regla práctica:</b> conviene la aproximación normal cuando np ≥
                5 y nq ≥ 5. Acá np = {fmt(model.np, 2)} y nq = {fmt(model.nq, 2)}{" "}
                <Badge variant={model.ruleOk ? "solid" : "status"}>
                  {model.ruleOk ? "se cumple" : "no se cumple"}
                </Badge>
                . Si p ≈ 0 con np moderado, la campana queda asimétrica y conviene
                la aproximación de Poisson.
              </Note>
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}
