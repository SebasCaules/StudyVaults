---
tipo: tp
estado: entregado
nota: 6
tags:
- autocelular
- off-lattice
- vicsek
- flocking
fuentes:
- "fuentes/tp2_enunciado"
- "fuentes/tp2_correccion"
- "fuentes/tp2_informe"
- "fuentes/tp2_presentacion"
actualizado: 2026-05-06
---

# TP2 — Autómata Off-Lattice: Bandadas de agentes autopropulsados

**Entregado**: 30/03/2026 · **Nota**: 6 · **Grupo**: G05 (comisión S)

## Enunciado (resumen)

Implementar el modelo de bandadas de [[conceptos/vicsek]] descrito en la teórica 2 y en el paper original [Vicsek et al. 1995]. Sistema en caja cuadrada de lado **L = 10** con condiciones periódicas, densidad **ρ = 4** (⇒ N = 400). Estudiar el comportamiento como función del parámetro de ruido **η** y reportar la [[conceptos/polarizacion_va]] (vₐ).

Se incorpora una **partícula líder** cuyo movimiento es predefinido y no responde a vecinos, pero sí los influye. Tres escenarios:

- **A**: sin líder (modelo estándar Vicsek).
- **B**: líder con dirección fija (elegida aleatoriamente al inicio).
- **C**: líder en trayectoria circular (R = 5, velocidad angular tal que vₜ ≈ v de las partículas).

Para cada escenario, presentar (a) animación característica con vectores velocidad coloreados por ángulo, (b) evolución temporal de vₐ identificando ventana del estacionario, (c) curva vₐ vs η con barras de error, (d) comparación de los tres escenarios en una misma figura. (e) Opcional: ρ = 2 y ρ = 8.

## Modelo

- N partículas en caja periódica L×L.
- Velocidad de módulo constante v.
- En cada paso, cada partícula actualiza su ángulo al promedio de los ángulos de los vecinos dentro de un radio rₒ, más un ruido uniforme en [-η/2, η/2].
- Integración explícita: `θ(t+Δt) = ⟨θ⟩ᵣ + ruido`.
- **OJO** (corrección TP2): la fórmula correcta es `θ(t+Δt)`, no `θ(t+1)`. Y para el promedio de ángulos hay que usar **`atan2`**, no `atan`.

Ver [[metodos/vicsek_update]] y [[conceptos/cell_index_method]] (CIM) para acelerar la búsqueda de vecinos.

## Parámetros usados (G05)

| Parámetro | Valor |
|-----------|-------|
| L | 10.0 |
| ρ (densidad) | 4.0 |
| N | 400 |
| v | 0.03 |
| rₒ (radio de interacción) | 1.0 |
| Δt | 1.0 |
| Steps | 2000 |
| η barrido | {0.0, 0.5, 1.0, ..., 5.0} |
| Realizaciones | (definir; **la corrección pidió indicarlo**) |
| Seed | 42 (no es parámetro físico, no reportar) |

## Implementación (G05)

- **Lenguaje**: Java (Swing para animación). Ver `raw/tps_pasados/TP2/`.
- Estructura: `Simulation.java` corre todas las combinaciones escenario × η y escribe `output/off_lattice_<escenario>_eta<valor>.txt`.
- Animación independiente: `Animation/AnimationLauncher.java` lee los `.txt` y reproduce con vectores coloreados.
- Vecinos acelerados con [[conceptos/cell_index_method]].

## Observable: polarización vₐ

vₐ = |Σᵢ vᵢ| / (N·v). Toma valores en [0, 1]. vₐ ≈ 1 ⇒ alineación máxima; vₐ ≈ 0 ⇒ desorden.

Para el escalar válido del observable, **promediar sobre la ventana estacionaria**. La corrección señaló: empezar a promediar **antes de t = 500** (que era demasiado tarde). Hay que mostrar gráficamente la ventana usada en los resultados, no solo describirla.

## Resultado físico esperado

Transición de fase tipo: a bajo η, alineación colectiva (vₐ → 1); a alto η, desorden (vₐ → 0). Decrecimiento monótono.

**Conclusión válida** (ver [[conceptos/lecciones_correcciones]]): "La polarización disminuye monótonamente con el aumento del ruido". Conclusiones sobre el efecto del líder requieren analizar también la **correlación entre el ángulo del líder y el sistema** — sin ese análisis, no se puede afirmar que un líder no modifica la dinámica colectiva.

## Errores y aprendizajes (corrección TP2)

Ver [[conceptos/lecciones_correcciones]] para la lista completa. Resumen específico TP2:

- Fórmula del update: `θ(t+Δt)`, no `θ(t+1)`. Usar `atan2`.
- En la presentación oral hay que mostrar **animaciones**, no fotos del sistema.
- No mezclar escenarios en la presentación: para cada escenario mostrar animación + serie temporal + curva input vs observable, en ese orden.
- Indicar dónde/cuándo se guarda el output.
- Indicar el número de realizaciones (la semilla NO es parámetro físico).
- En el informe: los valores de parámetros (L, rₒ, etc.) NO van en la sección "Implementación" — esa sección es para la arquitectura del código. Los valores van en "Simulaciones".
- En "Resultados", introducir las figuras antes de hablar del estacionario, no al revés.
- Las referencias bibliográficas no se meten en una diapositiva final: se citan inline en la diapositiva donde se mencionan.

## Conceptos asociados

- [[conceptos/vicsek]]
- [[conceptos/polarizacion_va]]
- [[conceptos/cell_index_method]]
- [[conceptos/condiciones_periodicas]]
- [[conceptos/transicion_de_fase]]
- [[metodos/vicsek_update]]

## Código y entregables

- Código: `raw/tps_pasados/TP2/`
- Informe entregado: `raw/informes_y_presentaciones/TP2/TP2_informe.pdf`
- Presentación entregada: `raw/informes_y_presentaciones/TP2/TP2_presentacion.pdf`
- Fuentes LaTeX: `raw/informes_y_presentaciones/TP2/fuentes_latex/`
