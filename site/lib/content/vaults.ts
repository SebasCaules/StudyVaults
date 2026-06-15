// Registro de los 7 vaults + metadata de presentación y config del pipeline.
// Única fuente de verdad para nav, portal, sidebar y rendering por-materia.

export type VaultId =
  | "mna"
  | "derecho"
  | "economia"
  | "proba"
  | "paw"
  | "sds"
  | "inge2";

/** App estática propia de una materia (HTML servido bajo /apps/<vault>/). */
export interface VaultApp {
  label: string; // título de la card-lanzador
  href: string; // ruta SIN basePath (envolver con withBase al renderizar)
  desc: string; // descripción de una línea
}

export interface VaultConfig {
  id: VaultId;
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
  // apps estáticas propias (HTML restilizado, servido bajo /apps/<vault>/)
  apps?: VaultApp[];
}

export const VAULTS: VaultConfig[] = [
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
    apps: [
      {
        label: "Estudio interactivo",
        href: "/apps/derecho/estudio-interactivo.html",
        desc: "App de repaso del 2.º parcial: tarjetas, casos y conceptos navegables por unidad.",
      },
      {
        label: "Quiz · 2.º parcial",
        href: "/apps/derecho/quiz-2do-parcial.html",
        desc: "Autoevaluación con preguntas de opción múltiple y corrección al instante.",
      },
      {
        label: "Preguntas repetidas",
        href: "/apps/derecho/preguntas-repetidas-2do-parcial-print.html",
        desc: "Hoja imprimible con las preguntas que más se repiten en el 2.º parcial.",
      },
    ],
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
  },
];

export const VAULTS_BY_ID: Record<VaultId, VaultConfig> = Object.fromEntries(
  VAULTS.map((v) => [v.id, v]),
) as Record<VaultId, VaultConfig>;

export function getVault(id: string): VaultConfig | undefined {
  return VAULTS_BY_ID[id as VaultId];
}

export const REPO_URL = "https://github.com/SebasCaules/StudyVaults";
