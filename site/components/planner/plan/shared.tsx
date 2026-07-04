"use client";

/**
 * Piezas compartidas de la vista "Plan de cursada" (backbone del rediseño).
 * Extraídas de PlanView.tsx para que Timeline / SemCards / Rail las reusen sin
 * duplicar lógica. Las clases CSS (`plan2-field`, `async-row`, `pv-menu`, …)
 * se mantienen: su estilo vive en planview.css.
 */

import { useEffect, useRef, useState } from "react";
import { usePlanner } from "@/components/planner/state";
import { PALETTE, DAYS, PLAN } from "@/lib/planner/model";
import { isAsync, slotsConflict } from "@/lib/planner/time";
import { minorsOf } from "@/lib/planner/minors";
import { MinorBadge } from "@/components/planner/MinorBadge";
import {
  IconCalendar,
  IconDownload,
  IconFileText,
  IconLayers,
  IconLock,
  IconSliders,
  IconUnlock,
  type IconProps,
} from "@/components/planner/icons";
import type { MateriaM, PlacedMateria, WeekBlock } from "@/lib/planner/types";

export const ELEC_REQ = PLAN.creditosElectivasReq ?? 27;

/* ---------- iconos locales (no existen en icons.tsx) ---------- */
export const IconDots = ({ size = 16, ...rest }: IconProps) => (
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

export const IconWarnTri = ({ size = 21, ...rest }: IconProps) => (
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
 *  recomendador encendido. */
export const isRecTagged = (m: MateriaM, recOn: boolean) =>
  recOn && m.tipo === "electiva" && minorsOf(m.areas).length > 0;

/* ---------- input numérico robusto ---------- */
export function NumField({
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

/* ---------- bloques de la grilla semanal de un cuatrimestre ---------- */
export function computeCuatriBlocks(it: PlacedMateria[]) {
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
export function AsyncRow({
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
export function MinorDots({ m }: { m: MateriaM }) {
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

/* ---------- chip "finalizado" + botón desbloquear (pie de card/stop) ---------- */
export function LockCap({ i, onUnlock }: { i: number; onUnlock: (idx: number) => void }) {
  return (
    <div className="pv-lockcap">
      <span className="pv-lockchip">
        <IconLock size={12} />
        <b>finalizado</b> · el optimizador no lo toca
      </span>
      <button type="button" className="pv-unlock" onClick={() => onUnlock(i)}>
        <IconUnlock size={11} /> Desbloquear
      </button>
    </div>
  );
}

/* ---------- toggle de lock visible (candado en el header de card/stop) ----------
 * Acceso directo a "finalizar cuatrimestre" sin pasar por el menú ⋯ (pedido
 * explícito del usuario). Lockear pide confirmación (mismo popover y copy que
 * tenía el menú); desbloquear es directo (acción reversible). */
export function LockToggle({
  i,
  cuName,
  locked,
  onFinalize,
  onUnlock,
}: {
  i: number;
  cuName: string;
  locked: boolean;
  onFinalize: (idx: number) => void;
  onUnlock: (idx: number) => void;
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const wrapRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!confirmOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node))
        setConfirmOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [confirmOpen]);

  return (
    <span className="pv-locktoggle" ref={wrapRef}>
      <button
        type="button"
        className={"pv-lockbtn" + (locked ? " is-locked" : "")}
        aria-pressed={locked}
        aria-label={
          locked
            ? `Desbloquear ${cuName} (el optimizador vuelve a tocarlo)`
            : `Finalizar ${cuName} (el optimizador no lo toca)`
        }
        title={
          locked
            ? "Desbloquear cuatrimestre"
            : "Finalizar cuatrimestre — el optimizador no lo toca"
        }
        onClick={() => {
          if (locked) onUnlock(i);
          else setConfirmOpen((v) => !v);
        }}
      >
        {locked ? <IconLock size={14} /> : <IconUnlock size={14} />}
      </button>
      {confirmOpen && !locked && (
        <div
          className="pv-confirm-pop"
          role="dialog"
          aria-label="Finalizar cuatrimestre"
        >
          <p className="pv-confirm-pop__t">¿Finalizar {cuName}?</p>
          <p className="pv-confirm-pop__b">
            El optimizador dejará de tocar este cuatrimestre mientras iterás el
            resto. Podés desbloquearlo cuando quieras.
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
    </span>
  );
}

/* ---------- menú 3-puntos de un cuatrimestre ----------
 * Compartido por SemCards (Calendario) y PlanTimeline (Roadmap): límites del
 * cuatri y descargas. El finalizar/desbloquear vive en LockToggle (candado
 * visible en el header) — ya no se duplica acá. */
export function CuatriTools({
  i,
  cuName,
  locked,
  maxCred,
  maxMat,
  idPrefix,
  onDownload,
  onOpenChange,
}: {
  i: number;
  cuName: string;
  locked: boolean;
  maxCred: number;
  maxMat: number;
  idPrefix: string;
  onDownload: (idx: number, scope: "cal" | "both" | "programa") => void;
  /** la card padre necesita saber si el menú está abierto (z-index: `is-menu-open`) */
  onOpenChange?: (open: boolean) => void;
}) {
  const { state, dispatch } = usePlanner();
  const capCred = state.plan.capCredByIdx.get(i);
  const capMat = state.plan.capMatByIdx.get(i);
  const isCapped = capCred !== undefined || capMat !== undefined;

  const [menuOpen, setMenuOpen] = useState(false);
  const toolsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    onOpenChange?.(menuOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  return (
    <div
      className={"pv-sem__tools" + (menuOpen ? " is-open" : "")}
      ref={toolsRef}
    >
      <button
        type="button"
        className="pv-dotbtn"
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        aria-label={`Opciones de ${cuName}`}
        onClick={() => setMenuOpen((v) => !v)}
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
                    id={`${idPrefix}CapCred${i}`}
                    label="Máx. créditos"
                    value={capCred ?? maxCred}
                    min={3}
                    max={40}
                    onCommit={(n) =>
                      dispatch({ type: "SET_PLAN_CAP_CRED", idx: i, value: n })
                    }
                  />
                  <NumField
                    id={`${idPrefix}CapMat${i}`}
                    label="Máx. materias"
                    value={capMat ?? maxMat}
                    min={1}
                    max={9}
                    onCommit={(n) =>
                      dispatch({ type: "SET_PLAN_CAP_MAT", idx: i, value: n })
                    }
                  />
                  <button
                    type="button"
                    className="pv-menu__auto"
                    disabled={!isCapped}
                    onClick={() => {
                      dispatch({ type: "SET_PLAN_CAP_CRED", idx: i, value: null });
                      dispatch({ type: "SET_PLAN_CAP_MAT", idx: i, value: null });
                    }}
                  >
                    auto
                  </button>
                </div>
              </div>
              <hr className="pv-menu__sep" />
            </>
          )}

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
    </div>
  );
}
