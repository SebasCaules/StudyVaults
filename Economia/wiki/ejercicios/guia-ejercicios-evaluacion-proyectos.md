---
unit: 08
module: Empresa
title: Guía de Ejercicios — Evaluación de Proyectos y Reemplazo (Partes 2 y 3)
parcial: 2
sources: [raw/modulo-3-empresa/unidad-07-calculo-financiero/12-05-07 GUIA_DE_EJERCICIOS__Economia_para_Ingenieros (rev.1).pdf, raw/modulo-3-empresa/unidad-07-calculo-financiero/Respuestas a algunas preguntas frecuentes.pdf]
last_updated: 2026-06-12
---

# Guía práctica — Partes 2 y 3 (resueltas)

> Guía de la cátedra (Dreizzen, Filgueira, Ventura, Yáñez — oct. 2010, rev. mayo 2012). La **Parte 1 (VTD)** está en [[ejercicios/guia-ejercicios-calculo-financiero]]. Acá se resuelven la **Parte 2 — Evaluación de Proyectos** (6 ejercicios) y la **Parte 3 — Análisis de Reemplazo** (2 ejercicios, numerados "2.8/2.9" por errata del PDF). Material núcleo del Parcial 2.

**Herramientas transversales:** [[conceptos/flujo-de-fondos-proyecto]], [[conceptos/van]], [[conceptos/escudo-fiscal]], [[conceptos/costo-hundido]], [[conceptos/trema]]. Recordá la receta de la cátedra para el flujo:

$$FEO = UN + Amort = (V-C)(1-t) + t\cdot Amort = (V-C) - t\,(V-C-Amort)$$

**Donde:**
- $V-C$: ingresos menos costos **erogables** (base caja, antes de amortizar)
- $t$: tasa de impuesto a las ganancias
- $Amort$: amortización contable del período (no eroga caja; solo genera escudo $t\cdot Amort$)
- $UN$: utilidad neta contable del período

$$FEE_{venta} = VM - t\,(VM - VL)$$

**Donde:**
- $VM$: valor de mercado (precio de venta del activo al final)
- $VL$: valor de libro = $VO -$ amortización acumulada
- si $VM > VL$ hay utilidad gravada; si $VM < VL$, la pérdida genera **ahorro** de impuesto

---

## Parte 2 — Evaluación de Proyectos

## Ej. 1 — FEO, FEE y VAN (fabricación de un producto)

**Datos.**

| Concepto | Valor | | Concepto | Valor |
|---|---|---|---|---|
| Inversión BU | \$1.000 | | Vida comercial producto | 3 años |
| VU contable (fiscal) | 10 años | | Ingresos netos de egresos (cash) | 550 \$/año |
| VU técnica | 3 años | | Inversión Kt (al inicio) | \$100 |
| Valor rezago contable | \$400 | | Recupero Kt (al final) | 80 % |
| Valor rezago técnico (mercado) | \$800 | | Impuesto a las ganancias | 30 % |

TREMA = 10 %. Horizonte del proyecto = **3 años** (lo fija la vida comercial/técnica, no la contable).

**Planteo.** La vida contable (10 años) solo sirve para calcular la **amortización**; el proyecto dura 3 años y al final se vende el bien a su valor de mercado (técnico).

$$Amort = \frac{VO - VR_{contable}}{VU_{contable}} = \frac{1000-400}{10} = 60 \text{ \$/año}$$

**Cuentas.**
- $FEO = (V-C)(1-t) + t\cdot Amort = 550(0{,}70) + 0{,}30(60) = 385 + 18 = \mathbf{403}$ \$/año.
- Valor de libro al año 3: $VL_3 = 1000 - 60\cdot 3 = 820$. Se vende a $VM = 800$ → **pérdida** de 20 → ahorro fiscal $0{,}30\cdot 20 = 6$.
  $$FEE_{activo} = 800 - 0{,}30(800-820) = 800 + 6 = \mathbf{806}$$
- Recupero de capital de trabajo: $0{,}80 \cdot 100 = 80$ (no tributa: es devolución de caja inmovilizada).

| Año | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Inversión (BU + Kt) | −1.100 | | | |
| FEO | | 403 | 403 | 403 |
| FEE (venta activo) | | | | 806 |
| Recupero Kt | | | | 80 |
| **Flujo de fondos** | **−1.100** | **403** | **403** | **1.289** |

$$VAN = -1100 + \frac{403}{1{,}1} + \frac{403}{1{,}1^2} + \frac{1289}{1{,}1^3} = \mathbf{+\$567{,}9}$$

