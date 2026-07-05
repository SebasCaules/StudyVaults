---
tags: [teoria, unidad-4, corriente-electrica, ley-de-ohm, resistividad]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Corriente eléctrica y ley de Ohm

Cuando las cargas dejan de estar en equilibrio y se mueven de forma sostenida por un
conductor, aparece una **corriente eléctrica**. Esta página define la corriente y su
densidad, enuncia la ley de Ohm en sus formas microscópica y macroscópica, e introduce
la resistencia, la resistividad y la potencia disipada. Los circuitos que se arman con
estos elementos se tratan en [[02-circuitos-de-corriente-directa]].

## Corriente eléctrica

> **Definición.** La corriente eléctrica es la carga que atraviesa una sección del
> conductor por unidad de tiempo. Como corriente promedio en un intervalo $\Delta t$ y
> como corriente instantánea (en el límite $\Delta t \to 0$):
> $$I = \frac{\Delta Q}{\Delta t} \xrightarrow{\;\Delta t \to 0\;} \frac{dQ}{dt}$$

La unidad en el SI es el **ampere**, que resulta de carga sobre tiempo:

$$[I] = \frac{[\mathrm{C}]}{[\mathrm{s}]} = [\mathrm{A}]$$

**Sentido de la corriente.** Por convención, la corriente circula desde el punto de mayor
potencial hacia el de menor potencial, de modo que **coincide con la dirección del campo
eléctrico** dentro del conductor. Ese sentido es **opuesto** al movimiento real de los
electrones (que son las cargas móviles y tienen carga negativa).

### Modelo microscópico

Mirando los portadores de carga, la corriente promedio en un conductor de sección $A$ se
escribe en función de cuántos portadores hay y de qué tan rápido se desplazan:

$$I_{\text{prom}} = n\,q\,v_d\,A$$

donde $n$ es la densidad de portadores (portadores por unidad de volumen), $q$ la carga de
cada portador, $v_d$ la **velocidad de arrastre** (velocidad media de deriva) y $A$ el área
de la sección transversal. La velocidad de arrastre que impone un campo $\vec{E}$ es

$$\vec{v}_d = \frac{q\,\vec{E}}{m_e}\,\tau$$

donde $m_e$ es la masa del portador (electrón) y $\tau$ el tiempo medio entre colisiones.

## Densidad de corriente

Para describir cómo se reparte la corriente sobre la sección se usa la **densidad de
corriente** $\vec{J}$, un vector que apunta en el sentido de circulación y cuyo módulo es
corriente por unidad de área. La corriente total es el flujo de $\vec{J}$ a través de la
sección:

$$I = \iint_S \vec{J}\cdot d\vec{A}$$

donde $d\vec{A}$ es el elemento de área orientado según la normal a la sección. Si $\vec{J}$
es constante sobre toda la sección, sale de la integral y queda simplemente

$$I = J\,A$$

con $A$ el área de la sección transversal.

## Ley de Ohm

> **Ley de Ohm (forma microscópica).** En un material óhmico, la densidad de corriente es
> proporcional al campo eléctrico que la produce:
> $$\vec{J} = \sigma\,\vec{E}$$
> donde $\sigma$ es la **conductividad** del material.

De la forma microscópica se obtiene la forma macroscópica habitual. Partiendo de
$\vec{J} = \sigma\vec{E}$ y usando que $J = I/A$ y que en un tramo de longitud $\ell$ el
campo se relaciona con la diferencia de potencial por $E = \Delta V/\ell$:

$$\frac{I}{A} = \sigma\left(\frac{\Delta V}{\ell}\right) \;\Longrightarrow\; I\cdot\frac{\ell}{A\,\sigma} = \Delta V$$

El factor que multiplica a $I$ es la **resistencia** del tramo, con lo que se llega a la
forma que se usa en circuitos:

> **Ley de Ohm (forma macroscópica).**
> $$\Delta V = I\,R$$
> La diferencia de potencial entre los extremos de un resistor es el producto de la
> corriente por su resistencia.

