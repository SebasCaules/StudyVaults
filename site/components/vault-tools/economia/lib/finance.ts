// Cálculo financiero, contable y de evaluación de proyectos para el toolkit de
// Economía (Parcial 2 — Unidades 6/7/8). Funciones puras, sin dependencias.
// Correctitud > velocidad: cada fórmula sigue el formulario de la cátedra
// (wiki/formulas/unidad-06..08) y está verificada contra los números de los
// parciales resueltos (P2 11-Nov-2025 con solución oficial).

/* ================================================================== */
/* Utilidades de parseo y formato                                      */
/* ================================================================== */

/** Convierte un string a número aceptando coma decimal. Devuelve fallback si vacío/ inválido. */
export function num(s: string, fallback = NaN): number {
  if (typeof s !== "string") return Number.isFinite(s as number) ? (s as number) : fallback;
  if (s.trim() === "") return fallback;
  const v = Number(s.replace(/\s/g, "").replace(",", "."));
  return Number.isFinite(v) ? v : fallback;
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}

/** Formato numérico general (dp decimales, recorta ceros, coma o punto según locale del runtime). */
export function fmt(x: number, dp = 2): string {
  if (!Number.isFinite(x)) return x > 0 ? "∞" : x < 0 ? "−∞" : "—";
  if (Number.isNaN(x)) return "—";
  if (Math.abs(x) < 1e-12) return "0";
  const r = Number(x.toFixed(dp));
  return Object.is(r, -0) ? "0" : String(r);
}

/** Formato de dinero con separador de miles (es-AR) y dp decimales. */
export function money(x: number, dp = 2): string {
  if (!Number.isFinite(x)) return "—";
  return x.toLocaleString("es-AR", {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  });
}

/** Formato de porcentaje: recibe una fracción (0,025) y devuelve "2,5%". */
export function pct(x: number, dp = 2): string {
  if (!Number.isFinite(x)) return "—";
  return `${money(x * 100, dp)}%`;
}

/* ================================================================== */
/* TASAS DE INTERÉS (Unidad 7)                                         */
/* ================================================================== */

/** Tasa proporcional / del subperíodo: i_p = TNA / k. */
export function tasaProporcional(tna: number, k: number): number {
  return tna / k;
}

/** TEA a partir de una TNA con k capitalizaciones por año: (1 + TNA/k)^k − 1. */
export function tnaToTea(tna: number, k: number): number {
  if (k <= 0) return NaN;
  return Math.pow(1 + tna / k, k) - 1;
}

/** TNA a partir de una TEA con k capitalizaciones: k·[(1+TEA)^(1/k) − 1]. */
export function teaToTna(tea: number, k: number): number {
  if (k <= 0) return NaN;
  return k * (Math.pow(1 + tea, 1 / k) - 1);
}

/**
 * Tasa efectiva de un subperíodo a partir de una TEA.
 * m = subperíodos por año (12 → mensual, 4 → trimestral, etc.).
 * i_sub = (1 + TEA)^(1/m) − 1.
 */
export function teaToEfectivaSubperiodo(tea: number, m: number): number {
  if (m <= 0) return NaN;
  return Math.pow(1 + tea, 1 / m) - 1;
}

/** TEA a partir de la tasa efectiva de un subperíodo: (1 + i_sub)^m − 1. */
export function efectivaSubperiodoToTea(iSub: number, m: number): number {
  return Math.pow(1 + iSub, m) - 1;
}

/**
 * Convierte una tasa efectiva de un período de `desde` unidades de tiempo a la
 * tasa efectiva de un período de `hasta` unidades (misma unidad base, p.ej. días).
 * i_hasta = (1 + i_desde)^(hasta/desde) − 1.   Fórmula de tasas equivalentes.
 */
export function tasaEquivalente(iDesde: number, desde: number, hasta: number): number {
  if (desde <= 0) return NaN;
  return Math.pow(1 + iDesde, hasta / desde) - 1;
}

