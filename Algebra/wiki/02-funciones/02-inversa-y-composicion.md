---
tags: [teoria, unidad-2, funciones, composicion, inversa, biyectiva]
fuente: raw/3-resumenes/algebra.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Composición y función inversa

Continúa la unidad de [[01-funciones-clasificacion|funciones]]. A partir de la composición de
funciones se define cuándo una función es **inversible** y se muestra que eso equivale a ser
biyectiva. Al final, un ejercicio de parcial que usa inyectividad junto con
[[../03-enteros/01-divisibilidad-congruencias|congruencias]]. Transcripción de los apuntes de la
cursada 2023-1C.

## Composición de funciones

Dadas dos funciones encadenadas, aplicar una y después la otra define una nueva función.

> **Definición (composición).** Dadas $f : A \to B$ y $g : B \to A$, la **composición** $g \circ f$
> es la función que primero aplica $f$ y luego $g$:
> $$(g \circ f)(x) = g\big(f(x)\big)$$
> donde $x \in A$, $f(x) \in B$ y $g(f(x)) \in A$. Se lee "$g$ compuesta con $f$".

**Observación.** La función **identidad** de un conjunto es $\operatorname{id} : A \to A$ con
$\operatorname{id}(a) = a$ para todo $a \in A$. Es el neutro de la composición: componer con la
identidad no cambia la función.

## Función inversa

Una función es inversible cuando existe otra que la "deshace" por ambos lados.

> **Definición (inversible).** Sea $f : A \to B$. Se dice que $f$ es **inversible** si existe una
> función $g : B \to A$ tal que
> $$f \circ g = \operatorname{id}_B \qquad \wedge \qquad g \circ f = \operatorname{id}_A$$
> En ese caso $g$ es única, se nota $g = f^{-1}$ y se llama la **inversa** de $f$. Aquí
> $\operatorname{id}_A$ y $\operatorname{id}_B$ son las identidades de $A$ y de $B$.

Las dos igualdades dicen que aplicar $f$ y después su inversa (o al revés) devuelve el punto de
partida. Sobre los elementos, con $b = f(a)$ y $a = f^{-1}(b)$:

$$\big(f \circ f^{-1}\big)(a) = a \qquad \big(f^{-1} \circ f\big)(b) = b$$

**Nota sobre notación.** Este $f^{-1}$ (la función inversa) sólo existe cuando $f$ es inversible.
No hay que confundirlo con la [[01-funciones-clasificacion#preimagen|preimagen]] $f^{-1}(b)$, que
es un conjunto y se define para cualquier función.

### Inversible es lo mismo que biyectiva

La condición de inversibilidad coincide con la de biyectividad vista en
[[01-funciones-clasificacion]]:

- Que $f \circ f^{-1} = \operatorname{id}_B$ obliga a $f$ a ser **sobreyectiva**: todo $b \in B$
  se alcanza (es $f$ aplicada a $f^{-1}(b)$).
- Que $f^{-1} \circ f = \operatorname{id}_A$ obliga a $f$ a ser **inyectiva**: si $f(x) = f(x')$,
  aplicando $f^{-1}$ a ambos lados queda $x = x'$.

Recíprocamente, una función biyectiva tiene preimagen unitaria para cada $b$, y mandar cada $b$ a
ese único origen define la inversa. En resumen:

> **Observación.** $f$ es **inversible** $\iff$ $f$ es **biyectiva**.

## Ejemplo de parcial: inyectividad vía congruencias

En un parcial aparece una función definida por restos, cuya inyectividad se prueba apoyándose en
divisibilidad. Sea $p \in \mathbb{N}$ **primo** y
$$X = \{\, k \in \mathbb{Z} \ /\ 0 \le k \le p-1 \,\}$$
Sea $q \in \mathbb{Z}$ con $p \nmid q$ (de donde $p$ y $q$ son coprimos). Se define
$$f : X \to X, \qquad f(x) = r_p(qx)$$
donde $r_p(qx)$ es el **resto** de dividir $qx$ por $p$.

> **Proposición.** Con $p$ primo y $p \nmid q$, la función $f(x) = r_p(qx)$ es **inyectiva**.

**Demostración.** Supongamos $f(x) = f(x')$, es decir $r_p(qx) = r_p(qx')$. Tener el mismo resto
módulo $p$ significa $qx \equiv qx' \ (p)$, o sea $p \mid q(x - x')$. Como $p$ es primo y
$p \nmid q$, se sigue $p \mid (x - x')$. Pero $x, x' \in \{0, \dots, p-1\}$, así que
$|x - x'| < p$; el único múltiplo de $p$ en ese rango es $0$, luego $x - x' = 0$, es decir
$x = x'$. Por lo tanto $f$ es inyectiva. $\blacksquare$

> **Nota.** El original razona sobre la escritura $qx = p\,q_p + r$ con $0 \le r < p$ y observa
> que "ningún primo divide a un número entre $0$ y $p$ (sin incluir el $p$)"; acá se reordenó como
> el argumento estándar por congruencias, que es equivalente. La herramienta de fondo es la misma
> de la unidad de [[../03-enteros/01-divisibilidad-congruencias|Enteros]].

---

## Ver también

- [[01-funciones-clasificacion]] — definición de función, imagen, preimagen y clasificación (inyectiva/sobreyectiva/biyectiva)
- [[../03-enteros/01-divisibilidad-congruencias|Enteros: divisibilidad y congruencias]] — herramientas usadas en el ejemplo del parcial
