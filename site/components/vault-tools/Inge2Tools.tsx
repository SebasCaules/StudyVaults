"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Panel,
  SubPanel,
  Note,
  TextInput,
  TextArea,
  Select,
  Chip,
  Field,
  Slider,
  Badge,
  BigNum,
  Readout,
  KeyValue,
  DataTable,
  CopyButton,
} from "@studyvaults/ui";
import ToolkitShell, { type Tool } from "./ToolkitShell";
import DiagramBoard from "./DiagramBoard";
import ParcialSimulado from "./parcial/ParcialSimulado";
import StudyDashboard from "./inge2/StudyDashboard";
import Flashcards from "./inge2/Flashcards";
import TradeoffTrainer from "./inge2/TradeoffTrainer";
import QuizBank from "./inge2/QuizBank";
import MechanismPicker from "./inge2/MechanismPicker";
import AntipatternDrill from "./inge2/AntipatternDrill";

/* ──────────────────────────────────────────────────────────────────────────
   Ingeniería del Software II — study toolkit
   Materia de arquitectura de software: atributos de calidad, ADD/ATAM,
   estilos, persistencia (CAP), seguridad y patrones GoF.
   Datos puros + interactividad client-only. Static-export safe: todo acceso
   a window/localStorage va detrás de useEffect o de event handlers.
   ────────────────────────────────────────────────────────────────────────── */

/* ════════════════════════════════ TOOL 1 ════════════════════════════════ */
/* Catálogo de patrones GoF (búsqueda + filtro por categoría).               */

type Category = "Creational" | "Structural" | "Behavioral";

interface Pattern {
  name: string;
  category: Category;
  intent: string;
  applicability: string;
  consequences: string;
  example: string;
}

const PATTERNS: Pattern[] = [
  {
    name: "Singleton",
    category: "Creational",
    intent:
      "Ensure a class has only one instance and provide a global point of access to it.",
    applicability:
      "Exactly one instance must coordinate shared state — a registry, a configuration holder, a connection pool, a logger.",
    consequences:
      "Controlled access and lazy init, but it hides dependencies, hurts testability and acts as global mutable state. Watch thread-safety.",
    example:
      "An app-wide ConfigRegistry whose single instance every module reads settings from.",
  },
  {
    name: "Factory Method",
    category: "Creational",
    intent:
      "Define an interface for creating an object, but let subclasses decide which class to instantiate.",
    applicability:
      "A class can't anticipate the class of objects it must create, or wants subclasses to specify them.",
    consequences:
      "Removes new-coupling to concrete types and centralizes creation, at the cost of a parallel hierarchy of creators.",
    example:
      "A Dialog base whose createButton() is overridden by WindowsDialog / WebDialog.",
  },
  {
    name: "Abstract Factory",
    category: "Creational",
    intent:
      "Provide an interface for creating families of related objects without specifying their concrete classes.",
    applicability:
      "A system must be independent of how its products are created and configured across consistent families/themes.",
    consequences:
      "Guarantees product compatibility and isolates concrete classes, but adding a new product kind means changing every factory.",
    example:
      "A GuiFactory producing matching Button + Checkbox + Menu for a Light or Dark theme.",
  },
  {
    name: "Builder",
    category: "Creational",
    intent:
      "Separate the construction of a complex object from its representation so the same process can build different representations.",
    applicability:
      "Construction needs many optional steps/parameters, or you want to build the object step by step (telescoping constructors).",
    consequences:
      "Readable, fluent, immutable results and step reuse — at the price of an extra builder class per product.",
    example:
      "An HttpRequest.builder().url(u).header(...).timeout(...).build() chain.",
  },
  {
    name: "Prototype",
    category: "Creational",
    intent:
      "Specify the kinds of objects to create using a prototypical instance, and create new objects by copying it.",
    applicability:
      "Object creation is expensive, or the concrete class is decided at runtime and you'd rather clone a configured exemplar.",
    consequences:
      "Cheap instantiation and runtime-configured objects, but deep vs shallow copy of graphs is subtle and error-prone.",
    example:
      "Cloning a pre-configured Shape with its style instead of re-running an expensive constructor.",
  },
  {
    name: "Adapter",
    category: "Structural",
    intent:
      "Convert the interface of a class into another interface clients expect, letting incompatible classes work together.",
    applicability:
      "You must reuse an existing class whose interface doesn't match the one your code requires (often a third-party library).",
    consequences:
      "Reuse of legacy/foreign code without modifying it; one extra indirection layer and a potential proliferation of adapters.",
    example:
      "Wrapping a legacy XmlReport so it satisfies the new Report interface the UI consumes.",
  },
  {
    name: "Bridge",
    category: "Structural",
    intent:
      "Decouple an abstraction from its implementation so the two can vary independently.",
    applicability:
      "Both an abstraction and its implementation have multiple variants and you want to avoid a combinatorial class explosion.",
    consequences:
      "Independent extension of two dimensions and runtime binding, but adds indirection and upfront design effort.",
    example:
      "A Shape abstraction delegating drawing to a Renderer (Vector / Raster) implementation.",
  },
  {
    name: "Composite",
    category: "Structural",
    intent:
      "Compose objects into tree structures and let clients treat individual objects and compositions uniformly.",
    applicability:
      "You want to represent part–whole hierarchies and have clients ignore the difference between leaves and containers.",
    consequences:
      "Uniform recursive treatment and easy new component types, but it can make the design overly general / weakly typed.",
    example:
      "A file-system tree where File and Directory share a size() contract.",
  },
  {
    name: "Decorator",
    category: "Structural",
    intent:
      "Attach additional responsibilities to an object dynamically, a flexible alternative to subclassing for extending behavior.",
    applicability:
      "You need to add/remove responsibilities at runtime without an exploding subclass hierarchy.",
    consequences:
      "Composable, runtime layering of behavior, but many small wrappers can be hard to debug and identity comparisons break.",
    example:
      "Wrapping a Stream with Buffered, then Encrypted, then Logging decorators.",
  },
  {
    name: "Facade",
    category: "Structural",
    intent:
      "Provide a unified higher-level interface to a set of interfaces in a subsystem, making it easier to use.",
    applicability:
      "A subsystem is complex and you want a simple entry point that shields clients from its internals.",
    consequences:
      "Lower coupling and a gentle learning curve, but the facade can become a god-object if it accretes logic.",
    example:
      "An OrderFacade.place() that hides inventory, payment and shipping subsystems.",
  },
  {
    name: "Proxy",
    category: "Structural",
    intent:
      "Provide a surrogate or placeholder for another object to control access to it.",
    applicability:
      "You need lazy loading (virtual), access control (protection), remoting, or caching in front of a real subject.",
    consequences:
      "Transparent cross-cutting control over the subject; introduces indirection and possible latency surprises.",
    example:
      "A virtual ImageProxy that loads the heavy bitmap only on first render.",
  },
  {
    name: "Observer",
    category: "Behavioral",
    intent:
      "Define a one-to-many dependency so that when one object changes state, all its dependents are notified automatically.",
    applicability:
      "A change to one object requires changing others and you don't know how many, or want loose coupling between them.",
    consequences:
      "Broadcast updates and open-ended subscribers, but update order is unspecified and cascades can be hard to trace.",
    example:
      "UI widgets re-rendering when a shared ViewModel emits a change event.",
  },
  {
    name: "Strategy",
    category: "Behavioral",
    intent:
      "Define a family of algorithms, encapsulate each one, and make them interchangeable at runtime.",
    applicability:
      "Many related classes differ only in behavior, or you need to switch an algorithm without conditionals.",
    consequences:
      "Eliminates big switch statements and enables runtime swapping; clients must understand the available strategies.",
    example:
      "A Sorter parameterized with QuickSort / MergeSort strategy objects.",
  },
  {
    name: "Command",
    category: "Behavioral",
    intent:
      "Encapsulate a request as an object, letting you parameterize, queue, log and undo operations.",
    applicability:
      "You need undo/redo, queuing, transactional or deferred execution of actions.",
    consequences:
      "Decouples invoker from receiver and enables undo/macros, but multiplies the number of small classes.",
    example:
      "Editor actions as Command objects pushed onto an undo stack.",
  },
  {
    name: "Template Method",
    category: "Behavioral",
    intent:
      "Define the skeleton of an algorithm in a method, deferring some steps to subclasses without changing the structure.",
    applicability:
      "Several algorithms share the same overall steps but differ in specific operations.",
    consequences:
      "Reuses the invariant skeleton and inverts control (don't call us, we'll call you); rigid inheritance coupling.",
    example:
      "A DataExporter.run() that fixes the order: open → write → close, leaving write() abstract.",
  },
  {
    name: "State",
    category: "Behavioral",
    intent:
      "Allow an object to alter its behavior when its internal state changes; it appears to change its class.",
    applicability:
      "An object's behavior depends on its state and is littered with large multi-branch conditionals on that state.",
    consequences:
      "Replaces conditionals with polymorphism and makes transitions explicit, at the cost of more state classes.",
    example:
      "A Document moving through Draft → Moderation → Published state objects.",
  },
  {
    name: "Iterator",
    category: "Behavioral",
    intent:
      "Provide a way to access elements of an aggregate sequentially without exposing its underlying representation.",
    applicability:
      "You want a uniform traversal interface, multiple simultaneous traversals, or to hide a collection's internals.",
    consequences:
      "Decouples traversal from storage and supports many cursors, but a separate iterator can lag the collection (concurrent modification).",
    example:
      "A TreeIterator exposing in-order traversal of a binary tree as a flat sequence.",
  },
  {
    name: "Chain of Responsibility",
    category: "Behavioral",
    intent:
      "Pass a request along a chain of handlers; each decides to handle it or forward it to the next.",
    applicability:
      "More than one object may handle a request and the handler isn't known a priori (filters, middleware, validators).",
    consequences:
      "Decouples sender from receiver and lets you reorder handlers, but a request may fall off the end unhandled.",
    example:
      "An HTTP middleware pipeline: auth → rate-limit → logging → route.",
  },
  {
    name: "Mediator",
    category: "Behavioral",
    intent:
      "Define an object that encapsulates how a set of objects interact, promoting loose coupling between them.",
    applicability:
      "A set of objects communicate in well-defined but complex ways and the many-to-many wiring is hard to maintain.",
    consequences:
      "Centralizes interaction and simplifies object protocols, but the mediator itself can become a complex hub.",
    example:
      "A form Dialog mediator coordinating field-enabled/disabled rules between widgets.",
  },
];

