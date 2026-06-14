---
unit: 06
source: GP5_ePI_0209 (1).doc
tipo: guia-practica
last_updated: 2026-06-12
---

# GP N°5 — La Información Contable

> Resolución completa paso a paso. **Unidad 6**: balance y cuadro de resultados desde movimientos (Ej 1), venta de bienes de uso (Ej 2), beneficio fiscal por deducción acelerada (Ej 3), devengamiento de intereses (Ej 4), reconstrucción de balance por ratios (Ej 5), cobertura de intereses (Ej 6) y capital de trabajo (Ej 7).

---

## Ej 1 — Balance y cuadro de resultados de CONTA (movimientos de marzo/19)

### Datos

Balance al 28/2/19 (en \$): Disponibilidades 200, Inversiones 600, Créditos por ventas 300, Bienes de cambio 550 (200 u → \$2,75/u), Bienes de uso V.O. 3500 con A.A. (250) → neto 3250. **Activo total 4900.** Proveedores 550, Sueldos y cargas a pagar 170, Gastos varios a pagar 80, Deuda bancaria 400; Capital 3300, Resultados acumulados 400. **Total 4900.**

Movimientos de marzo: 1) compra 100 u a \$2,5 a 30 días; 2) cobro de créditos \$200; 3) pago a proveedores \$500; 4) cancela 50% de la deuda bancaria; 5) vende 100 u a \$4 (\$50 contado, resto a crédito); 6) paga sueldos/cargas de febrero (\$170); 7) vende bonos a \$500 (costo \$400); 8) gastos del mes: salarios \$100 (aportes 30%) y alquileres/energía \$60; 9) amortizaciones \$80.

### Planteo

Procesar cada movimiento por [[conceptos/partida-doble]] (toda operación toca ≥ 2 cuentas) y separar **patrimonial** (solo permuta de cuentas del balance) de lo que **genera resultado** (cuentas R+/R−), aplicando [[conceptos/devengado-vs-percibido]]:
- El pago de sueldos de **febrero** (mov. 6) cancela un pasivo: **no** es gasto de marzo.
- Los gastos **devengados** de marzo (mov. 8) son gasto aunque no se paguen: van a pasivo.
- ⚠️ verificar (supuesto): "salarios \$100 (aportes 30%)" se interpreta como \$100 de sueldo + 30% de cargas sociales = **\$130 devengados**. Si el enunciado quisiera \$100 totales, el gasto sería 100 y el resultado mejora en 30.
- ⚠️ verificar (supuesto de valuación): el enunciado no fija método de inventarios; se usa **PEPS**: las 100 u vendidas salen del stock inicial a \$2,75 → CMV = 275. Con precio promedio ponderado (PPP): costo medio $= (550+250)/300 = 2{,}6\overline{6}$ → CMV = 266,67 y el resultado mejora en 8,33.

### Cuentas

| # | Debe | Haber |
|---|---|---|
| 1 | Bienes de cambio 250 | Proveedores 250 |
| 2 | Disponibilidades 200 | Créditos por ventas 200 |
| 3 | Proveedores 500 | Disponibilidades 500 |
| 4 | Deuda bancaria 200 | Disponibilidades 200 |
| 5a | Disponibilidades 50 + Créditos 350 | Ventas (R+) 400 |
| 5b | CMV (R−) 275 | Bienes de cambio 275 |
| 6 | Sueldos y cargas a pagar 170 | Disponibilidades 170 |
| 7 | Disponibilidades 500 | Inversiones 400 + Resultado venta inversiones (R+) 100 |
| 8 | Sueldos y cargas (R−) 130; Alquileres/energía (R−) 60 | Sueldos y cargas a pagar 130; Gastos varios a pagar 60 |
| 9 | Amortizaciones (R−) 80 | Amortizaciones acumuladas 80 |

Control de Disponibilidades: $200 + 200 - 500 - 200 + 50 - 170 + 500 = 80$ (en el orden del enunciado queda transitoriamente negativa — supone giro en descubierto o reordenar cobros antes que pagos; al cierre es positiva).

### Resultado

**Cuadro de resultados de marzo/19:**

