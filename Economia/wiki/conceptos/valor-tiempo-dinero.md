---
tags: [unit-07, definicion]
aliases: [VTD, valor del dinero en el tiempo, matemática financiera, time value of money]
---

## Definición

**Valor tiempo del dinero (VTD):** $1 millón hoy vale **más** que $1 millón dentro de un año. Ese "algo" de diferencia es el valor del dinero en el tiempo, y se mide con la **tasa de interés**.

**Razones (las 4 de la cátedra):**
1. **Inflación** — los pesos futuros compran menos.
2. **Preferencias temporales de consumo** — preferimos consumir hoy.
3. **Incertidumbre del futuro** — un pago prometido puede no ocurrir.
4. **[[costo-de-oportunidad]] de utilizarlo** — el dinero disponible hoy puede invertirse y rendir.

## El concepto de equivalencia

1 peso de hoy es **equivalente (no igual)** a $1+x$ pesos dentro de un período. La **tasa de interés** sintetiza esa equivalencia: es el porcentaje mínimo al cual se decide invertir, y el **interés** es la retribución por el uso de un capital durante un tiempo.

$$1 \text{ hoy} \equiv (1+i) \text{ en } t=1 \equiv (1+i)^2 \text{ en } t=2$$

Con $i = 10\%$: $1.000$ hoy $\equiv 1.100$ en un período $\equiv 1.210$ en dos. Bajo interés compuesto esta equivalencia es **perfecta**: vale entre cualquier par de fechas (también $1.100$ en $t=1$ $\equiv$ $1.210$ en $t=2$).

## Fórmula

Toda la unidad deriva de una sola ecuación (interés compuesto):

$$F = P\,(1+i)^n$$

**Donde:**
- $F$: valor futuro (monto)
- $P$: valor presente (capital)
- $i$: tasa de interés del período
- $n$: cantidad de períodos

De ahí salen los cuatro despejes ($F$, $P$, $i$, $n$), las [[anualidades]], las [[perpetuidades]] y los [[sistemas-amortizacion]]. Ver [[formulas/unidad-07]].

## Ejemplo

¿Cuánto pagar hoy por recibir $300 dentro de un año, si la mejor alternativa rinde 2%? (slides, "Paul Shorter")

$$VP = \frac{300}{1{,}02} = 294{,}12$$

Pagar más de $294,12 es aceptar un rendimiento menor al costo de oportunidad; pagar menos es ganarle.

## Intuición / Por qué importa

- Es **la regla de oro de las finanzas**: no se pueden sumar ni comparar montos de fechas distintas sin llevarlos antes al mismo momento ([[capitalizacion-actualizacion]]).
- Es el fundamento de la valuación de [[bonos-renta-fija]], [[acciones-renta-variable]] y del [[conceptos/van|VAN]] de proyectos (Unidad 8): todo activo vale el VP de sus flujos futuros.
- En el parcial aparece como **comparación de alternativas** (comprar vs alquilar, contado vs financiado): se elige la de mayor valor en un mismo instante (típicamente $t=0$).

## Errores comunes / Distinciones

- **Sumar plata de fechas distintas "porque son los mismos pesos".** $5.000 de cuotas no son comparables con $5.000 hoy.
- **Confundir equivalente con igual.** La equivalencia depende de la tasa: si cambia $i$, cambia qué monto futuro equivale a 100 de hoy.
- **Olvidar que los costos ya incurridos no entran** en la comparación hacia adelante: son [[conceptos/costo-hundido|costo hundido]] (pregunta típica de parcial).

## Relacionado con
- [[tasa-interes]] — el precio del tiempo
- [[capitalizacion-actualizacion]]
- [[tasas-equivalentes]]
- [[anualidades]], [[perpetuidades]]
- [[conceptos/van|van]] — su aplicación en la Unidad 8
