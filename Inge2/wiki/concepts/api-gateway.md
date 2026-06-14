---
title: "API Gateway"
aliases:
  - "API Gateway"
  - "Gateway de API"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [api-gateway, microservicios, comunicacion, borde, seguridad]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Backend for Frontend (BFF)]]"
  - "[[Microservicios]]"
  - "[[Mecanismos de seguridad]]"
  - "[[ESB — Enterprise Service Bus]]"
  - "[[Circuit Breaker]]"
---

# API Gateway

## Qué es

El **API Gateway** es el **punto de entrada único** entre los consumidores (browsers, apps mobile, terceros) y los microservicios de backend. En vez de que cada cliente hable con N servicios, habla con el gateway, que rutea y compone (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 35).

## Responsabilidades

- **Ruteo de request** — dirigir cada llamada al servicio correcto.
- **Composición de APIs** — combinar respuestas de varios servicios en una sola (evita que el cliente haga muchas llamadas).
- **Traducción de protocolos** — ej.: REST/JSON hacia afuera, gRPC/mensajería hacia adentro.
- **APIs específicas por cliente** — distinta forma para web, mobile, terceros (lleva al [[Backend for Frontend (BFF)|BFF]]).

### Funciones de borde (cross-cutting)

El gateway concentra lo que no debería repetir cada servicio (slide 35):

- **Authentication** y **Authorization** (ver [[Mecanismos de seguridad]]).
- **Rate limiting** (proteger el backend de abuso/picos).
- **Caching**.
- **Metrics collection** y **request logging**.

## Por qué importa (lente de negocio)

Saca responsabilidades transversales del código de cada microservicio y las centraliza en el borde → los servicios quedan enfocados en su dominio, y seguridad/rate-limiting/observabilidad se gobiernan en un solo lugar. Es lo que hace manejable exponer decenas de servicios a un mundo de consumidores heterogéneos.

## API Gateway vs ESB

No confundir con el [[ESB — Enterprise Service Bus|ESB]]:

- **ESB** — bus de integración **interno** entre sistemas, con lógica de transformación/composición pesada ("smart pipe").
- **API Gateway** — capa **de borde** liviana hacia los **consumidores**; rutea y aplica políticas, pero la lógica vive en los servicios ("smart endpoints, dumb pipes").

## Cuándo NO / riesgos

- Puede volverse un **cuello de botella** o **single point of failure** → necesita alta disponibilidad y suele combinarse con [[Circuit Breaker]].
- Riesgo de que se transforme en un **mini-monolito** si se le mete lógica de negocio.

## Pregunta a profundizar

¿Un solo gateway para todos los clientes, o uno por tipo de cliente ([[Backend for Frontend (BFF)|BFF]])? ¿Cuándo conviene cada uno?

## Fuentes y lecturas

- Richardson — *Microservices Patterns*, cap. 8 (external API).
- microservices.io — API Gateway pattern.
