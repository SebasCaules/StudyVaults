---
tags: [teoria, unidad-8, corriente-alterna, reactancia, valor-eficaz, fasores]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Fundamentos de corriente alterna

En un circuito de corriente alterna (CA) la fuente entrega una tensión que oscila
sinusoidalmente en el tiempo, en lugar de la tensión constante de una fuente de
[[04-circuitos-dc/02-circuitos-de-corriente-directa|corriente directa]]. Esta página
introduce la fuente de CA, los valores eficaces (RMS) con los que se mide potencia, y el
comportamiento de cada elemento pasivo —resistor, inductor y capacitor— por separado frente
a la señal alterna. La combinación de los tres en serie se trata en [[02-rlc-serie|circuitos
RLC en serie]].

## Fuente de corriente alterna

> **Definición.** Una fuente de CA entrega una diferencia de potencial sinusoidal
> $$\Delta v = \Delta V_{max}\,\sin\omega t$$
> donde $\Delta V_{max}$ es la tensión máxima (amplitud), $\omega$ la frecuencia angular y
> $t$ el tiempo.

La frecuencia angular se relaciona con la frecuencia $f$ y el período $T$ de la señal:

$$\omega = 2\pi f = \frac{2\pi}{T}$$

donde $f$ es la frecuencia (número de ciclos por segundo) y $T$ el período (duración de un
ciclo).

## Valores eficaces (RMS)

La potencia instantánea disipada en un resistor recorrido por la corriente $i$ es
$P = i^2 R$. Como $i$ oscila, interesa su valor cuadrático medio. El promedio del cuadrado de
la corriente sobre un ciclo es

$$\left(i^2\right)_{prom} = \tfrac{1}{2}\,I_{max}^2$$

donde $I_{max}$ es la corriente máxima. La **corriente eficaz** o RMS (root mean square) es la
raíz de ese promedio:

$$I_{rms} = \sqrt{\left(i^2\right)_{prom}} = \frac{I_{max}}{\sqrt{2}}$$

Con la corriente eficaz, la potencia promedio entregada a un resistor toma la misma forma que
en continua:

$$P_{prom} = I_{rms}^2\,R$$

Análogamente se define el **voltaje eficaz** o RMS a partir de la tensión máxima:

$$\Delta V_{rms} = \frac{\Delta V_{max}}{\sqrt{2}}$$

> **Observación.** El valor eficaz es el que mediría un instrumento de continua equivalente:
> una corriente alterna de valor eficaz $I_{rms}$ disipa en un resistor la misma potencia
> media que una continua de igual valor.

## Resistor en un circuito de CA

Para un resistor $R$ conectado a la fuente, la ley de mallas da
$\Delta v - i_R R = 0$, de donde la corriente sigue instantáneamente a la tensión:

$$i_R = \frac{\Delta V_{max}}{R}\,\sin\omega t = I_{max}\,\sin\omega t, \qquad I_{max} = \frac{\Delta V_{max}}{R}$$

donde $i_R$ es la corriente por el resistor e $I_{max}$ su amplitud. La tensión y la corriente
están **en fase**: alcanzan sus máximos y ceros en los mismos instantes.

## Inductor en un circuito de CA

Para un inductor $L$, la ley de mallas $\Delta v - L\dfrac{di_L}{dt} = 0$ conduce, integrando
$\Delta V_{max}\sin\omega t = L\,di_L/dt$, a

$$i_L = \frac{\Delta V_{max}}{\omega L}\,\sin\!\left(\omega t - \frac{\pi}{2}\right)$$

donde $i_L$ es la corriente por el inductor. La corriente está **desfasada** respecto de la
tensión: **se atrasa** $\pi/2$ (90°). Su amplitud se alcanza cuando el seno vale $\pm 1$:

$$I_{max} = \frac{\Delta V_{max}}{\omega L} = \frac{\Delta V_{max}}{X_L}$$

> **Definición.** La **reactancia inductiva** es la oposición del inductor a la corriente
> alterna,
> $$X_L = \omega L$$
> con las mismas unidades que una resistencia ($\Omega$). Crece con la frecuencia: a mayor
> $\omega$, más se opone el inductor.

Con la convención de mallas de estos apuntes ($\Delta v + \Delta v_L = 0$), la tensión en las
terminales del inductor es

$$\Delta v_L = -L\frac{di_L}{dt} = -\Delta V_{max}\,\sin\omega t = -I_{max}\,X_L\,\sin\omega t$$

de modo que su amplitud es $I_{max}X_L$.

## Capacitor en un circuito de CA

Para un capacitor $C$, la ley de mallas $\Delta v - \dfrac{q}{C} = 0$ da la carga
$q = C\,\Delta V_{max}\sin\omega t$. Derivando, la corriente es

$$i_C = \frac{dq}{dt} = \omega C\,\Delta V_{max}\,\cos\omega t = \omega C\,\Delta V_{max}\,\sin\!\left(\omega t + \frac{\pi}{2}\right)$$

donde $i_C$ es la corriente por el capacitor. Aquí la corriente **se adelanta** $\pi/2$ (90°)
a la tensión. Su amplitud es

$$I_{max} = \omega C\,\Delta V_{max} = \frac{\Delta V_{max}}{X_C}$$

> **Definición.** La **reactancia capacitiva** es la oposición del capacitor a la corriente
> alterna,
> $$X_C = \frac{1}{\omega C}$$
> también en $\Omega$. A diferencia de $X_L$, **decrece** con la frecuencia: a mayor $\omega$,
> menos se opone el capacitor.

La tensión en las terminales del capacitor es

$$\Delta v_C = \Delta V_{max}\,\sin\omega t = I_{max}\,X_C\,\sin\omega t$$

## Fasores: resumen del desfase

Cada elemento se puede representar con un **fasor**: un vector giratorio cuya proyección da la
señal sinusoidal. En el diagrama de fasores, la tensión y la corriente de un mismo elemento
forman un ángulo igual a su desfase. El siguiente cuadro resume el comportamiento de los tres
elementos frente a la señal alterna:

| Elemento | Corriente vs. tensión | Reactancia / resistencia | Amplitud de tensión |
|---|---|---|---|
| Resistor $R$ | en fase | $R$ | $\Delta V_{R,max} = I_{max}\,R$ |
| Inductor $L$ | corriente atrasa $\pi/2$ | $X_L = \omega L$ | $\Delta V_{L,max} = I_{max}\,X_L$ |
| Capacitor $C$ | corriente adelanta $\pi/2$ | $X_C = \dfrac{1}{\omega C}$ | $\Delta V_{C,max} = I_{max}\,X_C$ |

**Observación.** Un recurso mnemotécnico: en el inductor la tensión "va primero" y la
corriente la sigue; en el capacitor la corriente "va primero". El resistor no introduce
desfase. Estas relaciones son la base para sumar los tres elementos en un
[[02-rlc-serie|circuito RLC serie]].

---

## Ver también

- [[02-rlc-serie]] — los tres elementos en serie: impedancia y ángulo de fase
- [[03-potencia-resonancia-transformadores]] — potencia media, resonancia y transformadores
- [[04-circuitos-dc/02-circuitos-de-corriente-directa]] — el contraste con la corriente directa
- [[05-capacitores/01-capacitores]] — el capacitor y su capacitancia
