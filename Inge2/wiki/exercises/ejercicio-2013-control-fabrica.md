---
title: "Ejercicio 2013 — Sistema de control de fábrica con sensores serie"
aliases:
  - "Ejercicio 2013 — Sistema de control de fábrica con sensores serie"
  - "Ejercicio 2013"
  - "Control de fábrica"
type: exercise
created: 2026-04-22
updated: 2026-05-12
tags: [ejercicio, parcial, 2013, iot, scada, sensores, fabrica, producer-consumer, heartbeat]
sources:
  - "raw/exercises/Ejercicio 2013.pdf"
  - "raw/classes/2026-04-09 - Clase 4/clase4.pdf"
related:
  - "[[Atributos de calidad]]"
  - "[[Árbol de utilidad]]"
  - "[[Attribute Driven Design]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Katas de Arquitectura]]"
  - "[[ATAM]]"
  - "[[SLA, SLO, SLI]]"
  - "[[MTBF y MTTR]]"
  - "[[Enunciados de parciales — 6 casos]]"
  - "[[Cross challenge — 3 casos]]"
  - "[[TP general]]"
  - "[[Lightweight ATAM]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Pipes and Filters]]"
  - "[[Publish-Subscribe]]"
  - "[[MVC]]"
---

# Ejercicio 2013 — Sistema de control de fábrica con sensores serie

## Enunciado (resumen)

Una empresa industrial debe instrumentar su planta con **sensores conectados por puerto serie**. El sistema debe leer, agregar, presentar y archivar las mediciones, con alta disponibilidad y detección temprana de anomalías (source: raw/exercises/Ejercicio 2013.pdf).

El ejercicio tiene 6 incisos (a-f) que exigen aplicar distintas prácticas arquitectónicas.

## Dominio

- **Sensores** en campo, típicamente RS-232/RS-485, con latencias de comunicación variables y tendencia a *hangs* transitorios.
- **Planta productiva** que depende del sistema para operar — parada = pérdida económica significativa.
- **Operadores** monitorean métricas en tiempo real.
- **Ingeniería** analiza series históricas para mejorar procesos.
- **Compliance** puede exigir trazabilidad de mediciones.

## Los incisos (interpretación a partir de la fuente)

### (a) Análisis de stakeholders y atributos de calidad

Identificar los stakeholders y, para cada uno, los atributos de calidad que les importan:

| Stakeholder | Atributos de calidad |
|---|---|
| Operadores de planta | Availability, Usability, Performance (tiempo real) |
| Ingeniería de proceso | Reliability de datos, Precision, Auditability |
| IT / Mantenimiento | Manageability, Supportability, Portability (a nuevos sensores) |
| Dirección | Costos, time-to-market |
| Compliance | Auditability, Security (integridad de lecturas) |

### (b) Construir [[Árbol de utilidad]]

Raíz → atributos dominantes (Availability, Reliability, Performance) → features → escenarios concretos con (importancia, dificultad).

Ejemplos de escenarios hoja:
- "Ante desconexión transitoria de un sensor, el sistema detecta en < 5s y marca el dato como faltante sin caerse" — (H, M).
- "El dashboard operacional actualiza lecturas de 1000 sensores en < 2s" — (H, H).
- "Trazabilidad completa de mediciones con firma digital durante auditorías" — (M, M).

### (c) Arquitectura propuesta — desarrollo en clase (2026-04-09)

El profesor desarrolla este ejercicio en pizarra durante la [[Clase 4 — ¿Cuándo diseñamos?]] (source: raw/classes/2026-04-09 - Clase 4/clase4.pdf). La selección priorizada de atributos en el pizarrón fue:

1. **Reliability** (sistema ACL, control de acceso).
2. **Precision** (errores tipo 1 y 2 en detección de anomalías).
3. **Performance** (velocidad de sensado).
4. **Interoperability** (cambios de hardware, sensores nuevos).

Y la arquitectura candidata desarrollada:

```
       ┌─────────┐                            ┌─────────────┐
       │ Webapp  │       ┌─────────┐          │  Daemon     │
Usr ──→│  (MVC)  │ ────→ │ Reportes│          │  (sin UI)   │
       └─────────┘       └────┬────┘          │             │  ┌──┐
                              │               │  ┌────────┐ │──│S1│
                              ▼               │  │ Poller │ │  └──┘
                          ┌───────┐           │  └────┬───┘ │  ┌──┐
                          │  DB   │ ◄──── ┌───┴────┐  │ HB  │──│S2│
                          └───┬───┘       │Processor│ │     │  └──┘
                              ▲           └────┬────┘  │     │  ┌──┐
                              │                │       │  ┌──┴─┐│S3│
                              │                ▼       │  │Pol-│ └──┘
                              │           ┌────────┐   │  │ler │ ...
                              └───────────│ Alarma │   │  └──┬─┘ ┌──┐
                                          └────────┘   └─────┴───│SN│
                                       Productor-Consumidor      └──┘
```

Componentes y responsabilidades:

| Componente | Responsabilidad |
|---|---|
| **Sensores S1…SN** | Lectura física en campo (RS-232/485 o equivalente). Sistema externo (sin control sobre su firmware). |
| **Pollers** (≥2, redundantes) | Conectados a los sensores; lectura periódica. Implementan **timeout** y **heartbeat** entre sí para detectar caída del par y tomar el control sin downtime. |
| **Daemon (sin UI)** | Contenedor que orquesta los pollers. Sin interfaz humana — sólo procesamiento. |
| **Processor** | Recibe los datos del daemon (vía Producer-Consumer), aplica reglas, decide alarmas, persiste en DB. |
| **Alarma** | Output del processor cuando detecta condición crítica. |
| **DB** | Persistencia compartida entre processor (escritura) y módulo de reportes (lectura). |
| **Webapp (MVC)** | Interfaz humana para operadores: dashboards, reportes históricos. |

