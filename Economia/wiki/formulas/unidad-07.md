---
unit: 07
title: Fórmulas — Unidad 7 (Cálculo Financiero / Valor Tiempo del Dinero)
---

> Referencia completa y autocontenida de cálculo financiero. Las versiones breves de tasas equivalentes, anualidades y perpetuidades que aparecen en [[formulas/unidad-05]] están acá con más detalle. Todo el módulo de [[conceptos/van|VAN]] (Unidad 8) descuenta flujos con estas fórmulas.

## Elementos y notación

| Símbolo | Significado |
|---|---|
| $P$ (o $C$, $VP$) | Valor presente / capital inicial |
| $F$ (o $M$, $VF$) | Valor futuro / monto final |
| $I$ | Intereses (en \$) |
| $i$ | Tasa de interés del período |
| $n$ | Cantidad de períodos |
| $k$ | Frecuencia de capitalización (veces por año) |
| $d$ | Tasa de descuento comercial |
| $g$ | Tasa de crecimiento de un flujo |

**Período de capitalización:** intervalo al final del cual se ganan (y se suman) los intereses. Ejemplo: "21% anual convertible cuatrimestralmente" → $k = 12/4 = 3$.

## Interés simple

Solo el capital inicial genera intereses (los intereses se retiran, no se reinvierten):

$$I = C \cdot i \cdot n \qquad\qquad \boxed{M = C\,(1 + i \cdot n)}$$

**Donde:**
- $C$: capital invertido
- $M$: monto final (capital + intereses)
- $i$: tasa del período
- $n$: cantidad de períodos

**Uso:** crece lineal. Es el régimen implícito de la **TNA** y de créditos "de interés directo". En la práctica financiera casi todo capitaliza → usar compuesto salvo que el enunciado diga "interés simple".

## Interés compuesto

Los intereses se capitalizan (se añaden al capital al final de cada período de composición): "los intereses devengan intereses".

$$\boxed{F = P\,(1+i)^n}$$

**Los cuatro despejes** (toda la unidad es elegir cuál usar):

| Incógnita | Fórmula | Excel |
|---|---|---|
| Valor futuro | $F = P(1+i)^n$ | `VF` / `FV` |
| Valor presente | $P = \dfrac{F}{(1+i)^n}$ | `VA` / `PV` |
| Tasa | $i = \left(\dfrac{F}{P}\right)^{1/n} - 1$ | `TASA` / `RATE` |
| Plazo | $n = \dfrac{\ln(F/P)}{\ln(1+i)}$ | `NPER` |

**Uso:** capitalizar = llevar al futuro; actualizar/descontar = traer al presente. Ver [[capitalizacion-actualizacion]]. **Regla de oro: nunca sumar ni comparar montos de momentos distintos sin antes llevarlos al mismo momento.**

**Equivalencia de capitales:** con $i=10\%$, $1.000$ hoy $\equiv 1.100$ en $t=1$ $\equiv 1.210$ en $t=2$. La equivalencia del compuesto es perfecta (transitiva entre cualquier par de fechas); la del simple no.

## Sistema de tasas: nominal, proporcional, efectiva

| Tasa | Definición | Fórmula |
|---|---|---|
| **Nominal** ($i$, TNA) | la que se *declara* en la operación | dato contractual |
| **Proporcional o del período** ($i_p$) | tasa efectiva del subperíodo de capitalización | $i_p = \dfrac{i}{k}$ |
| **Efectiva anual** ($i_e$, TEA) | ganancia real anual con capitalización | $i_e = \left(1+\dfrac{i}{k}\right)^k - 1$ |

**Donde:**
- $i_p$: tasa proporcional (efectiva del subperíodo)
- $i_e$: tasa efectiva anual
- $k$: capitalizaciones por año

### Tasas equivalentes

Dos tasas son **equivalentes** si, aplicadas a capitales iguales durante el mismo plazo, producen el mismo capital final:

$$\boxed{\left(1+\frac{i}{k}\right)^k - 1 = \left(1+\frac{j}{p}\right)^p - 1}$$

**Donde:**
- $j$: otra tasa nominal anual
- $p$: su frecuencia de capitalización

**Casos de uso frecuentes:**

$$1 + TEA = (1+TEM)^{12} \qquad TEM = (1+TEA)^{1/12}-1$$

**TNA con capitalización diaria → TEM (formato parcial, año de 360 días, mes de 30):**

$$TEM = \left(1+\frac{TNA}{360}\right)^{30} - 1$$

Ejemplo (Parcial 11-Nov-2025): $TNA = 35\%$ cap. diaria → $TEM = (1+0{,}35/360)^{30}-1 = 2{,}958\% \approx 2{,}96\%$.

**Tasa efectiva para $t$ días a partir de una tasa efectiva de $d$ días:**

$$i_t = (1+i_d)^{t/d} - 1$$

Ejemplo (guía, ej. 8a): $2\%$ para 30 días → para 80 días: $(1{,}02)^{80/30}-1 = 5{,}42\%$.

