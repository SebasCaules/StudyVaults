---
title: Bases de datos de objetos
aliases:
  - "Bases de datos de objetos"
  - "OODBMS"
  - "Bases orientadas a objetos"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [oodbms, persistencia, objetos, herencia]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
related:
  - "[[Persistencia]]"
  - "[[ORM e impedancia objeto-relacional]]"
  - "[[Bases de datos relacionales]]"
  - "[[Clase 6 — Persistencia]]"
---

# Bases de datos de objetos (OODBMS)

## Idea

Bases de datos que **almacenan objetos complejos directamente**, preservando las relaciones del paradigma de objetos: **herencia, polimorfismo, asociaciones bidireccionales, identidad de objeto**. No hay tablas ni filas; hay un grafo de objetos persistente (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Bases de Datos de Objetos*).

Características destacadas en clase:

- Guarda objetos complejos (no simples tuplas).
- Soporta relaciones del paradigma de objetos (e.g. herencia).
- Soporta relaciones de muchos a muchos sin tablas intermedias.
- Usada principalmente en **lenguajes de objetos "puros"** (Smalltalk, casos específicos de Java/.NET con frameworks dedicados).

## Por qué casi nunca se eligen

A pesar de eliminar la [[ORM e impedancia objeto-relacional|impedancia objeto-relacional]], las OODBMS perdieron la guerra contra los RDBMS por razones extra-técnicas:

1. **Ecosistema** — RDBMS tienen 50 años de tooling: BI, ETL, replicación gestionada, DBAs entrenados, drivers en cada lenguaje, GUIs, conocimiento institucional.
2. **Estándar SQL** — lenguaje de consultas declarativo, portable, conocido por miles de programadores. ODMG y OQL nunca lograron tracción equivalente.
3. **Acoplamiento al lenguaje** — los objetos persistidos están atados al modelo de clases del lenguaje; otros sistemas no pueden leerlos sin adaptadores.
4. **Migración de esquema** — cambiar la jerarquía de clases es más invasivo que un `ALTER TABLE`.

El resultado práctico: el problema que la OODBMS resolvía (la impedancia) se mitigó con **ORMs** (Hibernate, Entity Framework, ActiveRecord, JPA) sobre RDBMS, ganando lo mejor de ambos mundos a costa de complejidad.

## Productos

- **Db4o** — open source, Java/.NET (descontinuado).
- **ObjectDB** — Java + JPA.
- **Versant** — comercial, telcos y finanzas.
- **GemStone/S** — Smalltalk; nicho industrial.

## Cuándo (raramente) elegirla

- Lenguajes de objetos puros (Smalltalk) donde la integración con SQL es un downgrade.
- Modelos con jerarquías de herencia profundas y polimorfismo intensivo donde el ORM se convierte en pesadilla.
- Sistemas embebidos que ya viven en un solo lenguaje y no necesitan compartir datos.

En la mayoría absoluta de proyectos académicos e industriales **la respuesta es: usar RDBMS + ORM**. Ver [[ORM e impedancia objeto-relacional]].

## Pregunta a profundizar

¿Es justo decir que las **graph databases** (Neo4j, Neptune) son las herederas espirituales de las OODBMS? ¿Qué tienen en común y qué resolvieron las graph DBs que las OODBMS no pudieron?

## Lecturas complementarias

- Atkinson et al., *The Object-Oriented Database System Manifesto* (1989).
- Cattell, *The Object Database Standard: ODMG-93* — el intento fallido de estandarización.
