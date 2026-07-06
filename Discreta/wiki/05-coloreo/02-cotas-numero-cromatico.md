---
tags: [teoria, unidad-5, numero-cromatico, clique, conjunto-independiente, teorema-de-brooks]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Cotas y propiedades del número cromático

Segunda parte de la unidad de coloreo (P5). El número cromático $\chi(G)$ suele ser difícil
de calcular directamente, así que se lo estima con cotas inferiores y superiores. Esas cotas
se apoyan en dos parámetros duales —el clique y el conjunto independiente— y en la noción de
grafo crítico, y culminan en el teorema de Brooks.

## Clique

Una cota inferior sale de buscar dentro de $G$ un pedazo que obligue a usar muchos colores.

> **Definición.** Un **clique** es un subconjunto **maximal** de vértices mutuamente
> adyacentes. El **clique number** $\omega(G)$ es el número de vértices del clique más grande
> de $G$.

**Ejemplo.** Sea $G$ con vértices $\{u, v, x, y, z\}$ y aristas que forman los triángulos
$uvy$ y $uxy$ más la arista $yz$. Entonces $G$ tiene tres cliques: $\{u, v, y\}$,
$\{u, x, y\}$ y $\{y, z\}$; el clique number es $\omega(G) = 3$.

Como los vértices de un clique son mutuamente adyacentes, cada uno necesita un color distinto:

> **Proposición.** Si $G$ tiene $k$ vértices mutuamente adyacentes, entonces
> $\chi(G) \geq k$. En particular, para el grafo completo, $\chi(K_n) = n$.

## Conjunto independiente

El parámetro dual del clique cuenta el mayor grupo de vértices sin aristas entre sí.

> **Definición.** Un subconjunto $S \subseteq V_G$ es **independiente** si ningún vértice de
> $S$ está unido por una arista a otro de $S$; esto es, $S$ es un conjunto de vértices
> mutuamente no adyacentes. El **número de independencia** $\alpha(G)$ es el máximo cardinal
> entre los conjuntos independientes de $G$.

Cada clase de color de un coloreo propio es un conjunto independiente, y ninguna puede tener
más de $\alpha(G)$ vértices; de ahí sale una cota inferior sobre $\chi(G)$.

> **Proposición.** Para todo grafo $G$,
> $$\chi(G) \geq \left\lceil \frac{\#V(G)}{\alpha(G)} \right\rceil$$
> donde $\#V(G)$ es la cantidad de vértices y $\alpha(G)$ el número de independencia (el mayor
> conjunto de vértices no adyacentes).

## Grafos críticos

Un grafo es crítico cuando ninguna arista sobra para sostener su número cromático.

> **Definición.** Un grafo conexo $G$ es **$k$-crítico** si $\chi(G) = k$ y $G - e$ es
> $(k-1)$-coloreable para toda arista $e \in E_G$.

De la criticidad se deducen dos propiedades estructurales.

> **Proposiciones.**
> i) Sea $G$ conexo, $k$-crítico y $v$ un vértice de $G$. Entonces $G - v$ es
>    $(k-1)$-coloreable.
> ii) Sea $G$ $k$-crítico. Entonces $\operatorname{gr}(v_i) \geq k - 1$ para todo
>    $v_i \in V_G$.

## Propiedades del número cromático

Además de las cotas anteriores, $\chi$ se comporta bien frente a subgrafos y a la suma de
grafos.

> **Propiedades.**
> i) $\chi(G) \geq \omega(G)$ (el clique number es cota inferior).
> ii) Si $H$ es un subgrafo de $G$, entonces $\chi(G) \geq \chi(H)$.
> iii) Si $G$ y $H$ son grafos, entonces $\chi(G + H) = \chi(G) + \chi(H)$.
> iv) Si $G$ es bipartito, entonces $\chi(G) = 2$, a menos que $G$ no tenga aristas.

> **Nota.** En iii), $G + H$ es la **suma de grafos** definida en la unidad de grafos (se
> conectan todos los vértices de $G$ con todos los de $H$): como cada vértice de $G$ queda
> adyacente a cada vértice de $H$, sus paletas de colores deben ser disjuntas y los números
> cromáticos se suman.

## Teorema de Brooks

La cota superior más gruesa es $\chi(G) \leq \Delta(G) + 1$ para $G$ simple, con
$\Delta(G) = \max_i \operatorname{gr}(v_i)$ el grado máximo. Brooks la mejora en un color
salvo en dos familias.

> **Teorema (Brooks).** Si $G$ es un grafo conexo que no es un grafo completo $K_n$ ni un
> ciclo impar $C_{2n+1}$, entonces
> $$\chi(G) \leq \Delta(G)$$
> donde $\Delta(G)$ es el grado máximo de $G$.

Los dos casos excluidos son justamente aquellos en los que la cota $\Delta(G)$ no alcanza:
$\chi(K_n) = n = \Delta + 1$ y $\chi(C_{2n+1}) = 3 = \Delta + 1$.

## Tabla de cotas para $\chi(G)$

Reuniendo todo, estas son las desigualdades útiles para acotar el número cromático:

| Sentido | Cota | Condición / significado |
|---|---|---|
| $\geq$ | $\chi(G) \geq \left\lceil \#V(G)/\alpha(G) \right\rceil$ | vértices sobre el mayor conjunto independiente |
| $\geq$ | $\chi(G) \geq \chi(H)$ | $H$ subgrafo de $G$ |
| $\geq$ | $\chi(G) \geq \omega(G)$ | clique number (mayor conjunto de vértices adyacentes) |
| $\leq$ | $\chi(G) \leq \Delta(G) + 1$ | $G$ simple, $\Delta(G) = \max_i \operatorname{gr}(v_i)$ |
| $\leq$ | $\chi(G) \leq \Delta(G)$ | $G$ conexo, no completo $K_n$ ni ciclo impar $C_{2n+1}$ (Brooks) |
| $=$ | $\chi(G + H) = \chi(G) + \chi(H)$ | suma de grafos |
| $=$ | $\chi(G) = 2$ | $G$ bipartito (con aristas) |

---

## Ver también

- [[01-coloreo-de-vertices]] — coloreo propio, número cromático y algoritmo secuencial
- [[03-mapas-y-coloreo-de-grafos-planos]] — coloreo de grafos planos: teoremas de los 5 y 4 colores
- [[01-grafos/01-familias-de-grafos]] — $K_n$, ciclos $C_n$ y bipartitos, casos donde estas cotas se alcanzan
