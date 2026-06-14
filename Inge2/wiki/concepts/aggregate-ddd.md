---
title: "Aggregate (DDD)"
aliases:
  - "Aggregate (DDD)"
  - "Aggregate"
  - "Aggregate root"
  - "Agregado"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [ddd, aggregate, microservicios, dominio, consistencia, value-object]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Descomposición en microservicios]]"
  - "[[Event Sourcing]]"
  - "[[Patrón Saga]]"
  - "[[ORM e impedancia objeto-relacional]]"
  - "[[Microservicios]]"
---

# Aggregate (DDD)

## Qué es

Un **aggregate** es un patrón táctico de Domain-Driven Design: organizar el modelo de dominio como una **colección de aggregates**, donde cada uno es un **grafo de objetos que se trata como una sola unidad** de consistencia (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 28).

Cada aggregate tiene una **aggregate root** (la entidad raíz por la que se accede a todo el grafo) y puede contener *value objects* y otras entidades. Las APIs de un microservicio se definen en función de estos aggregates.

**Ejemplo de la clase — FTGO** (slide 28):
- *Order aggregate*: root `Order` + value objects `DeliveryInfo`, `PaymentInfo`, `OrderLineItem`.
- *Consumer aggregate*: root `Consumer` + `DeliveryInfo`, `PaymentInfo`.
- *Restaurant aggregate*: root `Restaurant`.

## Por qué importa en microservicios

El aggregate define la **frontera de consistencia transaccional**: una transacción local modifica *un* aggregate atómicamente. Como en microservicios cada servicio tiene su [[Database per Service|propia base]], las operaciones que cruzan aggregates de servicios distintos **no pueden** ser una transacción ACID única → se resuelven con [[Patrón Saga|sagas]]. Por eso un buen diseño de aggregates es lo que hace viable la [[Descomposición en microservicios|descomposición]].

## Limitaciones (cuándo duele)

La clase señala (slide 28):

- **Impedance mismatch** — el grafo de objetos no mapea limpio a tablas relacionales (ver [[ORM e impedancia objeto-relacional]]).
- **No hay historia del aggregate** — solo se guarda el estado actual; los cambios previos se pierden.
- **Auditoría y logging es tedioso** — hay que instrumentarlo a mano.

Esas tres limitaciones son justamente las que ataca [[Event Sourcing]], que persiste la secuencia de cambios en vez del estado final.

## Pregunta a profundizar

¿Qué tan grande debe ser un aggregate? Aggregates grandes dan consistencia fuerte pero contención (locks); chicos dan concurrencia pero obligan a más sagas. ¿Dónde está el balance?

## Fuentes y lecturas

- Evans — *Domain-Driven Design* (aggregates, parte II).
- Vernon — *Implementing Domain-Driven Design* ("Effective Aggregate Design").
- Richardson — *Microservices Patterns*, cap. 5.
