---
title: Arquitectura de software — definición
aliases:
  - "Arquitectura de software — definición"
  - "Arquitectura de software"
  - "Definición de arquitectura"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [arquitectura, fundamentos]
sources:
  - "raw/classes/Clase 1.pdf"
related:
  - "[[Architecture Business Cycle]]"
  - "[[Atributos de calidad]]"
  - "[[Clase 1 — Introducción a Arquitectura]]"
  - "[[ADR — Architecture Decision Record]]"
  - "[[Cono de incertidumbre]]"
  - "[[ATAM — Architecture Tradeoff Analysis Method]]"
---

# Arquitectura de software — definición

## Definiciones convergentes

No hay una definición única, pero las canónicas convergen en el mismo núcleo (source: raw/classes/Clase 1.pdf):

- **Kruchten:** *"Las decisiones significativas sobre la organización del sistema de software: selección de los elementos estructurales y sus interfaces, su comportamiento y colaboraciones, y el estilo arquitectónico que guía el ensamblado"*.
- **Booch, Rumbaugh, Jacobson (UML authors):** *"La arquitectura es la estructura o estructuras significativas del sistema, comprendiendo componentes, sus propiedades externamente visibles, y las relaciones entre ellos"*.
- **Bittner / Reitman:** *"set of significant decisions about the organization of a software system"*.
- **Bass, Clements, Kazman:** *"the structure or structures of the system, which comprise software elements, the externally visible properties of those elements, and the relationships among them"*.

## La palabra clave: *significativas*

"Significativas" opera como filtro. Una decisión es arquitectónica si:

1. **Su costo de cambio es alto** — una vez tomada, revertirla implica rewrites sustanciales o migraciones de datos.
2. **Impacta múltiples atributos de calidad** — no sólo funcionalidad; toca performance, security, maintainability.
3. **Restringe decisiones futuras** — elegir monolito vs microservicios condiciona decenas de decisiones menores downstream.
4. **Es visible al exterior** del módulo/servicio — forma parte del contrato con el resto del sistema.

Ejemplos de decisiones arquitectónicas:
- Estilo general (monolito / microservicios / serverless).
- Esquema de persistencia (SQL vs documento, sharding, CQRS).
- Protocolo de integración (REST / gRPC / eventos).
- Modelo de seguridad (OAuth, mTLS, zero-trust).
- [[Atributos de calidad]] priorizados.

Ejemplos que **no** lo son (diseño, no arquitectura):
- Elegir `HashMap` vs `TreeMap` dentro de una clase.
- Nombre de una variable.
- Split de un método en dos.

## Arquitectura vs diseño

Martin Fowler: *"architecture is about the important stuff. Whatever that is"*. La distinción es gradual, no binaria. Una regla práctica: si un nuevo integrante del equipo necesita entenderlo para operar correctamente, probablemente sea arquitectura.

## Implicancias prácticas

1. **Documentar las decisiones arquitectónicas explícitamente** — ver [[ADR — Architecture Decision Record]].
2. **Evitar tomar decisiones arquitectónicas tarde sin evidencia** — ver [[Cono de incertidumbre]].
3. **Evaluar alternativas arquitectónicas con atributos de calidad** — ver [[ATAM]].

## Contra-punto: "No Silver Bullet" (Brooks, 1986)

Brooks argumenta que no hay una decisión arquitectónica universal que resuelva la complejidad esencial del software. Toda arquitectura es un **compromiso en un contexto**. Útil antídoto contra afirmaciones tipo "microservicios son mejores" o "clean architecture resuelve X".

## Pregunta a profundizar

¿Las decisiones sobre procesos de desarrollo (CI/CD, branching strategy) son arquitectónicas? Conway's Law sugiere que sí.

## Fuentes y lecturas

- Bass, Clements, Kazman — *Software Architecture in Practice* (3ra ed.), cap. 1.
- Fowler, "Who Needs an Architect?" (IEEE Software, 2003).
- Brooks, "No Silver Bullet" (1986).
