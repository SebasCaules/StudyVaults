"use client";

import { useMemo, useState } from "react";
import { TextInput, Slider, Note } from "@studyvaults/ui";
import {
  num,
  fmt,
  money,
  pct,
  clamp,
  van,
  tir,
  ter,
  paybackSimple,
  paybackDescontado,
  maximaExposicion,
  indiceRentabilidad,
  filasDescuento,
} from "./lib/finance";

/* ================================================================== */
/* VAN / TIR / criterios de inversión — el "core" del Parcial 2 (U8)   */
/* ================================================================== */

interface Resultado {
  flows: number[];
  r: number;
  van: number;
  tir: { rate: number | null; multiple: boolean };
  ter: number | null;
  paybackSimple: number | null;
  paybackDescontado: number | null;
  maximaExposicion: number;
  ir: number;
  filas: ReturnType<typeof filasDescuento>;
}

const FLUJOS_INICIALES = ["-1000", "300", "350", "400", "450"];

function fmtPeriodo(p: number | null): string {
  if (p === null) return "no recupera";
  return `${money(p, 2)} períodos`;
}

export default function VanTirTool() {
  const [rStr, setRStr] = useState("10");
  const [flujos, setFlujos] = useState<string[]>(FLUJOS_INICIALES);

  const setFlujo = (idx: number, value: string) => {
    setFlujos((prev) => prev.map((f, i) => (i === idx ? value : f)));
  };

  const addPeriodo = () => setFlujos((prev) => [...prev, "0"]);

  const quitarPeriodo = (idx: number) =>
    setFlujos((prev) => (prev.length > 2 ? prev.filter((_, i) => i !== idx) : prev));

  const res = useMemo<Resultado | null>(() => {
    const r = num(rStr) / 100;
    if (!Number.isFinite(r) || r <= -1) return null;
    if (flujos.length < 2) return null;
    const flows = flujos.map((f) => num(f));
    if (!flows.every(Number.isFinite)) return null;
    return {
      flows,
      r,
      van: van(r, flows),
      tir: tir(flows),
      ter: ter(flows, r),
      paybackSimple: paybackSimple(flows),
      paybackDescontado: paybackDescontado(flows, r),
      maximaExposicion: maximaExposicion(flows),
      ir: indiceRentabilidad(flows, r),
      filas: filasDescuento(flows, r),
    };
  }, [rStr, flujos]);

  const veredicto =
    res === null
      ? null
      : res.van > 1e-6
        ? "VAN > 0 · conviene"
        : res.van < -1e-6
          ? "VAN < 0 · no conviene"
          : "VAN = 0 · indiferente";
  const vanNeg = res !== null && res.van < -1e-6;

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Evaluación de proyectos · Unidad 8</span>
        <h3>VAN · TIR · criterios de inversión</h3>
        <p>
          Cargá la inversión inicial (año 0, negativa) y los flujos de cada período,
          elegí la tasa de descuento <b>r</b> y obtené VAN, TIR, TER, payback, máxima
          exposición e índice de rentabilidad. El <b>criterio que manda siempre es el
          VAN</b>: acepta el proyecto si VAN &gt; 0.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Tasa de descuento</b> r (% por período)
            </label>
            <Slider
              min={0}
              max={40}
              step={0.5}
              value={clamp(num(rStr) || 0, 0, 40)}
              onChange={(e) => setRStr(e.target.value)}
            />
            <TextInput
              inputMode="decimal"
              value={rStr}
              onChange={(e) => setRStr(e.target.value)}
            />
          </div>

          <div className="vtool-field">
            <label className="vtool-label">
              <b>Flujos por período</b> (año 0 = inversión)
            </label>
            <div className="vtool-stack">
              {flujos.map((f, i) => (
                <div className="vtool-row" key={i}>
                  <div className="vtool-field">
                    <label className="vtool-label">
                      <b>t = {i}</b>
                      {i === 0 ? " · inversión" : ""}
                    </label>
                    <TextInput
                      inputMode="decimal"
                      value={f}
                      onChange={(e) => setFlujo(i, e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="vtool-mono"
                    onClick={() => quitarPeriodo(i)}
                    disabled={flujos.length <= 2}
                  >
                    quitar
                  </button>
                </div>
              ))}
              <button type="button" className="vtool-mono" onClick={addPeriodo}>
                + período
              </button>
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!res ? (
            <p className="vtool-error">
              Completá la tasa y al menos 2 flujos numéricos válidos.
            </p>
          ) : (
            <>
              <div className="vtool-bignum">
                VAN = {money(res.van, 2)}
                <small style={vanNeg ? { color: "var(--accent-text)" } : undefined}>
                  {veredicto}
                </small>
              </div>

              <div className="vtool-sub">
                <span className="vtool-eyebrow">Resultados a r = {pct(res.r, 2)}</span>

                <div className="vtool-kv">
                  <span className="k">TIR</span>
                  <span className="v acc">
                    {res.tir.rate === null ? "—" : pct(res.tir.rate, 2)}
                  </span>
                </div>

                <div className="vtool-kv">
                  <span className="k">TER (TIR modificada, TREMA = r)</span>
                  <span className="v">{res.ter === null ? "—" : pct(res.ter, 2)}</span>
                </div>

                <div className="vtool-kv">
                  <span className="k">Índice de rentabilidad (IR)</span>
                  <span className={`v ${res.ir >= 1 ? "acc" : "coral"}`}>
                    {Number.isFinite(res.ir) ? money(res.ir, 2) : "—"}
                  </span>
                </div>

                <div className="vtool-kv">
                  <span className="k">Payback simple</span>
                  <span className="v">{fmtPeriodo(res.paybackSimple)}</span>
                </div>

                <div className="vtool-kv">
                  <span className="k">Payback descontado</span>
                  <span className="v">{fmtPeriodo(res.paybackDescontado)}</span>
                </div>

                <div className="vtool-kv">
                  <span className="k">Máxima exposición</span>
                  <span className="v coral">{money(res.maximaExposicion, 2)}</span>
                </div>
              </div>

              {res.tir.rate === null && (
                <p className="vtool-error">
                  No hay TIR real en el rango: los flujos no cambian de signo o el VAN
                  no cruza cero. Decidí por el VAN.
                </p>
              )}
              {res.tir.multiple && (
                <p className="vtool-error">
                  ⚠️ Hay <b>TIR múltiples</b> (más de un cambio de signo en los flujos).
                  La TIR no es criterio confiable: <b>manda el VAN</b>.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {res && (
        <div className="vtool-stack">
          <span className="vtool-eyebrow">Flujos descontados</span>
          <table className="vtool-table">
            <thead>
              <tr>
                <th>Año</th>
                <th>Flujo</th>
                <th>Factor</th>
                <th>Descontado</th>
                <th>Acum. simple</th>
                <th>Acum. descontado</th>
              </tr>
            </thead>
            <tbody>
              {res.filas.map((row) => (
                <tr key={row.t}>
                  <td className="vtool-mono">{row.t}</td>
                  <td className="vtool-mono">{money(row.flujo, 2)}</td>
                  <td className="vtool-mono">{fmt(row.factor, 4)}</td>
                  <td className="vtool-mono">{money(row.descontado, 2)}</td>
                  <td className={`vtool-mono${row.acumSimple < 0 ? " coral" : ""}`}>
                    {money(row.acumSimple, 2)}
                  </td>
                  <td className={`vtool-mono${row.acumDescontado < 0 ? " coral" : ""}`}>
                    {money(row.acumDescontado, 2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Note>
        Criterio central: <span className="vtool-mono">VAN = Σ FCₜ/(1+r)ᵗ</span>. Aceptá
        si VAN &gt; 0; la <span className="vtool-mono">TIR</span> es la r que hace VAN = 0
        y solo es confiable con un único cambio de signo. Con TIR múltiples o
        inexistente, decidí por el VAN. El <span className="vtool-mono">IR</span> &gt; 1
        equivale a VAN &gt; 0.
      </Note>
    </div>
  );
}
