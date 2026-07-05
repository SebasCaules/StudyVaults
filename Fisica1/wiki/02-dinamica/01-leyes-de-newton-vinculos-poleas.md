---
tags: [teoria, unidad-2, dinamica, leyes-de-newton, vinculos, poleas]
fuente: raw/teoricas/fisica1-dinamica.pdf
unidad: 2
tipo: teoria
actualizado: 2026-07-05
---

# Leyes de Newton, vínculos y poleas

La dinámica estudia el movimiento a partir de sus causas: las fuerzas. El punto de partida
es la segunda ley de Newton, y sobre ella se montan los **vínculos** (cuerdas y poleas) que
relacionan los movimientos de varios cuerpos de un mismo sistema.

## Segunda ley de Newton

> **Ley (segunda de Newton).** La resultante de las fuerzas sobre una partícula es igual al
> producto de su masa por su aceleración:
> $$\sum \vec F = m\,\vec a$$

Como es una igualdad vectorial, se resuelve por componentes en el sistema de ejes elegido:

$$\sum F_x = m\,a_x, \qquad \sum F_y = m\,a_y$$

donde $\sum F_x$ y $\sum F_y$ son las sumas de las componentes de todas las fuerzas, $m$ la
masa del cuerpo y $a_x$, $a_y$ las componentes de su aceleración. El método de trabajo es
siempre el mismo: aislar cada cuerpo en un **diagrama de cuerpo libre (DCL)**, plantear la
segunda ley por componentes y sumar las ecuaciones para despejar las incógnitas.

## Vínculos o ligaduras

Un **vínculo** (o ligadura) es una restricción que impone una relación entre las posiciones,
velocidades o aceleraciones de los cuerpos. Las cuerdas son el caso típico.

### Cuerda ideal

> **Definición.** Una **cuerda ideal** es una cuerda de **masa despreciable**.

Si se toma un tramo de cuerda de masa $m_c$ tirado en sus extremos por tensiones $t_1$ y
$t_2$, la segunda ley sobre ese tramo da

$$t_2 - t_1 = m_c\,a_c$$

Al ser $m_c \to 0$, el segundo miembro se anula:

$$t_2 - t_1 = 0 \;\Rightarrow\; t_2 = t_1 = t$$

Es decir: en una cuerda ideal la **tensión es la misma en toda su extensión**. Esto vale
también cuando la cuerda pasa por una polea sin masa ni rozamiento.

### Cuerda inextensible

> **Definición.** Una **cuerda inextensible** mantiene su longitud constante.

Para dos cuerpos unidos por una cuerda inextensible sobre una recta, con posiciones $x_1$ y
$x_2$, la longitud vinculada es $\ell = x_2 - x_1 = \text{cte}$. Derivando respecto del tiempo:

$$\frac{d\ell}{dt} = 0 = v_2 - v_1 \;\Rightarrow\; v_2 = v_1, \qquad a_2 = a_1$$

donde $v_1, v_2$ son las velocidades y $a_1, a_2$ las aceleraciones de cada cuerpo. Los
cuerpos unidos por una cuerda inextensible **se mueven con la misma velocidad y la misma
aceleración** (en módulo).

## Poleas móviles

Cuando una polea es **móvil**, la relación entre las aceleraciones ya no es de igualdad. Se
obtiene escribiendo la longitud total de cuerda en función de las posiciones y pidiendo que
sea constante.

Para el arreglo de una polea fija y una polea móvil, la longitud de cuerda se escribe sumando
todos los tramos:

$$\ell = L_1 + y_2 + L_2 + y_3 + L_3 + y_1 = \text{cte}$$

donde los $L_i$ son tramos fijos (por las poleas) y los $y_i$ las alturas de los cuerpos y de
la polea móvil. Derivando dos veces y descartando las constantes se llega a la **relación
cinemática de ligadura**:

$$\frac{d\ell}{dt} = 0 = v_1 + 2\,v_2 \;\Rightarrow\; a_1 = -2\,a_2$$

El cuerpo que cuelga de la polea móvil se mueve con **la mitad** de la aceleración (y en
sentido opuesto) que el cuerpo del otro extremo.

> **Observación.** La polea móvil también impone una **relación dinámica**. Aplicando la
> segunda ley a la polea (de masa despreciable) tirada por $t_1$ en dos ramales y por $t_2$ en
> el otro, $t_2 - 2\,t_1 = m_p\,a_p \to 0$, de donde
> $$t_2 = 2\,t_1$$
> Es la relación **inversa** a la de las aceleraciones: donde la aceleración se divide por
> dos, la tensión se multiplica por dos.

### Ejemplo: sistema con polea móvil

Para el sistema con un cuerpo $m_1$ que cuelga del extremo libre de la cuerda (ramal simple, con
tensión $t_1$) y un cuerpo $m_2$ que cuelga de la polea móvil (sostenida por el ramal doble, con
tensión $t_2 = 2t_1$), los DCL dan (usando $t_2 = 2t_1$ y $a_1 = -2a_2$):

$$t_1 - m_1 g = 2\,m_1\,a_2 \qquad (1)$$
$$m_2 g - 2\,t_1 = m_2\,a_2 \qquad (2)$$

Combinando $2\cdot(1) + (2)$ se elimina la tensión y queda

$$m_2 g - 2\,m_1 g = a_2\,(4\,m_1 + m_2)$$

$$\boxed{\;a_2 = \dfrac{m_2\,g - 2\,m_1\,g}{4\,m_1 + m_2}\;}$$

> **Nota.** En el denominador aparece **siempre una suma** de las masas (nunca una resta): es
> un buen chequeo de que el planteo está bien, porque la masa efectiva del sistema no puede
> anularse.

---

## Ver también

- [[02-rozamiento]] — fuerzas de contacto que se agregan a los DCL
- [[03-curva-peraltada]] — la segunda ley aplicada al movimiento circular
- [[04-fuerzas-de-arrastre]] — fuerzas que dependen de la velocidad
- [[index]] — índice del vault
