---
tags: [teoria, unidad-7, interferencia, young, doble-rendija, interfranja]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen)
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Doble rendija de Young

El experimento de **Young** es el caso emblemático de interferencia por **división del frente de
onda**: un haz coherente ilumina dos rendijas paralelas y, sobre una pantalla lejana, se forma un
patrón de franjas claras y oscuras. A diferencia de la
[[02-division-de-amplitud|división de amplitud]], acá el haz no se parte por reflexión sino
tomando dos porciones distintas del mismo frente de onda (las dos rendijas), que por venir del
mismo haz son coherentes.

> **Nota.** En los apuntes de la cursada este tema aparece desarrollado en el resumen, no en la
> teórica. La fórmula que se usa es la versión completa, que incluye ya la envolvente de
> difracción por el ancho finito de cada rendija.

## Geometría y diferencia de camino

Dos rendijas separadas una distancia $d$, cada una de ancho $a$, iluminadas por luz de longitud de
onda en el vacío $\lambda_0$. Un punto de la pantalla se ubica por el ángulo $\theta$ respecto de
la normal. Como la pantalla está lejos, los rayos que salen de ambas rendijas hacia ese punto son
prácticamente paralelos, y el rayo de una rendija recorre de más

$$\Delta r = n\,d\operatorname{sen}\theta$$

donde $n$ es el índice del medio, $d$ la separación entre rendijas y $\theta$ el ángulo de
observación. Esa diferencia de camino es la que fija el desfase entre los dos haces y, por lo
tanto, dónde caen las franjas.

## Intensidad: interferencia por difracción

Cuando se tiene en cuenta que cada rendija tiene un **ancho finito** $a$, el patrón de Young no es
un peine de franjas iguales: las franjas de interferencia quedan **moduladas** por la campana de
difracción de una sola rendija. La intensidad sobre la pantalla es

$$I = 4I_0\,\cos^2\!\gamma\;\frac{\operatorname{sen}^2\beta}{\beta^2}$$

donde $I_0$ es la intensidad de una rendija sola, y los dos ángulos auxiliares son

$$\gamma = \frac{\pi}{\lambda_0}\,n\,d\operatorname{sen}\theta, \qquad
\beta = \frac{\pi}{\lambda_0}\,n\,a\operatorname{sen}\theta$$

con $d$ la separación entre rendijas, $a$ el ancho de cada rendija, $n$ el índice del medio,
$\lambda_0$ la longitud de onda en el vacío y $\theta$ el ángulo de observación. El factor $\cos^2\gamma$ es la
**interferencia** entre las dos rendijas (franjas finas y numerosas); el factor
$(\operatorname{sen}\beta / \beta)^2$ es la **envolvente de difracción** de una rendija (una campana
ancha que decide la altura de cada franja).

## Máximos y mínimos de interferencia

Las franjas de interferencia las gobierna el factor $\cos^2\gamma$:

> **Máximos de interferencia.** Cuando $\gamma = m\pi$, es decir
> $$n\,d\operatorname{sen}\theta = m\,\lambda_0, \qquad m \in \mathbb{Z}$$
> el factor $\cos^2\gamma = 1$ y aparece una franja brillante de orden $m$.

> **Mínimos de interferencia.** Cuando $\gamma = (2m+1)\tfrac{\pi}{2}$, es decir
> $$n\,d\operatorname{sen}\theta = \left(m + \tfrac12\right)\lambda_0$$
> el factor $\cos^2\gamma = 0$ y la franja se apaga.

donde $m$ es el orden de la franja. Cuando se está sobre un máximo de interferencia, la altura de
esa franja la fija la envolvente: $(\operatorname{sen}\beta/\beta)^2$ evaluada en ese ángulo, que
vale $1$ solo en el máximo central ($\theta = 0$).

## Envolvente de difracción y órdenes ausentes

El factor $(\operatorname{sen}\beta / \beta)^2$ tiene sus propios **mínimos** cuando

$$\beta = p\pi \;\Rightarrow\; n\,a\operatorname{sen}\theta = p\,\lambda_0, \qquad p = 1, 2, 3, \dots$$

En esos ángulos la envolvente cae a cero y **suprime** cualquier franja de interferencia que
coincida ahí. Igualando la condición de máximo de interferencia ($n\,d\operatorname{sen}\theta =
m\lambda_0$) con la de mínimo de difracción ($n\,a\operatorname{sen}\theta = p\lambda_0$) se obtienen
los **órdenes ausentes** (el índice $n$ se cancela):

$$m = p\,\frac{d}{a}$$

Es decir: si $d/a$ es un entero, cada $d/a$ órdenes de interferencia falta una franja (queda tapada
por un cero de la difracción).

## Interfranja

En la pantalla, ubicada a una distancia $s$ de las rendijas y para ángulos pequeños
($\operatorname{sen}\theta \approx y/s$), los máximos de interferencia caen en posiciones
$y_m = m\,\lambda_0\,s / (n\,d)$. La **interfranja** —distancia entre dos máximos consecutivos— es
por lo tanto

$$\Delta y = \frac{\lambda_0\,s}{n\,d}$$

donde $\lambda_0$ es la longitud de onda en el vacío, $s$ la distancia a la pantalla, $d$ la
separación entre rendijas y $n$ el índice del medio. La interfranja **crece** con $\lambda_0$ y con
$s$, y **se achica** al aumentar $d$ o $n$.

> **Observación.** El índice $n$ es el del medio donde está el dispositivo: en aire ($n \approx 1$)
> la interfranja vale $\lambda_0 s / d$. Sumergir todo en un medio de índice $n$ reduce la longitud
> de onda efectiva a $\lambda_0/n$ y comprime el patrón; del mismo modo, cambiar a una luz de mayor
> $\lambda_0$ separa las franjas.

## Corrimiento del patrón por una lámina

Un caso frecuente es tapar una de las rendijas con una **lámina delgada** de índice $n'$ y espesor
$e$. La lámina agrega camino óptico a ese brazo y **desplaza** todo el patrón. El ángulo de
interferencia se generaliza a

$$\gamma = \frac{\pi}{\lambda_0}\Big(n\,d\operatorname{sen}\theta + (n' - n)\,e\Big)$$

donde el término $(n'-n)e$ es el corrimiento constante que introduce la lámina. El patrón se corre
**hacia el lado de la luz más lenta** cuando $n' > n$, y hacia el lado de la luz más rápida cuando
$n' < n$. Este es el mecanismo detrás de los problemas de "hallar el espesor $e$ de la lámina que
recentra el patrón". De forma análoga, si el haz incide oblicuamente con un ángulo $\theta_i$ en un
medio $n_i$, el término de interferencia se generaliza a $\gamma = \tfrac{\pi}{\lambda_0}\,
d\,(n\operatorname{sen}\theta - n_i\operatorname{sen}\theta_i)$.

---

## Ver también

- [[01-fundamentos-interferencia]] — coherencia, camino óptico y condiciones de máximo/mínimo
- [[02-division-de-amplitud]] — el otro método: láminas delgadas, cuña y anillos de Newton
