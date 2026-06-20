// Catálogo de anti-patrones de arquitectura para el parcial de Inge2.
// Cada ítem incluye por qué descalifica, la corrección y frases para el modo "spotter".

import type { AntipatternItem } from "../types";

export const ANTIPATTERNS: AntipatternItem[] = [
  {
    id: "ap-01",
    name: "Poner una cola y esperar request-response síncrono",
    why: "La cola es por definición un buffer asincrónico que desacopla productor de consumidor. Si el productor espera la respuesta, no ganaste desacople y además montaste algo más frágil (correlation IDs, reply queues, timeouts) que un HTTP directo. Revela incomprensión de cómo se asincroniza.",
    fix: "Usar la cola solo para fire-and-forget, event-driven o work queues. Si necesitás la respuesta para continuar, usar HTTP/gRPC síncrono. Si querés respuesta asincrónica real, callback URL / webhook / async polling.",
    spot: [
      {
        text: "El servicio de checkout publica el pago en una cola y se queda esperando en esa misma request el mensaje de confirmación del procesador para responderle al usuario.",
        isAntipattern: true,
      },
      {
        text: "El checkout publica el pago en una cola, responde al usuario 'procesando' y un webhook del procesador actualiza el estado más tarde.",
        isAntipattern: false,
      },
      {
        text: "El servicio A llama por HTTP síncrono al servicio B porque necesita su respuesta para continuar el flujo.",
        isAntipattern: false,
      },
    ],
    wiki: "concepts/anti-patrones-parcial",
  },
  {
    id: "ap-02",
    name: "Escalamiento horizontal sin Load Balancer",
    why: "Sin LB los N nodos no comparten carga: cada cliente sigue pegándole a uno solo, así que no escalaste nada. El LB es parte constituyente del escalado horizontal, no un accesorio. Es 2 automático.",
    fix: "Dibujar siempre el LB (reverse proxy Nginx/HAProxy, ALB/NLB del cloud, service mesh). Si no hay LB, documentar explícitamente la excepción legítima: sharding por clave, P2P/DHT o Anycast (LB a nivel red/BGP).",
    spot: [
      {
        text: "Escalo el backend agregando 5 réplicas para absorber el pico, pero el diagrama no tiene ningún balanceador delante.",
        isAntipattern: true,
      },
      {
        text: "No pongo LB porque hago sharding por clave: el cliente sabe determinísticamente a qué shard ir, y lo documento como excepción.",
        isAntipattern: false,
      },
      {
        text: "Pongo N instancias detrás de un ALB multi-AZ que reparte la carga y saca del pool las réplicas caídas.",
        isAntipattern: false,
      },
    ],
    wiki: "concepts/anti-patrones-parcial",
  },
  {
    id: "ap-03",
    name: "Cachear sin documentar TTL ni política de invalidación",
    why: "El cache introduce un acoplamiento temporal con la consistencia de los datos. Sin TTL ni invalidación explícita, los stale reads se vuelven bugs no deterministas y agujeros de seguridad (p. ej. permisos cacheados después de una revocación). Además hay datos que casi nunca se cachean.",
    fix: "Documentar siempre: qué se cachea, TTL o regla de invalidación (por evento, escritura, manual), política de coherencia (cache-aside / write-through / refresh-ahead) y qué pasa con un stale read. No cachear saldos, ACLs/permisos, precios en subasta ni datos médicos críticos.",
    spot: [
      {
        text: "Cacheo los permisos del usuario en Redis sin TTL para acelerar la autorización en cada request.",
        isAntipattern: true,
      },
      {
        text: "Cacheo 'todo lo posible' en el backend para que vaya más rápido, sin aclarar invalidación.",
        isAntipattern: true,
      },
      {
        text: "Cacheo el catálogo de productos con cache-aside y TTL de 60s, y lo invalido por evento cuando cambia un precio.",
        isAntipattern: false,
      },
    ],
    wiki: "concepts/anti-patrones-parcial",
  },
  {
    id: "ap-04",
    name: "Olvidarte de los sistemas externos",
    why: "Cada integración externa (procesador de pago, carrier, IdP, SMTP, SDK de video) tiene su propio modelo de fallas y su propio SLA, distinto al tuyo. Omitirlos esconde dependencias críticas que dominan el árbol de utilidad. En Healthcare.gov el identity verifier (Experian) fue un SPOF ignorado: cuando colapsó, colapsó todo el flow.",
    fix: "Representar en el diagrama todo sistema externo del happy path, con su contrato (REST/SOAP/gRPC), su modo de falla (timeout sync / retry async) y tu mitigación (circuit breaker / fallback / cola).",
    spot: [
      {
        text: "El diagrama del e-commerce muestra frontend, backend y base, pero no aparece el procesador de pagos ni el carrier de envíos de los que depende el checkout.",
        isAntipattern: true,
      },
      {
        text: "Dibujo el IdP externo como caja, marco que la integración es REST con timeout, y le pongo un circuit breaker con fallback a login local degradado.",
        isAntipattern: false,
      },
    ],
    wiki: "case-studies/healthcare-gov",
  },
  {
    id: "ap-05",
    name: "Usar bases OLAP para transaccional",
    why: "OLAP (Snowflake, BigQuery, Redshift, columnares) está hecho para queries analíticas de lectura sobre datos desnormalizados con latencia de segundos. El patrón transaccional (OLTP) exige escritura concurrente, baja latencia en ms, ACID y normalización. Usar OLAP para OLTP sale 10x más caro, 100x más lento por query operativa y sin garantías ACID.",
    fix: "OLTP para la operación en vivo (checkout, auth, sesiones, carrito) + ETL/CDC + OLAP para analítica (dashboards, reportes históricos, ML feature engineering). Nunca al revés.",
    spot: [
      {
        text: "Guardo los pedidos, usuarios y sesiones en BigQuery porque ya lo usamos para los dashboards.",
        isAntipattern: true,
      },
      {
        text: "Uso Postgres (OLTP) para la operación y replico a Snowflake con ETL nocturno para los reportes ejecutivos.",
        isAntipattern: false,
      },
      {
        text: "Uso un RDBMS OLTP para el carrito y el checkout en vivo.",
        isAntipattern: false,
      },
    ],
    wiki: "concepts/anti-patrones-parcial",
  },
  {
    id: "ap-06",
    name: "Microservicios desde el día 0 con equipo chico",
    why: "Con 5 ingenieros el overhead operativo de microservicios (red entre servicios, despliegue, observabilidad, datos distribuidos) supera al beneficio. Se paga el costo de Performance/Modifiability distribuida antes de necesitar la escala que lo justifique.",
    fix: "Empezar con un modular monolith (módulos bien delimitados, bounded contexts internos) y escindir a microservicio cuando el dolor concreto (escalado independiente, equipos separados, cadencias distintas) lo justifique.",
    spot: [
      {
        text: "Para el MVP de la startup arranco con 12 microservicios y un equipo de 5 personas, cada servicio con su pipeline y su base.",
        isAntipattern: true,
      },
      {
        text: "Arranco con un modular monolith de bounded contexts claros y escindo el módulo de pagos a microservicio cuando necesita escalar y desplegarse aparte.",
        isAntipattern: false,
      },
    ],
    wiki: "concepts/microservicios",
  },
  {
    id: "ap-07",
    name: "Big bang release sin staging ni canary",
    why: "Lanzar todo de golpe sin entorno de staging ni canary ni test de carga es la lección de Healthcare.gov: bajo presión de fecha se salteó la validación operacional y el sistema colapsó en producción el primer día. No hay forma de descubrir los SPOFs ni la capacidad real antes de que la vean los usuarios.",
    fix: "Release incremental: staging, canary / rollout gradual, feature flags, y test de carga previo que valide la capacidad contra escenarios cuantificados.",
    spot: [
      {
        text: "Lanzamos el sistema entero a todos los usuarios el día de la fecha límite, sin staging ni canary, confiando en que va a aguantar.",
        isAntipattern: true,
      },
      {
        text: "Hacemos rollout gradual con canary al 5% y feature flags, después de un test de carga que valida 10k req/s al p95.",
        isAntipattern: false,
      },
    ],
    wiki: "case-studies/healthcare-gov",
  },
  {
    id: "ap-08",
    name: "Dibujar el diagrama antes de articular los drivers",
    why: "El método ADD parte de los atributos de calidad priorizados (drivers) y de ahí deriva mecanismos. Dibujar primero el diagrama y justificar después invierte el método: produce un diseño sin trazabilidad a los drivers, que es justo lo que el parcial evalúa.",
    fix: "Primero identificar y priorizar el top 4 de atributos justificados por el caso y escribir escenarios cuantificados; recién entonces dibujar el diagrama eligiendo un mecanismo por driver.",
    spot: [
      {
        text: "Arranco dibujando SPA + CDN + WAF + LB + backend + base porque es el patrón que siempre uso, y después veo qué atributos cumple.",
        isAntipattern: true,
      },
      {
        text: "Listo y priorizo Security, Availability, Scalability y Performance justificando cada uno con una línea del enunciado, y recién ahí dibujo.",
        isAntipattern: false,
      },
    ],
    wiki: "concepts/attribute-driven-design",
  },
  {
    id: "ap-09",
    name: "Escenarios sin números ('rápido', 'seguro', 'escalable')",
    why: "Un atributo de calidad sin métrica no es un escenario: 'rápido' o 'seguro' no se pueden diseñar ni evaluar. La cátedra exige escenarios cuantificados (p. ej. p95 <= 200 ms a 10k req/s) para conectar el atributo abstracto con una decisión verificable.",
    fix: "Cuantificar cada escenario del top 4: carga (usuarios/req/s), objetivo (p95/p99 en ms, % uptime, MTBF/MTTR) y condición (normal vs pico). Si el caso no da números, inventar valores razonables y documentar el supuesto.",
    spot: [
      {
        text: "El sistema debe ser rápido y soportar muchos usuarios concurrentes de forma escalable y segura.",
        isAntipattern: true,
      },
      {
        text: "Bajo carga normal de 5k usuarios concurrentes (2k req/s) el sistema responde al p95 en <= 200 ms; bajo pico de 20k, p95 <= 350 ms.",
        isAntipattern: false,
      },
    ],
    wiki: "concepts/sla-slo-sli",
  },
  {
    id: "ap-10",
    name: "Asumir conectividad perfecta entre componentes distribuidos",
    why: "Viola las Falacias de la Computación Distribuida (Deutsch): la red NO es confiable, ni de latencia cero, ni de ancho de banda infinito. Diseñar como si las llamadas entre componentes nunca fallaran ni tardaran deja el sistema sin timeouts, sin retries idempotentes ni circuit breakers, y se cae ante la primera partición.",
    fix: "Asumir que la red particiona y agrega latencia: timeouts en toda llamada remota, retries idempotentes, circuit breaker + fallback, y una postura CAP explícita (CP o AP) para la persistencia distribuida.",
    spot: [
      {
        text: "Las llamadas entre microservicios siempre responden al instante, así que no hace falta timeout ni circuit breaker entre ellos.",
        isAntipattern: true,
      },
      {
        text: "Cada llamada remota lleva timeout y circuit breaker, y elijo Cassandra (AP) asumiendo que la red va a particionar.",
        isAntipattern: false,
      },
    ],
    wiki: "concepts/anti-patrones-parcial",
  },
];
