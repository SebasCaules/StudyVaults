---
tags: [teoria, unidad-2, oscilaciones-amortiguadas, energia, factor-q]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica + práctica)
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Energía y factor de calidad del oscilador amortiguado

En el oscilador subamortiguado la fricción disipa energía de forma continua, así que la energía
mecánica ya no es constante como en el [[01-mas/01-oscilador-armonico|MAS]]. Esta página calcula
cómo decae esa energía, introduce el **tiempo característico** $\tau$ y el **factor de calidad**
$Q$, y cuantifica la energía disipada. Se apoya en los tres regímenes vistos en
[[01-regimenes-de-amortiguamiento]].

## Energía del oscilador subamortiguado

La energía mecánica es la suma de la cinética y la potencial elástica:

$$E = K + U_e = \tfrac{1}{2}m\,v^2 + \tfrac{1}{2}k\,(x - l_0)^2$$

Partiendo de la solución subamortiguada y su velocidad,

$$x(t) = A\,e^{-\gamma t}\cos(\omega' t + \varphi_0) + l_0$$
$$v(t) = -\gamma A\,e^{-\gamma t}\cos(\omega' t + \varphi_0) - \omega' A\,e^{-\gamma t}\sin(\omega' t + \varphi_0)$$

y reemplazando en la energía, se llega a la expresión general

$$E(t) = \tfrac{1}{2}k\,A^2 e^{-2\gamma t}\left[\,1 + \frac{\gamma^2}{\omega_0^2}\cos(2\omega' t + 2\varphi_0) + \frac{\gamma\,\omega'}{\omega_0^2}\sin(2\omega' t + 2\varphi_0)\right]$$

donde $A$ es la amplitud inicial, $\gamma$ el coeficiente de amortiguamiento, $\omega_0$ la
frecuencia natural y $\omega' = \sqrt{\omega_0^2 - \gamma^2}$ la de amortiguamiento. El factor
$e^{-2\gamma t}$ marca la caída global de la energía, mientras que el corchete la hace **oscilar**
en el tiempo: la energía no decae de forma perfectamente suave, sino que fluctúa a medida que
pasa de cinética a potencial y viceversa.

## Amortiguamiento débil

Cuando la fricción es pequeña frente a la frecuencia propia ($\gamma \ll \omega_0$), los términos
del corchete con $\gamma/\omega_0$ se vuelven despreciables y la energía decae de forma limpia:

> **Energía en amortiguamiento débil.** Para $\gamma \ll \omega_0$,
> $$E(t) \simeq \tfrac{1}{2}k\,A^2\,e^{-2\gamma t} = E_0\,e^{-2\gamma t}$$
> donde $E_0 = \tfrac{1}{2}k A^2$ es la **energía inicial** del sistema y $e^{-2\gamma t}$ es el
> factor por el que la energía se conserva a tiempo $t$.

Nótese que la energía decae con constante $2\gamma$, el **doble** de la que gobierna la amplitud
($\gamma$): tiene sentido, porque la energía va como el cuadrado de la amplitud.

## Tiempo característico

El decaimiento exponencial define un tiempo natural del sistema:

$$\tau = \frac{1}{2\gamma}$$

El **tiempo característico** $\tau$ mide cuánto le dura la energía al sistema: es el tiempo en que
la energía cae a $1/e$ de su valor inicial (en amortiguamiento débil, $E(\tau) = E_0\,e^{-1}$).
Cuanto mayor $\tau$, más lentamente se apaga el oscilador.

## Factor de calidad Q

El factor de calidad combina la frecuencia propia con el tiempo característico y resume, en un
solo número, cuán poco amortiguado está el oscilador:

> **Factor de calidad.** Se define
> $$Q = \omega_0\,\tau = \frac{\omega_0}{2\gamma}$$
> donde $\omega_0$ es la frecuencia natural y $\gamma$ el coeficiente de amortiguamiento. Un $Q$
> grande indica poca fricción (muchas oscilaciones antes de apagarse); un $Q$ chico, mucha.

El valor de $Q$ clasifica directamente el régimen, en correspondencia con los tres casos de
[[01-regimenes-de-amortiguamiento]]:

| Régimen | Factor de calidad |
|---|---|
| Sobreamortiguado | $Q < \tfrac{1}{2}$ |
| Críticamente amortiguado | $Q = \tfrac{1}{2}$ |
| Subamortiguado | $Q > \tfrac{1}{2}$ |

## Energía disipada

La energía total se reparte en cada instante entre la que **queda** en el sistema y la que ya se
**disipó** al entorno por la fricción:

$$E_{tot}(t) = E_{sist}(t) + E_{ent}(t)$$

Como $E_{sist}(t) = E_0\,e^{-2\gamma t}$, la energía cedida al entorno es lo que falta hasta $E_0$:

> **Energía disipada.** La energía transferida al medio hasta el instante $t$ es
> $$E_{ent}(t) = E_0\left(1 - e^{-2\gamma t}\right)$$
> donde $\left(1 - e^{-2\gamma t}\right)$ es el **factor de energía disipada**: vale $0$ en
> $t = 0$ y tiende a $1$ (toda la energía perdida) cuando $t \to \infty$.

**Observación.** En el resumen de la cursada aparece además la fracción de energía que se pierde
por cada ciclo de oscilación, $\dfrac{\Delta E}{E} \simeq \dfrac{2\pi}{Q}$: un $Q$ alto significa
que en cada ciclo se disipa una fracción pequeña de la energía.

---

## Ver también

- [[01-regimenes-de-amortiguamiento]] — los tres regímenes y la ecuación del oscilador amortiguado
- [[01-mas/01-oscilador-armonico]] — energía constante en el oscilador sin fricción ($\gamma = 0$)
