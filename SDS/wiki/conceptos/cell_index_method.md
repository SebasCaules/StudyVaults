---
tipo: concepto
tags:
- optimizacion
- vecinos
- off-lattice
- dinamica-molecular
fuentes:
- "fuentes/biblio_cell_index_method"
actualizado: 2026-05-06
---

# Cell Index Method (CIM)

Estructura de datos espacial para acelerar la búsqueda de vecinos en simulaciones de partículas con interacciones de corto alcance. Reduce el costo de O(N²) a O(N) por paso.

## Idea

- Dividir el dominio en celdas de lado **M ≥ rc** (rc = radio de interacción).
- Asignar cada partícula a su celda según su posición.
- Vecinos candidatos de una partícula: solo las partículas en su celda y en las **8 celdas adyacentes** (en 2D).

## Pseudocódigo

```
M = ceil(L / rc)              # cantidad de celdas por lado
celda[N][M]                   # lista de partículas por celda

# 1) construir
clear(celda)
for i in 0..N-1:
    cx = floor(x[i] / L * M)
    cy = floor(y[i] / L * M)
    celda[cx][cy].append(i)

# 2) buscar vecinos de partícula i
cx, cy = celda(i)
for dx in {-1, 0, +1}:
    for dy in {-1, 0, +1}:
        for j in celda[(cx+dx) mod M][(cy+dy) mod M]:
            if j != i and dist(i,j) ≤ rc:
                vecino(i, j)
```

## Condiciones periódicas

Para Vicsek y similares, las celdas vecinas se toman con **`mod M`** y al calcular distancias se usa la **convención de imagen mínima**:

```
dx = x[i] - x[j]
if dx >  L/2: dx -= L
if dx < -L/2: dx += L
```

## Tamaño óptimo

- Mínimo: M = rc (una celda contiene los vecinos posibles).
- Mayor M ⇒ celdas más chicas, menos partículas por celda, menos pares testeados, pero más overhead de iteración.
- Heurística común: M = rc o M ligeramente mayor que rc.

## Uso en los TPs

- **TP2**: vecinos para el promedio de ángulos en Vicsek.
- **TP4 Sistema 2**: cómputo de fuerza elástica blanda entre pares ξ > 0.

## Referencia

`raw/teoria/Biblio_1/Cell_Index_Method.pdf`
