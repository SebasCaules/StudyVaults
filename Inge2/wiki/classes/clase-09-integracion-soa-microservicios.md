---
title: "Clase 9 — Integración de Sistemas / SOA / Microservicios"
type: class
created: 2026-05-29
updated: 2026-05-29
tags: [integracion, soa, microservicios, esb, patrones, arquitectura, deployment, ddd]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 8 — Consultas pre-parcial]]"
  - "[[Integración de sistemas]]"
  - "[[SOA — Service-Oriented Architecture]]"
  - "[[Microservicios]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Teorema CAP]]"
  - "[[Platform Engineering]]"
  - "[[TPE 2026-1C — Investigación y presentación de un tema]]"
---

# Clase 9 — Integración de Sistemas / SOA / Microservicios

> **Nota de numeración:** clase cronológica **9** (dictada el 2026-05-28, primera post-parcial). El deck de la cátedra se llama `Clase 6.pdf` porque numera por tema, no por fecha — ver nota en [[Inge2 Wiki Index|index]]. No confundir con la [[Clase 6 — Persistencia]] cronológica.

## TL;DR

Cómo una empresa **expone e integra sus funcionalidades de negocio** evolucionó del caos point-to-point al ESB, de ahí a [[SOA — Service-Oriented Architecture|SOA]] y finalmente a [[Microservicios|microservicios]]; no es moda, sino una escalera de **mayor business ownership, mayor desacoplamiento y audiencia más amplia**. SOA optimiza *integración + gobernanza*; microservicios optimiza *velocidad de cambio* — y para eso paga el precio de ser un sistema distribuido, lo que obliga a una batería de patrones nuevos (Saga, CQRS, Event Sourcing, API Gateway, Circuit Breaker, Service Mesh…) (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf).

## Mapa conceptual

- Evolución de la integración → [[Integración de sistemas]]
- Bus corporativo → [[ESB — Enterprise Service Bus]]
- Procesos y monitoreo → [[BPM y BAM]]
- Arquitectura orientada a servicios → [[SOA — Service-Oriented Architecture]]
- Composición de servicios → [[Orquestación vs Coreografía]]
- Arquitectura de microservicios → [[Microservicios]]
- Cómo partir el sistema → [[Descomposición en microservicios]]
- Unidad de consistencia → [[Aggregate (DDD)]]
- Datos por servicio → [[Database per Service]]
- Transacciones distribuidas → [[Patrón Saga]]
- Consultas → [[CQRS — Command Query Responsibility Segregation]]
- Historia como eventos → [[Event Sourcing]]
- Borde de la API → [[API Gateway]] · [[Backend for Frontend (BFF)]]
- Resiliencia de red → [[Circuit Breaker]] · [[Service Mesh]]
- Cómo se despliega → [[Evolución del deployment — VM, Containers, Kubernetes, Serverless]]

## Desarrollo

### 1. La tesis: integrar no es una moda, es exponer negocio

La clase arranca con una matriz 3×3 de **estrategias de integración**: eje vertical = alcance (Local / Enterprise / Public-Partner), eje horizontal = estilo (Batch-based / Event-based / Connected). Cada celda es una técnica (Batch Transfer Direct, Event-based Point to Point, Real-time Direct Access, Hub and Spoke, Enterprise/External API Exposure…) (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 2).

El hilo conductor del deck es histórico y está en los pies de slide: la integración evolucionó por necesidad de negocio, no por moda (lo respalda con Google Trends, slide 14). El detalle del arco vive en [[Integración de sistemas]]:

- **Principios 90s — Point-to-Point:** código de integración disperso entre ERP/CRM/BI/Billing/SCM/Legacy → alto acoplamiento, mantenimiento imposible, responsabilidades difusas.
- **Fines 90s — Integration Hub → [[ESB — Enterprise Service Bus|ESB]]:** un hub con *Adapters* (canonical integration: data translation, routing, composition) que se convierte en un bus corporativo con [[BPM y BAM|BPM/BAM]], Governance y Registry.
- **Principios 2000 — Service exposure:** Service Registry (design-time/runtime) y un Exposure Gateway que agrega virtualización, visibility, traffic management y security. Nace [[SOA — Service-Oriented Architecture|SOA]].
- **~2010 — API exposure:** REST/JSON fine-grained (vía Ajax) conviviendo con SOAP coarse-grained, separados por DMZ.
- **Post-2010 — External API + Microservicios:** cientos de "experimenters" externos, decenas de apps consumidoras.

