"use client";

import { useMemo, useState } from "react";
import {
  Panel,
  SubPanel,
  Note,
  Field,
  TextInput,
  Select,
  Chip,
} from "@studyvaults/ui";
import { normalQuantile, studentTQuantile, fmt } from "../lib/stats";

/* ============================================================================
 * Intervalos de confianza — IC para media (σ conocido → Z, σ desconocido → t)
 * y proporción (Z), con semiamplitud Δ y cálculo de tamaño muestral.
 * Fórmulas de Proba/wiki/conceptos/intervalos-de-confianza.md y
 * formulario-inferencia.md.
 * ========================================================================== */

// Parser numérico tolerante con fallback. Acepta coma o punto decimal.
function num(s: string, fb = NaN): number {
  if (s.trim() === "") return fb;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fb;
}

type Caso = "mediaZ" | "mediaT" | "prop";
type Lado = "bil" | "izq" | "der";

const CASO_LABELS: Record<Caso, string> = {
  mediaZ: "Media, σ conocido (Z)",
  mediaT: "Media, σ desconocido (t de Student)",
  prop: "Proporción (Z)",
};

// Formatea un extremo del IC tolerando ±∞ (unilaterales).
function fmtExtremo(v: number): string {
  if (v === Infinity) return "+∞";
  if (v === -Infinity) return "−∞";
  return fmt(v);
}

