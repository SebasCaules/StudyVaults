// Persistencia en localStorage. MISMAS claves heredadas del planner standalone
// para no perder estado de usuarios actuales, + claves nuevas para los inputs
// del combinador y del plan (preferencias, comisiones fijadas). Solo cliente.
// (sv-theme lo maneja el portal, no el planner.)
import type {
  ComboParams,
  FinalAsignacion,
  FinalesState,
  FinalPeriodo,
  MesaFinal,
  OptMethod,
  PlannerState,
  PlanStart,
} from "./types";

const K = {
  approved: "plan_aprobadas_v3",
  finalDone: "plan_finales_v1",
  combo: "plan_combo_v3",
  pool: "plan_pool_v3",
  fixed: "plan_fixed_v3",
  locked: "plan_locked_v1",
  lockPins: "plan_lock_pins_v1",
  sidebar: "plan_sidebar",
  comboParams: "plan_combo_params_v1",
  fixedCom: "plan_fixed_com_v1",
  planOpts: "plan_opts_v1",
  finalesCombo: "plan_finales_combo_v1",
  introDismissed: "plan_intro_dismissed_v1",
} as const;

export interface PlanOpts {
  start: PlanStart;
  maxCred: number;
  maxMat: number;
  avoid: boolean;
  method?: OptMethod;
  capCredByIdx?: [number, number][];
  capMatByIdx?: [number, number][];
}

/** Forma serializable de `FinalesState` (Maps → arrays de pares). */
export interface PersistedFinales {
  periodo: FinalPeriodo;
  anio: number;
  mesas: [string, MesaFinal][];
  /** asignación por materia. El formato viejo era `string[]` (solo códigos):
   *  `parseFinales` lo migra a pares con el período persistido y 1.º llamado. */
  seleccion: [string, FinalAsignacion][];
  reminderHs: number;
  margenDias: number;
}

export interface Persisted {
  approved: string[] | null;
  finalDone: string[] | null;
  combo: string[] | null;
  pool: string[] | null;
  fixed: [string, number][] | null;
  lockedIdx: number[] | null;
  /** registro índice→códigos pineados por cada lock (ver PlanState.lockPins). */
  lockPins: [number, string[]][] | null;
  comboParams: ComboParams | null;
  fixedCom: [string, string][] | null;
  planOpts: PlanOpts | null;
  finales: PersistedFinales | null;
  sideCollapsed: boolean;
  /** banner de primer uso cerrado (flag simple, como sideCollapsed). */
  introDismissed: boolean;
}

function read<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function loadPersisted(): Persisted {
  const rawLockPins = read<unknown>(K.lockPins);
  return {
    approved: read<string[]>(K.approved),
    finalDone: read<string[]>(K.finalDone),
    combo: read<string[]>(K.combo),
    pool: read<string[]>(K.pool),
    fixed: read<[string, number][]>(K.fixed),
    lockedIdx: read<number[]>(K.locked),
    lockPins: isLockPinsArr(rawLockPins) ? rawLockPins : null,
    comboParams: read<ComboParams>(K.comboParams),
    fixedCom: read<[string, string][]>(K.fixedCom),
    planOpts: read<PlanOpts>(K.planOpts),
    // mismo validador que el import de archivo: un JSON corrupto en
    // localStorage (p. ej. `mesas` no-iterable) cae a default en vez de
    // reventar el `new Map(...)` del reducer.
    finales: parseFinales(read<unknown>(K.finalesCombo)),
    sideCollapsed: ((): boolean => {
      try {
        return localStorage.getItem(K.sidebar) === "1";
      } catch {
        return false;
      }
    })(),
    introDismissed: ((): boolean => {
      try {
        return localStorage.getItem(K.introDismissed) === "1";
      } catch {
        return false;
      }
    })(),
  };
}

const write = (key: string, val: unknown) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    /* almacenamiento no disponible */
  }
};

export const saveApproved = (s: Set<string>) => write(K.approved, [...s]);
export const saveFinalDone = (s: Set<string>) => write(K.finalDone, [...s]);
export const saveCombo = (s: Set<string>) => write(K.combo, [...s]);
export const savePlanPool = (pool: Set<string>, fixed: Map<string, number>) => {
  write(K.pool, [...pool]);
  write(K.fixed, [...fixed]);
};
export const saveLocked = (s: Set<number>) => write(K.locked, [...s]);
export const saveLockPins = (m: Map<number, string[]>) =>
  write(K.lockPins, [...m]);

