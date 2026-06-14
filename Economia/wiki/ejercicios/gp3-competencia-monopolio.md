---
unit: 03-04
source: GP3_ePI_2026.pdf
tipo: guia-practica
last_updated: 2026-04-28
---

# GP N°3 — Competencia Perfecta, Monopolio y Regulación

> Resolución completa paso a paso. Mezcla **Unidad 3** (Ej 1-4: CP, oferta, equilibrio CP/LP) y **Unidad 4** (Ej 5-10: monopolio, regulación, discriminación).

---

# Parte I — Unidad 3 (Competencia Perfecta)

## Ej 1 — Decisión de producción en CP

**Datos.**
- En $Q = 200$ u/mes: $CMg = CTMe = \$10$, $CF = \$500$.
- En $Q = 150$ u/mes: $CMg = CVMe = \$6$.
- Precio de mercado: $P = \$8$.

**Identificar referencias clave.**

- $CMg = CTMe$ en $Q = 200$ → **mínimo de $CTMe$**, es decir umbral de rentabilidad: $P_{UR} = 10$.
- $CMg = CVMe$ en $Q = 150$ → **mínimo de $CVMe$**, es decir punto de cierre: $P_{cierre} = 6$.

**Análisis del precio.** $P_{cierre} = 6 < P = 8 < P_{UR} = 10$.

→ La empresa **debe seguir produciendo** (P cubre el CVMe), pero con **pérdida** (P < CTMe). Cerrar implicaría perder los $\$500$ de CF; producir implica perder algo menor.

**¿Cuánto producir?** En CP, la regla óptima es $CMg = P$. Asumiendo $CMg$ lineal entre los puntos conocidos:
$$CMg(Q) = 6 + \frac{10-6}{200-150}(Q - 150) = 6 + 0{,}08(Q - 150)$$

$CMg = 8 \Rightarrow 0{,}08(Q - 150) = 2 \Rightarrow Q^* = 175$.

**Decisión final.** **Reducir Q de 200 a 175** (donde $CMg = P$). La pérdida será menor que cerrar, porque cubre todo el CVMe y parte del CF. Ver [[conceptos/punto-cierre]] y [[conceptos/umbral-rentabilidad]].

![[gp3-ej1-decision-cp.svg]]

---

## Ej 2 — Oferta de mercado de CP (8 empresas heterogéneas)

**Datos.**
- 5 empresas tipo **A**: $CMg = 5q$, $CVMe_{min} = 15$.
- 3 empresas tipo **B**: $CMg = 4q$, $CVMe_{min} = 20$.

**Oferta individual (despeje $q(P)$ de $P = CMg$):**

- Tipo A: $P = 5q \Rightarrow q_A = P/5$, válida si $P \geq 15$.
- Tipo B: $P = 4q \Rightarrow q_B = P/4$, válida si $P \geq 20$.

**Oferta agregada por tramos:**

$$Q_M(P) = \begin{cases} 0 & \text{si } P < 15 \\ 5 \cdot (P/5) = P & \text{si } 15 \leq P < 20 \quad (\text{solo A activas}) \\ 5(P/5) + 3(P/4) = P + \tfrac{3P}{4} = \tfrac{7P}{4} & \text{si } P \geq 20 \quad (\text{ambas activas}) \end{cases}$$

**Quiebres en la curva:** $(P=15, Q=15)$ y $(P=20, Q=20 + 15 = 35)$. La curva tiene **dos quiebres** porque cada tipo de empresa entra a operar a su propio precio de cierre.

![[gp3-ej2-oferta-agregada.svg]]

---

## Ej 3 — Impuesto por unidad en CP (LP)

**Datos.** $C(q) = 300 + 5q + 3q^2$. $CMg = 5 + 6q$. $CTMe_{min} = 65$ en $q = 10$. Impuesto $t = \$15/u$.

**Verificación inicial.** $CTMe(10) = 300/10 + 5 + 3(10) = 30 + 5 + 30 = 65$ ✓. $CMg(10) = 5 + 60 = 65$ ✓ (intersección en mínimo de CTMe).

