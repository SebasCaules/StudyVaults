---
title: Caso Compraventa de Acciones
type: case-study
aliases:
  - "Caso Compraventa de Acciones"
  - "Compraventa de Acciones"
  - "Mercado electrónico de acciones"
created: 2026-05-07
updated: 2026-05-07
tags: [case-study, compraventa-acciones, mercado-financiero, security, availability, parcial, kata, add]
sources:
  - "raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md"
  - "raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (3).png"
  - "raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (5).png"
related:
  - "[[Clase 7 — Caso Compraventa de Acciones]]"
  - "[[Enunciados de parciales — 6 casos]]"
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Árbol de utilidad]]"
  - "[[ATAM]]"
  - "[[Teorema CAP]]"
  - "[[Architecture Business Cycle]]"
  - "[[Bases de datos relacionales]]"
  - "[[Replicación de BD]]"
  - "[[Estilos arquitectónicos (catálogo)]]"
  - "[[Caso Healthcare.gov]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Katas de Arquitectura]]"
---

# Caso Compraventa de Acciones

## Por qué la cátedra lo usa

Es uno de los **6 casos del banco de parciales** ([[Enunciados de parciales — 6 casos|caso 2]]) y el ejercicio integrador desarrollado en vivo en [[Clase 7 — Caso Compraventa de Acciones]]. Sirve como **kata de [[Attribute Driven Design]]**: aplicar el método paso a paso sobre un dominio que fuerza a tomar decisiones canónicas — Security extremo + Availability + Performance + Scalability — con trade-offs duros.

A diferencia de [[Caso Twitter — Big Data en tiempo real]] (que es AP-leaning, performance ante todo) y [[Caso Healthcare.gov]] (que es post-mortem de qué *no* hacer), este caso es **CP-extremo con Security como atributo dominante** — un mercado financiero donde la integridad de los datos y el acceso controlado no son negociables.

## Dominio

Mercado electrónico para **compraventa de acciones**: cotización en tiempo real, ingreso de órdenes por usuarios, matching, confirmación, settlement. Operación regulada con requerimientos de auditabilidad y trazabilidad.

**Stakeholders implícitos:**
- **Usuarios (traders)** — operan, consultan cotizaciones, ven su cartera.
- **Operations (Ops)** — gestionan el sistema desde una consola interna.
- **Sistemas externos:**
  - **BC1 (Cotización)** — provee precios en tiempo real.
  - **BC2 (Ops)** — sistema externo que se conecta vía VPN.
  - **SMTP** — para notificaciones a usuarios.
- **Reguladores** — implícitos (la naturaleza financiera lo demanda).

## Atributos de calidad — proceso de priorización

En clase se enumeraron varios candidatos antes de rankear:

- Performance
- Security
- Interoperability
- Scalability
- Availability
- Usability
- Precision

**Ranking final acordado** (source: raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md):

1. **Security**
2. **Availability**
3. **Performance**
4. **Scalability**

**Por qué Security va primero** (cita textual de clase):

> *"Lo más importante que tiene una empresa es la información de sus usuarios."*

> *"La importancia se determina por la naturaleza de los datos. […] El objetivo es ser lo suficientemente difícil de entrar para que sea más atractivo hackear a otro."*

Esta segunda frase encapsula la filosofía de **threshold defense** (ver [[Mecanismos de seguridad]]): no se busca defensa absoluta sino **subir el costo del ataque** hasta que el adversario racional vaya a otro target.

## Metodología en clase — diseño iterativo por atributo

La clase aplicó [[Attribute Driven Design]] en **iteraciones sucesivas**, cada una agregando los mecanismos requeridos por un atributo del ranking. Patrón general:

> *"Primero concentrarse en el problema principal y después atacar los accesorios o features secundarias."*
> (source: raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md)

### 1ª iteración — Sistemas externos (estructura base)

Identificar **componentes funcionales** y sistemas externos sin todavía pensar en atributos no funcionales.

(source: raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (3).png)

