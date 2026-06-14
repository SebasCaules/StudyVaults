---
title: Estilos arquitectónicos (catálogo)
aliases:
  - "Estilos arquitectónicos (catálogo)"
  - "Estilos arquitectónicos"
  - "Catálogo de estilos"
  - "POSA"
  - "Pipes and Filters"
  - "Pipes & Filters"
  - "Batch Sequential"
  - "Hierarchical Layers"
  - "Layers"
  - "Broker"
  - "Broker pattern"
  - "Publish-Subscribe"
  - "Pub-Sub"
  - "Client-Dispatcher-Server"
  - "Forwarder-Receiver"
  - "Peer-to-Peer"
  - "P2P"
  - "Reflection"
  - "Microkernel / Plug-in"
  - "Microkernel"
  - "Blackboard"
  - "MVC"
  - "MVC — Model View Controller"
  - "MVP"
  - "MVP — Model View Presenter"
  - "MVVM"
  - "MVVM — Model View ViewModel"
  - "PAC"
  - "PAC — Presentation Abstraction Control"
  - "VIPER"
  - "SEP — Simple Event Processing"
  - "Single Event Processing"
  - "CEP — Complex Event Processing"
  - "Complex Event Processing"
  - "OLEP — Online Event Processing"
  - "Online Event Processing"
  - "STREP — Stream Event Processing"
  - "Stream Event Processing"
type: concept
created: 2026-04-22
updated: 2026-04-22
tags: [arquitectura, estilos, patrones, catalogo, pohl]
sources:
  - "raw/classes/Clase 2.pdf"
related:
  - "[[Clase 2 — Construcción de la arquitectura]]"
  - "[[Attribute Driven Design]]"
  - "[[Arquitectura de software — definición]]"
  - "[[ADR — Architecture Decision Record]]"
---

# Estilos arquitectónicos (catálogo)

## ¿Qué es un estilo?

Un **estilo arquitectónico** (o **pattern arquitectónico**) es una solución reutilizable a un problema recurrente de organización de componentes, con trade-offs conocidos. Es el vocabulario con el que se construye arquitectura — elegir un estilo es tomar una decisión arquitectónica significativa (source: raw/classes/Clase 2.pdf).

Referencia clásica: **Buschmann, Meunier, Rohnert, Sommerlad, Stal — Pattern-Oriented Software Architecture (POSA)** serie.

## Clasificación por familia

### 1. Dataflow (orientados al flujo de datos)

Los componentes se organizan alrededor de **transformaciones sucesivas de datos**.

- **[[Batch Sequential]]** — cada etapa procesa el dataset completo y lo pasa a la siguiente. Ejemplo: ETL nocturnos, procesamiento mainframe.
- **[[Pipes and Filters]]** — filtros (componentes) conectados por pipes (streams). Cada filtro lee, transforma, escribe. Composable, paralelizable. Ejemplo: Unix pipes, Apache NiFi.
- **[[Hierarchical Layers]]** — capas ordenadas donde cada una usa sólo la inmediata inferior. Ejemplo: OSI networking, capas clásicas de app (presentación, lógica, datos).

### 2. Distributed (orientados a sistemas distribuidos)

Los componentes están **separados por red**, coordinan su interacción.

- **[[Broker]]** — componente intermediario coordina la comunicación entre clientes y servidores. Ejemplo: CORBA, message brokers (RabbitMQ, Kafka).
- **[[Publish-Subscribe]]** — emisores publican eventos; receptores se suscriben por tópico. Desacopla temporalmente. Ejemplo: Kafka, Redis Pub/Sub, MQTT.
- **[[Forwarder-Receiver]]** — intermediarios (forwarder, receiver) encapsulan detalles de la comunicación de red.
- **[[Client-Dispatcher-Server]]** — el dispatcher resuelve qué server atiende qué cliente. Precursor del service discovery moderno.

### 3. Interactive (orientados a UI)

Separan **presentación**, **lógica de control** y **datos**.

- **[[MVC — Model View Controller]]** — clásico. Modelo (datos), Vista (UI), Controlador (lógica de entrada).
- **[[PAC — Presentation Abstraction Control]]** — composición jerárquica de agentes PAC. Útil en interfaces complejas con sub-ventanas independientes.
- **[[MVP — Model View Presenter]]** — variante de MVC donde el Presenter maneja toda la lógica y la Vista es pasiva. Facilita testing.
- **[[MVVM — Model View ViewModel]]** — ViewModel expone estado databindeable a la Vista. Popular en WPF, Angular, Vue.
- **[[VIPER]]** — View/Interactor/Presenter/Entity/Router. Arquitectura iOS modular.

