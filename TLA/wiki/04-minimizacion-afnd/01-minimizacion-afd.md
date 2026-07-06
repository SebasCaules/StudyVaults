---
tags: [teoria, unidad-4, minimizacion, afd, clases-de-equivalencia]
fuentes:
  - raw/teoricas/tla-teorica.pdf
  - raw/practicas/tla-practica.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Minimización de AFD

Dos autómatas distintos pueden reconocer el mismo lenguaje. Entre todos los AFD que aceptan
un lenguaje regular $L$ hay **uno solo** con la menor cantidad de estados (salvo renombre): el
**AFD mínimo**. Esta página fija la noción de equivalencia de autómatas y el procedimiento en
dos pasos para minimizar un AFD: eliminar los estados inaccesibles y fusionar los estados
equivalentes por clases de equivalencia $Q/E_0, Q/E_1, \dots$

## Equivalencia de autómatas

> **Definición.** Dos AFD $M$ y $M'$ son **equivalentes**, $M \equiv M'$, si reconocen el mismo
> lenguaje:
> $$M \equiv M' \iff L(M) = L(M')$$

Es decir, dos autómatas son equivalentes cuando aceptan exactamente las mismas palabras. Si
existe una sola palabra que uno reconoce y el otro no, **no** son equivalentes.

> **Observación.** La minimización de dos autómatas equivalentes da el **mismo** resultado: el
> AFD mínimo de un lenguaje regular es único (salvo renombre de estados).

## El procedimiento en dos pasos

Para minimizar un AFD $M$ se aplican, en orden, dos operaciones:

1. **Eliminar los estados inaccesibles** desde $q_0$ (los que ninguna palabra puede alcanzar).
2. **Construir el conjunto de clases de equivalencia de estados** y quedarse con un estado por
   clase (fusionar los estados indistinguibles).

Los estados eliminados en el paso 1 no cambian el lenguaje —nunca se los visita— y el paso 2
colapsa los estados que se comportan igual frente a toda continuación de la entrada.

## Estados accesibles

> **Definición.** Un estado $q_i \in Q$ es **accesible** si existe alguna palabra que lo
> alcanza desde el estado inicial:
> $$\exists\, \alpha \in \Sigma^* \ :\ \hat\delta(q_0, \alpha) = q_i$$
> equivalentemente, en términos de configuraciones (ver [[03-automatas-finitos/03-configuraciones-lenguaje-aceptado|configuraciones]]),
> $$\exists\, \alpha \in \Sigma^* \ :\ [q_0, \alpha] \vdash^{*} [q_i, \lambda]$$

Un estado **inaccesible** es el que ninguna palabra alcanza: puede borrarse sin alterar $L(M)$.

### Construcción del conjunto de accesibles

El conjunto $Q'$ de estados accesibles se construye por inducción a partir de $q_0$, agregando
en cada paso los destinos de los estados ya alcanzados.

> **Base.** $Q' = \{q_0\}$ es accesible, porque $\hat\delta(q_0, \lambda) = q_0 \in Q$.
>
> **Paso inductivo.** Si $S \subseteq Q$ es un conjunto de estados accesibles, entonces para
> todo $a \in \Sigma$ y todo $q_i \in S$, el conjunto
> $$S' = \{\, q_j \in Q \ :\ \delta(q_i, a) = q_j \,\}$$
> también es de estados accesibles. Se agregan esos $q_j$ a $Q'$.

El proceso se repite hasta que no aparezcan estados nuevos. Los estados de $Q \setminus Q'$ son
inaccesibles y se descartan.

## Clases de equivalencia de estados

El segundo paso agrupa los estados en **clases de equivalencia** y refina esas clases hasta que
se estabilizan. Se nota $Q/E_i$ a la partición de $Q$ en la etapa $i$.

La partición inicial separa finales de no finales, y cada refinamiento distingue estados que,
leyendo un símbolo, caen en clases distintas de la etapa anterior:

- **$Q/E_0$** — dos estados quedan en la misma clase si **ambos son finales** o **ambos son no
  finales**. Es decir, $Q/E_0 = \{\, F,\ Q \setminus F \,\}$.