**A mayor frecuencia de capitalización, mayor TEA para la misma TNA.** TNA 36% según capitalización: anual 36% | semestral 39,24% | trimestral 41,16% | mensual 42,58% | diaria 43,31% | continua 43,33%.

## Capitalización continua

Límite cuando $k \to \infty$:

$$F = P \cdot e^{r \cdot n}$$

**Donde:**
- $e$: base de logaritmos naturales ($\approx 2{,}7183$)
- $r$: tasa nominal anual

Ejemplo (slides): $P=100$, $r=8\%$, $n=2$ → $F = 100 \cdot e^{0{,}16} = 117{,}35$. TEA equivalente: $e^r - 1$.

## Componentes de la tasa de interés

La tasa nominal "empaqueta" multiplicativamente inflación, tasa real y riesgo:

$$\boxed{i = (1+i_f)(1+i_r)(1+i_\theta) - 1}$$

**Donde:**
- $i_f$: componente inflación (esperada; en Arg. se mide con CER/IPIM)
- $i_r$: componente real (≈3–4% a nivel mundial)
- $i_\theta$: componente riesgo (riesgo país = spread vs bono USA; riesgo sector)

Caso particular (sin riesgo) = paridad de Fisher de [[tasa-interes-real]]: $1+r = \dfrac{1+i}{1+\pi}$. **Usar siempre la forma exacta (multiplicativa), nunca la suma $i \approx r + \pi$, con tasas argentinas.**

**Tasas bancarias:** activa $i_a$ (la que el banco cobra por prestar), pasiva $i_p$ (la que paga por depósitos), $\text{spread} = i_a - i_p$ (rentabilidad bruta de la intermediación).

## Anualidades

Flujo **constante** $C$ por período durante $n$ períodos a tasa $i$. Ver [[anualidades]].

### Vencida (ordinaria — pagos al FINAL de cada período; el caso por defecto)

$$\boxed{VA = C \cdot \frac{1-(1+i)^{-n}}{i} = C \cdot \frac{(1+i)^n - 1}{(1+i)^n \cdot i}}$$

$$\boxed{VF = C \cdot \frac{(1+i)^n - 1}{i}}$$

**Donde:**
- $VA$: valor actual un período ANTES del primer pago
- $VF$: valor futuro en el momento del último pago
- $C$: cuota constante

Al factor $\dfrac{(1+i)^n-1}{(1+i)^n\, i}$ la cátedra lo llama **FACTOR** (factor de actualización de la anualidad, $a_{n,i}$). La cuota de un préstamo francés sale de despejar $C = VA / a_{n,i}$.

### Adelantada (annuity due — pagos al INICIO de cada período)

$$VA_{adel} = VA_{venc} \cdot (1+i) \qquad VF_{adel} = VF_{venc} \cdot (1+i)$$

**Uso:** cada pago gana/descuenta un período más → la adelantada siempre vale más que la vencida idéntica (ej. slides: VF de \$1.000 × 5 años al 7%: vencida \$5.750,74 vs adelantada \$6.153,29). En Excel: argumento `Tipo` = 0 (vencida) o 1 (adelantada).

## Perpetuidades

Flujo recibido "por siempre". Ver [[perpetuidades]].

**Constante:**

$$\boxed{VA = \frac{C}{i}} \qquad \text{(despeje del rendimiento: } i = \frac{C}{VA}\text{)}$$

**Creciente a tasa $g$ (Gordon):**

$$VA = \frac{C_1}{i-g} \qquad (i>g)$$

**Donde:**
- $C_1$: primer flujo (el del próximo período)

**Perpetuidad diferida** (primer pago en $t+1$): la fórmula da el valor en $t$; para traerlo a 0 se divide por $(1+i)^t$:

$$VA_0 = \frac{C}{i}\cdot\frac{1}{(1+i)^t}$$

> **Regla (FAQ de la cátedra):** la fórmula de perpetuidad (y la de anualidad) entrega el VP **un período antes del primer flujo**. Si la perpetuidad arranca en $t=11$, $C/i$ es un valor en $t=10$; para llevarlo a $t=0$ se divide por $(1+i)^{10}$.

**Anualidad como resta de perpetuidades** (truco de las slides): anualidad de 1 a $t$ = perpetuidad desde 1 − perpetuidad desde $t+1$:

$$VA = \frac{C}{i} - \frac{C}{i}\cdot\frac{1}{(1+i)^t}$$

## Valor presente de flujos mixtos (irregulares)

$$\boxed{P = \sum_{t=0}^{n} \frac{F_t}{(1+i)^t} = F_0 + \frac{F_1}{1+i} + \frac{F_2}{(1+i)^2} + \cdots + \frac{F_n}{(1+i)^n}}$$

**Donde:**
- $F_t$: flujo (positivo o negativo) del período $t$

**Uso:** es LA fórmula del [[conceptos/van|VAN]]. Ejemplo (slides): $-170.000$ hoy, $-100.000$ en $t=1$, $+320.000$ en $t=2$, al 5%: $VAN = -170.000 - 95.238 + 290.249 = 25.011$. Ojo en Excel: la función `VNA`/`NPV` descuenta el primer flujo como si fuera de $t=1$ → el flujo de $t=0$ se suma aparte.

