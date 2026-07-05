---
tags: [teoria, unidad-3, resonancia, potencia-media, ancho-de-banda, factor-de-calidad]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Resonancia y ancho de banda

La **resonancia** es la respuesta amplificada del [[01-oscilaciones-forzadas|oscilador
forzado]] cuando la frecuencia de forzado $\omega$ se acerca a la frecuencia natural del
sistema. Conviene distinguir **dos** frecuencias de resonancia según lo que se maximice: la
amplitud de la oscilación o la potencia media absorbida. No coinciden.

## Resonancia de amplitud

La amplitud estacionaria $A_{est}(\omega)$ crece a medida que $\omega$ se acerca a $\omega_0$
y luego decae. Su máximo se obtiene anulando la derivada respecto de $\omega$:

$$\frac{\partial A_{est}}{\partial \omega}(\omega_{AA}) = 0
\;\Longrightarrow\; \omega_{AA} = \sqrt{\omega_0^2 - 2\gamma^2}$$

donde $\omega_{AA}$ es la **frecuencia de resonancia de amplitud**, $\omega_0$ la frecuencia
natural y $\gamma$ la constante de amortiguamiento. Notar que $\omega_{AA} < \omega_0$: el pico
de amplitud está **corrido** hacia frecuencias menores, y el corrimiento crece con el
amortiguamiento. Si $\gamma$ es demasiado grande ($2\gamma^2 > \omega_0^2$) no hay pico.

Evaluando $A_{est}$ en esa frecuencia se obtiene la **amplitud máxima**:

$$A_{max} = A_{est}(\omega_{AA}) = \frac{F_0}{b\,\omega'} = \frac{F_0}{2m\gamma\sqrt{\omega_0^2 - \gamma^2}}$$

donde $F_0$ es la amplitud de la fuerza, $b = 2m\gamma$ el coeficiente de fricción y
$\omega' = \sqrt{\omega_0^2 - \gamma^2}$ la frecuencia del [[02-amortiguadas/01-regimenes-de-amortiguamiento|oscilador
amortiguado]]. Cuanto menor es la fricción, mayor y más agudo es el pico.

> **Nota.** En el apunte original la forma intermedia de $A_{max}$ aparece escrita con
> $\sqrt{\omega_0^2 - 2\gamma^2}$ en el denominador (reusando la expresión de $\omega_{AA}$).
> La sustitución correcta de $\omega_{AA}$ en $A_{est}$ da $\sqrt{\omega_0^2 - \gamma^2}$, que es
> consistente con la forma final $F_0/(b\,\omega')$ que el mismo apunte anota al lado.

Como referencia, la amplitud a frecuencia nula (respuesta **estática**, cuando la fuerza
prácticamente no varía) es

$$A_0 = A_{est}(0) = \frac{F_0}{m\,\omega_0^2} = \frac{F_0}{k}$$

que es simplemente el estiramiento del resorte bajo una fuerza constante $F_0$.

## Potencia media

La cantidad físicamente relevante para caracterizar la resonancia es la **potencia media**
$\langle P \rangle$ que la fuerza entrega al oscilador (promediada sobre un ciclo). En función
de la frecuencia de forzado:

$$\langle P(t) \rangle = \frac{F_0^2}{4m\gamma}\,
\frac{(2\gamma\omega)^2}{(\omega_0^2 - \omega^2)^2 + (2\gamma\omega)^2}$$

donde $F_0$ es la amplitud de la fuerza, $m$ la masa, $\gamma$ la constante de amortiguamiento,
$\omega_0$ la frecuencia natural y $\omega$ la de forzado. En régimen estacionario esta
potencia entregada iguala en promedio a la disipada por la fricción, de modo que la amplitud
se mantiene constante.

## Resonancia de potencia

El máximo de la potencia media se busca de nuevo anulando la derivada:

$$\frac{\partial \langle P \rangle}{\partial \omega}(\omega_{RP}) = 0
\;\Longrightarrow\; \omega_{RP} = \omega_0$$

donde $\omega_{RP}$ es la **frecuencia de resonancia de potencia**. A diferencia de la
resonancia de amplitud, la de potencia ocurre **exactamente** en la frecuencia natural
$\omega_0$, sin corrimiento por el amortiguamiento. El valor máximo es

$$\langle P \rangle_{max} = \langle P \rangle(\omega_0) = \frac{F_0^2}{4m\gamma}$$

> **Observación.** Las dos resonancias no coinciden: la de **amplitud** está en
> $\omega_{AA} = \sqrt{\omega_0^2 - 2\gamma^2}$ (corrida) y la de **potencia** en
> $\omega_{RP} = \omega_0$ (sin corrimiento). Solo en el límite de amortiguamiento débil
> ($\gamma \to 0$) ambas tienden a $\omega_0$.

## Ancho de banda y factor de calidad

El **ancho de banda** $\Delta\omega$ mide qué tan aguda es la curva de resonancia de potencia:
es el rango de frecuencias en torno a $\omega_0$ dentro del cual la potencia media supera la
mitad de su máximo. Vale

$$\Delta\omega = \frac{\omega_0}{Q} = 2\gamma$$

donde $Q = \dfrac{\omega_0}{2\gamma}$ es el **factor de calidad** del oscilador. La relación
$\Delta\omega = \omega_0/Q$ es directa: un $Q$ alto (poca fricción) da una curva de resonancia
**angosta y aguda**, mientras que un $Q$ bajo (mucha fricción) la ensancha y aplana. El factor
de calidad enlaza así la resonancia con el decaimiento del [[02-amortiguadas/02-energia-y-factor-q|oscilador
amortiguado]], donde $Q$ mide cuántos ciclos "dura" la energía del sistema.

---

## Ver también

- [[01-oscilaciones-forzadas]] — planteo del oscilador forzado, amplitud y desfase estacionarios
- [[02-amortiguadas/02-energia-y-factor-q]] — factor de calidad $Q$, frecuencia $\omega'$ y energía disipada
- [[01-mas/01-oscilador-armonico|Movimiento armónico simple]] — la frecuencia natural $\omega_0$
