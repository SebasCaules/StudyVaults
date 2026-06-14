---
title: Inge2 Wiki Index
type: index
updated: 2026-05-29
---

# Inge2 Wiki — Índice

Catálogo completo del wiki de **Ingeniería de Software II (ITBA, 2026-1C)**. Organizado por categoría. Cada entrada incluye una descripción rica para facilitar la búsqueda semántica.

> **Convención:** las entradas se leen como *"mirá acá si estás buscando X"*. Si algo no aparece, probablemente vaya como update de una página existente antes que como página nueva. Ver reglas completas en `CLAUDE.md` (raíz del vault).

---

## 🎓 Clases

Resúmenes clase por clase, ordenados cronológicamente. Cada página sigue el template de `class` definido en el schema: TL;DR, mapa conceptual, desarrollo, decisiones clave, ejemplos, preguntas de parcial, lecturas complementarias.

> **Nota sobre numeración del wiki:** la numeración del wiki refleja el **orden cronológico real de exposición** en la cátedra, derivado de las hand-notes del alumno (2026-05-12). Esto NO coincide siempre con los filenames `Clase N.pdf` que la cátedra distribuye — esos slide decks se ordenan por tema, no por fecha. Por ejemplo, el deck `Clase 3.pdf` cubre Documentación pero se expuso el 2026-04-16 (Clase 5 cronológica). Los folders de `raw/classes/` están organizados por fecha (no por número del deck) y son inmutables. Cada página wiki cita ambos paths como sources.

- [[Clase 0 — Introducción al curso]] — docentes, evaluación (70% parcial + 30% TP), Katas de Arquitectura como vehículo pedagógico, dinámica del cuatrimestre. (2026-03-05)
- [[Clase 1 — Introducción a Arquitectura]] — definiciones (Kruchten/Booch/Bittner/BCK), "decisiones significativas", [[Architecture Business Cycle]], [[Atributos de calidad]] ISO 25000, [[Cono de incertidumbre]], cuantificación con [[SLA, SLO, SLI]] y [[MTBF y MTTR]]. (2026-03-12)
- [[Clase 2 — Construcción de la arquitectura]] — [[Attribute Driven Design]] (5 pasos), trade-offs canónicos (Security/Usability, Performance/Maintainability, Availability/Consistency, CAP), catálogo de [[Estilos arquitectónicos]] (dataflow, distributed, interactive, event-based). (2026-03-19)
- [[Clase 3 — Ejercicio en clase: ADD aplicado a e-commerce]] — kata en vivo aplicando [[Attribute Driven Design]] sobre dominio de e-commerce con procesadores de pago externos; top-4 atributos (Security/Availability/Scalability/Interoperability); primer encuentro con OLTP vs OLAP. Ver [[Ejercicio en clase — ADD aplicado a e-commerce]] para el desarrollo del ejercicio. (2026-03-26)
- [[Clase 4 — ¿Cuándo diseñamos?]] — [[BDUF vs YAGNI vs JEDUF]], [[Emergent vs Intentional Design]], [[Architectural Guardrails]], [[Platform Engineering]], [[SAAM]]/[[ATAM]]/[[Lightweight ATAM]], [[Árbol de utilidad]], IWKWYSI; entrega kata [[Caso Healthcare.gov]]; video Residuality Theory; ejercicio Parcial 2013 desarrollado en pizarra. (2026-04-09; saltó 2026-04-02 por feriado)
- [[Clase 5 — Documentación de arquitecturas]] — propósitos de documentar (entender/validar/criticar/proponer/implementar), [[Modelo 4+1]] (Kruchten), [[C4 Model]] (Brown), enfoque híbrido, nivel mínimo necesario. (2026-04-16)
- [[Clase 6 — Persistencia]] — archivos / [[Prevalencia]] / [[Bases de datos relacionales]] (OLTP) / [[OLAP y ETL]] / [[Bases de datos de objetos]] / [[ORM e impedancia objeto-relacional]] / [[Replicación de BD]] (P-S, P-P) / [[Teorema CAP]] / [[Sharding]] / [[Bases no relacionales]] (columnar, KV, documentos) / [[Map-Reduce]] / [[Principio de localidad]]. (2026-04-23, parte teórica)
- [[Clase 6 — Big Data en tiempo real (Twitter)]] — caso integrador via [[Kallen — Big Data in Real-Time at Twitter (QCon 2010)|deck de Kallen]]: Tweets, Timelines, Social graphs, Search indices; principios [[Partition, Replicate, Index]], [[Off-line vs Online computation]], [[Memory hierarchy]]. (2026-04-23, parte aplicada — mismo día que Persistencia)
- [[Clase 7 — Caso Compraventa de Acciones]] — kata integral aplicando [[Attribute Driven Design|ADD]] iterativamente sobre el caso de mercado de acciones; ranking Security/Availability/Performance/Scalability; [[Mecanismos de seguridad|mecanismos de seguridad]] (WAF, MFA, sanitización, encriptación at-rest, VPN, reverse proxy); diseño iterativo por atributo. (2026-05-07)
- [[Clase 8 — Consultas pre-parcial]] — estructura mínima de respuesta de parcial (2 trade-offs + diagrama + componentes + escenarios); catálogo de **anti-patrones que dan 2 automático** ([[Anti-patrones de parcial]]); criterios de hosting con data residency ([[Criterios de hosting y data residency]]); refinamientos de Availability vs Reliability, Interoperability vs Fault Tolerance, Manageability, Customizability, Auditability arquitectónico; definición operativa de riesgo. (2026-05-14)
- [[Clase 9 — Integración de Sistemas / SOA / Microservicios]] — evolución de la integración (point-to-point → [[ESB — Enterprise Service Bus|ESB]] → [[SOA — Service-Oriented Architecture|SOA]] → API+[[Microservicios]]) como escalera de exposición de funcionalidades de negocio; pivote SOA (integración+gobernanza) vs microservicios (velocidad), triángulo arquitectura/organización/procesos, métricas DORA; catálogo de patrones de Richardson ([[Patrón Saga|Saga]], [[CQRS — Command Query Responsibility Segregation|CQRS]], [[Event Sourcing]], [[API Gateway]], [[Circuit Breaker]], [[Service Mesh]]…). Deck `Clase 6.pdf`. (2026-05-28, primera post-parcial)

