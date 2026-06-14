---
title: Sharding
aliases:
  - "Sharding"
  - "Particionado horizontal"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [sharding, particionado, escalabilidad, distribuido, persistencia]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
  - "raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf"
related:
  - "[[Bases de datos relacionales]]"
  - "[[Replicación de BD]]"
  - "[[Bases no relacionales]]"
  - "[[Principio de localidad]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Persistencia]]"
  - "[[Clase 6 — Persistencia]]"
  - "[[Teorema CAP]]"
---

# Sharding

## Definición

> "Astillar en inglés. Consiste en romper la base de datos en N copias estructuralmente iguales, pero con data disociada."
> (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Sharding*)

Cada shard:
- Usa el **mismo esquema** que los demás.
- Contiene un **subconjunto disjunto** de los datos.
- Tiene sus **propias réplicas** (replicación y sharding son ortogonales — ver [[Replicación de BD]]).

Al dividir el dataset:
- Cada shard maneja un volumen mucho menor → índices entran en RAM.
- La carga de lecturas y escrituras se distribuye entre los N shards.
- Se escala más allá del techo de un solo nodo.

## Estrategias de partición

(implícitas en el ejemplo de la clase + Twitter):

- **Rango (range)** — cada shard cubre un rango de la clave (ej: precios $0-49 / $50-99 / $100+, o nombres A-G / H-N / O-Z). Simple, soporta queries de rango. Riesgo: **hot shards** si la distribución es sesgada.
- **Hash** — `shard = hash(key) mod N`. Distribución uniforme. Pierde locality de rango (una query de rango debe consultar todos los shards).
- **Lookup / directorio** — una tabla externa mapea claves a shards. Flexible (permite rebalanceo) a costa de un componente más.
- **Geográfico** — shard por región. Útil cuando hay regulaciones de soberanía de datos o queremos minimizar latencia regional.
- **Temporal** — shard por ventana temporal. Twitter usó esta estrategia para tweets explotando [[Principio de localidad|temporal locality]]: la mayoría de queries piden los tweets más recientes, que viven en un solo shard activo (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Current Implementation*).

## El desafío central: ¿cómo se decide a qué shard ir?

Dos sub-problemas (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Sharding* desafíos):

1. **La aplicación debe saber a qué shard ir a buscar cada dato.** Esto se conoce como **[[Principio de localidad]]**: *"qué datos se acceden juntos, se deben guardar juntos."* Si tu query típica filtra por `user_id`, particioná por `user_id`. Si filtra por `timestamp`, particioná por tiempo.

2. **Al ser los shards idénticos pero independientes, no hay foreign keys, transacciones u otros mecanismos de integridad cross-shard.** Toda integridad cross-shard la provee la aplicación, eligiendo entre estrategias:
   - **Two-Phase Commit (2PC)** — coordinador protocolo formal; lento, frágil ante fallas del coordinador.
   - **Retry until success** — operaciones idempotentes que se reintentan hasta éxito.
   - **Last-write-wins** — resolución de conflictos por timestamp.
   - **Compensating transactions / Saga pattern** — secuencia de operaciones reversibles.

Esto deja al programador con **trade-offs sobre [[Teorema CAP]]** que el RDBMS clásico ocultaba.

## El caso Twitter — partición por tiempo

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf):

Twitter probó tres estrategias antes de la actual:

| Estrategia | Problema |
|---|---|
| Partition by primary key (id) | "Finding recent tweets by user_id queries N partitions" — cada query de timeline consulta todos los shards. |
| Partition by user_id | "Finding a tweet by id queries N partitions" — buscar un tweet por ID consulta todos los shards. |
| **Partition by time** ← elegida | Queries por id van al shard temporal correcto via mapping; queries de "tweets recientes" típicamente caen en 1 shard activo (locality temporal). |

Lección: **no hay shard key universalmente mejor** — depende del **patrón de query dominante**. Twitter optó por privilegiar el caso común (lecturas recientes) aceptando que algunos casos raros (búsqueda por id antiguo) sean más lentos.

## Sharding manual sobre RDBMS vs BDs distribuidas

La clase identifica el sharding como uno de los tres workarounds históricos sobre RDBMS (junto con tablas-como-columnas y JSON blobs) antes que se popularizaran las [[Bases no relacionales|bases no relacionales]] dedicadas. La pregunta de la cátedra es: **¿en qué momento el sharding manual deja de ser un truco creativo y pasa a ser una migración a NoSQL?**

Heurística:
- Si la app ya gestiona shards + retry logic + reconciliación + JSON blobs → estás reimplementando una BD distribuida sobre MySQL. Migrar a Cassandra / DynamoDB / MongoDB suele ser más barato.
- Si las queries cross-shard son raras y la integridad es manejable a nivel de un solo shard, sharding manual + RDBMS sigue siendo razonable.

## Decisiones canónicas

| Decisión | Opciones | Criterio |
|---|---|---|
| ¿Cuándo shardar? | Vertical scaling / Replicación / Sharding | Cuando un solo nodo no puede sostener el volumen de escrituras + datos, y la replicación P-S no resuelve. |
| ¿Qué shard key? | PK / hash / rango / temporal / geográfica | El que alinee con el **patrón de query dominante**, aplicando localidad. |
| ¿Cuántos shards? | Pocos / muchos | Más shards = más paralelismo pero más overhead de coordinación. Default: empezar con 8-16 y duplicar cuando se agote. |
| ¿Sharding manual o BD distribuida? | RDBMS sharded / Cassandra / DynamoDB | Si ya hay > 2 workarounds creativos sobre el RDBMS, migrar. |
| ¿Cómo rebalancear? | Re-shard manual / consistent hashing | Consistent hashing minimiza el dato a mover ante adición de nodos — usado por Cassandra, DynamoDB, memcached. |

## Pregunta a profundizar

¿Por qué Postgres tardó tanto en tener sharding nativo (Citus fue extension, integrado recién con esfuerzos en versiones recientes), mientras MySQL tuvo Vitess (YouTube) hace una década? ¿Es un tema de cultura técnica o de mercado?

## Lecturas complementarias

- Kleppmann, *Designing Data-Intensive Applications* (2017) cap. 6 — partitioning.
- Karger et al., *Consistent Hashing and Random Trees* (STOC 1997) — paper original.
- Vitess (CNCF) — sharding layer sobre MySQL en producción de YouTube y Slack.
