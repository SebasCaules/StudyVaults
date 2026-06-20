"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Note } from "@studyvaults/ui";
import {
  num,
  fmt,
  money,
  pct,
  descuentoComercialVA,
  descuentoComercial,
  descuentoAInteres,
  tasaEquivalente,
  cft,
} from "./lib/finance";

/* ================================================================== */
/* DESCUENTO COMERCIAL Y CFT — financiación de corto plazo (Unidad 7) */
/* ================================================================== */

export default function DescuentoCftTool() {
  const [mode, setMode] = useState<"descuento" | "prontopago" | "cft">("descuento");

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Cálculo financiero · Unidad 7</span>
        <h3>Descuento comercial y CFT</h3>
        <p>
          Toda tasa de <b>descuento</b> esconde una tasa de <b>interés</b> mayor:
          descontar sobre el valor nominal no es lo mismo que aplicar interés sobre
          el neto. Acá pasás de descuento comercial a su tasa de interés equivalente,
          anualizás un descuento por pronto pago y sacás el <b>Costo Financiero
          Total</b> de una financiación como su TIR.
        </p>
      </div>

      <div className="vtool-field">
        <label className="vtool-label">
          <b>Modo</b>
        </label>
        <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
          <option value="descuento">Descuento comercial (VA · DC · i)</option>
          <option value="prontopago">Pronto pago anualizado (TEA)</option>
          <option value="cft">CFT de una financiación (TIR)</option>
        </Select>
      </div>

      {mode === "descuento" && <DescuentoMode />}
      {mode === "prontopago" && <ProntoPagoMode />}
      {mode === "cft" && <CftMode />}

      <Note>
        Una tasa de descuento <span className="vtool-mono">d</span> equivale a una
        tasa de interés <span className="vtool-mono">i = d/(1−d)</span> sobre el neto.
        El CFT de una operación es la <span className="vtool-mono">TIR</span> que iguala
        el neto recibido con el valor presente de todos los pagos.
      </Note>
    </div>
  );
}

/* ---- Modo a: descuento comercial (VA, descuento en $, tasa de interés) ---- */

interface DescuentoResult {
  C: number;
  d: number;
  n: number;
  va: number;
  dc: number;
  iPeriodo: number;
}

