---
title: "Caso mock — Plataforma de telemedicina interregional"
aliases:
  - "Caso mock — Telemedicina interregional"
  - "Mock telemedicina"
type: case-study
created: 2026-05-13
updated: 2026-05-13
tags: [case-study, mock, parcial, telemedicina, salud, privacidad, hl7-fhir, interoperabilidad]
sources:
  - "study/js/data/mock-cases.js"
related:
  - "[[Attribute Driven Design]]"
  - "[[Atributos de calidad]]"
  - "[[Árbol de utilidad]]"
  - "[[Estilos arquitectónicos]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Teorema CAP]]"
  - "[[Principio de localidad]]"
  - "[[Architectural Guardrails]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Enunciados de parciales — 6 casos]]"
---

# Caso mock — Plataforma de telemedicina interregional

## Por qué este caso está en el wiki

Es un **caso mock de parcial** curado por el wiki, con la misma estructura y nivel de detalle que los casos canónicos de la cátedra ([[Caso Healthcare.gov|Healthcare.gov]], [[Caso Twitter — Big Data en tiempo real|Twitter]], [[Caso Compraventa de Acciones|Compraventa]]). Su rol es alimentar el **Generador de casos mock de parcial** de la página de estudio (`study/js/tools/case-simulator.js`) para que los sorteos de práctica tengan un enunciado largo y realista, en vez de una combinación seca dominio × variación.

> Es un caso **sintético**: no es una historia real. Está construido sobre patrones reconocibles de la industria (HL7 FHIR, WebRTC, lecciones del fracaso de [[Caso Healthcare.gov|Healthcare.gov]] y del éxito de [[Caso Compraventa de Acciones|Compraventa]] sobre el primado de Security cuando "la naturaleza de los datos manda"). No citar como hecho histórico — sí citar como kata.

## Dominio

Red de prestadores de salud que ofrece consultas médicas por video, prescripción electrónica e historia clínica unificada para pacientes de múltiples provincias y obras sociales.

## Contexto del enunciado

Un consorcio de obras sociales y prepagas, junto con tres ministerios provinciales, decide lanzar una plataforma compartida de telemedicina luego de la experiencia de la pandemia. El sistema debe atender consultas sincrónicas por video, derivaciones a especialistas, emisión de recetas electrónicas firmadas digitalmente y mantenimiento de una historia clínica electrónica (HCE) interoperable.

El alcance inicial cubre **3 millones de afiliados** con un pico estimado de **12.000 consultas concurrentes** en horas punta (mañana del lunes y noche del domingo). Los datos médicos están sujetos a la **Ley 25.326** de protección de datos personales y a la **Ley 26.529** de derechos del paciente; además se exige **interoperabilidad con HL7 FHIR R4** y con los sistemas de historia clínica preexistentes de cada provincia (algunos sobre Oracle on-prem, otros sobre Postgres, otros sobre archivos planos exportados nocturnamente).

El consorcio tiene **18 meses** para llegar a producción y un equipo distribuido de 9 squads de desarrollo. La prensa observa el proyecto porque dos intentos previos fracasaron: uno por incompatibilidades regulatorias entre provincias, otro porque la plataforma quedó cautiva de un único proveedor que luego subió el contrato 400%. El consorcio quiere evitar ambos finales y exige arquitectura abierta, evolución incremental y posibilidad de migrar proveedores sin reescribir el dominio.

## Stakeholders

- Pacientes afiliados (web y app móvil)
- Médicos generales y especialistas (agenda, ficha clínica, recetas en < 1 min)
- Coordinadores de prestadores
- Ministerios provinciales de salud (reportes epidemiológicos, auditoría)
- Obras sociales y prepagas (facturación, autorizaciones, cápita)
- ANMAT / autoridad sanitaria (recetas, sustancias controladas)
- Equipo de seguridad y compliance (Ley 25.326, auditoría externa)
- Operaciones / SRE (uptime 24×7)
- Equipo de datos / epidemiología (BI sobre datos disociados)
- Proveedores externos (WebRTC SaaS, firma digital, identidad)

## Atributos de calidad priorizados

> Tomados **exclusivamente** de la tabla ISO 25000 de la cátedra (ver [[Atributos de Calidad — tabla ISO 25000 (cátedra)]]). Sin nombres inventados (privacy, modifiability, etc.) — todo debe mapear a uno de los 19 atributos canónicos.

