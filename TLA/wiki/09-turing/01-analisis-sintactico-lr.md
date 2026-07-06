---
tags: [teoria, unidad-5, analisis-sintactico, parsing-lr, items]
fuente: Apuntes de la cursada 2025-2C (parcial resuelto)
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Análisis sintáctico ascendente: ítems LR

El **análisis sintáctico** es la etapa del compilador que decide si una cadena pertenece al
lenguaje generado por una gramática libre de contexto y, en caso afirmativo, reconstruye su
estructura. En la [[03-jerarquia-de-chomsky|jerarquía de Chomsky]] corresponde al **tipo 2**
(lenguajes libres de contexto), reconocido por un autómata con pila. Esta página desarrolla el enfoque **ascendente LR**, que trabaja con **ítems**, tal como
aparece resuelto en los apuntes de la cursada.

## Idea del análisis LR

Un analizador LR lee la entrada de izquierda a derecha y va **reconociendo producciones desde
sus hojas hacia la raíz** (análisis ascendente): acumula símbolos hasta que reconoce el lado
derecho completo de una producción y entonces lo **reduce** al no terminal correspondiente. Para
saber en qué punto de cada producción está parado, usa **ítems**.

> **Definición.** Un **ítem** es una producción de la gramática con un **punto** ($\bullet$)
> intercalado, que marca hasta dónde se reconoció ya el lado derecho. Por ejemplo, el ítem
> $B \to a \bullet D c$ indica que, para la producción $B \to aDc$, ya se leyó $a$ y falta
> reconocer $Dc$.

El punto al final del lado derecho (por ejemplo $B \to aDc \bullet$) señala que la producción
está **completa** y lista para reducirse.

## Gramática aumentada

Antes de generar los ítems se **aumenta** la gramática con un nuevo símbolo inicial $I'$ y una
producción $I' \to I$ hacia el símbolo inicial original. Esto le da al análisis un único punto
de aceptación: reconocer $I' \to I \bullet$ equivale a haber analizado toda la entrada.

En el ejercicio resuelto la gramática es
$$G = \langle \{I, B, D\},\ \{a, v, c, s\},\ I,\ P \rangle$$
con producciones

$$
\begin{aligned}
I &\to DB \\
B &\to aDc \mid s \\
D &\to vD \mid v
\end{aligned}
$$

donde $I, B, D$ son no terminales, $I$ es el símbolo inicial y $a, v, c, s$ son terminales. Al
aumentarla se antepone $I' \to I$:

$$
\begin{aligned}
I' &\to I \\
I &\to DB \\
B &\to aDc \mid s \\
D &\to vD \mid v
\end{aligned}
$$

## Ítems de la gramática

Para cada producción se generan todos los ítems posibles, corriendo el punto desde el comienzo
del lado derecho hasta el final. La resolución los agrupa por no terminal:

**Producción $I' \to I$.**

- $I' \to \bullet\, I$
- $I' \to I\, \bullet$

**Producciones de $I$.**

- $I \to \bullet\, DB$
- $I \to D \bullet B$
- $I \to DB \bullet$

**Producciones de $B$.**

- $B \to \bullet\, aDc$
- $B \to a \bullet Dc$
- $B \to aD \bullet c$
- $B \to aDc \bullet$
- $B \to \bullet\, s$
- $B \to s \bullet$

**Producciones de $D$.**

- $D \to \bullet\, vD$
- $D \to v \bullet D$
- $D \to vD \bullet$
- $D \to \bullet\, v$
- $D \to v \bullet$

Cada producción de longitud $k$ (en símbolos del lado derecho) da lugar a $k+1$ ítems: un punto
por cada posición, más el ítem completo con el punto al final.

> **Nota.** En el apunte de la cursada los ítems se enumeran por producción, como paso previo a
> armar la colección de conjuntos de ítems del analizador. Las producciones de un solo símbolo
> ($B \to s$, $D \to v$) tienen únicamente dos ítems: el de inicio ($\bullet\, s$, $\bullet\, v$)
> y el de reducción ($s\, \bullet$, $v\, \bullet$).

## Del ítem a la reducción

La lógica del análisis ascendente se lee sobre estos ítems:

- un ítem con el punto **antes** de un no terminal (por ejemplo $I \to \bullet\, DB$) obliga a
  reconocer primero ese no terminal, incorporando además todos los ítems iniciales de sus
  producciones;
- al avanzar sobre la entrada el punto **se corre** hacia la derecha;
- un ítem con el punto **al final** (por ejemplo $I \to DB \bullet$) habilita una **reducción**:
  se reemplaza el lado derecho ya reconocido por el no terminal de la izquierda;
- reconocer $I' \to I \bullet$ significa haber reducido toda la entrada al símbolo inicial: la
  cadena **pertenece** al lenguaje.

---

## Ver también

- [[03-jerarquia-de-chomsky]] — el análisis de sintaxis reconoce lenguajes tipo 2 (libres de contexto)
- [[02-gramaticas-formales]] — gramáticas, producciones y derivaciones sobre las que trabaja el parser
- [[02-maquinas-de-turing]] — modelo de cómputo general, en lo alto de la jerarquía
