"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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
import { isAsync, slotsConflict, comModalidad } from "@/lib/planner/time";
import {
  optimizePlan,
  cuatriAt,
  cuatriLabel,
  cuatriName,
  OPT_METHODS,
  type OptMethodMeta,
} from "@/lib/planner/optimize";
import { recommendElectives, type Recommendation } from "@/lib/planner/recommend";
import { buildPlanHTML } from "@/lib/planner/exportPlan";
import { serializePreferences, parsePreferences } from "@/lib/planner/persist";
import CursadaCalendar from "@/components/planner/CursadaCalendar";
import MinorsModal from "@/components/planner/MinorsModal";
import {
  IconClose,
  IconPlus,
  IconGraduationCap,
  IconCalendar,
  IconRoute,
  IconFileText,
  IconPrinter,
  IconDownload,
  IconUpload,
  IconGrip,
  IconSliders,
} from "@/components/planner/icons";
import type {
  MateriaM,
  OptMethod,
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

/** Descarga texto plano como archivo. Genérico: lo usan tanto el export del
 *  documento HTML del plan como el export de preferencias (.json). */
function downloadTextFile(text: string, filename: string, mime: string) {
  if (typeof document === "undefined") return;
  const blob = new Blob([text], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

function downloadHTMLFile(html: string, filename: string) {
  downloadTextFile(html, filename, "text/html");
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
  PL: { method: OptMethod; maxCred: number; maxMat: number; avoid: boolean },
) {
  const meta = OPT_METHODS.find((m) => m.key === PL.method);
  const objetivo = meta?.objetivo ?? "minimizar la cantidad de cuatrimestres";
  return (
    <>
      <b>Optimización aplicada.</b> Objetivo: {objetivo} Orden de prioridad:
      obligatorias · camino crítico de correlativas · más créditos · mayor
      requisito de créditos. Las comisiones se eligen para concentrar la
      cursada en menos días en el campus. Restricciones respetadas: paridad
      1.º/2.º cuatrimestre · correlativas · créditos requeridos
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
        blocks.push({ ...s, abbr: x.m.abbr, nombre: x.m.nombre, codigo: x.m.codigo, color });
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

/* ---------- override compacto de "máx. créditos / máx. materias" por cuatri ----------
 * Compartido entre RoadmapStop y el header de CuatriCalCard: cerrado por default
 * (no ensucia la tarjeta), con fallback visual al valor global cuando no hay
 * override. `idPrefix` evita colisión de ids entre las dos vistas. */
function CuatriCaps({
  i,
  idPrefix,
  globalCred,
  globalMat,
}: {
  i: number;
  idPrefix: string;
  globalCred: number;
  globalMat: number;
}) {
  const { state, dispatch } = usePlanner();
  const capCred = state.plan.capCredByIdx.get(i);
  const capMat = state.plan.capMatByIdx.get(i);
  const isCapped = capCred !== undefined || capMat !== undefined;

  return (
    <details className={"rmap-caps" + (isCapped ? " is-capped" : "")}>
      <summary className="rmap-caps__summary">
        <IconSliders size={11} />
        Límites de este cuatri
        {isCapped && <span className="rmap-caps__dot" aria-hidden="true" />}
      </summary>
      <div className="rmap-caps__body">
        <NumField
          id={`${idPrefix}CapCred${i}`}
          label="Máx. créditos"
          value={capCred ?? globalCred}
          min={3}
          max={40}
          onCommit={(n) =>
            dispatch({ type: "SET_PLAN_CAP_CRED", idx: i, value: n })
          }
        />
        <NumField
          id={`${idPrefix}CapMat${i}`}
          label="Máx. materias"
          value={capMat ?? globalMat}
          min={1}
          max={9}
          onCommit={(n) =>
            dispatch({ type: "SET_PLAN_CAP_MAT", idx: i, value: n })
          }
        />
        <button
          type="button"
          className="rmap-caps__auto"
          disabled={!isCapped}
          onClick={() => {
            dispatch({ type: "SET_PLAN_CAP_CRED", idx: i, value: null });
            dispatch({ type: "SET_PLAN_CAP_MAT", idx: i, value: null });
          }}
        >
          auto
        </button>
      </div>
    </details>
  );
}

/* ---------- tarjeta de calendario (panorama de cuatrimestres) ---------- */
function CuatriCalCard({
  it,
  i,
  start,
  previewCode,
  maxCred,
  maxMat,
}: {
  it: PlacedMateria[];
  i: number;
  start: PlanStart;
  previewCode: string | null;
  maxCred: number;
  maxMat: number;
}) {
  const { state, dispatch } = usePlanner();
  const cu = cuatriAt(start, i);
  const { blocks, asyncs, campusDays } = useMemo(
    () => computeCuatriBlocks(it),
    [it],
  );
  const cred = it.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const hasPreview = it.some((x) => x.m.codigo === previewCode);
  const isCapped =
    state.plan.capCredByIdx.has(i) || state.plan.capMatByIdx.has(i);

  return (
    <div
      className={
        "cal-card" +
        (hasPreview ? " has-preview" : "") +
        (isCapped ? " is-capped" : "")
      }
    >
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
        <CuatriCaps
          i={i}
          idPrefix="cal"
          globalCred={maxCred}
          globalMat={maxMat}
        />
      </div>
      {blocks.length ? (
        <CursadaCalendar
          blocks={blocks}
          days={DAYS}
          compact
          onBlockClick={(code) => dispatch({ type: "OPEN_DRAWER", code })}
        />
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
  maxMat,
  previewCode,
}: {
  it: PlacedMateria[];
  i: number;
  start: PlanStart;
  accBefore: number[];
  maxCred: number;
  maxMat: number;
  previewCode: string | null;
}) {
  const { state, dispatch } = usePlanner();
  const cu = cuatriAt(start, i);

  // Drag & drop para mover materias entre cuatrimestres. El código de la materia
  // arrastrada viaja por dataTransfer (cross-stop); el estado local sólo pinta
  // la materia en curso (is-dragging) y resalta este stop como destino (drop-over).
  const [draggingCode, setDraggingCode] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // sólo necesitamos los días de campus para el ledger; la grilla semanal
  // detallada vive en la pestaña "Calendarios".
  const { campusDays } = useMemo(() => computeCuatriBlocks(it), [it]);

  const cred = it.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const acc = accBefore[i] + cred;
  const load = Math.min(100, Math.round((cred / Math.max(1, maxCred)) * 100));
  const hasPreview = it.some((x) => x.m.codigo === previewCode);
  const isCapped =
    state.plan.capCredByIdx.has(i) || state.plan.capMatByIdx.has(i);

  return (
    <li
      className={
        "rmap-stop" +
        (hasPreview ? " has-preview" : "") +
        (dragOver ? " drop-over" : "") +
        (isCapped ? " is-capped" : "")
      }
    >
      <div
        className="rmap-stop__card"
        onDragOver={(e: React.DragEvent) => {
          // permite el drop y marca este cuatrimestre como destino activo
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          if (!dragOver) setDragOver(true);
        }}
        onDragLeave={(e: React.DragEvent) => {
          // sólo apagamos el resalte al salir de la tarjeta (no en los hijos)
          if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setDragOver(false);
          }
        }}
        onDrop={(e: React.DragEvent) => {
          e.preventDefault();
          const code = e.dataTransfer.getData("text/plain");
          if (code) dispatch({ type: "PLAN_SET_FIXED", code, idx: i });
          setDragOver(false);
        }}
      >
        <div className="rmap-stop__head">
          <div className="rmap-stop__when">
            <span className="rmap-stop__tag">{cuatriLabel(cu)}</span>
            <h3>{cuatriName(cu)}</h3>
          </div>
          <span className="rmap-stop__step" aria-hidden="true">
            {i + 1}
          </span>
          <span className="rmap-drophint">
            arrastrá para mover de cuatrimestre
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

        <CuatriCaps
          i={i}
          idPrefix="rmap"
          globalCred={maxCred}
          globalMat={maxMat}
        />

        <div className="rmap-stop__load" aria-hidden="true">
          <i style={{ width: `${load}%` }} />
        </div>

        <div className="rmap-stop__mats">
          {it.map((x, k) => {
            const isPrev = x.m.codigo === previewCode;
            const fx = state.plan.fixed.get(x.m.codigo);
            return (
              <div
                key={x.m.codigo}
                className={
                  "rmap-mat" +
                  (isPrev ? " is-preview" : "") +
                  (draggingCode === x.m.codigo ? " is-dragging" : "")
                }
                style={
                  { "--blk": PALETTE[k % PALETTE.length] } as React.CSSProperties
                }
                title={`${x.m.codigo} · ${x.m.nombre} — arrastrá para mover de cuatrimestre`}
              >
                <button
                  type="button"
                  className="rmap-mat__main"
                  draggable
                  onDragStart={(e: React.DragEvent) => {
                    e.dataTransfer.setData("text/plain", x.m.codigo);
                    e.dataTransfer.effectAllowed = "move";
                    setDraggingCode(x.m.codigo);
                  }}
                  onDragEnd={() => setDraggingCode(null)}
                  onClick={() =>
                    dispatch({ type: "OPEN_DRAWER", code: x.m.codigo })
                  }
                >
                  <span className="rmap-mat__grip" aria-hidden="true">
                    <IconGrip size={12} />
                  </span>
                  <span className="rmap-mat__abbr">{x.m.abbr}</span>
                  <span className="rmap-mat__cr">{x.m.creditos}</span>
                  {isPrev && <span className="rmap-mat__new">nueva</span>}
                </button>
                <div
                  className="rmap-mat__tools"
                  draggable={false}
                  onMouseDown={(e) => e.stopPropagation()}
                  onClick={(e) => e.stopPropagation()}
                >
                  <select
                    className="rmap-mat__sel"
                    aria-label={`Fijar cuatrimestre de ${x.m.nombre}`}
                    value={fx === undefined ? "" : String(fx)}
                    onChange={(e) =>
                      dispatch({
                        type: "PLAN_SET_FIXED",
                        code: x.m.codigo,
                        idx: e.target.value === "" ? null : +e.target.value,
                      })
                    }
                  >
                    <option value="">auto</option>
                    {Array.from({ length: 8 }, (_, ci) => (
                      <option value={String(ci)} key={ci}>
                        {cuatriLabel(cuatriAt(start, ci))}
                      </option>
                    ))}
                  </select>
                  {x.m.horario && x.m.horario.comisiones.length > 1 && (
                    <select
                      className="rmap-mat__sel"
                      aria-label={`Fijar comisión de ${x.m.nombre}`}
                      value={state.fixedCom.get(x.m.codigo) || ""}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_FIXED_COM",
                          code: x.m.codigo,
                          comision: e.target.value || null,
                        })
                      }
                    >
                      <option value="">com. auto</option>
                      {x.m.horario.comisiones.map((c) => (
                        <option value={c.comision} key={c.comision}>
                          com {c.comision} · {comModalidad(c)}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    className="rmap-mat__rm"
                    aria-label={`Quitar ${x.m.nombre} del plan`}
                    onClick={() =>
                      dispatch({ type: "PLAN_POOL_REMOVE", code: x.m.codigo })
                    }
                  >
                    <IconClose size={13} />
                  </button>
                </div>
              </div>
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
  recs,
  onPreview,
  preview,
}: {
  start: PlanStart;
  elecTotal: number;
  recs: Recommendation[];
  onPreview: (code: string | null) => void;
  preview: string | null;
}) {
  const { dispatch } = usePlanner();

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
      <p className="rec-card__name" title={r.m.nombre}>
        {r.m.nombre}
      </p>
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
          <IconPlus size={13} /> Agregar al plan
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

  // No volcamos todas las electivas de un grupo de golpe (con 0 aprobadas
  // "No alargan la carrera" trae ~88 → un muro infinito). Mostramos las
  // primeras y el resto detrás de un "ver más" (sin estado: <details>).
  const HEAD = 12;
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
        <div className="plan2-recs__grid">{items.slice(0, HEAD).map(card)}</div>
        {items.length > HEAD && (
          <details className="plan2-recmore">
            <summary>Ver {items.length - HEAD} electivas más</summary>
            <div className="plan2-recs__grid">{items.slice(HEAD).map(card)}</div>
          </details>
        )}
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
        {m.horario && m.horario.comisiones.length > 1 && (
          <select
            aria-label={`Fijar comisión de ${m.nombre}`}
            value={state.fixedCom.get(m.codigo) || ""}
            onChange={(e) =>
              dispatch({
                type: "SET_FIXED_COM",
                code: m.codigo,
                comision: e.target.value || null,
              })
            }
          >
            <option value="">com. auto</option>
            {m.horario.comisiones.map((c) => (
              <option value={c.comision} key={c.comision}>
                com {c.comision} · {comModalidad(c)}
              </option>
            ))}
          </select>
        )}
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
            <IconClose size={12} />
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
  // el panorama de calendarios es la vista default (más útil de un vistazo
  // que el roadmap para chequear superposiciones y días en el campus).
  const [boardView, setBoardView] = useState<"roadmap" | "calendars">(
    "calendars",
  );
  const [minorsOpen, setMinorsOpen] = useState(false);
  const [recsHidden, setRecsHidden] = useState(false);

  // sin límite: el recomendador devuelve TODAS las electivas candidatas, ya
  // rankeadas. Recommendations las agrupa según si alargan o no la carrera.
  const recs = useMemo(
    () => recommendElectives(PL, approved, Infinity, state.fixedCom),
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

  /* ---- export/import de PREFERENCIAS (distinto del export del documento del
   * plan de arriba): un .json portable con todo el estado persistible, para
   * llevarlo a otro navegador o guardarlo como plantilla. ---- */
  const fileInputRef = useRef<HTMLInputElement | null>(null);
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
              <span className="plan2-hero__cap" aria-hidden="true">
                <IconGraduationCap size={15} />
              </span>
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

        <div className="plan2-fieldset">
          <span className="plan2-fieldset__lbl">
            <IconSliders size={13} className="plan2-fieldset__ic" />
            Método
          </span>
          <div
            className="plan2-methodseg"
            role="radiogroup"
            aria-label="Método de optimización del plan"
          >
            {OPT_METHODS.map((m: OptMethodMeta) => (
              <button
                key={m.key}
                type="button"
                role="radio"
                aria-checked={PL.method === m.key}
                title={m.objetivo}
                className={
                  "plan2-methodseg__btn" +
                  (PL.method === m.key ? " is-on" : "")
                }
                onClick={() =>
                  dispatch({ type: "SET_PLAN_METHOD", value: m.key })
                }
              >
                {m.short}
              </button>
            ))}
          </div>
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

          <div className="plan2-actgrp" role="group" aria-label="Exportar el plan">
            <span className="plan2-actgrp__lbl">Plan</span>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => exportPlan("html")}
            >
              <IconFileText size={13} /> HTML
            </button>
            <button
              type="button"
              className="btn btn--go btn--sm"
              onClick={() => exportPlan("pdf")}
            >
              <IconPrinter size={13} /> Descargar PDF
            </button>
          </div>

          <div className="plan2-actgrp" role="group" aria-label="Preferencias del planner">
            <span className="plan2-actgrp__lbl">Preferencias</span>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={exportPrefs}
            >
              <IconDownload size={13} /> Exportar
            </button>
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <IconUpload size={13} /> Importar
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              hidden
              onChange={importPrefsFromFile}
            />
          </div>

          {prefsError && (
            <span className="plan2-prefs-err" role="alert">
              {prefsError}
            </span>
          )}
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
        <div
          className={
            "plan2-split" +
            (recsHidden || !recs.length ? " plan2-split--solo" : "")
          }
        >
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
                  <IconRoute size={14} /> Roadmap
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
                  <IconCalendar size={14} /> Calendarios
                </button>
              </div>
              {boardView === "calendars" && (
                <span className="plan2-boardbar__hint">
                  Todos los cuatrimestres de un vistazo
                </span>
              )}
              <span className="plan2-boardbar__grow" />
              <button
                type="button"
                className="plan2-minors-btn"
                onClick={() => setMinorsOpen(true)}
              >
                <span className="plan2-minors-btn__dots" aria-hidden="true">
                  <i style={{ background: "#85a2c2" }} />
                  <i style={{ background: "#c592ab" }} />
                  <i style={{ background: "#a9b27e" }} />
                  <i style={{ background: "#a497c0" }} />
                </span>
                Minors por cuatrimestre
              </button>
              {recs.length > 0 && (
                <button
                  type="button"
                  className="plan2-recs-toggle"
                  aria-pressed={recsHidden}
                  onClick={() => setRecsHidden((v) => !v)}
                >
                  {recsHidden ? "Mostrar electivas" : "Ocultar electivas"}
                </button>
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
                      maxCred={PL.maxCred}
                      maxMat={PL.maxMat}
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
                      maxMat={PL.maxMat}
                      previewCode={preview}
                    />
                  ))}
                </ol>
              )}
            </div>
          </div>

          {!recsHidden && recs.length > 0 && (
            <aside className="plan2-split__side">
              <Recommendations
                start={PL.start}
                elecTotal={elecCommitted}
                recs={recs}
                onPreview={setPreview}
                preview={preview}
              />
            </aside>
          )}
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

      {minorsOpen && (
        <MinorsModal
          used={used}
          start={PL.start}
          approved={approved}
          onClose={() => setMinorsOpen(false)}
        />
      )}
    </section>
  );
}
