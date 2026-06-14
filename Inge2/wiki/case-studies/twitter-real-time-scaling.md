---
title: Caso Twitter — Big Data en tiempo real
aliases:
  - "Caso Twitter — Big Data en tiempo real"
  - "Caso Twitter"
  - "Twitter scaling"
  - "Twitter Big Data"
type: case-study
created: 2026-05-06
updated: 2026-05-06
tags: [case-study, twitter, kallen, escalabilidad, real-time, sistemas-distribuidos, fanout, sharding, cassandra, memcached]
sources:
  - "raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf"
related:
  - "[[Kallen — Big Data in Real-Time at Twitter (QCon 2010)]]"
  - "[[Clase 6 — Big Data en tiempo real (Twitter)]]"
  - "[[Sharding]]"
  - "[[Replicación de BD]]"
  - "[[Bases no relacionales]]"
  - "[[Teorema CAP]]"
  - "[[Partition, Replicate, Index]]"
  - "[[Off-line vs Online computation]]"
  - "[[Memory hierarchy]]"
  - "[[Principio de localidad]]"
  - "[[Clase 6 — Persistencia]]"
  - "[[Map-Reduce]]"
---

# Caso Twitter — Big Data en tiempo real

## Por qué la cátedra lo usa

Es el **caso de estudio integrador** de la unidad de persistencia. Aplica todo lo visto en [[Clase 6 — Persistencia]] —sharding, replicación, [[Teorema CAP]], [[Bases no relacionales|NoSQL]], [[Map-Reduce]] (anti-ejemplo: por qué *no* se usa)— sobre un sistema real con números reales: **1.2 millones de timeline deliveries/segundo**, 12 mil millones de tweets, latencias garantizadas de < 10ms para queries online.

La fuente es el slide deck de Nick Kallen *Big Data in Real-Time at Twitter* (QCon 2010, ver [[Kallen — Big Data in Real-Time at Twitter (QCon 2010)]]).

## Contexto

- **Twitter** circa 2010: red social con 140-char tweets, timelines, follow graph, búsqueda full-text.
- **Problema de fondo**: cada acción del usuario (postear, leer timeline, seguir, buscar) es una decisión arquitectónica de cómo y dónde guardar y servir datos a millones de usuarios concurrentes.
- **No es Hadoop/batch** — Kallen es explícito: *online queries*, *low-latency offline computations*, no *high-latency Big Data tools* (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *What is Real-Time Data?*).

## Los cuatro problemas de datos

Twitter no es **un** sistema sino **cuatro sub-sistemas con perfiles muy distintos** (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *The four data problems*):

| Problema | Qué es | Ops dominantes | Velocity | Cardinalidad | Durabilidad |
|---|---|---|---|---|---|
| **Tweets** | El mensaje + metadata | Append + lookup by id / by author | Moderada | 12B | Durable |
| **Timelines** | Secuencia de tweet ids del feed | append + merge + truncate | Alta | "a lot" | **No durable** |
| **Social graphs** | Follow / block edges | Set algebra + enumerate | Media | 13B edges | Durable |
| **Search indices** | Posting lists term→docs | Boolean + ad-hoc queries | Alta writes | 315M | Durable |

La lección general: **una "BD" no resuelve los cuatro casos**. Cada uno requiere su propia combinación de [[Partition, Replicate, Index|partitioning, replication, indexing]].

## Problema 1 — Tweets

### Definición

> "140 character message, plus some metadata. Query patterns: by id, by author. Row Storage."
> (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *What is a Tweet?*)

### Original — MySQL relacional

Tabla única `(id, user_id, text, created_at)` con vertical scaling, replicación master-slave, Memcached para reads.

**Por qué falló:**
- Disk space: arrays > 800GB inviables.
- A 2.954.291.678 tweets, disco al **90%** de utilización.

### Particionar — pero ¿por qué clave?

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Possible implementations*):

| Estrategia | Problema |
|---|---|
| Partition by **primary key** (id) | "Finding recent tweets by user_id queries N partitions" — cada timeline scatter-gather |
| Partition by **user_id** | "Finding a tweet by id queries N partitions" — buscar tweet directo es scatter-gather |
| **Partition by time** ← elegida | Locality temporal: los recientes (mayoría de queries) caen en 1 partición |

Cada query intenta las particiones en orden hasta acumular suficientes datos.

### Future — Cassandra

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Future solution*):

- **Cassandra** (no relacional, columnar/wide-column).
- **Primary Key partitioning**.
- **Manual secondary index** sobre user_id (Cassandra nativo no lo proveía bien en 2010).
- **Memcached** sirve 90%+ de los reads.

### Problemas con la solución actual al momento del deck

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Problems w/ solution*):

- Write throughput.
- *"Have encountered deadlocks in MySQL at crazy tweet velocity."*
- *"Creating a new temporal shard is a manual process and takes too long; it involves setting up a parallel replication hierarchy. Our DBA hates us."*

### Latencias

| Operación | Latency |
|---|---|
| Memcached lookup | 1ms |
| MySQL PK lookup | <10ms* |