Notas tomadas en pizarra (source: raw/classes/2026-04-09 - Clase 4/clase4.pdf):
- *Poller → timeout local → publica → error*
- *2do timeout → SLO + alerta*
- *Processor → guarda datos en alguna tabla o central → publica.*
- *Colocación de "n equipos electrofísicos" lleva → metricas a central.*
- **Mecanismos auxiliares anotados:** *Mensaje schema → TTL*, *cluster*, *redirect order*, *deep loops*, *prelaring volatil*, *fallback solidum/abierto (golpe a cierres)*, *p/with FIFO* (interpretación: queues con FIFO, fallback solid/abierto = circuit breaker, prelaring volatil = pre-warm caches volátiles).

> **Por qué Pollers redundantes con Heartbeat:** Reliability es el atributo #1. Un único Poller es SPOF; dos con heartbeat resuelven la falla del Poller sin perder muestras. El costo es complejidad de coordinación (¿quién toma el lock cuando ambos están vivos?), típicamente resuelto con leader election o lock distribuido.

> **Por qué Daemon sin UI separado del Webapp:** distinto perfil operativo. El daemon corre 24/7 atendiendo sensores; el webapp atiende sesiones humanas. Separarlos permite escalar y desplegar independientemente. Es **separation of concerns** materializado en proceso (no sólo en clase).

> **Por qué Producer-Consumer entre Pollers→Processor:** desacopla la velocidad de sensado (variable, bursty) de la velocidad de procesamiento (uniforme, ACID a DB). Una cola en el medio absorbe los picos.

### (c-bis) Decisión arquitectónica equivalente — estilo genérico

Si se generaliza el dibujo anterior al lenguaje de [[Estilos arquitectónicos]]: **[[Pipes and Filters]]** + **[[Publish-Subscribe]]** con persistencia histórica.

Estructura típica:

```
Sensores (serie) → Adapters (1 por sensor, protocolo específico)
                   ↓
              Bus de eventos (pub-sub)
                   ↓
   ┌──────────────┼──────────────┐
   ↓              ↓              ↓
Procesador    Dashboard      Historizador
Anomalías     tiempo real    (time-series DB)
```

Justificación:
- Pub-sub desacopla productores (adapters) de consumidores (dashboard, anomalías, históricos). Nuevo consumidor = nueva subscripción, sin tocar productores.
- Adapters por protocolo aíslan las particularidades de cada sensor — mejora portability.
- Time-series DB (InfluxDB, TimescaleDB) optimizada para el patrón de escritura y consulta.

### (d) Atributos de calidad y trade-offs

- **Availability vs Simplicity:** redundancia de bus agrega complejidad. Trade-off explícito.
- **Performance vs Auditability:** firmar cada lectura impacta throughput. Solución: firmar lotes en vez de cada evento.
- **Portability (a nuevos sensores) vs Complexity:** adapters con interfaz común requieren diseño cuidadoso.

### (e) Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Sensor defectuoso envía datos espurios | Validación + anomaly detection en procesador |
| Caída del bus | Bus con replicación (Kafka con ≥3 brokers); adapters con buffer local |
| Crecimiento del dataset histórico | Retention policies + downsampling automático |
| Nuevo protocolo futuro | Adapter pluggable con interfaz estable |
| Pérdida de un operador crítico | Runbooks + dashboards auto-explicativos |

### (f) Evaluación y siguiente iteración

Aplicar [[Lightweight ATAM]] al diseño — identificar sensitivity points (el bus pub-sub como SPOF potencial; el formato de mensaje como contrato crítico) y tradeoffs antes de construir.

## Patrones de resolución comunes (errores típicos)

- **"Guardo todo en una BD relacional grande"** — no escala para time-series ni soporta patrones de consulta real-time.
- **"Cada sensor habla directo con el dashboard"** — no escala; acopla fuertemente; difícil agregar consumidores.
- **"Monolito con un thread por sensor"** — frágil, no escalable horizontalmente.
- **Olvidar el atributo "Auditability"** — en industria regulada, es un killer.
- **No considerar el protocolo serie real** — los hangs transitorios son un hecho, no una excepción.

## Relación con otros conceptos

- [[Attribute Driven Design]] — los pasos a/b son literalmente el ADD 1-2.
- [[Árbol de utilidad]] — producto del paso (b).
- [[Estilos arquitectónicos]] — el paso (c) elige estilo.
- [[SLA, SLO, SLI]] — los escenarios operacionales del árbol son SLOs potenciales.
- [[MTBF y MTTR]] — reliability del sistema de monitoring se mide con estas métricas.

## Pregunta a profundizar

¿Cómo cambia el diseño si los sensores migran a **IoT inalámbrico** (MQTT, LoRaWAN)? ¿Qué atributos se vuelven dominantes (seguridad, battery life de dispositivos, cobertura)?

## Fuentes y lecturas

- Hohpe, Woolf — *Enterprise Integration Patterns* — mensajería y pub-sub.
- Kleppmann — *Designing Data-Intensive Applications* — time-series, event logs.
- Bass, Clements, Kazman — *Software Architecture in Practice*.
