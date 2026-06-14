---
title: Árbol de utilidad
aliases:
  - "Árbol de utilidad"
  - "Utility tree"
  - "Árbol de utilidad ATAM"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [evaluacion, arbol-utilidad, atam, escenarios, priorizacion]
sources:
  - "raw/classes/Clase 4.pdf"
related:
  - "[[ATAM]]"
  - "[[SAAM]]"
  - "[[Atributos de calidad]]"
  - "[[Attribute Driven Design]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[SLA, SLO, SLI]]"
---

# Árbol de utilidad

## Propósito

Estructura jerárquica que conecta el **valor abstracto** del sistema con **escenarios concretos y verificables**. Es el artefacto que rompe la tentación de decir "queremos performance" y obliga a decir "queremos p95 < 100ms a 10k rps con 99.9% uptime durante un incidente de región".

Se usa principalmente en [[ATAM]] y [[SAAM]] (source: raw/classes/Clase 4.pdf).

## Estructura

```
Raíz: Utilidad del sistema
├── Atributo 1: Performance
│   ├── Feature: latencia
│   │   ├── Escenario: p95 < 100ms a 10k rps  (H, H)
│   │   └── Escenario: p99 < 500ms bajo carga pico  (H, M)
│   └── Feature: throughput
│       └── Escenario: 50k rps sostenidos en peak-hour  (M, H)
├── Atributo 2: Availability
│   └── Feature: uptime
│       ├── Escenario: 99.95% mensual  (H, M)
│       └── Escenario: recuperación < 5min ante caída de DB primaria  (H, H)
└── Atributo 3: Security
    └── Feature: authN/authZ
        └── Escenario: bloqueo post-5 fallos en 60s  (M, L)
```

### Niveles

1. **Raíz:** utilidad general del sistema (nombre corto — "Sistema de pagos").
2. **Nivel 1 — Atributos de calidad** priorizados (Performance, Availability, Security, etc., de [[Atributos de calidad]]).
3. **Nivel 2 — Features** dentro de cada atributo (latencia, throughput, uptime, ...).
4. **Hojas — Escenarios concretos**, anotados con **(importancia, dificultad)**.

### Anotación (importancia, dificultad)

Cada escenario se etiqueta con un par, típicamente **H/M/L**:

- **Importancia (para el negocio):** H = crítico; M = deseable; L = nice-to-have.
- **Dificultad (técnica arquitectónica):** H = requiere decisiones arquitectónicas no-triviales; M = posible con buenas prácticas; L = trivial.

La combinación determina el foco del análisis.

## Matriz de priorización

| Imp \ Dif | H | M | L |
|---|---|---|---|
| **H** | **Focus principal** — riesgo y esfuerzo altos | Focus secundario | Implementar y verificar |
| **M** | Analizar trade-offs | Típico del backlog | Baseline |
| **L** | Reconsiderar si hace falta | Baja prioridad | Ignorar |

Los escenarios **H/H** y **H/M** son los que guían [[ATAM]] y [[SAAM]].

## Plantilla de escenario

Un escenario bien formado tiene 6 partes:

1. **Source** — quién/qué lo origina (usuario, otro sistema, falla).
2. **Stimulus** — el evento concreto.
3. **Environment** — contexto (normal, pico, fallo).
4. **Artifact** — qué componente recibe el estímulo.
5. **Response** — qué hace el sistema.
6. **Response measure** — la métrica verificable.

Ejemplo: *"Ante un DDoS (source, stimulus) durante el horario pico de ventas (environment), el API Gateway (artifact) debe mantener el servicio para tráfico legítimo (response) con degradación máxima de 20% en p95 de latencia durante 10 min (response measure)."*

## Cómo construirlo en la práctica

1. **Workshop con stakeholders** (2-4h). Cada uno propone atributos y escenarios.
2. **Agrupar duplicados** y normalizar redacción a la plantilla de 6 partes.
3. **Asignar (Importancia, Dificultad)** con voto o consenso.
4. **Podar** — las hojas L/L se archivan.
5. **Socializar** el árbol como input a [[Attribute Driven Design]] o [[ATAM]].

## Anti-patrones

- **Escenarios vagos:** "el sistema debe ser rápido" — sin métrica no es escenario.
- **Priorización sesgada** — un solo stakeholder imponiendo sus prioridades.
- **Árbol completo pero estático** — no se revisa al cambiar el negocio.
- **H/H por todas partes** — dilución de prioridades; el árbol debe ser discriminante.

## Relación con otros artefactos

- Input para [[Attribute Driven Design]] paso 2 ("identificar drivers").
- Input para [[ATAM]] paso 5 ("generar árbol de utilidad").
- Base para SLOs operacionales (ver [[SLA, SLO, SLI]]).
- Contraparte cuantitativa de las **user stories** funcionales.

## Pregunta a profundizar

¿Cómo mantener el árbol de utilidad **vivo** a lo largo de años? ¿Se re-evalúa en cada release major? ¿Se versiona como documentación arquitectónica en git?

## Fuentes y lecturas

- Kazman, Klein, Clements — *ATAM: Method for Architecture Evaluation* (SEI, 2000).
- Bass, Clements, Kazman — *Software Architecture in Practice*, cap. sobre escenarios.
- Bachmann, Bass — *Introduction to the Attribute Driven Design Method* (SEI, 2000).
