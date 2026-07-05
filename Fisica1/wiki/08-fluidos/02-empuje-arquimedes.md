---
tags: [teoria, unidad-8, empuje, arquimedes, flotacion]
fuente: apuntes de la cursada 2023-2C (teórica, unidad 8; práctica, guía 8)
unidad: 8
tipo: teoria
actualizado: 2026-07-05
---

# Empuje y principio de Arquímedes

Cuando un cuerpo se sumerge en un fluido, la presión sobre su cara inferior es mayor
que sobre la superior (porque crece con la profundidad, ver
[[01-hidrostatica]]). Esa diferencia de presiones produce una fuerza neta hacia
arriba: el **empuje**.

## El empuje

Para un cuerpo de sección $A$ y altura $h$ sumergido, la fuerza neta vertical debida
al fluido es la diferencia de presiones entre el fondo y la cara superior por el área:

$$E = \big(P_{\text{fondo}} - P_{\text{sup}}\big)\,A = \rho\, g\, h\, A$$

Como $h\,A$ es el volumen del cuerpo, se obtiene la forma compacta.

> **Principio de Arquímedes.** Todo cuerpo sumergido en un fluido recibe un empuje
> vertical hacia arriba igual al peso del fluido desalojado,
> $$E = \rho\, g\, V$$
> donde $\rho$ es la densidad del **fluido**, $g$ la gravedad y $V$ el volumen de
> fluido desplazado.

## Cuerpo totalmente sumergido

Si el cuerpo está totalmente sumergido, el volumen desplazado es su volumen completo,
$V = V_{\text{obj}}$. Entonces el empuje y el peso valen

$$E = \rho_L\, g\, V_{\text{obj}}, \qquad P = \rho_{\text{obj}}\, g\, V_{\text{obj}}$$

donde $\rho_L$ es la densidad del líquido y $\rho_{\text{obj}}$ la del cuerpo.
Comparando ambas fuerzas se decide el destino del cuerpo:

- Si $\rho_{\text{obj}} > \rho_L$: pesa más de lo que empuja, **se hunde**.
- Si $\rho_{\text{obj}} < \rho_L$: el empuje gana, **flota** (sube hasta emerger).

## Cuerpo que flota

Un cuerpo que flota en equilibrio tiene empuje igual a peso, $E = P$, pero solo una
parte de su volumen queda sumergida. Igualando,

$$\rho_L\, g\, V_L = \rho_{\text{obj}}\, g\, V_{\text{obj}} \quad\Longrightarrow\quad \frac{V_L}{V_{\text{obj}}} = \frac{\rho_{\text{obj}}}{\rho_L}$$

donde $V_L$ es el volumen de la **parte sumergida** del cuerpo y $V_{\text{obj}}$ su
volumen total. La fracción sumergida es exactamente el cociente de densidades.

> **Ejemplo.** Un cuerpo de $m = 1{,}5\ \mathrm{kg}$ flota en agua
> ($\rho_L = 1000\ \mathrm{kg/m^3}$) con el $68\%$ de su volumen sumergido,
> $V_L = 0{,}68\,V_{\text{obj}}$. De la fracción sumergida,
> $\rho_{\text{obj}} = 0{,}68\,\rho_L = 680\ \mathrm{kg/m^3}$, y su volumen es
> $V_{\text{obj}} = m/\rho_{\text{obj}} = 1{,}5/680 \approx 2{,}21\cdot 10^{-3}\ \mathrm{m^3}$.
> Para hundirlo por completo hay que agregarle una masa $m_p$ tal que la densidad media
> del conjunto iguale la del agua, $\rho_L = (m + m_p)/V_{\text{obj}}$; de ahí
> $m_p \approx 0{,}71\ \mathrm{kg}$.

> **Ejemplo.** Un mismo cuerpo flota con el $80\%$ sumergido en un líquido de
> $\rho_{L_1} = 1000\ \mathrm{kg/m^3}$ y con el $72\%$ en otro líquido de densidad
> $\rho_{L_2}$. Como el peso del cuerpo no cambia, $\rho_{L_1}\,0{,}8 = \rho_{L_2}\,0{,}72$,
> de donde $\rho_{L_2} = 1000\cdot 0{,}8/0{,}72 \approx 1111{,}11\ \mathrm{kg/m^3}$.
> La densidad del cuerpo es $\rho_{\text{obj}} = 0{,}8\,\rho_{L_1} = 800\ \mathrm{kg/m^3}$.

## Medición con dinamómetro

Un dinamómetro que sostiene un cuerpo mide su peso aparente. Con el cuerpo en el aire
la lectura es $T_1$; sumergido en un líquido, la lectura baja a $T_2$ (porque el
empuje descarga parte del peso). Del equilibrio en cada caso:

$$T_1 - mg = 0 \;\Longrightarrow\; T_1 = mg = \rho_{\text{obj}}\, V g \quad (1)$$

$$T_2 + E - mg = 0 \;\Longrightarrow\; E = mg - T_2 = T_1 - T_2 = \rho_L\, V g \quad (2)$$

Dividiendo $(1)$ entre $(2)$ se cancelan $V$ y $g$, y queda la densidad relativa del
cuerpo respecto del líquido:

$$\frac{T_1}{T_1 - T_2} = \frac{\rho_{\text{obj}}\, V g}{\rho_L\, V g} = \frac{\rho_{\text{obj}}}{\rho_L} = \rho_r$$

Así, pesando el cuerpo en el aire y sumergido se obtiene su densidad relativa sin
medir directamente el volumen.

---

## Ver también

- [[01-hidrostatica]] — presión, $P = P_0 + \rho g h$ y densidad (base del empuje)
- [[03-hidrodinamica-bernoulli]] — fluidos en movimiento: continuidad, Bernoulli, Torricelli
