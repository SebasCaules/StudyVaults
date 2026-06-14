---
unit: 05
title: Fórmulas — Unidad 5 (Macroeconomía)
---

## PBI — Métodos de cálculo

**Método del gasto (el más usado):**
$$PBI = C + I + G + (X - M)$$

- $C$: consumo privado
- $I$: inversión (FBKF + variación de existencias)
- $G$: gasto público (consumo del gobierno)
- $X - M$: exportaciones netas

**Método del ingreso:**
$$PBI = R + CKF + I_{pm} + EE$$

Donde:
- $R$: remuneraciones al trabajo (salarios)
- $CKF$: consumo de capital fijo (depreciación)
- $I_{pm}$: impuestos netos a la producción y a las importaciones
- $EE$: excedente de explotación (renta del capital)

(Remuneraciones + consumo de capital fijo + impuestos netos + excedente de explotación)

**Método del valor agregado:**
$$PBI = \sum VAB + DM + I_p$$

Donde:
- $VAB$: valor agregado bruto de cada sector productivo
- $DM$: derechos de importación
- $I_p$: impuestos netos a los productos

(Valor agregado bruto de cada sector + derechos de importación + impuestos)

## Identidad fundamental del SCN

$$C + S + T \equiv Y \equiv C + I + G + (X - M)$$

De donde se deriva el **modelo de 3 brechas**:
$$(S - I) + (T - G) + (M - X) \equiv 0$$

(Ahorro-inversión privada + resultado fiscal + resultado externo = 0)

## PBI Real vs Nominal — Deflactor

$$PBI_{nominal} = \sum P_t \cdot Q_t \quad \text{(precios corrientes)}$$
$$PBI_{real} = \sum P_{base} \cdot Q_t \quad \text{(precios de año base)}$$

Donde:
- $P_t$: precio del bien en el período $t$ (corriente)
- $P_{base}$: precio del bien en el año base
- $Q_t$: cantidad producida del bien en el período $t$

$$\boxed{\text{Deflactor} = \frac{PBI_{nominal}}{PBI_{real}} \times 100}$$

## Inflación

**Tasa de inflación mensual:**
$$\pi_t = \frac{IPC_t - IPC_{t-1}}{IPC_{t-1}} \times 100$$

Donde:
- $\pi_t$: tasa de inflación del período $t$ (en %)
- $IPC_t$: índice de precios al consumidor del período $t$
- $IPC_{t-1}$: IPC del período anterior

**Tasa de inflación anual:** análogamente con IPC de fin de año.

## Mercado de trabajo

$$\text{Tasa de actividad} = \frac{PEA}{Población}$$

$$\text{Tasa de desocupación} = \frac{Desocupados}{PEA}$$

$$\text{Tasa de demandantes de empleo} = \frac{D + OSub}{PEA}$$

Donde:
- $PEA$: Población Económicamente Activa (Ocupados + Desocupados)
- $PEI$: Población Económicamente Inactiva (Población - PEA)
- $D$: cantidad de desocupados (buscan trabajo activamente)
- $OSub$: subocupados (trabajan <35 hs involuntariamente)
- **Ocupados plenos** (35–45 hs), **Subocupados** (<35 hs involuntarias), **Sobreocupados** (>45 hs)
- **Tasa natural** = friccional + estructural (independiente del ciclo)
- **Tasa observada** = natural + cíclico

## Pobreza, indigencia y distribución

**Pobreza por ingreso:**
- **Indigencia:** ingreso < Canasta Básica Alimentaria (CBA)
- **Pobreza:** ingreso < Canasta Básica Total (CBT) = CBA + bienes no alimentarios
- $CBT = CBA \cdot \text{Coeficiente de Engel}^{-1}$

**Coeficiente de Gini** (desigualdad de ingresos):
$$G = \frac{A}{A + B}$$

Donde $A$ es el área entre la curva de Lorenz y la diagonal de igualdad, y $B$ el área debajo de la curva de Lorenz.

- $G = 0$ → igualdad perfecta
- $G = 1$ → desigualdad máxima
- Argentina ≈ 0,427; Brasil ≈ 0,513; Finlandia ≈ 0,268; Zambia ≈ 0,575

**Brecha de ingresos (decil 10 / decil 1):** ratio de ingreso medio entre el 10% más rico y el 10% más pobre.

## Ley de Okun

$$\Delta u \approx -\beta \cdot \left(\frac{Y - Y^*}{Y^*}\right)$$

Donde:
- $\Delta u$: variación de la tasa de desempleo (en p.p.)
- $Y - Y^*$: brecha del producto sobre el potencial
- $\beta \approx 0{,}5$: coeficiente empírico (varía por país)

Caída del 1% del PBI sobre el potencial → ↑ desempleo de ~0,5 p.p.

## Multiplicador keynesiano

$$k_G = \frac{1}{1 - PMC} = \frac{1}{PMS}$$

