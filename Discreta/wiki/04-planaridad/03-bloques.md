---
tags: [teoria, unidad-4, planaridad, bloques, grafo-bloque]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Descomposición en bloques

Tercera parte de la unidad de planaridad. Se descompone un grafo en sus **bloques**
(subgrafos $2$-conexos maximales), se relaciona a los bloques con los vértices de corte y
se define el **grafo bloque** $\mathrm{BL}(G)$. La descomposición es la base sobre la que
opera el [[04-algoritmo-planaridad|algoritmo de planaridad]], ya que un grafo es plano si
y solo si todos sus bloques lo son.

## Bloques

> **Definición.** Un **bloque** de un grafo es un subgrafo $2$-conexo maximal; es decir,
> un subgrafo que no tiene vértices de corte y que no está contenido propiamente en otro
> subgrafo con esa propiedad.

Las propiedades siguientes clasifican los tipos posibles de bloque.

i) **Bloque grande:** si un bloque tiene por lo menos $3$ vértices, entonces es un objeto
   maximal $2$-conexo.
ii) **Bloques degenerados:** los únicos otros tipos de bloques son los vértices aislados
   y las aristas de corte (puentes).

> **Proposición.** Dos bloques distintos de $G$ pueden tener **a lo sumo un** vértice en
> común.

## Bloques y vértices de corte

Los bloques particionan las aristas del grafo y se pegan entre sí exactamente por los
vértices de corte.

> **Corolarios.**
> i) El conjunto de aristas de los bloques de un grafo $G$ es una **partición** del
>    conjunto $E_G$.
> ii) Sea $x$ un vértice de $G$. Entonces $x$ es **vértice de corte** de $G$ si y solo si
>    $x$ está en dos bloques diferentes de $G$.
> iii) Sean $B_1$ y $B_2$ bloques distintos de un grafo conexo $G$, y sean $y_1 \in B_1$,
>    $y_2 \in B_2$ vértices tales que ninguno es vértice de corte de $G$. Entonces $y_1$
>    no es adyacente a $y_2$.

## Grafo bloque

La estructura de "quién se pega con quién" se resume en un grafo auxiliar.

> **Definición.** El **grafo bloque** $\mathrm{BL}(G)$ es un grafo cuyos vértices
> representan los bloques de $G$; dos de estos vértices están unidos por una arista simple
> si los bloques que representan tienen un vértice en común en $G$.

> **Definición.** Un **bloque hoja** es un bloque que contiene exactamente **un** vértice
> de corte de $G$ (es decir, un vértice hoja en $\mathrm{BL}(G)$).

> **Proposición.** Si un grafo $G$ tiene al menos un vértice de corte
> ($\#V_{\text{corte}}(G) \geq 1$), entonces $G$ tiene al menos $2$ bloques hoja.

## Apéndices de un subgrafo

Para extender una inmersión de a poco, se agregan al dibujo las piezas que le faltan: los
apéndices del subgrafo ya dibujado.

> **Definición.** Sea $H$ un subgrafo de $G$ conexo. Un **apéndice** de $H$ es:
> i) una arista que no está en $H$, pero cuyos dos extremos sí están en $H$; **o bien**
> ii) una componente conexa de $G - V_H$, junto con las aristas (y sus puntos de contacto)
>    que la conectan con $H$.

Cada apéndice se "cuelga" de $H$ por los vértices que comparte con él. Esos vértices
compartidos, y las relaciones de compatibilidad entre apéndices, son la materia prima del
[[04-algoritmo-planaridad|algoritmo de planaridad]].

---

## Ver también

- [[04-algoritmo-planaridad]] — apéndices, superposición y el procedimiento de decisión
- [[01-grafos-planos-euler]] — grafos planos, regiones y fórmula de Euler
- [[02-homeomorfismo-kuratowski]] — criterio de no planaridad de Kuratowski
