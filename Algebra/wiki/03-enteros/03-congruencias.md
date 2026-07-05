---
tags: [teoria, unidad-3, congruencias, fermat, teorema-chino]
fuente: raw/3-resumenes/algebra.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Congruencias

La **congruencia módulo $m$** es la relación que agrupa enteros por su
[[01-divisibilidad-y-division|resto de división]] común. Es una relación de equivalencia
compatible con la suma y el producto, lo que la vuelve una herramienta de cálculo: se pueden
"reducir módulo $m$" antes de operar. Sobre ella se apoyan el **teorema de Fermat** y el **teorema
chino del resto**. Transcripción de los apuntes de la cursada 2023-1C.

## La relación de congruencia

> **Definición (congruencia).** Sean $d \in \mathbb{N}$ y $a, b \in \mathbb{Z}$. Se dice que $a$ es
> **congruente a $b$ módulo $d$** si $d \mid a - b$.

Los apuntes escriben la relación de varias formas equivalentes; con módulo $m$:

$$a \equiv b \pmod{m} \iff m \mid a - b \iff \exists\, k \in \mathbb{Z} : a - b = k\,m \iff a = \underbrace{k\,m}_{} + \underbrace{b}_{},$$

donde $m$ es el módulo, $k$ el entero que da la diferencia como múltiplo de $m$, y la última forma
exhibe a $b$ en el papel del "resto" al escribir $a = km + b$.

> **Teorema (equivalencia).** Sea $R$ la relación sobre $\mathbb{Z}$ definida por $a\,R\,b$ si
> $a \equiv b \pmod{m}$, con $m \in \mathbb{N}$. Entonces $R$ es una **relación de equivalencia**
> (reflexiva, simétrica y transitiva).

La conexión con la [[01-relaciones/02-clasificacion-y-equivalencia|clasificación de relaciones]]
es directa: cada módulo $m$ parte $\mathbb{Z}$ en clases de equivalencia, una por cada resto
posible.

## Propiedades operatorias

La congruencia es compatible con las operaciones de $\mathbb{Z}$, para $m, n \in \mathbb{N}$ y
$c \in \mathbb{Z}$:

i) Si $a_1 \equiv b_1 \pmod{m}$ y $a_2 \equiv b_2 \pmod{m}$, entonces
$$a_1 + a_2 \equiv b_1 + b_2 \pmod{m}, \qquad a_1 \cdot a_2 \equiv b_1 \cdot b_2 \pmod{m}.$$
ii) La suma y el producto se extienden a $n$ congruencias: $a_1 \equiv b_1, \dots, a_n \equiv b_n \pmod{m}$ implican $a_1 + \dots + a_n \equiv b_1 + \dots + b_n$ y $a_1 \cdots a_n \equiv b_1 \cdots b_n \pmod{m}$.
iii) $a \equiv b \pmod{m} \Rightarrow a^{n} \equiv b^{n} \pmod{m}$.
iv) $a \equiv b \pmod{m} \Rightarrow a \cdot c \equiv b \cdot c \pmod{m}$.

**Abuso de la relación (permitido).** De $a \equiv b \pmod{m}$, $b \equiv c \pmod{m}$ y
$c \equiv d \pmod{m}$ se escribe encadenado $a \equiv b \equiv c \equiv d \pmod{m}$, aprovechando la
transitividad.

## Congruencia y resto de división

El resto de la división conecta la congruencia con un **representante canónico** por clase.

> **Teorema (restos).** Sea $m \in \mathbb{N}$. Entonces
> $$
> \text{(1) } a \equiv r_m(a) \pmod{m}, \qquad
> \text{(2) } a \equiv b \pmod{m} \iff r_m(a) = r_m(b),
> $$
> donde $r_m(a)$ es el resto de dividir $a$ por $m$.

Es decir: dos enteros son congruentes módulo $m$ si y solo si dejan el **mismo resto** al dividirse
por $m$, y todo entero es congruente a su resto $r_m(a) \in \{0, 1, \dots, m-1\}$. Esa es la base de
la **tabla de restos** que se usa para resolver
[[04-diofanticas-congruencias-lineales|congruencias lineales]].

## Propiedad cancelativa

Cancelar un factor común en una congruencia solo es lícito cuando ese factor es **coprimo** con el
módulo.

> **Propiedad (cancelativa).** Si $a\,c \equiv a\,c' \pmod{m}$ y $a \perp m$, entonces
> $$c \equiv c' \pmod{m}.$$

La hipótesis de coprimalidad $a \perp m$ es esencial: sin ella la cancelación puede fallar.

## Teorema de Fermat

> **Teorema (Fermat).** Sea $p$ primo, $p > 0$. Entonces para todo $a \in \mathbb{Z}$:
> $$
> \text{(1) } a^{p} \equiv a \pmod{p}, \qquad
> \text{(2) } a^{p-1} \equiv 1 \pmod{p} \ \text{ si } p \nmid a.
> $$

La forma (2) es la que provee **inversos multiplicativos** módulo un primo: si $p \nmid a$, entonces
$a \cdot a^{p-2} \equiv 1 \pmod{p}$, así que $a^{p-2}$ es el inverso de $a$
(ver [[04-diofanticas-congruencias-lineales]]).

## Teorema chino del resto

Un sistema de congruencias con módulos coprimos de a pares tiene solución única módulo el producto.

> **Teorema (chino del resto).** Dado el sistema
> $$
> \begin{cases}
> x \equiv a_1 \pmod{m_1} \\
> x \equiv a_2 \pmod{m_2} \\
> \ \ \vdots \\
> x \equiv a_k \pmod{m_k}
> \end{cases}
> $$
> si los módulos son **coprimos de a pares** ($m_i \perp m_j$ para $i \neq j$), entonces existe una
> **única** solución módulo $m_1 \cdot m_2 \cdots m_k$.

---

## Ver también

- [[01-divisibilidad-y-division]] — algoritmo de división y el resto $r_m(a)$ sobre el que se define la congruencia
- [[02-mcd-euclides-primos]] — coprimalidad (hipótesis de la propiedad cancelativa) y primos (hipótesis de Fermat)
- [[04-diofanticas-congruencias-lineales]] — resolver $ax \equiv b \pmod{m}$, inverso multiplicativo y tabla de restos
- [[01-relaciones/02-clasificacion-y-equivalencia]] — la congruencia como relación de equivalencia sobre $\mathbb{Z}$
