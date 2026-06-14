# Índice — Wiki SDS

Catálogo de toda la wiki. Actualizado en cada ingest.

## Estado del curso

- **TPs entregados**: [[tps/TP2]] (nota 6), [[tps/TP3]] (nota 4.5)
- **TP en curso**: 🟢 [[tps/TP5]] — presentación 12/06/2026 (entregables producidos)
- **TPs anteriores**: 🟡 [[tps/TP4]] — DM por paso temporal

## ⚠️ Lectura obligatoria antes de cada entrega

- [[conceptos/lecciones_correcciones]] — checklist con feedback de las correcciones de TP2 y TP3.

---

## TPs

- [[tps/TP2]] — Off-lattice / Vicsek (entregado, nota 6)
- [[tps/TP3]] — EDMD (entregado, nota 4.5)
- [[tps/TP4]] — DM por paso temporal
- [[tps/TP5]] — Simulador de tránsito peatonal (G05: vecinos/CIM, escenario aeropuerto)

## Conceptos

- [[conceptos/lecciones_correcciones]] — guía implícita de la cátedra extraída de las correcciones
- [[conceptos/vicsek]] — modelo off-lattice de bandadas
- [[conceptos/polarizacion_va]] — observable principal del Vicsek
- [[conceptos/cell_index_method]] — vecinos en O(N)
- [[conceptos/condiciones_periodicas]] — PBC e imagen mínima
- [[conceptos/edmd]] — dinámica molecular dirigida por eventos
- [[conceptos/lazy_invalidation]] — invalidación lazy de eventos en EDMD
- [[conceptos/scanning_rate]] — observable J de TP3/TP4
- [[conceptos/perfiles_radiales]] — Jᵢₙ(S), ⟨ρ⟩(S), ⟨v⟩(S)
- [[conceptos/dinamica_molecular_paso_temporal]] — DM con dt fijo
- [[conceptos/integradores]] — comparación de esquemas para TP4 Sistema 1
- [[conceptos/oscilador_amortiguado]] — sistema con solución analítica del TP4
- [[conceptos/fuerza_elastica_blanda]] — F = -kξ usado en TP4 Sistema 2

## Métodos / algoritmos

- [[metodos/vicsek_update]] — paso del Vicsek (synchronous, atan2, vecinos periódicos)
- [[metodos/tiempos_colision_edmd]] — fórmulas de tc para PP / obstáculo / pared
- [[metodos/colision_elastica_pp]] — operador de colisión elástica
- [[metodos/euler]] — integrador orden 1 (3 variantes de la teórica)
- [[metodos/verlet_original]] — integrador orden 2 (reversible)
- [[metodos/leap_frog]] — variante de Verlet con v en medio-pasos
- [[metodos/velocity_verlet]] — variante symplectic, r y v en mismo `t`
- [[metodos/beeman]] — integrador orden 3, soporta F(x, v)
- [[metodos/gear_predictor_corrector]] — predictor-corrector orden 5 (α₀: 3/20 si F(r), 3/16 si F(r,v))

## Herramientas

- [[herramientas/java]] — convenciones del grupo (Java 11+, Swing, output .txt)
- [[herramientas/matplotlib]] — plantillas de gráficos para postproc

## Fuentes (resúmenes de material en `raw/`)

### Enunciados

- [[fuentes/tp2_enunciado]] — `raw/enunciados/TP2_enunciado.pdf`
- [[fuentes/tp3_enunciado]] — `raw/enunciados/TP3_enunciado.pdf`
- [[fuentes/tp4_enunciado]] — `raw/enunciados/TP4_enunciado.pdf`

### Correcciones

- [[fuentes/tp2_correccion]] — nota 6
- [[fuentes/tp3_correccion]] — nota 4.5

### Informes / presentaciones

- [[fuentes/tp2_informe]] — entregado
- [[fuentes/tp2_presentacion]] — entregado (Beamer)
- [[fuentes/tp3_presentacion]] — entregado (Beamer). TP3 no tuvo informe.

### Código

- [[fuentes/tp2_codigo]] — Java + Swing
- [[fuentes/tp3_codigo]] — Java 11 + Maven, EDMD

### Teoría

- [[fuentes/teoria_clases]] — catálogo de Teóricas 0-4 + bibliografía
- [[fuentes/teoria_4]] — ✅ Teórica 4 leída íntegra (DM paso temporal, integradores, oscilador)