## Resistencia, resistividad y conductividad

> **Definición.** La resistencia de un conductor cilíndrico de longitud $\ell$ y sección
> $A$ es
> $$R = \frac{\rho\,\ell}{A}$$
> donde $\rho$ es la **resistividad** del material. Su unidad es el ohm:
> $$[R] = \frac{[\mathrm{V}]}{[\mathrm{A}]} = \Omega$$

La resistividad $\rho$ y la conductividad $\sigma$ son propiedades del material, inversas
una de la otra:

$$\sigma = \frac{1}{\rho}$$

**Observación.** La resistencia crece con la longitud del conductor y disminuye al aumentar
la sección: cuanto más largo y fino, más se opone al paso de la corriente.

### Coeficiente de temperatura

La resistividad de un material depende de la temperatura. En un rango acotado la dependencia
es aproximadamente lineal:

$$\rho = \rho_0\left[1 + \alpha\,(t - t_0)\right]$$

donde $\rho_0$ es la resistividad a la temperatura de referencia $t_0$ (típicamente
$t_0 \approx 20\,^\circ\mathrm{C}$) y $\alpha$ es el **coeficiente de temperatura de la
resistividad**, definido a partir de la variación relativa:

$$\alpha = \frac{\Delta\rho/\rho_0}{\Delta t}$$

con $\Delta\rho = \rho - \rho_0$ y $\Delta t = t - t_0$. La misma dependencia lineal se
traslada a la resistencia, $R = R_0[1 + \alpha(t - t_0)]$.

## Potencia

Al circular corriente por un resistor se disipa energía en forma de calor. La potencia
entregada admite tres formas equivalentes, según qué variables se conozcan, combinando la
definición $P = I\,\Delta V$ con la ley de Ohm:

$$P = I\,\Delta V = I^2 R = \frac{(\Delta V)^2}{R}$$

donde $I$ es la corriente, $\Delta V$ la diferencia de potencial sobre el resistor y $R$ su
resistencia.

## Ejemplos resueltos

**Corriente a partir de la densidad (conductor cilíndrico).** Sea un conductor cilíndrico de
radio $R$ recorrido por una densidad de corriente axial.

i) **Densidad uniforme:** si $|\vec{J}| = \dfrac{25000}{\pi}\ \mathrm{A/m^2}$ es constante,
la corriente es densidad por área de la sección:
$$I = |\vec{J}|\,S = \frac{25000}{\pi}\,\pi R^2 = 25000\,R^2$$

ii) **Densidad no uniforme:** si $J = \dfrac{10^3}{r}\ \mathrm{A/m^2}$ depende de la distancia
$r$ al eje, hay que integrar sobre la sección con $d\vec{A} = r\,d\theta\,dr\,\hat{z}$:
$$I = \iint \frac{10^3}{r}\,r\,d\theta\,dr = 10^3\int_0^{R}\!\!\int_0^{2\pi} d\theta\,dr = 2\pi\,10^3\,R$$

**Resistor óhmico con dependencia térmica.** Un resistor de $R = 8\,\Omega$ sometido a
$\Delta V = 120\ \mathrm{V}$ conduce, por la ley de Ohm,
$$I = \frac{\Delta V}{R} = \frac{120}{8} = 15\ \mathrm{A}$$
Al elevar la temperatura, la resistencia aumenta según $R = R_0[1 + \alpha(t - t_0)]$ con
$R_0 = 8\,\Omega$ y $t_0 = 0\,^\circ\mathrm{C}$; en los apuntes se obtiene $R \approx 11{,}2\ \Omega$
a $100\,^\circ\mathrm{C}$. La potencia disipada se calcula luego con $P = I^2 R$.

---

## Ver también

- [[02-circuitos-de-corriente-directa]] — fem, resistencia interna y combinación de resistores
- [[03-leyes-de-kirchhoff]] — resolución de redes de resistores
- [[01-electrostatica/02-campo-electrico]] — el campo $\vec{E}$ que impulsa la corriente
