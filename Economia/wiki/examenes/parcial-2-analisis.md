---
parcial: 2
fecha_examen: 2026-06-16
cubre: Unidades 6-8 (Módulo Empresa)
source: 3 parciales viejos (P2 11112025 + solución oficial, P2 19-11-2010, P2 19-06-2009)
last_updated: 2026-06-12
---

# Parcial 2 — Análisis de parciales viejos

## Parciales individuales (con resolución)

| Fecha | Tema dominante | Página |
|-------|----------------|--------|
| 19-Jun-2009 | Contabilidad (asientos, flujo de caja, devengado/percibido) + tasas y francés | [[examenes/parcial-2-2009-06-19]] |
| 19-Nov-2010 | V/F contable-financiero + anualidades (Huguito) + VAN completo (NIKITA) | [[examenes/parcial-2-2010-11-19]] |
| 11-Nov-2025 | Cálculo financiero (comprar vs alquilar) + VAN (SolArGen) — **con solución oficial** | [[examenes/parcial-2-2025-11-11]] |

## Estructura típica

El formato evolucionó hacia menos ejercicios y más integradores:

- **2009:** 6 ejercicios cortos — 2 teóricos, asientos, flujo de caja, 2 de cálculo financiero. Sin evaluación de proyectos.
- **2010:** V/F (7 ítems, U6) + problema de cálculo financiero (U7) + problema de VAN (U8).
- **2025 (formato actual):** **2 problemas grandes, sin V/F**: P1 = decisión financiera personal (U7, ~50%), P2 = evaluación de proyecto por VAN (U8, ~50%). Tema 1 y Tema 2 con los mismos enunciados y distintos números.

> Apuesta razonable para el 16-Jun-2026: un problema de cálculo financiero "de la vida real" (tasas equivalentes + anualidades + decisión) y un VAN con trampas de armado de flujo. La teoría contable (U6) puede colarse como V/F o dentro del armado del flujo (devengado vs percibido, cobranzas).

Reglas constantes en los 3 parciales: **no se prestan calculadoras** (llevar la propia) y **no se contestan preguntas** — ante ambigüedad, suponer y justificar por escrito (la suposición declarada vale; la omisión, no).

## Temas recurrentes (ranking de frecuencia)

| # | Tema | Frecuencia | Dónde aparece |
|---|------|-----------|---------------|
| 1 | **Tasas equivalentes** (TNA→TEM/TEA, comparar capitalizaciones) | 3/3 | 2009 Ej5, 2010 P1, 2025 P1 — siempre es el paso 1 |
| 2 | **Anualidades** (VP/VF, factor, cuota) | 3/3 | 2009 Ej6, 2010 P1, 2025 P1 y P2 |
| 3 | **Devengado vs percibido** | 3/3 | 2009 Ej1-3, 2010 V/F-e y cobranzas 80/20, 2025 P2 (amortización) |
| 4 | **Evaluación de proyectos: VAN con FEO/FEE** | 2/3 | 2010 P2, 2025 P2 — el problema de mayor peso en los dos más recientes |
| 5 | **Costo hundido** | 2/3 (3 veces) | Estudio consultora (2010 P2 y 2025 P2), alquileres pagados (2025 P1c) |
| 6 | **Escudo fiscal / amortización contable** | 2/3 | 2010 P2 (vida contable ≠ técnica), 2025 P2 (a y b) |
| 7 | **Venta de activo: IG sobre (VM − VL)** | 2/3 | 2010 P2 (VL=100k), 2025 P2 (VL=0) |
| 8 | **Sistemas de préstamos (francés)** | 2/3 | 2009 Ej6, 2010 V/F-d y P1 (saldo = VP de cuotas restantes) |
| 9 | **Capital de trabajo / NOF / bache financiero** | 2/3 | 2009 Ej4, 2010 V/F-a-b y P2 (CxC); 2025 lo aclara explícitamente ("no hay") |
| 10 | **Costo de oportunidad** | 2/3 | 2010 P2 (galpón alquilado), 2025 P1 (rendimiento de la billetera) |
| 11 | **Contabilidad: asientos, origen y aplicación, ratios** | 1/3 | 2009 Ej2-3, 2010 V/F-a-c — candidata a V/F |
| 12 | **Costeo (ABC, equilibrio/pseudoequilibrio)** | 1/3 | 2010 V/F-f-g |

