/* ============================================================================
 * Banco de finales de Proba — esquema de datos (el contrato).
 *
 * Los ejercicios son FIELES a las resoluciones de la cátedra (extraídos de
 * Proba/wiki/tecnicas/ejercicios-de-parcial-resueltos*.md). La matemática NO se
 * reescribe ni se inventa: se transcribe. El contenido se modela en bloques para
 * renderizar LaTeX con KaTeX (vault-sheets/SheetMath): texto con math inline
 * ($...$) por `RichText`, y fórmulas display por `Math` (tex SIN delimitadores).
 * ========================================================================== */

/** Taxonomía de tipos de ejercicio (la dimensión del filtro). */
export type ExType =
  | "descriptiva"
  | "probabilidad"
  | "va-discreta"
  | "va-continua"
  | "conjuntas"
  | "procesos"
  | "tcl"
  | "estimacion"
  | "intervalos"
  | "hipotesis";

export interface ExTypeMeta {
  id: ExType;
  label: string;
  /** Una línea: qué entra en este tipo. */
  blurb: string;
  /** Unidad(es) del programa que cubre. */
  units: string;
}

/** Bloque de contenido renderizable. */
export type Block =
  | { t: "text"; md: string } // párrafo: math inline $...$ + `code` (RichText)
  | { t: "math"; tex: string } // fórmula display (tex SIN $$)
  | { t: "list"; items: string[] } // viñetas; cada ítem admite $...$ inline
  | {
      t: "note";
      tone?: "tip" | "warn"; // tip = intuición/moraleja; warn = error típico
      label?: string; // p.ej. "Error típico", "Intuición", "Moraleja"
      md: string;
    };

/** Un paso del planteo / resolución. */
export interface Step {
  label: string; // p.ej. "Planteo (a) — método EMV"
  blocks: Block[];
}

/** Un ejercicio resuelto. */
export interface Exercise {
  id: string; // slug estable
  num: number; // ordinal global (orden de lista)
  title: string;
  area: "probabilidad" | "estadistica";
  types: ExType[]; // tags para el filtro
  /** Nombres de archivo de examen de los que sale (campo "Fuente"). */
  sources: string[];
  /** id del examen primario para agrupar en el "file system". */
  examId: string;
  statement: Block[]; // enunciado
  steps: Step[]; // planteo paso a paso
  answer?: Block[]; // respuesta final (si la resolución la cierra)
  /** Deep-links a páginas del wiki ("Ver también"): slug + texto visible. */
  wikiLinks: { slug: string; label: string }[];
}

/** Clase de evaluación (para agrupar el file-system). */
export type ExamKind =
  | "parcial1"
  | "parcial2"
  | "recu"
  | "final"
  | "parcialito";

/** Grado de resolución disponible en la fuente. */
export type Solved = "full" | "partial" | "answers" | "none";

export interface Exam {
  id: string;
  name: string; // nombre legible
  file: string; // archivo raw de origen
  date?: string;
  kind: ExamKind;
  solved: Solved;
  topics: string; // temas que toca (del catálogo de evaluaciones)
  /** ids de ejercicios del banco extraídos de este examen. */
  exerciseIds: string[];
}

/** Guía de TP (ejercicios propuestos por la cátedra). */
export interface Tp {
  id: string;
  n: number; // número de TP
  title: string;
  unit: string;
  blurb: string;
  types: ExType[];
}

/**
 * Método genérico de resolución de un TIPO de ejercicio: la "receta" que
 * generaliza el patrón común de los ejercicios más tomados de ese tipo, paso a
 * paso, citando los teoremas/resultados que se invocan. Es lo que se muestra
 * arriba de la lista al entrar a un tipo, para entender el método antes de
 * mirar casos concretos.
 */
export interface GenericMethod {
  type: ExType;
  /** Título del método (p. ej. "Probabilidad total y Bayes"). */
  title: string;
  /** Por qué este tipo es de los más tomados / qué tan frecuente es. */
  frequency?: string;
  /** Cómo RECONOCER que un ejercicio es de este tipo (señales del enunciado). */
  recognize: Block[];
  /** Procedimiento genérico paso a paso. */
  steps: Step[];
  /** Errores típicos y advertencias al aplicar el método. */
  pitfalls?: Block[];
  /** Teoremas/resultados que se invocan (deep-links al wiki). */
  cites: { slug: string; label: string }[];
}

/** Ítem de verdadero/falso (derivado de los "errores típicos"/moralejas). */
export interface TFItem {
  id: string;
  claim: string; // afirmación (admite $...$ inline)
  answer: boolean; // ¿verdadera?
  explain: string; // por qué (admite $...$ inline)
  type: ExType;
}
