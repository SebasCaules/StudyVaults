---
tags: [unit-05, finanzas]
aliases: [bonos, renta fija, ON, TIR, valuación de bonos]
---

## Definición

**Bono / instrumento de renta fija:** título de **deuda** con un flujo de pagos **prefijado** (cupones + amortización del capital). El emisor se compromete contractualmente a pagar.

**Tipos según emisor:**
- **Títulos públicos:** emite el gobierno (nacional, provincial, BC).
- **Obligaciones Negociables (ON):** emiten empresas privadas.

**Mercados:**
- **Primario:** emisión inicial (subasta, licitación).
- **Secundario:** compraventa entre privados — donde se forma el **precio**.

## Fórmula — Valuación

$$P^B = \frac{CF_1}{1+i} + \frac{CF_2}{(1+i)^2} + \cdots + \frac{CF_N}{(1+i)^N} = \sum_{t=1}^{N} \frac{CF_t}{(1+i)^t}$$

Donde:
- $P^B$: precio del bono (valor presente de los flujos)
- $CF_t$: cashflow contractual del período $t$ (cupón + amortización)
- $i$: tasa de descuento (costo de oportunidad)
- $N$: cantidad de períodos hasta el vencimiento

## TIR (Tasa Interna de Retorno)

La **TIR** es la tasa $i$ que iguala el precio de mercado al valor presente de los flujos. Refleja el **rendimiento esperado** del bono al precio actual.

$$P_{mercado} = \sum_{t=1}^{N} \frac{CF_t}{(1+TIR)^t}$$

Donde:
- $P_{mercado}$: precio observado del bono en el secundario
- $TIR$: tasa interna de retorno (rendimiento al precio actual)

## Relación precio - TIR - cupón

| Precio | TIR vs cupón | Cotiza |
|---|---|---|
| $P = 100$ (par) | TIR = cupón | a la par |
| $P < 100$ | TIR > cupón | bajo la par (el mercado exige más rendimiento) |
| $P > 100$ | TIR < cupón | sobre la par |

## Estructura de riesgo

$$TIR = r_{libre} + \text{prima de riesgo}$$

Donde:
- $r_{libre}$: tasa libre de riesgo (referencia, típicamente T-bill/T-bond USA)
- prima de riesgo: spread por riesgo de default, liquidez, plazo, tratamiento impositivo

- **Tasa libre de riesgo:** suele ser el T-bill/T-bond de EE.UU.
- **Prima de riesgo:** depende del rating crediticio, plazo, liquidez, tratamiento impositivo.

## Intuición / Por qué importa

- La **relación precio-TIR es inversa**: cuando el precio cae, la TIR sube (y viceversa). Es la lógica del descuento de flujos.
- Permite comparar bonos heterogéneos: la TIR es el **rendimiento anualizado equivalente**.
- En macro: el spread (TIR - tasa libre) refleja la **prima de riesgo soberano** (riesgo país).

## Ejemplo

Bono cupón 8%, $N = 2$ años, valor nominal 100. Si el mercado descuenta a $i = 10\%$:

$$P = \frac{8}{1,1} + \frac{108}{1,1^2} = 7,27 + 89,26 = 96,53$$

Cotiza **bajo la par** porque la TIR (10%) > cupón (8%).

## Errores comunes / Distinciones

- **No confundir cupón con TIR.** El cupón es contractual y fijo; la TIR depende del precio de mercado.
- **Si compras un bono "a la par" tu rendimiento será el cupón.** Si compras "bajo la par", obtenes TIR > cupón.
- **El precio puede ser muy volátil** aunque los cashflows sean fijos — porque la tasa de descuento varía con el riesgo y la política monetaria.


## Gráfico

![[bonos-par-bajo-sobre.svg]]
## Relacionado con
- [[tasa-interes]]
- [[rating-crediticio]]
- [[acciones-renta-variable]]
- [[sistema-financiero]]
- [[deuda-publica]]
