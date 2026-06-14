---
unit: 06
title: Fórmulas — Unidad 6 (Información Contable y Análisis de Costos)
---

## Ecuación contable fundamental

$$\boxed{A = P + PN} \qquad PN = A - P$$

**Donde:**
- $A$: activo (recursos de la empresa)
- $P$: pasivo (obligaciones hacia terceros)
- $PN$: patrimonio neto (aportes + resultados acumulados)

**Uso:** base del [[conceptos/balance-patrimonial]] y de la [[conceptos/partida-doble]]. Todo movimiento la preserva: en cada operación, débitos = créditos; en todo momento, saldos deudores = saldos acreedores.

En diferencias (base del EOAF):

$$\Delta A = \Delta P + \Delta PN \qquad \Rightarrow \qquad \Delta C = \Delta P + \Delta PN - \Delta A_{\neq C}$$

**Donde:**
- $\Delta C$: variación de caja del período
- $\Delta A_{\neq C}$: variación de activos distintos de caja
- Aumentos de $P$ y $PN$ y bajas de activos = **orígenes**; aumentos de activos y bajas de $P$/$PN$ = **aplicaciones**

## Amortización lineal y valor de libros

$$Am = \frac{V.O. - V.R.}{V.U.} \qquad V.L. = V.O. - A.A.$$

**Donde:**
- $Am$: amortización del ejercicio [\$/período]
- $V.O.$: valor de origen (compra + gastos de puesta en marcha)
- $V.R.$: valor residual contable
- $V.U.$: vida útil contable [períodos]
- $V.L.$: valor de libros (valor contable neto)
- $A.A.$: amortizaciones acumuladas

**Uso:** la base amortizable excluye el $V.R.$; **terrenos no se amortizan**. Resultado por venta de un bien de uso $= Precio - V.L.$ Ver [[conceptos/amortizacion-contable]].

## Estado de resultados — esquema financiero

$$EBITDA = Ventas - Costos\ erogables$$
$$EBIT = EBITDA - Amortizaciones$$
$$EBT = EBIT - Intereses$$
$$EAT = EBT - IG$$

**Donde:**
- $EBITDA$: utilidad antes de intereses, impuestos y amortizaciones
- $EBIT$: utilidad operativa
- $EBT$: utilidad antes de impuestos
- $EAT$: utilidad neta
- $IG$: impuesto a las ganancias

**Uso:** cascada del [[conceptos/cuadro-de-resultados]]; al armar flujos (U8), las amortizaciones se suman de vuelta después del impuesto. Ver [[conceptos/ebit-ebitda]].

## Capital de trabajo, fondo de maniobra y NOF

$$KT = AC - PC$$

**Donde:**
- $KT$: capital de trabajo (fondo de maniobra)
- $AC$: activo corriente
- $PC$: pasivo corriente

$$FM = Recursos\ permanentes - Activos\ inmovilizados$$

**Donde:**
- $FM$: fondo de maniobra (misma magnitud que $KT$, visto desde el financiamiento)
- $Recursos\ permanentes$: $PN$ + deuda de largo plazo
- $Activos\ inmovilizados$: bienes de uso + intangibles

$$NOF = Activos\ operativos - Pasivos\ espontáneos$$
$$Superávit\ (déficit)\ financiero = FM - NOF = Activos\ líquidos - Pasivos\ líquidos$$

**Donde:**
- $NOF$: necesidades operativas de fondos
- $Activos\ operativos$: créditos por ventas + bienes de cambio (+ caja mínima operativa)
- $Pasivos\ espontáneos$: proveedores / cuentas a pagar del giro
- $Activos/Pasivos\ líquidos$: caja e inversiones CP / deuda financiera CP ("cuentas de colchón")

**Uso:** diagnóstico de liquidez estructural ([[conceptos/capital-de-trabajo]]). Si $FM < NOF$ hay déficit que se cubre con deuda financiera CP negociada.

## Ciclo operativo y ciclo de caja

$$Ciclo\ operativo = Período\ de\ inventario + Período\ de\ cobranza$$
$$Ciclo\ de\ caja = Ciclo\ operativo - Período\ de\ pago$$

**Uso:** días de giro a financiar ([[conceptos/ciclo-de-caja]]). Los períodos salen de los ratios de actividad (abajo).

## Ratios financieros

### Liquidez

$$Liquidez\ corriente = \frac{AC}{PC}$$

$$Prueba\ ácida\ (índice\ seco) = \frac{AC - BC}{PC}$$

