---
tags: [teoria, unidad-3, avl, rotaciones, arbol-fibonacci]
fuente: apuntes de la cursada 2024-2C (parciales resueltos)
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Árboles AVL

El **AVL** es un árbol binario de búsqueda **auto-balanceado** (*self-balancing*): tras cada
inserción y borrado realiza ajustes (rotaciones) para mantener acotada su altura. Así garantiza
$O(\log n)$ en búsqueda, inserción y borrado, incluso en el peor caso.

## Propiedad de balanceo

> **Definición.** La **altura** de un nodo es la cantidad de nodos del camino más largo entre él
> y una hoja.

> **Propiedad (AVL).** Para cada nodo, la altura de sus dos subárboles difiere a lo sumo en $1$.

Esto se controla con el **factor de balanceo** de cada nodo:

$$\text{Fb} = h_{\text{izq}} - h_{\text{der}}, \qquad \text{Fb} \in \{-1,\ 0,\ 1\}$$

donde $h_{\text{izq}}$ y $h_{\text{der}}$ son las alturas de los subárboles izquierdo y derecho.
Si tras una inserción algún nodo alcanza $\text{Fb} = \pm 2$, el árbol **deja de ser AVL** y hay
que rebalancear con una rotación.

## AVL frente a Red-Black

Ambos son BST balanceados. La diferencia está en las garantías: el AVL está **más balanceado**
(peor caso más ajustado), mientras que el [[03-red-black|Red-Black]] ofrece costo **amortizado**
más barato en inserción y borrado.

**Peor caso:**

| Operación | AVL | Red-Black |
|---|---|---|
| Búsqueda | $O(\log n)$ | $O(\log n)$ |
| Inserción | $O(\log n)$ | $O(\log n)$ |
| Borrado | $O(\log n)$ | $O(\log n)$ |

**Caso amortizado:**

| Operación | AVL | Red-Black |
|---|---|---|
| Búsqueda | $O(\log n)$ | $O(\log n)$ |
| Inserción | $O(\log n)$ | $O(1)$ |
| Borrado | $O(\log n)$ | $O(1)$ |

**Observación.** Si se va a hacer **mucha búsqueda**, el AVL es más eficiente porque está más
balanceado. La diferencia se ve en la cota de altura:

| Altura AVL | Altura Red-Black |
|---|---|
| $1.44 \cdot \log_2 n$ | $2 \cdot \log_2 n$ |

## Cantidad máxima de nodos

Un AVL de altura $h$ tiene la máxima cantidad de nodos cuando está **completo**, sumando todos
los niveles:

$$\#\text{nodos}_{\max} = \sum_{i=0}^{h} 2^{i} = 2^{\,h+1} - 1$$

donde $h$ es la altura y cada nivel $i$ aporta $2^{i}$ nodos.

## Rotaciones de inserción

Cuando una inserción rompe el balanceo (algún nodo queda con $\text{Fb} = \pm 2$), se aplica una
rotación según **dónde** cayó la inserción respecto del nodo desbalanceado. Hay dos familias
(según el signo del Fb) con dos subcasos cada una:

| Caso | Situación | Se insertó en… | Rotación |
|---|---|---|---|
| C1.1 (**LL**) | nodo con $\text{Fb}=1 \Rightarrow 2$ | subárbol **izquierdo** del hijo izquierdo | simple a **derecha** |
| C1.2 (**LR**) | nodo con $\text{Fb}=1 \Rightarrow 2$ | subárbol **derecho** del hijo izquierdo | **doble** izq-der |
| C2.1 (**RR**) | nodo con $\text{Fb}=-1 \Rightarrow -2$ | subárbol **derecho** del hijo derecho | simple a **izquierda** |
| C2.2 (**RL**) | nodo con $\text{Fb}=-1 \Rightarrow -2$ | subárbol **izquierdo** del hijo derecho | **doble** der-izq |

- **C1 — se insertó a la izquierda de un nodo con $\text{Fb}=1$** ⇒ pasa a $\text{Fb}=2$ (ya no es AVL).
  Si la inserción fue en el subárbol izquierdo del hijo izquierdo (caso **LL**), una **rotación
  simple a derecha** basta; si fue en el subárbol derecho del hijo izquierdo (caso **LR**), hace
  falta una **rotación doble** (primero izquierda sobre el hijo, luego derecha sobre el nodo).
- **C2 — se insertó a la derecha de un nodo con $\text{Fb}=-1$** ⇒ pasa a $\text{Fb}=-2$. Simétrico:
  **RR** se arregla con **rotación simple a izquierda**; **RL** con **rotación doble** der-izq.

**Observación.** Los casos dobles (LR y RL) equivalen a encadenar dos rotaciones simples: la
primera lleva la configuración "quebrada" a una configuración "en línea", y la segunda la
resuelve como un caso simple.

## Árbol Fibonacci

El **árbol Fibonacci** es el AVL **peor balanceado** posible: para una altura dada, es el que
usa la **mínima** cantidad de nodos sin violar la propiedad AVL. Se construye recursivamente:

- orden $0$: `Null`;
- orden $1$: un nodo;
- orden $h \geq 2$: su hijo izquierdo es el árbol Fibonacci de orden $h-1$ y su hijo derecho el de orden $h-2$.

La cantidad mínima de nodos de un AVL de altura $h$ es entonces

$$\#\text{nodos}_{\min}(h) = \text{Fib}(h+3) - 1$$

y, escribiéndolo con la razón áurea $\varphi = \dfrac{1+\sqrt5}{2}$, si un AVL tiene $n$ nodos su
altura $h$ cumple

$$n \geq \frac{\varphi^{\,h+3}}{\sqrt5} - 1$$

lo que acota la altura de un AVL de $n$ nodos por $O(\log N)$: aun en su peor forma, el AVL sigue
siendo logarítmico.

> **Ejemplo.** La mínima cantidad de nodos de un AVL de **altura $4$** es
> $$\#\text{nodos}_{\min} = \text{Fib}(4+3) - 1 = \text{Fib}(7) - 1 = 13 - 1 = 12$$
> En forma cerrada con la razón áurea, $\dfrac{\varphi^{\,7}}{\sqrt5} - 1 \approx 11{,}98$, que
> redondeado hacia arriba (el número de nodos es entero) da $n_{\min} = 12$.

---

## Ver también

- [[01-bst-fundamentos]] — el BST base sin garantía de balanceo
- [[03-red-black]] — el otro BST balanceado, con garantías amortizadas
- [[02-teorema-maestro]] — recurrencias y la cota $O(\log n)$
- [[01-big-o-y-ordenes]] — jerarquía de órdenes y notación asintótica
