---
titulo: Función de Densidad de Probabilidad
tipo: concepto
unidad: 4
tags: [continua, densidad, pdf]
fuentes: ["[[teorica-va-continuas]]", "[[tp4-variables-aleatorias-continuas]]"]
actualizado: 2026-06-06
---

# Función de Densidad de Probabilidad

**En breve.** Es el análogo continuo de la PMF discreta: una función $f_X\ge0$ que integra $1$ y cuyo **área** bajo un intervalo da la probabilidad de ese intervalo. Sirve para calcular probabilidades, [[esperanza|esperanzas]] y [[varianza|varianzas]] de una variable continua.

La **función de densidad de probabilidad** (pdf, *probability density function*)
$f_X$ de una [[variable-aleatoria-continua|variable aleatoria continua]] $X$ es la
derivada de su [[funcion-de-distribucion-acumulada|FDA]] donde esta sea derivable
([[teorica-va-continuas]]):

$$ f_X(x) = \frac{dF_X(x)}{dx}\quad\text{para todo } x\in\mathbb{R} \text{ donde } F_X \text{ es derivable}. $$

Recíprocamente, la FDA es la integral de la densidad:
$$ F_X(x)=\int_{-\infty}^{x} f_X(y)\,dy. $$

## Propiedades

1. **Integra 1:** $\displaystyle\int_{-\infty}^{+\infty} f_X(x)\,dx=\int_{\mathbb{R}} f_X(x)\,dx=1.$
2. **No negativa:** $f_X(x)\ge0$ para todo $x$ (consecuencia de que $F_X$ es no decreciente).

## Interpretación

**Intuición.** Pensá en la densidad como "probabilidad por unidad de longitud" (igual que la densidad física es masa por unidad de volumen): no es una probabilidad en sí, sino una **tasa**. Por eso puede valer más que $1$ — lo que nunca pasa de $1$ es el **área** $f_X(x)\,\Delta x$ acumulada sobre un intervalo. Cuanto más alta es la densidad en una zona, más concentrada está ahí la probabilidad.

La densidad **no** es una probabilidad: $f_X(x)$ puede ser mayor que $1$. Lo que
aproxima una probabilidad es $f_X$ por un ancho pequeño ([[teorica-va-continuas]]):
$$ f_X(\alpha)\,\Delta x \approx P\!\left(X\in\left(x-\tfrac{\Delta x}{2},\,x+\tfrac{\Delta x}{2}\right]\right)\quad\text{si }\Delta x\text{ es chico}. $$

La probabilidad de un intervalo es el área bajo la densidad:
$$ P(a<X\le b)=\int_a^b f_X(x)\,dx = F_X(b)-F_X(a). $$

> Nota: el valor de $f_X$ en un punto aislado no importa para las probabilidades,
> porque $P(X=\alpha)=0$. Por eso da igual definir o no la densidad en los
> bordes del soporte (ej.: en la [[distribucion-uniforme-continua|uniforme]] no
> se define $f_X$ en $a$ ni en $b$).

> **Intuición.** La densidad surge de "refinar" una discreta. Si medís temperatura con un termómetro que trunca al entero tenés pocos valores y cada probabilidad puntual es alta; si pasás a décimas tenés diez veces más valores y cada probabilidad puntual se divide aproximadamente entre diez, pero la probabilidad de un *rango* casi no cambia. Al llevar el paso a cero, las probabilidades puntuales tienden a $0$ mientras que la probabilidad de un rango converge a un valor estable: ese límite es $\int_a^b f_X$. Por eso la densidad no mide probabilidad en un punto sino **concentración de probabilidad en un rango**.

> **Observación.** En una variable continua conviene distinguir dos formas de "no ocurre":
> - **Improbable pero posible:** un valor $x$ con $f_X(x)>0$ (está en el **soporte**). Tiene probabilidad puntual $0$, pero puede ocurrir.
> - **Imposible bajo el modelo:** un valor $x$ con $f_X(x)=0$ fuera del soporte; la distribución lo excluye.
>
> Que $P(X=\alpha)=0$ **no** implica que $\alpha$ sea imposible: en un continuo la probabilidad debe repartirse entre infinitos valores, así que todo punto del soporte da $0$ aun siendo alcanzable.

