---
tipo: concepto
tags:
- edmd
- optimizacion
actualizado: 2026-05-06
---

# Invalidación lazy en EDMD

Estrategia para mantener una min-heap de eventos sin necesidad de borrar entradas cuando una colisión hace obsoletos eventos previos.

## Problema

Cuando ocurre una colisión que afecta a la partícula i, todos los eventos previamente programados que la involucran (PP, obstáculo, pared) son obsoletos: las posiciones y velocidades de i cambiaron.

Borrar entradas en una `PriorityQueue` estándar (min-heap binaria) es **O(N)**: hay que escanear el array. Hacer esto por cada colisión es prohibitivo.

## Solución

- Cada partícula tiene un entero `count` que se incrementa **cada vez que colisiona**.
- Cada `Event` guarda los valores `countᵢ` y `countⱼ` al momento de su creación.
- Al extraer un evento de la cola: si `partícula[i].count != evento.countᵢ` (o lo análogo para j en eventos PP), el evento es obsoleto y se descarta sin procesar.

```java
class Event {
    double time;
    int type;        // PP / OBS / WALL
    int i, j;        // índices (-1 si no aplica)
    int countI, countJ;  // snapshot

    boolean isValid(Particle[] p) {
        if (p[i].count != countI) return false;
        if (j >= 0 && p[j].count != countJ) return false;
        return true;
    }
}
```

## Costo

- Procesar un evento válido: **O(N log N)** por la reprogramación (encolar O(N) eventos nuevos a O(log N) cada uno).
- Procesar un evento inválido: **O(log N)** (solo el `pop` de la cola).
- Memoria: la cola puede crecer pero se purga implícitamente cuando los eventos llegan al tope y se descartan.

## Evitar duplicados PP

Después de una colisión PP entre i y j, ambas reprograman sus eventos. Sin cuidado, el par (i,j) se encolaría dos veces. Se usa un `Set<Long>` de claves `i*N + j` (con i<j) para chequear si ya se encoló.

## Implementación G05 en TP3

Ver `raw/tps_pasados/TP3/src/simulation/Simulator.java` y `Event.java`.
