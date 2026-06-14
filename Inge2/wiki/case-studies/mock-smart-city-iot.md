---
title: "Caso mock — Plataforma de monitoreo de smart city"
aliases:
  - "Caso mock — Smart city"
  - "Mock smart city"
type: case-study
created: 2026-05-13
updated: 2026-05-13
tags: [case-study, mock, parcial, smart-city, iot, event-driven, cep, time-series, privacidad]
sources:
  - "study/js/data/mock-cases.js"
related:
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Off-line vs Online computation]]"
  - "[[Bases no relacionales]]"
  - "[[Principio de localidad]]"
  - "[[Memory hierarchy]]"
  - "[[Architectural Guardrails]]"
  - "[[Enunciados de parciales — 6 casos]]"
---

# Caso mock — Plataforma de monitoreo de smart city

## Por qué este caso está en el wiki

Caso mock de parcial curado por el wiki. Caso ideal para practicar **estilos event-based** (SEP/STREP/CEP/OLEP del catálogo POSA, ver [[Estilos arquitectónicos]]) sobre un dominio de **ingesta masiva heterogénea** con restricciones de privacidad. Alimenta el [[Generador de casos mock de parcial|generador]].

> Caso **sintético**. Inspirado en plataformas reales de smart city (Barcelona, Buenos Aires CABA, Santiago) sin describir ninguna en particular. No citar como hecho de ninguna ciudad específica.

## Dominio

Plataforma municipal de ingesta y análisis en tiempo real de sensores IoT urbanos: tráfico, calidad del aire, alumbrado público, residuos, ruido y cámaras.

## Contexto del enunciado

Un municipio de **1.2 millones de habitantes** recibe financiamiento del BID para modernizar su infraestructura con una plataforma "smart city". El alcance contempla:

- **25.000 sensores** distribuidos: espiras de tráfico, calidad de aire PM2.5/NOx, fotoceldas de alumbrado, sensores de llenado de contenedores de residuos, micrófonos de nivel sonoro.
- **1.200 cámaras de seguridad** ya instaladas con video analytics on-edge.

La cadencia de telemetría varía radicalmente: las espiras emiten cada 5 segundos, los sensores de aire cada minuto, los de residuos cada 6 horas. El volumen estimado es **80 millones de eventos/día** con picos de **4.000 eventos/segundo** en hora pico.

Casos de uso primarios:

1. **Cuadros en tiempo real** para la sala de operaciones municipal.
2. **Detección de eventos anómalos** (atasco, contaminación pico, contenedor desbordado, intrusión) con notificación push a operativos.
3. **Reportes históricos** y análisis de tendencias para planificación urbana.
4. **Apertura de datos al público** (datos abiertos / open data).

El municipio cambia de gobierno cada 4 años con cambios fuertes de prioridades; el equipo técnico interno es muy pequeño y depende de proveedores. Hay regulación de datos personales (cámaras capturan rostros, audio captura conversaciones) y presión ciudadana por transparencia de los algoritmos.

## Stakeholders

- Operadores municipales (sala 24×7)
- Equipos de respuesta en calle (tránsito, ambiental, alumbrado, residuos)
- Planificación urbana
- Ciudadanos (consumidores de datos abiertos y notificaciones)
- Ente regulador de datos personales
- ONGs y prensa (transparencia)
- Vendors de sensores (cada uno con su protocolo)
- Equipo técnico municipal (chico, alta rotación)
- Auditoría del BID
- Adversarios: vandalismo, spoofing, ataques al video

## Atributos de calidad priorizados

> Tomados **exclusivamente** de la tabla ISO 25000 de la cátedra (ver [[Atributos de Calidad — tabla ISO 25000 (cátedra)]]). *Privacy* se subsume en `Security`; *cost-efficiency* es restricción de negocio; *time-series analytics* es una característica funcional, no un atributo.

