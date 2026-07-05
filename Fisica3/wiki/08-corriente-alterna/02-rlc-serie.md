---
tags: [teoria, unidad-8, corriente-alterna, rlc-serie, impedancia, angulo-de-fase]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Circuitos RLC en serie

Un circuito RLC serie conecta un resistor, un inductor y un capacitor en una sola malla
alimentada por una [[01-fundamentos-ca|fuente de corriente alterna]]. Como los tres elementos
comparten la misma corriente pero desfasan la tensión de manera distinta, sus caídas de
potencial no se suman aritméticamente sino como fasores. De esa suma vectorial salen la
**impedancia** del circuito y el **ángulo de fase** entre corriente y tensión.

## Corriente y caídas de tensión

En el circuito serie la corriente es común a los tres elementos y tiene la forma

$$i = I_{max}\,\sin(\omega t - \phi)$$

donde $I_{max}$ es la amplitud de la corriente y $\phi$ es el ángulo de fase entre la
corriente y la tensión de la fuente. Cada elemento produce su propia caída de tensión, con el
desfase que le corresponde:

$$\Delta v_R = I_{max}\,R\,\sin\omega t = \Delta V_R\,\sin\omega t$$

$$\Delta v_L = I_{max}\,X_L\,\sin\!\left(\omega t + \tfrac{\pi}{2}\right) = \Delta V_L\,\cos\omega t$$

$$\Delta v_C = I_{max}\,X_C\,\sin\!\left(\omega t - \tfrac{\pi}{2}\right) = -\Delta V_C\,\cos\omega t$$

donde $\Delta V_R = I_{max}R$, $\Delta V_L = I_{max}X_L$ y $\Delta V_C = I_{max}X_C$ son las
amplitudes de cada caída, y $X_L = \omega L$, $X_C = 1/\omega C$ las reactancias definidas en
[[01-fundamentos-ca|los fundamentos]].

## Impedancia

Como la caída del resistor está en fase y las del inductor y del capacitor están en
cuadratura (y opuestas entre sí), la amplitud de la tensión de la fuente es la hipotenusa del
triángulo de fasores:

$$\Delta V_{max} = \sqrt{\Delta V_R^{\,2} + (\Delta V_L - \Delta V_C)^2} = \sqrt{(I_{max}R)^2 + (I_{max}X_L - I_{max}X_C)^2}$$

Sacando $I_{max}$ de factor común, $\Delta V_{max} = I_{max}\sqrt{R^2 + (X_L - X_C)^2}$. La
raíz que multiplica a la corriente es la impedancia del circuito.

> **Definición.** La **impedancia** de un circuito RLC serie es
> $$Z = \sqrt{R^2 + (X_L - X_C)^2}$$
> medida en $\Omega$. Generaliza a la resistencia: es la oposición total del circuito a la
> corriente alterna, combinando la parte resistiva $R$ y la reactiva $X_L - X_C$.

Con ella, la amplitud de la corriente es simplemente

$$I_{max} = \frac{\Delta V_{max}}{Z}$$

la versión en CA de la ley de Ohm.

## Ángulo de fase

El ángulo de fase $\phi$ entre la corriente y la tensión de la fuente sale del mismo triángulo
de fasores, como el arcotangente del cociente entre la parte reactiva y la resistiva:

$$\phi = \tan^{-1}\!\left(\frac{\Delta V_L - \Delta V_C}{\Delta V_R}\right) = \tan^{-1}\!\left(\frac{X_L - X_C}{R}\right)$$

donde un $\phi$ positivo indica que la corriente se atrasa respecto de la tensión. Según cuál
reactancia domine, el circuito se comporta de tres maneras:

| Condición | Ángulo | Comportamiento |
|---|---|---|
| $X_L > X_C$ | $\phi > 0$ (corriente atrasa la tensión) | más inductivo que capacitivo |
| $X_L < X_C$ | $\phi < 0$ (corriente adelanta la tensión) | más capacitivo que inductivo |
| $X_L = X_C$ | $\phi = 0$ | completamente resistivo |

El último caso, $X_L = X_C$, es la condición de resonancia, que se desarrolla en
[[03-potencia-resonancia-transformadores|potencia, resonancia y transformadores]].

## Notación compleja

