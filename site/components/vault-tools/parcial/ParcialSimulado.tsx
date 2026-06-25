"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createDiagramEditor } from "../diagram-editor";
import {
  EXERCISES,
  ENUNCIADOS,
  QA_CATALOG,
  SET_LABELS,
  type Exercise,
} from "./data";

/* ──────────────────────────────────────────────────────────────────────────
   Parcial simulado — práctica fiel al enunciado, con el esquema de puntaje real
   del parcial de Inge de Software (a/b/c/d, 10 pts). Componente client-only:
   todo acceso a window/document/localStorage va dentro de useEffect o de
   handlers de evento (static-export safe).

   Wizard de 4 puntos (refleja la grilla del parcial):
     a [1p] · Punteo de funcionalidades de alto nivel ordenadas por importancia
              (al menos 5 ítems).
     b [2p] · Atributos de calidad principales (elegir 4) con justificación,
              ordenados por importancia — los 4 primeros son los drivers de
              arquitectura del punto c.
     c [5p] · Arquitectura candidata: un diagrama + un textarea grande para
              justificar todas las decisiones (con plantillas que insertan
              estructura en el cursor, p. ej. los 4 atributos del punto b).
     d [2p] · Riesgos / no-riesgos / supuestos / trade-offs (2 de cada uno) +
              export .md.

   Storage key: 'exam-practice-v2-<exerciseId>' (forward-compatible: el modelo
   nuevo agrega campos; los estados viejos se backfillean en loadState).
   ────────────────────────────────────────────────────────────────────────── */

const STORE_PREFIX = "exam-practice-v2-";
const TOP_N = 4;
const NUM_STEPS = 4;

/* ── Tipos del estado ───────────────────────────────────────────────────── */

interface DiagramState {
  nodes: unknown[];
  edges: unknown[];
}
interface DiagramInstance {
  getState: () => DiagramState;
  setState: (s: DiagramState) => void;
  toSVG: () => string;
  destroy: () => void;
}

// Una funcionalidad de alto nivel del punto (a). El orden en el array ES la
// prioridad: el primero es el más importante.
interface FuncItem {
  id: string;
  text: string;
}
interface AttrItem {
  id: string;
  name: string;
  justification: string;
  custom?: boolean;
}
interface Range {
  start: number;
  end: number;
}
interface Annotation {
  highlight: Range[];
  underline: Range[];
}
interface PerAttr {
  breakingScenarios: string;
  diagram: DiagramState;
}
// Una cita = un fragmento del enunciado marcado como evidencia de un atributo
// de calidad (QA). Guarda los spans por párrafo (para repintar la marca) y el
// texto citado (para listarlo y exportarlo aun si cambiara el render).
interface CitationSpan {
  pIdx: number;
  start: number;
  end: number;
}
interface Citation {
  id: string;
  attrId: string;
  spans: CitationSpan[];
  text: string;
}
interface ExamState {
  step: number;
  functionalities: FuncItem[]; // punto (a)
  attrs: AttrItem[]; // punto (b)
  attrOrder: string[]; // punto (b) — orden de importancia
  baseDiagram: DiagramState; // punto (c)
  archJustification: string; // punto (c) — justificación que relaciona arq ↔ QA
  perAttr: Record<string, PerAttr>; // punto (c) — escenarios + refinamiento top-4
  annotations: Record<number, Annotation>;
  citations: Citation[];
  enunciadoCollapsed: boolean;
  risks: string; // punto (d) — riesgos
  nonRisks: string; // punto (d) — no-riesgos
  assumptions: string; // punto (d) — supuestos
  tradeoffs: string; // punto (d) — trade-offs
  notes: string;
  updatedAt: string;
}

const EMPTY_DIAGRAM: DiagramState = { nodes: [], edges: [] };

function defaultState(): ExamState {
  return {
    step: 1,
    functionalities: [],
    attrs: [],
    attrOrder: [],
    baseDiagram: { nodes: [], edges: [] },
    archJustification: "",
    perAttr: {},
    annotations: {},
    citations: [],
    enunciadoCollapsed: false,
    risks: "",
    nonRisks: "",
    assumptions: "",
    tradeoffs: "",
    notes: "",
    updatedAt: new Date().toISOString(),
  };
}

/* ── Persistencia (client-only) ─────────────────────────────────────────── */

function loadState(id: string): ExamState {
  try {
    const raw = window.localStorage.getItem(STORE_PREFIX + id);
    if (!raw) return defaultState();
    const obj = { ...defaultState(), ...JSON.parse(raw) } as ExamState;
    // El modelo nuevo tiene 4 puntos (a/b/c/d). Estados viejos (5–6 pasos)
    // conservan todos sus datos; sólo se reencuadra el paso al rango [1, 4].
    if (typeof obj.step === "number") {
      obj.step = Math.max(1, Math.min(NUM_STEPS, obj.step));
    } else {
      obj.step = 1;
    }
    // Forward-migrate: backfill campos faltantes en attrs persistidos viejos.
    obj.attrs = (obj.attrs || []).map((a) => {
      const raw = a as Partial<AttrItem>;
      return {
        id: raw.id ?? "",
        name: raw.name ?? "",
        justification: raw.justification ?? "",
        custom: raw.custom ?? false,
      };
    });
    if (!Array.isArray(obj.attrOrder) || obj.attrOrder.length === 0) {
      obj.attrOrder = obj.attrs.map((a) => a.id);
    } else {
      const known = new Set(obj.attrs.map((a) => a.id));
      obj.attrOrder = obj.attrOrder.filter((x) => known.has(x));
      obj.attrs.forEach((a) => {
        if (!obj.attrOrder.includes(a.id)) obj.attrOrder.push(a.id);
      });
    }
    if (!obj.annotations || typeof obj.annotations !== "object")
      obj.annotations = {};
    // Backfill de citas: estados viejos no las tenían; saneamos spans inválidos.
    if (!Array.isArray(obj.citations)) obj.citations = [];
    else
      obj.citations = obj.citations
        .filter(
          (c) =>
            c &&
            typeof c.attrId === "string" &&
            Array.isArray(c.spans) &&
            c.spans.length > 0,
        )
        .map((c) => ({
          id: c.id ?? "c" + Math.random().toString(36).slice(2, 9),
          attrId: c.attrId,
          spans: c.spans
            .filter(
              (s) =>
                s &&
                typeof s.pIdx === "number" &&
                typeof s.start === "number" &&
                typeof s.end === "number" &&
                s.end > s.start,
            )
            .map((s) => ({ pIdx: s.pIdx, start: s.start, end: s.end })),
          text: typeof c.text === "string" ? c.text : "",
        }))
        .filter((c) => c.spans.length > 0);
    if (typeof obj.enunciadoCollapsed !== "boolean")
      obj.enunciadoCollapsed = false;
    if (!obj.perAttr || typeof obj.perAttr !== "object") obj.perAttr = {};
    // Backfill de campos del modelo nuevo (punto a y punto d/c).
    obj.functionalities = (Array.isArray(obj.functionalities)
      ? obj.functionalities
      : []
    )
      .filter((f) => f && typeof f === "object")
      .map((f) => {
        const raw = f as Partial<FuncItem>;
        return {
          id: raw.id ?? "f" + Math.random().toString(36).slice(2, 9),
          text: typeof raw.text === "string" ? raw.text : "",
        };
      });
    if (typeof obj.archJustification !== "string") obj.archJustification = "";
    if (typeof obj.nonRisks !== "string") obj.nonRisks = "";
    if (typeof obj.assumptions !== "string") obj.assumptions = "";
    return obj;
  } catch {
    return defaultState();
  }
}

function persist(id: string, state: ExamState) {
  try {
    state.updatedAt = new Date().toISOString();
    window.localStorage.setItem(STORE_PREFIX + id, JSON.stringify(state));
  } catch {
    /* storage lleno / bloqueado — ignorar */
  }
}

function clearStored(id: string) {
  try {
    window.localStorage.removeItem(STORE_PREFIX + id);
  } catch {
    /* ignore */
  }
}

