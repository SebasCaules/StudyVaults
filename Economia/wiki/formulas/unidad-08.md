---
unit: 08
title: Fórmulas — Unidad 8 (Evaluación de Proyectos)
sources: [raw/modulo-3-empresa/unidad-08-evaluacion-proyectos/epi09_pc 2.pdf]
last_updated: 2026-06-12
---

## Valor Actual Neto (VAN)

$$\boxed{VAN = -I + P = \sum_{j=0}^{n} \frac{FC_j}{(1+i)^j}}$$

Donde:
- $I$: valor presente del costo del proyecto (inversión)
- $P$: valor presente de los flujos futuros
- $FC_j$: flujo de caja neto del período $j$ ($FC_0 = -I$)
- $i$: tasa de descuento = TREMA (refleja el riesgo del proyecto)
- $n$: períodos del horizonte

**Criterio:** $VAN > 0$ aceptar; $= 0$ indiferente (gana exactamente la tasa requerida); $< 0$ rechazar.

**Uso:** descontar siempre **flujos de caja después de impuestos**, nunca utilidades contables. El VAN mide pesos de hoy por encima del costo del capital; supone reinversión de los flujos a la TREMA. Ante conflicto de ranking con la TIR, **manda el VAN**.

## Tasa Interna de Retorno (TIR) — definición implícita

$$\boxed{\sum_{j=0}^{n} \frac{FC_j}{(1+TIR)^j} = 0}$$

Donde:
- $TIR$: tasa que anula el VAN (incógnita, se tantea o Excel)

**Criterio:** $TIR > TREMA$ aceptar; $=$ indiferente; $<$ rechazar.

**Uso:** mide rendimiento % por período, propio de la inversión (no del inversor). Supone reinversión a la propia TIR (irrealista). Con un solo flujo: $TIR = FC_1/I - 1$. No usar para rankear mutuamente excluyentes ni con flujos que cambian de signo más de una vez.

## Tasa Externa de Retorno (TER / TIR modificada)

$$\boxed{(1+TER)^n = \frac{VF_{ingresos}}{VP_{egresos}}}$$

Donde:
- $VF_{ingresos}$: flujos positivos capitalizados a la TREMA hasta $n$
- $VP_{egresos}$: flujos negativos descontados a la TREMA a 0

**Uso:** remedio para [[tir-multiple|TIR múltiples]] en flujos no convencionales — deja un solo egreso y un solo ingreso → tasa única.

## Período de recupero (payback)

**Simple (PRS):** con flujos desiguales, acumular e interpolar la fracción de año:

$$PR = a + \frac{I - \sum_{j=1}^{a} FC_j}{FC_{a+1}}$$

Donde:
- $a$: último año con acumulado negativo
- $FC_{a+1}$: flujo del año en que se completa el recupero

**Descontado (PRCA):** misma cuenta pero acumulando $FC_j/(1+i)^j$. Siempre $PRCA \geq PRS$.

**Máxima exposición:** saldo acumulado más negativo del proyecto (lo máximo invertido "bajo tierra" en algún momento).

**Uso:** criterio de riesgo/liquidez. Defectos: el simple ignora el valor tiempo del dinero; ambos ignoran los flujos posteriores al recupero.

## FEO — Flujo de efectivo operativo (tres formas equivalentes)

$$\boxed{FEO = UN + Am}$$

$$FEO = (V - C)(1-t) + t \cdot Am \qquad \text{(método del escudo fiscal)}$$

$$FEO = EBIT(1-t) + Am$$

Donde:
- $UN$: utilidad neta contable (después de IG)
- $Am$: amortizaciones del período (no erogables)
- $V$: ventas; $C$: costos erogables (sin amortización)
- $t$: alícuota del impuesto a las ganancias
- $EBIT$: utilidad operativa antes de impuestos ($V - C - Am$)

**Equivalencia:** $EBIT(1-t) + Am = (V - C - Am)(1-t) + Am = (V-C)(1-t) + t \cdot Am$.

**Uso:** la amortización se resta solo para calcular el IG y se suma de vuelta. Verificación rápida (PDF): $V = 1.000$; $C = 500$; $Am = 100$; $t = 35\%$ → $FEO = 650 - 325 + 35 = 360 = UN(260) + Am(100)$.

## Escudo fiscal de la amortización

$$\boxed{Escudo_t = t \cdot Am}$$

**Valor presente del escudo** (amortización lineal por $n_{am}$ años):

$$VP_{escudo} = t \cdot Am \cdot a(n_{am}; i)$$

Donde:
- $n_{am}$: plazo de amortización contable
- $a(n_{am};i)$: factor de VP de anualidad (ver abajo)

**Uso:** pregunta típica — alargar la amortización contable (10 → 15 años) deja el escudo nominal total igual pero lo cobra más tarde → $VP_{escudo}$ menor → **VAN menor**. Amortización acelerada → VAN mayor. El escudo requiere utilidades gravadas (quebrantos trasladables hasta 5 años).

## Amortización contable lineal

$$Am = \frac{VO - VR}{n_{vu}} \qquad (\text{sin valor residual: } Am = VO/n_{vu})$$

$$VL = VO - Am_{acumuladas}$$

