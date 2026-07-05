---
tags: [teoria, unidad-6, optica-geometrica, reflexion-total-interna, angulo-critico, fibra-optica]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + práctica)
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Reflexión total interna

Cuando un rayo pasa de un medio a otro de **menor** índice de refracción se aleja de la normal
(ver [[01-reflexion-refraccion]]). Si el ángulo de incidencia crece lo suficiente, el rayo
refractado llega a rasar la superficie y, más allá de cierto ángulo, desaparece: toda la luz se
refleja hacia el medio de partida. Ese fenómeno es la **reflexión total interna** (TIR), y esta
página lo deriva y lo aplica a varios problemas típicos de la cursada.

## Ángulo crítico

La reflexión total interna solo puede ocurrir cuando la luz intenta pasar a un medio menos
denso, es decir $n_i > n_t$. El **ángulo crítico** es el ángulo de incidencia para el cual el
rayo refractado sale con $\theta_t = 90^\circ$ (rasa la interfaz).

> **Ángulo crítico.** Partiendo de la ley de Snell con $n_i > n_t$ y $\theta_t = 90^\circ$,
> $$n_i\,\sin\theta_c = n_t\,\sin 90^\circ = n_t \;\Rightarrow\; \sin\theta_c = \frac{n_t}{n_i}$$
> donde $n_i$ es el índice del medio de incidencia (el más denso), $n_t$ el del medio de
> transmisión (el menos denso) y $\theta_c$ el ángulo crítico.

> **Condición de reflexión total interna.** Si el ángulo de incidencia supera el crítico,
> $$\theta_i > \theta_c \;\Rightarrow\; \text{no hay refracción, hay reflexión total interna.}$$
> Todo el haz vuelve al medio incidente y no se transmite luz al segundo medio.

## Fibra óptica: ángulo de aceptación

La aplicación estrella de la TIR es la fibra óptica: un núcleo de índice $n$ recubierto por un
material de índice $n' < n$. Un rayo que entra por el extremo debe golpear la pared lateral con
un ángulo mayor al crítico para quedar **atrapado** por reflexión total y avanzar por el núcleo.

En un problema de la práctica, un haz incide desde aire sobre el punto medio del extremo de la
fibra formando un ángulo $\alpha$ con el eje, con $n = 1{,}5$ (núcleo) y $n' = 1{,}42$
(recubrimiento). El **ángulo de aceptación** $\alpha_{\max}$ (máximo $\alpha$ que aún produce
TIR en la pared) se obtiene encadenando dos condiciones:

1. Snell en la cara de entrada: $\;n_0\,\sin\alpha = n\,\sin\beta$, con $n_0 = 1$.
2. Geometría interna: el rayo llega a la pared lateral con $\theta = 90^\circ - \beta$, y la
   condición de TIR en la pared es $\sin\theta_c = n'/n$, que da $\theta_c = 71{,}203^\circ$.

Combinando ambas se despeja $\alpha_{\max} = \sin^{-1}\!\big(n\cos\theta_c\big) \approx 28{,}9^\circ$:
un rayo con $\alpha$ menor entra dentro del cono de aceptación y se propaga; uno con $\alpha$
mayor se escapa por el recubrimiento.

## Fuente sumergida: cono de luz que escapa

Cuando una fuente puntual está dentro del medio más denso, solo escapa la luz contenida en un
cono de semiángulo $\theta_c$ alrededor de la normal; el resto sufre reflexión total. En un
parcial, un **cubo** de arista $2{,}5$ cm y índice $n = 1{,}92$ está inmerso en un medio de
índice $n' = 1{,}2$, con un foco en su centro que irradia en todas direcciones. Cada cara solo
deja pasar la luz dentro de su cono crítico, iluminando un **círculo** en el centro (el resto de
la cara queda oscuro por TIR).

$$n\,\sin\theta_c = n'\,\sin 90^\circ \;\Rightarrow\; \theta_c = 38{,}68^\circ$$

Con el centro a $1{,}25$ cm de cada cara, el radio del círculo iluminado sale de
$\tan\theta_c = r/1{,}25 \Rightarrow r = 1$ cm, y el área total iluminada en el cubo es

$$6\ \text{caras} \times \pi r^{2} = 6\pi\ \text{cm}^{2}$$

## Rango de índice en un cubo

Un problema recíproco: un rayo incide con $60^\circ$ sobre la cara superior de un **cubo**
inmerso en aire, de material de índice $n$ desconocido. Se pide el rango de $n$ para que la luz
**salga** por la cara lateral (es decir, para que en la cara lateral **no** haya reflexión
total). Encadenando Snell en la entrada y la condición límite en la cara lateral,

$$1\cdot\sin 60^\circ = n\,\sin\alpha, \qquad \beta = 90^\circ - \alpha, \qquad n\,\sin\beta_c = 1,$$

se obtiene $\tan\beta_c = \tfrac{2\sqrt{3}}{3}$, $\beta_c = 49{,}1^\circ$ y
$n = \dfrac{\sin 60^\circ}{\cos\beta_c} = 1{,}323$. La luz emerge por la cara lateral mientras

$$1 < n < 1{,}323$$

## Espejo plano sumergido

La TIR también aparece combinada con un espejo. En otro parcial, un rayo láser incide
normalmente sobre la superficie de un líquido ($n = 1{,}346$); dentro del líquido hay un espejo
plano que forma un ángulo $\phi$ con el fondo. Se busca el $\phi$ **mínimo** para que el rayo
reflejado por el espejo sufra reflexión total en la interfaz líquido–aire. La geometría del
espejo inclinado da $\beta = 2\phi$, y la condición de TIR $n\,\sin(2\phi) = \sin 90^\circ$
conduce a

$$\phi = \frac{\sin^{-1}(1/n)}{2} \approx 24^\circ$$

---

## Ver también

- [[01-reflexion-refraccion]] — ley de Snell e índice de refracción, base del ángulo crítico
- [[03-dioptrios-esfericos]] — refracción en superficies curvas cuando **sí** hay transmisión