### 4. Event-based (orientados a eventos)

Componentes que reaccionan a **eventos** asincrónicos.

- **[[SEP — Simple Event Processing]]** — cada evento se procesa individualmente. Ejemplo: listeners clásicos en GUI.
- **[[STREP — Stream Event Processing]]** — procesamiento en streams continuos (ventanas temporales, agregados). Ejemplo: Apache Flink, Kafka Streams.
- **[[CEP — Complex Event Processing]]** — detecta patrones complejos entre múltiples eventos (ej: "3 intentos fallidos en 60s desde misma IP").
- **[[OLEP — Online Event Processing]]** — Kleppmann (2019) — usa un event log como fuente de verdad, servicios derivan estado de él.

### Otras familias mencionadas

- **[[Peer-to-Peer]]** — nodos equivalentes intercambian trabajo/datos sin servidor central.
- **[[Blackboard]]** — espacio de conocimiento compartido donde múltiples solvers trabajan cooperativamente. Usado en IA clásica.
- **[[Microkernel / Plug-in]]** — core mínimo + extensiones. Ejemplo: Eclipse, VSCode, kernels OS.
- **[[Reflection]]** — el sistema razona sobre sí mismo y puede cambiarse en runtime.

## Estilos compuestos / macro-arquitecturas

A veces se llaman "estilos" cuando en realidad son **combinaciones** de los anteriores aplicadas a nivel de sistema completo:

- **Monolítico** — todo en un proceso. Suele usar Hierarchical Layers internamente.
- **Microservicios** — múltiples servicios con Broker/Pub-Sub/REST, típicamente cada uno con layers internos.
- **Serverless (FaaS)** — funciones reactivas a eventos, típicamente event-based.
- **Event-Driven Architecture (EDA)** — pub-sub + CEP como columna vertebral del sistema.
- **CQRS + Event Sourcing** — separa lectura/escritura con OLEP de backing store.
- **Hexagonal / Clean / Onion** — variaciones de Layers con énfasis en independencia del dominio.

## Cómo elegir

Para cada decisión arquitectónica de estilo, aplicar [[Attribute Driven Design]]:

1. Identificar atributos de calidad priorizados.
2. Para cada estilo candidato, evaluar qué atributos soporta/compromete.
3. Hacer explícitos los trade-offs.
4. Elegir el que mejor cubre los drivers dominantes.

### Tabla de preferencia por atributo dominante

| Atributo dominante | Estilo típicamente favorecido |
|---|---|
| Performance (latencia baja) | Hierarchical Layers, in-process calls |
| Scalability horizontal | Pub-Sub, Broker, Microservicios |
| Availability / Fault tolerance | Pub-Sub con replicación, Peer-to-Peer |
| Maintainability | Layers, MVC/MVP/MVVM, Microkernel |
| Evolvability | Event-driven + CQRS, Microkernel |
| Throughput batch | Batch Sequential, Pipes and Filters |
| Real-time analytics | STREP, CEP |
| Audit y reproducibilidad | OLEP / Event Sourcing |

## Anti-patrones

- **"Microservicios por default"** — adopción sin necesidad dispara complejidad operacional desproporcionada.
- **Layers estrictos para sistemas event-driven** — fuerzan una forma que no encaja.
- **MVC "servido por libros de texto"** — variantes modernas (MVP/MVVM) suelen ser mejores para testing.
- **Mezclar estilos sin justificación** — cada estilo agrega complejidad; combinar 4 porque "son modernos" es caos.

## Pregunta a profundizar

¿Cómo documentar la **elección** y la **evolución** de estilo a lo largo del ciclo de vida? Los [[ADR — Architecture Decision Record]] son el canal típico, pero ¿cómo capturan que un estilo fue correcto inicialmente y dejó de serlo?

## Fuentes y lecturas

- Buschmann et al. — *Pattern-Oriented Software Architecture (POSA), Vol 1-5*.
- Bass, Clements, Kazman — *Software Architecture in Practice*.
- Kleppmann — *Designing Data-Intensive Applications* — estilos data-flow modernos.
- Richards, Ford — *Fundamentals of Software Architecture*.
