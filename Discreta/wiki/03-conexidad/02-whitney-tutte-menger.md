---
tags: [teoria, unidad-3, conexidad, whitney, tutte, menger]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Teoremas de Whitney, Tutte y Menger

Los tres teoremas de esta página caracterizan la conexidad alta de un grafo. Whitney describe
la 2-conexidad mediante caminos internamente disjuntos y una construcción por síntesis; Tutte
hace lo análogo para la 3-conexidad a partir de la rueda $W_n$; y Menger conecta el número de
caminos disjuntos con el número de vértices necesarios para separar dos vértices. Las nociones
de vértice de corte y de caminos internamente disjuntos vienen de
[[01-conexidad-vertices-aristas]].

## Teorema de Whitney

> **Teorema (Whitney).** Sea $G$ un grafo con 3 o más vértices. Entonces $G$ es **2-conexo**
> si y solo si para todo par $u, v \in G$ existen por lo menos **2 caminos internamente
> disjuntos** que los unen.

> **Corolario.** Sea $G$ un grafo con $\#V_G \geq 3$. Entonces $G$ es 2-conexo si y solo si
> para todo par $u, v \in V_G$ el par $\{u, v\}$ pertenece a un ciclo de $G$; esto es, todo
> par de vértices está sobre un ciclo común.

## Síntesis de Whitney

> **Definición.** Una **síntesis de Whitney** de un grafo $G$ a partir de un grafo $H$ es una
> secuencia de grafos $G_0, G_1, \dots, G_t$ donde $G_0 = H$, $G_t = G$, y cada $G_i$ se
> obtiene de $G_{i-1}$ adicionando un camino simple.

En los apuntes se ilustra con la **síntesis de Whitney del hipercubo $Q_3$**: se parte de un
cuadrado ($G_0$) y en cada paso se agrega un camino simple, hasta reconstruir el cubo $G$.

Dos lemas sostienen la construcción:

> **Lemas.**
> i) Si $H$ es un grafo 2-conexo, entonces $G = H + \text{(un camino simple)}$ también es 2-conexo.
> ii) Si $H$ es un subgrafo de $G$ 2-conexo y $e$ es una arista en $E_G - E_H$, entonces se
>    puede adicionar a $H$ un camino simple que contiene dicha arista.

> **Teorema (síntesis de Whitney).** $G$ es 2-conexo si y solo si $G$ es un ciclo o es una
> síntesis de Whitney de un ciclo.

## Teorema de Tutte

Tutte caracteriza la 3-conexidad a partir de la rueda $W_n$ mediante dos operaciones.

> **Teorema (Tutte).** $G$ es **3-conexo** si y solo si $G$ es una rueda $W_n$, o se obtiene a
> partir de una $W_n$ por una secuencia de las siguientes operaciones:
> i) **Adición de una arista** entre dos vértices no adyacentes.
> ii) **Reemplazo de un vértice** $v$ con $\operatorname{gr}(v) \geq 4$ por dos vértices unidos
>    por una nueva arista, de modo que cada vértice adyacente al original quede adyacente a
>    exactamente uno de los dos nuevos vértices, con la condición de que el grado de cada nuevo
>    vértice sea $\geq 3$.

En los apuntes se muestra la **síntesis de Tutte de $Q_3$ a partir de $W_3$**: partiendo de la
rueda $W_3$ y aplicando estas operaciones se llega al hipercubo $Q_3$.

## Grafos de Harary y cota $h_k(n)$

> **Proposición.** Sea $h_k(n)$ el número mínimo de aristas necesarias para un grafo
> $k$-conexo con $n$ vértices. Entonces
> $$h_k(n) \geq \left\lceil \frac{k\,n}{2} \right\rceil$$

> **Definición.** Los **grafos de Harary** $H_{k,n}$ son grafos $k$-conexos con $n$ vértices y
> exactamente $\left\lceil \dfrac{k\,n}{2} \right\rceil$ aristas, para $k \geq 2$. Alcanzan la
> cota anterior: son los $k$-conexos con la menor cantidad posible de aristas.

## Teorema de Menger

> **Teorema (Menger).** Sea $G$ conexo y $u, v \in V_G$ no adyacentes. Entonces el número
> **máximo** de caminos internamente disjuntos entre $u$ y $v$ es igual al número **mínimo** de
> vértices que hay que sacar para desconectar $u$ de $v$.

Menger generaliza a Whitney: para 2 caminos disjuntos hacen falta al menos 2 vértices de
separación, lo que reencuentra la caracterización de la 2-conexidad como caso particular.

---

## Ver también

- [[01-conexidad-vertices-aristas]] — vértices de corte, puentes y las medidas $K_v$, $K_e$
- [[index]] — índice del vault
