---
tags: [teoria, unidad-3, calculo-relacional, calculo-de-tuplas, trc]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Cálculo relacional de tuplas (TRC)

El cálculo relacional es un lenguaje de consultas **declarativo**: describe *qué* se quiere obtener
mediante una fórmula lógica, sin decir *cómo* calcularlo. Es el contrapunto del
[[02-algebra-relacional/01-operaciones-basicas|álgebra relacional]], que es procedimental. Tiene
dos variantes según sobre qué corran las variables: el **cálculo de tuplas** (TRC), que se trata
aquí, y el [[02-calculo-de-dominios|cálculo de dominios]] (DRC).

## Forma general de una consulta

Una consulta de TRC se escribe como un conjunto por comprensión, donde la variable $t$ recorre
tuplas y $\varphi$ es una fórmula que $t$ debe satisfacer:

$$\{\, t \mid \varphi(t) \,\}$$

El resultado es el conjunto de todas las tuplas $t$ para las que $\varphi(t)$ es verdadera. La
variable $t$ es la única **libre** de la fórmula: es la que "sale" en el resultado.

## Átomos

Los **átomos** son las fórmulas más simples. Hay tres formas:

| Átomo | Significado |
|---|---|
| $r(t)$ | la tupla $t$ pertenece a la relación $r$ |
| $t[i]\ \theta\ u[j]$ | el atributo $i$ de $t$ compara (vía $\theta$) con el atributo $j$ de otra tupla $u$ |
| $t[i]\ \theta\ c$ | el atributo $i$ de $t$ compara con una constante $c$ |

donde $\theta$ es un operador de comparación, $\theta \in \{=,\ \neq,\ <,\ \le,\ >,\ \ge\}$. La
notación $t[\text{atributo}]$ (o $t[i]$) selecciona el valor de ese atributo en la tupla $t$.

## Fórmulas y conectivos

A partir de los átomos, las **fórmulas** se construyen con los conectivos lógicos y los
cuantificadores:

- **Negación:** $\neg\, \varphi$
- **Conjunción:** $\varphi \wedge \psi$
- **Disyunción:** $\varphi \vee \psi$
- **Cuantificador existencial:** $(\exists u)\,(\varphi)$ — "existe una tupla $u$ tal que $\varphi$"
- **Cuantificador universal:** $(\forall u)\,(\varphi)$ — "para toda tupla $u$ vale $\varphi$"

Las variables ligadas por un cuantificador ($\exists$ o $\forall$) son **acotadas**; la variable
$t$ del resultado queda **libre**. En la práctica de los apuntes casi todas las consultas se
escriben con $\exists$: se declara una tupla auxiliar de una relación y se la vincula con $t$.

## Patrón típico: proyectar y filtrar

El patrón más común es declarar con $\exists$ una tupla $u$ de la relación fuente, imponerle
condiciones y copiar en $t$ solo los atributos que se quieren en el resultado (esto cumple el
papel de la proyección del álgebra).

> **Ejemplo.** Códigos y fechas de las penalizaciones ocurridas durante 2015, sobre una relación
> `Penalizacion(codigo, fecha, monto)`:
> $$\{\, t \mid (\exists u)\,\big(\ \text{Penalizacion}(u)\ \wedge\ \text{01/01/2015} \le u[\text{fecha}] \le \text{31/12/2015}\ \wedge\ t[\text{codigo}] = u[\text{codigo}]\ \wedge\ t[\text{fecha}] = u[\text{fecha}]\ \big) \,\}$$
> La tupla $u$ recorre `Penalizacion`; el filtro de fechas selecciona filas; las igualdades
> $t[\dots] = u[\dots]$ dejan en el resultado solo `codigo` y `fecha`.

## Joins mediante varios cuantificadores

Un join se expresa declarando una tupla por cada relación involucrada y ligándolas por el atributo
común. Cada relación extra agrega su propio $\exists$.

> **Ejemplo.** Nombre de los jugadores que incurrieron en al menos una penalización, con
> `Jugador(codigo, nombre, telefono)` y `Penalizacion(codigo, fecha, monto)`:
> $$\{\, t \mid (\exists u)\,\big(\ \text{Jugador}(u)\ \wedge\ (\exists v)\,(\ \text{Penalizacion}(v)\ \wedge\ u[\text{codigo}] = v[\text{codigo}]\ )\ \wedge\ t[\text{nombre}] = u[\text{nombre}]\ \big) \,\}$$
> El $\exists v$ interno actúa como el join: basta que **exista** una penalización con el mismo
> `codigo` que el jugador $u$.

## "Al menos dos" y desigualdades entre tuplas

Para pedir que existan **dos** entidades distintas se declaran dos tuplas de la misma relación y se
las obliga a diferir en algún atributo con $\neq$.

> **Ejemplo.** Legajos de alumnos anotados alguna vez en por lo menos dos materias distintas, sobre
> `Inscripcion(codigo, legajo, año)` (donde `codigo` identifica la materia):
> $$\{\, t \mid (\exists u)\,\big(\ \text{Inscripcion}(u)\ \wedge\ (\exists w)\,(\ \text{Inscripcion}(w)\ \wedge\ u[\text{codigo}] \neq w[\text{codigo}]\ \wedge\ u[\text{legajo}] = w[\text{legajo}]\ )\ \wedge\ t[\text{legajo}] = u[\text{legajo}]\ \big) \,\}$$
> Dos inscripciones del mismo `legajo` pero de `codigo` distinto garantizan las dos materias.

## Fórmulas seguras

No toda fórmula sintácticamente válida define un resultado admisible: hay que evitar consultas cuyo
resultado sea **infinito**. Por ejemplo, $\{\, t \mid \neg\, r(t) \,\}$ (todas las tuplas que *no*
están en $r$) es infinita, porque hay infinitas tuplas posibles fuera de $r$.

> **Definición.** Una fórmula es **segura** si todos los valores que pueden aparecer en el
> resultado pertenecen al **dominio activo** de la fórmula: el conjunto finito formado por las
> constantes que figuran en $\varphi$ más los valores que efectivamente aparecen en las relaciones
> mencionadas.

En consecuencia, la negación se usa siempre **acotada**: nunca $\neg\, r(t)$ suelto, sino dentro de
un contexto (típicamente $\neg(\exists \dots)$) que restringe los valores al dominio activo. Este
recurso es el que permite expresar "para todo" y las consultas de tipo división, y es la base de la
equivalencia con el álgebra (ver [[03-equivalencia-algebra-calculo]]).

---

## Ver también

- [[02-calculo-de-dominios]] — la otra variante del cálculo relacional, con variables sobre dominios
- [[03-equivalencia-algebra-calculo]] — cómo el TRC, el DRC y el álgebra expresan las mismas consultas
- [[02-algebra-relacional/01-operaciones-basicas]] — el lenguaje procedimental equivalente
- [[index]] — índice del vault de Base de Datos I
