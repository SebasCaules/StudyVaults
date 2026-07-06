---
tags: [teoria, unidad-3, automatas-finitos, definicion, diagrama]
fuente: raw/teoricas/tla-teorica.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Autómatas finitos

Un **autómata finito** es el modelo de máquina abstracta más simple: lee una cadena de
entrada símbolo a símbolo y, según su estado interno, la **acepta** o la **rechaza**.
Reconoce exactamente los lenguajes regulares (tipo 3 de la jerarquía de Chomsky). Esta
página fija la definición formal, las convenciones del diagrama y la tabla de transición.

## Definición formal

> **Definición.** Un autómata finito es una quíntupla
> $$A = \langle Q, \Sigma, q_0, F, \delta \rangle$$
> donde
> i) $Q$ es el conjunto de **estados**,
> ii) $\Sigma$ es el conjunto de **símbolos terminales** (el alfabeto de entrada),
> iii) $q_0 \in Q$ es el **estado inicial** del autómata,
> iv) $F \subseteq Q$ es el conjunto de **estados finales** (o de aceptación),
> v) $\delta$ es la **función de transición**
> $$\delta : Q \times (\Sigma \cup \{\lambda\}) \to \mathcal{P}(Q)$$

Aquí $\mathcal{P}(Q)$ es el conjunto de partes (subconjuntos) de $Q$: dada la posición
actual —un estado y el símbolo que se lee— la función de transición devuelve el **conjunto**
de estados a los que el autómata puede pasar. Esta forma general admite varias transiciones
posibles por símbolo (no determinismo) y transiciones por la cadena vacía $\lambda$. Cuando
$\delta$ devuelve siempre un único estado y no usa $\lambda$, el autómata es
**determinístico**: ese caso se estudia en [[02-afd-funcion-transicion]].

## Convenciones del diagrama

Un autómata finito se dibuja como un grafo dirigido. Cada elemento gráfico traduce una
parte de la quíntupla:

| Elemento del diagrama | Significado |
|---|---|
| Nodo | Un estado de $Q$ |
| Círculo doble | Un estado final (pertenece a $F$) |
| Flecha entrante sin origen | Marca el estado inicial $q_0$ |
| Arco dirigido | Una parte de la función de transición $\delta$ |
| Etiqueta sobre el arco | El símbolo que se **consume** al recorrer ese arco |

## Tabla de transición

La función $\delta$ se presenta también como **tabla de transición**: una fila por estado,
una columna por símbolo del alfabeto, y en cada celda el conjunto de estados destino. El
estado inicial se ubica en la primera fila y los estados finales se marcan con un asterisco.

> **Ejemplo.** Sea el autómata sobre $\Sigma = \{0, 1\}$
> $$M = \langle \{q_0, q_1, q_2, q_3, t\},\ \{0,1\},\ q_0,\ \{q_3\},\ \delta \rangle$$
> con la tabla

| $\delta$ | $0$ | $1$ |
|---|---|---|
| $q_0$ | $\{q_1\}$ | $\{t\}$ |
| $q_1$ | $\{q_2\}$ | $\{q_3\}$ |
| $q_2$ | $\{t\}$ | $\{q_3\}$ |
| $q_3$ (\*) | $\{t\}$ | $\{t\}$ |
| $t$ | $\{t\}$ | $\{t\}$ |

Cada celda es un conjunto de un solo elemento, así que $M$ es en realidad determinístico. El
estado $t$ es un **estado trampa** (o sumidero): una vez que se llega a él, todas las
transiciones vuelven a $t$, de modo que la cadena ya no puede terminar en $q_3$ y queda
rechazada. Este mismo autómata reaparece al seguir la traza de una cadena en
[[03-configuraciones-lenguaje-aceptado]].

## Ver también

- [[02-afd-funcion-transicion]] — el caso determinístico y la función de transición extendida
- [[03-configuraciones-lenguaje-aceptado]] — cómo se procesa una cadena y qué lenguaje acepta $A$
- [[01-lenguajes-formales/01-alfabetos-cadenas-clausuras]] — alfabeto $\Sigma$, cadenas y $\Sigma^*$
- [[index]] — índice del vault de TLA
