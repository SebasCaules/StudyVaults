---
tags: [teoria, unidad-7, arboles, bosques]
fuente: raw/3-Resumenes/Resumen M.Discreta.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Árboles y bosques

Los árboles son los grafos conexos más económicos: conectan todos sus vértices sin
ningún ciclo. Esta página reúne sus definiciones básicas, el conteo de aristas y las seis
caracterizaciones equivalentes que se usan como herramienta de demostración en toda la unidad.

## Árbol y hoja

> **Definición.** Un **árbol** es un grafo conexo que no tiene ciclos.

> **Definición.** Una **hoja** es un vértice de grado $1$.

> **Proposición.** Todo árbol con por lo menos una arista tiene por lo menos dos vértices
> de grado $1$ (dos hojas).

De esta proposición se desprende un criterio útil para detectar ciclos por el grado de los vértices.

> **Corolario.** Si el grado de todos los vértices de un grafo es $\ge 2$, entonces el grafo
> debe contener al menos un ciclo.

## Conteo de aristas

Los árboles tienen exactamente una arista menos que vértices: son la estructura conexa mínima.

> **Proposición.** Todo árbol con $n$ vértices contiene exactamente $n-1$ aristas.

## Bosques

> **Definición.** Un **bosque** es un grafo acíclico, o sea, una unión disjunta de árboles.

Cada componente conexa de un bosque es entonces un árbol. Contando aristas componente a
componente se obtiene una fórmula general en función de la cantidad de componentes.

> **Corolario.**
> i) Un bosque $F$ con $n$ vértices tiene $n - k(F)$ aristas.
> ii) Un grafo $G$ con $n$ vértices tiene por lo menos $n - k(G)$ aristas.

donde $k(G)$ es la cantidad de componentes conexas de $G$. El caso i) es una igualdad porque
el bosque no tiene ciclos; en un grafo general las aristas de más provienen de los ciclos, de
ahí la desigualdad de ii).

## Cota de aristas por componentes

Fijada la cantidad de vértices y de componentes, un grafo simple no puede tener demasiadas aristas.

> **Proposición.** Sea $G$ un grafo simple con $n$ vértices y $k$ componentes. Entonces
> $$\#E(G) \le \frac{(n-k)(n-k+1)}{2}$$
> donde $\#E(G)$ es la cantidad de aristas, $n$ el número de vértices y $k$ el de componentes conexas.

> **Corolario.** Un grafo simple con $n$ vértices y más de $\dfrac{(n-1)(n-2)}{2}$ aristas
> debe ser conexo.

## Caracterizaciones equivalentes de un árbol

El resultado central de la unidad: seis propiedades que son todas equivalentes entre sí. En la
práctica, para probar que un grafo es un árbol basta verificar cualquiera de ellas.

> **Teorema.** Sea $T$ un grafo con $n$ vértices (sin lazos). Las siguientes afirmaciones son
> equivalentes:
> i) $T$ es un árbol.
> ii) $T$ no contiene ciclos y tiene $n-1$ aristas.
> iii) $T$ es conexo y tiene $n-1$ aristas.
> iv) $T$ es conexo y toda arista es una arista de corte.
> v) Todo par de vértices de $T$ está conectado por exactamente un camino simple.
> vi) $T$ no contiene ciclos y $T + e$ tiene exactamente un ciclo (al agregar cualquier
> arista nueva $e$).

**Observación.** La caracterización iv) dice que en un árbol *no sobra ninguna arista*: quitar
cualquiera lo desconecta. La vi) es la cara opuesta: *no falta lugar para ninguna*, agregar una
arista siempre cierra un ciclo.

## Árbol como subgrafo por grado mínimo

Un grado mínimo suficientemente grande garantiza que cualquier árbol dado aparezca dentro del grafo.

> **Teorema.** Sea $T$ un árbol con $n$ vértices y sea $G$ un grafo simple tal que
> $\delta_{\min}(G) \ge n-1$. Entonces $T$ es un subgrafo de $G$.

donde $\delta_{\min}(G)$ es el grado mínimo de $G$ (el menor de los grados de sus vértices).

---

## Ver también

- [[07-arboles/02-arboles-con-raiz]] — árboles dirigidos, con raíz, $m$-arios y binarios
- [[07-arboles/03-recorridos-y-expresion]] — recorridos, árboles de expresión y BST
- [[07-arboles/04-arboles-recubridores]] — árboles recubridores construidos con DFS y BFS
