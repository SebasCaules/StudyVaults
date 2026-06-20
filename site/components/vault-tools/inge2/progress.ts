/* ──────────────────────────────────────────────────────────────────────────
   Inge2 study toolkit — progreso compartido (telemetría por unidad).

   Contrato de integración entre las herramientas de estudio y el dashboard
   ("Plan de recu"). Cada herramienta PUBLICA su contribución de dominio por
   unidad (`publishContribution`); el dashboard las LEE y mezcla
   (`loadContributions` / `unitMastery` / `overallReadiness`).

   Decoupling: el dashboard nunca conoce el formato interno de cada herramienta
   (cajas Leitner, historial de quiz, etc.). Sólo ve un número 0..1 por (tool,
   unidad). Cada herramienta es dueña de cómo calcula ese número.

   Static-export safe: todo acceso a window/localStorage va detrás de guards.
   ────────────────────────────────────────────────────────────────────────── */

import type { UnitId } from "./types";
import { UNIT_IDS } from "./types";

/** Herramientas que reportan dominio. */
export type Tool = "flashcards" | "quiz" | "mechanism" | "tradeoff" | "antipattern";

export const TOOLS: Tool[] = ["flashcards", "quiz", "mechanism", "tradeoff", "antipattern"];

/** Contribución de una herramienta a una unidad. */
export interface Contribution {
  /** Dominio estimado 0..1 para esa unidad según esta herramienta. */
  mastery: number;
  /** Ítems trabajados (cards repasadas, preguntas respondidas…). */
  seen: number;
  /** Ítems totales disponibles para esa unidad en esta herramienta. */
  total: number;
}

export type ContributionMap = Partial<Record<Tool, Partial<Record<UnitId, Contribution>>>>;

/** Prefijo de namespace — bump de versión invalida progreso viejo. */
const NS = "inge2.v1.";
const CONTRIB_KEY = `${NS}contrib`;
const PROGRESS_EVENT = "inge2:progress";

/* ───────────────────────── JSON storage genérico ───────────────────────── */

/** Carga JSON de localStorage; devuelve `fallback` si falla o no hay window. */
export function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return (parsed ?? fallback) as T;
  } catch {
    return fallback;
  }
}

/** Persiste JSON en localStorage (no-op fuera del browser). Emite progreso. */
export function saveJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage lleno o bloqueado — ignorar */
  }
}

/** Key namespaceada para el estado interno de una herramienta. */
export function toolKey(tool: Tool, suffix = "state"): string {
  return `${NS}${tool}.${suffix}`;
}

/* ───────────────────────── Contribuciones por unidad ────────────────────── */

/**
 * Publica la contribución completa de una herramienta (reemplaza la previa de
 * esa herramienta). Cada herramienta llama esto tras cualquier cambio, pasando
 * el mapa de TODAS las unidades que cubre.
 */
export function publishContribution(
  tool: Tool,
  byUnit: Partial<Record<UnitId, Contribution>>,
): void {
  if (typeof window === "undefined") return;
  const all = loadJSON<ContributionMap>(CONTRIB_KEY, {});
  all[tool] = byUnit;
  saveJSON(CONTRIB_KEY, all);
  emitProgress();
}

/** Lee todas las contribuciones publicadas. */
export function loadContributions(): ContributionMap {
  return loadJSON<ContributionMap>(CONTRIB_KEY, {});
}

/**
 * Dominio agregado de una unidad: promedio de las masteries de las
 * herramientas que tienen señal para esa unidad. Sin señal → 0 (honesto:
 * "todavía no lo trabajaste").
 */
export function unitMastery(unit: UnitId, contrib?: ContributionMap): number {
  const all = contrib ?? loadContributions();
  const vals: number[] = [];
  for (const tool of TOOLS) {
    const c = all[tool]?.[unit];
    if (c && c.seen > 0) vals.push(clamp01(c.mastery));
  }
  if (vals.length === 0) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

/** ¿La unidad tiene alguna señal (se la trabajó con alguna herramienta)? */
export function unitTouched(unit: UnitId, contrib?: ContributionMap): boolean {
  const all = contrib ?? loadContributions();
  return TOOLS.some((t) => (all[t]?.[unit]?.seen ?? 0) > 0);
}

/** Readiness global: promedio del dominio sobre TODAS las unidades del programa. */
export function overallReadiness(contrib?: ContributionMap): number {
  const all = contrib ?? loadContributions();
  const sum = UNIT_IDS.reduce((acc, u) => acc + unitMastery(u, all), 0);
  return UNIT_IDS.length ? sum / UNIT_IDS.length : 0;
}

/* ─────────────────────────── Pub/sub de progreso ────────────────────────── */

/** Notifica a los listeners (dashboard) que el progreso cambió. */
export function emitProgress(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
  } catch {
    /* entornos sin CustomEvent — ignorar */
  }
}

/**
 * Suscribe a cambios de progreso (mismo tab vía CustomEvent + otros tabs vía
 * `storage`). Devuelve un unsubscribe.
 */
export function onProgress(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const onStorage = (e: StorageEvent) => {
    if (!e.key || e.key.startsWith(NS)) cb();
  };
  window.addEventListener(PROGRESS_EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(PROGRESS_EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

/* ─────────────────────────────── Reset ─────────────────────────────────── */

/** Borra TODO el progreso del toolkit Inge2 (todas las herramientas). */
export function resetAllProgress(): void {
  if (typeof window === "undefined") return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(NS)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    /* ignorar */
  }
  emitProgress();
}

/* ──────────────────────────────── utils ────────────────────────────────── */

export function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
