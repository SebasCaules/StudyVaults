---
title: Clase 8 — Consultas pre-parcial
aliases:
  - "Clase 8 — Consultas pre-parcial"
  - "Clase 8"
  - "Consultas pre-parcial"
type: class
created: 2026-05-15
updated: 2026-05-15
date: 2026-05-14
tags: [clase, parcial, consultas, pre-parcial, atributos-de-calidad, anti-patrones, hosting, data-residency]
sources:
  - "raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md"
related:
  - "[[Clase 7 — Caso Compraventa de Acciones]]"
  - "[[Atributos de calidad]]"
  - "[[Atributos de Calidad — tabla ISO 25000 (cátedra)]]"
  - "[[Attribute Driven Design]]"
  - "[[Árbol de utilidad]]"
  - "[[Anti-patrones de parcial]]"
  - "[[Criterios de hosting y data residency]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Banco de casos mock de parcial]]"
---

# Clase 8 — Consultas pre-parcial

## TL;DR

Clase de consultas previa al parcial integrador. La cátedra responde dudas y deja explícitos: (1) la **estructura mínima** que debe tener una respuesta de parcial (trade-offs + diagrama + componentes + escenarios), (2) la lista de **anti-patrones que descalifican** ("2 automático"), (3) **distinciones finas entre atributos** de la tabla ISO 25000 que se confunden seguido en parciales, y (4) **criterios de hosting** (cloud vs on-prem vs data center) introducidos por primera vez en el curso (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md).

## Mapa conceptual

- Estructura del parcial → [[Attribute Driven Design]] · [[Árbol de utilidad]]
- Anti-patrones de parcial → [[Anti-patrones de parcial]]
- Criterios de hosting → [[Criterios de hosting y data residency]]
- Refinamiento de atributos → [[Atributos de calidad]]
- Auditability arquitectónico → [[Atributos de calidad]] · [[Mecanismos de seguridad]]
- Definición operativa de riesgo → [[ATAM]]

## Desarrollo

### Estructura mínima de la respuesta de parcial

La cátedra explicita la **forma esperada** de la respuesta arquitectónica (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md):

1. **Al menos 2 trade-offs**, con la siguiente composición mínima:
   - Uno **atributo vs atributo** (p. ej. Security vs Usability, Performance vs Maintainability).
   - Uno **costos vs tiempo** (p. ej. on-prem ahorra recurring pero retrasa lanzamiento; cloud acelera pero acumula opex).
2. **Diagrama** de la arquitectura (componentes + conectores). El estilo del diagrama no se prescribe; lo importante es que los componentes y los flujos sean legibles.
3. **Explicación de los componentes elegidos** — para cada componente: qué responsabilidad cubre y por qué está acá y no en otro componente. Sin explicación, el diagrama "es hopes and dreams".
4. **Escenarios** — concretos, con métrica verificable. La cátedra usa la convención S-S-E-A-R-Measure del [[Árbol de utilidad]].

> **Lectura**: estos cuatro elementos no son adornos, son los **outputs canónicos de [[Attribute Driven Design]]**. Un parcial sin alguno está incompleto y suele aprobarse al límite o reprobar.

### Anti-patrones que dan "2 automático"

La cátedra enumera **errores que descalifican** la respuesta, independientemente de lo demás (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md). Ver [[Anti-patrones de parcial]] para el catálogo completo. Los del día:

| # | Anti-patrón | Por qué descalifica |
|---|---|---|
| 1 | **"Poner colas y esperar que sea request-response"** | Una cola desacopla productor de consumidor: por construcción es **asincrónica**. Sincronizar el response sobre una cola es desperdiciar la cola y construir un mecanismo más frágil que un HTTP request. |
| 2 | **"Escalamiento horizontal sin Load Balancer"** | Sin LB no hay distribución de carga: añadir réplicas no agrega capacidad efectiva. El LB es **parte constituyente** del escalado horizontal, no un accesorio. |
| 3 | **"Cachear datos que no deberían ser cacheados"** | Cachear datos con TTL ambiguo o datos sensibles a freshness genera bugs no-deterministas y problemas de seguridad. *(Menos grave que los demás, pero igual penaliza.)* |
| 4 | **"Olvidarte sistemas externos"** | Toda integración con un sistema externo es un punto de falla con su propio modelo de fallas (latencia, partición, contrato cambiante). Ignorarlos en el diagrama esconde dependencias críticas. |
| 5 | **"Usar bases OLAP para transaccional"** | Las bases [[OLAP y ETL\|OLAP]] están diseñadas para queries analíticas de lectura sobre datos desnormalizados; el patrón transaccional (escritura concurrente, baja latencia, ACID) requiere [[Bases de datos relacionales\|OLTP]]. Confundirlas es no haber leído la unidad de persistencia. |

