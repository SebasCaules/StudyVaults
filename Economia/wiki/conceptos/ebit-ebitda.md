---
tags: [unit-06, definicion]
aliases: [EBIT, EBITDA, EBT, EAT, utilidad operativa]
---

## Definición

Hitos del **esquema financiero** del [[cuadro-de-resultados]]:

- **EBITDA** (*Earnings Before Interest, Taxes, Depreciation & Amortization*): ventas menos costos **erogables**. Resultado operativo antes de cargos no-caja.
- **EBIT** (*Earnings Before Interest & Taxes*): EBITDA menos amortizaciones = **utilidad operativa**. Mide el negocio sin importar cómo se financia.
- **EBT**: EBIT menos intereses = utilidad antes de impuestos.
- **EAT**: EBT menos impuesto a las ganancias = **utilidad neta**.

## Fórmula

$$Ventas \xrightarrow{-\ costos\ erogables} EBITDA \xrightarrow{-\ amortizaciones} EBIT \xrightarrow{-\ intereses} EBT \xrightarrow{-\ IG} EAT$$

**Donde:**
- $costos\ erogables$: CMV y gastos que implican (implicarán) desembolso
- $amortizaciones$: cargo devengado no erogable ([[amortizacion-contable]])
- $IG$: impuesto a las ganancias

## Ejemplo

Reconstrucción GP5 Ej. 5 (en \$):

| | |
|---|---|
| Ventas | 176 |
| − CMV | (110) |
| − Gastos com. y adm. | (10) |
| **EBITDA** | **56** |
| − Amortización | (20) |
| **EBIT** | **36** |
| − Intereses | (7) |
| **EBT** | **29** |
| − IG | (13) |
| **EAT (utilidad neta)** | **16** |

## Intuición / Por qué importa

- Cada hito aísla un "piso" distinto: EBITDA ≈ caja operativa bruta; EBIT = mérito del negocio; EAT = lo que queda al accionista.
- Separa tres decisiones distintas: operación (hasta EBIT), financiamiento (intereses), fisco (IG). Por eso la rentabilidad **operativa** se mide $EBIT/Activo$ y la del accionista $EAT/PN$ ([[ratios-financieros]]).
- La Unidad 8 arma el flujo del proyecto desde acá: $FF \approx EBIT(1-t) + Amortizaciones - \Delta KT - Inversiones$ ([[flujo-de-fondos-proyecto]]).
- La cátedra usa EBITDA en la **cobertura de intereses**.

## Errores comunes / Distinciones

- **EBITDA no es flujo de caja:** ignora impuestos, ΔKT (ventas a crédito, stock) e inversiones. Es un proxy, no el flujo.
- **EBIT ≠ EBT** en empresas endeudadas: olvidar los intereses infla la base imponible.
- En empresas sin deuda y sin resultados extraordinarios, EBIT = EBT — caso particular, no regla.

## Relacionado con
- [[cuadro-de-resultados]]
- [[amortizacion-contable]]
- [[ratios-financieros]]
- [[estado-origen-aplicacion-fondos]]
- [[flujo-de-fondos-proyecto]]
