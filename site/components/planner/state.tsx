"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import { PLAN, remainingOblig } from "@/lib/planner/model";
import { DEFAULT_CHAR_FILTERS } from "@/lib/planner/programa";
import type { Persisted } from "@/lib/planner/persist";
import type { PlannerUrlState } from "@/lib/planner/url-state";
import type {
  CharFilters,
  OptMethod,
  PlacedMateria,
  PlannerState,
  ViewKey,
} from "@/lib/planner/types";

const clampInt = (n: number, min: number, max: number) =>
  Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : min;

/** Estado inicial determinístico (igual en SSR y primer render del cliente).
 *  Build divulgable: arranca SIN materias aprobadas — cada usuario marca las
 *  suyas y se persisten en localStorage (ver persist.ts). */
export function initialState(): PlannerState {
  const approved = new Set<string>(PLAN.aprobadasDefault);
  return {
    view: "cuatri",
    approved,
    combo: new Set<string>(),
    fixedCom: new Map<string, string>(),
    areasOn: new Set<string>(PLAN.areas),
    search: "",
    fDisp: false,
    fHor: false,
    comboParams: {
      allowOverlap: false,
      modal: { Presencial: true, Virtual: true, Blended: true },
    },
    combos: [],
    comboIdx: 0,
    plan: {
      pool: new Set<string>(remainingOblig(approved)),
      fixed: new Map<string, number>(),
      start: { parity: 2, year: 2026 },
      maxCred: 18,
      maxMat: 5,
      avoid: true,
      method: "cuatris",
      capCredByIdx: new Map<number, number>(),
      capMatByIdx: new Map<number, number>(),
      result: null,
    },
    sideCollapsed: false,
    drawerCode: null,
    fichaCode: null,
    charFilters: { ...DEFAULT_CHAR_FILTERS },
    hydrated: false,
  };
}

export type Action =
  | { type: "HYDRATE"; payload: Persisted }
  | { type: "HYDRATE_URL"; payload: PlannerUrlState }
  | { type: "SET_VIEW"; view: ViewKey }
  | { type: "TOGGLE_APPROVED"; code: string }
  | { type: "TOGGLE_COMBO"; code: string }
  | { type: "SET_FIXED_COM"; code: string; comision: string | null }
  | { type: "SET_SEARCH"; value: string }
  | { type: "TOGGLE_AREA"; area: string }
  | { type: "SET_FILTER"; key: "fDisp" | "fHor"; value: boolean }
  | { type: "SET_ALLOW_OVERLAP"; value: boolean }
  | { type: "SET_MODAL"; key: "Presencial" | "Virtual" | "Blended"; value: boolean }
  | { type: "SET_COMBOS"; combos: PlacedMateria[][] }
  | { type: "SET_COMBO_IDX"; idx: number }
  | { type: "RESET_COMBO" }
  | { type: "SET_PLAN_START"; start: { parity: number; year: number } }
  | { type: "SET_PLAN_MAXCRED"; value: number }
  | { type: "SET_PLAN_MAXMAT"; value: number }
  | { type: "SET_PLAN_AVOID"; value: boolean }
  | { type: "SET_PLAN_METHOD"; value: OptMethod }
  | { type: "SET_PLAN_CAP_CRED"; idx: number; value: number | null }
  | { type: "SET_PLAN_CAP_MAT"; idx: number; value: number | null }
  | { type: "PLAN_POOL_ADD"; code: string }
  | { type: "PLAN_POOL_REMOVE"; code: string }
  | { type: "PLAN_SET_FIXED"; code: string; idx: number | null }
  | { type: "PLAN_RESET" }
  | { type: "RESET_APPROVED" }
  | { type: "TOGGLE_SIDEBAR" }
  | { type: "OPEN_DRAWER"; code: string }
  | { type: "CLOSE_DRAWER" }
  | { type: "OPEN_FICHA"; code: string }
  | { type: "CLOSE_FICHA" }
  | { type: "SET_CHAR_FILTERS"; patch: Partial<CharFilters> }
  | { type: "RESET_CHAR_FILTERS" };

