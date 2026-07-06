---
tags: [teoria, unidad-6, lema-de-bombeo, lenguajes-libres-de-contexto, no-lc]
fuentes:
  - raw/teoricas/tla-teorica-p2.pdf
  - raw/parciales/parcial-2-resuelto.pdf
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Lema de bombeo para lenguajes libres de contexto

Los lenguajes libres de contexto (LC) también satisfacen una propiedad de bombeo, pero más
rica que la de los regulares: en toda palabra larga hay **dos** tramos que se repiten en
simultáneo. Como en el caso regular, se usa por contrarrecíproco para demostrar que un
lenguaje **no es libre de contexto**.

## Enunciado

> **Lema (de bombeo, lenguajes libres de contexto).** Si $L$ es libre de contexto, entonces
> existe un número $n$ tal que **toda** palabra $w \in L$ con $|w| \geq n$ admite una
> descomposición $w = r\,x\,y\,z\,s$ que cumple:
> i) $|xyz| \leq n$;
> ii) $|xz| > 0$ (los dos tramos bombeados no son simultáneamente vacíos);
> iii) $r\,x^{i}\,y\,z^{i}\,s \in L$ para todo $i \geq 0$.

La diferencia con el caso regular es que se bombean **dos** subcadenas a la vez, $x$ y $z$,
con el **mismo** exponente $i$, y quedan acotadas juntas por la ventana $|xyz| \leq n$.

**Observación.** La condición ii) es $|xz| > 0$, no $|xyz| > 0$: lo que no puede anularse es el
par $x, z$ (el tramo del medio $y$ sí podría ser vacío). Así se garantiza que al bombear la
palabra **cambia** de longitud.

## Esquema de una demostración de no-LC

El guion es análogo al de los [[01-lema-de-bombeo-lenguajes-regulares|lenguajes regulares]]:

1. **Suponer** que $L$ es libre de contexto; entonces vale el lema con alguna constante $n$.
2. **Elegir** un testigo $w \in L$ con $|w| \geq n$, dependiente de $n$.
3. Analizar las descomposiciones $w = r\,x\,y\,z\,s$ compatibles con $|xyz| \leq n$ y
   $|xz| > 0$.
4. **Bombear** con un $i$ conveniente y mostrar que $r\,x^{i}\,y\,z^{i}\,s$ sale de $L$.
5. Concluir el **absurdo** y, por lo tanto, que $L$ no es libre de contexto.

## Ejemplo: palíndromo con conteo cuadrático

> **Ejemplo.** $L = \{\, w \in \{a, b, c\}^{*} \mid w = \alpha\,\alpha^{R}\, c^{\,|\alpha|} \,\}$
> **no es libre de contexto**, donde $\alpha^{R}$ es el [[01-alfabetos-cadenas-clausuras|reverso]]
> de $\alpha$ y $|\alpha|$ su longitud.

Supongamos que $L$ es libre de contexto, con constante $n$. Elegimos como testigo la palabra
generada por $\alpha = a^{\,n^{2}}$:

$$w = a^{\,n^{2}}\, a^{\,n^{2}}\, c^{\,n^{2}} = a^{\,2n^{2}}\, c^{\,n^{2}}, \qquad
|w| = 2n^{2} + n^{2} = 3n^{2}$$

Comparamos con la **siguiente** palabra de $L$ de esa familia, la que corresponde a
$\alpha = a^{\,(n+1)^{2}}$:

$$w' = a^{\,2(n+1)^{2}}\, c^{\,(n+1)^{2}}, \qquad
|w'| = 2(n^{2} + 2n + 1) + (n^{2} + 2n + 1) = 3n^{2} + 6n + 3$$

Ahora bombeamos $w$ con $i = 2$. La palabra bombeada $\tilde{w} = r\,x^{2}\,y\,z^{2}\,s$ agrega
$|xz|$ símbolos respecto de $w$, con $1 \leq |xz| \leq n$ (por las condiciones ii) y i)). Su
longitud queda encerrada entre las de $w$ y $w'$:

$$3n^{2} + 1 \;\leq\; |\tilde{w}| = 3n^{2} + |xz| \;\leq\; 3n^{2} + n \;<\; 3n^{2} + 6n + 3 = |w'|$$

Es decir, $|w| < |\tilde{w}| < |w'|$: la longitud de $\tilde{w}$ cae **estrictamente entre** las
de dos palabras consecutivas de $L$, de modo que ninguna palabra de $L$ puede tener esa
longitud. Absurdo. Por lo tanto $\tilde{w} \notin L$ y $L$ no es libre de contexto.

> **Nota.** Este ejemplo está transcripto de un parcial resuelto de la cursada (aparece también
> en las teóricas de apoyo del segundo parcial). El argumento se apoya en elegir
> $\alpha$ de longitud cuadrada ($n^{2}$), de manera que las longitudes de las palabras
> consideradas de $L$ crecen en saltos de orden $6n + 3$, más grandes que la ventana de bombeo
> $|xz| \leq n$; así la palabra bombeada queda en un "hueco" de longitudes. Se reproduce tal
> como figura en la resolución.

## Ver también

- [[01-lema-de-bombeo-lenguajes-regulares]] — versión del lema para lenguajes regulares y su esquema de prueba
- [[index]] — índice del vault de TLA
