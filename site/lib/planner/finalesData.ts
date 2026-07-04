// ============================================================================
// DATOS DE EJEMPLO (MOCK) — Combinación de finales
// ----------------------------------------------------------------------------
// ⚠️  TODO ESTE MÓDULO ES DATA DE EJEMPLO, PENSADA PARA REEMPLAZAR.
//
// El repo NO trae datos oficiales de mesas de finales ni de correlativas de
// final: no existen en `data.json` (que solo modela cursada + correlativas de
// cursada). Para que el combinador de finales funcione hoy, acá van:
//   1. MESAS_OFICIALES  — fecha + hora de cada mesa, por llamado y año.
//   2. CORRELATIVAS_FINAL — qué finales hay que tener aprobados antes de rendir
//      otro (correlativa de FINAL, más estricta que la de cursada).
//
// Los valores están calcados del mockup `_design-review/module-f-combinador.html`
// y mapeados a los códigos reales del plan (ver `PLAN.obligatorias` en data.json).
// Solo el llamado de Julio 2026 tiene mesas cargadas — Diciembre y Febrero
// quedan vacíos a propósito (estado "mesas aún no publicadas"), igual que en el
// mock. Cuando tengas el calendario oficial de mesas y las correlativas de final
// de tu carrera, reemplazá las dos tablas de abajo (la vista y el .ics las leen
// por estas funciones, así que no hace falta tocar nada más).
// ============================================================================

import type { FinalLlamado, FinalPeriodo, MesaFinal } from "./types";
import type { FinalesBucket } from "./finales/parseFinales";

/** Etiqueta legible de cada llamado. */
export const PERIODO_LABEL: Record<FinalPeriodo, string> = {
  julio: "Julio",
  diciembre: "Diciembre",
  febrero: "Febrero",
};

/** Ordinal del llamado dentro del año lectivo (1.º · 2.º · 3.º). */
export const PERIODO_ORDINAL: Record<FinalPeriodo, string> = {
  julio: "1º",
  diciembre: "2º",
  febrero: "3º",
};

/** Orden cronológico de los llamados (para el segmentado). */
export const PERIODOS: FinalPeriodo[] = ["julio", "diciembre", "febrero"];

/**
 * Mes (1-12) y año calendario que le corresponden a un llamado.
 * Convención del calendario académico: el llamado de **Febrero** cae en el
 * verano SIGUIENTE al año lectivo — para el ciclo 2026, Febrero es 2027.
 * Julio y Diciembre caen dentro del mismo año lectivo.
 */
export function periodoMesAnio(
  periodo: FinalPeriodo,
  anio: number,
): { month: number; year: number } {
  switch (periodo) {
    case "julio":
      return { month: 7, year: anio };
    case "diciembre":
      return { month: 12, year: anio };
    case "febrero":
      return { month: 2, year: anio + 1 };
  }
}

/** Año calendario en que ocurre el llamado (útil para etiquetas y el .ics). */
export const periodoAnioReal = (periodo: FinalPeriodo, anio: number): number =>
  periodoMesAnio(periodo, anio).year;

// ---------------------------------------------------------------------------
// 1. MESAS OFICIALES (EJEMPLO) — período → año → llamado → código → mesa.
//    Solo Julio 2026 tiene datos. Reemplazar por el calendario oficial real.
//    El 2.º llamado del mock es el 1.º corrido una semana (patrón real de la
//    planilla oficial), para poder demostrar la elección 1º/2º sin cargar nada.
// ---------------------------------------------------------------------------
type MesasPorCodigo = Record<string, MesaFinal>;
type MesasPorLlamado = Partial<Record<FinalLlamado, MesasPorCodigo>>;

const MOCK_JULIO_1: MesasPorCodigo = {
  "93.58": { fecha: "2026-07-14", hora: "09:00" }, // Álgebra
  "72.31": { fecha: "2026-07-14", hora: "14:00" }, // Programación Imperativa
  "72.33": { fecha: "2026-07-15", hora: "18:00" }, // POO
  "93.26": { fecha: "2026-07-16", hora: "14:00" }, // Análisis Matemático I
  "93.28": { fecha: "2026-07-17", hora: "14:00" }, // Análisis Matemático II
  "93.41": { fecha: "2026-07-18", hora: "09:00" }, // Física I
  "93.42": { fecha: "2026-07-20", hora: "09:00" }, // Física II
  "93.24": { fecha: "2026-07-21", hora: "14:00" }, // Probabilidad y Estadística
  "72.37": { fecha: "2026-07-21", hora: "15:00" }, // Base de Datos I (se pisa con Proba)
  "72.34": { fecha: "2026-07-23", hora: "14:00" }, // Estructura de Datos y Algoritmos
};

