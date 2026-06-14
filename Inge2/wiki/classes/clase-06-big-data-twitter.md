---
title: Clase 6 — Big Data en tiempo real (Twitter)
aliases:
  - "Clase 6 — Big Data en tiempo real (Twitter)"
  - "Clase 6 — Twitter"
  - "Big Data Twitter (clase)"
type: class
created: 2026-05-06
updated: 2026-05-12
tags: [twitter, kallen, big-data, real-time, escalabilidad, fanout, sharding, cassandra, memcached, case-study]
sources:
  - raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf
date: 2026-04-23
related:
  - "[[Clase 6 — Persistencia]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Kallen — Big Data in Real-Time at Twitter (QCon 2010)]]"
  - "[[Partition, Replicate, Index]]"
  - "[[Off-line vs Online computation]]"
  - "[[Memory hierarchy]]"
  - "[[Principio de localidad]]"
  - "[[Sharding]]"
  - "[[Bases no relacionales]]"
  - "[[Replicación de BD]]"
  - "[[Teorema CAP]]"
  - "[[Map-Reduce]]"
  - "[[ORM e impedancia objeto-relacional]]"
  - "[[Clase 7 — Caso Compraventa de Acciones]]"
---

# Clase 6 — Big Data en tiempo real (Twitter)

> **Nota cronológica:** esta página y [[Clase 6 — Persistencia]] **comparten día** (2026-04-23). El día se desarrolla en dos partes: primero la **teoría** de persistencia (slide deck `Clase 5.pdf` que la cátedra distribuyó previamente — ver nota en [[Clase 6 — Persistencia]]) y luego el **caso aplicado** sobre Twitter usando el deck de Kallen (QCon 2010). Ambas páginas se mantienen separadas por su valor pedagógico distinto: una es marco conceptual, la otra es kata sobre números reales.

## TL;DR

La clase camina íntegramente el slide deck *Big Data in Real-Time at Twitter* de Nick Kallen (QCon 2010) como caso integrador de la unidad de persistencia. El deck recorre cuatro sub-problemas de Twitter (Tweets, Timelines, Social graphs, Search indices) y muestra cómo cada uno requiere una combinación distinta de [[Partition, Replicate, Index|partition + replicate + index]], decisiones de [[Off-line vs Online computation|cuándo computar]], y respeto por la [[Memory hierarchy|jerarquía de memoria]]. La lección general: **no hay solución universal; cada perfil de uso amerita su propia arquitectura de datos**.

## Mapa conceptual

- [[Caso Twitter — Big Data en tiempo real]] — el desarrollo completo del caso.
- [[Kallen — Big Data in Real-Time at Twitter (QCon 2010)]] — la fuente.
- [[Partition, Replicate, Index]] — el mantra: scalability = partitioning + replication + indexing.
- [[Off-line vs Online computation]] — cuándo precomputar vs computar en query-time.
- [[Memory hierarchy]] — *"All data for real-time queries MUST be in memory."*
- [[Principio de localidad]] — temporal y espacial; co-ubicar lo accedido junto.
- [[Sharding]] — particionado; aplicado en cuatro variantes según problema.
- [[Bases no relacionales]] — Cassandra como solución para tweets.
- [[Replicación de BD]] — master-slave y multi-master.
- [[Teorema CAP]] — distintos sub-sistemas eligen lados distintos.

## Desarrollo

### Qué es "Big Data en tiempo real" para Kallen

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *What is Real-Time Data?*):

- **Online queries** para un único web request.
- **Off-line computations** con muy baja latencia.
- Latency y throughput igualmente importantes.
- **Explícitamente: NO se trata de Hadoop ni otras herramientas batch de big data.** Hadoop sirve para procesamiento batch nocturno; Kallen habla del subsistema que sirve cada vista del producto en milisegundos.

Esta delimitación importa: la clase no trata data warehousing ni ML pipelines; trata el **path crítico de los datos** que el usuario ve.

### Los cuatro problemas

Twitter no es **un** sistema sino **cuatro sub-sistemas** con perfiles muy distintos (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *The four data problems*):

