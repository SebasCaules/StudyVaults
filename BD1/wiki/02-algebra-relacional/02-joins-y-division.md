---
tags: [teoria, unidad-2, algebra-relacional, joins, division]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Álgebra relacional: joins y división

Los **joins** combinan tuplas de dos relaciones que satisfacen alguna condición de correlación;
todos se definen como un producto cartesiano seguido de una selección (y a veces una proyección).
La **división** captura consultas del tipo "los que se relacionan con *todos* los...". Esta página
supone conocidas las [[01-operaciones-basicas|operaciones básicas]] ($\sigma$, $\pi$, $\times$).

## Theta-join

El theta-join es un producto cartesiano filtrado por una condición de junta arbitraria.

> **Definición.** El theta-join de $r$ y $s$ bajo la condición de junta $\theta$ es
> $$r \bowtie_{\theta} s \ \equiv\ \sigma_{\theta}(r \times s)$$
> donde la condición tiene la forma $\theta = A_i \ \text{op}\ B_j$, con $A_i$ atributo de $r$,
> $B_j$ atributo de $s$ y el operador $\text{op} \in \{<,\ \le,\ >,\ \ge,\ =,\ \ne\}$.

## Equi-join

> **Definición.** El equi-join es el caso particular del theta-join en el que el operador de la
> condición de junta es la **igualdad** ($=$).

## Natural join

El natural join es el join más usado: iguala de forma automática **todos** los atributos que las
dos relaciones tienen en común y elimina las columnas repetidas.

> **Definición.** Sean $r$ y $s$ con atributos en común $A_1, \dots, A_n$. El natural join es
> $$r \bowtie s = \pi\big(\sigma_{\,r.A_1 = s.A_1 \,\wedge\, \dots \,\wedge\, r.A_n = s.A_n}(r \times s)\big)$$
> donde la selección iguala cada atributo compartido y la proyección conserva **una sola copia** de
> cada uno de esos atributos comunes.

> **Observación.** Si $r$ y $s$ **no** comparten ningún atributo, la condición de junta se vuelve
> vacía y el natural join degenera en el producto cartesiano: $r \bowtie s = r \times s$.

## Joins externos (outer joins)

Un join común descarta las tuplas que no encuentran pareja del otro lado. Los **joins externos**
conservan esas tuplas sin correspondencia, completando con valores nulos las columnas que faltan.
Según de qué lado se conserven, hay tres variantes:

| Variante | Notación | Qué conserva |
|---|---|---|
| Join externo izquierdo | $r \bowtie_{\text{izq}} s$ | las tuplas de $r$ que no tengan correspondencia en $s$ |
| Join externo derecho | $r \bowtie_{\text{der}} s$ | las tuplas de $s$ que no tengan correspondencia en $r$ |
| Join externo completo | $r \bowtie_{\text{comp}} s$ | las tuplas de $r$ **o** de $s$ que no tengan correspondencia en la otra |

> **Nota.** En los apuntes de la cursada 2025-2C estos operadores están dibujados a mano como un
> símbolo de join ($\bowtie$) decorado con un ángulo hacia el lado que se conserva. Acá se anota
> ese lado como subíndice (izquierdo / derecho / completo) para evitar el símbolo dibujado, que en
> el original puede confundirse.

## División (cociente)

La división resuelve consultas universales: "hallar los $t$ que aparecen en $r$ combinados con
**toda** tupla de $s$".

> **Definición.** Sean $r$ y $s$ relaciones de esquemas $R$ y $S$, con $S \subseteq R$ (todos los
> atributos de $s$ están en $r$). La división $r \div s$ es una relación sobre el esquema $R - S$.
> Una tupla $t \in r \div s$ si y solo si
> i) $t \in \pi_{R-S}(r)$, y
> ii) para toda tupla $t_s \in s$ existe una tupla $t_r \in r$ tal que
> $$t_r[S] = t_s[S] \quad \wedge \quad t_r[R - S] = t$$
> donde $t_r[S]$ y $t_r[R-S]$ son las proyecciones de $t_r$ sobre los atributos de $S$ y sobre los
> restantes. En palabras: $t$ está en el cociente si aparece en $r$ en combinación con **todas** las
> tuplas de $s$.

> **Nota.** En los apuntes originales la división se nota con el símbolo de porcentaje ("$\%$")
> en lugar de $\div$; acá se usa $\div$, la notación habitual del cociente relacional.

La división es la operación típica para consultas del estilo "los alumnos inscriptos en **todos**
los cursos" o "los proveedores que suministran **todas** las piezas".

---

## Ver también

- [[01-operaciones-basicas]] — selección, proyección, producto cartesiano y operadores de conjuntos, base de todos los joins
- [[index]] — índice del vault de Base de Datos I
