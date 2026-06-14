---
title: Kallen — Big Data in Real-Time at Twitter (QCon 2010)
aliases:
  - "Kallen — Big Data in Real-Time at Twitter (QCon 2010)"
  - "Kallen"
  - "Big Data in Real-Time at Twitter"
  - "Kallen QCon"
type: source
created: 2026-05-06
updated: 2026-05-06
tags: [source, twitter, escalabilidad, kallen, qcon, sistemas-distribuidos, real-time]
sources:
  - "raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf"
related:
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Clase 6 — Big Data en tiempo real (Twitter)]]"
  - "[[Partition, Replicate, Index]]"
  - "[[Off-line vs Online computation]]"
  - "[[Memory hierarchy]]"
  - "[[Principio de localidad]]"
  - "[[Clase 6 — Persistencia]]"
---

# Kallen — Big Data in Real-Time at Twitter (QCon 2010)

## Identificación

- **Título:** *Big Data in Real-Time at Twitter*.
- **Autor:** Nick Kallen (`@nk` en Twitter).
- **Tipo:** Slide deck de keynote en **QCon 2010** (San Francisco), publicado en SlideShare.
- **URL original:** http://www.slideshare.net/nkallen/qcon (citada en el slide 2 del propio deck).
- **Longitud:** 71 slides.
- **Rol:** estudio de caso de la arquitectura de datos de Twitter circa 2010, usado por la cátedra Inge2 como reading principal de [[Clase 6 — Big Data en tiempo real (Twitter)]].

## Qué es "Big Data en tiempo real" para Kallen

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *What is Real-Time Data?*):

- **Online queries** para un único web request — el path crítico del usuario.
- **Off-line computations con muy baja latencia** — no batch nocturno; segundos como máximo.
- Latency y throughput igualmente importantes — no se sacrifica uno por el otro.
- **Explícitamente: "Not talking about Hadoop and other high-latency, Big Data tools."** Hadoop existe para procesamiento batch, no para servir queries online.

Esta delimitación es importante: el deck **no** trata data warehousing ni ML pipelines; trata el subsistema que sirve cada vista del producto.

## Estructura del deck

Cuatro problemas, abordados con la misma estructura cada uno (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *The four data problems*):

1. **Tweets** (slides 7-25)
2. **Timelines** (slides 27-39)
3. **Social graphs** (slides 40-55)
4. **Search indices** (slides 56-67)

Para cada problema:
- **Definición**: qué es, qué query patterns soporta.
- **Original implementation**: la solución v1.
- **Problems w/ solution**: por qué v1 no escaló.
- **Current/Future implementation**: la solución vigente.
- **Low Latency**: tabla de números reales (PK lookup 1ms, etc.).
- **Principles**: 1-3 lecciones generalizables.

El cierre integra todo en summary statistics y principios universales (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slides *Summary Statistics* y *Principles* finales).

## Síntesis por problema

### 1. Tweets

> Mensaje de 140 chars + metadata. Query patterns: por id, por author. Storage: row.

| Versión | Solución | Por qué falló / por qué funciona |
|---|---|---|
| Original | MySQL single-table + master-slave + Memcached | A 2.954.291.678 tweets, disco al 90%; no querían arrays > 800GB |
| Actual | Particionado por **tiempo** (no por id, no por user_id) | Locality temporal: los recientes se piden mucho más |
| Future | **Cassandra** + PK partitioning + secondary index manual sobre user_id + Memcached para 90%+ de reads | Eliminar deadlocks de MySQL, automatizar shard creation |

Latencias: Memcached 1ms, MySQL <10ms (depende de cuántas particiones). Volumen (slide *Summary Statistics*): 100k reads/s, 850 writes/s, 12B tweets, 300B/item, durable.

### 2. Timelines

> Secuencia de tweet ids del home feed. Operaciones: append, merge, truncate. *High-velocity bounded vector*.

| Versión | Solución |
|---|---|
| Original | `SELECT * FROM tweets WHERE user_id IN (subselect followers)` — mata si tenés muchos seguidos o si los índices no caben en RAM |
| Actual | **Fanout off-line** + secuencias en **Memcached**. Cuando alguien tweetea, escribir el id en el timeline de cada seguidor. Truncate aleatorio para mantener bounded. On cache miss: merge user timelines |

Estadísticas (slide *Throughput Statistics*): 10/2008 → 30 tps avg / 21k deliveries/s; 4/2010 → 700 tps avg / **1.2m deliveries/s** (fanout ratio 600:1). Volumen (slide *Summary Statistics*): 80k reads/s, 1.2m writes/s, "a lot" cardinality, 3.2k bytes/item, **non durable**.

### 3. Social graphs

> Lista de quién sigue a quién, quién bloquea a quién. Operaciones: enumerate by time, intersection/union/difference, inclusion, cardinality, mass-deletes para spam. *Medium-velocity unbounded vectors. Complex predetermined queries.*

