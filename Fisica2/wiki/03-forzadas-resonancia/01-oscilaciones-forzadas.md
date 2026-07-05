---
tags: [teoria, unidad-3, oscilaciones-forzadas, regimen-estacionario, amplitud, fase]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Oscilaciones forzadas

Un **oscilador forzado** es un sistema masa-resorte con fricción viscosa al que se le aplica
además una fuerza externa periódica. A diferencia del [[02-amortiguadas/01-regimenes-de-amortiguamiento|oscilador
amortiguado]], que solo pierde energía y termina deteniéndose, aquí la fuerza externa
**repone energía** en cada ciclo: tras un transitorio inicial el sistema oscila de forma
sostenida a la frecuencia de la fuerza. Este régimen sostenido es el que da lugar a la
[[02-resonancia|resonancia]].

## Planteo del sistema

Al sistema masa-resorte inmerso en un medio viscoso se le aplica una fuerza forzante armónica

$$F(t) = F_0 \cos(\omega t)$$

donde $F_0$ es la amplitud de la fuerza y $\omega$ la **frecuencia de forzado** (la frecuencia
con la que se agita el sistema, en general distinta de la propia del oscilador).

Sobre la masa actúan tres fuerzas: la del resorte $F_e = -k\,\Delta x$, la viscosa
$F_v = -b\,\dot{x}$ (proporcional a la velocidad, opuesta al movimiento) y la forzante $F(t)$.
Aplicando la segunda ley de Newton $\sum F = m\ddot{x}$:

$$-k(x - l_0) - b\,\dot{x} + F_0 \cos(\omega t) = m\ddot{x}$$

donde $k$ es la constante del resorte, $b$ el coeficiente de fricción viscosa, $m$ la masa y
$l_0$ la longitud natural del resorte.

## Ecuación diferencial del oscilador forzado

Reordenando y dividiendo por $m$ se obtiene la ecuación de movimiento:

$$\ddot{x} + \frac{b}{m}\dot{x} + \frac{k}{m}\,x = \frac{F_0}{m}\cos(\omega t) + \frac{k\,l_0}{m}$$

Se introducen los dos parámetros que caracterizan al oscilador (los mismos del caso
amortiguado):

$$\gamma = \frac{b}{2m}, \qquad \omega_0 = \sqrt{\frac{k}{m}}$$

donde $\gamma$ es la **constante de amortiguamiento** y $\omega_0$ la **frecuencia natural**
(la que tendría el sistema sin fricción ni forzado). Con esta notación la ecuación queda

$$\ddot{x} + 2\gamma\,\dot{x} + \omega_0^2\,x = \frac{F_0}{m}\cos(\omega t) + \omega_0^2\,l_0$$

Es una ecuación diferencial lineal **no homogénea**: su solución general es la suma de la
solución homogénea (el transitorio amortiguado, que decae como $e^{-\gamma t}$ y desaparece)
más una solución particular que oscila a la frecuencia de forzado $\omega$. Pasado el
transitorio, sobrevive únicamente esa parte: el **régimen estacionario**.

## Régimen estacionario

En el régimen estacionario el sistema oscila a la frecuencia de la fuerza $\omega$, pero
**retrasado** respecto de ella:

$$x(t) = A_{est}\,\cos(\omega t - \delta)$$

donde intervienen tres cantidades:

- $A_{est}$ — la **amplitud** de la oscilación estacionaria,
- $\omega$ — la **frecuencia de oscilación**, impuesta por la forzante,
- $\delta$ — el **retraso (desfase)** de la respuesta del sistema respecto de la fuerza.

### Amplitud estacionaria

La amplitud del régimen estacionario depende de la frecuencia de forzado según

$$A_{est}(\omega) = \frac{F_0/m}{\sqrt{(\omega_0^2 - \omega^2)^2 + (2\gamma\omega)^2}}$$

donde $F_0$ es la amplitud de la fuerza, $m$ la masa, $\omega_0$ la frecuencia natural,
$\omega$ la frecuencia de forzado y $\gamma$ la constante de amortiguamiento. La amplitud es
grande cuando el denominador es chico, es decir cuando $\omega$ se acerca a $\omega_0$: ese
es el fenómeno de [[02-resonancia|resonancia]].

### Desfase

El retraso $\delta$ entre la respuesta y la fuerza queda determinado por

$$\tan\delta = \frac{2\gamma\omega}{\omega_0^2 - \omega^2}, \qquad
\operatorname{sen}\delta = \frac{2\gamma\omega}{\sqrt{(\omega_0^2 - \omega^2)^2 + (2\gamma\omega)^2}}$$

con los mismos símbolos que antes. El desfase pasa de $\delta \approx 0$ (la masa sigue a la
fuerza) para $\omega \ll \omega_0$, a $\delta = \pi/2$ cuando $\omega = \omega_0$, hasta
$\delta \approx \pi$ (la masa va en contrafase) para $\omega \gg \omega_0$.

> **Observación.** Tanto la amplitud $A_{est}$ como el desfase $\delta$ **no dependen de las
> condiciones iniciales**, sino solo de la frecuencia de oscilación $\omega$ (y de los
> parámetros $F_0$, $m$, $\gamma$, $\omega_0$). Las condiciones iniciales afectan únicamente al
> transitorio, que se extingue. Este es el rasgo distintivo del régimen estacionario: el
> sistema "olvida" cómo empezó y se sincroniza con la fuerza.

---

## Ver también

- [[02-resonancia]] — curvas de amplitud y potencia, ancho de banda
- [[02-amortiguadas/01-regimenes-de-amortiguamiento]] — de donde salen $\gamma$ y $\omega_0$
- [[02-amortiguadas/02-energia-y-factor-q]] — el factor de calidad $Q$ y la energía del oscilador
- [[01-mas/01-oscilador-armonico|Movimiento armónico simple]] — el oscilador sin fricción ni forzado
