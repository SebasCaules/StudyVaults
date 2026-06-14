---
title: "Clase 4 — ¿Cuándo diseñamos?"
aliases:
  - "Clase 4 — ¿Cuándo diseñamos?"
  - "Clase 4"
type: class
created: 2026-04-22
updated: 2026-05-12
tags: [arquitectura, bduf, yagni, jeduf, emergent-design, guardrails, platform-engineering, atam, saam, healthcare-gov, residuality-theory]
sources:
  - raw/classes/2026-04-09 - Clase 4/Clase 4.pdf
  - raw/classes/2026-04-09 - Clase 4/Clase V - Caso Healthcare.gov.pdf
  - raw/classes/2026-04-09 - Clase 4/oei-06-14-00350.pdf
  - raw/classes/2026-04-09 - Clase 4/clase4.pdf
date: 2026-04-09
related:
  - "[[Clase 5 — Documentación de arquitecturas]]"
  - "[[Clase 6 — Persistencia]]"
  - "[[Caso Healthcare.gov]]"
  - "[[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]]"
  - "[[OEI-06-14-00350 — HealthCare.gov Case Study (HHS OIG)]]"
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Emergent vs Intentional Design]]"
  - "[[Architectural Guardrails]]"
  - "[[Platform Engineering]]"
  - "[[Golden Paths]]"
  - "[[SAAM]]"
  - "[[ATAM]]"
  - "[[Lightweight ATAM]]"
  - "[[Árbol de utilidad]]"
  - "[[ADR — Architecture Decision Record]]"
  - "[[Katas de Arquitectura]]"
  - "[[Cono de incertidumbre]]"
  - "[[SLA, SLO, SLI]]"
  - "[[MTBF y MTTR]]"
---

# Clase 4 — ¿Cuándo diseñamos?

## TL;DR

El momento del diseño es tan arquitectónico como el contenido del diseño. La clase confronta tres posturas ([[BDUF vs YAGNI vs JEDUF]]), introduce la tensión **emergent vs intentional**, propone [[Architectural Guardrails]] y [[Platform Engineering]] como mecanismos organizacionales para que el diseño suceda sin frenar al equipo, y cierra con técnicas de **evaluación** ([[SAAM]], [[ATAM]], [[Lightweight ATAM]]) y el [[Árbol de utilidad]].

## Mapa conceptual

- [[BDUF vs YAGNI vs JEDUF]] — tres posturas sobre cuánto diseñar antes.
- [[Emergent vs Intentional Design]] — evolución natural vs intención explícita.
- [[Architectural Guardrails]] — reglas que encauzan sin dictar.
- [[Platform Engineering]] — IDPs (Internal Developer Platforms): Fury (ML), Backstage (Spotify), Jarvis.
- Golden Paths y Single Pane of Glass.
- Evaluación: [[SAAM]] (1993), [[ATAM]] (2000), [[Lightweight ATAM]].
- [[Árbol de utilidad]] — atributos → features → escenarios anotados.
- Técnicas cuantitativas: métricas, prototipos, simulación (Palladio), experimentos, modelos matemáticos (SRGM).
- IWKWYSI — *"I Will Know When I See It"* — anti-patrón de cliente.

## Desarrollo

### Tres posturas sobre cuándo diseñar

**BDUF (Big Design Up Front):** diseñar todo antes de codear. Ventaja: coherencia global. Riesgo: asume que el dominio se entiende de entrada — contradice el [[Cono de incertidumbre]].

