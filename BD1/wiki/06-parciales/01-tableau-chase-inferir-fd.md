---
tags: [parcial, unidad-6, tableau, chase, dependencias-multivaluadas, inferencia]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 6
tipo: parcial
actualizado: 2026-07-05
---

# Método del tableau para inferir una DF (chase)

Cuando el conjunto de dependencias mezcla **dependencias funcionales** (DF) y **dependencias
multivaluadas** (MVD), decidir si una nueva DF $X \to A$ se infiere no siempre se resuelve con una
clausura de atributos: hace falta el **chase** (método del *tableau*). La idea es arrancar de dos
tuplas que coinciden en $X$ y aplicar todas las dependencias hasta ver si quedan **forzadas** a
coincidir también en $A$. Este es uno de los ejercicios recurrentes de los segundos parciales.

## La técnica

> **Procedimiento (chase para $X \to A$).** Para decidir si un conjunto de DF y MVD implica la
> dependencia funcional $X \to A$:
> 1. Armar dos tuplas que **coincidan en $X$** y difieran en todos los demás atributos (símbolos
>    con subíndice distinto).
> 2. Aplicar repetidamente las dependencias del conjunto:
>    - una **MVD** $Y \twoheadrightarrow Z$ sobre tuplas que coinciden en $Y$ **agrega** las tuplas
>      que resultan de intercambiar el bloque $Z$ contra su complemento $R - Y - Z$;
>    - una **DF** $Y \to W$ sobre tuplas que coinciden en $Y$ **iguala** sus valores en $W$ (renombra
>      un símbolo por otro en toda la tabla).
> 3. La DF $X \to A$ **se infiere** si y solo si, al cerrar el proceso, las dos tuplas iniciales
>    quedan forzadas a coincidir en $A$.

Si en cambio el proceso termina sin igualar los dos valores de $A$, la instancia construida es un
**contraejemplo**: satisface todas las dependencias del conjunto pero no $X \to A$.

## Ejercicio resuelto

> **Enunciado.** Sea $R(A, P, M, U, J, T)$ con
> $$\text{Dep} = \{\, U \to A,\;\; MJ \twoheadrightarrow PT,\;\; PT \twoheadrightarrow UM \,\}$$
> ¿Puede inferirse la dependencia $MJ \to A$? Si es afirmativo, demostrarlo.

Aplicamos el chase para $MJ \to A$. Ordenamos las columnas como $M\,J\,A\,P\,T\,U$.

**Paso 0 — dos tuplas que coinciden en $MJ$.** Difieren en todo lo demás:

| fila | $M$ | $J$ | $A$ | $P$ | $T$ | $U$ |
|---|---|---|---|---|---|---|
| $r_1$ | $m$ | $j$ | $a_1$ | $p_1$ | $t_1$ | $u_1$ |
| $r_2$ | $m$ | $j$ | $a_2$ | $p_2$ | $t_2$ | $u_2$ |

**Paso 1 — aplicar $MJ \twoheadrightarrow PT$.** $r_1$ y $r_2$ coinciden en $MJ$; el complemento de
$PT$ (respecto de $MJ$) es $\{A, U\}$. Intercambiando el bloque $PT$ contra el bloque $AU$ se agregan:

| fila | $M$ | $J$ | $A$ | $P$ | $T$ | $U$ |
|---|---|---|---|---|---|---|
| $r_3$ | $m$ | $j$ | $a_2$ | $p_1$ | $t_1$ | $u_2$ |
| $r_4$ | $m$ | $j$ | $a_1$ | $p_2$ | $t_2$ | $u_1$ |

**Paso 2 — aplicar $PT \twoheadrightarrow UM$.** Las filas $r_1$ y $r_3$ coinciden en $PT = (p_1, t_1)$;
el complemento es $\{A, J\}$. Intercambiando el bloque $UM$ se agrega una tupla con
$UM = (u_1, m)$ tomado de $r_1$ y el resto de $r_3$:

| fila | $M$ | $J$ | $A$ | $P$ | $T$ | $U$ |
|---|---|---|---|---|---|---|
| $r_5$ | $m$ | $j$ | $a_2$ | $p_1$ | $t_1$ | $u_1$ |

**Paso 3 — aplicar $U \to A$ (el paso decisivo).** Las filas con $U = u_1$ son $r_1$ (con $A = a_1$),
$r_4$ ($A = a_1$) y la recién nacida $r_5$ ($A = a_2$). La DF $U \to A$ obliga a que todas tengan el
mismo valor de $A$: se **iguala** $a_2 = a_1$, renombrando $a_2$ por $a_1$ en toda la tabla.

Con $a_1 = a_2$, las dos tuplas de partida $r_1$ y $r_2$ ahora **coinciden en $A$**. Por lo tanto:

> **Conclusión.** $MJ \to A$ **se infiere** de $\text{Dep}$. El chase la fuerza: la MVD
> $MJ \twoheadrightarrow PT$ genera una tupla que, vía $PT \twoheadrightarrow UM$, comparte $u_1$ con
> $r_1$, y $U \to A$ colapsa entonces $a_1$ y $a_2$.

**Consecuencia para las claves.** Como $MJ \to A$ es válida, al calcular las claves de $R$ se trabaja
con $F = \{\, U \to A,\; MJ \to A \,\}$. Clasificando atributos, $\{U, M, J\}$ aparecen solo a la
izquierda, $A$ solo a la derecha, y $P, T$ no aparecen en ninguna DF (van en toda clave). El núcleo
$UMJPT$ cumple $(UMJPT)^+ = \{U, M, J, P, T, A\} = R$, así que la **única clave** es $UMJPT$.

> **Nota.** El mismo esquema del chase sirve para el objetivo inverso: si el proceso termina sin
> igualar $A$, la tabla final es una **instancia** que satisface $\text{Dep}$ pero no $X \to A$, es
> decir, el contraejemplo pedido.

---

## Ver también

- [[06-parciales/03-mvd-y-coalescencia]] — regla de coalescencia: derivar una DF de una MVD sin construir el tableau completo
- [[06-parciales/02-lossless-join-por-tableau]] — el mismo tableau, aplicado a decidir si una descomposición pierde información
- [[04-dependencias-funcionales/02-clausura-y-claves-candidatas]] — cálculo de claves con el método de la tabla, usado en el cierre del ejercicio
