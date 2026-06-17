---
tags: [unit-05, macro]
aliases: [PBI nominal, PBI real, deflactar]
---

## Definición

- **PBI nominal:** valor del producto a **precios corrientes** del período. Mezcla efectos de cantidad y precio.
- **PBI real:** valor del producto a **precios de un año base fijo**. Aísla el componente de **cantidades**.

## Fórmula

$$PBI_{nominal} = \sum p_t^i \cdot q_t^i \qquad PBI_{real} = \sum p_{base}^i \cdot q_t^i$$

Donde:
- $p_t^i$: precio del bien $i$ en el período corriente $t$
- $p_{base}^i$: precio del bien $i$ en el año base
- $q_t^i$: cantidad producida del bien $i$ en el período $t$

Para deflactar:

$$PBI_{real} = \frac{PBI_{nominal}}{\text{Deflactor}/100}$$

## Intuición / Por qué importa

Si el PBI nominal sube 30% en un año pero los precios subieron 28%, el crecimiento **real** fue solo 2%. Sin esta corrección no se puede saber si la economía produce más o si solo subieron los precios. Crítico en países con alta inflación como Argentina.

## Ejemplo

Año base 2020. En 2024: $PBI_{nom} =$ \$1.000, $PBI_{real} =$ \$400 (a precios 2020). Entonces el deflactor es $1000/400 \times 100 = 250$ → los precios subieron 150% acumulado desde 2020.

## Errores comunes / Distinciones

- **Tasa de crecimiento real ≠ nominal.** Para crecimiento real hay que usar PBI real o restar inflación de la nominal (con cuidado en tasas altas — usar fórmula exacta).
- **El deflactor difiere del IPC.** El deflactor es Paasche (canasta variable) y cubre toda la producción; el IPC es Laspeyres (canasta fija) y solo bienes de consumo.

## Relacionado con
- [[pbi]]
- [[deflactor]]
- [[ipc]]
- [[ipc-deflactor]]
- [[inflacion]]
