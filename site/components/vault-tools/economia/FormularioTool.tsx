"use client";

import { Note } from "@studyvaults/ui";

/* ================================================================== */
/* FORMULARIO DE REFERENCIA — Parcial 2 (Unidades 6/7/8)               */
/* Solo presentación: tablas Concepto / Fórmula / Notas. Sin estado.   */
/* ================================================================== */

type Row = { concepto: string; formula: string; nota: string };

const U7_TASAS: Row[] = [
  {
    concepto: "Tasa proporcional",
    formula: "i_k = i / k",
    nota: "Reparto lineal de la TNA en k subperíodos. NO es efectiva.",
  },
  {
    concepto: "TEA desde TNA",
    formula: "TEA = (1 + i/k)^k − 1",
    nota: "k = capitalizaciones por año. Más k ⇒ más TEA.",
  },
  {
    concepto: "TEM (formato parcial)",
    formula: "TEM = (1 + TNA/360)^30 − 1",
    nota: "Año 360, mes 30. TNA/12 NO es la TEM si capitaliza diario.",
  },
  {
    concepto: "Tasa equivalente",
    formula: "i_t = (1 + i_d)^(t/d) − 1",
    nota: "Pasa una efectiva de d unidades a t unidades.",
  },
  {
    concepto: "Tasa efectiva continua",
    formula: "i = e^r − 1",
    nota: "r = nominal continua. Capitalización instantánea.",
  },
  {
    concepto: "Fisher (componentes)",
    formula: "(1 + i) = (1 + i_f)(1 + i_r)(1 + i_θ)",
    nota: "Nominal = inflación · real · riesgo. Real: 1+i_r = (1+i)/(1+i_f).",
  },
];

const U7_VALOR_TIEMPO: Row[] = [
  {
    concepto: "Valor futuro (compuesto)",
    formula: "F = P (1 + i)^n",
    nota: "Capitaliza P durante n períodos a la efectiva i.",
  },
  {
    concepto: "Valor presente",
    formula: "P = F / (1 + i)^n",
    nota: "Descuenta F al presente. Despeje de F.",
  },
  {
    concepto: "Despeje de tasa",
    formula: "i = (F/P)^(1/n) − 1",
    nota: "TIR de un flujo único P → F.",
  },
  {
    concepto: "Despeje de plazo",
    formula: "n = ln(F/P) / ln(1 + i)",
    nota: "Períodos necesarios para llegar de P a F.",
  },
  {
    concepto: "Interés simple",
    formula: "M = C (1 + i·n)",
    nota: "No capitaliza. VP simple: C = M / (1 + i·n).",
  },
  {
    concepto: "VA anualidad (vencida)",
    formula: "VA = C · [1 − (1 + i)^−n] / i",
    nota: "Factor a(n;i). Cuota constante al final de cada período.",
  },
  {
    concepto: "VF anualidad (vencida)",
    formula: "VF = C · [(1 + i)^n − 1] / i",
    nota: "Factor s(n;i). Capitalización de cuotas.",
  },
  {
    concepto: "Anualidad adelantada",
    formula: "VA_due = VA · (1 + i)",
    nota: "Cuota al inicio del período. Igual para VF_due.",
  },
  {
    concepto: "Perpetuidad",
    formula: "VP = C / i",
    nota: "Flujo constante infinito, vencido.",
  },
  {
    concepto: "Perpetuidad creciente (Gordon)",
    formula: "VP = C_1 / (i − g)",
    nota: "Exige i > g. C_1 = primer flujo (período 1).",
  },
  {
    concepto: "Perpetuidad diferida",
    formula: "VP = (C / i) / (1 + i)^t",
    nota: "Perpetuidad que arranca en t+1; se trae t períodos.",
  },
];

