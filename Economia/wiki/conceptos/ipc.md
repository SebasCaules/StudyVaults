---
tags: [unit-05, macro]
aliases: [IPC, índice de precios al consumidor, Laspeyres]
---

## Definición

**Índice de Precios al Consumidor (IPC):** mide el costo de una **canasta fija** de bienes y servicios representativa del consumo de los hogares, con respecto a un año base. Es el indicador principal de la **inflación que enfrentan los consumidores**. Es un **índice de Laspeyres** (canasta del año base).

## Fórmula

$$IPC_t = \frac{\sum p_t^i \cdot q_0^i}{\sum p_0^i \cdot q_0^i} \times 100$$

Donde:
- $IPC_t$: índice de precios al consumidor del período $t$
- $q_0^i$: cantidad consumida del bien $i$ en el año base (canasta fija)
- $p_t^i$: precio del bien $i$ en el período actual
- $p_0^i$: precio del bien $i$ en el año base

Tasa de inflación derivada: $\pi = (IPC_t - IPC_{t-1})/IPC_{t-1} \times 100$.

## Intuición / Por qué importa

Es el indicador oficial de inflación. Se usa para:
- Ajustar **salarios, jubilaciones, contratos** (cláusulas de indexación).
- Diseñar **política monetaria** (objetivo de metas de inflación).
- Calcular **poder adquisitivo real** y **salario real**.
- Comparar **costo de vida** entre regiones.

## Ejemplo

Año 0: canasta = 5kg pan ($p=10$) + 2L leche ($p=20$) → costo = 90.
Año 1: pan a 15, leche a 28 → mismo $q_0$: $5 \cdot 15 + 2 \cdot 28 = 131$.
$IPC_1 = 131/90 \times 100 = 145,6$. Inflación = 45,6%.

## Errores comunes / Distinciones

- **Sesgo de sustitución (al alza):** mantiene la canasta fija aunque los hogares sustituyan hacia bienes más baratos → sobreestima la inflación.
- **Sesgo de calidad:** no captura mejoras de calidad de los productos.
- **Sesgo de nuevos bienes:** los productos novedosos tardan en entrar a la canasta.
- **No es deflactor del PBI.** El IPC mide canasta de consumo (incluye importaciones, excluye inversión); el deflactor mide toda la producción interna.

## Relacionado con
- [[inflacion]]
- [[deflactor]]
- [[ipc-deflactor]]
- [[costos-inflacion]]
