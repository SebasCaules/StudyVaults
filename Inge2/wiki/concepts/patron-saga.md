---
title: "Patrón Saga"
aliases:
  - "Patrón Saga"
  - "Saga"
  - "Sagas"
  - "Transacciones de compensación"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [saga, microservicios, transacciones, consistencia, compensacion, 2pc]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Database per Service]]"
  - "[[Microservicios]]"
  - "[[Orquestación vs Coreografía]]"
  - "[[Teorema CAP]]"
  - "[[Event Sourcing]]"
---

# Patrón Saga

## El problema

Con [[Database per Service|una base por servicio]], una transacción de negocio que toca varios servicios **no puede** ser una transacción ACID única. La alternativa clásica —**2PC (two-phase commit)**— bloquea recursos y no escala ni tolera fallas bien. La Saga es el reemplazo (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slides 31-32).

## Qué es

Una **Saga** es una **secuencia de transacciones locales**. Cada transacción local:

1. Impacta la base de **su** servicio (commit ACID local).
2. Publica un **evento** que dispara la siguiente transacción local.

Si una transacción local **falla**, la saga ejecuta **transacciones de compensación** que **deshacen** los pasos ya ejecutados, en orden inverso — devolviendo el sistema a un estado consistente sin haber usado locks distribuidos.

**Ejemplo de la clase — FTGO** (slide 32): `Create order` (Order) → `Verify consumer` (Consumer) → `Create ticket` (Kitchen) → `Authorize card` (Accounting) → `Approve ticket` (Kitchen) → `Approve order` (Order). Si falla la autorización de tarjeta, se compensan los pasos previos (`Reject ticket`, `Reject order`).

> **El orden en que se realizan los pasos es importante** (slide 32): las compensaciones deben poder deshacer cada paso committeado.

## Saga vs 2PC

| | 2PC | Saga |
|---|---|---|
| Atomicidad | Verdadera (todo o nada) | Eventual (con compensaciones) |
| Locks distribuidos | Sí (bloqueante) | No |
| Escalabilidad / disponibilidad | Baja | Alta |
| Consistencia | Fuerte | Eventual ([[Teorema CAP]]) |
| Complejidad | En el protocolo | En diseñar compensaciones |

La Saga elige **disponibilidad y escala** sobre consistencia inmediata — el trade-off CAP de microservicios.

## Cómo se coordina

Dos variantes (ver [[Orquestación vs Coreografía]]):

- **Orchestration-based** — un orquestador central dirige los pasos y compensaciones.
- **Choreography-based** — cada servicio reacciona a eventos y dispara el siguiente.

## El punto fino: compensaciones

No todo se puede "deshacer" limpio (mandar un mail ya enviado no se desmanda). El diseño de saga exige pensar **compensaciones semánticas** y manejar estados intermedios visibles (la consistencia es eventual: hay una ventana donde el sistema está "a medio camino").

## Pregunta a profundizar

¿Cómo se evita que un cliente vea un estado intermedio inconsistente durante una saga (ej.: pedido "creado" pero pago aún no autorizado)? ¿Qué relación tiene esto con [[Event Sourcing]]?

## Fuentes y lecturas

- Garcia-Molina, Salem (1987) — "Sagas" (paper original).
- Richardson — *Microservices Patterns*, cap. 4.
