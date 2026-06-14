---
unit: 07
source: raw/modulo-3-empresa/unidad-07-calculo-financiero/12-05-07 GUIA_DE_EJERCICIOS__Economia_para_Ingenieros (rev.1).pdf
tipo: guia-practica
last_updated: 2026-06-12
---

# Guía de Ejercicios — Parte 1: El Valor del Dinero en el Tiempo

> Guía práctica de la cátedra (Dreizzen, Filgueira, Ventura, Yáñez — oct. 2010, rev. mayo 2012). La **Parte 1 (10 ejercicios de VTD)** se resuelve acá completa. Las **Partes 2 y 3** (Evaluación de Proyectos y Análisis de Reemplazo, 9 ejercicios) son material de la Unidad 8 → ver [[unidades/unidad-08-evaluacion-proyectos]] y [[conceptos/van]].
>
> Donde corresponde se integran las aclaraciones de la **FAQ de la cátedra** ("Respuestas a algunas preguntas frecuentes"), que llama "guía 6" a esta Parte 1.

## Mapa de la guía por tipo

| Ej | Tema | Tipo de problema | Resultado |
|----|------|------------------|-----------|
| 1 | Dos bancos, TNA distintas | [[conceptos/tasas-equivalentes\|tasas equivalentes]] + cuota francés | B más caro; cuotas \$240,1 vs \$249,0 |
| 2 | Ahorro para jubilación | [[conceptos/anualidades\|anualidad]] (VF) + [[conceptos/perpetuidades\|perpetuidades]] | \$62.745 / \$78.432 / \$53.419 por año |
| 3 | Galpón: vender vs alquilar | VP de alternativas en $t=0$ | Vender (94.643 < 100.000); con año 4: alquilar (105.270) |
| 4 | Préstamo francés completo | [[conceptos/sistemas-amortizacion\|sistema francés]]: cuota, saldo, refinanciación, despeje de $n$ | \$86.304; \$53.134; \$2.360.885; \$94.049; ≈47 cuotas |
| 5 | Cuotas con refuerzos | anualidad + pagos extra | 4º trimestre: \$57,83 |
| 6 | Cancelación anticipada parcial | francés: intereses y ahorro | Intereses \$126.490; economía \$35.862 |
| 7 | Préstamo con comisión | [[conceptos/costo-financiero-total\|CFT]] (TIR por tanteo) | CFT ≈ 10,8% sem. ≈ 22,8% anual |
| 8 | Tasas en días + inflación | tasas equivalentes + [[conceptos/tasa-interes-real\|Fisher]] | 5,42%; TEA 7,12%; real 4,0% anual / 0,32% 30d |
| 9 | Equipo: contado vs financiado | VP multi-fuente (alemán + francés + simple) | VP \$703.660 < \$710.000 → financiar |
| 10 | Deuda con flujos mixtos | VP de [[conceptos/capitalizacion-actualizacion\|flujos irregulares]] | **\$1.282,53** (confirmado por FAQ) |

---

## Ej. 1 — Préstamo personal: Banco A vs Banco B

**Datos.** Banco A: TNA 14% capitalización mensual. Banco B: TNA 18% capitalización trimestral. b) Préstamo de \$5.000 en 24 cuotas mensuales iguales.

**Planteo.** Las TNA no se comparan entre sí: hay que pasar ambas a tasa efectiva del mismo período. Tasa del subperíodo $= TNA/k$; de ahí, TEM y TEA.

**Cuentas.**
- A: $TEM_A = 0{,}14/12 = 1{,}167\%$; $TEA_A = (1+0{,}14/12)^{12}-1 = 14{,}93\%$.
- B: $i_{trim} = 0{,}18/4 = 4{,}5\%$; $TEM_B = 1{,}045^{1/3}-1 = 1{,}478\%$; $TEA_B = 1{,}045^4-1 = 19{,}25\%$.

b) Cuota francesa $C = VP/a_{24,i}$ con la TEM de cada banco:
- A: $a = \frac{1-(1{,}01167)^{-24}}{0{,}01167} = 20{,}828$ → $C_A = 5.000/20{,}828 = 240{,}07$.
- B: $a = \frac{1-(1{,}01478)^{-24}}{0{,}01478} = 20{,}082$ → $C_B = 5.000/20{,}082 = 248{,}98$.

