---
tags: [teoria, unidad-6, complejidad, notacion-asintotica, big-o]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Notación asintótica: $O$, $\Omega$ y $\Theta$

La notación asintótica permite comparar el crecimiento de dos funciones cuando la
entrada se hace grande, ignorando constantes y términos de menor orden. Es la
herramienta con la que se mide la complejidad de un algoritmo (ver
[[06-complejidad/02-complejidad-de-algoritmos]]).

## Notación $O$ (cota superior)

La $O$ grande («big O») acota el crecimiento de una función **por arriba**, a menos de
una constante.

> **Definición.** Sean $f$ y $g$ funciones de $\mathbb{R} \to \mathbb{R}$. Decimos que $f(x)$ es $O(g(x))$ si
> $$\exists\, C, k \;\; / \;\; |f(x)| \leq C \cdot |g(x)| \quad \forall\, x > k$$
> donde $C$ es una constante multiplicativa y $k$ es el umbral a partir del cual vale la
> desigualdad.

Intuitivamente: existe un múltiplo $C \cdot g$ que queda por encima de $f$ para todo $x$
suficientemente grande. A partir de $x = k$, la curva $C \cdot g(x)$ domina a $f(x)$.

### Ejemplo

Se quiere probar que $f(n) = 2n^2 + 10n + 9$ es $O(n^2)$. Para $n \geq 1$ cada término se
acota por un múltiplo de $n^2$:

$$2n^2 \leq 2n^2, \qquad 10n \leq 10n^2, \qquad 9 \leq 9n^2$$

Sumando las tres desigualdades:

$$2n^2 + 10n + 9 \;\leq\; 2n^2 + 10n^2 + 9n^2 \;=\; 21\,n^2$$

Con lo cual $f(n) \leq 21\,n^2$ para todo $n \geq 1$, y por lo tanto

$$f(n) \text{ es } O(n^2)$$

tomando la constante $C = 21$ y el umbral $k = 1$.

## Observaciones sobre $O$

Algunas propiedades útiles para operar con la notación:

- Si $f$ es $O(h(n))$ y $g$ es $O(h(n))$, entonces $f$ y $g$ son **del mismo orden**.
- Cuando $f$ es $O(g(n))$ y $|h(n)| \geq |g(n)|$, se dice que $f$ es $O(h(n))$.
- Se escoge la notación $O$ **tan pequeña como sea posible** (la cota más ajustada).

### Jerarquía de funciones más usadas

Ordenadas de menor a mayor crecimiento, las funciones que aparecen habitualmente son:

$$1 \;\to\; \log_2(\log_2 n) \;\to\; \log_2 n \;\to\; n \;\to\; n\log_2 n \;\to\; n^2 \;\to\; n^3 \;\to\; n^m \;\to\; m^n \;\to\; n!$$

con $m \geq 2$. Cada función de la cadena es $O$ de la siguiente, pero no al revés: por
ejemplo, un algoritmo $O(n\log_2 n)$ es preferible a uno $O(n^2)$.

### Suma y producto de órdenes

Si $f_1$ es $O(g_1(n))$ y $f_2$ es $O(g_2(n))$, entonces:

i) **Suma:** la función suma queda dominada por el mayor de los dos órdenes,
   $$(f_1 + f_2)(n) \text{ es } O\big(\max\{g_1(n);\, g_2(n)\}\big)$$
ii) **Producto:** el producto multiplica los órdenes,
   $$(f_1 \cdot f_2)(n) \text{ es } O\big(g_1(n) \cdot g_2(n)\big)$$

## Notación $\Omega$ (cota inferior)

La notación $\Omega$ permite dar un **límite inferior** para $f(n)$.

> **Definición.** Sean $f$ y $g$ de $\mathbb{N} \to \mathbb{N}$. Decimos que $f$ es $\Omega(g(n))$ si
> $$\exists\, C, k \;\; / \;\; |f(n)| \geq C \cdot |g(n)| \quad \forall\, n > k$$
> donde $C$ y $k$ juegan el mismo papel que en la definición de $O$, pero ahora $C \cdot g$
> queda **por debajo** de $f$.

## Notación $\Theta$ (orden exacto)

La notación $\Theta$ fija el orden de crecimiento de $f(n)$.

> **Definición.** Sean $f$ y $g$ de $\mathbb{N} \to \mathbb{N}$. Decimos que $f$ es $\Theta(g(n))$ si $f(n)$ es $\Omega(g(n))$.

> **Nota.** En el apunte original la definición de $\Theta$ aparece enunciada solo a través de
> $\Omega$ (y descripta como «límite superior»), lo cual está incompleto: la caracterización
> habitual de $\Theta$ exige que $f$ sea **simultáneamente** $O(g(n))$ **y** $\Omega(g(n))$ —
> es decir, un orden ajustado por arriba y por abajo. Se transcribe tal como figura en la
> fuente y se deja marcada la salvedad.

---

## Ver también

- [[06-complejidad/02-complejidad-de-algoritmos]] — propiedades de los algoritmos y complejidad temporal vs. espacial
- [[index]] — índice del vault de Matemática Discreta
