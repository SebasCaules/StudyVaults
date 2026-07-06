---
tags: [teoria, unidad-5, grafos, bfs, dfs, heuristicas]
fuente: apuntes de la cursada 2024-2C (resumen de grafos)
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Recorridos de grafos: BFS, DFS y heurísticas

Recorrer un grafo es visitar todos sus vértices siguiendo los ejes. Las dos formas básicas
son el recorrido **en anchura** (BFS) y **en profundidad** (DFS); se diferencian solo en la
estructura auxiliar que ordena los vértices pendientes. Más abajo se listan además las
familias de **heurísticas** de búsqueda vistas en la materia.

## BFS y DFS

Ambos recorridos tienen el mismo costo asintótico y se distinguen por la estructura que
guarda los vértices por visitar:

| Recorrido | Estructura auxiliar | Temporal | Espacial |
|---|---|---|---|
| BFS (en anchura) | Cola (Queue) | $O(V + E)$ | $O(V)$ |
| DFS (en profundidad) | Pila (Stack) | $O(V + E)$ | $O(V)$ |

- **BFS** usa una **cola (Queue)**: procesa los vértices en el orden en que se descubren, de
  modo que explora por niveles a partir del origen.
- **DFS** usa una **pila (Stack)**: avanza lo más profundo posible por una rama antes de
  retroceder.

**Observación.** El costo temporal $O(V + E)$ se explica porque cada vértice se encola/apila
una vez y cada eje se recorre una vez; el espacial $O(V)$ es el tamaño máximo de la
estructura auxiliar más las marcas de visitado.

## Heurísticas de búsqueda

Los apuntes agrupan las estrategias de resolución en cuatro familias, con sus complejidades
típicas.

### Greedy (voraz)

> **Definición.** Un algoritmo **greedy** busca en cada etapa el óptimo **local** con la
> expectativa de llegar al óptimo **global**. No siempre lo consigue.

Ejemplo clásico: **Kruskal** (árbol de recubrimiento mínimo).

- Complejidad temporal: $O(n \log n)$ ó $O(\log n)$.
- Complejidad espacial: $O(1)$ ó $O(n)$.

### Backtracking

> **Definición.** El **backtracking** busca la mejor combinación posible en un momento
> determinado, deshaciendo decisiones cuando conducen a un callejón sin salida.

- Complejidad temporal: $O(n \log n)$ ó $O(n)$.
- Complejidad espacial: $O(n^2)$ ó $O(n^3)$.

### Stack o Queue (fuerza bruta con estructura)

> **Definición.** Se calculan **todas** las soluciones posibles apoyándose en una pila o una
> cola. Si se agregan restricciones, solo al final se evalúa cuál es la mejor.

### Divide and Conquer (dividir y conquistar)

> **Definición.** Se **divide** el problema en $N$ problemas más pequeños, se resuelve cada
> uno y se combinan las soluciones.

Ejemplos: **Merge Sort**, **QuickSort**, búsqueda en un **BST**, búsqueda en un array
ordenado.

- Complejidad temporal: $O(n \log n)$ ó $O(n^2)$.
- Complejidad espacial: $O(n \log n)$ ó $O(n^2)$.

**Observación.** Para cada familia los apuntes dan dos cotas alternativas ("$A$ ó $B$"):
la complejidad concreta depende del problema y de la implementación puntual; se listan como
rangos de referencia, no como un valor único.

---

## Ver también

- [[01-grafos-representaciones]] — taxonomía de grafos y costos de las representaciones
- [[03-dijkstra]] — camino mínimo con cola de prioridad, un greedy sobre grafos con pesos
- [[04-orden-topologico]] — recorrido de un DAG usando una cola y el grado de entrada
- [[01-complejidad/02-teorema-maestro]] — analizar el costo de los algoritmos divide y vencerás
