---
tipo: concepto
tags:
- tp4
- dinamica-molecular
- numerico
fuentes:
- "fuentes/teoria_4"
actualizado: 2026-05-06
---

# Esquemas de integración (TP4 Sistema 1)

Comparación de integradores numéricos para resolver `m·a = F(x, v)`. El TP4 Sistema 1 los compara sobre un oscilador amortiguado con solución analítica.

## Integradores requeridos por el enunciado

| Esquema | Orden | Notas |
|---------|-------|-------|
| [[metodos/euler]] | 1 | Referencia mínima; degrada rápido. La teórica describe 3 variantes (estándar, modificado, predictor-corrector). |
| [[metodos/verlet_original]] | 2 | Reversible en tiempo, conserva energía. Asume F(r). Para F(r,v) usar variantes. |
| [[metodos/beeman]] | 3 (pos) / 2 (vel) | Maneja F(r,v) con la versión predictor-corrector (slide 20). |
| [[metodos/gear_predictor_corrector]] orden 5 | 5 | Predictor-corrector. ⚠️ α₀ depende de si F depende de v: 3/20 si F(r), **3/16 si F(r,v)**. |

## Variantes de Verlet también vistas en la teórica

- [[metodos/leap_frog]] (slide 16): velocidad en medio-pasos.
- [[metodos/velocity_verlet]] (slide 17): symplectic, posiciones y velocidades en mismo `t`. Recomendable para TP4 Sistema 2.

## Métrica: ECM

Error cuadrático medio entre solución numérica y analítica:

```
ECM = (1/N_pasos) · Σ (x_num(tₙ) - x_an(tₙ))²
```

(Sumar diferencias al cuadrado para todos los pasos temporales y normalizar por el número total de pasos.)

## Análisis log-log

ECM vs dt en escala **log-log**. La pendiente es 2× el orden del método (porque ECM ~ error²):

- Euler: pendiente ≈ 2 (orden 1 ⇒ error ~ Δt ⇒ ECM ~ Δt²)
- Verlet / Beeman / Velocity-Verlet: pendiente ≈ 4 (orden 2)
- Gear orden 5: pendiente ≈ 10

⚠️ Para dt muy chico aparecen efectos de **error de redondeo** (precisión finita ≈ 10⁻¹⁵ en doble); el ECM puede dejar de bajar y hasta subir. Ese piso señala el límite numérico, no el límite del método. La teórica lo ilustra en slide 37 (zoom muestra diferencias entre métodos a niveles ~10⁻⁴).

## Recomendación para TP4 Sistema 2

El Sistema 2 tiene **fuerza dependiente de la posición** (F = -k·ξ·e), no de la velocidad. Cualquier integrador funciona:

- **[[metodos/velocity_verlet|Velocity-Verlet]]**: symplectic, conservación de E a largo plazo, simple. **Recomendable.**
- **Beeman**: orden 3 en posición. Predictor-corrector innecesario acá.
- **Gear orden 5** con α₀ = **3/20** (F sin velocidad): máxima precisión, más código.
- **Euler**: no usar — hace energía aumentar/disminuir con el tiempo.

Validar siempre con la **conservación de energía total** (enunciado lo pide explícitamente y la teórica lo enseña en slide 34: E_cinética + E_potencial = cte para sistemas conservativos).

## Verificación del error (slide 34)

- **Caso simple**: comparar con solución analítica. Es lo del Sistema 1 del TP4.
- **Caso realista, sistema conservativo**: conservación de energía total. Es la validación del Sistema 2 del TP4.
- **Sistema no conservativo**: repetir simulaciones con dt cada vez menores hasta que los resultados cambien menos que un dado error.
