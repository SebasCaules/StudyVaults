"use client";

/**
 * SemCards — tab "Calendario" del Plan de cursada, rediseñado.
 *
 * Problema que resuelve: el SGA publica los horarios de un solo cuatrimestre a
 * la vez, así que casi todos los cuatris futuros no tienen grilla semanal. La
 * versión anterior igual dibujaba una grilla VACÍA + chips "sin horario"
 * repetidos por card → un muro de ~6000px sin información.
 *
 * Ahora hay dos variantes de tarjeta:
 *  - RICA (hay bloques de grilla): CursadaCalendar compacto + asincrónicas +
 *    barra de carga. Ocupa 2 columnas. (Las electivas ya se ven como bloques en
 *    la grilla semanal, así que arriba NO se repiten como leyenda.)
 *  - COMPACTA (sin bloques): lista limpia de materias (dot de minor + abreviatura
 *    + nombre + créditos, clickeable y arrastrable) y UNA nota al pie. Fluye en
 *    la grilla densa junto a las demás compactas.
 *
 * El menú 3-puntos, los locks y las descargas viven en el backbone compartido
 * (CuatriTools / LockCap). El drag & drop y los locks conservan su contrato
 * inviolable: el código viaja por dataTransfer y el drop dispara PLAN_SET_FIXED;
 * un cuatri finalizado no es destino ni se arrastra.
 */

import { useMemo, useState } from "react";
import { usePlanner } from "@/components/planner/state";
import { PALETTE, DAYS } from "@/lib/planner/model";
import { cuatriAt, cuatriLabel, cuatriName } from "@/lib/planner/optimize";
import CursadaCalendar from "@/components/planner/CursadaCalendar";
import { IconGrip } from "@/components/planner/icons";
import {
  AsyncRow,
  CuatriTools,
  IconWarnTri,
  LockCap,
  LockToggle,
  MinorDots,
  computeCuatriBlocks,
  isRecTagged,
} from "@/components/planner/plan/shared";
import type { PlacedMateria, PlanStart } from "@/lib/planner/types";
import "./plan-semcards.css";

