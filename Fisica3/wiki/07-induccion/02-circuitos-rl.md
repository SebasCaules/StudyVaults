---
tags: [teoria, unidad-7, induccion, inductancia, circuitos-rl, energia-magnetica]
fuente: raw/resumenes/resumen-fisica-3.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Inductancia y circuitos RL

Una bobina recorrida por una corriente variable induce una fem sobre sí misma que se
opone al cambio de corriente. Esta página cubre la autoinductancia, el transitorio de
carga y descarga de un circuito RL, la constante de tiempo, la inductancia mutua y la
energía almacenada en un campo magnético. Es la continuación de la
[[07-induccion/01-ley-de-faraday-y-lenz|ley de Faraday y Lenz]].

## Autoinductancia

Cuando la corriente de una bobina cambia, cambia el flujo que ella misma genera y aparece
una fem autoinducida que se opone a la variación (ley de Lenz aplicada a la propia bobina):

> **Fem autoinducida.**
> $$\varepsilon_L = -L\,\frac{di}{dt}$$
> donde $L$ es la inductancia de la bobina e $i$ la corriente que la recorre.

La inductancia se define a partir del flujo concatenado por la corriente:

$$L = \frac{N\Phi_B}{i}$$

donde $N$ es el número de espiras, $\Phi_B$ el flujo por espira e $i$ la corriente. Su
unidad es el henry, $[L] = \mathrm{H} = \mathrm{V}\cdot\mathrm{s}/\mathrm{A}$. Despejando de
la fem autoinducida:

$$L = -\frac{\varepsilon_L}{di/dt}$$

## Circuito RL: carga

Se considera un circuito con una fuente $\varepsilon$, una resistencia $R$ y un inductor $L$
en serie, con una llave que lo conecta. Planteando la ley de mallas de Kirchhoff:

$$\varepsilon - iR - L\,\frac{di}{dt} = 0$$

Para resolver la ecuación diferencial se hace el cambio de variable $x = \dfrac{\varepsilon}{R} - i$,
con lo cual $dx = -di$ y la ecuación queda $x + \dfrac{L}{R}\dfrac{dx}{dt} = 0$. Separando e
integrando:

$$\int_{x_0}^{x} \frac{dx}{x} = -\frac{R}{L}\int_0^t dt \;\Rightarrow\; \ln\frac{x}{x_0} = -\frac{R}{L}t \;\Rightarrow\; x = x_0\,e^{-Rt/L}$$

Como $i = 0$ en $t = 0$, resulta $x_0 = \dfrac{\varepsilon}{R}$, y volviendo a la variable original
$\dfrac{\varepsilon}{R} - i = \dfrac{\varepsilon}{R}e^{-Rt/L}$. Despejando la corriente:

> **Corriente de carga de un circuito RL.**
> $$i = \frac{\varepsilon}{R}\left(1 - e^{-Rt/L}\right) \equiv \frac{\varepsilon}{R}\left(1 - e^{-t/\tau}\right)$$
> donde $\varepsilon$ es la fem de la fuente, $R$ la resistencia y $\tau$ la constante de tiempo.

La corriente arranca en cero y crece de forma asintótica hacia su valor final $\varepsilon/R$.

### Constante de tiempo

> **Constante de tiempo.** El circuito RL evoluciona con la escala temporal
> $$\tau = \frac{L}{R}$$

Es el tiempo característico del transitorio: cuanto mayor es $L$ o menor es $R$, más lento
crece (o decae) la corriente.

## Circuito RL: descarga

Si se desconecta la batería y el inductor descarga sobre la resistencia, la ley de mallas queda
sin la fuente:

$$iR + L\,\frac{di}{dt} = 0$$

cuya solución es un decaimiento exponencial:

> **Corriente de descarga de un circuito RL (sin batería).**
> $$i = \frac{\varepsilon}{R}\,e^{-t/\tau} = I_i\,e^{-t/\tau}$$
> donde $I_i$ es la corriente inicial en el momento en que se desconecta la batería.

## Inductancia mutua

Cuando dos bobinas están acopladas, la corriente de una crea un flujo que atraviesa la otra.
La inductancia mutua mide ese acoplamiento:

$$M_{12} = \frac{N_2\,\Phi_{12}}{i_1} = M_{21}$$

donde $N_2$ es el número de espiras de la segunda bobina, $\Phi_{12}$ el flujo que la corriente
$i_1$ de la primera produce sobre cada espira de la segunda. La igualdad $M_{12} = M_{21}$ indica
que el acoplamiento es simétrico. En [[07-induccion/03-problemas-induccion|los problemas]] se
calcula $M$ para un toroide con secundario y para dos solenoides coaxiales.

## Energía en un campo magnético

Multiplicando por $i$ la ecuación de mallas del circuito RL se obtiene el balance de potencias:

$$i\varepsilon = i^2 R + L\,i\,\frac{di}{dt}$$

El término $i\varepsilon$ es la rapidez con la que la batería entrega energía; $i^2 R$ es la
potencia disipada en la resistencia; y $L\,i\,\dfrac{di}{dt}$ es la rapidez con la que se carga el
inductor. Identificando $\dfrac{dU_B}{dt} = L\,i\,\dfrac{di}{dt}$ e integrando:

> **Energía almacenada en un inductor.**
> $$U_B = \frac{1}{2}L\,i^2$$
> donde $L$ es la inductancia e $i$ la corriente.

Esta energía queda guardada en el campo magnético. Su densidad (energía por unidad de volumen) es:

$$u_B = \frac{B^2}{2\mu_0}$$

donde $B$ es la magnitud del campo magnético y $\mu_0$ la permeabilidad del vacío.

---

## Ver también

- [[07-induccion/01-ley-de-faraday-y-lenz]] — fem inducida, flujo magnético y ley de Lenz
- [[07-induccion/03-problemas-induccion]] — barra cayendo (velocidad terminal) e inductancia mutua resueltas
