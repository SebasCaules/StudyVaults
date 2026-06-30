---
titulo: Introducción a la Probabilidad
tipo: concepto
unidad: 2
tags: [hub, probabilidad]
fuentes: ["[[axiomas-probabilidad]]", "[[regla-de-laplace-slides]]", "[[independencia-condicional-bayes]]", "[[tp2-calculo-de-probabilidades]]"]
actualizado: 2026-06-06
---

# Introducción a la Probabilidad

**En breve.** Página índice de la Unidad 2: el modelo matemático de la incertidumbre.
Acá se arma todo el aparato (espacio muestral, axiomas, condicional, independencia,
Bayes) que después permite definir [[variable-aleatoria|variables aleatorias]] y sus
distribuciones.

Página **hub** de la Unidad 2. Mientras la [[estadistica-descriptiva]] describe
datos ya observados, la probabilidad **modela la incertidumbre** de un experimento
aleatorio *antes* de observarlo.

## Mapa de la unidad
- **[[espacio-muestral-y-eventos]]** — experimento $E$, espacio muestral $S$,
  eventos $A$, álgebra de sucesos y σ-álgebra.
- **[[leyes-de-de-morgan]]** — complemento de uniones e intersecciones y su uso
  probabilístico ("ninguno" → complemento de la unión).
- **[[axiomas-de-probabilidad]]** — los 3 axiomas de Kolmogorov y sus consecuencias
  ($P(A^c)$, monotonía, $P(A\cup B)$, inclusión-exclusión).
- **[[regla-de-laplace]]** — cálculo por conteo cuando los casos son equiprobables.
- **[[probabilidad-condicional]]** — $P(D\mid C)$: reducir el universo a $C$.
- **[[independencia]]** — cuándo un evento no informa sobre el otro.
- **[[probabilidad-total-y-bayes]]** — partición, ley de probabilidad total y el
  teorema de Bayes (a priori → a posteriori).
- **[[arbol-de-probabilidades]]** — las 4 reglas para organizar experimentos por
  etapas; síntesis gráfica de condicional, total y Bayes.

> **Intuición.** La aleatoriedad no es una propiedad absoluta del mundo: es una medida de nuestra ignorancia. Que yo no pueda predecir qué carta voy a sacar no significa que nadie pueda hacerlo —alguien que vea el mazo sí lo sabe. Algo es aleatorio *para quien no lo puede predecir*. La probabilidad es una herramienta para actuar razonablemente en medio de esa ignorancia, no para eliminarla.

> **Intuición.** La probabilidad de un suceso $A$ es el valor al que converge su frecuencia relativa al repetir el experimento muchas veces:
> $$P(A) = \lim_{n \to \infty} \frac{\#\{\text{ocurre } A\}}{n}.$$
> Aunque el experimento se haga una sola vez, ese límite imaginario —lo que se observaría corriendo infinitos escenarios— le da sentido al número $P(A)$ y motiva los axiomas que organizan la unidad.

## Fuentes
- [[axiomas-probabilidad]] · [[regla-de-laplace-slides]] · [[independencia-condicional-bayes]] ·
  [[tp2-calculo-de-probabilidades]] (guía TP2 con 8 ejercicios resueltos).

## Técnicas
- [[tecnica-conteo-combinatoria]] — principios de conteo, catálogo combinatorio,
  inclusión-exclusión, palomar, complemento.

## Hacia adelante
La probabilidad sobre eventos es la base para las [[variable-aleatoria|variables
aleatorias]] (unidades 3–5): una v.a. asigna números a los resultados y traslada
$P$ a distribuciones.

> **Cuidado:** Las probabilidades son *números* y los sucesos son *conjuntos*; no se mezclan las operaciones de uno con las del otro. La unión y la intersección operan sobre sucesos (dentro del argumento de $P$); la suma y la resta operan sobre los números que devuelve $P$. Escribir $P(A) \cup P(B)$ o $P(A + B)$ no tiene sentido: los números no se unen y los conjuntos no se suman.
