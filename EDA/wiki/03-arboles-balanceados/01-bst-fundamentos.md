---
tags: [teoria, unidad-3, bst, arboles-binarios-de-busqueda]
fuente: apuntes de la cursada 2024-2C (parciales resueltos)
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Árboles binarios de búsqueda (BST)

El **árbol binario de búsqueda** (BSTree) es la estructura base sobre la que se montan los
árboles balanceados de esta unidad. Guarda claves ordenadas de forma que la búsqueda siga un
único camino desde la raíz, pero **no** garantiza por sí solo estar balanceado: en el peor
caso degenera en una lista y pierde su ventaja.

## Definición

> **Definición.** Un **BSTree** de enteros que **no acepta valores repetidos** (los ignora) es
> un árbol binario donde, para **todo** nodo, **todas** las claves de su subárbol izquierdo son
> menores que él y **todas** las de su subárbol derecho son mayores que él.

La condición es **global y recursiva**, no solo sobre los hijos inmediatos: no alcanza con que
el hijo izquierdo sea menor y el derecho mayor.

> **Cuidado:** la afirmación *"un BSTree es un árbol binario donde cada nodo verifica que su
> hijo izquierdo es menor que él y su hijo derecho es mayor que él"* es **falsa**. Esa versión
> solo mira los hijos directos. Existen árboles que la cumplen en cada nodo y aun así no son
> BST, porque un nodo profundo puede respetar a su padre inmediato y a la vez violar la cota
> impuesta por un ancestro (un valor menor que la raíz colgando en su subárbol derecho).

En los apuntes esto se resuelve mostrando un contraejemplo gráfico: un árbol chico donde cada
nodo cumple la relación con su hijo directo pero un descendiente rompe el orden respecto de la
raíz, de modo que no es un BST válido. *(Los valores exactos del contraejemplo del original son
algo dudosos; lo que importa es el principio: la propiedad debe valer sobre todo el subárbol.)*

## Complejidad de la búsqueda

La búsqueda desciende comparando la clave contra cada nodo y bajando a izquierda o derecha.
Su costo depende de la **altura** del árbol:

| Caso | Costo temporal | Motivo |
|---|---|---|
| Árbol balanceado | $O(\log n)$ | la altura es logarítmica |
| Peor caso (degenerado) | $O(n)$ | inserciones ordenadas ⇒ el árbol es una "lista" de altura $n$ |

> **Cuidado:** es **falso** que buscar en un BSTree tenga siempre complejidad $O(\log n)$. Frente
> a un **array ordenado**, donde la búsqueda binaria garantiza $O(\log N)$ en el peor caso, el
> BST **no** lo garantiza: en el peor caso (árbol degenerado) la búsqueda es $O(n)$. Esta es la
> justificación de por qué se usan árboles **balanceados** ([[02-avl]], [[03-red-black]]): fuerzan
> altura $O(\log n)$ y, con ella, búsqueda $O(\log n)$ garantizada.

## Comparación con un arreglo ordenado

En un parcial se pide el costo temporal (peor caso) de varias operaciones sobre un arreglo
ordenado, con el AVL como referencia balanceada:

| Operación | Costo | Justificación |
|---|---|---|
| Insertar en arreglo ordenado (con espacio) manteniéndolo ordenado | $O(n)$ | hay que correr elementos para abrir hueco |
| Buscar un elemento en arreglo ordenado | $O(\log n)$ | búsqueda binaria |
| Buscar el máximo en arreglo ordenado | $O(1)$ | es el último elemento, `arr[N-1]` |
| Buscar un elemento en arreglo **desordenado** | $O(n)$ | hay que recorrer todo |
| Buscar un elemento en un árbol **AVL** | $O(\log n)$ | el AVL está siempre balanceado |

## Conjunto de claves que hacen crecer la altura

Un arquetipo de ejercicio: dado un BSTree, caracterizar el **conjunto $C$** de claves cuya
inserción hace **crecer la altura** del árbol. Una nueva clave aumenta la altura solo si se
convierte en una hoja **por debajo** del nivel más profundo actual; queda determinada por los
"huecos" abiertos bajo los nodos más profundos.

> **Ejemplo.** Sobre un BSTree (naturales $>0$, sin repetidos) con raíz $95$, cuyo camino más
> profundo llega a $112$ (por la rama $95 \to 116 \to 111 \to 112$), insertar una clave crece
> en altura únicamente si cae como hijo de $112$. Como $112$ es hijo derecho de $111$ y su
> hueco derecho admite valores $112 < c < 116$, resulta
> $$C = \{113,\ 114,\ 115\}$$
> En cambio, sobre la rama izquierda el nodo más profundo es $39$ (por $95 \to 40 \to 38 \to 39$):
> sus huecos exigirían un entero entre $38$ y $39$ o entre $39$ y $40$, que no existe, así que
> ninguna inserción de ese lado gana altura.

El razonamiento se analiza tomando cada valor **aisladamente** contra el árbol de partida (no
en secuencia): interesa el efecto de *una* inserción sobre el árbol dado.

---

## Ver también

- [[02-avl]] — BST auto-balanceado por factor de balanceo y rotaciones
- [[03-red-black]] — BST balanceado por coloreo de nodos
- [[02-busqueda]] — búsqueda binaria sobre arreglos ordenados
- [[01-big-o-y-ordenes]] — notación $O$ y jerarquía de órdenes usada en las cotas
