---
title: "Atributos de Calidad — tabla ISO 25000 (cátedra)"
aliases:
  - "Atributos de Calidad — tabla ISO 25000 (cátedra)"
  - "ISO 25000 — tabla cátedra"
  - "Atributos de Calidad — handout"
type: source
created: 2026-04-22
updated: 2026-04-22
tags: [source, iso-25000, iso-25010, atributos-de-calidad, catedra]
sources:
  - "raw/assets/Atributos de Calidad.pdf"
related:
  - "[[Atributos de calidad]]"
  - "[[Clase 1 — Introducción a Arquitectura]]"
  - "[[ATAM]]"
  - "[[Árbol de utilidad]]"
  - "[[Attribute Driven Design (ADD)]]"
  - "[[SLA, SLO, SLI]]"
  - "[[MTBF y MTTR]]"
---

# Atributos de Calidad — tabla ISO 25000 (cátedra)

## Identificación

- **Artefacto:** asset/handout de la cátedra.
- **Archivo fuente:** `raw/assets/Atributos de Calidad.pdf`.
- **Longitud:** 1 página (tabla consolidada).
- **Rol:** tabla de referencia que la cátedra usa a lo largo del curso para hablar de **atributos de calidad ISO 25000 / 25010**.

## Qué contiene

La tabla organiza los atributos de calidad en **cuatro grupos** según observabilidad y propósito (source: raw/assets/Atributos de Calidad.pdf):

1. **Run-time qualities** — observables cuando el sistema ejecuta.
2. **Design qualities** — visibles en la estructura del sistema, no en ejecución.
3. **System qualities** — atributos del sistema como producto.
4. **User qualities** — centradas en la experiencia del usuario.

Para cada atributo da una **definición operativa corta**, útil como input a [[Attribute Driven Design]] y [[ATAM]].

## Reproducción de la tabla

### Run-time qualities

- **Availability** — Proporción del tiempo en que el sistema está operativo y disponible.
- **Fault Tolerance** — Capacidad de seguir operando ante fallas de componentes (posiblemente en modo degradado).
- **Interoperability** — Capacidad de interactuar con sistemas externos intercambiando información.
- **Manageability** — Facilidad para que administradores operen la aplicación (monitoring, debugging, instrumentación).
- **Customizability** — Posibilidad del usuario de personalizar apariencia o comportamiento del sistema.
- **Performance** — Responsividad: realizar acciones dentro de un intervalo temporal dado.
- **Precision** — Nivel de exactitud numérica del sistema.
- **Reliability** — Capacidad de mantenerse operativo en el tiempo sin fallar.
- **Scalability** — Capacidad de manejar incrementos de carga sin impacto significativo en performance.
- **Auditability** — Posibilidad de auditar registros y actividades para validar integridad y seguridad.
- **Security** — Prevención de acciones maliciosas o accidentales fuera del uso diseñado, evitando pérdida/divulgación de información.

### Design qualities

- **Conceptual Integrity** — Consistencia y coherencia del diseño global.
- **Maintainability** — Facilidad para modificar el sistema.
- **Portability** — Capacidad de correr en distintos entornos.
- **Reusability** — Componentes aptos para ser reutilizados en otros contextos.

### System qualities

- **Supportability** — Proveer información útil para diagnosticar problemas.
- **Testability** — Facilidad para crear criterios de test y ejecutarlos.

### User qualities

- **Accessibility** — Que el sistema sea usable por la mayor cantidad posible de personas (a11y).
- **Usability** — Qué tan bien el sistema cumple las necesidades del usuario — intuitividad y experiencia general.

## Relación con la norma

La tabla es una simplificación didáctica de **ISO/IEC 25010:2011** (Systems and software Quality Requirements and Evaluation — SQuaRE), que organiza la calidad del software en 8 *quality characteristics*:

1. Functional Suitability
2. Performance Efficiency
3. Compatibility
4. Usability
5. Reliability
6. Security
7. Maintainability
8. Portability

La taxonomía de la cátedra re-agrupa estas características a lo largo del eje **run-time vs design vs system vs user**, más operativo para discusiones arquitectónicas.

## Cómo se usa en el curso

1. **Punto de partida** para discutir cualquier atributo — la tabla es el vocabulario común.
2. **Input al [[Árbol de utilidad]]** — de aquí salen los atributos que se priorizan en nivel 1 del árbol.
3. **Base para cuantificación** — la página `wiki/concepts/atributos-de-calidad.md` extiende la tabla con métricas típicas.
4. **Matriz de trade-offs** — cuando se discute un trade-off, se referencia por nombres de atributos de esta tabla.

## Observaciones

- La tabla es **descriptiva**, no prescriptiva — no dice qué atributos "debe" tener un sistema, lista las dimensiones donde puede haber requisitos.
- **Incompleta para todos los dominios** — sistemas ML, IoT, safety-critical pueden requerir atributos adicionales (fairness, determinism, real-time guarantees).
- **No define métricas** — hay que complementar con [[SLA, SLO, SLI]] y [[MTBF y MTTR]].

## Pregunta a profundizar

La ISO 25010 es de 2011. ¿Hay variantes o extensiones posteriores (ISO 25019, 25023) que incorporen atributos modernos como *ethicality*, *explainability*, *privacy-by-design*?

## Fuentes y lecturas

- ISO/IEC 25010:2011 — *Systems and software engineering — SQuaRE — System and software quality models*.
- ISO/IEC 25000:2014 — *SQuaRE — Guide to SQuaRE*.
- Bass, Clements, Kazman — *Software Architecture in Practice*, cap. 4 "Understanding Quality Attributes".
