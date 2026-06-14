---
title: Anti-patrones de parcial
aliases:
  - "Anti-patrones de parcial"
  - "Errores que descalifican"
  - "2 automático"
type: concept
created: 2026-05-15
updated: 2026-05-15
tags: [anti-patrones, parcial, errores, descalificacion, arquitectura]
sources:
  - "raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md"
related:
  - "[[Clase 8 — Consultas pre-parcial]]"
  - "[[Attribute Driven Design]]"
  - "[[Estilos arquitectónicos]]"
  - "[[OLAP y ETL]]"
  - "[[Bases de datos relacionales]]"
  - "[[Atributos de calidad]]"
  - "[[Banco de casos mock de parcial]]"
---

# Anti-patrones de parcial

## Rol

Lista curada de **errores que la cátedra considera descalificantes** (*"2 automático"*) en una respuesta de parcial, independientemente del resto del contenido. Originalmente enumerados en [[Clase 8 — Consultas pre-parcial]] del 2026-05-14 (source: raw/classes/2026-05-14 - Clase 8/Clase 8 - Consultas Pre Parcial.md).

> **Por qué descalifican y no sólo restan puntos:** porque revelan **incomprensión del modelo mental básico** del curso (cómo se asincroniza, cómo se escala, cómo se eligen motores de persistencia, cómo se integran sistemas externos). Un parcial es prueba de que el alumno internalizó el método ADD; estos errores rompen el método.

## El catálogo

### 1. "Poner colas y esperar que sea request-response"

**Lo que pasa:** el alumno dibuja una cola (RabbitMQ, Kafka, SQS) entre dos servicios pero modela la interacción como si fuera sincrónica — *"el servicio A pone el mensaje en la cola y espera la respuesta del servicio B"*.

**Por qué es error:**
- Una cola es por definición **un buffer asincrónico** que desacopla productor de consumidor temporalmente. Si esperás la respuesta, no ganaste desacople, perdiste simplicidad.
- Implementar "request-response sobre cola" (con correlation IDs, reply queues, timeouts) **es más frágil y complejo** que un HTTP request directo.

**Cuándo sí cola:** fire-and-forget, event-driven, work queues con resultados asincrónicos (notificaciones, batch, ETL, retries).

**Cuándo sí RPC:** consultas síncronas donde el caller necesita la respuesta para continuar.

**Mejora aceptable:** si querés response asincrónico real, usá *callback URL*, *webhook* o *async polling* — no fingir RPC sobre cola.

---

### 2. "Escalamiento horizontal sin Load Balancer"

**Lo que pasa:** el alumno menciona "voy a escalar agregando réplicas" pero no aparece un Load Balancer en el diagrama.

**Por qué es error:**
- Sin LB, los N nodos no comparten carga: cada cliente sigue dirigiéndose a uno solo.
- El LB es **parte constituyente** del escalado horizontal, no un accesorio opcional.
- Variantes válidas: DNS round-robin (LB básico), reverse proxy (Nginx, HAProxy), LB de cloud (AWS ALB/NLB, GCP LB), service mesh (Istio, Linkerd).

**Excepciones legítimas (a documentar explícitamente si las usás):**
- **Sharding por clave** — el cliente sabe a qué shard ir (no necesita LB porque hay un router determinístico).
- **Peer-to-peer / DHT** — la topología distribuye carga sin LB central.
- **Anycast** — el LB existe pero a nivel red (BGP).

---

### 3. "Cachear datos que no deberían ser cacheados"

**Lo que pasa:** el alumno cachea sin documentar invariantes, o cachea datos sensibles a freshness (precios live, saldos, control de acceso, sesiones críticas).

**Por qué es error (menos grave, pero igual penaliza):**
- Cache es una optimización que **introduce un acoplamiento temporal** entre el sistema y la consistencia de sus datos.
- Sin TTL ni invalidación explícita, los stale reads se convierten en bugs no-deterministas y problemas de seguridad (p. ej. permisos cacheados después de revocación).

