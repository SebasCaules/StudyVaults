---
tags: [teoria, unidad-3, calculo-relacional, calculo-de-dominios, drc]
fuente: raw/teoricas/apuntes-cursada-2025-2c.pdf
unidad: 3
tipo: teoria
actualizado: 2026-07-05
---

# Cálculo relacional de dominios (DRC)

El cálculo de dominios es la segunda variante del cálculo relacional. La diferencia con el
[[01-calculo-de-tuplas|cálculo de tuplas]] (TRC) es sobre qué corren las variables: aquí cada
variable representa un **valor de un dominio** (el valor de un atributo), no una tupla entera.

## Forma general de una consulta

Una consulta de DRC lista las variables de dominio que se quieren en el resultado, separadas de la
fórmula por una barra:

$$\{\, x_1, x_2, \dots, x_n \mid \varphi(x_1, x_2, \dots, x_n) \,\}$$

Las variables $x_1, \dots, x_n$ son las **libres** (las que salen en el resultado) y $\varphi$ es la
fórmula que deben satisfacer. Cada $x_i$ toma valores de un dominio de atributo.

## Átomos posicionales

La pertenencia a una relación se escribe listando una variable (o constante) **por cada atributo**,
en el orden del esquema. Esto es lo que distingue al DRC del TRC.

| Átomo | Significado |
|---|---|
| $r(x_1, \dots, x_n)$ | existe en $r$ una tupla cuyos atributos valen $x_1, \dots, x_n$ (en orden) |
| $x_i\ \theta\ x_j$ | la variable $x_i$ compara con $x_j$ |
| $x_i\ \theta\ c$ | la variable $x_i$ compara con una constante $c$ |

con $\theta \in \{=,\ \neq,\ <,\ \le,\ >,\ \ge\}$. Como el átomo es posicional, para "ignorar" un
atributo se usa una variable acotada por $\exists$ que no aparece en el resultado.

Los conectivos y cuantificadores son los mismos que en el TRC: $\neg$, $\wedge$, $\vee$, $\exists$,
$\forall$, y rige la misma noción de **fórmula segura** (el resultado debe quedar acotado al
dominio activo).

## Patrón típico: filtrar y descartar columnas

Se declara la relación fuente con una variable por atributo; las que no se quieren en el resultado
se acotan con $\exists$, y las condiciones se imponen sobre las variables.

> **Ejemplo.** Código y fecha de las penalizaciones ocurridas durante 2015, sobre
> `Penalizacion(codigo, fecha, monto)`:
> $$\{\, \text{Codigo}, \text{Fecha} \mid (\exists\, \text{M})\,\big(\ \text{Penalizacion}(\text{Codigo}, \text{Fecha}, \text{M})\ \wedge\ \text{01/01/2015} \le \text{Fecha} \le \text{31/12/2015}\ \big) \,\}$$
> `Codigo` y `Fecha` quedan libres (salen en el resultado); el `monto` $\text{M}$ se acota con
> $\exists$ porque no interesa.

## Joins mediante variables compartidas

El join se logra usando la **misma variable** en la posición del atributo común de dos relaciones:
al repetir la variable se fuerza la igualdad.

> **Ejemplo.** Nombre de los jugadores que incurrieron en alguna penalización, con
> `Jugador(codigo, nombre, telefono)` y `Penalizacion(codigo, fecha, monto)`:
> $$\{\, \text{Nombre} \mid (\exists\, \text{Cod}, \text{tel})\,\big(\ \text{Jugador}(\text{Cod}, \text{Nombre}, \text{tel})\ \wedge\ (\exists\, \text{F}, \text{M})\,(\ \text{Penalizacion}(\text{Cod}, \text{F}, \text{M})\ )\ \big) \,\}$$
> La variable `Cod` aparece en ambos átomos: ese solo hecho encadena jugador y penalización por su
> código común.

> **Ejemplo (alumnos anotados en 2014).** Con `Alumno(legajo, nombre, sexo, carrera)` e
> `Inscripcion(codigo, legajo, año)`:
> $$\{\, \text{Nombre} \mid (\exists\, \text{leg}, \text{Sex}, \text{Car})\,\big(\ \text{Alumno}(\text{leg}, \text{Nombre}, \text{Sex}, \text{Car})\ \wedge\ (\exists\, \text{Cod})\,(\ \text{Inscripcion}(\text{Cod}, \text{leg}, \text{2014})\ )\ \big) \,\}$$

## "Todos los…": el universal por doble negación

Las consultas de tipo "todos" (equivalentes a la **división** del álgebra) se codifican con **dos
negaciones** de existencial. La lectura de $\neg(\exists x)(\dots \wedge \neg(\exists y)(\dots))$ es
"no hay ningún $x$ que **no** cumpla", es decir, "para todo $x$ se cumple".

> **Ejemplo.** Nombre de los estudiantes que se anotaron en **todos** los cursos, con
> `Alumno(legajo, nombre, sexo, carrera)`, `Curso(codigo, nombre)` e
> `Inscripcion(codigo, legajo, año)`:
> $$\{\, \text{N} \mid (\exists\, \text{L}, \text{S}, \text{C})\,\big(\ \text{Alumno}(\text{L}, \text{N}, \text{S}, \text{C})\ \wedge\ \neg(\exists\, \text{Cod}, \text{N1})\,(\ \text{Curso}(\text{Cod}, \text{N1})\ \wedge\ \neg(\exists\, \text{Año})\,(\ \text{Inscripcion}(\text{Cod}, \text{L}, \text{Año})\ )\ )\ \big) \,\}$$
> Se lee: el alumno de legajo `L` tal que **no existe** ningún curso `Cod` en el que el alumno
> **no** esté inscripto. Las dos negaciones equivalen a "está inscripto en todos los cursos".

Este patrón $\neg\exists\dots\neg\exists$ es la traducción directa del operador división y del
cuantificador universal; aparece cada vez que la consulta pide "todos", "cada uno" o "sin excepción".

---

## Ver también

- [[01-calculo-de-tuplas]] — la variante con variables sobre tuplas
- [[03-equivalencia-algebra-calculo]] — correspondencia con el álgebra y traducción de "todos" ↔ división
- [[02-algebra-relacional/01-operaciones-basicas]] — operaciones del álgebra relacional
- [[index]] — índice del vault de Base de Datos I
