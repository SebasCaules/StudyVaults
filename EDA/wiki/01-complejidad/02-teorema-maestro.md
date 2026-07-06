---
tags: [teoria, unidad-1, teorema-maestro, recurrencias, complejidad]
fuente: apuntes de la cursada 2024-2C (parciales resueltos y teórica)
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Teorema Maestro

Los algoritmos **divide y vencerás** parten el problema en subproblemas, los resuelven
recursivamente y combinan los resultados. Su costo queda descrito por una recurrencia, y
el Teorema Maestro permite obtener el orden $O$ de esa recurrencia sin resolverla a mano.

## Enunciado

> **Teorema (Maestro).** Sea una recurrencia de la forma
> $$T(n) = a\,T\!\left(\frac{n}{b}\right) + c\,n^d$$
> con $a \geq 1$, $b > 1$ y $c, d$ constantes. Comparando $a$ con $b^d$:
> - Si $a < b^d \Rightarrow T(n) = O(n^d)$.
> - Si $a = b^d \Rightarrow T(n) = O(n^d \log n)$.
> - Si $a > b^d \Rightarrow T(n) = O\!\left(n^{\log_b a}\right)$.

Donde $a$ es la cantidad de subproblemas, $b$ el factor en que se divide el tamaño en cada
llamada, y $c\,n^d$ el costo de dividir y combinar fuera de la recursión.

## Ejemplos

**Recurrencia $T(N) = 2\,T(N/2) + \tfrac{N^4}{4}$.** Se identifican
$a = 2$, $b = 2$, $c = \tfrac14$, $d = 4$. Entonces $b^d = 2^4 = 16$ y como

$$a = 2 < 16 = b^d \implies T(N) = O(N^4)$$

**Recurrencia $T(N) = 2\,T(N/2) + 5N$** (aparece como el `Times(N)` de un algoritmo en un
parcial). Aquí $a = 2$, $b = 2$, $d = 1$, luego $b^d = 2^1 = 2$ y

$$a = 2 = 2 = b^d \implies T(N) = O(N \log N)$$

**Búsqueda binaria.** La versión recursiva descarta la mitad del arreglo en cada paso con
trabajo constante fuera de la recursión: $T(n) = T(n/2) + c$. Con $a = 1$, $b = 2$, $d = 0$
se tiene $b^d = 2^0 = 1$, y como $a = b^d$ resulta $T(n) = O(n^0 \log n) = O(\log n)$.

## Órdenes de referencia de sorts y búsqueda

Al clasificar algoritmos conviene tener a mano los órdenes de los métodos clásicos. La
comparativa asintótica de tiempo (mejor y peor caso) es:

| Algoritmo | Mejor CT | Peor CT |
|---|---|---|
| BubbleSort | $O(n)$ | $O(n^2)$ |
| MergeSort | $O(n \log n)$ | $O(n \log n)$ |
| QuickSort | $O(n \log n)$ | $O(n^2)$ |
| SelectionSort | $O(n^2)$ | $O(n^2)$ |

Para la **búsqueda binaria** sobre un arreglo ordenado ($O(\log n)$), separando la versión
iterativa de la recursiva:

| Complejidad | Iterativa | Recursiva |
|---|---|---|
| Temporal | $O(\log_2 N)$ | $O(\log_2 N)$ |
| Espacial | $O(1)$ | $O(\log_2 N)$ |

La versión recursiva paga espacio $O(\log_2 N)$ por la pila de llamadas, mientras que la
iterativa mantiene $O(1)$.

---

## Ver también

- [[01-big-o-y-ordenes]] — notación asintótica y jerarquía de órdenes
- [[03-analisis-de-algoritmos]] — dónde estas recurrencias aparecen en ejercicios resueltos
