---
tags: [unit-02, micro]
---

## Definición

**Función de producción**: relación tecnológica que indica la cantidad máxima de output ($Q$) que puede obtenerse combinando unidades de los factores capital ($K$) y trabajo ($L$). Describe la **frontera tecnológica** de la empresa: cualquier combinación de factores tiene un techo de producción dado por la tecnología disponible.

## Fórmula

$$Q = F(K, L)$$

Donde:
- $Q$: producto total (output físico)
- $K$: capital (fijo en corto plazo)
- $L$: trabajo (factor variable)
- $F$: tecnología disponible

Casos típicos:
- **Cobb-Douglas:** $Q = A K^\alpha L^\beta$
- **Lineal:** $Q = aK + bL$
- **Leontief (proporciones fijas):** $Q = \min(K/a, L/b)$

Donde:
- $A$: parámetro de productividad total (Cobb-Douglas)
- $\alpha, \beta$: elasticidades parciales del output respecto a $K$ y $L$
- $a, b$: coeficientes técnicos (productividades constantes en lineal; insumos por unidad en Leontief)

## Distinción CP vs LP

- **Corto plazo:** al menos un factor es fijo (típicamente $K$). $Q = F(\bar K, L)$ — solo varía $L$.
- **Largo plazo:** todos los factores son variables. La empresa elige escala.

Ver [[corto-vs-largo-plazo]].

## Intuición / Por qué importa

Es el **punto de partida** de todo el análisis de costos: de la función de producción se derivan $PMg$, $PMe$, $CMg$ y los costos medios. La forma de las curvas de costos refleja directamente las propiedades de $F$. Si $F$ es Cobb-Douglas, $\alpha + \beta$ determina los rendimientos a escala (ver [[rendimientos-a-escala]]).

## Ejemplo

$Q = 2 K^{0.5} L^{0.5}$. Con $\bar K = 4$, $L = 9$: $Q = 2 \cdot 2 \cdot 3 = 12$.

En CP: $Q(L) = 4 \sqrt{L}$ → curva cóncava (rendimientos decrecientes en $L$).

En LP: $\alpha + \beta = 1$ → rendimientos a escala constantes.

## Errores comunes / Distinciones

- $Q$ es **producto físico**, no ingreso. Para obtener ingreso hay que multiplicar por el precio.
- En CP solo se mueve $L$; las curvas de productividad ($PMg$, $PMe$) se derivan respecto a $L$.
- $\alpha + \beta$ no determina rendimientos marginales — eso lo dan los exponentes individuales (¡atención!): la Cobb-Douglas siempre tiene rendimientos marginales decrecientes en cada factor por separado si los exponentes son < 1.

## Relacionado con
- [[productividad-marginal]]
- [[productividad-media]]
- [[corto-vs-largo-plazo]]
- [[rendimientos-marginales-decrecientes]]
- [[rendimientos-a-escala]]
- [[curvas-costos]]
