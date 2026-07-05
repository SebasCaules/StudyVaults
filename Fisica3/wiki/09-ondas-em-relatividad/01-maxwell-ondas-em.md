---
tags: [teoria, unidad-9, ondas-electromagneticas, maxwell, corriente-de-desplazamiento]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 9
tipo: teoria
actualizado: 2026-07-05
---

# Ecuaciones de Maxwell y ondas electromagnéticas

Esta página cierra el electromagnetismo: la corriente de desplazamiento completa la ley de
Ampère, las cuatro ecuaciones de Maxwell resumen toda la teoría y, en una región sin cargas
ni corrientes, predicen la existencia de ondas electromagnéticas que viajan a la velocidad
de la luz.

## Corriente de desplazamiento

Para que la ley de Ampère sea consistente en situaciones no estacionarias (por ejemplo,
entre las placas de un capacitor que se está cargando, donde no hay corriente de conducción
pero sí un campo eléctrico variable), Maxwell agregó un término asociado a la variación del
flujo eléctrico: la **corriente de desplazamiento**.

> **Definición.** La corriente de desplazamiento es
> $$I_d = \varepsilon_0 \, \frac{d\Phi_E}{dt}$$
> donde $\varepsilon_0$ es la permitividad del vacío y $\Phi_E = \oint \vec{E} \cdot d\vec{A}$
> es el flujo del campo eléctrico a través de la superficie considerada.

Sumando esta contribución a la corriente de conducción $I$ se obtiene la forma generalizada
de la ley de Ampère.

> **Ley de Ampère–Maxwell.** La circulación del campo magnético sobre una curva cerrada es
> $$\oint \vec{B} \cdot d\vec{s} = \mu_0 \left( I + I_d \right) = \mu_0 I + \mu_0 \varepsilon_0 \, \frac{d\Phi_E}{dt}$$
> donde $\mu_0$ es la permeabilidad del vacío, $I$ la corriente de conducción encerrada e
> $I_d$ la corriente de desplazamiento.

## Ecuaciones de Maxwell

Las cuatro ecuaciones de Maxwell resumen todo el electromagnetismo. En su forma general:

> **Ecuaciones de Maxwell.**
> $$\oint \vec{E} \cdot d\vec{A} = \frac{q}{\varepsilon_0} \qquad \text{(Ley de Gauss)}$$
> $$\oint \vec{B} \cdot d\vec{A} = 0 \qquad \text{(Ley de Gauss del magnetismo)}$$
> $$\oint \vec{E} \cdot d\vec{s} = -\frac{d\Phi_B}{dt} \qquad \text{(Ley de Faraday)}$$
> $$\oint \vec{B} \cdot d\vec{s} = \mu_0 I + \mu_0 \varepsilon_0 \, \frac{d\Phi_E}{dt} \qquad \text{(Ley de Ampère–Maxwell)}$$

Cada una expresa un hecho físico:

| Ecuación | Contenido físico |
|---|---|
| Ley de Gauss | El flujo eléctrico a través de una superficie cerrada mide la carga encerrada. |
| Ley de Gauss del magnetismo | No existen monopolos magnéticos: el flujo magnético neto es siempre nulo. |
| Ley de Faraday | Un flujo magnético variable induce un campo eléctrico circulante. |
| Ley de Ampère–Maxwell | Tanto una corriente como un flujo eléctrico variable generan campo magnético. |

Acá $q$ es la carga encerrada, $\Phi_B = \oint \vec{B} \cdot d\vec{A}$ el flujo magnético y
$\Phi_E$ el flujo eléctrico.

### En una región sin cargas ni corrientes

Cuando no hay cargas libres ($q = 0$) ni corrientes de conducción ($I = 0$) —el caso del
vacío por donde se propaga la luz—, las ecuaciones quedan **simétricas** entre $\vec{E}$ y
$\vec{B}$:

> **Maxwell en el espacio libre.**
> $$1)\quad \oint \vec{E} \cdot d\vec{A} = 0$$
> $$2)\quad \oint \vec{B} \cdot d\vec{A} = 0$$
> $$3)\quad \oint \vec{E} \cdot d\vec{s} = -\frac{d\Phi_B}{dt}$$
> $$4)\quad \oint \vec{B} \cdot d\vec{s} = \mu_0 \varepsilon_0 \, \frac{d\Phi_E}{dt}$$

Un campo magnético variable induce un campo eléctrico (ec. 3) y un campo eléctrico variable
induce un campo magnético (ec. 4). Este acople mutuo es lo que sostiene una **onda
electromagnética** que se propaga sin necesidad de fuentes.

## Ondas electromagnéticas planas

De las ecuaciones de Maxwell en el espacio libre se deduce que las perturbaciones de
$\vec{E}$ y $\vec{B}$ se propagan como ondas. En una onda plana, $\vec{E}$, $\vec{B}$ y la
dirección de propagación forman un triedro: si la onda avanza según $\hat{x}$, el campo
$\vec{E}$ oscila en $\hat{y}$ y el campo $\vec{B}$ en $\hat{z}$, perpendiculares entre sí y
a la dirección de avance.

> **Rapidez de las ondas electromagnéticas.** Toda onda electromagnética en el vacío viaja a
> $$c = \frac{1}{\sqrt{\mu_0 \varepsilon_0}}$$
> donde $\mu_0$ es la permeabilidad y $\varepsilon_0$ la permitividad del vacío. Este valor
> coincide con la velocidad de la luz, lo que identifica a la luz como una onda
> electromagnética.

### Campos eléctricos y magnéticos sinusoidales

Para una onda plana sinusoidal que se propaga según $\hat{x}$, los campos tienen la forma

$$E = E_{max} \cos(kx - \omega t)$$
$$B = B_{max} \cos(kx - \omega t)$$

donde $E_{max}$ y $B_{max}$ son los valores máximos (amplitudes) de cada campo, $k$ es el
número de onda y $\omega$ la frecuencia angular. Ambos campos oscilan **en fase**: alcanzan
su máximo en el mismo punto y en el mismo instante.

El número de onda se relaciona con la longitud de onda $\lambda$ y la frecuencia angular con
la frecuencia $f$ mediante

$$k = \frac{2\pi}{\lambda}, \qquad \omega = 2\pi f$$

Combinando ambas, la velocidad de propagación resulta

$$\frac{\omega}{k} = \frac{2\pi f}{2\pi / \lambda} = f\lambda = c$$

Finalmente, las amplitudes de los dos campos no son independientes: su cociente es la propia
velocidad de la luz.

> **Relación entre los campos.** En una onda electromagnética plana,
> $$\frac{E_{max}}{B_{max}} = \frac{E}{B} = c$$
> es decir, el campo eléctrico es $c$ veces más grande (en las unidades usuales) que el
> magnético en todo instante.

---

## Ver también

- [[02-relatividad-especial]] — la invariancia de $c$ da pie a la relatividad especial
- [[01-ley-de-coulomb|Ley de Coulomb]] — la ley de Gauss eléctrica nace de acá
