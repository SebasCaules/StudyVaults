---
tags: [unit-05, finanzas]
aliases: [acciones, renta variable, equity, dividendo]
---

## Definición

**Acción / instrumento de renta variable:** título que representa una **participación directa en el capital** de una empresa. El tenedor se vuelve **socio** y tiene derecho a:

- **Dividendos** (cuando la empresa decide distribuirlos).
- **Apreciación de capital** (si el precio de la acción sube).
- **Voto** en asambleas (acciones ordinarias).

A diferencia de los bonos, **no hay un flujo prefijado** — los dividendos dependen del resultado y la decisión de la empresa.

## Fórmula — Valuación de perpetuidad constante

$$P^A = \frac{D}{i}$$

Donde:
- $P^A$: precio de la acción (perpetuidad constante)
- $D$: dividendo proyectado constante por período
- $i$: tasa de descuento ajustada por riesgo

## Modelo de Gordon (perpetuidad creciente)

Si los dividendos crecen a tasa $g$ constante:

$$P^A = \frac{D_1}{i - g}$$

Donde:
- $D_1$: dividendo del próximo período (siguiente al actual)
- $g$: tasa de crecimiento constante de los dividendos
- $i$: tasa de descuento (con $i > g$ para que el precio sea finito)

## Intuición / Por qué importa

- Las acciones son **más riesgosas** que los bonos (residuo en el orden de pago, dividendos discrecionales) → exigen **mayor rendimiento esperado**.
- En el LP, el rendimiento de las acciones supera al de los bonos: **equity premium**.
- El precio refleja **expectativas futuras de ganancias**, no el pasado.

## Ejemplo

Empresa que paga $D = 5$ por año, tasa de descuento $i = 10\%$.
$$P^A = 5/0,10 = 50$$

Si los dividendos crecerán al 3% por año:
$$P^A = 5/(0,10 - 0,03) = 71,4$$

## Errores comunes / Distinciones

- **Renta fija vs variable:**
  - Bonos: flujo prefijado, deudor se obliga.
  - Acciones: flujo incierto, propietario soporta el riesgo residual.
- **Dividendo no es lo mismo que rendimiento:** el rendimiento incluye también la apreciación de capital.
- **No siempre las empresas pagan dividendos.** Muchas reinvierten todo (Amazon durante años) y el retorno viene por apreciación.
- **El modelo de Gordon es simplificación.** En la realidad los dividendos no crecen a tasa constante.

## Relacionado con
- [[bonos-renta-fija]]
- [[sistema-financiero]]
- [[tasa-interes]]
