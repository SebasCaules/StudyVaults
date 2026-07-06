---
tags: [teoria, unidad-4, planaridad, grafo-plano, formula-de-euler]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Grafos planos y fórmula de Euler

Primera parte de la unidad de planaridad (P4). Se define cuándo un grafo puede
dibujarse sin cruces de aristas, se cuentan las regiones que ese dibujo determina y se
enuncia la relación de Euler entre vértices, aristas y regiones, junto con las cotas de
aristas que de ella se derivan.

## Grafo plano e inmersión

> **Definición.** Un grafo (o multigrafo) $G$ es **plano** si puede dibujarse en el plano
> de modo que sus aristas se intersequen solo en los vértices de $G$. Tal dibujo se llama
> **inmersión** del grafo.

Una inmersión divide al plano en zonas conexas llamadas **regiones**. Hay siempre una
región no acotada, la **región exterior** o infinita, que se nota $R_\infty$.

> **Definición.** El **grado de una región** $R$, notado $\operatorname{gr}(R)$, es la
> cantidad de aristas que aparecen en la frontera de esa región (la cantidad de aristas
> del camino cerrado que la rodea).

Por ejemplo, en una inmersión con regiones internas $R_1, R_2, R_3$ y la región exterior
$R_\infty$, cada región queda caracterizada por su grado
$\operatorname{gr}(R_1), \dots, \operatorname{gr}(R_\infty)$.

## Teorema de Euler

El resultado central de la unidad relaciona los tres conteos de una inmersión: vértices,
aristas y regiones.

> **Teorema (Euler).** Sea $G$ un grafo o multigrafo **plano y conexo** con $v$ vértices,
> $e$ aristas y $r$ el número de regiones en el plano determinadas por una inmersión plana
> de $G$. Entonces
> $$v - e + r = 2$$
> donde $r = \#\{R_1, \dots, R_\infty\}$ cuenta todas las regiones, incluida la exterior.

La cantidad de regiones $r$ es la misma para cualquier inmersión plana del grafo: la
fórmula fija $r = 2 - v + e$ a partir de datos que no dependen del dibujo.

## Consecuencias de la fórmula

Del teorema de Euler se derivan una identidad de grados y dos cotas superiores sobre la
cantidad de aristas de un grafo plano.

> **Proposición.** Sea $G$ plano conexo con $v$ vértices, $e$ aristas y $r$ regiones.
> Entonces la suma de los grados de las regiones cuenta cada arista dos veces:
> $$\sum_{i=1}^{r} \operatorname{gr}(R_i) = 2e$$

Esta identidad es el análogo del **handshaking** de vértices, pero aplicado a las
regiones de la inmersión: cada arista está en la frontera de exactamente dos regiones.

> **Proposición (cota general).** Sea $G$ plano conexo, **sin lazos**, con $\#E_G \geq 3$.
> Entonces
> $$e \leq 3v - 6$$

> **Proposición (cota bipartita).** Sea $G$ plano conexo y **bipartito**. Entonces
> $$e \leq 2v - 4$$

Las cotas dan una condición **necesaria** de planaridad: si un grafo supera la cota de
aristas correspondiente, no puede ser plano. La cota bipartita es más ajustada porque un
grafo bipartito no tiene ciclos de longitud $3$, así que cada región tiene grado
$\geq 4$.

## Subgrafos no planos

La planaridad es hereditaria hacia arriba: basta con encontrar un pedazo no plano para
descartar el todo.

> **Teorema.** Si el grafo $G$ contiene un subgrafo $H$ que no es plano, entonces $G$ no
> es plano.

Este teorema es la puerta de entrada al criterio de [[02-homeomorfismo-kuratowski|Kuratowski]],
que caracteriza exactamente qué subgrafos vuelven no plano a un grafo.

---

## Ver también

- [[02-homeomorfismo-kuratowski]] — cuándo un grafo no es plano vía subgrafos homeomorfos a $K_5$ o $K_{3,3}$
- [[03-bloques]] — descomposición en bloques 2-conexos, base del algoritmo de planaridad
- [[04-algoritmo-planaridad]] — procedimiento para decidir planaridad por apéndices y regiones
