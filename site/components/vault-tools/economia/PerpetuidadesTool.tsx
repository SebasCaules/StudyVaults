"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Note } from "@studyvaults/ui";
import {
  num,
  pct,
  fmt,
  money,
  vpPerpetuidad,
  vpPerpetuidadCreciente,
  vpPerpetuidadDiferida,
} from "./lib/finance";

/* ================================================================== */
/* PERPETUIDADES — flujo a perpetuidad (Unidad 7)                      */
/* ================================================================== */

export default function PerpetuidadesTool() {
  const [mode, setMode] = useState<"constante" | "creciente" | "diferida">(
    "constante",
  );

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Cálculo financiero · Unidad 7</span>
        <h3>Perpetuidades</h3>
        <p>
          Valuá un flujo que no termina nunca. La perpetuidad constante vale{" "}
          <b>C/i</b> un período <i>antes</i> del primer pago; con crecimiento
          constante se usa Gordon (<b>C₁/(i−g)</b>) y si el primer pago llega
          recién en t+1 hay que <b>diferir</b> ese valor a hoy.
        </p>
      </div>

      <div className="vtool-field">
        <label className="vtool-label">
          <b>Tipo de perpetuidad</b>
        </label>
        <Select
          value={mode}
          onChange={(e) => setMode(e.target.value as typeof mode)}
        >
          <option value="constante">Constante (C/i)</option>
          <option value="creciente">Creciente · Gordon (C₁/(i−g))</option>
          <option value="diferida">Diferida (primer pago en t+1)</option>
        </Select>
      </div>

      {mode === "constante" && <ConstanteMode />}
      {mode === "creciente" && <CrecienteMode />}
      {mode === "diferida" && <DiferidaMode />}

      <Note>
        Regla de oro: <span className="vtool-mono">VP = C / i</span> (constante),{" "}
        <span className="vtool-mono">VP = C₁ / (i − g)</span> (creciente, requiere{" "}
        i &gt; g) y <span className="vtool-mono">VP₀ = (C / i) / (1 + i)^t</span>{" "}
        (diferida). El cociente C/i siempre queda valuado un período antes del
        primer flujo.
      </Note>
    </div>
  );
}

/* ---- Modo 1: perpetuidad constante (con despeje de i = C/VP) ---- */

