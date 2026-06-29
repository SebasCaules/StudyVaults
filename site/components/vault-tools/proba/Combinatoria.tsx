"use client";

import { useMemo, useState } from "react";
import { Panel, SubPanel, Note, Field, TextInput, Select, Badge } from "@studyvaults/ui";
import {
  factorial,
  permutations,
  variationsWithRep,
  choose,
  combinationsWithRep,
  fmt,
} from "../lib/stats";

/* ============================================================================
 * Combinatoria / conteo
 *
 * Calculadora de las formas de elegir/ordenar de la unidad 2. Inputs n, k
 * (enteros ≥ 0) y un modo. Las seis fórmulas viven en stats.ts; acá sólo
 * validamos, despachamos y presentamos el resultado con su fórmula simbólica.
 * SIN gráfico: tablas/lecturas.
 * ========================================================================== */

// Parser tolerante (coma o punto). Devuelve fallback ante entrada vacía/no numérica.
function num(s: string, fallback = NaN): number {
  if (s.trim() === "") return fallback;
  const v = Number(s.replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

type Modo = "varSin" | "varCon" | "combSin" | "combCon" | "perm" | "circ";

interface ModoSpec {
  label: string;
  // Necesita k además de n (las permutaciones puras y circulares sólo usan n).
  usaK: boolean;
  // Exige k ≤ n (variaciones y combinaciones sin repetición).
  kMenorN: boolean;
  // Fórmula simbólica con los valores enchufados.
  formula: (n: number, k: number) => string;
  // Cálculo, delegado en stats.ts.
  calc: (n: number, k: number) => number;
}

const MODOS: Record<Modo, ModoSpec> = {
  varSin: {
    label: "Variaciones sin repetición — P(n, k)",
    usaK: true,
    kMenorN: true,
    formula: (n, k) => `P(${n}, ${k}) = ${n}! / (${n} − ${k})!`,
    calc: (n, k) => permutations(n, k),
  },
  varCon: {
    label: "Variaciones con repetición — nᵏ",
    usaK: true,
    kMenorN: false,
    formula: (n, k) => `VR(${n}, ${k}) = ${n}^${k}`,
    calc: (n, k) => variationsWithRep(n, k),
  },
  combSin: {
    label: "Combinaciones sin repetición — C(n, k)",
    usaK: true,
    kMenorN: true,
    formula: (n, k) => `C(${n}, ${k}) = ${n}! / (${k}! · (${n} − ${k})!)`,
    calc: (n, k) => choose(n, k),
  },
  combCon: {
    label: "Combinaciones con repetición — CR(n, k)",
    usaK: true,
    kMenorN: false,
    formula: (n, k) => `CR(${n}, ${k}) = C(${n} + ${k} − 1, ${k})`,
    calc: (n, k) => combinationsWithRep(n, k),
  },
  perm: {
    label: "Permutaciones de n — n!",
    usaK: false,
    kMenorN: false,
    formula: (n) => `${n}!`,
    calc: (n) => factorial(n),
  },
  circ: {
    label: "Permutaciones circulares — (n − 1)!",
    usaK: false,
    kMenorN: false,
    formula: (n) => `(${n} − 1)!`,
    calc: (n) => factorial(n - 1),
  },
};

export default function CombinatoriaTool() {
  const [modo, setModo] = useState<Modo>("combSin");
  const [nStr, setNStr] = useState("5");
  const [kStr, setKStr] = useState("2");

  const spec = MODOS[modo];

  const res = useMemo((): { err: string } | { value: number; formula: string } => {
    const n = num(nStr);
    const k = num(kStr);

    if (!Number.isFinite(n)) return { err: "Ingresá n numérico." };
    if (!Number.isInteger(n) || n < 0) return { err: "n debe ser un entero ≥ 0." };
    if (modo === "circ" && n < 1)
      return { err: "Las permutaciones circulares requieren n ≥ 1." };

    let kEff = 0;
    if (spec.usaK) {
      if (!Number.isFinite(k)) return { err: "Ingresá k numérico." };
      if (!Number.isInteger(k) || k < 0) return { err: "k debe ser un entero ≥ 0." };
      if (spec.kMenorN && k > n)
        return { err: `En este modo se requiere k ≤ n (recibí k = ${k}, n = ${n}).` };
      kEff = k;
    }

    const value = spec.calc(n, kEff);
    if (!Number.isFinite(value))
      return {
        err:
          value === Infinity
            ? "El resultado supera el rango representable (overflow). Probá valores más chicos."
            : "Parámetros inválidos para este modo.",
      };

    return { value, formula: spec.formula(n, kEff) };
  }, [modo, nStr, kStr, spec]);

  return (
    <Panel>
      <div className="vtool-head">
        <h3>Combinatoria / conteo</h3>
        <p>
          Las seis formas de elegir y ordenar: elegí el modo, cargá n y k, y
          obtené el conteo con su fórmula simbólica.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* Controles */}
        <div className="vtool-stack">
          <Field label="Modo de conteo" htmlFor="comb-modo">
            <Select
              id="comb-modo"
              value={modo}
              onChange={(e) => setModo(e.target.value as Modo)}
            >
              {(Object.keys(MODOS) as Modo[]).map((m) => (
                <option key={m} value={m}>
                  {MODOS[m].label}
                </option>
              ))}
            </Select>
          </Field>

          <div className="vtool-row">
            <Field label="n (entero ≥ 0)" htmlFor="comb-n" style={{ flex: 1 }}>
              <TextInput
                id="comb-n"
                value={nStr}
                onChange={(e) => setNStr(e.target.value)}
                inputMode="numeric"
              />
            </Field>
            {spec.usaK && (
              <Field
                label={spec.kMenorN ? "k (0 ≤ k ≤ n)" : "k (entero ≥ 0)"}
                htmlFor="comb-k"
                style={{ flex: 1 }}
              >
                <TextInput
                  id="comb-k"
                  value={kStr}
                  onChange={(e) => setKStr(e.target.value)}
                  inputMode="numeric"
                />
              </Field>
            )}
          </div>

          {!spec.usaK && (
            <Note>
              Este modo usa sólo n: ordena los n objetos completos
              {modo === "circ" ? " alrededor de un círculo (una posición fija)." : "."}
            </Note>
          )}

          <Note>
            <b>Regla de Laplace.</b> Si todos los resultados son equiprobables,
            P(A) = casos favorables / casos posibles = |A| / |S|. Estas fórmulas
            son la caja de herramientas para contar el numerador y el denominador.
          </Note>
        </div>

        {/* Salida */}
        <div className="vtool-stack">
          {"err" in res ? (
            <Note tone="error">{res.err}</Note>
          ) : (
            <SubPanel>
              <div className="vtool-bignum">
                {fmt(res.value, 0)}
                <small> = casos</small>
              </div>
              <div className="vtool-code" style={{ marginTop: 12 }}>
                {res.formula}
              </div>
              <div className="vtool-readout" style={{ marginTop: 12 }}>
                <div className="vtool-kv">
                  <span className="k">Resultado</span>
                  <span className="v acc">{fmt(res.value, 0)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">¿Importa el orden?</span>
                  <span className="v">
                    {modo === "varSin" ||
                    modo === "varCon" ||
                    modo === "perm" ||
                    modo === "circ"
                      ? "Sí"
                      : "No"}
                  </span>
                </div>
                <div className="vtool-kv">
                  <span className="k">¿Se repiten elementos?</span>
                  <span className="v">
                    {modo === "varCon" || modo === "combCon" ? "Sí" : "No"}
                  </span>
                </div>
              </div>
            </SubPanel>
          )}

          {/* Matriz de decisión 2×2 */}
          <SubPanel>
            <div className="vtool-eyebrow">¿Cuál uso?</div>
            <Note style={{ marginTop: 8 }}>
              Antes de elegir fórmula, contestá dos preguntas: (1) ¿importa el
              orden? y (2) ¿se pueden repetir los elementos?
            </Note>
            <table className="vtool-table" style={{ marginTop: 10 }}>
              <thead>
                <tr>
                  <th>¿Importa el orden?</th>
                  <th>Sin repetición</th>
                  <th>Con repetición</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 600 }}>
                    Sí — variaciones / permutaciones
                  </td>
                  <td>
                    <code>n! / (n−k)!</code>
                  </td>
                  <td>
                    <code>nᵏ</code>
                  </td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 600 }}>No — combinaciones</td>
                  <td>
                    <code>C(n, k) = n! / (k!(n−k)!)</code>
                  </td>
                  <td>
                    <code>C(n+k−1, k)</code>
                  </td>
                </tr>
              </tbody>
            </table>
            <div className="vtool-row" style={{ marginTop: 10, gap: 8 }}>
              <Badge>Permutaciones de n = n!</Badge>
              <Badge>Circulares = (n−1)!</Badge>
            </div>
          </SubPanel>
        </div>
      </div>
    </Panel>
  );
}
