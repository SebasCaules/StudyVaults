---
unit: 07
module: Empresa
title: Cálculo Financiero / Valor Tiempo del Dinero
parcial: 2
sources: [raw/modulo-3-empresa/unidad-07-calculo-financiero/3_Valor Tiempo del Dinero_GF2020.pdf, raw/modulo-3-empresa/unidad-07-calculo-financiero/12-05-07 GUIA_DE_EJERCICIOS__Economia_para_Ingenieros (rev.1).pdf, raw/modulo-3-empresa/unidad-07-calculo-financiero/Respuestas a algunas preguntas frecuentes.pdf, raw/modulo-3-empresa/unidad-07-calculo-financiero/Archivo VTD.xls]
last_updated: 2026-06-12
---

## Resumen

### La idea central: un peso hoy no es un peso mañana

\$1 millón hoy es "algo" más valioso que \$1 millón dentro de un año. Ese "algo" es el **[[valor-tiempo-dinero]]**, y existe por cuatro razones: **inflación**, **preferencias temporales de consumo**, **incertidumbre del futuro** y **[[costo-de-oportunidad]]** de utilizar el dinero. La **tasa de interés** mide ese cambio de valor: 1 peso de hoy es *equivalente* (no igual) a $1+i$ pesos dentro de un período — el **concepto de equivalencia**. El **interés** es la retribución por el uso de un capital ajeno durante un tiempo.

Esta unidad es la **caja de herramientas** del módulo Empresa: la Unidad 8 (VAN, TIR) no es más que estas fórmulas aplicadas al flujo de fondos de un proyecto.

### Interés simple vs compuesto

| | **Simple** | **Compuesto** |
|---|---|---|
| Intereses sobre | solo el capital inicial | capital + intereses acumulados ("los intereses devengan intereses") |
| Fórmula | $M = C(1+i\cdot n)$ | $F = P(1+i)^n$ |
| Crecimiento | lineal | exponencial |
| Equivalencia de capitales | imperfecta | **perfecta** (transitiva entre fechas) |
| Dónde aparece | TNA, descuento comercial, créditos "directos" | todo lo demás |

Con $i=10\%$: \$1.000 → \$1.200 a 2 períodos con simple, \$1.210 con compuesto. La diferencia (los \$10 de "interés sobre interés") crece período a período. Equivalencia: $1.000$ hoy $\equiv 1.100$ en $t{=}1$ $\equiv 1.210$ en $t{=}2$.

Del compuesto salen **los cuatro despejes** ($F$, $P$, $i$, $n$) que resuelven cualquier problema de suma única — ver [[formulas/unidad-07]].

### El sistema de tasas (lo más tomado)

Tres tasas conviven en cualquier operación — ver [[tasas-equivalentes]]:

| Tasa | Qué es | Fórmula |
|---|---|---|
| **Nominal** (TNA, $i$) | la declarada/publicitada | dato |
| **Proporcional del período** ($i_p$) | la que efectivamente se aplica por subperíodo | $i_p = i/k$ |
| **Efectiva** (TEA, $i_e$) | la ganancia real anual | $i_e = (1+i/k)^k - 1$ |

**Donde:**
- $k$: frecuencia de capitalización (veces por año)

Dos tasas son **equivalentes** si producen el mismo capital final: $(1+i/k)^k = (1+j/p)^p$. A mayor frecuencia de capitalización, mayor TEA para igual TNA (TNA 36%: anual 36% → mensual 42,58% → diaria 43,31% → continua $e^{0,36}-1 = 43,33\%$). El límite es la **capitalización continua** $F = Pe^{rn}$.

**Conversión estrella del parcial** (billetera virtual, año 360): $TEM = (1+TNA/360)^{30}-1$. Con TNA 35%: $TEM \approx 2{,}96\%$.

