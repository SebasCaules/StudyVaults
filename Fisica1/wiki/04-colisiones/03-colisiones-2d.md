---
tags: [teoria, unidad-4, colisiones, colisiones-2d, conservacion]
fuentes:
  - raw/teoricas/apuntes-2023-2c.pdf
  - raw/practicas/guia-04-cantidad-movimiento.pdf
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Colisiones en dos dimensiones

En un choque en el plano, la cantidad de movimiento se conserva **por cada componente** por
separado. Esta página extiende las [[04-colisiones/02-colisiones-1d|colisiones 1D]] a 2D y muestra
el conteo de incógnitas frente a ecuaciones según el tipo de choque.

## Conservación por componentes

La cantidad de movimiento es un vector: en el plano tiene dos componentes, $x$ e $y$, y cada una se
conserva de forma independiente. La energía cinética, en cambio, es un escalar: no tiene componentes.

### Choque elástico en 2D

Se plantean tres ecuaciones: conservación de $\vec{p}$ en $x$, en $y$, y conservación de la energía
cinética $K$.

$$\text{(P}_x\text{)} \quad m_1 v_{1x} + m_2 v_{2x} = m_1 v_{1x}' + m_2 v_{2x}'$$

$$\text{(P}_y\text{)} \quad m_1 v_{1y} + m_2 v_{2y} = m_1 v_{1y}' + m_2 v_{2y}'$$

$$\text{(K)} \quad \tfrac{1}{2} m_1 v_1^2 + \tfrac{1}{2} m_2 v_2^2 = \tfrac{1}{2} m_1 v_1'^2 + \tfrac{1}{2} m_2 v_2'^2$$

donde $v_{ix}, v_{iy}$ son las componentes de la velocidad de cada cuerpo. Los módulos post-choque
se recomponen de sus componentes:

$$v_1'^2 = v_{1x}'^2 + v_{1y}'^2, \qquad v_2'^2 = v_{2x}'^2 + v_{2y}'^2$$

> **Observación.** Hay **4 incógnitas** (las dos componentes de cada velocidad final) y sólo
> **3 ecuaciones**. El problema no cierra por sí solo: algún dato adicional (un ángulo, una rapidez)
> debe darse en el enunciado.

### Choque inelástico en 2D

Idéntico al elástico pero **sin** la conservación de la energía cinética. Quedan **4 incógnitas** y
sólo **2 ecuaciones** ($\text{P}_x$ y $\text{P}_y$), de modo que hacen falta **2 datos** adicionales.

### Choque totalmente inelástico (plástico) en 2D

Los cuerpos quedan pegados y salen con una velocidad común $\vec{v}'$. Las dos ecuaciones de
componentes bastan para despejarla:

$$\text{(P}_x\text{)} \quad m_1 v_{1x} + m_2 v_{2x} = (m_1 + m_2)\,v_x'$$

$$\text{(P}_y\text{)} \quad m_1 v_{1y} + m_2 v_{2y} = (m_1 + m_2)\,v_y'$$

Este caso tiene **solución directa**: con dos ecuaciones se obtienen las dos componentes de la
velocidad común.

## Ejemplos de la guía

### Choque elástico: partícula contra blanco en reposo

Una partícula de masa $m$ y velocidad $3v_0$ choca elásticamente contra una masa $2m$ en reposo.
Tras el choque, la primera sale con rapidez $\sqrt{5}\,v_0$ a un ángulo $\arctan(2)$ sobre la
horizontal, y la segunda con rapidez $v_2$ a un ángulo $\theta_2$ por debajo. Planteando las
componentes (con $\cos(\arctan 2) = \tfrac{1}{\sqrt5}$ y $\sin(\arctan 2) = \tfrac{2}{\sqrt5}$):

$$\text{(P}_x\text{)} \quad 3 m v_0 = m\,\sqrt{5}\,v_0 \cos(\arctan 2) + 2 m\,v_2 \cos\theta_2 \;\Rightarrow\; 2 v_0 = 2 v_2 \cos\theta_2 \quad \text{(1)}$$

$$\text{(P}_y\text{)} \quad 0 = m\,\sqrt{5}\,v_0 \sin(\arctan 2) - 2 m\,v_2 \sin\theta_2 \;\Rightarrow\; 2 v_0 = 2 v_2 \sin\theta_2 \quad \text{(2)}$$

Dividiendo (2) por (1) se cancela $v_2$ y queda $1 = \tan\theta_2$, de donde

$$\theta_2 = 45^\circ \qquad\Rightarrow\qquad v_2 = \sqrt{2}\,v_0$$

La energía cinética inicial es $K_i = \tfrac{1}{2} m (3 v_0)^2 = \tfrac{9}{2} m v_0^2$.

### Choque plástico: hallar la velocidad incidente

Dos cuerpos de $m_1 = 8\ \text{kg}$ y $m_2 = 5\ \text{kg}$ chocan y quedan pegados, saliendo con
velocidad común $v' = 2\ \text{m/s}$ horizontal. La masa $m_2$ incide con $v_2 = 2\ \text{m/s}$ a
$30^\circ$. Como se conserva la cantidad de movimiento, por componentes:

$$\text{(P}_x\text{)} \quad m_1 v_{1x} + m_2 v_2 \cos 30^\circ = (m_1 + m_2)\,v' \;\Rightarrow\; v_{1x} = 2{,}1675\ \text{m/s}$$

$$\text{(P}_y\text{)} \quad m_1 v_{1y} + m_2 v_2 \sin 30^\circ = 0 \;\Rightarrow\; v_{1y} = -0{,}625\ \text{m/s}$$

El módulo de la velocidad incidente resulta $v_1 = \sqrt{v_{1x}^2 + v_{1y}^2}$, con
$v_1^2 \approx 5{,}089\ \text{m}^2/\text{s}^2$. La variación de energía cinética confirma que es
inelástico:

$$K_i = \tfrac{1}{2} m_1 v_1^2 + \tfrac{1}{2} m_2 v_2^2 = 30{,}356\ \text{J}, \qquad K_f = \tfrac{1}{2}(m_1 + m_2)\,v'^2 = 26\ \text{J}$$

$$\Delta K = K_f - K_i = -4{,}356\ \text{J} \quad (\text{el sistema pierde energía})$$

**Observación.** El signo negativo de $\Delta K$ es la marca del choque inelástico: parte de la
energía cinética se disipa en la deformación de los cuerpos que quedan pegados.

---

## Ver también

- [[04-colisiones/02-colisiones-1d]] — el caso 1D y el coeficiente de restitución
- [[04-colisiones/01-impulso-cantidad-movimiento]] — conservación de $\vec{p}$ y centro de masa
