---
tags: [resuelto, unidad-7, induccion, fem-de-movimiento, inductancia-mutua]
fuente: raw/practicas/practica-fisica-3.pdf
unidad: 7
tipo: resuelto
actualizado: 2026-07-05
---

# Problemas de inducción (guía 6)

Selección de problemas resueltos de la guía de inducción, transcriptos de los apuntes de
la cursada 2024-1C. Aplican la [[07-induccion/01-ley-de-faraday-y-lenz|ley de Faraday y Lenz]]
y los [[07-induccion/02-circuitos-rl|circuitos RL]].

## Sentido de la corriente inducida (Lenz)

> **Ejemplo.** Un solenoide conectado a una resistencia $R$ queda inmerso en un campo
> $\vec{B}$ que atraviesa su eje. Según el sentido en que cambia el flujo, la corriente
> inducida $i$ circula por la resistencia en un sentido u otro: siempre el que crea un campo
> que **se opone** al cambio de flujo (ley de Lenz). Invertir el sentido de $\vec{B}$ (o del
> cambio de flujo) invierte el sentido de la corriente inducida.

## Generador rotante

> **Ejemplo.** Un radio de longitud $R$ barre un campo $\vec{B}$ perpendicular al plano
> rotando con velocidad angular $\omega = 2\pi f$. El área barrida es la de un sector
> circular, $A = \tfrac{1}{2}\theta R^2$ con $\theta = \omega t$, de modo que el flujo crece
> linealmente en el tiempo:
> $$\Phi_B = BA = \tfrac{1}{2}B\omega t\,R^2$$
> La fem inducida es entonces constante:
> $$\varepsilon = \frac{d\Phi_B}{dt} = \tfrac{1}{2}B\omega R^2 = B\pi R^2 f$$
> es decir $\varepsilon = BAf$ tomando $A = \pi R^2$ el área del disco completo.

## Fem de movimiento a distintos ángulos

Una barra de largo $\ell$ se mueve con velocidad $v$; según la orientación relativa entre
$\vec{v}$, $\vec{B}$ y la barra, cambia el flujo efectivo y por lo tanto la fem.

> **Ejemplo.** Tres configuraciones de una misma barra que se mueve hacia la derecha:
>
> i) **$\vec{B}$ perpendicular al plano, $\vec{v}$ perpendicular a $\vec{B}$.** El flujo es
>    $\Phi_B = B\ell x$ y la fem es máxima:
>    $$\varepsilon = -B\ell v \approx 3\ \mathrm{V}$$
> ii) **$\vec{B}$ perpendicular al plano, barra a $30^\circ$.** Solo cuenta la componente
>    $v\cos\theta$ de la velocidad, con lo que la fem se reduce:
>    $$\varepsilon = -B\ell v\cos 30^\circ \approx -2{,}6\ \mathrm{V}$$
> iii) **$\vec{B}$ en el plano del movimiento.** No hay flujo que atraviese el área barrida,
>    así que no se induce fem:
>    $$\varepsilon = 0$$

**Nota.** Los valores numéricos ($3\ \mathrm{V}$, $-2{,}6\ \mathrm{V}$) corresponden a los
datos del enunciado original y se transcriben tal como figuran en los apuntes.

## Barra cayendo: velocidad terminal

> **Ejemplo.** Una espira (o barra sobre rieles) de ancho $\ell$, masa $m$ y resistencia $R$
> cae por gravedad entrando en una región de campo $\vec{B}$. El peso la acelera y la fuerza
> magnética sobre la corriente inducida la frena. Planteando la segunda ley de Newton:
> $$mg - F_m = ma, \qquad F_m = iB\ell$$
> La corriente inducida sale de la fem de movimiento. El flujo crece con la posición
> $y = vt$, así que $\Phi_B(t) = B\ell v t$, de donde:
> $$\varepsilon = B\ell v \;\Rightarrow\; i = \frac{B\ell v}{R}$$
> Reemplazando en la ecuación de Newton se llega a la ecuación diferencial:
> $$mg - \frac{B^2\ell^2 v}{R} = m\,\frac{dv}{dt} \;\Rightarrow\; g - \frac{B^2\ell^2}{mR}v = \frac{dv}{dt}$$
> cuya solución es una aproximación asintótica a la **velocidad terminal**:
> $$v(t) = \frac{mgR}{B^2\ell^2}\left(1 - e^{-\frac{B^2\ell^2}{mR}t}\right)$$

La velocidad límite $v_\infty = \dfrac{mgR}{B^2\ell^2}$ es aquella en que la fuerza magnética
iguala al peso y la aceleración se anula.

## Inductancia mutua

Los últimos problemas de la guía calculan la inductancia mutua $M_{12} = \dfrac{N_2\Phi_{12}}{i_1}$
(ver [[07-induccion/02-circuitos-rl#inductancia-mutua|inductancia mutua]]) en dos montajes:

> **Ejemplo (dos solenoides coaxiales).** Un solenoide interior largo de $N_1$ espiras,
> longitud $\ell_1$ y sección $A$ crea en su interior el campo $B_1 = \dfrac{\mu_0 N_1 i_1}{\ell_1}$.
> Un segundo bobinado de $N_2$ espiras arrollado sobre él concatena el flujo $\Phi_{12} = B_1 A$.
> La inductancia mutua resulta:
> $$M_{12} = \frac{N_2\,\Phi_{12}}{i_1} = \frac{\mu_0 N_1 N_2 A}{\ell_1}$$
> con datos $N_1 = 1000$, $N_2 = 20$, $A = 10\ \mathrm{cm}^2$ y $\ell_1 = 1\ \mathrm{m}$
> (el producto $N_1 N_2 = 20000$ aparece destacado en la resolución original).

**Nota.** El otro caso de la guía es un toroide de $N = 500$ espiras (radios $r_i = 0{,}02\ \mathrm{m}$,
$r_e = 0{,}06\ \mathrm{m}$, altura $h = 0{,}05\ \mathrm{m}$) con un secundario alimentado por
$i(t) = 50\sin(314\,t)$; su resolución numérica en los apuntes está parcialmente desarrollada
*(dudoso en el original)*.

---

## Ver también

- [[07-induccion/01-ley-de-faraday-y-lenz]] — teoría de la fem inducida, de movimiento y ley de Lenz
- [[07-induccion/02-circuitos-rl]] — inductancia, transitorio RL y energía magnética
