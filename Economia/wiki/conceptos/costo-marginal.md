---
tags: [unit-02, micro, concepto-central]
---

## Definición

**Costo marginal ($CMg$)**: incremento del costo total al producir **una unidad adicional**. Es lo que cuesta la próxima unidad.

## Fórmula

$$CMg = \frac{\Delta CT}{\Delta Q} = \frac{\partial CT}{\partial Q} = \frac{\partial CV}{\partial Q}$$

Donde:
- $CMg$: costo marginal (costo de la unidad adicional)
- $CT$: costo total
- $CV$: costo variable
- $CF$: costo fijo
- $Q$: cantidad producida

(El $CF$ no depende de $Q$, así que no aporta al $CMg$.)

**Vínculo con productividad:**
$$CMg = \frac{w}{PMg_L}$$

Donde:
- $w$: salario unitario del trabajo
- $PMg_L$: productividad marginal del trabajo

## Forma típica

En el corto plazo, $CMg$ tiene **forma de U**, más pronunciada que las medias:
1. **Cae** al inicio (fase de especialización: $PMg$ creciente).
2. Llega a un **mínimo**.
3. **Sube** por rendimientos marginales decrecientes ($PMg$ decreciente → $CMg = w/PMg$ creciente).

## Reglas clave (¡parcial!)

| Si... | ...entonces |
|---|---|
| $CMg < CMe$ | $CMe$ está cayendo |
| $CMg > CMe$ | $CMe$ está subiendo |
| $CMg = CMe$ | $CMe$ está en su **mínimo** |

**El $CMg$ corta al $CVMe$ y al $CTMe$ exactamente en sus mínimos.** Es matemáticamente análogo a la relación entre $PMg$ y $PMe$.

(El $CFMe$ no tiene mínimo: decrece monotónicamente. El $CMg$ **no corta al $CFMe$**.)

## Intuición / Por qué importa

- Es el costo relevante para la **decisión marginal**: producir una unidad más conviene si $IMg \geq CMg$.
- La **curva de oferta** en competencia perfecta es el tramo de $CMg$ por encima del mínimo del $CVMe$.
- En toda estructura de mercado, el óptimo está en $IMg = CMg$ ([[regla-IMg-CMg]]).

## Ejemplo

| $Q$ | $CT$ | $CMg$ |
|---|---|---|
| 0 | 30 | — |
| 1 | 38 | 8 |
| 2 | 44 | 6 |
| 3 | 51 | 7 |
| 4 | 60 | 9 |
| 5 | 72 | 12 |

Mínimo del $CMg$ está cerca de $Q = 2$. Después sube por rendimientos decrecientes.

## Errores comunes / Distinciones

- $CMg$ no incluye $CF$: derivar $CT$ o $CV$ da lo mismo.
- $CMg \neq CTMe$: la marginal es la **derivada**; la media es el **cociente**.
- "El $CMg$ corta al $CFMe$" → **incorrecto** (el $CFMe$ no tiene mínimo).
- $CMg$ puede caer al inicio: no siempre es creciente.


## Gráfico

![[curvas-costos-corto-plazo.svg]]
## Relacionado con
- [[costos-medios]]
- [[curvas-costos]]
- [[productividad-marginal]]
- [[ingreso-marginal]]
- [[regla-IMg-CMg]]
- [[costos-fijos-variables]]