$$Liquidez\ absoluta = \frac{Disponibilidades}{PC}$$

**Donde:**
- $BC$: bienes de cambio (lo menos líquido del activo corriente)
- $Disponibilidades$: caja y bancos

**Uso:** capacidad de pago de CP con grados crecientes de exigencia. Referencias usuales: corriente > 1 (equivale a $KT > 0$), ácida ≈ 1.

### Actividad

$$PPC = \frac{Créditos\ por\ ventas \times días\ del\ año}{Ventas\ anuales\ a\ crédito}$$

$$PPP = \frac{Deudas\ comerciales \times días\ del\ año}{Compras}$$

$$Días\ de\ existencias = \frac{BC \times días\ del\ año}{CMV}$$

$$Rotación\ de\ activos = \frac{Ventas}{Activo}$$

**Donde:**
- $PPC$: período promedio de cobranza [días]
- $PPP$: período promedio de pago [días]
- $CMV$: costo de la mercadería vendida
- $días\ del\ año$: 360 (convención de la guía) o 365

**Uso:** velocidades del giro. ⚠️ Bases: cobranza sobre **ventas**, pago sobre **compras**, existencias sobre **CMV** — mezclarlas es el error clásico.

### Endeudamiento

$$Endeudamiento\ total = \frac{Deuda\ total}{Activo}$$

$$Relación\ deuda\ LP\ a\ capital = \frac{Deuda\ LP}{Capital}$$

$$Cobertura\ de\ intereses = \frac{EBITDA}{Pagos\ anuales\ de\ intereses}$$

**Uso:** estructura de financiamiento y margen de seguridad para los acreedores. ⚠️ La cátedra define la cobertura con **EBITDA** ("utilidades antes de int., imp. y amort."); otros textos usan EBIT. En GP5 Ej. 6 el banco exige cobertura ≥ 5 para renovar.

### Rentabilidad

$$Margen\ neto = \frac{Utilidad\ neta}{Ventas}$$

$$ROE = \frac{Utilidad\ neta - Dividendos\ preferidos}{PN}$$

$$Rentabilidad\ operativa = \frac{EBIT}{Activo}$$

**Donde:**
- $ROE$: rentabilidad sobre el patrimonio neto
- $Dividendos\ preferidos$: se restan para medir lo que queda al accionista ordinario

**Uso:** eficiencia económica (margen), rinde del negocio sin mezcla financiera (operativa) y rinde del accionista (ROE). Ver [[conceptos/ratios-financieros]].

### Rendimiento total para el accionista

$$R = \frac{(PPA_f - PPA_p) + Dividendos}{PPA_p}$$

**Donde:**
- $PPA_p$, $PPA_f$: precio por acción al principio y al final del período

**Uso:** rendimiento de mercado (ganancia de capital + dividendos). Ejemplo de clase: $(187 - 200 + 10)/200 = -1{,}5\%$.

## Ecuación de DuPont

$$\boxed{ROE = \frac{U.neta}{Ventas} \times \frac{Ventas}{Activos} \times \frac{Activos}{PN}}$$

**Uso:** descompone el ROE en eficiencia económica (margen) × eficiencia operativa (rotación) × apalancamiento financiero. Los dos primeros factores = rentabilidad sobre activos. Sirve para verificar reconstrucciones (GP5 Ej. 5: $\tfrac{16}{176} \times \tfrac{176}{115} \times \tfrac{115}{40} = 40\%$ ✓). Ver [[conceptos/ecuacion-dupont]].

## Flujo de caja por actividades (EOAF)

$$FF_{operación} = Utilidades + Amortizaciones - \Delta Créditos - \Delta BC + \Delta D_{com}$$
$$FF_{inversión} = -Inversiones + Venta\ de\ bienes\ de\ uso$$
$$FF_{financiación} = \Delta D_{fin} - Intereses + Aportes - Dividendos$$
$$\Delta C = FF_{operación} + FF_{inversión} + FF_{financiación}$$

**Donde:**
- $\Delta D_{com}$: variación de deudas comerciales (financiamiento espontáneo)
- $\Delta D_{fin}$: variación de deuda financiera
- $\Delta BU = Inversiones - Amortizaciones$ (variación de bienes de uso)

Versión "de proyecto" (intereses y su escudo reclasificados a financiación):

$$FCFF = EBIT(1-t) + Amortizaciones - \Delta KT_{operativo} - Inversiones$$
$$FCFE = FCFF + \Delta D_{fin} - Intereses(1 - t) + Aportes - Dividendos$$