| | \$ |
|---|---|
| Ventas | 400 |
| − CMV (PEPS) | (275) |
| **Utilidad bruta** | 125 |
| − Sueldos y cargas sociales | (130) |
| − Alquileres, energía, etc. | (60) |
| − Amortizaciones | (80) |
| **Utilidad operativa** | (145) |
| + Resultado venta de inversiones (500 − 400) | 100 |
| **Resultado del ejercicio (pérdida)** | **(45)** |

**Balance al 31/3/19:**

| Activo | \$ | Pasivo + PN | \$ |
|---|---|---|---|
| Disponibilidades | 80 | Proveedores | 300 |
| Inversiones | 200 | Sueldos y cargas soc. a pagar | 130 |
| Créditos por ventas | 450 | Gastos varios a pagar | 140 |
| Bienes de cambio (200 u) | 525 | Deuda bancaria | 200 |
| Bienes de uso (V.O.) | 3500 | **Total pasivo** | **770** |
| Amortizaciones acumuladas | (330) | Capital | 3300 |
| Bienes de uso neto | 3170 | Resultados acumulados (400 − 45) | 355 |
| **TOTAL** | **4425** | **TOTAL** | **4425** ✓ |

### Interpretación

La empresa **perdió \$45 devengados** pero la caja cayó \$120 (de 200 a 80): vendió a crédito (\$350 todavía sin cobrar) y canceló pasivos. La venta de bonos (+100) es resultado **de inversiones**, no Ventas: no infla la utilidad operativa. El stock queda valuado a PEPS: 100 u remanentes del lote viejo (\$2,75) + 100 u nuevas (\$2,50) = \$525. Conciliación caja↔resultado en [[conceptos/estado-origen-aplicacion-fondos]].

---

## Ej 2 — Liquidación: venta de bienes de uso

### Datos

Se vende todo, 60% al contado y 40% a crédito:
- **Muebles** por \$80 — V.O. \$80, hace 5 años, V.U. 5 años.
- **Equipos** por \$120 — V.O. \$80, hace 5 años, V.U. 10 años.
- **Terrenos** por \$300 — V.O. \$240, hace 10 años.

### Planteo

Resultado por venta de un bien de uso $= Precio - V.L.$, con $V.L. = V.O. - A.A.$ y $A.A. = Am \times años$ (amortización lineal, sin valor residual indicado). Recordar: **los terrenos no se amortizan** ([[conceptos/amortizacion-contable]]).

| Bien | V.O. | A.A. | V.L. | Precio | Resultado |
|---|---|---|---|---|---|
| Muebles | 80 | $80 \cdot \tfrac{5}{5} = 80$ (totalmente amortizado) | 0 | 80 | **+80** |
| Equipos | 80 | $80 \cdot \tfrac{5}{10} = 40$ | 40 | 120 | **+80** |
| Terrenos | 240 | 0 (no se amortizan) | 240 | 300 | **+60** |
| **Total** | | | **280** | **500** | **+220** |

### Cuentas

| Debe | Haber |
|---|---|
| Disponibilidades 300 (60% × 500) | Muebles 80 |
| Créditos 200 (40% × 500) | Equipos 80 |
| Amort. acum. muebles 80 | Terrenos 240 |
| Amort. acum. equipos 40 | Resultado venta bienes de uso (R+) 220 |

Control: Debe $= 300+200+80+40 = 620$; Haber $= 80+80+240+220 = 620$ ✓ (los bienes se dan de baja por su V.O. y se cancelan sus amortizaciones acumuladas).

### Resultado

**Ganancia por liquidación = \$220** (80 + 80 + 60), cobrando \$300 ahora y \$200 a crédito.

### Interpretación

El resultado **no** es "precio − valor original": es **precio − valor de libros**. Los muebles, ya totalmente amortizados, generan ganancia por el 100% del precio: su costo ya pasó por resultados vía amortización en los 5 años previos ([[conceptos/devengado-vs-percibido]] aplicado al activo fijo). El terreno gana solo +60 pese al precio mayor, porque nunca se amortizó.

---

## Ej 3 — Beneficio fiscal: deducción acelerada de la compra

### Datos

Maquinaria \$1.000.000, amortización lineal en 10 años con 10% de valor residual. Norma de fomento: permite deducir del impuesto a las ganancias el **100% de la compra en el año 0** como si fuera gasto. Tasa de IG: 35%. Comparar IG devengado año por año entre **situación I** (sin beneficio) y **II** (con beneficio).

### Planteo

Amortización contable/impositiva normal:

