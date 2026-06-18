---
title: Clase 6 — Persistencia
aliases:
  - "Clase 6 — Persistencia"
  - "Persistencia (clase)"
  - "Clase 5 — Persistencia"
type: class
created: 2026-05-06
updated: 2026-05-12
tags: [persistencia, rdbms, nosql, sharding, cap, replicacion, orm, map-reduce]
sources:
  - raw/classes/2026-04-16 - Clase 5/Clase 5.pdf
date: 2026-04-23
related:
  - "[[Clase 5 — Documentación de arquitecturas]]"
  - "[[Clase 6 — Big Data en tiempo real (Twitter)]]"
  - "[[Prevalencia]]"
  - "[[Bases de datos relacionales]]"
  - "[[OLAP y ETL]]"
  - "[[Bases de datos de objetos]]"
  - "[[Bases no relacionales]]"
  - "[[Persistencia]]"
  - "[[ORM e impedancia objeto-relacional]]"
  - "[[Replicación de BD]]"
  - "[[Teorema CAP]]"
  - "[[Sharding]]"
  - "[[Map-Reduce]]"
  - "[[Principio de localidad]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
---

# Clase 6 — Persistencia

> **Nota sobre los archivos `raw/`:** la cátedra distribuyó el slide deck con filename `Clase 5.pdf` (vive en `raw/classes/2026-04-16 - Clase 5/Clase 5.pdf`). Sin embargo, según las notas de clase, **el 2026-04-16 se dictó Documentación de Arquitecturas** ([[Clase 5 — Documentación de arquitecturas]]), no Persistencia. Persistencia fue dictada el **2026-04-23** (jueves siguiente), junto con [[Clase 6 — Big Data en tiempo real (Twitter)|el caso Twitter]] como aplicación integral. La numeración del wiki refleja el orden cronológico real. El alias `Clase 5 — Persistencia` se conserva para wikilinks legacy.

## TL;DR

Toda decisión sobre cómo y dónde guardar datos es arquitectónica: condiciona performance, integridad, escalabilidad y costo de evolución. La clase recorre el menú completo —archivos planos, [[Prevalencia|prevalencia]], [[Bases de datos relacionales|RDBMS]] (OLTP/[[OLAP y ETL|OLAP]]), [[Bases de datos de objetos|OODBMS]], [[Bases no relacionales]] (columnar / KV / documentos)— y los criterios para elegir entre ellos. La narrativa central: el RDBMS dominó por décadas hasta que la web 2.0 lo empujó al borde, generando workarounds creativos (sharding, JSON blobs) que eventualmente se productizaron como NoSQL.

## Mapa conceptual

- [[Persistencia]] — definición, criterios (performance, transformación, tolerancia a fallos), taxonomía.
- Archivos: planos (CSV ancho fijo / variable), estructurados (XML, JSON), binarios (indexados, serializados).
- [[Prevalencia]] — patrón in-memory + WAL + snapshots (Prevayler, Madeleine, Bamboo).
- [[Bases de datos relacionales]] — OLTP, álgebra relacional, normalización, ACID.
- [[OLAP y ETL]] — reporting analítico desnormalizado, append-only, populado por batch.
- [[Bases de datos de objetos]] — herencia y polimorfismo nativos; nicho.
- [[ORM e impedancia objeto-relacional]] — el choque modelo objetos ↔ tuplas, y los frameworks que lo mitigan.
- [[Replicación de BD]] — Primario-Secundario y Primario-Primario; trade-offs O(N²).
- [[Teorema CAP]] — Consistency / Availability / Partition tolerance: hay que elegir.
- [[Sharding]] — partir la base; localidad como guía del shard key.
- [[Bases no relacionales]] — columnar (Cassandra, BigTable), KV (Redis, DynamoDB), documentos (MongoDB, ElasticSearch).
- [[Map-Reduce]] — paradigma funcional para procesar volúmenes distribuidos.
- [[Principio de localidad]] — espacial y temporal; co-ubicar lo que se accede junto.

