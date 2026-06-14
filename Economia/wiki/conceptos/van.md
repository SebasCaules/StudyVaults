---
tags: [unit-08, metodo]
aliases: [VAN, VPN, valor actual neto, valor presente neto, NPV]
---

## Definición

**Valor Actual Neto (VAN o VPN):** valor de los flujos de fondos generados por el proyecto **por encima de los costos de financiarlo** (explícitos o de oportunidad). Es la medida del beneficio de una inversión **expresada en pesos de hoy**: lo que el proyecto agrega al valor de la firma después de devolver la inversión y pagar el costo del dinero.

## Fórmula

$$\boxed{VAN = -I + P = \sum_{j=0}^{n} \frac{FC_j}{(1+i)^j}}$$

**Donde:**
- $I$: valor presente del costo del proyecto (inversión inicial)
- $P$: valor presente de los flujos de caja futuros
- $FC_j$: flujo de caja neto del período $j$ ($FC_0 = -I$)
- $i$: tasa de descuento = [[trema]] (refleja el riesgo)
- $n$: cantidad de períodos del horizonte

## Criterio de decisión

| Si... | Significa que... | Decisión |
|---|---|---|
| $VAN > 0$ | La inversión se recobra, se obtiene la tasa requerida **y** queda una ganancia extra | **Aprobar** |
| $VAN = 0$ | La inversión se recupera y se obtiene exactamente la tasa requerida | Indiferencia (equilibrio) |
| $VAN < 0$ | La tasa de rendimiento requerida no se alcanza (la inversión puede recuperarse o no) | **Rechazar** |

Ojo: $VAN = 0$ **no** es "no ganar nada" — es ganar exactamente el costo de oportunidad del capital (el [[beneficio-economico|beneficio normal]] de la U2).

## Significado: la descomposición

Lo que el proyecto "entrega" a lo largo de su vida se descompone en tres capas:

1. **Inversión** — la devolución del dinero recibido.
2. **Costo del dinero** — el interés que el proyecto "paga" por el préstamo de la inversión (lo que se ganaría por fuera).
3. **Remanente** — el *algo extra*. Traído al período 0, **el remanente es el VAN**: la generación de valor.

## Ejemplo

Proyecto: inversión \$22.000; flujos +\$10.000 (año 1) y +\$20.000 (año 2); tasa 12%.

| Año | Flujo | Factor $1/(1{,}12)^j$ | Valor presente |
|---|---|---|---|
| 0 | $-22.000$ | 1,000 | $-22.000$ |
| 1 | $+10.000$ | 0,893 | $+8.930$ |
| 2 | $+20.000$ | 0,797 | $+15.940$ |
| | | **VAN** | **$+2.870$** |

Descomposición de los \$30.000 que entrega el proyecto: inversión \$22.000 + costo del dinero \$4.397 + remanente \$3.603; el VP del remanente al 12% es \$2.872 ≈ VAN ✓.

## Perfil del VAN

El VAN es función **decreciente** de la tasa de descuento (para proyectos convencionales): a mayor $i$, menos valen los flujos futuros. El punto donde el perfil corta el eje horizontal es la [[tir]]. Esta curva es la herramienta para analizar conflictos entre proyectos ([[proyectos-mutuamente-excluyentes|tasa de Fisher]]).

## Propiedades (contraste con la TIR)

- Mide la ganancia en **pesos absolutos**, no en porcentaje.
- Supone que los flujos intermedios se **reinvierten a la tasa requerida** (TREMA) — la hipótesis realista.
- La tasa es **propia del inversionista**: el VAN "se sesga" — cambia según quién evalúe (cada uno tiene su costo de oportunidad). La TIR, en cambio, es propia de la inversión.
- Es **aditivo** y manda en caso de conflicto de ranking: *"la única solución a este problema es calcular el VAN"* (PDF).

## Errores comunes / Distinciones

- **Usar una tasa que no refleja el riesgo del proyecto.** La tasa de descuento debe ajustarse al riesgo, no ser una tasa genérica.
- **Comparar VANes de proyectos con vidas distintas** sin homogeneizar horizontes (usar cadena de reemplazo o [[costo-anual-equivalente]]).
- **Interpretar $VAN < 0$ como "pierde plata".** Puede recuperar la inversión y aun así no llegar a la tasa requerida.
- **Descontar utilidades contables en vez de flujos de caja** ([[flujo-de-fondos-proyecto]]).

## Relacionado con
- [[tir]]
- [[trema]]
- [[flujo-de-fondos-proyecto]]
- [[valor-tiempo-dinero]]
- [[costo-anual-equivalente]]
- [[proyectos-mutuamente-excluyentes]]
- [[bonos-renta-fija]]
