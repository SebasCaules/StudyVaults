---
title: Partition, Replicate, Index
aliases:
  - "Partition, Replicate, Index"
  - "Partition Replicate Index"
  - "Particionado replicación e indexado"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [escalabilidad, sistemas-distribuidos, principio-de-diseño, kallen, twitter]
sources:
  - "raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf"
related:
  - "[[Sharding]]"
  - "[[Replicación de BD]]"
  - "[[Bases no relacionales]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Clase 6 — Big Data en tiempo real (Twitter)]]"
  - "[[Principio de localidad]]"
  - "[[Off-line vs Online computation]]"
---

# Partition, Replicate, Index

## El mantra

> "Scalability solutions aren't magic. They involve **partitioning, indexing, and replication**."
> (Kallen, source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* final)

Es la **tesis central** del paper de Kallen sobre big data en tiempo real en Twitter: detrás de cada sistema escalable hay alguna combinación de estos tres mecanismos, ningún otro. La cita aparece dos veces en el deck —al cerrar la sección de social graphs y como conclusión general— para enfatizar que no hay magia: cualquier solución se reduce a estos tres ladrillos.

## Los tres mecanismos

### 1. Partitioning ([[Sharding]])

Dividir el dataset en N subconjuntos disjuntos, cada uno servido por nodos distintos.

- Permite que cada nodo **lidie con un volumen menor** → índices entran en RAM, queries son más rápidas.
- Permite **paralelismo** — varios nodos procesan en simultáneo.
- Permite **escalado horizontal** sin tope físico de un solo nodo.

Decisión central: **el shard key**. Twitter probó tres antes de elegir partition-by-time, guiándose por [[Principio de localidad]] (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Possible implementations*).

### 2. Replication

Tener N copias de los mismos datos en nodos distintos.

- **Disponibilidad**: si un nodo cae, otro responde.
- **Throughput de lectura**: las copias pueden servir lecturas en paralelo.
- **Latencia geográfica**: réplicas regionales acercan datos al usuario.

Modelos: Primario-Secundario, Primario-Primario, sincrónica/asincrónica. Ver [[Replicación de BD]].

### 3. Indexing

Estructuras auxiliares que aceleran el acceso a un subconjunto de los datos.

- **Índices primarios** — sobre la clave de partición.
- **Índices secundarios** — sobre otros atributos. Twitter usa este patrón explícito: en su solución a futuro para tweets, mantienen un secondary index manual sobre `user_id` además del primary key partitioning (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Future solution*).
- **Índices invertidos** (search indices) — del término al documento. Caso del problema de Search Index en Twitter (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *What is a Search Index?*).
- **Índices precalculados / vistas materializadas** — anticipar queries comunes. Los **timelines** de Twitter son índices materializados con fanout off-line (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Current Implementation* timelines).

Los índices son **materialización selectiva** — pagás escrituras y storage para reducir el costo de las lecturas que más importan.

## Por qué los tres son complementarios

Cada uno cubre un eje distinto:

| Mecanismo | Resuelve | No resuelve |
|---|---|---|
| Partition | Volumen + paralelismo | Disponibilidad ante caída de nodo |
| Replicate | Disponibilidad + throughput de lectura | Volumen (todos tienen los mismos datos) |
| Index | Velocidad de queries específicos | Volumen ni disponibilidad |

Por eso los sistemas grandes hacen los **tres simultáneamente**: shardear por una clave, replicar cada shard para HA, y mantener índices secundarios sobre las queries no soportadas naturalmente por la partición.

## Aplicación al menú de cuatro problemas de Twitter

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf):

| Problema | Partition | Replicate | Index |
|---|---|---|---|
| **Tweets** | Por tiempo | MySQL P-S → Cassandra | Secondary index sobre user_id |
| **Timelines** | Por user_id | Memcached masivo | Materialización via fanout off-line |
| **Social graphs** | Por user_id | Forward + Backward (cada edge se guarda dos veces) | Por tiempo, por elemento (set algebra), cardinalidad denormalizada |
| **Search indices** | Por documento + por tiempo | (implícito en Lucene) | El índice **es** el dato — posting lists |

Cada problema combina los tres mecanismos en proporciones distintas según su perfil: alta cardinalidad y baja durabilidad para timelines, alta durabilidad y queries de set algebra para social graphs, etc.

## Decisiones canónicas

| Pregunta | Heurística |
|---|---|
| ¿Por dónde empezar? | **Partition first** — particionar es lo que más escala. Replicar y agregar índices vienen después. |
| ¿Cuándo agregar replicación? | Cuando la app no tolera caída de un solo nodo, o cuando las lecturas exceden la capacidad de un nodo. |
| ¿Cuándo agregar índice secundario? | Cuando una query frecuente requiere consultar muchas particiones (scatter-gather costoso). |
| ¿Cuándo materializar (precalcular)? | Cuando el cómputo de la query es bounded y predecible, y la query es más frecuente que el evento que invalida el cache. Ver [[Off-line vs Online computation]]. |

## Pregunta a profundizar

¿Qué falta en este modelo? Kallen no menciona explícitamente caches (¿es indexing en otra escala?), batching de escrituras, ni denormalización agresiva (¿es indexing también?). ¿Son estos sub-casos o mecanismos independientes?

## Lecturas complementarias

- Kallen, *Big Data in Real-Time at Twitter* (QCon 2010) — la fuente.
- DeWitt & Gray, *Parallel Database Systems: The Future of High Performance Database Systems* (CACM 1992) — análogo en BD relacionales: partition + index.
- Kleppmann, *Designing Data-Intensive Applications* (2017) — capítulos 5 (replication), 6 (partitioning), 3 (indexing).
