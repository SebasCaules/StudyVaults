---
tags: [teoria, unidad-8, hidrostatica, densidad, presion, pascal]
fuente: apuntes de la cursada 2023-2C (teórica, unidad 8; práctica, guía 8)
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Hidrostática: densidad y presión

Un **fluido** puede ser líquido o gas. En Física 1 los tratamos siempre como
**incompresibles**, y se adaptan a la forma del recipiente que los contiene. Esta
página cubre las magnitudes de la estática de fluidos: densidad y sus variantes,
presión, la variación de la presión con la profundidad, la ley de Pascal y la
medición de presión.

## Densidad y magnitudes derivadas

> **Definición.** La densidad de un material es su masa por unidad de volumen,
> $$\rho = \frac{m}{V}$$
> donde $m$ es la masa y $V$ el volumen. Su unidad SI es $[\rho] = \mathrm{kg/m^3}$.

La **densidad relativa** compara un material contra el agua en condiciones de
referencia.

> **Definición.** La densidad relativa $\rho_r$ es el cociente entre la densidad de
> un material y la densidad del agua a $1\ \mathrm{atm}$ y $4\,^\circ\mathrm{C}$,
> $$\rho_r = \frac{\rho_{\text{mat}}}{\rho_{\text{H}_2\text{O},\,4^\circ\!,\,1\,\text{atm}}}$$
> con $\rho_{\text{H}_2\text{O}} = 1000\ \mathrm{kg/m^3}$. Es adimensional.

La **densidad aparente** se usa para sistemas con mucho gas o aire atrapado.

> **Definición.** Como el aire es mucho menos denso que el sólido
> ($\rho_{\text{aire}} \ll \rho_{\text{sólido}}$), la masa del sistema es
> prácticamente la del sólido ($m_{\text{sist}} = m_{\text{sólido}}$), y se define
> $$\rho_{\text{ap}} = \frac{m_{\text{sólido}}}{V_{\text{sist}}}$$
> donde $V_{\text{sist}}$ es el volumen total ocupado (sólido más huecos).

> **Definición.** La porosidad $\phi$ es el porcentaje de volumen hueco respecto del
> volumen total,
> $$\phi = \frac{V_t - V_m}{V_t}\cdot 100$$
> donde $V_t$ es el volumen total del sistema y $V_m$ el volumen del material macizo.

> **Definición.** El peso específico $\gamma$ es el peso del material por unidad de
> volumen,
> $$\gamma = \rho\, g$$
> donde $\rho$ es la densidad y $g$ la aceleración de la gravedad.

## Presión

> **Definición.** La presión es la fuerza **normal** aplicada por unidad de
> superficie; es una magnitud **escalar**,
> $$P = \frac{F_N}{S} \quad\Longrightarrow\quad dF_N = P\, dS$$
> donde $F_N$ es la componente normal de la fuerza y $S$ la superficie. Su unidad SI
> es $[P] = \mathrm{N/m^2} = \mathrm{Pa}$ (pascal).

## Variación de la presión con la profundidad

Consideremos un líquido de densidad $\rho$ en reposo. Al ser incompresible, $\rho$ es
uniforme en todo el líquido. Sobre una columna de sección $A$ y altura $h$, con la
superficie a presión $P_0$, el equilibrio vertical exige

$$\sum \vec F = 0 \quad\Longrightarrow\quad P\,A - Mg - P_0\,A = 0$$

Como $M = \rho V$ y el volumen de la columna es $V = A\,h$, resulta
$M = \rho A h$ y por lo tanto $Mg = \rho g A h$. Despejando:

$$P = P_0 + \rho\, g\, h$$

donde $P$ es la presión a profundidad $h$, $P_0$ la presión en la superficie, $\rho$
la densidad del líquido y $g$ la gravedad. La presión crece linealmente con la
profundidad.

> **Ejemplo.** Un tanque contiene un líquido de $\rho = 1205\ \mathrm{kg/m^3}$ hasta
> $h = 5\ \mathrm{m}$, con $P_0 = 101{,}3\ \mathrm{kPa}$ en la superficie. La presión
> absoluta en el fondo es
> $$P = P_0 + \rho g h = 101\,300 + 1205\cdot 10\cdot 5 \approx 161\,550\ \mathrm{Pa} = 161{,}55\ \mathrm{kPa}$$

## Ley de Pascal

> **Ley de Pascal.** Un cambio en la presión aplicada a un fluido se transmite **sin
> disminución** a todos los puntos del fluido y a las paredes del recipiente.

En una prensa hidráulica con dos émbolos de áreas $A_1$ y $A_2$, igualar la presión
en ambos da

$$\frac{F_1}{A_1} = \frac{F_2}{A_2} \quad\Longrightarrow\quad F_2 = F_1\,\frac{A_2}{A_1}$$

de modo que un émbolo grande multiplica la fuerza. Pero **nada es gratis**: el volumen
desplazado es el mismo en ambos lados,

$$A_1\,\Delta x_1 = A_2\,\Delta x_2 \quad\Longrightarrow\quad \Delta x_2 = \Delta x_1\,\frac{A_1}{A_2}$$

es decir, lo que se gana en fuerza se pierde en recorrido.

## Medición de presión

**Barómetro.** Un tubo cerrado y evacuado ($P = 0$ arriba) invertido sobre mercurio:
la columna de altura $h$ equilibra la presión atmosférica,

$$P_0 = \rho\, g\, h \quad\Longrightarrow\quad h = 760\ \mathrm{mm}\ \text{(mercurio)}$$

**Manómetro.** Un tubo en U conecta el recinto con la atmósfera. La lectura da

$$P = P_0 + \rho\, g\, h$$

donde $P$ es la **presión absoluta** y la diferencia $P - P_0$ es la **presión
manométrica** (lo que mide el instrumento por encima de la atmosférica).

---

## Ver también

- [[02-empuje-arquimedes]] — empuje y principio de Arquímedes, apoyados en $P = P_0 + \rho g h$
- [[03-hidrodinamica-bernoulli]] — fluidos en movimiento: continuidad y Bernoulli
