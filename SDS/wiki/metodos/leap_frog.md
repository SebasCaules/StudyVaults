---
tipo: metodo
tags:
- tp4
- integrador
- verlet
fuentes:
- "fuentes/teoria_4"
actualizado: 2026-05-07
---

# Leap-Frog

Variante de [[metodos/verlet_original|Verlet]] donde la velocidad se mantiene en **medio-pasos** y la posición en pasos enteros (slide 16). De ahí el nombre — posición y velocidad "saltan" alternándose.

## Esquema (slide 16)

```
v(t+Δt/2) = v(t-Δt/2) + (Δt/m)·f(t)
r(t+Δt)   = r(t) + Δt·v(t+Δt/2)
```

Para obtener la velocidad en el paso entero (necesaria para E_cinética):

```
v(t) = [v(t-Δt/2) + v(t+Δt/2)] / 2
```

## Pseudocódigo

```
# inicialización: necesito v(-Δt/2). Usar Euler hacia atrás:
v_half = v(0) - a(0) * (dt/2)

para cada paso:
    a = F(r) / m              # si F=F(r); para F(r,v) usar v_at_t = (v_half + v_prev_half)/2
    v_half = v_half + a*dt
    r = r + v_half*dt
    # si necesito v(t) actual: v_t = (v_half_prev + v_half) / 2
```

## Características

- **Symplectic**: igual que Verlet original y Velocity-Verlet, preserva la energía.
- Algebraicamente equivalente a Verlet original cuando F = F(r) — mismas trayectorias.
- Más simple que Velocity-Verlet en código (un solo update de v por paso).
- Inconveniente: la velocidad NO está disponible en el mismo `t` que la posición — hay que promediar.

## Para TP4

- Útil para **Sistema 2** (F = F(r)). Equivalente en precisión a Verlet original / Velocity-Verlet.
- Para **Sistema 1** (F = F(r,v)) requiere cuidado porque la fuerza necesita `v(t)`, no `v(t±Δt/2)`. Hay que iterar o aproximar.

## Referencias

- Teorica_4 slide 16 → `raw/teoria/Teorica_4.pdf`
- Slide 18: comparación visual con Verlet original y Velocity-Verlet.