**Resultado.** VAN ≈ **+\$568 > 0 → se acepta.**

**Interpretación.** La trampa es no confundir las tres "vidas": la **contable** (10 años) dicta la amortización; la **técnica/comercial** (3 años) dicta el horizonte; el **valor de mercado** (800) es lo que se cobra al vender, distinto del valor de libro (820). Vender por debajo del libro da una pérdida contable que **ahorra** impuesto.

---

## Ej. 2 — Reemplazo de máquina (Gatoturro S.A.)

**Datos.** Máquina nueva \$48.000 + instalación y flete \$2.000 (base amortizable \$50.000); Kt \$3.000 (recupera 100 %); entrenamiento \$4.000 (gasto en $t=0$); máquina vieja se vende hoy en \$10.000 (totalmente amortizada, $VL=0$). La nueva sube ventas \$5.000/año y baja costos \$8.000/año, dura 5 años, se amortiza a 0 en 5 años y se vende al final en \$15.000. IG 40 %, VAN 10 %, **enfoque fiscal**.

**Planteo (análisis incremental).** Todo "con proyecto" − "sin proyecto". La vieja no genera amortización (ya está en cero), así que la amortización incremental es la de la nueva: $50.000/5 = 10.000$/año.

**Cuentas — momento 0:**
- Compra + instalación: −50.000
- Capital de trabajo: −3.000
- Entrenamiento (gasto deducible): $-4.000(1-0{,}40) = -2.400$
- Venta de la vieja: $10.000 - 0{,}40(10.000-0) = +6.000$

$$FF_0 = -50.000 - 3.000 - 2.400 + 6.000 = \mathbf{-49.400}$$

**FEO (años 1–5):** beneficio incremental $(V-C) = 5.000 + 8.000 = 13.000$.
$$FEO = 13.000(0{,}60) + 0{,}40(10.000) = 7.800 + 4.000 = \mathbf{11.800}\text{/año}$$

**Terminal (año 5):** venta de la nueva $15.000 - 0{,}40(15.000-0) = 9.000$; recupero Kt $= 3.000$.

| Año | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| **Flujo de fondos** | −49.400 | 11.800 | 11.800 | 11.800 | 11.800 | 23.800 |

$$VAN = -49.400 + 11.800\cdot a(5;10\%) + \frac{12.000}{1{,}1^5} = \mathbf{+\$2.782}$$

**Resultado.** VAN ≈ **+\$2.782 > 0 → conviene el reemplazo.**

**Interpretación.** Tres sutilezas del reemplazo: (1) la venta de la **vieja** es un ingreso de hoy y tributa por estar amortizada; (2) el entrenamiento es **gasto deducible**, así que su costo neto es $4.000(1-t)=2.400$ — si se computara sin escudo (−4.000) el VAN bajaría a ≈ +\$1.182, igual positivo; (3) todo es **incremental** (Δventas + Δahorro de costos + Δamortización).

---

## Ej. 3 — Escudo fiscal de la amortización (dos países)

**Datos.** Inversión \$100.000, proyecto 4 años, sin valores de rezago, TREMA 15 %, IG 40 % en ambos países. País propio: lineal \$25.000/año. Otro país (acelerada): \$40.000, \$30.000, \$20.000, \$10.000. ¿En cuánto difiere el VAN? (*ceteris paribus*).

**Planteo (FAQ de la cátedra).** Como todo lo demás es idéntico, $VAN = VP(FFO) + VP(FFE)$ y $FFO=(V-C)(1-t)+ A\cdot t$. El **único** término que cambia entre países es el VP del escudo $A\cdot t$. Basta descontar la diferencia de escudos.

**Cuentas.**

| Año | Escudo país A ($0{,}4\cdot25k$) | Escudo país B | Dif. (B − A) | VP @15 % |
|---|---|---|---|---|
| 1 | 10.000 | 16.000 | +6.000 | +5.217 |
| 2 | 10.000 | 12.000 | +2.000 | +1.512 |
| 3 | 10.000 | 8.000 | −2.000 | −1.315 |
| 4 | 10.000 | 4.000 | −6.000 | −3.431 |
| | | | | **+1.984** |

$$VAN_B - VAN_A = \sum \frac{t\,(A_B - A_A)}{1{,}15^{\,j}} = \mathbf{+\$1.984}$$

**Resultado.** El VAN en el país de **amortización acelerada** es **\$1.984 mayor**. ✅ Coincide con el resultado oficial de la FAQ (que además corrige una errata de la hoja de resultados: es \$1.984, no \$1.994).

