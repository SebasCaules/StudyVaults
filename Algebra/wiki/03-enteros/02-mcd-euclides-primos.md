---
tags: [teoria, unidad-3, mcd, euclides, primos]
fuente: raw/3-resumenes/algebra.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Máximo común divisor, Euclides y primos

Sobre la [[01-divisibilidad-y-division|divisibilidad]] y la combinación entera se construye el
**máximo común divisor** (MCD), su cálculo por el **algoritmo de Euclides**, la noción de
**coprimalidad** y la aritmética de los **números primos**: el teorema fundamental de la
aritmética, el mínimo común múltiplo y la valuación $p$-ádica. Transcripción de los apuntes de la
cursada 2023-1C.

## Máximo común divisor

> **Definición (MCD).** Sean $a, b \in \mathbb{Z}$ no ambos nulos. Un entero $d \in \mathbb{Z}$ es
> el **máximo común divisor** de $a$ y $b$ si cumple:
> $$
> \text{(1) } d \in \mathbb{N}, \qquad
> \text{(2) } d \mid a \ \text{y}\ d \mid b, \qquad
> \text{(3) } c \mid a \ \text{y}\ c \mid b \Rightarrow c \mid d \ \ (c \in \mathbb{Z}).
> $$
> Se nota $\mathrm{MCD}(a, b)$ o $(a : b) = d$. En palabras: $d$ es divisor común (2) y todo otro
> divisor común lo divide (3).

Una propiedad de escalado que se usa al simplificar: sacar un factor común $c$ escala el MCD por
$|c|$.

> **Propiedad.** Sean $a, b \in \mathbb{Z}$ no ambos nulos y $c \in \mathbb{Z} - \{0\}$. Entonces
> $$(ca : cb) = |c|\,(a : b).$$

### El MCD como menor combinación entera

> **Teorema.** Sean $a, b \in \mathbb{Z}$ no ambos nulos. Existe un **único** $d = (a : b)$ y,
> además, ese $d$ es la **menor combinación entera positiva** de $a$ y $b$; es decir, el menor
> valor positivo de la forma $r\,a + s\,b$ con $r, s \in \mathbb{Z}$.

Esta caracterización es el puente entre el MCD y las
[[04-diofanticas-congruencias-lineales|ecuaciones diofánticas]]: como $d$ se escribe $d = ra + sb$,
la ecuación $ax + by = c$ tiene solución exactamente cuando $d \mid c$.

## Algoritmo de Euclides

El cálculo efectivo del MCD descansa en un lema que permite reducir el problema a números más
chicos, reemplazando un argumento por su resto.

> **Lema (Euclides).** Sean $a, b \in \mathbb{Z}$ no ambos nulos. Entonces
> $$(a : b) = (b : a - k\,b) \qquad \forall\, k \in \mathbb{Z}.$$
> En particular, si $b \neq 0$ y $k = q_b(a)$ es el cociente de dividir $a$ por $b$, queda
> $$(a : b) = \big(\,b : r_b(a)\,\big),$$
> donde $r_b(a)$ es el resto de dividir $a$ por $b$.

Iterando la segunda forma —reemplazar el par $(a, b)$ por $(b, r_b(a))$ hasta que el resto sea
cero— se obtiene el máximo común divisor. El último resto no nulo es $(a : b)$, y las cuentas del
proceso permiten recuperar los coeficientes $r, s$ de la combinación entera $d = ra + sb$.

## Números coprimos

> **Definición (coprimos).** $a, b \in \mathbb{Z}$ son **coprimos** si $(a : b) = 1$. Se nota
> $a \perp b$.

Las propiedades de la coprimalidad son las que hacen "pasar" divisibilidad de un factor a otro:

i) $a \perp b$ y $a \mid b\,c \Rightarrow a \mid c$.
ii) $a \perp b$ y $a \perp c \Rightarrow a \perp b\,c$.
iii) $a \mid c$, $b \mid c$ y $a \perp b \Rightarrow a\,b \mid c$.
iv) $d = (a : b) \Rightarrow 1 = \left(\tfrac{a}{d} : \tfrac{b}{d}\right)$.
v) $a \perp b \Rightarrow a^{n} \perp b^{n}$.
vi) $a \perp c \Rightarrow (a : c\,b) = (a : b)$.

