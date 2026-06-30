/* ============================================================================
 * Banco de finales de Proba — catálogos (tipos · exámenes · TPs).
 * Autoría a partir de Proba/wiki/fuentes/evaluaciones.md (los 19 archivos) y
 * Proba/wiki/index.md (los 9 TPs). Los `exerciseIds` referencian los ids del
 * banco (data.ts), asignados de forma estable acá.
 * ========================================================================== */

import type { ExTypeMeta, Exam, Tp } from "./types";

/** Tipos de ejercicio (orden ~ programa). Es la dimensión del filtro. */
export const EX_TYPES: ExTypeMeta[] = [
  {
    id: "descriptiva",
    label: "Descriptiva",
    blurb: "Datos agrupados, cuartiles, boxplot, asimetría e histograma.",
    units: "U1",
  },
  {
    id: "probabilidad",
    label: "Probabilidad",
    blurb: "Probabilidad total y Bayes, regla de Laplace, conteo.",
    units: "U2",
  },
  {
    id: "va-discreta",
    label: "V.a. discreta",
    blurb: "Árbol, esperanza y varianza, distribuciones discretas.",
    units: "U3",
  },
  {
    id: "va-continua",
    label: "V.a. continua",
    blurb: "Densidad, FDA, mezcla y transformación de variable.",
    units: "U4–U5",
  },
  {
    id: "conjuntas",
    label: "Conjuntas",
    blurb: "Variables bidimensionales, condicionales, covarianza y correlación.",
    units: "U5",
  },
  {
    id: "procesos",
    label: "Procesos",
    blurb: "Proceso de Poisson y cadenas de Markov (regular y absorbente).",
    units: "U6",
  },
  {
    id: "tcl",
    label: "Suma y TCL",
    blurb: "Suma de v.a., TCL, aproximación normal y despeje del tamaño n.",
    units: "U7",
  },
  {
    id: "estimacion",
    label: "Estimación",
    blurb: "Máxima verosimilitud y método de los momentos.",
    units: "U8",
  },
  {
    id: "intervalos",
    label: "Intervalos",
    blurb: "Intervalos de confianza para media (Z y t) y proporción.",
    units: "U8",
  },
  {
    id: "hipotesis",
    label: "Hipótesis",
    blurb: "Test, valor crítico, valor p, error tipo II y potencia.",
    units: "U9",
  },
];

/**
 * Catálogo de evaluaciones (el "file system"). `exerciseIds` apunta a los
 * ejercicios del banco extraídos de ese examen; vacío = en el catálogo pero sin
 * ejercicio extraído todavía. `solved`: full = resolución completa en la fuente.
 */
