---
unit: 01-02
source: GP2_ePI_2024.pdf
tipo: guia-practica
last_updated: 2026-04-28
---

# GP N°2 — Microeconomía: Demanda, Excedentes, Producción y Costos

> Resolución completa paso a paso. Mezcla **Unidad 1** (Ej 1-6: demanda/oferta/elasticidad/excedentes/comercio) y **Unidad 2** (Ej 7-10: producción y costos).

---

## Ej 1 — Demanda de mercado (agregación horizontal)

**Datos.** Néstor: $Q_N = 15 - 5P$. Cristina: $Q_C = 20 - 2P$.

**Identificar precios de corte.**
- Néstor: $Q_N = 0 \iff P = 3$. Compra solo si $P \leq 3$.
- Cristina: $Q_C = 0 \iff P = 10$. Compra solo si $P \leq 10$.

**Suma horizontal por tramos.**

$$Q_M(P) = \begin{cases} 0 & \text{si } P > 10 \\ 20 - 2P & \text{si } 3 < P \leq 10 \quad (\text{solo Cristina}) \\ (15 - 5P) + (20 - 2P) = 35 - 7P & \text{si } 0 \leq P \leq 3 \quad (\text{ambos}) \end{cases}$$

**Quiebre en $P = 3$:** $Q_M(3) = 20 - 6 = 14$ (verifica con tramo inferior: $35 - 21 = 14$ ✓).

**Puntos clave de la curva agregada:** $(P, Q) = (10, 0), (3, 14), (0, 35)$. La curva tiene **un quiebre** en $(P=3, Q=14)$ porque ahí se suma el segundo consumidor.

![[gp2-ej1-agregacion-horizontal.svg]]

---

## Ej 2 — EC y tarifa de dos partes (Sioli, tenis)

| $P$ ($/h) | $Q$ (h/sem) |
|-----------|-------------|
| 24 | 1 |
| 17 | 2 |
| 8  | 3 |
| 2  | 4 |
| 0  | 4 |

**Lectura clave.** La tabla en realidad da, para cada hora adicional, el precio máximo al que la familia compraría esa hora. Es decir, la **valoración marginal** de la 1ª, 2ª, 3ª y 4ª hora es 24, 17, 8, 2 respectivamente (la 5ª valoración es 0).

### a) Máxima disposición a pagar (DAP) por $n$ horas

Suma acumulada de valoraciones marginales:

| $n$ horas | DAP máxima |
|-----------|-----------|
| 1 | $24$ |
| 2 | $24 + 17 = 41$ |
| 3 | $24 + 17 + 8 = 49$ |
| 4 | $24 + 17 + 8 + 2 = 51$ |

### b) Excedente del consumidor (EC) según precio

Compra cada hora cuya valoración marginal supere al precio. $EC = \sum (\text{val. marginal} - P)$ para las horas compradas.

- **$P = 20$:** compra solo la 1ª (val=24 > 20). $EC = 24 - 20 = 4$.
- **$P = 15$:** compra 1ª y 2ª. $EC = (24-15) + (17-15) = 9 + 2 = 11$.
- **$P = 7$:** compra 1ª, 2ª y 3ª. $EC = (24-7) + (17-7) + (8-7) = 17 + 10 + 1 = 28$.

### c) Tarifa fija máxima con tenis libre

Con tenis libre, los Sioli juegan hasta donde la valoración marginal sea $\geq 0$, es decir las 4 horas. La máxima tarifa fija que aceptarían es la suma de todas las valoraciones (el club captura todo el EC):

$$\boxed{T_{max} = 24 + 17 + 8 + 2 = 51 \text{ \$/sem}}$$

Esto ilustra la lógica de la **tarifa de dos partes** (membresía + uso): con tarifa fija pura, el monopolista captura el 100% del EC. Ver [[conceptos/excedente-consumidor]].

![[gp2-ej2-ec-tarifa-tenis.svg]]

---

## Ej 3 — Elasticidad-precio de la demanda (electricidad)

**Datos.** $Q = 2000 - 100P$ (Q en kWh/mes, P en ctvos/kWh).

### a) Elasticidad en $P = 9, 10, 11$

$dQ/dP = -100$. $\eta = -100 \cdot P/Q$.

| $P$ | $Q$ | $\eta$ | Régimen |
|-----|-----|--------|---------|
| 9 | 1100 | $-100 \cdot 9/1100 = -9/11 \approx -0{,}82$ | inelástica |
| 10 | 1000 | $-100 \cdot 10/1000 = -1$ | unitaria |
| 11 | 900 | $-100 \cdot 11/900 = -11/9 \approx -1{,}22$ | elástica |

