---
tags: [teoria, unidad-5, ondas-estacionarias, superposicion, nodos, antinodos]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica + práctica)
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Onda estacionaria: formación, nodos y antinodos

Una **onda estacionaria** es el patrón que resulta de superponer dos ondas armónicas de igual
frecuencia y amplitud que viajan en sentidos opuestos, como ocurre cuando una onda propagante
incide sobre un extremo de la cuerda y se refleja. A diferencia de una onda viajera, la onda
estacionaria no se desplaza: cada elemento de la cuerda oscila en su lugar con la misma
frecuencia pero con una amplitud que depende de su posición.

## De la reflexión a la superposición

Cuando una onda armónica propagante llega a un extremo de la cuerda, se refleja y la onda
reflejada se superpone con la incidente. Se toman entonces dos ondas armónicas de igual
frecuencia y amplitud propagándose en sentidos opuestos:

$$\psi_1(x,t) = A'\cos(kx - \omega t + \varphi_1) \qquad \text{(hacia la derecha)}$$
$$\psi_2(x,t) = A'\cos(kx + \omega t + \varphi_2) \qquad \text{(hacia la izquierda)}$$

donde $A'$ es la amplitud de cada onda componente, $k = 2\pi/\lambda$ el número de onda,
$\omega$ la frecuencia angular y $\varphi_1, \varphi_2$ las fases iniciales de cada una.

Por el **principio de superposición lineal**, la suma $\psi = \psi_1 + \psi_2$ también es
solución de la ecuación de ondas. Aplicando la identidad trigonométrica

$$\cos\phi_1 + \cos\phi_2 = 2\cos\!\left(\frac{\phi_1 + \phi_2}{2}\right)\cos\!\left(\frac{\phi_2 - \phi_1}{2}\right)$$

con $\phi_1 = kx - \omega t + \varphi_1$ y $\phi_2 = kx + \omega t + \varphi_2$, la suma se
factoriza en una parte espacial y una temporal.

## Forma general de la onda estacionaria

> **Onda estacionaria.** El patrón resultante se escribe como el producto de una función solo
> de $x$ por una función solo de $t$:
> $$\psi(x,t) = A\cos(kx + \varphi_x)\,\cos(\omega t + \varphi_t)$$
> es decir $\psi(x,t) = A(x)\,f(t)$, con $A(x) = A\cos(kx + \varphi_x)$ la amplitud de oscilación
> de cada punto y $f(t) = \cos(\omega t + \varphi_t)$ el factor temporal común a toda la cuerda.

Identificando términos en la factorización, la amplitud del patrón es $A = 2A'$ y las fases
espacial y temporal son

$$\varphi_x = \frac{\varphi_1 + \varphi_2}{2}, \qquad \varphi_t = \frac{\varphi_2 - \varphi_1}{2}$$

Dos rasgos distinguen a esta solución de una onda propagante:

i) **No es una onda propagante:** no aparece la combinación $kx \pm \omega t$; el argumento
   espacial y el temporal están separados en factores distintos.
ii) **Amplitud dependiente de la posición:** cada elemento de la cuerda oscila con la misma
   frecuencia $\omega$, pero con una amplitud $A(x) = A\cos(kx + \varphi_x)$ propia de su
   posición $x$.

## Nodos y antinodos

La estructura espacial fija dos tipos de puntos característicos, definidos por el factor
$\cos(kx + \varphi_x)$.

> **Nodos.** Puntos de **amplitud nula**: $\psi(x_N, t) = 0$ en todo instante. Se cumple cuando
> $$\cos(kx_N + \varphi_x) = 0 \;\Rightarrow\; kx_N + \varphi_x = \left(m + \tfrac{1}{2}\right)\pi, \qquad m \in \mathbb{Z}$$

> **Antinodos.** Puntos de **amplitud máxima**, donde $-A \leq \psi(x_A, t) \leq A$ con las cotas
> alcanzadas. Se cumple cuando
> $$\cos(kx_A + \varphi_x) = \pm 1 \;\Rightarrow\; kx_A + \varphi_x = m\pi, \qquad m \in \mathbb{Z}$$

Un nodo permanece quieto en todo momento; un antinodo es el punto que oscila con la mayor
amplitud posible, $A$. Entre dos nodos consecutivos hay siempre un antinodo, y la distancia
entre nodos vecinos es $\lambda/2$.

## Configuraciones instantáneas de la cuerda

De manera simétrica, el factor temporal $\cos(\omega t + \varphi_t)$ fija dos instantes
particulares en cada período de oscilación.

> **Cuerda horizontal.** Instante $t_H$ en que toda la cuerda pasa por la posición de reposo:
> $\psi(x, t_H) = 0$ para todo $x$. Ocurre cuando
> $$\cos(\omega t_H + \varphi_t) = 0 \;\Rightarrow\; \omega t_H + \varphi_t = \left(m + \tfrac{1}{2}\right)\pi, \qquad m \in \mathbb{Z}$$

> **Cuerda en máxima elongación.** Instante $t_m$ en que la cuerda alcanza su deformación
> máxima, con $-A \leq \psi(x, t_m) \leq A$. Ocurre cuando
> $$\cos(\omega t_m + \varphi_t) = \pm 1 \;\Rightarrow\; \omega t_m + \varphi_t = m\pi, \qquad m \in \mathbb{Z}$$

En el instante de máxima elongación la cuerda está momentáneamente en reposo (velocidad nula
en todos sus puntos); en el instante de cuerda horizontal, en cambio, cada punto pasa por su
posición de equilibrio con la máxima velocidad. Esta alternancia es la base del balance de
energía de la onda estacionaria (ver [[03-energia-onda-estacionaria]]).

---

## Ver también

- [[02-condiciones-de-borde]] — cómo los extremos de la cuerda seleccionan los modos normales
- [[03-energia-onda-estacionaria]] — densidad de energía, nodos/antinodos y potencia media nula
- [[01-mas/01-oscilador-armonico]] — el movimiento armónico simple que oscila cada punto de la cuerda