## Trampas clásicas (las que deciden la nota)

1. **Costo hundido disfrazado:** el estudio de la consultora "que se pagará dentro de un año" (2010) o "que la empresa pagó" (2025) NUNCA entra al flujo — se paga haya o no proyecto. En 2010 incluirlo cambia el signo del VAN (+39.905 → −51.004). Ídem los alquileres ya pagados cuando se replantea una decisión (2025 P1c). Ver [[conceptos/costo-hundido]].
2. **TNA no es tasa de cuenta:** siempre convertir a la tasa efectiva del período de los flujos — $\left(1+\frac{TNA}{m}\right)^{m\cdot f}-1$ — antes de cualquier VP/VF. En 2025: TNA 35% cap. diaria → TEM 2,958% (no 35/12). En 2009: comparar TEAs, no nominales. Ver [[conceptos/tasas-equivalentes]].
3. **Amortización contable: resta y vuelve.** No es caja: baja la UAII (paga menos IG) y se suma de vuelta — $FEO = UN + Amort = (V-C)(1-t) + t \cdot Amort$. Vida útil **contable** ≠ técnica (2010: 4 vs 5 años) y la base excluye el valor de rezago. Ver [[conceptos/amortizacion-contable]] y [[conceptos/escudo-fiscal]].
4. **Escudo fiscal: importa el cuándo.** Mismo escudo nominal repartido en más años vale menos en VP (2025 P2b: amortizar en 15 en vez de 10 años baja el VAN ~80 MM y lo vuelve negativo). Amortizar rápido maximiza VAN.
5. **Venta de activo paga IG sobre la utilidad contable:** $FEE = VM - t\,(VM - VL)$, no el valor de mercado pelado. Si el bien está totalmente amortizado (VL=0), toda la venta es ganancia gravada (2025: 300 → 210).
6. **Devengado vs percibido:** el IG se calcula sobre lo devengado; la caja entra cuando se cobra. Ventas 80% contado / 20% al año (2010) ⇒ crédito por ventas que se constituye el año 1 y se recupera al final como [[conceptos/capital-de-trabajo]]. En contabilidad pura (2009): amortizaciones y previsiones no erogan caja; compra de activos, devolución de capital y dividendos no pasan por el CR.
7. **Inversiones cuando se pagan, no cuando se deciden:** el 30%/70% (o 40%/60%) de los paneles va en año 0 y año 1 respectivamente (2025). El flujo registra erogaciones, no compromisos.
8. **Costo de oportunidad adentro:** el galpón propio que dejaba renta de 250.000/año es un costo del proyecto (y gravado) aunque no salga plata (2010). La plata propia siempre rinde la tasa de la billetera/TREMA. Ver [[conceptos/costo-de-oportunidad]].
9. **V/F con "siempre/todos":** suele esconder la excepción (sistemas de préstamos equivalentes *solo* a la tasa del préstamo; "todos los costos erogan caja" — falso por amortizaciones). Justificar es obligatorio: sin justificación se invalida.
10. **VAN al filo del cero a propósito:** +1,88 MM sobre 2.500 MM (2025 T2), +39.905 sobre 1 MM (2010), y el Tema 1 de 2025 da −97,87. No asustarse por resultados chicos: lo que se corrige es el armado; comentar la sensibilidad suma.

## Patrones numéricos típicos

