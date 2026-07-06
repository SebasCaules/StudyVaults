---
tags: [teoria, unidad-5, dependencias-multivaluadas, 4nf, dependencias-de-junta, 5nf]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Dependencias multivaluadas, 4NF y 5NF

Las **dependencias funcionales** no capturan toda la redundancia posible. Cuando un atributo
determina un *conjunto* de valores independiente de otro, aparece una **dependencia multivaluada
(DMV)**; y cuando la relación solo se reconstruye juntando tres o más proyecciones, una **dependencia
de junta (JD)**. Estas dependencias motivan la 4NF y la 5NF.

## Dependencias multivaluadas

> **Definición (DMV).** Sea $R$ con $\gamma = R - \alpha - \beta$. Vale la dependencia multivaluada
> $\alpha \twoheadrightarrow \beta$ si, para todo par de tuplas $t_1, t_2$ con
> $t_1[\alpha] = t_2[\alpha]$, existe una tupla $t_3$ tal que
> $$t_3[\alpha] = t_1[\alpha], \qquad t_3[\beta] = t_1[\beta], \qquad t_3[\gamma] = t_2[\gamma]$$
> (y, por simetría, la tupla que intercambia $\beta$ y $\gamma$). Intuitivamente: fijado $\alpha$,
> los valores de $\beta$ son **independientes** de los de $\gamma$.

Una DMV es **trivial** si $\beta \subseteq \alpha$ o si $\alpha \cup \beta = R$.

### Axiomas de las DMV

Además de los tres axiomas propios, hay reglas que **vinculan** dependencias funcionales y
multivaluadas:

- **Complementación:** si $\alpha \twoheadrightarrow \beta$, entonces
  $\alpha \twoheadrightarrow (R - \alpha - \beta)$.
- **Aumentación:** si $\alpha \twoheadrightarrow \beta$ y $\gamma \subseteq \delta$, entonces
  $\alpha\delta \twoheadrightarrow \beta\gamma$.
- **Transitividad:** si $\alpha \twoheadrightarrow \beta$ y $\beta \twoheadrightarrow \gamma$,
  entonces $\alpha \twoheadrightarrow (\gamma - \beta)$.
- **Replicación (FD $\Rightarrow$ DMV):** si $\alpha \to \beta$, entonces
  $\alpha \twoheadrightarrow \beta$. Toda dependencia funcional es multivaluada.
- **Coalescencia (DMV $+$ FD $\Rightarrow$ FD):** si $\alpha \twoheadrightarrow \beta$ y existe una
  dependencia $\gamma \to \delta$ con $\delta \subseteq \beta$ y $\gamma \cap \beta = \varnothing$,
  entonces $\alpha \to \delta$.
- También valen **unión**, **pseudo-transitividad** y **descomposición**, análogas a las de las FD.

### Ejemplo resuelto — inferir una FD por coalescencia

Del segundo parcial. Sea $R(Z,Q,N,J,F)$ con
$$\text{Dep} = \{\, ZF \twoheadrightarrow JZ,\; Q \twoheadrightarrow JN,\; Z \to J \,\}$$
¿Se puede inferir $Q \to J$?

Se aplica **coalescencia** sobre $Q \twoheadrightarrow JN$ (con $\beta = JN$):

- se elige $\delta = J \subseteq JN$;
- la dependencia funcional disponible es $Z \to J$, con $\gamma = Z$ y $Z \cap JN = \varnothing$;
- por coalescencia, $Q \to J$.

**Sí**, $Q \to J$ se infiere.

## Cuarta forma normal (4NF)

> **Definición (4NF).** $R$ está en **4NF** si para toda dependencia multivaluada no trivial
> $\alpha \twoheadrightarrow \beta$ que vale en $R$, $\alpha$ es superclave.

Como toda FD es una DMV (replicación), 4NF implica BCNF. La descomposición a 4NF es análoga a la de
BCNF: se parte por cada DMV que viola la condición.

### Ejemplo resuelto — instancia que separa dos DMV

Del segundo parcial. Sea $R(A,B,C,D,E,G,H)$ con $\text{Dep} = \{\, AB \twoheadrightarrow CDE \,\}$.
Se pide una instancia de **exactamente dos tuplas** que **satisfaga** $AB \twoheadrightarrow CDE$
pero **no** $AB \twoheadrightarrow CD$.

| $A$ | $B$ | $C$ | $D$ | $E$ | $G$ | $H$ |
|---|---|---|---|---|---|---|
| $a_1$ | $b_1$ | $c_1$ | $d_1$ | $e_1$ | $g_1$ | $h_1$ |
| $a_1$ | $b_1$ | $c_2$ | $d_2$ | $e_2$ | $g_1$ | $h_1$ |

- **Satisface $AB \twoheadrightarrow CDE$:** con solo dos tuplas, el resto $\gamma = GH$ es constante
  ($g_1 h_1$); al intercambiar el bloque $CDE$ entre ambas filas se recuperan las mismas dos tuplas.
- **No satisface $AB \twoheadrightarrow CD$:** al separar $CD$ de $E$, exigiría que existieran también
  las tuplas $(a_1,b_1,c_1,d_1,e_2,g_1,h_1)$ y $(a_1,b_1,c_2,d_2,e_1,g_1,h_1)$ — **las que faltan**.
  Como no están, la DMV más chica falla.

> **Nota.** Para que valga $AB \twoheadrightarrow CD$ habría que agregar esas dos tuplas faltantes,
> quedando una instancia de cuatro filas. El ejercicio ilustra que $\alpha \twoheadrightarrow \beta$
> **no** implica $\alpha \twoheadrightarrow \beta'$ para $\beta' \subsetneq \beta$.

## Dependencias de junta y 5NF

> **Definición (dependencia de junta, JD).** $R$ satisface la dependencia de junta
> $\bowtie(R_1, \dots, R_n)$ si se reconstruye exactamente juntando sus proyecciones:
> $$R = \pi_{R_1}(R) \bowtie \pi_{R_2}(R) \bowtie \cdots \bowtie \pi_{R_n}(R)$$
> Una DMV es el caso particular de una JD de **dos** componentes.

> **Definición (5NF).** $R$ está en **5NF** (o *project–join normal form*) si toda dependencia de
> junta que vale en $R$ es consecuencia de sus claves candidatas; equivalentemente, para toda JD no
> trivial, cada componente $R_i$ es superclave de $R$.

La 5NF es la forma normal más estricta de la escala: garantiza que ninguna descomposición por
proyección-junta esconde redundancia que las claves no expliquen.

---

## Ver también

- [[05-formas-normales/01-formas-normales]] — la escala 1NF–5NF y las definiciones de cada forma
- [[05-formas-normales/04-metodo-del-tableau]] — el *chase* para inferir DMV y probar junta sin pérdida
- [[05-formas-normales/02-descomposicion-3nf-bcnf]] — coalescencia aplicada a la síntesis 3NF
- [[04-dependencias-funcionales/01-dependencias-funcionales-y-armstrong]] — axiomas de Armstrong para FD
