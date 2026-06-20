"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Note } from "@studyvaults/ui";
import {
  num,
  fmt,
  money,
  pct,
  valorAnualEquivalente,
  vanCadenaReemplazo,
  factorAnualidad,
} from "./lib/finance";

/* ================================================================== */
/* CAE / VAE Y CADENA DE REEMPLAZO — comparar vidas distintas (Unidad 8)*/
/* ================================================================== */

type Criterio = "van" | "costo";

interface Proyecto {
  van: number;
  vida: number;
  vae: number;
}

interface ComparacionModel {
  i: number;
  A: Proyecto;
  B: Proyecto;
  ganaVAE: "A" | "B" | "empate";
}

interface CadenaModel {
  i: number;
  vanCorto: number;
  vidaCorta: number;
  horizonte: number;
  ciclos: number;
  vanCadena: number;
  vanLargo: number;
  gana: "corto" | "largo" | "empate";
}

export default function CaeTool() {
  const [mode, setMode] = useState<"vae" | "cadena">("vae");

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Evaluación de proyectos · Unidad 8</span>
        <h3>VAE / CAE y cadena de reemplazo</h3>
        <p>
          Comparar proyectos <b>mutuamente excluyentes con vidas distintas</b> no se
          hace con el VAN crudo: hay que igualar los horizontes. Dos caminos:
          anualizar el VAN (<b>Valor Anual Equivalente</b>, o <b>Costo Anual
          Equivalente</b> si son costos) o repetir el proyecto corto hasta cubrir un
          horizonte común (<b>cadena de reemplazo</b>).
        </p>
      </div>

      <div className="vtool-field">
        <label className="vtool-label">
          <b>Método</b>
        </label>
        <Select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
          <option value="vae">VAE / CAE: anualizar y comparar A vs B</option>
          <option value="cadena">Cadena de reemplazo: repetir el corto vs el largo</option>
        </Select>
      </div>

      {mode === "vae" && <VaeMode />}
      {mode === "cadena" && <CadenaMode />}

      <Note>
        Regla: <span className="vtool-mono">VAE = VAN / a(n;i)</span>, con{" "}
        <span className="vtool-mono">a(n;i) = [1 − (1+i)^−n] / i</span>. Con vidas
        distintas, compará por VAE (no por VAN). Si los flujos son costos, el VAE es el
        CAE y <b>gana el menor</b>.
      </Note>
    </div>
  );
}

/* ---- Modo 1: VAE / CAE de dos proyectos con vidas distintas ---- */

