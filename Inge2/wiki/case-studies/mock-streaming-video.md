---
title: "Caso mock — Plataforma de streaming de video on-demand"
aliases:
  - "Caso mock — Streaming"
  - "Mock streaming"
type: case-study
created: 2026-05-13
updated: 2026-05-13
tags: [case-study, mock, parcial, streaming, cdn, scalability, drm, recomendaciones]
sources:
  - "study/js/data/mock-cases.js"
related:
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Partition, Replicate, Index]]"
  - "[[Off-line vs Online computation]]"
  - "[[Memory hierarchy]]"
  - "[[Principio de localidad]]"
  - "[[Sharding]]"
  - "[[Bases no relacionales]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[Enunciados de parciales — 6 casos]]"
---

# Caso mock — Plataforma de streaming de video on-demand

## Por qué este caso está en el wiki

Caso mock de parcial curado por el wiki. Ejercita explícitamente los principios de Kallen — [[Partition, Replicate, Index]], [[Off-line vs Online computation]] y [[Memory hierarchy]] — pero en un dominio distinto al de [[Caso Twitter — Big Data en tiempo real|Twitter]]. Útil para verificar que el alumno generaliza los principios, no los memoriza para un dominio único. Alimenta el [[Generador de casos mock de parcial|generador]].

> Caso **sintético**, no histórico. Inspirado en el catálogo público de decisiones de Netflix, Disney+ y plataformas regionales latinoamericanas. No citar como hecho de ninguna empresa específica.

## Dominio

Servicio de streaming tipo Netflix regional con catálogo de películas y series, recomendaciones personalizadas, perfiles familiares y producción original.

## Contexto del enunciado

Una compañía de medios latinoamericana, después de años licenciando contenido a plataformas globales, decide lanzar su propio servicio de streaming OTT (Over-The-Top) cubriendo Argentina, Chile, Uruguay, Paraguay y Bolivia. Quiere capitalizar su catálogo histórico (~15.000 títulos), sumar producción original y competir con los gigantes globales en su nicho regional.

El target inicial es **4 millones de suscriptores en 24 meses**, con un pico esperado de **600.000 streams concurrentes** los viernes y sábados a la noche. Cada stream consume entre 3 Mbps (SD) y 25 Mbps (4K HDR); el catálogo pesa ~500 TB después del transcoding en múltiples bitrates.

Los derechos de contenido tienen ventanas **temporales** (un título disponible 6 meses, luego sale del catálogo) y **geográficas** (a veces sólo Argentina, otras toda la región). Las recomendaciones personalizadas son percibidas por marketing como el principal diferenciador contra el catálogo más limitado vs. los globales.

El equipo es pequeño en relación al ambicioso scope: 6 squads, presupuesto de CDN ajustado, deadline político (lanzar antes de un evento deportivo regional). Los ejecutivos quieren "la próxima Netflix" pero con la billetera de un broadcaster tradicional.

## Stakeholders

- Suscriptores finales (familias, gamers, fans deportivos)
- Equipo de contenido / programación
- Equipo legal de derechos (ventanas geográficas y temporales)
- Marketing y crecimiento (churn prevention)
- Equipo de recomendaciones / data science
- Producción original
- Operadores de CDN (Akamai, Cloudflare, Fastly, ISPs regionales)
- Anunciantes (si el modelo es AVOD/híbrido)
- Equipo de pagos y suscripciones
- Operaciones / SRE

## Atributos de calidad priorizados

> Tomados **exclusivamente** de la tabla ISO 25000 de la cátedra (ver [[Atributos de Calidad — tabla ISO 25000 (cátedra)]]). Atención: *personalization* es una funcionalidad, no un atributo de calidad; *cost-efficiency* es una restricción de negocio (constraint), no un QA; *compliance regional* se subsume en `Auditability` y `Security`.