$$Am = \frac{V.O. - V.R.}{V.U.} = \frac{1.000.000 - 100.000}{10} = 90.000 \;\text{\$/año (años 1 a 10)}$$

Cada peso deducido ahorra $0{,}35$ de impuesto ([[conceptos/escudo-fiscal]]):
- **Situación I:** deduce \$90.000 por año durante 10 años → ahorra $31.500$/año.
- **Situación II:** deduce \$1.000.000 en el año 0 → ahorra $350.000$ de una vez; en los años 1–10 ya no deduce nada (la amortización contable sigue devengándose, pero no es deducible: el bien ya fue descargado fiscalmente).

### Cuentas

Variación del IG devengado de II respecto de I ($\Delta IG = IG_{II} - IG_{I}$):

| Año | Deducción I | Deducción II | $\Delta IG$ (II − I) |
|---|---|---|---|
| 0 (compra) | 0 | 1.000.000 | **−350.000** (paga menos) |
| 1 a 10 (c/u) | 90.000 | 0 | **+31.500** (paga más) |
| Suma nominal | 900.000 | 1.000.000 | **−35.000** |

### Resultado

Con el beneficio fiscal, la empresa **devenga \$350.000 menos de IG en el año 0** y **\$31.500 más en cada uno de los años 1 a 10**.

### Interpretación

Dos efectos a favor de la situación II:
1. **Adelantamiento del escudo fiscal:** el ahorro total es casi el mismo, pero cobrado **hoy** en lugar de en cuotas a 10 años. Su valor económico es el descuento financiero de esa diferencia de timing — se cuantifica con [[conceptos/valor-tiempo-dinero]] (U7) y es exactamente la lógica del [[conceptos/escudo-fiscal]] en los proyectos (U8).
2. **Deducción extra del valor residual:** la suma nominal favorece a II en $35.000 = 0{,}35 \times 100.000$, porque la norma permite deducir el 100% (incluido el V.R. de \$100.000 que, por amortización normal, nunca pasa a resultados mientras el bien no se venda).

Nótese el rol del [[conceptos/devengado-vs-percibido]]: la **erogación** por la máquina ocurre una sola vez (año 0) en ambas situaciones; lo que cambia entre I y II es **cuándo se devenga** la deducción y, con ella, el impuesto de cada ejercicio.

---

## Ej 4 — Préstamo del Banco Mar: utilidad devengada por año

### Datos

El 31/12/X la empresa recibe \$2.000.000 al 10% anual por dos años. Pagos: 2/1/X+2 → \$200.000 (intereses); 2/1/X+3 → \$2.200.000 (intereses + principal). Ambas partes cierran ejercicio anual (31/12).

### Planteo

Por el principio de lo devengado, el interés se imputa **al período en que corre**, no al del pago ([[conceptos/devengado-vs-percibido]]):
- El préstamo nace el **último día** del año X → en X no corre interés ($\approx 0$).
- Durante X+1 corre el primer año: $0{,}10 \times 2.000.000 = 200.000$ (se paga 2 días después de cerrar, el 2/1/X+2).
- Durante X+2 corre el segundo año: otros 200.000 (se pagan el 2/1/X+3, junto al principal).
- En X+3 no corre interés: los pagos de enero solo cancelan pasivos ya devengados.

### Cuentas

Al cierre de X+1 y X+2 la empresa registra **Intereses (R−) contra Intereses a pagar (provisión)**; el banco, **Intereses a cobrar contra Intereses ganados (R+)**. La devolución del principal es Disponibilidades contra Deuda bancaria / Crédito: **no toca resultados**.

### Resultado

| Año | Utilidad empresa | Utilidad Banco Mar |
|---|---|---|
| X | 0 | 0 |
| X+1 | **−200.000** | **+200.000** |
| X+2 | **−200.000** | **+200.000** |
| X+3 | **0** | **0** |

### Interpretación

Operación espejo: lo que uno devenga como gasto el otro lo devenga como ingreso, **en los mismos ejercicios**. El error clásico es cargar los \$200.000 a X+2 y X+3 (años del pago) o computar los \$2.200.000 como "gasto" — el principal nunca es resultado.

---

## Ej 5 — Reconstrucción de balance y cuadro a partir de ratios

### Datos

