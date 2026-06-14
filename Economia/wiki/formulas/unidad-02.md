---
unit: 02
title: Fórmulas — Unidad 2 (Producción y Costos)
---

## Función de producción

$$Q = F(K, L)$$

Donde:
- $Q$: producto total (output físico)
- $K$: capital (fijo en corto plazo)
- $L$: trabajo (factor variable)

**Función Cobb-Douglas** (caso típico de parcial):
$$Q = A \cdot K^\alpha \cdot L^\beta$$

Donde:
- $A$: parámetro de productividad total de los factores
- $\alpha, \beta$: elasticidades-producto del capital y del trabajo

**Rendimientos a escala según $\alpha + \beta$:**
- $\alpha + \beta > 1$ → **crecientes**
- $\alpha + \beta = 1$ → **constantes**
- $\alpha + \beta < 1$ → **decrecientes**

**Productividades marginales (Cobb-Douglas):**
$$PMg_L = \beta \cdot \frac{Q}{L}, \qquad PMg_K = \alpha \cdot \frac{Q}{K}$$

## Productividades

**Producto medio del trabajo:**
$$PMe_L = \frac{Q}{L}$$

Donde:
- $PMe_L$: productividad media del trabajo (output por trabajador)

**Producto marginal del trabajo:**
$$PMg_L = \frac{\Delta Q}{\Delta L} = \frac{\partial Q}{\partial L}$$

Donde:
- $PMg_L$: productividad marginal del trabajo (aporte de la última unidad de $L$)

**Relación PMg ↔ PMe:** $PMg$ corta a $PMe$ en su **máximo**.

## Costos

**Costo total:**
$$CT = CF + CV$$

Donde:
- $CT$: costo total
- $CF$: costo fijo (independiente de $Q$)
- $CV$: costo variable (depende de $Q$)

**Costo variable (si solo L es variable):**
$$CV = w \cdot L$$

Donde:
- $w$: salario unitario del trabajo

**Costos medios:**
$$CFMe = \frac{CF}{Q} \quad CVMe = \frac{CV}{Q} \quad CTMe = \frac{CT}{Q} = CFMe + CVMe$$

Donde:
- $CFMe$: costo fijo medio (decreciente; tiende a 0)
- $CVMe$: costo variable medio (forma de U)
- $CTMe$: costo total medio (forma de U)

**Costo marginal:**
$$CMg = \frac{\Delta CV}{\Delta Q} = \frac{\partial CT}{\partial Q}$$

Donde:
- $CMg$: costo marginal (costo de la unidad adicional)

**Relación CMg ↔ productividad marginal:**
$$CMg = \frac{w}{PMg_L}$$

**Regla CMg ↔ CMe:**
- $CMg < CMe$ → $CMe$ decrece
- $CMg > CMe$ → $CMe$ crece
- $CMg$ corta a $CVMe$ y $CTMe$ en sus **mínimos**

## Rendimientos a escala (LP)

Si al multiplicar factores por $\lambda$, $Q$ se multiplica por:
- $> \lambda$ → **crecientes** (economías de escala, CMe_LP decreciente)
- $= \lambda$ → **constantes**
- $< \lambda$ → **decrecientes** (deseconomías, CMe_LP creciente)

## Elasticidad-costo

$$\varepsilon_C = \frac{\Delta C / C}{\Delta Q / Q} = \frac{CMg}{CMe}$$

Donde:
- $\varepsilon_C$: elasticidad-costo (cuánto varía $C$ ante 1% de cambio en $Q$)
- $C$: costo total ($CT$)
- $CMe$: costo medio ($CTMe$)

- $\varepsilon_C < 1$ → economías de escala
- $\varepsilon_C = 1$ → rendimientos constantes
- $\varepsilon_C > 1$ → deseconomías

## Ingreso y beneficio

**Ingreso total:** $I(q) = P(q) \cdot q$  
**Ingreso marginal:** $IMg = \dfrac{dI}{dq}$

Donde:
- $I(q)$: ingreso total como función de la cantidad vendida
- $P(q)$: precio en función de la cantidad (en CP es constante; en monopolio decreciente)
- $IMg$: ingreso marginal (variación del ingreso por la unidad adicional)

**Beneficio económico:**
$$\pi(q) = I(q) - C(q)$$

Donde:
- $\pi(q)$: beneficio económico
- $C(q)$: costo total económico

**Condición de maximización:**
$$\frac{d\pi}{dq} = 0 \Rightarrow IMg = CMg$$

**Beneficio contable:** $I - wL$  
**Beneficio económico:** $I - wL - rK$ (incluye costo de oportunidad del capital)

Donde:
- $r$: costo de oportunidad del capital propio
- $rK$: costo implícito del capital (alternativa renunciada)

## Tipologías de costo (clase)

| Tipo | Definición | Relevante para decisión |
|---|---|---|
| **Contable** | Desembolso monetario registrado | Sí (corto plazo) |
| **Económico** | Contable + costo de oportunidad de factores propios | Sí (decisión racional) |
| **De oportunidad** | Mejor alternativa renunciada | Sí, siempre |
| **Hundido (sunk)** | Ya gastado, no recuperable | **NO** — ignorar |
| **Fijo** | Independiente de $Q$ | Solo en LP |
| **Variable** | Depende de $Q$ | Sí |
| **Marginal** | Costo de la próxima unidad | Sí |
| **Recurrente / no recurrente** | Periódico vs único | Según contexto |
| **Directo / indirecto** | Imputable o no a un producto específico | Costos por producto |
| **Estándar** | Predefinido para control | Comparación con real |

**Regla práctica:** los costos hundidos no afectan decisiones óptimas (no aparecen en $CMg$).

## Punto de equilibrio (break-even)

Aparece en el apunte de la cátedra como caso elemental de costos vs ingresos:

$$Q^* = \frac{CF}{P - CV_u}$$

Donde:
- $Q^*$: cantidad de equilibrio (ingresos = costos totales)
- $CF$: costo fijo total
- $P$: precio unitario (constante)
- $CV_u$: costo variable unitario
- $P - CV_u$: **margen de contribución unitario**

Por encima de $Q^*$ la empresa cubre $CF$ y empieza a generar beneficio.

## Variables
- $K$: capital; $L$: trabajo; $w$: salario; $r$: costo de capital
- $Q$: producto total (output)
- $CF, CV, CT$: costos fijos, variables, totales
