---
tipo: concepto
tags:
- meta
- correcciones
- presentacion
- informe
fuentes:
- "fuentes/tp2_correccion"
- "fuentes/tp3_correccion"
actualizado: 2026-05-06
---

# Lecciones aprendidas de correcciones (G05)

Página viva. Acumula la guía implícita de la cátedra extraída de las correcciones de TP2 (nota 6) y TP3 (nota 4.5). **Leer antes de cada entrega.**

## ⚠️ Errores críticos (penalizan fuerte)

### TP3 — eventos vs paso fijo

> "El objetivo es trabajar con eventos. Se penaliza el uso de un reloj para la animación y presentación de los análisis. Esto se discutió en clase en repetidas ocasiones."

En un TP por eventos:
- La animación debe mostrar el sistema en los **tiempos de los eventos**, no en pasos fijos.
- Los análisis temporales deben respetar la lógica de eventos. Si se promedian evoluciones temporales de varias realizaciones (con eventos a tiempos distintos), **explicitar el método** (binning, interpolación, etc.).

En TP4 el paso fijo **sí** es válido (es DM con paso temporal), pero hay que **validar dt con la energía total**.

### TP3 — análisis de escalado

> "Su ajuste sin embargo no señala una exponencial, sino que la curva es cuadrática en la escala mostrada. Aún así, si fuese lineal en log-log, la función sería una Ley de Potencia, no una exponencial."

- Antes de afirmar "exponencial" o "ley de potencia", graficar en **semi-log** (y log, x lineal → exponencial sería recta) o **log-log** (ambas log → ley de potencia sería recta).
- Hacer ajuste a la forma funcional correcta.

## Presentación oral

- **Animaciones embebidas, no fotos**. La presentación oral debe correr la animación; el PDF entregable lleva fotograma + link a YouTube/Vimeo.
- **No mezclar escenarios/estudios**: para cada estudio, mostrar **(animación) → (serie temporal del observable) → (input vs observable escalar)**, en ese orden.
- **Sin índice** en presentaciones cortas (~13 min).
- **Sin diapositiva final de referencias**: las citas van inline en la diapositiva donde se mencionan, en una esquina.
- Las **figuras llevan título**.
- Las **condiciones / parámetros** de la simulación NO van en el título de la diapositiva. "Animación" tampoco es buen título.
- Bastan **2 animaciones** por estudio. No 5.
- Al pegar links, revisar que no se peguen caracteres no alfabéticos.
- **Practicar** la presentación antes. No improvisar contenido preparado.

## Figuras y gráficos

- Para variables **numéricas** (ej. N, η), usar **paleta gradual + colorbar**, no leyenda categórica.
- Evitar **sombreado** en figuras muy cargadas.
- **Combinar curvas relacionadas** (ej. ρ y v en un mismo plot con doble eje y) o repartir en más slides cuando son muchas.
- Las **barras de error** tienen que verse: si la marca está dentro del marker, mencionarlo o agrandar.
- Para análisis de escala: **log-log** o **semi-log** explícito.

## Redacción del informe / texto

- Las **conclusiones** deben ser frases compactas, no símbolos ni "límites". Ej: "La polarización disminuye monótonamente con el aumento del ruido" ✅, no "vₐ → 0 cuando η → η_c" ❌ como conclusión principal.
- **Asegurarse de que toda afirmación esté EXPLÍCITAMENTE soportada por los datos** del informe. No saltar a conclusiones sin haber hecho el análisis correspondiente. Ej (TP2): no se puede concluir que "un líder no modifica la dinámica colectiva" sin haber calculado correlación entre el ángulo del líder y el sistema.
- Oraciones cortas. No concatenar frases complejas.
- Introducir las figuras antes de hablar de sus conclusiones (ej. estado estacionario).

## Estructura del informe (de la corrección TP2)

- **Introducción**: incluir dependencia temporal en las ecuaciones (ej. parámetro de orden).
- **Implementación**: arquitectura del **código**. NO van valores numéricos de parámetros (L, rₒ, etc.) acá.
- **Simulaciones**: acá van los valores de parámetros de las corridas. La **semilla** y el **tiempo de simulación** NO son parámetros físicos del sistema (no afectan la dinámica). Indicar **número de realizaciones**.
- **Resultados**: introducir cada figura, luego analizarla. No mencionar conclusiones (estado estacionario, etc.) antes de mostrar la figura.
- Para movimientos definidos por el grupo (ej. líder circular): no derivar fórmulas si no se van a usar. Basta "movimiento circular de radio R y velocidad angular ω = v/R".

## Variables y notación

- En autómatas tipo Vicsek: la actualización es `θ(t+Δt)`, no `θ(t+1)`. Usar `atan2`, no `atan`.
- "Asintótico" ≠ "estacionario". Para el valor del estacionario decir **"valor promedio durante el periodo estacionario"**.
- **Definir las variables antes de usarlas**. No referenciar Cfc, Fu, M, T, n^in_k(S,t) sin haberlas introducido.
- **Casos borde**: explicitar qué pasa cuando la fórmula tiene 0 en el denominador o el conjunto está vacío.

## Estado estacionario / promedios

- Mostrar **gráficamente** la ventana temporal usada para promediar. No basta describirla en texto.
- Empezar a promediar **lo antes posible** una vez que el sistema entró en el estacionario. En TP2 nos dijeron "t = 500 es muy tarde".

## Código a entregar

- **Solo el motor de simulación**. No incluir:
  - postproc / análisis
  - visualizadores
  - outputs / resultados
  - figuras
  - documentación extra
  - versiones previas
- TP3/TP4: **zip < 100 KB**.

## Aplicación a TP4

Checklist específico para no repetir errores:
- [ ] Validar dt graficando energía total.
- [ ] Para Sistema 1 (oscilador): solo resultados, ~2 slides, < 1 min, antes del Sistema 2.
- [ ] Animaciones embebidas en la presentación oral.
- [ ] Para N: paleta gradual + colorbar.
- [ ] Análisis de tiempo de ejecución vs N: log-log o semi-log antes de afirmar comportamiento.
- [ ] Comparar siempre con TP3 cuando el enunciado lo pida (1.1 Sistema 2, y 1.3 Jᵢₙ).
- [ ] Indicar número de realizaciones.
- [ ] Definir todas las variables antes de usarlas.
- [ ] Conclusiones soportadas por datos mostrados.
- [ ] Código entregado < 100 KB, solo motor.
- [ ] Practicar la presentación.
