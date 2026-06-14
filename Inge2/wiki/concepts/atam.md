---
title: ATAM — Architecture Tradeoff Analysis Method
aliases:
  - "ATAM — Architecture Tradeoff Analysis Method"
  - "ATAM"
  - "Architecture Tradeoff Analysis Method"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [evaluacion, atam, sei, carnegie-mellon, metodo]
sources:
  - "raw/classes/Clase 4.pdf"
  - "raw/classes/Clase V - Caso Healthcare.gov.pdf"
related:
  - "[[SAAM]]"
  - "[[Lightweight ATAM]]"
  - "[[Árbol de utilidad]]"
  - "[[Atributos de calidad]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Caso Healthcare.gov]]"
  - "[[ADR — Architecture Decision Record]]"
---

# ATAM — Architecture Tradeoff Analysis Method

## ¿Qué es?

Método formal para **evaluar** una arquitectura frente a sus atributos de calidad, desarrollado por Kazman, Klein y Clements en el SEI (Software Engineering Institute, Carnegie Mellon) en 2000. Es el **gold standard** del área (source: raw/classes/Clase 4.pdf).

No produce arquitectura — la evalúa. Identifica dónde la arquitectura propuesta satisface o no los atributos deseados, y hace explícitos los trade-offs.

## Outputs que produce

1. **[[Árbol de utilidad]]** con escenarios priorizados.
2. **Sensitivity points** — decisiones arquitectónicas de las que depende fuertemente un atributo de calidad.
3. **Tradeoff points** — decisiones que afectan múltiples atributos, mejorando uno y empeorando otro.
4. **Risks / Non-risks** — cuestiones abiertas y áreas cubiertas.
5. **Risk themes** — patrones transversales de riesgo que apuntan a problemas sistémicos.

## Las 4 fases (9 pasos)

### Fase 0 — Partnership & Preparation

- Alinear con stakeholders.
- Formar el equipo evaluador (3-5 personas externas al proyecto).
- Confirmar scope, fechas, logística.

### Fase 1 — Evaluation (Round 1, sólo arquitectos y evaluadores)

**Paso 1. Presentación del método ATAM.**
**Paso 2. Presentación de los business drivers** por un representante de negocio.
**Paso 3. Presentación de la arquitectura** por el arquitecto.
**Paso 4. Identificar approaches arquitectónicos** (estilos/patrones usados).
**Paso 5. Generar árbol de utilidad** con atributos, escenarios y pesos (importancia, dificultad).
**Paso 6. Analizar approaches arquitectónicos** contra los escenarios top del árbol.

### Fase 2 — Evaluation (Round 2, con stakeholders ampliados)

**Paso 7. Brainstorming y priorización de escenarios** con stakeholders amplios (usuarios, operaciones, seguridad).
**Paso 8. Re-analizar approaches** con los nuevos escenarios priorizados.
**Paso 9. Presentar resultados** — risks, sensitivity points, tradeoffs, themes.

### Fase 3 — Follow-up

- Reporte formal final.
- Plan de mitigación de riesgos.
- Lecciones aprendidas para la organización.

## Costo típico

**20-30 person-days** distribuidos a lo largo de ~4-6 semanas de calendario. Involucra:
- Arquitectos del sistema.
- Equipo evaluador externo (3-5 expertos).
- Representantes de stakeholders (10-20 personas en el Round 2).

Por eso ATAM completo se reserva para decisiones arquitectónicas de **alto impacto e irreversibles** (source: raw/classes/Clase 4.pdf).

## Sensitivity vs Tradeoff — ejemplo

- **Sensitivity point:** el uso de un broker central es sensible a la *performance* — si el broker satura, el atributo cae en picada.
- **Tradeoff point:** replicar el broker mejora *availability* pero empeora *consistency* (eventual consistency). Misma decisión toca dos atributos en direcciones opuestas.

Detectar estos puntos es el valor principal de ATAM.

## Cuándo usar ATAM completo vs Lightweight

| Contexto | Método |
|---|---|
| Sistema crítico, arquitectura nueva, alto costo de cambio | ATAM completo |
| Iteración incremental, equipo pequeño, tiempo limitado | [[Lightweight ATAM]] |
| Primer checkpoint arquitectónico, sin stakeholders amplios | [[SAAM]] |

## Aplicación al [[Caso Healthcare.gov]]

La Clase V de la cátedra usa Healthcare.gov como kata de ATAM (source: raw/classes/Clase V - Caso Healthcare.gov.pdf):
- **Fase 0/1 simulada** — dado el reporte OEI post-mortem, reconstruir el árbol de utilidad que CMS *debería* haber construido en 2012-2013.
- Identificar: qué atributos de calidad fueron sub-priorizados, qué sensitivity points se ignoraron, qué tradeoffs quedaron implícitos.

## Crítica

- **Pesado** — 20-30 person-days es inviable para la mayoría de equipos.
- **Depende de la calidad de los escenarios** — escenarios vagos producen análisis vago (garbage in, garbage out).
- **Momento único** — ATAM es una foto, no un monitoreo continuo. La arquitectura evoluciona.

## Pregunta a profundizar

¿Cómo integrar los outputs de un ATAM con un proceso de [[ADR — Architecture Decision Record]] continuo, para que el análisis no se congele en un reporte estático?

## Fuentes y lecturas

- Kazman, Klein, Clements — *ATAM: Method for Architecture Evaluation* (SEI/CMU TR-2000-004).
- Bass, Clements, Kazman — *Software Architecture in Practice*, cap. sobre evaluación.
- Clements, Kazman, Klein — *Evaluating Software Architectures: Methods and Case Studies* (2001).
