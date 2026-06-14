---
tipo: metodo
tags:
- tp4
- integrador
actualizado: 2026-05-06
---

# Verlet original

Integrador de orden 2 para `m·ẍ = F(x)`. Reversible en tiempo, conserva muy bien la energía en sistemas conservativos.

## Esquema

```
x(t+dt) = 2·x(t) - x(t-dt) + (F(t)/m)·dt²
v(t)    = (x(t+dt) - x(t-dt)) / (2·dt)
```

- Necesita `x(t-dt)` ⇒ inicialización especial (dar un paso de Euler hacia atrás o usar Taylor):
  ```
  x(-dt) = x(0) - v(0)·dt + ½·(F(0)/m)·dt²
  ```
- La velocidad se conoce **un paso atrás** del último x calculado (es el costo de Verlet original).

## Limitación

No maneja directamente fuerzas dependientes de v (fricción, oscilador amortiguado del TP4 Sistema 1). Para eso usar:

- **Velocity Verlet** (variante): mantiene x y v en el mismo paso, permite F(x, v) iterando.
- **Beeman**: maneja F(x, v) directamente.

## Para TP4 Sistema 2

Funciona bien: la fuerza elástica blanda es F(x), no F(x, v). Es una buena opción por simplicidad y conservación de E.

## Pseudocódigo

```
# inicialización
x_prev = x0 - v0*dt + 0.5*(F0/m)*dt²
x_curr = x0

# bucle
for paso in 0..N:
    F = calcular_F(x_curr)
    x_next = 2*x_curr - x_prev + (F/m)*dt²
    v = (x_next - x_prev) / (2*dt)
    output(x_curr, v)            # nota: v desfasado un paso
    x_prev, x_curr = x_curr, x_next
```

## Orden y error

Error global ~ O(dt²) en posición. ECM en log-log: pendiente ≈ 4 (porque ECM ~ error²).
