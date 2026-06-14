---
title: Clase 5 — Documentación de arquitecturas
aliases:
  - "Clase 5 — Documentación de arquitecturas"
  - "Documentación de arquitecturas"
  - "Clase 3 — Documentación de arquitecturas"
type: class
created: 2026-04-22
updated: 2026-05-12
date: 2026-04-16
tags: [arquitectura, documentacion, 4+1, c4, vistas, tailoring]
sources:
  - "raw/classes/2026-03-26 - Clase 3/Clase 3.pdf"
  - "raw/classes/2026-04-16 - Clase 5/clase5.pdf"
related:
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Clase 6 — Persistencia]]"
  - "[[Modelo 4+1 (Kruchten)]]"
  - "[[C4 Model]]"
---

# Clase 5 — Documentación de arquitecturas

> **Nota sobre los archivos `raw/`:** la cátedra distribuyó el slide deck que cubre este tema con el filename `Clase 3.pdf`. Vive en `raw/classes/2026-03-26 - Clase 3/Clase 3.pdf` porque así se organizó el vault originalmente. Sin embargo, las **notas a mano del alumno** sobre Documentación se tomaron el **2026-04-16** (`raw/classes/2026-04-16 - Clase 5/clase5.pdf`) — esa es la **fecha real de exposición** en la cátedra (Clase 5 cronológica). La numeración del wiki ahora refleja el orden cronológico real. El alias `Clase 3 — Documentación de arquitecturas` se mantiene para que wikilinks viejos sigan resolviendo. Los folders de `raw/` permanecen inmutables por convención.

## TL;DR

La documentación arquitectónica no es un entregable burocrático — es un artefacto **vivo** que debe permitir **entender, validar, criticar, proponer mejoras e implementar** la arquitectura. La clase compara dos escuelas: [[Modelo 4+1]] (Kruchten, clásico, multivista formal) y [[C4 Model]] (Brown, moderno, "Google Maps del sistema"). Conclusión: **tailoring** — usar un híbrido según audiencia y propósito.

## Mapa conceptual

- Propósitos de la documentación arquitectónica — 5 verbos (entender, validar, criticar, mejorar, implementar).
- Nivel de detalle = **mínimo necesario** (source: raw/classes/2026-03-26 - Clase 3/Clase 3.pdf).
- Estándares: Views and Viewpoints, Views and Beyond, [[Modelo 4+1]], IEEE 1471.
- [[Modelo 4+1]] — Kruchten: 4 vistas + escenarios.
- [[C4 Model]] — Brown: Context, Containers, Components, Code.
- Enfoque híbrido como práctica dominante actual.

## Desarrollo

### ¿Para qué documentar?

La documentación es un conjunto de **artefactos** que permiten a la organización (source: raw/classes/2026-03-26 - Clase 3/Clase 3.pdf; raw/classes/2026-04-16 - Clase 5/clase5.pdf):

1. **Entender** la arquitectura.
2. **Validar** que cumple los drivers.
3. **Criticar** y detectar debilidades.
4. **Proponer** mejoras.
5. **Implementar** según el diseño.

Preguntas que un arquitecto debe responder en su documentación: cuáles son los elementos funcionales principales, cómo interactúan, qué información se maneja/persiste/presenta, qué SW/HW se requiere, qué características operacionales, qué ambientes (dev/test/soporte/capacitación).

### Nivel de detalle

Regla dorada: **el mínimo necesario**. Razones (source: raw/classes/2026-03-26 - Clase 3/Clase 3.pdf; raw/classes/2026-04-16 - Clase 5/clase5.pdf):

- La documentación es un **documento vivo** — se desactualiza conforme la arquitectura madura. A más detalle, más mantenimiento.
- La extensión atenta contra el foco — un doc extenso es uno que nadie lee completo y donde es fácil omitir lo crítico.
- El uso de **patrones y prácticas estándar** reduce lo que hay que detallar: decir "usamos CQRS" vale por 10 diagramas.

Lo que la cátedra explicita sobre los extremos (source: raw/classes/2026-04-16 - Clase 5/clase5.pdf):
- **Máximo nivel de detalle:** código fuente, implementación completa. *"Llega tarde y es muy difícil de entender."* La doc que es el código mismo no documenta — es lo documentado.
- **Mínimo nivel de detalle:** deja afuera cosas que pueden servir, no nos funciona.
- **Equilibrio buscado:** dar la visión general **y** un detalle particular sobre lo crítico. Ni resumen vacío ni manual exhaustivo.

Evitar crear una descripción que incluya TODO.

### Modelo 4+1 (Kruchten, 1995)

Cuatro vistas principales, cada una para una audiencia y con diagramas típicos:

| Vista | Foco | Audiencia | Diagrama UML |
|---|---|---|---|
| **Lógica** | Modelo de dominio y persistencia | End-users, funcionalidad | Class, DER |
| **Proceso** | Concurrencia, sincronización | Integradores, performance, scalability | Activity, Sequence, Collaboration |
| **Desarrollo** | Organización estática, librerías | Programmers, software management | Package, Component |
| **Física** | Mapeo SW↔HW, distribución | System engineers, topology | Deployment |

La vista "+1" son los **escenarios**: validan la arquitectura mostrando cómo interactúan las 4 vistas en un caso típico.

