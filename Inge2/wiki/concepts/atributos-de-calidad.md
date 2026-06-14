---
title: Atributos de calidad
aliases:
  - "Atributos de calidad"
  - "Quality attributes"
  - "ISO 25010"
  - "ISO 25000"
type: concept
created: 2026-04-22
updated: 2026-05-15
tags: [atributos-de-calidad, iso-25000, iso-25010, ieee, calidad]
sources:
  - "raw/assets/Atributos de Calidad.pdf"
  - "raw/classes/Clase 1.pdf"
  - "raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md"
related:
  - "[[Arquitectura de software — definición]]"
  - "[[ATAM]]"
  - "[[Árbol de utilidad]]"
  - "[[SLA, SLO, SLI]]"
  - "[[MTBF y MTTR]]"
  - "[[Atributos de Calidad — tabla ISO 25000 (cátedra)]]"
  - "[[Architecture Business Cycle]]"
  - "[[Attribute Driven Design]]"
  - "[[Teorema CAP]]"
  - "[[Clase 1 — Introducción a Arquitectura]]"
  - "[[Clase 2 — Construcción de la arquitectura]]"
  - "[[Clase 7 — Caso Compraventa de Acciones]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Clase 8 — Consultas pre-parcial]]"
  - "[[Anti-patrones de parcial]]"
  - "[[Criterios de hosting y data residency]]"
---

# Atributos de calidad

## Definición

**IEEE:** *"A feature or characteristic that affects an item's quality"*.

Los atributos de calidad son las **propiedades no-funcionales** que caracterizan al sistema. Son la moneda con la que se comparan arquitecturas: decir "esta arquitectura es mejor" sin nombrar un atributo cuantificable es una afirmación vacía (source: raw/classes/Clase 1.pdf).

## Taxonomía ISO 25000 / 25010

La cátedra usa la taxonomía ISO 25000 (source: raw/assets/Atributos de Calidad.pdf):

### Run-time qualities (observables cuando el sistema corre)

| Atributo | Qué mide |
|---|---|
| **Availability** | Proporción de tiempo que el sistema está funcional. |
| **Fault Tolerance** | Capacidad de seguir respondiendo ante fallas de componentes (posiblemente degradado). |
| **Interoperability** | Operar con sistemas externos intercambiando información. |
| **Manageability** | Facilidad para que admins manejen la app (instrumentación, monitoring, debugging). |
| **Customizability** | Capacidad del usuario de personalizar look/comportamiento. |
| **Performance** | Responsividad — ejecutar acciones dentro de un intervalo temporal. |
| **Precision** | Nivel de detalle numérico que el sistema puede alcanzar. |
| **Reliability** | Capacidad de mantenerse operativo en el tiempo. |
| **Scalability** | Manejar incrementos de carga sin impacto en performance (o ser fácil de agrandar). |
| **Auditability** | Poder auditar registros y actividades — testear integridad y seguridad. |
| **Security** | Prevenir acciones maliciosas/accidentales fuera del uso diseñado, evitando disclosure/pérdida de info. |

### Design qualities (visibles en la estructura, no en runtime)

| Atributo | Qué mide |
|---|---|
| **Conceptual Integrity** | Consistencia y coherencia del diseño global. |
| **Maintainability** | Facilidad para modificar el sistema. |
| **Portability** | Capacidad de correr en distintos entornos. |
| **Reusability** | Componentes aptos para ser reutilizados en otros contextos. |

### System qualities

| Atributo | Qué mide |
|---|---|
| **Supportability** | Proveer info útil para diagnosticar fallas. |
| **Testability** | Facilidad para crear criterios de test y ejecutarlos. |

### User qualities

| Atributo | Qué mide |
|---|---|
| **Accessibility** | Que el sistema sea usable por la mayor cantidad posible de personas (a11y). |
| **Usability** | Qué tan bien el sistema cumple las necesidades del usuario — intuitividad y experiencia. |

## Cuantificación — cada atributo necesita métrica

Un atributo sin métrica es una aspiración, no un requisito. Ejemplos (source: raw/classes/Clase 1.pdf):

| Atributo | Métrica típica |
|---|---|
| Availability | % uptime (99.9%, 99.99%, …), ver [[SLA, SLO, SLI]]. |
| Reliability | [[MTBF y MTTR]], failure rate. |
| Performance | Percentiles de latencia (p50, p95, p99), throughput (rps). |
| Scalability | Usuarios concurrentes soportados, throughput a N nodos. |
| Security | CVSS de vulnerabilidades, tiempo a parche, blast radius. |
| Maintainability | Cyclomatic complexity, tiempo promedio de change, % cobertura tests. |
| Testability | % cobertura, ratio de código production:test, flakiness rate. |
| Usability | Task success rate, System Usability Scale (SUS), time-to-task. |