const CATEGORIES: Category[] = ["Creational", "Structural", "Behavioral"];

function catTone(c: Category): string {
  // Used only for inline style accents; raw §12 css vars.
  if (c === "Creational") return "var(--primary)";
  if (c === "Structural") return "var(--vault-tint)";
  return "var(--accent)";
}

function PatternCatalog() {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<Category | "All">("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return PATTERNS.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.intent.toLowerCase().includes(q) ||
        p.applicability.toLowerCase().includes(q) ||
        p.example.toLowerCase().includes(q)
      );
    });
  }, [query, cat]);

  const counts = useMemo(() => {
    const m: Record<string, number> = { All: PATTERNS.length };
    for (const c of CATEGORIES) m[c] = PATTERNS.filter((p) => p.category === c).length;
    return m;
  }, []);

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Gang of Four</span>
        <h3>Design pattern catalog</h3>
        <p>
          Search {PATTERNS.length} classic patterns by name, intent or category. Each card
          summarizes intent, when to apply it and the trade-offs you accept.
        </p>
      </div>

      <div className="vtool-stack">
        <Field label="Search">
          <TextInput
            placeholder="e.g. decouple, runtime algorithm, tree, undo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Field>

        <div className="vtool-row">
          <Chip active={cat === "All"} onClick={() => setCat("All")}>
            All · {counts.All}
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c} active={cat === c} onClick={() => setCat(c)}>
              {c} · {counts[c]}
            </Chip>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <Note>
          No patterns match “{query}”. Try a broader term (e.g. “create”, “behavior”,
          “structure”) or clear the filter.
        </Note>
      ) : (
        <div className="vtool-stack" style={{ marginTop: 16 }}>
          {results.map((p) => (
            <SubPanel key={p.name}>
              <div
                className="vtool-row"
                style={{ justifyContent: "space-between", alignItems: "baseline" }}
              >
                <strong
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 18,
                    color: "var(--ink-strong)",
                  }}
                >
                  {p.name}
                </strong>
                <span
                  className="badge"
                  style={{ color: catTone(p.category), borderColor: catTone(p.category) }}
                >
                  {p.category}
                </span>
              </div>
              <div className="vtool-readout" style={{ marginTop: 10 }}>
                <KvBlock k="Intent" v={p.intent} />
                <KvBlock k="Applicability" v={p.applicability} />
                <KvBlock k="Consequences" v={p.consequences} />
                <KvBlock k="Example" v={p.example} mono />
              </div>
            </SubPanel>
          ))}
        </div>
      )}
    </Panel>
  );
}

/** Fila key-value de ancho completo (valor debajo, alineado a la izquierda). */
function KvBlock({ k, v, mono }: { k: string; v: string; mono?: boolean }) {
  return (
    <div className="vtool-kv" style={{ display: "block", textAlign: "left" }}>
      <span className="k">{k}</span>
      <div
        className={mono ? "v vtool-mono" : "v"}
        style={{ textAlign: "left", fontWeight: 400 }}
      >
        {v}
      </div>
    </div>
  );
}

/* ════════════════════════════════ TOOL 2 ════════════════════════════════ */
/* Picker guiado: tipo de problema → patrón(es) candidato(s).                */

type ProblemKind = "create" | "compose" | "behavior" | "decouple";

interface Refinement {
  q: string;
  options: { label: string; patterns: string[]; why: string }[];
}

const PICKER: Record<
  ProblemKind,
  { title: string; blurb: string; refine: Refinement }
> = {
  create: {
    title: "Create objects",
    blurb: "You are deciding how instances come into existence.",
    refine: {
      q: "What best describes the creation problem?",
      options: [
        {
          label: "One configured object built step by step (many optional parts)",
          patterns: ["Builder"],
          why: "Builder assembles a complex object incrementally and yields an immutable, readable result.",
        },
        {
          label: "Subclasses must choose the concrete class to instantiate",
          patterns: ["Factory Method"],
          why: "Factory Method defers the new-decision to subclasses through an overridable hook.",
        },
        {
          label: "A whole family of matching products (theme/platform)",
          patterns: ["Abstract Factory"],
          why: "Abstract Factory guarantees that products created together stay compatible.",
        },
        {
          label: "Exactly one shared instance / clone an expensive exemplar",
          patterns: ["Singleton", "Prototype"],
          why: "Singleton enforces a single instance; Prototype clones a pre-built object to skip costly construction.",
        },
      ],
    },
  },
  compose: {
    title: "Compose structures",
    blurb: "You are wiring objects together into a larger structure.",
    refine: {
      q: "What is the structural goal?",
      options: [
        {
          label: "Make an incompatible/legacy interface fit my code",
          patterns: ["Adapter"],
          why: "Adapter translates a foreign interface into the one your clients expect.",
        },
        {
          label: "Treat single items and groups the same (tree/part–whole)",
          patterns: ["Composite"],
          why: "Composite lets leaves and containers share one recursive interface.",
        },
        {
          label: "Add responsibilities at runtime without subclassing",
          patterns: ["Decorator"],
          why: "Decorator layers behavior by wrapping, keeping the core class untouched.",
        },
        {
          label: "Simplify a complex subsystem / control access to an object",
          patterns: ["Facade", "Proxy"],
          why: "Facade gives a simple entry point; Proxy interposes lazy-loading, caching or access control.",
        },
      ],
    },
  },
  behavior: {
    title: "Vary behavior / algorithms",
    blurb: "You want to change what an object does, cleanly.",
    refine: {
      q: "How does the behavior need to vary?",
      options: [
        {
          label: "Swap interchangeable algorithms at runtime",
          patterns: ["Strategy"],
          why: "Strategy encapsulates each algorithm so it can be selected without conditionals.",
        },
        {
          label: "Behavior depends on internal state (lots of if/switch)",
          patterns: ["State"],
          why: "State replaces state conditionals with polymorphic objects and explicit transitions.",
        },
        {
          label: "Same skeleton, a few steps differ per variant",
          patterns: ["Template Method"],
          why: "Template Method fixes the algorithm outline and leaves specific steps abstract.",
        },
        {
          label: "Encapsulate an action to queue, log or undo it",
          patterns: ["Command"],
          why: "Command turns a request into an object you can store, replay and undo.",
        },
      ],
    },
  },
  decouple: {
    title: "Decouple / communicate",
    blurb: "You need objects to talk without hard wiring.",
    refine: {
      q: "What is the communication shape?",
      options: [
        {
          label: "One change must notify many dependents",
          patterns: ["Observer"],
          why: "Observer broadcasts state changes to any number of subscribers, loosely coupled.",
        },
        {
          label: "Many objects interact in complex many-to-many ways",
          patterns: ["Mediator"],
          why: "Mediator centralizes the interaction so peers don't reference each other directly.",
        },
        {
          label: "A request should flow through ordered handlers",
          patterns: ["Chain of Responsibility"],
          why: "Chain of Responsibility forwards a request until some handler consumes it.",
        },
        {
          label: "Traverse a collection without exposing its internals",
          patterns: ["Iterator"],
          why: "Iterator offers uniform sequential access and supports multiple cursors.",
        },
      ],
    },
  },
};

function patternByName(name: string): Pattern | undefined {
  return PATTERNS.find((p) => p.name === name);
}

function WhichPattern() {
  const [kind, setKind] = useState<ProblemKind | "">("");
  const [optionIdx, setOptionIdx] = useState<number | null>(null);

  const stage = kind ? PICKER[kind] : null;
  const chosen = stage && optionIdx != null ? stage.refine.options[optionIdx] : null;

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Guided picker</span>
        <h3>Which pattern?</h3>
        <p>
          Answer two questions about your problem and get one to three candidate patterns,
          each with a one-line rationale that links back to the catalog.
        </p>
      </div>

      <div className="vtool-stack">
        <div className="vtool-field">
          <label className="vtool-label">
            <b>Step 1 — What kind of problem are you solving?</b>
          </label>
          <div className="vtool-row">
            {(Object.keys(PICKER) as ProblemKind[]).map((k) => (
              <Chip
                key={k}
                active={kind === k}
                onClick={() => {
                  setKind(k);
                  setOptionIdx(null);
                }}
              >
                {PICKER[k].title}
              </Chip>
            ))}
          </div>
          {stage && <Note>{stage.blurb}</Note>}
        </div>

        {stage && (
          <Field label={`Step 2 — ${stage.refine.q}`}>
            <Select
              value={optionIdx ?? ""}
              onChange={(e) =>
                setOptionIdx(e.target.value === "" ? null : Number(e.target.value))
              }
            >
              <option value="">Select one…</option>
              {stage.refine.options.map((o, i) => (
                <option key={i} value={i}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        )}
      </div>

      {!kind && (
        <Note style={{ marginTop: 14 }}>Pick a problem category above to begin.</Note>
      )}

      {chosen && (
        <div className="vtool-stack" style={{ marginTop: 16 }}>
          <span className="vtool-eyebrow">
            Recommended {chosen.patterns.length > 1 ? "patterns" : "pattern"}
          </span>
          <Note style={{ marginTop: 0 }}>{chosen.why}</Note>
          {chosen.patterns.map((name) => {
            const p = patternByName(name);
            return (
              <SubPanel key={name}>
                <div
                  className="vtool-row"
                  style={{ justifyContent: "space-between", alignItems: "baseline" }}
                >
                  <strong
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: 17,
                      color: "var(--ink-strong)",
                    }}
                  >
                    {name}
                  </strong>
                  {p && (
                    <span
                      className="badge"
                      style={{
                        color: catTone(p.category),
                        borderColor: catTone(p.category),
                      }}
                    >
                      {p.category}
                    </span>
                  )}
                </div>
                {p && (
                  <p
                    className="v"
                    style={{ textAlign: "left", fontWeight: 400, margin: "8px 0 0" }}
                  >
                    {p.intent}
                  </p>
                )}
              </SubPanel>
            );
          })}
        </div>
      )}
    </Panel>
  );
}

