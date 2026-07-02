---
cssclasses:
  - sv-exactas
---
###### MNA · Métodos Numéricos

# Iteración de punto fijo

#unidad-3 #convergencia

Un método iterativo reescribe `f(x)=0` como `x=g(x)` y genera una sucesión que
—bajo ciertas condiciones— converge a la raíz.

## Condición de convergencia

> [!note] Teorema
> Si **|g′(x)| < 1** en un entorno de la raíz *r*, la iteración converge
> linealmente a *r* para toda semilla suficientemente próxima.

## Ejemplo numérico

| n | xₙ | error |
|---|------|-------|
| 0 | 1.5000 | 2.1e-1 |
| 1 | 1.3572 | 4.4e-2 |
| 2 | 1.3309 | 8.0e-3 |

La [[tasa de error]] se contrae en factor **g′(r)** por paso.