Sobreviven del accidente informático: Deudas comerciales 30, Deudas bancarias 25, TOTAL pasivo+PN 115, Gastos de comercialización y administración 10, Amortización 20. Ratios disponibles:

| Ratio | Valor |
|---|---|
| Cobertura de intereses | 8 |
| Liquidez corriente | 1,4 |
| Índice seco (prueba ácida) | 1 |
| Liquidez absoluta | 0,2 |
| Deuda LP / Capital | 0,5 |
| ROE | 40% |
| Índice de existencias | 72 días (año = 360) |
| Plazo promedio de crédito | 90 días |

### Planteo — orden de despeje

La clave es **arrancar por el único bloque completo (el pasivo corriente)** y encadenar: liquidez → composición del AC → totales del balance → estructura de financiamiento → ROE → ratios de actividad (dan el cuadro "desde abajo") → cuadro de arriba hacia abajo → cobertura (intereses) → IG como cierre. Cada número sale de un solo ratio:

1. **PC** $=$ Deudas comerciales + bancarias $= 30 + 25 = \mathbf{55}$.
2. **AC**: de liquidez corriente $\tfrac{AC}{PC} = 1{,}4 \Rightarrow AC = 1{,}4 \times 55 = \mathbf{77}$.
3. **Bienes de cambio**: de prueba ácida $\tfrac{AC - BC}{PC} = 1 \Rightarrow AC - BC = 55 \Rightarrow BC = \mathbf{22}$.
4. **Disponibilidades**: de liquidez absoluta $\tfrac{Disp}{PC} = 0{,}2 \Rightarrow Disp = \mathbf{11}$.
5. **Créditos por venta** (residuo del AC): $77 - 11 - 22 = \mathbf{44}$.
6. **Activo fijo neto** (residuo del total): $115 - 77 = \mathbf{38}$.
7. **Deuda LP y Capital**: $DLP + Capital = 115 - 55 = 60$ y $\tfrac{DLP}{Capital} = 0{,}5 \Rightarrow 1{,}5\,Capital = 60 \Rightarrow Capital = \mathbf{40},\ DLP = \mathbf{20}$.
8. **Utilidad neta**: $ROE = \tfrac{UN}{PN} = 0{,}4 \Rightarrow UN = 0{,}4 \times 40 = \mathbf{16}$ (acá el PN es la línea "Capital").
9. **CMV**: de existencias $\tfrac{BC \times 360}{CMV} = 72 \Rightarrow CMV = \tfrac{22 \times 360}{72} = \mathbf{110}$.
10. **Ventas**: de crédito $\tfrac{Créditos \times 360}{Ventas} = 90 \Rightarrow Ventas = \tfrac{44 \times 360}{90} = \mathbf{176}$.
11. **EBIT**: $176 - 110 - 10 - 20 = \mathbf{36}$ (y $EBITDA = 36 + 20 = 56$).
12. **Intereses**: de cobertura $= 8$. Con la definición **de la cátedra** (EBITDA/intereses): $Intereses = 56/8 = \mathbf{7}$. ⚠️ verificar en clase: con la definición clásica EBIT/intereses sería $36/8 = 4{,}5$ (y entonces IG $= 15{,}5$). Acá se sigue la definición del apunte.
13. **Utilidad antes de IG**: $36 - 7 = \mathbf{29}$.
14. **IG** (cierre por diferencia): $29 - 16 = \mathbf{13}$ (tasa implícita $\approx 45\%$ — sale como residuo, el enunciado no da la tasa). Ojo: ese $\approx 45\%$ es **atípico** (el IG societario argentino es 35%, como en el Ej.3); acá es un valor de laboratorio forzado por el resto de los ratios. Si en un parcial preguntan "¿es razonable la tasa de IG?", la respuesta honesta es *no, es residual*.

### Resultado

**Balance reconstruido:**

| Activo | \$ | Pasivo + PN | \$ |
|---|---|---|---|
| Disponibilidades | **11** | Deudas comerciales | 30 |
| Créditos por venta | **44** | Deudas bancarias | 25 |
| Bienes de cambio | **22** | **Total pasivo corriente** | **55** |
| **Total activo corriente** | **77** | Deuda a largo plazo | **20** |
| Activo fijo neto | **38** | Capital | **40** |
| **TOTAL** | **115** ✓ | **TOTAL** | 115 |

**Cuadro de resultados reconstruido:**

