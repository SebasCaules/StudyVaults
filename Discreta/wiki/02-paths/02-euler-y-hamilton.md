---
tags: [teoria, unidad-2, euler, hamilton, circuitos]
fuente: raw/resumenes/resumen-matematica-discreta.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Circuitos eulerianos y hamiltonianos

Dos recorridos con nombre propio que atraviesan todo el grafo, pero midiendo cosas distintas:
Euler exige pasar por **todas las aristas** (sin repetirlas), Hamilton por **todos los
vértices** (sin repetirlos). El vocabulario de fondo —recorrido, camino simple, ciclo— está en
[[01-caminos-y-circuitos]].

## Recorridos y circuitos hamiltonianos

Hamilton se ocupa de visitar todos los vértices exactamente una vez.

> **Definición.** Sea $G$ un grafo o dígrafo con $\#V_G \geq 3$. $G$ tiene un **ciclo
> hamiltoniano** si existe un ciclo en $G$ que contiene a cada vértice de $V_G$.

> **Definición.** Un **camino hamiltoniano** es un camino simple (no cerrado) del grafo que
> contiene todos sus vértices.

**Observación.** La diferencia entre ambos es el cierre: el ciclo hamiltoniano vuelve al
vértice de partida; el camino hamiltoniano no. Como se apoyan en camino simple / ciclo, no
repiten vértices por definición.

## Recorridos y circuitos eulerianos

Euler, en cambio, se ocupa de usar todas las aristas exactamente una vez.

> **Definición.** Un **recorrido euleriano** es un recorrido que contiene todas las aristas del
> grafo.

> **Definición.** Un **circuito euleriano** es un recorrido euleriano cerrado.

> **Definición.** Un grafo es **euleriano** si tiene un circuito euleriano.

**Observación.** Como es un recorrido, no repite aristas; y al ser euleriano las usa todas: un
circuito euleriano recorre cada arista del grafo **exactamente una vez** y vuelve al punto de
partida.

### Caracterización por grados

La existencia de circuito o recorrido euleriano se decide mirando únicamente la conexidad y la
paridad de los grados.

> **Proposición.** Sea $G$ un grafo o multigrafo no dirigido sin vértices aislados. $G$ es
> euleriano $\iff$ $G$ es conexo y **todos** sus vértices tienen grado par,
> $$\operatorname{gr}(v) = 2k \quad \forall\, v \in V_G$$

> **Corolario.** Sea $G$ un grafo o multigrafo no dirigido sin vértices aislados. $G$ tiene un
> recorrido euleriano que **no** es circuito $\iff$ $G$ es conexo y tiene **exactamente 2
> vértices de grado impar** (que resultan ser los extremos del recorrido).

> **Nota.** En los apuntes de la cursada 2023-2C el corolario está escrito de forma condensada;
> la condición correcta y estándar es la de arriba: exactamente **dos vértices de grado impar**
> (no par). Si todos los grados son pares se cae en el caso del circuito euleriano de la
> proposición.

---

## Ver también

- [[01-caminos-y-circuitos]] — recorrido, camino simple, circuito y ciclo (vocabulario base)
- [[01-grafos/02-grafos-y-grados]] — grado de un vértice y lema del apretón de manos (handshaking)
- [[03-caminos-minimos-dijkstra-floyd]] — el otro problema clásico sobre caminos: el más corto
