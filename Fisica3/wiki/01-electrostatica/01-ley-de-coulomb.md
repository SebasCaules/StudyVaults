---
tags: [teoria, unidad-1, electrostatica, ley-de-coulomb, superposicion]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Ley de Coulomb

La ley de Coulomb describe la fuerza entre cargas eléctricas puntuales en reposo. Es el
punto de partida de toda la electrostática: a partir de ella se construye la noción de
[[02-campo-electrico|campo eléctrico]] y el principio de superposición.

## Fuerza entre dos cargas puntuales

Dos cargas del mismo signo se repelen; dos cargas de signo opuesto se atraen. La magnitud
de la fuerza es proporcional al producto de las cargas e inversamente proporcional al
cuadrado de la distancia que las separa.

> **Ley de Coulomb (módulo).** El módulo de la fuerza entre dos cargas puntuales $q_1$ y
> $q_2$ separadas una distancia $r$ es
> $$|\vec{F}| = \frac{k_e\, q_1\, q_2}{r^2}$$
> donde $k_e$ es la constante de Coulomb y $r$ la distancia entre las cargas. Esta forma
> da sólo la magnitud: no incorpora la dirección.

La constante de Coulomb y la permitividad eléctrica del vacío valen:

$$k_e = \frac{1}{4\pi\varepsilon_0} = 8{,}9876 \times 10^{9}\ \frac{\mathrm{N\,m^2}}{\mathrm{C^2}}, \qquad \varepsilon_0 = 8{,}8542 \times 10^{-12}\ \frac{\mathrm{C^2}}{\mathrm{N\,m^2}}$$

donde $\varepsilon_0$ es la permitividad eléctrica del vacío y $k_e$ la constante que
sintetiza la intensidad de la interacción electrostática.

## Forma vectorial

Para tener en cuenta la dirección se usa la forma vectorial. Sean $\vec{r}_1$ y
$\vec{r}_2$ las posiciones de $q_1$ y $q_2$; la fuerza que $q_1$ ejerce **sobre** $q_2$ es

$$\vec{F}_{12} = \frac{k_e\, q_1\, q_2}{\|\vec{r}_2 - \vec{r}_1\|^2}\,\hat{r}, \qquad \hat{r} = \frac{\vec{r}_2 - \vec{r}_1}{\|\vec{r}_2 - \vec{r}_1\|}$$

donde $\hat{r}$ es el versor que apunta de $q_1$ hacia $q_2$. Reemplazando el versor por su
definición se obtiene la fórmula compacta:

$$\vec{F}_{12} = \frac{k_e\, q_1\, q_2}{\|\vec{r}_2 - \vec{r}_1\|^3}\,(\vec{r}_2 - \vec{r}_1)$$

donde $\vec{r}_2 - \vec{r}_1$ es el vector que va de la carga fuente a la carga sobre la que
se calcula la fuerza, y el denominador al cubo absorbe la normalización del versor.

> **Nota.** En los apuntes esta forma vectorial figura como "la que no se suele utilizar":
> en la práctica se calcula la magnitud con la ley escalar y la dirección se asigna aparte
> según los signos de las cargas.

Por la tercera ley de Newton, la fuerza es simétrica:

$$\vec{F}_{21} = -\,\vec{F}_{12}$$

es decir, la fuerza que $q_2$ ejerce sobre $q_1$ es igual en módulo y opuesta en sentido a
la que $q_1$ ejerce sobre $q_2$.

## Principio de superposición

Cuando hay más de dos cargas, la fuerza neta sobre una de ellas es la **suma vectorial** de
las fuerzas que cada una de las demás ejerce sobre ella, calculadas de a pares como si las
otras no estuvieran.

> **Principio de superposición.** La fuerza total sobre una carga $q_j$ debida a un conjunto
> de cargas $\{q_i\}$ es
> $$\vec{F}_j = \sum_{i \neq j} \vec{F}_{ij}$$
> donde cada $\vec{F}_{ij}$ es la fuerza de Coulomb que la carga $i$ ejerce sobre la carga
> $j$, evaluada con la forma vectorial de arriba.

Por ejemplo, con tres cargas $q_1, q_2, q_3$, la fuerza neta sobre $q_3$ es
$\vec{F}_3 = \vec{F}_{13} + \vec{F}_{23}$: se suman como vectores, respetando la dirección
de cada contribución.

## Dominio de validez

> **Observación.** La fuerza de Coulomb tiene lugar entre cargas en reposo (o
> aproximadamente en reposo). Éste es el dominio de la **electrostática**. Cuando las cargas
> se mueven aparecen efectos magnéticos que quedan fuera de este marco.

---

## Ver también

- [[02-campo-electrico]] — el campo eléctrico como fuerza por unidad de carga testigo
- [[03-campo-distribuciones-continuas]] — superposición aplicada a distribuciones continuas de carga
