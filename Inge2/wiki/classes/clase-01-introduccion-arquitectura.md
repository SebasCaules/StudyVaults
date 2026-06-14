---
title: Clase 1 — Introducción a Arquitectura
aliases:
  - "Clase 1 — Introducción a Arquitectura"
  - "Clase 1"
type: class
created: 2026-04-22
updated: 2026-05-12
tags: [arquitectura, abc, atributos-de-calidad, cono-incertidumbre, iso-25000]
sources:
  - "raw/classes/2026-03-12 - Clase 1/Clase 1.pdf"
  - "raw/classes/2026-03-12 - Clase 1/clase1.pdf"
related:
  - "[[Clase 0 — Introducción al curso]]"
  - "[[Clase 2 — Construcción de la arquitectura]]"
  - "[[Architecture Business Cycle (ABC)]]"
  - "[[Cono de incertidumbre]]"
  - "[[Atributos de calidad]]"
  - "[[Arquitectura de software — definición]]"
  - "[[SLA, SLO, SLI]]"
  - "[[MTBF y MTTR]]"
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[ATAM — Architecture Tradeoff Analysis Method]]"
---

# Clase 1 — Introducción a Arquitectura

## TL;DR

Arquitectura **no es código**: es el conjunto de decisiones significativas que moldean un sistema — significativas en el sentido de que **cambiarlas tarde duele mucho**. La clase establece el vocabulario base: definición, roles de arquitecto, el [[Architecture Business Cycle]], el [[Cono de incertidumbre]] y los [[Atributos de calidad]] (ISO 25000) como moneda de cambio para comparar decisiones.

## Mapa conceptual

- [[Arquitectura de software — definición]] — Kruchten, Booch, Bittner/Reitman: "decisiones significativas".
- Roles de arquitecto: enterprise / solution / application / technical / data (source: raw/classes/Clase 1.pdf).
- [[Architecture Business Cycle]] (ABC) — Bass, Clements, Kazman: el sistema y su contexto se influyen mutuamente.
- [[Cono de incertidumbre]] — margen de error 4x→0.25x según madurez del proyecto.
- [[Atributos de calidad]] — ISO 25000 / 25010. Clasificación en run-time, design, system, user.
- Cuantificación y medición: [[SLA, SLO, SLI]], [[MTBF y MTTR]].

## Desarrollo

### ¿Qué es arquitectura?

Varias definiciones convergentes (source: raw/classes/Clase 1.pdf):

- **Kruchten:** "las decisiones significativas sobre la organización del sistema de software".
- **Booch, Rumbaugh, Jacobson:** "la estructura o estructuras significativas del sistema".
- **Bittner / Reitman:** "set of significant decisions about the organization of a software system".

El adjetivo clave es **significativas**: son aquellas cuya modificación posterior tiene costo alto — cambiar de monolito a microservicios, de REST a eventos, de SQL a NoSQL. Por oposición, elegir un `List` vs un `Set` en una clase interna no es arquitectura.

### Architecture Business Cycle (ABC)

Bass et al. proponen que la arquitectura no emerge sólo de requisitos técnicos (source: raw/classes/Clase 1.pdf):

```
Stakeholders ─┐
Dev Org ─────┼─→ Architect → Architecture → System
Tech Env ────┤                                 │
Architect's  ├─────────feedback loop───────────┘
Experience ──┘
```

El sistema, una vez construido, **retroalimenta** su propio contexto: modifica la organización, el stack tecnológico, a los stakeholders, e incluso forma al arquitecto. Esto tiene dos implicancias prácticas:

1. La arquitectura óptima no existe en abstracto — depende de fuerzas concretas (no sólo funcionales).
2. Una decisión puede ser correcta hoy y obsoleta mañana porque el contexto se mueve.

**Las fuerzas del ABC con detalle** (source: raw/classes/2026-03-12 - Clase 1/clase1.pdf):

