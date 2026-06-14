---
title: "MC — Decisiones arquitectónicas particulares"
aliases:
  - "MC — Decisiones arquitectónicas particulares"
  - "MC decisiones"
  - "Multiple choice — decisiones particulares"
type: exercise
created: 2026-05-21
updated: 2026-05-21
tags: [ejercicio, multiple-choice, autoevaluacion, decisiones, base-de-datos, seguridad, replicacion, cap, idempotencia]
sources: []
related:
  - "[[Estilos arquitectónicos (catálogo)]]"
  - "[[Bases de datos relacionales]]"
  - "[[Bases no relacionales]]"
  - "[[Mecanismos de seguridad]]"
  - "[[Teorema CAP]]"
  - "[[Replicación de BD]]"
  - "[[Persistencia]]"
  - "[[Attribute Driven Design]]"
  - "[[Caso Compraventa de Acciones]]"
  - "[[Caso Twitter — Big Data en tiempo real]]"
  - "[[OLAP / ETL]]"
---

# MC — Decisiones arquitectónicas particulares

Banco de preguntas multiple-choice para **autoevaluación** de decisiones concretas dentro de un caso: qué BD, qué mecanismo de seguridad, qué estrategia de replicación, qué patrón de comunicación, etc. Cada pregunta tiene contexto breve, 4 opciones, respuesta canónica y justificación con cita al corpus.

Las preguntas marcadas con **(zona de trade-off)** admiten más de una respuesta defendible si se justifica correctamente; la "canónica" es la elección textual del corpus / del libro.

---

## Tanda 1 — Persistencia, seguridad, replicación, CAP, idempotencia

### Pregunta 1 — Chat corporativo interno

**Contexto.** Chat tipo Slack interno: 100.000 empleados, ~50 M mensajes/día, query dominante = "últimos 50 mensajes de la conversación X en orden inverso por timestamp". Append-only, retención indefinida, ráfagas de decenas de mensajes/seg en una sola conversación.

- a) PostgreSQL con índice compuesto sobre `(conversation_id, created_at DESC)`.
- b) MongoDB con un documento por conversación que embebe todos los mensajes.
- c) **Cassandra particionada por `conversation_id`, clustering key `created_at DESC`.** *(canónica)*
- d) Redis como almacén principal con listas por `conversation_id`.

**Justificación.** Patrón textual de Twitter Tweets / Timelines: query bounded por partición + ordenamiento temporal inverso + escrituras append-only de alta velocidad → wide-column con sharding por `conversation_id` y clustering temporal. Cassandra (Lakshman & Malik, 2009) está diseñada exactamente para esto y soporta latencia sub-10 ms en lectura con el patrón "leer el head de la partición". PostgreSQL particionado (opción a) funciona pero se vuelve operacionalmente complejo a estos volúmenes (sharding manual, vacuum, índices que no entran en RAM — los mismos problemas que Twitter narra antes de migrar a Cassandra). MongoDB con documento monolítico (b) tiene problema de tamaño máximo de documento (16 MB) y rewrite del documento entero ante cada mensaje. Redis (d) no es fuente de verdad y no escala el footprint indefinidamente.

> **Zona de trade-off.** Para volúmenes ≤ 5 M msgs/día, PostgreSQL particionado es perfectamente válido. La frontera práctica está cerca del volumen del enunciado.

---

### Pregunta 2 — Telemetría de flota

**Contexto.** 5.000 camiones enviando GPS + telemetría cada 10 s. ~43 M eventos/día. Queries exclusivamente temporales (trayectoria por rango, agregados por ventana, alertas históricas). Histórico 2 años con downsampling.

- a) PostgreSQL particionado por mes.
- b) MongoDB con un documento por evento.
- c) **Time-series DB especializada (TimescaleDB, InfluxDB, Prometheus).** *(canónica)*
- d) Cassandra particionada por `camion_id`.