**Interpretación.** El escudo nominal total es el mismo (\$40.000 en ambos: $0{,}4\times100.000$), pero **adelantarlo** lo hace valer más hoy. Es exactamente la lógica de la pregunta teórica del [[examenes/parcial-2-2025-11-11|parcial 2025 P2b]]: amortizar más rápido sube el VAN. Ver [[conceptos/escudo-fiscal]].

---

## Ej. 4 — VAN de un producto nuevo (con costos prorrateados)

**Datos.** Volumen 35.000 u/año; maquinaria \$200.000, vida útil 5 años, se vende al final en \$25.000; se amortiza en 4 años con VR \$20.000; Kt \$80.000 (recupera 80 %); precio 20 \$/u, CV 8 \$/u, fijos erogables **propios** 60.000 \$/año, fijos **prorrateados** 5.000 \$/año; IG 30 %, VAN 15 %.

> ⚠️ **Ambigüedad del enunciado:** dice "vender durante 10 años" pero la maquinaria tiene vida útil de 5 años y se vende al final de *ella*. Sin datos de una segunda máquina, se evalúa el proyecto a **5 años** (lo limita el activo). Conviene declararlo por escrito en el parcial.

**Planteo.** Los **\$5.000 prorrateados NO van al flujo** (FAQ): existen con o sin proyecto, solo se reasignan. Amortización: $(200.000-20.000)/4 = 45.000$/año los años 1–4, y **0** el año 5.

**Cuentas.**
- $(V-C) = (20-8)\cdot 35.000 - 60.000 = 420.000 - 60.000 = 360.000$/año.
- $FEO_{1-4} = 360.000(0{,}70) + 0{,}30(45.000) = 252.000 + 13.500 = \mathbf{265.500}$.
- $FEO_5 = 360.000(0{,}70) + 0 = \mathbf{252.000}$ (ya no hay amortización).
- Venta máquina año 5: $VL_5 = 20.000$ → $25.000 - 0{,}30(25.000-20.000) = 23.500$.
- Recupero Kt: $0{,}80\cdot 80.000 = 64.000$.

| Año | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| **Flujo** | −280.000 | 265.500 | 265.500 | 265.500 | 265.500 | 339.500 |

$$VAN = -280.000 + 265.500\cdot a(4;15\%) + \frac{339.500}{1{,}15^5} = \mathbf{+\$646.788}$$

**Resultado.** VAN ≈ **+\$646.800 > 0 → muy conveniente** (paga la inversión en menos de 2 años).

**Interpretación.** Dos trampas: (1) los **prorrateados** se descartan por el test de la FAQ ("¿está el costo con proyecto? ¿está sin proyecto?" — si sí en ambos, fuera); (2) la **amortización se agota** en el año 4 (en 4 años, no en los 5 del proyecto), por eso el FEO del año 5 baja: se pierde el escudo. Ver [[conceptos/flujo-de-fondos-proyecto]].

---

## Ej. 5 — Automatización (estudio hundido)

**Datos.** Estudio previo \$5.000 (ya gastado); equipo \$80.000; ahorros \$22.000/año (menos MOD y MP); vida 5 años, amortiza a 0 en 5 años; valor de mercado final \$20.000; IG 34 %, TREMA 10 %.

**Planteo.** El estudio de \$5.000 es **[[conceptos/costo-hundido|costo hundido]]** → fuera del flujo. El "ingreso" del proyecto es el **ahorro** de costos. Amortización $80.000/5 = 16.000$/año.

**Cuentas — FEO por los tres enfoques (deben coincidir):**

| Enfoque | Cálculo | FEO |
|---|---|---|
| $UN + Amort$ | $(22.000-16.000)(0{,}66) + 16.000 = 3.960+16.000$ | **19.960** |
| $(V-C)(1-t)+t\,Amort$ | $22.000(0{,}66) + 0{,}34(16.000) = 14.520+5.440$ | **19.960** |
| $(V-C)-t(V-C-Amort)$ | $22.000 - 0{,}34(22.000-16.000) = 22.000-2.040$ | **19.960** |

- Venta final: $20.000 - 0{,}34(20.000-0) = 13.200$.

| Año | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| **Flujo** | −80.000 | 19.960 | 19.960 | 19.960 | 19.960 | 33.160 |

$$VAN = -80.000 + 19.960\cdot a(5;10\%) + \frac{13.200}{1{,}1^5} = \mathbf{+\$3.860}$$