La **escalera** que sintetiza todo (slide 15): *Low-level APIs → Application integration (ESB) → Service exposure (SOA) → Service/API exposure (API+SOA) → External API (API+Microservicios) → ¿Future?* — sobre un eje diagonal de **increased business ownership, increased decoupling, broadening audience**.

### 2. SOA — el modelo dominante de integración corporativa

[[SOA — Service-Oriented Architecture|SOA]] sigue siendo, dice el deck, el modelo más usado para integrar aplicaciones corporativas (slide 16). Sus piezas:

- **[[ESB — Enterprise Service Bus|ESB]]** como columna vertebral.
- **[[BPM y BAM]]**: BPM define y mejora procesos (con BPMN/BPEL); BAM los monitorea en tiempo real con umbrales y notificaciones.
- **Governance**: para que SOA funcione, varias apps comparten servicios comunes reutilizables — hay que coordinar definición, ciclo de vida, versionado, registry, modelo canónico de datos, ownership, testing y seguridad del servicio.
- **Granularidad**: servicios de *grano fino* (base de negocio) vs *grano grueso* (compuestos). Se componen por [[Orquestación vs Coreografía|orquestación (desde el ESB) o coreografía (entre servicios)]].

**El límite de SOA** (slide 16): resuelve integración satisfactoriamente, pero queda corto en **escalabilidad, fault tolerance, desarrollo rápido y deployments frecuentes**. Ese límite es justamente lo que empuja a microservicios.

### 3. El pivote — SOA vs Microservicios

La frase bisagra de la clase (slide 17):

> Mientras **SOA** resuelve primero un problema de **integración** y luego de **gobernanza**, **microservicios** busca ante todo permitir a las organizaciones **crecer e ir más rápido**.

Es decir: **distinta motivación de negocio**, no sólo distinta tecnología. El argumento se cuantifica con métricas **DORA** (2017 State of DevOps, Puppet+DORA, slide 18): los *high IT performers* despliegan **46×** más seguido, con **440×** menos lead-time (Netflix: 16 minutos de commit a producción) y recuperan **24×** más rápido ([[MTBF y MTTR|MTTR]]).

Y el triángulo que ordena todo (slide 21): **Arquitectura** (microservicios) + **Organización** (equipos chicos y autónomos) + **Procesos** (DevOps / Continuous Delivery) → *entrega rápida y confiable de software*. Es la **Ley de Conway** operando: la arquitectura habilita la estructura de equipos y viceversa.

Pero microservicios **no es gratis** (slide 22): definir bien los servicios es difícil, hay múltiples bases de datos (¿cómo se coordina la transaccionalidad?), es un sistema distribuido con complejidad de desarrollo/testeo/deployment, y los features cross-servicio exigen deploy coordinado. → *Decidir prudentemente cuándo usarlos* (el anti-*silver-bullet* de Brooks, ver [[Anti-patrones de parcial]]).

### 4. Nuevos patrones para nuevos problemas

El deck adopta el catálogo de **Chris Richardson** (microservices.io), organizado en tres familias (slide 23):

**Application / Data patterns** — qué hacer con el dominio y los datos:
- [[Descomposición en microservicios]] (por business capability / por subdominio; ejemplo financiero **BIAN**).
- [[Aggregate (DDD)|Aggregates]] como unidad de consistencia.
- [[Database per Service]] (vs base compartida y su problema de *noisy neighbours*).
- [[Patrón Saga]] — secuencia de transacciones locales + compensaciones, reemplazo del 2PC.
- [[CQRS — Command Query Responsibility Segregation|CQRS]] — view-DB read-only alimentada por eventos.
- [[Event Sourcing]] — persistir la historia como secuencia de eventos.

**Communication patterns** — cómo hablan entre sí y con el mundo:
- [[API Gateway]] (ruteo, composición, traducción de protocolo, auth/rate-limit/caching en el borde).
- [[Backend for Frontend (BFF)]].
- [[Circuit Breaker]] (corta el efecto bola de nieve) — implementable a nivel app o vía [[Service Mesh]].

**Infrastructure patterns** — cómo se despliega y se descubre:
- [[Evolución del deployment — VM, Containers, Kubernetes, Serverless]]: Physical (90s) → VM (EC2, 2006) → Container (Docker, 2013) → Serverless (Lambda, 2014), con Kubernetes orquestando contenedores y el Sidecar/[[Service Mesh]] como capa de red.