---

## 🧩 Conceptos — Principios de diseño

Ideas atemporales sobre cómo se diseña bien: cohesión, acoplamiento, SOLID, GRASP, DRY, YAGNI, localidad. La mayoría de estos principios son **criterios**, no recetas: sirven para evaluar alternativas.

- [[BDUF vs YAGNI vs JEDUF]] — tres posturas sobre cuánto diseñar antes de codear; por qué la cátedra defiende JEDUF.
- [[Emergent vs Intentional Design]] — arquitectura que surge del refactoring vs arquitectura definida deliberadamente; por qué emergent requiere disciplina intentional.
- [[Cono de incertidumbre]] — Boehm/McConnell: por qué estimaciones al inicio pueden errar 4x/0.25x, y qué implicancia tiene para decisiones arquitectónicas.
- [[Principio de localidad]] — espacial y temporal; co-ubicar lo que se accede junto. Heredado de la jerarquía de memoria; rige sharding, caches y placement de datos.
- [[Memory hierarchy]] — de registros a tape: cada capa 10-100× más lenta. Decidir qué dato vive en qué capa es arquitectónico. *"Disk is for writes only"* (Kallen).
- [[Partition, Replicate, Index]] — el mantra de Kallen: toda solución de escalabilidad combina estos tres mecanismos. No hay magia.
- [[Off-line vs Online computation]] — cuándo precomputar (queries bounded + patrón limitado) y cuándo computar online (set algebra, queries ad-hoc).
- [[ADR — Architecture Decision Record]] — Nygard: documentar decisiones arquitectónicas con contexto + alternativas + consecuencias. La forma estándar de conservar el "porqué" de la arquitectura.
- [[Golden Paths]] — caminos felices pre-construidos para tareas de desarrollo comunes. Materializan los [[Architectural Guardrails]] como herramienta consumible. Hermano de Single Pane of Glass.
- [[Katas de Arquitectura]] — ejercicios de práctica deliberada sobre escenarios de diseño. El vehículo pedagógico central de la cátedra Inge2.

---

## 🏛️ Conceptos — Arquitectura

