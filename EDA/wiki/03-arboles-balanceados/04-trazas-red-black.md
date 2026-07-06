---
tags: [resuelto, unidad-3, red-black, trazas, insercion]
fuente: apuntes de la cursada 2024-2C (parciales resueltos)
unidad: 3
tipo: resuelto
actualizado: 2026-07-05
---

# Trazas de inserción en Red-Black

Dos inserciones completas paso a paso, resueltas en parciales, que ejercitan todos los casos de
la [[03-red-black|reparación de un Red-Black]]: recoloreo por tío rojo (caso 1) y rotaciones por
tío negro en línea (caso 3). Cada clave nueva entra **roja**; se anota entre paréntesis el color
final de cada nodo (**N** = negro, **R** = rojo).

## Secuencia $10,\ 18,\ 5,\ 15,\ 17,\ 29,\ 40,\ 91$

1. **Insertar 10.** Es la raíz ⇒ **caso 0**, se pinta negra.
   - `10(N)`
2. **Insertar 18.** BST: hijo derecho de $10$. Padre negro, sin violación.
   - `10(N)` — der: `18(R)`
3. **Insertar 5.** Hijo izquierdo de $10$. Padre negro, sin violación.
   - `10(N)` — izq: `5(R)`, der: `18(R)`
4. **Insertar 15.** Baja a la izquierda de $18$; queda `15(R)` con padre `18(R)`: violación. El
   **tío es $5$ (rojo)** ⇒ **caso 1**: recolorear. $18$ y $5$ pasan a negro, $10$ a rojo; pero $10$
   es la raíz, así que vuelve a negro.
   - `10(N)` — izq: `5(N)`, der: `18(N)` — con `18`.izq: `15(R)`
5. **Insertar 17.** Camino $10 \to 18 \to 15$, cae a la derecha de $15$: `17(R)` con padre `15(R)`,
   **tío negro** (el `Null`), configuración en **triángulo** ⇒ **caso 2** (rotar el padre $15$),
   que deja una **línea** ⇒ **caso 3** (rotar el abuelo $18$ y recolorear). El subárbol queda con
   $17$ arriba, negro.
   - `10(N)` — izq: `5(N)`, der: `17(N)` — con `17`.izq: `15(R)`, `17`.der: `18(R)`
6. **Insertar 29.** Baja a la derecha de $18$: `29(R)` con padre `18(R)`. El **tío es $15$ (rojo)**
   ⇒ **caso 1**: recolorear. $18$ y $15$ a negro, $17$ a rojo (su padre $10$ es negro, se detiene).
   - `10(N)` — izq: `5(N)`, der: `17(R)` — con `17`.izq: `15(N)`, `17`.der: `18(N)`, y `18`.der: `29(R)`
7. **Insertar 40.** Baja a la derecha de $29$: `40(R)` con padre `29(R)`, **tío negro** (`Null`),
   configuración en **línea** (rama derecha-derecha) ⇒ **caso 3**: rotar el abuelo $18$ a la
   izquierda y recolorear. Queda $29$ arriba, negro, con hijos $18$ y $40$.
   - `10(N)` — izq: `5(N)`, der: `17(R)`
   - `17`.izq: `15(N)`, `17`.der: `29(N)`
   - `29`.izq: `18(R)`, `29`.der: `40(R)`
8. **Insertar 91.** Baja a la derecha de $40$: `91(R)` con padre `40(R)`. El **tío es $18$ (rojo)**
   ⇒ **caso 1**: recolorear ($40$ y $18$ a negro, $29$ a rojo). Ahora `29(R)` tiene padre `17(R)`:
   **nueva violación**, se sube. El **tío de $29$ es $5$ (negro)** y la rama $10 \to 17 \to 29$ está
   en **línea** ⇒ **caso 3**: rotar el abuelo $10$ a la izquierda y recolorear. **$17$ queda como
   nueva raíz** (negra), con $10$ (rojo) y $29$ (rojo) de hijos.

**Árbol final:**

- `17(N)` (raíz)
- `17`.izq: `10(R)` — con `5(N)` y `15(N)`
- `17`.der: `29(R)` — con `18(N)` y `40(N)`
- `40`.der: `91(R)`

Se verifica la black-height: todo camino de la raíz a un `Null` cruza exactamente $2$ nodos
negros, y ningún rojo ($10$, $29$, $91$) tiene hijo rojo.

## Secuencia $15,\ 4,\ 2,\ 12,\ 20,\ 9,\ 13,\ 35$

1. **Insertar 15.** Raíz ⇒ **caso 0**, negra. `15(N)`
2. **Insertar 4.** Hijo izquierdo de $15$, rojo. Sin violación. `15(N)` — izq: `4(R)`
3. **Insertar 2.** Baja a la izquierda de $4$: `2(R)` con padre `4(R)`, **tío negro** (`Null`),
   rama izquierda-izquierda ⇒ **línea**, **caso 3**: rotar el abuelo $15$ a la derecha y recolorear.
   Queda $4$ arriba, negro.
   - `4(N)` — izq: `2(R)`, der: `15(R)`
4. **Insertar 12.** Baja a la izquierda de $15$: `12(R)` con padre `15(R)`. El **tío es $2$ (rojo)**
   ⇒ **caso 1**: recolorear. $15$ y $2$ a negro, $4$ a rojo; $4$ es raíz ⇒ vuelve a negro.
   - `4(N)` — izq: `2(N)`, der: `15(N)` — con `15`.izq: `12(R)`
5. **Insertar 20.** Hijo derecho de $15$, rojo. Padre negro, sin violación.
   - `4(N)` — izq: `2(N)`, der: `15(N)` — con `15`.izq: `12(R)`, `15`.der: `20(R)`
6. **Insertar 9.** Camino $4 \to 15 \to 12$, cae a la izquierda de $12$: `9(R)` con padre `12(R)`. El
   **tío es $20$ (rojo)** ⇒ **caso 1**: recolorear. $12$ y $20$ a negro, $15$ a rojo (su padre $4$
   es negro, se detiene).
   - `4(N)` — izq: `2(N)`, der: `15(R)`
   - `15`.izq: `12(N)`, `15`.der: `20(N)`, y `12`.izq: `9(R)`
7. **Insertar 13.** Baja a la derecha de $12$: `13(R)`. Padre `12(N)` negro, sin violación.
   - `12`.izq: `9(R)`, `12`.der: `13(R)`
8. **Insertar 35.** Baja a la derecha de $20$: `35(R)`. Padre `20(N)` negro, sin violación.

**Árbol final:**

- `4(N)` (raíz)
- `4`.izq: `2(N)`, `4`.der: `15(R)`
- `15`.izq: `12(N)` — con `9(R)` y `13(R)`
- `15`.der: `20(N)` — con `35(R)` a la derecha

> **Nota.** Las trazas se reconstruyeron siguiendo los diagramas coloreados del parcial y
> verificando en cada paso las cuatro propiedades del Red-Black; el resultado coincide con el
> árbol final dibujado en el original.

---

## Ver también

- [[03-red-black]] — propiedades, black-height, rotaciones y casos de inserción
- [[02-avl]] — el otro BST balanceado, con rotaciones por factor de balanceo
- [[01-bst-fundamentos]] — orden BST que las inserciones respetan al descender
