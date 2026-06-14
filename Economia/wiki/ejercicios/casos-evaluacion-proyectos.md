---
tags: [unit-08, ejercicios]
title: Casos resueltos — Evaluación de Proyectos
sources: [raw/modulo-3-empresa/unidad-08-evaluacion-proyectos/epi09_pc 2.pdf]
last_updated: 2026-06-12
---

# Casos resueltos — Evaluación de Proyectos (U8)

Cuatro casos del PDF de cátedra, comentados. El Caso 1 es el modelo del problema de parcial (mismo esqueleto que el parque solar del 11-Nov-2025).

---

## Caso 1 — Ejemplo Integral: lanzamiento de un producto (5 años)

### Enunciado

Una empresa que cierra ejercicios anuales y paga el IG en el mismo ejercicio en que se devenga analiza comercializar un nuevo producto: ventas de 20.000 u/año durante 5 años. La maquinaria cuesta \$200.000, vida útil 5 años, y al final podrá venderse en \$25.000; contablemente se amortiza en 5 años (sin valor residual).

Datos operativos: precio de venta 18 \$/u; materia prima 5 \$/u; MOD 3 \$/u; costos fijos erogables \$60.000/año; **plazo de cobranza 90 días**; **plazo de pago a proveedores de MP 60 días**; **stock de caja necesario: 10% de las ventas**; **stock de MP: 4.000 u**. IG 30%; TREMA 15% anual. (Montos en miles en adelante.)

### Paso 1 — Amortización y cuadro de resultados (lo contable, para el impuesto)

$Am = VO/n = 200/5 = 40$ por año (años 1–5).

| (miles) | Año 1 | Año 2 | Año 3 | Año 4 | Año 5 |
|---|---|---|---|---|---|
| Ventas ($20.000 \times 18$) | 360 | 360 | 360 | 360 | 360 |
| Costos variables ($20.000 \times 8$) | (160) | (160) | (160) | (160) | (160) |
| Costos fijos | (60) | (60) | (60) | (60) | (60) |
| Amortizaciones | (40) | (40) | (40) | (40) | (40) |
| Utilidad extraordinaria (venta máquina) | | | | | 25 |
| **Beneficio antes de IG** | **100** | **100** | **100** | **100** | **125** |
| **IG (30%)** | **(30)** | **(30)** | **(30)** | **(30)** | **(37,5)** |

**Comentarios:** la amortización entra acá (solo acá) porque baja el impuesto — es el [[escudo-fiscal]]. La venta de la máquina por 25 con valor de libro 0 (totalmente amortizada) es utilidad gravada al 100%: el IG del año 5 sube de 30 a 37,5 — exactamente $t \cdot (P - VL) = 0{,}3 \times 25 = 7{,}5$ extra ([[valor-residual]]).

### Paso 2 — De devengado a percibido: cobros y pagos

**Cobranza a 90 días** (= 1/4 del año): de cada año de ventas, \$90 se cobran al año siguiente.

| (miles) | Año 1 | Año 2–5 | Año 6 |
|---|---|---|---|
| Cobros por ventas | 270 | 360 | 90 |

**Compras de MP:** stock inicial de 4.000 u se compra en el año 0 (\$20); años 1–4 se compran 20.000 u (\$100); año 5 solo 16.000 u (\$80) porque se consume el stock. **Pago a proveedores a 60 días** (= 1/6): la compra del año 0 se paga en el año 1; de cada año queda 1/6 (\$16,7) para el siguiente.

| Egresos operativos (miles) | Año 0 | Año 1 | Año 2–4 | Año 5 |
|---|---|---|---|---|
| MOD | | 60 | 60 | 60 |
| Gastos generales (CF) | | 60 | 60 | 60 |
| Compras MP (devengado) | 20 | 100 | 100 | 80 |
| + Deuda comercial inicial | 0 | 20 | 16,7 | 16,7 |
| − Deuda comercial final | (20) | (16,7) | (16,7) | 0 |
| **Pagos totales** | **0** | **223,3** | **220** | **216,7** |

**Comentario:** este es el método "percibido" de tratar el [[capital-de-trabajo-en-proyectos|capital de trabajo]] — créditos y deudas se corrigen línea por línea en lugar de poner ΔKT aparte. En el año 0 no se paga nada (la compra de stock se paga a 60 días, ya en el año 1).

### Paso 3 — Stock de caja, hundidos, valor terminal

- **Stock de caja** = 10% de ventas = 36: se constituye en el año 0 (egreso 36) y se libera al cierre (ingreso 36 en el año 5).
- **Costos históricos, hundidos, de oportunidad: no existen** en este caso (el PDF lo verifica explícitamente — siempre preguntarse).
- **Valor terminal:** valor comercial de la máquina = 25 (el impuesto ya quedó dentro del IG del año 5).

### Paso 4 — Flujo de caja libre

| (miles) | Año 0 | Año 1 | Año 2 | Año 3 | Año 4 | Año 5 | Año 6 |
|---|---|---|---|---|---|---|---|
| Cobros por ventas | 0 | 270 | 360 | 360 | 360 | 360 | 90 |
| Venta de activos (valor terminal) | | | | | | 25 | |
| **Total ingresos** | 0 | 270 | 360 | 360 | 360 | **385** | 90 |
| Egresos operativos | 0 | (223,3) | (220) | (220) | (220) | (216,7) | |
| Variación stock de caja | (36) | 0 | 0 | 0 | 0 | 36 | |
| Impuesto a las ganancias | 0 | (30) | (30) | (30) | (30) | (37,5) | |
| Inversión en activos fijos | (200) | | | | | | |
| **Flujo de caja** | **(236)** | **16,7** | **110** | **110** | **110** | **166,8** | **90** |