Es cómodo escribir tensión y corriente como exponenciales complejas, con $j$ la unidad
imaginaria. Partiendo de $v(t) = V_{max}\cos(\omega t + \phi_v)$ e
$i(t) = I_{max}\cos(\omega t + \phi_i)$:

$$v(t) = V_{max}\,e^{\,j(\omega t + \phi_v)}, \qquad i(t) = I_{max}\,e^{\,j(\omega t + \phi_i)}$$

La impedancia es entonces el cociente complejo entre tensión y corriente, un número con módulo
e ángulo propios:

$$Z = \frac{v(t)}{i(t)} = \frac{V_{max}}{I_{max}}\,e^{\,j(\phi_v - \phi_i)}$$

donde el módulo $|Z| = V_{max}/I_{max}$ es la impedancia y el argumento $\phi_v - \phi_i$ es el
ángulo de fase. En forma cartesiana, $Z = R + j(X_L - X_C)$: la parte real es la resistencia y
la imaginaria la reactancia neta. Esta forma permite leer $R$, $X_L$ y $X_C$ directamente del
**diagrama de impedancias** (eje real $R$, eje imaginario reactancia).

> **Ejemplo.** Dados $v(t) = 200\sin(2000t + 50^\circ)$ e $i(t) = 4\cos(2000t + 13{,}2^\circ)$,
> se pasa la tensión a coseno con la identidad $\cos\theta = \sin(\theta + 90^\circ)$:
> $v(t) = 200\cos(2000t - 40^\circ)$. La impedancia resulta
> $$Z = \frac{200}{4}\,e^{\,j(-40^\circ - 13{,}2^\circ)} = 50\,e^{-j\,53{,}2^\circ}\ \Omega$$
> De ahí $R = |Z|\cos(53{,}2^\circ)$ y, como el ángulo es negativo (predomina lo capacitivo),
> $X_C = |Z|\sin(53{,}2^\circ)$, con lo que $C = 1/\big(\omega|Z|\sin(53{,}2^\circ)\big)$.

## Ejemplos resueltos

> **Ejemplo (RL serie).** Con $\Delta V_{max} = 50\text{ V}$, $\omega = 1000\text{ rad/s}$,
> $R = 300\ \Omega$ y $L = 0{,}9\text{ H}$ (sin capacitor, $X_C = 0$): la reactancia es
> $X_L = \omega L = 900\ \Omega$, la impedancia
> $Z = \sqrt{R^2 + X_L^2} = \sqrt{300^2 + 900^2} \approx 948{,}68\ \Omega$, la corriente
> $I_{max} = \Delta V_{max}/Z \approx 0{,}053\text{ A}$, las caídas
> $\Delta V_R = I_{max}R \approx 15{,}8\text{ V}$ y $\Delta V_L = I_{max}X_L \approx 47{,}4\text{ V}$,
> y el ángulo $\phi = \tan^{-1}(X_L/R) \approx 71{,}57^\circ$.

> **Ejemplo (RLC serie).** Con $X_L = 10\ \Omega$, $X_C = 25\ \Omega$, $R = 10\ \Omega$,
> $f = 60\text{ Hz}$ ($\omega = 120\pi$) y $\Delta V_{rms} = 100\text{ V}$: de las reactancias
> se despejan $L = X_L/\omega \approx 0{,}026\text{ H}$ y
> $C = 1/(X_C\,\omega) \approx 106{,}10\ \mu\text{F}$. La impedancia compleja es
> $Z = R + j(X_L - X_C) = 10 - j\,15\ \Omega$, con módulo
> $|Z| = \sqrt{10^2 + 15^2}$, de modo que
> $$I_{rms} = \frac{\Delta V_{rms}}{|Z|} = \frac{100}{\sqrt{10^2 + 15^2}} \approx 5{,}54\text{ A}$$
> Como todos comparten la misma corriente en serie, las caídas eficaces son
> $\Delta V_R = I_{rms}R$, $\Delta V_L = I_{rms}X_L$ y $\Delta V_C = I_{rms}X_C$.

---

## Ver también

- [[01-fundamentos-ca]] — fuente de CA, valores RMS y reactancias de $R$, $L$ y $C$
- [[03-potencia-resonancia-transformadores]] — potencia media, resonancia ($X_L = X_C$) y transformadores
- [[04-circuitos-dc/03-leyes-de-kirchhoff|leyes de Kirchhoff]] — análisis de mallas del que parte el planteo
