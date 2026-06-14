---
title: Katas de Arquitectura
type: concept
aliases:
  - "Katas de Arquitectura"
  - "Architecture Kata"
  - "Kata de arquitectura"
created: 2026-05-06
updated: 2026-05-06
tags: [katas, pedagogia, practica, ejercicio, arquitectura, neal-ford]
sources: []
related:
  - "[[Clase 0 — Introducción al curso]]"
  - "[[ATAM]]"
  - "[[Lightweight ATAM]]"
  - "[[Árbol de utilidad]]"
  - "[[Caso Healthcare.gov]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Enunciados de parciales — 6 casos]]"
  - "[[Cross Challenge — 3 casos]]"
  - "[[TP general — Sistema Admin Cuentas + satélites]]"
  - "[[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Clase 6 — Big Data en tiempo real (Twitter)]]"
  - "[[ADR — Architecture Decision Record]]"
---

# Katas de Arquitectura

## Idea

Una **kata de arquitectura** es un **ejercicio de práctica deliberada** sobre un escenario de diseño: dado un dominio, restricciones y stakeholders ficticios, el alumno (o equipo) **propone una arquitectura** justificada con criterios y trade-offs explícitos. El término viene del karate (*kata* = forma de entrenamiento repetida) y fue trasladado al diseño de software por **Dave Thomas** y popularizado en arquitectura por **Ted Neward** y **Neal Ford**.

A diferencia de un parcial, una kata no busca una respuesta correcta única: busca **el músculo de decidir bajo incertidumbre con justificación**.

## Estructura típica

1. **Enunciado** — un dominio realista, breve. Ej: *"Sistema de venta de entradas para conciertos masivos. Picos de demanda al abrir venta. Operación en LATAM."*
2. **Restricciones** — presupuesto, equipo, plazos, tecnologías permitidas o vetadas, regulaciones.
3. **Stakeholders** — quiénes piden, quiénes pagan, quiénes operan, quiénes auditan.
4. **Atributos de calidad esperados** — disponibilidad, latencia, consistencia, etc.
5. **Tarea** — proponer arquitectura: vistas, decisiones, [[Árbol de utilidad|árbol de utilidad]], riesgos.
6. **Defensa** — el alumno presenta y otros cuestionan: *"¿por qué no microservicios?"*, *"¿cómo escala el componente X?"*.

La defensa es **la mitad del valor**: forzar a articular los **porqués** transforma la kata en aprendizaje real.

## Por qué la cátedra Inge2 las usa

(source: [[Clase 0 — Introducción al curso]] — *"Katas de Arquitectura como vehículo pedagógico"*).

Tres razones:

1. **El curso enseña decisiones, no recetas.** No hay un set memorizable de respuestas correctas; la habilidad es elegir entre alternativas dado un contexto. Las katas obligan a este músculo.
2. **El parcial pide casos de aplicación.** Los [[Enunciados de parciales — 6 casos]] y el [[Cross challenge — 3 casos]] son katas con formato de evaluación. Quien practicó katas a lo largo del cuatrimestre llega entrenado.
3. **El [[TP general]] es una kata extendida** — un enunciado complejo, defensa frente a docentes, criterios explícitos.

## Casos de la cátedra que funcionan como katas

- [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]] — kata clásica con sensores, eventos, latencia.
- [[Enunciados de parciales — 6 casos]] — banco de seis dominios.
- [[Cross challenge — 3 casos]] — tres casos diseñados para que distintos equipos lleguen a soluciones divergentes y las contrasten.
- [[Caso Healthcare.gov]] — kata **post-mortem**: dado que sabemos cómo terminó, ¿qué *deberíamos* haber decidido en 2012? Ver el desarrollo en [[Clase 4 — ¿Cuándo diseñamos?]].
- [[Caso Twitter — Big Data en tiempo real]] — kata real (no ficticia): cómo Twitter se enfrentó a 4 sub-problemas distintos. La discusión en [[Clase 6 — Big Data en tiempo real (Twitter)]] funciona como kata sobre cada sub-sistema.

## Cómo abordar una kata bien

Receta práctica:

1. **No saltar a la solución.** Antes de proponer arquitectura, **construir el contexto**: stakeholders, restricciones, atributos críticos, riesgos. La cátedra penaliza la solución sin contexto.
2. **Listar alternativas.** Casi nunca hay una sola respuesta. Tres opciones con sus trade-offs es siempre más sólido que una opción "obvia". Aplicar [[BDUF vs YAGNI vs JEDUF]] como lente.
3. **Construir un [[Árbol de utilidad]].** Atributos de calidad → escenarios → priorización (importancia, dificultad). Aterriza la discusión en lo concreto.
4. **Identificar sensitivity y tradeoff points** ([[ATAM]]/[[Lightweight ATAM]]). ¿Qué decisiones son críticas? ¿Qué se negocia contra qué?
5. **Escribir como ADR.** El registro de la decisión vale tanto como la decisión misma — ver [[ADR — Architecture Decision Record]].
6. **Defender, no atacar.** En la discusión grupal, la kata no busca ganadores; busca exponer trade-offs ocultos.

## Recursos externos

- **Architectural Katas** sitio mantenido por **Neal Ford** y comunidad — banco de katas open source.
- O'Reilly *Software Architecture: The Hard Parts* (Ford & Richards) — usa katas como dispositivo de capítulos.
- *DesigningHub* y meetups de arquitectos suelen correr "Architecture Kata Night".

## Pregunta a profundizar

¿En qué punto una kata deja de ser práctica deliberada y pasa a ser teatro? Hipótesis: cuando la defensa se vuelve performance social en vez de exposición real de incertidumbre. Mitigación: forzar a cada participante a **listar lo que no sabe** además de lo que decidió.

## Lecturas complementarias

- Ford, *Architectural Katas* (https://nealford.com/katas/) — banco abierto.
- Thomas & Hunt, *The Pragmatic Programmer* — origen del concepto de kata en software.
- Bass, Clements, Kazman, *Software Architecture in Practice* — usa katas implícitas en sus capítulos sobre design.
- Skelton & Pais, *Team Topologies* — katas para diseñar **topologías** de equipos, no sólo de software.
