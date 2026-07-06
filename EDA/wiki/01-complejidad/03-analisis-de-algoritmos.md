---
tags: [resuelto, unidad-1, complejidad, sumatorias, analisis-de-algoritmos]
fuente: apuntes de la cursada 2024-2C (parciales resueltos)
unidad: 1
tipo: resuelto
actualizado: 2026-07-05
---

# Análisis de algoritmos: ejercicios resueltos

Colección de ejercicios de parciales resueltos donde el objetivo es calcular la
complejidad temporal y espacial de un fragmento de código, clasificarlo por su orden $O$
y ordenar algoritmos por tasa de crecimiento. Aplica lo de [[01-big-o-y-ordenes]] y
[[02-teorema-maestro]].

## Sumatorias y sumatoria de Gauss

Un patrón muy frecuente es el de dos bucles anidados, cuyo conteo se resuelve con una
sumatoria. Sobre este método de ordenamiento (`AlgoSorting`, con `A.length = N`):

```java
static <T extends Comparable<T>> void AlgoSorting(T[] A) {
    for (int i = 0; i < A.length - 1; i++)
        for (int j = 1; j < A.length - i; j++)
            if (A[j-1].compareTo(A[j]) > 0) {
                T auxi = A[j-1];
                A[j-1] = A[j];
                A[j] = auxi;
            }
}
```

**Complejidad temporal.** El `if` interno hace 2 comparaciones y el `for` interno se
repite $N - i - 1$ veces para cada $i$, más las $N + 1$ guardas del `for` externo. Sumando
sobre $i$:

$$T(N) = \sum_{i=0}^{N-1} \big[\, 2(N - i - 1) + 1 \,\big] + (N + 1)$$

Reindexando y usando la **sumatoria de Gauss** $\displaystyle\sum_{k=0}^{N-1} k = \frac{N(N+1)}{2}$:

$$T(N) = 2 \cdot \frac{N(N+1)}{2} + N + (N + 1) = N^2 + 3N + 1 \implies O(N^2)$$

**Complejidad espacial.** Solo se usan `auxi`, `i` y `j` más el costo de `compareTo`:

$$S(N) = 3 + S(\text{compareTo}) = 4 \implies O(1)$$

Un algoritmo de ordenamiento con mejor complejidad temporal es **Merge Sort**, $O(N \log N)$.

## Búsqueda binaria (`findAuxi`)

El método `findAuxi` implementa una búsqueda binaria sobre un arreglo ordenado:

```java
static private boolean find(int[] array, int element) {
    if (array == null || array.length == 0)
        throw new IllegalArgumentException("Dim must be > 0");
    return findAuxi(array, 0, array.length - 1, element);
}

static private boolean findAuxi(int[] array, int left, int right, int element) {
    while (left <= right) {
        int middle = (right + left) / 2;
        if (element == array[middle])
            return true;
        if (element < array[middle])
            right = middle - 1;
        else
            left = middle + 1;
    }
    return false;
}
```

Como descarta la mitad del rango en cada iteración: complejidad temporal $O(\log n)$ y
complejidad espacial $O(1)$ (versión iterativa, sin pila de recursión).

> **Nota.** En el original varias líneas del cuerpo del `while` estaban tapadas con
> corrector; el cuerpo se reconstruyó como la búsqueda binaria estándar *(reconstrucción
> del original)*.

## Hallar el repetido in-place

Dado un arreglo con valores entre $1$ y `length - 1` donde hay un elemento repetido, se
lo puede encontrar en tiempo $O(n)$ y espacio $O(1)$ **modificando** el vector (usando el
signo de cada posición como marca de "visitado"):

```java
static public int calculateRepeatedV1(int[] datos) {
    int pxma = 0;
    while (datos[Math.abs(datos[pxma])] > 0) {   // looking forward
        pxma = Math.abs(datos[pxma]);            // un movimiento
        datos[pxma] = -datos[pxma];              // marca de visitado
    }
    return Math.abs(datos[pxma]);
}
```

