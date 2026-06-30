---
titulo: Estandarización y uso de la tabla normal (Z)
tipo: tecnica
unidad: 4
tags: [continua, normal, tabla, fractil, tecnica]
fuentes: ["[[teorica-va-normal]]", "[[tp4-variables-aleatorias-continuas]]"]
actualizado: 2026-06-06
---

# Estandarización y uso de la tabla normal (Z)

**En breve.** Receta para resolver cualquier [[distribucion-normal|normal]] $N(\mu,\sigma)$ con una sola tabla: estandarizar $Z=\frac{X-\mu}{\sigma}$, buscar $\Phi$ (probabilidad → valor) o el fractil $z_\alpha$ (valor → probabilidad), y usar la simetría $\Phi(-z)=1-\Phi(z)$ para los negativos.

Técnica para calcular probabilidades y fractiles de una
[[distribucion-normal|normal]] $X\sim N(\mu,\sigma)$ usando una única tabla de la
**normal estándar** $Z\sim N(0,1)$ ([[teorica-va-normal]], [[tp4-variables-aleatorias-continuas]]).

## Normal estándar

$Z\sim N(0,1)$ tiene media $0$ y desvío $1$, densidad
$f_Z(z)=\frac{1}{\sqrt{2\pi}}e^{-z^2/2}$ y FDA
$$ \Phi(z)\overset{\text{def}}{=}F_Z(z)=P(Z\le z)=\int_{-\infty}^{z}\frac{1}{\sqrt{2\pi}}e^{-y^2/2}\,dy. $$
No tiene forma cerrada → se **tabula**. Valores guía: $\Phi(0)=0.5$,
$\lim_{z\to+\infty}\Phi(z)=1$, $\lim_{z\to-\infty}\Phi(z)=0$.

![[normal-estandar-phi.svg]]

## Paso 1 — estandarizar

$$ Z=\frac{X-\mu}{\sigma}\sim N(0,1),\qquad F_X(x)=P(X\le x)=\Phi\!\left(\frac{x-\mu}{\sigma}\right). $$
La igualdad de probabilidades al estandarizar vale porque se aplica una función
**creciente y biyectiva** a ambos lados de la desigualdad ([[tp4-variables-aleatorias-continuas]] ej. 21).

**Intuición (qué es el $z$).** El valor estandarizado $z=\frac{x-\mu}{\sigma}$ responde "¿a cuántos **desvíos** del centro está $x$?". Un $z=2$ significa "dos desvíos por encima de la media", sin importar las unidades originales (litros, notas, mm). Como todas las normales tienen la misma forma una vez medidas en desvíos, esa pregunta tiene la misma respuesta de probabilidad para cualquier $\mu,\sigma$ — y por eso una sola tabla de $\Phi$ alcanza.

## Paso 2 — simetría (tablas solo con $z\ge0$)

La densidad es simétrica, así que:
$$ \boxed{\ \Phi(z)=1-\Phi(-z)\ }\qquad\Longrightarrow\qquad \Phi(-z)=1-\Phi(z). $$
Esto permite calcular probabilidades con $z$ negativo usando una tabla que solo
tiene valores positivos.

Probabilidades útiles:
- $P(X>x)=1-\Phi\!\left(\frac{x-\mu}{\sigma}\right)$.
- $P(a<X\le b)=\Phi\!\left(\frac{b-\mu}{\sigma}\right)-\Phi\!\left(\frac{a-\mu}{\sigma}\right)$.
- Intervalo simétrico centrado: $P(\mu-k\sigma<X<\mu+k\sigma)=2\Phi(k)-1$.

> **Intuición.** $\Phi(-z)=1-\Phi(z)$ no es solo una fórmula: es la razón geométrica de que la campana sea simétrica respecto del cero. El área a la izquierda de $-z$ (cola izquierda) es exactamente la imagen espejada del área a la derecha de $z$ (cola derecha). Como el área total es $1$, esa cola derecha vale $1-\Phi(z)$. Por eso, cada vez que la tabla no da un $z$ negativo, buscás su opuesto positivo y tomás el complemento — estás midiendo la misma porción de la campana, solo desde el otro lado.

## Paso 3 — fractiles (problema inverso)

Cuando dan la probabilidad y piden el valor:
$$ z_\alpha=\Phi^{-1}(\alpha),\qquad x_\alpha=\mu+\sigma\,z_\alpha. $$
Por simetría del fractil:
$$ \boxed{\ z_{1-\alpha}=-z_\alpha\ }\qquad\Longleftrightarrow\qquad \Phi^{-1}(\alpha)=-\Phi^{-1}(1-\alpha). $$
Se usa la **tabla de fractiles** $\Phi^{-1}(\alpha)$ de [[tp4-variables-aleatorias-continuas]]
(Sec. 3). Fractiles habituales: $z_{0.90}\approx1.2816$, $z_{0.95}\approx1.6449$,
$z_{0.975}\approx1.96$, $z_{0.99}\approx2.3263$.

> **Observación.** La tabla de fractiles de la normal estándar solo muestra valores $\alpha\ge0.5$ porque, por simetría, todo $\alpha<0.5$ corresponde a un fractil negativo: $z_\alpha=-z_{1-\alpha}$. El caso límite es $z_{0.5}=0$ (la mediana coincide con la media). Para $\alpha=0.452$, por ejemplo, se busca $z_{0.548}$ en la tabla y se niega el resultado.