/** 2.º llamado de ejemplo: misma hora, 7 días después. */
const MOCK_JULIO_2: MesasPorCodigo = Object.fromEntries(
  Object.entries(MOCK_JULIO_1).map(([code, m]) => {
    const [y, mo, d] = m.fecha.split("-").map(Number);
    const f = new Date(y, mo - 1, d + 7);
    const pad = (n: number) => String(n).padStart(2, "0");
    return [
      code,
      {
        fecha: `${f.getFullYear()}-${pad(f.getMonth() + 1)}-${pad(f.getDate())}`,
        hora: m.hora,
      },
    ];
  }),
);

const MESAS_OFICIALES: Partial<
  Record<FinalPeriodo, Record<number, MesasPorLlamado>>
> = {
  julio: {
    2026: { primer: MOCK_JULIO_1, segundo: MOCK_JULIO_2 },
  },
};

// ---------------------------------------------------------------------------
// 1b. MESAS CARGADAS EN RUNTIME (parser de la planilla oficial) — store reactivo
//     ---------------------------------------------------------------------
//     Cuando el usuario trae/sube la planilla real (ver lib/planner/finales/*
//     y components/planner/FinalesIngesta.tsx), las mesas parseadas se guardan
//     acá y REEMPLAZAN al MOCK de arriba para ese llamado/año. `mesaOficial` y
//     `llamadoTieneMesas` consultan primero este store; el mock queda como
//     fallback (útil para el llamado de muestra sin cargar nada).
//
//     Es un store de módulo (no vive en el estado del planner ni se persiste):
//     los datos oficiales se re-traen con un click. Para que la vista se
//     re-renderice al cargar, expone `subscribeMesasOficiales` +
//     `mesasOficialesVersion` (para `useSyncExternalStore`, SSR-safe).
// ---------------------------------------------------------------------------

/** Clave compuesta período|año|llamado|código dentro del store de runtime. */
const runtimeKey = (
  periodo: FinalPeriodo,
  anio: number,
  llamado: FinalLlamado,
  code: string,
) => `${periodo}|${anio}|${llamado}|${code}`;

let RUNTIME_MESAS: Map<string, MesaFinal> | null = null;
let mesasVersion = 0;
const mesasListeners = new Set<() => void>();

function emitMesas() {
  mesasVersion++;
  for (const l of mesasListeners) l();
}

/** Suscribe un listener a los cambios del store (para `useSyncExternalStore`). */
export function subscribeMesasOficiales(fn: () => void): () => void {
  mesasListeners.add(fn);
  return () => {
    mesasListeners.delete(fn);
  };
}

/** Snapshot barato: un contador que cambia en cada carga/limpieza. */
export function mesasOficialesVersion(): number {
  return mesasVersion;
}

/**
 * Carga (o reemplaza) las mesas oficiales de un período/año/llamado con datos
 * reales parseados de la planilla. Limpia primero las de ese mismo bloque, así
 * re-traer sobreescribe en vez de acumular.
 */
export function setMesasOficiales(
  periodo: FinalPeriodo,
  anio: number,
  llamado: FinalLlamado,
  entries: Iterable<readonly [string, MesaFinal]>,
): void {
  const next = new Map(RUNTIME_MESAS ?? []);
  const prefix = `${periodo}|${anio}|${llamado}|`;
  for (const k of [...next.keys()]) if (k.startsWith(prefix)) next.delete(k);
  for (const [code, mesa] of entries)
    next.set(runtimeKey(periodo, anio, llamado, code), mesa);
  RUNTIME_MESAS = next;
  emitMesas();
}

/**
 * Aplica de una vez todos los buckets de una ingesta (una planilla puede traer
 * varios períodos, p. ej. Diciembre+Febrero juntos). Limpia primero cada
 * período/año presente en los buckets (ambos llamados) y emite UN solo cambio.
 */
export function setMesasOficialesBulk(buckets: readonly FinalesBucket[]): void {
  const next = new Map(RUNTIME_MESAS ?? []);
  const prefijos = new Set(buckets.map((b) => `${b.periodo}|${b.anio}|`));
  for (const k of [...next.keys()])
    for (const p of prefijos)
      if (k.startsWith(p)) {
        next.delete(k);
        break;
      }
  for (const b of buckets)
    for (const [code, mesa] of b.entries)
      next.set(runtimeKey(b.periodo, b.anio, b.llamado, code), mesa);
  RUNTIME_MESAS = next.size ? next : null;
  emitMesas();
}

/**
 * Limpia el store. Sin argumentos borra todo; con llamado/año borra solo ese
 * bloque (volviendo al mock para ese llamado).
 */
