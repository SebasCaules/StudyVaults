---
title: Clase 7 — Caso Compraventa de Acciones
type: class
aliases:
  - "Clase 7 — Caso Compraventa de Acciones"
  - "Clase 7"
  - "Compraventa de Acciones (Clase 7)"
created: 2026-05-07
updated: 2026-05-07
tags: [class, kata, compraventa-acciones, security, add, mecanismos-seguridad, iteracion-por-atributo]
sources:
  - "raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md"
  - "raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (3).png"
  - "raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (4).png"
  - "raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (5).png"
date: 2026-05-07
related:
  - "[[Clase 6 — Big Data en tiempo real (Twitter)]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Árbol de utilidad]]"
  - "[[Enunciados de parciales — 6 casos]]"
  - "[[ATAM]]"
  - "[[Lightweight ATAM]]"
  - "[[Teorema CAP]]"
  - "[[Bases de datos relacionales]]"
  - "[[Replicación de BD]]"
  - "[[Architectural Guardrails]]"
  - "[[Caso Healthcare.gov]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Katas de Arquitectura]]"
---

# Clase 7 — Caso Compraventa de Acciones

## TL;DR

Kata integral aplicando [[Attribute Driven Design]] en vivo sobre el [[Caso Compraventa de Acciones|Caso 2 del banco de parciales]] — un mercado electrónico de acciones. Metodología demostrada: **diseño iterativo por atributo de calidad**. Cada iteración parte de una arquitectura base y agrega los mecanismos requeridos para el atributo en turno, en orden de prioridad. Filosofía clave: Security como **threshold defense** ("ser lo suficientemente difícil de entrar para que el atacante elija otro target") y dependiente de la **naturaleza de los datos**.

## Mapa conceptual

- [[Caso Compraventa de Acciones]] — el caso desarrollado integralmente en clase.
- [[Attribute Driven Design]] — método aplicado paso a paso.
- [[Atributos de calidad]] — fuente del ranking inicial.
- [[Mecanismos de seguridad]] — catálogo de mecanismos aplicados en la 2ª iteración (WAF, MFA, sanitización, encriptación at-rest, reverse proxy, VPN).
- [[Árbol de utilidad]] — implícito en la priorización de escenarios por atributo.
- [[Bases de datos relacionales]] — SQL OLTP como elección para datos financieros.
- [[Replicación de BD]] — material para la 3ª iteración (Availability).
- [[Teorema CAP]] — el dominio financiero es CP-extremo, no negociable.

## Desarrollo

### Filosofía del atributo Security

> *"Lo más importante que tiene una empresa es la información de sus usuarios."*
> *"La importancia se determina por la naturaleza de los datos."*
> *"El objetivo es ser lo suficientemente difícil de entrar para que sea más atractivo hackear a otro."*
> (source: raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md)

Tres ideas que vale la pena retener:

1. **La información del usuario es el activo principal de la empresa moderna.** No el código, no la infraestructura — los datos. Toda decisión de seguridad se justifica desde ahí.
2. **La importancia depende de la naturaleza del dato.** El banco encripta más que la red social; el catálogo de productos exige menos que la historia clínica. No hay seguridad universal — hay seguridad **adecuada** al dominio.
3. **Threshold defense, no defensa absoluta.** Imposible blindarse contra todo. Posible — y suficiente — subir el costo del ataque por encima del retorno esperado del atacante. Es una decisión económica, no técnica.

Este encuadre es central para el resto de la clase: cada [[Mecanismos de seguridad|mecanismo]] aplicado luego se justifica por algún escenario del que **el costo del atacante crece**.

### Atributos de calidad — proceso de priorización

Candidatos enumerados en clase:
Performance, Security, Interoperability, Scalability, Availability, Usability, Precision.

**Ranking final acordado:**

1. **Security** — naturaleza financiera de los datos.
2. **Availability** — un mercado caído pierde dinero por minuto.
3. **Performance** — los traders esperan latencia mínima.
4. **Scalability** — picos de mercado requieren elasticidad.

Otros se mencionaron pero no entraron al top: Usability, Interoperability, Precision.

Ver [[Atributos de calidad]] para la definición de cada uno.

### Metodología demostrada — iteración por atributo

> *"Primero concentrarse en el problema principal y después atacar los accesorios o features secundarias."*
> (source: raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md)

El método de [[Attribute Driven Design]] se ejecuta en **iteraciones sucesivas**:

| Iteración | Enfoque | Resultado |
|---|---|---|
| **1ª — Sistemas externos** | Identificar componentes funcionales y bounded contexts externos. Sin todavía decisiones no funcionales. | Estructura base de cajas y conexiones. |
| **2ª — Atributo #1 (Security)** | Por cada escenario de amenaza, agregar el mecanismo correspondiente. | Arquitectura ya con WAF, MFA, sanitización, encriptación, segregación. |
| **3ª — Atributo #2 (Availability)** | Aplicar escenarios de Availability sobre la arquitectura ya endurecida. | (parcialmente desarrollado en clase) |
| **N-ésima** | Continuar con Performance, Scalability… | (pendiente) |

Es importante el **orden**: aplicar primero el atributo más prioritario, porque las decisiones de baja prioridad **no deben romper** las de alta. Si después de aplicar Availability se rompe Security, hay que rediseñar.

Esta metodología aterriza la idea más abstracta de [[Attribute Driven Design]]: el método no es un waterfall sino un **loop** sobre el [[Árbol de utilidad]] priorizado.

### 1ª iteración — Sistemas externos