**Justificación.** El driver es **el patrón de acceso temporal puro**: agregados por ventana, downsampling automático, retención por edad, compresión de columnas numéricas. Las time-series DB están construidas para eso: TimescaleDB embebe esto en PostgreSQL con `hypertables` particionadas por tiempo; InfluxDB tiene `continuous queries` y `retention policies`. PostgreSQL plano (a) se rompe en `GROUP BY` masivos y no comprime tan eficiente. MongoDB no aprovecha la localidad temporal. Cassandra (d) podría servir pero pierde las ventajas de queries SQL analíticas y operadores de tiempo nativos.

---

### Pregunta 3 — Integración con domótica heterogénea

**Contexto.** Plataforma de domótica que controla luces, persianas, termostatos, cerraduras y cámaras de **distintas marcas con protocolos propios** (Zigbee, Z-Wave, Wi-Fi propietario, MQTT, REST). El núcleo no debe conocer los protocolos. Tiene que poder agregarse una marca nueva sin tocar el núcleo.

- a) Hierarchical Layers — cada protocolo es una capa.
- b) **Adapter por protocolo + bus interno con eventos canónicos.** *(canónica)*
- c) Forwarder-Receiver entre el núcleo y cada dispositivo.
- d) Batch Sequential — recolectar comandos del día y enviarlos a la noche.

**Justificación.** Patrón textual de Ejercicio 2013 (Control de fábrica con sensores serie): un **adapter por protocolo** encapsula la idiosincrasia de cada uno y traduce a un **evento canónico interno** que viaja por un bus pub-sub. Agregar marca = agregar adapter, núcleo intacto. Mejora Portability (catálogo de [[Atributos de calidad]]). Hierarchical Layers (a) no resuelve heterogeneidad de protocolos. Forwarder-Receiver (c) sirve entre **dos pares conocidos** — acá hay N protocolos heterogéneos y N+1 dispositivos. Batch Sequential (d) no aplica al perfil real-time.

---

### Pregunta 4 — App de pagos QR con saldo offline

**Contexto.** Billetera virtual: la app debe poder descontar saldo y aprobar pagos **sin conexión** en pagos chicos (~$5.000); reconciliación al volver la conectividad. Pagos > $50.000 sí requieren online obligatorio.

- a) CP estricto — sin conexión, el pago se rechaza siempre.
- b) **AP con caché local del saldo en el celular y reconciliación posterior contra el servidor; idempotency key por transacción.** *(canónica)*
- c) CA — confiar en que la red nunca particiona.
- d) Eventual consistency con last-write-wins ignorando el saldo del servidor.

**Justificación.** Decisión textual del mock TelePeaje y de [[Teorema CAP]]: cuando hay un requerimiento físico (acá: zona sin red, allá: real-time de barrera) que **no admite esperar consenso global**, se elige **AP local** con caché y reconciliación posterior. El umbral del enunciado ($50.000) modela el principio: para montos donde el costo del fraude por divergencia es bajo, se acepta AP; para montos altos se exige CP (online obligatorio). Es el patrón offline-first de [[Caso Compraventa de Acciones|las cabinas]] y los POS de retail. CP estricto (a) rompe el caso de uso. CA (c) niega la realidad de Brewer: la red **particiona**. LWW puro (d) sin reconciliación de saldo genera doble gasto.

---

### Pregunta 5 — Imágenes de catálogo de e-commerce

**Contexto.** 50 M publicaciones, 3–8 imágenes/publicación, ~400 KB c/u, hoy en columnas `BYTEA` de PostgreSQL. Base creció a 80 TB, backups inmanejables, queries lentas por bloqueo de páginas grandes en memoria.

- a) Mantenerlas en PostgreSQL con `pg_largeobject`.
- b) MongoDB con GridFS.
- c) **Object storage (S3, MinIO) + URL en PostgreSQL.** *(canónica)*
- d) Redis con keys por `producto_id`.

**Justificación.** **La naturaleza del dato manda** (lección Compraventa): blobs grandes inmutables ≠ datos relacionales. Patrón canónico (Kleppmann, *Designing Data-Intensive Applications*; Fowler, PoEAA): **separar el blob del metadato** — blobs en object storage (escalado horizontal nativo, costo bajo por TB, replicación geográfica, lifecycle policies para frío) y en la base relacional sólo la **URL** y los metadatos. Mantenerlo en PostgreSQL (a) preserva el problema. GridFS (b) es funcional pero pierde el beneficio de CDN y storage tierado. Redis (d) es memoria, costoso para 80 TB de blobs raramente accedidos.

