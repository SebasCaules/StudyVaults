---
unit: 08
module: Empresa
title: Unidad 8 — Evaluación de Proyectos / Presupuesto de Capital
parcial: 2
sources: [raw/modulo-3-empresa/unidad-08-evaluacion-proyectos/epi09_pc 2.pdf]
last_updated: 2026-06-12
---

## Resumen

### Qué es un proyecto de inversión

Un proyecto de inversión es **"cualquier sacrificio de recursos hoy con la esperanza de recibir algún beneficio en el futuro"**. Cada palabra de la definición carga un concepto del curso:

| Palabra | Concepto detrás |
|---|---|
| Sacrificio | hay que recompensar a quien posterga consumo |
| Recursos | escasez, tipos de recursos |
| Hoy / futuro | [[valor-tiempo-dinero]] (Unidad 7) |
| Esperanza | riesgo → se refleja en la tasa de descuento |
| Beneficio | recupero de la inversión **+ intereses** |

La evaluación de proyectos (o *presupuesto de capital*) sirve para: impedir malos proyectos, evitar que se rechacen buenos, verificar la consistencia interna del proyecto y evaluar/distribuir sus riesgos. El proceso tiene dos etapas: **(1) construir el flujo de caja libre del proyecto** y **(2) aplicarle criterios de decisión** ([[van]], [[tir]], [[payback]], [[costo-anual-equivalente]]) para medir su viabilidad financiera. *"Garbage in → garbage out"*: el criterio más sofisticado no salva un flujo mal armado — por eso el grueso del trabajo (y del parcial) está en la etapa 1.

### El principio rector: caja, no contabilidad

El [[flujo-de-fondos-proyecto]] es la **diferencia entre pesos cobrados y pesos pagados**, período a período. Reglas de oro:

- Los fondos se computan **solo cuando se efectivizan** (percibido, no [[devengado-vs-percibido|devengado]]).
- Se calculan **después de impuestos**.
- La información se presenta en forma **incremental**: flujo del proyecto = flujos de la empresa *con* proyecto − flujos *sin* proyecto. (Empresa totalmente nueva: entra todo; proyecto dentro de una empresa existente: solo el impacto incremental, incluyendo efectos colaterales sobre otras líneas.)
- Los **ahorros también son ingresos** (un proyecto que reduce costos genera flujo positivo).
- Se incluye la inversión en bienes de capital **y** la inversión en [[capital-de-trabajo-en-proyectos|capital de trabajo]].

**Tabla testigo — qué entra y qué no entra al flujo:**

| Entra | NO entra |
|---|---|
| Cobros por ventas (cuando se cobran) | Amortizaciones como egreso (no son caja) |
| Pagos a proveedores, sueldos, costos erogables | [[costo-hundido|Costos hundidos]] (consultoras ya pagadas, I+D pasado) |
| Impuesto a las ganancias (calculado con contabilidad) | Intereses del financiamiento del proyecto |
| Inversiones en activos fijos (cuando se pagan) | Ingresos y pagos de préstamos |
| Variaciones de capital de trabajo (y su recupero) | Aportes de capital y repartos de dividendos |
| [[escudo-fiscal|Escudo fiscal]] de la amortización (vía menor IG) | Ahorro de impuestos por pago de intereses |
| Venta de activos al final, neta de su impuesto ([[valor-residual]]) | Reservas contables |
| [[costo-de-oportunidad|Costos de oportunidad]] de recursos propios usados | Costos asignados/prorrateados que no varían con el proyecto |

La exclusión de todo lo vinculado al financiamiento no es un descuido: **el proyecto se evalúa separado de cómo se financia**. El costo del financiamiento ya está dentro de la tasa de descuento ([[trema]]); meter los intereses en el flujo sería contarlos dos veces.

### Estructura temporal del flujo

Tres bloques sobre la línea de tiempo (los flujos se ubican **al final de cada período**; las inversiones iniciales, en el momento 0):

1. **Inversión inicial** — activos fijos + constitución del capital de trabajo + IVA de la inversión. Puede venir **en etapas** (típico de parcial: 30% en el año 0 y 70% en el año 1 — cada pago va en el momento en que se efectiviza, no cuando se "decide").
2. **Horizonte explícito** — los flujos operativos (FEO) de cada año.
3. **Flujo terminal (FEE)** — al cortar artificialmente el horizonte se supone que la planta vende todos los activos: [[valor-residual|valor terminal]] neto de impuestos + recupero del capital de trabajo.

