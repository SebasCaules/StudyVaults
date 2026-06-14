---
title: Cono de incertidumbre
aliases:
  - "Cono de incertidumbre"
  - "Cone of uncertainty"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [proceso, planificacion, incertidumbre, boehm, mcconnell]
sources:
  - "raw/classes/Clase 1.pdf"
  - "raw/classes/Clase 4.pdf"
related:
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Clase 1 — Introducción a Arquitectura]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Lightweight ATAM]]"
  - "[[ADR — Architecture Decision Record]]"
  - "[[Caso Healthcare.gov]]"
---

# Cono de incertidumbre

## La idea

En cualquier proyecto de software, la **incertidumbre en las estimaciones** no es constante: se reduce a medida que el proyecto avanza. Si graficamos "error posible en la estimación" contra "tiempo transcurrido", obtenemos un **cono** que se cierra (source: raw/classes/Clase 1.pdf).

Formulado originalmente por **Boehm** (COCOMO, años 80) y popularizado por **Steve McConnell** en *Software Estimation: Demystifying the Black Art* (2006).

## Magnitud típica

| Momento del proyecto | Rango de error típico |
|---|---|
| Initial product definition | **0.25x – 4x** |
| Approved product definition | 0.5x – 2x |
| Requirements complete | 0.67x – 1.5x |
| UI design complete | 0.8x – 1.25x |
| Detailed design complete | 0.9x – 1.1x |
| Implementation complete | 1.0x |

En otras palabras: al inicio, una estimación de "6 meses" puede significar realmente entre 1.5 y 24 meses. A medida que se avanza, el rango se comprime.

## Por qué cierra el cono

1. **Dominio comprendido.** Se aprende vocabulario, reglas de negocio, edge cases.
2. **Stack validado.** Las suposiciones técnicas se contrastan con la realidad (latencia real, throughput real, comportamiento en fallo real).
3. **Equipo asentado.** Se conoce la productividad real del equipo en este contexto.
4. **Integraciones reveladas.** Los sistemas externos muestran sus quirks (docs desactualizadas, bugs, limitaciones).

## Implicancia arquitectónica

**No se decide lo irreversible cuando la incertidumbre es máxima.**

Si tomamos una decisión arquitectónica de alto costo (ej: sharding de DB, protocolo de integración, modelo de consistencia) en el momento de **initial product definition**, apostamos en un rango 0.25x-4x. La probabilidad de que esa decisión sea la correcta es baja.

Estrategias:

1. **[[BDUF vs YAGNI vs JEDUF|JEDUF]]** — diseñar sólo lo que ya se entiende con suficiente evidencia.
2. **Spikes arquitectónicos** — reducir incertidumbre específica con experimentos acotados antes de decidir.
3. **Decisiones reversibles primero.** Elegir opciones que dejan puertas abiertas.
4. **Evaluaciones rápidas** ([[Lightweight ATAM]]) como checkpoints durante el cierre del cono.

## Observación crítica: el cono NO cierra solo

McConnell aclara que el cono es una **frontera de posibilidad**, no una trayectoria automática. En proyectos mal gestionados, la incertidumbre puede **permanecer alta** hasta el final — o incluso **aumentar** (scope creep, descubrimientos tardíos). El cierre requiere **acciones deliberadas**:

- Scope definition explícito.
- Prototipos/spikes.
- Arquitectura con decisiones documentadas (ver [[ADR — Architecture Decision Record]]).
- Feedback temprano de usuarios.

## Relación con el [[Caso Healthcare.gov]]

Healthcare.gov ilustra el costo de decidir temprano sin cerrar el cono: el scope creció silenciosamente (más estados federales, más carriers, más identity providers), las estimaciones iniciales quedaron obsoletas, pero las decisiones arquitectónicas de alto impacto se tomaron con la incertidumbre original (source: raw/classes/Clase 4.pdf).

## Diagrama mnemotécnico

```
Error
 │ ▄▄
4x │  ▀▀▄▄
 │       ▀▀▄▄
 │           ▀▀▄▄
1x│═══════════════▄▄▄▄▄═══
 │                    ▀▀▀
0.25x│
 └──────────────────────── Tiempo
   ↑                        ↑
   Inicio                   Fin
   (max incertidumbre)      (mínima)
```

## Anti-patrones

- **Decidir "firmemente" al inicio** y penalizar cambios como "falta de planificación".
- **Tomar la estimación inicial como compromiso** contractual en vez de como rango.
- **Ignorar señales** de que el cono **no está cerrando** (scope sigue vago a mitad del proyecto).

## Pregunta a profundizar

¿Cómo comunicar el cono a stakeholders no técnicos que quieren "una fecha"? ¿Hay formatos efectivos de presentar rangos probabilísticos sin perder credibilidad?

## Fuentes y lecturas

- McConnell, *Software Estimation: Demystifying the Black Art* (2006).
- Boehm, *Software Engineering Economics* (1981).
- DeMarco, Lister — *Waltzing with Bears* — gestión de riesgo en software.