Estilos arquitectónicos, patrones arquitectónicos, atributos de calidad, ADRs, vistas, evaluación.

- [[Arquitectura de software — definición]] — definiciones convergentes (Kruchten, Booch, Bittner, BCK) y la palabra clave "significativas"; qué es y qué no es arquitectónico.
- [[Architecture Business Cycle]] — modelo ABC de Bass/Clements/Kazman: cómo stakeholders, development org, tech environment y architect experience moldean la arquitectura.
- [[Attribute Driven Design]] — método ADD de 5 pasos para construir arquitectura a partir de drivers (functional + quality attributes + restrictions).
- [[Atributos de calidad]] — taxonomía ISO 25000/25010: Run-time (Availability, Performance, Scalability, Security…), Design (Maintainability, Portability), System, User. Cuantificación y trade-offs.
- [[Estilos arquitectónicos]] — catálogo POSA: dataflow (Pipes&Filters, Layers), distributed (Broker, Pub-Sub), interactive (MVC/MVP/MVVM), event-based (SEP/STREP/CEP/OLEP).
- [[Modelo 4+1]] — Kruchten: vistas Lógica/Proceso/Desarrollo/Física + Escenarios.
- [[C4 Model]] — Brown: niveles Context/Containers/Components/Code como zoom progresivo.
- [[SAAM]] — primer método formal de evaluación (1993), basado en escenarios directos/indirectos.
- [[ATAM]] — método gold-standard de evaluación (SEI 2000): 4 fases, 9 pasos, identifica sensitivity points y tradeoffs.
- [[Lightweight ATAM]] — versión comprimida a 1-2 días para equipos pequeños.
- [[Árbol de utilidad]] — estructura para conectar valor abstracto con escenarios concretos priorizados por (importancia, dificultad).
- [[Architectural Guardrails]] — reglas organizacionales que encauzan sin dictar; punto medio entre prescriptivo y laissez-faire.
- [[Platform Engineering]] — disciplina que construye IDPs (Internal Developer Platforms) con Golden Paths y Single Pane of Glass.
- [[Teorema CAP]] — Brewer: Consistencia, Disponibilidad, Tolerancia a partición — elegir 2 (o más bien, elegir entre C y A durante una partición). Eje canónico de toda BD distribuida.
- [[Mecanismos de seguridad]] — catálogo de mecanismos arquitectónicos para el atributo Security: WAF, MFA, sanitización, encriptación at-rest, reverse proxy, VPN, defense in depth. Filosofía *threshold defense*.
- [[Integración de sistemas]] — evolución de la integración corporativa (point-to-point → hub/ESB → SOA → API/microservicios) como escalera de exposición de funcionalidades de negocio; matriz 3×3 de estrategias.
- [[SOA — Service-Oriented Architecture]] — estilo de integración por servicios reutilizables sobre un ESB; granularidad fino/grueso, governance, modelo canónico. Driver: integración + gobernanza. El modelo más usado para integrar apps corporativas.
- [[ESB — Enterprise Service Bus]] — bus central de integración con adapters (data translation, routing, composition); resuelve el espagueti point-to-point pero puede volverse cuello de botella. Columna vertebral de SOA.
- [[Microservicios]] — servicios pequeños, autónomos, desplegables independientes; driver = velocidad/crecimiento; triángulo arquitectura/organización/procesos (Conway), métricas DORA, desventajas de sistema distribuido y cuándo es over-engineering.
- [[Service Mesh]] — capa de infra (sidecar) que gestiona comunicación servicio-a-servicio sin tocar código: mTLS, resiliencia, observabilidad, traffic management. **Tema del [[TPE 2026-1C — Investigación y presentación de un tema|TPE]]**. Istio/Linkerd.
- [[Evolución del deployment — VM, Containers, Kubernetes, Serverless]] — cómo se empaqueta y ejecuta un servicio: físico → VM (EC2) → Container (Docker) → Serverless (Lambda); Kubernetes como orquestador; trade-offs control/lock-in/densidad.

---

## 💾 Conceptos — Persistencia y datos

Decisiones sobre cómo y dónde guardar datos: archivos, BDs relacionales, no relacionales, replicación, sharding, caches, ORMs, jerarquías de memoria.

