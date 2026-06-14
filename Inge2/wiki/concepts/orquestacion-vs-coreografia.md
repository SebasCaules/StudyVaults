---
title: "Orquestación vs Coreografía"
aliases:
  - "Orquestación vs Coreografía"
  - "Orquestación"
  - "Coreografía"
  - "Orchestration"
  - "Choreography"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [composicion, soa, microservicios, orquestacion, coreografia, saga]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[SOA — Service-Oriented Architecture]]"
  - "[[ESB — Enterprise Service Bus]]"
  - "[[Patrón Saga]]"
  - "[[Microservicios]]"
---

# Orquestación vs Coreografía

## El dilema

Cuando una funcionalidad de negocio se arma componiendo varios servicios, hay dos formas de coordinar quién invoca a quién (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 11):

- **Orquestación** — un coordinador central (el [[ESB — Enterprise Service Bus|ESB]] en SOA, o un servicio orquestador en microservicios) **dirige** la secuencia: llama al servicio A, luego al B, luego al C. Hay un "director de orquesta".
- **Coreografía** — no hay director: cada servicio **reacciona a eventos** y publica los suyos. La lógica del flujo está distribuida entre los participantes, como bailarines que conocen su parte.

## Trade-offs

| | Orquestación | Coreografía |
|---|---|---|
| Control del flujo | Centralizado, explícito | Distribuido, emergente |
| Visibilidad | Alta — el flujo se lee en un lugar | Baja — hay que reconstruirlo de los eventos |
| Acoplamiento | Mayor (todos dependen del orquestador) | Menor (servicios autónomos) |
| Punto único de falla | El orquestador | No hay uno central |
| Cambiar el flujo | Tocar el orquestador | Tocar varios servicios |

## Conexión con Saga

El [[Patrón Saga|patrón Saga]] se implementa de las dos formas: **orchestration-based saga** (un orquestador maneja los pasos y las compensaciones) o **choreography-based saga** (cada servicio escucha eventos y dispara el siguiente paso). Es la misma decisión, aplicada a transacciones distribuidas.

## Recomendación (depende de…)

- Flujos **complejos, con muchos pasos y necesidad de visibilidad/auditoría** → orquestación.
- Flujos **simples donde la autonomía y el desacoplamiento importan más** → coreografía.

No hay ganador absoluto: es un trade-off entre *control/visibilidad* y *desacoplamiento/autonomía*, el mismo eje que recorre toda la [[Clase 9 — Integración de Sistemas / SOA / Microservicios|clase]].

## Pregunta a profundizar

¿Una coreografía muy ramificada termina siendo más difícil de razonar que una orquestación? ¿Cómo se observa un flujo coreografiado cuando algo sale mal (distributed tracing)?

## Fuentes y lecturas

- Richardson — *Microservices Patterns*, cap. 4 (sagas).
- Newman — *Building Microservices*, cap. sobre orchestration vs choreography.