| Problema | Definición | Operaciones | Velocity | Durabilidad |
|---|---|---|---|---|
| **Tweets** | Mensaje 140-char + metadata | append + lookup by id / by author | Moderada | Durable |
| **Timelines** | Secuencia de tweet ids | append + merge + truncate | Alta | **No durable** |
| **Social graphs** | Edges follow / block | set algebra + enumerate + cardinality | Media | Durable |
| **Search indices** | Posting lists term→docs | boolean + ad-hoc + recency | Alta writes | Durable |

Cada uno se aborda con la misma estructura: definición, original implementation, problemas, current/future implementation, latency, principles. Ver [[Caso Twitter — Big Data en tiempo real]] para el desarrollo de los cuatro.

### Tweets — partition by **time**

Después de probar particionado por id (timeline scatter-gather) y por user_id (lookup scatter-gather), Twitter eligió **partition by time** explotando [[Principio de localidad|temporal locality]]: la mayoría de queries piden tweets recientes que viven en una sola partición activa.

Solución futura: **Cassandra + secondary index manual + Memcached** para 90%+ de reads.

### Timelines — fanout off-line a memoria

La query original online (`SELECT … WHERE user_id IN (subselect followers)`) muere ante usuarios con muchos seguidos. Solución:

- **Pre-computar** los timelines via **fanout off-line**: cuando alguien tweetea, escribir el id en el timeline de cada seguidor.
- **Memcached**, no disco — fanout to disk requeriría IOPS inviables.
- **Bounded length** — truncate aleatorio para limitar storage.
- **On cache miss, merge** los timelines de los seguidos (fallback online).

Resultado: **1.2 millones de deliveries/segundo**, fanout ratio 600:1 (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Throughput Statistics*).

Principio: ver [[Off-line vs Online computation]].

### Social graphs — set algebra online

13B edges, queries que incluyen set algebra (intersección, unión, diferencia), inclusión, cardinalidad, mass-deletes para spam.

Solución actual:
- **Partition por user_id**.
- **Edges en ambas direcciones** — la misma edge guardada como forward y backward, en shards distintos.
- **Indexed by time** + **indexed by element** + **denormalized cardinality**.
- Writes idempotent + last-write-wins + estrategias commutativas para mass-writes.

Principio explícito (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf):

> "It is not possible to pre-compute set algebra queries. Simple distributed coordination techniques work. Partition, replicate, index. Many efficiency and scalability problems are solved the same way."

### Search indices — document partitioning + Lucene

Para términos raros la locality temporal no aplica (un término raro puede estar en cualquier partición temporal). La solución futura:

- **Document partitioning** — cada partición tiene un subset de documentos completos.
- **Time partitioning** combinado.
- **Merge layer** que unifica resultados de las particiones.
- Migración prevista de MySQL a **Lucene**.

Principio: *"Partition so that work can be parallelized; temporal locality is not always enough."*

### Los cinco principios universales

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* final):

1. **All engineering solutions are transient.** Nada perfecto, sólo *good enough for a while*.
2. **Scalability solutions aren't magic.** Involucran [[Partition, Replicate, Index|partitioning, replication, indexing]].
3. **All data for real-time queries MUST be in memory. Disk is for writes only.** ([[Memory hierarchy]].)
4. **Some problems solved with [[Off-line vs Online computation|pre-computation]], but a lot can't.**
5. **Exploit [[Principio de localidad|locality]] where possible.**

## Decisiones clave discutidas

| Decisión | Opciones | Criterio | Recomendación cátedra/Kallen |
|---|---|---|---|
| Shard key para tweets | id / user_id / time | Patrón de query dominante | **Time** (locality temporal). |
| Cómputo de timeline | Online (join) / Off-line (fanout) | Reads >> writes y patrón limitado | **Off-line** (fanout off-line a memoria). |
| Storage de timelines | Disco / Memoria | Latencia objetivo | **Memoria** (Memcached); disco no aguanta IOPS. |
| Cómputo de set algebra | Precomputar / Online | Cardinalidad de queries posibles | **Online** — explosión combinatoria impide precomputar. |
| Almacenamiento de edges | Una vez / Forward+Backward | Patrón de query bidireccional | **Ambos** — costo de storage para optimizar lecturas. |
| Search index | Time partition / Document partition / Híbrido | Frecuencia de términos | **Híbrido** — temporal locality no alcanza para términos raros. |
| Durabilidad de timelines | Durable / No durable | Costo de reconstrucción × probabilidad de falla | **No durable**: barato reconstruir merging. |
| Migración de RDBMS | Mantener / NoSQL | # de hacks creativos sobre el RDBMS | **Migrar a Cassandra** cuando los workarounds dominan complejidad. |

