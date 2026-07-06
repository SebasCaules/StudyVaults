// Registro de los 7 vaults + metadata de presentación y config del pipeline.
// Única fuente de verdad para nav, portal, sidebar y rendering por-materia.

export type VaultId =
  | "mna"
  | "derecho"
  | "economia"
  | "proba"
  | "paw"
  | "sds"
  | "inge2"
  | "fisica1"
  | "fisica2"
  | "fisica3"
  | "am1"
  | "am2"
  | "algebra"
  | "discreta"
  | "logica"
  | "metnum"
  | "pi"
  | "poo"
  | "eda"
  | "arqui"
  | "so"
  | "tla"
  | "bd1"
  | "protos"
  | "quimica"
  | "info";

/** App estática propia de una materia (HTML servido bajo /apps/<vault>/). */
export interface VaultApp {
  label: string; // título de la card-lanzador
  href: string; // ruta SIN basePath (envolver con withBase al renderizar)
  desc: string; // descripción de una línea
}

export interface VaultConfig {
  id: VaultId;
  // Vault inhabilitado: registrado pero excluido del sitio (nav/portal/build).
  // La expansión 2026-07 está inhabilitada salvo fisica3 mientras se revisa;
  // el contenido sigue en el repo — reactivar borrando el flag.
  disabled?: boolean;
  dir: string; // carpeta en la raíz del repo
  name: string; // nombre completo de la materia
  short: string; // etiqueta corta (nav/cards)
  blurb: string; // descripción de una línea
  code: string; // código mono tipo "SYS.01"
  indexPath: string; // ruta del index.md relativa a dir
  contentRoot: string; // subcarpeta donde viven las notas ("wiki" o "")
  math: boolean; // ¿$...$ es LaTeX? (PAW: false → es código EL/JSP)
  lang: "es" | "en";
  // ¿tiene página /[vault]/herramientas? (toolkit interactivo por materia)
  toolkit?: boolean;
  // ¿tiene página /[vault]/hojas? (hojas de fórmulas/conceptos imprimibles)
  // Debe mantenerse en sync con SHEETS en components/vault-sheets/registry.ts.
  sheets?: boolean;
  // ¿tiene página /[vault]/biblioteca? (PDFs de estudio organizados tipo drive)
  // Debe mantenerse en sync con LIBRARIES en components/vault-library/registry.ts.
  library?: boolean;
  // apps estáticas propias (HTML restilizado, servido bajo /apps/<vault>/)
  apps?: VaultApp[];
  // Sidebar (y catálogo) agrupados por UNIDAD (frontmatter `unidad`) en vez de
  // por carpeta. Solo para vaults cuyas páginas tienen `unidad:` consistente
  // (p. ej. Proba). `unitLabels` da el nombre de cada sección; las unidades sin
  // entrada caen a "Unidad <n>" y las páginas sin `unidad` van a "General".
  navByUnit?: boolean;
  unitLabels?: Record<string, string>;
}

