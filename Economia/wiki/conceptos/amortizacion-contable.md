---
tags: [unit-06, formula]
aliases: [depreciación, amortización lineal]
---

## Definición

**Amortización (depreciación):** conversión **gradual** del valor del activo fijo en **gasto**; expresión contable de la pérdida de valor que sufren los bienes de uso por **uso, desgaste u obsolescencia**. Es un gasto devengado que **no eroga caja**.

## Fórmula

Amortización lineal en función del tiempo:

$$\boxed{Am = \frac{V.O. - V.R.}{V.U.}}$$

**Donde:**
- $Am$: amortización del ejercicio (\$/período)
- $V.O.$: valor de origen (precio de compra + gastos para ponerlo operativo)
- $V.R.$: valor residual contable al fin de la vida útil
- $V.U.$: vida útil contable (períodos)

Valor de libros (valor contable neto):

$$V.L. = V.O. - A.A.$$

**Donde:**
- $V.L.$: valor de libros
- $A.A.$: amortizaciones acumuladas desde el alta del bien

Resultado por venta de un bien de uso: $Resultado = Precio\ de\ venta - V.L.$

## Ejemplo

Maquinaria: $V.O. = \$1.000.000$, $V.U. = 10$ años, $V.R. = 10\% = \$100.000$:

$$Am = \frac{1.000.000 - 100.000}{10} = \$90.000/año$$

| Año | $A.A.$ | $V.L.$ |
|---|---|---|
| 1 | 90.000 | 910.000 |
| 5 | 450.000 | 550.000 |
| 10 | 900.000 | 100.000 (= V.R.) |

**GP5 Ej. 2:** equipos con $V.O. = 80$, $V.U. = 10$ años, vendidos a los 5 años por \$120: $A.A. = 40$, $V.L. = 40$, resultado $= 120 - 40 = +80$.

## Reglas y matices

- **Los terrenos no se amortizan** (único bien de uso exceptuado): no se desgastan.
- La base amortizable es $V.O. - V.R.$: el valor residual **no se amortiza** — queda en libros al final.
- **Mejoras** que aumentan vida útil o rendimiento se **activan** y se amortizan (junto al $V.L.$ remanente) en la vida útil que le resta al bien.
- Cuenta regularizadora: **Amortizaciones Acumuladas** resta dentro del activo. Bienes inmateriales (patentes, llave, marcas) se amortizan análogamente.
- **Contable ≠ impositiva:** el fisco puede permitir otra velocidad de deducción (amortización acelerada). Eso no cambia el gasto total pero **adelanta el ahorro de impuesto** → [[escudo-fiscal]] (GP5 Ej. 3). El valor del adelanto se mide con [[valor-tiempo-dinero]].

## Intuición / Por qué importa

Reparte el costo de un activo entre los ejercicios que lo aprovechan ([[devengado-vs-percibido]]): comprar la máquina no es gasto (es un cambio de activo); usarla sí. Como no es erogación, en el flujo de fondos se **suma de vuelta** después de impuestos — es la diferencia central entre [[cuadro-de-resultados]] y [[flujo-de-fondos-proyecto]], y la razón de la brecha [[ebit-ebitda]].

## Errores comunes / Distinciones

- Amortizar terrenos, o amortizar sobre $V.O.$ ignorando el $V.R.$
- Confundir la **amortización del ejercicio** (flujo, va al cuadro) con las **acumuladas** (stock, regulariza el balance).
- Restarla en el cuadro y olvidar **sumarla de vuelta** al armar el flujo de caja.
- En proyectos: usar la amortización contable cuando el enunciado da una impositiva distinta.

## Relacionado con
- [[bienes-de-cambio-vs-bienes-de-uso]]
- [[ebit-ebitda]]
- [[escudo-fiscal]]
- [[valor-residual]]
- [[flujo-de-fondos-proyecto]]
