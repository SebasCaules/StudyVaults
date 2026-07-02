// Características derivadas del programa analítico (ficha) + helpers de disponibilidad.
//
// La derivación es una heurística DETERMINISTA sobre el texto de `evaluacion`
// (secciones "Modalidad de evaluación" + "Requisitos de aprobación" del PDF oficial).
// Se computa en runtime desde FICHAS (no se persiste en fichas.ts) siguiendo el
// principio "raw + derivado separados": si mañana afinamos las reglas, se re-deriva
// sin volver a parsear los PDFs. Convención de honestidad: se marca un valor SOLO
// si la señal aparece explícita; `null`/`false` cuando no se detecta — nunca se
// infiere un dato ausente, y la UI siempre muestra el texto crudo de `evaluacion`.

import { FICHAS } from "./fichas";
import { byId } from "./model";
import type { CharFilters, Ficha, FichaDerivado } from "./types";

/** Normaliza a minúsculas sin acentos para matchear robusto. */
const norm = (s: string): string =>
  (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

/** Deriva las características de una ficha desde su texto de evaluación. */
export function derivarChars(ficha: Ficha): FichaDerivado {
  const t = norm(ficha.evaluacion);

  const tieneParcial = /\bparcial(es)?\b/.test(t);
  const tieneTP = /\btrabajos?\s+practicos?\b|\btp\b|\btpe\b/.test(t);
  const tieneFinal =
    /\bexamen(es)?\s+final(es)?\b/.test(t) ||
    /\bfinal(es)?\b\s*(escrito|oral|individual|integrador)/.test(t) ||
    /aprobar la materia[^.]{0,120}\bfinal\b/.test(t) ||
    /rendir[^.]{0,40}\bfinal\b/.test(t) ||
    /coloquio\s+final/.test(t);

  let promocionable: boolean | null = null;
  if (/\bpromoc\w*/.test(t)) promocionable = true;
  else if (tieneFinal) promocionable = false;
  else if (tieneParcial) promocionable = true; // parcial(es) sin final ⇒ heurística: promociona

  let asistenciaObligatoria: boolean | null = null;
  let asistenciaPct: number | null = null;
  if (/\b(asistencia|presentismo|inasistencia|asistir)\b/.test(t)) {
    if (
      /(asistencia|presentismo)[^.]{0,70}(obligatori|reglamento|minim|requisit|debe)/.test(
        t,
      ) ||
      /(obligatori|requisit|minim)[^.]{0,50}(asistencia|presentismo)/.test(t)
    ) {
      asistenciaObligatoria = true;
    }
    // Umbral de asistencia: el % debe calificar DIRECTAMENTE a la asistencia
    // ("75% de asistencia", "asistencia del 80%", "80% de las clases", "asistencia (70%").
    // Se evita capturar % de peso de nota que casualmente esté cerca de "asistencia".
    const pctBefore = t.match(
      /(\d{2,3})\s*%\s*(?:o\s+mas)?\s*(?:de\s+(?:las\s+)?)?(?:asistencia|presentismo|clases|de asistir)/,
    );
    const pctAfter = t.match(
      /(?:asistencia|presentismo|asistir)(?:\s+a\s+clases?)?\s*(?:\(|del?\s+|al\s+|de\s+al\s+menos\s+|mas\s+del?\s+|mayor\s+al?\s+|superior\s+al?\s+|minim\w*\s+(?:del?\s+)?)*(\d{2,3})\s*%/,
    );
    const pctMatch = pctBefore ?? pctAfter;
    if (pctMatch) {
      const n = Number(pctMatch[1]);
      if (Number.isFinite(n) && n >= 40 && n <= 100) {
        asistenciaPct = n;
        asistenciaObligatoria = true;
      }
    }
  }

  return {
    tieneParcial,
    tieneFinal,
    tieneTP,
    promocionable,
    asistenciaObligatoria,
    asistenciaPct,
  };
}

// memo por código (las fichas son estáticas)
const _cache = new Map<string, FichaDerivado>();

/** ¿La materia tiene programa analítico disponible? (false ⇒ "coming soon"). */
export function hasPrograma(codigo: string): boolean {
  return !!FICHAS[codigo];
}

/** Características derivadas de una materia por código, o null si no tiene ficha. */
export function charsOf(codigo: string): FichaDerivado | null {
  const ficha = FICHAS[codigo];
  if (!ficha) return null;
  let d = _cache.get(codigo);
  if (!d) {
    d = derivarChars(ficha);
    _cache.set(codigo, d);
  }
  return d;
}

/** Estado inicial de los filtros por características (sin filtrar). */
export const DEFAULT_CHAR_FILTERS: CharFilters = {
  regimen: "any",
  sinAsistenciaObligatoria: false,
  maxHsSemanales: null,
  soloConPrograma: false,
};

/** ¿Hay algún filtro activo? (para UI: mostrar "limpiar", contar, etc.). */
export function charFiltersActive(f: CharFilters): boolean {
  return (
    f.regimen !== "any" ||
    f.sinAsistenciaObligatoria ||
    f.maxHsSemanales != null ||
    f.soloConPrograma
  );
}

/** ¿La materia (por código) satisface los filtros de características?
 *  Regla honesta: si un filtro exige una característica del programa y la materia
 *  NO tiene programa (coming soon), sólo pasa cuando `soloConPrograma` está apagado
 *  y ese filtro no puede evaluarse — nunca se afirma algo que no se puede verificar. */
export function matchesChars(codigo: string, f: CharFilters): boolean {
  const d = charsOf(codigo);
  const m = byId.get(codigo);

  if (f.soloConPrograma && !d) return false;

  if (f.maxHsSemanales != null) {
    const hs = FICHAS[codigo]?.cargaHoraria.semanales;
    if (hs != null && hs > f.maxHsSemanales) return false;
  }

  if (f.regimen !== "any") {
    if (!d) {
      // sin programa no se puede afirmar el régimen; sólo pasa si no exigimos programa
      if (f.soloConPrograma) return false;
    } else if (f.regimen === "sin-final") {
      if (d.tieneFinal) return false;
    } else if (f.regimen === "promocionable") {
      if (d.promocionable !== true) return false;
    }
  }

  if (f.sinAsistenciaObligatoria && d && d.asistenciaObligatoria === true) {
    return false;
  }

  void m;
  return true;
}
