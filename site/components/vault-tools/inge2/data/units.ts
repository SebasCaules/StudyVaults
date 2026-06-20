/* ──────────────────────────────────────────────────────────────────────────
   Inge2 study toolkit — metadato de las unidades del programa.

   Backbone del dashboard "Plan de recu". Cada `wiki` es un slug RELATIVO al
   contentRoot del vault (`concepts/...`, `classes/...`) — verificado contra los
   basenames reales de Inge2/wiki/. El dashboard arma el href `/inge2/<slug>/`.
   ────────────────────────────────────────────────────────────────────────── */

import type { UnitId, UnitMeta } from "../types";
import { UNIT_IDS } from "../types";

export const UNITS: Record<UnitId, UnitMeta> = {
  fundamentos: {
    id: "fundamentos",
    label: "Fundamentos",
    blurb:
      "Qué es arquitectura, decisiones 'significativas', Architecture Business Cycle, cono de incertidumbre, katas.",
    wiki: [
      "concepts/arquitectura-software-definicion",
      "concepts/architecture-business-cycle",
      "concepts/cono-de-incertidumbre",
      "concepts/katas-de-arquitectura",
      "classes/clase-01-introduccion-arquitectura",
    ],
  },
  atributos: {
    id: "atributos",
    label: "Atributos de calidad",
    blurb:
      "Taxonomía ISO 25000/25010, escenarios cuantificados, cuantificación con SLA/SLO/SLI y MTBF/MTTR.",
    wiki: [
      "concepts/atributos-de-calidad",
      "concepts/sla-slo-sli",
      "concepts/mtbf-mttr",
      "sources/atributos-de-calidad-iso-25000",
    ],
  },
  add: {
    id: "add",
    label: "ADD (Attribute Driven Design)",
    blurb: "Método de 5 pasos para construir arquitectura desde drivers; iteración por atributo.",
    wiki: [
      "concepts/attribute-driven-design",
      "classes/clase-02-construccion-arquitectura",
      "exercises/ejercicio-clase-add-ecommerce",
    ],
  },
  estilos: {
    id: "estilos",
    label: "Estilos arquitectónicos",
    blurb:
      "Catálogo POSA: dataflow (pipes&filters, layers), distributed (broker, pub-sub), interactive (MVC/MVP/MVVM), event-based.",
    wiki: ["concepts/estilos-arquitectonicos"],
  },
  documentacion: {
    id: "documentacion",
    label: "Documentación",
    blurb: "Propósitos de documentar, Modelo 4+1 (Kruchten), C4 (Brown), nivel mínimo necesario.",
    wiki: [
      "concepts/modelo-4-mas-1",
      "concepts/c4-model",
      "classes/clase-05-documentacion-arquitectura",
    ],
  },
  evaluacion: {
    id: "evaluacion",
    label: "Evaluación de arquitectura",
    blurb: "SAAM, ATAM (9 pasos, sensitivity/tradeoff points), Lightweight ATAM, árbol de utilidad.",
    wiki: [
      "concepts/saam",
      "concepts/atam",
      "concepts/lightweight-atam",
      "concepts/arbol-de-utilidad",
    ],
  },
  proceso: {
    id: "proceso",
    label: "Proceso y diseño",
    blurb:
      "BDUF/YAGNI/JEDUF, emergent vs intentional, guardrails, platform engineering, golden paths, ADR.",
    wiki: [
      "concepts/bduf-yagni-jeduf",
      "concepts/emergent-vs-intentional-design",
      "concepts/architectural-guardrails",
      "concepts/platform-engineering",
      "concepts/golden-paths",
      "concepts/adr-architecture-decision-record",
    ],
  },
  persistencia: {
    id: "persistencia",
    label: "Persistencia y datos",
    blurb:
      "Relacional/OLTP, OLAP/ETL, NoSQL, replicación, sharding, CAP, prevalencia, ORM, map-reduce.",
    wiki: [
      "concepts/persistencia",
      "concepts/bases-de-datos-relacionales",
      "concepts/olap-etl",
      "concepts/bases-no-relacionales",
      "concepts/replicacion-bd",
      "concepts/sharding",
      "concepts/teorema-cap",
      "concepts/prevalencia",
      "concepts/orm-impedancia-objeto-relacional",
      "concepts/map-reduce",
      "concepts/bases-de-datos-objetos",
    ],
  },
  bigdata: {
    id: "bigdata",
    label: "Big Data / escalabilidad",
    blurb:
      "Caso Twitter, partition/replicate/index, off-line vs online computation, memory hierarchy, localidad.",
    wiki: [
      "concepts/partition-replicate-index",
      "concepts/off-line-vs-online-computation",
      "concepts/memory-hierarchy",
      "concepts/principio-de-localidad",
      "case-studies/twitter-real-time-scaling",
    ],
  },
  seguridad: {
    id: "seguridad",
    label: "Seguridad",
    blurb:
      "Mecanismos: WAF, MFA, sanitización, encryption at-rest/in-transit, VPN, reverse proxy; defense in depth.",
    wiki: ["concepts/mecanismos-de-seguridad"],
  },
  integracion: {
    id: "integracion",
    label: "Integración / SOA",
    blurb:
      "Evolución point-to-point → ESB → SOA → API/microservicios; governance, modelo canónico, BPM/BAM.",
    wiki: [
      "concepts/integracion-de-sistemas",
      "concepts/soa-service-oriented-architecture",
      "concepts/esb-enterprise-service-bus",
      "concepts/bpm-bam",
    ],
  },
  microservicios: {
    id: "microservicios",
    label: "Microservicios",
    blurb:
      "Descomposición, DDD aggregate, DB per service, Saga, CQRS, Event Sourcing, API Gateway, BFF, Circuit Breaker, Service Mesh.",
    wiki: [
      "concepts/microservicios",
      "concepts/descomposicion-microservicios",
      "concepts/aggregate-ddd",
      "concepts/database-per-service",
      "concepts/patron-saga",
      "concepts/cqrs",
      "concepts/event-sourcing",
      "concepts/api-gateway",
      "concepts/backend-for-frontend",
      "concepts/circuit-breaker",
      "concepts/service-mesh",
      "concepts/orquestacion-vs-coreografia",
    ],
  },
  deployment: {
    id: "deployment",
    label: "Deployment",
    blurb: "Evolución físico → VM → contenedores → Kubernetes → serverless; trade-offs control/lock-in/densidad.",
    wiki: ["concepts/evolucion-deployment"],
  },
  "metodo-parcial": {
    id: "metodo-parcial",
    label: "Método del parcial",
    blurb:
      "Metodología de respuesta, anti-patrones '2 automático', hosting/data residency, trade-offs canónicos, runbook.",
    wiki: [
      "concepts/anti-patrones-parcial",
      "concepts/criterios-hosting-data-residency",
      "classes/clase-08-consultas-pre-parcial",
      "analyses/cheat-sheet-estudio-pre-parcial",
    ],
  },
};

/** Lista ordenada (para iterar el dashboard). */
export const UNIT_LIST: UnitMeta[] = UNIT_IDS.map((id) => UNITS[id]);
