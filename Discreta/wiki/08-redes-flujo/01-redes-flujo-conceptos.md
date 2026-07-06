---
tags: [teoria, unidad-9, redes-flujo, flujo, capacidad]
fuente: raw/resumenes/resumen-discreta.pdf
unidad: 9
tipo: teoria
actualizado: 2026-07-05
---

# Redes de flujo: red, capacidad y flujo

Esta página abre la unidad de **redes de flujo** (P9): qué es una red con fuente y
sumidero, cómo se asignan capacidades a los arcos y qué condiciones debe cumplir una
función para ser un flujo válido. Sobre estas definiciones se apoyan los [[08-redes-flujo/02-cortes-min-cut|cortes]]
y el [[08-redes-flujo/03-ford-fulkerson|teorema de Ford–Fulkerson]].

## Red con fuente y sumidero

> **Definición.** Una **red $N$ con una fuente simple y un sumidero simple** es un
> dígrafo conexo que tiene un vértice distinguido llamado **fuente** ($f$), con grado de
> salida distinto de cero, y un vértice distinguido llamado **sumidero** ($s$), con grado
> de entrada distinto de cero.

Se abrevia como **red $f$-$s$**. La fuente es el vértice del que sale el material y el
sumidero, aquel al que llega.

> **Definición.** Una **red con capacidad** es un dígrafo conexo tal que cada arco $e$
> tiene asignada una **capacidad** no negativa $\operatorname{cap}(e)$, llamada capacidad
> del arco $e$.

Para trabajar con los arcos que entran y salen de un vértice se usan estos dos conjuntos.
Sea $v$ un vértice de la red:

> **Definiciones.** Con $E_N$ el conjunto de arcos de la red,
> $$\operatorname{Sal}(v) = \{\, e \in E_N : \text{la cola de } e = v \,\}$$
> $$\operatorname{Ent}(v) = \{\, e \in E_N : \text{la cabeza de } e = v \,\}$$
> donde la **cola** de un arco es su vértice de origen y la **cabeza**, su vértice de
> destino. Es decir, $\operatorname{Sal}(v)$ son los arcos que salen de $v$ y
> $\operatorname{Ent}(v)$ los que entran a $v$.

> **Observación.** Si las capacidades son fraccionarias, se las convierte a números
> enteros multiplicando por el $\operatorname{mcm}$ de los divisores.

## Flujo

Un flujo reparte material sobre los arcos respetando las capacidades y sin acumular ni
perder material en los vértices internos.

> **Definición.** Sea $N$ una red $f$-$s$ con capacidad. Un **flujo** en $N$ es una función
> $$F : E_N \to \mathbb{R}_{\geq 0}$$
> que asigna un número real no negativo $f(e)$ a cada arco $e$, tal que cumple:
>
> i) **Restricción de capacidad:** $f(e) \leq \operatorname{cap}(e)$ para todo arco $e$.
> ii) **Restricción de conservación:** para todo vértice interno (ni fuente ni sumidero),
>   lo que entra es igual a lo que sale,
>   $$\sum_{e \in \operatorname{Ent}(v)} f(e) = \sum_{e \in \operatorname{Sal}(v)} f(e), \qquad \forall v \in V_N,\; v \neq f,\; v \neq s$$

En los apuntes los arcos se rotulan como $\text{cap}/\text{flujo}$: por ejemplo $8/2$
indica un arco de capacidad $8$ por el que circula un flujo de $2$. La restricción de
conservación se pide **solo** en los vértices internos: en la fuente y el sumidero el
material no se conserva (de ahí que sea justamente donde se mide el valor del flujo).

> **Nota.** Si en algún vértice interno la conservación falla, la función asignada **no es
> un flujo válido**, aunque respete todas las capacidades.

## Valor del flujo

El **valor** de un flujo es el flujo neto que sale de la fuente.

> **Definición.** El **valor del flujo** $F$ en una red con capacidad $N$ es el flujo neto
> que sale de la fuente:
> $$\operatorname{Val}(F) = \sum_{e \in \operatorname{Sal}(f)} f(e) \; - \sum_{e \in \operatorname{Ent}(f)} f(e)$$
> es decir, la suma de lo que sale de $f$ menos lo que eventualmente vuelve a entrar a $f$.

## Flujo máximo

> **Definición.** Un flujo $F^{*}$ es un **flujo máximo** si tiene el mayor valor posible
> entre todos los flujos de la red:
> $$\operatorname{Val}(F) \leq \operatorname{Val}(F^{*}), \qquad \forall F \in N$$

El objetivo central de la unidad es calcular ese flujo máximo. El resultado clave es que
su valor coincide con la capacidad de un [[08-redes-flujo/02-cortes-min-cut|corte mínimo]]
(teorema de max-flow min-cut), y el [[08-redes-flujo/03-ford-fulkerson|algoritmo de
Ford–Fulkerson]] lo construye a partir de caminos de aumento.

---

## Ver también

- [[08-redes-flujo/02-cortes-min-cut]] — cortes $f$-$s$, capacidad de corte y corte mínimo
- [[08-redes-flujo/03-ford-fulkerson]] — camino de aumento y cálculo del flujo máximo
- [[08-redes-flujo/04-conectividad-local]] — conectividad local y aristas separadoras