/**
 * TNA con capitalización diaria → TEM, formato parcial (año 360, mes 30):
 * TEM = (1 + TNA/diasAnio)^diasMes − 1.
 * Ej. (P2 2025): TNA 35% → TEM = (1+0.35/360)^30 − 1 = 0,029582.
 */
export function tnaDiariaToTem(tna: number, diasAnio = 360, diasMes = 30): number {
  return Math.pow(1 + tna / diasAnio, diasMes) - 1;
}

/** TEA con capitalización continua: e^r − 1. */
export function teaContinua(r: number): number {
  return Math.exp(r) - 1;
}

/** Monto con capitalización continua: F = P·e^(r·n). */
export function montoContinuo(P: number, r: number, n: number): number {
  return P * Math.exp(r * n);
}

/**
 * Descompone/recompone la tasa nominal por componentes (Fisher exacto multiplicativo):
 * i = (1+i_f)(1+i_r)(1+i_θ) − 1.
 */
export function tasaPorComponentes(inflacion: number, real: number, riesgo: number): number {
  return (1 + inflacion) * (1 + real) * (1 + riesgo) - 1;
}

/** Tasa real (Fisher): (1+i)/(1+π) − 1. */
export function tasaReal(nominal: number, inflacion: number): number {
  return (1 + nominal) / (1 + inflacion) - 1;
}

/* ================================================================== */
/* VALOR TIEMPO DEL DINERO — capital único (Unidad 7)                  */
/* ================================================================== */

/** Valor futuro (interés compuesto): F = P(1+i)^n. */
export function valorFuturo(P: number, i: number, n: number): number {
  return P * Math.pow(1 + i, n);
}

/** Valor presente (interés compuesto): P = F/(1+i)^n. */
export function valorPresente(F: number, i: number, n: number): number {
  return F / Math.pow(1 + i, n);
}

/** Despeje de tasa: i = (F/P)^(1/n) − 1. */
export function despejeTasa(P: number, F: number, n: number): number {
  if (P === 0 || n === 0) return NaN;
  return Math.pow(F / P, 1 / n) - 1;
}

/** Despeje de plazo: n = ln(F/P)/ln(1+i). */
export function despejePlazo(P: number, F: number, i: number): number {
  if (P <= 0 || F <= 0 || i <= -1) return NaN;
  return Math.log(F / P) / Math.log(1 + i);
}

/** Monto con interés simple: M = C(1 + i·n). */
export function montoSimple(C: number, i: number, n: number): number {
  return C * (1 + i * n);
}

/** Valor presente con interés simple: P = M/(1 + i·n). */
export function valorPresenteSimple(M: number, i: number, n: number): number {
  return M / (1 + i * n);
}

/* ================================================================== */
/* ANUALIDADES Y PERPETUIDADES (Unidad 7)                             */
/* ================================================================== */

/**
 * Factor de actualización de la anualidad (vencida): a(n;i) = [1−(1+i)^−n]/i.
 * Es el VP de $1 por período pagadero al final. La cátedra lo llama "FACTOR".
 * Ej.: a(12; 2,958%) = 9,9789 ; a(10;10%) = 6,144567 ; a(15;10%) = 7,606080.
 */
export function factorAnualidad(n: number, i: number): number {
  if (i === 0) return n;
  return (1 - Math.pow(1 + i, -n)) / i;
}

/** Factor de capitalización de la anualidad (vencida): s(n;i) = [(1+i)^n − 1]/i. */
export function factorCapitalizacion(n: number, i: number): number {
  if (i === 0) return n;
  return (Math.pow(1 + i, n) - 1) / i;
}

/** Valor actual de una anualidad. due=true → adelantada (×(1+i)). */
export function vpAnualidad(C: number, n: number, i: number, due = false): number {
  const base = C * factorAnualidad(n, i);
  return due ? base * (1 + i) : base;
}

/** Valor futuro de una anualidad. due=true → adelantada (×(1+i)). */
export function vfAnualidad(C: number, n: number, i: number, due = false): number {
  const base = C * factorCapitalizacion(n, i);
  return due ? base * (1 + i) : base;
}

