---
title: "Circuit Breaker"
aliases:
  - "Circuit Breaker"
  - "Circuit breaker"
  - "Cortacircuitos"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [circuit-breaker, resiliencia, microservicios, fault-tolerance, red]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Service Mesh]]"
  - "[[Microservicios]]"
  - "[[MTBF y MTTR]]"
  - "[[Atributos de calidad]]"
---

# Circuit Breaker

## El problema

Operar en un sistema distribuido obliga a lidiar con problemas de red. Lo primero que se implementa son **timeouts** y **retries** (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 37). Pero ante una falla masiva, los retries generan un **efecto bola de nieve**: la carga sobre el servicio que ya está caído **crece exponencialmente**, y eso le **impide recuperarse** (cascading failure).

## Qué es

Un **Circuit Breaker** ("cortacircuitos") es un patrón que **corta** las llamadas a un servicio que está fallando, para **darle aire** y permitir que se recupere, en vez de seguir martillándolo con reintentos.

Funciona como un interruptor eléctrico con tres estados:

- **Closed** — todo normal, las llamadas pasan; cuenta los fallos.
- **Open** — superado un umbral de fallos, "salta": rechaza las llamadas inmediatamente (fail-fast) sin tocar el servicio caído, devolviendo un fallback.
- **Half-open** — tras un tiempo, deja pasar algunas llamadas de prueba; si andan, vuelve a *closed*; si no, vuelve a *open*.

## Dónde se implementa

La clase señala dos lugares (slide 37):

- **A nivel aplicación** — con una librería (ej.: Resilience4j, el histórico Hystrix).
- **A nivel [[Service Mesh|service mesh]]** — el sidecar aplica el circuit breaking de forma transparente, sin tocar el código del servicio.

## Por qué importa (lente de calidad)

Es un mecanismo central de **Fault Tolerance / Resilience** (ver [[Atributos de calidad]]): protege la **disponibilidad del conjunto** evitando que la falla de un servicio se propague y tire todo. Mejora el [[MTBF y MTTR|MTTR]] al permitir que los servicios se recuperen solos.

## Pregunta a profundizar

¿Qué se le devuelve al usuario cuando el breaker está *open* (fallback, dato cacheado, error elegante)? El diseño del **fallback** es tan importante como el breaker.

## Fuentes y lecturas

- Nygard — *Release It!* (origen del patrón).
- Fowler — "CircuitBreaker" (martinfowler.com).
- Richardson — *Microservices Patterns*, cap. 3.