### a) Nuevo $CMg$

El impuesto por unidad se suma al CT: $C_{new}(q) = C(q) + t \cdot q = 300 + (5+15)q + 3q^2 = 300 + 20q + 3q^2$.

$$\boxed{CMg_{new}(q) = 20 + 6q}$$

(La curva $CMg$ se desplaza verticalmente hacia arriba en $\$15$.)

### b) Nuevo $CTMe_{min}$

$$CTMe_{new}(q) = \frac{300}{q} + 20 + 3q$$

Mínimo: $\dfrac{d(CTMe)}{dq} = -\dfrac{300}{q^2} + 3 = 0 \Rightarrow q^2 = 100 \Rightarrow q = 10$.

$$CTMe_{min}^{new} = 30 + 20 + 30 = \boxed{\$80} \quad (\text{aumenta exactamente en } t = 15)$$

El nivel óptimo $q = 10$ no cambia (porque el impuesto unitario es equivalente a un costo variable lineal).

### c) Curvas de oferta (LP, $P \geq CTMe_{min}$)

- **Original:** $P = CMg \Rightarrow q = (P - 5)/6$, válida para $P \geq 65$.
- **Con impuesto:** $q = (P - 20)/6$, válida para $P \geq 80$.

La nueva oferta está desplazada **verticalmente hacia arriba en $\$15$** (igual al impuesto). Ver [[conceptos/incidencia-impuestos]].

---

## Ej 4 — Industria CP con 100 empresas

**Datos.** $C(q) = 2q^2 + 6q + 18$, $CMg = 4q + 6$.

> $CV = 2q^2 + 6q$, $CF = 18$. $CVMe = 2q + 6$ (creciente), $CTMe = 2q + 6 + 18/q$.

### a) Oferta CP de la industria (100 empresas)

Empresa: $P = CMg = 4q + 6 \Rightarrow q = (P-6)/4$.

$CVMe(q)$ tiene mínimo en $q = 0$ con valor 6 (límite). Empresa produce si $P \geq 6$.

$$Q_{ind}(P) = 100 \cdot \frac{P - 6}{4} = 25P - 150 \quad (P \geq 6)$$

### b) Oferta LP con costos constantes (libre entrada)

$P_{LP} = CTMe_{min}$. Mínimo de $CTMe$:
$$\frac{d}{dq}\left(2q + 6 + \frac{18}{q}\right) = 2 - \frac{18}{q^2} = 0 \Rightarrow q = 3$$
$$CTMe_{min} = CTMe(3) = 6 + 6 + 6 = 18$$

**Oferta LP:** horizontal en $P_{LP} = 18$. Cada empresa produce $q = 3$. Cantidad total ajustada por entrada/salida.

### c) Equilibrio LP con $Q_d = 660 - 20P$

$P_{LP} = 18 \Rightarrow Q = 660 - 20(18) = 300$. Empresas $= Q/q = 300/3 = \boxed{100}$ (consistente con el supuesto inicial).

### d) CP con shock de demanda: $Q_d = 840 - 20P$, mismas 100 empresas

Equilibrio CP entre $Q_d$ y oferta CP:
$$840 - 20P = 25P - 150 \Rightarrow 990 = 45P \Rightarrow \boxed{P = 22, \; Q = 400}$$

Por empresa: $q = 400/100 = 4$. Verifico: $CMg(4) = 4(4) + 6 = 22$ ✓.

**Beneficio empresa:**
$$\pi = P \cdot q - C(q) = 22 \cdot 4 - (2 \cdot 16 + 6 \cdot 4 + 18) = 88 - 74 = \boxed{14}$$

Total industria: $14 \times 100 = 1400$. **Beneficios extraordinarios** atraerán entrada.

### e) LP tras la entrada

Como hay $\pi > 0$, entran empresas hasta que $\pi = 0 \Rightarrow P$ vuelve a $P_{LP} = 18$.

$Q_{LP} = 840 - 20(18) = 480$. Empresas $= 480/3 = \boxed{160}$ (entraron 60 nuevas).

