---
titulo: Variable Aleatoria Continua
tipo: concepto
unidad: 4
tags: [continua, variable-aleatoria, fda, densidad]
fuentes: ["[[teorica-va-continuas]]", "[[tp4-variables-aleatorias-continuas]]"]
actualizado: 2026-06-06
---

# Variable Aleatoria Continua

**En breve.** Es una [[variable-aleatoria|variable aleatoria]] cuya [[funcion-de-distribucion-acumulada|FDA]] es continua (sin saltos): toma valores en un continuo, su probabilidad puntual es $0$ y se describe por una [[funcion-de-densidad|densidad]]. Probabilidades, [[esperanza|esperanza]] y [[varianza|varianza]] pasan de sumas (caso discreto) a **integrales**.

Una **variable aleatoria continua** (v.a.c.) es una [[variable-aleatoria|variable aleatoria]]
$X$ que toma valores en un continuo de $\mathbb{R}$ y cuya probabilidad
puntual es nula. Según [[teorica-va-continuas]] y [[tp4-variables-aleatorias-continuas]]
hay tres caracterizaciones equivalentes:

$$ X \text{ es v.a.c.} \iff F_X \text{ es continua} \iff P(X=\alpha)=0\quad\forall\alpha\in\mathbb{R}. $$

Además $P(X\in\mathbb{R})=1$. El caso $P(X=\alpha)=0$ **no** ocurre con una
variable aleatoria discreta (v.a.d.), donde la [[funcion-de-distribucion-acumulada|FDA]]
tiene saltos (forma de "escalera") en los puntos del recorrido.

> Ejemplo intuitivo ([[teorica-va-continuas]]): si $X=$ altura en cm de un alumno
> tomado al azar, entonces $P(X=173\text{ cm})=0$, e incluso
> $P(X=173.0000\ldots)=0$.

**Intuición ($P(X=\alpha)=0$).** Hay infinitos valores posibles en cualquier intervalo, así que la probabilidad de "pegarle exactamente" a uno es nula. Lo que tiene probabilidad positiva son los **intervalos**: preguntás $P(172.5<X<173.5)$, no $P(X=173)$. Una consecuencia cómoda es que $<$ y $\le$ dan lo mismo (no hay que cuidar los bordes, a diferencia del caso discreto).

## Función de distribución acumulada (FDA)

Toda v.a. (discreta o continua) tiene [[funcion-de-distribucion-acumulada|FDA]]
$F_X:\mathbb{R}\to[0,1]$, $F_X(\alpha)=P(X\le\alpha)$, con las propiedades:

1. **No decreciente:** $\alpha\le\beta \Rightarrow F_X(\alpha)\le F_X(\beta)$ (creciente, no estrictamente).
2. $\displaystyle\lim_{\alpha\to-\infty}F_X(\alpha)=0$.
3. $\displaystyle\lim_{\alpha\to+\infty}F_X(\alpha)=1$.
4. $P(\alpha<X\le\beta)=P(X\in(\alpha,\beta])=F_X(\beta)-F_X(\alpha)$.

Para una v.a.c. $F_X$ es **continua**, y por eso da igual usar $<$ o $\le$:
$$ P(a<X<b)=P(a\le X\le b)=F_X(b)-F_X(a). $$

> **Intuición.** Conviene arrancar el estudio de una v.a.c. por la FDA porque **es una probabilidad**: valen todas las herramientas que ya conocés (probabilidad total, eventos mutuamente excluyentes, complemento). La densidad, en cambio, no es una probabilidad, así que esas herramientas no aplican directamente. Estrategia típica: calcular $F_X$ con reglas de probabilidad, derivar para obtener $f_X$, y con la densidad calcular $E[X]$, $\operatorname{Var}(X)$, etc.

> **Observación.** Cuando la FDA queda partida en tramos, chequeá siempre que los tramos coincidan en los extremos del soporte: si el soporte es $(a,b)$, al sustituir $a$ en el tramo intermedio tiene que dar $F_X(a)=0$ y al sustituir $b$ tiene que dar $F_X(b)=1$. Si no coinciden, hay un error de cálculo. Como $F_X$ de una v.a.c. es continua, este chequeo de continuidad en los empalmes detecta la mayoría de los errores antes de seguir.

## Función de densidad

La densidad se obtiene derivando la FDA: $f_X(x)=\dfrac{dF_X(x)}{dx}$ (ver
[[funcion-de-densidad|Función de densidad]] para detalle). Recíprocamente,
$$ F_X(x)=\int_{-\infty}^{x} f_X(y)\,dy,\qquad \int_{-\infty}^{+\infty} f_X(y)\,dy = 1. $$

