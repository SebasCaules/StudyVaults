"use client";

/**
 * PlanRail — rail derecho unificado de la vista "Plan de cursada".
 *
 * Reúne en un solo panel sticky las dos gestiones que antes vivían dispersas al
 * fondo de la vista: el editor del pool (tab "Materias") y el recomendador de
 * electivas (tab "Recomendadas"). El estado del pool se lee/escribe adentro vía
 * usePlanner(); PlanView controla qué tab está activo y le pasa las recos ya
 * computadas (o [] si el tab no es "recs", para no correr el optimizador de
 * balde).
 *
 * Migra la lógica de `PlanPool` y `Recommendations` (PlanView.tsx) al lenguaje
 * de FILAS SLIM aprobado en el Combinador: nada de cards grandes, una fila fina
 * por materia. Prefijo de clases `prl-`, tonos calcados de planview.css.
 */

import { useMemo, useState } from "react";
import { usePlanner } from "@/components/planner/state";
import {
  byId,
  isElectiva,
  hasHorario,
  planPriority,
  PLAN,
} from "@/lib/planner/model";
import { comModalidad } from "@/lib/planner/time";
import { cuatriAt, cuatriLabel } from "@/lib/planner/optimize";
import { MINORS, minorsOf } from "@/lib/planner/minors";
import { ELEC_REQ, MinorDots } from "@/components/planner/plan/shared";
import { MAX_PLAN_CUATRIS } from "@/lib/planner/consts";
import { CommissionSelect } from "@studyvaults/ui";
import { IconClose, IconPlus } from "@/components/planner/icons";
import type { MateriaM, PlanStart } from "@/lib/planner/types";
import type { Recommendation } from "@/lib/planner/recommend";
import "./plan-rail.css";

export type RailTab = "mats" | "recs";

const TAB_ORDER: RailTab[] = ["mats", "recs"];