Por empresa: $q = 3$, $\pi = 0$ (beneficio normal).

**Lectura.** En LP el shock positivo de demanda se traduce **íntegramente en mayor cantidad** y **mayor número de empresas**, pero **no** en precio mayor (industria de costos constantes). Ver [[conceptos/equilibrio-corto-vs-largo-plazo]].

![[gp3-ej4-cp-shock-demanda.svg]]

---

# Parte II — Unidad 4 (Monopolio y Regulación)

## Ej 5 — Monopolio simple

**Datos.** $Q_d = 1000{,}875 - p/4$. $C(Q) = Q^2/4 + 1000$.

**Demanda inversa:** $p = 4(1000{,}875 - Q) = 4003{,}5 - 4Q$.

**Funciones marginales.**
$$I(Q) = p \cdot Q = (4003{,}5 - 4Q)Q \;\Rightarrow\; IMg = 4003{,}5 - 8Q$$
$$CMg = \frac{dC}{dQ} = \frac{Q}{2}$$

### a) Cantidad óptima ($IMg = CMg$)

$$4003{,}5 - 8Q = \frac{Q}{2} \;\Rightarrow\; 4003{,}5 = \frac{17Q}{2} \;\Rightarrow\; \boxed{Q^* = \frac{8007}{17} = 471}$$

### b) Precio óptimo

$$P^* = 4003{,}5 - 4(471) = \boxed{2119{,}5}$$

### c) Beneficio

$$I = P^* \cdot Q^* = 2119{,}5 \cdot 471 = 998.284{,}5$$
$$C(Q^*) = \frac{471^2}{4} + 1000 = 55.460{,}25 + 1000 = 56.460{,}25$$
$$\boxed{\pi = 998.284{,}5 - 56.460{,}25 = 941.824{,}25}$$

> Las magnitudes son grandes por el intercept de la demanda ($\approx 4000$). La metodología es la estándar de monopolio: $IMg = CMg$, sustituir en demanda. Ver [[conceptos/ingreso-marginal-monopolio]].

![[gp3-ej5-monopolio-simple.svg]]

---

## Ej 6 — Monopolio con función de producción

**Datos.** $q(K, L) = L^{1/2} K^{1/4}$. Demanda $q = 80 - p$. $w = 2$, $r = 4$, $\bar{K} = 2$.

### Despeje de $L(q)$ con $K = 2$

$$q = L^{1/2} \cdot 2^{1/4} \;\Rightarrow\; L^{1/2} = \frac{q}{2^{1/4}} \;\Rightarrow\; L = \frac{q^2}{\sqrt{2}}$$

### Función de costos y CMg

$$CT = wL + r\bar{K} = 2 \cdot \frac{q^2}{\sqrt{2}} + 4 \cdot 2 = q^2 \sqrt{2} + 8 \approx 1{,}414 \, q^2 + 8$$
$$CMg = \frac{dCT}{dq} = 2q\sqrt{2} \approx 2{,}828 \, q$$

### a) Equilibrio CP del monopolista ($IMg = CMg$)

Demanda inversa: $p = 80 - q \Rightarrow IMg = 80 - 2q$.

$$80 - 2q = 2q\sqrt{2} \;\Rightarrow\; 80 = 2q(1 + \sqrt{2}) \;\Rightarrow\; q_M = \frac{40}{1 + \sqrt{2}} = 40(\sqrt{2} - 1) \approx 16{,}57$$

$$p_M = 80 - 16{,}57 \approx 63{,}43$$

$$\pi_M = p_M \cdot q_M - CT(q_M) = 63{,}43 \cdot 16{,}57 - (1{,}414 \cdot 16{,}57^2 + 8) \approx 1051 - 396 \approx 655$$

### b) Demanda de $L$ que maximiza beneficio

$$L_M = \frac{q_M^2}{\sqrt{2}} = \frac{16{,}57^2}{1{,}414} \approx 194{,}2$$

### c) EC y comparación con CP

