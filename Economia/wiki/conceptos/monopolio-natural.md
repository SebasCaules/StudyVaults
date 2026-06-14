---
tags: [unit-04, micro]
---

## Definición

**Monopolio natural:** estructura de mercado donde la tecnología tiene **economías de escala persistentes** — el costo medio ($CMe$) de producción **decrece** en todo el rango relevante de demanda. Como consecuencia, **una sola firma produce a costo total menor** que dos o más firmas combinadas.

## Fórmula / Característica

En todo el rango relevante:
$$CMg(Q) < CMe(Q), \quad \frac{dCMe}{dQ} < 0$$

Donde:
- $CMg(Q)$: costo marginal en función de la cantidad
- $CMe(Q)$: costo medio ($CT/Q$)
- $Q$: cantidad producida

El $CMe$ siempre cae al aumentar $Q$, lo que implica $CMg$ siempre por debajo de $CMe$.

## Intuición / Por qué importa

Es típico de **industrias con altos costos fijos y bajos costos marginales**: redes de distribución (electricidad, gas, agua, telefonía fija histórica, ferrocarriles, internet por cable), donde duplicar la infraestructura sería un derroche social.

**El dilema regulatorio:** dejar al monopolista libre genera DWL. Pero **regular el precio plantea trade-offs**:

| Regulación | Efecto |
|---|---|
| $P = CMg$ (eficiencia económica) | Como $CMg < CMe$, la firma **opera a pérdida y quiebra** sin subsidio |
| $P = CMe$ (cubrir costos) | Firma rentable ($\pi = 0$), pero $P > CMg$ → **persiste DWL** |
| Monopolio + impuesto suma fija | Captura renta, no distorsiona decisión marginal |
| Subsidio para que $P = CMg$ | Eficiente, pero subsidio implica recaudar tributos con su propio DWL |

**No hay solución limpia** — toda regulación tiene costos.

## Ejemplo

Distribución de gas natural en una ciudad: tender la red cuesta una fortuna ($CF$ enorme), pero pasar gas a una casa adicional cuesta casi nada ($CMg$ bajísimo). Tener dos redes paralelas duplicaría el $CF$ sin beneficio.

Datos típicos: $CT(Q) = 1000 + 2Q$. Entonces $CMg = 2$, $CMe = 1000/Q + 2$ — siempre decrece.

## Errores comunes / Distinciones

- **Aplicar $P = CMg$ a un monopolio natural sin pensar.** Lo lleva a la quiebra (pierde $CMe - CMg$ por unidad).
- **Confundir monopolio natural con monopolio "creado".** El natural surge de la tecnología; el creado, de barreras legales o estratégicas.
- **Olvidar que la regulación más realista es $P = CMe$:** preserva la firma viable aunque genera ineficiencia residual.


## Gráfico

![[monopolio-equilibrio.svg]]
## Relacionado con
- [[monopolio]]
- [[barreras-entrada]]
- [[regulacion-monopolio]]
- [[deadweight-loss]]
