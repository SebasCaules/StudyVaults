---
title: Architectural Guardrails
aliases:
  - "Architectural Guardrails"
  - "Guardrails"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [proceso, guardrails, gobernanza, plataforma]
sources:
  - "raw/classes/Clase 4.pdf"
related:
  - "[[Platform Engineering]]"
  - "[[Golden Paths]]"
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Emergent vs Intentional Design]]"
  - "[[ADR — Architecture Decision Record]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Caso Healthcare.gov]]"
---

# Architectural Guardrails

## ¿Qué son?

Reglas organizacionales que **encauzan** decisiones arquitectónicas locales **sin dictar** las soluciones. Son la forma moderna de "gobernanza arquitectónica" — el punto medio entre arquitectura prescriptiva (top-down) y laissez-faire (cada equipo elige todo).

La metáfora es literal: barreras de contención en una autopista — no dictan por dónde manejás, evitan que te salgas de la ruta (source: raw/classes/Clase 4.pdf).

## Ejemplos concretos

### Observabilidad
- Todo servicio **debe** exponer `/metrics` en formato Prometheus.
- Toda request debe propagar un `trace-id` compatible con OpenTelemetry.
- Logs estructurados en JSON con campos mínimos: `ts`, `level`, `service`, `trace-id`, `msg`.

### Contratos de API
- REST: versionado en path (`/v1/...`), OpenAPI como contrato, cambios breaking requieren nueva versión.
- Eventos: schema registry (Avro/Protobuf), deprecación mínima de 90 días.

### Datos
- PII siempre encriptada at-rest y in-transit.
- Retention policies mandatorias por tipo de dato.
- No compartir DBs entre servicios; integración vía API o eventos.

### Seguridad
- OAuth2 con librería de la plataforma — prohibido implementar JWT a mano.
- Secrets en vault central, no en env vars ni código.
- CSP headers obligatorios en apps web.

### Operaciones
- SLOs por servicio definidos antes del launch.
- Runbooks mínimos para incidentes P0/P1.
- Healthchecks `/healthz` liveness y `/ready` readiness.

## Por qué funciona

1. **Reduce carga cognitiva** — el equipo no re-debate lo decidido a nivel org.
2. **Consistencia transversal** — observabilidad uniforme, debug más fácil, operaciones escalables.
3. **Preserva autonomía** — el equipo elige el *cómo*, la org fija el *qué*.
4. **Escala con la organización** — no requiere un arquitecto revisando cada decisión.

## Principios de diseño

**Los guardrails buenos son:**
- **Pocos** — 20 guardrails > 200. Si hay 200, nadie los recuerda.
- **Justificados** — cada uno documentado con el "por qué" (incidente pasado, requisito regulatorio, decisión estratégica).
- **Automatizables** — un guardrail que depende de disciplina manual se viola en crisis. Lo ideal: lint, CI check, plataforma que los impone por construcción.
- **Revisables** — con proceso formal para proponer excepciones y para revisar relevancia periódica.

**Los guardrails malos son:**
- Prescripciones de tech stack ("todos usan React"). Eso es arquitectura prescriptiva, no guardrail.
- Reglas sin dueño ni justificación — se convierten en folklore.
- Listas de 50 items en un doc estático que nadie lee.

## Implementación: del papel a la plataforma

Escalera de madurez:

1. **Doc en Confluence/Notion** — lista de guardrails. Viola-confidence: alta.
2. **Lint + CI checks** — algunos guardrails verificados automáticamente (lint en formato de logs, scan de secrets, test de contratos).
3. **[[Platform Engineering|Internal Developer Platform]]** — los guardrails son la *única* manera de hacer las cosas. Crear un servicio vía el IDP ya expone `/metrics`, usa el vault, tiene OAuth, loguea estructurado.

El estadio 3 convierte guardrails de "regla" a "estructura". Nadie los viola porque están incorporados al camino feliz ([[Golden Paths]]).

## Guardrails vs Standards vs Policies

Distinción útil (no universal, pero operativa):

| Término | Alcance | Exigibilidad | Ejemplo |
|---|---|---|---|
| **Guardrail** | Decisión arquitectónica a nivel org | Mandatorio por default, excepción documentada | "Servicios deben exponer `/metrics`" |
| **Standard** | Cómo implementar | Recomendación fuerte | "Usar OpenTelemetry SDK v1.x" |
| **Policy** | Compliance / legal | Mandatorio sin excepción | "PII encriptada at-rest" |

## Anti-patrones

- **Guardrails inflación** — cada incidente genera un nuevo guardrail. A los 5 años, 300 reglas incoherentes.
- **Guardrails sin plataforma** — todo el mundo los "respeta" pero nadie verifica.
- **Guardrails burocráticos** — cada excepción requiere 6 aprobaciones; el equipo rodea el sistema.
- **Guardrails silencio** — nadie conoce los que existen; se descubren cuando alguien los rompe.

## Pregunta a profundizar

¿Dónde termina el "guardrail" y empieza la "arquitectura prescriptiva totalitaria"? ¿Existe una métrica útil — ratio de decisiones que el equipo toma libremente vs las que la org fija? ¿Cómo se consensúa ese ratio?

## Fuentes y lecturas

- Skelton, Pais — *Team Topologies*, cap. sobre *platform teams*.
- Ford, Parsons, Kua — *Building Evolutionary Architectures* — *fitness functions* como guardrail verificable.
- Humanitec — *State of Platform Engineering Report*.
