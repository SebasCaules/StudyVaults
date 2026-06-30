---
titulo: Cuartiles y percentiles
tipo: concepto
unidad: 1
tags: [estadistica-descriptiva, cuartiles, percentiles]
fuentes: ["[[estadistica-descriptiva-general]]", "[[tp1-estadistica-descriptiva]]"]
actualizado: 2026-06-06
---

# Cuartiles y percentiles

**En breve.** Los **cuartiles** parten la muestra ordenada en cuatro tramos de igual
cantidad de datos (deciles en 10, percentiles en 100); son la base del
[[boxplot|boxplot]] y del [[medidas-de-dispersion|IQR]], y describen *posición*
relativa sin verse afectados por valores extremos.

Así como la [[medidas-de-tendencia-central|mediana]] divide a los datos a la
mitad, los **cuartiles** los dividen en cuatro partes. Sea
$\tilde x_1 \le \tilde x_2 \le \dots \le \tilde x_n$ la muestra **ordenada**:

- $q_1$ (**primer cuartil**): deja el **25%** de los datos a su izquierda.
- $q_2$ (**segundo cuartil**): es la **[[medidas-de-tendencia-central|mediana]]**
  (50% a cada lado).
- $q_3$ (**tercer cuartil**): deja el **75%** a su izquierda.

![[cuartiles.svg]]

## Definición formal
El $j$-ésimo cuartil es un $q_j \in [\tilde x_k,\, \tilde x_{k+1}]$ tal que
$$
\frac{k}{n} \le j\cdot 0.25 < \frac{k+1}{n}.
$$
Cuando no se acumula **exactamente** la cantidad de datos requerida, se toma un
compromiso (p. ej. el promedio de dos observaciones contiguas). Hay ambigüedad:
distintos software/libros usan definiciones ligeramente distintas (en R, el
argumento `type` de `quantile`), pero las diferencias son insignificantes para
muestras grandes.

> **Observación.** El criterio que define a $q_j$ no es acumular **exactamente** $j\cdot 25\%$ de los datos, sino el criterio **"por lo menos"**: $q_j$ debe dejar por lo menos $j\cdot 25\%$ de los datos a su izquierda (incluyéndolo) y por lo menos $(1 - j\cdot 0.25)$ a su derecha (incluyéndolo). De ahí la ambigüedad: cuando los dos valores centrales en disputa no coinciden, cualquier valor del intervalo que los une satisface el criterio, y todos son cuantiles válidos. Solo cuando esos dos valores coinciden el cuantil es único y todos los métodos dan lo mismo.

## Deciles y percentiles
Análogamente, los **deciles** parten la muestra en 10 y los **percentiles** en
100 partes.

> **Intuición.** Decir "estoy en el percentil 90 de altura" significa que el 90% de la
> gente mide menos que vos. El percentil traduce un valor crudo a una **posición
> relativa** dentro del grupo, que es justo lo que hacen los puntajes estandarizados
> de exámenes o las curvas de crecimiento del pediatra.

> **Ejemplo.** Con $n = 60$ datos, el percentil 97 requiere acumular $0.97 \times 60 = 58.2$ datos — no entero. No se promedian los datos en posición 58 y 59; se **interpola linealmente** según la parte fraccionaria, que ubica el valor más cerca del dato 58 que del 59:
> $$ P_{97} = \tilde x_{58} + 0.2\,(\tilde x_{59} - \tilde x_{58}). $$
> En general, si $n \cdot p = k + f$ con $k$ entero y $0 < f < 1$:
> $$ P_p = \tilde x_k + f\,(\tilde x_{k+1} - \tilde x_k). $$

## Usos
- El **IQR** $= q_3 - q_1$ es una [[medidas-de-dispersion|medida de dispersión]]
  robusta.
- Definen la caja y los outliers del [[boxplot]].
- Con [[datos-agrupados]] se calculan por **interpolación lineal** sobre las
  frecuencias acumuladas → ver [[tecnica-datos-agrupados-interpolacion]].

> **Intuición.** El IQR no es solo un número: representa el **rango de valores típicos** de la muestra. Si $q_1 = 38$ y $q_3 = 43$, los datos "normales" caen entre 38 y 43; si en cambio $q_1 = 30$ y $q_3 = 50$, el 50% central está muy disperso y el valor central puede ser casi cualquier cosa. Mientras más alejados estén los cuartiles de la mediana, más dispersos están los datos típicos: el IQR da una noción de cuán predecible es la muestra en su zona media.