export default function PlanRail({
  start,
  tab,
  onTab,
  recs,
  elecTotal,
  preview,
  onPreview,
}: {
  start: PlanStart;
  /** tab activo (controlado por PlanView). */
  tab: RailTab;
  onTab: (t: RailTab) => void;
  /** recos ya rankeadas; [] cuando `tab !== "recs"` (no se computan). */
  recs: Recommendation[];
  /** créditos electivos comprometidos (para el "te faltan N"). */
  elecTotal: number;
  preview: string | null;
  onPreview: (code: string | null) => void;
}): React.JSX.Element {
  const { state, dispatch } = usePlanner();

  /* ---- pool pendiente (obligatorias + electivas, sin las aprobadas) ---- */
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

  const pendCount = obs.length + els.length;
  // badge de "Recomendadas": las que entran sin alargar la carrera (las buenas).
  const recFitCount = recs.filter((r) => !r.conflict && !r.addsCuatri).length;

  /* ---- opciones de cuatrimestre para el select de "fijar" ---- */
  const cuatriOpts = useMemo(
    () =>
      Array.from({ length: MAX_PLAN_CUATRIS }, (_, i) => ({
        value: String(i),
        label: cuatriLabel(cuatriAt(start, i)),
      })),
    [start],
  );

  /* ---- buscador para agregar electivas ---- */
  const [query, setQuery] = useState("");
  const [suggOpen, setSuggOpen] = useState(false);
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
      .slice(0, 10);
  }, [query, state.plan.pool, state.approved]);

  /* ---- filtros del recomendador (mismo criterio que Recommendations) ---- */
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

  /* ---- navegación por teclado del segmentado (roving tabindex) ---- */
  const onTablistKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const cur = TAB_ORDER.indexOf(tab);
    let next: number;
    if (e.key === "ArrowLeft")
      next = (cur + TAB_ORDER.length - 1) % TAB_ORDER.length;
    else if (e.key === "ArrowRight") next = (cur + 1) % TAB_ORDER.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = TAB_ORDER.length - 1;
    else return;
    e.preventDefault();
    onTab(TAB_ORDER[next]);
    const tabs =
      e.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    tabs[next]?.focus();
  };

  /* ---------- fila de materia (tab Materias) ---------- */
  const matRow = (m: MateriaM, removable: boolean) => {
    const fx = state.plan.fixed.get(m.codigo);
    return (
      <div
        className={"prl-row" + (fx !== undefined ? " is-fixed" : "")}
        key={m.codigo}
      >
        <div className="prl-row__id">
          <MinorDots m={m} />
          <span className="prl-row__abbr">{m.abbr}</span>
          <button
            type="button"
            className="prl-row__name"
            title={`${m.nombre} · ${m.codigo}`}
            onClick={() => dispatch({ type: "OPEN_DRAWER", code: m.codigo })}
          >
            {m.nombre}
          </button>
          <span className="prl-row__cr">{m.creditos} cr</span>
          {removable && (
            <button
              type="button"
              className="prl-row__rm"
              aria-label={`Quitar ${m.nombre} del plan`}
              onClick={() =>
                dispatch({ type: "PLAN_POOL_REMOVE", code: m.codigo })
              }
            >
              <IconClose size={12} />
            </button>
          )}
        </div>
        <div className="prl-row__tools">
          <select
            className="prl-sel"
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
            {cuatriOpts.map((o) => (
              <option value={o.value} key={o.value}>
                {o.label}
              </option>
            ))}
          </select>
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
          {!hasHorario(m.codigo) && (
            <span className="prl-row__nohor">sin horario</span>
          )}
        </div>
      </div>
    );
  };

  const matsPanel = (
    <>
      <div className="prl-add">
        <svg
          className="prl-add__ic"
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
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
          <div className="prl-sugg">
            {matches.length ? (
              matches.map((m) => (
                <div
                  key={m.codigo}
                  // onMouseDown para ganarle al blur del input (si no, el click
                  // se pierde porque el input pierde el foco y cierra el popover).
                  onMouseDown={() => {
                    dispatch({ type: "PLAN_POOL_ADD", code: m.codigo });
                    setQuery("");
                    setSuggOpen(false);
                  }}
                >
                  <span className="prl-sugg__c">{m.codigo}</span>
                  <span className="prl-sugg__n">
                    {m.abbr} — {m.nombre}
                  </span>
                  {!hasHorario(m.codigo) && (
                    <span className="prl-sugg__nh">sin horario</span>
                  )}
                </div>
              ))
            ) : (
              <div className="prl-sugg__none">Sin resultados</div>
            )}
          </div>
        )}
      </div>

      {els.length > 0 ? (
        <>
          <div className="prl-seclbl">
            Electivas en tu plan <i>{els.length}</i>
          </div>
          <div className="prl-list">{els.map((m) => matRow(m, true))}</div>
        </>
      ) : (
        <div className="prl-empty">
          <p>Ninguna electiva agregada.</p>
          <p className="prl-empty__hint">
            Buscá una arriba o mirá las{" "}
            <button
              type="button"
              className="prl-empty__link"
              onClick={() => onTab("recs")}
            >
              recomendadas
            </button>
            .
          </p>
        </div>
      )}

      {obs.length > 0 && (
        <details className="prl-oblig">
          <summary>
            <span className="prl-oblig__t">Obligatorias pendientes</span>
            <span className="prl-oblig__n">{obs.length}</span>
          </summary>
          <div className="prl-list prl-list--oblig">
            {obs.map((m) => matRow(m, true))}
          </div>
        </details>
      )}
    </>
  );

  /* ---------- fila de recomendación (tab Recomendadas) ---------- */
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
  const noExtiende = fRecs.filter((r) => !r.conflict && !r.addsCuatri);
  const extiende = fRecs.filter((r) => !r.conflict && r.addsCuatri);
  const noEntra = fRecs.filter((r) => r.conflict);
  const faltan = Math.max(0, ELEC_REQ - elecTotal);

  const recRow = (r: Recommendation) => (
    <div
      key={r.m.codigo}
      className={
        "prl-rec" +
        (preview === r.m.codigo ? " is-active" : "") +
        (r.conflict ? " is-conf" : "") +
        (r.noHorario ? " is-nohor" : "")
      }
      // hover/focus de la fila → preview del board; salir → apagar.
      onMouseEnter={() => !r.conflict && onPreview(r.m.codigo)}
      onMouseLeave={() => onPreview(null)}
      onFocus={() => !r.conflict && onPreview(r.m.codigo)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) onPreview(null);
      }}
    >
      <div className="prl-rec__id">
        <MinorDots m={r.m} />
        <span className="prl-rec__abbr">{r.m.abbr}</span>
        <button
          type="button"
          className="prl-rec__name"
          title={`${r.m.nombre} · ${r.m.codigo}`}
          onClick={() => dispatch({ type: "OPEN_DRAWER", code: r.m.codigo })}
        >
          {r.m.nombre}
        </button>
        <span className="prl-rec__cr">{r.m.creditos} cr</span>
        <button
          type="button"
          className="prl-rec__add"
          aria-label={`Agregar ${r.m.nombre} al plan`}
          onClick={() => {
            dispatch({ type: "PLAN_POOL_ADD", code: r.m.codigo });
            onPreview(null);
          }}
        >
          <IconPlus size={12} />
        </button>
      </div>
      <div className="prl-rec__fit">
        {r.conflict ? (
          <span className="prl-fit prl-fit--bad">no entra sin conflictos</span>
        ) : (
          <>
            <span className="prl-fit prl-fit--when">
              entra en {cuatriLabel(cuatriAt(start, r.landingIdx))}
            </span>
            <span
              className={
                "prl-fit " + (r.addsCuatri ? "prl-fit--warn" : "prl-fit--ok")
              }
            >
              {r.addsCuatri ? "+1 cuatrimestre" : "sin alargar"}
            </span>
            {r.newDays > 0 && (
              <span className="prl-fit prl-fit--soft">
                +{r.newDays} {r.newDays === 1 ? "día" : "días"}
              </span>
            )}
          </>
        )}
        {r.noHorario && <span className="prl-fit prl-fit--nohor">sin horario</span>}
      </div>
    </div>
  );

  // Igual que en Recommendations: no volcamos el grupo entero de golpe (con 0
  // aprobadas "No alargan" trae decenas). Cabecera visible + resto en <details>.
  const HEAD = 8;
  const group = (
    title: string,
    hint: string,
    items: Recommendation[],
    tone: "ok" | "warn" | "bad",
    open: boolean,
  ) =>
    items.length > 0 ? (
      <details className={"prl-grp prl-grp--" + tone} open={open}>
        <summary>
          <span
            className={"prl-grp__dot prl-grp__dot--" + tone}
            aria-hidden="true"
          />
          <span className="prl-grp__title">{title}</span>
          <span className="prl-grp__count">{items.length}</span>
          <span className="prl-grp__hint">{hint}</span>
        </summary>
        <div className="prl-grp__body">
          {items.slice(0, HEAD).map(recRow)}
          {items.length > HEAD && (
            <details className="prl-more">
              <summary>Ver {items.length - HEAD} más</summary>
              <div className="prl-grp__body">{items.slice(HEAD).map(recRow)}</div>
            </details>
          )}
        </div>
      </details>
    ) : null;

  const recsPanel = (
    <>
      <p className="prl-recs__sub">
        {faltan > 0 ? (
          <>
            Te faltan <b>{faltan}</b> créditos electivos.
          </>
        ) : (
          "Ya cubrís los créditos electivos — estas sumarían extra."
        )}
      </p>
      <p className="prl-recs__hint">
        Pasá el cursor sobre una electiva para ver dónde entraría.
      </p>

      <div className="prl-filt" role="group" aria-label="Filtrar electivas">
        <div className="prl-filt__grp">
          <span className="prl-filt__lbl">Minor</span>
          {MINORS.map((mn) => {
            const on = fMinor.includes(mn.id);
            return (
              <button
                key={mn.id}
                type="button"
                className={"prl-fchip" + (on ? " is-on" : "")}
                aria-pressed={on}
                title={mn.name}
                style={{ ["--fchip-color" as string]: mn.color }}
                onClick={() => setFMinor((a) => toggleIn(a, mn.id))}
              >
                <span className="prl-fchip__dot" aria-hidden="true" />
                {mn.short}
              </button>
            );
          })}
        </div>
        <div className="prl-filt__grp">
          <span className="prl-filt__lbl">Régimen</span>
          {[
            { v: 1, l: "1.º" },
            { v: 2, l: "2.º" },
          ].map((o) => {
            const on = fParity.includes(o.v);
            return (
              <button
                key={o.v}
                type="button"
                className={"prl-fchip" + (on ? " is-on" : "")}
                aria-pressed={on}
                onClick={() => setFParity((a) => toggleIn(a, o.v))}
              >
                {o.l}
              </button>
            );
          })}
        </div>
        <div className="prl-filt__grp">
          <span className="prl-filt__lbl">Disp.</span>
          <button
            type="button"
            className={"prl-fchip" + (fHorario ? " is-on" : "")}
            aria-pressed={fHorario}
            onClick={() => setFHorario((v) => !v)}
          >
            con horario
          </button>
        </div>
        {anyFilter && (
          <button
            type="button"
            className="prl-filt__clear"
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

      {recs.length === 0 && (
        <p className="prl-recs__empty">No hay recomendaciones para mostrar.</p>
      )}
      {recs.length > 0 && anyFilter && fRecs.length === 0 && (
        <p className="prl-recs__empty">
          Ninguna electiva coincide con los filtros.{" "}
          <button type="button" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </p>
      )}
    </>
  );

  return (
    <aside className="prl" aria-label="Materias y recomendaciones del plan">
      <div className="prl__head">
        <div
          className="prl__tabs"
          role="tablist"
          aria-label="Contenido del panel"
          onKeyDown={onTablistKeyDown}
        >
          <button
            type="button"
            role="tab"
            id="prl-tab-mats"
            aria-selected={tab === "mats"}
            aria-controls="prl-panel"
            tabIndex={tab === "mats" ? 0 : -1}
            className="prl__tab"
            onClick={() => onTab("mats")}
          >
            Materias
            {pendCount > 0 && <span className="prl__badge">{pendCount}</span>}
          </button>
          <button
            type="button"
            role="tab"
            id="prl-tab-recs"
            aria-selected={tab === "recs"}
            aria-controls="prl-panel"
            tabIndex={tab === "recs" ? 0 : -1}
            className="prl__tab"
            onClick={() => onTab("recs")}
          >
            Recomendadas
            {recFitCount > 0 && <span className="prl__badge">{recFitCount}</span>}
          </button>
        </div>
      </div>

      <div
        className="prl__body"
        id="prl-panel"
        role="tabpanel"
        aria-labelledby={tab === "mats" ? "prl-tab-mats" : "prl-tab-recs"}
      >
        {tab === "mats" ? matsPanel : recsPanel}
      </div>
    </aside>
  );
}
