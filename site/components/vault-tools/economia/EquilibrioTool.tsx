"use client";

import { useMemo, useState } from "react";
import { TextInput, Note } from "@studyvaults/ui";
import {
  num,
  fmt,
  money,
  pct,
  contribucionMarginal,
  razonContribucion,
  puntoEquilibrioQ,
  puntoEquilibrioV,
  beneficio,
} from "./lib/finance";

/* ================================================================== */
/* PUNTO DE EQUILIBRIO Y CONTRIBUCIÓN MARGINAL (Unidad 6)              */
/* ================================================================== */

interface EquilibrioModel {
  p: number;
  cv: number;
  CF: number;
  q: number;
  cm: number;
  rc: number;
  qStar: number;
  vStar: number;
  ben: number;
}

interface PseudoModel {
  fPropios: number;
  fAsignados: number;
  cm: number;
  qPseudo: number;
  qStar: number;
}

interface PlotModel {
  w: number;
  h: number;
  pad: number;
  qMax: number;
  yMax: number;
  xOf: (q: number) => number;
  yOf: (v: number) => number;
  qStar: number;
  vStar: number;
  it: (q: number) => number;
  ct: (q: number) => number;
}

export default function EquilibrioTool() {
  const [pStr, setPStr] = useState("10");
  const [cvStr, setCvStr] = useState("6");
  const [cfStr, setCfStr] = useState("1000");
  const [qStr, setQStr] = useState("300");

  const [fPropStr, setFPropStr] = useState("400");
  const [fAsigStr, setFAsigStr] = useState("600");

  const model = useMemo<EquilibrioModel | null>(() => {
    const p = num(pStr);
    const cv = num(cvStr);
    const CF = num(cfStr);
    const q = num(qStr);
    if (![p, cv, CF, q].every(Number.isFinite)) return null;
    const cm = contribucionMarginal(p, cv);
    if (cm <= 0) return null;
    return {
      p,
      cv,
      CF,
      q,
      cm,
      rc: razonContribucion(p, cv),
      qStar: puntoEquilibrioQ(CF, p, cv),
      vStar: puntoEquilibrioV(CF, p, cv),
      ben: beneficio(p, cv, q, CF),
    };
  }, [pStr, cvStr, cfStr, qStr]);

  const pseudo = useMemo<PseudoModel | null>(() => {
    if (!model) return null;
    const fPropios = num(fPropStr);
    const fAsignados = num(fAsigStr);
    if (![fPropios, fAsignados].every(Number.isFinite)) return null;
    const cm = model.cm;
    return {
      fPropios,
      fAsignados,
      cm,
      qPseudo: puntoEquilibrioQ(fPropios, model.p, model.cv),
      qStar: puntoEquilibrioQ(fPropios + fAsignados, model.p, model.cv),
    };
  }, [model, fPropStr, fAsigStr]);

  const plot = useMemo<PlotModel | null>(() => {
    if (!model || !Number.isFinite(model.qStar)) return null;
    const w = 460;
    const h = 300;
    const pad = 44;
    const qMax = Math.max(model.qStar * 2, model.q * 1.1, 1);
    const it = (q: number) => model.p * q;
    const ct = (q: number) => model.CF + model.cv * q;
    const yMax = Math.max(it(qMax), ct(qMax), 1);
    const xOf = (q: number) => pad + (q / qMax) * (w - pad * 2);
    const yOf = (v: number) => h - pad - (v / yMax) * (h - pad * 2);
    return { w, h, pad, qMax, yMax, xOf, yOf, qStar: model.qStar, vStar: model.vStar, it, ct };
  }, [model]);

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Análisis de costos · Unidad 6</span>
        <h3>Punto de equilibrio y contribución marginal</h3>
        <p>
          La <b>contribución marginal</b> cm = p − cv es lo que cada unidad aporta a
          cubrir costos fijos. El <b>punto de equilibrio</b> q* = CF/cm es el volumen
          donde el ingreso total iguala al costo total: ni ganás ni perdés.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Precio unitario</b> p ($)
              </label>
              <TextInput
                inputMode="decimal"
                value={pStr}
                onChange={(e) => setPStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Costo variable</b> cv ($)
              </label>
              <TextInput
                inputMode="decimal"
                value={cvStr}
                onChange={(e) => setCvStr(e.target.value)}
              />
            </div>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Costos fijos</b> CF ($)
              </label>
              <TextInput
                inputMode="decimal"
                value={cfStr}
                onChange={(e) => setCfStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Volumen</b> q (unidades)
              </label>
              <TextInput
                inputMode="decimal"
                value={qStr}
                onChange={(e) => setQStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!model ? (
            <p className="vtool-error">
              Completá p, cv, CF y q con números válidos (cm = p − cv debe ser
              positivo).
            </p>
          ) : (
            <div className="vtool-sub">
              <span className="vtool-eyebrow">Resultados</span>
              <div className="vtool-kv">
                <span className="k">Contribución marginal (p − cv)</span>
                <span className="v acc">${money(model.cm)}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Razón de contribución (cm/p)</span>
                <span className="v">{pct(model.rc, 2)}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Cantidad de equilibrio q*</span>
                <span className="v acc">{fmt(model.qStar, 2)} u</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Ventas de equilibrio V*</span>
                <span className="v">${money(model.vStar)}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Beneficio a q = {fmt(model.q, 0)}</span>
                <span className={`v ${model.ben >= 0 ? "acc" : "coral"}`}>
                  ${money(model.ben)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {model && plot && (
        <svg
          className="vtool-plot"
          viewBox={`0 0 ${plot.w} ${plot.h}`}
          role="img"
          aria-label="Gráfico de punto de equilibrio: ingreso total y costo total"
        >
          {/* zona de pérdida (q < q*) */}
          <rect
            x={plot.pad}
            y={plot.pad}
            width={plot.xOf(plot.qStar) - plot.pad}
            height={plot.h - plot.pad * 2}
            fill="var(--coral, #e2725b)"
            opacity={0.1}
          />
          {/* zona de ganancia (q > q*) */}
          <rect
            x={plot.xOf(plot.qStar)}
            y={plot.pad}
            width={plot.w - plot.pad - plot.xOf(plot.qStar)}
            height={plot.h - plot.pad * 2}
            fill="var(--acc, #3fb950)"
            opacity={0.1}
          />

          {/* ejes */}
          <line
            x1={plot.pad}
            y1={plot.h - plot.pad}
            x2={plot.w - plot.pad}
            y2={plot.h - plot.pad}
            stroke="currentColor"
            opacity={0.4}
          />
          <line
            x1={plot.pad}
            y1={plot.pad}
            x2={plot.pad}
            y2={plot.h - plot.pad}
            stroke="currentColor"
            opacity={0.4}
          />

          {/* costo total: CF + cv·q */}
          <line
            x1={plot.xOf(0)}
            y1={plot.yOf(plot.ct(0))}
            x2={plot.xOf(plot.qMax)}
            y2={plot.yOf(plot.ct(plot.qMax))}
            stroke="var(--coral, #e2725b)"
            strokeWidth={2}
          />
          {/* ingreso total: p·q */}
          <line
            x1={plot.xOf(0)}
            y1={plot.yOf(plot.it(0))}
            x2={plot.xOf(plot.qMax)}
            y2={plot.yOf(plot.it(plot.qMax))}
            stroke="var(--acc, #3fb950)"
            strokeWidth={2}
          />

          {/* punto muerto q* */}
          <line
            x1={plot.xOf(plot.qStar)}
            y1={plot.pad}
            x2={plot.xOf(plot.qStar)}
            y2={plot.h - plot.pad}
            stroke="currentColor"
            strokeDasharray="4 3"
            opacity={0.5}
          />
          <circle
            cx={plot.xOf(plot.qStar)}
            cy={plot.yOf(plot.vStar)}
            r={4}
            fill="currentColor"
          />
          <text
            x={plot.xOf(plot.qStar)}
            y={plot.h - plot.pad + 16}
            textAnchor="middle"
            fontSize={11}
            fill="currentColor"
          >
            q* = {fmt(plot.qStar, 1)}
          </text>

          {/* etiquetas de rectas */}
          <text
            x={plot.xOf(plot.qMax) - 4}
            y={plot.yOf(plot.it(plot.qMax)) - 6}
            textAnchor="end"
            fontSize={11}
            fill="var(--acc, #3fb950)"
          >
            IT = p·q
          </text>
          <text
            x={plot.xOf(plot.qMax) - 4}
            y={plot.yOf(plot.ct(plot.qMax)) + 14}
            textAnchor="end"
            fontSize={11}
            fill="var(--coral, #e2725b)"
          >
            CT = CF + cv·q
          </text>
          <text
            x={plot.pad - 6}
            y={plot.pad + 4}
            textAnchor="end"
            fontSize={11}
            fill="currentColor"
            opacity={0.6}
          >
            $
          </text>
          <text
            x={plot.w - plot.pad}
            y={plot.h - plot.pad + 28}
            textAnchor="end"
            fontSize={11}
            fill="currentColor"
            opacity={0.6}
          >
            q
          </text>
        </svg>
      )}

      <div className="vtool-head">
        <span className="vtool-eyebrow">Análisis marginal</span>
        <h3>Pseudo-equilibrio (fijos propios vs. asignados)</h3>
        <p>
          Cuando un producto carga <b>costos fijos propios</b> (directos, evitables si
          se discontinúa) y una porción de <b>fijos comunes asignados</b>, el{" "}
          <b>pseudo-equilibrio</b> es el volumen que cubre solo los propios:
          q = F<sub>propios</sub>/(p − cv).
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Fijos propios</b> ($)
            </label>
            <TextInput
              inputMode="decimal"
              value={fPropStr}
              onChange={(e) => setFPropStr(e.target.value)}
            />
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Fijos asignados</b> ($)
            </label>
            <TextInput
              inputMode="decimal"
              value={fAsigStr}
              onChange={(e) => setFAsigStr(e.target.value)}
            />
          </div>
        </div>

        <div className="vtool-stack">
          {!pseudo ? (
            <p className="vtool-error">
              Completá los fijos propios y asignados (y un cm positivo arriba).
            </p>
          ) : (
            <div className="vtool-sub">
              <span className="vtool-eyebrow">Resultados</span>
              <div className="vtool-kv">
                <span className="k">Pseudo-equilibrio (cubre propios)</span>
                <span className="v acc">{fmt(pseudo.qPseudo, 2)} u</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Equilibrio total (propios + asignados)</span>
                <span className="v">{fmt(pseudo.qStar, 2)} u</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {pseudo && (
        <Note>
          Entre el pseudo-equilibrio ({fmt(pseudo.qPseudo, 1)} u) y el equilibrio total
          ({fmt(pseudo.qStar, 1)} u) el producto <b>parece dar pérdida contable</b>,
          pero ya cubre sus fijos propios y <b>contribuye a los fijos comunes</b>: si
          lo discontinuás, esos comunes recaen sobre el resto. Mientras
          q ≥ pseudo-equilibrio, conviene seguir produciéndolo.
        </Note>
      )}

      <Note>
        Fórmulas clave:{" "}
        <span className="vtool-mono">cm = p − cv</span> ·{" "}
        <span className="vtool-mono">q* = CF/(p − cv)</span> ·{" "}
        <span className="vtool-mono">V* = CF/[(p − cv)/p]</span> ·{" "}
        <span className="vtool-mono">π = (p − cv)·q − CF</span>.
      </Note>
    </div>
  );
}
