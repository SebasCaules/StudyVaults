---
tags: [unit-01, micro]
---

## Definición

**Equilibrio de mercado** es el par precio-cantidad $(P^*, Q^*)$ donde la cantidad demandada iguala a la ofrecida: $Q_d(P^*) = Q_s(P^*)$. En ese punto el mercado se "vacía" — no hay escasez ni excedente — y no existen presiones para cambiar el precio.

## Fórmula

$$Q_d(P^*) = Q_s(P^*)$$

Donde:
- $P^*$: precio de equilibrio
- $Q_d(P)$: cantidad demandada en función del precio
- $Q_s(P)$: cantidad ofrecida en función del precio

Para curvas lineales $Q_d = a - bP$ y $Q_s = c + dP$, despejando: $P^* = (a-c)/(b+d)$.

Donde:
- $a, c$: ordenadas al origen de demanda y oferta
- $b, d$: pendientes (en valor absoluto) de demanda y oferta

## Intuición / Por qué importa

Es el concepto más usado de toda la unidad: dado un sistema de oferta y demanda, todo análisis (impuestos, controles, subsidios, shocks externos) parte de comparar el equilibrio antes y después. Es **estable**: si $P > P^*$ aparece exceso de oferta y los oferentes bajan el precio; si $P < P^*$ aparece exceso de demanda y los compradores empujan el precio hacia arriba. La mano invisible de Adam Smith opera exactamente acá.

## Ejemplo

$Q_d = 100 - 2P$, $Q_s = 20 + 2P$. Igualando: $100 - 2P = 20 + 2P \Rightarrow P^* = 20$, $Q^* = 60$.

Si por shock se desplaza la demanda a $Q_d' = 120 - 2P$, el nuevo equilibrio es $P^* = 25$, $Q^* = 70$.

## Errores comunes / Distinciones

- **No confundir equilibrio con eficiencia social** — son conceptos distintos (eficiencia se trata en Unidad 3).
- Si te dan $Q_d$ y $Q_s$ como funciones $P(Q)$ (precio como función de cantidad), igualar las funciones de $Q$ después de despejar.
- Cuando hay impuestos, el equilibrio se rompe en dos precios: el que recibe el oferente y el que paga el demandante.


## Gráfico

![[oferta-demanda-equilibrio.svg]]
## Relacionado con
- [[oferta-demanda]]
- [[desplazamientos-curvas]]
- [[excedente-consumidor]]
- [[controles-de-precios]]
