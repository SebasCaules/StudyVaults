"use client";

import { useEffect } from "react";
import { PlannerProvider, usePlanner } from "./state";
import {
  loadPersisted,
  saveApproved,
  saveCombo,
  saveComboParams,
  saveFixedCom,
  savePlanOpts,
  savePlanPool,
  saveSidebar,
} from "@/lib/planner/persist";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import DetailDrawer from "./DetailDrawer";
import FichaReader from "./FichaReader";
import CuatriView from "./views/CuatriView";
import ElectivasView from "./views/ElectivasView";
import CombinadorView from "./views/CombinadorView";
import PlanView from "./views/PlanView";
import GrafoView from "./views/GrafoView";
import RefView from "./views/RefView";
import "./planner.css";

const VIEWS = {
  cuatri: CuatriView,
  elect: ElectivasView,
  combo: CombinadorView,
  plan: PlanView,
  grafo: GrafoView,
  ref: RefView,
} as const;

function PlannerInner() {
  const { state, dispatch } = usePlanner();

  // hidratar desde localStorage tras montar (SSR no tiene localStorage)
  useEffect(() => {
    dispatch({ type: "HYDRATE", payload: loadPersisted() });
  }, [dispatch]);

  // persistir solo después de hidratar (si no, pisa datos del usuario con defaults)
  useEffect(() => {
    if (state.hydrated) saveApproved(state.approved);
  }, [state.approved, state.hydrated]);
  useEffect(() => {
    if (state.hydrated) saveCombo(state.combo);
  }, [state.combo, state.hydrated]);
  useEffect(() => {
    if (state.hydrated) savePlanPool(state.plan.pool, state.plan.fixed);
  }, [state.plan.pool, state.plan.fixed, state.hydrated]);
  useEffect(() => {
    if (state.hydrated) saveComboParams(state.comboParams);
  }, [state.comboParams, state.hydrated]);
  useEffect(() => {
    if (state.hydrated) saveFixedCom(state.fixedCom);
  }, [state.fixedCom, state.hydrated]);
  useEffect(() => {
    if (state.hydrated)
      savePlanOpts({
        start: state.plan.start,
        maxCred: state.plan.maxCred,
        maxMat: state.plan.maxMat,
        avoid: state.plan.avoid,
      });
  }, [
    state.plan.start,
    state.plan.maxCred,
    state.plan.maxMat,
    state.plan.avoid,
    state.hydrated,
  ]);
  useEffect(() => {
    if (state.hydrated) saveSidebar(state.sideCollapsed);
  }, [state.sideCollapsed, state.hydrated]);

  const View = VIEWS[state.view];

  return (
    <div className={`planner${state.sideCollapsed ? " side-collapsed" : ""}`}>
      <Topbar />
      <div className="shell">
        <Sidebar />
        <main className="main">
          <View />
        </main>
      </div>
      <DetailDrawer />
      <FichaReader />
    </div>
  );
}

export default function PlannerApp() {
  return (
    <PlannerProvider>
      <PlannerInner />
    </PlannerProvider>
  );
}
