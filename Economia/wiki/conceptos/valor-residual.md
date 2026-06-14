---
tags: [unit-08, definicion]
aliases: [valor terminal, valor de rescate, flujo terminal, venta de activos fijos]
---

## Definición

**Valor terminal (o residual) del proyecto:** al término del horizonte de planificación se hace un **corte artificial de tiempo** con fines de evaluación: se supone que la planta deja de operar y **vende todos sus activos** (aunque en la realidad probablemente siga operando). Ese supuesto produce un **flujo de efectivo extra en el último año**: el valor de mercado de los activos, neto del impuesto sobre la utilidad de la venta, más el recupero del capital de trabajo.

## Fórmula: impuesto sobre la venta de activos

El IG grava la **utilidad contable de la venta** = valor de mercado − valor de libro:

$$\boxed{FF_{venta} = P_{venta} - t \cdot (P_{venta} - VL)}$$

$$VL = VO - Am_{acumuladas}$$

**Donde:**
- $FF_{venta}$: flujo de caja neto por la venta del activo
- $P_{venta}$: precio de venta (valor de mercado / comercial)
- $t$: alícuota del impuesto a las ganancias
- $VL$: valor de libro (contable) al momento de la venta
- $VO$: valor de origen del activo
- $Am_{acumuladas}$: amortizaciones acumuladas hasta la venta

## Casuística

| Caso | Efecto fiscal | Flujo neto |
|---|---|---|
| $P_{venta} > VL$ | **Ganancia de capital** gravada (es un ingreso) | $P - t(P - VL)$ |
| $P_{venta} = VL$ | Neutro: no hay utilidad ni pérdida | $P$ |
| $P_{venta} < VL$ | **Pérdida de capital** deducible (es un egreso contable → ahorro de IG) | $P + t(VL - P)$ |

## Ejemplos

**Caso de parcial (parque solar, 11-Nov-2025):** equipos vendidos al final del año 15 por \$300, totalmente amortizados ($VL = 0$), $t = 30\%$ → utilidad de venta $= 300$; impuesto $= 90$; **flujo neto $= 210$**. Error clásico: anotar $+300$ y olvidar el impuesto.

**Ejemplo integral del PDF:** máquina de \$200.000 amortizada linealmente en 5 años ($VL = 0$ al final), vendida en \$25.000 → utilidad extraordinaria de \$25.000 que se suma al resultado del año 5: el IG pasa de \$30.000 a \$37.500. La caja recibe los \$25.000 y paga el impuesto extra.

## Componentes del flujo terminal completo

1. **Venta de activos fijos**, neta del impuesto sobre su utilidad (fórmula de arriba).
2. **Recupero del [[capital-de-trabajo-en-proyectos|capital de trabajo]]:** el stock de caja, créditos e inventarios inmovilizados vuelven como ingreso al cierre. Si no se recupera íntegramente (inventarios obsoletos, créditos incobrables), la diferencia genera una **pérdida** (deducible).

## Distinción: tres "valores" que no hay que mezclar

| Concepto | Qué es | Para qué sirve |
|---|---|---|
| **Valor residual contable** | Valor que se asume al fin de la vida útil para calcular la cuota de [[amortizacion-contable]]: $Am = (VO - VR)/n$ | Solo contable. "Amortización sin valor residual" → cuota $= VO/n$ y $VL$ llega a 0 |
| **Valor de libro ($VL$)** | $VO$ − amortizaciones acumuladas | Calcular la utilidad gravada de la venta |
| **Valor de mercado / comercial** | Lo que efectivamente se cobra por el activo | Es la caja que entra al flujo |

La caja entra por el valor de **mercado**; el valor de **libro** solo determina cuánto impuesto se paga por esa venta.

## Errores comunes / Distinciones

- **Olvidar el impuesto sobre la venta final** cuando el activo está totalmente amortizado: ahí *toda* la venta es utilidad gravada.
- **Usar el valor de libro como flujo de caja.** El VL no es plata.
- **Olvidar el recupero del capital de trabajo** en el último año.
- **No registrar el ahorro fiscal cuando se vende bajo el valor de libro** (pérdida deducible).
- Si el plazo de amortización contable cambia, puede cambiar el $VL$ al momento de la venta y con él el impuesto — verificar antes de responder preguntas de sensibilidad ([[escudo-fiscal]]).

## Relacionado con
- [[flujo-de-fondos-proyecto]]
- [[amortizacion-contable]]
- [[escudo-fiscal]]
- [[capital-de-trabajo-en-proyectos]]
- [[van]]