> **Cuidado:** La densidad $f_X(x)$ **puede tomar valores mayores que 1** — no es una probabilidad, es una "densidad". Lo que nunca puede superar $1$ es la integral: $\int_a^b f_X(x)\,dx \le 1$ para cualquier $[a,b]$, y sobre todo el soporte vale exactamente $1$. Por ejemplo, una densidad que vale $2$ sobre un soporte de base $0{,}5$ integra $2\cdot 0{,}5=1$, así que es válida. Confundir densidad con probabilidad lleva a descartar densidades válidas o a aceptar densidades inválidas.

## Esperanza como integral

La versión continua de la [[esperanza|esperanza]] reemplaza la suma de la v.a.d.
por una integral (es el límite de discretizar la v.a.c. con datos agrupados,
[[teorica-va-continuas]]):

$$ \mu_X = E[X] = \int_{-\infty}^{+\infty} x\, f_X(x)\,dx. $$

Más en general, el valor esperado de una función $g$ y los momentos son
$$ E[g(X)] = \int_{-\infty}^{+\infty} g(x)\,f_X(x)\,dx,\qquad E[X^k] = \int_{-\infty}^{+\infty} x^k\,f_X(x)\,dx. $$

## Varianza como integral

La versión continua de la [[varianza|varianza]]:
$$ \sigma_X^2 = \operatorname{Var}(X) = E[(X-\mu_X)^2] = \int_{-\infty}^{+\infty} (x-\mu_X)^2\, f_X(x)\,dx = E[X^2]-(E[X])^2, $$
con $E[X^2]=\int_{-\infty}^{+\infty} x^2\,f_X(x)\,dx$. Siempre $\sigma_X^2\ge0$.

## Esperanza por la cola (fórmula de supervivencia)

Para una v.a.c. **no negativa** ($X\ge0$), la esperanza se puede calcular integrando la
**función de supervivencia** $P(X>x)=1-F_X(x)$ en lugar de $x\,f_X(x)$
([[tp4-variables-aleatorias-continuas]] ej. 34-36):
$$ E[X]=\int_0^{+\infty}\big(1-F_X(x)\big)\,dx=\int_0^{+\infty}P(X>x)\,dx. $$
Es útil cuando se conoce $F_X$ (o $P(X>x)$) pero la densidad es incómoda de integrar. Surge
de intercambiar el orden de integración en $E[X]=\int_0^\infty\!\int_0^x f_X(x)\,dy\,dx$.

Ejemplo (exponencial): $\int_0^\infty e^{-\lambda x}\,dx=\tfrac1\lambda=E[X]$, consistente con
$E[X]=1/\lambda$ de la [[distribucion-exponencial|exponencial]].

## Integrales impropias

Como el soporte suele ser no acotado, conviene recordar
([[tecnica-integrales-impropias|integrales impropias]]):
$$ \int_a^{+\infty} w(x)\,dx=\lim_{t\to+\infty}\int_a^{t} w(x)\,dx, $$
y análogamente para $-\infty$ y para puntos donde $w$ no está definida.

## Distribuciones continuas usuales

- [[distribucion-uniforme-continua|Uniforme]] $\text{Unif}(a,b)$.
- [[distribucion-exponencial|Exponencial]] $\text{Expo}(\lambda)$.
- [[distribucion-normal|Normal]] $N(\mu,\sigma)$.

## Ejercicio resuelto

**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 3 (resuelto en la guía).

**Enunciado.** La densidad de $X$ es $f_X(x)=2(1-x)$ para $x\in(0,1)$ y $0$ fuera.
Calcular $E[X]$, $\operatorname{Var}[X]$ y la mediana $m$ definida por $P(X<m)=1/2$.

**Planteo.** El recorrido es $(0,1)$, así que las integrales van de $0$ a $1$.

**Cálculo.**
$$ E[X]=\int_0^1 x\cdot 2(1-x)\,dx=\int_0^1 (2x-2x^2)\,dx=\Big[x^2-\tfrac{2}{3}x^3\Big]_0^1=1-\tfrac23=\tfrac13. $$
$$ E[X^2]=\int_0^1 x^2\cdot 2(1-x)\,dx=\int_0^1 (2x^2-2x^3)\,dx=\Big[\tfrac23 x^3-\tfrac12 x^4\Big]_0^1=\tfrac23-\tfrac12=\tfrac16. $$
$$ \operatorname{Var}[X]=E[X^2]-(E[X])^2=\tfrac16-\tfrac19=\tfrac{3-2}{18}=\tfrac1{18}. $$
Para la mediana,
$$ P(X<m)=\int_0^m 2(1-x)\,dx=2m-m^2=\tfrac12. $$
Resolviendo $m^2-2m+\tfrac12=0$ en $(0,1)$ se obtiene $m=1-\tfrac{1}{\sqrt2}$.

**Resultado.** $E[X]=\tfrac13$, $\operatorname{Var}[X]=\tfrac1{18}$, $m\approx0.293$.
