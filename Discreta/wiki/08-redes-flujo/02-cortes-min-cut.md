---
tags: [teoria, unidad-9, redes-flujo, corte, corte-minimo]
fuente: raw/resumenes/resumen-discreta.pdf
unidad: 9
tipo: teoria
actualizado: 2026-07-05
---

# Cortes en una red y capacidad de corte

Un **corte** separa la fuente del sumidero partiendo los vértices en dos. Su capacidad
acota superiormente el valor de cualquier flujo, y el corte de menor capacidad marca el
techo exacto del flujo máximo. Continúa de [[08-redes-flujo/01-redes-flujo-conceptos|red,
capacidad y flujo]].

## Definición de corte

> **Definición.** Sea $N$ una red $f$-$s$ y sea $\{V_f, V_s\}$ una **partición** de los
> vértices de $N$ tal que $f \in V_f$ y $s \in V_s$. Entonces $\langle V_f, V_s \rangle$ se
> llama **corte $f$-$s$** en la red.

Se usa la notación $\langle X, Y \rangle$ para el conjunto de **arcos que van de un vértice
de $X$ a un vértice de $Y$**. El corte $\langle V_f, V_s \rangle$ es entonces el conjunto de
arcos que cruzan de la parte de la fuente a la parte del sumidero.

> **Ejemplo.** Para una red con vértices $\{f, a, b, c, d, s\}$ y la partición
> $V_f = \{f, a, b, d\}$, $V_s = \{c, s\}$:
> $$\langle V_f, V_s \rangle = \{(a,c),\; (d,c),\; (d,s)\}, \qquad \langle V_s, V_f \rangle = \{(c,d)\}$$
> $\langle V_f, V_s \rangle$ reúne los arcos que cruzan "hacia adelante" (de $V_f$ a $V_s$) y
> $\langle V_s, V_f \rangle$ los que cruzan "hacia atrás".

> **Observación.** El conjunto de arcos que salen de la fuente y el que entra al sumidero
> son casos particulares de corte:
> $$\operatorname{Sal}(f) = \langle f,\; V_N - \{f\} \rangle, \qquad \operatorname{Ent}(s) = \langle V_N - \{s\},\; s \rangle$$

## El flujo cruza todo corte

Todo camino que va de la fuente al sumidero tiene que atravesar el corte al menos una vez.

> **Proposición.** Sea $\langle V_f, V_s \rangle$ un corte $f$-$s$ en la red $N$. Entonces
> todo camino directo $f$-$s$ contiene al menos un arco de este conjunto de corte.

El siguiente lema descompone los arcos que salen (o entran) de la parte de la fuente en la
parte "interna" y la parte que cruza el corte. Con $\langle X, Y \rangle$ el conjunto de
arcos de $X$ a $Y$:

> **Lema.** Sea $\langle V_f, V_s \rangle$ cualquier corte $f$-$s$ en una red $N$. Entonces
> $$\bigcup_{v \in V_f} \operatorname{Sal}(v) = \langle V_f, V_f \rangle \cup \langle V_f, V_s \rangle$$
> $$\bigcup_{v \in V_f} \operatorname{Ent}(v) = \langle V_f, V_f \rangle \cup \langle V_s, V_f \rangle$$

> **Nota.** En el original la notación del corte y de los conjuntos aparece con algunas
> variantes de subíndice; acá se transcribe de forma uniforme como $\langle V_f, V_s \rangle$.

El valor de un flujo, medido en la fuente, puede leerse también sobre **cualquier** corte:
es el flujo que cruza hacia adelante menos el que cruza hacia atrás.

> **Proposición.** Sea $F$ un flujo en una red $N$ y sea $\langle V_f, V_s \rangle$ un corte.
> Entonces
> $$\operatorname{Val}(F) = \sum_{e \in \langle V_f, V_s \rangle} f(e) \; - \sum_{e \in \langle V_s, V_f \rangle} f(e)$$

> **Corolario.** En particular, tomando el corte pegado al sumidero,
> $$\operatorname{Val}(F) = \sum_{e \in \operatorname{Ent}(s)} f(e) \; - \sum_{e \in \operatorname{Sal}(s)} f(e)$$

Como consecuencia, **el valor del flujo es el mismo medido sobre cualquier corte**. En el
ejemplo de los apuntes, tres cortes distintos de la misma red dan todos
$\operatorname{Val}(F) = 10$, aunque sus capacidades difieren ($19$, $18$ y $14$); el de
capacidad $14$ es el más ajustado de los tres.

## Capacidad de corte y corte mínimo

> **Definición.** La **capacidad de un corte** $\langle V_f, V_s \rangle$ es la suma de las
> capacidades de sus arcos:
> $$K = \operatorname{cap}\langle V_f, V_s \rangle = \sum_{e \in \langle V_f, V_s \rangle} \operatorname{cap}(e)$$
> Solo se suman los arcos que cruzan **hacia adelante** (de $V_f$ a $V_s$).

> **Definición.** $K^{*}$ es un **corte mínimo** si tiene capacidad mínima entre todos los
> cortes:
> $$\operatorname{cap}(K^{*}) \leq \operatorname{cap}(K), \qquad \forall\, \text{corte } K$$

## Certificado de optimalidad

Cuando el valor de un flujo alcanza la capacidad de un corte, ambos son óptimos a la vez.

> **Corolario.** Sea $F$ un flujo en una red $N$ y sea $K$ un corte. Si
> $$\operatorname{Val}(F) = \operatorname{cap}(K)$$
> entonces $F$ es un **flujo máximo** y $K$ es un **corte mínimo**.

Este corolario es la mitad "fácil" del teorema de max-flow min-cut: como el valor de todo
flujo está acotado por la capacidad de todo corte, la igualdad solo puede darse en el
óptimo de ambos. El [[08-redes-flujo/03-ford-fulkerson|teorema de Ford–Fulkerson]] cierra
la otra mitad: ese óptimo siempre existe y se alcanza.

---

## Ver también

- [[08-redes-flujo/01-redes-flujo-conceptos]] — red $f$-$s$, capacidad, flujo y valor del flujo
- [[08-redes-flujo/03-ford-fulkerson]] — camino de aumento y teorema de max-flow min-cut
- [[08-redes-flujo/04-conectividad-local]] — conectividad local y aristas separadoras
