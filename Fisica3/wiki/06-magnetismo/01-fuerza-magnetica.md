---
tags: [teoria, unidad-6, campo-magnetico, fuerza-de-lorentz, ciclotron]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Campo magnético y fuerza magnética

El campo magnético $\vec{B}$ ejerce una fuerza sobre las cargas **en movimiento** y sobre los
conductores por los que circula corriente. A diferencia de la fuerza eléctrica, esta fuerza
depende de la velocidad de la carga y es siempre perpendicular a ella. De acá salen el
movimiento circular de una partícula en un campo uniforme, la fuerza de Lorentz y la fuerza
sobre un conductor con corriente.

## Fuerza sobre una carga en movimiento

La fuerza magnética sobre una partícula de carga $q$ que se mueve con velocidad $\vec{v}$ en
un campo $\vec{B}$ se escribe como un producto vectorial: es perpendicular tanto a $\vec{v}$
como a $\vec{B}$.

> **Fuerza magnética (forma vectorial).** Sobre una partícula de carga $q$ y velocidad
> $\vec{v}$ en un campo $\vec{B}$,
> $$\vec{F}_B = q\,\vec{v} \times \vec{B}$$
> donde $\vec{F}_B$ es perpendicular al plano que forman $\vec{v}$ y $\vec{B}$. La dirección
> sale de la regla de la mano derecha y el signo de $q$ la invierte si la carga es negativa.

En módulo, la fuerza depende del ángulo entre la velocidad y el campo:

$$|\vec{F}_B| = |q|\,v\,B\,\sin\theta$$

donde $\theta$ es el menor ángulo entre $\vec{v}$ y $\vec{B}$, $v$ el módulo de la velocidad
y $B$ el del campo. Si $\vec{v} \parallel \vec{B}$ (con $\theta = 0$) la fuerza es nula; el
máximo se alcanza en $\theta = 90^\circ$, cuando velocidad y campo son perpendiculares.

> **Nota.** En los apuntes la expresión modular figura escrita con $\cos\theta$, pero la
> descripción que la acompaña —fuerza nula cuando $\vec{v}\parallel\vec{B}$ y máxima en
> $\theta=90^\circ$— corresponde a $\sin\theta$, que es la forma que se usa acá.

La unidad SI del campo magnético es el **tesla**:

$$[B] = \frac{\mathrm{N}}{\mathrm{C}\cdot \tfrac{\mathrm{m}}{\mathrm{s}}} = \mathrm{T} \;\text{(tesla)}$$

## Movimiento circular en un campo uniforme

Si una partícula entra a un campo magnético uniforme con su velocidad perpendicular a
$\vec{B}$, la fuerza magnética hace de fuerza centrípeta: es constante en módulo y siempre
apunta al centro, así que la trayectoria es una circunferencia. Aplicando la segunda ley de
Newton con la condición de movimiento circular uniforme,

$$\sum \vec{F} = \vec{F}_B = m\,\vec{a}, \qquad q\,v\,B = \frac{m\,v^2}{r}$$

donde $m$ es la masa de la partícula, $r$ el radio de la circunferencia y $v$ su rapidez. De
esta igualdad se despejan el radio, la velocidad angular y el período:

i) **Radio de la órbita:**
   $$r = \frac{m\,v}{q\,B}$$
ii) **Velocidad angular:**
   $$\omega = \frac{v}{r} = \frac{q\,B}{m}$$
iii) **Período:**
   $$T = \frac{2\pi r}{v} = \frac{2\pi}{\omega} = \frac{2\pi m}{q\,B}$$

donde se ve que $\omega$ y $T$ **no dependen** de la velocidad ni del radio: quedan fijados
sólo por la carga, la masa y el campo.

## El ciclotrón