### FEO: el flujo operativo

El **flujo de efectivo operativo** se obtiene del [[cuadro-de-resultados]] proyectado, corrigiendo lo contable a caja. Tres formas equivalentes:

$$FEO = UN + Am = (V - C)(1-t) + t \cdot Am = EBIT(1-t) + Am$$

**Donde:**
- $UN$: utilidad neta (después de impuesto a las ganancias)
- $Am$: amortizaciones del período (gasto no erogable)
- $V$: ingresos por ventas del período
- $C$: costos erogables (sin amortizaciones)
- $t$: alícuota del impuesto a las ganancias
- $EBIT$: utilidad operativa antes de impuestos e intereses

**Mini ejemplo (del PDF):** Ventas \$1.000.000, gastos operativos \$600.000 de los cuales \$100.000 son amortizaciones, $t = 35\%$. Utilidad antes de IG $= 400.000$; IG $= 140.000$; $UN = 260.000$. Entonces $FEO = 260.000 + 100.000 =$ \$360.000. Verificación por descomposición: $(1.000.000 - 500.000)(0{,}65) + 0{,}35 \cdot 100.000 = 325.000 + 35.000 = 360.000$ ✓.

La amortización **se resta para calcular el impuesto y se vuelve a sumar** porque no es salida de caja. Su único efecto real sobre el flujo es el [[escudo-fiscal]]: $t \cdot Am$ de impuesto que no se paga. De ahí la pregunta teórica clásica: *si la amortización contable se alarga (10 → 15 años), ¿el VAN sube o baja?* → **Baja**: el escudo total nominal es el mismo, pero se cobra más tarde y su valor presente es menor.

### FEE: venta de activos, impuesto y capital de trabajo

Al vender un activo, lo gravado es la **utilidad contable de la venta** = valor de mercado − valor de libro:

$$FF_{venta} = P_{venta} - t \cdot (P_{venta} - VL)$$

**Donde:**
- $P_{venta}$: precio de venta del activo (valor de mercado)
- $VL$: valor de libro = valor de origen − amortizaciones acumuladas

Caso de parcial: equipos vendidos al final por 300 con $VL = 0$ (ya totalmente amortizados) y $t = 30\%$ → utilidad gravada 300, impuesto 90, **flujo neto 210**. Si $P_{venta} < VL$ hay pérdida de capital → genera *ahorro* de impuesto. El capital de trabajo se recupera al final como ingreso (sin impuesto si se recupera a valor de libros; si se recupera menos — incobrables, inventario obsoleto — la diferencia es pérdida deducible).

### Criterios de decisión

Tipos de alternativas: **dependientes** (se aceptan juntas o ninguna), **independientes** (la decisión sobre una no afecta la otra: basta aceptar/rechazar) y **[[proyectos-mutuamente-excluyentes|mutuamente excluyentes]]** (aceptar una implica rechazar la otra: además hay que *ordenar*).

| Criterio | Qué mide | Regla de aceptación | Defecto principal |
|---|---|---|---|
| [[van]] | Ganancia en **pesos de hoy** por encima del costo del capital | $VAN > 0$ | Requiere conocer la TREMA (subjetiva del inversor) |
| [[tir]] | Rendimiento **porcentual** propio de la inversión | $TIR > TREMA$ | Supone reinversión a la TIR; [[tir-multiple|TIR múltiples]] si el flujo cambia de signo más de una vez; falla en el ranking de excluyentes |
| [[payback]] (PRS / PRCA) | **Tiempo** hasta recuperar la inversión | $PR <$ umbral fijado | Ignora el valor tiempo del dinero (el simple) e ignora todo lo que pasa después del recupero |
| [[costo-anual-equivalente|Valor Anual / CAE]] | El VAN repartido como **renta anual constante** | $VA \geq 0$ (en proyectos de costos: menor CAE) | Supone repetibilidad del proyecto |

