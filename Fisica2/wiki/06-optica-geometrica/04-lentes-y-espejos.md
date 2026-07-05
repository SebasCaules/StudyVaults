---
tags: [teoria, unidad-6, optica-geometrica, lente-delgada, espejo, aumento]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + práctica)
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Lentes y espejos

Una **lente delgada** es el resultado de encadenar dos dioptrios esféricos muy próximos (ver
[[03-dioptrios-esfericos]]); un **espejo** forma la imagen por reflexión en vez de refracción.
Esta página reúne la ecuación de la lente delgada y la del constructor de lentes, el aumento y
la distinción convergente/divergente, y la ecuación del espejo esférico, con un ejemplo resuelto
de la cursada.

## Lente delgada

Para una lente delgada rodeada por el mismo medio a ambos lados, las distancias objeto e imagen
se relacionan con la distancia focal imagen $f'$ por la ecuación de Gauss.

> **Ecuación de la lente delgada (Gauss).**
> $$\frac{1}{s'} - \frac{1}{s} = \frac{1}{f'}$$
> donde $s$ es la distancia objeto, $s'$ la distancia imagen y $f'$ la distancia focal imagen.
> Se usa la misma convención de signos que en el dioptrio: un objeto real (a la izquierda) tiene
> $s < 0$.

La distancia focal de la lente depende de los índices y de los radios de sus dos caras, a través
de la **ecuación del constructor de lentes**:

> **Ecuación del constructor de lentes.**
> $$\frac{1}{s'} - \frac{1}{s} = \left(\frac{n_2}{n_1} - 1\right)\left(\frac{1}{R_1} - \frac{1}{R_2}\right)$$
> donde $n_2$ es el índice de la lente, $n_1$ el del medio que la rodea, y $R_1$, $R_2$ los
> radios de curvatura de la primera y la segunda cara. El segundo miembro es $1/f'$: la lente
> queda caracterizada por su geometría y sus índices.

### Aumento y tipo de lente

> **Aumento de la lente.**
> $$A = \frac{s'}{s}$$
> Un $A < 0$ indica imagen invertida, y $|A| > 1$ imagen aumentada. Es el aumento del dioptrio
> $A = \tfrac{n s'}{n' s}$ particularizado a $n = n'$ (mismo medio a ambos lados).

Según el signo de la focal, la lente es **convergente** ($f' > 0$: concentra los rayos en un
foco real) o **divergente** ($f' < 0$: los abre como si salieran de un foco virtual).

### Ejemplo: lente convergente y objeto que se desplaza

En un problema resuelto de la cursada, un observador ve a través de una lente convergente una
imagen **cuatro veces más grande** que el objeto: $A = -4 = s'/s$, de donde $s' = -4s$. Metiendo
esto en la ecuación de Gauss,

$$\frac{1}{s'} - \frac{1}{s} = \frac{1}{-4s} - \frac{1}{s} = \frac{-5}{4s} = \frac{1}{f'}
\;\Rightarrow\; f' = -\frac{4s}{5}$$

Al **acercar el objeto** $3$ cm a la lente ya no se forma imagen en ningún lado (el objeto queda
en el foco). Con la condición geométrica $|s_1| = |s_2| + 3$ y una segunda aplicación de la
ecuación de Gauss se despeja la distancia focal imagen de la lente:

$$f' = 12\ \text{cm}$$

## Espejo esférico

Un espejo esférico forma la imagen por reflexión sobre una superficie curva. Su ecuación
relaciona objeto e imagen con el radio de curvatura, y su aumento lleva un signo opuesto al de
la lente:

> **Espejo esférico.**
> $$\frac{1}{s'} + \frac{1}{s} = \frac{2}{R}, \qquad A = -\frac{s'}{s}$$
> donde $s$ y $s'$ son las distancias objeto e imagen, $R$ el radio de curvatura y $A$ el
> aumento. La distancia focal es $f = R/2$: un espejo cóncavo enfoca en su foco los rayos que
> llegan paralelos (objeto en el infinito → imagen en el foco).

**Nota.** La ecuación del espejo esférico figura en el compendio de fórmulas de los apuntes de
la cursada 2024-2C; su desarrollo detallado no aparece transcripto en la teórica (que se
concentra en reflexión, refracción y dioptrios).

### Espejo plano

El espejo plano es el límite de radio infinito ($R \to \infty$): la imagen es **virtual,
derecha y del mismo tamaño**, ubicada simétricamente detrás del espejo. Es el que aparece, por
ejemplo, en el problema del [[02-reflexion-total-interna|espejo sumergido]], donde se usa solo
la ley de reflexión $\theta_i = -\theta_i'$ para redirigir el rayo hacia la interfaz.

---

## Ver también

- [[03-dioptrios-esfericos]] — la lente delgada es dos dioptrios en serie; comparten convención de signos
- [[01-reflexion-refraccion]] — ley de reflexión y de Snell, base de espejos y lentes
