---
tags: [teoria, unidad-1, cinematica, tiro-oblicuo, movimiento-2d]
fuente: raw/2-Practicas/apuntes-cursada-2023-2c.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Tiro oblicuo

El tiro oblicuo es un movimiento en el plano que se resuelve como **dos
[[01-cinematica-1d|MRUV]] independientes acoplados por el tiempo**: sobre el eje horizontal la
velocidad es constante (aceleración nula) y sobre el vertical actúa la gravedad. El nexo entre
ambos ejes es siempre el mismo instante $t$.

## Ecuaciones horarias

Con origen en el punto de lanzamiento y $g$ apuntando hacia abajo, las posiciones sobre cada eje
son:

$$x(t) = x_0 + v_{0x}\,t$$
$$y(t) = y_0 + v_{0y}\,t - \tfrac12 g\,t^2$$

donde $x_0, y_0$ son las coordenadas iniciales, $g \approx 9{,}8\ \tfrac{\text{m}}{\text{s}^2}$ y
las componentes de la velocidad inicial se obtienen del ángulo de lanzamiento $\theta$:

$$v_{0x} = v_0\cos\theta, \qquad v_{0y} = v_0\operatorname{sen}\theta$$

**Observación.** El eje $x$ es MRU (sin aceleración): $x$ crece linealmente con $t$. El eje $y$
es MRUV con $a = -g$. Eliminar $t$ entre ambas ecuaciones da la trayectoria parabólica.

## Estrategia de resolución

La receta que se repite en toda la Guía 1 es:

1. Descomponer la velocidad inicial en $v_{0x}$ y $v_{0y}$ con el ángulo.
2. Del eje horizontal, despejar el tiempo de vuelo: $t = \dfrac{x - x_0}{v_{0x}}$.
3. Sustituir ese $t$ en la ecuación vertical para imponer la condición del problema (altura de un
   muro, punto de impacto, alcance).
4. Resolver la ecuación resultante para la incógnita ($v_0$, $\theta$, alcance, etc.).

> **Ejemplo (Guía 1, ej. 1.3).** Un proyectil sale desde $(0,\,2\ \text{m})$ con ángulo
> $\theta = 40^\circ$ y debe pasar por lo alto de un muro de $3{,}05\ \text{m}$ ubicado a
> $x = 10\ \text{m}$. Del eje horizontal $v_{0x} = \dfrac{10}{t}$, es decir
> $v_0 = \dfrac{10}{t\cos 40^\circ}$. En el vertical
> $3{,}05 = 2 + v_0\operatorname{sen}40^\circ\,t - \tfrac12 g\,t^2$; sustituyendo $v_0$ queda
> $0 = -1{,}05 + 10\tan 40^\circ - \tfrac12 g\,t^2$, de donde $t \approx 1{,}21\ \text{s}$ y
> $v_0 \approx 10{,}77\ \tfrac{\text{m}}{\text{s}}$.

## Variantes de la guía

Los ejercicios agregan geometría al mismo esquema:

| Ejercicio | Variante | Qué se pide |
|---|---|---|
| 1.4 | Lanzamiento horizontal desde lo alto de una rampa de ángulo $\alpha$; se proyectan las distancias con $\overline{A'B}\cos\alpha$ y $\overline{A'B}\operatorname{sen}\alpha$ | Punto de impacto sobre el plano |
| 1.5 | Proyectil que impacta un blanco a distancia dada, con dos escenarios comparados | Ángulo de tiro $\theta$ y velocidades finales |
| 1.6 | Tiro con componente inicial pequeña que cae dentro de un pozo, tiempo total $t_r = t_c + t_s$ | $v_{0y}$ a partir del tiempo de caída |

> **Nota.** En el ej. 1.4 la componente vertical inicial es nula (lanzamiento horizontal): la
> altura de partida es la suma de tramos $\overline{OA'} + \overline{A'A}$ proyectados sobre la
> rampa, y el impacto se plantea con $y(t) = 0$.

En todas, el patrón es idéntico: **el tiempo de vuelo se saca del eje sin aceleración y se
inyecta en el eje con gravedad**.

---

## Ver también

- [[01-cinematica-1d]] — el MRUV que se aplica en cada eje por separado
- [[02-aceleracion-variable]] — cuando la aceleración de un eje deja de ser constante
- [[04-movimiento-circular-relativo]] — otra descomposición vectorial de la aceleración
