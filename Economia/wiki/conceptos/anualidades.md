---
tags: [unit-07, formula]
aliases: [anualidad, renta, cuotas constantes, annuity, anualidad vencida, anualidad adelantada]
---

## Definición

**Anualidad:** activo (o deuda) que paga una **suma fija $C$ cada período durante un número dado de períodos $n$**. Pese al nombre, el período puede ser mes, trimestre, etc. Es el formato de cuotas de préstamos, alquileres, planes de ahorro.

- **Vencida (ordinaria):** pagos al **final** de cada período. Es el caso por defecto.
- **Adelantada (annuity due):** pagos al **inicio** de cada período (equivale a correr todo un período hacia hoy).

## Fórmula

**Valor actual (vencida):**

$$\boxed{VA = C \cdot \frac{1-(1+i)^{-n}}{i} = C \cdot \underbrace{\frac{(1+i)^n - 1}{(1+i)^n \cdot i}}_{\text{FACTOR } a_{n,i}}}$$

**Donde:**
- $VA$: valor actual, ubicado **un período antes del primer pago**
- $C$: cuota constante por período
- $i$: tasa efectiva del mismo período que las cuotas
- $n$: cantidad de cuotas

**Valor futuro (vencida), en el momento del último pago:**

$$VF = C \cdot \frac{(1+i)^n - 1}{i}$$

**Adelantadas:** multiplicar por $(1+i)$:

$$VA_{adel} = VA_{venc}(1+i) \qquad VF_{adel} = VF_{venc}(1+i)$$

**Derivación elegante (slides):** anualidad de 1 a $n$ = [[perpetuidades|perpetuidad]] que arranca en 1 menos perpetuidad que arranca en $n+1$:

$$VA = \frac{C}{i} - \frac{C}{i}\cdot\frac{1}{(1+i)^n}$$

## Ejemplos

1. **VF de ahorro** (slides, Fran Abrams): \$1.000 al final de cada año por 5 años al 7% → $VF = 1.000 \cdot \frac{1{,}07^5-1}{0{,}07} = 5.750{,}74$. Si fueran al inicio (adelantada): $\times 1{,}07 = 6.153{,}29$.
2. **VA de un flujo** (slides, Braden): \$700/año, 5 años, 4% → $VA = 700 \cdot \frac{1-1{,}04^{-5}}{0{,}04} = 3.116{,}28$: es lo máximo a pagar por ese activo.
3. **Cuota de un préstamo** ([[sistemas-amortizacion|sistema francés]]): $C = P / a_{n,i}$. Préstamo \$450.000 a 360 meses al 0,5%: $C = 450.000/166{,}79 = 2.697{,}98$.
4. **Parcial (pádel, 11-Nov-2025):** VP de 12 meses de alquiler de \$17.500/mes con TEM 2,96%: $VA = 17.500 \cdot a_{12;\,0{,}0296} = 17.500 \times 9{,}979 \approx 174.600 >$ \$150.000 de la paleta → comprar.

## Intuición / Por qué importa

- Convierte $n$ cuotas en **un solo número comparable** con un precio de contado: es la herramienta de toda decisión "contado vs financiado" / "alquilar vs comprar".
- El **saldo de un préstamo francés** en cualquier momento es el VA de las cuotas que faltan — con la misma fórmula.
- La adelantada **siempre vale más** que la vencida idéntica: cada pago capitaliza/descuenta un período más.

## Errores comunes / Distinciones

- **Ubicación del VA:** la fórmula da el valor **un período antes del primer pago** (FAQ de la cátedra). Si la anualidad arranca en $t=11$, el VA queda en $t=10$ y hay que dividir por $(1+i)^{10}$ para llevarlo a 0.
- **Tasa y cuota en períodos distintos** (cuotas mensuales con TEA): convertir primero con [[tasas-equivalentes]].
- **Confundir vencida con adelantada:** leer si el pago es a inicio o fin del período (en Excel, `Tipo` 0/1).
- **Usarla con cuotas no constantes:** si hay refuerzos o escalones, descomponer en anualidad + pagos sueltos (guía ej. 5 y 10).

## Relacionado con
- [[perpetuidades]] — el caso $n \to \infty$
- [[sistemas-amortizacion]] — francés usa $a_{n,i}$
- [[capitalizacion-actualizacion]]
- [[formulas/unidad-07]]