**Resultado.** VAN ≈ **+\$3.860 > 0 → se realiza** (apenas positivo: comentar sensibilidad).

**Interpretación.** Un **ahorro** de costos entra al flujo igual que un ingreso. Los tres enfoques del FEO son idénticos por construcción algebraica — el examen suele pedir mostrar los tres.

---

## Ej. 6 — FEO/FEE por los tres enfoques + VAN

**Datos.** Inversión \$1.000 (vida contable 10 años); estudio técnico \$105 ya pagado (**hundido**); produce 5 años, ventas \$700/año, costos \$100/año, IG 35 %; se vende en cualquier momento en \$100; Kt \$200 (recupera 80 %); TREMA 20 %.

**Planteo.** Amortización $1.000/10 = 100$/año. El proyecto dura 5 años aunque la vida contable sea 10 → al año 5 el bien **no** está totalmente amortizado.

**Cuentas — FEO (años 1–5):**

| Enfoque | FEO |
|---|---|
| $UN+Amort = (700-100-100)(0{,}65)+100 = 325+100$ | **425** |
| $(V-C)(1-t)+t\,Amort = 600(0{,}65)+0{,}35(100)$ | **425** |
| $(V-C)-t(V-C-Amort) = 600-0{,}35(500)$ | **425** |

**FEE — venta del activo:** $VL_5 = 1.000 - 100\cdot 5 = 500$. Se vende a \$100 → **pérdida** de 400 → ahorro $0{,}35\cdot400 = 140$.
$$FEE_{activo} = 100 - 0{,}35(100-500) = 100 + 140 = \mathbf{240}$$
**Recupero Kt:** $0{,}80\cdot 200 = 160$.

| Año | 0 | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|---|
| **Flujo** | −1.200 | 425 | 425 | 425 | 425 | 825 |

$$VAN = -1.200 + 425\cdot a(5;20\%) + \frac{400}{1{,}2^5} = \mathbf{+\$231{,}8}$$

**Resultado.** VAN ≈ **+\$232 > 0 → se acepta.**

**Interpretación.** Como la vida contable (10) supera la del proyecto (5), el bien se vende con **valor de libro alto** (500) por encima del precio (100): la pérdida contable genera un **ahorro** fiscal de 140 que mejora el FEE. Es la situación inversa al activo totalmente amortizado (donde toda la venta es ganancia gravada).

---

## Parte 3 — Análisis de Reemplazo

> **Vida económica:** el período de tenencia que **minimiza el costo anual equivalente (CAE / VAE)** de poseer y operar el activo. Como un activo se reemplaza repetidamente (hipótesis de repetibilidad), no se comparan VAN de distinta duración directamente: se anualiza cada VAN a un **[[conceptos/costo-anual-equivalente|CAE]]** y se elige el de **menor costo** (CAE menos negativo). Método explicado en la FAQ de la cátedra.

**Receta.** Para cada vida candidata $N$:
1. Flujo operativo anual (solo costos, con escudo de amortización): $\;op_t = -OM_t(1-t) + t\cdot Amort$.
2. Salvataje neto si se vende en $N$: $\;VU_N - t\,(VU_N - VL_N)$.
3. $VAN(N) = -I + \sum_{t=1}^{N}\dfrac{op_t}{(1+i)^t} + \dfrac{salv_N}{(1+i)^N}$.
4. $CAE(N) = \dfrac{VAN(N)}{a(N;i)}$. Se elige el $N$ con **CAE máximo** (menor costo, porque son negativos).

## Ej. 1 (2.8) — Vida económica de un equipo

**Datos.** Inversión \$50.000; TREMA 20 %, IG 50 %; amortización $10.000$/año (valor de libro 40k → 0). Tabla:

| Año $N$ | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Valor libro | 40.000 | 30.000 | 20.000 | 10.000 | 0 |
| Valor usado (mercado) | 36.000 | 28.000 | 24.000 | 16.000 | 2.000 |
| Gastos O&M | 5.000 | 8.000 | 9.500 | 13.000 | 17.000 |

**Cuentas.** $op_t = -OM_t(0{,}5) + 0{,}5(10.000)$; $salv_N = VU_N - 0{,}5(VU_N - VL_N)$.

| $N$ | $op_N$ | Salv. neto | $VAN(N)$ | **$CAE(N)$** |
|---|---|---|---|---|
| 1 | +2.500 | 38.000 | −16.250 | −19.500 |
| 2 | +1.000 | 29.000 | −27.083 | −17.727 |
| 3 | +250 | 22.000 | −34.346 | −16.305 |
| 4 | −1.500 | 13.000 | −41.532 | **−16.043** ← mín. costo |
| 5 | −3.500 | 1.000 | −48.806 | −16.320 |

