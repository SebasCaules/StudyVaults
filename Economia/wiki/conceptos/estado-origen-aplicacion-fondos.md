---
tags: [unit-06, metodo]
aliases: [EOAF, flujo de caja, cash flow, estado de flujo de efectivo]
---

## Definición

**Estado de Origen y Aplicación de Fondos (EOAF) / Cuadro de flujo de caja:** muestra **de dónde surgieron los fondos y para qué fueron utilizados** — el efectivo que entra y sale en el período. Se enfoca en la **situación de caja**: una empresa puede estar bien en utilidades y mal en caja (o al revés).

## Fórmula

Partiendo de la ecuación contable en diferencias:

$$A = P + PN \;\Rightarrow\; \Delta A = \Delta P + \Delta PN \;\Rightarrow\; \boxed{\Delta C = \Delta P + \Delta PN - \Delta A_{\neq C}}$$

**Donde:**
- $\Delta C$: variación de caja del período
- $\Delta P + \Delta PN$: **orígenes** de fondos (si aumentan)
- $\Delta A_{\neq C}$: variación de activos distintos de caja — **aplicaciones** (si aumentan)

Desagregando por actividades (método indirecto):

$$\Delta C = \underbrace{Utilidades + Amortizaciones - \Delta Créditos - \Delta BC + \Delta D_{com}}_{flujo\ de\ la\ operación} \underbrace{-\ Inversiones}_{inversión} \underbrace{+\ \Delta D_{fin} + Aportes - Dividendos}_{financiación}$$

**Donde:**
- $Amortizaciones$: se suman de vuelta (gasto no erogable)
- $\Delta Créditos, \Delta BC$: aumentos de créditos y bienes de cambio (consumen caja)
- $\Delta D_{com}$: aumento de deudas comerciales (financia espontáneamente)
- $\Delta D_{fin}$: variación de deuda financiera

## Clasificación de cobros y pagos

| Actividad | Orígenes (fondos generados) | Aplicaciones (fondos usados) |
|---|---|---|
| **Operativas** | Cobros por ventas y servicios, regalías, comisiones | Pagos a proveedores y empleados, IG |
| **Inversión** | Venta de activo fijo e intangibles, venta de títulos, reembolso de préstamos a terceros | Compra de activo fijo e intangibles, préstamos otorgados |
| **Financiación** | Emisión de acciones, emisión de obligaciones/préstamos (CP o LP) | Dividendos, rescate de acciones, devolución de préstamos |

## FCFF y FCFE

Reclasificando los intereses (y su escudo impositivo) al flujo de financiación:

- **FCFF** (*Free Cash Flow to the Firm*, "del activo") = $EBIT(1-\alpha) + Amortizaciones - \Delta KT\ operativo - Inversiones + Venta\ de\ bienes\ de\ uso$, con $\alpha$ la tasa de IG. Es el flujo que genera el negocio para **todos** los proveedores de capital.
- **FCFE** (*Free Cash Flow to Equity*, "hacia el accionista") = FCFF $+ \Delta D_{fin} - Intereses(1-\alpha)$ $+$ aportes $-$ dividendos.

Esta es exactamente la plantilla del [[flujo-de-fondos-proyecto]] de la Unidad 8.

## Ejemplo

CONTA (GP5 Ej. 1, marzo): el resultado del mes es $-45$, pero la caja cayó $\Delta C = 80 - 200 = -120$. Conciliación por actividades:

| Flujo | Detalle | \$ |
|---|---|---|
| Operativo | $-45$ (resultado) $+80$ (amort.) $-100$ (resultado venta bonos, no operativo) $-150$ ($\Delta$Créditos) $+25$ ($\Delta$BC libera) $-250$ ($\Delta$Proveedores) $-40$ ($\Delta$Sueldos a pagar) $+60$ ($\Delta$Gastos a pagar) | −420 |
| Inversión | Venta de bonos (precio cobrado) | +500 |
| Financiación | Cancelación 50% deuda bancaria | −200 |
| **Total** | $= \Delta C$ ✓ | **−120** |

Moraleja: **resultado (−45) y variación de caja (−120) difieren**, y el EOAF explica exactamente por qué. Detalle en [[ejercicios/gp5-informacion-contable]].

## Errores comunes / Distinciones

- **Utilidad ≠ caja** — el error madre ([[devengado-vs-percibido]]).
- Olvidar **sumar de vuelta las amortizaciones** en el método indirecto.
- Tratar un aumento de stock o de créditos como neutro: **consume caja** aunque no toque el resultado.
- Clasificar el pago de dividendos como operativo: es financiación (los intereses admiten alternativa, los dividendos no).

## Relacionado con
- [[devengado-vs-percibido]]
- [[ebit-ebitda]]
- [[capital-de-trabajo]]
- [[flujo-de-fondos-proyecto]]
- [[balance-patrimonial]]
