---
tipo: concepto
tags:
- off-lattice
- flocking
- autopropulsados
fuentes:
- "fuentes/teoria_2"
- "fuentes/tp2_enunciado"
actualizado: 2026-05-06
---

# Modelo de Vicsek (Off-Lattice flocking)

Modelo mínimo de bandadas/flocking propuesto por Vicsek et al. (1995) para estudiar la transición de fase en sistemas de partículas autopropulsadas con interacciones de alineamiento local.

## Definición

- **N** partículas en una caja **L×L** con condiciones periódicas.
- Cada partícula tiene posición xᵢ y velocidad de **módulo constante v**, con dirección θᵢ.
- En cada paso Δt:
  1. **Alinear**: cada partícula adopta el ángulo promedio de los vecinos en un radio rₒ (incluyéndose).
  2. **Ruido**: sumar Δθ ~ U(-η/2, +η/2).
  3. **Mover**: xᵢ(t+Δt) = xᵢ(t) + vᵢ(t)·Δt (con BC periódicas).

```
θᵢ(t+Δt) = ⟨θ⟩ᵣₒ + Δθ          con  Δθ ~ U(-η/2, +η/2)
xᵢ(t+Δt) = xᵢ(t) + v·(cos θᵢ, sin θᵢ)·Δt
```

> **Cuidado** con calcular ⟨θ⟩: NO se puede hacer media aritmética de ángulos. Se promedian las componentes cartesianas y se usa **`atan2(⟨sin θ⟩, ⟨cos θ⟩)`**. Usar `atan` solo da rangos parciales (ver corrección [[tps/TP2]]).

## Parámetros

| Símbolo | Significado | Notas |
|---------|-------------|-------|
| L | lado de la caja | TP2: L=10 |
| ρ | densidad N/L² | TP2: ρ=4 ⇒ N=400 |
| v | módulo de velocidad | TP2: 0.03 |
| rₒ | radio de interacción | TP2: 1.0 |
| η | intensidad del ruido | parámetro de control |
| Δt | paso temporal | TP2: 1.0 |

## Observable: [[conceptos/polarizacion_va|polarización vₐ]]

vₐ = (1 / N·v) · |Σᵢ vᵢ|

Va de 0 (desorden) a 1 (alineación total).

## Transición de fase

Al variar η a densidad fija, vₐ pasa de ~1 (orden) a ~0 (desorden). Vicsek argumenta que es una transición de fase de tipo continuo. La densidad ρ y el tamaño L también afectan la transición (efectos de tamaño finito).

## Implementación práctica

- Usar [[conceptos/cell_index_method]] para vecinos: O(N) por paso en vez de O(N²).
- Caja periódica: aplicar `mod L` después del avance; al buscar vecinos, considerar imágenes a distancia ≤ rₒ.
- Inicialización: posiciones uniformes en [0,L)², ángulos uniformes en [0, 2π).

## Variantes (TP2)

- **A**: estándar.
- **B**: una partícula líder con θ_lead constante (no se actualiza).
- **C**: líder en trayectoria circular: posición `(xc + R·cos(ωt), yc + R·sin(ωt))`, velocidad tangencial. ω se elige tal que v_tangencial ≈ v.

El líder NO promedia con sus vecinos pero SÍ aparece en el promedio que hacen sus vecinos.

## Referencia

Vicsek, T., Czirók, A., Ben-Jacob, E., Cohen, I., & Shochet, O. (1995). *Novel type of phase transition in a system of self-driven particles*. Physical Review Letters, 75(6), 1226. → `raw/teoria/Biblio2/NovelTypePhaseTransition2.pdf`
