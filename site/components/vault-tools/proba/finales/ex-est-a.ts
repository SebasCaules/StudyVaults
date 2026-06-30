import type { Exercise } from "./types";

export const EX_EST_A: Exercise[] = [
  {
    id: "est-1",
    num: 11,
    title: "Estimador de máxima verosimilitud (exponencial)",
    area: "estadistica",
    types: ["estimacion", "descriptiva"],
    sources: ["2025_12_05_Final_Proba_TemaA_RES.pdf"],
    examId: "final-2025-12-05a",
    statement: [
      {
        t: "text",
        md: "Los tiempos entre toses son exponenciales i.i.d. de parámetro $\\lambda$ desconocido. Se miden 10 tiempos. (a) Hallar el EMV de $\\lambda$ y evaluarlo con los datos. (b) Calcular la asimetría y el histograma.",
      },
    ],
    steps: [
      {
        label: "Intuición — qué busca el EMV",
        blocks: [
          {
            t: "note",
            tone: "tip",
            label: "Intuición",
            md: "Entre todos los valores posibles de $\\lambda$, el de máxima verosimilitud es el que hace que **los datos observados sean lo más probable posible**. La verosimilitud $L$ es justo \"qué tan plausible es esta muestra si el parámetro fuera $\\lambda$\", y se maximiza. El $\\ln$ se aplica solo porque convierte el producto en suma (más fácil de derivar) sin mover el máximo.",
          },
        ],
      },
      {
        label: "Planteo (a) — método EMV",
        blocks: [
          {
            t: "text",
            md: "1. **Verosimilitud** (las $X_i$ son i.i.d. continuas, así que se multiplican las densidades):",
          },
          {
            t: "math",
            tex: "L(x_1,\\dots,x_{10};\\lambda) = \\prod_{i=1}^{10} \\lambda e^{-\\lambda x_i}.",
          },
          {
            t: "text",
            md: "2. **Log-verosimilitud** (el $\\ln$ es creciente, no cambia el argmax):",
          },
          {
            t: "math",
            tex: "\\ln L = 10\\ln\\lambda - \\lambda\\sum_{i=1}^{10} x_i.",
          },
          {
            t: "text",
            md: "3. **Punto crítico**: $\\frac{\\partial}{\\partial\\lambda}\\ln L = \\frac{10}{\\lambda} - \\sum x_i = 0 \\Rightarrow$",
          },
          {
            t: "math",
            tex: "\\boxed{\\hat\\lambda_{MV} = \\frac{10}{\\sum_{i=1}^{10} x_i} = \\frac{1}{\\bar X}.}",
          },
          {
            t: "text",
            md: "Con $\\sum x_i = 108.9$: $\\hat\\lambda_{MV} = 10/108.9 \\approx 0.0918$.",
          },
          {
            t: "note",
            label: "Distinción pre-muestra / post-muestra",
            md: "el estimador como v.a. es $\\hat\\lambda = 1/\\bar X$ (pre-muestra); el **número** $0.0918$ es la estimación post-muestra.",
          },
        ],
      },
      {
        label: "(b) Coherencia",
        blocks: [
          {
            t: "text",
            md: "Con $\\bar x = \\tfrac{108.9}{10} = 10.89$ y $s = \\sqrt{\\tfrac{1}{n-1}\\sum(x_i-\\bar x)^2} = \\sqrt{636.9755/9} \\approx 8.4125$, la asimetría muestral es",
          },
          {
            t: "math",
            tex: "\\gamma = \\frac{\\tfrac1n\\sum_{i=1}^{10}(x_i-\\bar x)^3}{s^3} = 0.2396 > 0",
          },
          {
            t: "text",
            md: "(asimetría positiva, a derecha) y el histograma —con intervalos de 5 min desde 0— confirma cola larga a la derecha, coherente con que una exponencial es asimétrica positiva.",
          },
          {
            t: "note",
            md: "El EMV de la **Poisson** se resuelve idéntico (final 15/12 Ej. 1): $\\hat\\lambda_{MV} = \\frac{1}{n}\\sum k_i = \\bar X$, derivando $\\ln L = -n\\lambda + \\ln\\lambda\\sum k_i - \\sum\\ln(k_i!)$.",
          },
        ],
      },
    ],
    wikiLinks: [
      { slug: "estimacion-puntual", label: "Estimación puntual" },
      { slug: "asimetria-y-curtosis", label: "Asimetría y curtosis" },
      { slug: "distribucion-exponencial", label: "Distribución exponencial" },
      { slug: "promedio-muestral", label: "Promedio muestral" },
    ],
  },
  {
    id: "est-2",
    num: 12,
    title: "Intervalo de confianza para la media (TCL, σ desconocido)",
    area: "estadistica",
    types: ["intervalos", "tcl"],
    sources: ["Resolucion_Parcialito_TP8y9_ComB.pdf"],
    examId: "parcialito-tp89-b",
    statement: [
      {
        t: "text",
        md: "Un profesor estima el tiempo medio $\\mu$ que demoran sus alumnos con un IC del 88%. Toma una muestra de $n$ alumnos, observa media $\\bar x$ y desvío $s$. Calcular el **límite superior** del intervalo.",
      },
    ],
    steps: [
      {
        label: "Planteo",
        blocks: [
          {
            t: "text",
            md: "Las $X_i$ son i.i.d. con media $\\mu$ y desvío $\\sigma$ desconocidos. Por TCL,",
          },
          {
            t: "math",
            tex: "\\bar X_n \\overset{(a)}{\\sim} \\mathcal{N}\\!\\left(\\mu, \\tfrac{\\sigma}{\\sqrt n}\\right) \\Rightarrow \\frac{\\bar X_n - \\mu}{\\sigma/\\sqrt n} \\overset{(a)}{\\sim} \\mathcal{N}(0,1).",
          },
          {
            t: "text",
            md: "Como $\\sigma$ es desconocido, por [[ley-de-grandes-numeros|LGN]] se reemplaza $\\sigma \\approx s$ (válido para $n$ grande; las diferencias son despreciables porque se divide por $\\sqrt n$).",
          },
          {
            t: "note",
            tone: "tip",
            label: "Intuición — por qué acá alcanza con $z$ y no hace falta la $t$",
            md: "Con $n$ grande, el desvío muestral $s$ ya estima muy bien a $\\sigma$ (LGN), así que tratar $s$ como si fuera el verdadero $\\sigma$ casi no agrega error: por eso se usa la normal. Cuando $n$ es chico esa aproximación falla y hay que pagar el \"ensanche\" de la [[distribucion-t-de-student|t de Student]] (Ej. 3 y 4).",
          },
          {
            t: "text",
            md: "Para el **88% central** quedan $6\\%$ en cada cola, así que el cuantil es $z_{0.94}$. El intervalo es",
          },
          {
            t: "math",
            tex: "\\bar X_n \\pm z_{0.94}\\,\\frac{s}{\\sqrt n},",
          },
          {
            t: "text",
            md: "y el **límite superior** pedido:",
          },
          {
            t: "math",
            tex: "\\boxed{b = \\bar X_n + z_{0.94}\\,\\frac{s}{\\sqrt n}.}",
          },
        ],
      },
    ],
    answer: [
      {
        t: "math",
        tex: "\\boxed{b = \\bar X_n + z_{0.94}\\,\\frac{s}{\\sqrt n}.}",
      },
    ],
    wikiLinks: [
      { slug: "ley-de-grandes-numeros", label: "LGN" },
      { slug: "distribucion-t-de-student", label: "t de Student" },
      { slug: "intervalos-de-confianza", label: "Intervalos de confianza" },
      { slug: "teorema-central-del-limite", label: "Teorema central del límite" },
    ],
  },
  {
    id: "est-3",
    num: 13,
    title: "IC con t-Student y tamaño de muestra por prueba y error",
    area: "estadistica",
    types: ["intervalos"],
    sources: ["09 - Segundo Parcial.pdf"],
    examId: "p2-2024a",
    statement: [
      {
        t: "text",
        md: "Absorción $\\sim\\mathcal{N}(\\mu,\\sigma)$, ambos desconocidos. (a) Error $\\le 10$ ml con confianza 90%, sabiendo $s\\le 25$ ml: menor $n$ posible. (b) Con $n=20$, $\\bar x=500$, $s=15$: IC al 90%.",
      },
    ],
    steps: [
      {
        label: "Planteo (a) — $n$ aparece a ambos lados",
        blocks: [
          {
            t: "text",
            md: "Como $\\sigma$ es desconocido y las $X_i$ son normales, se usa **t-Student**:",
          },
          {
            t: "math",
            tex: "\\Delta = t_{0.95,\\,n-1}\\,\\frac{s}{\\sqrt n} \\le 10 \\Rightarrow n \\ge \\left(\\frac{t_{0.95,\\,n-1}\\,s}{10}\\right)^2.",
          },
          {
            t: "text",
            md: "El problema: $t_{0.95,n-1}$ **depende de $n$**. Estrategia:",
          },
          {
            t: "text",
            md: "1. **Estimación inicial** reemplazando $t$ por $z$: $n \\ge (z_{0.95}\\cdot 2.5)^2 = 16.91 \\Rightarrow$ probar $n=17$.",
          },
          {
            t: "text",
            md: "2. **Refinar por prueba y error**: con $n=17$, $\\Delta=10.59>10$ (insuficiente); $n=18 \\Rightarrow 10.25$ (aún no); $n=19 \\Rightarrow 9.95<10$ ✓.",
          },
          {
            t: "text",
            md: "3. **Mínimo $n=19$.**",
          },
        ],
      },
      {
        label: "Planteo (b)",
        blocks: [
          {
            t: "text",
            md: "Con $n=20$: $\\Delta = t_{0.95,19}\\,\\frac{s}{\\sqrt{20}} = 1.7291\\cdot\\frac{15}{\\sqrt{20}} = 5.80$. IC $= 500 \\pm 5.80 = (494.20, 505.80)$.",
          },
          {
            t: "note",
            label: "IC de proporción (2do parcial 2024 Ej. 2)",
            md: "$\\hat p \\pm z_{1-\\alpha/2} \\sqrt{\\hat p(1-\\hat p)/n}$. Si no se conoce $\\hat p$, se acota $\\hat p(1-\\hat p) \\le 1/4$ para el tamaño de muestra: $n \\ge \\left(\\frac{z_{1-\\alpha/2}}{2\\Delta}\\right)^2$.",
          },
        ],
      },
    ],
    wikiLinks: [
      { slug: "intervalos-de-confianza", label: "Intervalos de confianza" },
      { slug: "distribucion-t-de-student", label: "Distribución t de Student" },
    ],
  },
  {
    id: "est-4",
    num: 14,
    title: "Valor crítico de un test (cola izquierda, t-Student)",
    area: "estadistica",
    types: ["hipotesis"],
    sources: ["Resolucion_Parcialito_TP8y9_ComB.pdf"],
    examId: "parcialito-tp89-b",
    statement: [
      {
        t: "text",
        md: "Un profesor quiere ver si una nueva metodología **reduce** el tiempo medio de corrección $\\mu$. Corrige $n=10$ exámenes, tiempo normal, $\\sigma$ desconocido, $\\alpha = 10\\%$. Calcular el **valor crítico**.",
      },
    ],
    steps: [
      {
        label: "Planteo",
        blocks: [
          {
            t: "text",
            md: "Hipótesis (la sospecha \"disminuye\" va en $H_1$):",
          },
          {
            t: "math",
            tex: "H_0: \\mu \\ge \\mu_0, \\qquad H_1: \\mu < \\mu_0.",
          },
          {
            t: "text",
            md: "Como $\\sigma$ desconocido y $n$ chico → estadístico $T = \\frac{\\bar X_n - \\mu_0}{s/\\sqrt n} \\sim t_{n-1}$. Se rechaza $H_0$ si $T$ es chico. Controlando el error tipo I:",
          },
          {
            t: "math",
            tex: "P(T < t_c \\mid \\mu=\\mu_0) = 0.1 \\Rightarrow t_c = t_{n-1;0.1} = -t_{n-1;0.9}.",
          },
          {
            t: "note",
            tone: "warn",
            label: "Error conceptual frecuente",
            md: "(que la resolución marca): NO es válido tomar $x_c = \\mu_0 - t_{n-1;0.9}\\,\\frac{s}{\\sqrt n}$ como valor crítico, porque $s$ se conoce **después** de tomar la muestra y la región de rechazo se fija **antes**. El valor crítico debe ser conocido a priori: $t_c = -t_{n-1;0.9}$, y se rechaza si $\\frac{\\bar X_n - \\mu_0}{s/\\sqrt n} < -t_{n-1;0.9}$.",
          },
        ],
      },
    ],
    answer: [
      {
        t: "math",
        tex: "t_c = t_{n-1;0.1} = -t_{n-1;0.9}.",
      },
    ],
    wikiLinks: [
      { slug: "prueba-de-hipotesis", label: "Prueba de hipótesis" },
      {
        slug: "prueba-de-hipotesis-para-la-media",
        label: "Prueba de hipótesis para la media",
      },
      { slug: "error-tipo-i-y-tipo-ii", label: "Error tipo I y tipo II" },
      { slug: "distribucion-t-de-student", label: "Distribución t de Student" },
    ],
  },
];
