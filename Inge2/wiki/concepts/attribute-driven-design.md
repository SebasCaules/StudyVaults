---
title: Attribute Driven Design (ADD)
aliases:
  - "Attribute Driven Design (ADD)"
  - "Attribute Driven Design"
  - "ADD"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [arquitectura, add, bass-clements-kazman, metodo]
sources:
  - "raw/classes/Clase 2.pdf"
related:
  - "[[Atributos de calidad]]"
  - "[[Arquitectura de software — definición]]"
  - "[[Clase 2 — Construcción de la arquitectura]]"
  - "[[Árbol de utilidad]]"
  - "[[Estilos arquitectónicos (catálogo)]]"
  - "[[Clase 7 — Caso Compraventa de Acciones]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Caso Healthcare.gov]]"
---

# Attribute Driven Design (ADD)

## ¿Qué problema resuelve?

Un método para **construir** una arquitectura (no sólo describirla) que hace **explícita la trazabilidad** entre cada descomposición arquitectónica y los atributos de calidad que justifican esa descomposición. Sustituye el "partimos en 3 capas porque siempre se hizo así" por "partimos en 3 capas porque X, Y, Z".

Propuesto por Bass, Clements, Kazman (SEI/Carnegie Mellon).

## Los drivers arquitectónicos

ADD opera sobre tres tipos de inputs:

1. **Requisitos funcionales críticos** — los casos de uso que no pueden fallar.
2. **Atributos de calidad priorizados** — con escenarios concretos (de un [[Árbol de utilidad]]).
3. **Restricciones** — técnicas (stack legacy), de negocio (deadline, budget), regulatorias.

Estos tres juntos son los **architectural drivers**. Todo resto es diseño de detalle.

## Los pasos (source: raw/classes/Clase 2.pdf)

### 1. Elegir módulo a descomponer

Se arranca por el sistema completo (la caja "root"). En iteraciones sucesivas, cada submódulo se convierte en la caja a descomponer.

### 2. Identificar drivers del módulo

No todos los drivers del sistema aplican a cada módulo. Cada iteración se pregunta: *de los drivers totales, ¿cuáles recaen sobre este módulo particular?*

### 3. Elegir patrón/estilo que resuelva los drivers

Acá se toma la decisión arquitectónica. Ejemplo: si el driver dominante es escalabilidad horizontal y baja acoplamiento temporal, [[Publish-Subscribe]] es candidato. Si es simplicidad y latencia baja, capas con sync calls.

**Explicitar trade-offs:** todo patrón mejora algo a costa de algo. Documentar el costo.

### 4. Instanciar submódulos y asignar responsabilidades

El patrón define roles (ej: broker, client, worker). Se crean los submódulos concretos, se les asignan responsabilidades, y se verifica que juntos sigan cubriendo los drivers del padre.

### 5. Iterar

Cada submódulo vuelve al paso 1. Se termina cuando el nivel de granularidad alcanza "clase/componente codificable".

## ¿Cuándo parar?

Regla pragmática: **cuando el equipo puede empezar a codear sin romper invariantes arquitectónicas**. Más detalle es diseño de bajo nivel, no arquitectura.

## Diferencia con top-down tradicional

| Top-down clásico | ADD |
|---|---|
| Parte de funcionalidad, descompone en módulos funcionales. | Parte de **atributos** + funcionalidad, descompone según qué atributo domina. |
| Produce árboles estructurales. | Produce árboles estructurales + justificación. |
| No obliga a trade-offs explícitos. | Cada nodo del árbol tiene un "porque…". |

## Cuándo NO aplicar

- **Sistemas CRUD simples** donde los atributos no son exigentes — ADD es overkill.
- **Spikes / prototipos** — se privilegia velocidad de aprendizaje.
- **Equipos sin práctica con atributos de calidad** — empezar por capacitar, no por método.

## Ejemplo mínimo

Sistema: API de catálogo de e-commerce.
- Driver 1: latencia p95 < 100ms bajo 10k rps.
- Driver 2: catálogo cambia seldom (1/hora).
- Driver 3: tolerar caída de BD principal por 5 min sin downtime visible.

Paso 3 — elección de patrón: **Read-through cache con warm stale fallback**. Descompone en: API → Cache (Redis) → DB.

Trade-off explícito: **consistencia débil** (cache puede tener datos obsoletos 1min) a cambio de p95 bajo y disponibilidad bajo fallo de DB.

## Pregunta a profundizar

ADD y DDD estratégico (bounded contexts) — ¿son métodos competidores o complementarios? En qué orden aplicar.

## Fuentes y lecturas

- Bass, Clements, Kazman — *Software Architecture in Practice*, cap. sobre ADD.
- Wojcik et al. (SEI, 2006) — *Attribute-Driven Design (ADD), Version 2.0* — technical report original.
- ADD 3.0 — revisión moderna que integra DDD.