### b) Recomendación a la compañía si costos = 0 y $P = 11$

Con costos cero, maximizar beneficio = maximizar ingreso. El ingreso $I = P \cdot Q$ se maximiza donde $\eta = -1$.

Verifico: $I(P) = P(2000 - 100P) = 2000P - 100P^2$. $dI/dP = 2000 - 200P = 0 \Rightarrow P^* = 10$.

A $P = 11$ la demanda es **elástica** ($|\eta| > 1$): bajar el precio incrementa el ingreso. **Aconsejo bajar el precio hasta $P = 10$** (donde $\eta = -1$ e $I$ es máximo).

Ingreso máximo = $10 \times 1000 = 10000$ ctvos = $\$100$.

### c) EC con tarifa escalonada (5 ctvos primeros 500 kWh, 10 ctvos siguientes)

Demanda inversa: $P = 20 - Q/100$.

**Decisión de Eduardo.**
- En el 1er tramo (0 a 500 kWh) paga 5 ctvos: dispuesto a comprar todas estas (su DAP en $Q = 500$ es $P = 15 > 5$).
- En el 2º tramo (Q > 500) paga 10 ctvos: comprará mientras su DAP supere 10. Como DAP en $Q = 1000$ es $P = 10$, compra hasta $Q = 1000$.

**Total consumido:** $Q^* = 1000$ kWh.

**EC tramo 1** (0 a 500, paga 5):
$$EC_1 = \int_0^{500} \left(20 - \frac{Q}{100} - 5\right) dQ = \int_0^{500} \left(15 - \frac{Q}{100}\right) dQ = \left[15Q - \frac{Q^2}{200}\right]_0^{500} = 7500 - 1250 = 6250 \text{ ctvos}$$

**EC tramo 2** (500 a 1000, paga 10):
$$EC_2 = \int_{500}^{1000} \left(20 - \frac{Q}{100} - 10\right) dQ = \int_{500}^{1000} \left(10 - \frac{Q}{100}\right) dQ = \left[10Q - \frac{Q^2}{200}\right]_{500}^{1000} = 5000 - 3750 = 1250 \text{ ctvos}$$

$$\boxed{EC_{total} = 6250 + 1250 = 7500 \text{ ctvos} = \$75}$$

**Interpretación.** La tarifa creciente (en bloques) reduce el EC respecto a un único precio bajo, pero permite que Eduardo siga consumiendo lo mismo que con $P = 10$ uniforme, aunque pagando más en total. Es una forma de **discriminación de 2º grado** que sirve para incentivar el ahorro y, simultáneamente, capturar parte del EC. Ver [[conceptos/discriminacion-precios]].

![[gp2-ej3c-tarifa-escalonada.svg]]

---

## Ej 4 — Subsidio al productor vs. al consumidor

**Datos.** Demanda: $P = 100 - x$ (o $x = 100 - P$). Oferta: $P = 10 + 9x$ (o $x = (P-10)/9$). Subsidio $s = 5$.

### a) Equilibrio inicial (sin subsidio)

$100 - x = 10 + 9x \Rightarrow 90 = 10x \Rightarrow \boxed{x^* = 9, \; P^* = 91}$

### b) Plan A: subsidio $\$5$ al productor

El precio que recibe el vendedor es $P_v = P_c + s$, donde $P_c$ es lo que paga el consumidor. La oferta efectiva (ofrecida al precio que paga el consumidor) baja en $s$:
$$P_c = (10 - 5) + 9x = 5 + 9x$$

Equilibrio: $100 - x = 5 + 9x \Rightarrow 95 = 10x \Rightarrow x = 9{,}5$.

- $P_c = 100 - 9{,}5 = 90{,}5$ → consumidor paga **menos** ($-0{,}5$ vs. 91)
- $P_v = P_c + s = 95{,}5$ → productor recibe **más** ($+4{,}5$ vs. 91)

### c) Plan B: subsidio $\$5$ al consumidor

Ahora el consumidor recibe $s$ por cada unidad. Su demanda en función del precio que paga al vendedor sube en $s$:
$$x = 100 - (P_v - s) = 105 - P_v$$

Equilibrio: $105 - P_v = (P_v - 10)/9 \Rightarrow 9(105 - P_v) = P_v - 10 \Rightarrow 955 = 10 P_v \Rightarrow P_v = 95{,}5$.

