---
tags: [teoria, unidad-1, mas, oscilador-armonico, energia]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica + práctica)
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Movimiento armónico simple

El **movimiento armónico simple** (MAS) es el que describe una partícula sometida a una
fuerza restauradora proporcional al desplazamiento. El sistema modelo es una masa unida a
un resorte ideal sin fricción; toda oscilación que responda a la misma ecuación diferencial
(péndulos, sistemas de resortes) es un MAS.

## El oscilador masa-resorte

Se toma el origen en la posición de equilibrio ($x_{eq} = 0$), donde el resorte no ejerce
fuerza. Para un desplazamiento $x$, la única fuerza horizontal es la del resorte,
$F = -k\,\Delta x = -k\,x$. Aplicando la segunda ley de Newton, $F = m\,\ddot{x}$:

$$-k\,x = m\,\ddot{x}$$

que reordenada da la **ecuación del oscilador armónico**:

$$\ddot{x} + \frac{k}{m}\,x = 0$$

donde $x$ es el desplazamiento respecto del equilibrio, $m$ la masa, $k$ la constante
elástica del resorte y $\ddot{x}$ la aceleración (derivada segunda de $x$ respecto del tiempo).

### Resolución de la ecuación diferencial

Se propone una solución exponencial $x(t) = C\,e^{rt}$, de modo que $\ddot{x} = r^2\,e^{rt}$.
Reemplazando en la ecuación:

$$e^{rt}\left(r^2 + \frac{k}{m}\right) = 0$$

Como $e^{rt} \neq 0$, se anula el paréntesis y queda $r = \pm\,i\sqrt{k/m}$. La solución
general es una combinación de las dos exponenciales imaginarias:

$$x(t) = C_1\,e^{\,i\sqrt{k/m}\;t} + C_2\,e^{-i\sqrt{k/m}\;t}$$

Escribiendo las constantes como $C_1 = \tfrac{A}{2}e^{\,i\varphi_0}$ y
$C_2 = \tfrac{A}{2}e^{-i\varphi_0}$ y usando la identidad de Euler
$e^{\,ix} + e^{-ix} = 2\cos x$, la solución colapsa a una forma real.

## Solución general del MAS

> **Ecuación de movimiento.** La posición de un oscilador armónico es
> $$x(t) = A\cos(\omega_0 t + \varphi_0)$$
> donde $A$ es la **amplitud** (el resorte oscila entre $-A$ y $A$), $\varphi_0$ el
> **ángulo inicial** o fase inicial, y $\omega_0$ la frecuencia angular.

La frecuencia angular es una propiedad del sistema, fijada por la masa y la constante elástica:

$$\omega_0 = \sqrt{\frac{k}{m}}$$

El giro y la oscilación comparten el mismo **período** $T$: el tiempo en que la masa vuelve a
la misma posición y velocidad. Como $T$ es constante, $\omega_0$ es una propiedad del sistema:

$$T = \frac{2\pi}{\omega_0}, \qquad f = \frac{\omega_0}{2\pi} = \frac{1}{T}$$

donde $T$ es el período (en segundos) y $f$ la frecuencia (en Hz). El símbolo $\omega_0$ es a
la vez la velocidad angular del giro de referencia y la frecuencia angular de la oscilación.

### Velocidad y aceleración

Derivando $x(t)$ una y dos veces respecto del tiempo se obtienen la velocidad y la aceleración:

$$v(t) = \dot{x}(t) = -A\,\omega_0\sin(\omega_0 t + \varphi_0)$$
$$a(t) = \ddot{x}(t) = -A\,\omega_0^{2}\cos(\omega_0 t + \varphi_0)$$

Comparando la aceleración con la posición se recupera la relación característica del MAS:

$$a(t) = -\omega_0^{2}\,x(t)$$

es decir, la aceleración es siempre proporcional y opuesta al desplazamiento.

## Amplitud y fase desde las condiciones iniciales

Dadas la posición y la velocidad en $t = 0$, $x_0 = x(0)$ y $v_0 = v(0)$, se despejan $A$ y
$\varphi_0$. Evaluando las ecuaciones en $t = 0$:

$$x_0 = A\cos\varphi_0, \qquad v_0 = -A\,\omega_0\sin\varphi_0$$

Dividiendo la segunda por la primera se elimina $A$:

$$\frac{v_0}{x_0} = -\omega_0\tan\varphi_0 \;\Rightarrow\; \tan\varphi_0 = -\frac{v_0}{\omega_0\,x_0}$$

Como la tangente tiene período $\pi$, hay **dos soluciones** posibles para la fase; se elige la
que sea compatible con los signos de $x_0$ y $v_0$:

