"use client";

import { useMemo, useState } from "react";
import { TextInput, Note } from "@studyvaults/ui";
import {
  num,
  money,
  amortizacionLineal,
  escudoFiscal,
  vpEscudoFiscal,
  valorLibro,
} from "./lib/finance";

/* ================================================================== */
/* ESCUDO FISCAL Y AMORTIZACIÓN CONTABLE (Unidades 6/8)                */
/* Comparar dos horizontes de amortización lineal: el escudo nominal   */
/* total es el mismo, pero repartirlo en más años lo cobra más tarde   */
/* => menor VP => menor VAN. Amortizar rápido maximiza el VAN.         */
/* ================================================================== */

interface FilaEscudo {
  n: number;
  amort: number;
  escudoAnual: number;
  escudoNominal: number;
  vp: number;
}

interface FilaLibro {
  anio: number;
  amortAcum: number;
  vl: number;
}

interface Modelo {
  fila1: FilaEscudo;
  fila2: FilaEscudo;
  deltaVan: number;
  libro: FilaLibro[];
}

export default function EscudoFiscalTool() {
  const [voStr, setVoStr] = useState("2500");
  const [vrStr, setVrStr] = useState("0");
  const [tStr, setTStr] = useState("30");
  const [iStr, setIStr] = useState("10");
  const [n1Str, setN1Str] = useState("10");
  const [n2Str, setN2Str] = useState("15");

  const r = useMemo<Modelo | null>(() => {
    const VO = num(voStr);
    const VR = num(vrStr);
    const t = num(tStr) / 100;
    const i = num(iStr) / 100;
    const n1 = num(n1Str);
    const n2 = num(n2Str);
    if (![VO, VR, t, i, n1, n2].every(Number.isFinite)) return null;
    if (VO <= 0 || n1 <= 0 || n2 <= 0) return null;
    if (VR < 0 || VR >= VO) return null;

    const filaPara = (n: number): FilaEscudo => {
      const amort = amortizacionLineal(VO, VR, n);
      const escudoAnual = escudoFiscal(amort, t);
      return {
        n,
        amort,
        escudoAnual,
        escudoNominal: escudoAnual * n,
        vp: vpEscudoFiscal(amort, t, n, i),
      };
    };

    const fila1 = filaPara(n1);
    const fila2 = filaPara(n2);

    const libro: FilaLibro[] = [];
    for (let anio = 0; anio <= n1; anio++) {
      libro.push({
        anio,
        amortAcum: fila1.amort * anio,
        vl: valorLibro(VO, fila1.amort, anio),
      });
    }

    return { fila1, fila2, deltaVan: fila2.vp - fila1.vp, libro };
  }, [voStr, vrStr, tStr, iStr, n1Str, n2Str]);

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Evaluación de proyectos · Unidades 6/8</span>
        <h3>Escudo fiscal y amortización</h3>
        <p>
          La amortización no es un egreso de caja, pero <b>ahorra impuestos</b>: el
          escudo fiscal es <span className="vtool-mono">t·Am</span> por año. Comparando
          dos horizontes de amortización, el escudo nominal total es idéntico, pero
          repartirlo en más años lo cobra <b>más tarde</b> ⇒ menor valor presente ⇒
          menor VAN. <b>Amortizar rápido maximiza el VAN.</b>
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Valor de origen</b> VO ($)
              </label>
              <TextInput
                inputMode="decimal"
                value={voStr}
                onChange={(e) => setVoStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Valor residual</b> VR ($)
              </label>
              <TextInput
                inputMode="decimal"
                value={vrStr}
                onChange={(e) => setVrStr(e.target.value)}
              />
            </div>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Tasa IG</b> t (%)
              </label>
              <TextInput
                inputMode="decimal"
                value={tStr}
                onChange={(e) => setTStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Tasa de descuento</b> i (%)
              </label>
              <TextInput
                inputMode="decimal"
                value={iStr}
                onChange={(e) => setIStr(e.target.value)}
              />
            </div>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Horizonte 1</b> n₁ (años)
              </label>
              <TextInput
                inputMode="numeric"
                value={n1Str}
                onChange={(e) => setN1Str(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Horizonte 2</b> n₂ (años)
              </label>
              <TextInput
                inputMode="numeric"
                value={n2Str}
                onChange={(e) => setN2Str(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">
              Completá VO, VR (0 ≤ VR &lt; VO), t, i y los dos horizontes con números
              válidos.
            </p>
          ) : (
            <>
              <div className="vtool-bignum">
                ΔVAN = {money(r.deltaVan, 2)}
                <small>
                  VP escudo (n₂={r.fila2.n}) − VP escudo (n₁={r.fila1.n})
                </small>
              </div>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Comparativa de escudos</span>
                <table className="vtool-table">
                  <thead>
                    <tr>
                      <th>n</th>
                      <th>Am anual</th>
                      <th>Escudo/año</th>
                      <th>Escudo nominal</th>
                      <th>VP escudo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[r.fila1, r.fila2].map((f) => (
                      <tr key={f.n}>
                        <td>{f.n}</td>
                        <td>{money(f.amort, 2)}</td>
                        <td>{money(f.escudoAnual, 2)}</td>
                        <td>{money(f.escudoNominal, 2)}</td>
                        <td>{money(f.vp, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="vtool-sub">
                <div className="vtool-kv">
                  <span className="k">Escudo nominal total (igual en ambos)</span>
                  <span className="v">{money(r.fila1.escudoNominal, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">VP escudo · n₁={r.fila1.n}</span>
                  <span className="v acc">{money(r.fila1.vp, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">VP escudo · n₂={r.fila2.n}</span>
                  <span className="v coral">{money(r.fila2.vp, 2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {r && (
        <div className="vtool-sub">
          <span className="vtool-eyebrow">
            Valor de libro año a año · horizonte n₁={r.fila1.n}
          </span>
          <table className="vtool-table">
            <thead>
              <tr>
                <th>Año</th>
                <th>Am acumulada</th>
                <th>Valor de libro</th>
              </tr>
            </thead>
            <tbody>
              {r.libro.map((f) => (
                <tr key={f.anio}>
                  <td>{f.anio}</td>
                  <td>{money(f.amortAcum, 2)}</td>
                  <td>{money(f.vl, 2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Note>
        Escudo fiscal anual:{" "}
        <span className="vtool-mono">escudo = t · Am</span>, con{" "}
        <span className="vtool-mono">Am = (VO − VR)/n</span>. Su valor presente es{" "}
        <span className="vtool-mono">VP = t · Am · a(n;i)</span>. Como{" "}
        <span className="vtool-mono">t·Am·n</span> es el mismo para cualquier n, lo que
        cambia es <i>cuándo</i> se cobra: amortizar en menos años adelanta el escudo y
        sube su VP{r ? `, por eso ΔVAN = ${money(r.deltaVan, 2)} < 0 al pasar de n₁ a n₂` : ""}.
      </Note>
    </div>
  );
}
