import type { Exercise } from "./types";

export const EX_PROB_A: Exercise[] = [
  {
    id: "prob-1",
    num: 1,
    title: "Variable aleatoria mixta por probabilidad total",
    area: "probabilidad",
    types: ["va-continua"],
    sources: ["2025Q2_Parcial_Resolución.pdf"],
    examId: "parcial-2025q2",
    statement: [
      {
        t: "text",
        md: "**Fuente:** `2025Q2_Parcial_Resolución.pdf`, Ejercicio 1 (Tomás estudia).",
      },
      {
        t: "text",
        md: "**Enunciado (resumido).** La cantidad de horas $X$ que estudia Tomás depende de su estado:",
      },
      {
        t: "list",
        items: [
          "Si duerme mal ($D$): $X_D \\sim \\mathcal{U}(a, b)$.",
          "Si come mucho ($C$): $X_C \\sim \\mathcal{E}(\\lambda)$.",
          "En el resto de los casos ($N$): $X_N \\sim \\mathcal{N}(\\mu, \\sigma)$.",
        ],
      },
      {
        t: "text",
        md: "con $P(D), P(C), P(N)$ dados. Calcular $P(X > E[X])$ y el desvío de $X$.",
      },
    ],
    steps: [
      {
        label: "Planteo (la idea clave)",
        blocks: [
          {
            t: "text",
            md: '$X$ es una **mezcla**: no es discreta ni continua "pura", pero **sí es continua**. La herramienta es la **probabilidad total aplicada a la FDA** ([[funcion-de-distribucion-acumulada]]):',
          },
          {
            t: "math",
            tex: " F_X(t) = F_{X_D}(t)\\,P(D) + F_{X_C}(t)\\,P(C) + F_{X_N}(t)\\,P(N). ",
          },
          {
            t: "text",
            md: "Derivando, la densidad también se mezcla:",
          },
          {
            t: "math",
            tex: " f_X(x) = f_{X_D}(x)\\,P(D) + f_{X_C}(x)\\,P(C) + f_{X_N}(x)\\,P(N). ",
          },
        ],
      },
      {
        label: "Cálculo de la esperanza",
        blocks: [
          {
            t: "text",
            md: "Por linealidad, la esperanza de la mezcla es el promedio ponderado de las esperanzas:",
          },
          {
            t: "math",
            tex: " E[X] = P(D)\\,E[X_D] + P(C)\\,E[X_C] + P(N)\\,E[X_N] = \\mu_X. ",
          },
          {
            t: "text",
            md: "Luego $P(X > \\mu_X) = 1 - F_X(\\mu_X)$, evaluando cada $F_{X_i}$ en $\\mu_X$.",
          },
        ],
      },
      {
        label: "Desvío — error típico",
        blocks: [
          {
            t: "text",
            md: "El desvío **NO** se mezcla como las esperanzas ($\\sigma_X \\ne \\sum p_i \\sigma_i$). Lo que sí vale es la mezcla para el **momento de segundo orden**:",
          },
          {
            t: "math",
            tex: " E[X^2] = \\sum_i P(i)\\,E[X_i^2] = \\sum_i P(i)\\big(V(X_i) + E[X_i]^2\\big), ",
          },
          {
            t: "text",
            md: "y recién después $V(X) = E[X^2] - E[X]^2$, $\\sigma_X = \\sqrt{V(X)}$.",
          },
        ],
      },
      {
        label: "Intuición",
        blocks: [
          {
            t: "note",
            tone: "tip",
            label: "Intuición",
            md: 'Pensá en la mezcla como "elegir primero una urna" (con prob. $P(D), P(C), P(N)$) y "después sacar de la urna elegida". Lo **lineal** (densidad, FDA, momentos $E[X^k]$) se promedia con esos pesos porque es una esperanza más. El **desvío** no es lineal (lleva una raíz), por eso no se promedia: además del "spread" interno de cada urna, aparece la variabilidad de *qué urna salió*.',
          },
        ],
      },
    ],
    answer: [
      {
        t: "note",
        tone: "tip",
        label: "Moraleja",
        md: "Para mezclas: la **densidad/FDA y los momentos** se promedian con los pesos $P(i)$; los **desvíos no**. Ver [[mezcla-de-distribuciones|mezcla de distribuciones]], [[varianza]] y [[esperanza]].",
      },
    ],
    wikiLinks: [
      {
        slug: "funcion-de-distribucion-acumulada",
        label: "función de distribución acumulada",
      },
      { slug: "mezcla-de-distribuciones", label: "mezcla de distribuciones" },
      { slug: "varianza", label: "varianza" },
      { slug: "esperanza", label: "esperanza" },
    ],
  },
  {
    id: "prob-2",
    num: 2,
    title: "Proceso de Poisson: condicional, incrementos y Erlang",
    area: "probabilidad",
    types: ["procesos", "tcl"],
    sources: [
      "2025_12_05_Final_Proba_TemaA_RES.pdf",
      "2025Q2_Parcial_Resolución.pdf",
    ],
    examId: "final-2025-12-05a",
    statement: [
      {
        t: "text",
        md: "**Fuente:** `2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 2 (el desarrollo de abajo). El `2025Q2_Parcial_Resolución.pdf` Ej. 2 es **otro** proceso de Poisson, con el mismo método (condicional por incrementos independientes + equivalencia $T_k\\!\\leftrightarrow\\!N$).",
      },
      {
        t: "text",
        md: "**Enunciado (final 05/12).** Los tiempos entre toses son exponenciales i.i.d. de parámetro $\\lambda = \\tfrac{1}{12}\\,\\text{min}^{-1}$. Sea $N(t)$ el proceso de Poisson asociado.",
      },
      {
        t: "text",
        md: "(a) Sabiendo que en los primeros 40 min tosió 4 veces, calcular $P(N(20)=1 \\mid N(40)=4)$ y $P(T_5 < 45)$.",
      },
      {
        t: "text",
        md: "(b) ¿Cuántos minutos monitorear para que $P(N(t)\\ge 50) > 0.9$?",
      },
    ],
    steps: [
      {
        label: "Planteo (a) — condicional dentro de un Poisson",
        blocks: [
          {
            t: "math",
            tex: " P(N(20)=1 \\mid N(40)=4) = \\frac{P(N(20)=1 \\cap N(40)-N(20)=3)}{P(N(40)=4)}. ",
          },
          {
            t: "text",
            md: "Como los **incrementos son independientes**, el numerador factoriza:",
          },
          {
            t: "math",
            tex: " = \\frac{P(N(20)=1)\\,P(N(40)-N(20)=3)}{P(N(40)=4)}. ",
          },
          {
            t: "text",
            md: "Con $N(20)\\sim Po(20\\lambda)=Po(\\tfrac{5}{3})$ y, por **incrementos estacionarios**, $N(40)-N(20)\\sim Po(\\tfrac{5}{3})$, $N(40)\\sim Po(\\tfrac{10}{3})$. La cuenta da el equivalente a una binomial:",
          },
          {
            t: "math",
            tex: " = \\binom{4}{1}\\Big(\\tfrac{1}{2}\\Big)^1\\Big(\\tfrac{1}{2}\\Big)^3 = \\tfrac{1}{4}. ",
          },
        ],
      },
      {
        label: "Planteo (a, 2da parte) — Erlang vía Poisson",
        blocks: [
          {
            t: "text",
            md: "$T_5$ (instante de la 5ª tos) es [[distribucion-erlang|Erlang]]/$\\Gamma(5,\\lambda)$. En vez de integrar la Gamma, se usa la **equivalencia de sucesos** con el proceso de conteo:",
          },
          {
            t: "math",
            tex: " P(T_5 < 45) = P(N(45) \\ge 5) = 1 - P(N(45) \\le 4), \\quad N(45)\\sim Po(45\\lambda). ",
          },
        ],
      },
      {
        label: "Intuición — el truco que aparece una y otra vez",
        blocks: [
          {
            t: "note",
            tone: "tip",
            label: "Intuición",
            md: '"La 5ª tos llegó antes de $t$" y "hubo al menos 5 toses hasta $t$" son **el mismo suceso** vistos del lado del tiempo ($T_5$, continuo) o del lado del conteo ($N(t)$, discreto). Convertir una pregunta sobre tiempos (Erlang/Gamma, que obliga a integrar) en una pregunta sobre conteos (Poisson, que se suma con la PMF) suele ser muchísimo más barato.',
          },
        ],
      },
      {
        label: "Planteo (b) — buscar el tiempo $t$",
        blocks: [
          {
            t: "text",
            md: "Para $\\lambda t$ grande, $N(t)\\sim Po(\\lambda t) \\approx \\mathcal{N}(\\lambda t, \\sqrt{\\lambda t})$ (TCL). Con corrección por continuidad:",
          },
          {
            t: "math",
            tex: " P(N(t)\\ge 50) \\approx 1 - \\Phi\\!\\left(\\frac{49.5 - t/12}{\\sqrt{t/12}}\\right) > 0.9. ",
          },
          {
            t: "text",
            md: "Esto lleva a $z_{0.1} = -z_{0.9} \\ge \\frac{49.5 - t/12}{\\sqrt{t/12}}$, una **cuadrática en $\\sqrt{t}$**. Se resuelve, se descarta la raíz negativa y se verifica: $t \\approx 712.5$ min.",
          },
        ],
      },
    ],
    wikiLinks: [
      { slug: "distribucion-erlang", label: "Erlang" },
      { slug: "proceso-de-poisson", label: "proceso de Poisson" },
      { slug: "distribucion-poisson", label: "distribución de Poisson" },
      { slug: "distribucion-exponencial", label: "distribución exponencial" },
      { slug: "procesos-estocasticos", label: "procesos estocásticos" },
    ],
  },
  {
    id: "prob-3",
    num: 3,
    title: "Cadena de Markov regular: distribución estacionaria",
    area: "probabilidad",
    types: ["procesos", "probabilidad"],
    sources: ["2025Q2_Parcial_Resolución.pdf"],
    examId: "parcial-2025q2",
    statement: [
      {
        t: "text",
        md: "**Fuente:** `2025Q2_Parcial_Resolución.pdf`, Ej. 3 (comidas: Bizcochos, Cereal, Fruta).",
      },
      {
        t: "text",
        md: "**Enunciado (resumido).** $X(n)$ = comida en la hora $n$, estados $\\{B,C,F\\}$, matriz de transición $\\mathbb{P}$ dada. (a) $P(X(3)=F\\mid X(1)=C)$. (b) $P(X(1)=C\\mid X(3)=F)$. (c) Probabilidad a largo plazo de comer bizcochos.",
      },
    ],
    steps: [
      {
        label: 'Planteo (a) — "a futuro" con $\\mathbb{P}^2$',
        blocks: [
          {
            t: "text",
            md: "Pasar de $C$ a $F$ en 2 pasos es la entrada $(C,F)$ de $\\mathbb{P}^2$: multiplicar la fila $C$ por la columna $F$ de $\\mathbb{P}$.",
          },
        ],
      },
      {
        label: "Intuición",
        blocks: [
          {
            t: "note",
            tone: "tip",
            label: "Intuición",
            md: "La entrada $(i,j)$ de $\\mathbb{P}^k$ es la probabilidad de ir de $i$ a $j$ en exactamente $k$ pasos. El producto de matrices no es más que la **probabilidad total** sobre todos los estados intermedios posibles: la fila por la columna suma \"ir a un intermedio y desde ahí al destino\" sobre cada camino.",
          },
        ],
      },
      {
        label: 'Planteo (b) — "hacia atrás" con Bayes',
        blocks: [
          {
            t: "text",
            md: "La matriz solo sirve hacia adelante. Para invertir el tiempo se usa [[probabilidad-total-y-bayes|Bayes]]:",
          },
          {
            t: "math",
            tex: " P(X(1)=C\\mid X(3)=F) = \\frac{P(X(3)=F\\mid X(1)=C)\\,P(X(1)=C)}{\\sum_i P(X(3)=F\\mid X(1)=i)\\,P(X(1)=i)}. ",
          },
          {
            t: "text",
            md: "Si la inicial es uniforme, $P(X(1)=i)=\\tfrac13$ se cancela y queda solo el cociente de las transicionales a 2 pasos.",
          },
        ],
      },
      {
        label: "Planteo (c) — distribución estacionaria",
        blocks: [
          {
            t: "text",
            md: "Primero se verifica que la cadena es **regular** (alguna potencia $\\mathbb{P}^k$ tiene todas las entradas positivas: acá $\\mathbb{P}^2$ casi todas, $\\mathbb{P}^4$ todas). Entonces existe $\\vec\\pi$ única con",
          },
          {
            t: "math",
            tex: " \\vec\\pi = \\vec\\pi\\,\\mathbb{P}, \\qquad \\sum_i \\pi_i = 1. ",
          },
          {
            t: "text",
            md: "Se arma el sistema (descartando una ecuación por dependencia lineal) y se resuelve. Ver [[cadenas-de-markov]].",
          },
        ],
      },
    ],
    wikiLinks: [
      { slug: "probabilidad-total-y-bayes", label: "Bayes" },
      { slug: "cadenas-de-markov", label: "cadenas de Markov" },
    ],
  },
  {
    id: "prob-4",
    num: 4,
    title: "Cadena de Markov con estado absorbente",
    area: "probabilidad",
    types: ["procesos"],
    sources: [
      "09 - Segundo Parcial.pdf",
      "Resolución_Examen_15_12_TemaA.pdf",
    ],
    examId: "p2-2024a",
    statement: [
      {
        t: "text",
        md: "**Fuente:** `09 - Segundo Parcial.pdf`, Ej. 5 (sobrepeso/obesidad/muerte) y `Resolución_Examen_15_12_TemaA.pdf`, Ej. 3 (medicación).",
      },
      {
        t: "text",
        md: "**Enunciado (2do parcial 2024).** Estados $N$ (normal), $S$ (sobrepeso), $O$ (obeso), $M$ (muerto). $M$ es **absorbente**. (b) ¿Hay distribución a largo plazo? (c) Esperanza de vida de un adulto con peso normal.",
      },
    ],
    steps: [
      {
        label: "Planteo (b)",
        blocks: [
          {
            t: "text",
            md: "Cuando hay **un único estado absorbente alcanzable desde todos los demás**, la cadena NO es regular pero **sí tiene distribución a largo plazo**: a la larga todo termina en el absorbente, así que $\\vec\\pi = (1,0,0,0)$ concentrada en $M$ (sin importar el estado inicial).",
          },
        ],
      },
      {
        label: "Planteo (c) — tiempo medio de absorción",
        blocks: [
          {
            t: "text",
            md: "Se ordena $\\mathbb{P}$ separando el absorbente y se toma $Q$ = submatriz de transiciones entre estados transitorios. La **matriz fundamental** es",
          },
          {
            t: "math",
            tex: " (I - Q)^{-1}, ",
          },
          {
            t: "text",
            md: 'cuya entrada $(i,j)$ es el número esperado de visitas al estado $j$ partiendo de $i$. **Sumando la fila** correspondiente al estado inicial se obtiene el tiempo medio total hasta la absorción (la "esperanza de vida"). Ver [[cadenas-de-markov]].',
          },
        ],
      },
      {
        label: 'Variante por complemento — "no absorbido en $k$ pasos"',
        blocks: [
          {
            t: "text",
            md: "**Fuente:** `Resolución_Examen_15_12_TemaA.pdf`, Ej. 3 (medicación: Paracetamol / Ibuprofeno / Ninguno).",
          },
          {
            t: "text",
            md: '**Enunciado.** $X(n)$ = pastilla tomada en la $n$-ésima dosis (cada **8 h**), $E=\\{P,I,N\\}$. $N$ ("se terminan los síntomas") es **absorbente**.',
          },
          {
            t: "math",
            tex: " \\mathbb{P}=\\begin{pmatrix} 0.25 & 0.45 & 0.3 \\\\ 0.6 & 0.3 & 0.1 \\\\ 0 & 0 & 1 \\end{pmatrix}, \\qquad \\vec\\pi^{(0)}=(\\tfrac12,\\tfrac12,0). ",
          },
          {
            t: "text",
            md: "Calcular la probabilidad de que tarde **más de 16 h** (desde la 1ª pastilla) hasta que se terminan los síntomas.",
          },
        ],
      },
      {
        label: "Planteo — la clave es traducir el tiempo a pasos",
        blocks: [
          {
            t: "text",
            md: "$16\\text{ h}/8\\text{ h}=2$ dosis. \"Tardar más de 16 h\" $\\Leftrightarrow$ **no llegar al absorbente $N$ en las primeras 2 transiciones** $\\Leftrightarrow X(1)\\ne N \\ \\wedge\\ X(2)\\ne N$. Por el **complemento**:",
          },
          {
            t: "math",
            tex: " P(\\text{tardar}>16) = 1 - P(X(1)=N) - P\\big(X(1)\\ne N \\cap X(2)=N\\big), ",
          },
          {
            t: "text",
            md: "(los dos sucesos a restar son mutuamente excluyentes: o se absorbe en el paso 1, o no se absorbe en el 1 pero sí en el 2). Desarrollando con $\\vec\\pi^{(0)}$:",
          },
          {
            t: "math",
            tex: " = 1 - \\underbrace{0.5\\cdot 0.3 - 0.5\\cdot 0.1}_{X(1)=N}\n        - \\underbrace{0.5\\cdot 0.25\\cdot 0.3 - 0.5\\cdot 0.45\\cdot 0.1\n        - 0.5\\cdot 0.6\\cdot 0.3 - 0.5\\cdot 0.3\\cdot 0.1}_{X(1)\\ne N,\\ X(2)=N} = 0.635. ",
          },
        ],
      },
      {
        label: "Distribución a largo plazo",
        blocks: [
          {
            t: "text",
            md: "Como $N$ es **el único absorbente** y es accesible desde todos los estados, la cadena no es regular pero tiene límite $\\vec\\pi=(0,0,1)$: a la larga todo termina en $N$, sin importar el estado inicial.",
          },
          {
            t: "note",
            tone: "tip",
            label: "Patrón",
            md: 'Cuando piden "P(no absorbido en $k$ pasos)" conviene el complemento $1-P(\\text{absorbido en }\\le k)$, no la matriz fundamental (esa da el tiempo **medio**, no la probabilidad a horizonte fijo). Es un patrón distinto al de la esperanza de vida de más arriba.',
          },
        ],
      },
    ],
    wikiLinks: [{ slug: "cadenas-de-markov", label: "cadenas de Markov" }],
  },
  {
    id: "prob-5",
    num: 5,
    title: "Densidad conjunta continua: normalización y condicionales",
    area: "probabilidad",
    types: ["conjuntas", "va-continua"],
    sources: [
      "2025Q2_Parcial_Resolución.pdf",
      "2025_12_05_Final_Proba_TemaA_RES.pdf",
    ],
    examId: "parcial-2025q2",
    statement: [
      {
        t: "text",
        md: "**Fuente:** `2025Q2_Parcial_Resolución.pdf`, Ej. 4 y `2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 5 (carga viral).",
      },
      {
        t: "text",
        md: "**Enunciado (final 05/12).** Densidad conjunta",
      },
      {
        t: "math",
        tex: " f_{TX}(t,x) = \\begin{cases} \\tfrac{3}{160}\\,t\\,x & 0\\le t\\le 4,\\ 1\\le x\\le t+1 \\\\ 0 & \\text{c.c.} \\end{cases} ",
      },
      {
        t: "text",
        md: "Si $X = \\log_{10}(C)$: (a) $P(X\\le 3)$ y $P(X\\le 3 \\mid T>2)$. (b) $P(C>1000)$.",
      },
    ],
    steps: [
      {
        label: "Planteo — clave: dibujar la región",
        blocks: [
          {
            t: "text",
            md: "El soporte es triangular ($1\\le x \\le t+1$, $0\\le t \\le 4$). La constante ya está dada (se verifica integrando $=1$). Para $P(X\\le 3)$ conviene el complemento:",
          },
          {
            t: "math",
            tex: " P(X\\le 3) = 1 - P(X>3) = 1 - \\int_{2}^{4}\\!\\!\\int_{3}^{t+1} \\tfrac{3}{160}\\,t\\,x \\,dx\\,dt, ",
          },
          {
            t: "text",
            md: "ojo con los **límites**: $X>3$ exige $t+1 > 3 \\Rightarrow t > 2$, por eso la integral en $t$ arranca en 2. Resultado $\\approx 43/80$.",
          },
        ],
      },
      {
        label: "Planteo — condicional",
        blocks: [
          {
            t: "text",
            md: "$P(X\\le 3\\mid T>2)$ es un cociente de integrales sobre la región recortada por $t>2$:",
          },
          {
            t: "math",
            tex: " P(X\\le 3\\mid T>2) = \\frac{\\displaystyle\\int_2^4\\!\\!\\int_1^{3} \\tfrac{3}{160}txdx\\,dt}{\\displaystyle\\int_2^4\\!\\!\\int_1^{t+1}\\tfrac{3}{160}txdx\\,dt}. ",
          },
        ],
      },
      {
        label: "Planteo (b) — volver a $C$",
        blocks: [
          {
            t: "text",
            md: "$C>1000 \\Leftrightarrow 10^X > 10^3 \\Leftrightarrow X>3$, así que $P(C>1000) = P(X>3) = 1 - P(X\\le 3) = 37/80$.",
          },
        ],
      },
    ],
    answer: [
      {
        t: "text",
        md: "$P(C>1000) = P(X>3) = 1 - P(X\\le 3) = 37/80$.",
      },
    ],
    wikiLinks: [
      {
        slug: "variables-aleatorias-bidimensionales",
        label: "variables aleatorias bidimensionales",
      },
      {
        slug: "funcion-de-variable-aleatoria",
        label: "función de variable aleatoria",
      },
    ],
  },
];
