---
title: "Caso mock — Sistema nacional de voto electrónico"
aliases:
  - "Caso mock — Voto electrónico"
  - "Mock voto"
type: case-study
created: 2026-05-13
updated: 2026-05-13
tags: [case-study, mock, parcial, voto-electronico, seguridad, auditabilidad, anonimato, adversarial]
sources:
  - "study/js/data/mock-cases.js"
related:
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Árbol de utilidad]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Teorema CAP]]"
  - "[[Architectural Guardrails]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Enunciados de parciales — 6 casos]]"
---

# Caso mock — Sistema nacional de voto electrónico

## Por qué este caso está en el wiki

Caso mock de parcial curado por el wiki. Caso emblemático para practicar diseño en **dominio adversarial**: hay un atacante motivado y sofisticado, el costo de fallo es total (deslegitima una elección), y exige reconciliar atributos aparentemente contradictorios — *anonimato* + *integridad* + *verificabilidad pública*. Alimenta el [[Generador de casos mock de parcial|generador]] de la página de estudio.

> Caso **sintético**, no histórico. Se inspira en literatura académica (Helios, STAR-Vote, trabajos de Adida y Benaloh) y en debates reales argentinos/regionales sobre voto electrónico. No citar como hecho histórico.

## Dominio

Plataforma de elecciones generales con voto electrónico presencial en mesa (kiosko offline-first) y escrutinio centralizado con auditoría pública verificable.

## Contexto del enunciado

El tribunal electoral nacional decide reemplazar el sistema tradicional de boletas papel por un sistema **híbrido**: en cada mesa de votación hay un kiosko electrónico que imprime un voucher con QR, el votante lo verifica y lo deposita en la urna física. Al cierre, las mesas transmiten el escrutinio cifrado al centro de cómputos, donde se agrega el resultado nacional.

Hay **80.000 mesas** distribuidas en todo el país, **30 millones de votantes** habilitados, ventana de votación de 10 horas con un pico de afluencia entre las 11 y las 13 hs. El sistema debe garantizar simultáneamente:

- **Anonimato** del votante (no se puede asociar voto con identidad).
- **Integridad** del escrutinio (nadie altera votos).
- **Verificabilidad pública** (cualquier ciudadano o partido puede recontar).
- **Resistencia a partición de red** (mesas rurales con conectividad intermitente deben poder operar).

La oposición política ya anunció que si pierde, va a impugnar técnicamente el sistema; por lo tanto cualquier ambigüedad arquitectónica se convierte en escándalo. Hay un contrato firme con la justicia electoral: el sistema debe poder ser **auditado por un panel internacional** sin acceder a credenciales privilegiadas. El primer simulacro nacional está a 4 meses del lanzamiento real.

## Stakeholders

- Votantes (deben confiar en el resultado; baja alfabetización digital en parte del padrón)
- Autoridades de mesa (operan el kiosko, no son técnicos)
- Fiscales partidarios (controlan apertura, escrutinio y transmisión)
- Tribunal electoral / justicia electoral (responsable jurídico)
- Partidos políticos (con incentivo a impugnar resultado adverso)
- Auditores internacionales (OEA, UE) — exigen verificabilidad sin privilegios
- Prensa y observadores ciudadanos
- Ministerio del Interior / seguridad (logística física, custodia)
- Equipo de desarrollo y operación
- **Adversarios plausibles**: actores estatales extranjeros, partidos derrotados, hacktivistas

## Atributos de calidad priorizados

> Tomados **exclusivamente** de la tabla ISO 25000 de la cátedra (ver [[Atributos de Calidad — tabla ISO 25000 (cátedra)]]). Conceptos como *verifiability*, *anonymity* o *integrity* NO son atributos de la tabla — se subsumen en `Auditability` y `Security` respectivamente.

