---
tipo: herramienta
tags:
- java
actualizado: 2026-05-06
---

# Java en los TPs de SDS (G05)

El grupo viene usando **Java** para todos los TPs (TP2, TP3). Recomendable mantener consistencia para TP4.

## Versión

- **Java 11+** (TP3 usa Java 11 estándar, sin features modernos).
- TP3 usa Maven; TP2 usa compilación directa con `javac`.

## Estructura típica

```
src/
  Simulation.java     # motor principal
  Particle.java       # modelo
  ...
output/               # archivos .txt de simulación
```

## Conversión a Vicsek/EDMD/DM

| Concepto físico | Estructura en Java |
|-----------------|--------------------|
| Partícula | `class Particle { double x, y, vx, vy; int state; }` |
| Lista de partículas | `Particle[]` (array primitivo es más rápido que `List`) |
| Min-heap de eventos (EDMD) | `PriorityQueue<Event>` con `Comparable` |
| Set para evitar duplicados PP | `HashSet<Long>` con clave `i*N+j` |
| Cell Index | `List<Integer>[]` o `int[][]` |
| RNG | `java.util.Random` (semilla explícita para reproducibilidad) |

## Output

Convención del grupo (TP2 y TP3): un archivo `.txt` por corrida, formato:
```
N
<header con parámetros de la corrida>
<frame 0>: t \n N líneas "x y vx vy state"
<frame 1>: ...
```

## Animación

- **TP2 / TP3**: Swing con `JPanel` y `paintComponent`. `Visualizer.java` (TP3) tiene controles de pausa/seek/fast-forward.
- Para TP4: replicar el patrón. Ver `raw/tps_pasados/TP3/src/visualization/Visualizer.java`.

## Compilación

```bash
# directo
javac -d out src/**/*.java
java -cp out simulation.Main

# Maven (TP3)
mvn compile
mvn exec:java -Dexec.mainClass=simulation.Simulate
```

## Restricciones de entrega

- **Solo el motor de simulación** en el zip.
- Sin postproc, sin viz, sin output, sin docs.
- **< 100 KB** (TP3, TP4).

Práctico: armar `target/codigo.zip` con un script que copie solo `src/simulation/*.java` al zip.
