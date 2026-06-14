---
title: SLA, SLO, SLI
aliases:
  - "SLA, SLO, SLI"
  - "SLA"
  - "SLO"
  - "SLI"
  - "Error budget"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [operaciones, sre, metricas, sla, slo, sli]
sources:
  - "raw/classes/Clase 1.pdf"
  - "raw/classes/Clase 4.pdf"
related:
  - "[[Atributos de calidad]]"
  - "[[MTBF y MTTR]]"
  - "[[ATAM]]"
  - "[[Árbol de utilidad]]"
---

# SLA, SLO, SLI

## La tríada de Google SRE

Popularizada por el equipo SRE de Google (*Site Reliability Engineering*, O'Reilly 2016). Estandariza cómo hablar de **compromisos operacionales cuantitativos** (source: raw/classes/Clase 1.pdf).

### SLI — Service Level Indicator

**Qué es:** una **métrica** real, medible, de un aspecto del servicio.

**Ejemplos:**
- % de requests HTTP que respondieron con 2xx o 3xx.
- Latencia p99 de las requests completadas.
- Throughput sostenido (rps) antes de degradar.
- % de jobs batch que completaron dentro de la ventana.

Propiedades de un buen SLI:
- **Centrado en la experiencia del usuario** — "% de requests exitosas" > "CPU del server".
- **Cociente** (eventos buenos / eventos totales) para normalizar por carga.
- **Agregable en ventanas** (minutos, horas, mes).

### SLO — Service Level Objective

**Qué es:** un **objetivo interno** expresado como un umbral sobre un SLI.

**Formato canónico:** *"El SLI X debe estar por encima/debajo de Y durante una ventana Z"*.

**Ejemplos:**
- El 99.9% de las requests responden con 2xx/3xx en una ventana rolling de 30 días.
- La latencia p99 es < 500ms el 99% del tiempo medido en buckets de 1 min.
- El 99.95% de los eventos son procesados dentro de 60s desde su emisión.

Los SLOs son **internos** y sirven como **contrato con ingeniería** — guían priorización de trabajo operacional.

### SLA — Service Level Agreement

**Qué es:** un **contrato externo** con consecuencias (crédito, multas, terminación) si no se cumple el SLO publicado.

**Ejemplos:**
- AWS EC2: 99.99% availability mensual → si se baja, créditos hasta 30%.
- Stripe: 99.99% uptime → crédito pro-rata.

Características:
- **Más laxos que los SLO internos** — una empresa opera a 99.99% internamente y promete 99.9% al cliente, dejando margen.
- **Escritos en lenguaje legal** — con definiciones explícitas de "downtime", "ventana de medición", exclusiones.
- **Sólo para clientes pagos** o cuando hay fricción contractual. Un producto interno tiene SLOs pero no SLA.

## Relación jerárquica

```
SLI  →  métrica (lo que se mide)
  ↓
SLO  →  objetivo interno (lo que se busca)
  ↓
SLA  →  contrato externo (lo que se promete, con penalidad)
```

**Regla práctica:** SLA ≤ SLO ≤ 100%. Nunca publicar un SLA igual al SLO interno — se queda sin margen.

## Error budget

Derivado del SLO: si el SLO es 99.9% de disponibilidad mensual, el **error budget** es 0.1% del mes ≈ **43 min** de downtime permitido.

El error budget es la **moneda** con la que se negocia riesgo:
- Si queda error budget → se permiten deploys agresivos, experimentos.
- Si se agotó → congelar deploys, priorizar estabilidad.

Esta mecánica convierte la fricción clásica "dev quiere velocidad, ops quiere estabilidad" en un criterio objetivo.

## Ejemplos de "nines"

| Disponibilidad | Downtime mensual | Downtime anual |
|---|---|---|
| 99% (2 nines) | 7h 12min | 3d 15h |
| 99.9% (3 nines) | 43min 49s | 8h 45min |
| 99.95% | 21min 54s | 4h 22min |
| 99.99% (4 nines) | 4min 22s | 52min 35s |
| 99.999% (5 nines) | 26s | 5min 15s |

Cada "nine" adicional cuesta aproximadamente **10x más** en esfuerzo de ingeniería. 5 nines está reservado para infraestructura crítica (telefonía, networking core).

## Errores comunes

1. **SLO sin SLI verificable.** "99.9% de uptime" sin definir qué cuenta como "up". El primer incidente revela el agujero.
2. **Medir availability como "ping exitoso al server"** cuando los usuarios miden "transacción exitosa end-to-end". El primero pasa, el segundo falla.
3. **SLA = SLO.** Sin margen ingenieril — el primer incidente genera multa.
4. **Demasiados SLOs** — si un servicio tiene 20 SLOs, nadie sabe cuál priorizar. Pocos y claros.
5. **SLOs sin dueño** — alguien debe *responder* por mantenerlos.

## Relación con arquitectura

Los SLOs son la **traducción operacional** de los atributos de calidad ([[Atributos de calidad]]):

- Availability SLO → decisiones de replicación, failover, multi-region.
- Latency SLO → decisiones de caching, CDN, batching.
- Throughput SLO → decisiones de sharding, autoscaling.

Un [[Árbol de utilidad]] bien construido debe tener hojas que se mapeen directamente a SLOs.

## Pregunta a profundizar

¿Cómo se define SLO para atributos "intrínsecos" como *maintainability* o *testability*? ¿Hace sentido, o sólo los runtime qualities se prestan a SLO?

## Fuentes y lecturas

- Beyer et al. — *Site Reliability Engineering* (Google, O'Reilly 2016), caps. sobre SLI/SLO/SLA.
- Beyer et al. — *The Site Reliability Workbook* (Google, O'Reilly 2018).
- Sridharan — *Distributed Systems Observability*.
