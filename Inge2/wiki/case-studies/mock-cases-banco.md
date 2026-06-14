---
title: "Banco de casos mock de parcial"
aliases:
  - "Generador de casos mock de parcial"
  - "Banco mock"
  - "Casos mock"
type: case-study
created: 2026-05-13
updated: 2026-05-13
tags: [case-study, mock, parcial, banco, generador, indice]
sources:
  - "study/js/data/mock-cases.js"
  - "study/js/tools/case-simulator.js"
related:
  - "[[Caso Healthcare.gov]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Enunciados de parciales — 6 casos]]"
  - "[[Cross challenge — 3 casos]]"
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Árbol de utilidad]]"
---

# Banco de casos mock de parcial

## Rol

Banco curado de **casos sintéticos** con la misma estructura y nivel de detalle que los casos canónicos de la cátedra ([[Caso Healthcare.gov|Healthcare.gov]], [[Caso Twitter — Big Data en tiempo real|Twitter]], [[Caso Compraventa de Acciones|Compraventa]]). Su rol es alimentar el **Generador de casos mock de parcial** en la página de estudio (`study/js/tools/case-simulator.js`) para que los sorteos de práctica deliberada tengan un enunciado **largo, contextualizado y exam-grade**, en vez de una combinación seca dominio × variación.

> ⚠️ **Son casos sintéticos**, no históricos. Construidos sobre patrones reconocibles de la industria. No citar como hechos de empresas específicas.

## Por qué un banco mock

Los tres casos reales de la cátedra son insuficientes para práctica deliberada — un alumno que los lee 3 veces empieza a memorizar respuestas, no a internalizar el método ADD. Banco mock:

1. **Diversifica dominios** (salud, finanzas, gov, IoT, streaming, logística) sin agotar el banco oficial.
2. **Mantiene rigor** — mismo formato (dominio, contexto largo, stakeholders, drivers, decisiones, lecciones, trampas), mismo nivel de complejidad.
3. **Es predecible para el alumno** — sabe qué estructura encontrar y dónde poner el foco.
4. **Permite cross-reference** con los reales — cada caso mock linkea al caso canónico que más se le parece y al concept que ejercita.

## Los 6 casos del banco

| Caso | Dominio | Driver dominante | Ejercita | Hermana del caso real |
|---|---|---|---|---|
| [[Caso mock — Plataforma de telemedicina interregional]] | Salud / video / HCE | Privacy + Interop + Availability | Bounded contexts, FHIR, plano control vs plano datos | [[Caso Compraventa de Acciones]] (naturaleza de los datos manda) |
| [[Caso mock — Sistema nacional de voto electrónico]] | Gov / adversarial | Verifiability + Security + Anonymity | E2E-V crypto, air-gap, defense in depth | [[Caso Compraventa de Acciones]] (Security #1) |
| [[Caso mock — Plataforma de streaming de video on-demand]] | OTT / consumer | Scalability + Performance + Cost | CDN multi-vendor, ABR, off-line precompute | [[Caso Twitter — Big Data en tiempo real]] (Kallen) |
| [[Caso mock — Plataforma de monitoreo de smart city]] | IoT / gov | Ingest + CEP + Privacy | Event-driven, polyglot persistence, edge analytics | [[Caso Twitter — Big Data en tiempo real]] (variation de Kallen) |
| [[Caso mock — Plataforma de subastas en tiempo real]] | Marketplace / financial | Consistency + Performance + Auditability | Order book in-memory, CP CAP, event sourcing | [[Caso Compraventa de Acciones]] (hermana cercana) |
| [[Caso mock — Logística de última milla a escala]] | Marketplace / gig | Modifiability + Scalability + Cost | Bounded contexts, OLTP/OLAP, microservicios sí/no | (sin hermana directa — pregunta de scaleup) |

## Cómo se sortea

El [[Generador de casos mock de parcial|generador]] (`study/js/tools/case-simulator.js`) elige uno al azar al abrir la página o al hacer clic en "Sortear otro caso". El estado (caso actual + respuestas por inciso) se guarda en localStorage:

- `case-sim-current-id` → id del caso sorteado
- `case-sim-answers-<id>` → respuestas serializadas por caso

Las respuestas son persistentes **por caso**: si volvés al mismo caso, recuperás lo que escribiste.

## Estructura común

Cada caso mock sigue exactamente la misma forma que los reales en `study/js/data/cases.js`:

```js
{
  id, title, domain, context,
  stakeholders: [],
  quality_drivers: [],
  architectural_decisions: [{ decision, rationale }],
  lessons_learned: [],
  traps: [],
  related_concepts: []
}
```

En el wiki cada caso tiene su propia página `wiki/case-studies/mock-*.md` con la misma información en formato Markdown navegable.

## Recomendación de uso

1. **Primero** leer los 3 casos canónicos hasta poder responder los 6 incisos sin mirar.
2. **Después** usar el generador mock para practicar 3-5 veces, sin mirar la "guía de resolución" del caso (es la sección colapsada al final).
3. **Comparar** tu respuesta con la guía. Donde no coincidan, justificar (no copiar).
4. **Cross-link**: cuando un caso mock te sorprenda, leé su "hermano" canónico de nuevo — probablemente se conecta con un patrón que ya vimos en clase.

## Pregunta a profundizar

¿Qué porcentaje de los incisos de un parcial es respuesta de patrón (memorizable) y qué porcentaje es respuesta de criterio (decisión informada por contexto)? La práctica deliberada con el banco mock apunta a fortalecer el segundo.
