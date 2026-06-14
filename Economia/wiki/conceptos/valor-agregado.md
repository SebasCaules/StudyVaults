---
tags: [unit-05, macro]
aliases: [VAB, valor agregado bruto, método sectorial]
---

## Definición

**Valor agregado** de un sector: diferencia entre el **valor de su producción** (output) y el **valor de los insumos intermedios** que utilizó. Sumando los valores agregados de todos los sectores se obtiene el PBI por el método del valor agregado.

## Fórmula

$$VAB_{sector} = \text{Producción bruta} - \text{Consumo intermedio}$$

Donde:
- $VAB_{sector}$: valor agregado bruto del sector
- Producción bruta: valor total del output del sector
- Consumo intermedio: valor de los insumos utilizados

$$PBI = \sum_{sectores} VAB + \text{Derechos de importación} + \text{Impuestos netos sobre productos}$$

Donde:
- $PBI$: producto bruto interno
- $\sum_{sectores} VAB$: suma del valor agregado de todos los sectores

## Intuición / Por qué importa

Permite calcular el PBI **evitando la doble contabilización** de bienes intermedios. Si sumáramos la producción bruta de cada sector contaríamos el trigo cuando lo vende el productor agropecuario, otra vez cuando el molinero vende harina, otra vez cuando el panadero vende pan. El valor agregado mide solo lo que **cada eslabón añadió**.

## Ejemplo

Cadena trigo → harina → pan:
- Productor agropecuario vende trigo a $100. VAB = 100 (suponiendo cero insumos).
- Molinero compra trigo a 100, vende harina a 180. VAB = 80.
- Panadero compra harina a 180, vende pan a 300. VAB = 120.
- **PBI por valor agregado = 100 + 80 + 120 = 300** ✓ (igual al precio del bien final).

## Errores comunes / Distinciones

- **No es lo mismo que la facturación bruta** del sector. La construcción puede facturar $1000$ pero si compró $700$ en insumos su VAB es $300$.
- **El método del valor agregado es equivalente al del gasto y al del ingreso.** Las tres cuentas dan el mismo PBI por construcción contable.

## Relacionado con
- [[pbi]]
- [[identidad-sectorial]]
