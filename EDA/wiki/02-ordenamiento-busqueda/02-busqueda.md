---
tags: [teoria, unidad-2, busqueda, busqueda-binaria, cotas]
fuente: apuntes de la cursada 2024-2C (parciales resueltos)
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Búsqueda

Página de referencia sobre el problema de **buscar un elemento** y su costo según la
estructura de datos. El caso central es la **búsqueda binaria** sobre un arreglo ordenado,
$O(\log n)$; el resto de la página compara el costo de buscar en un arreglo (ordenado o
desordenado) y en árboles de búsqueda. La implementación concreta de la búsqueda binaria
(`findAuxi`) se analiza línea por línea en [[01-complejidad/03-analisis-de-algoritmos]].

## Búsqueda binaria

> **Idea.** Sobre un arreglo **ordenado**, se compara el elemento buscado con el del medio
> y se descarta la mitad que no puede contenerlo, repitiendo sobre la mitad restante. Como
> el rango se parte a la mitad en cada paso, el costo es $O(\log_2 n)$.

La búsqueda binaria se implementa de forma **iterativa** o **recursiva**. Ambas versiones
comparten la cota temporal $O(\log_2 N)$, pero difieren en el espacio: la recursiva paga la
pila de llamadas.

| Complejidad | Iterativa | Recursiva |
|---|---|---|
| Temporal | $O(\log_2 N)$ | $O(\log_2 N)$ |
| Espacial | $O(1)$ | $O(\log_2 N)$ |

**Observación.** La versión iterativa es la preferida cuando importa el espacio: mantiene
punteros `left`/`right` y trabaja en $O(1)$ de memoria, mientras que la recursiva acumula
$O(\log_2 N)$ marcos en la pila.

De aquí sale la regla que se usa como referencia en los parciales:

> **Búsqueda en arreglo ordenado.** Con el arreglo ordenado, buscar un elemento cuesta
> $$O(\log n)$$

## Costo de buscar según la estructura

El costo de "buscar" depende de dónde estén los datos. La tabla reúne los casos que pide un
parcial típico, siempre en **peor caso**.

| Operación | Peor caso | Por qué |
|---|---|---|
| Insertar en arreglo ordenado (sin realocar) manteniéndolo ordenado | $O(\log n)$ | ubicar la posición por búsqueda binaria |
| Buscar un elemento en arreglo ordenado | $O(\log n)$ | búsqueda binaria |
| Buscar el máximo en arreglo ordenado | $O(1)$ | es el último: `max = arr[N-1]` |
| Buscar un elemento en arreglo desordenado | $O(n)$ | hay que recorrer toda la lista |
| Buscar un elemento en árbol AVL | $O(\log n)$ | el AVL está balanceado por construcción |

Buscar en un arreglo desordenado no admite atajos: se recorre linealmente hasta encontrarlo
o agotar el arreglo.

```java
for (int i = 0; i < N; i++)
    if (arr[i] == num)
        return; // encontrado en peor caso O(n)
```

## Búsqueda en árbol: AVL vs. BST vs. arreglo ordenado

Un punto de examen recurrente compara la búsqueda en un árbol binario de búsqueda contra un
arreglo ordenado:

> **Verdadero o Falso.** "Un BSTree de enteros y un arreglo ordenado de enteros tienen ambos
> complejidad de búsqueda $O(\log N)$."
>
> **Falso.** En el **peor caso** un BSTree degenerado (insertando en orden) se vuelve una
> lista encadenada y su búsqueda es $O(n)$. El arreglo ordenado sí garantiza $O(\log N)$ por
> búsqueda binaria.

La diferencia clave es el **balanceo**: un **AVL** garantiza $O(\log n)$ porque se
autobalancea, pero un BST **sin** balancear puede degenerar a $O(n)$. La justificación
detallada de este V/F está en [[01-complejidad/03-analisis-de-algoritmos]].

---

## Ver también

- [[01-ordenamiento]] — algoritmos de ordenamiento y sus cotas de complejidad
- [[01-complejidad/03-analisis-de-algoritmos]] — `findAuxi` (búsqueda binaria) y BST vs. arreglo, resueltos
- [[01-complejidad/01-big-o-y-ordenes]] — notación $O$ y jerarquía de órdenes