const U7_PRESTAMOS: Row[] = [
  {
    concepto: "Sistema francés (cuota)",
    formula: "C = P · i / [1 − (1 + i)^−n]",
    nota: "Cuota constante. Interés decrece, amortización crece.",
  },
  {
    concepto: "Saldo (francés)",
    formula: "Saldo_t = C · a(n−t; i)",
    nota: "VP de las cuotas que faltan. = saldo anterior − amort.",
  },
  {
    concepto: "Sistema alemán",
    formula: "A = P / n",
    nota: "Amortización constante. Cuota decrece. Interés = saldo·i.",
  },
  {
    concepto: "Sistema directo",
    formula: "C = (P + P·i·n) / n",
    nota: "Interés sobre el total, repartido. Encarece (CFT alto).",
  },
  {
    concepto: "Descuento comercial",
    formula: "VA = C (1 − d·n)",
    nota: "Descuento sobre el nominal C. d = tasa de descuento.",
  },
  {
    concepto: "Descuento → interés",
    formula: "i = d / (1 − d)",
    nota: "Tasa de interés equivalente a una tasa de descuento d.",
  },
  {
    concepto: "CFT (costo financiero total)",
    formula: "neto = Σ pago_t / (1 + CFT)^t",
    nota: "TIR de la operación con todos los costos y comisiones.",
  },
];

const U6_CONTABLE: Row[] = [
  {
    concepto: "Ecuación contable",
    formula: "A = P + PN",
    nota: "Activo = Pasivo + Patrimonio Neto.",
  },
  {
    concepto: "Amortización lineal",
    formula: "Am = (VO − VR) / VU",
    nota: "VO origen, VR residual, VU vida útil. Cuota anual constante.",
  },
  {
    concepto: "Valor libro",
    formula: "VL = VO − AA",
    nota: "AA = amortización acumulada = Am · años transcurridos.",
  },
  {
    concepto: "Cascada de resultados",
    formula: "EBITDA → EBIT → EBT → EAT",
    nota: "EBIT = EBITDA − Am; EBT = EBIT − int; EAT = EBT − IG.",
  },
  {
    concepto: "Capital de trabajo",
    formula: "KT = AC − PC",
    nota: "Activo corriente − Pasivo corriente.",
  },
  {
    concepto: "Fondo de maniobra / NOF",
    formula: "FM = PN + PNoC − ANoC ; NOF = AC_op − PC_op",
    nota: "FM financia las NOF; si FM < NOF hay necesidad de fondos.",
  },
  {
    concepto: "Liquidez corriente / ácida",
    formula: "LC = AC / PC ; PA = (AC − Bs.Cambio) / PC",
    nota: "Capacidad de pago de corto plazo. Ácida sin inventarios.",
  },
  {
    concepto: "PPC / PPP",
    formula: "PPC = CxC/Vtas·365 ; PPP = CxP/Compras·365",
    nota: "Plazo promedio de cobro y de pago en días.",
  },
  {
    concepto: "Cobertura de intereses",
    formula: "Cobertura = EBIT / Intereses",
    nota: "Veces que el resultado operativo cubre los intereses.",
  },
  {
    concepto: "ROE y DuPont",
    formula: "ROE = EAT/PN = Margen · Rotación · Apalancamiento",
    nota: "(EAT/Vtas)·(Vtas/A)·(A/PN). Descompone la rentabilidad.",
  },
  {
    concepto: "Punto de equilibrio",
    formula: "q* = CF / (p − cv)",
    nota: "p−cv = contribución marginal unitaria. V* = CF / razón contrib.",
  },
];

const U8_PROYECTOS: Row[] = [
  {
    concepto: "VAN",
    formula: "VAN = Σ FC_t / (1 + i)^t",
    nota: "i = TREMA. VAN > 0 ⇒ conviene. Incluye t=0 (inversión).",
  },
  {
    concepto: "TIR",
    formula: "0 = Σ FC_t / (1 + TIR)^t",
    nota: "Tasa que anula el VAN. Cuidado con flujos no convencionales.",
  },
  {
    concepto: "TER (rendimiento)",
    formula: "VF reinvertido = Inversión · (1 + TER)^n",
    nota: "Reinversión de flujos a la TREMA. Corrige supuestos de la TIR.",
  },
  {
    concepto: "Payback",
    formula: "t : Σ FC = 0 (simple o descontado)",
    nota: "Período de recupero. Descontado usa flujos a valor presente.",
  },
  {
    concepto: "Flujo de efectivo operativo",
    formula: "FEO = UN + Am = (V − C)(1 − t) + t·Am",
    nota: "UN = utilidad neta. Suma la amortización (no es egreso de caja).",
  },
  {
    concepto: "Escudo fiscal",
    formula: "Escudo = t · Am",
    nota: "Ahorro de IG por amortizar. t = tasa del impuesto.",
  },
  {
    concepto: "Flujo por venta de activo",
    formula: "FEE = VM − t·(VM − VL)",
    nota: "VM valor de mercado, VL valor libro. Paga IG sobre la ganancia.",
  },
  {
    concepto: "Costo anual equivalente",
    formula: "CAE = VAN / a(n; i)",
    nota: "Anualiza el VAN. Compara proyectos de distinta vida útil.",
  },
  {
    concepto: "Variación de capital de trabajo",
    formula: "ΔKT = KT_t − KT_(t−1)",
    nota: "Egreso al invertir en KT; se recupera al final del proyecto.",
  },
];