*Depende del número de particiones que toque la query.

## Problema 2 — Timelines

### Definición

> "Sequence of tweet ids. Query pattern: get by user_id. Operations: append, merge, truncate. **High-velocity bounded vector**. **Space-based (in-place mutation)**."
> (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *What is a Timeline?*)

Es el feed home de un usuario: una secuencia de tweet ids ordenada por tiempo, truncada a una longitud razonable.

### Original — query online

```sql
SELECT * FROM tweets
WHERE user_id IN (SELECT source_id FROM followers WHERE destination_id = ?)
ORDER BY created_at DESC
LIMIT 20
```

**Por qué falla**: *"Crazy slow if you have lots of friends or indices can't be kept in RAM."* Si seguís a miles de cuentas, el subselect explota.

### Off-line vs Online — la decisión clave

> "The answer to some problems can be **pre-computed** if the amount of work is **bounded** and the query pattern is very limited."
> (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* — Timelines)

El timeline cumple ambas condiciones: cada usuario tiene un feed, todos quieren la misma forma de query (recent tweets en orden inverso). Conviene **precomputar via fanout off-line**. Ver [[Off-line vs Online computation]].

### Memoria, no disco

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Possible implementations* timelines):

- **Fanout to disk**: *"Ridonculous number of IOPS required, even with fancy buffering techniques."* Inviable.
- **Fanout to memory**: *"Good if cardinality of corpus × bytes/datum not too many GB."* Elegida.

Ver [[Memory hierarchy]] para el principio general.

### Solución actual

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Current Implementation* timelines):

- Sequences stored in **Memcached**.
- **Fanout off-line** con **low latency SLA**: cuando alguien tweetea, un proceso fuera del path crítico escribe el tweet id en el timeline de cada uno de sus seguidores.
- **Truncate at random intervals** para mantener las secuencias bounded.
- **On cache miss, merge user timelines** — fallback al cómputo online cuando el cache no tiene la respuesta.

### Estadísticas

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Throughput Statistics*):

| Fecha | tps avg | tps peak | Fanout ratio | Deliveries/s |
|---|---|---|---|---|
| 2008-10-07 | 30 | 120 | 175:1 | 21,000 |
| 2010-04-15 | 700 | 2,000 | 600:1 | **1,200,000** |

Latencias: get 1ms, append 1ms, fanout < 1s (depende del número de seguidores). 1.2 millones de deliveries/segundo es el headline.

## Problema 3 — Social graphs

### Definición

> "List of who follows whom, who blocks whom, etc. Operations: enumerate by time, intersection/union/difference, inclusion, cardinality, mass-deletes for spam. **Medium-velocity unbounded vectors. Complex, predetermined queries.**"
> (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *What is a Social Graph?*)

### Operaciones que el sistema debe soportar

(visualizadas sobre la pantalla de followers de @aplusk):

- **Temporal enumeration** — orden cronológico de followers nuevos.
- **Inclusion** — ¿X sigue a Y? (boolean).
- **Cardinality** — número de followers / following / listed.
- **Set algebra** — *"deliver to people who follow both @aplusk AND @foursquare"* (intersección).
- **Mass-deletes** — borrar cuenta de spam también borra todas sus edges.

### Original — MySQL single-table

Tabla `(source_id, destination_id)` con índice en cada columna. Single-table vertically scaled, master-slave.

**Por qué falla:**
- Write throughput (con 13B edges).
- Indices couldn't be kept in RAM.

### Solución actual

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Current solution*):

- **Partitioned by user_id**.
- **Edges stored in both directions** — forward `(source, dest, updated_at, x)` y backward `(dest, source, updated_at, x)`. Cada edge se guarda dos veces, en dos shards distintos.
- **Indexed by time** — para enumeration cronológica.
- **Indexed by element** (set algebra) — para intersection/union eficientes.
- **Denormalized cardinality** — el contador de followers se mantiene aparte para que `count` sea O(1).

### Challenges

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Challenges*):

- **Data consistency in the presence of failures** — la red falla, los nodos caen.
- **Write operations are idempotent: retry until success** — diseñar las operaciones para que reintento no genere duplicados.
- **Last-Write Wins** para edges, con **ordering relation on State** para conflictos temporales.
- **Other commutative strategies for mass-writes** — operaciones que pueden aplicarse en cualquier orden.

### El principio de cierre — set algebra no se precomputa

> "It is not possible to pre-compute set algebra queries."
> (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* — social graphs)

Hay 13 mil millones de edges; el número de queries posibles (intersección de subconjuntos arbitrarios) es exponencial. **No se puede materializar todo**. Por eso las queries de set algebra son **online**, y los índices están diseñados para que el cómputo online sea rápido — no eliminado.

### Latencias

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Low Latency* social graphs):

| Operación | Latency |
|---|---|
| Cardinality | 1ms |
| Iteration | 100 edges/ms* |
| Write ack | 1ms |
| Write materialize | 16ms |
| Inclusion | 1ms |

*2ms lower bound.

## Problema 4 — Search indices

### Definición

