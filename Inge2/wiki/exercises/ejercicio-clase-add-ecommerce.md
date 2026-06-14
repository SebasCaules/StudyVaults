---
title: "Ejercicio en clase — ADD aplicado a e-commerce"
aliases:
  - "Ejercicio en clase — ADD aplicado a e-commerce"
  - "Ejercicio ADD e-commerce"
  - "Ejercicio tipo Parcial (Clase 3)"
  - "Ejercicio Clase 3"
type: exercise
created: 2026-05-12
updated: 2026-05-12
date: 2026-03-26
tags: [ejercicio, parcial, add, ecommerce, oltp, olap, atributos-de-calidad, en-clase]
sources:
  - "raw/classes/2026-03-26 - Clase 3/clase3.pdf"
related:
  - "[[Clase 2 — Construcción de la arquitectura]]"
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Bases de datos relacionales]]"
  - "[[OLAP y ETL]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Hierarchical Layers]]"
  - "[[Katas de Arquitectura]]"
  - "[[Enunciados de parciales — 6 casos]]"
---

# Ejercicio en clase — ADD aplicado a e-commerce

## Contexto

Ejercicio práctico tipo parcial trabajado en vivo en clase (jueves 2026-03-26). El profesor desarrolla en pizarra la metodología de [[Attribute Driven Design]] sobre un dominio de **plataforma de e-commerce** con múltiples canales (sitio web, tablets, depósito/envío) y procesadores de pago externos. Las notas que tomó el alumno son parciales (la clase no se llegó a desarrollar entera en notas) y se complementan con [[Clase 2 — Construcción de la arquitectura]] donde se enseña el método (source: raw/classes/2026-03-26 - Clase 3/clase3.pdf).

> Esta página captura el ejercicio como se vio en clase. Para el caso integral más completo de aplicación de ADD ver [[Caso Compraventa de Acciones]] (Clase 7).

## Dominio (inferido del diagrama)

Plataforma de e-commerce con:

- **Canales de entrada:** Sitio principal de **E-commerce** (web), **Tablets** en puntos físicos, **Depósito / envío** (back office).
- **Capas internas:** **SPA** (Single Page App) + **LB** (Load Balancer) frente a un **componente** de aplicación central.
- **Procesadores de pago externos:** Procesador Pago 1, Procesador Pago 2 (típicamente Prisma, Mercado Pago, etc. — sistemas sobre los que el equipo no tiene control).
- **Persistencia:** base SQL **OLTP** con replicación **Primario / Secundario**.

## Aplicación de ADD

### Paso 1 — Lista candidata de atributos de calidad

A partir de los requerimientos funcionales se identifican los atributos de calidad relevantes, y de la lista candidata se eligen **hasta 4** que serán los drivers de arquitectura (source: raw/classes/2026-03-26 - Clase 3/clase3.pdf):

| Atributo | ¿Seleccionado? | Comentario |
|---|---|---|
| **Security** | ✓ | Manejo de pagos, datos de tarjeta — compliance (PCI-DSS). |
| **Availability** | ✓ | Caída ⇒ pérdida directa de ventas y reputación. |
| **Scalability** | ✓ | Picos comerciales (CyberMonday, Hot Sale, Black Friday). |
| Performance | ✗ (descartado en clase) | "Lo dejamos afuera" — se considera derivado de scalability. |
| **Interoperability** | ✓ | Múltiples procesadores de pago + sistemas de logística. |
| Customizability | ✗ (descartado en clase) | "Lo dejamos afuera". |

Heurística docente: hasta 4 atributos como drivers principales. El resto no se ignora — pasa a la lista de **riesgos asumidos** que se documentan pero no guían la arquitectura.

### Paso 2 — Arquitectura candidata: entidades externas y blueprint inicial

Diagrama de pizarra (reconstruido):

