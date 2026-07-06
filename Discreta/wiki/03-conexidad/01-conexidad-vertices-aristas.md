---
tags: [teoria, unidad-3, conexidad, vertices-de-corte, puentes]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Conexidad: componentes, vértices y aristas de corte

Esta página cubre la parte P3 del curso: cómo medir cuán "conectado" está un grafo.
Se estudian las componentes, los puntos y aristas cuya remoción rompe la conexión
(vértices de corte y puentes) y las dos medidas cuantitativas de robustez —conexidad
por vértices $K_v$ y por aristas $K_e$—, junto a la relación que las ordena.

## Componentes

> **Definición.** Un subgrafo $H$ de $G$ es una **componente** de $G$ si no es subgrafo
> propio de ningún subgrafo conexo de $G$. Es decir, es un subgrafo conexo maximal.

> **Definición.** La **componente de un vértice** $C(v)$ es el subgrafo inducido por todos
> los vértices alcanzables desde $v$.

## Vértice de corte

> **Definición.** $v$ es un **vértice de corte** si al removerlo aumenta el número de
> componentes conexas:
> $$\#\text{componentes conexas de } G - \{v\} \;>\; \#\text{componentes conexas de } G$$

El siguiente teorema caracteriza los vértices de corte por medio de los caminos.

> **Teorema.** En un grafo conexo $G$, $v$ es vértice de corte si y solo si existen
> vértices $u, w \in V_G$, con $u \neq v \neq w$, tales que $v$ pertenece a **todo** camino
> de $u$ a $w$.

Aquí $(u\text{–}w)$ denota un camino entre $u$ y $w$: la condición pide que $v$ aparezca en
cada uno de esos caminos, de modo que sacarlo deja a $u$ y $w$ en componentes distintas.

## Arista de corte (puente)

> **Definición.** $e$ es una **arista de corte** (o **puente**) si al removerla aumenta el
> número de componentes conexas:
> $$\#\text{componentes conexas de } G - \{e\} \;>\; \#\text{componentes conexas de } G$$

**Observación.** Si $e = \{u, v\}$ es una arista de corte, entonces $v$ es vértice de corte
siempre que $\operatorname{gr}(v) > 1$.

> **Teorema.** En un grafo conexo $G$, $e$ es una arista de corte si y solo si $e$ no
> pertenece a ningún ciclo de $G$.

## Conexidad por vértices $K_v$

> **Definición.** $K_v(G)$ es el número **mínimo** de vértices que hay que remover de $G$
> para que deje de ser conexo o se transforme en el grafo trivial. Un grafo es **$k$-conexo**
> si $K_v(G) \geq k$.

Propiedades inmediatas:

i) **Cota de tamaño:** si $G$ es $k$-conexo, entonces $\#V_G > k$.
ii) **Caso $K_v = 0$:** $K_v(G) = 0 \iff G$ es $K_1$ o es disconexo.
iii) **Caso $K_v = 1$:** $K_v(G) = 1 \iff G$ es $K_2$, o bien $G$ es conexo y tiene un vértice de corte.
iv) **Completo:** $K_v(K_n) = n - 1$, pues ningún conjunto de vértices desconecta a $K_n$. En
   consecuencia $K_n$ es $(n-1)$-conexo, $(n-2)$-conexo, …, $1$-conexo.

## Conexidad por aristas $K_e$

> **Definición.** $K_e(G)$ es el número **mínimo** de aristas que hay que remover para
> desconectar $G$. Si $K_e(G) \geq k$, entonces $G$ es **$k$-aristas conexo**.

> **Proposición.** Sea $G$ un grafo conexo y $\delta = \min_{v_i \in V_G} \operatorname{gr}(v_i)$
> el grado mínimo. Entonces
> $$K_e(G) \leq \delta$$

### Partición por corte de aristas

> **Definición.** Una **partición por corte de aristas** es un conjunto de aristas
> $\langle X_1, X_2 \rangle$, donde $X_1, X_2$ son conjuntos de vértices de $G$ que cumplen:
> $$X_1 \cup X_2 = V_G, \qquad X_1 \cap X_2 = \varnothing$$
> $$\langle X_1, X_2 \rangle = \{\, e = \{u, v\} \;/\; u \in X_1 \ \wedge \ v \in X_2 \,\}$$

Es decir, $\langle X_1, X_2 \rangle$ reúne las aristas que cruzan de un lado al otro de la
partición de vértices.

> **Proposición.** Si un grafo es $k$-aristas conexo, entonces toda partición por corte de
> aristas tiene por lo menos $k$ aristas.

## Reducción de conexidad y desigualdad de Whitney

> **Teorema.** Sea $G$ un grafo $k$-conexo con $k \geq 3$. Entonces $G - e$, con $e \in E_G$,
> es $(k-1)$-conexo.

De este teorema y las definiciones anteriores se desprenden los corolarios que ordenan las
tres cantidades $K_v$, $K_e$ y $\delta$.

> **Corolarios.**
> i) Si $G$ es $k$-conexo y $S$ es un conjunto de $k-1$ aristas, entonces $G - S$ es conexo.
> ii) Si $G$ es conexo, entonces $K_v(G) \leq K_e(G)$.
> iii) Si $G$ es conexo, entonces
> $$K_v(G) \leq K_e(G) \leq \delta$$

La cadena $K_v(G) \leq K_e(G) \leq \delta$ es la desigualdad de referencia de esta unidad:
la robustez por vértices nunca supera a la robustez por aristas, y ninguna supera al grado
mínimo.

## Caminos internamente disjuntos

Estas dos nociones son el vocabulario con el que se enuncia el [[02-whitney-tutte-menger|teorema de Whitney]].

> **Definición.** En un camino simple, un **vértice interno** es todo vértice que no es ni el
> inicial ni el final.

> **Definición.** Una **colección de caminos internamente disjuntos** es un conjunto de
> caminos tal que ningún par de ellos comparte vértices internos (solo pueden coincidir en los
> extremos).

---

## Ver también

- [[02-whitney-tutte-menger]] — caracterización de la 2- y 3-conexidad y teorema de Menger
- [[index]] — índice del vault
