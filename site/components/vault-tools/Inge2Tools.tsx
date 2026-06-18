"use client";

import { useEffect, useMemo, useState } from "react";
import { Panel, SubPanel, Note, Mono, TextInput, Select, Chip } from "@studyvaults/ui";
import ToolkitShell from "./ToolkitShell";

/* ──────────────────────────────────────────────────────────────────────────
   Ingeniería del Software II — study toolkit
   Subject focus: software architecture, security (OWASP) and design patterns.
   Pure data + client-only interactivity. Static-export safe: every
   window/localStorage access is guarded behind useEffect or event handlers.
   ────────────────────────────────────────────────────────────────────────── */

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

/* ════════════════════════════════ TOOL 1 ════════════════════════════════ */
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
        <div className="vtool-field">
          <label className="vtool-label" htmlFor="pat-q">
            <b>Search</b>
          </label>
          <TextInput
            id="pat-q"
            placeholder="e.g. decouple, runtime algorithm, tree, undo…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        <div className="vtool-row">
          <Chip
            active={cat === "All"}
            onClick={() => setCat("All")}
          >
            All · {counts.All}
          </Chip>
          {CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={cat === c}
              onClick={() => setCat(c)}
            >
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
                <div className="vtool-kv" style={{ display: "block", textAlign: "left" }}>
                  <span className="k">Intent</span>
                  <div className="v" style={{ textAlign: "left", fontWeight: 400 }}>
                    {p.intent}
                  </div>
                </div>
                <div className="vtool-kv" style={{ display: "block", textAlign: "left" }}>
                  <span className="k">Applicability</span>
                  <div className="v" style={{ textAlign: "left", fontWeight: 400 }}>
                    {p.applicability}
                  </div>
                </div>
                <div className="vtool-kv" style={{ display: "block", textAlign: "left" }}>
                  <span className="k">Consequences</span>
                  <div className="v" style={{ textAlign: "left", fontWeight: 400 }}>
                    {p.consequences}
                  </div>
                </div>
                <div className="vtool-kv" style={{ display: "block", textAlign: "left" }}>
                  <span className="k">Example</span>
                  <div
                    className="v vtool-mono"
                    style={{ textAlign: "left", fontWeight: 400 }}
                  >
                    {p.example}
                  </div>
                </div>
              </div>
            </SubPanel>
          ))}
        </div>
      )}
    </Panel>
  );
}

/* ════════════════════════════════ TOOL 2 ════════════════════════════════ */
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
  const chosen =
    stage && optionIdx != null ? stage.refine.options[optionIdx] : null;

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
          <div className="vtool-field">
            <label className="vtool-label" htmlFor="pick-refine">
              <b>Step 2 — {stage.refine.q}</b>
            </label>
            <Select
              id="pick-refine"
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
          </div>
        )}
      </div>

      {!kind && (
        <Note style={{ marginTop: 14 }}>
          Pick a problem category above to begin.
        </Note>
      )}

      {chosen && (
        <div className="vtool-stack" style={{ marginTop: 16 }}>
          <span className="vtool-eyebrow">
            Recommended {chosen.patterns.length > 1 ? "patterns" : "pattern"}
          </span>
          <Note style={{ marginTop: 0 }}>
            {chosen.why}
          </Note>
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

  const toggle = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

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
              <Note style={{ marginTop: 4 }}>
                {g.blurb}
              </Note>
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
  const tools = [
    { key: "patterns", label: "Pattern catalog", node: <PatternCatalog /> },
    { key: "decision", label: "Which pattern?", node: <WhichPattern /> },
    { key: "checklist", label: "Review checklist", node: <ReviewChecklist /> },
  ];

  return (
    <ToolkitShell
      intro="Software Engineering II toolkit — browse the GoF design-pattern catalog, get a guided recommendation for your problem, and run an architecture + OWASP security review before you ship."
      tools={tools}
    />
  );
}
