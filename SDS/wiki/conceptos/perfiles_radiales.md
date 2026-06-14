---
tipo: concepto
tags:
- observable
- edmd
- tp3
- tp4
actualizado: 2026-05-06
---

# Perfiles radiales (TP3 1.4 / TP4 1.3)

Análisis del flujo de partículas frescas entrantes al obstáculo central, descompuesto por capas radiales concéntricas.

## Definiciones

- S: distancia radial al centro.
- Capas concéntricas de ancho **dS = 0.2 m** desde el obstáculo (S desde r₀ ≈ 1 hasta el borde).
- Para cada capa, considerar **solo partículas frescas** con velocidad radial **hacia el centro**: condición `xⱼ · vⱼ < 0` (Rⱼ · vⱼ < 0 si R es el vector posición desde el centro).
- Velocidad radial proyectada: `v_rⱼ = (xⱼ · vⱼ) / |xⱼ|`.

## Magnitudes

```
⟨ρᶠⁱⁿ⟩(S) = ⟨ N_partículas_frescas_entrantes_en_capa(S) ⟩ / Área(S)
⟨vᶠⁱⁿ⟩(S) = ⟨ promedio de v_r en esas partículas ⟩
Jᵢₙ(S)    = ⟨ρᶠⁱⁿ⟩(S) · |⟨vᶠⁱⁿ⟩(S)|
```

Área de la capa: `2π · S_centro · dS` (aproximación de capa delgada).

## Cómo se promedia

⟨·⟩ promedia sobre **todos los snapshots** del régimen estacionario y sobre **todas las realizaciones**.

⚠️ **Definir qué hace la fórmula si el contador de partículas en una capa es cero** (corrección TP3 D13: la fórmula de velocidad da indeterminada). Decisión típica: si N_capa = 0, ⟨v⟩ = 0 (o NaN excluido del promedio).

## Visualización (TP4 1.3)

- Una figura con **todos los N** en una sola curva por N, paleta gradual + **colorbar** (no leyenda categórica — corrección TP3).
- Detalle ampliado de **Jᵢₙ(S) en S ∈ [1.5, 5] m** para identificar el régimen distorsionado por el obstáculo.
- Capa cercana al obstáculo (S ≈ 2): graficar Jᵢₙ, ⟨ρᶠⁱⁿ⟩, ⟨vᶠⁱⁿ⟩ **en función de N** (1-2 figuras con doble eje y).

## Interpretación física

- Jᵢₙ(S) representa el **flujo entrante** por capa — partículas/(área·tiempo).
- En el régimen libre (lejos del obstáculo) debería tender a un valor constante derivado del gas ideal de partículas en MRU.
- Cerca del obstáculo (S → r₀ + r), aparece distorsión por el campo de partículas usadas que retornan.

## Conexión con J (capa S ≈ 2)

Jᵢₙ|S~2 multiplicado por la circunferencia 2π·(r₀ + r) ≈ 4π da una estimación de J.
