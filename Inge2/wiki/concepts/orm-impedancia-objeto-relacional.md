---
title: ORM e impedancia objeto-relacional
aliases:
  - "ORM e impedancia objeto-relacional"
  - "ORM"
  - "Impedancia objeto-relacional"
  - "Object-Relational Mapping"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [orm, impedancia, persistencia, mapeo, hibernate, active-record, data-mapper]
sources:
  - "raw/classes/2026-04-16 - Clase 5/Clase 5.pdf"
related:
  - "[[Persistencia]]"
  - "[[Bases de datos relacionales]]"
  - "[[Bases de datos de objetos]]"
  - "[[Clase 6 — Persistencia]]"
---

# ORM e impedancia objeto-relacional

## El choque

> "El choque entre el modelo de objetos vs el almacenamiento de tuplas."
> (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Impedancia Objeto-Relacional*)

La **impedancia objeto-relacional** (OR-impedance, *object-relational impedance mismatch*) es la fricción estructural entre dos modelos:

- **Objetos** (Java, C#, Python, Ruby): grafo de instancias con identidad propia, herencia, polimorfismo, asociaciones bidireccionales, comportamiento ligado a datos.
- **Tablas relacionales**: relaciones planas de tuplas tipadas, identidad por clave primaria, sin herencia, sin polimorfismo, asociaciones via foreign keys (unidireccionales en el esquema).

Concretamente, la cátedra enumera (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf):

1. **Inflexibilidad de las tablas** — no soportan polimorfismo nativamente.
2. **Falta de herencia** — el modelo relacional no la modela; hay que codificarla con patrones (single-table inheritance, class-table, concrete-table) cada uno con trade-offs.
3. **Identidad vs Clave Primaria** — un objeto tiene identidad por referencia (`==` reference equality); una tupla por valor de PK. Dos objetos pueden ser "iguales" sin tener mismo PK; dos tuplas con mismo PK son la misma fila.
4. **Interfaces de datos vs interfaces de comportamiento** — los objetos exponen métodos; las tablas exponen columnas. Mapear uno al otro pierde encapsulación.
5. **FKs vs relaciones bidireccionales** — un objeto puede tener `pedido.cliente` y `cliente.pedidos` simultáneamente; una FK sólo modela una dirección. Mantener consistencia bidireccional al persistir es complejo.

## ORM — la respuesta de la industria

**Object-Relational Mapping**: frameworks que automatizan la traducción entre objetos y tablas (source: raw/classes/2026-04-16 - Clase 5/Clase 5.pdf, slide *Mapeo Objeto-Relacional (ORM)*):

- Mapean clases ↔ tablas, atributos ↔ columnas, asociaciones ↔ FKs.
- Automatizan **CRUD** (Create, Read, Update, Delete).
- Generan SQL desde queries en el lenguaje host (HQL, JPQL, LINQ, ActiveRecord query interface).
- Gestionan **identity map**, **lazy loading**, **dirty tracking**, **first-level cache**.

Ventajas:
- **Productividad** — menos boilerplate.
- **Portabilidad de motor** — cambiar de Postgres a MySQL es (en teoría) un cambio de driver.
- **Encapsulamiento** — el modelo de dominio no está infectado de SQL.

Costos (que la cátedra menciona explícitamente):
- **Performance** — ORMs generan SQL subóptimo, sufren del problema **N+1**, materializan más de lo necesario.
- **Complejidad** — el ORM se convierte en una capa más a entender; los bugs se debugean en dos modelos a la vez.
- **Abstracción que falla bajo presión** — para queries complejas, agregaciones, batch operations, hay que escapar a SQL nativo. *"You can't use the ORM for everything."*

## Patrones canónicos (Fowler PoEAA)

El ORM se construye sobre patrones que vale la pena conocer por separado:

- **Active Record** — la clase de dominio *es* la mapeada a la tabla y conoce su persistencia (`pedido.save()`). Simple, acoplado. Ej: ActiveRecord en Rails, Eloquent en Laravel.
- **Data Mapper** — separa el dominio del mecanismo de persistencia. Dominio puro, mapper aparte. Ej: Hibernate, JPA, Doctrine.
- **Repository** — colección-como-fachada sobre el Data Mapper; oculta queries.
- **Unit of Work** — registra cambios en una sesión y los commitea en una transacción.
- **Identity Map** — garantiza que cada entidad cargada existe una sola vez en memoria por sesión.
- **Lazy Load** — diferir la carga de asociaciones hasta el primer uso.

Ver Fowler, *PoEAA*, parte III.

## Productos

- **Java**: Hibernate, EclipseLink, MyBatis (más simple, SQL templates).
- **.NET**: Entity Framework, NHibernate, Dapper (micro-ORM).
- **Ruby**: ActiveRecord, Sequel.
- **Python**: SQLAlchemy (Data Mapper potente), Django ORM (Active Record).
- **Node**: Prisma, TypeORM, Sequelize.
- **Go**: GORM, sqlc (generador SQL → Go, contrarreacción a ORMs).

## Decisiones canónicas

| Decisión | Opciones | Recomendación cátedra |
|---|---|---|
| ¿ORM o SQL crudo? | ORM completo / SQL crudo / micro-ORM | **ORM por default** para el 80% de operaciones, **SQL escapado** para queries complejas o de performance crítica. |
| ¿Active Record o Data Mapper? | AR / DM | DM en sistemas grandes, dominio rico, testing intensivo. AR en aplicaciones CRUD-heavy con dominio simple. |
| ¿Generar esquema desde código o esquema-first? | Code-first / Database-first | DBA presente y BD compartida → DB-first. App nueva, equipo de devs → code-first con migraciones versionadas. |

## Pregunta a profundizar

Si el ORM es siempre una abstracción que falla bajo presión, ¿no sería mejor herramientas como **sqlc** (escribís SQL, genera código)? ¿En qué momento la inversión de aprender Hibernate vs sqlc se decanta?

## Lecturas complementarias

- Fowler, *Patterns of Enterprise Application Architecture* (2002) — capítulos 9-13 cubren ORM en profundidad.
- Vaughn Vernon, *Implementing Domain-Driven Design* — ORM y DDD táctico.
- Ted Neward, *The Vietnam of Computer Science* (2006) — ensayo influyente argumentando que el ORM es fundamentalmente irreconciliable.
