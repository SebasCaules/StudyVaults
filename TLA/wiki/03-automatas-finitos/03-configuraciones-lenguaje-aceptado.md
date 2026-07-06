---
tags: [teoria, unidad-3, configuraciones, lenguaje-aceptado, equivalencia]
fuente: raw/teoricas/tla-teorica.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Configuraciones y lenguaje aceptado

La **función de transición extendida** dice a qué estado se llega tras leer una cadena; las
**configuraciones instantáneas** describen el mismo proceso paso a paso, como una traza de la
ejecución del autómata. Con ellas se define con precisión qué significa que un autómata
**acepte** una cadena, y por lo tanto cuál es el lenguaje que reconoce.

## Configuración instantánea

> **Definición.** Una **configuración instantánea** es una descripción del autómata finito en
> un momento dado. Es un par
> $$[q, w] \quad \text{con } q \in Q \ \text{y}\ w \in \Sigma^*$$
> donde $q$ es el estado actual y $w$ es la porción de cadena que **falta** leer.

El movimiento entre dos configuraciones —consumir un símbolo— se nota con $\vdash$:

> **Definición.** El símbolo $\vdash$ indica un movimiento válido entre dos configuraciones:
> $$[q, aw] \vdash [p, w] \iff \delta(q, a) = p$$

Es decir, desde la configuración $[q, aw]$ el autómata lee el primer símbolo $a$ de la parte
pendiente, transita al estado $p = \delta(q, a)$ y avanza a $[p, w]$, con la cadena restante
$w$ ya sin ese símbolo.

## Secuencia de configuraciones

Encadenando movimientos se obtiene una **secuencia de configuraciones**, notada $\vdash^*$,
definida por recursión:

> **Definición.**
> i) **Base:** si $I$ es una configuración instantánea, entonces $I \vdash^* I$ es una
>    secuencia de configuraciones.
> ii) **Paso inductivo:** si $K \vdash^* J$ es una secuencia de configuraciones válida y existe
>    una configuración $K$ tal que $I \vdash K$ es un movimiento válido, entonces $I \vdash^* J$
>    es una secuencia de configuraciones válida.

En otras palabras, $\vdash^*$ es la **clausura reflexivo-transitiva** de $\vdash$: representa
cero o más movimientos encadenados.

> **Ejemplo.** Sobre el autómata $M$ de [[01-automatas-finitos]] (alfabeto $\{0,1\}$), la cadena
> $001$ se procesa así:
> $$[q_0, 001] \vdash [q_1, 01] \vdash [q_2, 1] \vdash [q_3, \lambda]$$
> es decir $[q_0, 001] \vdash^* [q_3, \lambda]$: partiendo del inicial se consume toda la cadena
> y se termina en $q_3$, con la parte pendiente reducida a $\lambda$.

## Un caso completo

Considérese el AFD $A = \langle Q, \Sigma, q_0, F, \delta \rangle$ con $Q = \{I, A, F\}$,
$\Sigma = \{a, b\}$, estado inicial $I$, estados finales $F = \{F\}$ y la tabla:

| $\delta$ | $a$ | $b$ |
|---|---|---|
| $I$ | $A$ | $F$ |
| $A$ | $A$ | $I$ |
| $F$ (\*) | $A$ | $F$ |

Para decidir si la palabra $ababb$ pertenece al lenguaje, se sigue la secuencia de
configuraciones desde el estado inicial:

$$[I, ababb] \vdash [A, babb] \vdash [I, abb] \vdash [A, bb] \vdash [I, b] \vdash [F, \lambda]$$

La cadena se consume por completo y el autómata termina en el estado $F$, que es final: por lo
tanto $ababb$ **pertenece** al lenguaje aceptado por $A$.

## Lenguaje aceptado

El **lenguaje aceptado** por un autómata finito es el conjunto de cadenas que, partiendo del
estado inicial, dejan al autómata en un estado final tras consumir toda la entrada. Admite dos
formulaciones equivalentes.

Con secuencia de configuraciones:

$$L = \{\, w \in \Sigma^* \ /\ [q_0, w] \vdash^* [p, \lambda],\ p \in F \,\}$$

Con la función de transición extendida:

$$L = \{\, w \in \Sigma^* \ /\ \hat\delta(q_0, w) \in F \,\}$$

En ambos casos $w$ es la cadena de entrada, $q_0$ el estado inicial y $F$ el conjunto de
estados finales; la condición pide que al terminar de leer $w$ el estado alcanzado sea final.
La segunda forma usa la función extendida $\hat\delta$ de [[02-afd-funcion-transicion]].

## Equivalencia de autómatas

> **Definición.** Dos AFD $M$ y $M'$ son **equivalentes** si y solo si reconocen el mismo
> lenguaje:
> $$M \equiv M' \iff L(M) = L(M')$$

Consecuencias directas:

- Dos autómatas son equivalentes exactamente cuando reconocen el mismo lenguaje.
- Si una palabra es reconocida por uno y no por el otro, **no** son equivalentes.
- La minimización de dos autómatas equivalentes es **única**: existe un AFD mínimo salvo
  renombre de estados que reconoce ese lenguaje.

## Ver también

- [[02-afd-funcion-transicion]] — función de transición y su extensión $\hat\delta$
- [[01-automatas-finitos]] — definición general, diagrama y tabla de transición
- [[index]] — índice del vault de TLA
