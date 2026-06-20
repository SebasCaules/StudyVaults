"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Slider, Note, Field } from "@studyvaults/ui";
import {
  num,
  money,
  pct,
  tnaDiariaToTem,
  factorAnualidad,
  amortizacionLineal,
  valorLibro,
  feo,
  feeVentaActivo,
  van,
} from "./lib/finance";

/* ================================================================== */
/* SIMULADOR DEL PARCIAL 2 — dos problemas canónicos con resolución    */
/* paso a paso revelable. Defaults = casos oficiales (U7 y U8).         */
/* ================================================================== */

export default function SimuladorTool() {
  const [problema, setProblema] = useState<"alquilar" | "van">("alquilar");

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Simulador · Parcial 2 (Unidades 7 y 8)</span>
        <h3>Simulador del Parcial 2</h3>
        <p>
          Dos problemas canónicos con parámetros editables y{" "}
          <b>resolución paso a paso revelable</b>. Cambiá los números y todo se
          recalcula en vivo: ideal para entender el mecanismo y para autoexaminarte
          tapando la solución.
        </p>
      </div>

      <div className="vtool-field">
        <label className="vtool-label">
          <b>Problema</b>
        </label>
        <Select
          value={problema}
          onChange={(e) => setProblema(e.target.value as typeof problema)}
        >
          <option value="alquilar">P1 · ¿Alquilar o comprar? (U7)</option>
          <option value="van">P2 · VAN de un proyecto (U8)</option>
        </Select>
      </div>

      {problema === "alquilar" ? <AlquilarOComprar /> : <VanProyecto />}

      <Note>
        El simulador no reemplaza al formulario: usá la resolución para chequear que
        cada paso te sale solo. En el parcial siempre conviene escribir la fórmula
        antes del número.
      </Note>
    </div>
  );
}

/* ================================================================== */
/* PROBLEMA 1 — ¿Alquilar o comprar? (cálculo financiero, U7)          */
/* ================================================================== */

interface FilaPartidos {
  p: number;
  costoMes: number;
  vp: number;
  conviene: boolean;
}

interface ModeloAlquilar {
  tem: number;
  factor: number;
  precio: number;
  vida: number;
  n1: number;
  n2: number;
  n3: number;
  tna: number;
  filas: FilaPartidos[];
  corte: number | null;
}

