---
tags: [teoria, unidad-3, red-black, black-height, rotaciones]
fuente: apuntes de la cursada 2024-2C (parciales resueltos)
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Árboles Red-Black

El **Red-Black tree** es un BST balanceado que mantiene su altura acotada coloreando cada nodo
de **rojo** o **negro** y respetando cuatro propiedades. A diferencia del [[02-avl|AVL]], no exige
un balanceo tan estricto: garantiza $O(\log n)$ pero con inserción y borrado **amortizados** más
baratos.

## Propiedades

> **Definición.** Un árbol es **Red-Black** si cumple las cuatro propiedades:
> 1. Los nodos son **rojos** o **negros**.
> 2. La **raíz** y las **hojas** (los `Null`) son **negros**.
> 3. Todo nodo **rojo** tiene hijos **negros** (no hay dos rojos seguidos).
> 4. Todo camino desde un nodo a sus descendientes `Null` contiene la **misma cantidad de nodos negros**.

La propiedad 4 es la que fuerza el balanceo: define la noción de *black-height*.

> **Definición.** La **black-height** de un nodo es la cantidad de nodos **negros** entre ese nodo
> y los `Null` que cuelgan de él (contando los `Null`, sin contar el propio nodo).

De las propiedades 3 y 4 se deduce la cota clave:

- El **camino más corto** desde un nodo tiene **todos los nodos negros**.
- El **camino más largo** **alterna** nodos negros y rojos.
- Por lo tanto, **el camino más largo no supera el doble del más corto**, y la altura máxima es
  $O(\log n)$.

> **Ejemplo.** En un árbol con raíz $8$ (negra), la *black-height* del árbol es $2$: desde la raíz
> hasta cualquier `Null` se atraviesan siempre $2$ nodos negros. Para un hijo intermedio como el
> $5$, su black-height es $1$.

## Complejidad

| Operación | Temporal | Espacial |
|---|---|---|
| Búsqueda | $O(\log n)$ | $O(n)$ |
| Inserción | $O(\log n)$ | $O(n)$ |
| Borrado | $O(\log n)$ | $O(n)$ |

La **altura máxima** es $O(\log n)$, lo que sostiene el costo temporal logarítmico de las tres
operaciones.

## Rotaciones

Las rotaciones reordenan localmente tres nodos preservando el orden BST; son la herramienta con
la que la inserción restablece las propiedades. Son inversas entre sí:

- **`left-rotate(x)`**: el hijo derecho de $x$ sube a ocupar el lugar de $x$, y $x$ baja como su
  hijo izquierdo.
- **`right-rotate(x)`**: operación inversa; el hijo izquierdo sube y $x$ baja a la derecha.

Por ejemplo, `left-rotate(5)` sobre un nodo $5$ con hijo derecho $10$ deja a $10$ arriba y a $5$
como su hijo izquierdo; `right-rotate(10)` deshace exactamente ese cambio.

## Inserción: casos de $z$

Un nodo nuevo $z$ se inserta **rojo** (para no alterar la black-height) y luego se reparan las
violaciones subiendo desde $z$. El caso a aplicar depende del **color del tío** (`uncle`) de $z$
y de la forma (triángulo o línea):

| Caso | Condición | Acción |
|---|---|---|
| 0 | $z$ es la **raíz** | recolorear $z$ a **negro** |
| 1 | el tío de $z$ es **rojo** | **recolorear**: padre y tío a negro, abuelo a rojo (y seguir desde el abuelo) |
| 2 | tío **negro**, configuración en **triángulo** | **rotar el padre** de $z$ (lleva al caso 3) |
| 3 | tío **negro**, configuración en **línea** | **rotar el abuelo** de $z$ y **recolorear** |

- **Caso 0 — $z$ es raíz:** se pinta de negro y listo (propiedad 2).
- **Caso 1 — tío rojo:** basta recolorear. El padre y el tío pasan a negro y el abuelo a rojo; la
  violación puede propagarse hacia arriba, así que se repite el análisis tomando al abuelo como
  nuevo $z$.
- **Caso 2 — tío negro, triángulo:** $z$ está "quebrado" respecto de su padre y abuelo (p. ej. $z$
  es hijo derecho de un padre que es hijo izquierdo). Se **rota el padre** para llevarlo a una
  configuración en línea, que se resuelve como caso 3.
- **Caso 3 — tío negro, línea:** $z$, su padre y su abuelo están alineados. Se **rota el abuelo** y
  se recolorea (el que sube queda negro, el que baja rojo), y el árbol vuelve a ser válido.

## Verificar si un árbol es Red-Black

Otro arquetipo: dado un árbol coloreado, decidir si es un Red-Black válido y, si no, indicar
**exactamente** qué propiedades viola. La verificación recorre las cuatro propiedades; la que más
suele fallar es la **4** (black-height desigual entre caminos).

> **Ejemplo.** Un árbol con raíz $23$ (negra), hijo izquierdo $10$ (rojo) con dos `Null`, e hijo
> derecho $29$ (rojo) con subárbol más profundo ($25$, $40$, $36$…) **no** es Red-Black: desde la
> raíz hasta los `Null` del lado del $10$ se cuentan $2$ nodos negros, pero hasta los `Null` del
> lado derecho se cuentan $3$. Al no coincidir la cantidad de nodos negros por camino, **viola la
> propiedad 4**. En cambio, árboles donde toda rama acumula la misma black-height y ningún rojo
> tiene hijo rojo **sí** son Red-Black válidos.

Para ver la mecánica de inserción aplicada paso a paso, ver [[04-trazas-red-black]].

---

## Ver también

- [[04-trazas-red-black]] — inserciones completas paso a paso, con casos y rotaciones
- [[02-avl]] — el otro BST balanceado; comparación de garantías y alturas
- [[01-bst-fundamentos]] — el BST base sin balanceo
