"use client";

import { useMemo, useState } from "react";
import {
  Panel,
  SubPanel,
  Note,
  Field,
  TextArea,
  Slider,
} from "@studyvaults/ui";
import { parseNumbers, describe, histogram, fmt } from "../lib/stats";
import { PlotFrame, PlotLegend, PAD, innerH } from "./plot";

/* ============================================================================
 * Estadística descriptiva
 * Pegá datos numéricos y obtené el resumen de cinco números, dispersión y un
 * histograma con la línea de la media. Toda la matemática viene de stats.ts:
 * parseNumbers / describe (var muestral n−1, poblacional n; cuartiles por
 * interpolación, método 7) / histogram.
 * ========================================================================== */

const SAMPLE_DATA =
  "4.2 5.1 3.8 6.0 5.5 4.9 5.2 6.3 4.0 5.8 5.0 4.6 5.4 6.1 4.3 5.7 5.1 4.8 5.9 5.3";

export default function DescriptivaTool() {
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

              <PlotFrame
                xLo={hLo}
                xHi={hHi}
                yMax={maxCount || 1}
                xTicks={2}
                yTicks={Math.min(4, Math.max(1, maxCount))}
                xDecimals={2}
                yDecimals={0}
                ariaLabel="Histograma de los datos"
              >
                {(s) => (
                  <>
                    {/* barras por bin */}
                    {hist.map((h, i) => {
                      const x0 = s.sx(h.lo);
                      const x1 = s.sx(h.hi);
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
                    {/* línea de la media (punteada) */}
                    {Number.isFinite(stats.mean) &&
                      stats.mean >= hLo &&
                      stats.mean <= hHi && (
                        <line
                          x1={s.sx(stats.mean)}
                          x2={s.sx(stats.mean)}
                          y1={s.yTopPx}
                          y2={s.yBase}
                          stroke="var(--accent)"
                          strokeWidth={1.4}
                          strokeDasharray="4 3"
                        />
                      )}
                  </>
                )}
              </PlotFrame>
              <PlotLegend
                items={[
                  { kind: "bar", label: "frecuencia" },
                  { kind: "dashed", color: "var(--accent)", label: "media" },
                ]}
              />
            </>
          )}
        </div>
      </div>
    </Panel>
  );
}
