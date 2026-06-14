---
title: "Evolución del deployment — VM, Containers, Kubernetes, Serverless"
aliases:
  - "Evolución del deployment — VM, Containers, Kubernetes, Serverless"
  - "Evolución del deployment"
  - "Containers"
  - "Kubernetes"
  - "Serverless"
  - "Máquinas virtuales"
type: concept
created: 2026-05-29
updated: 2026-05-29
tags: [deployment, containers, kubernetes, serverless, vm, microservicios, infraestructura]
sources:
  - "raw/classes/2026-05-28 - Clase 9/Clase 6.pdf"
related:
  - "[[Clase 9 — Integración de Sistemas / SOA / Microservicios]]"
  - "[[Microservicios]]"
  - "[[Service Mesh]]"
  - "[[Platform Engineering]]"
  - "[[Criterios de hosting y data residency]]"
---

# Evolución del deployment — VM, Containers, Kubernetes, Serverless

## La línea de tiempo

Cómo se empaqueta y ejecuta un servicio fue **bajando de peso** con el tiempo (source: raw/classes/2026-05-28 - Clase 9/Clase 6.pdf, slide 39):

| Época | Unidad | Hito |
|---|---|---|
| 1990s | **Máquina física** | — |
| 2006 | **Máquina virtual** | AWS EC2 |
| 2013 | **Container** | Docker |
| 2014 | **Serverless** | AWS Lambda |

El eje va de *heavyweight, permanent, manual* (físico) a *lightweight, ephemeral, automated* (serverless).

## Las opciones

### Physical machine / formato específico del lenguaje

Tradicional: el servicio corre como proceso (ej.: JVM) sobre la máquina, con *service runtime management* propio (slide 40). Máximo control, mínima densidad y automatización.

### Virtual Machine (Service-per-VM)

El deployment pipeline construye una **imagen de VM (AMI)** que **encapsula el stack tecnológico completo** de la app; se despliega en instancias (ej.: EC2) detrás de un **load balancer** en un **autoscaling group** (slide 41). Aislamiento fuerte, pero imágenes pesadas y arranque lento.

### Container (Service-per-Container)

El pipeline construye una **imagen de contenedor** (a partir de un *Dockerfile*) que se publica en un **registry** y se despliega como contenedores sobre VMs con un *container runtime* (slide 42). **Similar a una VM pero lightweight**: arranque en segundos, alta densidad, misma imagen de dev a prod.

### Containers + Kubernetes

Cuando hay muchos contenedores, hace falta un **orquestador**. **Kubernetes** (slide 43) simplifica su gestión:

- **Resource management** — administra los recursos presentando una sola máquina virtual lógica.
- **Scheduling** — decide dónde corre cada contenedor según necesidades de recursos y reglas.
- **Service management** — asegura que la cantidad deseada de instancias esté corriendo en todo momento (self-healing).

Componentes: *master* (API Server, Scheduler, Controller Manager, etcd) y *nodes* (kubelet, kube-proxy, pods).

### Serverless (FaaS)

Con **Serverless** (ej.: AWS Lambda, slide 44) **desaparece el concepto de máquina**: se desarrollan **sólo los servicios**, y el framework administra todos los recursos para ejecutarlos.

- **Pros:** no hay que administrar recursos, escala automáticamente, pago por uso.
- **Cons:** limitaciones de performance, no apto para procesos duraderos, trazabilidad más difícil, **lock-in con el proveedor**.

## Cómo decidir (lente de negocio)

No es "el más nuevo gana". El trade-off es **control vs gestión administrada**, **aislamiento vs densidad**, **portabilidad vs lock-in**:

- Procesos legacy/stateful con stack fijo → VM.
- Microservicios stateless a escala → Containers + Kubernetes (el default actual).
- Cargas event-driven, esporádicas, sin estado → Serverless (si se acepta el lock-in y los límites de performance).

Esto se conecta con la decisión de [[Criterios de hosting y data residency|hosting]] y se opera, a escala, vía [[Platform Engineering]]. La red entre estos servicios la resuelve un [[Service Mesh]].

## Pregunta a profundizar

¿Kubernetes es siempre la respuesta, o su complejidad operativa lo vuelve over-engineering para pocos servicios? ¿Cuándo un PaaS gestionado o serverless evita ese costo?

## Fuentes y lecturas

- Richardson — *Microservices Patterns*, cap. 12 (deployment).
- Burns et al. — *Kubernetes: Up and Running*.
- Documentación de Docker y Kubernetes.
