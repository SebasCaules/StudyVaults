---
tags: [teoria, unidad-9, termodinamica, dilatacion, esfuerzo-termico, conduccion]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 9
tipo: teoria
actualizado: 2026-07-05
---

# Procesos térmicos: dilatación, esfuerzo y conducción

Cuando un cuerpo cambia de temperatura sin cambiar de fase, aparecen efectos mecánicos: se
**dilata**, y si se le impide dilatarse se genera un **esfuerzo térmico**. Además, si dos regiones
están a distinta temperatura, hay un **flujo de calor por conducción** a través del material que
las separa. Esta página reúne esos tres procesos; la [[01-calorimetria|calorimetría]] y los
cambios de fase se tratan aparte.

## Expansión (dilatación) térmica

Si el cambio de temperatura no es muy grande, la variación de longitud $\Delta L$ de una barra es
proporcional a la variación de temperatura $\Delta T$:

> **Expansión térmica lineal.** Para una barra de longitud inicial $L_0$,
> $$\Delta L = \alpha\,L_0\,\Delta T \qquad\Longrightarrow\qquad L = L_0\,(1 + \alpha\,\Delta T)$$
> donde $\alpha$ es el **coeficiente de expansión lineal** del material y $L_0$ la longitud a la
> temperatura de referencia.

Para una superficie (dilatación en 2D) el efecto se **duplica** en el coeficiente: partiendo de un
área $S_0 = x\,y$,

$$\Delta S = 2\,\alpha\,S_0\,\Delta T$$

donde $S_0$ es el área inicial y $\alpha$ el mismo coeficiente de expansión lineal (aparece con un
factor 2 porque la superficie se dilata en dos direcciones).

## Esfuerzo térmico

Si se **sujetan los extremos** de una varilla y se varía su temperatura, la varilla no puede
dilatarse libremente y aparecen **esfuerzos de tensión o de compresión térmicos**. El punto de
partida es el **módulo de Young** $Y$, que relaciona el esfuerzo de tensión con la deformación:

$$Y = \frac{\text{esfuerzo de tensión}}{\text{deformación por tensión}} = \frac{F/A}{\Delta L/L_0} = \frac{F\,L_0}{A\,\Delta L}$$

donde $F$ es la fuerza aplicada, $A$ la sección transversal, $L_0$ la longitud inicial y $\Delta L$
el alargamiento. Como el alargamiento que la temperatura *querría* producir es
$\Delta L = \alpha L_0 \Delta T$, al reemplazarlo se obtiene directamente el esfuerzo necesario
para impedir esa dilatación:

$$\frac{F}{A} = Y\,\alpha\,\Delta T$$

Esta es la **fuerza por unidad de área** que soportan los apoyos que impiden la dilatación.

## Conducción térmica

Sea un material de espesor $L$ que separa dos espacios a temperaturas $T_1$ y $T_2$, con caras de
área $A$. Si $T_1 \neq T_2$, las caras no están en equilibrio y hay transferencia de calor a través
de la pared. El calor transferido depende de:

- el **material**,
- el **espesor** $L$,
- el **área** $A$ de las caras,
- la **diferencia de temperatura** entre las caras.

> **Flujo de calor (potencia calórica).** El calor por unidad de tiempo que atraviesa la pared es
> $$\phi = \frac{Q}{\Delta t} = \frac{\Delta T}{L}\,A\,K$$
> donde $\Delta T$ es la diferencia de temperatura entre las caras, $L$ el espesor, $A$ el área,
> $K$ la conductividad térmica del material y $\phi$ el flujo de calor.

Sus unidades son las de potencia:

$$[\phi] = \frac{\text{J}}{\text{s}} = \text{W}$$

La constante $K$ es la **conductividad térmica** (o coeficiente de conducción térmica) del
material. **Cuanto más grande es $K$, mejor conduce el calor el material**; un buen aislante tiene
$K$ chico.

**Observación.** En los problemas de barras conectadas, el mismo flujo $\phi$ atraviesa barras en
**serie** (se suman las "resistencias" $L/KA$), mientras que barras en **paralelo** suman sus
flujos. La comparación de cuál transfiere más calor sale de esta fórmula.

---

## Ver también

- [[01-calorimetria]] — calor, calor específico y cambios de fase
- [[03-primera-ley-gases-ideales]] — primera ley de la termodinámica y trabajo
- [[04-segunda-ley-entropia]] — segunda ley, máquinas térmicas y entropía
