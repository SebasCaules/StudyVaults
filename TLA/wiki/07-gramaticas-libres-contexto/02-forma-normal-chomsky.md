---
tags: [teoria, unidad-7, forma-normal-chomsky, gramaticas-libres-contexto, formas-normales]
fuente: Apuntes de la cursada 2025-2C (teóricas)
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Forma Normal de Chomsky

Una [[01-gramaticas-libres-contexto|gramática libre de contexto]] puede llevarse a una **Forma
Normal de Chomsky (FNC)**: una forma canónica **equivalente** (genera el mismo lenguaje) pero
con las producciones restringidas a un patrón fijo, lo que facilita razonar y aplicar
algoritmos sobre la gramática. Esta página transcribe el criterio y el ejemplo de pasaje a FNC
tal como aparecen en los apuntes de la cursada.

## Criterio

> **Criterio (según los apuntes).** Una gramática está en Forma Normal de Chomsky cuando:
> - no tiene **símbolos inútiles**,
> - está **factorizada**, y
> - no tiene **producciones $\lambda$**.

> **Nota.** Este es el criterio tal como se enuncia en los apuntes de la cursada. No coincide
> literalmente con la Forma Normal de Chomsky de los textos clásicos (que exige producciones de
> la forma $A \to BC$ o $A \to a$); acá se transcribe la versión de la materia.

El procedimiento parte de la gramática original y va reescribiendo sus producciones —en
particular, **sacando los no terminales que aparecen a la izquierda** del lado derecho— hasta
que todas cumplen la forma requerida.

## Ejemplo de pasaje a FNC

Se parte de la gramática

$$
\begin{aligned}
S &\to AB \\
A &\to CA \\
B &\to aBb \mid aaBb \mid ab \mid aab \mid a \mid aB
\end{aligned}
$$

Primero se verifica que la gramática **no tiene símbolos inútiles**, que está **factorizada**
y que **no hay producciones $\lambda$**. Luego se **sacan los símbolos no terminales de la
izquierda** de los lados derechos, reescribiendo las producciones. El paso intermedio que se
registra es

$$
\begin{aligned}
S &\to AB \\
A &\to CA \\
B &\to aBb \mid aaBb \mid ab \mid aab \mid a
\end{aligned}
$$

y el resultado final que "cumple con la forma normal" es

$$
\begin{aligned}
S &\to CAB \\
A &\to CA \\
B &\to aBb \mid aaBb \mid ab \mid aab \mid a \mid aB
\end{aligned}
$$

> **Nota.** El detalle de las producciones intermedias es de **lectura dudosa en el original** y
> el propio ejemplo manuscrito es internamente irregular: entre el paso intermedio y el final,
> el lado derecho de $S$ pasa de $AB$ a $CAB$ (aparentemente sustituyendo el $A$ inicial por
> $A \to CA$) y la alternativa $aB$ de $B$ desaparece y reaparece *(dudoso en el original)*. Se
> transcriben las tres etapas tal como figuran en los apuntes, sin "corregir" el ejemplo, porque
> reescribirlo sería introducir teoría que no está en la fuente. La idea a retener es el
> **procedimiento**: verificar el criterio (sin inútiles, factorizada, sin $\lambda$) y **sacar
> los no terminales de la izquierda** de las producciones.

---

## Ver también

- [[01-gramaticas-libres-contexto]] — qué es una GLC y cómo se deriva
- [[03-jerarquia-de-chomsky]] — las GLC como gramáticas de tipo 2
- [[02-gramaticas-formales]] — producciones, alternativa $\mid$ y símbolos no terminales
