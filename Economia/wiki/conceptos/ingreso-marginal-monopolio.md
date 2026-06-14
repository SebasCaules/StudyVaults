---
tags: [unit-04, micro]
---

## Definición

**Ingreso marginal del monopolista (IMg):** ingreso extra por vender una unidad adicional. Como la demanda tiene **pendiente negativa**, vender una unidad más obliga a bajar el precio en *todas* las unidades vendidas — entonces:

$$IMg < P$$

## Fórmula

Por la regla del producto:
$$IMg = \frac{dI}{dQ} = P + Q \cdot \frac{dP}{dQ}$$

Donde:
- $IMg$: ingreso marginal
- $I$: ingreso total ($P \cdot Q$)
- $P$: precio
- $Q$: cantidad
- $dP/dQ$: pendiente de la demanda inversa (negativa)

Como $dP/dQ < 0$, $IMg < P$.

**Para demanda lineal** $P = a - bQ$:
$$I = (a - bQ) \cdot Q = aQ - bQ^2$$
$$\boxed{IMg = a - 2bQ}$$

Donde:
- $a$: ordenada al origen de la demanda
- $b$: pendiente (en módulo) de la demanda lineal

**Misma ordenada al origen ($a$) pero el doble de pendiente** que la demanda. Casi garantizado en parcial.

**Relación con elasticidad:**
$$IMg = P\left(1 - \frac{1}{|\varepsilon|}\right)$$

Donde:
- $\varepsilon$: elasticidad precio de la demanda (en módulo)

## Intuición / Por qué importa

Cuando el monopolista vende una unidad adicional:
- **Efecto cantidad:** $+P$ (ingresa el precio de esa unidad).
- **Efecto precio:** $Q \cdot dP/dQ < 0$ (las unidades anteriores ahora se venden más barato).

El IMg es la suma neta — siempre menor que $P$.

**Corolario crítico:** en demanda lineal, $IMg = 0$ cuando $|\varepsilon| = 1$ (punto medio). En la zona inelástica ($|\varepsilon| < 1$), $IMg < 0$. Por eso **el monopolista nunca produce en el tramo inelástico** — bajar $Q$ aumenta el ingreso.

## Ejemplo

Demanda $P = 40 - Q$. Costo $C(Q) = 50 + Q^2$ → $CMg = 2Q$.

$$IMg = 40 - 2Q$$

Igualando $IMg = CMg$:
$$40 - 2Q = 2Q \Rightarrow Q^* = 10$$

Subiendo a la demanda: $P^* = 40 - 10 = 30$. Verificá: $IMg(10) = 20 < P^*(10) = 30$. ✓

## Errores comunes / Distinciones

- **Calcular $IMg = P$ en monopolio.** Solo aplica en CP. En monopolio: $IMg < P$ siempre.
- **Olvidar la "doble pendiente" en demanda lineal.** Si $P = 20 - 0.5Q$, entonces $IMg = 20 - Q$, no $20 - 0.5Q$.
- **Asumir que $IMg \geq 0$.** En zona inelástica $IMg$ es negativo. Si te da $Q^*$ donde $IMg < 0$, hay error.
- **Confundir $IMg$ con $IMe = P$ (ingreso medio).** $IMe = I/Q = P$ siempre.


## Gráfico

![[monopolio-equilibrio.svg]]
## Relacionado con
- [[monopolio]]
- [[indice-lerner]]
- [[empresa-precio-aceptante]]
- [[elasticidad-precio-demanda]]