**YAGNI (You Ain't Gonna Need It):** no diseñar para necesidades futuras. Ventaja: evita sobre-ingeniería. Riesgo: llega tarde a decisiones irreversibles (DB, esquema de API pública, modelo de seguridad).

**JEDUF (Just Enough Design Up Front):** diseñar lo suficiente para que el equipo arranque con una dirección clara, dejando lo demás para emerger. Es la postura defendida por la cátedra: balance entre anclar lo costoso-de-cambiar y aplazar lo barato-de-cambiar.

### Emergent vs Intentional Design

- **Emergent:** la arquitectura surge del refactoring continuo sobre código que crece. Funciona en equipos pequeños y dominios chicos.
- **Intentional:** la arquitectura se define deliberadamente antes de escalar el equipo. Necesario cuando el costo de un giro tardío excede el de la inversión inicial.

No son excluyentes. Kent Beck: *"embrace change"*; Fowler *Is Design Dead?* argumenta que emergent design **requiere** disciplina intencional (tests, refactoring). La práctica madura combina ambos.

### Architectural Guardrails

Reglas que **encauzan sin dictar**: no "usá este framework", sino "todo servicio expone métricas en /metrics". Ejemplos:

- Contratos de observabilidad (logs, métricas, traces).
- Formatos de API versionada.
- Políticas de datos (PII, retention).
- SLOs por dominio.

Los guardrails son el **punto medio** entre laissez-faire y diseño top-down totalitario. El equipo elige el cómo; la org fija el qué.

### Platform Engineering

La respuesta organizacional: un equipo dedicado construye la **Internal Developer Platform (IDP)** que materializa los guardrails como plataforma, reduciendo la carga cognitiva del ingeniero de aplicación. Ejemplos citados en clase (source: raw/classes/Clase 4.pdf):

- **Fury** — plataforma interna de MercadoLibre.
- **Backstage** — framework open-source de Spotify (ahora CNCF).
- **Jarvis** — plataforma interna (contexto industria).

Conceptos clave:
- **Golden Paths:** caminos "felices" pre-construidos para casos comunes (crear servicio, agregar DB, exponer API).
- **Single Pane of Glass:** una sola UI donde el dev ve todo (deploys, logs, métricas, costos).

### Evaluación de arquitecturas

Dos familias de técnicas (source: raw/classes/Clase 4.pdf):

**Cualitativas:**
- Escenarios (base para SAAM y ATAM).
- Checklists.
- Cuestionarios dirigidos a stakeholders.

**Cuantitativas:**
- Métricas: [[SLA, SLO, SLI]], [[MTBF y MTTR]].
- Prototipos.
- Simulaciones (ej: **Palladio** para performance predictive).
- Experimentos controlados.
- Modelos matemáticos (SRGM — Software Reliability Growth Models, Architecture-based Performance Analysis).

### Video — Residuality Theory (Barry O'Reilly)

La clase muestra un **video sobre Residuality Theory** como complemento al material sobre evaluación (source: raw/classes/2026-04-09 - Clase 4/clase4.pdf). La teoría — propuesta por Barry O'Reilly — sostiene que un sistema sobrevive no por evitar todos los modos de falla previstos, sino por preservar un **residuo de funcionalidad** ante perturbaciones inesperadas. El método consiste en:

1. Identificar **stressors** plausibles (no sólo los del happy path, también cisnes negros).
2. Para cada stressor, modelar el **residuo del sistema** — qué queda funcionando cuando golpea.
3. Iterar sobre el diseño hasta que la unión de residuos cubra el conjunto crítico de funciones de negocio.

Es una contracara útil al ATAM: ATAM evalúa que la arquitectura cumpla atributos definidos; Residuality Theory pregunta cómo se comporta ante stressors **no previstos**. En la práctica, los dos se complementan.

> En las notas de clase se registra sólo la mención del video; el alumno debería ver el video completo para profundizar. Búsquedas útiles: *Barry O'Reilly Residuality Theory*, *Antifragile Software Architecture*.

### Ejercicio en clase — Parcial 2013 desarrollado en pizarra

El cuerpo práctico de la clase es la resolución en vivo del [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie|Ejercicio Parcial 2013]] (sistema de control con sensores serie). El profesor desarrolla los pasos del método sobre la pizarra:

1. **Lista candidata de atributos de calidad** con su justificación (source: raw/classes/2026-04-09 - Clase 4/clase4.pdf):
   - Portability → cambios de hardware.
   - Precision → errores tipo 1 y 2 en detección.
   - Interoperability → cambios de hardware (sensores nuevos).
   - Reliability → sistema ACL (control de acceso).
   - Fault tolerance → falla de sensores.
   - Maintainability → cambios de hardware.
   - Availability → sistema de control.
   - Performance → velocidad de sensado.
2. **Selección priorizada (top 4):** Reliability, Precision, Performance, Interoperability.
3. **Arquitectura candidata en pizarra** con Daemon (sin UI), Pollers redundantes con Heartbeat, Processor, Alarma, persistencia compartida y Webapp MVC para reportes. Patrón de integración: **Producer-Consumer**.

Ver [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]] para el desarrollo arquitectónico completo, incluyendo el diagrama final del pizarrón.

> **Heurística sobre "sistema externo" que aparece en pizarra:** *depende de qué tanto control tenés sobre el sistema; si tenés 0 control, es externo* (source: raw/classes/2026-04-09 - Clase 4/clase4.pdf). La definición operativa de "sistema externo" no es topológica (¿está fuera de mi red?) sino de **control** (¿puedo cambiarle el código o el contrato?).

