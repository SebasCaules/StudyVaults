---
tags: [teoria, unidad-2, jerarquia-chomsky, gramaticas, forma-normal-chomsky]
fuente: Apuntes de la cursada 2025-2C (teóricas)
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Jerarquía de Chomsky

Chomsky clasifica las [[02-gramaticas-formales|gramáticas]] —y los lenguajes que generan— en
cuatro tipos anidados, según la **forma de sus producciones**. Cada tipo se corresponde con
una clase de máquina abstracta capaz de reconocer sus lenguajes. Cuanto más restringida es la
forma de las producciones, más simple es la máquina asociada.

## Clasificación de gramáticas

Sea $N$ el conjunto de no terminales y $\Sigma = T$ el de terminales. Los tipos se definen por
la forma admitida de las producciones $\alpha \to \beta$.

> **Tipo 0 — irrestrictas.** Producciones $\alpha \to \beta$ con
> $\alpha \in (N \cup \Sigma)^{+}$ y $\beta \in (N \cup \Sigma)^{*}$. Sin restricciones más
> allá de que el lado izquierdo no sea vacío.

> **Tipo 1 — sensibles al contexto.** Producciones $\alpha \to \beta$ con
> $|\alpha| \le |\beta|$ (salvo la excepción $S \to \lambda$). El lado derecho nunca es más
> corto que el izquierdo.

> **Tipo 2 — libres de contexto.** Producciones $A \to \beta$ con $A \in N$. El lado izquierdo
> es un único no terminal, que se reescribe sin importar el contexto que lo rodea.

> **Tipo 3 — regulares.** Producciones de una de estas formas, eligiendo una sola orientación
> para toda la gramática:
> - **lineal a derecha:** $A \to bC$, $A \to b$, $A \to \lambda$
> - **lineal a izquierda:** $A \to Cb$, $A \to b$, $A \to \lambda$
>
> con $A, C \in N$ y $b \in \Sigma$.

Los tipos están anidados: toda gramática de tipo 3 es de tipo 2, toda de tipo 2 (salvo por la
excepción de $\lambda$) encaja en tipo 1, y toda de tipo 1 es de tipo 0.

## Correspondencia lenguajes–máquinas

Cada tipo de lenguaje se reconoce con una clase de máquina abstracta. En la materia el tipo 2
se asocia al **análisis de sintaxis** y el tipo 3 al **análisis léxico** de un compilador.

| Tipo | Gramática | Máquina abstracta que lo reconoce | Rol en compilación |
|---|---|---|---|
| 0 | irrestricta | Máquina de Turing | — |
| 1 | sensible al contexto | Autómata linealmente acotado | — |
| 2 | libre de contexto | Autómata con pila | análisis de sintaxis |
| 3 | regular | Autómata finito | análisis léxico |

**Observación.** Por fuera de la jerarquía quedan los **lenguajes no enumerables**, que
ninguna gramática genera y ninguna Máquina de Turing reconoce.

## Forma Normal de Chomsky

Una gramática libre de contexto (tipo 2) puede llevarse a una **Forma Normal de Chomsky
(FNC)**: una forma canónica equivalente que facilita razonar y aplicar algoritmos sobre ella.

> **Criterio (según los apuntes).** Una gramática está en Forma Normal de Chomsky cuando:
> - no tiene **símbolos inútiles**,
> - está **factorizada**, y
> - no tiene **producciones $\lambda$**.

El procedimiento parte de la gramática original y va reescribiendo las producciones —por
ejemplo, sacando los no terminales que aparecen a la izquierda del lado derecho— hasta que
todas cumplen la forma requerida.

> **Nota.** En los apuntes de la cursada se trabaja un ejemplo completo de pasaje a FNC, pero
> el detalle de las producciones intermedias es de lectura dudosa en el original, por lo que
> acá se transcribe solo el criterio y la idea del procedimiento, no las producciones puntuales
> del ejemplo.

---

## Ver también

- [[02-gramaticas-formales]] — definición de gramática, producciones y derivaciones que se clasifican acá
- [[01-recursividad-e-induccion]] — esquema recursivo/inductivo base de cadenas y lenguajes
