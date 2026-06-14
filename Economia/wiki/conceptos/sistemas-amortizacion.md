---
tags: [unit-07, metodo]
aliases: [sistema francés, sistema alemán, método directo, devolución de préstamos, cuadro de amortización]
---

## Definición

**Sistemas de amortización:** formas alternativas de devolver un préstamo $P$ en $n$ cuotas a tasa $i$ del período. Toda cuota se descompone en **amortización de capital** ($A_t$) + **interés** ($I_t$). Lo que cambia entre sistemas es *cómo* se reparte capital e interés en el tiempo.

Las fuentes de la cátedra (slides VTD) cubren tres: **francés, alemán y directo**.

## Sistema Francés — cuota constante

$$\boxed{C = \frac{P\cdot i}{1-(1+i)^{-n}}}$$

**Donde:**
- $C$: cuota constante
- $P$: capital prestado
- $i$: tasa del período (efectiva, mismo período que la cuota)
- $n$: cantidad de cuotas

- Interés sobre **saldo**: $I_t = S_{t-1}\cdot i$; amortización creciente: $A_t = C - I_t$, con $A_{t+1} = A_t(1+i)$.
- **Saldo tras $t$ cuotas = VP de las cuotas que faltan:** $S_t = C\cdot\dfrac{1-(1+i)^{-(n-t)}}{i}$.
- Al inicio la cuota es casi todo interés; el capital se amortiza lento (curva cóncava) y el cruce 50/50 llega pasada la mitad del plazo.

## Sistema Alemán — amortización constante

$$A = \frac{P}{n} \qquad I_t = \left[P-(t-1)A\right] i \qquad C_t = A + I_t$$

- Interés sobre **saldo**, capital en partes iguales → **cuota decreciente** (aritméticamente, de a $A\cdot i$ por período).
- Saldo lineal: $S_t = P - tA$.

## Sistema Directo — interés sobre capital inicial

$$C = \frac{P}{n} + P\cdot i \quad \text{(constante)}$$

- El interés se calcula **siempre sobre el capital original**, aunque ya se haya devuelto parte. Capital en partes iguales.
- Es el "de tarjeta/casa de electrodomésticos": parece igual al alemán en su primera cuota, pero **nunca baja**.

> **Método americano** (mencionado en bibliografía, no en las slides): se pagan solo intereses período a período y el 100% del capital al vencimiento.

## Ejemplo de clase (común a los tres): $P = 450.000$, $n = 360$ meses, $i = 0{,}5\%$ mensual

(Precio \$500.000 con 10% de anticipo → se financian \$450.000.)

| | **Francés** | **Alemán** | **Directo** |
|---|---|---|---|
| Cuota 1 | 2.697,98 | 3.500,00 | 3.500,00 |
| Cuota 232 | 2.697,98 | 2.056,25 | 3.500,00 |
| Interés sobre | saldo | saldo | capital inicial |
| Saldo tras 60 meses | 418.745 | 375.000 | 375.000 |
| Pagado en 60 meses | 161.879 | 198.938 | 210.000 |
| → Capital devuelto | 31.255 | 75.000 | 75.000 |
| → Intereses pagados | 130.623 | 123.938 | 135.000 |

Lecturas:
- En el francés tras 5 años (1/6 del plazo) solo se devolvió el **7%** del capital.
- El alemán paga el capital más rápido → menos intereses nominales acumulados, a costa de cuotas iniciales más altas.
- El directo es **el más caro**: paga interés sobre plata ya devuelta.

## Intuición / Por qué importa

- **Francés y alemán son financieramente equivalentes a la tasa del préstamo**: el VP de sus cuotas descontadas a $i$ es exactamente $P$ en ambos. Elegir entre ellos es una cuestión de perfil de cuotas (liquidez), no de "cuál es más barato" — comparar sumas nominales de intereses ignora el [[valor-tiempo-dinero]].
- **El directo NO es equivalente**: su TIR es mayor que la tasa declarada (en el ejemplo, 0,5% declarado ≈ **0,72% mensual efectivo**). Tasa "directa" barata en el cartel = costo efectivo caro.
- Para el parcial: saber calcular **cuota, saldo en cualquier momento, y recomposición interés/capital** (guía ej. 4, 6 y 9).

## Errores comunes / Distinciones

- **Calcular el saldo francés restando amortizaciones "lineales":** el saldo es el VP de las cuotas restantes, no $P - t\cdot P/n$ (eso es el alemán).
- **Decir que el alemán "es más barato" por pagar menos intereses nominales:** a igual tasa, francés y alemán tienen el mismo costo financiero.
- **Tomar la tasa declarada del método directo como costo efectivo.**
- **No distinguir amortización financiera (devolución de capital) de [[conceptos/amortizacion-contable|amortización contable]]** (distribución del costo de un bien de uso, Unidad 6). Misma palabra, conceptos distintos.

## Relacionado con
- [[anualidades]] — la cuota francesa es $P/a_{n,i}$
- [[tasas-equivalentes]] — convertir la tasa al período de la cuota
- [[costo-financiero-total]] — costo real con comisiones
- [[conceptos/amortizacion-contable|amortizacion-contable]] — el falso amigo de la U6
- [[formulas/unidad-07]]
