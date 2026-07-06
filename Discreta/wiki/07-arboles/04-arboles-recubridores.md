---
tags: [teoria, unidad-7, arboles-recubridores, dfs, bfs]
fuente: raw/3-Resumenes/Resumen M.Discreta.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Árboles recubridores, DFS y BFS

Un árbol recubridor es un árbol que toca todos los vértices de un grafo. Esta página define el
concepto, la arista frontera que lo hace crecer, y los dos recorridos —en profundidad (DFS) y a
lo ancho (BFS)— que lo construyen sistemáticamente.

## Árbol recubridor y arista frontera

> **Definición.** Un **árbol recubridor** de un grafo simple $G$ es un subgrafo de $G$ que es un
> árbol y contiene cada vértice de $G$.

Un mismo grafo admite en general varios árboles recubridores distintos. Para hacerlos crecer sin
formar ciclos se usa la noción de arista frontera.

> **Definición.** Sea $T$ un árbol subgrafo de $G$. Una arista $e = \{a, b\}$ es **arista
> frontera** de $T$ si $a$ es un vértice de $T$ y $b$ es un vértice de $G$ pero **no** de $T$.

Agregar una arista frontera nunca cierra un ciclo, así que preserva la estructura de árbol.

> **Proposición.** Sea $T$ un árbol de un grafo $G$ y sea $e$ una arista frontera de $T$.
> Entonces $T + e$ es un árbol.

## Recorrido en profundidad (DFS)

> **Definición.** El recorrido **Depth-First Search** (DFS) es un recorrido en profundidad que se
> puede utilizar para construir un árbol recubridor de un grafo simple $G$:
> i) Se elige arbitrariamente un vértice del grafo como raíz.
> ii) Se forma un camino simple agregando, paso a paso, un vértice y una arista frontera,
> avanzando lo más profundo posible antes de retroceder.

**Notación.** La etiqueta de cada vértice $v$ a medida que es descubierto se llama
$\operatorname{dfnro}(v)$ (número de descubrimiento en el recorrido).

Las aristas del grafo que no entran al árbol conectan siempre un vértice con un ancestro suyo.

> **Proposición.** Sea $T$ un árbol recubridor producido por DFS en un grafo no dirigido, y sea
> $e = \{x, y\}$ una arista de $G - T$ con $\operatorname{dfnro}(x) \le \operatorname{dfnro}(y)$.
> Entonces $x$ es un ancestro de $y$ en $T$ (la arista $e$ está en $G$ pero no en $T$).

## Recorrido a lo ancho (BFS)

> **Definición.** El recorrido **Breadth-First Search** (BFS) es un recorrido a lo ancho. A
> partir de un vértice arbitrario, en cada paso se elige una arista frontera cuyo vértice ya en
> el árbol haya sido descubierto lo antes posible.

**Observación.** Para tener unicidad de salida en BFS y DFS se usa el **orden lexicográfico** de
los vértices cuando el algoritmo no tiene un criterio para decidir qué arista frontera elegir.

A diferencia de DFS, las aristas no arbóreas de un BFS conectan vértices de niveles cercanos.

> **Proposición.** Cuando BFS se aplica a un grafo no dirigido, los extremos de cualquier arista
> de $G - T$ están en el mismo nivel o en niveles consecutivos.

## Raíz de corte

El recorrido DFS también detecta vértices de corte a partir de la estructura del árbol resultante.

> **Proposición.** Sea $T$ un árbol que resulta de aplicar DFS a un grafo $G$ conexo. Entonces la
> raíz $r$ de $T$ es un vértice de corte de $G$ si y solo si $r$ tiene más de un hijo en $T$.

> **Nota.** En los apuntes de la cursada 2023-2C la construcción de árboles recubridores se hace
> exclusivamente con DFS y BFS sobre grafos **simples no ponderados**. No aparecen los algoritmos
> de árbol recubridor de costo mínimo (Kruskal / Prim) ni grafos con pesos en las aristas: el
> material trata el árbol recubridor como subgrafo, sin criterio de minimización de peso.

---

## Ver también

- [[07-arboles/01-arboles-y-bosques]] — definiciones base y caracterizaciones de árbol
- [[07-arboles/02-arboles-con-raiz]] — árboles con raíz, niveles y nomenclatura (ancestro/hijo)
- [[07-arboles/03-recorridos-y-expresion]] — recorridos y árboles de expresión