/** Cuota de una anualidad a partir del valor actual: C = VA / a(n;i). due ajusta. */
export function cuotaDesdeVA(VA: number, n: number, i: number, due = false): number {
  const f = factorAnualidad(n, i);
  if (f === 0) return NaN;
  return due ? VA / (f * (1 + i)) : VA / f;
}

/** Cuota de una anualidad a partir del valor futuro: C = VF / s(n;i). */
export function cuotaDesdeVF(VF: number, n: number, i: number, due = false): number {
  const f = factorCapitalizacion(n, i);
  if (f === 0) return NaN;
  return due ? VF / (f * (1 + i)) : VF / f;
}

/** Perpetuidad constante: VA = C/i (valor un período antes del primer flujo). */
export function vpPerpetuidad(C: number, i: number): number {
  if (i === 0) return Infinity;
  return C / i;
}

/** Perpetuidad creciente (Gordon): VA = C1/(i−g), con i>g. */
export function vpPerpetuidadCreciente(C1: number, i: number, g: number): number {
  if (i <= g) return Infinity;
  return C1 / (i - g);
}

/** Perpetuidad diferida (primer pago en t+1): VA0 = (C/i)/(1+i)^t. */
export function vpPerpetuidadDiferida(C: number, i: number, t: number): number {
  return vpPerpetuidad(C, i) / Math.pow(1 + i, t);
}

/* ================================================================== */
/* FLUJOS — VAN, TIR, TER, PAYBACK (Unidad 8)                          */
/* ================================================================== */

/** VAN de un flujo (flows[0] es t=0). VAN = Σ FC_t/(1+r)^t. */
export function van(rate: number, flows: number[]): number {
  let acc = 0;
  for (let t = 0; t < flows.length; t++) acc += flows[t] / Math.pow(1 + rate, t);
  return acc;
}

/** Alias en inglés por conveniencia. */
export const npv = van;

/**
 * TIR por bisección robusta con barrido de signo en [−0,99 ; 10].
 * Devuelve la primera raíz y si hay múltiples cambios de signo del VAN.
 */
export function tir(flows: number[]): { rate: number | null; multiple: boolean } {
  const f = (r: number) => van(r, flows);
  const lo0 = -0.99;
  const hi0 = 10;
  const steps = 600;
  const brackets: [number, number][] = [];
  let prevR = lo0;
  let prevV = f(lo0);
  for (let i = 1; i <= steps; i++) {
    const r = lo0 + ((hi0 - lo0) * i) / steps;
    const v = f(r);
    if (Number.isFinite(prevV) && Number.isFinite(v) && prevV * v <= 0 && prevV !== 0) {
      brackets.push([prevR, r]);
    }
    prevR = r;
    prevV = v;
  }
  if (brackets.length === 0) return { rate: null, multiple: false };

  const solve = ([lo, hi]: [number, number]): number => {
    let flo = f(lo);
    let a = lo;
    let b = hi;
    for (let i = 0; i < 200; i++) {
      const mid = (a + b) / 2;
      const fm = f(mid);
      if (Math.abs(fm) < 1e-10 || (b - a) / 2 < 1e-12) return mid;
      if (flo * fm < 0) b = mid;
      else {
        a = mid;
        flo = fm;
      }
    }
    return (a + b) / 2;
  };

  return { rate: solve(brackets[0]), multiple: brackets.length > 1 };
}

/**
 * TER / TIR modificada: (1+TER)^n = VF(ingresos a la TREMA) / VP(egresos a la TREMA).
 * n = horizonte (flows.length − 1). Devuelve null si no hay ingresos o egresos.
 */
export function ter(flows: number[], trema: number): number | null {
  const n = flows.length - 1;
  if (n <= 0) return null;
  let vfIngresos = 0;
  let vpEgresos = 0;
  for (let t = 0; t < flows.length; t++) {
    if (flows[t] > 0) vfIngresos += flows[t] * Math.pow(1 + trema, n - t);
    else if (flows[t] < 0) vpEgresos += -flows[t] / Math.pow(1 + trema, t);
  }
  if (vpEgresos <= 0 || vfIngresos <= 0) return null;
  return Math.pow(vfIngresos / vpEgresos, 1 / n) - 1;
}

