---
tags: [resuelto, unidad-3, resortes, conservacion-energia, potencia]
fuente: raw/apuntes-2023-2c/practica-fisica-1.pdf
unidad: 3
tipo: resuelto
actualizado: 2026-07-05
---

# Guía resuelta: energía con resortes y potencia

Problemas de la Guía 3 de los apuntes de la cursada 2023-2C. Todos aplican la relación general
[[02-energia-potencial-y-conservacion|$W_{nc} = \Delta K + \Delta U$]], con
$\Delta U = \Delta U_g + \Delta U_e$. Se usa $g \approx 10\ \text{m/s}^2$.

## Cuerpo unido a un resorte sobre una guía vertical

Un cuerpo de masa $m = 2\ \text{kg}$ está unido a un resorte de constante $k = 30\ \text{N/m}$ y
longitud natural $l_0 = 0{,}75\ \text{m}$. Parte del reposo en un punto $A$ con el resorte
horizontal y sin deformar, y desliza hasta un punto $B$ ubicado $1\ \text{m}$ más abajo. Se pide la
rapidez $v_B$ en $B$.

Por geometría, la longitud del resorte en $B$ (hipotenusa del triángulo de catetos $l_0$ y el
descenso de $1\ \text{m}$) es

$$l = \sqrt{l_0^2 + 1^2} = \sqrt{0{,}75^2 + 1^2} = \tfrac{5}{4}\ \text{m}$$

y la deformación vale $d = l - l_0 = 0{,}5\ \text{m}$. Como no hay fuerzas no conservativas,
$W_{nc} = 0$ y la energía mecánica se conserva:

$$0 = \Delta K + \Delta U_g + \Delta U_e = \tfrac{1}{2}m\,(v_B^2 - 0) - mg\,(1) + \tfrac{1}{2}k\,d^2$$

Despejando la rapidez en $B$:

$$v_B = \sqrt{\frac{2mg\,(1) - k\,d^2}{m}} = 4{,}03\ \text{m/s}$$

## Dos bloques con resortes sobre una polea

Dos bloques de masas $m_1 = 5\ \text{kg}$ y $m_2 = 10\ \text{kg}$ cuelgan de una polea; cada uno
está sujeto además a un resorte de constante $k = 250\ \text{N/m}$ anclado al piso. Se sueltan desde
el reposo con los resortes sin deformar y se busca su rapidez máxima.

La rapidez es máxima al pasar por la posición de equilibrio. Planteando allí las ecuaciones de cada
bloque ($0 = -F_e - m_1 g + t$ para uno y $0 = t - m_2 g + F_e$ para el otro) se obtiene la
deformación de cada resorte en el equilibrio:

$$d = \frac{g\,(m_2 - m_1)}{2k} = 0{,}1\ \text{m}$$

Como esa deformación coincide con el desplazamiento de cada bloque desde la longitud natural, la
conservación de la energía entre la posición de partida (resortes sin deformar) y la de equilibrio
—donde la rapidez es máxima— da

$$0 = \tfrac{1}{2}m_1 v^2 + m_1 g\, d + 2\cdot\tfrac{1}{2}k\, d^2 + \tfrac{1}{2}m_2 v^2 - m_2 g\, d$$

de donde

$$v^2 = 2\,\frac{g\,d\,(m_2 - m_1) - k\,d^2}{m_1 + m_2} \;\Longrightarrow\; v \approx 0{,}57\ \text{m/s}$$

## Potencia para subir por un plano inclinado

Se sube un cuerpo de masa total $m = m_A + m_B = 70\ \text{kg}$ por un plano inclinado de ángulo
$\alpha = 10^\circ$, a **velocidad constante** $v = 10\ \text{km/h} = 2{,}78\ \text{m/s}$. Se pide la
potencia desarrollada.

Como la velocidad es constante, $\Delta K = 0$ y la fuerza aplicada equilibra exactamente la
componente del peso a lo largo del plano, $F = mg\sin\alpha$. La potencia es entonces

$$P = F \cdot v = mg\sin\alpha \; v = 337\ \text{W}$$

**Observación.** Al ser $v$ constante, toda la potencia entregada se invierte en aumentar la
energía potencial gravitatoria del cuerpo; no hay cambio de energía cinética.

> **Nota.** Varias respuestas finales de esta guía quedan interrumpidas o sin recuadrar en los
> apuntes originales (por ejemplo los ejercicios 3.7, 3.8 y 3.9); por eso no se incluyen aquí sus
> resultados numéricos. Los tres casos transcriptos arriba sí tienen resultado cerrado en la fuente.

---

## Ver también

- [[01-trabajo-y-energia-cinetica]] — trabajo, energía cinética y potencia
- [[02-energia-potencial-y-conservacion]] — energía potencial y $W_{nc} = \Delta K + \Delta U$
- [[index]] — índice del vault