export function clearMesasOficiales(periodo?: FinalPeriodo, anio?: number): void {
  if (!RUNTIME_MESAS) return;
  if (periodo === undefined || anio === undefined) {
    RUNTIME_MESAS = null;
    emitMesas();
    return;
  }
  const prefix = `${periodo}|${anio}|`;
  const next = new Map(RUNTIME_MESAS);
  for (const k of [...next.keys()]) if (k.startsWith(prefix)) next.delete(k);
  RUNTIME_MESAS = next.size ? next : null;
  emitMesas();
}

/** ¿Hay mesas cargadas en runtime para este llamado/año (datos reales)? */
export function hayMesasOficialesCargadas(
  periodo: FinalPeriodo,
  anio: number,
): boolean {
  if (!RUNTIME_MESAS) return false;
  const prefix = `${periodo}|${anio}|`;
  for (const k of RUNTIME_MESAS.keys()) if (k.startsWith(prefix)) return true;
  return false;
}

/**
 * Mesa oficial de un final para un período/año/llamado, o `undefined` si no
 * hay mesa publicada (el final entra "sin fecha" hasta que el usuario la
 * cargue a mano). Prioridad: mesas cargadas del parser (reales) → mock.
 * Ojo: si hay mesas REALES cargadas para el período/año, el mock no participa
 * (evita mezclar una planilla real sin 2.º llamado con segundos de ejemplo).
 */
export function mesaOficial(
  code: string,
  periodo: FinalPeriodo,
  anio: number,
  llamado: FinalLlamado,
): MesaFinal | undefined {
  if (hayMesasOficialesCargadas(periodo, anio)) {
    return RUNTIME_MESAS?.get(runtimeKey(periodo, anio, llamado, code));
  }
  return MESAS_OFICIALES[periodo]?.[anio]?.[llamado]?.[code];
}

/** Ambos llamados oficiales de un final para un período/año (si existen). */
export function mesasOficialesDe(
  code: string,
  periodo: FinalPeriodo,
  anio: number,
): { primer?: MesaFinal; segundo?: MesaFinal } {
  return {
    primer: mesaOficial(code, periodo, anio, "primer"),
    segundo: mesaOficial(code, periodo, anio, "segundo"),
  };
}

/** ¿El llamado tiene AL MENOS una mesa oficial (cargada del parser o de muestra)? */
export function llamadoTieneMesas(
  periodo: FinalPeriodo,
  anio: number,
): boolean {
  if (hayMesasOficialesCargadas(periodo, anio)) return true;
  const t = MESAS_OFICIALES[periodo]?.[anio];
  return !!t && Object.keys(t).length > 0;
}

// ---------------------------------------------------------------------------
// 2. CORRELATIVAS DE FINAL (EJEMPLO) — final → finales que hay que tener
//    aprobados ANTES de rendirlo. Es más estricta que la correlativa de
//    cursada: no alcanza con tener la cursada de la anterior, hace falta su
//    FINAL rendido. Derivadas de las correlativas de cursada de data.json,
//    quedándose con la/las prerrequisito(s) principal(es). Reemplazar por las
//    correlativas de final reales de tu plan.
// ---------------------------------------------------------------------------
export const CORRELATIVAS_FINAL: Record<string, string[]> = {
  "93.28": ["93.26"], // Análisis Mat. II  ← final de Análisis Mat. I
  "93.41": ["93.26"], // Física I          ← final de Análisis Mat. I
  "93.42": ["93.28", "93.41"], // Física II ← finales de Análisis II + Física I
  "93.24": ["93.28"], // Probabilidad      ← final de Análisis Mat. II
  "72.33": ["72.31"], // POO               ← final de Programación Imperativa
  "72.34": ["72.33"], // EDA               ← final de POO
  "72.37": ["72.34"], // Base de Datos I   ← final de EDA
  "72.08": ["72.31"], // Arq. de Computadoras ← final de Prog. Imperativa
  "72.11": ["72.08", "72.34"], // Sistemas Operativos ← AC + EDA
};

/** Correlativas de FINAL de un código (finales que deben estar aprobados). */
export function correlativasFinal(code: string): string[] {
  return CORRELATIVAS_FINAL[code] ?? [];
}

/**
 * ¿Está habilitado a rendir el final de `code`? Requiere que TODAS sus
 * correlativas de final estén en `finalDone`. Devuelve además cuáles faltan
 * (para el tooltip del candado).
 */
export function finalHabilitado(
  code: string,
  finalDone: Set<string>,
): { ok: boolean; faltan: string[] } {
  const faltan = correlativasFinal(code).filter((c) => !finalDone.has(c));
  return { ok: faltan.length === 0, faltan };
}
