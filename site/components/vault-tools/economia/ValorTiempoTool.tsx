"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Note } from "@studyvaults/ui";
import {
  num,
  pct,
  fmt,
  money,
  valorFuturo,
  valorPresente,
  despejeTasa,
  despejePlazo,
  montoSimple,
  montoContinuo,
  teaContinua,
} from "./lib/finance";

/* ================================================================== */
/* VALOR TIEMPO DEL DINERO — capital único (Unidad 7)                  */
/* ================================================================== */

export default function ValorTiempoTool() {
  const [mode, setMode] = useState<"despeje" | "simpleVsComp" | "continua">(
    "despeje",
  );

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Cálculo financiero · Unidad 7</span>
        <h3>Valor tiempo del dinero — capital único</h3>
        <p>
          Capitalizá y actualizá un <b>capital único</b> con interés compuesto.
          Ingresá tres de los cuatro datos <span className="vtool-mono">P · F · i · n</span>{" "}
          y la herramienta despeja el cuarto. También compará interés simple vs.
          compuesto y la capitalización continua. La tasa siempre va efectiva del
          período de <span className="vtool-mono">n</span>.
        </p>
      </div>

      <div className="vtool-field">
        <label className="vtool-label">
          <b>Modo</b>
        </label>
        <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
          <option value="despeje">Capitalizar / actualizar (compuesto)</option>
          <option value="simpleVsComp">Interés simple vs. compuesto</option>
          <option value="continua">Capitalización continua</option>
        </Select>
      </div>

      {mode === "despeje" && <DespejeMode />}
      {mode === "simpleVsComp" && <SimpleVsCompMode />}
      {mode === "continua" && <ContinuaMode />}

      <Note>
        Regla base: <span className="vtool-mono">F = P·(1+i)^n</span>. De ahí salen{" "}
        <span className="vtool-mono">P = F/(1+i)^n</span>,{" "}
        <span className="vtool-mono">i = (F/P)^(1/n) − 1</span> y{" "}
        <span className="vtool-mono">n = ln(F/P)/ln(1+i)</span>. La tasa{" "}
        <span className="vtool-mono">i</span> tiene que ser efectiva del mismo
        período que <span className="vtool-mono">n</span>.
      </Note>
    </div>
  );
}

/* ---- Modo 1: despejar la incógnita entre P, F, i, n ---- */

type Incognita = "F" | "P" | "i" | "n";