function VaeMode() {
  const [iStr, setIStr] = useState("12");
  const [criterio, setCriterio] = useState<Criterio>("van");
  const [vanAStr, setVanAStr] = useState("3518");
  const [vidaAStr, setVidaAStr] = useState("5");
  const [vanBStr, setVanBStr] = useState("4200");
  const [vidaBStr, setVidaBStr] = useState("8");

  const r = useMemo<ComparacionModel | null>(() => {
    const i = num(iStr) / 100;
    const vanA = num(vanAStr);
    const vidaA = num(vidaAStr);
    const vanB = num(vanBStr);
    const vidaB = num(vidaBStr);
    if (![i, vanA, vidaA, vanB, vidaB].every(Number.isFinite)) return null;
    if (i <= -1 || vidaA <= 0 || vidaB <= 0) return null;

    const A: Proyecto = { van: vanA, vida: vidaA, vae: valorAnualEquivalente(vanA, vidaA, i) };
    const B: Proyecto = { van: vanB, vida: vidaB, vae: valorAnualEquivalente(vanB, vidaB, i) };

    // VAN: gana el mayor VAE. Costo: gana el menor CAE.
    let ganaVAE: ComparacionModel["ganaVAE"];
    const dif = A.vae - B.vae;
    if (Math.abs(dif) < 1e-9) ganaVAE = "empate";
    else if (criterio === "van") ganaVAE = dif > 0 ? "A" : "B";
    else ganaVAE = dif < 0 ? "A" : "B";

    return { i, A, B, ganaVAE };
  }, [iStr, criterio, vanAStr, vidaAStr, vanBStr, vidaBStr]);

  const etiqueta = criterio === "van" ? "VAN" : "Costo";
  const acentoVAE = criterio === "van" ? "acc" : "coral";

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
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
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Los flujos son…</b>
            </label>
            <Select
              value={criterio}
              onChange={(e) => setCriterio(e.target.value as Criterio)}
            >
              <option value="van">VAN (beneficio) → gana el mayor VAE</option>
              <option value="costo">Costos → gana el menor CAE</option>
            </Select>
          </div>

          <div className="vtool-field">
            <span className="vtool-eyebrow">Proyecto A</span>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>{etiqueta} A</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={vanAStr}
                onChange={(e) => setVanAStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Vida A</b> (años)
              </label>
              <TextInput
                inputMode="decimal"
                value={vidaAStr}
                onChange={(e) => setVidaAStr(e.target.value)}
              />
            </div>
          </div>

          <div className="vtool-field">
            <span className="vtool-eyebrow">Proyecto B</span>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>{etiqueta} B</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={vanBStr}
                onChange={(e) => setVanBStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Vida B</b> (años)
              </label>
              <TextInput
                inputMode="decimal"
                value={vidaBStr}
                onChange={(e) => setVidaBStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">
              Completá tasa, {etiqueta.toLowerCase()} y vida (años &gt; 0) de ambos
              proyectos.
            </p>
          ) : (
            <>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Proyecto A · n = {fmt(r.A.vida, 0)}</span>
                <div className="vtool-kv">
                  <span className="k">{etiqueta}</span>
                  <span className="v">{money(r.A.van)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">VAE = {etiqueta}/a({fmt(r.A.vida, 0)};i)</span>
                  <span className={`v ${acentoVAE}`}>{money(r.A.vae)}</span>
                </div>
              </div>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Proyecto B · n = {fmt(r.B.vida, 0)}</span>
                <div className="vtool-kv">
                  <span className="k">{etiqueta}</span>
                  <span className="v">{money(r.B.van)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">VAE = {etiqueta}/a({fmt(r.B.vida, 0)};i)</span>
                  <span className={`v ${acentoVAE}`}>{money(r.B.vae)}</span>
                </div>
              </div>
              <div className="vtool-bignum">
                {r.ganaVAE === "empate"
                  ? "Empate técnico"
                  : `Conviene el proyecto ${r.ganaVAE}`}
                <small>
                  {criterio === "van"
                    ? "mayor VAE = más valor por año"
                    : "menor CAE = menos costo por año"}
                </small>
              </div>
            </>
          )}
        </div>
      </div>

      {r && (
        <Note>
          <span className="vtool-mono">
            a({fmt(r.A.vida, 0)};{pct(r.i, 2)}) = {fmt(factorAnualidad(r.A.vida, r.i), 4)}
          </span>{" "}
          →{" "}
          <span className="vtool-mono">
            VAE_A = {money(r.A.van)} / {fmt(factorAnualidad(r.A.vida, r.i), 4)} ={" "}
            {money(r.A.vae)}
          </span>
        </Note>
      )}
    </>
  );
}

/* ---- Modo 2: cadena de reemplazo del proyecto corto vs el largo ---- */

function CadenaMode() {
  const [iStr, setIStr] = useState("12");
  const [vanCortoStr, setVanCortoStr] = useState("3518");
  const [vidaCortaStr, setVidaCortaStr] = useState("5");
  const [vanLargoStr, setVanLargoStr] = useState("6000");
  const [horizonteStr, setHorizonteStr] = useState("10");

  const r = useMemo<CadenaModel | null>(() => {
    const i = num(iStr) / 100;
    const vanCorto = num(vanCortoStr);
    const vidaCorta = num(vidaCortaStr);
    const vanLargo = num(vanLargoStr);
    const horizonte = num(horizonteStr);
    if (![i, vanCorto, vidaCorta, vanLargo, horizonte].every(Number.isFinite)) return null;
    if (i <= -1 || vidaCorta <= 0 || horizonte <= 0) return null;

    const ciclos = Math.round(horizonte / vidaCorta);
    const vanCadena = vanCadenaReemplazo(vanCorto, vidaCorta, horizonte, i);

    let gana: CadenaModel["gana"];
    const dif = vanCadena - vanLargo;
    if (Math.abs(dif) < 1e-9) gana = "empate";
    else gana = dif > 0 ? "corto" : "largo";

    return { i, vanCorto, vidaCorta, horizonte, ciclos, vanCadena, vanLargo, gana };
  }, [iStr, vanCortoStr, vidaCortaStr, vanLargoStr, horizonteStr]);

  return (
    <>
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
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

          <div className="vtool-field">
            <span className="vtool-eyebrow">Proyecto corto (se repite)</span>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>VAN de un ciclo</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={vanCortoStr}
                onChange={(e) => setVanCortoStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Vida</b> (años)
              </label>
              <TextInput
                inputMode="decimal"
                value={vidaCortaStr}
                onChange={(e) => setVidaCortaStr(e.target.value)}
              />
            </div>
          </div>

          <div className="vtool-field">
            <label className="vtool-label">
              <b>Horizonte común</b> (años, múltiplo de la vida corta)
            </label>
            <TextInput
              inputMode="decimal"
              value={horizonteStr}
              onChange={(e) => setHorizonteStr(e.target.value)}
            />
          </div>

          <div className="vtool-field">
            <label className="vtool-label">
              <b>VAN del proyecto largo</b> (al mismo horizonte)
            </label>
            <TextInput
              inputMode="decimal"
              value={vanLargoStr}
              onChange={(e) => setVanLargoStr(e.target.value)}
            />
          </div>
        </div>

        <div className="vtool-stack">
          {!r ? (
            <p className="vtool-error">
              Completá tasa, VAN/vida del corto, horizonte (&gt; 0) y VAN del largo.
            </p>
          ) : (
            <>
              <div className="vtool-bignum">
                VAN cadena = {money(r.vanCadena)}
                <small>
                  {fmt(r.ciclos, 0)} ciclo(s) del corto hasta {fmt(r.horizonte, 0)} años
                </small>
              </div>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Comparación al horizonte común</span>
                <div className="vtool-kv">
                  <span className="k">VAN cadena (corto repetido)</span>
                  <span className="v acc">{money(r.vanCadena)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">VAN proyecto largo</span>
                  <span className="v">{money(r.vanLargo)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Diferencia (cadena − largo)</span>
                  <span className={`v ${r.vanCadena - r.vanLargo >= 0 ? "acc" : "coral"}`}>
                    {money(r.vanCadena - r.vanLargo)}
                  </span>
                </div>
              </div>
              <div className="vtool-bignum">
                {r.gana === "empate"
                  ? "Empate técnico"
                  : r.gana === "corto"
                    ? "Conviene repetir el corto"
                    : "Conviene el proyecto largo"}
                <small>mayor VAN sobre el mismo horizonte</small>
              </div>
            </>
          )}
        </div>
      </div>

      {r && (
        <Note>
          <span className="vtool-mono">
            VAN_cadena = Σ VAN_corto/(1+i)^(k·{fmt(r.vidaCorta, 0)})
          </span>{" "}
          para k = 0…{fmt(r.ciclos - 1, 0)} = <span className="vtool-mono">{money(r.vanCadena)}</span>.
          El horizonte debe ser múltiplo de la vida corta; si no, redondea ciclos.
        </Note>
      )}
    </>
  );
}
