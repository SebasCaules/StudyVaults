---
title: Criterios de hosting y data residency
aliases:
  - "Criterios de hosting y data residency"
  - "Criterios de hosting"
  - "Data residency"
  - "Hosting on-premise vs cloud"
type: concept
created: 2026-05-15
updated: 2026-05-15
tags: [hosting, cloud, on-premise, data-residency, regulatorio, costos, latencia, parcial]
sources:
  - "raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md"
related:
  - "[[Clase 8 — Consultas pre-parcial]]"
  - "[[Atributos de calidad]]"
  - "[[Architecture Business Cycle]]"
  - "[[Attribute Driven Design]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Anti-patrones de parcial]]"
---

# Criterios de hosting y data residency

## Rol

Decisión arquitectónica de dónde **vive físicamente el sistema**: cloud público, on-premise (propio), data center alquilado, edge, o híbrido. La cátedra introduce los criterios formalmente en [[Clase 8 — Consultas pre-parcial]] (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md) como input al trade-off **costos vs tiempo** que el parcial exige hacer explícito.

> **Por qué es arquitectónico:** la elección de hosting impacta directamente Availability, Performance, Security, Maintainability, Auditability y los costos. No es una decisión de infraestructura "post-arquitectura" — condiciona qué arquitectura es viable.

## Los tres criterios

### 1. Marco regulatorio (data residency)

Algunas jurisdicciones obligan a que los datos de sus residentes **residan físicamente** dentro de su territorio o bajo su jurisdicción legal. Ignorarlo no es una optimización: es ilegal.

**Ejemplos canónicos dados en clase (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md):**

| Jurisdicción | Restricción |
|---|---|
| **Corea del Sur** | Información de residentes coreanos debe estar en data centers ubicados en Corea del Sur. |
| **México** (1ª gestión Trump) | Datos financieros mexicanos debían residir en al menos un data center **fuera** de regulaciones de EE.UU. |
| **UE — GDPR** | Transferencias a terceros países requieren mecanismo legal (Schrems II invalidó Privacy Shield; ahora SCCs + TIA). |
| **AR — Ley 25.326** | Datos personales pueden transferirse al exterior si el país receptor tiene legislación adecuada (lista cerrada del registro). |
| **BR — LGPD** | Modelo similar a GDPR; transferencia internacional restringida. |
| **Sector financiero (CNV/BCRA AR, SEC USA)** | Reportes regulatorios deben ser accesibles al regulador local. |
| **Sector salud (HIPAA USA, Ley 26.529 AR)** | Datos clínicos con restricciones específicas de almacenamiento y acceso. |

**Implicancia arquitectónica:**
- Si el sistema tiene usuarios en múltiples jurisdicciones → **arquitectura multi-region** con sharding por residencia (no por load).
- Si el regulador puede inspeccionar → **logs y datos accesibles localmente** (no en cloud foráneo).
- Si hay transferencia internacional legítima → **encriptación + DPA + auditoría** del proveedor cloud.

### 2. Costos (es un trade-off explícito)

La cátedra enfatiza que **costos vs tiempo es uno de los dos trade-offs obligatorios** del parcial. El hosting es donde más se cristaliza.

**Componentes a estimar:**

| Modalidad | Capex | Opex | Tiempo a producción | Riesgos |
|---|---|---|---|---|
| **Cloud público** (AWS/GCP/Azure) | Bajo | Alto (mensual recurring, crece con uso) | Días a semanas | Lock-in, costo creciente con escala |
| **On-premise propio** | Muy alto (hardware, racks, networking, refrigeración) | Bajo (energía + staff) | Meses a un año | Imprevistos de hardware, capacidad rígida |
| **Data center alquilado** (colocation) | Medio (hardware propio) | Medio (alquiler de rack + energía + staff) | Semanas a meses | Vendor lock-in del colo, SLAs del proveedor |
| **Híbrido** | Variable | Variable | Variable | Complejidad operativa duplicada |

> **Patrón común en empresas medianas:** el modelo "on-premise" suele ser realmente un **colocation** — el equipo (servidores, switches) es propio, pero el espacio físico, la energía y la conectividad son alquilados a un data center (Equinix, Telecom, Telefónica, etc.). La cátedra menciona explícitamente este patrón (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md).

