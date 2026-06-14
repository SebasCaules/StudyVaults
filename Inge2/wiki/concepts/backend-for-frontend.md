---
title: "Backend for Frontend (BFF)"
aliases:
  - "Backend for Frontend (BFF)"
  - "Backend for Frontend"
  - "BFF"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [bff, api-gateway, microservicios, comunicacion, frontend]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[API Gateway]]"
  - "[[Microservicios]]"
---

# Backend for Frontend (BFF)

## Qué es

El **Backend for Frontend** es una variante del [[API Gateway]]: en vez de un único gateway para todos, se tiene **un backend de borde por tipo de cliente** (uno para la web, uno para mobile, uno para terceros), cada uno ofreciendo **APIs específicas para ese cliente** (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 36).

## Qué resuelve

Hace **composición de APIs** y "baking" a medida de cada frontend (slide 36):

- **Localización** — adaptar a idioma/región del cliente.
- **Evitar el overfetching** — devolver exactamente los datos que esa UI necesita, ni más (clave en mobile, donde el ancho de banda importa) ni menos (evita N+1 llamadas).
- **Versioning and compatibility** — cada cliente evoluciona su API a su ritmo.

## Por qué importa

Distintos clientes tienen **distintas necesidades**: una app mobile quiere payloads chicos y pocas llamadas; una web rica puede tolerar más. Un único API Gateway genérico termina siendo un compromiso malo para todos. El BFF le da a cada frontend un backend **a medida**, mantenido idealmente por el mismo equipo que hace ese frontend.

## Trade-off

- **A favor:** APIs óptimas por cliente, equipos de frontend autónomos.
- **En contra:** más componentes que mantener; riesgo de duplicar lógica entre BFFs (hay que compartir lo común en servicios downstream).

## Cuándo NO

Si hay un solo tipo de cliente, o las necesidades son homogéneas, un [[API Gateway]] único alcanza — varios BFFs serían over-engineering.

## Pregunta a profundizar

¿Dónde poner la lógica común a todos los BFFs sin duplicarla y sin crear un nuevo monolito de borde?

## Fuentes y lecturas

- Newman — sobre BFF (samnewman.io/patterns/architectural/bff).
- Richardson — *Microservices Patterns*, cap. 8.
