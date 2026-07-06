---
tags: [teoria, unidad-6, lema-de-bombeo, lenguajes-regulares, no-regularidad]
fuente: raw/practicas/tla-practica.pdf
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Lema de bombeo para lenguajes regulares

Todo lenguaje regular cumple una **propiedad de repetición** (o *bombeo*): en cualquier
palabra suficientemente larga hay un tramo que se puede repetir tantas veces como se quiera
sin salir del lenguaje. Es una condición **necesaria** de la regularidad, y por eso su
principal uso práctico es al revés: si un lenguaje **no** la cumple, entonces **no es
regular**.

## Enunciado

> **Lema (de bombeo, lenguajes regulares).** Si $L$ es regular, entonces existe un número
> $n$ (la *constante de bombeo*) tal que **toda** palabra $w \in L$ con $|w| \geq n$ admite una
> descomposición $w = xyz$ que cumple:
> i) $|xy| \leq n$;
> ii) $y \neq \lambda$ (es decir $|y| > 0$);
> iii) $x\,y^{i}\,z \in L$ para todo $i \geq 0$.

La parte iii) dice que se puede **bombear** el tramo central $y$: repetirlo ($i \geq 2$),
quitarlo ($i = 0$) o dejarlo tal cual ($i = 1$), y el resultado sigue en $L$.

**Observación.** Las cotas i) y ii) son las que dan fuerza al lema: como $|xy| \leq n$, el
tramo $xy$ (y en particular $y$) queda confinado al **prefijo** de la palabra; eligiendo una
palabra que empiece con un bloque largo de un mismo símbolo, se fuerza a que $y$ caiga
**dentro de ese bloque**.

## Esquema de una demostración de no regularidad

El lema se usa por contrarrecíproco. Para probar que un lenguaje $L$ **no es regular** se
sigue siempre el mismo guion:

1. **Suponer** que $L$ es regular. Entonces vale el lema con alguna constante $n$.
2. **Elegir** una palabra testigo $w \in L$ con $|w| \geq n$, dependiente de $n$, cuyo
   prefijo de longitud $n$ sea un único bloque (típicamente $a^{n}\cdots$).
3. Como $|xy| \leq n$, deducir la **forma forzada** de la descomposición: $x$ e $y$ viven en
   ese primer bloque, con $|y| > 0$.
4. **Bombear** (elegir un $i$, casi siempre $i = 2$) y mostrar que $x\,y^{i}\,z$ **viola** la
   condición que define a $L$.
5. Concluir el **absurdo**: la condición iii) se debía cumplir para todo $i$, y no se cumple;
   por lo tanto $L$ no es regular.

> **Nota.** Alcanza con exhibir **un** valor de $i$ que saque la palabra de $L$: el lema exige
> que *todos* los $i$ funcionen, así que un solo contraejemplo basta.

## Ejemplo: $s = r + t$

> **Ejemplo.** $L = \{\, a^{r} b^{s} c^{t} \mid s = r + t \,\}$ **no es regular**.

Supongamos que $L$ es regular, con constante $n$. Tomamos la palabra testigo

$$w = a^{n}\, b^{2n}\, c^{n} \in L$$

que pertenece a $L$ porque $r = n$, $s = 2n$, $t = n$ y $s = r + t$. Además $|w| = 4n \geq n$.

Como $|xy| \leq n$, el tramo $xy$ cae por completo en el bloque de $a$, así que
$x = a^{|x|}$, $y = a^{|y|}$ con $|y| > 0$, y $z = a^{\,n - |x| - |y|}\, b^{2n}\, c^{n}$.
Al bombear con un $i$ cualquiera,

$$x\,y^{i}\,z = a^{\,n + |y|(i-1)}\, b^{2n}\, c^{n}$$

Para que esta palabra esté en $L$ debe cumplir $s = r + t$, es decir
$2n = \big(n + |y|(i-1)\big) + n$, o sea $|y|(i-1) = 0$. Como $|y| > 0$, esto solo vale para
$i = 1$ (la palabra original). Tomando por ejemplo $i = 2$ queda $|y|(i-1) = |y| > 0$, con lo
que $x\,y^{2}\,z \notin L$. Absurdo. Por lo tanto $L$ no es regular.

## Ejemplo: disyunción de condiciones

> **Ejemplo.** $L = \{\, a^{j} b^{k} c^{n} d^{m} \mid (j = m) \,\vee\, (j = n \wedge k = m) \,\}$
> **no es regular**.

Supongamos $L$ regular, con constante $n$. Tomamos

$$w = a^{n}\, b^{n}\, c^{n}\, d^{n} \in L$$

que está en $L$ porque $j = k = n = m$ (satisface las **dos** cláusulas de la disyunción).
$|w| = 4n \geq n$.

De nuevo $|xy| \leq n$ obliga a $x = a^{|x|}$, $y = a^{|y|}$ con $|y| > 0$, y el resto de la
palabra intacto. Al bombear,

$$x\,y^{i}\,z = a^{\,n + |y|(i-1)}\, b^{n}\, c^{n}\, d^{n}$$

Llamando $j' = n + |y|(i-1)$ y $k' = n' = m' = n$, revisamos las dos cláusulas:

- $j' = m'$: pide $n + |y|(i-1) = n$, o sea $i = 1$.
- $j' = n' \,\wedge\, k' = m'$: la segunda igualdad se cumple siempre ($n = n$), pero la
  primera, $j' = n'$, vuelve a pedir $i = 1$.

Ambas cláusulas solo sobreviven en $i = 1$. Tomando $i = 2$ ninguna se cumple, luego
$x\,y^{2}\,z \notin L$. Absurdo: $L$ no es regular.

## Ejemplo: condición con máximo

> **Ejemplo.** $L = \{\, a^{m} b^{n} c^{p} \mid (n = m = p) \,\vee\, (n = \max(m, p)) \,\}$
> **no es regular**.

Supongamos $L$ regular, con constante $n$. Tomamos

$$w = a^{k}\, b^{k}\, c^{k} \in L \qquad (k \geq n)$$

que está en $L$ por la primera cláusula ($m = n = p = k$). $|w| = 3k \geq k \geq n$.

El bombeo sobre el bloque de $a$ da $x\,y^{i}\,z = a^{\,k + |y|(i-1)}\, b^{k}\, c^{k}$, con
$|y| > 0$. Escribiendo $m' = k + |y|(i-1)$ y $n' = p' = k$:

- $n' = m' = p'$: pide $k + |y|(i-1) = k$, es decir $i = 1$.
- $n' = \max(m', p')$: tomando $i = 2$ es $m' = k + |y| > k = p'$, luego
  $\max(m', p') = k + |y| \neq k = n'$; no se cumple.

Con $i = 2$ fallan las dos cláusulas, así que $x\,y^{2}\,z \notin L$. Absurdo: $L$ no es
regular.

> **Nota.** Los tres ejemplos provienen de la guía de práctica de la cursada. En todos, la
> clave es la misma: elegir el testigo de modo que el prefijo de longitud $n$ sea un bloque de
> $a$, forzar a que $y$ viva ahí, y bombear hasta romper la condición aritmética del lenguaje.

## Ver también

- [[02-lema-de-bombeo-lenguajes-libres-de-contexto]] — versión del lema para lenguajes libres de contexto
- [[index]] — índice del vault de TLA
