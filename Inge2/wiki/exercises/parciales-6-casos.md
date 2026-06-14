---
title: "Enunciados de parciales — 6 casos"
aliases:
  - "Enunciados de parciales — 6 casos"
  - "Enunciados de parciales"
  - "6 casos"
type: exercise
created: 2026-04-22
updated: 2026-04-22
tags: [ejercicio, parcial, casos, arquitectura]
sources:
  - "raw/exercises/Ingesoft 2 - Enunciados de Parciales.pdf"
related:
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Árbol de utilidad]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Katas de Arquitectura]]"
  - "[[ATAM]]"
  - "[[Lightweight ATAM]]"
  - "[[Cross challenge — 3 casos]]"
  - "[[TP general]]"
  - "[[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]]"
  - "[[Caso Healthcare.gov]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Clase 7 — Caso Compraventa de Acciones]]"
  - "[[Mecanismos de seguridad]]"
---

# Enunciados de parciales — 6 casos

## Rol

Compilado de **6 enunciados de parcial** de años recientes, usados como banco de casos para practicar el flujo **stakeholders → atributos → árbol → arquitectura → trade-offs** (source: raw/exercises/Ingesoft 2 - Enunciados de Parciales.pdf).

Cada caso explora un dominio distinto; la estructura de los ejercicios suele ser la misma (a-f), siguiendo el patrón del [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]].

## Los 6 casos

### 1. Bibliotecas Nacionales

**Dominio:** red de bibliotecas distribuidas en el país, cada una con catálogo local, que deben consolidarse en un sistema nacional consultable online.

**Drivers clave probables:**
- Disponibilidad regional (cada biblioteca sigue operando si la central cae).
- Interoperabilidad — catálogos con esquemas heterogéneos.
- Auditability para préstamos y acervo.

**Estilos candidatos:** Broker / Pub-Sub para sincronización eventual; Federación de catálogos (tipo Z39.50/SRU).

### 2. Compraventa de Acciones

**Dominio:** mercado electrónico de acciones — matching de órdenes, confirmación, settlement.

**Drivers clave probables:**
- **Performance** brutal — matching en microsegundos.
- **Availability** extrema — cada segundo caído = millones perdidos.
- **Auditability / Security** — regulación financiera estricta.
- **Consistency** fuerte en el order book.

**Estilos candidatos:** Event Sourcing + CQRS; motor in-memory; Layers con zonas de confianza.

Este caso fuerza a los estudiantes a enfrentar trade-offs entre CAP: el mercado no puede ser AP, debe ser CP y ser muy confiable.

> **Desarrollado en clase:** este caso fue trabajado integralmente como kata en [[Clase 7 — Caso Compraventa de Acciones]]. La cátedra priorizó **Security** como atributo #1 (no Performance — la *naturaleza de los datos* manda) y aplicó iteración por atributo. Ver [[Caso Compraventa de Acciones]] para el desarrollo completo y [[Mecanismos de seguridad]] para el catálogo aplicado en la 2ª iteración.

### 3. Logística

**Dominio:** empresa de logística — tracking de paquetes desde origen hasta destino, planeamiento de rutas, integración con carriers.

**Drivers clave probables:**
- **Scalability** — millones de paquetes diarios.
- **Real-time tracking** — Performance medida en latencia de actualización.
- **Integration** con sistemas heterogéneos de carriers.
- **Reliability** de datos de tracking.

**Estilos candidatos:** Microservicios + pub-sub de eventos de tracking; CEP para detectar patrones anómalos (paquete perdido, ruta imposible).

### 4. CMS (Content Management System)

**Dominio:** plataforma editorial — múltiples redactores, publicación programada, múltiples canales de salida (web, mobile, feeds).

**Drivers clave probables:**
- **Usability** para redactores.
- **Availability** del front público.
- **Scalability** en lecturas (leer >> escribir).
- **Maintainability** — contenido vive años, plataforma evoluciona.

**Estilos candidatos:** Headless CMS + CDN; pub-sub para invalidación de cachés; capas clásicas (backoffice) + front con static generation.

### 5. Punto de Venta (PDV) de electrodomésticos

**Dominio:** cadena retail — múltiples sucursales, POS en cada una, integración con stock central, financiación.

**Drivers clave probables:**
- **Availability** local — cada sucursal sigue operando si el link a central cae.
- **Consistency eventual** aceptable para stock.
- **Security** — manejo de datos de pago.
- **Interoperability** con sistemas de financiación y bancos.

**Estilos candidatos:** Offline-first con sync eventual; Broker para integración; Layers con datos cacheados localmente.

### 6. Sistema Integral de Atención (SIA)

**Dominio:** sistema de atención al cliente multi-canal (teléfono, email, chat, redes sociales), con tickets, escalamiento, métricas de servicio.

**Drivers clave probables:**
- **Unified view of customer** across channels.
- **Performance** para agentes (un query debe responder < 1s).
- **Scalability** en canales digitales.
- **Integration** con CRMs, sistemas de facturación, telefonía.
- **Auditability** para cumplir SLAs contractuales.

**Estilos candidatos:** Event-driven con CDC de sistemas legacy; Pub-sub para integración de canales; Omnichannel aggregator.

## Patrón de resolución esperado

Para cada caso, el flujo esperado es:

1. **Identificar stakeholders** y sus preocupaciones.
2. **Priorizar atributos de calidad** de ISO 25000 (source: raw/assets/Atributos de Calidad.pdf).
3. **Construir [[Árbol de utilidad]]** con escenarios concretos y (importancia, dificultad).
4. **Aplicar [[Attribute Driven Design]]** — descomposición justificada por los drivers.
5. **Elegir [[Estilos arquitectónicos]]** y justificar con trade-offs explícitos.
6. **Listar riesgos** principales y mitigaciones.

La tentación a evitar: saltar al dibujo de cajas antes de haber articulado los atributos.

## Relación con otros materiales

- [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]] — ejemplo resuelto del mismo patrón.
- [[Cross challenge — 3 casos]] — casos alternativos de práctica.
- [[TP general]] — trabajo práctico integrador.
- [[Caso Healthcare.gov]] — caso real de fracaso; sirve de contrapunto.

## Pregunta a profundizar

Muchos casos son anteriores a 2020. ¿Cómo cambian las respuestas "correctas" si los mismos casos se plantean con stack 2025 (serverless, event mesh, LLMs para atención)? ¿Los trade-offs se mueven o sólo los mecanismos?

## Fuentes y lecturas

- Pohl — *Requirements Engineering* — stakeholders y atributos.
- Bass, Clements, Kazman — *Software Architecture in Practice*.
- Richards, Ford — *Fundamentals of Software Architecture*.