## Desarrollo

### Qué es persistencia

> "La persistencia es la característica de los datos, que sobreviven al programa que los genera."
> (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *¿Qué es la persistencia?*)

Necesaria porque la memoria es **volátil** (se pierde al apagar) y **acotada** (es cara). Toda decisión arquitectónica de persistencia balancea tres ejes (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *¿Qué es la persistencia?* — criterios):

1. **Performance** — acceso al medio (memoria/disco), eficiencia de búsquedas.
2. **Transformación de datos** — fidelidad al modelo de la aplicación.
3. **Tolerancia a fallos** — recuperación ante caída.

### El menú de mecanismos

#### Archivos

Soluciones más simples y baratas. La clase los clasifica en (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Archivos*):

- **Planos**: ancho fijo o ancho variable (CSV).
- **Estructurados**: XML (y por extensión JSON, YAML).
- **Binarios**: archivos indexados, serialización del lenguaje.

Bueno para configuración, logs, datasets read-only de tamaño moderado. Mal para concurrencia, búsquedas complejas, integridad transaccional.

#### Prevalencia

Los datos viven en memoria como objetos del lenguaje; las transacciones se loguean a disco y se hacen snapshots periódicos (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Prevalencia*). Performance enorme, transparencia total. Limitación: la app debe caber en RAM. Implementaciones: Prevayler (Java), Madeleine (Ruby), Bamboo (.NET). Ver [[Prevalencia]].

#### Bases de datos

Los beneficios canónicos (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos*):

- Independencia física del almacenamiento.
- Acceso concurrente seguro entre múltiples programas.
- Recuperación ante fallos.
- Reglas de integridad declarativas.
- Performance y escalabilidad.
- Cómputo dentro de la base (stored procs) — **hoy en desuso** por problemas operativos (versionado, rollback, progressive rollouts).

### Bases relacionales

#### OLTP (transaccionales)

Modelo de Codd: tablas, relaciones, álgebra relacional, normalización. Diseñadas para muchas transacciones cortas con ACID (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos Relacionales Transaccionales (OLTP)*). Ver [[Bases de datos relacionales]].

#### OLAP (multidimensionales)

Misma teoría relacional, pero para **reporting**. Esquema **desnormalizado**, **append-only**, **agregaciones precalculadas**. Se popula desde una OLTP via **ETL — Extract, Transform & Load** (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos Multidimensionales (OLAP)*). Ver [[OLAP y ETL]].

### Bases de datos de objetos

Guardan objetos complejos directamente, con herencia y polimorfismo nativos (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos de Objetos*). Casi nunca elegidas en producción moderna por falta de ecosistema. Ver [[Bases de datos de objetos]].

### ORM e impedancia objeto-relacional

El **choque** entre el modelo de objetos y el almacenamiento de tuplas (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Impedancia Objeto-Relacional*): inflexibilidad de tablas (no polimorfismo), falta de herencia, identidad vs PK, interfaces de datos vs comportamiento, FKs unidireccionales vs relaciones bidireccionales.

**ORM** = frameworks que mapean objetos ↔ tablas, automatizan CRUD, generan SQL. Facilitan la programación a costa de **performance** (queries subóptimas, N+1) y **complejidad** (capa más a debuggear). Ver [[ORM e impedancia objeto-relacional]].

### Escalabilidad de RDBMS

#### Vertical y horizontal

Vertical (más CPU/RAM/IOPS): simple, caro, con tope físico. Horizontal: distribuir entre nodos. Dos modelos de [[Replicación de BD|replicación]]:

- **Primario-Secundario** — escrituras al primario, lecturas distribuidas. Modelo más soportado.
- **Primario-Primario (multi-master)** — todos los nodos aceptan escrituras. Resuelve cuello de escritura, pero coordinación O(N²) sobre capacidad O(N) limita el cluster a ~8-16 nodos. Requiere fibra óptica + co-ubicación + kernel modules específicos.

