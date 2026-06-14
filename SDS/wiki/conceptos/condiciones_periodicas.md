---
tipo: concepto
tags:
- tp2
actualizado: 2026-05-06
---

# Condiciones de contorno periódicas (PBC)

La caja se "envuelve": una partícula que sale por un borde reaparece por el opuesto. Equivalente a teselar el plano con copias del dominio.

## Avance

Después del paso de movimiento:
```
x = ((x mod L) + L) mod L      # garantiza x ∈ [0, L)
y = ((y mod L) + L) mod L
```

(Cuidado con `mod` de números negativos en algunos lenguajes — en Java `%` puede dar negativos, por eso el doble mod.)

## Distancia con imagen mínima

Para vecinos / fuerza:
```
dx = xⱼ - xᵢ
if dx >  L/2:  dx -= L
if dx < -L/2:  dx += L
(idem dy)
dist² = dx² + dy²
```

Asume rₒ < L/2 (el cutoff de interacción es menor que medio lado de la caja). Si no, hay que considerar más imágenes.

## Uso en los TPs

- **TP2** (Vicsek): caja L=10 con PBC.
- **TP3 / TP4** (recinto circular): NO usan PBC. Tienen pared circular.