1. **Security** — datos médicos son categoría especial bajo Ley 25.326 (cubre lo que coloquialmente llamaríamos "privacy"); un breach implica sanciones regulatorias y destrucción de confianza.
2. **Availability** — 99.9% en horario de atención (7-23 hs); degradación parcial preferible a caída total.
3. **Interoperability** — HL7 FHIR R4 con HCEs heterogéneas; sin lock-in con proveedores.
4. **Performance** — latencia de video p95 < 200 ms; carga de ficha < 1.5 s.
5. **Scalability** — picos 4× sobre carga media; eventos epidemiológicos pueden generar 10×.
6. **Auditability** — toda receta de sustancia controlada trazable a (médico, paciente, fecha) por 10 años.
7. **Maintainability** — el sistema evoluciona 10+ años con rotación de proveedores y squads.

## Decisiones arquitectónicas curadas

| Decisión | Rationale |
|---|---|
| **Bounded contexts por subdominio** (Agenda, Consulta sincrónica, HCE, Recetas, Facturación) con APIs HL7 FHIR como contrato externo | Permite reemplazar el proveedor de video o de firma digital sin tocar el resto; evita el lock-in que mató los intentos anteriores. La naturaleza del dominio (clínico, regulatorio, financiero) tiene fronteras claras (Evans, *Domain-Driven Design*). |
| **Separación plano de control (HTTP/REST) vs plano de datos en vivo (WebRTC P2P con TURN como fallback)** | El video tiene un perfil de latencia y costo radicalmente distinto del CRUD clínico; mezclarlos obliga a sobre-dimensionar todo. Análogo a la separación broker vs media server en SIP. |
| **HCE como event-sourced store append-only con proyecciones materializadas por especialidad** | Auditability requiere reconstruir el estado clínico en cualquier punto del tiempo. Append-only + projections es el patrón canónico (Fowler, Event Sourcing). |
| **Recetas firmadas digitalmente con HSM y verificación offline contra clave pública publicada** | Una receta debe ser verificable años después, incluso si el sistema central está caído. Defense in depth contra repudio. |
| **MFA sólo para médicos y operaciones administrativas; pacientes con magic link + biometría del dispositivo** | Trade-off explícito Security ↔ Usability — fricción aceptable para quien prescribe, inaceptable para el abuelo que se conecta una vez al mes. |
| **Cache regional (por provincia) de catálogos y datos de afiliación, invalidado vía pub-sub** | [[Principio de localidad]] espacial: la mayoría de las queries son locales a la provincia del paciente. |

## Lecciones aprendidas

1. En dominios regulados, **la naturaleza de los datos manda** — Security/Privacy lidera sobre Performance (ver [[Caso Compraventa de Acciones]]).
2. Los **bounded contexts** no son sólo organizacionales: son la herramienta principal anti-lock-in.
3. Separar plano de control de plano de datos cuando los perfiles de QoS son incompatibles.
4. Event sourcing paga su complejidad cuando la auditoría es exigida por ley.
5. **MFA selectiva por rol**: aplicar fricción donde el riesgo lo justifica.
6. Standardizar el contrato externo (FHIR) aunque el interno sea más simple — desacopla de la heterogeneidad.
7. **Degradación parcial > caída total**: si el video falla, queda el chat; si el chat falla, queda la cola asincrónica.

## Trampas y anti-patrones

- Tratar el video como un CRUD más y dimensionar la base relacional para soportarlo.
- Usar el motor de la HCE como cola de eventos clínicos (acopla auditoría con operación).
- Single-tenant por provincia → 24 sistemas distintos (death by federation).
- Multi-tenant sin segregación por provincia → un breach contamina las 24.
- Acoplarse a un proveedor de video sin abstracción de transporte.
- MFA en cada consulta → médicos comparten credenciales.
- Datos clínicos sin encriptación at-rest "porque la base ya está en VPN".

## Pregunta a profundizar

¿Cómo se compara esta arquitectura con la que *debería* haber tenido [[Caso Healthcare.gov|Healthcare.gov]]? ¿Los bounded contexts habrían absorbido la presión de los 55+ contratistas, o el problema era más de governance que de arquitectura?

## Cómo se usa este caso

- En el **[[Generador de casos mock de parcial|generador]]** (`study/js/tools/case-simulator.js`) — se sortea junto a los otros 5 mocks.
- En autoestudio — leer el enunciado y resolver los 6 incisos sin mirar la sección "Decisiones curadas". Compararla recién después.