- $P_v = 95{,}5$ → productor recibe lo mismo que en Plan A
- $P_c$ efectivo = $P_v - s = 90{,}5$ → consumidor paga lo mismo que en Plan A
- $x = 9{,}5$ → misma cantidad

### Conclusión: **equivalencia de los planes**

| Variable | Sin subsidio | Plan A | Plan B |
|----------|--------------|--------|--------|
| Cantidad | 9 | 9,5 | 9,5 |
| Precio consumidor | 91 | 90,5 | 90,5 |
| Precio productor | 91 | 95,5 | 95,5 |

Ambos planes son **idénticos** en sus efectos reales. La incidencia depende sólo de las **elasticidades relativas**, no de a quién se entregue formalmente el subsidio.

**Reparto del subsidio:**
- Consumidor absorbe $\$0{,}5$ (10% del subsidio)
- Productor absorbe $\$4{,}5$ (90% del subsidio)

Como la oferta es mucho más inelástica que la demanda (pendientes 9 vs. 1 → la oferta es 9× menos elástica), el productor se queda con la mayor parte. Ver [[conceptos/incidencia-impuestos]] (la lógica es simétrica para subsidios).

---

## Ej 5 — Subvención vs. precio máximo (libros de Becker)

**Datos.** $D(p) = 1000 - 10p$. 100 librerías idénticas con $S_i(p) = -5 + 0{,}2p$.

### a) Oferta de mercado y equilibrio competitivo

$$S(p) = 100 \times S_i(p) = 100(-5 + 0{,}2p) = -500 + 20p \quad (\text{para } p \geq 25)$$

Equilibrio: $1000 - 10p = -500 + 20p \Rightarrow 1500 = 30p \Rightarrow \boxed{p^* = 50, \; Q^* = 500}$.

### b) Subvención para alcanzar 700 ejemplares

Buscamos $s$ tal que en el nuevo equilibrio $Q = 700$.

- ¿A qué precio el consumidor demanda 700? $700 = 1000 - 10 p_d \Rightarrow p_d = 30$.
- ¿A qué precio el vendedor ofrece 700? $700 = -500 + 20 p_o \Rightarrow p_o = 60$.

$$\boxed{s = p_o - p_d = 60 - 30 = \$30 \text{ por ejemplar}}$$

Costo fiscal total: $s \times Q = 30 \times 700 = \$21.000$.

### c) Precio máximo de $\$30$

Como $\$30 < p^* = 50$, el tope **es efectivo**. Cantidades a $P = 30$:

- $Q_d(30) = 1000 - 300 = 700$
- $Q_s(30) = -500 + 600 = 100$
- **Escasez:** $700 - 100 = 600$ ejemplares insatisfechos

**Efecto sobre la piratería.** El precio máximo **agrava el problema**: hay 600 alumnos que demandan el libro a $\$30$ pero no lo encuentran. Estos alumnos terminan recurriendo aún más a la fotocopia. La regulación logra el efecto **opuesto** al deseado.

**Comparación.** La subvención (b) es más efectiva: ataca el problema de raíz (precio efectivo bajo + cantidad alta). El precio máximo (c) crea escasez y empuja a los alumnos al mercado paralelo. Ver [[conceptos/controles-de-precios]].

![[gp2-ej5-libros.svg]]

---

## Ej 6 — Comercio internacional con arancel/impuesto

**Datos.** $D(p_d) = 280 - 6 p_d$ (válida si $p_d \leq 46{,}67$); $S(p_o) = 4 p_o$; oferta internacional infinita a $p_i = 10$.

> Demanda inversa: $p_d = 46{,}67 - x_d/6$. Intercept con eje vertical = $46{,}67$. Oferta inversa: $p_o = x_o/4$.

### a) Libre comercio (sin intervención)

Con oferta internacional infinita a $p_i = 10$, el precio interno no puede superar 10:
$$p_o = p_d = 10$$
- $x_d = 280 - 60 = 220$
- $x_o = 4 \times 10 = 40$
- **Importaciones** $= x_d - x_o = 180$
- Gasto consumidores $= 220 \times 10 = 2200$
- Ingreso productores nacionales $= 40 \times 10 = 400$

### b) Autarquía (prohibición total de importar)