function DespejeMode() {
  const [incog, setIncog] = useState<Incognita>("F");
  const [pStr, setPStr] = useState("1000");
  const [fStr, setFStr] = useState("1210");
  const [iStr, setIStr] = useState("10");
  const [nStr, setNStr] = useState("2");

  const r = useMemo(() => {
    const P = num(pStr);
    const F = num(fStr);
    const i = num(iStr) / 100;
    const n = num(nStr);

    if (incog === "F") {
      if (![P, i, n].every(Number.isFinite)) return null;
      return { label: "F (valor futuro)", value: valorFuturo(P, i, n), kind: "money" as const };
    }
    if (incog === "P") {
      if (![F, i, n].every(Number.isFinite)) return null;
      return { label: "P (valor presente)", value: valorPresente(F, i, n), kind: "money" as const };
    }
    if (incog === "i") {
      if (![P, F, n].every(Number.isFinite) || P === 0 || n === 0) return null;
      return { label: "i (tasa efectiva)", value: despejeTasa(P, F, n), kind: "pct" as const };
    }
    // incog === "n"
    if (![P, F, i].every(Number.isFinite) || P <= 0 || F <= 0 || i <= -1) return null;
    return { label: "n (cantidad de períodos)", value: despejePlazo(P, F, i), kind: "num" as const };
  }, [incog, pStr, fStr, iStr, nStr]);

  return (
    <>
      <div className="vtool-field">
        <label className="vtool-label">
          <b>Incógnita a despejar</b>
        </label>
        <Select value={incog} onChange={(e) => setIncog(e.target.value as Incognita)}>
          <option value="F">F — valor futuro</option>
          <option value="P">P — valor presente</option>
          <option value="i">i — tasa efectiva del período</option>
          <option value="n">n — cantidad de períodos</option>
        </Select>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          {incog !== "P" && (
            <div className="vtool-field">
              <label className="vtool-label">
                <b>P</b> (valor presente)
              </label>
              <TextInput
                inputMode="decimal"
                value={pStr}
                onChange={(e) => setPStr(e.target.value)}
              />
            </div>
          )}
          {incog !== "F" && (
            <div className="vtool-field">
              <label className="vtool-label">
                <b>F</b> (valor futuro)
              </label>
              <TextInput
                inputMode="decimal"
                value={fStr}
                onChange={(e) => setFStr(e.target.value)}
              />
            </div>
          )}
          {incog !== "i" && (
            <div className="vtool-field">
              <label className="vtool-label">
                <b>i</b> (% efectiva del período)
              </label>
              <TextInput
                inputMode="decimal"
                value={iStr}
                onChange={(e) => setIStr(e.target.value)}
              />
            </div>
          )}
          {incog !== "n" && (
            <div className="vtool-field">
              <label className="vtool-label">
                <b>n</b> (períodos)
              </label>
              <TextInput
                inputMode="decimal"
                value={nStr}
                onChange={(e) => setNStr(e.target.value)}
              />
            </div>
          )}
        </div>

        <div className="vtool-stack">
          {!r || !Number.isFinite(r.value) ? (
            <p className="vtool-error">
              Completá los tres datos restantes con valores válidos.
            </p>
          ) : (
            <div className="vtool-bignum">
              {r.label} ={" "}
              {r.kind === "money"
                ? money(r.value, 2)
                : r.kind === "pct"
                  ? pct(r.value, 4)
                  : fmt(r.value, 4)}
              <small>
                {r.kind === "pct"
                  ? "tasa efectiva por período"
                  : r.kind === "num"
                    ? "períodos (misma unidad que i)"
                    : "en moneda del enunciado"}
              </small>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ---- Modo 2: interés simple vs. compuesto ---- */

function SimpleVsCompMode() {
  const [pStr, setPStr] = useState("1000");
  const [iStr, setIStr] = useState("10");
  const [nStr, setNStr] = useState("2");

  const r = useMemo(() => {
    const P = num(pStr);
    const i = num(iStr) / 100;
    const n = num(nStr);
    if (![P, i, n].every(Number.isFinite)) return null;
    const simple = montoSimple(P, i, n);
    const comp = valorFuturo(P, i, n);
    return { P, i, n, simple, comp, dif: comp - simple };
  }, [pStr, iStr, nStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>P</b> (capital inicial)
            </label>
            <TextInput
              inputMode="decimal"
              value={pStr}
              onChange={(e) => setPStr(e.target.value)}
            />
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>i</b> (% por período)
              </label>
              <TextInput
                inputMode="decimal"
                value={iStr}
                onChange={(e) => setIStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>n</b> (períodos)
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
            <p className="vtool-error">Completá P, i y n con números válidos.</p>
          ) : (
            <div className="vtool-sub">
              <span className="vtool-eyebrow">Resultados</span>
              <div className="vtool-kv">
                <span className="k">M simple = P(1 + i·n)</span>
                <span className="v">{money(r.simple, 2)}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">F compuesto = P(1 + i)^n</span>
                <span className="v acc">{money(r.comp, 2)}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Diferencia (interés sobre interés)</span>
                <span className="v coral">{money(r.dif, 2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Note>
        El interés <b>simple</b> capitaliza solo sobre el capital inicial; el{" "}
        <b>compuesto</b> también sobre los intereses ya ganados. Por eso{" "}
        <span className="vtool-mono">F ≥ M</span> y la brecha crece con{" "}
        <span className="vtool-mono">n</span>. Coinciden cuando{" "}
        <span className="vtool-mono">n = 1</span>.
      </Note>
    </>
  );
}

/* ---- Modo 3: capitalización continua ---- */

function ContinuaMode() {
  const [pStr, setPStr] = useState("100");
  const [rStr, setRStr] = useState("8");
  const [nStr, setNStr] = useState("2");

  const r = useMemo(() => {
    const P = num(pStr);
    const rate = num(rStr) / 100;
    const n = num(nStr);
    if (![P, rate, n].every(Number.isFinite)) return null;
    return { P, rate, n, monto: montoContinuo(P, rate, n), tea: teaContinua(rate) };
  }, [pStr, rStr, nStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>P</b> (capital inicial)
            </label>
            <TextInput
              inputMode="decimal"
              value={pStr}
              onChange={(e) => setPStr(e.target.value)}
            />
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>r</b> (% nominal continua anual)
              </label>
              <TextInput
                inputMode="decimal"
                value={rStr}
                onChange={(e) => setRStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>n</b> (años)
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
            <p className="vtool-error">Completá P, r y n con números válidos.</p>
          ) : (
            <>
              <div className="vtool-bignum">
                F = {money(r.monto, 2)}
                <small>
                  {fmt(r.P, 2)}·e^({fmt(r.rate, 4)}·{fmt(r.n, 2)})
                </small>
              </div>
              <div className="vtool-sub">
                <div className="vtool-kv">
                  <span className="k">TEA equivalente = e^r − 1</span>
                  <span className="v acc">{pct(r.tea, 4)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Note>
        Capitalización continua: <span className="vtool-mono">F = P·e^(r·n)</span>.
        La tasa continua <span className="vtool-mono">r</span> equivale a una{" "}
        <span className="vtool-mono">TEA = e^r − 1</span>. Ej.: P=100, r=8%, n=2 →
        F = 117,35.
      </Note>
    </>
  );
}
