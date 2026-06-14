---
tags: [unit-08, metodo]
aliases: [flujo de caja libre, FCLP, FCF, free cash flow, flujo de caja del proyecto]
---

## Definición

**Flujo de fondos (o flujo de caja libre) del proyecto:** diferencia entre **pesos cobrados y pesos pagados** en cada período, generada o producida por el proyecto. Es el insumo sobre el que se aplican los criterios de decisión ([[van]], [[tir]], [[payback]]). Principio de la cátedra: *"garbage in → garbage out"* — la calidad de la evaluación depende de la calidad del flujo.

## Reglas de construcción

1. Los fondos se computan **solo cuando se efectivizan** (criterio percibido — contraste con [[devengado-vs-percibido|lo devengado]] de la contabilidad).
2. Se calculan **después del impuesto a las ganancias**.
3. La información se presenta en forma **incremental**.
4. Los **ahorros de costos también son ingresos**.
5. Incluir la inversión en **bienes de capital** y en **[[capital-de-trabajo-en-proyectos|capital de trabajo]]**.
6. Los **intereses del financiamiento no forman parte** del flujo operativo.
7. **No incluir los [[costo-hundido|costos hundidos]]**.

## Qué NO se incluye (lista del PDF)

- La depreciación y las reservas (no son movimientos de caja — pero el [[escudo-fiscal]] de la amortización **sí** entra, vía menor impuesto)
- Los ingresos y pagos de préstamos
- Los intereses
- Los aportes de capital
- Los repartos de dividendos o utilidades
- Los ahorros en impuestos por pago de intereses

Razón: el proyecto se evalúa **separado de su financiamiento**. El costo de los fondos ya está representado en la tasa de descuento ([[trema]]); incluir intereses en el flujo los contaría dos veces.

## Flujo incremental

$$FF_{proyecto} = FF_{empresa\ con\ proyecto} - FF_{empresa\ sin\ proyecto}$$

**Donde:**
- $FF$: flujo de fondos de cada escenario

Dos casos de construcción:
- **Empresa totalmente nueva:** se consideran todos los ingresos y egresos de la inversión.
- **Proyecto en empresa existente:** solo el impacto incremental. Por esta vía entran los **efectos colaterales** (si el producto nuevo canibaliza ventas de otro, esa pérdida es flujo negativo del proyecto) y los [[costo-de-oportunidad|costos de oportunidad]] de recursos propios (comparar situación *con* vs *sin* proyecto — sin forzarlos: pueden no existir).

## Estructura temporal

Convención: los ingresos y egresos ocurren **al final de cada período**; las inversiones iniciales se colocan en el **momento 0**. Tres bloques:

| Bloque | Contenido |
|---|---|
| **Inversión inicial** | Activos fijos (en el momento en que se *pagan* — puede haber etapas: 30% año 0, 70% año 1), IVA de la inversión, constitución del capital de trabajo |
| **Horizonte explícito** | FEO de cada año: $UN + Am$ |
| **Flujo terminal** | [[valor-residual|Valor terminal]] neto de impuestos + recupero del capital de trabajo |

## Esquema de armado (formato del PDF)

**Ingresos del proyecto:** utilidad operativa antes de impuestos + amortizaciones + otros conceptos que no significan ingreso/egreso efectivo + recupero IVA inversión + ventas de activos fijos + valor terminal.

**Egresos del proyecto:** variación en capital de trabajo + IVA inversión + impuesto a las ganancias + inversiones en activos fijos.

$$FF = Ingresos - Egresos \qquad \text{(variaciones = final − inicial)}$$

Proceso en cuatro pasos: **identificar** (impactos relevantes) → **medir** (magnitud y signo) → **valorar** (en unidades monetarias) → **ordenar** (ubicación temporal). El flujo se puede elaborar a partir del [[cuadro-de-resultados]] y [[balance-patrimonial|balances]] proyectados, corrigiendo de devengado a percibido.

## Errores comunes / Distinciones

- **Confundir utilidad neta con flujo de caja.** La UN es contable; el flujo le suma la amortización y le corrige el timing de cobros y pagos.
- **Olvidar la inversión en capital de trabajo** (y su recupero al final).
- **Meter el préstamo y sus intereses** "porque son plata que entra y sale" — quedan afuera por diseño.
- **Computar la inversión cuando se decide y no cuando se paga.**
- Otros impuestos (internos, ingresos brutos, sellos) se tratan **como un costo más** dentro del flujo.

## Relacionado con
- [[van]]
- [[tir]]
- [[escudo-fiscal]]
- [[capital-de-trabajo-en-proyectos]]
- [[costo-hundido]]
- [[valor-residual]]
- [[costo-de-oportunidad]]
- [[devengado-vs-percibido]]
