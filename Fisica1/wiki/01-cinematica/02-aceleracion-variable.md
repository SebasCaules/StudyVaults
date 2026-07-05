---
tags: [teoria, unidad-1, cinematica, aceleracion-variable, integracion]
fuente: raw/2-Practicas/apuntes-cursada-2023-2c.pdf
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Aceleración variable: $a(t)$, $a(v)$ y $a(x)$

Cuando la aceleración no es constante ya no valen las ecuaciones del
[[01-cinematica-1d|MRUV]]: hay que volver a las definiciones diferenciales e integrar según de
qué dependa $a$. El truco recurrente es **elegir la forma de la derivada que separa las
variables correctas**. Se distinguen tres casos.

## Caso $a = a(t)$

La aceleración depende del tiempo. Partiendo de $a(t) = \dfrac{dv}{dt}$ se integra directamente
para obtener la velocidad, y luego $v = \dfrac{dx}{dt}$ da la posición.

Ecuación de velocidad en función del tiempo:

$$v(t) = v_0 + \int_{t_0}^{t} a\,dt$$

Ecuación horaria (doble integración):

$$x(t) = x_0 + v_0\,(t - t_0) + \int_{t_0}^{t}\!\!\int_{t_0}^{t} a\,dt$$

donde $x_0$, $v_0$ son las condiciones iniciales y $a = a(t)$.

> **Ejemplo (Guía 1, ej. 1.7).** Con $a(t) = A - 6t^2$ y $A = 32\ \tfrac{\text{m}}{\text{s}^2}$,
> integrando queda $v = 32\,t - 2t^3$ (con $v_0 = 0$). La velocidad se anula en
> $32\,t - 2t^3 = 0 \Rightarrow t\,(32 - 2t^2) = 0 \Rightarrow t = 4\ \text{s}$. La posición es
> $x = 8 + 16\,t^2 - \tfrac12 t^4$, con $x(4\,\text{s}) = 136\ \text{m}$ y
> $x(5\,\text{s}) = 95{,}5\ \text{m}$; el retorno en $t = 4\ \text{s}$ hace que la distancia
> recorrida ($\approx 128\ \text{m}$) supere al desplazamiento.

## Caso $a = a(v)$

La aceleración depende de la velocidad. Conviene despejar $dt = \dfrac{dv}{a(v)}$ e integrar
para obtener el **tiempo en función de la velocidad**:

$$t(v) = t_0 + \int_{v_0}^{v} \frac{1}{a(v)}\,dv$$

> **Ejemplo (Guía 1, ej. 1.8).** Con $a = -0{,}004\ \text{m}^{-1}\,v^2$ (frenado tipo arrastre),
> $\displaystyle \int_0^t -0{,}004\,dt = \int_{v_0}^{v} \frac{1}{v^2}\,dv$ da
> $t(v) = \dfrac{\frac{1}{v} - \frac{1}{v_0}}{0{,}004}$. Reinvirtiendo se obtiene $v(t)$ y, de
> $v = \dfrac{dx}{dt}$, la posición recorrida (del orden de $x \approx 520\ \text{m}$).

## Caso $a = a(x)$

La aceleración depende de la posición. Se usa la regla de la cadena para eliminar el tiempo:

$$a = \frac{dv}{dt} = \frac{dv}{dx}\frac{dx}{dt} = v\,\frac{dv}{dx}$$

de donde $a(x)\,dx = v\,dv$. Integrando queda la relación velocidad–posición (generalización de
la tercera ecuación del MRUV):

$$v^2 = v_0^2 + 2\int_{x_0}^{x} a(x)\,dx$$

> **Ejemplo (Guía 1, ej. 1.9).** Con $a = 2\,\text{s}^{-2}\,x$, $v_0 = 0$, $x_0 = 1\ \text{m}$,
> se integra $\int_{x_0}^{x} 2x\,dx = \tfrac12(v^2 - v_0^2)$, es decir
> $v = \sqrt{v_0^2 + 2\,(x^2 - x_0^2)}$. En $x = 3\ \text{m}$ da $v = 4\ \tfrac{\text{m}}{\text{s}}$.

## Velocidad límite

Un caso típico de $a(v)$ es la fuerza de arrastre lineal $a = -k\,v$, que produce un decaimiento
exponencial de la velocidad. Integrando $-k = \dfrac{1}{v}\dfrac{dv}{dt}$:

$$v(t) = v_0\,e^{-k(t - t_0)}, \qquad x(t) = \frac{v_0}{k}\bigl(1 - e^{-kt}\bigr)$$

donde $k > 0$ es el coeficiente de arrastre. La velocidad tiende a cero y la posición a la
asíntota $x_\infty = v_0/k$ cuando $t \to \infty$ (Guía 1, ej. 1.13).

> **Observación.** El comportamiento asintótico se lee tomando el límite de $v(x)$ o $v(t)$
> cuando $x \to \infty$ o $t \to \infty$: es la **velocidad límite**, alcanzada cuando la
> aceleración se anula. En los ejercicios con $a(v)$ que combinan gravedad y arrastre (p. ej.
> $a = 0{,}9\,g - c\,v$, ej. 1.11) la velocidad límite es la que hace $a = 0$.

---

## Ver también

- [[01-cinematica-1d]] — definiciones de $v$, $a$ y ecuaciones del MRUV
- [[03-tiro-oblicuo]] — otro uso de las ecuaciones horarias, ahora en dos ejes
- [[04-movimiento-circular-relativo]] — $a_t$ también puede ser $f(t)$, $f(x)$ o $f(v)$
