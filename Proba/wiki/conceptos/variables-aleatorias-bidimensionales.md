---
titulo: Variables Aleatorias Bidimensionales
tipo: concepto
unidad: 5
tags: [bidimensionales, conjunta, marginal]
fuentes: ["[[teorica-bidimensionales-vad-intro]]", "[[teorica-bidimensionales-vac-intro]]", "[[tp5-2024]]"]
actualizado: 2026-06-06
---

# Variables Aleatorias Bidimensionales

**En breve.** Cuando se observan dos magnitudes a la vez, su distribución conjunta ($p_{X,Y}$ o
$f_{X,Y}$) lo contiene todo: sumando/integrando una variable se obtienen las marginales, y
dividiendo se obtienen las condicionales.

Un vector aleatorio $(X,Y)$ describe dos magnitudes observadas en el mismo experimento. Su
comportamiento conjunto se resume en la **distribución conjunta**; a partir de ella se obtienen
las **marginales** (la distribución de cada variable por separado) y las
[[independencia-de-variables-aleatorias|condicionales]].

> **Intuición.** Pensá la conjunta como una tabla (discreta) o una "sábana" de densidad (continua)
> sobre el plano. La marginal de $X$ es la "sombra" que proyecta esa sábana sobre el eje $x$ al
> aplastar la dimensión $y$ (sumar o integrar en $y$). Por eso dos sábanas con forma muy distinta
> pueden dar la misma sombra: las marginales **no** reconstruyen la conjunta.

## Caso discreto (V.A.D.)

**Función de masa de probabilidad conjunta:**
$$ p_{X,Y}(x,y)=P(X=x,\,Y=y),\qquad x\in R_X,\;y\in R_Y. $$
Cumple $p_{X,Y}\ge0$ y $\displaystyle\sum_{x\in R_X}\sum_{y\in R_Y} p_{X,Y}(x,y)=1$.

**Marginales (sumando filas/columnas):**
$$ p_X(x)=\sum_{y\in R_Y} p_{X,Y}(x,y),\qquad p_Y(y)=\sum_{x\in R_X} p_{X,Y}(x,y). $$

**Valor esperado de una función:** para $h:\mathbb{R}^2\to\mathbb{R}$,
$$ E[h(X,Y)]=\sum_{x\in R_X}\sum_{y\in R_Y} h(x,y)\,p_{X,Y}(x,y). $$
Si $h$ depende solo de $X$ se recupera $E[h(X)]=\sum_x h(x)\,p_X(x)$ (consistencia con la marginal).

## Caso continuo (V.A.C.)

**Densidad de probabilidad conjunta** $f_{X,Y}\ge0$:
$$ P\big((X,Y)\in B\big)=\iint_B f_{X,Y}(x,y)\,dx\,dy,\qquad \iint_{\mathbb{R}^2} f_{X,Y}=1. $$
En particular sobre un rectángulo $P(a<X\le b,\,c<Y\le d)=\int_a^b\!\int_c^d f_{X,Y}\,dy\,dx$.
Allí donde tienen sentido las derivadas, $f_{X,Y}(x,y)=\dfrac{\partial^2}{\partial x\,\partial y}P(X\le x,Y\le y)$.

**Densidades marginales (integrando la otra variable):**
$$ f_X(t)=\int_{-\infty}^{\infty} f_{X,Y}(t,y)\,dy,\qquad f_Y(u)=\int_{-\infty}^{\infty} f_{X,Y}(x,u)\,dx. $$

**Valor esperado:** $E[h(X,Y)]=\displaystyle\iint_{\mathbb{R}^2} h(x,y)\,f_{X,Y}(x,y)\,dx\,dy$.

## Tabla comparativa

| | V.A.D. | V.A.C. |
|---|---|---|
| conjunta | $p_{X,Y}(x,y)$ | $f_{X,Y}(x,y)$ |
| marginal de $X$ | $p_X(x)=\sum_y p_{X,Y}$ | $f_X(x)=\int f_{X,Y}\,dy$ |
| marginal de $Y$ | $p_Y(y)=\sum_x p_{X,Y}$ | $f_Y(y)=\int f_{X,Y}\,dx$ |
| esperanza | $\sum\sum h\,p_{X,Y}$ | $\iint h\,f_{X,Y}$ |

> Las marginales NO determinan la conjunta: distintas conjuntas pueden tener las mismas
> marginales. Solo bajo [[independencia-de-variables-aleatorias|independencia]] vale
> $p_{X,Y}=p_X\,p_Y$ (o $f_{X,Y}=f_X\,f_Y$).

## Condicionales y esperanza condicional

- Densidad condicional: $f_{X\mid Y}(x\mid y)=\dfrac{f_{X,Y}(x,y)}{f_Y(y)}$ (análogo discreto con $p$).
- Esperanza condicional: $E[g(X)\mid Y=y]=\int g(x)\,f_{X\mid Y}(x\mid y)\,dx$.
- **Ley de esperanza total:** $E[g(X)]=E\big[E[g(X)\mid Y=y]\big]=\int E[g(X)\mid Y=y]\,f_Y(y)\,dy$.

## Ejercicio resuelto

**(Ej. 25 de [[tp5-2024]])** Sea $f_{X,Y}(x,y)=a(x+y)$ en $(0,3)\times(0,3)$ y $0$ fuera.
Hallar $a$, $P(1<X<2,\,1<Y<2)$ y $E[X]$.

**Constante de normalización.**
$$ 1=\int_0^3\!\int_0^3 a(x+y)\,dx\,dy=\int_0^3 a\!\left(\tfrac{9}{2}+3y\right)dy=27a \;\Rightarrow\; a=\tfrac{1}{27}. $$

