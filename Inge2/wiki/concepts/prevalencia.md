---
title: Prevalencia
aliases:
  - "Prevalencia"
  - "Prevalence"
  - "Prevayler pattern"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [prevalencia, patron, persistencia, in-memory, snapshot, write-ahead-log]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
related:
  - "[[Persistencia]]"
  - "[[Clase 6 — Persistencia]]"
  - "[[Bases de datos relacionales]]"
  - "[[ORM e impedancia objeto-relacional]]"
  - "[[OLAP y ETL]]"
  - "[[Bases no relacionales]]"
---

# Prevalencia

## Idea central

> "Los datos se mantienen en memoria en formato nativo. Las transacciones se registran, y se hacen *snapshots* a disco."
> (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Prevalencia*)

La prevalencia es un **patrón de persistencia** —no una tecnología ni una base de datos— donde el estado completo de la aplicación vive en memoria como objetos del lenguaje, y la durabilidad se garantiza con dos mecanismos complementarios:

1. **Command log (write-ahead log)**: cada operación que muta el estado se serializa y escribe en disco *antes* de aplicarse en memoria.
2. **Snapshots periódicos**: cada cierto tiempo se serializa el estado completo a disco. Al arrancar, se restaura el último snapshot y se reaplica el log posterior.

## Implementaciones citadas

(source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf):

- **Prevayler** (Java) — la implementación canónica, de Klaus Wuestefeld (2001).
- **Madeleine** (Ruby).
- **Bamboo** (.NET).

## Trade-offs

| Ventajas | Desventajas |
|---|---|
| **Sin transformación** — los datos se guardan en el formato que los usa el programa; no hay [[ORM e impedancia objeto-relacional|impedancia objeto-relacional]]. | **La aplicación entera debe caber en memoria.** Si el dataset crece más allá de la RAM disponible, no escala. |
| **Alto grado de transparencia** — el código no sabe que persiste; sólo escribe métodos sobre objetos. | **Interoperabilidad pobre** — los datos viven como serialización del lenguaje; otros sistemas no pueden leerlos sin pasar por la aplicación. |
| **Performance "muchísimo más alta"** que cualquier BD —no hay traducción, ni round-trip de red, ni parsing de SQL. | Sin SQL ni queries ad-hoc: todo acceso es navegación por el grafo de objetos. |
| Atomicidad fácil: el log secuencial garantiza orden total de transacciones. | Ningún ecosistema maduro de tooling (BI, replicación, backup gestionado). |

## Cuándo aplica

Casos de uso típicos:

- **Sistemas con dataset acotado** (configuración, reglas de negocio, índices secundarios pequeños) que cambian frecuentemente y se leen mucho.
- **Prototipos y MVPs** que necesitan persistencia "barata" sin diseñar esquema.
- **Sistemas de trading o de juego** donde la latencia importa más que el volumen, y todo el estado relevante cabe en memoria.

Casos donde **no** aplica:
- Datos compartidos entre múltiples aplicaciones (la prevalencia es uniproceso por diseño).
- Datasets que crecen indefinidamente (logs, eventos, mediciones).
- Necesidad de queries ad-hoc o reportes (ver [[OLAP y ETL]]).

## Relación con otros patrones

- **Event Sourcing**: comparte el WAL, pero promueve el log a fuente de verdad y permite reproyecciones. La prevalencia es más simple y más opaca.
- **In-memory databases** (Redis, Hazelcast): productizan el patrón con clustering, replicación y query languages.
- **Memoria + Snapshot** es también la base de cómo Memcached o Redis se persisten ([[Bases no relacionales|Redis]] usa AOF + RDB que es esencialmente prevalencia con otro nombre).

## Pregunta a profundizar

¿Por qué la prevalencia, siendo un patrón potente y simple, casi nunca aparece en los stacks modernos? Hipótesis: la combinación de (1) RAM barata + (2) Redis/Memcached como producto + (3) cultura "BD es la fuente de verdad" desplazó al patrón explícito.

## Lecturas complementarias

- Wuestefeld, *Prevayler — Bringing Object Prevalence to Java* (2001).
- Fowler, *Patterns of Enterprise Application Architecture* (2002) cap. 14 sobre Concurrency — discute la idea base sin nombrarla.
