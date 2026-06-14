---
tags: [unit-02, micro]
---

## Definición

**Productividad marginal del trabajo ($PMg_L$)**: cuánto aumenta el producto total al incorporar **una unidad adicional** del factor variable (trabajo), manteniendo los demás constantes. Es lo que aporta el último trabajador.

## Fórmula

$$PMg_L = \frac{\Delta Q}{\Delta L} = \frac{\partial Q}{\partial L}$$

Donde:
- $PMg_L$: productividad marginal del trabajo
- $Q$: producto total (output)
- $L$: cantidad de trabajo

Si $Q = F(\bar K, L)$, $PMg_L$ es la derivada parcial.

## Forma típica

En el corto plazo $PMg_L$ tiene **forma de U invertida**:
1. **Sube** al inicio (especialización: cada nuevo trabajador suma más que el anterior).
2. **Llega a un máximo**.
3. **Baja** por la **[[rendimientos-marginales-decrecientes|ley de rendimientos marginales decrecientes]]**: con $K$ fijo, agregar más $L$ congestiona el lugar.
4. Eventualmente puede llegar a ser **negativa** (Etapa III).

## Relaciones clave

- **Vínculo con $PMe$:** $PMg$ corta a $PMe$ en su **máximo**. Cuando $PMg > PMe$, el promedio sube; cuando $PMg < PMe$, el promedio baja.
- **Vínculo con $PT$:** cuando $PMg = 0$, $PT$ está en su **máximo**.
- **Vínculo con $CMg$:** $CMg = w / PMg_L$. Cuanto mayor el $PMg$, menor el $CMg$. ($CMg$: costo marginal; $w$: salario unitario del trabajo).

## Intuición / Por qué importa

Es la conexión directa entre **producción y costos**: las curvas de costos en CP heredan su forma de las curvas de productividad. La Etapa II ([[etapas-produccion|zona racional]]) está definida por $PMg > 0$ y $PMg < PMe$.

## Ejemplo

| $L$ | $Q$ | $PMg_L$ |
|---|---|---|
| 1 | 10 | 10 |
| 2 | 25 | 15 |
| 3 | 35 | 10 |
| 4 | 40 | 5 |
| 5 | 42 | 2 |
| 6 | 42 | 0 |
| 7 | 40 | -2 |

A partir del trabajador 3 hay rendimientos marginales decrecientes; el trabajador 7 es claramente irracional (reduce $Q$).

## Errores comunes / Distinciones

- No confundir con $PMe$ (productividad media — promedio).
- $PMg < 0$ no significa "no producir": significa que llegaste a Etapa III y conviene **bajar** $L$.
- "Decreciente" no implica "negativo": $PMg$ puede caer pero seguir siendo positivo.


## Gráfico

![[producto-total-marginal-medio.svg]]
## Relacionado con
- [[productividad-media]]
- [[funcion-produccion]]
- [[rendimientos-marginales-decrecientes]]
- [[etapas-produccion]]
- [[costo-marginal]]