export default function IntervalosConfianzaTool() {
  const [caso, setCaso] = useState<Caso>("mediaZ");
  const [lado, setLado] = useState<Lado>("bil");

  // Comunes.
  const [nStr, setNStr] = useState("10");
  const [gammaStr, setGammaStr] = useState("0.95");

  // Caso 1 — media, σ conocido.
  const [xbarStr, setXbarStr] = useState("246");
  const [sigmaStr, setSigmaStr] = useState("15");

  // Caso 2 — media, σ desconocido.
  const [xbar2Str, setXbar2Str] = useState("10");
  const [sStr, setSStr] = useState("0.2828");

  // Caso 3 — proporción (vía p̂ directo o X éxitos / n).
  const [propMode, setPropMode] = useState<"phat" | "exitos">("phat");
  const [phatStr, setPhatStr] = useState("0.25");
  const [xExitStr, setXExitStr] = useState("150");

  // Tamaño muestral.
  const [errStr, setErrStr] = useState("5");
  const [tamSigmaStr, setTamSigmaStr] = useState("15");
  const [propConserv, setPropConserv] = useState(true);
  const [tamPhatStr, setTamPhatStr] = useState("0.25");

  /* ---- IC ---- */
  const ic = useMemo((): { err: string } | {
    cuantilLabel: string;
    cuantil: number;
    centro: number;
    delta: number;
    lo: number;
    hi: number;
    centroLabel: string;
    gl?: number;
    se: number;
  } => {
    const n = num(nStr);
    const gamma = num(gammaStr);
    if (!Number.isFinite(n) || !Number.isInteger(n) || n < 2)
      return { err: "n debe ser un entero ≥ 2." };
    if (!Number.isFinite(gamma) || gamma <= 0 || gamma >= 1)
      return { err: "El nivel de confianza γ debe estar en (0, 1)." };

    // Bilateral usa percentil (1+γ)/2; unilateral usa γ.
    const pCuantil = lado === "bil" ? (1 + gamma) / 2 : gamma;

    if (caso === "mediaZ") {
      const xbar = num(xbarStr);
      const sigma = num(sigmaStr);
      if (!Number.isFinite(xbar)) return { err: "Ingresá la media muestral x̄." };
      if (!Number.isFinite(sigma) || sigma <= 0)
        return { err: "σ debe ser mayor que 0." };
      const z = normalQuantile(pCuantil);
      const se = sigma / Math.sqrt(n);
      const delta = z * se;
      const lo = lado === "der" ? -Infinity : xbar - delta;
      const hi = lado === "izq" ? Infinity : xbar + delta;
      return {
        cuantilLabel: `z_{${fmt(pCuantil, 4)}}`,
        cuantil: z,
        centro: xbar,
        delta,
        lo,
        hi,
        centroLabel: "x̄",
        se,
      };
    }

    if (caso === "mediaT") {
      const xbar = num(xbar2Str);
      const s = num(sStr);
      if (!Number.isFinite(xbar)) return { err: "Ingresá la media muestral x̄." };
      if (!Number.isFinite(s) || s <= 0)
        return { err: "El desvío muestral S debe ser mayor que 0." };
      const gl = n - 1;
      const t = studentTQuantile(pCuantil, gl);
      const se = s / Math.sqrt(n);
      const delta = t * se;
      const lo = lado === "der" ? -Infinity : xbar - delta;
      const hi = lado === "izq" ? Infinity : xbar + delta;
      return {
        cuantilLabel: `t_{${gl}, ${fmt(pCuantil, 4)}}`,
        cuantil: t,
        centro: xbar,
        delta,
        lo,
        hi,
        centroLabel: "x̄",
        gl,
        se,
      };
    }

    // Proporción.
    let phat: number;
    if (propMode === "phat") {
      phat = num(phatStr);
      if (!Number.isFinite(phat)) return { err: "Ingresá la proporción muestral p̂." };
    } else {
      const x = num(xExitStr);
      if (!Number.isFinite(x) || !Number.isInteger(x) || x < 0)
        return { err: "X (éxitos) debe ser un entero ≥ 0." };
      if (x > n) return { err: "X (éxitos) no puede superar a n." };
      phat = x / n;
    }
    if (phat < 0 || phat > 1) return { err: "p̂ debe estar en [0, 1]." };
    const z = normalQuantile(pCuantil);
    const se = Math.sqrt((phat * (1 - phat)) / n);
    const delta = z * se;
    // Clamp a [0, 1] en cada extremo.
    const lo = lado === "der" ? 0 : Math.max(0, phat - delta);
    const hi = lado === "izq" ? 1 : Math.min(1, phat + delta);
    return {
      cuantilLabel: `z_{${fmt(pCuantil, 4)}}`,
      cuantil: z,
      centro: phat,
      delta,
      lo,
      hi,
      centroLabel: "p̂",
      se,
    };
  }, [
    caso,
    lado,
    nStr,
    gammaStr,
    xbarStr,
    sigmaStr,
    xbar2Str,
    sStr,
    propMode,
    phatStr,
    xExitStr,
  ]);

  /* ---- Tamaño muestral ---- */
  const tam = useMemo((): { err: string } | {
    z: number;
    nReq: number;
    formula: string;
    pUsado: number;
  } => {
    const gamma = num(gammaStr);
    const E = num(errStr);
    if (!Number.isFinite(gamma) || gamma <= 0 || gamma >= 1)
      return { err: "γ debe estar en (0, 1)." };
    if (!Number.isFinite(E) || E <= 0)
      return { err: "El error objetivo E debe ser mayor que 0." };
    // Tamaño muestral siempre con el fractil bilateral (1+γ)/2.
    const z = normalQuantile((1 + gamma) / 2);

    if (caso === "prop") {
      const pUsado = propConserv ? 0.25 : (() => {
        const ph = num(tamPhatStr);
        return Number.isFinite(ph) && ph >= 0 && ph <= 1 ? ph * (1 - ph) : NaN;
      })();
      if (!Number.isFinite(pUsado))
        return { err: "p̂ previo debe estar en [0, 1]." };
      const nReq = Math.ceil((z * z * pUsado) / (E * E));
      return {
        z,
        nReq,
        formula: propConserv
          ? "n ≥ z²·(1/4)/E²"
          : "n ≥ z²·p̂(1−p̂)/E²",
        pUsado,
      };
    }

    // Media (caso 1 o 3): usa σ. En el caso 3 se usa S como aproximación de σ.
    const sigma = num(tamSigmaStr);
    if (!Number.isFinite(sigma) || sigma <= 0)
      return { err: "σ (o S aproximado) debe ser mayor que 0." };
    const nReq = Math.ceil((z * z * sigma * sigma) / (E * E));
    return { z, nReq, formula: "n ≥ z²·σ²/E²", pUsado: NaN };
  }, [caso, gammaStr, errStr, tamSigmaStr, propConserv, tamPhatStr]);

  const ladoLabel: Record<Lado, string> = {
    bil: "bilateral",
    izq: "unilateral izq",
    der: "unilateral der",
  };

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Intervalos de confianza</h3>
        <p>
          IC para la media (σ conocido → Z, σ desconocido → t de Student) y para
          la proporción (Z), con la semiamplitud Δ y el tamaño muestral necesario.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* Controles */}
        <div className="vtool-stack">
          <Field label="Caso" htmlFor="ic-caso">
            <Select
              id="ic-caso"
              value={caso}
              onChange={(e) => setCaso(e.target.value as Caso)}
            >
              {(Object.keys(CASO_LABELS) as Caso[]).map((k) => (
                <option key={k} value={k}>
                  {CASO_LABELS[k]}
                </option>
              ))}
            </Select>
          </Field>

          <div className="vtool-row">
            <Field label="n (entero ≥ 2)" htmlFor="ic-n" style={{ flex: 1 }}>
              <TextInput
                id="ic-n"
                value={nStr}
                onChange={(e) => setNStr(e.target.value)}
                inputMode="numeric"
              />
            </Field>
            <Field label="γ ∈ (0, 1)" htmlFor="ic-gamma" style={{ flex: 1 }}>
              <TextInput
                id="ic-gamma"
                value={gammaStr}
                onChange={(e) => setGammaStr(e.target.value)}
                inputMode="decimal"
              />
            </Field>
          </div>

          <div className="vtool-field">
            <label className="vtool-label">
              <span>Tipo de intervalo</span>
            </label>
            <div className="vtool-row" style={{ marginTop: 6 }}>
              {(Object.keys(ladoLabel) as Lado[]).map((l) => (
                <Chip key={l} active={lado === l} onClick={() => setLado(l)}>
                  {ladoLabel[l]}
                </Chip>
              ))}
            </div>
            <Note style={{ marginTop: 8 }}>
              Bilateral usa el fractil de orden (1+γ)/2; unilateral usa γ.
            </Note>
          </div>

          {/* Inputs específicos del caso */}
          {caso === "mediaZ" && (
            <div className="vtool-row">
              <Field label="x̄ (media muestral)" htmlFor="ic-xbar" style={{ flex: 1 }}>
                <TextInput
                  id="ic-xbar"
                  value={xbarStr}
                  onChange={(e) => setXbarStr(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
              <Field label={<>σ &gt; 0 (conocido)</>} htmlFor="ic-sigma" style={{ flex: 1 }}>
                <TextInput
                  id="ic-sigma"
                  value={sigmaStr}
                  onChange={(e) => setSigmaStr(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
            </div>
          )}

          {caso === "mediaT" && (
            <div className="vtool-row">
              <Field label="x̄ (media muestral)" htmlFor="ic-xbar2" style={{ flex: 1 }}>
                <TextInput
                  id="ic-xbar2"
                  value={xbar2Str}
                  onChange={(e) => setXbar2Str(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
              <Field label={<>S &gt; 0 (desvío muestral)</>} htmlFor="ic-s" style={{ flex: 1 }}>
                <TextInput
                  id="ic-s"
                  value={sStr}
                  onChange={(e) => setSStr(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
            </div>
          )}

          {caso === "prop" && (
            <div className="vtool-field">
              <label className="vtool-label">
                <span>Dato de la proporción</span>
              </label>
              <div className="vtool-row" style={{ marginTop: 6 }}>
                <Chip active={propMode === "phat"} onClick={() => setPropMode("phat")}>
                  p̂ directo
                </Chip>
                <Chip active={propMode === "exitos"} onClick={() => setPropMode("exitos")}>
                  X éxitos / n
                </Chip>
              </div>
              {propMode === "phat" ? (
                <Field label="p̂ ∈ [0, 1]" htmlFor="ic-phat" style={{ marginTop: 10 }}>
                  <TextInput
                    id="ic-phat"
                    value={phatStr}
                    onChange={(e) => setPhatStr(e.target.value)}
                    inputMode="decimal"
                  />
                </Field>
              ) : (
                <Field
                  label="X (éxitos, entero ≥ 0)"
                  hint="p̂ = X / n"
                  htmlFor="ic-x"
                  style={{ marginTop: 10 }}
                >
                  <TextInput
                    id="ic-x"
                    value={xExitStr}
                    onChange={(e) => setXExitStr(e.target.value)}
                    inputMode="numeric"
                  />
                </Field>
              )}
            </div>
          )}

          <Note>
            <b>Árbol de decisión.</b> Para una <b>proporción</b> → Z. Para una{" "}
            <b>media</b>: si σ es <b>conocido</b> → Z; si σ es <b>desconocido</b>{" "}
            y la muestra es normal con n chico → t<sub>n−1</sub>; si n es muy
            grande (&gt; 200), t ≈ Z y se usa Z con S.
          </Note>
        </div>

        {/* Salida */}
        <div className="vtool-stack">
          {"err" in ic ? (
            <Note tone="error">{ic.err}</Note>
          ) : (
            <SubPanel>
              <div className="vtool-eyebrow">
                Intervalo de confianza ({ladoLabel[lado]}, γ = {fmt(num(gammaStr), 4)})
              </div>
              <div className="vtool-bignum" style={{ marginTop: 8 }}>
                ({fmtExtremo(ic.lo)}, {fmtExtremo(ic.hi)})
                <small> = IC{caso === "prop" ? "(p)" : "(μ)"}</small>
              </div>
              <div className="vtool-readout" style={{ marginTop: 12 }}>
                <div className="vtool-kv">
                  <span className="k">Centro ({ic.centroLabel})</span>
                  <span className="v">{fmt(ic.centro)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">
                    Cuantil <span className="vtool-mono">{ic.cuantilLabel}</span>
                  </span>
                  <span className="v acc">{fmt(ic.cuantil)}</span>
                </div>
                {ic.gl !== undefined && (
                  <div className="vtool-kv">
                    <span className="k">Grados de libertad (n−1)</span>
                    <span className="v">{ic.gl}</span>
                  </div>
                )}
                <div className="vtool-kv">
                  <span className="k">Error estándar</span>
                  <span className="v">{fmt(ic.se)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Semiamplitud Δ</span>
                  <span className="v coral">
                    {lado === "bil" ? fmt(ic.delta) : "—"}
                  </span>
                </div>
              </div>
              {caso === "prop" && (
                <Note style={{ marginTop: 10 }}>
                  Como p ∈ [0, 1], los extremos del intervalo se recortan a ese
                  rango.
                </Note>
              )}
              {lado !== "bil" && (
                <Note style={{ marginTop: 10 }}>
                  En el unilateral el otro extremo es abierto a infinito; Δ es la
                  distancia al único extremo finito ({fmt(ic.delta)}).
                </Note>
              )}
            </SubPanel>
          )}

          {/* Tamaño muestral */}
          <SubPanel>
            <div className="vtool-eyebrow">Tamaño muestral</div>
            <p className="vtool-sub" style={{ marginTop: 4 }}>
              n mínimo para un error de muestreo (semiamplitud) E objetivo.
            </p>

            <Field label="Error objetivo E (> 0)" htmlFor="tam-e" style={{ marginTop: 8 }}>
              <TextInput
                id="tam-e"
                value={errStr}
                onChange={(e) => setErrStr(e.target.value)}
                inputMode="decimal"
              />
            </Field>

            {caso === "prop" ? (
              <>
                <div className="vtool-row" style={{ marginTop: 10 }}>
                  <Chip active={propConserv} onClick={() => setPropConserv(true)}>
                    conservador (¼)
                  </Chip>
                  <Chip active={!propConserv} onClick={() => setPropConserv(false)}>
                    con p̂ previo
                  </Chip>
                </div>
                {!propConserv && (
                  <Field label="p̂ previo ∈ [0, 1]" htmlFor="tam-phat" style={{ marginTop: 10 }}>
                    <TextInput
                      id="tam-phat"
                      value={tamPhatStr}
                      onChange={(e) => setTamPhatStr(e.target.value)}
                      inputMode="decimal"
                    />
                  </Field>
                )}
              </>
            ) : (
              <Field
                label={<>σ &gt; 0 {caso === "mediaT" ? "(usá S como aproximación)" : ""}</>}
                htmlFor="tam-sigma"
                style={{ marginTop: 10 }}
              >
                <TextInput
                  id="tam-sigma"
                  value={tamSigmaStr}
                  onChange={(e) => setTamSigmaStr(e.target.value)}
                  inputMode="decimal"
                />
              </Field>
            )}

            {"err" in tam ? (
              <Note tone="error" style={{ marginTop: 10 }}>
                {tam.err}
              </Note>
            ) : (
              <>
                <div className="vtool-readout" style={{ marginTop: 12 }}>
                  <div className="vtool-kv">
                    <span className="k">
                      Cuantil{" "}
                      <span className="vtool-mono">
                        z_{`{${fmt((1 + num(gammaStr)) / 2, 4)}}`}
                      </span>
                    </span>
                    <span className="v">{fmt(tam.z)}</span>
                  </div>
                  {caso === "prop" && (
                    <div className="vtool-kv">
                      <span className="k">p̂(1−p̂) usado</span>
                      <span className="v">{fmt(tam.pUsado)}</span>
                    </div>
                  )}
                  <div className="vtool-kv">
                    <span className="k">
                      n requerido <span className="vtool-mono">{tam.formula}</span>
                    </span>
                    <span className="v acc">{tam.nReq}</span>
                  </div>
                </div>
                <div className="vtool-bignum" style={{ marginTop: 10 }}>
                  {tam.nReq}
                  <small> = n mínimo (⌈·⌉)</small>
                </div>
              </>
            )}
            <Note style={{ marginTop: 10 }}>
              El tamaño muestral usa el fractil bilateral z<sub>(1+γ)/2</sub>. La
              precisión mejora con √n: partir el error a la mitad cuadruplica la
              muestra.
            </Note>
          </SubPanel>
        </div>
      </div>
    </Panel>
  );
}
