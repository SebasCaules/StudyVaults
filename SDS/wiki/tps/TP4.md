---
tipo: tp
estado: en-curso
fecha_entrega: 2026-05-18
tags:
- dinamica-molecular
- paso-temporal
- integradores
- scanning-rate
fuentes:
- "fuentes/tp4_enunciado"
actualizado: 2026-05-06
---

# TP4 — Dinámica Molecular regida por el paso temporal

**Fecha de entrega**: 18/05/2026, 10 hs · **Estado**: 🟡 en curso · **Entregables**: presentación PDF + código (zip < 100 KB). **Sin informe**. **Animaciones embebidas en la presentación oral, sin link** (en el PDF entregado sí va link a YouTube/Vimeo).

> ⚠️ Para el Sistema 1: solo presentar **resultados** (sin intro/integradores/animaciones/conclusiones), en ~2 diapositivas, **antes** del Sistema 2, duración total < 1 minuto.

## Sistema 1 — Oscilador puntual amortiguado (solución analítica)

Ver [[conceptos/oscilador_amortiguado]] para ecuación, parámetros, CI y solución.

### Parámetros (slide 36 de la teórica)

| Símbolo | Valor |
|---------|-------|
| m | 70 kg |
| k | 10⁴ N/m |
| γ | 100 kg/s |
| t_f | 5 s |
| r(0) | 1 m |
| v(0) | -A·γ/(2m) = -100/140 ≈ -0.7143 m/s (con A=1) |

⚠️ **F = -k·r - γ·v depende de velocidad** ⇒ Gear orden 5 usa α₀ = **3/16** (no 3/20). Beeman usa la variante predictor-corrector (slide 20).

### Items

- **1.1** Integrar el oscilador con al menos:
  - [[metodos/gear_predictor_corrector]] orden 5  (α₀ = 3/16)
  - [[metodos/beeman]]  (versión predictor-corrector para F(v))
  - [[metodos/verlet_original]]  (no maneja F(v) directamente — alternativa: [[metodos/velocity_verlet]])
  - [[metodos/euler]]  (variante predictor-corrector — ver gráfico slide 37 de la teórica)
- **1.2** Graficar solución analítica + numérica para cada esquema. Calcular **ECM** (error cuadrático medio): suma de diferencias al cuadrado / nro de pasos.
- **1.3** ECM vs dt en escala log-log. ¿Cuál integrador es mejor para este sistema?

### Esperado

Gear orden 5 ≫ Beeman ≈ Verlet > Euler en precisión. Pendientes en log-log:
- Euler: ≈ 2 (orden 1 ⇒ ECM ~ Δt²)
- Verlet / Beeman / Velocity-Verlet: ≈ 4 (orden 2)
- Gear orden 5: ≈ 10

Ver [[conceptos/integradores]]. La teórica muestra el resultado típico en slide 37.

## Sistema 2 — Scanning rate con obstáculo fijo (continuación del [[tps/TP3]] pero con DM-paso-temporal)

Mismo sistema físico que TP3 Sistema 1, pero ahora resuelto con **DM regida por paso temporal** y **fuerza elástica blanda** entre partículas (no es event-driven, no son colisiones instantáneas).

### Geometría y parámetros

| Parámetro | Valor |
|-----------|-------|
| Diámetro recinto L | 80 m |
| Radio obstáculo r₀ | 1 m |
| Radio partícula r | 1 m |
| Masa m | 1 kg |
| v₀ (módulo inicial) | 1 m/s |
| Direcciones iniciales | uniformes [0, 2π) |
| N | [100, 1000] |
| k (constante elástica) | 10³ N/m (referencia); además {10², 10⁴, 10⁵} en 1.4 |

Ubicación inicial **sin superposición**.

### Fuerza elástica de a pares

```
Fᵢⱼ = -k · ξ · eᵢⱼ
ξ = rᵢ + rⱼ - |xᵢ - xⱼ|       (superposición)
eᵢⱼ = (xᵢ - xⱼ) / |xᵢ - xⱼ|
```

Solo activa si **ξ > 0** (partículas en contacto). Si ξ ≤ 0, fuerza = 0. Ver [[conceptos/fuerza_elastica_blanda]].

### Items

- **1.1** Tiempo de ejecución vs N para tf = 500 s (o el del TP3). **Comparar con TP3 en la misma figura**.
- **1.2** Conteo de cambios de estado: estado "fresca" → "usada" al **primer dt de contacto** con el obstáculo central; "usada" → "fresca" al chocar con el borde. Cfc(t) acumulado de cambios. J = pendiente del ajuste lineal de Cfc(t). ⟨J⟩(N) con barras de error. **Comparar con la figura correspondiente del TP3**.
  - **Nota crítica**: guardar Cfc(t) con resolución temporal **dt** (no dt₂). Los contactos duran muchos dt: solo cuenta el **primer dt del contacto**.
