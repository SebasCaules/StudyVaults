---
tags: [teoria, unidad-1, grafos, grado, handshaking, bipartito]
fuente: raw/resumenes/resumen-matematica-discreta.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Grafos: definición, grados y bipartitos

Núcleo del práctico P1: qué es un grafo, cómo se clasifican sus aristas y sus tipos,
la noción de grado con el lema del apretón de manos, y los grafos bipartitos.
Transcripto de los apuntes de la cursada 2023-2C.

## Definición de grafo

> **Definición.** Un grafo $G(V, E)$ es una estructura matemática que consta de dos
> conjuntos:
> - $V \neq \emptyset$: los **vértices**,
> - $E$: las **aristas**, donde cada arista tiene asociado un conjunto de $1$ ó $2$
>   vértices.

El que cada arista tenga uno o dos vértices asociados es lo que deja lugar a los lazos
(un solo vértice) además de las aristas ordinarias (dos vértices).

## Tipos de aristas

- **Arista propia:** une dos vértices **distintos**.
- **Lazo:** une un vértice consigo mismo.
- **Multiarista:** colección de dos o más aristas que unen los **mismos** vértices.

## Tipos de grafos

- **Simple:** no tiene lazos ni multiaristas.
- **Multigrafo:** existe algún par $a, b \in V$ con dos o más aristas incidentes entre
  ellos.
- **Trivial:** $G(V, E)$ con $\#V = 1$ y $E = \emptyset$ (un único vértice, sin aristas).
- **Dígrafo:** tiene aristas **dirigidas**, cada una con una **cabeza** (donde llega la
  flecha) y una **cola** (de donde sale la flecha).
- **Subyacente:** el dígrafo visto **sin** direcciones (se le borran las flechas).

## Grado

> **Definición.** El grado de un vértice $v$ es
> $$\operatorname{gr}(v) = \#\{\text{aristas propias incidentes en } v\} + 2 \cdot \#\{\text{lazos en } v\}$$

Cada lazo cuenta **doble** porque incide dos veces sobre el mismo vértice.

**Observación.** La **secuencia de grados** de un grafo es la sucesión de los grados de
todos sus vértices, ordenados de forma decreciente.

### Handshaking (lema del apretón de manos)

> **Teorema (Handshaking).** En todo grafo, la suma de los grados de los vértices es el
> doble de la cantidad de aristas:
> $$\sum_{i=1}^{n} \operatorname{gr}(v_i) = 2 \cdot \#E$$

En particular esa suma es siempre **par**, porque cada arista aporta $2$ al total (uno
por cada extremo).

> **Corolario.** La cantidad de vértices de grado **impar** es par.

Es decir, $\#\{v_i : \operatorname{gr}(v_i) \text{ es impar}\}$ es un número par. Como la
suma total es par, los grados impares deben "aparearse" para cancelar su paridad.

### Grado en dígrafos

En un dígrafo se distinguen el grado de **entrada** (aristas que llegan al vértice) y el
grado de **salida** (aristas que salen). La suma de los grados de entrada, igual que la
suma de los grados de salida, cuenta cada arista exactamente una vez:

$$\sum_{v} \operatorname{gr}_{\text{ent}}(v) = \sum_{v} \operatorname{gr}_{\text{sal}}(v) = \#E$$

## Grafo bipartito

> **Definición.** Un grafo $G(V, E)$ es **bipartito** si su conjunto de vértices $V$
> puede particionarse en dos partes $V_1, V_2$ de modo que **cada arista tiene un
> extremo en $V_1$ y el otro en $V_2$**.

**Observaciones.**

i) Para que un grafo sea bipartito debe **existir** una partición con esa propiedad;
   no alcanza con cualquier partición (una partición cualquiera no lo garantiza).
ii) Se necesita $\#V \geq 2$ (el mínimo de vértices es $2$).
iii) Un grafo bipartito **no puede tener lazos** (un lazo tendría sus dos extremos en la
    misma parte).

> **Proposición.** Un grafo $G$ es bipartito $\iff$ no contiene ciclos de longitud impar.

Esta caracterización por ciclos aparece junto al material de caminos y ciclos; es la
herramienta práctica para decidir si un grafo es bipartito. El caso completo de esta
familia es el bipartito completo $K_{m,n}$ de [[01-familias-de-grafos]].

---

## Ver también

- [[01-familias-de-grafos]] — $K_n$, $C_n$, $K_{m,n}$, hipercubos y demás familias
- [[03-subgrafos-operaciones-isomorfismo]] — subgrafos, operaciones y complemento
- [[04-representacion-matricial]] — matrices de adyacencia e incidencia