**Equilibrio CP** (P = CMg, suponiendo misma estructura de costos):
$$80 - q = 2q\sqrt{2} \;\Rightarrow\; q_{CP} = \frac{80}{1 + 2\sqrt{2}} \approx 20{,}90$$
$$p_{CP} = 80 - 20{,}90 \approx 59{,}10$$

**Excedentes (EC = triángulo bajo demanda):**

$$EC_M = \tfrac{1}{2}(80 - p_M) \cdot q_M = \tfrac{1}{2}(16{,}57)(16{,}57) \approx 137{,}3$$
$$EC_{CP} = \tfrac{1}{2}(80 - p_{CP}) \cdot q_{CP} = \tfrac{1}{2}(20{,}90)(20{,}90) \approx 218{,}4$$

**Pérdida de bienestar para el consumidor:**
$$\Delta EC = EC_{CP} - EC_M \approx 218{,}4 - 137{,}3 = \boxed{81{,}1}$$

### d) Pérdida social (DWL)

Triángulo entre demanda y CMg, desde $q_M$ hasta $q_{CP}$. En $q_M$: $CMg(16{,}57) = 2(16{,}57)\sqrt{2} \approx 46{,}86$.

$$DWL = \tfrac{1}{2}(q_{CP} - q_M)(p_M - CMg(q_M)) = \tfrac{1}{2}(4{,}33)(16{,}57) \approx \boxed{35{,}9}$$

Ver [[conceptos/deadweight-loss]].

---

## Ej 7 — Regulación eléctrica (precio = CTMe)

**Datos.** $Q = 200 - 2P$, $CTMe = 70 - 0{,}25Q$, $CMg = 60 - 0{,}25Q$.

**Objetivo regulatorio.** Maximizar EC sujeto a equilibrio económico ($\pi \geq 0$). El "second best" estándar es $P_{reg} = CTMe$ (la empresa cubre exactamente sus costos, no requiere subsidio, no genera beneficios extraordinarios).

**Ecuación.** Demanda inversa: $P = 100 - Q/2$.
$$P = CTMe \;\Rightarrow\; 100 - \tfrac{Q}{2} = 70 - 0{,}25 Q \;\Rightarrow\; 30 = 0{,}25 Q$$
$$\boxed{Q_{reg} = 120, \; P_{reg} = 100 - 60 = \$40}$$

**Verificación.** $CTMe(120) = 70 - 30 = 40$ ✓. $CMg(120) = 60 - 30 = 30 < P_{reg} = 40$ → la empresa cubre costos sin necesidad de subsidio.

**Comparación de regímenes:**

| Régimen | $Q$ | $P$ | Comentario |
|---------|-----|-----|------------|
| First best ($P = CMg$) | 160 | 20 | Maximiza bienestar, pero $P < CTMe$ → empresa pierde, requiere subsidio |
| **Second best ($P = CTMe$)** | **120** | **40** | EC máximo sin subsidio |
| Monopolio sin regular ($IMg = CMg$) | 53,3 | 73,3 | Mínimo EC, máximo beneficio |

**Lectura.** Como esta empresa exhibe **economías de escala persistentes** ($CTMe$ decreciente → $CMg < CTMe$ siempre), un precio igual al costo marginal generaría pérdidas inviables. La solución regulatoria estándar para **monopolios naturales** es fijar $P = CTMe$. Ver [[conceptos/monopolio-natural]] y [[conceptos/regulacion-monopolio]].

![[gp3-ej7-regulacion-monopolio-natural.svg]]

---

## Ej 8 — Mercado de guantes: CP vs. Monopolio + impuesto

**Datos.** $Q = 1400 - 50P$, $CTMe_{LP} = \$8$ (constante).

> $CTMe$ constante $\Rightarrow CMg = CTMe = 8$. Industria de costos constantes.

### a) CP sin impuesto

En LP con costos constantes: $P = CTMe = \boxed{\$8}$.
$Q = 1400 - 400 = \boxed{1000}$.

### b) CP con impuesto $\$12/u$