Donde:
- $VO$: valor de origen del activo
- $VR$: valor residual contable asumido
- $n_{vu}$: vida útil contable (años)
- $VL$: valor de libro al momento de medirlo

**Uso:** dato contable; al flujo solo entra vía impuestos (escudo y utilidad de venta). Ver [[amortizacion-contable]].

## FEE — Venta de activos fijos con impuesto (flujo terminal)

$$\boxed{FF_{venta} = P_{venta} - t \cdot (P_{venta} - VL)}$$

Donde:
- $P_{venta}$: precio de venta (valor de mercado)
- $(P_{venta} - VL)$: utilidad contable de la venta, gravada por IG

**Casos:** $P > VL$ → ganancia de capital, paga impuesto. $P < VL$ → pérdida deducible: $FF = P + t(VL - P)$. $P = VL$ → neutro.

**Uso:** caso parcial — venta por 300 con $VL = 0$, $t = 30\%$: $FF = 300 - 0{,}3 \cdot 300 = 210$. Si el activo está totalmente amortizado, toda la venta es utilidad gravada.

## Capital de trabajo — variación y recupero

$$\text{Efecto sobre } FF_t = -\Delta KT_t = -(KT_t - KT_{t-1})$$

Donde:
- $KT_t$: capital de trabajo requerido al cierre del período $t$ (caja mínima + créditos + inventarios − deudas comerciales)

**Uso:** aumento → egreso; reducción → ingreso; al cierre del proyecto se recupera todo (ingreso). Si se recupera menos (incobrables, inventario obsoleto), la diferencia es pérdida deducible. No genera escudo (no es gasto). Variaciones = final − inicial.

## Valor Anual Equivalente (VA / CAE)

$$\boxed{VA = \frac{VAN}{a(n;i)}} \qquad a(n;i) = \frac{1 - (1+i)^{-n}}{i}$$

Donde:
- $a(n;i)$: factor de valor presente de una anualidad ([[anualidades]], U7)

**Criterio:** aceptar si $VA \geq 0$. En proyectos de costos se compara el **Costo Anual Equivalente**: gana el menor.

**Uso:** comparar mutuamente excluyentes con **vidas distintas** (equivale a la cadena de reemplazo con repetición indefinida). Ejemplos PDF: $2.872/1{,}690 = 1.699{,}6$ (2 años, 12%); $118{,}7/3{,}784 = 31{,}4$ (6 años, 15%).

## Cadena de reemplazo (vidas distintas)

Repetir el proyecto corto hasta igualar la vida del largo (si no es múltiplo justo: repetir ambos hasta el mcm). Ejemplo PDF (12%): A (5 años, $VAN = 3{,}518$) repetido a 10 años:

$$VAN_A^{10} = 3{,}75 \cdot a(10;12\%) - 10 \cdot (1{,}12)^{-5} - 10 = 21{,}188 - 5{,}674 - 10 = 5{,}514$$

contra B (10 años) $VAN_B = 4{,}123$ → gana A. Por anualidad equivalente: $0{,}9759 > 0{,}7297$ → idéntica conclusión.

## Índice de rentabilidad (IR)

> Nota: **no aparece en el PDF de la cátedra**; se incluye por completitud del criterio VAN.

$$IR = \frac{VP(\text{flujos futuros})}{I} \qquad IR > 1 \iff VAN > 0$$

**Uso:** mide valor presente por peso invertido; útil para ordenar proyectos bajo racionamiento de capital. Comparte los defectos de los ratios: ciego a la escala.

## Tasa de Fisher (conflicto VAN–TIR)

Tasa a la que se cruzan los perfiles de VAN de dos proyectos: $VAN_1(r_F) = VAN_2(r_F)$.

**Uso:** si $TREMA < r_F$ hay conflicto de ranking entre VAN y TIR → decidir por **VAN**. Si $TREMA > r_F$, ambos criterios ordenan igual. (Ejemplo PDF: $r_F = 8{,}7\%$; $TIR_1 = 18{,}1\%$, $TIR_2 = 23{,}6\%$.)

## Recordatorios de armado del flujo

- Flujos al **final de cada período**; inversión inicial en el momento 0 (si se paga en etapas, cada pago en su momento: 30% año 0 / 70% año 1).
- $FF = $ Ingresos (UAII + Am + recupero IVA + venta de activos + valor terminal) $-$ Egresos ($\Delta KT$ + IVA inversión + IG + inversiones en activos fijos).
- **Nunca incluir:** amortización como egreso, costos hundidos, intereses/préstamos/aportes/dividendos, escudo de intereses.
- Internos, Ingresos Brutos y Sellos: tratarlos **como un costo más**. IG de referencia del PDF: 35% (en parciales recientes: 30%).

## Variables

- $FC_j, FF$: flujo de caja del período $j$
- $I$: inversión inicial; $P$: VP de flujos futuros
- $i$: TREMA (tasa requerida mínima aceptable)
- $t$: alícuota de impuesto a las ganancias
- $UN$: utilidad neta; $EBIT$: utilidad operativa; $Am$: amortización
- $VO$: valor de origen; $VR$: valor residual contable; $VL$: valor de libro
- $KT$: capital de trabajo; $\Delta KT$: su variación
- $a(n;i)$: factor de VP de anualidad; $n$: períodos
- $r_F$: tasa de Fisher; $TER$: tasa externa de retorno
