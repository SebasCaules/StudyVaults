---
title: Persistencia
aliases:
  - "Persistencia"
  - "Persistence"
  - "Almacenamiento persistente"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [persistencia, almacenamiento, arquitectura, decision-arquitectonica]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
related:
  - "[[Clase 6 — Persistencia]]"
  - "[[Atributos de calidad]]"
  - "[[Bases de datos relacionales]]"
  - "[[Bases no relacionales]]"
  - "[[Prevalencia]]"
  - "[[Teorema CAP]]"
  - "[[ORM e impedancia objeto-relacional]]"
  - "[[Architecture Business Cycle (ABC)]]"
  - "[[OLAP y ETL]]"
  - "[[Bases de datos de objetos]]"
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Cono de incertidumbre]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Architectural Guardrails]]"
---

# Persistencia

## Definición

> "La persistencia es la característica de los datos que sobreviven al programa que los genera."
> (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *¿Qué es la persistencia?*)

Es necesaria porque la memoria principal (RAM) es **volátil** (se pierde al apagar) y **acotada** (mucho más cara por byte que el disco). Toda decisión de persistencia es una decisión arquitectónica: condiciona performance, escalabilidad, integridad y costo de evolución del software.

## Criterios para elegir un mecanismo

La cátedra propone tres ejes (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf):

1. **Performance.**
   - Acceso al medio (memoria vs disco vs red).
   - Costo de búsquedas (índices, full-scan, joins).
2. **Transformación de datos.** ¿Cuán fiel es el almacenamiento al modelo de la aplicación? Las tablas relacionales requieren mapeo desde objetos (ver [[ORM e impedancia objeto-relacional]]); la prevalencia conserva la forma nativa.
3. **Tolerancia a fallos.** Recuperación ante caída del proceso, del nodo, del datacenter. Implica ACID, replicación, snapshots, write-ahead logs.

A esto se suma siempre el contexto del [[Architecture Business Cycle]]: presupuesto, equipo, regulaciones, volumen esperado.

## Taxonomía vista en clase

```
Persistencia
├── Archivos
│   ├── Planos (ancho fijo, ancho variable como CSV)
│   ├── Estructurados (XML, JSON, YAML)
│   └── Binarios (indexados, serializados)
├── Prevalencia (patrón) → ver [[Prevalencia]]
└── Bases de datos
    ├── Relacionales → [[Bases de datos relacionales]]
    │   ├── OLTP (transaccionales)
    │   └── OLAP (analíticas) → [[OLAP y ETL]]
    ├── Orientadas a objetos → [[Bases de datos de objetos]]
    └── No relacionales / NO-SQL → [[Bases no relacionales]]
        ├── Columnares
        ├── Clave-Valor
        └── Documentos
```

## Decisiones canónicas

| Decisión | Opciones | Criterio | Cuándo elegir cada una |
|---|---|---|---|
| ¿Archivo o BD? | Archivos planos vs RDBMS | Concurrencia, integridad, búsquedas | Archivo: configuración, logs, datasets read-only de tamaño moderado. BD: cuando hay concurrencia o reglas de negocio sobre los datos. |
| ¿Relacional u objetos? | RDBMS vs OODBMS | Naturaleza del modelo | RDBMS gana casi siempre por ecosistema; OODBMS sólo en lenguajes de objetos puros con dominios muy ricos en herencia. |
| ¿SQL o NoSQL? | RDBMS vs Bases no relacionales | Esquema fijo vs flexible, ACID vs escalabilidad | NoSQL cuando el volumen, la flexibilidad de esquema o la distribución por diseño dominan; RDBMS cuando la integridad transaccional es no-negociable. |
| ¿Online (OLTP) o reporting (OLAP)? | OLTP vs OLAP + ETL | Patrón de carga | Nunca usar OLTP para reporting pesado; separar con [[OLAP y ETL]]. |

## Por qué importa arquitectónicamente

Una mala decisión de persistencia es **costosísima de revertir**: migraciones de datos pueden tomar meses, requieren downtime o esquemas complejos de doble-escritura, y arrastran inconsistencias por años. Por eso la cátedra ubica esta clase dentro de las decisiones del [[BDUF vs YAGNI vs JEDUF|JEDUF]] que sí merecen anticiparse: el modelo de datos es de los componentes con menor reversibilidad (ver [[Cono de incertidumbre]]).

A la vez, **no es estática**: Twitter (ver [[Caso Twitter — Big Data en tiempo real]]) ilustra cómo un sistema empieza con MySQL master-slave y termina migrando a Cassandra y Memcached cuando la escala lo exige. La lección no es "elegir bien la primera vez", sino "hacer la decisión observable y reemplazable" (ver [[Architectural Guardrails]]).

## Pregunta a profundizar

¿Cuándo deja de ser razonable resolver con un único motor (RDBMS multi-uso) y conviene mover a *polyglot persistence* (BD distinta por dominio)?

## Lecturas complementarias

- Fowler & Sadalage, *NoSQL Distilled* (2012) — taxonomía y trade-offs.
- Kleppmann, *Designing Data-Intensive Applications* (2017) — capítulos 2-5 cubren los mismos ejes con más profundidad.
- Brewer, *Towards Robust Distributed Systems* (PODC 2000) — orígenes del [[Teorema CAP]].
