---
tags: [teoria, unidad-7, momento-angular, conservacion, rotacion]
fuentes:
  - raw/teoricas/fisica1-2023-2c.pdf
  - raw/practicas/fisica1-2023-2c.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Momento angular

El momento angular es la magnitud rotacional análoga a la cantidad de movimiento
lineal: mide el "giro" de una partícula o de un cuerpo respecto de un punto. Su
utilidad principal es que **se conserva** cuando el torque neto es nulo, lo que
permite resolver fuerzas centrales, plataformas giratorias y choques contra
cuerpos con pivote sin conocer las fuerzas del impacto. Contenido transcripto de
los apuntes de la cursada 2023-2C (teórica y Guía 7).

## Momento angular de una partícula

Para una partícula de masa $m$ que se mueve con velocidad $\vec{v}$, el momento
angular respecto de un punto fijo $O$ se define como el producto vectorial entre
el vector posición y la cantidad de movimiento:

$$\vec{L}_o = \vec{r} \times m\vec{v}$$

donde $\vec{r}$ es la posición de la partícula medida desde $O$ y $m\vec{v}$ es su
cantidad de movimiento. Por ser un producto vectorial, $\vec{L}_o$ es
**perpendicular al plano** donde viven $\vec{r}$ y $\vec{v}$.

### Relación con el torque

Derivando la definición respecto del tiempo aparece la ley dinámica del momento
angular. El desarrollo es

$$\frac{d\vec{L}_o}{dt} = \frac{d\vec{r}}{dt} \times m\vec{v} + \vec{r} \times \frac{d(m\vec{v})}{dt} = \vec{v} \times m\vec{v} + \vec{r} \times \vec{F}_{neto}$$

El primer término se anula porque $\vec{v} \times m\vec{v} = \vec{0}$ (vectores
paralelos), y el segundo es justamente el torque neto respecto de $O$. Queda

$$\frac{d\vec{L}_o}{dt} = \vec{M}_{neto\,o}$$

donde $\vec{M}_{neto\,o} = \vec{r} \times \vec{F}_{neto}$ es el momento (torque) de
la fuerza resultante respecto de $O$. Es el equivalente rotacional de
$\sum \vec{F}_{ext} = \dfrac{d\vec{p}}{dt}$.

## Conservación — fuerzas centrales

De la ley anterior se lee de inmediato la condición de conservación: si no hay
torque neto, el momento angular es constante.

> **Proposición.** Si $\vec{M}_{neto\,o} = \vec{0}$, entonces $\vec{L}_o = \text{cte}$.

El caso típico es el de una **fuerza central**: una fuerza cuya línea de acción
pasa siempre por el punto $O$. Como $\vec{F}$ y $\vec{r}$ resultan paralelos, su
torque $\vec{r} \times \vec{F}$ es nulo y $\vec{L}_o$ se conserva. Esto es lo que
permite relacionar velocidades en distintos puntos de una órbita o de una masa que
gira atada a un hilo de radio variable (ver [[03-ejercicios-momento-angular]]).

## Momento angular en la rotación planar

Para un cuerpo rígido que rota alrededor de un **eje fijo** con velocidad angular
$\vec{\omega}$, cada partícula $i$ tiene velocidad $\vec{v}_i = \vec{\omega} \times \vec{r}_i$.
Su aporte al momento angular es

$$\vec{L}_i = \vec{r}_i \times m_i \vec{v}_i = \vec{r}_i \times (\vec{\omega} \times \vec{r}_i)\, m_i = m_i r_i^2\, \omega\, \hat{k}$$

donde $r_i$ es la distancia de la partícula al eje y $\hat{k}$ la dirección del eje
de rotación. Sumando sobre todas las partículas aparece el momento de inercia
$I_o = \sum_i m_i r_i^2$:

$$\vec{L}_o = \sum_{i=1}^{n} m_i r_i^2\, \omega\, \hat{k} = I_o\, \vec{\omega}$$

donde $I_o$ es el momento de inercia respecto del eje y $\vec{\omega}$ la velocidad
angular. Esta expresión **vale respecto de un eje fijo**.

Derivando se recupera la segunda ley de Newton para la rotación, y con ella la
condición de conservación en su forma rígida:

$$\frac{d\vec{L}_o}{dt} = I_o\, \vec{\alpha} = \sum \vec{M}_o \qquad\Longrightarrow\qquad \sum \vec{M}_o = \vec{0} \;\Rightarrow\; \vec{L}_o = \text{cte}$$

donde $\vec{\alpha}$ es la aceleración angular.

> **Nota.** Según los apuntes, $\vec{L}_o = I_o\vec{\omega}$ y su ley de conservación
> valen **siempre que el punto esté ubicado en el centro de masa o sobre un eje
> fijo**. Fuera de esos casos hay que usar la escritura general de abajo.

## Escritura general (spin + orbital)

Cuando el cuerpo además traslada, el momento angular respecto de un punto $O$ se
descompone en dos aportes: el **spin** (giro propio alrededor del centro de masa) y
el **orbital** (giro del centro de masa alrededor de $O$):

$$\vec{L}_o = \underbrace{I_{cm}\, \vec{\omega}}_{\text{spin}} \;+\; \underbrace{\vec{r}_{cm} \times m\vec{v}_{cm}}_{\text{orbital}}$$

donde $I_{cm}$ es el momento de inercia respecto del centro de masa, $\vec{r}_{cm}$
la posición del centro de masa respecto de $O$ y $\vec{v}_{cm}$ su velocidad. El
primer término trata al cuerpo como un rotor rígido; el segundo, como una partícula
de masa $m$ concentrada en el centro de masa.

---

## Ver también

- [[02-colisiones-con-pivote]] — conservación de $\vec{L}$ en choques contra una barra con pivote
- [[03-ejercicios-momento-angular]] — Guía 7 resuelta: fuerzas centrales, plataformas y choques
