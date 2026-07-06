---
tags: [teoria, unidad-4, arboles-b, arboles-multicamino, b-tree]
fuentes:
  - apuntes de la cursada 2024-2C (resumen, sección Árboles)
  - apuntes de la cursada 2024-2C (final, Árbol multicamino M-ario / B-tree)
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Árboles multicamino y árboles B

Los árboles B (o *B-trees*) generalizan a los árboles de búsqueda binarios permitiendo
**varias claves y varios hijos por nodo**. Son parientes de los árboles Red-Black —logran el
mismo orden de complejidad $O(\log N)$— pero con un factor de ramificación mucho mayor, lo
que reduce la altura y, con ella, la cantidad de accesos a disco. Por eso son la estructura
de índice canónica de los **sistemas de bases de datos**.

## Motivación

Del resumen de la cursada, las ideas centrales de un B-tree:

- Son **similares a los árboles Red-Black, pero con varios hijos** por nodo.
- Se usan en **sistemas de bases de datos**, porque **reducen las operaciones de disco**.
- El *runtime* es $O(\log N)$ para la mayoría de las operaciones.
- La **altura puede ser mucho menor** que la de un árbol Red-Black equivalente.

Ver [[03-red-black-trees|árboles Red-Black]] para la estructura binaria autobalanceada con la
que se comparan.

## Árbol multicamino M-ario (orden M)

Antes de imponer el balanceo conviene definir la forma general.

> **Definición (árbol multicamino de orden $M$).** Es un árbol en el que:
> i) cada nodo guarda **hasta $M-1$ claves** de información;
> ii) cada nodo tiene un **máximo de $M$ hijos**;
> iii) cada clave $C_i$ dentro de un nodo separa dos subárboles: las claves del **subárbol
> izquierdo** de $C_i$ son **menores** que $C_i$ y las del **subárbol derecho** son **mayores**.

La condición (iii) es la propiedad de orden del BST, extendida a nodos con varias claves: un
nodo con claves $C_1 < C_2 < \dots < C_k$ tiene $k+1$ subárboles intercalados con las claves.

## Árbol multicamino balanceado (B-tree de orden $N$)

Un árbol B es un árbol multicamino con condiciones adicionales de ocupación y balanceo.

> **Definición (B-tree de orden $N$).** Un árbol multicamino balanceado cumple:
> i) cada nodo contiene **a lo sumo $2N$ claves**;
> ii) cada nodo **excepto la raíz** contiene **como mínimo $N$ claves**;
> iii) cada nodo o es hoja o tiene **$M+1$ descendientes**, donde $M$ es la cantidad de claves
> del nodo;
> iv) **todas las hojas están al mismo nivel**.

Las condiciones (i) y (ii) se resumen en la cota de ocupación por nodo (salvo la raíz):

$$N \le \#\text{claves} \le 2N$$

La condición (iv) —hojas al mismo nivel— es la que mantiene el árbol **balanceado** y
garantiza el $O(\log N)$: todos los caminos de la raíz a una hoja tienen el mismo largo.

**Observación.** Los enunciados hablan de *orden 1* ($N=1$: entre $1$ y $2$ claves por nodo)
y *orden 2* ($N=2$: entre $2$ y $4$ claves por nodo). En las trazas de
[[02-insercion-en-b-trees]] y [[03-borrado-en-b-trees]] se usan justamente esos dos órdenes.

## Grado mínimo $t$ (formulación alternativa)

El resumen presenta la misma estructura con otra parametrización, la del **grado mínimo del
árbol**, notado $t$, con $t \ge 2$. Cada nodo tiene una cota inferior y una superior de
ocupación:

| Cota | Claves por nodo | Hijos (nodos internos) |
|---|---|---|
| **Inferior** (excepto la raíz) | al menos $t-1$ | al menos $t$ |
| **Superior** | a lo sumo $2t-1$ | a lo sumo $2t$ |

En esta notación, un nodo con $N$ claves ordenadas de forma ascendente tiene $N+1$ hijos. Es
la misma idea que el orden $N$: dos formas equivalentes de fijar cuán lleno debe estar cada
nodo.

**Ejemplo.** Un nodo con las claves $\{10, 20\}$ ($N=2$ claves) tiene $3$ hijos: el subárbol
de claves $<10$, el de claves entre $10$ y $20$, y el de claves $>20$.

## Búsqueda de una clave

Buscar la clave $X$ en un nodo con claves $C_1 < \dots < C_k$ compara $X$ con las claves del
nodo y desciende por el hijo correspondiente. Notando $P_0, \dots, P_k$ a los $k+1$ punteros a
hijos del nodo:

- $X < C_1$: no está en el nodo; se pasa al hijo $P_0$.
- $X = C_i$ para algún $i \le k$: **se encontró** la clave.
- $C_i < X < C_{i+1}$: se sigue la búsqueda en el hijo $P_i$.
- $C_k < X$: se sigue la búsqueda en el hijo más a la derecha, $P_k$.

$$\text{Si en algún paso el hijo } P_j \text{ a seguir es } \texttt{null} \implies X \text{ no está en el árbol.}$$

Como cada paso desciende un nivel y el árbol tiene altura $O(\log N)$, la búsqueda es
$O(\log N)$.

> **Nota.** En el original, la última rama de la búsqueda figura escrita como $P_{k-1}$;
> corresponde al hijo más a la derecha del nodo, que con $k$ claves y punteros $P_0,\dots,P_k$
> es $P_k$.

## Operaciones que modifican el árbol

Las dos operaciones que alteran la estructura —y que concentran el valor de los parciales
resueltos— tienen página propia:

- **Inserción**: se inserta siempre en las hojas y, si un nodo se pasa de $2N$ claves, la clave
  del medio **sube** al padre. Ver [[02-insercion-en-b-trees]].
- **Borrado**: se resuelve en la hoja, reemplazando por una clave adyacente si la clave a borrar
  es interna, y **fusionando** con un hermano cuando un nodo queda con menos claves de las
  permitidas. Ver [[03-borrado-en-b-trees]].

---

## Ver también

- [[02-insercion-en-b-trees]] — algoritmo de inserción y trazas paso a paso
- [[03-borrado-en-b-trees]] — algoritmo de borrado y trazas por sucesor/predecesor inorder
- [[03-red-black-trees|árboles Red-Black]] — la estructura binaria autobalanceada comparable
- [[01-big-o-y-ordenes]] — la notación $O(\log N)$ con la que se mide el costo
