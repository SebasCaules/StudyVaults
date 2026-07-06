---
tags: [teoria, unidad-2, gramaticas, producciones, derivaciones]
fuentes:
  - Apuntes de la cursada 2025-2C (teóricas)
  - Parcial resuelto de la cursada 2025-2C
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Gramáticas formales

Una **gramática** es un dispositivo finito que **define** (genera) un lenguaje: a partir de
un símbolo inicial, un conjunto de reglas de reescritura produce todas las cadenas del
lenguaje. Esta página cubre la definición de gramática, sus producciones, el mecanismo de
derivación y el lenguaje generado.

## Definición

> **Definición (gramática).** Una gramática es una tupla
> $$G = \langle N, T, S, P \rangle$$
> donde $N$ es el conjunto de **símbolos no terminales** o variables (en los apuntes también
> notado $V$ o $N$), $T$ es el conjunto de **símbolos terminales**, $S \in N$ es el **símbolo
> inicial** (distinguido) y $P$ es el conjunto de **producciones** (reglas de reescritura).

Los terminales son los símbolos que aparecen en las cadenas finales; los no terminales son
símbolos auxiliares que se van reemplazando hasta desaparecer. El símbolo inicial $S$ es el
punto de partida de toda derivación.

## Producciones

Una **producción** es una regla $\alpha \to \beta$ que autoriza a reemplazar la subcadena
$\alpha$ por $\beta$. Varias producciones con el mismo lado izquierdo se abrevian con la
barra $\mid$ de alternativa. Por ejemplo, la gramática

$$G = \langle \{S, A, B\},\ \{a, b\},\ S,\ P \rangle$$

tiene el conjunto de producciones $P$:

$$S \to aAb \mid bB \qquad A \to aAb \mid \lambda \qquad B \to bB \mid b$$

que es una forma compacta de escribir las seis producciones
$S \to aAb$, $S \to bB$, $A \to aAb$, $A \to \lambda$, $B \to bB$, $B \to b$.

## Derivaciones

Una **derivación** aplica producciones para transformar el símbolo inicial en una cadena.

> **Definición (paso de derivación).** Reemplazar el lado izquierdo de una producción por su
> lado derecho dentro de una cadena es un **paso de derivación**, notado $\Rightarrow$. Su
> clausura reflexo-transitiva $\Rightarrow^{*}$ representa cero o más pasos.

Cada cadena intermedia de una derivación (con terminales y/o no terminales) es una **forma
sentencial**. Partiendo de $S$ en la gramática de arriba, se deriva la palabra $aaabbb$:

$$S \Rightarrow aAb \Rightarrow aaAbb \Rightarrow aaaAbbb \Rightarrow aaabbb$$

donde en cada paso se aplica, respectivamente, $S \to aAb$, luego $A \to aAb$ dos veces
(anidando un nuevo $a\dots b$ alrededor de $A$) y finalmente $A \to \lambda$, que borra el
no terminal restante. Como $S \Rightarrow^{*} aaabbb$ y la cadena resultante es de terminales,
$aaabbb$ es una palabra generada por $G$.

## Lenguaje generado

> **Definición.** El **lenguaje generado** por una gramática $G$ es el conjunto de cadenas de
> terminales derivables desde el símbolo inicial:
> $$L(G) = \{\, w \in \Sigma^{*} \mid S \Rightarrow^{*} w \,\}$$
> donde $\Sigma = T$ es el alfabeto de terminales.

Es decir, una cadena pertenece a $L(G)$ si y solo si existe alguna derivación que la produzca
desde $S$ usando las producciones de $P$, terminando en una forma sentencial sin no terminales.

## Construcción de una gramática (ejemplo)

Diseñar una gramática es el problema inverso: dado un lenguaje, escribir producciones que lo
generen exactamente. En un parcial resuelto de la cursada se pide una gramática para

$$L = \{\, c^{n}\alpha \mid n \ge 1,\ |\alpha| \ge 1,\ \#_a(\alpha) \ge \#_b(\alpha),\ \#_c(\alpha) = 0 \,\}$$

es decir: un bloque de $c$'s (al menos una) seguido de una cadena $\alpha$ no vacía sin $c$'s
en la que hay al menos tantas $a$'s como $b$'s. La gramática propuesta es

$$
\begin{aligned}
S &\to cA \mid cB \\
A &\to cA \mid aB \mid a \\
B &\to aDb \mid bDa \mid b \mid aD \mid bD \\
D &\to aDb \mid bDa \mid a \mid ab \mid ba
\end{aligned}
$$

donde $\#_a(\alpha)$ y $\#_b(\alpha)$ cuentan las apariciones de $a$ y de $b$ en $\alpha$, y
$\#_c(\alpha)$ las de $c$. Las variables $A$ generan el prefijo de $c$'s y las variables
$B$/$D$ arman $\alpha$ manteniendo la relación entre las cantidades de $a$'s y $b$'s.

---

## Ver también

- [[01-recursividad-e-induccion]] — cadenas, reverso e inducción estructural sobre las que se apoyan las derivaciones
- [[03-jerarquia-de-chomsky]] — clasificación de las gramáticas según la forma de sus producciones