- **Stakeholders:** tienen expectativas y restricciones diversas, a menudo contradictorias. El arquitecto debe detectarlas todas y buscar el **mejor compromiso posible** — no "la solución que les guste a todos", que no existe.
- **Negocio inmediato vs negocio a largo plazo:** el inmediato pide *atacar necesidades actuales y aprovechar inversiones en sistemas existentes*; el largo plazo pide *invertir en infraestructura futura y ser enabler de negocios que aún no existen*. Es la tensión central del ciclo.
- **Estructura organizacional:** qué herramientas tenemos hoy, qué tecnologías maneja el equipo. La arquitectura "ideal" en abstracto que el equipo no sabe construir es peor que la "no-ideal" que sí.
- **Existencia del propio arquitecto:** sesgada, universo acotado de experiencias. La maestría está en hacer el *meets-and-match* adecuado entre las herramientas conocidas y el problema.
- **Ambiente tecnológico:** lo "recomendado hoy" cambia constantemente y va por modas; apalancarse en lo conocido **reduce el riesgo**. Ejemplo paradigmático de la cátedra: **Nintendo** rara vez usa tecnología de última generación — usa tech madura porque conoce todas las ventajas, desventajas y costos. Resultado: implementación predecible y mucho más barata.

### La paradoja del ciclo

Cuando se cierra el ciclo, el corto y el largo plazo dan instrucciones opuestas: *el corto te dice "no innoves"* (riesgo, costo); *el largo te dice "si no innovás, en N años esto se vuelve un problema"*. La salida pragmática que propone la cátedra: **innovación incremental controlada** — introducir tecnología nueva en *features no críticas* hasta acumular la confianza necesaria para llevarla a features mayores (source: raw/classes/2026-03-12 - Clase 1/clase1.pdf). Es la versión arquitectónica del *strangler fig* (Fowler).

### Cono de incertidumbre

Al inicio del proyecto, cualquier estimación tiene un error multiplicativo de **4x a 0.25x** — es decir, lo que estimás en 1 mes puede tomar entre 1 semana y 4 meses. Conforme se aprende, el cono se cierra hasta un margen de ±10%. La conclusión docente: las decisiones arquitectónicas **grandes** se toman cuando más incertidumbre hay, por lo que conviene **aplazar** las irreversibles y favorecer opciones reversibles (ver [[BDUF vs YAGNI vs JEDUF]]).

También introduce la taxonomía de **supuestos**: posibles, probables, documentados. Todo diseño tiene supuestos; la higiene es documentarlos y marcar cuáles se validaron.

### Atributos de calidad

IEEE: *"a feature or characteristic that affects an item's quality"*. ISO 25000 / 25010 los agrupa en categorías (source: raw/assets/Atributos de Calidad.pdf):

- **Run-time:** Availability, Fault Tolerance, Interoperability, Manageability, Customizability, Performance, Precision, Reliability, Scalability, Auditability, Security.
- **Design:** Conceptual Integrity, Maintainability, Portability, Reusability.
- **System:** Supportability, Testability.
- **User:** Accessibility, Usability.

El mensaje central: **los atributos de calidad son el idioma para comparar arquitecturas**. Decir "esta arq es mejor" sin un atributo que cuantifique la mejora es no decir nada.

### Cuantificación

Cada atributo debe cuantificarse o se vuelve inútil:

- Availability → % uptime, [[SLA, SLO, SLI]].
- Reliability → [[MTBF y MTTR]].
- Performance → percentiles de latencia (p95, p99).
- Scalability → throughput, usuarios concurrentes.

## Decisiones clave discutidas

| Decisión | Opciones | Criterio | Recomendación cátedra |
|---|---|---|---|
| Cuándo tomar decisiones grandes | Upfront / deferida | Madurez del dominio, reversibilidad | **Aplazar reversibles, anclar irreversibles** (ver [[BDUF vs YAGNI vs JEDUF]]). |
| Cómo comparar arquitecturas | Opinión experta / atributos cuantificados | Objetividad y trazabilidad | **Atributos cuantificados** con escenarios (ver [[ATAM]]). |

## Preguntas para el parcial

1. Definir arquitectura de software y justificar por qué una decisión sobre tipo de base de datos es arquitectónica y una sobre estructura de datos interna no lo es.
2. Dibujar el Architecture Business Cycle y explicar la flecha de retroalimentación.
3. ¿Qué implica el cono de incertidumbre para la práctica de BDUF (Big Design Up Front)?
4. Listar 3 atributos run-time y 2 design, con la métrica cuantificable de cada uno.
5. Diferencia entre SLA, SLO y SLI.

## Lecturas complementarias

- Bass, Clements, Kazman — *Software Architecture in Practice* (base conceptual).
- ISO/IEC 25010:2011 — estándar de calidad.
- McConnell, *Software Estimation* — desarrollo del cono de incertidumbre.