## Números primos y compuestos

> **Definición (primo).** $p \in \mathbb{Z}$ es **primo** si tiene exactamente cuatro divisores:
> $\mathrm{Div}(p) = \{\, \pm 1,\ \pm p \,\}$.

> **Definición (compuesto).** $a \in \mathbb{Z}$ es **compuesto** si $a$ no es primo ni $\pm 1$.

Los teoremas básicos sobre primos, para todo $a, b \in \mathbb{Z}$:

i) Si $p$ es primo y $p \mid a\,b$, entonces $p \mid a$ o $p \mid b$.
ii) Hay **infinitos** primos.

Sobre compuestos y la interacción primo–entero:

i) Si $a$ es compuesto, existen $a_1, a_2 \in \mathbb{Z}$ con $a = a_1 a_2$ y $2 \leq |a_1| \leq |a| - 1$.
ii) $(a : p) = \begin{cases} 1 & \text{si } p \nmid a \\ p & \text{si } p \mid a \end{cases}$ para $p$ primo.

## Teorema fundamental de la aritmética

> **Teorema (TFA).** Sea $a \in \mathbb{Z}$ con $a \notin \{0, \pm 1\}$. Entonces
> $$a = \mathrm{sg}(a)\, \cdot\, p_1^{\,d_1} \cdot p_2^{\,d_2} \cdots p_r^{\,d_r},$$
> con $p_1 < p_2 < \dots < p_r$ primos positivos y $d_s \in \mathbb{N}$ para $1 \leq s \leq r$.
> Además, la factorización es **única**. Aquí $\mathrm{sg}(a)$ es el signo de $a$, $p_s$ los
> primos que lo dividen y $d_s$ sus multiplicidades.

> **Corolario.** Si $a \in \mathbb{Z} - \{0, \pm 1\}$, entonces existe un primo $p$ con $p \mid a$.

## Mínimo común múltiplo

> **Definición (MCM).** Sean $a, b \in \mathbb{Z}$ no ambos nulos. $m = [a : b] = \mathrm{MCM}(a, b)$
> si cumple:
> $$
> \text{(1) } m > 0, \qquad
> \text{(2) } a \mid m \ \text{y}\ b \mid m, \qquad
> \text{(3) } a \mid c \ \text{y}\ b \mid c \Rightarrow m \mid c.
> $$

MCD y MCM están ligados por una identidad que permite calcular uno a partir del otro.

> **Teorema.** Para $a, b \in \mathbb{Z} - \{0\}$,
> $$(a : b)\,[a : b] = |a|\,|b| \qquad \Longrightarrow \qquad [a : b] = \frac{|a|\,|b|}{(a : b)}.$$

## Valuación p-ádica

> **Definición (valuación $p$-ádica).** Sea $p$ primo, $p > 0$. Se define
> $v_p : \mathbb{Z} - \{0\} \to \mathbb{N}_0$ por
> $$v_p(a) = \begin{cases} 0 & \text{si } p \nmid a \\ t & \text{si } p^{t} \mid a \ \text{y}\ p^{\,t+1} \nmid a \end{cases}$$
> es decir, $v_p(a)$ es el exponente con el que $p$ aparece en la factorización de $a$.

Propiedades de la valuación:

i) $v_p(a \cdot b) = v_p(a) + v_p(b)$.
ii) $v_p(a^{n}) = n\, v_p(a)$.
iii) $d \mid a \Rightarrow v_p(d) \leq v_p(a)$.

---

## Ver también

- [[01-divisibilidad-y-division]] — divisibilidad, algoritmo de división y combinación entera
- [[03-congruencias]] — congruencias, teorema de Fermat y teorema chino del resto
- [[04-diofanticas-congruencias-lineales]] — el MCD como criterio de existencia de soluciones