- **1.3** Perfiles radiales (igual que TP3 1.4): ⟨ρᶠⁱⁿ⟩(S), |⟨vᶠⁱⁿ⟩(S)|, Jᵢₙ(S) = producto. dS = 0.2 m, S desde el centro de la partícula fija. Solo partículas frescas con velocidad radial hacia el centro (xⱼ·vⱼ < 0).
  - Graficar Jᵢₙ(S) para **todos los N en una sola figura** con paleta gradual y **colorbar** (no leyenda).
  - Mostrar detalle de Jᵢₙ(S) en S ∈ [1.5, 5] m para identificar la zona donde el obstáculo cambia el régimen.
  - Promediar las capas cercanas al obstáculo y graficar Jᵢₙ, ⟨ρᶠⁱⁿ⟩, ⟨vᶠⁱⁿ⟩ vs N (1-2 figuras con doble eje y).
  - **Comparar Jᵢₙ con el resultado de TP3.**
- **1.4** Variar k = {10², 10³, 10⁴} (y 10⁵ si el cómputo lo permite). Validar dt con cada k. Comparar curvas ⟨J⟩(N) y ⟨Jᵢₙ|S~2⟩(N). Para cada una, identificar un escalar característico (ej. N* que maximiza ⟨J⟩, o max(⟨J⟩)) y graficarlo en función de k.
- **1.5 (Opcional)** Tiempo que tarda la primera partícula usada en alcanzar el borde, en función de k y N.

### Validación del dt

Para todos los items: graficar **evolución temporal de la energía total**. Si E_total no se mantiene aproximadamente constante (con la fluctuación esperable según el integrador), el dt es muy grande.

Heurística típica: dt ≪ 1/ω donde ω = √(k/m) es la frecuencia característica del contacto elástico. Para k = 10³ y m = 1: ω ≈ 31.6 rad/s ⇒ dt ≲ 10⁻³ s. Para k = 10⁵: dt ≲ 10⁻⁴ s o menor.

### dt₂ (snapshot)

Independiente del dt de integración: cada cuántos pasos se imprime el estado al output. Elegir según N para tener archivos manejables.

## Decisiones a tomar (grupo)

- Lenguaje: probablemente **Java** (consistencia con TP2/TP3). Definir.
- Integrador para Sistema 2 (F = -k·ξ depende solo de **posiciones**):
  - **[[metodos/velocity_verlet|Velocity-Verlet]]**: symplectic, conserva energía a largo plazo, simple. **Recomendable.**
  - **[[metodos/beeman|Beeman]]**: orden 3 en posición, similar precisión, predictor-corrector innecesario (F no depende de v).
  - **[[metodos/gear_predictor_corrector|Gear orden 5]]** con α₀ = **3/20**: máxima precisión. Implementación más compleja. Suele ser overkill.
  - Decidir después del Sistema 1.
- Integrador para Sistema 1 (F = -k·r - γ·v depende de **v**):
  - Hay que implementar al menos los 4 del enunciado.
  - Para Verlet original: documentar que "Verlet original asume F(r)" y usar variante (Velocity-Verlet o Beeman PC).
- Estrategia de detección de "primer dt de contacto" para Cfc: mantener flag por partícula (`enContactoConObstaculo`) que se setea al primer dt de ξ > 0 con el obstáculo y se limpia cuando ξ ≤ 0.
- Estructura de vecinos: con N hasta 1000 y rango de interacción corto (~2r), conviene [[conceptos/cell_index_method]] (heredable de TP2).

## Recordatorios desde correcciones previas

(de [[conceptos/lecciones_correcciones]])

- Animaciones embebidas en la presentación oral, **no fotos**.
- Para variable numérica como N: paleta gradual + colorbar, no leyenda categórica.
- En análisis de escalado (ej. tiempo vs N), usar log-log o semi-log antes de afirmar "exponencial" o "ley de potencia".
- Indicar número de realizaciones; la semilla NO es parámetro.
- En la presentación: animación → serie temporal → input vs observable, en ese orden, por estudio.
- Validar dt con la energía total (esto es nuevo de TP4 y es **explícito** en el enunciado).
- **Código entregado**: solo motor de simulación, sin postproc, sin viz, sin output, sin docs. **< 100 KB**.

## Conceptos asociados

- [[conceptos/dinamica_molecular_paso_temporal]]
- [[conceptos/integradores]]
- [[conceptos/oscilador_amortiguado]]
- [[conceptos/fuerza_elastica_blanda]]
- [[conceptos/scanning_rate]]
- [[conceptos/perfiles_radiales]]
- [[metodos/verlet_original]]
- [[metodos/velocity_verlet]]
- [[metodos/leap_frog]]
- [[metodos/beeman]]
- [[metodos/gear_predictor_corrector]]
- [[metodos/euler]]

## Bibliografía

- `raw/teoria/Teorica_4.pdf` — clase teórica del TP4.
- `raw/teoria/Biblio4/GearPaper_1.pdf` — paper original de Gear.
- `raw/teoria/Biblio4/A Gear-like Predictor-Corrector Method for Brownian Dynamics Simulation.pdf`
- `raw/teoria/Biblio4/Computer simulation methods - Heermann.djvu` — libro de referencia (Heermann).
