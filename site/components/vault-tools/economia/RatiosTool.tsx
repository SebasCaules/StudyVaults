"use client";

import { useMemo, useState } from "react";
import { TextInput, Note } from "@studyvaults/ui";
import { num, pct, fmt, money } from "./lib/finance";

/* ================================================================== */
/* RATIOS FINANCIEROS — análisis de balance + EERR (Unidad 6)          */
/* ================================================================== */

/** División segura: devuelve null si el denominador es 0 o no es finito. */
function div(numer: number, denom: number): number | null {
  if (!Number.isFinite(numer) || !Number.isFinite(denom) || denom === 0) return null;
  const r = numer / denom;
  return Number.isFinite(r) ? r : null;
}

/** Formato de un ratio "veces" (x): "1,52×" o "—". */
function vez(x: number | null, dp = 2): string {
  if (x === null) return "—";
  return `${fmt(x, dp)}×`;
}

/** Formato de un ratio expresado como porcentaje, o "—". */
function rpct(x: number | null, dp = 2): string {
  if (x === null) return "—";
  return pct(x, dp);
}

/** Formato de días, o "—". */
function dias(x: number | null, dp = 1): string {
  if (x === null) return "—";
  return `${money(x, dp)} días`;
}

interface BalanceInputs {
  activo: number;
  ac: number;
  bc: number;
  disp: number;
  pasivo: number;
  pc: number;
  deudaLP: number;
  pn: number;
  capital: number;
  creditos: number;
  deudasCom: number;
}

interface EerrInputs {
  ventas: number;
  ventasCredito: number;
  compras: number;
  cmv: number;
  ebit: number;
  ebitda: number;
  un: number;
  intereses: number;
  diasAnio: number;
}

interface Ratios {
  // Liquidez
  corriente: number | null;
  acida: number | null;
  absoluta: number | null;
  // Actividad
  ppc: number | null;
  ppp: number | null;
  diasExist: number | null;
  rotActivos: number | null;
  // Endeudamiento
  endTotal: number | null;
  deudaLPCapital: number | null;
  cobertura: number | null;
  // Rentabilidad
  margen: number | null;
  roe: number | null;
  operativa: number | null;
  // DuPont
  duMargen: number | null;
  duRotacion: number | null;
  duApalanca: number | null;
  duRoe: number | null;
}

