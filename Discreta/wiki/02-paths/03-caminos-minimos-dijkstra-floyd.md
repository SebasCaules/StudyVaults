---
tags: [teoria, unidad-2, camino-minimo, dijkstra, floyd-warshall]
fuente: raw/resumenes/resumen-matematica-discreta.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Caminos mínimos: Dijkstra y Floyd–Warshall

Dos algoritmos para calcular la [[01-caminos-y-circuitos#distancia|distancia]] $d(s,t)$ en un
grafo con aristas ponderadas. Dijkstra resuelve el camino más corto desde un origen fijo;
Floyd–Warshall calcula de una vez las distancias entre **todos** los pares de vértices y admite
dígrafos y pesos negativos.

## Algoritmo de Dijkstra

> **Idea.** Dijkstra halla el camino más corto entre dos vértices $s$ y $t$ en un grafo con
> aristas ponderadas, propagando etiquetas desde el origen.

Se lleva una tabla en la que cada vértice recibe una **etiqueta** $(d, p)$, donde $d$ es la
distancia acumulada provisoria desde el origen $s$ y $p$ es el vértice **previo** por el que se
llega. Cada columna $I_0, I_1, \dots$ es una iteración del algoritmo:

1. **Inicialización ($I_0$).** El origen recibe $(-, s)$ con distancia $0$; cada vecino directo
   $v$ de $s$ recibe $(w(s,v),\, s)$; el resto arranca en $\infty$.
2. **Fijar (settlear).** En cada columna se fija de forma definitiva el vértice **no fijado** de
   menor etiqueta. Su distancia ya no cambia.
3. **Relajar.** Desde el vértice recién fijado $u$ se actualizan sus vecinos $v$: si
   $d(u) + w(u,v) < d(v)$, la etiqueta de $v$ pasa a $(d(u)+w(u,v),\, u)$.
4. Se repite hasta fijar todos los vértices (o hasta fijar el destino $t$).

> **Nota (desempate).** Cuando dos vértices no fijados empatan en la etiqueta mínima, **se
> desempata por orden léxico** del nombre del vértice.

En el ejemplo de los apuntes, con origen $s$, los vértices se van fijando en el orden

$$s \;(0) \ \to\ e \;(4) \ \to\ a \;(5) \ \to\ g \;(5) \ \to\ b \;(7) \ \to\ \dots$$

donde $a$ se fija antes que $g$ por el desempate léxico (ambos con etiqueta $(5, s)$). La
distancia final a cada vértice se lee en su última etiqueta, y el camino se reconstruye
siguiendo hacia atrás los predecesores $p$.

> **Nota.** La tabla completa del ejemplo (vértices $s, g, a, e, b, f, c, d$) es un manuscrito
> denso; acá se transcribe el mecanismo y el orden de fijado de los primeros vértices, que es lo
> que la caligrafía permite leer sin ambigüedad. Las etiquetas finales de la cola ($f, c, d$)
> son *(dudosas en el original)* por superposición de anotaciones.

## Algoritmo de Floyd–Warshall

> **Idea.** Al igual que Dijkstra, Floyd–Warshall calcula distancias entre vértices, con la
> ventaja de servir en grafos dirigidos o no y de admitir **pesos negativos**.

Trabaja con una sucesión de matrices $D^0, D^1, \dots, D^n$. La entrada $(i, s)$ de $D^k$ es la
distancia más corta de $v_i$ a $v_s$ **usando como escalas intermedias solo** los vértices
$v_1, \dots, v_k$.

**Procedimiento.**

1. Se arma la matriz inicial $D^0$: en la entrada $(v_i, v_s)$ va la distancia **directa** de
   $v_i$ a $v_s$. Si $i = s$ vale $0$; si no hay arista directa vale $\infty$.
2. En cada paso $k$ se "habilita" el vértice $v_k$ como escala intermedia y se recalcula toda la
   matriz con la regla de abajo, obteniendo $D^1$ (pasando por $v_1$), $D^2$ (por $v_2$), etc.

La actualización de cada entrada compara "no pasar por $v_k$" contra "pasar por $v_k$":

$$D^{k}_{is} = \min\left\{\, D^{k-1}_{is}, \ \ D^{k-1}_{ik} + D^{k-1}_{ks} \,\right\}$$

donde $D^{k-1}_{is}$ es la mejor distancia previa de $v_i$ a $v_s$, y
$D^{k-1}_{ik} + D^{k-1}_{ks}$ es el rodeo que pasa por $v_k$.

**Observaciones.**

i) La **última** matriz tiene en el lugar $(i, s)$ el camino más corto entre $v_i$ y $v_s$.
ii) Si el grafo tiene $n$ vértices, se generan en total $n$ matrices de $n \times n$, sin contar
   la matriz inicial $D^0$.

### Ejemplo trabajado

Dígrafo ponderado de 4 vértices $v_1, v_2, v_3, v_4$. La matriz de distancias directas es

$$D^0 = \begin{pmatrix} 0 & 8 & \infty & 1 \\ \infty & 0 & 1 & \infty \\ 4 & \infty & 0 & \infty \\ \infty & 2 & 9 & 0 \end{pmatrix}$$

Habilitando $v_1$, luego $v_2$ y luego $v_3$ como escalas:

$$D^1 = \begin{pmatrix} 0 & 8 & \infty & 1 \\ \infty & 0 & 1 & \infty \\ 4 & 12 & 0 & 5 \\ \infty & 2 & 9 & 0 \end{pmatrix} \qquad D^2 = \begin{pmatrix} 0 & 8 & 9 & 1 \\ \infty & 0 & 1 & \infty \\ 4 & 12 & 0 & 5 \\ \infty & 2 & 3 & 0 \end{pmatrix}$$

$$D^3 = \begin{pmatrix} 0 & 8 & 9 & 1 \\ 5 & 0 & 1 & 6 \\ 4 & 12 & 0 & 5 \\ 7 & 2 & 3 & 0 \end{pmatrix}$$

Finalmente, habilitando $v_4$, se obtiene la matriz de distancias mínimas entre todos los pares:

$$D^4 = \begin{pmatrix} 0 & 3 & 4 & 1 \\ 5 & 0 & 1 & 6 \\ 4 & 7 & 0 & 5 \\ 7 & 2 & 3 & 0 \end{pmatrix}$$

Por ejemplo, la distancia de $v_3$ a $v_2$ es $7$ (el rodeo $v_3 \to v_1 \to v_4 \to v_2$),
mientras que la arista directa $v_3 \to v_2$ no existía en $D^0$.

---

## Ver también

- [[01-caminos-y-circuitos]] — definición de distancia $d(s,t)$ en grafos y dígrafos
- [[02-euler-y-hamilton]] — los otros recorridos con nombre propio de la unidad P2
- [[01-grafos/04-representacion-matricial]] — matrices de adyacencia, la representación de la que parte $D^0$