**Resultado.** a) El **Banco B** tiene mayor costo efectivo mensual (1,478% > 1,167%) y anual (19,25% > 14,93%) — aunque "18 contra 14" parezca solo 4 puntos, la frecuencia importa. b) $C_A \approx \$240{,}1$; $C_B \approx \$249{,}0$.

---

## Ej. 2 — Ahorro para la jubilación (anualidad + perpetuidades)

**Datos.** Faltan 10 años; depósitos anuales iguales en $t=1\ldots10$; $i = 10\%$. Metas desde el año 11: a) \$100.000 anuales a perpetuidad; b) perpetuidad de \$100.000 creciente al 2%; c) \$100.000 anuales por 20 años.

**Planteo.** Igualar en $t=10$: VF de los ahorros = valor de la meta. *FAQ:* la fórmula de perpetuidad da el VP **un período antes del primer flujo** → flujo desde $t=11$ ⇒ valor en $t=10$ (no hace falta descontar a 0 si igualamos en 10). En (b), lo que crece 2% es el monto: \$100.000 en el año 11, \$102.000 en el 12, \$104.040 en el 13…

**Cuentas.** VF de la anualidad de ahorro: $D \cdot \frac{1{,}1^{10}-1}{0{,}1} = 15{,}9374\,D$.

| Meta | Valor en $t=10$ | Depósito anual $D$ |
|---|---|---|
| a) $\frac{100.000}{0{,}10} = 1.000.000$ | 1.000.000 | $1.000.000/15{,}9374 = \mathbf{62.745}$ |
| b) $\frac{100.000}{0{,}10-0{,}02} = 1.250.000$ | 1.250.000 | $\mathbf{78.432}$ |
| c) $100.000\cdot\frac{1-1{,}1^{-20}}{0{,}1} = 851.356$ | 851.356 | $\mathbf{53.419}$ |

**Resultado.** a) \$62.745/año; b) \$78.432/año; c) \$53.419/año. Lectura: la cola infinita (a vs c) solo cuesta ~\$9.300 más por año; el crecimiento del 2% encarece 25%.

---

## Ej. 3 — Galpón: vender hoy vs alquilar y vender después

**Datos.** Vender hoy: \$100.000. Alternativa: alquilar 3 años a \$15.000/año (vencidos), vender al final del año 4 en \$80.000 (sin alquiler en año 4). $i = 9\%$, impuestos 0.

**Planteo.** Comparar en $t=0$: $VP_{alq} = 15.000\,a_{3;9\%} + 80.000/1{,}09^4$ vs 100.000.

**Cuentas.** $a_{3;9\%} = \frac{1-1{,}09^{-3}}{0{,}09} = 2{,}5313$ → alquileres: \$37.969. Venta: $80.000/1{,}41158 = 56.674$. Total: **\$94.643**.

Si además se alquila el año 4: $+15.000/1{,}09^4 = +10.626$ → **\$105.270**.

**Resultado.** Sin alquiler en el año 4 conviene **vender hoy** (94.643 < 100.000). Si se puede alquilar el año 4, la decisión **cambia**: conviene alquilar y vender en $t=4$ (105.270 > 100.000).

---

## Ej. 4 — Préstamo francés: cuota, saldo, refinanciación, plazo

**Datos.** $P = 3.000.000$; 60 cuotas mensuales vencidas; $i = 2\%$ mensual; sistema francés.

**a) Cuota.** $C = \dfrac{P\,i}{1-(1+i)^{-60}} = \dfrac{3.000.000 \times 0{,}02}{1-1{,}02^{-60}} = \dfrac{3.000.000}{34{,}7609} = \mathbf{86.304}$.

**b) Total amortizado al fin del período 2.** Interés 1: $3.000.000 \times 0{,}02 = 60.000$ → $A_1 = 26.304$. $A_2 = A_1 (1{,}02) = 26.830$. Total amortizado $= \mathbf{53.134}$ (la cuota es 2,9% capital al inicio: típico del francés).

**c) Deuda tras 20 cuotas** = VP de las 40 restantes: $S_{20} = 86.304 \cdot \frac{1-1{,}02^{-40}}{0{,}02} = 86.304 \times 27{,}3555 = \mathbf{2.360.885}$ (se pagaron 20 cuotas ≈ 1,73 MM y la deuda solo bajó 0,64 MM).

