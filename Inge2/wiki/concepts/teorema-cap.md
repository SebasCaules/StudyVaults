---
title: Teorema CAP
aliases:
  - "Teorema CAP"
  - "CAP"
  - "Brewer"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [cap, brewer, consistencia, disponibilidad, particion, sistemas-distribuidos]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
related:
  - "[[Persistencia]]"
  - "[[Replicación de BD]]"
  - "[[Bases no relacionales]]"
  - "[[Atributos de calidad]]"
  - "[[Clase 6 — Persistencia]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
---

# Teorema CAP

## Enunciado

> En un sistema de datos distribuido, ante una **partición de red**, el sistema debe elegir entre **Consistencia** y **Disponibilidad** — no puede ofrecer ambas simultáneamente.
> (Brewer, 2000; demostrado formalmente por Gilbert & Lynch, 2002)

Las tres letras (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Teorema CAP*):

- **C — Consistency**: *"All clients see current data regardless of updates or deletes."* Toda lectura ve la última escritura confirmada (linealizabilidad).
- **A — Availability**: *"The system continues to operate as expected even with node failures."* Toda petición a un nodo sano recibe respuesta (no error, no timeout).
- **P — Partition Tolerance**: *"The system continues to operate as expected despite network or message failures."* El sistema sigue operando aunque la red entre nodos se rompa.

## Cómo leer el "elegir 2 de 3"

La formulación popular *"elegí 2 de 3"* es engañosa. La lectura correcta:

- **P no es opcional** — toda red real eventualmente particiona. Cables se cortan, switches fallan, latencias explotan. Diseñar asumiendo que P no ocurrirá es ingenuo.
- Por lo tanto la elección real es **C vs A durante una partición**:
  - **CP** (consistente + tolerante a partición): durante una partición, las réplicas del lado "minoritario" rechazan operaciones para no divergir del estado consistente. Pierdo disponibilidad. Ejemplos: HBase, MongoDB con majority writes, etcd, Zookeeper.
  - **AP** (disponible + tolerante a partición): durante una partición, todos los nodos siguen aceptando operaciones; al reunificarse, hay que **resolver conflictos**. Pierdo consistencia momentánea. Ejemplos: Cassandra, DynamoDB, CouchDB, Riak.
  - **CA** (consistente + disponible) sólo es posible **sin partición** — sistemas single-node o clusters fuertemente acoplados sin partición tolerable. En la práctica, "CA" es lo que se elige cuando se asume que P no va a ocurrir, lo cual ya vimos que es ingenuo. Los RDBMS clásicos en single-node se ubican aquí.

## PACELC — refinamiento moderno

Daniel Abadi (2010) extiende CAP: durante una partición (**P**), elegís entre Availability o Consistency (**A/C**); **else** (E, en operación normal), elegís entre Latency y Consistency (**L/C**). Cassandra es **PA/EL**: prioriza disponibilidad bajo partición y latencia en operación normal. Spanner es **PC/EC**: prioriza consistencia siempre, a costa de latencia.

## Implicancias arquitectónicas

1. **El RDBMS clásico es C-priorizante** (CP en clusters distribuidos, "CA" en single-node). Eso explica por qué históricamente "BD = consistencia automática": el costo se pagaba en disponibilidad ante partición y en limitación al escalado horizontal.
2. **Las [[Bases no relacionales|bases no relacionales]] son frecuentemente AP-priorizantes** porque nacieron en contextos donde la disponibilidad era el atributo primario (Amazon DynamoDB para el carrito de compras, Cassandra para feeds de Facebook). La pérdida temporal de consistencia se mitiga con **eventual consistency** y mecanismos de reconciliación (last-write-wins, vector clocks, CRDTs).
3. **No hay almuerzo gratis** — toda decisión de persistencia distribuida es una toma de posición sobre CAP, sea explícita o no.

## Relación con [[Atributos de calidad]]

CAP modela un **trade-off canónico** que la cátedra menciona en clase 2 entre los conflictos clásicos:

- Performance vs Maintainability
- Availability vs Consistency ← **éste es CAP**
- Security vs Usability

Ningún ATAM serio sobre un sistema distribuido omite identificar dónde está el sistema en el espectro CP↔AP, y bajo qué escenarios opera de cada lado.

## Decisiones canónicas

| Caso | Recomendación |
|---|---|
| Sistema bancario / transacciones financieras | **CP** — la consistencia es no-negociable, prefiero rechazar transacciones a aceptar saldos divergentes. |
| Carrito de e-commerce | **AP** — Amazon eligió "siempre permitir agregar al carrito"; reconcilia después. |
| Feed de red social / cache de timelines | **AP** — un seguidor menos durante 30s no es un problema; 503 sí lo es. Ver [[Caso Twitter — Big Data en tiempo real]]. |
| Sistema de coordinación (locks, leader election) | **CP** — Zookeeper, etcd. La consistencia ES la razón de existir del componente. |
| Catálogo de productos read-heavy | **AP** con replicas eventuales — ver [[Replicación de BD]] primary-secondary. |

## Pregunta a profundizar

¿Spanner de Google realmente "rompe CAP"? La respuesta corta es no: usa TrueTime + 2PC + Paxos para minimizar la ventana de inconsistencia, pero ante partición sigue siendo CP (rechaza writes en el lado minoritario). ¿Cómo explica Brewer su propio "12 years later" essay?

## Lecturas complementarias

- Brewer, *Towards Robust Distributed Systems* (PODC 2000) — la presentación original.
- Gilbert & Lynch, *Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-tolerant Web Services* (SIGACT 2002) — la prueba formal.
- Brewer, *CAP Twelve Years Later: How the "Rules" Have Changed* (IEEE Computer, 2012).
- Abadi, *Consistency Tradeoffs in Modern Distributed Database System Design* (IEEE Computer, 2012) — PACELC.