#### El [[Teorema CAP]]

> En un sistema distribuido, ante una **partición de red**, hay que elegir entre **Consistencia** y **Disponibilidad**.

Visto como el diagrama de Venn de Brewer (CA / CP / AP) (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Teorema CAP*). Ver [[Teorema CAP]] para el desarrollo.

### La crisis de los RDBMS (2007-2008)

> "En torno a 2007-2008, las bases de datos relacionales entran en crisis. Las redes sociales estresan estos sistemas a niveles sin precedentes."
> (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos Relacionales - Escalabilidad*)

Los problemas:

1. **Niveles de concurrencia inéditos** — cuellos de botella de performance, race conditions latentes durante décadas.
2. **Necesidad de modificar esquemas sin downtime** — operaciones DDL bloquean tablas enteras.
3. **Volúmenes sin precedentes** — tablas cuyos índices ya no entran en memoria.

Las empresas inventaron tres workarounds creativos sobre RDBMS:

- **[[Sharding]]** — partir la base en N copias estructuralmente iguales con datos disjuntos. La app debe saber a qué shard ir ([[Principio de localidad]]); la integridad cross-shard la provee la app (2PC, retry, last-write-wins).
- **Tablas como columnas** — una tabla por atributo (id+valor). Crear nueva "columna" = crear nueva tabla, sin downtime. Costo: queries con muchos joins.
- **JSON blobs no estructurados** — popularizado por **FriendFeed (2009)** sobre MySQL: `(uuid, json_blob)` con tablas auxiliares como índices secundarios (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *JSON Blobs*).

La pregunta crítica de la cátedra: *"¿Estamos usando la base de datos como tal?"* Si toda la integridad y consistencia las gestiona la app y el RDBMS sólo aporta storage, entonces el ahorro del cambio se evaporó. Esto motiva las **bases dedicadas** que productizan los hacks: las [[Bases no relacionales|bases no relacionales]].

### Bases no relacionales

> "Comienzan a crearse bases de datos dedicadas que *productizan* estos mecanismos y se los abstraen al cliente. […] Inicialmente llamadas *NO-SQL*; el nombre correcto es *bases no relacionales*."
> (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf)

Características compartidas: escalabilidad por diseño, distribuidas nativamente, esquemas flexibles, ACID opcional. Tres familias:

| Familia | Cómo guardan | Productos | Usos típicos |
|---|---|---|---|
| **Columnar** | Datos ordenados por columna; cada columna contigua | BigTable, Hypertable, **Cassandra** | Búsquedas/proyecciones rápidas sobre pocas columnas; logs, métricas, time-series |
| **Clave-Valor** | Pares `key → value` con value opaco o estructurado | **Redis**, DynamoDB | Cache, sesiones, leaderboards, alta flexibilidad |
| **Documentos** | Documentos arbitrarios (JSON/XML/YAML) | **MongoDB**, ElasticSearch | Esquemas variables, búsqueda full-text, REST APIs |

Sub-temas:
- **Sharding nativo** en MongoDB y otros (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases no relacionales - Documentos* sharding).
- **[[Map-Reduce]]** como mecanismo de procesamiento distribuido (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Map-Reduce*).

Ver [[Bases no relacionales]] para el detalle por familia.

## Decisiones clave discutidas

