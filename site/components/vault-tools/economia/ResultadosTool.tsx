"use client";

import { useMemo, useState } from "react";
import { TextInput, Note } from "@studyvaults/ui";
import { num, money, pct, cascadaResultados, feo, escudoFiscal } from "./lib/finance";
import type { CascadaResultados } from "./lib/finance";

/* ================================================================== */
/* ESTADO DE RESULTADOS — cascada financiera y caja (Unidad 6)         */
/* ================================================================== */

interface Modelo {
  c: CascadaResultados;
  t: number;
  feoVal: number;
  escudo: number;
}

export default function ResultadosTool() {
  const [ventasStr, setVentasStr] = useState("1000");
  const [costosStr, setCostosStr] = useState("500");
  const [amortStr, setAmortStr] = useState("100");
  const [interesesStr, setInteresesStr] = useState("0");
  const [igStr, setIgStr] = useState("35");

  const r = useMemo<Modelo | null>(() => {
    const ventas = num(ventasStr);
    const costos = num(costosStr);
    const amort = num(amortStr);
    const intereses = num(interesesStr);
    const t = num(igStr) / 100;
    if (![ventas, costos, amort, intereses, t].every(Number.isFinite)) return null;
    const c = cascadaResultados(ventas, costos, amort, intereses, t);
    // FEO = EAT + Amortizaciones (la amortización no eroga, se suma de vuelta).
    const feoVal = feo(ventas, costos, amort, t);
    const escudo = escudoFiscal(amort, t);
    return { c, t, feoVal, escudo };
  }, [ventasStr, costosStr, amortStr, interesesStr, igStr]);

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Información contable · Unidad 6</span>
        <h3>Estado de resultados y caja</h3>
        <p>
          Armá la <b>cascada financiera</b> del estado de resultados (Ventas → EBITDA →
          EBIT → EBT → EAT) y conciliála con la caja: la amortización no eroga, así que
          se resta para el impuesto pero <b>se suma de vuelta</b> para llegar al flujo de
          efectivo operativo (FEO).
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Ventas</b> ($)
            </label>
            <TextInput
              inputMode="decimal"
              value={ventasStr}
              onChange={(e) => setVentasStr(e.target.value)}
            />
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Costos erogables</b> ($)
            </label>
            <TextInput
              inputMode="decimal"
              value={costosStr}
              onChange={(e) => setCostosStr(e.target.value)}
            />
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Amortizaciones</b> ($)
              </label>
              <TextInput
                inputMode="decimal"
                value={amortStr}
                onChange={(e) => setAmortStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Intereses</b> ($)
              </label>
              <TextInput
                inputMode="decimal"
                value={interesesStr}
                onChange={(e) => setInteresesStr(e.target.value)}
              />
            </div>
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Tasa IG</b> t (%)
            </label>
            <TextInput
              inputMode="decimal"
              value={igStr}
              onChange={(e) => setIgStr(e.target.value)}
            />
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">Completá todos los campos con números válidos.</p>
          ) : (
            <>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Cascada de resultados</span>
                <table className="vtool-table">
                  <tbody>
                    <tr>
                      <td>Ventas</td>
                      <td className="vtool-mono">{money(r.c.ventas)}</td>
                    </tr>
                    <tr>
                      <td>(−) Costos erogables</td>
                      <td className="vtool-mono">{money(-r.c.costosErogables)}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>EBITDA</b>
                      </td>
                      <td className="vtool-mono">
                        <b>{money(r.c.ebitda)}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>(−) Amortizaciones</td>
                      <td className="vtool-mono">{money(-r.c.amortizaciones)}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>EBIT</b> (UAII)
                      </td>
                      <td className="vtool-mono">
                        <b>{money(r.c.ebit)}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>(−) Intereses</td>
                      <td className="vtool-mono">{money(-r.c.intereses)}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>EBT</b> (UAI)
                      </td>
                      <td className="vtool-mono">
                        <b>{money(r.c.ebt)}</b>
                      </td>
                    </tr>
                    <tr>
                      <td>(−) IG ({pct(r.t, 0)})</td>
                      <td className="vtool-mono">{money(-r.c.ig)}</td>
                    </tr>
                    <tr>
                      <td>
                        <b>EAT</b> (resultado neto)
                      </td>
                      <td className="vtool-mono">
                        <b>{money(r.c.eat)}</b>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="vtool-sub">
                <span className="vtool-eyebrow">Del resultado a la caja</span>
                <div className="vtool-kv">
                  <span className="k">EAT (resultado neto)</span>
                  <span className="v">{money(r.c.eat)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">(+) Amortizaciones (no eroga)</span>
                  <span className="v">{money(r.c.amortizaciones)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">FEO = EAT + Amort.</span>
                  <span className="v acc">{money(r.feoVal)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Escudo fiscal de la amort. (t·Am)</span>
                  <span className="v">{money(r.escudo)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="vtool-sub">
        <span className="vtool-eyebrow">EOAF · orígenes y aplicaciones de fondos</span>
        <table className="vtool-table">
          <thead>
            <tr>
              <th>Orígenes (fuentes de fondos)</th>
              <th>Aplicaciones (usos de fondos)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Aumentos de pasivo y patrimonio neto</td>
              <td>Aumentos de activos</td>
            </tr>
            <tr>
              <td>Bajas / ventas de activos</td>
              <td>Bajas de pasivo y patrimonio neto</td>
            </tr>
            <tr>
              <td>Utilidades del ejercicio</td>
              <td>Distribución de dividendos</td>
            </tr>
            <tr>
              <td>Amortizaciones (no erogables)</td>
              <td>Inversiones</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Note>
        La amortización resta para calcular el IG pero no es una salida de caja, por eso{" "}
        <span className="vtool-mono">FEO = EAT + Amort.</span> y genera un{" "}
        <span className="vtool-mono">escudo fiscal = t · Am</span>. En el EOAF las
        amortizaciones aparecen como origen porque ya estaban restadas en el resultado
        sin haber movido fondos.
      </Note>
    </div>
  );
}
