---
tags: [teoria, unidad-5, cuerpo-rigido, teorema-de-steiner, momento-de-inercia]
fuente: raw/teoricas/
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Teorema de Steiner (ejes paralelos)

Transcripción de la teórica de la cursada 2023-2C. Los momentos de inercia tabulados
(ver [[02-momento-de-inercia]]) están calculados para ejes que pasan por el **centro de masa**.
Cuando el eje de giro real es otro, paralelo al del CM, se usa el teorema de los ejes paralelos.

## Enunciado

> **Teorema (ejes paralelos, Steiner).** El momento de inercia respecto de un eje $z$ paralelo
> al que pasa por el centro de masa, separado de él una distancia $h$, es
> $$I_z = M h^2 + I_{cm}$$
> donde $M$ es la masa total del cuerpo, $h$ la distancia entre los dos ejes paralelos e
> $I_{cm}$ el momento de inercia respecto del eje que pasa por el centro de masa.

## Demostración

Se parte de la definición respecto del eje $z$ (que pasa por el origen $O$), con cada masa en
$(x_i, y_i)$ respecto de ese eje:

$$I_z = \sum_{i=1}^{n} m_i r_i^2 = \sum_{i=1}^{n} m_i \left(x_i^2 + y_i^2\right)$$

Se descompone la posición de cada masa como la del centro de masa más la posición relativa al
CM, $\vec r_i = \vec h + \vec r_i{\,}'$, es decir $x_i = x_{cm} + x_i'$ e $y_i = y_{cm} + y_i'$:

$$I_z = \sum_{i=1}^{n} m_i \left[(x_{cm} + x_i')^2 + (y_{cm} + y_i')^2\right]$$

Desarrollando los cuadrados aparecen tres grupos de términos:

$$I_z = \sum_{i=1}^{n} m_i \Big[\underbrace{(x_{cm}^2 + y_{cm}^2)}_{h^2}
+ \underbrace{(x_i'^2 + y_i'^2)}_{r_i'^2}
+ 2(x_{cm} x_i' + y_{cm} y_i')\Big]$$

El primer grupo da $M h^2$; el segundo da $I_{cm}$. El tercero se anula: tomando el origen del
sistema primado en el centro de masa,

$$2 x_{cm} \sum_{i=1}^{n} m_i x_i' = 2 x_{cm}\, M\, x_{cm}' = 0
\quad\text{porque}\quad x_{cm}' = 0$$

y análogamente el término en $y$. Por la definición de centro de masa, la posición del CM
medida desde el propio CM es nula. Quedan solo los dos primeros grupos:

$$\boxed{\,I_z = M h^2 + I_{cm}\,}$$

## Ejemplo: barra delgada

Para la barra homogénea, $I_{cm} = \tfrac{1}{12} M L^2$. Su momento de inercia respecto de un eje
por un **extremo** (paralelo al del centro, a distancia $h = L/2$) sale directo del teorema:

$$I_o = I_{cm} + M\!\left(\frac{L}{2}\right)^2 = \tfrac{1}{12} M L^2 + \tfrac14 M L^2 = \tfrac13 M L^2$$

que coincide con el cálculo por integración del [[02-momento-de-inercia|momento de inercia]], y
confirma $I_o = 4\, I_{cm}$.

> **Observación.** Como el término $M h^2$ es siempre positivo, el eje que pasa por el centro de
> masa es el de **menor** momento de inercia entre todos sus paralelos.

---

## Ver también

- [[02-momento-de-inercia]] — definición, ejemplos y tabla de $I_{cm}$
- [[04-dinamica-de-rotacion]] — dónde entra $I$ al calcular $M = I\alpha$
