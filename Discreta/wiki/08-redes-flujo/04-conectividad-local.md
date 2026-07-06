---
tags: [teoria, unidad-9, redes-flujo, conectividad-local, aristas-separadoras]
fuente: raw/resumenes/resumen-discreta.pdf
unidad: 9
tipo: teoria
actualizado: 2026-07-05
---

# Conectividad local y aristas separadoras

Como cierre de la unidad de redes de flujo, el material conecta el flujo máximo con la
**conectividad por aristas**: cuando todas las capacidades valen $1$, la capacidad de un
corte mínimo cuenta cuántas aristas hay que quitar para desconectar la fuente del sumidero.
Es la versión "por aristas" del teorema de max-flow min-cut visto en
[[08-redes-flujo/03-ford-fulkerson|Ford–Fulkerson]].

## Conectividad local

> **Definición.** La **conectividad local por aristas** $K_e(s, t)$ es el mínimo número de
> aristas que hay que remover para desconectar $s$ de $t$.

La conectividad por aristas del grafo entero es el peor caso sobre todos los pares de
vértices.

> **Proposición.** La conectividad por aristas de $G$ es
> $$K_e(G) = \min_{s,\, t \in V_G} K_e(s, t)$$
> es decir, el mínimo de la conectividad local tomado sobre todos los pares de vértices.

## Aristas separadoras

> **Definición.** Un conjunto de aristas es un conjunto de **aristas separadoras** $f$-$s$
> si, al eliminarlas, se destruyen todos los caminos directos de $f$ a $s$.

Separar $f$ de $s$ y cortar la red son la misma idea vista desde los dos lados: quitar un
conjunto separador deja la fuente sin ningún camino hacia el sumidero.

## Corte mínimo con capacidades unitarias

Cuando cada arco tiene capacidad $1$, la capacidad de un corte es simplemente su cantidad de
arcos, y el teorema de max-flow min-cut se traduce a un enunciado puramente combinatorio.

> **Proposición.** Sea $N$ una red $f$-$s$ tal que $\operatorname{cap}(e) = 1$ para todas las
> aristas. Entonces la capacidad de un corte mínimo $f$-$s$ en la red $N$ es igual al
> **mínimo número de aristas separadoras** de $f$-$s$.

Esta es la forma "por aristas" del teorema de Menger: el máximo número de caminos
$f$-$s$ arista-disjuntos (que con capacidades unitarias es el valor del flujo máximo)
coincide con el mínimo número de aristas cuya remoción separa $f$ de $s$.

---

## Ver también

- [[08-redes-flujo/02-cortes-min-cut]] — cortes, capacidad de corte y corte mínimo
- [[08-redes-flujo/03-ford-fulkerson]] — teorema de max-flow min-cut y flujo máximo
- [[08-redes-flujo/01-redes-flujo-conceptos]] — red $f$-$s$, capacidad y flujo
