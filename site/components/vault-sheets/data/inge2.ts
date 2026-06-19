import type { Sheet } from "../types";

// Generado por el pipeline studyvault-cheatsheets (extracción + auditoría sub-overseer).
// Editable a mano: es data pura. Ver components/vault-sheets/types.ts.

export const inge2Conceptos: Sheet = {
  "vault": "inge2",
  "kind": "conceptos",
  "title": "Software Engineering II",
  "subtitle": "Architecture & quality: drivers, methods (ADD/ATAM), styles, persistence (CAP), security, integration & GoF patterns",
  "notation": "QA = quality attribute. $A$ = availability. CP/AP = CAP positions. P-S/P-P = primary-secondary / primary-primary. Scenario parts: Source-Stimulus-Environment-Artifact-Response-Measure.",
  "updated": "2026-06-19",
  "groups": [
    {
      "title": "Architecture fundamentals",
      "hint": "What architecture is, why decisions matter, the context that shapes them.",
      "entries": [
        {
          "label": "Software architecture",
          "kind": "def",
          "body": "The set of $significant$ decisions about a system's organization: structural elements, their externally-visible properties and relationships, plus the guiding style.",
          "note": "Bass/Clements/Kazman, Kruchten, Booch converge on this core."
        },
        {
          "label": "What makes a decision 'significant'",
          "kind": "method",
          "body": "It is architectural if it has (1) high cost of change, (2) impact on multiple QAs, (3) constrains future decisions, (4) is externally visible across the module boundary.",
          "cond": "Architecture vs design is a gradient, not binary (Fowler: 'the important stuff')."
        },
        {
          "label": "Architectural vs not",
          "kind": "example",
          "body": "Architectural: monolith vs microservices, SQL vs document store, REST vs events, security model. Not: HashMap vs TreeMap, variable names, splitting a method."
        },
        {
          "label": "Architecture Business Cycle (ABC)",
          "kind": "theorem",
          "body": "Architecture is the center of a feedback loop: stakeholders + dev org + tech environment + architect's experience shape it; the resulting system in turn reshapes all four.",
          "note": "No optimal architecture in the abstract — same requirements yield different architectures by context."
        },
        {
          "label": "No Silver Bullet (Brooks)",
          "kind": "caution",
          "body": "No universal architectural decision dissolves essential complexity. Every architecture is a context-bound compromise.",
          "note": "Antidote to 'microservices/clean architecture are always better'."
        },
        {
          "label": "Conway's Law",
          "kind": "def",
          "body": "System structure mirrors the communication structure of the organization that built it. Inverse Conway: restructure teams to drive the architecture you want."
        }
      ]
    },
    {
      "title": "Quality attributes (ISO 25000/25010)",
      "hint": "The non-functional currency for comparing architectures. Every QA needs a metric.",
      "entries": [
        {
          "label": "Quality attribute",
          "kind": "def",
          "body": "A non-functional property of the system (IEEE: a feature affecting an item's quality). The currency for comparing architectures — 'better' is empty without naming a quantifiable QA."
        },
        {
          "label": "QA taxonomy",
          "kind": "def",
          "body": "Run-time (Availability, Fault Tolerance, Interoperability, Manageability, Customizability, Performance, Precision, Reliability, Scalability, Auditability, Security); Design (Conceptual Integrity, Maintainability, Portability, Reusability); System (Supportability, Testability); User (Accessibility, Usability)."
        },
        {
          "label": "Quantify every QA",
          "kind": "method",
          "body": "Attach a metric: Availability→% uptime; Reliability→MTBF/MTTR; Performance→latency percentiles, rps; Security→CVSS, blast radius; Maintainability→cyclomatic complexity, change time; Usability→task success, SUS.",
          "note": "A QA without a metric is an aspiration, not a requirement."
        },
        {
          "label": "Availability vs Reliability",
          "kind": "caution",
          "body": "Availability = proportion of time up in a window. Reliability = uninterrupted operation in a window.",
          "note": "Canonical: a program restarting every hour for 1s is Available (~99.97%) but NOT Reliable. Long uninterruptible ops (live auction, video consult, multi-step transfer) → Reliability dominates."
        },
        {
          "label": "Interoperability vs Fault Tolerance",
          "kind": "caution",
          "body": "Interoperability has two faces (as client: how I connect to others; as server: how others connect to me) — needs adapters/anti-corruption layer per side. Fault Tolerance answers the failure of an external component, not protocol incompatibility.",
          "note": "Confusing them yields solutions that neither protect from failure nor solve integration."
        },
        {
          "label": "Manageability vs Customizability",
          "kind": "caution",
          "body": "Manageability = the sysadmin can tell if the app is healthy (dashboards, golden signals: latency/traffic/errors/saturation). Customizability = the end-user can alter look/behavior (themes, layouts, language). Customizability ≠ Usability (how well a standard UI does its job)."
        },
        {
          "label": "Auditability — architectural consequence",
          "kind": "method",
          "body": "When Auditability is a priority, logs live in a separate store with distinct access control (separation of duties): whoever operates the app must not be able to alter/delete audit logs. Often append-only (event sourcing, WORM).",
          "note": "Stronger than 'log everything' — the log store is a separate component in the diagram."
        },
        {
          "label": "Canonical QA trade-offs",
          "kind": "theorem",
          "body": "Security↔Usability (MFA, timeouts); Performance↔Maintainability (caches, denormalization); Availability↔Consistency (= CAP); Portability↔Performance (abstraction layers); Reusability↔Simplicity (premature generalization); Testability↔Deliverability."
        }
      ]
    },
    {
      "title": "Reliability & SLOs",
      "hint": "MTBF/MTTR, the availability formula, redundancy, and the SLI/SLO/SLA triad.",
      "entries": [
        {
          "label": "MTBF / MTTR",
          "kind": "def",
          "body": "MTBF = Mean Time Between Failures (how reliable — time survived between incidents). MTTR = Mean Time To Recover/Repair (how recoverable — time to restore service).",
          "note": "MTTF for non-repairable parts; MTTD (detect), MTTA (acknowledge) feed into MTTR."
        },
        {
          "label": "Availability formula",
          "kind": "formula",
          "tex": "A = \\dfrac{\\text{MTBF}}{\\text{MTBF} + \\text{MTTR}}",
          "body": "Two levers: raise MTBF (reliability engineering — expensive) or lower MTTR (observability, failover, rollback — cheaper). Cloud era favors MTTR ('assume failure, recover fast')."
        },
        {
          "label": "Redundancy composition",
          "kind": "formula",
          "tex": "A_{\\parallel} = 1-(1-a)^n \\qquad A_{\\text{series}} = a^n",
          "body": "Parallel (1-of-N active-active) multiplies the nines; series (N must all work) degrades total availability.",
          "cond": "$a$ = single-component availability, $n$ = number of components."
        },
        {
          "label": "Nines → downtime/year",
          "kind": "example",
          "body": "90%→36.5d; 99%→3.65d; 99.9%→8.76h; 99.99%→52.6min; 99.999%→5.26min. Each extra nine costs ~10× more engineering effort.",
          "note": "5 nines reserved for telephony/networking core."
        },
        {
          "label": "SLI / SLO / SLA",
          "kind": "def",
          "body": "SLI = a measured metric (e.g. % 2xx responses, p99 latency). SLO = internal objective threshold over an SLI. SLA = external contract with penalties if the published SLO is missed.",
          "cond": "Always SLA ≤ SLO ≤ 100% — never publish an SLA equal to the internal SLO (no engineering margin)."
        },
        {
          "label": "Error budget",
          "kind": "formula",
          "body": "Allowed unreliability = $1 - \\text{SLO}$ over the window. 99.9% monthly → ~43 min downtime budget.",
          "note": "The currency for risk: budget left → aggressive deploys; budget spent → freeze deploys."
        }
      ]
    },
    {
      "title": "Design methods: ADD, ATAM, utility tree",
      "hint": "How to build (ADD), evaluate (ATAM/SAAM), and quantify QAs (utility tree, scenarios).",
      "entries": [
        {
          "label": "Attribute Driven Design (ADD)",
          "kind": "method",
          "body": "Method to BUILD architecture with explicit traceability between each decomposition and the QAs justifying it. Loop: (1) choose module to decompose → (2) identify its drivers → (3) pick a style/pattern that solves them (make trade-offs explicit) → (4) instantiate submodules + responsibilities → (5) iterate.",
          "cond": "Stop when the team can start coding without breaking architectural invariants. Skip for simple CRUD / spikes (overkill)."
        },
        {
          "label": "Architectural drivers",
          "kind": "def",
          "body": "ADD's three inputs: critical functional requirements + prioritized QAs (with concrete scenarios) + constraints (technical, business, regulatory). Everything else is detailed design."
        },
        {
          "label": "ATAM (Architecture Tradeoff Analysis Method)",
          "kind": "method",
          "body": "Formal method to EVALUATE an architecture against its QAs (SEI/CMU, gold standard). 4 phases / 9 steps. Outputs: utility tree, sensitivity points, tradeoff points, risks/non-risks, risk themes.",
          "cond": "~20-30 person-days over 4-6 weeks → reserve for high-impact, irreversible decisions."
        },
        {
          "label": "Sensitivity vs tradeoff point",
          "kind": "def",
          "body": "Sensitivity point = a decision a single QA depends strongly on (e.g. central broker → performance). Tradeoff point = a decision affecting multiple QAs in opposite directions (e.g. replicate broker → availability up, consistency down). Finding these is ATAM's core value."
        },
        {
          "label": "SAAM & Lightweight ATAM",
          "kind": "method",
          "body": "SAAM (1993, ancestor): scenario-based; classifies scenarios as direct (supported as-is) or indirect (require change); good for modifiability. Lightweight ATAM: 1-2 day workshop, small team, keeps utility tree + sensitivity/tradeoff analysis.",
          "cond": "Lightweight NOT for high-impact irreversible/regulated systems or conflicting stakeholders → use full ATAM."
        },
        {
          "label": "Utility tree",
          "kind": "method",
          "body": "Hierarchy connecting abstract value to verifiable scenarios: root (system utility) → QAs → features → leaf scenarios. Each leaf tagged (Importance, Difficulty) in H/M/L. H/H and H/M scenarios drive the analysis.",
          "note": "Avoid H/H everywhere — the tree must discriminate priorities."
        },
        {
          "label": "6-part QA scenario",
          "kind": "def",
          "body": "Source · Stimulus · Environment · Artifact · Response · Response measure. The response must be observable and the measure quantifiable — without a metric there is nothing to validate.",
          "cond": "ATAM/ADD/SAAM all anchor on this canonical scenario form (Bass/Clements/Kazman)."
        }
      ]
    },
    {
      "title": "Design process & governance",
      "hint": "When to design, how much, and how to encode decisions and standards at scale.",
      "entries": [
        {
          "label": "BDUF / YAGNI / JEDUF",
          "kind": "method",
          "body": "BDUF = design everything up front (waterfall, regulated domains). YAGNI = don't design for the future (XP/agile). JEDUF = Just Enough Design Up Front: anchor irreversible/high-cost decisions, let cheap ones emerge. JEDUF is the course's stance.",
          "cond": "Heuristic (Bezos): one-way door → design; two-way door → iterate."
        },
        {
          "label": "Cone of uncertainty",
          "kind": "theorem",
          "body": "Estimation error shrinks over time: ~0.25×–4× at initial definition → 1.0× at completion. Do NOT make irreversible decisions when uncertainty is maximal.",
          "note": "The cone does NOT close on its own — needs scope definition, spikes, ADRs, early feedback (McConnell)."
        },
        {
          "label": "Emergent vs Intentional design",
          "kind": "def",
          "body": "Emergent: architecture surfaces from continuous refactoring (needs high test coverage + discipline + internalized principles). Intentional: defined deliberately via ADRs/diagrams. Mature practice combines: intentional for high-cost decisions, emergent for cheap detail.",
          "note": "Fowler: emergent design requires intentional discipline; it is not 'no design'."
        },
        {
          "label": "ADR (Architecture Decision Record)",
          "kind": "method",
          "body": "Short, versioned, in-repo doc capturing one decision: Title · Status (Proposed/Accepted/Deprecated/Superseded) · Context · Decision · Consequences. Conserves the 'why'.",
          "cond": "Write one when the decision is hard to reverse; don't bureaucratize trivial choices."
        },
        {
          "label": "Architectural guardrails",
          "kind": "def",
          "body": "Org rules that channel local decisions without dictating solutions (e.g. 'every service exposes /metrics'). Good ones: few, justified, automatable, revisable. Distinct from prescriptive stack mandates.",
          "note": "Guardrails = rules; Golden Paths = the easiest way to comply."
        },
        {
          "label": "Platform Engineering & Golden Paths",
          "kind": "def",
          "body": "Internal Developer Platform (IDP) materializes guardrails as self-service tooling, reducing cognitive load. Golden Path = pre-built happy path for a common task (create service → repo+CI+deploy+observability+auth). Single pane of glass shows everything for a service.",
          "cond": "Overkill under ~20 devs. The path is golden, not forced — opt-out must stay possible (else shadow IT)."
        }
      ]
    },
    {
      "title": "Documentation & views",
      "hint": "C4 (zoom levels) and 4+1 (stakeholder views); neither covers QAs/ADRs alone.",
      "entries": [
        {
          "label": "C4 model (Brown)",
          "kind": "method",
          "body": "Four zoom levels: C1 Context (system as one box + users + externals) → C2 Containers (deployable units + tech) → C3 Components (modules inside a container) → C4 Code (classes/UML).",
          "cond": "C1-C3 usually worth it; C4 often skippable. 'Container' ≠ Docker container — means executable unit. Produce only levels someone reads."
        },
        {
          "label": "4+1 view model (Kruchten)",
          "kind": "method",
          "body": "Four orthogonal views by audience: Logical (what it does) · Process (runtime behavior, concurrency) · Development (source organization) · Physical/Deployment (hardware mapping). +1 Scenarios (use cases that cross and validate the four views).",
          "note": "UML-centric; produce only views with an audience."
        },
        {
          "label": "C4/4+1 don't cover QAs",
          "kind": "caution",
          "body": "Neither expresses QA traceability or decisions/trade-offs natively. Complement with a utility tree (QAs) and ADRs (decisions). Recommended hybrid: living C1-C2 diagrams + key scenarios + ADRs + utility tree."
        }
      ]
    },
    {
      "title": "Architectural styles (POSA)",
      "hint": "Reusable component-organization solutions with known trade-offs; chosen via ADD.",
      "entries": [
        {
          "label": "Architectural style",
          "kind": "def",
          "body": "A reusable solution to a recurring component-organization problem, with known trade-offs. Choosing a style is a significant architectural decision (POSA / Buschmann et al.)."
        },
        {
          "label": "Dataflow styles",
          "kind": "def",
          "body": "Batch Sequential (each stage processes the whole dataset, passes on — nightly ETL); Pipes and Filters (filters connected by pipes, composable/parallelizable — Unix pipes, NiFi); Hierarchical Layers (each layer uses only the one below — OSI, n-tier apps)."
        },
        {
          "label": "Distributed styles",
          "kind": "def",
          "body": "Broker (intermediary coordinates clients↔servers — CORBA, Kafka/RabbitMQ); Publish-Subscribe (publishers emit, subscribers by topic — temporal decoupling); Forwarder-Receiver; Client-Dispatcher-Server (precursor of service discovery); Peer-to-Peer."
        },
        {
          "label": "Interactive styles",
          "kind": "def",
          "body": "MVC (Model/View/Controller); MVP (passive view, Presenter holds logic — testable); MVVM (databindable ViewModel — WPF/Angular/Vue); PAC (hierarchical agents); VIPER (iOS modular)."
        },
        {
          "label": "Event-based styles",
          "kind": "def",
          "body": "SEP (Simple — each event individually); STREP (Stream — continuous streams, windows — Flink, Kafka Streams); CEP (Complex — patterns across events, e.g. '3 fails in 60s from same IP'); OLEP (Online — event log is source of truth, Kleppmann)."
        },
        {
          "label": "Composite macro-architectures",
          "kind": "def",
          "body": "Monolith (Layers in one process), Microservices (services + Broker/Pub-Sub/REST), Serverless/FaaS (event-driven functions), EDA (pub-sub + CEP), CQRS + Event Sourcing, Hexagonal/Clean/Onion (Layers with domain independence)."
        },
        {
          "label": "Style by dominant QA",
          "kind": "method",
          "body": "Low latency→Layers/in-process; horizontal scalability→Pub-Sub/Broker/Microservices; availability→replicated Pub-Sub/P2P; maintainability→Layers/MV*/Microkernel; evolvability→EDA+CQRS; batch throughput→Batch Sequential/Pipes; real-time analytics→STREP/CEP; audit/reproducibility→OLEP/Event Sourcing.",
          "note": "Avoid 'microservices by default' — operational complexity must be justified."
        }
      ]
    },
    {
      "title": "Persistence & data modeling",
      "hint": "Storage taxonomy, RDBMS/NoSQL/OODBMS/prevalence, ORM impedance, OLTP vs OLAP.",
      "entries": [
        {
          "label": "Persistence",
          "kind": "def",
          "body": "The characteristic of data that outlives the program generating it (RAM is volatile and bounded). Every persistence choice is an architectural decision — among the least reversible (data migrations take months)."
        },
        {
          "label": "Persistence selection criteria",
          "kind": "method",
          "body": "Three axes: Performance (medium access, search cost), Data transformation (fidelity to the app model — impedance), Fault tolerance (recovery, ACID, replication, WAL). Plus the ABC context (budget, team, regulation, volume)."
        },
        {
          "label": "Relational DB (RDBMS / OLTP)",
          "kind": "def",
          "body": "Codd's relational model: tables + keys + constraints, declarative SQL over relational algebra. Defended as default for: physical independence, safe concurrency (MVCC/isolation), recoverability (WAL), integrity (ACID), mature ecosystem.",
          "note": "Stored procedures discouraged — break CI/CD, versioning, rollback."
        },
        {
          "label": "Non-relational DB (NoSQL)",
          "kind": "def",
          "body": "Dedicated engines that productized RDBMS workarounds (sharding, JSON blobs). Three families: Wide-column (Cassandra, BigTable — fast column projections); Key-Value (Redis, DynamoDB — flexible, opaque values); Document (MongoDB, Elasticsearch — JSON, REST). Scalable, distributed-by-design, flexible schema, often AP.",
          "note": "Right name is 'non-relational' — most now support some SQL."
        },
        {
          "label": "OLTP vs OLAP",
          "kind": "caution",
          "body": "OLTP: many short writes, normalized (3NF), <10ms, ACID, mutable. OLAP: heavy aggregate queries, denormalized (star/snowflake), seconds-minutes, append-only, populated by ETL from OLTP.",
          "note": "NEVER use OLAP for transactional work (10× cost, 100× slower, no ACID) — exam disqualifier."
        },
        {
          "label": "ETL / ELT",
          "kind": "def",
          "body": "ETL = Extract→Transform→Load (batch move OLTP→warehouse). ELT = Extract→Load→Transform inside a modern columnar warehouse (BigQuery/Snowflake/Redshift) via SQL (dbt). OLAP is a derivative, never the source of truth."
        },
        {
          "label": "ORM & object-relational impedance",
          "kind": "def",
          "body": "Impedance mismatch: object graphs (inheritance, polymorphism, bidirectional refs, identity-by-reference) vs flat typed tuples (PK identity, FKs, no inheritance). ORM automates the mapping (CRUD, identity map, lazy load, dirty tracking).",
          "cond": "ORM by default for ~80% of ops; escape to native SQL for complex/perf-critical queries (N+1, suboptimal SQL). Active Record (simple, coupled) vs Data Mapper (rich domain, testable)."
        },
        {
          "label": "Prevalence",
          "kind": "def",
          "body": "Persistence pattern: full state lives in memory as native objects; durability via command log (WAL written before applying) + periodic snapshots. Prevayler/Madeleine/Bamboo. No impedance, very high performance.",
          "cond": "Requires the whole dataset to fit in RAM; single-process, poor interoperability, no ad-hoc queries. Conceptual kin of event sourcing and Redis AOF+RDB."
        },
        {
          "label": "Object DB (OODBMS) — rarely chosen",
          "kind": "caution",
          "body": "Stores object graphs directly (inheritance, polymorphism, object identity), eliminating impedance — but lost to RDBMS on ecosystem, SQL standard, language coupling, schema migration. Default answer is RDBMS + ORM."
        }
      ]
    },
    {
      "title": "Distributed data: CAP, scaling, computation",
      "hint": "CAP/PACELC, replication, sharding, partition-replicate-index, locality, map-reduce, online vs offline.",
      "entries": [
        {
          "label": "CAP theorem",
          "kind": "theorem",
          "body": "Under a network partition, a distributed data system must choose Consistency or Availability — not both (Brewer; Gilbert & Lynch). C = every read sees the latest write; A = every request to a healthy node gets a response; P = keeps operating despite partition.",
          "cond": "P is not optional (every real network partitions). The real choice is C vs A DURING a partition."
        },
        {
          "label": "CP / AP / PACELC",
          "kind": "def",
          "body": "CP: minority side rejects ops to stay consistent (HBase, etcd, Zookeeper, Mongo majority). AP: all nodes keep accepting, reconcile later (Cassandra, DynamoDB, Riak). PACELC: during Partition choose A/C; Else (normal) choose Latency/Consistency. Cassandra=PA/EL, Spanner=PC/EC.",
          "note": "Bank→CP; cart→AP; social feed→AP; coordination (locks/leader)→CP; read-heavy catalog→AP."
        },
        {
          "label": "Replication",
          "kind": "def",
          "body": "Same data on N nodes for: read scalability, high availability (failover), geo-locality. Primary-Secondary (P-S): one writer + N read replicas, default async; the writer is the write bottleneck. Primary-Primary (P-P): all nodes read/write — scales writes but concurrency conflicts + O(N²) coordination overhead (cap ~8-16 nodes).",
          "cond": "Sync = CP (wait/fail); async = AP (accept, propagate later). Default: P-S async."
        },
        {
          "label": "Sharding (horizontal partitioning)",
          "kind": "def",
          "body": "Split the DB into N structurally-identical pieces with disjoint data; each shard smaller (indexes fit RAM) and load distributes. Strategies: range, hash, lookup/directory, geographic, temporal.",
          "cond": "No FKs/transactions cross-shard → app handles integrity (2PC, retry, last-write-wins, saga). Ortho to replication."
        },
        {
          "label": "Choosing the shard key",
          "kind": "method",
          "body": "Align with the DOMINANT query pattern (locality: data accessed together stored together). Twitter chose partition-by-time for tweets (recent tweets queried most → usually 1 shard hit). No universal shard key — rare cases pay a cost.",
          "note": "If app already juggles manual shards + retry + JSON blobs, you're reimplementing a distributed DB → migrate to NoSQL."
        },
        {
          "label": "Partition, Replicate, Index (Kallen)",
          "kind": "theorem",
          "body": "'Scalability isn't magic — it's partitioning, replication, and indexing.' Partition→volume+parallelism; Replicate→availability+read throughput; Index→query speed (incl. secondary, inverted, materialized views). Big systems do all three.",
          "note": "Start by partitioning; replicate and index come after."
        },
        {
          "label": "Locality principle",
          "kind": "def",
          "body": "Spatial: access i → likely access i+1 (clustered indexes, columnar layout, shard by user_id). Temporal: access at t → likely access again soon (caches, shard/TTL by time). Co-locate data that's read together.",
          "note": "Sometimes violate locality on purpose: uniform hash to avoid hot shards when distribution is skewed."
        },
        {
          "label": "Memory hierarchy",
          "kind": "def",
          "body": "Layers trade speed/capacity/cost: registers→L1/L2/L3→RAM→SSD→HDD→network→tape, each step ~10-100× slower. Kallen's rules: data for real-time queries MUST be in memory; disk is for writes only; exploit locality to make slow access rare."
        },
        {
          "label": "Offline vs online computation",
          "kind": "method",
          "body": "Online = compute at query time (simple, fresh, costly per read). Offline = precompute/materialize (cheap read, costly write — e.g. Twitter timeline fanout). Hybrid = cache + recompute on miss. Precompute only when work is BOUNDED and the query pattern is LIMITED.",
          "cond": "Materialize when reads × read_cost ≫ writes × extra_write_cost (read vs write amplification)."
        },
        {
          "label": "Map-Reduce",
          "kind": "method",
          "body": "Parallel batch over big data: Map (per-node f → intermediate (key,value)) → Shuffle (group by key) → Reduce (aggregate per key). Scalable, fault-tolerant, simple model. Google→Hadoop→Spark (in-memory DAGs) → Flink/Beam (streaming+batch).",
          "cond": "High latency (shuffle I/O) — NOT for online queries; inefficient for iterative ML/graph. Use streaming for real-time."
        }
      ]
    },
    {
      "title": "Security",
      "hint": "Threshold defense / defense in depth: threat → mechanism → location.",
      "entries": [
        {
          "label": "Threshold defense",
          "kind": "def",
          "body": "Security is not absolute defense — it's raising the attack cost until a rational adversary picks another target. Investment proportional to the nature of the data (sensitivity, regulation, exposure cost).",
          "note": "'A company's most important asset is its users' information.'"
        },
        {
          "label": "Defense in depth",
          "kind": "method",
          "body": "Layered defense, each layer catching a class of attack: Internet →(HTTPS)→ WAF → LB/reverse proxy (TLS termination, rate-limit) → Backend (MFA on critical login, input sanitization) → DB encrypted at-rest. If one fails, the others hold.",
          "note": "Attacker must break several layers → multiplies cost/time."
        },
        {
          "label": "WAF",
          "kind": "def",
          "body": "Layer-7 firewall inspecting HTTP/S before the backend: filters SQLi/XSS/path-traversal, rate limiting, geo-blocking (OWASP CRS). Place it as far out as possible — before the LB.",
          "cond": "Threat: DDoS, abusive scraping, malicious payloads. Adds ~1-10ms (Security↔Performance, usually negligible)."
        },
        {
          "label": "MFA",
          "kind": "def",
          "body": "Authentication with ≥2 factors of different nature (know / have / are). Stealing the password no longer suffices.",
          "cond": "Threat: stolen credentials. Apply on sensitive ops (login, credential change, transfers) — not everywhere (Security↔Usability friction)."
        },
        {
          "label": "Input sanitization",
          "kind": "def",
          "body": "Validate and normalize all external input: allow-list + escaping/parametrization (prepared statements). 'Never trust user input' — at every layer receiving external input.",
          "cond": "Threat: injection (SQLi, XSS, command/LDAP/XXE). Defense in depth: sanitized DB survives a new frontend vuln."
        },
        {
          "label": "At-rest encryption + VPN/segmentation",
          "kind": "def",
          "body": "At-rest: data ciphered on disk, key in a separate KMS/HSM/vault (TDE or column-level); complement with in-transit TLS. VPN: encrypted tunnel for trusted internal systems/providers, segmenting public/private/external zones.",
          "note": "Moving Ops to its own infra (own Back+DB) behind VPN cuts the blast radius — a public-SPA compromise can't reach Ops."
        },
        {
          "label": "OWASP-aligned review",
          "kind": "method",
          "body": "Broken access control (server-side authz every request); cryptographic failures (secrets in vault, TLS, no plaintext PII); injection; insecure design (threat model, trust boundaries); misconfiguration; vulnerable components (SCA in CI); auth failures (brute-force protection, MFA); integrity (signed artifacts, SBOM); logging/monitoring; SSRF (allow-list outbound)."
        }
      ]
    },
    {
      "title": "Integration, SOA, microservices",
      "hint": "The evolutionary ladder of exposing business capability; SOA/ESB vs microservices.",
      "entries": [
        {
          "label": "Systems integration (EAI)",
          "kind": "def",
          "body": "Making distinct apps work together. Not fashions that replace each other but an evolutionary ladder along three axes: greater business ownership, greater decoupling, broader audience. Stop at the rung the business driver demands.",
          "note": "Point-to-point = O(N²) 'spaghetti' coupling → motivates a hub."
        },
        {
          "label": "ESB (Enterprise Service Bus)",
          "kind": "def",
          "body": "Central middleware (hub-and-spoke): systems connect via Adapters instead of each other (N links vs N²). Does canonical integration (data translation, routing, composition) + adaptation. Backbone of SOA.",
          "cond": "Risk: bottleneck, single point of failure, 'integration monolith' if too much logic concentrates ('smart endpoints, dumb pipes' is the microservices reply)."
        },
        {
          "label": "SOA",
          "kind": "def",
          "body": "Style exposing business functionality as reusable services over an ESB; driver order: integration first, then governance. Service granularity: fine-grained (building blocks) vs coarse-grained (composed). Still the most common enterprise integration model.",
          "cond": "Limits scalability, fault tolerance, rapid/frequent deployment → that limit pushes toward microservices."
        },
        {
          "label": "Microservices",
          "kind": "def",
          "body": "Small, autonomous, independently-deployable services, each owning its domain and data. Driver: let the org grow and move FAST (time-to-market, frequent deploys, independent scale) — a different motivation than SOA, not 'SOA improved'.",
          "cond": "Needs autonomous teams + DevOps/CD (Conway). Without them → distributed monolith (worst of both worlds). Over-engineering for small orgs/simple domains."
        },
        {
          "label": "DORA justification",
          "kind": "example",
          "body": "High vs low IT performers: deployment frequency 46×, lead time for changes 440×, MTTR 24×. The quantitative case for the microservices+DevOps triangle.",
          "note": "2017 State of DevOps (Puppet + DORA)."
        },
        {
          "label": "Service decomposition",
          "kind": "method",
          "body": "Hardest part — bad cuts give chatty, coupled services. Decompose by business capability (what the org does — stable) or by subdomain (DDD, bounded context). Aim: high cohesion, low coupling, minimal cross-service transactions, mappable to autonomous teams (Conway).",
          "note": "BIAN = pre-built capability map for banking."
        },
        {
          "label": "Orchestration vs Choreography",
          "kind": "def",
          "body": "Orchestration: a central coordinator directs the sequence (visible, higher coupling, single point of failure). Choreography: each service reacts to events and publishes its own (decoupled, autonomous, low visibility). Same axis: control/visibility vs decoupling/autonomy.",
          "note": "Sagas implement either form."
        }
      ]
    },
    {
      "title": "Microservices patterns",
      "hint": "Data ownership, distributed transactions, queries, edge, resilience, deployment.",
      "entries": [
        {
          "label": "Aggregate (DDD)",
          "kind": "def",
          "body": "A graph of objects treated as one consistency unit, accessed via its aggregate root. Defines the transactional consistency boundary — a local transaction modifies ONE aggregate atomically. Good aggregate design makes decomposition viable.",
          "note": "Only current state, no history → impedance + tedious audit (what event sourcing fixes)."
        },
        {
          "label": "Database per Service",
          "kind": "def",
          "body": "Each service exclusively owns its DB (autonomy, polyglot persistence) vs Shared DB (easy ACID but noisy neighbours + schema coupling). Default for true microservices — consistency between services becomes eventual (CAP).",
          "cond": "Breaks cross-service ACID (→ sagas) and JOINs (→ API composition / CQRS)."
        },
        {
          "label": "Saga pattern",
          "kind": "method",
          "body": "Sequence of local transactions; each commits in its service's DB and publishes an event triggering the next. On failure, run compensating transactions in reverse order. Replaces 2PC (which blocks resources and scales poorly).",
          "cond": "Eventual consistency, no distributed locks; compensations must be semantic (a sent email can't be unsent). Step order matters."
        },
        {
          "label": "CQRS",
          "kind": "def",
          "body": "Separate command (writes) from query (reads). Materialize a read-only view DB, kept fresh by subscribing to domain events — enables complex cross-service queries without coupling writers; scales reads/writes separately.",
          "cond": "Eventual consistency (view lags writes) + sync complexity. Over-engineering if queries fit one service."
        },
        {
          "label": "Event Sourcing",
          "kind": "def",
          "body": "Persist the sequence of domain events (not current state); reconstruct state by replaying them (snapshots avoid full replay). Gives full history, free audit, system independence — at higher development cost.",
          "note": "Pairs naturally with CQRS and sagas; conceptual kin of prevalence (WAL + snapshots)."
        },
        {
          "label": "API Gateway & BFF",
          "kind": "def",
          "body": "API Gateway = single edge entry: routing, API composition, protocol translation, cross-cutting (auth, rate limit, caching, metrics). BFF = one gateway per client type (web/mobile/3rd-party) — tailored APIs, avoids over/under-fetching.",
          "cond": "Gateway ≠ ESB (edge, lightweight, toward consumers; logic stays in services). Risk: bottleneck / mini-monolith if it accretes business logic."
        },
        {
          "label": "Circuit Breaker",
          "kind": "def",
          "body": "After timeouts+retries, prevents the retry snowball (cascading failure) by cutting calls to a failing service so it can recover. States: Closed (pass, count failures) → Open (fail-fast with fallback) → Half-open (probe, then re-close or re-open).",
          "note": "Implement at app level (Resilience4j/Hystrix) or service mesh. Improves MTTR; fallback design is as important as the breaker."
        },
        {
          "label": "Service Mesh (sidecar)",
          "kind": "def",
          "body": "Dedicated infra layer managing service-to-service traffic without touching code. Sidecar proxy per instance (data plane) + central control plane: resilience (timeouts/retries/circuit breaking), mTLS, observability (tracing), traffic management (canary, A/B).",
          "cond": "Adds latency (two proxies per hop) + operational complexity — over-engineering at small scale. Istio, Linkerd."
        },
        {
          "label": "Deployment evolution",
          "kind": "def",
          "body": "Physical machine → VM (EC2, 2006, strong isolation, heavy) → Container (Docker, 2013, lightweight, dense, same image dev→prod) → Kubernetes (orchestration: resource mgmt, scheduling, self-healing) → Serverless/FaaS (Lambda, 2014, no machine, auto-scale, pay-per-use).",
          "cond": "Trade-off control vs managed, isolation vs density, portability vs lock-in. Serverless: perf limits, no long processes, vendor lock-in."
        }
      ]
    },
    {
      "title": "Exam method & anti-patterns",
      "hint": "How to structure an exam answer; the disqualifying mistakes ('2 automático').",
      "entries": [
        {
          "label": "Minimum exam answer structure",
          "kind": "method",
          "body": "(1) ≥2 trade-offs — one attribute-vs-attribute (e.g. Security vs Usability) and one cost-vs-time (e.g. hosting); (2) architecture diagram (components + connectors); (3) explanation of each component's responsibility and placement; (4) concrete scenarios with verifiable metrics (S-S-E-A-R-Measure).",
          "note": "These are exactly ADD's canonical outputs — a missing one means an incomplete answer."
        },
        {
          "label": "Disqualifying anti-patterns",
          "kind": "caution",
          "body": "Auto-fail mistakes: (1) queues used as request-response (a queue is async by definition); (2) horizontal scaling with no Load Balancer (the LB is constituent, not optional); (3) caching freshness-sensitive data without TTL/invalidation policy; (4) forgetting external systems (each is a failure mode + SLA); (5) using OLAP DBs for transactional work.",
          "note": "They reveal a broken grasp of the ADD mental model, not just lost points."
        },
        {
          "label": "Hosting & data residency",
          "kind": "method",
          "body": "Where the system physically lives — three criteria: regulatory (data residency laws, e.g. South Korea, GDPR — illegal to ignore), cost (3-year estimate incl. staff/elasticity — cloud vs on-prem/colocation), latency (geography is fixed; AR→São Paulo ~25-40ms vs AR→Virginia ~130-160ms).",
          "note": "'On-premise' often really means colocation (own hardware, rented space/power)."
        },
        {
          "label": "Operational definition of risk",
          "kind": "def",
          "body": "If a situation is possible and probable, and the architecture does not resolve it → it is a risk. Structurally: (probability × impact) AND NOT covered_by_architecture ⇒ risk.",
          "note": "Distinguish from a current problem; invoke explicitly in the 'risks' part of an exam."
        },
        {
          "label": "Cache invariants to document",
          "kind": "method",
          "body": "Minimum for a cache decision: TTL or invalidation rule (event/write/manual); coherence policy (cache-aside, write-through, write-behind, refresh-ahead); visibility of stale reads. Rarely cache: balances, ACLs/permissions, live-auction prices, critical medical data.",
          "note": "Karlton: 'cache invalidation and naming things' are the two hard problems."
        },
        {
          "label": "Architecture katas",
          "kind": "example",
          "body": "Deliberate-practice exercises: given a domain + constraints + stakeholders, propose a justified architecture and defend it. No single correct answer — trains deciding under uncertainty with explicit trade-offs. Build context first, list alternatives, build a utility tree, identify sensitivity/tradeoff points, write as ADR.",
          "note": "The course's pedagogical vehicle (Neal Ford); exam cases are katas in evaluation form."
        }
      ]
    }
  ]
};
