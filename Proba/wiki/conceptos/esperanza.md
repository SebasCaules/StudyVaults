---
titulo: Esperanza (Valor Esperado)
tipo: concepto
unidad: 3
tags: [discreta, esperanza, momentos]
fuentes: ["[[va-discretas-introduccion]]", "[[tp3-variables-aleatorias-discretas]]"]
actualizado: 2026-06-06
---

# Esperanza (Valor Esperado)

**En breve.** Es el promedio "a largo plazo" de una [[variable-aleatoria|v.a.]]:
un promedio ponderado de sus valores, donde el peso de cada valor es su
probabilidad. Sirve para resumir una distribución en un solo número y para
comparar alternativas inciertas (ver [[teoria-de-la-decision-valor-esperado|teoría de la decisión]]).

La **esperanza** o **valor esperado** de una [[variable-aleatoria|v.a. discreta]]
$X$, notada $\mu_X$ o $E[X]$, es:
$$
E[X] = \mu_X = \sum_{k \in \mathcal{R}_X} k\,p_X(k)
$$

> **Intuición.** Pensar la PMF como masas $p_X(k)$ colocadas sobre la recta en
> cada $k$: $E[X]$ es el **centro de masa** (el punto donde la barra se
> equilibra). Por eso no tiene por qué coincidir con ningún valor del recorrido
> (un dado tiene $E[X]=3{,}5$). Cada masa "tira" del balance proporcionalmente a
> su probabilidad y a su distancia al centro.

![[esperanza-centro-masa.svg]]

**Interpretación.** Si se repite el experimento muchas veces y se registran los
valores de $X$, el promedio converge a $E[X]$. Es el análogo probabilístico de la
media de [[datos-agrupados|datos agrupados]] $\bar{x}_{Ag} = \sum_i x_i\,(f_i/n)$,
donde la frecuencia relativa $f_i/n$ converge a $P(X=k)$
(según [[va-discretas-introduccion]]). Gráficamente, $E[X]$ es el punto que
"equilibra" la distribución.

## Esperanza de una función de la v.a.

Para una función cualquiera $g : \mathbb{R} \mapsto \mathbb{R}$:
$$
E[g(X)] = \sum_{k \in \mathcal{R}_X} g(k)\,p_X(k)
$$
En particular, los **momentos**: $E[X^k] = \sum_x x^k p_X(x)$. Esto se usa para
calcular la [[varianza|varianza]] vía $V(X) = E[X^2] - (E[X])^2$. Todos los
momentos se pueden recuperar de golpe con la
[[funcion-generadora-de-momentos|función generadora de momentos]].

> **Intuición.** La fórmula $E[g(X)] = \sum_k g(k)\,p_X(k)$ evita construir la variable $Y = g(X)$ desde cero. El camino largo sería: (1) determinar el recorrido de $Y$, (2) calcular $p_Y$ para cada valor, (3) recién entonces sumar $y\cdot p_Y(y)$. La fórmula saltea los pasos (1) y (2): como las probabilidades de $Y$ ya están determinadas por las de $X$, se promedian directamente los $g(k)$ con los pesos $p_X(k)$ que ya se conocen.

## Propiedades (linealidad)

Sean $a,b,c$ constantes y $X, Y$ v.a. discretas:
- $E[c] = c$.
- $E[a\cdot X] = a\cdot E[X]$.
- $E[X + Y] = E[X] + E[Y]$ (incluso si **no** son [[independencia|independientes]]).
- Combinando: $E[a\cdot X + b\cdot Y + c] = a\,E[X] + b\,E[Y] + c$.

> ⚠️ **Atención.** Si $X, Y$ son v.a., en general $E[X\cdot Y] \ne E[X]\cdot E[Y]$.
> No factorizar un valor esperado cuando hay **dos variables** multiplicándose sin
> verificar que se pueda (requiere [[independencia|independencia]]).

