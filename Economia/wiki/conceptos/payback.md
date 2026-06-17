---
tags: [unit-08, metodo]
aliases: [período de recupero, periodo de recupero, PRS, PRCA, payback descontado, máxima exposición]
---

## Definición

**Período de recupero (payback):** tiempo que le toma al proyecto **recuperar la inversión original** acumulando sus flujos de caja. Dos variantes:

- **PRS (período de recupero simple):** acumula los flujos sin descontar.
- **PRCA (período de recupero con actualización / payback descontado):** acumula los flujos **descontados a la [[trema]]**. Siempre resulta $PRCA \geq PRS$, porque los flujos descontados valen menos.

Criterio: se prefiere el proyecto de **menor PR**; se acepta si el PR es menor que un umbral fijado por la empresa (umbral arbitrario — primer defecto del método).

## Fórmula

Con flujos desiguales se acumula año a año y se interpola la fracción del año en que se completa la inversión:

$$PR = a + \frac{I - \sum_{j=1}^{a} FC_j}{FC_{a+1}}$$

**Donde:**
- $a$: último año con acumulado todavía negativo
- $I$: inversión inicial a recuperar
- $FC_j$: flujo de caja del año $j$ (descontado, si es PRCA)

## Ejemplo

Inversión $-20.000$; flujos $+5.000; +10.000; +20.000; +20.000$:

$5.000 + 10.000 = 15.000$ en dos años; faltan $5.000$ del flujo de $20.000$ del año 3 → fracción $5.000/20.000 = 0{,}25$.

$$PR = 2{,}25 \text{ años}$$

## Máxima exposición

Subproducto útil del mismo cuadro acumulado: la **máxima exposición** es el saldo acumulado más negativo — lo máximo que el inversor llega a tener "enterrado" en el proyecto. En el ejemplo integral del PDF (flujos $-236; +16{,}7; +110; +110; +110; +166{,}8; +90$): acumulado $-236; -219{,}3; -109{,}3; +0{,}7; \ldots$ → $PR = 3$ años y máxima exposición $=$ \$236.

## Por qué se usa (a pesar de sus defectos)

- Ayuda a controlar el **riesgo** asociado a la incertidumbre de los flujos lejanos.
- Minimiza el impacto de la inversión sobre la **liquidez** de la empresa.
- Controla el riesgo de **obsolescencia** (recuperar antes de que la tecnología caduque).
- Controla el efecto de la inversión sobre las **medidas de performance**.

Es, en el fondo, una forma rústica de protegerse contra el riesgo: privilegia recuperar rápido.

## Deficiencias

1. **Ignora el valor tiempo del dinero** (el PRS; el PRCA lo corrige).
2. **Ignora todo lo que pasa después de la fecha de recupero** — y ahí puede estar el grueso del valor.

Ejemplo del PDF que muestra cómo el criterio elige mal:

| Año | A | B | C |
|---|---|---|---|
| 0 | $-1.000$ | $-2.500$ | $-1.000$ |
| 1 | $400$ | $200$ | $1.000$ |
| 2 | $400$ | $700$ | — |
| 3 | $400$ | $1.200$ | — |
| 4 | $400$ | $2.000$ | — |
| **PR** | 2,5 | 3,2 | **1** ← elige C |

El payback elige C (recupera en 1 año)… que apenas devuelve la inversión y nada más. *"Claramente, cualquiera de las otras alternativas es mejor que la seleccionada."* Por eso el payback **complementa** al [[van]], nunca lo reemplaza.

## Errores comunes / Distinciones

- **Usarlo como criterio único de decisión.** Es un indicador de riesgo/liquidez, no de creación de valor.
- **Olvidar interpolar la fracción de año** con flujos desiguales.
- **Confundir PRS con PRCA** — si el enunciado da una TREMA y pide payback descontado, primero descontar cada flujo.
- El capital de trabajo y las inversiones en etapas **alargan** el PR (suman a la inversión a recuperar).

## Relacionado con
- [[van]]
- [[tir]]
- [[trema]]
- [[flujo-de-fondos-proyecto]]
- [[valor-tiempo-dinero]]
