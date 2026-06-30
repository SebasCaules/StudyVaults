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
        md: "Josefina va a la guardia y Amalia, la médica que la atiende, le dice que está engripada. También le comenta que históricamente el **25 % de las personas que acuden a la guardia están engripadas**, y el resto sólo tiene un resfrío alérgico.",
      },
      {
        t: "text",
        md: "Amalia quiere saber si ese porcentaje se mantiene o ha cambiado. Con tal fin guarda los datos sobre los próximos $n=400$ pacientes y calcula la proporción de personas engripadas en el grupo que le tocó atender. Decide considerar un nivel de significación del **6 %**.",
      },
      {
        t: "list",
        items: [
          "**(a)** Calcular la probabilidad de error tipo II si el porcentaje real de personas engripadas es $18\\%$.",
          "**(b)** Si observa un porcentaje de $29\\%$ de personas engripadas, calcular el p-valor. ¿Qué concluye?",
        ],
      },
    ],
    steps: [
      {
        label: "Planteo — el test (dos colas)",
        blocks: [
          {
            t: "text",
            md: "Amalia no sabe de antemano si el porcentaje subió o bajó: sólo quiere detectar **cualquier cambio** respecto del histórico $25\\%$. Por eso el test es **de dos colas**, con la hipótesis nula fijada en el valor histórico:",
          },
          {
            t: "math",
            tex: "H_0: p = 0.25, \\qquad H_1: p \\ne 0.25.",
          },
          {
            t: "text",
            md: "El estadístico es la **proporción muestral** $\\hat p$ entre los $n=400$ pacientes. Por TCL, bajo $H_0$ se distribuye aproximadamente normal centrada en el $p$ hipotético y con error estándar $\\sqrt{p(1-p)/n}$: $\\hat p \\sim \\mathcal{N}\\!\\left(p, \\sqrt{p(1-p)/n}\\right)$. Como es de dos colas con $\\alpha=0.06$, cada cola lleva $\\alpha/2=0.03$, de modo que los valores críticos usan $z_{0.97}\\approx 1.8808$ y el error estándar bajo $H_0$ es $\\sqrt{0.25\\cdot 0.75/400}\\approx 0.02165$. La región de aceptación queda simétrica alrededor de $0.25$:",
          },
          {
            t: "math",
            tex: "p_{c_1} = 0.25 - z_{0.97}\\sqrt{\\tfrac{0.25\\cdot 0.75}{400}}\\approx 0.2093,\n\\quad p_{c_2} = 0.25 + z_{0.97}\\sqrt{\\tfrac{0.25\\cdot 0.75}{400}}\\approx 0.2907.",
          },
          {
            t: "text",
            md: "Se **acepta $H_0$** si $\\hat p$ cae en el intervalo $(p_{c_1}, p_{c_2})\\approx(0.2093,\\ 0.2907)$ y se rechaza si queda por fuera, en cualquiera de las dos colas.",
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
            md: "El **error tipo II** es aceptar $H_0$ cuando en realidad es falsa. Acá el escenario alternativo concreto es $p=0.18$ (el porcentaje real bajó al $18\\%$), así que $\\beta = P(\\text{aceptar } H_0 \\mid p=0.18)$. Aceptar $H_0$ significa que $\\hat p$ cae entre los críticos $p_{c_1}$ y $p_{c_2}$, pero ahora hay que medir esa probabilidad **bajo la distribución real**, es decir con $\\hat p \\sim \\mathcal{N}\\!\\left(0.18, \\sqrt{0.18\\cdot 0.82/400}\\right)$:",
          },
          {
            t: "math",
            tex: "\\beta(0.18) = \\Phi\\!\\left(\\frac{p_{c_2}-0.18}{\\sqrt{0.18\\cdot 0.82/400}}\\right) - \\Phi\\!\\left(\\frac{p_{c_1}-0.18}{\\sqrt{0.18\\cdot 0.82/400}}\\right) \\approx 0.0637.",
          },
          {
            t: "text",
            md: "Es decir, si el verdadero porcentaje fuese $18\\%$, el test todavía aceptaría $H_0$ (no detectaría el cambio) un $\\approx 6.37\\%$ de las veces.",
          },
        ],
      },
      {
        label: "(b) p-valor",
        blocks: [
          {
            t: "text",
            md: "El p-valor (de dos colas) es la probabilidad, **bajo $H_0$**, de obtener un resultado tan o más extremo que lo observado. Con $\\hat p_{obs}=0.29$, el alejamiento respecto del valor hipotético es $|\\hat p - 0.25| \\ge |0.29-0.25| = 0.04$; por simetría se suman las dos colas:",
          },
          {
            t: "math",
            tex: "p\\text{-valor} = 2\\left[1 - \\Phi\\!\\left(\\frac{0.04}{\\sqrt{0.25\\cdot 0.75/400}}\\right)\\right] = 2\\left[1-\\Phi(1.8475)\\right] \\approx 0.0645.",
          },
          {
            t: "text",
            md: "Se compara contra $\\alpha$: como p-valor $\\approx 0.065 > \\alpha = 0.06$, **no se rechaza $H_0$** (por poco): no hay evidencia suficiente, al $6\\%$, de que el porcentaje de engripadas haya cambiado respecto del histórico $25\\%$.",
          },
          {
            t: "note",
            md: "El final 15/12 Ej. 5 hace lo mismo para una **media** con $\\sigma$ conocido ($\\mu_0=40$ personas/hora, $\\sigma=10$, $n=144$): usa $z$ en vez de la t y estandariza con $\\sigma/\\sqrt n$. Mismo esquema de dos colas, error tipo II y p-valor.",
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
        md: "En una clínica se admite una cantidad de pacientes y se les pregunta la edad. Se observan: **5 pacientes entre 20 y 30 años**, **15 entre 30 y 40 años**, **$k$ entre 40 y 50 años** y **10 entre 50 y 60 años**. Calcular la mediana (resultado paramétrico en $k$).",
      },
    ],
    steps: [
      {
        label: "Planteo — tabla de frecuencias",
        blocks: [
          {
            t: "text",
            md: "Los datos vienen **agrupados** por intervalo de edad, así que armamos la tabla de frecuencias $f_i$ por intervalo $[L_i, L_s)$ y la columna de **frecuencias acumuladas** $F_i$:",
          },
          {
            t: "list",
            items: [
              "$[20,30)$: $f_i=5$, $\\ F_i=5$.",
              "$[30,40)$: $f_i=15$, $\\ F_i=20$.",
              "$[40,50)$: $f_i=k$, $\\ F_i=20+k$.",
              "$[50,60)$: $f_i=10$, $\\ F_i=30+k$.",
            ],
          },
          {
            t: "text",
            md: "El total es $n = 30 + k$ datos.",
          },
        ],
      },
      {
        label: "Localizar la mediana",
        blocks: [
          {
            t: "text",
            md: "La mediana es el valor que acumula el $50\\%$ de los datos. Primero calculamos **cuántos datos $m$ hay que acumular**:",
          },
          {
            t: "math",
            tex: "m = n\\cdot 50\\% = n\\cdot\\frac{50}{100} = \\frac{30+k}{2} = 15 + \\frac{k}{2}.",
          },
          {
            t: "text",
            md: "Ahora hay que identificar **en qué intervalo cae** esa acumulación. Suponiendo $k\\ge 35$, se tiene $15+\\frac{k}{2} \\ge 15 + \\frac{35}{2} = \\frac{65}{2} = 32.5$. Con eso se descartan los dos primeros intervalos (porque $15+\\frac{k}{2} > 5$ y $15+\\frac{k}{2} > 20$) y también el último (porque $15+\\frac{k}{2} < 20+k$, ya que ambos términos de la izquierda son menores que los de la derecha). Por lo tanto la **mediana cae en $[40,50)$**.",
          },
        ],
      },
      {
        label: "Interpolar dentro del intervalo",
        blocks: [
          {
            t: "text",
            md: "El intervalo mediano arranca en $L_i=40$, donde ya se acumularon $F_{ant}=20$ datos. Faltan acumular $m - F_{ant} = \\left(15+\\frac{k}{2}\\right) - 20 = \\frac{k}{2} - 5$ datos. Esos datos se reparten de forma uniforme en el intervalo de ancho $10$, que contiene $k$ datos en total. Interpolando linealmente:",
          },
          {
            t: "math",
            tex: "\\tilde x = \\underbrace{40}_{L_i} + \\frac{m - F_{ant}}{f_{\\text{int}}}\\cdot \\underbrace{10}_{\\text{ancho}} = 40 + \\frac{\\left(15+\\tfrac{k}{2}\\right) - 20}{k}\\cdot 10 = 40 - \\frac{50}{k} + \\frac{k\\cdot 10}{2k} = 45 - \\frac{50}{k}.",
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
        md: "Josefina está enferma. La cantidad de veces que estornuda en una hora es una variable de Poisson de parámetro $\\lambda$ desconocido. Para estimarlo, decide monitorear la cantidad de estornudos en las **próximas 12 horas** y registra los siguientes datos:",
      },
      {
        t: "math",
        tex: "2,\\ 1,\\ 4,\\ 8,\\ 2,\\ 4,\\ 5,\\ 1,\\ 3,\\ 4,\\ 3,\\ 2.",
      },
      {
        t: "text",
        md: "**(b)** Para los datos obtenidos, calcular la **mediana**, el **primer cuartil** $q_1$ y el **tercer cuartil** $q_3$, y hacer un **boxplot**.",
      },
      {
        t: "note",
        md: "El ítem (a) del examen pide el EMV de $\\lambda$ de la Poisson, que da $\\hat\\lambda = \\bar x = 39/12 = 3.25$ estornudos/hora. Acá nos ocupamos del ítem (b), puramente descriptivo.",
      },
    ],
    steps: [
      {
        label: "Ordenar los datos",
        blocks: [
          {
            t: "text",
            md: "Para sacar cuartiles primero hay que **ordenar** los $12$ valores de menor a mayor:",
          },
          {
            t: "math",
            tex: "1,\\ 1,\\ 2,\\ 2,\\ 2,\\ 3,\\ 3,\\ 4,\\ 4,\\ 4,\\ 5,\\ 8.",
          },
        ],
      },
      {
        label: "Cuartiles y boxplot",
        blocks: [
          {
            t: "list",
            items: [
              "**Cuartiles** por posición acumulada sobre la muestra ordenada: $q_1 = 2$ (acumula el 25%), mediana $= 3$ (acumula el 50%) y $q_3 = 4$ (acumula el 75%).",
              "**Rango intercuartílico**: $IQR = q_3 - q_1 = 4 - 2 = 2$.",
              "**Boxplot**: la caja va de $q_1=2$ a $q_3=4$ con la mediana ($3$) marcada adentro; los bigotes se extienden hasta $q_1 - 1.5\\,IQR$ y $q_3 + 1.5\\,IQR$.",
              "**Outlier**: el límite del bigote superior es $q_3 + 1.5\\,IQR = 4 + 1.5\\cdot 2 = 7$. El valor $8$ queda por fuera de ese límite ⇒ es un **dato atípico (outlier)** y se grafica como un punto suelto más allá del bigote.",
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
        md: "Enunciado con parámetro $K$ (dígito del legajo). Fijamos $K=2$ para tener números concretos; el método es general y vale para cualquier $K$.",
      },
      {
        t: "text",
        md: "Hay una pregunta del examen que el $\\frac{30K+90}{K+2}\\%$ de los alumnos sabe responder correctamente, es decir una proporción $p=\\frac{30K+90}{100(K+2)}$ (con $K=2$: $p=0.375$). Carlos es profesor de la materia y se lleva $n=25(K+3)$ exámenes (con $K=2$: $n=125$).",
      },
      {
        t: "list",
        items: [
          "**(a)** Calcular la probabilidad de que entre sus exámenes haya **por lo menos $10(K+3)$ respuestas correctas** a dicha pregunta (con $K=2$: al menos $50$).",
          "**(b)** Calcular la probabilidad de que tenga **por lo menos un $34\\%$ de respuestas correctas** a dicha pregunta.",
          "**(c)** Calcular el **número mínimo de exámenes** que deberá llevarse para que la probabilidad de tener por lo menos el $\\frac{29K+87}{K+2}\\%$ de respuestas correctas sea mayor a $0.9$, es decir $P\\!\\left(\\hat p \\ge \\frac{29K+87}{100(K+2)}\\right) > 0.9$ (con $K=2$: umbral $0.3625$).",
        ],
      },
    ],
    steps: [
      {
        label: "Planteo (a) — conteo: binomial ≈ normal",
        blocks: [
          {
            t: "text",
            md: "Llamamos $X_n$ = cantidad de respuestas correctas que recibe Carlos. Cada examen acierta la pregunta con probabilidad $p$ de forma independiente, así que $X_n \\sim\\text{Bi}(n,p)$. Como $n$ es grande, por TCL la binomial se aproxima por una normal con los parámetros adecuados: $X_n \\overset{(a)}{\\sim}\\mathcal{N}\\!\\big(np,\\ \\sqrt{np(1-p)}\\big)$. Como $X_n$ es **discreta** y la normal es continua, se aplica **corrección por continuidad** (se corre el umbral $0.5$):",
          },
          {
            t: "math",
            tex: "P(X_n\\ge 10(K+3)) = P(X_n\\ge 10(K+3)-0.5) \\approx 1 - \\Phi\\!\\left(\\frac{10(K+3)-0.5-np}{\\sqrt{np(1-p)}}\\right).",
          },
          {
            t: "text",
            md: "Con $K=2$ ($n=125$, $p=0.375$, $np=46.875$) esto da $\\approx 0.3138$. (El raw tabula los demás $K$: $0.8380,\\ 0.5406,\\ 0.3138,\\ 0.1747,\\dots$ para $K=0,1,2,3,\\dots$)",
          },
        ],
      },
      {
        label: "Planteo (b) — proporción muestral",
        blocks: [
          {
            t: "text",
            md: "La misma información se puede leer como **proporción muestral** $\\hat p = X_n/n$. También por TCL, $\\hat p$ es aproximadamente normal centrada en $p$ y con error estándar $\\sqrt{p(1-p)/n}$:",
          },
          {
            t: "math",
            tex: "\\hat p = \\frac{X_n}{n}\\overset{(a)}{\\sim}\\mathcal{N}\\!\\left(p,\\ \\sqrt{\\tfrac{p(1-p)}{n}}\\right)\n   \\ \\Rightarrow\\ P(\\hat p\\ge 0.34) = 1 - \\Phi\\!\\left(\\frac{0.34-p}{\\sqrt{p(1-p)/n}}\\right).",
          },
          {
            t: "text",
            md: "Con $K=2$ da $\\approx 0.7905$. Notar que acá $\\hat p$ ya es **continua** (es una proporción), por lo que no hace falta corrección por continuidad.",
          },
        ],
      },
      {
        label: "Planteo (c) — despejar $n$ (lo distinto del Ej. 3)",
        blocks: [
          {
            t: "text",
            md: "Ahora $n$ es la **incógnita**, y se busca de modo que $P(\\hat p\\ge u) \\ge 0.9$ con el umbral $u=\\frac{29K+87}{100(K+2)}$ (con $K=2$: $u=0.3625$, que es **menor** que $p=0.375$, así que es una cola izquierda en la estandarización). La ventaja respecto del Ej. 3 es que $n$ aparece **solo** dentro de la raíz del error estándar y no en el cuantil (el estadístico es $\\hat p$, se usa $z$ y no $t$), por lo que se despeja de forma cerrada. Partimos de la condición y estandarizamos:",
          },
          {
            t: "math",
            tex: "P(\\hat p\\ge u) = 1-\\Phi\\!\\left(\\frac{u-p}{\\sqrt{p(1-p)/n}}\\right)\\ge 0.9\n   \\ \\Rightarrow\\ \\Phi^{-1}(0.1)\\ \\ge\\ \\frac{u-p}{\\sqrt{p(1-p)/n}} = \\frac{(u-p)\\sqrt{n}}{\\sqrt{p(1-p)}}.",
          },
          {
            t: "text",
            md: "Como $u-p<0$ ($u$ está por debajo de $p$), al despejar $n$ se eleva todo al cuadrado y la desigualdad queda en $\\ge$:",
          },
          {
            t: "math",
            tex: "\\boxed{\\,n \\ge \\frac{p(1-p)\\,\\big(\\Phi^{-1}(0.1)\\big)^2}{(u-p)^2}\\,}.",
          },
          {
            t: "text",
            md: "Con $K=2$: $p=0.375$, $u=0.3625$, $\\big(\\Phi^{-1}(0.1)\\big)^2=z_{0.9}^2\\approx 1.6424$, $(u-p)^2=(-0.0125)^2=0.00015625$ ⇒ $n\\ge 2464$ exámenes. (El raw tabula los demás $K$: $1807,\\ 2218,\\ 2464,\\ 2628,\\dots$ para $K=0,1,2,3,\\dots$, redondeando hacia arriba al entero.)",
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
