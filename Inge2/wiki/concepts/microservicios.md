---
title: "Microservicios"
aliases:
  - "Microservicios"
  - "Microservices"
  - "Arquitectura de microservicios"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [microservicios, arquitectura, distribuido, devops, conway, escalabilidad]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[SOA — Service-Oriented Architecture]]"
  - "[[Descomposición en microservicios]]"
  - "[[Database per Service]]"
  - "[[Patrón Saga]]"
  - "[[API Gateway]]"
  - "[[Circuit Breaker]]"
  - "[[Service Mesh]]"
  - "[[Evolución del deployment — VM, Containers, Kubernetes, Serverless]]"
  - "[[Platform Engineering]]"
  - "[[MTBF y MTTR]]"
  - "[[Anti-patrones de parcial]]"
---

# Microservicios

## Qué es

Una arquitectura de **microservicios** estructura una aplicación como un conjunto de **servicios pequeños, autónomos y desplegables de forma independiente**, cada uno dueño de su propio dominio y sus propios datos ([[Database per Service]]). Es el mecanismo de integración predilecto de las organizaciones modernas con software propietario (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 17).

## La diferencia que importa: SOA vs Microservicios

La frase bisagra de la [[Clase 9 — Integración de Sistemas / SOA / Microservicios|clase]] (slide 17):

> Mientras [[SOA — Service-Oriented Architecture|SOA]] busca resolver **primero integración y luego gobernanza**, microservicios busca ante todo permitir a las organizaciones **crecer e ir más rápido**.

No es "SOA mejorado": tiene **otra motivación de negocio**. El atributo de calidad que optimiza es la **velocidad de cambio** (time-to-market, deployments frecuentes, escala independiente), no la integración corporativa.

## El triángulo: moverse rápido sin romper nada

Microservicios solo rinde si se acompaña de organización y proceso (slide 21):

```
            Arquitectura
           (Microservicios)
                 ▲
       permite / \ permite
              /   \
   Organización   Procesos
  (equipos chicos  (DevOps, CD/CD)
   y autónomos)
                ↓
   Entrega rápida y confiable de software
```

Es la **Ley de Conway** en acción: la arquitectura en servicios habilita equipos pequeños y autónomos, que a su vez necesitan DevOps y Continuous Delivery para desplegar sin pisarse. Microservicios **sin** equipos autónomos ni CD no da velocidad — solo da un monolito distribuido (lo peor de los dos mundos).

## La justificación de negocio: métricas DORA

El argumento cuantitativo (2017 State of DevOps, Puppet + DORA, slide 18). Los *high IT performers* vs los *low*:

| Métrica | Ventaja high performers |
|---|---|
| Deployment frequency | **46×** (on-demand, varios deploys por día) |
| Lead time for changes | **440×** (< 1 hora; Netflix: 16 minutos) |
| Mean Time To Recover ([[MTBF y MTTR|MTTR]]) | **24×** (< 1 hora) |

## Desventajas (cuándo NO)

La clase es explícita en que microservicios **no es gratis** (slide 22):

- No es fácil **definir correctamente los servicios** (ver [[Descomposición en microservicios]]).
- **Múltiples bases de datos** → ¿cómo se coordina la transaccionalidad? (ver [[Patrón Saga]]).
- Es un **sistema distribuido**: complejidad de desarrollo, testeo y deployment.
- Los **features que impactan múltiples servicios** exigen deploy coordinado.

> Se debe decidir **prudentemente** cuándo usar microservicios, porque existen *complejidades de implementación*.

En organizaciones chicas o dominios simples, microservicios es **over-engineering** — un monolito hexagonal bien hecho (como el FTGO de la clase) es mejor punto de partida. Saltar a microservicios por moda es un anti-pattern (ver [[Anti-patrones de parcial]] y Brooks, "No Silver Bullet").

## Familias de patrones

Microservicios trae "nuevos patrones para nuevos problemas" (catálogo de Richardson, microservices.io):

- **Application/Data**: [[Descomposición en microservicios]], [[Aggregate (DDD)]], [[Database per Service]], [[Patrón Saga]], [[CQRS — Command Query Responsibility Segregation|CQRS]], [[Event Sourcing]].
- **Communication**: [[API Gateway]], [[Backend for Frontend (BFF)]], [[Circuit Breaker]], [[Service Mesh]].
- **Infrastructure**: [[Evolución del deployment — VM, Containers, Kubernetes, Serverless]], apoyada en [[Platform Engineering]].

## Pregunta a profundizar

¿Cuándo conviene arrancar monolito y migrar después (Strangler Fig) vs nacer con microservicios? ¿Qué señales de negocio (tamaño de org, frecuencia de deploy bloqueada, escalado desparejo) justifican el salto?

## Fuentes y lecturas

- Richardson — *Microservices Patterns* (Manning).
- Newman — *Building Microservices* (O'Reilly).
- Fowler — "Microservices" (martinfowler.com).
- Conway (1968) — Ley de Conway.
