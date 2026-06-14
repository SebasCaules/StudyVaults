---
tags: [unit-08, metodo]
aliases: [mutuamente excluyentes, conflicto VAN-TIR, tasa de Fisher, ranking de proyectos]
---

## Definición

**Proyectos mutuamente excluyentes:** cuando se acepta uno, automáticamente se rechaza el otro (comparten el mismo recurso, terreno, presupuesto o función). No basta aceptar/rechazar: hay que **ordenar**. Tipología completa del PDF:

| Tipo de alternativas | Definición | Decisión requerida |
|---|---|---|
| **Dependientes** | Se invierte en todas o en ninguna (solo tienen sentido juntas) | Aceptar o rechazar el paquete |
| **Independientes** | La decisión sobre una no afecta a la otra | Aceptar o rechazar cada una |
| **Mutuamente excluyentes** | Aceptar una implica rechazar la otra | Aceptar/rechazar **y ordenar** |

## Independientes: VAN y TIR nunca chocan

Para un proyecto convencional el perfil del VAN es decreciente en la tasa, y corta el eje en la TIR. Entonces:

$$TIR > TREMA \iff VAN > 0 \quad \Rightarrow \quad \text{aceptar}$$

$$TIR < TREMA \iff VAN < 0 \quad \Rightarrow \quad \text{rechazar}$$

Los dos criterios siempre dan la misma respuesta de aceptación. El problema aparece solo al **rankear**.

## Mutuamente excluyentes: el conflicto

Ejemplo del PDF (tasa requerida 10%):

| Año | Proyecto A | Proyecto B |
|---|---|---|
| 0 | $(10.000)$ | $(10.000)$ |
| 1 | $0$ | $6.000$ |
| 2 | $13.924$ | $7.200$ |
| **TIR** | $18\%$ | $\mathbf{20\%}$ |
| **VAN** | $\mathbf{\$1.501}$ | $\$1.401$ |

**¡Conflicto!** La TIR recomienda B; el VAN recomienda A. Resolución por valor terminal: A entrega $13.924$ en el año 2. B, reinvirtiendo los $6.000$ del año 1 al costo del capital real (10%): $7.200 + 1{,}1 \cdot 6.000 = 13.800 < 13.924$. **A provee la mayor riqueza** — tal como recomendó el VAN. La TIR de B asumía que los $6.000$ se reinvertían al 20%, cuando en realidad se reinvierten al 10%.

### Por qué pasa (las dos causas)

1. **Diferencias de escala** entre los proyectos (la TIR es un %, ciega al tamaño).
2. **Diferencias de perfil temporal:** proyectos que recuperan pronto dan flujos tempranos para reinvertir, que la TIR valora a su propia (alta) tasa.

Detrás de ambas: las **hipótesis de reinversión** — el VAN asume reinversión al costo del capital ([[trema]]); la TIR, a la propia TIR. *Es más realista la primera.*

## La tasa de Fisher

Graficando $VAN(r)$ de ambos proyectos, los perfiles se **cruzan** en la **tasa de Fisher** (en el ejemplo gráfico del PDF: $8{,}7\%$, con $TIR_1 = 18{,}1\%$ y $TIR_2 = 23{,}6\%$):

- **A la izquierda de la tasa de Fisher** ($TREMA <$ Fisher): los criterios ordenan distinto → **existe conflicto → se decide por VAN**.
- **A la derecha**: VAN y TIR coinciden en el ranking → no hay conflicto.

Conclusión de cátedra (textual): *"La única solución a este problema es calcular el VAN."*

## Vidas distintas

Si las alternativas excluyentes además tienen **vidas diferentes**, antes de comparar hay que igualar horizontes: **cadena de reemplazo** o **anualidad equivalente** ([[costo-anual-equivalente]]). Comparar VANes a vidas distintas no es válido.

## Errores comunes / Distinciones

- **Elegir por TIR entre excluyentes.** Es exactamente el caso en que la TIR falla.
- **Creer que el conflicto invalida la TIR como criterio de aceptación.** Para aceptar/rechazar un proyecto independiente convencional, TIR funciona perfecto; falla en el *ranking*.
- **Ignorar la posición de la TREMA respecto de la tasa de Fisher:** si la TREMA está a la derecha del cruce, no hay conflicto que resolver.
- **Olvidar homogeneizar vidas** antes de rankear.

## Relacionado con
- [[van]]
- [[tir]]
- [[trema]]
- [[costo-anual-equivalente]]
- [[flujo-de-fondos-proyecto]]