- [[Persistencia]] — definición, criterios (performance, transformación, tolerancia a fallos), taxonomía completa.
- [[Prevalencia]] — patrón in-memory + WAL + snapshots (Prevayler/Madeleine/Bamboo). Performance enorme, dataset bounded.
- [[Bases de datos relacionales]] — RDBMS / OLTP / álgebra relacional / ACID / normalización; escalabilidad y workarounds (sharding, JSON blobs, tablas-como-columnas).
- [[OLAP y ETL]] — reporting analítico: desnormalizado, append-only, agregaciones precalculadas; populado por ETL/ELT desde OLTP.
- [[Bases de datos de objetos]] — OODBMS: herencia y polimorfismo nativos; nicho moderno (perdió contra RDBMS+ORM).
- [[ORM e impedancia objeto-relacional]] — el choque modelo objetos ↔ tuplas; patrones GoF/Fowler (Active Record, Data Mapper, Repository, Unit of Work).
- [[Replicación de BD]] — Primary-Replica vs Multi-Master; sincrónica vs asincrónica; trade-offs O(N²); failover.
- [[Sharding]] — partir el dataset en N copias estructuralmente iguales con datos disjuntos. El shard key es decisión arquitectónica clave.
- [[Bases no relacionales]] — NoSQL umbrella: columnares (Cassandra, BigTable), KV (Redis, DynamoDB), documentos (MongoDB, ElasticSearch).
- [[Map-Reduce]] — patrón funcional para procesar grandes volúmenes distribuidos. Bueno para batch; no para queries online.

---

## 🔨 Conceptos — Patrones de diseño

Patrones GoF (creational, structural, behavioral), patrones de enterprise (Fowler PoEAA), patrones concurrentes y, sobre todo, los **patrones de microservicios** (catálogo de Richardson, microservices.io) introducidos en [[Clase 9 — Integración de Sistemas / SOA / Microservicios|Clase 9]].

**Application / Data patterns:**
- [[Descomposición en microservicios]] — dónde cortar el sistema: por business capability o por subdominio (DDD); ejemplo financiero BIAN.
- [[Aggregate (DDD)]] — grafo de objetos tratado como unidad de consistencia; aggregate root; frontera transaccional de un servicio.
- [[Database per Service]] — cada servicio dueño de su base (autonomía) vs base compartida (transaccionalidad fácil pero noisy neighbours).
- [[Patrón Saga]] — secuencia de transacciones locales + compensaciones; reemplazo del 2PC; consistencia eventual; el orden importa.
- [[CQRS — Command Query Responsibility Segregation]] — separar lecturas de escrituras con una view-DB read-only alimentada por eventos; consultas cross-servicio.
- [[Event Sourcing]] — persistir la historia como secuencia de eventos en vez del estado actual; auditoría e historia gratis, a mayor costo de desarrollo.

**Communication patterns:**
- [[API Gateway]] — punto de entrada único; ruteo, composición, traducción de protocolo, auth/rate-limit/caching en el borde.
- [[Backend for Frontend (BFF)]] — un backend de borde por tipo de cliente; evita overfetching, localización, versionado por cliente.
- [[Circuit Breaker]] — corta el efecto bola de nieve ante fallas; estados closed/open/half-open; a nivel app o service mesh.
- [[Orquestación vs Coreografía]] — coordinar la composición con un director central (orquestación) o por reacción a eventos (coreografía); eje control vs desacoplamiento.

*(Patrones GoF y enterprise de persistencia (Active Record, Data Mapper, Repository, Unit of Work) viven en [[ORM e impedancia objeto-relacional]]; agregar páginas dedicadas a medida que aparezcan en clases.)*

---

## 📐 Conceptos — Proceso, calidad, evolución

DDD estratégico (bounded contexts, context mapping, ubiquitous language) y táctico (aggregates, value objects, domain events). TDD, refactoring, CI/CD, code review, métricas de calidad, deuda técnica, estimación, riesgo.

