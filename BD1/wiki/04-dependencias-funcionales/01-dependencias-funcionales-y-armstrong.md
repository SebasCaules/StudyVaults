---
tags: [teoria, unidad-4, dependencias-funcionales, axiomas-de-armstrong, inferencia]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Dependencias funcionales y axiomas de Armstrong

Las **dependencias funcionales** (DF) son las restricciones semánticas sobre las que se apoya toda
la teoría de normalización: capturan la idea de que el valor de un conjunto de atributos determina
de forma unívoca el valor de otro. A partir de un conjunto de DF y de los **axiomas de Armstrong**
se puede *inferir* todas las dependencias que valen en un esquema. Esta página define la DF y las
reglas de inferencia; el cálculo de la clausura y de las claves se trata en
[[04-dependencias-funcionales/02-clausura-y-claves-candidatas]] y el
[[04-dependencias-funcionales/03-recubrimiento-minimo|recubrimiento mínimo]] en su propia página.

## Dependencia funcional

> **Definición.** Sea $R$ un esquema de relación y $X, Y \subseteq R$ conjuntos de atributos. Se dice
> que $X$ **determina funcionalmente** a $Y$, y se escribe $X \to Y$, si para toda instancia legal
> $r$ de $R$ y todo par de tuplas $t_1, t_2 \in r$ se cumple
> $$t_1[X] = t_2[X] \;\Rightarrow\; t_1[Y] = t_2[Y]$$
> es decir: dos tuplas que coinciden en $X$ están obligadas a coincidir en $Y$.

Se lee "$X$ determina $Y$" o "$Y$ depende funcionalmente de $X$". A $X$ se lo llama **lado
izquierdo** (determinante) y a $Y$ **lado derecho** de la dependencia.

> **Definición.** Una dependencia $X \to Y$ es **trivial** si $Y \subseteq X$. Las dependencias
> triviales valen siempre, en cualquier instancia, sin necesidad de imponerlas.

**Notación.** Se escribe la yuxtaposición de atributos sin comas para el lado izquierdo: $BH$
significa $\{B, H\}$, y $BH \to F$ es $\{B,H\} \to \{F\}$.

## Axiomas de Armstrong

Dado un conjunto $F$ de dependencias funcionales, su **clausura** $F^+$ es el conjunto de todas las
DF que se pueden deducir de $F$. Los axiomas de Armstrong son un sistema de inferencia **correcto y
completo**: permiten derivar exactamente las dependencias de $F^+$ y nada más.

> **Axiomas de Armstrong.** Para atributos $X, Y, Z \subseteq R$:
> - **A1 — Reflexividad.** Si $Y \subseteq X$, entonces $X \to Y$.
> - **A2 — Aumentación.** Si $X \to Y$, entonces $XZ \to YZ$ para todo $Z$.
> - **A3 — Transitividad.** Si $X \to Y$ y $Y \to Z$, entonces $X \to Z$.

La reflexividad (A1) genera justamente las dependencias triviales. La aumentación (A2) permite
agregar atributos "de arrastre" a ambos lados. La transitividad (A3) encadena dependencias.

## Reglas derivadas

De los tres axiomas se demuestran reglas más cómodas para operar. Son las que se usan en la
práctica al manipular conjuntos de dependencias:

i) **Unión.** Si $X \to Y$ y $X \to Z$, entonces $X \to YZ$.
ii) **Descomposición.** Si $X \to YZ$, entonces $X \to Y$ y $X \to Z$. Es la recíproca de la unión:
   permite trabajar siempre con dependencias de **un solo atributo a la derecha**.
iii) **Pseudo-transitividad.** Si $X \to Y$ y $WY \to Z$, entonces $WX \to Z$.

La unión y la descomposición juntas dicen que $X \to A_1 A_2 \cdots A_k$ equivale al conjunto de
dependencias $X \to A_i$ una por cada atributo del lado derecho. Esto es lo que se aprovecha al
calcular el [[04-dependencias-funcionales/03-recubrimiento-minimo|recubrimiento mínimo]].

## Inferencia de DF a partir de dependencias multivaluadas

Cuando el esquema tiene además **dependencias multivaluadas** ($X \twoheadrightarrow Y$), la regla
de **coalescencia** permite deducir una DF *ordinaria* a partir de una multivaluada combinada con
otra DF. Es la técnica que aparece en varios parciales de la cursada.

> **Regla de coalescencia.** Si $X \twoheadrightarrow Y$ y existe una DF $W \to V$ tal que
> $V \subseteq Y$ y $W \cap Y = \emptyset$, entonces $X \to V$.

**Ejemplo (parcial resuelto).** Sea $R(Z, Q, N, J, F)$ con
$$\text{Dep} = \{\, ZF \twoheadrightarrow JZ,\;\; Q \twoheadrightarrow JN,\;\; Z \to J \,\}$$
Se pregunta si se puede inferir $Q \to J$. Tomando la multivaluada $Q \twoheadrightarrow JN$ (con
$X = Q$, $Y = JN$) y la DF $Z \to J$:

- $J \subseteq JN = Y$ (el lado derecho de la DF está contenido en $Y$),
- $\{Z\} \cap JN = \emptyset$ (el lado izquierdo de la DF es disjunto de $Y$),

por lo que la coalescencia da $Q \to J$. La respuesta es **afirmativa**: la dependencia se infiere.

> **Nota.** La coalescencia es un axioma de la teoría de dependencias multivaluadas (ver la unidad
> de MVD/4NF), no de Armstrong puro; se incluye acá porque en la cursada se la usa como puente para
> derivar DF ordinarias en los ejercicios de inferencia de claves y de normalización.

Cuando se pide **demostrar** una inferencia "con axiomas de Armstrong", el criterio del parcial es
justificar **cada paso** indicando qué axioma se aplica (A1, A2 o A3, o la regla derivada
correspondiente). Si en cambio la dependencia **no** se infiere, hay que exhibir un **contraejemplo**:
una instancia de $R$ que satisface $\text{Dep}$ pero no la dependencia en cuestión.

---

## Ver también

- [[04-dependencias-funcionales/02-clausura-y-claves-candidatas]] — clausura $X^+$ y método de la tabla para hallar todas las claves
- [[04-dependencias-funcionales/03-recubrimiento-minimo]] — recubrimiento mínimo $F_m$ de un conjunto de dependencias
- [[02-algebra-relacional/01-operaciones-basicas]] — el lenguaje de consultas sobre el que se apoya el modelo relacional
