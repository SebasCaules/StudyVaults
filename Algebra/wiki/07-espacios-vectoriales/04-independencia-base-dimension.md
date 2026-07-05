---
tags: [teoria, unidad-7, independencia-lineal, base, dimension]
fuentes:
  - raw/3-resumenes/algebra.pdf
  - raw/1-teoricas/algebra.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Independencia lineal, base y dimensión

Un conjunto es **linealmente independiente** cuando ningún vector sobra. Una **base** es un
conjunto de generadores linealmente independiente, y su cantidad de elementos define la
**dimensión**. Cierra la unidad iniciada en [[01-espacios-vectoriales]], apoyándose en la
[[03-combinacion-lineal-generadores|combinación lineal y los generadores]]. Transcripción
de los apuntes de la cursada 2023-1C.

## Independencia lineal

> **Definición (linealmente independiente).** Sea $V$ un $\mathbb{K}$-e.v. y $v_1, \dots,
> v_r \in V$. Se dice que $\{ v_1, \dots, v_r \}$ es **linealmente independiente** (L.I.)
> si la única forma de escribir el vector nulo como combinación lineal es con todos los
> escalares nulos:
> $$\alpha_1 v_1 + \cdots + \alpha_r v_r = 0 \implies \alpha_1 = \alpha_2 = \cdots =
> \alpha_r = 0, \qquad \alpha_s \in \mathbb{K}.$$
> Si el conjunto no es L.I., se dice **linealmente dependiente** (L.D.).

**Ejemplo.** Para decidir si $\{ (1, 2, 3, 4),\ (-1, 1, 0, 1),\ (0, 1, 0, 0) \}$ es L.I.
se plantea $\alpha (1,2,3,4) + \beta (-1,1,0,1) + \gamma (0,1,0,0) = 0$, que da el sistema
$$\alpha - \beta = 0, \quad 2\alpha + \beta + \gamma = 0, \quad 3\alpha = 0, \quad
4\alpha + \beta = 0.$$
De la tercera $\alpha = 0$, de la cuarta $\beta = 0$ y de la segunda $\gamma = 0$: única
solución la trivial, así que el conjunto es **L.I.** En general, el conjunto es L.I. si y
solo si el sistema homogéneo asociado es **SCD** (solución única).

> **Observaciones.**
> i) Si algún $v_i = 0$, entonces $\{ v_1, \dots, v_r \}$ es L.D.
> ii) $\{ v \}$ es L.I. $\iff v \neq 0$.

## Dependencia y "ser combinación lineal del resto"

> **Teorema.** Sea $V$ un $\mathbb{K}$-e.v. y $\{ v_1, \dots, v_r \}$.
> 1. $\{ v_1, \dots, v_r \}$ es L.D. $\iff$ existe $v_i$ que es combinación lineal del
>    resto.
> 2. $\{ v_1, \dots, v_r \}$ es L.I. $\iff$ ningún vector es combinación lineal del resto.

La parte 2 es el contrarrecíproco de la 1, así que basta probar la 1.

> **Proposición (demostración de 1).**
> ($\Leftarrow$) Supongamos que algún $v_i$ es combinación lineal del resto,
> $$v_i = \alpha_1 v_1 + \cdots + \alpha_r v_r \quad (\text{sin el término } v_i).$$
> Pasando $v_i$ al otro miembro,
> $$0 = -1 \cdot v_i + \alpha_1 v_1 + \cdots + \alpha_r v_r,$$
> y como el coeficiente de $v_i$ es $-1 \neq 0$, hay una combinación no trivial que da
> cero: el conjunto es L.D.
> ($\Rightarrow$) Si es L.D., existe una combinación no trivial nula; despejando un
> vector con coeficiente no nulo, ese vector queda expresado como combinación de los
> demás. $\blacksquare$

> **Corolario.** Sea $G = \{ v_1, \dots, v_r \}$ con $r \ge 2$. Si existe $G_1
> \subsetneq G$ con $\mathrm{gen}\,G_1 = \mathrm{gen}\,G$, entonces $G$ es L.D. (algún
> vector de $G$ es redundante y se puede quitar sin cambiar el generado).

## Base

> **Definición (base).** Sea $V$ un $\mathbb{K}$-e.v. y $B = \{ v_1, \dots, v_n \}
> \subseteq V$. $B$ es una **base** de $V$ si
> 1. $\{ v_1, \dots, v_n \}$ es L.I., y
> 2. $\mathrm{gen}\{ v_1, \dots, v_n \} = V$.

