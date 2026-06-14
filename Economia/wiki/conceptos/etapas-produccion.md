---
tags: [unit-02, micro]
---

## Definición

En el corto plazo, la producción se divide en **tres etapas** según el comportamiento del $PMe_L$ y el $PMg_L$:

| Etapa | Definición | Diagnóstico |
|---|---|---|
| **I** | $PMe_L$ creciente, $PMg > PMe$ | Subóptima (no se aprovecha la especialización todavía) |
| **II** | $PMe_L$ decreciente, pero $PMg > 0$ | **Zona racional** — la empresa siempre opera aquí |
| **III** | $PMg < 0$ | Irracional (agregar $L$ reduce $Q$) |

## Fronteras

- **Etapa I → II:** en el **máximo del $PMe$** (donde $PMg = PMe$).
- **Etapa II → III:** en el **máximo del $PT$** (donde $PMg = 0$).

## Intuición / Por qué importa

- En **Etapa I** la planta está sub-utilizada: contratar otro trabajador eleva el promedio. Conviene seguir contratando.
- En **Etapa II** los rendimientos marginales son decrecientes pero positivos: cada trabajador suma algo. Es la zona donde se decide cuánto producir según el precio.
- En **Etapa III** se está saturado: el último trabajador estorba más de lo que aporta. Despedir mejora la producción. Nunca racional.

Es un tema **muy frecuente en parciales**: dado un cuadro $L$ vs $Q$, identificar las etapas o el rango racional.

## Ejemplo

| $L$ | $Q$ | $PMe$ | $PMg$ | Etapa |
|---|---|---|---|---|
| 1 | 10 | 10.0 | — | I |
| 2 | 25 | 12.5 | 15 | I |
| 3 | 35 | 11.7 | 10 | II |
| 4 | 40 | 10.0 | 5 | II |
| 5 | 42 | 8.4 | 2 | II |
| 6 | 42 | 7.0 | 0 | II/III (frontera) |
| 7 | 40 | 5.7 | -2 | III |

Máximo del $PMe$: cerca de $L=2$ → frontera I/II.
Máximo del $PT$: $L=6$ → frontera II/III.
Zona racional: $L \in [3, 6]$.

## Errores comunes / Distinciones

- "Etapa II es la racional" no significa que la empresa siempre produzca en cualquier punto de la Etapa II — significa que el óptimo está dentro. Para encontrarlo: $IMg = CMg$.
- En **Etapa III** sigue siendo Q > 0; el problema no es "no producir", sino que **menos $L$ produce más**.
- La frontera Etapa I → II es el **máximo del $PMe$**, no donde $PMg$ es máximo.


## Gráfico

![[producto-total-marginal-medio.svg]]
## Relacionado con
- [[productividad-marginal]]
- [[productividad-media]]
- [[rendimientos-marginales-decrecientes]]
- [[funcion-produccion]]
- [[regla-IMg-CMg]]
