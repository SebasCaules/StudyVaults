---
title: OLAP y ETL
aliases:
  - "OLAP y ETL"
  - "OLAP"
  - "ETL"
  - "ELT"
  - "Data warehouse"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [olap, etl, data-warehouse, reporting, append-only, desnormalizacion]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
related:
  - "[[Bases de datos relacionales]]"
  - "[[Persistencia]]"
  - "[[Clase 6 — Persistencia]]"
  - "[[Bases no relacionales]]"
---

# OLAP y ETL

## Qué es OLAP

**OLAP — Online Analytical Processing.** Bases de datos relacionales **diseñadas exclusivamente para reporting analítico** sobre grandes volúmenes históricos (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos Multidimensionales (OLAP)*). El acrónimo se opone a OLTP (Online Transaction Processing) — la BD transaccional convencional. Aunque ambas son relacionales, sus decisiones de diseño son opuestas:

| Eje | OLTP | OLAP |
|---|---|---|
| Volumen | Datos vivos | Histórico acumulado |
| Esquema | Normalizado (3NF) | **Desnormalizado** (star/snowflake) — para evitar joins |
| Mutabilidad | INSERT/UPDATE/DELETE | **Append-only** — los datos sólo se agregan |
| Agregaciones | Calculadas en query-time | **Precalculadas** durante la carga |
| Latencia objetivo | < 10 ms | Segundos a minutos por query compleja |
| Indexación | B-tree por PK + foreign keys | Bitmap, columnar, cubos multidimensionales |

## Por qué se separan

Un mismo motor RDBMS no puede servir bien las dos cargas: la normalización y los locks de OLTP penalizan los queries pesados de reporting; las agregaciones sobre histórico bloquean tablas vivas; los índices óptimos son distintos. La cátedra es explícita: *"siempre se popula a partir de una base de datos OLTP"* — la OLAP es un derivado, no la fuente de verdad (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf).

## ETL — Extract, Transform, Load

El proceso **batch** que mueve datos de OLTP a OLAP:

1. **Extract.** Lee desde la(s) fuente(s) OLTP — y a veces logs, APIs, archivos. Puede ser dump nocturno, CDC (Change Data Capture), o lectura incremental por timestamp.
2. **Transform.** Normaliza, limpia, denormaliza, agrega, calcula campos derivados, resuelve conflictos entre fuentes. Aquí vive la lógica de negocio analítica.
3. **Load.** Escribe en el data warehouse OLAP, usualmente con bulk inserts en orden append-only.

Productos clásicos: Informatica, Talend, Pentaho. Modernos / cloud: dbt, Fivetran, Airbyte, Apache Airflow para orquestación.

## ELT — variante moderna

Cambia el orden: **Extract → Load → Transform**. Se carga en bruto al warehouse (que ahora es una columnar store potente como BigQuery, Snowflake, Redshift) y se transforma con SQL dentro del warehouse mismo. Aprovecha que el cómputo en cloud es elástico y que los warehouses modernos soportan transformaciones complejas a costo razonable. dbt es el caso emblemático.

## Productos OLAP típicos

- **Data warehouses tradicionales:** Teradata, Oracle Exadata, IBM Netezza.
- **Cloud warehouses:** Snowflake, BigQuery, Redshift, Synapse.
- **Cubos OLAP:** SSAS (Microsoft), Mondrian, Apache Druid.
- **Columnar OLAP open source:** ClickHouse, Apache Pinot — overlap con [[Bases no relacionales|bases columnares]].

## Decisiones canónicas

| Decisión | Opciones | Cuándo elegir |
|---|---|---|
| ¿Reporting sobre OLTP directo o separar OLAP? | Misma BD / Warehouse separado | Separar en cuanto los queries de reporting empiecen a degradar la latencia OLTP, o cuando el dataset histórico crezca > 10× el dataset vivo. |
| ¿ETL o ELT? | Tradicional / Moderno | ELT si se está en cloud con warehouse moderno y se quiere aprovechar SQL como lenguaje de transformación. ETL si hay restricciones de privacidad/transformación previa, o stack on-prem. |
| ¿Cubos multidimensionales o tablas planas? | OLAP cube / star schema en columnar | Cubos: queries muy estructuradas y predecibles (BI corporativo). Star schema en columnar: análisis ad-hoc moderno (data science). |

## Pregunta a profundizar

Con warehouses modernos que soportan latencia de segundos para queries sobre TBs, ¿la frontera entre "OLTP que reporta" y "OLAP" se difumina? ¿En qué casos hoy sigue siendo necesario un OLTP separado?

## Lecturas complementarias

- Kimball & Ross, *The Data Warehouse Toolkit* (1996, 3ª ed. 2013) — biblia del modelado dimensional.
- Inmon, *Building the Data Warehouse* — escuela alternativa (3NF en el warehouse).
- *The Data Engineering Cookbook* — referencia moderna abierta.