1. **Scalability** — picos 5× sobre carga media; escalado horizontal masivo en CDN.
2. **Performance** — startup latency < 2 s; rebuffering < 1% del tiempo de stream.
3. **Availability** — 99.95% en horario prime (20-24 hs).
4. **Security** — protección de contenido (DRM), prevención de cuenta compartida, datos de pago.
5. **Auditability** — derechos por país y por ventana temporal exigen trazabilidad de qué se sirvió a quién.
6. **Maintainability** — catálogo, derechos y producción evolucionan continuamente.
7. **Interoperability** — múltiples CDNs, pasarelas de pago regionales, dispositivos heterogéneos.

## Decisiones arquitectónicas curadas

| Decisión | Rationale |
|---|---|
| **CDN multi-vendor** con origin shielding y caching jerárquico (edge → regional → origin) | El 95% del tráfico debe servirse desde edge cercano al usuario; un solo CDN es SPOF y trampa de pricing. [[Principio de localidad]] espacial. |
| Pipeline de transcoding asincrónico con **múltiples bitrates** (ABR — Adaptive Bitrate Streaming, HLS/DASH) | Cada cliente elige el bitrate según ancho de banda; reduce rebuffering. [[Off-line vs Online computation\|Off-line]]: transcodear al entrar al catálogo, no en cada request. |
| Catálogo y derechos **materializados por país-perfil** cada hora, separados del motor de playback | Reads >>> writes y la query es bounded ("qué títulos puede ver este usuario hoy"). Patrón Kallen/Twitter. |
| **Recomendaciones online** via servicio dedicado: feature store en KV (Redis) + modelo GPU, con **fallback a top-N** por país | Latencia < 50 ms en home; si el modelo falla, top-N basta y la home no queda vacía. Defense in depth contra ML downtime. |
| **Event sourcing** del comportamiento (play, pause, seek, abandono) en Kafka → data lake → batch features | Los eventos son source of truth, no la base operacional. |
| **DRM** (Widevine/PlayReady/FairPlay) con key rotation y device limits | Sin DRM no hay contrato con estudios mayores. |
| **Cold tier** (S3 Glacier) para master files; hot tier sólo bitrates servibles | Master de 100 GB no se sirve nunca al usuario — guardarlo en hot es quemar plata. [[Memory hierarchy]]. |

## Lecciones aprendidas

1. **Scalability se compra con [[Partition, Replicate, Index|Partition + Replicate + Index]]** — no hay magia, no hay shortcut.
2. **Off-line/precompute** domina cuando reads >>> writes y la query es bounded.
3. Multi-CDN no es paranoia: es palanca de negociación y resilience.
4. ABR + edge caching son el par canónico que define la economía del streaming.
5. **Recomendar bien con fallback** es mejor que recomendar perfecto sin fallback.
6. [[Memory hierarchy]] aplicada: master en cold, bitrates en hot, edges cerca del usuario.
7. **Los derechos son parte del modelo de dominio**, no un detalle de implementación.

## Trampas y anti-patrones

- Single-CDN: cuando el contrato sube 80%, no podés migrar en 6 meses.
- Transcodear on-demand: el primer viewer paga la cuenta de CPU de los siguientes.
- Materializar el catálogo en cada request (1 query por click = death by latency).
- Recomendaciones acopladas al motor de playback (cuando ML cae, todo cae).
- DRM como afterthought (los estudios cancelan contratos sin DRM operativo).
- Asumir que un día con evento deportivo es "igual que otro día" (es 10×).
- Servir master files al edge (paga por GB lo que no usa nadie).

## Pregunta a profundizar

¿Cómo se compara la arquitectura de catálogo/recomendaciones de este caso con la **timeline precomputado** de [[Caso Twitter — Big Data en tiempo real|Twitter]]? ¿Son el mismo patrón aplicado a dominios distintos?

## Cómo se usa este caso

Sorteado por el [[Generador de casos mock de parcial|generador]]. Es el caso "Kallen aplicado" del banco — el que verifica que el alumno internalizó [[Partition, Replicate, Index]] como mantra, no como anécdota.
