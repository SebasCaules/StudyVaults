---
tags: [resuelto, unidad-1, relaciones, equivalencia, clases]
fuente: raw/4-parciales-finales/algebra.pdf
unidad: 1
tipo: resuelto
actualizado: 2026-07-05
---

# Relaciones de equivalencia — ejercicios resueltos

Ejercicios de parciales y finales que piden **probar que una relación es de equivalencia** y
**describir sus clases**. Cada uno usa la maquinaria de [[02-clasificacion-y-equivalencia]]:
verificar reflexividad $(R)$, simetría $(S)$ y transitividad $(T)$, y luego identificar el
invariante que define la clase $[a]$. Transcripción de los apuntes de la cursada 2023-1C.

## Suma alternada de bits

> **Ejercicio (recuperatorio 1.º parcial, 2011).** Sea $X$ el conjunto de las cadenas de $8$
> bits $x = (x_1, \dots, x_8)$ con $x_k \in \{0, 1\}$. Se define
> $$x\,R\,y \iff \sum_{k=1}^{8} (-1)^k x_k = \sum_{k=1}^{8} (-1)^k y_k.$$
> Probar que $R$ es de equivalencia, describir la clase $[00000000]$ y contar cuántas clases hay.

Llamemos $\sigma(x) = \sum_{k=1}^{8} (-1)^k x_k = -x_1 + x_2 - x_3 + x_4 - x_5 + x_6 - x_7 + x_8$ al
valor que la relación compara. Entonces $x\,R\,y \iff \sigma(x) = \sigma(y)$: la relación identifica
cadenas con el **mismo valor** de $\sigma$.

i) **Reflexiva:** $\sigma(x) = \sigma(x)$ para todo $x$, luego $x\,R\,x$.
ii) **Simétrica:** si $x\,R\,y$ entonces $\sigma(x) = \sigma(y)$, y por lo tanto $\sigma(y) = \sigma(x)$,
   es decir $y\,R\,x$.
iii) **Transitiva:** si $x\,R\,y$ e $y\,R\,z$ entonces $\sigma(x) = \sigma(y)$ y $\sigma(y) = \sigma(z)$,
   de donde $\sigma(x) = \sigma(z)$ y así $x\,R\,z$.

Cumple $(R)$, $(S)$ y $(T)$: es de equivalencia.

**Clase del cero.** La clase de la cadena nula reúne las cadenas con $\sigma = 0$:

$$[00000000] = \{\, x \in X : \sigma(x) = 0 \,\} = \{\, x \in X : x_2 + x_4 + x_6 + x_8 = x_1 + x_3 + x_5 + x_7 \,\}.$$

Es decir, tantos unos en las posiciones pares como en las impares (cuatro posiciones de cada
paridad). Contando por la cantidad común $j$ de unos a cada lado:

| $j$ (unos por lado) | Cadenas: $\binom{4}{j}\binom{4}{j}$ |
|---|---|
| $0$ | $1$ |
| $1$ | $\binom{4}{1}\binom{4}{1} = 16$ |
| $2$ | $\binom{4}{2}\binom{4}{2} = 36$ |
| $3$ | $\binom{4}{3}\binom{4}{3} = 16$ |
| $4$ | $1$ |

Sumando, $\left|[00000000]\right| = 1 + 16 + 36 + 16 + 1 = 70$.

**Cantidad de clases.** Lo que identifica cada clase es el valor $\sigma(x)$. Como hay cuatro
posiciones impares (que restan) y cuatro pares (que suman), $\sigma$ recorre desde $-4$ hasta $+4$:

$$\sigma(x) \in \{\, 0, \pm 1, \pm 2, \pm 3, \pm 4 \,\}.$$

Son $9$ valores posibles, así que $R$ tiene **$9$ clases**.

## Suma de coordenadas de una quíntupla

