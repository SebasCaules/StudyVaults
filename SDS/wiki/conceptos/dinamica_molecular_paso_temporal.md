---
tipo: concepto
tags:
- tp4
- dinamica-molecular
fuentes:
- "fuentes/teoria_4"
actualizado: 2026-05-06
---

# Dinámica Molecular regida por el paso temporal

Esquema clásico de DM. Tiempo discretizado en pasos **dt fijo**; en cada paso se calculan fuerzas y se integran las ecuaciones de movimiento.

## Diferencia con [[conceptos/edmd|EDMD]]

| | EDMD (TP3) | DM paso temporal (TP4) |
|---|------------|------------------------|
| Tiempo | continuo, salta a eventos | discreto, dt fijo |
| Colisiones | instantáneas, rebote | fuerza blanda durante el contacto |
| Trayectorias | MRU entre eventos | integradas paso a paso |
| Análisis | por evento | por dt |
| Conservación de E | exacta entre eventos | depende de dt e integrador |

## Loop principal

```
inicializar(x, v)
for paso in 0..N_pasos:
    F = calcular_fuerzas(x, v)        # O(N²) o O(N) con CIM
    x, v = integrar(x, v, F, dt)      # Verlet, Beeman, Gear, Euler
    if paso % cada_dt₂ == 0:
        escribir_snapshot(x, v)
```

## Dos pasos temporales

- **dt**: paso de integración. Lo más chico que se pueda manejar; controla la precisión.
- **dt₂**: cada cuántos `dt` se imprime el estado al output. Más grande para que los archivos sean manejables.

`dt₂ = k · dt` con k entero. Para análisis de Cfc en TP4, se necesita guardar Cfc con resolución **dt** aunque el output general use dt₂.

## Validación

**Graficar la energía total E(t)** y verificar que no derive significativamente. Si deriva, dt es muy grande (o el integrador es malo, ej. Euler).

Heurística: dt ≪ período característico del sistema. Para fuerza elástica con constante k:

```
ω = √(k/m)
T = 2π/ω
dt ≲ T/100  (regla práctica)
```

Para k = 10³, m = 1: T ≈ 0.2 s, dt ≲ 2·10⁻³ s.
Para k = 10⁵, m = 1: T ≈ 0.02 s, dt ≲ 2·10⁻⁴ s.

## Fuerzas

En TP4 Sistema 2 la fuerza es **elástica blanda**:

```
Fᵢⱼ = -k · ξ · eᵢⱼ        si ξ > 0 (contacto)
ξ = rᵢ + rⱼ - |xᵢ - xⱼ|
eᵢⱼ = (xᵢ - xⱼ) / |xᵢ - xⱼ|
```

Ver [[conceptos/fuerza_elastica_blanda]].

## Vecinos

Para N hasta 1000 y rango de fuerza ≤ 2r ≈ 2 m, [[conceptos/cell_index_method]] reduce O(N²) a O(N).

## Suma de fuerzas con proyección normal/tangencial (slides 41-44)

Cuando hay fuerzas de contacto entre partículas i, j, conviene calcularlas en componentes normal/tangencial al punto de contacto y luego proyectar a coordenadas cartesianas:

```
e_n_x = (xⱼ - xᵢ) / |rⱼ - rᵢ|        # versor normal
e_n_y = (yⱼ - yᵢ) / |rⱼ - rᵢ|

e_t_x = -e_n_y                       # tangencial = normal rotada 90°
e_t_y =  e_n_x

F_x = F_N · e_n_x + F_T · e_t_x
F_y = F_N · e_n_y + F_T · e_t_y
```

Para la fuerza elástica blanda del TP4 Sistema 2: solo hay componente normal, F_N = -k·ξ. La proyección es directa:

```
F_i_x_total = Σⱼ F_N(ξᵢⱼ) · e_n_x_ij
F_i_y_total = Σⱼ F_N(ξᵢⱼ) · e_n_y_ij
```

Esta descomposición se usa también si en algún momento se quisiera agregar fricción tangencial (no requerido por el enunciado).
