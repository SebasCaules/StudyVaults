"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Note } from "@studyvaults/ui";
import {
  num,
  pct,
  fmt,
  tasaProporcional,
  tnaToTea,
  teaToEfectivaSubperiodo,
  tnaDiariaToTem,
  tasaEquivalente,
} from "./lib/finance";

/* ================================================================== */
/* TASAS EQUIVALENTES — el "paso 1 siempre" del Parcial 2 (Unidad 7)   */
/* ================================================================== */

// Capitalizaciones por año más usuales en la cátedra.
const CAPS: { label: string; k: number }[] = [
  { label: "Anual (k=1)", k: 1 },
  { label: "Semestral (k=2)", k: 2 },
  { label: "Cuatrimestral (k=3)", k: 3 },
  { label: "Trimestral (k=4)", k: 4 },
  { label: "Bimestral (k=6)", k: 6 },
  { label: "Mensual (k=12)", k: 12 },
  { label: "Diaria (k=360)", k: 360 },
];

export default function TasasTool() {
  const [mode, setMode] = useState<"tna" | "parcial" | "equiv">("tna");

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Cálculo financiero · Unidad 7</span>
        <h3>Tasas equivalentes</h3>
        <p>
          Convertí entre tasa nominal (TNA), proporcional, efectiva anual (TEA) y
          efectiva de cualquier subperíodo. Es el <b>paso 1 de casi todo problema
          de Parcial 2</b>: nunca descontar ni capitalizar con una TNA sin pasarla
          antes a la tasa efectiva del período de los flujos.
        </p>
      </div>

      <div className="vtool-field">
        <label className="vtool-label">
          <b>Modo de conversión</b>
        </label>
        <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
          <option value="tna">TNA → proporcional · TEA · TEM</option>
          <option value="parcial">TNA cap. diaria → TEM (formato parcial 360/30)</option>
          <option value="equiv">Tasa equivalente entre períodos</option>
        </Select>
      </div>

      {mode === "tna" && <TnaMode />}
      {mode === "parcial" && <ParcialMode />}
      {mode === "equiv" && <EquivMode />}

      <Note>
        Regla de oro: <span className="vtool-mono">(1 + TNA/k)^k − 1 = TEA</span>. A
        mayor frecuencia de capitalización <span className="vtool-mono">k</span>,
        mayor TEA para la misma TNA. Dos tasas son equivalentes si producen el mismo
        capital final sobre el mismo plazo.
      </Note>
    </div>
  );
}

/* ---- Modo 1: TNA → proporcional, TEA y efectivas de subperíodo ---- */

