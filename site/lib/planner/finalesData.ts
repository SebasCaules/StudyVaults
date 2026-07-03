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

import type { FinalPeriodo, MesaFinal } from "./types";

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
// 1. MESAS OFICIALES (EJEMPLO) — indexado por llamado → año → código → mesa.
//    Solo Julio 2026 tiene datos. Reemplazar por el calendario oficial real.
// ---------------------------------------------------------------------------
type MesasPorCodigo = Record<string, MesaFinal>;

const MESAS_OFICIALES: Partial<
  Record<FinalPeriodo, Record<number, MesasPorCodigo>>
> = {
  julio: {
    2026: {
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
    },
  },
};

/**
 * Mesa oficial de un final para un llamado/año, o `undefined` si no hay mesa
 * publicada (el final entra "sin fecha" hasta que el usuario la cargue a mano).
 */
export function mesaOficial(
  code: string,
  periodo: FinalPeriodo,
  anio: number,
): MesaFinal | undefined {
  return MESAS_OFICIALES[periodo]?.[anio]?.[code];
}

/** ¿El llamado tiene AL MENOS una mesa oficial cargada (datos de ejemplo)? */
export function llamadoTieneMesas(
  periodo: FinalPeriodo,
  anio: number,
): boolean {
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
