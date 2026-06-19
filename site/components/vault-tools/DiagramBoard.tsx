"use client";

import { useEffect, useRef, useState } from "react";
import { Panel, Note } from "@studyvaults/ui";
import { createDiagramEditor, cloneDiagram } from "./diagram-editor";

/* ──────────────────────────────────────────────────────────────────────────
   Pizarra de diagramas — wrapper React del editor SVG vanilla (diagram-editor.ts).
   Monta el editor en un contenedor ref, persiste el estado en localStorage y
   ofrece export a SVG. Static-export safe: todo el acceso a window/document/
   localStorage ocurre dentro de useEffect o de handlers de evento.
   ────────────────────────────────────────────────────────────────────────── */

const STORAGE_KEY = "inge2.diagram.v1";

interface DiagramState {
  nodes: unknown[];
  edges: unknown[];
}
interface DiagramInstance {
  getState: () => DiagramState;
  setState: (s: DiagramState) => void;
  toSVG: () => string;
  startInlineEdit?: (id: string) => void;
  destroy: () => void;
}

const EMPTY: DiagramState = { nodes: [], edges: [] };

// Validación defensiva del estado persistido: nos quedamos solo con nodos de
// geometría finita e id/tipo string, y aristas cuyos extremos existan. Así un
// storage corrupto (editado a mano) no rompe el render ni deja la pizarra en blanco.
function sanitize(parsed: unknown): DiagramState {
  if (!parsed || typeof parsed !== "object") return EMPTY;
  const p = parsed as { nodes?: unknown; edges?: unknown };
  if (!Array.isArray(p.nodes) || !Array.isArray(p.edges)) return EMPTY;
  const num = (v: unknown) => typeof v === "number" && Number.isFinite(v);
  const nodes = p.nodes.filter((n) => {
    if (!n || typeof n !== "object") return false;
    const o = n as Record<string, unknown>;
    return (
      typeof o.id === "string" &&
      typeof o.type === "string" &&
      num(o.x) && num(o.y) && num(o.w) && num(o.h)
    );
  });
  const ids = new Set(nodes.map((n) => (n as { id: string }).id));
  const edges = p.edges.filter((e) => {
    if (!e || typeof e !== "object") return false;
    const o = e as Record<string, unknown>;
    return (
      typeof o.from === "string" &&
      typeof o.to === "string" &&
      ids.has(o.from) &&
      ids.has(o.to)
    );
  });
  return { nodes, edges } as DiagramState;
}

export default function DiagramBoard() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const edRef = useRef<DiagramInstance | null>(null);
  const mountedRef = useRef(true);
  const [saved, setSaved] = useState(false);
  const [coarse, setCoarse] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    mountedRef.current = true;

    // Aviso en pantallas táctiles: el editor es mouse/trackpad.
    try {
      setCoarse(window.matchMedia("(pointer: coarse)").matches);
    } catch {
      /* matchMedia no disponible — asumir puntero fino */
    }

    // Load persisted diagram (client only), saneado contra datos corruptos.
    let initialState: DiagramState = EMPTY;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) initialState = sanitize(JSON.parse(raw));
    } catch {
      /* corrupt / unavailable storage — start empty */
    }

    let savedTimer: ReturnType<typeof setTimeout> | null = null;
    const ed = createDiagramEditor(host, {
      initialState,
      onChange: (state: DiagramState) => {
        try {
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch {
          /* storage full / blocked — ignore */
        }
        if (!mountedRef.current) return;
        setSaved(true);
        if (savedTimer) clearTimeout(savedTimer);
        savedTimer = setTimeout(() => {
          if (mountedRef.current) setSaved(false);
        }, 1400);
      },
    }) as DiagramInstance;
    edRef.current = ed;

    return () => {
      mountedRef.current = false;
      if (savedTimer) clearTimeout(savedTimer);
      ed.destroy();
      edRef.current = null;
    };
  }, []);

  const downloadSVG = () => {
    const ed = edRef.current;
    if (!ed) return;
    const svg = ed.toSVG();
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagrama-inge2.svg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const resetBoard = () => {
    const ed = edRef.current;
    if (!ed) return;
    if (!window.confirm("¿Reiniciar la pizarra? Se borra el diagrama guardado.")) return;
    ed.setState(cloneDiagram(EMPTY));
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    setSaved(false);
  };

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Pizarra</span>
        <h3>Editor de diagramas</h3>
        <p>
          Pizarra para dibujar arquitecturas durante el parcial: componentes, bases de datos,
          servicios externos, colas, capas, hexágonos y bounded contexts, conectados con
          flechas. Arrastrá, alineá con guías, reacomodá automáticamente y exportá a SVG.
        </p>
      </div>

      {coarse && (
        <Note tone="error" style={{ marginBottom: 14 }}>
          La pizarra está pensada para mouse o trackpad: en pantallas táctiles los
          gestos (arrastrar, conectar, zoom) pueden no responder. Usala desde una computadora.
        </Note>
      )}

      {/* El editor vanilla toma este contenedor: le agrega .diagram-editor y su UI. */}
      <div ref={hostRef} />

      <div
        className="vtool-row"
        style={{ marginTop: 14, justifyContent: "space-between", alignItems: "center" }}
      >
        <span
          className="vtool-mono"
          style={{ fontSize: 11, color: "var(--text-secondary)", border: "none", background: "transparent", padding: 0 }}
        >
          {saved ? "Guardado ✓" : "Se guarda solo en tu navegador"}
        </span>
        <div className="vtool-row">
          <button type="button" className="btn btn--sm btn--ghost" onClick={downloadSVG}>
            Descargar SVG
          </button>
          <button type="button" className="btn btn--sm btn--ghost" onClick={resetBoard}>
            Reiniciar
          </button>
        </div>
      </div>

      <Note style={{ marginTop: 12 }}>
        Atajos: doble-click renombra · arrastrá desde un punto cardinal para conectar ·
        arrastrá en vacío para seleccionar varias · Supr borra · Espacio + arrastrar (o rueda)
        para moverte y hacer zoom.
      </Note>
    </Panel>
  );
}
