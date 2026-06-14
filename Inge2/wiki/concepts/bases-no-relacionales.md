---
title: Bases no relacionales
aliases:
  - "Bases no relacionales"
  - "NoSQL"
  - "Bases NoSQL"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [nosql, no-relacional, columnar, clave-valor, documentos, persistencia, schema-less]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
related:
  - "[[Persistencia]]"
  - "[[Bases de datos relacionales]]"
  - "[[Sharding]]"
  - "[[Teorema CAP]]"
  - "[[Map-Reduce]]"
  - "[[Clase 6 — Persistencia]]"
---

# Bases no relacionales

## Origen

> "Comienzan entonces a crearse bases de datos dedicadas que *productizan* estos mecanismos y se los abstraen al cliente."
> (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf)

Hacia 2007-2010, las redes sociales y servicios web masivos pusieron a los [[Bases de datos relacionales|RDBMS]] contra la pared: niveles de concurrencia inéditos, volúmenes que no entran en RAM, y necesidad de cambiar esquemas sin downtime. Las empresas inventaron workarounds creativos sobre RDBMS (sharding manual, JSON blobs, tablas-como-columnas) y eventualmente esos hacks se **productizaron** como motores dedicados.

Como definieron sus propios protocolos (no SQL), inicialmente se llamaron **"NO-SQL"**. Hoy la mayoría soporta algún flavor de SQL, así que **el nombre correcto es "bases no relacionales"** (la cátedra es explícita en este punto, source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf).

## Características compartidas

(source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de datos No Relacionales*):

- **Escalabilidad** — diseñadas para escalar horizontalmente desde el día 1.
- **Distribuidas "por diseño"** — clustering nativo, no añadido.
- **Enormes volúmenes de datos** — TBs/PBs son normales.
- **Esquemas flexibles** — pueden agregarse atributos sin DDL bloqueante.
- **ACID opcional** — algunas lo implementan total, otras parcial, otras eligen consistencia eventual.

Trade-off: ganan en escalabilidad y flexibilidad lo que pierden en garantías transaccionales y queries ad-hoc complejas. Esto se mapea a [[Teorema CAP]]: la mayoría son AP-priorizantes, mientras los RDBMS clásicos son CP-priorizantes.

## Las tres familias

### 1. Columnares (Wide-column)

Los datos se almacenan ordenados **por columna** en lugar de por registro (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases no relacionales - Columnas*).

```
Row-oriented (RDBMS):    [id|name|age|interests]   ← cada fila contigua
Column-oriented:         [id, id, id...] [name, name...] [age, age...]
```

Implicancias:
- **Búsquedas y proyecciones sobre pocas columnas son mucho más rápidas** — sólo se lee la columna relevante.
- **Multi-valor nativo** — `interests = ["Soccer", "Movies"]` se modela limpio.
- **Más difícil**: escrituras o queries que necesiten muchas columnas a la vez (hay que reconstruir la fila desde múltiples archivos).

Productos:
- **BigTable** (Google, paper 2006).
- **Hypertable** (open source, 2016).
- **Cassandra** (Facebook → Apache, 2008).

### 2. Clave-Valor

La estructura más simple: `key → value`, donde `value` puede ser opaco o estructurado (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases no relacionales - Clave/Valor*).

Características:
- **Alta flexibilidad** — agregar atributos no requiere DDL.
- **No lidia con tipos** — el valor es típicamente un blob; la app lo interpreta.
- **Búsquedas multi-campo (AND, OR) son complicadas** — sin queries declarativos sobre el contenido.

Productos:
- **Redis** (2009) — KV en memoria con tipos ricos: strings, hashes, lists, sets, sorted sets.
- **DynamoDB** (Amazon, 2012) — KV gestionado, modelo del paper Dynamo (2007).
- **Memcached** — sólo cache, sin durabilidad (caso degenerado).

### 3. Documentos

Almacenan **documentos arbitrarios** (XML, YAML, **JSON** en la práctica) (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases no relacionales - Documentos*):

- Más fácil guardar estructuras que varían entre instancias.
- Suelen exponer un **protocolo REST** y devolver JSON.
- Consultas complejas (proyecciones, joins) son más difíciles que en SQL.

Productos:
- **MongoDB** (2009) — el más popular; modelo BSON, sharding nativo.
- **ElasticSearch** (2010) — fuerte en búsqueda full-text más que en OLTP general.
- **CouchDB** — eventualmente consistente, replicación P2P.

Las BDs de documentos suelen incluir **sharding nativo** y **map-reduce** (ver [[Map-Reduce]]) para procesar grandes volúmenes en paralelo.

## Decisiones canónicas

| Caso de uso | Familia | Producto típico |
|---|---|---|
| Cache de baja latencia, sesiones, leaderboards | Clave-Valor | Redis |
| Catálogo de productos con esquema variable, blog, CMS | Documentos | MongoDB |
| Logs, métricas, time-series con muchas filas y pocas columnas relevantes | Columnar | Cassandra, ClickHouse |
| Búsqueda full-text, autocompletado, agregaciones sobre logs | Documentos | ElasticSearch |
| Tabla gigantesca con escrituras dispersas y lookups por PK | Columnar / KV | DynamoDB, Cassandra |
| Datos transaccionales con integridad referencial | **NO** — usar [[Bases de datos relacionales|RDBMS]] |

## Polyglot persistence

Pocos sistemas grandes usan **una sola** BD. Lo común es **polyglot persistence**: PostgreSQL para core transaccional, Redis para cache/sesiones, ElasticSearch para búsqueda, S3 + warehouse para analítica histórica. Cada motor en su zona de fortaleza.

El costo: mayor complejidad operativa (varios motores que aprender, monitorear, parchear) y problemas de consistencia entre stores (sincronización via CDC, event-driven updates, etc.).

## Pregunta a profundizar

PostgreSQL moderno soporta JSONB con índices GIN y full-text search nativo. ¿En qué momento un Postgres "creativo" deja de ser preferible a Mongo o ElasticSearch? ¿Cuál es el criterio cuantitativo (volumen, escritura/lectura, latencia)?

## Lecturas complementarias

- Sadalage & Fowler, *NoSQL Distilled* (2012) — introducción canónica.
- Kleppmann, *Designing Data-Intensive Applications* (2017) caps. 2-3 — modelo de datos y storage engines.
- Chang et al., *Bigtable: A Distributed Storage System for Structured Data* (OSDI 2006).
- DeCandia et al., *Dynamo: Amazon's Highly Available Key-value Store* (SOSP 2007).
- Lakshman & Malik, *Cassandra: A Decentralized Structured Storage System* (LADIS 2009).
