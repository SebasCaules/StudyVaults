---
titulo: Boxplot (diagrama de caja)
tipo: concepto
unidad: 1
tags: [estadistica-descriptiva, boxplot, outliers]
fuentes: ["[[estadistica-descriptiva-general]]"]
actualizado: 2026-06-06
---

# Boxplot (diagrama de caja)

**En breve.** El boxplot dibuja la muestra con apenas cinco números (mínimo,
$q_1$, mediana, $q_3$, máximo) y marca automáticamente los outliers; es la
herramienta más rápida para comparar varias muestras y ver de un vistazo centro,
dispersión y [[asimetria-y-curtosis|asimetría]].

Gráfico que resume la distribución usando los [[cuartiles-y-percentiles|cuartiles]],
sin graficar todas las observaciones.

## Anatomía
- **Caja**: va de $q_1$ a $q_3$ → representa el **50% central** de los datos.
- **Línea dentro de la caja**: la [[medidas-de-tendencia-central|mediana]] $q_2$.
- **Bigotes**: se extienden hasta el mínimo y el máximo *"normales"*.
- **Outliers**: puntos sueltos, datos atípicos (ver abajo).

## Outliers — regla de Tukey
Basada en el [[medidas-de-dispersion|rango intercuartil]] $\text{IQR}=q_3-q_1$:
$$ L_W = q_1 - 1.5\cdot\text{IQR}, \qquad U_W = q_3 + 1.5\cdot\text{IQR}. $$
Los datos que **exceden** estos límites $[L_W, U_W]$ se consideran **outliers**.
Los bigotes llegan hasta el dato más extremo que aún esté dentro de los límites.

> **Intuición.** El factor $1.5$ es una convención: define un "margen razonable" de
> ancho una vez y media la caja a cada lado. Como el [[medidas-de-dispersion|IQR]]
> solo usa el 50% central, este criterio es **robusto** — un outlier no agranda la
> regla que sirve para detectarlo, a diferencia de lo que pasaría usando media y
> desvío (que el propio outlier inflaría).

> **Cuidado:** El bigote se dibuja solo donde hay datos. Si no hay ninguna observación en el tramo $[L_W, q_1)$, el bigote inferior se queda en $q_1$ (no baja hasta $L_W$); lo mismo arriba con $q_3$ y $U_W$. Los límites de Tukey son el umbral para clasificar outliers, no el extremo del bigote.

## Lectura de la forma
La distancia desigual de $q_1$ y $q_3$ a la mediana revela **[[asimetria-y-curtosis|asimetría]]**.
Para comparar muestras, se grafican varios boxplots en paralelo sobre el mismo eje.
