---
tags: [teoria, unidad-8, hidrodinamica, continuidad, bernoulli, venturi, torricelli]
fuente: apuntes de la cursada 2023-2C (teórica, unidad 8; práctica, guía 8)
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Hidrodinámica: continuidad y Bernoulli

Esta página trata los fluidos **en movimiento**: los tipos de flujo, el modelo de
flujo ideal que se usa en toda Física 1, la ecuación de continuidad, el teorema de
Bernoulli y sus aplicaciones (Venturi, Torricelli y sustentación).

## Tipos de flujo

- **Flujo laminar.** Cada partícula del fluido sigue su propia trayectoria y estas
  nunca se cruzan con las de otras partículas. En un punto dado, todas las partículas
  que pasan por él tienen la misma velocidad.
- **Flujo turbulento.** Por encima de cierta rapidez el flujo se vuelve turbulento:
  irregular, con remolinos. (El humo de un cigarrillo arranca laminar y se vuelve
  turbulento al subir.)

## Viscosidad

> **Definición.** La viscosidad caracteriza la resistencia que tiene un fluido a
> moverse. La **fuerza viscosa** es la resistencia entre dos capas de fluido a
> desplazarse una respecto de la otra.

La viscosidad hace que parte de la energía que transporta el fluido se convierta en
energía interna, análogo al rozamiento de una partícula sobre una superficie rugosa.

## Flujo ideal

En Física 1 se trabaja siempre con el modelo de **flujo ideal**, que cumple tres
condiciones:

1. **No viscoso**: no hay pérdidas de energía.
2. **Estacionario**: todas las partículas que pasan por un punto tienen la misma
   velocidad.
3. **Incompresible**: la densidad es constante.

> **Definición.** La trayectoria que sigue una partícula de fluido en flujo
> estacionario se llama **línea de corriente**. La velocidad de la partícula es
> siempre **tangente** a la línea de corriente.

## Ecuación de continuidad

Consideremos un tubo que cambia de sección. En un instante el fluido ocupa un tramo de
área $A_1$ moviéndose a $v_1$; más adelante ocupa un tramo de área $A_2$ a velocidad
$v_2$. Como el flujo es incompresible, el volumen que entra en un tiempo $\Delta t$ es
el que sale:

$$A_1 v_1\, \Delta t = A_2 v_2\, \Delta t \quad\Longrightarrow\quad A_1 v_1 = A_2 v_2$$

donde $A$ es el área transversal y $v$ la velocidad del fluido. El producto $Q = A\,v$
es el **caudal** (volumen por unidad de tiempo) y se conserva a lo largo del tubo:
donde el tubo se angosta, el fluido acelera.

> **Ejemplo.** Una manguera llena un balde de $30\ \mathrm{L}$ en $1\ \mathrm{min}$;
> se le agrega una boquilla de $0{,}5\ \mathrm{cm^2} = 5\cdot 10^{-5}\ \mathrm{m^2}$ de
> área, y se la sostiene horizontal a $1\ \mathrm{m}$ del piso. El caudal es
> $Q = 30\ \mathrm{L}/1\ \mathrm{min} = 5\cdot 10^{-4}\ \mathrm{m^3/s}$. Por
> continuidad, $Q = A v \Rightarrow v = 5\cdot 10^{-4}/5\cdot 10^{-5} = 10\ \mathrm{m/s}$.
> El agua sale horizontal y cae como tiro oblicuo: de $1 = \tfrac12 g t^2$ con
> $g = 10\ \mathrm{m/s^2}$ sale $t = \sqrt{0{,}2}\ \mathrm{s}$, y el alcance es
> $x = v\,t = 10\sqrt{0{,}2} \approx 4{,}47\ \mathrm{m}$.

> **Ejemplo.** Por un caño que se angosta de un radio a otro, con
> $v_0 = 4{,}5\ \mathrm{m/s}$ a la entrada, la velocidad de salida se obtiene de
> $A_0 v_0 = A_f v_f$. Con $A \propto D^2$ y diámetros $3{,}9\ \mathrm{cm}$ y
> $2{,}25\ \mathrm{cm}$, resulta $v_f = (3{,}9/2{,}25)^2\cdot 4{,}5 \approx 13{,}52\ \mathrm{m/s}$.

## Teorema de Bernoulli

