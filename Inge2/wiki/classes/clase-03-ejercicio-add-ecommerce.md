---
title: "Clase 3 — Ejercicio en clase: ADD aplicado a e-commerce"
aliases:
  - "Clase 3 — Ejercicio en clase: ADD aplicado a e-commerce"
  - "Clase 3 — Ejercicio ADD e-commerce"
  - "Clase 3"
type: class
created: 2026-05-12
updated: 2026-05-12
date: 2026-03-26
tags: [arquitectura, add, ejercicio, parcial, ecommerce, oltp, olap, atributos-de-calidad]
sources:
  - "raw/classes/2026-03-26 - Clase 3/clase3.pdf"
  - "raw/classes/2026-03-26 - Clase 3/Clase 3.pdf"
related:
  - "[[Clase 2 — Construcción de la arquitectura]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Ejercicio en clase — ADD aplicado a e-commerce]]"
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Katas de Arquitectura]]"
  - "[[OLAP y ETL]]"
  - "[[Bases de datos relacionales]]"
---

# Clase 3 — Ejercicio en clase: ADD aplicado a e-commerce

> **Nota sobre los archivos `raw/`:** el slide deck `Clase 3.pdf` (que cubre Documentación de Arquitecturas) vive en `raw/classes/2026-03-26 - Clase 3/Clase 3.pdf` por organización legacy del vault. Pero según las hand-notes del alumno, **el 2026-03-26 NO se dio Documentación**, sino un ejercicio práctico tipo parcial sobre e-commerce. Documentación se vio el 2026-04-16 — ver [[Clase 5 — Documentación de arquitecturas]]. La numeración del wiki refleja el orden cronológico real de exposición.

## TL;DR

Clase práctica: el profesor desarrolla en vivo en pizarra un **ejercicio tipo parcial** sobre una plataforma de e-commerce con múltiples canales y procesadores de pago externos, aplicando paso a paso el método de [[Attribute Driven Design]] enseñado la clase anterior. Se selecciona el top-4 de atributos (**Security / Availability / Scalability / Interoperability**) y se construye el blueprint inicial con sistemas externos. Aparece la distinción **OLTP vs OLAP** como tema lateral motivado por la necesidad de métricas (que se profundizará en [[Clase 6 — Persistencia]]).

## Mapa conceptual

- [[Attribute Driven Design]] — el método aplicado en el ejercicio.
- [[Atributos de calidad]] — selección y priorización del top-4.
- Sistemas externos como entidades de primera clase en el blueprint inicial.
- OLTP vs OLAP — distinción introducida acá, profundizada en persistencia.
- [[Ejercicio en clase — ADD aplicado a e-commerce]] — el desarrollo completo del ejercicio (página de exercise con diagramas).

## Desarrollo

El cuerpo del ejercicio está documentado íntegramente en [[Ejercicio en clase — ADD aplicado a e-commerce]] (página de tipo `exercise`). Acá un resumen de los takeaways pedagógicos de la clase:

### Heurística del top-4

> De la lista candidata de atributos, **se eligen hasta 4** que serán los drivers principales. El resto no se descarta — pasa a la lista de **riesgos asumidos** que se documentan pero no guían la arquitectura.
> (source: raw/classes/2026-03-26 - Clase 3/clase3.pdf)

En el ejercicio se descartan *Performance* (subsumida en Scalability) y *Customizability* (no crítica para el dominio). El top-4 elegido: **Security, Availability, Scalability, Interoperability**.

### Sistemas externos en el blueprint inicial

La primera versión del diagrama incluye **todos los sistemas externos** sobre los que el equipo no tiene control (procesadores de pago, depósito/envío, dispositivos cliente). La definición operativa de "sistema externo" que la cátedra refuerza: *si no podés cambiarle el código o el contrato, es externo* — esto se explicita más tarde en [[Clase 4 — ¿Cuándo diseñamos?]]).

### OLTP vs OLAP — primer encuentro

Distinción introducida lateralmente en este ejercicio, cuando aparece la pregunta "¿dónde guardo las métricas de uso (scroll-depth, precio del dólar al momento de la venta, etc.)?":

| Tipo | Real-Time | Forma | Uso típico |
|---|---|---|---|
| **OLTP** | ✓ | Esquema normalizado, transaccional (ACID) | Carrito, checkout, inventario |
| **OLAP** | ✗ | Esquema desnormalizado, **append-only**, "tabla gigante" | Métricas, analytics, snapshots |

Profundizado en [[Clase 6 — Persistencia]] y [[OLAP y ETL]].

## Decisiones clave discutidas

| Decisión | Opciones | Criterio | Recomendación cátedra |
|---|---|---|---|
| ¿Cuántos atributos como drivers? | Todos / Top-3 / Top-4 / Top-5 | Capacidad de cubrir vs ruido | **Top-4** — el resto a riesgos asumidos. |
| ¿Sistemas externos en el blueprint inicial? | Sí / sólo "core" interno | Realismo y constraints | **Sí, todos** desde la primera versión. |
| ¿OLTP soporta métricas? | Sí / separar OLAP | Patrón de carga | Separar — OLTP no debe servir reporting pesado. |

## Preguntas para el parcial

1. ¿Por qué la cátedra propone elegir un **top-4** y no todos los atributos como drivers? ¿Qué pasa con los que no entran?
2. Justificar por qué *Performance* se descartó en favor de *Scalability* en el ejercicio. ¿Es siempre así?
3. Aplicar el método al mismo dominio pero como **marketplace** (vendedores terceros). ¿Cómo cambia el top-4?
4. Diferenciar OLTP y OLAP en cinco dimensiones (volumen, esquema, mutabilidad, latencia, indexación).
5. Construir un escenario concreto de cada atributo del top-4 y proponer la modificación arquitectónica que lo cubre.

## Lecturas complementarias

- Bass, Clements, Kazman — *Software Architecture in Practice*, capítulo sobre ADD.
- Fowler — *Patterns of Enterprise Application Architecture* — Active Record, Data Mapper (relevante para la capa de persistencia del ejercicio).
- Ver [[Ejercicio en clase — ADD aplicado a e-commerce]] para el desarrollo completo con diagrama de pizarrón.