function AlquilarOComprar() {
  // Defaults = caso oficial: precio 150000, vida 12, alquileres 5000/4500/4000,
  // TNA 35% cap. diaria → TEM 2,958%, factor 9,9789, corte en 4 partidos/mes.
  const [precioStr, setPrecioStr] = useState("150000");
  const [vidaStr, setVidaStr] = useState("12");
  const [n1Str, setN1Str] = useState("5000");
  const [n2Str, setN2Str] = useState("4500");
  const [n3Str, setN3Str] = useState("4000");
  const [tnaStr, setTnaStr] = useState("35");
  const [show, setShow] = useState(false);

  const m = useMemo<ModeloAlquilar | null>(() => {
    const precio = num(precioStr);
    const vida = num(vidaStr);
    const n1 = num(n1Str);
    const n2 = num(n2Str);
    const n3 = num(n3Str);
    const tna = num(tnaStr) / 100;

    const vals = [precio, vida, n1, n2, n3, tna];
    if (!vals.every(Number.isFinite)) return null;
    if (vida < 1) return null;

    // Paso 1: TEM desde TNA cap. diaria, formato parcial (360/30).
    const tem = tnaDiariaToTem(tna);
    // Paso 2: factor de actualización de la anualidad a(vida; TEM).
    const factor = factorAnualidad(vida, tem);

    // Costo de alquilar p partidos/mes: 1.º al nivel 1, 2.º al nivel 2, 3.º+ al nivel 3.
    const costoPartidos = (p: number): number => {
      let s = 0;
      for (let k = 1; k <= p; k++) s += k === 1 ? n1 : k === 2 ? n2 : n3;
      return s;
    };

    // Paso 3: tabla de partidos/mes → costo mensual → VP (= costo·factor) vs precio.
    const filas: FilaPartidos[] = [];
    let corte: number | null = null;
    for (let p = 1; p <= 6; p++) {
      const costoMes = costoPartidos(p);
      const vp = costoMes * factor;
      const conviene = vp > precio; // VP de alquilar supera el precio → conviene comprar
      if (conviene && corte === null) corte = p;
      filas.push({ p, costoMes, vp, conviene });
    }

    return { tem, factor, precio, vida, n1, n2, n3, tna, filas, corte };
  }, [precioStr, vidaStr, n1Str, n2Str, n3Str, tnaStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        {/* ---------------- Controles ---------------- */}
        <div className="vtool-stack">
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Precio de compra</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={precioStr}
                onChange={(e) => setPrecioStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Vida útil</b> (meses)
              </label>
              <TextInput
                inputMode="numeric"
                value={vidaStr}
                onChange={(e) => setVidaStr(e.target.value)}
              />
            </div>
          </div>

          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Alquiler 1.º</b> partido
              </label>
              <TextInput
                inputMode="decimal"
                value={n1Str}
                onChange={(e) => setN1Str(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Alquiler 2.º</b> partido
              </label>
              <TextInput
                inputMode="decimal"
                value={n2Str}
                onChange={(e) => setN2Str(e.target.value)}
              />
            </div>
          </div>

          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Alquiler 3.º+</b> partido
              </label>
              <TextInput
                inputMode="decimal"
                value={n3Str}
                onChange={(e) => setN3Str(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>TNA</b> (% anual, cap. diaria)
              </label>
              <TextInput
                inputMode="decimal"
                value={tnaStr}
                onChange={(e) => setTnaStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ---------------- Resultado ---------------- */}
        <div className="vtool-stack">
          {!m ? (
            <p className="vtool-error">
              Completá todos los campos con números válidos (vida ≥ 1 mes).
            </p>
          ) : (
            <>
              <div className="vtool-bignum">
                {m.corte === null
                  ? "Alquilar siempre"
                  : `Comprar desde ${m.corte} partidos/mes`}
                <small>
                  precio {money(m.precio, 0)} · TEM {pct(m.tem, 3)} · a({m.vida};TEM){" "}
                  {money(m.factor, 4)}
                </small>
              </div>
              <p className="vtool-sub">
                Por debajo del corte conviene <b>alquilar</b> (el VP de los alquileres
                es menor al precio); a partir del corte conviene <b>comprar</b>.
              </p>
            </>
          )}
        </div>
      </div>

      {m && (
        <>
          <button
            type="button"
            className="vtool-mono"
            onClick={() => setShow((s) => !s)}
          >
            {show ? "Ocultar resolución ▲" : "Mostrar resolución ▼"}
          </button>

          {show && (
            <>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Paso 1 · TEM (TNA cap. diaria)</span>
                <p>
                  Pasamos la TNA a la tasa efectiva mensual con formato del parcial
                  (año 360, mes 30):
                </p>
                <p className="vtool-mono">
                  TEM = (1 + {pct(m.tna, 0)}/360)^30 − 1 = {pct(m.tem, 4)}
                </p>
              </div>

              <div className="vtool-sub">
                <span className="vtool-eyebrow">Paso 2 · Factor de la anualidad</span>
                <p>
                  El alquiler es una anualidad vencida de {m.vida} cuotas mensuales.
                  Su factor de actualización:
                </p>
                <p className="vtool-mono">
                  a({m.vida}; {pct(m.tem, 4)}) = [1 − (1 + {fmtFactor(m.tem)})^−{m.vida}]
                  /{fmtFactor(m.tem)} = {money(m.factor, 4)}
                </p>
              </div>

              <div className="vtool-sub">
                <span className="vtool-eyebrow">
                  Paso 3 · VP de alquilar vs precio de comprar
                </span>
                <p>
                  Cada partido extra suma su alquiler (1.º al nivel 1, 2.º al nivel 2,
                  3.º en adelante al nivel 3). El VP de alquilar es{" "}
                  <span className="vtool-mono">costo mensual · a({m.vida};TEM)</span>;
                  conviene comprar cuando ese VP supera el precio {money(m.precio, 0)}.
                </p>
                <table className="vtool-table">
                  <thead>
                    <tr>
                      <th>Partidos/mes</th>
                      <th>Costo mensual</th>
                      <th>VP alquilar</th>
                      <th>Decisión</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.filas.map((f) => (
                      <tr key={f.p}>
                        <td>{f.p}</td>
                        <td>{money(f.costoMes, 0)}</td>
                        <td className="vtool-mono">{money(f.vp, 0)}</td>
                        <td>{f.conviene ? "Comprar" : "Alquilar"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </>
      )}

      <Note>
        Regla del problema:{" "}
        <span className="vtool-mono">VP_alquilar = costo_mensual · a(n;TEM)</span>;
        comprar conviene cuando{" "}
        <span className="vtool-mono">VP_alquilar &gt; precio</span>. Ej. oficial: TNA
        35% → TEM 2,958%, a(12;TEM)=9,9789, corte en 4 partidos/mes (VP 174.631 &gt;
        150.000).
      </Note>
    </>
  );
}

/** Helper de formato local para mostrar la TEM como fracción dentro de la fórmula. */
function fmtFactor(i: number): string {
  return money(i, 5);
}

/* ================================================================== */
/* PROBLEMA 2 — VAN de un proyecto (evaluación, U8)                     */
/* ================================================================== */

interface FilaFlujo {
  t: number;
  inversion: number;
  feoTramo: number;
  fee: number;
  ff: number;
}

interface ModeloVan {
  n: number;
  r: number;
  t: number;
  amort: number;
  nAm: number;
  feoCon: number;
  feoSin: number;
  vlFinal: number;
  fee: number;
  filas: FilaFlujo[];
  ff: number[];
  van: number;
  // desglose del FEO del primer tramo
  uaii: number;
  ig: number;
  un: number;
}

function VanProyecto() {
  // Defaults = parque solar Tema 2 → VAN +1,88.
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
  const [show, setShow] = useState(false);

  const m = useMemo<ModeloVan | null>(() => {
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

    const vals = [r, t, I0, invAdic, V, C, VO, nAm, VM, VR];
    if (!vals.every(Number.isFinite)) return null;
    if (n < 1 || nAm < 1) return null;

    const amort = amortizacionLineal(VO, VR, nAm); // (VO−VR)/nAm
    if (!Number.isFinite(amort)) return null;

    const feoCon = feo(V, C, amort, t); // años con amortización
    const feoSin = feo(V, C, 0, t); // años sin amortización

    const vlFinal = Math.max(valorLibro(VO, amort, n), VR);
    const fee = feeVentaActivo(VM, Math.max(vlFinal, 0), t); // flujo terminal año n

    const ff: number[] = new Array(n + 1).fill(0);
    ff[0] = -I0;
    for (let y = 1; y <= n; y++) ff[y] = y <= nAm ? feoCon : feoSin;
    if (n >= 1) ff[1] -= invAdic;
    ff[n] += fee;

    const filas: FilaFlujo[] = [];
    for (let y = 0; y <= n; y++) {
      const inversion = y === 0 ? -I0 : y === 1 ? -invAdic : 0;
      const feoTramo = y === 0 ? 0 : y <= nAm ? feoCon : feoSin;
      const feeY = y === n ? fee : 0;
      filas.push({ t: y, inversion, feoTramo, fee: feeY, ff: ff[y] });
    }

    const vanProy = van(r, ff);

    const uaii = V - C - amort;
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
      filas,
      ff,
      van: vanProy,
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
  ]);

  const vanOk = m ? m.van > 0 : false;

  return (
    <>
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
                <b>Inversión</b> año 0
              </label>
              <TextInput
                inputMode="decimal"
                value={i0Str}
                onChange={(e) => setI0Str(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Inversión</b> año 1
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
                <b>Costos</b> C (anual)
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
                <b>VO amortizable</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={voStr}
                onChange={(e) => setVoStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>n_am</b> (años)
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
                <b>Valor de venta final</b> VM
              </label>
              <TextInput
                inputMode="decimal"
                value={vmStr}
                onChange={(e) => setVmStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Valor residual</b> VR
              </label>
              <TextInput
                inputMode="decimal"
                value={vrStr}
                onChange={(e) => setVrStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ---------------- Resultado ---------------- */}
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
                  <span className="k">Amortización anual</span>
                  <span className="v">{money(m.amort, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">FEO años 1–{m.nAm} (c/amort)</span>
                  <span className="v">{money(m.feoCon, 2)}</span>
                </div>
                {m.n > m.nAm && (
                  <div className="vtool-kv">
                    <span className="k">
                      FEO años {m.nAm + 1}–{m.n} (s/amort)
                    </span>
                    <span className="v">{money(m.feoSin, 2)}</span>
                  </div>
                )}
                <div className="vtool-kv">
                  <span className="k">FEE venta activo (año {m.n})</span>
                  <span className="v acc">{money(m.fee, 2)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {m && (
        <>
          <button
            type="button"
            className="vtool-mono"
            onClick={() => setShow((s) => !s)}
          >
            {show ? "Ocultar resolución ▲" : "Mostrar resolución ▼"}
          </button>

          {show && (
            <>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Paso 1 · Amortización lineal</span>
                <p className="vtool-mono">
                  Am = (VO − VR)/n_am = ({money(num(voStr), 0)} − {money(num(vrStr), 0)}
                  )/{m.nAm} = {money(m.amort, 2)} por año
                </p>
              </div>

              <div className="vtool-sub">
                <span className="vtool-eyebrow">Paso 2 · FEO por tramo</span>
                <p>
                  FEO = (V − C)(1 − t) + t·Am. Con amortización (años 1 a {m.nAm}) y sin
                  amortización (después):
                </p>
                <div className="vtool-kv">
                  <span className="k">UAII = V − C − Am</span>
                  <span className="v">{money(m.uaii, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">IG = t · UAII</span>
                  <span className="v coral">−{money(m.ig, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">UN + Am = FEO (c/amort)</span>
                  <span className="v acc">{money(m.feoCon, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">FEO (s/amort)</span>
                  <span className="v">{money(m.feoSin, 2)}</span>
                </div>
              </div>

              <div className="vtool-sub">
                <span className="vtool-eyebrow">Paso 3 · FEE (venta del activo)</span>
                <p className="vtool-mono">
                  FEE = VM − t·(VM − VL) = {money(num(vmStr), 0)} − {pct(m.t, 0)}·(
                  {money(num(vmStr), 0)} − {money(m.vlFinal, 0)}) = {money(m.fee, 2)}
                </p>
                <p className="vtool-sub">
                  VL final = máx(VO − Am·n, VR) = {money(m.vlFinal, 2)} (ya amortizado
                  totalmente si n ≥ n_am).
                </p>
              </div>

              <div className="vtool-sub">
                <span className="vtool-eyebrow">Paso 4 · Flujo de fondos y VAN</span>
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
                <p className="vtool-mono">
                  VAN = Σ FFₜ/(1+{pct(m.r, 0)})ᵗ = {money(m.van, 2)}
                </p>
                <p className="vtool-sub">
                  {vanOk
                    ? "VAN > 0: el proyecto crea valor a la TREMA dada. Es un VAN muy ajustado: cualquier baja de ventas o suba de la TREMA lo vuelve negativo."
                    : "VAN ≤ 0: a esta TREMA el proyecto no crea valor. Revisá ventas, costos o el valor de venta final."}
                </p>
              </div>
            </>
          )}
        </>
      )}

      <Note>
        Flujo incremental después de impuestos:{" "}
        <span className="vtool-mono">FF₀ = −I₀</span> ·{" "}
        <span className="vtool-mono">FEO = (V−C)(1−t) + t·Am</span> ·{" "}
        <span className="vtool-mono">FEE = VM − t·(VM − VL)</span> ·{" "}
        <span className="vtool-mono">VAN = Σ FFₜ/(1+r)ᵗ</span>. Ej. oficial (parque
        solar Tema 2): VAN ≈ +1,88.
      </Note>
    </>
  );
}