### 5. El punto de partida: el monolito hexagonal

El deck usa el caso **FTGO** (food-to-go, de Richardson): un monolito bien hecho, con [[Estilos arquitectónicos|arquitectura hexagonal]] y adapters (REST, Web UI, Twilio, Amazon SES, Stripe, MySQL) (slides 19-20). El punto pedagógico es honesto: **el monolito no es el villano** — es un punto de partida razonable. Se vuelve problema *a escala*: código complejo, commit-a-deploy lento, difícil de escalar y de tolerar fallas, cautivo de un stack potencialmente obsoleto, con overhead de coordinación entre equipos grandes sobre una sola base de código.

## Decisiones clave discutidas

| Decisión | Opciones | Criterio | Recomendación cátedra |
|---|---|---|---|
| Cómo integrar sistemas | Point-to-point / Hub-ESB / SOA / API-Microservicios | Acoplamiento, audiencia, ownership | Subir la escalera según necesidad; no saltar a microservicios por moda |
| SOA vs Microservicios | SOA / Microservicios | ¿El problema es **integrar+gobernar** o **ir rápido**? | SOA si el driver es integración corporativa; microservicios si el driver es velocidad/escala y la org banca la complejidad distribuida |
| Datos en microservicios | Shared DB / Database-per-Service | Acoplamiento vs autonomía y *noisy neighbours* | [[Database per Service]] (autonomía), asumiendo el costo de consistencia |
| Consistencia distribuida | 2PC / [[Patrón Saga|Saga]] | Disponibilidad vs consistencia fuerte ([[Teorema CAP|CAP]]) | Saga con transacciones de compensación; el **orden importa** |
| Composición de servicios | [[Orquestación vs Coreografía|Orquestación]] / Coreografía | Control central vs autonomía/desacoplamiento | Depende: orquestación da visibilidad; coreografía desacopla |
| Resiliencia de red | Nada / Timeouts+Retries / [[Circuit Breaker]] | Evitar el efecto bola de nieve | Circuit breaker (app o [[Service Mesh]]) |
| Cómo desplegar | VM / Container / K8s / Serverless | Peso, control, escala, lock-in | Según escala y madurez; ver [[Evolución del deployment — VM, Containers, Kubernetes, Serverless|trade-offs]] |

## Ejemplos vistos

- **FTGO** (Richardson) — monolito hexagonal → descomposición por subdominios (Order, Delivery, Kitchen, Accounting), Saga sobre Order/Consumer/Kitchen/Accounting, CQRS para Order History (slides 19-33).
- **BIAN** (bian.org) — mapa de capacidades de negocio de la industria financiera como ejemplo de descomposición por business capability (slides 26-27).
- **DORA / Netflix** — métricas de los high performers como justificación de negocio de microservicios (slide 18).

## Preguntas para el final / parcial

1. ¿Por qué el deck dice que la integración "no es una moda"? Explicá la escalera de exposición de funcionalidades de negocio y sus tres ejes.
2. ¿Cuál es la diferencia *de motivación* entre SOA y microservicios? ¿Qué atributo de calidad optimiza cada uno?
3. ¿Qué problemas nuevos introduce microservicios respecto del monolito, y qué patrón resuelve cada uno (transaccionalidad, consultas, resiliencia de red, descubrimiento)?
4. ¿Por qué una [[Patrón Saga|Saga]] reemplaza al 2PC y qué relación tiene con el [[Teorema CAP]]?
5. ¿Cuándo NO conviene microservicios? Justificá con las desventajas de la slide 22 y con Conway.
6. Explicá el triángulo Arquitectura/Organización/Procesos. ¿Por qué microservicios sin DevOps y equipos autónomos no rinde?
7. ¿Qué hace un [[API Gateway]] que no debería hacer cada microservicio por su cuenta?

## Lecturas complementarias

- Richardson, *Microservices Patterns* (Manning) — bibliografía oficial del deck.
- https://microservices.io/ — catálogo de patrones.
- Newman, *Building Microservices* (O'Reilly).
- Hohpe, Woolf, *Enterprise Integration Patterns* (para SOA/ESB).
- Skelton, Pais, *Team Topologies* (para el triángulo org/arquitectura).
- Conway (1968), "How Do Committees Invent?" (Ley de Conway).
