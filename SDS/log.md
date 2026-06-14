# Bitácora

Registro append-only de operaciones sobre la wiki. Formato: `## [YYYY-MM-DD] <op> | <título>`.

Ops: `ingest`, `query`, `lint`, `setup`.

---

## [2026-06-08] setup | TP5 — entregables de la presentación (G05)

Producción de **todos los entregables** para la presentación del 12/06 del TP5
(simulador de tránsito peatonal colaborativo). Módulo G05 = vecinos / Cell Index
Method; escenario = aeropuerto.

**🟢 Páginas nuevas:**
- `wiki/tps/TP5.md` — página del TP: rol de G05, escenario aeropuerto, modelo CPM,
  barrido de caudal, cómo se midió y entregables.

**🟡 Páginas actualizadas:**
- `index.md` — TP5 marcado como entregable producido; agregada [[tps/TP5]].

**Trabajo en el repo del simulador** (`TP5_SDS/sim-dinamica-peatonal`, no en la wiki):
- Barrido tiempo-de-tránsito vs caudal de ingreso (5 caudales × 5 realizaciones),
  figura con barras de error → satura ~10 pax/min.
- Observables: distribución de tiempos de tránsito y de velocidades, mapa de densidad.
- 2 animaciones (10 y 24 pax/min). Presentación Beamer `presentacion/tp5_g5.pdf`
  (22 diapositivas, estilo TP2/TP3, lineamientos de [[conceptos/lecciones_correcciones]]).
- Cambios aditivos al simulador (gateados por env var, 126 tests verdes): sidecar de
  trayectoria con id de agente (`SIMPED_TRAJ`) y override de caudal (`SIMPED_RATE`).

## [2026-05-07] ingest | Teorica_4 + cruce con wiki TP4

Re-ingest de todo el material del TP4 + lectura completa de `Teorica_4.pdf` (45 páginas). Cruce con la wiki existente para detectar falencias.

**🔴 Errores encontrados y corregidos:**

1. **`metodos/gear_predictor_corrector.md`**: los α₀ estaban **invertidos**. Lo correcto (slides 28-29 de la teórica):
   - F(r) (sin velocidad): α₀ = **3/20**
   - F(r, v) (con velocidad): α₀ = **3/16**
   - Para TP4 Sistema 1 (F = -kr - γv): **3/16**.
   - Reescrita la página completa con tabla de coeficientes para órdenes 2-5 (ambos casos), inicialización analítica para fuerza elástica/oscilador, pseudocódigo.

2. **`conceptos/oscilador_amortiguado.md`**: faltaban los parámetros del TP4. Slide 36 confirma:
   - m = 70 kg, k = 10⁴ N/m, γ = 100 kg/s, t_f = 5 s
   - r(0) = 1 m, v(0) = -A·γ/(2m) ≈ -0.7143 m/s
   - A = 1 m
   - Solución: r(t) = A·exp(-(γ/2m)·t)·cos((k/m - γ²/4m²)^0.5·t)
   - Régimen subamortiguado (ζ ≈ 0.06), ω_d ≈ 11.93 rad/s, ~9.5 oscilaciones en t_f.

3. **`metodos/euler.md`**: confundía las 3 variantes que distingue la teórica. Reescrita:
   - Variante 1: Euler estándar (slide 9).
   - Variante 2: Euler modificado con v actualizada (slide 10).
   - Variante 3: Euler predictor-corrector (slide 23) — la que se ve en el gráfico de la teórica como "Euler-PC Modified" (slide 37).

**🟢 Páginas nuevas:**

- `metodos/velocity_verlet.md` — variante symplectic (slide 17), recomendable para TP4 Sistema 2.
- `metodos/leap_frog.md` — variante con v en medio-pasos (slide 16).
- `fuentes/teoria_4.md` — resumen detallado por slide range, con highlights críticos para TP4.

**🟡 Páginas actualizadas:**