(source: raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (3).png)

```
[User] ──┐
         ▼ (cloud)
         │
         ├──► [SPA1] ──► [LB] ──► [Back] ──► [SQL OLTP]
         │                          │
         └──► [SPA2] ──► [LB] ──────┘  ◄──── [BC1: Cotización]
                                       ◄──── [SMTP]
                                       ◄──VPN── [BC2: Ops]
[Ops] ───┘
```

Componentes:
- **Actores:** User (trader), Ops (operador interno).
- **Frontends:** SPA1 (cotización + compraventa), SPA2 (consola Ops).
- **Edge:** Load Balancer (Nginx en clase).
- **Backend:** Back monolítico.
- **Persistencia:** SQL OLTP — ver [[Bases de datos relacionales]].
- **Sistemas externos:** BC1 (Cotización, en VPN), BC2 (Ops externo, en VPN), SMTP (notificaciones).

### 2ª iteración — Aplicar Security

Mecanismos aplicados (catálogo en [[Mecanismos de seguridad]]):

| Escenario | Mecanismo |
|---|---|
| DDoS attack | **WAF** delante del LB |
| Robo de credenciales | **MFA** en login |
| Inyección (SQL/XSS) | **Sanitización** en cada endpoint |
| Leak físico de storage | **Encriptación at-rest** en SQL |
| Sniffing/MITM | **HTTPS** end-to-end + LB como reverse proxy |
| Acceso de Ops | Cluster **separado** + acceso por **VPN** |

Cambio estructural: la consola de Ops se mueve a infraestructura propia (Back + SQL OLTP propios, accedidos sólo via VPN). **Reduce blast radius** — vulnerabilidad pública no compromete Ops.

(source: raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (5).png)

### 3ª iteración — Aplicar Availability (incompleta en notas)

Decisiones tomadas hasta donde llegaron las notas:

- **BC1 (Cotización) ↔ Back:** WebSocket — conexión abierta persistente. Justificado por el patrón streaming continuo de cotizaciones.
- **Usuario → Back (parte de venta):** Request-Response instantáneo — operación discreta con confirmación.

> Las notas se cortan aquí. Falta completar las decisiones típicas de Availability: replicación de BD ([[Replicación de BD|primary-secondary vs primary-primary]]), failover, DR multi-DC, hot standby, kill switches en runaway algos.

## Decisiones clave discutidas

| Decisión                            | Opciones                              | Recomendación de la clase                    |
| ----------------------------------- | ------------------------------------- | -------------------------------------------- |
| Atributo dominante                  | Performance / Security / Availability | **Security** (datos financieros).            |
| Iterar por atributo o todo a la vez | Big-bang / Iterativo                  | **Iterativo** — orden estricto del ranking.  |
| Persistencia                        | SQL OLTP / NoSQL / In-memory          | **SQL OLTP** — integridad transaccional.     |
| Topología de Ops                    | Mismo cluster / Separado              | **Separado** vía VPN — reducir blast radius. |
| Edge protection                     | LB solo / WAF+LB                      | **WAF + LB**.                                |
| Login                               | Password solo / + MFA                 | **Password + MFA**.                          |
| Streaming de cotización             | Polling / WebSocket                   | **WebSocket**.                               |
| Posición en CAP                     | CP / AP                               | **CP** — no negociable en finanzas.          |

## Ejemplos vistos

- **Diagrama 1ª iteración** — sistemas externos sin atributos no funcionales (source: raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (3).png).
- **Diagrama 2ª iteración** — arquitectura con Security aplicada (source: raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (5).png): WAF en rojo, MFA en login, doble cluster con VPN para Ops.
- **WAF como Nginx** — el LB que actúa también como reverse proxy.
- **VPN** para todos los conectores externos confiables (BC1, BC2, OPS).

## Preguntas para el parcial

1. ¿Qué significa "threshold defense" en seguridad y por qué es una posición económicamente racional, no una claudicación?
2. Justificar por qué el atributo #1 de un mercado de acciones es Security y no Performance, dado que el caso de uso típico (matching) parece más sensible a latencia.
3. Enumerar 5 mecanismos de seguridad arquitectónicos y para cada uno identificar el escenario de amenaza concreto que los justifica.
4. Explicar por qué la consola de Ops se mueve a un cluster separado en la 2ª iteración. ¿Qué atributo se gana? ¿Qué se pierde?
5. ¿Por qué se elige WebSocket para cotizaciones y Request-Response para venta? Justificar con frecuencia y patrón de uso.
6. Diseñar la 3ª iteración (Availability) — ¿qué decisiones de [[Replicación de BD]], failover y multi-DC corresponden? ¿Conflictan con alguna decisión de la 2ª iteración?
7. Comparar la priorización de atributos del Caso Compraventa de Acciones vs el [[Caso Twitter — Big Data en tiempo real]]. ¿Por qué Twitter eligió diferente?
8. Aplicar [[Lightweight ATAM]] sobre la arquitectura final — identificar 3 sensitivity points y 2 tradeoff points.

## Lecturas complementarias

- Bass, Clements, Kazman — *Software Architecture in Practice*, caps. de Security y Availability.
- Anderson — *Security Engineering* (3ª ed., 2020) — referencia integral.
- OWASP Top 10, OWASP Cheat Sheet Series — mecanismos prácticos.
- Brewer — *CAP Twelve Years Later* (IEEE 2012) — para encuadrar la posición CP del dominio.
- NASDAQ INET architecture — caso real comparable de matching engine.
- LMAX Disruptor — patrón high-perf para order matching.
