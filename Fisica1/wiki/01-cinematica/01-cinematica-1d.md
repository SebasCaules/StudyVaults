---
tags: [teoria, unidad-1, cinematica, mru, mruv]
fuente: raw/1-Teoricas/apuntes-cursada-2023-2c.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Cinemática en una dimensión (MRU y MRUV)

Esta página reúne las definiciones de velocidad y aceleración instantáneas, el par
derivación/integración que conecta $x(t)$, $v(t)$ y $a(t)$, y las ecuaciones horarias del
movimiento con aceleración constante (MRUV). Es la base sobre la que se apoyan la
[[02-aceleracion-variable|aceleración variable]] y el [[03-tiro-oblicuo|tiro oblicuo]].

## Rapidez y velocidad instantánea

La velocidad instantánea es el límite de la velocidad media cuando el intervalo tiende a cero,
es decir, la derivada de la posición respecto del tiempo:

$$v_x = \lim_{\Delta t \to 0} \frac{\Delta x}{\Delta t} = \frac{dx}{dt}$$

donde $x$ es la posición sobre el eje y $t$ el tiempo.

## Aceleración media e instantánea

La aceleración media es el cociente entre la variación de velocidad y el intervalo,
$a_m = \dfrac{\Delta v}{\Delta t}$; la aceleración instantánea es su límite, la derivada de la
velocidad (o la segunda derivada de la posición):

$$a = \lim_{\Delta t \to 0} \frac{\Delta v}{\Delta t} = \frac{dv}{dt} = \frac{d^2x}{dt^2}$$

## Derivación e integración

Los tres descriptores del movimiento están encadenados por dos procesos inversos: **derivar**
baja de posición a velocidad y de velocidad a aceleración; **integrar** recorre el camino
opuesto (agregando las condiciones iniciales).

$$x(t) \;\xrightarrow{\;d/dt\;}\; v(t) = \frac{dx}{dt} \;\xrightarrow{\;d/dt\;}\; a(t) = \frac{d^2x}{dt^2}$$

> **Nota.** En los apuntes de la cursada 2023-2C la aceleración se escribe con una grafía
> parecida a $\partial$; aquí se normaliza siempre a $a$.

## Ecuaciones del MRUV (aceleración constante)

Cuando la aceleración es constante ($a = \text{cte}$) valen las tres ecuaciones horarias del
movimiento rectilíneo uniformemente variado. **Solo sirven si $a = \text{cte}$**:

$$x = x_0 + v_0\,t + \tfrac12 a\,t^2$$
$$v = v_0 + a\,t$$
$$v^2 = v_0^2 + 2a\,\Delta x$$

donde $x_0$ y $v_0$ son la posición y la velocidad iniciales, $a$ la aceleración constante y
$\Delta x = x - x_0$ el desplazamiento.

### Deducción por integración

Las tres se obtienen integrando la definición de aceleración. Partiendo de $a = \dfrac{dv}{dt}$
con $a = \text{cte}$:

$$\int_{t_0}^{t} a\,dt = \int_{v_0}^{v} dv \;\Rightarrow\; a\,(t - t_0) = v - v_0$$

de donde sale la ecuación de velocidad:

$$v(t) = v_0 + a\,(t - t_0)$$

Integrando ahora $v = \dfrac{dx}{dt}$ con esa velocidad se obtiene la ecuación horaria:

$$\int_{t_0}^{t}\bigl(v_0 + a\,(t - t_0)\bigr)\,dt = x - x_0 \;\Rightarrow\; x(t) = x_0 + v_0\,(t - t_0) + \tfrac12 a\,(t - t_0)^2$$

Para la tercera se usa la regla de la cadena $a = \dfrac{dv}{dx}\dfrac{dx}{dt} = v\,\dfrac{dv}{dx}$,
que separa variables sin el tiempo:

$$\int_{x_0}^{x} a\,dx = \int_{v_0}^{v} v\,dv \;\Rightarrow\; v^2 = v_0^2 + 2a\,(x - x_0)$$

**Observación.** Tomando $t_0 = 0$ las dos primeras recuperan la forma compacta del recuadro.

## Desplazamiento vs. distancia recorrida

El **desplazamiento** es la diferencia de posiciones $\Delta x = x_f - x_0$; la **distancia (o
longitud) recorrida** suma los tramos en valor absoluto, y **no coinciden** cuando la partícula
invierte el sentido (pasa por $v = 0$).

> **Ejemplo.** Para $x(t) = 15\ \text{m} + 20\ \tfrac{\text{m}}{\text{s}}\,t - 5\ \tfrac{\text{m}}{\text{s}^2}\,t^2$
> se tiene $x(0) = 15\ \text{m}$ y $x(3\,\text{s}) = 30\ \text{m}$, así que el desplazamiento en
> esos 3 s es $15\ \text{m}$. Para la distancia recorrida se busca el instante de retorno con
> $v(t) = 20 - 10\,t = 0 \Rightarrow t = 2\ \text{s}$, donde $x(2\,\text{s}) = 35\ \text{m}$. La
> partícula avanza hasta $35\ \text{m}$ y luego retrocede, de modo que la longitud recorrida
> supera al desplazamiento.

Este contraste entre magnitud vectorial (desplazamiento) y escalar (distancia) es el que motiva
integrar $|v|$ en vez de $v$ cuando hay cambios de sentido.

---

## Ver también

- [[02-aceleracion-variable]] — cuando $a$ deja de ser constante: $a(t)$, $a(v)$, $a(x)$
- [[03-tiro-oblicuo]] — MRUV en dos ejes acoplados por el tiempo
- [[04-movimiento-circular-relativo]] — coordenadas intrínsecas y sistemas de referencia
