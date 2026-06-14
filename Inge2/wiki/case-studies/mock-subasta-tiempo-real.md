---
title: "Caso mock — Plataforma de subastas en tiempo real"
aliases:
  - "Caso mock — Subastas"
  - "Mock subastas"
type: case-study
created: 2026-05-13
updated: 2026-05-13
tags: [case-study, mock, parcial, subastas, order-book, consistency, cap, event-sourcing]
sources:
  - "study/js/data/mock-cases.js"
related:
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Teorema CAP]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Principio de localidad]]"
  - "[[Off-line vs Online computation]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Enunciados de parciales — 6 casos]]"
---

# Caso mock — Plataforma de subastas en tiempo real

## Por qué este caso está en el wiki

Caso mock de parcial curado por el wiki. Hermano conceptual de [[Caso Compraventa de Acciones]]: order book, latencia agresiva, consistency fuerte, auditabilidad legal — pero con la diferencia clave del **modelo de cierre temporal** (extensión anti-sniping) que introduce un atributo nuevo de *Fairness*. Alimenta el [[Generador de casos mock de parcial|generador]].

> Caso **sintético**, no histórico. Mezcla patrones reconocibles de eBay, Sotheby's Online y Catawiki. No citar como hecho de ninguna casa de subastas específica.

## Dominio

Marketplace de subastas online donde múltiples compradores pujan en vivo por lotes (arte, autos, coleccionables, bienes incautados), con cierre automático y settlement.

## Contexto del enunciado

Una casa de subastas tradicional con 80 años de historia decide complementar sus remates presenciales con una plataforma 100% online de subastas en vivo. El modelo combina dos modalidades:

1. **Subastas timed** (24-72 hs, cierran a hora fija con extensión automática si hay pujas en los últimos 2 min — "anti-sniping").
2. **Subastas live** (un martillero modera en vivo por video, los pujadores online compiten con los presenciales en sala).

El catálogo incluye desde lotes de **200 USD hasta obras de 2 millones USD**; los compradores son particulares pero también casas comerciales que pujan automáticamente por bots. Volúmenes esperados: **80 subastas live por mes, 3.000 timed por mes, 25.000 usuarios registrados**, pico de **8.000 pujadores concurrentes** en una subasta live de alto perfil.

El cierre debe ser **determinístico**: si dos pujas llegan al mismo precio en milisegundos distintos, la primera gana; nunca puede haber ambigüedad legal sobre quién se llevó el lote. El settlement involucra integración con bancos, escribanos (para obras valiosas) y logística de envío.

La empresa ya tuvo un incidente con un competidor donde un bug permitió que un comprador "ganara" una subasta y luego no pagara, generando publicidad negativa. El directorio está obsesionado con que no vuelva a pasar. El equipo es de **12 personas**, fuerte en backend transaccional pero con poca experiencia en sistemas distribuidos en tiempo real.

## Stakeholders

- Pujadores particulares (humanos, browser y mobile)
- Pujadores institucionales (bots vía API)
- Casa de subastas (martilleros, expertos, catalogadores)
- Vendedores / consignatarios
- Equipo financiero (cobros, comisiones, settlement)
- Escribanos / abogados (lotes regulados)
- Bancos y procesadores de pago
- Compañías de logística (envío internacional con seguro)
- Equipo legal / compliance
- Operaciones / SRE
- Atacantes: shill bidders, repudiantes, intentos de sniping ilegal

## Atributos de calidad priorizados

> Tomados **exclusivamente** de la tabla ISO 25000 de la cátedra (ver [[Atributos de Calidad — tabla ISO 25000 (cátedra)]]). *Consistency* (de CAP) y *Fairness* NO son atributos de la tabla: lo que importa en el order book es `Reliability` (no perder pujas, sin ambigüedad de ganador) y `Precision` (orden estricto sin empates). La equidad entre pujadores remotos y presenciales se garantiza por mecanismos que combinan `Reliability` + `Auditability` + `Precision`.

