---
tipo: fuente
archivo: "raw/informes_y_presentaciones/TP3/TP3_presentacion.pdf"
tags:
- tp3
- presentacion
- entregado
actualizado: 2026-05-06
---

# Fuente — Presentación TP3 entregada (G05)

📄 `raw/informes_y_presentaciones/TP3/TP3_presentacion.pdf` · 3 MB · entregado el 24/04/2026

PDF de la presentación oral. Es lo único que se entregó del TP3 (el TP3 no requería informe).

Fuentes LaTeX en `raw/informes_y_presentaciones/TP3/fuentes_latex/`:
- `ppt.tex`, `ppt_entregable.tex` (versiones)
- `figures/`, `videos/`

## Críticas detalladas en [[fuentes/tp3_correccion]]

Resumen de lo que falló:

- **Animación con paso fijo** (debe ser por eventos).
- Variables no definidas antes de usarlas (Cfc, Fu, t_e, M, T, n^in_k).
- Análisis estadístico sin explicitar (cuántas realizaciones, cómo se promedian eventos a tiempos distintos).
- Demasiadas animaciones (5 vs 2 necesarias). Links pegados con basura.
- Análisis de escalado mal interpretado (cuadrática presentada como exponencial).
- Leyendas categóricas para N — debió usarse colorbar.

## Para TP4

- El template Beamer es reusable, pero corregir las críticas estructurales.
- En TP4, sí es válido animar con paso fijo (es DM con paso temporal), pero validar dt.

## Páginas que toca

- [[tps/TP3]]
- [[tps/TP4]]
- [[conceptos/lecciones_correcciones]]
