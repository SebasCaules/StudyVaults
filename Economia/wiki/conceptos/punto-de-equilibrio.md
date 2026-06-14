---
tags: [unit-06, formula]
aliases: [break-even, punto de equilibrio económico, pseudo-equilibrio]
---

## Definición

**Punto de equilibrio:** volumen $q^*$ para el cual el **beneficio es nulo**: los ingresos totales igualan a los costos totales ($IT = CT$). Por debajo se pierde; por encima, cada unidad adicional suma su [[contribucion-marginal]] completa a la ganancia.

## Fórmula

Con ingresos y costos lineales ($IT = p \cdot q$, $CT = CF + cv \cdot q$):

$$IT = CT \;\Rightarrow\; p\,q^* = CF + cv\,q^* \;\Rightarrow\; \boxed{q^* = \frac{CF}{p - cv} = \frac{CF}{cm}}$$

**Donde:**
- $q^*$: cantidad de equilibrio (unidades)
- $p$: precio unitario
- $cv$: costo variable unitario
- $CF$: costos fijos totales del período
- $cm = p - cv$: contribución marginal unitaria

En pesos de venta: $V^* = CF / \left(\frac{p-cv}{p}\right)$ (fijos sobre la razón de contribución).

## Gráfico

La recta $IT$ (desde el origen, pendiente $p$) corta a la recta $CT$ (ordenada $CF$, pendiente $cv$) en $q^*$. A la izquierda, zona de pérdida; a la derecha, de ganancia.

## Pseudo-equilibrio (multiproducto)

Cuando hay costos fijos **propios** del producto ($F_{propios}$) y fijos **asignados** por prorrateo de estructura común ($F_{asignados}$), aparecen dos cortes con la recta de ventas $V = p\,Q_i$:

| Volumen | Situación |
|---|---|
| $Q < Q_{pseudoeq}$ (zona A) | No cubre ni sus fijos propios: pierde "en serio" |
| $Q_{pseudoeq} < Q < Q_{eq}$ (zona B) | Cubre sus fijos propios pero no los asignados: "pierde" contablemente, **pero contribuye** a los fijos comunes |
| $Q > Q_{eq}$ (zona C) | Cubre todo: equilibrio pleno superado |

**Donde:**
- $Q_{pseudoeq}$: equilibrio contando solo $F_{propios}$
- $Q_{eq}$: equilibrio contando $F_{propios} + F_{asignados}$

Lectura gerencial: eliminar un producto en zona B **empeora** el resultado global — los fijos comunes no desaparecen con él.

## Ejemplo

$CF = 8.000$, $p = 10$, $cv = 6$: $q^* = 8.000/4 = 2.000$ u (o $V^* = 8.000/0{,}4 = \$20.000$). Vendiendo 2.500 u: $\pi = 4 \times 500 = \$2.000$.

## Errores comunes / Distinciones

- Usar el **costo total medio** en lugar de $cv$: los fijos ya están en el numerador; meterlos en el denominador los cuenta dos veces.
- Olvidar el **rango relevante**: la linealidad de $CF$ y $cv$ vale en un intervalo de actividad; fuera de él los "fijos" saltan.
- **No confundir con el [[umbral-rentabilidad]] de la U3:** allí es un *precio* ($\min CTMe$, con costos en U y $q$ óptima endógena); acá es una *cantidad*, con $p$ dado y costos lineales — herramienta de gestión, no de equilibrio de mercado.
- En zona B del pseudo-equilibrio, concluir "el producto da pérdida, lo elimino": los $F_{asignados}$ son [[costo-hundido]] para esa decisión.

## Relacionado con
- [[contribucion-marginal]]
- [[costos-fijos-variables]]
- [[sistemas-de-costeo]]
- [[umbral-rentabilidad]]
- [[punto-cierre]]
