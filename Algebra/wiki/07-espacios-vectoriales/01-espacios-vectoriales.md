---
tags: [teoria, unidad-7, espacios-vectoriales, definicion, propiedades]
fuentes:
  - raw/3-resumenes/algebra.pdf
  - raw/1-teoricas/algebra.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Espacios vectoriales: definición y propiedades

Séptima unidad de Álgebra. Se define la estructura de **espacio vectorial** sobre un
cuerpo, se listan las ocho propiedades que la caracterizan y las propiedades que se
deducen de ellas, y se dan los ejemplos canónicos ($\mathbb{K}^n$, matrices, polinomios,
funciones). Sobre esta estructura se apoyan los [[02-subespacios|subespacios]], la
[[03-combinacion-lineal-generadores|combinación lineal]] y la
[[04-independencia-base-dimension|base y dimensión]]. La referencia de la cátedra es
Strang, *Álgebra lineal*. Transcripción de los apuntes de la cursada 2023-1C.

## Definición de espacio vectorial

Un espacio vectorial se arma con cuatro objetos: un conjunto de vectores, un cuerpo de
escalares y dos operaciones que los vinculan.

> **Definición (espacio vectorial).** Un **espacio vectorial** es una estructura que
> consta de cuatro objetos $(V, \mathbb{K}, +, \cdot)$, donde
> $$+ : V \times V \to V \qquad \cdot : \mathbb{K} \times V \to V$$
> - los elementos de $V$ se llaman **vectores**;
> - $\mathbb{K}$ es un **cuerpo** y a sus elementos se los llama **escalares** (aquí
>   $\mathbb{K} = \mathbb{R}$ o $\mathbb{K} = \mathbb{C}$);
> - $+$ es la suma de vectores y $\cdot$ el producto de un escalar por un vector.

Además, las operaciones deben cumplir **ocho propiedades**. Cuatro rigen la suma:

i) **Conmutativa:** $v + w = w + v$.
ii) **Asociativa:** $v + (w + u) = (v + w) + u$.
iii) **Neutro:** existe $0 \in V$ tal que $v + 0 = v$.
iv) **Inverso aditivo:** para todo $v \in V$ existe $v' \in V$ tal que $v + v' = 0$.

Y cuatro rigen el producto por escalar, con $\alpha, \beta \in \mathbb{K}$ y $v, u \in V$:

v) $1 \cdot v = v$.
vi) $\alpha \, (v + u) = \alpha v + \alpha u$.
vii) $(\alpha + \beta) \, v = \alpha v + \beta v$.
viii) $(\alpha \cdot \beta) \cdot v = \alpha \cdot (\beta \cdot v)$.

> **Notación.** Cuando $V$ es un espacio vectorial sobre el cuerpo $\mathbb{K}$ se escribe
> que $V$ es un **$\mathbb{K}$-e.v.**

## Propiedades derivadas

De los ocho axiomas se deducen las siguientes propiedades, válidas en todo
$\mathbb{K}$-e.v. Aquí $0_{\mathbb{K}}$ es el cero del cuerpo y $0_V$ el vector nulo.

i) El **neutro para la suma es único**.
ii) $0_{\mathbb{K}} \cdot v = 0_V$ para todo $v \in V$.
iii) $\alpha \cdot 0_V = 0_V$ para todo $\alpha \in \mathbb{K}$.
iv) $\alpha \cdot v = 0_V \implies \alpha = 0 \ \text{ó} \ v = 0_V$.
v) El **opuesto de un vector es único**.
vi) $(-1) \cdot v = -v$ para todo $v \in V$.
vii) $\alpha \, (v_1 + v_2 + \cdots + v_n) = \alpha v_1 + \alpha v_2 + \cdots + \alpha v_n$.

La propiedad iv) es la que más se usa (dice que en un espacio vectorial no hay
"divisores de cero" mezclando escalar y vector); su demostración ilustra cómo se
encadenan los axiomas.

