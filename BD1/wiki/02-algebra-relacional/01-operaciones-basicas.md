---
tags: [teoria, unidad-2, algebra-relacional, operaciones-basicas, operadores-de-conjuntos]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Álgebra relacional: operaciones básicas y de conjuntos

El álgebra relacional es un lenguaje de consultas *procedimental*: cada operación toma una o dos
relaciones y devuelve una relación nueva, de modo que las operaciones se encadenan para expresar
consultas complejas. Esta página cubre las **operaciones básicas** (selección, proyección, producto
cartesiano, renombramiento) y los **operadores de conjuntos** (unión, diferencia, intersección).
Los joins y la división se tratan en [[02-joins-y-division]].

## Selección

La selección filtra **filas**: se queda con las tuplas que cumplen una condición.

> **Definición.** La selección $\sigma_F(r)$ devuelve el subconjunto de tuplas de la relación $r$
> que satisfacen la condición $F$.
> $$\sigma_F(r) = \{\, t \in r \mid F(t) \text{ es verdadera} \,\}$$
> donde $F$ es una fórmula lógica sobre los atributos de $r$ (comparaciones y conectivos).

El esquema del resultado es el mismo que el de $r$: la selección no cambia las columnas, solo
descarta filas.

## Proyección

La proyección filtra **columnas**: arma una relación nueva quedándose solo con ciertos atributos.

> **Definición.** Sea $r$ una relación con atributos $A_1, \dots, A_n$. La proyección
> $\pi_{a_1, \dots, a_k}(r)$ genera una relación nueva seleccionando únicamente las columnas
> $a_1, \dots, a_k$ de $r$, con $\{a_1, \dots, a_k\} \subseteq \{A_1, \dots, A_n\}$.

Como el resultado es una relación (un conjunto), la proyección **elimina las tuplas duplicadas**
que puedan surgir al descartar columnas.

Una propiedad útil es que proyecciones anidadas colapsan en la más chica:

> **Propiedad (idempotencia anidada).** Si $\text{lista}_1$ está incluida en $\text{lista}_2$,
> entonces
> $$\pi_{\text{lista}_1}\big(\pi_{\text{lista}_2}(r)\big) = \pi_{\text{lista}_1}(r)$$
> es decir, proyectar sobre una lista más chica de atributos, ya contenida en otra proyección,
> equivale a proyectar directamente sobre la lista chica.

## Operadores de conjuntos

Como las relaciones son conjuntos de tuplas, se pueden combinar con las operaciones clásicas de
conjuntos. Para que esto tenga sentido las dos relaciones deben ser **compatibles**.

### Relaciones compatibles

> **Definición.** Dos relaciones $r(A_1, \dots, A_n)$ y $s(B_1, \dots, B_n)$ son **compatibles** si
> i) tienen el mismo **grado**: $\text{gr}(r) = \text{gr}(s) = N$, y
> ii) los dominios coinciden columna a columna: $\text{dom}(A_i) = \text{dom}(B_i)$ para todo
> $1 \le i \le N$.

Es decir, misma cantidad de atributos y del mismo tipo en cada posición.

### Unión

> **Definición.** Si $r$ y $s$ son compatibles, la unión $r \cup s$ devuelve las tuplas que están
> en $r$, en $s$, o en ambas. Los nombres de las columnas del resultado se toman de la relación de
> la izquierda.

La unión es **conmutativa** y **asociativa**:

$$r \cup s = s \cup r \qquad (r \cup s) \cup t = r \cup (s \cup t)$$

### Diferencia

> **Definición.** Si $r$ y $s$ son compatibles, la diferencia $r - s$ devuelve las tuplas que están
> en $r$ pero **no** en $s$. Los nombres de las columnas se toman igual que en la unión.

A diferencia de la unión, la resta **no es conmutativa**: en general $r - s \neq s - r$.

### Intersección

La intersección es una operación *derivada*: se puede escribir en términos de la diferencia.

> **Definición.** Si $r$ y $s$ son compatibles, la intersección $r \cap s$ devuelve las tuplas que
> están en **ambas** relaciones. Equivalentemente,
> $$r \cap s = r - (r - s)$$

## Producto cartesiano

El producto cartesiano combina **cada** tupla de una relación con **cada** tupla de la otra. Es la
base sobre la que se definen los distintos joins (ver [[02-joins-y-division]]).

> **Definición.** Sean $r(A_1, \dots, A_n)$ y $s(B_1, \dots, B_m)$, con $|r|$ y $|s|$ la cantidad de
> tuplas de cada una. El producto cartesiano $r \times s$ devuelve:
> i) $|r| \cdot |s|$ tuplas,
> ii) una relación de grado $n + m$ con atributos $(A_1, \dots, A_n, B_1, \dots, B_m)$.

Formalmente, cada tupla del resultado nace de emparejar una de $r$ con una de $s$:

$$u \in r \times s \iff \exists\, t_1 \in r,\ \exists\, t_2 \in s \ :\ u[r] = t_1[r] \ \wedge\ u[s] = t_2[s]$$

donde $u[r]$ y $u[s]$ son las proyecciones de la tupla $u$ sobre los atributos que provienen de
$r$ y de $s$ respectivamente.

## Renombramiento

El renombramiento permite cambiar el nombre de una relación o de sus atributos. Es imprescindible
para operar una relación consigo misma (por ejemplo, un *self-join*), ya que evita la ambigüedad de
nombres repetidos.

> **Definición.** El operador $\rho$ renombra:
> i) $\rho_B(r)$ renombra la **relación** $r$ como $B$;
> ii) $\rho_{(a_1, \dots, a_n)}(r)$ renombra los **atributos** de $r$ como $a_1, \dots, a_n$.

---

## Ver también

- [[02-joins-y-division]] — joins (theta, equi, natural, externos) y división, todos construidos sobre el producto cartesiano
- [[index]] — índice del vault de Base de Datos I
