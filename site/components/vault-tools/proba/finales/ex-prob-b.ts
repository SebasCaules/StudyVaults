/* ============================================================================
 * Banco de finales de Proba — batch B (probabilidad).
 * Ejercicios 6–10, transcritos FIELMENTE de
 * Proba/wiki/tecnicas/ejercicios-de-parcial-resueltos.md (sección «Evaluaciones»).
 * La matemática NO se reescribe: se copia tal cual de la resolución de cátedra.
 * ========================================================================== */

import type { Exercise } from "./types";

export const EX_PROB_B: Exercise[] = [
  {
    id: "prob-6",
    num: 6,
    title: "Transformación de variable aleatoria continua",
    area: "probabilidad",
    types: ["va-continua"],
    sources: ["09 - Segundo Parcial.pdf"],
    examId: "p2-2024a",
    statement: [
      {
        t: "text",
        md: "**Fuente:** `09 - Segundo Parcial.pdf`, Ej. 4 (precio de pañales).",
      },
      {
        t: "text",
        md: "$D\\sim\\mathcal{U}(0,1)$ y $Q = 10D^2 + 2$. (a) $E[Q]$ y $V(Q)$. (b) Densidad $f_Q$.",
      },
    ],
    steps: [
      {
        label: "Planteo (a) — momentos sin hallar $f_Q$",
        blocks: [
          {
            t: "text",
            md: "Usar [[esperanza|esperanza de una función de v.a.]] directamente:",
          },
          {
            t: "math",
            tex: "E[Q] = 10E[D^2] + 2, \\qquad E[D^2]=\\int_0^1 x^2dx = \\tfrac13 \\Rightarrow E[Q]=\\tfrac{16}{3}.",
          },
          {
            t: "math",
            tex: "E[Q^2] = 100E[D^4] + 40E[D^2] + 4, \\qquad E[D^4]=\\tfrac15,",
          },
          {
            t: "text",
            md: "y $V(Q) = E[Q^2] - E[Q]^2 = \\tfrac{9400}{45} \\approx 208.89$.",
          },
        ],
      },
      {
        label: "Planteo (b) — método de la FDA",
        blocks: [
          {
            t: "text",
            md: "Para $q\\in(2,12)$:",
          },
          {
            t: "math",
            tex: "F_Q(q) = P(10D^2+2 \\le q) = P\\!\\left(D \\le \\sqrt{\\tfrac{q-2}{10}}\\right) = \\sqrt{\\tfrac{q-2}{10}},",
          },
          {
            t: "text",
            md: "(válido porque $D\\ge 0$). Derivando,",
          },
          {
            t: "math",
            tex: "f_Q(q) = \\frac{1}{2\\sqrt{10(q-2)}}, \\quad q\\in(2,12); \\quad 0 \\text{ c.c.}",
          },
        ],
      },
    ],
    wikiLinks: [
      { slug: "funcion-de-variable-aleatoria", label: "Función de variable aleatoria" },
      { slug: "distribucion-uniforme-continua", label: "Distribución uniforme continua" },
      { slug: "funcion-de-densidad", label: "Función de densidad" },
    ],
  },

  {
    id: "prob-7",
    num: 7,
    title: "Hipergeométrica vs Binomial (con/sin reposición)",
    area: "probabilidad",
    types: ["va-discreta"],
    sources: ["2025_12_05_Final_Proba_TemaA_RES.pdf", "11 - Final.pdf"],
    examId: "final-2025-12-05a",
    statement: [
      {
        t: "text",
        md: "**Fuente:** `2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 3 (pastillas) y `11 - Final.pdf`, Ej. 4 (facturas).",
      },
      {
        t: "text",
        md: "**Enunciado (final 05/12).** Cajón con 3 tabletas de 20 pastillas de Paracetamol (60) y 2 de 10 de Ibuprofeno (20). Cada **8 h** se toma una dosis. (a) Eligiendo una **tableta** al azar y reponiéndola cada vez → cada dosis es Paracetamol con $p = 3/5$. Calcular $P(X\\ge 6)$ del nº de Paracetamol **en 72 h (9 dosis)**, y $E,\\sigma$ del nº de Paracetamol **en 48 h (6 dosis)**. (b) Repetir con todas las pastillas **mezcladas** (sin reposición).",
      },
    ],
    steps: [
      {
        label: "Planteo — reconocer la distribución y cuidar el horizonte temporal",
        blocks: [
          {
            t: "list",
            items: [
              "(a) Cada extracción es **independiente** con $p=3/5$ fijo. Hay dos horizontes distintos en el enunciado:",
            ],
          },
          {
            t: "list",
            items: [
              "$72\\text{ h} = 9$ dosis ⇒ $X_9 \\sim \\text{Bi}(9, 3/5)$, y $P(X_9\\ge 6)=\\sum_{i=6}^{9}\\binom{9}{i}(3/5)^i(2/5)^{9-i}\\approx 0.4826$.",
              "$48\\text{ h} = 6$ dosis ⇒ $X_6 \\sim \\text{Bi}(6, 3/5)$, con",
            ],
          },
          {
            t: "math",
            tex: "E[X_6]=6\\cdot\\tfrac35=\\tfrac{18}{5}=3.6, \\qquad \\sigma(X_6)=\\sqrt{6\\cdot\\tfrac35\\cdot\\tfrac25}=\\tfrac{6}{5}=1.2.",
          },
          {
            t: "note",
            tone: "warn",
            label: "Cuidado",
            md: "$E,\\sigma$ se piden para **6 dosis** (48 h), no para las 9 dosis de $P(X\\ge 6)$. Usar $n=9$ acá daría $E=27/5$, que es el horizonte equivocado.",
          },
          {
            t: "list",
            items: [
              "(b) Se sacan dosis de un pool finito de 80 pastillas (60 \"éxitos\") **sin reposición**. Mismo desdoblamiento: $Y_9 \\sim \\mathcal{H}(80,60,9)$ para $P(Y_9\\ge 6)\\approx 0.8469$, y $Y_6 \\sim \\mathcal{H}(N{=}80, K{=}60, n{=}6)$ para $E,\\sigma$:",
            ],
          },
          {
            t: "math",
            tex: "E[Y_6] = n\\tfrac{K}{N}=\\tfrac92, \\qquad \\sigma(Y_6) = \\sqrt{n\\tfrac{K}{N}\\tfrac{N-K}{N}\\tfrac{N-n}{N-1}}\\approx 1.0265,",
          },
          {
            t: "text",
            md: "donde $\\tfrac{N-n}{N-1}$ es el **factor de corrección por población finita**.",
          },
        ],
      },
    ],
    answer: [
      {
        t: "note",
        tone: "tip",
        label: "Moraleja",
        md: "\"Con reposición / pool infinito\" → [[distribucion-binomial|Binomial]]; \"sin reposición de un pool finito\" → [[distribucion-hipergeometrica|Hipergeométrica]]. Cuando $N$ es enorme frente a $n$, la hipergeométrica se aproxima por la binomial.",
      },
    ],
    wikiLinks: [
      { slug: "distribucion-binomial", label: "Binomial" },
      { slug: "distribucion-hipergeometrica", label: "Hipergeométrica" },
    ],
  },

  {
    id: "prob-8",
    num: 8,
    title: "Probabilidad total + Bayes (sistema de rutas)",
    area: "probabilidad",
    types: ["probabilidad"],
    sources: ["03 - Primer Parcial.pdf"],
    examId: "p1-2022",
    statement: [
      {
        t: "text",
        md: "**Fuente:** `03 - Primer Parcial.pdf`, Ej. 3.",
      },
      {
        t: "text",
        md: "**Enunciado.** Rutas 1 y 2 confluyen en la ruta 3. $P(\\text{cong. 1})=0.1$, $P(\\text{cong. 2})=0.3$, $P(1\\mid 2)=0.33$. La ruta 3 se congestiona con prob. 1, 0.15, 0.1 según haya 2, 1 o 0 rutas congestionadas. (a) $P(\\text{cong. 3})$. (b) $P(1\\cap 2 \\mid 3)$.",
      },
    ],
    steps: [
      {
        label: "Planteo (a) — partición por nº de rutas congestionadas",
        blocks: [
          {
            t: "text",
            md: "Definir los eventos de la **partición**: ambas, exactamente una, ninguna. Con $P(1\\cap 2) = P(1\\mid 2)P(2) = 0.33\\cdot 0.3 = 0.099$ se arma la partición y se aplica [[probabilidad-total-y-bayes|probabilidad total]]:",
          },
          {
            t: "math",
            tex: "P(C_3) = \\sum_{\\text{escenarios}} P(C_3\\mid \\text{esc.})\\,P(\\text{esc.}) = 0.1992.",
          },
        ],
      },
      {
        label: "Planteo (b) — Bayes",
        blocks: [
          {
            t: "math",
            tex: "P(1\\cap 2 \\mid C_3) = \\frac{P(C_3\\mid 1\\cap 2)\\,P(1\\cap 2)}{P(C_3)} = \\frac{1\\cdot 0.099}{0.1992} \\approx 0.497.",
          },
        ],
      },
    ],
    wikiLinks: [
      { slug: "probabilidad-total-y-bayes", label: "Probabilidad total y Bayes" },
      { slug: "independencia", label: "Independencia" },
    ],
  },

  {
    id: "prob-9",
    num: 9,
    title: "V.a. discreta por árbol + suma i.i.d. (TCL)",
    area: "probabilidad",
    types: ["va-discreta", "tcl"],
    sources: ["Resolución_Examen_15_12_TemaA.pdf"],
    examId: "final-2025-12-15a",
    statement: [
      {
        t: "text",
        md: "**Fuente:** `Resolución_Examen_15_12_TemaA.pdf`, Ej. 2 (pañuelos).",
      },
      {
        t: "text",
        md: "**Enunciado.** Caja con 10 pañuelos nuevos. Cada vez que estornuda, agarra uno al azar, lo usa y lo devuelve. Un pañuelo usado queda **reutilizable** el 60% de las veces (entonces sirve **una** vez más y luego queda inutilizable) y queda **inutilizable** el otro 40%. Si agarra uno inutilizable, sigue extrayendo hasta agarrar uno nuevo o reutilizable. En una hora estornuda **2 veces**.",
      },
      {
        t: "list",
        items: [
          "(a) $E[M]$ y $\\sigma(M)$ del nº $M$ de pañuelos inutilizables tras una hora.",
          "(b) Si cada hora le reponen la caja (10 nuevos, 2 estornudos/hora), ¿cuántas horas para acumular $\\ge 100$ inutilizables con probabilidad $> 0.92$?",
        ],
      },
    ],
    steps: [
      {
        label: "Planteo (a) — armar la v.a.d. con un [[arbol-de-probabilidades|árbol]]",
        blocks: [
          {
            t: "text",
            md: "Definir eventos por extracción: $N_i$ (agarra nuevo), $R_i$ (reutilizable), $I_i$ (queda inutilizable), con $P(I_i\\mid N_i)=0.6$ y $P(I_i\\mid R_i)=1$. **El primer pañuelo siempre es nuevo** ($P(N_1)=1$). $M\\in\\{0,1,2\\}$ es discreta. Recorriendo las ramas del árbol:",
          },
          {
            t: "math",
            tex: "P(M{=}1) = \\underbrace{0.6\\cdot 1\\cdot 0.4}_{I_1,\\ \\bar I_2}\n            + \\underbrace{0.4\\cdot \\tfrac1{10}\\cdot 1}_{\\bar I_1\\to R_2\\to I_2}\n            + \\underbrace{0.4\\cdot \\tfrac9{10}\\cdot 0.6}_{\\bar I_1\\to N_2\\to I_2} = 0.496,",
          },
          {
            t: "math",
            tex: "P(M{=}2) = 0.6\\cdot 1\\cdot 0.6 = 0.36, \\qquad P(M{=}0)=1-0.496-0.36=0.144.",
          },
          {
            t: "text",
            md: "Entonces, por definición de esperanza,",
          },
          {
            t: "math",
            tex: "E[M] = 0\\cdot 0.144 + 1\\cdot 0.496 + 2\\cdot 0.36 = 1.216,",
          },
          {
            t: "math",
            tex: "E[M^2] = 0.496 + 4\\cdot 0.36 = 1.936 \\Rightarrow \\sigma(M)=\\sqrt{1.936 - 1.216^2}\\approx 0.6763.",
          },
        ],
      },
      {
        label: "Planteo (b) — suma i.i.d. → TCL",
        blocks: [
          {
            t: "text",
            md: "$S_n=\\sum_{i=1}^n M_i$ con $M_i$ i.i.d. ($\\mu_M=1.216$, $\\sigma_M\\approx 0.6763$). Por [[teorema-central-del-limite|TCL]], $S_n \\overset{(a)}{\\sim}\\mathcal{N}\\!\\big(n\\mu_M,\\ \\sqrt n\\,\\sigma_M\\big)$. Se busca $n$ con",
          },
          {
            t: "math",
            tex: "P(S_n\\ge 70) > 0.92 \\ \\Rightarrow\\ 1-\\Phi\\!\\left(\\frac{70-n\\mu_M}{\\sqrt n\\,\\sigma_M}\\right) > 0.92\n   \\ \\Rightarrow\\ z_{0.08}=-z_{0.92}\\ge \\frac{70-n\\mu_M}{\\sqrt n\\,\\sigma_M}.",
          },
          {
            t: "text",
            md: "Es una **cuadrática en $\\sqrt n$**: queda $\\sqrt n \\approx 9.46$ (la otra raíz $\\approx -8.6$ se descarta), de donde $n\\ge 89.63 \\Rightarrow \\boxed{n\\ge 90}$ horas.",
          },
        ],
      },
    ],
    answer: [
      {
        t: "note",
        tone: "warn",
        label: "⚠️ Ojo con el umbral",
        md: "El raw escribe \"$\\ge 70$\" (no 100) en la cuenta de $S_n$; lo importante es el método (v.a.d. por árbol → momentos → suma i.i.d. → TCL → despeje cuadrático en $\\sqrt n$).",
      },
    ],
    wikiLinks: [
      { slug: "arbol-de-probabilidades", label: "Árbol de probabilidades" },
      { slug: "teorema-central-del-limite", label: "Teorema central del límite" },
      { slug: "esperanza", label: "Esperanza" },
      { slug: "varianza", label: "Varianza" },
      { slug: "suma-de-variables-aleatorias", label: "Suma de variables aleatorias" },
      { slug: "suma-de-va-independientes", label: "Suma de v.a. independientes" },
    ],
  },

  {
    id: "prob-10",
    num: 10,
    title: "Hipergeométrica vía regla de Laplace (paramétrico)",
    area: "probabilidad",
    types: ["probabilidad", "va-discreta"],
    sources: ["Res_Parcialito_TP1y2_ComB.pdf"],
    examId: "parcialito-tp12-b",
    statement: [
      {
        t: "text",
        md: "**Fuente:** `Res_Parcialito_TP1y2_ComB.pdf`, Ej. 2.",
      },
      {
        t: "text",
        md: "**Enunciado.** En una clínica hay $N$ personas esperando un test; $M$ de ellas padecen la enfermedad. Quedan **3 tests** y se eligen al azar 3 personas para testear. Calcular la probabilidad de que **al menos 2** de las testeadas estén enfermas.",
      },
    ],
    steps: [
      {
        label: "Planteo — conteo equiprobable ⇒ Laplace",
        blocks: [
          {
            t: "text",
            md: "Todas las selecciones de 3 entre las $N$ son equiprobables, así que se usa la **regla de Laplace** (casos favorables/casos totales). Definir $E_i$ = \"se eligen **exactamente** $i$ enfermas\". Los $E_i$ son **mutuamente excluyentes** (la palabra *exactamente*), así que",
          },
          {
            t: "math",
            tex: "P(\\text{al menos 2}) = P(E_2\\cup E_3) = P(E_2) + P(E_3).",
          },
          {
            t: "text",
            md: "Contando con [[tecnica-conteo-combinatoria|coeficientes binomiales]] (elegir enfermos de los $M$ y sanos de los $N-M$):",
          },
          {
            t: "math",
            tex: "\\boxed{P(E_2\\cup E_3) = \\frac{\\dbinom{M}{2}\\dbinom{N-M}{1}}{\\dbinom{N}{3}}\n                         + \\frac{\\dbinom{M}{3}}{\\dbinom{N}{3}}.}",
          },
          {
            t: "text",
            md: "Esta es exactamente la **suma de los dos términos superiores de la [[distribucion-hipergeometrica|hipergeométrica]]** $\\mathcal{H}(N,M,3)$: el ejercicio **deriva la hipergeométrica desde el conteo de Laplace**, sin invocar la fórmula cerrada.",
          },
        ],
      },
    ],
    answer: [
      {
        t: "note",
        tone: "tip",
        label: "Moraleja",
        md: "Extracción sin reposición de un pool finito + casos equiprobables ⇒ [[regla-de-laplace|Laplace]] con binomiales = [[distribucion-hipergeometrica|hipergeométrica]]. \"Al menos $k$\" se arma sumando las ramas $E_k, E_{k+1},\\dots$ (mutuamente excluyentes), o por el complemento si conviene.",
      },
    ],
    wikiLinks: [
      { slug: "distribucion-hipergeometrica", label: "Hipergeométrica" },
      { slug: "regla-de-laplace", label: "Regla de Laplace" },
      { slug: "tecnica-conteo-combinatoria", label: "Técnica de conteo / combinatoria" },
    ],
  },
];
