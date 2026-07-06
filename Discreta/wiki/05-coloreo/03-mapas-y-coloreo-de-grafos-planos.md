---
tags: [teoria, unidad-5, grafo-dual, mapa, coloreo-de-grafos-planos]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Mapas y coloreo de grafos planos

Cierre de la unidad de coloreo (P5). El problema clásico de colorear un mapa —de modo que
países vecinos reciban colores distintos— se traduce en colorear los vértices de un grafo:
el **grafo dual**. Con esa traducción, el coloreo de mapas queda cubierto por los teoremas de
los cinco y cuatro colores para grafos planos.

## Grafo dual

Dada una inmersión plana de $G$ (ver [[04-planaridad/01-grafos-planos-euler|grafos planos]]),
se construye otro grafo $G^{*}$, su **dual**, poniendo un vértice por región y conectando las
regiones que comparten frontera.

> **Definición.** Sea $G$ una inmersión plana. El **grafo dual** $G^{*}$ se construye así:
> i) Se coloca un vértice dentro de cada región, incluida la región infinita $R_\infty$; estos
>    son los vértices $V(G^{*})$.
> ii) Por cada arista compartida por dos regiones se dibuja una arista que conecta los
>    vértices de $G^{*}$ correspondientes; estas son las aristas de $G^{*}$.

De la construcción se desprenden varias observaciones.

> **Observaciones.**
> i) Cada arista de $G$ se corresponde con exactamente una arista de $G^{*}$.
> ii) El grado de un vértice de $G^{*}$ es la cantidad de aristas en la frontera del camino
>    cerrado en torno de la región de $G$ que contiene a ese vértice.
> iii) Dado un lazo en $G$, si el interior de la región determinada por el lazo no contiene
>    otra arista ni un vértice colgante, el lazo genera un vértice colgante en $G^{*}$.
> iv) Si el lazo no tiene nada dentro (o todo el grafo queda dentro del lazo), queda un
>    vértice colgante; si partes del grafo están dentro del lazo y otras fuera, queda un
>    puente.
> v) $G^{*}$ es **un** dual de $G$, no *el* dual: la construcción depende de la inmersión y
>    **no se mantiene el isomorfismo**.

## Mapas

> **Definición.** Un **mapa** es una inmersión plana de un grafo en una superficie.

Colorear un mapa —asignar colores a sus regiones de modo que regiones vecinas difieran— es lo
mismo que colorear los vértices del dual, porque las regiones vecinas del mapa son vértices
adyacentes en $G^{*}$.

> **Proposición.** El número cromático de un mapa es igual al número cromático de su grafo
> dual.

## Teoremas de coloreo de grafos planos

El coloreo de mapas culmina en dos resultados sobre grafos planos.

> **Teorema (cinco colores).** El número cromático de un grafo plano simple es a lo sumo $5$:
> $$\chi(G) \leq 5$$

> **Teorema (cuatro colores).** Todo grafo plano es $4$-coloreable.

> **Nota.** En el enunciado del teorema de los cinco colores el original escribe "grafo
> simple"; por el contexto de la sección (mapas y grafos planos) refiere al **teorema de los
> cinco colores para grafos planos**. Sin la hipótesis de planaridad la cota no vale: por
> ejemplo, $K_6$ es simple y $\chi(K_6) = 6$ *(interpretación del contexto original)*.

Como corolario, todo mapa dibujado en el plano se puede colorear con cuatro colores: basta
colorear su grafo dual, que es plano, y aplicar el teorema de los cuatro colores.

---

## Ver también

- [[01-coloreo-de-vertices]] — coloreo propio y número cromático $\chi(G)$
- [[02-cotas-numero-cromatico]] — cotas de $\chi(G)$, clique, conjunto independiente y Brooks
- [[04-planaridad/01-grafos-planos-euler]] — grafo plano, inmersión, regiones y fórmula de Euler (base del grafo dual)