const SECCIONES: { eyebrow: string; titulo: string; rows: Row[] }[] = [
  { eyebrow: "Unidad 7", titulo: "Tasas", rows: U7_TASAS },
  { eyebrow: "Unidad 7", titulo: "Valor tiempo y anualidades", rows: U7_VALOR_TIEMPO },
  { eyebrow: "Unidad 7", titulo: "Préstamos y descuento", rows: U7_PRESTAMOS },
  { eyebrow: "Unidad 6", titulo: "Contable y costos", rows: U6_CONTABLE },
  { eyebrow: "Unidad 8", titulo: "Evaluación de proyectos", rows: U8_PROYECTOS },
];

const TRAMPAS: { titulo: string; detalle: string }[] = [
  {
    titulo: "Costo hundido afuera",
    detalle: "Lo ya gastado e irrecuperable NO entra al flujo del proyecto.",
  },
  {
    titulo: "Costo de oportunidad adentro",
    detalle: "Lo que se resigna por hacer el proyecto SÍ se computa como egreso.",
  },
  {
    titulo: "TNA → tasa efectiva primero",
    detalle: "Nunca descontar/capitalizar con una TNA: pasala a efectiva del período.",
  },
  {
    titulo: "Vida contable ≠ técnica",
    detalle: "La amortización va por vida útil contable; el flujo, por la vida real del activo.",
  },
  {
    titulo: "Venta de activo paga IG",
    detalle: "El impuesto es sobre (VM − VL), no sobre el valor de mercado total.",
  },
  {
    titulo: "Inversiones cuando se pagan",
    detalle: "El flujo de fondos registra el desembolso, no el devengamiento contable.",
  },
  {
    titulo: "Devengado vs. percibido",
    detalle: "El estado de resultados devenga; el flujo de caja percibe (cobros/pagos reales).",
  },
];

export default function FormularioTool() {
  return (
    <div className="vtool-panel">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Formulario de referencia · Parcial 2</span>
        <h3>Formulario completo (Unidades 6 · 7 · 8)</h3>
        <p>
          Todas las fórmulas que entran en el segundo parcial, agrupadas por
          unidad. Es la chuleta para repasar antes de entrar: tasas, valor tiempo,
          préstamos, análisis contable y evaluación de proyectos. Abajo, las{" "}
          <b>trampas clásicas</b> que cuestan puntos.
        </p>
      </div>

      {SECCIONES.map((sec) => (
        <div className="vtool-sub" key={sec.titulo}>
          <span className="vtool-eyebrow">
            {sec.eyebrow} · {sec.titulo}
          </span>
          <table className="vtool-table">
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Fórmula</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              {sec.rows.map((row) => (
                <tr key={row.concepto}>
                  <td>{row.concepto}</td>
                  <td>
                    <code className="vtool-mono">{row.formula}</code>
                  </td>
                  <td>{row.nota}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      <div className="vtool-sub">
        <span className="vtool-eyebrow">Trampas clásicas del Parcial 2</span>
        <table className="vtool-table">
          <thead>
            <tr>
              <th>Trampa</th>
              <th>Qué tener en cuenta</th>
            </tr>
          </thead>
          <tbody>
            {TRAMPAS.map((t) => (
              <tr key={t.titulo}>
                <td>
                  <b>{t.titulo}</b>
                </td>
                <td>{t.detalle}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Note>
        Orden mental del Parcial 2:{" "}
        <span className="vtool-mono">
          tasa efectiva → flujo de fondos (FEO + escudo + KT + venta de activos) →
          VAN/TIR/CAE
        </span>
        . Si la tasa o el flujo están mal, el VAN no sirve.
      </Note>
    </div>
  );
}
