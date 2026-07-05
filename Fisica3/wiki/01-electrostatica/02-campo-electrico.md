---
tags: [teoria, unidad-1, electrostatica, campo-electrico, superposicion, densidad-de-carga]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 1
tipo: teoria
actualizado: 2026-07-05
---

# Campo eléctrico

El campo eléctrico describe la influencia que una configuración de carga ejerce sobre el
espacio que la rodea, independientemente de la carga de prueba que se coloque. Se define a
partir de la [[01-ley-de-coulomb|fuerza de Coulomb]] y hereda de ella el principio de
superposición.

## Definición por carga testigo

Se coloca una **carga testigo** $q_0$ en el punto de interés y se mide la fuerza
$\vec{F}_{q_0}$ que la configuración ejerce sobre ella. El campo eléctrico es la fuerza por
unidad de carga, en el límite en que la carga testigo no perturba la fuente.

> **Definición.** El campo eléctrico en el punto $\vec{r}$ es
> $$\vec{E}(\vec{r}) = \lim_{q_0 \to 0} \frac{\vec{F}_{q_0}(\vec{r})}{q_0}$$
> donde $\vec{F}_{q_0}$ es la fuerza sobre la carga testigo $q_0$. El límite $q_0 \to 0$
> asegura que la testigo no altere la distribución de carga que genera el campo.

Conocido el campo, la fuerza sobre una carga $q$ cualquiera colocada en ese punto es
$\vec{F} = q\,\vec{E}$.

## Campo de una carga puntual

Sustituyendo la fuerza de Coulomb en la definición, el campo de una carga puntual $q$ a
distancia $r$ es radial:

> **Campo de una carga puntual.** A distancia $r$ de una carga $q$,
> $$\vec{E}(\vec{r}) = \frac{k_e\, q}{r^2}\,\hat{r}, \qquad |\vec{E}| = \frac{k_e\, q}{r^2}$$
> donde $\hat{r}$ es el versor radial con origen en la carga $q$ y $k_e = 1/(4\pi\varepsilon_0)$.
> El campo apunta hacia afuera si $q > 0$ y hacia adentro si $q < 0$.

## Superposición de cargas puntuales

El campo total de un conjunto de cargas es la suma vectorial de los campos individuales, del
mismo modo que las fuerzas se superponen.

> **Superposición (distribución discreta).** Para $n$ cargas $q_i$ ubicadas en $\vec{r}_i$,
> el campo en el punto $\vec{r}$ es
> $$\vec{E}(\vec{r}) = \sum_{i=1}^{n} \frac{k_e\, q_i}{\|\vec{r} - \vec{r}_i\|^2}\,\hat{r}_i(\vec{r}), \qquad \hat{r}_i(\vec{r}) = \frac{\vec{r} - \vec{r}_i}{\|\vec{r} - \vec{r}_i\|}$$
> donde $\vec{r} - \vec{r}_i$ es el vector que va de la carga $i$ al punto de campo y
> $\hat{r}_i$ su versor. Cada término es el campo de una carga puntual; se suman como vectores.

## Distribuciones continuas de carga

Cuando la carga está repartida de forma continua sobre un cuerpo, se divide la distribución
en elementos $\Delta q_i$ y se suman sus campos; al hacer tender $\Delta q \to 0$ la suma se
vuelve una integral sobre la región $R$.

> **Campo de una distribución continua.** Partiendo de la suma discreta $\vec{E}(\vec{r}) =
> \sum_i k_e\,\dfrac{\Delta q_i}{\|\vec{r} - \vec{r}_i\|^3}\,(\vec{r} - \vec{r}_i)$, en el
> límite $\Delta q \to 0$,
> $$\vec{E}(\vec{r}) = \int_{R} k_e\,\frac{\vec{r} - \vec{r}\,'}{\|\vec{r} - \vec{r}\,'\|^3}\,dq'$$
> donde $\vec{r}$ es el punto de campo, $\vec{r}\,'$ la posición del elemento fuente $dq'$, y
> el integrando es la contribución diferencial $d\vec{E}$ de cada elemento de carga.

### Densidades de carga

El elemento de carga $dq'$ se expresa según la dimensión de la distribución mediante una
densidad. Se distinguen tres casos:

| Caso | Densidad | Definición | Elemento de carga | Homogénea |
|---|---|---|---|---|
| Lineal (barra, alambre) | $\lambda$ | $\lambda = \dfrac{dq}{d\ell}$ | $dq = \lambda\, d\ell$ | $\lambda = \dfrac{q}{\ell}$ |
| Superficial | $\sigma$ | $\sigma = \dfrac{dq}{dS}$ | $dq = \sigma\, dS$ | $\sigma = \dfrac{q}{S}$ |
| Volumétrica | $\rho$ | $\rho = \dfrac{dq}{dV}$ | $dq = \rho\, dV$ | $\rho = \dfrac{q}{V}$ |

donde $\lambda$, $\sigma$ y $\rho$ son la carga por unidad de longitud, de área y de
volumen, respectivamente. Las expresiones de la última columna valen sólo cuando la densidad
es constante (distribución homogénea): en ese caso, integrar la densidad sobre toda la
extensión devuelve la carga total, por ejemplo $\int \lambda\, d\ell = q$.

**Observación.** La elección de la densidad correcta ($\lambda$, $\sigma$ o $\rho$) según la
geometría es el primer paso para plantear la integral de campo de una distribución continua.

---

## Ver también

- [[01-ley-de-coulomb]] — fuerza de Coulomb y superposición de la que deriva el campo
- [[03-campo-distribuciones-continuas]] — cómo se resuelve la integral de campo en casos concretos
