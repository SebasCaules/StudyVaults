"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Slider, Note, Field } from "@studyvaults/ui";
import {
  num,
  money,
  pct,
  amortizacionLineal,
  valorLibro,
  feo,
  feeVentaActivo,
  van,
  tir,
} from "./lib/finance";

/* ================================================================== */
/* CONSTRUCTOR DE FLUJO DE FONDOS — la herramienta estrella del P2     */
/* (Unidad 8). Arma el flujo incremental después de impuestos y el VAN.*/
/* ================================================================== */

interface FilaFlujo {
  t: number;
  inversion: number;
  feoTramo: number;
  fee: number;
  ff: number;
}

interface Modelo {
  n: number;
  r: number;
  t: number;
  amort: number;
  nAm: number;
  feoCon: number;
  feoSin: number;
  vlFinal: number;
  fee: number;
  hundido: number;
  costoOp: number;
  ff: number[];
  filas: FilaFlujo[];
  van: number;
  tir: number | null;
  tirMultiple: boolean;
  // desglose del FEO del primer tramo (con amortización)
  uaii: number;
  ig: number;
  un: number;
}

export default function FlujoProyectoTool() {
  // Defaults = caso oficial "parque solar Tema 2".
  const [n, setN] = useState(15);
  const [rStr, setRStr] = useState("10");
  const [tStr, setTStr] = useState("30");
  const [i0Str, setI0Str] = useState("1100");
  const [invAdicStr, setInvAdicStr] = useState("1400");
  const [vStr, setVStr] = useState("400");
  const [cStr, setCStr] = useState("50");
  const [voStr, setVoStr] = useState("2500");
  const [nAmStr, setNAmStr] = useState("10");
  const [vmStr, setVmStr] = useState("300");
  const [vrStr, setVrStr] = useState("0");
  const [costoOpStr, setCostoOpStr] = useState("0");
  const [incluirHundido, setIncluirHundido] = useState<"no" | "si">("no");
  const [hundidoStr, setHundidoStr] = useState("0");

  const m = useMemo<Modelo | null>(() => {
    const r = num(rStr) / 100;
    const t = num(tStr) / 100;
    const I0 = num(i0Str);
    const invAdic = num(invAdicStr);
    const V = num(vStr);
    const C = num(cStr);
    const VO = num(voStr);
    const nAm = num(nAmStr);
    const VM = num(vmStr);
    const VR = num(vrStr);
    const costoOp = num(costoOpStr);
    const hundidoRaw = num(hundidoStr);

    const vals = [r, t, I0, invAdic, V, C, VO, nAm, VM, VR, costoOp, hundidoRaw];
    if (!vals.every(Number.isFinite)) return null;
    if (n < 1 || nAm < 1) return null;

    const amort = amortizacionLineal(VO, VR, nAm); // (VO−VR)/nAm
    if (!Number.isFinite(amort)) return null;

    // Costos gravados del FEO = costos erogables + costo de oportunidad.
    const costosGravados = C + costoOp;
    const feoCon = feo(V, costosGravados, amort, t); // años con amortización
    const feoSin = feo(V, costosGravados, 0, t); // años sin amortización

    // Valor de libro al final del horizonte, acotado a ≥ VR (no amortiza más allá).
    const vlFinal = Math.max(valorLibro(VO, amort, n), VR);
    const fee = feeVentaActivo(VM, Math.max(vlFinal, 0), t); // flujo terminal año n

    const hundido = incluirHundido === "si" ? hundidoRaw : 0;

    // Construcción del array de flujos (índice = año).
    const ff: number[] = new Array(n + 1).fill(0);
    ff[0] = -(I0 + hundido);
    for (let y = 1; y <= n; y++) {
      const feoTramo = y <= nAm ? feoCon : feoSin;
      ff[y] = feoTramo;
    }
    if (n >= 1) ff[1] -= invAdic; // inversión adicional en etapas (año 1)
    ff[n] += fee; // flujo terminal por venta del activo

    // Filas para la tabla (separa inversión / FEO / FEE / FF).
    const filas: FilaFlujo[] = [];
    for (let y = 0; y <= n; y++) {
      const inversion = y === 0 ? -(I0 + hundido) : y === 1 ? -invAdic : 0;
      const feoTramo = y === 0 ? 0 : y <= nAm ? feoCon : feoSin;
      const feeY = y === n ? fee : 0;
      filas.push({ t: y, inversion, feoTramo, fee: feeY, ff: ff[y] });
    }

    const vanProy = van(r, ff);
    const tirRes = tir(ff);

    // Desglose del FEO del primer tramo (con amortización).
    const uaii = V - costosGravados - amort;
    const ig = uaii > 0 ? uaii * t : 0;
    const un = uaii - ig;

    return {
      n,
      r,
      t,
      amort,
      nAm,
      feoCon,
      feoSin,
      vlFinal,
      fee,
      hundido,
      costoOp,
      ff,
      filas,
      van: vanProy,
      tir: tirRes.rate,
      tirMultiple: tirRes.multiple,
      uaii,
      ig,
      un,
    };
  }, [
    n,
    rStr,
    tStr,
    i0Str,
    invAdicStr,
    vStr,
    cStr,
    voStr,
    nAmStr,
    vmStr,
    vrStr,
    costoOpStr,
    incluirHundido,
    hundidoStr,
  ]);

  const vanOk = m ? m.van > 0 : false;

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Evaluación de proyectos · Unidad 8</span>
        <h3>Constructor de flujo de fondos</h3>
        <p>
          Arma el <b>flujo incremental después de impuestos</b> de un proyecto y
          calcula el VAN. FEO por tramo (<span className="vtool-mono">FEO = (V−C)(1−t) + t·Am</span>),
          escudo fiscal de la amortización, flujo terminal por venta del activo (FEE) y
          la trampa clásica del <b>costo hundido</b>. Defaults = caso oficial del Parcial 2.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* ---------------- Controles ---------------- */}
        <div className="vtool-stack">
          <Field label={`Horizonte n = ${n} años`}>
            <Slider
              min={1}
              max={30}
              step={1}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </Field>

          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>TREMA</b> r (%)
              </label>
              <TextInput
                inputMode="decimal"
                value={rStr}
                onChange={(e) => setRStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>IG</b> t (%)
              </label>
              <TextInput
                inputMode="decimal"
                value={tStr}
                onChange={(e) => setTStr(e.target.value)}
              />
            </div>
          </div>

          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Inversión inicial</b> I₀ (año 0)
              </label>
              <TextInput
                inputMode="decimal"
                value={i0Str}
                onChange={(e) => setI0Str(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Inv. adicional</b> (año 1)
              </label>
              <TextInput
                inputMode="decimal"
                value={invAdicStr}
                onChange={(e) => setInvAdicStr(e.target.value)}
              />
            </div>
          </div>

          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Ventas</b> V (anual)
              </label>
              <TextInput
                inputMode="decimal"
                value={vStr}
                onChange={(e) => setVStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Costos erogables</b> C (anual)
              </label>
              <TextInput
                inputMode="decimal"
                value={cStr}
                onChange={(e) => setCStr(e.target.value)}
              />
            </div>
          </div>

          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Valor de origen</b> VO (amortizable)
              </label>
              <TextInput
                inputMode="decimal"
                value={voStr}
                onChange={(e) => setVoStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Vida útil</b> n_am (años)
              </label>
              <TextInput
                inputMode="numeric"
                value={nAmStr}
                onChange={(e) => setNAmStr(e.target.value)}
              />
            </div>
          </div>

          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Valor de mercado</b> VM (venta final)
              </label>
              <TextInput
                inputMode="decimal"
                value={vmStr}
                onChange={(e) => setVmStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Valor residual</b> VR (contable)
              </label>
              <TextInput
                inputMode="decimal"
                value={vrStr}
                onChange={(e) => setVrStr(e.target.value)}
              />
            </div>
          </div>

          <div className="vtool-field">
            <label className="vtool-label">
              <b>Costo de oportunidad</b> anual (p.ej. galpón) — costo gravado
            </label>
            <TextInput
              inputMode="decimal"
              value={costoOpStr}
              onChange={(e) => setCostoOpStr(e.target.value)}
            />
          </div>

          <div className="vtool-field">
            <label className="vtool-label">
              <b>Estudio / consultora</b> como costo hundido en año 0
            </label>
            <Select
              value={incluirHundido}
              onChange={(e) => setIncluirHundido(e.target.value as "no" | "si")}
            >
              <option value="no">No incluir (correcto)</option>
              <option value="si">Sí incluir (ERROR — trampa)</option>
            </Select>
          </div>

          {incluirHundido === "si" && (
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Monto del costo hundido</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={hundidoStr}
                onChange={(e) => setHundidoStr(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* ---------------- Resultados ---------------- */}
        <div className="vtool-stack">
          {!m ? (
            <p className="vtool-error">
              Completá todos los campos con números válidos (n y n_am ≥ 1).
            </p>
          ) : (
            <>
              <div className="vtool-bignum">
                VAN = {money(m.van, 2)}
                <small>
                  a TREMA {pct(m.r, 2)} ·{" "}
                  {vanOk ? "conviene (VAN > 0)" : "no conviene (VAN ≤ 0)"}
                </small>
              </div>

              <div className="vtool-sub">
                <span className="vtool-eyebrow">Indicadores</span>
                <div className="vtool-kv">
                  <span className="k">TIR</span>
                  <span className="v acc">
                    {m.tir === null ? "—" : pct(m.tir, 2)}
                    {m.tirMultiple ? " (múltiple)" : ""}
                  </span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Amortización anual</span>
                  <span className="v">{money(m.amort, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">FEO años 1–{m.nAm} (c/amort)</span>
                  <span className="v">{money(m.feoCon, 2)}</span>
                </div>
                {m.n > m.nAm && (
                  <div className="vtool-kv">
                    <span className="k">FEO años {m.nAm + 1}–{m.n} (s/amort)</span>
                    <span className="v">{money(m.feoSin, 2)}</span>
                  </div>
                )}
                <div className="vtool-kv">
                  <span className="k">FEE venta activo (año {m.n})</span>
                  <span className="v">{money(m.fee, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Valor de libro final</span>
                  <span className="v">{money(m.vlFinal, 2)}</span>
                </div>
              </div>

              <div className="vtool-sub">
                <span className="vtool-eyebrow">Desglose FEO 1.º tramo</span>
                <div className="vtool-kv">
                  <span className="k">UAII (V − C − Am)</span>
                  <span className="v">{money(m.uaii, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">IG (t · UAII)</span>
                  <span className="v coral">−{money(m.ig, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">UN (utilidad neta)</span>
                  <span className="v">{money(m.un, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">+ Amortización</span>
                  <span className="v">{money(m.amort, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">= FEO</span>
                  <span className="v acc">{money(m.feoCon, 2)}</span>
                </div>
              </div>

              {m.hundido > 0 && (
                <p className="vtool-error">
                  ⚠️ El estudio/consultora ({money(m.hundido, 2)}) es un{" "}
                  <b>costo hundido</b>: ya está erogado y es irrelevante. Incluirlo en
                  el año 0 es la trampa clásica del parcial — NO debe formar parte del
                  flujo incremental.
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {m && (
        <table className="vtool-table">
          <thead>
            <tr>
              <th>Año</th>
              <th>Inversión</th>
              <th>FEO</th>
              <th>FEE</th>
              <th>FF</th>
            </tr>
          </thead>
          <tbody>
            {m.filas.map((f) => (
              <tr key={f.t}>
                <td>{f.t}</td>
                <td>{f.inversion === 0 ? "—" : money(f.inversion, 2)}</td>
                <td>{f.feoTramo === 0 ? "—" : money(f.feoTramo, 2)}</td>
                <td>{f.fee === 0 ? "—" : money(f.fee, 2)}</td>
                <td className="vtool-mono">{money(f.ff, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <Note>
        Flujo incremental después de impuestos:{" "}
        <span className="vtool-mono">FF₀ = −I₀</span> ·{" "}
        <span className="vtool-mono">FEO = (V−C)(1−t) + t·Am</span> ·{" "}
        <span className="vtool-mono">FEE = VM − t·(VM − VL)</span> ·{" "}
        <span className="vtool-mono">VAN = Σ FFₜ/(1+r)ᵗ</span>. La amortización solo
        existe los primeros <span className="vtool-mono">n_am</span> años y nunca
        incluyas costos hundidos ni ignores costos de oportunidad.
      </Note>
    </div>
  );
}