**Comentario:** la inversión total del momento 0 es $200 + 36 = 236$ (activo fijo + caja mínima); el proyecto "dura" 6 años de flujos porque la última cobranza entra 90 días después del cierre.

### Paso 5 — Criterios de decisión

**[[van|VAN]] al 15%:**

| Año | Flujo | Factor | VP |
|---|---|---|---|
| 0 | (236,0) | 1,000 | (236,0) |
| 1 | 16,7 | 0,870 | 14,5 |
| 2 | 110,0 | 0,756 | 83,2 |
| 3 | 110,0 | 0,658 | 72,3 |
| 4 | 110,0 | 0,572 | 62,9 |
| 5 | 166,8 | 0,497 | 82,9 |
| 6 | 90,0 | 0,432 | 38,9 |
| | | **VAN** | **118,7** |

$VAN = 118{,}7 > 0$ → **acepto el proyecto**.

**[[tir|TIR]]:** $-236 + \frac{16{,}7}{(1+TIR)} + \frac{110}{(1+TIR)^2} + \frac{110}{(1+TIR)^3} + \frac{110}{(1+TIR)^4} + \frac{166{,}8}{(1+TIR)^5} + \frac{90}{(1+TIR)^6} = 0$ → $TIR = 29\% > TREMA = 15\%$ → acepto (coincide con el VAN: proyecto convencional).

**[[payback|Período de recupero y máxima exposición]]:** acumulado: $(236); (219{,}3); (109{,}3); +0{,}7; 110{,}7; 277{,}5; 367{,}5$ → $PR = 3$ años; **máxima exposición = 236**.

**[[costo-anual-equivalente|Valor Anual]]:** $VA = 118{,}7 / a(6;15\%) = 118{,}7/3{,}784 = 31{,}4$ por año (a 5 años: $35{,}4$) → $VA > 0$ ✓.

### Trampas del caso (las mismas del parcial)

1. No pagar las compras del año 0 en el año 0 (proveedores a 60 días).
2. La amortización jamás aparece como egreso del flujo — solo dentro del IG.
3. El impuesto del año 5 incluye la utilidad por la venta de la máquina.
4. El stock de caja sale en el año 0 y vuelve en el año 5.
5. Hay flujo en el año 6 (cobranza residual) aunque el proyecto "dura 5".

---

## Caso 2 — Conflicto VAN vs TIR (mutuamente excluyentes)

TREMA = 10%.

| Año | A | B |
|---|---|---|
| 0 | (10.000) | (10.000) |
| 1 | 0 | 6.000 |
| 2 | 13.924 | 7.200 |
| TIR | 18% | **20%** |
| VAN | **1.501** | 1.401 |

> Los VAN están tomados de la slide de la cátedra, que redondea (el cálculo exacto da ≈1.507 y ≈1.405). La diferencia no altera el ranking ni el argumento.

La TIR recomienda B; el VAN recomienda A. **Resolución por valor terminal:** A acumula 13.924 al año 2; B, reinvirtiendo los 6.000 al 10% (la tasa real disponible): $7.200 + 6.000 \times 1{,}1 = 13.800 < 13.924$. **Se elige A** — la TIR de B suponía reinversión al 20% que no existe. Regla: ante conflicto (TREMA a la izquierda de la tasa de Fisher), decidir por [[van]]. Ver [[proyectos-mutuamente-excluyentes]].

---

## Caso 3 — Vidas distintas: cadena de reemplazo y anualidad equivalente

Tasa 12%. A: inversión \$10, ingresos \$3,75/año por 5 años. B: inversión \$10, ingresos \$2,5/año por 10 años.

1. **VANes directos (no comparables):** $VAN_A = 3{,}75 \cdot a(5) - 10 = 3{,}518$; $VAN_B = 2{,}5 \cdot a(10) - 10 = 4{,}123$. Parece ganar B… pero los horizontes difieren.
2. **Cadena de reemplazo** (repito A en el año 5): $VAN_A^{10} = 3{,}75 \cdot a(10) - 10 \cdot (1{,}12)^{-5} - 10 = 21{,}188 - 5{,}674 - 10 = 5{,}514 > 4{,}123$ → **A**.
3. **Anualidad equivalente:** $VA_A = 3{,}518/3{,}6048 = 0{,}9759$; $VA_B = 4{,}123/5{,}6502 = 0{,}7297$ → **A**. (Asume repetición indefinida; mismo ranking que la cadena.)

Ver [[costo-anual-equivalente]].

---

## Caso 4 — Costo hundido: ¿lanzamos el producto XX?

Ya se invirtieron \$100.000 en I+D. Flujo neto anual estimado hoy: \$10.000 por 5 años; TREMA 10%. (Cuando arrancó el I+D se estimaban \$40.000/año.)

- Lanzar: $FF = -100.000 + 10.000 \cdot a(5;10\%)$
- No lanzar: $FF = -100.000$
- **Lanzar − No lanzar:** $0 + 10.000 \cdot a(5;10\%) = 10.000 \times 3{,}7908 = +37.908 > 0$ → **se lanza**.

Los \$100.000 están en ambas alternativas y **se cancelan en la resta**: son [[costo-hundido]]. Que la estimación original fuera 40.000 es historia — no cambia la decisión de hoy. (Ojo: si el I+D activado generara amortización con escudo fiscal futuro, ese escudo sí entraría.)
