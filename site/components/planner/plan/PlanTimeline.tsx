"use client";

/**
 * PlanTimeline — el tab "Roadmap" del Plan de cursada como una línea de tiempo
 * vertical real: una espina continua con un nodo numerado por cuatrimestre y un
 * nodo terminal de egreso. Migra el comportamiento de `RoadmapStop` (DnD, lock,
 * preview) y suma el resalte de la cadena de correlativas al hover/focus de una
 * materia. El estado (pool, fixed, caps, locks) se lee/escribe vía usePlanner.
 *
 * Las clases del backbone (`pv-menu`, `pv-lockcap`, `pv-sem__tools`, …) las
 * aporta `shared.tsx` + `planview.css`; lo propio de esta pieza usa prefijo
 * `ptl-` y vive en `plan-timeline.css`.
 */

import { useMemo, useState } from "react";
import { usePlanner } from "@/components/planner/state";
import { byId, PALETTE } from "@/lib/planner/model";
import {
  cuatriAt,
  cuatriLabel,
  cuatriName,
} from "@/lib/planner/optimize";
import {
  CuatriTools,
  LockCap,
  MinorDots,
  isRecTagged,
  computeCuatriBlocks,
  IconWarnTri,
} from "@/components/planner/plan/shared";
import {
  IconGraduationCap,
  IconGrip,
  IconClose,
  IconLock,
} from "@/components/planner/icons";
import type {
  PlacedMateria,
  PlanResult,
  PlanStart,
} from "@/lib/planner/types";
import "@/components/planner/plan/plan-timeline.css";

/* ---------- cadena de correlativas ---------- */
/** Relación de una materia con la que está en hover: la propia, un ancestro
 *  (correlativa transitiva), un descendiente (la habilita) o ninguna (atenuada). */
type ChainRel = "self" | "up" | "down" | "dim";

/** Recolecta el cierre transitivo desde `start` siguiendo la adyacencia `adj`
 *  (prerrequisitos → ancestros, dependientes → descendientes). Anti-ciclo por
 *  el set `seen`. */
function collect(start: string, adj: Map<string, string[]>): Set<string> {
  const seen = new Set<string>();
  const stack = [...(adj.get(start) || [])];
  while (stack.length) {
    const c = stack.pop() as string;
    if (seen.has(c)) continue;
    seen.add(c);
    for (const n of adj.get(c) || []) if (!seen.has(n)) stack.push(n);
  }
  return seen;
}

