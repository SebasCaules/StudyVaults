import type { Sheet } from "../types";

// Hojas de estudio de Probabilidad y Estadística (93.24 ITBA). Datos puros.
// Formato académico: cada fórmula en su renglón (entornos aligned) con
// descripción y leyenda de variables (campo `vars`). Editable a mano.
// Ver components/vault-sheets/types.ts.

export const probaFormulas: Sheet = {
  "vault": "proba",
  "kind": "formulas",
  "title": "Probabilidad y Estadística",
  "subtitle": "Cheat sheet integral del final (93.24 ITBA): descriptiva, probabilidad, v.a., distribuciones, procesos, suma de v.a., inferencia y pruebas",
  "notation": "$X_i$ i.i.d.; $\\mu=E[X]$, $\\sigma^2=V(X)$; $\\overline X_n=\\frac1n\\sum X_i$, $S_n$ desvío muestral; $q=1-p$; $\\Phi$ FDA de $N(0,1)$, $z_p=\\Phi^{-1}(p)$; $\\gamma$ confianza, $\\alpha$ significación; $\\binom{n}{k}$ combinatorio",
  "updated": "2026-06-30",
  "groups": [
    {
      "title": "Estadística descriptiva",
      "hint": "Resumen de una muestra {x_i}: centro, dispersión, forma, posición",
      "unit": "1",
      "entries": [
        {
          "label": "Media muestral",
          "kind": "formula",
          "tex": "\\bar x=\\frac{1}{n}\\sum_{i=1}^n x_i",
          "body": "Promedio aritmético de las observaciones: suma todos los datos y los divide por la cantidad. Es la medida de centro más usada y el estimador natural de la media poblacional.",
          "vars": [
            {
              "sym": "\\bar x",
              "desc": "media muestral"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra (cantidad de observaciones)"
            },
            {
              "sym": "x_i",
              "desc": "$i$-ésima observación, con $i=1,\\dots,n$"
            }
          ],
          "note": "Sensible a outliers; la mediana es robusta"
        },
        {
          "label": "Mediana",
          "kind": "def",
          "body": "Valor central de la muestra ordenada: posición $(n+1)/2$ si $n$ impar; promedio de las dos centrales si $n$ par. Es el 2º cuartil $q_2$."
        },
        {
          "label": "Varianza y desvío muestral",
          "kind": "formula",
          "tex": "\\begin{aligned} s^2 &= \\frac{1}{n-1}\\sum_{i=1}^n (x_i-\\bar x)^2 \\\\ s &= \\sqrt{s^2} \\end{aligned}",
          "body": "La varianza muestral promedia los desvíos cuadráticos respecto de la media, midiendo la dispersión de los datos; el desvío estándar es su raíz, expresada en las mismas unidades que las observaciones.",
          "vars": [
            {
              "sym": "s^2",
              "desc": "varianza muestral"
            },
            {
              "sym": "s",
              "desc": "desvío estándar muestral"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "x_i",
              "desc": "$i$-ésima observación"
            },
            {
              "sym": "\\bar x",
              "desc": "media muestral"
            }
          ],
          "note": "Denominador $n-1$ (Bessel), no $n$"
        },
        {
          "label": "Rango e IQR",
          "kind": "formula",
          "tex": "\\begin{aligned} R &= \\max_i x_i-\\min_i x_i \\\\ \\mathrm{IQR} &= q_3-q_1 \\end{aligned}",
          "body": "El rango mide la amplitud total de los datos como diferencia entre el máximo y el mínimo. El rango intercuartílico (IQR) mide la dispersión del 50% central y es robusto frente a valores extremos.",
          "vars": [
            {
              "sym": "R",
              "desc": "rango muestral"
            },
            {
              "sym": "\\max_i x_i",
              "desc": "valor máximo de la muestra"
            },
            {
              "sym": "\\min_i x_i",
              "desc": "valor mínimo de la muestra"
            },
            {
              "sym": "\\mathrm{IQR}",
              "desc": "rango intercuartílico"
            },
            {
              "sym": "q_1",
              "desc": "primer cuartil (percentil 25)"
            },
            {
              "sym": "q_3",
              "desc": "tercer cuartil (percentil 75)"
            }
          ]
        },
        {
          "label": "Asimetría y curtosis",
          "kind": "formula",
          "tex": "\\begin{aligned} \\gamma &= \\frac{\\sum (x_i-\\bar x)^3}{n\\,s^3} \\\\ \\kappa &= \\frac{\\sum (x_i-\\bar x)^4}{n\\,s^4}-3 \\end{aligned}",
          "body": "El coeficiente de asimetría mide la falta de simetría de la distribución de los datos, y la curtosis (en su versión de exceso) compara el peso de las colas con el de una distribución normal. Ambos describen la forma de la muestra.",
          "vars": [
            {
              "sym": "\\gamma",
              "desc": "coeficiente de asimetría muestral"
            },
            {
              "sym": "\\kappa",
              "desc": "exceso de curtosis (restado el 3 de la normal)"
            },
            {
              "sym": "x_i",
              "desc": "$i$-ésima observación"
            },
            {
              "sym": "\\bar x",
              "desc": "media muestral"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "s",
              "desc": "desvío estándar muestral"
            }
          ],
          "note": "$\\gamma>0$ cola a derecha; $\\kappa>0$ colas pesadas (vs normal)"
        },
        {
          "label": "Datos agrupados",
          "kind": "method",
          "tex": "\\begin{aligned} \\bar x_{Ag} &= \\frac{\\sum_i x_i f_i}{n} \\\\ s_{Ag} &= \\sqrt{\\frac{\\sum_i (x_i-\\bar x_{Ag})^2 f_i}{n-1}} \\end{aligned}",
          "body": "Adaptación de la media y el desvío cuando los datos se presentan en una tabla de frecuencias por clases: cada marca de clase se pondera por su frecuencia para aproximar centro y dispersión sin disponer de los valores individuales.",
          "vars": [
            {
              "sym": "\\bar x_{Ag}",
              "desc": "media de datos agrupados"
            },
            {
              "sym": "s_{Ag}",
              "desc": "desvío estándar de datos agrupados"
            },
            {
              "sym": "x_i",
              "desc": "marca de clase del intervalo $i$"
            },
            {
              "sym": "f_i",
              "desc": "frecuencia (absoluta) de la clase $i$"
            },
            {
              "sym": "n",
              "desc": "tamaño total de la muestra, $n=\\sum_i f_i$"
            }
          ],
          "cond": "$x_i$ marca de clase, $f_i$ frecuencia; cuartiles/mediana por interpolación lineal sobre acumuladas"
        },
        {
          "label": "Boxplot: cercas de Tukey",
          "kind": "theorem",
          "tex": "\\begin{aligned} L_W &= q_1-1.5\\,\\mathrm{IQR} \\\\ U_W &= q_3+1.5\\,\\mathrm{IQR} \\end{aligned}",
          "body": "Límites que definen las cercas (whiskers) de un diagrama de caja: las observaciones que caen fuera del intervalo $[L_W,U_W]$ se marcan como valores atípicos (outliers).",
          "vars": [
            {
              "sym": "L_W",
              "desc": "cerca inferior (límite inferior)"
            },
            {
              "sym": "U_W",
              "desc": "cerca superior (límite superior)"
            },
            {
              "sym": "q_1",
              "desc": "primer cuartil (percentil 25)"
            },
            {
              "sym": "q_3",
              "desc": "tercer cuartil (percentil 75)"
            },
            {
              "sym": "\\mathrm{IQR}",
              "desc": "rango intercuartílico, $\\mathrm{IQR}=q_3-q_1$"
            }
          ],
          "note": "Outlier: fuera de $[L_W,U_W]$. En una normal, $P(\\text{outlier})\\approx0.7\\%$"
        }
      ]
    },
    {
      "title": "Probabilidad y conteo",
      "hint": "Axiomas, Laplace, condicional, independencia, Bayes, combinatoria",
      "unit": "2",
      "entries": [
        {
          "label": "Axiomas de Kolmogorov",
          "kind": "theorem",
          "tex": "\\begin{aligned}P(A) &\\ge 0 \\\\ P(S) &= 1 \\\\ P\\!\\Big(\\bigcup_i E_i\\Big) &= \\sum_i P(E_i)\\end{aligned}",
          "body": "Los tres axiomas que fundan toda la teoría de probabilidad: la probabilidad de un evento es no negativa, la del espacio muestral completo es $1$, y la probabilidad de una unión de eventos disjuntos es la suma de sus probabilidades. Todo el resto del andamiaje (complemento, unión general, condicional) se deduce de acá.",
          "vars": [
            {
              "sym": "P(A)",
              "desc": "probabilidad del evento $A$"
            },
            {
              "sym": "S",
              "desc": "espacio muestral (conjunto de todos los resultados posibles)"
            },
            {
              "sym": "E_i",
              "desc": "eventos de la familia que se une, indexados por $i$"
            },
            {
              "sym": "\\bigcup_i E_i",
              "desc": "unión de todos los eventos $E_i$"
            }
          ],
          "cond": "El 3º vale para $E_i$ mutuamente excluyentes ($\\sigma$-aditividad)"
        },
        {
          "label": "Complemento y unión",
          "kind": "formula",
          "tex": "\\begin{aligned}P(A^c) &= 1-P(A) \\\\ P(A\\cup B) &= P(A)+P(B)-P(A\\cap B)\\end{aligned}",
          "body": "Dos reglas básicas para operar con probabilidades. La regla del complemento expresa que la probabilidad de que $A$ no ocurra es lo que le falta a $1$. La regla de inclusión-exclusión calcula la probabilidad de la unión restando la intersección, que de otro modo quedaría contada dos veces.",
          "vars": [
            {
              "sym": "A^c",
              "desc": "complemento de $A$: el evento de que $A$ no ocurra"
            },
            {
              "sym": "P(A)",
              "desc": "probabilidad del evento $A$"
            },
            {
              "sym": "A\\cup B",
              "desc": "unión: ocurre $A$, $B$ o ambos"
            },
            {
              "sym": "A\\cap B",
              "desc": "intersección: ocurren $A$ y $B$ a la vez"
            }
          ]
        },
        {
          "label": "Regla de Laplace",
          "kind": "formula",
          "tex": "P(A)=\\frac{|A|}{|S|}=\\frac{\\text{favorables}}{\\text{posibles}}",
          "body": "Calcula la probabilidad de un evento como el cociente entre la cantidad de casos favorables y la cantidad total de casos posibles. Es el puente entre conteo combinatorio y probabilidad, pero solo es válida cuando todos los resultados son igualmente probables.",
          "vars": [
            {
              "sym": "P(A)",
              "desc": "probabilidad del evento $A$"
            },
            {
              "sym": "|A|",
              "desc": "cantidad de resultados favorables a $A$ (cardinal de $A$)"
            },
            {
              "sym": "|S|",
              "desc": "cantidad total de resultados posibles (cardinal de $S$)"
            }
          ],
          "cond": "Solo si $S$ finito y resultados equiprobables"
        },
        {
          "label": "De Morgan",
          "kind": "theorem",
          "tex": "\\begin{aligned}\\overline{A\\cup B} &= \\overline A\\cap\\overline B \\\\ \\overline{A\\cap B} &= \\overline A\\cup\\overline B\\end{aligned}",
          "body": "Las leyes de De Morgan relacionan complemento, unión e intersección: la negación de una unión es la intersección de las negaciones, y la negación de una intersección es la unión de las negaciones. Sirven para reescribir eventos del tipo «ninguno» o «no todos» en una forma más cómoda de calcular.",
          "vars": [
            {
              "sym": "\\overline{A\\cup B}",
              "desc": "complemento de la unión: no ocurre ni $A$ ni $B$"
            },
            {
              "sym": "\\overline A",
              "desc": "complemento de $A$: el evento de que $A$ no ocurra"
            },
            {
              "sym": "\\overline{A\\cap B}",
              "desc": "complemento de la intersección: no ocurren $A$ y $B$ a la vez"
            }
          ],
          "note": "Para 'ninguno' conviene pasar a $1-P(\\bigcup A_i)$"
        },
        {
          "label": "Probabilidad condicional y multiplicación",
          "kind": "formula",
          "tex": "\\begin{aligned}P(D\\mid C) &= \\frac{P(D\\cap C)}{P(C)} \\\\ P(D\\cap C) &= P(D\\mid C)\\,P(C)\\end{aligned}",
          "body": "La probabilidad condicional mide la probabilidad de $D$ sabiendo que ya ocurrió $C$, reescalando el espacio muestral a $C$. Despejando se obtiene la regla de la multiplicación, que descompone la probabilidad de una intersección como producto de una condicional por su condición.",
          "vars": [
            {
              "sym": "P(D\\mid C)",
              "desc": "probabilidad de $D$ dado que ocurrió $C$"
            },
            {
              "sym": "P(D\\cap C)",
              "desc": "probabilidad de que ocurran $D$ y $C$ simultáneamente"
            },
            {
              "sym": "P(C)",
              "desc": "probabilidad del evento condicionante $C$"
            }
          ],
          "cond": "Requiere $P(C)\\neq 0$"
        },
        {
          "label": "Independencia",
          "kind": "def",
          "tex": "P(A\\cap B)=P(A)\\,P(B)\\iff P(B\\mid A)=P(B)",
          "body": "Dos eventos son independientes cuando la ocurrencia de uno no altera la probabilidad del otro. Esto equivale a que la probabilidad de la intersección factorice como el producto de las probabilidades, o a que la condicional coincida con la incondicional.",
          "vars": [
            {
              "sym": "P(A\\cap B)",
              "desc": "probabilidad de que ocurran $A$ y $B$ a la vez"
            },
            {
              "sym": "P(A)",
              "desc": "probabilidad del evento $A$"
            },
            {
              "sym": "P(B)",
              "desc": "probabilidad del evento $B$"
            },
            {
              "sym": "P(B\\mid A)",
              "desc": "probabilidad de $B$ dado que ocurrió $A$"
            }
          ],
          "note": "M.e. (con prob.+) NO es independiente. Serie→producto; paralelo→$1-\\prod q_i$"
        },
        {
          "label": "Probabilidad total y Bayes",
          "kind": "theorem",
          "tex": "\\begin{aligned}P(B) &= \\sum_k P(B\\mid A_k)P(A_k) \\\\ P(A_i\\mid B) &= \\frac{P(B\\mid A_i)P(A_i)}{\\sum_k P(B\\mid A_k)P(A_k)}\\end{aligned}",
          "body": "El teorema de la probabilidad total arma $P(B)$ promediando sus probabilidades condicionales a cada parte de una partición, ponderadas por la probabilidad de cada parte. El teorema de Bayes invierte el condicionamiento: a partir de las verosimilitudes $P(B\\mid A_k)$ y las previas $P(A_k)$ obtiene la probabilidad posterior $P(A_i\\mid B)$.",
          "vars": [
            {
              "sym": "P(B)",
              "desc": "probabilidad total del evento $B$"
            },
            {
              "sym": "A_k",
              "desc": "eventos de la partición de $S$, indexados por $k$"
            },
            {
              "sym": "P(B\\mid A_k)",
              "desc": "verosimilitud: probabilidad de $B$ dado $A_k$"
            },
            {
              "sym": "P(A_k)",
              "desc": "probabilidad previa de la parte $A_k$"
            },
            {
              "sym": "P(A_i\\mid B)",
              "desc": "probabilidad posterior de $A_i$ una vez observado $B$"
            }
          ],
          "cond": "$\\{A_k\\}$ partición de $S$"
        },
        {
          "label": "Las 5 formas de contar",
          "kind": "method",
          "tex": "\\begin{aligned}&\\text{orden, sin rep: }\\tfrac{n!}{(n-r)!}\\\\&\\text{sin orden, sin rep: }\\tbinom{n}{r}\\\\&\\text{con rep: }n^r\\ \\text{(orden)},\\ \\tbinom{n+r-1}{r}\\ \\text{(sin)}\\end{aligned}",
          "body": "Resume cómo contar la cantidad de formas de elegir $r$ elementos de un conjunto de $n$, según importe o no el orden y se permita o no repetir. Es la matriz que ordena variaciones, combinaciones, arreglos con repetición y combinaciones con repetición.",
          "vars": [
            {
              "sym": "n",
              "desc": "cantidad de elementos disponibles"
            },
            {
              "sym": "r",
              "desc": "cantidad de elementos que se eligen"
            },
            {
              "sym": "\\tfrac{n!}{(n-r)!}",
              "desc": "variaciones: selecciones ordenadas sin repetición"
            },
            {
              "sym": "\\tbinom{n}{r}",
              "desc": "combinaciones: selecciones sin orden ni repetición"
            },
            {
              "sym": "n^r",
              "desc": "selecciones ordenadas con repetición permitida"
            },
            {
              "sym": "\\tbinom{n+r-1}{r}",
              "desc": "combinaciones con repetición (sin orden)"
            }
          ],
          "note": "Permutaciones: $n!$. Preguntá: ¿importa orden? ¿hay repetición?"
        },
        {
          "label": "Identidades combinatorias",
          "kind": "theorem",
          "tex": "\\begin{aligned}\\tbinom{n}{r} &= \\tbinom{n}{n-r} \\\\ \\sum_k\\tbinom{n}{k} &= 2^n \\\\ (x+y)^n &= \\sum_k\\tbinom{n}{k}x^k y^{n-k}\\end{aligned}",
          "body": "Tres identidades centrales del coeficiente binomial: la simetría (elegir $r$ equivale a descartar $n-r$), la suma de toda la fila de Pascal (igual a $2^n$, el total de subconjuntos), y el teorema del binomio de Newton, que expande una potencia de un binomio.",
          "vars": [
            {
              "sym": "\\tbinom{n}{r}",
              "desc": "coeficiente binomial: formas de elegir $r$ de $n$"
            },
            {
              "sym": "n",
              "desc": "cantidad total de elementos"
            },
            {
              "sym": "r",
              "desc": "cantidad de elementos elegidos"
            },
            {
              "sym": "k",
              "desc": "índice de suma, recorre $k=0,\\dots,n$"
            },
            {
              "sym": "2^n",
              "desc": "cantidad total de subconjuntos de un conjunto de $n$ elementos"
            },
            {
              "sym": "(x+y)^n",
              "desc": "potencia $n$-ésima del binomio que se expande"
            },
            {
              "sym": "x",
              "desc": "primer término del binomio"
            },
            {
              "sym": "y",
              "desc": "segundo término del binomio"
            }
          ]
        }
      ]
    },
    {
      "title": "Variable aleatoria discreta",
      "hint": "PMF, FDA, esperanza, varianza, momentos, FGM",
      "unit": "3",
      "entries": [
        {
          "label": "PMF y FDA",
          "kind": "def",
          "tex": "\\begin{aligned} p_X(k) &= P(X=k) \\\\ \\sum_k p_X(k) &= 1 \\\\ F_X(k) &= P(X\\le k) \\end{aligned}",
          "body": "La función de probabilidad puntual (PMF) $p_X$ asigna a cada valor posible $k$ la probabilidad de que la variable lo tome, y sus valores suman 1. La función de distribución acumulada (FDA) $F_X$ acumula esa probabilidad hasta $k$ inclusive.",
          "vars": [
            {
              "sym": "X",
              "desc": "variable aleatoria discreta"
            },
            {
              "sym": "k",
              "desc": "valor posible de $X$ (recorre el soporte)"
            },
            {
              "sym": "p_X(k)",
              "desc": "probabilidad puntual de que $X=k$"
            },
            {
              "sym": "F_X(k)",
              "desc": "probabilidad acumulada $P(X\\le k)$"
            }
          ],
          "note": "FDA escalonada, no decreciente, continua a derecha"
        },
        {
          "label": "Esperanza y E[g(X)]",
          "kind": "formula",
          "tex": "\\begin{aligned} E[X] &= \\sum_k k\\,p_X(k) \\\\ E[g(X)] &= \\sum_k g(k)\\,p_X(k) \\end{aligned}",
          "body": "La esperanza es el promedio ponderado de los valores de $X$ usando sus probabilidades. La segunda fórmula (regla del estadístico inconsciente) calcula la esperanza de una transformación $g(X)$ sin necesidad de hallar antes la distribución de $g(X)$.",
          "vars": [
            {
              "sym": "E[X]",
              "desc": "esperanza (valor medio) de $X$"
            },
            {
              "sym": "k",
              "desc": "valor posible de $X$ sobre el que se suma"
            },
            {
              "sym": "p_X(k)",
              "desc": "probabilidad puntual de que $X=k$"
            },
            {
              "sym": "g(X)",
              "desc": "transformación de la variable $X$"
            },
            {
              "sym": "E[g(X)]",
              "desc": "esperanza de la variable transformada $g(X)$"
            }
          ]
        },
        {
          "label": "Varianza (fórmula de cálculo)",
          "kind": "formula",
          "tex": "\\begin{aligned} V(X) &= E[X^2]-\\big(E[X]\\big)^2 \\\\ \\sigma_X &= \\sqrt{V(X)} \\end{aligned}",
          "body": "La varianza mide la dispersión de $X$ respecto de su media; esta forma de cálculo la obtiene como el segundo momento menos el cuadrado de la esperanza. El desvío estándar $\\sigma_X$ es su raíz cuadrada y queda en las mismas unidades que $X$.",
          "vars": [
            {
              "sym": "V(X)",
              "desc": "varianza de $X$"
            },
            {
              "sym": "E[X^2]",
              "desc": "segundo momento (esperanza de $X^2$)"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza de $X$"
            },
            {
              "sym": "\\sigma_X",
              "desc": "desvío estándar de $X$"
            }
          ]
        },
        {
          "label": "Linealidad de E y propiedades de V",
          "kind": "theorem",
          "tex": "\\begin{aligned} E[aX+bY+c] &= aE[X]+bE[Y]+c \\\\ V(aX+c) &= a^2V(X) \\end{aligned}",
          "body": "La esperanza es lineal: siempre distribuye sobre sumas y escala con las constantes, sin requerir independencia. La varianza no es lineal: las constantes aditivas no la afectan y los factores multiplicativos entran al cuadrado.",
          "vars": [
            {
              "sym": "X",
              "desc": "variable aleatoria"
            },
            {
              "sym": "Y",
              "desc": "variable aleatoria"
            },
            {
              "sym": "a",
              "desc": "constante (factor de escala)"
            },
            {
              "sym": "b",
              "desc": "constante (factor de escala)"
            },
            {
              "sym": "c",
              "desc": "constante aditiva"
            },
            {
              "sym": "E[\\cdot]",
              "desc": "operador esperanza"
            },
            {
              "sym": "V(\\cdot)",
              "desc": "operador varianza"
            }
          ],
          "note": "$E[XY]\\neq E[X]E[Y]$ y $V(X+Y)\\neq V(X)+V(Y)$ salvo independencia"
        },
        {
          "label": "Función generadora de momentos",
          "kind": "formula",
          "tex": "\\begin{aligned} M_X(t) &= E[e^{tX}] \\\\ E[X^k] &= M_X^{(k)}(0) \\end{aligned}",
          "body": "La función generadora de momentos (FGM) codifica todos los momentos de $X$ en una sola función de $t$. Derivándola $k$ veces y evaluando en $t=0$ se obtiene el momento de orden $k$.",
          "vars": [
            {
              "sym": "M_X(t)",
              "desc": "función generadora de momentos de $X$"
            },
            {
              "sym": "t",
              "desc": "variable auxiliar de la FGM"
            },
            {
              "sym": "e^{tX}",
              "desc": "transformación exponencial cuya esperanza define la FGM"
            },
            {
              "sym": "E[X^k]",
              "desc": "momento de orden $k$ de $X$"
            },
            {
              "sym": "M_X^{(k)}(0)",
              "desc": "derivada $k$-ésima de la FGM evaluada en $t=0$"
            }
          ],
          "note": "Caracteriza la distribución; $M_{X+Y}=M_X M_Y$ si independientes"
        },
        {
          "label": "Teoría de la decisión (valor esperado)",
          "kind": "method",
          "tex": "k^*=\\arg\\max_k E[G_k(X)]",
          "body": "Criterio de decisión bajo incertidumbre: ante varias alternativas indexadas por $k$, se elige la que maximiza la ganancia esperada. Es la regla central de problemas tipo newsvendor.",
          "vars": [
            {
              "sym": "k",
              "desc": "alternativa o parámetro de decisión"
            },
            {
              "sym": "k^*",
              "desc": "alternativa óptima (la que maximiza la ganancia esperada)"
            },
            {
              "sym": "G_k(X)",
              "desc": "ganancia asociada a la decisión $k$ dado el azar $X$"
            },
            {
              "sym": "E[G_k(X)]",
              "desc": "ganancia esperada bajo la decisión $k$"
            }
          ],
          "cond": "Elegí el parámetro $k$ que maximiza la ganancia esperada (newsvendor)"
        }
      ]
    },
    {
      "title": "Distribuciones discretas",
      "hint": "Soporte, PMF, E, V, FGM. Convención cátedra: geométrica/binneg cuentan FRACASOS",
      "unit": "3",
      "entries": [
        {
          "label": "Bernoulli(p)",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(1) &= p \\\\ p_X(0) &= q \\\\ E[X] &= p \\\\ V(X) &= pq \\\\ M_X(t) &= q + pe^t \\end{aligned}",
          "body": "Modela un único ensayo con dos resultados posibles, éxito (valor $1$) o fracaso (valor $0$). Es el ladrillo básico del que se construyen la binomial y la geométrica.",
          "vars": [
            {
              "sym": "p",
              "desc": "Probabilidad de éxito en el ensayo"
            },
            {
              "sym": "q",
              "desc": "Probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "p_X(k)",
              "desc": "Función de probabilidad puntual (PMF) evaluada en $k$"
            },
            {
              "sym": "E[X]",
              "desc": "Esperanza (valor medio) de $X$"
            },
            {
              "sym": "V(X)",
              "desc": "Varianza de $X$"
            },
            {
              "sym": "M_X(t)",
              "desc": "Función generadora de momentos (FGM)"
            }
          ],
          "cond": "Un ensayo éxito/fracaso. $R_X=\\{0,1\\}$"
        },
        {
          "label": "Binomial(n,p)",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(k) &= \\tbinom{n}{k} p^k q^{n-k} \\\\ E[X] &= np \\\\ V(X) &= npq \\\\ M_X(t) &= (q + pe^t)^n \\end{aligned}",
          "body": "Cuenta la cantidad de éxitos en $n$ ensayos de Bernoulli independientes e idénticamente distribuidos. Equivale a la suma de $n$ Bernoulli($p$).",
          "vars": [
            {
              "sym": "n",
              "desc": "Número de ensayos independientes"
            },
            {
              "sym": "k",
              "desc": "Número de éxitos observados, $k=0,1,\\dots,n$"
            },
            {
              "sym": "p",
              "desc": "Probabilidad de éxito en cada ensayo"
            },
            {
              "sym": "q",
              "desc": "Probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "\\tbinom{n}{k}",
              "desc": "Coeficiente binomial: maneras de elegir $k$ éxitos entre $n$ posiciones"
            },
            {
              "sym": "E[X]",
              "desc": "Esperanza de $X$"
            },
            {
              "sym": "V(X)",
              "desc": "Varianza de $X$"
            },
            {
              "sym": "M_X(t)",
              "desc": "Función generadora de momentos (FGM)"
            }
          ],
          "cond": "Nº de éxitos en $n$ ensayos i.i.d. (con reposición / pob. grande)"
        },
        {
          "label": "Geométrica(p) — nº de fracasos",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(k) &= q^k p, \\quad k \\ge 0 \\\\ E[X] &= \\tfrac{q}{p} \\\\ V(X) &= \\tfrac{q}{p^2} \\\\ M_X(t) &= \\tfrac{p}{1 - qe^t} \\end{aligned}",
          "body": "Cuenta la cantidad de fracasos previos al primer éxito en una sucesión de ensayos de Bernoulli i.i.d. (convención de la cátedra: se cuentan fracasos, no ensayos).",
          "vars": [
            {
              "sym": "k",
              "desc": "Número de fracasos antes del primer éxito, $k\\ge 0$"
            },
            {
              "sym": "p",
              "desc": "Probabilidad de éxito en cada ensayo"
            },
            {
              "sym": "q",
              "desc": "Probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "E[X]",
              "desc": "Esperanza de $X$"
            },
            {
              "sym": "V(X)",
              "desc": "Varianza de $X$"
            },
            {
              "sym": "M_X(t)",
              "desc": "Función generadora de momentos (FGM)"
            }
          ],
          "note": "Versión 'nº de ensayos' $Y=X+1$: $p_Y(k)=q^{k-1}p$, $E=1/p$. No mezclar"
        },
        {
          "label": "Falta de memoria (geométrica)",
          "kind": "theorem",
          "tex": "\\begin{aligned} P(X \\ge L + \\Delta \\mid X \\ge L) &= P(X \\ge \\Delta) \\\\ P(X \\ge m) &= q^m \\end{aligned}",
          "body": "Propiedad de falta de memoria: habiendo esperado ya $L$ fracasos, la probabilidad de esperar $\\Delta$ más no depende de lo ya transcurrido. La geométrica es la única distribución discreta que la cumple.",
          "vars": [
            {
              "sym": "L",
              "desc": "Cantidad ya acumulada (umbral condicionante)"
            },
            {
              "sym": "\\Delta",
              "desc": "Espera adicional considerada"
            },
            {
              "sym": "m",
              "desc": "Umbral genérico de la cola, $m\\ge 0$"
            },
            {
              "sym": "q",
              "desc": "Probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "P(X \\ge m)",
              "desc": "Probabilidad de la cola superior (al menos $m$ fracasos)"
            }
          ],
          "cond": "Única discreta sin memoria"
        },
        {
          "label": "Binomial negativa(r,p) — fracasos",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(k) &= \\tbinom{k+r-1}{k} q^k p^r \\\\ E[X] &= \\tfrac{rq}{p} \\\\ V(X) &= \\tfrac{rq}{p^2} \\end{aligned}",
          "body": "Cuenta la cantidad de fracasos hasta alcanzar el $r$-ésimo éxito en ensayos de Bernoulli i.i.d. Equivale a la suma de $r$ geométricas independientes.",
          "vars": [
            {
              "sym": "r",
              "desc": "Número de éxitos a alcanzar"
            },
            {
              "sym": "k",
              "desc": "Número de fracasos acumulados, $k\\ge 0$"
            },
            {
              "sym": "p",
              "desc": "Probabilidad de éxito en cada ensayo"
            },
            {
              "sym": "q",
              "desc": "Probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "\\tbinom{k+r-1}{k}",
              "desc": "Coeficiente binomial: arreglos de los $k$ fracasos antes del último éxito"
            },
            {
              "sym": "E[X]",
              "desc": "Esperanza de $X$"
            },
            {
              "sym": "V(X)",
              "desc": "Varianza de $X$"
            }
          ],
          "cond": "Fracasos hasta el $r$-ésimo éxito. Suma de $r$ geométricas; $M=(\\tfrac{p}{1-qe^t})^r$"
        },
        {
          "label": "Hipergeométrica(N,M,n)",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(k) &= \\frac{\\binom{M}{k}\\binom{N-M}{n-k}}{\\binom{N}{n}} \\\\ E[X] &= n\\tfrac{M}{N} \\\\ V(X) &= npq\\,\\tfrac{N-n}{N-1} \\end{aligned}",
          "body": "Cuenta los éxitos al extraer una muestra de tamaño $n$ SIN reposición de una población finita con $M$ elementos marcados como éxito. A diferencia de la binomial, los ensayos no son independientes.",
          "vars": [
            {
              "sym": "N",
              "desc": "Tamaño total de la población"
            },
            {
              "sym": "M",
              "desc": "Cantidad de éxitos en la población"
            },
            {
              "sym": "n",
              "desc": "Tamaño de la muestra extraída"
            },
            {
              "sym": "k",
              "desc": "Número de éxitos en la muestra"
            },
            {
              "sym": "p",
              "desc": "Proporción de éxitos en la población, $p=M/N$"
            },
            {
              "sym": "q",
              "desc": "Proporción de fracasos, $q=1-p$"
            },
            {
              "sym": "\\binom{M}{k}",
              "desc": "Maneras de elegir $k$ éxitos entre los $M$ disponibles"
            },
            {
              "sym": "\\binom{N-M}{n-k}",
              "desc": "Maneras de elegir $n-k$ fracasos entre los $N-M$ disponibles"
            },
            {
              "sym": "\\binom{N}{n}",
              "desc": "Maneras totales de elegir la muestra de tamaño $n$"
            },
            {
              "sym": "\\tfrac{N-n}{N-1}",
              "desc": "Factor de corrección por población finita"
            },
            {
              "sym": "E[X]",
              "desc": "Esperanza de $X$"
            },
            {
              "sym": "V(X)",
              "desc": "Varianza de $X$"
            }
          ],
          "cond": "Muestreo SIN reposición; $p=M/N$. Factor corrección $\\tfrac{N-n}{N-1}$"
        },
        {
          "label": "Poisson(λ)",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(k) &= \\frac{\\lambda^k}{k!} e^{-\\lambda} \\\\ E[X] = V(X) &= \\lambda \\\\ M_X(t) &= e^{\\lambda(e^t - 1)} \\end{aligned}",
          "body": "Modela el conteo de eventos raros que ocurren a una tasa media $\\lambda$ en un intervalo fijo de tiempo o espacio. Su sello distintivo es que media y varianza coinciden.",
          "vars": [
            {
              "sym": "\\lambda",
              "desc": "Tasa media de ocurrencias (esperanza), $\\lambda>0$"
            },
            {
              "sym": "k",
              "desc": "Número de eventos observados, $k=0,1,2,\\dots$"
            },
            {
              "sym": "k!",
              "desc": "Factorial de $k$"
            },
            {
              "sym": "E[X]",
              "desc": "Esperanza de $X$, igual a $\\lambda$"
            },
            {
              "sym": "V(X)",
              "desc": "Varianza de $X$, igual a $\\lambda$"
            },
            {
              "sym": "M_X(t)",
              "desc": "Función generadora de momentos (FGM)"
            }
          ],
          "note": "Sello: media = varianza. Conteo de eventos raros a tasa $\\lambda$"
        },
        {
          "label": "Aproximación Poisson de la binomial",
          "kind": "theorem",
          "tex": "\\mathrm{Bin}(n,p) \\approx \\mathrm{Poisson}(\\lambda = np)",
          "body": "Cuando el número de ensayos es grande y la probabilidad de éxito es chica, la binomial se aproxima por una Poisson con tasa $\\lambda=np$, simplificando el cálculo de probabilidades.",
          "vars": [
            {
              "sym": "n",
              "desc": "Número de ensayos de la binomial (grande)"
            },
            {
              "sym": "p",
              "desc": "Probabilidad de éxito (chica)"
            },
            {
              "sym": "\\lambda",
              "desc": "Tasa de la Poisson aproximante, $\\lambda=np$"
            }
          ],
          "cond": "$n$ grande, $p$ chico"
        }
      ]
    },
    {
      "title": "Variable aleatoria continua",
      "hint": "FDA, densidad, E/V por integral, tasa de fallas",
      "unit": "4",
      "entries": [
        {
          "label": "FDA y densidad",
          "kind": "formula",
          "tex": "\\begin{aligned} F_X(x) &= \\int_{-\\infty}^x f_X(y)\\,dy \\\\ f_X(x) &= F_X'(x) \\\\ \\int_{\\mathbb R} f_X &= 1 \\end{aligned}",
          "body": "Relación entre la función de distribución acumulada (FDA) y la densidad de una variable aleatoria continua. La FDA es la integral de la densidad hasta $x$; recíprocamente, la densidad se recupera derivando la FDA. Además, la densidad debe integrar $1$ sobre toda la recta real para ser una densidad válida.",
          "vars": [
            {
              "sym": "F_X(x)",
              "desc": "función de distribución acumulada de $X$, igual a $P(X\\le x)$"
            },
            {
              "sym": "f_X",
              "desc": "función de densidad de probabilidad de $X$"
            },
            {
              "sym": "x",
              "desc": "punto donde se evalúa la FDA o la densidad"
            },
            {
              "sym": "y",
              "desc": "variable de integración"
            },
            {
              "sym": "\\mathbb R",
              "desc": "recta real, dominio total de integración"
            }
          ],
          "note": "v.a.c. $\\iff F_X$ continua $\\iff P(X=\\alpha)=0\\ \\forall\\alpha$"
        },
        {
          "label": "Probabilidad, esperanza, momentos",
          "kind": "formula",
          "tex": "\\begin{aligned} P(a<X\\le b) &= F_X(b)-F_X(a) \\\\ E[X] &= \\int x\\, f_X\\,dx \\\\ E[X^k] &= \\int x^k f_X\\,dx \\end{aligned}",
          "body": "Cálculo de probabilidades de intervalos y de los momentos de una variable aleatoria continua. La probabilidad de que $X$ caiga en $(a,b]$ es la diferencia de la FDA en los extremos. La esperanza y, en general, el momento de orden $k$ se obtienen integrando $x^k$ ponderado por la densidad.",
          "vars": [
            {
              "sym": "P(a<X\\le b)",
              "desc": "probabilidad de que $X$ caiga en el intervalo $(a,b]$"
            },
            {
              "sym": "a",
              "desc": "extremo inferior del intervalo"
            },
            {
              "sym": "b",
              "desc": "extremo superior del intervalo"
            },
            {
              "sym": "F_X",
              "desc": "función de distribución acumulada de $X$"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza (valor medio) de $X$"
            },
            {
              "sym": "E[X^k]",
              "desc": "momento de orden $k$ respecto del origen"
            },
            {
              "sym": "k",
              "desc": "orden del momento, entero positivo"
            },
            {
              "sym": "f_X",
              "desc": "función de densidad de probabilidad de $X$"
            }
          ]
        },
        {
          "label": "Varianza y esperanza por la cola",
          "kind": "formula",
          "tex": "\\begin{aligned} V(X) &= E[X^2]-(E[X])^2 \\\\ E[X] &= \\int_0^\\infty P(X>x)\\,dx \\quad (X\\ge 0) \\end{aligned}",
          "body": "Dos identidades útiles para variables continuas. La varianza es el segundo momento menos el cuadrado de la esperanza. Para variables no negativas, la esperanza también puede calcularse integrando la función de supervivencia $P(X>x)$ (fórmula de la cola), evitando trabajar con la densidad.",
          "vars": [
            {
              "sym": "V(X)",
              "desc": "varianza de $X$, dispersión cuadrática media respecto de $E[X]$"
            },
            {
              "sym": "E[X^2]",
              "desc": "segundo momento respecto del origen"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza (valor medio) de $X$"
            },
            {
              "sym": "P(X>x)",
              "desc": "función de supervivencia, probabilidad de superar el nivel $x$"
            },
            {
              "sym": "x",
              "desc": "variable de integración (nivel)"
            },
            {
              "sym": "X\\ge 0",
              "desc": "condición: la identidad de la cola vale para variables no negativas"
            }
          ]
        },
        {
          "label": "Tasa de fallas (hazard)",
          "kind": "formula",
          "tex": "\\begin{aligned} R(t) &= \\frac{f_T(t)}{1-F_T(t)} = -\\frac{d}{dt}\\ln S(t) \\\\ S(t) &= e^{-\\int_0^t R} \\end{aligned}",
          "body": "Tasa de fallas (hazard rate) de un tiempo de vida $T$: mide la propensión instantánea a fallar en el instante $t$ dado que se sobrevivió hasta $t$. Equivale a la densidad dividida por la supervivencia, o a menos la derivada del logaritmo de la función de supervivencia. A partir de $R$ se reconstruye la supervivencia por exponenciación de su integral acumulada.",
          "vars": [
            {
              "sym": "R(t)",
              "desc": "tasa de fallas instantánea en el tiempo $t$"
            },
            {
              "sym": "t",
              "desc": "tiempo (instante de evaluación)"
            },
            {
              "sym": "f_T(t)",
              "desc": "densidad del tiempo de vida $T$"
            },
            {
              "sym": "F_T(t)",
              "desc": "FDA de $T$; $1-F_T(t)$ es la probabilidad de sobrevivir más allá de $t$"
            },
            {
              "sym": "S(t)",
              "desc": "función de supervivencia, $S(t)=1-F_T(t)=P(T>t)$"
            }
          ],
          "note": "$R$ constante $\\iff$ exponencial; creciente=desgaste, decreciente=mortalidad infantil"
        }
      ]
    },
    {
      "title": "Distribuciones continuas",
      "hint": "Densidad, FDA, E, V. La cátedra parametriza la normal por el DESVÍO σ",
      "unit": "4",
      "entries": [
        {
          "label": "Uniforme(a,b)",
          "kind": "formula",
          "tex": "\\begin{aligned} f_X(x) &= \\tfrac{1}{b-a} \\quad (a<x<b) \\\\ F_X(x) &= \\tfrac{x-a}{b-a} \\\\ E[X] &= \\tfrac{a+b}{2} \\\\ V(X) &= \\tfrac{(b-a)^2}{12} \\end{aligned}",
          "body": "Modela una variable que toma cualquier valor del intervalo $(a,b)$ con igual probabilidad: la densidad es constante. La FDA crece linealmente, y tanto la esperanza (el punto medio) como la varianza dependen sólo de la amplitud del intervalo.",
          "vars": [
            {
              "sym": "f_X(x)",
              "desc": "densidad de probabilidad, constante sobre el intervalo"
            },
            {
              "sym": "F_X(x)",
              "desc": "función de distribución acumulada (FDA)"
            },
            {
              "sym": "a",
              "desc": "extremo inferior del soporte"
            },
            {
              "sym": "b",
              "desc": "extremo superior del soporte ($b>a$)"
            },
            {
              "sym": "x",
              "desc": "valor de la variable, con $a<x<b$"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza, igual al punto medio del intervalo"
            },
            {
              "sym": "V(X)",
              "desc": "varianza, función de la amplitud $b-a$"
            }
          ]
        },
        {
          "label": "Exponencial(λ)",
          "kind": "formula",
          "tex": "\\begin{aligned} f_X(x) &= \\lambda e^{-\\lambda x} \\\\ F_X(x) &= 1-e^{-\\lambda x} \\\\ P(X>x) &= e^{-\\lambda x} \\\\ E[X] &= \\tfrac1\\lambda \\\\ V(X) &= \\tfrac1{\\lambda^2} \\end{aligned}",
          "body": "Describe el tiempo de espera hasta el primer evento de un proceso de Poisson de tasa $\\lambda$. La probabilidad de supervivencia decae exponencialmente, y tanto la esperanza como el desvío valen $1/\\lambda$.",
          "vars": [
            {
              "sym": "f_X(x)",
              "desc": "densidad de probabilidad en $x\\ge 0$"
            },
            {
              "sym": "F_X(x)",
              "desc": "función de distribución acumulada (FDA)"
            },
            {
              "sym": "P(X>x)",
              "desc": "función de supervivencia: probabilidad de esperar más de $x$"
            },
            {
              "sym": "\\lambda",
              "desc": "tasa de ocurrencia (eventos por unidad de tiempo), $\\lambda>0$"
            },
            {
              "sym": "x",
              "desc": "tiempo o magnitud de espera, $x\\ge 0$"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza, igual a $1/\\lambda$"
            },
            {
              "sym": "V(X)",
              "desc": "varianza, igual a $1/\\lambda^2$"
            }
          ],
          "note": "Falta de memoria; única con tasa de fallas constante. $M=\\tfrac{\\lambda}{\\lambda-t}$"
        },
        {
          "label": "Normal N(μ,σ)",
          "kind": "formula",
          "tex": "\\begin{aligned} f_X(x) &= \\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\,e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}} \\\\ E[X] &= \\mu \\\\ V(X) &= \\sigma^2 \\\\ M(t) &= e^{\\mu t+\\frac12\\sigma^2 t^2} \\end{aligned}",
          "body": "La distribución normal o gaussiana: densidad en forma de campana simétrica alrededor de $\\mu$. Centra su masa en la esperanza $\\mu$ y su dispersión la fija el desvío $\\sigma$. Es el límite del Teorema Central del Límite.",
          "vars": [
            {
              "sym": "f_X(x)",
              "desc": "densidad de probabilidad (campana de Gauss)"
            },
            {
              "sym": "\\mu",
              "desc": "media o esperanza; centro de la campana"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar; controla el ancho ($\\sigma>0$)"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza"
            },
            {
              "sym": "x",
              "desc": "valor de la variable, $x\\in\\mathbb{R}$"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza, igual a $\\mu$"
            },
            {
              "sym": "V(X)",
              "desc": "varianza, igual a $\\sigma^2$"
            },
            {
              "sym": "M(t)",
              "desc": "función generadora de momentos"
            },
            {
              "sym": "t",
              "desc": "argumento de la función generadora de momentos"
            }
          ],
          "note": "FDA sin forma cerrada: usar $\\Phi$. 2º parámetro = desvío"
        },
        {
          "label": "Falta de memoria (exponencial)",
          "kind": "theorem",
          "tex": "P(X>x+\\Delta\\mid X>x)=P(X>\\Delta)=e^{-\\lambda\\Delta}",
          "body": "Propiedad característica de la exponencial: el tiempo ya transcurrido no altera la distribución del tiempo restante. Condicionar en que el evento aún no ocurrió devuelve la misma distribución exponencial desde cero.",
          "vars": [
            {
              "sym": "P(X>x+\\Delta\\mid X>x)",
              "desc": "probabilidad de esperar $\\Delta$ más, sabiendo que ya se esperó $x$"
            },
            {
              "sym": "x",
              "desc": "tiempo ya transcurrido sin que ocurra el evento"
            },
            {
              "sym": "\\Delta",
              "desc": "tiempo adicional de espera"
            },
            {
              "sym": "\\lambda",
              "desc": "tasa de ocurrencia de la exponencial"
            }
          ]
        },
        {
          "label": "Weibull(λ,b)",
          "kind": "formula",
          "tex": "\\begin{aligned} F_X(x) &= 1-e^{-(\\lambda x)^b} \\\\ R(x) &= \\lambda b(\\lambda x)^{b-1} \\\\ E[X] &= \\tfrac1\\lambda\\,\\Gamma\\!\\left(1+\\tfrac1b\\right) \\end{aligned}",
          "body": "Generaliza la exponencial permitiendo una tasa de fallas variable en el tiempo, según el parámetro de forma $b$. Es el modelo estándar en confiabilidad para describir desgaste o mortalidad infantil.",
          "vars": [
            {
              "sym": "F_X(x)",
              "desc": "función de distribución acumulada (FDA)"
            },
            {
              "sym": "R(x)",
              "desc": "tasa de fallas (hazard), función de $x$"
            },
            {
              "sym": "\\lambda",
              "desc": "parámetro de escala, $\\lambda>0$"
            },
            {
              "sym": "b",
              "desc": "parámetro de forma, $b>0$"
            },
            {
              "sym": "x",
              "desc": "tiempo o magnitud, $x\\ge 0$"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza"
            },
            {
              "sym": "\\Gamma",
              "desc": "función gamma, $\\Gamma(z)=\\int_0^\\infty t^{z-1}e^{-t}\\,dt$"
            }
          ],
          "cond": "$b=1$ recupera exponencial; $b>1$ desgaste, $b<1$ mortalidad infantil"
        },
        {
          "label": "Gamma/Erlang(n,λ)",
          "kind": "formula",
          "tex": "\\begin{aligned} f(x) &= \\frac{\\lambda^n x^{n-1}e^{-\\lambda x}}{(n-1)!} \\\\ E[X] &= \\tfrac{n}{\\lambda} \\\\ V(X) &= \\tfrac{n}{\\lambda^2} \\end{aligned}",
          "body": "Modela el tiempo de espera hasta la $n$-ésima ocurrencia de un proceso de Poisson de tasa $\\lambda$. Equivale a la suma de $n$ exponenciales independientes de tasa $\\lambda$, por lo que su esperanza y varianza son $n$ veces las de la exponencial.",
          "vars": [
            {
              "sym": "f(x)",
              "desc": "densidad de probabilidad en $x\\ge 0$"
            },
            {
              "sym": "n",
              "desc": "número de ocurrencias (parámetro de forma), entero $\\ge 1$"
            },
            {
              "sym": "\\lambda",
              "desc": "tasa de ocurrencia del proceso de Poisson, $\\lambda>0$"
            },
            {
              "sym": "x",
              "desc": "tiempo de espera, $x\\ge 0$"
            },
            {
              "sym": "(n-1)!",
              "desc": "factorial que normaliza la densidad"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza, igual a $n/\\lambda$"
            },
            {
              "sym": "V(X)",
              "desc": "varianza, igual a $n/\\lambda^2$"
            }
          ],
          "cond": "Suma de $n$ exp($\\lambda$); tiempo de la $n$-ésima ocurrencia de Poisson"
        },
        {
          "label": "P(T_n>t) de Erlang vía Poisson",
          "kind": "method",
          "tex": "P(T_n>t)=\\sum_{j=0}^{n-1}\\frac{(\\lambda t)^j}{j!}\\,e^{-\\lambda t}",
          "body": "Calcula la probabilidad de que la $n$-ésima ocurrencia tarde más que $t$ sin integrar la densidad Gamma: se traduce al conteo de Poisson, ya que esperar más de $t$ equivale a haber observado a lo sumo $n-1$ eventos hasta el instante $t$.",
          "vars": [
            {
              "sym": "P(T_n>t)",
              "desc": "probabilidad de que la $n$-ésima ocurrencia supere el tiempo $t$"
            },
            {
              "sym": "T_n",
              "desc": "tiempo de la $n$-ésima ocurrencia (variable Erlang)"
            },
            {
              "sym": "t",
              "desc": "tiempo límite considerado, $t\\ge 0$"
            },
            {
              "sym": "j",
              "desc": "índice de suma sobre el conteo de eventos, $j=0,\\dots,n-1$"
            },
            {
              "sym": "n",
              "desc": "orden de la ocurrencia buscada"
            },
            {
              "sym": "\\lambda",
              "desc": "tasa del proceso de Poisson"
            }
          ],
          "cond": "Dualidad $\\{T_n>t\\}\\Leftrightarrow\\{N(t)\\le n-1\\}$, $N(t)\\sim\\mathrm{Poisson}(\\lambda t)$"
        },
        {
          "label": "Mínimo de exponenciales (serie)",
          "kind": "example",
          "tex": "\\min(X_1,\\dots,X_n)\\sim\\mathrm{Exp}\\!\\Big(\\textstyle\\sum_i\\lambda_i\\Big)",
          "body": "El mínimo de exponenciales independientes vuelve a ser exponencial, con tasa igual a la suma de las tasas. Modela un sistema en serie que falla apenas falla el primero de sus componentes: las tasas de falla se acumulan.",
          "vars": [
            {
              "sym": "\\min(X_1,\\dots,X_n)",
              "desc": "el menor de los $n$ tiempos de falla"
            },
            {
              "sym": "X_i",
              "desc": "tiempo de falla del componente $i$, exponencial de tasa $\\lambda_i$"
            },
            {
              "sym": "\\lambda_i",
              "desc": "tasa de falla del componente $i$"
            },
            {
              "sym": "\\sum_i\\lambda_i",
              "desc": "tasa resultante del mínimo: suma de las tasas individuales"
            },
            {
              "sym": "n",
              "desc": "cantidad de componentes en serie"
            }
          ],
          "note": "Las tasas se suman. Suma (no mínimo) de exp i.i.d. = Gamma"
        }
      ]
    },
    {
      "title": "Normal estándar y tabla Z",
      "hint": "Estandarizar para resolver cualquier normal con una sola tabla",
      "unit": "4",
      "entries": [
        {
          "label": "Estandarización",
          "kind": "method",
          "tex": "\\begin{aligned} Z &= \\frac{X-\\mu}{\\sigma} \\sim N(0,1) \\\\ F_X(x) &= \\Phi\\!\\Big(\\frac{x-\\mu}{\\sigma}\\Big) \\end{aligned}",
          "body": "Toda variable normal $X\\sim N(\\mu,\\sigma^2)$ se convierte en la normal estándar $Z$ restándole la media y dividiendo por el desvío. Así una única tabla (la de $\\Phi$) resuelve cualquier normal: la acumulada de $X$ en $x$ es la acumulada estándar evaluada en el valor estandarizado.",
          "vars": [
            {
              "sym": "Z",
              "desc": "variable normal estándar, $N(0,1)$"
            },
            {
              "sym": "X",
              "desc": "variable normal original, $N(\\mu,\\sigma^2)$"
            },
            {
              "sym": "\\mu",
              "desc": "media (centro) de $X$"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar de $X$"
            },
            {
              "sym": "F_X(x)",
              "desc": "función de distribución acumulada de $X$ en $x$"
            },
            {
              "sym": "\\Phi",
              "desc": "función de distribución acumulada de la normal estándar"
            }
          ],
          "note": "$z$ = a cuántos desvíos del centro está $x$"
        },
        {
          "label": "Simetría de Φ y fractiles",
          "kind": "formula",
          "tex": "\\begin{aligned} \\Phi(-z) &= 1-\\Phi(z) \\\\ z_{1-\\alpha} &= -z_\\alpha \\\\ x_\\alpha &= \\mu+\\sigma z_\\alpha \\end{aligned}",
          "body": "La densidad normal estándar es simétrica respecto de $0$, de modo que la acumulada en $-z$ es el complemento de la acumulada en $z$. Esa simetría se traslada a los fractiles ($z_{1-\\alpha}=-z_\\alpha$) y permite recuperar el fractil de cualquier normal desestandarizando el fractil estándar.",
          "vars": [
            {
              "sym": "\\Phi",
              "desc": "función de distribución acumulada de la normal estándar"
            },
            {
              "sym": "z",
              "desc": "valor estandarizado genérico"
            },
            {
              "sym": "z_\\alpha",
              "desc": "fractil de orden $\\alpha$ de la normal estándar"
            },
            {
              "sym": "\\alpha",
              "desc": "nivel de probabilidad acumulada, $0<\\alpha<1$"
            },
            {
              "sym": "x_\\alpha",
              "desc": "fractil de orden $\\alpha$ de la normal original $X$"
            },
            {
              "sym": "\\mu",
              "desc": "media de $X$"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar de $X$"
            }
          ]
        },
        {
          "label": "Probabilidades útiles",
          "kind": "formula",
          "tex": "\\begin{aligned} P(a<X\\le b) &= \\Phi\\!\\big(\\tfrac{b-\\mu}{\\sigma}\\big)-\\Phi\\!\\big(\\tfrac{a-\\mu}{\\sigma}\\big) \\\\ P(\\mu\\pm k\\sigma) &= 2\\Phi(k)-1 \\end{aligned}",
          "body": "La probabilidad de que una normal caiga en un intervalo es la diferencia de acumuladas estándar en los extremos estandarizados. El caso particular de un intervalo simétrico de $k$ desvíos alrededor de la media se reduce a $2\\Phi(k)-1$.",
          "vars": [
            {
              "sym": "P(a<X\\le b)",
              "desc": "probabilidad de que $X$ caiga en $(a,b]$"
            },
            {
              "sym": "X",
              "desc": "variable normal $N(\\mu,\\sigma^2)$"
            },
            {
              "sym": "a",
              "desc": "extremo inferior del intervalo"
            },
            {
              "sym": "b",
              "desc": "extremo superior del intervalo"
            },
            {
              "sym": "\\mu",
              "desc": "media de $X$"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar de $X$"
            },
            {
              "sym": "\\Phi",
              "desc": "acumulada de la normal estándar"
            },
            {
              "sym": "k",
              "desc": "cantidad de desvíos del intervalo simétrico $\\mu\\pm k\\sigma$"
            }
          ]
        },
        {
          "label": "Regla empírica y fractiles clave",
          "kind": "example",
          "tex": "\\begin{aligned} 1\\sigma &: 0.683 \\\\ 2\\sigma &: 0.954 \\\\ 3\\sigma &: 0.997 \\\\ z_{.90} &= 1.28 \\\\ z_{.95} &= 1.64 \\\\ z_{.975} &= 1.96 \\\\ z_{.99} &= 2.33 \\end{aligned}",
          "body": "Regla empírica (68–95–99,7): proporción de la población dentro de $\\pm1$, $\\pm2$ y $\\pm3$ desvíos de la media. Debajo, los fractiles estándar de uso más frecuente en intervalos de confianza y tests de hipótesis.",
          "vars": [
            {
              "sym": "\\sigma",
              "desc": "desvío estándar; $1\\sigma,2\\sigma,3\\sigma$ son los radios del intervalo centrado en $\\mu$"
            },
            {
              "sym": "z_{.90}",
              "desc": "fractil $0.90$ de la normal estándar"
            },
            {
              "sym": "z_{.95}",
              "desc": "fractil $0.95$ de la normal estándar"
            },
            {
              "sym": "z_{.975}",
              "desc": "fractil $0.975$ de la normal estándar (cola del $2.5\\%$)"
            },
            {
              "sym": "z_{.99}",
              "desc": "fractil $0.99$ de la normal estándar"
            }
          ]
        },
        {
          "label": "Curtosis de referencia",
          "kind": "example",
          "tex": "\\begin{aligned} \\kappa_{N} &= 0 \\\\ \\kappa_{\\text{Unif}} &= -\\tfrac65 \\\\ \\kappa_{\\text{Exp}} &= +6 \\end{aligned}",
          "body": "Curtosis (en exceso, relativa a la normal) de tres distribuciones de referencia. La normal sirve de patrón con $\\kappa=0$; valores negativos indican colas más livianas (uniforme) y positivos, colas más pesadas (exponencial).",
          "vars": [
            {
              "sym": "\\kappa_{N}",
              "desc": "curtosis en exceso de la normal (referencia, $=0$)"
            },
            {
              "sym": "\\kappa_{\\text{Unif}}",
              "desc": "curtosis en exceso de la uniforme"
            },
            {
              "sym": "\\kappa_{\\text{Exp}}",
              "desc": "curtosis en exceso de la exponencial"
            }
          ]
        }
      ]
    },
    {
      "title": "Bidimensionales, función de v.a.",
      "hint": "Conjunta, marginales, condicionales, covarianza, transformaciones",
      "unit": "5",
      "entries": [
        {
          "label": "Conjunta y marginales",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(x) &= \\sum_y p_{X,Y}(x,y) \\\\ f_X(x) &= \\int f_{X,Y}(x,y)\\,dy \\\\ E[h(X,Y)] &= \\sum_x\\sum_y h(x,y)\\,p_{X,Y}(x,y) \\\\ E[h(X,Y)] &= \\iint h(x,y)\\,f_{X,Y}(x,y)\\,dx\\,dy \\end{aligned}",
          "body": "A partir de la distribución conjunta de $(X,Y)$ se recuperan las marginales sumando (caso discreto) o integrando (caso continuo) sobre la otra variable. La esperanza de una función $h(X,Y)$ se calcula directamente con la conjunta, sin necesidad de hallar la distribución de $h$.",
          "vars": [
            {
              "sym": "p_{X,Y}(x,y)",
              "desc": "función de probabilidad conjunta (caso discreto)"
            },
            {
              "sym": "f_{X,Y}(x,y)",
              "desc": "densidad conjunta (caso continuo)"
            },
            {
              "sym": "p_X(x)",
              "desc": "función de probabilidad marginal de $X$"
            },
            {
              "sym": "f_X(x)",
              "desc": "densidad marginal de $X$"
            },
            {
              "sym": "h(X,Y)",
              "desc": "función de las dos variables cuya esperanza se busca"
            },
            {
              "sym": "E[h(X,Y)]",
              "desc": "valor esperado de $h$ bajo la conjunta"
            }
          ],
          "note": "Las marginales NO determinan la conjunta"
        },
        {
          "label": "Condicional e independencia",
          "kind": "formula",
          "tex": "\\begin{aligned} f_{X\\mid Y}(x\\mid y) &= \\frac{f_{X,Y}(x,y)}{f_Y(y)} \\\\ X \\perp Y &\\iff f_{X,Y}(x,y) = f_X(x)\\,f_Y(y) \\end{aligned}",
          "body": "La densidad condicional describe la distribución de $X$ una vez fijado el valor de $Y$, normalizando la conjunta por la marginal de $Y$. La independencia equivale exactamente a que la conjunta factorice como producto de las marginales para todo $(x,y)$.",
          "vars": [
            {
              "sym": "f_{X\\mid Y}(x\\mid y)",
              "desc": "densidad condicional de $X$ dado $Y=y$"
            },
            {
              "sym": "f_{X,Y}(x,y)",
              "desc": "densidad conjunta de $(X,Y)$"
            },
            {
              "sym": "f_Y(y)",
              "desc": "densidad marginal de $Y$ (con $f_Y(y)>0$)"
            },
            {
              "sym": "f_X(x)",
              "desc": "densidad marginal de $X$"
            }
          ]
        },
        {
          "label": "Covarianza y correlación",
          "kind": "formula",
          "tex": "\\begin{aligned} \\mathrm{Cov}(X,Y) &= E[XY]-\\mu_X\\mu_Y \\\\ \\rho &= \\frac{\\mathrm{Cov}(X,Y)}{\\sigma_X\\sigma_Y}\\in[-1,1] \\end{aligned}",
          "body": "La covarianza mide la tendencia conjunta de $X$ e $Y$ a desviarse en el mismo sentido respecto de sus medias; al normalizarla por las desviaciones estándar se obtiene el coeficiente de correlación $\\rho$, una medida adimensional del grado de asociación lineal acotada entre $-1$ y $1$.",
          "vars": [
            {
              "sym": "\\mathrm{Cov}(X,Y)",
              "desc": "covarianza entre $X$ e $Y$"
            },
            {
              "sym": "E[XY]",
              "desc": "esperanza del producto de las variables"
            },
            {
              "sym": "\\mu_X",
              "desc": "media de $X$, $\\mu_X=E[X]$"
            },
            {
              "sym": "\\mu_Y",
              "desc": "media de $Y$, $\\mu_Y=E[Y]$"
            },
            {
              "sym": "\\rho",
              "desc": "coeficiente de correlación lineal"
            },
            {
              "sym": "\\sigma_X",
              "desc": "desviación estándar de $X$"
            },
            {
              "sym": "\\sigma_Y",
              "desc": "desviación estándar de $Y$"
            }
          ],
          "note": "Indep $\\Rightarrow$ Cov$=0$; recíproco FALSO (salvo conjuntamente normal)"
        },
        {
          "label": "Varianza de combinación lineal",
          "kind": "formula",
          "tex": "V(aX+bY)=a^2V(X)+2ab\\,\\mathrm{Cov}(X,Y)+b^2V(Y)",
          "body": "Varianza de una combinación lineal de dos variables: además de las varianzas individuales ponderadas por los cuadrados de los coeficientes, aparece un término cruzado con la covarianza. Si $X$ e $Y$ son independientes, ese término se anula y las varianzas simplemente se suman.",
          "vars": [
            {
              "sym": "V(aX+bY)",
              "desc": "varianza de la combinación lineal"
            },
            {
              "sym": "a",
              "desc": "coeficiente que pondera a $X$"
            },
            {
              "sym": "b",
              "desc": "coeficiente que pondera a $Y$"
            },
            {
              "sym": "V(X)",
              "desc": "varianza de $X$"
            },
            {
              "sym": "V(Y)",
              "desc": "varianza de $Y$"
            },
            {
              "sym": "\\mathrm{Cov}(X,Y)",
              "desc": "covarianza entre $X$ e $Y$"
            }
          ]
        },
        {
          "label": "ρ = ±1 ⟺ relación lineal",
          "kind": "theorem",
          "tex": "\\rho=\\pm1\\iff Y=aX+b\\ \\text{(prob. 1)},\\ \\mathrm{sign}(a)=\\mathrm{sign}(\\rho)",
          "body": "El coeficiente de correlación alcanza sus valores extremos $\\pm1$ si y solo si existe una relación lineal exacta (con probabilidad $1$) entre las variables. El signo de $\\rho$ coincide con el de la pendiente: positivo si crecen juntas, negativo si una decrece cuando la otra crece.",
          "vars": [
            {
              "sym": "\\rho",
              "desc": "coeficiente de correlación lineal"
            },
            {
              "sym": "Y=aX+b",
              "desc": "relación afín exacta entre las variables"
            },
            {
              "sym": "a",
              "desc": "pendiente de la recta (su signo determina el de $\\rho$)"
            },
            {
              "sym": "b",
              "desc": "ordenada al origen de la recta"
            },
            {
              "sym": "\\mathrm{sign}(a)",
              "desc": "signo de la pendiente $a$"
            }
          ]
        },
        {
          "label": "Distribución de Y=g(X) (método FDA)",
          "kind": "method",
          "tex": "\\begin{aligned} F_Y(y) &= P(g(X)\\le y)=F_X(\\dots) \\\\ f_Y(y) &= F_Y'(y) \\end{aligned}",
          "body": "Método de la función de distribución acumulada para hallar la ley de una transformación $Y=g(X)$: se expresa el suceso $\\{g(X)\\le y\\}$ en términos de $X$ para escribir $F_Y$ a partir de $F_X$, y luego se deriva para obtener la densidad de $Y$.",
          "vars": [
            {
              "sym": "F_Y(y)",
              "desc": "función de distribución acumulada de $Y$"
            },
            {
              "sym": "g(X)",
              "desc": "transformación aplicada a $X$ que define $Y$"
            },
            {
              "sym": "F_X",
              "desc": "función de distribución acumulada de $X$"
            },
            {
              "sym": "f_Y(y)",
              "desc": "densidad de $Y$, obtenida derivando $F_Y$"
            }
          ],
          "cond": "Reescribir $\\{g(X)\\le y\\}$ como evento sobre $X$; sumar ramas si $g$ no inyectiva"
        },
        {
          "label": "Transformación afín Y=aX+b",
          "kind": "formula",
          "tex": "\\begin{aligned} \\mu_Y &= a\\mu_X+b \\\\ \\sigma_Y &= |a|\\,\\sigma_X \\\\ X\\sim N &\\Rightarrow Y\\sim N\\!\\left(a\\mu_X+b,\\ |a|\\sigma_X\\right) \\end{aligned}",
          "body": "Efecto de una transformación afín $Y=aX+b$ sobre los momentos: la media se transforma de la misma manera que la variable, mientras que la desviación estándar solo se escala por $|a|$ (el corrimiento $b$ no la afecta). Si $X$ es normal, $Y$ también lo es, con esos nuevos parámetros.",
          "vars": [
            {
              "sym": "\\mu_Y",
              "desc": "media de $Y$"
            },
            {
              "sym": "a",
              "desc": "factor de escala de la transformación"
            },
            {
              "sym": "\\mu_X",
              "desc": "media de $X$"
            },
            {
              "sym": "b",
              "desc": "corrimiento (traslación) de la transformación"
            },
            {
              "sym": "\\sigma_Y",
              "desc": "desviación estándar de $Y$"
            },
            {
              "sym": "\\sigma_X",
              "desc": "desviación estándar de $X$"
            },
            {
              "sym": "N",
              "desc": "distribución normal (parametrizada por media y desvío)"
            }
          ]
        },
        {
          "label": "Transformada inversa (simular)",
          "kind": "method",
          "tex": "U\\sim\\mathrm{Unif}(0,1)\\Rightarrow Y=F_X^{-1}(U)\\ \\text{tiene FDA }F_X",
          "body": "Método de la transformada inversa para simular una variable con FDA $F_X$: si $U$ es uniforme en $(0,1)$, entonces $Y=F_X^{-1}(U)$ tiene exactamente la distribución deseada. Es la base para generar muestras a partir de números aleatorios uniformes.",
          "vars": [
            {
              "sym": "U",
              "desc": "variable uniforme en el intervalo $(0,1)$"
            },
            {
              "sym": "\\mathrm{Unif}(0,1)",
              "desc": "distribución uniforme estándar"
            },
            {
              "sym": "Y",
              "desc": "variable simulada con la distribución objetivo"
            },
            {
              "sym": "F_X^{-1}",
              "desc": "inversa de la función de distribución acumulada de $X$"
            },
            {
              "sym": "F_X",
              "desc": "función de distribución acumulada objetivo"
            }
          ],
          "note": "Ej: $\\mathrm{Exp}(\\lambda)$ → $Y=-\\tfrac1\\lambda\\ln(1-U)$"
        }
      ]
    },
    {
      "title": "Esperanza condicional y mezcla",
      "hint": "Promediar por etapas: leyes total; varianza con cuidado",
      "unit": "5",
      "entries": [
        {
          "label": "Esperanza y varianza condicional",
          "kind": "def",
          "tex": "\\begin{aligned} E[X\\mid Y=y] &= \\sum_x x\\,p_{X\\mid Y} \\\\ V(X\\mid Y) &= E[X^2\\mid Y]-\\big(E[X\\mid Y]\\big)^2 \\end{aligned}",
          "body": "Dado el valor observado de la variable condicionante, la esperanza condicional es el promedio de $X$ restringido a ese evento, calculado con la distribución condicional. La varianza condicional mide la dispersión de $X$ en ese mismo contexto y se obtiene como el segundo momento condicional menos el cuadrado de la media condicional.",
          "vars": [
            {
              "sym": "E[X\\mid Y=y]",
              "desc": "esperanza de $X$ dado que $Y$ toma el valor $y$"
            },
            {
              "sym": "X",
              "desc": "variable aleatoria sobre la que se promedia"
            },
            {
              "sym": "Y",
              "desc": "variable aleatoria condicionante"
            },
            {
              "sym": "p_{X\\mid Y}",
              "desc": "función de probabilidad condicional de $X$ dado $Y$"
            },
            {
              "sym": "V(X\\mid Y)",
              "desc": "varianza condicional de $X$ dado $Y$"
            },
            {
              "sym": "E[X^2\\mid Y]",
              "desc": "segundo momento condicional de $X$ dado $Y$"
            }
          ],
          "note": "$E[X\\mid Y]$ es una v.a. (función de $Y$)"
        },
        {
          "label": "Ley de esperanza total",
          "kind": "theorem",
          "tex": "\\begin{aligned} E[X] &= E\\big[E[X\\mid Y]\\big] \\\\ &= \\sum_y E[X\\mid Y=y]\\,p_Y(y) \\end{aligned}",
          "body": "La esperanza incondicional de $X$ se recupera promediando las esperanzas condicionales según la distribución de la variable condicionante. Permite calcular $E[X]$ por etapas: primero se promedia dentro de cada escenario de $Y$ y luego se ponderan esos resultados por la probabilidad de cada escenario.",
          "vars": [
            {
              "sym": "E[X]",
              "desc": "esperanza incondicional de $X$"
            },
            {
              "sym": "E\\big[E[X\\mid Y]\\big]",
              "desc": "esperanza de la v.a. esperanza condicional"
            },
            {
              "sym": "E[X\\mid Y=y]",
              "desc": "esperanza de $X$ dado $Y=y$"
            },
            {
              "sym": "p_Y(y)",
              "desc": "función de probabilidad de $Y$ evaluada en $y$"
            }
          ]
        },
        {
          "label": "Ley de varianza total",
          "kind": "theorem",
          "tex": "V(X)=E\\big[V(X\\mid Y)\\big]+V\\big(E[X\\mid Y]\\big)",
          "body": "La varianza total de $X$ se descompone en dos aportes: la dispersión promedio dentro de cada nivel de $Y$ (variabilidad intragrupo) más la dispersión de las medias condicionales entre niveles de $Y$ (variabilidad intergrupo). Ambos términos son necesarios para reconstruir la varianza completa.",
          "vars": [
            {
              "sym": "V(X)",
              "desc": "varianza incondicional de $X$"
            },
            {
              "sym": "E\\big[V(X\\mid Y)\\big]",
              "desc": "varianza esperada dentro de cada nivel de $Y$ (intra)"
            },
            {
              "sym": "V\\big(E[X\\mid Y]\\big)",
              "desc": "varianza de las medias condicionales entre niveles de $Y$ (inter)"
            }
          ],
          "note": "intra + inter. ERROR común: olvidar el 2º término"
        },
        {
          "label": "Mezcla (continua | discreta)",
          "kind": "formula",
          "tex": "\\begin{aligned} f_X(x) &= \\sum_k f_{X\\mid M}(x\\mid k)\\,P(M=k) \\\\ E[g(X)] &= \\sum_k E[g(X)\\mid M{=}k]\\,P(M{=}k) \\end{aligned}",
          "body": "Cuando $X$ es continua pero su comportamiento depende de un componente discreto $M$, la densidad de $X$ es una combinación convexa de las densidades condicionales, ponderadas por la probabilidad de cada componente. De igual modo, la esperanza de cualquier función $g(X)$ se obtiene promediando las esperanzas condicionales por componente.",
          "vars": [
            {
              "sym": "f_X(x)",
              "desc": "densidad de la variable mezclada $X$"
            },
            {
              "sym": "f_{X\\mid M}(x\\mid k)",
              "desc": "densidad de $X$ dado el componente $M=k$"
            },
            {
              "sym": "M",
              "desc": "variable discreta que selecciona el componente de la mezcla"
            },
            {
              "sym": "k",
              "desc": "índice del componente, recorre los valores posibles de $M$"
            },
            {
              "sym": "P(M=k)",
              "desc": "peso (probabilidad) del componente $k$"
            },
            {
              "sym": "E[g(X)]",
              "desc": "esperanza de la función $g$ aplicada a $X$"
            },
            {
              "sym": "g(X)",
              "desc": "función de $X$ cuya esperanza se calcula"
            },
            {
              "sym": "E[g(X)\\mid M{=}k]",
              "desc": "esperanza de $g(X)$ condicionada al componente $k$"
            }
          ],
          "note": "Densidad = combinación convexa. La varianza NO se mezcla linealmente"
        },
        {
          "label": "Mezcla inversa (discreta | continua)",
          "kind": "formula",
          "tex": "p_X(x)=\\int p_{X\\mid Y}(x\\mid y)\\,f_Y(y)\\,dy",
          "body": "Cuando $X$ es discreta y su parámetro varía según una variable continua $Y$, la función de probabilidad de $X$ se obtiene integrando la probabilidad condicional contra la densidad de $Y$. Es el análogo continuo de la mezcla: se ponderan las distribuciones condicionales por la densidad del parámetro que las gobierna.",
          "vars": [
            {
              "sym": "p_X(x)",
              "desc": "función de probabilidad de la variable mezclada $X$"
            },
            {
              "sym": "p_{X\\mid Y}(x\\mid y)",
              "desc": "función de probabilidad de $X$ dado $Y=y$"
            },
            {
              "sym": "f_Y(y)",
              "desc": "densidad de la variable continua condicionante $Y$"
            },
            {
              "sym": "y",
              "desc": "variable de integración sobre el soporte de $Y$"
            }
          ],
          "cond": "Sobredispersión: $V(X)=E[V(X\\mid Y)]+V(E[X\\mid Y])$"
        }
      ]
    },
    {
      "title": "Procesos estocásticos",
      "hint": "Bernoulli (discreto) ↔ Poisson (continuo); cadenas de Markov; caminata",
      "unit": "6",
      "entries": [
        {
          "label": "Proceso de Bernoulli",
          "kind": "def",
          "tex": "\\begin{aligned} N(k) &\\sim \\mathrm{Bin}(k,p) \\\\ \\tau_i &\\sim \\mathrm{Geo}(p) \\\\ T_k &\\sim \\mathrm{BinNeg}(k,p) \\end{aligned}",
          "body": "Modelo de tiempo discreto con un ensayo de Bernoulli en cada paso. Describe las tres preguntas típicas: cuántos éxitos hay en los primeros $k$ pasos ($N(k)$, binomial), cuántos pasos median entre dos éxitos consecutivos ($\\tau_i$, geométrica) y cuántos pasos hacen falta para acumular $k$ éxitos ($T_k$, binomial negativa).",
          "vars": [
            {
              "sym": "N(k)",
              "desc": "cantidad de éxitos en los primeros $k$ pasos"
            },
            {
              "sym": "k",
              "desc": "número de pasos (o de éxitos según el contexto)"
            },
            {
              "sym": "p",
              "desc": "probabilidad de éxito en cada paso"
            },
            {
              "sym": "\\tau_i",
              "desc": "tiempo (en pasos) entre el éxito $i-1$ y el $i$"
            },
            {
              "sym": "T_k",
              "desc": "número de pasos hasta acumular el $k$-ésimo éxito"
            }
          ],
          "cond": "Tiempo discreto, incrementos indep. y estacionarios, $\\le1$ evento por paso"
        },
        {
          "label": "Proceso de Poisson(λ)",
          "kind": "def",
          "tex": "\\begin{aligned} N(t) &\\sim \\mathrm{Poisson}(\\lambda t) \\\\ \\tau_i &\\sim \\mathrm{Exp}(\\lambda) \\\\ T_k &\\sim \\mathrm{Erlang}(k,\\lambda) \\end{aligned}",
          "body": "Análogo en tiempo continuo del proceso de Bernoulli, con tasa de ocurrencia $\\lambda$ por unidad de tiempo. La cantidad de eventos en un intervalo de longitud $t$ es Poisson, el tiempo entre eventos consecutivos es exponencial (sin memoria) y el tiempo hasta el $k$-ésimo evento es Erlang (suma de $k$ exponenciales).",
          "vars": [
            {
              "sym": "N(t)",
              "desc": "cantidad de eventos en el intervalo $[0,t]$"
            },
            {
              "sym": "\\lambda",
              "desc": "tasa media de ocurrencia por unidad de tiempo"
            },
            {
              "sym": "t",
              "desc": "longitud del intervalo de tiempo observado"
            },
            {
              "sym": "\\tau_i",
              "desc": "tiempo entre el evento $i-1$ y el $i$"
            },
            {
              "sym": "T_k",
              "desc": "tiempo de espera hasta el $k$-ésimo evento"
            },
            {
              "sym": "k",
              "desc": "número de eventos considerado en $T_k$"
            }
          ],
          "cond": "$P(N(t{+}h){-}N(t)=1)=\\lambda h+o(h)$; sin eventos simultáneos"
        },
        {
          "label": "Dualidad conteo ↔ tiempo",
          "kind": "theorem",
          "tex": "\\begin{aligned} T_k < t &\\iff N(t) \\ge k \\\\ E[N(t)] = V[N(t)] &= \\lambda t \\end{aligned}",
          "body": "Equivalencia que conecta la pregunta sobre el tiempo de espera con la pregunta sobre el conteo: que el $k$-ésimo evento ocurra antes de $t$ equivale a que ya haya al menos $k$ eventos en $[0,t]$. Permite traducir un problema de Erlang/exponencial en uno de Poisson. Además, en el proceso de Poisson la media y la varianza del conteo coinciden y valen $\\lambda t$.",
          "vars": [
            {
              "sym": "T_k",
              "desc": "tiempo de espera hasta el $k$-ésimo evento"
            },
            {
              "sym": "t",
              "desc": "instante de tiempo de referencia"
            },
            {
              "sym": "N(t)",
              "desc": "cantidad de eventos en $[0,t]$"
            },
            {
              "sym": "k",
              "desc": "número de eventos umbral"
            },
            {
              "sym": "E[N(t)]",
              "desc": "valor esperado del conteo en $[0,t]$"
            },
            {
              "sym": "V[N(t)]",
              "desc": "varianza del conteo en $[0,t]$"
            },
            {
              "sym": "\\lambda",
              "desc": "tasa media de ocurrencia por unidad de tiempo"
            }
          ],
          "note": "Pasa de preguntas de tiempo (Erlang/Exp) a conteos (Poisson)"
        },
        {
          "label": "Cadena de Markov: evolución",
          "kind": "formula",
          "tex": "\\begin{aligned} \\vec p(n+1) &= \\vec p(n)\\,\\mathbb{P} \\\\ \\vec p(n) &= \\vec p(0)\\,\\mathbb{P}^n \\end{aligned}",
          "body": "Regla de evolución de una cadena de Markov homogénea: el vector de distribución de probabilidad sobre los estados en el paso siguiente se obtiene multiplicando el actual por la matriz de transición. Iterando $n$ veces, la distribución en el paso $n$ es la inicial multiplicada por la $n$-ésima potencia de la matriz.",
          "vars": [
            {
              "sym": "\\vec p(n)",
              "desc": "vector fila de probabilidades sobre los estados en el paso $n$"
            },
            {
              "sym": "n",
              "desc": "índice de paso temporal (discreto)"
            },
            {
              "sym": "\\mathbb{P}",
              "desc": "matriz de transición; $\\mathbb P_{ij}$ es la probabilidad de pasar de $i$ a $j$"
            },
            {
              "sym": "\\vec p(0)",
              "desc": "vector de distribución inicial sobre los estados"
            },
            {
              "sym": "\\mathbb{P}^n",
              "desc": "$n$-ésima potencia de la matriz de transición (transiciones en $n$ pasos)"
            }
          ],
          "cond": "$\\mathbb P$ estocástica (cada fila suma 1); homogénea"
        },
        {
          "label": "Distribución estacionaria",
          "kind": "formula",
          "tex": "\\begin{aligned} \\vec\\pi &= \\vec\\pi\\,\\mathbb{P} \\\\ \\textstyle\\sum_j \\pi_j &= 1 \\end{aligned}",
          "body": "Distribución que permanece invariante bajo la dinámica de la cadena: al multiplicarla por la matriz de transición se obtiene ella misma. Es el autovector izquierdo asociado al autovalor 1, normalizado para que sus componentes sumen 1. Si la cadena es regular, esta distribución existe, es única y es el límite de $\\vec p(n)$ independientemente del estado inicial.",
          "vars": [
            {
              "sym": "\\vec\\pi",
              "desc": "vector fila de la distribución estacionaria"
            },
            {
              "sym": "\\mathbb{P}",
              "desc": "matriz de transición de la cadena"
            },
            {
              "sym": "\\pi_j",
              "desc": "probabilidad estacionaria de estar en el estado $j$"
            },
            {
              "sym": "j",
              "desc": "índice que recorre todos los estados de la cadena"
            }
          ],
          "cond": "Autovector izq. de autovalor 1; existe y es límite si $\\mathbb P$ regular ($\\mathbb P^n>0$)"
        },
        {
          "label": "Tipos de estados",
          "kind": "def",
          "body": "Recurrente ($r_i=1$) vs transitorio; absorbente ($p_{ii}=1$); irreducible (todos se comunican); periódico/aperiódico. Tiempo hasta absorción: $\\mathbb M=(\\mathbb I-\\mathbb Q)^{-1}$."
        },
        {
          "label": "Caminata aleatoria",
          "kind": "formula",
          "tex": "\\begin{aligned} X_n &= \\sum_{k=1}^n Y_k, \\quad Y_k \\in \\{\\pm1\\} \\\\ E[X_n] &= n(2p-1) \\\\ V[X_n] &= 4npq \\end{aligned}",
          "body": "Posición tras $n$ pasos de una partícula que en cada paso avanza $+1$ con probabilidad $p$ o retrocede $-1$ con probabilidad $q=1-p$, sumando incrementos independientes. La media de la posición crece linealmente con el sesgo $2p-1$ y la varianza crece linealmente con $n$.",
          "vars": [
            {
              "sym": "X_n",
              "desc": "posición de la caminata después de $n$ pasos"
            },
            {
              "sym": "n",
              "desc": "número de pasos dados"
            },
            {
              "sym": "Y_k",
              "desc": "incremento del paso $k$, vale $+1$ o $-1$"
            },
            {
              "sym": "k",
              "desc": "índice de paso, de $1$ a $n$"
            },
            {
              "sym": "p",
              "desc": "probabilidad de avanzar ($+1$)"
            },
            {
              "sym": "q",
              "desc": "probabilidad de retroceder ($-1$), con $q=1-p$"
            },
            {
              "sym": "E[X_n]",
              "desc": "valor esperado de la posición tras $n$ pasos"
            },
            {
              "sym": "V[X_n]",
              "desc": "varianza de la posición tras $n$ pasos"
            }
          ],
          "note": "Simétrica: $E=0$, $V=n$. Markov, incrementos indep., NO estacionario"
        }
      ]
    },
    {
      "title": "Suma de v.a.",
      "hint": "E/V de sumas, convolución, casos cerrados con nombre propio",
      "unit": "7",
      "entries": [
        {
          "label": "E y V de una suma",
          "kind": "formula",
          "tex": "\\begin{aligned} E[X+Y] &= E[X]+E[Y] \\\\ V(X\\pm Y) &= V(X)+2\\,\\mathrm{Cov}(X,Y)+V(Y) \\end{aligned}",
          "body": "La esperanza de una suma es siempre la suma de las esperanzas, sin hipótesis adicionales. La varianza, en cambio, incorpora el término de covarianza, que mide cuánto se mueven juntas las variables.",
          "vars": [
            {
              "sym": "E[X+Y]",
              "desc": "esperanza de la suma de $X$ e $Y$"
            },
            {
              "sym": "E[X],\\ E[Y]",
              "desc": "esperanzas de $X$ e $Y$"
            },
            {
              "sym": "V(X\\pm Y)",
              "desc": "varianza de la suma o resta de $X$ e $Y$"
            },
            {
              "sym": "V(X),\\ V(Y)",
              "desc": "varianzas de $X$ e $Y$"
            },
            {
              "sym": "\\mathrm{Cov}(X,Y)",
              "desc": "covarianza entre $X$ e $Y$"
            }
          ],
          "note": "Indep / no correlacionadas: $V(X\\pm Y)=V(X)+V(Y)$"
        },
        {
          "label": "Suma y promedio i.i.d.",
          "kind": "formula",
          "tex": "\\begin{aligned} E[S_n] &= n\\mu \\\\ V(S_n) &= n\\sigma^2 \\\\ E[\\overline X_n] &= \\mu \\\\ V(\\overline X_n) &= \\tfrac{\\sigma^2}{n} \\end{aligned}",
          "body": "Para $n$ variables i.i.d., la suma tiene esperanza y varianza que escalan linealmente con $n$, mientras que el promedio muestral conserva la esperanza poblacional pero reduce su varianza en un factor $1/n$, concentrándose cada vez más alrededor de $\\mu$.",
          "vars": [
            {
              "sym": "S_n",
              "desc": "suma de las $n$ variables, $S_n=\\sum_{i=1}^n X_i$"
            },
            {
              "sym": "\\overline X_n",
              "desc": "promedio muestral, $\\overline X_n=S_n/n$"
            },
            {
              "sym": "n",
              "desc": "cantidad de variables i.i.d."
            },
            {
              "sym": "\\mu",
              "desc": "esperanza común de cada $X_i$"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza común de cada $X_i$"
            }
          ],
          "note": "Error estándar $\\sigma/\\sqrt n$: bajar a la mitad cuesta $\\times4$ datos"
        },
        {
          "label": "Convolución (independientes)",
          "kind": "formula",
          "tex": "\\begin{aligned} p_S(s) &= \\sum_y p_X(s-y)\\,p_Y(y) \\\\ f_S(s) &= \\int f_X(s-y)\\,f_Y(y)\\,dy \\end{aligned}",
          "body": "La distribución de la suma $S=X+Y$ de variables independientes se obtiene por convolución: en el caso discreto sumando sobre los valores de $Y$ y en el continuo integrando, en ambos casos contra $X$ evaluada en $s-y$.",
          "vars": [
            {
              "sym": "S",
              "desc": "suma de las variables independientes, $S=X+Y$"
            },
            {
              "sym": "s",
              "desc": "valor en el que se evalúa la distribución de $S$"
            },
            {
              "sym": "p_S(s)",
              "desc": "función de probabilidad puntual de $S$ (caso discreto)"
            },
            {
              "sym": "f_S(s)",
              "desc": "densidad de $S$ (caso continuo)"
            },
            {
              "sym": "p_X,\\ p_Y",
              "desc": "funciones de probabilidad puntual de $X$ e $Y$"
            },
            {
              "sym": "f_X,\\ f_Y",
              "desc": "densidades de $X$ e $Y$"
            },
            {
              "sym": "y",
              "desc": "variable de suma / integración, recorre los valores de $Y$"
            }
          ],
          "note": "Atajo: $M_{X+Y}=M_X M_Y$"
        },
        {
          "label": "Sumas cerradas con nombre propio",
          "kind": "theorem",
          "tex": "\\begin{aligned} n{\\times}\\mathrm{Ber}(p) &= \\mathrm{Bin}(n,p) \\\\ \\mathrm{Bin}{+}\\mathrm{Bin} &= \\mathrm{Bin}\\ (p\\ \\text{igual}) \\\\ \\mathrm{Poi}(\\lambda_1){+}\\mathrm{Poi}(\\lambda_2) &= \\mathrm{Poi}(\\lambda_1{+}\\lambda_2) \\\\ N(\\mu_1,\\sigma_1){+}N(\\mu_2,\\sigma_2) &= N(\\mu_1{+}\\mu_2,\\sqrt{\\sigma_1^2{+}\\sigma_2^2}) \\\\ n{\\times}\\mathrm{Exp}(\\lambda) &= \\mathrm{Gamma}(n,\\lambda) \\\\ \\sum_{i=1}^n N(0,1)^2 &= \\chi^2_n \\end{aligned}",
          "body": "Ciertas familias son cerradas bajo la suma de variables independientes: la suma cae en la misma familia (o en una emparentada) con parámetros que se combinan de forma simple. Estas identidades evitan tener que calcular la convolución a mano.",
          "vars": [
            {
              "sym": "\\mathrm{Ber}(p)",
              "desc": "distribución de Bernoulli de parámetro $p$"
            },
            {
              "sym": "\\mathrm{Bin}(n,p)",
              "desc": "distribución binomial de $n$ ensayos y probabilidad $p$"
            },
            {
              "sym": "\\mathrm{Poi}(\\lambda)",
              "desc": "distribución de Poisson de tasa $\\lambda$"
            },
            {
              "sym": "N(\\mu,\\sigma)",
              "desc": "distribución normal de media $\\mu$ y desvío $\\sigma$"
            },
            {
              "sym": "\\mathrm{Exp}(\\lambda)",
              "desc": "distribución exponencial de tasa $\\lambda$"
            },
            {
              "sym": "\\mathrm{Gamma}(n,\\lambda)",
              "desc": "distribución gamma de forma $n$ y tasa $\\lambda$"
            },
            {
              "sym": "\\chi^2_n",
              "desc": "distribución chi-cuadrado con $n$ grados de libertad"
            },
            {
              "sym": "n",
              "desc": "cantidad de variables sumadas / parámetro de forma"
            },
            {
              "sym": "p",
              "desc": "probabilidad de éxito (Bernoulli / binomial)"
            },
            {
              "sym": "\\lambda,\\ \\lambda_1,\\ \\lambda_2",
              "desc": "tasas de las Poisson / exponenciales"
            },
            {
              "sym": "\\mu_1,\\ \\mu_2",
              "desc": "medias de las normales sumadas"
            },
            {
              "sym": "\\sigma_1,\\ \\sigma_2",
              "desc": "desvíos de las normales sumadas"
            }
          ],
          "note": "Suman las VARIANZAS, no los desvíos. Unif+Unif = triangular (no se conserva)"
        }
      ]
    },
    {
      "title": "Cotas, LGN y TCL",
      "hint": "Markov, Chebyshev, ley de grandes números, teorema central del límite",
      "unit": "7",
      "entries": [
        {
          "label": "Markov y Chebyshev",
          "kind": "theorem",
          "tex": "\\begin{aligned} P(X\\ge\\alpha) &\\le \\frac{E[X]}{\\alpha} \\qquad (X\\ge 0) \\\\ P(|X-\\mu|\\ge\\varepsilon) &\\le \\frac{\\sigma^2}{\\varepsilon^2} \\end{aligned}",
          "body": "Dos desigualdades que acotan la probabilidad de que una variable se aleje de un valor de referencia usando solo sus momentos. La de Markov acota la cola derecha de una variable no negativa en términos de su esperanza; la de Chebyshev acota la probabilidad de desvíos respecto de la media en términos de la varianza.",
          "vars": [
            {
              "sym": "X",
              "desc": "variable aleatoria (en Markov, no negativa)"
            },
            {
              "sym": "\\alpha",
              "desc": "umbral positivo a partir del cual se mide la cola"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza (media) de $X$"
            },
            {
              "sym": "\\mu",
              "desc": "media de $X$"
            },
            {
              "sym": "\\varepsilon",
              "desc": "tolerancia del desvío respecto de la media, $\\varepsilon>0$"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza de $X$"
            }
          ],
          "note": "Cotas universales pero flojas; usar si no se conoce la distribución"
        },
        {
          "label": "Chebyshev para promedios",
          "kind": "formula",
          "tex": "P(|\\overline X_n-\\mu|\\ge\\varepsilon)\\le\\frac{\\sigma^2}{n\\,\\varepsilon^2}\\xrightarrow{n\\to\\infty}0",
          "body": "Aplica la desigualdad de Chebyshev al promedio muestral, cuya varianza es $\\sigma^2/n$. Muestra que la probabilidad de que la media muestral se aparte de la media poblacional más de $\\varepsilon$ se hace arbitrariamente chica al crecer el tamaño de muestra, lo que da una prueba de la ley débil de grandes números.",
          "vars": [
            {
              "sym": "\\overline X_n",
              "desc": "promedio muestral de las primeras $n$ observaciones"
            },
            {
              "sym": "\\mu",
              "desc": "media poblacional común a las $X_i$"
            },
            {
              "sym": "\\varepsilon",
              "desc": "tolerancia del desvío, $\\varepsilon>0$"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza poblacional común a las $X_i$"
            },
            {
              "sym": "n",
              "desc": "tamaño de muestra (cantidad de observaciones)"
            }
          ]
        },
        {
          "label": "Ley de grandes números",
          "kind": "theorem",
          "tex": "\\begin{aligned} \\text{débil:}\\quad & \\lim_n P(|\\overline X_n-\\mu|\\ge\\varepsilon)=0 \\\\ \\text{fuerte:}\\quad & P\\!\\big(\\lim_n\\overline X_n=\\mu\\big)=1 \\end{aligned}",
          "body": "Garantiza que el promedio muestral converge a la media poblacional a medida que crece la cantidad de observaciones. La versión débil afirma convergencia en probabilidad; la fuerte, la más exigente, afirma convergencia casi segura (con probabilidad $1$).",
          "vars": [
            {
              "sym": "\\overline X_n",
              "desc": "promedio muestral de las primeras $n$ observaciones"
            },
            {
              "sym": "\\mu",
              "desc": "media poblacional a la que converge el promedio"
            },
            {
              "sym": "\\varepsilon",
              "desc": "tolerancia del desvío, $\\varepsilon>0$"
            },
            {
              "sym": "n",
              "desc": "tamaño de muestra que tiende a infinito"
            }
          ],
          "note": "Justifica frecuencia relativa $\\hat P_n\\to p$"
        },
        {
          "label": "Teorema central del límite",
          "kind": "theorem",
          "tex": "Z_n=\\frac{\\overline X_n-\\mu}{\\sigma/\\sqrt n}\\ \\Rightarrow\\ P(Z_n\\le z)\\to\\Phi(z)",
          "body": "Establece que el promedio muestral estandarizado de variables i.i.d. converge en distribución a una normal estándar, sin importar la forma de la distribución original (con media y varianza finitas). Es la base para aproximar probabilidades de sumas y promedios mediante la normal.",
          "vars": [
            {
              "sym": "Z_n",
              "desc": "promedio muestral estandarizado"
            },
            {
              "sym": "\\overline X_n",
              "desc": "promedio muestral de las primeras $n$ observaciones"
            },
            {
              "sym": "\\mu",
              "desc": "media poblacional de las $X_i$"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional de las $X_i$"
            },
            {
              "sym": "n",
              "desc": "tamaño de muestra"
            },
            {
              "sym": "z",
              "desc": "valor en el que se evalúa la distribución límite"
            },
            {
              "sym": "\\Phi(z)",
              "desc": "función de distribución acumulada de la normal estándar"
            }
          ],
          "cond": "$X_i$ i.i.d. con $\\mu,\\sigma$ finitos; regla usual $n>20\\text{–}30$"
        },
        {
          "label": "Aproximaciones del TCL",
          "kind": "formula",
          "tex": "\\begin{aligned} \\overline X_n &\\overset{\\text{ap}}{\\sim} N\\!\\big(\\mu,\\tfrac{\\sigma}{\\sqrt n}\\big) \\\\ S_n &\\overset{\\text{ap}}{\\sim} N\\!\\big(n\\mu,\\sqrt n\\,\\sigma\\big) \\end{aligned}",
          "body": "Consecuencias prácticas del TCL: para $n$ grande, el promedio muestral y la suma de las observaciones se distribuyen aproximadamente normal. Permite calcular probabilidades sobre $\\overline X_n$ y $S_n$ estandarizando y usando la tabla normal.",
          "vars": [
            {
              "sym": "\\overline X_n",
              "desc": "promedio muestral de las primeras $n$ observaciones"
            },
            {
              "sym": "S_n",
              "desc": "suma de las primeras $n$ observaciones, $S_n=\\sum_{i=1}^n X_i$"
            },
            {
              "sym": "N(\\cdot,\\cdot)",
              "desc": "distribución normal (parametrizada por media y desvío estándar)"
            },
            {
              "sym": "\\mu",
              "desc": "media poblacional de las $X_i$"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional de las $X_i$"
            },
            {
              "sym": "n",
              "desc": "tamaño de muestra"
            }
          ],
          "note": "Frec. rel.: $P(\\hat P_n\\le q)\\approx\\Phi\\!\\big(\\tfrac{q-p}{\\sqrt{p(1-p)/n}}\\big)$"
        },
        {
          "label": "Normal aprox. de la binomial (+ continuidad)",
          "kind": "formula",
          "tex": "P(a\\le S_n\\le b)\\approx\\Phi\\!\\big(\\tfrac{b+\\frac12-np}{\\sqrt{npq}}\\big)-\\Phi\\!\\big(\\tfrac{a-\\frac12-np}{\\sqrt{npq}}\\big)",
          "body": "Aproxima probabilidades de una binomial mediante la normal de igual media y varianza, sumando la corrección por continuidad ($\\pm\\tfrac12$) que ajusta el paso de una variable discreta a una continua. Calcula la probabilidad de que el conteo de éxitos caiga en el intervalo $[a,b]$.",
          "vars": [
            {
              "sym": "S_n",
              "desc": "cantidad de éxitos en $n$ ensayos, $S_n\\sim\\mathrm{Bin}(n,p)$"
            },
            {
              "sym": "a",
              "desc": "extremo inferior del rango de éxitos"
            },
            {
              "sym": "b",
              "desc": "extremo superior del rango de éxitos"
            },
            {
              "sym": "\\Phi",
              "desc": "función de distribución acumulada de la normal estándar"
            },
            {
              "sym": "n",
              "desc": "cantidad de ensayos"
            },
            {
              "sym": "p",
              "desc": "probabilidad de éxito en cada ensayo"
            },
            {
              "sym": "q",
              "desc": "probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "\\tfrac12",
              "desc": "corrección por continuidad al aproximar una discreta por una continua"
            }
          ],
          "cond": "$\\mathrm{Bin}(n,p)\\approx N(np,\\sqrt{npq})$. Corrección $\\pm\\tfrac12$ para discretas"
        }
      ]
    },
    {
      "title": "Estimación puntual",
      "hint": "Calidad del estimador y métodos de construcción",
      "unit": "8",
      "entries": [
        {
          "label": "ECM, sesgo, consistencia",
          "kind": "formula",
          "tex": "\\begin{aligned} \\mathrm{mse}(\\hat\\theta) &= V(\\hat\\theta)+\\mathrm{sesgo}^2(\\hat\\theta) \\\\ \\mathrm{sesgo}(\\hat\\theta) &= E[\\hat\\theta]-\\theta \\end{aligned}",
          "body": "Descomponen la calidad de un estimador. El error cuadrático medio mide la dispersión total de $\\hat\\theta$ alrededor del verdadero $\\theta$, y se separa en la varianza del estimador más el cuadrado de su sesgo. El sesgo es la diferencia entre el valor esperado del estimador y el parámetro real.",
          "vars": [
            {
              "sym": "\\mathrm{mse}(\\hat\\theta)",
              "desc": "error cuadrático medio del estimador, $E[(\\hat\\theta-\\theta)^2]$"
            },
            {
              "sym": "\\hat\\theta",
              "desc": "estimador del parámetro"
            },
            {
              "sym": "\\theta",
              "desc": "verdadero valor del parámetro poblacional"
            },
            {
              "sym": "V(\\hat\\theta)",
              "desc": "varianza del estimador"
            },
            {
              "sym": "\\mathrm{sesgo}(\\hat\\theta)",
              "desc": "sesgo del estimador, $E[\\hat\\theta]-\\theta$"
            },
            {
              "sym": "E[\\hat\\theta]",
              "desc": "valor esperado del estimador"
            }
          ],
          "note": "Insesgado: $E[\\hat\\theta]=\\theta$. Consistente: $\\mathrm{mse}\\to0$"
        },
        {
          "label": "Estimadores clásicos (insesgados)",
          "kind": "formula",
          "tex": "\\begin{aligned} \\hat\\mu &= \\overline X_n \\quad\\left(\\mathrm{ecm}=\\tfrac{\\sigma^2}{n}\\right) \\\\ \\hat p &= \\overline X_n \\quad\\left(\\mathrm{ecm}=\\tfrac{p(1-p)}{n}\\right) \\\\ S_n^2 &= \\tfrac{1}{n-1}\\sum(X_i-\\overline X_n)^2 \\end{aligned}",
          "body": "Estimadores insesgados de uso habitual: la media muestral estima tanto la media poblacional $\\mu$ como la proporción $p$ (con sus respectivos ECM), y la varianza muestral $S_n^2$, dividida por $n-1$, es estimador insesgado de la varianza poblacional $\\sigma^2$.",
          "vars": [
            {
              "sym": "\\hat\\mu",
              "desc": "estimador de la media poblacional"
            },
            {
              "sym": "\\overline X_n",
              "desc": "media muestral de $n$ observaciones"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza poblacional"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "\\hat p",
              "desc": "estimador de la proporción poblacional"
            },
            {
              "sym": "p",
              "desc": "proporción poblacional verdadera"
            },
            {
              "sym": "S_n^2",
              "desc": "varianza muestral (insesgada)"
            },
            {
              "sym": "X_i",
              "desc": "$i$-ésima observación de la muestra"
            }
          ]
        },
        {
          "label": "Varianza muestral: identidad y ley",
          "kind": "formula",
          "tex": "\\begin{aligned} (n-1)S_n^2 &= \\sum X_i^2-n\\overline X_n^2 \\\\ \\frac{(n-1)S_n^2}{\\sigma^2} &\\sim \\chi^2_{n-1} \\end{aligned}",
          "body": "La primera línea es la identidad de cómputo de la varianza muestral, útil para calcularla sin recorrer dos veces los datos. La segunda da su distribución: cuando la muestra es normal, la varianza muestral escalada sigue una chi-cuadrado con $n-1$ grados de libertad.",
          "vars": [
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "S_n^2",
              "desc": "varianza muestral"
            },
            {
              "sym": "X_i",
              "desc": "$i$-ésima observación"
            },
            {
              "sym": "\\overline X_n",
              "desc": "media muestral"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza poblacional"
            },
            {
              "sym": "\\chi^2_{n-1}",
              "desc": "distribución chi-cuadrado con $n-1$ grados de libertad"
            }
          ],
          "cond": "La $\\chi^2$ vale si la muestra es normal"
        },
        {
          "label": "Máxima verosimilitud (MV)",
          "kind": "method",
          "tex": "\\hat\\theta=\\arg\\max_\\theta\\sum_i\\ln f(x_i;\\theta)",
          "body": "El estimador de máxima verosimilitud elige el valor del parámetro que vuelve más probables los datos observados. En la práctica se maximiza la log-verosimilitud (suma de los logaritmos de la densidad evaluada en cada dato), porque transforma el producto en suma y simplifica la derivación.",
          "vars": [
            {
              "sym": "\\hat\\theta",
              "desc": "estimador de máxima verosimilitud"
            },
            {
              "sym": "\\theta",
              "desc": "parámetro a estimar"
            },
            {
              "sym": "\\arg\\max_\\theta",
              "desc": "valor de $\\theta$ que maximiza la expresión"
            },
            {
              "sym": "x_i",
              "desc": "$i$-ésimo dato observado"
            },
            {
              "sym": "f(x_i;\\theta)",
              "desc": "función de densidad (o de probabilidad) evaluada en $x_i$ para el parámetro $\\theta$"
            }
          ],
          "note": "Si $\\theta$ está en el SOPORTE (uniformes) NO derivar: $\\hat\\theta$ en un extremo de la muestra"
        },
        {
          "label": "MAP (bayesiano)",
          "kind": "method",
          "tex": "\\begin{aligned} \\hat\\theta &= \\arg\\max_\\theta g(\\theta\\mid x) \\\\ g(\\theta\\mid x) &\\propto f(x\\mid\\theta)\\,g(\\theta) \\end{aligned}",
          "body": "El estimador máximo a posteriori toma el valor de $\\theta$ que maximiza la densidad posterior, la cual es proporcional al producto de la verosimilitud por la distribución a priori. Combina la información de los datos con la creencia previa sobre el parámetro.",
          "vars": [
            {
              "sym": "\\hat\\theta",
              "desc": "estimador máximo a posteriori"
            },
            {
              "sym": "\\theta",
              "desc": "parámetro a estimar"
            },
            {
              "sym": "\\arg\\max_\\theta",
              "desc": "valor de $\\theta$ que maximiza la expresión"
            },
            {
              "sym": "g(\\theta\\mid x)",
              "desc": "densidad a posteriori del parámetro dados los datos"
            },
            {
              "sym": "x",
              "desc": "datos observados"
            },
            {
              "sym": "f(x\\mid\\theta)",
              "desc": "verosimilitud de los datos dado el parámetro"
            },
            {
              "sym": "g(\\theta)",
              "desc": "distribución a priori del parámetro"
            }
          ],
          "note": "Promedia datos y prior; $n$ grande → manda la muestra"
        },
        {
          "label": "Método de los momentos",
          "kind": "method",
          "tex": "\\mu_k=E[X^k]=H(\\theta)\\ \\Rightarrow\\ \\hat\\theta=H^{-1}(\\hat\\mu_k)",
          "body": "Estima el parámetro igualando los momentos poblacionales (función del parámetro) con los momentos muestrales y despejando. Se usan tantos momentos como parámetros haya, y se invierte la relación para obtener el estimador.",
          "vars": [
            {
              "sym": "\\mu_k",
              "desc": "$k$-ésimo momento poblacional"
            },
            {
              "sym": "E[X^k]",
              "desc": "esperanza de la $k$-ésima potencia de $X$"
            },
            {
              "sym": "k",
              "desc": "orden del momento ($k=1,2,\\dots$)"
            },
            {
              "sym": "H(\\theta)",
              "desc": "expresión del momento poblacional en función del parámetro"
            },
            {
              "sym": "\\theta",
              "desc": "parámetro a estimar"
            },
            {
              "sym": "\\hat\\theta",
              "desc": "estimador por el método de los momentos"
            },
            {
              "sym": "H^{-1}",
              "desc": "función inversa de $H$"
            },
            {
              "sym": "\\hat\\mu_k",
              "desc": "$k$-ésimo momento muestral"
            }
          ],
          "cond": "Igualar momento poblacional al muestral y despejar (ej: $\\hat\\lambda=1/\\overline X_n$ exp.)"
        }
      ]
    },
    {
      "title": "Distribuciones de muestreo (t, χ²)",
      "hint": "Las leyes que aparecen al estimar μ y σ²",
      "unit": "8",
      "entries": [
        {
          "label": "Ji-cuadrado χ²_k",
          "kind": "formula",
          "tex": "\\begin{aligned} \\sum_{i=1}^k Z_i^2 &\\sim \\chi^2_k \\\\ E &= k \\\\ V &= 2k \\\\ \\chi^2_k &= \\mathrm{Gamma}\\!\\left(\\tfrac{k}{2},\\tfrac12\\right) \\end{aligned}",
          "body": "La distribución ji-cuadrado con $k$ grados de libertad es la ley de la suma de $k$ normales estándar independientes elevadas al cuadrado. Aparece naturalmente al estudiar la varianza muestral y es un caso particular de la Gamma.",
          "vars": [
            {
              "sym": "Z_i",
              "desc": "variables i.i.d. con distribución normal estándar $N(0,1)$"
            },
            {
              "sym": "k",
              "desc": "grados de libertad (cantidad de términos sumados)"
            },
            {
              "sym": "\\chi^2_k",
              "desc": "distribución ji-cuadrado con $k$ grados de libertad"
            },
            {
              "sym": "E",
              "desc": "esperanza de $\\chi^2_k$"
            },
            {
              "sym": "V",
              "desc": "varianza de $\\chi^2_k$"
            },
            {
              "sym": "\\mathrm{Gamma}(\\tfrac{k}{2},\\tfrac12)",
              "desc": "Gamma de forma $k/2$ y tasa $1/2$, equivalente a la $\\chi^2_k$"
            }
          ],
          "note": "Aditiva en gdl; $\\chi^2_k\\approx N(k,\\sqrt{2k})$ para $k$ grande"
        },
        {
          "label": "t de Student",
          "kind": "formula",
          "tex": "\\begin{aligned} T &= \\frac{\\overline X_n - \\mu}{S_n/\\sqrt n} \\sim t_{n-1} \\\\ E[T] &= 0 \\\\ V(T) &= \\frac{m}{m-2} \\quad (m>2) \\end{aligned}",
          "body": "El estadístico $t$ estandariza la media muestral usando el desvío estimado $S_n$ en lugar del desvío poblacional desconocido. Como la varianza se estima, sigue una distribución t de Student con $n-1$ grados de libertad, de colas más anchas que la normal.",
          "vars": [
            {
              "sym": "T",
              "desc": "estadístico estandarizado con distribución $t_{n-1}$"
            },
            {
              "sym": "\\overline X_n",
              "desc": "media muestral de las $n$ observaciones"
            },
            {
              "sym": "\\mu",
              "desc": "media poblacional bajo la hipótesis"
            },
            {
              "sym": "S_n",
              "desc": "desvío estándar muestral (estimador del desvío poblacional)"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "t_{n-1}",
              "desc": "distribución t de Student con $n-1$ grados de libertad"
            },
            {
              "sym": "E[T]",
              "desc": "esperanza de $T$"
            },
            {
              "sym": "V(T)",
              "desc": "varianza de $T$"
            },
            {
              "sym": "m",
              "desc": "grados de libertad de la t (aquí $m=n-1$)"
            }
          ],
          "note": "Simétrica, colas más pesadas que la normal; $t_m\\to N(0,1)$ si $m\\to\\infty$"
        },
        {
          "label": "Fractiles de la t",
          "kind": "caution",
          "tex": "m < \\ell \\Rightarrow t_{m,\\gamma} > t_{\\ell,\\gamma} > z_\\gamma",
          "body": "Compara los fractiles de la t según los grados de libertad: con menos grados de libertad la distribución tiene colas más pesadas, por lo que su fractil de nivel $\\gamma$ es mayor, y siempre supera al fractil normal correspondiente.",
          "vars": [
            {
              "sym": "m",
              "desc": "grados de libertad de la primera distribución t"
            },
            {
              "sym": "\\ell",
              "desc": "grados de libertad de la segunda distribución t, con $\\ell>m$"
            },
            {
              "sym": "t_{m,\\gamma}",
              "desc": "fractil de nivel $\\gamma$ de la $t_m$"
            },
            {
              "sym": "t_{\\ell,\\gamma}",
              "desc": "fractil de nivel $\\gamma$ de la $t_\\ell$"
            },
            {
              "sym": "z_\\gamma",
              "desc": "fractil de nivel $\\gamma$ de la normal estándar"
            },
            {
              "sym": "\\gamma",
              "desc": "nivel (probabilidad acumulada) del fractil"
            }
          ],
          "note": "Menos gdl → fractil mayor → IC más ancho. Para $n>100\\text{–}200$ usar $z$"
        }
      ]
    },
    {
      "title": "Intervalos de confianza",
      "hint": "Rango que atrapa θ con confianza γ. Semiamplitud bilateral Δ_B",
      "unit": "8",
      "entries": [
        {
          "label": "IC media, σ conocido (Z)",
          "kind": "formula",
          "tex": "IC_\\gamma(\\mu)=\\overline X_n\\pm z_{\\frac{1+\\gamma}{2}}\\frac{\\sigma}{\\sqrt n}",
          "body": "Intervalo de confianza bilateral para la media poblacional $\\mu$ cuando el desvío $\\sigma$ es conocido. Se centra en la media muestral y suma/resta una semiamplitud dada por el cuantil normal y el error estándar $\\sigma/\\sqrt n$.",
          "vars": [
            {
              "sym": "IC_\\gamma(\\mu)",
              "desc": "intervalo de confianza de nivel $\\gamma$ para la media $\\mu$"
            },
            {
              "sym": "\\overline X_n",
              "desc": "media muestral de las $n$ observaciones"
            },
            {
              "sym": "z_{\\frac{1+\\gamma}{2}}",
              "desc": "cuantil $\\tfrac{1+\\gamma}{2}$ de la normal estándar (deja $\\tfrac{1-\\gamma}{2}$ en cada cola)"
            },
            {
              "sym": "\\gamma",
              "desc": "nivel de confianza (p. ej. $0.95$)"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional (conocido)"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            }
          ],
          "cond": "Normal con $\\sigma$ conocido, o $n$ grande (TCL)"
        },
        {
          "label": "IC media, σ desconocido (t)",
          "kind": "formula",
          "tex": "IC_\\gamma(\\mu)=\\overline X_n\\pm t_{n-1,\\frac{1+\\gamma}{2}}\\frac{S_n}{\\sqrt n}",
          "body": "Intervalo de confianza bilateral para la media $\\mu$ cuando el desvío poblacional es desconocido y se estima con el desvío muestral $S_n$. Usa el cuantil de la distribución $t$ de Student con $n-1$ grados de libertad, que ensancha el intervalo respecto del caso normal.",
          "vars": [
            {
              "sym": "IC_\\gamma(\\mu)",
              "desc": "intervalo de confianza de nivel $\\gamma$ para la media $\\mu$"
            },
            {
              "sym": "\\overline X_n",
              "desc": "media muestral de las $n$ observaciones"
            },
            {
              "sym": "t_{n-1,\\frac{1+\\gamma}{2}}",
              "desc": "cuantil $\\tfrac{1+\\gamma}{2}$ de la $t$ de Student con $n-1$ grados de libertad"
            },
            {
              "sym": "n-1",
              "desc": "grados de libertad"
            },
            {
              "sym": "\\gamma",
              "desc": "nivel de confianza"
            },
            {
              "sym": "S_n",
              "desc": "desvío estándar muestral (estimador de $\\sigma$)"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            }
          ],
          "cond": "Muestra normal, $\\sigma$ desconocido, $n$ chico"
        },
        {
          "label": "IC proporción (Z)",
          "kind": "formula",
          "tex": "IC_\\gamma(p)=\\hat p\\pm z_{\\frac{1+\\gamma}{2}}\\sqrt{\\frac{\\hat p(1-\\hat p)}{n}}",
          "body": "Intervalo de confianza bilateral para una proporción poblacional $p$, basado en la aproximación normal del estimador $\\hat p$. La semiamplitud combina el cuantil normal con el error estándar estimado de la proporción.",
          "vars": [
            {
              "sym": "IC_\\gamma(p)",
              "desc": "intervalo de confianza de nivel $\\gamma$ para la proporción $p$"
            },
            {
              "sym": "\\hat p",
              "desc": "proporción muestral (estimador de $p$)"
            },
            {
              "sym": "z_{\\frac{1+\\gamma}{2}}",
              "desc": "cuantil $\\tfrac{1+\\gamma}{2}$ de la normal estándar"
            },
            {
              "sym": "\\gamma",
              "desc": "nivel de confianza"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            }
          ],
          "cond": "$n$ grande; unilaterales acotados a $[0,1]$"
        },
        {
          "label": "Tamaño muestral (error E = semiamplitud)",
          "kind": "formula",
          "tex": "\\begin{aligned} n &\\ge z_{\\frac{1+\\gamma}{2}}^2\\,\\frac{\\sigma^2}{E^2} \\\\ n_{\\text{prop}} &\\ge z_{\\frac{1+\\gamma}{2}}^2\\,\\frac{1/4}{E^2} \\end{aligned}",
          "body": "Tamaño muestral mínimo para que la semiamplitud del IC no supere un error $E$ prefijado: la primera línea es para estimar una media (con $\\sigma$ conocido o supuesto) y la segunda para estimar una proporción usando la cota conservadora $p(1-p)\\le\\tfrac14$.",
          "vars": [
            {
              "sym": "n",
              "desc": "tamaño muestral mínimo para estimar la media"
            },
            {
              "sym": "n_{\\text{prop}}",
              "desc": "tamaño muestral mínimo para estimar una proporción"
            },
            {
              "sym": "z_{\\frac{1+\\gamma}{2}}",
              "desc": "cuantil $\\tfrac{1+\\gamma}{2}$ de la normal estándar"
            },
            {
              "sym": "\\gamma",
              "desc": "nivel de confianza"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza poblacional (conocida o supuesta)"
            },
            {
              "sym": "E",
              "desc": "error máximo admitido (semiamplitud del intervalo)"
            }
          ],
          "note": "Cota conservadora $p(1-p)\\le\\tfrac14$, o usar $\\hat p$ previo. Redondear hacia arriba"
        },
        {
          "label": "Unilaterales y corrección pob. finita",
          "kind": "caution",
          "tex": "\\begin{aligned} &\\Delta_U\\ \\text{usa }\\gamma\\ \\text{(no }\\tfrac{1+\\gamma}{2}) \\\\ &E=z\\sqrt{\\hat p(1-\\hat p)}\\sqrt{\\tfrac{N-n}{Nn}} \\end{aligned}",
          "body": "Dos ajustes importantes: en los intervalos unilaterales la semiamplitud $\\Delta_U$ se calcula con el cuantil de nivel $\\gamma$ (toda la probabilidad va a una sola cola), no con $\\tfrac{1+\\gamma}{2}$; y al muestrear sin reposición de una población finita se aplica el factor de corrección $\\sqrt{(N-n)/(Nn)}$ al error de la proporción.",
          "vars": [
            {
              "sym": "\\Delta_U",
              "desc": "semiamplitud del intervalo unilateral"
            },
            {
              "sym": "\\gamma",
              "desc": "nivel de confianza"
            },
            {
              "sym": "E",
              "desc": "error de estimación de la proporción con corrección"
            },
            {
              "sym": "z",
              "desc": "cuantil de la normal estándar correspondiente al nivel"
            },
            {
              "sym": "\\hat p",
              "desc": "proporción muestral (estimador de $p$)"
            },
            {
              "sym": "N",
              "desc": "tamaño total de la población finita"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            }
          ],
          "note": "Interpretación frecuentista: el IC (antes de muestrear) atrapa $\\theta$ con prob. $\\gamma$"
        }
      ]
    },
    {
      "title": "Pruebas de hipótesis",
      "hint": "Estadístico, región de rechazo, valor p, errores. Igualdad siempre en H₀",
      "unit": "9",
      "entries": [
        {
          "label": "Errores y potencia",
          "kind": "def",
          "tex": "\\begin{aligned}\\text{Tipo I }(\\alpha) &: \\text{rechazar } H_0 \\text{ siendo cierta} \\\\ \\text{Tipo II }(\\beta) &: \\text{aceptar } H_0 \\text{ siendo falsa} \\\\ \\text{potencia} &= 1-\\beta\\end{aligned}",
          "body": "Clasifica los dos errores posibles al decidir sobre $H_0$ y define la potencia del test. El error de tipo I es rechazar una hipótesis nula verdadera y el de tipo II es no rechazar una nula falsa; la potencia mide la probabilidad de detectar correctamente que $H_0$ es falsa.",
          "vars": [
            {
              "sym": "\\alpha",
              "desc": "probabilidad de error de tipo I (nivel de significación)"
            },
            {
              "sym": "\\beta",
              "desc": "probabilidad de error de tipo II"
            },
            {
              "sym": "H_0",
              "desc": "hipótesis nula (contiene la igualdad)"
            },
            {
              "sym": "1-\\beta",
              "desc": "potencia del test: probabilidad de rechazar $H_0$ siendo falsa"
            }
          ],
          "note": "$\\alpha$ se fija; $\\beta$ es función de $\\theta_1$. Bajar ambos → subir $n$"
        },
        {
          "label": "Estadísticos de prueba",
          "kind": "formula",
          "tex": "\\begin{aligned}Z &= \\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n} \\\\ T &= \\frac{\\bar X-\\mu_0}{S/\\sqrt n}\\sim t_{n-1} \\\\ Z &= \\frac{\\hat q-q_0}{\\sqrt{q_0(1-q_0)/n}}\\end{aligned}",
          "body": "Estandarizan la distancia entre el estimador muestral y el valor postulado en $H_0$, midiéndola en unidades de error estándar. Se usa $Z$ para la media con $\\sigma$ conocida, $T$ (con distribución $t$ de Student) para la media con $\\sigma$ desconocida, y la tercera forma para una proporción.",
          "vars": [
            {
              "sym": "Z",
              "desc": "estadístico estandarizado bajo $H_0$ (distribución normal)"
            },
            {
              "sym": "T",
              "desc": "estadístico para la media con varianza desconocida"
            },
            {
              "sym": "\\bar X",
              "desc": "media muestral"
            },
            {
              "sym": "\\mu_0",
              "desc": "valor de la media postulado en $H_0$"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional (conocido)"
            },
            {
              "sym": "S",
              "desc": "desvío estándar muestral (estima $\\sigma$)"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "t_{n-1}",
              "desc": "distribución $t$ de Student con $n-1$ grados de libertad"
            },
            {
              "sym": "\\hat q",
              "desc": "proporción muestral observada"
            },
            {
              "sym": "q_0",
              "desc": "proporción postulada en $H_0$"
            }
          ],
          "cond": "$Z$ ($\\sigma$ conocida o $n$ grande); $T$ ($\\sigma$ desc., normal); prop ($n>100$)"
        },
        {
          "label": "Región de rechazo",
          "kind": "method",
          "tex": "\\begin{aligned}\\text{2 colas} &: |Z|>z_{1-\\alpha/2} \\\\ \\text{cola derecha} &: Z>z_{1-\\alpha} \\\\ \\text{cola izquierda} &: Z<-z_{1-\\alpha}\\end{aligned}",
          "body": "Define el conjunto de valores del estadístico que llevan a rechazar $H_0$, según la forma de $H_1$. Si el estadístico observado cae en la región se rechaza la nula; la frontera la fijan los percentiles de la normal que acumulan la probabilidad $\\alpha$ en la(s) cola(s) correspondiente(s).",
          "vars": [
            {
              "sym": "Z",
              "desc": "estadístico de prueba estandarizado"
            },
            {
              "sym": "z_{1-\\alpha/2}",
              "desc": "percentil $1-\\alpha/2$ de la normal estándar (test bilateral)"
            },
            {
              "sym": "z_{1-\\alpha}",
              "desc": "percentil $1-\\alpha$ de la normal estándar (test unilateral)"
            },
            {
              "sym": "\\alpha",
              "desc": "nivel de significación"
            }
          ],
          "note": "Con $T$, reemplazar $z$ por $t_{n-1}$"
        },
        {
          "label": "Valor crítico del estimador (media, σ)",
          "kind": "formula",
          "tex": "\\begin{aligned}\\bar x_c &= \\mu_0\\pm z_{1-\\alpha/2}\\frac{\\sigma}{\\sqrt n} && (\\text{2 colas}) \\\\ \\bar x_c &= \\mu_0+z_{1-\\alpha}\\frac{\\sigma}{\\sqrt n} && (\\text{cola der.})\\end{aligned}",
          "body": "Expresa la región de rechazo directamente en la escala de la media muestral, en lugar de en la del estadístico estandarizado. El valor crítico $\\bar x_c$ es la frontera de decisión: medias muestrales más extremas que $\\bar x_c$ conducen a rechazar $H_0$.",
          "vars": [
            {
              "sym": "\\bar x_c",
              "desc": "valor crítico de la media muestral (frontera de decisión)"
            },
            {
              "sym": "\\mu_0",
              "desc": "media postulada en $H_0$"
            },
            {
              "sym": "z_{1-\\alpha/2}",
              "desc": "percentil $1-\\alpha/2$ de la normal estándar (bilateral)"
            },
            {
              "sym": "z_{1-\\alpha}",
              "desc": "percentil $1-\\alpha$ de la normal estándar (unilateral)"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            }
          ]
        },
        {
          "label": "Valor p",
          "kind": "formula",
          "tex": "\\begin{aligned}\\text{cola der.} &: 1-\\Phi(z_{\\rm obs}) \\\\ \\text{cola izq.} &: \\Phi(z_{\\rm obs}) \\\\ \\text{2 colas} &: 2\\bigl(1-\\Phi(|z_{\\rm obs}|)\\bigr)\\end{aligned}",
          "body": "Es la probabilidad, suponiendo $H_0$ cierta, de observar un estadístico tan o más extremo que el obtenido. Cuanto menor es el valor p, mayor es la evidencia en contra de $H_0$; el cálculo depende del tipo de cola del test.",
          "vars": [
            {
              "sym": "\\Phi",
              "desc": "función de distribución acumulada de la normal estándar"
            },
            {
              "sym": "z_{\\rm obs}",
              "desc": "valor observado del estadístico estandarizado"
            }
          ],
          "note": "Decisión: rechazar $H_0\\iff$ valor p $<\\alpha$"
        },
        {
          "label": "Error tipo II β(μ₁) — media, σ conocida",
          "kind": "formula",
          "tex": "\\beta(\\mu_1)=\\Phi\\!\\Big(z_{1-\\alpha}+\\frac{\\mu_0-\\mu_1}{\\sigma/\\sqrt n}\\Big) \\quad (\\text{cola der.})",
          "body": "Calcula la probabilidad de error de tipo II para un test de cola derecha cuando la media verdadera es $\\mu_1$. Mide la chance de no rechazar $H_0$ pese a ser falsa; depende de cuán lejos esté $\\mu_1$ de $\\mu_0$ y del tamaño de muestra.",
          "vars": [
            {
              "sym": "\\beta(\\mu_1)",
              "desc": "probabilidad de error de tipo II bajo el valor verdadero $\\mu_1$"
            },
            {
              "sym": "\\Phi",
              "desc": "función de distribución acumulada de la normal estándar"
            },
            {
              "sym": "z_{1-\\alpha}",
              "desc": "percentil $1-\\alpha$ de la normal estándar"
            },
            {
              "sym": "\\mu_0",
              "desc": "media postulada en $H_0$"
            },
            {
              "sym": "\\mu_1",
              "desc": "media verdadera bajo la alternativa"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            }
          ],
          "note": "$\\beta(\\mu_0)=1-\\alpha$; $\\beta(\\bar x_c)\\approx0.5$; $\\beta\\to0$ al alejarse"
        },
        {
          "label": "Diseño: despejar n (fijar α y β)",
          "kind": "method",
          "tex": "n=\\left(\\frac{(z_{1-\\alpha}+z_{1-\\beta^*})\\,\\sigma}{\\mu_1-\\mu_0}\\right)^2",
          "body": "Determina el tamaño de muestra necesario para que el test alcance, de forma simultánea, un nivel $\\alpha$ y una potencia objetivo $1-\\beta^*$ frente a una alternativa $\\mu_1$ dada. Cuanto menor sea la diferencia $\\mu_1-\\mu_0$ que se quiere detectar, mayor será el $n$ requerido.",
          "vars": [
            {
              "sym": "n",
              "desc": "tamaño de muestra requerido"
            },
            {
              "sym": "z_{1-\\alpha}",
              "desc": "percentil $1-\\alpha$ de la normal estándar"
            },
            {
              "sym": "z_{1-\\beta^*}",
              "desc": "percentil $1-\\beta^*$ asociado a la potencia objetivo"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional"
            },
            {
              "sym": "\\mu_1",
              "desc": "media verdadera bajo la alternativa que se desea detectar"
            },
            {
              "sym": "\\mu_0",
              "desc": "media postulada en $H_0$"
            }
          ],
          "cond": "Media, $\\sigma$ conocida; redondear hacia arriba. Luego $\\bar x_c=\\mu_0+z_{1-\\alpha}\\sigma/\\sqrt n$"
        },
        {
          "label": "Cómo plantear H₀/H₁",
          "kind": "caution",
          "body": "La igualdad va siempre en $H_0$; la carga de prueba en $H_1$. 'Al menos/no menor' → $H_0$ con $\\ge$ → cola izquierda. ¿Media o proporción? ¿σ conocido? define $Z$ vs $T$."
        }
      ]
    }
  ]
};