1. **Auditability** — escrutinio reconstruible y verificable por terceros sin acceso a credenciales privilegiadas (incluye lo que coloquialmente llamamos *verifiability* pública).
2. **Security** — adversario sofisticado con recursos estatales; protege simultáneamente anonimato del votante e integridad del escrutinio (ambos son sub-aspectos de Security en la definición ISO).
3. **Availability** — el día de la elección no se puede caer; no hay rollback posible.
4. **Fault Tolerance** — mesas rurales con conectividad intermitente deben seguir operando y agregar después.
5. **Reliability** — el sistema opera 10 hs continuas sin fallar.
6. **Usability** — votante promedio tarda < 2 minutos sin asistencia, con baja alfabetización digital en parte del padrón.

## Decisiones arquitectónicas curadas

| Decisión | Rationale |
|---|---|
| **Air-gap** entre kiosko de votación y red pública — voucher impreso con QR firmado es el único bridge | Reduce drásticamente la superficie de ataque. El voucher impreso es además el medio de verificación independiente del software. |
| **Voto físico (papel) como source of truth**; el escrutinio electrónico es proyección verificable | Si el sistema electrónico falla, el papel permite recontar manualmente. Defense in depth contra el peor caso. |
| Esquema criptográfico **end-to-end verifiable (E2E-V)** tipo Helios/STAR-Vote | Auditabilidad pública sin revelar el voto individual. Es el estándar académico para voto electrónico. |
| **Mesas offline-first**: el kiosko funciona sin red, el escrutinio se transmite firmado al cierre | Resilience a partición; reduce el ataque en tiempo real durante la votación. |
| **Agregación jerárquica** de escrutinios: mesa → distrito → provincia → nacional, cada nivel firmado y publicado | Si un nivel se compromete, los anteriores siguen siendo verificables independientemente. |
| **Código abierto** del software de votación y kiosko; **binarios firmados reproducibles** | Verificabilidad pública lo exige. Cualquier panel internacional puede recompilar y comparar. |
| Sin reportes en tiempo real durante la votación; resultados sólo tras el cierre nacional | Evita influencia sobre votantes pendientes y reduce superficie de DDoS. |

## Lecciones aprendidas

1. En sistemas adversariales, la **verificabilidad pública** es atributo de calidad de primer orden.
2. **Anonimato e integridad** parecen contradictorios — la criptografía E2E-V los reconcilia con costo de complejidad.
3. **Air-gap físico** vence software hardening cuando el costo de fallo es total.
4. Papel + electrónico no es redundancia tonta: es defense in depth contra subversión del software.
5. **Open-source no es ideología**: es requisito de auditabilidad externa.
6. Offline-first reduce simultáneamente latencia, costo de red y superficie de ataque.
7. **Usability importa**: si el votante no entiende el voucher, no puede verificar nada.

## Trampas y anti-patrones

- Confundir "voto electrónico" con "voto por internet desde casa" (el segundo es órdenes de magnitud más difícil).
- Asumir que un buen TLS resuelve la confianza (TLS protege el canal, no resuelve coerción ni verificabilidad).
- Publicar resultados parciales en tiempo real (rompe modelo de amenazas y manipula al votante).
- Centralizar el escrutinio en una única autoridad técnica (SPOF de confianza).
- Borrar logs por "protección de datos" (rompe auditabilidad).
- Asumir conectividad 4G/5G en todas las mesas (zonas rurales).
- Diseñar para el votante técnicamente sofisticado.

## Pregunta a profundizar

¿Qué pasa cuando los atributos *Anonymity* y *Auditability* parecen contradictorios? ¿Cuál es la diferencia conceptual entre "verificable" (cualquiera lo puede chequear) y "auditable" (alguien con privilegios lo puede chequear)?

## Cómo se usa este caso

Sorteado por el [[Generador de casos mock de parcial|generador]]. Excelente caso para practicar el inciso *e) trade-offs* — anonimato vs auditabilidad es el ejemplo libro.
