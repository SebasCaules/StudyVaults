// Catálogo de trade-offs entre atributos de calidad (Inge2, método del parcial).
// Cada ítem documenta el mecanismo que evidencia el conflicto y cómo se resuelve.

import type { TradeoffItem } from "../types";

export const TRADEOFFS: TradeoffItem[] = [
  {
    id: "to-01",
    unit: "metodo-parcial",
    attrA: "Availability",
    attrB: "Costos",
    mechanism: "Escalado horizontal: más nodos = más HA = más caro.",
    resolution:
      "Definir un SLO realista; la HA total cuesta enormemente más que un 99.9%. No se persigue el 100%, se dimensiona al objetivo de negocio.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "to-02",
    unit: "metodo-parcial",
    attrA: "Security",
    attrB: "Performance",
    mechanism:
      "Encryption at rest: cifrar y descifrar en cada read/write tiene costo de CPU.",
    resolution:
      "Aceptar el overhead; el cifrado por hardware (AES-NI) lo hace tolerable. Para PII / datos financieros la sobrecarga es marginal frente al riesgo.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "to-03",
    unit: "metodo-parcial",
    attrA: "Precision",
    attrB: "Performance",
    mechanism:
      "Aritmética de punto fijo (BigDecimal): más lenta que el punto flotante.",
    resolution:
      "Aceptar el overhead donde la precisión es no negociable (dinero, sensores críticos); usar float donde el error es tolerable.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "to-04",
    unit: "metodo-parcial",
    attrA: "Performance",
    attrB: "Availability",
    mechanism:
      "WebSockets: conexión persistente que vive en una sola instancia = no HA por default.",
    resolution:
      "Failover de conexión + estado externo (Redis pub/sub) + reconexión idempotente del cliente. Se gana latencia real-time a costa de manejar la caída de la conexión.",
    wiki: "analyses/cheat-sheet-estudio-pre-parcial",
  },
  {
    id: "to-05",
    unit: "metodo-parcial",
    attrA: "Consistency",
    attrB: "Availability",
    mechanism:
      "NoSQL distribuidas bajo el Teorema CAP (Cassandra = AP; Mongo configurable).",
    resolution:
      "Elegir según el dominio: financiero -> CP (consistencia no negociable); analytics / feed social -> AP (un dato viejo 30s es tolerable, un 503 no).",
    wiki: "concepts/teorema-cap",
  },
  {
    id: "to-06",
    unit: "metodo-parcial",
    attrA: "Scalability",
    attrB: "Consistency",
    mechanism: "Sharding + read replicas introducen consistencia eventual.",
    resolution:
      "Aceptar la consistencia eventual donde la aplicación la tolera; mantener consistencia fuerte solo en los flujos que la exigen (p. ej. el settlement).",
    wiki: "concepts/replicacion-bd",
  },
  {
    id: "to-07",
    unit: "metodo-parcial",
    attrA: "Modifiability",
    attrB: "Performance",
    mechanism:
      "Microservicios: la red entre servicios cuesta latencia y complejidad operativa.",
    resolution:
      "Modular monolith mientras el equipo sea chico; pasar a microservicios cuando el dolor (despliegue, escalado, equipos) lo justifique. No microservicios desde el día 0 con 5 ingenieros.",
    wiki: "concepts/microservicios",
  },
  {
    id: "to-08",
    unit: "metodo-parcial",
    attrA: "Security",
    attrB: "Usability",
    mechanism:
      "MFA, frecuencia de re-autenticación, restricciones de password.",
    resolution:
      "Diseñar el flujo de UX con security in mind, no como afterthought: MFA en operaciones sensibles (login, cambio de credenciales, transferencias), no en cada interacción.",
    wiki: "concepts/mecanismos-de-seguridad",
  },
  {
    id: "to-09",
    unit: "metodo-parcial",
    attrA: "Time-to-market",
    attrB: "Quality",
    mechanism: "BDUF vs YAGNI vs JEDUF (cuánto diseño hacer por adelantado).",
    resolution:
      "Default JEDUF (just enough design up front): ni parálisis por sobre-diseño (BDUF) ni deuda por sub-diseño (YAGNI puro).",
    wiki: "concepts/bduf-yagni-jeduf",
  },
  {
    id: "to-10",
    unit: "metodo-parcial",
    attrA: "Compliance",
    attrB: "Conveniencia",
    mechanism:
      "Elección de hosting (cloud público vs on-premise / colocation) y data residency.",
    resolution:
      "Si la regulación exige residencia local, se sacrifica la conveniencia del cloud foráneo por control de jurisdicción; el trade-off paralelo es Capex vs Time-to-market.",
    wiki: "concepts/criterios-hosting-data-residency",
  },
  {
    id: "to-11",
    unit: "metodo-parcial",
    attrA: "Availability",
    attrB: "Latency",
    mechanism:
      "PACELC: refina CAP para operación normal. Cassandra es PA/EL; Spanner es PC/EC.",
    resolution:
      "Bajo partición se elige A o C; en operación normal (else) se elige Latency o Consistency. Cassandra prioriza disponibilidad y latencia; Spanner prioriza consistencia siempre, a costa de latencia.",
    wiki: "concepts/teorema-cap",
  },
];
