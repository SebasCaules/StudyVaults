---
tags: [unit-05, macro]
aliases: [multiplicador keynesiano, multiplicador del gasto, k]
---

## Definición

**Multiplicador del gasto:** factor por el que se amplifica el efecto de un cambio autónomo del gasto sobre el producto. Un aumento de $\Delta G$ genera un aumento de $Y$ **mayor** que $\Delta G$.

## Fórmula

$$k = \frac{1}{1 - PMC} = \frac{1}{PMS}$$

Donde:
- $k$: multiplicador keynesiano del gasto
- $PMC$: propensión marginal a consumir ($0 < PMC < 1$)
- $PMS$: propensión marginal a ahorrar ($PMS = 1 - PMC$)

$$\Delta Y = k \cdot \Delta G$$

Donde:
- $\Delta Y$: variación del producto agregado
- $\Delta G$: variación autónoma del gasto público

## Lógica de la cadena

El primer gasto $\Delta G$ genera ingreso. Quien lo recibe consume una fracción $PMC$, que es ingreso para otro, que consume $PMC^2$, etc. Es una **serie geométrica**:

$$\Delta Y = \Delta G \cdot (1 + PMC + PMC^2 + \ldots) = \frac{\Delta G}{1 - PMC}$$

## Intuición / Por qué importa

Un **estímulo fiscal pequeño puede tener un efecto grande** sobre el producto (en CP y con capacidad ociosa). Es el argumento central keynesiano para el activismo fiscal.

## Ejemplo

$PMC = 0,8$ → $k = 1/(1-0,8) = 5$.
Un aumento de $G$ de 100 genera $\Delta Y = 5 \cdot 100 = 500$.

Cadena: $100 \to 80 \to 64 \to 51,2 \to \ldots$ Suma = 500.

## Multiplicador con impuestos (versión más realista)

Con impuestos proporcionales $T = tY$:

$$k = \frac{1}{1 - PMC \cdot (1 - t)}$$

Con economía abierta y propensión marginal a importar $PMM$:

$$k = \frac{1}{1 - PMC \cdot (1-t) + PMM}$$

## Errores comunes / Distinciones

- **Multiplicador de impuestos ≠ multiplicador de gasto.** El de $T$ es:
$$k_T = \frac{-PMC}{1 - PMC} \quad (\text{menor en valor absoluto que } k_G)$$
Razón: cuando bajan impuestos, parte del ingreso adicional se ahorra.
- **El multiplicador real es menor que el simple** por crowding out, importaciones, impuestos, etc.
- **Solo aplica con capacidad ociosa.** Si la economía está en pleno empleo, el aumento de $G$ se traduce en precios, no en producto.

## Relacionado con
- [[politica-fiscal]]
- [[demanda-agregada]]
- [[deficit-fiscal]]
