---
tags: [parcial, unidad-6, dependencias-multivaluadas, coalescencia, inferencia, normalizacion]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 6
tipo: parcial
actualizado: 2026-07-05
---

# Dependencias multivaluadas y coalescencia en parciales

Las **dependencias multivaluadas** (MVD) aparecen en los segundos parciales de dos formas: como una
**MVD que hay que convertir en una DF** mediante la regla de **coalescencia**, y como el pedido de
**construir una instancia** que satisfaga una MVD pero no otra. Esta página reúne los dos usos con sus
ejercicios resueltos.

## MVD: definición operativa

> **Definición.** $X \twoheadrightarrow Y$ (leída "$X$ multidetermina a $Y$") vale en una relación si,
> para dos tuplas cualesquiera que coinciden en $X$, se puede **intercambiar el bloque $Y$** contra su
> complemento $R - X - Y$ y las tuplas resultantes también pertenecen a la relación. Es decir, dado
> $X$, el conjunto de valores de $Y$ es **independiente** del de $R - X - Y$.

## Coalescencia: de una MVD a una DF

La regla de **coalescencia** combina una MVD con una DF para producir una DF nueva. Es la que permite,
en un ejercicio de claves, "bajar" una MVD del enunciado a una dependencia funcional utilizable.

> **Regla (coalescencia).** Si vale $X \twoheadrightarrow Y$ y existe una DF $W \to Z$ tal que
> $Z \subseteq Y$ y $W \cap Y = \varnothing$, entonces vale la DF
> $$X \to Z$$

### Ejercicio: derivar DF de una MVD del enunciado

> **Enunciado (fragmento).** Sea $R(A, B, C, D, E, F, G, H)$ con dependencias que incluyen
> $BH \twoheadrightarrow AG$, $A \to D$, $D \to G$ y $F \to AH$.

Partimos de la MVD $BH \twoheadrightarrow AG$, con $X = BH$ e $Y = AG$:

- Con $D \to G$: acá $Z = G \subseteq AG$ y $W = D$ cumple $D \cap AG = \varnothing$. Por
  coalescencia, $BH \to G$.
- Con $F \to A$ (que sale de $F \to AH$ por descomposición): $Z = A \subseteq AG$ y
  $F \cap AG = \varnothing$. Por coalescencia, $BH \to A$.

Así, la MVD $BH \twoheadrightarrow AG$ aporta las DF $BH \to A$ y $BH \to G$, que después se usan para
hallar las claves y descomponer. Este es el arranque del
[[06-parciales/04-parcial-integrador-normalizacion|parcial integrador]].

### Ejercicio: inferir una DF con coalescencia

> **Enunciado.** Sea $R(Z, Q, N, J, F)$ con
> $$\text{Dep} = \{\, ZF \twoheadrightarrow JZ,\;\; Q \twoheadrightarrow JN,\;\; Z \to J \,\}$$
> ¿Puede inferirse $Q \to J$? Demostrarlo con axiomas o dar contraejemplo.

Tomamos la MVD $Q \twoheadrightarrow JN$, con $X = Q$ e $Y = JN$. Buscamos una DF cuyo lado derecho
esté dentro de $Y$ y cuyo lado izquierdo no toque $Y$:

- $Z \to J$: aquí $Z = \{J\} \subseteq JN$ (el determinado) y $W = \{Z\}$ cumple
  $Z \cap JN = \varnothing$.

Por coalescencia, $Q \to J$.

> **Conclusión.** $Q \to J$ **se infiere**. La MVD $Q \twoheadrightarrow JN$ multidetermina $J$, y la
> DF $Z \to J$ (con $Z$ disjunto de $JN$) la coalesce en la DF $Q \to J$.

## Construir una instancia que separe dos MVD

> **Enunciado.** Sea $R(A, B, C, D, E, G, H)$ con $\text{Dep} = \{\, AB \twoheadrightarrow CDE \,\}$.
> Proponer una instancia de **exactamente dos tuplas** que satisfaga $\text{Dep}$ pero **no** la MVD
> $AB \twoheadrightarrow CD$. Indicar qué tuplas faltan por las que $AB \twoheadrightarrow CD$ no se
> satisface.

Basta con dos tuplas que coincidan en $AB$ y muevan **en bloque** todo $CDE$:

| $A$ | $B$ | $C$ | $D$ | $E$ | $G$ | $H$ |
|---|---|---|---|---|---|---|
| $a_1$ | $b_1$ | $c_1$ | $d_1$ | $e_1$ | $g_1$ | $h_1$ |
| $a_1$ | $b_1$ | $c_2$ | $d_2$ | $e_2$ | $g_1$ | $h_1$ |

Esta instancia **satisface** $AB \twoheadrightarrow CDE$: al intercambiar el bloque $CDE$ entre las
dos tuplas se obtienen las mismas dos filas, así que no hace falta agregar nada.

En cambio, **no satisface** $AB \twoheadrightarrow CD$: esa MVD exige poder mover $CD$ **independiente
de $E$**, lo que obligaría a que también estuvieran presentes las tuplas donde $CD$ se intercambia pero
$E$ se queda:

| $A$ | $B$ | $C$ | $D$ | $E$ | $G$ | $H$ |
|---|---|---|---|---|---|---|
| $a_1$ | $b_1$ | $c_1$ | $d_1$ | $e_2$ | $g_1$ | $h_1$ |
| $a_1$ | $b_1$ | $c_2$ | $d_2$ | $e_1$ | $g_1$ | $h_1$ |

Como estas dos tuplas **faltan**, $AB \twoheadrightarrow CD$ queda violada. (Para que sí se cumpliera,
la instancia debería tener las cuatro filas: las dos originales más estas dos.)

> **Nota.** La clave del ejercicio es que $CDE$ se mueve como un solo bloque, pero $CD$ solo no: al
> "pegar" $E$ a $CD$, separar $CD$ de $E$ pediría tuplas que no están.

---

## Ver también

- [[06-parciales/01-tableau-chase-inferir-fd]] — cuando la coalescencia no alcanza, el chase decide la inferencia de una DF
- [[06-parciales/04-parcial-integrador-normalizacion]] — dónde $BH \to A$ y $BH \to G$ (obtenidas acá) alimentan el cálculo de claves
- [[04-dependencias-funcionales/01-dependencias-funcionales-y-armstrong]] — axiomas de Armstrong para DF puras