- `tps/TP4.md` — agregados parámetros del oscilador, decisión de integradores, recomendación Velocity-Verlet para Sistema 2.
- `conceptos/integradores.md` — corregidas pendientes log-log esperadas (Gear orden 5 → ≈10), agregada sección "Verificación del error" (slide 34).
- `conceptos/dinamica_molecular_paso_temporal.md` — agregada suma de fuerzas con proyección normal/tangencial (slides 41-44).
- `fuentes/teoria_clases.md` — Teorica_4 marcada como leída.
- `index.md` — agregadas páginas nuevas, anotación sobre α₀ de Gear.

## [2026-05-06] ingest | TP2, TP3, TP4 (lote completo)

Ingest masivo de todo el material de TPs anteriores y enunciado del TP en curso.

**Fuentes leídas:**
- `raw/enunciados/TP2_enunciado.pdf`, `TP3_enunciado.pdf`, `TP4_enunciado.pdf`
- `raw/correcciones/TP2_correccion.txt`, `TP3_correccion.txt`
- `raw/tps_pasados/TP2/README.md` (overview del código TP2)
- `raw/tps_pasados/TP3/PROJECT.md` y `CLAUDE.md` (arquitectura TP3 detallada)
- Listado de PDFs de teoría y bibliografía

**Páginas creadas:**

TPs (3):
- `wiki/tps/TP2.md`, `TP3.md`, `TP4.md`

Conceptos (12):
- `wiki/conceptos/lecciones_correcciones.md` (centro de gravedad — feedback acumulado)
- `vicsek.md`, `polarizacion_va.md`, `cell_index_method.md`, `condiciones_periodicas.md`
- `edmd.md`, `lazy_invalidation.md`, `scanning_rate.md`, `perfiles_radiales.md`
- `dinamica_molecular_paso_temporal.md`, `integradores.md`, `oscilador_amortiguado.md`, `fuerza_elastica_blanda.md`

Métodos (7):
- `vicsek_update.md`, `tiempos_colision_edmd.md`, `colision_elastica_pp.md`
- `euler.md`, `verlet_original.md`, `beeman.md`, `gear_predictor_corrector.md`

Herramientas (2):
- `java.md`, `matplotlib.md`

Fuentes (10):
- `tp2_enunciado.md`, `tp2_correccion.md`, `tp2_informe.md`, `tp2_presentacion.md`, `tp2_codigo.md`
- `tp3_enunciado.md`, `tp3_correccion.md`, `tp3_presentacion.md`, `tp3_codigo.md`
- `tp4_enunciado.md`
- `teoria_clases.md` (catálogo de PDFs en `raw/teoria/`)

`index.md` actualizado con catálogo completo.

**Notas:**
- TP3 no tuvo informe (la cátedra solo pidió presentación + código).
- Las correcciones de TP2 (nota 6) y TP3 (nota 4.5) se sintetizaron en `lecciones_correcciones.md`. Esa página es lectura obligatoria antes de cada entrega.
- TP4 está en curso. Entrega 18/05/2026.

## [2026-05-06] setup | reorganización de raw/

- Creada `raw/informes_y_presentaciones/{TP2,TP3}/` con informes, presentaciones y fuentes LaTeX.
- Enunciados extraídos a `raw/enunciados/` y renombrados (`TPn_enunciado.pdf`).
- Correcciones extraídas a `raw/correcciones/` y renombradas (`TPn_correccion.txt`).
- Carpetas de proyecto renombradas: `TP2_SDS` → `TP2`, `TP3_SDS` → `TP3`.
- `Teorica_3_2026Q1 .pdf` → `Teorica_3.pdf`.
- Limpieza de archivos `.DS_Store`.
- `tps_pasados/TPn/` ahora contiene solo código y resultados crudos.

## [2026-05-06] setup | scaffold inicial

- Estructura de carpetas creada (`raw/`, `wiki/`).
- `CLAUDE.md` con schema y convenciones.
- `index.md` y `log.md` vacíos listos para poblar.
- Estado: TPs 1-3 hechos, arrancando TP4.