```
   ┌───────────┐
   │ Ecommerce │ ─┐
   └───────────┘  │       Procesador
                  │       Pago 1
   ┌───────────┐  │         │
   │ Depósito/ │  │ ┌─SPA─┐ │   ┌────────────┐    ┌──────┐    ┌──────┐
   │  envío    │ ─┼─┤     ├─┴───┤ Componente ├────┤ DB   │────┤ DB   │
   └───────────┘  │ │ LB  │     │ (app core) │    │ Prim │    │ Sec  │
                  │ └─────┘     └────────────┘    └──────┘    └──────┘
   ┌───────────┐  │                 │            (SQL OLTP)
   │  Tablet   │ ─┘                 │
   └───────────┘                   Procesador
                                   Pago 2
```

La regla del Paso 1 del método: **la primera versión incluye TODOS los sistemas externos** sobre los que el equipo no tiene control (procesadores de pago, depósito, dispositivos cliente) más el mínimo de componentes internos para cumplir los **requerimientos funcionales**.

### OLTP vs OLAP (tema lateral surgido en el ejercicio)

Distinción importante para decidir dónde guardar cada cosa (source: raw/classes/2026-03-26 - Clase 3/clase3.pdf):

| Tipo | Real-Time | Forma | Uso típico |
|---|---|---|---|
| **OLTP** — Online Transaction Processing | ✓ | Esquema normalizado, transaccional (ACID) | Operación: carrito, checkout, inventario |
| **OLAP** — Online Analytical Processing | ✗ | Esquema desnormalizado, **append-only**, "tabla gigante con un montón de datos" | Métricas, analytics: scroll-depth, conversión, snapshot de precios en cada venta, etc. |

Cita textual de la cátedra sobre OLAP: *"muy bueno para métricas, append-only en una tabla gigante con un montón de datos. Ej: cantidad de píxeles scrolleados, precio del dólar en el momento de la venta, etc."* (source: raw/classes/2026-03-26 - Clase 3/clase3.pdf). Para el desarrollo completo de este tema ver [[OLAP y ETL]] y [[Bases de datos relacionales]] (clase 5).

### Pasos siguientes (no desarrollados en las notas)

La hand-note se corta en el Paso 2. Por ADD, las iteraciones siguientes deberían:

1. **Generar escenarios** sobre los atributos seleccionados, en orden:
   - **Security:** "Un atacante intenta inyectar SQL en el checkout → la app sanitiza inputs y el WAF bloquea el patrón antes de llegar al backend."
   - **Availability:** "Un nodo del LB cae → el LB redirige el tráfico al nodo sano sin que el usuario lo perciba."
   - **Scalability:** "Durante Hot Sale el tráfico crece 50× → autoscaling horizontal absorbe la carga; las DBs Primario+Secundario absorben el reads vía replicación."
   - **Interoperability:** "Se incorpora un nuevo procesador de pago → adapter pluggable con interfaz común, sin cambios al componente core."
2. **Evaluar** si la arquitectura candidata sobrevive cada escenario y, si no, modificarla **re-validando los escenarios anteriores** y los requerimientos funcionales.
3. **Iterar** hasta que todos los escenarios estén cubiertos o asumidos como riesgo.

## Conceptos canónicos ejercitados

- [[Attribute Driven Design]] — el método del ejercicio.
- [[Atributos de calidad]] — selección y priorización.
- [[Hierarchical Layers]] — SPA + LB + Componente + DB es un 4-tier clásico.
- [[Bases de datos relacionales]] — el OLTP con réplica Primario/Secundario.
- [[OLAP y ETL]] — el mecanismo natural para las métricas que el ejercicio menciona como ejemplo.
- [[Replicación de BD]] — Primario/Secundario explícito en el diagrama.

## Pregunta a profundizar

¿Cómo cambia el ranking de atributos si el negocio pivotea de **B2C minorista** a **marketplace** (vendedores terceros publican)? Entran *Trust* y *Customizability* — ¿desplazan a *Scalability* del top 4?

## Fuentes

- raw/classes/2026-03-26 - Clase 3/clase3.pdf — notas a mano del alumno (parciales).
- [[Clase 2 — Construcción de la arquitectura]] — teoría completa del método aplicado en este ejercicio.
