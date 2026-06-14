---
tipo: fuente
archivo: "raw/teoria/Teorica_4.pdf"
tags:
- teoria
- tp4
- dinamica-molecular
- integradores
estado: leida
actualizado: 2026-05-07
---

# Fuente — Teórica 4: Simulaciones dirigidas por el paso temporal

📄 `raw/teoria/Teorica_4.pdf` · 45 diapositivas · 4.7 MB

Clase teórica completa que cubre la base del [[tps/TP4]]. Leída íntegra el 2026-05-07.

## Estructura

| Slides | Tema |
|--------|------|
| 1-4 | Definición DM, cuándo conviene paso temporal, interacciones de a pares |
| 5-7 | Desarrollo de Taylor (base teórica de los integradores) |
| 8-10 | Algoritmos Euler (estándar y modificado) |
| 11-18 | Algoritmos tipo Verlet: Verlet original, Leap-Frog, Velocity-Verlet, comparación |
| 19-20 | Algoritmo de Beeman + variante predictor-corrector para F(v) |
| 21-23 | Estructura general predictor-corrector + Euler PC |
| **24-30** | **Algoritmo Gear predictor-corrector + tablas de coeficientes α + inicialización** |
| 31-32 | Elección del paso temporal Δt (corto/largo/justo) y Δt₂ |
| 33-34 | Verificación del error: solución analítica / conservación de energía / dt decrecientes |
| **35-37** | **Caso 1: Oscilador amortiguado — parámetros, CI, solución analítica, gráfico comparativo** |
| 38-39 | Caso 2: Gas Lennard-Jones (no es del TP4) |
| 40 | Caso 3: Sistema gravitatorio (no es del TP4) |
| 41-44 | Suma de fuerzas con proyección normal/tangencial |
| 45 | FIN |

## Highlights críticos para TP4

### Slide 36 — Parámetros del oscilador (TP4 Sistema 1)

- Ecuación: `f = m·r₂ = -k·r - γ·r₁`
- m = 70 kg, k = 10⁴ N/m, γ = 100 kg/s, t_f = 5 s
- CI: r(0) = 1 m, v(0) = -A·γ/(2m) m/s (con A = 1)
- Solución: `r(t) = A·exp(-γ/(2m)·t)·cos((k/m - γ²/4m²)^0.5·t)`

Detalle ampliado en [[conceptos/oscilador_amortiguado]].

### Slide 28-29 — Coeficientes α de Gear

⚠️ Hay dos tablas distintas según la fuerza dependa o no de la velocidad. **Para el TP4 Sistema 1 (F = -kr - γv tiene v) corresponde α₀ = 3/16** (no 3/20 como yo había escrito originalmente).

Detalle en [[metodos/gear_predictor_corrector]] con la tabla completa para órdenes 2-5.

### Slides 31-32 — Elección de dt y dt₂

- Δt₂ = k·Δt con k entero: cada k pasos se imprime el estado.
- "Justo" = errores aceptables y máxima velocidad. "Demasiado largo" causa explosiones.
- Validación: comparar con solución analítica (caso simple) o conservación de energía (sistemas conservativos).
- Sistemas no conservativos: repetir con dt cada vez menores hasta que los resultados cambien menos que un dado error.

### Slide 17 — Velocity-Verlet

"Symplectic integrator", muy estable, preserva volúmenes en el espacio de fases. Provee r y v en el **mismo paso**.

Detalle en [[metodos/velocity_verlet]].

### Slide 20 — Beeman para F(v)

Variante predictor-corrector cuando la fuerza depende de la velocidad. Predice v(t+Δt) con (3/2, -1/2) y luego corrige con (1/3, 5/6, -1/6).

Detalle en [[metodos/beeman]].

### Slides 41-44 — Suma de fuerzas

Para fuerzas de contacto, conviene proyectar en normal/tangencial:

```
Fx = F_N · enₓ
Fy = F_N · eny

enₓ = (xⱼ - xᵢ) / |rⱼ - rᵢ|
eny = (yⱼ - yᵢ) / |rⱼ - rᵢ|

etₓ = -eny      ety = enₓ        (tangencial = normal rotada 90°)
```

Útil para implementar [[conceptos/fuerza_elastica_blanda]] del TP4 Sistema 2 cuando se quiere descomponer en componentes normal (elástica) y tangencial (si se agregara fricción tangencial).

## Páginas que toca

- [[tps/TP4]]
- [[conceptos/oscilador_amortiguado]]
- [[conceptos/integradores]]
- [[conceptos/dinamica_molecular_paso_temporal]]
- [[conceptos/fuerza_elastica_blanda]]
- [[metodos/euler]]
- [[metodos/verlet_original]]
- [[metodos/velocity_verlet]]
- [[metodos/leap_frog]]
- [[metodos/beeman]]
- [[metodos/gear_predictor_corrector]]
