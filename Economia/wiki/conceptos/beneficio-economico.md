---
tags: [unit-02, micro]
---

## Definición

**Beneficio económico ($\pi_{econ}$)**: ingreso total menos **todos los costos**, incluyendo el [[costo-de-oportunidad]] de los factores propios (notablemente, del capital del dueño). Mide el "valor agregado" generado por la empresa **por encima** de la mejor alternativa.

Distinto del **beneficio contable**, que solo resta los desembolsos monetarios explícitos.

## Fórmula

Si la empresa usa trabajo $L$ a salario $w$ y capital propio $K$ con costo de oportunidad $r$:

$$\pi_{cont} = I - wL$$
$$\pi_{econ} = I - wL - rK$$

Donde:
- $\pi_{cont}$: beneficio contable (solo desembolsos explícitos)
- $\pi_{econ}$: beneficio económico (incluye costos de oportunidad)
- $I$: ingreso total
- $w$: salario unitario del trabajo
- $L$: trabajo contratado
- $r$: costo de oportunidad del capital propio
- $K$: capital propio invertido
- $rK$: costo implícito del capital (alternativa renunciada)

En general: $\pi_{econ} = I - C_{econ}$ donde $C_{econ}$ incluye costos contables + costos de oportunidad.

## Relación entre ambos

$$\pi_{econ} = \pi_{cont} - rK$$

Si $rK > 0$ (siempre que el dueño tenga capital propio), entonces $\pi_{econ} < \pi_{cont}$.

## Interpretación

| $\pi_{econ}$ | Significado |
|---|---|
| $> 0$ | La empresa rinde **más** que la mejor alternativa. Se atraen entrantes. |
| $= 0$ | **Beneficio normal**: la empresa rinde **igual** que la alternativa. Equilibrio de LP en CP. |
| $< 0$ | Rinde **menos** que la alternativa. Conviene salir (en LP). |

## Intuición / Por qué importa

- En **competencia perfecta de LP**, el beneficio económico es **cero**: la entrada/salida de empresas iguala el precio al $CTMe_{min}$.
- En **monopolio**, $\pi_{econ}$ puede ser positivo persistentemente por barreras a la entrada.
- Es la magnitud relevante para decidir si **mantener el capital en una actividad** o reasignarlo. Un negocio con $\pi_{cont} > 0$ pero $\pi_{econ} < 0$ debería cerrar — está dando peor que poner el dinero en plazo fijo.

## Ejemplo

Emprendedor pone \$100.000 propios. Costo de oportunidad: $r = 10\% \Rightarrow rK = 10.000/año$.
- Ingresos: \$70.000
- Salarios pagados: \$50.000

$$\pi_{cont} = 70.000 - 50.000 = 20.000$$
$$\pi_{econ} = 70.000 - 50.000 - 10.000 = 10.000$$

La empresa rinde \$10.000/año por encima de la mejor alternativa.

Si en cambio los ingresos fueran \$58.000: $\pi_{cont} = 8.000 > 0$ pero $\pi_{econ} = -2.000$ → conviene cerrar y poner el capital en plazo fijo.

## Errores comunes / Distinciones

- **Olvidar $rK$**: el error más típico de parcial. Si la consigna pide beneficio económico, hay que sumar el costo de oportunidad.
- "Beneficio normal" = $\pi_{econ} = 0$, NO $\pi_{cont} = 0$.
- En CP no necesariamente $\pi_{econ} = 0$: ese resultado es de LP en competencia perfecta.

## Relacionado con
- [[costos-economicos-vs-contables]]
- [[costo-de-oportunidad]]
- [[regla-IMg-CMg]]
- [[ingreso-marginal]]
- [[costo-marginal]]