/* ════════════════════════════════ TOOL 3 ════════════════════════════════ */
/* Constructor de escenarios de atributos de calidad (6 partes, presets).    */

interface QaPart {
  source: string;
  stimulus: string;
  artifact: string;
  environment: string;
  response: string;
  measure: string;
}

interface QaPreset {
  id: string;
  attr: string;
  blurb: string;
  part: QaPart;
}

const QA_PRESETS: QaPreset[] = [
  {
    id: "availability",
    attr: "Availability",
    blurb: "Proporción de tiempo operativo ante caídas de componentes.",
    part: {
      source: "Un nodo del backend",
      stimulus: "deja de responder (crash o partición de red)",
      artifact: "el clúster de aplicación detrás del load balancer",
      environment: "operación normal, en hora pico",
      response:
        "el LB detecta la caída por health-check y redirige el tráfico a un nodo sano; el incidente se registra y se alerta",
      measure: "failover < 5 s, 0 requests perdidos, disponibilidad ≥ 99,9 %",
    },
  },
  {
    id: "performance",
    attr: "Performance",
    blurb: "Responsividad — latencia y throughput bajo carga.",
    part: {
      source: "Usuarios concurrentes",
      stimulus: "envían 5.000 requests/segundo de consulta",
      artifact: "la API de lectura",
      environment: "carga pico sostenida",
      response: "el sistema procesa las consultas y responde",
      measure: "p95 de latencia < 200 ms y throughput ≥ 5.000 rps sin degradación",
    },
  },
  {
    id: "security",
    attr: "Security",
    blurb: "Prevenir acceso/uso indebido; threshold defense.",
    part: {
      source: "Un atacante externo",
      stimulus:
        "intenta inyectar SQL en el checkout usando credenciales robadas",
      artifact: "el backend y la base de datos",
      environment: "operación normal, sistema expuesto a internet",
      response:
        "el WAF bloquea el patrón, la sanitización rechaza el input, el MFA frena el login y el evento queda auditado",
      measure:
        "0 datos expuestos, ataque alertado en < 1 min, blast radius acotado al servicio comprometido",
    },
  },
  {
    id: "scalability",
    attr: "Scalability",
    blurb: "Absorber incrementos de carga sin impacto.",
    part: {
      source: "Un evento comercial (Hot Sale)",
      stimulus: "multiplica el tráfico por 50 en minutos",
      artifact: "la capa de aplicación y las réplicas de lectura",
      environment: "pico estacional anunciado",
      response:
        "el autoscaling horizontal agrega instancias y las réplicas absorben los reads",
      measure: "latencia dentro del SLO, escalado en < 3 min, costo proporcional a la carga",
    },
  },
  {
    id: "modifiability",
    attr: "Modifiability",
    blurb: "Costo de un cambio acotado y localizado.",
    part: {
      source: "El equipo de desarrollo",
      stimulus: "debe incorporar un nuevo procesador de pago",
      artifact: "el módulo de pagos",
      environment: "tiempo de diseño / desarrollo",
      response: "implementa un adapter contra una interfaz común sin tocar el core",
      measure: "cambio en ≤ 1 sprint, 0 archivos del core modificados, sin regresiones",
    },
  },
  {
    id: "interoperability",
    attr: "Interoperability",
    blurb: "Intercambiar información con sistemas externos.",
    part: {
      source: "Un sistema externo (proveedor de logística)",
      stimulus: "solicita el estado de un envío con su propio protocolo",
      artifact: "la capa de integración / anti-corruption layer",
      environment: "operación normal",
      response: "el adapter traduce el pedido al modelo interno y responde en el formato esperado",
      measure: "intercambio correcto en ≥ 99 % de los mensajes, integración en ≤ 2 semanas",
    },
  },
  {
    id: "usability",
    attr: "Usability",
    blurb: "Qué tan bien la UI cumple la tarea del usuario.",
    part: {
      source: "Un usuario nuevo",
      stimulus: "intenta completar su primera compra",
      artifact: "el flujo de checkout de la SPA",
      environment: "primer uso, sin entrenamiento",
      response: "la interfaz guía el flujo y previene errores",
      measure: "task success ≥ 90 %, tiempo a completar < 2 min, SUS ≥ 80",
    },
  },
];

const QA_FIELDS: { key: keyof QaPart; label: string; long?: boolean }[] = [
  { key: "source", label: "Fuente del estímulo" },
  { key: "stimulus", label: "Estímulo" },
  { key: "artifact", label: "Artefacto" },
  { key: "environment", label: "Entorno" },
  { key: "response", label: "Respuesta", long: true },
  { key: "measure", label: "Medida de respuesta", long: true },
];

const QA_EMPTY: QaPart = {
  source: "",
  stimulus: "",
  artifact: "",
  environment: "",
  response: "",
  measure: "",
};

function assembleScenario(p: QaPart): string {
  const src = p.source.trim() || "[fuente]";
  const sti = p.stimulus.trim() || "[estímulo]";
  const art = p.artifact.trim() || "[artefacto]";
  const env = p.environment.trim() || "[entorno]";
  const res = p.response.trim() || "[respuesta]";
  const mea = p.measure.trim() || "[medida]";
  return `Cuando ${src} ${sti} sobre ${art}, en ${env}, el sistema responde: ${res}. Medida: ${mea}.`;
}

