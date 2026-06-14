---
tipo: concepto
tags:
- observable
- vicsek
- orden
actualizado: 2026-05-06
---

# Polarización vₐ

Parámetro de orden global del [[conceptos/vicsek|modelo de Vicsek]].

```
vₐ(t) = (1 / N·v) · |Σᵢ vᵢ(t)|
```

- **vₐ → 1**: todas las partículas alineadas (bandada perfecta).
- **vₐ → 0**: direcciones desordenadas (gas).
- Adimensional, en [0, 1].

## Cálculo del valor escalar

vₐ(t) tiene fluctuaciones; el valor reportado es el **promedio temporal en el estado estacionario**:

```
⟨vₐ⟩ = (1/T_window) · ∫_{t_eq}^{t_eq + T_window} vₐ(t) dt
```

- Hay que **identificar el tiempo de equilibrio t_eq** observando la serie temporal.
- La ventana de promediado **debe verse en el gráfico** (correción TP2).
- Promedio adicional sobre realizaciones independientes (semillas distintas) → barra de error.

## Curva característica

⟨vₐ⟩(η) decrece monótonamente con η. La forma es la firma de la transición de fase de Vicsek.

## Errores típicos (corrección TP2)

- Empezar a promediar muy tarde (t = 500 fue señalado como tarde para TP2).
- No mostrar la ventana en el gráfico.
- Confundir "asintótico" con "valor estacionario".
