---
tags: [tecnica, unidad-5, arden, expresiones-regulares, ecuaciones-de-estado]
fuentes:
  - raw/parciales/parcial-1-resuelto.pdf
  - raw/practicas/tla-practica.pdf
unidad: 5
tipo: tecnica
actualizado: 2026-07-05
---

# De autómata finito a expresión regular (método de Arden)

El **método de Arden** obtiene una [[01-expresiones-regulares|expresión regular]] a partir de un
autómata finito, planteando **una ecuación por estado** y resolviéndolas con la regla de Arden.
Es la vía usada en la cursada para mostrar que una ER dada describe el lenguaje de un autómata.

## Regla de Arden

> **Proposición (regla de Arden).** Sean $A$ y $B$ expresiones regulares con $\lambda \notin L(A)$.
> La ecuación
> $$X = A\,X + B$$
> tiene solución
> $$X = A^{*}B$$

## Procedimiento

Dado un autómata finito, posiblemente **no determinista y con transiciones $\lambda$**, se
procede así:

1. **Clausuras $\lambda$.** Se calcula la clausura-$\lambda$ de cada estado (todos los estados
   alcanzables leyendo solo $\lambda$). La clausura del estado inicial marca el estado inicial
   del AFD equivalente.
2. **Construcción de subconjuntos.** Se arma el AFD equivalente por el método del **conjunto de
   alcanzables**: cada estado del AFD es un conjunto de estados del original, y se completa su
   tabla de transición.
3. **Minimización.** Se reducen los estados por clases de equivalencia hasta la forma mínima.
4. **Ecuaciones de estado.** Se asigna una incógnita a cada estado. La ecuación de un estado $X$
   es la suma de $c\,Y$ por cada transición $X \xrightarrow{c} Y$, más $\lambda$ si $X$ es
   **final**:
   $$X = \sum_{X \xrightarrow{c} Y} c\,Y \;\; (+\; \lambda \ \text{si } X \in F)$$
   Cada incógnita representa el conjunto de cadenas que, desde ese estado, llevan a un estado
   final.
5. **Resolución.** Se despejan las incógnitas por sustitución, aplicando la **regla de Arden**
   cada vez que una variable aparece en ambos lados, y las identidades del álgebra de ER. La ER
   buscada es la incógnita del **estado inicial**.

## Ejemplo completo — la ER $bb^{*}a^{*}$

Se parte del autómata $M = \langle \{a,b\}, \{p,q,r,s,t,u\}, \delta, p, \{q,u\}\rangle$, con
estado inicial $p$, finales $q$ y $u$, y la tabla (incluye columna $\lambda$):

| $\delta$ | $a$ | $b$ | $\lambda$ |
|---|---|---|---|
| $\to p$ | $\emptyset$ | $\{q\}$ | $\{s\}$ |
| $q$ (\*) | $\{t,u\}$ | $\emptyset$ | |
| $r$ | $\emptyset$ | $\{r,u\}$ | |
| $s$ | $\emptyset$ | $\{r\}$ | |
| $t$ | $\{u\}$ | $\emptyset$ | |
| $u$ (\*) | $\emptyset$ | $\emptyset$ | $\{t\}$ |

**Paso 1 — clausuras $\lambda$.** Las clausuras son $\text{Cl}(p) = \{p,s\}$, $\text{Cl}(u) = \{u,t\}$
y $\text{Cl}(x) = \{x\}$ para el resto. El estado inicial del AFD es $S = \text{Cl}(p) = \{p,s\}$.

**Pasos 2–3 — AFD por subconjuntos y minimización.** La construcción de subconjuntos genera los
estados $S = \{p,s\}$, $A = \{q,r\}$, $B = \{t,u\}$ y $C = \{r,t,u\}$ (más el estado trampa
$\emptyset$). La minimización identifica $A$ y $C$ en una misma clase de equivalencia (ambos son
finales y sus transiciones caen en las mismas clases), y el AFD mínimo —llamando $A$ a esa clase—
queda:

| $\delta$ | $a$ | $b$ |
|---|---|---|
| $\to S$ | $\emptyset$ | $A$ |
| $A$ (\*) | $B$ | $A$ |
| $B$ (\*) | $B$ | $\emptyset$ |

Son finales $A$ (contiene a $q$) y $B$ (contiene a $u$).

**Paso 4 — ecuaciones de estado.** Una incógnita por estado; se agrega $\lambda$ a los finales:

1. $S = bA$
2. $A = aB + bA + \lambda$
3. $B = aB + \lambda$

**Paso 5 — resolución.** Se despeja de abajo hacia arriba. En (3), Arden con la parte $aB$ y el
término $\lambda$:
$$B = a^{*}\lambda = a^{*}$$

Se sustituye en (2) y se agrupa la incógnita $A$:
$$A = a\,a^{*} + bA + \lambda = bA + (a\,a^{*} + \lambda)$$
Arden con $A$ da $A = b^{*}(a\,a^{*} + \lambda)$, y como $a\,a^{*} + \lambda = a^{*}$:
$$A = b^{*}a^{*}$$

Finalmente se lleva a (1):
$$S = bA = b\,b^{*}a^{*} = bb^{*}a^{*}$$

La incógnita del estado inicial es $bb^{*}a^{*}$: esa es la ER que describe el lenguaje de $M$.

## Más casos resueltos

Los mismos pasos resuelven los ejercicios de la cursada en que se pide mostrar que una ER
describe el lenguaje de un autómata. En cada uno se llega, tras las clausuras $\lambda$, la
construcción de subconjuntos y la minimización, al sistema de ecuaciones de estado y se lo
resuelve por Arden:

| Sistema de ecuaciones de estado | ER resultante |
|---|---|
| $A = aB + bC$;&nbsp; $B = aD$;&nbsp; $C = aE + \lambda$;&nbsp; $D = aE + bB + \lambda$;&nbsp; $E = bC$ | $(a(ab)^{*}a + b)(ab)^{*}$ |
| $S = aA$;&nbsp; $A = aB + bC + \lambda$;&nbsp; $B = bD$;&nbsp; $C = aS + bC$;&nbsp; $D = aB + \lambda$ | $(abb^{*}a)^{*}a(ab)^{*}$ |
| $S = aA + bS + \lambda$;&nbsp; $A = bC$;&nbsp; $C = bC + \lambda$ | $b^{*}(ab^{*}b + \lambda)$ |

Como muestra del último caso: de $C = bC + \lambda$ sale $C = b^{*}$; entonces $A = bC = bb^{*}$;
y sustituyendo en $S = aA + bS + \lambda = bS + (a\,bb^{*} + \lambda)$, Arden con $S$ da
$S = b^{*}(a\,bb^{*} + \lambda) = b^{*}(ab^{*}b + \lambda)$, usando $bb^{*} = b^{*}b$.

## Ver también

- [[01-expresiones-regulares]] — definición, operaciones y álgebra de expresiones regulares
- [[03-automatas-finitos/03-configuraciones-lenguaje-aceptado]] — lenguaje aceptado y equivalencia de autómatas
- [[03-automatas-finitos/01-automatas-finitos]] — definición, diagrama y tabla de transición de un autómata finito
- [[index]] — índice del vault de TLA