function ConstanteMode() {
  const [despeje, setDespeje] = useState(false);
  const [cStr, setCStr] = useState("100");
  const [iStr, setIStr] = useState("10");
  const [vpStr, setVpStr] = useState("1000");

  const r = useMemo(() => {
    const C = num(cStr);
    if (!Number.isFinite(C)) return null;
    if (despeje) {
      // despeje de rendimiento: i = C / VP
      const vp = num(vpStr);
      if (!Number.isFinite(vp) || vp === 0) return null;
      return { despeje: true as const, C, vp, i: C / vp };
    }
    const i = num(iStr) / 100;
    if (!Number.isFinite(i) || i <= 0) return null;
    return { despeje: false as const, C, i, vp: vpPerpetuidad(C, i) };
  }, [despeje, cStr, iStr, vpStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Modo de cálculo</b>
            </label>
            <Select
              value={despeje ? "i" : "vp"}
              onChange={(e) => setDespeje(e.target.value === "i")}
            >
              <option value="vp">Calcular VP (dados C e i)</option>
              <option value="i">Despejar rendimiento i (dados C y VP)</option>
            </Select>
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Cuota constante</b> C ($/período)
            </label>
            <TextInput
              inputMode="decimal"
              value={cStr}
              onChange={(e) => setCStr(e.target.value)}
            />
          </div>
          {!despeje ? (
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Tasa</b> i (% por período)
              </label>
              <TextInput
                inputMode="decimal"
                value={iStr}
                onChange={(e) => setIStr(e.target.value)}
              />
            </div>
          ) : (
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Precio / VP</b> ($)
              </label>
              <TextInput
                inputMode="decimal"
                value={vpStr}
                onChange={(e) => setVpStr(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">
              {despeje
                ? "Completá C y un VP distinto de cero."
                : "Completá C y una tasa i positiva."}
            </p>
          ) : r.despeje ? (
            <div className="vtool-bignum">
              i = {pct(r.i, 4)}
              <small>
                C/VP = {money(r.C, 2)} / {money(r.vp, 2)}
              </small>
            </div>
          ) : (
            <>
              <div className="vtool-bignum">
                VP = {money(r.vp, 2)}
                <small>
                  C/i = {money(r.C, 2)} / {fmt(r.i, 6)}
                </small>
              </div>
              <div className="vtool-sub">
                <div className="vtool-kv">
                  <span className="k">Rendimiento implícito (C/VP)</span>
                  <span className="v acc">{pct(r.i, 4)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Note>
        <span className="vtool-mono">VP = C / i</span>. Invirtiendo,{" "}
        <span className="vtool-mono">i = C / VP</span>: una renta de $
        {money(num(cStr) || 0, 0)} que se vende a su VP rinde exactamente esa
        tasa. Ej.: C = 100, i = 10% → VP = 1000.
      </Note>
    </>
  );
}

/* ---- Modo 2: perpetuidad creciente (Gordon), requiere i > g ---- */

function CrecienteMode() {
  const [c1Str, setC1Str] = useState("100");
  const [iStr, setIStr] = useState("10");
  const [gStr, setGStr] = useState("4");

  const r = useMemo(() => {
    const C1 = num(c1Str);
    const i = num(iStr) / 100;
    const g = num(gStr) / 100;
    if (![C1, i, g].every(Number.isFinite)) return null;
    if (i <= g) return { error: true as const, i, g };
    return {
      error: false as const,
      C1,
      i,
      g,
      vp: vpPerpetuidadCreciente(C1, i, g),
    };
  }, [c1Str, iStr, gStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Primer pago</b> C₁ ($, en t=1)
            </label>
            <TextInput
              inputMode="decimal"
              value={c1Str}
              onChange={(e) => setC1Str(e.target.value)}
            />
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Tasa</b> i (%)
              </label>
              <TextInput
                inputMode="decimal"
                value={iStr}
                onChange={(e) => setIStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Crecimiento</b> g (%)
              </label>
              <TextInput
                inputMode="decimal"
                value={gStr}
                onChange={(e) => setGStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">Completá C₁, i y g con números válidos.</p>
          ) : r.error ? (
            <p className="vtool-error">
              Gordon exige i &gt; g. Con i = {pct(r.i, 2)} ≤ g = {pct(r.g, 2)} el
              valor diverge (→ ∞).
            </p>
          ) : (
            <>
              <div className="vtool-bignum">
                VP = {money(r.vp, 2)}
                <small>
                  C₁/(i−g) = {money(r.C1, 2)} / {fmt(r.i - r.g, 6)}
                </small>
              </div>
              <div className="vtool-sub">
                <div className="vtool-kv">
                  <span className="k">Spread i − g</span>
                  <span className="v acc">{pct(r.i - r.g, 4)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Note>
        <span className="vtool-mono">VP = C₁ / (i − g)</span>, con C₁ el flujo del
        primer período (t=1) y <b>i &gt; g</b>. Cuanto más chico el spread{" "}
        <span className="vtool-mono">i − g</span>, mayor el valor: si i → g el VP
        tiende a infinito.
      </Note>
    </>
  );
}

/* ---- Modo 3: perpetuidad diferida (primer pago en t+1) ---- */

function DiferidaMode() {
  const [cStr, setCStr] = useState("100");
  const [iStr, setIStr] = useState("10");
  const [tStr, setTStr] = useState("3");

  const r = useMemo(() => {
    const C = num(cStr);
    const i = num(iStr) / 100;
    const t = num(tStr);
    if (![C, i, t].every(Number.isFinite) || i <= 0 || t < 0) return null;
    const enT = vpPerpetuidad(C, i); // valor en el período t
    const vp0 = vpPerpetuidadDiferida(C, i, t);
    return { C, i, t, enT, vp0 };
  }, [cStr, iStr, tStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Cuota constante</b> C ($/período)
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
                <b>Tasa</b> i (%)
              </label>
              <TextInput
                inputMode="decimal"
                value={iStr}
                onChange={(e) => setIStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Diferimiento</b> t (períodos)
              </label>
              <TextInput
                inputMode="numeric"
                value={tStr}
                onChange={(e) => setTStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">
              Completá C, una tasa i positiva y un t ≥ 0.
            </p>
          ) : (
            <>
              <div className="vtool-bignum">
                VP₀ = {money(r.vp0, 2)}
                <small>
                  ({money(r.enT, 2)}) / (1 + {fmt(r.i, 6)})^{fmt(r.t, 0)}
                </small>
              </div>
              <div className="vtool-sub">
                <div className="vtool-kv">
                  <span className="k">Valor en t = {fmt(r.t, 0)} (C/i)</span>
                  <span className="v">{money(r.enT, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Factor de actualización</span>
                  <span className="v acc">
                    1/(1+i)^{fmt(r.t, 0)} = {fmt(1 / Math.pow(1 + r.i, r.t), 6)}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Note>
        La perpetuidad <span className="vtool-mono">C/i</span> queda valuada en el
        período <b>t</b> (un período antes del primer pago, que ocurre en t+1).
        Para llevarla a hoy se descuenta t períodos:{" "}
        <span className="vtool-mono">VP₀ = (C/i) / (1 + i)^t</span>.
      </Note>
    </>
  );
}
