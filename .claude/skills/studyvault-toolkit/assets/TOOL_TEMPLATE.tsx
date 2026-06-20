"use client";

/* ──────────────────────────────────────────────────────────────────────────
   Esqueleto mínimo de un toolkit por materia de StudyVaults.

   Copialo a site/components/vault-tools/<Xxx>Tools.tsx, renombrá, completá las
   herramientas con contenido real de la materia (leído de wiki/) y registralo:
     1) site/lib/content/vaults.ts          → toolkit: true en el VaultConfig
     2) site/components/vault-tools/registry.tsx → TOOLKITS.<id> = <Xxx>Tools

   Patrón monolítico (todas las tools en un archivo). Para toolkits grandes o con
   progreso compartido, partí cada tool a su archivo en vault-tools/<vault>/ y
   mirá Inge2Tools.tsx + assets/PROGRESO_CONTRATO.md.

   Reglas: static-export safe (window/localStorage/Date.now()/Math.random() sólo
   en effects/handlers), presentación con @studyvaults/ui, tokens §12 (var(--…)),
   lógica pura en components/vault-tools/lib/.
   ────────────────────────────────────────────────────────────────────────── */

import { useEffect, useMemo, useState } from "react";
import {
  Panel,
  SubPanel,
  Note,
  Field,
  TextInput,
  Slider,
  Chip,
  BigNum,
  Readout,
  Button,
} from "@studyvaults/ui";
import ToolkitShell, { type Tool } from "./ToolkitShell";

/* ─── helpers de persistencia static-export safe (inline; o reusá los de
   vault-tools/inge2/progress.ts si vas a tener flujo de estudio) ─────────── */

function loadJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? ((JSON.parse(raw) ?? fallback) as T) : fallback;
  } catch {
    return fallback;
  }
}
function saveJSON<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage lleno/bloqueado — ignorar */
  }
}

/* ════════════════════════════════ TOOL 1 ════════════════════════════════ */
/* Calculadora sin estado persistido — recalcula en cada render.             */

function ExampleCalc() {
  const [x, setX] = useState(10);

  // Lógica pura: idealmente importada de ./lib/<materia>. Acá inline de ejemplo.
  const result = useMemo(() => x * x, [x]);

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Eyebrow de la materia</span>
        <h3>Título de la herramienta</h3>
        <p>Una o dos líneas en lenguaje llano: qué calcula y por qué sirve.</p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <Field label="Parámetro x" hint={`${x}`}>
            <Slider
              min={0}
              max={100}
              step={1}
              value={x}
              onChange={(e) => setX(Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="vtool-stack">
          <SubPanel>
            <span className="vtool-eyebrow">Resultado</span>
            <div style={{ marginTop: 8 }}>
              <BigNum value={String(result)} unit="x²" />
            </div>
            <Readout
              style={{ marginTop: 12 }}
              items={[{ k: "x", v: String(x) }, { k: "x²", v: String(result), tone: "accent" }]}
            />
          </SubPanel>
          <Note style={{ marginTop: 0 }}>
            Reemplazá esta tool por algo real de la materia. La matemática va en un
            helper puro de <code>components/vault-tools/lib/</code>.
          </Note>
        </div>
      </div>
    </Panel>
  );
}

/* ════════════════════════════════ TOOL 2 ════════════════════════════════ */
/* Práctica CON estado persistido — patrón hydrated → load → save.           */

const TOOL2_KEY = "<vault>.v1.example.state"; // namespaceá por vault

interface Tool2State {
  note: string;
}
const TOOL2_DEFAULT: Tool2State = { note: "" };

function ExamplePersisted() {
  const [state, setState] = useState<Tool2State>(TOOL2_DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  // Montaje (client only): cargar lo guardado.
  useEffect(() => {
    setState(loadJSON<Tool2State>(TOOL2_KEY, TOOL2_DEFAULT));
    setHydrated(true);
  }, []);

  // Persistir tras cada cambio (post-hidratación).
  useEffect(() => {
    if (!hydrated) return;
    saveJSON(TOOL2_KEY, state);
  }, [state, hydrated]);

  function reset() {
    if (typeof window === "undefined") return;
    if (!window.confirm("¿Reiniciar? Se borra el progreso de esta herramienta.")) return;
    setState(TOOL2_DEFAULT);
  }

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Eyebrow</span>
        <h3>Herramienta con persistencia</h3>
        <p>
          El estado se guarda en el navegador. {!hydrated && "Cargando tu estado guardado…"}
        </p>
      </div>

      <div className="vtool-stack">
        <Field label="Una nota">
          <TextInput
            value={state.note}
            onChange={(e) => setState((s) => ({ ...s, note: e.target.value }))}
          />
        </Field>
        <div className="vtool-row">
          <Button variant="ghost" size="sm" onClick={reset}>
            Reiniciar
          </Button>
        </div>
      </div>
    </Panel>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
   Export — arma las tabs con ToolkitShell.
   ────────────────────────────────────────────────────────────────────────── */

export default function XxxTools() {
  const tools: Tool[] = [
    {
      key: "calc",
      label: "Calculadora",
      icon: "calculator", // un nombre de ToolIconName (ver components/vault-tools/ToolIcon.tsx)
      verb: "Calcular",
      desc: "Qué hace, en lenguaje llano, para alguien que no sabe la materia.",
      // group: "Cálculo",  // opcional: agrupa cards bajo un encabezado
      node: <ExampleCalc />,
    },
    {
      key: "practica",
      label: "Práctica",
      icon: "cards",
      verb: "Practicar",
      desc: "Una herramienta cuyo progreso se guarda en el navegador.",
      node: <ExamplePersisted />,
    },
  ];

  return (
    <ToolkitShell
      intro={<>Una línea que presenta el toolkit de la materia.</>}
      tools={tools}
    />
  );
}
