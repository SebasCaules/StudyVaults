---
tags: [teoria, unidad-7, subespacios, caracterizacion, nucleo]
fuentes:
  - raw/3-resumenes/algebra.pdf
  - raw/1-teoricas/algebra.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Subespacios

Un **subespacio** es un subconjunto de un espacio vectorial que, con las mismas
operaciones, vuelve a ser un espacio vectorial. En vez de reverificar los ocho axiomas se
usa un **teorema de caracterización** con cuatro condiciones. Continúa la unidad iniciada
en [[01-espacios-vectoriales]]. Transcripción de los apuntes de la cursada 2023-1C.

## Definición

> **Definición (subespacio).** Sea $V$ un $\mathbb{K}$-e.v. Un conjunto $S$ es un
> **subespacio** de $V$ si
> - $S \subseteq V$, y
> - $S$ es un $\mathbb{K}$-e.v. (con las operaciones heredadas de $V$).

## Teorema de caracterización

Chequear los ocho axiomas sobre $S$ es innecesario: muchos se heredan de $V$
automáticamente. Basta verificar que $S$ contenga al cero y sea **cerrado** por las dos
operaciones.

> **Teorema (caracterización de subespacio).** Sea $V$ un $\mathbb{K}$-e.v. Un conjunto
> $S$ es subespacio de $V$ si y solo si cumple:
> 1. $S \subseteq V$;
> 2. $0_V \in S$;
> 3. $v, w \in S \implies v + w \in S$ (cerrado por la suma, $+ : S \times S \to S$);
> 4. $\alpha \in \mathbb{K}, \ v \in S \implies \alpha \cdot v \in S$ (cerrado por el
>    producto por escalar, $\cdot : \mathbb{K} \times S \to S$).

La demostración consiste en ver que las condiciones 3 y 4 garantizan que las operaciones
no se salen de $S$, y que los axiomas restantes se heredan de $V$. Un par de casos:

- **Conmutativa:** $v + w = w + v$ vale para todo $v, w \in V$; en particular para
  $v, w \in S$, pues $S \subseteq V$.
- **Neutro:** $v + 0 = v$ y $0 \in S$ por la condición 2.
- **Inverso aditivo:** dado $v \in S$, tomando $-1 \in \mathbb{K}$ y la condición 4,
  $(-1) \cdot v \in S$; y por la propiedad $(-1) \cdot v = -v$ de los espacios
  vectoriales, el opuesto $-v$ está en $S$.
- **Asociativa, distributivas, etc.:** valen en todo $V$, luego en particular en $S$.

**Observación.** La condición 2 se puede leer como un test rápido: si $0_V \notin S$, ya
se descarta que $S$ sea subespacio.

## El núcleo $\mathrm{Nul}(A)$

Un ejemplo central de subespacio proviene de un sistema homogéneo.

> **Teorema / Definición ($\mathrm{Nul}(A)$).** Sea $A \in \mathbb{K}^{n \times m}$. Se
> define el **núcleo** (o espacio nulo) de $A$ como
> $$\mathrm{Nul}(A) = \{ x \in \mathbb{K}^{m} : A x = 0 \}.$$
> $\mathrm{Nul}(A)$ es un subespacio de $\mathbb{K}^m$.

La verificación con las cuatro condiciones es directa:

1. $\mathrm{Nul}(A) \subseteq \mathbb{K}^m$ por definición.
2. $0 \in \mathrm{Nul}(A)$, pues $A \cdot 0 = 0$.
3. Si $v, w \in \mathrm{Nul}(A)$, entonces $A(v + w) = Av + Aw = 0 + 0 = 0$, así que
   $v + w \in \mathrm{Nul}(A)$.
4. Si $\alpha \in \mathbb{K}$ y $v \in \mathrm{Nul}(A)$, entonces
   $A(\alpha v) = \alpha (A v) = \alpha \cdot 0 = 0$, así que $\alpha v \in
   \mathrm{Nul}(A)$.

## Ejemplos

**Subespacio (inclusión con ceros).** $\mathbb{R}^2$ **no** es subespacio de
$\mathbb{R}^3$: ni siquiera es un subconjunto, ya que $(1, 2) \in \mathbb{R}^2$ pero
$(1, 2) \notin \mathbb{R}^3$. Lo que sí es subespacio de $\mathbb{R}^3$ es
$$\mathbb{R}^2 \times \{0\} = \{ (x, y, 0) : x, y \in \mathbb{R} \},$$
que verifica las cuatro condiciones: $(0,0,0) \in S$; la suma
$(x, y, 0) + (u, v, 0) = (x + u,\, y + v,\, 0) \in S$; y $\alpha (x, y, 0) = (\alpha x,\,
\alpha y,\, 0) \in S$.

**Contraejemplo (no cerrado por suma).** El conjunto
$$S = \{ (x, y) \in \mathbb{R}^2 : x y = 0 \}$$
(la unión de los dos ejes) **no** es subespacio de $\mathbb{R}^2$. Se tiene
$(1, 0) \in S$ (pues $1 \cdot 0 = 0$) y $(0, 1) \in S$ (pues $0 \cdot 1 = 0$), pero la
suma $(1, 0) + (0, 1) = (1, 1) \notin S$, ya que $1 \cdot 1 = 1 \neq 0$. Falla la
cerradura por suma.

**Matrices simétricas.** $S = \{ A \in \mathbb{R}^{2 \times 2} : A \text{ es simétrica} \}$
es subespacio de $\mathbb{R}^{2 \times 2}$: la matriz nula cumple $0^t = 0$; si
$A^t = A$ y $B^t = B$, entonces $(A + B)^t = A^t + B^t = A + B$; y
$(\alpha A)^t = \alpha A^t = \alpha A$.

**Todos los subespacios de $\mathbb{R}^2$.** Son exactamente tres tipos: el total
$S = \mathbb{R}^2$; el trivial $S = \{(0,0)\}$; y, para cada $v \neq 0$, la recta
$$S_v = \{ \alpha v : \alpha \in \mathbb{R} \}$$
que pasa por el origen con dirección $v$. Todo subespacio no trivial y distinto del total
es una de estas rectas.

---

## Ver también

- [[01-espacios-vectoriales]] — la estructura que el subespacio hereda
- [[03-combinacion-lineal-generadores]] — $S_v$ es el subespacio generado por un vector
- [[04-independencia-base-dimension]] — dimensión de un subespacio y $\mathrm{Col}(A)$, $\mathrm{Fil}(A)$