/** Serializa `FinalesState` (Map/Set) a su forma persistible (arrays). */
export const serializeFinales = (f: FinalesState): PersistedFinales => ({
  periodo: f.periodo,
  anio: f.anio,
  mesas: [...f.mesas],
  seleccion: [...f.seleccion],
  reminderHs: f.reminderHs,
  margenDias: f.margenDias,
});
export const saveFinalesCombo = (f: FinalesState) =>
  write(K.finalesCombo, serializeFinales(f));
export const saveComboParams = (p: ComboParams) => write(K.comboParams, p);
export const saveFixedCom = (m: Map<string, string>) =>
  write(K.fixedCom, [...m]);
export const savePlanOpts = (o: PlanOpts) => write(K.planOpts, o);
export const saveSidebar = (collapsed: boolean) => {
  try {
    localStorage.setItem(K.sidebar, collapsed ? "1" : "0");
  } catch {
    /* noop */
  }
};
export const saveIntroDismissed = (dismissed: boolean) => {
  try {
    localStorage.setItem(K.introDismissed, dismissed ? "1" : "0");
  } catch {
    /* noop */
  }
};

/* =========================================================================
   EXPORT / IMPORT de preferencias (archivo .json portable)
   Un único bundle autocontenido con TODO el estado persistible del planner,
   para descargar y volver a cargar el mismo template más adelante (o en otro
   navegador). El shape mapea 1:1 a `Persisted` → se reimporta vía HYDRATE.
   ========================================================================= */

export const PREF_VERSION = 1;
const PREF_APP = "studyvaults-planner";

/** Bundle serializable de preferencias del planner. */
export interface PreferenceBundle {
  app: typeof PREF_APP;
  v: number;
  exported?: string; // fecha legible, informativa
  approved: string[];
  finalDone: string[];
  combo: string[];
  pool: string[];
  fixed: [string, number][];
  lockedIdx: number[];
  lockPins: [number, string[]][];
  fixedCom: [string, string][];
  comboParams: ComboParams;
  planOpts: PlanOpts;
  finales: PersistedFinales;
  sideCollapsed: boolean;
}

/** Arma el bundle exportable a partir del estado vivo del planner. */
export function buildPreferenceBundle(
  state: PlannerState,
  exported?: string,
): PreferenceBundle {
  return {
    app: PREF_APP,
    v: PREF_VERSION,
    exported,
    approved: [...state.approved],
    finalDone: [...state.finalDone],
    combo: [...state.combo],
    pool: [...state.plan.pool],
    fixed: [...state.plan.fixed],
    lockedIdx: [...state.plan.lockedIdx],
    lockPins: [...state.plan.lockPins],
    fixedCom: [...state.fixedCom],
    comboParams: state.comboParams,
    planOpts: {
      start: state.plan.start,
      maxCred: state.plan.maxCred,
      maxMat: state.plan.maxMat,
      avoid: state.plan.avoid,
      method: state.plan.method,
      capCredByIdx: [...state.plan.capCredByIdx],
      capMatByIdx: [...state.plan.capMatByIdx],
    },
    finales: serializeFinales(state.finales),
    sideCollapsed: state.sideCollapsed,
  };
}

/** Serializa el bundle a texto JSON legible (para descargar como archivo). */
export const serializePreferences = (
  state: PlannerState,
  exported?: string,
): string => JSON.stringify(buildPreferenceBundle(state, exported), null, 2);

const isStrArr = (x: unknown): x is string[] =>
  Array.isArray(x) && x.every((v) => typeof v === "string");
const isPairArr = <B>(x: unknown, second: (v: unknown) => v is B): x is [string, B][] =>
  Array.isArray(x) &&
  x.every(
    (p) => Array.isArray(p) && p.length === 2 && typeof p[0] === "string" && second(p[1]),
  );
const isNum = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isStr = (v: unknown): v is string => typeof v === "string";
const isNumPairArr = (x: unknown): x is [number, number][] =>
  Array.isArray(x) &&
  x.every((p) => Array.isArray(p) && p.length === 2 && isNum(p[0]) && isNum(p[1]));
const isNumArr = (x: unknown): x is number[] =>
  Array.isArray(x) && x.every(isNum);
const isLockPinsArr = (x: unknown): x is [number, string[]][] =>
  Array.isArray(x) &&
  x.every(
    (p) => Array.isArray(p) && p.length === 2 && isNum(p[0]) && isStrArr(p[1]),
  );

const isMesa = (v: unknown): v is MesaFinal =>
  !!v &&
  typeof v === "object" &&
  isStr((v as Record<string, unknown>).fecha) &&
  isStr((v as Record<string, unknown>).hora);

const isPeriodo = (v: unknown): v is FinalPeriodo =>
  v === "julio" || v === "diciembre" || v === "febrero";

