---
tags: [unit-08, metodo]
aliases: [TIR, tasa interna de retorno, IRR]
---

## Definición

**Tasa Interna de Retorno (TIR):** la tasa de descuento que hace que el [[van]] del proyecto sea **cero** (es decir, $P = I$: el valor presente de los flujos iguala a la inversión). Es la medida **porcentual** de todo lo que el proyecto produce por encima de la inversión inicial, expresado como tasa de interés por período.

## Fórmula (definición implícita)

$$\boxed{\sum_{j=0}^{n} \frac{FC_j}{(1+TIR)^j} = 0}$$

**Donde:**
- $FC_j$: flujo de caja neto del período $j$
- $TIR$: incógnita — se despeja por tanteo, interpolación o Excel (`=TIR(rango)`)
- $n$: cantidad de períodos

No tiene solución algebraica en general (polinomio de grado $n$): con un período se despeja directo; con más, se tantea.

**Ejemplo de un período:** $-10.000$ hoy, $+12.000$ en un año: $12.000/(1+i) = 10.000 \Rightarrow i = TIR = 20\%$.

**Ejemplo de dos períodos:** $-22.000; +10.000; +20.000$: $-22.000 + \frac{10.000}{1+x} + \frac{20.000}{(1+x)^2} = 0 \Rightarrow TIR = 20{,}74\%$ (por tanteo o Excel).

## Criterio de decisión

| Comparación | Decisión |
|---|---|
| $TIR > $ costo del capital ([[trema]]) | **Aceptar** |
| $TIR = TREMA$ | Indiferente |
| $TIR < TREMA$ | **Rechazar** |

El costo del capital es lo que el inversor sacrifica de ganar en su mejor alternativa: la TREMA.

## Interpretación: el proyecto como préstamo

A la TIR, el proyecto devuelve exactamente la inversión más intereses sobre el **saldo invertido**, sin que sobre nada. Verificación con el ejemplo ($TIR = 20{,}74\%$):

| Año | Saldo invertido | Cuota (flujo) | Interés (20,74%) | Amortización | Remanente |
|---|---|---|---|---|---|
| 1 | $-22.000$ | $10.000$ | $4.564$ | $5.436$ | $-16.564$ |
| 2 | $-16.564$ | $20.000$ | $3.436$ | $16.564$ | $0$ |

Valor presente del remanente $= \$0$ → eso *es* $VAN = 0$ a la TIR.

## Propiedades (contraste con el VAN)

- Es **propia de la inversión**: no depende de quién evalúa (el inversionista no "sesga" el resultado). El VAN sí cambia con cada inversionista.
- Mide en **% por período**, no en pesos absolutos.
- Supone que los flujos intermedios se **reinvierten a la propia TIR** — hipótesis poco realista cuando la TIR es alta (el VAN supone reinversión a la TREMA, más razonable).

## Defectos del criterio

| Defecto | Consecuencia | Solución |
|---|---|---|
| Hipótesis de reinversión a la TIR | Sobreestima proyectos que recuperan pronto | Decidir por VAN |
| Ignora la **escala** (es un %) | Puede preferir un proyecto chico de TIR alta a uno grande que genera más riqueza | Decidir por VAN |
| Flujos con más de un cambio de signo | [[tir-multiple|TIR múltiples]] — ninguna interpretable | VAN o TER |
| Conflicto de ranking en [[proyectos-mutuamente-excluyentes|mutuamente excluyentes]] | TIR y VAN ordenan distinto a la izquierda de la tasa de Fisher | **Manda el VAN** |

En proyectos **independientes y convencionales** no hay problema: $TIR > TREMA \iff VAN > 0$, los dos criterios siempre coinciden en aceptar/rechazar.

## Errores comunes / Distinciones

- **Elegir entre excluyentes "porque tiene más TIR".** El ejemplo del PDF: B con TIR 20% pierde contra A con TIR 18% pero VAN mayor.
- **Comparar la TIR contra cualquier tasa.** La vara correcta es la TREMA del inversor, ajustada por riesgo.
- **Anualizar mal:** la TIR queda expresada en la periodicidad de los flujos (mensual si los flujos son mensuales) — convertir con [[tasas-equivalentes]].
- Es el mismo concepto que la TIR de un bono ([[bonos-renta-fija]]): la tasa que iguala precio y VP de cupones.

## Relacionado con
- [[van]]
- [[trema]]
- [[tir-multiple]]
- [[proyectos-mutuamente-excluyentes]]
- [[flujo-de-fondos-proyecto]]
- [[bonos-renta-fija]]
