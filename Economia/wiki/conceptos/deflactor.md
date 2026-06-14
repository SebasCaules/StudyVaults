---
tags: [unit-05, macro]
aliases: [deflactor del PBI, deflactor implícito]
---

## Definición

**Deflactor del PBI:** índice de precios de **toda la producción interna**. Mide cuánto cambiaron los precios entre el año actual y un año base, pesando con la **canasta del año actual** (índice de Paasche).

## Fórmula

$$\text{Deflactor}_t = \frac{PBI_{nominal}}{PBI_{real}} \times 100 = \frac{\sum p_t^i \cdot q_t^i}{\sum p_{base}^i \cdot q_t^i} \times 100$$

Donde:
- $PBI_{nominal}$: producto a precios corrientes del período
- $PBI_{real}$: producto a precios del año base
- $p_t^i$: precio del bien $i$ en el período $t$
- $p_{base}^i$: precio del bien $i$ en el año base
- $q_t^i$: cantidad producida del bien $i$ en el período $t$

## Intuición / Por qué importa

Es el deflactor que efectivamente se usa para pasar de PBI nominal a real. A diferencia del IPC, **cubre todos los bienes finales producidos en el país** (incluye inversión, exportaciones; excluye importaciones). Da una señal más amplia de la inflación general que enfrenta la economía como sistema productivo.

## Ejemplo

En 2024: $PBI_{nom} = 800$, $PBI_{real}$ (a precios 2020) $= 500$. Deflactor = $800/500 \times 100 = 160$. Los precios subieron 60% acumulado desde 2020.

## Errores comunes / Distinciones

| | IPC (Laspeyres) | Deflactor (Paasche) |
|---|---|---|
| Canasta | Fija (año base) | Variable (actual) |
| Cobertura | Bienes de consumo | Toda la producción interna |
| Sesgo | Al alza (no captura sustitución) | A la baja |
| Frecuencia | Mensual | Trimestral |

- El deflactor **excluye importaciones** (cubre solo lo producido localmente); el IPC sí incluye bienes importados de consumo.
- En economías abiertas con shocks de TC, IPC y deflactor pueden divergir.

## Relacionado con
- [[ipc]]
- [[ipc-deflactor]]
- [[pbi-nominal-vs-real]]
- [[inflacion]]