/** Período de recupero simple (acumulado sin descontar, con interpolación lineal). */
export function paybackSimple(flows: number[]): number | null {
  let cum = 0;
  for (let t = 0; t < flows.length; t++) {
    const prev = cum;
    cum += flows[t];
    if (prev < 0 && cum >= 0 && t > 0) return t - 1 + (0 - prev) / (cum - prev);
  }
  return null;
}

/** Período de recupero descontado (acumulado de flujos descontados, con interpolación). */
export function paybackDescontado(flows: number[], rate: number): number | null {
  let cum = 0;
  for (let t = 0; t < flows.length; t++) {
    const disc = flows[t] / Math.pow(1 + rate, t);
    const prev = cum;
    cum += disc;
    if (prev < 0 && cum >= 0 && t > 0) return t - 1 + (0 - prev) / (cum - prev);
  }
  return null;
}

/** Máxima exposición: saldo acumulado (sin descontar) más negativo del proyecto. */
export function maximaExposicion(flows: number[]): number {
  let cum = 0;
  let min = 0;
  for (const f of flows) {
    cum += f;
    if (cum < min) min = cum;
  }
  return min;
}

/** Índice de rentabilidad: VP(flujos futuros, t≥1) / |inversión inicial|. IR>1 ⇔ VAN>0. */
export function indiceRentabilidad(flows: number[], rate: number): number {
  const I = -flows[0];
  if (I <= 0) return NaN;
  let vpFuturos = 0;
  for (let t = 1; t < flows.length; t++) vpFuturos += flows[t] / Math.pow(1 + rate, t);
  return vpFuturos / I;
}

/** Filas de descuento de un flujo: factor, descontado y acumulados (simple y descontado). */
export interface FilaDescuento {
  t: number;
  flujo: number;
  factor: number;
  descontado: number;
  acumSimple: number;
  acumDescontado: number;
}

export function filasDescuento(flows: number[], rate: number): FilaDescuento[] {
  let cum = 0;
  let cumD = 0;
  return flows.map((flujo, t) => {
    const factor = 1 / Math.pow(1 + rate, t);
    const descontado = flujo * factor;
    cum += flujo;
    cumD += descontado;
    return { t, flujo, factor, descontado, acumSimple: cum, acumDescontado: cumD };
  });
}

/* ================================================================== */
/* SISTEMAS DE AMORTIZACIÓN DE PRÉSTAMOS (Unidad 7)                    */
/* ================================================================== */

export interface CuotaPrestamo {
  t: number;
  cuota: number;
  interes: number;
  amortizacion: number;
  saldo: number;
}

export interface TablaPrestamo {
  cuotaInicial: number;
  totalPagado: number;
  totalInteres: number;
  rows: CuotaPrestamo[];
}

/** Sistema francés: cuota constante C = P·i / [1−(1+i)^−n]. */
export function prestamoFrances(P: number, n: number, i: number): TablaPrestamo {
  const cuota = i === 0 ? P / n : (P * i) / (1 - Math.pow(1 + i, -n));
  const rows: CuotaPrestamo[] = [];
  let saldo = P;
  let totalPagado = 0;
  let totalInteres = 0;
  for (let t = 1; t <= n; t++) {
    const interes = saldo * i;
    let amortizacion = cuota - interes;
    saldo -= amortizacion;
    if (t === n) {
      // ajuste por redondeo: cancelar el saldo remanente
      amortizacion += saldo;
      saldo = 0;
    }
    totalPagado += cuota;
    totalInteres += interes;
    rows.push({ t, cuota, interes, amortizacion, saldo: Math.abs(saldo) < 1e-7 ? 0 : saldo });
  }
  return { cuotaInicial: cuota, totalPagado, totalInteres, rows };
}

