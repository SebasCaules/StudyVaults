---
tags: [resuelto, unidad-5, capacitores, redes, redistribucion-de-carga]
fuente: raw/practicas/practica-fisica-3.pdf
unidad: 5
tipo: resuelto
actualizado: 2026-07-05
---

# Redes de capacitores y redistribución de carga (resueltos)

Problemas resueltos de la guía 3 de la cursada 2024-1C: reducción de una red serie/paralelo,
redistribución de carga al reconectar capacitores cargados, una red con llave y el cambio de
energía al insertar un dieléctrico. Toda la teoría de base está en [[01-capacitores]] y
[[02-dielectricos]]. La idea recurrente en la redistribución es la **conservación de la carga**
en cada nodo aislado.

## Reducción de una red (3.2)

Una red de capacitores con $C_2 = 2\ \mu\mathrm{F}$ y $C_3 = 3\ \mu\mathrm{F}$ alimentada por
una fuente de $900\ \mathrm{V}$. Se resuelve **colapsando por etapas**: se identifica un grupo
en serie o en paralelo, se lo reemplaza por su equivalente y se repite. La red del problema
alterna tramos de tres $C_3$ en serie con tramos donde aparece un $C_2$ en paralelo.

Cada terna de $C_3$ en serie da $\dfrac{1}{C_{eq}} = \dfrac{1}{C_3}+\dfrac{1}{C_3}+\dfrac{1}{C_3}$, es decir $C_{eq} = 1\ \mu\mathrm{F}$. Al sumarle en paralelo un $C_2$ se obtiene
$C_2 + 1\ \mu\mathrm{F} = 3\ \mu\mathrm{F}$, que vuelve a entrar en serie con dos $C_3$, y así
sucesivamente. Tras cuatro rondas de reducción la capacidad equivalente vista por la fuente es:

$$C_{eq} = 1\ \mu\mathrm{F}$$

Recorriendo las etapas hacia atrás (con $Q = C\,\Delta V$ en cada nivel y repartiendo carga y
voltaje) se llega a la carga del primer capacitor, $Q_1 = 300\ \mu\mathrm{C}$.

> **Nota.** El original desarrolla la reducción capacitor por capacitor con un dibujo por
> etapa; acá se resume el procedimiento y los valores de cierre.

## Serie y luego reconexión en paralelo (3.4)

Dos capacitores **descargados**, $C_1 = 1\ \mu\mathrm{F}$ y $C_2 = 2\ \mu\mathrm{F}$.

**a)** Conectados en **serie** a una fuente de $1200\ \mathrm{V}$. El equivalente serie es:

$$C_{eq} = \frac{1}{\tfrac{1}{C_1} + \tfrac{1}{C_2}} = \tfrac{2}{3}\ \mu\mathrm{F}$$

En serie ambos llevan la misma carga, $Q_1 = Q_2 = \Delta V\, C_{eq} = 800\ \mu\mathrm{C}$. Los
voltajes se reparten según cada capacidad:

$$V_1 = \frac{Q_1}{C_1} = 800\ \mathrm{V}, \qquad V_2 = \frac{Q_2}{C_2} = 400\ \mathrm{V}$$

que suman los $1200\ \mathrm{V}$ de la fuente.

**b)** Se los desconecta y se reconectan **en paralelo** (placas del mismo signo juntas). La
carga total se conserva:

$$Q_{\text{tot}} = Q_1 + Q_2 = 1600\ \mu\mathrm{C}, \qquad C_{eq} = C_1 + C_2 = 3\ \mu\mathrm{F}$$

El voltaje común final es $V_f = \dfrac{Q_{\text{tot}}}{C_{eq}} = 533{,}\overline{3}\ \mathrm{V}$, y las cargas se redistribuyen:

$$Q_{f1} = C_1 V_f = 533{,}\overline{3}\ \mu\mathrm{C}, \qquad Q_{f2} = C_2 V_f = 1066{,}\overline{6}\ \mu\mathrm{C}$$

## Redistribución con polaridades opuestas (3.5)

