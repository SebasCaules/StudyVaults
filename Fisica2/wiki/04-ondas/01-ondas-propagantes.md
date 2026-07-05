---
tags: [teoria, unidad-4, ondas, ecuacion-de-onda, cuerda]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Ondas propagantes

Esta página introduce el movimiento ondulatorio: qué es una onda, cómo se describe
matemáticamente una perturbación que viaja, la ecuación de onda unidimensional y su
deducción para una cuerda tensa, y la forma de las ondas armónicas propagantes.

## Movimiento ondulatorio

> **Definición.** Las ondas son perturbaciones que transportan energía sin transportar masa.

Según el medio que necesiten para propagarse, se distinguen dos grandes tipos:

| Tipo | Medio | Ejemplo |
|---|---|---|
| Mecánica | Necesita un medio material para propagarse | onda en una cuerda, sonido |
| Electromagnética | No precisa medio para propagarse | luz |

Las ondas mecánicas, a su vez, se clasifican según la relación entre la dirección de la
perturbación y la dirección de propagación:

- **Longitudinal:** la dirección de propagación es **paralela** a la dirección de la
  perturbación (por ejemplo, un resorte comprimido y estirado a lo largo de su eje).
- **Transversal:** la dirección de la perturbación es **perpendicular** a la de propagación
  (por ejemplo, una cuerda que se sacude hacia arriba y abajo mientras la onda avanza en
  horizontal).

En esta unidad se trabaja con la onda **transversal en una cuerda** como sistema modelo.

## Pulso de onda y función de onda

> **Definición.** Un **pulso de onda** es la onda producida por una única perturbación.

Se lo estudia bajo dos consideraciones: que el medio **no absorbe energía** —de modo que el
pulso no se deforma al avanzar— y que **todos los puntos del pulso viajan a la misma
velocidad**.

La perturbación se describe con una **función de onda**. En el caso general depende de la
posición y del tiempo, $\psi = f(x, t)$, pero un pulso que se propaga sin deformarse con
velocidad $v$ queda determinado por la combinación $x \pm vt$:

$$\psi(x, t) = f(x \pm vt)$$

En una cuerda se usa $y$ para el desplazamiento transversal, $y(x, t) = f(x \pm vt)$, donde
$y$ es el desplazamiento vertical del elemento de cuerda ubicado en $x$ en el instante $t$, y
$v$ es la velocidad de propagación de la onda en el medio. El signo fija el sentido:

- **Signo $-$:** la onda se propaga hacia la **derecha** (sentido positivo de $x$).
- **Signo $+$:** la onda se propaga hacia la **izquierda** (sentido negativo de $x$).

## Ecuación de onda unidimensional

Toda perturbación que se propaga sin distorsión con velocidad $v$ en la dirección $x$
satisface la misma ecuación diferencial en derivadas parciales.

> **Ecuación de onda.** Una función $y(x, t) = f(x \pm vt)$ es solución de
> $$\frac{\partial^2 y}{\partial x^2} = \frac{1}{v^2}\,\frac{\partial^2 y}{\partial t^2}$$
> donde $y$ es el desplazamiento, $x$ la posición, $t$ el tiempo y $v$ la velocidad de
> propagación.

### Deducción para una cuerda tensa

Se aplica la segunda ley de Newton a un elemento de cuerda de longitud $\Delta \ell$ ubicado
entre $x$ y $x + \Delta x$. Las consideraciones son:

- **Cuerda:** tensa (tensión $F$), liviana (su peso es despreciable frente a la tensión,
  $P \ll F$, de modo que $F_1 \simeq F_2$) y uniforme, con densidad lineal de masa constante
  $$\mu = \frac{M}{L} = \frac{\Delta m}{\Delta x} = \text{cte}$$
  donde $M$ es la masa total, $L$ la longitud y $\Delta m$ la masa del elemento.
- **Oscilaciones de pequeña amplitud:** los ángulos $\theta$ que la cuerda forma con la
  horizontal son pequeños, así que $\cos\theta \simeq 1$ y $\operatorname{tg}\theta \simeq
  \sin\theta \simeq \theta$, y además $\Delta y \ll \Delta x$.