function QualityAttributeScenarios() {
  const [active, setActive] = useState<string>(QA_PRESETS[0].id);
  const [part, setPart] = useState<QaPart>(QA_PRESETS[0].part);

  const loadPreset = (id: string) => {
    const preset = QA_PRESETS.find((p) => p.id === id);
    if (!preset) return;
    setActive(id);
    setPart(preset.part);
  };

  const activePreset = QA_PRESETS.find((p) => p.id === active);
  const scenario = assembleScenario(part);

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">ADD · ATAM</span>
        <h3>Escenarios de atributos de calidad</h3>
        <p>
          Un atributo sin escenario cuantificable es una aspiración, no un requisito. Armá
          el escenario canónico en 6 partes (Bass, Clements &amp; Kazman): elegí un atributo
          como punto de partida y editá los campos.
        </p>
      </div>

      <div className="vtool-row" style={{ marginBottom: 18 }}>
        {QA_PRESETS.map((p) => (
          <Chip key={p.id} active={active === p.id} onClick={() => loadPreset(p.id)}>
            {p.attr}
          </Chip>
        ))}
        <Chip
          active={false}
          onClick={() => {
            setActive("");
            setPart(QA_EMPTY);
          }}
        >
          En blanco
        </Chip>
      </div>

      {activePreset && <Note style={{ marginTop: 0 }}>{activePreset.blurb}</Note>}

      <div className="vtool-grid" style={{ marginTop: 16 }}>
        <div className="vtool-stack">
          {QA_FIELDS.map((f) => (
            <Field key={f.key} label={f.label}>
              {f.long ? (
                <TextArea
                  value={part[f.key]}
                  onChange={(e) => setPart((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              ) : (
                <TextInput
                  value={part[f.key]}
                  onChange={(e) => setPart((prev) => ({ ...prev, [f.key]: e.target.value }))}
                />
              )}
            </Field>
          ))}
        </div>

        <div className="vtool-stack">
          <SubPanel>
            <div
              className="vtool-row"
              style={{ justifyContent: "space-between", alignItems: "baseline" }}
            >
              <span className="vtool-eyebrow">Escenario ensamblado</span>
              <CopyButton text={scenario} label="copiar" copiedLabel="copiado" />
            </div>
            <p
              style={{
                margin: "10px 0 0",
                fontSize: 15,
                lineHeight: 1.6,
                color: "var(--ink-strong)",
              }}
            >
              {scenario}
            </p>
          </SubPanel>

          <SubPanel>
            <span className="vtool-eyebrow">Las 6 partes</span>
            <Readout
              items={[
                { k: "Fuente", v: part.source || "—" },
                { k: "Estímulo", v: part.stimulus || "—" },
                { k: "Artefacto", v: part.artifact || "—" },
                { k: "Entorno", v: part.environment || "—" },
                { k: "Respuesta", v: part.response || "—", tone: "accent" },
                { k: "Medida", v: part.measure || "—", tone: "coral" },
              ]}
            />
          </SubPanel>

          <Note style={{ marginTop: 0 }}>
            La respuesta tiene que ser observable y la medida, cuantificable: sin métrica no
            hay forma de validar el escenario en un ATAM.
          </Note>
        </div>
      </div>
    </Panel>
  );
}

/* ════════════════════════════════ TOOL 4 ════════════════════════════════ */
/* Walkthrough paso a paso de ADD — Caso Compraventa de Acciones.            */

interface AddStep {
  key: string;
  label: string;
  title: string;
  node: ReactNode;
}

const SEC_MECHANISMS = [
  {
    scenario: "Ataque DDoS / payloads maliciosos",
    mechanism: "WAF (firewall de capa 7)",
    location: "Antes del LB, justo después del cloud",
  },
  {
    scenario: "Atacante obtiene credenciales de un usuario",
    mechanism: "MFA (segundo factor)",
    location: "En el flujo de login del usuario",
  },
  {
    scenario: "Inyección (SQLi / XSS / …)",
    mechanism: "Sanitización de inputs",
    location: "En el Back, en cada endpoint con input externo",
  },
  {
    scenario: "Leak físico del storage",
    mechanism: "Encriptación at-rest",
    location: "A nivel del motor SQL",
  },
  {
    scenario: "Sniffing de tráfico / credenciales",
    mechanism: "HTTPS end-to-end + reverse proxy (Nginx)",
    location: "Cliente ↔ LB ↔ Back",
  },
  {
    scenario: "Acceso de Ops debe estar segregado",
    mechanism: "Infraestructura separada + VPN",
    location: "Clúster Ops aislado con su propio Back + BD",
  },
];

const ADD_DECISIONS = [
  {
    decision: "Atributo #1",
    options: "Performance / Security / Availability",
    choice: "Security",
    why: "Naturaleza financiera de los datos.",
  },
  {
    decision: "Persistencia",
    options: "SQL OLTP / NoSQL / In-memory",
    choice: "SQL OLTP",
    why: "Integridad transaccional y auditabilidad por sobre todo.",
  },
  {
    decision: "Topología de Ops",
    options: "Mismo clúster con auth / clúster separado vía VPN",
    choice: "Clúster separado",
    why: "Reducir blast radius — una vulnerabilidad pública no llega a Ops.",
  },
  {
    decision: "Protección de borde",
    options: "Sólo LB / WAF + LB",
    choice: "WAF + LB",
    why: "DDoS y payloads maliciosos requieren capa 7.",
  },
  {
    decision: "Auth de usuario",
    options: "Password / Password + MFA",
    choice: "Password + MFA",
    why: "Robar credenciales no debe alcanzar para entrar.",
  },
  {
    decision: "Comunicación con Cotización",
    options: "Polling / WebSocket",
    choice: "WebSocket",
    why: "Las cotizaciones son un stream continuo.",
  },
];

const ADD_STEPS: AddStep[] = [
  {
    key: "dominio",
    label: "Dominio",
    title: "Paso 0 — Dominio y stakeholders",
    node: (
      <>
        <p>
          Mercado electrónico de <strong>compraventa de acciones</strong>: cotización en
          tiempo real, ingreso de órdenes, matching, confirmación y settlement. Operación
          regulada, con requisitos de auditabilidad y trazabilidad.
        </p>
        <SubPanel style={{ marginTop: 14 }}>
          <span className="vtool-eyebrow">Stakeholders y sistemas externos</span>
          <Readout
            items={[
              { k: "Usuarios (traders)", v: "operan, consultan cotizaciones, ven cartera" },
              { k: "Operations (Ops)", v: "gestionan el sistema desde una consola interna" },
              { k: "BC1 — Cotización", v: "provee precios en tiempo real" },
              { k: "BC2 — Ops", v: "sistema externo conectado vía VPN" },
              { k: "SMTP", v: "notificaciones a usuarios" },
              { k: "Reguladores", v: "implícitos — lo exige la naturaleza financiera" },
            ]}
          />
        </SubPanel>
      </>
    ),
  },
  {
    key: "atributos",
    label: "Atributos",
    title: "Paso 1 — Atributos candidatos y ranking",
    node: (
      <>
        <p>
          De la lista candidata (Performance, Security, Interoperability, Scalability,
          Availability, Usability, Precision) se eligen <strong>hasta 4 drivers</strong>. El
          ranking acordado:
        </p>
        <div className="vtool-row" style={{ margin: "12px 0" }}>
          <Badge variant="solid">1 · Security</Badge>
          <Badge variant="status">2 · Availability</Badge>
          <Badge variant="status">3 · Performance</Badge>
          <Badge variant="status">4 · Scalability</Badge>
        </div>
        <Note style={{ marginTop: 0 }}>
          Por qué Security va primero: «lo más importante que tiene una empresa es la
          información de sus usuarios». La importancia se determina por la naturaleza de los
          datos. El objetivo no es la defensa absoluta sino la <strong>threshold defense</strong>:
          subir el costo del ataque hasta que el adversario racional elija otro target.
        </Note>
        <p style={{ marginTop: 12 }}>
          El resto de los atributos no se ignora: pasa a la lista de{" "}
          <strong>riesgos asumidos</strong>, que se documentan pero no guían la arquitectura.
        </p>
      </>
    ),
  },
  {
    key: "iter1",
    label: "Iteración 1",
    title: "Iteración 1 — Estructura base (sistemas externos)",
    node: (
      <>
        <p>
          Identificar los <strong>componentes funcionales</strong> y los sistemas externos,
          sin pensar todavía en atributos no funcionales. La regla: la primera versión incluye
          TODOS los sistemas sobre los que el equipo no tiene control, más el mínimo de
          componentes internos para cumplir los requerimientos funcionales.
        </p>
        <pre className="vtool-code" style={{ marginTop: 12 }}>{`Actores: User, Ops
Frontend: SPA1 (cotización/compra), SPA2 (ops)
Edge: LB
Backend: Back
Persistencia: SQL OLTP
Sistemas externos:
  • BC1 (Cotización)   → Back
  • BC2 (Ops, vía VPN) → Back
  • SMTP               → Back`}</pre>
        <Note style={{ marginTop: 12 }}>
          SPA1 es el frontend de cotización/compraventa; SPA2 el frontend interno de Ops; el
          LB ya aparece como punto de entrada centralizado; el Back orquesta el dominio; SQL
          OLTP es el default para datos financieros con integridad fuerte.
        </Note>
      </>
    ),
  },
  {
    key: "iter2",
    label: "Iteración 2",
    title: "Iteración 2 — Escenarios de Security (atributo #1)",
    node: (
      <>
        <p>
          Por cada escenario de amenaza se agrega el mecanismo correspondiente del catálogo de
          seguridad, ubicándolo en un punto concreto del flujo:
        </p>
        <div style={{ marginTop: 12, overflowX: "auto" }}>
          <DataTable
            columns={[
              { key: "scenario", header: "Escenario" },
              { key: "mechanism", header: "Mecanismo" },
              { key: "location", header: "Ubicación" },
            ]}
            rows={SEC_MECHANISMS.map((m, i) => ({ id: i, ...m }))}
          />
        </div>
        <Note style={{ marginTop: 12 }}>
          Cambio estructural mayor: Ops se mueve a su <strong>propia infraestructura</strong>{" "}
          (su Back, su BD), accedida sólo por VPN. Reduce drásticamente el{" "}
          <strong>blast radius</strong>: un compromiso del SPA público no llega al sistema de
          Ops. Esto es defense in depth — cada capa atrapa una clase de ataque.
        </Note>
      </>
    ),
  },
  {
    key: "iter3",
    label: "Iteración 3",
    title: "Iteración 3 — Escenarios de Availability (atributo #2)",
    node: (
      <>
        <p>Se analiza el patrón de comunicación según el caso de uso:</p>
        <SubPanel style={{ marginTop: 12 }}>
          <Readout
            items={[
              {
                k: "BC1 (Cotización) ↔ Back",
                v: "WebSocket — stream continuo de precios; abrir un request HTTP por update sería ruidoso",
                tone: "accent",
              },
              {
                k: "Usuario → Back (venta)",
                v: "Request-Response — operación discreta que exige confirmación inmediata",
              },
            ]}
          />
        </SubPanel>
        <Note style={{ marginTop: 12 }}>
          Las decisiones de HA (replicación primario/secundario, failover, hot standby) se
          validan revalidando los escenarios de las iteraciones anteriores: no deben romper lo
          ya resuelto para Security. Ver la calculadora de disponibilidad y el clasificador CAP
          de este toolkit.
        </Note>
      </>
    ),
  },
  {
    key: "decisiones",
    label: "Decisiones",
    title: "Decisiones arquitectónicas explícitas",
    node: (
      <div style={{ overflowX: "auto" }}>
        <DataTable
          columns={[
            { key: "decision", header: "Decisión" },
            { key: "options", header: "Opciones" },
            { key: "choice", header: "Elección" },
            { key: "why", header: "Justificación" },
          ]}
          rows={ADD_DECISIONS.map((d, i) => ({
            id: i,
            decision: d.decision,
            options: d.options,
            choice: <strong style={{ color: "var(--ink-strong)" }}>{d.choice}</strong>,
            why: d.why,
          }))}
        />
      </div>
    ),
  },
  {
    key: "tradeoffs",
    label: "Trade-offs",
    title: "Trade-offs identificados",
    node: (
      <>
        <Readout
          items={[
            {
              k: "Security ↔ Usability",
              v: "MFA agrega fricción; aceptable porque quien opera con dinero la tolera",
            },
            {
              k: "Security ↔ Performance",
              v: "el WAF agrega 1–10 ms; despreciable frente a la latencia de matching",
            },
            {
              k: "Maintainability ↔ Blast radius",
              v: "dos clústeres duplican operación pero acotan la superficie de ataque",
            },
            {
              k: "Availability ↔ Consistency",
              v: "mercado financiero es CP: rechazar es preferible a inconsistencia",
              tone: "coral",
            },
          ]}
        />
        <Note style={{ marginTop: 14 }}>
          Patrón general del método: «primero concentrarse en el problema principal y después
          atacar los accesorios». Cada iteración agrega los mecanismos de un atributo del
          ranking y revalida los escenarios anteriores.
        </Note>
      </>
    ),
  },
];

function AddWalkthrough() {
  const [idx, setIdx] = useState(0);
  const step = ADD_STEPS[idx];
  const atFirst = idx === 0;
  const atLast = idx === ADD_STEPS.length - 1;

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Ejercicio resuelto · ADD</span>
        <h3>Walkthrough — Compraventa de Acciones</h3>
        <p>
          Resolución paso a paso de un parcial tipo aplicando Attribute Driven Design: un
          mercado financiero CP-extremo con Security como atributo dominante. Recorré las
          iteraciones del método.
        </p>
      </div>

      <div className="vtool-row" style={{ marginBottom: 16 }}>
        {ADD_STEPS.map((s, i) => (
          <Chip key={s.key} active={i === idx} onClick={() => setIdx(i)}>
            {s.label}
          </Chip>
        ))}
      </div>

      <SubPanel>
        <div
          className="vtool-row"
          style={{ justifyContent: "space-between", alignItems: "baseline" }}
        >
          <strong
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 18,
              color: "var(--ink-strong)",
            }}
          >
            {step.title}
          </strong>
          <span className="vtool-mono">
            {idx + 1} / {ADD_STEPS.length}
          </span>
        </div>
        <div style={{ marginTop: 12, fontSize: 14, lineHeight: 1.6 }}>{step.node}</div>
      </SubPanel>

      <div className="vtool-row" style={{ marginTop: 16, justifyContent: "space-between" }}>
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          disabled={atFirst}
          onClick={() => setIdx((i) => Math.max(0, i - 1))}
        >
          ← Anterior
        </button>
        <button
          type="button"
          className="btn btn--sm btn--ghost"
          disabled={atLast}
          onClick={() => setIdx((i) => Math.min(ADD_STEPS.length - 1, i + 1))}
        >
          Siguiente →
        </button>
      </div>
    </Panel>
  );
}