- [[SLA, SLO, SLI]] — tríada de Google SRE para compromisos operacionales cuantitativos; error budget como moneda de negociación velocidad/estabilidad.
- [[MTBF y MTTR]] — métricas clásicas de reliability y recuperabilidad; fórmula de availability y cómo cada una se mejora arquitectónicamente.
- [[Anti-patrones de parcial]] — catálogo curado por la cátedra de errores que **descalifican** ("2 automático"): cola como request-response, escalado horizontal sin LB, cache sin invalidación, olvidarse sistemas externos, OLAP para transaccional. Originado en [[Clase 8 — Consultas pre-parcial]].
- [[Criterios de hosting y data residency]] — decisión arquitectónica de dónde vive el sistema (cloud / on-prem / colocation). Tres criterios: marco regulatorio (data residency), costos (trade-off costos vs tiempo), latencia. Originado en [[Clase 8 — Consultas pre-parcial]].
- [[BPM y BAM]] — Business Process Management (definir/mejorar procesos con BPMN/BPEL) y Business Activity Monitoring (monitorearlos en tiempo real con umbrales y notificaciones); piezas de [[SOA — Service-Oriented Architecture|SOA]].

---

## 📝 Ejercicios

Ejercicios de la cátedra resueltos con justificación. Cada página incluye el enunciado literal, el desarrollo paso a paso, las decisiones tomadas y sus trade-offs, y variantes ("¿qué pasaría si…?") para profundizar.

- [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]] — ejercicio de parcial clásico: stakeholders, atributos, árbol de utilidad, arquitectura pipes+filters/pub-sub con sensores serie, riesgos. **Arquitectura del pizarrón (clase 2026-04-09)** con Daemon, Pollers redundantes + heartbeat, Processor, Alarma, Producer-Consumer y Webapp MVC.
- [[Ejercicio en clase — ADD aplicado a e-commerce]] — ejercicio tipo parcial trabajado en pizarra (2026-03-26): selección de 4 atributos (Security/Availability/Scalability/Interoperability), diagrama de entidades externas (procesadores de pago, tablets, depósito), introducción a OLTP vs OLAP. Aplicación práctica del método de [[Attribute Driven Design]].
- [[Enunciados de parciales — 6 casos]] — banco de casos: Bibliotecas Nacionales, Compraventa Acciones, Logística, CMS, PDV electrodomésticos, Sistema Integral de Atención.
- [[Cross challenge — 3 casos]] — Banco/minitiendas PYME, Turismo empresarial, Seguros autos — pensados para comparar decisiones divergentes entre equipos.
- [[TP general]] — Trabajo práctico integrador: Sistema de Administración de Cuentas + satélites (Cartilla Online, Red de Compensación Bancaria, Sistema Tintométrico, Gestor de Documentos P2P).
- [[TPE 2026-1C — Investigación y presentación de un tema]] — consigna del Trabajo Práctico Especial: investigar+exponer (15 min estrictos) un tema del catálogo con la lente negocio+atributos de calidad. Tracks técnico (DSL, K6, IaC, Airflow) y funcional (Service Mesh, Multi Cloud, Platform Engineering, Staging Environments); asignación FIFO por mail; entrega 10/6, oral 11/6.

---

## 🧪 Casos de estudio

Escenarios realistas de diseño construidos para practicar las decisiones que el curso enseña a tomar. Cada caso plantea un dominio, restricciones y stakeholders, presenta el problema como una decisión a tomar, y guía con preguntas antes de recomendar.

- [[Caso Healthcare.gov]] — lanzamiento fallido del Federal Marketplace (oct 2013); ATAM post-mortem; 10 lecciones aprendidas del reporte OEI. Trabajado en [[Clase 4 — ¿Cuándo diseñamos?]].
- [[Caso Twitter — Big Data en tiempo real]] — los 4 sub-problemas de Twitter (Tweets, Timelines, Social graphs, Search indices) circa 2010; cómo cada uno requiere combinación distinta de partition/replicate/index. Trabajado en [[Clase 6 — Big Data en tiempo real (Twitter)]].
- [[Caso Compraventa de Acciones]] — mercado electrónico de acciones; kata integral de [[Attribute Driven Design|ADD]] con Security como atributo #1; iteración por atributo; *threshold defense*. Trabajado en [[Clase 7 — Caso Compraventa de Acciones]].

### Banco de casos mock de parcial

Casos **sintéticos** (no históricos) curados por el wiki, con la misma estructura y nivel de detalle que los reales. Alimentan el generador de casos mock en la página de estudio (`study/js/tools/case-simulator.js`).

