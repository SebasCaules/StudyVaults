---
title: "ESB — Enterprise Service Bus"
aliases:
  - "ESB — Enterprise Service Bus"
  - "ESB"
  - "Enterprise Service Bus"
  - "Integration Hub"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [esb, soa, integracion, bus, middleware]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Integración de sistemas]]"
  - "[[SOA — Service-Oriented Architecture]]"
  - "[[BPM y BAM]]"
  - "[[Orquestación vs Coreografía]]"
  - "[[API Gateway]]"
---

# ESB — Enterprise Service Bus

## Qué es

El **Enterprise Service Bus** es la columna vertebral de comunicación de una arquitectura [[SOA — Service-Oriented Architecture|SOA]]: un *middleware* central al que todos los sistemas (ERP, CRM, BI, Billing, SCM, Legacy) se conectan mediante **Adapters**, en lugar de conectarse entre sí (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slides 5-6). Resuelve el problema [[Integración de sistemas|point-to-point]] (acoplamiento O(N²)) reemplazándolo por un modelo *hub-and-spoke*: N conexiones al bus en vez de N² entre sistemas.

## Qué hace el bus

Evolucionó del **Integration Hub** de fines de los 90s. Sus responsabilidades (slide 5):

- **Canonical integration:**
  - *Data translation* — traducir formatos entre sistemas a un modelo canónico.
  - *Routing / distribution* — decidir a qué sistema va cada mensaje.
  - *Composition* — combinar respuestas de varios servicios.
- **Adaptation** (lo que aporta cada Adapter):
  - Data handling, interaction framework, connection management.
  - Low-level API, protocol conversion, transport communication.

Alrededor del bus se montan [[BPM y BAM|BPM y BAM]], Business Process Management, Governance y un Service Registry (slide 6).

## Ventajas

- **Desacopla**: cada sistema conoce sólo el bus, no a sus pares.
- **Centraliza** transformación, ruteo y composición → un solo lugar para gobernar.
- Habilita reutilización de servicios y modelos de datos canónicos.

## Límites (cuándo NO)

El ESB es un **punto central**: puede volverse cuello de botella, single point of failure y "monolito de integración" donde toda la lógica termina concentrada. Esa pesadez es parte de lo que la clase señala como límite de SOA en **escalabilidad, fault tolerance y deployments frecuentes** (slide 16). Microservicios responde a esto descentralizando: comunicación liviana punto a punto o por mensajería, sin un bus inteligente central ("smart endpoints, dumb pipes").

## Relación con API Gateway

Un [[API Gateway]] cumple un rol parecido en microservicios (borde, ruteo, composición) pero es **más liviano y de borde**, no un bus de integración interno con lógica de negocio. No confundir: el ESB media *entre sistemas internos*; el gateway expone *hacia los consumidores*.

## Pregunta a profundizar

¿Cuánta lógica de negocio debe vivir en el bus? El anti-pattern "ESB inteligente" concentra reglas que deberían estar en los servicios — ¿dónde está el límite sano?

## Fuentes y lecturas

- Hohpe, Woolf — *Enterprise Integration Patterns*.
- Fowler — "Microservices" (sobre "smart endpoints, dumb pipes").
