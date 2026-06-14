---
tipo: metodo
tags:
- tp4
- integrador
fuentes:
- "fuentes/teoria_4"
actualizado: 2026-05-07
---

# Euler (3 variantes de la teórica)

La teórica 4 distingue tres variantes del método de Euler. **Saber cuál se está usando importa porque los resultados difieren.**

## 1) Euler "estándar" (slide 9)

El más simple. Posición y velocidad se actualizan **independientemente** usando los valores del paso anterior.

```
r(t+Δt) = r(t) + Δt·v(t) + (Δt²/2m)·f(t) + O(Δt³)
v(t+Δt) = v(t) + (Δt/m)·f(t) + O(Δt²)
```

- Orden de error global: **O(Δt)** en velocidad (orden 1).
- ECM en log-log: pendiente ≈ 2.

## 2) Euler modificado (slide 10)

Usa la **velocidad ya actualizada** para calcular la posición. También llamado *semi-implicit Euler* o *symplectic Euler*.

```
v(t+Δt) = v(t) + (Δt/m)·f(t)            ← actualizar primero
r(t+Δt) = r(t) + Δt·v(t+Δt) + (Δt²/2m)·f(t)
```

Mejor conservación de energía que el estándar para osciladores. Sigue siendo orden 1 globalmente, pero más estable.

## 3) Euler predictor-corrector (slide 23)

Versión predictor-corrector del Euler. **Es la que implementa la cátedra como "Euler" en el caso del oscilador** (la curva "Euler-Predictor-Corrector Modified" en el slide 37).

### Predecir
```
v^p(t+Δt) = v(t) + a(t)·Δt
r^p(t+Δt) = r(t) + v(t)·Δt
```

### Evaluar
```
f(r^p, v^p) ⇒ a(t+Δt)
```

### Corregir
```
v(t+Δt) = v(t) + a(t+Δt)·Δt
r(t+Δt) = r(t) + v(t+Δt)·Δt
```

(La corrección usa la aceleración nueva y la velocidad corregida.)

## Cuál usar para el TP4

El enunciado solo dice "Euler". Mirando el gráfico de la teórica (slide 37) se ve "Euler-Predictor-Corrector Modified" — sugiere usar la **variante 3** (predictor-corrector). Si se decide usar la estándar (variante 1), aclararlo.

## No usar para producción

- No es reversible en tiempo (la variante 1).
- Para osciladores: la energía deriva (variante 1).
- Para el Sistema 2 daría resultados visiblemente erróneos.

Sirve como **referencia mínima** para mostrar cuánto mejor son Verlet/Beeman/Gear en el análisis ECM vs dt del Sistema 1.

## Pseudocódigo (variante estándar — la más simple)

```
para cada paso:
    a = F(r, v) / m
    r_new = r + v*dt + 0.5*a*dt²
    v_new = v + a*dt
    r, v = r_new, v_new
```

## Referencias

- Teorica_4 slides 9, 10, 23 → `raw/teoria/Teorica_4.pdf`
- Slide 37 muestra el desempeño en el oscilador.