### Problema de VAN (receta de armado)
1. Listar qué entra: solo flujos **incrementales después de impuestos**. Hundidos afuera; costos de oportunidad adentro.
2. Inversiones en el año en que se **pagan**.
3. CR del proyecto por tramo de años: Ventas − Costos − Amortización = UAII → IG → UN.
4. $FEO = UN + Amort$ por tramo (cambia cuando termina la amortización).
5. FEE al final: $VM - t(VM - VL)$; recupero del capital de trabajo si lo hubo.
6. Línea de FF por año; descontar a la [[conceptos/trema]] usando factores de anualidad por tramo (el factor queda valuado un período antes de la primera cuota del tramo — después descontarlo hasta 0).
7. Concluir: VAN > 0 ⇒ recomendar; comentar sensibilidad si es marginal. Ver [[conceptos/van]], [[conceptos/flujo-de-fondos-proyecto]]; tener presentes [[conceptos/tir]] y [[conceptos/payback]] como criterios alternativos por si los piden.

### Problema de cálculo financiero (receta)
1. Convertir TNA → tasa efectiva del período de los flujos (¡paso 1 siempre!).
2. Identificar la estructura: anualidad (factor VP/VF), flujos sueltos (capitalizar/actualizar uno a uno), o préstamo (cuota francés, saldo = VP de cuotas restantes).
3. Igualar valores **en el mismo momento del tiempo** (t=0 o t final, pero uno solo).
4. En decisiones comprar/alquilar/esperar: horizonte común (vida útil), VP de cada alternativa, y el "máximo precio/TC de indiferencia" sale de igualar los VP.
5. Declarar supuestos de timing (cuotas vencidas vs adelantadas) por escrito.

### V/F teórico (si vuelve al formato)
- NOF vs FM, liquidez vs solvencia, rotaciones ([[conceptos/ratios-financieros]], [[conceptos/balance-patrimonial]])
- Devengado vs percibido en CR y caja ([[conceptos/cuadro-de-resultados]])
- Sistemas francés/alemán/americano: equivalencia a la tasa del préstamo
- Costeo tradicional vs ABC; punto de equilibrio y pseudoequilibrio multiproducto

## Plan de práctica para los 4 días previos (examen 16-Jun)

| Día | Foco | Tareas |
|---|---|---|
| **Jue 12-Jun** | Formato actual | Rehacer [[examenes/parcial-2-2025-11-11]] completo **sin mirar la solución** (Tema 1 entero, después chequear contra la oficial). Practicar a mano TNA→TEM y factores $\frac{(1+i)^n-1}{(1+i)^n i}$ |
| **Vie 13-Jun** | VAN con todas las trampas | Rehacer NIKITA ([[examenes/parcial-2-2010-11-19]] P2): hundido + costo de oportunidad + vida contable ≠ técnica + cobranzas 80/20. Memorizar la receta de armado de FF y $FEE = VM - t(VM-VL)$ |
| **Sáb 14-Jun** | Cálculo financiero + contable | Huguito (2010 P1) y los 6 ejercicios de [[examenes/parcial-2-2009-06-19]]. Repasar U6: NOF/FM, liquidez/solvencia, rotaciones, ABC, pseudoequilibrio, devengado vs percibido |
| **Dom 15-Jun** | Simulacro | Tema 2 de 2025 cronometrado (~2 h, sin apuntes). Releer la lista de trampas de esta página. Verificar calculadora propia (no se prestan). Repasar la variante b) del escudo fiscal |

**Errores a no repetir el día del examen:** olvidar convertir la TNA; meter la consultora al flujo; descontar la anualidad sin el último tramo hasta t=0; usar vida útil técnica para amortizar; olvidar el IG en la venta final; no declarar supuestos por escrito.

## Fechas relevantes

- **Parcial 2:** 2026-06-16
- **Recuperatorio:** 2026-06-23

## Ver también
- [[examenes/parcial-2-2025-11-11]] · [[examenes/parcial-2-2010-11-19]] · [[examenes/parcial-2-2009-06-19]]
- [[examenes/parcial-1-analisis]] — formato y estrategia general de la cátedra
- [[conceptos/van]] · [[conceptos/flujo-de-fondos-proyecto]] · [[conceptos/escudo-fiscal]] · [[conceptos/costo-hundido]] · [[conceptos/tasas-equivalentes]] · [[conceptos/anualidades]] · [[conceptos/devengado-vs-percibido]] · [[conceptos/capital-de-trabajo]]
