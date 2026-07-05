---
tags: [teoria, unidad-6, rototraslacion, rodadura, condicion-de-rodadura]
fuentes:
  - raw/teoricas/apuntes-2023-2c.pdf
  - raw/practicas/guia-06-rototraslacion.pdf
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Rototraslación: cinemática y condición de rodadura

La rototraslación describe un cuerpo rígido que **traslada y rota a la vez**, como una esfera o
un cilindro que rueda sobre una superficie. Esta página arma la cinemática: la relación de
velocidades entre puntos del rígido, la descomposición en traslación pura más rotación pura y la
condición de rodadura sin deslizamiento. La dinámica y la energía se tratan en
[[06-rototraslacion/02-dinamica-rodadura|dinámica de la rodadura]] y
[[06-rototraslacion/03-energia-rodadura|energía en la rodadura]]. Transcripción de los apuntes de
la cursada 2023-2C.

## Relación de velocidades entre dos puntos de un rígido

En un cuerpo rígido la distancia entre dos puntos cualesquiera $A$ y $B$ es constante. Partiendo
de la relación de posiciones $\vec{r}_A = \vec{r}_B + \vec{r}_{AB}$ y derivando respecto del tiempo
se obtiene la relación de velocidades:

$$\vec{v}_A = \vec{v}_B + \vec{v}_{AB}, \qquad \vec{v}_{AB} = \frac{d\vec{r}_{AB}}{dt}$$

Como $|\vec{r}_{AB}| = \text{cte}$, el vector $\vec{r}_{AB}$ sólo puede rotar, de modo que
$\vec{v}_{AB} = \vec{\omega} \times \vec{r}_{AB}$. Queda así el resultado central:

> **Teorema.** Para dos puntos $A$ y $B$ de un mismo cuerpo rígido,
> $$\vec{v}_A = \vec{v}_B + \vec{\omega} \times \vec{r}_{AB}$$
> donde $\vec{\omega}$ es la velocidad angular del cuerpo y $\vec{r}_{AB}$ el vector que va de $B$
> a $A$. Conocida la velocidad de un punto y la rotación, queda determinada la velocidad de
> cualquier otro punto.

## Descomposición: traslación pura más rotación pura

En Física 1 se trabaja con esferas, cilindros y aros. El movimiento general se descompone como la
**superposición** de dos movimientos simples, referidos al centro de masa (CM):

> **Traslación pura.** Todos los puntos comparten la velocidad del CM:
> $$\vec{v}_i = \vec{v}_{cm} \quad \forall i, \qquad \sum \vec{F}_{ext} = M\,\vec{a}_{cm}$$

> **Rotación pura alrededor del CM.** Cada punto gira en torno al centro de masa:
> $$\vec{v}_i = \vec{\omega} \times \vec{r}_i, \qquad \sum \vec{M}_{cm} = I_{cm}\,\vec{\alpha}$$
> donde $\vec{r}_i$ es la posición del punto respecto del CM e $I_{cm}$ el momento de inercia
> respecto de un eje por el centro de masa.

La suma de ambos movimientos es la **rototraslación**: la velocidad de un punto $i$ es
$\vec{v}_i = \vec{v}_{cm} + \vec{\omega} \times \vec{r}_i$.

## Velocidad del punto de contacto — tres casos

El punto clave al rodar sobre una superficie es el **punto de contacto** $A$, en la base del
cuerpo. Tomando el sentido de avance como positivo y una velocidad angular $\omega$ que haría
rodar hacia adelante, la velocidad de ese punto es

$$v_A = v_{cm} - \omega R$$

donde $R$ es el radio del cuerpo. El signo de $v_A$ separa tres situaciones:

| Caso | Condición | Velocidad del contacto | Roce presente |
|---|---|---|---|
| **Con deslizamiento (arar)** | $v_{cm} < \omega R$ | $v_A = v_{cm} - \omega R < 0$ | cinético, hacia adelante |
| **Sin deslizamiento (rodar)** | $v_{cm} = \omega R$ | $v_A = 0$ | estático |
| **Con deslizamiento (patinar)** | $v_{cm} > \omega R$ | $v_A = v_{cm} - \omega R > 0$ | cinético, hacia atrás |

**Observación.** *Arar* es girar más de lo que se avanza (la rueda patina "hacia adelante" en el
punto de contacto); *patinar* es avanzar más de lo que se gira. El roce cinético siempre se opone
a la velocidad del punto de contacto, por eso su sentido cambia entre uno y otro caso.

## Condición de rodadura sin deslizamiento

> **Definición.** Un cuerpo **rueda sin deslizar** cuando la velocidad del punto de contacto es
> nula, $v_A = 0$. De $v_A = v_{cm} - \omega R = 0$ resulta
> $$v_{cm} = \omega R$$
> y, derivando respecto del tiempo,
> $$a_{cm} = \alpha R$$
> donde $\alpha$ es la aceleración angular. Estas dos igualdades son el **vínculo cinemático** que
> liga la traslación con la rotación cuando no hay deslizamiento.

Este vínculo es la ecuación adicional que cierra los problemas de rodadura sin deslizamiento: sin
él, traslación y rotación serían independientes.

## Ejemplos de relación de velocidades

**Rodadura simple.** Una esfera rueda sin deslizar con velocidad de CM $v_0$. El punto de contacto
$A$ (base) tiene $v_A = 0$; el punto más alto $C$ tiene $\vec{v}_C = \vec{v}_{cm} + \vec{\omega}\times\vec{r}$
con $\omega R = v_{cm}$, es decir $v_C = v_{cm} + \omega R = 2\,v_{cm}$. El punto superior se mueve
al doble de la velocidad del centro.

**Contacto que desliza (ejercicio 6.2).** Un cuerpo tiene $v_{cm} = 10\ \text{m/s}$ y su punto de
contacto $v_A = -5\ \text{m/s}$. De $v_A = v_{cm} - \omega R$ se despeja $\omega R = v_{cm} - v_A =
15\ \text{m/s}$. El punto diametralmente opuesto (arriba) tiene entonces

$$v_B = v_{cm} + \omega R = 10 + 15 = 25\ \text{m/s}$$

Como $v_{cm} < \omega R$, el cuerpo está en el caso de **arar**: gira más de lo que avanza.

---

## Ver también

- [[06-rototraslacion/02-dinamica-rodadura]] — ecuaciones de Newton y torque; problemas tipo I y tipo II
- [[06-rototraslacion/03-energia-rodadura]] — energía cinética total y el rol del roce estático
- [[02-dinamica/01-leyes-de-newton-vinculos-poleas]] — segunda ley, roce estático y cinético
