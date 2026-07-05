---
tags: [teoria, unidad-5, cuerpo-rigido, cinematica-rotacion, velocidad-angular]
fuente: raw/teoricas/
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Cinemática de la rotación planar

Transcripción de la teórica de la cursada 2023-2C. Esta página abre la mecánica del
**cuerpo rígido**: qué es, qué tipos de movimiento tiene y cómo se describe la rotación
planar con posición, velocidad y aceleración angular.

## Cuerpo rígido

> **Definición.** Un sistema de partículas es un **cuerpo rígido** si la distancia entre
> cualquier par de puntos se mantiene constante en el tiempo. Si $d = |\vec r_j - \vec r_i|$
> es la distancia entre los puntos $i$ y $j$, entonces
> $$\text{es cuerpo rígido} \iff d = \text{cte} \quad \forall\, i, j$$

## Tipos de movimiento

El movimiento general de un cuerpo rígido se descompone en dos clases.

### Traslación

Todos los puntos describen trayectorias paralelas; en cada instante comparten la misma
velocidad. Puede ser **rectilínea** o **curvilínea**.

> **Observación.** En traslación pura, $\vec v_i = \vec v_{cm}$ para todo punto $i$. La
> traslación pura de un cuerpo rígido queda determinada por la traslación de su centro de masa:
> $$\sum \vec F_{ext} = M\, \vec a_{cm}$$

### Rotación

El cuerpo gira alrededor de un **eje de rotación**. En **rotación planar** la dirección del
eje no cambia. Para analizar la rotación planar basta con estudiar lo que le ocurre a un
punto cualquiera del cuerpo girando alrededor del eje.

## Posición, velocidad y aceleración angular

> **Definición (posición angular).** Elegido un punto cualquiera del cuerpo rígido, como
> $|\vec r| = \text{cte}$, su posición queda dada por un único ángulo $\theta = \theta(t)$.

La **velocidad angular** es la tasa de cambio de la posición angular:

$$\vec\omega = \lim_{\Delta t \to 0} \frac{\Delta \vec\theta}{\Delta t} = \frac{d\vec\theta}{dt}$$

donde $\vec\theta$ apunta a lo largo del eje de rotación (regla de la mano derecha) y
$\omega$ se mide en $\mathrm{rad/s}$.

La velocidad **lineal** de un punto se relaciona con la angular por la distancia $R$ al eje.
En módulo:

$$v = \frac{ds}{dt} = \frac{d\theta}{dt}\cdot\frac{ds}{d\theta} = \omega R$$

donde $R = ds/d\theta$ es el radio de giro del punto. En forma vectorial, para un punto $P$
a posición $\vec r_P$ respecto del eje:

$$\vec v_P = \vec\omega \times \vec r_P$$

La **aceleración angular** es la tasa de cambio de la velocidad angular:

$$\vec\alpha = \lim_{\Delta t \to 0} \frac{\Delta \vec\omega}{\Delta t} = \frac{d\vec\omega}{dt}$$

> **Observación.** En rotación planar $\vec\alpha$ y $\vec\omega$ están sobre el mismo eje de
> rotación. Si $\omega > 0$: con $\alpha > 0$ el cuerpo **acelera** angularmente; con
> $\alpha < 0$ **desacelera**.

## Aceleración lineal de un punto

La aceleración de un punto que gira tiene componente tangencial y componente normal
(coordenadas intrínsecas). Partiendo de $\vec a = \dfrac{dv}{dt}\,\hat t + \dfrac{v^2}{R}\,\hat n$
y reemplazando $v = \omega R$:

$$\vec a = \frac{d(\omega R)}{dt}\,\hat t + \frac{(\omega R)^2}{R}\,\hat n
= \alpha R\,\hat t + \omega^2 R\,\hat n$$

donde $\alpha R$ es la aceleración tangencial (cambia el módulo de $\vec v$) y $\omega^2 R$ la
normal o centrípeta (cambia la dirección de $\vec v$).

## Analogía con la traslación 1D

La cinemática de rotación es formalmente idéntica a la traslación en una dimensión,
cambiando cada magnitud lineal por su análoga angular.

| Traslación 1D | Rotación planar | Unidad |
|---|---|---|
| $x(t)$ | $\theta(t)$ | $\mathrm{rad}$ |
| $v = \dfrac{dx}{dt}$ | $\omega = \dfrac{d\theta}{dt}$ | $\mathrm{rad/s}$ |
| $a = \dfrac{dv}{dt}$ | $\alpha = \dfrac{d\omega}{dt}$ | $\mathrm{rad/s^2}$ |

En consecuencia, cuando $\alpha = \text{cte}$ valen las ecuaciones horarias análogas al MRUV:

$$\omega = \omega_0 + \alpha t, \qquad
\theta = \theta_0 + \omega_0 t + \tfrac12 \alpha t^2, \qquad
\omega^2 = \omega_0^2 + 2\alpha\,\Delta\theta$$

## Ejemplo: polea escalonada con dos cables

Un cilindro escalonado tiene un cable $A$ enrollado en el radio interior $r = 5\ \mathrm{cm}$ y
un cable $B$ en el radio exterior $R = 10\ \mathrm{cm}$; $B$ eleva un cuerpo. Los cables no
resbalan, de modo que

$$v_A = \omega\, r, \qquad v_B = \omega\, R$$

Con los datos de velocidad y aceleración del cable $A$ se obtiene $\omega_0 = 2\ \mathrm{rad/s}$
(en $\hat k$) y $\alpha = 1\ \mathrm{rad/s^2}$ en $t = 0$.

> **Observación.** El cable no gira, por lo que no tiene aceleración centrípeta: solo transmite
> la componente tangencial $a = \alpha r$.

La aceleración lineal del punto $P$ del radio interior en $t = 0$:

$$\vec a_P = \alpha r\,\hat t + \omega^2 r\,\hat n
= 5\ \tfrac{\mathrm{cm}}{\mathrm{s^2}}\,\hat t + 20\ \tfrac{\mathrm{cm}}{\mathrm{s^2}}\,\hat n$$

Usando las ecuaciones horarias con $\alpha = \text{cte}$, en $t = 3\ \mathrm{s}$:

- Rapidez angular: $\omega = \omega_0 + \alpha t = 5\ \mathrm{rad/s}$.
- Ángulo rotado: $\Delta\theta = \omega_0 t + \tfrac12 \alpha t^2 = 10{,}5\ \mathrm{rad}$, es decir
  $\dfrac{\Delta\theta}{2\pi} \approx 1{,}67$ vueltas.
- Rapidez lineal del cuerpo que sube: $v_B = \omega R = 50\ \mathrm{cm/s}$.
- Cuánto se eleva el cuerpo: $\Delta s = \Delta\theta \cdot R = 10{,}5\ \mathrm{rad}\cdot 10\ \mathrm{cm} = 105\ \mathrm{cm}$.

---

## Ver también

- [[02-momento-de-inercia]] — cómo la masa distribuida resiste el cambio de $\omega$
- [[04-dinamica-de-rotacion]] — qué provoca el cambio de la velocidad angular ($M = I\alpha$)
