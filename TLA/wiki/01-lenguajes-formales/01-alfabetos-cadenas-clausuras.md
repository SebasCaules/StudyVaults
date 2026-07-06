---
tags: [teoria, unidad-1, alfabetos, cadenas, clausuras]
fuentes:
  - raw/teoricas/tla-teorica.pdf
  - raw/practicas/tla-practica.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Alfabetos, cadenas y clausuras

Los objetos básicos de la teoría de lenguajes son los **símbolos**, las **cadenas** que se
arman con ellos y los **lenguajes** que agrupan cadenas. Esta página define esos bloques —
alfabeto, cadena, potencias y clausuras — sobre los que se apoya todo lo demás.

**Observación previa.** La teoría de autómatas busca modelar el funcionamiento de una
*computadora ideal*. Ese modelo permite diseñar y construir software y determinar qué
problemas son intratables.

## Alfabeto

> **Definición.** Un **alfabeto** $\Sigma$ es un conjunto **no vacío** y **finito** de símbolos.

Ejemplos: $\Sigma = \{0, 1\}$, $\Sigma = \{a, b\}$, o el alfabeto español pensado como
$\Sigma_{\text{esp}} = \Sigma_{\text{ing}} \cup \{ñ\}$.

## Cadenas

> **Definición.** Una **cadena** (o palabra) sobre un alfabeto $\Sigma$ es una secuencia
> **finita** de símbolos de $\Sigma$.

La **longitud** de una cadena $w$, notada $|w|$, es la cantidad de posiciones que ocupan los
símbolos que la forman.

> **Definición.** La **cadena vacía** es la cadena de longitud $0$. Se la nota $\lambda$, con
> $|\lambda| = 0$.

### Definición recursiva de cadena

El conjunto de cadenas sobre $\Sigma$ se puede definir por recursión, en paralelo con la
inducción sobre los naturales (caso base + construcción a partir de casos anteriores):

> **Definición (cadena, recursiva).**
> i) $\lambda$ es una cadena.
> ii) si $a \in \Sigma$ es un símbolo y $w$ es una cadena, entonces $a \cdot w$ es una cadena.

### Potencias del alfabeto

> **Definición.** La **potencia $k$-ésima** de un alfabeto $\Sigma$ es el conjunto de todas las
> cadenas de longitud $k$ formadas con símbolos de $\Sigma$:
> $$\Sigma^k = \{\, w : \text{los símbolos de } w \text{ están en } \Sigma,\ |w| = k \,\}$$

Casos particulares: $\Sigma^0 = \{\lambda\}$ (la única cadena de longitud $0$) y
$\Sigma^1 = \Sigma$. Si el alfabeto tiene $p = |\Sigma|$ símbolos, la cantidad de cadenas de
longitud $k$ es

$$\#\Sigma^k = p^k$$

donde $\#x$ denota el cardinal (cantidad de elementos) del conjunto $x$.

> **Ejemplo.** Con $\Sigma = \{a, b\}$ (es decir $p = 2$):
> $$\Sigma^0 = \{\lambda\}, \quad \Sigma^1 = \{a, b\}, \quad \Sigma^2 = \{aa, ab, ba, bb\}$$
> Entonces $\#\Sigma^0 = 1$ y $\#\Sigma^2 = 4$; hay $2^3 = 8$ palabras de longitud $3$ y, en
> general, $2^k$ palabras de longitud $k$.

## Clausuras del alfabeto

Reuniendo todas las potencias del alfabeto se obtienen sus dos clausuras.

> **Definición (clausura positiva).** La **clausura positiva** de $\Sigma$ es la unión de todas
> sus potencias con exponente $\geq 1$:
> $$\Sigma^+ = \Sigma^1 \cup \Sigma^2 \cup \Sigma^3 \cup \cdots = \bigcup_{i \geq 1} \Sigma^i$$
> Es un conjunto **infinito** (si $\Sigma \neq \varnothing$) y **no** contiene a $\lambda$.

> **Definición (clausura estrella o de Kleene).** La **clausura estrella** agrega la cadena
> vacía a la clausura positiva:
> $$\Sigma^* = \{\lambda\} \cup \Sigma^+ = \bigcup_{i \geq 0} \Sigma^i$$

Todo lenguaje sobre $\Sigma$ vive dentro de $\Sigma^*$ (ver [[02-lenguajes-y-operaciones]]);
por ejemplo, con $\Sigma = \{0,1\}$, $L = \{\, w \in \Sigma^* : w = 0^n1^n,\ n \geq 0 \,\} =
\{\lambda, 01, 0011, \dots\}$ es un subconjunto de $\Sigma^*$.

### Pertenencia de $\lambda$ y de los símbolos

De las definiciones anteriores se deducen de inmediato estas relaciones (con $\Sigma = \{a,b\}$):

| Afirmación | Valor | Motivo |
|---|---|---|
| $\lambda \in \Sigma$ | Falso | $\Sigma$ contiene **símbolos**, no cadenas |
| $\lambda \in \Sigma^*$ | Verdadero | $\Sigma^*$ siempre contiene $\lambda$ |
| $\lambda \in \Sigma^+$ | Falso | $\Sigma^+$ excluye $\lambda$ |
| $\{\lambda\} = \Sigma^0$ | Verdadero | $\Sigma^0$ es exactamente $\{\lambda\}$ |
| $\{\lambda, a\} \subseteq \Sigma^1$ | Falso | $\lambda \notin \Sigma^1 = \{a,b\}$ |
| $\{a, b\} \subseteq \Sigma^1$ | Verdadero | $\Sigma^1 = \{a, b\}$ |

> **Nota.** En la práctica resuelta de la cursada, la opción $\lambda \in \Sigma$ aparece
> tildada como verdadera; es una inconsistencia con la definición (un alfabeto es un conjunto de
> símbolos, no de cadenas), por lo que corresponde **falso**.

## Concatenación de cadenas

> **Definición.** Dadas dos cadenas $x = x_0 x_1 \cdots x_i$ e $y = y_0 y_1 \cdots y_j$, su
> **concatenación** es la cadena que resulta de escribir una a continuación de la otra:
> $$xy = x_0 x_1 \cdots x_i\, y_0 y_1 \cdots y_j$$

Propiedades de la concatenación:

i) **Cerrada:** la concatenación de dos cadenas es siempre una cadena.
ii) **Asociativa:** $(xy)z = x(yz)$; respeta el orden de los símbolos.
iii) **Elemento neutro:** la cadena vacía $\lambda$, con $\lambda w = w \lambda = w$.

## Reverso de una cadena

El **reverso** $w^r$ invierte el orden de los símbolos de $w$. Se define por recursión:

> **Definición (reverso, recursiva).**
> $$\lambda^r = \lambda, \qquad (a\,w)^r = w^r\, a \quad (a \in \Sigma)$$

> **Ejemplo.** $(ab)^r = b^r\, a = \lambda^r\, b\, a = \lambda\, b a = ba$.

## Ver también

- [[02-lenguajes-y-operaciones]] — lenguajes formales y operaciones (unión, producto, clausura, reversa)
- [[index]] — índice del vault de TLA
