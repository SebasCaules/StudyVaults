---
tags: [resuelto, unidad-3, potencial-electrico, energia-potencial]
fuente: raw/practicas/practica-fisica-3.pdf
unidad: 3
tipo: resuelto
actualizado: 2026-07-05
---

# Potencial: aplicaciones

Dos problemas resueltos de la práctica de la cursada 2024-1C que aplican la teoría de
[[03-potencial/01-trabajo-y-potencial|trabajo y potencial]]: el potencial de un disco cargado
sobre su eje (integrando contribuciones puntuales) y el movimiento de una carga entre dos placas
(usando conservación de energía).

## Potencial de un disco cargado sobre su eje

Se busca el potencial en un punto del eje de un disco de radio $R$, a distancia $x$ del centro,
cuya densidad superficial de carga crece con el radio según $\sigma = a\,r^2$ (con $a$ constante
y $r$ la distancia al centro sobre el disco).

La estrategia es sumar el potencial que aporta cada elemento de carga, tratado como carga
puntual. El potencial puntual a distancia $s$ de una carga $dq$ es

$$V_{puntual} = \frac{k\,dq}{s}, \qquad dV = \frac{k\,dq}{s} = \frac{k\,\sigma\,dA}{s}$$

Se descompone el disco en **anillos** de radio $r$ y espesor $dr$: cada anillo tiene área
$dA = 2\pi r\,dr$ y todos sus puntos están a la misma distancia
$s = \sqrt{r^2 + x^2}$ del punto del eje. Con $\sigma = a\,r^2$ y $k = \dfrac{1}{4\pi\varepsilon_0}$:

$$dV = \frac{k\,(a\,r^2)\,(2\pi r\,dr)}{\sqrt{r^2 + x^2}} = \frac{1}{4\pi\varepsilon_0}\cdot\frac{2\pi\,a\,r^3}{\sqrt{r^2 + x^2}}\,dr = \frac{a\,r^3}{2\varepsilon_0\,\sqrt{r^2 + x^2}}\,dr$$

Integrando sobre el radio del disco, de $0$ a $R$, queda el potencial en función de $x$:

$$V(x) = \frac{a}{2\varepsilon_0}\int_0^{R} \frac{r^3}{\sqrt{r^2 + x^2}}\,dr$$

donde $a$ es la constante de la densidad, $R$ el radio del disco y $x$ la distancia del punto al
centro sobre el eje.

**Nota.** El límite superior de la integral es el radio del disco (algo dudoso en el original,
donde la caligrafía del extremo es ambigua). El trabajo para traer una carga $q_1$ desde el
infinito hasta la posición $x_1$ sobre el eje se obtiene con la diferencia de potencial:

$$W_{\infty\to x_1} = q_1\left(V_{disco}(x_1) - V_{disco}(\infty)\right)$$

y se toma $V_{disco}(\infty) = 0$ porque el disco está acotado en el espacio (la convención
$V_\infty = 0$ sí aplica a una distribución finita).

## Energía de una carga entre placas

Un electrón (carga $q < 0$) parte de la placa inferior $A$ con velocidad $v_A$ formando $60^\circ$
con la placa, y sube hacia la placa superior $B$, separadas una distancia $h$. Entre las placas
hay un campo uniforme $\vec{E}$. Como el campo apunta de $A$ hacia $B$,

$$V_B - V_A = -\int_A^B \vec{E}\cdot d\vec{\ell} < 0$$

es decir $V_B < V_A$. Esto es coherente con el criterio de movimiento: la carga negativa se
frena al ir hacia el potencial menor, comportándose al revés que una positiva.

Se plantea **conservación de la energía mecánica** entre $A$ y $B$. La energía potencial de la
carga es $U = qV = -|q|V$, así que la energía total (cinética más potencial) se conserva:

$$\tfrac{1}{2}\,m_q\,v_A^2 - |q|\,V_A = \tfrac{1}{2}\,m_q\,v_B^2 - |q|\,V_B$$

donde $m_q$ es la masa de la carga y $v_A$, $v_B$ sus rapideces en cada placa. La fuerza sobre la
carga es puramente vertical ($F_{qx} = 0$), de modo que la componente horizontal de la velocidad
se conserva, $v_{Ax} = v_{Bx}$. Tomando $B$ como el punto más alto de la trayectoria (donde
$v_{By} = 0$, luego $v_B = v_{Bx}$), la diferencia de rapideces al cuadrado se reduce a la
componente vertical inicial:

$$v_A^2 - v_B^2 = (v_{Ax}^2 + v_{Ay}^2) - v_{Bx}^2 = v_{Ay}^2$$

Reemplazando en la conservación y despejando:

$$m_q\,v_{Ay}^2 = 2\,|q|\,(V_A - V_B), \qquad v_{Ay} = v_A\,\operatorname{sen}(60^\circ)$$

$$V_A - V_B = \frac{m_q\,v_A^2\,\operatorname{sen}^2(60^\circ)}{2\,|q|}$$

donde $v_A$ es la rapidez inicial y $60^\circ$ el ángulo de lanzamiento respecto de la placa. La
diferencia de potencial entre las placas queda determinada por la energía cinética vertical con
la que arranca la carga.

---

## Ver también

- [[03-potencial/01-trabajo-y-potencial]] — definiciones de potencial, energía potencial y trabajo
- [[01-electrostatica/02-campo-electrico]] — campo de distribuciones continuas por integración
