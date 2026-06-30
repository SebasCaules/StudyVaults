/* ============================================================================
 * Banco de finales de Proba — ejercicios de estadística (batch B).
 * Transcripción FIEL de Proba/wiki/tecnicas/ejercicios-de-parcial-resueltos-estadistica.md
 * (Ej. 5–8). La matemática NO se reescribe ni se simplifica: se copia tal cual.
 * ========================================================================== */

import type { Exercise } from "./types";

export const EX_EST_B: Exercise[] = [
  {
    id: "est-5",
    num: 15,
    title: "Error tipo II y p-valor (test de proporción, dos colas)",
    area: "estadistica",
    types: ["hipotesis"],
    sources: ["2025_12_05_Final_Proba_TemaA_RES.pdf"],
    examId: "final-2025-12-05a",
    statement: [
      {
        t: "text",
        md: "Históricamente el 25% de las personas en la guardia están engripadas. Con $n=400$ y $\\alpha=6\\%$ se testea si el porcentaje cambió. (a) Error tipo II si el real es $p=18\\%$. (b) Con $\\hat p_{obs}=29\\%$, calcular el p-valor y concluir.",
      },
    ],
    steps: [
      {
        label: "Planteo — el test (dos colas)",
        blocks: [
          {
            t: "math",
            tex: "H_0: p = 0.25, \\qquad H_1: p \\ne 0.25.",
          },
          {
            t: "text",
            md: "Por TCL, $\\hat p \\sim \\mathcal{N}\\!\\left(p, \\sqrt{p(1-p)/n}\\right)$. Como es de dos colas con $\\alpha=0.06$, los valores críticos usan $z_{0.97}\\approx 1.8808$ y $\\sqrt{0.25\\cdot 0.75/400}\\approx 0.02165$:",
          },
          {
            t: "math",
            tex: "p_{c_1} = 0.25 - z_{0.97}\\sqrt{\\tfrac{0.25\\cdot 0.75}{400}}\\approx 0.2093,\n\\quad p_{c_2} = 0.25 + z_{0.97}\\sqrt{\\tfrac{0.25\\cdot 0.75}{400}}\\approx 0.2907.",
          },
          {
            t: "note",
            tone: "warn",
            label: "⚠️ Discrepancia con el raw",
            md: "`2025_12_05_Final_..._TemaA_RES.pdf` Ej. 4 escribe $p_{c_2}\\approx 0.2407$, valor **aritméticamente imposible** (el crítico superior debe ser $>0.25$). El correcto es $0.2907$: es simétrico de $p_{c_1}=0.2093$ respecto de $0.25$ (ambos a $\\pm 0.0407$) y es el que cierra el $\\beta=0.0637$ del propio raw. El $0.2407$ es un typo (un $9$ leído como $4$).",
          },
        ],
      },
      {
        label: "(a) Error tipo II",
        blocks: [
          {
            t: "text",
            md: "$\\beta = P(\\text{aceptar } H_0 \\mid p=0.18)$. Se evalúa la probabilidad de caer entre los críticos **bajo la distribución real** $p=0.18$:",
          },
          {
            t: "math",
            tex: "\\beta(0.18) = \\Phi\\!\\left(\\frac{p_{c_2}-0.18}{\\sqrt{0.18\\cdot 0.82/400}}\\right) - \\Phi\\!\\left(\\frac{p_{c_1}-0.18}{\\sqrt{0.18\\cdot 0.82/400}}\\right) \\approx 0.0637.",
          },
        ],
      },
      {
        label: "(b) p-valor",
        blocks: [
          {
            t: "text",
            md: "(dos colas): probabilidad, **bajo $H_0$**, de un resultado tan o más extremo que lo observado ($|\\hat p - 0.25| \\ge |0.29-0.25| = 0.04$):",
          },
          {
            t: "math",
            tex: "p\\text{-valor} = 2\\left[1 - \\Phi\\!\\left(\\frac{0.04}{\\sqrt{0.25\\cdot 0.75/400}}\\right)\\right] = 2\\left[1-\\Phi(1.8475)\\right] \\approx 0.0645.",
          },
          {
            t: "text",
            md: "Como p-valor $\\approx 0.065 > \\alpha = 0.06$, **no se rechaza $H_0$** (por poco): no hay evidencia suficiente de que el porcentaje haya cambiado.",
          },
          {
            t: "note",
            md: "El final 15/12 Ej. 5 hace lo mismo para una **media** con $\\sigma$ conocido: usa $z$ en vez de la t y estandariza con $\\sigma/\\sqrt n$. Mismo esquema de dos colas, error tipo II y p-valor.",
          },
        ],
      },
    ],
    wikiLinks: [
      { slug: "prueba-de-hipotesis", label: "Prueba de hipótesis" },
      {
        slug: "prueba-de-hipotesis-para-la-proporcion",
        label: "Prueba de hipótesis para la proporción",
      },
      { slug: "error-tipo-i-y-tipo-ii", label: "Error tipo I y tipo II" },
      { slug: "valor-p", label: "Valor p" },
      {
        slug: "teorema-central-del-limite",
        label: "Teorema central del límite",
      },
      { slug: "distribucion-normal", label: "Distribución normal" },
    ],
  },
  {
    id: "est-6",
    num: 16,
    title: "Mediana de datos agrupados (interpolación)",
    area: "estadistica",
    types: ["descriptiva"],
    sources: ["Res_Parcialito_TP1y2_ComB.pdf"],
    examId: "parcialito-tp12-b",
    statement: [
      {
        t: "text",
        md: "Pacientes por intervalo de edad: $[20,30)\\to 5$, $[30,40)\\to 15$, $[40,50)\\to k$, $[50,60)\\to 10$. Calcular la mediana (con $k$ paramétrico, $k\\ge 35$).",
      },
    ],
    steps: [
      {
        label: "Planteo",
        blocks: [
          {
            t: "list",
            items: [
              "**Frecuencias acumuladas**: $5,\\ 20,\\ 20+k,\\ 30+k$. Total $n=30+k$.",
              "**Datos a acumular** para la mediana (50%): $m = n/2 = 15 + k/2$.",
              "**Localizar el intervalo**: como $k\\ge 35$, $15+k/2 \\ge 32.5$, que cae entre 20 y $20+k$ ⇒ la mediana está en $[40,50)$.",
              "**Interpolar** dentro del intervalo:",
            ],
          },
          {
            t: "math",
            tex: "\\tilde x = \\underbrace{40}_{L_i} + \\frac{m - F_{ant}}{f_{\\text{int}}}\\cdot \\underbrace{10}_{\\text{ancho}} = 40 + \\frac{(15+k/2) - 20}{k}\\cdot 10 = 45 - \\frac{50}{k}.",
          },
          {
            t: "note",
            md: "Mismo método que `04 - Primer Parcial .pdf` Ej. 1, donde la mediana de los pesos de recién nacidos cae en $(3.6, 3.8]$ y se interpola: $\\text{mediana} = \\frac{50-44}{62-44}(3.8-3.6) + 3.6 = 3.6667$.",
          },
        ],
      },
    ],
    wikiLinks: [
      {
        slug: "tecnica-datos-agrupados-interpolacion",
        label: "Técnica: datos agrupados (interpolación)",
      },
      { slug: "datos-agrupados", label: "Datos agrupados" },
      {
        slug: "medidas-de-tendencia-central",
        label: "Medidas de tendencia central",
      },
    ],
  },
  {
    id: "est-7",
    num: 17,
    title: "Cuartiles y boxplot (datos discretos)",
    area: "estadistica",
    types: ["descriptiva"],
    sources: ["Resolución_Examen_15_12_TemaA.pdf"],
    examId: "final-2025-12-15a",
    statement: [
      {
        t: "text",
        md: "Datos de estornudos por hora (12 valores): calcular mediana, $q_1$, $q_3$ y hacer un boxplot.",
      },
    ],
    steps: [
      {
        label: "Planteo",
        blocks: [
          {
            t: "list",
            items: [
              "**Ordenar** los datos: $1,1,2,2,2,3,3,4,4,4,5,8$.",
              "**Cuartiles** por posición acumulada: $q_1 = 2$ (25%), mediana $= 3$ (50%), $q_3 = 4$ (75%). Rango intercuartílico $IQR = q_3 - q_1 = 2$.",
              "**Boxplot**: caja de $q_1$ a $q_3$ con la mediana adentro; bigotes hasta $q_1 - 1.5\\,IQR$ y $q_3 + 1.5\\,IQR$. El valor $8$ queda fuera del bigote superior ($4 + 1.5\\cdot 2 = 7$) ⇒ es un **outlier**.",
            ],
          },
        ],
      },
    ],
    wikiLinks: [
      { slug: "cuartiles-y-percentiles", label: "Cuartiles y percentiles" },
      { slug: "boxplot", label: "Boxplot" },
      { slug: "medidas-de-dispersion", label: "Medidas de dispersión" },
    ],
  },
  {
    id: "est-8",
    num: 18,
    title: "TCL para una proporción + despeje del tamaño muestral",
    area: "estadistica",
    types: ["tcl"],
    sources: ["2025Q2_Parcial_Resolución.pdf"],
    examId: "parcial-2025q2",
    statement: [
      {
        t: "note",
        md: "Enunciado con parámetro $K$ (dígito del legajo). Fijamos $K=2$ para tener números concretos; el método es general.",
      },
      {
        t: "text",
        md: "Una pregunta la sabe responder el $\\frac{30K+90}{K+2}\\%$ de los alumnos, es decir $p=\\frac{30K+90}{100(K+2)}$ (con $K=2$, $p=0.375$). Carlos se lleva $n=25(K+3)$ exámenes (con $K=2$, $n=125$). (a) $P(\\ge 10(K+3)$ correctas$)$. (b) $P(\\ge 34\\%$ correctas$)$. (c) **Mínimo nº de exámenes** para que $P\\!\\left(\\hat p \\ge \\frac{29K+87}{100(K+2)}\\right) > 0.9$ (con $K=2$, umbral $0.3625$).",
      },
    ],
    steps: [
      {
        label: "Planteo (a) — conteo: binomial ≈ normal",
        blocks: [
          {
            t: "text",
            md: "$X_n$ = nº de respuestas correctas $\\sim\\text{Bi}(n,p)$. Como $n$ es grande, por TCL $X_n \\overset{(a)}{\\sim}\\mathcal{N}\\!\\big(np,\\ \\sqrt{np(1-p)}\\big)$. Con **corrección por continuidad**:",
          },
          {
            t: "math",
            tex: "P(X_n\\ge 10(K+3)) \\approx 1 - \\Phi\\!\\left(\\frac{10(K+3)-0.5-np}{\\sqrt{np(1-p)}}\\right).",
          },
        ],
      },
      {
        label: "Planteo (b) — proporción muestral",
        blocks: [
          {
            t: "text",
            md: "Misma información leída como proporción:",
          },
          {
            t: "math",
            tex: "\\hat p = \\frac{X_n}{n}\\overset{(a)}{\\sim}\\mathcal{N}\\!\\left(p,\\ \\sqrt{\\tfrac{p(1-p)}{n}}\\right)\n   \\ \\Rightarrow\\ P(\\hat p\\ge 0.34) = 1 - \\Phi\\!\\left(\\frac{0.34-p}{\\sqrt{p(1-p)/n}}\\right).",
          },
        ],
      },
      {
        label: "Planteo (c) — despejar $n$ (lo distinto del Ej. 3)",
        blocks: [
          {
            t: "text",
            md: "Acá $n$ es la incógnita y aparece **solo** dentro de la raíz (no en el cuantil, porque el estadístico es $\\hat p$ y se usa $z$, no $t$), así que se despeja de forma cerrada. Con umbral $u=\\frac{29K+87}{100(K+2)}$ (y $u>p$, cola derecha):",
          },
          {
            t: "math",
            tex: "P(\\hat p\\ge u) = 1-\\Phi\\!\\left(\\frac{u-p}{\\sqrt{p(1-p)/n}}\\right)\\ge 0.9\n   \\ \\Rightarrow\\ \\frac{u-p}{\\sqrt{p(1-p)/n}}\\le \\Phi^{-1}(0.1) = -z_{0.9}.",
          },
          {
            t: "text",
            md: "Despejando (y como $u>p$ el numerador es positivo, hay que cuidar el sentido de la desigualdad al pasar la raíz):",
          },
          {
            t: "math",
            tex: "\\boxed{\\,n \\ge \\frac{p(1-p)\\,\\big(\\Phi^{-1}(0.1)\\big)^2}{(u-p)^2}\\,}.",
          },
          {
            t: "text",
            md: "Con $K=2$: $p=0.375$, $u=0.3625$, $\\big(\\Phi^{-1}(0.1)\\big)^2=z_{0.9}^2\\approx 1.6424$, $(u-p)^2=(-0.0125)^2$ ⇒ $n\\ge 2464$ exámenes.",
          },
          {
            t: "note",
            tone: "tip",
            label: "Contraste con el Ej. 3",
            md: "Allí el cuantil $t_{0.95,n-1}$ **dependía de $n$**, por eso había que iterar por prueba y error. Acá el estadístico es una proporción ($z$ fijo, no $t$), así que el tamaño muestral se despeja de una sola vez. Es el mismo esquema de \"fijar la confianza/potencia y despejar $n$\" que aparece en [[diseno-de-prueba-tamano-muestral]].",
          },
        ],
      },
    ],
    wikiLinks: [
      {
        slug: "teorema-central-del-limite",
        label: "Teorema central del límite",
      },
      { slug: "intervalos-de-confianza", label: "Intervalos de confianza" },
      { slug: "distribucion-normal", label: "Distribución normal" },
      { slug: "distribucion-binomial", label: "Distribución binomial" },
    ],
  },
];
