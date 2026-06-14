---
title: Map-Reduce
aliases:
  - "Map-Reduce"
  - "MapReduce"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [map-reduce, paralelismo, distribuido, big-data, hadoop, paradigma-funcional]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
related:
  - "[[Bases no relacionales]]"
  - "[[Persistencia]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Clase 6 — Persistencia]]"
---

# Map-Reduce

## Idea

Patrón para **procesar grandes volúmenes de datos en paralelo distribuyendo el cómputo entre nodos**. Proviene del paradigma funcional (las funciones `map` y `reduce` de LISP/Scheme) y fue popularizado por Google en 2004 (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Map-Reduce*).

El cómputo se divide en tres fases:

1. **Map**: cada nodo aplica una función `f` a su porción de datos, produciendo pares `(clave, valor)` intermedios.
2. **Shuffle**: el sistema agrupa los pares intermedios por clave y los redistribuye entre nodos.
3. **Reduce**: cada nodo recibe todos los valores de un subconjunto de claves y aplica una función `g` para agregar.

## Ejemplo canónico (slide de la cátedra)

Word count sobre `[DVD Blu-ray, CD DVD, CD CD CD, CD Video, Blu-ray DVD]`:

- **Map** (3 workers en paralelo):
  - Worker 1: `[(Blu-ray,1), (DVD,1)]`, `[(CD,1), (DVD,1)]`
  - Worker 2: `[(CD,1), (CD,1), (CD,1)]`
  - Worker 3: `[(CD,1), (Video,1)]`, `[(Blu-ray,1), (DVD,1)]`
- **Shuffle**: agrupa por clave. Todos los `CD` van al mismo reducer; todos los `DVD` al mismo; etc.
- **Reduce** (2 workers): `Blu-ray:2, CD:5, DVD:3, Video:1`.

## Ventajas

- **Provee escalabilidad y performance al distribuir el cómputo** entre N máquinas commodity (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf).
- **Tolerante a fallos** — los workers que mueren se reagendan; los datos están replicados.
- **Modelo simple** — el desarrollador escribe sólo `map` y `reduce`; el framework gestiona partition, shuffle, retry, agregación.
- **Independiente del lenguaje** — Hadoop streaming permite map y reduce en cualquier ejecutable.

## Limitaciones

- **Dificulta operaciones como proyecciones** — un join entre datasets requiere coreografía manual con varias rondas de map-reduce.
- **Latencia alta** — fase de shuffle implica I/O masivo. **No sirve para queries online** (Twitter es explícito: *"Not talking about Hadoop and other high-latency, Big Data tools"*) — ver [[Caso Twitter — Big Data en tiempo real]].
- **Modelo rígido** — no todas las computaciones encajan naturalmente en map+reduce; algunas requieren múltiples rondas, complicando el código.
- **Operaciones iterativas (machine learning, grafos)** son ineficientes — cada iteración relee desde disco.

## Productos y evolución

- **Google MapReduce** (2004) — la implementación original, paper seminal.
- **Hadoop MapReduce** (2006) — implementación open source que dominó la era big-data.
- **Spark** (2014) — sucesor; mantiene el modelo pero opera en memoria con DAGs de transformaciones, eliminando los costos de I/O entre fases. Hoy es el default.
- **Flink, Beam** — modelos de streaming + batch unificados; herederos modernos.

El patrón **sigue vigente** dentro de muchas BDs no relacionales y warehouses como mecanismo interno para queries distribuidas, aunque los desarrolladores raramente escriben map/reduce a mano.

## Relación con persistencia

Map-Reduce no es una BD: es un **modelo de cómputo sobre datos persistentes**. Suele combinarse con:
- **HDFS** (Hadoop Distributed File System) — almacenamiento.
- **Bases de datos columnares** ([[Bases no relacionales|Cassandra, BigQuery]]) que ejecutan internamente algoritmos análogos a map-reduce sobre sus shards para queries agregados.
- **MongoDB** soporta map-reduce embebido para queries complejas (cada vez menos usado, reemplazado por aggregation framework).

Por eso la cátedra lo trata dentro de la clase de Persistencia: la frontera entre "almacenamiento" y "procesamiento" se difumina cuando los datos no entran en una sola máquina.

## Decisiones canónicas

| Caso | Recomendación |
|---|---|
| Procesar dataset que no entra en RAM, batch nocturno | Spark sobre HDFS / S3 |
| Query analítica ad-hoc sobre TB | Warehouse moderno (Snowflake, BigQuery) — ya lo implementan internamente |
| Pipeline en tiempo real | **NO map-reduce clásico** — usar streaming (Kafka Streams, Flink) |
| ML iterativo | Spark MLlib o frameworks dedicados (PyTorch distribuido) |

## Pregunta a profundizar

Spark y Flink básicamente **soltaron la API map-reduce** en favor de DataFrames y SQL. ¿Significa esto que map-reduce como modelo está muerto, o sólo que el modelo se enterró en capas inferiores?

## Lecturas complementarias

- Dean & Ghemawat, *MapReduce: Simplified Data Processing on Large Clusters* (OSDI 2004) — paper original de Google.
- White, *Hadoop: The Definitive Guide* (4ª ed., 2015).
- Zaharia et al., *Resilient Distributed Datasets* (NSDI 2012) — paper de Spark.
