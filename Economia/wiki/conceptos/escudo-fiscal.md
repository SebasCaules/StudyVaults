---
tags: [unit-08, formula]
aliases: [escudo impositivo, tax shield, ahorro fiscal de la amortización, escudo de amortización]
---

## Definición

**Escudo fiscal (de la amortización):** ahorro de impuesto a las ganancias generado por un gasto **deducible pero no erogable**. La amortización no es un flujo de caja (no sale plata cuando se registra); sin embargo, *"escuda"* ingresos de ser alcanzados por el IG y así **crea un ingreso de caja igual al ahorro impositivo**. Es el único efecto real de la [[amortizacion-contable]] sobre el [[flujo-de-fondos-proyecto]].

## Fórmula

$$\boxed{Escudo_t = t \cdot Am}$$

**Donde:**
- $t$: alícuota del impuesto a las ganancias
- $Am$: amortización del período (gasto no erogable deducible)

Integrado al flujo operativo — tres formas equivalentes de escribir lo mismo:

$$FEO = UN + Am = (V - C)(1-t) + t \cdot Am = EBIT(1-t) + Am$$

**Donde:**
- $FEO$: flujo de efectivo operativo del período
- $UN$: utilidad neta contable (después de IG)
- $V$: ventas del período
- $C$: costos erogables (sin amortización)
- $EBIT$: utilidad operativa antes de impuestos

## Ejemplo (enfoque de descomposición del PDF)

Ventas \$1.000.000, gastos en efectivo \$500.000, amortizaciones \$100.000, $t = 35\%$:

| Componente | Cálculo | Monto |
|---|---|---|
| Ingresos después de IG | $(1-0{,}35) \cdot 1.000.000$ | $+650.000$ |
| Egresos después de IG | $(1-0{,}35) \cdot 500.000$ | $-325.000$ |
| **Ahorro IG (gastos no en efectivo)** | $0{,}35 \cdot 100.000$ | $+35.000$ |
| **FEO** | | **\$360.000** |

Verificación por el método directo: $UAI = 1.000.000 - 600.000 = 400.000$; $IG = 140.000$; $UN = 260.000$; $FEO = UN + Am = 260.000 + 100.000 = 360.000$ ✓.

## Comparativa estática (pregunta típica de parcial)

| Si la amortización contable... | ...el escudo fiscal | ...el VAN |
|---|---|---|
| Se **alarga** (ej.: 10 → 15 años) | Mismo total nominal, pero diluido y cobrado más tarde | **Menor** (VP del escudo cae) |
| Se **acelera** (plazo más corto) | Igual total, cobrado antes | **Mayor** |
| La alícuota $t$ sube | Mayor escudo por peso amortizado | Sube el escudo (aunque suba también el IG sobre la utilidad) |

Pregunta del parcial 11-Nov-2025: *"si la amortización contable fuera en 15 años en vez de 10, ¿el VAN sería mayor o menor?"* → **Menor**: el total amortizable no cambia, pero el ahorro impositivo anual es más chico y llega más tarde → menor valor presente. (En ese caso el impuesto sobre la venta final no cambia: a los 15 años el valor de libro llega a 0 por cualquiera de los dos esquemas.)

Valor presente del escudo con amortización lineal constante:

$$VP_{escudo} = t \cdot Am \cdot a(n_{am}; i)$$

**Donde:**
- $a(n_{am}; i)$: factor de VP de una anualidad por $n_{am}$ años ([[anualidades]])
- $n_{am}$: plazo de amortización contable

## Condiciones y matices

- El escudo **solo vale si hay utilidades gravadas** contra las cuales deducir. Los quebrantos son trasladables hasta 5 ejercicios (la pérdida de un año se deduce de ganancias futuras).
- En el horizonte del proyecto puede haber años **con** escudo (mientras se amortiza, ej. años 1–10) y años **sin** (ej. años 11–15, activo ya totalmente amortizado): el FEO cae cuando se acaba la amortización, todo lo demás constante.
- El escudo de amortización de un activo ya comprado ([[costo-hundido]]) **sí se computa**: es un flujo futuro que depende de la alternativa elegida, aunque el costo del activo sea hundido.
- Los ahorros de impuestos por **intereses** del financiamiento NO van al flujo del proyecto (el financiamiento queda afuera).

## Errores comunes / Distinciones

- **Restar la amortización del flujo de caja.** Se resta solo para calcular el impuesto y se vuelve a sumar.
- **Olvidar sumarla de vuelta** después de calcular la UN ($FEO = UN + Am$, no $UN$).
- **Creer que cambiar el plazo de amortización no afecta el VAN** "porque el total es el mismo": afecta el *timing*, y el timing es valor ([[valor-tiempo-dinero]]).
- **Aplicar el escudo a gastos erogables**: esos ya entran netos de impuesto vía $(1-t)$; el término $t \cdot Am$ es exclusivo de los gastos no erogables.

## Relacionado con
- [[amortizacion-contable]]
- [[flujo-de-fondos-proyecto]]
- [[van]]
- [[valor-residual]]
- [[costo-hundido]]
- [[cuadro-de-resultados]]
