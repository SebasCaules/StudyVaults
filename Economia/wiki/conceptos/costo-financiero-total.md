---
tags: [unit-07, definicion]
aliases: [CFT, costo financiero total, costo efectivo de la deuda]
---

## Definición

**Costo Financiero Total (CFT):** tasa que mide el costo **real** de una financiación incluyendo *todos* los flujos asociados — no solo los intereses, sino también **comisiones, gastos y cargos** del momento cero. Es la **TIR del flujo de fondos de la financiación**, calculada sobre lo efectivamente recibido.

Distinción central (FAQ de la cátedra):
- La **TEA** indica un costo que **solo tiene en cuenta los intereses** pactados.
- El **CFT** parte del **neto recibido en mano** y por eso captura el efecto de las comisiones. Siempre $CFT \geq TEA$; son iguales solo si no hay gastos extra.

## Fórmula

El CFT del período resuelve:

$$\boxed{\text{Neto recibido} = \sum_{t=1}^{n}\frac{\text{Pago}_t}{(1+i_{CFT})^t}}$$

**Donde:**
- Neto recibido: préstamo menos comisiones/gastos cobrados al inicio
- $\text{Pago}_t$: todo lo pagado en $t$ (capital + intereses + cargos)
- $i_{CFT}$: CFT del período (luego se anualiza: $CFT_{anual} = (1+i_{CFT})^{m}-1$)

Se obtiene por **tanteo e interpolación** (o `TIR` en Excel): no tiene despeje cerrado con más de dos pagos.

## Ejemplo (guía ej. 7 — el ejemplo canónico de la FAQ)

Prestan \$100 con comisión de \$2 en el acto; se devuelve en 2 cuotas anuales de \$50 y se paga interés del 20% nominal anual **pagadero semestralmente** (10% por semestre sobre saldo).

Flujos semestrales: recibo **98** hoy; pago 10 ($t=1$), 60 ($t=2$: 10 de interés + 50 de capital), 5 ($t=3$), 55 ($t=4$).

- La **TES** (= TNA/2 = 10%) resuelve $100 = \frac{10}{1+i}+\frac{60}{(1+i)^2}+\frac{5}{(1+i)^3}+\frac{55}{(1+i)^4}$ → TEA $= 1{,}10^2-1 = 21\%$.
- El **CFT semestral** resuelve la misma ecuación pero con **98** a la izquierda → $i_{CFT} \approx 10{,}83\%$ semestral → $CFT_{anual} = 1{,}1083^2 - 1 \approx \mathbf{22{,}8\%} > 21\%$.

¿Por qué es lógico que dé mayor? Las cuotas se calcularon sobre \$100 prestados, pero por la comisión se recibieron solo \$98: se paga "como si" se debiera más de lo que se recibió.

## Intuición / Por qué importa

- Es **la** tasa para comparar préstamos reales entre sí y contra el costo de oportunidad del capital propio: las TNA/TEA publicadas subestiman el costo cuando hay comisiones, seguros o gastos administrativos (por eso el BCRA obliga a publicar el CFT).
- Misma lógica que la TIR de la Unidad 8, aplicada a una **financiación** en lugar de una inversión.

## Errores comunes / Distinciones

- **Calcular el costo sobre el monto nominal del préstamo** en vez del neto recibido.
- **Creer que el CFT se obtiene con $(1+TES)^2-1$:** esa cuenta da la TEA; el CFT exige plantear la TIR del flujo completo.
- **Olvidar meter en el flujo** los cargos periódicos (seguros, mantenimiento de cuenta) además de la comisión inicial.

## Relacionado con
- [[tasas-equivalentes]] — anualizar el CFT del período
- [[conceptos/tir|tir]] — misma matemática, en versión inversión (U8)
- [[sistemas-amortizacion]]
- [[formulas/unidad-07]]
