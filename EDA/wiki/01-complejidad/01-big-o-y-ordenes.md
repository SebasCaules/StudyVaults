---
tags: [teoria, unidad-1, complejidad, big-o, notacion-asintotica]
fuente: apuntes de la cursada 2024-2C (teórica, Clase 3)
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Notación Big-O y órdenes de complejidad

El análisis de complejidad busca describir cómo crece el costo de un algoritmo —en
tiempo y en espacio— a medida que crece el tamaño de la entrada $N$. Se cuenta el número
de operaciones $T(N)$ y luego se lo clasifica con la notación asintótica $O(\cdot)$.

## Contar operaciones: $T(\text{algo})$

Para estimar el costo temporal se cuentan las operaciones que ejecuta el algoritmo en
función de $N$. Por ejemplo, sobre el siguiente método que busca el máximo de un arreglo:

```java
public class AlgoA {
    public static int max(int[] array) {
        if (array == null || array.length == 0)      // 3 operaciones fijas
            throw new RuntimeException("Empty array");

        int candidate = array[0];
        for (int rec = 1; rec < array.length; rec++)  // 1 comparación + 1 suma +
            if (candidate < array[rec])               // 1 comparación, N-1 veces
                candidate = array[rec];

        return candidate;
    }
}
```

Hay 3 operaciones fijas al inicio y el cuerpo del `for` (una comparación de guarda, la
suma del incremento y la comparación del `if`) se ejecuta $N-1$ veces. Sumando:

$$T(\text{algoA}) = 3 + 3 \cdot (N - 1) = 3N$$

donde $N$ es la longitud del arreglo.

## Definición formal de Big-O

Una vez obtenido $T(N)$, la notación $O$ da una cota superior de su crecimiento.

> **Definición (Big-O).** Sean $T(N)$ y $g(N)$ funciones con $N > 0$. Se dice que $T(N)$
> es $O(g(N))$ si existen una constante $c > 0$ (que no depende de $N$) y un $n_0 > 0$ tales que
> $$\forall\, N \geq n_0 : \quad 0 \leq T(N) \leq c \cdot g(N)$$

La constante $c$ absorbe los coeficientes y $n_0$ deja de lado el comportamiento para
entradas chicas: solo importa la tasa de crecimiento para $N$ grande.

**Ejemplo.** Para `algoA` teníamos $T(N) = 3N$; supongamos incluso $T(N) = 1 + 3N$. Se
propone $g(N) = N$ y se busca $c$ tal que $0 \leq 1 + 3N \leq c\,N$. Dividiendo por $N$:

$$0 \leq \frac{1}{N} + 3 \leq c$$

- Si $N = 2 \Rightarrow c \geq 3{,}5$.
- Si $N = 5 \Rightarrow c \geq 3{,}2$.
- Si $N \to \infty \Rightarrow c \geq 3$.

Existe entonces una constante que satisface la definición, así que el orden de `algoA`
es $O(N)$.

## Jerarquía de órdenes

Los órdenes de complejidad más frecuentes se ordenan de menor a mayor crecimiento así:

$$O(1) < O(\log_2 N) < O(\sqrt{N}) < O(N) < O(N \log_2 N) < O(N^2) < O(N^3) < O(2^N) < O(N!)$$

Los órdenes a partir de $O(N^3)$ (y sobre todo $O(2^N)$ y $O(N!)$) se consideran
**inaplicables** en la práctica: crecen tan rápido que el algoritmo se vuelve inviable
salvo para entradas muy chicas.

Al clasificar $T(N)$ se conserva únicamente el término dominante y se descartan
coeficientes y términos de menor orden:

| $T(N)$ | Orden |
|---|---|
| $6N + 2$ | $O(N)$ |
| $2N^3 + 100\,N^2$ | $O(N^3)$ |
| $2^N + N^3$ | $O(2^N)$ |
| $N + 6 \log_{10} N$ | $O(N)$ |

## Complejidad espacial

De forma análoga al tiempo, la **complejidad espacial** $S(\text{algo})$ cuenta las
unidades de memoria auxiliar que usa el algoritmo. Volviendo a `algoA`:

- `array` es un puntero a un arreglo ya alocado: cuenta como 1 unidad.
- `candidate`: 1 unidad.
- `rec`: 1 unidad.

$$S(\text{algoA}) = 3 \implies O(1)$$

El espacio usado es constante: no depende de $N$.

### Algoritmo superador

La comparación entre algoritmos combina ambas complejidades.

> **Definición.** Cuando un algoritmo le gana a otro **espacial y temporalmente** se dice
> que es **superador**. Por ejemplo, si `algoB` resuelve el mismo problema con complejidad
> temporal $O(\log N)$ o $O(N)$ pero necesita más memoria, y `algoA` es $O(N)$ con
> $S = O(1)$, entonces `algoA` gana espacialmente.

---

## Ver también

- [[02-teorema-maestro]] — clasificar el costo de algoritmos recursivos divide y vencerás
- [[03-analisis-de-algoritmos]] — ejercicios resueltos de conteo de operaciones y sumatorias