**d) Refinanciación del saldo al 2,5% en 40 cuotas.** $C' = \dfrac{2.360.885}{a_{40;2{,}5\%}} = \dfrac{2.360.885}{25{,}1028} = \mathbf{94.049}$.

**e) Sube la tasa a 2,5% manteniendo la cuota \$86.304 → ¿cuántos períodos?** Despejo $n$:

$$86.304 \cdot \frac{1-1{,}025^{-n}}{0{,}025} = 2.360.885 \Rightarrow 1{,}025^{-n} = 0{,}3161 \Rightarrow n = \frac{\ln(1/0{,}3161)}{\ln 1{,}025} = 46{,}6$$

**Resultado e).** ≈ **47 períodos** (46 cuotas completas + una última menor). Subir la tasa de 2% a 2,5% sin tocar la cuota alarga el remanente de 40 a 47 meses.

---

## Ej. 5 — Máquina en cuotas con refuerzos

**Datos.** Contado: \$200. Financiada: 8 cuotas trimestrales iguales $C$ + 2 refuerzos (cada uno $= 2C$) junto con la 4ª y la 8ª cuota. TNA 12% cap. trimestral → $i = 3\%$ trimestral.

**Planteo.** El VP de todo lo pagado debe igualar el contado. Descomponer: anualidad de 8 cuotas + dos pagos sueltos de $2C$ en $t=4$ y $t=8$:

$$200 = C\,a_{8;3\%} + \frac{2C}{1{,}03^4} + \frac{2C}{1{,}03^8}$$

**Cuentas.** $a_{8;3\%} = 7{,}0197$; $2/1{,}03^4 = 1{,}7770$; $2/1{,}03^8 = 1{,}5788$. Suma de factores $= 10{,}3755$ → $C = 200/10{,}3755 = 19{,}28$.

**Resultado.** En el 4º trimestre se paga cuota + refuerzo $= 3C = \mathbf{\$57{,}83}$.

---

## Ej. 6 — Cancelación anticipada de la mitad de la deuda

**Datos.** Préstamo a 30 cuotas de \$10.000 al 6% (francés). Al pagar la cuota 12 se agrega un pago extra que cancela **la mitad de la deuda** de ese momento; se sigue con una nueva cuota hasta completar el plazo original (18 cuotas más). Hallar intereses totales y la economía de intereses.

**Planteo.** (1) Préstamo original $= 10.000\,a_{30;6\%}$. (2) Saldo tras la cuota 12 $= 10.000\,a_{18;6\%}$. (3) Pago extra = mitad de eso; nueva cuota = saldo restante / $a_{18;6\%}$. (4) Intereses = total pagado − capital.

**Cuentas.**
- $P = 10.000 \times 13{,}7648 = 137.648$.
- $S_{12} = 10.000 \times 10{,}8276 = 108.276$ → pago extra $= 54.138$.
- Nueva deuda $54.138$ en 18 cuotas: $C' = 54.138/10{,}8276 = \mathbf{5.000}$ (lineal: mitad de deuda → mitad de cuota).
- Total pagado: $12\times10.000 + 54.138 + 18\times5.000 = 264.138$ → intereses $= 264.138 - 137.648 = \mathbf{126.490}$.
- Sin pago extra: $30\times10.000 - 137.648 = 162.352$ de intereses.

**Resultado.** Intereses pagados: **\$126.490**. Economía de intereses: $162.352-126.490 = \mathbf{\$35.862}$. Cancelar capital temprano ahorra todos los intereses futuros sobre ese capital.

---

## Ej. 7 — Costo de la deuda con comisión (CFT)

**Datos.** Prestan \$100 con comisión de \$2 en el acto. Devolución: 2 cuotas anuales de \$50 (fin de año 1 y 2) + interés 20% nominal anual **pagadero semestralmente** (10% semestral sobre saldo). Dato para tanteos: 11% semestral.

**Planteo.** Flujo semestral: $+98$ (recibido neto); pagos $10$ ($t=1$), $60$ ($t=2$), $5$ ($t=3$), $55$ ($t=4$). El costo es la TIR del flujo — el [[conceptos/costo-financiero-total|CFT]]:

$$98 = \frac{10}{1+i} + \frac{60}{(1+i)^2} + \frac{5}{(1+i)^3} + \frac{55}{(1+i)^4}$$

