---
tags: [teoria, unidad-4, ondas, reflexion, transmision]
fuente: Apuntes manuscritos de la cursada 2024-2C (resumen + teórica)
unidad: 4
tipo: teoria
actualizado: 2026-07-05
---

# Reflexión y transmisión en una cuerda

Cuando un pulso que viaja por una cuerda llega a un punto donde cambia el medio —un tramo con
distinta densidad lineal de masa $\mu$— parte de la onda se **transmite** al nuevo tramo y
parte se **refleja** de vuelta. Esta página analiza cómo se reparten amplitud, velocidad y
energía, y los dos casos límite del extremo fijo y del extremo libre.

## Cuerda con dos tramos de distinta densidad

Se considera una cuerda formada por dos tramos de densidades lineales $\mu_1$ y $\mu_2$ unidos
en un punto. Un pulso incidente que viaja por el primer tramo, al llegar a la unión, se divide
en un pulso reflejado (vuelve por el tramo 1) y un pulso transmitido (sigue por el tramo 2).
Como la velocidad en cada tramo es $v = \sqrt{F/\mu}$ con la misma tensión $F$, el tramo más
denso es el más "lento".

**Caso $\mu_2 > \mu_1$** (pasa a un tramo más denso y lento):

- El pulso transmitido avanza más despacio que el incidente, $v_{\text{trans}} < v_{\text{inc}}$.
- El pulso reflejado **se invierte**: $v_{\text{refl}} = -v_{\text{inc}}$, disminuye su amplitud
  y **cambia su fase en $\pi$**.

**Caso $\mu_2 < \mu_1$** (pasa a un tramo menos denso y más rápido):

- El pulso transmitido avanza más rápido, $v_{\text{trans}} > v_{\text{inc}}$.
- El pulso reflejado **no se invierte**: $v_{\text{refl}} = -v_{\text{inc}}$ y disminuye su
  amplitud, pero conserva su fase.

> **Regla del signo.** Solo hay inversión de fase (cambio de $\pi$) cuando el pulso pasa hacia
> un medio **más denso** ($\mu_2 > \mu_1$). Al pasar hacia un medio menos denso, la reflexión
> conserva la fase.

### Reparto de energía

Las amplitudes de los pulsos reflejado y transmitido se relacionan a través de la
[[02-energia-y-potencia|energía]], que se conserva: la energía incidente se reparte entre la
transmitida y la reflejada.

$$E_{\text{inc}} = E_{\text{trans}} + E_{\text{refl}}$$

Como la energía de una onda es proporcional al cuadrado de la amplitud, $E \propto A^2$, esta
relación fija las amplitudes de los pulsos resultantes en función de las densidades de los dos
tramos.

## Casos límite: extremo fijo y extremo libre

Los dos extremos límite se obtienen llevando $\mu_2$ a sus valores extremos.

> **Extremo fijo ($\mu_2 \to \infty$).** El segundo tramo es tan denso que actúa como una
> pared: la cuerda queda **anclada**, con la condición de borde $\psi(x = L, t) = 0$. El pulso
> se refleja **invirtiéndose por completo** (cambio de fase $\pi$) y no se transmite nada.

> **Extremo libre ($\mu_2 \to 0$).** El segundo tramo no ofrece resistencia: el extremo queda
> **libre**. El pulso se refleja **sin invertirse** (conserva la fase) y tampoco se transmite
> energía.

En ambos casos límite no hay tramo real por donde transmitir energía, así que toda la energía
incidente vuelve reflejada. Por lo tanto, la amplitud del pulso reflejado iguala a la del
incidente:

$$A_{\text{inc}} = A_{\text{refl}}$$

## De la reflexión a las ondas estacionarias

Cuando en vez de un pulso incide una **onda armónica propagante** sobre el extremo, la onda
reflejada se superpone con la incidente. La suma de una onda que viaja hacia la derecha y su
reflejada hacia la izquierda, de igual frecuencia y amplitud, deja de ser una onda propagante y
da lugar a una **onda estacionaria** —el tema de la unidad siguiente—.

---

## Ver también

- [[01-ondas-propagantes]] — función de onda, sentido de propagación y $v = \sqrt{F/\mu}$
- [[02-energia-y-potencia]] — por qué $E \propto A^2$ y cómo se conserva la energía
