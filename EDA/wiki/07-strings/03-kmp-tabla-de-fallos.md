---
tags: [teoria, unidad-7, strings, kmp, tabla-de-fallos, busqueda-de-patrones]
fuente: apuntes de la cursada 2024-2C (teórica, Práctico 21/8)
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# KMP y la tabla de fallos (`next`)

**KMP** (Knuth–Morris–Pratt) es un algoritmo de **búsqueda exacta de patrones**: encuentra las
apariciones de un patrón dentro de un texto sin volver atrás sobre el texto. La pieza clave que
se practica en la cursada es la **tabla de fallos** (`next`), que se precomputa a partir del
patrón.

## Qué guarda la tabla `next`

> **Definición.** Para un patrón dado, la tabla `next` asigna a cada posición la longitud del
> **prefijo más largo del patrón que además es sufijo** del fragmento leído hasta esa posición.

Ese valor es lo que permite a KMP, ante un desajuste, saber cuánto puede "saltar" el patrón sin
perder coincidencias parciales ya verificadas, en vez de reiniciar la comparación desde cero.

## Ejemplo: `ABRACADABRA`

Se recorre el patrón carácter por carácter y se completa la fila `next`:

| carácter | A | B | R | A | C | A | D | A | B | R | A |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `next` | 0 | 0 | 0 | 1 | 0 | 1 | 0 | 1 | 2 | 3 | 4 |

Los valores crecen sobre el final (`… A B R A` → `1, 2, 3, 4`) porque el patrón vuelve a
empezar con `ABRA`: ese prefijo `ABRA` reaparece como sufijo, y la tabla lo registra.

## Ejemplo: `SASS`

| carácter | S | A | S | S |
|---|---|---|---|---|
| `next` | 0 | 0 | 1 | 1 |

Acá el prefijo `S` reaparece como sufijo a partir del tercer carácter, de modo que las dos
últimas posiciones valen `1`.

> **Nota.** En los apuntes figura la tabla `next` ya resuelta para estos dos patrones
> (`ABRACADABRA` y `SASS`); el pseudocódigo del algoritmo de búsqueda no está transcripto en
> el material.

---

## Ver también

- [[07-strings/01-distancia-de-edicion-levenshtein]] — similaridad aproximada entre strings
- [[07-strings/02-string-matching-q-grams]] — string matching por tokens
- [[07-strings/04-lucene]] — indexado y búsqueda de texto a mayor escala
