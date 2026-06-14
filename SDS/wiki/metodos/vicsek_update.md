---
tipo: metodo
tags:
- tp2
- vicsek
actualizado: 2026-05-06
---

# Update de Vicsek (paso por partícula)

Algoritmo del paso de actualización en el [[conceptos/vicsek|modelo de Vicsek]] off-lattice.

## Pseudocódigo

```
para cada partícula i:
    vecinos = partículas j con dist_periódica(i, j) ≤ rₒ   # incluye i misma
    sum_sin = Σⱼ sin(θⱼ)
    sum_cos = Σⱼ cos(θⱼ)
    θ_avg = atan2(sum_sin, sum_cos)               # ⚠️ atan2, NO atan
    Δθ = U(-η/2, +η/2)
    θᵢ_new = θ_avg + Δθ

aplicar todos los θᵢ_new en simultáneo  (synchronous update)
para cada partícula i:
    xᵢ += v · cos(θᵢ_new) · dt
    yᵢ += v · sin(θᵢ_new) · dt
    aplicar BC periódicas: xᵢ = xᵢ mod L, yᵢ = yᵢ mod L
```

## Cuidados

### Synchronous vs asynchronous

Vicsek estándar es **synchronous**: todas las partículas calculan su nuevo θ usando los θ viejos de todos los vecinos, y recién después se aplican los cambios. Implementación típica: doble buffer (`θ_old[]`, `θ_new[]`).

### Promedio de ángulos

Hacer `mean(θ)` directamente da basura cuando los ángulos cruzan ±π. Hay que promediar en componentes:

```
θ_avg = atan2(mean(sin(θ)), mean(cos(θ)))
```

`atan2` devuelve el ángulo en (-π, π] correctamente para todos los cuadrantes. `atan` solo cubre (-π/2, π/2) y pierde signo.

### Notación temporal

`θ(t+Δt)`, no `θ(t+1)`. Aunque Δt = 1 en el TP2, escribirlo como `t+1` es **incorrecto** en una entrega académica (corrección TP2 D5).

### Vecinos en caja periódica

Distancia con imagen mínima:
```
dx = xⱼ - xᵢ
if dx > L/2:  dx -= L
if dx < -L/2: dx += L
(análogo para dy)
dist = √(dx² + dy²)
```

Para vecinos eficientes, [[conceptos/cell_index_method]].

### Inclusión propia

La partícula i se cuenta a sí misma en el promedio (es estándar del modelo). Si N_vecinos = 1 (solo ella misma), θ_avg = θᵢ.

## Líder (escenarios B y C de TP2)

El líder NO ejecuta este update: su θ está predefinido (fijo o circular). Pero **sí aparece en la lista de vecinos** cuando otras partículas calculan su promedio.