const ALL_VAULTS: VaultConfig[] = [
  {
    id: "mna",
    dir: "MNA",
    name: "Métodos Numéricos Avanzados",
    short: "MNA",
    blurb:
      "Álgebra lineal numérica: complejos, espacios vectoriales, factorizaciones LU/QR/SVD y Fourier. Teoría, clases, guías y 30 modelos de parcial resueltos.",
    code: "SYS.01",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
    toolkit: true,
    sheets: true,
  },
  {
    id: "derecho",
    dir: "Derecho",
    name: "Derecho para Ingenieros",
    short: "Derecho",
    blurb:
      "Las 9 unidades del programa: del concepto de derecho a sociedades, contratos, propiedad intelectual y laboral. Con parciales, TPE y referencias jurídicas.",
    code: "SYS.02",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: false,
    lang: "es",
    // Toolkit unificado: el repaso + flashcards del 1.º parcial y el banco de
    // práctica, los conceptos y las preguntas repetidas del 2.º — antes tres
    // apps HTML sueltas, ahora consolidadas en /[vault]/herramientas.
    toolkit: true,
  },
  {
    id: "economia",
    dir: "Economia",
    name: "Economía para Ingenieros",
    short: "Economía",
    blurb:
      "Micro y macro con gráficos vectoriales embebidos y fuerte formulación en LaTeX: oferta y demanda, elasticidades, competencia, mercados.",
    code: "SYS.03",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
    toolkit: true,
    sheets: true,
  },
  {
    id: "proba",
    dir: "Proba",
    name: "Probabilidad y Estadística",
    short: "Proba",
    blurb:
      "Conceptos, distribuciones, teoremas y técnicas, con formularios y fuentes documentadas: variables aleatorias, TCL, estimación, inferencia.",
    code: "SYS.04",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
    toolkit: true,
    sheets: true,
    // El programa de la cátedra se estructura por unidades (frontmatter
    // `unidad:` en cada página) → navegamos por unidad, no por carpeta.
    navByUnit: true,
    unitLabels: {
      "1": "Unidad 1 — Estadística Descriptiva",
      "2": "Unidad 2 — Introducción a la Probabilidad",
      "3": "Unidad 3 — Variables Aleatorias Discretas",
      "4": "Unidad 4 — Variables Aleatorias Continuas",
      "5": "Unidad 5 — Función de V.A. y Variables Bidimensionales",
      "6": "Unidad 6 — Procesos Estocásticos",
      "7": "Unidad 7 — Suma de Variables Aleatorias",
      "8": "Unidad 8 — Inferencia Estadística",
      "9": "Unidad 9 — Pruebas de Hipótesis",
      "0": "Complementos Matemáticos",
      eval: "Evaluaciones",
    },
  },
  {
    id: "paw",
    dir: "PAW",
    name: "Programación de Aplicaciones Web",
    short: "PAW",
    blurb:
      "Entidades, conceptos y análisis del stack web (Spring MVC + JSP) del proyecto Rent The Slopes. Incluye imágenes de las teóricas. En inglés.",
    code: "SYS.05",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: false, // $...$ es Expression Language / JSP, no matemática
    lang: "en",
    toolkit: true,
    sheets: true,
  },
  {
    id: "sds",
    dir: "SDS",
    name: "Simulación de Sistemas",
    short: "SDS",
    blurb:
      "Teoría de simulación, TPs y notas: Vicsek, cell index method, integradores (Verlet, Beeman), observables. Naming en snake_case por convención.",
    code: "SYS.06",
    indexPath: "index.md", // SDS tiene el index en la raíz, no en wiki/
    contentRoot: "wiki",
    math: true,
    lang: "es",
    apps: [
      {
        label: "TP4 · Previsualización",
        href: "/apps/sds/TP4_previsualizacion.html",
        desc: "Gráficos esperados del TP4: observables y curvas de referencia para comparar.",
      },
    ],
  },
  {
    id: "inge2",
    dir: "Inge2",
    name: "Ingeniería del Software II",
    short: "Inge2",
    blurb:
      "Conceptos, clases, casos de estudio y ejercicios de ISW II: arquitectura, seguridad, katas y decisiones de diseño. En inglés.",
    code: "SYS.07",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: false,
    lang: "en",
    toolkit: true,
    sheets: true,
    library: true,
  },
  // ---- expansión 2026-07: vaults transcriptos desde apuntes GoodNotes 2023-2026 ----
  {
    id: "fisica1",
    disabled: true,
    dir: "Fisica1",
    name: "Física 1",
    short: "Física 1",
    blurb:
      "Mecánica clásica completa y fluidos: cinemática, dinámica, energía, colisiones, cuerpo rígido, momento angular, hidrostática y Bernoulli.",
    code: "SYS.08",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "fisica2",
    disabled: true,
    dir: "Fisica2",
    name: "Física 2",
    short: "Física 2",
    blurb:
      "Oscilaciones, ondas, óptica y termodinámica: MAS, resonancia, ondas estacionarias, interferencia y difracción, Snell, ciclos y entropía.",
    code: "SYS.09",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "fisica3",
    dir: "Fisica3",
    name: "Física 3",
    short: "Física 3",
    blurb:
      "Electromagnetismo completo e intro a relatividad especial: Coulomb, Gauss, potencial, circuitos, Biot-Savart, Faraday, RLC y ondas EM.",
    code: "SYS.10",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
    library: true,
  },
  {
    id: "am1",
    disabled: true,
    dir: "AM1",
    name: "Análisis Matemático I",
    short: "AM1",
    blurb:
      "Cálculo integral: tabla de primitivas, técnicas de integración, TFC, aplicaciones y Taylor. Organizado por técnica, con finales resueltos.",
    code: "SYS.11",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "am2",
    disabled: true,
    dir: "AM2",
    name: "Análisis Matemático II",
    short: "AM2",
    blurb:
      "Cálculo multivariable: topología de Rⁿ, límites, diferenciación, integrales múltiples y cálculo vectorial, con parciales y finales fechados.",
    code: "SYS.12",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "algebra",
    disabled: true,
    dir: "Algebra",
    name: "Álgebra",
    short: "Álgebra",
    blurb:
      "Relaciones, funciones, enteros y congruencias, combinatoria, recurrencias, matrices y espacios vectoriales, con parciales resueltos.",
    code: "SYS.13",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "discreta",
    disabled: true,
    dir: "Discreta",
    name: "Matemática Discreta",
    short: "Discreta",
    blurb:
      "Teoría de grafos de punta a punta: paths, conexidad, planaridad, coloreo, árboles, redes de flujo y complejidad, siguiendo P1–P9.",
    code: "SYS.14",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "logica",
    disabled: true,
    dir: "Logica",
    name: "Lógica Computacional",
    short: "Lógica",
    blurb:
      "Lógica proposicional y de primer orden, completitud, y computabilidad: Lenguaje S, funciones recursivas primitivas, Gödel y Halting.",
    code: "SYS.15",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "metnum",
    disabled: true,
    dir: "MetNum",
    name: "Métodos Numéricos",
    short: "MetNum",
    blurb:
      "Curso introductorio: raíces (Newton, punto fijo), interpolación, integración de Simpson con cotas de error y EDOs de un paso.",
    code: "SYS.16",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "pi",
    disabled: true,
    dir: "PI",
    name: "Programación Imperativa",
    short: "PI",
    blurb:
      "C (c99) de punta a punta: toolchain, tipos, punteros, memoria dinámica, structs, recursividad, listas enlazadas y TADs.",
    code: "SYS.17",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: false,
    lang: "es",
  },
  {
    id: "poo",
    disabled: true,
    dir: "POO",
    name: "Programación Orientada a Objetos",
    short: "POO",
    blurb:
      "Java: herencia y resolución de override (formato parcial), Collections y Generics, Iterator/Comparator y comparativa con Ruby.",
    code: "SYS.18",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: false,
    lang: "es",
  },
  {
    id: "eda",
    disabled: true,
    dir: "EDA",
    name: "Estructuras de Datos y Algoritmos",
    short: "EDA",
    blurb:
      "Complejidad, ordenamiento, AVL/Red-Black/B-trees con trazas completas, grafos, strings y heurísticas, desde parciales resueltos.",
    code: "SYS.19",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "arqui",
    disabled: true,
    dir: "Arqui",
    name: "Arquitectura de Computadoras",
    short: "Arqui",
    blurb:
      "x86 concreto: assembler, pila y funciones, decodificación de memoria, interrupciones, modo protegido, paginación, cache y pipeline.",
    code: "SYS.20",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "so",
    disabled: true,
    dir: "SO",
    name: "Sistemas Operativos",
    short: "SO",
    blurb:
      "Procesos, threads y concurrencia a fondo: IPC, exclusión mutua (Peterson, TSL), semáforos y estructura del kernel.",
    code: "SYS.21",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: false,
    lang: "es",
  },
  {
    id: "tla",
    disabled: true,
    dir: "TLA",
    name: "Teoría de Lenguajes y Autómatas",
    short: "TLA",
    blurb:
      "Lenguajes formales, jerarquía de Chomsky, AFD/AFND y minimización, expresiones regulares, lema de bombeo, autómatas de pila y Turing.",
    code: "SYS.22",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "bd1",
    disabled: true,
    dir: "BD1",
    name: "Base de Datos I",
    short: "BD1",
    blurb:
      "Diseño y normalización a fondo: DER, álgebra y cálculo relacional, dependencias funcionales, claves, 1NF–5NF/BCNF y tableau/chase.",
    code: "SYS.23",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "protos",
    disabled: true,
    dir: "Protos",
    name: "Protocolos de Comunicación",
    short: "Protos",
    blurb:
      "Modelo de capas OSI/TCP-IP, encapsulamiento, capa de transporte y protocolos de aplicación (DNS, SMTP), con tablas de referencia.",
    code: "SYS.24",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: false,
    lang: "es",
  },
  {
    id: "quimica",
    disabled: true,
    dir: "Quimica",
    name: "Química",
    short: "Química",
    blurb:
      "Enlace y geometría molecular (VSEPR), cinética, equilibrio, ácido-base y pH, solubilidad y electroquímica, fusión de dos cursadas.",
    code: "SYS.25",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
  {
    id: "info",
    disabled: true,
    dir: "Info",
    name: "Informática",
    short: "Info",
    blurb:
      "Introducción al assembler Z80: memoria y arquitectura, mapa de registros y modos de direccionamiento. Wiki breve de referencia.",
    code: "SYS.26",
    indexPath: "wiki/index.md",
    contentRoot: "wiki",
    math: true,
    lang: "es",
  },
];

// Vaults visibles en el sitio: los inhabilitados quedan registrados (tipos,
// banners) pero fuera de nav, portal, grafo, búsqueda y build.
export const VAULTS: VaultConfig[] = ALL_VAULTS.filter((v) => !v.disabled);

export const VAULTS_BY_ID: Record<VaultId, VaultConfig> = Object.fromEntries(
  VAULTS.map((v) => [v.id, v]),
) as Record<VaultId, VaultConfig>;

export function getVault(id: string): VaultConfig | undefined {
  return VAULTS_BY_ID[id as VaultId];
}

export const REPO_URL = "https://github.com/SebasCaules/StudyVaults";
