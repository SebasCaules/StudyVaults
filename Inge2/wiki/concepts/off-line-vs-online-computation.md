---
title: Off-line vs Online computation
aliases:
  - "Off-line vs Online computation"
  - "Off-line vs Online"
  - "Pre-computation"
  - "Precomputación"
  - "Fanout"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [precomputacion, fanout, latencia, materializacion, cache]
sources:
  - "raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf"
related:
  - "[[Memory hierarchy]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Partition, Replicate, Index]]"
  - "[[Clase 6 — Big Data en tiempo real (Twitter)]]"
  - "[[OLAP y ETL]]"
---

# Off-line vs Online computation

## El principio

> "The answer to some problems can be **pre-computed** if the amount of work is **bounded** and the query pattern is very limited."
> (Kallen, source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* — sección Timelines)

Decidir **cuándo se hace el cómputo** es tan arquitectónico como decidir cuál se hace. Frente a una query frecuente, hay tres opciones:

1. **Cómputo online (en query-time)** — al pedir el dato, lo calculo. Simple, siempre fresco. Caro si el cómputo es complejo o frecuente.
2. **Cómputo off-line (precomputado / materializado)** — al producir el dato, computo y guardo el resultado. Lectura barata. Costoso al escribir.
3. **Cómputo híbrido (cache + recompute on miss)** — guardo el resultado materializado, pero si el cache está vacío recomputo en query-time. La regla: **on cache miss, merge user timelines** (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Current Implementation* timelines).

## Cuándo precomputar tiene sentido

Kallen es explícito sobre las dos condiciones (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles*):

1. **Trabajo bounded.** El costo de computar el resultado tiene un techo conocido. Si el cómputo es ilimitado (set algebra arbitraria sobre social graphs, por ejemplo) **no se puede precomputar** — Kallen lo dice expresamente: *"It is not possible to pre-compute set algebra queries"*.
2. **Patrón de query muy limitado.** Hay un puñado de queries dominantes que justifican precomputar. Si las queries son ad-hoc, materializar todas las posibilidades explota el storage.

A la inversa, **online compute** se prefiere cuando:
- El cómputo es barato.
- Las queries son ad-hoc y diversas.
- Los datos cambian más rápido que el ratio de lecturas (precomputar invalidaría todo el tiempo).

## El caso Timeline de Twitter

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, sección Timelines):

**Implementación original (online):**

```sql
SELECT * FROM tweets
WHERE user_id IN (SELECT source_id FROM followers WHERE destination_id = ?)
ORDER BY created_at DESC LIMIT 20
```

Calcular el timeline en cada request. Funciona en pequeño. **Problema**: *"Crazy slow if you have lots of friends or indices can't be kept in RAM"* — el join contra `followers` se vuelve impracticable.

**Implementación actual (off-line, fanout):**

- Los timelines son **secuencias de tweet ids** materializadas en Memcached, una por usuario.
- Cuando alguien tweetea, un proceso **fanout** escribe el tweet id en el timeline de **cada uno** de sus seguidores.
- Truncar a longitud bounded para limitar storage.
- Read es trivial: `GET timeline:user_id` → 20 tweet ids.
- Write es caro: ~600:1 fanout ratio promedio — un tweet escribe en 600 timelines en promedio.

Resultado: **1.2 millones de deliveries/segundo** (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *1.2m Deliveries per second*). El read es O(1); el write es O(seguidores).

## Trade-off central: *Read amplification* vs *Write amplification*

| Estrategia | Read cost | Write cost | Cuándo elegir |
|---|---|---|---|
| Online (query-time join) | Alto (joins, scatter-gather) | Bajo (un INSERT) | Reads ≪ Writes; queries ad-hoc; patrones impredecibles |
| Off-line (materialización + fanout) | Bajo (lookup directo) | Alto (escribir N copias) | Reads ≫ Writes; queries predecibles; patrón de fanout bounded |
| Híbrido con cache | Bajo si hit, alto si miss | Bajo + invalidación | Reads ≫ Writes pero patrones de acceso variables |

Twitter cuadra en off-line: las timelines se leen mucho más de lo que se escribe (~80k reads/s vs 1.2m writes/s — pero los writes son fanouts derivados de pocos tweets originales, no una operación del usuario).

## Generalizando: *Computational placement*

El principio se aplica más allá de social media:

- **Vistas materializadas en RDBMS** — query frecuente con cómputo costoso → pre-calculo.
- **OLAP cubes** — todas las agregaciones precalculadas (ver [[OLAP y ETL]]).
- **Search indices invertidos** (Lucene, ElasticSearch) — el cómputo "tokenizar y rankear" se hace al ingestar, no al buscar.
- **CDNs** — el cómputo "renderizar HTML" se materializa en static + el cliente reconstituye.
- **Generative AI con caché** — embeddings precomputados; sólo el matching final es online.

## Otros principios complementarios (Kallen)

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* — sección Timelines):

1. *Off-line vs online computation* — el principio de esta página.
2. *Keep the memory hierarchy in mind* — ver [[Memory hierarchy]].
3. *The efficiency of a system includes the cost of generating data from another source (such as a backup) times the probability of needing to.* — un cache miss caro es OK si es raro; si pasa seguido, no es un cache.

## Decisiones canónicas

| Pregunta | Heurística |
|---|---|
| ¿Online o off-line? | Estimar ratio reads/writes y costo por operación. Si reads × cost_read ≫ writes × cost_write_extra, materializar. |
| ¿Cuánto materializar? | Sólo el patrón de query dominante. No materializar todas las queries posibles. |
| ¿Cómo invalidar? | TTL (cache expirable), event-driven (recomputar al cambiar fuente), versioning (write new version). |
| ¿Cómo manejar cache misses? | Recompute online si está bounded; aceptar latencia ocasional. Ver el principio de "efficiency × probability". |

## Pregunta a profundizar

¿Por qué Kallen cierra ambas secciones de Tweets y Timelines aludiendo a *partition, replicate, index* como la solución universal — pero al introducir el concepto de off-line/online lo trata como un eje aparte? ¿Es una *cuarta dimensión* o un sub-caso del indexing?

## Lecturas complementarias

- Kallen, *Big Data in Real-Time at Twitter* (QCon 2010) — la fuente.
- Stonebraker, *The Case for Materialized Views* — argumentación clásica.
- *DBLP: Materialized Views* — survey actualizado.
- Helland, *Life Beyond Distributed Transactions* (CIDR 2007) — patrones de denormalización en sistemas distribuidos.
