---
tags: [teoria, unidad-1, cinematica, movimiento-circular, movimiento-relativo]
fuente: raw/1-Teoricas/apuntes-cursada-2023-2c.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Movimiento circular y movimiento relativo

Esta página cierra la [[01-cinematica-1d|cinemática]] con dos temas que introducen la
descomposición vectorial: el **movimiento circular** en coordenadas intrínsecas (versores
tangente $\hat t$ y normal $\hat n$) y el **movimiento relativo** entre sistemas de referencia,
que distingue marcos inerciales de no inerciales.

## Velocidad en coordenadas intrínsecas

La velocidad media es $\vec v_m = \dfrac{\Delta \vec r}{\Delta t} = \dfrac{\Delta r\,\hat u}{\Delta t}$.
Cuando $\Delta t \to 0$, el desplazamiento $\Delta r$ tiende al arco $ds$ y el versor $\hat u$
tiende al versor tangente $\hat t$. Así, la velocidad instantánea es tangente a la trayectoria:

$$\vec v = \frac{ds}{dt}\,\hat t = v\,\hat t$$

donde $s$ es el arco recorrido y $v = \dfrac{ds}{dt}$ su rapidez. La velocidad en coordenadas
intrínsecas se define como **su módulo en la dirección del versor tangente**.

## Aceleración: componentes tangencial y normal

Derivando $\vec v = v\,\hat t$ aparecen dos términos, porque tanto el módulo $v$ como la
dirección $\hat t$ cambian con el tiempo:

$$\vec a = \frac{dv}{dt}\,\hat t + v\,\frac{d\hat t}{dt}$$

El primero es la **aceleración tangencial** $a_t$; el segundo, la **aceleración normal** $a_n$.
Para evaluar $\dfrac{d\hat t}{dt}$ se escribe el versor tangente por sus componentes,
$\hat t = \cos\theta\,\hat\imath + \operatorname{sen}\theta\,\hat\jmath$, y se deriva:

$$\frac{d\hat t}{dt} = \bigl(-\operatorname{sen}\theta\,\hat\imath + \cos\theta\,\hat\jmath\bigr)\frac{d\theta}{dt} = \frac{d\theta}{dt}\,\hat n$$

ya que el paréntesis es justamente el versor normal $\hat n$. Usando la relación de arco
$ds = d\theta\,R$ (con $R$ el radio) se tiene $\dfrac{d\hat t}{dt} = \dfrac{v}{R}\,\hat n$, y por
lo tanto:

$$\vec a = \frac{dv}{dt}\,\hat t + \frac{v^2}{R}\,\hat n$$

donde $a_t = \dfrac{dv}{dt}$ mide el cambio de rapidez y $a_n = \dfrac{v^2}{R}$ el cambio de
dirección (siempre hacia el centro). El módulo total es $a = \sqrt{a_t^2 + a_n^2}$.

### Clasificación según $a_t$

La aceleración tangencial define el tipo de movimiento circular:

| $a_t$ | Movimiento |
|---|---|
| $a_t = 0$ | MCU — circular uniforme |
| $a_t = \text{cte}$ | MCUV — circular uniformemente variado |
| $a_t = f(t),\,f(x),\,f(v)$ | circular con aceleración variable |

- **MCU:** $a_t = \dfrac{dv}{dt} = 0$ y $a_n = \dfrac{v^2}{R} = \text{cte}$. Solo hay aceleración
  centrípeta.
- **MCUV:** $a_t = \dfrac{dv}{dt} = \text{cte}$; se deriva e integra igual que el
  [[01-cinematica-1d|MRUV]], pero sobre la variable de arco $s$.

> **Ejemplo (Guía 1, ej. 1.16).** Dada la aceleración total $\vec a$ y el ángulo $\theta$ que
> forma con la normal: $a_n = a\cos\theta = 13\ \tfrac{\text{m}}{\text{s}^2}$, de donde
> $v = \sqrt{a_n\,R} = 5{,}7\ \tfrac{\text{m}}{\text{s}}$, y $a_t = a\operatorname{sen}\theta = 7{,}5\ \tfrac{\text{m}}{\text{s}^2}$.

> **Ejemplo (Guía 1, ej. 1.17).** Un móvil recorre una curva de $R = 150\ \text{m}$ y frena de
> $90\ \tfrac{\text{km}}{\text{h}} = 25\ \tfrac{\text{m}}{\text{s}}$ a
> $50\ \tfrac{\text{km}}{\text{h}} \approx 13{,}9\ \tfrac{\text{m}}{\text{s}}$ en $15\ \text{s}$, con
> aceleración tangencial $a_t = \dfrac{v - v_0}{t} = -0{,}74\ \tfrac{\text{m}}{\text{s}^2}$. En el
> instante en que su rapidez es $60\ \tfrac{\text{km}}{\text{h}} \approx 16{,}7\ \tfrac{\text{m}}{\text{s}}$,
> la aceleración normal vale $a_n = \dfrac{v^2}{R} = 1{,}86\ \tfrac{\text{m}}{\text{s}^2}$ y el módulo
> total $a = \sqrt{a_t^2 + a_n^2} \approx 2\ \tfrac{\text{m}}{\text{s}^2}$.

## Movimiento relativo

Se comparan dos sistemas de referencia: uno fijo con origen $O$ y otro con origen $O'$ que se
mueve respecto del primero. La posición de la partícula en el marco fijo es la posición de $O'$
más la posición medida en el marco móvil:

$$\vec r = \vec r_{OO'} + \vec r\,'$$

Derivando una y dos veces respecto del tiempo se obtienen las leyes de composición de velocidades
y aceleraciones:

$$\vec v = \vec v_{OO'} + \vec v\,', \qquad \vec a = \vec a_{OO'} + \vec a\,'$$

donde $\vec r_{OO'}, \vec v_{OO'}, \vec a_{OO'}$ describen el movimiento del origen $O'$ y las
primadas son las magnitudes medidas en el marco móvil.

### Sistemas inerciales y no inerciales

> **Definición.** Si $\vec v_{OO'} = \text{cte}$, entonces $\vec a_{OO'} = 0$ y por lo tanto
> $\vec a = \vec a\,'$: ambos marcos miden la misma aceleración. $O'$ es un **sistema de
> referencia inercial**.

> **Definición.** Si $\vec v_{OO'} \neq \text{cte}$, entonces $\vec a \neq \vec a\,'$ y en
> consecuencia $\sum \vec F \neq \sum \vec F\,'$: las fuerzas medidas difieren. $O'$ es un
> **sistema de referencia no inercial**.

**Observación.** La equivalencia entre marcos inerciales es la base de la dinámica
newtoniana: las leyes de Newton valen tal cual solo en marcos
inerciales; en los no inerciales aparecen términos adicionales de aceleración del origen.

---

## Ver también

- [[01-cinematica-1d]] — velocidad y aceleración como derivadas; MRUV base del MCUV
- [[02-aceleracion-variable]] — $a_t$ puede depender de $t$, $x$ o $v$, igual que en 1D
- [[03-tiro-oblicuo]] — descomposición vectorial del movimiento en el plano
