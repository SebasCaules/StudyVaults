---
tipo: concepto
tags:
- eventos
- dinamica-molecular
fuentes:
- "fuentes/teoria_3"
- "fuentes/tp3_enunciado"
actualizado: 2026-05-06
---

# Event-Driven Molecular Dynamics (EDMD)

Esquema de simulación donde el tiempo no avanza por pasos fijos sino **de evento en evento**. Entre eventos las partículas siguen movimiento rectilíneo uniforme (MRU).

## Estructura

1. Calcular el tiempo del **próximo evento** (colisión PP, colisión con obstáculo, colisión con borde) para cada partícula → mantener una **min-heap** de eventos.
2. Extraer evento mínimo, avanzar TODAS las partículas hasta ese tiempo (`xᵢ += vᵢ·Δt`).
3. Aplicar el operador de colisión (cambio de velocidades, cambio de estado).
4. Reprogramar los eventos de las partículas involucradas.
5. Repetir.

```
PQ ← todos los eventos iniciales
t_now ← 0
while not PQ.empty():
    e ← PQ.pop()              # min por tiempo
    if e.time > tf: break
    if not e.valid(): continue   # invalidación lazy
    Δt ← e.time - t_now
    advance_all(Δt)
    t_now ← e.time
    apply_collision(e)
    schedule_new_events(involved(e))
```

## [[conceptos/lazy_invalidation|Invalidación lazy]]

Borrar un evento de una `PriorityQueue` estándar es O(N). En su lugar:

- Cada partícula tiene un contador `count` que se incrementa en cada colisión que la afecta.
- Cada evento guarda el snapshot `countᵢ`, `countⱼ` al crearse.
- Al sacar un evento de la cola: si los contadores actuales NO coinciden con los guardados, se descarta sin procesar.

Es la decisión de implementación clave que hace EDMD práctico.

## Tiempos de colisión

Ver [[metodos/tiempos_colision_edmd]] para fórmulas. Idea general (geometría 2D, partículas circulares):

- **PP**: las partículas se aproximan y se cruzarían a distancia σ = rᵢ + rⱼ. Resolver `|rⱼ + Δv·t - rᵢ|² = σ²`.
- **Obstáculo fijo**: igual pero con la otra partícula en el origen.
- **Borde circular**: la partícula se aleja y golpea desde adentro la circunferencia de radio R - r.

## Operadores de colisión (masa igual, perfectamente elástica)

- **PP**: transferir impulso a lo largo de la línea de centros. KE total se conserva, módulos individuales pueden cambiar.
- **Pared/obstáculo fijo**: reflexión especular. v_normal cambia de signo, |v| se conserva.

## Ventajas y desventajas

✅ Tiempo continuo, sin error de discretización en la dinámica entre eventos.
✅ Eficiente para sistemas con colisiones esporádicas.
❌ No sirve para fuerzas continuas (potenciales suaves).
❌ Costo por evento O(N) si reprogramo todo; mejorable con CIM o reprogramación local.

## Lecciones de TP3

Todo el análisis y la **animación** deben respetar la lógica de eventos. Animar con paso fijo o discretizar el tiempo en bins regulares **rompe el espíritu del método** — la cátedra penaliza esto fuerte (ver [[conceptos/lecciones_correcciones]]).

## Ver también

- [[metodos/tiempos_colision_edmd]]
- [[metodos/colision_elastica_pp]]
- [[conceptos/lazy_invalidation]]
- [[tps/TP3]]
