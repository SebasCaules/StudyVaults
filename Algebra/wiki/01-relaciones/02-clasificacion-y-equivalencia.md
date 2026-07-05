---
tags: [teoria, unidad-1, relaciones, equivalencia, orden]
fuente: raw/3-resumenes/algebra.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Clasificación de relaciones, equivalencia y orden

Sobre una relación $R$ en un conjunto $A$ (es decir $R \subseteq A \times A$) se estudian cuatro
propiedades básicas y sus combinaciones dan lugar a las relaciones de **equivalencia** y de
**orden**. Continúa la unidad iniciada en [[01-familias-y-relaciones]]. Transcripción de los
apuntes de la cursada 2023-1C.

## Clasificación de las relaciones

Sea $R$ una relación sobre $A$. A cada propiedad le corresponde su negación, obtenida al
negar el cuantificador universal.

### Reflexiva

> **Definición.** $R$ es **reflexiva** si todo elemento se relaciona consigo mismo:
> $$\forall a \in A : \ a\,R\,a.$$

i) **No reflexiva:** $\exists\, a \in A : \ \lnot(a\,R\,a)$.

### Simétrica

> **Definición.** $R$ es **simétrica** si relacionarse es recíproco:
> $$\forall a, b \in A : \ a\,R\,b \Rightarrow b\,R\,a.$$

ii) **No simétrica:** $\exists\, a, b \in A : \ a\,R\,b \ \wedge\ \lnot(b\,R\,a)$.

### Antisimétrica

> **Definición.** $R$ es **antisimétrica** si dos elementos relacionados en ambos sentidos
> son iguales:
> $$\forall a, b \in A : \ a\,R\,b \ \wedge\ b\,R\,a \Rightarrow a = b.$$
> Equivalentemente: $a\,R\,b \ \wedge\ a \neq b \Rightarrow \lnot(b\,R\,a)$.

iii) **No antisimétrica:** $\exists\, a, b \in A : \ a \neq b \ \wedge\ a\,R\,b \ \wedge\ b\,R\,a$.

### Transitiva

> **Definición.** $R$ es **transitiva** si encadena:
> $$\forall a, b, c \in A : \ a\,R\,b \ \wedge\ b\,R\,c \Rightarrow a\,R\,c.$$

iv) **No transitiva:** $\exists\, a, b, c \in A : \ a\,R\,b \ \wedge\ b\,R\,c \ \wedge\ \lnot(a\,R\,c)$.

## Relaciones de equivalencia y de orden

Combinando las propiedades anteriores se definen los dos tipos generales de relación. Se
abrevia $(R)$ reflexiva, $(S)$ simétrica, $(A)$ antisimétrica y $(T)$ transitiva.

> **Definición (equivalencia).** $R$ es una **relación de equivalencia** si es reflexiva,
> simétrica y transitiva: cumple $(R)$, $(S)$ y $(T)$.

> **Definición (orden).** $R$ es una **relación de orden** si es reflexiva, antisimétrica y
> transitiva: cumple $(R)$, $(A)$ y $(T)$.

> **Definición (orden total).** $R$ es una **relación de orden total** si es de orden y además
> todo par de elementos es comparable:
> $$\forall a, b \in A : \ a\,R\,b \ \vee\ b\,R\,a.$$

## Propiedades de las relaciones de equivalencia

Una relación de equivalencia sobre $A$ **parte** el conjunto en bloques disjuntos. En el
ejemplo de tres bloques $A_1, A_2, A_3$ (todos no vacíos, $A_i \neq \emptyset$) la partición
cumple

$$A_1 \cup A_2 \cup A_3 = A, \qquad A_1 \cap A_2 \cap A_3 = \emptyset$$

y la relación de equivalencia se reconstruye como unión de los bloques consigo mismos:

$$R = (A_1 \times A_1) \cup (A_2 \times A_2) \cup (A_3 \times A_3).$$

> **Nota.** El resumen escribe la condición de disjunción como $A_1 \cap A_2 \cap A_3 = \emptyset$;
> la lectura correcta es que los bloques son disjuntos **de a pares** ($A_i \cap A_j = \emptyset$
> para $i \neq j$), que es lo que hace de $\{A_1, A_2, A_3\}$ una partición.

El conjunto de los bloques es el **conjunto cociente**:

$$A / R = \{\, A_1, \ A_2, \ A_3 \,\}.$$

### Clases de equivalencia

> **Definición (clase).** Sea $R$ una relación de equivalencia sobre $A$ y sea $a \in A$. Se
> define la **clase de $a$** como
> $$\bar{a} = [a] = \{\, b \in A : b\,R\,a \,\} \subseteq A,$$
> el conjunto de todos los elementos relacionados con $a$.

Las clases de equivalencia son exactamente los bloques de la partición, y el cociente $A/R$
es el conjunto de todas ellas.

> **Teorema.** Sea $R$ una relación de equivalencia sobre $A$. Entonces:
> i) $[a] \neq \emptyset$ para todo $a \in A$.
> ii) Para $a, b \in A$ vale $[a] = [b] \ \vee\ [a] \cap [b] = \emptyset$ (dos clases o coinciden o son disjuntas).
> iii) $\displaystyle\bigcup_{a \in A} [a] = A$ (las clases cubren todo el conjunto).

Los tres puntos juntos dicen que las clases de equivalencia forman una **partición** de $A$:
son no vacías, no se solapan y lo cubren por completo.

---

## Ver también

- [[01-familias-y-relaciones]] — familias, producto cartesiano, relación inversa y diagrama de Hasse