> **Cuidado:** En el problema inverso (dado $\alpha$, hallar $z_\alpha$) es muy fácil aplicar la simetría al revés y obtener el signo equivocado. El profe advierte explícitamente que usar $z_{1-\alpha}=-z_\alpha$ sin visualizar la situación lleva a errores. Antes de operar, hacé un dibujito: marcá el área pedida, identificá si el fractil queda a la izquierda o a la derecha del cero, y recién ahí aplicá la fórmula.

## Interpolación lineal

Si el $z$ buscado cae **entre dos filas** de la tabla, se interpola linealmente.
Para $\Phi(z)$ con $z\in(z_1,z_2)$:
$$ \Phi(z)\approx \Phi(z_1)+\frac{\Phi(z_2)-\Phi(z_1)}{z_2-z_1}\,(z-z_1). $$
> Ejemplo ([[teorica-va-normal]]): $\Phi(0.6\overline{6})$ con $\Phi(0.66)=0.7454$ y
> $\Phi(0.67)=0.7486$ da $\approx0.7475$.

## Mini-receta

1. Identificar $\mu$ y $\sigma$ (cuidado: la cátedra da el **desvío**, no la varianza).
2. ¿Piden probabilidad o valor? Probabilidad → estandarizar y buscar $\Phi$.
   Valor → buscar fractil $z_\alpha$ y despejar $x_\alpha=\mu+\sigma z_\alpha$.
3. Usar $\Phi(-z)=1-\Phi(z)$ y $z_{1-\alpha}=-z_\alpha$ para los negativos.
4. Interpolar si hace falta.

## Ejercicio resuelto

**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 27 ítem 4 (resuelto en la guía).

**Enunciado.** Notas $X\sim N(78,6)$. La nota reprobatoria $x_R$ deja por debajo
al $25\%$ inferior. Calcular aproximadamente la proporción de estudiantes con
nota que supera **en al menos 5 puntos** a $x_R$.

**Planteo.** Primero $x_R$ con $P(X\le x_R)=0.25$, luego $P(X\ge x_R+5)$.

**Cálculo.**
$$ \Phi\!\left(\frac{x_R-78}{6}\right)=0.25 \Rightarrow \frac{x_R-78}{6}=z_{0.25}=-z_{0.75}\approx-0.6745 \Rightarrow x_R\approx78-6\cdot0.6745\approx73.95. $$
Entonces
$$ P(X\ge x_R+5)=P(X\ge78.95)=1-\Phi\!\left(\frac{78.95-78}{6}\right)\approx1-\Phi(0.16)\approx1-0.5631=0.4369. $$

**Resultado.** $\approx44\%$ de los estudiantes superan en al menos 5 puntos a la
nota reprobatoria del $25\%$.

### Ejercicio resuelto — cuartiles de la normal, outliers de Tukey y $E[|Z|]$
**Fuente:** [[tp4-variables-aleatorias-continuas]] ej. 15 ítems e, f, g (resuelto en la guía).

**Enunciado.** Sea $X\sim N(\mu,\sigma)$ y $Z\sim N(0,1)$ estándar.
e) Hallar los cuartiles $Q_1$, $Q_3$ y el rango intercuartílico $I_Q=|Q_3-Q_1|$, que
cumplen $F(Q_1)=0.25$, $F(Q_3)=0.75$. f) Según la convención de **Tukey** para el
[[boxplot|boxplot]] (U1), son **valores extremos (outliers)** los que caen por debajo de
$Q_1-1.5\,I_Q$ o por encima de $Q_3+1.5\,I_Q$; calcular $P(\text{outlier})$. g) Calcular $E[|Z|]$.

**Planteo y cálculo e).** $Q_1=\mu+\sigma z_{0.25}$ y $Q_3=\mu+\sigma z_{0.75}$. Por simetría
$z_{0.75}=-z_{0.25}\approx0.6745$, así que
$$ Q_1=\mu-0.6745\,\sigma,\qquad Q_3=\mu+0.6745\,\sigma,\qquad I_Q=Q_3-Q_1=1.349\,\sigma. $$

**Cálculo f).** Las cercas de Tukey, en unidades estandarizadas ($\mu=0,\sigma=1$), están en
$$ Q_3+1.5\,I_Q=0.6745+1.5\cdot1.349=2.698,\qquad Q_1-1.5\,I_Q=-2.698. $$
Como la normal es simétrica,
$$ P(\text{outlier})=2\,\Phi(-2.698)=2\,(1-\Phi(2.698))\approx2\cdot0.00349\approx0.007. $$

**Cálculo g).** Por simetría de $Z$ y con $\int z\,e^{-z^2/2}dz=-e^{-z^2/2}$,
$$ E[|Z|]=2\int_0^\infty z\,\frac{1}{\sqrt{2\pi}}e^{-z^2/2}\,dz=\frac{2}{\sqrt{2\pi}}\big[-e^{-z^2/2}\big]_0^\infty=\frac{2}{\sqrt{2\pi}}=\sqrt{\frac{2}{\pi}}\approx0.798. $$

**Resultado.** e) $I_Q=1.349\,\sigma$. f) $P(\text{outlier})\approx0.7\%$: en una normal,
solo cerca de **7 de cada 1000** observaciones serían marcadas como atípicas por la regla del
boxplot. g) $E[|Z|]=\sqrt{2/\pi}\approx0.798$ (la **semi-normal**, valor medio del desvío absoluto).
