---
titulo: Población y muestra
tipo: concepto
unidad: 1
tags: [estadistica-descriptiva, fundamentos]
fuentes: ["[[tp1-estadistica-descriptiva]]"]
actualizado: 2026-06-06
---

# Población y muestra

**En breve.** La **población** es el universo completo que se quiere estudiar y la
**muestra** es el subconjunto que efectivamente se observa; toda la
[[estadistica-descriptiva|estadística descriptiva]] trabaja sobre la muestra para
luego, vía [[inferencia-estadistica|inferencia]], sacar conclusiones sobre la población.

- **Población**: conjunto de todos los elementos/individuos cuyas características
  se quieren estudiar. A veces es imposible (población infinita), costoso o
  ridículo (si estudiar destruye los elementos) analizarla entera.
- **Muestra**: subconjunto de la población que sí se estudia. Idealmente
  **representativa**; una forma de lograrlo es elegir los elementos **al azar**.

> **Intuición.** Querés saber el peso promedio de *todos* los recién nacidos del país
> (población) pero no podés pesarlos a todos: pesás 100 al azar (muestra) y usás ese
> grupo como "ventana" hacia el total. Si la muestra está bien elegida, lo que ves en
> ella se parece a lo que pasa en la población; si está sesgada (p. ej. solo de una
> clínica privada), las conclusiones se distorsionan.

Sea $\{x_i\}_{i=1}^n$ el conjunto de características relevadas, con $n$ = cantidad
de individuos muestreados.

## Tipos de muestra
- **Cualitativa**: características no numéricas (p. ej. la profesión).
- **Cuantitativa**: características numéricas.

En la materia nos concentramos en **muestras cuantitativas**. Sobre ellas se
calculan las [[estadistica-descriptiva|medidas de resumen]].

## Conexión con probabilidad
La muestra es la contraparte observada de una [[variable-aleatoria]]: las medidas
de resumen muestrales (media, varianza) **estiman** parámetros poblacionales
($E[X]$, $V(X)$). Ese salto es el objeto de la [[inferencia-estadistica]].

> **Observación.** El parámetro poblacional (p. ej. $\mu$) es **fijo y desconocido**: si pudiéramos censar a toda la población siempre daría el mismo valor. El estadístico o estimador $\hat{\theta}$ (p. ej. la media muestral $\bar{X}_n$) es **variable antes de tomar la muestra** —porque la muestra podría haber sido otra— y **fijo una vez observada**. Esta distinción es central en inferencia: todo el cálculo probabilístico (sesgo, varianza del estimador, distribución muestral) se hace *antes* de ver los datos, cuando $\hat{\theta}$ todavía es una variable aleatoria.

> **Cuidado:** el estimador $\hat{\theta}$ y su forma de cálculo deben definirse **antes** de observar la muestra. Elegirlo a posteriori —mirando los datos— resta objetividad: los resultados terminan influyendo en la elección del método y pueden cambiar las conclusiones. Declararlo de antemano es lo que permite analizar su comportamiento probabilístico (su distribución, su sesgo) sin contaminarlo con lo que efectivamente salió en la muestra.