$$\varphi_{0} = \arctan\!\left(-\frac{v_0}{\omega_0\,x_0}\right)
\qquad\text{o}\qquad
\varphi_{0} = \arctan\!\left(-\frac{v_0}{\omega_0\,x_0}\right) + \pi$$

Para la amplitud, se elevan al cuadrado ambas ecuaciones y se suman, usando
$\sin^2\varphi_0 + \cos^2\varphi_0 = 1$:

$$x_0^2\,\omega_0^2 + v_0^2 = A^2\omega_0^2 \;\Rightarrow\;
A = \sqrt{x_0^{2} + \frac{v_0^{2}}{\omega_0^{2}}}$$

## Energía del oscilador

La energía mecánica del oscilador es la suma de la cinética y la potencial elástica:

$$E = K + U = \tfrac{1}{2}m\,v^2 + \tfrac{1}{2}k\,x^2
= \tfrac{1}{2}m\,\omega_0^2 A^2\sin^2(\omega_0 t + \varphi_0)
+ \tfrac{1}{2}k\,A^2\cos^2(\omega_0 t + \varphi_0)$$

Como $k = m\,\omega_0^2$, se factoriza $\tfrac{1}{2}kA^2$ y el corchete
$\sin^2(\cdot) + \cos^2(\cdot)$ vale $1$:

> **Energía mecánica.** En el oscilador sin fricción la energía es constante:
> $$E = \tfrac{1}{2}k\,A^2 = \tfrac{1}{2}m\,\omega_0^2 A^2$$
> Es constante justamente porque no hay fricción: la energía se transfiere entre cinética y
> potencial pero su total no cambia.

## Círculo de fase

El MAS es la **proyección sobre un eje** de un movimiento circular uniforme de radio $A$ y
velocidad angular $\omega_0$. La fase total $\varphi = \omega_0 t + \varphi_0$ es el ángulo del
fasor que gira sobre el círculo de referencia; la posición $x$ es su proyección horizontal
($x = A\cos\varphi$). Esto permite leer el signo de $x$ y de $v$ según el cuadrante:

| Región del fasor | Signo de $x = A\cos\varphi$ | Signo de $v = -A\omega_0\sin\varphi$ |
|---|---|---|
| Semicírculo derecho | $x > 0$ | — |
| Semicírculo izquierdo | $x < 0$ | — |
| Semicírculo superior | — | $v < 0$ |
| Semicírculo inferior | — | $v > 0$ |

**Observación.** Como $v = -A\omega_0\sin\varphi$, la velocidad es negativa cuando el fasor
está en la mitad superior ($\sin\varphi > 0$) y positiva en la mitad inferior. Un período
completo corresponde a una vuelta entera del fasor: la masa vuelve a la misma posición **y**
velocidad.

## Ejemplos resueltos

**Datos a partir de $x(t)$.** Sea $x(t) = 5\cos(2t + \pi/6)$ (en cm). De aquí:
$\omega_0 = 2\ \text{rad/s}$, luego $T = \tfrac{2\pi}{\omega_0} = \pi\ \text{s}$ y
$f = \tfrac{1}{\pi}\ \text{Hz}$; la amplitud es $A = 5\ \text{cm}$. En $t = 0$:

$$x(0) = 5\cos(\pi/6) = 5\cdot\tfrac{\sqrt{3}}{2} \approx 4{,}33\ \text{cm}$$
$$v(0) = -10\sin(\pi/6) = -5\ \text{cm/s}, \qquad
a(0) = -20\cos(\pi/6) = -10\sqrt{3}\ \text{cm/s}^2$$

y se verifica el truco $a(t) = -\omega_0^2\,x(t)$.

**Reconstruir $x(t)$ desde la energía.** Un oscilador con $A = 30\ \text{cm}$, $E = 0{,}9\ \text{J}$,
$m = 5\ \text{kg}$, $v_0 = 0$ y $x_0 = -30\ \text{cm}$. De $E = \tfrac{1}{2}kA^2$ se despeja
$k = \tfrac{2E}{A^2} = \tfrac{2\cdot 0{,}9}{(0{,}30)^2} = 20\ \text{N/m}$, y
$\omega_0 = \sqrt{k/m} = 2\ \text{rad/s}$. Con $v_0 = 0$ la fase es
$\varphi_0 = \arctan(0) = 0$, pero como $x_0 < 0$ se toma la segunda solución
$\varphi_0 = \pi$. Entonces:

$$x(t) = 0{,}3\cos(2t + \pi)\ \text{[m]}$$

---

## Ver también

- [[02-pendulo-y-resortes]] — el péndulo y las combinaciones de resortes como osciladores armónicos
