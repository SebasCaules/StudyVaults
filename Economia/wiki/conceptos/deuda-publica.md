---
tags: [unit-05, macro]
aliases: [deuda pública, debt-to-GDP, sostenibilidad fiscal]
---

## Definición

**Deuda pública:** stock acumulado de obligaciones del sector público con acreedores nacionales (deuda interna) o extranjeros (deuda externa). Resulta de **acumular déficits fiscales** pasados, neto de superávits.

## Dinámica

$$D_{t+1} = D_t \cdot (1 + r) - SP_{t+1}$$

Donde:
- $D_t$: stock de deuda en el período $t$
- $r$: tasa de interés sobre la deuda
- $SP_{t+1}$: superávit primario en $t+1$

Como ratio del PBI:

$$\frac{D_{t+1}}{Y_{t+1}} \approx \frac{D_t}{Y_t} \cdot \frac{1+r}{1+g} - \frac{SP_{t+1}}{Y_{t+1}}$$

Donde:
- $Y_t$: PBI nominal en el período $t$
- $g$: tasa de crecimiento del PBI real

## Sostenibilidad

Depende de la relación entre $r$ y $g$:

| Situación | Resultado |
|---|---|
| $r < g$ (tasa < crecimiento) | Deuda/PBI baja sola, aún con déficit primario moderado |
| $r > g$ (tasa > crecimiento) | Necesita superávit primario para evitar bola de nieve |
| Trayectoria explosiva | Espiral de deuda → default o reestructuración |

## Intuición / Por qué importa

La deuda **no es mala per se** — financia inversión pública, suaviza el ciclo. Pero tiene límites:
- **Riesgo de default:** si los acreedores dejan de prestar.
- **Crowding out:** mucha deuda doméstica sube la tasa real → desplaza inversión privada.
- **Fragilidad cambiaria:** la deuda en moneda extranjera multiplica el riesgo si hay devaluación.
- **Restricciones a la política fiscal futura:** servicio de deuda absorbe recursos que no van a salud, educación, etc.

## Ejemplo

Argentina: serie de defaults (2001, 2014, 2020) y reestructuraciones. La deuda en moneda extranjera ha sido recurrente fuente de crisis (efecto balance: si el peso se devalúa, sube el peso real de la deuda en dólares).

Comparativa:
- Japón: deuda/PBI > 250% pero en yenes, baja tasa, mucho ahorro doméstico → sostenible.
- Argentina: deuda/PBI ~80% pero gran parte en USD, tasas altas, poco ahorro → mucho menos sostenible.

## Errores comunes / Distinciones

- **Importa la composición tanto como el monto:** moneda, plazos, acreedores.
- **Debt overhang:** mucha deuda desincentiva inversión productiva (porque las ganancias se las llevan los acreedores).
- **El BC no es "deuda externa".** Comprar bonos del Tesoro con emisión genera pasivos remunerados (Leliqs), que son otra forma de deuda.

## Relacionado con
- [[deficit-fiscal]]
- [[politica-fiscal]]
- [[identidad-sectorial]]
- [[bonos-renta-fija]]
- [[rating-crediticio]]