```
Actores: User, Ops
Frontend: SPA1 (cotización/compra), SPA2 (ops)
Edge: LB
Backend: Back
Persistencia: SQL OLTP
Sistemas externos:
  • BC1 (Cotización)        → Back
  • BC2 (Ops, vía VPN)      → Back
  • SMTP                    → Back
```

Componentes:
- **SPA1**: el frontend de cotización y compraventa, lo usa el usuario final.
- **SPA2**: el frontend interno para Ops.
- **LB (Load Balancer)**: distribuye tráfico entre los SPAs/Back; ya en esta iteración aparece como punto de entrada centralizado.
- **Back**: el monolito (o servicio principal) que orquesta el dominio.
- **SQL OLTP**: ver [[Bases de datos relacionales]] — motor relacional transaccional, opción default para datos financieros con integridad fuerte.
- **BC1 / BC2**: bounded contexts externos (cotización, operaciones).
- **SMTP**: salida hacia mail.

### 2ª iteración — Aplicar escenarios de Security (atributo #1)

Por cada escenario de amenaza, agregar el mecanismo correspondiente del catálogo de [[Mecanismos de seguridad]]:

(source: raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md, raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (5).png)

| Escenario | Mecanismo aplicado | Ubicación |
|---|---|---|
| Ataque DDoS | **WAF** (Web Application Firewall) | Antes del LB, justo después del cloud |
| Atacante obtiene credenciales de un usuario | **MFA** (Multi-Factor Authentication) | En el flujo de login del usuario |
| Inyección (SQLi/XSS/etc.) | **Sanitización de inputs** | En el Back, en cada endpoint que recibe input |
| Leak físico del storage | **Encriptación at-rest** de la BD | A nivel motor SQL |
| Tráfico malicioso o credentials sniffing | **HTTPS** end-to-end + LB como **reverse proxy** (Nginx) | Cliente↔LB↔Back |
| Acceso de Ops debe ser segregado | Infraestructura **separada** para Ops + acceso vía **VPN** | Cluster Ops aislado con su propio Back+BD |

**Cambio estructural mayor en esta iteración:** Ops se mueve a su **propia infraestructura** — su propio Back, su propia BD SQL OLTP — accedida exclusivamente vía VPN. Esto reduce drásticamente el **blast radius**: un compromiso del SPA público no llega al sistema de Ops.

### 3ª iteración — Aplicar escenarios de Availability (atributo #2)

Análisis de patrones de comunicación según el caso de uso:

(source: raw/classes/2026-05-07 - Clase 7/Ejercicio Compraventa de Acciones.md, sección parcialmente desarrollada)

- **BC1 (Cotización) ↔ Back:** **WebSocket** — conexión abierta persistente. Justificación: el flujo de cotizaciones es **streaming continuo** (precios cambian decenas de veces por segundo); abrir un request HTTP por cada update sería ruidoso y agregaría latencia inaceptable.
- **Usuario → Back (parte de venta):** **Request-Response** instantáneo (asunción tomada en clase). Justificación: la operación de venta es discreta y requiere confirmación inmediata; el modelo síncrono encaja.

> Las notas de clase quedan cortadas en este punto. El desarrollo del 3er escenario (HA/replicación, failover, hot standby) probablemente se completó verbalmente en clase y queda para revisar con el material de la próxima.

## Diagrama final (2da iteración)

(source: raw/classes/2026-05-07 - Clase 7/Diagrama en blanco (5).png)

```
                        ┌─── BC1: Cotización ───┐
                        │   SMTP                │
                        ▼                       ▼
[User] ──MFA, HTTPS──► (cloud) ──► [WAF] ──► [LB] ── SPA1 ──► [Back] ──► [SQL OLTP]
                                                                │
                                                                ├──VPN──► BC2: Ops
                                                                │
                                                          ──────┴──────
                                                          (cluster Ops separado)
                                                                │
                                                          [Back Ops] ──► [SQL OLTP]
                                                                ▲
                                                                │ VPN
                                                          [LB] ◄─── SPA1 ◄─── (cloud) ◄── [OPS user]
                                                                                          HTTPS, VPN
```