| Decisión | Opciones | Criterio | Recomendación cátedra |
|---|---|---|---|
| ¿Archivo o BD? | Archivos / RDBMS | Concurrencia, integridad, búsquedas | BD apenas haya concurrencia o reglas de negocio. |
| ¿OLTP y OLAP en mismo motor? | Sí / Separar con ETL | Patrón de carga | **Separar siempre**; OLTP no debe servir reporting pesado. |
| ¿RDBMS u OODBMS? | RDBMS / OODBMS | Ecosistema, equipo | **RDBMS por default**; OODBMS sólo en lenguajes de objetos puros. |
| ¿ORM o SQL crudo? | ORM / SQL / Micro-ORM | Productividad vs control | ORM por default; escapar a SQL para queries complejas o hot path. |
| ¿Cómo escalar lecturas? | Vertical / Replicación P-S | Lectura/escritura ratio | Replicación P-S por default cuando lecturas dominan. |
| ¿Cómo escalar escrituras? | Vertical / P-P / Sharding | Volumen, presupuesto | Sharding > P-P en la mayoría de casos modernos. |
| ¿Sharding sobre RDBMS o migrar a NoSQL? | Mantener RDBMS / Migrar | Cuántos hacks ya hay | Si hay sharding manual + JSON blobs + tablas-como-columnas, migrar. |
| ¿Qué shard key? | Hash / Rango / Temporal / Geográfica | Patrón de query dominante | Aplicar [[Principio de localidad]]. |
| ¿C, A o P? | CP / AP | Naturaleza del dato | Bancos: CP. E-commerce/feeds: AP. |

## Ejemplos vistos

- **FriendFeed (2009)** — schema-less sobre MySQL con UUIDs, JSON blobs e index tables. Caso paradigmático de hack creativo sobre RDBMS (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *JSON Blobs*).
- **Diagrama de impedancia OR** — Application↔Cache↔ObjectDB vs Application↔Mapping↔Tables (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Impedancia Objeto-Relacional* visual).
- **Sharding por rango de precios** — productos $0-49 / $50-99 / $100+ (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Sharding* visual).
- **Word count map-reduce** — DVD/CD/Blu-ray/Video como ejemplo paradigmático (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Map-Reduce*).

La clase se complementa con [[Caso Twitter — Big Data en tiempo real]] desarrollado en [[Clase 6 — Big Data en tiempo real (Twitter)]] como aplicación integral de estos temas.

## Preguntas para el parcial

1. Definir persistencia y enumerar los 3 criterios para elegir un mecanismo. Justificar por qué un sistema bancario y un servicio de configuración llegan a decisiones distintas.
2. ¿Qué problema resuelve la prevalencia que un RDBMS no resuelve, y a qué costo?
3. Comparar OLTP y OLAP en cinco dimensiones (volumen, esquema, mutabilidad, latencia, indexación). ¿Por qué nunca se mezclan en el mismo motor?
4. Enumerar los 5 puntos del *choque objeto-relacional* y proponer mitigaciones para cada uno.
5. ¿Cuándo conviene Primario-Primario vs Primario-Secundario? ¿Por qué los clusters P-P tienen un techo de tamaño?
6. Enunciar el Teorema CAP y aplicarlo a tres sistemas: un banco, un carrito de e-commerce, un timeline de red social. Justificar la elección.
7. ¿Qué es el *principio de localidad* y cómo guía la elección de un shard key? Dar un ejemplo donde violar localidad sea correcto.
8. Tres workarounds históricos sobre RDBMS para escalabilidad: explicar cada uno y por qué cada uno terminó "productizado" en alguna BD no relacional.
9. ¿Por qué map-reduce no sirve para queries online? ¿Qué arquitecturas se usan en su lugar?
10. Polyglot persistence: ventajas, costos, y heurística para decidir cuándo introducir una segunda BD en el sistema.

## Lecturas complementarias

- Codd, *A Relational Model of Data for Large Shared Data Banks* (CACM 1970).
- Brewer, *CAP Twelve Years Later* (IEEE Computer 2012).
- Sadalage & Fowler, *NoSQL Distilled* (2012).
- Kleppmann, *Designing Data-Intensive Applications* (2017) — referencia moderna obligada.
- Dean & Ghemawat, *MapReduce: Simplified Data Processing on Large Clusters* (OSDI 2004).
- Chang et al., *Bigtable* (OSDI 2006).
- DeCandia et al., *Dynamo* (SOSP 2007).
- Wuestefeld, *Prevayler* (2001) — introducción al patrón de prevalencia.
