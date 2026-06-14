---
tipo: metodo
tags:
- tp3
- edmd
actualizado: 2026-05-06
---

# Colisión elástica partícula-partícula (masas iguales)

Operador que actualiza velocidades cuando dos partículas chocan en EDMD.

## Fórmulas

Sean i, j las partículas en contacto (|rⱼ - rᵢ| = σ).

```
Δr = rⱼ - rᵢ
Δv = vⱼ - vᵢ
J = -2 · m_i · m_j / (m_i + m_j) · (Δv · Δr) / σ²
```

Para masas iguales m_i = m_j = m:
```
J = -m · (Δv · Δr) / σ²
```

Aplicar el impulso a lo largo de la línea de centros (eᵢⱼ = Δr/σ):
```
vᵢ_new = vᵢ - (J/m) · eᵢⱼ
vⱼ_new = vⱼ + (J/m) · eᵢⱼ
```

## Conservación

- **Momento lineal**: conservado (vᵢ_new + vⱼ_new = vᵢ + vⱼ para masas iguales).
- **Energía cinética**: conservada (colisión elástica).
- **Módulo individual**: ⚠️ NO se conserva en general. Lo que se conserva es la suma de KE.

## Colisión con objeto fijo (obstáculo, pared)

El objeto tiene masa infinita ⇒ no se mueve. La partícula refleja especularmente:

```
n = (rᵢ - r_obj) / |rᵢ - r_obj|        # normal al punto de contacto
v_n = vᵢ · n                            # componente normal
vᵢ_new = vᵢ - 2·v_n·n
```

**Sí** se conserva |vᵢ| en este caso (porque la pared no se mueve).

## Cambios de estado (TP3, TP4)

Junto con la actualización de velocidad, se aplica el cambio de estado:
- Colisión con obstáculo central: FRESH → USED.
- Colisión con borde circular: USED → FRESH.

Las funciones de colisión retornan `boolean` indicando si hubo cambio de estado, para que el caller actualice contadores (ej. Cfc).