| | \$ |
|---|---|
| Ventas | **176** |
| − Costo de la mercadería vendida | **(110)** |
| − Gastos de comercialización y administración | (10) |
| − Amortización | (20) |
| **Utilidad operativa (EBIT)** | **36** |
| − Intereses | **(7)** ⚠️ |
| **Utilidad antes de IG** | **29** |
| − Impuesto a las ganancias | **(13)** |
| **Utilidad neta** | **16** |

**Verificación con [[conceptos/ecuacion-dupont]]:** $ROE = \tfrac{16}{176} \times \tfrac{176}{115} \times \tfrac{115}{40} = \tfrac{16}{40} = 40\%$ ✓.

### Interpretación

Cada familia de ratios "abre" una zona distinta del balance: la **liquidez** desarma el activo corriente, el **endeudamiento** reparte el lado derecho, la **actividad** conecta stocks del balance con flujos del cuadro (existencias→CMV, créditos→ventas) y la **rentabilidad** ata el cuadro al PN. El orden importa: ningún paso usa un dato aún no despejado. Ver [[conceptos/ratios-financieros]].

---

## Ej 6 — Capablanca & Alekhine: ¿quiebra por cobertura de intereses?

### Datos

Deuda \$500.000 al 10% anual → intereses \$50.000/año. Ventas \$2.000.000. Margen de utilidad (neta) sobre ventas 5%. Tasa de IG 30%. El banco exige **cobertura de intereses ≥ 5** para renovar el préstamo; si no, quiebra.

### Planteo

Reconstruir el EBIT "de abajo hacia arriba" desde el margen neto:

1. $UN = 5\% \times 2.000.000 = 100.000$.
2. Quitar el impuesto (grossing up): $UAI = \dfrac{UN}{1 - 0{,}30} = \dfrac{100.000}{0{,}7} = 142.857$.
3. Sumar los intereses: $EBIT = UAI + Intereses = 142.857 + 50.000 = 192.857$.

### Cuentas

| | \$ |
|---|---|
| **EBIT** | 192.857 |
| − Intereses | (50.000) |
| UAI | 142.857 |
| − IG (30%) | (42.857) |
| **Utilidad neta** | 100.000 ✓ |

### Resultado

$$Cobertura = \frac{EBIT}{Intereses} = \frac{192.857}{50.000} = 3{,}86 < 5$$

**No alcanza la cobertura exigida → el banco no renueva → la empresa quiebra.**

(Nota: el enunciado no da amortizaciones, así que la cobertura solo puede calcularse sobre EBIT; con la definición EBITDA de la cátedra el resultado sería aún mayor que 3,86 — pero faltaría el dato de amortizaciones para afirmarlo. Con la información disponible, la respuesta es 3,86 < 5.)

### Interpretación

Ilustra el ratio como **covenant**: el acreedor no mira la utilidad absoluta (\$100.000, positiva) sino cuántas veces el resultado cubre el servicio de la deuda. Una empresa **rentable** puede quebrar por estructura financiera. También muestra la mecánica de gross-up: del margen neto al EBIT hay que "desandar" impuesto e intereses en ese orden.

---

## Ej 7 — Capital de trabajo y financiamiento del crecimiento

### Datos

Balance (miles de \$): Caja 400, Créditos 1200, BC 900, BU 4500; Deuda bancaria 800, Deuda comercial 1100, Deuda no corriente 2200, PN 2900. (Activo $= 7000 =$ Pasivo + PN ✓.) Pronóstico: Ventas próximas $= 6.000$; Créditos $= 24\%$ de ventas; BC $= 18\%$; Compras $= 22\%$ de ventas, todas a crédito.

### Planteo y Cuentas

**a) Capital de trabajo:**

$$KT = AC - PC = (400 + 1200 + 900) - (800 + 1100) = 2500 - 1900 = \boxed{600}$$

**b) Financiamiento adicional por crecimiento de activos operativos:**

| Rubro | Hoy | Proyectado | Δ |
|---|---|---|---|
| Créditos | 1200 | $0{,}24 \times 6000 = 1440$ | **+240** |
| Bienes de cambio | 900 | $0{,}18 \times 6000 = 1080$ | **+180** |
| **Necesidad bruta** | | | **+420** |

