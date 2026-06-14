---
tags: [unit-05, macro]
aliases: [régimen monetario, ancla nominal, encadenamiento causal]
---

## Definición

**Régimen de política monetaria:** marco institucional y estratégico que define **cómo el BC busca el objetivo final** de la política monetaria (típicamente la estabilidad de precios). Especifica el encadenamiento causal:

$$\text{Instrumentos} \to \text{Objetivo operativo} \to \text{Meta intermedia} \to \text{Objetivo final}$$

```mermaid
graph LR
    I[Instrumentos<br/>encajes, OMA, tasa,<br/>intervención cambiaria]
    OP[Objetivo<br/>operativo<br/>tipo cambio / BM /<br/>tasa CP]
    MI[Meta<br/>intermedia<br/>ANCLA NOMINAL]
    OF[Objetivo<br/>final<br/>estab. precios,<br/>crecimiento, empleo]

    I --> OP --> MI --> OF

    style I fill:#3498db33
    style OP fill:#16a08533
    style MI fill:#f39c1233,stroke:#e67e22,stroke-width:3px
    style OF fill:#27ae6033
```

## Los cuatro niveles

| Nivel | Qué es | Ejemplos |
|---|---|---|
| **Instrumentos** | herramientas que el BC controla directamente | encajes, OMA, intervención cambiaria, facilidades, tasa de política |
| **Objetivo operativo** | variable que el BC apunta diariamente | tipo de cambio fijo, base monetaria, tasa de muy corto plazo |
| **Meta intermedia (ancla nominal)** | variable cuya estabilidad asegura la del objetivo final | tipo de cambio (caja de conversión), agregado monetario (M3), inflación esperada |
| **Objetivo final** | meta última de política | estabilidad de precios + estabilidad financiera + crecimiento de LP + pleno empleo |

## Tipos de régimen según el ancla nominal

| Régimen | Ancla nominal | Ejemplo histórico |
|---|---|---|
| **Tipo de cambio fijo / Convertibilidad** | tipo de cambio | Argentina 1991-2001 |
| **Metas de agregados monetarios** | M2 / M3 | EE.UU. 1979-82 (Volcker) |
| **Metas de inflación (Inflation Targeting)** | inflación esperada | régimen dominante hoy: Brasil, Chile, México, UE, UK |
| **Discrecional** | sin ancla explícita | Argentina en muchos períodos |

## Intuición / Por qué importa

El régimen importa por **dos razones**:
1. **Coherencia interna:** si el BC dice "tipo de cambio fijo" y simultáneamente quiere usar la tasa para política contracíclica → contradicción (trinomio imposible).
2. **Credibilidad y expectativas:** un régimen creíble ancla expectativas de inflación → reduce el costo de la desinflación (sacrifice ratio).

## Trinomio imposible (Mundell-Fleming)

Un país **no puede tener** simultáneamente:
1. Movilidad libre de capitales.
2. Tipo de cambio fijo.
3. Política monetaria autónoma.

Solo puede tener **2 de las 3**. Argentina ha experimentado distintas combinaciones en su historia.

## Ejemplo

**Convertibilidad (1991-2001):** $ instrumento $ = compra/venta de divisas, $ operativo $ = mantener TC = 1, $ ancla $ = TC fijo, $ final $ = estabilidad de precios. Funcionó hasta que el TC fijo se volvió incompatible con la dinámica fiscal y externa.

**Metas de inflación (intento argentino 2016-2018):** $ instrumento $ = tasa de Lebac, $ operativo $ = tasa de corto plazo, $ ancla $ = inflación proyectada, $ final $ = bajar inflación. Falló por inflación de partida demasiado alta y dominancia fiscal.

## Errores comunes / Distinciones

- **No confundir instrumento con objetivo final.** El BC controla los instrumentos, pero el objetivo final puede estar lejos en la cadena.
- **El régimen necesita coherencia.** Anunciar metas de inflación y simultáneamente fijar el tipo de cambio o financiar déficits → expectativas no se anclan.
- **Cambiar de régimen es costoso** porque hay que reconstruir credibilidad.

## Relacionado con
- [[politica-monetaria-expansiva-contractiva]]
- [[banco-central-herramientas]]
- [[metas-inflacion]]
- [[neutralidad-dinero]]
