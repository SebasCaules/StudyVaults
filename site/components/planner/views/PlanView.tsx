"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import {
  openForPrint,
  downloadHTMLFile,
  downloadTextFile,
} from "@/lib/planner/download";
import { serializePreferences, parsePreferences } from "@/lib/planner/persist";
import { MINORS, MINOR_REQ, minorsOf } from "@/lib/planner/minors";
import { CommissionSelect } from "@studyvaults/ui";
import CursadaCalendar from "@/components/planner/CursadaCalendar";
import MinorsModal from "@/components/planner/MinorsModal";
import { MinorBadge } from "@/components/planner/MinorBadge";
import IOModal, { type IOCuatri } from "@/components/planner/IOModal";
import {
  IconClose,
  IconPlus,
  IconGraduationCap,
  IconCalendar,
  IconRoute,
  IconDownload,
  IconGrip,
  IconSliders,
  IconRotateCcw,
  IconLayers,
  IconFileText,
  IconCheck,
  type IconProps,
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
import "@/components/planner/planview.css";

const ELEC_REQ = PLAN.creditosElectivasReq ?? 27;

/* ---------- iconos locales (no existen en icons.tsx) ---------- */
const IconDots = ({ size = 16, ...rest }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="currentColor"
    aria-hidden="true"
    {...rest}
  >
    <circle cx="5" cy="12" r="1.9" />
    <circle cx="12" cy="12" r="1.9" />
    <circle cx="19" cy="12" r="1.9" />
  </svg>
);
const IconLock = ({ size = 15, ...rest }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </svg>
);
const IconUnlock = ({ size = 15, ...rest }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 7.5-1.3" />
  </svg>
);
const IconWarnTri = ({ size = 21, ...rest }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    {...rest}
  >
    <path d="M12 3.6 21 19.2H3L12 3.6Z" />
    <path d="M12 9.6v4.2" />
    <circle cx="12" cy="16.6" r="0.9" fill="currentColor" stroke="none" />
  </svg>
);

/* ---------- helpers de dominio ---------- */
/** ¿mostramos el tag "recomendada"? Electiva que aporta a un minor, con el
 *  recomendador encendido (el dot de minor se muestra siempre; el tag lo
 *  gatea el toggle, igual que `body.rec-on .rec-tag` del mockup). */
const isRecTagged = (m: MateriaM, recOn: boolean) =>
  recOn && m.tipo === "electiva" && minorsOf(m.areas).length > 0;

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

/* ---------- dot(s) de minor de una materia ---------- */
function MinorDots({ m }: { m: MateriaM }) {
  const minors = minorsOf(m.areas);
  if (!minors.length) return null;
  return (
    <span className="rmap-mat__minor">
      {minors.map((mn) => (
        <MinorBadge key={mn.id} minor={mn} variant="dot" />
      ))}
    </span>
  );
}

/* ---------- override compacto "máx. créditos / máx. materias" por cuatri ----
 * Usado en RoadmapStop (cerrado por default, no ensucia la tarjeta) con
 * fallback visual al valor global cuando no hay override. */
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

/* ========================================================================= */
/* ---------- tarjeta de cuatrimestre (tab Calendario) ---------- */
function SemCard({
  it,
  i,
  start,
  previewCode,
  maxCred,
  maxMat,
  recOn,
  locked,
  onFinalize,
  onUnlock,
  onDownload,
}: {
  it: PlacedMateria[];
  i: number;
  start: PlanStart;
  previewCode: string | null;
  maxCred: number;
  maxMat: number;
  recOn: boolean;
  locked: boolean;
  onFinalize: (idx: number) => void;
  onUnlock: (idx: number) => void;
  onDownload: (idx: number, scope: "cal" | "both" | "programa") => void;
}) {
  const { state, dispatch } = usePlanner();
  const cu = cuatriAt(start, i);
  const { blocks, asyncs, campusDays } = useMemo(
    () => computeCuatriBlocks(it),
    [it],
  );
  const cred = it.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const hasPreview = it.some((x) => x.m.codigo === previewCode);
  const capCred = state.plan.capCredByIdx.get(i);
  const capMat = state.plan.capMatByIdx.get(i);
  const isCapped = capCred !== undefined || capMat !== undefined;
  const effCred = capCred ?? maxCred;
  const load = Math.min(100, Math.round((cred / Math.max(1, effCred)) * 100));
  const electivas = it.filter((x) => x.m.tipo === "electiva");

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement | null>(null);

  // DnD: arrastrar una electiva de esta card y soltarla en otro cuatri fija su
  // ubicación (deja de ser "auto"). Mismo contrato que el Roadmap: el código
  // viaja por dataTransfer; el estado local sólo pinta origen/destino.
  const [dragOver, setDragOver] = useState(false);
  const [draggingCode, setDraggingCode] = useState<string | null>(null);

  useEffect(() => {
    if (!menuOpen && !confirmOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setConfirmOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setConfirmOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, confirmOpen]);

  return (
    <article
      className={
        "pv-sem" +
        (hasPreview ? " is-preview" : "") +
        (isCapped ? " is-capped" : "") +
        (locked ? " is-locked" : "") +
        (dragOver ? " is-drop-over" : "") +
        (menuOpen || confirmOpen ? " is-menu-open" : "")
      }
      onDragOver={(e: React.DragEvent) => {
        // permitimos el drop y marcamos esta card como destino activo
        if (!e.dataTransfer.types.includes("text/plain")) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (!dragOver) setDragOver(true);
      }}
      onDragLeave={(e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false);
      }}
      onDrop={(e: React.DragEvent) => {
        e.preventDefault();
        const code = e.dataTransfer.getData("text/plain");
        if (code) dispatch({ type: "PLAN_SET_FIXED", code, idx: i });
        setDragOver(false);
      }}
    >
      {dragOver && (
        <div className="pv-sem__drophint" aria-hidden="true">
          <span>soltar acá · fija en {cuatriName(cu)}</span>
        </div>
      )}
      <div className="pv-sem__head">
        <div className="pv-sem__when">
          <span className="pv-sem__tag">{cuatriLabel(cu)}</span>
          <span className="pv-sem__title">{cuatriName(cu)}</span>
        </div>
        <div className="pv-sem__tools" ref={toolsRef}>
          {locked && (
            <span className="pv-lockbadge" title="Cuatrimestre finalizado">
              <IconLock size={15} />
            </span>
          )}
          <button
            type="button"
            className="pv-dotbtn"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={`Opciones de ${cuatriName(cu)}`}
            onClick={() => {
              setConfirmOpen(false);
              setMenuOpen((v) => !v);
            }}
          >
            <IconDots size={16} />
          </button>

          {menuOpen && (
            <div className="pv-menu" role="menu">
              {!locked && (
                <>
                  <div className="pv-menu__sec">
                    <span className="pv-menu__lbl">
                      <IconSliders size={11} /> Límites de este cuatri
                    </span>
                    <div className="pv-menu__caps">
                      <NumField
                        id={`semCapCred${i}`}
                        label="Máx. créditos"
                        value={capCred ?? maxCred}
                        min={3}
                        max={40}
                        onCommit={(n) =>
                          dispatch({
                            type: "SET_PLAN_CAP_CRED",
                            idx: i,
                            value: n,
                          })
                        }
                      />
                      <NumField
                        id={`semCapMat${i}`}
                        label="Máx. materias"
                        value={capMat ?? maxMat}
                        min={1}
                        max={9}
                        onCommit={(n) =>
                          dispatch({
                            type: "SET_PLAN_CAP_MAT",
                            idx: i,
                            value: n,
                          })
                        }
                      />
                      <button
                        type="button"
                        className="pv-menu__auto"
                        disabled={!isCapped}
                        onClick={() => {
                          dispatch({
                            type: "SET_PLAN_CAP_CRED",
                            idx: i,
                            value: null,
                          });
                          dispatch({
                            type: "SET_PLAN_CAP_MAT",
                            idx: i,
                            value: null,
                          });
                        }}
                      >
                        auto
                      </button>
                    </div>
                  </div>
                  <hr className="pv-menu__sep" />
                </>
              )}

              <button
                type="button"
                role="menuitem"
                className="pv-menu__item"
                onClick={() => {
                  if (locked) {
                    onUnlock(i);
                    setMenuOpen(false);
                  } else {
                    setMenuOpen(false);
                    setConfirmOpen(true);
                  }
                }}
              >
                {locked ? <IconUnlock size={15} /> : <IconLock size={15} />}
                {locked ? "Desbloquear cuatrimestre" : "Finalizar cuatrimestre"}
              </button>

              <hr className="pv-menu__sep" />

              <div className="pv-menu__dl">
                <span className="pv-menu__lbl">
                  <IconDownload size={11} /> Descargar este calendario
                </span>
                <button
                  type="button"
                  role="menuitem"
                  className="pv-menu__item"
                  onClick={() => {
                    onDownload(i, "cal");
                    setMenuOpen(false);
                  }}
                >
                  <IconCalendar size={15} /> Solo calendario
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="pv-menu__item"
                  onClick={() => {
                    onDownload(i, "both");
                    setMenuOpen(false);
                  }}
                >
                  <IconLayers size={15} /> Calendario + programa
                </button>
                <button
                  type="button"
                  role="menuitem"
                  className="pv-menu__item"
                  onClick={() => {
                    onDownload(i, "programa");
                    setMenuOpen(false);
                  }}
                >
                  <IconFileText size={15} /> Solo programa
                </button>
              </div>
            </div>
          )}

          {confirmOpen && !locked && (
            <div className="pv-confirm-pop" role="dialog" aria-label="Finalizar cuatrimestre">
              <p className="pv-confirm-pop__t">¿Finalizar {cuatriName(cu)}?</p>
              <p className="pv-confirm-pop__b">
                El optimizador dejará de tocar este cuatrimestre mientras iterás
                el resto. Podés desbloquearlo cuando quieras.
              </p>
              <div className="pv-confirm-pop__acts">
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setConfirmOpen(false)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn--go btn--sm"
                  onClick={() => {
                    onFinalize(i);
                    setConfirmOpen(false);
                  }}
                >
                  Finalizar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {electivas.length > 0 && (
        <div className="pv-sem__els">
          {electivas.map((x) => (
            <div
              className={
                "pv-elrow" +
                (draggingCode === x.m.codigo ? " is-dragging" : "")
              }
              key={x.m.codigo}
              draggable={!locked}
              onDragStart={(e: React.DragEvent) => {
                e.dataTransfer.setData("text/plain", x.m.codigo);
                e.dataTransfer.effectAllowed = "move";
                setDraggingCode(x.m.codigo);
              }}
              onDragEnd={() => setDraggingCode(null)}
              title={
                locked
                  ? x.m.nombre
                  : `${x.m.nombre} — arrastrá a otro cuatrimestre para fijarla`
              }
            >
              {!locked && (
                <span className="pv-elrow__grip" aria-hidden="true">
                  <IconGrip size={12} />
                </span>
              )}
              <MinorDots m={x.m} />
              <span className="pv-elrow__abbr">{x.m.abbr}</span>
              {isRecTagged(x.m, recOn) && (
                <span className="pv-rectag">recomendada</span>
              )}
              <span className="pv-elrow__cr">{x.m.creditos} cr</span>
            </div>
          ))}
        </div>
      )}

      <div className="pv-sem__cal">
        {blocks.length ? (
          <CursadaCalendar
            blocks={blocks}
            days={DAYS}
            compact
            onBlockClick={(code) => dispatch({ type: "OPEN_DRAWER", code })}
          />
        ) : (
          <p className="pv-sem__empty">Sólo materias sin grilla semanal.</p>
        )}
        <AsyncRow asyncs={asyncs} />
      </div>

      <div className="pv-sem__foot">
        <div className="pv-loadbar" aria-hidden="true">
          <i style={{ width: `${load}%` }} />
        </div>
        <div className="pv-load-meta">
          <span className="cr">
            {cred} cr · {it.length} {it.length === 1 ? "materia" : "mat."}
            {campusDays > 0 && (
              <>
                {" · "}
                {campusDays} {campusDays === 1 ? "día" : "días"}
              </>
            )}
          </span>
          {!locked && <span className="aux">tope {effCred} cr</span>}
        </div>
        {locked && (
          <div className="pv-lockcap">
            <span className="pv-lockchip">
              <IconLock size={12} />
              <b>finalizado</b> · el optimizador no lo toca
            </span>
            <button
              type="button"
              className="pv-unlock"
              onClick={() => onUnlock(i)}
            >
              <IconUnlock size={11} /> Desbloquear
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

/* ---------- una parada del roadmap (editable, con drag & drop) ---------- */
function RoadmapStop({
  it,
  i,
  start,
  accBefore,
  maxCred,
  maxMat,
  previewCode,
  recOn,
}: {
  it: PlacedMateria[];
  i: number;
  start: PlanStart;
  accBefore: number[];
  maxCred: number;
  maxMat: number;
  previewCode: string | null;
  recOn: boolean;
}) {
  const { state, dispatch } = usePlanner();
  const cu = cuatriAt(start, i);

  // Drag & drop para mover materias entre cuatrimestres. El código de la materia
  // arrastrada viaja por dataTransfer (cross-stop); el estado local sólo pinta
  // la materia en curso (is-dragging) y resalta este stop como destino (drop-over).
  const [draggingCode, setDraggingCode] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  // sólo necesitamos los días de campus para el ledger; la grilla semanal
  // detallada vive en la pestaña "Calendario".
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
                  <MinorDots m={x.m} />
                  <span className="rmap-mat__cr">{x.m.creditos}</span>
                  {isRecTagged(x.m, recOn) && (
                    <span className="rmap-mat__rec">rec</span>
                  )}
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
                    <CommissionSelect
                      size="sm"
                      placeholder="com. auto"
                      aria-label={`Fijar comisión de ${x.m.nombre}`}
                      value={state.fixedCom.get(x.m.codigo) || ""}
                      onChange={(e) =>
                        dispatch({
                          type: "SET_FIXED_COM",
                          code: x.m.codigo,
                          comision: e.target.value || null,
                        })
                      }
                      options={x.m.horario.comisiones.map((c) => ({
                        value: c.comision,
                        label: `com ${c.comision} · ${comModalidad(c)}`,
                      }))}
                    />
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
        <div className="pv-reset">
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

/* ---------- recomendaciones de electivas ---------- */
function Recommendations({
  start,
  elecTotal,
  recs,
  onPreview,
  preview,
  onHide,
}: {
  start: PlanStart;
  elecTotal: number;
  recs: Recommendation[];
  onPreview: (code: string | null) => void;
  preview: string | null;
  onHide?: () => void;
}) {
  const { dispatch } = usePlanner();

  // ---- filtros del recomendador (por minor/área · régimen · disponibilidad) ----
  const [fMinor, setFMinor] = useState<string[]>([]);
  const [fParity, setFParity] = useState<number[]>([]);
  const [fHorario, setFHorario] = useState(false);
  const toggleIn = <T,>(arr: T[], v: T) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
  const anyFilter = fMinor.length > 0 || fParity.length > 0 || fHorario;
  const clearFilters = () => {
    setFMinor([]);
    setFParity([]);
    setFHorario(false);
  };

  if (!recs.length) return null;
  const faltan = Math.max(0, ELEC_REQ - elecTotal);

  const passesFilter = (r: Recommendation) => {
    if (fMinor.length) {
      const ids = minorsOf(r.m.areas).map((mn) => mn.id);
      if (!fMinor.some((id) => ids.includes(id))) return false;
    }
    // paridad null = indistinta (entra con cualquier régimen elegido)
    if (fParity.length && r.m.parity !== null && !fParity.includes(r.m.parity))
      return false;
    if (fHorario && !hasHorario(r.m.codigo)) return false;
    return true;
  };
  const fRecs = anyFilter ? recs.filter(passesFilter) : recs;

  // 3 grupos: entran sin alargar el plan · lo alargan · no se pueden ubicar.
  const noExtiende = fRecs.filter((r) => !r.conflict && !r.addsCuatri);
  const extiende = fRecs.filter((r) => !r.conflict && r.addsCuatri);
  const noEntra = fRecs.filter((r) => r.conflict);

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
          <IconPlus size={13} /> Agregar
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
        <div className="plan2-recs__hrow">
          <span className="plan2-recs__title">Recomendaciones de electivas</span>
          {onHide && (
            <button
              type="button"
              className="plan2-recs__collapse"
              aria-label="Ocultar recomendaciones de electivas"
              title="Ocultar electivas"
              onClick={onHide}
            >
              <svg
                viewBox="0 0 24 24"
                width="15"
                height="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                aria-hidden="true"
              >
                <path
                  d="M9.5 6.5 15 12l-5.5 5.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </div>
        <span className="plan2-recs__sub">
          {faltan > 0
            ? `Te faltan ${faltan} créditos electivos. Pasá el cursor sobre una para ver dónde entraría.`
            : "Ya cubrís los créditos electivos — estas sumarían extra."}
        </span>
      </div>

      <div className="plan2-recfilt" role="group" aria-label="Filtrar electivas">
        <div className="plan2-recfilt__grp">
          <span className="plan2-recfilt__lbl">Minor</span>
          {MINORS.map((mn) => {
            const on = fMinor.includes(mn.id);
            return (
              <button
                key={mn.id}
                type="button"
                className={"plan2-fchip" + (on ? " is-on" : "")}
                aria-pressed={on}
                title={mn.name}
                style={{ ["--fchip-color" as string]: mn.color }}
                onClick={() => setFMinor((a) => toggleIn(a, mn.id))}
              >
                <span className="plan2-fchip__dot" aria-hidden="true" />
                {mn.short}
              </button>
            );
          })}
        </div>
        <div className="plan2-recfilt__grp">
          <span className="plan2-recfilt__lbl">Régimen</span>
          {[
            { v: 1, l: "1.º cuatri" },
            { v: 2, l: "2.º cuatri" },
          ].map((o) => {
            const on = fParity.includes(o.v);
            return (
              <button
                key={o.v}
                type="button"
                className={"plan2-fchip" + (on ? " is-on" : "")}
                aria-pressed={on}
                onClick={() => setFParity((a) => toggleIn(a, o.v))}
              >
                {o.l}
              </button>
            );
          })}
        </div>
        <div className="plan2-recfilt__grp">
          <span className="plan2-recfilt__lbl">Disponibilidad</span>
          <button
            type="button"
            className={"plan2-fchip" + (fHorario ? " is-on" : "")}
            aria-pressed={fHorario}
            onClick={() => setFHorario((v) => !v)}
          >
            con horario
          </button>
        </div>
        {anyFilter && (
          <button
            type="button"
            className="plan2-recfilt__clear"
            onClick={clearFilters}
          >
            <IconClose size={11} /> Limpiar
          </button>
        )}
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
      {anyFilter && fRecs.length === 0 && (
        <p className="plan2-recfilt__empty">
          Ninguna electiva coincide con los filtros.{" "}
          <button type="button" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </p>
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
          <CommissionSelect
            size="sm"
            placeholder="com. auto"
            aria-label={`Fijar comisión de ${m.nombre}`}
            value={state.fixedCom.get(m.codigo) || ""}
            onChange={(e) =>
              dispatch({
                type: "SET_FIXED_COM",
                code: m.codigo,
                comision: e.target.value || null,
              })
            }
            options={m.horario.comisiones.map((c) => ({
              value: c.comision,
              label: `com ${c.comision} · ${comModalidad(c)}`,
            }))}
          />
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
type PlanTab = "cal" | "road" | "min";

export default function PlanView() {
  const { state, dispatch } = usePlanner();
  const PL = state.plan;
  const approved = state.approved;
  const [preview, setPreview] = useState<string | null>(null);
  // el calendario es la vista default (más útil de un vistazo que el roadmap
  // para chequear superposiciones y días en el campus).
  const [tab, setTab] = useState<PlanTab>("cal");
  const [minorsOpen, setMinorsOpen] = useState(false);
  const [recsHidden, setRecsHidden] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);

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
    });
    openForPrint(html);
  };

  // Finalizar un cuatrimestre: fija su ubicación actual (para que el optimizador
  // la respete tal cual) y lo marca como lockeado. Pre-fijamos desde baseR
  // porque `state.plan.result` no está poblado (ver REPORTE/gaps): así el lock
  // es funcional aunque el reducer no encuentre `result.items[idx]`.
  const finalizeCuatri = (idx: number) => {
    (baseR.items[idx] ?? []).forEach((x) =>
      dispatch({ type: "PLAN_SET_FIXED", code: x.m.codigo, idx }),
    );
    dispatch({ type: "PLAN_TOGGLE_LOCK", idx });
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

  const recOn = !recsHidden;
  const showSide = recOn && recs.length > 0 && tab !== "min";
  const showPreviewSlot =
    used.length > 0 && recs.length > 0 && recOn && tab !== "min";

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
          <div className="pv-banner__top">
            <div className="pv-stat">
              <span className="pv-stat__num">{used.length}</span>
              <span className="pv-stat__txt">
                <span className="lead">
                  {used.length === 1 ? "cuatrimestre" : "cuatrimestres"}
                </span>
                <span className="sub">por delante</span>
              </span>
            </div>
            <div className="pv-grad">
              <IconGraduationCap size={22} />
              <div>
                <span className="pv-grad__lbl">Te recibís en</span>
                <span className="pv-grad__val">{cuatriName(gradCu)}</span>
              </div>
            </div>
          </div>

          <div className="pv-banner__mid">
            <div className="pv-chips">
              <span className="pv-chip">
                <b>{flat.length}</b> materias
              </span>
              <span className="pv-chip">
                <b>{totalCred}</b> créditos a cursar
              </span>
              <span className="pv-chip">
                <b>
                  {elecTotal}/{ELEC_REQ}
                </b>{" "}
                electivos
              </span>
            </div>
            <div className="pv-meter">
              <div className="pv-meter__top">
                <span className="pv-meter__lbl">Progreso de créditos</span>
                <span className="pv-meter__pct">{pct}%</span>
              </div>
              <div className="pv-meter__bar">
                <i style={{ width: `${pct}%` }} />
              </div>
              <div className="pv-meter__foot">
                <span>
                  <b>{accNow}</b> aprobados
                </span>
                <span className="pv-meter__sep">·</span>
                <span>
                  faltan <b>{totalCred}</b>
                </span>
                <span className="pv-meter__sep">·</span>
                <span>
                  meta <b>{finalCred}</b>
                </span>
              </div>
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
          <div className="pv-tablist" role="tablist" aria-label="Vistas del plan">
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
              aria-selected={tab === "min"}
              tabIndex={tab === "min" ? 0 : -1}
              onClick={() => setTab("min")}
            >
              <IconLayers size={15} /> Minors <span className="pv-tab__new">Nuevo</span>
            </button>
          </div>

          <div className="pv-tabs__actions">
            <button
              type="button"
              className="pv-rec-toggle"
              role="switch"
              aria-checked={recOn}
              aria-label="Recomendador de electivas"
              onClick={() => setRecsHidden((v) => !v)}
            >
              Recomendador
              <span className="pv-switch" aria-hidden="true" />
            </button>
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

      {/* Slot de vista previa: espacio RESERVADO y persistente para no empujar
          el board por cada hover (idle = hint tenue, hover = pill brass). */}
      {showPreviewSlot && (
        <div
          className={
            "plan2-preview-slot" +
            (previewInfo && previewInfo.m ? " is-on" : "")
          }
          aria-live="polite"
        >
          <span className="plan2-preview-slot__hint">
            Pasá el cursor sobre una electiva recomendada para previsualizar
            dónde entraría en tu plan.
          </span>
          {previewInfo && previewInfo.m && (
            <span className="plan2-preview-slot__msg">
              <span className="plan2-preview-banner__dot" aria-hidden="true" />
              <span>
                Vista previa: <b>{previewInfo.m.abbr}</b>{" "}
                {previewInfo.idx >= 0 ? (
                  <>
                    entraría en{" "}
                    <b>{cuatriName(cuatriAt(PL.start, previewInfo.idx))}</b>
                  </>
                ) : (
                  "no se pudo ubicar en el plan"
                )}
              </span>
            </span>
          )}
        </div>
      )}

      {used.length > 0 ? (
        tab === "min" ? (
          <MinorsPanel
            used={used}
            approved={approved}
            onOpenDetail={() => setMinorsOpen(true)}
          />
        ) : (
          <div className={"plan2-split" + (!showSide ? " plan2-split--solo" : "")}>
            <div className="plan2-split__main">
              {tab === "cal" && (
                <div className="pv-semgrid">
                  {used.map(({ it, i }) => (
                    <SemCard
                      key={i}
                      it={it}
                      i={i}
                      start={PL.start}
                      previewCode={preview}
                      maxCred={PL.maxCred}
                      maxMat={PL.maxMat}
                      recOn={recOn}
                      locked={PL.lockedIdx.has(i)}
                      onFinalize={finalizeCuatri}
                      onUnlock={unlockCuatri}
                      onDownload={downloadCuatri}
                    />
                  ))}
                </div>
              )}
              {tab === "road" && (
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
                      recOn={recOn}
                    />
                  ))}
                </ol>
              )}
            </div>

            {showSide && (
              <aside className="plan2-split__side">
                <Recommendations
                  start={PL.start}
                  elecTotal={elecCommitted}
                  recs={recs}
                  onPreview={setPreview}
                  preview={preview}
                  onHide={() => setRecsHidden(true)}
                />
              </aside>
            )}
          </div>
        )
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

      {used.length > 0 && (
        <div className="plan2-optnote">
          <p className="plan2-method">{methodText(R, PL)}</p>
        </div>
      )}

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