**Resultado.** **Vida económica = 4 años** (CAE = −\$16.043, el menos negativo). Conviene reemplazar el equipo al cabo de **4 años**, no esperar a que se agote la vida técnica (5).

**Interpretación.** Los primeros años el flujo operativo es **positivo** (el escudo de amortización \$5.000 supera el O&M neto); a partir del año 4 el O&M creciente lo vuelve negativo y la pérdida de valor de reventa se acelera. El óptimo es interior: ni muy temprano (no se aprovecha el activo) ni muy tarde (O&M castiga).

## Ej. 2 (2.9) — Período óptimo de reemplazo

**Datos.** Máquina \$100.000; O&M \$30.000 el primer año, **+\$10.000/año**; valor de reventa $VM(n)=100.000-15.000\,n$; vida técnica/contable 5 años (VRC 0, amortización \$20.000/año); IG 50 %, TREMA 20 %.

**Cuentas.** $op_t = -OM_t(0{,}5) + 0{,}5(20.000)$; $VL_n = 100.000-20.000\,n$; $salv_n = VM(n)-0{,}5(VM(n)-VL_n)$.

| $n$ | O&M | $op_n$ | $VM(n)$ | Salv. neto | $VAN(n)$ | **$CAE(n)$** |
|---|---|---|---|---|---|---|
| 1 | 30.000 | −5.000 | 85.000 | 82.500 | −35.417 | **−42.500** ← mín. costo |
| 2 | 40.000 | −10.000 | 70.000 | 65.000 | −65.972 | −43.182 |
| 3 | 50.000 | −15.000 | 55.000 | 47.500 | −92.303 | −43.819 |
| 4 | 60.000 | −20.000 | 40.000 | 30.000 | −114.969 | −44.411 |
| 5 | 70.000 | −25.000 | 25.000 | 12.500 | −134.460 | −44.961 |

**Resultado.** El CAE **crece** (más costo) en forma monótona con $n$ → **período óptimo = 1 año** (CAE = −\$42.500).

**Interpretación.** Solución de **borde**: el O&M sube muy agresivamente (+\$10.000/año, +33 % el primer salto) y la reventa cae linealmente \$15.000/año, así que cada año extra de tenencia encarece el costo anual equivalente. Con esta estructura de deterioro conviene rotar el equipo apenas cumple un año. (Si el enunciado de examen diera incrementos de O&M más suaves, el óptimo se correría hacia adentro como en el Ej. 1 — lo importante es **construir la tabla de CAE y elegir el mínimo**, no memorizar un año.)

---

## Errores frecuentes detectados al resolver

1. **Meter el costo hundido al flujo** (ej. 5 estudio \$5.000, ej. 6 estudio \$105): ya se pagó, no depende del proyecto → fuera. En el [[examenes/parcial-2-2025-11-11|parcial 2025]] y en [[examenes/parcial-2-2010-11-19|2010]] incluir la consultora cambia hasta el signo del VAN.
2. **Computar los costos prorrateados** (ej. 4 los \$5.000, FAQ): pasan el test "están con y sin proyecto" → no son incrementales, se descartan.
3. **Confundir las tres "vidas"** (ej. 1, 4, 6): la **contable** fija la amortización, la **técnica/comercial** el horizonte, el **valor de mercado** lo que se cobra al vender. Vender por debajo del valor de libro da pérdida que **ahorra** impuesto (ej. 1 y 6); por encima, ganancia gravada.
4. **Olvidar que la amortización se agota** (ej. 4): si se amortiza en 4 años y el proyecto dura 5, el último año desaparece el escudo y el FEO baja.
5. **No anualizar al comparar reemplazos de distinta duración** (Parte 3): comparar VAN de 1 vs 5 años es incomparable; hay que pasar al **CAE/VAE**. Ver [[conceptos/costo-anual-equivalente]].
6. **Tratar el entrenamiento/capacitación como inversión amortizable** (ej. 2): es **gasto** deducible en el momento → escudo inmediato, no se amortiza.
7. **No gravar la venta del activo viejo en un reemplazo** (ej. 2): si está amortizado ($VL=0$), toda la venta es ganancia gravada.
8. **Recuperar el 100 % del capital de trabajo** cuando el enunciado dice 80 % (ej. 1, 4, 6): el faltante se pierde.