> "Find me all tweets with these words. Posting list, Boolean and/or queries, complex ad-hoc queries. **Relevance is recency.**"
> (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *What is a Search Index?*)

Es el motor de búsqueda full-text — distinto del social graph en que **el cómputo es la intersección de posting lists**, no de conjuntos de followers.

### Original — single-table

Tabla `(term_id, doc_id)` con master-slave. Falla porque el índice no entra en memoria.

### Actual — partitioned by time

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Current Implementation* search):

- Partitioned by time.
- MySQL como motor.
- Delayed key-write (optimización para reducir escrituras inmediatas).

**Problemas pendientes** (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Problems w/ solution* search):

- Write throughput.
- Queries para términos raros tocan muchas particiones (locality temporal no aplica si el término aparece poco).
- Space efficiency / recall — MySQL requiere mucha RAM.

### Future — Document partitioning + Lucene

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Future solution* search):

- **Document partitioning** — cada partición tiene un subconjunto de documentos completos.
- **Time partitioning también** — combinado con document partitioning.
- **Merge layer** — unifica resultados de N particiones en un orden global.
- **May use Lucene** instead of MySQL — el motor especializado en text search.

Esto introduce el concepto de **data near computation**: traer el código al dato (cada partición ejecuta su propia búsqueda local) en vez de mover datos al código.

### Principios de cierre

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* search):

- **Partition so that work can be parallelized.**
- **Temporal locality is not always enough** — para términos raros, hay que document-partition además.

## Summary statistics

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Summary Statistics*):

| Subsistema | reads/s | writes/s | cardinality | bytes/item | durability |
|---|---|---|---|---|---|
| Tweets | 100k | 850 | 12B | 300B | durable |
| Timelines | 80k | 1.2m | "a lot" | 3.2k | **non** |
| Graphs | 100k | 20k | 13B | 110 | durable |
| Search | 13k | 21k* | 315M† | 1k | durable |

*tps × 25 postings. †75 partitions × 4.2m tweets.

Lo notable: **timelines escribe 1.2m/s pero no es durable**. Hace fanout a memoria; si Memcached cae, se reconstruye.

## Los cinco principios universales

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* final):

1. **All engineering solutions are transient.** Nada es perfecto, pero algo es lo bastante bueno por un tiempo.
2. **Scalability solutions aren't magic. They involve [[Partition, Replicate, Index|partitioning, indexing, and replication]].**
3. **All data for real-time queries MUST be in memory. Disk is for writes only.** Ver [[Memory hierarchy]].
4. **Some problems can be solved with [[Off-line vs Online computation|pre-computation]], but a lot can't.**
5. **Exploit [[Principio de localidad|locality]] where possible.**

## Lecciones para el alumno de Inge2

| Decisión arquitectónica | Cómo la enseña Twitter |
|---|---|
| Elegir shard key | Probar varias hipótesis y elegir por **patrón de query dominante** ([[Principio de localidad]]). |
| Cuándo aceptar pérdida de durabilidad | Cuando el cómputo de reconstrucción × probabilidad de falla < costo de durabilidad. (Timelines.) |
| Cuándo precomputar | Patrón de query bounded + frecuencia >> escritura. (Timelines sí; set algebra no.) |
| Cuándo migrar de RDBMS a NoSQL | Cuando los workarounds creativos sobre RDBMS dominan la complejidad. (Tweets: MySQL → Cassandra.) |
| Cómo manejar fallas en sistemas distribuidos | Idempotent writes + retry + last-write-wins + commutative ops. (Social graphs.) |
| CAP en la práctica | Distintos sub-sistemas eligen distinto: timelines AP, social graphs CP-leaning. |

## Reflexión arquitectónica

Lo más valioso del caso es que **un mismo producto** (Twitter.com) tiene **cuatro decisiones de persistencia distintas**, cada una alineada al perfil de uso de su sub-sistema. La cátedra puede contrastar esto con un anti-patrón común: usar **un solo motor para todo**.

La pregunta para el alumno: **dado tu sistema, ¿cuántos sub-sistemas tiene con perfiles divergentes?** ¿Estás obligando a una BD a servir cargas que no le tocan?

## Pregunta a profundizar

Kallen dice que set algebra **no** se puede precomputar. Sin embargo, Facebook publicó **Tao** (2013) precisamente con un cache distribuido del social graph. ¿Qué estrategia usa Tao que Kallen no consideró —o no era viable en 2010— y qué trade-offs paga? Pista: invalidación + lectura stale tolerada + write-through en algunos casos.

## Lecturas complementarias

- [[Kallen — Big Data in Real-Time at Twitter (QCon 2010)]] — la fuente directa.
- Bronson et al., *Tao: Facebook's Distributed Data Store for the Social Graph* (USENIX ATC 2013).
- Cassandra paper (Lakshman & Malik, LADIS 2009).
- Brewer, *CAP Twelve Years Later* (IEEE 2012) — para encuadrar las decisiones AP/CP de Twitter.
- Decker (Twitter), *Manhattan: Twitter's Real-time, Multi-tenant Distributed Database* (2014) — el sucesor de la arquitectura descrita por Kallen.
