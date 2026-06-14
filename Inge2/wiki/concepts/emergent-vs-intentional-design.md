---
title: Emergent vs Intentional Design
aliases:
  - "Emergent vs Intentional Design"
  - "Emergent design"
  - "Intentional design"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [proceso, diseño, emergent, intentional, refactoring]
sources:
  - "raw/classes/Clase 4.pdf"
related:
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Architectural Guardrails]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
---

# Emergent vs Intentional Design

## Dos mecanismos de producción de arquitectura

### Emergent Design

La arquitectura **surge** del refactoring continuo de código que crece. No hay una "planificación arquitectónica" explícita — la estructura aparece como resultado de decisiones locales tomadas con buen criterio.

**Supuestos que requiere:**
- Tests automáticos exhaustivos — cada refactor es seguro.
- Disciplina de refactoring constante — no se acumula deuda.
- Equipo pequeño y colocado — convergencia de criterios sin coordinación formal.
- Dominio conocido o simple — no hay decisiones de alto costo irreversibles.

**Fortalezas:**
- La arquitectura queda "alineada" con el código real (no diverge en papel).
- Se adapta rápido a feedback.
- Bajo costo de proceso.

**Debilidades:**
- **No escala** con tamaño del equipo — con 50 devs, la convergencia natural colapsa.
- **No anticipa** decisiones irreversibles (DB schema, API pública, modelo de seguridad).
- Puede degenerar en **Big Ball of Mud** cuando falla la disciplina.

### Intentional Design

La arquitectura se **define deliberadamente** antes (o en paralelo a) la implementación. Hay artefactos explícitos: ADRs, diagramas, árbol de utilidad.

**Supuestos que requiere:**
- Suficiente conocimiento del dominio para tomar decisiones con evidencia.
- Equipos grandes o distribuidos donde la convergencia natural no ocurre.
- Presencia de decisiones de alto costo irreversibles.

**Fortalezas:**
- Reduce riesgo en decisiones caras de revertir.
- Proporciona lenguaje común entre equipos.
- Facilita onboarding y auditoría.

**Debilidades:**
- Puede **divergir** del código real (documentación obsoleta).
- Tiende a **BDUF** si no se controla.
- Puede frenar la adaptación — "ya decidimos X, no tocar".

## La tesis de Fowler: no son opuestos

Martin Fowler, en *Is Design Dead?* (2004), argumenta que **emergent design NO es "no diseñar"** — es diseñar con un mecanismo diferente. Para que funcione requiere:

1. **Test coverage alta** — sin tests, el refactor es demasiado riesgoso.
2. **Refactoring continuo** — la arquitectura emerge sólo si el equipo se permite reorganizar constantemente.
3. **Principios internalizados** — SOLID, patrones, olfato para smells. Sin esto, la arquitectura que "emerge" es caos.

En otras palabras: emergent design **requiere disciplina intentional**.

## La práctica madura: combinación

No es una elección binaria. La práctica efectiva combina:

| Nivel | Modo | Ejemplo |
|---|---|---|
| **Decisiones de alto costo** | Intentional (ADRs, evaluaciones) | Esquema de BD, API pública, modelo de seguridad. |
| **Estructura de dominio y módulos** | Emergent con guardrails | DDD bounded contexts evolucionando con la comprensión del negocio. |
| **Detalle de implementación** | Emergent puro | Nombres, organización de paquetes, libs utilitarias. |

La elección de qué va a cada categoría es en sí una decisión arquitectónica.

## Relación con [[BDUF vs YAGNI vs JEDUF]]

- **BDUF** = intentional puro a priori.
- **YAGNI** = emergent puro.
- **JEDUF** = intentional para lo caro, emergent para lo barato.

JEDUF es el nombre práctico de la combinación descrita arriba.

## Señales de que el balance está mal

**Demasiado emergent:**
- Nadie en el equipo puede explicar "por qué" el sistema está como está.
- Mismos bugs aparecen en 3 servicios porque no hay patrón compartido.
- Onboarding toma > 2 meses.

**Demasiado intentional:**
- El código no se parece a los diagramas.
- Hay miedo a tocar el "diseño oficial" aunque esté obsoleto.
- El equipo desestima el refactoring como "riesgo innecesario".

## Pregunta a profundizar

¿Cómo se produce la arquitectura en sistemas **federados** (múltiples equipos autónomos que comparten plataforma)? ¿Es emergent a nivel macro con intentional a nivel micro, o al revés?

## Fuentes y lecturas

- Fowler, *Is Design Dead?* (martinfowler.com, 2004).
- Beck, *Extreme Programming Explained*.
- Foote, Yoder — *Big Ball of Mud* (1997).
- Ford, Parsons, Kua — *Building Evolutionary Architectures*.
