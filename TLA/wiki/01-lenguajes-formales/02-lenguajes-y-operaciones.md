---
tags: [teoria, unidad-1, lenguajes-formales, operaciones]
fuentes:
  - raw/teoricas/tla-teorica.pdf
  - raw/practicas/tla-practica.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Lenguajes formales y operaciones sobre lenguajes

Sobre los alfabetos y cadenas de [[01-alfabetos-cadenas-clausuras]] se construye la noción de
**lenguaje formal**: un conjunto de cadenas. Esta página define el lenguaje y las operaciones
que se le aplican (unión, producto, clausura y reversa).

## Lenguaje formal

> **Definición.** Un **lenguaje** $L$ sobre un alfabeto $\Sigma$ es un subconjunto de la
> clausura estrella: $L \subseteq \Sigma^*$. Puede ser **finito** o **infinito**.

Un lenguaje suele darse **por comprensión**, describiendo la forma de sus cadenas. Por ejemplo,
con $\Sigma = \{0, 1\}$:

$$L = \{\, w \in \Sigma^* : w = 0^n 1^n,\ n \geq 0 \,\} = \{\lambda, 01, 0011, 000111, \dots\}$$

donde $0^n1^n$ es la cadena de $n$ ceros seguidos de $n$ unos.

### Lenguajes por comprensión

La siguiente tabla lista algunos lenguajes definidos por comprensión y cadenas que les
pertenecen (con $\Sigma = \{a, b, c, d\}$ donde haga falta):

| Lenguaje | Definición | Cadenas de ejemplo |
|---|---|---|
| $L_1$ | $\{\, 0^n 1^n : n > 0 \,\}$ | $01,\ 0011,\ 000111$ |
| $L_2$ | $\{\, 0^i 1^j : 0 \leq i \leq j \,\}$ | $\lambda,\ 01,\ 011$ |
| $L_3$ | $\{\, x \in \Sigma^* : x \text{ contiene } ab \text{ y no contiene } bc \,\}$ | $ab,\ aab,\ abd$ |
| $L_4$ | $\{\, a^n b^m d^{m+n} : n, m \geq 0 \,\}$ | $\lambda,\ ad,\ abdd$ |

> **Nota.** En $L_1$ la condición es $n > 0$, así que $\lambda$ (que corresponde a $n = 0$)
> **no** pertenece — aunque la práctica resuelta de la cursada la incluya por error. En cambio
> $L_2$ sí contiene $\lambda$, porque admite $i = j = 0$.

## Operaciones sobre lenguajes

Como los lenguajes son conjuntos de cadenas, se combinan con operaciones de conjuntos y con
operaciones específicas de cadenas.

> **Definiciones.** Sean $L, L_1, L_2 \subseteq \Sigma^*$.
> i) **Unión:** $L_1 \cup L_2 = \{\, w : w \in L_1 \text{ o } w \in L_2 \,\}$.
> ii) **Concatenación (producto):** $L_1 L_2 = \{\, xy : x \in L_1,\ y \in L_2 \,\}$.
> iii) **Potencia:** $L^0 = \{\lambda\}$, $L^1 = L$ y $L^k = L\, L^{k-1}$ para $k \geq 1$.
> iv) **Clausura de Kleene:** $L^* = \bigcup_{i \geq 0} L^i = \{\lambda\} \cup L \cup L^2 \cup \cdots$.
> v) **Clausura positiva:** $L^+ = \bigcup_{i \geq 1} L^i$.
> vi) **Reversa:** $L^r = \{\, w^r : w \in L \,\}$, el conjunto de los reversos de las cadenas de $L$.

**Observación.** La concatenación de lenguajes es análoga a un producto cartesiano: empareja
cada cadena del primer lenguaje con cada cadena del segundo y las concatena.

### Ejemplos

Con $L_1 = \{ab, ac, ad\}$ y $L_2 = \{abc, bac, ab\}$:

$$L_1 \cup L_2 = \{ab, ac, ad, abc, bac\}$$

$$L_1^r = \{ba, ca, da\}$$

$$L_1^* = \{\lambda,\ ab,\ ac,\ ad,\ abab,\ abac,\ abad,\ acab,\ acac,\ acad,\ adab,\ \dots\}$$

Con $\Sigma_1 = \{a, b\}$ y $\Sigma_2 = \{b, c\}$ (tratados como lenguajes de una sola letra):

| Operación | Resultado |
|---|---|
| $\Sigma_1 \cup \Sigma_2$ | $\{a, b, c\}$ |
| $\Sigma_1 \cdot \Sigma_2$ | $\{ab, ac, bb, bc\}$ |
| $\Sigma_1 \cdot \Sigma_2^+$ | $\{a, b\} \cdot \{b, c, bb, bc, cb, cc, \dots\}$ |
| $(\Sigma_1 \cdot \Sigma_2)^*$ | $\{\lambda\} \cup \{ab, ac, bb, bc\}^+$ |

## Ver también

- [[01-alfabetos-cadenas-clausuras]] — alfabetos, cadenas, potencias y clausuras $\Sigma^+$, $\Sigma^*$
- [[index]] — índice del vault de TLA