La oferta horizontal en $CTMe$ se traduce en oferta horizontal en $CTMe + t = \$20$. El consumidor paga todo el impuesto (porque la oferta es perfectamente elástica).

$P_v = 8$ (recibe el productor), $P_d = 20$ (paga el consumidor).
$Q = 1400 - 50(20) = \boxed{400}$.

### c) Monopolio sin impuesto

Demanda inversa: $P = 28 - Q/50$.
$IMg = 28 - 2Q/50 = 28 - Q/25$.
$CMg = 8$.

$$IMg = CMg \;\Rightarrow\; 28 - \frac{Q}{25} = 8 \;\Rightarrow\; \boxed{Q_M = 500, \; P_M = 18}$$

### d) Monopolio con impuesto $\$12/u$

Nuevo $CMg = 8 + 12 = 20$.
$$28 - \frac{Q}{25} = 20 \;\Rightarrow\; Q = 200, \; P = 28 - 8 = \boxed{24}$$

**Comparación de incidencia.**

| Régimen | $\Delta P$ del consumidor | $\Delta P$ del productor | Traslado al consumidor |
|---------|---------------------------|--------------------------|------------------------|
| CP | $20 - 8 = +12$ | $0$ | **100%** |
| Monopolio | $24 - 18 = +6$ | $-6$ (recibe 12 menos por unidad) | **50%** |

**Lectura sorprendente.** En **monopolio** el consumidor paga **menos** del impuesto (50%) que en CP (100%), porque al monopolio no le conviene trasladar todo el impuesto: perdería demasiada cantidad. En cambio, el productor monopolista absorbe la otra mitad. Esto es contraintuitivo pero refleja que la curva de demanda relevante para el monopolio (curva de demanda completa) es mucho más elástica en términos relativos que la oferta CP horizontal.

Ver [[conceptos/incidencia-impuestos]].

---

## Ej 9 — NStar regulada (eléctrica)

**Datos.** $P = 6 - Q$. $CMg = 1{,}25 + 0{,}75Q$. ($Q$ en millones de kWh, $P$ en ctvos/kWh.)

> Asumimos que no hay $CF$ relevante (sólo $CV$ definido por la integral de $CMg$): $CT = 1{,}25 Q + 0{,}375 Q^2$.

### a) Bajo regulación: $P = CMg$

$$6 - Q = 1{,}25 + 0{,}75 Q \;\Rightarrow\; 4{,}75 = 1{,}75 Q \;\Rightarrow\; \boxed{Q_R = \tfrac{19}{7} \approx 2{,}71, \; P_R = \tfrac{23}{7} \approx 3{,}29}$$

**Excedentes:**
$$EC_R = \tfrac{1}{2}(6 - P_R) \cdot Q_R = \tfrac{1}{2}(2{,}71)(2{,}71) \approx 3{,}68$$

$EP$ con $CMg$ creciente lineal (área entre $P$ y $CMg$):
$$EP_R = \tfrac{1}{2}(P_R - CMg(0)) \cdot Q_R = \tfrac{1}{2}(3{,}29 - 1{,}25)(2{,}71) = \tfrac{1}{2}(2{,}04)(2{,}71) \approx 2{,}76$$

### b) Como monopolista ($IMg = CMg$)

$IMg = 6 - 2Q$.
$$6 - 2Q = 1{,}25 + 0{,}75 Q \;\Rightarrow\; 4{,}75 = 2{,}75 Q \;\Rightarrow\; \boxed{Q_M = \tfrac{19}{11} \approx 1{,}73, \; P_M = \tfrac{47}{11} \approx 4{,}27}$$

$$EC_M = \tfrac{1}{2}(6 - 4{,}27)(1{,}73) \approx \tfrac{1}{2}(1{,}73)(1{,}73) \approx 1{,}49$$

$EP$ del monopolio (rectángulo entre $P_M$ y $CMg$, desde 0 a $Q_M$, restando que $CMg$ es creciente):
$$EP_M = \int_0^{1{,}73} (P_M - CMg(Q)) dQ = \int_0^{1{,}73} (4{,}27 - 1{,}25 - 0{,}75Q) dQ$$
$$= [3{,}02 Q - 0{,}375 Q^2]_0^{1{,}73} = 5{,}22 - 1{,}12 \approx 4{,}10$$

