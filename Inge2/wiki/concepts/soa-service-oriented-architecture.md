---
title: "SOA — Service-Oriented Architecture"
aliases:
  - "SOA — Service-Oriented Architecture"
  - "SOA"
  - "Arquitectura Orientada a Servicios"
  - "SOA Governance"
  - "Granularidad de servicios"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [soa, integracion, esb, gobernanza, arquitectura, servicios]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Integración de sistemas]]"
  - "[[ESB — Enterprise Service Bus]]"
  - "[[BPM y BAM]]"
  - "[[Orquestación vs Coreografía]]"
  - "[[Microservicios]]"
  - "[[Estilos arquitectónicos]]"
---

# SOA — Service-Oriented Architecture

## Qué es

**SOA** es un estilo de integración donde la funcionalidad de negocio se expone como **servicios** reutilizables, normalmente sobre un [[ESB — Enterprise Service Bus|Enterprise Service Bus]] que media la comunicación. Según la [[Clase 9 — Integración de Sistemas / SOA / Microservicios|clase]], **sigue siendo hoy el modelo más usado por las empresas para integrar sus aplicaciones corporativas** (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 16).

El driver de SOA es doble y en este orden: **primero integración, después gobernanza** — contrasta con [[Microservicios|microservicios]], cuyo driver es *velocidad y crecimiento* (slide 17).

## Piezas de una arquitectura SOA

- **[[ESB — Enterprise Service Bus|ESB]]** — el bus que rutea, transforma y compone mensajes entre sistemas.
- **[[BPM y BAM]]** — definición/mejora de procesos (BPMN/BPEL) y su monitoreo en tiempo real.
- **Service Registry** — catálogo de servicios disponibles (design-time y runtime).
- **Service Exposure Gateway** — agrega virtualización, visibility, traffic management y security a los servicios expuestos.
- **Governance** (ver abajo).

## Granularidad de servicios

Los servicios tienen una dimensión de **granularidad** (slide 11):

- **Grano fino** — la base de negocio sobre la que se construye funcionalidad (ej.: "obtener saldo de cuenta").
- **Grano grueso** — servicios complejos compuestos a partir de los de grano fino, agregando validaciones, transaccionalidad, contingencias (ej.: "procesar préstamo").

La composición de servicios se hace por [[Orquestación vs Coreografía|orquestación (dirigida desde el ESB) o coreografía (coordinada entre los servicios)]].

## Governance

Para que SOA tenga éxito, varias aplicaciones deben **compartir servicios comunes y reutilizables**, y eso exige coordinación: consumidores y proveedores son equipos distintos con procesos distintos. La gobernanza SOA incluye (slide 9):

- Definición del servicio (alcance, interfaz, límites).
- Ciclo de vida e implementación.
- Control de versiones (incluida compatibilidad).
- Migración (desaprobación y caducidad).
- Registro de dependencias.
- Modelo de gestión con **modelos de datos canónicos**.
- Supervisión, propiedad (ownership), pruebas y seguridad del servicio.

La gobernanza es lo que evita que SOA degenere otra vez en espagueti de servicios.

## Cuándo SÍ y cuándo NO

- **SÍ:** organización con muchas aplicaciones heterogéneas (incluido legacy) que necesitan integrarse y gobernarse de forma centralizada; el driver es *integración corporativa*, no *velocidad de feature*.
- **NO / límite:** la clase es explícita — SOA **limita en escalabilidad, fault tolerance, desarrollo rápido y deployments frecuentes** (slide 16). Si el driver es ir rápido y escalar de forma independiente, ese límite empuja hacia [[Microservicios]].

## Relación con microservicios

Microservicios puede verse como la evolución de SOA que reemplaza el ESB pesado por comunicación liviana (REST/mensajería) y descentraliza la gobernanza y los datos ([[Database per Service]]). No es "SOA pero mejor": resuelve un problema distinto (velocidad vs integración). Ver el pivote en [[Clase 9 — Integración de Sistemas / SOA / Microservicios]].

## Pregunta a profundizar

¿La gobernanza centralizada de SOA es compatible con la autonomía de equipos que pide microservicios, o son fuerzas opuestas que hay que balancear con [[Architectural Guardrails]]?

## Fuentes y lecturas

- Erl, *Service-Oriented Architecture: Concepts, Technology, and Design*.
- Hohpe, Woolf — *Enterprise Integration Patterns*.
