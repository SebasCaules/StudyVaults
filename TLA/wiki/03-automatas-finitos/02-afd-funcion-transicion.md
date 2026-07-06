---
tags: [teoria, unidad-3, afd, funcion-transicion, funcion-extendida]
fuente: raw/teoricas/tla-teorica.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# AFD y función de transición extendida

Un **autómata finito determinístico (AFD)** es el caso particular en el que, para cada estado
y cada símbolo, la transición está unívocamente determinada: hay exactamente un estado
destino y no se usan transiciones por $\lambda$. Esta página define la función de transición
del AFD y su extensión a cadenas completas.

## Función de transición

> **Definición.** En un AFD la **función de transición** es una función total
> $$\delta : Q \times \Sigma \to Q$$

A diferencia de la forma general del [[01-automatas-finitos|autómata finito]] —que devuelve un
conjunto de estados $\mathcal{P}(Q)$— aquí $\delta(q, a)$ es **un** estado: leyendo el símbolo
$a$ desde el estado $q$, el autómata pasa a un único estado bien definido.

## Función de transición extendida

La función $\delta$ describe un solo paso (un símbolo). Para saber a qué estado se llega tras
leer una **cadena** entera se extiende $\delta$ a $\Sigma^*$.

> **Definición.** La **función de transición extendida** es
> $$\hat\delta : Q \times \Sigma^* \to Q$$
> que describe lo que ocurre cuando se parte de cualquier estado y se sigue una secuencia de
> entradas. Se define por recursión sobre la cadena:
> $$\hat\delta(q, \lambda) = q \qquad \text{(base)}$$
> $$\hat\delta(q, w) = \delta\big(\hat\delta(q, w'),\, a\big) \quad \text{si } w = w'a \qquad \text{(paso inductivo)}$$

donde $q \in Q$ es el estado de partida, $w \in \Sigma^*$ la cadena que se lee, $a \in \Sigma$
su último símbolo y $w'$ el prefijo que queda al quitarlo ($w = w'a$). La base dice que leer
la cadena vacía no cambia el estado; el paso inductivo procesa primero el prefijo $w'$ y
recién entonces consume el último símbolo $a$.

> **Ejemplo.** Sobre el autómata $M$ de [[01-automatas-finitos]] (alfabeto $\{0,1\}$,
> inicial $q_0$), leyendo la cadena $001$ paso a paso:
> $$\hat\delta(q_0, 0) = q_1, \quad \hat\delta(q_0, 00) = q_2, \quad \hat\delta(q_0, 001) = q_3$$
> Como $q_3$ es final, la cadena $001$ es aceptada por $M$.

La función extendida es la forma más compacta de decidir la aceptación: basta calcular
$\hat\delta(q_0, w)$ y ver si cae en $F$. La lectura equivalente, paso a paso, en términos de
configuraciones se desarrolla en [[03-configuraciones-lenguaje-aceptado]].

## Ver también

- [[01-automatas-finitos]] — definición general, diagrama y tabla de transición
- [[03-configuraciones-lenguaje-aceptado]] — configuraciones instantáneas y lenguaje aceptado
- [[index]] — índice del vault de TLA
