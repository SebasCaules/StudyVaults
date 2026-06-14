---
title: "CQRS — Command Query Responsibility Segregation"
aliases:
  - "CQRS — Command Query Responsibility Segregation"
  - "CQRS"
  - "Command Query Responsibility Segregation"
  - "View database"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [cqrs, microservicios, consultas, eventos, read-model, datos]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Database per Service]]"
  - "[[Event Sourcing]]"
  - "[[Patrón Saga]]"
  - "[[OLAP y ETL]]"
  - "[[Replicación de BD]]"
  - "[[Microservicios]]"
---

# CQRS — Command Query Responsibility Segregation

## El problema

Con [[Database per Service|datos repartidos por servicio]], una consulta que necesita datos de varios servicios (ej.: "historial completo de un pedido" que cruza Order, Kitchen, Delivery, Accounting) no se puede resolver con un JOIN. CQRS es una de las soluciones (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 33).

## Qué es

**CQRS** separa las responsabilidades de **comandos** (escrituras, que cambian estado) de las de **queries** (lecturas). En microservicios se materializa creando una **"view DB"**: una **réplica read-only** optimizada para atender consultas, **independiente** de las bases que manejan las escrituras.

Esa view-DB **se mantiene actualizada suscribiéndose a los eventos de dominio** que publican los servicios dueños de cada dato.

**Ejemplo de la clase** (slide 33): un *Order History Service* con su *Order History View database*, alimentado por `Order events`, `Ticket events`, `Delivery events`, `Accounting events` que publican Order/Kitchen/Delivery/Accounting Service. Los *Event Handlers* del servicio de historial van actualizando la vista.

## Por qué importa

- Permite **consultas complejas cross-servicio** sin acoplar los servicios de escritura.
- La vista se puede **modelar a medida de la consulta** (desnormalizada, indexada para lo que se lee) — emparenta con [[OLAP y ETL|OLAP]] y con el principio de [[Replicación de BD|réplicas de lectura]].
- Escala lecturas y escrituras **por separado**.

## El costo

- **Consistencia eventual**: la view-DB va "atrás" de las escrituras (el lag de propagación de eventos). La lectura puede devolver datos levemente viejos.
- **Más complejidad**: hay que mantener la sincronización por eventos y manejar duplicados/orden.

## Relación con Event Sourcing

CQRS y [[Event Sourcing]] se combinan muy seguido: si los servicios ya publican eventos de dominio (event sourcing), construir las vistas read-only de CQRS suscribiendo a esos eventos es natural. Pero son **independientes**: se puede hacer CQRS sin event sourcing y viceversa.

## Cuándo NO

Si las consultas son simples y caben en un solo servicio, CQRS es **over-engineering**: agregás una base extra y consistencia eventual sin necesidad.

## Pregunta a profundizar

¿Cuánto lag de la view-DB tolera el negocio? Si la respuesta es "cero", CQRS no aplica y hay que repensar la [[Descomposición en microservicios|descomposición]].

## Fuentes y lecturas

- Young, Fowler — sobre CQRS (martinfowler.com/bliki/CQRS.html).
- Richardson — *Microservices Patterns*, cap. 7 (querying).