export function reducer(s: PlannerState, a: Action): PlannerState {
  switch (a.type) {
    case "HYDRATE": {
      const p = a.payload;
      const approved = p.approved ? new Set(p.approved) : s.approved;
      return {
        ...s,
        approved,
        combo: p.combo ? new Set(p.combo) : s.combo,
        fixedCom: p.fixedCom ? new Map(p.fixedCom) : s.fixedCom,
        comboParams: p.comboParams ?? s.comboParams,
        plan: {
          ...s.plan,
          pool: p.pool ? new Set(p.pool) : new Set(remainingOblig(approved)),
          fixed: p.fixed ? new Map(p.fixed) : s.plan.fixed,
          start: p.planOpts?.start ?? s.plan.start,
          // clamp defensivo: valores persistidos fuera de rango (de versiones
          // previas con el input roto) no deben romper el plan
          maxCred: clampInt(p.planOpts?.maxCred ?? s.plan.maxCred, 3, 40),
          maxMat: clampInt(p.planOpts?.maxMat ?? s.plan.maxMat, 1, 9),
          avoid: p.planOpts?.avoid ?? s.plan.avoid,
          method: p.planOpts?.method ?? s.plan.method,
          capCredByIdx: p.planOpts?.capCredByIdx
            ? new Map(
                p.planOpts.capCredByIdx.map(([i, v]) => [i, clampInt(v, 3, 40)]),
              )
            : s.plan.capCredByIdx,
          capMatByIdx: p.planOpts?.capMatByIdx
            ? new Map(
                p.planOpts.capMatByIdx.map(([i, v]) => [i, clampInt(v, 1, 9)]),
              )
            : s.plan.capMatByIdx,
        },
        sideCollapsed: p.sideCollapsed,
        hydrated: true,
      };
    }
    // Mergea las slices de vista/navegación que trajo la URL al montar (pisan
    // lo que haya puesto HYDRATE de localStorage en esas mismas claves — la
    // intención explícita del link gana). Campos ausentes en el payload no
    // tocan el estado. Se despacha en el mismo effect, justo después de
    // HYDRATE, para no dejar un frame con el estado a medio hidratar.
    case "HYDRATE_URL": {
      const u = a.payload;
      return {
        ...s,
        view: u.view ?? s.view,
        search: u.search ?? s.search,
        areasOn: u.areasOn ? new Set(u.areasOn) : s.areasOn,
        fDisp: u.fDisp ?? s.fDisp,
        fHor: u.fHor ?? s.fHor,
        combo: u.combo ? new Set(u.combo) : s.combo,
        drawerCode: u.drawerCode ?? s.drawerCode,
        fichaCode: u.fichaCode ?? s.fichaCode,
      };
    }
    case "SET_VIEW":
      return { ...s, view: a.view };
    case "TOGGLE_APPROVED": {
      const approved = new Set(s.approved);
      approved.has(a.code) ? approved.delete(a.code) : approved.add(a.code);
      return { ...s, approved };
    }
    case "TOGGLE_COMBO": {
      const combo = new Set(s.combo);
      combo.has(a.code) ? combo.delete(a.code) : combo.add(a.code);
      return { ...s, combo };
    }
    case "SET_FIXED_COM": {
      const fixedCom = new Map(s.fixedCom);
      if (a.comision) fixedCom.set(a.code, a.comision);
      else fixedCom.delete(a.code);
      return { ...s, fixedCom };
    }
    case "SET_SEARCH":
      return { ...s, search: a.value };
    case "TOGGLE_AREA": {
      const areasOn = new Set(s.areasOn);
      areasOn.has(a.area) ? areasOn.delete(a.area) : areasOn.add(a.area);
      return { ...s, areasOn };
    }
    case "SET_FILTER":
      return { ...s, [a.key]: a.value };
    case "SET_ALLOW_OVERLAP":
      return {
        ...s,
        comboParams: { ...s.comboParams, allowOverlap: a.value },
      };
    case "SET_MODAL":
      return {
        ...s,
        comboParams: {
          ...s.comboParams,
          modal: { ...s.comboParams.modal, [a.key]: a.value },
        },
      };
    case "SET_COMBOS":
      return { ...s, combos: a.combos, comboIdx: 0 };
    case "SET_COMBO_IDX":
      return { ...s, comboIdx: a.idx };
    case "RESET_COMBO":
      return {
        ...s,
        combo: new Set(),
        fixedCom: new Map(),
        combos: [],
        comboIdx: 0,
      };
    case "SET_PLAN_START":
      return { ...s, plan: { ...s.plan, start: a.start } };
    case "SET_PLAN_MAXCRED":
      return { ...s, plan: { ...s.plan, maxCred: clampInt(a.value, 3, 40) } };
    case "SET_PLAN_MAXMAT":
      return { ...s, plan: { ...s.plan, maxMat: clampInt(a.value, 1, 9) } };
    case "SET_PLAN_AVOID":
      return { ...s, plan: { ...s.plan, avoid: a.value } };
    case "SET_PLAN_METHOD":
      return { ...s, plan: { ...s.plan, method: a.value } };
    case "SET_PLAN_CAP_CRED": {
      const capCredByIdx = new Map(s.plan.capCredByIdx);
      if (a.value === null) capCredByIdx.delete(a.idx);
      else capCredByIdx.set(a.idx, clampInt(a.value, 3, 40));
      return { ...s, plan: { ...s.plan, capCredByIdx } };
    }
    case "SET_PLAN_CAP_MAT": {
      const capMatByIdx = new Map(s.plan.capMatByIdx);
      if (a.value === null) capMatByIdx.delete(a.idx);
      else capMatByIdx.set(a.idx, clampInt(a.value, 1, 9));
      return { ...s, plan: { ...s.plan, capMatByIdx } };
    }
    case "PLAN_POOL_ADD": {
      const pool = new Set(s.plan.pool);
      pool.add(a.code);
      return { ...s, plan: { ...s.plan, pool } };
    }
    case "PLAN_POOL_REMOVE": {
      const pool = new Set(s.plan.pool);
      pool.delete(a.code);
      const fixed = new Map(s.plan.fixed);
      fixed.delete(a.code);
      return { ...s, plan: { ...s.plan, pool, fixed } };
    }
    case "PLAN_SET_FIXED": {
      const fixed = new Map(s.plan.fixed);
      if (a.idx === null) fixed.delete(a.code);
      else fixed.set(a.code, a.idx);
      return { ...s, plan: { ...s.plan, fixed } };
    }
    case "PLAN_RESET":
      return {
        ...s,
        plan: {
          ...s.plan,
          pool: new Set(remainingOblig(s.approved)),
          fixed: new Map(),
          capCredByIdx: new Map(),
          capMatByIdx: new Map(),
        },
      };
    case "RESET_APPROVED": {
      const approved = new Set(PLAN.aprobadasDefault);
      return {
        ...s,
        approved,
        plan: {
          ...s.plan,
          pool: new Set(remainingOblig(approved)),
          fixed: new Map(),
        },
      };
    }
    case "TOGGLE_SIDEBAR":
      return { ...s, sideCollapsed: !s.sideCollapsed };
    case "OPEN_DRAWER":
      return { ...s, drawerCode: a.code };
    case "CLOSE_DRAWER":
      return { ...s, drawerCode: null };
    case "OPEN_FICHA":
      return { ...s, fichaCode: a.code };
    case "CLOSE_FICHA":
      return { ...s, fichaCode: null };
    case "SET_CHAR_FILTERS":
      return { ...s, charFilters: { ...s.charFilters, ...a.patch } };
    case "RESET_CHAR_FILTERS":
      return { ...s, charFilters: { ...DEFAULT_CHAR_FILTERS } };
    default:
      return s;
  }
}

interface Ctx {
  state: PlannerState;
  dispatch: Dispatch<Action>;
}
const PlannerContext = createContext<Ctx | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, initialState);
  return (
    <PlannerContext.Provider value={{ state, dispatch }}>
      {children}
    </PlannerContext.Provider>
  );
}

export function usePlanner(): Ctx {
  const c = useContext(PlannerContext);
  if (!c) throw new Error("usePlanner fuera de PlannerProvider");
  return c;
}
