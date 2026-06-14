---
title: "Caso mock — Logística de última milla a escala"
aliases:
  - "Caso mock — Logística"
  - "Mock última milla"
type: case-study
created: 2026-05-13
updated: 2026-05-13
tags: [case-study, mock, parcial, logistica, marketplace, microservicios, bounded-contexts, etl]
sources:
  - "study/js/data/mock-cases.js"
related:
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Partition, Replicate, Index]]"
  - "[[Off-line vs Online computation]]"
  - "[[OLAP y ETL]]"
  - "[[Bases de datos relacionales]]"
  - "[[Bases no relacionales]]"
  - "[[Principio de localidad]]"
  - "[[Architectural Guardrails]]"
  - "[[Enunciados de parciales — 6 casos]]"
---

# Caso mock — Logística de última milla a escala

## Por qué este caso está en el wiki

Caso mock de parcial curado por el wiki. Plantea explícitamente la pregunta **"¿microservicios sí o no?"** en un contexto realista de scaleup (25 → 90 ingenieros, monolito Python que cruje). Forza al alumno a hablar de [[Bounded contexts]] antes que de microservicios y de [[OLTP vs OLAP|separación OLTP/OLAP]]. Alimenta el [[Generador de casos mock de parcial|generador]].

> Caso **sintético**. Inspirado en empresas reales de logística asset-light en Latinoamérica (sin describir ninguna en particular). No citar como hecho específico.

## Dominio

Plataforma de logística de última milla — recolección, ruteo, asignación de conductores, tracking en vivo del paquete, integración con e-commerce y carriers.

## Contexto del enunciado

Una startup de logística que comenzó hace 3 años atendiendo a pequeños vendedores ahora factura **USD 80M anuales** y opera en 6 ciudades del Cono Sur. El modelo es **asset-light**: no tiene flota propia, sino que coordina **8.000 conductores independientes** (motos, autos, utilitarios) que toman pedidos vía app.

Atiende dos segmentos:

- **(a) E-commerce same-day** para grandes retailers (volumen alto, márgenes finos).
- **(b) Entregas express** para restaurantes y comercios locales (volumen masivo, ventana corta, propinas variables).

Volumen actual: **200.000 entregas/día** con pico de **35.000 entregas/hora** los viernes 19-22 hs. Cada entrega genera **~150 eventos** (creado, asignado, recogido, en tránsito, geolocalización cada 30 s, entregado, calificado).

Los retailers exigen API estable y SLAs estrictos; los restaurantes quieren simplicidad y precio bajo. Los conductores son independientes y migran a competidores si la app es mala o el matching es injusto.

El equipo crece rápido (de 25 a 90 ingenieros en 18 meses) y el **monolito Python** que arrancó el proyecto está mostrando grietas: deploys lentos, latencias intermitentes, equipos pisándose. El CTO debate si separar en microservicios o refactor interno; el board pide más features y los inversionistas vigilan los costos de cloud que crecen más rápido que los ingresos.

## Stakeholders

- Compradores / consumidores finales
- Vendedores / comercios (retailers grandes y pequeños comercios)
- Conductores independientes (gig workers)
- Equipo de operaciones (incidentes en vivo)
- Equipo de pricing / matching
- Equipos de producto por segmento (retail vs restaurantes)
- Equipo de finanzas (cobranza B2B, settlement)
- Soporte al cliente
- Equipo legal (regulación gig economy)
- Inversionistas (unit economics, costo cloud, churn)
- Carriers tradicionales (Andreani, OCA — eventualmente sub-contratados)

## Atributos de calidad priorizados

> Tomados **exclusivamente** de la tabla ISO 25000 de la cátedra (ver [[Atributos de Calidad — tabla ISO 25000 (cátedra)]]). *Modifiability* es el nombre que usa Bass-Clements-Kazman; la cátedra usa `Maintainability`. *Integration* se subsume en `Interoperability`. *Cost-efficiency* y *data-driven product* son restricciones de negocio, no atributos.