> **Proposición (demostración de iv).** Si $\alpha \cdot v = 0_V$, entonces $\alpha = 0$
> ó $v = 0_V$.
> $$\text{Si } \alpha = 0 \text{ vale la tesis. Supongamos } \alpha \neq 0.$$
> Como $\alpha \in \mathbb{K}$ y $\alpha \neq 0$, existe $\alpha^{-1}$ con
> $\alpha^{-1} \cdot \alpha = 1$. Multiplicando la hipótesis por $\alpha^{-1}$ y usando
> el axioma viii),
> $$\alpha^{-1} (\alpha \cdot v) = (\alpha^{-1} \alpha) \cdot v = 1 \cdot v = v.$$
> Por otro lado $\alpha^{-1} \cdot 0_V = 0_V$ (propiedad iii), de modo que
> $$v = \alpha^{-1} (\alpha v) = \alpha^{-1} \cdot 0_V = 0_V.$$
> Luego $v = 0_V$. $\blacksquare$

**Observación.** Las demás propiedades se prueban de forma análoga, encadenando los
axiomas; en los apuntes se detalla solo iv) y se deja el resto como opcional.

## Ejemplos

Los ejemplos siguientes son los que se usan durante toda la unidad.

| Espacio | Cuerpo | Observación |
|---|---|---|
| $\mathbb{R}^n$ | $\mathbb{R}$ | con la suma y el producto por escalar estándar |
| $\mathbb{C}^n$ | $\mathbb{R}$ o $\mathbb{C}$ | $\mathbb{C}^n$ es $\mathbb{K}$-e.v. con ambos cuerpos |
| $\mathbb{K}^{n \times r}$ | $\mathbb{R}$ o $\mathbb{C}$ | matrices; $\mathbb{R}^{n\times r}$ es $\mathbb{R}$-e.v. |
| $\mathbb{C}[x]$ | $\mathbb{R}$ o $\mathbb{C}$ | polinomios con coeficientes complejos |
| $\mathbb{R}[x]$ | $\mathbb{R}$ | polinomios con coeficientes reales |
| $V = \{ f : \mathbb{R} \to \mathbb{R} \}$ | $\mathbb{R}$ | funciones reales |

Para verificar que $\mathbb{R}^n$ es un $\mathbb{R}$-e.v. hay que chequear las ocho
propiedades. En el espacio de funciones las operaciones se definen punto a punto:
$$(f + g)(x) = f(x) + g(x), \qquad (\alpha f)(x) = \alpha \cdot f(x).$$

> **Nota.** $\mathbb{R}^n$ **no** es un $\mathbb{C}$-e.v.: el producto por un escalar
> complejo saca del conjunto. Por ejemplo, con $i \in \mathbb{C}$,
> $$i \cdot (1, 1, \dots, 1) = (i, i, \dots, i) \notin \mathbb{R}^n.$$
> El producto $\cdot : \mathbb{C} \times \mathbb{R}^n \to \mathbb{R}^n$ ni siquiera está
> bien definido, así que falla la estructura antes de mirar los axiomas.

## Un $\mathbb{C}$-e.v. es también un $\mathbb{R}$-e.v.

El recíproco del ejemplo anterior sí vale: restringir el cuerpo de escalares nunca rompe
la estructura.

> **Teorema.** Si $V$ es un $\mathbb{C}$-e.v., entonces $V$ es un $\mathbb{R}$-e.v.

La idea de la demostración es que la suma $+ : V \times V \to V$ no depende del cuerpo, y
el producto por escalar
$$\cdot : \mathbb{C} \times V \to V$$
se restringe a $\cdot : \mathbb{R} \times V \to V$ porque $\mathbb{R} \subseteq
\mathbb{C}$. Todas las propiedades que valían para escalares complejos siguen valiendo, en
particular, para los reales.

> **Nota.** La recíproca es falsa: un $\mathbb{R}$-e.v. no tiene por qué ser
> $\mathbb{C}$-e.v. (ver el caso de $\mathbb{R}^n$ arriba). En los apuntes esto queda
> señalado como "no vale".

---

## Ver también

- [[02-subespacios]] — subconjuntos de $V$ que heredan la estructura
- [[03-combinacion-lineal-generadores]] — cómo se generan vectores a partir de otros
- [[04-independencia-base-dimension]] — independencia lineal, base y dimensión
- [[06-matrices-sistemas/01-matrices-operaciones|Matrices y operaciones]] — $\mathbb{K}^{n\times r}$ y los sistemas lineales de fondo
