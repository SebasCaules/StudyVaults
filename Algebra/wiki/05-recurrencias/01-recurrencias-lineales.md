---
tags: [teoria, unidad-5, recurrencias, fibonacci, ecuacion-caracteristica]
fuente: raw/2-practicas/algebra.pdf
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Relaciones de recurrencia lineales

Una **relación de recurrencia** define cada término de una sucesión en función de los
anteriores. Esta unidad trabaja el caso de las recurrencias **lineales homogéneas de orden 2**
—donde $a_n$ depende de $a_{n-1}$ y $a_{n-2}$— y el método de la **ecuación característica**
para pasar de la recurrencia a una **fórmula cerrada** del $n$-ésimo término. El caso guía es
la sucesión de Fibonacci; la aplicación al conteo se ve en [[02-conteo-con-recurrencias]].
Transcripción de los apuntes de la cursada 2023-1C.

## La recurrencia y sus condiciones iniciales

Una sucesión definida por recurrencia queda determinada por dos datos: la **regla** que liga
un término con los anteriores, y las **condiciones iniciales** que fijan los primeros valores.

> **Definición (recurrencia lineal homogénea de orden 2).** El caso que trabaja esta unidad es la sucesión $(a_n)$ que verifica
> $$a_n = a_{n-1} + a_{n-2}$$
> junto con dos condiciones iniciales que fijan $a_0$ y $a_1$ (o $a_1$ y $a_2$).

En los apuntes esta es la forma concreta que aparece, con coeficientes $1$ y $1$. La regla vale
a partir del índice en que ya existen los dos términos anteriores; las condiciones iniciales
arrancan la sucesión.

## Método de la ecuación característica

Para obtener una fórmula cerrada se busca una solución de la forma $a_n = r^n$. Reemplazando en
la recurrencia y dividiendo por $r^{n-2}$ se llega a un polinomio de grado 2 cuyas raíces
generan todas las soluciones.

Se parte de escribir la recurrencia con todo de un lado:

$$a_n - a_{n-1} - a_{n-2} = 0$$

Proponiendo $a_n = r^n$ resulta la **ecuación característica**:

$$r^2 - r - 1 = 0$$

cuyas raíces son

$$r = \frac{1 \pm \sqrt{5}}{2}$$

donde $r_1 = \tfrac{1+\sqrt5}{2}$ (el número áureo) y $r_2 = \tfrac{1-\sqrt5}{2}$. Con dos raíces
reales distintas, la **solución general** de la recurrencia es la combinación

$$a_n = A\left(\frac{1+\sqrt5}{2}\right)^n + B\left(\frac{1-\sqrt5}{2}\right)^n$$

donde $A$ y $B$ son constantes a determinar y $r_1, r_2$ son las raíces de la ecuación
característica.

### Determinación de las constantes

Las constantes $A$ y $B$ se calculan imponiendo las **condiciones iniciales**: se evalúa la
solución general en los primeros índices y se resuelve el sistema lineal $2\times 2$ resultante
en $A$ y $B$. Este paso se desarrolla en detalle sobre el ejemplo de conteo en
[[02-conteo-con-recurrencias]].

## La sucesión de Fibonacci

> **Definición (Fibonacci).** La sucesión de Fibonacci se obtiene sumando los dos términos
> anteriores, con excepción de los dos primeros, que valen $0$ y $1$:
> $$a_n = a_{n-1} + a_{n-2}, \qquad a_0 = 0, \quad a_1 = 1$$

El objetivo del ejercicio es hallar una fórmula para el $n$-ésimo número de Fibonacci. La
recurrencia es exactamente la del método anterior, así que su solución general es

$$a_n = A\left(\frac{1+\sqrt5}{2}\right)^n + B\left(\frac{1-\sqrt5}{2}\right)^n$$

Imponiendo $a_0 = 0$ y $a_1 = 1$ se obtiene el sistema

$$\begin{cases} A + B = 0 \\[2pt] A\dfrac{1+\sqrt5}{2} + B\dfrac{1-\sqrt5}{2} = 1 \end{cases}$$

que da $A = \tfrac{1}{\sqrt5}$ y $B = -\tfrac{1}{\sqrt5}$, y con ello la fórmula cerrada

$$a_n = \frac{1}{\sqrt5}\left[\left(\frac{1+\sqrt5}{2}\right)^n - \left(\frac{1-\sqrt5}{2}\right)^n\right]$$

> **Nota.** En los apuntes, el Ejercicio 13 deja planteada la recurrencia de Fibonacci con sus
> condiciones iniciales ($a_0 = 0$, $a_1 = 1$) pero no completa el álgebra de la fórmula
> cerrada. El método de la ecuación característica y el despeje de las constantes se desarrollan
> por completo sobre el ejercicio de conteo ([[02-conteo-con-recurrencias]]); la fórmula de
> arriba es su aplicación directa a las condiciones iniciales de Fibonacci.

---

## Ver también

- [[02-conteo-con-recurrencias]] — misma recurrencia aplicada a contar arreglos de $n$-bits, con el despeje completo de las constantes
