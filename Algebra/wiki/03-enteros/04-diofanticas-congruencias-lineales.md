---
tags: [teoria, unidad-3, diofanticas, congruencias-lineales, inverso-multiplicativo]
fuentes:
  - raw/3-resumenes/algebra.pdf
  - raw/4-parciales-finales/algebra.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Ecuaciones diofánticas y congruencias lineales

Las dos ecuaciones "de enteros" de la unidad: la **diofántica** $ax + by = c$ (soluciones enteras)
y la **congruencia lineal** $ax \equiv b \pmod{m}$. Ambas se resuelven con el mismo aparato —el
[[02-mcd-euclides-primos|MCD y el algoritmo de Euclides]]— y el criterio de existencia es el mismo:
que el MCD divida al término independiente. En el camino aparece el **inverso multiplicativo**
módulo $m$. Transcripción de los apuntes de la cursada 2023-1C.

## Ecuaciones diofánticas

> **Definición (ecuación diofántica).** Sean $a, b, c \in \mathbb{Z} - \{0\}$. Se llama **ecuación
> diofántica** a $ax + by = c$. Resolverla consiste en hallar **todos** los $x, y \in \mathbb{Z}$
> que la verifican.

El criterio de existencia y la forma del conjunto solución dependen del MCD $d = (a : b)$.

> **Teorema.** Sean $a, b \in \mathbb{Z} - \{0\}$, $c \in \mathbb{Z}$ y $d = (a : b)$. Entonces:
> $$
> \text{(1) } ax + by = c \text{ tiene solución} \iff d \mid c,
> $$
> $$
> \text{(2) si } d \mid c, \quad \mathrm{Sol} = \left\{\, \left(\, x_0 + k\,\tfrac{b}{d}\ ,\ \ y_0 - k\,\tfrac{a}{d} \,\right) : k \in \mathbb{Z} \,\right\},
> $$
> donde $(x_0, y_0)$ es una **solución particular** cualquiera y $k$ recorre los enteros.

La existencia sale de que $d$ es la [[02-mcd-euclides-primos|menor combinación entera positiva]] de
$a$ y $b$: si $d \mid c$, se escala esa combinación para alcanzar $c$.

### Pasos para resolverla

El resumen fija un procedimiento en cuatro pasos:

1. Calcular $d = (a : b)$ y **chequear si $d \mid c$** (si no divide, no hay solución).
2. **Coprimizar** la ecuación dividiendo todo por $d$, de modo que los coeficientes queden coprimos.
3. Con el **algoritmo de Euclides** hallar la menor combinación entera de $a$ y $b$ y, con ella, una **solución particular** $(x_0, y_0)$.
4. Armar la **solución completa** con la fórmula (2) del teorema.

## Congruencias lineales

> **Definición (congruencia lineal).** Se llama **congruencia lineal** a $ax \equiv b \pmod{m}$,
> donde $x$ es la incógnita.

> **Teorema.** Dada $ax \equiv b \pmod{m}$:
> $$
> \text{(1) tiene solución} \iff (a : m) \mid b,
> $$
> (2) si $x_0$ es una solución particular, entonces **todas** las soluciones satisfacen
> $$x \equiv x_0 \pmod{\tfrac{m}{(a : m)}}.$$

**Observación.** La congruencia lineal $ax \equiv b \pmod{m}$ equivale a la diofántica
$ax - m\,y = b$: por eso comparten el criterio de existencia "el MCD divide al término
independiente".

### Tabla de restos

> **Técnica (tabla de restos).** Si no se logra despejar el inverso multiplicativo de $a$ módulo
> $m$, se arma una tabla con $x \in \{0, 1, \dots, m-1\}$ y el valor de $ax$ (reducido módulo $m$)
> para localizar las soluciones por inspección.

| $x$ | $ax \pmod{m}$ |
|---|---|
| $0$ | $\dots$ |
| $1$ | $\dots$ |
| $\vdots$ | $\vdots$ |
| $m-1$ | $\dots$ |

## Inverso multiplicativo

> **Definición (inverso multiplicativo).** $a$ es el **inverso multiplicativo** de $b$ módulo $m$
> si $a \cdot b \equiv 1 \pmod{m}$.

Cuando $a$ tiene inverso módulo $m$, la congruencia $ax \equiv b \pmod{m}$ se resuelve
multiplicando por él. El inverso existe exactamente cuando $a \perp m$; para hallarlo:

1. Chequear si $(a : m) \mid b$ (con $(a : m) = 1$ hay inverso y la congruencia tiene solución).
2. Escribir la **combinación lineal** de Euclides $(a : m) = a\,k + m\,q$.
3. Como $(a : m) = 1$, reduciendo módulo $m$ queda $a\,k \equiv 1 \pmod{m}$: el coeficiente $k$ es el **inverso multiplicativo de $a$** módulo $m$.

> **Corolario.** Si $m$ es primo, entonces todos los números **no múltiplos** de $m$ tienen inverso
> multiplicativo módulo $m$.

El [[03-congruencias|teorema de Fermat]] da una vía alternativa cuando $m = p$ es primo y
$p \nmid a$: como $a^{p-1} \equiv 1 \pmod{p}$, el inverso de $a$ es $a^{p-2}$.

## Ejemplo: multiplicar por un coprimo permuta los restos

Un ejercicio de final ilustra por qué multiplicar por $q$ coprimo con $p$ es reversible módulo $p$
—que es, en el fondo, la existencia del inverso multiplicativo.

> **Ejemplo.** Sea $p \in \mathbb{N}$ primo y $X = \{\, k \in \mathbb{Z} : 0 \leq k \leq p-1 \,\}$
> el conjunto de restos módulo $p$. Sea $q \in \mathbb{Z}$ con $p \nmid q$ (por lo tanto
> $p \perp q$). La función $f : X \to X$, $f(x) = r_p(q x)$, es **inyectiva**.
>
> **Demostración.** Supongamos $f(x) = f(x')$. Entonces $r_p(qx) = r_p(qx')$, es decir,
> $qx \equiv qx' \pmod{p}$, o sea $p \mid q(x - x')$. Como $p \perp q$, la propiedad de
> coprimalidad da $p \mid x - x'$. Pero $x, x' \in \{0, \dots, p-1\}$, así que $|x - x'| < p$; el
> único múltiplo de $p$ en ese rango es $0$. Luego $x - x' = 0$, es decir $x = x'$. $\blacksquare$

Como $X$ es finito, la inyectividad implica que $f$ es una **biyección**: multiplicar por $q$ (con
$p \perp q$) solo reordena los restos módulo $p$. Es la razón estructural por la que existe el
inverso de $q$ módulo $p$.

---

## Ver también

- [[02-mcd-euclides-primos]] — MCD, algoritmo de Euclides y la menor combinación entera (criterio de existencia)
- [[03-congruencias]] — la relación $a \equiv b \pmod{m}$, la propiedad cancelativa y Fermat
- [[01-divisibilidad-y-division]] — divisibilidad y combinación entera, base de ambos criterios
- [[02-funciones/01-funciones-clasificacion|Inyectividad y funciones]] — la noción usada en el ejemplo final
