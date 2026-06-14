---
tags: [unit-08, definicion]
aliases: [TIR múltiple, proyectos no convencionales, cambios de signo en el flujo, TER, tasa externa de retorno]
---

## Definición

**TIR múltiple:** cuando los flujos de caja de un proyecto **cambian de signo más de una vez** (proyecto *no convencional*), la ecuación del VAN puede tener **varias raíces** — varias "TIR" — y *"ninguna de ellas se puede desechar fácilmente"* (PDF). El criterio TIR pierde sentido: ¿contra cuál comparar la TREMA?

## Por qué pasa

La condición $\sum FC_j/(1+i)^j = 0$ es un polinomio de grado $n$ en $1/(1+i)$: puede tener hasta tantas raíces positivas como **cambios de signo** tenga la secuencia de flujos (regla de los signos de Descartes).

- **Proyecto convencional** ($-, +, +, \ldots$): un solo cambio de signo → una sola TIR → perfil del VAN monótono decreciente.
- **Proyecto no convencional** (ej.: $-, +, +, -$): el perfil del VAN deja de ser monótono — sube, alcanza un máximo y baja — y puede cortar el eje **dos veces**.

**Ejemplo del PDF:** perfil de VAN con raíces en $i = 25\%$ y $i = 400\%$. El VAN es negativo para tasas bajas, **positivo entre 25% y 400%**, y negativo después. Una TREMA del 10% rechaza el proyecto aunque "la TIR" (¿cuál?) parezca enorme.

## Casos típicos que generan flujos no convencionales

- **Costos de cierre/abandono al final**: remediación ambiental, desmantelamiento (minería, energía) → último flujo negativo.
- **Reinversiones grandes intermedias** (recambio de equipos a mitad de vida).
- Proyectos con anticipos de clientes (flujo positivo al inicio, egresos después).

## Soluciones

1. **Usar el VAN directamente** — siempre funciona: se evalúa $VAN(TREMA)$ y se decide por su signo. Es la respuesta de cátedra.
2. **TER (Tasa Externa de Retorno / TIR modificada):** *"la dificultad se puede obviar usando la TER"* (PDF). Se eliminan los cambios de signo intermedios usando una tasa externa explícita:

$$\boxed{(1 + TER)^n = \frac{VF_{ingresos}}{VP_{egresos}}}$$

**Donde:**
- $VF_{ingresos}$: flujos positivos capitalizados a la TREMA hasta el período final
- $VP_{egresos}$: flujos negativos descontados a la TREMA al momento 0
- $n$: cantidad de períodos del proyecto

Así queda un flujo equivalente con un solo egreso (momento 0) y un solo ingreso (momento $n$) → **una única tasa**, comparable contra la TREMA. Además repara la hipótesis de reinversión: los flujos se reinvierten a la TREMA, no a la TIR.

## Errores comunes / Distinciones

- **Aplicar el criterio TIR mecánicamente** sin mirar los signos del flujo. Primero contar los cambios de signo.
- **Quedarse con la raíz "linda"** (la primera que encuentra Excel) e ignorar las demás: Excel devuelve una sola TIR según la semilla, ocultando el problema.
- **Confundir TER con TIR:** la TER usa una tasa de reinversión externa (la TREMA); la TIR es puramente interna.
- No confundir con el **conflicto VAN-TIR** de [[proyectos-mutuamente-excluyentes]]: ese ocurre aun con proyectos convencionales; este es un defecto estructural del flujo.

## Relacionado con
- [[tir]]
- [[van]]
- [[trema]]
- [[flujo-de-fondos-proyecto]]