> **Observación.** $E[X^2]$ y $(E[X])^2$ son cosas cualitativamente distintas: la primera es el valor esperado de la variable $X^2$ (se promedian los $k^2$ con pesos $p_X(k)$), mientras que la segunda es la constante $E[X]$ elevada al cuadrado. Por notación, el exponente afecta lo que está inmediatamente antes: en $(E[X])^2$ el cuadrado actúa sobre el número $E[X]$; en $E[X^2]$ actúa sobre la variable $X$ antes de tomar esperanza. Siempre vale $E[X^2] \ge (E[X])^2$ (es la varianza $\ge 0$), con igualdad solo si $X$ es constante casi seguramente.

> **Nota.** $\mu_X = E[X]$ es un **parámetro** (letra griega): describe el promedio *antes* de correr el experimento, cuando todavía no hay datos. La media muestral $\bar{x}$ (letra latina) se calcula *después*, sobre datos ya observados. La notación marca de qué mundo se habla: la griega es probabilística (lo que *va a pasar*), la latina es estadística (lo que *ya pasó*). Confundirlas es un error conceptual, no solo de símbolo; la convergencia $\bar{x} \to \mu_X$ al repetir el experimento es justamente lo que vincula ambos mundos.

## Ejercicio resuelto

**Enunciado** ([[va-discretas-introduccion]], ejemplo del casino). Una persona
apuesta: al tirar un dado, el casino gana \$4 si sale 1 y pierde \$1 en caso
contrario. Sea $G$ = ganancia del casino. Calcular $E[G]$.

**Planteo.** Recorrido $\mathcal{R}_G = \{-4, 1\}$ (el casino "gana" $-4$ si el
apostador acierta el 1, y gana $1$ si no). Por [[regla-de-laplace|Laplace]]:
$P(G=-4) = P(\text{sale } 1) = \tfrac16$ y $P(G=1) = \tfrac56$.

**Cálculo.**
$$
E[G] = (-4)\cdot\tfrac16 + 1\cdot\tfrac56 = \tfrac{-4+5}{6} = \tfrac16
$$

**Resultado.** $E[G] = \tfrac16 > 0$: el casino sale ganando. En 1000 apuestas
gana en promedio $\approx 166{,}66$ pesos.

> **Variante** (ítem de la misma fuente, slides de Pantazis). Sea $Y$ = **cantidad
> de apuestas (ensayos) hasta que el casino pierde por primera vez**. Es una
> [[distribucion-geometrica#Versión "número de ensayos" (slides Pantazis)|geométrica en su versión "número de ensayos"]]
> con $p=\tfrac16$, $\mathcal{R}_Y=\mathbb{N}=\{1,2,\dots\}$ y
> $P(Y=k)=\left(\tfrac56\right)^{k-1}\tfrac16$, de modo que $E[Y]=\tfrac1p=6$
> (¡no $q/p=5$!). La ganancia acumulada del casino hasta esa primera derrota es
> $h(Y)=-4+1\cdot(Y-1)=Y-5$, y por linealidad $E[h(Y)]=E[Y]-5=6-5=1$.
>
> > ⚠️ **Cuidado con la convención.** Esta fuente usa la geométrica como **número
> > de ensayos** ($E=1/p$). La página [[distribucion-geometrica]] adopta por defecto
> > la convención de la cátedra **"número de fracasos"** ($E=q/p$). No mezclar las
> > fórmulas: con la versión de fracasos $Z=Y-1$ daría $E[Z]=q/p=5$. Ver la nota de
> > convenciones en esa página.

## Aplicación: teoría de la decisión

Un uso central de la esperanza es **elegir entre alternativas inciertas
maximizando el valor esperado** de la ganancia. Ver
[[teoria-de-la-decision-valor-esperado|Teoría de la decisión]] (criterio de
maximización del valor esperado, con el ejercicio del vendedor de diarios del TP3
resuelto paso a paso).