**c) Deuda comercial espontánea:** como no compra nada al contado, el saldo de proveedores acompaña a las compras: $D_{com} = 0{,}22 \times 6000 = 1320 \Rightarrow \Delta D_{com} = 1320 - 1100 = \boxed{+220}$.

**d) Financiamiento neto:** $420 - 220 = \boxed{200}$ — sí, sigue necesitando fondos, pero menos de la mitad de la necesidad bruta.

**e) Fuente:** si se sospecha que el nivel de ventas **no se mantendrá**, la necesidad es **transitoria** → financiar a **corto plazo** (deuda bancaria CP). Regla de calce de plazos: necesidades permanentes con recursos permanentes (LP/PN); picos transitorios con CP, que se cancela cuando las ventas (y con ellas créditos y stock) vuelven a bajar. Financiarlo a LP dejaría fondos ociosos pagando interés después del pico.

### Resultado

a) $KT = 600$; b) necesita \$420; c) genera \$220 espontáneos; d) faltan **\$200**; e) **corto plazo**.

### Interpretación

El crecimiento de ventas **consume caja** antes de generarla: créditos y stock crecen proporcionalmente ([[conceptos/ciclo-de-caja]]). Parte se autofinancia con el **pasivo espontáneo** (proveedores) — el resto es decisión financiera. Es el análisis NOF/fondo de maniobra de [[conceptos/capital-de-trabajo]] en versión numérica.

---

## Conceptos que ejercita la guía

- [[conceptos/balance-patrimonial]] y [[conceptos/partida-doble]] — Ej 1, 2, 5
- [[conceptos/cuadro-de-resultados]] y [[conceptos/ebit-ebitda]] — Ej 1, 5, 6
- [[conceptos/devengado-vs-percibido]] — Ej 1, 3, 4 (el corazón de la guía)
- [[conceptos/amortizacion-contable]] — Ej 1, 2, 3
- [[conceptos/escudo-fiscal]] — Ej 3
- [[conceptos/ratios-financieros]] y [[conceptos/ecuacion-dupont]] — Ej 5, 6
- [[conceptos/capital-de-trabajo]] y [[conceptos/ciclo-de-caja]] — Ej 7
- [[conceptos/bienes-de-cambio-vs-bienes-de-uso]] — Ej 1, 2

## Errores frecuentes detectados al resolver

1. **Cargar a resultados el pago de deudas viejas** (Ej 1, mov. 3 y 6): pagar proveedores o sueldos de febrero cancela pasivo; el gasto ya se devengó en su mes.
2. **Meter la venta de bonos dentro de "Ventas"** (Ej 1): es resultado de inversiones (+100), abajo de la utilidad operativa; mezclarlo distorsiona el análisis del negocio.
3. **Calcular el resultado de venta de bienes de uso contra el V.O.** (Ej 2): es contra el **valor de libros**; y amortizar terrenos es error automático.
4. **Imputar intereses al año del pago** (Ej 4): se devengan mientras el préstamo corre; los pagos del 2 de enero pertenecen económicamente al año anterior.
5. **Creer que la deducción acelerada "regala" todo el impuesto** (Ej 3): los años 1–10 se paga **más** IG que sin beneficio; lo que se gana es el adelantamiento (+ la deducción del V.R.).
6. **Desordenar el despeje en la reconstrucción por ratios** (Ej 5): sin arrancar por el pasivo corriente (único bloque completo) los demás ratios no se pueden aplicar.
7. **Usar la base equivocada en los días** (Ej 5): existencias contra CMV, créditos contra ventas. Invertirlas da CMV = 88 y Ventas = 220 — y nada cierra después.
8. **Cobertura de intereses: EBIT vs EBITDA** (Ej 5 y 6): la cátedra la define con EBITDA; otros textos con EBIT. Mirar el enunciado y declarar el criterio.
9. **Olvidar el gross-up del impuesto** (Ej 6): del margen neto al EBIT se divide por $(1-t)$ **antes** de sumar intereses; hacerlo al revés cambia el resultado.
10. **Ignorar el pasivo espontáneo** (Ej 7): pedir financiamiento por los \$420 brutos sobreestima la necesidad — los proveedores ya aportan \$220.

## Ver también

- [[formulas/unidad-06]]
- [[unidades/unidad-06-informacion-contable]]
- [[ejercicios/gp2-produccion-costos]] — costos desde la mirada microeconómica (U2)
