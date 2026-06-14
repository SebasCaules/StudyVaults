---
title: "Service Mesh"
aliases:
  - "Service Mesh"
  - "Service mesh"
  - "Sidecar"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [service-mesh, sidecar, microservicios, comunicacion, resiliencia, observabilidad, tpe]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Circuit Breaker]]"
  - "[[Microservicios]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Evolución del deployment — VM, Containers, Kubernetes, Serverless]]"
  - "[[Platform Engineering]]"
  - "[[TPE 2026-1C — Investigación y presentación de un tema]]"
---

# Service Mesh

## Qué es

Un **Service Mesh** es una **capa de infraestructura dedicada** que gestiona la **comunicación servicio-a-servicio** en una arquitectura de [[Microservicios|microservicios]], **sin tocar el código** de cada servicio. Aparece en la clase como patrón de deployment (Sidecar) y como lugar donde implementar resiliencia (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slides 37-38).

## Cómo funciona: el Sidecar

Junto a cada instancia de servicio se despliega un **proxy sidecar** (un contenedor que corre "al lado"). Todo el tráfico de red del servicio pasa por su sidecar. El conjunto de sidecars forma el **data plane**; un **control plane** los configura centralizadamente. El servicio cree que hace una llamada HTTP normal; el sidecar la intercepta y le aplica políticas.

## Qué resuelve (sin tocar el código)

- **Resiliencia** — timeouts, retries, [[Circuit Breaker|circuit breaking]] (slide 37).
- **Seguridad** — **mTLS** automático entre servicios, autorización (ver [[Mecanismos de seguridad]]).
- **Observabilidad** — métricas, logs y distributed tracing uniformes de todo el tráfico.
- **Traffic management** — load balancing, canary releases, A/B, fault injection.

El valor central: estas capacidades transversales se sacan de cada servicio y se resuelven **una vez, de forma uniforme**, en la malla.

## Relación con el resto

- Es la materialización en red de lo que [[Platform Engineering]] hace a nivel plataforma: capability transversal consumible sin que cada equipo la reimplemente.
- Ejemplos del mercado: **Istio**, **Linkerd**.

## Cuándo NO

Agrega **latencia** (cada hop pasa por dos proxies) y **complejidad operativa** considerable. En pocos servicios, hacer resiliencia/seguridad a nivel librería (app) es más simple — la malla es over-engineering hasta cierta escala.

## Conexión con el TPE 2026

**Service Mesh es uno de los temas funcionales del [[TPE 2026-1C — Investigación y presentación de un tema|TPE 2026-1C]]** (track funcional). Esta clase es material directo: el ángulo "concepto + ejemplos + comparativa" que pide el TPE se arma con la comparación Istio vs Linkerd vs resiliencia a nivel app, encuadrada en los atributos de calidad (resiliencia, seguridad, observabilidad) y su costo (latencia, complejidad).

## Pregunta a profundizar

¿La latencia extra del sidecar se justifica frente a hacer lo mismo con librerías en el código? ¿A partir de cuántos servicios/lenguajes conviene la malla?

## Fuentes y lecturas

- Istio docs (istio.io); Linkerd docs (linkerd.io).
- Richardson — *Microservices Patterns* (deployment/sidecar).
- Morgan — "What's a service mesh?" (buoyant.io).
