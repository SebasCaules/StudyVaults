---
tags: [teoria, unidad-7, strings, levenshtein, distancia-de-edicion]
fuente: apuntes de la cursada 2024-2C (teórica, Clase 4)
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Distancia de edición de Levenshtein

Dentro del procesamiento de strings, una de las preguntas típicas es **cuán parecidas son
dos palabras**. La distancia de Levenshtein mide esa similaridad como una **distancia de
edición**: cuántas operaciones elementales hacen falta para transformar una cadena en la otra.

## Idea

> **Definición.** La distancia de Levenshtein entre dos strings es la cantidad mínima de
> operaciones de edición (inserciones, borrados y sustituciones de un carácter) necesarias
> para convertir una cadena en la otra.

En la cursada se calcula con una **matriz de edición**: una tabla que enfrenta los caracteres
de una palabra en las columnas y los de la otra en las filas. La primera fila y la primera
columna se inicializan con $0, 1, 2, 3, \dots$ (el costo de construir un prefijo desde la
cadena vacía), y cada celda interior se completa a partir de sus vecinas de arriba, izquierda
y diagonal. El valor de la **celda inferior derecha** es la distancia de edición buscada.

## Ejemplo de la práctica

En clase se completó la matriz de edición entre dos palabras y el resultado —marcado en la
esquina inferior derecha— fue una distancia de edición de:

$$\text{Levenshtein}(str_1, str_2) = 6$$

La tabla se inicializa con la fila y la columna de índices creciendo de a uno desde la cadena
vacía (fila superior $0, 1, 2, 3, 4, 5, 6$; columna izquierda $0, 1, 2, \dots, 8$) y se rellena
celda a celda hasta llegar al valor final $6$.

> **Nota.** La matriz del ejemplo está resuelta a mano en los apuntes; las dos palabras
> comparadas y varios de los valores interiores son de lectura dudosa en el original. Lo que
> sí queda claro es el resultado circulado: la distancia de edición vale $6$.

## Normalización a $[0, 1]$

La distancia absoluta depende del largo de las palabras, así que conviene **normalizarla** a
un valor entre $0$ y $1$ para comparar de forma homogénea. La normalización que se usa en la
cursada es:

$$\text{Levenshtein}_{norm}(str_1, str_2) = 1 - \frac{\text{Levenshtein}(str_1, str_2)}{\max\{\,\text{length}(str_1),\ \text{length}(str_2)\,\}}$$

donde $\text{Levenshtein}(str_1, str_2)$ es la distancia de edición (el valor de la matriz) y
$\max\{\text{length}(str_1), \text{length}(str_2)\}$ es la longitud de la más larga de las dos
palabras. Así, $1$ significa cadenas idénticas y valores cercanos a $0$ indican palabras muy
distintas.

## Dónde encaja

Levenshtein es el representante de las medidas de similaridad **de edición**. Es una de las
familias de algoritmos de procesamiento de strings junto con las medidas **de tokens** (como
los [[07-strings/02-string-matching-q-grams|Q-grams]]), las **fonéticas** y las **dependientes
del dominio** (ver la taxonomía de similaridad en la página de Q-grams).

---

## Ver también

- [[07-strings/02-string-matching-q-grams]] — otra familia de similaridad (de tokens) y la taxonomía general
- [[07-strings/03-kmp-tabla-de-fallos]] — búsqueda exacta de patrones con la función de fallo