1. **Scalability** — 80M eventos/día con picos de 4.000 eventos/s sin perder mediciones.
2. **Performance** — detección y notificación de anomalías en < 30 s; dashboards en tiempo real.
3. **Security** — datos personales en cámaras y audio (rostros, conversaciones); anonimización.
4. **Availability** — la sala de operaciones depende del feed en vivo.
5. **Interoperability** — sensores heterogéneos (MQTT, LoRaWAN, HTTP, propietarios).
6. **Maintainability** — sobrevivir cambios de gobierno cada 4 años con equipo interno pequeño.
7. **Auditability** — transparencia ciudadana sobre algoritmos y datos abiertos al público.
8. **Reliability** — perder mediciones rompe la trazabilidad histórica para planificación urbana.

## Decisiones arquitectónicas curadas

| Decisión | Rationale |
|---|---|
| **Gateways IoT en el borde** que normalizan protocolos heterogéneos a un schema canónico (CloudEvents) | Sin normalización, cada vendor te ata a su SDK. [[Architectural Guardrails]] contra vendor lock-in. |
| **Pipeline event-driven** con Kafka como columna vertebral; topics por clase de evento | Desacopla productores (sensores) de consumidores (alertas, dashboards, batch). |
| **CEP (Complex Event Processing)** con Flink/KsqlDB para detección de anomalías | Las reglas operan sobre ventanas temporales y correlación entre streams — no son queries puntuales. Patrón canónico de POSA event-based. |
| **Hot path** en time-series DB (InfluxDB/TimescaleDB) para dashboards; **cold path** en data lake (Parquet/S3) para análisis histórico | Polyglot persistence: cada motor en su zona. La query "últimos 7 días por sensor" es radicalmente distinta a "evolución 5 años por barrio". |
| **Video analytics on-edge** en las cámaras; sólo metadata anonimizada llega al backend | Privacy by design + reducción de ancho de banda. |
| **API pública de datos abiertos** sobre el data lake con throttling agresivo y lag de 1 hora | Transparencia sin abrir el plano operativo. El lag desincentiva el uso del feed público como espionaje en tiempo real. |
| **Catálogo de sensores** como source of truth aparte del telemetry stream | Un sensor cambia de modelo, se rompe, se reubica: el catálogo evoluciona; los eventos referencian al catálogo por ID estable. |

## Lecciones aprendidas

1. Heterogeneidad de protocolos IoT se domina con un **schema canónico en el borde**.
2. **Event-driven + CEP** es el matrimonio natural para anomalías temporales.
3. **Polyglot persistence** (hot vs cold path) es regla, no excepción, para time-series a gran escala.
4. **Privacy by design** en sensores con audio/video: decisión arquitectónica, no feature.
5. Datos abiertos con **lag y throttling** balancea transparencia y operación.
6. **Catálogo de assets separado del stream** — el catálogo cambia, el stream no.
7. **Maintainability en equipos chicos** exige guardrails fuertes y vendor-neutral.

## Trampas y anti-patrones

- Persistir el feed crudo de video en S3 "por si acaso" (privacidad + costo + sin caso de uso real).
- Usar la time-series DB como data lake (analítica de 5 años revienta InfluxDB).
- Ingerir IoT en la base relacional municipal (4.000 eventos/s la matan).
- Acoplarse a un vendor de sensores sin gateway de normalización.
- Reglas de alerta hardcodeadas (cada cambio = deploy + downtime).
- Modelo de ML pesado en backend cuando edge alcanza.
- Datos abiertos sin throttling (un script tira la API).
- Asumir que el equipo interno crecerá (no crece — los gobiernos rotan).

## Pregunta a profundizar

¿Cuándo CEP vence a un cron + query? ¿Cuál es el umbral conceptual — volumen, latencia, complejidad de la regla?

## Cómo se usa este caso

Sorteado por el [[Generador de casos mock de parcial|generador]]. Útil para practicar el inciso *d) arquitectura*: forzar al alumno a justificar event-driven + CEP en lugar de monolito + batch.