/* ════════════════════════════════ TOOL 5 ════════════════════════════════ */
/* Clasificador CAP / PACELC.                                                */

interface CapCase {
  caso: string;
  posicion: string;
  why: string;
}

const CAP_CASES: CapCase[] = [
  {
    caso: "Banca / transacciones financieras",
    posicion: "CP",
    why: "La consistencia es no-negociable: mejor rechazar que aceptar saldos divergentes.",
  },
  {
    caso: "Carrito de e-commerce",
    posicion: "AP",
    why: "Amazon eligió «siempre permitir agregar al carrito»; reconcilia después.",
  },
  {
    caso: "Feed de red social / timelines",
    posicion: "AP",
    why: "Un seguidor menos durante 30 s no importa; un 503 sí.",
  },
  {
    caso: "Coordinación (locks, leader election)",
    posicion: "CP",
    why: "La consistencia ES la razón de existir del componente (Zookeeper, etcd).",
  },
  {
    caso: "Catálogo de productos read-heavy",
    posicion: "AP",
    why: "Réplicas eventuales; lecturas masivas toleran datos algo viejos.",
  },
];

function CapClassifier() {
  const [partition, setPartition] = useState<"" | "C" | "A">("");
  const [normal, setNormal] = useState<"" | "L" | "C">("");

  const cap = partition === "C" ? "CP" : partition === "A" ? "AP" : "";
  const pacelc =
    partition && normal
      ? `P${partition === "C" ? "C" : "A"}/E${normal}`
      : "";

  const examples =
    cap === "CP"
      ? "HBase, MongoDB (majority writes), etcd, Zookeeper, Spanner (PC/EC)"
      : cap === "AP"
        ? "Cassandra (PA/EL), DynamoDB, CouchDB, Riak"
        : "";

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Persistencia distribuida</span>
        <h3>Clasificador CAP / PACELC</h3>
        <p>
          P no es opcional: toda red real particiona. La elección real es C vs A{" "}
          <em>durante</em> una partición. PACELC agrega: y si no hay partición (else),
          ¿latencia o consistencia?
        </p>
      </div>

      <div className="vtool-stack">
        <div className="vtool-field">
          <label className="vtool-label">
            <b>Durante una partición, ¿qué es peor para tu dominio?</b>
          </label>
          <div className="vtool-row">
            <Chip active={partition === "C"} onClick={() => setPartition("C")}>
              Servir datos divergentes (priorizo Consistencia)
            </Chip>
            <Chip active={partition === "A"} onClick={() => setPartition("A")}>
              Rechazar operaciones (priorizo Disponibilidad)
            </Chip>
          </div>
        </div>

        <div className="vtool-field">
          <label className="vtool-label">
            <b>En operación normal (sin partición), ¿qué priorizás?</b>
          </label>
          <div className="vtool-row">
            <Chip active={normal === "L"} onClick={() => setNormal("L")}>
              Latencia mínima
            </Chip>
            <Chip active={normal === "C"} onClick={() => setNormal("C")}>
              Consistencia fuerte
            </Chip>
          </div>
        </div>
      </div>

      {cap ? (
        <SubPanel style={{ marginTop: 16 }}>
          <div className="vtool-row" style={{ gap: 18, alignItems: "baseline" }}>
            <BigNum value={cap} unit="CAP" />
            {pacelc && <BigNum value={pacelc} unit="PACELC" />}
          </div>
          <Readout
            style={{ marginTop: 12 }}
            items={[
              {
                k: "Comportamiento",
                v:
                  cap === "CP"
                    ? "ante partición, el lado minoritario rechaza operaciones para no divergir"
                    : "ante partición, todos los nodos siguen aceptando; se reconcilian conflictos al reunificar",
              },
              ...(examples ? [{ k: "Motores típicos", v: examples, tone: "accent" as const }] : []),
            ]}
          />
        </SubPanel>
      ) : (
        <Note style={{ marginTop: 14 }}>
          Respondé la primera pregunta para obtener la posición CP/AP.
        </Note>
      )}

      <div style={{ marginTop: 18, overflowX: "auto" }}>
        <span className="vtool-eyebrow">Decisiones canónicas</span>
        <DataTable
          className="vtool-table"
          columns={[
            { key: "caso", header: "Caso" },
            { key: "posicion", header: "Posición" },
            { key: "why", header: "Por qué" },
          ]}
          rows={CAP_CASES.map((c, i) => ({
            id: i,
            caso: c.caso,
            posicion: <Badge variant={c.posicion === "CP" ? "solid" : "status"}>{c.posicion}</Badge>,
            why: c.why,
          }))}
        />
      </div>
    </Panel>
  );
}

/* ════════════════════════════════ TOOL 6 ════════════════════════════════ */
/* Calculadora de disponibilidad (MTBF/MTTR + redundancia).                  */

function nines(a: number): number {
  // cuenta de nueves de una disponibilidad en [0,1): 0.999 → 3
  if (a >= 1) return Infinity;
  if (a <= 0) return 0;
  return -Math.log10(1 - a);
}

function fmtDowntime(unavailFraction: number, totalMinutes: number): string {
  const mins = unavailFraction * totalMinutes;
  if (mins >= 1440) return `${(mins / 1440).toFixed(1)} d`;
  if (mins >= 60) return `${(mins / 60).toFixed(1)} h`;
  if (mins >= 1) return `${mins.toFixed(1)} min`;
  return `${(mins * 60).toFixed(1)} s`;
}

const YEAR_MIN = 365 * 24 * 60;
const MONTH_MIN = 30 * 24 * 60;

const NINES_REF = [
  { pct: "90 %", year: "36,5 d" },
  { pct: "99 %", year: "3,65 d" },
  { pct: "99,9 %", year: "8,76 h" },
  { pct: "99,99 %", year: "52,6 min" },
  { pct: "99,999 %", year: "5,26 min" },
];

