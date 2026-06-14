# SDS — Simulación de Sistemas (ITBA, 26-1C)

Wiki de estudio de la materia **Simulación de Sistemas** (ITBA, 1.º cuatrimestre
2026). Es una **copia publicada y de solo lectura** de un vault de Obsidian:
contiene el conocimiento destilado de la cursada, sin las fuentes crudas
originales (PDFs de cátedra, enunciados, código de TPs) que viven en el vault
privado.

## Qué temas cubre

Simulación de sistemas de partículas y agentes:

- **Modelos off-lattice** — Vicsek (bandadas), polarización como observable.
- **Dinámica molecular** — por eventos (EDMD, *lazy invalidation*, tiempos y
  operadores de colisión) y por paso temporal (DM con `dt` fijo).
- **Integradores numéricos** — Euler, Verlet original, leap-frog, velocity
  Verlet, Beeman, Gear predictor-corrector.
- **Métodos de vecindad** — cell index method (O(N)), condiciones periódicas de
  contorno e imagen mínima.
- **TPs** — páginas por trabajo práctico (TP2 a TP5) con modelo físico,
  parámetros, observables, decisiones de implementación y gráficos esperados.
- **Herramientas** — convenciones del grupo en Java y plantillas de matplotlib.

## Cómo navegarlo

1. Empezá por el catálogo: **[`index.md`](index.md)** (o
   [`wiki/index.md`](wiki/index.md) si tu lector lo busca dentro de `wiki/`).
   Lista todas las páginas agrupadas por TPs, conceptos, métodos, herramientas y
   fuentes.
2. Seguí los wikilinks `[[...]]` entre páginas; al pie de cada una hay una
   sección de navegación lateral.
3. La bitácora cronológica de cambios está en [`log.md`](log.md).

## Contexto del repo

Este vault es uno de los siete de **StudyVaultsITBA**. Para el índice general de
todas las materias, ver [`../HOME.md`](../HOME.md). El estándar de formato de las
páginas vive en [`../_estandar/DESIGN.md`](../_estandar/DESIGN.md).

> **Nota.** Las referencias a `raw/...` dentro de las páginas son citas de
> procedencia hacia el vault original privado; esos archivos no se incluyen en
> esta copia publicable.
