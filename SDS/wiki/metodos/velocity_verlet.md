---
tipo: metodo
tags:
- tp4
- integrador
- verlet
- symplectic
fuentes:
- "fuentes/teoria_4"
actualizado: 2026-05-07
---

# Velocity-Verlet

Variante de [[metodos/verlet_original|Verlet]] que provee **posiciones y velocidades en el mismo paso temporal** (a diferencia del Verlet original donde la velocidad va desfasada). Es un **symplectic integrator**: muy estable y preserva los volúmenes en el espacio de fases (slide 17).

## Esquema (slide 17)

```
r(t+Δt) = r(t) + Δt·v(t) + (Δt²/m)·f(t) + O(Δt³)
v(t+Δt) = v(t) + (Δt/2m)·[f(t) + f(t+Δt)] + O(Δt²)
```

## Implementación en dos sub-pasos

```
# Paso intermedio 1: medio paso de v con a(t)
v_half = v(t) + a(t)·Δt/2

# Paso completo de r usando v_half
r(t+Δt) = r(t) + v_half·Δt        # equivalente a la fórmula expandida

# Calcular fuerza nueva
a(t+Δt) = F(r(t+Δt)) / m

# Paso intermedio 2: completar v con a(t+Δt)
v(t+Δt) = v_half + a(t+Δt)·Δt/2
```

## Pseudocódigo

```python
a = F(r, v) / m

para cada paso:
    v_half = v + a * (dt/2)
    r = r + v_half * dt
    a_new = F(r, v_half) / m         # si F depende de v, usar v_half
    v = v_half + a_new * (dt/2)
    a = a_new
```

## Ventajas

- **Symplectic**: para sistemas conservativos, preserva la energía a largo plazo (oscilaciones acotadas, no hay deriva).
- Posiciones y velocidades en el mismo `t`: cómodo para calcular E_cinética + E_potencial sin desfase.
- Algebraicamente equivalente a Verlet original cuando F = F(r): mismas trayectorias.
- Más estable que Beeman para fuerzas suaves.

## Para TP4

- **Sistema 1** (oscilador amortiguado): F = F(r, v) — depende de velocidad. Hay que decidir si usar v(t) o v_half para evaluar la fuerza. Elección estándar: v_half. **Velocity-Verlet en su forma estándar es para F(r) — para F(r,v) Beeman es más natural.**
- **Sistema 2** (fuerza elástica blanda): F = F(r). **Velocity-Verlet es excelente acá** — symplectic, conservación de energía, simplicidad.

Probable elección del grupo G05 para TP4 Sistema 2: **Velocity-Verlet** o **Beeman**.

## Comparación con [[metodos/verlet_original|Verlet original]] y Leap-Frog

| | Verlet original | Leap-Frog | Velocity-Verlet |
|---|----|----|----|
| r conocido en | t | t | t |
| v conocido en | t-Δt (1 paso atrás) | t±Δt/2 (medio paso) | t (mismo paso) |
| Symplectic | sí | sí | sí |
| Trayectorias | iguales |  iguales | iguales |
| Algebraica | r(t-Δt), r(t) | v en mediopasos | dos sub-pasos |

(Slide 18 muestra un esquema visual de las 3.)

## Orden y error

- Posición: **O(Δt²)** error global ⇒ ECM en log-log con pendiente ≈ 4.
- Velocidad: **O(Δt²)**.

## Referencias

- Teorica_4 slide 17 → `raw/teoria/Teorica_4.pdf`
- Frenkel & Smit, *Understanding Molecular Simulation*, capítulo de algoritmos de integración.