> **Ejercicio (final, 20 de febrero de 2020).** Sea $X = A^5$ el conjunto de las quíntuplas
> $x = (x_1, \dots, x_5)$ con entradas en $A = \{0, 1, 2, 3, 4, 5\}$. Se define
> $$x\,R\,z \iff \sum_{i=1}^{5} (x_i - z_i) = 0.$$
> Probar que $R$ es de equivalencia.

La condición equivale a que $x$ y $z$ tengan la **misma suma de coordenadas**, ya que
$\sum_i (x_i - z_i) = 0 \iff \sum_i x_i = \sum_i z_i$.

i) **Reflexiva:** $\sum_{i=1}^{5} (x_i - x_i) = \sum_{i=1}^{5} 0 = 0$, luego $x\,R\,x$.
ii) **Simétrica:** si $x\,R\,z$ entonces $\sum_i (x_i - z_i) = 0$; multiplicando por $-1$,
   $\sum_i (z_i - x_i) = 0$, es decir $z\,R\,x$.
iii) **Transitiva:** si $x\,R\,z$ y $z\,R\,w$ entonces $\sum_i x_i = \sum_i z_i$ y
   $\sum_i z_i = \sum_i w_i$, de donde $\sum_i x_i = \sum_i w_i$ y por lo tanto
   $\sum_i (x_i - w_i) = 0$, esto es $x\,R\,w$.

Cumple $(R)$, $(S)$ y $(T)$: $R$ es de equivalencia. Las clases quedan indexadas por el valor
común de la suma $\sum_i x_i$.

## Cuadrática desplazada

> **Ejercicio (parcial).** Sobre un conjunto de enteros se define
> $$n\,R\,m \iff n^2 - 100\,n = m^2 - 100\,m.$$
> Probar que es de equivalencia y describir sus clases.

Escribiendo $f(n) = n^2 - 100\,n$, la relación es $n\,R\,m \iff f(n) = f(m)$, de nuevo del tipo
"tener el mismo valor bajo una función".

i) **Reflexiva:** $f(n) = f(n)$, luego $n\,R\,n$.
ii) **Simétrica:** $f(n) = f(m) \Rightarrow f(m) = f(n)$, luego $n\,R\,m \Rightarrow m\,R\,n$.
iii) **Transitiva:** $f(n) = f(m)$ y $f(m) = f(r)$ dan $f(n) = f(r)$, luego $n\,R\,r$.

Es de equivalencia. Conviene notar que **no** es antisimétrica: por ejemplo $49\,R\,51$ porque
$49^2 - 100\cdot 49 = 51^2 - 100\cdot 51$, y sin embargo $49 \neq 51$ — lo que confirma que se trata
de una equivalencia genuina y no de un orden.

**Clases.** Igualando $f(n) = f(m)$ y factorizando:

$$n^2 - 100\,n = m^2 - 100\,m \iff (n - m)(n + m) = 100\,(n - m) \iff (n - m)(n + m - 100) = 0.$$

Por lo tanto $n = m$ o bien $n + m = 100$, y la clase de $n$ es

$$[n] = \{\, n, \ 100 - n \,\}.$$

Cada clase junta un entero con su "reflejado" respecto de $50$. El apunte registra $51$ clases,
lo que corresponde a tomar el dominio $\{0, 1, \dots, 100\}$: los pares $\{n, 100 - n\}$ para
$n = 0, \dots, 49$ dan $50$ clases y $\{50\}$ (punto fijo) aporta una más.

> **Nota.** El enunciado del dominio no quedó legible en el original; se infiere $\{0, 1, \dots, 100\}$
> a partir de las $51$ clases anotadas. La descripción $[n] = \{n, 100 - n\}$ es independiente del
> dominio exacto. *(dominio dudoso en el original.)*

---

## Ver también

- [[02-clasificacion-y-equivalencia]] — propiedades $(R)(S)(A)(T)$, equivalencia, clases y cociente
- [[01-familias-y-relaciones]] — definición de relación, producto cartesiano e inversa