## Ejemplos vistos en el deck

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf):

- **Tweet con primary key 4376167936** — find by id.
- **hotdogsladies tweets** — find by user_id 749863.
- **Original tweet table** con `(20, 12, "just setting up my twttr", "2006-03-21 20:50:14")` (Jack Dorsey).
- **Pantalla What's happening?** con tweets de missionhipster, NeonIndian, Sightglass — *"Tweets from 3 different people"* ilustrando timeline merge.
- **Throughput statistics** 2008 vs 2010.
- **@aplusk tweet** *"@foursquare do we get a badger if we show up at the party?"* — ejemplo de **intersection set algebra**: deliver to users who follow both @aplusk AND @foursquare.
- **@ashtonkutcher account** con 4.7M followers, 35.8k listed — **cardinality denormalizada**.
- **Mountain dew cheetos** — ejemplo de **search index intersection of three posting lists**.

## Vínculo con Clase 5

Esta clase es el **caso de aplicación integral** del marco teórico cubierto la misma jornada en [[Clase 6 — Persistencia]]. Cada concepto teórico se ve en acción:

| Concepto Clase 5 | Aplicación en Twitter |
|---|---|
| [[Sharding]] | 4 estrategias distintas, una por sub-problema |
| [[Replicación de BD]] | Master-slave en MySQL legacy; replica sets en Cassandra; ambas direcciones de edges como replicación lógica |
| [[Bases no relacionales]] | Cassandra (columnar) para tweets; Memcached (KV) para timelines y reads |
| [[Map-Reduce]] | **Anti-ejemplo**: Kallen explícitamente lo descarta como inapropiado para real-time |
| [[Teorema CAP]] | Timelines AP (no durable); social graphs CP-leaning (writes idempotent + retry); cada sub-sistema elige su lado |
| [[ORM e impedancia objeto-relacional]] | Implícito: el modelo de timelines como secuencia in-memory **evita** la impedancia |

## Preguntas para el parcial

1. ¿Por qué Twitter eligió partition-by-time para tweets en lugar de partition-by-id o partition-by-user_id? Justificar con [[Principio de localidad]].
2. Explicar fanout off-line en timelines. ¿Por qué se eligió fanout a memoria y no a disco? ¿Cuáles son las dos condiciones para que la precomputación tenga sentido?
3. ¿Por qué set algebra sobre social graphs **no** puede precomputarse? ¿Qué consecuencia tiene esto sobre el diseño de índices del social graph?
4. Explicar por qué los edges se guardan en ambas direcciones (forward + backward). ¿Qué query haría costosa una sola dirección?
5. Comparar las latencias de los cuatro subsistemas. ¿Cuál es el más exigente y por qué? ¿Cuál tolera latencia más alta?
6. Enunciar los 5 principios universales con los que cierra el deck. Aplicarlos a un sistema distinto (e.g. Spotify, Netflix, MercadoLibre).
7. ¿Por qué Twitter cambió MySQL master-slave por Cassandra para tweets? ¿Qué problemas resuelve Cassandra que MySQL no resolvía?
8. *"All engineering solutions are transient."* Encontrar dos ejemplos en el deck donde Kallen dice explícitamente que la solución actual está siendo reemplazada.

## Lecturas complementarias

- Kallen, *Big Data in Real-Time at Twitter* (QCon 2010) — fuente principal de la clase.
- Lakshman & Malik, *Cassandra: A Decentralized Structured Storage System* (LADIS 2009).
- DeCandia et al., *Dynamo: Amazon's Highly Available Key-value Store* (SOSP 2007) — antecesor conceptual.
- Bronson et al., *Tao: Facebook's Distributed Data Store for the Social Graph* (USENIX ATC 2013) — comparable de Facebook.
- Decker (Twitter), *Manhattan: Twitter's Real-time, Multi-tenant Distributed Database* (2014) — el sucesor moderno de la arquitectura descrita por Kallen.
- Brewer, *CAP Twelve Years Later* (IEEE 2012) — para encuadrar las decisiones de cada sub-sistema.
