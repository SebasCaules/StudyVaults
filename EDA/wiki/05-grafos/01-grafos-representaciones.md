---
tags: [teoria, unidad-5, grafos, representaciones, matriz-adyacencia, lista-adyacencia]
fuente: apuntes de la cursada 2024-2C (resumen de grafos y parciales resueltos)
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Grafos: taxonomía y representaciones

Un grafo $G = (V, E)$ es un conjunto de vértices $V$ y un conjunto de ejes (aristas) $E$
que los conectan. Según se permitan direcciones, aristas repetidas o lazos, se distinguen
distintas familias de grafos; y según cómo se guarden en memoria, distintas
representaciones con costos de operación diferentes. A lo largo de la página $N = \#V$
es la cantidad de vértices y $M = \#E$ la de ejes.

## Taxonomía

Los apuntes clasifican los grafos por tres atributos independientes: si son **dirigidos**,
si admiten **multiplicidad** (más de un eje entre el mismo par de vértices) y si admiten
**lazos** (un eje de un vértice a sí mismo).

| Nombre | Dirigido | Multiplicidad | Lazos |
|---|---|---|---|
| Simple | no | no | no |
| Simple con lazos | no | no | sí |
| Multigrafo | no | sí | no |
| Pseudografo | no | sí | sí |
| (Simple) Dígrafo | sí | no | no |
| Dígrafo con lazos | sí | no | sí |
| Multidígrafo | sí | sí | no |
| Pseudodígrafo | sí | sí | sí |

**Observación.** Los cuatro primeros son no dirigidos y los cuatro últimos son sus
análogos dirigidos. El **pseudografo** (y su versión dirigida, el **pseudodígrafo**) es el
caso más general: admite tanto ejes múltiples como lazos.

## Representaciones en memoria

Un grafo puede guardarse de cuatro maneras. El costo de las operaciones básicas depende de
la elegida. Los apuntes distinguen dos consultas típicas:

- **Buscar $v \to v$:** determinar si existe un eje entre dos vértices dados.
- **Buscar todos los ejes de $v$:** recorrer todos los adyacentes de un vértice.

| Representación | Buscar $v \to v$ | Ejes de $v$ | Espacial |
|---|---|---|---|
| Matriz de adyacencia | $O(1)$ | $O(n)$ | $O(n \cdot m)$ |
| Lista de adyacencia | $O(n)$ | $O(1)$ | $O(n + m)$ |
| Matriz de incidencia | $O(1)$ | $O(n)$ | $O(n \cdot m)$ |
| Lista de incidencia | $O(n)$ | $O(1)$ | $O(n + m)$ |

**Observación.** Las **matrices** resuelven la consulta puntual "¿hay eje entre $u$ y $v$?"
en $O(1)$ (acceso directo a una celda), pero pagan más memoria y $O(n)$ para listar los
adyacentes. Las **listas** son al revés: recorrer los adyacentes de un vértice es $O(1)$
(ir a la cabeza de su lista), pero verificar un eje puntual cuesta $O(n)$ y la memoria es
proporcional a $n + m$ (más económica en grafos ralos).

> **Nota.** La complejidad espacial de la matriz de adyacencia figura en el original como
> $O(n \cdot m)$ *(celda de lectura dudosa)*; el resultado estándar para una matriz de
> adyacencia es $O(n^2)$, ya que es una tabla $N \times N$. La matriz de incidencia sí es
> $N \times M$, es decir $O(n \cdot m)$.

## Elegir representación según la operación

Un parcial (1C-21) pregunta por el costo de chequear si existe un eje entre dos nodos en un
grafo no dirigido:

> **Ejemplo.** Con **matriz de adyacencia**, chequear si hay un eje entre dos nodos es
> $O(1)$ (se consulta una única celda de la matriz). Con **lista de adyacencia**, hay que
> recorrer la lista del vértice hasta encontrar (o no) al otro: $O(n)$.

## Grado de entrada (in-degree) en un dígrafo

Otro parcial pide calcular el **grado de entrada** (in-degree) de un vértice del que ya se
conoce su subíndice, y muestra que el costo depende de cómo esté armada la lista de
adyacencia.

Si el dígrafo se representa con una **lista de adyacencia lineal simplemente encadenada sin
header**, donde cada posición del vector guarda solo las conexiones **salientes** de un
vértice, calcular el in-degree exige recorrer todo el vector ($T(n) = n + 1$) y, para cada
vértice, recorrer toda su lista de salientes buscando al vértice objetivo ($T(n) = n + 1$):

$$T(n) = (n + 1)(n + 1) \implies O(n^2)$$

En cambio, si cada posición del vector encapsula **dos listas** —una de conexiones
salientes (out) y otra de entrantes (in)—, basta con buscar el vértice en el vector ($O(n)$)
y luego recorrer su lista de entrantes ($O(n)$):

$$T(n) = O(n) + O(n) \implies O(n)$$

**Observación.** Guardar explícitamente la lista de entrantes cambia el in-degree de
$O(n^2)$ a $O(n)$: es un ejemplo de cómo la elección de la estructura interna decide la
complejidad de una consulta.

---

## Ver también

- [[02-recorridos-bfs-dfs]] — recorrer un grafo con BFS y DFS, y heurísticas de búsqueda
- [[03-dijkstra]] — camino mínimo desde un origen con cola de prioridad
- [[04-orden-topologico]] — ordenar los vértices de un DAG respetando las dependencias
- [[01-complejidad/01-big-o-y-ordenes]] — notación $O(\cdot)$ usada en los costos de esta página