Dos capacitores ya cargados se conectan con una fuente de $600\ \mathrm{V}$ de forma que las
placas enfrentadas tienen **signos opuestos**: $C_1 = 4\ \mu\mathrm{F}$ con $900\ \mu\mathrm{C}$ ($V_{i1} = 225\ \mathrm{V}$) y $C_2 = 2\ \mu\mathrm{F}$ con $300\ \mu\mathrm{C}$
($V_{i2} = 150\ \mathrm{V}$). Por la orientación, la carga neta que se conserva en la isla es la
**diferencia**:

$$Q_{f1} - Q_{f2} = Q_t = 1200\ \mu\mathrm{C}$$

Con la restricción de malla $\dfrac{Q_{f1}}{C_1} + \dfrac{Q_{f2}}{C_2} = 600\ \mathrm{V}$ y
$Q_{f1} = 1200 + Q_{f2}$, se despeja:

$$Q_{f2} = \frac{600\ \mathrm{V}\cdot C_1 C_2 - 1200\ \mathrm{V}\cdot C_2}{C_2 + C_1} = 400\ \mu\mathrm{C}, \qquad Q_{f1} = 1600\ \mu\mathrm{C}$$

$$V_{f1} = \frac{Q_{f1}}{C_1} = 400\ \mathrm{V}, \qquad V_{f2} = \frac{Q_{f2}}{C_2} = 200\ \mathrm{V}$$

## Red con llave (3.6)

Tres capacitores $C_1, C_2, C_3$ con una fuente $V_0$ y una llave $S$.

**Caso 1 — llave abierta.** Solo $C_1$ queda conectado a la fuente:

$$Q_1 = V_0\, C_1$$

**Caso 2 — llave cerrada.** Se plantea Kirchhoff sobre las cargas. La conservación en los
nodos da $Q_3 = Q_2$ y $Q_2 + Q_1 = C_1 V_0$, y la malla de voltajes:

$$\frac{Q_2}{C_2} + \frac{Q_3}{C_3} - \frac{Q_1}{C_1} = 0$$

Combinando, la carga de $C_2$ (igual a la de $C_3$) resulta:

$$Q_2 = \frac{V_0\, C_1 C_2 C_3}{C_1 C_2 + C_1 C_3 + C_2 C_3} = Q_3$$

y la carga de $C_1$ con la llave cerrada:

$$Q_1 = C_1 V_0\left(\frac{C_1 C_2 + C_1 C_3}{C_1 C_2 + C_1 C_3 + C_2 C_3}\right)$$

## Cambio de energía al insertar un dieléctrico (3.7)

Dos capacitores iguales $C_0 = \dfrac{\varepsilon_0 A}{d}$ en paralelo a una fuente $V_0$. La
carga total inicial es $Q_{\text{tot}} = Q_1 + Q_2 = 2 V_0 C_0$, con $Q_1 = Q_2 = V_0 C_0$.

Luego se inserta un dieléctrico en uno de ellos, que pasa a valer $C_1 = 2 C_0$, y quedan
**en serie**. La carga total se conserva, $Q_{\text{tot}} = 2 V_0 C_0$, y por Kirchhoff
$\dfrac{Q_{f1}}{C_1} - \dfrac{Q_{f2}}{C_0} = 0 \Rightarrow Q_{f1} = 2 Q_{f2}$. Con
$Q_{f1} + Q_{f2} = 3 Q_{f2} = 2 V_0 C_0$:

$$Q_{f2} = \tfrac{2}{3} V_0 C_0, \qquad Q_{f1} = \tfrac{4}{3} V_0 C_0$$

Comparando las energías inicial y final (usando $U = Q^2 / 2C$):

$$U_i = \frac{Q_1^2 + Q_2^2}{2 C_0} = V_0^2 C_0, \qquad U_f = \frac{Q_{f1}^2}{2 C_1} + \frac{Q_{f2}^2}{2 C_0} = \tfrac{2}{3} V_0^2 C_0$$

de donde el cambio de energía es negativo:

$$\Delta U = U_f - U_i = -\tfrac{1}{3} V_0^2 C_0$$

El sistema pierde energía, coherente con que el capacitor tiende a incorporar el dieléctrico
(ver [[02-dielectricos]]).

---

## Ver también

- [[01-capacitores]] — capacidad, combinación serie/paralelo y energía
- [[02-dielectricos]] — permitividad relativa y energía con dieléctrico
