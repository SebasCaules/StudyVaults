---
tags: [teoria, unidad-7, colisiones, barra-pivote, restitucion]
fuente: raw/teoricas/fisica1-2023-2c.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Colisiones contra una barra con pivote

El problema modelo de esta unidad es un **proyectil que choca contra una barra
articulada en un extremo** (pivote). El pivote ejerce sobre el sistema una fuerza
externa impulsiva durante el impacto, así que hay que elegir con cuidado qué
magnitud se conserva. Contenido transcripto de los apuntes de la cursada 2023-2C.

## Qué se conserva durante el choque

Para el sistema proyectil + barra, con el proyectil de masa $m$ que impacta a
distancia $d$ del pivote $O$, se analizan las tres conservaciones posibles:

| Magnitud | Condición | ¿Se conserva aquí? |
|---|---|---|
| Energía cinética $K$ | choque elástico | solo si el choque es elástico ($e=1$) |
| Cantidad de movimiento $\vec{p}$ | $\sum \vec{F}_{ext} = \vec{0}$ | **no**: el pivote aplica una fuerza externa impulsiva |
| Momento angular $\vec{L}_o$ | $\sum \vec{M}_{ext} = \vec{0}$ | **sí**, respecto del eje de rotación |

La clave es el momento angular: aunque la fuerza del pivote sea impulsiva, su línea
de acción **pasa por $O$**, de modo que su torque respecto de $O$ es nulo. Por eso
$\vec{L}_o$ se conserva aun cuando $\vec{p}$ no lo hace. La conservación de $L_o$
vale **solo respecto del eje de rotación** (el pivote).

El momento de inercia de la barra homogénea de masa $M$ y largo $\ell$ respecto de
un extremo se obtiene por Steiner:

$$I_o = \frac{M\ell^2}{12} + M\left(\frac{\ell}{2}\right)^2 = \frac{M\ell^2}{3}$$

## Choque plástico

En el choque plástico el proyectil **queda incrustado** en la barra a distancia
$d$; después del impacto ambos giran juntos con velocidad angular $\omega$, de modo
que la velocidad del proyectil es $v' = \omega d$.

Planteando conservación de $L_o$ (proyectil antes, proyectil + barra después):

$$m v_0\, d = m v'\, d + \frac{1}{3} M\ell^2\, \omega$$

donde $v_0$ es la velocidad incidente del proyectil. Sustituyendo $v' = \omega d$ se
agrupa todo el momento de inercia del sistema:

$$m v_0\, d = \left(m d^2 + \frac{1}{3} M\ell^2\right)\omega$$

El factor $I' = m d^2 + \tfrac{1}{3} M\ell^2$ es el momento de inercia del conjunto
barra + proyectil incrustado respecto del pivote. En un choque plástico **no** se
conservan ni $K$ ni $\vec{p}$.

## Choque elástico

En el choque elástico se conservan **a la vez** $L_o$ y $K$; el proyectil rebota
con velocidad $v'$ (que en general no es $\omega d$). Las dos ecuaciones son:

$$\frac{1}{2} m v_0^2 = \frac{1}{2} m v'^2 + \frac{1}{2}\cdot\frac{1}{3} M\ell^2\, \omega^2 \qquad\text{(energía)}$$

$$m v_0\, d = m v'\, d + \frac{1}{3} M\ell^2\, \omega \qquad\text{(momento angular)}$$

Para despejar conviene agrupar. De la ecuación de energía,

$$m\big(v_0^2 - v'^2\big) = \frac{1}{3} M\ell^2\, \omega^2 \;\Rightarrow\; m\,(v_0 - v')(v_0 + v') = \frac{1}{3} M\ell^2\, \omega^2$$

y de la de momento angular,

$$m\,(v_0 - v')\, d = \frac{1}{3} M\ell^2\, \omega$$

Dividiendo la primera por la segunda se cancela el factor $m(v_0 - v')$ y queda la
relación de velocidades del choque elástico contra la barra:

$$v_0 + v' = \omega d$$

## Coeficiente de restitución del cuerpo rígido

El coeficiente de restitución mide cuán elástico es el choque:

- $e = 0$ para el choque plástico,
- $e = 1$ para el choque elástico,
- $0 \leq e < 1$ para los choques inelásticos.

Se define a partir de las velocidades relativas antes y después:

$$e = -\frac{v_1' - v_2'}{v_1 - v_2}$$

> **Nota.** Para que esta expresión valga en un cuerpo rígido hay que tomar la
> velocidad del **punto de contacto** de la barra, que es $\omega d$ (velocidad del
> punto ubicado a distancia $d$ del pivote), no la velocidad angular ni la del
> centro de masa.

Con ese criterio se recuperan los dos casos límite. En el **choque plástico**, el
proyectil y el punto de contacto quedan con la misma velocidad $v' = \omega d$, así
que la velocidad relativa de separación es nula y $e = 0$. En el **choque
elástico**, de $v_0 + v' = \omega d$ se despeja $v_0 = \omega d - v'$, con lo cual

$$e = \frac{\omega d - v'}{v_0} = \frac{v_0}{v_0} = 1$$

---

## Ver también

- [[01-momento-angular]] — definición de $\vec{L}$, ley $\frac{d\vec{L}}{dt} = \vec{M}$ y conservación
- [[03-ejercicios-momento-angular]] — choques 7.3 (plástico) y 7.4 (elástico) resueltos paso a paso
