---
tags: [teoria, unidad-2, dinamica, movimiento-circular, peralte, rozamiento]
fuente: raw/teoricas/fisica1-dinamica.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Movimiento circular: curva sin y con peralte

Un auto que recorre una curva describe un movimiento circular, y por lo tanto necesita una
fuerza centrípeta dirigida hacia el centro. La segunda ley de Newton aplicada en coordenadas
intrínsecas (versor tangencial $\hat t$, normal $\hat n$ y binormal $\hat b$) permite hallar la
velocidad máxima con que puede tomarse la curva.

## Curva sin peralte

Se supone que el auto toma la curva con **movimiento circular uniforme (MCU)**: la rapidez es
constante, con lo cual la aceleración tangencial es nula y solo queda la centrípeta,

$$v = \text{cte} \;\Rightarrow\; a_t = \frac{dv}{dt} = 0 \;\Rightarrow\; a = a_n = \frac{v^2}{R}$$

donde $R$ es el radio de la curva. La única fuerza horizontal es el rozamiento $f_r$, que apunta
hacia el centro (según $\hat n$); en la vertical actúan la normal $N$ y el peso. Los DCL dan:

$$\hat n)\quad f_r = m\,\frac{v^2}{R}$$
$$\hat b)\quad N - m g = 0 \;\Rightarrow\; N = m g$$

Como el rozamiento no puede superar su valor máximo, $f_r \leq \mu_e N$, se reemplaza:

$$m\,\frac{v^2}{R} \leq \mu_e\,m g \;\Rightarrow\; \boxed{\;v \leq \sqrt{\mu_e\,g\,R}\;}$$

Esa es la **máxima rapidez** con que se puede tomar una curva plana sin derrapar.

> **Observación.** Si además hay aceleración tangencial ($a_t \neq 0$, el auto acelera o
> frena en la curva), la aceleración total tiene dos componentes,
> $$\vec a = a_t\,\hat t + a_n\,\hat n, \qquad a = \sqrt{a_t^2 + a_n^2}$$
> y la segunda ley $\sum \vec F = m\,\vec a$ se plantea con ambas.

## Curva con peralte

Al **peraltar** la curva (inclinarla un ángulo $\theta$), la normal $N$ deja de ser vertical y
aporta una componente hacia el centro. Se analiza también en MCU. Con la normal inclinada un
ángulo $\theta$, los DCL en las direcciones normal y vertical son:

$$\hat n)\quad f_r \cos\theta + N \sin\theta = m\,\frac{v^2}{R}$$
$$\hat b)\quad N \cos\theta - f_r \sin\theta - m g = 0$$

donde $\theta$ es el ángulo de peralte y $f_r$ el rozamiento sobre la superficie inclinada.

### Rapidez óptima

Existe una rapidez, que llamamos **óptima**, para la cual la fuerza de rozamiento vale cero: el
peralte por sí solo provee toda la fuerza centrípeta. Haciendo $f_r = 0$:

$$N \sin\theta = m\,\frac{v_{opt}^2}{R}, \qquad N \cos\theta = m g$$

Dividiendo miembro a miembro se elimina $N$ y queda

$$\boxed{\;v_{opt} = \sqrt{g\,R\,\tan\theta}\;}$$

A esa rapidez el auto no tiende a deslizar ni hacia adentro ni hacia afuera.

### Rapidez máxima

Para hallar la **máxima rapidez** antes de derrapar hacia afuera, se toma el rozamiento en su
valor límite $f_r = \mu_e N$ (apuntando hacia el centro). Las ecuaciones quedan

$$\mu_e N \cos\theta + N \sin\theta = m\,\frac{v_{\max}^2}{R}$$
$$N \cos\theta - \mu_e N \sin\theta = m g$$

y dividiendo:

$$\boxed{\;v_{\max} = \sqrt{R\,g\,\frac{\tan\theta + \mu_e}{1 - \mu_e\,\tan\theta}}\;}$$

> **Nota.** En los apuntes de la cursada este resultado también aparece resuelto con el
> coeficiente **cinético** $\mu_c$ en lugar de $\mu_e$ (por ejemplo, para calcular la rapidez
> máxima a la que un cuerpo puede tomar una curva peraltada). La estructura de la fórmula es la
> misma; cambia solo el coeficiente según se pida el umbral estático o la situación cinética.

---

## Ver también

- [[01-leyes-de-newton-vinculos-poleas]] — la segunda ley que se aplica aquí en coordenadas intrínsecas
- [[02-rozamiento]] — el rozamiento como fuerza centrípeta
- [[index]] — índice del vault
