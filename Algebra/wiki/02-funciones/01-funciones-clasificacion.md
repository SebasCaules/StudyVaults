---
tags: [teoria, unidad-2, funciones, imagen, inyectiva, sobreyectiva, biyectiva]
fuente: raw/3-resumenes/algebra.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Funciones: definición, imagen y clasificación

Segunda unidad de Álgebra. Una **función** es un caso particular de
[[01-relaciones/01-familias-y-relaciones|relación]]: la que a cada elemento del primer conjunto
le asigna **exactamente uno** del segundo. Acá se ven la definición como relación, el dominio,
codominio e imagen, la preimagen de un elemento y la clasificación en inyectivas, sobreyectivas y
biyectivas. La función inversa y la composición se tratan en
[[02-inversa-y-composicion]]. Transcripción de los apuntes de la cursada 2023-1C.

## Definición de función

Una función se define como una relación $R \subseteq A \times B$ que cumple dos condiciones: que
**todo** elemento de $A$ tenga imagen, y que esa imagen sea **única**.

> **Definición (función).** Una relación $R \subseteq A \times B$ se dice **función de $A$ en
> $B$**, y se nota $f : A \to B$, si se cumplen simultáneamente:
> i) $\forall\, a \in A \ \ \exists\, b \in B$ tal que $(a, b) \in R$ (todo elemento de $A$ tiene imagen);
> ii) $(a, b) \in R \ \wedge\ (a, c) \in R \implies b = c$ (la imagen es única).

Cuando $(a, b) \in R$ se escribe $b = f(a)$: $b$ es la **imagen** de $a$ por $f$.

> **Notación.** En $f : A \to B$, el conjunto de partida $A$ es el **dominio**, $\operatorname{Dom} f$,
> y el conjunto de llegada $B$ es el **codominio**, $\operatorname{Codom} f$.

Las dos condiciones se leen bien sobre diagramas de conjuntos:

- **Condición i)** — de cada elemento de $A$ tiene que salir al menos una flecha hacia algún
  $b \in B$: ningún elemento del dominio queda sin imagen.
- **Condición ii)** — de un mismo elemento de $A$ no pueden salir dos flechas a destinos
  distintos: si $a$ apunta a $b$ y a $c$, entonces $b = c$.

## Imagen de una función

No todo el codominio hace falta que sea alcanzado. El subconjunto de $B$ que efectivamente se
alcanza es la imagen.

> **Definición (imagen).** La **imagen** de $f : A \to B$ es el conjunto de los elementos del
> codominio que son imagen de algún elemento del dominio:
> $$\operatorname{Im} f = \{\, b \in B \ /\ \exists\, a \in A : (a, b) \in R \,\}$$
> donde $b$ recorre el codominio $B$ y $a$ el dominio $A$. Siempre vale $\operatorname{Im} f \subseteq B$.

## Preimagen

Dado un elemento del codominio, interesa el conjunto de sus "orígenes" en el dominio.

> **Definición (preimagen).** Dado $b \in B$, la **preimagen** de $b$ por $f$ es el conjunto de
> los elementos de $A$ cuya imagen es $b$:
> $$f^{-1}(b) = \{\, a \in A \ /\ f(a) = b \,\}$$
> donde $a$ recorre el dominio. La preimagen es un **subconjunto de $A$** y puede tener cero, uno
> o varios elementos.

**Observación.** El símbolo $f^{-1}(b)$ para la preimagen es un conjunto y existe siempre, aun
cuando $f$ no sea inversible. No hay que confundirlo con la [[02-inversa-y-composicion|función
inversa]] $f^{-1}$, que sólo existe cuando $f$ es biyectiva.

## Clasificación de funciones

Según cuántos elementos del dominio caen sobre cada elemento del codominio, una función se
clasifica en inyectiva, sobreyectiva o biyectiva.

### Función inyectiva

> **Definición (inyectiva).** $f : A \to B$ es **inyectiva** si elementos distintos del dominio
> tienen imágenes distintas. Equivalentemente, en sus dos formas:
> i) $\forall\, x, x' \in A : \ f(x) = f(x') \implies x = x'$;
> ii) $x \neq x' \implies f(x) \neq f(x')$ (contrarrecíproca de i).

La forma i) es la que se usa para **demostrar** inyectividad: se supone $f(x) = f(x')$ y se
deduce $x = x'$.

### Función sobreyectiva

> **Definición (sobreyectiva).** $f : A \to B$ es **sobreyectiva** si todo elemento del codominio
> es imagen de algún elemento del dominio. Equivalentemente:
> i) $\forall\, y \in B \ \ \exists\, x \in A : f(x) = y$;
> ii) $\operatorname{Im} f = B$ (la imagen es todo el codominio).

### Función biyectiva

> **Definición (biyectiva).** $f : A \to B$ es **biyectiva** si es **inyectiva y sobreyectiva a
> la vez**.

En una función biyectiva cada elemento del codominio tiene **exactamente un** origen en el
dominio: la preimagen $f^{-1}(b)$ tiene un único elemento para todo $b \in B$. Esta es
precisamente la condición que permite invertir la función, como se ve en
[[02-inversa-y-composicion]].

| Tipo | Condición | Lectura |
|---|---|---|
| Inyectiva | $f(x)=f(x') \Rightarrow x=x'$ | ningún $b$ tiene dos orígenes |
| Sobreyectiva | $\operatorname{Im} f = B$ | ningún $b$ queda sin origen |
| Biyectiva | inyectiva $\wedge$ sobreyectiva | cada $b$ tiene exactamente un origen |

---

## Ver también

- [[02-inversa-y-composicion]] — composición de funciones y función inversa; biyectividad como condición para invertir
- [[01-relaciones/01-familias-y-relaciones]] — la relación como estructura de la que la función es un caso particular
