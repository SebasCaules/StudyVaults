---
tags: [teoria, unidad-6, campo-magnetico, torque, momento-dipolar-magnetico]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Momento de torsión sobre una espira

Una espira con corriente en un campo magnético no siente una fuerza neta, pero sí un
**momento de torsión** que tiende a alinearla con el campo. Es el principio de los motores
eléctricos y de los galvanómetros. La cuenta se organiza con el **momento dipolar
magnético** $\vec{\mu}$ de la espira, que sintetiza corriente y geometría en un solo vector.

## Fuerzas sobre los lados de la espira

Se considera una espira rectangular de lados $a$ y $b$ recorrida por una corriente $I$,
dentro de un campo $\vec{B}$ uniforme. Los lados **paralelos** al campo no experimentan
fuerza magnética; los dos lados **perpendiculares** al campo sí, y con sentidos opuestos.

> **Observación.** Los lados paralelos a $\vec{B}$ no aportan fuerza ($\vec{F}_m = I\,d\vec{s}\times\vec{B}$
> se anula cuando $d\vec{s}\parallel\vec{B}$). Los dos lados perpendiculares reciben fuerzas
> iguales y opuestas $F = I\,a\,B$, que no se cancelan como torque porque actúan sobre
> brazos distintos: forman una **cupla** que hace girar la espira.

Cada una de esas fuerzas vale $I\,a\,B$ (con $a$ la longitud del lado perpendicular al
campo). Tomando momentos respecto del eje central, con brazo $b/2$ para cada fuerza, el
torque máximo es

$$\tau_{\max} = F\,\frac{b}{2} + F\,\frac{b}{2} = I\,a\,b\,B$$

y como el área de la espira es $A = a\,b$, queda

$$\tau_{\max} = I\,A\,B$$

donde $I$ es la corriente, $A$ el área encerrada por la espira y $B$ el módulo del campo.
Este valor es el máximo: corresponde a la posición en que el plano de la espira contiene a
$\vec{B}$.

## Momento dipolar magnético

El producto $I\,A$ aparece siempre junto, así que conviene definirlo como un vector. Su
dirección es la normal a la espira, dada por la regla de la mano derecha sobre el sentido de
la corriente.

> **Momento dipolar magnético.** Para una espira de corriente,
> $$\vec{\mu} = I\,\vec{A}$$
> donde $I$ es la corriente y $\vec{A}$ el vector área, de módulo igual al área encerrada y
> dirección normal al plano de la espira.

La unidad SI del momento dipolar magnético es

$$[\mu] = \mathrm{A}\cdot\mathrm{m}^2$$

> **Nota.** En los apuntes la unidad figura escrita de forma poco clara; como $\mu = I\,A$
> es corriente por área, la unidad correcta es $\mathrm{A}\cdot\mathrm{m}^2$.

Para una **bobina** de $N$ espiras el momento se multiplica por el número de vueltas:

$$\vec{\mu}_{\text{bobina}} = N\,I\,\vec{A}$$

donde $N$ es la cantidad de espiras, $I$ la corriente e $\vec{A}$ el vector área de una
espira.

## Torque en forma vectorial

Con el momento dipolar, el torque sobre la espira se escribe como un único producto
vectorial, válido para cualquier orientación (no sólo la de torque máximo):

> **Torque sobre un dipolo magnético.** Una espira de momento $\vec{\mu}$ en un campo
> $\vec{B}$ sufre un torque
> $$\vec{\tau} = \vec{\mu} \times \vec{B}$$
> donde el torque es máximo cuando $\vec{\mu}\perp\vec{B}$ y nulo cuando $\vec{\mu}\parallel\vec{B}$
> (la espira ya está alineada con el campo).

Su módulo es $\tau = \mu\,B\,\sin\phi$, con $\phi$ el ángulo entre $\vec{\mu}$ y $\vec{B}$, lo
que recupera $\tau_{\max} = \mu B = I A B$ cuando $\phi = 90^\circ$.

## Energía potencial de la espira

Al torque le corresponde una energía potencial: girar la espira contra el torque cuesta
trabajo, que queda almacenado. La configuración de mínima energía es la de $\vec{\mu}$
alineado con $\vec{B}$.

> **Energía potencial de un dipolo magnético.**
> $$U_B = -\,\vec{\mu} \cdot \vec{B}$$
> donde $U_B$ depende del ángulo entre $\vec{\mu}$ y $\vec{B}$ a través del producto escalar.

De acá salen los dos extremos:

i) **Mínimo:** $U_{\min} = -\mu B$ cuando $\vec{\mu}$ y $\vec{B}$ tienen el **mismo** sentido
   (espira alineada con el campo, equilibrio estable).
ii) **Máximo:** $U_{\max} = +\mu B$ cuando $\vec{\mu}$ apunta en **sentido opuesto** a
    $\vec{B}$ (equilibrio inestable).

---

## Ver también

- [[01-fuerza-magnetica]] — la fuerza $\vec{F}_m = I\,d\vec{s}\times\vec{B}$ de donde sale el torque
- [[03-biot-savart-y-ampere]] — el campo que la espira, a su vez, genera a su alrededor
