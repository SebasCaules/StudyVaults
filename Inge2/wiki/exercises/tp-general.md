---
title: "TP general — Sistema Admin Cuentas + satélites"
aliases:
  - "TP general — Sistema Admin Cuentas + satélites"
  - "TP general"
  - "TP general — Sistema de Administración de Cuentas"
  - "Sistema Admin Cuentas"
type: exercise
created: 2026-04-22
updated: 2026-04-22
tags: [ejercicio, tp, trabajo-practico, sistemas-satelite, logistica, integracion]
sources:
  - raw/exercises/TPgeneral.pdf
related:
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Árbol de utilidad]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Clase 4 — ¿Cuándo diseñamos?]]"
  - "[[Katas de Arquitectura]]"
  - "[[ATAM]]"
  - "[[Lightweight ATAM]]"
  - "[[Architecture Business Cycle]]"
  - "[[BDUF vs YAGNI vs JEDUF]]"
  - "[[Enunciados de parciales — 6 casos]]"
  - "[[Cross challenge — 3 casos]]"
  - "[[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]]"
  - "[[ADR — Architecture Decision Record]]"
  - "[[Architectural Guardrails]]"
  - "[[C4 Model]]"
---

# TP general — Sistema Admin Cuentas + satélites

## Rol

**Trabajo práctico integrador** del curso. Exige aplicar el flujo completo de arquitectura (stakeholders → atributos → árbol → decisiones → evaluación) sobre un dominio compuesto: un **sistema principal** (Administración de Cuentas de una logística) + **sistemas satélite** que interactúan con él (source: raw/exercises/TPgeneral.pdf).

Es un ejercicio de **arquitectura de sistemas** — no alcanza con diseñar el principal; hay que coordinar cómo los satélites se integran manteniendo cohesión global.

## Sistema principal — Administración de Cuentas (logística)

**Dominio:** empresa de logística que necesita administrar **cuentas de clientes**: alta, operaciones (envíos, facturación), estados de cuenta, cobranzas.

**Drivers típicos:**
- **Scalability** — millones de operaciones mensuales.
- **Reliability** de datos financieros.
- **Auditability** para obligaciones contables.
- **Integration** — decenas de sistemas internos y externos.
- **Availability** alta — clientes esperan ver su cuenta 24×7.

## Sistemas satélite

El TP lista varios sistemas que interactúan con el principal. Cada uno es un mini-ejercicio con su propio conjunto de drivers, pero con la exigencia de **coherencia** entre ellos.

### 1. Cartilla Online

**Dominio:** catálogo online de servicios contratables por clientes — self-service para consultar y adquirir servicios logísticos.

**Drivers:**
- **Usability** para cliente final.
- **Performance** — carga rápida del catálogo.
- **Availability** — 99.9%+.
- **Consistencia eventual con el sistema principal** — precios, disponibilidad.

**Estilos candidatos:** Front con SSR/SSG + API backend + caché (Redis, CDN).

### 2. Red de Compensación Bancaria

**Dominio:** integración con la red bancaria para conciliación de pagos (débitos, créditos, reversas).

**Drivers:**
- **Reliability** — ningún pago puede "perderse".
- **Auditability** extrema — cada movimiento rastreable.
- **Interoperability** con protocolos bancarios (SWIFT, ISO 20022, APIs locales).
- **Security** — datos de transacciones financieras.

**Estilos candidatos:** Event Sourcing para trazabilidad; Broker hacia red bancaria; colas con idempotencia y exactly-once semantics.

### 3. Sistema Tintométrico

**Dominio:** sistema para mezclar colores (en contexto retail/industrial — pinturas, textiles) que se integra con el sistema de cuentas para facturación y ajuste de stock de insumos.

**Drivers:**
- **Precision** — fórmulas exactas de color.
- **Performance** tiempo real — mientras el cliente espera.
- **Integration** con dispositivos físicos (dispensadores).
- **Offline capability** — puntos de venta sin conectividad.

