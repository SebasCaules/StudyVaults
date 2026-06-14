---
tipo: fuente
archivo: "raw/tps_pasados/TP3/"
tags:
- tp3
- codigo
- java
- edmd
actualizado: 2026-05-06
---

# Fuente — Código TP3 (G05)

📁 `raw/tps_pasados/TP3/` · Java 11 + Maven, sin dependencias.

## Documentación detallada

Hay dos documentos en el repo del TP3:
- `raw/tps_pasados/TP3/PROJECT.md` — arquitectura completa, flujo de datos, decisiones de implementación.
- `raw/tps_pasados/TP3/CLAUDE.md` — resumen para LLM con tabla de parámetros, comandos, checklist de correctitud.

## Estructura

```
TP3/
├── src/
│   ├── Main.java                    ← Launcher Swing
│   ├── simulation/
│   │   ├── Particle.java            ← x, y, vx, vy, state, count
│   │   ├── Event.java               ← min-heap entry, lazy invalidation
│   │   ├── Simulator.java           ← motor EDMD
│   │   ├── Simulate.java            ← batch runner
│   │   └── SimulationResult.java
│   ├── analysis/
│   │   ├── SimulationAnalyzer.java  ← Cfc, Fu, perfiles radiales (streaming)
│   │   └── Analyze.java
│   └── visualization/
│       └── Visualizer.java
├── postprocess/plotter.py           ← matplotlib
├── scripts/                         ← compile.sh, run.sh
├── simulations/                     ← trayectorias (.txt)
├── results/                         ← CSVs
├── pom.xml
└── PROJECT.md, CLAUDE.md, README.md, QUICKSTART.md
```

## Decisiones clave reusables para TP4

- **Streaming**: el analizador procesa archivos de trayectoria snapshot a snapshot, sin cargarlos enteros en RAM. Necesario para N grande.
- **Tres modos del simulador**: `run()` (cada evento), `runStream()` (sin escribir, benchmark), `runLight()` (cada 1000 eventos).
- **Verificaciones en `Main.java`**: ninguna partícula fuera del recinto, ninguna superpuesta con el obstáculo, KE total conservada, Cfc no decrece.
- **Lazy invalidation por contador** (ver [[conceptos/lazy_invalidation]]).
- **`timeWall` sin filtrar signo de v·r** (ver [[metodos/tiempos_colision_edmd]]).

## Parámetros físicos

| Parámetro | Valor |
|-----------|-------|
| Radio recinto | 40 m |
| Radio obstáculo | 1 m |
| Radio partícula | 1 m |
| σ PP | 2.0 m |
| σ obstáculo | 2.0 m |
| σ borde efectivo | 39.0 m |
| v₀ | 1 m/s |
| m | 1 kg |

## Comandos

```bash
./scripts/compile.sh
java -cp out simulation.Simulate
java -cp out analysis.Analyze
python3 postprocess/plotter.py --all
```

## Páginas que toca

- [[tps/TP3]]
- [[tps/TP4]] (mismo sistema físico, otro motor)
- [[herramientas/java]]
- [[conceptos/edmd]]
- [[conceptos/lazy_invalidation]]
- [[metodos/tiempos_colision_edmd]]