**¿Cuándo coinciden VAN y TIR?** En proyectos **independientes y convencionales** (un solo cambio de signo) siempre: $TIR > TREMA \iff VAN > 0$ — el perfil del VAN es decreciente y corta el eje exactamente en la TIR. **¿Cuándo no?** En **mutuamente excluyentes** pueden ordenar distinto, por (1) diferencias de **escala** y (2) diferencias de **perfil temporal** (proyectos que recuperan pronto liberan caja para reinvertir). Ejemplo del PDF con TREMA 10%:

| Año | Proyecto A | Proyecto B |
|---|---|---|
| 0 | $-10.000$ | $-10.000$ |
| 1 | $0$ | $+6.000$ |
| 2 | $+13.924$ | $+7.200$ |
| **TIR** | 18% | **20%** ← TIR elige B |
| **VAN @10%** | **\$1.501** ← VAN elige A | \$1.401 |

Resolución: el valor terminal de A es 13.924; el de B, reinvirtiendo los 6.000 al 10% real, es $7.200 + 6.600 = 13.800 < 13.924$. **Gana A, como dijo el VAN.** La TIR de B asumía reinversión al 20% que no existe. Conclusión de cátedra: ante conflicto (a la izquierda de la **tasa de Fisher**, donde se cruzan los perfiles de VAN), **se decide por VAN**, porque su hipótesis de reinversión (a la TREMA) es la realista y porque maximiza riqueza en pesos.

Si las alternativas excluyentes tienen **vidas distintas**, no se comparan VANes directamente: o **cadena de reemplazo** (repetir el corto hasta igualar horizontes) o **anualidad equivalente** ([[costo-anual-equivalente]]) — ambas dan el mismo ranking.

### Receta para el caso tipo parcial (parque solar, 11-Nov-2025)

Problema 2 del parcial pasado: parque solar a 15 años. Checklist de armado:

1. **Estudio de la consultora ya pagado** → [[costo-hundido]], **se excluye** (común a hacer y no hacer el proyecto).
2. **Inversión en etapas**: 30% del total en el año 0, 70% en el año 1 → cada desembolso en su momento.
3. **Amortización contable lineal en 10 años sin valor residual**: $Am = VO/10$ por año, años 1–10. Es dato *contable*: solo entra al flujo vía impuesto.
4. **FEO por año** $= UN + Am$: años 1–10 con escudo de amortización; años 11–15 la amortización ya terminó → utilidad antes de IG mayor, más impuesto, FEO menor (todo lo demás igual).
5. **Año 15**: venta de equipos por 300 con $VL = 0$ → impuesto $0{,}30 \times 300 = 90$, flujo neto $+210$.
6. Descontar todo a la [[trema]] (10%) → $VAN \approx +1{,}88 > 0$ → **se recomienda hacer el proyecto**.
7. Pregunta teórica: ¿y si la amortización fuera en 15 años en vez de 10? → VAN **menor** (escudo fiscal diluido y cobrado más tarde → menor valor presente).

## Conceptos clave

### Construcción del flujo
- [[flujo-de-fondos-proyecto]] — qué entra, qué no, estructura temporal
- [[escudo-fiscal]] — $t \cdot Am$, el único efecto de caja de la amortización
- [[costo-hundido]] — se excluye siempre (pero su escudo de amortización no)
- [[costo-de-oportunidad]] — recursos propios valuados a mejor uso alternativo (existente, U2)
- [[capital-de-trabajo-en-proyectos]] — variaciones como flujo, recupero al final
- [[valor-residual]] — valor terminal e impuesto sobre la utilidad de venta

### Criterios de decisión
- [[van]] — criterio rector
- [[tir]] — rendimiento implícito del proyecto
- [[tir-multiple]] — flujos no convencionales, TER
- [[payback]] — PRS, PRCA y máxima exposición
- [[costo-anual-equivalente]] — valor anual, vidas distintas
- [[proyectos-mutuamente-excluyentes]] — conflicto VAN-TIR, tasa de Fisher
- [[trema]] — la vara contra la que todo se mide

## Fórmulas principales

Ver [[formulas/unidad-08]]. Imprescindibles:
- $VAN = \sum_{j=0}^{n} FC_j/(1+i)^j$; aceptar si $> 0$
- TIR: tasa que hace $VAN = 0$; aceptar si $TIR > TREMA$
- $FEO = UN + Am = (V-C)(1-t) + t \cdot Am$
- $FF_{venta} = P_{venta} - t(P_{venta} - VL)$
- $VA = VAN / a(n;i)$

