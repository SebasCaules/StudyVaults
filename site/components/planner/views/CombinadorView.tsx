"use client";

import "@/components/planner/combinador.css";

import { useEffect, useMemo, useRef, useState } from "react";
import { usePlanner } from "@/components/planner/state";
import {
  PLAN,
  byId,
  credOf,
  isElectiva,
  hasHorario,
  PALETTE,
  DAYS,
  DAYS6,
} from "@/lib/planner/model";
import { comModalidad, isAsync, slotsConflict, toMin } from "@/lib/planner/time";
import { generateCombos } from "@/lib/planner/combos";
import {
  optimizePlan,
  cuatriAt,
  cuatriLabel,
  cuatriName,
} from "@/lib/planner/optimize";
import { MAX_PLAN_CUATRIS } from "@/lib/planner/consts";
import { hasPrograma } from "@/lib/planner/programa";
import { buildComboHTML } from "@/lib/planner/exportPlan";
import { openForPrint } from "@/lib/planner/download";
import { Legend } from "@/components/planner/WeekGrid";
import CursadaCalendar from "@/components/planner/CursadaCalendar";
import { RecRow, RecSig } from "@/components/planner/RecRow";
import { ComingSoonBadge, ProgramaChips } from "@/components/planner/ProgramaChips";
import {
  IconDownload,
  IconCalendar,
  IconFileText,
  IconLayers,
} from "@/components/planner/icons";
import { CommissionSelect } from "@studyvaults/ui";
import type { LegendEntry } from "@/components/planner/WeekGrid";
import type {
  Comision,
  Materia,
  MateriaM,
  PlacedMateria,
  Slot,
  WeekBlock,
} from "@/lib/planner/types";

interface AsyncChip extends Slot {
  abbr: string;
  color: string;
}

const MODAL_KEYS = ["Presencial", "Virtual", "Blended"] as const;
/** Período que se estampa en el documento exportado. */
const PERIODO = "2.º cuatrimestre 2026";
/** Tope de sugerencias que muestra el recomendador slim (panel angosto). */
const SUGGEST_LIMIT = 14;

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
const hhmm = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

