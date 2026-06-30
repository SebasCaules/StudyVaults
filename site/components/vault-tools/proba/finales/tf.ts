/* ============================================================================
 * Banco de Verdadero/Falso de Proba — derivado de los "errores típicos" y
 * moralejas de los ejercicios de parcial resueltos (Proba/wiki/tecnicas/
 * ejercicios-de-parcial-resueltos*.md). Cada ítem entrena un concepto que la
 * cátedra marca como trampa frecuente. `type` lo cruza con el filtro por tema.
 * El texto admite math inline $...$ (lo renderiza RichText).
 * ========================================================================== */

import type { TFItem } from "./types";

export const TF_ITEMS: TFItem[] = [
  {
    id: "tf-mezcla-desvio",
    type: "va-continua",
    claim: String.raw`En una mezcla, el desvío $\sigma_X$ es el promedio ponderado de los desvíos de cada componente, $\sigma_X = \sum_i p_i\,\sigma_i$.`,
    answer: false,
    explain: String.raw`Se promedian la densidad, la FDA y los momentos $E[X^k]$ (son esperanzas), pero el desvío NO: hay que mezclar $E[X^2] = \sum_i p_i\,(V(X_i)+E[X_i]^2)$ y recién después $V(X)=E[X^2]-E[X]^2$.`,
  },
  {
    id: "tf-poisson-erlang",
    type: "procesos",
    claim: String.raw`Para calcular $P(T_5 < 45)$ en un proceso de Poisson conviene integrar la densidad Erlang/Gamma de $T_5$.`,
    answer: false,
    explain: String.raw`Conviene la equivalencia de sucesos: $P(T_5<45)=P(N(45)\ge 5)$, una suma de la PMF de Poisson, mucho más barata que integrar la Gamma.`,
  },
  {
    id: "tf-markov-pk",
    type: "procesos",
    claim: String.raw`La entrada $(i,j)$ de $\mathbb{P}^k$ es la probabilidad de ir del estado $i$ al $j$ en exactamente $k$ pasos.`,
    answer: true,
    explain: String.raw`Es probabilidad total sobre los estados intermedios: la fila por la columna suma "ir a un intermedio y desde ahí al destino" sobre cada camino de longitud $k$.`,
  },
  {
    id: "tf-markov-bayes",
    type: "procesos",
    claim: String.raw`La matriz de transición sirve para invertir el tiempo, p. ej. calcular $P(X(1)=C \mid X(3)=F)$.`,
    answer: false,
    explain: String.raw`La matriz solo va hacia adelante. Para "mirar hacia atrás" se usa Bayes; si la inicial es uniforme, queda solo el cociente de las transicionales a 2 pasos.`,
  },
  {
    id: "tf-absorbente-regular",
    type: "procesos",
    claim: String.raw`Una cadena con un único estado absorbente alcanzable desde todos los demás es regular.`,
    answer: false,
    explain: String.raw`No es regular (el absorbente no sale de sí mismo), pero sí tiene distribución a largo plazo: a la larga todo termina en el absorbente, $\vec\pi$ concentrada en él.`,
  },
  {
    id: "tf-fundamental-vs-complemento",
    type: "procesos",
    claim: String.raw`Para $P(\text{no absorbido en } k \text{ pasos})$ a horizonte fijo conviene la matriz fundamental $(I-Q)^{-1}$.`,
    answer: false,
    explain: String.raw`La matriz fundamental da el tiempo MEDIO de absorción, no una probabilidad a horizonte fijo. Para eso conviene el complemento $1-P(\text{absorbido en } \le k)$.`,
  },
  {
    id: "tf-hiper-vs-binom",
    type: "va-discreta",
    claim: String.raw`Extracción sin reposición de un pool finito $\Rightarrow$ hipergeométrica; con reposición o pool infinito $\Rightarrow$ binomial.`,
    answer: true,
    explain: String.raw`Cuando $N$ es enorme frente a $n$, la hipergeométrica se aproxima por la binomial (el factor de corrección $\tfrac{N-n}{N-1}\to 1$).`,
  },
  {
    id: "tf-horizonte-temporal",
    type: "va-discreta",
    claim: String.raw`Si $P(X\ge 6)$ se pide para 9 dosis (72 h) y $E,\sigma$ para 6 dosis (48 h), se usa $n=9$ en todas las cuentas.`,
    answer: false,
    explain: String.raw`Cada pregunta tiene su horizonte: $E,\sigma$ van con $n=6$. Usar $n=9$ para $E,\sigma$ da el horizonte equivocado ($E=27/5$ en vez de $18/5$).`,
  },
  {
    id: "tf-emv-log",
    type: "estimacion",
    claim: String.raw`Aplicar $\ln$ a la verosimilitud cambia el valor de $\lambda$ que la maximiza.`,
    answer: false,
    explain: String.raw`El $\ln$ es creciente, así que no mueve el argmax: solo convierte el producto de densidades en una suma, más fácil de derivar.`,
  },
  {
    id: "tf-z-vs-t-n-grande",
    type: "intervalos",
    claim: String.raw`Con $n$ grande y $\sigma$ desconocido se puede usar $z$ (normal) en lugar de la $t$ para el IC de la media.`,
    answer: true,
    explain: String.raw`Por LGN $s$ estima muy bien a $\sigma$, así que el "ensanche" de la $t$ es despreciable. Con $n$ chico esa aproximación falla y hay que usar $t$.`,
  },
  {
    id: "tf-critico-con-s",
    type: "hipotesis",
    claim: String.raw`Es válido fijar el valor crítico de un test como $x_c = \mu_0 - t_{n-1;0.9}\,\tfrac{s}{\sqrt n}$ usando el $s$ de la muestra.`,
    answer: false,
    explain: String.raw`$s$ se conoce DESPUÉS de muestrear, pero la región de rechazo se fija ANTES. El crítico debe ser a priori: $t_c = -t_{n-1;0.9}$, y se rechaza si $\tfrac{\bar X_n-\mu_0}{s/\sqrt n} < t_c$.`,
  },
  {
    id: "tf-critico-proporcion",
    type: "hipotesis",
    claim: String.raw`En un test de proporción de dos colas centrado en $0.25$, el crítico superior puede valer $0.2407$.`,
    answer: false,
    explain: String.raw`Imposible: el crítico superior debe ser $> 0.25$. El correcto es $0.2907$ (simétrico de $0.2093$ respecto de $0.25$); $0.2407$ es un typo del raw.`,
  },
  {
    id: "tf-despeje-n-cerrado",
    type: "tcl",
    claim: String.raw`Cuando el tamaño $n$ aparece solo dentro de la raíz (estadístico $\hat p$, $z$ fijo) se despeja de forma cerrada, sin iterar.`,
    answer: true,
    explain: String.raw`A diferencia del $t$ (cuyo cuantil $t_{0.95,n-1}$ depende de $n$ y obliga a prueba y error), con $z$ el tamaño muestral se despeja de una sola vez.`,
  },
  {
    id: "tf-transformacion-momentos",
    type: "va-continua",
    claim: String.raw`Para hallar $E[Q]$ con $Q = 10D^2+2$ hace falta primero obtener la densidad $f_Q$.`,
    answer: false,
    explain: String.raw`Se usa la esperanza de una función de v.a. directamente: $E[Q]=10\,E[D^2]+2$, sin hallar $f_Q$. La densidad solo hace falta si la piden explícitamente.`,
  },
  {
    id: "tf-boxplot-outlier",
    type: "descriptiva",
    claim: String.raw`En un boxplot, un dato más allá de $q_3 + 1.5\,IQR$ se considera un valor atípico (outlier).`,
    answer: true,
    explain: String.raw`Los bigotes llegan hasta $q_1-1.5\,IQR$ y $q_3+1.5\,IQR$; todo lo que cae fuera es un outlier (p. ej. el $8$ con bigote superior en $7$).`,
  },
  {
    id: "tf-conjunta-limites",
    type: "conjuntas",
    claim: String.raw`Al integrar una densidad conjunta de soporte triangular hay que ajustar los límites según la región (no son constantes).`,
    answer: true,
    explain: String.raw`Conviene dibujar la región. P. ej. $X>3$ con $1\le x\le t+1$ exige $t+1>3 \Rightarrow t>2$, por eso la integral en $t$ arranca en $2$, no en $0$.`,
  },
  {
    id: "tf-laplace-hiper",
    type: "probabilidad",
    claim: String.raw`Extraer sin reposición de un pool finito con casos equiprobables y contar con binomiales reproduce la hipergeométrica.`,
    answer: true,
    explain: String.raw`La regla de Laplace (favorables/totales) con coeficientes binomiales ES la PMF hipergeométrica: el ejercicio la deriva desde el conteo, sin invocar la fórmula cerrada.`,
  },
  {
    id: "tf-suma-iid-tcl",
    type: "tcl",
    claim: String.raw`Para una suma $S_n=\sum_{i=1}^n M_i$ de v.a. i.i.d., el TCL da $S_n \overset{(a)}{\sim} \mathcal{N}(n\mu_M,\,\sqrt n\,\sigma_M)$.`,
    answer: true,
    explain: String.raw`La media de la suma escala con $n$, pero el desvío con $\sqrt n$ (NO con $n$). El despeje del $n$ que cumple la cota suele quedar como una cuadrática en $\sqrt n$.`,
  },
  {
    id: "tf-poisson-normal-cc",
    type: "tcl",
    claim: String.raw`Para $\lambda t$ grande, $N(t)\sim Po(\lambda t)$ se aproxima por una normal de media $\lambda t$ y desvío $\lambda t$ (la misma media y varianza del Poisson).`,
    answer: false,
    explain: String.raw`La varianza del Poisson es $\lambda t$, pero el DESVÍO es $\sqrt{\lambda t}$: la aproximación es $\mathcal{N}(\lambda t,\sqrt{\lambda t})$, y conviene corrección por continuidad ($k-0.5$).`,
  },
  {
    id: "tf-estimador-pre-post",
    type: "estimacion",
    claim: String.raw`El estimador $\hat\lambda = 1/\bar X$ es una variable aleatoria (pre-muestra) y el número que sale de evaluarlo con los datos es la estimación (post-muestra).`,
    answer: true,
    explain: String.raw`Distinción pre-muestra / post-muestra: $\hat\lambda=1/\bar X$ es el estimador como v.a.; reemplazar los datos da la estimación puntual (un número).`,
  },
  {
    id: "tf-t-n-chico",
    type: "intervalos",
    claim: String.raw`Con población normal, $\sigma$ desconocido y $n$ chico, el estadístico correcto para el IC de la media es la $t$ de Student.`,
    answer: true,
    explain: String.raw`$\sigma$ desconocido más $n$ chico obligan a usar $t_{n-1}$, que ensancha el intervalo frente a la normal; con $n$ grande la $t$ se confunde con la $z$.`,
  },
  {
    id: "tf-sospecha-en-h1",
    type: "hipotesis",
    claim: String.raw`La afirmación que se quiere demostrar (p. ej. "el tiempo medio disminuye") se carga en $H_1$, no en $H_0$.`,
    answer: true,
    explain: String.raw`Por eso ante "¿disminuye $\mu$?" se plantea $H_0:\mu\ge\mu_0$ contra $H_1:\mu<\mu_0$: la sospecha siempre va en la alternativa.`,
  },
  {
    id: "tf-pvalor-bajo-h0",
    type: "hipotesis",
    claim: String.raw`El p-valor es la probabilidad, bajo $H_0$, de un resultado tan o más extremo que el observado.`,
    answer: true,
    explain: String.raw`En dos colas es $2[1-\Phi(\cdot)]$, la probabilidad bajo $H_0$ de un resultado al menos tan alejado. Se rechaza $H_0$ si p-valor $<\alpha$.`,
  },
  {
    id: "tf-error-ii-bajo-h0",
    type: "hipotesis",
    claim: String.raw`El error tipo II $\beta$ se calcula bajo la distribución de $H_0$.`,
    answer: false,
    explain: String.raw`$\beta = P(\text{aceptar }H_0\mid \text{valor real})$ se evalúa bajo la distribución REAL/alternativa (p. ej. $p=0.18$), no bajo $H_0$: es la probabilidad de caer entre los críticos cuando $H_0$ es falsa.`,
  },
  {
    id: "tf-mediana-agrupados",
    type: "descriptiva",
    claim: String.raw`La mediana de datos agrupados se obtiene ubicando el intervalo donde se acumula el 50% e interpolando linealmente dentro de él.`,
    answer: true,
    explain: String.raw`Con las frecuencias acumuladas se localiza el intervalo del 50% y se interpola $\tilde x = L_i + \frac{m - F_{ant}}{f_{int}}\cdot(\text{ancho})$.`,
  },
];
