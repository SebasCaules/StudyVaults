---
tags: [unit-01, unit-05, indices]
aliases: [IPC, deflactor, Laspeyres, Paasche]
---

## Dos índices, dos fórmulas

En macro se usan dos medidas distintas de "nivel de precios":

### IPC — Índice de Precios al Consumidor (Laspeyres)
$$IPC_t = \frac{\sum p_t^i \cdot q_0^i}{\sum p_0^i \cdot q_0^i} \cdot 100$$

Donde:
- $p_t^i$: precio del bien $i$ en el período corriente
- $p_0^i$: precio del bien $i$ en el año base
- $q_0^i$: cantidad consumida del bien $i$ en el año base

- **Canasta fija** del año base ($q_0$)
- Mide cuánto costaría hoy la canasta del pasado
- **Sesga al alza** (no captura sustitución hacia bienes más baratos)

### Deflactor del PBI (Paasche)
$$\text{Deflactor}_t = \frac{\sum p_t^i \cdot q_t^i}{\sum p_0^i \cdot q_t^i} \cdot 100 = \frac{PBI_{nom}}{PBI_{real}} \cdot 100$$

Donde:
- $q_t^i$: cantidad producida del bien $i$ en el período corriente (canasta variable)
- $PBI_{nom}$: PBI nominal (a precios corrientes)
- $PBI_{real}$: PBI real (a precios del año base)

- **Canasta variable** del año actual ($q_t$)
- Cubre todos los bienes producidos en el país (incluye inversión, exportaciones; excluye importaciones)
- **Sesga a la baja** (incorpora sustitución automáticamente)

## Usos

- **IPC**: medir inflación que enfrentan hogares; ajustar salarios, jubilaciones, contratos
- **Deflactor**: pasar PBI nominal a real; comparar crecimiento real entre años

## Precio real (deflactar)

$$P_{real} = P_{nom} \cdot \frac{IPC_{base}}{IPC_{actual}}$$

Donde:
- $P_{real}$: precio expresado en moneda del año base
- $P_{nom}$: precio nominal (en moneda corriente)
- $IPC_{base}$: IPC del año base de referencia
- $IPC_{actual}$: IPC del período del precio nominal

Útil para comparar poder adquisitivo entre períodos (ej. Ej 1 de GP1: nafta a precios de Jul-99).

## Inflación

$$\pi_t = \frac{IPC_t - IPC_{t-1}}{IPC_{t-1}} \cdot 100$$

## Relacionado con
- [[pbi]]
- [[inflacion]]
- [[tipo-de-cambio-real]]
