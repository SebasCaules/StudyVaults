---
tags: [teoria, unidad-4, recubrimiento-minimo, dependencias-funcionales, normalizacion]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Recubrimiento mínimo

El **recubrimiento mínimo** (o *cobertura mínima*, $F_m$) de un conjunto de dependencias
funcionales $F$ es un conjunto equivalente a $F$ pero sin redundancias: mismas consecuencias, la
menor cantidad de dependencias y sin atributos de más. Es el punto de partida del algoritmo de
descomposición a **3NF**, porque garantiza que la descomposición preserve dependencias sin arrastrar
información repetida. Requiere manejar la [[04-dependencias-funcionales/02-clausura-y-claves-candidatas|clausura de atributos]].

## Definición

> **Definición.** Un conjunto $F_m$ es un **recubrimiento mínimo** de $F$ si cumple las tres
> condiciones:
> 1. $F_m^+ = F^+$ (es **equivalente** a $F$: infiere exactamente las mismas dependencias).
> 2. Toda dependencia de $F_m$ tiene **un solo atributo** en el lado derecho.
> 3. $F_m$ es **irreducible**: no se puede quitar ningún atributo de un lado izquierdo ni eliminar
>    ninguna dependencia entera sin cambiar la clausura.

Un mismo $F$ puede tener **varios** recubrimientos mínimos distintos según el orden en que se
apliquen las reducciones; todos son igualmente válidos.

## Algoritmo

> **Algoritmo (recubrimiento mínimo).**
> 1. **Lado derecho unitario.** Descomponer cada DF para que tenga un único atributo a la derecha
>    (regla de descomposición): $X \to A_1 \cdots A_k$ se reemplaza por las $k$ dependencias
>    $X \to A_i$.
> 2. **Izquierda irreducible.** Para cada DF $\alpha \to A$ con $\alpha$ compuesto, quitar todo
>    atributo **extraño**: $B \in \alpha$ es extraño si $A \in (\alpha - B)^+_F$. En ese caso se
>    reemplaza $\alpha \to A$ por $(\alpha - B) \to A$.
> 3. **Sin dependencias redundantes.** Eliminar toda DF $\alpha \to A$ tal que
>    $A \in (\alpha)^+_{F - \{\alpha \to A\}}$, es decir, la dependencia que se deduce del resto.

Los pasos 2 y 3 se apoyan en el cálculo de clausuras, y cada eliminación se hace **contra el estado
actual** del conjunto (después de las reducciones ya aplicadas).

## Ejemplo resuelto

Sea $R(A,B,C,D,E,G)$ con
$$\text{Dep} = \{\, DAE \to C,\;\; AB \to DC,\;\; ADE \to BG,\;\; C \to D,\;\; AE \to D \,\}$$

**Paso 1 — lado derecho unitario.** Separamos los lados derechos compuestos:
$$ADE \to C, \quad ADE \to B, \quad ADE \to G, \quad AB \to D, \quad AB \to C, \quad C \to D, \quad AE \to D$$

**Paso 2 — izquierda irreducible.** Analizamos el lado izquierdo $ADE$. Calculamos la clausura del
subconjunto $AE$:
$$(AE)^+ = \{A, E, D, C, B, G\}$$
Como $(AE)^+$ ya contiene $C$, $B$ y $G$, el atributo $D$ es **extraño** en $ADE \to C$, en
$ADE \to B$ y en $ADE \to G$: las tres se reducen a lado izquierdo $AE$. Reuniéndolas (regla de
unión) queda $AE \to BCG$, y como además ya teníamos $AE \to D$, el determinante $AE$ da
$AE \to DBCG$.

Para $AB \to D$: como $(AB)^+ = \{A,B,C,D\}$ y ya está $AB \to C$ con $C \to D$, la dependencia
$AB \to D$ se obtiene por transitividad ($AB \to C \to D$), así que **sobra**. Queda $AB \to C$.

**Resultado.**
$$F_m = \{\, AE \to DBCG,\;\; AB \to C,\;\; C \to D \,\}$$

**Verificación.** Comprobamos que $F_m$ sigue generando las dependencias originales calculando
clausuras bajo $F_m$:

- $ADE \to CBG$: &nbsp; $(ADE)^+_{F_m} = \{A, D, E, B, C, G\}$ &nbsp;✓
- $AB \to DC$: &nbsp; $(AB)^+_{F_m} = \{A, B, C, D\}$ &nbsp;✓

No hubo pérdida de dependencias: $F_m$ es equivalente al $\text{Dep}$ original.

## Uso en la descomposición a 3NF

El algoritmo de síntesis a **3NF** parte del recubrimiento mínimo: por cada dependencia de $F_m$ se
crea un subesquema con los atributos del determinante y del determinado. Por ejemplo, para un
esquema $R(A,\dots,H)$ cuyo recubrimiento mínimo resulta
$$F_m = \{\, BH \to F,\;\; BH \to C,\;\; BH \to E,\;\; A \to D,\;\; F \to A,\;\; F \to H,\;\; D \to G \,\}$$
se agrupan las dependencias con igual determinante y se obtienen los subesquemas
$R_1(B, H, F, C, E)$ con clave $BH$, $R_2(A, D)$ con clave $A$, $R_3(F, A, H)$ con clave $F$ y
$R_4(D, G)$ con clave $D$. Como cada subesquema conserva sus dependencias, la descomposición
**preserva dependencias**, que es la propiedad que asegura el recubrimiento mínimo.

> **Nota.** Cuando un ejercicio pide "el recubrimiento mínimo del conjunto **original**", se trabaja
> sobre las dependencias dadas, no sobre las que uno haya derivado en incisos previos: el resultado
> puede diferir del $F_m$ intermedio usado para descomponer.

---

## Ver también

- [[04-dependencias-funcionales/02-clausura-y-claves-candidatas]] — la clausura $X^+$ es el motor de los pasos 2 y 3 del algoritmo
- [[04-dependencias-funcionales/01-dependencias-funcionales-y-armstrong]] — las reglas de descomposición y unión que justifican el lado derecho unitario