La idea: se parte de `pxma = 0` y se usan los valores del vector como índices de las
posiciones a visitar. Antes de visitar una posición se la niega. Si al llegar a una
posición su valor ya es **negativo**, es que se pasó antes por ahí: ese es el repetido
(se devuelve en positivo). Si es **positivo**, se avanza y se lo niega para marcarlo.

Traza sobre `[1, 2, 3, 4, 4, 5, 6, 7]`: se visitan las posiciones $0 \to 1 \to 2 \to 3
\to 4$, negando cada una ($-1, -2, -3, -4$), hasta detectar que la posición $4$ ya fue
visitada. El valor repetido es $4$.

- Complejidad temporal: $T(n) = n + 1 \implies O(n)$.

La variante `calculateRepeatedV2` **restaura** el vector al final volviendo a positivar
las posiciones marcadas:

```java
    // ... igual que V1 hasta hallar pxma ...
    pxma = Math.abs(datos[pxma]);
    for (int rec = 0; rec < datos.length; rec++)
        if (datos[rec] < 0)
            datos[rec] = -datos[rec];
    return pxma;
```

Agrega una pasada extra: $T(n) = (n + 1) + n = 2n + 1 \implies O(n)$.

## Clasificar y ordenar por tasa de crecimiento

Dado el `Times(N)` de cada algoritmo, se calcula su orden $O$:

| Algoritmo | $Times(N)$ | Orden |
|---|---|---|
| AlgoA | $\log N$ | $O(\log N)$ |
| AlgoB | $N \log N$ | $O(N \log N)$ |
| AlgoC | $2\,Times(N/2) + 5N$ | $O(N \log N)$ |
| AlgoD | $N^{34}$ | $O(N^{34})$ |
| AlgoE | $3 \log N$ | $O(\log N)$ |
| AlgoF | $2^{9}$ | $O(2^{9})$ (constante) |

AlgoC se resuelve con el [[02-teorema-maestro|Teorema Maestro]] ($a = b^d = 2$). Ordenando
de forma **ascendente** por tasa de crecimiento —los de igual tasa comparten celda—:

| 0 | 1 | 2 | 3 |
|---|---|---|---|
| $2^{9}$ | $\log N$ ; $3 \log N$ | $N \log N$ | $N^{34}$ |

El término $2^9$ es una constante, así que queda como el de menor crecimiento.

## Búsqueda: BST vs. arreglo ordenado

> **Afirmación (V/F).** "En un `BSTree` de enteros y en un arreglo ordenado, buscar un
> entero tiene complejidad $O(\log N)$."

**Falso.** En un `BSTree` el peor caso (árbol degenerado) es $O(n)$, no $O(\log N)$.

Complejidades temporales de peor caso de operaciones sobre arreglos y AVL:

| Operación | Peor caso |
|---|---|
| Buscar en arreglo **ordenado** (búsqueda binaria) | $O(\log N)$ |
| Buscar el **máximo** en arreglo ordenado (es `arr[N-1]`) | $O(1)$ |
| Buscar en arreglo **desordenado** (recorrer todo) | $O(N)$ |
| Buscar en árbol **AVL** | $O(\log N)$ |
| Insertar en arreglo ordenado sin realocar, manteniendo el orden | $O(\log N)$ *(ver nota)* |

> **Nota.** La resolución original responde el último ítem como "ídem" a la búsqueda
> binaria ($O(\log N)$) *(dudoso en el original)*; ubicar la posición es $O(\log N)$, pero
> insertar manteniendo el orden implica además desplazar elementos.

---

## Ver también

- [[01-big-o-y-ordenes]] — definición de Big-O y complejidad espacial
- [[02-teorema-maestro]] — recurrencias divide y vencerás (usado en AlgoC y búsqueda binaria)
