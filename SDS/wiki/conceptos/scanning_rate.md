---
tipo: concepto
tags:
- observable
- edmd
- tp3
- tp4
actualizado: 2026-05-06
---

# Scanning rate J

Observable central de [[tps/TP3]] y [[tps/TP4]] (Sistema 2).

## Definición

Sea **Cfc(t)** el **número acumulado** de partículas frescas que tocaron el obstáculo central por primera vez (y cambiaron de estado fresca → usada). Cfc(t) es monótonamente no decreciente.

```
J = pendiente del ajuste lineal de Cfc(t)
```

J tiene unidades de [partículas/tiempo] y mide la tasa a la que el obstáculo "escanea" partículas frescas del recinto.

## Cómo calcularlo

1. Para cada realización: registrar Cfc(t) en cada instante de cambio de estado.
2. Ajustar una recta a Cfc(t) en el régimen lineal (después del transitorio inicial).
3. Promediar la pendiente J sobre realizaciones independientes ⟨J⟩, calcular σ.
4. Graficar **⟨J⟩ vs N** con barras de error.

## Diferencia TP3 vs TP4

- **TP3 (EDMD)**: el contacto es instantáneo. Cfc se incrementa exactamente en el evento de colisión.
- **TP4 (DM paso temporal, fuerza elástica blanda)**: el contacto dura **muchos dt**. Para Cfc, contar **solo el primer dt** del contacto (cuando ξ pasa de ≤ 0 a > 0). Guardar Cfc con resolución dt, no dt₂.

## Variantes

- **J global**: pendiente de Cfc(t) integrando todas las partículas.
- **Jᵢₙ(S)**: scanning rate por capa radial S, definido como ⟨ρᶠⁱⁿ⟩(S) · |⟨vᶠⁱⁿ⟩(S)|. Ver [[conceptos/perfiles_radiales]].
- **Jᵢₙ|S~2**: Jᵢₙ evaluado cerca del obstáculo. Es lo más comparable con el J global.

## En TP4 1.4

Variar la constante elástica k = {10², 10³, 10⁴, (10⁵)} y comparar **⟨J⟩(N)** y **⟨Jᵢₙ|S~2⟩(N)**. Para cada k, identificar un escalar que caracterice la curva (N* que maximiza, max(⟨J⟩), etc.) y graficarlo en función de k.

## Referencia entre TPs

⚠️ El enunciado de TP4 pide **comparar la figura de ⟨J⟩(N) con la del TP3** en una misma figura. Es una validación: ambos métodos deben dar resultados consistentes, modulo diferencias por la blandura del contacto en TP4.