**Cómo cuantificar para el parcial:**
- Estimar costo a 3 años (no a 1) — el cloud "barato" se acumula.
- Incluir staff: cloud no necesita ops de hardware pero necesita FinOps; on-prem necesita ambos.
- Considerar elasticidad: si la carga varía 10× entre pico y valle, on-prem paga el pico permanente.

### 3. Latencia (la geografía manda)

La velocidad de la luz no es negociable. Cada salto geográfico paga su latencia:

| Trayecto típico | Latencia esperable |
|---|---|
| Argentina → us-east-1 (Virginia) | 130-160 ms RTT |
| Argentina → us-west-1 (California) | 180-220 ms RTT |
| Argentina → sa-east-1 (São Paulo) | 25-40 ms RTT |
| Argentina → Argentina (data center local) | 1-5 ms RTT |

**Implicancia:**
- Si el grueso de usuarios está en una región y el sistema está en otra, **toda interacción paga el cable submarino**.
- Para escenarios de Performance del [[Árbol de utilidad]] que exigen p95 < 200 ms, el hosting geográfico es **decisión previa** al diseño del backend.
- Solución típica: **CDN/edge cerca del usuario** + **backend cerca de la base de datos** (ver [[Caso mock — Plataforma de streaming de video on-demand]] y [[Principio de localidad]]).

## Cómo entra en el parcial

La estructura mínima de respuesta del parcial pide **2 trade-offs** (ver [[Clase 8 — Consultas pre-parcial]]):

1. Atributo vs atributo (p. ej. Security vs Usability).
2. **Costos vs tiempo** ← acá entra la decisión de hosting.

**Recomendación de redacción:**

> "Optamos por [cloud público en sa-east-1 / on-premise en Argentina / data center alquilado en CABA] porque (a) el marco regulatorio exige residencia en X — *fuente: Ley/regulación/contrato*; (b) el costo a 3 años estimado es Y, comparable al opex cloud equivalente; (c) la latencia geográfica para nuestra audiencia mayoritaria es Z ms — viable para el escenario de Performance H/H del árbol. **Trade-off explícito:** sacrificamos Z (p. ej. elasticidad / time-to-market / capex inicial) a cambio de W (p. ej. control / costo predecible / compliance)."

## Trade-offs derivados

| Trade-off | Cloud público | On-premise / Colocation |
|---|---|---|
| **Time-to-market vs Capex** | Rápido, bajo capex | Lento, alto capex |
| **Elasticidad vs Costo predecible** | Elástico, opex variable | Rígido, opex predecible |
| **Compliance vs Conveniencia** | Depende de la región del proveedor | Control total sobre jurisdicción |
| **Maintainability vs Especialización** | Menor staff de infra, más FinOps | Mayor staff de infra, menos FinOps |
| **Lock-in vs Servicios gestionados** | Lock-in alto si usás servicios PaaS exclusivos | Sin lock-in de proveedor cloud, pero sí de hardware |

## Falacias comunes a evitar

- *"Cloud es siempre más barato"* — falso, depende del patrón de uso, escala y staffing.
- *"On-prem es más seguro"* — depende. Un equipo mediocre on-prem es menos seguro que AWS bien configurado.
- *"Multi-cloud resuelve lock-in"* — agrega complejidad operativa que rara vez compensa el riesgo de lock-in real.
- *"Edge computing reemplaza al data center"* — son complementarios; edge resuelve latencia, no resuelve durabilidad ni transactividad.

## Pregunta a profundizar

¿Cómo se compara la decisión de hosting de [[Caso Compraventa de Acciones]] (consola Ops en infra separada vía VPN, MFA selectiva) con una arquitectura puramente cloud-native? ¿Qué parte de la decisión es regulatoria y qué parte es Security/Auditability?

## Fuentes y lecturas

- Schrems II — sentencia del TJUE (Caso C-311/18, 2020) sobre transferencias UE→EE.UU.
- AWS *Well-Architected Framework* — pilar de cost optimization.
- *Cloud Strategy* — Gregor Hohpe (sobre patrones híbridos).
- Ley 25.326 (Protección de Datos Personales, AR) y su decreto reglamentario.
- GDPR (UE 2016/679), LGPD (BR 13.709/2018).
