---
title: "Database per Service"
aliases:
  - "Database per Service"
  - "Base de datos por servicio"
  - "Shared database"
  - "Noisy neighbours"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [microservicios, datos, base-de-datos, acoplamiento, consistencia]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Microservicios]]"
  - "[[Patrón Saga]]"
  - "[[CQRS — Command Query Responsibility Segregation]]"
  - "[[Teorema CAP]]"
  - "[[Replicación de BD]]"
  - "[[Sharding]]"
---

# Database per Service

## La decisión

En microservicios hay una decisión de fondo sobre los datos (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 30):

- **Shared database** — todos los servicios comparten una misma base. *Facilita la transaccionalidad* (un commit ACID abarca todo) **pero** introduce **noisy neighbours**: un servicio que satura la base degrada a todos, y el esquema compartido acopla fuertemente a los servicios (cambiar una tabla rompe a varios).
- **Database per Service** — cada servicio es **dueño exclusivo** de su base; nadie más la toca directamente. Da **autonomía** (cada equipo evoluciona su esquema y elige su tecnología de persistencia, *polyglot persistence*) pero **requiere soluciones distintas** para todo lo que antes resolvía la transacción única.

## Qué se rompe al separar las bases

Si `Order Service` y `Customer Service` tienen bases separadas (slide 30), ya no podés:

- Hacer una **transacción ACID** que toque ambas → se resuelve con [[Patrón Saga|sagas]] (transacciones locales + compensaciones).
- Hacer un **JOIN** entre tablas de servicios distintos → se resuelve con **API composition** o [[CQRS — Command Query Responsibility Segregation|CQRS]] (una view-DB que materializa la consulta).

## Trade-off, en la lente CAP

Separar las bases es elegir **autonomía y disponibilidad** sobre consistencia fuerte: la consistencia entre servicios pasa a ser **eventual** (ver [[Teorema CAP]]). Es coherente con la motivación de microservicios —*ir rápido y escalar independiente*— a costa de la simplicidad transaccional del monolito. No confundir con [[Sharding]] (partir *una* base por volumen) ni con [[Replicación de BD|replicación]] (copias de *la misma* base): acá son **bases distintas con datos distintos por dominio**.

## Recomendación

- **Database per Service** es el default en microservicios "puros": sin él, los servicios no son realmente independientes.
- **Shared database** puede ser un paso intermedio pragmático al migrar un monolito, asumiendo que es deuda técnica de acoplamiento.

## Pregunta a profundizar

¿Cómo se mantiene la integridad referencial (foreign keys) cuando las entidades relacionadas viven en bases de servicios distintos? ¿Quién es la *fuente de verdad* de cada dato?

## Fuentes y lecturas

- Richardson — *Microservices Patterns*, cap. 5 (Database per Service).
- Kleppmann — *Designing Data-Intensive Applications*.
