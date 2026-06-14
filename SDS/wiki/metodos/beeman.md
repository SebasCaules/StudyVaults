---
tipo: metodo
tags:
- tp4
- integrador
actualizado: 2026-05-06
---

# Beeman

Integrador de orden 3 (en posición) que maneja fuerzas dependientes de **x y v**. Más preciso que Verlet original para sistemas con fricción.

## Esquema

Posición:
```
x(t+dt) = x(t) + v(t)·dt + (2/3)·a(t)·dt² - (1/6)·a(t-dt)·dt²
```

Predicción de velocidad:
```
v_p(t+dt) = v(t) + (3/2)·a(t)·dt - (1/2)·a(t-dt)·dt
```

Cálculo de aceleración nueva:
```
a(t+dt) = F(x(t+dt), v_p(t+dt)) / m
```

Corrección de velocidad:
```
v(t+dt) = v(t) + (1/3)·a(t+dt)·dt + (5/6)·a(t)·dt - (1/6)·a(t-dt)·dt
```

## Inicialización

Necesita `a(t-dt)`. Opciones:
- Usar `a(t-dt) = a(0)` (asumir aceleración constante en el primer paso).
- Calcular con Taylor: `x(-dt) = x(0) - v(0)·dt + ½·a(0)·dt²`, luego `a(-dt) = F(x(-dt), v(-dt))/m`.

## Pseudocódigo

```
a_prev = ...  # ver inicialización
a = F(x, v) / m

for paso:
    x_new = x + v*dt + (2/3)*a*dt² - (1/6)*a_prev*dt²
    v_pred = v + (3/2)*a*dt - (1/2)*a_prev*dt
    a_new = F(x_new, v_pred) / m
    v_new = v + (1/3)*a_new*dt + (5/6)*a*dt - (1/6)*a_prev*dt

    a_prev, a = a, a_new
    x, v = x_new, v_new
```

## Para TP4

- **Sistema 1** (oscilador amortiguado): fuerza F = -k·x - γ·v. Beeman maneja esto bien gracias a la predicción de v.
- **Sistema 2** (fuerza elástica blanda F(x)): funciona también, pero la predicción de v es innecesaria; aún así no estorba.

## Orden

Posición orden 3. Velocidad orden 2 (con la corrección incluida). Error global similar a Verlet en posición pero con manejo correcto de F(x,v).