---

### Pregunta 6 — Reserva concurrente del mismo turno *(zona de trade-off)*

**Contexto.** Dos pacientes hacen clic *al mismo tiempo* en el mismo slot médico. Contención baja (mayoría de slots no se pelean), picos cuando hay especialista escaso. Monolito sobre PostgreSQL.

- a) **Optimistic locking con columna `version` validada en el `UPDATE`.** *(canónica para baja contención)*
- b) No hacer nada en BD; resolver en código con `if slot.disponible` antes del `UPDATE`.
- c) Last-write-wins.
- d) Eventual consistency con resolución offline por mail.

**Justificación.** Para **baja contención**, el lock optimista (Fowler PoEAA, capítulo *Optimistic Offline Lock*) es la elección canónica: no bloquea filas en lecturas, el conflicto se detecta sólo al hacer commit y se resuelve con error claro al perdedor. Pessimistic locking (`SELECT FOR UPDATE`) también es correcto y **necesario** si la contención es alta — pero penaliza throughput. La opción (b) tiene un race condition clásico: el `if` y el `UPDATE` no son atómicos. LWW (c) permite que dos turnos se confirmen al mismo slot. Eventual + email (d) viola la UX y la integridad del calendario.

> **Zona de trade-off.** Pessimistic (`SELECT FOR UPDATE`) es defendible si en tu caso la contención sube — distinto caso, distinta receta. La pregunta dice "baja contención" → optimistic.

---

### Pregunta 7 — Sincronización de app móvil offline

**Contexto.** App offline-first que sincroniza al volver online. La red móvil flaky puede hacer que un POST llegue al servidor pero la respuesta no vuelva al cliente, y el cliente reintente. Riesgo: nota duplicada.

- a) Detectar duplicados por hash del contenido.
- b) **Idempotency key (UUID) por operación; el servidor rechaza una segunda llamada con la misma key.** *(canónica)*
- c) Bloquear reintentos en el cliente con timeout más largo.
- d) Last-write-wins.

**Justificación.** Patrón textual de Twitter Social Graphs (slide *Challenges*): *"Write operations are idempotent: retry until success."* El cliente genera un `idempotency_key` por operación lógica (no por intento); el servidor mantiene un registro de keys procesadas y devuelve el resultado cacheado de la primera ejecución ante reintentos. Es el mismo patrón que adoptan Stripe (`Idempotency-Key` header), Square, AWS API. Hash del contenido (a) falla si dos notas legítimas tienen el mismo texto. Timeouts más largos (c) no eliminan la causa raíz. LWW (d) no resuelve el problema de duplicación — sólo determina cuál gana si hay update sobre el mismo recurso.

---

### Pregunta 8 — Defensa contra SQL injection

**Contexto.** Formulario público con búsqueda que concatena texto del usuario en SQL. Pentest reveló vulnerabilidad. Backend Java sobre PostgreSQL.

- a) Encriptación at-rest.
- b) **Sanitización + prepared statements / consultas parametrizadas.** *(canónica)*
- c) MFA en el login.
- d) HTTPS end-to-end.

**Justificación.** Pregunta de escenario → mecanismo del catálogo de [[Mecanismos de seguridad]]. La amenaza es **inyección**; el mecanismo arquitectónico correspondiente es **prepared statements** (que separan el código SQL de los datos a nivel driver, eliminando la posibilidad estructural de inyección) más sanitización defensiva. Es la lección canónica de OWASP Top 10 (A03:2021 — Injection) y de Clase 7 (escenario "inyección → sanitización en cada endpoint"). At-rest (a) protege storage, no auth ni queries. MFA (c) protege login, no inyección. HTTPS (d) protege el transporte, no el contenido del input.

---

### Pregunta 9 — Log inmutable de auditoría compliance

**Contexto.** Log de auditoría financiera: inmutable, retención 10 años, reconstruible bit-a-bit ante el regulador, ~5 M entradas/día. Queries raras y dirigidas.