export default function RatiosTool() {
  // --- Balance (defaults razonables: empresa poblada y consistente) ---
  const [activo, setActivo] = useState("1000000");
  const [ac, setAc] = useState("450000");
  const [bc, setBc] = useState("180000");
  const [disp, setDisp] = useState("90000");
  const [pasivo, setPasivo] = useState("600000");
  const [pc, setPc] = useState("250000");
  const [deudaLP, setDeudaLP] = useState("350000");
  const [pn, setPn] = useState("400000");
  const [capital, setCapital] = useState("300000");
  const [creditos, setCreditos] = useState("160000");
  const [deudasCom, setDeudasCom] = useState("120000");

  // --- Estado de resultados ---
  const [ventas, setVentas] = useState("1800000");
  const [ventasCredito, setVentasCredito] = useState("1300000");
  const [compras, setCompras] = useState("900000");
  const [cmv, setCmv] = useState("1100000");
  const [ebit, setEbit] = useState("260000");
  const [ebitda, setEbitda] = useState("330000");
  const [un, setUn] = useState("150000");
  const [intereses, setIntereses] = useState("60000");
  const [diasAnioStr, setDiasAnioStr] = useState("360");

  const balance = useMemo<BalanceInputs>(
    () => ({
      activo: num(activo),
      ac: num(ac),
      bc: num(bc),
      disp: num(disp),
      pasivo: num(pasivo),
      pc: num(pc),
      deudaLP: num(deudaLP),
      pn: num(pn),
      capital: num(capital),
      creditos: num(creditos),
      deudasCom: num(deudasCom),
    }),
    [activo, ac, bc, disp, pasivo, pc, deudaLP, pn, capital, creditos, deudasCom],
  );

  const eerr = useMemo<EerrInputs>(
    () => ({
      ventas: num(ventas),
      ventasCredito: num(ventasCredito),
      compras: num(compras),
      cmv: num(cmv),
      ebit: num(ebit),
      ebitda: num(ebitda),
      un: num(un),
      intereses: num(intereses),
      diasAnio: num(diasAnioStr),
    }),
    [ventas, ventasCredito, compras, cmv, ebit, ebitda, un, intereses, diasAnioStr],
  );

  const r = useMemo<Ratios>(() => {
    const b = balance;
    const e = eerr;
    const d = Number.isFinite(e.diasAnio) ? e.diasAnio : NaN;

    const duMargen = div(e.un, e.ventas);
    const duRotacion = div(e.ventas, b.activo);
    const duApalanca = div(b.activo, b.pn);
    const duRoe =
      duMargen !== null && duRotacion !== null && duApalanca !== null
        ? duMargen * duRotacion * duApalanca
        : null;

    return {
      corriente: div(b.ac, b.pc),
      acida: div(b.ac - b.bc, b.pc),
      absoluta: div(b.disp, b.pc),

      ppc: div(b.creditos * d, e.ventasCredito),
      ppp: div(b.deudasCom * d, e.compras),
      diasExist: div(b.bc * d, e.cmv),
      rotActivos: div(e.ventas, b.activo),

      endTotal: div(b.pasivo, b.activo),
      deudaLPCapital: div(b.deudaLP, b.capital),
      cobertura: div(e.ebitda, e.intereses),

      margen: div(e.un, e.ventas),
      roe: div(e.un, b.pn),
      operativa: div(e.ebit, b.activo),

      duMargen,
      duRotacion,
      duApalanca,
      duRoe,
    };
  }, [balance, eerr]);

  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Análisis contable · Unidad 6</span>
        <h3>Ratios financieros</h3>
        <p>
          Calculá los indicadores de <b>liquidez, actividad, endeudamiento y
          rentabilidad</b> a partir del balance y del estado de resultados, más la
          descomposición <b>DuPont</b> del ROE. Cargá los saldos del ejercicio;
          cuando un denominador es cero el ratio se muestra como <span className="vtool-mono">—</span>.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        {/* ---- Controles: inputs agrupados ---- */}
        <div className="vtool-stack">
          <div className="vtool-sub">
            <span className="vtool-eyebrow">Balance</span>
            <div className="vtool-row">
              <Num label="Activo total" value={activo} onChange={setActivo} />
              <Num label="Activo corriente (AC)" value={ac} onChange={setAc} />
            </div>
            <div className="vtool-row">
              <Num label="Bienes de cambio (BC)" value={bc} onChange={setBc} />
              <Num label="Disponibilidades" value={disp} onChange={setDisp} />
            </div>
            <div className="vtool-row">
              <Num label="Pasivo total" value={pasivo} onChange={setPasivo} />
              <Num label="Pasivo corriente (PC)" value={pc} onChange={setPc} />
            </div>
            <div className="vtool-row">
              <Num label="Deuda largo plazo" value={deudaLP} onChange={setDeudaLP} />
              <Num label="Patrimonio neto (PN)" value={pn} onChange={setPn} />
            </div>
            <div className="vtool-row">
              <Num label="Capital" value={capital} onChange={setCapital} />
              <Num label="Créditos por ventas" value={creditos} onChange={setCreditos} />
            </div>
            <div className="vtool-row">
              <Num label="Deudas comerciales" value={deudasCom} onChange={setDeudasCom} />
              <div className="vtool-field" />
            </div>
          </div>

          <div className="vtool-sub">
            <span className="vtool-eyebrow">Estado de resultados</span>
            <div className="vtool-row">
              <Num label="Ventas" value={ventas} onChange={setVentas} />
              <Num label="Ventas a crédito" value={ventasCredito} onChange={setVentasCredito} />
            </div>
            <div className="vtool-row">
              <Num label="Compras" value={compras} onChange={setCompras} />
              <Num label="CMV" value={cmv} onChange={setCmv} />
            </div>
            <div className="vtool-row">
              <Num label="EBIT" value={ebit} onChange={setEbit} />
              <Num label="EBITDA" value={ebitda} onChange={setEbitda} />
            </div>
            <div className="vtool-row">
              <Num label="Utilidad neta" value={un} onChange={setUn} />
              <Num label="Intereses anuales" value={intereses} onChange={setIntereses} />
            </div>
            <div className="vtool-row">
              <Num label="Días del año" value={diasAnioStr} onChange={setDiasAnioStr} mode="numeric" />
              <div className="vtool-field" />
            </div>
          </div>
        </div>

        {/* ---- Resultados agrupados ---- */}
        <div className="vtool-stack">
          <div className="vtool-sub">
            <span className="vtool-eyebrow">Liquidez</span>
            <KV k="Liquidez corriente (AC/PC)" v={vez(r.corriente)} acc />
            <KV k="Prueba ácida ((AC−BC)/PC)" v={vez(r.acida)} />
            <KV k="Liquidez absoluta (Disp/PC)" v={vez(r.absoluta)} />
          </div>

          <div className="vtool-sub">
            <span className="vtool-eyebrow">Actividad</span>
            <KV k="PPC — cobranzas" v={dias(r.ppc)} />
            <KV k="PPP — pagos" v={dias(r.ppp)} />
            <KV k="Días de existencias" v={dias(r.diasExist)} />
            <KV k="Rotación de activos (V/Activo)" v={vez(r.rotActivos)} />
          </div>

          <div className="vtool-sub">
            <span className="vtool-eyebrow">Endeudamiento</span>
            <KV k="Endeudamiento total (Pasivo/Activo)" v={rpct(r.endTotal)} coral />
            <KV k="Deuda LP / Capital" v={vez(r.deudaLPCapital)} />
            <KV k="Cobertura (EBITDA/Intereses)" v={vez(r.cobertura)} />
          </div>

          <div className="vtool-sub">
            <span className="vtool-eyebrow">Rentabilidad</span>
            <KV k="Margen neto (UN/Ventas)" v={rpct(r.margen)} />
            <KV k="ROE (UN/PN)" v={rpct(r.roe)} acc />
            <KV k="Rentabilidad operativa (EBIT/Activo)" v={rpct(r.operativa)} />
          </div>

          <div className="vtool-sub">
            <span className="vtool-eyebrow">DuPont — ROE descompuesto</span>
            <KV k="Margen (UN/Ventas)" v={rpct(r.duMargen)} />
            <KV k="Rotación (Ventas/Activo)" v={vez(r.duRotacion)} />
            <KV k="Apalancamiento (Activo/PN)" v={vez(r.duApalanca)} />
            <KV k="ROE = producto de los 3" v={rpct(r.duRoe)} acc />
          </div>
        </div>
      </div>

      <Note>
        DuPont:{" "}
        <span className="vtool-mono">
          ROE = (UN/Ventas) × (Ventas/Activo) × (Activo/PN)
        </span>
        . El primer factor es rentabilidad, el segundo eficiencia en el uso de
        activos y el tercero apalancamiento financiero: aísla de dónde viene el
        retorno sobre el patrimonio.
      </Note>
    </div>
  );
}

/* ---- Helpers de presentación ---- */

function Num({
  label,
  value,
  onChange,
  mode = "decimal",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  mode?: "decimal" | "numeric";
}) {
  return (
    <div className="vtool-field">
      <label className="vtool-label">
        <b>{label}</b>
      </label>
      <TextInput
        inputMode={mode}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function KV({
  k,
  v,
  acc = false,
  coral = false,
}: {
  k: string;
  v: string;
  acc?: boolean;
  coral?: boolean;
}) {
  const cls = acc ? "v acc" : coral ? "v coral" : "v";
  return (
    <div className="vtool-kv">
      <span className="k">{k}</span>
      <span className={cls}>{v}</span>
    </div>
  );
}
