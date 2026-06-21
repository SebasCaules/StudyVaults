"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createDiagramEditor, cloneDiagram } from "../diagram-editor";
import {
  EXERCISES,
  ENUNCIADOS,
  QA_CATALOG,
  SET_LABELS,
  type Exercise,
} from "./data";

/* ──────────────────────────────────────────────────────────────────────────
   Parcial simulado — práctica fiel al enunciado, portada del wizard vanilla de
   la app de estudio de Inge2 (js/tools/exam.js). Componente client-only:
   todo acceso a window/document/localStorage va dentro de useEffect o de
   handlers de evento (static-export safe).

   Wizard de 5 pasos:
     1. Enunciado (texto plano + anotaciones) + picker de atributos de calidad
     2. Priorizar — sólo los primeros 4 (TOP_N) operan en los pasos siguientes
     3. Arquitectura base — diagrama editable
     4. Escenarios y refinamiento — por cada uno de los top-4
     5. Trade-offs y riesgos + export .md

   Storage key: 'exam-practice-v2-<exerciseId>'
   ────────────────────────────────────────────────────────────────────────── */

const STORE_PREFIX = "exam-practice-v2-";
const TOP_N = 4;

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
interface ExamState {
  step: number;
  attrs: AttrItem[];
  attrOrder: string[];
  baseDiagram: DiagramState;
  perAttr: Record<string, PerAttr>;
  annotations: Record<number, Annotation>;
  enunciadoCollapsed: boolean;
  tradeoffs: string;
  risks: string;
  notes: string;
  updatedAt: string;
}

const EMPTY_DIAGRAM: DiagramState = { nodes: [], edges: [] };

