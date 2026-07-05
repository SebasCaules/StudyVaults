---
tags: [teoria, unidad-1, pendulo, resortes, mas]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + práctica)
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Péndulo simple y combinaciones de resortes

Además del sistema masa-resorte, otros dos sistemas mecánicos oscilan como un
[[01-oscilador-armonico|movimiento armónico simple]]: el péndulo simple y los sistemas de
varios resortes reducidos a un resorte equivalente.

## Péndulo simple

El péndulo simple —una masa suspendida de un hilo de longitud $L$— oscila como un MAS,
descrito por el ángulo $\theta$ que forma el hilo con la vertical. Los apuntes lo presentan
directamente con la misma forma de solución que el oscilador masa-resorte:

> **Ecuación de movimiento.** El ángulo del péndulo evoluciona como
> $$\theta(t) = A\cos(\omega_0 t + \varphi_0)$$
> $$\dot{\theta}(t) = -A\,\omega_0\sin(\omega_0 t + \varphi_0)$$
> con frecuencia angular
> $$\omega_0 = \sqrt{\frac{g}{L}}$$
> donde $g$ es la aceleración de la gravedad y $L$ la longitud del hilo.

A diferencia del resorte, la frecuencia del péndulo **no depende de la masa**: solo de la
longitud del hilo y de $g$.

### Magnitudes lineales

El ángulo se relaciona con la posición y la velocidad sobre el arco:

$$s = L\,\theta, \qquad v = L\,\dot{\theta}$$

donde $s$ es la longitud de arco recorrida y $v$ la velocidad tangencial de la masa.

**Observación.** El paralelismo con el resorte es exacto: donde el resorte tiene
$\omega_0 = \sqrt{k/m}$, el péndulo tiene $\omega_0 = \sqrt{g/L}$. Toda la maquinaria del MAS
(período $T = 2\pi/\omega_0$, energía, fase inicial) se aplica igual reemplazando $x$ por
$\theta$.

## Combinaciones de resortes

Cuando la masa está unida a varios resortes, el sistema se reduce a un único resorte de
constante equivalente $k_{eq}$, y a partir de él se calcula la frecuencia
$\omega_0 = \sqrt{k_{eq}/m}$.

> **Resortes en serie.** Uno a continuación del otro; la constante equivalente cumple
> $$\frac{1}{k_{eq}} = \frac{1}{k_1} + \frac{1}{k_2}$$
> El resorte equivalente es **más blando** que cualquiera de los individuales.

> **Resortes en paralelo.** Actuando juntos sobre la misma masa; las constantes se suman
> $$k_{eq} = k_1 + k_2$$
> El resorte equivalente es **más rígido** que cualquiera de los individuales.

| Configuración | Constante equivalente | Efecto sobre $\omega_0$ |
|---|---|---|
| Serie | $\dfrac{1}{k_{eq}} = \dfrac{1}{k_1} + \dfrac{1}{k_2}$ | disminuye ($k_{eq}$ menor) |
| Paralelo | $k_{eq} = k_1 + k_2$ | aumenta ($k_{eq}$ mayor) |

---

## Ver también

- [[01-oscilador-armonico]] — la teoría general del MAS: solución, energía y círculo de fase