Es decir, una base es un conjunto de generadores linealmente independiente: genera todo el
espacio y no tiene vectores de sobra. Los teoremas siguientes son las propiedades básicas.

> **Teoremas (de base).**
> 1. Sea $G = \{ v_1, \dots, v_r \}$ ($r \ge 1$) un conjunto de generadores de $S$ con
>    $S \neq \{0\}$. Entonces existe $B \subseteq G$ tal que $B$ es base de $S$ (de todo
>    generador se puede extraer una base).
> 2. Sea $B = \{ v_1, \dots, v_r \}$ una base de $V$. Entonces para todo $v \in V$
>    existen escalares **únicos** $\alpha_1, \dots, \alpha_r \in \mathbb{K}$ tales que
>    $v = \sum_{s=1}^{r} \alpha_s v_s$.
> 3. Si $B = \{ v_1, \dots, v_r \}$ es base de $V$ y $\{ w_1, \dots, w_n \} \subseteq V$
>    con $n > r$, entonces $\{ w_1, \dots, w_n \}$ es L.D. (no puede haber más de $r$
>    vectores L.I.).
> 4. Si $B = \{ v_1, \dots, v_r \}$ y $B' = \{ v_1', \dots, v_t' \}$ son bases del mismo
>    subespacio $S$, entonces $r = t$ (todas las bases tienen la misma cantidad de
>    vectores).

El teorema 4 es el que hace consistente la definición de dimensión: el número de vectores
de una base no depende de la base elegida.

## Dimensión

> **Definición (dimensión).** Sea $V$ un $\mathbb{K}$-e.v. con $V \neq \{0\}$ y $B$ una
> base de $V$. La **dimensión** de $V$ es la cantidad de elementos de $B$:
> $$\dim(V) = \# B.$$
> El espacio $V = \{0\}$ no tiene base y se define $\dim(V) = 0$.

## Cómo probar que un conjunto es base

Conociendo la dimensión, no hace falta verificar las dos condiciones de base: alcanza con
una. El teorema siguiente lo justifica.

> **Teorema.** Sea $V$ un $\mathbb{K}$-e.v., $S \subseteq V$ subespacio con
> $\dim S = n \ge 1$. Para $\{ v_1, \dots, v_n \} \subseteq S$ (exactamente $n$ vectores),
> son equivalentes:
> 1. $\{ v_1, \dots, v_n \}$ es L.I.;
> 2. $S = \mathrm{gen}\{ v_1, \dots, v_n \}$.

De aquí salen los dos métodos prácticos para verificar que un conjunto de $\dim V = n$
vectores es base:

| Método | Se conoce | Se verifica | Se concluye |
|---|---|---|---|
| I ($1 \Rightarrow 2$) | $\dim V = n$; $\{v_1, \dots, v_n\} \subseteq V$ | que es **L.I.** | $\mathrm{gen}\{v_1,\dots,v_n\} = V$, luego es base |
| II ($2 \Rightarrow 1$) | $\dim V = n$; $\{v_1, \dots, v_n\} \subseteq V$ | que **genera** $V$ | es **L.I.**, luego es base |

Con $n$ vectores exactos en un espacio de dimensión $n$, verificar **una** de las dos
condiciones basta para tener las dos.

## Espacio columna y espacio fila

Toda matriz define dos subespacios generados por sus columnas y por sus filas.

> **Definición ($\mathrm{Col}(A)$ y $\mathrm{Fil}(A)$).** Sea $A \in \mathbb{R}^{n \times
> k}$.
> - Escribiendo $A = (c_1 \mid c_2 \mid \cdots \mid c_k)$ con columnas $c_j \in
>   \mathbb{R}^n$, el **espacio columna** es
>   $$\mathrm{Col}(A) = \mathrm{gen}\{ c_1, c_2, \dots, c_k \},$$
>   subespacio de $\mathbb{R}^n$.
> - Escribiendo $A$ por filas $f_i \in \mathbb{R}^k$, el **espacio fila** es
>   $$\mathrm{Fil}(A) = \mathrm{gen}\{ f_1, f_2, \dots, f_n \},$$
>   subespacio de $\mathbb{R}^k$.

---

## Ver también

- [[01-espacios-vectoriales]] — la estructura de fondo
- [[02-subespacios]] — $\mathrm{Col}(A)$ y $\mathrm{Fil}(A)$ son subespacios
- [[03-combinacion-lineal-generadores]] — generadores de los que se extrae una base
