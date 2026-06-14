---
tags: [unit-07, formula]
aliases: [perpetuidad, renta perpetua, perpetuidad creciente, Gordon]
---

## Definición

**Perpetuidad:** flujo de caja que se recibe (teóricamente) **por siempre**. Es el "atajo" más potente del cálculo financiero: una suma infinita de descuentos colapsa en una división.

## Fórmula

**Constante:**

$$\boxed{VA = \frac{C}{i}} \qquad \Leftrightarrow \qquad i = \frac{C}{VA} \ \text{(rendimiento)}$$

**Donde:**
- $VA$: valor actual, un período antes del primer flujo
- $C$: flujo constante por período
- $i$: tasa de interés del período

**Creciente a tasa $g$ (modelo de Gordon):**

$$VA = \frac{C_1}{i-g} \qquad (i > g)$$

**Donde:**
- $C_1$: flujo del **próximo** período (el primero)
- $g$: tasa de crecimiento constante del flujo

**Diferida** (primer flujo en $t+1$): la fórmula entrega el valor en $t$; se trae a 0 dividiendo:

$$VA_0 = \frac{C}{i} \cdot \frac{1}{(1+i)^t}$$

> **Aclaración de la FAQ de la cátedra:** "el VP se obtiene un período antes del primer flujo" significa: si el flujo comienza en $t=11$, $C/i$ da el VP en $t=10$; si comenzara en $t=35$, lo daría en $t=34$ y para llevarlo a $t=0$ hay que **dividirlo** por $(1+i)^{34}$.
>
> En la creciente, lo que crece es el **monto del flujo** respecto del año anterior: si rinde \$100.000 en el año 11 y crece 2%, paga \$102.000 en el 12, \$104.040 en el 13, etc.

## Ejemplo

**Guía ej. 2 (plan de jubilación, $i=10\%$):** ¿cuánto vale en $t=10$ cada meta?
- Perpetuidad de \$100.000 desde el año 11: $V_{10} = 100.000/0{,}10 = 1.000.000$.
- La misma pero creciendo al 2%: $V_{10} = 100.000/(0{,}10-0{,}02) = 1.250.000$.
- Comparar: la [[anualidades|anualidad]] de \$100.000 por solo 20 años vale $851.356$ — la cola infinita "cuesta" sorprendentemente poco ($\approx 15\%$ del valor).

## Intuición / Por qué importa

- **El infinito vale finito** porque los flujos lejanos se descuentan exponencialmente.
- Valuación de [[acciones-renta-variable]]: precio = dividendo perpetuo descontado ($P^A = D/i$ o Gordon $D_1/(i-g)$).
- Bonos perpetuos (consols) y la lógica del [[bonos-renta-fija|precio de un bono]] cuando $N$ es muy grande.
- Sirve de **cota mental rápida**: el VP de cualquier anualidad larga está apenas por debajo de $C/i$.

## Errores comunes / Distinciones

- **Olvidar descontar la perpetuidad diferida**: $C/i$ NO es un valor de hoy si el flujo no arranca el período que viene.
- **Usar Gordon con $g \geq i$**: el VP diverge; la fórmula exige $i > g$.
- **Usar $C_0$ en lugar de $C_1$** en la creciente: va el flujo del próximo período.
- **Confundir el momento del primer flujo**: "rinde $100.000 al final del año 11" ⇒ primer flujo en $t=11$, VP en $t=10$.

## Relacionado con
- [[anualidades]] — anualidad = resta de dos perpetuidades
- [[acciones-renta-variable]] — aplicación directa (Gordon)
- [[bonos-renta-fija]]
- [[formulas/unidad-07]]
