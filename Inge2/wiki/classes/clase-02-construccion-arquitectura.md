---
title: Clase 2 — Construcción de la arquitectura
aliases:
  - "Clase 2 — Construcción de la arquitectura"
  - "Clase 2"
type: class
created: 2026-04-22
updated: 2026-05-12
tags: [arquitectura, add, trade-offs, estilos-arquitectonicos, drivers, riesgos]
sources:
  - "raw/classes/2026-03-19 - Clase 2/Clase 2.pdf"
  - "raw/classes/2026-03-19 - Clase 2/clase2.pdf"
related:
  - "[[Clase 1 — Introducción a Arquitectura]]"
  - "[[Clase 5 — Documentación de arquitecturas]]"
  - "[[Attribute Driven Design (ADD)]]"
  - "[[Estilos arquitectónicos (catálogo)]]"
  - "[[Ejercicio en clase — ADD aplicado a e-commerce]]"
---

# Clase 2 — Construcción de la arquitectura

## TL;DR

Cómo se **construye** una arquitectura, no cómo se describe. Se presenta [[Attribute Driven Design]] (ADD) como método iterativo, la disciplina de **trade-offs** entre atributos, y el catálogo de [[Estilos arquitectónicos]] organizados por familia (dataflow, distribuidos, interactivos, event-based) que actúan como "vocabulario" para las decisiones.

## Mapa conceptual

- [[Attribute Driven Design]] — método iterativo de Bass/Clements/Kazman.
- Trade-offs entre atributos — por ejemplo, Security vs Usability, Performance vs Maintainability.
- Catálogo de [[Estilos arquitectónicos]]:
  - **Dataflow:** [[Batch Sequential]], [[Pipes and Filters]], [[Hierarchical Layers]] (2/3/4-tier).
  - **Distribuidos:** [[Broker pattern|Broker]], [[Publish-Subscribe]], [[Forwarder-Receiver]], [[Client-Dispatcher-Server]].
  - **Interactivos:** [[MVC]], [[PAC]], [[MVP]], [[VIPER]].
  - **Event-based:** [[Single Event Processing|SEP]], [[Stream Event Processing|STREP]], [[Complex Event Processing|CEP]], [[Online Event Processing|OLEP]].

## Desarrollo

### ADD — Attribute Driven Design

ADD es un método **iterativo** para descomponer un sistema a partir de **drivers arquitectónicos** (requisitos funcionales críticos + atributos de calidad + restricciones). Pasos (source: raw/classes/2026-03-19 - Clase 2/Clase 2.pdf):

1. **Elegir un módulo a descomponer.** Se arranca por el sistema completo.
2. **Identificar drivers** para ese módulo: qué escenarios de calidad debe satisfacer.
3. **Elegir un patrón/estilo** que resuelva esos drivers, haciendo explícitos los trade-offs.
4. **Instanciar submódulos**, asignarles responsabilidades y verificar que los drivers siguen cubriéndose.
5. **Iterar** sobre cada submódulo hasta llegar a un nivel en que pueda codificarse.

El valor del método es que fuerza a **justificar cada descomposición** con drivers explícitos — no "partimos en 3 capas porque sí".

### ADD paso a paso — versión operativa de la cátedra

La explicación detallada del flujo iterativo, tal como se desarrolló en pizarra (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf):

**Paso 0 — Orden absoluto de atributos.** Una vez identificados los atributos de calidad, hay que **ordenarlos por prioridad** en un orden **absoluto** (no parcial). Razón: los atributos de calidad **no son ortogonales** — un atributo afecta a otros, generando *trade-offs*. Si dos atributos están "empatados", no hay forma de resolver el trade-off cuando aparece. Dos constraints están siempre presentes y son no-negociables: **tiempo** y **costo**.

**Paso 1 — Arquitectura candidata inicial ("trusting your gut").** Decidir qué tipo de aplicación es y qué estilo arquitectónico va a tener. La primera versión del diagrama incluye **todos los sistemas externos** (API de ARCA, Prisma, procesadores de pago, etc.) y el mínimo necesario para que funcione. Luego se chequea que cumpla los **requerimientos funcionales**.

**Paso 2 — Generar escenarios sobre los atributos.** Para cada atributo en orden de prioridad, plantear escenarios posibles que lo afecten. Elegir uno por iteración para entender qué **riesgo** introduce. Estos escenarios son los **drivers de arquitectura**.

