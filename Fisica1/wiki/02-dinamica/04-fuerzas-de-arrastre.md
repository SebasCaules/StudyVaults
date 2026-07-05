---
tags: [teoria, unidad-2, dinamica, arrastre, drag, velocidad-limite]
fuente: raw/teoricas/fisica1-dinamica.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Fuerzas de arrastre y velocidad límite

Las fuerzas de arrastre (o *drag*) son las que ejerce un fluido sobre un cuerpo que se mueve a
través de él. A diferencia del peso o de la normal, **dependen de la velocidad**, y por eso dan
lugar a la noción de velocidad límite.

## Modelo de la fuerza de arrastre

> **Definición.** En general, la fuerza de arrastre se modela como una potencia de la rapidez:
> $$|f(v)| = b\,v^{\,n}, \qquad b = \text{cte} > 0$$
> donde $b$ es una constante positiva que depende del cuerpo y del fluido, $v$ la rapidez y $n$
> el exponente del modelo.

La fuerza se opone siempre al movimiento. El exponente $n$ depende del régimen: para un cuerpo
cayendo en un fluido, el arrastre $b\,v^n$ apunta hacia arriba mientras el peso $mg$ apunta hacia
abajo.

### Elección del exponente

Para cuerpos moviéndose en el aire se encuentra experimentalmente que:

| Tipo de objeto | Rango de rapidez | Exponente |
|---|---|---|
| Objetos relativamente pequeños | $0 \leq v \leq 86 \text{ km/h}$ | $n = 1$ |
| Objetos relativamente pequeños | $86 \leq v \leq 1200 \text{ km/h}$ | $n = 2$ |
| Objetos relativamente grandes (ej.: paracaidista) | — | $n = 2$ |

El caso $n = 1$ (arrastre lineal, o de bajas velocidades) y el caso $n = 2$ (arrastre
cuadrático, o de altas velocidades) son los dos regímenes de uso corriente.

## Velocidad límite

Al caer, la rapidez crece y con ella el arrastre. La **velocidad límite** $v_L$ se alcanza
cuando el arrastre equilibra al peso y la aceleración se anula:

$$\vec a = 0 \;\Rightarrow\; b\,v_L^{\,n} = m g \;\Rightarrow\; v_L = \left(\frac{m g}{b}\right)^{1/n}$$

donde $m$ es la masa del cuerpo y $g$ la aceleración de la gravedad. A partir de ese instante el
cuerpo cae con rapidez constante $v_L$.

### Valores típicos

Algunos valores de velocidad límite registrados en los apuntes:

| Sistema físico | $v_L$ |
|---|---|
| Paracaídas cerrado | $216 \text{ km/h}$ |
| Paracaídas abierto | $18 \text{ km/h}$ |
| Gota de lluvia ($r \approx 1{,}5 \text{ mm}$) | $25 \text{ km/h}$ |

> **Observación.** El fuerte contraste entre el paracaídas cerrado ($216 \text{ km/h}$) y
> abierto ($18 \text{ km/h}$) muestra el efecto de la constante $b$: al abrirse, aumenta el
> área y con ella $b$, lo que baja drásticamente la velocidad límite.

---

## Ver también

- [[01-leyes-de-newton-vinculos-poleas]] — la segunda ley de la que sale la condición $a = 0$
- [[02-rozamiento]] — otra fuerza de contacto, pero independiente de la velocidad
- [[index]] — índice del vault