Lo nuevo respecto de la 1ª iteración: WAF, MFA, segregación física de Ops vía VPN, dos clusters Back+BD independientes.

## Decisiones arquitectónicas explícitas

| Decisión | Opciones | Elección | Justificación |
|---|---|---|---|
| Atributo #1 | Performance / Security / Availability | **Security** | Naturaleza financiera de los datos. |
| Persistencia | SQL OLTP / NoSQL / In-memory | **SQL OLTP** | Integridad transaccional y auditabilidad sobre cualquier otra cosa. Ver [[Bases de datos relacionales]]. |
| Topología de Ops | Mismo cluster con auth / cluster separado vía VPN | **Cluster separado** | Reducir blast radius — vulnerabilidad pública no llega a Ops. |
| Edge protection | Sólo LB / WAF + LB | **WAF + LB** | DDoS y payloads maliciosos requieren capa 7. |
| Auth de usuario | Password / Password+MFA | **Password + MFA** | Robar credenciales no debe alcanzar para entrar. |
| Comunicación con Cotización | Polling / WebSocket | **WebSocket** | Cotizaciones son streaming. |

## Trade-offs identificados

- **Security ↔ Usability** — MFA agrega fricción al login. Aceptable porque el usuario que opera con dinero acepta más fricción que en una red social.
- **Security ↔ Performance** — WAF agrega latencia (1-10ms típico). Aceptable porque la latencia operativa de matching es órdenes de magnitud mayor.
- **Maintainability ↔ Blast radius** — dos clusters separados duplican operación pero limitan superficie de ataque.
- **Availability ↔ Consistency** ([[Teorema CAP]]) — mercado financiero es **CP** sin discusión: rechazar transacciones es preferible a aceptar inconsistencia (saldos divergentes, doble venta).

## Comparación con otros casos

| Eje | Compraventa de Acciones | [[Caso Twitter — Big Data en tiempo real|Twitter]] | [[Caso Healthcare.gov|Healthcare.gov]] |
|---|---|---|---|
| Atributo #1 | **Security** | Performance/Throughput | (debió haber sido Availability + Reliability) |
| Posición CAP | **CP** | AP-leaning | (intentó CA, colapsó) |
| Persistencia | SQL OLTP | Cassandra + Memcached | Monolítica con cuellos |
| Lección central | Threshold defense + iteración por atributo | Partition/Replicate/Index | Evaluación arquitectónica tardía |

## Conexiones con material previo

- [[Attribute Driven Design]] — el método aplicado iteración por iteración.
- [[Atributos de calidad]] — el ranking proviene de la tabla ISO 25000.
- [[Mecanismos de seguridad]] — el catálogo aplicado en la 2ª iteración.
- [[Árbol de utilidad]] — implícito en la priorización de escenarios.
- [[Architecture Business Cycle]] — la naturaleza de los datos (stakeholders + tech environment + regulación) determinó por qué Security fue #1.
- [[Bases de datos relacionales]] — el SQL OLTP elegido para integridad financiera.
- [[Replicación de BD]] — material para la 3ª iteración (HA/availability) que quedó parcial en las notas.
- [[Caso Healthcare.gov]] — contraejemplo de qué pasa cuando estos atributos no se priorizan correctamente.

## Pregunta a profundizar

La 3ª iteración (Availability) quedó incompleta en las notas. ¿Qué decisiones de [[Replicación de BD|replicación]] (Primary-Secondary vs Primary-Primary, sincrónica vs asincrónica), failover y DR aplicaría el caso? ¿Cuántos data centers? ¿Cómo se valida con [[ATAM]] que las decisiones tomadas en las 2 primeras iteraciones no rompen los escenarios de Availability de la 3ª?

## Lecturas complementarias

- Bass, Clements, Kazman — *Software Architecture in Practice* — capítulos sobre Security, Availability.
- Anderson — *Security Engineering* (3ª ed., 2020).
- OWASP Cheat Sheets — recetas concretas para WAF, MFA, sanitización.
- NASDAQ INET architecture — caso real comparable de matching engine financiero.
- Brewer — *CAP Twelve Years Later* — para encuadrar la decisión CP del dominio financiero.
