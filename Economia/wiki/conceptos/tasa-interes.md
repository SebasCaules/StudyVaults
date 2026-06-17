---
tags: [unit-05, unit-07, finanzas]
aliases: [tasa de interés, i, TNA, TEA, tasa activa, tasa pasiva, spread]
---

## Definición

**Tasa de interés ($i$):** rendimiento exigido por postergar el consumo. Es el **precio del dinero en el tiempo** y refleja:

1. **Valor tiempo del dinero:** un peso hoy vale más que un peso mañana.
2. **Costo de oportunidad** de prestar (en lugar de invertir o consumir).
3. **Compensación por riesgo** e inflación esperada.

## Interés simple vs compuesto

### Simple (lineal, sin reinversión)

$$VF = VP \cdot (1 + i \cdot n)$$

Donde:
- $VF$: valor futuro
- $VP$: valor presente (capital inicial)
- $i$: tasa de interés por período
- $n$: cantidad de períodos

La **TNA** (tasa nominal anual) es típicamente una tasa simple.

### Compuesto (capitaliza)

$$VF = VP \cdot (1 + i)^n$$

La **TEA** (tasa efectiva anual) es la tasa que efectivamente se obtiene capitalizando.

**Conversión TNA a TEA con $m$ subperíodos:**

$$TEA = \left(1 + \frac{TNA}{m}\right)^m - 1$$

Donde:
- $TEA$: tasa efectiva anual (con capitalización)
- $TNA$: tasa nominal anual
- $m$: número de subperíodos de capitalización en el año

## Intuición / Por qué importa

- En macro, la tasa de interés conecta el **mercado de dinero** con la **demanda agregada** (afecta inversión y consumo durable).
- Permite **comparar flujos** en distintos momentos del tiempo (descontar a valor presente).
- En el LP, **pequeñas diferencias de tasa generan grandes diferencias de capital** (ejemplo de la clase: a 50 años, 1,5% vs 2% → 28% más rico).

## Ejemplo

VP = \$100, $i = 5\%$ anual, $n = 10$ años.
- Simple: $VF = 100 \cdot (1 + 0,05 \cdot 10) = 150$.
- Compuesto: $VF = 100 \cdot 1,05^{10} = 162,89$.

Diferencia: \$12,89 — la "magia" del interés compuesto.

## Profundización U7 — Componentes de la tasa de interés

En la Unidad 7 (Cálculo Financiero) la cátedra descompone la tasa nominal **multiplicativamente**:

$$i = (1+i_f)(1+i_r)(1+i_\theta) - 1$$

Donde:
- $i_f$: componente inflación (esperada; en Argentina, CER o IPIM)
- $i_r$: componente real (≈3–4% mundial; depende de liquidez, tamaño de la economía, capacidad de ahorro, variabilidad de la inflación)
- $i_\theta$: componente riesgo — **riesgo país** (spread entre un bono argentino y uno de la FED en NY) + **riesgo sector**

La descomposición es multiplicativa, no aditiva: con tasas altas, $i \neq i_f + i_r + i_\theta$.

## Profundización U7 — Tasas bancarias

- **Tasa activa ($i_a$):** la que el banco **cobra** por los préstamos. Debe cubrir: costo de captación (tasa pasiva), incobrabilidad, gastos administrativos, costo de oportunidad del encaje, impuestos y beneficio.
- **Tasa pasiva ($i_p$):** la que el banco **paga** por los depósitos que capta.
- **Spread:** $\text{spread} = i_a - i_p$ — rentabilidad bruta de la intermediación. Entre bancos, las operaciones se llaman *call money* (activa para el que presta, pasiva para el que toma).

## Errores comunes / Distinciones

- **TNA ≠ TEA.** La TNA es engañosa si se capitaliza más de una vez al año.
- **Tasa nominal ≠ tasa real.** La nominal incluye inflación; hay que descontarla con la fórmula exacta de Fisher.
- **El interés compuesto es la regla en macro.** Crecimiento del PBI, inflación, deuda — todo capitaliza.
- **Si la TNA capitaliza en subperíodos, la tasa que se aplica es la proporcional $TNA/k$** y la efectiva anual surge de capitalizarla — el detalle operativo completo está en [[tasas-equivalentes]] (U7).

## Relacionado con
- [[tasa-interes-real]]
- [[tasas-equivalentes]] — conversión TNA/TEA/TEM en detalle (U7)
- [[valor-tiempo-dinero]] — por qué existe la tasa (U7)
- [[bonos-renta-fija]]
- [[mercado-dinero]]
- [[demanda-dinero]]
- [[politica-monetaria-expansiva-contractiva]]
- [[formulas/unidad-07]]
