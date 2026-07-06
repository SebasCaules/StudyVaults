---
tags: [teoria, unidad-5, coloreo, numero-cromatico, coloreo-propio]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Coloreo de vértices y número cromático

Primera parte de la unidad de coloreo (P5). Se define qué significa asignar colores a los
vértices de un grafo respetando sus aristas, cuál es la menor cantidad de colores necesaria
—el número cromático— y un algoritmo que produce un coloreo válido sin garantizar que sea
óptimo.

## Coloreo propio

La idea de coloreo formaliza el reparto de los vértices en un número finito de colores.

> **Definición.** Un **$k$-coloreo de vértices** de un grafo $G$ es una asignación
> $$F : V_G \longrightarrow C = \{1, 2, \dots, k\}$$
> del conjunto de vértices a un conjunto $C$ de cardinal $k$, cuyos elementos se llaman
> **colores**.

Un $k$-coloreo cualquiera puede pintar del mismo color a dos vértices unidos por una arista;
lo que interesa es el coloreo que respeta la adyacencia.

> **Definición.** Un **coloreo propio** de un grafo es un coloreo tal que los extremos de
> toda arista tienen asignados colores distintos.

> **Definición.** Un grafo es **$k$-coloreable** si admite un coloreo propio con $k$
> colores.

Los vértices que comparten color en un coloreo propio forman las clases del coloreo.

> **Definición.** Una **clase de color** es un subconjunto de $V_G$ formado por todos los
> vértices que reciben un mismo color en un coloreo propio.

**Observación.** Como en un coloreo propio ninguna arista une dos vértices del mismo color,
cada clase de color es un conjunto de vértices mutuamente no adyacentes (ver el
[[02-cotas-numero-cromatico|conjunto independiente]] de la página siguiente).

## Número cromático

El interés no está en un coloreo cualquiera, sino en el más económico posible.

> **Definición.** El **número cromático** $\chi(G)$ es el mínimo número de colores diferentes
> que se requiere para dar un coloreo propio de $G$.

> **Definición.** Un grafo $G$ es **$k$-cromático** si $\chi(G) = k$.

Algunas consecuencias inmediatas de la definición:

> **Observaciones.**
> i) Si $G$ es $k$-cromático, entonces $G$ es $k$-coloreable pero **no** $(k-1)$-coloreable
>    (por eso $k$ es el mínimo).
> ii) $\chi(G) = 1 \iff G$ no tiene aristas: un solo color alcanza exactamente cuando no hay
>    ninguna adyacencia que respetar.
> iii) Las **aristas múltiples** no afectan el coloreo (basta con que los extremos difieran),
>    pero los **lazos lo impiden**: un vértice con un lazo es adyacente a sí mismo y no puede
>    recibir ningún color propio.

## Algoritmo secuencial

Hay un procedimiento sencillo que siempre produce un coloreo propio, aunque no
necesariamente con la cantidad mínima de colores.

> **Nota.** El algoritmo secuencial produce un coloreo **propio de cualquier grafo**, pero
> **no usa el número mínimo de colores**: sirve como cota superior de $\chi(G)$, no para
> calcularlo con exactitud.

Se fija un orden del conjunto de vértices $V_G = \{v_1, v_2, \dots, v_n\}$ y una paleta
ordenada de colores $C = \{1, 2, \dots, k\}$, y se recorre en ese orden:

1. Se le asigna el color $1$ al vértice $v_1$.
2. Si $v_2$ es adyacente a $v_1$, se le asigna el color $2$; si no, se queda con el color $1$.
3. Para cada $v_i$ con $3 \leq i \leq n$, se elige el **primer** color de la paleta que no
   haya sido usado por ninguno de sus vértices adyacentes ya coloreados.

**Observación.** El resultado depende del orden elegido para los vértices: distintos órdenes
pueden usar distinta cantidad de colores. Que el algoritmo termine con $k$ colores prueba que
$G$ es $k$-coloreable, es decir que $\chi(G) \leq k$.

---

## Ver también

- [[02-cotas-numero-cromatico]] — clique, conjunto independiente, grafos críticos y las cotas de $\chi(G)$ (Brooks incluido)
- [[03-mapas-y-coloreo-de-grafos-planos]] — grafo dual, mapas y coloreo de grafos planos (5 y 4 colores)
- [[01-grafos/01-familias-de-grafos]] — $K_n$, bipartitos y ciclos, cuyos números cromáticos son los casos base
