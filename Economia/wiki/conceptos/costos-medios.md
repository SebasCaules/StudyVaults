---
tags: [unit-02, micro]
---

## Definición

**Costos medios**: costo total por unidad de producto. Tres variantes:

- **Costo fijo medio ($CFMe$):** $CFMe = CF / Q$
- **Costo variable medio ($CVMe$):** $CVMe = CV / Q$
- **Costo total medio ($CTMe$):** $CTMe = CT / Q = CFMe + CVMe$

## Fórmulas

$$CFMe = \frac{CF}{Q} \qquad CVMe = \frac{CV}{Q} \qquad CTMe = \frac{CT}{Q}$$

Donde:
- $CFMe$: costo fijo medio (decreciente; tiende a 0)
- $CVMe$: costo variable medio (forma de U)
- $CTMe$: costo total medio (forma de U)
- $CF, CV, CT$: costos totales fijo, variable y total
- $Q$: cantidad producida

Identidad: $CTMe = CFMe + CVMe$.

## Forma de las curvas

| Curva | Forma |
|---|---|
| $CFMe$ | **Hiperbólica decreciente** (se dilata el costo fijo en más unidades; tiende a 0). **Sin mínimo.** |
| $CVMe$ | Forma de **U** |
| $CTMe$ | Forma de **U**, siempre **por encima** de $CVMe$, y la diferencia entre ambas es justo el $CFMe$ (que se va achicando) |

```
$/Q
│ \      CTMe
│  \    /
│   \__/  CVMe
│    \_/   
│     ↑ mínimo CVMe (punto de cierre)
│      \____________ CFMe
│________________________ Q
```

## Relación con $CMg$

- $CMg$ corta al $CVMe$ y al $CTMe$ exactamente en sus **mínimos** (no en el de $CFMe$, que no tiene mínimo).
- El mínimo del $CTMe$ está siempre a la **derecha** del mínimo del $CVMe$, porque $CTMe = CVMe + CFMe$ y el $CFMe$ va cayendo.

## Intuición / Por qué importa

- En **competencia perfecta**, el equilibrio de LP se da donde $P = CTMe_{min}$.
- El **mínimo del $CVMe$** es el **punto de cierre** en CP: si $P < CVMe_{min}$, conviene cerrar.
- En LP, el mínimo del $CMe_{LP}$ define la **[[escala-eficiente-minima]]**.

## Ejemplo

$Q = 100$, $CF = 200$, $CV = 600$, $CT = 800$:
- $CFMe = 2$, $CVMe = 6$, $CTMe = 8$.

Si $Q$ pasa a $200$, $CV$ pasa a $1.500$ ($CVMe$ subió: rendimientos decrecientes), $CT = 1.700$:
- $CFMe = 1$, $CVMe = 7.5$, $CTMe = 8.5$.

## Errores comunes / Distinciones

- $CFMe$ **no tiene mínimo** y nunca cruza el $CMg$.
- "$CTMe$ se acerca a $CVMe$ a medida que crece $Q$": la diferencia ($CFMe$) tiende a 0.
- No confundir $CMe$ (promedio) con $CMg$ (marginal): valores muy distintos.


## Gráfico

![[curvas-costos-corto-plazo.svg]]
## Relacionado con
- [[costo-marginal]]
- [[curvas-costos]]
- [[costos-fijos-variables]]
- [[escala-eficiente-minima]]
- [[punto-cierre]]
