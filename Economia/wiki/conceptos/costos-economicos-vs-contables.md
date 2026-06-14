---
tags: [unit-02, micro, concepto-central]
---

## Definición

Distinción central en el análisis de costos:

- **Costo contable:** desembolso monetario explícito (lo que aparece en la factura): salarios, alquileres pagados, materias primas.
- **Costo económico:** costo contable **+ costo de oportunidad** de los factores propios (capital del dueño, tiempo del emprendedor, terreno propio). Incluye lo que esos recursos podrían ganar en su mejor alternativa.

## Fórmula

Si la empresa usa trabajo $L$ a salario $w$ y capital propio $K$:

$$\text{Costo contable} = w \cdot L$$

$$\text{Costo económico} = w \cdot L + r \cdot K$$

Donde:
- $w$: salario unitario del trabajo
- $L$: cantidad de trabajo contratada
- $r$: costo de oportunidad del capital propio (rendimiento alternativo)
- $K$: capital propio invertido
- $rK$: costo implícito del capital

donde $r$ es el rendimiento que ese capital obtendría en su mejor alternativa.

**Beneficios:**
$$\pi_{cont} = I - wL$$
$$\pi_{econ} = I - wL - rK$$

Donde:
- $\pi_{cont}$: beneficio contable (solo desembolsos explícitos)
- $\pi_{econ}$: beneficio económico (incluye costo de oportunidad)
- $I$: ingreso total

## Intuición / Por qué importa

Una empresa con **beneficio contable positivo** puede tener **beneficio económico cero o negativo**: cubre los desembolsos pero no genera más valor que el que generaría el dueño poniendo el capital en otra inversión. El **beneficio normal** ($\pi_{econ} = 0$) es lo justo para retener los recursos en esa actividad.

Esta distinción es **crítica en parciales** y conecta directamente con el concepto del **[[costo-de-oportunidad]]**.

## Ejemplo

Un emprendedor pone $100.000$ propios en un negocio. Si ese capital invertido en un plazo fijo le daría $r = 10\%$ → $rK = 10.000/año$.

- Ingresos del año: $50.000$
- Salarios pagados (no incluye propio): $35.000$

$$\pi_{cont} = 50.000 - 35.000 = 15.000$$
$$\pi_{econ} = 50.000 - 35.000 - 10.000 = 5.000$$

**Interpretación:** la empresa "rinde" más que la alternativa por $5.000$. Si $\pi_{econ}$ fuera negativo, conviene cerrar y poner el capital en plazo fijo.

## Errores comunes / Distinciones

- **Olvidar el $rK$** al calcular beneficio económico es uno de los errores más comunes.
- "Beneficio normal" no es lo mismo que "beneficio cero contable" — es **beneficio económico cero**, que en términos contables suele ser positivo.
- El costo de oportunidad incluye el tiempo del dueño: si renunció a un sueldo de $X$ para emprender, eso entra en el costo económico.

## Relacionado con
- [[costo-de-oportunidad]]
- [[beneficio-economico]]
- [[costos-fijos-variables]]
- [[curvas-costos]]
