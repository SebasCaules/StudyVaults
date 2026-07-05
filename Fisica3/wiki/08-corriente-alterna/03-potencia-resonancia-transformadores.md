---
tags: [teoria, unidad-8, corriente-alterna, resonancia, factor-de-calidad, transformadores]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Potencia, resonancia y transformadores

Esta página cierra la unidad de corriente alterna con tres temas que se apoyan en el
[[02-rlc-serie|circuito RLC serie]]: cómo se calcula la potencia media que entrega la fuente,
qué ocurre en la frecuencia de resonancia donde el circuito se vuelve puramente resistivo, y
cómo un transformador cambia la tensión aprovechando la inducción electromagnética entre dos
bobinados.

## Potencia media en un circuito de CA

En CA la potencia instantánea oscila, pero lo que interesa es su promedio sobre un ciclo. La
potencia media entregada a un circuito RLC depende de los valores eficaces y del ángulo de
fase entre corriente y tensión:

> **Definición.** La **potencia promedio** entregada a un circuito RLC serie es
> $$P_{prom} = I_{rms}\,\Delta V_{rms}\,\cos\phi$$
> donde $I_{rms}$ es la corriente eficaz, $\Delta V_{rms}$ la tensión eficaz de la fuente y
> $\phi$ el ángulo de fase. El factor $\cos\phi$ se llama **factor de potencia**.

**Observación.** Solo la parte resistiva disipa potencia. Cuando el circuito es puramente
resistivo, $\phi = 0$ y $\cos\phi = 1$: se entrega la máxima potencia posible. Cuando es
puramente reactivo, $\phi = \pm 90^\circ$ y $\cos\phi = 0$: el inductor y el capacitor
intercambian energía con la fuente pero no la disipan.

### Triángulo de potencias

Los apuntes esbozan un **triángulo de potencias** que relaciona tres magnitudes: la potencia
aparente $S$ (hipotenusa), la potencia activa $P_A$ (cateto horizontal, la que se disipa) y la
potencia reactiva $P_r$ (cateto vertical, la que intercambian inductor y capacitor). El
teorema de Pitágoras sobre ese triángulo da

$$S^2 = P_A^2 + P_r^2$$

donde $S$ es la potencia aparente, $P_A$ la activa y $P_r$ la reactiva. La parte reactiva se
asocia a la reactancia neta mediante un término de la forma $(X_L - X_C)\,I^2$.

> **Nota.** En el original este triángulo aparece suelto, sin desarrollo del contexto, y la
> relación entre los catetos y $R\,I^2$ / $(X_L - X_C)\,I^2$ está *(dudosa en el original)*:
> se transcribe la identidad pitagórica $S^2 = P_A^2 + P_r^2$, que sí es legible, y se omite el
> resto para no adivinar.

## Resonancia en un circuito RLC serie

La corriente eficaz del circuito serie, escrita en función de las reactancias, es

$$I_{rms} = \frac{\Delta V_{rms}}{\sqrt{R^2 + (X_L - X_C)^2}}$$

Esta corriente es máxima cuando el denominador es mínimo, es decir cuando las reactancias se
cancelan: $X_L = X_C$. En esa condición la impedancia se reduce a $Z = R$ y el circuito se
comporta como puramente resistivo. Igualando $\omega L = 1/\omega C$ se despeja la frecuencia
a la que esto ocurre.

> **Definición.** La **frecuencia de resonancia** de un circuito RLC serie es
> $$\omega_0 = \frac{1}{\sqrt{LC}}$$
> donde $L$ es la inductancia y $C$ la capacitancia. A esta frecuencia $X_L = X_C$, la
> impedancia es mínima ($Z = R$) y la corriente alcanza su valor máximo.

La agudeza del pico de resonancia se cuantifica con el factor de calidad.

> **Definición.** El **factor de calidad** es
> $$Q = \frac{\omega_0}{\Delta\omega}, \qquad \Delta\omega = \frac{R}{L}$$
> donde $\omega_0$ es la frecuencia de resonancia y $\Delta\omega$ el ancho de banda. Un $Q$
> alto corresponde a un pico angosto y agudo (circuito muy selectivo); un $Q$ bajo, a un pico
> ancho y suave.

## Transformadores de CA

Un transformador acopla dos bobinados —**primario** de $N_1$ vueltas y **secundario** de
$N_2$ vueltas— sobre un núcleo común, de modo que el flujo magnético que atraviesa uno también
atraviesa el otro. Sirve para elevar o reducir la tensión alterna.

Aplicando la ley de inducción de Faraday a cada bobinado, con el mismo flujo $\Phi_B$
atravesándolos:

$$\Delta v_1 = -N_1\,\frac{d\Phi_B}{dt}, \qquad \Delta v_2 = -N_2\,\frac{d\Phi_B}{dt}$$

donde $\Delta v_1$ y $\Delta v_2$ son las tensiones en el primario y el secundario. Dividiendo
una ecuación por la otra se elimina $d\Phi_B/dt$ y queda la relación de transformación:

> **Proposición.** La tensión del secundario respecto de la del primario está en la misma
> proporción que sus números de espiras:
> $$\Delta v_2 = \frac{N_2}{N_1}\,\Delta v_1$$
> donde $N_1$ y $N_2$ son las cantidades de vueltas del primario y del secundario.

**Observación.** Si $N_2 > N_1$ el transformador **eleva** la tensión (secundario mayor que
primario); si $N_2 < N_1$ la **reduce**. La relación de espiras fija directamente la relación
de tensiones.

---

## Ver también

- [[02-rlc-serie]] — impedancia y ángulo de fase de los que dependen potencia y resonancia
- [[01-fundamentos-ca]] — reactancias $X_L$, $X_C$ y valores eficaces
- [[04-circuitos-dc/02-circuitos-de-corriente-directa]] — circuitos de continua, punto de partida
