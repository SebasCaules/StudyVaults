---
tags: [teoria, unidad-6, campo-magnetico, biot-savart, ley-de-ampere]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Ley de Biot-Savart y ley de Ampère

Mientras la [[01-fuerza-magnetica|fuerza magnética]] describe cómo el campo actúa sobre las
corrientes, la ley de Biot-Savart y la ley de Ampère describen lo inverso: **cómo las
corrientes generan** el campo $\vec{B}$. Biot-Savart integra la contribución de cada
elemento de corriente; Ampère explota la simetría para resolver casos con integrales de
línea directas.

## Ley de Biot-Savart

Cada elemento de un conductor con corriente aporta un pequeño campo $d\vec{B}$ en el punto de
observación. La contribución es perpendicular tanto al elemento de corriente como a la
dirección hacia el punto, y decae con el cuadrado de la distancia.

> **Ley de Biot-Savart.** El campo que aporta un elemento $I\,d\vec{s}$ en un punto ubicado a
> distancia $r$ en la dirección del versor $\hat{r}$ es
> $$d\vec{B} = \frac{\mu_0}{4\pi}\,\frac{I\,d\vec{s} \times \hat{r}}{r^2}$$
> donde $I$ es la corriente, $d\vec{s}$ el elemento de longitud orientado según la corriente,
> $\hat{r}$ el versor desde el elemento hacia el punto y $\mu_0$ la permeabilidad del vacío.

La constante $\mu_0$ es la permeabilidad del espacio vacío:

$$\mu_0 = 4\pi \times 10^{-7}\ \frac{\mathrm{T}\cdot\mathrm{m}}{\mathrm{A}}$$

## Campo de un conductor recto finito

Integrando Biot-Savart a lo largo de una barra recta, con $d$ la distancia perpendicular del
punto al hilo, el campo queda en función de los ángulos que subtienden los extremos:

$$\vec{B} = \frac{\mu_0 I}{4\pi d}\,(\sin\theta_1 - \sin\theta_2)\,\hat{k}$$

donde $d$ es la distancia perpendicular del punto al hilo, $\theta_1$ y $\theta_2$ los
ángulos a los extremos del tramo y $\hat{k}$ la dirección perpendicular al plano (que sale de
$d\vec{s}\times\hat{r}$). De esta fórmula general salen los casos particulares de abajo, que
sólo difieren en cómo se miden los ángulos según dónde esté el punto.

## Casos de aplicación

Según la posición del punto respecto de la barra (con $\beta_i$ los ángulos a los extremos y
$d$ la distancia perpendicular), la fórmula se especializa:

| Caso | Geometría | Campo en el punto $P$ |
|---|---|---|
| 1.º | Barra finita, $P$ enfrentado a un tramo a ambos lados | $B_P = \dfrac{\mu_0 i}{4\pi d}\,(\sin\beta_1 + \sin\beta_2)$ |
| 2.º | Barra finita, $P$ frente a un extremo | $B_P = \dfrac{\mu_0 i}{4\pi d}\,\sin\beta_1$ |
| 3.º | Barra finita, ambos ángulos del mismo lado | $B_P = \dfrac{\mu_0 I}{4\pi d}\,(\sin\beta_1 - \sin\beta_2)$ |
| 4.º | Hilo semi-infinito, $P$ frente al extremo | $B_P = \dfrac{\mu_0 I}{4\pi d}$ |
| 5.º | Hilo infinito | $B_P = \dfrac{\mu_0 I}{2\pi d}$ |

El caso del hilo infinito, $B = \mu_0 I / (2\pi d)$, es el más usado: las líneas de campo son
circunferencias concéntricas al conductor.

## Campo de un anillo de corriente

Para un anillo de radio $a$ recorrido por una corriente $I$, el campo sobre su eje a una
distancia $b$ del centro se obtiene integrando la componente axial de $d\vec{B}$ (las
componentes radiales se cancelan por simetría):

$$B_y = \frac{\mu_0 I\,a^2}{2\,(a^2 + b^2)^{3/2}}$$

donde $a$ es el radio del anillo, $b$ la distancia del punto al centro medida sobre el eje e
$I$ la corriente. Dos casos particulares:

i) **En el centro del anillo** ($b = 0$):
   $$B_P = \frac{\mu_0 I}{2a}$$
ii) **Medio anillo** (semicircunferencia), en su centro:
   $$B_P = \frac{\mu_0 I}{4a}$$

## Ley de Ampère

Cuando la corriente tiene simetría suficiente, conviene evitar la integral de Biot-Savart y
usar la ley de Ampère, que relaciona la circulación de $\vec{B}$ sobre una curva cerrada con
la corriente que ésta encierra.

> **Ley de Ampère.** La circulación de $\vec{B}$ sobre una curva cerrada (amperiana) es
> $$\oint \vec{B} \cdot d\vec{s} = \mu_0\,I$$
> donde $I$ es la corriente total encerrada por la curva y la integral recorre toda la curva.
> Es útil cuando la simetría permite sacar $B$ de la integral.

### Campo de un solenoide

Un solenoide largo tiene campo uniforme adentro y despreciable afuera. Tomando una amperiana
rectangular con un lado de longitud $\ell$ dentro del solenoide, sólo ese lado contribuye a
la circulación, mientras la corriente encerrada es $N\,I$ (las $N$ espiras que atraviesa el
rectángulo):

$$\oint \vec{B} \cdot d\vec{s} = B\,\ell = \mu_0\,N\,I \;\Longrightarrow\; B = \mu_0\,\frac{N}{\ell}\,I = \mu_0\,n\,I$$

donde $N$ es el número de espiras encerradas, $\ell$ la longitud del tramo y $n = N/\ell$ el
número de vueltas por unidad de longitud.

> **Ejemplo.** El campo dentro de un solenoide se obtiene directo de Ampère: como afuera el
> campo es nulo y los lados perpendiculares no aportan, $\oint\vec{B}\cdot d\vec{s} = B\ell$,
> y con la corriente encerrada $N I$ queda $B = \mu_0 N I/\ell$. La misma idea, aplicada a un
> **toroide** de $N$ vueltas, da $B = \mu_0 N I/(2\pi r)$ dentro del núcleo.

## Fuerza entre dos conductores paralelos

Cada conductor genera un campo que actúa sobre el otro. El campo del conductor 2 en la
posición del conductor 1 es $B_2 = \mu_0 I_2 / (2\pi d)$, y sobre un tramo $\ell$ del
conductor 1 ejerce una fuerza $F_1 = I_1\,\ell\,B_2$. Combinando:

$$\frac{F_B}{\ell} = \frac{\mu_0\,I_1\,I_2}{2\pi d}$$

donde $I_1$, $I_2$ son las corrientes, $d$ la separación entre los conductores y $F_B/\ell$
la fuerza por unidad de longitud. Corrientes en el mismo sentido se atraen; en sentidos
opuestos, se repelen.

---

## Ver también

- [[01-fuerza-magnetica]] — la fuerza sobre corrientes, que acá aparece entre conductores paralelos
- [[02-torque-sobre-espira]] — la espira de corriente, fuente del campo tipo anillo
- [[02-gauss/01-flujo-y-ley-de-gauss]] — la ley integral análoga para el campo eléctrico
