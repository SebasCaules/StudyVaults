"use client";

import { useMemo, useState } from "react";
import { TextInput, Note } from "@studyvaults/ui";
import { num, money, fmt } from "./lib/finance";

/* ================================================================== */
/* CAPITAL DE TRABAJO — KT, FM, NOF y ciclo de caja (Unidad 6)         */
/* ================================================================== */

interface Estructura {
  kt: number;
  fm: number;
  nof: number;
  superavit: number; // FM − NOF
  superavitLiquido: number; // Activos líquidos − Pasivos líquidos (control cruzado)
  deficit: boolean;
}

interface Ciclo {
  operativo: number;
  caja: number;
}

export default function CapitalTrabajoTool() {
  // Sección 1 — estructura
  const [acStr, setAcStr] = useState("1500");
  const [pcStr, setPcStr] = useState("900");
  const [recPermStr, setRecPermStr] = useState("2200");
  const [inmovStr, setInmovStr] = useState("1800");
  const [actOperStr, setActOperStr] = useState("1100");
  const [pasEspontStr, setPasEspontStr] = useState("500");
  const [actLiqStr, setActLiqStr] = useState("400");
  const [pasLiqStr, setPasLiqStr] = useState("300");

  // Sección 2 — ciclo de caja
  const [invStr, setInvStr] = useState("60");
  const [cobStr, setCobStr] = useState("45");
  const [pagStr, setPagStr] = useState("30");

  const estructura = useMemo<Estructura | null>(() => {
    const ac = num(acStr);
    const pc = num(pcStr);
    const recPerm = num(recPermStr);
    const inmov = num(inmovStr);
    const actOper = num(actOperStr);
    const pasEspont = num(pasEspontStr);
    const actLiq = num(actLiqStr);
    const pasLiq = num(pasLiqStr);
    if (![ac, pc, recPerm, inmov, actOper, pasEspont, actLiq, pasLiq].every(Number.isFinite))
      return null;
    const kt = ac - pc;
    const fm = recPerm - inmov;
    const nof = actOper - pasEspont;
    const superavit = fm - nof;
    const superavitLiquido = actLiq - pasLiq;
    return { kt, fm, nof, superavit, superavitLiquido, deficit: fm < nof };
  }, [acStr, pcStr, recPermStr, inmovStr, actOperStr, pasEspontStr, actLiqStr, pasLiqStr]);

  const ciclo = useMemo<Ciclo | null>(() => {
    const inv = num(invStr);
    const cob = num(cobStr);
    const pag = num(pagStr);
    if (![inv, cob, pag].every(Number.isFinite)) return null;
    const operativo = inv + cob;
    return { operativo, caja: operativo - pag };
  }, [invStr, cobStr, pagStr]);

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Información contable · Unidad 6</span>
        <h3>Capital de trabajo y ciclo de caja</h3>
        <p>
          Estructura de corto plazo de la empresa: capital de trabajo (KT), fondo de
          maniobra (FM), necesidades operativas de fondos (NOF) y el resultante
          superávit/déficit. Abajo, el <b>ciclo de caja</b> en días: cuántos días de
          giro hay que financiar entre que se paga a proveedores y se cobra a clientes.
        </p>
      </div>

      {/* ----- Sección 1: estructura ----- */}
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <span className="vtool-eyebrow">Estructura patrimonial</span>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Activo corriente</b> (AC)
              </label>
              <TextInput
                inputMode="decimal"
                value={acStr}
                onChange={(e) => setAcStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Pasivo corriente</b> (PC)
              </label>
              <TextInput
                inputMode="decimal"
                value={pcStr}
                onChange={(e) => setPcStr(e.target.value)}
              />
            </div>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Recursos permanentes</b> (PN + deuda LP)
              </label>
              <TextInput
                inputMode="decimal"
                value={recPermStr}
                onChange={(e) => setRecPermStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Activos inmovilizados</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={inmovStr}
                onChange={(e) => setInmovStr(e.target.value)}
              />
            </div>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Activos operativos</b> (créditos + BC + caja mín.)
              </label>
              <TextInput
                inputMode="decimal"
                value={actOperStr}
                onChange={(e) => setActOperStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Pasivos espontáneos</b> (proveedores)
              </label>
              <TextInput
                inputMode="decimal"
                value={pasEspontStr}
                onChange={(e) => setPasEspontStr(e.target.value)}
              />
            </div>
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Activos líquidos</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={actLiqStr}
                onChange={(e) => setActLiqStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Pasivos líquidos</b>
              </label>
              <TextInput
                inputMode="decimal"
                value={pasLiqStr}
                onChange={(e) => setPasLiqStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!estructura ? (
            <p className="vtool-error">Completá todos los rubros con números válidos.</p>
          ) : (
            <>
              <div className="vtool-bignum">
                {estructura.superavit >= 0 ? "Superávit" : "Déficit"} ={" "}
                {money(Math.abs(estructura.superavit), 2)}
                <small>FM − NOF</small>
              </div>
              <div className="vtool-sub">
                <span className="vtool-eyebrow">Resultados</span>
                <div className="vtool-kv">
                  <span className="k">Capital de trabajo (KT = AC − PC)</span>
                  <span className="v">{money(estructura.kt, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Fondo de maniobra (FM)</span>
                  <span className="v acc">{money(estructura.fm, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">NOF (activos op. − pasivos espont.)</span>
                  <span className="v acc">{money(estructura.nof, 2)}</span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Superávit/déficit (FM − NOF)</span>
                  <span className={`v ${estructura.superavit < 0 ? "coral" : "acc"}`}>
                    {money(estructura.superavit, 2)}
                  </span>
                </div>
                <div className="vtool-kv">
                  <span className="k">Control: act. líq. − pas. líq.</span>
                  <span className="v">{money(estructura.superavitLiquido, 2)}</span>
                </div>
              </div>
              {estructura.deficit ? (
                <p className="vtool-error">
                  FM &lt; NOF: hay un déficit de {money(-estructura.superavit, 2)} que la
                  empresa debe cubrir con deuda financiera de corto plazo.
                </p>
              ) : (
                <div className="vtool-sub">
                  <div className="vtool-kv">
                    <span className="k">Veredicto</span>
                    <span className="v acc">
                      FM ≥ NOF: el fondo de maniobra alcanza a financiar las NOF.
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ----- Sección 2: ciclo de caja ----- */}
      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <span className="vtool-eyebrow">Ciclo de caja (días)</span>
          <div className="vtool-field">
            <label className="vtool-label">
              <b>Período de inventario</b> (días)
            </label>
            <TextInput
              inputMode="decimal"
              value={invStr}
              onChange={(e) => setInvStr(e.target.value)}
            />
          </div>
          <div className="vtool-row">
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Período de cobranza</b> (días)
              </label>
              <TextInput
                inputMode="decimal"
                value={cobStr}
                onChange={(e) => setCobStr(e.target.value)}
              />
            </div>
            <div className="vtool-field">
              <label className="vtool-label">
                <b>Período de pago</b> (días)
              </label>
              <TextInput
                inputMode="decimal"
                value={pagStr}
                onChange={(e) => setPagStr(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="vtool-stack">
          {!ciclo ? (
            <p className="vtool-error">Completá los tres períodos en días.</p>
          ) : (
            <div className="vtool-sub">
              <span className="vtool-eyebrow">Resultados</span>
              <div className="vtool-kv">
                <span className="k">Ciclo operativo (inventario + cobranza)</span>
                <span className="v acc">{fmt(ciclo.operativo, 1)} días</span>
              </div>
              <div className="vtool-kv">
                <span className="k">Ciclo de caja (operativo − pago)</span>
                <span className={`v ${ciclo.caja < 0 ? "coral" : "acc"}`}>
                  {fmt(ciclo.caja, 1)} días
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <Note>
        <span className="vtool-mono">KT = AC − PC</span> ·{" "}
        <span className="vtool-mono">FM = Rec. perm. − Inmovilizado</span> ·{" "}
        <span className="vtool-mono">NOF = Act. operativos − Pas. espontáneos</span> ·{" "}
        <span className="vtool-mono">Superávit = FM − NOF = Act. líq. − Pas. líq.</span> Si
        FM &lt; NOF aparece un déficit a financiar con deuda financiera de corto plazo. El{" "}
        <span className="vtool-mono">ciclo de caja = inventario + cobranza − pago</span> son
        los días de giro que la operación necesita financiar.
      </Note>
    </div>
  );
}
