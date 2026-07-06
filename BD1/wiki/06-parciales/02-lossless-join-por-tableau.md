---
tags: [parcial, unidad-6, tableau, lossless-join, descomposicion, normalizacion]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 6
tipo: parcial
actualizado: 2026-07-05
---

# Verificación de lossless join por tableau

Descomponer un esquema en subesquemas es útil solo si la descomposición es **sin pérdida**
(*lossless join*): al volver a juntar los subesquemas con junta natural debe recuperarse exactamente
la relación original, ni una tupla de más ni de menos. El **método del tableau** decide esto de forma
mecánica y es el que piden los parciales cuando la descomposición tiene más de dos subesquemas o
cuando conviene mostrar el procedimiento paso a paso.

## Cuándo una descomposición no pierde

> **Definición.** Una descomposición de $R$ en $\{R_1, \dots, R_n\}$ es **sin pérdida** (lossless
> join) si para toda instancia $r$ que satisface las dependencias vale
> $$r = \pi_{R_1}(r) \bowtie \pi_{R_2}(r) \bowtie \cdots \bowtie \pi_{R_n}(r)$$
> Si la igualdad falla (aparecen tuplas espurias al rearmar), la descomposición es **con pérdida**.

Para el caso de **dos** subesquemas hay un criterio directo que conviene tener a mano como control:

> **Criterio (dos subesquemas).** La descomposición de $R$ en $R_1$ y $R_2$ es sin pérdida si y solo
> si el atributo común determina a uno de los dos lados:
> $$(R_1 \cap R_2) \to (R_1 - R_2) \in F^+ \quad \text{o} \quad (R_1 \cap R_2) \to (R_2 - R_1) \in F^+$$

El tableau generaliza esta idea a $n$ subesquemas y no exige recordar el criterio: se construye una
tabla y se la **persigue** (chase) con las dependencias.

## El método del tableau

> **Procedimiento (tableau de lossless).**
> 1. Armar una tabla con una **fila por subesquema** $R_i$ y una **columna por atributo** de $R$.
> 2. En la fila de $R_i$, poner el símbolo distinguido $a_j$ en cada columna del atributo $A_j$ que
>    **pertenece** a $R_i$; en las columnas restantes, un símbolo propio $b_{ij}$ (distinto en cada
>    celda).
> 3. **Perseguir** la tabla con cada DF $\alpha \to \beta$: si dos filas coinciden en todas las
>    columnas de $\alpha$, igualar sus valores en $\beta$ (si una es $a_j$, ganan ambas el $a_j$; si
>    no, se unifica a un mismo $b$).
> 4. Repetir hasta que ninguna DF produzca cambios. La descomposición es **sin pérdida** si y solo si
>    **alguna fila queda con todos los símbolos $a_j$** (una fila de puros distinguidos).

## Ejercicio resuelto

> **Enunciado.** Sea $R(A, D, E, N, S)$ con
> $$\text{Dep} = \{\, E \to S,\;\; DS \to N,\;\; A \to D \,\}$$
> Analizar si la descomposición $R_1(A, E, N, S)$ y $R_2(S, D)$ es con pérdida, usando tableau.

**Tabla inicial.** Distinguidos $a_1, \dots, a_5$ para las columnas $A, D, E, N, S$; el resto, $b_{ij}$:

| fila | $A$ | $D$ | $E$ | $N$ | $S$ |
|---|---|---|---|---|---|
| $R_1$ | $a_1$ | $b_{12}$ | $a_3$ | $a_4$ | $a_5$ |
| $R_2$ | $b_{21}$ | $a_2$ | $b_{23}$ | $b_{24}$ | $a_5$ |

La única columna que arranca igualada es $S$: ambos subesquemas contienen $S$, así que las dos filas
llevan $a_5$ ahí.

**Persecución.** Recorremos las DF buscando filas que coincidan en el lado izquierdo:

- $E \to S$: la columna $E$ tiene $a_3$ (fila $R_1$) y $b_{23}$ (fila $R_2$) — **no coinciden**, no
  aplica.
- $DS \to N$: en $D$ las filas valen $b_{12}$ y $a_2$ — **no coinciden**, no aplica.
- $A \to D$: en $A$ las filas valen $a_1$ y $b_{21}$ — **no coinciden**, no aplica.

Ninguna dependencia encuentra dos filas que coincidan en su izquierda, así que el tableau **no cambia**
y ninguna fila llega a tener todos los $a_j$.

> **Conclusión.** La descomposición es **con pérdida**. El tableau se estanca sin producir una fila de
> puros distinguidos, señal de que $R_1 \bowtie R_2$ genera tuplas espurias.

**Control con el criterio de dos subesquemas.** $R_1 \cap R_2 = \{S\}$ y $S^+ = \{S\}$ bajo
$\text{Dep}$ (ninguna DF tiene a $S$ solo como determinante: $DS \to N$ necesita también $D$). Como
$S^+$ no contiene ni $R_1 - R_2 = \{A, E, N\}$ ni $R_2 - R_1 = \{D\}$, ninguna de las dos condiciones
se cumple: **con pérdida**, coincidiendo con el tableau.

---

## Ver también

- [[06-parciales/01-tableau-chase-inferir-fd]] — el mismo tableau (chase) aplicado a inferir una DF en presencia de MVD
- [[06-parciales/04-parcial-integrador-normalizacion]] — descomposición a 3NF/BCNF donde se exige preservar sin pérdida
- [[04-dependencias-funcionales/02-clausura-y-claves-candidatas]] — la clausura $X^+$ que sostiene el criterio de los dos subesquemas
