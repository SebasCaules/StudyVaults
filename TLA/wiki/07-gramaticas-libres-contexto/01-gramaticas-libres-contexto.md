---
tags: [teoria, unidad-7, gramaticas-libres-contexto, tipo-2, derivaciones]
fuentes:
  - Apuntes de la cursada 2025-2C (teóricas)
  - Parcial resuelto de la cursada 2025-2C
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Gramáticas libres de contexto

Las **gramáticas libres de contexto** (GLC) son las gramáticas de **tipo 2** de la
[[03-jerarquia-de-chomsky|jerarquía de Chomsky]]. Son las que se usan para el **análisis de
sintaxis** de un compilador y las que reconoce un [[03-configuraciones-lenguaje-aceptado|autómata
con pila]]. Esta página fija qué hace *libre de contexto* a una gramática y muestra cómo se
deriva y cómo se diseña una, sobre los ejemplos trabajados en la cursada.

## Qué es una gramática libre de contexto

Toda gramática es una tupla $G = \langle N, T, S, P \rangle$ (ver
[[02-gramaticas-formales|gramáticas formales]]). Lo que distingue a las de tipo 2 es la
**forma de sus producciones**.

> **Definición (tipo 2 / libre de contexto).** Una gramática es **libre de contexto** cuando
> todas sus producciones tienen la forma
> $$A \to \beta, \qquad A \in N,$$
> es decir, el lado izquierdo es **un único símbolo no terminal**. El lado derecho $\beta$ es
> cualquier cadena de terminales y/o no terminales.

El nombre *libre de contexto* viene de esa restricción: como a la izquierda hay un solo no
terminal $A$, la regla puede aplicarse a $A$ **sin importar qué símbolos lo rodean** (el
contexto). Esto la separa de las gramáticas sensibles al contexto (tipo 1), donde el reemplazo
sí puede depender de los vecinos.

**Observación.** Los tipos de la jerarquía están anidados: toda gramática regular (tipo 3) es
libre de contexto, y toda libre de contexto es sensible al contexto (salvo la excepción de la
producción $S \to \lambda$). Un lenguaje es **libre de contexto** si existe alguna GLC que lo
genere.

## Derivación y forma sentencial

Una GLC genera cadenas por **derivación**: se parte de $S$ y se reemplaza, paso a paso, un no
terminal por el lado derecho de alguna de sus producciones.

- Un **paso de derivación** se nota $\Rightarrow$.
- Su clausura reflexo-transitiva $\Rightarrow^{*}$ representa **cero o más pasos**.
- Cada cadena intermedia (con terminales y/o no terminales) es una **forma sentencial**.

El **lenguaje generado** es el conjunto de cadenas de terminales alcanzables desde $S$:

$$L(G) = \{\, w \in \Sigma^{*} \mid S \Rightarrow^{*} w \,\}$$

donde $\Sigma = T$ es el alfabeto de terminales. Una cadena pertenece a $L(G)$ si y solo si
existe una derivación que la produzca desde $S$ y termine en una forma sentencial **sin no
terminales**.

## Ejemplo: derivar en una GLC

Sea la gramática libre de contexto

$$G = \langle \{S, A, B\},\ \{a, b\},\ S,\ P \rangle$$

con producciones

$$S \to aAb \mid bB \qquad A \to aAb \mid \lambda \qquad B \to bB \mid b$$

Todas las producciones tienen un solo no terminal a la izquierda, así que $G$ es de tipo 2.
Partiendo de $S$ se deriva la palabra $aaabbb$:

$$S \Rightarrow aAb \Rightarrow aaAbb \Rightarrow aaaAbbb \Rightarrow aaabbb$$

En el primer paso se aplica $S \to aAb$; luego $A \to aAb$ dos veces, anidando un nuevo par
$a \dots b$ alrededor de $A$; y finalmente $A \to \lambda$, que borra el no terminal restante.
Como $S \Rightarrow^{*} aaabbb$ y la cadena resultante es de terminales, $aaabbb \in L(G)$.

## Diseñar una GLC (ejemplo de parcial)

El problema inverso —dado un lenguaje, escribir una GLC que lo genere exactamente— es un
ejercicio típico. En un parcial resuelto de la cursada se pide una gramática para

$$L = \{\, c^{n}\alpha \mid n \ge 1,\ |\alpha| \ge 1,\ \#_a(\alpha) \ge \#_b(\alpha),\ \#_c(\alpha) = 0 \,\}$$

es decir: un bloque de al menos una $c$, seguido de una cadena $\alpha$ no vacía **sin $c$'s**,
en la que hay **al menos tantas $a$'s como $b$'s**. Aquí $\#_a(\alpha)$, $\#_b(\alpha)$ y
$\#_c(\alpha)$ cuentan las apariciones de cada símbolo en $\alpha$. La gramática propuesta es

$$
\begin{aligned}
S &\to cA \mid cB \\
A &\to cA \mid aB \mid a \\
B &\to aDb \mid bDa \mid b \mid aD \mid bD \\
D &\to aDb \mid bDa \mid a \mid ab \mid ba
\end{aligned}
$$

Todas las producciones son de la forma $X \to \beta$ con un único no terminal a la izquierda,
así que la gramática es libre de contexto. Las variables $A$ generan el prefijo de $c$'s (con
$A \to cA$ para alargarlo) y las variables $B$/$D$ construyen $\alpha$ manteniendo la relación
entre las cantidades de $a$'s y $b$'s.

---

## Ver también

- [[02-gramaticas-formales]] — definición general de gramática, producciones, derivaciones y $L(G)$
- [[03-jerarquia-de-chomsky]] — dónde caen las GLC (tipo 2) dentro de la clasificación
- [[02-forma-normal-chomsky]] — llevar una GLC a una forma canónica equivalente
- [[03-configuraciones-lenguaje-aceptado]] — el autómata con pila, máquina que reconoce lenguajes libres de contexto
