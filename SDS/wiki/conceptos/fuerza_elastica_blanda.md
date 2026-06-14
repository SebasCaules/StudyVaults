---
tipo: concepto
tags:
- tp4
- dinamica-molecular
actualizado: 2026-05-06
---

# Fuerza elástica blanda (contacto suave)

Modelo de interacción usado en [[tps/TP4]] Sistema 2 para colisiones por DM con paso temporal.

## Fórmula

```
Fᵢⱼ = -k · ξ · eᵢⱼ
```

Donde:
- `ξ = rᵢ + rⱼ - |xᵢ - xⱼ|` — superposición de los radios (positiva si las partículas están "interpenetradas").
- `eᵢⱼ = (xᵢ - xⱼ) / |xᵢ - xⱼ|` — versor que apunta de j a i.
- `k` — constante elástica. Valor de referencia en TP4: **10³ N/m**.
- La fuerza está definida **solo si ξ > 0**. Si ξ ≤ 0 (sin contacto), F = 0.

Es un resorte unilateral: solo empuja al separarse.

## Tercera ley

`Fⱼᵢ = -Fᵢⱼ`. Calcular una vez por par.

## Versión con obstáculo / pared

- **Obstáculo central** (radio r₀, fijo en el origen): xⱼ = 0, rⱼ = r₀. Fuerza solo sobre la partícula i.
- **Borde circular** (radio interior R_int = R - r): cuando |xᵢ| > R - rᵢ, hay superposición con la pared. Definir ξ_w = |xᵢ| - (R - rᵢ); si ξ_w > 0, F = -k · ξ_w · (xᵢ / |xᵢ|).

## Implicancias para el integrador

- F es **continua** (mientras ξ > 0). Funciona con cualquier integrador de DM clásico.
- Pero F tiene **discontinuidad de derivada** en ξ = 0 (al entrar/salir del contacto). Esto puede afectar integradores de orden alto (Gear) si el dt es comparable al tiempo de contacto.
- **Tiempo de contacto** característico: τ ≈ π · √(m/k) (medio período de un resorte simple).

## Detección de "primer dt de contacto"

Para Cfc en TP4 1.2: necesitamos contar **una vez por contacto**, no en cada dt mientras dura.

Implementación típica:

```java
class Particle {
    boolean enContactoConObstaculo = false;
    int state;  // FRESH / USED
}

// En cada paso, después de calcular ξ con el obstáculo:
if (xi_obs > 0) {
    if (!p.enContactoConObstaculo) {
        // primer dt del contacto
        p.enContactoConObstaculo = true;
        if (p.state == FRESH) {
            p.state = USED;
            cfc[currentStep]++;     // contar SOLO acá
        }
    }
} else {
    p.enContactoConObstaculo = false;
}
```

## Validación

- Energía total = cinética + potencial elástico. La potencial elástica acumulada de pares en contacto es Σ ½·k·ξ².
- Graficar E(t): debe oscilar/conservarse. Si deriva, dt es muy grande.
