---
tags: [teoria, unidad-6, optica-geometrica, dioptrio, potencia, aumento, formacion-de-imagenes]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + práctica)
unidad: 6
tipo: teoria
actualizado: 2026-07-05
---

# Dioptrios esféricos

Un **dioptrio** es una superficie que separa dos medios de distinto índice de refracción. Cuando
esa superficie es una porción de esfera, refracta los rayos de un objeto y forma una imagen.
Esta página reúne la ecuación del dioptrio esférico, su convención de signos, la potencia, los
focos, el caso plano y el aumento lateral, y cierra con el problema de la barra cilíndrica, que
encadena dos dioptrios.

## Convención de signos

Todas las distancias se miden desde el **vértice** del dioptrio, sobre el eje óptico, tomando la
luz como si viajara hacia la derecha.

- $s$: distancia objeto. Para un objeto real (a la izquierda del vértice) es $s < 0$.
- $s'$: distancia imagen. Para una imagen real (a la derecha) es $s' > 0$.
- $R$: radio de curvatura de la superficie. Es el signo el que distingue las dos formas:

> **Cara cóncava y cara convexa.** Según hacia dónde mire la curvatura respecto de la luz
> incidente,
> $$\text{cóncava: } R < 0, \qquad \text{convexa: } R > 0.$$

## Ecuación del dioptrio esférico

Sea un dioptrio que separa un medio de índice $n$ (donde está el objeto) de un medio de índice
$n'$ (donde se forma la imagen). La relación entre las distancias objeto e imagen es:

> **Ecuación del dioptrio esférico.**
> $$\frac{n'}{s'} - \frac{n}{s} = \frac{n'-n}{R} = \phi$$
> donde $n$ y $n'$ son los índices de los medios objeto e imagen, $s$ y $s'$ las distancias
> objeto e imagen, $R$ el radio de curvatura y $\phi$ la **potencia** del dioptrio.

La potencia $\phi = \dfrac{n'-n}{R}$ resume en un solo número la capacidad del dioptrio de
converger o divergir los rayos.

### Focos

Los focos son las posiciones especiales que hacen que la imagen (o el objeto) quede en el
infinito.

El **foco objeto** $f$ es la distancia objeto que produce una imagen en el infinito ($s' \to \infty$):

$$-\frac{n}{f} = \frac{n'-n}{R} \;\Rightarrow\; f = -\frac{n\,R}{n'-n}$$

El **foco imagen** $f'$ es la distancia imagen de un objeto en el infinito ($s \to \infty$):

$$\frac{n'}{f'} = \frac{n'-n}{R} \;\Rightarrow\; f' = \frac{n'\,R}{n'-n}$$

Los signos de los focos clasifican el dioptrio:

$$f > 0,\; f' < 0 \Rightarrow \text{divergente}; \qquad f < 0,\; f' > 0 \Rightarrow \text{convergente}.$$

## Dioptrio plano

Un dioptrio plano es el límite de radio infinito ($R \to \infty$), con lo que la potencia se
anula y la ecuación se reduce a:

> **Dioptrio plano.**
> $$\frac{n'}{s'} = \frac{n}{s}$$
> La imagen de un objeto visto a través de una superficie plana (por ejemplo, el fondo de una
> pileta visto desde afuera) queda desplazada por el cambio de índice, pero no se amplía.

## Aumento lateral

El **aumento** $A$ compara el tamaño de la imagen con el del objeto y, por su signo, dice si la
imagen está derecha o invertida.

> **Aumento lateral del dioptrio.**
> $$A = \frac{n\,s'}{n'\,s}$$
> donde $n$, $n'$ son los índices de los medios y $s$, $s'$ las distancias objeto e imagen.

Su lectura es:

- $A < 0$: imagen **invertida** respecto del objeto.
- $|A| > 1$: imagen **mayor** que el objeto (aumentada); $|A| < 1$: imagen menor.

## Ejemplo: barra cilíndrica (dos dioptrios)

Una **barra cilíndrica** de vidrio con las dos caras esféricas es, en efecto, dos dioptrios
esféricos en serie: la imagen que forma la primera cara actúa como objeto para la segunda. En un
problema de la práctica, se coloca un objeto a $40$ cm de la cara convexa de radio $R_1 = 8$ cm
de una barra de longitud $L = 20$ cm e índice $n = 1{,}4$, y se pide el radio $R_2$ de la otra
cara para que un observador a la derecha vea la imagen en su ubicación verdadera.

**Primera cara** (aire → vidrio, $R_1 = 8$ cm, objeto real $s_1 = -40$ cm):

$$\frac{n}{s_1'} - \frac{1}{s_1} = \frac{n-1}{R_1} \;\Rightarrow\; s_1' = \frac{n}{\dfrac{n-1}{R_1} + \dfrac{1}{s_1}} = 56\ \text{cm}$$

**Segunda cara** (vidrio → aire): la imagen anterior, corrida por la longitud $L$ de la barra,
es el objeto de la segunda cara. Aplicando de nuevo la ecuación del dioptrio a la salida se
despeja el radio pedido, $R_2 = 90$ cm. La idea a retener es el **método secuencial**: se aplica
la ecuación del dioptrio superficie por superficie, propagando la imagen como objeto de la
siguiente.

---

## Ver también

- [[01-reflexion-refraccion]] — la ley de Snell de la que surge la ecuación del dioptrio
- [[04-lentes-y-espejos]] — encadenar dos dioptrios delgados da la lente; el espejo esférico es el análogo reflectante
