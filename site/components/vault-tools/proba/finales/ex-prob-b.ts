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
        md: "**Fuente:** `09 - Segundo Parcial.pdf`, Ej. 4 — 2º Parcial Tema A, 11/6/2024 (*leitmotiv: hijos*). Resolución de cátedra **tipeada**.",
      },
      {
        t: "text",
        md: "**Enunciado.** El precio de los pañales $Q$ depende de la demanda $D$ de forma que $Q = 10D^2 + 2$. La investigadora Luz Imagina asegura que la demanda en un mes cualquiera puede modelarse como una variable aleatoria con distribución **uniforme entre 0 y 1**, es decir $D\\sim\\mathcal{U}(0,1)$.",
      },
      {
        t: "list",
        items: [
          "**(a)** Encuentre el valor esperado $E[Q]$ y la varianza $V(Q)$ del precio.",
          "**(b)** Encuentre la función de densidad de probabilidad $f_Q$ de $Q$ y grafíquela.",
        ],
      },
    ],
    steps: [
      {
        label: "Planteo (a) — momentos sin hallar $f_Q$",
        blocks: [
          {
            t: "text",
            md: "No hace falta conocer la densidad de $Q$ para sus momentos: como $Q$ es una **función de $D$**, se aplica la [[esperanza|esperanza de una función de v.a.]] sobre $D$ directamente. Por linealidad de la esperanza, $E[Q]=E[10D^2+2]=10E[D^2]+2$, y desarrollando el cuadrado, $E[Q^2]=E[(10D^2+2)^2]=100E[D^4]+40E[D^2]+4$. Todo se reduce a dos momentos de la uniforme.",
          },
          {
            t: "text",
            md: "Esos momentos se calculan con $f_D(x)=1$ en $(0,1)$, integrando sobre el soporte:",
          },
          {
            t: "math",
            tex: "E[D^2]=\\int_{-\\infty}^{+\\infty}\\! x^2 f_D(x)\\,dx=\\int_0^1 x^2\\,dx=\\tfrac13, \\qquad E[D^4]=\\int_0^1 x^4\\,dx=\\tfrac15.",
          },
          {
            t: "text",
            md: "Sustituyendo en la fórmula de $E[Q]$, la esperanza del precio queda",
          },
          {
            t: "math",
            tex: "E[Q] = \\tfrac{16}{3} = 5.3333.",
          },
          {
            t: "text",
            md: "Para la varianza se calcula primero el segundo momento (con los mismos $E[D^2],E[D^4]$) y luego se resta el cuadrado de la media ([[varianza|fórmula de cómputo]] $V(Q)=E[Q^2]-E[Q]^2$). Siguiendo la resolución de cátedra:",
          },
          {
            t: "math",
            tex: "E[Q^2] = \\tfrac{3560}{15}, \\qquad V(Q) = E[Q^2] - E[Q]^2 = \\tfrac{9400}{45} \\approx 208.8889.",
          },
        ],
      },
      {
        label: "Planteo (b) — método de la FDA",
        blocks: [
          {
            t: "text",
            md: "La densidad de $Q$ se obtiene por el [[funcion-de-variable-aleatoria|método de la función de distribución]]: se arma primero la [[funcion-de-distribucion-acumulada|FDA]] $F_Q$ y luego se deriva. Conviene fijar el **soporte** de $Q$: como $D$ recorre $(0,1)$ y $Q=10D^2+2$ es creciente en $D\\ge 0$, $Q$ toma valores en $(2,12)$. Por lo tanto $F_Q(q)=0$ para $q<2$ y $F_Q(q)=1$ para $q>12$.",
          },
          {
            t: "text",
            md: "Para $q\\in(2,12)$ se despeja $D$ del evento $\\{Q\\le q\\}$. Como $D\\ge 0$, al sacar la raíz se conserva una sola rama:",
          },
          {
            t: "math",
            tex: "F_Q(q) = P(10D^2+2 \\le q) = P\\!\\left(D \\le \\sqrt{\\tfrac{q-2}{10}}\\right) = \\sqrt{\\tfrac{q-2}{10}},",
          },
          {
            t: "text",
            md: "donde el último paso usa que para la uniforme $\\mathcal{U}(0,1)$ la FDA es la identidad, $F_D(d)=d$. Derivando respecto de $q$ se obtiene la densidad:",
          },
          {
            t: "math",
            tex: "f_Q(q) = \\frac{1}{2\\sqrt{10(q-2)}}, \\quad q\\in(2,12); \\quad 0 \\text{ c.c.}",
          },
          {
            t: "note",
            tone: "tip",
            label: "Intuición",
            md: "La densidad **diverge** cuando $q\\to 2^+$ (precios bajos): como $Q$ es cuadrática en $D$, los valores de $D$ chicos se \"comprimen\" cerca de $q=2$ y acumulan ahí la mayor densidad, aun siendo $D$ uniforme.",
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
        md: "**Fuente:** `2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 3 (pastillas; resolución **manuscrita**) y `11 - Final.pdf` / final 10/7/2023, Ej. 4 (facturas; **tipeada**). Mismo molde Binomial vs Hipergeométrica.",
      },
      {
        t: "text",
        md: "**Enunciado (final 05/12, *leitmotiv: Josefina enferma*).** Para paliar los síntomas, cada **8 horas** Josefina toma algún medicamento entre Paracetamol e Ibuprofeno. En un cajón tiene **3 tabletas de 20 pastillas de Paracetamol** y **2 tabletas de 10 pastillas de Ibuprofeno** (60 pastillas de Paracetamol y 20 de Ibuprofeno; 80 en total). Como se siente mal, **agarra una tableta al azar** y toma una pastilla de la tableta; luego **vuelve a meter la tableta en el cajón**.",
      },
      {
        t: "list",
        items: [
          "**(a)** Con reposición de la tableta: calcular la probabilidad de que en **72 horas** tome **por lo menos 6** pastillas de Paracetamol, y el valor esperado y el desvío del número de pastillas de Paracetamol que toma en **48 hs**.",
          "**(b)** Repetir el ítem anterior en el caso en que las pastillas **no están en tabletas, sino todas mezcladas** en un pastillero (extracción sin reposición del pool de 80).",
        ],
      },
      {
        t: "note",
        tone: "tip",
        label: "Lectura clave",
        md: "Eligiendo una **tableta** al azar (3 de Paracetamol sobre 5 tabletas) y reponiéndola, cada dosis es Paracetamol con $p=3/5$ **independiente** de las demás → Binomial. En el pastillero mezclado se sacan pastillas de un pool finito **sin reposición** → Hipergeométrica. La conversión horas → dosis es $8\\text{ h/dosis}$: $72\\text{ h}=9$ dosis, $48\\text{ h}=6$ dosis.",
      },
      {
        t: "text",
        md: "**Variante facturas (final 10/7/2023, Ej. 4).** El jefe despide al empleado si encuentra **más de una** factura con errores. (a) Toma **4 facturas al azar de un conjunto de 10**, de las cuales **6 tienen errores** → $\\mathcal{H}(10,6,4)$. (b) Toma **4 de un conjunto de 3000** con **1800 con errores** → como $N$ es enorme frente a $n$, se aproxima por $\\text{Bi}(4,\\,0.6)$. (c) Suponiendo $p=0.6$ por factura e independencia, ¿mínimo número de facturas para alcanzar **1000 con errores** con probabilidad $\\ge 95\\%$? (suma de Bernoulli i.i.d. → TCL).",
      },
    ],
    steps: [
      {
        label: "Planteo — reconocer la distribución y cuidar el horizonte temporal",
        blocks: [
          {
            t: "text",
            md: "**(a) Con reposición de la tableta.** Como la tableta se devuelve cada vez, la composición del cajón no cambia y cada dosis es Paracetamol con la misma probabilidad $p=3/5$ (3 de las 5 tabletas son de Paracetamol), de forma **independiente** entre dosis. El número de dosis de Paracetamol es entonces [[distribucion-binomial|Binomial]]. El cuidado está en que el enunciado mezcla **dos horizontes temporales distintos**:",
          },
          {
            t: "list",
            items: [
              "$72\\text{ h} = 9$ dosis ⇒ $X_9 \\sim \\text{Bi}(9, 3/5)$. \"Por lo menos 6\" se suma sobre las ramas $6,7,8,9$: $P(X_9\\ge 6)=\\sum_{i=6}^{9}\\binom{9}{i}(3/5)^i(2/5)^{9-i}\\approx 0.4826$.",
              "$48\\text{ h} = 6$ dosis ⇒ $X_6 \\sim \\text{Bi}(6, 3/5)$, cuyos momentos son $E=np$ y $\\sigma=\\sqrt{np(1-p)}$:",
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
            t: "text",
            md: "**(b) Pastillero mezclado (sin reposición).** Ahora se extraen pastillas individuales de un pool **finito** de $N=80$ (de las cuales $K=60$ son Paracetamol, los \"éxitos\") y **no se reponen**: cada extracción altera la composición del pastillero, así que las dosis dejan de ser independientes y el modelo correcto es la [[distribucion-hipergeometrica|Hipergeométrica]]. Con el mismo desdoblamiento de horizontes:",
          },
          {
            t: "list",
            items: [
              "$72\\text{ h}=9$ dosis ⇒ $Y_9 \\sim \\mathcal{H}(80,60,9)$, y $P(Y_9\\ge 6)\\approx 0.8469$.",
              "$48\\text{ h}=6$ dosis ⇒ $Y_6 \\sim \\mathcal{H}(N{=}80, K{=}60, n{=}6)$, con momentos",
            ],
          },
          {
            t: "math",
            tex: "E[Y_6] = n\\tfrac{K}{N}=\\tfrac92, \\qquad \\sigma(Y_6) = \\sqrt{n\\tfrac{K}{N}\\tfrac{N-K}{N}\\tfrac{N-n}{N-1}}\\approx 1.0265,",
          },
          {
            t: "text",
            md: "donde el extra $\\tfrac{N-n}{N-1}$ frente a la varianza binomial es el **factor de corrección por población finita**: reduce la dispersión porque sacar sin reposición de un pool acotado da menos variabilidad que el muestreo independiente. Atención al cambio de granularidad: en (a) se elige una **tableta** (3 de 5 son de Paracetamol, $p=3/5$), mientras que en (b) se elige una **pastilla** del pool (60 de 80 son de Paracetamol, $K/N=3/4$); por eso $E[Y_6]=9/2=4.5$ supera a $E[X_6]=3.6$ aunque ambos usen $n=6$.",
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
        md: "**Fuente:** `03 - Primer Parcial.pdf`, Ej. 3 — Primer Parcial 23/09/2022. Enunciado tipeado; el examen da las respuestas finales (a) $0.1992$, (b) $0.497$.",
      },
      {
        t: "text",
        md: "**Enunciado.** Las rutas 1 y 2 se juntan en un cruce y de allí sale la ruta 3. Las rutas 1 y 2 tienen la misma capacidad, mientras que la 3 tiene una capacidad mucho mayor que ambas. En las horas de mayor tráfico la probabilidad de congestión en la ruta 1 es $0.1$ y en la ruta 2 es $0.3$. Si la ruta 2 está congestionada, la probabilidad de que lo esté la ruta 1 es $0.33$. La ruta 3 se congestiona con probabilidad $1$ si las rutas 1 y 2 lo están, con probabilidad $0.15$ si está congestionada **exactamente una** de las dos rutas, y con probabilidad $0.1$ si **ninguna** de las rutas 1 y 2 está congestionada.",
      },
      {
        t: "list",
        items: [
          "**(a)** Calcule la probabilidad de que haya congestión en la ruta 3.",
          "**(b)** Calcule la probabilidad de que estén congestionadas las rutas 1 y 2 dado que la ruta 3 lo está.",
        ],
      },
    ],
    steps: [
      {
        label: "Planteo (a) — partición por nº de rutas congestionadas",
        blocks: [
          {
            t: "text",
            md: "Sea $C_i$ el evento \"la ruta $i$ está congestionada\". Los datos del enunciado no son los de una partición directa: dan las marginales $P(C_1)=0.1$, $P(C_2)=0.3$ y la condicional $P(C_1\\mid C_2)=0.33$. El primer paso es recuperar la **intersección** con la [[probabilidad-total-y-bayes|regla del producto]]:",
          },
          {
            t: "math",
            tex: "P(C_1\\cap C_2) = P(C_1\\mid C_2)\\,P(C_2) = 0.33\\cdot 0.3 = 0.099.",
          },
          {
            t: "text",
            md: "Con eso se arma la **partición por número de rutas aguas arriba congestionadas** (las tres celdas que cubren todo el espacio y son disjuntas): *ambas*, *exactamente una* y *ninguna*. Sus probabilidades salen por inclusión-exclusión a partir de las marginales y de $P(C_1\\cap C_2)$. Aplicando [[probabilidad-total-y-bayes|probabilidad total]] sobre esa partición, donde cada escenario aporta su probabilidad de congestión de la ruta 3 ($1$, $0.15$ o $0.1$):",
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
            t: "text",
            md: "La pregunta invierte el condicionamiento (de \"ruta 3 dado el escenario\" a \"escenario dado ruta 3\"), así que se usa [[probabilidad-total-y-bayes|Bayes]] con el $P(C_3)$ del inciso (a) como denominador. Como en el escenario \"ambas congestionadas\" la ruta 3 se satura con certeza, $P(C_3\\mid C_1\\cap C_2)=1$:",
          },
          {
            t: "math",
            tex: "P(C_1\\cap C_2 \\mid C_3) = \\frac{P(C_3\\mid C_1\\cap C_2)\\,P(C_1\\cap C_2)}{P(C_3)} = \\frac{1\\cdot 0.099}{0.1992} \\approx 0.497.",
          },
          {
            t: "note",
            tone: "warn",
            label: "Error típico",
            md: "$P(C_1\\cap C_2)\\neq P(C_1)P(C_2)$: las rutas **no son independientes** ($0.099\\neq 0.1\\cdot 0.3=0.03$). Hay que usar el dato $P(C_1\\mid C_2)=0.33$ que el enunciado da justamente para impedir asumir independencia.",
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
        md: "**Fuente:** `Resolución_Examen_15_12_TemaA.pdf`, Ej. 2 — Examen Final Tema A, 15/12/2025 (*leitmotiv: Josefina enferma*). Resolución de cátedra **manuscrita** (la matemática se transcribe fiel; aquí solo se enriquece la prosa).",
      },
      {
        t: "text",
        md: "**Enunciado.** Josefina está en el sillón sin ganas de moverse, con una caja de pañuelos a su lado. Cada vez que estornuda, **agarra al azar un pañuelo de la caja, lo utiliza y lo vuelve a poner en la caja**. Una vez utilizados, el **60%** de las veces el pañuelo puede ser **reutilizado una única vez** (sirve una vez más y después queda inutilizable), y el resto de las veces (**40%**) queda inutilizable de entrada. Si agarra un pañuelo **inutilizable**, vuelve a extraer hasta agarrar uno **nuevo o reutilizable**. Luego de sonarse los mocos, vuelve a poner todos los extraídos en la caja.",
      },
      {
        t: "list",
        items: [
          "**(a)** Suponer que en la caja hay **10 pañuelos nuevos** y que en una hora estornuda **2 veces**. Calcular el valor esperado $E[M]$ y el desvío $\\sigma(M)$ de la cantidad $M$ de pañuelos **inutilizables que quedan en la caja** luego de una hora.",
          "**(b)** Su pareja le cambia la caja cada hora, así que al comienzo de cada hora hay **10 pañuelos nuevos** (y estornuda 2 veces por hora). ¿Cuántas **horas** deberán pasar para que acumule **por lo menos 100** pañuelos inutilizables con una probabilidad **por encima del 92%**?",
        ],
      },
    ],
    steps: [
      {
        label: "Planteo (a) — armar la v.a.d. con un [[arbol-de-probabilidades|árbol]]",
        blocks: [
          {
            t: "text",
            md: "El truco es que $M$ no se observa directamente sino que es el resultado neto de **dos estornudos** que interactúan con la caja. Conviene definir eventos por extracción: $N_i$ (en el estornudo $i$ agarra un pañuelo **nuevo**), $R_i$ (agarra uno **reutilizable**) e $I_i$ (el pañuelo usado en ese estornudo **queda inutilizable**). De la regla del 60/40: un pañuelo nuevo queda inutilizable con $P(I_i\\mid N_i)=0.6$ (y reutilizable con $0.4$), mientras que un reutilizable, al usarse, **siempre** queda inutilizable, $P(I_i\\mid R_i)=1$. Como la caja arranca con 10 nuevos, **el primer pañuelo siempre es nuevo** ($P(N_1)=1$). $M\\in\\{0,1,2\\}$ es una v.a. **discreta**. Recorriendo las ramas del árbol y sumando las que terminan en cada valor de $M$:",
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
            md: "$M{=}2$ exige que **ambos** estornudos dejen un pañuelo inutilizable distinto; $M{=}0$ se obtiene por **complemento**, evitando recorrer sus ramas. Verificación rápida: las tres probabilidades suman $0.144+0.496+0.36=1$. Entonces, por definición de [[esperanza|esperanza]],",
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
            md: "Como cada hora se repone la caja, los pañuelos inutilizables de horas distintas son **independientes y con la misma distribución** que la $M$ del inciso (a). El total acumulado en $n$ horas es la suma $S_n=\\sum_{i=1}^n M_i$ con $M_i$ i.i.d. ($\\mu_M=1.216$, $\\sigma_M\\approx 0.6763$). Para $n$ grande, el [[teorema-central-del-limite|TCL]] aproxima la suma por una normal con media $n\\mu_M$ y desvío $\\sqrt n\\,\\sigma_M$: $S_n \\overset{(a)}{\\sim}\\mathcal{N}\\!\\big(n\\mu_M,\\ \\sqrt n\\,\\sigma_M\\big)$. Se busca el menor $n$ que cumpla la condición pedida (estandarizando y despejando con el cuantil $z_{0.92}$):",
          },
          {
            t: "math",
            tex: "P(S_n\\ge 100) > 0.92 \\ \\Rightarrow\\ 1-\\Phi\\!\\left(\\frac{100-n\\mu_M}{\\sqrt n\\,\\sigma_M}\\right) > 0.92\n   \\ \\Rightarrow\\ z_{0.08}=-z_{0.92}\\ge \\frac{100-n\\mu_M}{\\sqrt n\\,\\sigma_M}.",
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
        tone: "tip",
        label: "Método",
        md: "El umbral pedido es \"$\\ge 100$\" inutilizables (el enunciado fija $100$). Lo importante es el método: v.a.d. por árbol → momentos → suma i.i.d. → TCL → despeje cuadrático en $\\sqrt n$ (con $z_{0.92}\\approx 1.4051$, $\\sqrt n\\approx 9.46$ y $n\\ge 90$).",
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
        md: "**Fuente:** `Res_Parcialito_TP1y2_ComB.pdf` (Lucio José Pantazis), Ej. 2 — Parcialito TP1 y TP2, Comisión B. Resolución de cátedra **tipeada**. Enunciado **paramétrico** en $N$ y $M$ (sin fijar valores).",
      },
      {
        t: "text",
        md: "**Enunciado.** En la clínica hay $N$ personas esperando para realizarse un test para cierta enfermedad. Supongamos que entre ellas hay $M$ personas que **realmente padecen** la enfermedad. Informan que sólo quedan **3 tests**, y que se seleccionarán **al azar 3 personas** del total para testear. Calcular la probabilidad de que **por lo menos 2** personas enfermas resulten testeadas.",
      },
    ],
    steps: [
      {
        label: "Planteo — conteo equiprobable ⇒ Laplace",
        blocks: [
          {
            t: "text",
            md: "**Definición de eventos.** Sea $E_i$ = \"se seleccionan **exactamente** $i$ personas enfermas en la selección de 3\", con $i\\in\\{0,1,2,3\\}$. La palabra *exactamente* hace que los $E_i$ sean **mutuamente excluyentes**: no pueden ocurrir dos a la vez. Por eso \"por lo menos 2\" se descompone como la unión disjunta $E_2\\cup E_3$, cuya probabilidad es la **suma** de las partes.",
          },
          {
            t: "text",
            md: "**Por qué Laplace.** Como las 3 personas se eligen al azar del total, **todas las selecciones de 3 entre las $N$ tienen la misma probabilidad** de salir; en un espacio equiprobable la probabilidad es casos favorables sobre casos totales ([[regla-de-laplace|regla de Laplace]]). Por la exclusión mutua,",
          },
          {
            t: "math",
            tex: "P(\\text{al menos 2}) = P(E_2\\cup E_3) = P(E_2) + P(E_3).",
          },
          {
            t: "text",
            md: "**Conteo con [[tecnica-conteo-combinatoria|coeficientes binomiales]].** El denominador, común a todo, es elegir 3 personas entre las $N$: $\\binom{N}{3}$ casos totales. En el numerador de $P(E_2)$ se eligen $2$ enfermos de los $M$ ($\\binom{M}{2}$) **y** $1$ sano de los $N-M$ ($\\binom{N-M}{1}$), que se multiplican por ser elecciones independientes. Para $P(E_3)$ se eligen los $3$ enfermos de los $M$ ($\\binom{M}{3}$) y ningún sano. Sumando ambos términos:",
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
