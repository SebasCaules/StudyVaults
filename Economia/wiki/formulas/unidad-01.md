---
unit: 01
title: Fórmulas — Unidad 1 (Oferta, Demanda, Elasticidades)
---

## Precios reales (deflactar)

$$P_{real} = P_{nominal} \cdot \frac{IPC_{base}}{IPC_{actual}}$$

Donde:
- $P_{real}$: precio expresado en moneda del año base
- $P_{nominal}$: precio observado en el año actual
- $IPC_{base}$: índice de precios del año base
- $IPC_{actual}$: índice de precios del año actual

Convierte precios nominales a precios de un año base usando IPC.

## Índices de precios (Laspeyres y Paasche)

Aparecen en la hoja oficial de fórmulas y volverán en Unidad 5 (deflactor del PBI).

**Índice de Laspeyres** (canasta fija del año base — usado para IPC):
$$IP_L = \frac{\sum_i P_i^t \cdot Q_i^o}{\sum_i P_i^o \cdot Q_i^o}$$

**Índice de Paasche** (canasta variable del período actual — usado para deflactor del PBI):
$$IP_P = \frac{\sum_i P_i^t \cdot Q_i^t}{\sum_i P_i^o \cdot Q_i^t}$$

Donde:
- $P_i^t, Q_i^t$: precio y cantidad del bien $i$ en el período corriente $t$
- $P_i^o, Q_i^o$: precio y cantidad del bien $i$ en el período base
- Laspeyres tiende a **sobreestimar** la inflación (no captura sustitución)
- Paasche tiende a **subestimar** (canasta ya ajustada por sustitución)

## Equilibrio de mercado

Igualar oferta y demanda:
$$Q_d(p) = Q_s(p)$$

Donde:
- $p$: precio del bien
- $Q_d(p)$: cantidad demandada en función del precio
- $Q_s(p)$: cantidad ofrecida en función del precio

## Elasticidad precio de la demanda

$$\eta = \frac{\Delta Q / Q}{\Delta P / P} = \frac{\partial Q}{\partial P} \cdot \frac{P}{Q}$$

Donde:
- $\eta$: elasticidad-precio de la demanda (adimensional)
- $Q$: cantidad demandada
- $P$: precio del bien

**Clasificación** (valor absoluto):
- $|\eta| > 1$ → **elástica**
- $|\eta| < 1$ → **inelástica**
- $|\eta| = 1$ → **unitaria**

**Interpretación:** Variación % en cantidad demandada ante 1% de cambio en precio.

## Elasticidad precio de la oferta

$$\varepsilon_p = \frac{\Delta Q_o / Q_o}{\Delta P / P} = \frac{\partial Q_o}{\partial P} \cdot \frac{P}{Q_o}$$

Donde:
- $\varepsilon_p$: elasticidad-precio de la oferta (adimensional, $\geq 0$)
- $Q_o$: cantidad ofrecida

## Elasticidad ingreso (renta) de la demanda

$$\varepsilon_Y = \frac{\Delta Q / Q}{\Delta Y / Y} = \frac{\partial Q}{\partial Y} \cdot \frac{Y}{Q}$$

Donde:
- $\varepsilon_Y$: elasticidad-ingreso de la demanda
- $Y$: ingreso del consumidor

**Clasificación:**
- $\varepsilon_Y > 1$ → **bien de lujo**
- $0 < \varepsilon_Y < 1$ → **bien básico (normal)**
- $\varepsilon_Y < 0$ → **bien inferior**

## Elasticidad cruzada

$$\varepsilon_{XY} = \frac{\Delta Q_X / Q_X}{\Delta P_Y / P_Y} = \frac{\partial Q_X}{\partial P_Y} \cdot \frac{P_Y}{Q_X}$$

Donde:
- $\varepsilon_{XY}$: elasticidad cruzada (efecto del precio de Y sobre la demanda de X)
- $Q_X$: cantidad demandada del bien X
- $P_Y$: precio del bien Y

**Clasificación:**
- $\varepsilon_{XY} > 0$ → **sustitutos**
- $\varepsilon_{XY} < 0$ → **complementarios**

## Gasto total y elasticidad

$$G = P \cdot Q$$

- Si $|\eta| > 1$ (elástica) → una baja de precio ↑ G
- Si $|\eta| < 1$ (inelástica) → una baja de precio ↓ G
- Si $|\eta| = 1$ → G no cambia

**Tabla de referencia (clase, demanda lineal $Q = 8000 - 1000P$):**

| $P$ | $Q$ | $\|\eta\|$ | Gasto $P\cdot Q$ |
|---|---|---|---|
| 8 | 0 | — | 0 |
| 7 | 1.000 | 7,00 | 7.000 |
| 6 | 2.000 | 3,00 | 12.000 |
| 5 | 3.000 | 1,67 | 15.000 |
| 4 | 4.000 | 1,00 | **16.000** (máx) |
| 3 | 5.000 | 0,60 | 15.000 |
| 2 | 6.000 | 0,33 | 12.000 |
| 1 | 7.000 | 0,14 | 7.000 |
| 0 | 8.000 | — | 0 |

El gasto se maximiza donde $|\eta| = 1$ (punto medio de la demanda lineal).

## Elasticidad-precio en demanda lineal

Para $Q = a - bP$:
$$\eta = -b \cdot \frac{P}{Q} = -b \cdot \frac{P}{a - bP}$$

- En el **intercepto con eje P** ($Q \to 0$): $|\eta| \to \infty$ (perfectamente elástica)
- En el **intercepto con eje Q** ($P = 0$): $|\eta| = 0$ (perfectamente inelástica)
- En el **punto medio**: $|\eta| = 1$ (unitaria)

## Excedente del consumidor

$$EC = \int_0^{Q^*} D(q) \, dq - P^* \cdot Q^*$$

Donde:
- $EC$: excedente del consumidor (bienestar del comprador)
- $D(q)$: función inversa de demanda (precio máximo que paga por la unidad $q$)
- $P^*, Q^*$: precio y cantidad de equilibrio

Para demanda lineal: triángulo bajo la demanda por encima de $P^*$.

**Fórmula práctica (demanda lineal $P = a - bQ$):**
$$EC = \frac{(a - P^*) \cdot Q^*}{2}$$

## Excedente del productor

$$EP = P^* \cdot Q^* - \int_0^{Q^*} S(q)\, dq$$

Para oferta lineal $P = c + dQ$:
$$EP = \frac{(P^* - c) \cdot Q^*}{2}$$

## Bienestar total

$$W = EC + EP$$

En equilibrio competitivo, $W$ se maximiza (primer teorema del bienestar). Cualquier intervención (precio máximo, mínimo, impuesto) reduce $W$ por **DWL**.

## Controles de precios

**Precio máximo** (techo $P_T < P^*$):
- Activo solo si $P_T < P^*$
- Cantidad transada: $Q = Q_s(P_T)$ (manda la oferta — el lado corto)
- Escasez: $Q_d(P_T) - Q_s(P_T) > 0$

**Precio mínimo** (piso $P_F > P^*$):
- Activo solo si $P_F > P^*$
- Cantidad transada: $Q = Q_d(P_F)$ (manda la demanda)
- Excedente: $Q_s(P_F) - Q_d(P_F) > 0$ (ej. desempleo con salario mínimo)

## Variables
- $Q, Q_d, Q_s$: cantidad (demandada, ofrecida)
- $P$: precio
- $Y$: ingreso
- $\eta$: elasticidad (adimensional)
