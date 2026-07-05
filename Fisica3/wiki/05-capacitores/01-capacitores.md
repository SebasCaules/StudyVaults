---
tags: [teoria, unidad-5, capacitores, capacidad, energia]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 5
tipo: teoria
actualizado: 2026-07-05
---

# Capacitores

Un capacitor almacena carga y energía en el campo eléctrico entre dos conductores.
Esta página reúne la definición de capacidad, las tres geometrías canónicas (plano,
cilíndrico y esférico), las reglas de combinación en serie y paralelo, y la energía
almacenada. El campo de cada geometría sale de la [[02-gauss/01-flujo-y-ley-de-gauss|ley de Gauss]]
y la diferencia de potencial de integrarlo.

## Capacidad

> **Definición.** La capacidad de un capacitor es el cociente entre la carga acumulada en
> uno de sus conductores y la diferencia de potencial entre ambos:
> $$C = \frac{Q}{V}$$
> donde $Q$ es la carga en una placa y $V$ la diferencia de potencial entre placas.

La unidad SI es el **faradio**:

$$[C] = \frac{[Q]}{[V]} = \frac{\mathrm{C}}{\mathrm{V}} = \mathrm{F}$$

**Observación.** $C$ es una propiedad puramente geométrica del capacitor (depende de la
forma y el tamaño de los conductores y del material entre ellos), no de la carga ni del
voltaje aplicados.

## Tipos de capacitores

### Capacitor plano de caras paralelas

Dos placas paralelas de área $A$ separadas una distancia $d$. Como desde el punto de vista
de una carga de prueba los planos se comportan como infinitos, el campo entre las placas es
uniforme. Sumando la contribución de las dos placas:

$$E = \frac{\sigma}{\varepsilon_0}$$

donde $\sigma$ es la densidad superficial de carga y $\varepsilon_0$ la permitividad del
vacío. La diferencia de potencial entre las placas se obtiene integrando el campo a lo
largo de la separación $d$:

$$\Delta V = -\int_d^0 \frac{\sigma}{\varepsilon_0}\,dx = \frac{\sigma d}{\varepsilon_0}$$

Usando $\sigma = Q/A$ queda $V = \dfrac{Q\,d}{\varepsilon_0 A}$, de modo que $\dfrac{Q}{V} = \dfrac{\varepsilon_0 A}{d}$. La capacidad (ya incluyendo un dieléctrico de permitividad
relativa $\varepsilon_r$, ver [[02-dielectricos]]) es:

$$C = \frac{\varepsilon_0 A}{d}\,\varepsilon_r$$

donde $A$ es el área de una placa, $d$ la separación y $\varepsilon_r$ la permitividad
relativa del material entre placas ($\varepsilon_r = 1$ en vacío).

### Capacitor cilíndrico

Dos cilindros coaxiales de longitud $\ell$: uno interior de radio $a$ y uno exterior de
radio $b$. Por la [[02-gauss/02-casos-de-aplicacion|ley de Gauss]] con una gaussiana
cilíndrica, el campo entre los conductores es radial:

$$E = \frac{Q}{2\pi\varepsilon_0\, r\,\ell}$$

donde $r$ es la distancia al eje. Integrando desde el conductor interior al exterior:

$$\Delta V = -\int_a^b \frac{Q}{2\pi\varepsilon_0\, r\,\ell}\,dr = \frac{Q}{2\pi\varepsilon_0\,\ell}\,\ln\!\frac{b}{a}$$

de donde $\dfrac{Q}{V} = \dfrac{2\pi\varepsilon_0\,\ell}{\ln(b/a)}$, y la capacidad es:

$$C = \frac{2\pi\varepsilon_0\,\ell}{\ln(b/a)}\,\varepsilon_r$$

donde $a$ es el radio interior, $b$ el exterior, $\ell$ la longitud y $\varepsilon_r$ la
permitividad relativa.

> **Nota.** En el original el argumento del logaritmo aparece escrito como el cociente de
> los dos radios; acá se toma la forma $\ln(b/a)$ (con $b>a$) para que la capacidad quede
> positiva, consistente con el paso de la deducción.

### Capacitor esférico

Dos cascarones esféricos concéntricos: interior de radio $a$ y exterior de radio $b$. Por
la ley de Gauss el campo entre ellos es el de una carga puntual:

$$E = \frac{Q}{4\pi\varepsilon_0\, r^2}$$

Integrando entre los radios se obtiene la diferencia de potencial:

$$\Delta V = -\int_a^b \frac{Q}{4\pi\varepsilon_0\, r^2}\,dr = \frac{Q}{4\pi\varepsilon_0}\left(\frac{1}{a} - \frac{1}{b}\right)$$

y despejando la capacidad:

$$C = \frac{4\pi\varepsilon_0\, a\, b}{b - a}\,\varepsilon_r$$

donde $a$ y $b$ son los radios interior y exterior y $\varepsilon_r$ la permitividad
relativa.

## Combinación de capacitores

### En paralelo

Todos los capacitores comparten la misma diferencia de potencial, $\Delta V_1 = \Delta V_2 = \Delta V$, con $\Delta V_i = Q_i / C_i$. La carga total es la suma de las cargas:

$$Q_{\text{tot}} = Q_1 + Q_2 = \Delta V_1\, C_1 + \Delta V_2\, C_2$$

Se puede reemplazar el conjunto por un único capacitor equivalente que cumple $C_{eq}\,\Delta V = C_1\,\Delta V_1 + C_2\,\Delta V_2$, es decir la suma directa de las capacidades:

$$C_{eq} = \sum_i C_i$$

### En serie

Todos los capacitores llevan la misma carga, $Q_1 = Q_2 = Q$, y los voltajes se suman:

$$\Delta V_{\text{tot}} = \Delta V_1 + \Delta V_2 = \frac{Q_1}{C_1} + \frac{Q_2}{C_2}$$

El capacitor equivalente cumple entonces la suma de inversas:

$$\frac{1}{C_{eq}} = \sum_i \frac{1}{C_i}$$

**Observación.** Las reglas son opuestas a las de los resistores: los capacitores en
**paralelo** se suman directamente y en **serie** se suman las inversas.

## Energía almacenada

> **Definición.** La energía almacenada en un capacitor cargado se puede escribir de tres
> formas equivalentes:
> $$U_E = \frac{Q^2}{2C} = \tfrac12\,Q\,\Delta V = \tfrac12\,C\,(\Delta V)^2$$
> donde $Q$ es la carga, $C$ la capacidad y $\Delta V$ la diferencia de potencial.

Esta energía reside en el campo eléctrico. Su densidad (energía por unidad de volumen) es:

$$u_E = \tfrac12\,\varepsilon_0\, E^2$$

donde $E$ es el módulo del campo eléctrico. La expresión vale para cualquier campo, no solo
el de un capacitor.

---

## Ver también

- [[02-dielectricos]] — efecto de un material dieléctrico sobre $C$, $V$ y la energía
- [[03-redes-y-redistribucion-resueltos]] — problemas resueltos de reducción de redes y redistribución de carga
- [[02-gauss/02-casos-de-aplicacion]] — el campo de cada geometría por la ley de Gauss
- [[01-electrostatica/02-campo-electrico]] — campo eléctrico y potencial de partida