export const EXAMS: Exam[] = [
  // ── Primeros parciales ───────────────────────────────────────────────
  {
    id: "p1-2017",
    name: "1.º Parcial — 25/04/17",
    file: "01 - Primer Parcial.doc",
    date: "2017-04-25",
    kind: "parcial1",
    solved: "none",
    topics:
      "Canal binario / Bayes, FDA de v.a. continua, normal, exponencial (sistemas serie), transformación de v.a.",
    exerciseIds: [],
  },
  {
    id: "p1-2013",
    name: "1.º Parcial — 26/09/13",
    file: "02 - Primer Parcial.doc",
    date: "2013-09-26",
    kind: "parcial1",
    solved: "partial",
    topics:
      "Confiabilidad (serie/paralelo) con exponencial, normal+binomial, función de v.a. (ganancia), canal 0/1/E.",
    exerciseIds: [],
  },
  {
    id: "p1-2022",
    name: "1.º Parcial — 23/09/22",
    file: "03 - Primer Parcial.pdf",
    date: "2022-09-23",
    kind: "parcial1",
    solved: "answers",
    topics:
      "Sistemas serie/paralelo (exponencial), binomial, prob. total + Bayes (rutas), normal + Bayes, fuente binaria con ruido uniforme.",
    exerciseIds: ["prob-8"],
  },
  {
    id: "p1-2024a",
    name: "1.º Parcial — Tema A 18/04/24",
    file: "04 - Primer Parcial .pdf",
    date: "2024-04-18",
    kind: "parcial1",
    solved: "full",
    topics:
      "Datos agrupados (histograma, media, mediana), Bayes (tipo sangre), binomial + maximización + Poisson, densidad par, cadena genealógica.",
    exerciseIds: [],
  },
  {
    id: "recu-p1-2019",
    name: "Recuperatorio 1.º Parcial — 2019 c2",
    file: "05 - Recuperatorio del Primer Parcial.pdf",
    date: "2019",
    kind: "recu",
    solved: "none",
    topics:
      "Máximo de 3 tiros (v.a. discreta), binomial + tamaño muestra, normal (tamiz), transformación Y=ln X, exponencial (3 dispositivos).",
    exerciseIds: [],
  },
  // ── Segundos parciales ───────────────────────────────────────────────
  {
    id: "p2-2018",
    name: "2.º Parcial — 11/06/18",
    file: "06 - Segundo Parcial.doc",
    date: "2018-06-11",
    kind: "parcial2",
    solved: "none",
    topics:
      "Media muestral normal + test, cadena de Markov regular, exponencial (stock), IC y test de proporción, conjunta exponencial jerárquica.",
    exerciseIds: [],
  },
  {
    id: "p2-2019",
    name: "2.º Parcial — 24/06/19",
    file: "07 - Segundo Parcial.doc",
    date: "2019-06-24",
    kind: "parcial2",
    solved: "answers",
    topics:
      "Conjunta continua, Markov regular, exponencial (Gamma), IC proporción, TCL (random walk), tamaño de muestra, test, estimadores insesgados, error tipo II.",
    exerciseIds: [],
  },
  {
    id: "p2-2022",
    name: "2.º Parcial — 18/11/22",
    file: "08 - Segundo Parcial.docx",
    date: "2022-11-18",
    kind: "parcial2",
    solved: "partial",
    topics:
      "IC y test t-Student, IC proporción (despejar n y p̂), conjunta uniforme, media muestral discreta, TCL con Gamma.",
    exerciseIds: [],
  },
  {
    id: "p2-2024a",
    name: "2.º Parcial — Tema A 11/06/24",
    file: "09 - Segundo Parcial.pdf",
    date: "2024-06-11",
    kind: "parcial2",
    solved: "full",
    topics:
      "Proceso de Poisson (pañales) + aprox. normal, IC proporción + tamaño muestra, IC con t-Student + tamaño n, transformación Q=10D²+2, cadena de Markov absorbente.",
    exerciseIds: ["prob-6", "prob-4", "est-3"],
  },
  {
    id: "recu-p2-2019",
    name: "Recuperatorio 2.º Parcial — 2019 c2",
    file: "10 - Recuperatorio del Segundo Parcial.pdf",
    date: "2019",
    kind: "recu",
    solved: "none",
    topics:
      "Markov regular (señal ternaria), tamaño muestra + test proporción, IC y test con varianza conocida, Poisson (suma + TCL), conjunta jerárquica uniforme.",
    exerciseIds: [],
  },
  // ── Finales ──────────────────────────────────────────────────────────
  {
    id: "final-2023a",
    name: "Final — Tema A 10/07/23",
    file: "11 - Final.pdf",
    date: "2023-07-10",
    kind: "final",
    solved: "none",
    topics:
      "Markov a largo plazo, IC y test t-Student (3 datos), energía cinética (transformación de normal), hipergeométrica vs binomial negativa, máximo de uniformes.",
    exerciseIds: ["prob-7"],
  },
  {
    id: "final-2024a",
    name: "Final — Tema A 22/07/24",
    file: "12 - Final.pdf",
    date: "2024-07-22",
    kind: "final",
    solved: "none",
    topics:
      "Cadena de Markov 2 estados + Bayes temporal, IC y test t-Student + valor p, conjunta discreta + correlación + Bayes, exponencial + binomial + test con valor p exacto.",
    exerciseIds: [],
  },
  {
    id: "parcial-2025q2",
    name: "Parcial — 25/10/25 (con K)",
    file: "2025Q2_Parcial_Resolución.pdf",
    date: "2025-10-25",
    kind: "parcial1",
    solved: "full",
    topics:
      "V.a. mixta (mezcla) por probabilidad total, proceso de Poisson, cadena de Markov regular, densidad conjunta continua, TCL (proporción) + tamaño muestra.",
    exerciseIds: ["prob-1", "prob-3", "prob-5", "est-8"],
  },
  {
    id: "final-2025-12-05a",
    name: "Final — 05/12/25 Tema A",
    file: "2025_12_05_Final_Proba_TemaA_RES.pdf",
    date: "2025-12-05",
    kind: "final",
    solved: "full",
    topics:
      "EMV exponencial, asimetría + histograma, proceso de Poisson (condicional + Erlang + tamaño t), hipergeométrica vs binomial, error tipo II + valor p (proporción), conjunta continua + transformación log.",
    exerciseIds: ["est-1", "prob-2", "prob-7", "est-5", "prob-5"],
  },
  {
    id: "final-2025-12-05b",
    name: "Final — 05/12/25 Tema B",
    file: "2025_12_05_Final_Proba_TemaB_RES.pdf",
    date: "2025-12-05",
    kind: "final",
    solved: "full",
    topics: "Variante paralela del Tema A (mismos temas, distintos datos).",
    exerciseIds: [],
  },
  {
    id: "final-2025-12-15a",
    name: "Final — 15/12/25 Tema A",
    file: "Resolución_Examen_15_12_TemaA.pdf",
    date: "2025-12-15",
    kind: "final",
    solved: "full",
    topics:
      "EMV Poisson, cuartiles + boxplot, esperanza/desvío con árbol, TCL (suma + tamaño n), Markov absorbente, conjunta discreta + covarianza, error tipo II + valor p (media, σ conocido).",
    exerciseIds: ["prob-9", "prob-4", "est-7"],
  },
  {
    id: "final-2025-12-15b",
    name: "Final — 15/12/25 Tema B",
    file: "Resolución_Examen_15_12_Tema B.pdf",
    date: "2025-12-15",
    kind: "final",
    solved: "full",
    topics: "Variante paralela del Tema A (mismos temas, distintos datos).",
    exerciseIds: [],
  },
  // ── Parcialitos por TP ───────────────────────────────────────────────
  {
    id: "parcialito-tp12-b",
    name: "Parcialito TP1-TP2 — Com. B",
    file: "Res_Parcialito_TP1y2_ComB.pdf",
    kind: "parcialito",
    solved: "full",
    topics:
      "Mediana de datos agrupados (con k paramétrico), hipergeométrica vía regla de Laplace.",
    exerciseIds: ["est-6", "prob-10"],
  },
  {
    id: "parcialito-tp89-b",
    name: "Parcialito TP8-TP9 — Com. B",
    file: "Resolucion_Parcialito_TP8y9_ComB.pdf",
    kind: "parcialito",
    solved: "full",
    topics:
      "IC para la media con TCL (límite superior), valor crítico de test t-Student (cola izquierda).",
    exerciseIds: ["est-2", "est-4"],
  },
];

