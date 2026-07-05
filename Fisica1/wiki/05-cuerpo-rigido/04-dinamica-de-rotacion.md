---
tags: [teoria, unidad-5, cuerpo-rigido, torque, dinamica-rotacion]
fuente: raw/teoricas/
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Dinámica de la rotación planar

Transcripción de la teórica de la cursada 2023-2C. Así como una fuerza neta cambia la velocidad
del centro de masa, un **momento de fuerza** (torque) neto cambia la velocidad angular. Esta
página reúne el torque, el trabajo rotacional y la ecuación $M = I\alpha$.

## Momento de fuerza (torque)

Dos ideas paralelas organizan la dinámica del cuerpo rígido:

- Un cambio en la velocidad del centro de masa es provocado por una **fuerza neta** (resultante
  no equilibrada).
- Un cambio en la velocidad angular es provocado por un **momento neto** (momento no equilibrado).

> **Definición.** El **momento de fuerza** de $\vec F$ respecto de un punto $o$ es
> $$\vec M_{F/o} = \vec r \times \vec F \qquad\Longrightarrow\qquad |\vec M_{F/o}| = r\, f_t$$
> donde $\vec r$ es la posición del punto de aplicación respecto de $o$ y $f_t$ la componente
> **tangencial** de la fuerza (la radial no produce momento).

## Trabajo rotacional

El trabajo neto de las fuerzas sobre el cuerpo se puede escribir en términos angulares.
Partiendo del trabajo de la componente tangencial y usando $ds = R\, d\theta$:

$$W_{neto} = \int_i^f \vec F \cdot d\vec s = \int_i^f f_t\, ds = \int_i^f f_t\, R\, d\theta$$

Como $|\vec M_{F/o}| = R\, f_t$, queda el **trabajo rotacional** como integral del momento neto:

$$W_{rot} = \int_i^f M_{neto/o}\, d\theta = \Delta K_{rot}, \qquad K_{rot} = \tfrac12 I_o\, \omega^2$$

Es el teorema trabajo–energía en su versión rotacional: el trabajo del momento neto iguala la
variación de energía cinética de rotación.

## Relación entre momento neto y aceleración angular

Igualando el trabajo infinitesimal con la variación de energía cinética,
$dW_{rot} = dK$, y con $\omega = \dfrac{d\theta}{dt}$, $\alpha = \dfrac{d\omega}{dt}$:

$$M_{neto/o}\, d\theta = I_o\, \omega\, d\omega
\quad\Longrightarrow\quad
M_{neto/o} = I_o\, \alpha$$

$$\boxed{\,M_{neto/o} = I_o\, \alpha\,}$$

> **Nota.** Esta ecuación **no es** la segunda ley de Newton, aunque tenga la misma forma. Vale
> únicamente respecto de un eje **fijo** o respecto del **centro de masa** del cuerpo.

## Analogía traslación ↔ rotación

Toda la dinámica de rotación planar es la traslación 1D con las magnitudes angulares en lugar de
las lineales, y el momento de inercia en lugar de la masa.

| Traslación 1D | Rotación planar |
|---|---|
| $x(t)$ | $\theta(t)$ |
| $v = \dfrac{dx}{dt}$ | $\omega = \dfrac{d\theta}{dt}$ |
| $a = \dfrac{dv}{dt}$ | $\alpha = \dfrac{d\omega}{dt}$ |
| $\vec F_{neta} = M\, \vec a_{cm}$ | $\vec M_{neto/o} = I_o\, \vec\alpha$ |
| $W_{neto} = \displaystyle\int_i^f f_x\, dx$ | $W_{rot} = \displaystyle\int_i^f M_{neto/o}\, d\theta$ |
| $K = \tfrac12 M\, v_{cm}^2$ | $K = \tfrac12 I_o\, \omega^2$ |

En esta correspondencia, la **masa** $M$ juega el papel de inercia a la traslación y el
**momento de inercia** $I_o$ el de inercia a la rotación.

---

## Ver también

- [[02-momento-de-inercia]] — la inercia rotacional $I_o$ que aparece en $M = I\alpha$
- [[03-teorema-de-steiner]] — cómo obtener $I_o$ para el eje de giro real
- [[01-cinematica-rotacion-planar]] — las magnitudes $\theta$, $\omega$, $\alpha$
