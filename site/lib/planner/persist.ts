// Persistencia en localStorage. MISMAS claves heredadas del planner standalone
// para no perder estado de usuarios actuales, + claves nuevas para los inputs
// del combinador y del plan (preferencias, comisiones fijadas). Solo cliente.
// (sv-theme lo maneja el portal, no el planner.)
import type { ComboParams, PlanStart } from "./types";

const K = {
  approved: "plan_aprobadas_v3",
  combo: "plan_combo_v3",
  pool: "plan_pool_v3",
  fixed: "plan_fixed_v3",
  sidebar: "plan_sidebar",
  comboParams: "plan_combo_params_v1",
  fixedCom: "plan_fixed_com_v1",
  planOpts: "plan_opts_v1",
} as const;

export interface PlanOpts {
  start: PlanStart;
  maxCred: number;
  maxMat: number;
  avoid: boolean;
}

export interface Persisted {
  approved: string[] | null;
  combo: string[] | null;
  pool: string[] | null;
  fixed: [string, number][] | null;
  comboParams: ComboParams | null;
  fixedCom: [string, string][] | null;
  planOpts: PlanOpts | null;
  sideCollapsed: boolean;
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
  return {
    approved: read<string[]>(K.approved),
    combo: read<string[]>(K.combo),
    pool: read<string[]>(K.pool),
    fixed: read<[string, number][]>(K.fixed),
    comboParams: read<ComboParams>(K.comboParams),
    fixedCom: read<[string, string][]>(K.fixedCom),
    planOpts: read<PlanOpts>(K.planOpts),
    sideCollapsed: ((): boolean => {
      try {
        return localStorage.getItem(K.sidebar) === "1";
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
export const saveCombo = (s: Set<string>) => write(K.combo, [...s]);
export const savePlanPool = (pool: Set<string>, fixed: Map<string, number>) => {
  write(K.pool, [...pool]);
  write(K.fixed, [...fixed]);
};
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