const isAsignacion = (v: unknown): v is FinalAsignacion =>
  !!v &&
  typeof v === "object" &&
  isPeriodo((v as Record<string, unknown>).periodo) &&
  ((v as Record<string, unknown>).llamado === "primer" ||
    (v as Record<string, unknown>).llamado === "segundo");

/** Parsea el bloque de finales de un bundle; tolerante (campos inválidos → default). */
function parseFinales(x: unknown): PersistedFinales | null {
  if (!x || typeof x !== "object") return null;
  const f = x as Record<string, unknown>;
  const periodo: FinalPeriodo = isPeriodo(f.periodo) ? f.periodo : "julio";
  const mesas =
    Array.isArray(f.mesas) &&
    f.mesas.every(
      (p) => Array.isArray(p) && p.length === 2 && isStr(p[0]) && isMesa(p[1]),
    )
      ? (f.mesas as [string, MesaFinal][])
      : [];
  // seleccion: formato nuevo = [código, FinalAsignacion][]; el viejo era solo
  // string[] → se migra asignando el período persistido y el 1.º llamado.
  let seleccion: [string, FinalAsignacion][] = [];
  if (Array.isArray(f.seleccion)) {
    if (
      f.seleccion.every(
        (p) =>
          Array.isArray(p) && p.length === 2 && isStr(p[0]) && isAsignacion(p[1]),
      )
    ) {
      seleccion = f.seleccion as [string, FinalAsignacion][];
    } else if (isStrArr(f.seleccion)) {
      seleccion = f.seleccion.map((code) => [
        code,
        { periodo, llamado: "primer" },
      ]);
    }
  }
  return {
    periodo,
    anio: isNum(f.anio) ? f.anio : 2026,
    mesas,
    seleccion,
    reminderHs: isNum(f.reminderHs) ? f.reminderHs : 72,
    margenDias: isNum(f.margenDias) ? f.margenDias : 2,
  };
}

/**
 * Parsea un archivo de preferencias exportado → `Persisted` (lo que consume
 * HYDRATE). Tolerante: campos faltantes o inválidos caen a `null` (HYDRATE los
 * ignora y conserva el estado actual). Devuelve `null` si el JSON es inválido o
 * no parece un bundle del planner.
 */
export function parsePreferences(text: string): Persisted | null {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return null;
  }
  if (!raw || typeof raw !== "object") return null;
  const b = raw as Record<string, unknown>;
  // acepta bundles nuestros; si viene con `app` debe matchear
  if ("app" in b && b.app !== PREF_APP) return null;

  const po = (b.planOpts && typeof b.planOpts === "object"
    ? (b.planOpts as Record<string, unknown>)
    : {}) as Record<string, unknown>;
  const start =
    po.start && typeof po.start === "object"
      ? (po.start as PlanStart)
      : null;
  const planOpts: PlanOpts | null = start
    ? {
        start,
        maxCred: isNum(po.maxCred) ? po.maxCred : 18,
        maxMat: isNum(po.maxMat) ? po.maxMat : 5,
        avoid: typeof po.avoid === "boolean" ? po.avoid : true,
        method: (po.method === "cuatris" ||
        po.method === "dias" ||
        po.method === "balance"
          ? po.method
          : "cuatris") as OptMethod,
        capCredByIdx: isNumPairArr(po.capCredByIdx) ? po.capCredByIdx : [],
        capMatByIdx: isNumPairArr(po.capMatByIdx) ? po.capMatByIdx : [],
      }
    : null;

  return {
    approved: isStrArr(b.approved) ? b.approved : null,
    finalDone: isStrArr(b.finalDone) ? b.finalDone : null,
    combo: isStrArr(b.combo) ? b.combo : null,
    pool: isStrArr(b.pool) ? b.pool : null,
    fixed: isPairArr(b.fixed, isNum) ? b.fixed : null,
    lockedIdx: isNumArr(b.lockedIdx) ? b.lockedIdx : null,
    // bundles viejos no traen lockPins → null (HYDRATE resuelve el default)
    lockPins: isLockPinsArr(b.lockPins) ? b.lockPins : null,
    comboParams:
      b.comboParams && typeof b.comboParams === "object"
        ? (b.comboParams as ComboParams)
        : null,
    fixedCom: isPairArr(b.fixedCom, isStr) ? b.fixedCom : null,
    planOpts,
    finales: parseFinales(b.finales),
    sideCollapsed: typeof b.sideCollapsed === "boolean" ? b.sideCollapsed : false,
    // quien importa preferencias no es un primer uso: no revivir el banner
    // (HYDRATE además hace OR con el estado actual).
    introDismissed: true,
  };
}