Interacciones entre vistas (source: raw/classes/2026-04-16 - Clase 5/clase5.pdf):
- **Lógica y procesos:** la vista lógica responde *qué hacen las clases*; la de proceso responde *qué nivel de concurrencia tienen*.
- **Lógica y desarrollo:** clases que interactúan entre sí **pueden provenir de diferentes módulos o librerías** — la vista de desarrollo captura este origen.
- **Procesos y física:** un mismo proceso puede pasar por **diferentes servidores** — es muy común en web (ej: request del navegador → CDN → API gateway → backend → DB).

Falta el **+1: los escenarios** — son la vista transversal que **valida la arquitectura** explicando cómo interactúan objetos y procesos en un **caso típico**. Sin escenarios, las cuatro vistas son descripción sin verificación.

> **Mapa típico de audiencias por vista** (source: raw/classes/2026-04-16 - Clase 5/clase5.pdf): Logical View → End-user functionality. Process View → Integrators, Performance, Scalability. Development View → Programmers, Software management. Physical View → System engineers, Topology, Communications. Scenarios → todos.

Consideraciones (source: raw/classes/2026-04-16 - Clase 5/clase5.pdf):
- **Tailoring:** el modelo se adecua a cada caso — *suprimir o combinar vistas* para alcanzar el nivel de detalle adecuado; usar distintos diagramas según convenga.
- **Proceso iterativo:** la arquitectura evoluciona y su descripción también.
- **Complejidad e interrelación:** las vistas son complejas y se relacionan entre sí — **evitar contradicciones**.

### C4 Model (Simon Brown)

Inspirado en 4+1, cuatro niveles de zoom — un "Google Maps" del sistema:

| Nivel | Foco | Contenido | Audiencia |
|---|---|---|---|
| **Context** | Sistema como caja negra | Usuarios + sistemas externos | Técnicos y no técnicos (POs, executives). |
| **Containers** | Artefactos deployables | Apps + storages (web, DB, mobile, microservicios) | Técnicos (dev, ops, soporte). |
| **Components** | Interior de un container | Grupos de funcionalidad con interfaces | Arquitectos y desarrolladores. |
| **Code** | Implementación | Clases / ER | Developers. |

Principios (source: raw/classes/2026-04-16 - Clase 5/clase5.pdf):
- **Es una lista jerárquica** — cada nivel es zoom del anterior.
- **Independiente de la notación:** no importa usar UML, sirve **cualquier método que transmita el mensaje de la forma más fácil**.
- **Prioriza la abstracción:** foco en la comunicación, usando abstracciones comunes (personas, sistemas, contenedores, componentes).

Detalle por nivel (source: raw/classes/2026-04-16 - Clase 5/clase5.pdf):

| Nivel | Foco | Contenido | Audiencia |
|---|---|---|---|
| **Context** | Mostrar el sistema como **caja negra en el centro**. | Cómo el sistema interactúa con sus usuarios y otros sistemas técnicos. | Stakeholders técnicos y no técnicos. |
| **Containers** | Mostrar sus **artefactos deployables**. | Aplicaciones y storages: servidores web, bases de datos, etc. | Equipos técnicos: dev, ops, soporte. |
| **Components** | (zoom intermedio) | Componentes dentro de un container. | Arquitectos y desarrolladores. |
| **Code** | Hacer **zoom en un componente específico** para mostrar detalles de implementación. | Típicamente diagramas de clases o DER. | Developers. |

### Tailoring — el enfoque híbrido

Práctica actual dominante (fiel al concepto de *tailoring*): muchos arquitectos hoy usan un **approach híbrido** (source: raw/classes/2026-04-16 - Clase 5/clase5.pdf):

- **C4** para la vista *estática* del proyecto.
- **Vistas de proceso** (heredadas del 4+1) para documentar complejidades en runtime.
- **Escenarios** para validar el cumplimiento de atributos de calidad.

Es decir: ni 4+1 puro ni C4 puro — cada modelo aporta donde es más fuerte y se evita la redundancia.

## Decisiones clave discutidas

| Decisión | Opciones | Criterio | Recomendación cátedra |
|---|---|---|---|
| Modelo de documentación | 4+1 / C4 / Views and Beyond / ad-hoc | Audiencia, formalidad, mantenibilidad | **Híbrido C4 + escenarios de proceso**. |
| Nivel de detalle | Exhaustivo / mínimo necesario | Esperanza de vida del doc | **Mínimo necesario**; apoyarse en patrones estándar. |
| Notación | UML estricto / cajas y flechas | Audiencia mixta | Flexible; priorizar comprensión. |

## Preguntas para el parcial

1. Enumerar las 4 vistas del modelo 4+1 y qué audiencia le habla cada una.
2. ¿Qué es la vista "+1" y qué rol cumple?
3. Comparar C4 y 4+1 — ¿cuándo elegiría uno sobre el otro?
4. Justificar la regla "mínimo detalle necesario" invocando el concepto de documento vivo.
5. ¿Qué diagrama UML usaría para documentar la vista física y por qué?

## Lecturas complementarias

- Kruchten, "Architectural Blueprints — The '4+1' View Model" (IEEE Software, 1995).
- Simon Brown — *The C4 model for visualising software architecture* (c4model.com).
- IEEE 1471 / ISO 42010 — estándar de descripción arquitectónica.
