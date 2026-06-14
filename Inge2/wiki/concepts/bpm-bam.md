---
title: "BPM y BAM"
aliases:
  - "BPM y BAM"
  - "BPM"
  - "BAM"
  - "Business Process Management"
  - "Business Activity Monitoring"
  - "BPMN"
  - "BPEL"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [bpm, bam, soa, procesos, bpmn, bpel, monitoreo]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[SOA — Service-Oriented Architecture]]"
  - "[[ESB — Enterprise Service Bus]]"
  - "[[Orquestación vs Coreografía]]"
  - "[[SLA, SLO, SLI]]"
---

# BPM y BAM

Dos herramientas complementarias del mundo [[SOA — Service-Oriented Architecture|SOA]]: una **define** los procesos de negocio, la otra los **monitorea** (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 7).

## BPM — Business Process Management

Sirve para **definir y manejar los procesos** de la organización, idealmente con un lenguaje de representación:

- **BPMN** (Business Process Modeling Notation) — notación gráfica de procesos.
- **BPEL** (Business Process Execution Language) — lenguaje ejecutable de procesos.

Un proceso es un **flujo de pasos** (humanos o automáticos) que se puede **mejorar** para aumentar su eficacia. Es el nivel donde la [[Orquestación vs Coreografía|orquestación]] de servicios se hace explícita: el proceso de negocio coordina qué servicio se invoca y en qué orden.

**Ejemplo de la clase** (slide 8): un *Loan Process* que encadena Get Customer Information → Credit Rating → Fraud Check (con intervención humana) → Approval → Additional Services, mezclando servicios automáticos, tareas humanas, reglas de negocio y máquinas de estado, implementado como un *WS-BPEL Business Process*.

## BAM — Business Activity Monitoring

Es una herramienta para **controlar el cumplimiento de los procesos de negocio en tiempo real**: "veo en este momento qué está pasando con mi negocio y puedo tomar acciones para evitar problemas" definiendo **umbrales y notificaciones** (slide 7).

Es el equivalente, a nivel proceso de negocio, de lo que [[SLA, SLO, SLI|SLO/SLI]] son a nivel servicio: instrumentación + alertas sobre métricas que importan.

## Por qué importan (lente de negocio)

BPM hace que el proceso de negocio sea un **artefacto explícito y mejorable**, no algo enterrado en el código. BAM cierra el loop dándole al negocio **visibilidad en vivo** para actuar antes de que un problema escale. Juntos convierten la integración técnica (el [[ESB — Enterprise Service Bus|ESB]]) en valor de negocio observable y gobernable.

## Pregunta a profundizar

En microservicios, ¿quién cumple el rol de BPM/BAM cuando no hay ESB central? (pista: orquestadores de [[Patrón Saga|sagas]], observabilidad distribuida, [[Service Mesh]]).

## Fuentes y lecturas

- OMG — especificación BPMN.
- Weske — *Business Process Management: Concepts, Languages, Architectures*.