function DescuentoMode() {
  const [cStr, setCStr] = useState("100000");
  const [dStr, setDStr] = useState("5");
  const [nStr, setNStr] = useState("1");

  const r = useMemo<DescuentoResult | null>(() => {
    const C = num(cStr);
    const d = num(dStr) / 100;
    const n = num(nStr);
    if (![C, d, n].every(Number.isFinite) || C <= 0 || n <= 0) return null;
    return {
      C,
      d,
      n,
      va: descuentoComercialVA(C, d, n),
      dc: descuentoComercial(C, d, n),
      // i de interés equivalente a la tasa de descuento de UN período.
      iPeriodo: descuentoAInteres(d),
    };
  }, [cStr, dStr, nStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Valor nominal</b> C ($)
            </label>
            <TextInput
              inputMode="decimal"
              value={cStr}
              onChange={(e) => setCStr(e.target.value)}
            />
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Tasa de descuento</b> d (% por período)
              </label>
              <TextInput
                inputMode="decimal"
                value={dStr}
                onChange={(e) => setDStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Períodos</b> n
              </label>
              <TextInput
                inputMode="decimal"
                value={nStr}
                onChange={(e) => setNStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">Ingresá nominal, descuento y períodos válidos.</p>
          ) : (
            <>
              <div className="vtool-bignum">
                VA = ${money(r.va)}
                <small>
                  C(1 − d·n) = {fmt(r.C, 0)}·(1 − {fmt(r.d, 4)}·{fmt(r.n, 0)})
                </small>
              </div>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Resultados</span>
                <div className="vtool-kv">
                  <span className="k">Descuento en $</span>
                  <span className="v coral">${money(r.dc)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Tasa de interés equivalente i = d/(1−d)</span>
                  <span className="v acc">{pct(r.iPeriodo, 4)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Note>
        <span className="vtool-mono">VA = C(1 − d·n)</span> ·{" "}
        <span className="vtool-mono">DC = C·d·n</span> ·{" "}
        <span className="vtool-mono">i = d/(1−d)</span>. La tasa de interés implícita
        siempre es mayor que la de descuento porque el interés se calcula sobre el neto
        cobrado, no sobre el nominal.
      </Note>
    </>
  );
}

/* ---- Modo b: pronto pago anualizado (descuento por adelantar el pago) ---- */

interface ProntoPagoResult {
  desc: number;
  dias: number;
  iPeriodo: number;
  tea: number;
}

function ProntoPagoMode() {
  const [descStr, setDescStr] = useState("10");
  const [diasStr, setDiasStr] = useState("45");

  const r = useMemo<ProntoPagoResult | null>(() => {
    const desc = num(descStr) / 100;
    const dias = num(diasStr);
    if (![desc, dias].every(Number.isFinite) || desc <= 0 || desc >= 1 || dias <= 0)
      return null;
    // i del período de adelanto: tasa de interés que ganás al pagar antes.
    const iPeriodo = descuentoAInteres(desc);
    // Anualizar esa tasa de `dias` días a 360 días (TEA).
    const tea = tasaEquivalente(iPeriodo, dias, 360);
    return { desc, dias, iPeriodo, tea };
  }, [descStr, diasStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Descuento por pronto pago</b> (%)
            </label>
            <TextInput
              inputMode="decimal"
              value={descStr}
              onChange={(e) => setDescStr(e.target.value)}
            />
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Días que se adelanta el pago</b>
            </label>
            <TextInput
              inputMode="decimal"
              value={diasStr}
              onChange={(e) => setDiasStr(e.target.value)}
            />
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">
              Ingresá un descuento (0–100%) y los días adelantados.
            </p>
          ) : (
            <>
              <div className="vtool-bignum">
                TEA = {pct(r.tea, 2)}
                <small>
                  (1 + {fmt(r.iPeriodo, 4)})^(360/{fmt(r.dias, 0)}) − 1
                </small>
              </div>
              <div className="vtool-sub">
                <div className="vtool-kv">
                  <span className="k">i del período ({fmt(r.dias, 0)} días) = desc/(1−desc)</span>
                  <span className="v acc">{pct(r.iPeriodo, 4)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Note>
        No aprovechar el pronto pago es <b>financiarse carísimo</b>. Ej.: 10% por pagar
        45 días antes → <span className="vtool-mono">i = 0,10/0,90 = 11,11%</span> en 45
        días → <span className="vtool-mono">TEA = (1,1111)^(360/45) − 1 ≈ 132,28%</span>.
        Si tu costo de capital es menor que esa TEA, conviene pagar antes.
      </Note>
    </>
  );
}

/* ---- Modo c: CFT de una financiación (TIR de la operación) ---- */

interface CftResult {
  neto: number;
  pagos: number[];
  total: number;
  cftPeriodo: number | null;
}

function CftMode() {
  const [netoStr, setNetoStr] = useState("100000");
  const [pagosStr, setPagosStr] = useState(["40000", "40000", "40000"]);

  const setPago = (idx: number, value: string) =>
    setPagosStr((prev) => prev.map((p, i) => (i === idx ? value : p)));

  const addPago = () => setPagosStr((prev) => [...prev, "0"]);

  const removePago = (idx: number) =>
    setPagosStr((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev));

  const r = useMemo<CftResult | null>(() => {
    const neto = num(netoStr);
    const pagos = pagosStr.map((p) => num(p));
    if (!Number.isFinite(neto) || neto <= 0) return null;
    if (!pagos.every(Number.isFinite) || pagos.length === 0) return null;
    const total = pagos.reduce((a, b) => a + b, 0);
    return {
      neto,
      pagos,
      total,
      // CFT = TIR que iguala el neto recibido con el VP de los pagos.
      cftPeriodo: cft(neto, pagos),
    };
  }, [netoStr, pagosStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Neto recibido</b> (t=0, $)
            </label>
            <TextInput
              inputMode="decimal"
              value={netoStr}
              onChange={(e) => setNetoStr(e.target.value)}
            />
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Pagos</b> (uno por período, desde t=1)
            </label>
            <div className="vtool-stack">
              {pagosStr.map((p, i) => (
                <div className="vtool-row" key={i}>
                  <span className="vtool-mono">t={i + 1}</span>
                  <TextInput
                    inputMode="decimal"
                    value={p}
                    onChange={(e) => setPago(i, e.target.value)}
                  />
                  <button
                    type="button"
                    className="vtool-mono"
                    onClick={() => removePago(i)}
                    aria-label={`Quitar pago t=${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button type="button" className="vtool-mono" onClick={addPago}>
                + agregar pago
              </button>
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">Ingresá un neto y al menos un pago válidos.</p>
          ) : r.cftPeriodo == null ? (
            <p className="vtool-error">
              No se encontró TIR para estos flujos: revisá que la suma de pagos supere
              al neto recibido.
            </p>
          ) : (
            <>
              <div className="vtool-bignum">
                CFT = {pct(r.cftPeriodo, 4)}
                <small>por período (TIR de la operación)</small>
              </div>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Resumen</span>
                <div className="vtool-kv">
                  <span className="k">Neto recibido</span>
                  <span className="v">${money(r.neto)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Total a pagar</span>
                  <span className="v coral">${money(r.total)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Costo financiero en $</span>
                  <span className="v coral">${money(r.total - r.neto)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Note>
        <span className="vtool-mono">neto = Σ pago_t / (1 + CFT)^t</span>. El CFT es la
        tasa efectiva del período de los pagos que iguala lo que recibís hoy con el
        valor presente de todo lo que devolvés: incluye intereses, gastos y comisiones
        que ya estén dentro de cada cuota.
      </Note>
    </>
  );
}