1. **Scalability** — picos 5× sobre carga media; crecimiento 100% anual sostenido.
2. **Performance** — matching conductor-pedido < 5 s; geolocalización propagada < 10 s.
3. **Availability** — un viernes 20 hs caído cuesta millones y genera churn de conductores.
4. **Maintainability** — 9 squads avanzando en paralelo sobre el monolito sin bloquearse.
5. **Interoperability** — APIs estables con docenas de retailers; carriers heterogéneos (Andreani, OCA).
6. **Reliability** — cada entrega perdida es historia en redes y dinero perdido.
7. **Auditability** — eventos detallados alimentan pricing, matching y resolución de disputas.
8. **Supportability** — soporte al cliente y operaciones requieren diagnóstico rápido en vivo.

## Decisiones arquitectónicas curadas

| Decisión | Rationale |
|---|---|
| **Bounded contexts** (Pedidos, Matching, Tracking, Pagos a conductores, Facturación a comercios) **antes de microservicios** | Microservicios prematuros con un equipo de 25 son suicidio; bounded contexts dentro del monolito permiten autonomía sin overhead operativo. Cuando los contextos son estables y los equipos chocan, recién entonces se extraen. |
| **Tracking en pipeline event-driven** (Kafka → time-series store), separado del CRUD | 150 eventos × 200K entregas = 30M eventos/día. Acoplarlos al RDBMS operacional destruye performance. Patrón Kallen: [[Partition, Replicate, Index]]. |
| **Matching como servicio dedicado** con feature store en Redis (estado de conductores, demanda por zona) | Matching tiene perfil de latencia y carga radicalmente distinto al CRUD; necesita motor in-memory propio. |
| **API pública por segmento** — una para retailers (estable, contratada, SLAs) y otra para comercios (lightweight, evolutiva) | Mismo API para audiencias incompatibles genera fricción. Cada API evoluciona a su propio ritmo. |
| **ETL nocturno** desde stream a data warehouse; analítica nunca toca operacional | Reportes consultan TBs históricos; el OLTP de operación no puede sostener queries analíticas. [[OLAP y ETL\|OLTP vs OLAP]] separados. |
| **Auto-scaling agresivo por zona horaria y día** (viernes 19 hs ≠ martes 10 hs) | Cost-efficiency exige pagar por capacidad real, no por pico permanente. |
| **App de conductor offline-tolerant**: pedidos activos cacheados, eventos enqueued y sincronizados al volver red | Conductores entran a sótanos, túneles, zonas sin cobertura. |

## Lecciones aprendidas

1. **Bounded contexts antes que microservicios**; microservicios sin bounded contexts es deuda con extra-overhead.
2. **Tracking en time-series stream separado del CRUD** es regla, no excepción.
3. **OLTP vs OLAP separados** — la analítica no puede acoplarse al checkout.
4. **Multi-API por segmento** cuando las audiencias evolucionan a ritmos distintos.
5. **Auto-scaling por patrón temporal** es el lever principal de cost-efficiency.
6. **Offline-first en apps de campo** cuando la conectividad es la norma, no la excepción.
7. **Matching con perfil de latencia propio** merece motor in-memory dedicado.
8. Crecer de 25 a 90 ingenieros sin guardrails reproduce el problema en lugar de resolverlo.

## Trampas y anti-patrones

- Saltar a microservicios con 25 ingenieros (overhead supera al beneficio).
- Persistir 30M eventos de tracking por día en el RDBMS operacional.
- Mismo endpoint API para retailer enterprise y app de comercio chico.
- Reportes ejecutivos consultando producción (matan latencias de checkout).
- Cluster siempre escalado al pico (cost-efficiency destruida).
- App online-only para conductor (10% en zonas sin cobertura churnea).
- Refactor "big bang" del monolito (deadline político, riesgo enorme).
- Optimizar pricing sin event log granular (decisiones a ciegas).

## Pregunta a profundizar

¿Cuándo un bounded context "merece" extraerse a microservicio? ¿Cuál es el criterio (volumen, equipo, frecuencia de deploy, contrato de SLA) y cuál es la trampa de la respuesta "depende"?

## Cómo se usa este caso

Sorteado por el [[Generador de casos mock de parcial|generador]]. Caso ideal para discutir [[BDUF vs YAGNI vs JEDUF]] aplicado a microservicios y para presionar la diferencia entre **decomposición lógica** (bounded contexts) y **decomposición física** (microservicios).
