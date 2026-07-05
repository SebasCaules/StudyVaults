---
tags: [teoria, unidad-7, induccion, ley-de-faraday, ley-de-lenz, fem-de-movimiento]
fuente: raw/resumenes/resumen-fisica-3.pdf
unidad: 7
tipo: teoria
actualizado: 2026-07-05
---

# Ley de inducción de Faraday y ley de Lenz

Un campo magnético que varía en el tiempo induce una fuerza electromotriz (fem) en
una espira. Esta página cubre la ley de Faraday, las distintas maneras de inducir
una fem, la fem de movimiento, la ley de Lenz (que fija el sentido de la corriente
inducida), la forma general de la ley y su aplicación a generadores. La parte de
inductancia y circuitos se desarrolla en [[07-induccion/02-circuitos-rl|circuitos RL]].

## Ley de Faraday

> **Ley de Faraday.** La fem inducida en una bobina de $N$ espiras es igual a menos
> la tasa de variación del flujo magnético a través de ella:
> $$\varepsilon = -N\,\frac{d\Phi_B}{dt}$$
> donde $\varepsilon$ es la fem inducida, $N$ el número de espiras y $\Phi_B$ el flujo
> magnético que atraviesa una espira.

El flujo magnético a través de la espira se define como la integral del campo por el
elemento de área orientado:

$$\Phi_B = \int \vec{B}\cdot d\vec{A}$$

donde $\vec{B}$ es el campo magnético y $d\vec{A}$ el vector elemento de área (normal a
la superficie encerrada por la espira).

### Maneras de inducir una fem

A partir de la ley de Faraday se ven las tres formas en que puede cambiar el flujo y,
por lo tanto, inducirse una fem:

- La **magnitud** de $\vec{B}$ varía respecto del tiempo.
- El **área** encerrada por la espira varía respecto del tiempo.
- El **ángulo** $\theta$ entre $\vec{B}$ y la normal de la espira varía respecto del tiempo.

## Fem de movimiento

Cuando un conductor se mueve dentro de un campo magnético, las cargas libres del
conductor sienten una fuerza magnética que las separa hasta que aparece un campo
eléctrico interno que la equilibra. Considerando una barra de largo $\ell$ que se mueve
con velocidad $v$ perpendicular a un campo $\vec{B}$:

En el equilibrio, la fuerza eléctrica sobre una carga compensa a la magnética:

$$\sum F = 0 \;\Rightarrow\; qE - qvB = 0 \;\Rightarrow\; E = vB$$

donde $q$ es la carga, $E$ el campo eléctrico interno, $v$ la velocidad de la barra y $B$
la magnitud del campo. Como la diferencia de potencial entre los extremos es $\Delta V = E\ell$,
se obtiene:

$$\Delta V = B\ell v$$

El mismo resultado sale de la ley de Faraday. El flujo que atraviesa el circuito formado
por la barra es $\Phi_B = B\ell x$, con $x$ la posición del conductor en movimiento. Entonces:

$$\varepsilon = -\frac{d(B\ell x)}{dt} = -\frac{dx}{dt}\,B\ell$$

y como $dx/dt = v$:

> **Fem de movimiento.** Para una barra de largo $\ell$ que se mueve con velocidad $v$
> perpendicular a un campo $\vec{B}$ uniforme,
> $$\varepsilon = -B\ell v$$

**Observación.** Cuando la velocidad no es perpendicular al campo, solo cuenta la
componente que atraviesa el área; la fem se reduce por el factor angular correspondiente
(ver los casos a distintos ángulos en [[07-induccion/03-problemas-induccion|los problemas]]).

## Ley de Lenz

La ley de Faraday da la magnitud de la fem; el signo menos lo interpreta la ley de Lenz,
que fija el **sentido** de la corriente inducida.

> **Ley de Lenz.** La corriente inducida en una espira circula en la dirección tal que el
> campo magnético que ella crea se opone al cambio del flujo magnético en el área encerrada
> por la espira.

Es decir, la corriente inducida siempre reacciona **oponiéndose** a la variación que la
produce: si el flujo aumenta, el campo inducido apunta en contra; si disminuye, apunta a
favor para sostenerlo. Es la manifestación de la conservación de la energía en la inducción.

## Forma general de la ley de Faraday

Un campo magnético variable genera un campo eléctrico inducido, aun sin conductor. La forma
general de la ley relaciona la circulación del campo eléctrico con la variación del flujo:

$$\oint \vec{E}\cdot d\vec{s} = -\frac{d\Phi_B}{dt}$$

donde el primer miembro es la circulación de $\vec{E}$ sobre una curva cerrada y $\Phi_B$ el
flujo magnético a través de la superficie que ella bordea.

### Aplicación a una región de campo variable

Para una región circular de radio $r$ donde $B$ varía en el tiempo, la simetría hace que
$\vec{E}$ sea tangente a la circunferencia y de módulo constante, de modo que la circulación
es $E\,2\pi r$. Igualando con la variación del flujo $\Phi_B = B\,\pi r^2$:

$$E\,2\pi r = -\frac{dB}{dt}\,\pi r^2$$

y despejando el campo eléctrico inducido:

$$E = -\frac{r}{2}\,\frac{dB}{dt}$$

donde $r$ es el radio del punto considerado y $dB/dt$ la tasa de variación del campo.

## Generadores y motores

Un generador aprovecha la variación del ángulo: una espira de área $A$ que rota con velocidad
angular $\omega$ dentro de un campo $\vec{B}$ tiene un flujo que varía como el coseno del ángulo
$\theta = \omega t$:

$$\Phi_B = BA\cos(\omega t)$$

Derivando según Faraday, la fem inducida resulta sinusoidal:

$$\varepsilon = NBA\,\omega\,\sin(\omega t)$$

donde $N$ es el número de espiras, $B$ el campo, $A$ el área de la espira y $\omega$ la
velocidad angular de rotación.

Según cómo se conecte la salida se distinguen dos tipos:

| Tipo | Salida $\varepsilon(t)$ |
|---|---|
| Corriente alterna (AC) | fem sinusoidal completa (cambia de signo) |
| Corriente continua (DC) | fem rectificada (semiciclos siempre del mismo signo) |

---

## Ver también

- [[07-induccion/02-circuitos-rl]] — inductancia, circuitos RL y energía magnética
- [[07-induccion/03-problemas-induccion]] — corriente inducida, generador rotante, fem a varios ángulos y barra cayendo
