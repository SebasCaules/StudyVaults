---
tags: [unit-07, formula]
aliases: [TNA, TEA, TEM, tasa nominal, tasa efectiva, tasa proporcional, frecuencia de capitalización]
---

## Definición

Dos tasas son **equivalentes** si, aplicadas a capitales iguales durante el mismo período de tiempo, producen el **mismo capital final**. Convertir tasas a un período común es el paso 0 de casi todo problema de cálculo financiero (y del parcial).

**Las tres tasas del sistema:**

| Tasa | Qué es |
|---|---|
| **Nominal** ($i$, TNA) | La que se *declara* en la operación. No se aplica directamente: es un "rótulo anualizado lineal". |
| **Proporcional o del período** ($i_p = i/k$) | La efectiva del subperíodo de capitalización. Esta sí se aplica. |
| **Efectiva** ($i_e$, TEA) | La ganancia real anual una vez capitalizados los subperíodos. |

**Frecuencia de capitalización ($k$):** número de veces que se capitalizan intereses por año. "21% anual convertible cuatrimestralmente" → $k = 12/4 = 3$.

## Fórmula

$$i_p = \frac{i}{k} \qquad\qquad \boxed{i_e = \left(1+\frac{i}{k}\right)^k - 1}$$

**Donde:**
- $i$: tasa nominal anual (TNA)
- $k$: capitalizaciones por año
- $i_p$: tasa proporcional (efectiva del subperíodo)
- $i_e$: tasa efectiva anual (TEA)

**Igualdad de equivalencia entre dos tasas nominales** ($j$ con frecuencia $p$):

$$\left(1+\frac{i}{k}\right)^k - 1 = \left(1+\frac{j}{p}\right)^p - 1$$

**Cambio de plazo de una tasa efectiva** (de $d$ días a $t$ días):

$$i_t = (1+i_d)^{t/d} - 1$$

## Casos que toma el parcial

**TNA con capitalización diaria → TEM** (año de 360 días, mes de 30 — Parcial 11-Nov-2025, billetera virtual):

$$TEM = \left(1+\frac{TNA}{360}\right)^{30}-1 = \left(1+\frac{0{,}35}{360}\right)^{30}-1 \approx 2{,}96\%$$

**TEM ↔ TEA:** $1+TEA = (1+TEM)^{12}$.

**Ejemplos de las slides:**
- TNA 36% cap. mensual: $i_p = 3\%$ mensual; $TEA = 1{,}03^{12}-1 = 42{,}58\%$ (VF de \$1.000.000 al año: \$1.425.761).
- TNA 24% conv. trimestral: $i_p = 6\%$; $TEA = 1{,}06^4 - 1 = 26{,}25\%$.
- ¿TNA cap. cuatrimestral equivalente a 60% TNA cap. mensual? $(1+j/3)^3 = (1{,}05)^{12} \Rightarrow j = 3\,(1{,}05^4 - 1) = 64{,}65\%$.

**Efecto de la frecuencia** (misma TNA 36%):

| Capitalización | anual | semestral | trimestral | mensual | diaria | continua |
|---|---|---|---|---|---|---|
| TEA | 36% | 39,24% | 41,16% | 42,58% | 43,31% | 43,33% |

A mayor frecuencia, mayor TEA. El límite es la **capitalización continua**: $F = P\,e^{r n}$, $TEA = e^r - 1$.

## Intuición / Por qué importa

- La TNA es **publicidad**; la efectiva es **lo que se paga/cobra**. Dos préstamos solo se comparan en términos de tasa efectiva del mismo plazo (guía ej. 1: TNA 14% cap. mensual ≈ TEA 14,9% le gana a TNA 18% cap. trimestral ≈ TEA 19,3%).
- Antes de usar cualquier fórmula de [[anualidades]] o VAN, **la tasa y el período de los flujos deben coincidir** (flujos mensuales → TEM).

## Errores comunes / Distinciones

- **Usar la TNA directamente como tasa anual efectiva** (ignora la capitalización).
- **Dividir la TNA por 12 y creer que esa es "la TEM"** cuando la capitalización no es mensual: si capitaliza diario, primero $(1+TNA/360)^{30}-1$.
- **Mezclar período de tasa y de flujo** (descontar cuotas mensuales con la TEA).
- **Comparar préstamos por TNA** en lugar de por tasa efectiva (o mejor, por [[costo-financiero-total]] si hay comisiones).
- La tasa efectiva **no es proporcional al tiempo**: la tasa de 80 días no es $8/3$ de la de 30 días, es $(1+i_{30})^{80/30}-1$.

## Relacionado con
- [[tasa-interes]] — interés simple vs compuesto, TNA vs TEA (base U5)
- [[tasa-interes-real]] — descontar la inflación (Fisher)
- [[costo-financiero-total]]
- [[formulas/unidad-07]]
