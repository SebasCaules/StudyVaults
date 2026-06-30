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
        md: "**Josefina está enferma.** Los tiempos entre las veces que tose son exponenciales **independientes** de parámetro $\\lambda$ desconocido. Para estimar el parámetro, decide monitorear los tiempos (en minutos) entre las próximas **10 toses**.",
      },
      {
        t: "text",
        md: "**(a)** (1 punto) Calcular el **estimador de máxima verosimilitud** de $\\lambda$. Luego del monitoreo, se obtienen los siguientes datos (en minutos):",
      },
      {
        t: "math",
        tex: "1.11,\\;\\; 0.29,\\;\\; 5.9,\\;\\; 6.59,\\;\\; 9.38,\\;\\; 21.22,\\;\\; 14.73,\\;\\; 6.56,\\;\\; 18.79,\\;\\; 24.33",
      },
      {
        t: "text",
        md: "¿Qué resultado da el estimador de máxima verosimilitud?",
      },
      {
        t: "text",
        md: "**(b)** (1 punto) Para los datos obtenidos, calcular la **simetría** (asimetría muestral) y graficar el **histograma** con intervalos de 5 minutos, empezando desde 0. ¿Tienen **coherencia** ambos resultados?",
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
            md: "Modelamos $X_1,\\dots,X_{10}$ como los tiempos entre toses: por enunciado son **exponenciales i.i.d.** de parámetro $\\lambda$, con densidad $f(x;\\lambda)=\\lambda e^{-\\lambda x}$ para $x\\ge 0$. El método de máxima verosimilitud busca el $\\lambda$ que **maximiza la plausibilidad de la muestra observada**.",
          },
          {
            t: "text",
            md: "1. **Verosimilitud** (las $X_i$ son i.i.d. continuas, así que la densidad conjunta es el producto de las densidades marginales):",
          },
          {
            t: "math",
            tex: "L(x_1,\\dots,x_{10};\\lambda) = \\prod_{i=1}^{10} \\lambda e^{-\\lambda x_i}.",
          },
          {
            t: "text",
            md: "2. **Log-verosimilitud**: tomamos $\\ln$ porque convierte el producto en una suma —mucho más cómoda de derivar— y, al ser una función estrictamente creciente, no mueve el punto donde se alcanza el máximo (el $\\arg\\max$):",
          },
          {
            t: "math",
            tex: "\\ln L = 10\\ln\\lambda - \\lambda\\sum_{i=1}^{10} x_i.",
          },
          {
            t: "text",
            md: "3. **Punto crítico**: igualamos a cero la derivada respecto de $\\lambda$, $\\frac{\\partial}{\\partial\\lambda}\\ln L = \\frac{10}{\\lambda} - \\sum x_i = 0$, y despejamos. (La segunda derivada $-10/\\lambda^2<0$ confirma que es un máximo.)",
          },
          {
            t: "math",
            tex: "\\boxed{\\hat\\lambda_{MV} = \\frac{10}{\\sum_{i=1}^{10} x_i} = \\frac{1}{\\bar X}.}",
          },
          {
            t: "text",
            md: "El EMV resulta ser la **inversa del promedio muestral**, coherente con que en una exponencial $E[X]=1/\\lambda$. Evaluando con la muestra, $\\sum x_i = 108.9$ min, de modo que $\\hat\\lambda_{MV} = 10/108.9 \\approx 0.0918$ toses por minuto.",
          },
          {
            t: "note",
            label: "Distinción pre-muestra / post-muestra",
            md: "el estimador como v.a. es $\\hat\\lambda = 1/\\bar X$ (pre-muestra); el **número** $0.0918$ es la estimación post-muestra.",
          },
        ],
      },
      {
        label: "(b) Asimetría e histograma — coherencia",
        blocks: [
          {
            t: "text",
            md: "Para juzgar la coherencia calculamos la **asimetría muestral** y la contrastamos con la forma del histograma. Primero los estadísticos de centro y dispersión: el promedio muestral $\\bar x = \\tfrac{108.9}{10} = 10.89$ min y el desvío muestral",
          },
          {
            t: "math",
            tex: "s = \\sqrt{\\tfrac{1}{n-1}\\sum_{i=1}^{10}(x_i-\\bar x)^2} = \\sqrt{636.9256/9} \\approx 8.4125.",
          },
          {
            t: "text",
            md: "Con eso, el **coeficiente de asimetría** (tercer momento centrado, estandarizado por $s^3$) es",
          },
          {
            t: "math",
            tex: "\\gamma = \\frac{\\tfrac1n\\sum_{i=1}^{10}(x_i-\\bar x)^3}{s^3} = 0.2796 > 0",
          },
          {
            t: "text",
            md: "es decir **asimetría positiva (cola a la derecha)**. El histograma con intervalos de 5 minutos desde 0 muestra la mayor frecuencia en los primeros tramos y una cola que se extiende hacia los valores altos: ambos resultados son **coherentes entre sí** y, además, con la teoría, porque la distribución **exponencial** es intrínsecamente asimétrica positiva.",
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
        md: "Un profesor quiere estimar cuál es el **tiempo medio** $\\mu$ que demoran sus estudiantes en resolver cierto ejercicio, a través de un **intervalo de confianza del 88%**.",
      },
      {
        t: "text",
        md: "Como dicta una materia masiva, no puede citar a todos, pero decide tomar una muestra de $n$ alumnos y cronometrar el tiempo que demoran en resolver el ejercicio. Luego de cronometrar los resultados, observa una **media muestral de $\\bar x$ minutos** y un **desvío muestral de $s$ minutos**.",
      },
      {
        t: "text",
        md: "Calcular el **límite superior** del intervalo de confianza.",
      },
    ],
    steps: [
      {
        label: "Modelo y parámetro a estimar",
        blocks: [
          {
            t: "text",
            md: "Definimos $X_i = $ tiempo demorado por el $i$-ésimo alumno de la muestra. Asumimos que las variables son **i.i.d.** con media $\\mu = E(X_i)$ y desvío $\\sigma = \\sigma(X_i)$, **ambos desconocidos**. El parámetro de interés es $\\mu$ = tiempo medio de la población de alumnos, que estimamos con la **media muestral** $\\bar X_n = \\tfrac{1}{n}\\sum_{i=1}^{n} X_i$.",
          },
        ],
      },
      {
        label: "Aproximación normal por TCL y estandarización",
        blocks: [
          {
            t: "text",
            md: "Por el **Teorema Central del Límite**, la distribución del promedio se aproxima por una normal con la misma media y desvío $\\sigma/\\sqrt n$:",
          },
          {
            t: "math",
            tex: "\\bar X_n \\overset{(a)}{\\sim} \\mathcal{N}\\!\\left(\\mu, \\tfrac{\\sigma}{\\sqrt n}\\right) \\Rightarrow \\frac{\\bar X_n - \\mu}{\\sigma/\\sqrt n} \\overset{(a)}{\\sim} \\mathcal{N}(0,1).",
          },
          {
            t: "text",
            md: "Esta distribución estandarizada **no depende de ningún parámetro desconocido** (más allá del propio $\\mu$ que queremos encerrar), por lo que es la que usamos para los cálculos probabilísticos.",
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
        ],
      },
      {
        label: "Construcción del intervalo — despeje de los límites $a$ y $b$",
        blocks: [
          {
            t: "text",
            md: "Buscamos límites $a$ y $b$ dependientes de la muestra que encierren a $\\mu$ con probabilidad alta. Partimos de $P(a \\le \\mu \\le b)=0.88$ y reescribimos el evento en términos de la variable estandarizada (al multiplicar por $-1$ se invierten las desigualdades):",
          },
          {
            t: "math",
            tex: "P\\!\\left(\\frac{\\bar X_n - a}{s/\\sqrt n} \\ge \\frac{\\bar X_n - \\mu}{s/\\sqrt n} \\ge \\frac{\\bar X_n - b}{s/\\sqrt n}\\right) = 0.88.",
          },
          {
            t: "text",
            md: "Como la variable central es **normal estándar** y queremos el **88% central**, dejamos $6\\%$ en cada cola: el cuantil que corresponde es $z_{0.94}$. Igualando cada extremo a su cuantil:",
          },
          {
            t: "math",
            tex: "\\frac{\\bar X_n - a}{s/\\sqrt n} = z_{0.94} \\;\\Rightarrow\\; a = \\bar X_n - z_{0.94}\\,\\frac{s}{\\sqrt n},",
          },
          {
            t: "math",
            tex: "\\frac{\\bar X_n - b}{s/\\sqrt n} = -z_{0.94} \\;\\Rightarrow\\; b = \\bar X_n + z_{0.94}\\,\\frac{s}{\\sqrt n}.",
          },
          {
            t: "text",
            md: "El intervalo completo es $\\bar X_n \\pm z_{0.94}\\,\\frac{s}{\\sqrt n}$. Como nos piden el **límite superior**, tomamos el extremo $b$:",
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
        md: "Se le encarga estimar la **capacidad de absorción media** del pañal \"Cola Feliz\". Para ello debe medir la absorción en una muestra de $n$ pañales tomados al azar de la producción. Suponga que la absorción de un pañal tomado al azar es una variable aleatoria con distribución **normal de media y desvío desconocidos**.",
      },
      {
        t: "text",
        md: "**(a)** (1 punto) Su jefe le pide que el **error sea $\\le 10$ ml** con un **nivel de confianza del 90%**. De acuerdo a expertos del área, el desvío muestral **no puede ser superior a 25 ml** ($s \\le 25$). ¿Cuál es el **menor valor de $n$** que puede usar? _Ayuda: haga una primera estimación asumiendo que el desvío poblacional es conocido y luego refínela por prueba y error._",
      },
      {
        t: "text",
        md: "**(b)** (1 punto) Finalmente usa $n=20$, obteniendo un valor **promedio de $\\bar x = 500$ ml** y un **desvío muestral de $s=15$ ml**. Determine el **intervalo de confianza al 90%**.",
      },
    ],
    steps: [
      {
        label: "Planteo (a) — $n$ aparece a ambos lados",
        blocks: [
          {
            t: "text",
            md: "Como $\\sigma$ es desconocido y las $X_i$ son **normales**, el semiancho del intervalo (el error $\\Delta$) se construye con la **t-Student** con $n-1$ grados de libertad. Pedimos que ese error no supere los 10 ml:",
          },
          {
            t: "math",
            tex: "\\Delta = t_{0.95,\\,n-1}\\,\\frac{s}{\\sqrt n} \\le 10 \\Rightarrow n \\ge \\left(\\frac{t_{0.95,\\,n-1}\\,s}{10}\\right)^2 = \\left(t_{0.95,\\,n-1}\\cdot 2.5\\right)^2,",
          },
          {
            t: "text",
            md: "usando la cota $s \\le 25$ (el peor caso), de modo que $s/10 = 2.5$. El problema es que $t_{0.95,n-1}$ **depende de $n$**, así que $n$ aparece **a ambos lados** de la desigualdad y no se puede despejar de forma cerrada. Estrategia:",
          },
          {
            t: "text",
            md: "1. **Estimación inicial** reemplazando $t$ por $z$ (como si $\\sigma$ fuera conocido): $n \\ge (z_{0.95}\\cdot 2.5)^2 = 16.9096 \\Rightarrow$ probar con $n=17$.",
          },
          {
            t: "text",
            md: "2. **Refinar por prueba y error** evaluando $\\Delta$ con la $t$ real en cada $n$:",
          },
          {
            t: "math",
            tex: "n=17:\\;\\; \\Delta = t_{0.95,16}\\,\\frac{25}{\\sqrt{17}} = 1.7459\\cdot\\frac{25}{\\sqrt{17}} = 10.5860 > 10 \\;\\;(\\text{insuficiente}),",
          },
          {
            t: "math",
            tex: "n=18:\\;\\; \\Delta = t_{0.95,17}\\,\\frac{25}{\\sqrt{18}} = 1.7396\\cdot\\frac{25}{\\sqrt{18}} = 10.2507 > 10 \\;\\;(\\text{aún no}),",
          },
          {
            t: "math",
            tex: "n=19:\\;\\; \\Delta = t_{0.95,18}\\,\\frac{25}{\\sqrt{19}} = 1.7341\\cdot\\frac{25}{\\sqrt{19}} = 9.9455 < 10 \\;\\;\\checkmark.",
          },
          {
            t: "text",
            md: "3. El primer $n$ que cumple es **$n=19$**: ese es el mínimo tamaño de muestra requerido.",
          },
        ],
      },
      {
        label: "Planteo (b) — IC al 90% con $n=20$",
        blocks: [
          {
            t: "text",
            md: "Con la muestra final ($n=20$, $\\bar x = 500$, $s=15$), el semiancho con $t_{0.95,19}=1.7291$ es",
          },
          {
            t: "math",
            tex: "\\Delta = t_{0.95,19}\\,\\frac{s}{\\sqrt{20}} = 1.7291\\cdot\\frac{15}{\\sqrt{20}} = 5.7997,",
          },
          {
            t: "text",
            md: "y el intervalo de confianza al 90% para la absorción media es $\\bar x \\pm \\Delta = 500 \\pm 5.7997$, es decir",
          },
          {
            t: "math",
            tex: "(494.2003,\\; 505.7997)\\ \\text{ml}.",
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
        md: "Un profesor tiene una forma de corregir exámenes, donde tarda **en promedio $\\mu_0$ minutos** en corregir cada uno. Un compañero le muestra su metodología y espera que con esta estrategia el **tiempo medio de corrección disminuya**.",
      },
      {
        t: "text",
        md: "Como prueba, corrige **$n=10$ exámenes** y cronometra el tiempo que demora. Si tarda significativamente menos que con su metodología anterior, decidirá adoptar definitivamente la nueva estrategia. Considerar un **nivel de significación del 10%** y que el tiempo de corrección se distribuye **normalmente** (con $\\sigma$ desconocido).",
      },
      {
        t: "text",
        md: "Calcular el **valor crítico del test**.",
      },
    ],
    steps: [
      {
        label: "Modelo y estadístico de test",
        blocks: [
          {
            t: "text",
            md: "Sea $X_i = $ tiempo de la $i$-ésima corrección. Por enunciado $X_i \\sim \\mathcal{N}(\\mu,\\sigma)$ con $\\mu$ y $\\sigma$ **desconocidos**. Como las variables son normales y $\\sigma$ es desconocido (y además $n=10$ es chico), el estadístico pivote es una **t de Student** con $n-1$ grados de libertad:",
          },
          {
            t: "math",
            tex: "T = \\frac{\\bar X_n - \\mu}{s/\\sqrt n} \\sim t_{n-1}.",
          },
        ],
      },
      {
        label: "Hipótesis y dirección del rechazo",
        blocks: [
          {
            t: "text",
            md: "La sospecha a probar (\"la nueva metodología **disminuye** el tiempo medio\") es la afirmación con la carga de la prueba, así que va en $H_1$:",
          },
          {
            t: "math",
            tex: "H_0: \\mu \\ge \\mu_0, \\qquad H_1: \\mu < \\mu_0.",
          },
          {
            t: "text",
            md: "Se rechazará $H_0$ cuando $\\bar X_n$ sea **significativamente chico**; al pasar al estadístico, eso equivale a que $T = \\frac{\\bar X_n - \\mu_0}{s/\\sqrt n}$ también sea chico. Es un test de **cola izquierda**: se rechaza $H_0$ si $T < t_c$.",
          },
        ],
      },
      {
        label: "Control del error tipo I y valor crítico",
        blocks: [
          {
            t: "text",
            md: "Fijamos el valor crítico $t_c$ controlando el **error tipo I** a nivel $\\alpha=0.10$. El peor caso de $H_0$ es la frontera $\\mu=\\mu_0$, donde $T$ es exactamente $t_{n-1}$:",
          },
          {
            t: "math",
            tex: "P(\\text{Rechazar }H_0 \\mid H_0) = P(T < t_c \\mid \\mu \\ge \\mu_0) \\le P(T < t_c \\mid \\mu=\\mu_0) = 0.1,",
          },
          {
            t: "text",
            md: "de donde $t_c$ es el cuantil $0.1$ de la $t_{n-1}$. Por la **simetría** de la t de Student respecto de 0, ese cuantil de cola izquierda es el opuesto del cuantil $0.9$:",
          },
          {
            t: "math",
            tex: "t_c = t_{n-1;0.1} = -t_{n-1;0.9}.",
          },
          {
            t: "note",
            tone: "warn",
            label: "Error conceptual frecuente",
            md: "(que la resolución marca): NO es válido tomar $x_c = \\mu_0 - t_{n-1;0.9}\\,\\frac{s}{\\sqrt n}$ como valor crítico, porque $s$ se conoce **después** de tomar la muestra, mientras que la región de rechazo debe quedar determinada **antes** de muestrear. El valor crítico debe ser conocido a priori: $t_c = -t_{n-1;0.9}$, y la regla de decisión es rechazar $H_0$ si $\\frac{\\bar X_n - \\mu_0}{s/\\sqrt n} < -t_{n-1;0.9}$.",
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