### c) DWL del monopolio

Triángulo entre demanda y $CMg$, de $Q_M$ a $Q_R$. En $Q_M$: $CMg = 1{,}25 + 0{,}75(1{,}73) \approx 2{,}55$.

$$DWL = \tfrac{1}{2}(Q_R - Q_M)(P_M - CMg(Q_M)) = \tfrac{1}{2}(2{,}71 - 1{,}73)(4{,}27 - 2{,}55) = \tfrac{1}{2}(0{,}98)(1{,}72) \approx \boxed{0{,}85}$$

**Verificación.** $EC_R + EP_R = 3{,}68 + 2{,}76 = 6{,}44$. $EC_M + EP_M = 1{,}49 + 4{,}10 = 5{,}59$. Diferencia $= 0{,}85$ ✓.

**Lectura.** El monopolio reduce $Q$, sube $P$, y traslada bienestar del consumidor al productor pero deja **0,85 millones de ctvos $\times$ kWh** sin captar (DWL puro).

![[gp3-ej9-nstar-dwl.svg]]

---

## Ej 10 — Monopolio Juegos X (con discriminación)

**Datos.** $y = 48 - 4p \;\Rightarrow\; p = 12 - y/4$. $CT(y) = 3 + 5y \;\Rightarrow\; CMg = 5$.

### a) Cantidad y precio que maximizan beneficio

$I = (12 - y/4)y = 12y - y^2/4 \;\Rightarrow\; IMg = 12 - y/2$.

$$IMg = CMg \;\Rightarrow\; 12 - \tfrac{y}{2} = 5 \;\Rightarrow\; \boxed{y^* = 14, \; p^* = 8{,}5}$$

$\pi = 8{,}5(14) - (3 + 70) = 119 - 73 = \boxed{46}$.

### b) Cantidad y precio que maximizan ventas (ingreso)

$I$ máximo donde $IMg = 0$:
$$12 - \tfrac{y}{2} = 0 \;\Rightarrow\; \boxed{y_v = 24, \; p_v = 6}$$

$I_{max} = 6 \cdot 24 = 144$. (Pero $\pi = 144 - (3 + 120) = 21$, menor que en (a).)

### c) Elasticidades

$dy/dp = -4$. $\eta = -4 \cdot p/y$.

- En (a): $\eta = -4 \cdot 8{,}5/14 = -34/14 \approx \boxed{-2{,}43}$ (elástica, como debe ser: el monopolio opera siempre en zona elástica).
- En (b): $\eta = -4 \cdot 6/24 = \boxed{-1}$ (unitaria, consistente con $IMg = 0$).

### d) Discriminación en dos segmentos

**Mercado 1.** $y_1 = 24 - p_1 \;\Rightarrow\; p_1 = 24 - y_1 \;\Rightarrow\; IMg_1 = 24 - 2y_1$.
$$IMg_1 = CMg \;\Rightarrow\; 24 - 2y_1 = 5 \;\Rightarrow\; \boxed{y_1 = 9{,}5, \; p_1 = 14{,}5}$$

**Mercado 2.** $y_2 = 24 - 3p_2 \;\Rightarrow\; p_2 = 8 - y_2/3 \;\Rightarrow\; IMg_2 = 8 - 2y_2/3$.
$$IMg_2 = CMg \;\Rightarrow\; 8 - \tfrac{2 y_2}{3} = 5 \;\Rightarrow\; \boxed{y_2 = 4{,}5, \; p_2 = 6{,}5}$$

**Beneficio con discriminación.**

$I = p_1 y_1 + p_2 y_2 = 14{,}5(9{,}5) + 6{,}5(4{,}5) = 137{,}75 + 29{,}25 = 167$.
$y_{total} = 9{,}5 + 4{,}5 = 14$ (igual que en (a), porque $IMg = CMg = 5$ define la cantidad total óptima).
$CT = 3 + 5(14) = 73$.
$$\pi_{disc} = 167 - 73 = \boxed{94}$$

