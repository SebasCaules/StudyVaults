---
tipo: tp
tags:
- tp5
- dinamica-peatonal
- multi-agente
- cell-index-method
- cpm
fuentes:
- "raw/TP5/cronograma_cátedra.md"
- "raw/TP5/transcript_mail_cátedra.md"
actualizado: 2026-06-08
---

# TP5 — Simulador de tránsito peatonal (proyecto colaborativo)

Último TP de la materia: un **simulador de dinámica peatonal multi-agente** a tiempo
discreto, construido entre **9 grupos** sobre una arquitectura de puertos y
adaptadores (un módulo por grupo). Repo (monorepo Maven/Java 21):
`sim-dinamica-peatonal`.

## Qué hace G05

G05 implementa el **índice espacial de vecinos** (puerto `NeighborsIndex`): por cada
agente y en cada paso devuelve los **agentes y paredes** a distancia ≤ rₘₐₓ. La
implementación principal es `CimNeighborsIndex` ([[conceptos/cell_index_method]]) y se
deja `BruteForceNeighborsIndex` (O(N²)) como referencia para tests de equivalencia.

Decisiones de la implementación:
- Una consulta devuelve agentes (distancia centro-a-centro) **y** paredes (distancia
  punto-a-segmento), ordenadas.
- Paredes (estáticas) → indexadas una sola vez al construir la grilla (muestreo cada ℓ/4).
- Agentes (móviles) → re-indexado **lazy** (flag `dirty`) solo al consultar tras un update.
- Celda de lado ℓ = 1,1·rₘₐₓ; vecindario 3×3 ⇒ O(N) por paso.

## Escenario asignado: aeropuerto (salidas)

`scenarios/d-aeropuerto/` (Formato B, `parameters.json`). Flujo:
ingreso → cola + 3 **check-in** → 2 escáneres **RX** → **sala de embarque** → avión.
Modelo de movimiento: **CPM** (Contractile Particle Model, Baglietto & Parisi 2011):
radio dinámico, repulsión sin solapamiento, anti-tunneling, colas resueltas en el OM.

Parámetros: radios r∈[0,15; 0,32] m, v_máx 1,2 m/s, Δt 0,05 s, Δt_out 0,5 s,
t_total 600 s, servicio check-in 𝒩(30,8) s y RX 𝒩(15,4) s.

## Estudio / barrido (pedido de la cátedra)

Observable escalar: **tiempo medio de tránsito ingreso → sala de embarque**.
Input variado: **caudal de ingreso** (pax/min). 5 realizaciones por punto (el RNG del
generador y del grafo no está seedeado ⇒ cada corrida es una realización independiente
⇒ barras de error sin tocar código de otros grupos).

| caudal [pax/min] | ⟨T⟩ ± σ [s] | % que llega a la sala |
|---:|---:|---:|
| 3  | 95 ± 6   | 81% |
| 6  | 157 ± 4  | 54% |
| 10 | 220 ± 8  | 40% |
| 16 | 219 ± 15 | 28% |
| 24 | 228 ± 4  | 32% |

**Resultado:** el tránsito crece con el caudal hasta **saturar** (la entrada deja de
inyectar más pasajeros); la fracción que llega a la sala cae monótonamente. Los cuellos
de botella (mapa de densidad) son el check-in y el control RX.

## Cómo se midió (sin tocar código de otros grupos)

El output canónico de G6 (`tout; x; y; vx; vy; estado`) **no** lleva id de agente, así
que no se puede reconstruir la trayectoria por persona. **No se modificó `App.java`
(infra/T6) ni `animate_run.py` (otro grupo) ni ningún archivo ajeno.** G05 agregó solo
**archivos propios nuevos**:
- `analysis/IdTrajectorySink` + `analysis/TeeOutputSink` → escriben, junto al output
  canónico de G6, un sidecar con id de agente.
- `analysis/AeropuertoMetricsApp` → entry point de análisis propio que cablea la misma
  simulación que `App` (usando clases públicas de los demás grupos, sin modificarlas) y
  fija el caudal por argumento.

Post-proceso (Python, propio): `tools/analyze_run.py`, `tools/sweep_caudal.py`,
`tools/plots/make_figures.py`. La animación usa `tools/animate_run.py` sin modificar.

## Entregables (presentación 12/06/2026, 13 min)

`presentacion/` en el repo: `tp5_g5.pdf` (Beamer, 22 diapositivas), fuente `.tex`,
figuras, animaciones (10 y 24 pax/min) + posters, y `README.md`. La estructura sigue
los [[conceptos/lecciones_correcciones]]: explicar el módulo primero; por estudio,
*animación → serie temporal → input vs escalar*; títulos descriptivos, condiciones al
costado, citas inline, sin índice ni diapositiva final de referencias, barras de error
visibles.
