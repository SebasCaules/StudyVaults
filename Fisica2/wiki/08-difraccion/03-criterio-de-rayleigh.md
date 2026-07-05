---
tags: [teoria, unidad-8, difraccion, criterio-de-rayleigh, resolucion]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen)
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Criterio de Rayleigh

La difracción pone un **límite físico a la resolución**: dos fuentes puntuales muy juntas
producen campanas de difracción que se solapan y, pasado cierto punto, dejan de verse como
dos. El **criterio de Rayleigh** fija cuándo dos fuentes están "justo" resueltas y de él sale
la mínima separación angular que un instrumento óptico puede distinguir.

## El problema de la resolución

Cada fuente puntual, al pasar por una abertura de ancho $a$, no da un punto sino la
[[01-rendija-simple|campana de difracción]] de ancho $\theta_D \approx 2\lambda/a$. Con dos
fuentes separadas un ángulo $\theta_0$, se dan tres situaciones:

| Situación | Descripción |
|---|---|
| No resueltos | Las campanas se solapan tanto que se ven como una sola mancha. |
| Exactamente resueltos | El máximo de una campana cae justo sobre el primer mínimo de la otra (criterio de Rayleigh). |
| Resueltos | Las campanas están bien separadas y se distinguen sin ambigüedad. |

> **Criterio de Rayleigh.** Dos fuentes están en el límite de la resolución cuando el
> **máximo principal** de una cae exactamente sobre el **primer mínimo** de difracción de la
> otra. La separación angular mínima resoluble es entonces el semiancho de la campana
> principal, $\theta_{\min}$.

## Separación angular mínima

El primer mínimo de la campana está en $\theta_1 \approx \lambda/a$ (la mitad del ancho
total $\theta_D = 2\lambda/a$). Ese semiángulo es justamente la separación mínima que exige
Rayleigh. El valor depende de la forma de la abertura:

> **Ángulo mínimo resoluble.**
> $$\theta_{\min} = \frac{\theta_D}{2} = \frac{\lambda}{a} \quad\text{(abertura rectangular / rendija plana)}$$
> $$\theta_{\min} = 1{,}22\,\frac{\lambda}{a} \quad\text{(abertura circular)}$$
> donde $a$ es el ancho de la rendija o el diámetro de la abertura circular, y $\lambda$ la
> longitud de onda.

El factor $1{,}22$ de la abertura circular sale de resolver la difracción en geometría
circular (el primer cero de la función correspondiente), y es el que aplica a lentes,
telescopios, pupilas y todo instrumento de abertura redonda.

**Observación.** Para mejorar la resolución (bajar $\theta_{\min}$) hay dos caminos:
agrandar la abertura $a$ o usar una longitud de onda $\lambda$ más corta. Es el motivo por
el que los telescopios tienen espejos enormes y los microscopios electrónicos superan a los
ópticos.

## Criterio de resolución

Dadas dos fuentes que subtienden un ángulo $\theta_0$ desde el instrumento, se comparan con
el mínimo resoluble:

$$\theta_0 > \theta_{\min} \Rightarrow \text{resueltos}, \qquad
\theta_0 < \theta_{\min} \Rightarrow \text{no resueltos}$$

Para fuentes a una distancia $s$ separadas una distancia transversal $\Delta y$, el ángulo
subtendido es, en aproximación paraxial, $\theta_0 \approx \dfrac{\Delta y}{s}$. La mínima
separación lineal resoluble a esa distancia es entonces

$$\Delta y_{\min} = s\,\theta_{\min}$$

### Ejemplo: resolución del ojo

Una persona observa dos fuentes a $s = 4\ \text{m}$ con una pupila de diámetro
$a = 2\ \text{mm}$. Como la pupila es circular, el ángulo mínimo resoluble es

$$\theta_{\min} = 1{,}22\,\frac{\lambda}{a}$$

Las dos fuentes se resuelven si el ángulo que subtienden supera $\theta_{\min}$; equivale a
pedir que su separación real cumpla $\Delta y > s\,\theta_{\min} = 1{,}22\,\dfrac{\lambda\,s}{a}$.
Con $\theta_0 = \Delta y / s$, la condición $\theta_0 > \theta_{\min}$ dice si las fuentes se
ven separadas o como una sola.

> **Nota.** En el apunte original este ejemplo aparece como cálculo numérico de $\Delta y$;
> el enunciado exacto (el valor de $\lambda$ y la separación objetivo de las fuentes) *está
> parcialmente ilegible en el original*, por lo que acá se transcribe el planteo y las
> fórmulas, no el número final.

## Relación con las redes

El mismo criterio, aplicado a los máximos de una [[02-redes-de-difraccion|red de difracción]],
da la mínima diferencia de longitud de onda resoluble $\Delta\lambda_{\min} = \lambda/(mN)$
y el poder de resolución $R = \lambda/\Delta\lambda = mN$. Es la versión "cromática" de
Rayleigh: en vez de separar dos fuentes en el espacio, separa dos colores en el espectro.

---

## Ver también

- [[01-rendija-simple]] — la campana de difracción cuyo semiancho $\lambda/a$ fija $\theta_{\min}$
- [[02-redes-de-difraccion]] — el criterio aplicado a colores: poder de resolución $R = mN$
