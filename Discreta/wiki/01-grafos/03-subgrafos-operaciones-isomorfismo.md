---
tags: [teoria, unidad-1, subgrafo, operaciones, complemento, isomorfismo]
fuente: raw/resumenes/resumen-matematica-discreta.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Subgrafos, operaciones e isomorfismo

Cómo extraer partes de un grafo (subgrafos, recubridores, inducidos), cómo combinarlos
(operaciones de suma y resta, complemento) y cómo compararlos (isomorfismo).
Transcripto de los apuntes de la cursada 2023-2C.

## Subgrafo

> **Definición.** Un **subgrafo** de un grafo (o dígrafo) $G$ es un grafo $H$ tal que
> $V_H \subseteq V_G$ y $E_H \subseteq E_G$.

> **Definición.** $H$ es un subgrafo **recubridor** de $G$ si $V_G = V_H$ (conserva
> **todos** los vértices y sólo se queda con algunas aristas).

## Grafo inducido

> **Definición.** Sea $G = (V, E)$ un grafo (dirigido o no) y sea $\emptyset \neq U \subseteq V$.
> El **subgrafo de $G$ inducido por $U$** es el subgrafo cuyo conjunto de vértices es $U$
> y que contiene **todas** las aristas de $G$ con ambos extremos en $U$:
> - $(x, y)$ para $x, y \in U$, si es dirigido;
> - $\{x, y\}$ para $x, y \in U$, si es no dirigido.
>
> Notación: $G(U)$.

La clave del inducido es que, fijado el conjunto de vértices $U$, se **arrastran
obligatoriamente** todas las aristas de $G$ que quedan dentro de $U$; no se elige cuáles.

## Operaciones

Sea $G$ un grafo con conjuntos de vértices $V_G$ y aristas $E_G$; se nota $G'$ al grafo
resultante.

| Operación | Efecto sobre vértices | Efecto sobre aristas |
|---|---|---|
| **Resta de vértice** $G - v$ | $V_G' = V_G - \{v\}$ | $\#E_G' = \#E_G - \operatorname{gr}(v)$ |
| **Resta de arista** $G - e$ | $V_G' = V_G$ | $E_G' = E_G - \{e\}$ |
| **Suma de vértice** $G \cup \{v\}$ | $V_G' = V_G \cup \{v\}$ | $\#E_G' = \#E_G$ |
| **Suma de arista** $G \cup \{e\}$ | $V_G' = V_G$ | $E_G' = E_G \cup \{e\}$ |

- Al **restar un vértice** se pierden todas las aristas que incidían en él: por eso el
  descuento de aristas es exactamente $\operatorname{gr}(v)$, su [[02-grafos-y-grados|grado]].
- Al **sumar un vértice** no se agrega ninguna arista nueva: el vértice entra aislado, y
  por eso $\#E_G'$ no cambia.

### Suma de dos grafos

> **Definición.** La suma $G + H$ de dos grafos tiene
> $$V_{G+H} = V_G \cup V_H, \qquad E_{G+H} = E_G \cup E_H \cup \{\, e = \{u, v\} : u \in V_G,\ v \in V_H \,\}$$

Es decir, se unen los dos grafos y **además** se conectan todos los vértices de $G$ con
todos los de $H$ (el bloque nuevo de aristas cruzadas).

## Complemento

> **Definición.** El **complemento** $\overline{G}$ (también $G^{c}$) es el subgrafo de
> $K_n$ formado por los $n$ vértices de $G$ y **todas las aristas que no están en $G$**.

Sobre el mismo conjunto de vértices, $\overline{G}$ tiene exactamente las aristas que le
faltan a $G$ para ser el completo $K_n$ (ver [[01-familias-de-grafos|grafo completo]]).

## Isomorfismo

> **Definición.** Sean $G_1 = (V_1, E_1)$ y $G_2 = (V_2, E_2)$ ambos grafos **simples y
> no dirigidos**. Una función $f : V_1 \to V_2$ es un **isomorfismo de grafos** si:
> 1. $f$ es **biyectiva**;
> 2. para todo $a, b \in V_1$, se cumple $\{a, b\} \in E_1 \iff \{f(a), f(b)\} \in E_2$.

La segunda condición dice que $f$ preserva la adyacencia en ambos sentidos: dos vértices
son vecinos en $G_1$ exactamente cuando sus imágenes lo son en $G_2$.

**Observaciones.**

i) Las propiedades que se **conservan** por isomorfismo son $\#V$, $\#E$ y el grado
   $\operatorname{gr}(v_i)$ de cada vértice. (Sirven como **invariantes**: si dos grafos
   difieren en alguna, no pueden ser isomorfos.)
ii) La relación de isomorfismo es una **relación de equivalencia**.

---

## Ver también

- [[01-familias-de-grafos]] — $K_n$ y demás familias que aparecen como complemento o suma
- [[02-grafos-y-grados]] — grado, base del descuento de aristas y de los invariantes
- [[04-representacion-matricial]] — matrices que ayudan a chequear isomorfismo
