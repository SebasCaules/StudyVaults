---
tags: [teoria, unidad-9, redes-flujo, ford-fulkerson, camino-aumento]
fuente: raw/resumenes/resumen-discreta.pdf
unidad: 9
tipo: teoria
actualizado: 2026-07-05
---

# Camino de aumento y el teorema de Ford–Fulkerson

El algoritmo de Ford–Fulkerson busca **caminos de aumento** de la fuente al sumidero y, por
cada uno, empuja tanto flujo como el margen lo permita. Cuando ya no hay camino de aumento,
el flujo es máximo y los vértices alcanzados definen un corte mínimo. Requiere los
[[08-redes-flujo/02-cortes-min-cut|cortes]] y el [[08-redes-flujo/01-redes-flujo-conceptos|flujo]].

## Cuasi-camino

Para poder "deshacer" flujo mal colocado, el algoritmo recorre el grafo subyacente (no
dirigido), admitiendo arcos en contra de su orientación.

> **Definición.** Un **cuasi-camino** es una secuencia alternada de vértices y aristas
> $$Q = \langle f = v_0,\; e_1,\; v_1,\; \dots,\; v_k = s \rangle$$
> que forma un camino $f$-$s$ en el grafo subyacente de $N$. Cada arco del cuasi-camino es:
>
> - **arco directo**, si va en el sentido del recorrido: $v_{i-1} \to v_i$;
> - **arco inverso**, si va en contra: $v_{i-1} \leftarrow v_i$.

## Camino de aumento

Un cuasi-camino sirve para aumentar el flujo cuando cada arco tiene margen: los directos,
para recibir más flujo; los inversos, para devolver flujo.

> **Definición.** Un **camino de aumento** es un cuasi-camino $f$-$s$ en $N$ tal que el flujo
> puede incrementarse en cada arco directo y decrementarse en cada arco inverso. Es decir,
> para cada arco $e$ del camino:
>
> - $f(e) < \operatorname{cap}(e)$, si $e$ es arco **directo** (queda capacidad libre);
> - $f(e) > 0$, si $e$ es arco **inverso** (hay flujo que se puede devolver).

El margen disponible en cada arco y el margen total del camino se miden con $\Delta$.

> **Notación.** El **margen** de un arco $e$ del camino es
> $$\Delta e = \operatorname{cap}(e) - f(e) \quad \text{si } e \text{ es arco directo}, \qquad \Delta e = f(e) \quad \text{si } e \text{ es arco inverso}.$$
> El **margen del camino** $Q$ es el menor de todos:
> $$\Delta Q = \min_{e \in Q} \Delta e$$
> Al aplicar el camino se suma $\Delta Q$ al flujo de cada arco directo y se resta $\Delta Q$
> al de cada arco inverso; el valor total del flujo aumenta en $\Delta Q$.

> **Definición.** Un arco $e$ está **saturado** si $f(e) = \operatorname{cap}(e)$ (no admite
> más flujo directo).

## Teorema de Ford–Fulkerson

> **Teorema (Ford–Fulkerson / max-flow min-cut).** Para una red dada, el valor del flujo
> máximo es igual a la capacidad de un corte mínimo:
> $$\operatorname{Val}(F^{*}) = \operatorname{cap}(K^{*})$$

La idea del algoritmo: mientras exista un camino de aumento $f$-$s$, aplicarlo (empujando
$\Delta Q$). Cuando ya no exista, el flujo es máximo. Los vértices que quedan **etiquetados**
(alcanzables desde $f$ por caminos de aumento) forman $V_f$; el resto, $V_s$. Ese
$\langle V_f, V_s \rangle$ es un corte mínimo y su capacidad iguala al valor del flujo.

## Ejemplo resuelto

Se busca llegar de $f$ a $s$ recorriendo la red con **BFS** y etiquetando vértices. La red
tiene vértices $\{f, a, b, c, d, s\}$; se parte de flujo cero en todos los arcos. En cada
paso se muestra el camino, el margen $\Delta e$ de cada arco y el $\Delta Q$ resultante.

**Paso 1.** Camino directo $f \to a \to s$:
$$\Delta e = 9 \;(f\!\to\! a), \qquad \Delta e = 1 \;(a\!\to\! s), \qquad \Delta Q = 1$$
Flujo acumulado: $1$.

**Paso 2.** Camino directo $f \to a \to b \to s$:
$$\Delta e = 8, \quad \Delta e = 8, \quad \Delta e = 8, \qquad \Delta Q = 8$$
Flujo acumulado: $1 + 8 = 9$.

**Paso 3.** Camino con un **arco inverso** $f \to c \to b \leftarrow a \to d \to s$ (el tramo
$b \leftarrow a$ devuelve flujo):
$$\Delta e = 5, \quad \Delta e = 6, \quad \underbrace{\Delta e = 8}_{\text{inverso}}, \quad \Delta e = 4, \quad \Delta e = 2, \qquad \Delta Q = 2$$
Flujo acumulado: $9 + 2 = 11$.

**Paso 4 — corte.** Ya no se puede avanzar: no hay más camino de aumento. Los vértices que
quedaron etiquetados pertenecen a $V_f$ y los que no, a $V_s$:
$$V_f = \{f, a, b, c, d\}, \qquad V_s = \{s\}$$
Por lo tanto $\langle V_f, V_s \rangle$ es un **corte mínimo** y $F^{*} = 11$ es el **flujo
máximo** de la red.

---

## Ver también

- [[08-redes-flujo/01-redes-flujo-conceptos]] — flujo, restricciones y valor del flujo
- [[08-redes-flujo/02-cortes-min-cut]] — cortes, capacidad de corte y corte mínimo
- [[08-redes-flujo/04-conectividad-local]] — conectividad local y aristas separadoras