*FAQ:* la **TES** $= TNA/2 = 10\%$ resuelve la misma ecuación con **100** a la izquierda (TEA $= 1{,}1^2-1 = 21\%$, solo intereses); el CFT usa el neto **98** y por eso da más.

**Cuentas (tanteo).** $i=11\% \Rightarrow VP = 97{,}59$ (pasado); $i = 10{,}8\% \Rightarrow VP = 98{,}07$. Interpolando: $i \approx 10{,}83\%$ semestral.

**Resultado.** CFT semestral ≈ **10,8%** → CFT anual $= (1{,}1083)^2-1 \approx \mathbf{22{,}8\%}$ (> TEA 21%: la comisión encarece ~2 p.p.).

---

## Ej. 8 — Tasas equivalentes en días y tasa real

**a) Datos.** Tasa 2% para 30 días → ¿equivalente para 80 días?

$$i_{80} = (1{,}02)^{80/30} - 1 = \mathbf{5{,}42\%}$$

(No es proporcional: $2\% \times 80/30 = 5{,}33\%$ estaría mal — la efectiva capitaliza.)

**b) Datos.** TNA 7% con capitalización cada 180 días; inflación 3% anual; año de 365 días. Tasa real anual y de 30 días.

**Cuentas.**
- Tasa del subperíodo: $0{,}07 \times \frac{180}{365} = 3{,}452\%$ → $TEA = (1{,}03452)^{365/180}-1 = 7{,}12\%$.
- Fisher exacta: $r = \dfrac{1{,}0712}{1{,}03}-1 = \mathbf{4{,}00\%}$ anual.
- Real de 30 días: $r_{30} = (1{,}0400)^{30/365}-1 = \mathbf{0{,}32\%}$.

**Resultado.** a) 5,42%. b) TEA 7,12%; real anual 4,00%; real de 30 días 0,32%. Regla: **igualar plazos antes de aplicar Fisher**; ver [[conceptos/tasa-interes-real]].

---

## Ej. 9 — Equipo de \$710.000: contado vs cóctel de financiaciones

**Datos.** a) HSBC: \$100.000, 4 cuotas mensuales al 3% mensual, **método alemán**. b) Banco Río: \$200.000, 6 cuotas mensuales al 2,5%, **método francés**. c) Proveedor: \$30.000 pagaderos en $t=4$, devengando 3,5% de **interés simple** mensual durante 3 meses. d) Resto (\$380.000) con fondos propios. Costo de oportunidad del capital: 3,25% mensual. ¿Cuánto costó el equipo en VP? ¿Era mejor al contado?

**Planteo.** *FAQ:* el costo de oportunidad (3,25%) es el costo del **dinero propio**; las tasas de los créditos, el del **dinero prestado**. Conviene tomar deuda cuando es más barata que el capital propio. Numéricamente: armar el flujo de cada financiación y descontarlo al 3,25%; sumar el pago propio de $t=0$; comparar contra 710.000.

**Cuentas.**
- **HSBC (alemán):** $A = 25.000$; cuotas $28.000$, $27.250$, $26.500$, $25.750$ ($t=1\ldots4$). VP al 3,25% $= 99.413$.
- **Río (francés):** $C = 200.000/a_{6;2{,}5\%} = 200.000/5{,}5081 = 36.310$. VP al 3,25% $= 36.310 \times 5{,}3726 = 195.079$.
- **Proveedor:** pago $= 30.000\,(1+0{,}035\times3) = 33.150$ en $t=4$ (interés simple). VP $= 33.150/1{,}0325^4 = 29.169$. (TIR implícita ≈ 2,5% mensual.)
- **Propio:** $380.000$ en $t=0$.

$$VP_{total} = 380.000 + 99.413 + 195.079 + 29.169 = \mathbf{703.660}$$

**Resultado.** El equipo "costó" **\$703.660** en valores de hoy, **menos** que los \$710.000 de contado → **no convenía pagar al contado**: las tres financiaciones (3%, 2,5% y ~2,5% implícito) son más baratas que el 3,25% del capital propio, así que cada peso financiado ahorra. Ahorro en VP ≈ \$6.340.

---

## Ej. 10 — Importe de una deuda con pagos mixtos

