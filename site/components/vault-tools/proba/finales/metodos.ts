/* ============================================================================
 * Banco de finales — MÉTODOS GENÉRICOS por tipo de ejercicio.
 *
 * Cada entrada generaliza el patrón de los ejercicios MÁS TOMADOS de su tipo:
 * cómo reconocerlo, la receta paso a paso (genérica, sin números concretos),
 * los errores típicos y los teoremas que se invocan. Es contenido de estudio
 * fiel al programa de 93.24 (ITBA); la matemática es estándar, no inventada.
 *
 * Se renderiza con los mismos bloques que los ejercicios (Blocks/SheetMath):
 * `text` admite $...$ inline; `math` es display SIN delimitadores.
 * ========================================================================== */

import type { GenericMethod } from "./types";

export const GENERIC_METHODS: GenericMethod[] = [
  // ── Descriptiva ──────────────────────────────────────────────────────────
  {
    type: "descriptiva",
    title: "Estadística descriptiva con datos agrupados",
    frequency:
      "Casi siempre abre el examen: una tabla de frecuencias por intervalos para resumir.",
    recognize: [
      {
        t: "text",
        md: "El enunciado da una **tabla de frecuencias por intervalos** (clases $[L_i, L_{i+1})$ con frecuencia $f_i$) o una lista de datos y pide **centro, dispersión, posición o forma**: media, desvío, mediana, cuartiles, percentiles, boxplot, asimetría.",
      },
    ],
    steps: [
      {
        label: "1 · Completar la tabla",
        blocks: [
          {
            t: "text",
            md: "Para cada clase calculá la **marca de clase** $x_i = \\tfrac{L_i + L_{i+1}}{2}$ (punto medio), la **frecuencia relativa** $f_i/n$ y la **frecuencia acumulada** $F_i = \\sum_{j\\le i} f_j$. Casi todo lo demás sale de estas tres columnas.",
          },
        ],
      },
      {
        label: "2 · Centro y dispersión",
        blocks: [
          {
            t: "text",
            md: "Con las marcas de clase como si fueran los valores, ponderando por $f_i$:",
          },
          {
            t: "math",
            tex: "\\bar x_{Ag} = \\frac{\\sum_i x_i\\,f_i}{n}, \\qquad s^2_{Ag} = \\frac{\\sum_i (x_i - \\bar x_{Ag})^2\\,f_i}{n-1}.",
          },
          {
            t: "text",
            md: "El denominador es $n-1$ (corrección de Bessel), **no** $n$. El desvío es $s = \\sqrt{s^2}$.",
          },
        ],
      },
      {
        label: "3 · Cuartiles y mediana por interpolación",
        blocks: [
          {
            t: "text",
            md: "El cuartil $q$ (mediana = $q_2$, posición $0{,}5n$) cae en la primera clase cuya acumulada supera la posición buscada. Dentro de esa clase se **interpola linealmente**:",
          },
          {
            t: "math",
            tex: "q = L + \\frac{p\\cdot n - F_{\\text{ant}}}{f_{\\text{clase}}}\\cdot a,",
          },
          {
            t: "text",
            md: "con $L$ el extremo inferior de la clase, $a$ su amplitud, $F_{\\text{ant}}$ la acumulada de la clase anterior y $p\\in\\{0{,}25;\\,0{,}5;\\,0{,}75\\}$. Ver [[tecnica-datos-agrupados-interpolacion|interpolación en datos agrupados]].",
          },
        ],
      },
      {
        label: "4 · Boxplot y outliers",
        blocks: [
          {
            t: "text",
            md: "Con $\\mathrm{IQR} = q_3 - q_1$, las **cercas de Tukey** son $q_1 - 1{,}5\\,\\mathrm{IQR}$ y $q_3 + 1{,}5\\,\\mathrm{IQR}$. Todo dato fuera de ese rango es **outlier**. La asimetría se lee del boxplot: si la caja/bigote derecho es más largo, cola a derecha ($\\gamma>0$).",
          },
        ],
      },
    ],
    pitfalls: [
      {
        t: "note",
        tone: "warn",
        label: "Errores típicos",
        md: "Usar $n$ en vez de $n-1$ en la varianza muestral; tomar el extremo de la clase en vez de la **marca de clase**; olvidar que la mediana de datos agrupados sale por **interpolación**, no es una marca de clase.",
      },
    ],
    cites: [
      { slug: "datos-agrupados", label: "Datos agrupados" },
      { slug: "cuartiles-y-percentiles", label: "Cuartiles y percentiles" },
      { slug: "boxplot", label: "Boxplot" },
      { slug: "medidas-de-dispersion", label: "Medidas de dispersión" },
    ],
  },

  // ── Probabilidad ─────────────────────────────────────────────────────────
  {
    type: "probabilidad",
    title: "Probabilidad total y Bayes",
    frequency:
      "El clásico de la unidad 2: canal binario, tests médicos, máquinas/lotes defectuosos.",
    recognize: [
      {
        t: "text",
        md: "Hay un **proceso en dos etapas**: primero ocurre una *causa* (lote, máquina, estado de salud) y después un *efecto observable* (defectuoso, positivo). El dato es $P(\\text{efecto}\\mid\\text{causa})$ y se pide $P(\\text{efecto})$ (total) o se invierte el condicional, $P(\\text{causa}\\mid\\text{efecto})$ (Bayes).",
      },
    ],
    steps: [
      {
        label: "1 · Identificar la partición",
        blocks: [
          {
            t: "text",
            md: "Las causas $A_1,\\dots,A_n$ deben formar una **partición**: disjuntas y exhaustivas ($\\sum_i P(A_i)=1$). Conviene un [[arbol-de-probabilidades|árbol de probabilidades]]: primer nivel = causas con $P(A_i)$; segundo nivel = $P(B\\mid A_i)$.",
          },
        ],
      },
      {
        label: "2 · Probabilidad total",
        blocks: [
          {
            t: "text",
            md: "La probabilidad del efecto $B$ es el promedio ponderado de las ramas (por el [[probabilidad-total-y-bayes|teorema de la probabilidad total]]):",
          },
          {
            t: "math",
            tex: "P(B) = \\sum_{i=1}^{n} P(B\\mid A_i)\\,P(A_i).",
          },
          {
            t: "text",
            md: "En el árbol, esto es **multiplicar a lo largo de cada rama y sumar** las ramas que terminan en $B$.",
          },
        ],
      },
      {
        label: "3 · Invertir con Bayes",
        blocks: [
          {
            t: "text",
            md: "Si piden la causa dado el efecto, [[probabilidad-total-y-bayes|Bayes]] reescala la rama $i$ por el total del paso 2:",
          },
          {
            t: "math",
            tex: "P(A_i\\mid B) = \\frac{P(B\\mid A_i)\\,P(A_i)}{P(B)} = \\frac{P(B\\mid A_i)\\,P(A_i)}{\\sum_j P(B\\mid A_j)\\,P(A_j)}.",
          },
        ],
      },
    ],
    pitfalls: [
      {
        t: "note",
        tone: "warn",
        label: "Error típico",
        md: "Confundir $P(B\\mid A)$ con $P(A\\mid B)$ (la *falacia del fiscal*): no son iguales salvo casos triviales. Y verificar que la partición sea **exhaustiva**: si las causas no cubren todo, falta una rama y el total da mal.",
      },
    ],
    cites: [
      { slug: "probabilidad-total-y-bayes", label: "Probabilidad total y Bayes" },
      { slug: "probabilidad-condicional", label: "Probabilidad condicional" },
      { slug: "arbol-de-probabilidades", label: "Árbol de probabilidades" },
      { slug: "independencia", label: "Independencia" },
    ],
  },

  // ── V.a. discreta ──────────────────────────────────────────────────────────
  {
    type: "va-discreta",
    title: "Variable aleatoria discreta: reconocer, E[X] y V(X)",
    frequency:
      "Núcleo de la unidad 3: identificar la distribución y calcular esperanza/varianza.",
    recognize: [
      {
        t: "text",
        md: "La variable toma **valores aislados** (conteos: éxitos, llamadas, defectuosos). La clave es **reconocer la distribución** a partir de la historia del experimento.",
      },
      {
        t: "list",
        items: [
          "$n$ ensayos fijos, dos resultados, $p$ constante → **binomial** $\\mathrm{Bi}(n,p)$.",
          "Ensayos hasta el primer éxito → **geométrica**; hasta el $r$-ésimo → **binomial negativa**.",
          "Conteo de eventos raros en un intervalo (tasa $\\lambda$) → **Poisson**.",
          "Muestreo **sin reposición** de una población finita → **hipergeométrica**.",
        ],
      },
    ],
    steps: [
      {
        label: "1 · Armar la PMF",
        blocks: [
          {
            t: "text",
            md: "Si es una distribución conocida, escribí su [[funcion-de-variable-aleatoria|fórmula]] y sus parámetros. Si es \"a mano\", armá un [[arbol-de-probabilidades|árbol]] y construí la tabla $p_X(k)=P(X=k)$. Chequeo obligatorio: $\\sum_k p_X(k) = 1$.",
          },
        ],
      },
      {
        label: "2 · Esperanza y varianza",
        blocks: [
          {
            t: "text",
            md: "Con distribución conocida usá las fórmulas de tabla. A mano:",
          },
          {
            t: "math",
            tex: "E[X] = \\sum_k k\\,p_X(k), \\qquad V(X) = E[X^2] - (E[X])^2,\\quad E[X^2]=\\sum_k k^2 p_X(k).",
          },
          {
            t: "text",
            md: "La forma $V(X)=E[X^2]-(E[X])^2$ ([[varianza]]) casi siempre es más corta que la definición. Para $g(X)$: $E[g(X)]=\\sum_k g(k)\\,p_X(k)$ ([[esperanza]]), sin reconstruir la distribución de $g(X)$.",
          },
        ],
      },
      {
        label: "3 · Usar linealidad",
        blocks: [
          {
            t: "text",
            md: "$E[aX+b]=aE[X]+b$ siempre; $V(aX+b)=a^2V(X)$. Si $X=\\sum X_i$ con $X_i$ indicadoras (p. ej. binomial como suma de Bernoulli), $E[X]=\\sum E[X_i]$ por linealidad, **aunque no sean independientes**.",
          },
        ],
      },
    ],
    pitfalls: [
      {
        t: "note",
        tone: "warn",
        label: "Cuidado",
        md: "La **geométrica** tiene dos convenciones: \"número de fracasos\" ($E=q/p$) y \"número de ensayos\" ($E=1/p$). Fijá cuál usa el enunciado. Y $V(aX+b)=a^2V(X)$: la constante **no** suma varianza, y el coeficiente va **al cuadrado**.",
      },
    ],
    cites: [
      { slug: "variable-aleatoria", label: "Variable aleatoria" },
      { slug: "esperanza", label: "Esperanza" },
      { slug: "varianza", label: "Varianza" },
      { slug: "distribucion-binomial", label: "Binomial" },
      { slug: "distribucion-poisson", label: "Poisson" },
    ],
  },

  // ── V.a. continua ──────────────────────────────────────────────────────────
  {
    type: "va-continua",
    title: "Variable aleatoria continua: densidad, FDA y probabilidades",
    frequency:
      "Tema central de la unidad 4: dada una densidad, calcular constante, FDA, P(a<X<b), E y V.",
    recognize: [
      {
        t: "text",
        md: "La variable toma valores en un **continuo** (tiempos, longitudes). Te dan una **densidad** $f_X(x)$ (a veces con una constante por determinar) o una **FDA** $F_X(x)$, y piden probabilidades, esperanza, desvío o una transformación.",
      },
    ],
    steps: [
      {
        label: "1 · Hallar la constante (si falta)",
        blocks: [
          {
            t: "text",
            md: "Una densidad debe integrar 1 ([[funcion-de-densidad]]). Planteá $\\int_{-\\infty}^{\\infty} f_X(x)\\,dx = 1$ y despejá la constante:",
          },
          {
            t: "math",
            tex: "\\int_{\\text{soporte}} f_X(x)\\,dx = 1.",
          },
        ],
      },
      {
        label: "2 · Probabilidades por integral o por la FDA",
        blocks: [
          {
            t: "text",
            md: "Para una continua $P(a< X< b)=\\int_a^b f_X = F_X(b)-F_X(a)$, y los $<$ vs $\\le$ dan lo mismo (un punto tiene probabilidad 0). La [[funcion-de-distribucion-acumulada|FDA]] se arma integrando la densidad: $F_X(x)=\\int_{-\\infty}^{x} f_X(t)\\,dt$, por tramos.",
          },
        ],
      },
      {
        label: "3 · Esperanza y varianza",
        blocks: [
          {
            t: "math",
            tex: "E[X]=\\int_{-\\infty}^{\\infty} x\\,f_X(x)\\,dx, \\qquad V(X)=E[X^2]-(E[X])^2,\\quad E[X^2]=\\int x^2 f_X(x)\\,dx.",
          },
          {
            t: "text",
            md: "Para $g(X)$: $E[g(X)]=\\int g(x)f_X(x)\\,dx$, sin hallar la distribución de $g(X)$.",
          },
        ],
      },
      {
        label: "4 · Transformación de variable y mezcla",
        blocks: [
          {
            t: "text",
            md: "Si $Y=g(X)$ y piden su distribución, el **método de la FDA** es universal: $F_Y(y)=P(g(X)\\le y)$, se despeja el evento en $X$, y se deriva $f_Y=F_Y'$ ([[tecnica-distribucion-de-una-funcion-de-va|técnica]]). Si la variable surge de **elegir entre escenarios** con probabilidades, es una [[mezcla-de-distribuciones|mezcla]]: la FDA es el promedio ponderado de las FDA condicionales (probabilidad total sobre $\\{X\\le t\\}$).",
          },
        ],
      },
    ],
    pitfalls: [
      {
        t: "note",
        tone: "warn",
        label: "Errores típicos",
        md: "Olvidar definir la FDA **por tramos** (0 antes del soporte, 1 después); en la transformación, no ajustar los límites/monotonía de $g$; integrar fuera del soporte. En una mezcla, $f$ puede no ser ni puramente discreta ni continua: trabajá con la **FDA**.",
      },
    ],
    cites: [
      { slug: "variable-aleatoria-continua", label: "V.a. continua" },
      { slug: "funcion-de-densidad", label: "Función de densidad" },
      { slug: "funcion-de-distribucion-acumulada", label: "FDA" },
      { slug: "funcion-de-variable-aleatoria", label: "Función de una v.a." },
      { slug: "distribucion-normal", label: "Normal" },
    ],
  },

  // ── Conjuntas ──────────────────────────────────────────────────────────────
  {
    type: "conjuntas",
    title: "Variables bidimensionales: marginales, condicionales y covarianza",
    frequency:
      "Unidad 5: densidad/tabla conjunta y todo lo que se deriva de ella.",
    recognize: [
      {
        t: "text",
        md: "Aparecen **dos variables a la vez**: una tabla $p_{XY}(x,y)$ o una densidad conjunta $f_{XY}(x,y)$. Piden marginales, condicionales, independencia, $\\mathrm{Cov}(X,Y)$, correlación o $E[XY]$.",
      },
    ],
    steps: [
      {
        label: "1 · Marginales",
        blocks: [
          {
            t: "text",
            md: "Se obtienen \"sumando/integrando la otra variable\" ([[variables-aleatorias-bidimensionales]]):",
          },
          {
            t: "math",
            tex: "p_X(x)=\\sum_y p_{XY}(x,y), \\qquad f_X(x)=\\int_{-\\infty}^{\\infty} f_{XY}(x,y)\\,dy.",
          },
        ],
      },
      {
        label: "2 · Condicionales e independencia",
        blocks: [
          {
            t: "text",
            md: "La condicional es $f_{Y\\mid X}(y\\mid x)=\\dfrac{f_{XY}(x,y)}{f_X(x)}$. Son [[independencia-de-variables-aleatorias|independientes]] si y solo si $f_{XY}(x,y)=f_X(x)\\,f_Y(y)$ para todo $(x,y)$ — **factoriza** (incluido el soporte, que debe ser un rectángulo).",
          },
        ],
      },
      {
        label: "3 · Covarianza y correlación",
        blocks: [
          {
            t: "math",
            tex: "\\mathrm{Cov}(X,Y)=E[XY]-E[X]E[Y], \\qquad \\rho_{XY}=\\frac{\\mathrm{Cov}(X,Y)}{\\sigma_X\\,\\sigma_Y}\\in[-1,1],",
          },
          {
            t: "text",
            md: "con $E[XY]=\\sum_{x,y}xy\\,p_{XY}$ (o la integral doble). Ver [[covarianza-y-correlacion]]. Para la varianza de una suma: $V(X+Y)=V(X)+V(Y)+2\\,\\mathrm{Cov}(X,Y)$.",
          },
        ],
      },
    ],
    pitfalls: [
      {
        t: "note",
        tone: "warn",
        label: "Cuidado",
        md: "Independencia $\\Rightarrow \\mathrm{Cov}=0$, pero **el recíproco es falso**: $\\rho=0$ solo descarta relación *lineal*. Y si el soporte conjunto no es un rectángulo (p. ej. $0<x<y<1$), las variables **no** son independientes aunque la fórmula parezca factorizar.",
      },
    ],
    cites: [
      { slug: "variables-aleatorias-bidimensionales", label: "V.a. bidimensionales" },
      { slug: "covarianza-y-correlacion", label: "Covarianza y correlación" },
      { slug: "esperanza-condicional", label: "Esperanza condicional" },
      { slug: "independencia-de-variables-aleatorias", label: "Independencia de v.a." },
    ],
  },

  // ── Procesos ───────────────────────────────────────────────────────────────
  {
    type: "procesos",
    title: "Procesos de Poisson y cadenas de Markov",
    frequency:
      "Unidad 6: o un proceso de Poisson (eventos en el tiempo) o una cadena de Markov.",
    recognize: [
      {
        t: "text",
        md: "**Poisson**: eventos que ocurren \"al azar en el tiempo\" con **tasa $\\lambda$** constante (llamadas, fallas, clientes). **Markov**: un sistema salta entre **estados** y la próxima transición depende solo del estado actual (matriz de transición $P$).",
      },
    ],
    steps: [
      {
        label: "1 · Proceso de Poisson: las tres caras",
        blocks: [
          {
            t: "text",
            md: "Mismo proceso, tres preguntas ([[proceso-de-poisson]]):",
          },
          {
            t: "list",
            items: [
              "Cantidad de eventos en $[0,t]$: $N(t)\\sim\\mathrm{Poisson}(\\lambda t)$.",
              "Tiempo hasta el **primer** evento (o entre eventos): $T\\sim\\mathcal{E}(\\lambda)$ ([[distribucion-exponencial|exponencial]]), sin memoria.",
              "Tiempo hasta el **$k$-ésimo** evento: $\\mathrm{Erlang}(k,\\lambda)$ ([[distribucion-erlang]]).",
            ],
          },
        ],
      },
      {
        label: "2 · Markov: matriz y régimen permanente",
        blocks: [
          {
            t: "text",
            md: "La fila $i$ de $P$ son las probabilidades de salir de $i$ (suma 1). La distribución a $n$ pasos es $\\pi^{(n)}=\\pi^{(0)}P^{n}$. Si la cadena es **regular**, converge a la **distribución estacionaria** $\\pi$, única solución de:",
          },
          {
            t: "math",
            tex: "\\pi P = \\pi, \\qquad \\sum_i \\pi_i = 1.",
          },
        ],
      },
      {
        label: "3 · Markov absorbente",
        blocks: [
          {
            t: "text",
            md: "Si hay estados **absorbentes** (de los que no se sale), no hay estacionaria: se pregunta por **probabilidad de absorción** o **tiempo esperado hasta absorber**, que salen del sistema fundamental sobre los estados transitorios ([[cadenas-de-markov]]).",
          },
        ],
      },
    ],
    pitfalls: [
      {
        t: "note",
        tone: "warn",
        label: "Errores típicos",
        md: "Mezclar la **tasa** $\\lambda$ (eventos por unidad de tiempo) con la **media** del tiempo entre eventos $1/\\lambda$. Y en Poisson, usar siempre $\\lambda t$ con el intervalo correcto. En Markov, confundir la condición $\\pi P=\\pi$ (vector fila por matriz) con $P\\pi=\\pi$.",
      },
    ],
    cites: [
      { slug: "proceso-de-poisson", label: "Proceso de Poisson" },
      { slug: "cadenas-de-markov", label: "Cadenas de Markov" },
      { slug: "distribucion-exponencial", label: "Exponencial" },
      { slug: "distribucion-erlang", label: "Erlang" },
    ],
  },

  // ── Suma y TCL ─────────────────────────────────────────────────────────────
  {
    type: "tcl",
    title: "Teorema Central del Límite y aproximación normal",
    frequency:
      "El que más se repite en finales: suma/promedio de muchas v.a. → normal.",
    recognize: [
      {
        t: "text",
        md: "Hay una **suma o promedio de muchas** variables i.i.d. ($S_n=\\sum X_i$ o $\\bar X_n$), o un conteo binomial con $n$ grande, y se pide una probabilidad. La pista: \"$n=100$ clientes\", \"el total de\", \"el promedio de\".",
      },
    ],
    steps: [
      {
        label: "1 · Aplicar el TCL",
        blocks: [
          {
            t: "text",
            md: "Si $X_1,\\dots,X_n$ son i.i.d. con media $\\mu$ y varianza $\\sigma^2$, por el [[teorema-central-del-limite|TCL]] la suma es aproximadamente normal para $n$ grande:",
          },
          {
            t: "math",
            tex: "S_n=\\sum_{i=1}^n X_i \\;\\approx\\; \\mathcal{N}\\!\\left(n\\mu,\\; n\\sigma^2\\right), \\qquad \\bar X_n \\;\\approx\\; \\mathcal{N}\\!\\left(\\mu,\\; \\tfrac{\\sigma^2}{n}\\right).",
          },
          {
            t: "text",
            md: "El promedio tiene la **misma media** pero varianza $\\sigma^2/n$ (se concentra al crecer $n$ — esto es la [[ley-de-grandes-numeros|ley de grandes números]]).",
          },
        ],
      },
      {
        label: "2 · Estandarizar y usar la tabla",
        blocks: [
          {
            t: "text",
            md: "Llevá a la normal estándar restando la media y dividiendo por el desvío, y leé $\\Phi$ en la [[estandarizacion-y-tabla-normal|tabla]]:",
          },
          {
            t: "math",
            tex: "P(S_n \\le a) \\approx \\Phi\\!\\left(\\frac{a - n\\mu}{\\sqrt{n}\\,\\sigma}\\right).",
          },
        ],
      },
      {
        label: "3 · Aproximación normal de la binomial",
        blocks: [
          {
            t: "text",
            md: "Si $X\\sim\\mathrm{Bi}(n,p)$ con $n$ grande, $X\\approx\\mathcal{N}(np,\\,np(1-p))$ ([[aproximacion-normal-de-la-binomial]]). Como se aproxima una **discreta** con una **continua**, usá la **corrección por continuidad**: $P(X\\le k)\\approx\\Phi\\!\\big(\\tfrac{k+0{,}5-np}{\\sqrt{np(1-p)}}\\big)$.",
          },
        ],
      },
      {
        label: "4 · Despejar el tamaño n",
        blocks: [
          {
            t: "text",
            md: "Una variante frecuente pide el **$n$ mínimo** para que cierta probabilidad supere un umbral. Se estandariza, se iguala al cuantil $z$ correspondiente y se despeja $n$ de la desigualdad.",
          },
        ],
      },
    ],
    pitfalls: [
      {
        t: "note",
        tone: "warn",
        label: "Errores típicos",
        md: "Olvidar la **corrección por continuidad** al aproximar una discreta. Usar $\\sigma^2$ en vez de $\\sigma$ al estandarizar. Confundir la varianza de la **suma** ($n\\sigma^2$) con la del **promedio** ($\\sigma^2/n$).",
      },
    ],
    cites: [
      { slug: "teorema-central-del-limite", label: "Teorema Central del Límite" },
      { slug: "suma-de-variables-aleatorias", label: "Suma de v.a." },
      { slug: "aproximacion-normal-de-la-binomial", label: "Aprox. normal de la binomial" },
      { slug: "estandarizacion-y-tabla-normal", label: "Tabla normal" },
      { slug: "ley-de-grandes-numeros", label: "Ley de grandes números" },
    ],
  },

  // ── Estimación ─────────────────────────────────────────────────────────────
  {
    type: "estimacion",
    title: "Estimación puntual: máxima verosimilitud y momentos",
    frequency:
      "Unidad 8: estimar un parámetro a partir de una muestra, por EMV o por momentos.",
    recognize: [
      {
        t: "text",
        md: "Hay una **muestra** $X_1,\\dots,X_n$ i.i.d. de una distribución con **parámetro desconocido** $\\theta$ y piden un **estimador** $\\hat\\theta$. Si dice \"máxima verosimilitud\" → EMV; si dice \"método de los momentos\" → momentos.",
      },
    ],
    steps: [
      {
        label: "1 · EMV — armar la verosimilitud",
        blocks: [
          {
            t: "text",
            md: "La verosimilitud es la densidad conjunta vista como función de $\\theta$ (por independencia, **producto**):",
          },
          {
            t: "math",
            tex: "L(\\theta) = \\prod_{i=1}^{n} f(x_i;\\theta).",
          },
        ],
      },
      {
        label: "2 · EMV — log, derivar e igualar a cero",
        blocks: [
          {
            t: "text",
            md: "Se maximiza el **logaritmo** $\\ell(\\theta)=\\ln L(\\theta)$ (convierte el producto en suma y tiene el mismo máximo). Se deriva, se iguala a 0 y se despeja:",
          },
          {
            t: "math",
            tex: "\\frac{d\\,\\ell(\\theta)}{d\\theta}=0 \\;\\Longrightarrow\\; \\hat\\theta_{\\text{EMV}}.",
          },
          {
            t: "text",
            md: "Ver [[estimacion-puntual]]. Conviene verificar que sea máximo (segunda derivada $<0$).",
          },
        ],
      },
      {
        label: "3 · Método de los momentos",
        blocks: [
          {
            t: "text",
            md: "Se **igualan los momentos teóricos a los muestrales** y se despeja $\\theta$. Con un parámetro alcanza el primero:",
          },
          {
            t: "math",
            tex: "E[X] = \\bar X_n \\;\\Longrightarrow\\; \\hat\\theta_{\\text{MM}}.",
          },
        ],
      },
    ],
    pitfalls: [
      {
        t: "note",
        tone: "warn",
        label: "Cuidado",
        md: "En EMV, cuando el soporte depende de $\\theta$ (p. ej. uniforme $\\mathcal U(0,\\theta)$), la derivada no sirve: el máximo está en el **borde** ($\\hat\\theta=\\max x_i$). Y derivar la **log**-verosimilitud, no $L$ directamente.",
      },
    ],
    cites: [
      { slug: "estimacion-puntual", label: "Estimación puntual" },
      { slug: "teorica-maxima-verosimilitud", label: "Máxima verosimilitud" },
      { slug: "teorica-metodo-de-los-momentos", label: "Método de los momentos" },
    ],
  },

  // ── Intervalos ─────────────────────────────────────────────────────────────
  {
    type: "intervalos",
    title: "Intervalos de confianza",
    frequency:
      "Unidad 8: IC para la media (σ conocido/desconocido) o para una proporción.",
    recognize: [
      {
        t: "text",
        md: "Piden un **rango** que contenga al parámetro con confianza $\\gamma=1-\\alpha$ (\"intervalo de confianza del 95 %\"). Todos tienen la misma forma: $\\text{estimador} \\pm (\\text{cuantil})\\cdot(\\text{error estándar})$.",
      },
    ],
    steps: [
      {
        label: "1 · Elegir el pivote",
        blocks: [
          {
            t: "list",
            items: [
              "Media, $\\sigma$ **conocido** (o $n$ grande): pivote normal $Z$, cuantil $z_{\\alpha/2}$.",
              "Media, $\\sigma$ **desconocido** y $n$ chico: pivote $t$ de Student con $n-1$ g.l. ([[distribucion-t-de-student]]).",
              "Proporción: $\\hat p \\pm z_{\\alpha/2}\\sqrt{\\hat p(1-\\hat p)/n}$.",
            ],
          },
        ],
      },
      {
        label: "2 · Armar el intervalo",
        blocks: [
          {
            t: "text",
            md: "Para la media con $\\sigma$ conocido ([[intervalos-de-confianza]]):",
          },
          {
            t: "math",
            tex: "\\bar X \\pm z_{\\alpha/2}\\,\\frac{\\sigma}{\\sqrt{n}}.",
          },
          {
            t: "text",
            md: "Con $\\sigma$ desconocido se reemplaza $\\sigma$ por $S$ y $z$ por $t_{\\alpha/2,\\,n-1}$. La **semiamplitud** (margen de error) es el término que se suma y resta.",
          },
        ],
      },
      {
        label: "3 · Interpretar / despejar n",
        blocks: [
          {
            t: "text",
            md: "El $\\gamma$ es la confianza en el **método** (el $\\gamma$ % de los intervalos construidos así contienen al parámetro), no la probabilidad de que $\\mu$ caiga en *este* intervalo. Si fijan un margen de error $E$, se despeja el $n$ mínimo de $z_{\\alpha/2}\\,\\sigma/\\sqrt n \\le E$.",
          },
        ],
      },
    ],
    pitfalls: [
      {
        t: "note",
        tone: "warn",
        label: "Errores típicos",
        md: "Usar $z$ cuando corresponde $t$ (σ desconocido, $n$ chico). Tomar $\\alpha$ en vez de $\\alpha/2$ (el intervalo es **bilateral**). Decir \"hay 95 % de probabilidad de que $\\mu$ esté acá\": $\\mu$ es fijo, la aleatoriedad está en el intervalo.",
      },
    ],
    cites: [
      { slug: "intervalos-de-confianza", label: "Intervalos de confianza" },
      { slug: "distribucion-t-de-student", label: "t de Student" },
      { slug: "distribucion-normal", label: "Normal" },
      { slug: "estimacion-puntual", label: "Estimación puntual" },
    ],
  },

  // ── Hipótesis ──────────────────────────────────────────────────────────────
  {
    type: "hipotesis",
    title: "Prueba de hipótesis",
    frequency:
      "Cierre del programa (unidad 9): decidir entre H0 y H1 a partir de datos.",
    recognize: [
      {
        t: "text",
        md: "El enunciado afirma algo sobre un parámetro (\"la media es al menos…\", \"la proporción cambió…\") y pide **decidir** con un nivel $\\alpha$, o calcular el **valor p**, el **error tipo II** o la **potencia**.",
      },
    ],
    steps: [
      {
        label: "1 · Plantear H0 y H1",
        blocks: [
          {
            t: "text",
            md: "La **nula** $H_0$ lleva la igualdad (el statu quo); la **alternativa** $H_1$ es lo que se quiere probar y define la cola (unilateral $<$ / $>$ o bilateral $\\neq$). Ver [[prueba-de-hipotesis]].",
          },
        ],
      },
      {
        label: "2 · Estadístico de prueba",
        blocks: [
          {
            t: "text",
            md: "Bajo $H_0$ se estandariza el estimador con el valor de $H_0$ ([[estadistico-de-prueba]]). Para la media con $\\sigma$ conocido:",
          },
          {
            t: "math",
            tex: "Z_{\\text{obs}} = \\frac{\\bar X - \\mu_0}{\\sigma/\\sqrt{n}}\\;\\sim\\;\\mathcal N(0,1)\\ \\text{bajo } H_0.",
          },
          {
            t: "text",
            md: "(Si $\\sigma$ es desconocido, $t$ con $n-1$ g.l.; para proporción, el $Z$ análogo.)",
          },
        ],
      },
      {
        label: "3 · Decidir: región crítica o valor p",
        blocks: [
          {
            t: "text",
            md: "**Región crítica**: se rechaza $H_0$ si $Z_{\\text{obs}}$ cae más allá del valor crítico $z_\\alpha$ (una cola) o $z_{\\alpha/2}$ (dos colas). **Valor p**: probabilidad, bajo $H_0$, de un resultado tan o más extremo que el observado; se rechaza si $p<\\alpha$ ([[valor-p]]).",
          },
        ],
      },
      {
        label: "4 · Error tipo II y potencia",
        blocks: [
          {
            t: "text",
            md: "$\\alpha=P(\\text{rechazar }H_0\\mid H_0\\text{ verdadera})$ (error tipo I). $\\beta=P(\\text{no rechazar}\\mid H_1\\text{ verdadera})$ (error tipo II); la **potencia** es $1-\\beta$ ([[error-tipo-i-y-tipo-ii]]). Para hallar $\\beta$ se calcula la probabilidad de la zona de no rechazo **bajo el valor alternativo**.",
          },
        ],
      },
    ],
    pitfalls: [
      {
        t: "note",
        tone: "warn",
        label: "Errores típicos",
        md: "Poner la desigualdad en $H_0$ (siempre lleva la igualdad). No rechazar $H_0$ **no** la \"prueba verdadera\", solo dice que no hay evidencia suficiente. Usar una cola cuando el test es bilateral (o viceversa). Calcular $\\beta$ bajo $H_0$ en lugar de bajo $H_1$.",
      },
    ],
    cites: [
      { slug: "prueba-de-hipotesis", label: "Prueba de hipótesis" },
      { slug: "estadistico-de-prueba", label: "Estadístico de prueba" },
      { slug: "valor-p", label: "Valor p" },
      { slug: "error-tipo-i-y-tipo-ii", label: "Error tipo I y II" },
      { slug: "prueba-de-hipotesis-para-la-media", label: "PH para la media" },
    ],
  },
];

/** Lookup por tipo. */
export const METHOD_BY_TYPE: Partial<Record<string, GenericMethod>> =
  Object.fromEntries(GENERIC_METHODS.map((m) => [m.type, m]));
