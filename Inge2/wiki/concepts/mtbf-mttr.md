---
title: MTBF y MTTR
aliases:
  - "MTBF y MTTR"
  - "MTBF"
  - "MTTR"
  - "Availability"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [operaciones, reliability, mtbf, mttr, availability]
sources:
  - "raw/classes/Clase 1.pdf"
related:
  - "[[Atributos de calidad]]"
  - "[[SLA, SLO, SLI]]"
  - "[[Clase 1 — Introducción a Arquitectura]]"
---

# MTBF y MTTR

## Las dos métricas fundamentales de reliability

Heredadas de la ingeniería de sistemas físicos (aeronáutica, telefonía), adoptadas por software como métricas de **reliability** y **availability** (source: raw/classes/Clase 1.pdf).

### MTBF — Mean Time Between Failures

**Definición:** tiempo promedio entre dos fallas consecutivas.

**Unidad típica:** horas o días.

**Qué mide:** cuán **confiable** es el sistema — cuánto aguanta entre incidentes.

Para sistemas reparables, la fórmula aproximada en régimen estable:

```
MTBF = Tiempo total operativo / Número de fallas
```

### MTTR — Mean Time To Repair (o To Recover)

**Definición:** tiempo promedio para **restaurar** el servicio después de una falla.

**Unidad típica:** minutos u horas.

**Qué mide:** cuán **recuperable** es el sistema — cuán rápido vuelve a operar.

Ambigüedad común: el acrónimo MTTR puede significar:
- **Mean Time To Repair** — tiempo hasta reparar físicamente/lógicamente.
- **Mean Time To Recover** — tiempo hasta que el servicio está disponible otra vez (incluye failover automático).
- **Mean Time To Resolve** — tiempo hasta cerrar el incidente (post-mortem incluido).

En contexto SRE/DevOps moderno, "MTTR" típicamente refiere a **Time To Recover** — lo que ve el usuario.

## La fórmula de Availability

Combinando ambas:

```
Availability = MTBF / (MTBF + MTTR)
```

Ejemplo: si MTBF = 1000h y MTTR = 1h, availability = 1000 / 1001 ≈ 99.9%.

Dos palancas para mejorar availability:

1. **Subir MTBF** — reducir frecuencia de fallas (mejor diseño, menos bugs, redundancia).
2. **Bajar MTTR** — recuperarse más rápido (monitoring, automated failover, runbooks, rollback rápido).

Históricamente la industria se obsesionó con **MTBF** ("hacer sistemas que no fallen"). La era cloud inclinó el foco al **MTTR** ("asumir que fallan, recuperarse rápido") — ver *design for failure*, chaos engineering.

## Relación con [[SLA, SLO, SLI]]

Availability SLO se puede expresar en términos de MTBF/MTTR:

- SLO = 99.9% → MTBF/(MTBF+MTTR) = 0.999.
- Si MTTR = 1h, necesito MTBF ≥ 999h ≈ 41 días entre fallas.
- Si MTTR = 5 min (0.083h), con MTBF = 83h (~3.5 días) alcanzo 99.9%.

**Insight:** mejorar MTTR es más barato y rápido que mejorar MTBF. Por eso SRE moderno invierte en observabilidad y automation más que en "zero-bug engineering".

## Variantes y métricas relacionadas

- **MTTF (Mean Time To Failure):** usado para sistemas **no reparables** (un disco, un ASIC). Al morir, se reemplaza — no hay MTBF.
- **MTTD (Mean Time To Detect):** tiempo desde que la falla ocurre hasta que se *detecta*. Si MTTD es alto, MTTR se infla. Input directo del monitoring.
- **MTTA (Mean Time To Acknowledge):** tiempo hasta que alguien responde a la alerta. Input de la cultura de oncall.

Cadena típica de un incidente:

```
Falla ocurre  →  Detección  →  Ack  →  Diagnóstico  →  Mitigación  →  Recuperación
              └─MTTD─┘   └MTTA┘                       └────MTTR────┘
```

## Errores comunes

1. **Calcular MTBF a partir de ventanas cortas** — se necesitan semanas/meses de datos para promedios significativos.
2. **Contar MTTR desde que alguien lo pone en Jira** en vez de desde la falla real → subestima.
3. **Ignorar MTTD** — un MTTR de 10 min suena bien hasta que ves que MTTD fue 4 horas.
4. **Promediar distribuciones muy skewed** — un incidente de 8h anula 100 incidentes de 2min. Usar también p50/p95 de tiempo a recuperar.

## MTBF, MTTR y costos

- Bajar MTTR requiere **monitoring, alerting, automation** — costo fijo recurrente (plataforma, staff on-call).
- Subir MTBF requiere **ingeniería de reliability** — testing exhaustivo, redundancia, patterns resilientes — costo variable alto.

Trade-off: para alcanzar 99.99% con MTTR = 5 min se puede tener MTBF = 8h y pasa; para 99.99% con MTTR = 1h, hace falta MTBF de 100h (~4 días). Dos caminos, costos distintos.

## Relación con arquitectura

Decisiones que mejoran cada métrica:

| Para subir MTBF | Para bajar MTTR |
|---|---|
| Redundancia activa-activa | Failover automático |
| Circuit breakers, bulkheads | Runbooks y playbooks |
| Testing exhaustivo, fuzz, chaos | Observabilidad (logs, metrics, traces) |
| Validación de inputs | Rollback rápido |
| Rate limiting, backpressure | Feature flags para desactivar features problemáticas |
| Formal methods (casos críticos) | On-call rotations efectivas |

## Pregunta a profundizar

¿Cómo medir MTBF de sistemas **parcialmente degradados**? Ejemplo: 1% de usuarios con error durante 10 min — ¿es una "falla" completa? Las definiciones dependen del [[Atributos de calidad|SLI]] que uno elija.

## Fuentes y lecturas

- Beyer et al. — *Site Reliability Engineering* (Google, O'Reilly).
- Lyu — *Handbook of Software Reliability Engineering*.
- Rosenthal et al. — *Chaos Engineering*.
