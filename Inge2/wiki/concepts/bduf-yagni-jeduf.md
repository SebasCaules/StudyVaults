---
title: BDUF vs YAGNI vs JEDUF
aliases:
  - "BDUF vs YAGNI vs JEDUF"
  - "BDUF"
  - "YAGNI"
  - "JEDUF"
  - "Big Design Up Front"
  - "Just Enough Design Up Front"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [proceso, diseño, bduf, yagni, jeduf, metodologia]
sources:
  - "raw/classes/Clase 4.pdf"
related:
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Emergent vs Intentional Design]]"
  - "[[Cono de incertidumbre]]"
  - "[[Architectural Guardrails]]"
  - "[[ATAM — Architecture Tradeoff Analysis Method]]"
  - "[[Lightweight ATAM]]"
  - "[[Árbol de utilidad]]"
---

# BDUF vs YAGNI vs JEDUF

## El eje en disputa

"¿Cuánto diseñamos antes de escribir código?" admite un espectro. Tres posturas canónicas balizan ese espectro (source: raw/classes/Clase 4.pdf).

## BDUF — Big Design Up Front

**Tesis:** diseñar todo antes de codear. Arrastre del waterfall clásico.

**A favor:**
- Coherencia global — una sola visión arquitectónica antes del primer commit.
- Facilita contratos con terceros (integraciones, outsourcing).
- Útil en dominios regulados (aeroespacial, médico crítico, nuclear).

**En contra:**
- Asume que el dominio se entiende completamente al inicio — contradice el [[Cono de incertidumbre]].
- Genera diseño "de papel" que rara vez sobrevive contacto con la realidad.
- Paradoja: se invierte más en diseño cuando menos se sabe; menos cuando ya se sabe.

## YAGNI — You Ain't Gonna Need It

**Tesis:** no diseñar para necesidades futuras. Surge de XP/Agile (Kent Beck, Ron Jeffries).

**A favor:**
- Elimina sobre-ingeniería especulativa.
- Mantiene el código simple, local.
- Cada decisión se justifica por una necesidad presente y verificable.

**En contra:**
- Llega **tarde** a decisiones irreversibles. Ejemplos: esquema de base de datos, API pública, modelo de seguridad, multi-tenancy.
- Malinterpretado como "no pensar" — YAGNI no es laissez-faire, es "no implementar sin necesidad", pero sí pensar.
- El costo de un pivote arquitectónico a los 6 meses suele exceder el costo de diseñar bien a los 0.

## JEDUF — Just Enough Design Up Front

**Tesis:** diseñar lo **suficiente** para que el equipo arranque con dirección y dejar lo demás para emerger.

Es la postura defendida por la cátedra (source: raw/classes/Clase 4.pdf).

**Regla práctica:**
- Anclar decisiones de **alto costo de cambio**: persistencia, contratos externos, modelo de seguridad, multi-tenancy.
- Aplazar decisiones de **bajo costo de cambio**: nombres internos, organización de packages, elección de libs utilitarias.

**Heurística "reversibilidad":** si la decisión es *one-way door* (Bezos), diseñar. Si es *two-way door*, iterar.

## Matriz de comparación

| Dimensión | BDUF | YAGNI | JEDUF |
|---|---|---|---|
| Diseño inicial | Exhaustivo | Mínimo o nulo | Sólo lo irreversible |
| Asume conocimiento del dominio | Alto | Bajo | Medio |
| Riesgo principal | Diseño obsoleto al entregar | Deuda arquitectónica tardía | Definir mal qué es "suficiente" |
| Encaja en | Dominios regulados, contratos fijos | Startups exploratorias, greenfield chico | Mayoría de proyectos empresariales |
| Evaluación recomendada | [[ATAM]] completo | Ninguna formal | [[Lightweight ATAM]] |

## Complemento: Architectural Guardrails

JEDUF no dice "qué" decidir — sólo "cuánto". Para *encauzar* lo no-diseñado-arriba sin caer en YAGNI puro, se usan [[Architectural Guardrails]]: reglas de plataforma que acotan el espacio de decisiones a nivel equipo.

## Anti-patrones de cada postura

- **BDUF patológico:** Analysis Paralysis, Architecture Astronauts (Joel Spolsky).
- **YAGNI patológico:** Big Ball of Mud (Foote, Yoder), deuda técnica terminal.
- **JEDUF patológico:** criterio de "suficiente" dejado a una sola persona sin consenso — se convierte en BDUF encubierto o YAGNI encubierto según temperamento del arquitecto.

## Pregunta a profundizar

¿Cómo calibrar qué es "just enough"? Posibles heurísticas: costo de revertir × probabilidad de tener que revertir; consenso del equipo en un spike de 1-2 días; hasta que el [[Árbol de utilidad]] de los drivers top-3 esté cubierto.

## Fuentes y lecturas

- Beck, *Extreme Programming Explained*.
- Fowler, *Is Design Dead?* (2004).
- Bass, Clements, Kazman — *Software Architecture in Practice*, sección sobre proceso.
- Bezos, 1997 shareholder letter — one-way vs two-way doors.
