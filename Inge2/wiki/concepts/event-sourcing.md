---
title: "Event Sourcing"
aliases:
  - "Event Sourcing"
  - "Event sourcing"
  - "Eventos de dominio"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [event-sourcing, microservicios, eventos, auditoria, historia, datos]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Aggregate (DDD)]]"
  - "[[CQRS — Command Query Responsibility Segregation]]"
  - "[[Patrón Saga]]"
  - "[[Prevalencia]]"
  - "[[Microservicios]]"
---

# Event Sourcing

## Qué es

En vez de guardar el **estado actual** de un [[Aggregate (DDD)|aggregate]], **Event Sourcing** persiste la **secuencia de eventos de dominio** que representan cada cambio de estado. El estado actual se reconstruye **reproduciendo** los eventos desde el principio (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 29).

**Ejemplo de la clase — tabla EVENTS** (slide 29): para un `Order` (entity_id 101), la tabla guarda `Order Created` → `Order Approved` → `Order Shipped` → `Order Delivered`, cada fila con `event_id`, `event_type`, `entity_type`, `entity_id` y el evento serializado (ej.: JSON) en `event_data`.

## Qué resuelve

Ataca justo las limitaciones del [[Aggregate (DDD)|aggregate]] que guarda sólo estado final (slide 28):

- **Historia completa** — se puede "volver al pasado" y recrear cualquier estado anterior.
- **Auditoría y logging gratis** — el log de eventos *es* la auditoría.
- **Independencia entre sistemas** — cada servicio reconstruye lo que necesita a partir de eventos.

## El costo

La clase es directa: todo esto viene **"a un costo mayor de desarrollo"** (slide 29). Pensar en eventos en vez de estado, manejar versionado de eventos, reconstruir estado (con *snapshots* para no reproducir todo cada vez) y razonar consultas son más difíciles.

## Relación con otros conceptos

- **[[CQRS — Command Query Responsibility Segregation|CQRS]]** — combinación natural: las view-DB de CQRS se alimentan de los eventos que event sourcing ya publica.
- **[[Patrón Saga|Sagas]]** — los eventos publicados por cada transacción local encajan con un store de eventos.
- **[[Prevalencia]]** — pariente conceptual: prevalencia también usa un log de cambios (WAL) + snapshots para reconstruir estado en memoria. Event sourcing lleva esa idea al modelo de dominio distribuido.

## Cuándo NO

Si el dominio no necesita historia/auditoría fuerte ni reconstrucción temporal, el sobrecosto de desarrollo no se justifica — guardar estado con un aggregate clásico es más simple.

## Pregunta a profundizar

¿Cómo se versiona el esquema de un evento cuando el negocio cambia, sin romper la capacidad de reproducir eventos viejos? (event upcasting)

## Fuentes y lecturas

- Fowler — "Event Sourcing" (martinfowler.com).
- Richardson — *Microservices Patterns*, cap. 6.
- Young — *Versioning in an Event Sourced System*.
