---
tipo: metodo
tags:
- tp3
- edmd
actualizado: 2026-05-06
---

# Tiempos de colisión en EDMD

Fórmulas para calcular el tiempo `tc` hasta la próxima colisión, dada la posición y velocidad actuales.

## Partícula–partícula (PP)

Partículas i, j con posiciones rᵢ, rⱼ, velocidades vᵢ, vⱼ, radios rᵢ + rⱼ = σ.

```
Δr = rⱼ - rᵢ
Δv = vⱼ - vᵢ
ΔvΔr = Δv · Δr        (producto escalar)
ΔrΔr = |Δr|²
ΔvΔv = |Δv|²
d = (ΔvΔr)² - ΔvΔv · (ΔrΔr - σ²)

Si ΔvΔr ≥ 0  →  no se aproximan, tc = ∞.
Si d < 0     →  no llegan a chocar, tc = ∞.
En otro caso:
    tc = -(ΔvΔr + √d) / ΔvΔv
```

## Partícula–obstáculo fijo (centro en origen)

Igual que PP pero con la "otra partícula" en el origen y velocidad nula:

```
Δr = -rᵢ           (vector hacia el origen, signo según convención)
Δv = -vᵢ
```

O equivalente, usando rᵢ y vᵢ directamente con σ = rᵢ + r₀:

```
v·r = vᵢ · rᵢ
Si v·r ≥ 0  →  tc = ∞ (se aleja del origen).
d = (v·r)² - |v|² · (|r|² - σ²)
tc = -(v·r + √d) / |v|²    si d ≥ 0
```

## Partícula–borde circular (recinto de radio R, centro origen)

La partícula está dentro y golpea desde adentro. σ_eff = R - rᵢ.

```
v·r = vᵢ · rᵢ
d = (v·r)² - |v|² · (|r|² - σ_eff²)
tc = (-v·r + √d) / |v|²
```

⚠️ **Sin filtrar por signo de v·r**. Esto es la decisión clave del TP3 G05: aunque v·r < 0 (partícula se acerca al centro), eventualmente va a salir y golpear el borde — calcular ese tiempo igual y encolarlo. Si no se hace, una partícula que pase cerca del obstáculo sin tocarlo puede quedar sin eventos programados.

Ver [[tps/TP3]] sección "Decisiones clave" y `raw/tps_pasados/TP3/PROJECT.md`.

## Notas numéricas

- Cuando d ≈ 0: la trayectoria es tangente. Numéricamente puede dar tc imaginario por error de redondeo. Tratar como "no chocan".
- σ se compara con `|Δr|² - σ²`. Si las partículas ya están solapadas (`|Δr|² < σ²` por error numérico), la fórmula da problemas. Soluciones: chequeo previo, o pequeño ε de tolerancia.
