---
tags: [teoria, unidad-5, expresiones-regulares, lenguajes-regulares, arden]
fuentes:
  - raw/practicas/tla-practica.pdf
  - raw/parciales/parcial-1-resuelto.pdf
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Expresiones regulares

Las **expresiones regulares** (ER) son una notación algebraica para describir lenguajes. Cada
ER denota un lenguaje sobre un alfabeto $\Sigma$ y se construye combinando símbolos con tres
operaciones: **unión**, **concatenación** y **clausura de Kleene**. En la cursada aparecen
sobre todo del lado de la **equivalencia con los autómatas finitos**: dado un autómata, se
busca la ER que describe exactamente el lenguaje que reconoce.

## Qué es una expresión regular

Una ER se arma a partir de los átomos del alfabeto y de la cadena vacía $\lambda$, aplicando las
tres operaciones. La expresión se escribe de forma compacta —la concatenación por yuxtaposición,
la clausura con `*` de superíndice y la unión con `+`— y cada operación tiene una lectura como
lenguaje:

| Operación | Notación | Lenguaje denotado |
|---|---|---|
| Símbolo | $a$ | $\{a\}$ |
| Cadena vacía | $\lambda$ | $\{\lambda\}$ |
| Unión (alternativa) | $R + S$ | $L(R) \cup L(S)$ |
| Concatenación | $R\,S$ | $L(R)\,L(S)$ |
| Clausura de Kleene | $R^{*}$ | $\big(L(R)\big)^{*}$ |

donde $R$ y $S$ son a su vez expresiones regulares y $L(R)$ es el lenguaje que denota $R$. El
lenguaje vacío se nota $\emptyset$; aparece de forma natural como destino "trampa" al pasar un
autómata a ER (una transición hacia $\emptyset$ no aporta cadenas).

> **Ejemplo.** La ER $bb^{*}a^{*}$ denota las cadenas que empiezan con al menos una $b$
> (una $b$ seguida de cero o más $b$), continuadas por cero o más $a$. La ER $b^{*}(ab^{*}b + \lambda)$
> admite además la cadena vacía como alternativa.

## Equivalencia con autómatas finitos

Expresiones regulares y autómatas finitos describen **la misma clase de lenguajes**: los
lenguajes regulares. Un lenguaje es regular exactamente cuando puede describirse con una ER, y
eso ocurre exactamente cuando existe un autómata finito que lo acepta.

En la práctica de la cursada esta equivalencia se recorre en un sentido concreto y verificable:
partiendo de un autómata finito $M$, se construye una ER que denota **el mismo** lenguaje que
$M$ reconoce, y se comprueba que ambas descripciones coinciden. El planteo típico es:

> **Objetivo.** Mostrar que una expresión regular dada define el lenguaje del autómata $M$ (o,
> equivalentemente, que la ER es equivalente a $L(M)$).

La herramienta para obtener esa ER a partir del autómata es el **método de Arden**, desarrollado
en [[02-de-automata-a-expresion-regular-arden]]. Como la construcción arranca de la tabla de
transición del autómata, primero conviene tener presentes las nociones de
[[03-automatas-finitos/03-configuraciones-lenguaje-aceptado|lenguaje aceptado]] y de
[[02-gramaticas/03-jerarquia-de-chomsky|lenguaje regular]] (tipo 3 de Chomsky).

## Álgebra de expresiones regulares

Para simplificar las expresiones que surgen del método de Arden se usan identidades del álgebra
de ER. La pieza central es la **regla de Arden**, que resuelve las ecuaciones con la incógnita
en ambos lados.

> **Proposición (regla de Arden).** Sean $A$ y $B$ expresiones regulares con $\lambda \notin L(A)$.
> La ecuación
> $$X = A\,X + B$$
> tiene como solución
> $$X = A^{*}B$$

La lectura es directa: si una cadena de $X$ es un prefijo de $A$ seguido de otra cadena de $X$,
o bien una cadena de $B$, entonces $X$ son cero o más repeticiones de $A$ seguidas de una cadena
de $B$.

Junto con Arden se aplican estas identidades para llevar el resultado a su forma más simple:

i) **Neutro de la concatenación:** $\lambda$ es neutro, $R\,\lambda = \lambda\,R = R$.
ii) **Absorción de la clausura:** $R\,R^{*} + \lambda = R^{*}$, y también $\lambda + R\,R^{*} = R^{*}$.
iii) **Conmutación con la clausura:** $R\,(S\,R)^{*} = (R\,S)^{*}\,R$.

> **Nota.** Los apuntes de la cursada 2025-2C invocan estas identidades por número
> (*Prop. 2*, *Prop. 4*, *Prop. 7*, …) al justificar cada paso de simplificación. El listado
> numerado completo de propiedades **no** figura transcripto en el material disponible; acá se
> recogen las identidades que efectivamente se usan en las resoluciones.

## Ver también

- [[02-de-automata-a-expresion-regular-arden]] — método de Arden paso a paso, con ejemplos completos
- [[03-automatas-finitos/03-configuraciones-lenguaje-aceptado]] — lenguaje aceptado por un autómata finito
- [[02-gramaticas/03-jerarquia-de-chomsky]] — lenguajes regulares (tipo 3) en la jerarquía de Chomsky
- [[index]] — índice del vault de TLA