$280 - 6p = 4p \Rightarrow 280 = 10p \Rightarrow p_d = p_o = 28$.
- $x_d = x_o = 4 \times 28 = 112$, importaciones $= 0$
- Gasto $= 112 \times 28 = 3136$
- Ingreso $= 112 \times 28 = 3136$

### c) Impuesto $t = 10$ general (a toda unidad comprada)

El consumidor paga $p_d$ (incluye impuesto), el productor (nacional o extranjero) recibe $p_d - 10$.

Para que no se desplace toda la compra a importados ni a nacionales, el productor nacional debe poder competir: $p_o = p_i = 10$. El consumidor paga $p_d = p_o + t = 20$.

- $x_d = 280 - 6(20) = 160$
- $x_o = 4(10) = 40$
- Importaciones $= 120$
- Gasto $= 160 \times 20 = 3200$
- Ingreso productores $= 40 \times 10 = 400$
- **Recaudación estado** $= 160 \times 10 = 1600$

### d) Arancel $a = 10$ solo a importados

Si compra importado: paga $p_i + a = 20$.
Si compra nacional: paga $p_o$ (sin arancel).

En equilibrio, $p_o = 20$ (el productor nacional aprovecha el arancel para subir su precio hasta el de importados).

- $x_d = 280 - 6(20) = 160$
- $x_o = 4(20) = 80$
- Importaciones $= 80$
- Gasto $= 160 \times 20 = 3200$
- Ingreso productores nacionales $= 80 \times 20 = 1600$
- **Recaudación estado** $= 80 \times 10 = 800$

### e) Ranking de excedentes

EC (consumidores): $EC = \tfrac{1}{2}(46{,}67 - p_d) \cdot x_d$. EP (productores): $EP = \tfrac{1}{2} \cdot p_o \cdot x_o$.

| Escenario | $p_d$ | $p_o$ | $x_d$ | $x_o$ | EC | EP |
|-----------|-------|-------|-------|-------|----|----|
| a) Libre comercio | 10 | 10 | 220 | 40 | **4033** | 200 |
| b) Autarquía | 28 | 28 | 112 | 112 | 1045 | **1568** |
| c) Impuesto | 20 | 10 | 160 | 40 | 2133 | 200 |
| d) Arancel | 20 | 20 | 160 | 80 | 2133 | 800 |

**Ranking EC (mejor → peor):** Libre comercio (4033) > Impuesto = Arancel (2133) > Autarquía (1045)

**Ranking EP nacional (mejor → peor):** Autarquía (1568) > Arancel (800) > Libre comercio = Impuesto (200)

**Lectura.** Libre comercio favorece al consumidor; autarquía protege al productor. El arancel es una herramienta intermedia que favorece **simultáneamente** al productor y al estado, a costa del consumidor. El impuesto general no protege al productor (no le da ventaja relativa), pero recauda más que el arancel.

![[gp2-ej6-comercio.svg]]

---

## Ej 7 — Producto Total, Medio y Marginal (tabla)

**Datos parciales.**

| $L$ | $K$ | $PT$ | $PMe$ | $PMg$ |
|-----|-----|------|-------|-------|
| 3 | 8 | 33 | ? | — |
| 4 | 8 | ? | 9 | ? |
| 5 | 8 | ? | ? | 4 |
| 6 | 8 | ? | 7,5 | 5 |

**Cálculos.** Uso $PMe(L) = PT(L)/L$ y $PMg(L) = PT(L) - PT(L-1)$.

- $L=3$: $PMe = 33/3 = 11$. $PMg$ no se puede calcular sin $PT(2)$.
- $L=4$: $PT = 4 \times 9 = 36$. $PMg = 36 - 33 = 3$.
- $L=5$: $PT = PT(4) + PMg = 36 + 4 = 40$. $PMe = 40/5 = 8$.
- $L=6$: $PT = 6 \times 7{,}5 = 45$. Verifica con $PMg$: $40 + 5 = 45$ ✓.

**Cuadro completo:**

| $L$ | $K$ | $PT$ | $PMe$ | $PMg$ |
|-----|-----|------|-------|-------|
| 3 | 8 | 33 | 11,00 | — |
| 4 | 8 | 36 | 9,00 | 3 |
| 5 | 8 | 40 | 8,00 | 4 |
| 6 | 8 | 45 | 7,50 | 5 |

