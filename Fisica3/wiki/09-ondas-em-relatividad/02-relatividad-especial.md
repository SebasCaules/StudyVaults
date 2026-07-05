---
tags: [teoria, unidad-9, relatividad-especial, contraccion-de-longitud, dilatacion-temporal, suma-de-velocidades]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 9
tipo: teoria
actualizado: 2026-07-05
---

# Relatividad especial (cinemática)

La relatividad especial describe cómo se relacionan las medidas de longitud, tiempo y
velocidad entre dos marcos de referencia inerciales que se mueven uno respecto del otro.
Acá se cubre solo la parte cinemática: el factor de Lorentz, la contracción de longitud, la
dilatación temporal y la suma relativista de velocidades.

## Marcos de referencia y factor de Lorentz

Se consideran dos sistemas inerciales: un marco $S$ en reposo y un marco $S'$ que se
desplaza con velocidad $\vec{V} = V\hat{x}$ respecto de $S$. Los ejes de $S'$ son paralelos
a los de $S$ y el movimiento relativo ocurre a lo largo de $x$.

Todas las transformaciones dependen de un único parámetro adimensional, el **factor de
Lorentz**.

> **Definición.** El factor de Lorentz asociado a una velocidad relativa $V$ es
> $$\gamma = \frac{1}{\sqrt{1 - \dfrac{V^2}{c^2}}} \geq 1$$
> donde $c$ es la velocidad de la luz. Vale $\gamma = 1$ cuando $V = 0$ y crece sin cota a
> medida que $V$ se acerca a $c$.

## Contracción de longitud y dilatación temporal

Un objeto tiene su mayor longitud en el marco donde está en reposo (su **longitud propia**
$L_0$); medido desde un marco donde se mueve, aparece contraído en la dirección del
movimiento.

> **Contracción de longitud.** Si $L_0$ es la longitud propia (medida en reposo) y $L$ la
> longitud medida desde el marco en que el objeto se mueve, entonces
> $$L_0 = L\,\gamma \qquad \Longrightarrow \qquad L = \frac{L_0}{\gamma}$$
> Como $\gamma \geq 1$, resulta $L \leq L_0$: la longitud medida en movimiento es menor que
> la propia.

Análogamente, los intervalos de tiempo se transforman con el mismo factor.

> **Dilatación temporal.** El intervalo de tiempo propio $\Delta T$ se relaciona con el
> intervalo $\Delta t$ medido en el otro marco mediante
> $$\Delta T = \frac{\Delta t}{\gamma}$$

> **Nota.** En los apuntes de la cursada 2024-1C el tiempo propio se anota $\Delta T$ y se lo
> obtiene dividiendo por $\gamma$ el tiempo medido en el otro marco; esta es la convención que
> se usa en el problema resuelto de más abajo *(la notación del original es escueta en este
> punto)*.

## Problema resuelto: pulso de luz hacia un espejo

Una nave viaja a $V = 0{,}8\,c$ hacia un espejo fijo (en el marco $S$) situado a distancia
$d$. Desde la nave se emite un pulso de luz que va hacia el espejo, rebota y vuelve a la
nave. Se quiere el **tiempo de viaje del pulso** medido en $S$ y en $S'$ (el marco de la
nave).

### Desde el marco $S$

**Ida.** El pulso recorre la distancia $d$ a velocidad $c$:

$$c\,t_1 = d \qquad \Longrightarrow \qquad t_1 = \frac{d}{c}$$

**Vuelta.** Durante la vuelta la nave ya avanzó, así que el pulso recorre $d$ menos lo que se
desplazó la nave en el tiempo total $t_1 + t_2$:

$$c\,t_2 = d - V(t_1 + t_2) = d - V\frac{d}{c} - V t_2$$

Despejando $t_2$ y reemplazando $V = 0{,}8\,c$:

$$t_2 = \frac{d - V\dfrac{d}{c}}{c + V} = \frac{d - 0{,}8\,d}{c + 0{,}8\,c} = \frac{0{,}2\,d}{1{,}8\,c} = \frac{d}{9c}$$

El **tiempo de viaje total** en $S$ es entonces

$$t_1 + t_2 = \frac{d}{c} + \frac{d}{9c} = \frac{10}{9}\,\frac{d}{c}$$

### Desde el marco $S'$

En $S'$ la distancia $d$ se ve contraída, $d' = \dfrac{d}{\gamma}$. Repitiendo el mismo
planteo de ida y vuelta con $d'$ en lugar de $d$ se obtiene un tiempo de viaje de la misma
forma:

$$t_{viaje}' = \frac{10}{9}\,\frac{d'}{c}$$

De otra manera: en $S'$ el pulso sale y vuelve al mismo lugar (la nave), así que ese tiempo
de viaje es un **tiempo propio** y se relaciona con el de $S$ por dilatación temporal,

$$t_{viaje}' = \frac{t_{viaje}}{\gamma} = \frac{10}{9}\,\frac{d}{c}\cdot\frac{1}{\gamma}$$

Ambos caminos dan el mismo resultado, como debe ser.

## Suma relativista de velocidades

Las velocidades no se suman de forma galileana: si una partícula tiene velocidad $u_x$ en
$S$, su velocidad $u_x'$ medida en $S'$ (que se mueve a $V$ respecto de $S$) es

> **Suma de velocidades.**
> $$u_x' = \frac{u_x - V}{1 - \dfrac{u_x\,V}{c^2}}$$
> donde $u_x$ es la velocidad en $S$, $V$ la velocidad relativa entre marcos y $c$ la
> velocidad de la luz. Para $u_x, V \ll c$ el denominador tiende a $1$ y se recupera la
> resta galileana $u_x' = u_x - V$.

### Problema resuelto: dos naves

Dos naves se cruzan. En el marco de una de ellas, la otra se aleja con velocidad
$u_x = -V$, y esa misma nave mide que la primera se aleja a $u_x' = -0{,}7\,c$. Se busca la
velocidad relativa $V$.

Aplicando la fórmula de suma de velocidades con $u_x = -V$:

$$u_x' = \frac{u_x - V}{1 - \dfrac{u_x V}{c^2}} = \frac{-2V}{1 + \dfrac{V^2}{c^2}} = -0{,}7\,c$$

Reordenando se llega a una ecuación cuadrática en $V$:

$$-0{,}7\,c - 0{,}7\frac{V^2}{c} = -2V \qquad \Longrightarrow \qquad 0 = \frac{0{,}7}{c}V^2 - 2V + 0{,}7\,c$$

Resolviendo con la fórmula cuadrática, una raíz da $V > c$ (no física, se descarta) y la
otra es la solución válida:

$$V = 0{,}408\,c$$

> **Observación.** La raíz mayor que $c$ se descarta porque ninguna velocidad relativa entre
> marcos inerciales puede superar la de la luz.

---

## Ver también

- [[01-maxwell-ondas-em]] — la invariancia de $c$ que sostiene toda la relatividad especial