### Criterios para decidir dónde alojar el sistema

Primera vez en el curso que se discute formalmente la decisión **cloud / on-premise / data center alquilado** (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md). Ver [[Criterios de hosting y data residency]] para el desarrollo. Los tres criterios:

1. **Marco regulatorio (data residency)** — leyes que obligan a que los datos residan bajo jurisdicción específica.
   - Ejemplo: **Corea del Sur** sólo permite guardar información de sus residentes en data centers ubicados en Corea del Sur.
   - Ejemplo: **México** (1ª gestión Trump) emitió normativa que exigía que los datos financieros residieran en al menos un data center fuera de regulaciones de EE.UU.
2. **Costos** — es un trade-off explícito (uno de los dos trade-offs obligatorios del parcial). Incluir mantenimiento + compra de hardware + opex de cloud. El modelo común "on-premise" en empresas medianas suele ser **equipo propio en un data center alquilado**: el equipo es mío, el espacio físico y la energía son de otro.
3. **Latencia** — la geografía manda. Si el grueso de usuarios está en Sudamérica, hostear en us-east-1 paga el costo del cable submarino en cada request.

### Refinamientos de atributos de calidad

La clase deja explícitas distinciones que se confunden en parciales:

#### Availability vs Reliability

> **Availability**: porcentaje de tiempo disponible en una ventana.
> **Reliability**: funcionamiento **ininterrumpido** manteniendo un buen servicio durante una ventana de tiempo.

**Ejemplo dado por la cátedra (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md):**

Un programa que se reinicia cada 1 hora y tarda 1 segundo en reiniciarse:
- **Es Available** (~99.97% del tiempo disponible).
- **No es Reliable** (se corta cada hora — se interrumpe).

**Implicancia para parcial:** si el dominio exige "no interrumpir una operación en curso" (p. ej. una subasta en vivo, una consulta médica por video, una transacción financiera), el atributo dominante es **Reliability**, no Availability. Esto se ve en el [[Caso mock — Plataforma de subastas en tiempo real|caso mock de subastas]] y en el [[Caso Compraventa de Acciones]].

#### Interoperability vs Fault Tolerance

> **Interoperability tiene dos caras**: como **cliente** (cómo me conecto fácil al resto) y como **servidor** (cómo hago fácil que el resto se conecten conmigo).

Que sean dos caras importa para el diagrama: una arquitectura interoperable suele tener **una capa de adapters/anti-corruption layer** para cada lado.

> **Fault Tolerance** es responder ante la **caída** de un componente externo, no ante la **incompatibilidad** del protocolo. Confundirlos lleva a "soluciones" que ni protegen del fallo ni resuelven la integración.

#### Manageability — qué significa operativamente

> **Manageability** está pensado desde el rol del **sysadmin**: tiene que entender si la app está funcionando bien o no. Siempre se evalúa en el contexto de la **salud del sistema**.

Métricas típicas: presencia de dashboards de salud, alarmas, instrumentación (Prometheus/Grafana/Datadog), **golden signals** (latency, traffic, errors, saturation). Sin Manageability operativa, no hay forma de cumplir un SLO.

#### Customizability — orientación

> **Customizability está orientada al usuario final** (no al sysadmin, que cae en Manageability).

Ejemplos: temas claros/oscuros, layouts configurables, idioma, perfiles. Útil distinguirlo de Usability: Usability es qué tan bien una UI estándar cumple su tarea; Customizability es la capacidad del usuario de **alterar** esa UI.

#### Auditability — implicancia arquitectónica concreta

> **Cuando se pone Auditability, todos los logs deben estar en un storage separado y con un control de acceso distinto.**

Esto es **más fuerte** que "loguear todo": exige separación física/lógica de los logs y **segregación de credenciales** (quien opera la app no debe poder borrar/alterar los logs de auditoría). Es el patrón de **separation of duties** aplicado a logs. Combinable con append-only stores (event sourcing, WORM storage).

Implicancia para los casos mock con Auditability prioritario (telemedicina, voto electrónico, subastas, logística): el diagrama de arquitectura debe **mostrar el log store como un componente aparte** con su propio control de acceso, no como una tabla en la base operacional.

### Definición operativa de riesgo

> **Si es una situación posible y probable, y el sistema no la resuelve: es un riesgo.**

Es la definición que la cátedra espera ver invocada explícitamente en el inciso *e/f) riesgos* de los parciales. Estructuralmente: `(probabilidad × impacto) AND ¬cubierto_por_la_arquitectura ⇒ riesgo`.

