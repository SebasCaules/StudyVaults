---
tags: [teoria, unidad-4, conteo, combinaciones, numero-combinatorio]
fuente: raw/4-parciales-finales/algebra.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Conteo y combinaciones

Unidad de **Combinatoria**. En los apuntes de la cursada 2023-1C esta unidad no aparece
como sección teórica propia: sus herramientas se ven **en acción** dentro de los parciales
resueltos, casi siempre acopladas a una [[01-relaciones/02-clasificacion-y-equivalencia|relación de equivalencia]]
donde hay que **contar cuántos elementos tiene una clase** o **cuántas clases hay**. Esta
página reúne esas herramientas —las dos reglas de conteo y el número combinatorio— y las
sigue paso a paso sobre el ejercicio que las usa. Las combinaciones con repetición se tratan
aparte en [[02-combinaciones-con-repeticion]].

## Las dos reglas de conteo

Todo el conteo de los parciales se apoya en dos reglas elementales, que en los apuntes se
usan sin nombrarlas explícitamente pero que conviene aislar.

**Principio del producto.** Si una configuración se arma tomando una decisión con $a$
opciones y **luego** otra con $b$ opciones (independientes entre sí), la cantidad total de
configuraciones es el producto:

$$\#\text{total} = a \cdot b$$

donde $a$ es la cantidad de opciones de la primera decisión y $b$ la de la segunda. Se
extiende a cualquier número de decisiones encadenadas.

**Principio de la suma.** Si los casos posibles se parten en grupos **disjuntos** (sin
solapamiento), el total es la suma de lo que aporta cada grupo:

$$\#\text{total} = c_1 + c_2 + \dots + c_m$$

donde $c_i$ es la cantidad de configuraciones del grupo $i$. La clave es que los grupos no
compartan elementos, para no contar dos veces.

## Número combinatorio

La pieza central del conteo de estos parciales es el **número combinatorio** $\binom{n}{k}$,
que aparece una y otra vez en las resoluciones.

> **Definición (número combinatorio).** Dado un conjunto de $n$ elementos, $\binom{n}{k}$
> cuenta cuántos **subconjuntos de $k$ elementos** se pueden elegir de él (sin importar el
> orden y sin repetir). Su valor es
> $$\binom{n}{k} = \frac{n!}{k!\,(n-k)!}$$
> donde $n$ es el tamaño del conjunto total, $k$ el tamaño del subconjunto que se elige y
> $n! = n\,(n-1)\cdots 2 \cdot 1$ el factorial.

Los valores que aparecen en el parcial salen de esta cuenta: elegir $1$ posición entre $4$
da $\binom{4}{1} = 4$; elegir $2$ entre $4$ da $\binom{4}{2} = 6$; elegir $3$ entre $4$ da
$\binom{4}{3} = 4$.

**Observación.** El orden no cuenta: elegir las posiciones $\{1,3\}$ es el mismo subconjunto
que elegir $\{3,1\}$. Por eso se usa el número combinatorio y no un conteo con orden.

## Ejemplo resuelto: contar los elementos de una clase

El ejercicio modelo (Recuperatorio 1P, 2011) combina relación de equivalencia con conteo.
Sea $X$ el conjunto de las **cadenas de $8$ bits** $x = x_1 x_2 \dots x_8$, con cada
$x_k \in \{0, 1\}$, y la relación

$$x \, R \, y \iff \sum_{k=1}^{8} (-1)^k x_k = \sum_{k=1}^{8} (-1)^k y_k$$

donde $(-1)^k$ vale $-1$ en las posiciones impares y $+1$ en las pares. Como $R$ iguala el
valor de una misma función aplicada a $x$ y a $y$, es **reflexiva, simétrica y transitiva**:
una relación de equivalencia.

### Paso 1 — traducir la condición de la clase

La clase de la cadena nula $[00000000]$ son las $x$ con
$\sum_{k=1}^{8} (-1)^k x_k = 0$. Desarrollando la suma alternada,

$$-x_1 + x_2 - x_3 + x_4 - x_5 + x_6 - x_7 + x_8 = 0,$$

que se reordena como una igualdad entre las posiciones pares y las impares:

$$x_2 + x_4 + x_6 + x_8 = x_1 + x_3 + x_5 + x_7.$$

Como cada $x_k$ es $0$ o $1$, cada lado es simplemente **la cantidad de unos** entre sus $4$
posiciones. La condición pide que haya la **misma cantidad de unos** en las $4$ posiciones
pares que en las $4$ impares.

### Paso 2 — partir en casos disjuntos (principio de la suma)

Se agrupan las cadenas según ese número común $j$ de unos por lado, $j = 0, 1, 2, 3, 4$. Los
casos son disjuntos, así que el total es la suma de todos ellos.

### Paso 3 — contar cada caso (principio del producto + combinaciones)

Para un $j$ fijo, hay que **elegir $j$ posiciones con uno entre las $4$ pares** y, de forma
independiente, **$j$ entre las $4$ impares**. Por el principio del producto, ese caso aporta
$\binom{4}{j}\binom{4}{j}$:

| Unos por lado $j$ | Cuenta $\binom{4}{j}\binom{4}{j}$ | Valor |
|---|---|---|
| $0$ | $1 \cdot 1$ | $1$ |
| $1$ | $\binom{4}{1}\binom{4}{1} = 4 \cdot 4$ | $16$ |
| $2$ | $\binom{4}{2}\binom{4}{2} = 6 \cdot 6$ | $36$ |
| $3$ | $\binom{4}{3}\binom{4}{3} = 4 \cdot 4$ | $16$ |
| $4$ | $1 \cdot 1$ | $1$ |

Sumando los cinco casos disjuntos:

$$\#[00000000] = 1 + 16 + 36 + 16 + 1 = 70.$$

La clase de la cadena nula tiene $70$ elementos.

## Contar cuántas clases hay

La otra pregunta habitual es **cuántas clases** define la relación. Como cada clase queda
determinada por el valor de la suma alternada, basta contar los valores posibles de

$$v = \sum_{k=1}^{8} (-1)^k x_k = (\#\text{unos en posiciones pares}) - (\#\text{unos en posiciones impares}).$$

Cada término va de $0$ a $4$, así que $v$ recorre los enteros de $-4$ a $4$:

$$v \in \{\,0,\ \pm 1,\ \pm 2,\ \pm 3,\ \pm 4\,\}.$$

Son $9$ valores distintos, de modo que la relación tiene **$9$ clases de equivalencia**.

> **Nota.** El mismo patrón —una clase por cada valor de un invariante— aparece en otro
> parcial con la relación $n \, R \, m \iff n^2 - 100n = m^2 - 100m$, cuya clase es
> $[n] = \{\, n,\ 100 - n \,\}$ y que da $51$ clases. El conteo de clases es contar los
> valores que puede tomar el invariante que las distingue.

---

## Ver también

- [[02-combinaciones-con-repeticion]] — repartir objetos idénticos en cajas: $\binom{n+k-1}{n}$
- [[01-relaciones/02-clasificacion-y-equivalencia]] — clases de equivalencia y conjunto cociente, el marco donde el conteo se aplica
