"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Legend } from "@/components/planner/WeekGrid";
import CursadaCalendar from "@/components/planner/CursadaCalendar";
import type { LegendEntry } from "@/components/planner/WeekGrid";
import type { Materia, MateriaM, PlacedMateria, Slot, WeekBlock } from "@/lib/planner/types";

interface AsyncChip extends Slot {
  abbr: string;
  color: string;
}

const MODAL_KEYS = ["Presencial", "Virtual", "Blended"] as const;
const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
const hhmm = (m: number) =>
  `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

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
    rango:
      minStart === Infinity ? "—" : `${hhmm(minStart)}–${hhmm(maxEnd)}`,
  };
}

/**
 * Armá tu cuatrimestre — combinador con workspace de dos paneles: a la izquierda
 * la configuración (materias + preferencias), a la derecha el resultado en vivo
 * (contador legible + calendario grande + paginador). Las opciones se ordenan de
 * la más compacta (menos días en el campus) a la menos, así la primera ya es una
 * buena cursada. En mobile el orden se reordena a materias → calendario → ajustes.
 */
export default function CombinadorView() {
  const { state, dispatch } = usePlanner();
  const { combo, fixedCom, comboParams } = state;

  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);

  // ---------- materias combinables ----------
  const pool = useMemo(() => {
    const ok = (m: Materia) =>
      hasHorario(m.codigo) && !state.approved.has(m.codigo);
    const obs = PLAN.obligatorias
      .filter(ok)
      .map((m) => byId.get(m.codigo)!)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
    const els = PLAN.electivas
      .filter(ok)
      .map((m) => byId.get(m.codigo)!)
      .sort((a, b) => a.codigo.localeCompare(b.codigo));
    return { obs, els };
  }, [state.approved]);

  const filtered = useMemo(() => {
    const needle = norm(q.trim());
    const match = (m: MateriaM) =>
      !needle || norm(`${m.codigo} ${m.nombre} ${m.abbr}`).includes(needle);
    return { obs: pool.obs.filter(match), els: pool.els.filter(match) };
  }, [pool, q]);

  // selección, ordenada por código (igual que generateCombos → colores alineados)
  const selected = useMemo(
    () =>
      [...combo]
        .filter(hasHorario)
        .sort()
        .map((c) => byId.get(c)!),
    [combo],
  );
  const cred = selected.reduce((s, m) => s + (m.creditos || 0), 0);
  const elc = selected
    .filter((m) => isElectiva(m.codigo))
    .reduce((s, m) => s + credOf(m.codigo), 0);

  // ---------- generación automática ----------
  const result = useMemo(
    () => (combo.size ? generateCombos(combo, fixedCom, comboParams) : null),
    [combo, fixedCom, comboParams],
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
          blocks.push({ ...s, abbr: x.m.abbr, nombre: x.m.nombre, color, codigo: x.m.codigo });
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

  const noResults = filtered.obs.length === 0 && filtered.els.length === 0;
  const showPicker = pickerOpen || selected.length === 0;

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
        </span>
        <span className="cmb-row__cr">{m.creditos}</span>
      </button>
    );
  };

  // ---------- sub-render: chip de materia elegida ----------
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
          <select
            className="cmb-chip__com"
            value={fx || ""}
            title="Fijar comisión"
            onChange={(e) =>
              dispatch({
                type: "SET_FIXED_COM",
                code: m.codigo,
                comision: e.target.value || null,
              })
            }
          >
            <option value="">com. auto</option>
            {coms.map((c) => (
              <option value={c.comision} key={c.comision}>
                com {c.comision} · {comModalidad(c)}
              </option>
            ))}
          </select>
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

  // ---------- sub-render: header compacto (selector de materias + preferencias) ----------
  const topbar = (
    <header className="cmbx-topbar">
      <div className="cmbx-topbar__mats">
        <span className="cmbx-eyebrow__lbl">Materias</span>
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

      <div className="cmbx-topbar__prefs">
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
      </div>
    </header>
  );

  // ---------- sub-render: buscador desplegable (debajo del header) ----------
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
        {noResults && (
          <p className="cmb-noresults">No hay materias con “{q}”.</p>
        )}
      </div>
    </div>
  );

  // ---------- sub-render: stage (área "stage") ----------
  const stage = (
    <section className="cmbx-stage">
      {selected.length === 0 ? (
        <div className="cmb2-empty">
          <svg viewBox="0 0 24 24" width="44" height="44" fill="none" stroke="currentColor" strokeWidth="1.3">
            <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
            <path d="M3 9h18M8 2.5v4M16 2.5v4" />
            <path d="M7 13h3M13.5 13h3.5M7 16.5h3" strokeWidth="1.5" />
          </svg>
          <p>Elegí materias y acá vas a ver tu semana armada, con todas las
            cursadas que entran sin pisarse.</p>
        </div>
      ) : result && total > 0 && grid ? (
        <>
          <div className="cmbx-resultbar">
            <div className="cmbx-resultbar__lead">
              <div
                className={
                  "cmbx-rcount" + (comboParams.allowOverlap ? " warn" : " ok")
                }
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
              {isCompact && (
                <span className="cmbx-tag">✦ la más compacta</span>
              )}
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

          <div className="cmbcal-wrap" key={safeIdx}>
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
      )}
    </section>
  );

  return (
    <section className="view-panel" id="panel-combo">
      <div className="panel-head">
        <h2>Armá tu cuatrimestre</h2>
        <p>
          Elegí materias, ajustá cómo querés cursar y mirá —en vivo, al lado— todas
          las cursadas que entran sin pisarse.
        </p>
      </div>

      <div className="cmbx">
        {topbar}
        {picker}
        {stage}
      </div>
    </section>
  );
}
