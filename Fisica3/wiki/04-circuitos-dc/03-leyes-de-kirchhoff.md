---
tags: [teoria, unidad-4, kirchhoff, nodos, mallas]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Leyes de Kirchhoff

Cuando una red de resistores y fuentes no se puede reducir a combinaciones simples de serie
y paralelo, se resuelve con las dos leyes de Kirchhoff: una para los nodos (conservación de
la carga) y otra para las mallas (conservación de la energía). Presuponen la
[[01-corriente-y-ley-de-ohm|ley de Ohm]] y la [[02-circuitos-de-corriente-directa|fem con
resistencia interna]].

## Ley de nodos

> **Ley de los nodos (ley de la unión).** En cualquier nodo del circuito, la suma de las
> corrientes es nula:
> $$\sum_{\text{nodo}} I = 0$$

Expresa que toda carga que entra a un nodo debe abandonarlo: no se acumula carga. Con el
criterio de signos habitual —corriente **entrante** positiva ($+I$) y **saliente** negativa
($-I$)—, un nodo al que llega $I_1$ y del que salen $I_2$ e $I_3$ cumple

$$I_1 = I_2 + I_3 \qquad\Longleftrightarrow\qquad I_1 - I_2 - I_3 = 0$$

## Ley de mallas

> **Ley de las mallas (ley de la espira).** La suma de las diferencias de potencial a lo
> largo de todos los elementos de cualquier malla (circuito cerrado) es nula:
> $$\sum_{\text{malla}} \Delta V = 0$$

Recorriendo una malla completa se vuelve al punto de partida, de modo que el potencial no
puede haber cambiado: las subidas y caídas de tensión se compensan.

## Convenciones de signo

Para aplicar la ley de mallas hay que fijar un sentido de recorrido y evaluar el signo de
cada $\Delta V = V_b - V_a$ al pasar de $a$ a $b$. Con el convenio de recorrer siempre de
$a$ hacia $b$:

| Elemento | Recorrido respecto de la corriente / polaridad | $\Delta V$ |
|---|---|---|
| Resistor | en el mismo sentido que la corriente | $-I\,R$ |
| Resistor | en sentido contrario a la corriente | $+I\,R$ |
| Fuente (fem) | del terminal $-$ al $+$ | $+\varepsilon$ |
| Fuente (fem) | del terminal $+$ al $-$ | $-\varepsilon$ |

**Observación.** Un resistor recorrido en el sentido de la corriente representa una caída de
potencial (signo negativo); recorrido en contra, una subida. En las fuentes el signo lo fija
la polaridad, no el sentido de la corriente.

## Receta para aplicar Kirchhoff

1. **Conceptualizar.** Diagramar el circuito indicando la polaridad de las fuentes e intentar
   visualizar la dirección de la corriente en cada rama.
2. **Categorizar.** Reducir el circuito lo más posible combinando resistores en serie o en
   paralelo antes de plantear ecuaciones.
3. **Analizar.** Asignar etiquetas a los valores conocidos y símbolos a los desconocidos, y
   asignar una dirección a la corriente en cada rama. Aunque esa asignación es arbitraria, hay
   que respetarla al aplicar las leyes. Plantear $N - 1$ ecuaciones de nodos (para $N$ nodos) y
   completar el sistema con ecuaciones de mallas hasta tener tantas ecuaciones como incógnitas.
4. **Finalizar.** Resolver el sistema y concluir con las respuestas. Si alguna corriente sale
   negativa, significa simplemente que su sentido real es opuesto al que se había asignado.

---

## Ver también

- [[01-corriente-y-ley-de-ohm]] — ley de Ohm y potencia
- [[02-circuitos-de-corriente-directa]] — fem, resistencia interna y reducción serie/paralelo
