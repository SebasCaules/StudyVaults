---
title: Memory hierarchy
aliases:
  - "Memory hierarchy"
  - "Jerarquía de memoria"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [memoria, jerarquia, latencia, cache, performance, kallen]
sources:
  - "raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf"
related:
  - "[[Off-line vs Online computation]]"
  - "[[Principio de localidad]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Bases no relacionales]]"
  - "[[Clase 6 — Big Data en tiempo real (Twitter)]]"
  - "[[Partition, Replicate, Index]]"
---

# Memory hierarchy

## Idea

Los medios de almacenamiento forman una **jerarquía** de capas, cada una con un trade-off entre velocidad, capacidad y costo. Diseñar un sistema escalable implica **decidir conscientemente en qué capa vive cada dato** según cómo se accede.

Capas típicas (de más rápida y cara a más lenta y barata):

| Capa | Latencia (ns) | Capacidad típica | Costo relativo |
|---|---|---|---|
| Registros CPU | < 1 | bytes | altísimo |
| L1 cache | ~1 | 32-64 KB | muy alto |
| L2 cache | ~5 | 256 KB - 1 MB | alto |
| L3 cache | ~20 | 4-32 MB | moderado |
| RAM | ~100 | GB | medio |
| SSD NVMe | ~100,000 | TB | bajo |
| HDD | ~10,000,000 | TB | muy bajo |
| Red local (mismo DC) | ~500,000 | – | – |
| Red WAN | 10⁷-10⁸ | – | – |
| Cinta / archive | ~10¹¹ | PB | mínimo |

(Ordenes de magnitud aproximados — ver "Latency Numbers Every Programmer Should Know" de Norvig/Dean.)

Cada **escalón** representa un factor 10×-100× en latencia. Bajar de RAM a SSD ya es 1000×; de SSD a red WAN otro 100-1000×.

## El principio aplicado a sistemas

> "Keep the memory hierarchy in mind."
> (Kallen, source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* — sección Timelines)

Y en el cierre:

> "All data for real-time queries **MUST** be in memory. **Disk is for writes only**."
> (source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Principles* final)

Es una postura fuerte: en sistemas con SLA de milisegundos, **el path crítico no toca disco**. El disco existe sólo como medio durable (write-ahead logs, snapshots, backups). Las lecturas que servís a usuarios deben venir de RAM (Memcached, Redis, in-memory store del motor de BD).

## Caso Twitter — fanout a memoria, no a disco

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slide *Possible implementations* timelines):

Para implementar timelines, Kallen evaluó dos opciones:

- **Fanout a disco**: escribir el tweet id de cada follower en disco. *"Ridonculous number of IOPS required, even with fancy buffering techniques."* Inviable.
- **Fanout a memoria**: escribir en Memcached. *"Good if cardinality of corpus × bytes/datum not too many GB."*

Twitter eligió memoria. Las timelines son **non-durable** según la tabla de summary statistics — si Memcached cae, se reconstruyen merging los timelines de los seguidos. El costo de reconstrucción × probabilidad de falla es aceptable; el costo de IOPS no lo era.

## Las tres lecciones de Kallen

(source: raw/classes/2026-04-23 - Clase 6/big-data-in-real-time-at-twitter.pdf, slides finales):

1. **All data for real-time queries MUST be in memory.** Si tu SLA es < 100ms y tocás disco, ya perdiste.
2. **Disk is for writes only.** Para durabilidad (WAL, snapshots), no para servir lecturas.
3. **Exploit locality where possible** — si necesitás tocar storage más lento, usá [[Principio de localidad]] para que sea raro.

Estas tres reglas combinadas con los **mecanismos** (partition, replicate, index — ver [[Partition, Replicate, Index]]) y el **timing del cómputo** ([[Off-line vs Online computation]]) son la receta completa.

## Aplicación generalizada

Más allá de Twitter, el principio aparece en:

- **CPUs modernos** — los compiladores reordenan código para maximizar L1/L2 hit rates.
- **Bases columnares** — leer una columna entera contigua aprovecha prefetch y cache de L1/L2.
- **Redis y Memcached** — productizan la idea: una BD que **es** memoria.
- **Storage layers en arquitecturas modernas** — capa caliente (Redis), tibia (SSD-backed BD), fría (S3/Glacier). Datos migran según patrón de acceso.
- **CDNs** — caching geográficamente distribuido para evitar el WAN.

## Decisiones canónicas

| Pregunta | Heurística |
|---|---|
| ¿Dónde guardo este dato? | ¿Cuál es el SLA de la query más exigente sobre este dato? Si < 10ms, RAM. Si segundos OK, SSD. Si batch nightly, HDD/object storage. |
| ¿Necesito durabilidad? | Si sí: write a WAL en disco + memoria. Si no: memoria pura (acepto pérdida en crash). |
| ¿Cuánto cabe en RAM? | RAM × nodos del cluster. Si supera, requiere shardear o aceptar acceso a disco. |
| ¿Cómo invalido cache? | TTL conservador + write-through cuando posible + reconstrucción on miss. |

## Pregunta a profundizar

NVMe SSDs modernos tienen latencias < 10μs (Optane, hace años; flash moderno ~50-100μs). ¿Sigue siendo válido el dictum *"Disk is for writes only"* en 2026, o el techo se movió? ¿Cuándo conviene dejar de tener una capa Memcached y leer directo del SSD?

## Lecturas complementarias

- Hennessy & Patterson, *Computer Architecture: A Quantitative Approach* — tratamiento canónico.
- Norvig (Google), *Latency Numbers Every Programmer Should Know* — la tabla de referencia.
- Dean, *Numbers Everyone Should Know* (charla en Google).
- Bryant & O'Hallaron, *Computer Systems: A Programmer's Perspective* (3ª ed., 2015) — capítulo 6 sobre memoria.