function AvailabilityCalculator() {
  const [mtbf, setMtbf] = useState(1000); // horas
  const [mttr, setMttr] = useState(1); // horas
  const [topo, setTopo] = useState<"parallel" | "series">("parallel");
  const [n, setN] = useState(2);

  const a = mtbf / (mtbf + mttr);
  const composite =
    topo === "parallel" ? 1 - Math.pow(1 - a, n) : Math.pow(a, n);

  const aPct = (a * 100).toFixed(4);
  const compPct = (composite * 100).toFixed(5);

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Reliability</span>
        <h3>Calculadora de disponibilidad</h3>
        <p>
          Availability = MTBF / (MTBF + MTTR). Subir MTBF es caro (ingeniería de reliability);
          bajar MTTR es más barato (observabilidad, failover, rollback). Probá ambas palancas.
        </p>
      </div>

      <div className="vtool-grid vtool-grid--ctrl">
        <div className="vtool-stack">
          <Field label="MTBF — tiempo medio entre fallas" hint={`${mtbf} h`}>
            <Slider
              min={1}
              max={5000}
              step={1}
              value={mtbf}
              onChange={(e) => setMtbf(Number(e.target.value))}
            />
          </Field>
          <Field label="MTTR — tiempo medio de recuperación" hint={`${mttr} h`}>
            <Slider
              min={0.05}
              max={48}
              step={0.05}
              value={mttr}
              onChange={(e) => setMttr(Number(e.target.value))}
            />
          </Field>

          <div className="vtool-field">
            <label className="vtool-label">
              <b>Redundancia</b>
            </label>
            <div className="vtool-row">
              <Chip active={topo === "parallel"} onClick={() => setTopo("parallel")}>
                Paralelo (1-de-N)
              </Chip>
              <Chip active={topo === "series"} onClick={() => setTopo("series")}>
                Serie (N deben andar)
              </Chip>
            </div>
          </div>
          <Field label="N — componentes" hint={`${n}`}>
            <Slider
              min={1}
              max={6}
              step={1}
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
            />
          </Field>
        </div>

        <div className="vtool-stack">
          <SubPanel>
            <span className="vtool-eyebrow">Componente único</span>
            <div style={{ marginTop: 8 }}>
              <BigNum value={`${aPct}%`} unit={`${nines(a).toFixed(1)} nueves`} />
            </div>
            <Readout
              style={{ marginTop: 12 }}
              items={[
                { k: "Downtime / año", v: fmtDowntime(1 - a, YEAR_MIN), tone: "coral" },
                { k: "Downtime / mes", v: fmtDowntime(1 - a, MONTH_MIN) },
              ]}
            />
          </SubPanel>

          <SubPanel>
            <span className="vtool-eyebrow">
              {n} en {topo === "parallel" ? "paralelo" : "serie"}
            </span>
            <div style={{ marginTop: 8 }}>
              <BigNum
                value={`${compPct}%`}
                unit={
                  Number.isFinite(nines(composite))
                    ? `${nines(composite).toFixed(1)} nueves`
                    : "≈ total"
                }
              />
            </div>
            <Readout
              style={{ marginTop: 12 }}
              items={[
                {
                  k: "Downtime / año",
                  v: fmtDowntime(1 - composite, YEAR_MIN),
                  tone: topo === "parallel" ? "accent" : "coral",
                },
              ]}
            />
            <Note style={{ marginTop: 10 }}>
              {topo === "parallel"
                ? "A = 1 − (1 − a)ⁿ — la redundancia activa-activa multiplica los nueves."
                : "A = aⁿ — encadenar dependencias degrada la disponibilidad total."}
            </Note>
          </SubPanel>
        </div>
      </div>

      <div style={{ marginTop: 18 }}>
        <span className="vtool-eyebrow">Referencia: nueves → downtime/año</span>
        <DataTable
          columns={[
            { key: "pct", header: "Disponibilidad" },
            { key: "year", header: "Downtime / año", align: "right" },
          ]}
          rows={NINES_REF.map((r, i) => ({ id: i, ...r }))}
        />
      </div>
    </Panel>
  );
}

/* ════════════════════════════════ TOOL 7 ════════════════════════════════ */
/* Catálogo de estilos arquitectónicos.                                      */

type StyleFamily =
  | "Dataflow"
  | "Distributed"
  | "Interactive"
  | "Event-based"
  | "Compuesto";

interface Style {
  name: string;
  family: StyleFamily;
  idea: string;
  example: string;
}

const STYLES: Style[] = [
  {
    name: "Batch Sequential",
    family: "Dataflow",
    idea: "Cada etapa procesa el dataset completo y lo pasa a la siguiente.",
    example: "ETL nocturnos, procesamiento mainframe.",
  },
  {
    name: "Pipes and Filters",
    family: "Dataflow",
    idea: "Filtros conectados por pipes; cada uno lee, transforma, escribe. Composable.",
    example: "Unix pipes, Apache NiFi.",
  },
  {
    name: "Hierarchical Layers",
    family: "Dataflow",
    idea: "Capas ordenadas; cada una usa sólo la inmediata inferior.",
    example: "OSI networking, app 4-tier (presentación, lógica, datos).",
  },
  {
    name: "Broker",
    family: "Distributed",
    idea: "Un intermediario coordina la comunicación entre clientes y servidores.",
    example: "CORBA, message brokers (RabbitMQ, Kafka).",
  },
  {
    name: "Publish-Subscribe",
    family: "Distributed",
    idea: "Emisores publican eventos; receptores se suscriben por tópico. Desacopla en el tiempo.",
    example: "Kafka, Redis Pub/Sub, MQTT.",
  },
  {
    name: "Forwarder-Receiver",
    family: "Distributed",
    idea: "Intermediarios que encapsulan los detalles de la comunicación de red.",
    example: "Capas de transporte sobre sockets.",
  },
  {
    name: "Client-Dispatcher-Server",
    family: "Distributed",
    idea: "El dispatcher resuelve qué server atiende a qué cliente.",
    example: "Precursor del service discovery moderno.",
  },
  {
    name: "MVC — Model View Controller",
    family: "Interactive",
    idea: "Modelo (datos), Vista (UI), Controlador (lógica de entrada).",
    example: "Frameworks web clásicos (Rails, Spring MVC).",
  },
  {
    name: "MVP — Model View Presenter",
    family: "Interactive",
    idea: "El Presenter maneja la lógica; la Vista es pasiva. Facilita testing.",
    example: "Apps Android clásicas.",
  },
  {
    name: "MVVM — Model View ViewModel",
    family: "Interactive",
    idea: "El ViewModel expone estado databindeable a la Vista.",
    example: "WPF, Angular, Vue.",
  },
  {
    name: "PAC — Presentation Abstraction Control",
    family: "Interactive",
    idea: "Composición jerárquica de agentes PAC; sub-ventanas independientes.",
    example: "Interfaces complejas multi-panel.",
  },
  {
    name: "SEP — Simple Event Processing",
    family: "Event-based",
    idea: "Cada evento se procesa individualmente.",
    example: "Listeners clásicos en GUI.",
  },
  {
    name: "STREP — Stream Event Processing",
    family: "Event-based",
    idea: "Procesamiento en streams continuos (ventanas temporales, agregados).",
    example: "Apache Flink, Kafka Streams.",
  },
  {
    name: "CEP — Complex Event Processing",
    family: "Event-based",
    idea: "Detecta patrones entre múltiples eventos.",
    example: "«3 intentos fallidos en 60 s desde la misma IP».",
  },
  {
    name: "OLEP — Online Event Processing",
    family: "Event-based",
    idea: "Un event log es la fuente de verdad; los servicios derivan estado de él.",
    example: "Event sourcing (Kleppmann, 2019).",
  },
  {
    name: "Microservicios",
    family: "Compuesto",
    idea: "Múltiples servicios con Broker/Pub-Sub/REST, cada uno con sus layers.",
    example: "Plataformas cloud-native; cuidado con la complejidad operacional.",
  },
  {
    name: "Event-Driven Architecture",
    family: "Compuesto",
    idea: "Pub-sub + CEP como columna vertebral del sistema.",
    example: "Sistemas reactivos, IoT.",
  },
  {
    name: "CQRS + Event Sourcing",
    family: "Compuesto",
    idea: "Separa lectura/escritura con un OLEP de backing store.",
    example: "Dominios con auditoría y reproducibilidad fuertes.",
  },
  {
    name: "Hexagonal / Clean / Onion",
    family: "Compuesto",
    idea: "Variaciones de Layers con énfasis en independencia del dominio.",
    example: "Dominio sin imports de framework; dependencias hacia adentro.",
  },
];

const STYLE_FAMILIES: StyleFamily[] = [
  "Dataflow",
  "Distributed",
  "Interactive",
  "Event-based",
  "Compuesto",
];

const STYLE_BY_ATTR = [
  { attr: "Performance (latencia baja)", style: "Hierarchical Layers, in-process calls" },
  { attr: "Scalability horizontal", style: "Pub-Sub, Broker, Microservicios" },
  { attr: "Availability / Fault tolerance", style: "Pub-Sub con replicación, Peer-to-Peer" },
  { attr: "Maintainability", style: "Layers, MVC/MVP/MVVM, Microkernel" },
  { attr: "Evolvability", style: "Event-driven + CQRS, Microkernel" },
  { attr: "Throughput batch", style: "Batch Sequential, Pipes and Filters" },
  { attr: "Real-time analytics", style: "STREP, CEP" },
  { attr: "Audit y reproducibilidad", style: "OLEP / Event Sourcing" },
];

