---
title: SAAM — Software Architecture Analysis Method
aliases:
  - "SAAM — Software Architecture Analysis Method"
  - "SAAM"
  - "Software Architecture Analysis Method"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [evaluacion, saam, sei, escenarios]
sources:
  - "raw/classes/Clase 4.pdf"
related:
  - "[[ATAM]]"
  - "[[Lightweight ATAM]]"
  - "[[Árbol de utilidad]]"
  - "[[Atributos de calidad]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
---

# SAAM — Software Architecture Analysis Method

## ¿Qué es?

Primer método formal de **evaluación** de arquitecturas basado en escenarios. Publicado por **Kazman, Bass, Abowd, Webb** en 1993 (ICSE). Ancestro directo de [[ATAM]] (source: raw/classes/Clase 4.pdf).

SAAM responde: *"¿esta arquitectura propuesta satisface los escenarios que nos importan, y qué tan costoso sería extenderla cuando aparezcan otros?"*.

## Pasos

1. **Caracterizar una forma canónica** para describir la arquitectura (diagrama consensuado).
2. **Desarrollar escenarios** — casos concretos de uso y de cambio (qué cambiaría si...).
3. **Clasificar escenarios** en:
   - **Directos** — la arquitectura los soporta as-is, sin modificaciones.
   - **Indirectos** — requieren cambios en la arquitectura.
4. **Evaluar escenarios individualmente** — para los indirectos, estimar el costo de cambio.
5. **Detectar interacciones** — escenarios que comparten componentes revelan *hot spots* donde múltiples cambios colapsarían.
6. **Sintetizar una evaluación** — áreas de riesgo, trade-offs observados.

## Escenarios en SAAM

Dos tipos:

- **Uso (use scenario):** "el usuario hace X, el sistema responde Y".
- **Cambio (change scenario):** "si mañana hay que soportar Z, ¿qué se modifica?".

Los escenarios de cambio son los más informativos — miden **mantenibilidad y evolución**, no sólo el estado actual.

## Output típico

- Matriz escenario × componente marcada con "afectado / no afectado".
- Identificación de componentes "hot" (afectados por muchos cambios — candidatos a refactor).
- Categorización de escenarios por costo estimado.

## Comparación con [[ATAM]]

| Dimensión | SAAM (1993) | ATAM (2000) |
|---|---|---|
| Foco | Usabilidad y modificabilidad (principalmente) | Todos los atributos de calidad |
| Estructura | Single-round, liviano | 4 fases, 9 pasos |
| Costo | Días | 20-30 person-days |
| Output | Matriz escenarios × componentes | Utility tree, sensitivity, tradeoffs, risks |
| Stakeholders | Equipo técnico | Amplio (negocio + técnico) |
| Estado | Precursor histórico | Gold standard |

SAAM sigue vigente para **evaluaciones rápidas** centradas en modificabilidad, especialmente cuando no se justifica un ATAM completo.

## Cuándo usar SAAM

- **Primera evaluación** de una arquitectura joven.
- **Comparar alternativas** en una decisión de trade-off (arq A vs arq B).
- **Chequeo pre-ATAM** — si la arquitectura no pasa SAAM, no vale la pena un ATAM completo.
- **Workshops internos** de un equipo que necesita "auto-evaluarse" sin proceso externo.

## Crítica

- **Sesgo hacia modificabilidad** — otros atributos (performance, security) se tratan de forma menos sistemática.
- **Dependiente de la calidad de los escenarios** — garbage in, garbage out.
- **No captura trade-offs** entre atributos explícitamente como lo hace ATAM.

## Pregunta a profundizar

¿SAAM sigue teniendo lugar en un ecosistema moderno donde las evaluaciones son continuas (fitness functions, architectural testing) y no eventos puntuales?

## Fuentes y lecturas

- Kazman, Bass, Abowd, Webb — *SAAM: A Method for Analyzing the Properties of Software Architectures* (ICSE 1994).
- Clements, Kazman, Klein — *Evaluating Software Architectures: Methods and Case Studies* (2001).
- Bass, Clements, Kazman — *Software Architecture in Practice*.
