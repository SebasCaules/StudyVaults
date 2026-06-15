"use client";

import { useMemo, useRef, useState } from "react";
import { usePlanner } from "@/components/planner/state";
import {
  byId,
  isElectiva,
  hasHorario,
  planPriority,
  PALETTE,
  DAYS,
  PLAN,
} from "@/lib/planner/model";
import { approvedCredits, electiveCredits } from "@/lib/planner/metrics";
import { isAsync, slotsConflict } from "@/lib/planner/time";
import {
  optimizePlan,
  cuatriAt,
  cuatriLabel,
  cuatriName,
} from "@/lib/planner/optimize";
import WeekGrid, { Legend } from "@/components/planner/WeekGrid";
import type {
  MateriaM,
  PlacedMateria,
  PlanResult,
  PlanStart,
  WeekBlock,
} from "@/lib/planner/types";

/* ---------- descarga PNG (port de downloadPNG, planner.js ~96-104) ---------- */
async function downloadPNG(node: HTMLElement | null, filename: string) {
  if (!node) return;
  if (typeof window === "undefined") return;
  let html2canvas: typeof import("html2canvas").default;
  try {
    html2canvas = (await import("html2canvas")).default;
  } catch {
    window.print();
    return;
  }
  const bg = getComputedStyle(document.body).backgroundColor;
  try {
    const canvas = await html2canvas(node, {
      backgroundColor: bg,
      scale: 2,
      logging: false,
      ignoreElements: (el) =>
        !!(el.classList && el.classList.contains("icon-btn")),
    });
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = filename;
    a.click();
  } catch (e) {
    console.error("descarga", e);
    window.print();
  }
}

/* ---------- texto del método (port de methodText, planner.js ~494-501) ---------- */
function methodText(
  R: PlanResult,
  PL: { maxCred: number; maxMat: number; avoid: boolean },
) {
  return (
    <>
      <b>Optimización aplicada.</b> Objetivo: minimizar la cantidad de
      cuatrimestres. Orden de prioridad de la lista: obligatorias › mayor
      requisito de créditos › más créditos. Restricciones respetadas: paridad
      1.º/2.º cuatrimestre · correlativas · créditos requeridos
      {PL.avoid ? " · sin superposición horaria" : ""}. Tope por cuatrimestre:{" "}
      {PL.maxCred} créditos y {PL.maxMat} materias.{" "}
      {R.moved
        ? `Compactación: ${R.moved} materia(s) adelantadas a cuatrimestres con lugar.`
        : `Sin compactación adicional necesaria.`}
    </>
  );
}

