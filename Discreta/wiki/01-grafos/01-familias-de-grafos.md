---
tags: [teoria, unidad-1, familias-de-grafos, grafos]
fuente: raw/resumenes/resumen-matematica-discreta.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Familias de grafos

Catálogo de las familias de grafos con nombre propio que se usan como piezas de
referencia en toda la materia. Transcripto de los apuntes de la cursada 2023-2C.

## Grafo completo $K_n$

> **Definición.** El grafo completo $K_n$ tiene $n$ vértices y una arista entre
> cada par de vértices distintos.

La cantidad de aristas de un completo se cuenta como pares de vértices:

$$\#E(K_n) = \binom{n}{2}$$

donde $\binom{n}{2}$ es el número combinatorio "$n$ tomados de a $2$", es decir la
cantidad de pares no ordenados de vértices. Los primeros casos $K_1, K_2, K_3, K_4, K_5$
van del vértice aislado ($K_1$) al pentágono con todas sus diagonales ($K_5$).

## Grafo bipartito completo $K_{m,n}$

> **Definición.** En el grafo bipartito completo $K_{m,n}$ el conjunto de vértices
> se parte en dos, $V_1$ y $V_2$, y **cada** $v \in V_1$ está unido a **todos** los
> $v' \in V_2$.

Los apuntes muestran $K_{2,3}$ (dos vértices de un lado, tres del otro, con las seis
aristas cruzadas) y $K_{2,2}$ (que dibujado se ve como un cuadrado). Ver la noción
general de partición en [[02-grafos-y-grados|grafo bipartito]].

## Ciclo $C_n$

> **Definición.** El ciclo $C_n$ (con $n \geq 3$) tiene $n$ vértices y $n$ aristas,
> con conjunto de aristas
> $$E = \{v_1, v_2\},\ \{v_2, v_3\},\ \dots,\ \{v_{n-1}, v_n\},\ \{v_n, v_1\}$$

Cada vértice se une con el siguiente y el último cierra contra el primero. Los apuntes
ilustran $C_3$ (triángulo) y $C_5$ (pentágono).

## Grafo regular ($k$-regular)

> **Definición.** Un grafo es **regular** cuando todos sus vértices tienen el mismo
> grado. Es $k$-**regular** si $\operatorname{gr}(v_i) = k$ para todo vértice $v_i$.

donde $\operatorname{gr}(v_i)$ es el [[02-grafos-y-grados|grado]] del vértice $v_i$.
El apunte destaca dos ejemplos $3$-regulares: un grafo $3$-regular simple y el **grafo
de Petersen**, también $3$-regular.

## Grafo camino $P_n$

> **Definición.** El grafo camino $P_n$ es un grafo simple que cumple
> $$\#V = \#E + 1$$

es decir, tiene una arista menos que vértices: es una tira abierta de vértices
encadenados. Los apuntes muestran $P_1$ (un vértice suelto) y $P_3$ (tres vértices en
línea con dos aristas).

## Grafo hipercubo $Q_n$

> **Definición.** El hipercubo $Q_n$ es el grafo $n$-regular cuyos vértices son el
> conjunto de las cadenas de bits de longitud $n$, con la regla: dos vértices son
> adyacentes $\iff$ sus cadenas difieren en **un solo bit**.

Así $Q_1$ es una arista entre `0` y `1`; $Q_2$ es un cuadrado con vértices
`00, 01, 11, 10`; y $Q_3$ es el cubo con vértices `000, 001, …, 111`, donde cada arista
une cadenas que difieren en exactamente una posición.

## Grafo rueda $W_n$

> **Definición.** La rueda $W_n$ (con $n \geq 4$) se obtiene agregando un vértice al
> ciclo $C_{n-1}$ y uniéndolo a todos los vértices del ciclo.

El vértice agregado funciona como "eje" y las aristas nuevas como "rayos". El apunte
dibuja $W_4$: un triángulo $C_3$ con un centro unido a sus tres vértices.

## Grafos de Harary $H_{k,n}$

> **Definición.** El grafo de Harary $H_{k,n}$ es un grafo $k$-**conexo** con $n$ vértices y
> $$\#E = \left\lceil \frac{kn}{2} \right\rceil$$
> aristas, definido para $k \geq 2$: es la construcción que logra la conectividad $k$ con la
> **mínima** cantidad de aristas posible.

En la sección de familias el resumen sólo los presenta con los diagramas de $H_{4,8}$ y
$H_{5,8}$: ocho vértices numerados $0..7$ sobre una circunferencia. La definición y la cota
$$h_k(n) \geq \left\lceil \frac{kn}{2} \right\rceil,$$
donde $h_k(n)$ es el mínimo de aristas necesarias para un grafo $k$-conexo de $n$ vértices,
aparecen más adelante en el resumen, junto al material de conexidad (no en la sección de
familias).

---

## Ver también

- [[02-grafos-y-grados]] — definición de grafo, grado, handshaking y bipartitos
- [[03-subgrafos-operaciones-isomorfismo]] — cómo se combinan y comparan estos grafos
- [[04-representacion-matricial]] — matrices de adyacencia e incidencia de estas familias
