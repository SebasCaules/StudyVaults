"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { usePlanner } from "@/components/planner/state";
import { byId } from "@/lib/planner/model";
import { approvedCredits, electiveCredits } from "@/lib/planner/metrics";
import {
  optimizePlan,
  cuatriAt,
  cuatriLabel,
  cuatriName,
  OPT_METHODS,
  type OptMethodMeta,
} from "@/lib/planner/optimize";
import { recommendElectives } from "@/lib/planner/recommend";
import { buildPlanHTML } from "@/lib/planner/exportPlan";
import {
  openForPrint,
  downloadHTMLFile,
  downloadTextFile,
} from "@/lib/planner/download";
import { serializePreferences, parsePreferences } from "@/lib/planner/persist";
import { MINORS, MINOR_REQ } from "@/lib/planner/minors";
import MinorsModal from "@/components/planner/MinorsModal";
import { MinorBadge } from "@/components/planner/MinorBadge";
import IOModal, { type IOCuatri } from "@/components/planner/IOModal";
import {
  IconCalendar,
  IconCheck,
  IconDownload,
  IconGraduationCap,
  IconLayers,
  IconRotateCcw,
  IconRoute,
} from "@/components/planner/icons";
import { useModalFocus } from "@/components/planner/useModalFocus";
import {
  ELEC_REQ,
  IconWarnTri,
  NumField,
} from "@/components/planner/plan/shared";
import PlanRail, { type RailTab } from "@/components/planner/plan/PlanRail";
import PlanTimeline from "@/components/planner/plan/PlanTimeline";
import SemCards from "@/components/planner/plan/SemCards";
import type {
  OptMethod,
  PlacedMateria,
  PlanResult,
  PlanState,
} from "@/lib/planner/types";
import "@/components/planner/planview.css";