- **PMC**: propensión marginal a consumir, $PMC = \Delta C / \Delta Y_d$
- **PMS**: propensión marginal a ahorrar ($PMC + PMS = 1$)

Variación del producto ante cambio de gasto autónomo:
$$\Delta Y = k_G \cdot \Delta G$$

**Multiplicador de las transferencias / impuestos de suma fija:**
$$k_{TR} = \frac{PMC}{1 - PMC} \quad \text{(positivo para transferencias)}$$
$$k_T = -\frac{PMC}{1 - PMC} \quad \text{(negativo: subir T contrae Y)}$$

Es **menor en módulo** que $k_G$: el primer peso de transferencia/impuesto pasa por el filtro del consumo (solo $PMC$ se gasta), mientras que el primer peso de gasto público es directamente demanda.

**Ejemplo (clase):** $PMC = 0{,}5$, $\Delta G = \$50\text{MM}$ → $\Delta Y = \$100\text{MM}$ ($k_G=2$). Misma transferencia $\Delta TR = \$50\text{MM}$ → $\Delta Y = \$50\text{MM}$ ($k_{TR}=1$).

**Multiplicador balanced-budget (presupuesto equilibrado):** si $\Delta G = \Delta T$, entonces $\Delta Y = \Delta G$ exactamente (multiplicador = 1).

## Resultado fiscal y deuda

**Resultado fiscal primario:**
$$RF_p = T - G - TR$$

Donde $TR$ son transferencias. Si $RF_p > 0$ → superávit primario; $<0$ → déficit primario.

**Resultado fiscal financiero (con intereses):**
$$RF_f = RF_p - i \cdot D$$

Donde $i \cdot D$ son los intereses de la deuda pública.

**Sostenibilidad de la deuda pública** (en % del PBI):
$$d^* = -(r - \gamma) \cdot b$$

Donde:
- $d^*$: déficit primario sostenible (como % del PBI)
- $r$: tasa de interés real de la deuda
- $\gamma$: tasa de crecimiento real del PBI
- $b$: ratio Deuda / PBI

**Interpretación:**
- Si $r > \gamma$ → hace falta **superávit primario** ($d^* < 0$) para mantener $b$ constante.
- Si $r < \gamma$ → la economía "crece más rápido que la deuda" y se puede sostener cierto déficit.
- Ejemplo: $r=6\%$, $\gamma=5\%$, $b=0{,}6$ → $d^*=-0{,}6\%$ (necesita 0,6% del PBI de superávit primario).

## Ecuación cuantitativa del dinero

$$MV = PY$$

- $M$: oferta monetaria
- $V$: velocidad de circulación
- $P$: nivel general de precios
- $Y$: producto real

Si $V$ es estable y $Y$ crece a tasa constante, un crecimiento excesivo de $M$ se traduce en inflación.

## Agregados monetarios

- **M0 (base monetaria):** billetes + reservas en BCRA
- **M1:** circulante + cuentas corrientes
- **M2:** M1 + cajas de ahorro
- **M3:** M2 + depósitos a plazo

## Tasa de interés — simple vs compuesto

**Interés simple (TNA):** sin reinversión.  
**Interés compuesto (TEA):** capitaliza periódicamente. Para $n$ períodos:

$$VF = VP \cdot (1 + i)^n$$

Donde:
- $VF$: valor futuro (al final del período)
- $VP$: valor presente (capital inicial)
- $i$: tasa de interés por período
- $n$: cantidad de períodos de capitalización

A 50 años, 1,5% anual lleva 100 → 210; 2% lo lleva → 269 (28% más rico).

**Tasas equivalentes (capitalización subperíodo $m$):**
$$1 + TEA = \left(1 + \frac{TNA}{m}\right)^m = (1 + TEM)^{12}$$

Donde:
- $TNA$: tasa nominal anual (con $m$ capitalizaciones)
- $TEA$: tasa efectiva anual
- $TEM$: tasa efectiva mensual

**Ejemplo:** TNA 16% capitalización trimestral → $TEA = (1+0{,}04)^4 - 1 = 16{,}99\%$, $TEM = (1{,}1699)^{1/12} - 1 \approx 1{,}32\%$.

## Anualidades y perpetuidades (apunte)

**Valor actual de una anualidad** (flujo constante $C$ durante $n$ períodos a tasa $i$):
$$VA = C \cdot \frac{1 - (1+i)^{-n}}{i}$$

**Valor futuro de una anualidad:**
$$VF = C \cdot \frac{(1+i)^n - 1}{i}$$

**Perpetuidad constante:**
$$VA = \frac{C}{i}$$

**Perpetuidad creciente (Gordon):**
$$VA = \frac{C_1}{i - g} \quad (i > g)$$

## Tasa de interés real

**Fórmula exacta** (Argentina, tasas altas):
$$1 + r = \frac{1+i}{1+\pi} \quad \Rightarrow \quad r = \frac{1+i}{1+\pi} - 1$$

