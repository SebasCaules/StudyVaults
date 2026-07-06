---
tags: [teoria, unidad-2, caminos, circuitos, conexidad, distancia]
fuente: raw/resumenes/resumen-matematica-discreta.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Caminos y circuitos

Primera parte de la unidad de paths (P2). Se fija el vocabulario para recorrer un grafo:
qué es un camino y sus variantes según qué se permita repetir, cómo se concatenan y se
recortan, cuándo un vértice alcanza a otro, y las nociones de conexidad y distancia que de
todo esto derivan. Es la base sobre la que se apoyan los [[02-euler-y-hamilton|circuitos
eulerianos y hamiltonianos]] y los [[03-caminos-minimos-dijkstra-floyd|algoritmos de camino
mínimo]].

## Camino

Un camino recorre el grafo alternando vértices y aristas incidentes.

> **Definición.** Un **camino** desde $v_0$ hasta $v_n$ es una secuencia alternada de
> vértices y aristas
> $$W = \langle v_0,\, e_1,\, v_1,\, \dots,\, v_{n-1},\, e_n,\, v_n \rangle$$
> donde cada arista $e_i$ une a $v_{i-1}$ con $v_i$.

> **Definición.** Un **camino directo** es un camino en un dígrafo de $v_0$ a $v_n$
> $$W = \langle v_0,\, e_1,\, \dots,\, v_{n-1},\, e_n,\, v_n \rangle, \qquad e_i = (v_{i-1}, v_i),\ \ 1 \leq i \leq n$$
> es decir, cada arista se recorre en el sentido de su orientación.

> **Definición.** La **longitud** de un camino es su número de aristas.

> **Definición.** Un camino (o camino directo) $x$–$y$ es **cerrado** si $x = y$.

### Concatenación, subcamino y reducción

> **Definición.** Dados $W_1 = \langle v_0, e_1, \dots, e_k, v_k \rangle$ y
> $W_2 = \langle v_k, v_{k+1}, \dots, e_n, v_n \rangle$ (que empieza donde termina $W_1$), la
> **concatenación** es
> $$W_1 \circ W_2 = \langle v_0,\, e_1,\, \dots,\, e_k,\, v_k,\, v_{k+1},\, \dots,\, e_n,\, v_n \rangle$$

> **Definición.** Un **subcamino** de $W = \langle v_0, e_1, \dots, e_n, v_n \rangle$ es un tramo
> $$S = \langle v_s,\, e_s,\, \dots,\, e_k,\, v_k \rangle, \qquad 0 \leq s \leq k \leq n$$

**Reducción de caminos.** Si a un camino $W$ se le quita un subcamino cerrado $\bar{W}$, lo que
queda es otro camino $W'$ entre los mismos extremos: $W - \bar{W} = W'$.

## Recorridos, caminos simples, circuitos y ciclos

Según qué se permita repetir al recorrer, el camino recibe un nombre distinto.

| Nombre | Inglés | Restricción |
|---|---|---|
| Recorrido | *trail* | camino que **no repite aristas** |
| Camino simple | *path* | camino que **no repite vértices** |
| Circuito | *closed trail* | recorrido **cerrado** |
| Ciclo | *cycle* | camino simple **cerrado** |

**Observación.** No repetir vértices implica no repetir aristas: todo camino simple es un
recorrido, y todo ciclo es un circuito. Las recíprocas no valen.

## Alcanzabilidad y conexidad

> **Definición.** Un vértice $v$ es **alcanzable** desde $u$ si existe un camino $u$–$v$.

> **Definición.** Un grafo $G$ es **conexo** si $\forall\, u, v \in V_G$ existe un camino
> $u$–$v$.

En un dígrafo la orientación de las aristas hace que la conexidad se desdoble en dos:

> **Definiciones (conexidad en dígrafos).**
> i) **Débilmente conexo:** al ignorar la orientación de las flechas (grafo subyacente), el
>    grafo queda conexo.
> ii) **Fuertemente conexo:** $\forall\, u, v \in V_G$ existen a la vez un camino directo
>    $u$–$v$ **y** uno $v$–$u$.

## Distancia

La distancia entre dos vértices es la longitud del camino más corto que los une.

> **Definición.** En un grafo, la **distancia** entre $s$ y $t$ es
> $$d(s, t) = \begin{cases} L & \text{si } L \text{ es la longitud del camino más corto } s\text{–}t \\ 0 & \text{si } s = t \\ \infty & \text{si no existe camino } s\text{–}t \end{cases}$$

> **Definición.** En un dígrafo, la distancia $\vec{d}(s, t)$ se define igual, tomando la
> longitud del **camino directo** más corto de $s$ a $t$; vale $0$ si $s = t$ e $\infty$ si no
> hay camino directo $s$–$t$.

**Observación.** Al ser dirigida, en general $\vec{d}(s, t) \neq \vec{d}(t, s)$. El cálculo
efectivo de estas distancias es lo que resuelven [[03-caminos-minimos-dijkstra-floyd|Dijkstra
y Floyd–Warshall]].

## Descomposición de circuitos

Todo circuito, por más enredado que parezca, se arma pegando ciclos que no comparten aristas.

> **Proposición.** Todo circuito con al menos una arista contiene un subcamino que es un ciclo.

> **Definición.** La **descomposición** (o disyunción) de un circuito $T$ es una colección de
> ciclos de aristas disjuntas $G_1, G_2, \dots, G_m$ que juntos usan exactamente las aristas de
> $T$.

> **Proposición.** Todo circuito se puede descomponer en ciclos de aristas disjuntas.

## Bipartición y ciclos impares

La ausencia de ciclos impares caracteriza a los grafos bipartitos.

> **Proposición.** Un grafo $G$ es **bipartito** $\iff$ $G$ no contiene ciclos de longitud
> impar.

Ver [[01-grafos/02-grafos-y-grados|grafos y grados]] para la definición de grafo bipartito.

---

## Ver también

- [[02-euler-y-hamilton]] — circuitos que recorren todas las aristas (Euler) o todos los vértices (Hamilton)
- [[03-caminos-minimos-dijkstra-floyd]] — cómo calcular la distancia $d(s,t)$ con pesos
- [[04-planaridad/01-grafos-planos-euler]] — otra fórmula de Euler, ahora sobre regiones de un grafo plano
