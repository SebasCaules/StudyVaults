---
tags: [teoria, unidad-2, recursividad, induccion, cadenas]
fuente: Apuntes de la cursada 2025-2C (teóricas)
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Recursividad e inducción

Buena parte de los objetos de la materia —cadenas, lenguajes, autómatas— se definen de
forma **recursiva** y se razonan por **inducción**. Esta página fija ese esquema y lo aplica
a la definición recursiva de cadena, al reverso y a la inducción estructural, que reaparecen
al construir [[02-gramaticas-formales|gramáticas]] y al probar propiedades sobre ellas.

## Recursividad e inducción

La recursividad y la inducción son dos caras del mismo mecanismo: definir o probar algo
apoyándose en casos ya resueltos.

> **Idea.** Recursividad $\iff$ inducción $\iff$ series sobre $\mathbb{N}$. Toda definición o
> demostración recursiva tiene dos partes:
> - **Caso base:** el punto de partida, que no depende de casos anteriores.
> - **Construcción inductiva / recursiva:** se construye (o se prueba) el caso general
>   apoyándose en casos anteriores ya establecidos.

## Definición recursiva de cadena

Una **cadena** es una secuencia finita de símbolos de un alfabeto. La forma canónica de
definirla es recursiva, sobre la operación de anteponer un símbolo.

> **Definición (cadena).** Sea $\Sigma$ un alfabeto.
> - $\lambda$ (la cadena vacía) es una cadena.
> - Si $a \in \Sigma$ es un símbolo y $w$ es una cadena, entonces $a \cdot w$ es una cadena.

El caso base es $\lambda$; el paso recursivo antepone un símbolo a una cadena ya construida.
Toda cadena se obtiene aplicando el paso un número finito de veces desde $\lambda$.

## Reverso

El **reverso** de una cadena invierte el orden de sus símbolos. Se define recursivamente
siguiendo la misma estructura que la cadena.

> **Definición (reverso).** Para una cadena sobre $\Sigma$:
> - $\lambda^r = \lambda$
> - $(a\,w)^r = (w)^r\, a \qquad$ con $a \in \Sigma$ y $w$ una cadena.

Aplicando la definición paso a paso sobre la cadena $ab$:

$$(ab)^r = (b)^r\, a = \lambda^r\, b\, a = \lambda\, b\, a = ba$$

Primero se separa el símbolo de cabeza $a$ y se reversa la cola $b$; luego se reversa $b$
separando su cabeza y dejando la cola $\lambda$; finalmente $\lambda^r = \lambda$ se
absorbe como neutro de la concatenación.

## Inducción estructural

Para probar que una propiedad vale sobre **todos** los objetos de un conjunto definido
recursivamente (cadenas, formas sentenciales, etc.) se usa **inducción estructural**: se
sigue la misma estructura con la que se definió el conjunto.

> **Método (inducción estructural).** Para demostrar que la propiedad $P(x)$ es verdadera
> para todo objeto $x$ del conjunto:
> - **Caso base:** demostrar que $P(x)$ vale para el/los caso(s) base.
> - **Paso inductivo:** para cada objeto $y = F(x_1, x_2, \dots, x_k)$ construido a partir de
>   $x_1, \dots, x_k$, demostrar que $P(y)$ vale **asumiendo** $P(x_1), P(x_2), \dots, P(x_k)$
>   (hipótesis inductiva).

Como el conjunto se genera aplicando las reglas de construcción un número finito de veces
desde los casos base, probar el base y el paso alcanza para cubrir todos los objetos.

---

## Ver también

- [[02-gramaticas-formales]] — las gramáticas y sus derivaciones se definen sobre este mismo esquema recursivo
- [[03-jerarquia-de-chomsky]] — la clasificación de Chomsky mira la forma de las producciones
