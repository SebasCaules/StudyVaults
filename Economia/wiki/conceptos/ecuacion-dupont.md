---
tags: [unit-06, formula]
aliases: [análisis DuPont, identidad DuPont]
---

## Definición

**Ecuación de DuPont:** descomposición multiplicativa del ROE en tres factores que separan **de dónde viene** la rentabilidad del accionista: eficiencia económica, eficiencia operativa y apalancamiento financiero.

## Fórmula

$$\boxed{ROE = \underbrace{\frac{U.\ neta}{Ventas}}_{margen} \times \underbrace{\frac{Ventas}{Activos}}_{rotación} \times \underbrace{\frac{Activos}{PN}}_{apalancamiento}}$$

**Donde:**
- $margen$: **eficiencia económica** — utilidad por peso vendido
- $rotación$: **eficiencia operativa** — veces que se "venden" los activos
- $apalancamiento$: multiplicador del PN — cuántos activos se controlan por peso propio

Los dos primeros factores multiplicados dan la **rentabilidad sobre activos**; el tercero la convierte en rentabilidad sobre PN.

## Ejemplo

Con el balance reconstruido de GP5 Ej. 5 ($UN = 16$, $Ventas = 176$, $Activos = 115$, $PN = 40$):

$$ROE = \frac{16}{176} \times \frac{176}{115} \times \frac{115}{40} = 9{,}1\% \times 1{,}53 \times 2{,}875 = 40\% \checkmark$$

Coincide con el ROE dato del ejercicio — DuPont sirve como **verificación cruzada** de cualquier reconstrucción.

## Intuición / Por qué importa

- Dos empresas con el mismo ROE pueden ser opuestas: una vinería de margen alto y rotación baja vs un supermercado de margen mínimo y rotación altísima.
- El tercer factor es **deuda**: subir apalancamiento sube el ROE *mientras el negocio rinda más que el costo de la deuda*, pero sube el **riesgo** en la misma maniobra. ROE alto con apalancamiento alto no es mejor gestión, es más exposición.
- Mapea las decisiones de la firma: operativas (margen — precios, control de gastos), de inversión (rotación — mix de activos, utilización de planta) y de financiamiento (mix deuda-PN, dividendos). Maximizar el valor de las acciones combina las tres con el crecimiento y el riesgo.

## Errores comunes / Distinciones

- Leer un ROE alto como sinónimo de eficiencia sin abrir la descomposición.
- Mezclar momentos: utilidad del período con activos/PN de cierre vs promedio — ser consistente.
- El apalancamiento usa **Activos/PN** (multiplicador), no Deuda/PN: con $A = P + PN$, $A/PN = 1 + P/PN$.

## Relacionado con
- [[ratios-financieros]]
- [[ebit-ebitda]]
- [[balance-patrimonial]]