El ciclotrón aprovecha justamente que el período $T = 2\pi m / qB$ es independiente de la
rapidez. Una partícula cargada se acelera entre dos electrodos con forma de "D" (las *dees*)
inmersos en un campo magnético uniforme: dentro de cada dee describe un semicírculo y, al
cruzar el hueco entre ambas, una diferencia de potencial alterna la acelera. Como el tiempo
de cada media vuelta es siempre el mismo, basta invertir la tensión a una frecuencia fija
—la frecuencia angular $\omega = qB/m$— para acelerarla en cada pasaje; el radio de la órbita
va creciendo y la partícula espirala hacia afuera.

> **Nota.** En los apuntes el ciclotrón aparece como un diagrama del dispositivo (dos *dees*,
> la fuente y el campo $\vec{B}$) junto a las fórmulas del movimiento circular; no se
> desarrolla más allá de esa idea.

## Fuerza de Lorentz

Cuando además del campo magnético hay un campo eléctrico $\vec{E}$, la fuerza total sobre la
carga es la suma de la parte eléctrica y la magnética. Esta combinación se conoce como
**fuerza de Lorentz**.

> **Fuerza de Lorentz.** Sobre una carga $q$ con velocidad $\vec{v}$ en campos $\vec{E}$ y
> $\vec{B}$,
> $$\vec{F} = q\,\vec{E} + q\,\vec{v} \times \vec{B}$$
> donde el primer término no depende de la velocidad y el segundo sí. La parte eléctrica
> puede acelerar la carga en la dirección de $\vec{E}$; la magnética sólo cambia la
> dirección del movimiento.

## Fuerza sobre un conductor con corriente

Una corriente es carga en movimiento, así que un conductor por el que circula corriente
también siente la fuerza magnética. Tomando un elemento de conductor con carga $dq$ que se
mueve con velocidad $\vec{v}$,

$$d\vec{F}_m = dq\,\vec{v} \times \vec{B} = \left(dq\,\frac{d\vec{l}}{dt}\right) \times \vec{B} = I\,d\vec{s} \times \vec{B}$$

donde se usó $\vec{v} = d\vec{l}/dt$ y $dq/dt = I$, de modo que $dq\,\vec{v} = I\,d\vec{s}$
con $d\vec{s}$ el elemento de longitud orientado según la corriente.

> **Fuerza sobre un elemento de conductor.** Para cualquier hilo conductor,
> $$d\vec{F}_m = I\,d\vec{s} \times \vec{B}$$
> donde $I$ es la corriente y $d\vec{s}$ apunta en el sentido de circulación.

Para un tramo recto de longitud $L$ en un campo uniforme, integrando queda el módulo:

$$|\vec{F}_m| = I\,B\,L\,\sin\alpha$$

donde $\alpha$ es el ángulo entre el conductor y $\vec{B}$, $L$ la longitud del tramo e $I$
la corriente. Cuando el conductor es perpendicular al campo ($\alpha = 90^\circ$) la fuerza
es máxima y vale $I\,B\,L$.

> **Ejemplo.** Una barra conductora de longitud $L$ por la que circula una corriente $i$
> descansa sobre un plano inclinado un ángulo $\theta$, con el campo $\vec{B}$ vertical. Para
> que la barra quede en equilibrio y no deslice, la componente de la fuerza magnética a lo
> largo del plano debe compensar a la gravedad. Planteando $\sum F = 0$ sobre el plano se
> llega a $f_m = m g \tan\theta$, y como $f_m = i\,B\,L$, el campo necesario es
> $$B = \frac{m g \tan\theta}{i\,L}$$
> Si en cambio se quiere que la barra acelere plano arriba con $a = g\sin\theta$, el planteo
> dinámico duplica la fuerza requerida: $f_m = 2\,m g \tan\theta$ y $B = 2\,m g \tan\theta/(i\,L)$.

---

## Ver también

- [[02-torque-sobre-espira]] — momento de torsión y energía de una espira en un campo magnético
- [[03-biot-savart-y-ampere]] — cómo las corrientes **generan** el campo $\vec{B}$
- [[01-electrostatica/01-ley-de-coulomb]] — la fuerza eléctrica, contraparte de $\vec{F}_B$