**Comparación.**

| Estrategia | $\pi$ |
|------------|-------|
| Sin discriminación (a) | 46 |
| **Con discriminación (d)** | **94** |

La discriminación **duplica el beneficio** ($94 > 46$). Verifico elasticidades en cada segmento:

- Segmento 1 ($y_1=9{,}5$, $p_1=14{,}5$): $\eta_1 = -1 \cdot 14{,}5/9{,}5 \approx -1{,}53$
- Segmento 2 ($y_2=4{,}5$, $p_2=6{,}5$): $\eta_2 = -3 \cdot 6{,}5/4{,}5 \approx -4{,}33$

Como $|\eta_2| > |\eta_1|$, al segmento 2 (más elástico) se le cobra **menos**, y al segmento 1 (menos elástico) **más**. Regla de la **discriminación de 3er grado** (regla de Ramsey inversa): mayor precio donde la demanda es menos elástica. Ver [[conceptos/discriminacion-precios]].

![[gp3-ej10-discriminacion.svg]]

---

## Conceptos que ejercita la guía

**Unidad 3:**
- [[conceptos/competencia-perfecta-caracteristicas]]
- [[conceptos/punto-cierre]] — $P_{cierre} = mín(CVMe)$
- [[conceptos/umbral-rentabilidad]] — $P_{UR} = mín(CTMe)$
- [[conceptos/curva-oferta-empresa]] — CMg arriba del mín de CVMe
- [[conceptos/equilibrio-corto-vs-largo-plazo]] — $\pi = 0$ en LP por libre entrada
- [[conceptos/incidencia-impuestos]] — desplazamiento vertical de oferta en $t$

**Unidad 4:**
- [[conceptos/monopolio]] — $IMg = CMg$
- [[conceptos/ingreso-marginal-monopolio]] — $IMg < P$ por la pendiente
- [[conceptos/monopolio-natural]] — economías de escala persistentes
- [[conceptos/regulacion-monopolio]] — $P = CMg$ vs. $P = CTMe$
- [[conceptos/discriminacion-precios]] — 3er grado, regla de Ramsey
- [[conceptos/deadweight-loss]] — triángulo entre demanda y CMg
- [[conceptos/indice-lerner]] — $L = (P-CMg)/P$

## Errores frecuentes detectados al resolver

1. **Cerrar cuando $P < CTMe$** (Ej 1): la regla correcta es cerrar sólo si $P < CVMe$. Entre $CVMe$ y $CTMe$ se produce con pérdida menor que CF.
2. **Olvidar los precios de cierre individuales al agregar oferta** (Ej 2): cada empresa entra a operar a su propio $CVMe_{min}$, generando quiebres en la curva agregada.
3. **Pensar que el impuesto baja el $CMg$** (Ej 3, 8): el impuesto **sube** $CMg$ y $CTMe$ exactamente en $t$.
4. **Asumir que el consumidor paga todo el impuesto en monopolio** (Ej 8d): no, el monopolio absorbe parte porque su demanda es más elástica que la oferta horizontal de CP.
5. **Igualar $IMg = P$ en monopolio** (Ej 5, 10): la regla es $IMg = CMg$. $P > IMg$ siempre por la pendiente negativa de la demanda.
6. **No verificar que en el óptimo del monopolio $|\eta| > 1$** (Ej 10): si saliera $|\eta| < 1$ debería sospecharse un error (el monopolio nunca opera en zona inelástica con $CMg > 0$).
7. **Discriminar al revés** (Ej 10d): al segmento más elástico se le cobra **menos**, al menos elástico **más** (regla inversa de Ramsey).

## Ver también

- [[formulas/unidad-03]], [[formulas/unidad-04]]
- [[unidades/unidad-03-mercados-competencia-perfecta]]
- [[unidades/unidad-04-mercados-imperfectos]]
- [[examenes/parcial-1-analisis]] — patrones recurrentes de monopolio/CP/impuestos