/** Fecha legible para el pie del documento exportado. */
function nowStr(): string {
  try {
    return new Date().toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

/** Tooltip nativo con el horario completo de una comisión (día · franja). */
function comTitle(c: Comision): string {
  const slots = c.slots
    .filter((s) => !isAsync(s))
    .map((s) => `${s.dia.slice(0, 3)} ${s.desde}–${s.hasta}`)
    .join(" · ");
  const mod = comModalidad(c);
  return [mod, slots].filter(Boolean).join(" — ") || `com ${c.comision}`;
}

/** Métricas de una cursada (combo): días con clase, franja, horas semanales.
 *  Se usan para ORDENAR las opciones (la más compacta primero) y para los
 *  stat-tiles de la opción activa. */
function comboMetrics(placed: PlacedMateria[]) {
  const days = new Set<string>();
  let totalMin = 0;
  let minStart = Infinity;
  let maxEnd = -Infinity;
  for (const x of placed) {
    for (const s of x.com?.slots || []) {
      if (isAsync(s) || !DAYS.includes(s.dia)) continue;
      days.add(s.dia);
      totalMin += toMin(s.hasta) - toMin(s.desde);
      minStart = Math.min(minStart, toMin(s.desde));
      maxEnd = Math.max(maxEnd, toMin(s.hasta));
    }
  }
  return {
    dias: days.size,
    libres: Math.max(0, DAYS.length - days.size),
    horas: Math.round((totalMin / 60) * 10) / 10,
    minStart: minStart === Infinity ? 0 : minStart,
    maxEnd: maxEnd === -Infinity ? 0 : maxEnd,
    rango: minStart === Infinity ? "—" : `${hhmm(minStart)}–${hhmm(maxEnd)}`,
  };
}

/** Info-tooltip inline (hover/focus): un botón "i" con una caja explicativa.
 *  CSS-only (visible con :hover / :focus-within) → static-export safe. */
function InfoTip({ text, label }: { text: string; label?: string }) {
  return (
    <span className="cmb9-tip">
      <button
        type="button"
        className="cmb9-tip__btn"
        aria-label={label ?? "Más información"}
      >
        i
      </button>
      <span className="cmb9-tip__box" role="tooltip">
        {text}
      </span>
    </span>
  );
}

/**
 * Armá tu cuatrimestre — combinador con el rediseño del Módulo E: un header
 * compacto (chips de materia + preferencias de cursada) con el cluster de
 * acciones fijo a la derecha (Sugeridas · Descargar · Guardar preferencia), y
 * el calendario semanal a todo el ancho como protagonista. El recomendador es
 * un panel slim, colapsable, pegado al borde derecho del calendario: sugiere
 * CUALQUIER materia (obligatoria o electiva) que todavía te entre en la semana,
 * en filas de una sola línea. Las opciones se ordenan de la más compacta (menos
 * días en el campus) a la menos, así la primera ya es una buena cursada.
 */
export default function CombinadorView() {
  const { state, dispatch } = usePlanner();
  const { combo, fixedCom, comboParams, comboSolo } = state;

  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [recOpen, setRecOpen] = useState(true);
  const [dlOpen, setDlOpen] = useState(false);
  const [saveOpen, setSaveOpen] = useState(false);
  const [saveIdx, setSaveIdx] = useState(""); // "" = Auto (que el plan la ubique)
  const dlRef = useRef<HTMLDivElement>(null);
  const saveRef = useRef<HTMLDivElement>(null);

  // ---------- materias combinables ----------
  const pool = useMemo(() => {
    // «Solo combinar» ignora el progreso: ofrece también las ya aprobadas
    const ok = (m: Materia) =>
      hasHorario(m.codigo) &&
      (state.comboSolo || !state.approved.has(m.codigo));
    const obs = PLAN.obligatorias
      .filter(ok)
      .map((m) => byId.get(m.codigo)!)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
    const els = PLAN.electivas
      .filter(ok)
      .map((m) => byId.get(m.codigo)!)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
    return { obs, els };
  }, [state.approved, state.comboSolo]);

  const filtered = useMemo(() => {
    const needle = norm(q.trim());
    const match = (m: MateriaM) =>
      !needle || norm(`${m.codigo} ${m.nombre} ${m.abbr}`).includes(needle);
    return { obs: pool.obs.filter(match), els: pool.els.filter(match) };
  }, [pool, q]);

  // Selección EFECTIVA del combo: en modo normal, las aprobadas que hayan
  // entrado vía «Solo combinar» quedan latentes (no se combinan, no se
  // muestran, no se guardan — así el guardado al plan nunca es parcial en
  // silencio) y reaparecen al reactivar el modo. No se borran del set.
  const comboEff = useMemo(
    () =>
      new Set(
        [...combo].filter((c) => comboSolo || !state.approved.has(c)),
      ),
    [combo, comboSolo, state.approved],
  );

  // selección, ordenada por código (igual que generateCombos → colores alineados)
  const selected = useMemo(
    () =>
      [...comboEff]
        .filter(hasHorario)
        .sort()
        .map((c) => byId.get(c)!),
    [comboEff],
  );
  const cred = selected.reduce((s, m) => s + (m.creditos || 0), 0);
  const elc = selected
    .filter((m) => isElectiva(m.codigo))
    .reduce((s, m) => s + credOf(m.codigo), 0);
  // ¿alguna materia elegida tiene más de una comisión? → hay selector de comisión
  // en juego, así que mostramos la nota "Comisión: Auto" con su tooltip.
  const hasComChoice = selected.some(
    (m) => (m.horario?.comisiones?.length || 0) > 1,
  );

  // ---------- generación automática ----------
  const result = useMemo(
    () =>
      comboEff.size ? generateCombos(comboEff, fixedCom, comboParams) : null,
    [comboEff, fixedCom, comboParams],
  );

  // Opciones ordenadas: menos días en el campus › termina más temprano › menos
  // horas › orden original. Así la opción 1 ya es una cursada compacta.
  const ranked = useMemo(() => {
    if (!result) return [];
    return result.combos
      .map((c, i) => ({ c, m: comboMetrics(c), i }))
      .sort(
        (a, b) =>
          a.m.dias - b.m.dias ||
          a.m.maxEnd - b.m.maxEnd ||
          a.m.horas - b.m.horas ||
          a.i - b.i,
      )
      .map((x) => x.c);
  }, [result]);

  useEffect(() => {
    setIdx(0);
  }, [ranked]);

  const total = ranked.length;
  const safeIdx = total ? Math.min(idx, total - 1) : 0;

  useEffect(() => {
    if (total <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") setIdx((i) => (i - 1 + total) % total);
      if (e.key === "ArrowRight") setIdx((i) => (i + 1) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [total]);

  // cerrar los popovers del header (Descargar / Guardar) al click afuera o Escape
  useEffect(() => {
    if (!dlOpen && !saveOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (dlOpen && dlRef.current && !dlRef.current.contains(e.target as Node))
        setDlOpen(false);
      if (
        saveOpen &&
        saveRef.current &&
        !saveRef.current.contains(e.target as Node)
      )
        setSaveOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDlOpen(false);
        setSaveOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [dlOpen, saveOpen]);

  // ---------- grilla de la opción actual ----------
  const grid = useMemo(() => {
    const current = ranked[safeIdx];
    if (!current) return null;
    const blocks: WeekBlock[] = [];
    const asyncs: AsyncChip[] = [];
    const seenB = new Set<string>();
    const entries: LegendEntry[] = [];
    current.forEach((x, i) => {
      const color = PALETTE[i % PALETTE.length];
      const com = x.com;
      entries.push({
        abbr: x.m.abbr,
        nombre: `${x.m.nombre} (com ${com ? com.comision : "—"})`,
        color,
      });
      (com?.slots || []).forEach((s) => {
        const key = x.m.codigo + s.dia + s.desde + s.hasta;
        if (isAsync(s) || !DAYS6.includes(s.dia)) {
          asyncs.push({ ...s, abbr: x.m.abbr, color });
        } else {
          if (seenB.has(key)) return;
          seenB.add(key);
          // codigo permite que el bloque sea clickeable (abre el drawer de specs)
          blocks.push({
            ...s,
            abbr: x.m.abbr,
            nombre: x.m.nombre,
            color,
            codigo: x.m.codigo,
          });
        }
      });
    });
    blocks.forEach((a) => {
      a.conf = blocks.some((b) => b !== a && slotsConflict(a, b));
    });
    return { blocks, asyncs, entries };
  }, [ranked, safeIdx]);

  // ---------- insights de la cursada actual ----------
  const insights = useMemo(() => {
    const current = ranked[safeIdx];
    if (!current) return null;
    const m = comboMetrics(current);
    if (!grid || !grid.blocks.length) return null;
    return m;
  }, [ranked, safeIdx, grid]);

  // La opción 1 es, por el orden, la más compacta (menos días en el campus).
  const isCompact = total > 1 && insights != null && safeIdx === 0;

  // ---------- recomendador de CUALQUIER materia (obligatoria o electiva) ----------
  // Sugiere materias con horario que todavía no elegiste, priorizando las que
  // ENTRAN en tu semana actual sin pisarse con la opción activa. El "+" las suma
  // directo a tu cuatrimestre (combo). Barato: para cada candidata chequea si
  // alguna de sus comisiones no choca con los bloques de la opción en pantalla.
  const suggestions = useMemo(() => {
    const blocks = grid?.blocks ?? [];
    const cand = [...pool.obs, ...pool.els].filter((m) => !combo.has(m.codigo));
    const fits = (m: MateriaM): boolean => {
      const coms = m.horario?.comisiones ?? [];
      if (!coms.length || !blocks.length) return true;
      return coms.some((c) =>
        c.slots
          .filter((s) => !isAsync(s) && DAYS6.includes(s.dia))
          .every((s) => !blocks.some((b) => slotsConflict(s, b))),
      );
    };
    return cand
      .map((m) => ({ m, fit: fits(m) }))
      .sort(
        // entra en la semana › TRONCAL antes que electiva (lo obligatorio
        // manda) › más créditos › código.
        (a, b) =>
          (a.fit === b.fit ? 0 : a.fit ? -1 : 1) ||
          (a.m.tipo === b.m.tipo ? 0 : a.m.tipo === "obligatoria" ? -1 : 1) ||
          (b.m.creditos || 0) - (a.m.creditos || 0) ||
          a.m.codigo.localeCompare(b.m.codigo),
      )
      .slice(0, SUGGEST_LIMIT);
  }, [pool, combo, grid]);

  // Plan base (para poblar el dropdown de "Guardar en el cuatrimestre X"): sabe
  // cuántos cuatrimestres usa el plan hoy → ofrecemos esos + uno nuevo.
  const PL = state.plan;
  const cuatriOptions = useMemo(() => {
    const base = optimizePlan(PL, state.approved, state.fixedCom);
    let maxUsed = -1;
    base.items.forEach((it, i) => {
      if (it.length) maxUsed = i;
    });
    const upto = Math.min(Math.max(maxUsed + 1, 2), MAX_PLAN_CUATRIS - 1);
    const opts: { value: string; label: string; title: string }[] = [];
    for (let i = 0; i <= upto; i++) {
      // los cuatrimestres finalizados (candado en el Plan) no son destino válido
      if (PL.lockedIdx.has(i)) continue;
      const c = cuatriAt(PL.start, i);
      opts.push({ value: String(i), label: cuatriName(c), title: cuatriLabel(c) });
    }
    return opts;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    PL.pool,
    PL.fixed,
    PL.start,
    PL.maxCred,
    PL.maxMat,
    PL.avoid,
    PL.method,
    PL.capCredByIdx,
    PL.capMatByIdx,
    PL.lockedIdx,
    state.approved,
    state.fixedCom,
  ]);

  // si el destino elegido dejó de ofrecerse (p. ej. se lockeó ese cuatri en el
  // Plan), cae a "" = Auto en vez de guardar en un cuatrimestre finalizado.
  const safeSaveIdx = cuatriOptions.some((o) => o.value === saveIdx)
    ? saveIdx
    : "";

  const noResults = filtered.obs.length === 0 && filtered.els.length === 0;
  const showPicker = pickerOpen || selected.length === 0;
  const canExport = total > 0 && Boolean(ranked[safeIdx]);

  // ---------- acciones del cluster derecho ----------
  const downloadCombo = (
    opts: { includeCalendar?: boolean; includeSpecs?: boolean },
    filename: string,
  ) => {
    const placed = ranked[safeIdx];
    if (!placed) return;
    openForPrint(
      buildComboHTML({
        placed,
        generado: nowStr(),
        periodo: PERIODO,
        autoPrint: true,
        ...opts,
      }),
      filename,
    );
    setDlOpen(false);
  };

  // Guardar preferencia: transfiere la combinación elegida al Plan de cursada,
  // fijándola en el cuatrimestre elegido (idx) o dejándola en "Auto" para que el
  // optimizador la ubique. Las comisiones ya viajan por el `fixedCom` compartido.
  const savePreference = () => {
    const placed = ranked[safeIdx];
    if (!placed) return;
    const targetIdx = safeSaveIdx === "" ? undefined : Number(safeSaveIdx);
    dispatch({
      type: "PLAN_SAVE_PREFERENCE",
      codes: placed.map((x) => x.m.codigo),
      idx: targetIdx,
    });
    setSaveOpen(false);
  };

  // ---------- sub-render: fila del buscador ----------
  const row = (m: MateriaM) => {
    const added = combo.has(m.codigo);
    const coms = m.horario?.comisiones.length || 0;
    return (
      <button
        type="button"
        key={m.codigo}
        className={"cmb-row" + (added ? " is-added" : "")}
        onClick={() => dispatch({ type: "TOGGLE_COMBO", code: m.codigo })}
        title={added ? "Quitar de tu cuatrimestre" : "Agregar a tu cuatrimestre"}
      >
        <span className="cmb-row__plus" aria-hidden="true">
          {added ? "✓" : "+"}
        </span>
        <span className="cmb-row__main">
          <span className="cmb-row__name">{m.nombre}</span>
          <span className="cmb-row__meta">
            <span className="cmb-row__code">{m.codigo}</span>
            <span>{m.abbr}</span>
            <span>· {m.creditos} cr</span>
            {coms > 1 && <span>· {coms} com.</span>}
          </span>
          {hasPrograma(m.codigo) ? (
            <ProgramaChips codigo={m.codigo} showEval={false} />
          ) : (
            <ComingSoonBadge short />
          )}
        </span>
        <span className="cmb-row__cr">{m.creditos}</span>
      </button>
    );
  };

  // ---------- sub-render: chip de materia elegida (con CommissionSelect) ----------
  const chip = (m: MateriaM, i: number) => {
    const coms = m.horario?.comisiones || [];
    const fx = fixedCom.get(m.codigo);
    return (
      <span
        className="cmb-chip"
        key={m.codigo}
        style={{ "--chip-c": PALETTE[i % PALETTE.length] } as React.CSSProperties}
      >
        <span className="cmb-chip__abbr">{m.abbr}</span>
        <span className="cmb-chip__cr">{m.creditos}cr</span>
        {coms.length > 1 && (
          <CommissionSelect
            size="sm"
            className="cmb9-chip__com"
            placeholder="Auto"
            title="Auto: el combinador elige la comisión que arma la semana más compacta. Fijá una para forzarla."
            aria-label={`Comisión de ${m.nombre}`}
            value={fx || ""}
            options={coms.map((c) => ({
              value: c.comision,
              label: `com ${c.comision} · ${comModalidad(c)}`,
              title: comTitle(c),
            }))}
            onChange={(e) =>
              dispatch({
                type: "SET_FIXED_COM",
                code: m.codigo,
                comision: e.target.value || null,
              })
            }
          />
        )}
        <button
          type="button"
          className="cmb-chip__x"
          aria-label={`Quitar ${m.abbr}`}
          onClick={() => dispatch({ type: "TOGGLE_COMBO", code: m.codigo })}
        >
          ×
        </button>
      </span>
    );
  };

  // ---------- sub-render: header compacto ----------
  const header = (
    <header className="cmb9-header">
      <div className="cmb9-header__left">
        <div className="cmb9-mats">
          <span className="cmb9-mats__lbl">Materias</span>
          {selected.length > 0 ? (
            <>
              {selected.map(chip)}
              <button
                type="button"
                className={"cmb2-add" + (showPicker ? " is-open" : "")}
                onClick={() => setPickerOpen((o) => !o)}
              >
                {showPicker ? "Listo" : "＋ Agregar"}
              </button>
              <button
                type="button"
                className="cmb2-clear"
                onClick={() => dispatch({ type: "RESET_COMBO" })}
              >
                Vaciar
              </button>
            </>
          ) : (
            <button
              type="button"
              className="cmb2-add"
              onClick={() => setPickerOpen((o) => !o)}
            >
              ＋ Elegí las materias a cursar
            </button>
          )}
        </div>

        {selected.length > 0 && (
          <>
            <span className="cmb9-div" aria-hidden="true" />
            <div className="cmb9-prefs">
              {/* Label + tooltip: qué hace "Auto" en los selectores de comisión */}
              {hasComChoice && (
                <span className="cmb9-cominfo">
                  Comisión: <b>Auto</b>
                  <InfoTip
                    label="Qué hace Auto en las comisiones"
                    text="Cada materia con más de una comisión tiene su selector. Dejá «Auto» y el combinador elige la comisión que arma la semana más compacta; o fijá una vos."
                  />
                </span>
              )}
              <div className="cmb-prefs__modal" title="Modalidad de cursada">
                {MODAL_KEYS.map((k) => (
                  <button
                    type="button"
                    key={k}
                    className={"cmb-pill" + (comboParams.modal[k] ? " on" : "")}
                    aria-pressed={comboParams.modal[k]}
                    onClick={() =>
                      dispatch({
                        type: "SET_MODAL",
                        key: k,
                        value: !comboParams.modal[k],
                      })
                    }
                  >
                    {k}
                  </button>
                ))}
              </div>
              <button
                type="button"
                className={"cmb-switch" + (comboParams.allowOverlap ? " on" : "")}
                role="switch"
                aria-checked={comboParams.allowOverlap}
                title="Permitir cursadas que se superponen"
                onClick={() =>
                  dispatch({
                    type: "SET_ALLOW_OVERLAP",
                    value: !comboParams.allowOverlap,
                  })
                }
              >
                <span className="cmb-switch__track">
                  <span className="cmb-switch__knob" />
                </span>
                Superponer
              </button>
            </div>
          </>
        )}
      </div>

      <div className="cmb9-header__right">
        {/* Modo libre efímero: combina horarios ignorando las aprobadas */}
        <button
          type="button"
          className={"cmb9-hbtn" + (comboSolo ? " is-on" : "")}
          aria-pressed={comboSolo}
          title={
            comboSolo
              ? "Modo libre activo — se ignoran tus materias aprobadas. Tocá para volver a tu cursada real"
              : "Combiná horarios ignorando tu progreso de cursada: ofrece también las materias que ya aprobaste"
          }
          onClick={() => {
            setSaveOpen(false);
            dispatch({ type: "SET_COMBO_SOLO", value: !comboSolo });
          }}
        >
          Solo combinar
        </button>

        <button
          type="button"
          className={"cmb9-hbtn" + (recOpen ? " is-on" : "")}
          aria-pressed={recOpen}
          title={
            recOpen
              ? "Ocultar el recomendador de materias"
              : "Mostrar el recomendador de materias"
          }
          onClick={() => setRecOpen((o) => !o)}
        >
          <IconLayers size={13} />
          Sugeridas <span className="cmb9-hbtn__count">· {suggestions.length}</span>
        </button>

        <div className="cmb9-dl" ref={dlRef}>
          <button
            type="button"
            className="cmb9-hbtn"
            aria-haspopup="menu"
            aria-expanded={dlOpen}
            disabled={!canExport}
            onClick={() => {
              setSaveOpen(false);
              setDlOpen((o) => !o);
            }}
          >
            <IconDownload size={13} />
            Descargar
          </button>
          {dlOpen && (
            <div className="cmb9-dlmenu" role="menu" aria-label="Opciones de descarga">
              <button
                type="button"
                role="menuitem"
                className="cmb9-dlitem"
                onClick={() =>
                  downloadCombo({ includeSpecs: false }, "cursada-calendario.html")
                }
              >
                <IconCalendar size={16} />
                <span>
                  Solo calendario
                  <small>Grilla semanal, sin listado</small>
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                className="cmb9-dlitem"
                onClick={() => downloadCombo({}, "cursada-completa.html")}
              >
                <IconLayers size={16} />
                <span>
                  Calendario + programa
                  <small>Grilla y detalle de materias/comisiones</small>
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                className="cmb9-dlitem"
                onClick={() =>
                  downloadCombo({ includeCalendar: false }, "cursada-programa.html")
                }
              >
                <IconFileText size={16} />
                <span>
                  Solo programa
                  <small>Listado: créditos, comisión, horario</small>
                </span>
              </button>
            </div>
          )}
        </div>

        {/* «Guardar preferencia» alimenta el Plan de cursada; en modo libre
            (comboSolo) la combinación puede incluir aprobadas → no se ofrece. */}
        {!comboSolo && (
          <div className="cmb9-save" ref={saveRef}>
            <button
              type="button"
              className="cmb9-hbtn cmb9-hbtn--primary"
              aria-haspopup="menu"
              aria-expanded={saveOpen}
              disabled={!canExport}
              title="Guardá estas materias y comisiones en tu Plan de cursada"
              onClick={() => {
                setDlOpen(false);
                setSaveOpen((o) => !o);
              }}
            >
              <svg
                viewBox="0 0 24 24"
                width="13"
                height="13"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M5 4h11l3 3v13H5V4Z" />
                <path d="M8 4v6h8V4M8 14h8" />
              </svg>
              Guardar preferencia
            </button>
            {saveOpen && (
              <div
                className="cmb9-savemenu"
                role="menu"
                aria-label="Guardar esta cursada en tu plan"
              >
                <p className="cmb9-savemenu__lead">
                  Sumá esta cursada a tu <b>Plan de cursada</b>. Elegí en qué
                  cuatrimestre fijarla; el optimizador re-arma el resto alrededor.
                </p>
                <label className="cmb9-savemenu__field">
                  <span className="cmb9-savemenu__lbl">
                    Fijar en el cuatrimestre
                    <InfoTip
                      label="Qué hace Auto al guardar"
                      text="«Auto» deja que el plan la ubique en el mejor cuatrimestre según tu método. O fijala vos en uno puntual. Los cuatrimestres finalizados (candado) no se ofrecen."
                    />
                  </span>
                  <CommissionSelect
                    size="sm"
                    className="cmb9-savemenu__sel"
                    placeholder="Auto — que el plan la ubique"
                    aria-label="Cuatrimestre donde fijar la cursada"
                    value={safeSaveIdx}
                    options={cuatriOptions}
                    onChange={(e) => setSaveIdx(e.target.value)}
                  />
                </label>
                <button
                  type="button"
                  className="cmb9-savemenu__go"
                  onClick={savePreference}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path d="M5 4h11l3 3v13H5V4Z" />
                    <path d="M8 4v6h8V4M8 14h8" />
                  </svg>
                  Guardar en el plan
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );

  // ---------- sub-render: buscador desplegable ----------
  const picker = showPicker && (
    <div className="cmbx-picker">
      <div className="cmb-search">
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.7">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscá una materia (código o nombre)…"
          autoComplete="off"
        />
        {q && (
          <button
            type="button"
            className="cmb-search__clear"
            aria-label="Limpiar búsqueda"
            onClick={() => setQ("")}
          >
            ×
          </button>
        )}
      </div>
      <div className="cmb-list">
        {filtered.obs.length > 0 && (
          <div className="cmb-group">
            <div className="cmb-grouph">
              <span className="dot dot--ob" /> Obligatorias
              <i>{filtered.obs.length}</i>
            </div>
            {filtered.obs.map(row)}
          </div>
        )}
        {filtered.els.length > 0 && (
          <div className="cmb-group">
            <div className="cmb-grouph">
              <span className="dot dot--el" /> Electivas
              <i>{filtered.els.length}</i>
            </div>
            {filtered.els.map(row)}
          </div>
        )}
        {noResults && <p className="cmb-noresults">No hay materias con “{q}”.</p>}
      </div>
    </div>
  );

  // ---------- sub-render: recomendador slim (cualquier materia) ----------
  const recSide = recOpen && (
    <aside
      className="cmb9-recside"
      aria-label="Materias sugeridas para tu cuatrimestre"
    >
      <div className="cmb9-rechead">
        <span className="cmb9-rechead__title">Sugeridas</span>
        <span className="cmb9-rechead__count">
          {suggestions.length} para sumar
        </span>
      </div>
      {suggestions.length === 0 ? (
        <p className="cmb9-recempty">No quedan materias para sugerir ahora.</p>
      ) : (
        <ul className="recrow-list">
          {suggestions.map(({ m, fit }) => (
            <RecRow
              key={m.codigo}
              m={m}
              muted={!fit}
              signals={fit ? undefined : <RecSig tone="bad">se pisa</RecSig>}
              title={
                fit
                  ? undefined
                  : `${m.nombre} — se superpone con tu semana actual; activá «Superponer» o fijá otra comisión`
              }
              addLabel={`Agregar ${m.nombre} a tu cuatrimestre`}
              onAdd={() => dispatch({ type: "TOGGLE_COMBO", code: m.codigo })}
              onOpen={() => dispatch({ type: "OPEN_DRAWER", code: m.codigo })}
            />
          ))}
        </ul>
      )}
    </aside>
  );

  // ---------- sub-render: cuerpo (empty / resultado / sin solución) ----------
  const body =
    selected.length === 0 ? (
      <div className="cmb2-empty">
        <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.3">
          <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
          <path d="M3 9h18M8 2.5v4M16 2.5v4" />
          <path d="M7 13h3M13.5 13h3.5M7 16.5h3" strokeWidth="1.5" />
        </svg>
        <p>
          Elegí materias y acá vas a ver tu semana armada, con todas las cursadas
          que entran sin pisarse.
        </p>
      </div>
    ) : result && total > 0 && grid ? (
      <>
        <div className="cmbx-resultbar">
          <div className="cmbx-resultbar__lead">
            <div
              className={"cmbx-rcount" + (comboParams.allowOverlap ? " warn" : " ok")}
            >
              <b>
                {total}
                {result.truncated ? "+" : ""}
              </b>
              <span>
                {comboParams.allowOverlap
                  ? total === 1
                    ? "combinación posible"
                    : "combinaciones posibles"
                  : total === 1
                    ? "cursada sin superponerse"
                    : "cursadas sin superponerse"}
              </span>
            </div>
            {isCompact && <span className="cmbx-tag">la más compacta</span>}
          </div>

          {insights && (
            <div className="cmbx-statstrip">
              <span className="cmbx-statstrip__cred">
                <b>{cred}</b> créditos{elc > 0 ? ` · ${elc} elec.` : ""}
              </span>
              <span>
                <b>{insights.dias}</b>{" "}
                {insights.dias === 1 ? "día con clase" : "días con clase"}
              </span>
              <span>
                <b>{insights.libres}</b>{" "}
                {insights.libres === 1 ? "libre" : "libres"}
              </span>
              <span>
                <b>{insights.horas}</b> h/sem
              </span>
              <span className="cmbx-statstrip__range">{insights.rango}</span>
            </div>
          )}

          {total > 1 && (
            <div className="cmbx-pager" title="Recorré las opciones con ← →">
              <button
                type="button"
                className="cmbx-pager__btn"
                aria-label="Opción anterior"
                onClick={() => setIdx((i) => (i - 1 + total) % total)}
              >
                ‹
              </button>
              <span className="cmbx-pager__txt" aria-live="polite" aria-atomic="true">
                Opción <b>{safeIdx + 1}</b>
                <i>de {total}{result.truncated ? "+" : ""}</i>
              </span>
              <button
                type="button"
                className="cmbx-pager__btn"
                aria-label="Opción siguiente"
                onClick={() => setIdx((i) => (i + 1) % total)}
              >
                ›
              </button>
            </div>
          )}
        </div>

        <div className="cmb9-row">
          <div className="cmb9-cal cmbcal-wrap" key={safeIdx}>
            <CursadaCalendar
              blocks={grid.blocks}
              days={DAYS6}
              dense
              onBlockClick={(code) => dispatch({ type: "OPEN_DRAWER", code })}
            />
            {grid.asyncs.length > 0 && (
              <div className="async-row">
                <span className="lbl">Asincrónico / otros</span>
                {grid.asyncs.map((a, i) => (
                  <span
                    className="async-chip"
                    style={{ borderLeft: `3px solid ${a.color}` }}
                    key={i}
                  >
                    {a.abbr} · {a.dia} {a.desde}–{a.hasta}
                    {a.sala ? " · " + a.sala : ""}
                  </span>
                ))}
              </div>
            )}
            <Legend entries={grid.entries} />
          </div>

          {recSide}
        </div>
      </>
    ) : (
      <div className="cmb-nosol">
        <div className="cmb-nosol__icon" aria-hidden="true">
          ⚠
        </div>
        <h4>No entra ninguna cursada sin que se pisen</h4>
        <p>
          Probá permitir que se superpongan, fijar otra comisión o sacar alguna
          materia.
        </p>
        {!comboParams.allowOverlap && (
          <button
            type="button"
            className="cmb-nosol__cta"
            onClick={() => dispatch({ type: "SET_ALLOW_OVERLAP", value: true })}
          >
            Permitir que se superpongan
          </button>
        )}
        {result && result.conflictPairs.length > 0 && (
          <div className="cmb-conflicts">
            <span className="cmb-conflicts__h">Se pisan entre sí</span>
            {result.conflictPairs.map(([a, b], i) => (
              <div className="cmb-conflict" key={i}>
                <b>{a.abbr}</b> {a.nombre}
                <span className="cmb-conflict__x">⨯</span>
                <b>{b.abbr}</b> {b.nombre}
              </div>
            ))}
          </div>
        )}
      </div>
    );

  return (
    <section className="view-panel" id="panel-combo">
      <div className="panel-head">
        <h2>Armá tu cuatrimestre</h2>
        <p>
          Elegí materias, ajustá cómo querés cursar y mirá —en vivo— todas las
          cursadas que entran sin pisarse.
        </p>
      </div>

      <div className="cmb9">
        {header}
        {picker}
        {body}
      </div>
    </section>
  );
}