1. **Reliability** — un solo ganador por lote, sin ambigüedad; ninguna puja se pierde durante el cierre.
2. **Precision** — orden estricto de pujas con timestamp del servidor; sin empates ambiguos.
3. **Performance** — latencia p99 < 200 ms en pujas, propagación < 500 ms.
4. **Availability** — caída de 30 s en un live de alto perfil es escándalo; sin rollback de subasta cerrada.
5. **Auditability** — toda puja con timestamp y firma; juicio comercial reconstruye orden completo.
6. **Security** — autenticación fuerte para pujas > umbral; anti-bots maliciosos; no repudio.
7. **Scalability** — picos 10× sobre carga media en subastas mediáticas.

## Decisiones arquitectónicas curadas

| Decisión | Rationale |
|---|---|
| **Order book por lote en motor in-memory con persistencia WAL** | Latencia inalcanzable con RDBMS clásico; durabilidad por log append-only (patrón prevalencia / Kallen). |
| **CP sobre AP** durante la subasta — ante partición, la subasta se pausa | Aceptar pujas en una partición destruye consistency. [[Teorema CAP]]: el dominio (legal, financiero) manda elegir C. |
| **Timestamp autoritativo del servidor** con NTP sincronizado a stratum 1; nunca confiar en el cliente | Cualquier puja con timestamp del cliente abre flanco de manipulación y litigio. |
| **Event sourcing** del ciclo de vida de cada subasta (open, bid, retract, extension, close) en append-only log | Auditoría judicial reconstruye exactamente qué pasó cuando. |
| **WebSockets con backpressure y reconexión idempotente**; fallback a polling | Push en tiempo real obligatorio; idempotencia evita pujas duplicadas en reconexión. |
| **Rate limit + reCAPTCHA + KYC + depósito de garantía** para pujas > umbral | Defense in depth contra bots maliciosos y repudio post-subasta. |
| **Anti-sniping**: extensión automática de 2 min si hay puja en los últimos 2 min | Fairness — replica el comportamiento del martillero ("a la una, a las dos, a las tres"). |
| **Settlement asincrónico desacoplado** | Cobro tarda horas/días (transferencias, escribano); no puede bloquear el ciclo de subastas. |

## Lecciones aprendidas

1. Order books en tiempo real exigen **consistency fuerte** — CAP elige C sin discusión.
2. Latencia sub-segundo viene de **in-memory + WAL**, no de RDBMS tradicional.
3. **Timestamp autoritativo del servidor** cierra una clase entera de ataques y litigios.
4. **Event sourcing** es el patrón natural cuando la auditoría judicial es requisito.
5. **Anti-sniping** es Fairness elevado a atributo arquitectónico.
6. **Settlement asincrónico** separa los ciclos de cobro y de subasta.
7. Defense in depth contra bots: rate limit + CAPTCHA + KYC + depósito.

## Trampas y anti-patrones

- Confiar en el timestamp del cliente para ordenar pujas.
- Order book sobre RDBMS clásico con locks pesimistas (no escala).
- AP durante partición — abre disputas legales por dobles ganadores.
- Cierre exacto sin extensión (sniping con bots gana toda subasta interesante).
- Acoplar settlement al ciclo de subasta (un banco lento detiene todas las subastas).
- Sin WAL: in-memory + caída = pujas perdidas + juicios.
- Login simple para pujas millonarias (repudio + scraping competitivo).
- WebSockets sin idempotencia (reconexión = puja duplicada).

## Pregunta a profundizar

¿Qué diferencia *Fairness* de *Consistency*? ¿Por qué necesitamos un atributo nuevo en vez de tratarlo como un caso particular de consistency?

## Cómo se usa este caso

Sorteado por el [[Generador de casos mock de parcial|generador]]. Excelente complemento de [[Caso Compraventa de Acciones]] — el alumno debe diferenciar dónde se parecen y dónde divergen (Fairness, settlement asincrónico, anti-sniping).
