---
tags: [resuelto, unidad-5, recurrencias, conteo, ecuacion-caracteristica]
fuente: raw/2-practicas/algebra.pdf
unidad: 5
tipo: resuelto
actualizado: 2026-07-05
---

# Conteo con recurrencias

Las recurrencias sirven para **contar** objetos que se construyen agregando una pieza a la vez:
si un objeto de tamaño $n$ se arma a partir de objetos más chicos, la cantidad $a_n$ satisface
una relación de recurrencia. Esta página resuelve el problema típico de la práctica: contar los
arreglos de $n$-bits sin ceros consecutivos. La maquinaria (ecuación característica, solución
general) es la de [[01-recurrencias-lineales]]. Transcripción de los apuntes de la cursada 2023-1C.

## El problema: arreglos de $n$-bits sin ceros consecutivos

> **Problema.** Sea $a_n$ el número de arreglos de $n$-bits que **no tienen ceros consecutivos**.
> Hallar una relación de recurrencia para $a_n$ y usarla para calcular $a_n$ para todo $n \geq 3$.

Un $n$-bit es una tira de $n$ dígitos $0$ ó $1$; se cuentan solo las tiras en las que no
aparecen dos $0$ pegados. Enumerando los primeros casos:

| $n$ | Arreglos válidos | $a_n$ |
|---|---|---|
| 1 | $0,\ 1$ | 2 |
| 2 | $01,\ 10,\ 11$ | 3 |
| 3 | $010,\ 011,\ 101,\ 110,\ 111$ | 5 |
| 4 | $0101, 0110, 0111, 1010, 1011, 1101, 1110, 1111$ | 8 |

Los valores $2, 3, 5, 8, \dots$ anticipan una recurrencia de tipo Fibonacci.

## Planteo de la recurrencia

Se separan los arreglos válidos según su **último bit**. Sea $a_n^1$ la cantidad que termina en
$1$ y $a_n^0$ la que termina en $0$, de modo que

$$a_n = a_n^1 + a_n^0$$

**Termina en 1.** Si el último bit es $1$, los primeros $n-1$ bits pueden ser cualquier arreglo
válido: agregar un $1$ nunca crea dos ceros seguidos. Entonces

$$a_n^1 = a_{n-1}$$

**Termina en 0.** Si el último bit es $0$, el bit anterior está obligado a ser $1$ (si fuera
$0$ habría ceros consecutivos). O sea, el arreglo es un válido de longitud $n-1$ terminado en
$1$, seguido de un $0$. La cantidad de válidos de longitud $n-1$ terminados en $1$ es $a_{n-2}$,
así que

$$a_n^0 = a_{n-2}$$

Sumando ambos casos se obtiene la recurrencia buscada:

$$a_n = a_{n-1} + a_{n-2}, \qquad a_1 = 2, \quad a_2 = 3, \qquad n \geq 3$$

donde $a_1 = 2$ y $a_2 = 3$ son las condiciones iniciales tomadas de la enumeración.

## Resolución por ecuación característica

La recurrencia es la misma de [[01-recurrencias-lineales]]. Escrita con todo de un lado,

$$a_n - a_{n-1} - a_{n-2} = 0,$$

su ecuación característica es $r^2 - r - 1 = 0$, con raíces $r = \tfrac{1 \pm \sqrt5}{2}$. La
solución general es entonces

$$a_n = A\left(\frac{1+\sqrt5}{2}\right)^n + B\left(\frac{1-\sqrt5}{2}\right)^n$$

con $A, B$ a determinar por las condiciones iniciales.

### Despeje de las constantes

Conviene usar $a_0$ y $a_1$. De la propia recurrencia, $a_2 = a_1 + a_0$, y como $a_2 = 3$,
$a_1 = 2$, resulta $a_0 = 1$. El sistema para $A$ y $B$ es:

$$\begin{cases} a_0 = A + B = 1 \\[4pt] a_1 = A\dfrac{1+\sqrt5}{2} + B\dfrac{1-\sqrt5}{2} = 2 \end{cases}$$

De la primera ecuación $A = 1 - B$. Sustituyendo en la segunda:

$$2 = \left(1 - B\right)\frac{1+\sqrt5}{2} + B\,\frac{1-\sqrt5}{2}$$

$$2 = \frac{1+\sqrt5}{2} - B\,\frac{1+\sqrt5}{2} + B\,\frac{1-\sqrt5}{2}$$

Pasando el primer término a la izquierda y agrupando $B$:

$$2 - \frac{1+\sqrt5}{2} = B\left(\frac{1-\sqrt5}{2} - \frac{1+\sqrt5}{2}\right)$$

El lado izquierdo es $\tfrac{3-\sqrt5}{2}$ y el paréntesis vale $-\sqrt5$, de donde

$$\frac{\left(3-\sqrt5\right)/2}{-\sqrt5} = B \quad\Longrightarrow\quad B = \frac{5 - 3\sqrt5}{10}$$

y por lo tanto

$$A = 1 - B = \frac{5 + 3\sqrt5}{10}$$

### Fórmula cerrada

Reemplazando $A$ y $B$ en la solución general se obtiene la fórmula del $n$-ésimo término:

$$a_n = \frac{5 + 3\sqrt5}{10}\left(\frac{1+\sqrt5}{2}\right)^n + \frac{5 - 3\sqrt5}{10}\left(\frac{1-\sqrt5}{2}\right)^n$$

válida para contar los arreglos de $n$-bits sin ceros consecutivos, con $A = \tfrac{5+3\sqrt5}{10}$
y $B = \tfrac{5-3\sqrt5}{10}$ los coeficientes recién despejados.

---

## Ver también

- [[01-recurrencias-lineales]] — el método de la ecuación característica y la sucesión de Fibonacci, que comparte esta recurrencia