- **$Q/E_{i+1}$** — dos estados $p, q$ siguen en la misma clase si ya estaban juntos en $Q/E_i$
  **y**, para **cada** símbolo $a \in \Sigma$, los destinos $\delta(p, a)$ y $\delta(q, a)$
  caen en la **misma** clase de $Q/E_i$.
- **Corte.** Se repite hasta que $Q/E_{i+1} = Q/E_i$: la partición dejó de refinarse. El AFD
  mínimo tiene **un estado por clase** de esa partición final.

> **Nota.** Los apuntes de la cursada 2025-2C no enuncian la recurrencia con símbolos; la
> presentan aplicándola en los ejemplos (tablas $Q/E_0$, $Q/E_1$, …). La regla de arriba es la
> que reproduce esas tablas paso a paso.

## Ejemplo completo

Un ejercicio de parcial resuelto de la cursada pide el AFD mínimo del lenguaje

$$L = \{\, w \in \{a, b\}^{*} \ :\ w \text{ no contiene } aaa \ \text{y}\ w \text{ no contiene } bbb \,\}$$

Se parte del AFD con estados $I, A_1, A_2, B_1, B_2, t$, donde $A_k$ cuenta $k$ letras $a$
consecutivas, $B_k$ cuenta $k$ letras $b$ consecutivas y $t$ es el estado trampa (se llega al
tercer símbolo repetido). Todos son finales salvo $t$. Su tabla de transición es:

| $\delta_M$ | $a$ | $b$ |
|---|---|---|
| $I$ | $A_1$ | $B_1$ |
| $A_1$ | $A_2$ | $B_1$ |
| $A_2$ | $t$ | $B_1$ |
| $B_1$ | $A_1$ | $B_2$ |
| $B_2$ | $A_1$ | $t$ |
| $t$ | $t$ | $t$ |

Todos los estados son accesibles, así que se pasa directo a las clases de equivalencia:

$$Q/E_0 = \{\, \underbrace{\{I, A_1, A_2, B_1, B_2\}}_{\text{finales}}\, ;\ \underbrace{\{t\}}_{\text{no finales}} \,\}$$

Refinando $Q/E_0$: $A_2$ manda $a \to t$ (clase $\{t\}$) mientras $I, A_1, B_1$ mandan sus dos
símbolos dentro de la clase de finales; y $B_2$ manda $b \to t$. Se separan $A_2$ y $B_2$:

$$Q/E_1 = \{\, \{I, A_1, B_1\}\, ;\ \{A_2\}\, ;\ \{B_2\}\, ;\ \{t\} \,\}$$

Refinando otra vez el bloque $\{I, A_1, B_1\}$: $A_1$ manda $a$ a la clase $\{A_2\}$, $B_1$
manda $b$ a la clase $\{B_2\}$ e $I$ manda ambos dentro del bloque grande. Los tres se separan:

$$Q/E_2 = \{\, \{I\}\, ;\ \{A_1\}\, ;\ \{B_1\}\, ;\ \{A_2\}\, ;\ \{B_2\}\, ;\ \{t\} \,\}$$

En la etapa siguiente ya no se fusiona nada: $Q/E_3 = Q/E_2$. La partición se estabilizó con
seis clases —una por estado original—, de modo que **el AFD de partida ya era mínimo** y queda
igual:

$$M = \langle \{a, b\},\ \{I, A_1, A_2, B_1, B_2, t\},\ \delta_M,\ I,\ \{I, A_1, A_2, B_1, B_2\} \rangle$$

Cuando dos o más estados hubieran caído en la misma clase final, se los fusionaría en un único
estado del autómata mínimo, con las transiciones heredadas de cualquier representante.

## Ver también

- [[03-automatas-finitos/01-automatas-finitos]] — definición del autómata finito y la tabla de transición
- [[03-automatas-finitos/03-configuraciones-lenguaje-aceptado|configuraciones y lenguaje aceptado]] — la relación $\vdash^{*}$ usada para definir accesibilidad
- [[02-afnd-y-subconjuntos]] — no determinismo y la conversión AFND $\to$ AFD por subconjuntos
- [[index]] — índice del vault de TLA
