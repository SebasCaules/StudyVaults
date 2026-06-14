---
tags: [unit-04, micro]
---

## Definición

**Índice de Lerner ($L$):** medida del **poder de mercado** de una firma. Cuantifica el margen porcentual entre el precio cobrado y el costo marginal. Es **cero en competencia perfecta** y crece a medida que la demanda se vuelve más inelástica.

## Fórmula

$$\boxed{L = \frac{P - CMg}{P} = \frac{1}{|\varepsilon|}}$$

Donde:
- $L$: índice de Lerner (margen relativo sobre el costo)
- $P$: precio de mercado
- $CMg$: costo marginal
- $\varepsilon$: elasticidad precio de la demanda (en módulo) que enfrenta la firma

**Derivación:** maximizando $\pi$ con $IMg = CMg$:

$$P\left(1 - \frac{1}{|\varepsilon|}\right) = CMg \Rightarrow \frac{P - CMg}{P} = \frac{1}{|\varepsilon|}$$

## Intuición / Por qué importa

- **$L = 0$:** no hay poder de mercado. $P = CMg$. Caso de CP, donde $|\varepsilon| \to \infty$ (demanda horizontal).
- **$L \to 1$:** poder de mercado casi total. $P \gg CMg$. Demanda muy inelástica ($|\varepsilon| \to 1$).
- **$L > 0$ acompaña a DWL.** Cualquier brecha entre $P$ y $CMg$ implica que existen intercambios mutuamente beneficiosos no realizados.

**Lección operativa:** el monopolista **siempre opera donde $|\varepsilon| > 1$** (zona elástica). Si $|\varepsilon| \leq 1$, el [[ingreso-marginal-monopolio|IMg]] sería $\leq 0$ y bajar $Q$ aumentaría el ingreso. Esto implica $L < 1$ siempre.

**Aplicación a discriminación de 3er grado:** en cada segmento la firma cobra según el Lerner local. Mercado más inelástico → mayor $L$ → mayor precio.

## Ejemplo

Monopolio con $|\varepsilon| = 2$ y $CMg = 10$:

$$L = \frac{1}{2} = 0.5 \Rightarrow \frac{P - 10}{P} = 0.5 \Rightarrow P = 20$$

Margen del 50%. Si la demanda fuera más inelástica ($|\varepsilon| = 1.25$): $L = 0.8$, $P = 50$. Misma estructura de costos, mucho más margen — la elasticidad es el factor decisivo.

## Errores comunes / Distinciones

- **Confundir Lerner con margen contable.** Lerner usa $CMg$, no $CMe$. Margen contable $= (P - CMe)/P$ es otra cosa.
- **Asumir $L = 0$ en cualquier mercado "competitivo".** Solo CP da $L = 0$. En comp. monopolística $L > 0$ aunque $\pi = 0$ en LP.
- **Olvidar el módulo de la elasticidad.** $\varepsilon < 0$ pero $L = 1/|\varepsilon|$ con módulo.


## Gráfico

![[monopolio-equilibrio.svg]]
## Relacionado con
- [[monopolio]]
- [[ingreso-marginal-monopolio]]
- [[elasticidad-precio-demanda]]
- [[discriminacion-precios]]
- [[deadweight-loss]]