- a) PostgreSQL con `UPDATE`/`DELETE` revocados por permisos.
- b) **Event log append-only firmado por HSM, replicado a almacenamiento WORM (write-once read-many).** *(canónica)*
- c) Redis con TTL de 10 años.
- d) MongoDB con `findAndModify` desactivado.

**Justificación.** Patrón textual del mock TelePeaje y de Compraventa de Acciones: **event sourcing** sobre un log apend-only **firmado** (no-repudio por HSM) y replicado a **WORM** (la inmutabilidad es una propiedad del medio, no de un permiso revocable). PostgreSQL con permisos (a) no es realmente inmutable: un DBA con privilegios o un exploit puede modificar; la inmutabilidad por política, no por física. Redis (c) es memoria volátil — viola durabilidad de 10 años. MongoDB (d) tiene los mismos problemas que (a): permisos revocables. La elección canónica institucionaliza el "no-repudio físico" exigido por reguladores financieros (Basilea, CNV).

---

### Pregunta 10 — Detección de sniping en subastas

**Contexto.** Detectar bots de sniping: *"si un usuario realiza > 5 pujas en los últimos 10 s de una subasta de > 1 h, todas del mismo orden de magnitud, marcar"*. 2.000 subastas concurrentes; detección **en vivo**.

- a) Batch nocturno.
- b) SEP — cada puja evaluada individualmente contra reglas estáticas.
- c) **CEP — Complex Event Processing (Flink, Esper, Kafka Streams).** *(canónica)*
- d) Map-Reduce cada 15 min.

**Justificación.** La regla del enunciado tiene la firma textual de [[Estilos arquitectónicos|CEP]]: **correlación de múltiples eventos en una ventana temporal con condiciones compuestas** ("5 pujas / 10 s / mismo usuario / mismo orden de magnitud"). SEP (b) evalúa eventos individuales — no puede correlacionar entre pujas distintas. Batch nocturno (a) y Map-Reduce 15-min (d) violan el requisito de detección **en vivo** durante la subasta. Motores reales: Apache Flink CEP, Esper, Kafka Streams con `windowed()`.

---

## Plantilla para futuras tandas (autoevaluación)

Al hacer una tanda nueva, copiar el siguiente patrón:

```markdown
### Pregunta N — Título corto

**Contexto.** [3–5 líneas que aterricen el problema: dominio, volumen, restricciones, requerimiento dominante.]

- a) ...
- b) ...
- c) ...
- d) ...

**Respuesta canónica:** X.

**Justificación.** [Por qué la elegida cubre los drivers. Por qué cada distractor falla — uno a uno. Cita al corpus: [[Caso X]], (source: raw/...), o referencia a libro canónico (Fowler, Kleppmann, POSA, Bass).]

> **Zona de trade-off** *(opcional)*: si la respuesta admite alternativas defendibles, declararlas y bajo qué supuestos serían correctas.
```

## Cómo usar este archivo para autoevaluarse

1. Tapar la respuesta y la justificación.
2. Leer el contexto y las opciones.
3. Marcar la elegida y escribir en 1–2 líneas el "porqué".
4. Comparar con la justificación. Si la elegida coincide pero el "porqué" no, ese es el déficit a cerrar.
5. Si la elegida no coincide pero está en la "zona de trade-off", revisar si la justificación que pensaste habría sido aceptable.

## Pregunta a profundizar

Las preguntas de "zona de trade-off" son las más valiosas pedagógicamente. ¿Cómo construir más, de forma que el ranking de atributos del enunciado **mueva** la respuesta de una opción a otra sin cambiar el dominio?

## Fuentes y lecturas

- Buschmann et al. — *Pattern-Oriented Software Architecture (POSA), Vol 1*.
- Fowler — *Patterns of Enterprise Application Architecture* (caps. Optimistic Offline Lock, Identity Map).
- Kleppmann — *Designing Data-Intensive Applications* (caps. 3 storage engines, 5 replication, 6 partitioning, 8 trouble with distributed systems).
- Bass, Clements, Kazman — *Software Architecture in Practice*.
- OWASP Top 10 — Injection (A03:2021).
- Brewer — *CAP Twelve Years Later* (IEEE Computer, 2012).
