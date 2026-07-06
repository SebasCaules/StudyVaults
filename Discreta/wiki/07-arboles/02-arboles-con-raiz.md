---
tags: [teoria, unidad-7, arboles-con-raiz, arbol-m-ario, arbol-binario]
fuente: raw/3-Resumenes/Resumen M.Discreta.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Árboles con raíz y $m$-arios

Al orientar un árbol desde un vértice distinguido aparece la jerarquía padre–hijo, con la que
se definen niveles, altura y las familias de árboles $m$-arios y binarios que estructuran datos.

## De árbol a árbol con raíz

> **Definición.** Un **árbol dirigido** es un dígrafo cuyo grafo subyacente es un árbol.

> **Definición.** Un **árbol con raíz** es un árbol dirigido con un vértice distinguido, llamado
> **raíz** $r$, tal que para todo $v_i \in V_G$ existe un camino de $r \to v_i$.

> **Observación.** Un árbol con raíz es un árbol dirigido en el que $\operatorname{gr}_{ent}(r) = 0$
> y $\operatorname{gr}_{ent}(v_i) = 1$ para todo $v_i \in V_G$ distinto de la raíz, donde
> $\operatorname{gr}_{ent}$ es el grado de entrada.

## Nivel y altura

> **Definición.** En un árbol con raíz, la **profundidad** (o **nivel**) de un vértice $v$ es la
> distancia entre $v$ y la raíz $r$.

> **Definición.** La **altura** de un árbol con raíz es la longitud del camino más largo desde $r$.

## Nomenclatura de parentesco

Sobre el camino $\langle r - v \rangle$ que une la raíz con cada vértice se define el vocabulario familiar:

| Término | Definición |
|---|---|
| Padre | El vértice que precede inmediatamente a $v$ en el camino $\langle r - v \rangle$ |
| Hijos | Todos los vértices que tienen a $v$ como padre |
| Hermanos | Vértices que tienen un mismo padre |
| Descendiente | $w$ es descendiente de $v$ si $v$ se encuentra en el camino $\langle r - w \rangle$ |
| Antecesor | $v$ es antecesor de $w$ si $v$ se encuentra en el camino $\langle r - w \rangle$ |
| Hoja | Vértice que no tiene hijos |
| Vértice interno | Vértice que no es hoja ni raíz |

**Observación.** Todo vértice es antecesor y descendiente **no propios** de sí mismo.

## Árboles $m$-arios

> **Definición.** Un **árbol $m$-ario** (con $m \ge 2$) es un árbol con raíz en el cual todo
> vértice tiene $m$ o menos hijos.

> **Definición.** Un **árbol $m$-ario completo** es un árbol $m$-ario en el cual todos los
> vértices internos tienen exactamente $m$ hijos y todas las hojas tienen el mismo nivel.

La cantidad de vértices por nivel crece geométricamente con la aridad.

> **Proposición.** Un árbol $m$-ario tiene a lo sumo $m^{k}$ vértices en el nivel $k$.

De acotar los vértices nivel por nivel sale la relación entre cantidad de vértices y altura.

> **Teorema.** Sea $T$ un árbol $m$-ario con $n$ vértices y altura $h$. Entonces
> $$h + 1 \le n \le \frac{m^{h+1} - 1}{m - 1}$$
> donde $n$ es la cantidad de vértices, $h$ la altura y $m$ la aridad máxima.

## Árboles isomorfos y ordenados

> **Definición.** Dos árboles con raíz son **isomorfos** si hay un isomorfismo de grafos entre
> ellos que mapea raíz a raíz.

> **Definición.** Un **árbol ordenado** es un árbol con raíz en el cual cada hijo de cada vértice
> tiene asignado un orden fijo.

> **Notación (dibujo plano estándar).** De un árbol ordenado se dibuja la raíz arriba de todo,
> los vértices de un mismo nivel horizontalmente alineados y el orden izquierda–derecha de los
> vértices concordando con su orden prescripto. Con esta convención, un mismo conjunto de
> operandos y operadores distingue por ejemplo $(a * b) - c$ de $c - (a * b)$.

## Árboles binarios

> **Definición.** Un **árbol binario** es un árbol $2$-ario en el cual cada hijo es designado
> **hijo izquierdo** o **hijo derecho**.

> **Definición.** Tomando un vértice $v$ como referencia, el **subárbol izquierdo** (resp.
> **derecho**) de $v$ se obtiene tomando su hijo izquierdo (resp. derecho) y el subárbol que
> cuelga de ese hijo.

> **Teorema.** Un árbol binario completo de altura $h$ tiene $2^{h+1} - 1$ vértices.

> **Corolario.** Todo árbol binario de altura $h$ tiene a lo sumo $2^{h+1} - 1$ vértices.

---

## Ver también

- [[07-arboles/01-arboles-y-bosques]] — definiciones base y caracterizaciones de árbol
- [[07-arboles/03-recorridos-y-expresion]] — recorridos, árboles de expresión y BST
- [[07-arboles/04-arboles-recubridores]] — árboles recubridores, DFS y BFS
