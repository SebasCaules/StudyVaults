"use client";

import { useMemo, useState } from "react";
import { TextInput, Select, Note } from "@studyvaults/ui";
import {
  num,
  money,
  factorAnualidad,
  factorCapitalizacion,
  vpAnualidad,
  vfAnualidad,
  cuotaDesdeVA,
  cuotaDesdeVF,
} from "./lib/finance";

/* ================================================================== */
/* ANUALIDADES — cuota constante C por n períodos a tasa i (Unidad 7) */
/* ================================================================== */

type Mode = "valores" | "cuotaVA" | "cuotaVF";

export default function AnualidadesTool() {
  const [mode, setMode] = useState<Mode>("valores");
  const [due, setDue] = useState<"venc" | "adel">("venc");

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Cálculo financiero · Unidad 7</span>
        <h3>Anualidades</h3>
        <p>
          Flujo de <b>cuota constante</b> C durante n períodos a la tasa efectiva i
          del período. Resolvé el VA/VF de la serie, o despejá la cuota a partir de un
          valor actual (préstamo/leasing) o de un valor futuro (ahorro/fondo). La tasa
          i debe ser la efectiva del <b>mismo período</b> que la cuota.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-field">
          <label className="vtool-label">
            <b>Modo</b>
          </label>
          <Select value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="valores">Valor actual / futuro de la serie</option>
            <option value="cuotaVA">Cuota desde un VP (préstamo/leasing)</option>
            <option value="cuotaVF">Cuota desde un VF (ahorro/fondo)</option>
          </Select>
        </div>
        <div className="vtool-field">
          <label className="vtool-label">
            <b>Tipo de anualidad</b>
          </label>
          <Select value={due} onChange={(e) => setDue(e.target.value as typeof due)}>
            <option value="venc">Vencida (pago al final del período)</option>
            <option value="adel">Adelantada (pago al inicio)</option>
          </Select>
        </div>
      </div>

      {mode === "valores" && <ValoresMode due={due === "adel"} />}
      {mode === "cuotaVA" && <CuotaVAMode due={due === "adel"} />}
      {mode === "cuotaVF" && <CuotaVFMode due={due === "adel"} />}

      <Note>
        Factores base (anualidad vencida):{" "}
        <span className="vtool-mono">a(n;i) = [1−(1+i)^−n]/i</span> para el valor actual y{" "}
        <span className="vtool-mono">s(n;i) = [(1+i)^n−1]/i</span> para el valor futuro.
        Si es <b>adelantada</b>, ambos se multiplican por (1+i).
      </Note>
    </div>
  );
}

/* ---- Modo 1: VA y VF de la serie + factores a(n;i) y s(n;i) ---- */

