---
tags: [teoria, unidad-6, sistemas-lineales, forma-escalonada, rango]
fuente: raw/3-resumenes/algebra.pdf
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Sistemas lineales, forma escalonada y rango

Segunda parte de la unidad de matrices: un **sistema lineal** se escribe en forma matricial y se
resuelve llevando su matriz ampliada a la **forma escalonada** por operaciones elementales de
fila. El número de "unos principales" que aparecen define el **rango**, la magnitud que gobierna
la clasificación de sistemas ([[03-rouche-frobenius-inversibles]]). Las operaciones matriciales de
base están en [[01-matrices-operaciones]]. Transcripción de los apuntes de la cursada 2023-1C.

## Sistemas lineales

Un sistema de $k$ ecuaciones lineales con $n$ incógnitas $x_1, \dots, x_n$ tiene la forma

$$\begin{cases} a_{11} x_1 + \cdots + a_{1n} x_n = b_1 \\ \phantom{a_{11} x_1 + \cdots + a_{1n} x_n} \vdots \\ a_{k1} x_1 + \cdots + a_{kn} x_n = b_k \end{cases}$$

donde los coeficientes $a_{ij}$ y los términos independientes $b_i$ están en $\mathbb{K}$, con
$1 \leq i \leq k$ y $1 \leq j \leq n$.

Esto es equivalente a escribir el sistema en forma matricial

$$\begin{pmatrix} a_{11} & \cdots & a_{1n} \\ \vdots & & \vdots \\ a_{k1} & \cdots & a_{kn} \end{pmatrix} \begin{pmatrix} x_1 \\ \vdots \\ x_n \end{pmatrix} = \begin{pmatrix} b_1 \\ \vdots \\ b_k \end{pmatrix}$$

que se abrevia $A x = b$, donde:

- $A \in \mathbb{K}^{k \times n}$ es la **matriz de coeficientes**,
- $x \in \mathbb{K}^{n \times 1}$ es la **matriz de incógnitas**,
- $b \in \mathbb{K}^{k \times 1}$ es la **matriz de términos independientes**.

> **Definición (matriz ampliada).** Se nota $[A \mid b]$ a la **matriz ampliada** del sistema: la matriz de coeficientes con la columna de términos independientes agregada a la derecha.

> **Definición (sistema homogéneo).** Si $b = 0$, el sistema lineal $Ax = 0$ se dice **homogéneo**.

## Equivalencia por filas

> **Definición (equivalencia por filas).** Sean $A$ y $B$ matrices de $n \times k$. Se dice que $A$ es **equivalente por filas** a $B$, y se nota $A \sim B$, si $B$ se obtiene aplicando operaciones elementales de fila a $A$.

Las operaciones elementales de fila son: intercambiar dos filas, multiplicar una fila por un
escalar no nulo y sumar a una fila un múltiplo de otra.

**Observación.** Dos hechos clave sobre la equivalencia por filas:

i) La equivalencia por filas entre matrices es una **relación de equivalencia** (reflexiva,
   simétrica y transitiva).
ii) Si $[A \mid b] \sim [A' \mid b']$, entonces $Ax = b$ tiene las **mismas soluciones** que
    $A'x = b'$. Esto es lo que justifica resolver un sistema operando sobre su matriz ampliada.

## Forma escalonada y forma escalonada reducida

> **Definición (forma escalonada, FE).** Una matriz está en **forma escalonada** si:
> i) el primer coeficiente no nulo de cada fila es igual a $1$ (ese $1$ se llama el **1 principal**);
> ii) el $1$ principal de una fila está más a la derecha que el de la fila anterior;
> iii) si hay filas nulas, están abajo.

> **Definición (forma escalonada reducida, FER).** Una matriz está en **forma escalonada reducida** si:
> i) está en forma escalonada;
> ii) en las columnas donde hay un $1$ principal, el resto de los elementos son iguales a $0$.

> **Teorema.** Sea $A$ una matriz de $n \times k$. Entonces existe una única matriz $B$ tal que $B \sim A$ y $B$ está en forma escalonada reducida.

Es decir: la FER de una matriz es **única**, mientras que una forma escalonada (sin reducir)
puede no serlo.

## Rango

> **Definición (rango).** El **rango** de una matriz $A$ es la cantidad de $1$ principales de la forma escalonada reducida equivalente por filas a $A$. Se nota $\mathrm{Rg}(A)$.

**Observaciones.**

i) $\mathrm{Rg}(A) \leq \min\{\#\text{filas}(A), \; \#\text{columnas}(A)\}$.
ii) Si $A \sim B$, entonces $\mathrm{Rg}(A) = \mathrm{Rg}(B)$: el rango es invariante por
    operaciones de fila.
iii) $\mathrm{Rg}(A)$ es igual a la cantidad de $1$ principales de **cualquier** forma escalonada
     de $A$, no hace falta llegar a la reducida para contarlos.

El rango es la herramienta con la que se clasifica un sistema lineal según tenga solución única,
infinitas soluciones o ninguna; esa clasificación (teorema de Rouché–Frobenius) se desarrolla en
[[03-rouche-frobenius-inversibles]].

---

## Ver también

- [[01-matrices-operaciones]] — matriz, operaciones y transpuesta
- [[03-rouche-frobenius-inversibles]] — Rouché–Frobenius, SCD/SCI/SI y matrices inversibles
