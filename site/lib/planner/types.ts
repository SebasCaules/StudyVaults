// Tipos del planner de Electivas. Reflejan la forma de Electivas/data.js
// (window.PLAN), convertida a lib/planner/data.json por build-planner-data.mjs.

export interface Slot {
  dia: string; // "Lunes" … "Sábado"
  desde: string; // "HH:MM"
  hasta: string; // "HH:MM"
  aula?: string;
  sala?: string;
  sede?: string;
  modalidad?: string; // "Presencial" | "Virtual" | "Blended" | …
  async?: boolean;
}

export interface Comision {
  comision: string;
  slots: Slot[];
  profesores?: string;
  cupo?: string;
}

export interface Horario {
  periodo?: string;
  anio?: string;
  comienzo?: string;
  fin?: string;
  depto?: string;
  comisiones: Comision[];
}

export type Tipo = "obligatoria" | "electiva";

export interface Materia {
  codigo: string;
  nombre: string;
  abbr: string;
  creditos: number;
  creditosReq: number;
  correlativas: string[];
  ciclo?: string;
  seccion?: string;
  anio?: number;
  cuatri?: number;
  parity: number | null; // 1 = 1.º cuat, 2 = 2.º cuat, null = sin restricción
  tipo: Tipo;
  areas?: string[]; // solo electivas
}

/** Materia con su horario resuelto (lo que vive en el map byId). */
export type MateriaM = Materia & { horario: Horario | null };

// ---- ficha (programa analítico) de una electiva ----
// Extraída del PDF oficial del ITBA ("Programas Analíticos - GRADO") por
// scripts/build-fichas-data.mjs → lib/planner/fichas.ts. Indexada por código.

/** Una unidad del temario (fila de la tabla "Contenidos" del programa). */
export interface FichaUnidad {
  titulo: string;
  descripcion: string;
}

/** Desglose de carga horaria del programa analítico. */
export interface FichaCargaHoraria {
  total: number | null; // horas totales del cuatrimestre
  teoricas: number | null;
  practicas: number | null;
  laboratorio: number | null;
  semanales: number | null; // horas semanales
  presencial: number | null;
  distancia: number | null;
}

/** Programa analítico oficial de una electiva (el "ficha" del PDF del ITBA). */
export interface Ficha {
  codigo: string;
  materia: string;
  creditos: number | null;
  departamento: string;
  anio: string; // año del programa, p. ej. "2023"
  carrera: string; // carreras a las que aplica
  actualizado: string; // fecha de última actualización del programa
  cargaHoraria: FichaCargaHoraria;
  contenidosMinimos: string;
  presentacion: string;
  objetivos: string;
  programa: FichaUnidad[]; // temario (tabla "Contenidos")
  estrategias: string;
  evaluacion: string;
  bibliografiaObligatoria: string[];
  bibliografiaComplementaria: string[];
  pdf: string; // ruta pública SIN basePath (envolver con withBase), p. ej. "/electivas-fichas/10.07.pdf"
}

/** Características derivadas del programa analítico (heurística determinista sobre
 *  el texto de `evaluacion`). Convención: se marca un valor SOLO si la señal aparece
 *  explícita en el texto; `null` cuando no se detecta (nunca se infiere un dato ausente).
 *  El texto crudo de `evaluacion` siempre se muestra para que el usuario verifique.
 *  Se computa en runtime desde la `Ficha` (lib/planner/programa.ts) — no se persiste
 *  en fichas.ts, así se re-deriva sin re-parsear los PDFs. */
export interface FichaDerivado {
  tieneParcial: boolean; // aparece "parcial(es)"
  tieneFinal: boolean; // aparece "examen final" / "final" como instancia de examen
  tieneTP: boolean; // aparece "trabajo práctico" / "TP"
  /** promociona sin examen final: true si hay "promoc"; false si hay final; null si es dudoso. */
  promocionable: boolean | null;
  /** asistencia/presentismo obligatorio detectado en "Requisitos de aprobación". */
  asistenciaObligatoria: boolean | null;
  /** porcentaje mínimo de asistencia si el texto lo explicita (ej. 75). */
  asistenciaPct: number | null;
}

/** Filtros por características para "armar plan" (Combinador). `any`/false = sin filtrar. */
export interface CharFilters {
  regimen: "any" | "promocionable" | "sin-final";
  sinAsistenciaObligatoria: boolean;
  maxHsSemanales: number | null;
  soloConPrograma: boolean;
}

export interface Edge {
  from: string;
  to: string;
}

export interface Plan {
  areas: string[];
  obligatorias: Materia[];
  electivas: Materia[];
  horarios: Record<string, Horario>;
  edges: Edge[];
  aprobadasDefault: string[];
  creditosElectivasReq?: number;
  tituloAnalista?: unknown;
  generado?: string;
}

