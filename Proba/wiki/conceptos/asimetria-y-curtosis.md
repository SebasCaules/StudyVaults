---
titulo: Asimetría y curtosis (parámetros de forma)
tipo: concepto
unidad: 1
tags: [estadistica-descriptiva, asimetria, curtosis, forma]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]", "[[estadistica-descriptiva-introduccion]]"]
actualizado: 2026-06-06
---

# Asimetría y curtosis (parámetros de forma)

**En breve.** Después del centro ([[medidas-de-tendencia-central|tendencia central]])
y la [[medidas-de-dispersion|dispersión]], estos dos coeficientes adimensionales
describen la **forma**: la **asimetría** dice hacia qué lado se estira la distribución
y la **curtosis** cuánto pesan sus colas comparada con la [[distribucion-normal|normal]].

Describen la **forma** de la distribución de los datos, más allá del centro y la
dispersión. Ambas son **adimensionales** (no dependen de la unidad).

## Coeficiente de asimetría (simetría)
$$
\gamma = \frac{\sum_{i=1}^n (x_i - \bar{x})^3}{n\, s^3}
$$
($s$ = [[medidas-de-dispersion|desvío estándar]].) Interpretación:
- $\gamma \approx 0$ → distribución **simétrica** respecto de la
  [[medidas-de-tendencia-central|media]].
- $\gamma > 0$ → **asimétrica a derecha** (cola larga a la derecha).
- $\gamma < 0$ → **asimétrica a izquierda**.
- Cuanto más lejos de 0, más asimétrica.

![[asimetria.svg]]

> **Intuición.** El cubo $(x_i-\bar x)^3$ **conserva el signo** del desvío: una cola
> larga a la derecha mete unos pocos términos positivos muy grandes que no se
> compensan, y la suma da $\gamma>0$. Es la misma cola que separa la media de la
> mediana, así que un truco de parcial es: si $\bar x > $ mediana, sospechar $\gamma>0$
> (cola a derecha).

## Coeficiente de curtosis (kurtosis)
$$
\kappa = \frac{\sum_{i=1}^n (x_i - \bar{x})^4}{n\, s^4} - 3
$$
Mide cuánto **peso** tienen las colas (qué tanto se concentran los datos lejos de
la media). El $-3$ usa como referencia la [[distribucion-normal|distribución normal]]
(convención usual; ver nota de discrepancia abajo):
- $\kappa \approx 0$ → colas similares a la normal.
- $\kappa < 0$ → colas **más livianas** que la normal (datos más concentrados) *(convención usual; la teórica la invierte, ver nota)*.
- $\kappa > 0$ → colas **más pesadas** que la normal *(convención usual; ver nota)*.

![[curtosis.svg]]

> ⚠️ Nota de signo (cuidado en parcial): la teórica define el caso $\kappa<0$ como
> "peso de las colas **mayor**" y $\kappa>0$ como "**menor**", lo cual es opuesto a
> la convención usual. Verificar con la cátedra cuál se toma como válida.

## Versión con corrección por muestra pequeña
Las slides introductorias ([[estadistica-descriptiva-introduccion]], slides 11-12)
presentan además una **versión corregida** de la asimetría y la curtosis. Esta
corrección **evita un sesgo en la estimación** del parámetro (se retoma al estudiar
[[estimacion-puntual|estimadores]] en U8); en el caso de la **curtosis**, la
corrección sirve solo para variables normales. Sobre el dataset de las 200 monedas
el efecto es pequeño: $\gamma$ pasa de $0.13174$ a $0.13274$ y $\kappa$ de
$-0.10237$ a $-0.04442$.

## Visualización
Se observan mejor **gráficamente** (forma de [[histograma-y-frecuencias|histograma]]
o [[boxplot]]) que por su valor numérico.

## Con datos agrupados
Mismas fórmulas incorporando la frecuencia $f_i$ y la marca de clase: ver
[[datos-agrupados]].