En el eje $x$, las componentes horizontales de la tensión en los dos extremos se cancelan:

$$F_2\cos\theta_2 - F_1\cos\theta_1 = \Delta m\,a_x \;\Rightarrow\; F - F = \Delta m\,a_x \;\Rightarrow\; a_x = 0$$

es decir, no hay movimiento horizontal: el elemento solo vibra en el eje $y$. En el eje $y$,
las componentes verticales dan la fuerza neta que acelera al elemento:

$$F_2\sin\theta_2 - F_1\sin\theta_1 = \Delta m\,a_y \;\Rightarrow\; F\big(\operatorname{tg}\theta_2 - \operatorname{tg}\theta_1\big) = \Delta m\,a_y$$

Como la pendiente de la cuerda es $\operatorname{tg}\theta = \partial y / \partial x$ y
$\Delta m = \mu\,\Delta x$, esto se reescribe como

$$F\left(\left.\frac{\partial y}{\partial x}\right|_{x+\Delta x} - \left.\frac{\partial y}{\partial x}\right|_{x}\right) = \mu\,\Delta x\,\frac{\partial^2 y}{\partial t^2}$$

Dividiendo por $\Delta x$ y tomando el límite $\Delta x \to 0$, el cociente incremental de la
pendiente se vuelve la derivada segunda espacial:

$$\frac{\partial^2 y}{\partial x^2} = \frac{\mu}{F}\,\frac{\partial^2 y}{\partial t^2}$$

Comparando esta ecuación con la ecuación de onda general se identifica $1/v^2 = \mu/F$, de
donde sale la **velocidad de propagación en una cuerda**:

> **Velocidad en la cuerda.**
> $$v = \sqrt{\frac{F}{\mu}}$$
> donde $F$ es la tensión de la cuerda y $\mu$ su densidad lineal de masa. La velocidad crece
> con la tensión y decrece con la masa por unidad de longitud.

## Ondas armónicas propagantes

Las **ondas armónicas** son aquellas cuya función de onda es senoidal. Partiendo de
$y(x, t) = A\cos[k(x \pm vt) + \varphi_0]$ y distribuyendo el número de onda:

$$y(x, t) = A\cos(kx \pm \omega t + \varphi_0)$$

donde $A$ es la amplitud, $\varphi_0$ la fase inicial, $k$ el número de onda y $\omega$ la
frecuencia angular, ligadas por $\omega = k\,v$.

El **número de onda** $k$ es la frecuencia espacial, y se relaciona con la longitud de onda
$\lambda$:

$$k = \frac{2\pi}{\lambda}$$

Combinando $\omega = kv$ con $\omega = 2\pi/T$ y $k = 2\pi/\lambda$ se recupera la relación
entre velocidad, longitud de onda y período:

$$\frac{2\pi}{T} = \frac{2\pi}{\lambda}\,v \;\Rightarrow\; v = \frac{\lambda}{T} = \lambda f$$

donde $T$ es el período temporal, $\lambda$ la longitud de onda (o período espacial) y
$f = 1/T$ la frecuencia.

> **Observación.** La función de onda armónica es **biperiódica**: se repite tanto para
> valores de $x = n\lambda$ (periodicidad espacial) como de $t = nT$ (periodicidad temporal),
> con $n$ entero.

La **velocidad de desplazamiento transversal** de un elemento de cuerda —cómo se mueve
verticalmente el punto ubicado en $x$— es la derivada temporal de $y$:

$$v_y = \frac{\partial y}{\partial t} = \pm\,\omega A\sin(kx \pm \omega t + \varphi_0)$$

No debe confundirse con la velocidad de propagación $v = \sqrt{F/\mu}$: $v_y$ es la velocidad
con la que sube y baja cada punto de la cuerda, mientras que $v$ es la velocidad con la que la
forma de la onda avanza a lo largo de $x$.

---

## Ver también

- [[02-energia-y-potencia]] — densidad de energía y potencia que transporta la onda
- [[03-reflexion-y-transmision]] — qué ocurre cuando el pulso llega a un cambio de medio
- [[01-mas/01-oscilador-armonico]] — el movimiento armónico de cada elemento de la cuerda
