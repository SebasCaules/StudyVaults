---
title: Architecture Business Cycle (ABC)
aliases:
  - "Architecture Business Cycle (ABC)"
  - "Architecture Business Cycle"
  - "ABC"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [arquitectura, abc, bass-clements-kazman, contexto]
sources:
  - "raw/classes/Clase 1.pdf"
related:
  - "[[Arquitectura de software — definición]]"
  - "[[Atributos de calidad]]"
  - "[[Clase 1 — Introducción a Arquitectura]]"
  - "[[ADR — Architecture Decision Record]]"
---

# Architecture Business Cycle (ABC)

## La idea central

Bass, Clements y Kazman (*Software Architecture in Practice*) formulan la arquitectura **no como producto técnico aislado, sino como el centro de un ciclo**: fuerzas del entorno determinan la arquitectura, y la arquitectura resultante modifica el entorno (source: raw/classes/Clase 1.pdf).

## El ciclo

```
  Stakeholders ─────┐
  Dev Organization ─┼──→ Architect ──→ Architecture ──→ System
  Tech Environment ─┤                                      │
  Architect's Exp. ─┘                                      │
           │                                               │
           └──────────── feedback loop ────────────────────┘
```

### Inputs (fuerzas que moldean la arquitectura)

1. **Stakeholders:** usuarios, negocio, operaciones, seguridad, compliance — cada uno con atributos de calidad que presiona.
2. **Development Organization:** tamaño del equipo, skills disponibles, estructura (Conway's Law), metodología.
3. **Technical Environment:** estado del arte, estándares de industria, tecnologías legacy que hay que integrar.
4. **Architect's Experience:** sesgos, patrones internalizados, herramientas que sabe usar bien.

### El rol del arquitecto

Sintetiza estas fuerzas en un **sistema de decisiones coherente**. No es "elegir la mejor tecnología" — es balancear presiones incompatibles y explicitar los trade-offs.

### Feedback loop

El sistema, una vez vive:
- **Cambia el stack tecnológico interno** — introduce nuevas herramientas, marca estándares.
- **Cambia la organización** — equipos se re-estructuran para alinearse con la arquitectura (inverse Conway's Law).
- **Cambia a los stakeholders** — usuarios desarrollan nuevas expectativas, negocio descubre nuevos casos de uso.
- **Forma al arquitecto** — cada sistema vivido moldea el juicio para el próximo.

## Implicancias prácticas

1. **La arquitectura óptima no existe en abstracto.** Mismas requerimientos funcionales → arquitecturas distintas según org, stack, stakeholders. Las respuestas de parcial tipo "la arquitectura para X es Y" suelen ser incompletas.
2. **Una decisión correcta hoy puede ser obsoleta mañana** porque el contexto se mueve. La arquitectura tiene **esperanza de vida**.
3. **Documentar drivers, no sólo estructura** — si no queda registro de qué presiones originaron cada decisión, el equipo futuro no sabrá cuándo esa decisión deja de aplicar (ver [[ADR — Architecture Decision Record]]).

## Crítica / puntos de fricción

- El diagrama es didáctico pero **simplifica**: en la práctica hay feedback loops más cortos dentro del desarrollo (la primera release modifica el entorno antes de que el sistema esté "terminado").
- No hace explícito el **factor tiempo**: el contexto del año 0 es distinto del año 5.
- Asume un arquitecto único; en organizaciones grandes hay **arquitectura emergente de múltiples arquitectos**.

## Pregunta a profundizar

¿Cómo se relaciona el ABC con Conway's Law? ¿Qué dirección de causalidad domina — la org moldea la arquitectura o viceversa?

## Fuentes y lecturas

- Bass, Clements, Kazman — *Software Architecture in Practice*, cap. 2.
- Conway (1968), "How Do Committees Invent?".
- Skelton, Pais — *Team Topologies* (aplicación moderna de Conway).