| Versión | Solución |
|---|---|
| Original | Single-table + master-slave + índice en source_id e índice en destination_id. Falla por write throughput e índices que no caben en RAM |
| Actual | **Partition por user_id**. **Edges en ambas direcciones** (forward + backward — la misma edge guardada dos veces). **Indexed by time** + **indexed by element** (para set algebra) + **denormalized cardinality** |

Challenges (slide *Challenges*): consistencia ante fallas → writes idempotent + retry until success + **Last-Write Wins** para edges + estrategias commutativas para mass-writes. Latencias: cardinality 1ms, iteration 100 edges/ms, write ack 1ms, write materialize 16ms, inclusion 1ms. Volumen: 100k reads/s, 20k writes/s, 13B edges, 110B/item, durable.

Principio que cierra: **"It is not possible to pre-compute set algebra queries."** Las consultas como "intersección de seguidores de @aplusk y @foursquare" deben ser online — no pueden materializarse. La solución: simple distributed coordination + partition/replicate/index.

### 4. Search indices

> "Find me all tweets with these words." Posting lists, boolean queries, complex ad-hoc. **Relevance is recency.**

| Versión | Solución |
|---|---|
| Original | Single-table `(term_id, doc_id)` + master-slave. Falla porque el índice no entra en RAM |
| Actual | **Particionado por tiempo** + MySQL + delayed key-write. Problema: queries para términos raros tocan muchas particiones; espacio/recall pobre |
| Future | **Document partitioning + time partitioning + merge layer**. Posiblemente migrar de MySQL a **Lucene** |

Volumen: 13k reads/s, 21k writes/s, 315M items, 1k bytes/item, durable.

Principio: **partition so that work can be parallelized; temporal locality is not always enough**.

## Los principios universales (cierre del deck)

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* final):

1. **All engineering solutions are transient.** Nothing's perfect, but some are good enough for a while.
2. **Scalability solutions aren't magic. They involve [[Partition, Replicate, Index|partitioning, indexing, and replication]].**
3. **All data for real-time queries MUST be in memory. Disk is for writes only.** Ver [[Memory hierarchy]].
4. **Some problems can be solved with pre-computation, but a lot can't.** Ver [[Off-line vs Online computation]].
5. **Exploit [[Principio de localidad|locality]] where possible.**

## Por qué este deck es valioso académicamente

1. **Es un caso real, con números** — no un paper teórico ni un tutorial. Throughput, fanout ratios, latencias, sizes — todo con cifras de producción.
2. **Cubre cuatro sub-problemas** con perfiles distintos en un mismo sistema. Permite comparar **dentro del mismo dominio** cómo cambia la solución óptima según el patrón de uso.
3. **Trayectoria temporal** — muestra v1 → v2 → futuro. Cada decisión justificada por qué falló la anterior.
4. **Generaliza a principios** — no es sólo "así escala Twitter", es "así escala cualquier cosa".
5. **Honesto sobre los límites** — Kallen no oculta que el sistema está en transición permanente; *"All engineering solutions are transient"* es la primera lección.

## Limitaciones

- **Una sola perspectiva** (Kallen) sin contracritica — un paper académico tendría peer review; un deck no.
- **2010** — la clase usa el material por su valor pedagógico, no como descripción de Twitter actual. Hoy Twitter/X tiene Manhattan (in-house KV store), Heron (streaming sucesor de Storm), etc. La narrativa de fondo (partition/replicate/index, off-line/online) sigue válida.
- **Limitado a operaciones internas** — no aborda CDN, edge caching, mobile-specific concerns, ni los aspectos no-funcionales como observability, deploy, oncall.

## Cómo lo usa la cátedra

[[Clase 6 — Big Data en tiempo real (Twitter)]] usa este deck como **reading completo de clase**: no se ven slides paralelas de la cátedra, sino que se camina el deck de Kallen. Funciona como **caso de estudio integral** que aplica los temas de [[Clase 6 — Persistencia]] (sharding, replicación, NoSQL, CAP) sobre un dominio real con números, y agrega los principios de placement (memoria vs disco, off-line vs online) que cierran la unidad de persistencia.

Para el desarrollo del caso ver [[Caso Twitter — Big Data en tiempo real]].

## Pregunta a profundizar

Kallen dice que social graph queries (set algebra) **no pueden** precomputarse. Sin embargo, Facebook implementó **Tao** (paper 2013) precisamente para esto. ¿Qué aprendió Facebook que Twitter no implementó? ¿Hay un trade-off de latencia vs frescura que justifique recomputar online en vez de servir desde cache stale?

## Lecturas complementarias

- Bronson et al., *Tao: Facebook's Distributed Data Store for the Social Graph* (USENIX ATC 2013) — el paralelo de Facebook.
- Cooper et al., *PNUTS: Yahoo!'s Hosted Data Serving Platform* (VLDB 2008) — caso similar contemporáneo.
- *The Architecture of Open Source Applications* — capítulos sobre BD distribuidas.
- Kreps, *Putting Apache Kafka to Use: A Practical Guide to Building a Stream Data Platform* — heredero de las ideas de fanout off-line.