// ---- estado del planner (espejo del `state` de planner.js) ----

export type ViewKey =
  | "cuatri"
  | "elect"
  | "combo"
  | "plan"
  | "grafo"
  | "finales"
  | "ref";

// ---- Plan de finales / Combinación de finales (feature nueva) ----

/** Llamado a mesas de finales del año. */
export type FinalPeriodo = "julio" | "diciembre" | "febrero";

/** Fecha + hora de una mesa de final (autopoblado oficial u override manual). */
export interface MesaFinal {
  fecha: string; // "YYYY-MM-DD"
  hora: string; // "HH:MM"
}

/** Estado del combinador de finales (persistible). El armado efímero de la
 *  combinación sugerida / detección de conflictos vive local en la vista. */
export interface FinalesState {
  periodo: FinalPeriodo;
  anio: number;
  /** override/carga manual de fecha+hora de mesa por materia (clave: código). */
  mesas: Map<string, MesaFinal>;
  /** finales que el usuario sumó a la combinación del período (códigos). */
  seleccion: Set<string>;
  /** anticipación del recordatorio de inscripción para el .ics (hs): 48 | 72 | 96. */
  reminderHs: number;
  /** margen mínimo de repaso deseado entre finales (días). */
  margenDias: number;
}

/** Estrategia de optimización del plan de cursada (elegible por el usuario).
 *  - "cuatris": minimizar la cantidad de cuatrimestres (recibirse antes).
 *  - "dias":    minimizar los días distintos en el campus (menos viajes).
 *  - "balance": repartir la carga (créditos/materias) pareja entre cuatrimestres. */
export type OptMethod = "cuatris" | "dias" | "balance";

export interface ComboParams {
  allowOverlap: boolean;
  modal: { Presencial: boolean; Virtual: boolean; Blended: boolean };
}

export interface PlanStart {
  parity: number;
  year: number;
}

/** Una materia ubicada en un cuatrimestre del plan, con su comisión elegida. */
export interface PlacedMateria {
  m: MateriaM;
  com: Comision | null;
}

export interface PlanResult {
  items: PlacedMateria[][]; // por índice de cuatrimestre
  unplaced: MateriaM[];
  accBefore: number[];
  moved: number;
}

export interface PlanState {
  pool: Set<string>;
  fixed: Map<string, number>;
  start: PlanStart;
  maxCred: number;
  maxMat: number;
  avoid: boolean;
  /** estrategia de optimización elegida (default "cuatris"). */
  method: OptMethod;
  /** override opcional de máx. créditos por índice de cuatrimestre; si no hay
   *  entrada para un índice, se usa el global `maxCred`. */
  capCredByIdx: Map<number, number>;
  /** override opcional de máx. materias por índice de cuatrimestre; si no hay
   *  entrada para un índice, se usa el global `maxMat`. */
  capMatByIdx: Map<number, number>;
  /** cuatrimestres "finalizados" por el usuario: el optimizador no los toca
   *  (no mete materias nuevas ahí ni mueve las existentes hacia/desde ese
   *  índice). Las materias de un índice lockeado se pinean vía `fixed`. */
  lockedIdx: Set<number>;
  result: PlanResult | null;
}

export interface PlannerState {
  view: ViewKey;
  /** cursada aprobada (regular o final) — semántica histórica intacta: todo el
   *  planner de cursada/correlativas la sigue leyendo como "materia aprobada". */
  approved: Set<string>;
  /** subconjunto de `approved` cuyo FINAL también está aprobado (doble-check).
   *  Invariante: `finalDone ⊆ approved`. La vista de finales lo usa para el 2º
   *  nivel; las materias que promocionan/no rinden final nunca entran acá. */
  finalDone: Set<string>;
  combo: Set<string>;
  fixedCom: Map<string, string>;
  areasOn: Set<string>;
  search: string;
  fDisp: boolean;
  fHor: boolean;
  comboParams: ComboParams;
  combos: PlacedMateria[][];
  comboIdx: number;
  plan: PlanState;
  sideCollapsed: boolean;
  drawerCode: string | null;
  fichaCode: string | null; // electiva abierta en el lector full-screen (efímero, sin persistir)
  /** filtros por características del programa para el Combinador (efímero, sin persistir). */
  charFilters: CharFilters;
  /** estado del combinador de finales (período, mesas, selección). */
  finales: FinalesState;
  hydrated: boolean;
}

/** Bloque renderizable en la grilla semanal. */
export interface WeekBlock {
  dia: string;
  desde: string;
  hasta: string;
  abbr: string;
  nombre?: string;
  codigo?: string; // código de la materia → permite click al drawer desde el calendario
  sala?: string;
  sede?: string;
  modalidad?: string;
  color: string;
  conf?: boolean;
}