function defaultState(): ExamState {
  return {
    step: 1,
    attrs: [],
    attrOrder: [],
    baseDiagram: { nodes: [], edges: [] },
    perAttr: {},
    annotations: {},
    enunciadoCollapsed: false,
    tradeoffs: "",
    risks: "",
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
    // Migrar el modelo viejo de 6 pasos (PDF + Atributos eran 1 y 2) al nuevo
    // de 5: old ≤2 → 1; old N≥3 → N-1.
    if (typeof obj.step === "number") {
      if (obj.step <= 2) obj.step = 1;
      else obj.step = Math.max(1, Math.min(5, obj.step - 1));
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
    if (typeof obj.enunciadoCollapsed !== "boolean")
      obj.enunciadoCollapsed = false;
    if (!obj.perAttr || typeof obj.perAttr !== "object") obj.perAttr = {};
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

const STEP_DEFS = [
  "Enunciado + atributos",
  "Priorizar",
  "Arquitectura base",
  "Escenarios + refinamiento",
  "Trade-offs y export",
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

// HTML del párrafo con las marcas de anotación aplicadas al texto crudo.
function annotatedParagraphHTML(text: string, anno?: Annotation): string {
  const hi = anno?.highlight ?? [];
  const un = anno?.underline ?? [];
  if (!hi.length && !un.length) {
    return escapeHtml(text).replace(/\n/g, "<br>");
  }
  const set = new Set<number>([0, text.length]);
  hi.forEach((r) => {
    set.add(r.start);
    set.add(r.end);
  });
  un.forEach((r) => {
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
    const escaped = escapeHtml(seg).replace(/\n/g, "<br>");
    if (!isHi && !isUn) {
      out.push(escaped);
      continue;
    }
    const classes: string[] = [];
    if (isHi) classes.push("enun-mark");
    if (isUn) classes.push("enun-uline");
    out.push(`<span class="${classes.join(" ")}">${escaped}</span>`);
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
        if (step <= 2) step = 1;
        else step = Math.max(1, Math.min(5, step));
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
          pistas durante la práctica. Cinco pasos guiados: atributos,
          priorización, arquitectura base, escenarios que rompen y refinamiento
          por atributo, y export a .md.
        </p>
      </div>

      <ol className="parcial-howto">
        <li>
          Paso 1: leés el enunciado y elegís los atributos relevantes, con una
          breve justificación por atributo.
        </li>
        <li>
          Paso 2: priorizás. Sólo los primeros 4 entran a los pasos de
          refinamiento.
        </li>
        <li>Paso 3: arquitectura base con shapes y flechas.</li>
        <li>
          Paso 4: por cada uno de los top-4, escenarios que rompen la base +
          diagrama refinado.
        </li>
        <li>Paso 5: trade-offs y riesgos, después Exportar y guardar.</li>
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
                      {p ? `paso ${p}/5` : "sin empezar"}
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
      stateRef.current.step = Math.max(1, Math.min(5, n));
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

      {/* Stepper */}
      <nav className="parcial-stepper" aria-label="Pasos">
        {STEP_DEFS.map((label, i) => {
          const n = i + 1;
          return (
            <button
              key={label}
              type="button"
              className={
                "parcial-step" +
                (n === step ? " is-current" : "") +
                (n < step ? " is-done" : "")
              }
              onClick={() => goStep(n)}
              title={label}
            >
              <span className="parcial-step-num">{n}</span>
              <span className="parcial-step-label">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Cuerpo del paso */}
      <div className="parcial-step-body">
        {step === 1 && (
          <Step1
            state={state}
            save={save}
            rerender={rerender}
          />
        )}
        {step === 2 && (
          <Step2 state={state} save={save} rerender={rerender} />
        )}
        {step === 3 && (
          <Step3 state={state} save={save} editorsRef={editorsRef} />
        )}
        {step === 4 && (
          <Step4
            state={state}
            save={save}
            flushEditors={flushEditors}
            editorsRef={editorsRef}
          />
        )}
        {step === 5 && (
          <Step5
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
        <div className="parcial-nav-progress">Paso {step} de 5</div>
        <button
          type="button"
          className="btn btn--sm parcial-btn-primary"
          onClick={() => {
            if (step < 5) goStep(step + 1);
            else exportAndSave(exercise, state, flushEditors);
          }}
        >
          {step < 5 ? "Continuar →" : "Finalizar ✓"}
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
  const [annoEnabled, setAnnoEnabled] = useState(false);
  const paragraphs = ENUNCIADOS[exercise.id] ?? null;
  const collapsed = state.enunciadoCollapsed;

  // Re-pintar los párrafos in-place tras una marca (sin remontar React).
  const repaint = useCallback(() => {
    const root = bodyRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>("p[data-p-idx]").forEach((p) => {
      const idx = parseInt(p.dataset.pIdx ?? "0", 10);
      const src = (ENUNCIADOS[exercise.id] ?? [])[idx] ?? "";
      p.innerHTML = annotatedParagraphHTML(src, state.annotations[idx]);
    });
  }, [exercise.id, state]);

  // Pintar al montar y cada vez que el dock se expande (al expandir, los <p>
  // del enunciado se remontan vacíos y hay que reinyectar su HTML con marcas).
  useEffect(() => {
    if (!collapsed) repaint();
  }, [repaint, collapsed]);

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
                  Seleccioná texto y aplicá una marca.
                </span>
              </div>
              <div className="parcial-enunciado-body" ref={bodyRef}>
                {paragraphs.map((_, i) => (
                  // El contenido se inyecta en repaint() (innerHTML con las marcas).
                  <p key={i} data-p-idx={i} />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </section>
  );
}

/* ── Paso 1 — Atributos de calidad ──────────────────────────────────────── */

function Step1({
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
    <div className="parcial-step-card">
      <div className="parcial-step-intro">
        <h4>Atributos de calidad</h4>
        <p>
          Tocá los nombres que correspondan a este caso. Al seleccionar uno, se
          despliega un campo de justificación breve. Sin descripciones —
          recordás lo que ya estudiaste.
        </p>
      </div>

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

/* ── Paso 2 — Priorizar ─────────────────────────────────────────────────── */

function Step2({
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
      <div className="parcial-step-card">
        <h4>Paso 2 · Priorizar</h4>
        <p className="vtool-note">No elegiste atributos. Volvé al paso 1.</p>
      </div>
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
    <div className="parcial-step-card">
      <div className="parcial-step-intro">
        <h4>Paso 2 · Priorizar</h4>
        <p>
          Ordená por importancia para este caso. <strong>Sólo los primeros{" "}
          {TOP_N}</strong> entran a los pasos de arquitectura y refinamiento. El
          resto queda como nota.
        </p>
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
            Los <strong>primeros {TOP_N}</strong> de tu ranking pasan a los pasos
            3–5. Los {ordered.length - TOP_N} restantes quedan registrados en el
            export como atributos secundarios.
          </>
        )}
      </div>
    </div>
  );
}

/* ── Paso 3 — Arquitectura base ─────────────────────────────────────────── */

function topAttrs(state: ExamState): AttrItem[] {
  return state.attrOrder
    .slice(0, TOP_N)
    .map((x) => state.attrs.find((a) => a.id === x))
    .filter((a): a is AttrItem => !!a);
}

function Step3({
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
    <div className="parcial-step-card">
      <div className="parcial-step-intro">
        <h4>Paso 3 · Arquitectura inicial</h4>
        <p>
          Diagramá tu primera propuesta. Cuadrado, círculo, nube, BD, actor +
          flechas. <strong>Doble-click</strong> para renombrar; al colocar una
          forma nueva, el cursor se posa en el nombre automáticamente.
        </p>
      </div>
      <div className="parcial-diagram-wrap" ref={hostRef} />
      {top.length ? (
        <div className="parcial-step-footnote">
          <span className="parcial-muted-small">
            Vas a estresar la base contra estos atributos (top {TOP_N}):
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
      ) : (
        <div className="parcial-step-footnote">
          <span className="parcial-muted-small">
            ⚠ Sin atributos priorizados. Volvé al paso 1/2.
          </span>
        </div>
      )}
    </div>
  );
}

/* ── Paso 4 — Escenarios y refinamiento (solo top 4) ────────────────────── */

function Step4({
  state,
  save,
  flushEditors,
  editorsRef,
}: {
  state: ExamState;
  save: () => void;
  flushEditors: () => void;
  editorsRef: React.MutableRefObject<Record<string, DiagramInstance>>;
}) {
  const top = topAttrs(state);
  const [activeId, setActiveId] = useState<string | null>(top[0]?.id ?? null);

  if (!top.length) {
    return (
      <div className="parcial-step-card">
        <h4>Paso 4 · Escenarios y refinamiento</h4>
        <p className="vtool-note">
          No hay atributos priorizados. Volvé al paso 1/2.
        </p>
      </div>
    );
  }

  return (
    <div className="parcial-step-card">
      <div className="parcial-step-intro">
        <h4>Paso 4 · Escenarios que rompen y refinamiento</h4>
        <p>
          Para cada uno de los <strong>top {TOP_N}</strong>: identificá los
          escenarios que rompen tu base y refiná el diagrama. Arranca clonado del
          paso 3.
        </p>
      </div>

      <div className="parcial-attr-tabs" role="tablist">
        {top.map((a, i) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            className={
              "parcial-attr-tab" + (a.id === activeId ? " is-active" : "")
            }
            onClick={() => {
              flushEditors();
              setActiveId(a.id);
            }}
          >
            <span className="parcial-attr-tab-rank">{i + 1}</span>
            {a.name}
          </button>
        ))}
      </div>

      {activeId && (
        <Step4Panel
          key={activeId}
          state={state}
          attrId={activeId}
          save={save}
          editorsRef={editorsRef}
        />
      )}
    </div>
  );
}

function Step4Panel({
  state,
  attrId,
  save,
  editorsRef,
}: {
  state: ExamState;
  attrId: string;
  save: () => void;
  editorsRef: React.MutableRefObject<Record<string, DiagramInstance>>;
}) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const edRef = useRef<DiagramInstance | null>(null);
  const attr = state.attrs.find((a) => a.id === attrId);

  // Asegurar la entrada perAttr (clonada de la base) sin tocar localStorage en
  // render: la persistencia ocurre dentro del efecto de montaje del editor.
  if (attr && !state.perAttr[attrId]) {
    state.perAttr[attrId] = {
      breakingScenarios: "",
      diagram: cloneDiagram(state.baseDiagram) as DiagramState,
    };
  }
  const pa = state.perAttr[attrId];

  useEffect(() => {
    const host = hostRef.current;
    if (!host || !pa) return;
    save(); // persiste la entrada perAttr recién clonada, si la hubiera.
    const ed = createDiagramEditor(host, {
      initialState: pa.diagram,
      onChange: (s: DiagramState) => {
        pa.diagram = s;
        save();
      },
    }) as DiagramInstance;
    edRef.current = ed;
    editorsRef.current[attrId] = ed;
    return () => {
      try {
        pa.diagram = ed.getState();
      } catch {
        /* ignore */
      }
      ed.destroy();
      edRef.current = null;
      delete editorsRef.current[attrId];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attrId]);

  if (!attr || !pa) return null;

  const resetFromBase = () => {
    if (!window.confirm("¿Restablecer este diagrama a una copia exacta del paso 3?"))
      return;
    pa.diagram = cloneDiagram(state.baseDiagram) as DiagramState;
    edRef.current?.setState(pa.diagram);
    save();
  };

  return (
    <div className="parcial-attr-panel">
      <h5 className="parcial-attr-panel-title">{attr.name}</h5>
      {attr.justification && (
        <div className="parcial-attr-panel-just">{attr.justification}</div>
      )}

      <div className="parcial-field">
        <span className="parcial-field-label">
          Escenarios que rompen la base (uno por línea)
        </span>
        <textarea
          className="vtool-textarea"
          placeholder="ej. Pico de 10× tráfico durante 15min — la base sirve 80% con timeout > 2s, requerimos < 200ms."
          defaultValue={pa.breakingScenarios || ""}
          onChange={(e) => {
            pa.breakingScenarios = e.target.value;
            save();
          }}
        />
      </div>

      <div className="parcial-field">
        <span className="parcial-field-label">
          Diagrama refinado para {attr.name}
        </span>
        <span className="parcial-muted-small parcial-field-hint">
          Arranca como clon del paso 3. Editá libremente.
        </span>
        <div className="parcial-diagram-wrap" ref={hostRef} />
        <div className="parcial-attr-panel-actions">
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={resetFromBase}
          >
            ↺ Restablecer desde la base
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Paso 5 — Trade-offs y export ───────────────────────────────────────── */

function Step5({
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
        <h4>Paso 5 · Trade-offs, riesgos y exportar</h4>
        <p>
          Compromisos y riesgos al final. Después bajá el <strong>.md</strong> —
          incluye todo (atributos con justificación, ranking, diagramas como SVG,
          escenarios, etc.).
        </p>
      </div>

      <div className="parcial-field">
        <span className="parcial-field-label">Trade-offs explícitos</span>
        <textarea
          className="vtool-textarea"
          placeholder="ej. CP sobre AP en el matching: ganamos consistencia a costa de tolerancia a particiones. Mitigado con replicación sincrónica activa-pasiva."
          defaultValue={state.tradeoffs || ""}
          onChange={(e) => {
            state.tradeoffs = e.target.value;
            save();
          }}
        />
      </div>

      <div className="parcial-field">
        <span className="parcial-field-label">
          Riesgos arquitectónicos + mitigaciones
        </span>
        <textarea
          className="vtool-textarea"
          placeholder="ej. SPOF en el motor → failover sincrónico < 5s. Saturación de bus → backpressure + DLQ."
          defaultValue={state.risks || ""}
          onChange={(e) => {
            state.risks = e.target.value;
            save();
          }}
        />
      </div>

      <div className="parcial-field">
        <span className="parcial-field-label">Notas adicionales (opcional)</span>
        <textarea
          className="vtool-textarea"
          rows={3}
          placeholder="Stakeholders, supuestos, decisiones pendientes…"
          defaultValue={state.notes || ""}
          onChange={(e) => {
            state.notes = e.target.value;
            save();
          }}
        />
      </div>

      <div className="parcial-final-actions">
        <button type="button" className="btn btn--sm parcial-btn-primary" onClick={onExport}>
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

  // Atributos con justificación
  lines.push(`## Atributos de calidad`);
  if (state.attrs.length === 0) lines.push("_(sin atributos seleccionados)_");
  else {
    state.attrs.forEach((a) => {
      const just = a.justification?.trim();
      lines.push(
        `- **${a.name}**${a.custom ? " _(custom)_" : ""}${just ? ` — ${just}` : ""}`,
      );
    });
  }
  lines.push("");

  // Ranking
  lines.push(`## Priorización`);
  const ordered = state.attrOrder
    .map((x) => state.attrs.find((a) => a.id === x))
    .filter((a): a is AttrItem => !!a);
  if (ordered.length === 0) lines.push("_(sin ranking)_");
  else {
    ordered.forEach((a, i) => {
      const marker = i < TOP_N ? `**${i + 1}.**` : `${i + 1}.`;
      const tail = i < TOP_N ? " _(top — entra al refinamiento)_" : "";
      lines.push(`${marker} ${a.name}${tail}`);
    });
  }
  lines.push("");

  // Diagrama base
  lines.push(`## Arquitectura inicial`);
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

  // Por atributo (solo top 4)
  lines.push(`## Escenarios y refinamiento (top ${TOP_N})`);
  const top = topAttrs(state);
  if (top.length === 0) lines.push("_(sin atributos priorizados)_");
  else
    top.forEach((a, i) => {
      const pa = state.perAttr[a.id] || {
        breakingScenarios: "",
        diagram: { nodes: [], edges: [] },
      };
      lines.push("");
      lines.push(`### ${i + 1}. ${a.name}`);
      if (a.justification?.trim()) lines.push(`> ${a.justification.trim()}`);
      lines.push("");
      lines.push(`**Escenarios que rompen la base:**`);
      lines.push("");
      if (pa.breakingScenarios?.trim()) {
        pa.breakingScenarios.split(/\n+/).forEach((s) => {
          const t = s.trim();
          if (t) lines.push(`- ${t}`);
        });
      } else lines.push("_(sin escenarios)_");
      lines.push("");
      lines.push(`**Diagrama refinado:**`);
      lines.push("");
      if (pa.diagram && (pa.diagram.nodes.length || pa.diagram.edges.length)) {
        const svg = renderDiagramSVG(pa.diagram);
        if (svg) {
          lines.push(`![Refinamiento — ${a.name}](${svgToDataUri(svg)})`);
          lines.push("");
        }
        lines.push(diagramTextSummary(pa.diagram));
      } else lines.push("_(sin diagrama)_");
      lines.push("");
    });

  // Trade-offs
  lines.push(`## Trade-offs explícitos`);
  lines.push(state.tradeoffs?.trim() ? state.tradeoffs : "_(sin contenido)_");
  lines.push("");
  lines.push(`## Riesgos y mitigaciones`);
  lines.push(state.risks?.trim() ? state.risks : "_(sin contenido)_");
  if (state.notes?.trim()) {
    lines.push("");
    lines.push(`## Notas`);
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