## Esperanza y momentos a partir de la densidad

$$ E[g(X)]=\int_{-\infty}^{+\infty} g(x)\,f_X(x)\,dx,\qquad E[X^k]=\int_{-\infty}^{+\infty} x^k\,f_X(x)\,dx. $$
En particular la [[esperanza|esperanza]] $\mu_X=\int x\,f_X\,dx$ y la
[[varianza|varianza]] $\sigma_X^2=\int (x-\mu_X)^2 f_X\,dx=E[X^2]-(E[X])^2$.

## Complementos matemáticos (técnicas de cálculo)

La densidad es el objeto central de varias técnicas de los Complementos Matemáticos:
- **[[tecnica-integrales-impropias]]** — la normalización $\int_{\mathbb R} f_X=1$ y
  los momentos $E[X^k]$ sobre soporte no acotado son integrales impropias.
- **[[tecnica-integrales-dobles]]** — en el caso bidimensional, probabilidades y
  esperanzas se calculan integrando la densidad conjunta sobre una región del plano.
- **[[tecnica-derivadas-parciales]]** — la densidad se recupera **derivando** la
  [[funcion-de-distribucion-acumulada|FDA]] ($f_X=F_X'$ en 1D; densidad conjunta
  $=\partial^2 F/\partial x\,\partial y$ en 2D).

> **Cuidado:** cuando la [[funcion-de-distribucion-acumulada|FDA]] queda partida en tramos, verificá que **encajen en los puntos de corte**: el tramo central evaluado en el extremo inferior del soporte debe dar $0$ y en el extremo superior debe dar $1$ (la FDA de una continua es **continua**, sin saltos). Si no coinciden, hay un error en la primitiva. Es una verificación barata que atrapa la mayoría de los errores de cálculo antes de usar la FDA para probabilidades.

## Cómo se relaciona con la PMF discreta

| | v.a. discreta | v.a. continua |
|---|---|---|
| objeto base | PMF $p_X(x)=P(X=x)$ | densidad $f_X(x)$ |
| "normalización" | $\sum_x p_X(x)=1$ | $\int_{\mathbb{R}} f_X=1$ |
| esperanza | $\sum_x x\,p_X(x)$ | $\int_{\mathbb{R}} x\,f_X(x)\,dx$ |
| $P(X=x)$ | $p_X(x)$ (puede ser $>0$) | siempre $0$ |

## Ejercicio resuelto

**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 14 a) (Weibull, resuelto en la guía).

**Enunciado.** La duración $X$ (en miles de horas) sigue una distribución de
[[distribucion-weibull|Weibull]] con FDA $F_X(x)=1-e^{-(\lambda x)^b}$ para $x>0$,
con $b=2$ y $\lambda=0.01$. Obtener la densidad $f_X$.

**Planteo.** La densidad es la derivada de la FDA donde existe; como $F_X=0$ para
$x\le0$, su derivada también es $0$ ahí.

**Cálculo.** Para $x>0$, con $b=2$, $\lambda=0.01$:
$$ f_X(x)=\frac{d}{dx}\Big[1-e^{-(0.01x)^2}\Big]=-e^{-(0.01x)^2}\cdot\big[-(0.01x)^2\big]'. $$
Como $\big[(0.01x)^2\big]'=2\cdot0.01x\cdot0.01=0.0002\,x$,
$$ f_X(x)=0.0002\,x\,e^{-(0.01x)^2}. $$

**Resultado.**
$$ f_X(x)=\begin{cases} 0.0002\,x\,e^{-(0.01x)^2} & x>0\\[2pt] 0 & x\le0.\end{cases} $$
(En general, $f_X(x)=\lambda b(\lambda x)^{b-1}e^{-(\lambda x)^b}$ para $x>0$.)