/** Sistema alemán: amortización constante A = P/n; cuota decreciente. */
export function prestamoAleman(P: number, n: number, i: number): TablaPrestamo {
  const A = P / n;
  const rows: CuotaPrestamo[] = [];
  let saldo = P;
  let totalPagado = 0;
  let totalInteres = 0;
  let cuotaInicial = 0;
  for (let t = 1; t <= n; t++) {
    const interes = saldo * i;
    const cuota = A + interes;
    if (t === 1) cuotaInicial = cuota;
    saldo -= A;
    totalPagado += cuota;
    totalInteres += interes;
    rows.push({
      t,
      cuota,
      interes,
      amortizacion: A,
      saldo: Math.abs(saldo) < 1e-7 ? 0 : saldo,
    });
  }
  return { cuotaInicial, totalPagado, totalInteres, rows };
}

/** Sistema directo/americano de interés sobre capital inicial: C = P/n + P·i (constante). */
export function prestamoDirecto(P: number, n: number, i: number): TablaPrestamo {
  const amort = P / n;
  const interes = P * i;
  const cuota = amort + interes;
  const rows: CuotaPrestamo[] = [];
  let saldo = P;
  for (let t = 1; t <= n; t++) {
    saldo -= amort;
    rows.push({
      t,
      cuota,
      interes,
      amortizacion: amort,
      saldo: Math.abs(saldo) < 1e-7 ? 0 : saldo,
    });
  }
  return {
    cuotaInicial: cuota,
    totalPagado: cuota * n,
    totalInteres: interes * n,
    rows,
  };
}

/** Saldo de un préstamo francés tras pagar t cuotas = VP de las (n−t) cuotas restantes. */
export function saldoFrances(cuota: number, i: number, restantes: number): number {
  return cuota * factorAnualidad(restantes, i);
}

/* ================================================================== */
/* DESCUENTO COMERCIAL Y CFT (Unidad 7)                                */
/* ================================================================== */

/** Valor actual por descuento comercial: VA = C(1 − d·n). */
export function descuentoComercialVA(C: number, d: number, n: number): number {
  return C * (1 - d * n);
}

/** Descuento comercial en $: DC = C·d·n. */
export function descuentoComercial(C: number, d: number, n: number): number {
  return C * d * n;
}

/** Tasa de interés equivalente a una tasa de descuento (un período): i = d/(1−d). */
export function descuentoAInteres(d: number): number {
  if (d >= 1) return Infinity;
  return d / (1 - d);
}

/**
 * Costo Financiero Total: TIR de la financiación, igualando el neto recibido con el
 * VP de los pagos. flows[0] = +neto recibido; flows[t>0] = −pagos. Usa la TIR.
 */
export function cft(neto: number, pagos: number[]): number | null {
  return tir([neto, ...pagos.map((p) => -Math.abs(p))]).rate;
}

/* ================================================================== */
/* INFORMACIÓN CONTABLE Y COSTOS (Unidad 6)                            */
/* ================================================================== */

/** Amortización lineal del ejercicio: Am = (VO − VR)/VU. */
export function amortizacionLineal(VO: number, VR: number, VU: number): number {
  if (VU <= 0) return NaN;
  return (VO - VR) / VU;
}

/** Valor de libro: VL = VO − amortizaciones acumuladas. */
export function valorLibro(VO: number, amAnual: number, aniosTranscurridos: number): number {
  return VO - amAnual * aniosTranscurridos;
}

/** Contribución marginal unitaria: cm = p − cv. */
export function contribucionMarginal(p: number, cv: number): number {
  return p - cv;
}

/** Razón de contribución: (p − cv)/p. */
export function razonContribucion(p: number, cv: number): number {
  if (p === 0) return NaN;
  return (p - cv) / p;
}

/** Cantidad de equilibrio: q* = CF/(p − cv). */
export function puntoEquilibrioQ(CF: number, p: number, cv: number): number {
  const cm = p - cv;
  if (cm <= 0) return Infinity;
  return CF / cm;
}

/** Ventas de equilibrio en $: V* = CF/[(p−cv)/p] = q*·p. */
export function puntoEquilibrioV(CF: number, p: number, cv: number): number {
  const rc = razonContribucion(p, cv);
  if (rc <= 0) return Infinity;
  return CF / rc;
}

