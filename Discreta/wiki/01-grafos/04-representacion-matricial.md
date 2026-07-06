---
tags: [teoria, unidad-1, matriz-adyacencia, matriz-incidencia, representacion]
fuente: raw/resumenes/resumen-matematica-discreta.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Representación matricial

Dos formas de guardar un grafo en una matriz: la **matriz de adyacencia** (vértice
contra vértice) y la **matriz de incidencia** (vértice contra arista), cada una en su
versión dirigida y no dirigida. Transcripto de los apuntes de la cursada 2023-2C.

## Matriz de adyacencia

Indexada por pares de vértices $(u, v)$: cada entrada cuenta cuántas aristas los conectan.

### No dirigido

> **Definición.** Para un grafo no dirigido, la matriz de adyacencia $A_G[u; v]$ se define
> $$A_G[u; v] = \begin{cases} \#\{\text{aristas entre } u \text{ y } v\} & u \neq v \\[4pt] \#\{\text{lazos en } u\} & u = v \end{cases}$$

Fuera de la diagonal se cuentan las aristas que unen dos vértices distintos; en la
diagonal ($u = v$) se cuentan los lazos. La matriz es **simétrica**.

### Dirigido

> **Definición.** Para un dígrafo, la matriz de adyacencia $A_G[u; v]$ se define
> $$A_G[u; v] = \begin{cases} \#\{\text{aristas desde } u \text{ hasta } v\} & u \neq v \\[4pt] \#\{\text{lazos en } u\} & u = v \end{cases}$$

Ahora la entrada $[u; v]$ cuenta sólo las aristas **orientadas** de $u$ hacia $v$, por lo
que en general **no** es simétrica.

## Matriz de incidencia

Indexada por vértice contra arista $[v, e]$: describe la relación de "pertenencia" entre
cada vértice y cada arista.

### No dirigido

> **Definición.** Para un grafo no dirigido, la matriz de incidencia $I_G[v, e]$ se define
> $$I_G[v, e] = \begin{cases} 0 & \text{si } v \text{ no es un extremo de } e \\ 1 & \text{si } v \text{ es un extremo de } e \\ 2 & \text{si } e \text{ es un lazo en } v \end{cases}$$

El $2$ del lazo es coherente con el conteo del [[02-grafos-y-grados|grado]]: un lazo
incide dos veces sobre su vértice.

### Dirigido

> **Definición.** Para un dígrafo, la matriz de incidencia $I_D[v, e]$ se define
> $$I_D[v, e] = \begin{cases} 0 & \text{si } v \text{ no es un extremo de } e \\ 1 & \text{si } v \text{ es la cabeza de } e \\ -1 & \text{si } v \text{ es la cola de } e \\ 2 & \text{si } e \text{ es un lazo de } v \end{cases}$$

El signo distingue la orientación: $+1$ en la **cabeza** (donde llega la flecha) y $-1$
en la **cola** (de donde sale), siguiendo la convención de dígrafo de
[[02-grafos-y-grados|tipos de grafos]].

## Resumen comparativo

| Matriz | Índices | Diagonal / lazo | Dirigido |
|---|---|---|---|
| Adyacencia | vértice $\times$ vértice | lazos en $u = v$ | cuenta aristas $u \to v$ (asimétrica) |
| Incidencia | vértice $\times$ arista | lazo vale $2$ | cabeza $+1$, cola $-1$ |

---

## Ver también

- [[02-grafos-y-grados]] — grado y lazos, que explican el $2$ de la diagonal y del lazo
- [[03-subgrafos-operaciones-isomorfismo]] — las matrices como invariantes para isomorfismo
- [[01-familias-de-grafos]] — familias cuyas matrices vale la pena escribir como práctica