/* ---------- una tarjeta de cuatrimestre ---------- */
function SemCard({
  it,
  i,
  start,
  previewCode,
  recOn,
  warns,
  onFinalize,
  onUnlock,
  onDownload,
}: {
  it: PlacedMateria[];
  i: number;
  start: PlanStart;
  previewCode: string | null;
  recOn: boolean;
  warns: string[];
  onFinalize: (idx: number) => void;
  onUnlock: (idx: number) => void;
  onDownload: (idx: number, scope: "cal" | "both" | "programa") => void;
}) {
  const { state, dispatch } = usePlanner();
  const cu = cuatriAt(start, i);
  const cuName = cuatriName(cu);

  // topes y lock se leen del estado (no viajan por props, según el contrato).
  const maxCred = state.plan.maxCred;
  const maxMat = state.plan.maxMat;
  const locked = state.plan.lockedIdx.has(i);
  const capCred = state.plan.capCredByIdx.get(i);
  const capMat = state.plan.capMatByIdx.get(i);
  const isCapped = capCred !== undefined || capMat !== undefined;

  const { blocks, asyncs, campusDays } = useMemo(
    () => computeCuatriBlocks(it),
    [it],
  );
  // ¿la card es "rica"? Solo si hay bloques reales de grilla semanal.
  const rich = blocks.length > 0;

  const cred = it.reduce((s, x) => s + (x.m.creditos || 0), 0);
  const hasPreview = it.some((x) => x.m.codigo === previewCode);
  const effCred = capCred ?? maxCred;
  const load = Math.min(100, Math.round((cred / Math.max(1, effCred)) * 100));

  // menú abierto (para z-index de la card) + despliegue de observaciones.
  const [menuOpen, setMenuOpen] = useState(false);
  const [warnsOpen, setWarnsOpen] = useState(false);

  // DnD: soltar una materia en OTRA card la fija en ese cuatri (deja de ser
  // "auto"). El código viaja por dataTransfer; el estado local solo pinta
  // origen (is-dragging) y destino (is-drop-over). Un cuatri finalizado no es
  // destino válido ni permite arrastrar sus materias.
  const [dragOver, setDragOver] = useState(false);
  const [draggingCode, setDraggingCode] = useState<string | null>(null);

  const startDrag = (e: React.DragEvent, code: string) => {
    if (locked) return;
    e.dataTransfer.setData("text/plain", code);
    e.dataTransfer.effectAllowed = "move";
    setDraggingCode(code);
  };

  return (
    <article
      className={
        "pv-sem psc-card" +
        (rich ? " psc-card--rich" : " psc-card--compact") +
        (hasPreview ? " is-preview" : "") +
        (isCapped ? " is-capped" : "") +
        (locked ? " is-locked" : "") +
        (dragOver ? " is-drop-over" : "") +
        (menuOpen ? " is-menu-open" : "")
      }
      onDragOver={(e: React.DragEvent) => {
        if (!e.dataTransfer.types.includes("text/plain")) return;
        if (locked) {
          e.dataTransfer.dropEffect = "none";
          return;
        }
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        if (!dragOver) setDragOver(true);
      }}
      onDragLeave={(e: React.DragEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOver(false);
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
        <div className="pv-sem__drophint" aria-hidden="true">
          <span>soltar acá · fija en {cuName}</span>
        </div>
      )}

      <div className="pv-sem__head">
        <div className="pv-sem__when">
          <span className="pv-sem__tag">{cuatriLabel(cu)}</span>
          <span className="pv-sem__title">{cuName}</span>
        </div>
        <div className="psc-head__tools">
          <LockToggle
            i={i}
            cuName={cuName}
            locked={locked}
            onFinalize={onFinalize}
            onUnlock={onUnlock}
          />
          {warns.length > 0 && (
            <button
              type="button"
              className={"psc-warnbtn" + (warnsOpen ? " is-open" : "")}
              aria-expanded={warnsOpen}
              aria-label={`${warns.length} ${warns.length === 1 ? "observación" : "observaciones"} de ${cuName}`}
              title={warns.length === 1 ? "1 observación" : `${warns.length} observaciones`}
              onClick={() => setWarnsOpen((v) => !v)}
            >
              <IconWarnTri size={14} />
              <span className="psc-warnbtn__n">{warns.length}</span>
            </button>
          )}
          <CuatriTools
            i={i}
            cuName={cuName}
            locked={locked}
            maxCred={maxCred}
            maxMat={maxMat}
            idPrefix="sem"
            onDownload={onDownload}
            onOpenChange={setMenuOpen}
          />
        </div>
      </div>

      {warnsOpen && warns.length > 0 && (
        <ul className="psc-warnlist">
          {warns.map((w, k) => (
            <li key={k}>{w}</li>
          ))}
        </ul>
      )}

      {rich ? (
        <div className="pv-sem__cal">
          <CursadaCalendar
            blocks={blocks}
            days={DAYS}
            compact
            onBlockClick={(code) => dispatch({ type: "OPEN_DRAWER", code })}
          />
          <AsyncRow asyncs={asyncs} />
        </div>
      ) : (
        <>
          <ul className="psc-mats">
            {it.map((x, k) => {
              const isPrev = x.m.codigo === previewCode;
              return (
                <li className="psc-matli" key={x.m.codigo}>
                  <button
                    type="button"
                    className={
                      "psc-mat" +
                      (draggingCode === x.m.codigo ? " is-dragging" : "") +
                      (isPrev ? " is-preview" : "")
                    }
                    style={
                      { "--blk": PALETTE[k % PALETTE.length] } as React.CSSProperties
                    }
                    draggable={!locked}
                    onDragStart={(e: React.DragEvent) => startDrag(e, x.m.codigo)}
                    onDragEnd={() => setDraggingCode(null)}
                    onClick={() =>
                      dispatch({ type: "OPEN_DRAWER", code: x.m.codigo })
                    }
                    title={
                      locked
                        ? `${x.m.codigo} · ${x.m.nombre}`
                        : `${x.m.codigo} · ${x.m.nombre} — arrastrá para fijarla en otro cuatrimestre`
                    }
                  >
                    {!locked && (
                      <span className="psc-mat__grip" aria-hidden="true">
                        <IconGrip size={12} />
                      </span>
                    )}
                    <MinorDots m={x.m} />
                    <span className="psc-mat__abbr">{x.m.abbr}</span>
                    <span className="psc-mat__name">{x.m.nombre}</span>
                    {isRecTagged(x.m, recOn) && !isPrev && (
                      <span className="pv-rectag">rec</span>
                    )}
                    {isPrev && <span className="psc-newtag">nueva</span>}
                    <span className="psc-mat__cr">{x.m.creditos} cr</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <p className="psc-nohor">
            El SGA todavía no publicó horarios de este cuatrimestre.
          </p>
        </>
      )}

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
        {locked && <LockCap i={i} onUnlock={onUnlock} />}
      </div>
    </article>
  );
}

/* ========================================================================= */
/* ---------- grilla de tarjetas del tab Calendario ---------- */
export default function SemCards({
  used,
  start,
  previewCode,
  recOn,
  warnsByIdx,
  onFinalize,
  onUnlock,
  onDownload,
}: {
  used: { it: PlacedMateria[]; i: number }[];
  start: PlanStart;
  previewCode: string | null;
  recOn: boolean;
  warnsByIdx: Map<number, string[]>;
  onFinalize: (idx: number) => void;
  onUnlock: (idx: number) => void;
  onDownload: (idx: number, scope: "cal" | "both" | "programa") => void;
}): React.JSX.Element {
  return (
    <>
      <p className="psc-legend">
        <IconGrip size={13} />
        Arrastrá una materia a otro cuatrimestre para fijarla ahí.
      </p>
      <div className="psc-grid">
        {used.map(({ it, i }) => (
          <SemCard
            key={i}
            it={it}
            i={i}
            start={start}
            previewCode={previewCode}
            recOn={recOn}
            warns={warnsByIdx.get(i) ?? []}
            onFinalize={onFinalize}
            onUnlock={onUnlock}
            onDownload={onDownload}
          />
        ))}
      </div>
    </>
  );
}