function StyleCatalog() {
  const [query, setQuery] = useState("");
  const [fam, setFam] = useState<StyleFamily | "All">("All");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return STYLES.filter((s) => {
      if (fam !== "All" && s.family !== fam) return false;
      if (!q) return true;
      return (
        s.name.toLowerCase().includes(q) ||
        s.family.toLowerCase().includes(q) ||
        s.idea.toLowerCase().includes(q) ||
        s.example.toLowerCase().includes(q)
      );
    });
  }, [query, fam]);

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">POSA · catálogo</span>
        <h3>Estilos arquitectónicos</h3>
        <p>
          Un estilo es una solución reutilizable a un problema de organización de componentes,
          con trade-offs conocidos. Buscá por familia o por intención, y elegí con ADD según el
          atributo dominante.
        </p>
      </div>

      <div className="vtool-stack">
        <Field label="Buscar">
          <TextInput
            placeholder="e.g. eventos, capas, stream, desacoplar…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Field>
        <div className="vtool-row">
          <Chip active={fam === "All"} onClick={() => setFam("All")}>
            Todas
          </Chip>
          {STYLE_FAMILIES.map((f) => (
            <Chip key={f} active={fam === f} onClick={() => setFam(f)}>
              {f}
            </Chip>
          ))}
        </div>
      </div>

      {results.length === 0 ? (
        <Note>No hay estilos que coincidan con “{query}”.</Note>
      ) : (
        <div className="vtool-stack" style={{ marginTop: 16 }}>
          {results.map((s) => (
            <SubPanel key={s.name}>
              <div
                className="vtool-row"
                style={{ justifyContent: "space-between", alignItems: "baseline" }}
              >
                <strong
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    color: "var(--ink-strong)",
                  }}
                >
                  {s.name}
                </strong>
                <Badge>{s.family}</Badge>
              </div>
              <p style={{ margin: "8px 0 0", fontSize: 14, lineHeight: 1.55 }}>{s.idea}</p>
              <p
                className="vtool-mono"
                style={{
                  margin: "8px 0 0",
                  fontSize: 12.5,
                  color: "var(--text-secondary)",
                  background: "transparent",
                  border: "none",
                  padding: 0,
                }}
              >
                {s.example}
              </p>
            </SubPanel>
          ))}
        </div>
      )}

      <div style={{ marginTop: 18 }}>
        <span className="vtool-eyebrow">Preferencia por atributo dominante</span>
        <DataTable
          columns={[
            { key: "attr", header: "Atributo dominante" },
            { key: "style", header: "Estilo favorecido" },
          ]}
          rows={STYLE_BY_ATTR.map((r, i) => ({ id: i, ...r }))}
        />
      </div>
    </Panel>
  );
}

/* ════════════════════════════════ TOOL 8 ════════════════════════════════ */
/* Catálogo de mecanismos de seguridad (amenaza → mecanismo → ubicación).    */

interface SecMech {
  name: string;
  threat: string;
  what: string;
  location: string;
  products: string;
}

const SEC_CATALOG: SecMech[] = [
  {
    name: "WAF",
    threat: "DDoS, scraping abusivo, payloads maliciosos (SQLi, XSS, path traversal)",
    what: "Firewall de capa 7 que inspecciona el tráfico HTTP/S antes del backend; rate limiting, geo-blocking, reglas OWASP CRS.",
    location: "Entre internet y el LB/edge — lo más afuera posible",
    products: "AWS WAF, Cloudflare, Akamai, ModSecurity",
  },
  {
    name: "MFA",
    threat: "Un atacante obtiene las credenciales de un usuario",
    what: "Autenticación con al menos dos factores de naturaleza distinta (algo que sabés / tenés / sos).",
    location: "En operaciones sensibles: login, cambio de credenciales, transferencias",
    products: "Authy, Google Authenticator, Okta MFA, WebAuthn/FIDO2",
  },
  {
    name: "Sanitización de inputs",
    threat: "Inputs malformados que ejecutan código no intencionado (SQLi, XSS, command/LDAP injection, XXE)",
    what: "Validar y normalizar todo input externo: allow-list + escaping/parametrización (prepared statements).",
    location: "En cada capa que recibe input del exterior — defense in depth",
    products: "Prepared statements, OWASP encoders, validadores de esquema",
  },
  {
    name: "Encriptación at-rest",
    threat: "Acceso al storage físico (disco, backup, snapshot)",
    what: "Datos cifrados en disco; la clave vive en un sistema separado (KMS/HSM/vault). TDE o column-level.",
    location: "A nivel del motor de BD y de los backups",
    products: "TDE (SQL Server/Oracle), AWS KMS, HashiCorp Vault",
  },
  {
    name: "Reverse proxy / LB como proxy",
    threat: "Preocupaciones transversales (TLS, rate limit, headers) dispersas por servicio",
    what: "Proxy reverso que centraliza terminación TLS, balanceo, rate limiting e IP allow/block-listing.",
    location: "Entre internet y el backend",
    products: "Nginx, HAProxy, Traefik, Envoy, AWS ALB",
  },
  {
    name: "VPN / segmentación de zonas",
    threat: "Sistemas externos/internos que no deben estar expuestos a internet",
    what: "Túnel cifrado punto a punto entre redes confiables; segmenta zona pública / privada / externos confiables.",
    location: "Para sistemas internos y proveedores fijos (Ops, cotización)",
    products: "WireGuard, OpenVPN, IPsec, AWS PrivateLink",
  },
];

function SecurityCatalog() {
  const [open, setOpen] = useState<string | null>(SEC_CATALOG[0].name);

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Atributo · Security</span>
        <h3>Mecanismos de seguridad</h3>
        <p>
          No son recetas: son opciones que se eligen ante escenarios de amenaza concretos. La
          estrategia es <strong>defense in depth</strong> — cada capa atrapa una clase de
          ataque, y el atacante debe romper varias.
        </p>
      </div>

      <pre className="vtool-code" style={{ marginBottom: 16 }}>{`Internet
   │ HTTPS (in-transit)
   ▼
[ WAF ]                ← filtra payloads conocidos
   │
   ▼
[ LB / Reverse proxy ] ← termina TLS, rate-limit
   │
   ▼
[ Backend ]            ← MFA en login crítico, sanitización
   │
   ▼
[ DB encriptada at-rest ]`}</pre>

      <div className="vtool-stack">
        {SEC_CATALOG.map((m) => {
          const isOpen = open === m.name;
          return (
            <SubPanel key={m.name}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : m.name)}
                style={{
                  all: "unset",
                  cursor: "pointer",
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                }}
              >
                <strong
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 17,
                    color: "var(--ink-strong)",
                  }}
                >
                  {m.name}
                </strong>
                <span className="vtool-mono">{isOpen ? "−" : "+"}</span>
              </button>
              <p style={{ margin: "6px 0 0", fontSize: 13.5, color: "var(--text-secondary)" }}>
                <strong style={{ color: "var(--accent-text)" }}>Escenario:</strong> {m.threat}
              </p>
              {isOpen && (
                <Readout style={{ marginTop: 12 }}>
                  <KvBlock k="Qué es" v={m.what} />
                  <KvBlock k="Ubicación" v={m.location} />
                  <KvBlock k="Productos" v={m.products} mono />
                </Readout>
              )}
            </SubPanel>
          );
        })}
      </div>

      <Note style={{ marginTop: 14 }}>
        Filosofía: el objetivo no es la defensa absoluta sino ser «lo suficientemente difícil de
        entrar para que sea más atractivo hackear a otro». La inversión es proporcional a la
        naturaleza de los datos.
      </Note>
    </Panel>
  );
}

/* ════════════════════════════════ TOOL 9 ════════════════════════════════ */
/* Checklist de revisión (arquitectura + OWASP + testing), persistido.       */

interface CheckGroup {
  id: string;
  title: string;
  blurb: string;
  items: { id: string; text: string }[];
}

const REVIEW: CheckGroup[] = [
  {
    id: "arch",
    title: "Architecture decisions",
    blurb: "Structural choices an ADR should capture.",
    items: [
      { id: "a1", text: "Module boundaries map to bounded contexts (high cohesion, low coupling)." },
      { id: "a2", text: "Dependencies point inward (domain has no framework imports)." },
      { id: "a3", text: "Each significant decision is recorded as an ADR with trade-offs." },
      { id: "a4", text: "Cross-cutting concerns (logging, auth, tx) are handled in one place." },
      { id: "a5", text: "Synchronous vs asynchronous integration is a deliberate choice." },
      { id: "a6", text: "Failure modes defined: timeouts, retries, circuit breakers, idempotency." },
      { id: "a7", text: "Data ownership is clear — no two services write the same table." },
      { id: "a8", text: "Backwards-compatible API versioning / deprecation strategy exists." },
    ],
  },
  {
    id: "sec",
    title: "Security — OWASP top risks",
    blurb: "Aligned to the OWASP Top 10 risk categories.",
    items: [
      { id: "s1", text: "Broken access control: authorization checked server-side on every request." },
      { id: "s2", text: "Cryptographic failures: secrets in a vault, TLS enforced, no plaintext PII." },
      { id: "s3", text: "Injection: parameterized queries / prepared statements, output encoding." },
      { id: "s4", text: "Insecure design: threat model done; abuse cases and trust boundaries mapped." },
      { id: "s5", text: "Security misconfiguration: hardened defaults, no debug/stack traces in prod." },
      { id: "s6", text: "Vulnerable components: dependencies pinned and scanned (SCA in CI)." },
      { id: "s7", text: "Auth failures: brute-force protection, MFA, secure session lifecycle." },
      { id: "s8", text: "Integrity failures: signed artifacts, verified CI/CD pipeline, SBOM." },
      { id: "s9", text: "Logging & monitoring: security events logged, alerted, and retained." },
      { id: "s10", text: "SSRF: outbound requests validate and allow-list target hosts." },
    ],
  },
  {
    id: "qa",
    title: "Testing & quality",
    blurb: "Quality gates before merge / release.",
    items: [
      { id: "q1", text: "Test pyramid respected: many unit, fewer integration, few E2E." },
      { id: "q2", text: "Critical paths covered; coverage tracked, not just maximized." },
      { id: "q3", text: "Tests are deterministic — no order dependence, no real network." },
      { id: "q4", text: "CI runs the full suite and blocks merge on red." },
      { id: "q5", text: "Static analysis + linter + formatter enforced automatically." },
      { id: "q6", text: "Performance / load budget verified for hot paths." },
      { id: "q7", text: "Rollback plan and observability (metrics, traces) in place for release." },
    ],
  },
];

const STORAGE_KEY = "inge2.review.checks.v1";
const ALL_ITEMS = REVIEW.reduce((n, g) => n + g.items.length, 0);

function ReviewChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [hydrated, setHydrated] = useState(false);

  // Load persisted state once on mount (client only).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          setChecked(parsed as Record<string, boolean>);
        }
      }
    } catch {
      /* corrupt or unavailable storage — start fresh */
    }
    setHydrated(true);
  }, []);

  // Persist on every change, but only after hydration so we don't clobber.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
    } catch {
      /* storage full / blocked — ignore */
    }
  }, [checked, hydrated]);

  const toggle = (id: string) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const reset = () => setChecked({});

  const groupDone = (g: CheckGroup) =>
    g.items.reduce((n, it) => n + (checked[it.id] ? 1 : 0), 0);

  const overall = REVIEW.reduce((n, g) => n + groupDone(g), 0);
  const overallPct = ALL_ITEMS ? Math.round((overall / ALL_ITEMS) * 100) : 0;

  return (
    <Panel>
      <div className="vtool-head">
        <span className="vtool-eyebrow">Pre-release review</span>
        <h3>Architecture &amp; security review</h3>
        <p>
          Walk the grouped checklist before shipping. Progress is saved in your browser, so
          you can come back to it. {!hydrated && "Loading your saved state…"}
        </p>
      </div>

      {/* Overall progress */}
      <SubPanel style={{ marginBottom: 16 }}>
        <div
          className="vtool-row"
          style={{ justifyContent: "space-between", alignItems: "baseline" }}
        >
          <strong style={{ color: "var(--ink-strong)" }}>Overall</strong>
          <span className="vtool-mono">
            {overall} / {ALL_ITEMS} · {overallPct}%
          </span>
        </div>
        <ProgressBar pct={overallPct} />
        <div className="vtool-row" style={{ marginTop: 12 }}>
          <button type="button" className="btn btn--sm btn--ghost" onClick={reset}>
            Reset all
          </button>
        </div>
      </SubPanel>

      <div className="vtool-stack">
        {REVIEW.map((g) => {
          const done = groupDone(g);
          const pct = g.items.length ? Math.round((done / g.items.length) * 100) : 0;
          return (
            <SubPanel key={g.id}>
              <div
                className="vtool-row"
                style={{ justifyContent: "space-between", alignItems: "baseline" }}
              >
                <strong
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 16,
                    color: "var(--ink-strong)",
                  }}
                >
                  {g.title}
                </strong>
                <span className="vtool-mono">
                  {done} / {g.items.length}
                </span>
              </div>
              <Note style={{ marginTop: 4 }}>{g.blurb}</Note>
              <ProgressBar pct={pct} />
              <div className="vtool-stack" style={{ gap: 8, marginTop: 12 }}>
                {g.items.map((it) => {
                  const on = !!checked[it.id];
                  return (
                    <label
                      key={it.id}
                      className="vtool-row"
                      style={{
                        gap: 10,
                        cursor: "pointer",
                        alignItems: "flex-start",
                        flexWrap: "nowrap",
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() => toggle(it.id)}
                        style={{ marginTop: 3, accentColor: "var(--accent)" }}
                      />
                      <span
                        style={{
                          color: on ? "var(--text-secondary)" : "var(--text-primary)",
                          textDecoration: on ? "line-through" : "none",
                          fontSize: 14,
                          lineHeight: 1.5,
                        }}
                      >
                        {it.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </SubPanel>
          );
        })}
      </div>
    </Panel>
  );
}

function ProgressBar({ pct }: { pct: number }) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <div
      style={{
        marginTop: 10,
        height: 8,
        borderRadius: 999,
        background: "var(--hairline)",
        overflow: "hidden",
      }}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        style={{
          width: `${clamped}%`,
          height: "100%",
          background: clamped === 100 ? "var(--accent)" : "var(--primary)",
          transition: "width 180ms ease",
        }}
      />
    </div>
  );
}

/* ════════════════════════════════ SHELL ════════════════════════════════ */
export default function Inge2Tools() {
  const tools: Tool[] = [
    {
      key: "dashboard",
      label: "Mapa de estudio",
      group: "Plan de recu",
      icon: "target",
      verb: "Ver progreso",
      desc: "Tu punto de partida: cuánto dominás cada unidad, qué tan listo estás para el recu y dónde conviene enfocar.",
      node: <StudyDashboard />,
    },
    {
      key: "flashcards",
      label: "Flashcards",
      group: "Aprender",
      icon: "cards",
      verb: "Repasar",
      desc: "Memorizá los conceptos clave con recuerdo activo y repetición espaciada: la app te trae lo que más te cuesta.",
      node: <Flashcards />,
    },
    {
      key: "tradeoffs",
      label: "Trade-offs",
      group: "Aprender",
      icon: "scale",
      verb: "Entrenar",
      desc: "Toda decisión de arquitectura cede algo a cambio de otra cosa. Entrená qué se gana y qué se resigna en cada una.",
      node: <TradeoffTrainer />,
    },
    {
      key: "quiz",
      label: "Banco de preguntas",
      group: "Practicar",
      icon: "question",
      verb: "Practicar",
      desc: "Cientos de preguntas filtrables por unidad y dificultad, con explicación, para medir qué sabés de verdad.",
      node: <QuizBank />,
    },
    {
      key: "mechanism",
      label: "¿Qué mecanismo?",
      group: "Practicar",
      icon: "gears",
      verb: "Decidir",
      desc: "Te damos un problema de diseño y elegís el mecanismo que lo resuelve: entrená el criterio que toman en el parcial.",
      node: <MechanismPicker />,
    },
    {
      key: "antipatterns",
      label: "Anti-patrones",
      group: "Practicar",
      icon: "warning",
      verb: "Detectar",
      desc: "Aprendé a oler el mal diseño: leé un caso y detectá el anti-patrón antes de que se vuelva un problema.",
      node: <AntipatternDrill />,
    },
    {
      key: "parcial",
      label: "Parcial simulado",
      group: "Práctica de parcial",
      icon: "clipboard",
      verb: "Rendir",
      desc: "Un parcial completo con el formato real, caso por caso, para ponerte a prueba en condiciones de examen.",
      node: <ParcialSimulado />,
    },
    {
      key: "scenarios",
      label: "Escenarios de calidad",
      group: "Resolver",
      icon: "list",
      verb: "Resolver",
      desc: "Escribí escenarios de atributos de calidad (rendimiento, seguridad…) con la plantilla estímulo–respuesta–medida.",
      node: <QualityAttributeScenarios />,
    },
    {
      key: "add",
      label: "ADD: caso resuelto",
      group: "Resolver",
      icon: "blueprint",
      verb: "Recorrer",
      desc: "Recorré un diseño guiado por atributos (ADD) paso a paso sobre un caso real, decisión por decisión.",
      node: <AddWalkthrough />,
    },
    {
      key: "cap",
      label: "CAP / PACELC",
      group: "Resolver",
      icon: "triangle",
      verb: "Clasificar",
      desc: "Ante una partición de red, ¿el sistema elige consistencia o disponibilidad? Clasificá casos con CAP y PACELC.",
      node: <CapClassifier />,
    },
    {
      key: "availability",
      label: "Disponibilidad",
      group: "Resolver",
      icon: "pulse",
      verb: "Calcular",
      desc: 'Cuántos "nueves" da tu sistema: calculá disponibilidad en serie, en paralelo y el tiempo caído al año.',
      node: <AvailabilityCalculator />,
    },
    {
      key: "board",
      label: "Pizarra de diagramas",
      group: "Dibujar",
      icon: "pen",
      verb: "Dibujar",
      desc: "Una pizarra para bocetar diagramas de componentes y despliegue, como los que tenés que dibujar en el parcial.",
      node: <DiagramBoard />,
    },
    {
      key: "styles",
      label: "Estilos",
      group: "Referencia",
      icon: "blocks",
      verb: "Explorar",
      desc: "Catálogo de estilos arquitectónicos (capas, microservicios, eventos…): cuándo usar cada uno y qué implica.",
      node: <StyleCatalog />,
    },
    {
      key: "security",
      label: "Seguridad",
      group: "Referencia",
      icon: "lock",
      verb: "Explorar",
      desc: "Tácticas de seguridad y las amenazas que mitigan: autenticación, cifrado, auditoría y compañía, a mano.",
      node: <SecurityCatalog />,
    },
    {
      key: "patterns",
      label: "Patrones GoF",
      group: "Referencia",
      icon: "blocks",
      verb: "Explorar",
      desc: "Los 23 patrones de diseño clásicos explicados con su intención, estructura y ejemplo de uso.",
      node: <PatternCatalog />,
    },
    {
      key: "decision",
      label: "¿Qué patrón?",
      group: "Referencia",
      icon: "branch",
      verb: "Decidir",
      desc: "Describí tu problema y la guía te lleva al patrón GoF indicado: una brújula para no quedarte en blanco.",
      node: <WhichPattern />,
    },
    {
      key: "checklist",
      label: "Review checklist",
      group: "Referencia",
      icon: "checklist",
      verb: "Revisar",
      desc: "La lista de control para repasar tu diseño antes de entregarlo y no perder puntos por descuidos típicos.",
      node: <ReviewChecklist />,
    },
  ];

  return (
    <ToolkitShell
      intro="Todo para llegar listo al recuperatorio de Ingeniería de Software II, ordenado como un plan de estudio: empezá por el mapa para ver dónde estás parado, aprendé y practicá los conceptos, ponete a prueba con un parcial simulado, y tené a mano las herramientas de resolución y la referencia. Cada tarjeta te dice de un vistazo para qué sirve."
      tools={tools}
    />
  );
}
