---
tags: [unit-03, bienestar, micro]
---

## Definición

**Incidencia impositiva:** distribución efectiva de la carga de un impuesto entre consumidores y productores, **independientemente** de a quién la ley lo grave legalmente. La incidencia económica depende de las **elasticidades relativas** de oferta y demanda.

## Fórmula

Para un impuesto $t$ por unidad, la **proporción** de la carga sobre el consumidor:

$$\frac{\Delta P_c}{t} = \frac{\varepsilon_s}{\varepsilon_s + |\varepsilon_d|}$$

Donde:
- $t$: impuesto unitario (por unidad transada)
- $\Delta P_c$: aumento del precio que paga el consumidor
- $\varepsilon_s$: elasticidad precio de la oferta
- $\varepsilon_d$: elasticidad precio de la demanda (en módulo)

Y sobre el productor:

$$\frac{|\Delta P_p|}{t} = \frac{|\varepsilon_d|}{\varepsilon_s + |\varepsilon_d|}$$

Donde:
- $\Delta P_p$: caída del precio neto que recibe el productor

## Intuición / Por qué importa

**Lección central:** "el que no puede irse, paga". El agente menos elástico (con menos opciones de fuga) **carga más** del impuesto.

| Situación | Resultado |
|---|---|
| Demanda más inelástica que oferta | El **consumidor** carga la mayor parte |
| Oferta más inelástica que demanda | El **productor** carga la mayor parte |
| Demanda perfectamente inelástica ($\varepsilon_d = 0$) | Consumidor paga 100% |
| Oferta perfectamente inelástica ($\varepsilon_s = 0$) | Productor paga 100% |

**Por qué los Estados gravan bienes inelásticos** (cigarrillos, alcohol, naftas): el consumidor no puede dejar de comprar fácilmente → recaudación alta y DWL chico. Para desincentivar consumo, en cambio, se gravan bienes elásticos.

## Ejemplo

Impuesto de $t = 4$ sobre cigarrillos. Demanda muy inelástica ($\varepsilon_d \approx -0.4$), oferta elástica ($\varepsilon_s = 2$):

$$\frac{\Delta P_c}{t} = \frac{2}{2 + 0.4} = 0.83$$

El consumidor carga **3.33 de cada 4** ($\approx 83\%$). El productor solo absorbe $0.67$. Por eso los impuestos al cigarrillo son "buenos para recaudar": el fumador no se va.

## Errores comunes / Distinciones

- **Decir "el productor paga porque la ley lo grava".** No: la ley define al recaudador, no al pagador económico.
- **Confundir incidencia con DWL.** Incidencia = quién carga la parte que se pierde por subida/bajada del precio. DWL = el triángulo de operaciones que ya no ocurren — *nadie* lo paga, se desperdicia.
- **Asumir reparto 50/50 cuando no lo dice el problema.** Sin elasticidades específicas, no se puede asumir reparto igual.


## Gráfico

![[impuesto-dwl.svg]]
## Relacionado con
- [[deadweight-loss]]
- [[excedente-consumidor]]
- [[excedente-productor]]
- [[elasticidad-precio-demanda]]