**Donde:**
- $t$: tasa de impuesto a las ganancias
- $FCFF$: free cash flow to the firm (flujo "del activo")
- $FCFE$: free cash flow to equity (flujo "hacia el accionista")
- $Intereses(1-t)$: interés neto de su escudo fiscal

**Uso:** conciliar resultado con caja ([[conceptos/estado-origen-aplicacion-fondos]]) y plantilla del [[conceptos/flujo-de-fondos-proyecto]] (U8).

## Costo de fabricación

$$Costo\ de\ fabricación = MP + MOD + GGF$$

**Donde:**
- $MP$: materias primas / materiales directos
- $MOD$: mano de obra directa
- $GGF$: gastos generales de fabricación (indirectos)

**Uso:** los tres integran el **costo del producto** (se activan en inventario hasta la venta); administración y comercialización son **costos del período**. Ver [[conceptos/costos-directos-indirectos]] y [[conceptos/costos-producto-vs-periodo]].

## Costeo por absorción vs directo

$$Costo\ por\ absorción = MP + MOD + GGF_{var} + GGF_{fijos}$$
$$Costo\ directo = MP + MOD + GGF_{var}$$

**Uso:** qué viaja con el producto al inventario en cada sistema; en ninguno entran gastos de adm./com./finanzas. Ver [[conceptos/sistemas-de-costeo]].

## Contribución marginal y punto de equilibrio

$$cm = p - cv \qquad razón\ de\ contribución = \frac{p - cv}{p}$$

$$\boxed{q^* = \frac{CF}{p - cv}} \qquad V^* = \frac{CF}{(p-cv)/p}$$

**Donde:**
- $cm$: contribución marginal unitaria
- $p$: precio unitario
- $cv$: costo variable unitario
- $CF$: costos fijos totales
- $q^*$: cantidad de equilibrio ($IT = CT$, beneficio nulo)
- $V^*$: ventas de equilibrio en pesos

**Uso:** $q^*$ separa zona de pérdida y de ganancia; el resultado a cualquier volumen es $\pi = (p-cv)q - CF$. Con fijos propios y asignados aparece el **pseudo-equilibrio** ($Q$ que cubre solo $F_{propios}$): entre pseudo-equilibrio y equilibrio el producto contribuye a los fijos comunes aunque "dé pérdida" contable. Ver [[conceptos/punto-de-equilibrio]] y [[conceptos/contribucion-marginal]].

## Optimización del costo de diseño

Modelo típico de costo respecto de una variable de diseño $x$:

$$C(x) = a\,x + \frac{b}{x} + k \qquad \Rightarrow \qquad \frac{dC}{dx} = a - \frac{b}{x^2} = 0 \;\Rightarrow\; x^* = \sqrt{\frac{b}{a}}$$

**Donde:**
- $x$: variable de diseño guía del costo
- $a$: coeficiente del costo creciente con $x$
- $b$: coeficiente del costo decreciente con $x$
- $k$: costos independientes de $x$

**Uso:** procedimiento de la cátedra: (1) identificar la variable de diseño, (2) escribir $C(x)$, (3) derivar e igualar a cero, (4) verificar mínimo con $C''(x^*) > 0$. Ejemplo (avión): $CT = 0{,}04\,n\,v^{3/2} + 300.000\,n/v \Rightarrow v^* = 490{,}68$ mph. Recordar: el costo de un cambio de diseño **crece escalonadamente** con la etapa del ciclo de vida (diseñar temprano es barato).

## Variables

- $A, P, PN$: activo, pasivo, patrimonio neto
- $AC, PC$: activo y pasivo corrientes; $BC$: bienes de cambio
- $V.O., V.R., V.U., V.L., A.A.$: valor de origen, residual, vida útil, valor de libros, amortizaciones acumuladas
- $KT, FM, NOF$: capital de trabajo, fondo de maniobra, necesidades operativas de fondos
- $CMV$: costo de mercadería vendida; $PPC, PPP$: períodos de cobranza y pago
- $EBITDA, EBIT, EBT, EAT$: hitos del esquema financiero; $IG$/$t$: impuesto a las ganancias / su tasa
- $MP, MOD, GGF$: materia prima, mano de obra directa, gastos generales de fabricación
- $p, cv, cm, CF, q^*$: precio, costo variable unitario, contribución, fijos, equilibrio