**Lectura.** $PT$ es creciente. $PMe$ está disminuyendo (de 11 a 7,5) y $PMg$ está creciendo (de 3 a 5) pero **siempre por debajo de $PMe$**. Estamos en la **Etapa II** de la producción (PMe decreciente, PMg < PMe pero positivo). Si los datos siguieran, eventualmente PMg tocaría el cero (frontera Etapa II / III). Ver [[conceptos/etapas-produccion]].

![[gp2-ej7-pt-pme-pmg.svg]]

---

## Ej 8 — Funciones algebraicas $PMe$ y $PMg$

**Datos.** $K = 100$ (fijo). $Q = -50 + 10L - 0{,}22 L^2$.

### a) Funciones de PMg y PMe

$$PMg(L) = \frac{dQ}{dL} = 10 - 0{,}44 L$$

$$PMe(L) = \frac{Q}{L} = -\frac{50}{L} + 10 - 0{,}22 L$$

### b) PMe en $L = 10$ a $70$ (descripción)

| $L$ | $PMe$ |
|-----|-------|
| 10 | $-5 + 10 - 2{,}2 = 2{,}80$ |
| 15 | $-3{,}33 + 10 - 3{,}30 = 3{,}37$ ← cercano al máximo |
| 20 | $-2{,}50 + 10 - 4{,}40 = 3{,}10$ |
| 30 | $-1{,}67 + 10 - 6{,}60 = 1{,}73$ |
| 50 | $-1{,}00 + 10 - 11{,}00 = -2{,}00$ ← negativo |
| 70 | $-0{,}71 + 10 - 15{,}40 = -6{,}11$ |

La curva es campana invertida: crece, alcanza máximo, decrece y se vuelve negativa.

### c) Nivel de $L$ donde $PMe$ es máximo

En el máximo de $PMe$: $PMe = PMg$ (regla universal de relación promedio-marginal).

$$-\frac{50}{L} + 10 - 0{,}22 L = 10 - 0{,}44 L$$
$$-\frac{50}{L} + 0{,}22 L = 0$$
$$0{,}22 L = \frac{50}{L} \Rightarrow L^2 = \frac{50}{0{,}22} = 227{,}27$$
$$\boxed{L^* = \sqrt{227{,}27} \approx 15{,}08}$$

PMg en ese punto = $10 - 0{,}44(15{,}08) = 10 - 6{,}64 = 3{,}36$. Verifico PMe: $-50/15{,}08 + 10 - 0{,}22(15{,}08) = -3{,}32 + 10 - 3{,}32 = 3{,}36$ ✓.

**Interpretación.** $L^* \approx 15$ marca la **frontera entre Etapa I y Etapa II**. Por debajo, PMg > PMe (ineficiente sub-utilización del capital). Por encima, PMg < PMe (zona racional de operación).

---

## Ej 9 — Cuadro de costos

**Datos parciales.**

| $Q$ | $CF$ | $CV$ | $CT$ | $CVMe$ | $CTMe$ | $CMg$ |
|-----|------|------|------|--------|--------|-------|
| 13 | 1125 | 975 | ? | ? | ? | — |
| 14 | ? | 1120 | ? | ? | ? | ? |
| 15 | ? | 1275 | ? | ? | ? | ? |
| 16 | ? | ? | ? | 90 | ? | ? |
| 17 | ? | ? | ? | 95 | ? | ? |

**Clave: $CF$ es constante = 1125** (no depende de Q en CP).

Para Q = 16: $CV = 16 \times 90 = 1440$. Para Q = 17: $CV = 17 \times 95 = 1615$.

$CT = CF + CV$. $CTMe = CT/Q$. $CMg(Q) = CT(Q) - CT(Q-1)$.

| $Q$ | $CF$ | $CV$ | $CT$ | $CVMe$ | $CTMe$ | $CMg$ |
|-----|------|------|------|--------|--------|-------|
| 13 | 1125 | 975 | 2100 | 75,00 | 161,54 | — |
| 14 | 1125 | 1120 | 2245 | 80,00 | 160,36 | 145 |
| 15 | 1125 | 1275 | **2400** | 85,00 | **160,00** | 155 |
| 16 | 1125 | 1440 | 2565 | 90,00 | 160,31 | 165 |
| 17 | 1125 | 1615 | 2740 | 95,00 | 161,18 | 175 |

**Lecturas clave.**

