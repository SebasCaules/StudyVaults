---
tags: [teoria, unidad-8, difraccion, redes, resolucion-cromatica]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen)
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Redes de difracción

Una **red de difracción** es un conjunto de $N$ rendijas idénticas, de ancho $a$ y
separación $d$ (paso de la red), iluminadas por la misma onda. Combina dos efectos ya
vistos: la **interferencia** entre las $N$ rendijas y la **difracción** de cada rendija
individual. El resultado son máximos muy angostos e intensos, lo que la vuelve el
instrumento estándar para separar longitudes de onda (espectroscopía).

## Intensidad del patrón

> **Intensidad de una red de $N$ rendijas.** El patrón es el producto del factor de
> interferencia entre rendijas y la envolvente de difracción de una rendija:
> $$I = I_0\left(\frac{\sin N\gamma}{\sin\gamma}\right)^{2}\left(\frac{\sin\beta}{\beta}\right)^{2}$$
> donde $N$ es el número de rendijas iluminadas, $\gamma$ la fase entre rendijas contiguas y
> $\beta$ la fase dentro de una rendija.

Las dos variables de fase son, con incidencia oblicua de ángulo $\theta_i$ en un medio de
índice $n$,

$$\gamma = \frac{\pi}{\lambda_0}\,d\,(n\sin\theta - n_i\sin\theta_i), \qquad
\beta = \frac{\pi}{\lambda_0}\,a\,(n\sin\theta - n_i\sin\theta_i)$$

donde $d$ es el paso (distancia entre centros de rendijas contiguas) y $a$ el ancho de cada
rendija. Para incidencia normal y $n = 1$ se reducen a
$\gamma = \dfrac{\pi d}{\lambda_0}\sin\theta$ y $\beta = \dfrac{\pi a}{\lambda_0}\sin\theta$.
El primer factor genera los máximos de la red; el segundo, heredado de la
[[01-rendija-simple|rendija única]], es la **envolvente** que modula sus alturas.

## Máximos principales

Los **máximos principales** aparecen donde $\sin\gamma \to 0$ y el cociente
$\dfrac{\sin N\gamma}{\sin\gamma}$ tiende a su valor máximo $N$. Ocurre cuando $\gamma$ es
múltiplo entero de $\pi$:

$$\frac{\gamma}{\pi} \in \mathbb{Z} \;\Rightarrow\; \sin\theta = \frac{m\,\lambda_0}{d},
\qquad m \in \mathbb{Z}$$

donde $m$ es el **orden** del máximo. En esas direcciones la intensidad escala como el
cuadrado del número de rendijas:

$$I_{\text{máx.\ ppal.}} = N^{2} I_0$$

**Observación.** Para un dado orden $m$, un $\lambda_0$ más chico da un $\sin\theta$ menor:
las longitudes de onda cortas se desvían menos que las largas. Así la red **descompone** la
luz blanca en su espectro.

## Mínimos y máximos secundarios

Entre dos máximos principales consecutivos la estructura fina la fija el factor
$\dfrac{\sin N\gamma}{\sin\gamma}$:

- **Mínimos:** donde $\sin N\gamma = 0$ pero $\sin\gamma \neq 0$, es decir
  $\dfrac{\gamma}{\pi} = \dfrac{q}{N}$ con $q$ **no** múltiplo de $N$. Hay $N-1$ mínimos
  entre dos máximos principales.
- **Máximos secundarios:** quedan $N-2$ máximos secundarios entre dos principales, todos
  muchísimo más débiles.

Cuantas más rendijas se iluminan, más angostos y aislados quedan los máximos principales
(los $N-1$ mínimos los comprimen), y por eso la red separa mejor los colores.

## Constante de la red y ancho iluminado

El paso $d$ suele darse a través de la **constante de la red** $\kappa$, el número de
líneas por unidad de longitud:

$$\kappa = \frac{1}{d}$$

Si el haz ilumina un ancho $W$ de la red, el número de rendijas efectivamente iluminadas es

$$N = \kappa \cdot W$$

Este $N$ es el que entra en todas las fórmulas: **no** es el total de líneas de la red,
sino solo las que baña el haz. El orden máximo visible en la pantalla queda acotado por la
geometría, con

$$\tan\theta_{\max} = \frac{\text{ancho de la pantalla}}{2s}$$

siendo $s$ la distancia de la red a la pantalla.

## Ancho y separación angular

El **ancho angular** de un máximo principal (su semiancho hasta el mínimo adyacente) es

$$\delta\theta = \frac{2\lambda}{N\,d\cos\theta} \approx \frac{2\lambda}{N\,d}$$

que se angosta al aumentar $N$. La **separación angular** entre los máximos de orden $m$ de
dos longitudes de onda que difieren en $\Delta\lambda$ es

$$\Delta\theta = \frac{m\,\Delta\lambda_0}{d\cos\theta} \approx \frac{m\,\Delta\lambda}{d}$$

En la aproximación paraxial ($\sin\theta \approx \tan\theta \approx \theta$) ambas se
simplifican quitando el $\cos\theta$.

## Poder de resolución cromática

Dos longitudes de onda vecinas se distinguen (se "resuelven") cuando su separación angular
supera el ancho angular de los máximos. Imponiendo esa condición se obtiene la mínima
diferencia resoluble:

$$\Delta\lambda_{\min} = \frac{\lambda}{m\,N}$$

con el criterio

$$\Delta\lambda > \Delta\lambda_{\min} \Rightarrow \text{resueltos}, \qquad
\Delta\lambda < \Delta\lambda_{\min} \Rightarrow \text{no resueltos}$$

> **Poder de resolución.** Se define como la razón entre la longitud de onda y la mínima
> diferencia resoluble:
> $$R = \frac{\lambda}{\Delta\lambda} = m\,N$$
> donde $m$ es el orden y $N$ el número de rendijas iluminadas.

El poder de resolución **solo** depende del orden $m$ y de cuántas rendijas se iluminan: no
del paso $d$ ni de $\lambda$. Se resuelven mejor los colores en órdenes altos y con muchas
rendijas iluminadas.

---

## Ver también

- [[01-rendija-simple]] — el factor $(\sin\beta/\beta)^2$ que modula los máximos de la red
- [[03-criterio-de-rayleigh]] — el criterio general de resolución del que sale $\Delta\lambda_{\min}$
