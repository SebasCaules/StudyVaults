---
tags: [unit-03, bienestar, micro]
---

## Definición

**Excedente del productor (EP):** diferencia entre lo que la empresa **recibe** por sus ventas y el **costo variable** de producirlas. Es el área entre el precio de mercado y la curva de oferta, hasta la cantidad transada. Mide el "valor extra" que la firma obtiene respecto del mínimo al que estaría dispuesta a vender.

## Fórmula

$$EP = \int_0^{Q^*} [P - CMg(q)]\, dq$$

Donde:
- $EP$: excedente del productor
- $P$: precio de mercado (constante)
- $CMg(q)$: costo marginal de la unidad $q$
- $Q^*$: cantidad transada en equilibrio

Para oferta lineal y precio constante (caso parcial):
$$EP = \frac{1}{2} \cdot (P - P_{min}) \cdot Q^*$$

Donde:
- $P_{min}$: ordenada al origen de la oferta (precio al que la primera unidad apenas se ofrecía)

**Equivalentemente:** $EP = I - CV = P \cdot Q - CV$ — ingreso total menos costo variable total. **No** descuenta costos fijos.

Donde:
- $I$: ingreso total
- $CV$: costo variable total

## Intuición / Por qué importa

- En CP, **la curva de oferta = $CMg$** → $EP$ es la diferencia acumulada entre $P$ y $CMg$, unidad por unidad.
- $EP$ junto con [[excedente-consumidor|EC]] mide el bienestar total: $W = EC + EP$.
- En CP el equilibrio competitivo **maximiza** $W$ — primer teorema fundamental del bienestar.
- Cualquier intervención (impuesto, control de precio, monopolio) reduce $EP$ y/o $EC$, generando [[deadweight-loss|DWL]].

**Atención:** $EP$ no es lo mismo que beneficio económico. $EP = I - CV$ pero $\pi = I - CT = EP - CF$. En CP de LP, $\pi = 0$ pero $EP > 0$ — todo el EP se va a pagar costos fijos.

## Ejemplo

Mercado con oferta $P = 2 + Q$ y demanda $P = 14 - Q$. Equilibrio: $Q^* = 6$, $P^* = 8$.

$$EP = \frac{1}{2} \cdot (8 - 2) \cdot 6 = 18$$

(Triángulo entre $P = 8$ horizontal y la oferta, desde $Q = 0$ a $Q = 6$.)

## Errores comunes / Distinciones

- **Confundir EP con beneficio.** $EP$ no incluye CF. $\pi = EP - CF$.
- **Tomar el área debajo del precio en lugar de arriba de la oferta.** El EP está entre el precio (arriba) y la curva de oferta (abajo).
- **Olvidar que con impuesto cambia la oferta, pero el $EP$ se calcula con la oferta original.** Hay que separar: $EP$ tras impuesto + recaudación + DWL = $EP$ original − pérdida.


## Gráfico

![[excedente-consumidor-productor.svg]]
## Relacionado con
- [[excedente-consumidor]]
- [[deadweight-loss]]
- [[curva-oferta-empresa]]
- [[incidencia-impuestos]]