**Probabilidad pedida.**
$$ P(1<X<2,1<Y<2)=\int_1^2\!\int_1^2 \tfrac{1}{27}(x+y)\,dx\,dy=\int_1^2 \tfrac{1}{27}\!\left(\tfrac{3}{2}+y\right)dy=\tfrac{1}{9}. $$

**Marginal y esperanza.** Integrando en $y$:
$$ f_X(x)=\int_0^3 \tfrac{1}{27}(x+y)\,dy=\tfrac{1}{6}+\tfrac{x}{9},\qquad x\in(0,3). $$
$Y$ tiene la misma densidad (simetría), así que $X$ e $Y$ están igualmente distribuidas. Luego
$$ E[X]=\int_0^3 x\!\left(\tfrac{1}{6}+\tfrac{x}{9}\right)dx=\tfrac{7}{4}. $$

**Resultado.** $a=\tfrac{1}{27}$, $P=\tfrac{1}{9}$, $E[X]=E[Y]=\tfrac{7}{4}$. Además $X,Y$ NO son
independientes (ver [[independencia-de-variables-aleatorias]]) y $\text{Cov}(X,Y)=-\tfrac{1}{16}$:
$$ E[XY]=\iint_{(0,3)^2} xy\,\tfrac{1}{27}(x+y)\,dx\,dy=3,\qquad \text{Cov}(X,Y)=E[XY]-E[X]E[Y]=3-\left(\tfrac{7}{4}\right)^2=-\tfrac{1}{16}. $$

> ⚠️ Discrepancia con el raw: una versión arrastra $E[XY]=\tfrac{5}{3}$ y de ahí
> $\text{Cov}(X,Y)=-\tfrac{67}{48}$. El cálculo correcto da $E[XY]=3$ (la integral de $xy\,f_{X,Y}$
> sobre $(0,3)^2$ vale $81/27=3$) y por lo tanto $\text{Cov}(X,Y)=-\tfrac{1}{16}$. Ver
> [[covarianza-y-correlacion]].

## Ejercicio resuelto — esperanza condicional en el cilindro

**(Ejemplo de [[teorica-bidimensionales-vac-intro]])** Una pieza cilíndrica tiene radio $R$ y
altura $H$ con densidad conjunta $f_{R,H}(r,h)=\tfrac{3}{500}\,r$ en la región triangular
$0<r<h<10$ (y $0$ fuera). Hallar la densidad condicional $f_{R\mid H}(r\mid h)$, la esperanza
condicional $E[R\mid H=h]$ y verificar la ley de esperanza total.

**Marginal de $H$.** Integrando $r$ entre $0$ y $h$ (porque $r<h$):
$$ f_H(h)=\int_0^h \tfrac{3}{500}\,r\,dr=\tfrac{3}{1000}\,h^2,\qquad 0<h<10. $$

**Densidad condicional.** Para $0<r<h<10$:
$$ f_{R\mid H}(r\mid h)=\frac{f_{R,H}(r,h)}{f_H(h)}=\frac{\tfrac{3}{500}\,r}{\tfrac{3}{1000}\,h^2}=\frac{2r}{h^2}, $$
y $0$ en otro caso. (Es una densidad válida en $r\in(0,h)$: integra a 1.)

**Esperanza condicional.**
$$ E[R\mid H=h]=\int_0^h r\cdot\frac{2r}{h^2}\,dr=\frac{2}{h^2}\cdot\frac{r^3}{3}\Big|_0^h=\frac{2h}{3}. $$

**Ley de esperanza total (verificación).** Promediando $E[R\mid H=h]$ contra $f_H$:
$$ E\big[E[R\mid H]\big]=\int_0^{10} \frac{2h}{3}\cdot\frac{3}{1000}h^2\,dh=\int_0^{10}\frac{h^3}{500}\,dh=\frac{h^4}{2000}\Big|_0^{10}=\frac{10000}{2000}=5=E[R]. $$

**Resultado.** $f_{R\mid H}(r\mid h)=\tfrac{2r}{h^2}$, $E[R\mid H=h]=\tfrac{2h}{3}$, y se cumple
$E[E[R\mid H]]=5=\mu_R$. El soporte triangular (no rectangular) ya anticipa que $R,H$ **no** son
independientes (ver [[independencia-de-variables-aleatorias]]); de hecho $\text{Cov}(R,H)=2.5\neq0$.
La formalización de $E[X\mid Y]$ y la ley de esperanza/varianza total está en
[[esperanza-condicional]].

## Relación con otras páginas
- [[independencia-de-variables-aleatorias]] — factorización conjunta = producto de marginales.
- [[covarianza-y-correlacion]] — momentos cruzados del vector $(X,Y)$.
- [[esperanza-condicional]] — $E[X\mid Y]$, leyes de esperanza total y de varianza total.
- [[mezcla-de-distribuciones]] — caso mixto (una discreta + una continua).
- [[funcion-de-variable-aleatoria]] — $X+Y$, $XY$ como funciones de $(X,Y)$.

## Complementos matemáticos (técnicas de cálculo)
- [[tecnica-integrales-dobles]] — probabilidades $P((X,Y)\in B)=\iint_B f_{X,Y}$ y
  esperanzas $E[h(X,Y)]=\iint h\,f_{X,Y}$ se calculan por **integral doble** (Fubini).
- [[tecnica-derivadas-parciales]] — la densidad conjunta es la **derivada parcial
  cruzada** de la FDA conjunta: $f_{X,Y}(x,y)=\partial^2 F_{X,Y}/\partial x\,\partial y$.
