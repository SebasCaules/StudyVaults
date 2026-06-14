---
tipo: tp
estado: entregado
nota: 4.5
tags:
- edmd
- eventos
- dinamica-molecular
- scanning-rate
fuentes:
- "fuentes/tp3_enunciado"
- "fuentes/tp3_correccion"
- "fuentes/tp3_presentacion"
actualizado: 2026-05-06
---

# TP3 — Simulación Dirigida por Eventos (EDMD)

**Entregado**: 24/04/2026 · **Nota**: 4.5 · **Grupo**: G05 (comisión S) · **Sistema elegido**: Sistema 1 (scanning rate con obstáculo fijo)

> **No se entregó informe** — el TP3 sólo pedía presentación + código (no informe).

## Enunciado (resumen — Sistema 1)

[[conceptos/edmd]] (event-driven molecular dynamics) sobre partículas con MRU entre colisiones. Recinto circular de **diámetro L = 80 m**, obstáculo fijo central de **radio r₀ = 1 m**.

Partículas: **N** partículas de radio **r = 1 m**, **v₀ = 1 m/s**, ángulos uniformes en [0, 2π), masa **m = 1 kg**. Las partículas son inicialmente "frescas" (verdes); al chocar con el obstáculo central pasan a "usadas" (violetas); al chocar con el borde vuelven a frescas.

### Items del enunciado

- **1.1** Tiempo de ejecución vs N para tf = 5 s.
- **1.2** [[conceptos/scanning_rate]] J: pendiente de Cfc(t) (acumulado de partículas frescas que tocan el centro). ⟨J⟩(N) con barras de error.
- **1.3** Fracción de usadas Fᵤ(t) = Nᵤ(t)/N. Reportar tiempo al estacionario y F_est(N).
- **1.4** [[conceptos/perfiles_radiales]]: capas concéntricas de ancho dS = 0.2 m. Para partículas frescas con velocidad radial hacia el centro (R·v < 0), calcular ⟨ρᶠⁱⁿ⟩(S), |⟨vᶠⁱⁿ⟩(S)| y Jᵢₙ(S) = ⟨ρᶠⁱⁿ⟩·|⟨vᶠⁱⁿ⟩|. Para la capa S ≈ 2, graficar Jᵢₙ, ⟨ρᶠⁱⁿ⟩ y ⟨vᶠⁱⁿ⟩ vs N.

## Implementación (G05)

- **Lenguaje**: Java 11 + Maven, sin dependencias. Animación: Swing. Postproc: Python (matplotlib).
- **Motor EDMD**: `simulation/Simulator.java` — min-heap de eventos, [[conceptos/lazy_invalidation]] por contador.
- **Tres modos**: `run()` (escribe cada evento), `runStream()` (no acumula en memoria, para benchmark), `runLight()` (escribe cada 1000 eventos, para N grande).
- Ver `raw/tps_pasados/TP3/PROJECT.md` para arquitectura completa.

### Parámetros (corrida final)

| Parámetro | Valor |
|-----------|-------|
| Radio recinto | 40 m (diámetro 80) |
| Radio obstáculo | 1 m |
| Radio partícula | 1 m |
| σ PP | 2.0 m |
| σ obstáculo | 2.0 m |
| σ borde efectivo | 39.0 m |
| v₀ | 1 m/s |
| Timing: N | {10, 20, 50, 100, 200, 400, 800}, 10 realizaciones, tf=500 s |
| Trayectorias: N | {10, 50, 100, 200, 400, 800}, 1 realización, tf=1500 s |

### Decisiones clave (ver `raw/tps_pasados/TP3/CLAUDE.md`)

- **`timeWall` sin filtrar signo de v·r**: garantiza que toda partícula tenga un evento de pared programado, evitando que una partícula que pasa cerca del obstáculo sin tocarlo derive infinitamente.
- **Invalidación lazy**: cada partícula tiene un contador `count` que se incrementa en cada colisión. Los eventos guardan el snapshot del contador; si al procesar no coincide, se descarta. Evita borrar eventos de la heap (O(N) sería caro con `PriorityQueue`).
- **Sin duplicados PP**: al reprogramar después de una colisión PP, ambas partículas generan los mismos pares; se usa un `Set<Long>` de claves `i*N+j` para no encolar dos veces.
- **Conservación de KE en PP**: con masas iguales se conserva la energía total, no el módulo individual. Esto es físicamente correcto.