/* ---------- export HTML / PDF ---------- */
function nowStr(): string {
  try {
    return new Date().toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/* ---------- resumen del método (compacto + prosa desplegable) ---------- */
function MethodNote({
  R,
  PL,
}: {
  R: PlanResult;
  PL: { method: OptMethod; maxCred: number; maxMat: number; avoid: boolean };
}) {
  const meta = OPT_METHODS.find((m) => m.key === PL.method);
  const objetivo = meta?.objetivo ?? "minimizar la cantidad de cuatrimestres";
  return (
    <div className="pv-method">
      <div className="pv-method__row">
        <span className="pv-method__lead">Optimizado para {meta?.label.toLowerCase() ?? "recibirte antes"}</span>
        <span className="pv-method__chip">correlativas</span>
        <span className="pv-method__chip">paridad 1.º/2.º</span>
        <span className="pv-method__chip">créditos requeridos</span>
        {PL.avoid && <span className="pv-method__chip">sin superposición</span>}
        <span className="pv-method__chip">
          tope {PL.maxCred} cr · {PL.maxMat} mat
        </span>
        {R.moved > 0 && (
          <span className="pv-method__chip pv-method__chip--soft">
            {R.moved} adelantada{R.moved === 1 ? "" : "s"}
          </span>
        )}
      </div>
      <details className="pv-method__more">
        <summary>¿Cómo se armó este plan?</summary>
        <p>
          Objetivo: {objetivo} Orden de prioridad: obligatorias · camino
          crítico de correlativas · más créditos · mayor requisito de créditos.
          Las comisiones se eligen para concentrar la cursada en menos días en
          el campus. Restricciones respetadas: paridad 1.º/2.º cuatrimestre ·
          correlativas · créditos requeridos
          {PL.avoid
            ? " · sin superposición horaria (incluye traslados entre sedes)"
            : ""}
          . Tope por cuatrimestre: {PL.maxCred} créditos y {PL.maxMat} materias.{" "}
          {R.moved
            ? `Compactación: ${R.moved} materia(s) adelantadas a cuatrimestres con lugar.`
            : `Sin compactación adicional necesaria.`}
        </p>
      </details>
    </div>
  );
}

/* ---------- panel de minors (tab Minors) ---------- */
function MinorsPanel({
  used,
  approved,
  onOpenDetail,
}: {
  used: { it: PlacedMateria[]; i: number }[];
  approved: Set<string>;
  onOpenDetail: () => void;
}) {
  const rows = useMemo(() => {
    return MINORS.map((minor) => {
      let cr = 0;
      approved.forEach((c) => {
        const m = byId.get(c);
        if (m && m.tipo === "electiva" && (m.areas || []).includes(minor.id))
          cr += m.creditos || 0;
      });
      used.forEach(({ it }) =>
        it.forEach((x) => {
          if (
            x.m.tipo === "electiva" &&
            (x.m.areas || []).includes(minor.id)
          )
            cr += x.m.creditos || 0;
        }),
      );
      return { minor, cr, done: cr >= MINOR_REQ };
    });
  }, [used, approved]);

  const completos = rows.filter((r) => r.done);

  return (
    <div className="pv-minors">
      {rows.map(({ minor, cr, done }) => {
        const pct = Math.min(100, Math.round((cr / MINOR_REQ) * 100));
        return (
          <div
            key={minor.id}
            className={"pv-minor-row" + (done ? " is-done" : "")}
            style={{ ["--minor-color" as string]: minor.color }}
          >
            <MinorBadge minor={minor} variant="pill" />
            <div className="pv-minor-name">
              {minor.name}
              <span>{minor.short}</span>
            </div>
            <div className="pv-minor-prog">
              <div className="pv-minor-track">
                <i style={{ width: `${pct}%` }} />
              </div>
            </div>
            <div className={"pv-minor-count" + (done ? " is-done" : "")}>
              {done && <IconCheck size={12} />}
              {cr} / {MINOR_REQ} cr
            </div>
          </div>
        );
      })}
      <div className="pv-minors__foot">
        <span className="pv-minors__note">
          {completos.length > 0 ? (
            <>
              Completás <b>{completos.length}</b>{" "}
              {completos.length === 1 ? "minor" : "minors"} con este plan:{" "}
              {completos.map((c) => c.minor.short).join(" · ")}.
            </>
          ) : (
            <>
              Ningún área llega a {MINOR_REQ} créditos todavía. Agregá electivas
              del área para completar un minor.
            </>
          )}
        </span>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={onOpenDetail}
        >
          <IconLayers size={13} /> Avance por cuatrimestre
        </button>
      </div>
    </div>
  );
}

/* ---------- modal de confirmación de reset (portaleado en `.planner`) ---------- */
function ResetConfirm({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) {
  // foco inicial + trap de Tab + restore al cerrar
  const panelRef = useModalFocus<HTMLDivElement>();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  if (typeof document === "undefined") return null;
  return createPortal(
    <div className="planner" style={{ padding: 0 }}>
      <div
        className="mnr-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pv-reset-title"
      >
        <div className="mnr-modal__bg" onClick={onCancel} />
        <div className="pv-reset" ref={panelRef}>
          <div className="pv-reset__icon">
            <IconWarnTri size={21} />
          </div>
          <h3 id="pv-reset-title">¿Restablecer el plan de cursada?</h3>
          <p>
            Se borran las materias agregadas, los topes por cuatrimestre y los
            cuatrimestres finalizados. El plan vuelve a Auto. Esta acción no se
            puede deshacer.
          </p>
          <div className="pv-reset__acts">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={onCancel}
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn--go btn--sm"
              onClick={onConfirm}
            >
              Restablecer
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ========================================================================= */
type PlanTab = "road" | "cal" | "min";

export default function PlanView() {
  const { state, dispatch } = usePlanner();
  const PL = state.plan;
  const approved = state.approved;
  const [preview, setPreview] = useState<string | null>(null);
  // el roadmap (timeline) es la vista default: siempre tiene contenido; el
  // calendario brilla recién cuando el SGA publica horarios del cuatri.
  const [tab, setTab] = useState<PlanTab>("road");
  const [railTab, setRailTab] = useState<RailTab>("mats");
  const [minorsOpen, setMinorsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

  // recomendaciones: solo se computan cuando el rail está mostrando la
  // pestaña "Recomendadas" (evita correr optimizePlan ~90 veces de fondo).
  const recsOn = railTab === "recs";
  const recs = useMemo(
    () =>
      recsOn
        ? recommendElectives(PL, approved, Infinity, state.fixedCom)
        : [],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      recsOn,
      PL.pool,
      PL.fixed,
      PL.start,
      PL.maxCred,
      PL.maxMat,
      PL.avoid,
      PL.method,
      PL.capCredByIdx,
      PL.capMatByIdx,
      approved,
      state.fixedCom,
    ],
  );

  const baseR = useMemo(
    () => optimizePlan(PL, approved, state.fixedCom),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      PL.pool,
      PL.fixed,
      PL.start,
      PL.maxCred,
      PL.maxMat,
      PL.avoid,
      PL.method,
      PL.capCredByIdx,
      PL.capMatByIdx,
      approved,
      state.fixedCom,
    ],
  );

  const previewR = useMemo(
    () => {
      if (!preview) return null;
      const pool = new Set(PL.pool);
      pool.add(preview);
      return optimizePlan({ ...PL, pool } as PlanState, approved, state.fixedCom);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      preview,
      PL.pool,
      PL.fixed,
      PL.start,
      PL.maxCred,
      PL.maxMat,
      PL.avoid,
      PL.method,
      PL.capCredByIdx,
      PL.capMatByIdx,
      approved,
      state.fixedCom,
    ],
  );

  // resultado efectivo: con preview si hay hover, si no el comprometido
  const R = previewR ?? baseR;

  const startOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    for (let i = 0; i < 6; i++) {
      const c = cuatriAt({ parity: 2, year: 2026 }, i);
      opts.push({ value: c.parity + "-" + c.year, label: cuatriName(c) });
    }
    return opts;
  }, []);

  const used = R.items.map((it, i) => ({ it, i })).filter((x) => x.it.length);
  const flat = R.items.flat();
  const totalCred = flat.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const accNow = approvedCredits(approved);
  const finalCred = accNow + totalCred;
  const elecPlan = flat
    .filter((x) => x.m.tipo === "electiva")
    .reduce((s, x) => s + (x.m.creditos || 0), 0);
  const lastIdx = used.length ? used[used.length - 1].i : 0;
  const gradCu = cuatriAt(PL.start, lastIdx);
  const pct = finalCred > 0 ? Math.round((accNow / finalCred) * 100) : 0;
  const elecTotal = electiveCredits(approved) + elecPlan;
  // créditos electivos comprometidos (sin el preview) → para el rail
  const elecCommitted =
    electiveCredits(approved) +
    baseR.items
      .flat()
      .filter((x) => x.m.tipo === "electiva")
      .reduce((s, x) => s + (x.m.creditos || 0), 0);

  // info del preview (anuncio accesible; el resalte visual lo hace el board)
  const previewInfo = useMemo(() => {
    if (!preview || !previewR) return null;
    let idx = -1;
    previewR.items.forEach((it, i) => {
      if (it.some((x) => x.m.codigo === preview)) idx = i;
    });
    return { m: byId.get(preview) ?? null, idx };
  }, [preview, previewR]);

  // Observaciones mapeadas al cuatrimestre que las genera (badge en la card) +
  // las globales (materias que no entraron en ningún lado).
  const { warnsByIdx, globalWarns } = useMemo(() => {
    const byIdx = new Map<number, string[]>();
    const globals: string[] = [];
    const push = (i: number, msg: string) => {
      const arr = byIdx.get(i) ?? [];
      arr.push(msg);
      byIdx.set(i, arr);
    };
    R.items.forEach((it, i) =>
      it.forEach((x) => {
        if ((x.m.creditosReq || 0) > R.accBefore[i])
          push(
            i,
            `${x.m.abbr} · ${x.m.nombre}: requiere ${x.m.creditosReq} créditos pero al inicio de ${cuatriLabel(cuatriAt(PL.start, i))} tenés ${R.accBefore[i]}.`,
          );
        const cu = cuatriAt(PL.start, i);
        if (x.m.parity !== null && x.m.parity !== cu.parity)
          push(
            i,
            `${x.m.abbr}: el plan la ubica en ${x.m.cuatri}.º cuatrimestre, pero la fijaste en ${cuatriLabel(cu)}.`,
          );
      }),
    );
    R.unplaced.forEach((m) =>
      globals.push(
        `${m.abbr} · ${m.nombre}: no se pudo ubicar (revisá correlativas, créditos requeridos o paridad de cuatrimestre).`,
      ),
    );
    return { warnsByIdx: byIdx, globalWarns: globals };
  }, [R, PL.start]);

  const exportPlan = (format: "pdf" | "html", cuatris?: number[]) => {
    if (typeof window === "undefined") return;
    const html = buildPlanHTML({
      result: baseR,
      start: PL.start,
      maxCred: PL.maxCred,
      maxMat: PL.maxMat,
      avoid: PL.avoid,
      approvedCreditsNow: accNow,
      generado: nowStr(),
      autoPrint: format === "pdf",
      cuatris,
      method: PL.method,
    });
    if (format === "html") downloadHTMLFile(html, "plan-de-cursada.html");
    else openForPrint(html);
  };

  // descarga de UN cuatrimestre desde el menú 3-puntos, con los 3 alcances
  // (solo calendario / calendario+programa / solo programa) vía exportPlan.
  const downloadCuatri = (idx: number, scope: "cal" | "both" | "programa") => {
    if (typeof window === "undefined") return;
    const html = buildPlanHTML({
      result: baseR,
      start: PL.start,
      maxCred: PL.maxCred,
      maxMat: PL.maxMat,
      avoid: PL.avoid,
      approvedCreditsNow: accNow,
      generado: nowStr(),
      autoPrint: true,
      cuatris: [idx],
      includeCalendar: scope !== "programa",
      includeSpecs: scope !== "cal",
      method: PL.method,
    });
    openForPrint(html);
  };

  // Finalizar un cuatrimestre: `pinnedByLock` lleva los códigos ubicados hoy
  // en ese cuatri según baseR (la única fuente del resultado optimizado) que
  // NO estaban ya fijados por el usuario. El reducer los pinea y los registra
  // en plan.lockPins: al desbloquear libera solo esos, sin pisar los pines
  // manuales previos.
  const finalizeCuatri = (idx: number) => {
    const pinnedByLock = (baseR.items[idx] ?? [])
      .map((x) => x.m.codigo)
      .filter((code) => !PL.fixed.has(code));
    dispatch({ type: "PLAN_TOGGLE_LOCK", idx, pinnedByLock });
  };
  const unlockCuatri = (idx: number) =>
    dispatch({ type: "PLAN_TOGGLE_LOCK", idx });

  // Cuatrimestres disponibles para elegir en el modal de exportar.
  const ioCuatris = useMemo<IOCuatri[]>(
    () =>
      baseR.items
        .map((it, i) => ({ it, i }))
        .filter((x) => x.it.length)
        .map((x) => ({
          idx: x.i,
          tag: cuatriLabel(cuatriAt(PL.start, x.i)),
          materias: x.it.length,
        })),
    [baseR, PL.start],
  );

  /* ---- export/import de PREFERENCIAS (distinto del export del documento del
   * plan de arriba): un .json portable con todo el estado persistible, para
   * llevarlo a otro navegador o guardarlo como plantilla. ---- */
  const [ioOpen, setIoOpen] = useState(false);
  const [prefsError, setPrefsError] = useState<string | null>(null);
  const prefsErrTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // limpia el timeout pendiente si el componente se desmonta con el error abierto
    return () => {
      if (prefsErrTimeout.current) clearTimeout(prefsErrTimeout.current);
    };
  }, []);

  const showPrefsError = (msg: string) => {
    setPrefsError(msg);
    if (prefsErrTimeout.current) clearTimeout(prefsErrTimeout.current);
    prefsErrTimeout.current = setTimeout(() => setPrefsError(null), 4000);
  };

  const exportPrefs = () => {
    if (typeof window === "undefined") return;
    const fecha = nowStr();
    const text = serializePreferences(state, fecha);
    downloadTextFile(text, `preferencias-plan-${fecha}.json`, "application/json");
  };

  const importPrefsFromFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (typeof window === "undefined") return;
    const file = e.target.files?.[0] ?? null;
    e.target.value = ""; // permite reimportar el mismo archivo dos veces seguidas
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const payload = parsePreferences(String(reader.result ?? ""));
      if (payload) dispatch({ type: "HYDRATE", payload });
      else showPrefsError("El archivo no es un JSON de preferencias válido.");
    };
    reader.onerror = () => showPrefsError("No se pudo leer el archivo.");
    reader.readAsText(file);
  };

  // Navegación por teclado del tablist (roving tabindex): flechas con wrap,
  // Home/End. Mueve la selección y el foco al tab elegido.
  const TAB_ORDER: PlanTab[] = ["road", "cal", "min"];
  const onTablistKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    let next: number;
    const cur = TAB_ORDER.indexOf(tab);
    if (e.key === "ArrowLeft") next = (cur + TAB_ORDER.length - 1) % TAB_ORDER.length;
    else if (e.key === "ArrowRight") next = (cur + 1) % TAB_ORDER.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TAB_ORDER.length - 1;
    else return;
    e.preventDefault();
    setTab(TAB_ORDER[next]);
    const tabs = e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[next]?.focus();
  };

  return (
    <section className="view-panel pv">
      <div className="panel-head">
        <h2>Plan de cursada</h2>
        <p>
          La distribución óptima de las materias que te faltan a lo largo de los
          cuatrimestres —respetando correlativas, créditos y paridad— hasta
          recibirte. Se recalcula sola: agregá electivas o fijá cuatrimestres.
        </p>
      </div>

      {used.length > 0 && (
        <div className="pv-banner">
          <div className="pv-banner__synth">
            <div className="pv-stat">
              <span className="pv-stat__num">{used.length}</span>
              <span className="pv-stat__txt">
                <span className="lead">
                  {used.length === 1 ? "cuatrimestre" : "cuatrimestres"}
                </span>
                <span className="sub">por delante</span>
              </span>
            </div>

            <div className="pv-chips">
              <span className="pv-chip">
                <b>{flat.length}</b> materias
              </span>
              <span className="pv-chip">
                <b>{totalCred}</b> créditos
              </span>
              <span className="pv-chip">
                <b>
                  {elecTotal}/{ELEC_REQ}
                </b>{" "}
                electivos
              </span>
            </div>

            <div className="pv-grad">
              <IconGraduationCap size={20} />
              <div>
                <span className="pv-grad__lbl">Te recibís en</span>
                <span className="pv-grad__val">{cuatriName(gradCu)}</span>
              </div>
            </div>

            <div
              className="pv-meter"
              title={`${accNow} créditos aprobados · faltan ${totalCred} · meta ${finalCred}`}
              aria-label={`Progreso de créditos ${pct}%: ${accNow} aprobados, faltan ${totalCred}, meta ${finalCred}.`}
            >
              <span className="pv-meter__lbl">Créditos</span>
              <div className="pv-meter__bar">
                <i style={{ width: `${pct}%` }} />
              </div>
              <span className="pv-meter__pct">{pct}%</span>
            </div>
          </div>

          <hr className="pv-banner__divider" />

          <div className="pv-controls">
            <div className="pv-field">
              <label className="pv-field__lbl" htmlFor="pcStart">
                Empiezo a cursar
              </label>
              <select
                id="pcStart"
                className="commission-select"
                aria-label="Cuatrimestre de inicio"
                value={PL.start.parity + "-" + PL.start.year}
                onChange={(e) => {
                  const [p, y] = e.target.value.split("-").map(Number);
                  dispatch({
                    type: "SET_PLAN_START",
                    start: { parity: p, year: y },
                  });
                }}
              >
                {startOptions.map((o) => (
                  <option value={o.value} key={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pv-field pv-field--num">
              <NumField
                id="pcMaxMat"
                label="Máx. materias"
                value={PL.maxMat}
                min={1}
                max={9}
                onCommit={(n) => dispatch({ type: "SET_PLAN_MAXMAT", value: n })}
              />
            </div>

            <div className="pv-field pv-field--num">
              <NumField
                id="pcMaxCred"
                label="Máx. créditos"
                value={PL.maxCred}
                min={3}
                max={40}
                onCommit={(n) => dispatch({ type: "SET_PLAN_MAXCRED", value: n })}
              />
            </div>

            <div className="pv-field pv-field--seg">
              <span className="pv-field__lbl">
                Optimizar para{" "}
                <span className="hint">— cómo arma el plan</span>
              </span>
              <div
                className="pv-seg"
                role="group"
                aria-label="Método de optimización del plan"
              >
                {OPT_METHODS.map((m: OptMethodMeta) => (
                  <button
                    key={m.key}
                    type="button"
                    className="pv-seg__opt"
                    aria-pressed={PL.method === m.key}
                    title={m.objetivo}
                    onClick={() =>
                      dispatch({ type: "SET_PLAN_METHOD", value: m.key })
                    }
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="pv-field pv-field--sw">
              <span className="pv-field__lbl">Horario</span>
              <button
                type="button"
                className={"cmb-switch" + (PL.avoid ? " on" : "")}
                role="switch"
                aria-checked={PL.avoid}
                onClick={() =>
                  dispatch({ type: "SET_PLAN_AVOID", value: !PL.avoid })
                }
              >
                <span className="cmb-switch__track">
                  <span className="cmb-switch__knob" />
                </span>
                Evitar superposiciones
              </button>
            </div>
          </div>
        </div>
      )}

      {used.length > 0 && (
        <div className="pv-tabs">
          <div
            className="pv-tablist"
            role="tablist"
            aria-label="Vistas del plan"
            onKeyDown={onTablistKeyDown}
          >
            <button
              type="button"
              role="tab"
              className="pv-tab"
              aria-selected={tab === "road"}
              tabIndex={tab === "road" ? 0 : -1}
              onClick={() => setTab("road")}
            >
              <IconRoute size={15} /> Roadmap
            </button>
            <button
              type="button"
              role="tab"
              className="pv-tab"
              aria-selected={tab === "cal"}
              tabIndex={tab === "cal" ? 0 : -1}
              onClick={() => setTab("cal")}
            >
              <IconCalendar size={15} /> Calendario
            </button>
            <button
              type="button"
              role="tab"
              className="pv-tab"
              aria-selected={tab === "min"}
              tabIndex={tab === "min" ? 0 : -1}
              onClick={() => setTab("min")}
            >
              <IconLayers size={15} /> Minors
            </button>
          </div>

          <div className="pv-tabs__actions">
            <button
              type="button"
              className="pv-iconbtn"
              aria-label="Restablecer plan"
              title="Restablecer plan"
              onClick={() => setResetOpen(true)}
            >
              <IconRotateCcw size={15} />
            </button>
            <span className="pv-tip">
              <button
                type="button"
                className="pv-iconbtn pv-iconbtn--label"
                aria-describedby="pv-io-tip"
                onClick={() => setIoOpen(true)}
              >
                <IconDownload size={15} /> Importar / Exportar
              </button>
              <span className="pv-tip__bubble" role="tooltip" id="pv-io-tip">
                Descargá el plan como <b>PDF</b> (listo para imprimir) o{" "}
                <b>HTML</b> para leer offline, guardá tus preferencias en un{" "}
                <b>.json</b> portable, o importá un plan guardado.
              </span>
            </span>
          </div>
        </div>
      )}

      {/* anuncio accesible del preview (el resalte visual vive en el board) */}
      <span className="sr-only" aria-live="polite">
        {previewInfo && previewInfo.m
          ? previewInfo.idx >= 0
            ? `Vista previa: ${previewInfo.m.abbr} entraría en ${cuatriName(cuatriAt(PL.start, previewInfo.idx))}.`
            : `Vista previa: ${previewInfo.m.abbr} no se pudo ubicar en el plan.`
          : ""}
      </span>

      <div className="pv-work">
        <div className="pv-work__board">
          {used.length > 0 ? (
            <>
              {tab === "road" && (
                <PlanTimeline
                  used={used}
                  R={R}
                  start={PL.start}
                  previewCode={preview}
                  recOn={recsOn}
                  warnsByIdx={warnsByIdx}
                  onFinalize={finalizeCuatri}
                  onUnlock={unlockCuatri}
                  onDownload={downloadCuatri}
                />
              )}
              {tab === "cal" && (
                <SemCards
                  used={used}
                  start={PL.start}
                  previewCode={preview}
                  recOn={recsOn}
                  warnsByIdx={warnsByIdx}
                  onFinalize={finalizeCuatri}
                  onUnlock={unlockCuatri}
                  onDownload={downloadCuatri}
                />
              )}
              {tab === "min" && (
                <MinorsPanel
                  used={used}
                  approved={approved}
                  onOpenDetail={() => setMinorsOpen(true)}
                />
              )}

              {globalWarns.length > 0 && (
                <div className="pv-unplaced" role="alert">
                  <span className="pv-unplaced__h">
                    <IconWarnTri size={15} /> No entraron en el plan{" "}
                    <i>{globalWarns.length}</i>
                  </span>
                  {globalWarns.map((w, i) => (
                    <p className="pv-unplaced__row" key={i}>
                      {w}
                    </p>
                  ))}
                </div>
              )}

              {tab !== "min" && <MethodNote R={R} PL={PL} />}
            </>
          ) : (
            <div className="pv-empty">
              <IconGraduationCap size={38} />
              <p className="pv-empty__t">Tu plan está vacío.</p>
              <p className="pv-empty__s">
                Agregá materias desde el panel <b>Materias</b> o explorá las{" "}
                <button
                  type="button"
                  className="pv-empty__link"
                  onClick={() => setRailTab("recs")}
                >
                  electivas recomendadas
                </button>{" "}
                para ver tu camino a recibirte.
              </p>
            </div>
          )}
        </div>

        <PlanRail
          start={PL.start}
          tab={railTab}
          onTab={setRailTab}
          recs={recs}
          elecTotal={elecCommitted}
          preview={preview}
          onPreview={setPreview}
        />
      </div>

      {minorsOpen && (
        <MinorsModal
          used={used}
          start={PL.start}
          approved={approved}
          onClose={() => setMinorsOpen(false)}
        />
      )}

      {resetOpen && (
        <ResetConfirm
          onCancel={() => setResetOpen(false)}
          onConfirm={() => {
            dispatch({ type: "PLAN_RESET" });
            setResetOpen(false);
          }}
        />
      )}

      {ioOpen && (
        <IOModal
          onClose={() => setIoOpen(false)}
          cuatris={ioCuatris}
          onExportHTML={(sel) => exportPlan("html", sel)}
          onExportPDF={(sel) => exportPlan("pdf", sel)}
          onExportPrefs={exportPrefs}
          onImportFile={importPrefsFromFile}
          prefsError={prefsError}
        />
      )}
    </section>
  );
}