## Cómo se usan en arquitectura

1. **Como drivers de ADD** — cada paso de [[Attribute Driven Design]] parte de un atributo a priorizar.
2. **Como hojas del [[Árbol de utilidad]]** — los escenarios concretos se anclan a un atributo.
3. **Como criterio en [[ATAM]]** — los trade-offs se negocian atributo vs atributo.
4. **Como SLOs contractuales** — cuando son externos, se firman como SLA.

## Distinciones finas refinadas en clase

La [[Clase 8 — Consultas pre-parcial]] dejó explícitas distinciones que se confunden seguido en parciales (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md):

### Availability vs Reliability

- **Availability** mide **proporción de tiempo disponible** en una ventana.
- **Reliability** mide **funcionamiento ininterrumpido** durante una ventana — habla de que el servicio va a funcionar sin cortarse.

**Ejemplo canónico de la cátedra:** un programa que se reinicia cada 1 hora y tarda 1 s en reiniciarse:
- **Es Available** (~99.97% del tiempo).
- **NO es Reliable** (se corta cada hora — se interrumpe).

**Implicancia para ADD:** si el dominio tiene **operaciones largas e ininterrumpibles** (videoconsulta, subasta live, transferencia bancaria multi-paso), el atributo dominante es **Reliability**. Si las operaciones son **stateless y cortas** (un click HTTP), Availability suele alcanzar.

### Interoperability — tiene dos caras

**Interoperability** se evalúa simultáneamente:
- **Como cliente:** qué tan fácil me conecto a otros sistemas.
- **Como servidor:** qué tan fácil hago que otros se conecten a mí.

Esto importa para el diagrama: una arquitectura interoperable suele tener **una capa de adapters / anti-corruption layer por cada lado**.

> **No confundir con Fault Tolerance:** Fault Tolerance es responder ante la **caída** de un componente externo, no ante la **incompatibilidad** del protocolo. Confundirlos lleva a "soluciones" que ni protegen del fallo ni resuelven la integración.

### Manageability — orientado al sysadmin

**Manageability** se evalúa siempre desde el rol del **sysadmin**: tiene que poder entender si la app está funcionando bien o no. Es decir, **salud del sistema** observable.

Métricas típicas: dashboards de salud, alarmas, instrumentación (Prometheus/Grafana/Datadog), **golden signals** (latency, traffic, errors, saturation).

> Sin Manageability operativa, no hay forma de verificar un SLO.

### Customizability — orientado al usuario final

**Customizability** es la capacidad del **usuario final** de personalizar la app (no del sysadmin — eso es Manageability).

Ejemplos: temas claros/oscuros, layouts configurables, idioma, perfiles.

> **No confundir con Usability:** Usability es qué tan bien una UI estándar cumple su tarea; Customizability es la capacidad del usuario de **alterar** esa UI.

### Auditability — implicancia arquitectónica concreta

> **Cuando Auditability es atributo prioritario, los logs deben estar en un storage separado y con un control de acceso distinto** (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md).

Esto es más fuerte que "loguear todo":
- **Separación física/lógica** de los logs respecto a la base operacional.
- **Segregación de credenciales** — quien opera la app no debe poder borrar/alterar los logs de auditoría (**separation of duties**).
- Combinable con append-only stores (event sourcing, WORM storage).

**Para el diagrama del parcial:** el log store aparece como **componente aparte** con su propio control de acceso, no como una tabla en la base operacional. Ver [[Mecanismos de seguridad]].

## Trade-offs típicos

Ningún atributo mejora en el vacío. Algunos ejes canónicos:

- **Security vs Usability** — MFA, timeouts, rotación.
- **Performance vs Maintainability** — cachés, denormalización, código vectorizado.
- **Availability vs Consistency** — teorema CAP.
- **Portability vs Performance** — capas de abstracción.
- **Reusability vs Simplicity** — generalización prematura.
- **Testability vs Deliverability** — tests exhaustivos ralentizan release.

## Pregunta a profundizar

¿Qué tanto de "conceptual integrity" (Brooks, *The Mythical Man-Month*) puede medirse, y qué tanto es un juicio cualitativo? ¿Tiene sentido ponerle métrica?

## Fuentes y lecturas

- ISO/IEC 25010:2011.
- Bass, Clements, Kazman — *Software Architecture in Practice*, cap. 4 ("Understanding Quality Attributes").
- Brooks, *The Mythical Man-Month* — sobre conceptual integrity.
- IEEE Standard Glossary of Software Engineering Terminology.
