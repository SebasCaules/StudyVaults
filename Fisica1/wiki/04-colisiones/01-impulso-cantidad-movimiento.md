---
tags: [teoria, unidad-4, cantidad-de-movimiento, impulso, centro-de-masa]
fuentes:
  - raw/teoricas/apuntes-2023-2c.pdf
  - raw/practicas/guia-04-cantidad-movimiento.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Cantidad de movimiento, impulso y centro de masa

Esta página introduce la cantidad de movimiento (o momento lineal) $\vec{p}$, su relación
con la segunda ley de Newton, el impulso de las fuerzas externas y el centro de masa de un
sistema de partículas. Es la base de la que se desprenden las [[04-colisiones/02-colisiones-1d|colisiones 1D]]
y [[04-colisiones/03-colisiones-2d|colisiones 2D]]. Transcripción de los apuntes de la cursada 2023-2C.

## Cantidad de movimiento

> **Definición.** La cantidad de movimiento de una partícula de masa $m$ y velocidad $\vec{v}$ es
> $$\vec{p} = m\,\vec{v}$$
> donde $m$ es la masa (escalar) y $\vec{v}$ la velocidad. $\vec{p}$ es un vector con la misma
> dirección y sentido que $\vec{v}$.

La segunda ley de Newton se escribe, en su forma general, en términos de $\vec{p}$:

$$\sum \vec{F} = \frac{d\vec{p}}{dt}$$

donde $\sum \vec{F}$ es la resultante de las fuerzas sobre la partícula. Cuando la masa es
constante, $\frac{d\vec{p}}{dt} = m\frac{d\vec{v}}{dt} = m\,\vec{a}$ y se recupera la forma
$\sum \vec{F} = m\,\vec{a}$.

## Sistema de partículas: fuerzas internas y externas

Al pasar de una partícula a un sistema de varias, conviene separar las fuerzas según su origen:

> **Definiciones.**
> i) **Fuerzas externas:** las ejercidas por el exterior de los cuerpos estudiados.
> ii) **Fuerzas internas:** las ejercidas entre los cuerpos del propio sistema.

Por el principio de acción y reacción, las fuerzas internas se cancelan de a pares. Por eso, al
sumar sobre todo el sistema, sólo sobreviven las externas. Definiendo la cantidad de movimiento
total del sistema $\vec{P}_{\text{sist}} = \sum_i m_i \vec{v}_i$, la segunda ley toma la forma

$$\sum \vec{F}_{\text{ext}} = \frac{d\vec{P}_{\text{sist}}}{dt}$$

donde $\sum \vec{F}_{\text{ext}}$ es la resultante de las fuerzas externas y $\vec{P}_{\text{sist}}$
la cantidad de movimiento total. Las fuerzas internas no cambian $\vec{P}_{\text{sist}}$.

## Impulso

Integrando la segunda ley del sistema entre dos instantes se obtiene el impulso de las fuerzas
externas, igual a la variación de la cantidad de movimiento total:

$$\int_{0}^{t} \sum \vec{F}_{\text{ext}}\,dt = M\,\vec{v}_{\text{cm},f} - M\,\vec{v}_{\text{cm},o}$$

donde el miembro izquierdo es el **impulso** $\vec{J}$ y el derecho es $\Delta \vec{P}_{\text{sist}}$,
con $M$ la masa total y $\vec{v}_{\text{cm}}$ la velocidad del centro de masa (ver abajo).

> **Definición.** El impulso de las fuerzas externas sobre el sistema en un intervalo es
> $$\vec{J} = \int \sum \vec{F}_{\text{ext}}\,dt = \Delta \vec{P}_{\text{sist}}$$

## Conservación de la cantidad de movimiento

De la ecuación del sistema se lee directamente el resultado central de la unidad:

> **Proposición.** Si la resultante de fuerzas externas es nula, la cantidad de movimiento total
> se conserva:
> $$\sum \vec{F}_{\text{ext}} = 0 \;\Rightarrow\; \vec{a}_{\text{cm}} = 0 \;\Rightarrow\; \vec{v}_{\text{cm}} = \text{cte}$$

Es decir: sin fuerzas externas netas, el centro de masa se mueve con velocidad constante y
$\vec{P}_{\text{sist}}$ no cambia, aunque los cuerpos interactúen entre sí. Esta es la hipótesis que
habilita el análisis de las colisiones.

## Centro de masa

> **Definición.** El centro de masa (CM) de un sistema de $n$ partículas se define por
> $$M\,\vec{r}_{\text{cm}} = \sum_{i=1}^{n} m_i\,\vec{r}_i$$
> donde $M = \sum_i m_i$ es la masa total del sistema, $m_i$ y $\vec{r}_i$ la masa y posición de
> cada partícula.

### Ejemplo: dos partículas sobre el eje $x$

Sean dos partículas: la $1$ en el origen y la $2$ a distancia $d$ sobre el eje $x$. Como ambas
están sobre ese eje, $y_{\text{cm}} = 0$ y $z_{\text{cm}} = 0$. Para la coordenada $x$:

$$M\,x_{\text{cm}} = m_1 x_1 + m_2 x_2 \;\Rightarrow\; x_{\text{cm}} = d\,\frac{m_2}{m_1 + m_2}$$

Si además $m_1 = m_2$, el CM queda en el punto medio:

$$x_{\text{cm}} = \frac{d}{2}$$

**Observación.** El centro de masa se ubica más cerca del cuerpo de mayor masa.

### Ejemplo: CM fijo por ausencia de fuerzas externas horizontales

Un problema típico de la guía aprovecha que, sin fuerzas externas horizontales,
$x_{\text{cm}} = \text{cte}$. Planteando la posición del CM antes y después del desplazamiento
interno de las masas $M$ y $m$ e igualando ambas expresiones, se despeja el desplazamiento $D$:

$$M\,\frac{L}{2} = -M\,\frac{L}{2} + M D + m D \;\Rightarrow\; M L = (m + M)\,D \;\Rightarrow\; D = \frac{M}{m + M}\,L$$

donde $L$ es la longitud del cuerpo sobre el que se desplaza la masa $m$ y $D$ el corrimiento
buscado. En el caso numérico del apunte esto da $D = \tfrac{1}{5}L$, es decir $D = 2\ \text{m}$.

> **Nota.** Algunos datos numéricos del enunciado original de este ejercicio no son del todo
> legibles; se transcribe el procedimiento (CM constante) que es lo esencial, y el resultado
> $D = 2\ \text{m}$ tal como figura en los apuntes.

---

## Ver también

- [[04-colisiones/02-colisiones-1d]] — choques en una dimensión y coeficiente de restitución
- [[04-colisiones/03-colisiones-2d]] — conservación de $\vec{p}$ por componentes
