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
import { CAP, generateCombos } from "@/lib/planner/combos";
import { Legend } from "@/components/planner/WeekGrid";
import type { LegendEntry } from "@/components/planner/WeekGrid";
import type { Materia, MateriaM, Slot, WeekBlock } from "@/lib/planner/types";

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

/**
 * Timetable de la cursada: calendario semanal diseñado (no la grilla utilitaria).
 * Bloques con el color de la materia, días libres marcados, ensamblado escalonado.
 */
function CursadaCalendar({
  blocks,
  days,
}: {
  blocks: WeekBlock[];
  days: string[];
}) {
  const PX = 0.82;
  let minM = 8 * 60;
  let maxM = 22 * 60;
  blocks.forEach((b) => {
    minM = Math.min(minM, toMin(b.desde));
    maxM = Math.max(maxM, toMin(b.hasta));
  });
  minM = Math.floor(minM / 60) * 60;
  maxM = Math.ceil(maxM / 60) * 60;
  const hours: number[] = [];
  for (let t = minM; t < maxM; t += 60) hours.push(t);
  const bodyH = (maxM - minM) * PX;
  const cols = `46px repeat(${days.length}, minmax(0, 1fr))`;
  let order = 0;

  return (
    <div className="cmbcal">
      <div className="cmbcal__head" style={{ gridTemplateColumns: cols }}>
        <span className="cmbcal__corner" />
        {days.map((d) => {
          const n = blocks.filter((b) => b.dia === d).length;
          return (
            <div
              className={"cmbcal__day" + (n === 0 ? " is-free" : "")}
              key={d}
            >
              {d.slice(0, 3)}
              {n > 0 && <i>{n}</i>}
            </div>
          );
        })}
      </div>
      <div
        className="cmbcal__body"
        style={{ gridTemplateColumns: cols, height: bodyH }}
      >
        <div className="cmbcal__gutter">
          {hours.map((t) => (
            <div className="cmbcal__hour" style={{ height: 60 * PX }} key={t}>
              <span>{String(t / 60).padStart(2, "0")}:00</span>
            </div>
          ))}
        </div>
        {days.map((d) => {
          const dayBlocks = blocks.filter((b) => b.dia === d);
          return (
            <div
              className={"cmbcal__col" + (dayBlocks.length === 0 ? " is-free" : "")}
              key={d}
            >
              {hours.map((t) => (
                <div className="cmbcal__cell" style={{ height: 60 * PX }} key={t} />
              ))}
              {dayBlocks.length === 0 && (
                <span className="cmbcal__freelbl">libre</span>
              )}
              {dayBlocks.map((b, i) => {
                const top = (toMin(b.desde) - minM) * PX;
                const h = (toMin(b.hasta) - toMin(b.desde)) * PX;
                const idx = order++;
                return (
                  <div
                    key={i}
                    className={"cmbcal-blk" + (b.conf ? " is-conf" : "")}
                    style={
                      {
                        top,
                        height: h,
                        "--blk": b.color,
                        "--i": idx,
                      } as React.CSSProperties
                    }
                    title={`${b.nombre}${b.sala ? " · " + b.sala : ""}${b.modalidad ? " · " + b.modalidad : ""}`}
                  >
                    <span className="cmbcal-blk__abbr">{b.abbr}</span>
                    <span className="cmbcal-blk__time">
                      {b.desde}–{b.hasta}
                    </span>
                    {b.sala && h > 38 && (
                      <span className="cmbcal-blk__room">{b.sala}</span>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Armá tu cuatrimestre — combinador guiado en 3 pasos, calendario-first.
 * 1) Elegí materias (chips + buscador desplegable) · 2) Preferencias ·
 * 3) Cursada (insights + calendario grande + paginador). Todo en vivo.
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
  useEffect(() => {
    setIdx(0);
  }, [result]);

  const total = result?.combos.length ?? 0;
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
    const current = result?.combos[safeIdx];
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
          blocks.push({ ...s, abbr: x.m.abbr, nombre: x.m.nombre, color });
        }
      });
    });
    blocks.forEach((a) => {
      a.conf = blocks.some((b) => b !== a && slotsConflict(a, b));
    });
    return { blocks, asyncs, entries };
  }, [result, safeIdx]);

  // ---------- insights de la cursada actual ----------
  const insights = useMemo(() => {
    if (!grid || !grid.blocks.length) return null;
    let totalMin = 0;
    let minStart = Infinity;
    let maxEnd = -Infinity;
    const days = new Set<string>();
    grid.blocks.forEach((b) => {
      totalMin += toMin(b.hasta) - toMin(b.desde);
      minStart = Math.min(minStart, toMin(b.desde));
      maxEnd = Math.max(maxEnd, toMin(b.hasta));
      days.add(b.dia);
    });
    const weekdayClasses = [...days].filter((d) => DAYS.includes(d)).length;
    return {
      horas: Math.round((totalMin / 60) * 10) / 10,
      dias: days.size,
      libres: Math.max(0, DAYS.length - weekdayClasses),
      rango: `${hhmm(minStart)}–${hhmm(maxEnd)}`,
    };
  }, [grid]);

  const noResults = filtered.obs.length === 0 && filtered.els.length === 0;
  const showPicker = pickerOpen || selected.length === 0;

  // ---------- sub-render ----------
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

  return (
    <section className="view-panel" id="panel-combo">
      <div className="panel-head">
        <h2>Armá tu cuatrimestre</h2>
        <p>
          Elegí materias, ajustá cómo querés cursar y mirá —en vivo— todas las
          cursadas que entran sin pisarse.
        </p>
      </div>

      <div className="cmb2">
        {/* ===== PASO 1 — MATERIAS ===== */}
        <section className="cmb2-card">
          <header className="cmb2-step">
            <span className="cmb2-step__n">1</span>
            <span className="cmb2-step__t">Elegí tus materias</span>
            {selected.length > 0 && (
              <span className="cmb2-step__count">
                {selected.length} · {cred} cr
                {elc > 0 ? ` · ${elc} elec.` : ""}
              </span>
            )}
          </header>

          {selected.length > 0 ? (
            <div className="cmb-chips">
              {selected.map(chip)}
              <button
                type="button"
                className="cmb2-add"
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
            </div>
          ) : (
            <p className="cmb2-hint">
              Buscá abajo y tocá <b>+</b> para sumar las materias que querés
              cursar este cuatrimestre.
            </p>
          )}

          {showPicker && (
            <div className="cmb2-picker">
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
          )}
        </section>

        {/* ===== PASO 2 — PREFERENCIAS ===== */}
        <section className="cmb2-card cmb2-card--prefs">
          <header className="cmb2-step">
            <span className="cmb2-step__n">2</span>
            <span className="cmb2-step__t">¿Cómo querés cursar?</span>
          </header>
          <div className="cmb-prefs">
            <button
              type="button"
              className={"cmb-switch" + (comboParams.allowOverlap ? " on" : "")}
              role="switch"
              aria-checked={comboParams.allowOverlap}
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
              Permitir que se superpongan
            </button>
            <div className="cmb-prefs__modal">
              <span className="cmb-prefs__lbl">Modalidad</span>
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
        </section>

        {/* ===== PASO 3 — CURSADA ===== */}
        <section className="cmb2-card cmb2-stage">
          <header className="cmb2-step">
            <span className="cmb2-step__n">3</span>
            <span className="cmb2-step__t">Tu cursada</span>
          </header>

          {selected.length === 0 ? (
            <div className="cmb2-empty">
              <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.3">
                <rect x="3" y="4.5" width="18" height="16" rx="2.5" />
                <path d="M3 9h18M8 2.5v4M16 2.5v4" />
                <path d="M7 13h3M13.5 13h3.5M7 16.5h3" strokeWidth="1.5" />
              </svg>
              <p>
                Cuando agregues materias, acá vas a ver tu semana armada.
              </p>
            </div>
          ) : result && total > 0 && grid ? (
            <>
              <div className="cmb-hero">
                <div
                  className={
                    "cmb-hero__count " +
                    (comboParams.allowOverlap ? "warn" : "ok")
                  }
                >
                  <b>
                    {total}
                    {result.truncated ? "+" : ""}
                  </b>
                  <span>
                    {comboParams.allowOverlap
                      ? total === 1
                        ? "opción posible"
                        : "opciones posibles"
                      : total === 1
                        ? "cursada posible"
                        : "cursadas posibles"}
                  </span>
                </div>
                {total > 1 && (
                  <div className="cmb-pager">
                    <button
                      type="button"
                      className="cmb-pager__btn"
                      aria-label="Opción anterior"
                      onClick={() => setIdx((i) => (i - 1 + total) % total)}
                    >
                      ‹
                    </button>
                    <span className="cmb-pager__txt">
                      <b>{safeIdx + 1}</b> / {total}
                      {total >= CAP ? "+" : ""}
                    </span>
                    <button
                      type="button"
                      className="cmb-pager__btn"
                      aria-label="Opción siguiente"
                      onClick={() => setIdx((i) => (i + 1) % total)}
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>

              {insights && (
                <div className="cmb-insights">
                  <span className="cmb-insight">
                    <b>{insights.horas}</b> h/sem
                  </span>
                  <span className="cmb-insight">
                    <b>{insights.dias}</b> {insights.dias === 1 ? "día" : "días"}{" "}
                    con clase
                  </span>
                  <span className="cmb-insight">
                    <b>{insights.libres}</b> libres
                  </span>
                  <span className="cmb-insight cmb-insight--range">
                    {insights.rango}
                  </span>
                </div>
              )}

              <div className="cmbcal-wrap" key={safeIdx}>
                <CursadaCalendar blocks={grid.blocks} days={DAYS6} />
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
                Probá permitir que se superpongan, fijar otra comisión o sacar
                alguna materia.
              </p>
              {!comboParams.allowOverlap && (
                <button
                  type="button"
                  className="cmb-nosol__cta"
                  onClick={() =>
                    dispatch({ type: "SET_ALLOW_OVERLAP", value: true })
                  }
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
      </div>
    </section>
  );
}
