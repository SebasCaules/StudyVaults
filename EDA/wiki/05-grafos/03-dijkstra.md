---
tags: [resuelto, unidad-5, grafos, dijkstra, camino-minimo, cola-de-prioridad]
fuente: apuntes de la cursada 2024-2C (parcial resuelto, Dijkstra con cola de prioridad)
unidad: 5
tipo: resuelto
actualizado: 2026-07-05
---

# Dijkstra: camino mínimo paso a paso

El algoritmo de **Dijkstra** calcula el camino de costo mínimo desde un vértice origen
hacia todos los demás en un grafo con pesos no negativos. Implementado con una **cola de
prioridad**, su complejidad es

$$O\big((N + E)\log N\big)$$

donde $N = \#V$ es la cantidad de vértices y $E = \#E$ la de ejes. La idea: se mantiene una
cola de prioridad con el costo tentativo de cada vértice y en cada iteración se **remueve**
(visita) el de menor costo, relajando sus vecinos.

## Enunciado del parcial

Se da un grafo dirigido con pesos y se aplica Dijkstra con cola de prioridad partiendo del
nodo **S**. Se pide indicar en qué orden se remueven los nodos de la cola de prioridad y,
al finalizar, el camino mínimo a cada nodo. Los vértices son $S, A, B, C, D, E, F$.

## Traza de la cola de prioridad

En cada iteración se muestran los **costos** pendientes en la cola (pares vértice–costo) y
el conjunto de **visitados** (vértices ya removidos y definitivos):

| Iteración | Costos en la cola | Visitados |
|---|---|---|
| It1 | $\{(S,0)\}$ | $\{\,\}$ |
| It2 | $\{\,\}$ | $\{S\}$ |
| It3 | $\{(C,2),\,(A,3),\,(F,6)\}$ | $\{S\}$ |
| It4 | $\{(A,3),\,(D,5),\,(F,6)\}$ | $\{S, C\}$ |
| It5 | $\{(D,5),\,(F,6),\,(B,9)\}$ | $\{S, C, A\}$ |
| It6 | $\{(F,6),\,(E,8),\,(B,9)\}$ | $\{S, C, A, D\}$ |
| It7 | $\{(E,8),\,(B,9)\}$ | $\{S, C, A, D, F\}$ |
| It8 | $\{(B,9)\}$ | $\{S, C, A, D, F, E\}$ |

En cada paso se remueve de la cola el vértice de **menor costo**, se lo agrega a los
visitados y se relajan sus vecinos (bajando su costo tentativo si se encontró un camino más
corto). El último vértice, $B$, se remueve al final y cierra el recorrido.

## Orden de remoción de la cola de prioridad

$$S \to C \to A \to D \to F \to E \to B$$

## Costos mínimos finales

Al terminar, el costo mínimo desde $S$ a cada vértice es:

| Vértice | Costo mínimo | Camino |
|---|---|---|
| $S$ | $0$ | $S$ |
| $C$ | $2$ | $S \to C$ |
| $A$ | $3$ | $S \to A$ |
| $D$ | $5$ | $S \to C \to D$ |
| $F$ | $6$ | $S \to F$ |
| $E$ | $8$ | *(ver nota)* |
| $B$ | $9$ | $S \to A \to B$ |

> **Nota.** El orden de remoción $S, C, A, D, F, E, B$ y los costos finales
> ($S{=}0$, $C{=}2$, $A{=}3$, $D{=}5$, $F{=}6$, $E{=}8$, $B{=}9$) se leen con claridad en el
> original. En cambio, algunos **pesos de ejes** y el **predecesor de $E$** están tomados de
> una foto con reflejo y son de lectura dudosa: el costo $E = 8$ es consistente tanto con el
> camino $S \to F \to E$ (con $F=6$ y eje $F \to E$ de peso $2$) como con un camino vía $D$;
> la traza fija el valor $8$ pero no el predecesor exacto.

---

## Ver también

- [[01-grafos-representaciones]] — cómo se guarda el grafo sobre el que corre Dijkstra
- [[02-recorridos-bfs-dfs]] — recorridos sin pesos (BFS/DFS) y familia greedy
- [[04-orden-topologico]] — otro recorrido dirigido, sobre grafos acíclicos
