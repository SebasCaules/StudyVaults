---
tipo: fuente
archivo: "raw/tps_pasados/TP2/"
tags:
- tp2
- codigo
- java
actualizado: 2026-05-06
---

# Fuente — Código TP2 (G05)

📁 `raw/tps_pasados/TP2/` · Java + Swing.

## Estructura

```
TP2/
├── tp2/src/
│   ├── Simulation.java       ← motor: Vicsek + CIM
│   └── Animation/            ← Swing
│       ├── AnimationLauncher.java
│       ├── AnimationPanel.java
│       ├── OutputParser.java
│       ├── SimulationData.java
│       ├── Frame.java
│       └── ParticleState.java
├── output/                   ← .txt por escenario × η
└── README.md                 ← documentación detallada
```

## Decisiones de implementación (de README.md)

- L=10, ρ=4 ⇒ N=400, v=0.03, rₒ=1.0, dt=1.0, steps=2000.
- Barrido η = {0, 0.5, 1.0, ..., 5.0}.
- Escenarios A/B/C como `enum`.
- Vecinos: [[conceptos/cell_index_method]].
- Seed = 42 (única realización por config — **insuficiente** para barras de error rigurosas; mejorar en TP4).

## Formato de output

```
N
L η scenario
0
x y vx vy leaderFlag      (N líneas)
1
...
```

`leaderFlag = 1` para el líder, `0` para el resto.

## Reutilizable para TP4

- Estructura general del motor (loop principal, parser de salida).
- CIM si se usa para contactos.
- Patrón de animación Swing.

## Páginas que toca

- [[tps/TP2]]
- [[herramientas/java]]
- [[conceptos/cell_index_method]]
- [[metodos/vicsek_update]]