**Paso 3 — Evaluar si la arquitectura sobrevive al escenario.** Si no sobrevive:

1. Hacer cambios para que sobreviva.
2. **Re-validar requerimientos funcionales** (no haya regresión).
3. **Re-validar escenarios anteriores** ya cubiertos (la arquitectura cambió y puede haber roto algo que antes funcionaba).

Cuando se cubrieron todos los escenarios actuales, volver al Paso 2 y generar nuevos.

> *"El trabajo del arquitecto es convertir riesgos en no-riesgos, y hacerlo de forma costo-efectiva."*
> (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf)

**Outputs del proceso.** Al terminar se tiene:

1. Una **arquitectura candidata**.
2. Una lista de **escenarios cubiertos** = atributos de calidad satisfechos (no-riesgos).
3. Una lista de **riesgos asumidos** (escenarios que se decidió no cubrir, conscientemente).
4. Una lista de **trade-offs asumidos** (qué se sacrificó por qué).
5. Una lista de **supuestos asumidos** (qué se dio por cierto sin validar).

Esos cinco artefactos son la entrega arquitectónica — no sólo el diagrama. Sin ellos, no se puede ni evaluar ni discutir la decisión más tarde.

**Aplicación práctica:** el método se ejecuta en vivo sobre un caso de e-commerce en [[Ejercicio en clase — ADD aplicado a e-commerce]] (jueves 2026-03-26).

### Trade-offs

Toda decisión mejora algunos atributos a costa de otros. Ejemplos canónicos discutidos en clase:

| Gana | Pierde | Ejemplo |
|---|---|---|
| Performance | Maintainability | Cachés denormalizadas. |
| Security | Usability | MFA obligatorio, rotación de contraseñas. |
| Availability | Consistency | Quorums eventualmente consistentes (CAP). |
| Portability | Performance | Capa de abstracción de DB. |
| Reusability | Simplicity | Generalización prematura (YAGNI). |

La madurez arquitectónica se mide en **hacer explícitos estos trade-offs** antes de decidir, no en pretender que no existen.

### Estilos arquitectónicos

Un **estilo** es un patrón de gran escala que determina la topología de comunicación y la asignación de responsabilidades. Conocerlos es tener un vocabulario: al decir "pipes and filters" ya comunicás decisiones sobre acoplamiento, composabilidad y streaming.

**Dataflow** — datos fluyen de una fase a la otra:

- **Batch Sequential:** cada etapa procesa todo el input antes de pasar al siguiente. Útil para ETL, reportería. Si un registro falla, hay tres estrategias canónicas: *revertir y abortar todo*, *guardar punto de procesamiento para retomarlo más tarde*, o *saltarlo para reprocesarlo después y seguir con el resto* (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf).
- **[[Pipes and Filters]]:** etapas streaming, bajo acoplamiento (UNIX `|`). Gana composabilidad y enabling **real-time** porque no espera a terminar un paso para comenzar el siguiente. **Unidireccional**, **single-thread por filtro** pero permite **alto nivel de paralelización**. Talón de Aquiles: si un filtro aborta, **se rompe la cadena** y restaurar el sistema puede requerir reinicio + pérdida de datos (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf).
- **[[Hierarchical Layers]]:** cada capa **provee servicios a la capa superior y es cliente de la inferior**. Variantes en clase: 3 capas físicas (Cliente / Servidor de Negociación / Servidor de BD) y 4 capas físicas (Cliente / Web / Aplicaciones / BD). Facilita separación de concerns y reusabilidad; pierde performance por indirección y obliga a replicar cambios a través de todas las capas (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf).

**Distribuidos** — comunicación entre nodos por red:

