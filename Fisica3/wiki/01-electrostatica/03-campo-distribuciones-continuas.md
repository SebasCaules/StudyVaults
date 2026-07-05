---
tags: [resuelto, unidad-1, electrostatica, campo-electrico, superposicion, integracion]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 1
tipo: resuelto
actualizado: 2026-07-05
---

# Campo eléctrico de distribuciones continuas

Esta página muestra cómo se calcula en la práctica el [[02-campo-electrico|campo eléctrico]]
de una distribución continua de carga: se plantea la contribución diferencial $d\vec{E}$ de
cada elemento, se elige la densidad según la geometría y se integra sobre la fuente. La
simetría y el principio de superposición hacen el resto.

## Método general

El campo diferencial de un elemento de carga $dq$ ubicado en $\vec{r}\,'$, medido en el
punto de campo $\vec{r}$, es

$$d\vec{E} = k_e\, dq\,\frac{\vec{r} - \vec{r}\,'}{\|\vec{r} - \vec{r}\,'\|^3}$$

donde $\vec{r}$ es el punto donde se calcula el campo (punto de campo) y $\vec{r}\,'$ la
posición del elemento fuente. Según la dimensión de la distribución, el elemento de carga es

$$dq = \lambda\, d\ell \quad (\text{lineal}), \qquad dq = \sigma\, dS \quad (\text{superficial}), \qquad dq = \rho\, dV \quad (\text{volumétrica})$$

con $\lambda$, $\sigma$ y $\rho$ las densidades lineal, superficial y volumétrica. El campo
total se obtiene integrando $d\vec{E}$ sobre toda la fuente.

## Barra finita: campo en la mediatriz

Se busca el campo de una barra de longitud $L$ con densidad lineal uniforme $\lambda$, en un
punto sobre su mediatriz a distancia $y$ del centro. Se ubica el origen en el **medio** de
la barra, sobre el eje $x$.

Cada elemento $dq$ aporta un campo de módulo $dE = k_e\,\dfrac{dq}{r^2}$, con
$r = \sqrt{x^2 + y^2}$. Por la simetría respecto de la mediatriz, las componentes
horizontales de elementos ubicados a $+x$ y $-x$ se cancelan de a pares: sólo sobrevive la
componente vertical.

$$dE_y = dE\,\cos\theta = k_e\,\frac{dq}{r^2}\,\cos\theta, \qquad \cos\theta = \frac{\text{cateto adyacente}}{\text{hipotenusa}} = \frac{y}{r}$$

donde $\theta$ es el ángulo entre $d\vec{E}$ y el eje $y$. Reemplazando $\cos\theta = y/r$:

$$dE_y = k_e\,\frac{dq}{r^2}\cdot\frac{y}{r} = k_e\,\frac{y\, dq}{r^3}$$

Aprovechando la simetría se integra sólo media barra y se multiplica por dos:

$$E_y = 2\int_0^{L/2} k_e\,\frac{y\, dq}{r^3} = 2\,k_e\, y \int_0^{L/2} \frac{dq}{r^3}$$

Con $\lambda = q/L$ constante, $dq = \lambda\, dx$ y $r = \sqrt{x^2 + y^2}$:

$$E_y = 2\,k_e\, y\,\lambda \int_0^{L/2} \frac{dx}{\left(x^2 + y^2\right)^{3/2}}$$

La integral se resuelve por la sustitución trigonométrica

$$x = y\,\tan\theta, \qquad dx = y\,\sec^2\theta\, d\theta$$

que lleva el integrando a la forma $\dfrac{1}{y^2 \sec^3\theta}\, y\,\sec^2\theta\, d\theta$,
integrable directamente.

> **Nota.** En los apuntes de la cursada la resolución continúa con esta sustitución
> trigonométrica pero el desarrollo final queda cortado; se transcribe el método y el
> planteo de la integral, sin cerrar el valor numérico final.

## Cuarto de arco: superposición de dos semiarcos

Este problema combina integración y **superposición**. Un arco de radio $R$ centrado en el
origen se divide en dos tramos con carga opuesta:

- un cuarto de arco con carga $+Q_0$, entre $\theta = \pi/2$ y $\theta = \pi$,
- un cuarto de arco con carga $-Q_0$, entre $\theta = \pi$ y $\theta = 3\pi/2$.

Se busca el campo en el centro $P$. El punto de campo es el origen, $\vec{r} = 0$, y el
punto fuente está sobre el arco, $\vec{r}\,' = R\,\hat{r}$ con
$\hat{r} = \cos\theta\,\hat{\imath} + \operatorname{sen}\theta\,\hat{\jmath}$.

Como cada tramo es homogéneo, su densidad lineal es la carga sobre la longitud del arco
($\ell = R\,\tfrac{\pi}{2}$):

$$\lambda_{+} = \frac{+Q_0}{\tfrac{\pi}{2}R} = \frac{2Q_0}{\pi R}, \qquad \lambda_{-} = -\frac{2Q_0}{\pi R}$$

Por superposición, el campo en $P$ es la suma de los dos tramos, con $d\ell = R\, d\theta$:

$$\vec{E}(P) = \vec{E}_{+}(P) + \vec{E}_{-}(P) = \int_{\pi/2}^{\pi} k_e\,\lambda_{+}\, R\, d\theta\,\frac{\vec{r} - \vec{r}\,'}{\|\vec{r} - \vec{r}\,'\|^3} + \int_{\pi}^{3\pi/2} k_e\,\lambda_{-}\, R\, d\theta\,\frac{\vec{r} - \vec{r}\,'}{\|\vec{r} - \vec{r}\,'\|^3}$$

Como $\|\vec{r} - \vec{r}\,'\| = R$ (todos los elementos están a distancia $R$ del centro) y
$\vec{r} - \vec{r}\,' = -R\,\hat{r}$, la integral angular se reduce a integrar $\hat{r}$:

$$\int \hat{r}\, d\theta = \int (\cos\theta\,\hat{\imath} + \operatorname{sen}\theta\,\hat{\jmath})\, d\theta$$

Evaluando ambos tramos, las componentes en $\hat{\imath}$ se cancelan y queda un campo
puramente vertical:

$$\vec{E}(P) = -\frac{4\,k_e\, Q_0}{\pi R^2}\,\hat{\jmath}$$

Usando $k_e = \dfrac{1}{4\pi\varepsilon_0}$ se obtiene la forma final:

$$\vec{E}(P) = \frac{Q_0}{\pi^2 \varepsilon_0\, R^2}\,(-\hat{\jmath})$$

es decir, el campo en el centro apunta en el sentido $-\hat{\jmath}$, coherente con que las
líneas de campo salen del tramo positivo (arriba a la izquierda) y entran al negativo
(abajo a la izquierda).

---

## Ver también

- [[02-campo-electrico]] — definición del campo y de las densidades de carga
- [[01-ley-de-coulomb]] — el principio de superposición que fundamenta estos cálculos