> **Sobre limpieza de atributos:** "para el final y la vida real nos quedamos con TODOS los atributos de calidad que encontramos y hacemos esa limpieza de atributos que se pisan entre sí, **pero dejamos todos**" (source: raw/classes/2026-04-09 - Clase 4/clase4.pdf). Los que no entran al top 4 no se descartan — se documentan como riesgos asumidos.

### Caso Healthcare.gov

La clase reparte la consigna `Clase V - Caso Healthcare.gov.pdf` junto al reporte oficial OEI-06-14-00350 (~92 pp) como **kata de aplicación**: simular ATAM Fase 0 y Fase 1 sobre el lanzamiento fallido de octubre 2013 (source: raw/classes/2026-04-09 - Clase 4/Clase V - Caso Healthcare.gov.pdf, raw/classes/2026-04-09 - Clase 4/oei-06-14-00350.pdf). Es el ejercicio práctico que articula árbol de utilidad + sensitivity points + tradeoffs sobre un caso real. Ver [[Caso Healthcare.gov]] para el desarrollo completo y [[OEI-06-14-00350 — HealthCare.gov Case Study (HHS OIG)]] para el resumen del reporte.

**Métodos formales:**
- **[[SAAM]]** (1993) — Software Architecture Analysis Method. Primer método formal, basado en escenarios. Ligero.
- **[[ATAM]]** (2000, SEI/Carnegie Mellon) — Architecture Tradeoff Analysis Method. **Gold standard**, pero costoso: 20–30 person-days, 4 fases formales. Incluye stakeholder workshops, árbol de utilidad, análisis de trade-offs, sensitivity points.
- **[[Lightweight ATAM]]** — versión pragmática, comprimida a 1-2 días, para equipos pequeños.

### Árbol de utilidad

Estructura jerárquica donde:
- **Raíz:** utilidad general del sistema.
- **Nivel 1:** atributos de calidad prioritarios.
- **Nivel 2:** features/categorías dentro de cada atributo.
- **Hojas:** escenarios concretos, anotados con **(importancia, dificultad)** — típicamente H/M/L.

Los escenarios priorizados (H/H, H/M) son los que guían la evaluación.

### Cono de incertidumbre (recordatorio)

Mencionado en esta clase como argumento para JEDUF (source: raw/classes/Clase 4.pdf). El cono se cierra a medida que el proyecto madura — diseñar temprano es apostar en el rango 4x/0.25x.

### IWKWYSI

*"I Will Know When I See It"*. Anti-patrón de cliente/PM que no define requisitos porque *"los reconocerá cuando los vea"*. Combate sugerido: prototipos tempranos + escenarios concretos + Behavior-Driven Specifications.

## Decisiones clave discutidas

| Decisión | Opciones | Criterio | Recomendación cátedra |
|---|---|---|---|
| Cuánto diseñar antes | BDUF / YAGNI / JEDUF | Madurez del dominio, reversibilidad, tamaño del equipo | **JEDUF**; guardrails para lo irreversible. |
| Cómo alinear un equipo grande | Arquitectura prescriptiva / IDP con Golden Paths | Carga cognitiva del dev, autonomía | **IDP + Golden Paths** — encauzar sin dictar. |
| Cómo evaluar una arquitectura | Intuición / SAAM / ATAM / Lightweight ATAM | Tiempo, stakeholders disponibles, importancia de la decisión | ATAM para decisiones costosas; Lightweight para iteraciones. |

## Preguntas para el parcial

1. ¿Por qué JEDUF es preferido a BDUF o YAGNI puro? ¿Qué supuestos hace cada uno?
2. Explicar qué son los Architectural Guardrails y dar 3 ejemplos concretos.
3. ¿Qué problema resuelve una Internal Developer Platform? ¿Cuál es el costo organizacional de tenerla?
4. Construir las primeras 2 capas de un árbol de utilidad para un sistema de mensajería en tiempo real.
5. Comparar SAAM, ATAM y Lightweight ATAM en términos de costo/beneficio.
6. ¿Qué es IWKWYSI y cómo se combate desde el proceso?

## Lecturas complementarias

- Fowler, *Is Design Dead?* — sobre emergent design en XP.
- Kazman, Klein, Clements — *ATAM: Method for Architecture Evaluation* (SEI Technical Report, 2000).
- Skelton, Pais — *Team Topologies* — plataforma y teams como abstracciones.
- Humanitec — *State of Platform Engineering Report*.
