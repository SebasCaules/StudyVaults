---
tags: [teoria, unidad-3, divisibilidad, algoritmo-de-division]
fuente: raw/3-resumenes/algebra.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Divisibilidad y algoritmo de división

Tercera unidad de Álgebra: el estudio de los **números enteros** $\mathbb{Z}$. Se parte de la
estructura de **anillo** y de la noción de **divisibilidad**, se establece el **algoritmo de
división** (existencia y unicidad de cociente y resto) y se introduce la **combinación entera**,
pieza que reaparece en el máximo común divisor y las ecuaciones diofánticas. El aparato de
[[02-mcd-euclides-primos|MCD, Euclides y primos]] y el de
[[03-congruencias|congruencias]] se construyen sobre estas bases. Transcripción de los apuntes
de la cursada 2023-1C.

## Anillos

El marco algebraico general en el que vive $\mathbb{Z}$ es el de anillo.

> **Definición (anillo).** Un **anillo** es una estructura algebraica formada por un conjunto $A$
> y dos operaciones $+ : A \times A \to A$ y $\cdot : A \times A \to A$ que cumplen:
> $$
> \begin{aligned}
> &\text{(1) } a_1 + a_2 = a_2 + a_1 &&\text{(4) } \forall a \in A\ \exists\, a' : a + a' = 0 \\
> &\text{(2) } a_1 + (a_2 + a_3) = (a_1 + a_2) + a_3 &&\text{(5) } a_1 \cdot a_2 = a_2 \cdot a_1 \\
> &\text{(3) } a + 0 = a &&\text{(6) } a_1 \cdot (a_2 \cdot a_3) = (a_1 \cdot a_2) \cdot a_3 \\
> & &&\text{(7) } a \cdot 1 = a \\
> & &&\text{(8) } a_1 \cdot (a_2 + a_3) = a_1 a_2 + a_1 a_3
> \end{aligned}
> $$
> donde $0$ es el neutro de la suma, $1$ el neutro del producto y $a'$ el inverso aditivo de $a$.

**Observación.** $\mathbb{Z}$ con la suma y el producto usuales es el anillo de referencia de la
unidad.

> **Definición (unidad).** Sea $A$ un anillo. Un elemento $a \in A$ es una **unidad** de $A$ si
> tiene inverso multiplicativo, es decir, si existe $a^{-1} \in A$ tal que $a \cdot a^{-1} = 1$. Se
> nota $\mathcal{U}(A) = \{\, a \in A : a \text{ es unidad} \,\}$.

En $\mathbb{Z}$ las únicas unidades son $1$ y $-1$.

## Divisibilidad

> **Definición (divisibilidad en anillos).** Dados $a, b \in A$ con $a \neq 0$, se dice que $b$ es
> **divisible por $a$** si existe $k \in \mathbb{Z}$ tal que $b = k\,a$. Se nota $a \mid b$ y
> $\mathrm{Div}(b) = \{\, a \in A : a \mid b \,\}$.

En $\mathbb{Z}$ la divisibilidad tiene las siguientes propiedades, para $a, b, c \in \mathbb{Z}$:

i) $a \mid b \Rightarrow |a| \mid |b|$.
ii) $a \mid b$ y $b \neq 0 \Rightarrow |a| \leq |b|$.
iii) $a \mid b$ y $b \mid a \Rightarrow |a| = |b|$.
iv) $a \mid b$ y $a \mid c \Rightarrow a \mid b + c$.
v) $a \mid b$ y $a \mid c + b \Rightarrow a \mid c$.
vi) $a \mid b \Rightarrow a \mid b \cdot c$.
vii) $a \mid b \Rightarrow a^{n} \mid b^{n}$.
viii) $a \mid b$ y $a \mid c \Rightarrow a \mid \alpha b + \beta c$ para todo $\alpha, \beta \in \mathbb{Z}$.

La propiedad viii) —que $a$ divide a toda **combinación entera** de $b$ y $c$— es la que sostiene
buena parte de la teoría de la divisibilidad.

## Algoritmo de división

El resultado central que ordena a los enteros: dividir con resto es siempre posible y el resultado
es único.

> **Teorema (algoritmo de división).** Sean $a \in \mathbb{Z}$ y $d \in \mathbb{Z} - \{0\}$.
> Entonces existen **únicos** $q, r \in \mathbb{Z}$ tales que
> $$a = d\,q + r, \qquad 0 \leq r < |d|.$$
> $q$ es el **cociente** y $r$ el **resto** de dividir $a$ por $d$.

Los apuntes notan el cociente como $q_d(a) = q$ y el resto como $r_d(a) = r$. El resto $r_d(a)$
—que mide "cuánto sobra" al dividir $a$ por $d$— es la magnitud sobre la que se apoyan las
[[03-congruencias|congruencias]].

## Combinación entera

> **Definición (combinación entera).** Sean $a, b \in \mathbb{Z}$. Una **combinación entera** de
> $a$ y $b$ es un número de la forma
> $$r\,a + s\,b, \qquad r, s \in \mathbb{Z}.$$
> donde $r$ y $s$ son los coeficientes enteros de la combinación.

Esta noción es la que permite caracterizar al máximo común divisor como la **menor combinación
entera positiva** de $a$ y $b$ (ver [[02-mcd-euclides-primos]]) y la que da forma al conjunto
solución de una [[04-diofanticas-congruencias-lineales|ecuación diofántica]] $ax + by = c$.

## Criterios de divisibilidad

Los apuntes registran el criterio del $3$, notando el número como la suma de sus dígitos
$a = a_n + a_{n-1} + \dots + a_1 + a_0$:

> **Criterio (divisibilidad por 3).** Si la suma de los dígitos de un número es múltiplo de $3$,
> entonces el número es múltiplo de $3$.

---

## Ver también

- [[02-mcd-euclides-primos]] — MCD como menor combinación entera, algoritmo de Euclides, coprimos, primos y factorización
- [[03-congruencias]] — la relación $a \equiv b \pmod{m}$ construida sobre el resto de la división
- [[04-diofanticas-congruencias-lineales]] — resolver $ax + by = c$ y $ax \equiv b \pmod{m}$ con estas herramientas