**Truco:** flujos con estructura (cuotas constantes + refuerzos periódicos) se descomponen en anualidades y pagos sueltos, y se suman los VP (ej. 5 y 10 de la guía).

## Sistemas de amortización de préstamos

Préstamo $P$, $n$ cuotas, tasa $i$ del período. Cada cuota = amortización de capital + interés. Ver [[sistemas-amortizacion]].

### Sistema Francés (cuota constante)

$$\boxed{C = \frac{P \cdot i}{1-(1+i)^{-n}} = \frac{P}{a_{n,i}}}$$

- Interés del período $t$: $I_t = S_{t-1}\cdot i$ (sobre saldo); amortización $A_t = C - I_t$ (creciente: $A_{t+1} = A_t(1+i)$).
- **Saldo (deuda) tras pagar $t$ cuotas** = VP de las cuotas restantes:

$$S_t = C \cdot \frac{1-(1+i)^{-(n-t)}}{i}$$

**Donde:**
- $S_t$: saldo adeudado después de la cuota $t$
- $A_t$: amortización de capital contenida en la cuota $t$
- $I_t$: interés contenido en la cuota $t$

### Sistema Alemán (amortización constante)

$$A = \frac{P}{n} \qquad I_t = \left[P - (t-1)\,A\right]\cdot i \qquad C_t = A + I_t \ \text{(decreciente)}$$

Saldo tras $t$ cuotas: $S_t = P - t\cdot A$ (lineal).

### Sistema Directo (interés sobre capital INICIAL)

$$C = \frac{P}{n} + P\cdot i \ \text{(constante)}$$

El interés se calcula siempre sobre el capital original, aunque ya se haya devuelto parte → **el costo efectivo es mucho mayor que la tasa declarada** (en el ejemplo de las slides, tasa declarada 0,5% mensual ≈ TIR real 0,72% mensual).

### Comparación (ejemplo de clase: $P=450.000$, $n=360$ meses, $i=0{,}5\%$ mensual)

| | Francés | Alemán | Directo |
|---|---|---|---|
| Cuota | constante \$2.697,98 | decreciente \$3.500 → \$1.256,25 | constante \$3.500 |
| Interés sobre | saldo | saldo | capital inicial |
| Saldo tras 60 meses | \$418.745 | \$375.000 | \$375.000 |
| Pagado en 60 meses | \$161.879 | \$198.938 | \$210.000 |
| Intereses en 60 meses | \$130.623 | \$123.938 | \$135.000 |

A la tasa del préstamo, francés y alemán son **financieramente equivalentes** (VP de las cuotas $= P$); el directo no (es más caro).

## Costo Financiero Total (CFT)

Tasa $i$ que iguala lo **efectivamente recibido** (neto de comisiones y gastos) con el VP de todos los pagos:

$$\text{Neto recibido} = \sum_t \frac{\text{Pago}_t}{(1+i_{CFT})^t}$$

Es la TIR de la financiación. $CFT \geq TEA$ de la operación: la TEA solo mira intereses; el CFT suma comisiones/gastos. Ver [[costo-financiero-total]] y guía ej. 7.

## Descuento comercial

Adelantar el cobro de un documento de valor nominal $C$ que vence en $n$ períodos, a tasa de descuento $d$ **aplicada sobre el valor nominal**:

$$DC = C \cdot d \cdot n \qquad \boxed{VA = C\,(1 - d\cdot n)}$$

**Donde:**
- $DC$: descuento comercial (en \$)
- $VA$: valor actual cobrado hoy

**Tasa de interés equivalente** (el descuento se aplica sobre el nominal; el interés, sobre el valor actual — para $n=1$):

$$i = \frac{d}{1-d}$$

**Anualizar el costo implícito** (descuentos por pronto pago): si la tasa del período de $t$ días es $i_t$,

$$TEA = (1+i_t)^{360/t} - 1$$

Ejemplo (slides): pronto pago 10% por pagar a 10 días una factura de 60 días → $i = 0{,}10/0{,}90 = 11{,}11\%$ en 45 días → $TEA = (1{,}1111)^{360/45}-1 = 132{,}28\%$: no aprovechar el descuento es financiarse carísimo. Ver [[descuento-comercial]].

## Variables (resumen)

- $P, C, VP$: valor presente / capital; $F, M, VF$: valor futuro / monto
- $i$: tasa del período; $i_p$: proporcional; $i_e$, TEA: efectiva anual; TEM: efectiva mensual; TNA: nominal anual
- $k, p$: frecuencias de capitalización; $n$: períodos; $t$: momento
- $i_f, i_r, i_\theta$: componentes inflación / real / riesgo
- $i_a$: tasa activa; $i_p$: tasa pasiva (ojo: las slides usan $i_p$ también para la proporcional — distinguir por contexto)
- $C$ (en anualidades): cuota; $a_{n,i}$: factor de actualización; $g$: crecimiento
- $S_t$: saldo; $A_t$: amortización; $I_t$: interés de la cuota
- $d$: tasa de descuento comercial; $DC$: descuento; $VA$: valor actual
