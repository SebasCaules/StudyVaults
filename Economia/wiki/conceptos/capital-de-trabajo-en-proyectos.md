---
tags: [unit-08, definicion]
aliases: [variación de capital de trabajo, capital de trabajo del proyecto, stock de caja, working capital]
---

## Definición

**Capital de trabajo en proyectos:** los fondos que el proyecto **inmoviliza para poder operar**: stock de caja mínimo para transacciones, créditos por ventas (lo facturado y aún no cobrado), inventarios de materias primas y productos, menos las deudas comerciales con proveedores (que financian parte de eso). Aunque no es activo fijo, **es inversión**: hay que ponerle plata y entra al [[flujo-de-fondos-proyecto]]. La definición contable general está en [[capital-de-trabajo]] (U6); acá importa su efecto de **caja**.

## Regla central: importa la variación

$$\boxed{\text{Efecto sobre } FF_t = -\Delta KT_t = -(KT_t - KT_{t-1})}$$

**Donde:**
- $KT_t$: capital de trabajo requerido al final del período $t$
- $\Delta KT_t$: variación del período (final − inicial)

- Un **incremento** del capital de trabajo (más stock de caja, más créditos, más inventario) es un **egreso** de caja.
- Una **reducción** es un **ingreso**.
- Al **cierre del proyecto** el capital de trabajo se **recupera** (ingreso del último año): se cobra todo, se liquidan inventarios, se levanta el stock de caja.

## Ejemplo del PDF: stock de caja = 20% de las ventas

| Año | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Ventas | 2.000 | 2.500 | 3.200 | 5.000 | 0 |
| Stock de caja requerido | 400 | 500 | 640 | 1.000 | 0 |
| **Efecto sobre el flujo** | $-400$ | $-100$ | $-140$ | $-360$ | $+1.000$ |

Solo se "paga" la variación; lo acumulado vuelve entero al final (acá: $400+100+140+360 = 1.000$). El costo real de inmovilizarlo es **financiero**: esa plata estuvo atrapada sin rendir la [[trema]] — por eso reduce el VAN aunque "se devuelva toda".

## Las dos formas equivalentes de computarlo

1. **Línea separada de ΔKT:** armar ingresos/egresos devengados y agregar la línea "variación en capital de trabajo" (formato del PDF, pág. 61).
2. **Corregir directamente a percibido:** ajustar cada línea por sus plazos — es lo que hace el ejemplo integral del PDF:
   - *Cobranza a 90 días* → del año de ventas de \$360 se cobran \$270 en el año y \$90 al año siguiente (créditos por ventas = 1/4 de las ventas).
   - *Proveedores a 60 días* → 1/6 de las compras se paga al año siguiente.
   - *Stock de caja 10% de ventas* → \$36 constituidos en el año 0, devueltos al cierre.
   - *Stock de materia prima de 4.000 u* → se compra en el año 0 (\$20) y al final se consume comprando menos (el año 5 compra 16.000 u en vez de 20.000).

Ambos caminos dan el mismo flujo; no mezclarlos (sería contar doble).

## Recuperación incompleta

Al cierre puede ocurrir que el capital de trabajo **no se recupere íntegramente**: inventarios obsoletos, créditos incobrables. Esa diferencia genera una **pérdida** (con su efecto deducible en el IG). No asumir recupero al 100% si el enunciado sugiere lo contrario.

## Errores comunes / Distinciones

- **Olvidar el recupero al final del proyecto** — infravalora el VAN.
- **Computar el stock total todos los años en vez de la variación** — castiga el flujo varias veces por la misma plata.
- **Amortizar el capital de trabajo o asignarle escudo fiscal.** No es un gasto: es plata inmovilizada; no pasa por el [[cuadro-de-resultados]] ni genera [[escudo-fiscal]].
- **Olvidar que la constitución inicial integra la inversión** del momento 0 (y agranda la máxima exposición y el [[payback]]).
- Mezclar el enfoque "ΔKT en línea aparte" con el enfoque "ingresos percibidos" → doble conteo.

## Relacionado con
- [[capital-de-trabajo]]
- [[devengado-vs-percibido]]
- [[flujo-de-fondos-proyecto]]
- [[valor-residual]]
- [[balance-patrimonial]]