- **[[Broker pattern|Broker]]:** un intermediario coordina la comunicación cliente↔servidor y hace el *matching*. Ventajas: facilita el *discovery* y los servicios no necesitan estar expuestos a internet directamente, bypaseando problemas de redes locales. **Desventaja crítica: el broker es un Single Point of Failure (SPOF)** — si se rompe el broker, se rompe todo (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf).
- **[[Publish-Subscribe]]:** análogo al patrón [[Observer]]. Un *publisher* notifica a muchos *subscribers* (analogía: repartidor de diarios). Publisher y subscribers **no se conocen entre sí** — sólo conocen el **tópico**. Es en tiempo real y dinámico. Trade-off: requiere consideraciones especiales para **manejar pérdida de eventos** (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf).
- **[[Forwarder-Receiver]]:** **encapsula y abstrae por completo** la comunicación entre las partes — como desarrollador sólo invoco una función y no sé qué pasa después.
- **[[Client-Dispatcher-Server]]:** alternativa al broker pero **no opera como proxy**: permite conexión directa cliente↔servidor luego de que el *dispatcher* resuelve la localización. Analogía: las páginas amarillas — el directorio te da el número, después llamás directo (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf).

**Interactivos** — separación UI / lógica. Dominio donde se procesan inputs del usuario en forma directa; las apps están **~90% del tiempo en standby** (apps de escritorio, teléfono, auto). Familia: PAC, MVP, VIPER, MVC.

- **[[MVC]]** (visto en clase con detalle): divide la aplicación en tres componentes (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf):
  - **Modelos** — estado de la app y reglas de negocio.
  - **Vistas** — muestran información al usuario.
  - **Controladores** — reciben inputs del usuario y orquestan la actualización.
  - *Ventajas:* múltiples vistas del mismo modelo, independencia entre vistas y datos.
  - *Desventaja:* **trickle effect** entre componentes cuando cambia el modelo de datos — un cambio se propaga a vistas y controladores.
- **[[PAC]] (Presentation-Abstraction-Control):** jerárquico, cada agente tiene su propio PAC.
- **[[MVP]]:** presenter en lugar de controller; view pasiva.
- **[[VIPER]]:** View-Interactor-Presenter-Entity-Router. Más granular, popular en iOS.

**Event-based** — flujos de eventos como ciudadano de primera:

- **SEP:** un evento → una acción.
- **STREP:** stream de eventos con operadores (agregación, ventanas) — ver Flink, Kafka Streams.
- **CEP:** detección de patrones compuestos en tiempo real — ver Esper, Drools.
- **OLEP:** procesamiento online transaccional sobre eventos.

Trade-off de toda la familia (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf):
- **Ventaja dominante:** alta independencia — los servicios se *desarrollan, escalan y despliegan en producción* en forma independiente.
- **Desventaja dominante:** dificultad para **reproducir situaciones particulares** y determinar la **causa raíz** de un problema. Rastrear una operación end-to-end o garantizar tiempos de procesamiento requiere construir capacidades dedicadas (tracing distribuido, correlation IDs, observabilidad).

**Otros estilos** mencionados sin desarrollo profundo: Repositorios y Blackboards, Virtual Machines & Interpreters, Rule-Based Systems, Web Server Patterns, Concurrency Patterns (source: raw/classes/2026-03-19 - Clase 2/clase2.pdf).

## Decisiones clave discutidas

| Decisión | Opciones | Criterio | Recomendación cátedra |
|---|---|---|---|
| Método para descomponer | Ad-hoc / top-down por features / ADD | Trazabilidad a atributos | **ADD** — obliga a justificar con drivers. |
| Estilo para orquestación pesada de datos | Batch / Pipes and Filters / Event-based | Latencia, composabilidad, observabilidad | Depende: batch para reportes nocturnos, streaming para tiempo real. |
| Estilo para UI rica con lógica distribuida | MVC / MVP / VIPER | Testabilidad y granularidad | MVP/VIPER si se priorizan tests de view con presenter simulable. |

## Preguntas para el parcial

1. Describir los 5 pasos de ADD y explicar por qué es iterativo.
2. Dar un ejemplo de trade-off entre Performance y Maintainability, y justificar cuándo priorizar uno u otro.
3. Comparar Pipes and Filters vs Broker: ¿en qué contexto cada uno?
4. Diferencia conceptual entre STREP y CEP.
5. ¿Qué gana MVP sobre MVC desde el punto de vista de testability?

## Lecturas complementarias

- Bass, Clements, Kazman — *Software Architecture in Practice*, cap. sobre ADD.
- Buschmann et al. — *Pattern-Oriented Software Architecture* (POSA) — catálogo de estilos.
- Richards, Ford — *Fundamentals of Software Architecture* — trade-offs modernos.