**Estilos candidatos:** Offline-first + sync; sistema embebido que dialoga con el central por API.

### 4. Gestor de Documentos P2P

**Dominio:** gestión de documentos relacionados a cuentas (contratos, remitos, facturas) con **arquitectura P2P** entre nodos (sucursales, partners).

**Drivers:**
- **Availability** descentralizada — cada nodo sigue operando aislado.
- **Consistency eventual** entre nodos.
- **Security** — firma digital, integridad.
- **Auditability** — quién creó, modificó, accedió.

**Estilos candidatos:** [[Peer-to-Peer]]; CRDTs para merge automático; firma digital; possibly IPFS/BitTorrent-like distribution.

## Cómo se abordan los satélites

El valor del TP está en **coordinar** estos sistemas — tres dimensiones de análisis:

### 1. Contratos de integración

Cada satélite publica/consume información del principal. Decisiones:
- ¿API REST, gRPC, eventos asincrónicos?
- ¿Autenticación (mTLS, OAuth)?
- ¿Versionado?
- ¿SLA entre sistemas?

### 2. Consistencia entre sistemas

- ¿Qué tipo de consistencia es aceptable en cada integración? (fuerte, eventual, causal).
- ¿Dónde está la "fuente de verdad" de cada entidad? (cliente, cuenta, producto).
- ¿Cómo se reconcilian divergencias?

### 3. Governance arquitectónica

- [[Architectural Guardrails]] que aplican a todos los satélites (observabilidad, seguridad, contratos).
- Decisiones centralizadas vs decisiones locales por satélite.
- Cómo se presenta al cliente final (single pane of glass vs apps separadas).

## Entregables esperados

Basado en la práctica de la cátedra y el patrón del ejercicio:

1. **Análisis de stakeholders y atributos de calidad** por sistema.
2. **[[Árbol de utilidad]]** consolidado con escenarios priorizados.
3. **Diagramas arquitectónicos** (al menos [[C4 Model|C4 C1-C2]]) del conjunto.
4. **Justificación de estilos** elegidos con trade-offs explícitos.
5. **Contratos de integración** entre sistemas.
6. **Plan de evaluación** — cómo se validaría la arquitectura ([[Lightweight ATAM]], prototipos, etc.).

## Errores típicos

- **Tratar los satélites como "apps separadas"** sin pensar coordinación.
- **Replicar datos sin política de fuente-de-verdad** — los datos divergen, nadie sabe cuál es correcto.
- **Elegir un estilo distinto en cada satélite sin justificación** — el conjunto queda inconsistente.
- **Olvidar observabilidad** cross-sistema — cuando hay un problema, no se puede rastrear.
- **Atajar por diagrama antes de atributos** — misma trampa que todos los ejercicios.

## Relación con otros materiales

- [[Ejercicio 2013 — Sistema de control de fábrica con sensores serie]] — ejercicio más corto del mismo patrón.
- [[Cross challenge — 3 casos]] — casos paralelos para práctica individual.
- [[Enunciados de parciales — 6 casos]] — casos similares simplificados.
- [[Attribute Driven Design]] — metodología nuclear.
- [[Clase 4 — ¿Cuándo diseñamos?]] — evaluación y platform engineering aplican al conjunto.

## Pregunta a profundizar

¿Cómo evoluciona el sistema cuando agregas satélite N+1? ¿El TP fuerza a diseñar una **plataforma** (IDP interno para satélites) o deja que cada satélite sea ad-hoc? ¿Cuál es la madurez arquitectónica buscada?

## Fuentes y lecturas

- Kleppmann — *Designing Data-Intensive Applications* — integración, consistencia.
- Hohpe, Woolf — *Enterprise Integration Patterns*.
- Richards, Ford — *Software Architecture: The Hard Parts*.
- Skelton, Pais — *Team Topologies*.