function relTime(iso: string): string {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 5) return "hace instantes";
  if (diff < 60) return `hace ${Math.floor(diff)}s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString("es-AR");
}

const STEP_DEFS: { key: string; label: string; pts: number }[] = [
  { key: "a", label: "Funcionalidades", pts: 1 },
  { key: "b", label: "Atributos de calidad", pts: 2 },
  { key: "c", label: "Arquitectura candidata", pts: 5 },
  { key: "d", label: "Riesgos y trade-offs", pts: 2 },
];

/* ── Utilidades de rangos para las anotaciones ──────────────────────────── */

function mergeRange(ranges: Range[], ns: number, ne: number): Range[] {
  if (ns >= ne) return ranges.slice();
  const result: Range[] = [];
  let inserted = false;
  let cur: Range = { start: ns, end: ne };
  const sorted = ranges.slice().sort((a, b) => a.start - b.start);
  for (const r of sorted) {
    if (r.end < cur.start) {
      result.push(r);
      continue;
    }
    if (r.start > cur.end) {
      if (!inserted) {
        result.push(cur);
        inserted = true;
      }
      result.push(r);
      continue;
    }
    cur = { start: Math.min(cur.start, r.start), end: Math.max(cur.end, r.end) };
  }
  if (!inserted) result.push(cur);
  return result.sort((a, b) => a.start - b.start);
}

function subtractRange(ranges: Range[], ss: number, se: number): Range[] {
  if (ss >= se) return ranges.slice();
  const result: Range[] = [];
  for (const r of ranges) {
    if (r.end <= ss || r.start >= se) {
      result.push(r);
      continue;
    }
    if (r.start < ss) result.push({ start: r.start, end: ss });
    if (r.end > se) result.push({ start: se, end: r.end });
  }
  return result;
}

// Mapea un DOM Range a spans de caracteres por párrafo (vía data-p-idx).
function rangeToParagraphSpans(
  range: globalThis.Range,
  root: HTMLElement,
): { pIdx: number; start: number; end: number }[] {
  const result: { pIdx: number; start: number; end: number }[] = [];
  const paragraphs = Array.from(
    root.querySelectorAll<HTMLElement>("p[data-p-idx]"),
  );
  for (const p of paragraphs) {
    if (!range.intersectsNode(p)) continue;
    const sub = document.createRange();
    sub.selectNodeContents(p);
    if (p.contains(range.startContainer))
      sub.setStart(range.startContainer, range.startOffset);
    if (p.contains(range.endContainer))
      sub.setEnd(range.endContainer, range.endOffset);
    const startOff = offsetWithin(p, sub.startContainer, sub.startOffset);
    const endOff = offsetWithin(p, sub.endContainer, sub.endOffset);
    const start = Math.min(startOff, endOff);
    const end = Math.max(startOff, endOff);
    if (end > start)
      result.push({ pIdx: parseInt(p.dataset.pIdx ?? "0", 10), start, end });
  }
  return result;
}

function offsetWithin(pEl: HTMLElement, node: Node, nodeOffset: number): number {
  const probe = document.createRange();
  probe.setStart(pEl, 0);
  try {
    probe.setEnd(node, nodeOffset);
  } catch {
    return 0;
  }
  return probe.toString().length;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Marca de cita aplicada a un span de un párrafo (id de la cita + etiqueta del
// atributo, para el tooltip).
interface CiteMark {
  start: number;
  end: number;
  id: string;
  label: string;
}

// HTML del párrafo con las marcas de anotación + citas aplicadas al texto crudo.
function annotatedParagraphHTML(
  text: string,
  anno?: Annotation,
  cites?: CiteMark[],
): string {
  const hi = anno?.highlight ?? [];
  const un = anno?.underline ?? [];
  const ci = cites ?? [];
  if (!hi.length && !un.length && !ci.length) {
    return escapeHtml(text).replace(/\n/g, "<br>");
  }
  const set = new Set<number>([0, text.length]);
  [...hi, ...un, ...ci].forEach((r) => {
    set.add(r.start);
    set.add(r.end);
  });
  const bounds = [...set]
    .filter((b) => b >= 0 && b <= text.length)
    .sort((a, b) => a - b);
  const out: string[] = [];
  for (let i = 0; i < bounds.length - 1; i++) {
    const s = bounds[i];
    const e = bounds[i + 1];
    if (s === e) continue;
    const seg = text.slice(s, e);
    const isHi = hi.some((r) => r.start <= s && r.end >= e);
    const isUn = un.some((r) => r.start <= s && r.end >= e);
    const citeHit = ci.find((r) => r.start <= s && r.end >= e);
    const escaped = escapeHtml(seg).replace(/\n/g, "<br>");
    if (!isHi && !isUn && !citeHit) {
      out.push(escaped);
      continue;
    }
    const classes: string[] = [];
    if (isHi) classes.push("enun-mark");
    if (isUn) classes.push("enun-uline");
    if (citeHit) classes.push("enun-cite");
    const dataAttrs = citeHit
      ? ` data-cite-id="${escapeHtml(citeHit.id)}" title="Cita · ${escapeHtml(
          citeHit.label,
        )}"`
      : "";
    out.push(`<span class="${classes.join(" ")}"${dataAttrs}>${escaped}</span>`);
  }
  return out.join("");
}

/* ── Componente principal ───────────────────────────────────────────────── */

export default function ParcialSimulado() {
  const [openCaseId, setOpenCaseId] = useState<string | null>(null);

  if (!openCaseId) {
    return <CaseList onOpen={setOpenCaseId} />;
  }
  return (
    <CaseWizard
      key={openCaseId}
      id={openCaseId}
      onBack={() => setOpenCaseId(null)}
    />
  );
}

/* ── Lista de casos agrupada por source_set ─────────────────────────────── */

