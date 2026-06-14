---
tags: [unit-03, micro]
---

## Definición

**Punto de cierre:** precio mínimo al que conviene seguir produciendo en el corto plazo. Por debajo de este precio, la empresa **cierra** (produce $q = 0$) porque pierde menos pagando solo el costo fijo que produciendo.

## Fórmula

$$P_{cierre} = \min(CVMe)$$

Donde:
- $P_{cierre}$: precio de cierre (umbral mínimo para producir)
- $CVMe$: costo variable medio ($CV/q$)

Es el precio igual al mínimo del costo variable medio. En ese punto coinciden $CMg$ y $CVMe$ (propiedad geométrica: el $CMg$ corta a los promedios en sus mínimos).

## Intuición / Por qué importa

Los **costos fijos son hundidos** en el corto plazo: se pagan se produzca o no. La pregunta relevante es si el ingreso por unidad ($P$) cubre al menos el **costo variable** por unidad ($CVMe$):

- Si $P \geq CVMe$ → cada unidad vendida cubre su variable y aporta algo al $CF$. **Producir.**
- Si $P < CVMe$ → cada unidad vendida no alcanza ni para pagar lo que costó variablemente. **Cerrar.**

Cerrar implica pérdida igual a $-CF$ (lo mínimo posible en CP). Producir bajo $CVMe$ implicaría perder $CF$ + diferencia entre $CVMe$ y $P$ por cada unidad — peor.

## Ejemplo

Empresa con $CF = 100$, $CVMe_{min} = 8$ a $q = 10$. Si el mercado está a:
- $P = 12$: produce, gana sobre el variable. Decide $q^*$ donde $P = CMg$.
- $P = 8$: justo en el cierre, indiferente.
- $P = 6$: cierra. Pierde $CF = 100$ (en lugar de perder $CF + (8-6) \cdot 10 = 120$).

## Errores comunes / Distinciones

- **Confundir punto de cierre con [[umbral-rentabilidad|umbral de rentabilidad]].** Cierre = $\min(CVMe)$. UR = $\min(CTMe)$. Entre ambos, la firma produce *a pérdida pero menor que cerrando*.
- **Olvidar que solo aplica al corto plazo.** En LP todos los costos son variables; si $P < \min(CMe_{LP})$, la firma sale del mercado definitivamente.
- **Incluir CF en la decisión marginal.** El $CF$ ya está pagado — irrelevante para decidir si producir hoy.


## Gráfico

![[maximizacion-cp-zonas.svg]]
## Relacionado con
- [[umbral-rentabilidad]]
- [[curva-oferta-empresa]]
- [[beneficios-normales-extraordinarios]]
- [[competencia-perfecta-caracteristicas]]