function ValoresMode({ due }: { due: boolean }) {
  const [cStr, setCStr] = useState("1000");
  const [nStr, setNStr] = useState("5");
  const [iStr, setIStr] = useState("7");

  const r = useMemo(() => {
    const C = num(cStr);
    const n = num(nStr);
    const i = num(iStr) / 100;
    if (![C, n, i].every(Number.isFinite) || n <= 0) return null;
    const fa = factorAnualidad(n, i);
    const fs = factorCapitalizacion(n, i);
    return {
      C,
      n,
      i,
      fa,
      fs,
      va: vpAnualidad(C, n, i, due),
      vf: vfAnualidad(C, n, i, due),
    };
  }, [cStr, nStr, iStr, due]);

  return (
    <div className="vtool-grid vtool-grid--ctrl">
      <div className="vtool-stack">
        <div className="vtool-field">
          <label className="vtool-label">
            <b>Cuota</b> C
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
              <b>Períodos</b> n
            </label>
            <TextInput
              inputMode="numeric"
              value={nStr}
              onChange={(e) => setNStr(e.target.value)}
            />
          </div>
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
        </div>
      </div>

      <div className="vtool-stack">
        {!r ? (
          <p className="vtool-error">Completá C, n y la tasa con números válidos.</p>
        ) : (
          <div className="vtool-sub">
            <span className="vtool-eyebrow">Resultados ({due ? "adelantada" : "vencida"})</span>
            <div className="vtool-kv">
              <span className="k">Valor actual (VA)</span>
              <span className="v acc">{money(r.va)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Valor futuro (VF)</span>
              <span className="v acc">{money(r.vf)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Factor a(n;i)</span>
              <span className="v">{money(r.fa, 4)}</span>
            </div>
            <div className="vtool-kv">
              <span className="k">Factor s(n;i)</span>
              <span className="v">{money(r.fs, 4)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---- Modo 2: cuota a partir de un valor actual (préstamo/leasing) ---- */

function CuotaVAMode({ due }: { due: boolean }) {
  const [vaStr, setVaStr] = useState("150000");
  const [nStr, setNStr] = useState("12");
  const [iStr, setIStr] = useState("2.9582");

  const r = useMemo(() => {
    const VA = num(vaStr);
    const n = num(nStr);
    const i = num(iStr) / 100;
    if (![VA, n, i].every(Number.isFinite) || n <= 0) return null;
    return { VA, n, i, fa: factorAnualidad(n, i), cuota: cuotaDesdeVA(VA, n, i, due) };
  }, [vaStr, nStr, iStr, due]);

  return (
    <div className="vtool-grid vtool-grid--ctrl">
      <div className="vtool-stack">
        <div className="vtool-field">
          <label className="vtool-label">
            <b>Valor actual</b> VP
          </label>
          <TextInput
            inputMode="decimal"
            value={vaStr}
            onChange={(e) => setVaStr(e.target.value)}
          />
        </div>
        <div className="vtool-row">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Períodos</b> n
            </label>
            <TextInput
              inputMode="numeric"
              value={nStr}
              onChange={(e) => setNStr(e.target.value)}
            />
          </div>
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
        </div>
      </div>

      <div className="vtool-stack">
        {!r ? (
          <p className="vtool-error">Completá VP, n y la tasa con números válidos.</p>
        ) : (
          <>
            <div className="vtool-bignum">
              C = {money(r.cuota)}
              <small>
                cuota {due ? "adelantada" : "vencida"} · a(n;i) = {money(r.fa, 4)}
              </small>
            </div>
            <div className="vtool-sub">
              <div className="vtool-kv">
                <span className="k">Total pagado</span>
                <span className="v">{money(r.cuota * r.n)}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Intereses totales</span>
                <span className="v coral">{money(r.cuota * r.n - r.VA)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ---- Modo 3: cuota a partir de un valor futuro (ahorro/fondo) ---- */

function CuotaVFMode({ due }: { due: boolean }) {
  const [vfStr, setVfStr] = useState("100000");
  const [nStr, setNStr] = useState("12");
  const [iStr, setIStr] = useState("2.9582");

  const r = useMemo(() => {
    const VF = num(vfStr);
    const n = num(nStr);
    const i = num(iStr) / 100;
    if (![VF, n, i].every(Number.isFinite) || n <= 0) return null;
    return { VF, n, i, fs: factorCapitalizacion(n, i), cuota: cuotaDesdeVF(VF, n, i, due) };
  }, [vfStr, nStr, iStr, due]);

  return (
    <div className="vtool-grid vtool-grid--ctrl">
      <div className="vtool-stack">
        <div className="vtool-field">
          <label className="vtool-label">
            <b>Valor futuro</b> VF
          </label>
          <TextInput
            inputMode="decimal"
            value={vfStr}
            onChange={(e) => setVfStr(e.target.value)}
          />
        </div>
        <div className="vtool-row">
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Períodos</b> n
            </label>
            <TextInput
              inputMode="numeric"
              value={nStr}
              onChange={(e) => setNStr(e.target.value)}
            />
          </div>
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
        </div>
      </div>

      <div className="vtool-stack">
        {!r ? (
          <p className="vtool-error">Completá VF, n y la tasa con números válidos.</p>
        ) : (
          <>
            <div className="vtool-bignum">
              C = {money(r.cuota)}
              <small>
                cuota {due ? "adelantada" : "vencida"} · s(n;i) = {money(r.fs, 4)}
              </small>
            </div>
            <div className="vtool-sub">
              <div className="vtool-kv">
                <span className="k">Total aportado</span>
                <span className="v">{money(r.cuota * r.n)}</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Intereses ganados</span>
                <span className="v acc">{money(r.VF - r.cuota * r.n)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
