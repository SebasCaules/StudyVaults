---
tipo: fuente
archivo: "raw/correcciones/TP3_correccion.txt"
nota: 4.5
tags:
- tp3
- correccion
actualizado: 2026-05-06
---

# Fuente — Corrección TP3 (G05)

📄 `raw/correcciones/TP3_correccion.txt` · **Nota: 4.5**

## Crítica principal (al inicio)

> "El objetivo es trabajar con eventos. Se penaliza en su presentación y trabajo el uso de un reloj para la animación y presentación de los análisis. Esto se discutió en clase en repetidas ocasiones."

Esto fue lo que más bajó la nota: **animación con paso fijo en un TP de eventos**, y **falta de explicación** sobre cómo se promedian evoluciones temporales con eventos a tiempos distintos.

## Comentarios por diapositiva (D4 a D31)

- D4: Faltó cómo se actualizan velocidades tras choque + cómo se calcula tiempo entre eventos. Bien aclarar masa infinita en obstáculo fijo.
- D6: Variables (Cfc, Fu) usadas antes de introducirse.
- D7: t_e referenciado sin haber sido introducido en D4.
- D8: Bien diagrama simplificado.
- D11: Faltó explicar cómo se calcula J (ajuste lineal) y cómo se promedia (cuántas realizaciones).
- D12: "Asintótico" mal usado: es **promedio durante el estacionario**.
- D13: M, T, n^in_k(S,t) no definidos. ¿Qué pasa si N_capa = 0 en velocidad promedio?
- D14: N basta como rango. Tiempos finales no son parámetros.
- D16-21: Demasiadas animaciones (5), bastan 2. Links con caracteres mal pegados.
- 🔴 **D16-21 (crítico)**: animación NO está hecha por eventos sino con paso temporal fijo.
- D22: Barra de error no se aprecia. Si quieren mostrar exponencial, escala log o semi-log.
- D23: La curva mostrada es cuadrática, no exponencial. Si en log-log es lineal, es ley de potencia, no exponencial.
- D24, D26, D28: Usar paleta gradual + colorbar para variables numéricas como N.
- D26: ¿Cómo promedian con eventos a tiempos distintos? Faltó.
- D31: Tiempo de ejecución parece ley de potencia, no exponencial. ¿Por qué Fest menos variable a mayor N? No se ve. No se comparó scanning rate global con J de anillos pequeños.

## Comentarios finales

- Presentación oral: practicar antes, no improvisar contenido preparado.
- Código: **solo motor de simulación**, sin visualizadores ni código de análisis.

## Lecciones para [[tps/TP4]]

- TP4 sí es paso fijo (es DM con paso temporal), pero **validar dt con energía total**.
- Si Cfc(t) crece, tomar pendiente con ajuste lineal **explícito** (mostrar cómo). Reportar N realizaciones.
- Para N: paleta gradual + colorbar.
- En log-log o semi-log antes de afirmar comportamiento.
- Definir TODAS las variables antes de usarlas.
- 2 animaciones, no 5.
- Código entregado: solo motor, < 100 KB.
- Comparar siempre con TP3 cuando el enunciado lo pida.

## Páginas que toca

- [[tps/TP3]]
- [[tps/TP4]]
- [[conceptos/lecciones_correcciones]] (centro de gravedad)