### Cache — invariantes a documentar

> Tema cache: hay que guardar **cuándo se guardaba** y **cuándo se invalida**.

Mínimo para una decisión de cache en el parcial:
- **TTL** o regla de invalidación (por evento, por escritura, manual).
- **Política de coherencia** (cache-aside, write-through, write-behind, refresh-ahead).
- **Visibilidad de stale reads** (¿qué pasa si un cliente lee dato viejo?).

### Herramientas mencionadas al pasar

- **Lighthouse** — tool de Google que analiza performance/accesibilidad/SEO/PWA sobre páginas web. Útil para evidenciar métricas de Performance/Accessibility/Usability en escenarios del árbol de utilidad.
- **File server** — file system que guarda archivos (a diferencia de un *object store* tipo S3 o un *blob store* tipo Azure Blob). Mencionado como categoría de persistencia.
- **Elasticsearch** — *(pendiente de profundizar — la cátedra invita a investigar).* Motor de búsqueda y analytics sobre documentos JSON, basado en Lucene. Patrón de uso típico: índices invertidos para full-text search + agregaciones sobre logs/eventos.

## Decisiones clave discutidas

| Decisión | Opciones | Criterio | Recomendación cátedra |
|---|---|---|---|
| Dónde alojar el sistema | Cloud público / On-prem propio / Data center alquilado | Regulatorio + Costos + Latencia | Depende; explicitarlo como trade-off costos vs tiempo y como restricción regulatoria |
| Cuántos trade-offs explicitar | Cero / Uno / Mínimo dos | Estructura mínima de parcial | **Mínimo 2**: uno atributo-atributo y uno costos-tiempo |
| Cómo modelar logs de auditoría | Misma DB / Tabla aparte / Storage separado con control de acceso distinto | Auditability como atributo | **Storage separado + control de acceso distinto** |
| Acoplar Avail con Reliab | Tratarlos como sinónimos / Distinguirlos | Naturaleza del dominio | Distinguir: dominios con operaciones en curso priorizan Reliability |
| Cache | "Lo cacheamos y listo" / Documentar invariantes | Coherencia | Documentar TTL e invalidación; nunca cachear datos sensibles a freshness sin política explícita |

## Ejemplos vistos

- **Programa que se reinicia cada hora** — ejemplo canónico de "available pero no reliable" (ver Availability vs Reliability arriba).
- **Corea del Sur / México** — ejemplos de data residency forzando hosting (ver Criterios de hosting arriba).

## Preguntas para el final / parcial

1. Mostrame dos trade-offs de tu arquitectura, uno entre atributos y uno entre costos y tiempo.
2. Tenés un sistema cuya operación dura 4 minutos por usuario y no se puede interrumpir. ¿Priorizás Availability o Reliability? ¿Por qué?
3. ¿Cuándo cachear no es solución sino problema? Dame un ejemplo del dominio del caso.
4. Tu sistema tiene Auditability como atributo prioritario. Mostrame en el diagrama dónde están los logs de auditoría y qué control de acceso tienen.
5. ¿Cómo justificás hostear en AWS us-east-1 si el 80% de tus usuarios están en Argentina?
6. Si tu sistema escala horizontalmente, mostrame el Load Balancer en el diagrama. Si no está, explicáme cómo distribuís la carga sin él.
7. ¿Qué diferencia hay entre Fault Tolerance e Interoperability cuando integrás con un sistema externo que se cae intermitentemente?
8. Defíniome riesgo. ¿Cómo lo distingo de un problema actual?

## Lecturas complementarias

- Tabla ISO 25000 de la cátedra — [[Atributos de Calidad — tabla ISO 25000 (cátedra)]].
- Sobre cache invalidation: Phil Karlton, *"There are only two hard things in Computer Science: cache invalidation and naming things."*
- Sobre golden signals: Google SRE Book — *Monitoring Distributed Systems*.
- Sobre data residency: Schrems II (UE-EE.UU.), Ley 25.326 (AR), GDPR (UE), LGPD (BR).
- Lighthouse — documentación oficial de Google.
- Elasticsearch — *The Definitive Guide* (Gormley & Tong).

## Pregunta a profundizar

¿Cuándo Reliability se vuelve indistinguible de Availability operativamente? Hipótesis: cuando la operación atendida es **stateless y corta** (un click HTTP request-response sub-segundo), Reliability colapsa a Availability porque la "interrupción" no afecta una operación en curso. Cuando la operación es **stateful y larga** (videoconsulta, subasta live, transferencia bancaria multi-paso), Reliability domina porque el costo de interrumpir es la sesión completa, no un click.
