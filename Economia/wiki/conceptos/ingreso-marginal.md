---
tags: [unit-02, micro]
---

## Definición

**Ingreso marginal ($IMg$)**: incremento del ingreso total al vender una unidad adicional. Mide cuánto suma al ingreso la próxima unidad vendida.

## Fórmula

$$IMg = \frac{\Delta I}{\Delta Q} = \frac{dI}{dQ}$$

Donde:
- $IMg$: ingreso marginal (variación del ingreso por la unidad adicional)
- $I$: ingreso total
- $Q$: cantidad vendida

donde $I(Q) = P(Q) \cdot Q$.

Donde:
- $P(Q)$: precio en función de la cantidad (constante en CP, decreciente en monopolio)

## Casos clave por estructura de mercado

| Estructura | Demanda enfrentada | $IMg$ |
|---|---|---|
| **Competencia perfecta** | Horizontal a $P^*$ | $IMg = P$ (constante) |
| **Monopolio / oligopolio** | Pendiente negativa | $IMg < P$ y decreciente |

**En monopolio con demanda lineal $P = a - bQ$:**

$$I(Q) = aQ - bQ^2 \Rightarrow IMg = a - 2bQ$$

Donde:
- $a$: ordenada al origen de la demanda inversa (precio máximo de reserva)
- $b$: pendiente de la demanda inversa (en valor absoluto)

El $IMg$ tiene la **misma ordenada al origen** que la demanda y el **doble de pendiente** (negativa) — útil para gráficos.

## Intuición / Por qué importa

- En CP, vender una unidad más a precio constante: el ingreso sube en exactamente $P$. Por eso $IMg = P$.
- En monopolio, para vender una unidad más hay que **bajar el precio a todos los compradores**, no solo al marginal — por eso $IMg < P$ siempre.
- Combinado con $CMg$, da la regla universal de óptimo: [[regla-IMg-CMg]].

## Ejemplo

**Caso CP:** $P = 10$ constante. $I(Q) = 10Q$. $IMg = 10$ siempre.

**Caso monopolio:** $P = 100 - 2Q$. $I(Q) = 100Q - 2Q^2$. $IMg = 100 - 4Q$.
- En $Q = 10$: $P = 80$, $I = 800$, $IMg = 60$ → claramente $IMg < P$.

## Errores comunes / Distinciones

- En monopolio, **$IMg$ no es $P$** — error frecuente. Hay que derivar $I(Q)$.
- $IMg$ puede ser **negativo** en monopolio: ocurre en el tramo inelástico de la demanda (donde una baja de precio reduce el ingreso total). El monopolista **nunca opera ahí**.
- El $IMg$ corta al eje de cantidades en $Q = a/(2b)$ — la mitad del $Q$ donde la demanda corta el eje.

## Relacionado con
- [[costo-marginal]]
- [[regla-IMg-CMg]]
- [[beneficio-economico]]
- [[elasticidad-precio-demanda]]
- [[oferta-demanda]]
