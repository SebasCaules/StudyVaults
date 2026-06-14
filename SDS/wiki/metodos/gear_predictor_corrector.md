---
tipo: metodo
tags:
- tp4
- integrador
- predictor-corrector
fuentes:
- "fuentes/teoria_4"
- "fuentes/biblio4_gear"
actualizado: 2026-05-07
---

# Gear predictor-corrector

Integrador **predictor-corrector** que mantiene las primeras q+1 derivadas de la posición: r, r₁, r₂, ..., r_q. Para orden 5 → r, r₁ (=v), r₂ (=a), r₃, r₄, r₅.

> Notación de la teórica: **r_q = d^q r / dt^q**.

## Estructura general (slides 21-22)

3 pasos por iteración:

1. **Predecir** (Taylor): avanzar todas las derivadas usando la serie de Taylor.
2. **Evaluar**: calcular la fuerza con las posiciones (y velocidades) predichas; obtener la aceleración "real" `a(t+Δt)`.
3. **Corregir**: combinar los valores predichos con la información nueva usando coeficientes α.

## 1) Predictor (slide 25)

Para orden 5:

```
r^p (t+Δt)   = r + r₁·Δt + r₂·Δt²/2! + r₃·Δt³/3! + r₄·Δt⁴/4! + r₅·Δt⁵/5!
r₁^p(t+Δt)   = r₁ + r₂·Δt + r₃·Δt²/2! + r₄·Δt³/3! + r₅·Δt⁴/4!
r₂^p(t+Δt)   = r₂ + r₃·Δt + r₄·Δt²/2! + r₅·Δt³/3!
r₃^p(t+Δt)   = r₃ + r₄·Δt + r₅·Δt²/2!
r₄^p(t+Δt)   = r₄ + r₅·Δt
r₅^p(t+Δt)   = r₅
```

(Cada derivada se actualiza con su propio Taylor truncado al orden disponible.)

## 2) Evaluar (slide 26)

Calcular la fuerza con las variables predichas → aceleración real `a(t+Δt)`. Definir el "delta de aceleración":

```
Δa  = a(t+Δt) - a^p(t+Δt) = r₂(t+Δt) - r₂^p(t+Δt)
ΔR2 = Δa · Δt² / 2!
```

## 3) Corrector (slide 27)

Para cada derivada q (de 0 a 5):

```
r_q^c · Δt^q / q! = r_q^p · Δt^q / q! + α_q · ΔR2
```

O despejado:

```
r_q^c = r_q^p + α_q · ΔR2 · q! / Δt^q
```

## Coeficientes α (slides 28, 29)

### Para fuerzas que dependen SOLO de las posiciones: r₂ = f(r)

| Orden | α₀ | α₁ | α₂ | α₃ | α₄ | α₅ |
|-------|------|---------|----|--------|------|------|
| 2 | 0 | 1 | 1 | — | — | — |
| 3 | 1/6 | 5/6 | 1 | 1/3 | — | — |
| 4 | 19/120 | 3/4 | 1 | 1/2 | 1/12 | — |
| **5** | **3/20** | **251/360** | **1** | **11/18** | **1/6** | **1/60** |

### Para fuerzas que dependen de posición Y velocidad: r₂ = f(r, r₁)

Cambian SOLO los α₀ de órdenes 4 y 5:

| Orden | α₀ | resto igual a la tabla anterior |
|-------|------|----------|
| 4 | **19/90** | (3/4, 1, 1/2, 1/12) |
| **5** | **3/16** | (251/360, 1, 11/18, 1/6, 1/60) |

## Caso TP4 Sistema 1: oscilador amortiguado

La fuerza es **F = -k·r - γ·v** ⇒ depende de velocidad ⇒ usar **α₀ = 3/16**.

⚠️ **Este es el coeficiente que aplica al TP4 Sistema 1.**

## Inicialización para fuerza elástica (slide 30)

Para una partícula con fuerza elástica F = m·r₂ = -k·(r - r⁰), las derivadas iniciales se obtienen analíticamente derivando la EDO:

```
r₂ = -(k/m) · (r - r⁰)
r₃ = -(k/m) · r₁
r₄ = -(k/m) · r₂ = (k/m)² · (r - r⁰)
r₅ = -(k/m) · r₃ = (k/m)² · r₁
```

Para el oscilador amortiguado del TP4 (F = -kr - γv), las derivadas se calculan análogamente derivando la EDO:

```
r₂ = -(k/m)·r - (γ/m)·r₁
r₃ = -(k/m)·r₁ - (γ/m)·r₂
r₄ = -(k/m)·r₂ - (γ/m)·r₃
r₅ = -(k/m)·r₃ - (γ/m)·r₄
```

(Recursivamente, cada derivada superior usa las anteriores ya calculadas.)

Para sistemas más complejos (ej. fuerza elástica blanda pareada), **inicializar las derivadas superiores en cero** es aceptable — el corrector las acomoda en pocos pasos.

## Pseudocódigo

```
inicializar r, r1=v, r2=a, r3, r4, r5     # ver "Inicialización"
factorial = [1, 1, 2, 6, 24, 120]

para cada paso:
    # 1) Predictor: Taylor en cada derivada
    rp[q] = sum_{k=q..5} r[k] * dt^(k-q) / fact(k-q)
    
    # 2) Evaluar
    a_real = F(rp[0], rp[1]) / m
    Delta_a = a_real - rp[2]
    DeltaR2 = Delta_a * dt² / 2
    
    # 3) Corregir con α (elegir tabla según F depende de v o no)
    para q en 0..5:
        r[q] = rp[q] + alpha[q] * DeltaR2 * factorial[q] / dt^q
```

## Orden y error

- Para orden 5, el error global en posición es **O(Δt⁵)**.
- ECM en log-log: pendiente ≈ 10 (porque ECM ~ error²) — la más empinada de los integradores del TP4.
- Para dt muy chicos aparece el piso del error de redondeo (precisión finita).

## Para TP4 Sistema 2

La fuerza elástica blanda Fᵢⱼ = -k·ξ·eᵢⱼ depende solo de **posiciones**. ⇒ Usar **α₀ = 3/20** si se elige Gear para el Sistema 2. Aunque Verlet/Beeman/Velocity-Verlet suelen alcanzar.

## Referencias

- Teorica_4 slides 21-30 → `raw/teoria/Teorica_4.pdf`
- `raw/teoria/Biblio4/GearPaper_1.pdf` — paper original de Gear.
- `raw/teoria/Biblio4/A Gear-like Predictor-Corrector Method for Brownian Dynamics Simulation.pdf`