La tasa nominal además se descompone multiplicativamente en sus **componentes**: $i = (1+i_f)(1+i_r)(1+i_\theta)-1$ — inflación, real (≈3–4% mundial), riesgo (riesgo país = spread vs bono USA). Y en el sistema bancario: **tasa activa** (cobra el banco) vs **pasiva** (paga el banco), $\text{spread} = i_a - i_p$. Ver [[tasa-interes]] y [[tasa-interes-real]] (Fisher: $r = \frac{1+i}{1+\pi}-1$, siempre la forma exacta en Argentina).

### Capitalización y actualización

Dos operaciones espejo — ver [[capitalizacion-actualizacion]]:
- **Capitalizar:** llevar al futuro. $VF = VP(1+i)^n$.
- **Actualizar (descontar):** traer al presente. $VP = VF/(1+i)^n$.

**Regla de oro: nunca sumar ni comparar dinero de fechas distintas sin llevarlo antes al mismo momento.** Para flujos múltiples e irregulares:

$$VP = \sum_{t=0}^{n}\frac{F_t}{(1+i)^t}$$

Ejemplo (slides): $-170.000$ hoy, $-100.000$ en $t{=}1$, $+320.000$ en $t{=}2$ al 5% → $VP = +25.011$. Eso ya es un [[conceptos/van|VAN]].

### Atajos: perpetuidades y anualidades

| Estructura | VP | Nota |
|---|---|---|
| [[perpetuidades\|Perpetuidad]] (flujo $C$ por siempre, desde $t{=}1$) | $C/i$ | rendimiento: $i = C/VP$ |
| Perpetuidad creciente a $g$ (Gordon) | $C_1/(i-g)$ | exige $i>g$; usa el flujo del período próximo |
| Perpetuidad diferida (desde $t{+}1$) | $\dfrac{C}{i}\cdot\dfrac{1}{(1+i)^t}$ | la fórmula da el valor **un período antes del primer flujo** (FAQ) |
| [[anualidades\|Anualidad]] vencida ($n$ cuotas $C$) | $C\cdot\dfrac{1-(1+i)^{-n}}{i}$ | = resta de dos perpetuidades; VF $= C\frac{(1+i)^n-1}{i}$ |
| Anualidad adelantada | la vencida $\times (1+i)$ | pagos al inicio de cada período; siempre vale más |

La anualidad es la herramienta de toda decisión **"contado vs cuotas"** y de los préstamos. El factor $a_{n,i} = \frac{1-(1+i)^{-n}}{i}$ convierte cuota en valor presente y viceversa.

### Sistemas de amortización de préstamos

Tres formas de devolver $P$ en $n$ cuotas a tasa $i$ — ver [[sistemas-amortizacion]] (ejemplo de clase: \$450.000, 360 meses, 0,5% mensual):

| | **Francés** | **Alemán** | **Directo** |
|---|---|---|---|
| Cuota | constante ($P/a_{n,i}$) = 2.697,98 | decreciente ($P/n$ + interés s/saldo), arranca 3.500 | constante ($P/n + P\cdot i$) = 3.500 |
| Interés sobre | saldo | saldo | **capital inicial** |
| Saldo | VP de cuotas restantes (cae lento) | lineal | lineal |
| Costo efectivo | = $i$ | = $i$ | **> $i$** (0,5% declarado ≈ 0,72% real) |

Francés y alemán son financieramente equivalentes a la tasa del préstamo; el directo es siempre más caro que su tasa declarada. En el francés, al principio casi toda la cuota es interés (tras 60 de 360 meses solo se devolvió 7% del capital).

### Descuento comercial

Adelantar un documento que vence en $n$: $VA = C(1-d\cdot n)$, con $d$ aplicada **sobre el valor nominal**. La tasa de interés implícita es mayor: $i = d/(1-d)$. Aplicación clave: los **descuentos por pronto pago** esconden tasas enormes — 10% por pagar 45 días antes ⇒ TEA $= (1{,}1111)^{360/45}-1 = 132{,}28\%$. Ver [[descuento-comercial]].

### Costo Financiero Total (CFT)