## Cálculo de tiempos de colisión

Ver [[metodos/tiempos_colision_edmd]] para fórmulas completas. Resumen:

```
Δr = rⱼ - rᵢ,  Δv = vⱼ - vᵢ
d  = (Δv·Δr)² − (Δv·Δv)(Δr·Δr − σ²)
PP  / Obs:  tc = −(Δv·Δr + √d)/(Δv·Δv)   si Δv·Δr < 0  y  d ≥ 0
Wall:       tc = (−v·r + √d)/(v·v)         (sin filtrar signo)
```

## Observables

- **J** (scanning rate): pendiente del ajuste lineal de Cfc(t). Promediar sobre realizaciones, reportar barra de error.
- **Fᵤ(t)**: fracción de usadas. Reportar **valor promedio del estacionario** (no "asintótico" — la corrección lo señaló).
- **Perfiles radiales**: ⟨ρᶠⁱⁿ⟩(S), ⟨vᶠⁱⁿ⟩(S), Jᵢₙ(S).

## Errores y aprendizajes (corrección TP3 — **muy importantes para TP4**)

Ver [[conceptos/lecciones_correcciones]]. Resumen específico TP3:

- 🔴 **Crítico — animación**: la animación NO debe usar reloj/paso temporal fijo. Debe mostrar el sistema en los **tiempos de los eventos**. Esto se discutió EXPLÍCITAMENTE en clase y no lo aplicamos. Penalización fuerte. Para TP4 **el paso fijo sí es válido** (es DM con paso temporal), pero hay que validar el dt con la energía total.
- 🔴 **Crítico — análisis con eventos**: no se aclaró cómo se promedian evoluciones temporales con eventos a tiempos distintos entre realizaciones. Hay que explicitar el método (binning temporal, interpolación, etc.).
- D4 — Falta cómo se actualizan las velocidades tras la colisión. Faltan fórmulas (al menos referenciar masa infinita para colisión con objeto fijo).
- D6 — No usar variables (Cfc, Fu) antes de introducirlas.
- D11 — Faltó explicitar cómo se calcula J (ajuste lineal) y cómo se promedia (cuántas realizaciones, desvío).
- D12 — "Asintótico" mal usado: es **valor promedio durante el estacionario**.
- D13 — Variables no introducidas: M, T, n^in_k(S,t). Caso borde: ¿qué hace la fórmula de velocidad si el número de partículas es cero?
- D14 — Para N basta indicar el rango N ∈ [10, 800]. Tiempos finales no son "parámetros variables" del sistema.
- D16-21 — Demasiadas animaciones (5). Bastan 2. Los links pegados tenían caracteres no alfabéticos.
- D22-23 — Si quieren analizar comportamiento exponencial vs ley de potencia, usar log-log o semi-log. **Su ajuste cuadrático no es exponencial**: en log-log lineal sería ley de potencia, no exponencial.
- D24, D26, D28 — Para variables numéricas como N, usar **escalas tipo gradiente** con colorbar, no leyenda categórica.
- Práctica oral: practicar antes, no improvisar.
- Código entregado: solo el motor de simulación, **sin visualizadores ni código de análisis**.

## Conceptos asociados

- [[conceptos/edmd]]
- [[conceptos/lazy_invalidation]]
- [[conceptos/scanning_rate]]
- [[conceptos/perfiles_radiales]]
- [[metodos/tiempos_colision_edmd]]
- [[metodos/colision_elastica_pp]]

## Código y entregables

- Código: `raw/tps_pasados/TP3/` (Java + Maven)
- Presentación entregada: `raw/informes_y_presentaciones/TP3/TP3_presentacion.pdf`
- Fuentes LaTeX (presentación): `raw/informes_y_presentaciones/TP3/fuentes_latex/`
- **No hay informe**: el TP3 no requería informe.