function CaseList({ onOpen }: { onOpen: (id: string) => void }) {
  const [progress, setProgress] = useState<Record<string, number | null>>({});

  useEffect(() => {
    const next: Record<string, number | null> = {};
    Object.values(EXERCISES).forEach((e) => {
      try {
        const raw = window.localStorage.getItem(STORE_PREFIX + e.id);
        if (!raw) {
          next[e.id] = null;
          return;
        }
        const parsed = JSON.parse(raw);
        let step = typeof parsed.step === "number" ? parsed.step : 1;
        step = Math.max(1, Math.min(NUM_STEPS, step));
        next[e.id] = step;
      } catch {
        next[e.id] = 1;
      }
    });
    setProgress(next);
  }, []);

  const grouped: Record<string, Exercise[]> = {};
  Object.values(EXERCISES).forEach((e) => {
    (grouped[e.source_set] ??= []).push(e);
  });

  return (
    <div className="vtool-panel parcial">
      <div className="vtool-head">
        <span className="vtool-eyebrow">Estudio · Parcial simulado</span>
        <h3>Práctica fiel al enunciado</h3>
        <p>
          {Object.keys(EXERCISES).length} casos. Enunciado en texto plano — sin
          pistas durante la práctica. Cuatro puntos con el puntaje real del
          parcial (a/b/c/d, 10 pts): funcionalidades, atributos de calidad,
          arquitectura candidata, y riesgos/trade-offs, con export a .md.
        </p>
      </div>

      <ol className="parcial-howto">
        <li>
          <strong>a [1p].</strong> Punteo de funcionalidades de alto nivel
          ordenadas por importancia (al menos 5 ítems).
        </li>
        <li>
          <strong>b [2p].</strong> Atributos de calidad principales (elegí 4) con
          justificación, ordenados por importancia.
        </li>
        <li>
          <strong>c [5p].</strong> Arquitectura candidata: un diagrama y la
          justificación de todas las decisiones en un texto, relacionándola con
          los atributos del punto b (con plantillas para insertar estructura).
        </li>
        <li>
          <strong>d [2p].</strong> Riesgos / no-riesgos, supuestos y trade-offs (2
          de cada uno). Después Exportar y guardar.
        </li>
      </ol>

      {Object.entries(grouped).map(([key, list]) => {
        const meta = SET_LABELS[key];
        return (
          <section className="parcial-set" key={key}>
            <h4 className="parcial-set-title">
              <span className="parcial-set-num">{meta?.num ?? ""}</span>
              {meta?.label ?? key}
            </h4>
            {meta?.desc && <p className="parcial-set-desc">{meta.desc}</p>}
            <div className="parcial-index">
              {list.map((e) => {
                const p = progress[e.id];
                return (
                  <button
                    type="button"
                    className="parcial-entry"
                    key={e.id}
                    onClick={() => onOpen(e.id)}
                  >
                    <span className="parcial-entry-icon" aria-hidden="true">
                      <FlaskIcon />
                    </span>
                    <span className="parcial-entry-body">
                      <span className="parcial-entry-title">{e.title}</span>
                      <span className="parcial-entry-desc">{e.domain}</span>
                    </span>
                    <span className="parcial-entry-meta">
                      {p ? `punto ${p}/${NUM_STEPS}` : "sin empezar"}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/* ── Wizard de un caso ──────────────────────────────────────────────────── */

function CaseWizard({ id, onBack }: { id: string; onBack: () => void }) {
  const exercise = EXERCISES[id];
  // Estado mutable en un ref (el editor de diagramas vanilla escribe sobre él);
  // un contador fuerza re-render cuando hace falta repintar la UI de React.
  const stateRef = useRef<ExamState>(defaultState());
  const [, force] = useState(0);
  const rerender = useCallback(() => force((n) => n + 1), []);
  const [hydrated, setHydrated] = useState(false);
  const [savedLabel, setSavedLabel] = useState("Sin cambios");
  const [focus, setFocus] = useState(false);

  // Editores de diagramas vivos del paso actual; se vuelcan al estado al salir.
  const editorsRef = useRef<Record<string, DiagramInstance>>({});

  const save = useCallback(() => {
    persist(id, stateRef.current);
    setSavedLabel(`Guardado ${relTime(stateRef.current.updatedAt)}`);
  }, [id]);

  const flushEditors = useCallback(() => {
    const st = stateRef.current;
    Object.entries(editorsRef.current).forEach(([key, ed]) => {
      if (!ed) return;
      const s = ed.getState();
      if (key === "base") st.baseDiagram = s;
      else {
        if (!st.perAttr[key])
          st.perAttr[key] = {
            breakingScenarios: "",
            diagram: { nodes: [], edges: [] },
          };
        st.perAttr[key].diagram = s;
      }
    });
    editorsRef.current = {};
    save();
  }, [save]);

  // Hidratar desde localStorage en el cliente.
  useEffect(() => {
    stateRef.current = loadState(id);
    setHydrated(true);
    setSavedLabel(
      stateRef.current.updatedAt
        ? `Guardado ${relTime(stateRef.current.updatedAt)}`
        : "Sin cambios",
    );
    rerender();
  }, [id, rerender]);

  // Modo focus: oculta navbar + sidebar + chrome del toolkit para concentrarse
  // sólo en el parcial. Static-export safe: togglea una clase en <html> dentro
  // de un efecto y la limpia al apagarlo o al desmontar el caso.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("parcial-focus", focus);
    return () => root.classList.remove("parcial-focus");
  }, [focus]);

  // Esc sale del modo focus.
  useEffect(() => {
    if (!focus) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFocus(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [focus]);

  const goStep = useCallback(
    (n: number) => {
      flushEditors();
      stateRef.current.step = Math.max(1, Math.min(NUM_STEPS, n));
      save();
      rerender();
    },
    [flushEditors, save, rerender],
  );

  const onReset = useCallback(() => {
    if (
      !window.confirm(
        "¿Borrar todo tu progreso de este caso? No se puede deshacer.",
      )
    )
      return;
    clearStored(id);
    stateRef.current = defaultState();
    editorsRef.current = {};
    save();
    rerender();
  }, [id, save, rerender]);

  if (!exercise) {
    return (
      <div className="vtool-panel parcial">
        <p className="vtool-note">Caso no encontrado.</p>
      </div>
    );
  }

  if (!hydrated) {
    return (
      <div className="vtool-panel parcial">
        <p className="vtool-note">Cargando tu progreso…</p>
      </div>
    );
  }

  const state = stateRef.current;
  const step = state.step || 1;

  return (
    <div className="vtool-panel parcial parcial-case">
      {/* Toolbar */}
      <div className="parcial-toolbar">
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          onClick={() => {
            flushEditors();
            onBack();
          }}
        >
          ← Banco
        </button>
        <div className="parcial-toolbar-title">
          <span className="parcial-toolbar-eyebrow">Caso de parcial</span>
          <h3 className="parcial-toolbar-h1">{exercise.title}</h3>
        </div>
        <div className="parcial-toolbar-right">
          <span className="parcial-autosave">{savedLabel}</span>
          <button
            type="button"
            className={"btn btn--sm btn--ghost parcial-focus-btn" + (focus ? " is-on" : "")}
            onClick={() => setFocus((f) => !f)}
            aria-pressed={focus}
            title={
              focus
                ? "Salir del modo focus (Esc)"
                : "Modo focus — ocultar navegación y enfocar el parcial"
            }
          >
            <FocusIcon />
            {focus ? "Salir de focus" : "Focus"}
          </button>
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={onReset}
            title="Borrar tu progreso de este caso"
          >
            Reiniciar
          </button>
        </div>
      </div>

      {/* Enunciado dock — colapsable, presente en todos los pasos */}
      <EnunciadoDock
        exercise={exercise}
        state={state}
        save={save}
        rerender={rerender}
      />

      {/* Stepper — refleja la grilla del parcial (a/b/c/d con sus puntos) */}
      <nav className="parcial-stepper" aria-label="Puntos del parcial">
        {STEP_DEFS.map((def, i) => {
          const n = i + 1;
          const ptsLabel = `${def.pts} pt${def.pts === 1 ? "" : "s"}`;
          return (
            <button
              key={def.key}
              type="button"
              className={
                "parcial-step" +
                (n === step ? " is-current" : "") +
                (n < step ? " is-done" : "")
              }
              onClick={() => goStep(n)}
              title={`${def.key}) ${def.label} · ${ptsLabel}`}
            >
              <span className="parcial-step-num">{def.key}</span>
              <span className="parcial-step-label">{def.label}</span>
              <span className="parcial-step-pts">{ptsLabel}</span>
            </button>
          );
        })}
      </nav>

      {/* Cuerpo del punto (a/b/c/d) */}
      <div className="parcial-step-body">
        {step === 1 && <StepA state={state} save={save} rerender={rerender} />}
        {step === 2 && <StepB state={state} save={save} rerender={rerender} />}
        {step === 3 && (
          <StepC state={state} save={save} editorsRef={editorsRef} />
        )}
        {step === 4 && (
          <StepD
            state={state}
            save={save}
            onExport={() => exportAndSave(exercise, state, flushEditors)}
          />
        )}
      </div>

      {/* Navegación */}
      <nav className="parcial-nav">
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          disabled={step === 1}
          onClick={() => goStep(step - 1)}
        >
          ← Volver
        </button>
        <div className="parcial-nav-progress">
          Punto {STEP_DEFS[step - 1]?.key ?? ""} · {step} de {NUM_STEPS}
        </div>
        <button
          type="button"
          className="btn btn--sm parcial-btn-primary"
          onClick={() => {
            if (step < NUM_STEPS) goStep(step + 1);
            else exportAndSave(exercise, state, flushEditors);
          }}
        >
          {step < NUM_STEPS ? "Continuar →" : "Finalizar ✓"}
        </button>
      </nav>
    </div>
  );
}

/* ── Enunciado dock + anotaciones ───────────────────────────────────────── */

function EnunciadoDock({
  exercise,
  state,
  save,
  rerender,
}: {
  exercise: Exercise;
  state: ExamState;
  save: () => void;
  rerender: () => void;
}) {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const savedRangeRef = useRef<globalThis.Range | null>(null);
  const citeControlRef = useRef<HTMLDivElement | null>(null);
  const [annoEnabled, setAnnoEnabled] = useState(false);
  const [citeMenuOpen, setCiteMenuOpen] = useState(false);
  const [flashCiteId, setFlashCiteId] = useState<string | null>(null);
  const paragraphs = ENUNCIADOS[exercise.id] ?? null;
  const collapsed = state.enunciadoCollapsed;

  // Atributos elegidos, en el orden de priorización: targets posibles de cita.
  const orderedAttrs = state.attrOrder
    .map((x) => state.attrs.find((a) => a.id === x))
    .filter((a): a is AttrItem => !!a);
  const attrName = (attrId: string) =>
    state.attrs.find((a) => a.id === attrId)?.name ?? attrId;

  // Spans de cita por párrafo (id + etiqueta del atributo para el tooltip).
  const citeMarksByParagraph = useCallback((): Record<number, CiteMark[]> => {
    const map: Record<number, CiteMark[]> = {};
    (state.citations || []).forEach((c) => {
      const label = attrName(c.attrId);
      c.spans.forEach((s) => {
        (map[s.pIdx] ??= []).push({
          start: s.start,
          end: s.end,
          id: c.id,
          label,
        });
      });
    });
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  // Re-pintar los párrafos in-place tras una marca (sin remontar React).
  const repaint = useCallback(() => {
    const root = bodyRef.current;
    if (!root) return;
    const cites = citeMarksByParagraph();
    root.querySelectorAll<HTMLElement>("p[data-p-idx]").forEach((p) => {
      const idx = parseInt(p.dataset.pIdx ?? "0", 10);
      const src = (ENUNCIADOS[exercise.id] ?? [])[idx] ?? "";
      p.innerHTML = annotatedParagraphHTML(src, state.annotations[idx], cites[idx]);
    });
  }, [exercise.id, state, citeMarksByParagraph]);

  // Pintar al montar, al expandir (al expandir, los <p> del enunciado se
  // remontan vacíos y hay que reinyectar su HTML con marcas) y cuando cambia el
  // conjunto de citas — incluido el caso externo del paso 1, que al
  // deseleccionar un atributo descarta sus citas sin repintar acá.
  const citeSig = (state.citations || []).map((c) => c.id).join(",");
  useEffect(() => {
    if (!collapsed) repaint();
  }, [repaint, collapsed, citeSig]);

  // Tracking de selección dentro del enunciado.
  useEffect(() => {
    if (!paragraphs) return;
    const onSelectionChange = () => {
      const root = bodyRef.current;
      if (!root) return;
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0 || sel.isCollapsed) {
        savedRangeRef.current = null;
        setAnnoEnabled(false);
        return;
      }
      const range = sel.getRangeAt(0);
      if (!root.contains(range.commonAncestorContainer)) {
        savedRangeRef.current = null;
        setAnnoEnabled(false);
        return;
      }
      savedRangeRef.current = range.cloneRange();
      setAnnoEnabled(true);
    };
    document.addEventListener("selectionchange", onSelectionChange);
    return () =>
      document.removeEventListener("selectionchange", onSelectionChange);
  }, [paragraphs]);

  // El menú de citas se cierra al perder la selección.
  useEffect(() => {
    if (!annoEnabled) setCiteMenuOpen(false);
  }, [annoEnabled]);

  // …y al hacer click fuera del control.
  useEffect(() => {
    if (!citeMenuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!citeControlRef.current?.contains(e.target as Node))
        setCiteMenuOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [citeMenuOpen]);

  const applyToSelection = (kind: "highlight" | "underline" | "erase") => {
    const root = bodyRef.current;
    const range = savedRangeRef.current;
    if (!root || !range) return;
    const spans = rangeToParagraphSpans(range, root);
    if (spans.length === 0) return;
    spans.forEach(({ pIdx, start, end }) => {
      if (start >= end) return;
      const slot = state.annotations[pIdx] || { highlight: [], underline: [] };
      if (kind === "erase") {
        slot.highlight = subtractRange(slot.highlight || [], start, end);
        slot.underline = subtractRange(slot.underline || [], start, end);
      } else {
        slot[kind] = mergeRange(slot[kind] || [], start, end);
      }
      state.annotations[pIdx] = slot;
    });
    save();
    repaint();
    window.getSelection()?.removeAllRanges();
    savedRangeRef.current = null;
    setAnnoEnabled(false);
  };

  // Marca la selección actual como cita (evidencia) de un atributo de calidad.
  const createCitation = (attrId: string) => {
    const root = bodyRef.current;
    const range = savedRangeRef.current;
    if (!root || !range) return;
    const spans = rangeToParagraphSpans(range, root);
    if (spans.length === 0) return;
    const src = ENUNCIADOS[exercise.id] ?? [];
    const text = spans
      .map((s) => (src[s.pIdx] ?? "").slice(s.start, s.end))
      .join(" … ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return;
    const cite: Citation = {
      id: "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      attrId,
      spans: spans.map((s) => ({ pIdx: s.pIdx, start: s.start, end: s.end })),
      text,
    };
    if (!Array.isArray(state.citations)) state.citations = [];
    state.citations.push(cite);
    save();
    repaint();
    window.getSelection()?.removeAllRanges();
    savedRangeRef.current = null;
    setAnnoEnabled(false);
    setCiteMenuOpen(false);
    rerender(); // refresca la lista de citas (citeGroups se recalcula al render)
  };

  const removeCitation = (cid: string) => {
    state.citations = (state.citations || []).filter((c) => c.id !== cid);
    save();
    repaint();
    rerender();
  };

  // Resalta brevemente en el enunciado los spans de una cita.
  const locateInText = (cid: string) => {
    const root = bodyRef.current;
    if (!root) return;
    const els = root.querySelectorAll<HTMLElement>(
      `[data-cite-id="${cid}"]`,
    );
    if (!els.length) return;
    els.forEach((el) => el.classList.add("enun-cite--flash"));
    els[0].scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(
      () => els.forEach((el) => el.classList.remove("enun-cite--flash")),
      1400,
    );
  };

  // Click sobre una cita en el texto → destella su entrada en la lista.
  const onBodyClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = (e.target as HTMLElement)?.closest?.(
      "[data-cite-id]",
    ) as HTMLElement | null;
    const id = el?.getAttribute("data-cite-id");
    if (!id) return;
    setFlashCiteId(id);
    window.setTimeout(
      () => setFlashCiteId((cur) => (cur === id ? null : cur)),
      1400,
    );
  };

  // Citas agrupadas por atributo (orden de priorización; huérfanas al final).
  const citations = state.citations || [];
  const citeGroups: {
    attrId: string;
    name: string;
    rank: number | null;
    orphan: boolean;
    items: Citation[];
  }[] = [];
  if (citations.length) {
    const byAttr = new Map<string, Citation[]>();
    citations.forEach((c) => {
      const list = byAttr.get(c.attrId);
      if (list) list.push(c);
      else byAttr.set(c.attrId, [c]);
    });
    orderedAttrs.forEach((a, i) => {
      const items = byAttr.get(a.id);
      if (items) {
        citeGroups.push({
          attrId: a.id,
          name: a.name,
          rank: i + 1,
          orphan: false,
          items,
        });
        byAttr.delete(a.id);
      }
    });
    byAttr.forEach((items, attrId) => {
      citeGroups.push({
        attrId,
        name: attrName(attrId),
        rank: null,
        orphan: true,
        items,
      });
    });
  }

  const clearAll = () => {
    if (!Object.keys(state.annotations).length) return;
    if (!window.confirm("¿Quitar todas las marcas de este enunciado?")) return;
    state.annotations = {};
    save();
    repaint();
  };

  const toggle = () => {
    state.enunciadoCollapsed = !state.enunciadoCollapsed;
    save();
    rerender();
  };

  return (
    <section className="parcial-enunciado" data-collapsed={collapsed}>
      <header className="parcial-enunciado-head">
        <div className="parcial-enunciado-head-left">
          <span className="parcial-enunciado-eyebrow">Enunciado</span>
          <h4 className="parcial-enunciado-title">{exercise.title}</h4>
        </div>
        <button
          type="button"
          className="parcial-enunciado-toggle"
          onClick={toggle}
          aria-expanded={!collapsed}
          title={collapsed ? "Mostrar enunciado" : "Ocultar enunciado"}
        >
          <span>{collapsed ? "Mostrar" : "Ocultar"}</span>
          <span className="parcial-enunciado-chev" aria-hidden="true">
            ▾
          </span>
        </button>
      </header>

      {!collapsed && (
        <div className="parcial-enunciado-collapsible">
          {!paragraphs ? (
            <p className="vtool-note">
              Este caso no tiene enunciado en texto plano en la app. Consultá tus
              apuntes / el material de la cátedra.
            </p>
          ) : (
            <>
              <div
                className="parcial-enunciado-toolbar"
                role="toolbar"
                aria-label="Anotaciones del enunciado"
              >
                <span className="parcial-enunciado-toolbar-label">Anotar</span>
                <button
                  type="button"
                  className="parcial-anno"
                  disabled={!annoEnabled}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyToSelection("highlight")}
                  title="Resaltar selección"
                >
                  <span className="parcial-anno-swatch is-highlight" />
                  Resaltar
                </button>
                <button
                  type="button"
                  className="parcial-anno"
                  disabled={!annoEnabled}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyToSelection("underline")}
                  title="Subrayar selección"
                >
                  <span className="parcial-anno-swatch is-underline" />
                  Subrayar
                </button>
                <button
                  type="button"
                  className="parcial-anno"
                  disabled={!annoEnabled}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => applyToSelection("erase")}
                  title="Quitar marcas de la selección"
                >
                  ✕ Borrar marcas
                </button>
                <div className="parcial-cite-control" ref={citeControlRef}>
                  <button
                    type="button"
                    className={
                      "parcial-anno parcial-anno--cite" +
                      (citeMenuOpen ? " is-open" : "")
                    }
                    disabled={!annoEnabled || orderedAttrs.length === 0}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setCiteMenuOpen((o) => !o)}
                    aria-haspopup="menu"
                    aria-expanded={citeMenuOpen}
                    title={
                      orderedAttrs.length === 0
                        ? "Elegí atributos de calidad en el paso 1 para poder citar"
                        : "Marcar la selección como cita de un atributo de calidad"
                    }
                  >
                    <span className="parcial-anno-swatch is-cite" />
                    Citar para QA
                  </button>
                  {citeMenuOpen && orderedAttrs.length > 0 && (
                    <div className="parcial-cite-menu" role="menu">
                      <div className="parcial-cite-menu-head">
                        ¿Evidencia de qué atributo?
                      </div>
                      {orderedAttrs.map((a, i) => (
                        <button
                          key={a.id}
                          type="button"
                          role="menuitem"
                          className="parcial-cite-menu-item"
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => createCitation(a.id)}
                        >
                          <span className="parcial-cite-menu-rank">{i + 1}</span>
                          <span className="parcial-cite-menu-name">{a.name}</span>
                          {a.custom && (
                            <span className="parcial-pill-tag">custom</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  className="parcial-anno"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={clearAll}
                  title="Quitar todas las marcas"
                >
                  Limpiar todo
                </button>
                <span className="parcial-enunciado-toolbar-hint">
                  Resaltá o subrayá; o citá la selección como evidencia de un QA.
                </span>
              </div>
              <div
                className="parcial-enunciado-body"
                ref={bodyRef}
                onClick={onBodyClick}
              >
                {paragraphs.map((_, i) => (
                  // El contenido se inyecta en repaint() (innerHTML con las marcas).
                  <p key={i} data-p-idx={i} />
                ))}
              </div>

              {citeGroups.length > 0 && (
                <div className="parcial-cites">
                  <div className="parcial-cites-head">
                    <span className="parcial-cites-title">
                      Citas del enunciado
                    </span>
                    <span className="parcial-cites-count">
                      {citations.length}
                    </span>
                  </div>
                  {citeGroups.map((g) => (
                    <div className="parcial-cites-group" key={g.attrId}>
                      <div className="parcial-cites-attr">
                        {g.rank != null && (
                          <span className="parcial-cites-attr-rank">
                            {g.rank}
                          </span>
                        )}
                        <span className="parcial-cites-attr-name">{g.name}</span>
                        {g.orphan && (
                          <span className="parcial-cites-orphan">
                            atributo no seleccionado
                          </span>
                        )}
                      </div>
                      <ul className="parcial-cites-list">
                        {g.items.map((c) => (
                          <li
                            key={c.id}
                            className={
                              "parcial-cites-item" +
                              (flashCiteId === c.id ? " is-flash" : "")
                            }
                          >
                            <button
                              type="button"
                              className="parcial-cites-quote"
                              onClick={() => locateInText(c.id)}
                              title="Resaltar en el enunciado"
                            >
                              “{c.text}”
                            </button>
                            <button
                              type="button"
                              className="parcial-cites-remove"
                              onClick={() => removeCitation(c.id)}
                              title="Quitar cita"
                              aria-label="Quitar cita"
                            >
                              ✕
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

/* ── Punto (a) — Funcionalidades de alto nivel ──────────────────────────── */

function StepA({
  state,
  save,
  rerender,
}: {
  state: ExamState;
  save: () => void;
  rerender: () => void;
}) {
  const dragId = useRef<string | null>(null);
  const [draft, setDraft] = useState("");

  const add = () => {
    const v = draft.trim();
    if (!v) return;
    state.functionalities.push({
      id: "f" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: v,
    });
    setDraft("");
    save();
    rerender();
  };

  const update = (fid: string, value: string) => {
    const f = state.functionalities.find((x) => x.id === fid);
    if (f) {
      f.text = value;
      save();
    }
  };

  const remove = (fid: string) => {
    state.functionalities = state.functionalities.filter((f) => f.id !== fid);
    save();
    rerender();
  };

  const move = (fid: string, dir: "up" | "down") => {
    const arr = state.functionalities;
    const idx = arr.findIndex((f) => f.id === fid);
    if (idx < 0) return;
    const swap = dir === "up" ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= arr.length) return;
    const tmp = arr[idx];
    arr[idx] = arr[swap];
    arr[swap] = tmp;
    save();
    rerender();
  };

  const onDrop = (targetId: string) => {
    const from = dragId.current;
    if (!from || from === targetId) return;
    const arr = state.functionalities;
    const fromIdx = arr.findIndex((f) => f.id === from);
    const toIdx = arr.findIndex((f) => f.id === targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const moved = arr.splice(fromIdx, 1)[0];
    arr.splice(toIdx, 0, moved);
    dragId.current = null;
    save();
    rerender();
  };

  const items = state.functionalities;
  const filled = items.filter((f) => f.text.trim()).length;
  const enough = filled >= 5;

  return (
    <div className="parcial-step-card">
      <div className="parcial-step-intro">
        <h4>a · Funcionalidades de alto nivel</h4>
        <p>
          Puntealas <strong>en orden de importancia</strong> (la primera, la más
          importante). El parcial pide <strong>al menos 5 ítems</strong>.
          Arrastrá o usá las flechas para reordenar.
        </p>
      </div>

      {items.length > 0 && (
        <ol className="parcial-func-list">
          {items.map((f, i) => (
            <li
              key={f.id}
              className="parcial-func-item"
              draggable
              onDragStart={(e) => {
                dragId.current = f.id;
                e.dataTransfer.effectAllowed = "move";
                e.currentTarget.classList.add("is-dragging");
              }}
              onDragEnd={(e) => e.currentTarget.classList.remove("is-dragging")}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
              }}
              onDrop={(e) => {
                e.preventDefault();
                onDrop(f.id);
              }}
            >
              <span className="parcial-func-handle" aria-hidden="true">
                ⋮⋮
              </span>
              <span className="parcial-func-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <input
                type="text"
                className="vtool-input parcial-func-input"
                defaultValue={f.text}
                placeholder="Funcionalidad de alto nivel…"
                onChange={(e) => update(f.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                }}
              />
              <div className="parcial-func-actions">
                <button
                  type="button"
                  className="parcial-rank-btn"
                  disabled={i === 0}
                  onClick={() => move(f.id, "up")}
                  title="Subir"
                >
                  ▲
                </button>
                <button
                  type="button"
                  className="parcial-rank-btn"
                  disabled={i === items.length - 1}
                  onClick={() => move(f.id, "down")}
                  title="Bajar"
                >
                  ▼
                </button>
              </div>
              <button
                type="button"
                className="parcial-func-remove"
                onClick={() => remove(f.id)}
                title="Quitar"
                aria-label="Quitar funcionalidad"
              >
                ✕
              </button>
            </li>
          ))}
        </ol>
      )}

      <div className="parcial-func-add">
        <input
          type="text"
          className="vtool-input"
          placeholder="Nueva funcionalidad de alto nivel…"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <button type="button" className="btn btn--sm btn--ghost" onClick={add}>
          + Agregar
        </button>
      </div>

      <div className={"parcial-rank-footnote" + (enough ? " is-ok" : "")}>
        {items.length === 0 ? (
          <>Todavía no cargaste funcionalidades. El parcial pide al menos 5.</>
        ) : enough ? (
          <>
            {filled} funcionalidades — suficiente. Revisá el orden de
            importancia.
          </>
        ) : (
          <>
            {filled} de 5 mínimas. Agregá {Math.max(0, 5 - filled)} más.
          </>
        )}
      </div>
    </div>
  );
}

/* ── Punto (b) — Atributos de calidad principales (elegir 4) ─────────────── */

function StepB({
  state,
  save,
  rerender,
}: {
  state: ExamState;
  save: () => void;
  rerender: () => void;
}) {
  return (
    <div className="parcial-step-card">
      <div className="parcial-step-intro">
        <h4>b · Atributos de calidad principales</h4>
        <p>
          Elegí los atributos relevantes con una justificación breve y{" "}
          <strong>ordenalos por importancia</strong>. Los{" "}
          <strong>4 primeros</strong> son los drivers de arquitectura del punto
          c.
        </p>
      </div>

      <AttrPicker state={state} save={save} rerender={rerender} />
      <AttrRank state={state} save={save} rerender={rerender} />
    </div>
  );
}

/* ── Punto (b) · sección de selección + justificación ───────────────────── */

function AttrPicker({
  state,
  save,
  rerender,
}: {
  state: ExamState;
  save: () => void;
  rerender: () => void;
}) {
  const [customInput, setCustomInput] = useState("");
  const selectedMap = Object.fromEntries(state.attrs.map((a) => [a.id, a]));

  const toggleAttr = (attrId: string, name: string) => {
    if (state.attrs.find((a) => a.id === attrId)) {
      state.attrs = state.attrs.filter((a) => a.id !== attrId);
      state.attrOrder = state.attrOrder.filter((x) => x !== attrId);
      delete state.perAttr[attrId];
      state.citations = (state.citations || []).filter(
        (c) => c.attrId !== attrId,
      );
    } else {
      state.attrs.push({
        id: attrId,
        name,
        justification: "",
        custom: attrId.startsWith("custom-"),
      });
      state.attrOrder.push(attrId);
    }
    save();
    rerender();
  };

  const updateJust = (attrId: string, value: string) => {
    const a = state.attrs.find((x) => x.id === attrId);
    if (a) {
      a.justification = value;
      save();
    }
  };

  const addCustom = () => {
    const v = customInput.trim();
    if (!v) return;
    const cid = "custom-" + v.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    if (state.attrs.find((a) => a.id === cid)) {
      setCustomInput("");
      return;
    }
    state.attrs.push({ id: cid, name: v, justification: "", custom: true });
    state.attrOrder.push(cid);
    setCustomInput("");
    save();
    rerender();
  };

  const customAttrs = state.attrs.filter((a) => a.custom);

  return (
    <div className="parcial-attr-pick">
      <div className="parcial-qa-pills">
        {QA_CATALOG.groups.map((g) => (
          <div className="parcial-qa-group" key={g.id}>
            <div className="parcial-qa-group-name">{g.name}</div>
            <div className="parcial-qa-row">
              {g.attrs.map((a) => {
                const sel = !!selectedMap[a.id];
                return (
                  <div
                    className={"parcial-pill-wrap" + (sel ? " is-selected" : "")}
                    key={a.id}
                  >
                    <button
                      type="button"
                      className="parcial-pill"
                      onClick={() => toggleAttr(a.id, a.name)}
                    >
                      <span className="parcial-pill-dot" aria-hidden="true" />
                      <span className="parcial-pill-name">{a.name}</span>
                    </button>
                    {sel && (
                      <div className="parcial-pill-just">
                        <span className="parcial-pill-just-label">
                          Justificación
                        </span>
                        <textarea
                          className="vtool-textarea"
                          rows={2}
                          placeholder="¿Por qué este atributo aplica acá? Una oración alcanza."
                          defaultValue={selectedMap[a.id].justification || ""}
                          onChange={(e) => updateJust(a.id, e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="parcial-custom-card">
        <div className="parcial-custom-head">
          <span>Agregar atributo propio</span>
          <span className="parcial-muted-small">
            (p. ej. compliance regulatorio, contractual SLA)
          </span>
        </div>
        <div className="parcial-custom-row">
          <input
            type="text"
            className="vtool-input"
            placeholder="Nombre del atributo…"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
          />
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={addCustom}
          >
            + Agregar
          </button>
        </div>
        {customAttrs.length > 0 && (
          <div className="parcial-qa-row parcial-custom-list">
            {customAttrs.map((a) => (
              <div
                className="parcial-pill-wrap is-selected is-custom"
                key={a.id}
              >
                <button
                  type="button"
                  className="parcial-pill"
                  onClick={() => toggleAttr(a.id, a.name)}
                >
                  <span className="parcial-pill-dot" aria-hidden="true" />
                  <span className="parcial-pill-name">{a.name}</span>
                  <span className="parcial-pill-tag">custom</span>
                </button>
                <div className="parcial-pill-just">
                  <span className="parcial-pill-just-label">Justificación</span>
                  <textarea
                    className="vtool-textarea"
                    rows={2}
                    placeholder="¿Por qué este atributo aplica acá?"
                    defaultValue={a.justification || ""}
                    onChange={(e) => updateJust(a.id, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="parcial-step-summary">
        <span className="parcial-step-summary-label">
          {state.attrs.length}{" "}
          {state.attrs.length === 1 ? "atributo elegido" : "atributos elegidos"}
        </span>
        {state.attrs.length > 0 && (
          <span className="parcial-step-summary-list">
            {state.attrs.map((a) => a.name).join(" · ")}
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Punto (b) · sección de orden de importancia ────────────────────────── */

function AttrRank({
  state,
  save,
  rerender,
}: {
  state: ExamState;
  save: () => void;
  rerender: () => void;
}) {
  const dragId = useRef<string | null>(null);

  if (state.attrs.length === 0) {
    return (
      <p className="vtool-note parcial-attr-rank-empty">
        Elegí atributos arriba para ordenarlos por importancia.
      </p>
    );
  }

  // Garantizar que attrOrder tenga todos los atributos.
  const known = new Set(state.attrs.map((a) => a.id));
  state.attrOrder = state.attrOrder.filter((x) => known.has(x));
  state.attrs.forEach((a) => {
    if (!state.attrOrder.includes(a.id)) state.attrOrder.push(a.id);
  });

  const ordered = state.attrOrder
    .map((x) => state.attrs.find((a) => a.id === x))
    .filter((a): a is AttrItem => !!a);

  const move = (attrId: string, dir: "up" | "down") => {
    const idx = state.attrOrder.indexOf(attrId);
    if (idx < 0) return;
    const swapWith = dir === "up" ? idx - 1 : idx + 1;
    if (swapWith < 0 || swapWith >= state.attrOrder.length) return;
    const tmp = state.attrOrder[idx];
    state.attrOrder[idx] = state.attrOrder[swapWith];
    state.attrOrder[swapWith] = tmp;
    save();
    rerender();
  };

  const onDrop = (targetId: string) => {
    const from = dragId.current;
    if (!from || from === targetId) return;
    const fromIdx = state.attrOrder.indexOf(from);
    const toIdx = state.attrOrder.indexOf(targetId);
    if (fromIdx < 0 || toIdx < 0) return;
    const moved = state.attrOrder.splice(fromIdx, 1)[0];
    state.attrOrder.splice(toIdx, 0, moved);
    dragId.current = null;
    save();
    rerender();
  };

  return (
    <div className="parcial-attr-rank">
      <div className="parcial-attr-rank-head">
        <span className="parcial-field-label">Orden de importancia</span>
        <span className="parcial-muted-small">
          Arrastrá o usá las flechas. Los <strong>primeros {TOP_N}</strong> son
          los drivers de arquitectura del punto c.
        </span>
      </div>

      <ol className="parcial-rank">
        {ordered.map((a, i) => (
          <li
            key={a.id}
            className={
              "parcial-rank-item " + (i < TOP_N ? "is-top" : "is-rest")
            }
            draggable
            onDragStart={(e) => {
              dragId.current = a.id;
              e.dataTransfer.effectAllowed = "move";
              e.currentTarget.classList.add("is-dragging");
            }}
            onDragEnd={(e) => e.currentTarget.classList.remove("is-dragging")}
            onDragOver={(e) => {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }}
            onDrop={(e) => {
              e.preventDefault();
              onDrop(a.id);
            }}
          >
            <span className="parcial-rank-handle" aria-hidden="true">
              ⋮⋮
            </span>
            <span className="parcial-rank-num">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="parcial-rank-body">
              <span className="parcial-rank-name">
                {a.name}
                {a.custom && <span className="parcial-rank-tag">custom</span>}
              </span>
              {a.justification ? (
                <span className="parcial-rank-just">“{a.justification}”</span>
              ) : (
                <span className="parcial-rank-just is-empty">
                  sin justificación
                </span>
              )}
            </div>
            <div className="parcial-rank-actions">
              <button
                type="button"
                className="parcial-rank-btn"
                disabled={i === 0}
                onClick={() => move(a.id, "up")}
                title="Subir"
              >
                ▲
              </button>
              <button
                type="button"
                className="parcial-rank-btn"
                disabled={i === ordered.length - 1}
                onClick={() => move(a.id, "down")}
                title="Bajar"
              >
                ▼
              </button>
            </div>
            {i === TOP_N - 1 && ordered.length > TOP_N && (
              <div className="parcial-rank-cutoff" aria-hidden="true">
                <span>línea de corte · top {TOP_N}</span>
              </div>
            )}
          </li>
        ))}
      </ol>

      <div className="parcial-rank-footnote">
        {ordered.length <= TOP_N ? (
          <>
            Tenés {ordered.length} atributo{ordered.length === 1 ? "" : "s"} —
            todos van a entrar al refinamiento.
          </>
        ) : (
          <>
            Los <strong>primeros {TOP_N}</strong> de tu ranking son los drivers
            del punto c (arquitectura). Los {ordered.length - TOP_N} restantes
            quedan registrados en el export como atributos secundarios.
          </>
        )}
      </div>
    </div>
  );
}

/* ── Punto (c) — Arquitectura candidata ─────────────────────────────────── */

function topAttrs(state: ExamState): AttrItem[] {
  return state.attrOrder
    .slice(0, TOP_N)
    .map((x) => state.attrs.find((a) => a.id === x))
    .filter((a): a is AttrItem => !!a);
}

function StepC({
  state,
  save,
  editorsRef,
}: {
  state: ExamState;
  save: () => void;
  editorsRef: React.MutableRefObject<Record<string, DiagramInstance>>;
}) {
  const top = topAttrs(state);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  // Inserta una plantilla de texto donde está el cursor (o al final si el
  // textarea no tiene foco). El editor es no controlado: seteamos value a mano,
  // sincronizamos el estado y reposicionamos el caret tras el fragmento.
  const insertTemplate = (text: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const focused = document.activeElement === ta;
    const start = focused ? ta.selectionStart : ta.value.length;
    const end = focused ? ta.selectionEnd : ta.value.length;
    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);
    const lead = before && !before.endsWith("\n") ? "\n" : "";
    const trail = after && !after.startsWith("\n") ? "\n" : "";
    const snippet = lead + text + trail;
    ta.value = before + snippet + after;
    state.archJustification = ta.value;
    save();
    const caret = start + snippet.length;
    ta.focus();
    ta.setSelectionRange(caret, caret);
  };

  // Plantillas de justificación. La primera arma el esqueleto con los 4
  // atributos de calidad reales elegidos en el punto b.
  const TEMPLATES: { label: string; build: () => string }[] = [
    {
      label: "4 atributos de calidad",
      build: () =>
        "Cómo la arquitectura cubre cada atributo de calidad:\n" +
        (top.length
          ? top.map((a, i) => `${i + 1}. ${a.name}: `).join("\n")
          : "1. : \n2. : \n3. : \n4. : "),
    },
    {
      label: "Estilo arquitectónico",
      build: () => "Estilo arquitectónico: … — lo elijo porque …",
    },
    {
      label: "Componente → responsabilidad",
      build: () => "· <Componente>: responsable de …",
    },
    {
      label: "Atributo → táctica",
      build: () =>
        "Para <atributo> aplico <táctica> (cache / réplica / cola / balanceador / …).",
    },
    {
      label: "Decisión + trade-off",
      build: () => "Decisión: … · Gana: … · Resigna: …",
    },
    {
      label: "Escenario de calidad",
      build: () =>
        "Escenario — estímulo: … · respuesta del sistema: … · medida: …",
    },
  ];

  return (
    <div className="parcial-step-card">
      <div className="parcial-step-intro">
        <h4>c · Arquitectura candidata y justificación</h4>
        <p>
          Diagramá tu arquitectura candidata y justificá{" "}
          <strong>todas las decisiones</strong> en el texto, relacionándolas con
          los atributos del punto b. Usá las plantillas para insertar estructura
          donde tengas el cursor.
        </p>
      </div>

      <BaseDiagramSection state={state} save={save} editorsRef={editorsRef} />

      <div className="parcial-field">
        <span className="parcial-field-label">
          Justificación de la arquitectura
        </span>
        <div
          className="parcial-tpl-bar"
          role="toolbar"
          aria-label="Plantillas de justificación"
        >
          <span className="parcial-tpl-label">Plantillas</span>
          {TEMPLATES.map((t) => (
            <button
              key={t.label}
              type="button"
              className="parcial-tpl-btn"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => insertTemplate(t.build())}
              title="Insertar en la posición del cursor"
            >
              + {t.label}
            </button>
          ))}
        </div>
        <textarea
          ref={taRef}
          className="vtool-textarea parcial-arch-textarea"
          placeholder="Justificá la arquitectura: estilo elegido, responsabilidad de cada componente, cómo cubrís cada atributo de calidad del punto b, decisiones y trade-offs tomados…"
          defaultValue={state.archJustification || ""}
          onChange={(e) => {
            state.archJustification = e.target.value;
            save();
          }}
        />
      </div>
    </div>
  );
}

/* ── Punto (c) · diagrama base ──────────────────────────────────────────── */

function BaseDiagramSection({
  state,
  save,
  editorsRef,
}: {
  state: ExamState;
  save: () => void;
  editorsRef: React.MutableRefObject<Record<string, DiagramInstance>>;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const top = topAttrs(state);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ed = createDiagramEditor(host, {
      initialState: state.baseDiagram,
      onChange: (s: DiagramState) => {
        state.baseDiagram = s;
        save();
      },
    }) as DiagramInstance;
    editorsRef.current["base"] = ed;
    return () => {
      try {
        state.baseDiagram = ed.getState();
      } catch {
        /* ignore */
      }
      ed.destroy();
      delete editorsRef.current["base"];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="parcial-arch-base">
      <span className="parcial-field-label">
        Diagrama base · arquitectura candidata
      </span>
      <span className="parcial-muted-small parcial-field-hint">
        Cuadrado, círculo, nube, BD, actor + flechas.{" "}
        <strong>Doble-click</strong> para renombrar; al colocar una forma nueva,
        el cursor se posa en el nombre automáticamente.
      </span>
      <div className="parcial-diagram-wrap" ref={hostRef} />
      {top.length > 0 && (
        <div className="parcial-step-footnote">
          <span className="parcial-muted-small">
            Atributos a cubrir con esta arquitectura (del punto b):
          </span>
          <div className="parcial-step-chips">
            {top.map((a, i) => (
              <span className="parcial-chip-ranked" key={a.id}>
                <span className="parcial-chip-rank">{i + 1}</span>
                {a.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Punto (d) — Riesgos / no-riesgos / supuestos / trade-offs ──────────── */

function StepD({
  state,
  save,
  onExport,
}: {
  state: ExamState;
  save: () => void;
  onExport: () => void;
}) {
  return (
    <div className="parcial-step-card">
      <div className="parcial-step-intro">
        <h4>d · Riesgos, supuestos y trade-offs</h4>
        <p>
          Indicá <strong>2 de cada uno</strong>: riesgos, no-riesgos, supuestos y
          trade-offs tomados. Después bajá el <strong>.md</strong> con toda tu
          resolución (a/b/c/d, diagramas incluidos).
        </p>
      </div>

      <div className="parcial-dgrid">
        <div className="parcial-field">
          <span className="parcial-field-label">Riesgos (2)</span>
          <span className="parcial-muted-small parcial-field-hint">
            Decisiones que podrían no cumplir un atributo — con su mitigación.
          </span>
          <textarea
            className="vtool-textarea"
            placeholder={
              "ej. SPOF en el motor de matching → failover activo-pasivo < 5s.\nSaturación del bus de eventos en pico → backpressure + DLQ."
            }
            defaultValue={state.risks || ""}
            onChange={(e) => {
              state.risks = e.target.value;
              save();
            }}
          />
        </div>

        <div className="parcial-field">
          <span className="parcial-field-label">No-riesgos (2)</span>
          <span className="parcial-muted-small parcial-field-hint">
            Decisiones que NO son riesgo y por qué (descartadas con fundamento).
          </span>
          <textarea
            className="vtool-textarea"
            placeholder={
              "ej. Elegir SQL OLTP no es riesgo: el volumen y la consistencia encajan.\nConsistencia eventual en el catálogo no es riesgo: el dominio la tolera."
            }
            defaultValue={state.nonRisks || ""}
            onChange={(e) => {
              state.nonRisks = e.target.value;
              save();
            }}
          />
        </div>

        <div className="parcial-field">
          <span className="parcial-field-label">Supuestos (2)</span>
          <span className="parcial-muted-small parcial-field-hint">
            Lo que asumís del contexto y que, de cambiar, cambiaría el diseño.
          </span>
          <textarea
            className="vtool-textarea"
            placeholder={
              "ej. El proveedor de GPS garantiza latencia < 2s.\nEl pico de tráfico no supera 10× la media sostenida."
            }
            defaultValue={state.assumptions || ""}
            onChange={(e) => {
              state.assumptions = e.target.value;
              save();
            }}
          />
        </div>

        <div className="parcial-field">
          <span className="parcial-field-label">Trade-offs (2)</span>
          <span className="parcial-muted-small parcial-field-hint">
            Qué ganás y qué resignás en cada compromiso explícito.
          </span>
          <textarea
            className="vtool-textarea"
            placeholder={
              "ej. CP sobre AP en el matching: consistencia a costa de tolerancia a particiones.\nCache agresivo: performance a costa de frescura del dato."
            }
            defaultValue={state.tradeoffs || ""}
            onChange={(e) => {
              state.tradeoffs = e.target.value;
              save();
            }}
          />
        </div>
      </div>

      <div className="parcial-field">
        <span className="parcial-field-label">Notas adicionales (opcional)</span>
        <textarea
          className="vtool-textarea"
          rows={3}
          placeholder="Stakeholders, decisiones pendientes, alcance dejado afuera…"
          defaultValue={state.notes || ""}
          onChange={(e) => {
            state.notes = e.target.value;
            save();
          }}
        />
      </div>

      <div className="parcial-final-actions">
        <button
          type="button"
          className="btn btn--sm parcial-btn-primary"
          onClick={onExport}
        >
          ↓ Exportar y guardar respuesta
        </button>
        <span className="parcial-muted-small">
          Autoguardado en tu navegador. El botón además baja un{" "}
          <strong>.md</strong>.
        </span>
      </div>
    </div>
  );
}

/* ── Export a Markdown ──────────────────────────────────────────────────── */

function svgToDataUri(svgStr: string): string {
  const b64 = btoa(unescape(encodeURIComponent(svgStr)));
  return `data:image/svg+xml;base64,${b64}`;
}

// Renderiza el SVG de un diagrama montando un editor offscreen (igual que la
// app fuente). Devuelve "" si algo falla — el export degrada con elegancia.
function renderDiagramSVG(diagramState: DiagramState): string {
  try {
    const tmp = document.createElement("div");
    tmp.style.position = "absolute";
    tmp.style.left = "-99999px";
    tmp.style.top = "0";
    document.body.appendChild(tmp);
    const ed = createDiagramEditor(tmp, {
      initialState: diagramState,
    }) as DiagramInstance;
    const svg = ed.toSVG();
    ed.destroy?.();
    tmp.remove();
    return svg;
  } catch {
    return "";
  }
}

function diagramTextSummary(d: DiagramState): string {
  if (!d || (!d.nodes.length && !d.edges.length)) return "";
  const nodes = d.nodes as { id: string; type: string; label: string }[];
  const edges = d.edges as { from: string; to: string; label?: string }[];
  const lines: string[] = [];
  lines.push("<details><summary>Componentes y conexiones (texto)</summary>");
  lines.push("");
  lines.push("**Componentes:**");
  nodes.forEach((n) => lines.push(`- \`${n.type}\` — ${n.label}`));
  if (edges.length) {
    const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
    lines.push("");
    lines.push("**Conexiones:**");
    edges.forEach((e) => {
      const a = byId[e.from];
      const b = byId[e.to];
      if (!a || !b) return;
      lines.push(`- ${a.label} → ${b.label}${e.label ? " [" + e.label + "]" : ""}`);
    });
  }
  lines.push("");
  lines.push("</details>");
  return lines.join("\n");
}

function buildMarkdown(exercise: Exercise, state: ExamState): string {
  const lines: string[] = [];
  lines.push(`# ${exercise.title}`);
  lines.push("");
  lines.push(`> **Parcial simulado · respuesta del alumno**  `);
  lines.push(
    `> Caso: ${exercise.id} · Fecha: ${new Date().toLocaleString("es-AR")}  `,
  );
  lines.push("");
  lines.push(`## Dominio`);
  lines.push(exercise.domain || "");
  lines.push("");

  // a) Funcionalidades de alto nivel (orden del array = importancia)
  lines.push(`## a) Funcionalidades de alto nivel`);
  const funcs = (state.functionalities || []).filter((f) => f.text.trim());
  if (funcs.length === 0) lines.push("_(sin funcionalidades cargadas)_");
  else funcs.forEach((f, i) => lines.push(`${i + 1}. ${f.text.trim()}`));
  lines.push("");

  // b) Atributos de calidad con justificación, ordenados por importancia
  lines.push(`## b) Atributos de calidad`);
  const ordered = state.attrOrder
    .map((x) => state.attrs.find((a) => a.id === x))
    .filter((a): a is AttrItem => !!a);
  if (ordered.length === 0) lines.push("_(sin atributos seleccionados)_");
  else {
    ordered.forEach((a, i) => {
      const just = a.justification?.trim();
      const marker = i < TOP_N ? `**${i + 1}.**` : `${i + 1}.`;
      const tail = i < TOP_N ? " _(driver de arquitectura)_" : "";
      lines.push(
        `${marker} **${a.name}**${a.custom ? " _(custom)_" : ""}${tail}${just ? ` — ${just}` : ""}`,
      );
    });
  }
  lines.push("");

  // Citas del enunciado (evidencia por atributo)
  const citations = state.citations || [];
  if (citations.length) {
    lines.push(`### Evidencia citada del enunciado`);
    const byAttr = new Map<string, Citation[]>();
    citations.forEach((c) => {
      const list = byAttr.get(c.attrId);
      if (list) list.push(c);
      else byAttr.set(c.attrId, [c]);
    });
    const emit = (name: string, items: Citation[]) => {
      lines.push("");
      lines.push(`**${name}**`);
      lines.push("");
      items.forEach((c) => lines.push(`> “${c.text}”`));
    };
    ordered.forEach((a) => {
      const items = byAttr.get(a.id);
      if (items) {
        emit(a.name, items);
        byAttr.delete(a.id);
      }
    });
    byAttr.forEach((items, attrId) => {
      const name = state.attrs.find((a) => a.id === attrId)?.name ?? attrId;
      emit(`${name} _(atributo no seleccionado)_`, items);
    });
    lines.push("");
  }

  // c) Arquitectura candidata: diagrama base + justificación + refinamiento
  lines.push(`## c) Arquitectura candidata`);
  lines.push("");
  lines.push(`### Diagrama base`);
  if (
    state.baseDiagram &&
    (state.baseDiagram.nodes.length || state.baseDiagram.edges.length)
  ) {
    const svg = renderDiagramSVG(state.baseDiagram);
    if (svg) {
      lines.push(`![Diagrama base](${svgToDataUri(svg)})`);
      lines.push("");
    }
    lines.push(diagramTextSummary(state.baseDiagram));
  } else lines.push("_(sin diagrama)_");
  lines.push("");
  lines.push(`### Justificación (relación con los atributos del punto b)`);
  lines.push(
    state.archJustification?.trim()
      ? state.archJustification
      : "_(sin contenido)_",
  );
  lines.push("");

  // d) Riesgos / no-riesgos / supuestos / trade-offs (2 de cada uno)
  lines.push(`## d) Riesgos, supuestos y trade-offs`);
  lines.push("");
  const dBlock = (title: string, value: string) => {
    lines.push(`### ${title}`);
    lines.push(value?.trim() ? value : "_(sin contenido)_");
    lines.push("");
  };
  dBlock("Riesgos", state.risks);
  dBlock("No-riesgos", state.nonRisks);
  dBlock("Supuestos", state.assumptions);
  dBlock("Trade-offs", state.tradeoffs);
  if (state.notes?.trim()) {
    lines.push(`### Notas`);
    lines.push(state.notes);
  }
  lines.push("");
  lines.push(`---`);
  lines.push(
    `_Generado por el toolkit de Inge2 de StudyVaults. Última edición: ${state.updatedAt || ""}_`,
  );
  return lines.join("\n");
}

function ymdhm(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(
    d.getHours(),
  )}${p(d.getMinutes())}`;
}

function downloadText(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime + ";charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 200);
}

function exportAndSave(
  exercise: Exercise,
  state: ExamState,
  flushEditors: () => void,
) {
  flushEditors();
  persist(exercise.id, state);
  const md = buildMarkdown(exercise, state);
  downloadText(`${exercise.id}-${ymdhm()}.md`, md, "text/markdown");
}

/* ── Icono ──────────────────────────────────────────────────────────────── */

function FlaskIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M6 2v4L3 12.5A1 1 0 0 0 4 14h8a1 1 0 0 0 .9-1.5L10 6V2M5 2h6M5.5 9h5"
        stroke="currentColor"
        fill="none"
        strokeWidth={1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Cuatro esquinas: glifo de "encuadre/focus" (entrar y salir del modo focus).
function FocusIcon() {
  return (
    <svg width={14} height={14} viewBox="0 0 16 16" aria-hidden="true">
      <path
        d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4"
        stroke="currentColor"
        fill="none"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
