---
tags: [tecnica, unidad-5, tableau, chase, junta-sin-perdida, inferencia-de-dependencias]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 5
tipo: tecnica
actualizado: 2026-07-05
---

# Método del tableau (chase)

El **tableau** (o *chase*) es el algoritmo de propósito general de la teoría de normalización. Sirve
para dos cosas: **probar si una descomposición es sin pérdida** (con cualquier número de componentes)
e **inferir dependencias** (funcionales o multivaluadas) a partir de un conjunto dado. La idea es
armar una tabla de símbolos y "perseguir" (*chase*) las dependencias hasta que la tabla deje de
cambiar.

## Prueba de junta sin pérdida

Para decidir si la descomposición de $R$ en $R_1, \dots, R_n$ es sin pérdida:

1. Armar una tabla con **una fila por subesquema $R_i$** y **una columna por atributo** de $R$.
2. En la fila $i$, columna del atributo $A$: poner el símbolo **distinguido** $a_j$ (uno por columna)
   si $A \in R_i$; en caso contrario, un símbolo propio $b_{ij}$.
3. **Perseguir** las dependencias de $F$: si dos filas coinciden en $\alpha$, igualar sus valores en
   $\beta$ (eligiendo el símbolo distinguido $a$ cuando aparezca en el grupo).
4. Si en algún momento una fila queda **toda de símbolos distinguidos** ($a_1 a_2 \cdots a_n$), la
   descomposición es **sin pérdida**. Si la tabla se estabiliza sin ninguna fila así, es **con
   pérdida**.

### Ejemplo resuelto — $R(A,D,E,N,S)$

Del segundo parcial. Sea $R(A,D,E,N,S)$ con
$$\text{Dep} = \{\, E \to S,\; DS \to N,\; A \to D \,\}$$
y la descomposición $R_1(A,E,N,S)$, $R_2(S,D)$. ¿Es con pérdida?

Tableau inicial:

| | $A$ | $D$ | $E$ | $N$ | $S$ |
|---|---|---|---|---|---|
| $R_1$ | $a_1$ | $b_{12}$ | $a_3$ | $a_4$ | $a_5$ |
| $R_2$ | $b_{21}$ | $a_2$ | $b_{23}$ | $b_{24}$ | $a_5$ |

Se persiguen las dependencias:

- $E \to S$: las filas deberían coincidir en $E$, pero $a_3 \neq b_{23}$. No dispara.
- $DS \to N$: coincidencia en $DS$; $D$ vale $b_{12} \neq a_2$. No dispara.
- $A \to D$: coincidencia en $A$; $a_1 \neq b_{21}$. No dispara.

Ninguna dependencia modifica la tabla y **ninguna fila queda toda de símbolos distinguidos**. Por lo
tanto la descomposición es **con pérdida** (en el original: *"es con pérdida, no llegó a hacer
nada"*).

## Inferencia de dependencias por chase

El mismo mecanismo prueba si una dependencia se **infiere** de un conjunto. Se arma un tableau con
dos tuplas que coinciden en el lado izquierdo de la dependencia a testear y se persiguen **todas** las
dependencias de $\text{Dep}$ (incluidas las multivaluadas, que **agregan** filas al intercambiar
bloques). Si al final las tuplas quedan forzadas a coincidir en el lado derecho, la dependencia se
infiere.

### Ejemplo resuelto — ¿$MJ \to A$?

Del segundo parcial. Sea $R(A,P,M,U,J,T)$ con
$$\text{Dep} = \{\, U \to A,\; MJ \twoheadrightarrow PT,\; PT \twoheadrightarrow UM \,\}$$
¿Se puede inferir $MJ \to A$? Se parte de dos tuplas que coinciden en $MJ$ (columnas ordenadas
$M,J,A,P,T,U$):

$$(m,\,j,\,a_1,\,p_1,\,t_1,\,u_1) \qquad (m,\,j,\,a_2,\,p_2,\,t_2,\,u_2)$$

**Chase de $MJ \twoheadrightarrow PT$** (filas que coinciden en $MJ$ intercambian el bloque $PT$):
se agregan $(m,j,a_2,p_1,t_1,u_2)$ y $(m,j,a_1,p_2,t_2,u_1)$.

**Chase de $PT \twoheadrightarrow UM$** (filas que coinciden en $PT$ intercambian $UM$; $M$ es
constante, así que en la práctica intercambia $U$): entre las filas con $(p_1,t_1)$ se generan, entre
otras, $(m,j,a_1,p_1,t_1,u_2)$ y $(m,j,a_2,p_1,t_1,u_1)$.

**Chase de $U \to A$** (dependencia funcional: filas que coinciden en $U$ deben coincidir en $A$):
ahora hay filas con $U = u_1$ que llevan tanto $A = a_1$ (la fila inicial) como $A = a_2$ (la generada
en el paso anterior). $U \to A$ las obliga a igualarse:
$$a_1 = a_2$$

Como todas las filas coinciden en $MJ$ y el chase fuerza que coincidan también en $A$, **se infiere
$MJ \to A$** (respuesta afirmativa).

> **Nota.** Una vez inferida $MJ \to A$, el conjunto funcional efectivo es
> $F = \{\, U \to A,\; MJ \to A \,\}$. Como $P$ y $T$ no aparecen a la derecha de ninguna FD y
> $U, M, J$ solo aparecen a la izquierda, todos ellos entran en la clave: la única clave candidata es
> $MUJPT$ ($(MUJPT)^{+} = R$).

---

## Ver también

- [[05-formas-normales/03-mvd-4nf-5nf]] — dependencias multivaluadas y de junta que alimentan el chase
- [[05-formas-normales/02-descomposicion-3nf-bcnf]] — condición de junta sin pérdida en dos esquemas
- [[05-formas-normales/01-formas-normales]] — por qué la junta sin pérdida es requisito de toda descomposición
- [[04-dependencias-funcionales/02-clausura-y-claves-candidatas]] — clausura y claves usadas en la inferencia
