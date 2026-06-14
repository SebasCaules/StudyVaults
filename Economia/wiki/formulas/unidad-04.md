---
unit: 04
title: Fórmulas — Unidad 4 (Monopolio, Competencia Monopolística, Oligopolio)
---

## Regla general de maximización

Válida para monopolio, competencia monopolística y oligopolio:
$$IMg = CMg$$

Donde:
- $IMg$: ingreso marginal (por unidad adicional vendida)
- $CMg$: costo marginal (por unidad adicional producida)

## Ingreso marginal del monopolista

Con demanda con pendiente negativa $P(Q)$:
$$IMg = \frac{dI}{dQ} < P$$

Donde:
- $I$: ingreso total ($P \cdot Q$)
- $P$: precio de mercado
- $Q$: cantidad total vendida

Para demanda lineal $P = a - bQ$:
$$I = (a-bQ) \cdot Q = aQ - bQ^2$$
$$IMg = a - 2bQ$$

Donde:
- $a$: ordenada al origen de la demanda
- $b$: pendiente (en módulo) de la demanda lineal

La curva de IMg tiene **el doble de pendiente** que la demanda y comparte el mismo intercepto con el eje de precios.

## Relación IMg — Precio — Elasticidad

$$IMg = P\left(1 - \frac{1}{|\varepsilon|}\right)$$

Donde:
- $\varepsilon$: elasticidad precio de la demanda (en módulo)

Implicaciones:
- Si $|\varepsilon| \to \infty$ (demanda perfectamente elástica) → $IMg = P$ (caso CP)
- Si $|\varepsilon| = 1$ → $IMg = 0$
- Si $|\varepsilon| < 1$ → $IMg < 0$ (monopolista **nunca** produce en tramo inelástico)

**Forma alternativa (hoja oficial de fórmulas):**
$$P = \frac{CMg}{1 - 1/|\varepsilon|} = CMg \cdot \frac{|\varepsilon|}{|\varepsilon| - 1}$$

Es la **regla de markup**: el precio óptimo del monopolista es un margen sobre $CMg$ que depende inversamente de la elasticidad. Cuanto más inelástica la demanda, mayor el markup.

## Índice de Lerner (margen sobre costo)

$$L = \frac{P - CMg}{P} = \frac{1}{|\varepsilon|}$$

Donde:
- $L$: índice de Lerner (margen relativo sobre el costo)

Mide el **poder de mercado**:
- $L = 0$ → competencia perfecta
- $L \to 1$ → monopolio con demanda muy inelástica

## Ejemplo monopolio (clase)

Dados $C(Q) = 50 + Q^2$ y $P(Q) = 40 - Q$:

$$CMg = 2Q, \quad IMg = 40 - 2Q$$

Igualando:
$$40 - 2Q = 2Q \Rightarrow Q^* = 10$$
$$P^* = 40 - 10 = 30$$
$$CMe = 50/10 + 10 = 15$$
$$\pi = (P - CMe) \cdot Q = (30 - 15) \cdot 10 = 150$$

## Competencia monopolística (LP)

En equilibrio de largo plazo (libre entrada):
$$P = CMe \quad \text{y} \quad IMg = CMg$$

Donde:
- $CMe$: costo medio ($CT/Q$)

Pero $P > CMg$ → persiste ineficiencia (DWL < monopolio).

## Discriminación de precios de 3er grado

Con dos mercados segmentados:
$$IMg_1 = IMg_2 = CMg$$
$$P_1\left(1-\frac{1}{|\varepsilon_1|}\right) = P_2\left(1-\frac{1}{|\varepsilon_2|}\right) = CMg$$

Donde:
- $P_1, P_2$: precio cobrado a cada segmento
- $\varepsilon_1, \varepsilon_2$: elasticidad precio de la demanda en cada segmento
- $IMg_1, IMg_2$: ingreso marginal en cada segmento

Mercado con demanda **más inelástica** → precio **más alto**.

## Comparación CP vs Monopolio (mismo costo, misma demanda)

Para demanda lineal $P = a - bQ$ y $CMg$ constante:

| Variable | Competencia perfecta | Monopolio |
|---|---|---|
| Cantidad | $Q_C = (a - CMg)/b$ | $Q_M = (a - CMg)/(2b)$ |
| Precio | $P_C = CMg$ | $P_M = (a + CMg)/2$ |
| Beneficio econ. | 0 (LP) | $(P_M - CMg)\cdot Q_M$ |
| EC | $\frac{(a-P_C)Q_C}{2}$ | $\frac{(a-P_M)Q_M}{2}$ |
| EP | 0 | rectángulo $(P_M-CMg)Q_M$ |
| **DWL** | 0 | $\frac{1}{2}(P_M-CMg)(Q_C-Q_M)$ |

Resultado clave: $Q_M = Q_C / 2$ (el monopolista produce la mitad y cobra el doble del margen sobre $CMg$).

## Regulación de monopolio natural

Tres esquemas, ordenados por eficiencia decreciente y factibilidad creciente:

1. **$P = CMg$** (eficiente como CP): pero $CMg < CMe$ por economías de escala → empresa pierde $(CMe - CMg) \cdot Q$. Requiere subsidio.
2. **$P = CMe$** (regulación de costo medio): $\pi_{econ} = 0$, sin subsidio; persiste $P > CMg$ (DWL pequeño).
3. **Monopolio sin regulación + impuesto de suma fija** ($T$ lump-sum): preserva eficiencia interna del monopolista; el Estado captura parte de la renta.

## Monopsonio (mención de clase)

Un solo **comprador** del factor (ej. único empleador). Análogo simétrico al monopolio:
- Curva de oferta del factor con pendiente positiva → costo marginal de contratar más alto que el salario promedio.
- Condición óptima: $VPMg_L = CMg_L$ (no $w$).
- Resultado: contrata **menos** trabajo y paga **menos** salario que en mercado competitivo.
- **Oligopsonio:** pocos compradores (mercado de granos en regiones aisladas).

## Equilibrio de Nash (oligopolio, juego 2×2)

Dado un juego en forma normal con jugadores $i = 1, 2$ y estrategias $s_i$:
$$s^* = (s_1^*, s_2^*) \text{ es Nash si: } u_i(s_i^*, s_{-i}^*) \geq u_i(s_i, s_{-i}^*) \quad \forall s_i, \forall i$$

**Cómo identificarlo:** marcar la mejor respuesta de cada jugador a cada estrategia del otro; el casillero con doble marca es el equilibrio.

**Dilema del prisionero:** la estrategia dominante (cooperar / desviarse) lleva a un Nash que es **Pareto-inferior** al resultado cooperativo. Por eso los cárteles son inestables sin enforcement.

## Variables
- $P$: precio; $Q$: cantidad
- $\varepsilon$: elasticidad precio de la demanda (en módulo)
- $I$: ingreso total; $IMg$: ingreso marginal
- $CMg$: costo marginal; $CMe$: costo medio
