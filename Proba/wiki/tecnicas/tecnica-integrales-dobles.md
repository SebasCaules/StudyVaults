---
titulo: Integrales dobles
tipo: tecnica
unidad: 0
tags: [complemento-matematico, integracion, continua, bidimensional]
fuentes: ["[[complemento-integrales-dobles]]"]
actualizado: 2026-06-06
---

# Integrales dobles

**En breve.** Integrar una densidad conjunta $f_{XY}$ sobre una región $R$ da la
probabilidad $P((X,Y)\in R)$ (el volumen bajo la superficie). Es la operación
**inversa** de derivar la FDA conjunta, y sirve para normalizar, calcular
probabilidades de regiones, esperanzas y marginales.

**Para qué sirve en proba:** dos variables aleatorias continuas se describen por
una [[funcion-de-densidad|densidad conjunta]] $f_{XY}(x,y)$. La probabilidad de
que el par $(X,Y)$ caiga en una región $R$ es el **volumen** bajo la superficie de
densidad, que se calcula con una integral doble
$P((X,Y)\in R)=\iint_R f_{XY}\,dA$; y la normalización exige $\iint_{\mathbb R^2} f_{XY}=1$.
El apunte [[complemento-integrales-dobles]] motiva esto con la analogía física de la
**masa de una placa** de densidad superficial $d(x,y)$.

## Idea: la integral doble como suma de Riemann (masa de una placa)
Dividimos la placa en celdas $\Delta x \times \Delta y$. La masa de la celda
centrada en $(x_i,y_j)$ es aproximadamente densidad por área:
$$ \Delta\text{masa}(x_i,y_j)\approx d(x_i,y_j)\,\Delta x\,\Delta y. $$
La masa total es la doble suma, y al refinar la malla ($\Delta x,\Delta y\to 0$)
se vuelve la integral doble:
$$ \text{masa}\approx \sum_i\sum_j d(x_i,y_j)\,\Delta x\,\Delta y \;\xrightarrow[]{}\; \text{masa}=\iint_R d(x,y)\,dx\,dy. $$

**Diccionario masa ↔ probabilidad:** densidad $d(x,y)$ [kg/m²] $\leftrightarrow$
densidad conjunta $f_{XY}(x,y)$; masa total $\leftrightarrow$ probabilidad total
(debe ser $1$); baricentro $\leftrightarrow$ vector de esperanzas $(E[X],E[Y])$.

## Teorema de Fubini (integral iterada)
La integral doble se calcula como dos integrales simples anidadas, y **el orden de
integración se puede elegir** (ajustando los límites al recinto). Para el triángulo
$0<x<1,\;0<y<1-x$:
$$ \iint_R d\,dA = \int_0^1\!\!\left[\int_0^{1-x} d(x,y)\,dy\right]dx = \int_0^1\!\!\left[\int_0^{1-y} d(x,y)\,dx\right]dy. $$
Clave: al integrar primero en $y$, los límites de $y$ pueden depender de $x$ (y viceversa).

**Intuición.** Pensá la integral interna como **barrer el recinto con una varilla**.
Fijás un valor de $x$ (la varilla es vertical) y la deslizás de abajo hacia arriba
sumando densidad: por eso los límites de $y$ son funciones de $x$ —miden cuánto mide
la varilla en cada posición. Recién después la integral externa **suma todas las
varillas** moviendo $x$ de extremo a extremo del recinto. Por eso los límites
**externos son siempre constantes** y los **internos pueden depender de la variable
externa**: si te quedan dos variables en un límite, casi seguro invertiste el orden.

## Centro de masa / baricentro (≈ esperanzas)
$$ \bar x = \frac{\iint_R x\,d(x,y)\,dA}{\text{masa}},\qquad \bar y = \frac{\iint_R y\,d(x,y)\,dA}{\text{masa}}. $$
En proba, si $d$ es la densidad conjunta normalizada (masa $=1$), entonces
$\bar x = E[X]$ y $\bar y = E[Y]$.

## Cómo reconocer cuándo usarla
- Probabilidad de una región del plano para un par $(X,Y)$ continuo.
- Normalizar una densidad conjunta (hallar la constante $k$ con $\iint k\,g = 1$).
- Calcular $E[X]$, $E[Y]$, $E[g(X,Y)]$ o densidades marginales.

## Ejercicio resuelto

> Una placa triangular ocupa $\{0<x,\;0<y,\;x+y<1\}$ y tiene densidad
> $d(x,y)=xy$ [kg/m²]. Hallar la masa y el centro de masa.
> (Ejemplo de [[complemento-integrales-dobles]].)

