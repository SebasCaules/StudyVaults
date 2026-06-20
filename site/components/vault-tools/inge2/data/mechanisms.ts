// Banco de mecanismos de diseño para el toolkit de Inge2: cada ítem plantea un
// problema/atributo de calidad, las opciones de mecanismo, la correcta y su caveat.
import type { MechanismItem } from "../types";

export const MECHANISMS: MechanismItem[] = [
  {
    id: "mec-01",
    unit: "metodo-parcial",
    attribute: "Availability",
    problem:
      "Anunciás escalado horizontal con N réplicas del backend, pero ante una caída de una instancia el cliente igual nota la falla.",
    options: [
      "Sharding por clave para que el cliente sepa a qué nodo ir",
      "Múltiples instancias detrás de un Load Balancer que saca la réplica caída del pool",
      "Replicación Primario-Secundario de la base de datos",
      "Cache en el backend con TTL corto",
    ],
    correct: 1,
    caveat:
      "El LB se vuelve un nuevo SPOF: tiene que ser HA (multi-AZ, dual provider o activo-pasivo con failover). Anunciar 'escalo horizontal' sin dibujar el LB es 2 automático.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-02",
    unit: "metodo-parcial",
    attribute: "Availability",
    problem: "Un ataque DDoS satura el sistema y lo deja sin responder.",
    options: [
      "Solo WAF de capa 7",
      "WAF de capa 7 + anti-DDoS de red para capas 3-4 (SYN/UDP flood)",
      "Encryption at rest",
      "MFA en el login",
    ],
    correct: 1,
    caveat:
      "El WAF solo cubre capa 7 (HTTP flood, slowloris); no defiende SYN/UDP flood de capas 3-4. Hay que sumar anti-DDoS de red tipo Cloudflare/AWS Shield.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-03",
    unit: "metodo-parcial",
    attribute: "Availability",
    problem: "La base de datos relacional primaria cae y la operación se detiene.",
    options: [
      "Cassandra en cluster con gossip",
      "Replicación Primario-Secundario con failover por promoción de réplica",
      "Sharding por order_id",
      "Encryption at rest con KMS separado",
    ],
    correct: 1,
    caveat:
      "El failover no es instantáneo: la promoción de la réplica toma segundos. Además las réplicas son eventualmente consistentes en las lecturas.",
    wiki: "concepts/replicacion-bd",
  },
  {
    id: "mec-04",
    unit: "metodo-parcial",
    attribute: "Availability",
    problem: "El datacenter on-premise puede quedarse sin servicio eléctrico.",
    options: [
      "Doble Load Balancer activo-pasivo",
      "UPS + generador o doble servicio eléctrico",
      "Failover DNS a otra región",
      "Read replicas de la base",
    ],
    correct: 1,
    caveat:
      "Aplica solo on-premise; el cloud abstrae esta capa. Es un riesgo de infraestructura física, no de software.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-05",
    unit: "metodo-parcial",
    attribute: "Availability",
    problem:
      "Se corta el acceso a internet del datacenter y el sistema queda inalcanzable.",
    options: [
      "CDN para assets estáticos",
      "Múltiples proveedores de internet (multi-homing, BGP)",
      "Sticky sessions en el LB",
      "Cola de mensajes en cluster",
    ],
    correct: 1,
    caveat:
      "El costo es alto; una mitigación parcial más barata es failover DNS. Es distinto de la caída de una instancia (que se resuelve con LB).",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-06",
    unit: "metodo-parcial",
    attribute: "Availability",
    problem:
      "En un esquema activo-pasivo, el activo cae y el pasivo no detecta que debe tomar el control.",
    options: [
      "Heartbeat entre activo y pasivo con failover automático",
      "Load Balancer multi-AZ",
      "Quorum de escritura en la base",
      "Circuit breaker hacia el activo",
    ],
    correct: 0,
    caveat:
      "El heartbeat necesita timeout corto (1-3s) y el split-brain debe estar resuelto, porque si ambos se creen activos corrompen el estado.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-07",
    unit: "seguridad",
    attribute: "Security",
    problem:
      "Un atacante intercepta el tráfico entre el cliente y el servidor (Man-in-the-Middle) para leer o alterar datos.",
    options: [
      "Encryption at rest en la base",
      "HTTPS (TLS) en todas las conexiones",
      "WAF de capa 7",
      "RBAC en el backend",
    ],
    correct: 1,
    caveat:
      "Exige TLS 1.2+, certificados válidos y HSTS. Toda comunicación pública debe ser HTTPS; no decirlo explícitamente pierde puntos baratos.",
    wiki: "concepts/mecanismos-de-seguridad",
  },
  {
    id: "mec-08",
    unit: "seguridad",
    attribute: "Security",
    problem:
      "Un atacante roba las credenciales (usuario y contraseña) de un usuario y quiere entrar a su cuenta.",
    options: [
      "Sanitización de inputs",
      "Encryption in transit",
      "MFA (mínimo 2FA) con un segundo factor de otra categoría",
      "VPN para el usuario",
    ],
    correct: 2,
    caveat:
      "El flujo de recovery debe ser igual de seguro, si no se vuelve la puerta de atrás. MFA fricciona, así que se aplica en operaciones sensibles, no en cada interacción.",
    wiki: "concepts/mecanismos-de-seguridad",
  },
  {
    id: "mec-09",
    unit: "seguridad",
    attribute: "Security",
    problem:
      "Un atacante envía inputs malformados para ejecutar SQL Injection contra la base.",
    options: [
      "Sanitizar solo en la SPA (frontend)",
      "Queries parametrizadas + ORM seguro + sanitización en el backend (+ WAF)",
      "Encryption at rest de la base",
      "2FA en el login",
    ],
    correct: 1,
    caveat:
      "Sanitizar en la SPA sirve para UX, pero el backend debe sanitizar igual: never trust user input, la validación va en cada capa que recibe input externo.",
    wiki: "concepts/mecanismos-de-seguridad",
  },
  {
    id: "mec-10",
    unit: "seguridad",
    attribute: "Security",
    problem:
      "Un operador interno con acceso privilegiado podría abusar de sistemas internos expuestos.",
    options: [
      "Solo VPN para el operador",
      "VPN + segmentación de red + ACL granular (+ MFA y auditoría)",
      "Solo HTTPS",
      "CDN delante del panel de admin",
    ],
    correct: 1,
    caveat:
      "La VPN sola es insuficiente: protege el canal, no la autenticación. Reduce blast radius mover Ops a infra separada, pero suma MFA + auditoría.",
    wiki: "concepts/mecanismos-de-seguridad",
  },
  {
    id: "mec-11",
    unit: "seguridad",
    attribute: "Security",
    problem:
      "Un atacante roba un disco o un backup físico y quiere leer los datos almacenados.",
    options: [
      "HTTPS en todas las conexiones",
      "Encryption at rest (con clave en KMS/HSM separado)",
      "WAF + rate limiting",
      "JWT firmado",
    ],
    correct: 1,
    caveat:
      "Encryption at rest NO defiende contra un acceso autenticado a la base; para eso van control de accesos + audit log. Conviene complementar con encryption in transit.",
    wiki: "concepts/mecanismos-de-seguridad",
  },
  {
    id: "mec-12",
    unit: "metodo-parcial",
    attribute: "Performance",
    problem:
      "Las lecturas son lentas porque la base de datos es el cuello de botella.",
    options: [
      "Cache en el backend (qué se cachea, TTL, política de invalidación)",
      "Sharding por timestamp",
      "Encryption at rest",
      "Webhook hacia el cliente",
    ],
    correct: 0,
    caveat:
      "Hay que documentar QUÉ se cachea, el TTL/política de invalidación y qué pasa con stale reads. Nunca cachear saldos, ACLs, precios en subasta o datos médicos críticos.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-13",
    unit: "metodo-parcial",
    attribute: "Performance",
    problem:
      "El sistema debe servir reportes históricos y analíticos pesados sin degradar la operación en vivo.",
    options: [
      "Read replica de la base OLTP",
      "OLAP + ETL desde el OLTP, corriendo en ventana de baja demanda",
      "Cassandra para las consultas",
      "Cache con TTL largo",
    ],
    correct: 1,
    caveat:
      "OLTP para operación, OLAP para analítica, nunca al revés. Para reportes operacionales casi en tiempo real alcanza una read replica (con lag aceptable).",
    wiki: "concepts/olap-etl",
  },
  {
    id: "mec-14",
    unit: "metodo-parcial",
    attribute: "Performance",
    problem:
      "El sistema consulta varias fuentes externas y la latencia total es la suma de todas.",
    options: [
      "Encolar cada llamada y esperar la respuesta de la cola",
      "Llamadas paralelas asincrónicas con timeout + circuit breaker",
      "Cache de cada fuente con TTL de 60s",
      "Replicación Primario-Primario",
    ],
    correct: 1,
    caveat:
      "Con paralelo + timeout el total tiende a max() en vez de sum() de latencias. El circuit breaker evita que una fuente caída arrastre todo el request.",
    wiki: "concepts/circuit-breaker",
  },
  {
    id: "mec-15",
    unit: "metodo-parcial",
    attribute: "Performance",
    problem:
      "Los usuarios están en distintas regiones y el frontend tarda en cargar assets por la latencia geográfica.",
    options: [
      "CDN (CloudFront, Cloudflare, Fastly) cerca del usuario",
      "Read replicas de la base",
      "Sticky sessions",
      "Sharding por región",
    ],
    correct: 0,
    caveat:
      "La CDN solo sirve para assets estáticos; el HTML dinámico requiere edge compute. Hay que manejar cache invalidation en cada deploy.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-16",
    unit: "metodo-parcial",
    attribute: "Performance",
    problem:
      "El cliente necesita recibir actualizaciones en tiempo real (cotizaciones live, chat) sin pollear.",
    options: [
      "Webhook server-a-server",
      "WebSocket / Server-Sent Events",
      "Cola de mensajes con DLQ",
      "Cache refresh-ahead",
    ],
    correct: 1,
    caveat:
      "Trade-off de availability: la conexión WebSocket vive en una instancia; si cae, el cliente reconecta. Hay que manejar failover de conexión + estado externo (Redis pub/sub).",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-17",
    unit: "metodo-parcial",
    attribute: "Scalability",
    problem:
      "La base de datos se vuelve cuello de botella en ESCRITURAS por volumen masivo.",
    options: [
      "Read replicas Primario-Secundario",
      "Sharding: partir el dataset por una shard key",
      "Cache en el backend",
      "Replicación Primario-Primario",
    ],
    correct: 1,
    caveat:
      "La shard key es la decisión clave: buena = distribución uniforme + happy path resuelto en una sola partición. Shard por timestamp genera hotspot en la partición actual.",
    wiki: "concepts/sharding",
  },
  {
    id: "mec-18",
    unit: "metodo-parcial",
    attribute: "Scalability",
    problem: "Crecen mucho las LECTURAS de la base (lecturas >> escrituras).",
    options: [
      "Replicación Primario-Primario (multi-master)",
      "Read replicas (Primario-Secundario) + cache",
      "Sharding por order_id",
      "Encryption at rest",
    ],
    correct: 1,
    caveat:
      "El lag de replicación impone consistencia eventual en las réplicas. P-P se reserva como última opción (conflictos de concurrencia, peor performance).",
    wiki: "concepts/replicacion-bd",
  },
  {
    id: "mec-19",
    unit: "persistencia",
    attribute: "Scalability",
    problem:
      "Hay que ingerir un volumen masivo de eventos: logs, telemetría, time-series.",
    options: [
      "RDBMS OLTP con sharding por order_id",
      "Cassandra / time-series DB (InfluxDB, TimescaleDB)",
      "OLAP columnar consultado en vivo",
      "MongoDB con read concern majority",
    ],
    correct: 1,
    caveat:
      "El sacrificio es consistencia eventual (Cassandra es AP). No sirve para transacciones bancarias, integridad referencial ni joins complejos.",
    wiki: "concepts/bases-no-relacionales",
  },
  {
    id: "mec-20",
    unit: "metodo-parcial",
    attribute: "Scalability",
    problem: "El tráfico tiene picos recurrentes y predecibles que saturan el backend.",
    options: [
      "Load Balancer + autoscaling de instancias",
      "Cassandra para absorber el pico",
      "Encryption in transit",
      "VPN entre datacenters",
    ],
    correct: 0,
    caveat:
      "Hay cold start: para picos predecibles conviene pre-warming. El cuello de botella se mueve a la base, así que también hay que escalarla.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-21",
    unit: "metodo-parcial",
    attribute: "Interoperability",
    problem: "Dos sistemas tienen interfaces incompatibles y deben integrarse.",
    options: [
      "Patrón Adapter (estructural GoF) como traductor entre interfaces",
      "Cola de mensajes esperando respuesta",
      "Sharding por sistema",
      "Encryption at rest",
    ],
    correct: 0,
    caveat:
      "Para sistemas legacy conviene un anti-corruption layer (DDD) que aísle el dominio nuevo del modelo viejo, no solo un Adapter puntual.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-22",
    unit: "metodo-parcial",
    attribute: "Interoperability",
    problem:
      "Hay que permitir que sistemas de terceros integren datos del sistema de forma segura.",
    options: [
      "Exponer la base directamente con un usuario read-only",
      "API REST/GraphQL de solo lectura, versionada, con rate limiting y autenticación",
      "Mandar webhooks con todos los datos",
      "Compartir un dump por FTP",
    ],
    correct: 1,
    caveat:
      "Versionar (v1/, v2/) para no romper consumidores; rate limiting + API keys/OAuth para no exponer. Nunca dar acceso directo a la base.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-23",
    unit: "metodo-parcial",
    attribute: "Fault Tolerance",
    problem:
      "Un servicio externo no esencial se cae y arrastra todo el request principal.",
    options: [
      "Reintentar síncrono en loop hasta que responda",
      "Circuit breaker -> fallback -> degradación de la feature",
      "Cachear la última respuesta para siempre",
      "Escalar horizontalmente el backend",
    ],
    correct: 1,
    caveat:
      "Distinto de Availability (binaria): Fault Tolerance es degradar parcialmente sin caer entero. El circuit breaker corta el llamado fallido y deja el resto del sistema vivo.",
    wiki: "concepts/circuit-breaker",
  },
  {
    id: "mec-24",
    unit: "metodo-parcial",
    attribute: "Fault Tolerance",
    problem:
      "Un mensaje de la cola falla N veces consecutivas y el consumidor entra en loop infinito.",
    options: [
      "Borrar el mensaje y seguir",
      "Dead Letter Queue (DLQ) + alarma + intervencion manual",
      "Reintentar sin limite",
      "Convertir la cola en request-response",
    ],
    correct: 1,
    caveat:
      "La DLQ aísla el mensaje veneno para análisis; además la cola debe correr en cluster, persistir mensajes y tener TTL. Con at-least-once, el consumidor debe ser idempotente.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-25",
    unit: "metodo-parcial",
    attribute: "Precision",
    problem: "Cálculos con dinero acumulan error de punto flotante (IEEE 754).",
    options: [
      "Aritmética de punto fijo (BigDecimal, decimal128)",
      "Redondear el float al final",
      "Guardar todo como float64",
      "Cassandra para los importes",
    ],
    correct: 0,
    caveat:
      "El punto fijo es más lento que el float y el dato debe entrar en su rango. Se acepta el overhead donde la precisión es no negociable (dinero, sensores críticos).",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-26",
    unit: "metodo-parcial",
    attribute: "Precision",
    problem:
      "Un sensor crítico puede medir mal y reportar un valor erróneo sin que nadie lo note.",
    options: [
      "Aumentar la frecuencia de polling del sensor",
      "Dos sensores en activo-activo + cross-check + alarma de divergencia",
      "Interpolación lineal entre mediciones",
      "Guardar la medición como string",
    ],
    correct: 1,
    caveat:
      "Si los sensores difieren más de un epsilon, se dispara la alarma: el más confiable gana o se descarta el dato. Mide redundancia, no solo precisión puntual.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-27",
    unit: "metodo-parcial",
    attribute: "Security",
    problem:
      "El sistema maneja datos extremadamente sensibles (defensa, voto, datos médicos críticos) que la regulación obliga a proteger al máximo.",
    options: [
      "Cloud público en la región más barata",
      "Hosting on-premise / sala cofre con restricción física",
      "Solo encryption in transit",
      "CDN global",
    ],
    correct: 1,
    caveat:
      "El costo es enorme y la latencia depende de la ubicación; se reserva para casos donde la regulación lo exige. 'Lo pongo en AWS porque es fácil' falla si el caso menciona data residency.",
    wiki: "concepts/criterios-hosting-data-residency",
  },
  {
    id: "mec-28",
    unit: "persistencia",
    attribute: "Consistency",
    problem:
      "Un sistema bancario distribuido no puede tolerar saldos divergentes entre réplicas bajo una partición de red.",
    options: [
      "Cassandra (AP) con consistencia eventual",
      "Un motor CP (rechaza writes en el lado minoritario bajo partición)",
      "MongoDB con read concern local",
      "Replicación Primario-Primario last-write-wins",
    ],
    correct: 1,
    caveat:
      "P no es opcional: la elección real es C vs A bajo partición. Financiero -> CP (prefiere rechazar transacciones a aceptar saldos divergentes). Cuesta disponibilidad.",
    wiki: "concepts/teorema-cap",
  },
  {
    id: "mec-29",
    unit: "metodo-parcial",
    attribute: "Availability",
    problem:
      "La cola de mensajes es un único nodo y su caída frena toda la mensajería asincrónica.",
    options: [
      "Cola en cluster con replicación de mensajes (replication factor >= 3)",
      "Aumentar el TTL de los mensajes",
      "Convertir la cola en HTTP síncrono",
      "Cache delante de la cola",
    ],
    correct: 0,
    caveat:
      "Hay que especificar replication factor >= 3 y persistencia para que los mensajes sobrevivan al reinicio del cluster. En el parcial se nombran los requisitos, no 'Kafka'.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "mec-30",
    unit: "microservicios",
    attribute: "Modifiability",
    problem:
      "Necesitás integrar con un sistema legacy sin que su modelo de datos contamine el dominio nuevo.",
    options: [
      "Compartir la misma base entre legacy y dominio nuevo",
      "Anti-corruption layer (DDD) entre el dominio nuevo y el legacy",
      "Llamar directo a las tablas del legacy",
      "Cachear las respuestas del legacy sin TTL",
    ],
    correct: 1,
    caveat:
      "El ACL traduce y aísla; sin él, el modelo del legacy se filtra y acopla el dominio nuevo. Es un caso particular del patrón Adapter aplicado a integración.",
    wiki: "concepts/integracion-de-sistemas",
  },
];
