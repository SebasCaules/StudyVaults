---
title: "Descomposición en microservicios"
aliases:
  - "Descomposición en microservicios"
  - "Decompose by business capability"
  - "Decompose by subdomain"
  - "Descomposición por subdominios"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [microservicios, descomposicion, ddd, subdominios, bounded-context, bian]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Microservicios]]"
  - "[[Aggregate (DDD)]]"
  - "[[Database per Service]]"
  - "[[SOA — Service-Oriented Architecture]]"
---

# Descomposición en microservicios

## El problema más difícil

Definir **dónde cortar** el sistema en servicios es, según la [[Clase 9 — Integración de Sistemas / SOA / Microservicios|clase]], la dificultad central de microservicios: *"no es fácil definir correctamente los servicios"* (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 22). Un mal corte produce servicios chatty y acoplados — un monolito distribuido.

## Dos estrategias

El catálogo de Richardson ofrece dos (slide 23-25):

### 1. Decompose by business capability

Partir según las **capacidades de negocio** de la organización (lo que la empresa *hace*). Estable porque las capacidades cambian menos que la tecnología.

### 2. Decompose by subdomain (DDD)

Partir según los **subdominios** del modelo de dominio (Domain-Driven Design). Cada subdominio mapea a un servicio con su propio modelo de dominio.

**Ejemplo de la clase — FTGO** (slide 25): el dominio se parte en subdominios *Order taking*, *Delivery*, *Kitchen*, *Accounting*, y cada uno mapea a un *Order Service*, *Delivery Service*, *Kitchen Service*, *Accounting Service* con su propio domain model.

## Ejemplo de dominio: industria financiera (BIAN)

La clase muestra **BIAN** (bian.org, slides 26-27) como mapa de referencia de capacidades de negocio bancarias: Reference Data, Sales & Service, Operations & Execution, Risk & Compliance, Business Support — desglosadas en decenas de capacidades (KYC/Account Opening, Lending, Payments, Cards, Regulatory & Compliance…). Es un catálogo pre-armado de *por dónde cortar* en banca.

## Conexión con DDD

La descomposición por subdominio es DDD estratégico: cada servicio idealmente coincide con un **bounded context**, con su *ubiquitous language* y su modelo propio. Las APIs se definen "en función de dominios / subdominios" (slide 28), y dentro de cada servicio el modelo se organiza con [[Aggregate (DDD)|aggregates]].

## Criterios para un buen corte

- **Alta cohesión** dentro del servicio, **bajo acoplamiento** entre servicios.
- Alineado con **capacidades de negocio** o **bounded contexts**, no con capas técnicas.
- Que minimice las transacciones que cruzan servicios (porque esas obligan a [[Patrón Saga|sagas]]).
- Que respete la **Ley de Conway**: el corte debe poder mapear a equipos autónomos.

## Pregunta a profundizar

¿Conviene empezar con servicios grandes (coarse) y dividir cuando duela, o nacer fino? ¿Cómo se detecta un mal corte (servicios que siempre se despliegan juntos, transacciones que cruzan todo)?

## Fuentes y lecturas

- Evans — *Domain-Driven Design* (subdominios, bounded contexts).
- Richardson — *Microservices Patterns*, cap. 2 (decomposition).
- BIAN — bian.org.
