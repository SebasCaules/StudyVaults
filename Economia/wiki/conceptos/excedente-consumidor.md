---
tags: [unit-01, micro]
---

## Definición

**Excedente del consumidor (EC)** es la diferencia entre lo que el consumidor está **dispuesto a pagar** por un bien (su valoración, dada por la curva de demanda) y lo que **efectivamente paga** (el precio de mercado). Geométricamente: el área debajo de la curva de demanda y por encima de la línea horizontal $P = P^*$.

## Fórmula

$$EC = \int_0^{Q^*} D(q)\, dq - P^* \cdot Q^*$$

Donde:
- $EC$: excedente del consumidor (bienestar del comprador)
- $D(q)$: función inversa de demanda (precio máximo que paga por la unidad $q$)
- $Q^*$: cantidad de equilibrio
- $P^*$: precio de equilibrio

Para demanda lineal $P = a - bQ$ con equilibrio en $(P^*, Q^*)$, es un triángulo:

$$EC = \frac{1}{2} \cdot Q^* \cdot (a - P^*)$$

Donde:
- $a$: ordenada al origen de la demanda inversa (precio máximo de reserva)
- $b$: pendiente de la demanda inversa (en valor absoluto)

## Intuición / Por qué importa

Mide el **bienestar** del comprador en pesos: cuánto valor adicional obtiene del intercambio. Es central para evaluar el efecto de impuestos, controles de precios y monopolios — todos generan **pérdida de excedente** del consumidor. Se complementa con el **excedente del productor**, y la suma de ambos es la base del análisis de **eficiencia** (Unidades 3 y 4).

## Ejemplo

$P = 100 - Q$, $P^* = 40$, $Q^* = 60$.

$$EC = \frac{1}{2} \cdot 60 \cdot (100 - 40) = 1.800$$

Si por un impuesto el precio sube a $50$ y la cantidad cae a $50$:

$$EC' = \frac{1}{2} \cdot 50 \cdot (100 - 50) = 1.250$$

La pérdida de excedente del consumidor es $550$.

## Errores comunes / Distinciones

- El EC se calcula con la curva de **demanda**, no con la de oferta.
- En demandas lineales es siempre un triángulo — error común: olvidarse del $\frac{1}{2}$.
- Valores que se restan: hay que usar el precio que efectivamente se paga, no el de equilibrio sin impuesto.


## Gráfico

![[excedente-consumidor-productor.svg]]
## Relacionado con
- [[oferta-demanda]]
- [[equilibrio-mercado]]
- [[controles-de-precios]]
- [[deadweight-loss]]