Cuando hay comisiones o gastos, ni la TNA ni la TEA miden el costo real: el **CFT** es la TIR del flujo calculada sobre el **neto recibido**. Guía ej. 7: TNA 20% pagadera semestralmente (TES 10%, TEA 21%) + comisión \$2 sobre \$100 ⇒ CFT ≈ 22,8% anual. Ver [[costo-financiero-total]].

## Ejemplo tipo parcial resuelto (pádel, 11-Nov-2025, Problema 1)

**Datos.** Alquiler de paleta con tarifa decreciente: 1º partido del mes \$5.000, 2º \$4.500, 3º en adelante \$4.000. Paleta nueva: \$150.000, vida útil 12 meses. Billetera virtual: TNA 35% capitalización diaria, año de 360 días.

**1) ¿Cuántos partidos/mes hacen conveniente comprar?**
- Tasa: $TEM = (1+0{,}35/360)^{30}-1 = 2{,}96\%$.
- Costo mensual de alquilar $q$ partidos: $q{=}3$ → \$13.500; $q{=}4$ → \$17.500.
- VP de 12 meses de alquiler: factor $a_{12;\,2,96\%} = 9{,}979$ → breakeven mensual $= 150.000/9{,}979 = 15.032$.
- $q{=}3$: VP $= 134.717 < 150.000$ → alquilar. $q{=}4$: VP $= 174.632 > 150.000$ → **comprar**. Mínimo: **4 partidos/mes**.

**2) ¿Tipo de cambio máximo para esperar 3 meses y comprarla a 65 USD afuera?** Alquilo 3 meses (VP $= 17.500 \times a_{3;2,96\%} = 49.540$) y me guardo la plata de la paleta: a $t{=}3$ tengo $(150.000-49.540)\times1{,}0296^3 = 109.642$. Breakeven: $TC = 109.642/65 \approx \mathbf{1.687}$ AR\$/USD — si el dólar esperado es menor, conviene esperar.

**3) Se cancela el viaje a los 3 meses: ¿qué hacer?** Los alquileres ya pagados son **[[conceptos/costo-hundido|costo hundido]]**: no entran en la decisión. Mirando hacia adelante, sigue jugando 4 partidos/mes ⇒ el mismo análisis del punto 1 vuelve a dar **comprar la paleta local**.

## Conceptos clave

### Fundamentos
- [[valor-tiempo-dinero]] — las 4 razones y el concepto de equivalencia
- [[capitalizacion-actualizacion]] — VF/VP y los cuatro despejes
- [[tasa-interes]] — interés simple vs compuesto; componentes; tasas bancarias (extendida desde U5)
- [[tasa-interes-real]] — Fisher exacta (extendida desde U5)

### Tasas
- [[tasas-equivalentes]] — TNA/TEM/TEA, frecuencia $k$, capitalización continua
- [[costo-financiero-total]] — el costo real con comisiones

### Estructuras de flujos
- [[anualidades]] — vencidas y adelantadas
- [[perpetuidades]] — constante, creciente (Gordon), diferida
- [[sistemas-amortizacion]] — francés / alemán / directo
- [[descuento-comercial]] — adelanto de documentos y pronto pago

### Aplicaciones ya vistas (U5)
- [[bonos-renta-fija]] — precio = VP de cupones y amortizaciones
- [[acciones-renta-variable]] — precio = perpetuidad de dividendos

## Fórmulas principales

Ver [[formulas/unidad-07]] (referencia completa). Imprescindibles:
- $F = P(1+i)^n$ y sus despejes
- $TEM = (1+TNA/360)^{30}-1$; $1+TEA = (1+TEM)^{12}$; $(1+i/k)^k = (1+j/p)^p$
- $VA_{anualidad} = C\cdot\frac{1-(1+i)^{-n}}{i}$; $VF = C\cdot\frac{(1+i)^n-1}{i}$; adelantada ×$(1+i)$
- $VP_{perpetuidad} = C/i$; creciente $C_1/(i-g)$
- Cuota francesa $C = P/a_{n,i}$; saldo = VP de cuotas restantes
- $VP = \sum F_t/(1+i)^t$ (flujos mixtos — el embrión del VAN)