/** Beneficio a un volumen q: π = (p−cv)·q − CF. */
export function beneficio(p: number, cv: number, q: number, CF: number): number {
  return (p - cv) * q - CF;
}

/* ----- Cascada del estado de resultados (esquema financiero, U6) ----- */

export interface CascadaResultados {
  ventas: number;
  costosErogables: number;
  ebitda: number;
  amortizaciones: number;
  ebit: number;
  intereses: number;
  ebt: number;
  ig: number;
  eat: number;
}

export function cascadaResultados(
  ventas: number,
  costosErogables: number,
  amortizaciones: number,
  intereses: number,
  tasaIG: number,
): CascadaResultados {
  const ebitda = ventas - costosErogables;
  const ebit = ebitda - amortizaciones;
  const ebt = ebit - intereses;
  const ig = ebt > 0 ? ebt * tasaIG : 0;
  const eat = ebt - ig;
  return { ventas, costosErogables, ebitda, amortizaciones, ebit, intereses, ebt, ig, eat };
}

/* ================================================================== */
/* EVALUACIÓN DE PROYECTOS — FEO / FEE / ESCUDO (Unidad 8)             */
/* ================================================================== */

/**
 * Flujo de efectivo operativo. Tres formas equivalentes; usamos la del escudo:
 * FEO = (V − C)(1−t) + t·Am = EBIT(1−t) + Am = UN + Am.
 */
export function feo(ventas: number, costos: number, amortizacion: number, t: number): number {
  return (ventas - costos) * (1 - t) + t * amortizacion;
}

/** Utilidad neta del proyecto: UN = (V − C − Am)(1 − t)  [si UAII>0]. */
export function utilidadNeta(ventas: number, costos: number, amortizacion: number, t: number): number {
  const uaii = ventas - costos - amortizacion;
  const ig = uaii > 0 ? uaii * t : 0;
  return uaii - ig;
}

/** Escudo fiscal de la amortización: t·Am. */
export function escudoFiscal(amortizacion: number, t: number): number {
  return t * amortizacion;
}

/** VP del escudo fiscal (amortización lineal por n_am años a tasa i): t·Am·a(n_am;i). */
export function vpEscudoFiscal(amortizacion: number, t: number, nAm: number, i: number): number {
  return t * amortizacion * factorAnualidad(nAm, i);
}

/**
 * Flujo terminal por venta de un activo fijo (con impuesto a la utilidad contable):
 * FF = VM − t·(VM − VL).  Vale tanto para ganancia (VM>VL) como pérdida (VM<VL).
 */
export function feeVentaActivo(VM: number, VL: number, t: number): number {
  return VM - t * (VM - VL);
}

/** Efecto del capital de trabajo sobre el FF del período: −ΔKT = −(KT_t − KT_{t−1}). */
export function efectoCapitalTrabajo(ktActual: number, ktAnterior: number): number {
  return -(ktActual - ktAnterior);
}

/* ----- Valor anual equivalente y cadena de reemplazo (U8) ----- */

/** Valor anual equivalente (CAE si son costos): VA = VAN / a(n;i). */
export function valorAnualEquivalente(vanProyecto: number, n: number, i: number): number {
  const f = factorAnualidad(n, i);
  if (f === 0) return NaN;
  return vanProyecto / f;
}

/**
 * VAN de repetir un proyecto corto (vida `vidaCorta`, VAN `vanCorto`) hasta cubrir
 * un horizonte común `horizonte` (debe ser múltiplo de vidaCorta), a tasa i.
 * Suma los VAN de cada ciclo desplazados: Σ VAN_corto/(1+i)^(k·vidaCorta).
 */
export function vanCadenaReemplazo(
  vanCorto: number,
  vidaCorta: number,
  horizonte: number,
  i: number,
): number {
  const ciclos = Math.round(horizonte / vidaCorta);
  let acc = 0;
  for (let k = 0; k < ciclos; k++) acc += vanCorto / Math.pow(1 + i, k * vidaCorta);
  return acc;
}
