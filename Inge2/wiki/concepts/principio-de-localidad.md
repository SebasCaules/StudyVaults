---
title: Principio de localidad
aliases:
  - "Principio de localidad"
  - "Localidad"
  - "Localidad temporal"
  - "Localidad espacial"
  - "Locality"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [localidad, locality, cache, sharding, performance, sistemas-distribuidos]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
  - "raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf"
related:
  - "[[Sharding]]"
  - "[[Bases no relacionales]]"
  - "[[Memory hierarchy]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Clase 6 — Persistencia]]"
  - "[[Clase 6 — Big Data en tiempo real (Twitter)]]"
---

# Principio de localidad

## Enunciado

> "Es clave entender qué datos se acceden juntos, y se deben guardar juntos. Esto se conoce como Principio de Localidad."
> (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Sharding* desafíos)

Es un principio rector heredado del diseño de **caches y memorias** ([[Memory hierarchy]]) y aplicado a sistemas distribuidos: si dos piezas de datos se consultan juntas con alta probabilidad, deben **co-ubicarse** físicamente para minimizar latencia y maximizar el efecto cache.

## Tipos de localidad

Los conceptos vienen de la jerarquía de memoria clásica (Hennessy-Patterson) pero aplican a sharding y placement de datos:

### 1. Localidad espacial

> Si accedo al dato en posición `i`, es probable que pronto acceda al dato en posición `i+1`.

En BDs: **agrupar registros relacionados** en el mismo shard o página de disco. Ejemplo: tweets del mismo usuario juntos, productos de la misma categoría juntos. Habilita **prefetching**: el sistema lee de antemano los registros adyacentes.

Aplicaciones:
- **Clustered indexes** en RDBMS — la tabla se ordena físicamente por la clave del índice.
- **Sharding por user_id** cuando la query típica es "todos los datos del user X".
- **Bases columnares** — una columna entera contigua acelera proyecciones.

### 2. Localidad temporal

> Si accedo al dato en el tiempo `t`, es probable que vuelva a acceder a ese dato pronto.

Aplicaciones:
- **Caches** (Memcached, Redis, browser cache, CPU cache) — todo cache existe por localidad temporal.
- **Sharding por tiempo**: Twitter para tweets — los tweets recientes se piden mucho más que los antiguos. *"New tweets are requested most frequently, so usually only 1 partition is checked"* (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles*). Ver [[Caso Twitter — Big Data en tiempo real]].
- **TTL en cache**: la mayoría de las entradas son consultadas en una ventana corta tras crearse.

## Aplicaciones arquitectónicas

| Decisión | Pregunta a hacerse |
|---|---|
| Shard key | ¿Qué patrón de query domina? Particionar por esa dimensión preserva localidad espacial. |
| Cache TTL / política de eviction | ¿Hay localidad temporal fuerte? LRU funciona bien si sí. |
| Denormalización en OLAP | ¿Qué columnas se leen juntas? Co-ubicarlas en la misma tabla evita joins costosos. |
| Replicación geográfica | ¿Los usuarios de cada región acceden mayormente a datos locales? Localidad geográfica. |
| Layout columnar vs row | ¿Las queries leen muchas filas con pocas columnas (columnar)? ¿O pocas filas con muchas columnas (row)? |

## Twitter como ejemplo

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf):

Twitter eligió **partition by time** para tweets explotando localidad temporal — el escenario típico (timeline de tweets recientes) se resuelve consultando un solo shard. Casos atípicos (buscar un tweet por id antiguo) son más lentos pero menos frecuentes.

Esta es una **decisión de diseño deliberada** alineada al patrón de uso real, en vez de buscar una distribución uniforme abstracta. La cátedra usa este caso para ilustrar que **la elección de shard key es de las decisiones más arquitectónicas que existen** — condiciona qué queries son baratas y cuáles caras.

## Antipatrón: ignorar la localidad

Síntomas:
- Cada query consulta todos los shards (**scatter-gather**) — el sharding no compra escalabilidad porque cada query sigue tocando todo.
- El cache hit rate es bajísimo porque las claves son uniformes y no hay datos calientes.
- Queries de rango son lentas porque los datos relacionados están dispersos por hash uniforme.

Cura: rediseñar el shard key alineándolo al patrón de query dominante, aceptando que **los casos raros pagarán un costo**.

## Pregunta a profundizar

¿En qué casos **violar localidad** es la decisión correcta? Ejemplo: hash uniforme **anti-localidad** se usa explícitamente para evitar **hot shards** cuando la distribución natural está muy sesgada (ej: 1% de usuarios concentra 90% del tráfico, particionar por user_id crearía un shard caliente). Hay un trade-off entre localidad y balanceo de carga.

## Lecturas complementarias

- Hennessy & Patterson, *Computer Architecture: A Quantitative Approach* — tratamiento canónico de localidad en CPU.
- Denning, *The Locality Principle* (CACM 2005) — ensayo histórico.
- Kleppmann, *Designing Data-Intensive Applications* (2017) cap. 6 — partitioning revisitando localidad.
