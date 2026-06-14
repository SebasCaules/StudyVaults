---
title: Bases de datos relacionales
aliases:
  - "Bases de datos relacionales"
  - "RDBMS"
  - "OLTP"
  - "SQL databases"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [rdbms, sql, oltp, acid, algebra-relacional, persistencia]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
related:
  - "[[Persistencia]]"
  - "[[OLAP y ETL]]"
  - "[[ORM e impedancia objeto-relacional]]"
  - "[[Replicación de BD]]"
  - "[[Sharding]]"
  - "[[Teorema CAP]]"
  - "[[Bases no relacionales]]"
  - "[[Clase 6 — Persistencia]]"
---

# Bases de datos relacionales

## Definición operativa

Sistema de gestión de datos basado en el **modelo relacional** de Codd (1970): los datos se organizan en tablas (relaciones de filas y columnas), las relaciones entre datos se expresan con foreign keys, y las consultas se formulan en un lenguaje declarativo basado en **álgebra relacional y teoría de conjuntos** (typically SQL) (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf).

Características destacadas en clase:

- **Tablas, constraints, keys** — primary keys, foreign keys, unique, check, not null.
- **Normalización** — el diseño busca eliminar redundancia (1NF, 2NF, 3NF, BCNF).
- **OLTP (Online Transaction Processing)** — el caso de uso canónico: muchas transacciones cortas, alta concurrencia, ACID.

## Por qué la cátedra las defiende como default

(source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos*):

1. **Independencia física** — el almacenamiento se abstrae del modelo lógico; índices, particiones y storage engines pueden cambiar sin tocar el SQL.
2. **Acceso concurrente seguro** — bloqueos, MVCC, niveles de aislamiento (read committed, repeatable read, serializable).
3. **Recuperabilidad** — write-ahead logs, point-in-time recovery, replicación.
4. **Reglas de integridad** — constraints, triggers, cascadas, transacciones ACID.
5. **Performance y escalabilidad** — índices, query planners, caches, replicación.
6. **Cómputo en la base** — stored procedures, vistas materializadas. **Hoy en desuso**: trae problemas operativos (versionado, rollback, progressive rollouts) — la cátedra explícitamente lo desaconseja.

## OLTP vs OLAP

| Eje | OLTP | OLAP |
|---|---|---|
| Carga típica | Muchas writes cortas + lookups por PK | Pocas queries muy pesadas con agregaciones |
| Tamaño | Datos vivos, normalizados | Histórico, **desnormalizado** |
| Esquema | 3NF | Star/snowflake, agregaciones precalculadas |
| Latencia | < 10 ms por transacción | Segundos a minutos por query |
| Mutabilidad | INSERT/UPDATE/DELETE | **Append-only** |
| Cómo se popula | Acceso directo desde la app | Por **ETL** desde una OLTP |

Detalle de OLAP: ver [[OLAP y ETL]].

## Trade-offs y limitaciones

La clase narra cómo, hacia 2007-2008, las redes sociales empujaron los RDBMS más allá de su zona de confort (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos Relacionales - Escalabilidad*):

- **Concurrencia sin precedentes** — race conditions latentes durante décadas explotaron.
- **Cambios de esquema sin downtime** — operaciones DDL bloquean tablas enteras.
- **Volúmenes que no entran en RAM** — los índices dejan de fittear, las queries se vuelven I/O-bound.

Frente a esto, las empresas inventaron tres workarounds creativos antes de migrar:

1. **[[Sharding]]** — partir la base en N copias estructuralmente iguales con datos disjuntos.
2. **Tablas como columnas** — una tabla por atributo (id+valor); permite agregar columnas sin downtime, a costa de joins múltiples.
3. **JSON blobs no estructurados** — popularizado por **FriendFeed (2009)** sobre MySQL: una tabla `(uuid, json_blob)` con tablas auxiliares como índices secundarios (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *JSON Blobs*).

Estos hacks salvan limitaciones pero **degradan al RDBMS**: la app se llena de lógica ad-hoc, y el motor pierde consistencia y transaccionalidad. La pregunta de la cátedra: *"¿Estamos usando la base de datos como tal?"* — si no, el ahorro del cambio se evaporó. Es lo que motiva la aparición de [[Bases no relacionales|bases no relacionales]] como productos dedicados.

## Escalabilidad

Las RDBMS pueden escalar (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos Relacionales - Escalabilidad*):

- **Verticalmente** — más CPU, más RAM, más IOPS. Simple, caro, con tope físico.
- **Horizontalmente** — distribuir entre nodos. Dos modelos:
  - **Primario–Secundario (Primary–Replica)** — todas las escrituras al primario; replicación asincrónica a N réplicas de sólo-lectura. Ante caída del primario, se elige un secundario. Es el modelo más soportado.
  - **Primario–Primario (multi-master)** — todos los nodos aceptan lecturas y escrituras. Resuelve el cuello de escritura, pero genera conflictos de concurrencia (¿quién asigna autoincrementales?), requiere fibra óptica + co-ubicación + kernel modules específicos, y el overhead de sincronización escala como **O(N²)** mientras la capacidad útil escala como O(N) — hay un techo duro al tamaño del cluster.

Ver [[Replicación de BD]] para el detalle.

## Decisiones canónicas

| Decisión | Opciones | Recomendación cátedra |
|---|---|---|
| Carga mixta OLTP+OLAP en mismo motor | Sí / Separar con ETL | **Separar siempre.** Ver [[OLAP y ETL]]. |
| Lógica en stored procedures | Sí / No | **No** — viola CI/CD, dificulta versionado y rollback. |
| Escalado horizontal multi-master | Sí / No | Sólo con vendor que lo soporte (Oracle RAC, MySQL Galera) y con presupuesto para fibra + DBAs. Tope práctico ~8-16 nodos. |
| Sharding manual sobre RDBMS | Sí / Migrar a NoSQL | Si la app ya tiene lógica ad-hoc para shards y JSON blobs, considerar migrar a una BD no relacional dedicada. |

## Pregunta a profundizar

Postgres moderno soporta JSONB con índices GIN; ¿en qué momento un Postgres "creativo" deja de ser preferible a Mongo o Cassandra? ¿Cuál es el criterio cuantitativo?

## Lecturas complementarias

- Codd, *A Relational Model of Data for Large Shared Data Banks* (CACM 1970).
- Date, *An Introduction to Database Systems* (canónico de la teoría relacional).
- Stonebraker et al., *The End of an Architectural Era* (VLDB 2007) — argumentaba que los RDBMS de propósito general son obsoletos; influyó en la ola NoSQL.
