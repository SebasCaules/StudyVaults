---
tags: [parcial, unidad-6, normalizacion, tercera-forma-normal, proyeccion-dependencias, claves]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 6
tipo: parcial
actualizado: 2026-07-05
---

# Parcial integrador de normalización

Un segundo parcial típico encadena, sobre un mismo esquema, casi toda la maquinaria de normalización:
convertir una MVD en DF, **hallar todas las claves**, chequear la forma normal, **descomponer** y, en
otra variante, **proyectar las dependencias** sobre un subesquema. Esta página recorre esos pasos con
los ejercicios resueltos, apoyándose en las páginas de teoría para la mecánica de base.

## Ejercicio 1 — de MVD a 3NF

> **Enunciado.** Sea $R(A, B, C, D, E, F, G, H)$ con
> $$\text{Dep} = \{\, BH \twoheadrightarrow AG,\; GBH \to F,\; HBA \to C,\; A \to D,\; F \to AH,\; BH \to E,\; D \to G \,\}$$
> (1.1) Hallar todas las claves. (1.2) ¿Está en 3NF? Si no, descomponer con el algoritmo de síntesis.

**1.1 — claves.** Primero se baja la MVD $BH \twoheadrightarrow AG$ a dependencias funcionales por
[[06-parciales/03-mvd-y-coalescencia|coalescencia]]: con $D \to G$ sale $BH \to G$ y con $F \to A$
sale $BH \to A$. Con las DF ya en juego, se aplica el
[[04-dependencias-funcionales/02-clausura-y-claves-candidatas|método de la tabla]]: $B$ queda como
único atributo solo-izquierda, $C$ y $E$ solo-derecha. El núcleo es $\{B\}$, pero $(B)^+ = \{B\}$ no
es superclave. Probando extensiones se llega a

$$(BH)^+ = R, \qquad (BF)^+ = R$$

y ninguna otra extensión minimal alcanza. Las **claves** son $BH$ y $BF$; los atributos **primos** son
$B, H, F$.

**1.2 — forma normal.** La dependencia $A \to D$ **viola 3NF**: $A$ no es superclave y $D$ no es primo.
El esquema no está en 3NF. Se descompone por síntesis a partir del recubrimiento mínimo. Reduciendo el
conjunto, $BH \to A$ y $BH \to G$ resultan **redundantes** (se derivan por la cadena
$BH \to F \to A \to D \to G$) y salen del $F_m$:

$$F_m = \{\, BH \to F,\;\; BH \to C,\;\; BH \to E,\;\; A \to D,\;\; F \to A,\;\; F \to H,\;\; D \to G \,\}$$

Agrupando las DF por determinante se obtiene el **árbol de subesquemas**:

| Subesquema | Atributos | Dependencias | Clave |
|---|---|---|---|
| $R_1$ | $B, H, F, C, E$ | $BH \to FCE$ | $BH$ |
| $R_2$ | $A, D$ | $A \to D$ | $A$ |
| $R_3$ | $F, A, H$ | $F \to AH$ | $F$ |
| $R_4$ | $D, G$ | $D \to G$ | $D$ |

Cada subesquema conserva sus dependencias, así que la descomposición **preserva dependencias**; al
partir del recubrimiento mínimo, además es sin pérdida. El detalle del algoritmo de síntesis está en
[[04-dependencias-funcionales/03-recubrimiento-minimo]].

## Ejercicio 2 — proyectar dependencias sobre un subesquema

Otra variante no descompone, sino que da un subesquema y pide **qué dependencias sobreviven** en él:
la proyección de $F^+$ sobre los atributos del subesquema.

> **Enunciado.** Sea $R(A, B, C, D, E, G, H)$ con
> $$\text{Dep} = \{\, CB \to A,\;\; E \to G,\;\; AB \to C,\;\; AC \to B,\;\; B \to D \,\}$$
> Se descompone y uno de los subesquemas es $R_1 = (A, B, D, E, G, H)$. ¿Cuáles son las dependencias
> que surgen de la proyección de $\text{Dep}^+$ sobre $R_1$?

> **Procedimiento (proyección de dependencias).** Las dependencias de $R_1$ son las $X \to Y$ con
> $X, Y \subseteq R_1$ que están en $F^+$. Se calcula la clausura de cada subconjunto $X \subseteq R_1$
> **bajo el $F$ completo** y se retiene la parte que cae dentro de $R_1$: $X \to (X^+ \cap R_1)$. Al
> final se descartan las triviales y se toma un recubrimiento mínimo.

El atributo que **sale** es $C = R - R_1$. Calculando clausuras dentro de $R_1$:

- $(E)^+ = \{E, G\}$, con $G \in R_1$: sobrevive $E \to G$.
- $(B)^+ = \{B, D\}$, con $D \in R_1$: sobrevive $B \to D$.
- $(AB)^+ = \{A, B, C, D\}$; al intersecar con $R_1$ queda $\{A, B, D\}$, pero $AB \to A$ y $AB \to B$
  son triviales y $AB \to D$ ya se deduce de $B \to D$: no aporta nada nuevo.

Ninguna otra combinación agrega una DF no trivial entre atributos de $R_1$ (todo lo que pasaba por $C$
se pierde al proyectar). El resultado:

$$f_1 = \{\, E \to G,\;\; B \to D \,\}$$

## Ejercicio 3 — claves con muchos atributos

Los parciales de BCNF suelen abrir con un esquema grande donde hallar **todas** las claves ya es el
grueso del trabajo.

> **Enunciado (fragmento).** Sea $R(K, D, F, P, I, Z, H, O, W, S)$ con
> $$\text{Dep} = \{\, DF \to OS,\; PI \to ZH,\; P \to W,\; ZSPI \to K,\; S \to DF,\; DFPIZ \to K \,\}$$
> Encontrar todas las claves de $R$.

Clasificando: $P$ e $I$ aparecen solo a la izquierda (van en toda clave); $O, H, W, K$ solo a la
derecha (nunca en una clave). El núcleo $\{P, I\}$ no basta: $(PI)^+ = \{P, I, Z, H, W\}$. Extendiendo
con atributos del medio ($D, S, Z, F$):

$$(FPID)^+ = R \quad\checkmark \qquad (PIS)^+ = R \quad\checkmark \qquad (PIZ)^+ = \{F, P, I, Z, H, W\} \;\times$$

Las **claves** son $FPID$ y $PIS$ ($S \to DF$ hace que $PIS$ alcance todo lo que alcanza $FPID$).

> **Nota.** El parcial continúa pidiendo la descomposición a **BCNF** paso a paso y el análisis de
> pérdida; esa parte no figura resuelta en los apuntes de la cursada 2025-2C. El algoritmo de BCNF
> (aislar cada DF $\alpha \to \beta$ que viola la forma normal en un esquema $(\alpha, \beta)$ y dejar
> el resto) queda como hueco de esta wiki.

---

## Ver también

- [[06-parciales/03-mvd-y-coalescencia]] — la coalescencia que convierte $BH \twoheadrightarrow AG$ en las DF usadas para las claves
- [[06-parciales/02-lossless-join-por-tableau]] — verificar que una descomposición no pierde información
- [[04-dependencias-funcionales/02-clausura-y-claves-candidatas]] — método de la tabla para todas las claves
- [[04-dependencias-funcionales/03-recubrimiento-minimo]] — algoritmo de síntesis a 3NF a partir de $F_m$