**Planteo (masa).** Por Fubini, integrando primero en $y$ entre $0$ y $1-x$, y
luego en $x$ entre $0$ y $1$:
$$ \text{masa} = \int_0^1\!\!\int_0^{1-x} x\,y\,dy\,dx. $$

**Cálculo de la masa (como aparece en el apunte).** El apunte integra primero en
$y$ y escribe la primitiva como $xy^2$, de modo que
$$ \int_0^{1-x} xy\,dy \;\overset{\text{apunte}}{=}\; xy^2\Big|_0^{1-x} = x(1-x)^2, $$
y luego
$$ \int_0^1 x(1-x)^2\,dx = \int_0^1 (x-2x^2+x^3)\,dx = \frac{x^2}{2}-\frac{2x^3}{3}+\frac{x^4}{4}\Big|_0^1 = \frac{1}{2}-\frac{2}{3}+\frac{1}{4}=\frac{6-8+3}{12}=\frac{1}{12}. $$
**Masa $=\dfrac{1}{12}$ kg** (valor del apunte). El apunte verifica que invirtiendo
el orden ($\int_0^1\int_0^{1-y} yx\,dx\,dy$) obtiene lo mismo, $1/12$.

> ⚠️ Discrepancia: en este paso el apunte [[complemento-integrales-dobles]] usa
> la primitiva $\int xy\,dy = xy^2$, **omitiendo el $\tfrac12$**. La primitiva
> correcta es $\int xy\,dy = x\frac{y^2}{2}$, que daría
> $\int_0^1 \frac{x(1-x)^2}{2}\,dx = \frac{1}{24}$ kg. Notar que más abajo, en el
> cálculo de $\bar x$, el **mismo apunte sí incluye el $\tfrac12$** (obtiene
> $1/60$), por lo que la masa $1/12$ es internamente inconsistente con ese paso.
> Con la masa correcta $1/24$ el baricentro sería $\bar x=\frac{1/60}{1/24}=\frac{2}{5}$
> en vez de $\frac15$. Verificar con el docente cuál es la convención esperada en
> el parcial; acá se reproduce el resultado del apunte ($1/12$ y $\bar x=1/5$).

**Cálculo del numerador de $\bar x$.**
$$ \text{masa}\cdot\bar x = \int_0^1\!\!\int_0^{1-x} x\cdot xy\,dy\,dx = \int_0^1 \frac{x^2 y^2}{2}\Big|_0^{1-x}dx = \frac{1}{2}\int_0^1 x^2(1-x)^2\,dx. $$
$$ = \frac{1}{2}\int_0^1 (x^2-2x^3+x^4)\,dx = \frac{1}{2}\left(\frac{x^3}{3}-\frac{2x^4}{4}+\frac{x^5}{5}\right)\Big|_0^1 = \frac{1}{2}\left(\frac{1}{3}-\frac{1}{2}+\frac{1}{5}\right) = \frac{1}{2}\cdot\frac{10-15+6}{30}=\frac{1}{60}. $$

**Baricentro.**
$$ \bar x = \frac{\text{masa}\cdot\bar x}{\text{masa}} = \frac{1/60}{1/12} = \frac{12}{60} = \frac{1}{5}. $$
Por simetría del problema en $x\leftrightarrow y$, $\bar y = \dfrac{1}{5}$ también.

**Resultado.** Masa $=\dfrac{1}{12}$ kg; baricentro $\left(\bar x,\bar y\right)=\left(\tfrac15,\tfrac15\right)$.

> Lectura probabilística: si en vez de una placa esto fuera una densidad conjunta,
> primero habría que normalizar dividiendo por la masa para que integre $1$; el
> baricentro sería entonces $(E[X],E[Y])$.

## Relación con otras páginas
- [[funcion-de-densidad]] — densidad conjunta y normalización en 2D.
- [[variables-aleatorias-bidimensionales]] — donde se aplica esta técnica.
- [[tecnica-integrales-impropias]] — la versión 1D (y para recintos no acotados, los límites pueden ir a $\infty$).
- [[tecnica-derivadas-parciales]] — operación inversa: derivar la masa acumulada da la densidad.
- [[esperanza]] — el baricentro es el análogo de la esperanza.
- [[varianza]] — el momento de inercia respecto del baricentro es el análogo de la varianza.
- [[independencia]] — para chequear independencia de $(X,Y)$ se compara la densidad conjunta con el producto de las marginales (obtenidas integrando).
- [[funcion-de-distribucion-acumulada]] — integrar la densidad sobre $\{X\le x, Y\le y\}$ recupera la FDA conjunta.
