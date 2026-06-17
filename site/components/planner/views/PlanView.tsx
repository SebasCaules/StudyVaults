"use client";

import { useEffect, useMemo, useState } from "react";
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
import { recommendElectives, type Recommendation } from "@/lib/planner/recommend";
import { buildPlanHTML } from "@/lib/planner/exportPlan";
import CursadaCalendar from "@/components/planner/CursadaCalendar";
import type {
  MateriaM,
  PlacedMateria,
  PlanResult,
  PlanState,
  PlanStart,
  WeekBlock,
} from "@/lib/planner/types";

const ELEC_REQ = PLAN.creditosElectivasReq ?? 27;

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

function downloadHTMLFile(html: string, filename: string) {
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function openForPrint(html: string) {
  const w = window.open("", "_blank");
  if (!w) {
    // pop-up bloqueado → caemos a descarga de HTML
    downloadHTMLFile(html, "plan-de-cursada.html");
    return;
  }
  w.document.open();
  w.document.write(html);
  w.document.close();
}

/* ---------- input numérico robusto (arregla el "Máx. …") ---------- */
function NumField({
  id,
  label,
  value,
  min,
  max,
  onCommit,
}: {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  onCommit: (n: number) => void;
}) {
  const [draft, setDraft] = useState(String(value));
  const [focused, setFocused] = useState(false);
  // mientras no se está editando, el input refleja el valor real
  useEffect(() => {
    if (!focused) setDraft(String(value));
  }, [value, focused]);
  const clamp = (n: number) => Math.min(max, Math.max(min, n));
  return (
    <div className="plan2-field">
      <label htmlFor={id}>{label}</label>
      <input
        type="number"
        id={id}
        min={min}
        max={max}
        inputMode="numeric"
        value={draft}
        onFocus={() => setFocused(true)}
        onChange={(e) => {
          const s = e.target.value;
          setDraft(s); // permite vacío / edición parcial sin saltar al default
          const n = parseInt(s, 10);
          if (!Number.isNaN(n) && n >= min && n <= max) onCommit(n);
        }}
        onBlur={() => {
          setFocused(false);
          const n = parseInt(draft, 10);
          const c = Number.isNaN(n) ? value : clamp(n);
          if (c !== value) onCommit(c);
          setDraft(String(c));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") (e.target as HTMLInputElement).blur();
        }}
      />
    </div>
  );
}

/* ---------- texto del método ---------- */
function methodText(
  R: PlanResult,
  PL: { maxCred: number; maxMat: number; avoid: boolean },
) {
  return (
    <>
      <b>Optimización aplicada.</b> Objetivo: minimizar la cantidad de
      cuatrimestres. Orden de prioridad: obligatorias › camino crítico de
      correlativas › más créditos › mayor requisito de créditos. Las comisiones
      se eligen para concentrar la cursada en menos días en el campus.
      Restricciones respetadas: paridad 1.º/2.º cuatrimestre · correlativas ·
      créditos requeridos
      {PL.avoid
        ? " · sin superposición horaria (incluye traslados entre sedes)"
        : ""}
      . Tope por cuatrimestre: {PL.maxCred} créditos y {PL.maxMat} materias.{" "}
      {R.moved
        ? `Compactación: ${R.moved} materia(s) adelantadas a cuatrimestres con lugar.`
        : `Sin compactación adicional necesaria.`}
    </>
  );
}

/* ---------- bloques de la grilla semanal de un cuatrimestre ---------- */
function computeCuatriBlocks(it: PlacedMateria[]) {
  const blocks: WeekBlock[] = [];
  const asyncs: { abbr: string; txt: string; color?: string }[] = [];
  const seenB = new Set<string>();
  const campus = new Set<string>();
  it.forEach((x, k) => {
    const color = PALETTE[k % PALETTE.length];
    const com = x.com;
    if (!com) {
      asyncs.push({ abbr: x.m.abbr, txt: "sin horario", color });
      return;
    }
    com.slots.forEach((s) => {
      const key = x.m.codigo + s.dia + s.desde + s.hasta;
      if (isAsync(s) || !DAYS.includes(s.dia)) {
        asyncs.push({ abbr: x.m.abbr, txt: `${s.dia} ${s.desde}–${s.hasta}`, color });
      } else {
        campus.add(s.dia);
        if (seenB.has(key)) return;
        seenB.add(key);
        blocks.push({ ...s, abbr: x.m.abbr, nombre: x.m.nombre, color });
      }
    });
  });
  blocks.forEach((a) => {
    a.conf = blocks.some((b) => b !== a && slotsConflict(a, b));
  });
  return { blocks, asyncs, campusDays: campus.size };
}

/* ---------- fila de asincrónicas / otros ---------- */
function AsyncRow({
  asyncs,
}: {
  asyncs: { abbr: string; txt: string; color?: string }[];
}) {
  if (!asyncs.length) return null;
  return (
    <div className="async-row">
      <span className="lbl">Asincrónico / otros</span>
      {asyncs.map((a, k) => (
        <span className="async-chip" key={k}>
          {a.abbr}
          {a.txt ? " · " + a.txt : ""}
        </span>
      ))}
    </div>
  );
}

/* ---------- tarjeta de calendario (panorama de cuatrimestres) ---------- */
function CuatriCalCard({
  it,
  i,
  start,
  previewCode,
}: {
  it: PlacedMateria[];
  i: number;
  start: PlanStart;
  previewCode: string | null;
}) {
  const cu = cuatriAt(start, i);
  const { blocks, asyncs, campusDays } = useMemo(
    () => computeCuatriBlocks(it),
    [it],
  );
  const cred = it.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const hasPreview = it.some((x) => x.m.codigo === previewCode);

  return (
    <div className={"cal-card" + (hasPreview ? " has-preview" : "")}>
      <div className="cal-card__h">
        <div className="cal-card__when">
          <span className="cal-card__tag">{cuatriLabel(cu)}</span>
          <h3>{cuatriName(cu)}</h3>
        </div>
        <span className="cal-card__meta">
          <b>{cred}</b> cr · <b>{it.length}</b> mat
          {campusDays > 0 && (
            <>
              {" · "}
              <b>{campusDays}</b> {campusDays === 1 ? "día" : "días"}
            </>
          )}
        </span>
      </div>
      {blocks.length ? (
        <CursadaCalendar blocks={blocks} days={DAYS} compact />
      ) : (
        <p className="muted" style={{ padding: "10px 4px" }}>
          Sólo materias sin grilla semanal.
        </p>
      )}
      <AsyncRow asyncs={asyncs} />
    </div>
  );
}

/* ---------- una parada del roadmap (un cuatrimestre, tarjeta del panorama) ---------- */
function RoadmapStop({
  it,
  i,
  start,
  accBefore,
  maxCred,
  previewCode,
}: {
  it: PlacedMateria[];
  i: number;
  start: PlanStart;
  accBefore: number[];
  maxCred: number;
  previewCode: string | null;
}) {
  const { dispatch } = usePlanner();
  const cu = cuatriAt(start, i);

  // sólo necesitamos los días de campus para el ledger; la grilla semanal
  // detallada vive en la pestaña "Calendarios".
  const { campusDays } = useMemo(() => computeCuatriBlocks(it), [it]);

  const cred = it.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const acc = accBefore[i] + cred;
  const load = Math.min(100, Math.round((cred / Math.max(1, maxCred)) * 100));
  const hasPreview = it.some((x) => x.m.codigo === previewCode);

  return (
    <li className={"rmap-stop" + (hasPreview ? " has-preview" : "")}>
      <div className="rmap-stop__card">
        <div className="rmap-stop__head">
          <div className="rmap-stop__when">
            <span className="rmap-stop__tag">{cuatriLabel(cu)}</span>
            <h3>{cuatriName(cu)}</h3>
          </div>
          <span className="rmap-stop__step" aria-hidden="true">
            {i + 1}
          </span>
        </div>

        <div className="rmap-stop__ledger">
          <span className="rmap-stop__metric">
            <b>{cred}</b> cr
          </span>
          <span className="rmap-stop__metric rmap-stop__metric--soft">
            <b>{it.length}</b> mat
          </span>
          {campusDays > 0 && (
            <span className="rmap-stop__metric rmap-stop__metric--soft">
              <b>{campusDays}</b> {campusDays === 1 ? "día" : "días"}
            </span>
          )}
        </div>

        <div className="rmap-stop__load" aria-hidden="true">
          <i style={{ width: `${load}%` }} />
        </div>

        <div className="rmap-stop__mats">
          {it.map((x, k) => {
            const isPrev = x.m.codigo === previewCode;
            return (
              <button
                type="button"
                key={x.m.codigo}
                className={"rmap-mat" + (isPrev ? " is-preview" : "")}
                style={
                  { "--blk": PALETTE[k % PALETTE.length] } as React.CSSProperties
                }
                title={`${x.m.codigo} · ${x.m.nombre}`}
                onClick={() => dispatch({ type: "OPEN_DRAWER", code: x.m.codigo })}
              >
                <span className="rmap-mat__abbr">{x.m.abbr}</span>
                <span className="rmap-mat__cr">{x.m.creditos}</span>
                {isPrev && <span className="rmap-mat__new">nueva</span>}
              </button>
            );
          })}
        </div>

        <div className="rmap-stop__foot">
          <span className="rmap-stop__acc">
            acumulado <b>{acc}</b> cr
          </span>
        </div>
      </div>
    </li>
  );
}

/* ---------- recomendaciones de electivas ---------- */
function Recommendations({
  start,
  elecTotal,
  onPreview,
  preview,
}: {
  start: PlanStart;
  elecTotal: number;
  onPreview: (code: string | null) => void;
  preview: string | null;
}) {
  const { state, dispatch } = usePlanner();
  // sin límite: el recomendador devuelve TODAS las electivas candidatas, ya
  // rankeadas. Las agrupamos abajo según si alargan o no la carrera.
  const recs = useMemo(
    () => recommendElectives(state.plan, state.approved, Infinity),
    [
      state.plan.pool,
      state.plan.fixed,
      state.plan.start,
      state.plan.maxCred,
      state.plan.maxMat,
      state.plan.avoid,
      state.approved,
    ],
  );

  if (!recs.length) return null;
  const faltan = Math.max(0, ELEC_REQ - elecTotal);

  // 3 grupos: entran sin alargar el plan · lo alargan · no se pueden ubicar.
  const noExtiende = recs.filter((r) => !r.conflict && !r.addsCuatri);
  const extiende = recs.filter((r) => !r.conflict && r.addsCuatri);
  const noEntra = recs.filter((r) => r.conflict);

  const card = (r: Recommendation) => (
    <div
      key={r.m.codigo}
      className={
        "rec-card" +
        (preview === r.m.codigo ? " is-active" : "") +
        (r.conflict ? " is-conf" : "") +
        (r.noHorario ? " is-nohor" : "")
      }
      onMouseEnter={() => !r.conflict && onPreview(r.m.codigo)}
      onMouseLeave={() => onPreview(null)}
    >
      <div className="rec-card__top">
        <span className="rec-card__abbr">{r.m.abbr}</span>
        <span className="rec-card__cr">{r.m.creditos} cr</span>
      </div>
      <p className="rec-card__name">{r.m.nombre}</p>
      <div className="rec-card__fit">
        {r.conflict ? (
          <span className="rec-fit rec-fit--bad">no entra sin conflictos</span>
        ) : (
          <>
            <span className="rec-fit rec-fit--when">
              {cuatriLabel(cuatriAt(start, r.landingIdx))}
            </span>
            <span
              className={
                "rec-fit " + (r.addsCuatri ? "rec-fit--warn" : "rec-fit--ok")
              }
            >
              {r.addsCuatri ? "+1 cuatrimestre" : "sin alargar el plan"}
            </span>
            {r.newDays > 0 && (
              <span className="rec-fit rec-fit--soft">
                +{r.newDays} {r.newDays === 1 ? "día" : "días"}
              </span>
            )}
          </>
        )}
        {r.noHorario && (
          <span className="rec-fit rec-fit--nohor">sin horario</span>
        )}
        {r.area && <span className="rec-card__area">{r.area}</span>}
      </div>
      <div className="rec-card__acts">
        <button
          type="button"
          className="rec-card__add"
          onClick={() => {
            dispatch({ type: "PLAN_POOL_ADD", code: r.m.codigo });
            onPreview(null);
          }}
        >
          + Agregar al plan
        </button>
        <button
          type="button"
          className="rec-card__info"
          onClick={() => dispatch({ type: "OPEN_DRAWER", code: r.m.codigo })}
        >
          detalle
        </button>
      </div>
    </div>
  );

  const group = (
    title: string,
    hint: string,
    items: Recommendation[],
    tone: "ok" | "warn" | "bad",
    open: boolean,
  ) =>
    items.length > 0 ? (
      <details className={"plan2-recgrp plan2-recgrp--" + tone} open={open}>
        <summary>
          <span
            className={"plan2-recgrp__dot plan2-recgrp__dot--" + tone}
            aria-hidden="true"
          />
          <span className="plan2-recgrp__title">{title}</span>
          <span className="plan2-recgrp__count">{items.length}</span>
          <span className="plan2-recgrp__hint">{hint}</span>
        </summary>
        <div className="plan2-recs__grid">{items.map(card)}</div>
      </details>
    ) : null;

  return (
    <div className="plan2-recs">
      <div className="plan2-recs__h">
        <span className="plan2-recs__title">Recomendaciones de electivas</span>
        <span className="plan2-recs__sub">
          {faltan > 0
            ? `Te faltan ${faltan} créditos electivos. Pasá el cursor sobre una para ver dónde entraría.`
            : "Ya cubrís los créditos electivos — estas sumarían extra."}
        </span>
      </div>
      {group(
        "No alargan la carrera",
        "entran en los cuatrimestres del plan actual",
        noExtiende,
        "ok",
        true,
      )}
      {group(
        "Alargan la carrera",
        "suman al menos un cuatrimestre más",
        extiende,
        "warn",
        false,
      )}
      {group(
        "No se pueden ubicar",
        "correlativas, créditos o superposición horaria",
        noEntra,
        "bad",
        false,
      )}
    </div>
  );
}

/* ---------- editor del pool ---------- */
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
      <div className={"pool-item" + (fx !== undefined ? " is-fixed" : "")} key={m.codigo}>
        <span className="pab">{m.abbr}</span>
        <span className="pn">
          {m.nombre}
          <span className="pc">{m.codigo}</span>
          {hasHorario(m.codigo) ? null : (
            <span className="pno-hor">sin horario</span>
          )}
        </span>
        <select
          aria-label={`Fijar cuatrimestre de ${m.nombre}`}
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
            aria-label={`Quitar ${m.nombre} del plan`}
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
          <span className="pool-h__dot pool-h__dot--ob" aria-hidden="true" />
          Obligatorias <i>{obs.length}</i>
        </div>
        <div className="pool-list">
          {obs.length ? (
            obs.map((m) => item(m, true))
          ) : (
            <p className="pool-none">Sin obligatorias pendientes.</p>
          )}
        </div>
      </div>
      <div className="pool-col">
        <div className="pool-h">
          <span className="pool-h__dot pool-h__dot--el" aria-hidden="true" />
          Electivas <i>{els.length}</i>
        </div>
        <div className="pool-add">
          <svg className="pool-add__ic" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            type="text"
            placeholder="Agregar electiva por código o nombre…"
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
            <div className="pool-sugg">
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
                    <span className="sn">
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
                <div className="muted" style={{ padding: "10px 12px" }}>
                  Sin resultados
                </div>
              )}
            </div>
          )}
        </div>
        <div className="pool-list">
          {els.length ? (
            els.map((m) => item(m, true))
          ) : (
            <p className="pool-none">Ninguna electiva agregada todavía.</p>
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
  const approved = state.approved;
  const [preview, setPreview] = useState<string | null>(null);
  const [boardView, setBoardView] = useState<"roadmap" | "calendars">(
    "roadmap",
  );

  const baseR = useMemo(
    () => optimizePlan(PL, approved),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [PL.pool, PL.fixed, PL.start, PL.maxCred, PL.maxMat, PL.avoid, approved],
  );

  const previewR = useMemo(
    () => {
      if (!preview) return null;
      const pool = new Set(PL.pool);
      pool.add(preview);
      return optimizePlan({ ...PL, pool } as PlanState, approved);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [preview, PL.pool, PL.fixed, PL.start, PL.maxCred, PL.maxMat, PL.avoid, approved],
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
  // créditos electivos comprometidos (sin el preview) → para el panel de recos
  const elecCommitted =
    electiveCredits(approved) +
    baseR.items
      .flat()
      .filter((x) => x.m.tipo === "electiva")
      .reduce((s, x) => s + (x.m.creditos || 0), 0);

  // info del preview para el banner
  const previewInfo = useMemo(() => {
    if (!preview || !previewR) return null;
    let idx = -1;
    previewR.items.forEach((it, i) => {
      if (it.some((x) => x.m.codigo === preview)) idx = i;
    });
    return { m: byId.get(preview) ?? null, idx };
  }, [preview, previewR]);

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

  const exportPlan = (format: "pdf" | "html") => {
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
    });
    if (format === "html") downloadHTMLFile(html, "plan-de-cursada.html");
    else openForPrint(html);
  };

  return (
    <section className="view-panel">
      <div className="panel-head">
        <h2>Plan de cursada</h2>
        <p>
          La distribución óptima de las materias que te faltan a lo largo de los
          cuatrimestres —respetando correlativas, créditos y paridad— hasta
          recibirte. Se recalcula sola: agregá electivas o fijá cuatrimestres.
        </p>
      </div>

      {used.length > 0 && (
        <div className="plan2-hero">
          <div className="plan2-hero__lead">
            <span className="plan2-hero__num">{used.length}</span>
            <span className="plan2-hero__unit">
              {used.length === 1 ? "cuatrimestre" : "cuatrimestres"}
              <small>por delante</small>
            </span>
          </div>

          <div className="plan2-hero__divider" aria-hidden="true" />

          <div className="plan2-hero__dest">
            <span className="plan2-hero__destlbl">
              <span className="plan2-hero__cap" aria-hidden="true">🎓</span>
              Te recibís en
            </span>
            <strong>{cuatriName(gradCu)}</strong>
            <div className="plan2-hero__chips">
              <span className="plan2-chip">
                <b>{flat.length}</b> materias
              </span>
              <span className="plan2-chip">
                <b>{totalCred}</b> créditos a cursar
              </span>
              <span className="plan2-chip">
                <b>
                  {elecTotal}/{ELEC_REQ}
                </b>{" "}
                electivos
              </span>
            </div>
          </div>

          <div className="plan2-hero__meter">
            <div className="plan2-meter__top">
              <span className="plan2-meter__lbl">Progreso de créditos</span>
              <span className="plan2-meter__pct">{pct}%</span>
            </div>
            <div className="plan2-meter__bar">
              <i style={{ width: `${pct}%` }} />
            </div>
            <div className="plan2-meter__foot">
              <span><b>{accNow}</b> aprobados</span>
              <span className="plan2-meter__sep">·</span>
              <span>faltan <b>{totalCred}</b></span>
              <span className="plan2-meter__sep">·</span>
              <span>meta <b>{finalCred}</b></span>
            </div>
          </div>
        </div>
      )}

      <div className="plan2-controls">
        <div className="plan2-fieldset">
          <span className="plan2-fieldset__lbl">Punto de partida</span>
          <div className="plan2-field">
            <label htmlFor="pcStart">Empiezo a cursar</label>
            <select
              id="pcStart"
              value={PL.start.parity + "-" + PL.start.year}
              onChange={(e) => {
                const [p, y] = e.target.value.split("-").map(Number);
                dispatch({ type: "SET_PLAN_START", start: { parity: p, year: y } });
              }}
            >
              {startOptions.map((o) => (
                <option value={o.value} key={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="plan2-fieldset">
          <span className="plan2-fieldset__lbl">Carga por cuatrimestre</span>
          <div className="plan2-fieldset__row">
            <NumField
              id="pcMaxCred"
              label="Máx. créditos"
              value={PL.maxCred}
              min={3}
              max={40}
              onCommit={(n) => dispatch({ type: "SET_PLAN_MAXCRED", value: n })}
            />
            <NumField
              id="pcMaxMat"
              label="Máx. materias"
              value={PL.maxMat}
              min={1}
              max={9}
              onCommit={(n) => dispatch({ type: "SET_PLAN_MAXMAT", value: n })}
            />
          </div>
        </div>

        <div className="plan2-fieldset plan2-fieldset--toggle">
          <span className="plan2-fieldset__lbl">Horario</span>
          <button
            type="button"
            className={"cmb-switch" + (PL.avoid ? " on" : "")}
            role="switch"
            aria-checked={PL.avoid}
            onClick={() => dispatch({ type: "SET_PLAN_AVOID", value: !PL.avoid })}
          >
            <span className="cmb-switch__track">
              <span className="cmb-switch__knob" />
            </span>
            Evitar superposiciones
          </button>
        </div>

        <div className="plan2-controls__grow" />

        <div className="plan2-controls__actions">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => dispatch({ type: "PLAN_RESET" })}
          >
            Restablecer
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => exportPlan("html")}
          >
            HTML
          </button>
          <button
            type="button"
            className="btn btn--go btn--sm"
            onClick={() => exportPlan("pdf")}
          >
            Descargar PDF
          </button>
        </div>
      </div>

      {previewInfo && previewInfo.m && (
        <div className="plan2-preview-banner">
          <span className="plan2-preview-banner__dot" aria-hidden="true" />
          <span>
            Vista previa: <b>{previewInfo.m.abbr}</b>{" "}
            {previewInfo.idx >= 0 ? (
              <>
                entraría en <b>{cuatriName(cuatriAt(PL.start, previewInfo.idx))}</b>
              </>
            ) : (
              "no se pudo ubicar en el plan"
            )}
          </span>
        </div>
      )}

      {used.length > 0 ? (
        <div className="plan2-split">
          <div className="plan2-split__main">
            <div className="plan2-boardbar">
              <div
                className="plan2-seg"
                role="tablist"
                aria-label="Vista del plan"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={boardView === "roadmap"}
                  className={
                    "plan2-seg__btn" + (boardView === "roadmap" ? " is-on" : "")
                  }
                  onClick={() => setBoardView("roadmap")}
                >
                  Roadmap
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={boardView === "calendars"}
                  className={
                    "plan2-seg__btn" +
                    (boardView === "calendars" ? " is-on" : "")
                  }
                  onClick={() => setBoardView("calendars")}
                >
                  Calendarios
                </button>
              </div>
              {boardView === "calendars" && (
                <span className="plan2-boardbar__hint">
                  Todos los cuatrimestres, de a dos por fila
                </span>
              )}
            </div>

            <div className="plan2-board">
              {boardView === "calendars" && (
                <div className="plan2-cals">
                  {used.map(({ it, i }) => (
                    <CuatriCalCard
                      key={i}
                      it={it}
                      i={i}
                      start={PL.start}
                      previewCode={preview}
                    />
                  ))}
                </div>
              )}
              {boardView === "roadmap" && (
                <ol className="rmap">
                  {used.map(({ it, i }) => (
                    <RoadmapStop
                      key={i}
                      it={it}
                      i={i}
                      start={PL.start}
                      accBefore={R.accBefore}
                      maxCred={PL.maxCred}
                      previewCode={preview}
                    />
                  ))}
                </ol>
              )}
            </div>
          </div>

          <aside className="plan2-split__side">
            <Recommendations
              start={PL.start}
              elecTotal={elecCommitted}
              onPreview={setPreview}
              preview={preview}
            />
          </aside>
        </div>
      ) : (
        <div className="plan2-board">
          <div className="plan2-empty">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.3">
              <path d="M12 3 2 8l10 5 10-5-10-5Z" />
              <path d="M6 10.5V16c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5v-5.5M22 8v5" />
            </svg>
            <p>Agregá materias al plan para ver tu camino a recibirte.</p>
          </div>
        </div>
      )}

      <p className="plan2-method">{methodText(R, PL)}</p>

      {warns.length > 0 && (
        <div className="plan2-warns">
          <span className="plan2-warns__h">
            Observaciones <i>{warns.length}</i>
          </span>
          {warns.map((w, i) => (
            <div className="plan2-warn" key={i}>
              {w}
            </div>
          ))}
        </div>
      )}

      <details className="plan2-pool" open>
        <summary>
          <span className="plan2-pool__title">Materias del plan</span>
          <span className="plan2-pool__hint">
            agregá electivas y fijá cuatrimestres
          </span>
        </summary>
        <PlanPool start={PL.start} />
      </details>
    </section>
  );
}