/** Guías de TP — los ejercicios propuestos por la cátedra, por unidad. */
export const TPS: Tp[] = [
  {
    id: "tp1",
    n: 1,
    title: "Estadística descriptiva",
    unit: "U1",
    blurb: "Repaso + ejercicios de descriptiva (frecuencias, medidas, gráficos).",
    types: ["descriptiva"],
  },
  {
    id: "tp2",
    n: 2,
    title: "Cálculo de probabilidades",
    unit: "U2",
    blurb: "40 ejercicios: axiomas, Laplace, condicional, independencia, Bayes.",
    types: ["probabilidad"],
  },
  {
    id: "tp3",
    n: 3,
    title: "Variables aleatorias discretas",
    unit: "U3",
    blurb: "41 ejercicios: PMF/FDA, esperanza/varianza, distribuciones discretas.",
    types: ["va-discreta"],
  },
  {
    id: "tp4",
    n: 4,
    title: "Variables aleatorias continuas",
    unit: "U4",
    blurb: "36 ejercicios: densidad, FDA, uniforme, exponencial, normal (tablas Φ).",
    types: ["va-continua"],
  },
  {
    id: "tp5",
    n: 5,
    title: "Función de v.a. y bidimensionales",
    unit: "U5",
    blurb: "36 ejercicios: Y=g(X), conjuntas, marginales, covarianza y correlación.",
    types: ["va-continua", "conjuntas"],
  },
  {
    id: "tp6",
    n: 6,
    title: "Procesos estocásticos",
    unit: "U6",
    blurb: "25 ejercicios: proceso de Poisson y cadenas de Markov.",
    types: ["procesos"],
  },
  {
    id: "tp7",
    n: 7,
    title: "Suma de variables aleatorias",
    unit: "U7",
    blurb: "Suma/promedio i.i.d., convoluciones, cotas, LGN, TCL, aprox. binomial.",
    types: ["tcl"],
  },
  {
    id: "tp8",
    n: 8,
    title: "Estimación de parámetros",
    unit: "U8",
    blurb: "Estimadores, ECM, máxima verosimilitud, IC para media y proporción.",
    types: ["estimacion", "intervalos"],
  },
  {
    id: "tp9",
    n: 9,
    title: "Pruebas de hipótesis",
    unit: "U9",
    blurb: "Estadísticos, regiones de rechazo, valor p, error tipo II, diseño de n.",
    types: ["hipotesis"],
  },
];