- **$CTMe$ mínimo en Q = 15** (160,00). Antes decrece, después crece (forma de U).
- $CMg$ es **creciente** (145 → 175), reflejo de rendimientos marginales decrecientes.
- $CMg$ cruza $CTMe$ entre $Q = 15$ y $Q = 16$: en $Q=15$ $CMg(155) < CTMe(160)$ → CMg "tira" para abajo a CTMe; en $Q=16$ $CMg(165) > CTMe(160{,}31)$ → CMg empuja para arriba. Consistente con la regla "CMg corta a CTMe en su mínimo".
- $CVMe$ creciente todo el rango → ya estamos a la derecha del mínimo de CVMe (típico de la zona relevante de oferta).

Ver [[conceptos/curvas-costos]] y [[conceptos/costo-marginal]].

![[gp2-ej9-costos-familia.svg]]

---

## Ej 10 — Costos de corto plazo (palos de golf)

**Datos.** $Q = 2(KL)^{1/2}$, $K = 100$ (fijo), $r = 1$, $w = 4$.

### Despeje de $L(Q)$

Con $K = 100$:
$$Q = 2(100 L)^{1/2} = 2 \cdot 10 \cdot L^{1/2} = 20 L^{1/2} \;\Rightarrow\; L = \frac{Q^2}{400}$$

### a) $CT(Q)$ y $CMe(Q)$

$$CT = wL + rK = 4 \cdot \frac{Q^2}{400} + 1 \cdot 100 = \boxed{\frac{Q^2}{100} + 100}$$

Donde $CF = 100$ y $CV = Q^2/100$.

$$CMe(Q) = \frac{CT}{Q} = \frac{Q}{100} + \frac{100}{Q}$$

### b) $CMg(Q)$

$$CMg(Q) = \frac{dCT}{dQ} = \frac{2Q}{100} = \boxed{\frac{Q}{50}}$$

### c) Punto de corte $CMg = CMe$

$$\frac{Q}{50} = \frac{Q}{100} + \frac{100}{Q}$$
$$\frac{Q}{50} - \frac{Q}{100} = \frac{100}{Q}$$
$$\frac{Q}{100} = \frac{100}{Q} \Rightarrow Q^2 = 10000 \Rightarrow \boxed{Q^* = 100}$$

En ese punto: $CMg = 100/50 = 2$, $CMe = 1 + 1 = 2$ ✓.

**Interpretación.** $Q^* = 100$ es la **escala eficiente** de la planta (mínimo de $CMe$ en CP). Por debajo, hay sub-utilización de capital. Por encima, los rendimientos decrecientes encarecen la producción. Ver [[conceptos/escala-eficiente-minima]].

![[gp2-ej10-palos-golf.svg]]

---

## Conceptos que ejercita la guía

- [[conceptos/excedente-consumidor]] — agregación, áreas bajo demanda, tarifas
- [[conceptos/elasticidad-precio-demanda]] — relación con ingreso total
- [[conceptos/discriminacion-precios]] — tarifas escalonadas (2º grado)
- [[conceptos/incidencia-impuestos]] — equivalencia subsidios productor/consumidor
- [[conceptos/controles-de-precios]] — precio máximo y subvenciones
- [[conceptos/funcion-produccion]] — PT, PMe, PMg
- [[conceptos/etapas-produccion]] — Etapa I (PMg > PMe), II (PMe decreciente), III (PMg < 0)
- [[conceptos/rendimientos-marginales-decrecientes]]
- [[conceptos/curvas-costos]] — CF, CV, CMe, CMg en U
- [[conceptos/escala-eficiente-minima]] — mínimo de CMe en CP

## Errores frecuentes detectados al resolver

1. **Sumar verticalmente las demandas** (Ej 1): siempre **horizontal** y por tramos según precios de corte.
2. **Confundir DAP por la enésima unidad con DAP total** (Ej 2): la 2da hora vale 17, pero la DAP por 2 horas es 24 + 17 = 41.
3. **Aplicar el subsidio sólo al lado al que se entrega** (Ej 4): no, ambos planes son equivalentes; lo que importa son las elasticidades.
4. **Olvidar que $CF$ es constante** (Ej 9): completar el cuadro asumiendo $CF$ varía con $Q$ es un error típico.
5. **Recordar que $CMg$ corta a $CMe$ y a $CVMe$ en sus respectivos mínimos** (Ej 10): regla universal de promedio-marginal.

## Ver también

- [[formulas/unidad-01]], [[formulas/unidad-02]]
- [[unidades/unidad-02-produccion-y-costos]]
- [[ejercicios/gp1-microeconomia]] — guía previa de Unidad 1
- [[ejercicios/guia-2-resoluciones]] — más resoluciones de Unidad 1