**Datos.** Tasa 6% anual con capitalización mensual → $i = 0{,}5\%$ mensual. Pagos: \$50 al final de cada mes durante 17 meses; refuerzos de \$80 cada 3 meses desde el mes 3 hasta el 15 inclusive ($t = 3,6,9,12,15$); pago final de \$95,25 en $t=18$. ¿Deuda hoy?

**Planteo.** La deuda es el VP de todo lo prometido: anualidad + 5 pagos sueltos + pago final.

$$D = 50\,a_{17;0{,}5\%} + 80\sum_{t\in\{3,6,9,12,15\}} \frac{1}{1{,}005^{t}} + \frac{95{,}25}{1{,}005^{18}}$$

**Cuentas.** $50 \times 16{,}2586 = 812{,}93$; $80 \times 4{,}7816 = 382{,}53$; $95{,}25 \times 0{,}91414 = 87{,}07$.

**Resultado.** $D = \mathbf{\$1.282{,}53}$ — la FAQ de la cátedra confirma este valor (faltaba en la hoja de resultados oficial).

---

## Partes 2 y 3 — Evaluación de Proyectos y Reemplazo

Las **Partes 2 (6 ejercicios de evaluación de proyectos)** y **3 (2 de reemplazo)** son material de la Unidad 8 y están **resueltas paso a paso** en su propia página → **[[ejercicios/guia-ejercicios-evaluacion-proyectos]]**.

Incluyen: FEO/FEE por los tres enfoques, VAN con TREMA, escudo fiscal de amortizaciones (ej. 3: diferencia de VAN entre países = **\$1.984**, validado contra la FAQ), costos prorrateados que **no** van al flujo (ej. 4), costo hundido (ej. 5–6), y vida económica / período óptimo de reemplazo por **CAE/VAE** (Parte 3). Conceptos: [[conceptos/van]], [[conceptos/flujo-de-fondos-proyecto]], [[conceptos/escudo-fiscal]], [[conceptos/costo-hundido]], [[conceptos/costo-anual-equivalente]].

La FAQ también aclara el desfasaje **ventas (devengado) vs cobranzas (percibido)**: el flujo de fondos siempre va por *cash*; el cuadro de resultados por devengado, y la diferencia se captura como inversión en capital de trabajo → ver [[conceptos/devengado-vs-percibido]] y [[conceptos/capital-de-trabajo]] (U6).

## Errores frecuentes detectados al resolver

1. **Comparar TNA entre sí** (ej. 1): convertir siempre a efectiva del mismo período; la frecuencia de capitalización cambia el ranking aparente.
2. **Olvidar dónde queda el VP de una perpetuidad/anualidad** (ej. 2): un período **antes** del primer flujo. Flujo desde $t=11$ ⇒ valor en $t=10$.
3. **Calcular el saldo de un francés "restando capital lineal"** (ej. 4): el saldo es el VP de las cuotas restantes. En el francés se amortiza poquísimo al principio.
4. **Sumar refuerzos como si fueran cuotas de la anualidad** (ej. 5 y 10): descomponer en anualidad + pagos sueltos descontados a su fecha.
5. **Confundir TEA con CFT** (ej. 7): con comisiones, el costo verdadero se calcula sobre el **neto recibido** (TIR del flujo), no con $(1+TES)^2-1$.
6. **Aplicar proporcionalidad a tasas efectivas** (ej. 8a): la tasa de 80 días es $(1+i_{30})^{80/30}-1$, no $i_{30}\times 80/30$.
7. **Deflactar con plazos inconsistentes** (ej. 8b): Fisher exige $i$ y $\pi$ del mismo período.
8. **Decidir contado vs financiado comparando tasas "a ojo"** (ej. 9): descontar cada financiación al costo del capital propio y comparar VP contra el contado.
9. **Olvidar que el interés simple no capitaliza** (ej. 9c): $30.000(1+0{,}035\cdot3)$, no $30.000(1{,}035)^3$.

## Ver también

- [[formulas/unidad-07]] — todas las fórmulas usadas acá
- [[unidades/unidad-07-calculo-financiero]] — teoría de la unidad
- [[conceptos/valor-tiempo-dinero]], [[conceptos/tasas-equivalentes]], [[conceptos/anualidades]], [[conceptos/perpetuidades]], [[conceptos/sistemas-amortizacion]], [[conceptos/costo-financiero-total]]
