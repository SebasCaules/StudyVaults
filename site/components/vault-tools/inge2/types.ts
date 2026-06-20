/* ──────────────────────────────────────────────────────────────────────────
   Inge2 study toolkit — contratos compartidos (tipos + taxonomía de unidades).

   Este archivo es el BACKBONE de integración: todas las data modules y los
   componentes nuevos referencian `UnitId` desde acá, y la API de progreso
   (`progress.ts`) agrega por unidad. Mantener el union `UnitId` y `UNIT_IDS`
   en sync — son la fuente de verdad de la cobertura del programa.

   Las unidades reflejan el orden temático de la cursada (ver Inge2/wiki/index.md)
   y la cheat-sheet pre-parcial. NO inventar unidades nuevas sin actualizar acá.
   ────────────────────────────────────────────────────────────────────────── */

/** Unidades de estudio del programa de Ingeniería de Software II. */
export type UnitId =
  | "fundamentos" // qué es arquitectura, ABC, "decisiones significativas", cono de incertidumbre
  | "atributos" // atributos de calidad ISO 25000, escenarios, SLA/SLO/SLI, MTBF/MTTR
  | "add" // Attribute Driven Design (método 5 pasos), drivers
  | "estilos" // estilos arquitectónicos POSA (dataflow, distributed, interactive, event)
  | "documentacion" // 4+1, C4, propósitos de documentar
  | "evaluacion" // SAAM, ATAM, Lightweight ATAM, árbol de utilidad
  | "proceso" // BDUF/YAGNI/JEDUF, emergent vs intentional, guardrails, platform eng, ADR
  | "persistencia" // relacional/OLTP, OLAP/ETL, NoSQL, replicación, sharding, CAP, prevalencia, ORM
  | "bigdata" // Twitter, partition/replicate/index, off-line vs online, memory hierarchy
  | "seguridad" // mecanismos de seguridad, auth/MFA, encryption, HTTPS/JWT/WAF/VPN
  | "integracion" // point-to-point → ESB → SOA → microservicios, BPM/BAM
  | "microservicios" // descomposición, DDD aggregate, DB per service, Saga, CQRS, ES, API GW, BFF, CB, mesh
  | "deployment" // VM, containers, Kubernetes, serverless
  | "metodo-parcial"; // metodología del parcial, anti-patrones, hosting/data residency, trade-offs canónicos

/** Orden canónico de las unidades (para iterar dashboards y selects). */
export const UNIT_IDS: UnitId[] = [
  "fundamentos",
  "atributos",
  "add",
  "estilos",
  "documentacion",
  "evaluacion",
  "proceso",
  "persistencia",
  "bigdata",
  "seguridad",
  "integracion",
  "microservicios",
  "deployment",
  "metodo-parcial",
];

/** Metadato de una unidad de estudio (lo consume el dashboard). */
export interface UnitMeta {
  id: UnitId;
  /** Etiqueta corta para chips/headers. */
  label: string;
  /** Una línea: qué cubre la unidad. */
  blurb: string;
  /** Slugs de páginas del wiki (basename sin .md) para deep-links de repaso. */
  wiki: string[];
}

/* ───────────────────────── Flashcards (active recall) ──────────────────── */

export interface Flashcard {
  id: string;
  unit: UnitId;
  /** Pregunta / anverso (prompt de recuerdo activo). */
  front: string;
  /** Respuesta / reverso (concisa, autocontenida, sin "ver arriba"). */
  back: string;
  /** Etiquetas libres para filtrar (ej. "cap", "seguridad", "trade-off"). */
  tags?: string[];
  /** Slug del wiki que respalda la card (basename sin .md). */
  wiki?: string;
}

/* ──────────────────────────── Quiz / banco ─────────────────────────────── */

export type QuizKind = "mcq" | "tf" | "multi";
export type Difficulty = "basico" | "intermedio" | "avanzado";

export interface QuizQuestion {
  id: string;
  unit: UnitId;
  kind: QuizKind;
  difficulty: Difficulty;
  /** Enunciado de la pregunta. */
  prompt: string;
  /** Opciones (para tf: ["Verdadero","Falso"]). */
  options: string[];
  /** Índices correctos. mcq/tf → 1 elemento; multi → ≥1. */
  correct: number[];
  /** Por qué es correcta — citando el corpus. Se muestra tras responder. */
  explanation: string;
  /** Slug del wiki que respalda la respuesta. */
  wiki?: string;
}

/* ─────────────────── Drill: problema → mecanismo (§9) ───────────────────── */

export interface MechanismItem {
  id: string;
  unit: UnitId;
  /** Atributo de calidad en juego (Availability, Security, Performance, …). */
  attribute: string;
  /** Problema / riesgo a resolver. */
  problem: string;
  /** Opciones de mecanismo (una correcta). */
  options: string[];
  /** Índice de la opción correcta. */
  correct: number;
  /** Caveat / cuándo NO — se muestra tras responder. */
  caveat: string;
  wiki?: string;
}

/* ─────────────────── Trade-offs canónicos (§10) ─────────────────────────── */

export interface TradeoffItem {
  id: string;
  unit: UnitId;
  /** Atributo que se gana. */
  attrA: string;
  /** Atributo que se sacrifica. */
  attrB: string;
  /** Mecanismo que evidencia el trade-off. */
  mechanism: string;
  /** Cómo se resuelve en la práctica. */
  resolution: string;
  wiki?: string;
}

/* ─────────────────── Anti-patrones "2 automático" (§11) ─────────────────── */

export interface AntipatternItem {
  id: string;
  /** Nombre del anti-patrón. */
  name: string;
  /** Por qué descalifica. */
  why: string;
  /** La corrección correcta. */
  fix: string;
  /**
   * Frase candidata para el modo "spotter": una decisión de diseño que el
   * alumno debe juzgar como anti-patrón (true) o decisión válida (false).
   */
  spot: { text: string; isAntipattern: boolean }[];
  wiki?: string;
}
