---
tags: [teoria, unidad-4, planaridad, homeomorfismo, kuratowski]
fuente: raw/Resumenes/Resumen_M_Discreta.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Homeomorfismo y teorema de Kuratowski

Segunda parte de la unidad de planaridad. Se define la relación de homeomorfismo entre
grafos —que preserva la planaridad— y se enuncia el teorema de Kuratowski, que
caracteriza exactamente a los grafos no planos por la presencia de un subgrafo
homeomorfo a $K_5$ o a $K_{3,3}$.

## Homeomorfismo

> **Definición.** Dos grafos $G$ y $H$ son **homeomorfos** si son isomorfos, o si ambos
> pueden obtenerse del mismo grafo por una sucesión de subdivisiones.

La relación se construye a partir de dos operaciones inversas entre sí sobre las aristas.

### Subdivisión elemental de una arista

> **Definición.** Sea $e = \{u, v\}$ una arista del grafo $G$. **Subdividir** $e$ significa
> agregar un vértice $w$ a $V_G$ y reemplazar $e$ por las dos aristas
> $$e' = \{u, w\}, \qquad e'' = \{w, v\}$$

Gráficamente, una arista $u \,\text{---}\, v$ pasa a ser un camino $u \,\text{---}\, w \,\text{---}\, v$
con un vértice nuevo $w$ de grado $2$ en el medio.

### Remoción débil de un vértice

> **Definición.** **Remover débilmente** un vértice es la operación inversa a la
> subdivisión. Sea $w$ un vértice de **grado $2$** en $G$, tal que $e' = \{u, w\}$ y
> $e'' = \{w, v\}$ son las aristas incidentes en él. Remover débilmente $w$ significa
> sacar $w$ de $V_G$ y reemplazar $e'$ y $e''$ por la única arista
> $$e = \{u, v\}$$

Es decir, el camino $u \,\text{---}\, w \,\text{---}\, v$ vuelve a colapsar en la arista
$u \,\text{---}\, v$.

> **Observación.** La relación de homeomorfismo es una relación de **equivalencia**
> (reflexiva, simétrica y transitiva).

## Homeomorfismo y planaridad

El homeomorfismo importa en esta unidad porque **no altera** el carácter plano de un
grafo: subdividir o remover débilmente vértices de grado $2$ no crea ni elimina cruces.

> **Proposición.** Si el grafo $G$ es homeomorfo o isomorfo al grafo $H$, entonces
> $$H \text{ es plano} \iff G \text{ es plano}$$

## Teorema de Kuratowski

Los grafos $K_5$ (completo de $5$ vértices) y $K_{3,3}$ (bipartito completo $3 \times 3$)
son los dos grafos no planos mínimos. Kuratowski afirma que **todo** grafo no plano
contiene una copia (salvo subdivisiones) de alguno de ellos.

> **Teorema (Kuratowski).** Un grafo no es plano si y solo si contiene un subgrafo
> homeomorfo a $K_5$ o a $K_{3,3}$.

El teorema convierte la no planaridad en algo **exhibible**: para justificar que un grafo
no es plano, alcanza con señalar dentro de él un subgrafo que, tras remover débilmente
sus vértices de grado $2$, sea $K_5$ o $K_{3,3}$.

---

## Ver también

- [[01-grafos-planos-euler]] — grafos planos, regiones y fórmula de Euler
- [[03-bloques]] — descomposición en bloques 2-conexos
- [[04-algoritmo-planaridad]] — decisión algorítmica de planaridad por apéndices y regiones
