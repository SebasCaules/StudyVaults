---
tipo: concepto
tags:
- tp4
- oscilador
- analitico
fuentes:
- "fuentes/teoria_4"
- "fuentes/tp4_enunciado"
actualizado: 2026-05-07
---

# Oscilador puntual amortiguado (TP4 Sistema 1)

Sistema con solución analítica usado en [[tps/TP4]] Sistema 1 para evaluar el error de los [[conceptos/integradores]]. Parámetros y CI definidos en la **diapositiva 36 de la teórica 4**.

## Ecuación de movimiento

```
F = m·a = m·r₂ = -k·r - γ·r₁
```

En notación clásica: `m·ẍ + γ·ẋ + k·x = 0`

Equivalente a: `ẍ + 2·ζ·ω₀·ẋ + ω₀²·x = 0` con `ω₀² = k/m`, `ζ = γ/(2·m·ω₀)`.

## Parámetros del TP4 (slide 36)

| Símbolo | Valor | Unidad |
|---------|-------|--------|
| **m** | 70 | kg |
| **k** | 10⁴ | N/m |
| **γ** | 100 | kg/s |
| **t_f** | 5 | s |

## Condiciones iniciales (slide 36)

```
r(t=0) = 1 m
v(t=0) = -A · γ / (2m)  m/s
```

Con A = 1 m (la amplitud inicial).

⇒ v(0) = -100 / (2·70) = **-100/140 ≈ -0.7143 m/s**

## Solución analítica (slide 36)

```
r(t) = A · exp(-(γ/2m)·t) · cos( ((k/m) - γ²/(4m²))^0.5 · t )
```

Con los valores del TP4:

- γ/(2m) = 100/140 ≈ **0.7143 s⁻¹** (factor de decaimiento)
- k/m = 10⁴/70 ≈ **142.86 s⁻²**
- γ²/(4m²) = 10⁴/19600 ≈ **0.5102 s⁻²**
- ω_d = √(k/m - γ²/4m²) = √(142.86 - 0.51) ≈ **√142.35 ≈ 11.93 rad/s**

⇒ período de oscilación T = 2π/ω_d ≈ **0.5266 s**.

⇒ en t_f = 5 s caben aprox. **9.5 oscilaciones**.

## Régimen subamortiguado

ζ = γ/(2·m·ω₀) con ω₀ = √(k/m) ≈ 11.95 rad/s ⇒ ζ = 100 / (140·11.95) ≈ **0.0598** ≪ 1 ⇒ **claramente subamortiguado**.

La amplitud cae como `A·exp(-0.7143·t)`. En t = 5 s: factor `exp(-3.57) ≈ 0.0282` ⇒ la amplitud decae a ~2.8% del inicial.

## Implementación de la fuerza

```python
def fuerza(r, v):
    return -k*r - gamma*v
```

Es F(r, v) — depende de posición Y velocidad. Esto afecta:
- **Verlet original**: necesita variante (velocity Verlet o Beeman) para manejar F(v).
- **Beeman**: usa la versión **predictor-corrector** (slide 20) con predicción de v(t+Δt).
- **[[metodos/gear_predictor_corrector|Gear]] orden 5**: usar **α₀ = 3/16** (tabla para fuerzas con dependencia de v).

## Inicialización de derivadas para Gear (slide 30 adaptado)

Para F = -k·r - γ·v, derivando recursivamente:

```
r₂ = -(k/m)·r - (γ/m)·r₁
r₃ = -(k/m)·r₁ - (γ/m)·r₂
r₄ = -(k/m)·r₂ - (γ/m)·r₃
r₅ = -(k/m)·r₃ - (γ/m)·r₄
```

Evaluadas en t=0 con r(0)=1, r₁(0) = v(0) = -γ/(2m).

## Validación numérica

ECM contra solución analítica, en función de dt, en escala log-log. Pendientes esperadas:
- Euler: 2 (orden 1)
- Verlet / Beeman / Velocity-Verlet: 4 (orden 2)
- Gear orden 5: 10 (orden 5)

⚠️ Para dt muy chicos: piso por error de redondeo (precisión doble ≈ 10⁻¹⁵).

Ejemplo de gráfico esperado: slide 37 muestra Analítica vs Euler-PC Modified, Verlet, Gear PC, todas indistinguibles a escala completa pero con diferencias visibles en zoom (slide derecho).

## Para la presentación (TP4)

⚠️ El enunciado dice: "Para el sistema 1 solo deben presentarse los **resultados** ... en la menor cantidad posible de diapositivas (~2) (duración total < 1 minuto) y debe ubicarse antes de la presentación del sistema (2)."

Estrategia: dos slides — (1) gráfico ECM(dt) en log-log con las 4 curvas + (2) conclusión "Gear orden 5 es el más preciso". Sin entrar en ecuaciones ni implementación.
