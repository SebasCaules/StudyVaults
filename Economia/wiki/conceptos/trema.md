---
tags: [unit-08, definicion]
aliases: [TREMA, tasa requerida mínima aceptable, costo del capital, tasa de corte, tasa de descuento del proyecto]
---

## Definición

**TREMA (Tasa REquerida Mínima Aceptable):** el **costo del capital** del inversor — *"lo que sacrifica el inversor de ganar en su mejor alternativa por decidirse a hacer esta inversión"*. Es un [[costo-de-oportunidad]], no necesariamente un desembolso. Cumple dos roles simultáneos:

1. Es la **tasa de descuento** con la que se calcula el [[van]].
2. Es la **vara de comparación** de la [[tir]] (aceptar si $TIR > TREMA$).

## Propiedades

- **Debe reflejar el riesgo del proyecto** (comentario destacado del PDF: *"la tasa de descuento debe reflejar el riesgo del proyecto"*). A mayor riesgo percibido, mayor TREMA exigida → menor VAN para los mismos flujos.
- Estructura conceptual (de la U5/U7): $TREMA = r_{libre} + \text{prima de riesgo}$ — la misma lógica que la estructura de riesgo de la TIR de los [[bonos-renta-fija]].
- Es **subjetiva / propia del inversionista**: cada inversor tiene su mejor alternativa y su percepción de riesgo. Por eso el VAN "se sesga" (cambia según quién evalúe) mientras que la TIR es propia de la inversión.
- Para el proyecto, ganar exactamente la TREMA es $VAN = 0$: se recupera la inversión y se obtiene el rendimiento requerido — el [[beneficio-economico|beneficio normal]] de la U2, ni más ni menos.

## Rol en las hipótesis de reinversión

El criterio VAN supone que los flujos intermedios del proyecto se **reinvierten a la TREMA** (lo que efectivamente se puede ganar afuera); la TIR supone reinversión a la propia TIR. La primera hipótesis es la **más realista** — argumento por el cual, ante conflicto de ranking entre [[proyectos-mutuamente-excluyentes]], se decide por VAN.

## Ejemplo

En el caso del parcial 11-Nov-2025 (parque solar): $TREMA = 10\%$. Todos los FEO y el flujo terminal se descuentan a esa tasa; el resultado $VAN \approx +1{,}88 > 0$ significa que el parque devuelve la inversión, rinde el 10% requerido **y** genera 1,88 (en pesos de hoy) por encima → se recomienda.

En el ejemplo integral del PDF: $TREMA = 15\%$, $VAN = 118{,}7 > 0$ y $TIR = 29\% > 15\%$ → ambos criterios aceptan (proyecto convencional: siempre coinciden en aceptar/rechazar).

## Errores comunes / Distinciones

- **Confundir TREMA con TIR.** La TIR sale del proyecto (es resultado); la TREMA la pone el inversor (es dato/exigencia).
- **Usar cualquier tasa de mercado sin ajustar por riesgo** (ej.: la tasa de un plazo fijo para un proyecto minero).
- **Incluir el costo del financiamiento en el flujo además de en la tasa.** El costo de los fondos vive en la TREMA; meter intereses en el [[flujo-de-fondos-proyecto]] lo cuenta dos veces.
- **Olvidar la coherencia de unidades:** TREMA anual con flujos anuales; si los flujos son mensuales, convertir con [[tasas-equivalentes]]. Y en contextos inflacionarios, tasa real con flujos constantes o nominal con flujos nominales ([[tasa-interes-real]]).

## Relacionado con
- [[costo-de-oportunidad]]
- [[van]]
- [[tir]]
- [[tasa-interes]]
- [[tasa-interes-real]]
- [[bonos-renta-fija]]
- [[valor-tiempo-dinero]]