El teorema de Bernoulli es la **conservación de la energía** aplicada a un fluido
ideal y estacionario. Empujando un volumen $V$ de fluido a lo largo del tubo, el
trabajo neto de las presiones sobre ese volumen es

$$W = P_1 A_1 \Delta x_1 - P_2 A_2 \Delta x_2 = (P_1 - P_2)\, V$$

Ese trabajo iguala la variación de energía cinética más la potencial gravitatoria del
volumen, $W = \Delta K + \Delta U_g$:

$$(P_1 - P_2)\, V = \tfrac12 \rho V v_2^2 - \tfrac12 \rho V v_1^2 + \rho V g\, y_2 - \rho V g\, y_1$$

Cancelando $V$ y reordenando se llega a que la combinación

$$P + \tfrac12 \rho v^2 + \rho g h = \text{cte}$$

se conserva a lo largo de una línea de corriente. Aquí $P$ es la presión, $\rho$ la
densidad, $v$ la velocidad, $g$ la gravedad y $h$ la altura del punto.

## Tubo de Venturi

Un tubo horizontal que se angosta es una aplicación directa de Bernoulli. Al no haber
cambio de altura, el término $\rho g h$ es igual en ambos puntos y

$$\tfrac12 \rho v_1^2 + P_1 = \tfrac12 \rho v_2^2 + P_2 \qquad (1)$$

Por continuidad, $A_1 v_1 = A_2 v_2 \Rightarrow v_1 = \dfrac{A_2 v_2}{A_1}$ $\;(2)$.
Reemplazando $(2)$ en $(1)$:

$$\tfrac12 \rho\, \frac{A_2^2 v_2^2}{A_1^2} + P_1 = \tfrac12 \rho v_2^2 + P_2 \quad\Longrightarrow\quad \tfrac12 \rho v_2^2\left(1 - \frac{A_2^2}{A_1^2}\right) = P_1 - P_2$$

Como $A_2 < A_1$, en la garganta la velocidad crece ($v_2 > v_1$) y la presión baja
($P_2 < P_1$). Despejando la velocidad en la garganta, en la forma del apunte:

$$v_2 = \sqrt{\frac{2\,(P_1 - P_2)}{\rho\,(A_1^2 - A_2^2)}}$$

> **Nota.** Tal como quedó recuadrada en los apuntes de la cursada 2023-2C, la fórmula
> final omite el factor $A_1^2$ del numerador que sí aparece al despejar la línea
> anterior; la expresión dimensionalmente consistente es
> $v_2 = \sqrt{2(P_1 - P_2)\,A_1^2 / \big(\rho\,(A_1^2 - A_2^2)\big)}$. Se conserva la
> forma del apunte por fidelidad, con esta salvedad.

## Ley de Torricelli

Un recipiente muy grande y abierto a la atmósfera tiene un pequeño orificio en la
pared. La superficie libre (punto 2) y el chorro de salida (punto 1) están ambos a
presión atmosférica, así que los términos de presión se cancelan. Como el área de la
superficie es mucho mayor que la del orificio ($A_2 \gg A_1$), por continuidad la
superficie baja muy lento y se aproxima $v_2 \approx 0$. Bernoulli queda

$$\cancel{P} + \tfrac12 \rho v_1^2 + \rho g\, y_1 = \cancel{P} + \tfrac12 \rho \underbrace{v_2^2}_{\to\, 0} + \rho g\, y_2$$

y despejando la velocidad de salida con $h = y_2 - y_1$ la altura del líquido sobre el
orificio:

$$v_1 = \sqrt{2 g\,(y_2 - y_1)} = \sqrt{2 g h}$$

El líquido sale del orificio con la misma velocidad que tendría un cuerpo en caída
libre desde la altura $h$.

## Fuerza de sustentación

La fuerza que sostiene un ala admite dos explicaciones complementarias:

- **Diferencia de presiones (Bernoulli).** El aire pasa más rápido por encima del ala
  que por debajo, así que la presión arriba es menor que abajo ($P_{\text{arriba}} <
  P_{\text{abajo}}$): el ala es empujada hacia arriba.
- **Acción y reacción (Newton).** El ala desvía el aire hacia abajo; por reacción, el
  aire ejerce una fuerza hacia arriba sobre el ala.

---

## Ver también

- [[01-hidrostatica]] — presión y $P = P_0 + \rho g h$ (base de Bernoulli)
- [[02-empuje-arquimedes]] — empuje y flotación en fluidos en reposo