/* ========================================================================= */
/* ---------- una parada de la línea de tiempo ---------- */
function PlanStop({
  it,
  i,
  start,
  accBefore,
  previewCode,
  recOn,
  warns,
  chainMap,
  dragCode,
  onDragCode,
  onHover,
  onFinalize,
  onUnlock,
  onDownload,
}: {
  it: PlacedMateria[];
  i: number;
  start: PlanStart;
  accBefore: number[];
  previewCode: string | null;
  recOn: boolean;
  warns: string[];
  chainMap: Map<string, ChainRel> | null;
  dragCode: string | null;
  onDragCode: (code: string | null) => void;
  onHover: (code: string | null) => void;
  onFinalize: (idx: number) => void;
  onUnlock: (idx: number) => void;
  onDownload: (idx: number, scope: "cal" | "both" | "programa") => void;
}) {
  const { state, dispatch } = usePlanner();
  const cu = cuatriAt(start, i);
  const locked = state.plan.lockedIdx.has(i);
  const maxCred = state.plan.maxCred;
  const maxMat = state.plan.maxMat;

  // destino activo del drag (soltar acá fija la materia en este cuatrimestre)
  const [dragOver, setDragOver] = useState(false);
  // el menú 3-puntos abierto sube el z-index del stop (para que no lo tape el
  // siguiente); lo avisa CuatriTools por `onOpenChange`.
  const [menuOpen, setMenuOpen] = useState(false);
  const [warnsOpen, setWarnsOpen] = useState(false);

  // sólo necesitamos los días de campus para las métricas; la grilla semanal
  // detallada vive en la pestaña "Calendario".
  const { campusDays } = useMemo(() => computeCuatriBlocks(it), [it]);

  const cred = it.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const acc = (accBefore[i] ?? 0) + cred;
  const capCred = state.plan.capCredByIdx.get(i);
  const effCred = capCred ?? maxCred;
  const load = Math.min(100, Math.round((cred / Math.max(1, effCred)) * 100));
  const hasPreview = it.some((x) => x.m.codigo === previewCode);

  return (
    <li
      className={
        "ptl-stop" +
        (hasPreview ? " is-preview" : "") +
        (dragOver ? " drop-over" : "") +
        (locked ? " is-locked" : "") +
        (menuOpen ? " is-menu-open" : "")
      }
    >
      <span
        className={
          "ptl-node" +
          (hasPreview ? " is-preview" : "") +
          (locked ? " is-locked" : "")
        }
        aria-hidden="true"
      >
        {locked ? <IconLock size={13} /> : i + 1}
      </span>

      <div
        className="ptl-stop__card"
        onDragOver={(e: React.DragEvent) => {
          if (!e.dataTransfer.types.includes("text/plain")) return;
          // un cuatrimestre finalizado no es destino válido (el lock manda).
          if (locked) {
            e.dataTransfer.dropEffect = "none";
            return;
          }
          e.preventDefault();
          e.dataTransfer.dropEffect = "move";
          if (!dragOver) setDragOver(true);
        }}
        onDragLeave={(e: React.DragEvent) => {
          // sólo apagamos el resalte al salir de la tarjeta (no en los hijos)
          if (!e.currentTarget.contains(e.relatedTarget as Node))
            setDragOver(false);
        }}
        onDrop={(e: React.DragEvent) => {
          e.preventDefault();
          setDragOver(false);
          if (locked) return;
          const code = e.dataTransfer.getData("text/plain");
          if (code) dispatch({ type: "PLAN_SET_FIXED", code, idx: i });
        }}
      >
        {dragOver && (
          <div className="ptl-drophint" aria-hidden="true">
            <span>soltar acá · fija en {cuatriName(cu)}</span>
          </div>
        )}

        <div className="ptl-stop__head">
          <span className="ptl-stop__tag">{cuatriLabel(cu)}</span>
          <h3 className="ptl-stop__name">{cuatriName(cu)}</h3>
          <span className="ptl-stop__metrics" aria-label="Métricas del cuatrimestre">
            <span>
              <b>{cred}</b> cr
            </span>
            <span className="sep" aria-hidden="true">
              ·
            </span>
            <span>
              <b>{it.length}</b> mat
            </span>
            {campusDays > 0 && (
              <>
                <span className="sep" aria-hidden="true">
                  ·
                </span>
                <span>
                  <b>{campusDays}</b> {campusDays === 1 ? "día" : "días"}
                </span>
              </>
            )}
          </span>

          {warns.length > 0 && (
            <button
              type="button"
              className={"ptl-warns__btn" + (warnsOpen ? " is-open" : "")}
              aria-expanded={warnsOpen}
              aria-label={`${warns.length} ${warns.length === 1 ? "observación" : "observaciones"} en ${cuatriName(cu)}`}
              onClick={() => setWarnsOpen((v) => !v)}
            >
              <IconWarnTri size={14} />
              <span>{warns.length}</span>
            </button>
          )}

          <CuatriTools
            i={i}
            cuName={cuatriName(cu)}
            locked={locked}
            maxCred={maxCred}
            maxMat={maxMat}
            idPrefix="ptl"
            onFinalize={onFinalize}
            onUnlock={onUnlock}
            onDownload={onDownload}
            onOpenChange={setMenuOpen}
          />
        </div>

        {warns.length > 0 && warnsOpen && (
          <ul className="ptl-warns__list">
            {warns.map((w, k) => (
              <li key={k}>{w}</li>
            ))}
          </ul>
        )}

        <div className="ptl-mats">
          {it.map((x, k) => {
            const isPrev = x.m.codigo === previewCode;
            const rel = chainMap ? chainMap.get(x.m.codigo) ?? "dim" : null;
            return (
              <div
                key={x.m.codigo}
                className={
                  "ptl-mat" +
                  (isPrev ? " is-preview" : "") +
                  (dragCode === x.m.codigo ? " is-dragging" : "") +
                  (rel ? " is-chain-" + rel : "")
                }
                style={
                  { "--blk": PALETTE[k % PALETTE.length] } as React.CSSProperties
                }
              >
                <button
                  type="button"
                  className="ptl-mat__main"
                  draggable={!locked}
                  title={
                    locked
                      ? `${x.m.codigo} · ${x.m.nombre}`
                      : `${x.m.codigo} · ${x.m.nombre} — arrastrá para mover de cuatrimestre`
                  }
                  onDragStart={(e: React.DragEvent) => {
                    if (locked) return;
                    e.dataTransfer.setData("text/plain", x.m.codigo);
                    e.dataTransfer.effectAllowed = "move";
                    onDragCode(x.m.codigo);
                  }}
                  onDragEnd={() => onDragCode(null)}
                  onMouseEnter={() => onHover(x.m.codigo)}
                  onMouseLeave={() => onHover(null)}
                  onFocus={() => onHover(x.m.codigo)}
                  onBlur={() => onHover(null)}
                  onClick={() =>
                    dispatch({ type: "OPEN_DRAWER", code: x.m.codigo })
                  }
                >
                  {!locked && (
                    <span className="ptl-mat__grip" aria-hidden="true">
                      <IconGrip size={12} />
                    </span>
                  )}
                  <MinorDots m={x.m} />
                  <span className="ptl-mat__abbr">{x.m.abbr}</span>
                  <span className="ptl-mat__name">{x.m.nombre}</span>
                  <span className="ptl-mat__cr">{x.m.creditos}</span>
                  {isRecTagged(x.m, recOn) && (
                    <span className="ptl-mat__rec">rec</span>
                  )}
                  {isPrev && <span className="ptl-mat__new">nueva</span>}
                </button>
                {!locked && (
                  <button
                    type="button"
                    className="ptl-mat__rm"
                    draggable={false}
                    aria-label={`Quitar ${x.m.nombre} del plan`}
                    onClick={(e) => {
                      e.stopPropagation();
                      dispatch({ type: "PLAN_POOL_REMOVE", code: x.m.codigo });
                    }}
                  >
                    <IconClose size={13} />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <div className="ptl-stop__foot">
          <div className="ptl-loadbar" aria-hidden="true">
            <i style={{ width: `${load}%` }} />
          </div>
          <div className="ptl-foot__meta">
            <span className="ptl-acc">
              acumulado <b>{acc}</b> cr
            </span>
            {!locked && <span className="ptl-tope">tope {effCred} cr</span>}
          </div>
        </div>

        {locked && <LockCap i={i} onUnlock={onUnlock} />}
      </div>
    </li>
  );
}

/* ========================================================================= */
export default function PlanTimeline({
  used,
  R,
  start,
  previewCode,
  recOn,
  warnsByIdx,
  onFinalize,
  onUnlock,
  onDownload,
}: {
  used: { it: PlacedMateria[]; i: number }[];
  R: PlanResult;
  start: PlanStart;
  previewCode: string | null;
  recOn: boolean;
  warnsByIdx: Map<number, string[]>;
  onFinalize: (idx: number) => void;
  onUnlock: (idx: number) => void;
  onDownload: (idx: number, scope: "cal" | "both" | "programa") => void;
}) {
  // materia en hover/focus (cadena de correlativas) y materia en arrastre
  // (deshabilita la cadena mientras se hace DnD).
  const [hoverCode, setHoverCode] = useState<string | null>(null);
  const [dragCode, setDragCode] = useState<string | null>(null);

  // Adyacencia código→correlativas y código→dependientes, ambas restringidas a
  // las materias que están DENTRO del plan. Se computa una vez por `used`.
  const { prereqs, dependents, planCodes } = useMemo(() => {
    const planCodes = new Set<string>();
    used.forEach(({ it }) => it.forEach((x) => planCodes.add(x.m.codigo)));
    const prereqs = new Map<string, string[]>();
    const dependents = new Map<string, string[]>();
    planCodes.forEach((code) => {
      const m = byId.get(code);
      const pre = (m?.correlativas || []).filter((c) => planCodes.has(c));
      prereqs.set(code, pre);
      pre.forEach((p) => {
        const arr = dependents.get(p);
        if (arr) arr.push(code);
        else dependents.set(p, [code]);
      });
    });
    return { prereqs, dependents, planCodes };
  }, [used]);

  // Mapa código→relación con la materia en hover. Null cuando no hay hover o
  // mientras se arrastra (la cadena no debe interferir con el drag).
  const chainMap = useMemo<Map<string, ChainRel> | null>(() => {
    if (!hoverCode || dragCode || !planCodes.has(hoverCode)) return null;
    const up = collect(hoverCode, prereqs);
    const down = collect(hoverCode, dependents);
    const map = new Map<string, ChainRel>();
    planCodes.forEach((code) => {
      if (code === hoverCode) map.set(code, "self");
      else if (up.has(code)) map.set(code, "up");
      else if (down.has(code)) map.set(code, "down");
      else map.set(code, "dim");
    });
    return map;
  }, [hoverCode, dragCode, prereqs, dependents, planCodes]);

  const chainOn = !!hoverCode && !dragCode;

  // Nodo terminal de egreso: último cuatrimestre usado + total de créditos del
  // plan (aprobados + a cursar) al final de ese cuatrimestre.
  const lastIdx = used.length ? used[used.length - 1].i : 0;
  const gradCu = cuatriAt(start, lastIdx);
  const lastStop = used.length ? used[used.length - 1].it : [];
  const lastCred = lastStop.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const totalCred = (R.accBefore[lastIdx] ?? 0) + lastCred;

  return (
    <div className="ptl-wrap">
      <div className="ptl-legend">
        <span className="ptl-legend__drag">
          <IconGrip size={13} />
          Arrastrá una materia a otro cuatrimestre para fijarla ahí.
        </span>
        <span
          className={"ptl-legend__chain" + (chainOn ? " is-on" : "")}
          aria-hidden={!chainOn}
        >
          <span className="ptl-legend__k">
            <i className="ptl-dot ptl-dot--up" /> correlativas
          </span>
          <span className="ptl-legend__k">
            <i className="ptl-dot ptl-dot--down" /> habilita
          </span>
        </span>
      </div>

      <ol
        className="ptl"
        onMouseLeave={() => setHoverCode(null)}
      >
        {used.map(({ it, i }) => (
          <PlanStop
            key={i}
            it={it}
            i={i}
            start={start}
            accBefore={R.accBefore}
            previewCode={previewCode}
            recOn={recOn}
            warns={warnsByIdx.get(i) ?? []}
            chainMap={chainMap}
            dragCode={dragCode}
            onDragCode={setDragCode}
            onHover={setHoverCode}
            onFinalize={onFinalize}
            onUnlock={onUnlock}
            onDownload={onDownload}
          />
        ))}

        <li className="ptl-grad">
          <span className="ptl-node ptl-node--grad" aria-hidden="true">
            <IconGraduationCap size={17} />
          </span>
          <div className="ptl-grad__card">
            <p className="ptl-grad__title">
              Te recibís — {cuatriName(gradCu)}
            </p>
            <p className="ptl-grad__sub">
              {totalCred} créditos · {used.length}{" "}
              {used.length === 1 ? "cuatrimestre" : "cuatrimestres"}
            </p>
          </div>
        </li>
      </ol>
    </div>
  );
}
