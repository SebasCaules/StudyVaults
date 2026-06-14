---
title: Modelo 4+1 (Kruchten)
aliases:
  - "Modelo 4+1 (Kruchten)"
  - "Modelo 4+1"
  - "4+1"
  - "4+1 view model"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [documentacion, arquitectura, 4+1, kruchten, vistas]
sources:
  - "raw/classes/Clase 3.pdf"
related:
  - "[[Clase 5 — Documentación de arquitecturas]]"
  - "[[C4 Model]]"
  - "[[Arquitectura de software — definición]]"
  - "[[Atributos de calidad]]"
  - "[[Árbol de utilidad]]"
---

# Modelo 4+1 (Kruchten)

## ¿Qué resuelve?

Kruchten (1995, artículo IEEE Software "*Architectural Blueprints — The 4+1 View Model of Software Architecture*") observa que **una sola vista no alcanza** para describir arquitectura. Cada stakeholder (desarrollador, integrador, sysadmin, usuario) necesita ver dimensiones distintas del mismo sistema.

4+1 organiza la documentación en cuatro vistas **ortogonales** más una transversal que las ata (source: raw/classes/Clase 3.pdf).

## Las cinco vistas

### 1. Lógica (Logical View)

**Qué muestra:** estructura funcional del sistema — clases, paquetes, módulos, sus responsabilidades y relaciones.

**Audiencia:** analistas, diseñadores, desarrolladores.

**Notación típica:** UML Class Diagrams, Package Diagrams, diagramas de Objeto.

**Pregunta que responde:** *¿qué hace el sistema?*

### 2. Proceso (Process View)

**Qué muestra:** comportamiento en runtime — procesos, hilos, comunicación, sincronización, concurrencia.

**Audiencia:** integradores, equipos de performance, sysadmins.

**Notación típica:** Activity Diagrams, Sequence Diagrams, diagramas de estado, BPMN para flujos.

**Pregunta que responde:** *¿cómo se comporta el sistema cuando corre?*

Aborda atributos de calidad como [[Atributos de calidad|performance]], throughput, escalabilidad, tolerancia a fallos.

### 3. Desarrollo (Development View)

**Qué muestra:** organización del software a nivel de código — módulos, librerías, frameworks, estructura de repositorios, empaquetado.

**Audiencia:** gerentes de proyecto, desarrolladores, release managers.

**Notación típica:** UML Component Diagrams, Package Diagrams, Module views, árbol de directorios.

**Pregunta que responde:** *¿cómo se organiza el código fuente?*

Relevante para [[Atributos de calidad|maintainability, reusability, portability]].

### 4. Física (Physical / Deployment View)

**Qué muestra:** mapping del software a hardware — nodos, datacenters, redes, topología de deployment.

**Audiencia:** infrastructure engineers, SREs, arquitectos de red.

**Notación típica:** UML Deployment Diagrams, diagramas de infraestructura, topología cloud (AWS/Azure/GCP).

**Pregunta que responde:** *¿dónde corre el sistema?*

Aborda [[Atributos de calidad|availability, scalability, fault tolerance]].

### +1. Escenarios (Scenarios / Use Cases)

**Qué muestra:** casos de uso representativos que **atraviesan** las otras cuatro vistas.

**Rol:** hilo narrativo que prueba la coherencia entre vistas — un mismo escenario debe poder trazarse desde la vista lógica, pasar por la de proceso, localizarse en la física y corresponder a un módulo en la de desarrollo.

**Audiencia:** todos los stakeholders (es la vista que "ata").

**Notación típica:** Use Case Diagrams, scenarios narrados, diagramas de secuencia específicos.

## Diagrama mnemotécnico

```
        ┌─────────┐
        │ Lógica  │   ◄── desarrolladores
        └────┬────┘
             │
 ┌───────────┼───────────┐
 │           │           │
┌▼───────┐ ┌▼───────┐ ┌▼──────┐
│Desarro.│ │Proceso │ │Física │
└────────┘ └────────┘ └───────┘
   managers  perf/ops   infra

     +1 Escenarios — use cases que cruzan las 4 vistas
```

## Reglas de oro

1. **Cada vista existe para una audiencia.** Si nadie la va a leer, no la produzcas.
2. **Las vistas deben ser consistentes entre sí.** Un componente en Desarrollo debe aparecer en Física y tener comportamiento en Proceso.
3. **Escenarios validan la coherencia.** Si no puedes trazar un escenario end-to-end, las vistas están desalineadas.
4. **Sólo lo arquitectónicamente significativo.** No pongas cada clase en la vista lógica — sólo las que encarnan decisiones arquitectónicas.

## Comparación con [[C4 Model]]

| Dimensión | 4+1 | C4 |
|---|---|---|
| Origen | Kruchten, 1995, IEEE | Brown, ~2018, web/blog |
| Mecanismo | 4 vistas ortogonales + escenarios | Niveles de zoom anidados |
| Notación | UML | Notación libre (aunque hay tooling) |
| Curva de adopción | Alta — requiere UML | Baja — 4 tipos de diagrama |
| Dónde encaja mejor | Proyectos grandes, documentación formal | Equipos de producto, wikis ágiles |

La cátedra recomienda **enfoque híbrido**: tomar conceptos de ambos y producir sólo las vistas que el contexto exige (source: raw/classes/Clase 3.pdf).

## Crítica

- **UML-céntrico** — hoy el tooling UML está rezagado respecto a las necesidades modernas (microservicios, cloud, event-driven).
- **Puede degenerar** en documentación ritual — producir las cuatro vistas "porque corresponde" aunque nadie las lea.
- **No cubre** explícitamente trazabilidad con atributos de calidad — hay que añadirla manualmente (ver [[Árbol de utilidad]]).

## Pregunta a profundizar

Para arquitecturas event-driven modernas, ¿cuál de las 4 vistas pierde más fidelidad con UML? ¿La vista de Proceso necesita artefactos adicionales (Event Storming, AsyncAPI)?

## Fuentes y lecturas

- Kruchten, *Architectural Blueprints: The 4+1 View Model* (IEEE Software, nov 1995).
- Bass, Clements, Kazman — *Software Architecture in Practice*, cap. sobre documentación.
- Rozanski, Woods — *Software Systems Architecture* (extiende 4+1 a 7 vistas + perspectives).