**Mínimo para cachear en un parcial:**
- **TTL** o regla de invalidación (por evento, por escritura, manual).
- **Política de coherencia** (cache-aside, write-through, write-behind, refresh-ahead).
- **Visibilidad de stale reads** (¿qué pasa si un cliente lee dato viejo?).

**Datos que rara vez se cachean:** saldos bancarios, permisos/ACLs, precios en una subasta en vivo, datos médicos críticos.

---

### 4. "Olvidarte sistemas externos"

**Lo que pasa:** el diagrama del alumno omite el procesador de pagos, el carrier, el identity provider, el correo SMTP, el SDK del proveedor de video — todo el ecosistema con el que el sistema **realmente integra** en producción.

**Por qué es error:**
- Cada integración externa **tiene su propio modelo de fallas** (timeout, throttling, partición, contrato cambiante, deprecation) y su propio SLA — distinto al tuyo.
- Olvidarlos esconde **dependencias críticas** que dominan el árbol de utilidad.
- En [[Caso Healthcare.gov]] el identity verifier (Experian) fue **single point of failure** ignorado en el diseño inicial — cuando colapsó, colapsó todo el flow.

**Mínimo a representar en el diagrama:** todo sistema externo del que dependés en el happy path, con su contrato (REST/SOAP/gRPC), su modo de falla (sync timeout / async retry) y tu mitigación (circuit breaker / fallback / cola).

---

### 5. "Usar bases OLAP para transaccional"

**Lo que pasa:** el alumno propone Snowflake/BigQuery/Redshift/columnares para guardar pedidos, usuarios, sesiones — la operación transaccional.

**Por qué es error:**
- [[OLAP y ETL|OLAP]] está diseñado para **queries analíticas de lectura** sobre datos desnormalizados, con latencia tolerable de segundos a minutos.
- El patrón transaccional ([[Bases de datos relacionales|OLTP]]) requiere **escritura concurrente, baja latencia (ms), ACID, normalización**.
- Usar OLAP para OLTP: 10× más caro, 100× más lento por query operativa, sin garantías ACID.

**Cuándo OLAP sí:** dashboards ejecutivos, reportes históricos, análisis de cohortes, ML feature engineering sobre datos históricos.

**Cuándo OLTP sí:** checkout, autenticación, sesiones, carrito, cualquier flujo del usuario en vivo.

**Patrón canónico:** OLTP para operación + ETL/CDC + OLAP para analítica. Nunca al revés.

---

## Otros anti-patrones cercanos (no enumerados explícitamente pero igual penalizan)

- **"Microservicios desde el día 0 con 5 ingenieros"** — overhead operativo > beneficio. Ver [[Caso mock — Logística de última milla a escala]].
- **"Big Bang release sin staging ni canary"** — ver [[Caso Healthcare.gov]].
- **"Dibujar el diagrama antes de articular los drivers"** — ver [[Attribute Driven Design]].
- **"Métrica = 'rápido', 'seguro', 'escalable'"** — sin número, no es escenario.
- **"Asumir conectividad perfecta entre componentes distribuidos"** — viola Falacias de Computación Distribuida (L. Peter Deutsch).

## Cómo usar este catálogo

1. **Antes de entregar el parcial**, releer el diagrama y barrer la lista — ¿algún anti-patrón apareció sin querer?
2. **Al estudiar casos** (canónicos o [[Banco de casos mock de parcial|mocks]]), identificar dónde la solución curada evita explícitamente cada anti-patrón.
3. **Al criticar la respuesta de un compañero**, usar este vocabulario para nombrar el problema con precisión.

## Pregunta a profundizar

¿Hay anti-patrones específicos de ciertos dominios (financiero, salud, IoT, gov) que la cátedra no menciona pero serían descalificantes en ese contexto? Hipótesis: en financiero, "no separar el order book del settlement" es equivalente a "OLAP para transaccional"; en salud, "loguear PII sin segregar control de acceso" es equivalente a "olvidarte sistemas externos".
