---
tags: [teoria, unidad-7, strings, string-matching, q-grams, similaridad]
fuente: apuntes de la cursada 2024-2C (teórica, Clase 5)
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# String matching con Q-grams

Los **Q-grams** son una técnica de *string matching* que mide la similaridad entre dos
palabras cortándolas en fragmentos de longitud fija. A diferencia de la
[[07-strings/01-distancia-de-edicion-levenshtein|distancia de edición]], que trabaja carácter
a carácter, los Q-grams comparan **conjuntos de subcadenas** (tokens).

## Qué es un Q-gram

> **Definición.** Un Q-gram es un fragmento del string de longitud $Q$. Fijado un $Q$, se
> secciona la palabra en todos sus pedazos de largo $Q$ y el conjunto de esos pedazos
> caracteriza a la palabra.

Para armar los Q-grams de los bordes se agregan caracteres de relleno (`#`). Por ejemplo, para
la palabra **John**, tomando $Q = 1$, $Q = 2$ y $Q = 3$:

| $Q$ | Q-grams de `John` |
|---|---|
| $1$ | `'J'`, `'O'`, `'H'`, `'N'` |
| $2$ | `'#J'`, `'JO'`, `'OH'`, `'HN'`, `'N#'` |
| $3$ | `'##J'`, `'#JO'`, `'JOH'`, `'OHN'`, `'HN#'`, `'N##'` |

El conjunto completo `Q-grams(John)` reúne los tres bloques (con $Q=1$, $2$ y $3$).

## Distancia entre dos palabras

Para comparar dos palabras se generan sus Q-grams y se observan **cuáles tienen en común**.
Por ejemplo, entre `John` y `Joe` los Q-grams compartidos son:

$$\{\,\texttt{'J'},\ \texttt{'O'},\ \texttt{'\#J'},\ \texttt{'JO'},\ \texttt{'\#\#J'},\ \texttt{'\#JO'}\,\}$$

Son $6$ Q-grams en común, y en el apunte se anota $\text{distancia}(\text{John}, \text{Joe}) = 6$.

> **Nota.** En los apuntes la palabra "distancia" se usa aquí para el número de Q-grams
> compartidos entre las dos palabras (los que no coinciden aparecen tachados en cada conjunto).

## Normalización a $[0, 1]$

Para llevar la medida a un rango comparable $[0, 1]$ se usan **directamente tri-grams
($Q = 3$) no posicionales**. La fórmula normalizada es:

$$\text{Q-Gram}(str_1, str_2) = \frac{\#TG(str_1) + \#TG(str_2) - \#TG_{\text{NoShared}}(str_1, str_2)}{\#TG(str_1) + \#TG(str_2)}$$

donde:

- $\#TG(str_x)$ es la cantidad de tri-grams que se generan para la palabra $str_x$.
- $\#TG_{\text{NoShared}}(str_1, str_2)$ es la cantidad de tri-grams que **no** matchean entre
  las dos palabras.

## Taxonomía de similaridad entre strings

Cerrando el tema de procesamiento de strings, los algoritmos vistos se agrupan según la clase
de similaridad que miden. Todos cuelgan de la noción central de **Similaridad**:

| Familia | Representantes |
|---|---|
| De edición | Levenshtein, Jaro |
| De tokens | G-grams / Q-grams |
| Fonéticos | Soundex, Metaphone |
| Dependientes del dominio | Fechas, Números |

Levenshtein es el representante de las medidas **de edición**; los Q-grams, de las medidas
**de tokens**. Las fonéticas (Soundex, Metaphone) comparan por sonido y las dependientes del
dominio explotan la estructura del dato (fechas, números).

---

## Ver también

- [[07-strings/01-distancia-de-edicion-levenshtein]] — medida de similaridad de edición
- [[07-strings/03-kmp-tabla-de-fallos]] — búsqueda exacta de un patrón en un texto
- [[07-strings/04-lucene]] — tokenización e indexado de texto
