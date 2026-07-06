---
tags: [resuelto, unidad-5, grafos, orden-topologico, dag, grado-de-entrada]
fuente: apuntes de la cursada 2024-2C (parcial resuelto, orden topológico)
unidad: 5
tipo: resuelto
actualizado: 2026-07-05
---

# Orden topológico de un DAG

El orden topológico ordena los vértices de un grafo dirigido acíclico respetando todas sus
dependencias. Es lo que usa, por ejemplo, una herramienta de build como Maven para decidir
en qué orden instalar dependencias: antes de instalar un componente hay que asegurar que ya
estén instalados los que requiere, directa o indirectamente.

## Definición

> **Definición.** El **orden topológico** de un grafo dirigido acíclico (DAG) es una lista
> ordenada de sus vértices tal que, para **cada eje** $u \to w$, se garantiza que $u$
> aparece **antes** que $w$ en la lista.

**Observación.** El orden topológico **no es único**: un mismo DAG suele admitir muchos
órdenes válidos. Cuál se obtiene depende del orden en que se insertaron los nodos y ejes y
de cómo los recorra la estructura subyacente.

## Algoritmo (por grado de entrada)

El método se apoya en el **grado de entrada** (in-degree): se arranca por los vértices que
no tienen ejes entrantes y, al "consumir" un vértice, se eliminan sus ejes salientes, lo
que puede dejar a nuevos vértices con in-degree cero. El parcial lo muestra en pseudocódigo
estilo Java, sin comprometerse con una representación concreta del grafo:

```java
myQueue = new Queue();                 // creamos una cola
foreach Vertice v in myGraph {         // recorro los vértices del grafo de entrada
    if (v tiene in-degree == 0)        // no tiene ejes entrantes
        myQueue.add(v);                // encolo el vértice
}

while (!myQueue.isEmpty()) {
    v = myQueue.remove();              // desencolo un nodo en una variable
    System.out.println(v);             // lo imprimo (lo agrego al orden)
    foreach edge e: v -> x {           // recorro los ejes salientes del nodo desencolado
        myGraph.remove(e);             // borro el eje del grafo analizado
        if (x tiene in-degree == 0)    // el nodo destino se quedó sin ejes entrantes
            myQueue.add(x);            // lo encolo
    }
}

if (myGraph todavía contiene ejes)
    throw new RuntimeException("no era acíclico!!");
```

**Observación.** Si al terminar el grafo todavía tiene ejes, es que había un ciclo: un DAG
correcto queda sin ejes y todos sus vértices se imprimieron.

## Ejemplo resuelto

El parcial da un DAG con vértices $A, B, C, D, E, F, G$ y pide **todos** los órdenes
topológicos válidos. Del diagrama se leen estas dependencias:

| Restricción | Origen en el grafo |
|---|---|
| $E$ y $D$ no tienen ejes entrantes | son las **fuentes** (in-degree $0$) |
| $G$ antes que $A$ y que $B$ | ejes $G \to A$, $G \to B$ |
| $A$ antes que $B$ | eje $A \to B$ |
| $B$ antes que $C$ | eje $B \to C$ |
| $D$ antes que $C$ | eje $D \to C$ |
| $C$ antes que $F$ | eje $C \to F$ |
| $F$ no apunta a nadie | es el **sumidero** (out-degree $0$) |

Razonando desde las fuentes hacia el sumidero: primero $E$ y $D$ (a nadie apuntan), luego
$G$ (antes de $A$ y $B$), después $A$ antes de $B$, luego $B$ antes de $C$, después $C$ y,
al final, $F$. Como $E$ y $D$ son ambas fuentes y $D$ solo debe preceder a $C$, hay margen
para intercalarlas, lo que da varios órdenes válidos:

1. $D \to E \to G \to A \to B \to C \to F$
2. $E \to D \to G \to A \to B \to C \to F$
3. $E \to G \to A \to B \to D \to C \to F$
4. $E \to G \to D \to A \to B \to C \to F$
5. $E \to G \to A \to D \to B \to C \to F$

**Observación.** Los cinco órdenes comparten el esqueleto $G \to A \to B \to C \to F$
(la cadena forzada por los ejes); lo único que varía es en qué punto se ubican las dos
fuentes $E$ y $D$, siempre con $D$ antes de $C$.

> **Nota.** Las restricciones y los cinco órdenes finales se transcriben de la resolución
> manuscrita, que es legible; el diagrama del DAG es una foto y algún eje secundario podría
> diferir *(dudoso en el original)*, pero es consistente con los órdenes enumerados.

---

## Ver también

- [[01-grafos-representaciones]] — el grado de entrada (in-degree) y su costo según la representación
- [[02-recorridos-bfs-dfs]] — el algoritmo usa una cola, como BFS
- [[03-dijkstra]] — otro recorrido dirigido, sobre grafos con pesos