- [[Banco de casos mock de parcial]] — índice y reglas del banco; tabla cruzada con los casos reales hermanos; convenciones de sorteo y persistencia.
- [[Caso mock — Plataforma de telemedicina interregional]] — red de telemedicina interprovincial con HCE FHIR; ejercita bounded contexts, separación plano de control vs plano de datos, MFA selectiva, defense in depth en salud.
- [[Caso mock — Sistema nacional de voto electrónico]] — voto electrónico presencial híbrido con auditoría pública verificable; ejercita verifiability, anonimato vs auditability, E2E-V, air-gap, defense in depth adversarial.
- [[Caso mock — Plataforma de streaming de video on-demand]] — streaming OTT regional con CDN multi-vendor y recomendaciones; ejercita [[Partition, Replicate, Index]], [[Off-line vs Online computation|off-line precompute]] y [[Memory hierarchy]] sobre dominio distinto a Twitter.
- [[Caso mock — Plataforma de monitoreo de smart city]] — sensores IoT urbanos heterogéneos con CEP, time-series y datos abiertos; ejercita event-driven, polyglot persistence, privacy by design.
- [[Caso mock — Plataforma de subastas en tiempo real]] — order book live con anti-sniping y settlement asincrónico; ejercita CP CAP, event sourcing, in-memory + WAL, *Fairness* como atributo de calidad.
- [[Caso mock — Logística de última milla a escala]] — marketplace asset-light de gig workers en hipergrowth; ejercita bounded contexts antes que microservicios, OLTP/OLAP separados, auto-scaling temporal.

---

## 📖 Sources — Material original ingerido

Resúmenes de cada reading ingerido (paper, capítulo de libro, artículo, video). El documento original es inmutable en `raw/`; acá vive su destilado con los takeaways que importan para la cursada.

- [[OEI-06-14-00350 — HealthCare.gov Case Study (HHS OIG)]] — reporte oficial (~92pp, 2016) del HHS Office of Inspector General sobre el lanzamiento de Healthcare.gov.
- [[Atributos de Calidad — tabla ISO 25000 (cátedra)]] — handout con la tabla de atributos ISO 25000/25010 que usa la cátedra: Run-time, Design, System, User qualities con sus definiciones operativas.
- [[Kallen — Big Data in Real-Time at Twitter (QCon 2010)]] — slide deck (71 slides) de Nick Kallen en QCon SF 2010; recorre los 4 sub-problemas de datos de Twitter (Tweets, Timelines, Social graphs, Search indices) con números reales y principios universales de escalabilidad.
- [[Cheat Sheet Inge II — Bucket de soluciones por atributo de calidad]] — cheat sheet de alumno (2026-05-20) que cataloga mecanismos arquitectónicos por atributo de calidad y mapea problema→solución; derivado del corpus de la cursada, no introduce conceptos nuevos.

---

## 🔍 Analyses — Síntesis y comparaciones

Comparaciones transversales, deep dives y respuestas sustanciales a preguntas del alumno que vale la pena retener. Ejemplo: *"Clean Architecture vs Hexagonal Architecture vs DDD táctico — ¿qué resuelve cada una?"*.

- [[Cheat Sheet — Guía de estudio pre-parcial]] — destilado de estudio para el parcial (2026-05-20): metodología ADD, bucket completo de mecanismos (hosting, persistencia, frontend, colas, seguridad, autenticación, encryption), mapa problema→solución por atributo de calidad, tradeoffs canónicos, anti-patrones que dan 2 automático, runbook de 7 pasos para resolver el caso bajo presión.
- [[TPE — Apache Airflow (investigación + PoC)]] — companion del **entregable terminado** del grupo para el [[TPE 2026-1C — Investigación y presentación de un tema|TPE]] (repo `raw/TPE/AirflowDemo/`): resume la presentación de 13 diapositivas (problema de negocio, arquitectura scheduler/executor/metadata-db, atributos de calidad ADD con sus trade-offs, comparativa cron/NiFi/Prefect/Dagster) y la demo ejecutable `reporte_ventas_diario` (DAG de 6 tasks en Docker, con variantes de fallo-recuperable y fail-fast), más el checklist de presentación.
