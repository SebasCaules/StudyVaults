---
tags: [unit-05, unit-07, finanzas]
aliases: [tasa real, r, paridad de Fisher, ex-ante, ex-post]
---

## Definición

**Tasa de interés real ($r$):** rendimiento de una inversión **ajustado por inflación**. Mide el poder adquisitivo real ganado o perdido al prestar/ahorrar.

## Fórmula exacta

$$1 + r = \frac{1 + i}{1 + \pi} \quad \Rightarrow \quad r = \frac{1 + i}{1 + \pi} - 1$$

Donde:
- $r$: tasa de interés real (poder adquisitivo)
- $i$: tasa de interés nominal del período
- $\pi$: tasa de inflación del período

## Aproximación de Taylor

$$r \approx i - \pi$$

**Solo válida cuando $i$ y $\pi$ son chicas** (orden de magnitud 1-3% anual). **NO sirve en Argentina** por las tasas e inflaciones altas.

## Distinción ex-ante vs ex-post

- **Ex-ante (Paridad de Fisher):** usa la **inflación esperada** $\pi^e$, conocida al momento de la decisión.
$$1 + r_t = \frac{1 + i_t}{1 + \pi^e_{t+1}}$$

  Donde:
  - $r_t$: tasa real ex-ante del período $t$
  - $i_t$: tasa nominal contractual al inicio del período
  - $\pi^e_{t+1}$: inflación esperada para el período siguiente

  Es la tasa relevante para decidir.

- **Ex-post:** usa la **inflación realizada**. Es la tasa real que efectivamente se obtuvo. Si $\pi^{real} > \pi^e$, la tasa real ex-post fue menor que la esperada → los acreedores perdieron, los deudores ganaron.

## Intuición / Por qué importa

- La tasa **nominal** no refleja el rendimiento real cuando hay inflación.
- La tasa **real** es la que importa para decisiones de inversión, consumo intertemporal y ahorro.
- En Argentina, durante años las tasas de plazo fijo fueron **negativas en términos reales** (los pesos perdían poder adquisitivo más rápido que el rendimiento).

## Ejemplo

**Argentina, hipotético:** $i = 60\%$, $\pi = 50\%$.

Aproximación: $r \approx 60 - 50 = 10\%$.

Exacta: $r = 1,60/1,50 - 1 = 0,0666 = 6,66\%$.

**Error de la aproximación: ~50%.** Por eso en Argentina hay que usar siempre la fórmula exacta.

## Uso en U7 — Cálculo financiero

- En las slides de VTD, la tasa real aparece como **componente** de la tasa nominal: $i = (1+i_f)(1+i_r)(1+i_\theta)-1$ (ver [[tasa-interes]]). El componente real ronda 3–4% a nivel mundial.
- **Tasa real de un subperíodo** (guía ej. 8b): calcular primero la TEA nominal con [[tasas-equivalentes]], deflactarla con Fisher, y recién después llevar la real al subperíodo:
  $$r_{30d} = (1+r_{anual})^{30/365} - 1$$
  Ejemplo: TNA 7% cap. cada 180 días, $\pi = 3\%$ anual → TEA $= 7{,}12\%$ → $r_{anual} = 1{,}0712/1{,}03 - 1 = 4{,}0\%$ → $r_{30d} \approx 0{,}32\%$.

## Errores comunes / Distinciones

- **Confundir aproximación con fórmula exacta** en países con alta inflación.
- **No distinguir ex-ante de ex-post.** El ex-ante incorpora expectativas (que pueden errar); el ex-post es la realidad.
- **Tasas reales pueden ser negativas.** Si $\pi > i$, $r < 0$: tener pesos genera pérdida real.
- **Deflactar una tasa nominal de subperíodo con la inflación anual** (períodos inconsistentes): igualar siempre los plazos de $i$ y $\pi$ antes de aplicar Fisher.

## Relacionado con
- [[tasa-interes]]
- [[tasas-equivalentes]]
- [[inflacion]]
- [[bonos-renta-fija]]
- [[politica-monetaria-expansiva-contractiva]]
- [[formulas/unidad-07]]