## Ejercicios

- [[ejercicios/casos-evaluacion-proyectos]] — ejemplo integral del PDF (nuevo producto a 5 años con KT, créditos y valor terminal) + conflicto VAN-TIR + vidas distintas + costo hundido

## Conexiones

- **[[unidades/unidad-06-informacion-contable]]:** la contabilidad provee los insumos — [[amortizacion-contable]], [[cuadro-de-resultados]] proyectado, [[balance-patrimonial]] — y determina el impuesto a pagar; pero el proyecto se evalúa **por caja**, no por resultado contable ([[devengado-vs-percibido]]). La utilidad neta es solo un paso intermedio para llegar al FEO.
- **[[unidades/unidad-07-calculo-financiero]]:** el VAN es una aplicación directa del [[valor-tiempo-dinero]]; el CAE usa [[anualidades]]; la TIR es la misma idea que la TIR de un bono ([[bonos-renta-fija]]). Cuidar la coherencia de períodos y [[tasas-equivalentes]].
- **[[unidades/unidad-02-produccion-y-costos]]:** la TREMA *es* el [[costo-de-oportunidad]] del capital; la lógica incremental del flujo es la lógica [[costos-economicos-vs-contables|económica vs contable]] de la U2. $VAN = 0$ no es "no ganar nada": es ganar exactamente el [[beneficio-economico|beneficio normal]].
- **Unidad 5 (macro):** la TREMA se monta sobre la [[tasa-interes]] de la economía; en contextos inflacionarios cuidar tasas y flujos consistentes ([[tasa-interes-real]]).

## Errores comunes (mirar antes del parcial)

1. **Restar la amortización del flujo de caja.** No es erogable: se resta solo para calcular el IG y se vuelve a sumar ($FEO = UN + Am$). Olvidar sumarla de vuelta es el error #1.
2. **Incluir el costo hundido** (estudio ya pagado, I+D pasado). Se excluye aunque el enunciado lo destaque — está puesto para tentarte.
3. **Olvidar el impuesto sobre la venta del activo final.** No se embolsa el precio de venta: se embolsa $P - t(P - VL)$. Si el activo está totalmente amortizado, *toda* la venta es utilidad gravada.
4. **Poner la inversión completa en el año 0 cuando se paga en etapas.** Cada desembolso va cuando se efectiviza (30% año 0 / 70% año 1).
5. **Incluir intereses o cuotas del préstamo en el flujo.** El financiamiento queda afuera; su costo ya vive en la TREMA.
6. **Olvidar el recupero del capital de trabajo al final** (o computar el stock total cada año en vez de la *variación*).
7. **Decidir entre mutuamente excluyentes por TIR.** Ante conflicto manda el VAN. Y con vidas distintas, primero homogeneizar (cadena de reemplazo o CAE).
8. **Creer que amortizar más rápido "no cambia nada porque el total es igual".** Cambia el *timing* del escudo fiscal: amortización más rápida → escudo más temprano → VAN mayor.
9. **Aplicar TIR a flujos con más de un cambio de signo.** Puede haber múltiples TIR; usar VAN o TER.
10. **Confundir valor de libro con valor de mercado.** El VL solo sirve para calcular el impuesto de la venta; la caja entra por el valor de mercado.

## Temas sensibles para Parcial 2

- **Armar el flujo completo de un proyecto** con: costo hundido para excluir, inversión en etapas, amortización contable, escudo fiscal, IG, venta final de activos con impuesto, recupero de KT, descuento a TREMA → VAN y recomendación. (Es exactamente el Problema 2 del 11-Nov-2025.)
- **Pregunta conceptual del escudo:** efecto sobre el VAN de cambiar el plazo de amortización contable (más largo → VAN menor; más corto → mayor).
- **Conflicto VAN vs TIR** en mutuamente excluyentes: explicar la hipótesis de reinversión y decidir por VAN.
- **Payback:** calcularlo con flujos desiguales (interpolando la fracción de año) y enunciar sus dos defectos.
- **Vidas distintas:** cadena de reemplazo vs anualidad equivalente — mismo ranking.
- **Defender por qué los intereses no van en el flujo** y por qué la depreciación tampoco (pero su escudo sí).
