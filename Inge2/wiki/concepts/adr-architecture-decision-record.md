---
title: ADR — Architecture Decision Record
aliases:
  - "ADR — Architecture Decision Record"
  - "ADR"
  - "Architecture Decision Record"
type: concept
created: 2026-05-06
updated: 2026-05-06
tags: [adr, decisiones, documentacion, arquitectura, registro]
sources: []
related:
  - "[[Arquitectura de software — definición]]"
  - "[[Architecture Business Cycle]]"
  - "[[Architectural Guardrails]]"
  - "[[C4 Model]]"
  - "[[Modelo 4+1]]"
  - "[[Cono de incertidumbre]]"
  - "[[ATAM]]"
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Emergent vs Intentional Design]]"
  - "[[Persistencia]]"
  - "[[Replicación de BD]]"
  - "[[Estilos arquitectónicos (catálogo)]]"
  - "[[Sharding]]"
  - "[[Teorema CAP]]"
  - "[[Caso Healthcare.gov]]"
---

# ADR — Architecture Decision Record

## Idea

Un **Architecture Decision Record (ADR)** es un documento corto y versionado que **registra una decisión arquitectónica** junto a su contexto, las alternativas evaluadas, la opción elegida y sus consecuencias. Concepto popularizado por **Michael Nygard** en su post *"Documenting Architecture Decisions"* (2011), refinado luego por **Olaf Zimmermann** y la comunidad MADR (Markdown Architecture Decision Records).

Su valor central: **conservar el "porqué"**. Las arquitecturas se entienden a través de las decisiones que las moldearon, no del código que las materializa. Sin ADRs, el conocimiento del por qué evapora con la rotación del equipo, dejando código que parece arbitrario o cuestionable.

## Estructura canónica (Nygard 2011)

Un ADR de una página, en Markdown, dentro del propio repo:

1. **Title** — número + frase corta (ej. *"ADR-007: Adoptar PostgreSQL como motor primario"*).
2. **Status** — *Proposed / Accepted / Deprecated / Superseded by ADR-NNN*.
3. **Context** — qué fuerzas están en juego: requisitos, restricciones, consideraciones tecnológicas. La narrativa del problema.
4. **Decision** — qué se decidió. Frase clara, en presente. *"Vamos a hacer X."*
5. **Consequences** — qué pasa después: ventajas, costos, riesgos, qué se vuelve más difícil, qué se vuelve más fácil.

Variantes (MADR, Y-statements, Arc42) agregan secciones opcionales: *Considered Options*, *Pros and Cons of the Options*, *Links* (a tickets, ADRs relacionados).

## Por qué importa

- **Trazabilidad** — un nuevo desarrollador puede leer la cadena de ADRs y entender cómo el sistema llegó a su forma actual.
- **Argumentación, no autoridad** — cada decisión se sostiene por su contexto y consecuencias, no por *"así lo decidió el lead"*.
- **Detección de [[BDUF vs YAGNI vs JEDUF|JEDUF]] sano** — un equipo que escribe ADRs documenta sólo las decisiones *significativas* ([[Arquitectura de software — definición]]); el resto puede emerger ([[Emergent vs Intentional Design]]).
- **Auditabilidad** — para cumplimiento, due diligence técnica, post-mortems, los ADRs son la evidencia.
- **Punto de articulación con [[ATAM]]** — los sensitivity points y tradeoffs identificados en una evaluación ATAM se materializan típicamente como ADRs.

## Cuándo escribir un ADR

Heurística pragmática: **escribir un ADR cuando la decisión es difícil de revertir**. No para qué linter usar (reversible en 5 minutos); sí para:

- Elección de motor de [[Persistencia|persistencia]] o estilo de [[Replicación de BD|replicación]].
- Adopción de un [[Estilos arquitectónicos|estilo arquitectónico]] (microservicios vs monolito modular, event-driven vs request-response).
- Decisión de [[Sharding|shard key]] o esquema de partitioning.
- Posición del sistema en el [[Teorema CAP|trade-off CAP]] (CP vs AP).
- Adopción o abandono de un framework, runtime, lenguaje primario.
- Cambios estructurales en el [[Modelo 4+1|modelo de vistas]] del sistema.

## Relación con otros mecanismos

- **[[C4 Model]]**: los ADRs documentan *por qué* la arquitectura es como es; el C4 documenta *qué es*. Complementarios.
- **[[Architectural Guardrails]]**: los guardrails se justifican típicamente en ADRs ("ADR-012: Todos los servicios exponen `/health`").
- **[[Cono de incertidumbre]]**: las primeras decisiones de un proyecto son las más inciertas; los ADRs registran el contexto de la apuesta.
- **[[Caso Healthcare.gov]]**: una de las lecciones del reporte OEI es la falta de trazabilidad de decisiones — un sistema con ADRs habría documentado el riesgo del integrador único.

## Antipatrones

- **ADRs como burocracia** — documentar todo, incluido lo trivial. Mata el hábito.
- **ADRs sin status** — documento eterno sin marca de obsolescencia.
- **ADR vago** ("Usaremos microservicios cuando tenga sentido") — no es una decisión.
- **ADRs en wiki externa** — perder el versionado junto al código rompe la auditabilidad. Los ADRs viven dentro del repo.

## Pregunta a profundizar

¿Cómo se reconcilia la disciplina de ADRs con frameworks ágiles que prefieren documentación mínima? Hipótesis: los ADRs son la única documentación que **sí** vale la pena en un setup ágil porque registran el porqué, no el cómo.

## Lecturas complementarias

- Nygard, *Documenting Architecture Decisions* (2011) — el post original.
- Zimmermann et al., *Architectural Decision Modeling with Reuse* (artículos varios).
- MADR — *Markdown Any Decision Records* (https://adr.github.io/madr/).
- ThoughtWorks Technology Radar — *"Lightweight Architecture Decision Records"* (2016, *Adopt*).
- Documentación de **Arc42** — sección sobre *"Design Decisions"*.