export const probaConceptos: Sheet = {
  "vault": "proba",
  "kind": "conceptos",
  "title": "Probabilidad y Estadística",
  "subtitle": "Hoja de conceptos definitiva: de los axiomas a las pruebas de hipótesis",
  "notation": "$S$ espacio muestral; $X$ v.a.; $E[X]=\\mu$, $V(X)=\\sigma^2$; $q=1-p$; $\\Phi$ FDA de $N(0,1)$; $\\bar X_n$ promedio muestral; $\\hat\\theta$ estimador; $H_0/H_1$ hipótesis.",
  "updated": "2026-06-30",
  "groups": [
    {
      "title": "Estadística descriptiva",
      "hint": "Resumir una muestra observada (centro, dispersión, forma) sin inferir todavía sobre la población.",
      "unit": "1",
      "entries": [
        {
          "label": "Población vs muestra",
          "kind": "def",
          "body": "**Población**: universo completo a estudiar. **Muestra** $\\{x_i\\}_{i=1}^n$: subconjunto que se observa (idealmente al azar, representativa). La descriptiva trabaja sobre la muestra.",
          "cond": "Cuantitativa (numérica) vs cualitativa; la materia usa cuantitativas."
        },
        {
          "label": "Tendencia central",
          "kind": "formula",
          "tex": "\\begin{aligned} \\bar x &= \\frac{1}{n}\\sum_{i=1}^n x_i \\\\ m_e &= q_2 \\ (50\\%\\ \\text{a cada lado}) \\\\ \\text{moda} &= \\text{valor más frecuente} \\end{aligned}",
          "body": "Las tres medidas de posición central de una muestra: la media aritmética (promedio), la mediana $m_e$ (valor que deja la mitad de los datos a cada lado) y la moda (el valor que más se repite).",
          "vars": [
            {
              "sym": "\\bar x",
              "desc": "media muestral (promedio aritmético)"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra (cantidad de datos)"
            },
            {
              "sym": "x_i",
              "desc": "$i$-ésimo dato observado, con $i=1,\\dots,n$"
            },
            {
              "sym": "m_e",
              "desc": "mediana de la muestra"
            },
            {
              "sym": "q_2",
              "desc": "segundo cuartil (coincide con la mediana, percentil 50)"
            }
          ],
          "note": "$n$ par: mediana = promedio de las dos centrales."
        },
        {
          "label": "Dispersión",
          "kind": "formula",
          "tex": "\\begin{aligned} s^2 &= \\frac{1}{n-1}\\sum(x_i-\\bar x)^2 \\\\ s &= \\sqrt{s^2} \\\\ R &= \\max-\\min \\\\ \\text{IQR} &= q_3-q_1 \\end{aligned}",
          "body": "Medidas de cuánto se alejan los datos de su centro: la varianza muestral $s^2$ y su raíz, el desvío estándar $s$ (en las unidades de los datos), el rango total $R$ y el rango intercuartílico IQR (amplitud del 50% central).",
          "vars": [
            {
              "sym": "s^2",
              "desc": "varianza muestral"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "x_i",
              "desc": "$i$-ésimo dato observado"
            },
            {
              "sym": "\\bar x",
              "desc": "media muestral"
            },
            {
              "sym": "s",
              "desc": "desvío estándar muestral"
            },
            {
              "sym": "R",
              "desc": "rango (diferencia entre el máximo y el mínimo)"
            },
            {
              "sym": "\\text{IQR}",
              "desc": "rango intercuartílico, $q_3-q_1$"
            },
            {
              "sym": "q_1",
              "desc": "primer cuartil (percentil 25)"
            },
            {
              "sym": "q_3",
              "desc": "tercer cuartil (percentil 75)"
            }
          ],
          "note": "Varianza muestral con $n-1$ (versión insesgada)."
        },
        {
          "label": "Forma (adimensionales)",
          "kind": "formula",
          "tex": "\\begin{aligned} \\gamma &= \\frac{\\sum(x_i-\\bar x)^3}{n\\,s^3} \\\\ \\kappa &= \\frac{\\sum(x_i-\\bar x)^4}{n\\,s^4}-3 \\end{aligned}",
          "body": "Medidas adimensionales de la forma de la distribución muestral. Asimetría $\\gamma$: $>0$ cola a derecha, $<0$ cola a izquierda. Curtosis (en exceso) $\\kappa$: peso de las colas comparado con la normal.",
          "vars": [
            {
              "sym": "\\gamma",
              "desc": "coeficiente de asimetría (sesgo)"
            },
            {
              "sym": "x_i",
              "desc": "$i$-ésimo dato observado"
            },
            {
              "sym": "\\bar x",
              "desc": "media muestral"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "s",
              "desc": "desvío estándar muestral"
            },
            {
              "sym": "\\kappa",
              "desc": "coeficiente de curtosis en exceso (la resta de $3$ la centra en la normal)"
            }
          ],
          "note": "Cuidado: la teórica invierte el signo de $\\kappa$; verificar convención de cátedra."
        },
        {
          "label": "Cuartiles y percentiles",
          "kind": "def",
          "body": "Parten la muestra ordenada en 4 (cuartiles), 10 (deciles) o 100 (percentiles) partes iguales. $q_1$=25%, $q_2$=mediana, $q_3$=75%. Base del IQR y del boxplot.",
          "cond": "Robustos ante extremos (miden posición, no magnitud)."
        },
        {
          "label": "Boxplot · regla de Tukey",
          "kind": "method",
          "tex": "\\begin{aligned} L_W &= q_1-1.5\\cdot\\text{IQR} \\\\ U_W &= q_3+1.5\\cdot\\text{IQR} \\end{aligned}",
          "body": "Límites de Tukey que definen los bigotes del boxplot. La caja va de $q_1$ a $q_3$, con una línea en la mediana, y los bigotes llegan hasta el dato más extremo que aún cae dentro de $[L_W,U_W]$.",
          "vars": [
            {
              "sym": "L_W",
              "desc": "límite inferior del bigote (lower whisker)"
            },
            {
              "sym": "q_1",
              "desc": "primer cuartil (percentil 25)"
            },
            {
              "sym": "\\text{IQR}",
              "desc": "rango intercuartílico, $q_3-q_1$"
            },
            {
              "sym": "U_W",
              "desc": "límite superior del bigote (upper whisker)"
            },
            {
              "sym": "q_3",
              "desc": "tercer cuartil (percentil 75)"
            }
          ],
          "note": "Datos fuera de $[L_W,U_W]$ son outliers."
        },
        {
          "label": "Robustez",
          "kind": "caution",
          "body": "Mediana y MAD ($\\text{mediana}\\{|x_i-\\bar x|\\}$) son **robustos** ante outliers; media y desvío **no**. Para sueldos/precios reportar mediana.",
          "note": "Un solo valor enorme arrastra la media pero no la mediana."
        },
        {
          "label": "Datos agrupados",
          "kind": "method",
          "tex": "\\begin{aligned} \\bar x_{Ag} &= \\frac{\\sum x_i f_i}{n} \\\\ s_{Ag} &= \\sqrt{\\frac{\\sum(x_i-\\bar x_{Ag})^2 f_i}{n-1}} \\end{aligned}",
          "body": "Media y desvío cuando solo se tiene una tabla de frecuencias por intervalos: se usa la **marca de clase** $x_i=(L_i+L_{s,i})/2$ como representante de cada intervalo, ponderada por su frecuencia. Todas las medidas son **aproximaciones**.",
          "vars": [
            {
              "sym": "\\bar x_{Ag}",
              "desc": "media de datos agrupados"
            },
            {
              "sym": "x_i",
              "desc": "marca de clase del intervalo $i$, $x_i=(L_i+L_{s,i})/2$"
            },
            {
              "sym": "f_i",
              "desc": "frecuencia absoluta del intervalo $i$ (cantidad de datos en él)"
            },
            {
              "sym": "n",
              "desc": "tamaño total de la muestra, $n=\\sum f_i$"
            },
            {
              "sym": "s_{Ag}",
              "desc": "desvío estándar de datos agrupados"
            },
            {
              "sym": "L_i",
              "desc": "extremo inferior del intervalo $i$"
            },
            {
              "sym": "L_{s,i}",
              "desc": "extremo superior del intervalo $i$"
            }
          ],
          "note": "Mediana/cuartiles por interpolación lineal sobre la frecuencia acumulada."
        },
        {
          "label": "Frecuencias e histograma",
          "kind": "def",
          "body": "Frec. absoluta $n_k$, relativa $f_k=n_k/n$ ($\\sum f_k=1$). El histograma grafica $n_k$. La acumulada $F(\\alpha)=|\\{x_i\\le\\alpha\\}|/n$ es la contraparte muestral de la FDA."
        }
      ]
    },
    {
      "title": "Fundamentos de probabilidad",
      "hint": "Modelar la incertidumbre antes de observar: espacio muestral, axiomas y sus consecuencias.",
      "unit": "2",
      "entries": [
        {
          "label": "Espacio muestral y eventos",
          "kind": "def",
          "body": "Un experimento aleatorio $E$ es un procedimiento de resultado incierto. El espacio muestral $S$ reúne todos los resultados posibles, y un evento $A$ es un subconjunto de $S$ ($A\\subseteq S$). La colección de eventos a los que se les asigna probabilidad es una $\\sigma$-álgebra $\\Sigma$ (cerrada bajo complemento y uniones numerables). Dos eventos son mutuamente excluyentes (m.e.) cuando $A\\cap B=\\emptyset$, es decir, no pueden ocurrir a la vez.",
          "cond": "Si $S$ es finito se toma $\\Sigma=2^S$ (el conjunto de partes)."
        },
        {
          "label": "Axiomas de Kolmogorov",
          "kind": "theorem",
          "body": "Un espacio de probabilidad es la terna $(S,\\Sigma,P)$ donde $P$ cumple: (1) no negatividad, $P(A)\\ge 0$; (2) normalización, $P(S)=1$; (3) $\\sigma$-aditividad, si los $E_i$ son mutuamente excluyentes entonces $P\\left(\\bigcup_i E_i\\right)=\\sum_i P(E_i)$.",
          "note": "De estos tres axiomas se deducen TODAS las propiedades útiles."
        },
        {
          "label": "Consecuencias de los axiomas",
          "kind": "formula",
          "tex": "\\begin{aligned} P(A^c) &= 1-P(A) \\\\ P(\\emptyset) &= 0 \\\\ A\\subseteq B &\\Rightarrow P(A)\\le P(B) \\end{aligned}",
          "body": "Tres propiedades inmediatas: la del complemento (la probabilidad de que $A$ no ocurra es lo que falta para llegar a $1$), la del suceso imposible (tiene probabilidad nula) y la monotonía (si un evento está contenido en otro, no puede ser más probable que él).",
          "vars": [
            {
              "sym": "P(A^c)",
              "desc": "probabilidad del complemento de $A$, es decir, de que $A$ no ocurra"
            },
            {
              "sym": "P(A)",
              "desc": "probabilidad del evento $A$"
            },
            {
              "sym": "P(\\emptyset)",
              "desc": "probabilidad del suceso imposible (conjunto vacío)"
            },
            {
              "sym": "A\\subseteq B",
              "desc": "$A$ está contenido en $B$: todo resultado de $A$ también pertenece a $B$"
            },
            {
              "sym": "P(B)",
              "desc": "probabilidad del evento $B$"
            }
          ]
        },
        {
          "label": "Probabilidad de la unión",
          "kind": "formula",
          "tex": "P(A\\cup B)=P(A)+P(B)-P(A\\cap B)",
          "body": "Probabilidad de que ocurra al menos uno de los dos eventos: se suman las probabilidades individuales y se resta la intersección para no contar dos veces los resultados comunes. Para tres eventos, el principio de inclusión-exclusión da $\\sum P(A_i)-\\sum P(A_i\\cap A_j)+P(A\\cap B\\cap C)$.",
          "cond": "Si $A$ y $B$ son mutuamente excluyentes, $P(A\\cap B)=0$ y las probabilidades suman directo.",
          "vars": [
            {
              "sym": "P(A\\cup B)",
              "desc": "probabilidad de que ocurra $A$ o $B$ (al menos uno)"
            },
            {
              "sym": "P(A)",
              "desc": "probabilidad del evento $A$"
            },
            {
              "sym": "P(B)",
              "desc": "probabilidad del evento $B$"
            },
            {
              "sym": "P(A\\cap B)",
              "desc": "probabilidad de que ocurran $A$ y $B$ simultáneamente"
            }
          ]
        },
        {
          "label": "Regla de Laplace",
          "kind": "formula",
          "tex": "P(A)=\\frac{|A|}{|S|}=\\frac{\\text{casos favorables}}{\\text{casos posibles}}",
          "body": "Cuando todos los resultados del espacio muestral son igualmente probables, la probabilidad de un evento es el cociente entre la cantidad de casos favorables y la cantidad total de casos posibles.",
          "cond": "Solo si $S$ es finito y los casos son **equiprobables**.",
          "note": "Reduce el cálculo de probabilidad a contar (combinatoria).",
          "vars": [
            {
              "sym": "P(A)",
              "desc": "probabilidad del evento $A$"
            },
            {
              "sym": "|A|",
              "desc": "cantidad de resultados que componen $A$ (casos favorables)"
            },
            {
              "sym": "|S|",
              "desc": "cantidad total de resultados del espacio muestral (casos posibles)"
            }
          ]
        },
        {
          "label": "Leyes de De Morgan",
          "kind": "theorem",
          "tex": "\\begin{aligned} \\overline{A\\cup B} &= \\bar A\\cap\\bar B \\\\ \\overline{A\\cap B} &= \\bar A\\cup\\bar B \\end{aligned}",
          "body": "Reglas para negar combinaciones de eventos: el complemento de una unión es la intersección de los complementos, y el complemento de una intersección es la unión de los complementos. Permiten pasar de \"ninguno de varios\" al complemento de la unión: $P\\left(\\bigcap_i \\bar A_i\\right)=1-P\\left(\\bigcup_i A_i\\right)$.",
          "note": "Truco de parcial más frecuente.",
          "vars": [
            {
              "sym": "\\overline{A\\cup B}",
              "desc": "complemento de la unión: no ocurre ni $A$ ni $B$"
            },
            {
              "sym": "\\overline{A\\cap B}",
              "desc": "complemento de la intersección: no ocurren $A$ y $B$ a la vez"
            },
            {
              "sym": "\\bar A",
              "desc": "complemento de $A$ (que $A$ no ocurra)"
            },
            {
              "sym": "\\bar B",
              "desc": "complemento de $B$ (que $B$ no ocurra)"
            }
          ]
        }
      ]
    },
    {
      "title": "Condicional, independencia y Bayes",
      "hint": "Cómo se actualiza la probabilidad con información y cómo invertir la condicional.",
      "unit": "2",
      "entries": [
        {
          "label": "Probabilidad condicional",
          "kind": "def",
          "tex": "\\begin{aligned} P(D\\mid C) &= \\frac{P(D\\cap C)}{P(C)},\\quad P(C)\\ne 0 \\\\ P(D\\cap C) &= P(D\\mid C)\\,P(C) \\end{aligned}",
          "body": "Cuantifica la probabilidad de $D$ una vez que se sabe que ocurrió $C$: reduce el espacio muestral a $C$ y mide qué fracción de esa probabilidad cae además en $D$. La segunda línea es la regla del producto, que despeja la probabilidad de la intersección.",
          "vars": [
            {
              "sym": "P(D\\mid C)",
              "desc": "probabilidad condicional de $D$ dado que ocurrió $C$"
            },
            {
              "sym": "D",
              "desc": "evento de interés cuya probabilidad se actualiza"
            },
            {
              "sym": "C",
              "desc": "evento condicionante (información disponible), con $P(C)\\ne 0$"
            },
            {
              "sym": "P(D\\cap C)",
              "desc": "probabilidad de que ocurran $D$ y $C$ simultáneamente"
            },
            {
              "sym": "P(C)",
              "desc": "probabilidad del evento condicionante (normaliza el universo reducido)"
            }
          ],
          "note": "Indefinida si $P(C)=0$. Frases gatillo: \"si...\", \"dado que...\"."
        },
        {
          "label": "Independencia de eventos",
          "kind": "def",
          "tex": "\\begin{aligned} P(A\\cap B) &= P(A)\\,P(B) \\\\ &\\iff P(B\\mid A)=P(B) \\\\ P\\!\\left(\\bigcap_k A_k\\right) &= \\prod_k P(A_k) \\end{aligned}",
          "body": "Dos eventos son independientes cuando saber que ocurrió uno no modifica la probabilidad del otro; equivalentemente, la probabilidad de su intersección factoriza en el producto de las probabilidades. La última línea extiende la definición a una colección de eventos (independencia mutua).",
          "vars": [
            {
              "sym": "A",
              "desc": "primer evento"
            },
            {
              "sym": "B",
              "desc": "segundo evento"
            },
            {
              "sym": "P(A\\cap B)",
              "desc": "probabilidad de que ocurran $A$ y $B$ a la vez"
            },
            {
              "sym": "P(B\\mid A)",
              "desc": "probabilidad de $B$ dado $A$; bajo independencia coincide con $P(B)$"
            },
            {
              "sym": "A_k",
              "desc": "$k$-ésimo evento de la colección"
            },
            {
              "sym": "\\bigcap_k A_k",
              "desc": "ocurrencia simultánea de todos los eventos de la colección"
            },
            {
              "sym": "\\prod_k",
              "desc": "producto sobre todos los eventos de la colección"
            }
          ],
          "cond": "$\\emptyset$ y $S$ son independientes de todo."
        },
        {
          "label": "M.e. ≠ independiente",
          "kind": "caution",
          "body": "Dos eventos m.e. con probabilidad positiva **no** son independientes (si ocurrió $A$, $B$ no ocurrió: hay info). Son conceptos opuestos.",
          "note": "Error clásico: confundir $P(A\\cap B)=0$ con $P(A\\cap B)=P(A)P(B)$."
        },
        {
          "label": "Probabilidad total",
          "kind": "theorem",
          "tex": "P(B)=\\sum_k P(B\\mid A_k)\\,P(A_k)",
          "body": "Calcula la probabilidad incondicional de $B$ descomponiéndola en los aportes de cada caso de una partición: suma, sobre todos los escenarios posibles, la probabilidad de $B$ en cada uno ponderada por la probabilidad de ese escenario.",
          "vars": [
            {
              "sym": "P(B)",
              "desc": "probabilidad total (incondicional) del evento $B$"
            },
            {
              "sym": "A_k",
              "desc": "$k$-ésimo bloque de una partición de $S$ (eventos m.e. que cubren todo el espacio)"
            },
            {
              "sym": "P(B\\mid A_k)",
              "desc": "probabilidad de $B$ dentro del escenario $A_k$"
            },
            {
              "sym": "P(A_k)",
              "desc": "probabilidad (peso) del escenario $A_k$"
            },
            {
              "sym": "\\sum_k",
              "desc": "suma sobre todos los bloques de la partición"
            }
          ]
        },
        {
          "label": "Teorema de Bayes",
          "kind": "theorem",
          "tex": "P(A_i\\mid B)=\\frac{P(B\\mid A_i)\\,P(A_i)}{\\sum_k P(B\\mid A_k)\\,P(A_k)}",
          "body": "Invierte el sentido del condicionamiento: a partir de las probabilidades a priori de las causas $A_i$ y de la verosimilitud de observar $B$ en cada una, devuelve la probabilidad a posteriori de cada causa una vez observado $B$. El denominador es la probabilidad total de $B$, que normaliza el resultado.",
          "vars": [
            {
              "sym": "P(A_i\\mid B)",
              "desc": "probabilidad a posteriori de la causa $A_i$ tras observar $B$"
            },
            {
              "sym": "A_i",
              "desc": "$i$-ésima causa o hipótesis (bloque de la partición)"
            },
            {
              "sym": "B",
              "desc": "evento observado (evidencia)"
            },
            {
              "sym": "P(B\\mid A_i)",
              "desc": "verosimilitud: probabilidad de observar $B$ si la causa es $A_i$"
            },
            {
              "sym": "P(A_i)",
              "desc": "probabilidad a priori de la causa $A_i$"
            },
            {
              "sym": "\\sum_k P(B\\mid A_k)\\,P(A_k)",
              "desc": "probabilidad total de $B$ (suma sobre todas las causas $A_k$), actúa como normalizador"
            }
          ],
          "note": "Maquinaria de tests diagnósticos, fallas, falsos positivos."
        },
        {
          "label": "Árbol de probabilidades",
          "kind": "method",
          "body": "Experimentos por etapas. (1) Aristas = condicionales del hijo dado el camino; (2) hijos = partición; (3) aristas de un nodo suman 1; (4) prob. de un camino = **producto** de sus aristas.",
          "note": "Sumar hojas = prob. total; dar vuelta el árbol = Bayes."
        },
        {
          "label": "Fiabilidad serie/paralelo",
          "kind": "example",
          "tex": "\\begin{aligned} P_{\\text{serie}} &= \\prod_i p_i \\\\ P_{\\text{paralelo}} &= 1-\\prod_i q_i \\end{aligned}",
          "body": "Modela la fiabilidad de un sistema de componentes independientes. En **serie** todos deben funcionar, así que la probabilidad de éxito es el producto de las fiabilidades individuales. En **paralelo** basta con que funcione uno, por lo que el sistema falla solo si fallan todos: se toma el complemento del producto de las probabilidades de falla.",
          "vars": [
            {
              "sym": "P_{\\text{serie}}",
              "desc": "fiabilidad del sistema en serie (todos deben funcionar)"
            },
            {
              "sym": "P_{\\text{paralelo}}",
              "desc": "fiabilidad del sistema en paralelo (basta uno)"
            },
            {
              "sym": "p_i",
              "desc": "probabilidad de que el componente $i$ funcione (fiabilidad individual)"
            },
            {
              "sym": "q_i",
              "desc": "probabilidad de que el componente $i$ falle, $q_i=1-p_i$"
            },
            {
              "sym": "\\prod_i",
              "desc": "producto sobre todos los componentes del sistema"
            }
          ],
          "cond": "Componentes independientes."
        }
      ]
    },
    {
      "title": "Variable aleatoria discreta",
      "hint": "Asignar números a resultados; describir con PMF/FDA y resumir con E y V.",
      "unit": "3",
      "entries": [
        {
          "label": "V.a. discreta y PMF",
          "kind": "def",
          "tex": "\\begin{aligned} p_X(k) &= P(X=k) \\\\ \\sum_{k\\in\\mathcal R_X} p_X(k) &= 1 \\end{aligned}",
          "body": "Una variable aleatoria discreta es una función $X:S\\to\\mathbb R$ de recorrido finito o numerable. Su función de masa de probabilidad (PMF) asigna a cada valor posible la probabilidad de que la variable lo tome, y vale 0 fuera del recorrido. La segunda igualdad expresa que las masas de todos los valores del recorrido suman 1.",
          "vars": [
            {
              "sym": "p_X(k)",
              "desc": "PMF: probabilidad de que $X$ tome el valor $k$"
            },
            {
              "sym": "X",
              "desc": "variable aleatoria discreta"
            },
            {
              "sym": "k",
              "desc": "valor genérico del recorrido de $X$"
            },
            {
              "sym": "\\mathcal R_X",
              "desc": "recorrido (soporte) de $X$: conjunto de valores con probabilidad positiva"
            }
          ]
        },
        {
          "label": "FDA discreta",
          "kind": "def",
          "tex": "F_X(k)=P(X\\le k)=\\sum_{y\\le k} p_X(y)",
          "body": "La función de distribución acumulada (FDA) da la probabilidad de que $X$ no supere el valor $k$, acumulando las masas de todos los valores $\\le k$. Es escalonada: salta $p_X(k)$ en cada valor del recorrido. Es monótona no decreciente, continua a derecha, con $\\lim_{x\\to-\\infty}F_X(x)=0$ y $\\lim_{x\\to+\\infty}F_X(x)=1$.",
          "vars": [
            {
              "sym": "F_X(k)",
              "desc": "FDA de $X$ evaluada en $k$: $P(X\\le k)$"
            },
            {
              "sym": "X",
              "desc": "variable aleatoria discreta"
            },
            {
              "sym": "k",
              "desc": "punto donde se evalúa la acumulada"
            },
            {
              "sym": "y",
              "desc": "índice de la suma; recorre los valores con $y\\le k$"
            },
            {
              "sym": "p_X(y)",
              "desc": "masa de probabilidad en el valor $y$"
            }
          ],
          "note": "Recuperar PMF: $p_X(k)=F_X(k)-\\lim_{x\\to k^-}F_X(x)$ (tamaño del salto)."
        },
        {
          "label": "Probabilidades por la FDA",
          "kind": "formula",
          "tex": "\\begin{aligned} P(X<k) &= F_X(k)-p_X(k) \\\\ P(a<X\\le b) &= F_X(b)-F_X(a) \\\\ P(X>k) &= 1-F_X(k) \\end{aligned}",
          "body": "Expresan probabilidades de eventos de $X$ a partir de la FDA. En el caso discreto hay que distinguir desigualdades estrictas de no estrictas: $P(X<k)$ se obtiene restando la masa puntual $p_X(k)$, el intervalo semiabierto $(a,b]$ es una diferencia de acumuladas, y la cola superior es el complemento de la acumulada.",
          "vars": [
            {
              "sym": "P(X<k)",
              "desc": "probabilidad de que $X$ sea estrictamente menor que $k$"
            },
            {
              "sym": "F_X(k)",
              "desc": "FDA de $X$ en $k$: $P(X\\le k)$"
            },
            {
              "sym": "p_X(k)",
              "desc": "masa de probabilidad en $k$"
            },
            {
              "sym": "P(a<X\\le b)",
              "desc": "probabilidad de que $X$ caiga en el intervalo semiabierto $(a,b]$"
            },
            {
              "sym": "a",
              "desc": "extremo inferior (excluido) del intervalo"
            },
            {
              "sym": "b",
              "desc": "extremo superior (incluido) del intervalo"
            },
            {
              "sym": "P(X>k)",
              "desc": "probabilidad de la cola superior: $X$ estrictamente mayor que $k$"
            }
          ],
          "note": "En discreta $<$ vs $\\le$ difieren en la masa $p_X(k)$: cuidado."
        },
        {
          "label": "Esperanza",
          "kind": "def",
          "tex": "\\begin{aligned} E[X] &= \\mu_X = \\sum_{k} k\\,p_X(k) \\\\ E[g(X)] &= \\sum_k g(k)\\,p_X(k) \\end{aligned}",
          "body": "La esperanza es el promedio ponderado de los valores de la variable por sus probabilidades; representa el valor medio a largo plazo y el centro de masa de la PMF. No tiene por qué coincidir con un valor del recorrido. La segunda fórmula (ley del estadístico inconsciente) calcula la esperanza de una función $g(X)$ sin necesidad de hallar antes su distribución.",
          "vars": [
            {
              "sym": "E[X]",
              "desc": "esperanza (valor medio) de $X$"
            },
            {
              "sym": "\\mu_X",
              "desc": "media de $X$; notación alternativa de $E[X]$"
            },
            {
              "sym": "k",
              "desc": "índice de la suma; recorre los valores de $\\mathcal R_X$"
            },
            {
              "sym": "p_X(k)",
              "desc": "masa de probabilidad en el valor $k$"
            },
            {
              "sym": "E[g(X)]",
              "desc": "esperanza de la función $g$ aplicada a $X$"
            },
            {
              "sym": "g(k)",
              "desc": "función real evaluada en el valor $k$"
            }
          ]
        },
        {
          "label": "Linealidad de E",
          "kind": "theorem",
          "tex": "E[aX+bY+c]=a\\,E[X]+b\\,E[Y]+c",
          "body": "La esperanza es un operador lineal: la esperanza de una combinación lineal de variables es la misma combinación lineal de sus esperanzas. En particular $E[X+Y]=E[X]+E[Y]$ vale **siempre**, aun sin independencia entre $X$ e $Y$.",
          "vars": [
            {
              "sym": "E[aX+bY+c]",
              "desc": "esperanza de la combinación lineal"
            },
            {
              "sym": "a",
              "desc": "coeficiente (constante) que multiplica a $X$"
            },
            {
              "sym": "X",
              "desc": "primera variable aleatoria"
            },
            {
              "sym": "b",
              "desc": "coeficiente (constante) que multiplica a $Y$"
            },
            {
              "sym": "Y",
              "desc": "segunda variable aleatoria"
            },
            {
              "sym": "c",
              "desc": "término constante (corrimiento)"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza de $X$"
            },
            {
              "sym": "E[Y]",
              "desc": "esperanza de $Y$"
            }
          ],
          "note": "Pero $E[XY]\\ne E[X]E[Y]$ en general (requiere independencia)."
        },
        {
          "label": "Varianza (fórmula de cálculo)",
          "kind": "formula",
          "tex": "V(X)=\\sigma_X^2=E[(X-\\mu_X)^2]=E[X^2]-(E[X])^2",
          "body": "La varianza mide la dispersión de $X$ alrededor de su media como esperanza del desvío cuadrático. La forma de cálculo $E[X^2]-(E[X])^2$ suele ser más cómoda. El desvío estándar $\\sigma_X=\\sqrt{V(X)}$ queda en las mismas unidades que $X$.",
          "vars": [
            {
              "sym": "V(X)",
              "desc": "varianza de $X$"
            },
            {
              "sym": "\\sigma_X^2",
              "desc": "notación alternativa de la varianza de $X$"
            },
            {
              "sym": "X",
              "desc": "variable aleatoria discreta"
            },
            {
              "sym": "\\mu_X",
              "desc": "media de $X$: $E[X]$"
            },
            {
              "sym": "E[X^2]",
              "desc": "momento de segundo orden (esperanza de $X^2$)"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza (media) de $X$"
            }
          ]
        },
        {
          "label": "Propiedades de V",
          "kind": "theorem",
          "tex": "\\begin{aligned} V(aX+c) &= a^2 V(X) \\\\ \\sigma(aX+c) &= |a|\\,\\sigma(X) \\\\ V(c) &= 0 \\end{aligned}",
          "body": "Describen cómo se transforma la dispersión bajo una transformación afín: la varianza no se afecta por el corrimiento $c$ y escala con el cuadrado del factor $a$, mientras que el desvío estándar escala con $|a|$. La varianza de una constante es 0 porque no hay variabilidad.",
          "vars": [
            {
              "sym": "V(aX+c)",
              "desc": "varianza de la transformación afín de $X$"
            },
            {
              "sym": "a",
              "desc": "factor de escala (constante)"
            },
            {
              "sym": "X",
              "desc": "variable aleatoria discreta"
            },
            {
              "sym": "c",
              "desc": "corrimiento (constante aditiva)"
            },
            {
              "sym": "V(X)",
              "desc": "varianza de $X$"
            },
            {
              "sym": "\\sigma(aX+c)",
              "desc": "desvío estándar de la transformación afín"
            },
            {
              "sym": "\\sigma(X)",
              "desc": "desvío estándar de $X$"
            },
            {
              "sym": "V(c)",
              "desc": "varianza de una constante"
            }
          ],
          "note": "$V(X+Y)\\ne V(X)+V(Y)$ en general (requiere independencia)."
        },
        {
          "label": "FGM",
          "kind": "def",
          "tex": "\\begin{aligned} M_X(t) &= E[e^{tX}] \\\\ E[X^k] &= M_X^{(k)}(0) \\end{aligned}",
          "body": "La función generadora de momentos (FGM) empaqueta todos los momentos de $X$ en una sola función: la derivada $k$-ésima evaluada en $0$ da el momento de orden $k$. Cuando existe en un entorno de $0$, caracteriza unívocamente la distribución. Bajo transformación afín vale $M_{aX+b}(t)=e^{bt}M_X(at)$.",
          "vars": [
            {
              "sym": "M_X(t)",
              "desc": "FGM de $X$ evaluada en el parámetro $t$"
            },
            {
              "sym": "t",
              "desc": "variable auxiliar (real) de la transformada"
            },
            {
              "sym": "X",
              "desc": "variable aleatoria discreta"
            },
            {
              "sym": "E[X^k]",
              "desc": "momento de orden $k$ de $X$"
            },
            {
              "sym": "k",
              "desc": "orden del momento (entero $\\ge 1$)"
            },
            {
              "sym": "M_X^{(k)}(0)",
              "desc": "derivada $k$-ésima de la FGM evaluada en $t=0$"
            }
          ],
          "cond": "Suma de independientes: $M_{X+Y}=M_X\\cdot M_Y$."
        }
      ]
    },
    {
      "title": "Distribuciones discretas",
      "hint": "Catálogo: recorrido, E, V y cuándo usar cada una.",
      "unit": "3",
      "entries": [
        {
          "label": "Bernoulli$(p)$",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(1) &= p \\\\ p_X(0) &= q \\\\ E[X] &= p \\\\ V(X) &= pq \\end{aligned}",
          "body": "Modela un único ensayo con dos resultados posibles, éxito ($X=1$) o fracaso ($X=0$). Su FGM es $q+pe^t$ y la varianza es máxima cuando $p=1/2$.",
          "vars": [
            {
              "sym": "X",
              "desc": "indicador del ensayo: vale $1$ en éxito y $0$ en fracaso"
            },
            {
              "sym": "p",
              "desc": "probabilidad de éxito, $p\\in[0,1]$"
            },
            {
              "sym": "q",
              "desc": "probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "p_X",
              "desc": "función de probabilidad puntual de $X$"
            },
            {
              "sym": "E[X]",
              "desc": "valor esperado (media) de $X$"
            },
            {
              "sym": "V(X)",
              "desc": "varianza de $X$"
            }
          ]
        },
        {
          "label": "Binomial$(n,p)$",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(k) &= \\binom{n}{k}p^k q^{n-k} \\\\ E &= np \\\\ V &= npq \\end{aligned}",
          "body": "Cuenta la cantidad de éxitos en $n$ ensayos independientes e idénticamente distribuidos; equivale a la suma de $n$ Bernoulli$(p)$. El recorrido es $k\\in\\{0,\\dots,n\\}$.",
          "vars": [
            {
              "sym": "X",
              "desc": "número de éxitos en los $n$ ensayos"
            },
            {
              "sym": "n",
              "desc": "cantidad de ensayos i.i.d."
            },
            {
              "sym": "k",
              "desc": "número de éxitos observados, $k\\in\\{0,\\dots,n\\}$"
            },
            {
              "sym": "p",
              "desc": "probabilidad de éxito en cada ensayo"
            },
            {
              "sym": "q",
              "desc": "probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "\\binom{n}{k}",
              "desc": "número de formas de elegir $k$ éxitos entre $n$ ensayos"
            },
            {
              "sym": "E",
              "desc": "valor esperado (media) de $X$"
            },
            {
              "sym": "V",
              "desc": "varianza de $X$"
            }
          ],
          "cond": "Reproductiva: $\\text{Bin}(n_1,p)+\\text{Bin}(n_2,p)=\\text{Bin}(n_1+n_2,p)$."
        },
        {
          "label": "Geométrica$(p)$",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(k) &= q^k p, \\quad k\\in\\mathbb N_0 \\\\ E &= \\frac{q}{p} \\\\ V &= \\frac{q}{p^2} \\end{aligned}",
          "body": "Cuenta el número de **fracasos** previos al primer éxito (convención de la cátedra). Cumple la propiedad de falta de memoria: $P(X\\ge L+\\Delta\\mid X\\ge L)=P(X\\ge\\Delta)$.",
          "vars": [
            {
              "sym": "X",
              "desc": "número de fracasos antes del primer éxito"
            },
            {
              "sym": "k",
              "desc": "valor de $X$, con $k\\in\\mathbb N_0$"
            },
            {
              "sym": "\\mathbb N_0",
              "desc": "naturales incluyendo el cero: $\\{0,1,2,\\dots\\}$"
            },
            {
              "sym": "p",
              "desc": "probabilidad de éxito en cada ensayo"
            },
            {
              "sym": "q",
              "desc": "probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "E",
              "desc": "valor esperado (media) de $X$"
            },
            {
              "sym": "V",
              "desc": "varianza de $X$"
            }
          ],
          "note": "Versión \"nº de ensayos\" $Y=X+1$: $E[Y]=1/p$. NO mezclar."
        },
        {
          "label": "Binomial negativa$(r,p)$",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(k) &= \\binom{k+r-1}{k}q^k p^r \\\\ E &= \\frac{rq}{p} \\\\ V &= \\frac{rq}{p^2} \\end{aligned}",
          "body": "Cuenta el número de fracasos hasta alcanzar el $r$-ésimo éxito (distribución de Pascal); equivale a la suma de $r$ geométricas i.i.d.",
          "vars": [
            {
              "sym": "X",
              "desc": "número de fracasos hasta el $r$-ésimo éxito"
            },
            {
              "sym": "k",
              "desc": "valor de $X$, con $k\\in\\mathbb N_0$"
            },
            {
              "sym": "r",
              "desc": "número de éxitos que se esperan alcanzar"
            },
            {
              "sym": "p",
              "desc": "probabilidad de éxito en cada ensayo"
            },
            {
              "sym": "q",
              "desc": "probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "\\binom{k+r-1}{k}",
              "desc": "formas de ubicar los $k$ fracasos entre los primeros $k+r-1$ ensayos"
            },
            {
              "sym": "E",
              "desc": "valor esperado (media) de $X$"
            },
            {
              "sym": "V",
              "desc": "varianza de $X$"
            }
          ]
        },
        {
          "label": "Hipergeométrica$(N,M,n)$",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(k) &= \\frac{\\binom{M}{k}\\binom{N-M}{n-k}}{\\binom{N}{n}} \\\\ E &= n\\tfrac{M}{N}=np \\\\ V &= npq\\,\\tfrac{N-n}{N-1} \\end{aligned}",
          "body": "Modela el muestreo **sin reposición** de $n$ elementos de una población finita con $M$ éxitos sobre $N$ totales. Respecto de la binomial aparece el factor de corrección $\\frac{N-n}{N-1}$.",
          "vars": [
            {
              "sym": "X",
              "desc": "número de éxitos en la muestra extraída"
            },
            {
              "sym": "N",
              "desc": "tamaño total de la población"
            },
            {
              "sym": "M",
              "desc": "cantidad de éxitos en la población"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra extraída"
            },
            {
              "sym": "k",
              "desc": "número de éxitos observados en la muestra"
            },
            {
              "sym": "p",
              "desc": "proporción de éxitos en la población, $p=M/N$"
            },
            {
              "sym": "q",
              "desc": "proporción de fracasos en la población, $q=1-p$"
            },
            {
              "sym": "\\binom{M}{k}",
              "desc": "formas de elegir $k$ éxitos entre los $M$ disponibles"
            },
            {
              "sym": "\\binom{N-M}{n-k}",
              "desc": "formas de elegir $n-k$ fracasos entre los $N-M$ disponibles"
            },
            {
              "sym": "\\binom{N}{n}",
              "desc": "formas totales de elegir la muestra de tamaño $n$"
            },
            {
              "sym": "\\tfrac{N-n}{N-1}",
              "desc": "factor de corrección por población finita"
            },
            {
              "sym": "E",
              "desc": "valor esperado (media) de $X$"
            },
            {
              "sym": "V",
              "desc": "varianza de $X$"
            }
          ],
          "cond": "Si $N\\gg n$ se aproxima por Binomial$(n,M/N)$."
        },
        {
          "label": "Poisson$(\\lambda)$",
          "kind": "formula",
          "tex": "\\begin{aligned} p_X(k) &= \\frac{\\lambda^k}{k!}e^{-\\lambda} \\\\ E = V &= \\lambda \\end{aligned}",
          "body": "Modela el conteo de ocurrencias en un intervalo de tiempo o espacio a tasa constante. Su sello es que **media y varianza coinciden** y su FGM es $e^{\\lambda(e^t-1)}$.",
          "vars": [
            {
              "sym": "X",
              "desc": "número de ocurrencias en el intervalo"
            },
            {
              "sym": "k",
              "desc": "valor de $X$, con $k\\in\\mathbb N_0$"
            },
            {
              "sym": "\\lambda",
              "desc": "tasa media de ocurrencias por intervalo, $\\lambda>0$"
            },
            {
              "sym": "k!",
              "desc": "factorial de $k$"
            },
            {
              "sym": "E",
              "desc": "valor esperado (media) de $X$"
            },
            {
              "sym": "V",
              "desc": "varianza de $X$"
            }
          ],
          "cond": "Reproductiva; aprox. de Bin con $n$ grande, $p$ chico, $\\lambda=np$."
        },
        {
          "label": "Reconocer distribución discreta",
          "kind": "method",
          "body": "1 ensayo→Bernoulli; nº éxitos en $n$→Binomial; espera al 1er éxito→Geométrica; al $r$-ésimo→BinNeg; sin reposición→Hipergeométrica; conteos/tasa→Poisson.",
          "note": "Pistas: \"hasta que\", \"sin devolver\", \"en promedio λ por...\"."
        },
        {
          "label": "Teoría de la decisión",
          "kind": "method",
          "body": "Elegir entre alternativas inciertas **maximizando el valor esperado** de la ganancia. Construir la v.a. de cada opción, calcular $E[\\cdot]$ y comparar.",
          "cond": "Criterio del vendedor de diarios."
        }
      ]
    },
    {
      "title": "Variable aleatoria continua",
      "hint": "El continuo: densidad, integrales y confiabilidad.",
      "unit": "4",
      "entries": [
        {
          "label": "V.a. continua",
          "kind": "def",
          "tex": "\\begin{aligned} X\\text{ continua} &\\iff F_X\\text{ continua} \\\\ &\\iff P(X=\\alpha)=0\\ \\ \\forall\\alpha \\end{aligned}",
          "body": "Una variable aleatoria es continua cuando toma valores en un continuo y su función de distribución no tiene saltos. La probabilidad de cualquier punto aislado es nula, así que solo los **intervalos** acumulan probabilidad positiva.",
          "vars": [
            {
              "sym": "X",
              "desc": "variable aleatoria en estudio"
            },
            {
              "sym": "F_X",
              "desc": "función de distribución acumulada de $X$"
            },
            {
              "sym": "\\alpha",
              "desc": "valor puntual cualquiera del recorrido de $X$"
            }
          ],
          "note": "Ventaja: $<$ y $\\le$ dan lo mismo (no hay que cuidar bordes)."
        },
        {
          "label": "Función de densidad (pdf)",
          "kind": "def",
          "tex": "\\begin{aligned} f_X(x) &= F_X'(x)\\ge 0 \\\\ \\int_{-\\infty}^{+\\infty} f_X &= 1 \\end{aligned}",
          "body": "La densidad es el análogo continuo de la PMF: es la derivada de la FDA y describe la \"probabilidad por unidad de longitud\" (una tasa), **no** una probabilidad, por lo que puede valer $>1$. Es no negativa e integra $1$ en toda la recta.",
          "vars": [
            {
              "sym": "f_X(x)",
              "desc": "función de densidad de $X$ evaluada en $x$"
            },
            {
              "sym": "F_X'(x)",
              "desc": "derivada de la FDA respecto de $x$"
            },
            {
              "sym": "x",
              "desc": "punto del recorrido donde se evalúa la densidad"
            }
          ],
          "cond": "$P(a<X\\le b)=\\int_a^b f_X=F_X(b)-F_X(a)$."
        },
        {
          "label": "FDA y recíproco",
          "kind": "formula",
          "tex": "\\begin{aligned} F_X(x) &= \\int_{-\\infty}^{x} f_X(y)\\,dy \\\\ P(a<X<b) &= F_X(b)-F_X(a) \\end{aligned}",
          "body": "La FDA se obtiene integrando la densidad desde $-\\infty$ hasta el punto; es no decreciente y va de $0$ a $1$. Recíprocamente, la probabilidad de un intervalo es la diferencia de la FDA en sus extremos.",
          "vars": [
            {
              "sym": "F_X(x)",
              "desc": "función de distribución acumulada en $x$"
            },
            {
              "sym": "f_X(y)",
              "desc": "densidad de $X$, variable de integración $y$"
            },
            {
              "sym": "x",
              "desc": "límite superior de integración"
            },
            {
              "sym": "a,\\,b",
              "desc": "extremos del intervalo, con $a<b$"
            }
          ]
        },
        {
          "label": "Esperanza y varianza por integral",
          "kind": "formula",
          "tex": "\\begin{aligned} E[g(X)] &= \\int g(x)f_X(x)\\,dx \\\\ V(X) &= \\int (x-\\mu)^2 f_X\\,dx = E[X^2]-\\mu^2 \\end{aligned}",
          "body": "En el caso continuo, esperanza y varianza se calculan integrando contra la densidad, reemplazando las sumas del caso discreto. La esperanza de una función $g(X)$ se obtiene por la ley del estadístico inconsciente, y la varianza admite también la forma de cómputo $E[X^2]-\\mu^2$.",
          "vars": [
            {
              "sym": "E[g(X)]",
              "desc": "esperanza de una función $g$ de $X$"
            },
            {
              "sym": "g(x)",
              "desc": "función aplicada a la variable"
            },
            {
              "sym": "x",
              "desc": "variable de integración"
            },
            {
              "sym": "f_X(x)",
              "desc": "densidad de $X$"
            },
            {
              "sym": "V(X)",
              "desc": "varianza de $X$"
            },
            {
              "sym": "\\mu",
              "desc": "esperanza de $X$, $\\mu=E[X]$"
            },
            {
              "sym": "E[X^2]",
              "desc": "momento de segundo orden de $X$"
            }
          ]
        },
        {
          "label": "Esperanza por la cola",
          "kind": "formula",
          "tex": "\\begin{aligned} E[X] &= \\int_0^{\\infty}\\big(1-F_X(x)\\big)\\,dx \\\\ &= \\int_0^{\\infty} P(X>x)\\,dx \\end{aligned}",
          "body": "Para variables no negativas, la esperanza es el área bajo la función de supervivencia $1-F_X$. Permite calcular $E[X]$ integrando la cola superior, sin pasar por la densidad.",
          "vars": [
            {
              "sym": "E[X]",
              "desc": "esperanza de $X$"
            },
            {
              "sym": "F_X(x)",
              "desc": "función de distribución acumulada en $x$"
            },
            {
              "sym": "1-F_X(x)",
              "desc": "función de supervivencia, $P(X>x)$"
            },
            {
              "sym": "x",
              "desc": "variable de integración sobre $[0,\\infty)$"
            }
          ],
          "cond": "Solo para $X\\ge 0$.",
          "note": "Útil cuando se conoce $F_X$ pero la densidad es incómoda."
        },
        {
          "label": "Tasa de fallas (hazard)",
          "kind": "def",
          "tex": "\\begin{aligned} R(t) &= \\frac{f_T(t)}{1-F_T(t)} = -\\frac{d}{dt}\\ln S(t) \\\\ S(t) &= P(T>t) \\end{aligned}",
          "body": "La tasa de fallas mide el ritmo instantáneo de falla en $t$ condicionado a haber sobrevivido hasta ese instante. Su comportamiento clasifica el sistema: creciente indica desgaste, decreciente mortalidad infantil y constante fallas al azar.",
          "vars": [
            {
              "sym": "R(t)",
              "desc": "tasa de fallas (hazard) en el instante $t$"
            },
            {
              "sym": "T",
              "desc": "tiempo de vida (variable continua positiva)"
            },
            {
              "sym": "f_T(t)",
              "desc": "densidad del tiempo de vida en $t$"
            },
            {
              "sym": "F_T(t)",
              "desc": "FDA del tiempo de vida en $t$"
            },
            {
              "sym": "S(t)",
              "desc": "función de supervivencia, $S(t)=P(T>t)=1-F_T(t)$"
            },
            {
              "sym": "t",
              "desc": "instante de tiempo, $t\\ge 0$"
            }
          ],
          "cond": "$S(t)=\\exp(-\\int_0^t R)$."
        },
        {
          "label": "Caracterización exponencial",
          "kind": "theorem",
          "body": "$T$ continua positiva es **exponencial** $\\iff$ su tasa de fallas $R(t)$ es **constante**. Esta caracterización reexpresa la propiedad de falta de memoria de la exponencial en términos de confiabilidad.",
          "note": "$R$ constante $\\lambda \\Rightarrow S(t)=e^{-\\lambda t}$."
        },
        {
          "label": "Mínimo de exponenciales (serie)",
          "kind": "theorem",
          "tex": "T=\\min(X_1,\\dots,X_n)\\sim\\text{Expo}\\Big(\\sum_i\\lambda_i\\Big)",
          "body": "El mínimo de exponenciales independientes vuelve a ser exponencial con parámetro igual a la suma de las tasas. Modela un sistema en serie, que falla apenas falla uno de sus componentes: $P(T>t)=\\prod e^{-\\lambda_i t}$.",
          "vars": [
            {
              "sym": "T",
              "desc": "tiempo de falla del sistema en serie"
            },
            {
              "sym": "\\min(X_1,\\dots,X_n)",
              "desc": "menor de los $n$ tiempos de vida individuales"
            },
            {
              "sym": "X_i",
              "desc": "tiempo de vida del componente $i$, exponencial e independiente"
            },
            {
              "sym": "\\lambda_i",
              "desc": "tasa de falla del componente $i$"
            },
            {
              "sym": "\\sum_i\\lambda_i",
              "desc": "tasa resultante del sistema, suma de las tasas, $i=1,\\dots,n$"
            }
          ],
          "note": "No confundir con la suma de exponenciales (Gamma, standby)."
        }
      ]
    },
    {
      "title": "Distribuciones continuas",
      "hint": "Uniforme, exponencial, normal, Weibull y la estandarización.",
      "unit": "4",
      "entries": [
        {
          "label": "Uniforme$(a,b)$",
          "kind": "formula",
          "tex": "\\begin{aligned} f_X(x) &= \\tfrac{1}{b-a} \\quad \\text{en }(a,b) \\\\ E[X] &= \\tfrac{a+b}{2} \\\\ V(X) &= \\tfrac{(b-a)^2}{12} \\end{aligned}",
          "body": "Modela un valor igualmente probable en todo el intervalo $(a,b)$: la densidad es constante y la FDA crece linealmente, $F_X(x)=\\frac{x-a}{b-a}$.",
          "vars": [
            {
              "sym": "f_X(x)",
              "desc": "función de densidad de $X$"
            },
            {
              "sym": "a",
              "desc": "extremo inferior del intervalo"
            },
            {
              "sym": "b",
              "desc": "extremo superior del intervalo"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza (valor medio), punto medio del intervalo"
            },
            {
              "sym": "V(X)",
              "desc": "varianza de $X$"
            }
          ]
        },
        {
          "label": "Exponencial$(\\lambda)$",
          "kind": "formula",
          "tex": "\\begin{aligned} f_X(x) &= \\lambda e^{-\\lambda x} \\quad (x>0) \\\\ E[X] &= \\tfrac{1}{\\lambda} \\\\ V(X) &= \\tfrac{1}{\\lambda^2} \\end{aligned}",
          "body": "Modela el tiempo de espera hasta el próximo suceso de un proceso sin memoria. La cola es $P(X>x)=e^{-\\lambda x}$ y la media coincide con el desvío estándar.",
          "vars": [
            {
              "sym": "f_X(x)",
              "desc": "función de densidad de $X$"
            },
            {
              "sym": "\\lambda",
              "desc": "tasa de ocurrencia (sucesos por unidad de tiempo), $\\lambda>0$"
            },
            {
              "sym": "x",
              "desc": "tiempo de espera, $x>0$"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza (tiempo medio de espera)"
            },
            {
              "sym": "V(X)",
              "desc": "varianza de $X$"
            }
          ],
          "cond": "Única continua **sin memoria**; análogo continuo de la geométrica."
        },
        {
          "label": "Normal$N(\\mu,\\sigma)$",
          "kind": "formula",
          "tex": "\\begin{aligned} f_X(x) &= \\frac{1}{\\sqrt{2\\pi}\\,\\sigma}\\,e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}} \\\\ E[X] &= \\mu \\\\ V(X) &= \\sigma^2 \\end{aligned}",
          "body": "Campana simétrica centrada en $\\mu$ y de ancho gobernado por $\\sigma$. Tiene asimetría y curtosis (en exceso) nulas, $\\gamma=0$, $\\kappa=0$, y su FDA se expresa vía la normal estándar, $F_X(x)=\\Phi\\big(\\frac{x-\\mu}{\\sigma}\\big)$.",
          "vars": [
            {
              "sym": "f_X(x)",
              "desc": "función de densidad de $X$"
            },
            {
              "sym": "\\mu",
              "desc": "media (centro de la campana)"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar (ancho de la campana), $\\sigma>0$"
            },
            {
              "sym": "x",
              "desc": "valor de la variable"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza de $X$"
            },
            {
              "sym": "V(X)",
              "desc": "varianza de $X$"
            }
          ],
          "note": "Cátedra: segundo parámetro = **desvío** $\\sigma$, no varianza."
        },
        {
          "label": "Regla empírica 68-95-99.7",
          "kind": "example",
          "tex": "\\begin{aligned} P(|X-\\mu|<\\sigma) &\\approx 0.683 \\\\ P(|X-\\mu|<2\\sigma) &\\approx 0.954 \\\\ P(|X-\\mu|<3\\sigma) &\\approx 0.997 \\end{aligned}",
          "body": "Aproxima la probabilidad de que una normal caiga dentro de 1, 2 o 3 desvíos de su media: alrededor del 68 %, 95 % y 99.7 % de la masa, respectivamente.",
          "vars": [
            {
              "sym": "X",
              "desc": "variable normal"
            },
            {
              "sym": "\\mu",
              "desc": "media de $X$"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar de $X$"
            }
          ],
          "cond": "Solo para la normal."
        },
        {
          "label": "Estandarización",
          "kind": "method",
          "tex": "\\begin{aligned} Z &= \\frac{X-\\mu}{\\sigma} \\sim N(0,1) \\\\ \\Phi(-z) &= 1-\\Phi(z) \\end{aligned}",
          "body": "Convierte cualquier normal en la normal estándar $Z$ para usar tablas. De probabilidad a valor: se busca $\\Phi$; de valor a probabilidad: se usa el fractil $x_\\alpha=\\mu+\\sigma z_\\alpha$. La identidad de simetría da las colas izquierdas a partir de las derechas.",
          "vars": [
            {
              "sym": "Z",
              "desc": "variable estandarizada, $Z\\sim N(0,1)$"
            },
            {
              "sym": "X",
              "desc": "variable normal original"
            },
            {
              "sym": "\\mu",
              "desc": "media de $X$"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar de $X$"
            },
            {
              "sym": "\\Phi",
              "desc": "FDA de la normal estándar"
            },
            {
              "sym": "z",
              "desc": "valor estandarizado (argumento de $\\Phi$)"
            }
          ],
          "note": "Fractiles: $z_{0.90}{=}1.2816$, $z_{0.95}{=}1.6449$, $z_{0.975}{=}1.96$, $z_{0.99}{=}2.3263$. Interpolar entre filas."
        },
        {
          "label": "Weibull$(\\lambda,b)$",
          "kind": "formula",
          "tex": "\\begin{aligned} F_X(x) &= 1-e^{-(\\lambda x)^b} \\quad (x>0) \\\\ R(t) &= \\lambda b(\\lambda t)^{b-1} \\end{aligned}",
          "body": "Modelo estándar de confiabilidad: la FDA da la probabilidad de falla acumulada y la tasa de fallas varía como una potencia de $t$, lo que permite representar distintos regímenes de desgaste.",
          "vars": [
            {
              "sym": "F_X(x)",
              "desc": "FDA (probabilidad de falla acumulada hasta $x$)"
            },
            {
              "sym": "\\lambda",
              "desc": "parámetro de escala (tasa), $\\lambda>0$"
            },
            {
              "sym": "b",
              "desc": "parámetro de forma, $b>0$"
            },
            {
              "sym": "x",
              "desc": "valor de la variable, $x>0$"
            },
            {
              "sym": "R(t)",
              "desc": "tasa de fallas en el instante $t$"
            },
            {
              "sym": "t",
              "desc": "tiempo"
            }
          ],
          "cond": "$b=1$ recupera la exponencial; $b>1$ desgaste, $b<1$ mortalidad infantil."
        },
        {
          "label": "Distribución de $Y=g(X)$ (método FDA)",
          "kind": "method",
          "body": "Obtiene la distribución de una variable transformada $Y=g(X)$. 1) Plantear $F_Y(y)=P(g(X)\\le y)$ reescrito como evento sobre $X$ y evaluar en $F_X$. 2) Derivar para hallar $f_Y$, o sumar las masas de las preimágenes (caso discreto).",
          "cond": "Afín: $Y=aX+b\\Rightarrow \\mu_Y=a\\mu_X+b$, $\\sigma_Y=|a|\\sigma_X$. Normal cerrada por afines."
        },
        {
          "label": "$g$ no inyectiva",
          "kind": "caution",
          "body": "Cuando $g$ no es inyectiva hay que sumar todas las ramas de la preimagen. Para $Y=X^2$: $P(X^2\\le w)=P(-\\sqrt w\\le X\\le\\sqrt w)$. Con $V\\sim N(0,1)$ resulta $V^2\\sim\\chi^2_1$.",
          "note": "Transformada inversa: $F_X^{-1}(U)$ con $U\\sim\\text{Unif}(0,1)$ genera la distribución de $X$."
        }
      ]
    },
    {
      "title": "Variables bidimensionales",
      "hint": "Conjunta, marginales, condicionales; covarianza, correlación e independencia.",
      "unit": "5",
      "entries": [
        {
          "label": "Conjunta y marginales",
          "kind": "def",
          "tex": "\\begin{aligned} f_X(x) &= \\int f_{X,Y}(x,y)\\,dy \\\\ p_X(x) &= \\sum_y p_{X,Y}(x,y) \\end{aligned}",
          "body": "La distribución conjunta concentra toda la información del par $(X,Y)$. Las marginales se obtienen por marginalización: integrar (caso continuo) o sumar (caso discreto) sobre la otra variable, recuperando así la ley de una sola componente.",
          "vars": [
            {
              "sym": "f_X(x)",
              "desc": "densidad marginal de $X$ (caso continuo)"
            },
            {
              "sym": "f_{X,Y}(x,y)",
              "desc": "densidad conjunta del par $(X,Y)$"
            },
            {
              "sym": "p_X(x)",
              "desc": "función de probabilidad puntual marginal de $X$ (caso discreto)"
            },
            {
              "sym": "p_{X,Y}(x,y)",
              "desc": "función de probabilidad puntual conjunta de $(X,Y)$"
            },
            {
              "sym": "\\sum_y",
              "desc": "suma sobre todos los valores posibles de $Y$"
            }
          ],
          "note": "Las marginales NO determinan la conjunta."
        },
        {
          "label": "Condicional y esperanza condicional",
          "kind": "def",
          "tex": "\\begin{aligned} f_{X\\mid Y}(x\\mid y) &= \\frac{f_{X,Y}(x,y)}{f_Y(y)} \\\\ E[X\\mid Y=y] &= \\int x\\,f_{X\\mid Y}\\,dx \\end{aligned}",
          "body": "La densidad condicional describe la ley de $X$ una vez fijado el valor $Y=y$, reescalando la conjunta por la marginal de $Y$. Su esperanza es el promedio de $X$ dentro de ese subconjunto. Cuidado: $E[X\\mid Y=y]$ es un número; $E[X\\mid Y]$ es una **función de $Y$** (v.a.).",
          "vars": [
            {
              "sym": "f_{X\\mid Y}(x\\mid y)",
              "desc": "densidad condicional de $X$ dado $Y=y$"
            },
            {
              "sym": "f_{X,Y}(x,y)",
              "desc": "densidad conjunta del par $(X,Y)$"
            },
            {
              "sym": "f_Y(y)",
              "desc": "densidad marginal de $Y$, evaluada en el valor condicionante"
            },
            {
              "sym": "E[X\\mid Y=y]",
              "desc": "esperanza condicional de $X$ dado el valor fijo $Y=y$ (un número)"
            }
          ]
        },
        {
          "label": "Independencia de v.a.",
          "kind": "def",
          "tex": "X,Y\\text{ indep.}\\iff f_{X,Y}=f_X\\cdot f_Y\\ (\\text{o }p_{X,Y}=p_X\\,p_Y)",
          "body": "Dos variables son independientes si y solo si la conjunta factoriza como producto de las marginales (en densidades o en probabilidades puntuales). Es equivalente a que la condicional coincida con la marginal: $f_{X\\mid Y}=f_X$.",
          "vars": [
            {
              "sym": "f_{X,Y}",
              "desc": "densidad conjunta del par $(X,Y)$"
            },
            {
              "sym": "f_X",
              "desc": "densidad marginal de $X$"
            },
            {
              "sym": "f_Y",
              "desc": "densidad marginal de $Y$"
            },
            {
              "sym": "p_{X,Y}",
              "desc": "función de probabilidad puntual conjunta (caso discreto)"
            },
            {
              "sym": "p_X",
              "desc": "función de probabilidad puntual marginal de $X$"
            },
            {
              "sym": "p_Y",
              "desc": "función de probabilidad puntual marginal de $Y$"
            }
          ],
          "cond": "Consecuencias: $E[XY]=E[X]E[Y]$, $\\text{Cov}=0$, $V(X+Y)=V(X)+V(Y)$."
        },
        {
          "label": "Soporte no rectangular ⇒ dependencia",
          "kind": "caution",
          "body": "Si el soporte de $f_{X,Y}$ no es un rectángulo $A\\times B$ (p. ej. $0<y<x<1$), $X$ e $Y$ **no** pueden ser independientes (el rango de $Y$ depende de $X$).",
          "note": "Detección rápida sin calcular. También: cero en celda con marginales positivas."
        },
        {
          "label": "Covarianza",
          "kind": "formula",
          "tex": "\\begin{aligned} \\text{Cov}(X,Y) &= E[(X-\\mu_X)(Y-\\mu_Y)] \\\\ &= E[XY]-\\mu_X\\mu_Y \\end{aligned}",
          "body": "Mide la asociación lineal entre $X$ e $Y$: positiva cuando tienden a desviarse de sus medias en el mismo sentido y negativa en sentido opuesto. Es bilineal y cumple $\\text{Cov}(X,X)=V(X)$. La segunda igualdad es la fórmula de cálculo abreviada.",
          "vars": [
            {
              "sym": "\\text{Cov}(X,Y)",
              "desc": "covarianza entre $X$ e $Y$"
            },
            {
              "sym": "E[XY]",
              "desc": "esperanza del producto $XY$"
            },
            {
              "sym": "\\mu_X",
              "desc": "media de $X$, $\\mu_X=E[X]$"
            },
            {
              "sym": "\\mu_Y",
              "desc": "media de $Y$, $\\mu_Y=E[Y]$"
            }
          ],
          "cond": "$\\text{Cov}(aX{+}b,cY{+}d)=ac\\,\\text{Cov}(X,Y)$."
        },
        {
          "label": "Varianza de combinación lineal",
          "kind": "formula",
          "tex": "V(aX+bY)=a^2V(X)+2ab\\,\\text{Cov}(X,Y)+b^2V(Y)",
          "body": "Varianza de una combinación lineal de dos variables. Al término esperado $a^2V(X)+b^2V(Y)$ se suma un término cruzado $2ab\\,\\text{Cov}(X,Y)$ que se anula solo si $X$ e $Y$ están incorrelacionadas.",
          "vars": [
            {
              "sym": "V(aX+bY)",
              "desc": "varianza de la combinación lineal $aX+bY$"
            },
            {
              "sym": "a",
              "desc": "coeficiente (constante) que multiplica a $X$"
            },
            {
              "sym": "b",
              "desc": "coeficiente (constante) que multiplica a $Y$"
            },
            {
              "sym": "V(X)",
              "desc": "varianza de $X$"
            },
            {
              "sym": "V(Y)",
              "desc": "varianza de $Y$"
            },
            {
              "sym": "\\text{Cov}(X,Y)",
              "desc": "covarianza entre $X$ e $Y$"
            }
          ],
          "note": "$V(X\\pm Y)=V(X)\\pm 2\\text{Cov}+V(Y)$."
        },
        {
          "label": "Correlación $\\rho\\in[-1,1]$",
          "kind": "theorem",
          "tex": "\\rho_{X,Y}=\\frac{\\text{Cov}(X,Y)}{\\sigma_X\\sigma_Y}\\in[-1,1]",
          "body": "Coeficiente de correlación: covarianza normalizada por las desviaciones estándar, lo que la vuelve adimensional y acotada en $[-1,1]$. Mide la intensidad de la asociación lineal: $\\rho=\\pm 1\\iff Y=aX+b$ con probabilidad 1 (relación lineal exacta). La cota se demuestra con Cauchy-Schwarz vía discriminante $\\le 0$.",
          "vars": [
            {
              "sym": "\\rho_{X,Y}",
              "desc": "coeficiente de correlación lineal entre $X$ e $Y$"
            },
            {
              "sym": "\\text{Cov}(X,Y)",
              "desc": "covarianza entre $X$ e $Y$"
            },
            {
              "sym": "\\sigma_X",
              "desc": "desviación estándar de $X$, $\\sigma_X=\\sqrt{V(X)}$"
            },
            {
              "sym": "\\sigma_Y",
              "desc": "desviación estándar de $Y$, $\\sigma_Y=\\sqrt{V(Y)}$"
            }
          ]
        },
        {
          "label": "Incorrelación ≠ independencia",
          "kind": "caution",
          "body": "$X,Y$ indep. $\\Rightarrow\\text{Cov}=0$, pero el **recíproco es FALSO** en general. Única excepción: conjuntamente gaussianas ($\\text{Cov}=0\\Rightarrow$ indep.)."
        },
        {
          "label": "Ley de esperanza total",
          "kind": "theorem",
          "tex": "E[X]=E\\big[E[X\\mid Y]\\big]=\\int E[X\\mid Y{=}y]\\,f_Y(y)\\,dy",
          "body": "La esperanza de $X$ se obtiene promediando sus esperanzas condicionales según la distribución de $Y$. Es la versión \"esperada\" de la probabilidad total: se calcula por etapas, condicionando primero y promediando después.",
          "vars": [
            {
              "sym": "E[X]",
              "desc": "esperanza (incondicional) de $X$"
            },
            {
              "sym": "E[X\\mid Y]",
              "desc": "esperanza condicional de $X$ dado $Y$ (función de $Y$, v.a.)"
            },
            {
              "sym": "E[X\\mid Y{=}y]",
              "desc": "esperanza condicional de $X$ evaluada en $Y=y$"
            },
            {
              "sym": "f_Y(y)",
              "desc": "densidad marginal de $Y$"
            }
          ]
        },
        {
          "label": "Ley de varianza total",
          "kind": "theorem",
          "tex": "V(X)=E\\big[V(X\\mid Y)\\big]+V\\big(E[X\\mid Y]\\big)",
          "body": "Descompone la varianza de $X$ en dos partes: la dispersión promedio dentro de cada grupo (intra-grupo) más la dispersión entre las medias de los grupos (entre-grupos). Ambos términos son no negativos.",
          "vars": [
            {
              "sym": "V(X)",
              "desc": "varianza (incondicional) de $X$"
            },
            {
              "sym": "E\\big[V(X\\mid Y)\\big]",
              "desc": "valor esperado de la varianza condicional (componente intra-grupo)"
            },
            {
              "sym": "V\\big(E[X\\mid Y]\\big)",
              "desc": "varianza de la esperanza condicional (componente entre-grupos)"
            },
            {
              "sym": "V(X\\mid Y)",
              "desc": "varianza condicional de $X$ dado $Y$ (función de $Y$)"
            },
            {
              "sym": "E[X\\mid Y]",
              "desc": "esperanza condicional de $X$ dado $Y$ (función de $Y$)"
            }
          ],
          "note": "Error típico: olvidar el término entre-grupos $V(E[X\\mid Y])$ y subestimar $V(X)$."
        },
        {
          "label": "Mezcla de distribuciones",
          "kind": "method",
          "tex": "f_X(x)=\\sum_k f_{X\\mid M}(x\\mid k)\\,P(M{=}k)",
          "body": "Cuando la población se compone de subpoblaciones indexadas por $M$, la densidad de $X$ es una combinación convexa de las densidades condicionales, ponderada por las probabilidades de cada componente. La **varianza no se mezcla linealmente**: hay que usar la ley de varianza total, que aporta sobredispersión.",
          "vars": [
            {
              "sym": "f_X(x)",
              "desc": "densidad marginal de $X$ en la mezcla"
            },
            {
              "sym": "f_{X\\mid M}(x\\mid k)",
              "desc": "densidad de $X$ dentro de la subpoblación $M=k$"
            },
            {
              "sym": "M",
              "desc": "variable (latente) que indexa la subpoblación o componente"
            },
            {
              "sym": "P(M{=}k)",
              "desc": "peso de la componente $k$ (probabilidad de pertenecer a esa subpoblación)"
            },
            {
              "sym": "\\sum_k",
              "desc": "suma sobre todas las componentes $k$ de la mezcla"
            }
          ],
          "note": "Mezcla inversa: integrar contra $f_Y(y)$ en vez de sumar."
        }
      ]
    },
    {
      "title": "Procesos estocásticos",
      "hint": "Familias de v.a. en el tiempo: Bernoulli, Poisson, Markov, caminata.",
      "unit": "6",
      "entries": [
        {
          "label": "Proceso estocástico",
          "kind": "def",
          "body": "Familia $\\{X(t)\\}_{t\\in\\mathbb T}$ de variables aleatorias indexada por el tiempo, donde $X(t)$ es el estado del sistema en el instante $t$. Toma valores en el espacio de estados $\\mathbb E$. El análisis se simplifica imponiendo hipótesis estructurales: estacionariedad, incrementos independientes y propiedad de Markov.",
          "cond": "Discreto/continuo según $\\mathbb E$ y $\\mathbb T$."
        },
        {
          "label": "Propiedades simplificadoras",
          "kind": "def",
          "body": "**Estacionario**: desplazar los índices temporales no altera la distribución conjunta. **Incrementos indep.**: los incrementos sobre intervalos disjuntos son independientes entre sí. **Incrementos estac.**: la distribución de un incremento depende solo de la longitud del intervalo, no de su posición.",
          "note": "Amplio: solo $E[X(t)]$ y $V[X(t)]$ constantes."
        },
        {
          "label": "Proceso de Markov",
          "kind": "def",
          "tex": "P(x_n,t_n\\mid x_{n-1},\\dots,x_1)=P(x_n,t_n\\mid x_{n-1},t_{n-1})",
          "body": "Propiedad de Markov: la distribución del estado futuro depende **solo del presente** y no de toda la historia previa. Bajo esta hipótesis la ecuación de Chapman-Kolmogorov se simplifica.",
          "vars": [
            {
              "sym": "x_n",
              "desc": "estado del proceso en el instante $t_n$ (el presente/futuro a predecir)"
            },
            {
              "sym": "t_n",
              "desc": "instante de tiempo asociado al estado $x_n$"
            },
            {
              "sym": "x_{n-1}",
              "desc": "estado inmediatamente anterior (el presente condicionante)"
            },
            {
              "sym": "t_{n-1}",
              "desc": "instante de tiempo asociado al estado $x_{n-1}$"
            },
            {
              "sym": "x_1,\\dots,x_{n-1}",
              "desc": "historia completa de estados previos"
            }
          ],
          "cond": "Espacio de estados discreto $\\Rightarrow$ cadena de Markov."
        },
        {
          "label": "Proceso de Bernoulli$(p)$",
          "kind": "formula",
          "tex": "N(k)\\sim\\text{Binomial}(k,p)",
          "body": "Proceso de conteo en tiempo **discreto**: en cada paso ocurre a lo sumo un evento, con probabilidad $p$ e independiente de los demás. La cantidad acumulada de eventos hasta el paso $k$ es Binomial; los tiempos entre eventos son Geométricos y el tiempo hasta el $k$-ésimo evento es Binomial Negativa.",
          "vars": [
            {
              "sym": "N(k)",
              "desc": "número de eventos acumulados en los primeros $k$ pasos"
            },
            {
              "sym": "k",
              "desc": "cantidad de pasos (ensayos) discretos considerados"
            },
            {
              "sym": "p",
              "desc": "probabilidad de éxito (ocurrencia de un evento) en cada paso"
            }
          ]
        },
        {
          "label": "Proceso de Poisson$(\\lambda)$",
          "kind": "formula",
          "tex": "\\begin{aligned} N(t) &\\sim \\text{Poisson}(\\lambda t) \\\\ E[N(t)] &= V[N(t)] = \\lambda t \\end{aligned}",
          "body": "Proceso de conteo en tiempo **continuo** con tasa constante $\\lambda$. El número de eventos en un intervalo de longitud $t$ es Poisson de parámetro $\\lambda t$, con media y varianza iguales a $\\lambda t$. Las condiciones se enuncian con $o(h)$: $P(\\Delta N{=}1)=\\lambda h+o(h)$ y sin eventos simultáneos.",
          "vars": [
            {
              "sym": "N(t)",
              "desc": "número de eventos ocurridos en el intervalo $[0,t]$"
            },
            {
              "sym": "t",
              "desc": "longitud del intervalo de tiempo continuo"
            },
            {
              "sym": "\\lambda",
              "desc": "tasa media de ocurrencia de eventos por unidad de tiempo"
            },
            {
              "sym": "E[N(t)]",
              "desc": "valor esperado del conteo en el intervalo"
            },
            {
              "sym": "V[N(t)]",
              "desc": "varianza del conteo en el intervalo"
            }
          ],
          "cond": "Tiempos entre eventos $\\sim$Expo$(\\lambda)$ i.i.d.; al $k$-ésimo $\\sim$Erlang$(k,\\lambda)$."
        },
        {
          "label": "Dualidad conteo ↔ tiempo",
          "kind": "method",
          "tex": "T_k< t \\iff N(t)\\ge k",
          "body": "Equivalencia que traduce preguntas sobre tiempos de espera (Erlang/Exponencial) en preguntas sobre conteos (Poisson): el $k$-ésimo evento ocurre antes de $t$ si y solo si hubo al menos $k$ eventos hasta $t$. Es una herramienta clave para resolver ejercicios.",
          "vars": [
            {
              "sym": "T_k",
              "desc": "instante en que ocurre el $k$-ésimo evento (tiempo de espera acumulado)"
            },
            {
              "sym": "t",
              "desc": "instante de tiempo de referencia"
            },
            {
              "sym": "N(t)",
              "desc": "número de eventos ocurridos hasta el instante $t$"
            },
            {
              "sym": "k",
              "desc": "orden del evento de interés"
            }
          ],
          "note": "Ajustar siempre la tasa a la longitud del intervalo ($\\lambda t$)."
        },
        {
          "label": "Relación Bernoulli-Poisson",
          "kind": "theorem",
          "body": "El proceso de Poisson es el límite continuo del de Bernoulli cuando los pasos se vuelven infinitesimales y la probabilidad por paso se reescala como $p=\\lambda\\Delta t$. De ahí los análogos entre distribuciones: Geométrica$\\leftrightarrow$Exponencial, Binomial Negativa$\\leftrightarrow$Erlang y Binomial$\\leftrightarrow$Poisson.",
          "cond": "Ambos: conteo, incrementos indep./estac., Markov."
        },
        {
          "label": "Cadena de Markov",
          "kind": "method",
          "tex": "\\begin{aligned} \\vec p(n) &= \\vec p(0)\\,\\mathbb P^n \\\\ (\\mathbb P^k)_{ij} &= P(i\\to j\\text{ en }k\\text{ pasos}) \\end{aligned}",
          "body": "Evolución de la distribución de estados en tiempo discreto: el vector de probabilidades en el paso $n$ se obtiene multiplicando el vector inicial por la potencia $n$-ésima de la matriz de transición $\\mathbb P$ (filas que suman 1, estocástica). La entrada $(i,j)$ de $\\mathbb P^k$ da la probabilidad de ir de $i$ a $j$ en $k$ pasos. Los estados se clasifican en accesibles, recurrentes/transitorios, periódicos y absorbentes.",
          "vars": [
            {
              "sym": "\\vec p(n)",
              "desc": "vector fila con la distribución de probabilidad sobre los estados en el paso $n$"
            },
            {
              "sym": "\\vec p(0)",
              "desc": "distribución inicial de estados"
            },
            {
              "sym": "\\mathbb P",
              "desc": "matriz de transición en un paso (estocástica: filas suman 1)"
            },
            {
              "sym": "\\mathbb P^n",
              "desc": "matriz de transición en $n$ pasos"
            },
            {
              "sym": "(\\mathbb P^k)_{ij}",
              "desc": "probabilidad de pasar del estado $i$ al estado $j$ en exactamente $k$ pasos"
            },
            {
              "sym": "i,j",
              "desc": "estados de origen y destino, respectivamente"
            },
            {
              "sym": "k",
              "desc": "cantidad de pasos de la transición"
            }
          ],
          "cond": "Cadena homogénea: $\\mathbb P$ constante."
        },
        {
          "label": "Distribución estacionaria",
          "kind": "formula",
          "tex": "\\begin{aligned} \\vec\\pi &= \\vec\\pi\\,\\mathbb P \\\\ \\sum_j\\pi_j &= 1 \\end{aligned}",
          "body": "Distribución de equilibrio de la cadena: queda invariante al aplicar la matriz de transición (autovector a izquierda asociado al autovalor 1) y debe normalizarse para sumar 1. En una cadena regular ($\\mathbb P^n>0$ para algún $n$) coincide con la distribución límite, independiente del estado inicial.",
          "vars": [
            {
              "sym": "\\vec\\pi",
              "desc": "vector fila de la distribución estacionaria sobre los estados"
            },
            {
              "sym": "\\pi_j",
              "desc": "probabilidad estacionaria del estado $j$"
            },
            {
              "sym": "\\mathbb P",
              "desc": "matriz de transición de la cadena"
            },
            {
              "sym": "\\sum_j\\pi_j",
              "desc": "suma de las probabilidades estacionarias sobre todos los estados $j$ (condición de normalización)"
            }
          ],
          "note": "\"Comportamiento de largo plazo\" = resolver este sistema."
        },
        {
          "label": "Caminata aleatoria",
          "kind": "example",
          "tex": "\\begin{aligned} X_n &= \\sum_{k=1}^n Y_k \\\\ E[X_n] &= n(2p-1) \\\\ V[X_n] &= 4np(1-p) \\end{aligned}",
          "body": "Posición tras $n$ pasos $\\pm 1$ independientes e idénticamente distribuidos: se acumulan los incrementos $Y_k$. Es de Markov y tiene incrementos indep./estac., pero **NO es estacionaria**, porque la varianza crece con $n$. En el caso simétrico ($p{=}1/2$) resulta $E[X_n]{=}0$ y $V[X_n]{=}n$.",
          "vars": [
            {
              "sym": "X_n",
              "desc": "posición de la caminata tras $n$ pasos"
            },
            {
              "sym": "n",
              "desc": "número de pasos dados"
            },
            {
              "sym": "Y_k",
              "desc": "incremento del paso $k$, vale $+1$ con probabilidad $p$ y $-1$ con probabilidad $1-p$ (índice $k=1,\\dots,n$)"
            },
            {
              "sym": "p",
              "desc": "probabilidad de dar un paso $+1$ en cada instante"
            },
            {
              "sym": "E[X_n]",
              "desc": "valor esperado de la posición tras $n$ pasos"
            },
            {
              "sym": "V[X_n]",
              "desc": "varianza de la posición tras $n$ pasos"
            }
          ],
          "note": "Gaussiana ($G_k\\sim N(0,1)$): $X_n\\sim N(0,n)$ (Browniano discreto)."
        }
      ]
    },
    {
      "title": "Suma de variables aleatorias",
      "hint": "E, V y distribución de S=X+Y; convolución y casos estables.",
      "unit": "7",
      "entries": [
        {
          "label": "E y V de una suma",
          "kind": "theorem",
          "tex": "\\begin{aligned} E[X+Y] &= E[X]+E[Y] \\\\ V(X+Y) &= V(X)+2\\,\\text{Cov}(X,Y)+V(Y) \\end{aligned}",
          "body": "Esperanza y varianza de la suma de dos variables aleatorias. La esperanza es siempre lineal: la suma de esperanzas es la esperanza de la suma, sin condiciones. La varianza, en cambio, arrastra el término de covarianza, que solo se anula cuando las variables son independientes (o incorrelacionadas).",
          "vars": [
            {
              "sym": "X,\\ Y",
              "desc": "variables aleatorias que se suman"
            },
            {
              "sym": "E[\\cdot]",
              "desc": "esperanza (valor medio)"
            },
            {
              "sym": "V(\\cdot)",
              "desc": "varianza (dispersión cuadrática)"
            },
            {
              "sym": "\\text{Cov}(X,Y)",
              "desc": "covarianza entre $X$ e $Y$; mide su asociación lineal"
            }
          ]
        },
        {
          "label": "La resta también suma varianzas",
          "kind": "caution",
          "tex": "V(X-Y)=V(X)+V(Y)",
          "body": "Varianza de la diferencia de dos variables independientes. La varianza mide dispersión y no tiene signo: el factor $(-1)^2$ la deja positiva, por lo que la resta también acumula varianzas. Lo único que cambia de signo es la media.",
          "vars": [
            {
              "sym": "X,\\ Y",
              "desc": "variables aleatorias independientes"
            },
            {
              "sym": "V(\\cdot)",
              "desc": "varianza (dispersión cuadrática)"
            }
          ],
          "note": "Solo si independientes (o incorrelacionadas)."
        },
        {
          "label": "Convolución (independientes)",
          "kind": "formula",
          "tex": "\\begin{aligned} f_S(s) &= \\int f_X(s-y)\\,f_Y(y)\\,dy \\\\ p_S(s) &= \\sum_y p_X(s-y)\\,p_Y(y) \\end{aligned}",
          "body": "Distribución de la suma $S=X+Y$ con $X,Y$ independientes: la densidad (caso continuo) o la función de probabilidad puntual (caso discreto) de $S$ se obtiene como la convolución de las de $X$ e $Y$. Atajo práctico: la FGM de la suma es el producto de las FGM.",
          "vars": [
            {
              "sym": "S",
              "desc": "suma $S=X+Y$"
            },
            {
              "sym": "f_S",
              "desc": "densidad de la suma (caso continuo)"
            },
            {
              "sym": "p_S",
              "desc": "función de probabilidad puntual de la suma (caso discreto)"
            },
            {
              "sym": "f_X,\\ f_Y",
              "desc": "densidades de $X$ e $Y$"
            },
            {
              "sym": "p_X,\\ p_Y",
              "desc": "funciones de probabilidad puntual de $X$ e $Y$"
            },
            {
              "sym": "y",
              "desc": "variable de integración / índice de suma sobre el soporte de $Y$"
            }
          ],
          "cond": "Caso general (sin indep.): usar la conjunta $f_{X,Y}(s-y,y)$."
        },
        {
          "label": "Sumas estables / cerradas",
          "kind": "theorem",
          "body": "Familias cerradas bajo suma de variables independientes: Bernoulli×n→Bin; Bin+Bin→Bin (misma $p$); Poisson+Poisson→Poisson; Normal+Normal→Normal; Expo×n→Gamma/Erlang; Geom+Geom→BinNeg; $\\sum Z_i^2\\to\\chi^2$. En cada caso la suma pertenece a la misma familia (o a su generalización natural), con los parámetros que se acumulan.",
          "note": "Unif+Unif→**triangular** (NO uniforme): familia no estable."
        },
        {
          "label": "Normal + Normal",
          "kind": "formula",
          "tex": "N(\\mu_1,\\sigma_1)+N(\\mu_2,\\sigma_2)=N\\big(\\mu_1+\\mu_2,\\sqrt{\\sigma_1^2+\\sigma_2^2}\\big)",
          "body": "La suma de dos normales independientes es de nuevo normal: las medias se suman y las varianzas se suman (de ahí el desvío resultante $\\sqrt{\\sigma_1^2+\\sigma_2^2}$).",
          "vars": [
            {
              "sym": "\\mu_1,\\ \\mu_2",
              "desc": "medias de cada normal"
            },
            {
              "sym": "\\sigma_1,\\ \\sigma_2",
              "desc": "desvíos estándar de cada normal"
            },
            {
              "sym": "N(\\mu,\\sigma)",
              "desc": "distribución normal de media $\\mu$ y desvío $\\sigma$"
            }
          ],
          "note": "Suman las **varianzas**, NO los desvíos."
        },
        {
          "label": "Suma y promedio i.i.d.",
          "kind": "formula",
          "tex": "\\begin{aligned} E[S_n] &= n\\mu \\\\ V(S_n) &= n\\sigma^2 \\\\ E[\\bar X_n] &= \\mu \\\\ V(\\bar X_n) &= \\frac{\\sigma^2}{n} \\end{aligned}",
          "body": "Esperanza y varianza de la suma $S_n$ y del promedio $\\bar X_n$ de $n$ variables i.i.d. La media del promedio coincide con la media poblacional, mientras que su varianza decrece como $\\sigma^2/n$ y tiende a $0$: ese es el fundamento de la Ley de los Grandes Números.",
          "vars": [
            {
              "sym": "S_n",
              "desc": "suma $S_n=\\sum_{i=1}^n X_i$"
            },
            {
              "sym": "\\bar X_n",
              "desc": "promedio $\\bar X_n=S_n/n$"
            },
            {
              "sym": "n",
              "desc": "cantidad de variables i.i.d. sumadas"
            },
            {
              "sym": "\\mu",
              "desc": "media común de cada $X_i$"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza común de cada $X_i$"
            },
            {
              "sym": "E[\\cdot]",
              "desc": "esperanza (valor medio)"
            },
            {
              "sym": "V(\\cdot)",
              "desc": "varianza (dispersión cuadrática)"
            }
          ]
        },
        {
          "label": "Promedio muestral",
          "kind": "def",
          "tex": "\\begin{aligned} \\bar X_n &= \\frac{1}{n}\\sum X_i \\\\ \\sigma_{\\bar X_n} &= \\frac{\\sigma}{\\sqrt n}\\ (\\text{error estándar}) \\end{aligned}",
          "body": "El promedio muestral es un estimador insesgado de la media $\\mu$, y su desvío (el error estándar) decrece como $\\sigma/\\sqrt n$. Como va con $1/\\sqrt n$, para bajar el error a la mitad hay que **cuadruplicar** $n$.",
          "vars": [
            {
              "sym": "\\bar X_n",
              "desc": "promedio muestral de las $n$ observaciones"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "X_i",
              "desc": "$i$-ésima observación"
            },
            {
              "sym": "\\sigma_{\\bar X_n}",
              "desc": "desvío del promedio (error estándar)"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional de cada $X_i$"
            }
          ],
          "cond": "Si $X_i$ normales, $\\bar X_n$ es **exactamente** $N(\\mu,\\sigma/\\sqrt n)$."
        },
        {
          "label": "Gamma / Erlang",
          "kind": "formula",
          "tex": "\\begin{aligned} T_n=\\sum_{i=1}^n\\tau_i &\\sim \\text{Gamma}(n,\\lambda) \\\\ E &= \\tfrac{n}{\\lambda} \\\\ V &= \\tfrac{n}{\\lambda^2} \\end{aligned}",
          "body": "La suma de $n$ exponenciales i.i.d. de tasa $\\lambda$ es una Gamma de forma entera (Erlang), que modela el tiempo hasta la $n$-ésima ocurrencia de un proceso de Poisson. Se dan su esperanza y su varianza.",
          "vars": [
            {
              "sym": "T_n",
              "desc": "suma de los $n$ tiempos; tiempo a la $n$-ésima ocurrencia"
            },
            {
              "sym": "\\tau_i",
              "desc": "$i$-ésimo tiempo entre ocurrencias, $\\sim\\text{Exp}(\\lambda)$"
            },
            {
              "sym": "n",
              "desc": "cantidad de exponenciales sumadas (parámetro de forma)"
            },
            {
              "sym": "\\lambda",
              "desc": "tasa de cada exponencial (parámetro de tasa)"
            },
            {
              "sym": "\\text{Gamma}(n,\\lambda)",
              "desc": "distribución Gamma de forma $n$ y tasa $\\lambda$ (Erlang si $n$ entero)"
            },
            {
              "sym": "E",
              "desc": "esperanza de $T_n$"
            },
            {
              "sym": "V",
              "desc": "varianza de $T_n$"
            }
          ],
          "cond": "Densidad $f=\\frac{\\lambda^n t^{n-1}e^{-\\lambda t}}{(n-1)!}$."
        }
      ]
    },
    {
      "title": "Teoremas límite",
      "hint": "Chebyshev (cota), LGN (a dónde va) y TCL (cómo fluctúa).",
      "unit": "7",
      "entries": [
        {
          "label": "Desigualdad de Markov",
          "kind": "theorem",
          "tex": "P(X\\ge\\alpha)\\le\\dfrac{E[X]}{\\alpha}",
          "body": "Acota la probabilidad de que una variable no negativa supere un umbral usando únicamente su esperanza. Es una cota universal: vale para cualquier distribución con $X\\ge 0$ y media finita, sin conocer su forma.",
          "vars": [
            {
              "sym": "X",
              "desc": "variable aleatoria no negativa"
            },
            {
              "sym": "\\alpha",
              "desc": "umbral positivo a superar"
            },
            {
              "sym": "E[X]",
              "desc": "esperanza (media) de $X$"
            }
          ],
          "cond": "Solo para $X\\ge 0$ y $\\alpha>0$.",
          "note": "Cota universal (no usa la distribución)."
        },
        {
          "label": "Desigualdad de Chebyshev",
          "kind": "theorem",
          "tex": "P(|X-\\mu|\\ge\\varepsilon)\\le\\dfrac{\\sigma^2}{\\varepsilon^2}",
          "body": "Acota la probabilidad de que $X$ se aleje de su media más de $\\varepsilon$, usando solo la varianza. Sale de aplicar Markov a $(X-\\mu)^2$.",
          "vars": [
            {
              "sym": "X",
              "desc": "variable aleatoria con media y varianza finitas"
            },
            {
              "sym": "\\mu",
              "desc": "esperanza (media) de $X$"
            },
            {
              "sym": "\\varepsilon",
              "desc": "tolerancia: distancia a la media, $\\varepsilon>0$"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza de $X$"
            }
          ],
          "note": "Correcta pero **floja** (vale para cualquier distribución → cubre el peor caso)."
        },
        {
          "label": "Ley de grandes números",
          "kind": "theorem",
          "tex": "\\bar X_n\\to\\mu\\quad(n\\to\\infty)",
          "body": "El promedio muestral de variables i.i.d. converge a la media poblacional al crecer el tamaño de muestra. En su versión débil (convergencia en probabilidad, demostrable vía Chebyshev) se tiene $P(|\\bar X_n-\\mu|\\ge\\varepsilon)\\le\\frac{\\sigma^2}{n\\varepsilon^2}\\to 0$; la versión fuerte da convergencia casi segura.",
          "vars": [
            {
              "sym": "\\bar X_n",
              "desc": "promedio muestral de las primeras $n$ observaciones"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra (cantidad de variables i.i.d.)"
            },
            {
              "sym": "\\mu",
              "desc": "media poblacional, valor al que converge el promedio"
            }
          ],
          "cond": "Justifica estimar promediando e interpretar prob. como frecuencia."
        },
        {
          "label": "Teorema central del límite",
          "kind": "theorem",
          "tex": "Z_n=\\dfrac{\\bar X_n-\\mu}{\\sigma/\\sqrt n}\\xrightarrow{d} N(0,1)",
          "body": "La suma o el promedio de muchas variables i.i.d., una vez estandarizado, converge en distribución a una Normal estándar, **sin importar** la distribución de origen. Por eso el promedio y la suma se aproximan por normales para $n$ grande.",
          "vars": [
            {
              "sym": "Z_n",
              "desc": "promedio muestral estandarizado"
            },
            {
              "sym": "\\bar X_n",
              "desc": "promedio muestral de $n$ variables i.i.d."
            },
            {
              "sym": "\\mu",
              "desc": "media poblacional de cada variable"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional de cada variable"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "N(0,1)",
              "desc": "distribución Normal estándar (media $0$, varianza $1$)"
            }
          ],
          "cond": "Regla usual $n>20$ (o $n>30$). $\\bar X_n\\approx N(\\mu,\\sigma/\\sqrt n)$, $S_n\\approx N(n\\mu,\\sqrt n\\,\\sigma)$."
        },
        {
          "label": "Corrección por continuidad",
          "kind": "method",
          "tex": "P(a\\le S_n\\le b)\\approx\\Phi\\!\\Big(\\tfrac{b+\\frac12-n\\mu}{\\sqrt n\\,\\sigma}\\Big)-\\Phi\\!\\Big(\\tfrac{a-\\frac12-n\\mu}{\\sqrt n\\,\\sigma}\\Big)",
          "body": "Al aproximar una variable **discreta** por la normal, se ajusta $\\pm\\tfrac12$ en cada extremo: cada entero $s$ se ensancha al intervalo $[s-\\tfrac12,\\,s+\\tfrac12]$, lo que mejora la aproximación.",
          "vars": [
            {
              "sym": "S_n",
              "desc": "suma (variable discreta) que se aproxima por la normal"
            },
            {
              "sym": "a",
              "desc": "extremo inferior entero del rango"
            },
            {
              "sym": "b",
              "desc": "extremo superior entero del rango"
            },
            {
              "sym": "\\Phi",
              "desc": "función de distribución acumulada de la Normal estándar"
            },
            {
              "sym": "\\mu",
              "desc": "media de cada término de la suma"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar de cada término de la suma"
            },
            {
              "sym": "n",
              "desc": "cantidad de términos sumados"
            }
          ],
          "note": "Para $<$ y $>$ estrictos mover el $\\pm\\tfrac12$ hacia adentro."
        },
        {
          "label": "Aproximación normal de la binomial",
          "kind": "formula",
          "tex": "\\text{Bin}(n,p)\\approx N(np,\\sqrt{npq})",
          "body": "Aproxima una binomial por una normal con la misma media y desvío (teorema de De Moivre-Laplace, vía Stirling y Taylor). Es el caso emblemático del TCL.",
          "vars": [
            {
              "sym": "n",
              "desc": "cantidad de ensayos de Bernoulli"
            },
            {
              "sym": "p",
              "desc": "probabilidad de éxito en cada ensayo"
            },
            {
              "sym": "q",
              "desc": "probabilidad de fracaso, $q=1-p$"
            },
            {
              "sym": "np",
              "desc": "media de la binomial"
            },
            {
              "sym": "\\sqrt{npq}",
              "desc": "desvío estándar de la binomial"
            }
          ],
          "cond": "Conviene si $np\\ge 5$ y $nq\\ge 5$. Si $p\\approx 0$ con $np$ moderado, usar Poisson."
        }
      ]
    },
    {
      "title": "Inferencia: estimación puntual",
      "hint": "Estimar un parámetro con un valor; medir calidad y métodos.",
      "unit": "8",
      "entries": [
        {
          "label": "Estadístico vs estimador vs estimación",
          "kind": "def",
          "body": "**Estadístico**: función $g(X_1,\\dots,X_n)$ de la muestra (es una v.a.). **Estimador** $\\hat\\theta$: estadístico construido para aproximar el parámetro $\\theta$. **Estimación**: el valor concreto $\\hat\\theta(x_1,\\dots,x_n)$ que toma el estimador ante una muestra observada (un número).",
          "note": "Pre-muestra (mayúsculas, v.a.) vs post-muestra (minúsculas, número)."
        },
        {
          "label": "ECM y descomposición sesgo-varianza",
          "kind": "formula",
          "tex": "\\text{mse}(\\hat\\theta)=E[(\\hat\\theta-\\theta)^2]=V(\\hat\\theta)+\\text{sesgo}^2(\\hat\\theta)",
          "body": "El error cuadrático medio mide la calidad global de un estimador como el valor esperado del cuadrado de su error respecto del parámetro, y se descompone en la suma de su varianza y el cuadrado de su sesgo.",
          "vars": [
            {
              "sym": "\\text{mse}(\\hat\\theta)",
              "desc": "error cuadrático medio del estimador $\\hat\\theta$"
            },
            {
              "sym": "\\hat\\theta",
              "desc": "estimador del parámetro"
            },
            {
              "sym": "\\theta",
              "desc": "parámetro poblacional a estimar (constante desconocida)"
            },
            {
              "sym": "E[\\cdot]",
              "desc": "valor esperado"
            },
            {
              "sym": "V(\\hat\\theta)",
              "desc": "varianza del estimador"
            },
            {
              "sym": "\\text{sesgo}(\\hat\\theta)",
              "desc": "sesgo del estimador, $E[\\hat\\theta]-\\theta$"
            }
          ],
          "note": "Ideal: insesgado de mínima varianza. Insesgado: sesgo$=0$. Consistente: $\\text{mse}\\to 0$."
        },
        {
          "label": "Estimadores clásicos",
          "kind": "formula",
          "tex": "\\begin{aligned} \\bar X_n &\\to \\mu && (\\text{ECM } \\tfrac{\\sigma^2}{n}) \\\\ \\hat p &\\to p && (\\text{ECM } \\tfrac{p(1-p)}{n}) \\\\ S_n^2 &\\to \\sigma^2 \\end{aligned}",
          "body": "Estimadores estándar de la media, la proporción y la varianza poblacionales: los tres son insesgados y consistentes. Sus ECM (cuando aplican) cuantifican la precisión, que mejora al crecer $n$, y las aproximaciones normales por TCL sostienen los intervalos de confianza.",
          "vars": [
            {
              "sym": "\\bar X_n",
              "desc": "media muestral, estimador de $\\mu$"
            },
            {
              "sym": "\\mu",
              "desc": "media poblacional"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza poblacional"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "\\hat p",
              "desc": "proporción muestral, estimador de $p$"
            },
            {
              "sym": "p",
              "desc": "proporción poblacional (probabilidad de éxito)"
            },
            {
              "sym": "S_n^2",
              "desc": "varianza muestral, estimador de $\\sigma^2$"
            }
          ]
        },
        {
          "label": "Varianza muestral (insesgada)",
          "kind": "formula",
          "tex": "\\begin{aligned} S_n^2 &= \\frac{1}{n-1}\\sum_{i=1}^{n}(X_i-\\bar X_n)^2 \\\\ E[S_n^2] &= \\sigma^2 \\end{aligned}",
          "body": "Estima la varianza poblacional como el promedio corregido de los desvíos cuadráticos respecto de la media muestral. El denominador $n-1$ (corrección de Bessel) la vuelve insesgada: se gasta 1 grado de libertad al estimar la media con $\\bar X_n$.",
          "vars": [
            {
              "sym": "S_n^2",
              "desc": "varianza muestral insesgada"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "X_i",
              "desc": "$i$-ésima observación de la muestra"
            },
            {
              "sym": "\\bar X_n",
              "desc": "media muestral"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza poblacional"
            },
            {
              "sym": "E[S_n^2]",
              "desc": "valor esperado de la varianza muestral"
            }
          ],
          "cond": "Si la población es normal: $\\frac{(n-1)S_n^2}{\\sigma^2}\\sim\\chi^2_{n-1}$."
        },
        {
          "label": "Máxima verosimilitud (MV)",
          "kind": "method",
          "tex": "\\hat\\theta=\\arg\\max_\\theta \\sum_{i=1}^{n}\\ln f(x_i;\\theta)",
          "body": "Elige como estimador el valor del parámetro que maximiza la log-verosimilitud de la muestra observada (en la práctica, derivar respecto de $\\theta$ e igualar a 0). Da estimadores consistentes.",
          "vars": [
            {
              "sym": "\\hat\\theta",
              "desc": "estimador de máxima verosimilitud"
            },
            {
              "sym": "\\theta",
              "desc": "parámetro a estimar"
            },
            {
              "sym": "\\arg\\max_\\theta",
              "desc": "valor de $\\theta$ que maximiza la expresión"
            },
            {
              "sym": "f(x_i;\\theta)",
              "desc": "densidad (o función de probabilidad) de la observación $x_i$ bajo el parámetro $\\theta$"
            },
            {
              "sym": "x_i",
              "desc": "$i$-ésima observación de la muestra"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            }
          ],
          "cond": "Cuando se conoce la familia y se quiere el estimador estándar."
        },
        {
          "label": "MV con parámetro en el soporte",
          "kind": "caution",
          "body": "Si $\\theta$ define el **borde del soporte** (caso de las uniformes), la verosimilitud es monótona en $\\theta$: el máximo NO se obtiene derivando, sino en el **extremo de la muestra** ($x_{(n)}$ o $x_{(1)}$).",
          "note": "Unif$(3,\\alpha)$: $\\hat\\alpha=\\max_i x_i$. Unif$(\\alpha,2)$: $\\hat\\alpha=\\min_i x_i$."
        },
        {
          "label": "Máximo a posteriori (MAP)",
          "kind": "method",
          "tex": "\\hat\\theta=\\arg\\max_\\theta f(x\\mid\\theta)\\,g(\\theta)",
          "body": "Enfoque bayesiano: trata a $\\theta$ como v.a. con una distribución previa $g(\\theta)$ y estima con el valor que maximiza la posterior, es decir el numerador del teorema de Bayes (verosimilitud por prior).",
          "vars": [
            {
              "sym": "\\hat\\theta",
              "desc": "estimador máximo a posteriori"
            },
            {
              "sym": "\\theta",
              "desc": "parámetro, tratado como v.a."
            },
            {
              "sym": "\\arg\\max_\\theta",
              "desc": "valor de $\\theta$ que maximiza la expresión"
            },
            {
              "sym": "f(x\\mid\\theta)",
              "desc": "verosimilitud de los datos dado $\\theta$"
            },
            {
              "sym": "g(\\theta)",
              "desc": "distribución previa (prior) sobre $\\theta$"
            },
            {
              "sym": "x",
              "desc": "datos observados"
            }
          ],
          "cond": "Cuando hay info previa creíble. Beta-Bernoulli: $\\hat p=\\frac{s+\\alpha-1}{n+\\alpha+\\beta-2}$."
        },
        {
          "label": "Método de los momentos",
          "kind": "method",
          "tex": "\\begin{aligned} \\mu_k &= H(\\theta) \\\\ \\hat\\theta &= H^{-1}(\\hat\\mu_k) \\end{aligned}",
          "body": "Iguala el momento poblacional de orden $k$ con el momento muestral correspondiente y despeja el parámetro invirtiendo la relación. Es un método simple que puede diferir del de máxima verosimilitud.",
          "vars": [
            {
              "sym": "\\mu_k",
              "desc": "momento poblacional de orden $k$ (función de $\\theta$)"
            },
            {
              "sym": "H(\\theta)",
              "desc": "expresión del momento poblacional en términos del parámetro"
            },
            {
              "sym": "\\theta",
              "desc": "parámetro a estimar"
            },
            {
              "sym": "\\hat\\theta",
              "desc": "estimador por el método de los momentos"
            },
            {
              "sym": "H^{-1}",
              "desc": "función inversa de $H$"
            },
            {
              "sym": "\\hat\\mu_k",
              "desc": "momento muestral de orden $k$"
            }
          ],
          "cond": "Exponencial: $\\mu=1/\\lambda\\Rightarrow\\hat\\lambda=1/\\bar X_n$. Puede diferir del MV."
        }
      ]
    },
    {
      "title": "Intervalos de confianza",
      "hint": "Rango que atrapa al parámetro con confianza γ; tres casos y tamaño muestral.",
      "unit": "8",
      "entries": [
        {
          "label": "Intervalo de confianza",
          "kind": "def",
          "tex": "P\\big(\\hat\\theta_\\ell<\\theta<\\hat\\theta_u\\big)=\\gamma",
          "body": "Define el intervalo de confianza: un par de estimadores $\\hat\\theta_\\ell$ y $\\hat\\theta_u$, función de la muestra, que encierran al parámetro desconocido $\\theta$ con probabilidad $\\gamma$. Puede ser bilateral (ambos extremos finitos) o unilateral ($\\pm\\infty$ en uno de los extremos).",
          "vars": [
            {
              "sym": "\\hat\\theta_\\ell",
              "desc": "extremo inferior del intervalo (estimador, función de la muestra)"
            },
            {
              "sym": "\\hat\\theta_u",
              "desc": "extremo superior del intervalo (estimador, función de la muestra)"
            },
            {
              "sym": "\\theta",
              "desc": "parámetro poblacional desconocido a estimar"
            },
            {
              "sym": "\\gamma",
              "desc": "nivel de confianza, $0<\\gamma<1$ (típicamente $0{,}90$, $0{,}95$, $0{,}99$)"
            }
          ]
        },
        {
          "label": "Interpretación frecuentista",
          "kind": "caution",
          "body": "El IC tiene prob. $\\gamma$ de contener a $\\theta$ **antes** de muestrear. **Después**, los extremos son números fijos: contiene o no (prob. 0 o 1). NO decir \"este IC tiene 90% de prob. de contener a $\\mu$\"."
        },
        {
          "label": "Caso 1 · Media, σ conocido (Z)",
          "kind": "formula",
          "tex": "IC_\\gamma(\\mu)=\\bar X_n \\pm z_{\\frac{1+\\gamma}{2}}\\,\\frac{\\sigma}{\\sqrt n}",
          "body": "Intervalo de confianza para la media $\\mu$ de una población normal con varianza conocida (o muestra grande por TCL). Se centra en la media muestral y se extiende un margen de error proporcional al desvío estándar y al cuantil normal del nivel de confianza.",
          "vars": [
            {
              "sym": "IC_\\gamma(\\mu)",
              "desc": "intervalo de confianza de nivel $\\gamma$ para la media $\\mu$"
            },
            {
              "sym": "\\bar X_n",
              "desc": "media muestral de $n$ observaciones"
            },
            {
              "sym": "z_{\\frac{1+\\gamma}{2}}",
              "desc": "cuantil de la normal estándar de orden $\\tfrac{1+\\gamma}{2}$; $z_p=\\Phi^{-1}(p)$"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional (conocido)"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            }
          ],
          "cond": "Unilateral: usar $z_\\gamma$ y un solo extremo."
        },
        {
          "label": "Caso 2 · Proporción (Z)",
          "kind": "formula",
          "tex": "IC_\\gamma(p)=\\hat p \\pm z_{\\frac{1+\\gamma}{2}}\\sqrt{\\frac{\\hat p(1-\\hat p)}{n}}",
          "body": "Intervalo de confianza para una proporción poblacional $p$, válido por TCL con $n$ grande. Se centra en la proporción muestral y el error estándar se estima con la propia $\\hat p$ (a diferencia de la prueba de hipótesis, que usa el valor bajo $H_0$).",
          "vars": [
            {
              "sym": "IC_\\gamma(p)",
              "desc": "intervalo de confianza de nivel $\\gamma$ para la proporción $p$"
            },
            {
              "sym": "\\hat p",
              "desc": "proporción muestral (frecuencia relativa de éxitos)"
            },
            {
              "sym": "z_{\\frac{1+\\gamma}{2}}",
              "desc": "cuantil de la normal estándar de orden $\\tfrac{1+\\gamma}{2}$"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            }
          ],
          "cond": "Acotar a $[0,1]$ en unilaterales."
        },
        {
          "label": "Caso 3 · Media, σ desconocido (t)",
          "kind": "formula",
          "tex": "\\begin{aligned} T &= \\frac{\\bar X_n-\\mu}{S_n/\\sqrt n} \\sim t_{n-1} \\\\ IC_\\gamma(\\mu) &= \\bar X_n \\pm t_{n-1,\\frac{1+\\gamma}{2}}\\,\\frac{S_n}{\\sqrt n} \\end{aligned}",
          "body": "Intervalo de confianza para la media $\\mu$ cuando la varianza poblacional es desconocida y se estima con $S_n^2$. El estadístico pivote sigue una t de Student con $n-1$ grados de libertad, por lo que el cuantil normal se reemplaza por el cuantil $t$. Indicado para muestra normal con $n$ chico.",
          "vars": [
            {
              "sym": "T",
              "desc": "estadístico pivote estandarizado con la varianza muestral"
            },
            {
              "sym": "\\bar X_n",
              "desc": "media muestral de $n$ observaciones"
            },
            {
              "sym": "\\mu",
              "desc": "media poblacional (parámetro a estimar)"
            },
            {
              "sym": "S_n",
              "desc": "desvío estándar muestral (estima a $\\sigma$)"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "t_{n-1}",
              "desc": "distribución t de Student con $n-1$ grados de libertad"
            },
            {
              "sym": "IC_\\gamma(\\mu)",
              "desc": "intervalo de confianza de nivel $\\gamma$ para $\\mu$"
            },
            {
              "sym": "t_{n-1,\\frac{1+\\gamma}{2}}",
              "desc": "cuantil de la t de Student con $n-1$ g.l. y orden $\\tfrac{1+\\gamma}{2}$"
            }
          ],
          "note": "$n$ grande ($>100/200$): $t_{n-1}\\approx z$ (se recupera el caso 1)."
        },
        {
          "label": "Tamaño muestral",
          "kind": "formula",
          "tex": "n\\ge z_{\\frac{1+\\gamma}{2}}^2\\,\\frac{\\sigma^2}{E^2}",
          "body": "Tamaño de muestra mínimo para que el IC de la media tenga una semiamplitud no mayor a $E$ con nivel de confianza $\\gamma$. La precisión mejora como $1/\\sqrt n$, por lo que reducir el error a la mitad cuadruplica el $n$ requerido.",
          "vars": [
            {
              "sym": "n",
              "desc": "tamaño de muestra mínimo requerido"
            },
            {
              "sym": "z_{\\frac{1+\\gamma}{2}}",
              "desc": "cuantil de la normal estándar de orden $\\tfrac{1+\\gamma}{2}$"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza poblacional (o cota/estimación previa)"
            },
            {
              "sym": "E",
              "desc": "semiamplitud del intervalo (error de muestreo máximo admitido)"
            }
          ],
          "cond": "Proporción: cota conservadora $p(1-p)\\le\\tfrac14$ o $\\hat p$ previo. Redondear hacia arriba."
        },
        {
          "label": "Corrección por población finita",
          "kind": "formula",
          "tex": "E=z_{1-\\frac{\\alpha}{2}}\\sqrt{\\hat p(1-\\hat p)}\\,\\sqrt{\\frac{N-n}{N\\,n}}",
          "body": "Semiamplitud del IC de una proporción cuando se muestrea sin reposición de una población finita de tamaño $N$ (modelo hipergeométrico). El factor $\\sqrt{(N-n)/(N\\,n)}$ reduce el error respecto del muestreo con reposición y obliga a que $n$ esté acotado por $N$.",
          "vars": [
            {
              "sym": "E",
              "desc": "semiamplitud del intervalo (error de muestreo)"
            },
            {
              "sym": "z_{1-\\frac{\\alpha}{2}}",
              "desc": "cuantil de la normal estándar de orden $1-\\tfrac{\\alpha}{2}$ ($\\alpha=1-\\gamma$)"
            },
            {
              "sym": "\\hat p",
              "desc": "proporción muestral"
            },
            {
              "sym": "N",
              "desc": "tamaño de la población finita"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra (sin reposición)"
            }
          ],
          "cond": "Si $N\\gg n$ se recupera $E=z\\sqrt{\\hat p(1-\\hat p)/n}$."
        },
        {
          "label": "IC de la varianza (ji-cuadrado)",
          "kind": "formula",
          "tex": "\\left[\\frac{(n-1)S^2}{\\chi^2_{n-1,1-\\alpha/2}},\\ \\frac{(n-1)S^2}{\\chi^2_{n-1,\\alpha/2}}\\right]",
          "body": "Intervalo de confianza para la varianza poblacional $\\sigma^2$ de una muestra normal. Se apoya en que $(n-1)S^2/\\sigma^2$ sigue una distribución ji-cuadrado con $n-1$ g.l.; el intervalo es asimétrico porque esa distribución no es simétrica.",
          "vars": [
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "S^2",
              "desc": "varianza muestral"
            },
            {
              "sym": "\\chi^2_{n-1,1-\\alpha/2}",
              "desc": "cuantil de la ji-cuadrado con $n-1$ g.l. y orden $1-\\tfrac{\\alpha}{2}$ (extremo superior)"
            },
            {
              "sym": "\\chi^2_{n-1,\\alpha/2}",
              "desc": "cuantil de la ji-cuadrado con $n-1$ g.l. y orden $\\tfrac{\\alpha}{2}$ (extremo inferior)"
            },
            {
              "sym": "\\alpha",
              "desc": "nivel de significación, $\\alpha=1-\\gamma$"
            }
          ],
          "note": "$\\chi^2_k$: $E=k$, $V=2k$."
        }
      ]
    },
    {
      "title": "Distribuciones de muestreo",
      "hint": "t de Student y ji-cuadrado: las que aparecen al estimar con σ desconocido.",
      "unit": "8",
      "entries": [
        {
          "label": "t de Student $t_m$",
          "kind": "formula",
          "tex": "T=\\frac{\\bar X_n-\\mu}{S_n/\\sqrt n}\\sim t_{n-1}",
          "body": "Estandariza la media muestral cuando el desvío poblacional es desconocido y se lo reemplaza por el desvío muestral $S_n$. El estadístico resultante sigue una distribución $t$ de Student con $n-1$ grados de libertad, de colas más pesadas que la normal (fractiles mayores) por la variabilidad extra que introduce estimar $\\sigma$.",
          "vars": [
            {
              "sym": "T",
              "desc": "estadístico pivote con distribución $t_{n-1}$"
            },
            {
              "sym": "\\bar X_n",
              "desc": "media muestral de las $n$ observaciones"
            },
            {
              "sym": "\\mu",
              "desc": "media poblacional bajo estudio"
            },
            {
              "sym": "S_n",
              "desc": "desvío estándar muestral (estima $\\sigma$)"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "t_{n-1}",
              "desc": "distribución $t$ de Student con $m=n-1$ grados de libertad"
            }
          ],
          "cond": "$m\\to\\infty\\Rightarrow t_m\\to N(0,1)$. Menos g.l. → fractil mayor."
        },
        {
          "label": "Ji-cuadrado $\\chi^2_k$",
          "kind": "formula",
          "tex": "\\begin{aligned} \\sum_{i=1}^k Z_i^2 &\\sim \\chi^2_k \\\\ \\frac{(n-1)S_n^2}{\\sigma^2} &\\sim \\chi^2_{n-1} \\end{aligned}",
          "body": "La distribución ji-cuadrado con $k$ grados de libertad es la suma de $k$ normales estándar independientes al cuadrado; tiene media $E=k$ y varianza $V=2k$, y es aditiva en los grados de libertad. Aplicada a la inferencia, la varianza muestral escalada $(n-1)S_n^2/\\sigma^2$ sigue una $\\chi^2_{n-1}$, lo que permite construir intervalos y tests sobre $\\sigma^2$.",
          "vars": [
            {
              "sym": "Z_i",
              "desc": "normales estándar $N(0,1)$ independientes, con $i=1,\\dots,k$"
            },
            {
              "sym": "k",
              "desc": "cantidad de términos sumados, igual a los grados de libertad"
            },
            {
              "sym": "\\chi^2_k",
              "desc": "distribución ji-cuadrado con $k$ grados de libertad"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "S_n^2",
              "desc": "varianza muestral"
            },
            {
              "sym": "\\sigma^2",
              "desc": "varianza poblacional"
            },
            {
              "sym": "\\chi^2_{n-1}",
              "desc": "distribución ji-cuadrado con $n-1$ grados de libertad"
            }
          ],
          "cond": "Construye la t: $T=Z/\\sqrt{V/k}$ con $Z\\sim N(0,1)$, $V\\sim\\chi^2_k$ indep."
        }
      ]
    },
    {
      "title": "Pruebas de hipótesis",
      "hint": "Decidir entre H0 y H1 controlando la probabilidad de error.",
      "unit": "9",
      "entries": [
        {
          "label": "Hipótesis y tipo de cola",
          "kind": "def",
          "body": "$H_0$ (nula, por defecto, se mantiene salvo evidencia fuerte) vs $H_1$ (alternativa). **Dos colas**: $\\theta=\\theta_0$ vs $\\ne$. **Cola der.**: $\\theta\\le\\theta_0$ vs $>$. **Cola izq.**: $\\theta\\ge\\theta_0$ vs $<$.",
          "note": "La igualdad SIEMPRE va en $H_0$. Analogía del jurado: $H_0$=inocente."
        },
        {
          "label": "Ingredientes",
          "kind": "def",
          "body": "**Estadístico** $\\Lambda$ (resume la muestra); **región de rechazo** $R$; **nivel de significación** $\\alpha$ tal que $P_{H_0}(\\Lambda\\in R)\\le\\alpha$.",
          "note": "Región en las colas: ahí caen los valores improbables bajo $H_0$."
        },
        {
          "label": "Errores tipo I y II",
          "kind": "def",
          "tex": "\\begin{aligned} \\alpha &= P(\\text{rechazar }H_0\\mid H_0\\text{ cierta}) \\\\ \\beta &= P(\\text{aceptar }H_0\\mid H_0\\text{ falsa}) \\end{aligned}",
          "body": "Cuantifica las dos formas de equivocarse en la decisión. El **error tipo I** ($\\alpha$) es rechazar $H_0$ siendo verdadera; el **error tipo II** ($\\beta$) es aceptar $H_0$ siendo falsa. La **potencia** de la prueba es $1-\\beta$: la probabilidad de rechazar correctamente una $H_0$ falsa.",
          "vars": [
            {
              "sym": "\\alpha",
              "desc": "probabilidad de error tipo I; se fija de antemano (nivel de significación)"
            },
            {
              "sym": "\\beta",
              "desc": "probabilidad de error tipo II; depende del valor real del parámetro"
            },
            {
              "sym": "H_0",
              "desc": "hipótesis nula"
            }
          ],
          "note": "$\\alpha$ es un número (se fija); $\\beta=\\beta(\\theta_1)$ es una función (curva OC)."
        },
        {
          "label": "Balance α-β",
          "kind": "caution",
          "body": "Bajar $\\alpha$ tiende a **subir** $\\beta$ y viceversa. Para bajar **ambos** a la vez hay que **aumentar $n$**.",
          "note": "Diseño: fijar $\\alpha$ y $\\beta(\\theta_1)$ para despejar $n$ y el valor crítico $c$."
        },
        {
          "label": "Estadístico para la media",
          "kind": "formula",
          "tex": "\\begin{aligned} Z &= \\frac{\\bar X-\\mu_0}{\\sigma/\\sqrt n}\\sim N(0,1) \\\\ T &= \\frac{\\bar X-\\mu_0}{S/\\sqrt n}\\sim t_{n-1} \\end{aligned}",
          "body": "Estandariza la media muestral bajo $H_0$ para contrastar la media poblacional. Se usa $Z$ (normal estándar) cuando $\\sigma$ es conocida o la muestra es grande; se usa $T$ (t de Student con $n-1$ grados de libertad) cuando $\\sigma$ es desconocida, la población es normal y $n$ es chico.",
          "vars": [
            {
              "sym": "Z",
              "desc": "estadístico estandarizado con distribución normal estándar"
            },
            {
              "sym": "T",
              "desc": "estadístico estandarizado con distribución t de Student"
            },
            {
              "sym": "\\bar X",
              "desc": "media muestral"
            },
            {
              "sym": "\\mu_0",
              "desc": "valor de la media poblacional postulado por $H_0$"
            },
            {
              "sym": "\\sigma",
              "desc": "desvío estándar poblacional (conocido)"
            },
            {
              "sym": "S",
              "desc": "desvío estándar muestral (estima $\\sigma$)"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra"
            },
            {
              "sym": "t_{n-1}",
              "desc": "distribución t de Student con $n-1$ grados de libertad"
            }
          ]
        },
        {
          "label": "Estadístico para la proporción",
          "kind": "formula",
          "tex": "Z=\\frac{\\hat q-q_0}{\\sqrt{q_0(1-q_0)/n}}\\sim N(0,1)",
          "body": "Estandariza la proporción muestral bajo $H_0$ para contrastar la proporción poblacional, aproximando por la normal. Tanto el numerador como el denominador se evalúan con el valor postulado $q_0$ (todo bajo $H_0$), nunca con $\\hat q$.",
          "vars": [
            {
              "sym": "Z",
              "desc": "estadístico estandarizado con distribución normal estándar"
            },
            {
              "sym": "\\hat q",
              "desc": "proporción muestral de éxitos, $\\hat q=X/n$"
            },
            {
              "sym": "q_0",
              "desc": "valor de la proporción poblacional postulado por $H_0$"
            },
            {
              "sym": "X",
              "desc": "cantidad de éxitos en la muestra"
            },
            {
              "sym": "n",
              "desc": "tamaño de la muestra (grande, $>100$)"
            }
          ],
          "note": "Diferencia clave con el IC de proporción (que usa $\\hat q$)."
        },
        {
          "label": "Región de rechazo por cola",
          "kind": "method",
          "tex": "\\begin{aligned} \\text{2 colas:}\\quad & |Z|>z_{1-\\alpha/2} \\\\ \\text{der.:}\\quad & Z>z_{1-\\alpha} \\\\ \\text{izq.:}\\quad & Z<-z_{1-\\alpha} \\end{aligned}",
          "body": "Define la región de rechazo según el tipo de cola: el estadístico cae en una o ambas colas de la normal estándar según hacia dónde apunte $H_1$. Se rechaza $H_0$ cuando $Z$ supera el fractil crítico correspondiente.",
          "vars": [
            {
              "sym": "Z",
              "desc": "estadístico de prueba observado"
            },
            {
              "sym": "z_{1-\\alpha/2}",
              "desc": "fractil de la normal estándar de orden $1-\\alpha/2$ (prueba bilateral)"
            },
            {
              "sym": "z_{1-\\alpha}",
              "desc": "fractil de la normal estándar de orden $1-\\alpha$ (prueba unilateral)"
            },
            {
              "sym": "\\alpha",
              "desc": "nivel de significación"
            }
          ],
          "note": "Con $T$ se reemplaza $z$ por el fractil $t_{n-1}$. Valor crítico des-estandarizado: $\\bar x_c=\\mu_0+z_{1-\\alpha}\\sigma/\\sqrt n$."
        },
        {
          "label": "Valor p",
          "kind": "def",
          "tex": "\\begin{aligned} \\text{rechazar }H_0 &\\iff \\text{valor p}<\\alpha \\\\ \\text{der.:}\\quad \\text{valor p} &= 1-\\Phi(z_{obs}) \\\\ \\text{izq.:}\\quad \\text{valor p} &= \\Phi(z_{obs}) \\\\ \\text{2 colas:}\\quad \\text{valor p} &= 2\\bigl(1-\\Phi(|z_{obs}|)\\bigr) \\end{aligned}",
          "body": "El valor p es la probabilidad, calculada bajo $H_0$, de obtener un estadístico \"tan malo o peor\" que el observado. Se rechaza $H_0$ cuando el valor p queda por debajo del nivel de significación $\\alpha$. La fórmula del valor p depende de la cola de la prueba.",
          "vars": [
            {
              "sym": "\\alpha",
              "desc": "nivel de significación con el que se compara el valor p"
            },
            {
              "sym": "\\Phi",
              "desc": "función de distribución acumulada de la normal estándar"
            },
            {
              "sym": "z_{obs}",
              "desc": "valor observado del estadístico estandarizado"
            },
            {
              "sym": "H_0",
              "desc": "hipótesis nula"
            }
          ],
          "note": "NO es $P(H_0$ cierta$)$: es prob. sobre los datos dado $H_0$."
        },
        {
          "label": "Reconocer la prueba",
          "kind": "method",
          "body": "1) Identificar parámetro (media o proporción). 2) Plantear $H_0/H_1$ y la cola según hacia dónde apunta $H_1$. 3) Elegir $Z$ o $T$. 4) Región/valor p. 5) Decidir y concluir.",
          "cond": "Dato = conteo de éxitos/total → proporción. Dualidad: IC bilateral $\\gamma$ no rechaza $H_0:\\theta=\\theta_0$ a nivel $\\alpha=1-\\gamma$."
        }
      ]
    }
  ]
};