/* ---------- una card de cuatrimestre (port de renderPlan, planner.js ~515-535) ---------- */
function QuatriCard({
  it,
  i,
  start,
  accBefore,
}: {
  it: PlacedMateria[];
  i: number;
  start: PlanStart;
  accBefore: number[];
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const cu = cuatriAt(start, i);

  const { blocks, asyncs, entries } = useMemo(() => {
    const blocks: WeekBlock[] = [];
    const asyncs: { abbr: string; txt: string; color?: string }[] = [];
    const entries: { abbr: string; nombre: string; color: string }[] = [];
    const seenB = new Set<string>();
    it.forEach((x, k) => {
      const color = PALETTE[k % PALETTE.length];
      entries.push({ abbr: x.m.abbr, nombre: x.m.nombre, color });
      const com = x.com;
      if (!com) {
        asyncs.push({ abbr: x.m.abbr, txt: "sin horario" });
        return;
      }
      com.slots.forEach((s) => {
        const key = x.m.codigo + s.dia + s.desde + s.hasta;
        if (isAsync(s) || !DAYS.includes(s.dia)) {
          asyncs.push({
            abbr: x.m.abbr,
            txt: `${s.dia} ${s.desde}–${s.hasta}`,
            color,
          });
        } else {
          if (seenB.has(key)) return;
          seenB.add(key);
          blocks.push({
            ...s,
            abbr: x.m.abbr,
            nombre: x.m.nombre,
            color,
          });
        }
      });
    });
    blocks.forEach((a) => {
      a.conf = blocks.some((b) => b !== a && slotsConflict(a, b));
    });
    return { blocks, asyncs, entries };
  }, [it]);

  const cred = it.reduce((s, x) => s + (x.m.creditos || 0), 0);

  return (
    <div className="qgrid" ref={cardRef}>
      <div className="qgrid__h">
        <h3>
          {cuatriName(cu)}
          <span className="tag-cuat">{cuatriLabel(cu)}</span>
        </h3>
        <div className="qg-actions">
          <span className="cr">
            {cred} cr · acum. {accBefore[i] + cred}
          </span>
          <button
            className="icon-btn"
            onClick={() =>
              downloadPNG(cardRef.current, `plan-${cuatriLabel(cu)}.png`)
            }
          >
            Descargar
          </button>
        </div>
      </div>
      <div className="qgrid__body">
        {blocks.length ? (
          <WeekGrid blocks={blocks} days={DAYS} compact />
        ) : (
          <p className="muted" style={{ padding: 8 }}>
            Sólo materias sin grilla semanal.
          </p>
        )}
        {asyncs.length > 0 && (
          <div className="async-row">
            <span className="lbl">Asincrónico / otros</span>
            {asyncs.map((a, k) => (
              <span className="async-chip" key={k}>
                {a.abbr}
                {a.txt ? " · " + a.txt : ""}
              </span>
            ))}
          </div>
        )}
        <Legend entries={entries} />
      </div>
    </div>
  );
}

/* ---------- editor del pool (port de renderPlanPool, planner.js ~465-493) ---------- */
function PlanPool({ start }: { start: PlanStart }) {
  const { state, dispatch } = usePlanner();
  const [query, setQuery] = useState("");
  const [suggOpen, setSuggOpen] = useState(false);

  const { obs, els } = useMemo(() => {
    const codes = [...state.plan.pool].filter((c) => !state.approved.has(c));
    const obs = codes
      .filter((c) => !isElectiva(c))
      .map((c) => byId.get(c)!)
      .filter(Boolean)
      .sort(planPriority);
    const els = codes
      .filter(isElectiva)
      .map((c) => byId.get(c)!)
      .filter(Boolean)
      .sort(planPriority);
    return { obs, els };
  }, [state.plan.pool, state.approved]);

  const cuatriOpts = () => {
    const opts: { value: string; label: string }[] = [];
    for (let i = 0; i < 8; i++)
      opts.push({ value: String(i), label: cuatriLabel(cuatriAt(start, i)) });
    return opts;
  };

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return PLAN.electivas
      .filter(
        (m) =>
          !state.plan.pool.has(m.codigo) &&
          !state.approved.has(m.codigo) &&
          (m.codigo + " " + m.nombre + " " + m.abbr).toLowerCase().includes(q),
      )
      .slice(0, 12);
  }, [query, state.plan.pool, state.approved]);

  const item = (m: MateriaM, removable: boolean) => {
    const fx = state.plan.fixed.get(m.codigo);
    return (
      <div className="pool-item" key={m.codigo}>
        <span className="pc">{m.codigo}</span>
        <span className="pab">{m.abbr}</span>
        <span className="pn">
          {m.nombre}
          {hasHorario(m.codigo) ? "" : <span className="muted"> (sin horario)</span>}
        </span>
        <select
          value={fx === undefined ? "" : String(fx)}
          onChange={(e) =>
            dispatch({
              type: "PLAN_SET_FIXED",
              code: m.codigo,
              idx: e.target.value === "" ? null : +e.target.value,
            })
          }
        >
          <option value="">auto</option>
          {cuatriOpts().map((o) => (
            <option value={o.value} key={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {removable && (
          <button
            className="rm"
            onClick={() =>
              dispatch({ type: "PLAN_POOL_REMOVE", code: m.codigo })
            }
          >
            ×
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="pool-cols">
      <div className="pool-col">
        <div className="pool-h">
          Obligatorias <i>{obs.length}</i>
        </div>
        {obs.length ? obs.map((m) => item(m, true)) : <p className="muted">—</p>}
      </div>
      <div className="pool-col">
        <div className="pool-h">
          Electivas <i>{els.length}</i>
        </div>
        {els.length ? (
          els.map((m) => item(m, true))
        ) : (
          <p className="muted">Ninguna aún.</p>
        )}
        <div className="pool-add">
          <input
            type="text"
            placeholder="Agregar electiva (código o nombre)…"
            autoComplete="off"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSuggOpen(!!e.target.value.trim());
            }}
            onFocus={() => setSuggOpen(!!query.trim())}
            onBlur={() => setTimeout(() => setSuggOpen(false), 200)}
          />
          {suggOpen && query.trim() && (
            <div className="pool-sugg" style={{ display: "block" }}>
              {matches.length ? (
                matches.map((m) => (
                  <div
                    key={m.codigo}
                    onMouseDown={() => {
                      dispatch({ type: "PLAN_POOL_ADD", code: m.codigo });
                      setQuery("");
                      setSuggOpen(false);
                    }}
                  >
                    <span className="sc">{m.codigo}</span>
                    <span>
                      {m.abbr} — {m.nombre}
                    </span>
                    {hasHorario(m.codigo) ? null : (
                      <span className="muted" style={{ marginLeft: "auto" }}>
                        sin horario
                      </span>
                    )}
                  </div>
                ))
              ) : (
                <div className="muted" style={{ padding: "8px 10px" }}>
                  Sin resultados
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================================================= */
export default function PlanView() {
  const { state, dispatch } = usePlanner();
  const PL = state.plan;
  const planBoardRef = useRef<HTMLDivElement>(null);

  // optimización derivada en vivo (port de optimizePlan vía lib)
  const R = useMemo(
    () => optimizePlan(state.plan, state.approved),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      PL.pool,
      PL.fixed,
      PL.start,
      PL.maxCred,
      PL.maxMat,
      PL.avoid,
      state.approved,
    ],
  );

  // opciones de inicio (port de buildStartOptions, planner.js ~393-397)
  const startOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    for (let i = 0; i < 6; i++) {
      const c = cuatriAt({ parity: 2, year: 2026 }, i);
      opts.push({ value: c.parity + "-" + c.year, label: cuatriName(c) });
    }
    return opts;
  }, []);

  // métricas del summary (port de renderPlan, planner.js ~506-510)
  const used = R.items
    .map((it, i) => ({ it, i }))
    .filter((x) => x.it.length);
  const flat = R.items.flat();
  const totalCred = flat.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const finalCred = approvedCredits(state.approved) + totalCred;
  const elecPlan = flat
    .filter((x) => x.m.tipo === "electiva")
    .reduce((s, x) => s + (x.m.creditos || 0), 0);

  // observaciones (port de renderPlan, planner.js ~538-544)
  const warns: string[] = [];
  R.items.forEach((it, i) =>
    it.forEach((x) => {
      if ((x.m.creditosReq || 0) > R.accBefore[i])
        warns.push(
          `${x.m.abbr} · ${x.m.nombre}: requiere ${x.m.creditosReq} créditos pero al inicio de ${cuatriLabel(cuatriAt(PL.start, i))} tenés ${R.accBefore[i]}.`,
        );
      const cu = cuatriAt(PL.start, i);
      if (x.m.parity !== null && x.m.parity !== cu.parity)
        warns.push(
          `${x.m.abbr}: el plan la ubica en ${x.m.cuatri}.º cuatrimestre, pero la fijaste en ${cuatriLabel(cu)}.`,
        );
    }),
  );
  R.unplaced.forEach((m) =>
    warns.push(
      `${m.abbr} · ${m.nombre}: no se pudo ubicar (revisá correlativas, créditos requeridos o paridad de cuatrimestre).`,
    ),
  );

  return (
    <section className="view-panel">
      <div className="panel-head">
        <h2>Plan de cursada</h2>
        <p>
          Distribución óptima de las materias que te faltan a lo largo de los
          cuatrimestres, respetando correlativas, créditos requeridos y la
          paridad 1.º / 2.º cuatrimestre. Agregá electivas y fijá manualmente el
          cuatrimestre cuando quieras.
        </p>
      </div>

      <div className="plan-controls">
        <div className="pc-field">
          <label htmlFor="pcStart">Inicio</label>
          <select
            id="pcStart"
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
        <div className="pc-field">
          <label htmlFor="pcMaxCred">Máx. créditos / cuatri</label>
          <input
            type="number"
            id="pcMaxCred"
            min={3}
            max={40}
            value={PL.maxCred}
            onChange={(e) =>
              dispatch({
                type: "SET_PLAN_MAXCRED",
                value: +e.target.value || 18,
              })
            }
          />
        </div>
        <div className="pc-field">
          <label htmlFor="pcMaxMat">Máx. materias / cuatri</label>
          <input
            type="number"
            id="pcMaxMat"
            min={1}
            max={9}
            value={PL.maxMat}
            onChange={(e) =>
              dispatch({ type: "SET_PLAN_MAXMAT", value: +e.target.value || 5 })
            }
          />
        </div>
        <label className="ctl">
          <input
            type="checkbox"
            checked={PL.avoid}
            onChange={(e) =>
              dispatch({ type: "SET_PLAN_AVOID", value: e.target.checked })
            }
          />
          <span>Evitar superposiciones</span>
        </label>
        <div className="pc-grow" />
        <button
          className="btn btn--ghost"
          onClick={() => dispatch({ type: "PLAN_RESET" })}
        >
          Restablecer
        </button>
        <button
          className="btn btn--ghost"
          onClick={() =>
            downloadPNG(planBoardRef.current, "plan-de-cursada.png")
          }
        >
          Descargar plan
        </button>
        <button className="btn btn--go">Optimizar</button>
      </div>

      <p className="plan-method">{methodText(R, PL)}</p>

      <div className="plan-summary">
        <div className="ps">
          <b>{used.length}</b>
          <span>cuatrimestres</span>
        </div>
        <div className="ps">
          <b>{flat.length}</b>
          <span>materias planificadas</span>
        </div>
        <div className="ps">
          <b>{totalCred}</b>
          <span>créditos a cursar</span>
        </div>
        <div className="ps">
          <b>{electiveCredits(state.approved) + elecPlan}/27</b>
          <span>créditos electivos</span>
        </div>
        <div className="ps">
          <b>{finalCred}</b>
          <span>créditos al finalizar</span>
        </div>
      </div>

      <div className="plan-board" ref={planBoardRef}>
        {used.length ? (
          used.map(({ it, i }) => (
            <QuatriCard
              key={i}
              it={it}
              i={i}
              start={PL.start}
              accBefore={R.accBefore}
            />
          ))
        ) : (
          <div className="empty">
            Agregá materias al plan para generar la distribución.
          </div>
        )}
      </div>

      <div className="plan-warn">
        {warns.length > 0 && (
          <>
            <div className="block__h" style={{ margin: "6px 0" }}>
              Observaciones
            </div>
            {warns.map((w, i) => (
              <div className="conflict" key={i}>
                {w}
              </div>
            ))}
          </>
        )}
      </div>

      <details className="plan-pool-wrap" open>
        <summary>
          Materias del plan · agregar electivas y fijar cuatrimestre
        </summary>
        <div className="plan-pool">
          <PlanPool start={PL.start} />
        </div>
      </details>
    </section>
  );
}