Donde:
- $r$: tasa de interés real (en términos de poder adquisitivo)
- $i$: tasa de interés nominal del período
- $\pi$: tasa de inflación del período

**Aproximación de Taylor** (solo para tasas chicas, NO Argentina):
$$r \approx i - \pi$$

**Paridad de Fisher (ex-ante):** $1 + r_t = (1+i_t) / (1+\pi^e_{t+1})$

## Valuación de bonos (renta fija)

$$P^B = \sum_{t=1}^{N} \frac{CF_t}{(1+i)^t} = \frac{CF_1}{1+i} + \frac{CF_2}{(1+i)^2} + \cdots + \frac{CF_N}{(1+i)^N}$$

Donde:
- $P^B$: precio del bono (valor presente de los flujos)
- $CF_t$: cashflow contractual del período $t$ (cupón + amortización)
- $i$: tasa de descuento (costo de oportunidad)
- $N$: cantidad de períodos hasta el vencimiento

**TIR**: la tasa que iguala $P^B$ al valor presente. Relación con cupón:
- $P = $ par → TIR = cupón
- $P < $ par → TIR > cupón (cotiza bajo la par)
- $P > $ par → TIR < cupón (cotiza sobre la par)

**Estructura de riesgo:** $\text{TIR} = r_{libre} + \text{prima de riesgo}$

## Valuación de acciones (perpetuidad)

$$P^A = \frac{D}{i}$$

Donde:
- $P^A$: precio de la acción (perpetuidad constante)
- $D$: dividendo proyectado constante
- $i$: tasa de descuento ajustada por riesgo

Para una perpetuidad creciente (Gordon): $P^A = D/(i - g)$, donde $g$ es la tasa de crecimiento constante de los dividendos (con $i > g$).

## Identidades monetarias

| Variable | Definición |
|---|---|
| $M = E + D$ | Oferta monetaria = efectivo + depósitos |
| $BM = E + R$ | Base monetaria = efectivo + reservas |
| $e = E/D$ | Preferencia del público por efectivo |
| $r = R/D$ | Coeficiente de encajes (reservas/depósitos) |
| $m = M/BM$ | Multiplicador del dinero |

## Multiplicador del dinero

$$\boxed{m = \frac{e+1}{e+r}}$$

$$M = m \cdot BM, \quad R = r \cdot D, \quad \text{Préstamos} = D - R$$

**Comparativa estática:**
- ↑ $r$ (más encajes) → ↓ $m$
- ↑ $e$ (público guarda más cash) → ↓ $m$

## Mercado de dinero

- **Oferta** $MS$: vertical en el nivel elegido por el BC.
- **Demanda** $MD$: $MD = L(Y, r)$, decreciente en $r$, creciente en $Y$ y $P$.

  Donde:
  - $MD$: demanda nominal de saldos líquidos
  - $L(\cdot)$: función de preferencia por liquidez
  - $Y$: PBI real (transacciones)
  - $r$: tasa de interés (costo de oportunidad)

- **Equilibrio:** $MS = MD$ determina $r_E$ (tasa nominal de equilibrio).

Política monetaria expansiva: BC compra bonos (OMA) → ↑ $MS$ → ↓ $r$.

## Sector externo

**Balanza comercial:**
$$BC = X - M$$

**Tipo de cambio nominal ($e$):** unidades de moneda local por unidad de moneda extranjera (ej. ARS/USD). $e \uparrow$ = depreciación / devaluación de la moneda local.

**Tipo de cambio real (TCR):**
$$TCR = \frac{e \cdot P^*}{P}$$

Donde:
- $e$: tipo de cambio nominal
- $P^*$: nivel de precios externo
- $P$: nivel de precios local

- TCR ↑ → depreciación real → exportaciones más competitivas (↑X, ↓M)
- TCR ↓ → apreciación real → "atraso cambiario"

**Cuenta corriente (BP):**
$$CC = (X - M) + RNF + TC$$

Donde:
- $RNF$: rentas netas del exterior (intereses, utilidades, dividendos cobrados/pagados)
- $TC$: transferencias corrientes (remesas, donaciones)

## Variables
- $Y$: producto / ingreso nacional
- $C, I, G$: consumo, inversión, gasto público
- $T$: impuestos; $TR$: transferencias
- $X, M$: exportaciones, importaciones
- $S$: ahorro; $b$: deuda/PBI
- $PBI$: producto bruto interno
- $i$: tasa nominal, $r$: tasa real, $\pi$: inflación, $\gamma$: crecimiento PBI real
- $E$: efectivo, $D$: depósitos, $R$: reservas
- $m$: multiplicador, $e$: preferencia efectivo, $r$ (en monetario): coeficiente encajes
- $e$ (en sector externo): tipo de cambio nominal; $TCR$: real