function TnaMode() {
  const [tnaStr, setTnaStr] = useState("36");
  const [kIdx, setKIdx] = useState(5); // mensual por defecto

  const r = useMemo(() => {
    const tna = num(tnaStr) / 100;
    if (!Number.isFinite(tna)) return null;
    const k = CAPS[kIdx].k;
    const iprop = tasaProporcional(tna, k);
    const tea = tnaToTea(tna, k);
    const tem = teaToEfectivaSubperiodo(tea, 12);
    const ted = teaToEfectivaSubperiodo(tea, 360);
    return { tna, k, iprop, tea, tem, ted };
  }, [tnaStr, kIdx]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>TNA</b> (% anual)
            </label>
            <TextInput
              inputMode="decimal"
              value={tnaStr}
              onChange={(e) => setTnaStr(e.target.value)}
            />
          </div>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Capitalización</b>
            </label>
            <Select value={kIdx} onChange={(e) => setKIdx(Number(e.target.value))}>
              {CAPS.map((c, i) => (
                <option key={c.k} value={i}>
                  {c.label}
                </option>
              ))}
            </Select>
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">Ingresá una TNA numérica.</p>
          ) : (
            <div className="vtool-sub">
              <span className="vtool-eyebrow">Resultados</span>
              <div className="vtool-kv">
                <span className="k">Tasa proporcional (i/k)</span>
                <span className="v">{pct(r.iprop, 4)}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">TEA efectiva anual</span>
                <span className="v acc">{pct(r.tea, 4)}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">TEM efectiva mensual</span>
                <span className="v acc">{pct(r.tem, 4)}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">TED efectiva diaria</span>
                <span className="v">{pct(r.ted, 6)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {r && (
        <Note>
          <span className="vtool-mono">
            i/k = {fmt(r.tna * 100, 2)}%/{r.k} = {pct(r.iprop, 4)}
          </span>{" "}
          · <span className="vtool-mono">TEA = (1+{fmt(r.iprop, 5)})^{r.k} − 1 = {pct(r.tea, 4)}</span>
        </Note>
      )}
    </>
  );
}

/* ---- Modo 2: TNA cap. diaria → TEM, formato parcial (360/30) ---- */

function ParcialMode() {
  const [tnaStr, setTnaStr] = useState("35");
  const [diasAnio, setDiasAnio] = useState("360");
  const [diasMes, setDiasMes] = useState("30");

  const r = useMemo(() => {
    const tna = num(tnaStr) / 100;
    const dA = num(diasAnio);
    const dM = num(diasMes);
    if (![tna, dA, dM].every(Number.isFinite) || dA <= 0) return null;
    const tem = tnaDiariaToTem(tna, dA, dM);
    const ted = tasaProporcional(tna, dA); // tasa diaria efectiva (cap. diaria)
    const tea = Math.pow(1 + tna / dA, dA) - 1;
    return { tna, dA, dM, tem, ted, tea };
  }, [tnaStr, diasAnio, diasMes]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
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
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Días/año</b>
              </label>
              <TextInput
                inputMode="numeric"
                value={diasAnio}
                onChange={(e) => setDiasAnio(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Días/mes</b>
              </label>
              <TextInput
                inputMode="numeric"
                value={diasMes}
                onChange={(e) => setDiasMes(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">Completá TNA y días con números válidos.</p>
          ) : (
            <>
              <div className="vtool-bignum">
                TEM = {pct(r.tem, 4)}
                <small>
                  (1 + {fmt(r.tna, 4)}/{r.dA})^{r.dM} − 1
                </small>
              </div>
              <div className="vtool-sub">
                <div className="vtool-kv">
                  <span className="k">Tasa diaria (i/{r.dA})</span>
                  <span className="v">{pct(r.ted, 6)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">TEA equivalente</span>
                  <span className="v acc">{pct(r.tea, 4)}</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <Note>
        Formato típico del parcial (año 360, mes 30):{" "}
        <span className="vtool-mono">TEM = (1 + TNA/360)^30 − 1</span>. Ej.: TNA 35% →
        TEM = 2,958%. ⚠️ <b>TNA/12 NO es la TEM</b> cuando capitaliza más seguido.
      </Note>
    </>
  );
}

/* ---- Modo 3: tasa efectiva equivalente entre dos períodos ---- */

function EquivMode() {
  const [iStr, setIStr] = useState("2");
  const [desdeStr, setDesdeStr] = useState("30");
  const [hastaStr, setHastaStr] = useState("80");

  const r = useMemo(() => {
    const i = num(iStr) / 100;
    const desde = num(desdeStr);
    const hasta = num(hastaStr);
    if (![i, desde, hasta].every(Number.isFinite) || desde <= 0) return null;
    return { i, desde, hasta, eq: tasaEquivalente(i, desde, hasta) };
  }, [iStr, desdeStr, hastaStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Tasa efectiva</b> i (%)
            </label>
            <TextInput
              inputMode="decimal"
              value={iStr}
              onChange={(e) => setIStr(e.target.value)}
            />
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>para</b> (unidades)
              </label>
              <TextInput
                inputMode="decimal"
                value={desdeStr}
                onChange={(e) => setDesdeStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>equivalente a</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={hastaStr}
                onChange={(e) => setHastaStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">Completá la tasa y los dos plazos.</p>
          ) : (
            <div className="vtool-bignum">
              i = {pct(r.eq, 4)}
              <small>
                tasa efectiva para {fmt(r.hasta, 0)} (mismas unidades)
              </small>
            </div>
          )}
        </div>
      </div>

      <Note>
        <span className="vtool-mono">i_hasta = (1 + i_desde)^(hasta/desde) − 1</span>.
        Ej.: 2% para 30 días → para 80 días: (1,02)^(80/30) − 1 = 5,42%. Sirve para
        capitalizar/actualizar saltando entre subperíodos sin pasar por la TEA.
      </Note>
    </>
  );
}
