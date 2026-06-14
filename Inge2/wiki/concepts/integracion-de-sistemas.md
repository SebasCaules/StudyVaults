---
title: "Integración de sistemas"
aliases:
  - "Integración de sistemas"
  - "Integración de aplicaciones"
  - "EAI"
  - "Point-to-Point"
  - "Hub and Spoke"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [integracion, eai, soa, microservicios, arquitectura, acoplamiento]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[SOA — Service-Oriented Architecture]]"
  - "[[ESB — Enterprise Service Bus]]"
  - "[[Microservicios]]"
  - "[[Estilos arquitectónicos]]"
  - "[[API Gateway]]"
---

# Integración de sistemas

## Qué es

La **integración de sistemas** (o *Enterprise Application Integration*, EAI) es el problema de hacer que aplicaciones distintas —desarrolladas en distintas épocas, por distintos equipos, con distintos datos— **trabajen juntas**. La tesis central de la [[Clase 9 — Integración de Sistemas / SOA / Microservicios|clase]] es que las formas de integrar no son modas que se reemplazan, sino una **escalera evolutiva** de cómo una empresa expone sus funcionalidades de negocio, sobre tres ejes: *mayor business ownership, mayor desacoplamiento, audiencia más amplia* (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 15).

## Estrategias de integración (la matriz 3×3)

La clase ordena las técnicas en una matriz (slide 2):

| Alcance ↓ / Estilo → | Batch-based | Event-based | Connected |
|---|---|---|---|
| **Local** | Batch Transfer Direct | Event-based Point to Point | Real-time Direct Access |
| **Enterprise** | Batch-based Hub and Spoke | Event-based Hub and Spoke | Enterprise (Service/API) Exposure |
| **Public/Partner** | Batch Transfer B2B | External Event Management | External (API) Exposure |

## La evolución histórica

### Principios de los 90s — Point-to-Point

Cada aplicación se conecta directamente con cada otra, con **código de integración disperso** en cada extremo (ERP ↔ CRM ↔ BI ↔ Billing ↔ SCM ↔ Legacy). Problemas (slide 4):

- **Alto acoplamiento** — cambiar un sistema rompe a sus vecinos.
- **Dificultad de mantenimiento** — el grafo de conexiones crece O(N²).
- **Dependencia entre sistemas** y **responsabilidades poco claras**.

Es el "plato de espagueti" de integración.

### Fines de los 90s — Integration Hub → ESB

Aparece un **Integration Hub** central con *Adapters* por sistema. El hub concentra (slide 5):

- **Canonical integration**: data translation, routing/distribution, composition.
- **Adaptation**: data handling, connection management, protocol conversion, transport.

Esto evoluciona al **[[ESB — Enterprise Service Bus|Enterprise Service Bus]]**, con [[BPM y BAM|BPM/BAM]], Governance y Registry alrededor.

### Principios de los 2000 — Service exposure (nace SOA)

Sobre el hub se monta un **Service Exposure Gateway** y un **Service Registry** (design-time + runtime), que agregan virtualización, visibility, traffic management y security. Es la base de [[SOA — Service-Oriented Architecture|SOA]] (slide 10).

### ~2010 — API exposure

Convivencia de **REST/JSON fine-grained** (consumido por browsers vía Ajax) con **SOAP coarse-grained** (enterprise), separados por una **DMZ** (slide 12).

### Post-2010 — External API + Microservicios

La audiencia se abre: cientos de "experimenters" externos, decenas de apps consumidoras, un puñado de consumidores internos (slide 13). Es la era de [[Microservicios|microservicios]] + APIs públicas.

## La escalera de exposición

El resumen del recorrido (slide 15), de menor a mayor ownership/desacoplamiento/audiencia:

1. **Low-level APIs** (platform/package)
2. **Application integration** → [[ESB — Enterprise Service Bus|ESB]]
3. **Service exposure (enterprise)** → [[SOA — Service-Oriented Architecture|SOA]]
4. **Service/API exposure (external known consumers)** → API + SOA
5. **External API exposure (public)** → API + [[Microservicios]]
6. **¿Future?**

## Por qué importa (lente de negocio)

Subir un escalón **no es siempre mejor**: cada nivel agrega desacoplamiento pero también complejidad operativa. La decisión arquitectónica es *en qué escalón parar* según el driver de negocio real (audiencia, autonomía de equipos, velocidad de cambio), no según la moda. Saltar directo a microservicios sin necesidad es un anti-pattern (ver desventajas en [[Microservicios]]).

## Pregunta a profundizar

¿Una organización puede vivir en varios escalones a la vez (legacy point-to-point + ESB + microservicios nuevos)? ¿Cómo se gobierna esa heterogeneidad sin volver al espagueti?

## Fuentes y lecturas

- Hohpe, Woolf — *Enterprise Integration Patterns*.
- Richardson — *Microservices Patterns*, cap. 1 (de monolito a microservicios).