## Ejercicios

- [[ejercicios/guia-ejercicios-calculo-financiero]] — los 10 ejercicios de VTD de la guía de la cátedra, resueltos, con las aclaraciones de la FAQ

## Conexiones

- **[[unidades/unidad-05-macroeconomia]]:** acá se profundiza lo que la U5 esbozó — TNA/TEA, [[tasa-interes-real|Fisher]], y la valuación de [[bonos-renta-fija|bonos]] y [[acciones-renta-variable|acciones]] son aplicaciones directas de VP, anualidades y perpetuidades. La [[inflacion]] es el primer componente de la tasa nominal.
- **[[unidades/unidad-06-informacion-contable]]:** no confundir [[conceptos/amortizacion-contable|amortización contable]] (distribución del costo de un bien de uso, devengado) con amortización financiera (devolución de capital de un préstamo). El criterio [[conceptos/devengado-vs-percibido|devengado vs percibido]] separa el cuadro de resultados del flujo de fondos que esta unidad descuenta.
- **[[unidades/unidad-08-evaluacion-proyectos]]:** el [[conceptos/van|VAN]] es exactamente $\sum F_t/(1+i)^t$ con la [[conceptos/trema|TREMA]] como tasa; la [[conceptos/tir|TIR]] es el mismo despeje de $i$ que hace el CFT; el [[conceptos/costo-hundido|costo hundido]] y el [[conceptos/costo-de-oportunidad|costo de oportunidad]] deciden qué flujos entran. Sin la U7 no se puede hacer la U8.

## Errores comunes (mirar antes del parcial)

1. **Comparar o sumar montos de fechas distintas sin descontar/capitalizar.** El error conceptual número 1.
2. **Usar la TNA como si fuera efectiva.** Con capitalización diaria, primero $(1+TNA/360)^{30}-1$; recién después descontar flujos mensuales.
3. **Descontar flujos mensuales con tasa anual** (o viceversa): tasa y flujo siempre del mismo período.
4. **Ubicar mal el VP de anualidades/perpetuidades:** queda **un período antes del primer flujo**; si el flujo arranca en $t=11$, la fórmula da valor en $t=10$ (FAQ).
5. **Aplicar proporcionalidad a tasas efectivas:** la tasa de 80 días es $(1+i_{30})^{80/30}-1$, no $\times 80/30$.
6. **Calcular el saldo de un préstamo francés restando amortización lineal:** el saldo es el VP de las cuotas restantes.
7. **Creer que el sistema directo cuesta su tasa declarada** (cuesta bastante más) o que "el alemán es más barato que el francés" por sumar intereses nominales (a igual tasa son equivalentes).
8. **Ignorar comisiones al medir el costo de un préstamo:** usar el CFT (TIR sobre el neto recibido), no la TEA.
9. **Incluir costos hundidos en la comparación de alternativas** (alquileres ya pagados, estudios ya contratados).
10. **Usar $r \approx i - \pi$ con tasas argentinas:** siempre Fisher exacta.

## Temas sensibles para Parcial 2

- **Conversión TNA cap. diaria → TEM → TEA** (apareció textual en el parcial del 11-Nov-2025).
- **Comprar vs alquilar / contado vs financiado:** VP de la anualidad de pagos vs precio contado; hallar el breakeven (en partidos, en cuota, o en tipo de cambio).
- **Comparación en un momento futuro:** capitalizar lo no gastado y comparar en $t$ (tipo de cambio breakeven).
- **Costo hundido:** identificar qué pagos pasados NO cuentan en la decisión.
- **Préstamo francés:** cuota, saldo tras $t$ pagos, refinanciación, despeje de $n$ (guía ej. 4).
- **CFT con comisión** por tanteo e interpolación (guía ej. 7).
- **Plan de ahorro con perpetuidad** objetivo (guía ej. 2) — cuidado con el período del VP.
