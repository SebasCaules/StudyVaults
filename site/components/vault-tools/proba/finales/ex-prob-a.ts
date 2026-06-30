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
        md: "**Fuente:** `2025Q2_Parcial_Resolución.pdf`, Ejercicio 1 (Tomás estudia). Examen **parametrizado** por $K$ (dígito del legajo, $K\\in\\{0,\\dots,9\\}$).",
      },
      {
        t: "text",
        md: "**Enunciado (completo).** Tomás tiene que estudiar para un examen. Cada día estudia una cantidad aleatoria de horas $X$ que se ve influida por sus hábitos:",
      },
      {
        t: "list",
        items: [
          "Si **duerme mal** ($D$), estudia $X_D \\sim \\mathcal{U}\\!\\left(\\tfrac{2K+5}{K+2},\\ \\tfrac{6K+11}{K+2}\\right)$ hs.",
          "Si **come mucho** ($C$), estudia $X_C \\sim \\mathcal{E}(\\lambda_C)$ con **media** $\\tfrac{6K+5}{K+1}$ (es decir $\\lambda_C = \\tfrac{K+1}{6K+5}$).",
          "En el **resto de los casos** ($N$), estudia $X_N \\sim \\mathcal{N}\\!\\left(\\tfrac{6K+7}{K+1},\\ \\tfrac{3K+4}{2K+2}\\right)$ (media y desvío en hs).",
        ],
      },
      {
        t: "text",
        md: "Cada día duerme mal con probabilidad $P(D)=\\tfrac{K+3}{3K+6}$, come mucho con $P(C)=\\tfrac{K+1}{3K+6}$, y por complemento $P(N)=\\tfrac{K+2}{3K+6}$.",
      },
      {
        t: "text",
        md: "**(a)** Calcular la probabilidad de que las horas estudiadas superen su valor esperado, $P(X>E[X])$. **(b)** Calcular el desvío de $X$. **(c)** El almuerzo y la cena son a las $4$ y $8$ h desde que empieza; lo llaman a comer una sola vez por comida. Calcular el valor esperado de la cantidad de veces $G$ que lo llaman.",
      },
      {
        t: "note",
        tone: "tip",
        label: "Convención numérica",
        md: "El examen deja el resultado **paramétrico en $K$** (con una tabla por valor de $K$). Abajo se desarrolla el método general; cuando convenga un número concreto se usa **$K=2$** como referencia (p. ej. $E[X]\\approx 5.19$, $\\sigma_X\\approx 3.20$, $E[G]\\approx 1.01$).",
      },
    ],
    steps: [
      {
        label: "Datos de cada distribución condicional",
        blocks: [
          {
            t: "text",
            md: "Conviene escribir primero esperanza y varianza de cada rama, porque son los ladrillos de todo lo que sigue. Para la **uniforme** $X_D$, la media es el punto medio del intervalo y la varianza es $\\tfrac{(b-a)^2}{12}$:",
          },
          {
            t: "math",
            tex: " E[X_D] = \\frac{\\tfrac{2K+5}{K+2}+\\tfrac{6K+11}{K+2}}{2} = \\frac{8K+16}{2(K+2)} = 4, \\qquad V(X_D) = \\frac{(4K+6)^2}{12\\,(K+2)^2}. ",
          },
          {
            t: "text",
            md: "Notá que la media de $X_D$ vale **$4$ para todo $K$** (los $K$ se cancelan). Para la **exponencial** $X_C$ de media $\\tfrac{6K+5}{K+1}$, la varianza es la media al cuadrado; para la **normal** $X_N$, media y varianza son los parámetros directos:",
          },
          {
            t: "math",
            tex: " E[X_C] = \\tfrac{6K+5}{K+1},\\ V(X_C) = \\tfrac{(6K+5)^2}{(K+1)^2}; \\qquad E[X_N] = \\tfrac{6K+7}{K+1},\\ V(X_N) = \\tfrac{(3K+4)^2}{(2K+2)^2}. ",
          },
        ],
      },
      {
        label: "Planteo (a) — la mezcla se arma sobre la FDA",
        blocks: [
          {
            t: "text",
            md: '$X$ es una **mezcla**: no es discreta ni continua "pura", pero **sí es continua**. No conocemos su distribución de forma cerrada, pero sí podemos describirla por su **FDA** ([[funcion-de-distribucion-acumulada]]), porque con la acumulada se sabe todo de la variable. Aplicando **probabilidad total** al evento $\\{X\\le t\\}$ y condicionando en el estado:',
          },
          {
            t: "math",
            tex: " F_X(t) = P(X\\le t\\mid D)P(D) + P(X\\le t\\mid C)P(C) + P(X\\le t\\mid N)P(N), ",
          },
          {
            t: "text",
            md: "y como condicionado a cada estado $X$ se comporta como la rama correspondiente, $P(X\\le t\\mid D)=F_{X_D}(t)$, etc.:",
          },
          {
            t: "math",
            tex: " F_X(t) = F_{X_D}(t)\\,P(D) + F_{X_C}(t)\\,P(C) + F_{X_N}(t)\\,P(N). ",
          },
          {
            t: "text",
            md: "Derivando la acumulada se obtiene la densidad, que se mezcla con los mismos pesos:",
          },
          {
            t: "math",
            tex: " f_X(x) = f_{X_D}(x)\\,P(D) + f_{X_C}(x)\\,P(C) + f_{X_N}(x)\\,P(N). ",
          },
        ],
      },
      {
        label: "Cálculo de la esperanza y de $P(X>\\mu_X)$",
        blocks: [
          {
            t: "text",
            md: "Como $E[X]=\\int x\\,f_X(x)\\,dx$ y $f_X$ es combinación lineal de las densidades de las ramas, la integral se reparte y la esperanza de la mezcla queda como el **promedio ponderado** de las esperanzas:",
          },
          {
            t: "math",
            tex: " E[X] = P(D)\\,E[X_D] + P(C)\\,E[X_C] + P(N)\\,E[X_N] = \\tfrac{K+3}{3K+6}\\cdot 4 + \\tfrac{K+1}{3K+6}\\cdot\\tfrac{6K+5}{K+1} + \\tfrac{K+2}{3K+6}\\cdot\\tfrac{6K+7}{K+1} = \\mu_X. ",
          },
          {
            t: "text",
            md: "Numéricamente $\\mu_X$ ronda $5.17$–$5.28$ según $K$ (p. ej. $K=2 \\Rightarrow \\mu_X\\approx 5.19$). La probabilidad pedida sale por complemento, evaluando la mezcla de FDAs en $\\mu_X$:",
          },
          {
            t: "math",
            tex: " P(X>\\mu_X) = 1 - F_X(\\mu_X) = 1 - P(D)F_{X_D}(\\mu_X) - P(C)F_{X_C}(\\mu_X) - P(N)F_{X_N}(\\mu_X). ",
          },
          {
            t: "note",
            tone: "warn",
            label: "Atención",
            md: "Para reemplazar $F_{X_D}$ por la fórmula lineal de la uniforme hace falta verificar que $\\mu_X$ cae **dentro** del intervalo $\\big(\\tfrac{2K+5}{K+2},\\tfrac{6K+11}{K+2}\\big)$. El examen chequea que el extremo inferior ($\\approx 2.1$–$2.5$) y el superior ($\\approx 5.5$–$5.9$) encierran a $\\mu_X$ para todo $K$, así que el reemplazo es válido. El resultado da $P(X>\\mu_X)\\approx 0.43$ (p. ej. $K=2 \\Rightarrow 0.4285$).",
          },
        ],
      },
      {
        label: "Planteo (b) — desvío vía momento de 2º orden",
        blocks: [
          {
            t: "text",
            md: "El desvío **NO** se mezcla como las esperanzas ($\\sigma_X \\ne \\sum_i P(i)\\,\\sigma_i$): la raíz rompe la linealidad. Lo que sí se mezcla con los pesos es el **momento de segundo orden** $E[X^2]$, porque es de nuevo una integral lineal de $f_X$. Y de cada rama lo sacamos con $E[X_i^2]=V(X_i)+E[X_i]^2$:",
          },
          {
            t: "math",
            tex: " E[X^2] = \\sum_i P(i)\\,E[X_i^2] = \\sum_i P(i)\\big(V(X_i) + E[X_i]^2\\big). ",
          },
          {
            t: "text",
            md: "Reemplazando las $V(X_i)$ y $E[X_i]$ de cada rama (uniforme, exponencial, normal) se obtiene $E[X^2]$ — p. ej. $K=2 \\Rightarrow E[X^2]\\approx 37.20$. Recién entonces se baja a la varianza y al desvío:",
          },
          {
            t: "math",
            tex: " V(X) = E[X^2] - E[X]^2, \\qquad \\sigma_X = \\sqrt{V(X)}. ",
          },
          {
            t: "text",
            md: "Para $K=2$: $V(X)\\approx 37.20 - 5.19^2 \\approx 10.22$ y $\\sigma_X\\approx 3.20$ hs.",
          },
        ],
      },
      {
        label: "Planteo (c) — esperanza de las veces que lo llaman",
        blocks: [
          {
            t: "text",
            md: "Sea $G$ = cantidad de veces que lo llaman a comer. Es **discreta** con recorrido $R_G=\\{0,1,2\\}$ (almuerzo a las $4$ h y cena a las $8$ h, y lo llaman sólo si todavía está estudiando en ese instante). Su esperanza es",
          },
          {
            t: "math",
            tex: " E[G] = 0\\cdot P(G=0) + 1\\cdot P(G=1) + 2\\cdot P(G=2) = P(G=1) + 2\\,P(G=2). ",
          },
          {
            t: "text",
            md: "Lo llaman al almuerzo si sigue estudiando a las $4$ h ($X\\ge 4$) y a la cena si sigue a las $8$ h ($X\\ge 8$). Entonces $\\{G=2\\}=\\{X\\ge 8\\}$ y $\\{G=1\\}=\\{4\\le X<8\\}$, que con la FDA mezclada son:",
          },
          {
            t: "math",
            tex: " P(G=1) = F_X(8) - F_X(4), \\qquad P(G=2) = 1 - F_X(8). ",
          },
          {
            t: "text",
            md: "Evaluando cada $F_{X_i}$ en $4$ y $8$ y ponderando, se llega a $E[G]\\approx 0.96$–$1.05$ (p. ej. $K=2 \\Rightarrow E[G]\\approx 1.01$).",
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
        md: "**Fuente:** `2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 2 (resolución **manuscrita**: abajo se reproduce el método de la cátedra). El `2025Q2_Parcial_Resolución.pdf` Ej. 2 es **otro** proceso de Poisson (Tomás mira el celular, $\\lambda=(K+8)\\,h^{-1}$), con el mismo método (condicional por incrementos independientes + equivalencia $T_k\\!\\leftrightarrow\\!N$).",
      },
      {
        t: "text",
        md: "**Enunciado (final 05/12).** Josefina está enferma: los tiempos entre las veces que tose son exponenciales independientes. Tras un análisis extensivo se concluye que el parámetro es $\\lambda = \\tfrac{1}{12}\\,\\text{min}^{-1}$, y vuelve a monitorear sus toses. Sea $N(t)$ el proceso de Poisson asociado (cantidad de toses hasta el minuto $t$).",
      },
      {
        t: "text",
        md: "**(a)** Sabiendo que en los primeros $40$ min tosió $4$ veces, calcular la probabilidad de que haya tosido $1$ vez en los primeros $20$ min, $P(N(20)=1 \\mid N(40)=4)$. Calcular también la probabilidad de que la **quinta tos** sea antes de los $45$ min, $P(T_5 < 45)$.",
      },
      {
        t: "text",
        md: "**(b)** ¿Cuántos minutos deberá monitorear para que la probabilidad de toser por lo menos $50$ veces sea mayor que $0.9$, es decir $P(N(t)\\ge 50) > 0.9$?",
      },
    ],
    steps: [
      {
        label: "Planteo (a) — condicional dentro de un Poisson",
        blocks: [
          {
            t: "text",
            md: "Arrancamos por la **definición de probabilidad condicional**. La clave para volverlo computable es reescribir el evento del numerador en términos de **incrementos disjuntos**: tener $1$ tos hasta el minuto $20$ y $4$ hasta el $40$ es lo mismo que tener $1$ tos en $[0,20]$ y $3$ toses en el incremento $(20,40]$:",
          },
          {
            t: "math",
            tex: " P(N(20)=1 \\mid N(40)=4) = \\frac{P(N(20)=1 \\cap N(40)-N(20)=3)}{P(N(40)=4)}. ",
          },
          {
            t: "text",
            md: "Como en un proceso de Poisson los **incrementos sobre intervalos disjuntos son independientes**, el numerador factoriza en producto de probabilidades:",
          },
          {
            t: "math",
            tex: " = \\frac{P(N(20)=1)\\,P(N(40)-N(20)=3)}{P(N(40)=4)}. ",
          },
          {
            t: "text",
            md: "Cada conteo es Poisson con media $\\lambda\\cdot(\\text{longitud})$: $N(20)\\sim Po(20\\lambda)=Po(\\tfrac{5}{3})$ y, por **incrementos estacionarios** (sólo importa la longitud del intervalo), $N(40)-N(20)\\sim Po(\\tfrac{5}{3})$, mientras que $N(40)\\sim Po(\\tfrac{10}{3})$. Al reemplazar las tres PMF y simplificar las exponenciales, la cuenta colapsa exactamente en un término **binomial** (repartir $4$ éxitos en dos mitades iguales de tiempo, cada uno con prob. $\\tfrac12$):",
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
            md: "$T_5$ es el **instante de la 5ª tos**, suma de $5$ tiempos entre toses exponenciales i.i.d., así que $T_5\\sim$ [[distribucion-erlang|Erlang]]$/\\Gamma(5,\\lambda)$. Integrar esa densidad Gamma es engorroso; en su lugar se usa la **equivalencia de sucesos** que conecta el tiempo de la $k$-ésima ocurrencia con el conteo: que la 5ª tos ocurra antes de $45$ min equivale a que para el minuto $45$ ya haya habido al menos $5$ toses:",
          },
          {
            t: "math",
            tex: " P(T_5 < 45) = P(N(45) \\ge 5) = 1 - P(N(45) \\le 4), \\quad N(45)\\sim Po(45\\lambda). ",
          },
          {
            t: "text",
            md: "Con $45\\lambda = \\tfrac{45}{12}=\\tfrac{15}{4}$, queda sumar la PMF de $Po(\\tfrac{15}{4})$ desde $0$ hasta $4$ y restar de $1$.",
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
            md: "Acá la incógnita es el **horizonte $t$**, no una probabilidad. Como buscamos $\\lambda t$ grande (queremos $\\ge 50$ eventos), aplicamos el **TCL**: un $Po(\\lambda t)$ con media grande se aproxima por una normal de igual media y desvío $\\sqrt{\\lambda t}$, es decir $N(t)\\approx \\mathcal{N}(\\lambda t, \\sqrt{\\lambda t})$ con $\\lambda t = t/12$. Estandarizando con **corrección por continuidad** ($\\ge 50 \\to \\ge 49.5$):",
          },
          {
            t: "math",
            tex: " P(N(t)\\ge 50) \\approx 1 - \\Phi\\!\\left(\\frac{49.5 - t/12}{\\sqrt{t/12}}\\right) > 0.9. ",
          },
          {
            t: "text",
            md: "Pedir que esto supere $0.9$ equivale a $\\Phi(\\cdot)<0.1$, o sea el argumento por debajo de $z_{0.1}=-z_{0.9}\\approx -1.2816$:",
          },
          {
            t: "math",
            tex: " \\frac{49.5 - t/12}{\\sqrt{t/12}} \\le z_{0.1} = -z_{0.9}. ",
          },
          {
            t: "text",
            md: "Sustituyendo $u=\\sqrt{t/12}$ (con $t/12=u^2$) y multiplicando por $u>0$ queda una **cuadrática** $u^2 - z_{0.9}\\,u - 49.5 \\ge 0$. Se resuelve, se **descarta la raíz negativa** (el tiempo es positivo), se vuelve a $t=12u^2$ y se verifica recalculando la probabilidad: $t \\approx 712.5$ min.",
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
        md: "**Fuente:** `2025Q2_Parcial_Resolución.pdf`, Ej. 3 (Tomás acompaña el estudio con comida). Examen **parametrizado** por $K$ (dígito del legajo).",
      },
      {
        t: "text",
        md: "**Enunciado (completo).** Cada hora, Tomás acompaña la jornada de estudio con comida, alternando $3$ opciones: **Bizcochos** ($B$), **Cereal** ($C$) y **Fruta** ($F$). La primera hora elige al azar entre las $3$. Las reglas son:",
      },
      {
        t: "list",
        items: [
          "Cada vez que come **bizcochos**, reincide a la hora siguiente con probabilidad $\\tfrac{7K+8}{10K+12}$; el resto de las veces cambia a la **fruta**.",
          "Siempre que come **cereal**, reincide con probabilidad $0.6$ y en el resto de los casos cambia a los **bizcochos**.",
          "Siempre que come **fruta**, la hora siguiente come **cereal**.",
        ],
      },
      {
        t: "text",
        md: "Modelando $X(n)$ = comida elegida en la $n$-ésima hora, con estados $E=\\{B,C,F\\}$, vector inicial $\\vec\\pi^{(1)}=(\\tfrac13,\\tfrac13,\\tfrac13)$ y matriz de transición",
      },
      {
        t: "math",
        tex: " \\mathbb{P} = \\begin{pmatrix} \\tfrac{7K+8}{10K+12} & 0 & \\tfrac{3K+4}{10K+12} \\\\[2pt] 0.4 & 0.6 & 0 \\\\[2pt] 0 & 1 & 0 \\end{pmatrix} \\quad (\\text{filas/columnas en orden } B,C,F). ",
      },
      {
        t: "text",
        md: "**(a)** Calcular $P(X(3)=F\\mid X(1)=C)$. **(b)** Calcular la inversa en el tiempo $P(X(1)=C\\mid X(3)=F)$. **(c)** Calcular, si existe, la probabilidad a largo plazo de comer **bizcochos**.",
      },
      {
        t: "note",
        tone: "tip",
        label: "Convención numérica",
        md: "El examen deja todo **paramétrico en $K$**. Para referencias numéricas se usa **$K=2$**: $\\tfrac{7K+8}{10K+12}=\\tfrac{22}{32}=0.6875$, $\\tfrac{3K+4}{10K+12}=\\tfrac{10}{32}=0.3125$; con eso (a)$\\approx 0.1250$, (b)$\\approx 0.3678$, (c)$\\approx 0.4776$.",
      },
    ],
    steps: [
      {
        label: 'Planteo (a) — "a futuro" con $\\mathbb{P}^2$',
        blocks: [
          {
            t: "text",
            md: "Ir de $C$ (hora $1$) a $F$ (hora $3$) son **2 pasos**, así que es la entrada $(C,F)$ de $\\mathbb{P}^2$. En vez de elevar toda la matriz, alcanza con multiplicar la **fila $C$** por la **columna $F$** de $\\mathbb{P}$. Como desde $C$ sólo se va a $B$ (prob. $0.4$) o a $C$ (prob. $0.6$), y sólo $B$ alcanza $F$ en un paso:",
          },
          {
            t: "math",
            tex: " P(X(3)=F\\mid X(1)=C) = \\begin{pmatrix}0.4 & 0.6 & 0\\end{pmatrix}\\begin{pmatrix}\\tfrac{3K+4}{10K+12}\\\\ 0 \\\\ 0\\end{pmatrix} = 0.4\\cdot\\frac{3K+4}{10K+12}. ",
          },
          {
            t: "text",
            md: "Para $K=2$ da $0.4\\cdot\\tfrac{10}{32}=0.125$.",
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
            md: "Ahora piden la **probabilidad inversa en el tiempo**, y la matriz de transición sólo sirve hacia adelante. Para dar vuelta el condicional se usa [[probabilidad-total-y-bayes|Bayes]], abriendo el denominador por probabilidad total sobre el estado inicial:",
          },
          {
            t: "math",
            tex: " P(X(1)=C\\mid X(3)=F) = \\frac{P(X(3)=F\\mid X(1)=C)\\,P(X(1)=C)}{\\sum_{i\\in\\{B,C,F\\}} P(X(3)=F\\mid X(1)=i)\\,P(X(1)=i)}. ",
          },
          {
            t: "text",
            md: "Como la inicial es **uniforme**, $P(X(1)=i)=\\tfrac13$ aparece en todos los términos: sale de factor común y se cancela, dejando un cociente de transicionales a 2 pasos. Sólo faltan las otras dos entradas $(\\cdot,F)$ de $\\mathbb{P}^2$, calculadas igual que en (a):",
          },
          {
            t: "math",
            tex: " P(X(3)=F\\mid X(1)=B) = \\frac{(7K+8)(3K+4)}{(10K+12)^2}, \\qquad P(X(3)=F\\mid X(1)=F) = 0. ",
          },
          {
            t: "text",
            md: "($F\\to F$ en 2 pasos es imposible: desde $F$ se va seguro a $C$, y desde $C$ no se llega a $F$ en un paso). Reemplazando:",
          },
          {
            t: "math",
            tex: " P(X(1)=C\\mid X(3)=F) = \\frac{0.4\\cdot\\tfrac{3K+4}{10K+12}}{\\tfrac{(7K+8)(3K+4)}{(10K+12)^2} + 0.4\\cdot\\tfrac{3K+4}{10K+12} + 0}. ",
          },
          {
            t: "text",
            md: "Para $K=2$ da $\\approx 0.3678$.",
          },
        ],
      },
      {
        label: "Planteo (c) — distribución estacionaria",
        blocks: [
          {
            t: "text",
            md: "Primero hay que justificar que **existe** límite, viendo que la cadena es **regular** (alguna potencia $\\mathbb{P}^k$ con todas las entradas positivas). En $\\mathbb{P}^2$ todas las entradas son positivas **salvo** $(F,F)$ — no se vuelve de la fruta a la fruta en 2 pasos. Pero esa transición sí ocurre en más pasos: basta verificar que la entrada $(F,F)$ de $\\mathbb{P}^4$ (fila $F$ de $\\mathbb{P}^2$ por columna $F$ de $\\mathbb{P}^2$) es $>0$ para concluir regularidad sin recalcular toda $\\mathbb{P}^4$. Entonces existe un único $\\vec\\pi=(a,b,c)$ con",
          },
          {
            t: "math",
            tex: " \\vec\\pi = \\vec\\pi\\,\\mathbb{P}, \\qquad a+b+c = 1. ",
          },
          {
            t: "text",
            md: "Escribiendo $\\vec\\pi=\\vec\\pi\\mathbb{P}$ columna por columna queda el sistema:",
          },
          {
            t: "math",
            tex: " a = \\tfrac{7K+8}{10K+12}\\,a + 0.4\\,b, \\quad b = 0.6\\,b + c, \\quad c = \\tfrac{3K+4}{10K+12}\\,a, \\quad a+b+c=1. ",
          },
          {
            t: "text",
            md: "Las ecuaciones son **linealmente dependientes**: se descarta una y se usan las últimas tres. De $0.4\\,b=c$ y $c=\\tfrac{3K+4}{10K+12}a$ sale $b=\\tfrac{5}{2}\\cdot\\tfrac{3K+4}{10K+12}a$; sustituyendo en la normalización y despejando $a$ (la probabilidad de bizcochos pedida):",
          },
          {
            t: "math",
            tex: " a = \\frac{20K+24}{41K+52}. ",
          },
          {
            t: "text",
            md: "Para $K=2$ da $\\tfrac{64}{134}\\approx 0.4776$. Ver [[cadenas-de-markov]].",
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
        md: "**Fuente:** `09 - Segundo Parcial.pdf` (2do parcial 2024, Tema A), Ej. 5 (sobrepeso/obesidad/muerte) y `Resolución_Examen_15_12_TemaA.pdf`, Ej. 3 (medicación).",
      },
      {
        t: "text",
        md: "**Enunciado (2do parcial 2024).** Un artículo modela con una cadena de Markov la evolución del peso de un adulto, con $4$ estados que se suceden **año a año**: peso **normal** ($N$), **sobrepeso** ($S$), **obeso** ($O$) y **muerto** ($M$). Los datos del estudio:",
      },
      {
        t: "list",
        items: [
          "El $2\\%$ de los adultos con peso normal pasa a sobrepeso (nunca directo a obeso) y la prob. de morir es $1.2\\%$.",
          "El $1\\%$ de los de sobrepeso pasa a obeso, el $0.1\\%$ baja a normal y la prob. de morir sube a $1.3\\%$.",
          "El $2\\%$ de los obesos baja a sobrepeso (nunca directo a normal) y la prob. de morir es $1.6\\%$.",
        ],
      },
      {
        t: "text",
        md: "Ordenando los estados como $M,N,S,O$, la matriz de transición es",
      },
      {
        t: "math",
        tex: " \\mathbb{P} = \\begin{pmatrix} 1.000 & 0.000 & 0.000 & 0.000 \\\\ 0.012 & 0.958 & 0.020 & 0.000 \\\\ 0.013 & 0.010 & 0.967 & 0.010 \\\\ 0.016 & 0.000 & 0.020 & 0.964 \\end{pmatrix}, ",
      },
      {
        t: "text",
        md: "donde $M$ es **absorbente** (su fila es $(1,0,0,0)$). **(a)** Dibujar el diagrama y escribir $\\mathbb{P}$. **(b)** ¿Existe distribución estacionaria o a largo plazo? Justificar. **(c)** Si un adulto tiene peso normal, ¿cuál es su esperanza de vida (tiempo medio antes de morir)?",
      },
    ],
    steps: [
      {
        label: "Planteo (b) — ¿hay distribución a largo plazo?",
        blocks: [
          {
            t: "text",
            md: 'La pista del examen es "pensá qué pasa siempre a la larga". Hay **un único estado absorbente** ($M$) y es **alcanzable desde todos los demás** (desde $N$, $S$ y $O$ hay probabilidad positiva de morir). Por eso la cadena NO es regular (de $M$ no se sale), pero **sí tiene distribución a largo plazo**: con probabilidad $1$ todo termina en $M$, sin importar el estado inicial. En el orden $M,N,S,O$ eso es',
          },
          {
            t: "math",
            tex: " \\vec\\pi = (1,\\,0,\\,0,\\,0). ",
          },
        ],
      },
      {
        label: "Planteo (c) — tiempo medio de absorción (esperanza de vida)",
        blocks: [
          {
            t: "text",
            md: "La esperanza de vida es el **tiempo medio hasta la absorción** partiendo de $N$. Se separa el absorbente y se toma $Q$ = submatriz de transiciones entre los estados **transitorios** $\\{N,S,O\\}$ (las filas/columnas $2$–$4$ de $\\mathbb{P}$). La **matriz fundamental** $(I-Q)^{-1}$ tiene en su entrada $(i,j)$ el número esperado de visitas a $j$ partiendo de $i$, antes de absorberse:",
          },
          {
            t: "math",
            tex: " (I-Q)^{-1} = \\begin{pmatrix} 40.4653 & 29.4889 & 8.1913 \\\\ 14.7444 & 47.1822 & 13.1062 \\\\ 8.1913 & 26.2123 & 35.0590 \\end{pmatrix}. ",
          },
          {
            t: "text",
            md: 'El tiempo total esperado hasta morir partiendo de $N$ es la **suma de la fila** correspondiente a $N$ (la primera): $40.4653 + 29.4889 + 8.1913 = 63.4010$ años. Ese número es la "esperanza de vida" pedida. Ver [[cadenas-de-markov]].',
          },
          {
            t: "note",
            tone: "warn",
            label: "Error típico",
            md: "Se suma la fila del **estado inicial** (acá $N$), no una columna ni toda la matriz: cada término de esa fila es el número esperado de años pasados en cada estado transitorio, y su suma es el total de años antes de la absorción.",
          },
        ],
      },
      {
        label: 'Variante por complemento — "no absorbido en $k$ pasos"',
        blocks: [
          {
            t: "text",
            md: "**Fuente:** `Resolución_Examen_15_12_TemaA.pdf`, Ej. 3 (resolución **manuscrita**; aquí se reproduce el método de la cátedra). Para paliar los síntomas, cada **8 h** toma un medicamento entre **Paracetamol** ($P$) e **Ibuprofeno** ($I$) hasta que dejan los síntomas ($N$).",
          },
          {
            t: "text",
            md: "**Enunciado (completo).** Las reglas: cuando toma **Paracetamol**, se le terminan los síntomas con prob. $0.3$, vuelve a Paracetamol con $0.25$ y el resto ($0.45$) pasa a Ibuprofeno. Cuando toma **Ibuprofeno**, terminan con $0.1$, vuelve a Ibuprofeno con $0.3$ y el resto ($0.6$) pasa a Paracetamol. Al comienzo de los síntomas **elige al azar** entre $P$ e $I$.",
          },
          {
            t: "text",
            md: 'Modelando $X(n)$ = pastilla en la $n$-ésima dosis, $E=\\{P,I,N\\}$, con $N$ ("se terminan los síntomas") **absorbente** y vector inicial $\\vec\\pi^{(0)}=(\\tfrac12,\\tfrac12,0)$:',
          },
          {
            t: "math",
            tex: " \\mathbb{P}=\\begin{pmatrix} 0.25 & 0.45 & 0.3 \\\\ 0.6 & 0.3 & 0.1 \\\\ 0 & 0 & 1 \\end{pmatrix}, \\qquad \\vec\\pi^{(0)}=(\\tfrac12,\\tfrac12,0). ",
          },
          {
            t: "text",
            md: "**(a)** Calcular la probabilidad de que **tarde más de 16 h** (desde la 1ª pastilla) hasta que se terminan los síntomas. **(b)** ¿Es regular la cadena? Si hay distribución estacionaria, calcularla.",
          },
        ],
      },
      {
        label: "Planteo (a) — la clave es traducir el tiempo a pasos",
        blocks: [
          {
            t: "text",
            md: "Como cada dosis es cada $8$ h, $16\\text{ h}/8\\text{ h}=2$ dosis. \"Tardar más de $16$ h\" en absorberse equivale a que **todavía no se llegó a $N$ tras las primeras 2 transiciones**, es decir $X(1)\\ne N \\ \\wedge\\ X(2)\\ne N$. Conviene el **complemento** (más corto que enumerar todos los caminos que evitan $N$):",
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
            tex: " = 1 - \\underbrace{0.5\\cdot 0.3 + 0.5\\cdot 0.1}_{X(1)=N}\n        - \\underbrace{0.5\\cdot 0.25\\cdot 0.3 + 0.5\\cdot 0.45\\cdot 0.1\n        + 0.5\\cdot 0.6\\cdot 0.3 + 0.5\\cdot 0.3\\cdot 0.1}_{X(1)\\ne N,\\ X(2)=N} = 0.635. ",
          },
        ],
      },
      {
        label: "Planteo (b) — ¿regular? distribución a largo plazo",
        blocks: [
          {
            t: "text",
            md: "La cadena **no es regular**: $N$ es absorbente, así que ninguna potencia $\\mathbb{P}^k$ puede tener positiva la entrada que sale de $N$ hacia $P$ o $I$. Pero como $N$ es **el único absorbente** y es accesible desde $P$ y $I$, sí existe distribución a largo plazo $\\vec\\pi=(0,0,1)$: a la larga todo termina en $N$, sin importar el estado inicial.",
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
        md: "**Fuente:** `2025_12_05_Final_..._TemaA_RES.pdf`, Ej. 5 (carga viral; resolución **manuscrita**, abajo el método de la cátedra) y `2025Q2_Parcial_Resolución.pdf`, Ej. 4 (Tomás y Carolina, densidad conjunta parametrizada por $K$ — mismo método: dibujar la región e integrar).",
      },
      {
        t: "text",
        md: "**Enunciado (final 05/12).** El tiempo $T$ (en horas) que Josefina pasa en la guardia impacta en su **carga viral** $C$, que por tomar valores muy grandes se analiza en escala logarítmica: $X=\\log_{10}(C)$. La densidad conjunta de $T$ y $X$ es",
      },
      {
        t: "math",
        tex: " f_{TX}(t,x) = \\begin{cases} \\tfrac{3}{160}\\,t\\,x & 0\\le t\\le 4,\\ 1\\le x\\le t+1 \\\\ 0 & \\text{en caso contrario.} \\end{cases} ",
      },
      {
        t: "text",
        md: "**(a)** Calcular $P(X\\le 3)$ y $P(X\\le 3 \\mid T>2)$. **(b)** Calcular $P(C>1000)$.",
      },
      {
        t: "note",
        tone: "tip",
        label: "Variante del parcial (Ej. 4)",
        md: "En el parcial 2025Q2, la conjunta es $f_{TN}(t,n)=c\\,t$ para $0\\le t\\le \\tfrac{4K+5}{K+1}$, $t+1\\le n\\le t+4$ (nota $N$ de Tomás según horas $T$ con Carolina). Se normaliza ($c=\\tfrac{2(K+1)^2}{3(4K+5)^2}$), se calcula $P(N\\ge 4)$, $P(N\\ge 4\\mid T>2)$ y $E[N]$ con el mismo recurso: **dibujar el soporte** y partir la integral donde cambia el piso ($t=3$).",
      },
    ],
    steps: [
      {
        label: "Planteo (a) — clave: dibujar la región",
        blocks: [
          {
            t: "text",
            md: "Lo primero es **dibujar el soporte**: es triangular, acotado por $1\\le x \\le t+1$ y $0\\le t \\le 4$. La constante $\\tfrac{3}{160}$ ya viene dada (se puede verificar que la integral sobre el soporte da $1$). Para $P(X\\le 3)$ conviene el **complemento**, porque la región $X>3$ es más chica y de límites más simples:",
          },
          {
            t: "math",
            tex: " P(X\\le 3) = 1 - P(X>3) = 1 - \\int_{2}^{4}\\!\\!\\int_{3}^{t+1} \\tfrac{3}{160}\\,t\\,x \\,dx\\,dt, ",
          },
          {
            t: "text",
            md: "El cuidado está en los **límites**: para que exista algún $x$ con $x>3$ dentro del soporte ($x\\le t+1$) hace falta $t+1>3$, o sea $t>2$; por eso la integral exterior arranca en $t=2$ y no en $0$. Integrando primero en $x$ (de $3$ a $t+1$) y luego en $t$ (de $2$ a $4$) se obtiene $P(X\\le 3)\\approx 43/80$.",
          },
        ],
      },
      {
        label: "Planteo (a, 2ª parte) — condicional",
        blocks: [
          {
            t: "text",
            md: "Por la **definición de probabilidad condicional**, $P(X\\le 3\\mid T>2)=\\tfrac{P(X\\le 3\\,\\cap\\,T>2)}{P(T>2)}$. Ambos eventos se recortan con $t>2$, así que es un cociente de integrales sobre la franja $2<t<4$; en el numerador además se pide $x\\le 3$ (y como en esa franja $t+1\\le 5$ pero el soporte llega hasta $x=t+1$, el techo efectivo es $3$):",
          },
          {
            t: "math",
            tex: " P(X\\le 3\\mid T>2) = \\frac{\\displaystyle\\int_2^4\\!\\!\\int_1^{3} \\tfrac{3}{160}txdx\\,dt}{\\displaystyle\\int_2^4\\!\\!\\int_1^{t+1}\\tfrac{3}{160}txdx\\,dt}. ",
          },
        ],
      },
      {
        label: "Planteo (b) — volver de $X$ a $C$",
        blocks: [
          {
            t: "text",
            md: "Como $X=\\log_{10}(C)$, el evento sobre $C$ se traduce a uno sobre $X$ aplicando $10^{(\\cdot)}$ (función creciente, conserva la desigualdad): $C>1000 \\Leftrightarrow 10^X > 10^3 \\Leftrightarrow X>3$. Por eso no hace falta la densidad de $C$: alcanza con el complemento de lo ya calculado:",
          },
          {
            t: "math",
            tex: " P(C>1000) = P(X>3) = 1 - P(X\\le 3) = 1 - \\tfrac{43}{80} = \\tfrac{37}{80}. ",
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
