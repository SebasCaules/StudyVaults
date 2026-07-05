---
tags: [teoria, unidad-4, fem, resistencia-interna, resistores]
fuente: apuntes manuscritos de la cursada 2024-1C
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Circuitos de corriente directa

Un circuito de corriente directa (DC) combina una fuente que sostiene la corriente con
resistores que la limitan. Esta página introduce la fuerza electromotriz de la fuente, el
efecto de su resistencia interna, el balance de energía y las reglas para combinar
resistores en serie y en paralelo. La [[01-corriente-y-ley-de-ohm|ley de Ohm]] es la
herramienta de base; para redes que no se reducen a series y paralelos se usan las
[[03-leyes-de-kirchhoff|leyes de Kirchhoff]].

## Fuerza electromotriz

> **Definición.** La **fuerza electromotriz** (fem) $\varepsilon$ de una fuente es la
> diferencia de potencial, medida en volts, que la fuente es capaz de sostener. Para una
> batería, $\varepsilon$ es el voltaje máximo que puede suministrar entre sus terminales.

A pesar del nombre, la fem no es una fuerza sino una diferencia de potencial: es la energía
que la fuente entrega por unidad de carga que la atraviesa.

## Resistencia interna

Una batería real no entrega toda su fem a la parte externa del circuito: parte de la caída
de potencial ocurre dentro de la propia fuente, modelada como una **resistencia interna**
$r$ en serie con la fem. Recorriendo la batería, la diferencia de potencial disponible en
sus terminales es la fem menos lo que cae en $r$:

$$\Delta V = \varepsilon - I\,r$$

donde $I$ es la corriente que la atraviesa. Si la fuente alimenta una resistencia externa
$R$, entonces $\Delta V = I R$, y combinando ambas expresiones se despeja la corriente del
circuito:

$$I\,R = \varepsilon - I\,r \;\Longrightarrow\; I = \frac{\varepsilon}{R + r}$$

> **Observación.** La corriente queda determinada por la fem y por la suma de la resistencia
> externa y la interna. En el caso ideal $r = 0$ se recupera $I = \varepsilon/R$ y la tensión
> en terminales coincide con la fem.

## Energía en el circuito

La potencia que entrega la fuente es $P = \Delta V\,I$, de modo que la energía suministrada
por la pila en un tiempo $\Delta t$ es

$$E_{\text{pila}} = P\,\Delta t$$

Parte de esa energía se disipa como calor en los resistores. La energía disipada por un
resistor $R$ recorrido por corriente $I$ durante $\Delta t$ es

$$E_{\text{disp}} = I^2 R\,\Delta t$$

La energía neta que queda en el circuito es la diferencia entre lo entregado por la fuente y
lo disipado:

$$E_{\text{tot}} = E_{\text{pila}} - E_{\text{disp}}$$

## Combinación de resistores

Varios resistores se pueden reemplazar por un único resistor equivalente $R_{eq}$, según
estén conectados en serie o en paralelo.

### Resistores en serie

En una conexión en serie los resistores comparten la misma corriente y las caídas de
potencial se suman. Con $I = I_1 = I_2$:

$$\Delta V = \Delta V_1 + \Delta V_2 = I_1 R_1 + I_2 R_2$$

Como $\Delta V = I\,R_{eq}$, la resistencia equivalente es la suma de las resistencias:

$$R_{eq} = R_1 + R_2 + \cdots$$

### Resistores en paralelo

En una conexión en paralelo todos los resistores comparten la misma diferencia de potencial
y la corriente total se reparte entre ellos. Con $\Delta V = \Delta V_1 = \Delta V_2$:

$$I = I_1 + I_2 = \frac{\Delta V_1}{R_1} + \frac{\Delta V_2}{R_2}$$

Escribiendo $I = \Delta V / R_{eq}$, la inversa de la resistencia equivalente es la suma de
las inversas:

$$\frac{1}{R_{eq}} = \frac{1}{R_1} + \frac{1}{R_2} + \cdots$$

| Conexión | Magnitud común | Resistencia equivalente |
|---|---|---|
| Serie | corriente $I$ | $R_{eq} = \sum_i R_i$ |
| Paralelo | tensión $\Delta V$ | $\dfrac{1}{R_{eq}} = \sum_i \dfrac{1}{R_i}$ |

**Observación.** En serie la equivalente es siempre mayor que la mayor de las resistencias;
en paralelo es siempre menor que la menor. Reducir la red combinando series y paralelos es el
primer paso para analizar un circuito antes de recurrir a Kirchhoff.

---

## Ver también

- [[01-corriente-y-ley-de-ohm]] — corriente, resistencia y potencia
- [[03-leyes-de-kirchhoff]] — redes que no se reducen a serie/paralelo
