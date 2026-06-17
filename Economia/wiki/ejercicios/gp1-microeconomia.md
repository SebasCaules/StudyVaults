---
unit: 01
source: GP1_ePI_24.pdf
tipo: guia-practica
last_updated: 2026-04-28
---

# GP N°1 — Microeconomía: Oferta, Demanda, Elasticidades

> Resolución completa paso a paso. Cada ejercicio incluye: enunciado → datos → planteo → cuentas → resultado → interpretación económica.

---

## Ej 1 — Precios reales (deflactar por IPC)

**Enunciado.** Calcular el precio real de la nafta súper para Jul-11 y Jul-13 expresado en pesos de Jul-99.

| Fecha  | $P_{nom}$ (\$/l) | IPC    |
|--------|-----------------|--------|
| Jul-99 | 1,044           | 99,86  |
| Jul-11 | 6,520           | 425,32 |
| Jul-13 | 8,632           | 528,36 |

**Fórmula.**
$$P_{real}^{t} = P_{nom}^{t} \cdot \frac{IPC_{base}}{IPC_{t}}$$

con $IPC_{base} = IPC_{Jul\text{-}99} = 99{,}86$.

**Cuentas.**

- Jul-99 (base): $P_{real} = 1{,}044$ (ya está en pesos de Jul-99).
- Jul-11:
$$P_{real} = 6{,}520 \cdot \frac{99{,}86}{425{,}32} = 6{,}520 \cdot 0{,}23480 \approx 1{,}531$$
- Jul-13:
$$P_{real} = 8{,}632 \cdot \frac{99{,}86}{528{,}36} = 8{,}632 \cdot 0{,}18901 \approx 1{,}631$$

**Resultado.**

| Fecha  | $P_{nom}$ | $P_{real}$ (pesos Jul-99) |
|--------|-----------|---------------------------|
| Jul-99 | 1,044     | 1,044                     |
| Jul-11 | 6,520     | ≈ 1,531                   |
| Jul-13 | 8,632     | ≈ 1,631                   |

**Interpretación.** En términos nominales el precio se multiplicó por ~8,3 entre Jul-99 y Jul-13. En términos reales solo se multiplicó por ~1,56. La nafta sí encareció en términos reales (su precio creció más rápido que el nivel general de precios), pero mucho menos de lo que sugiere el precio nominal. Ver [[conceptos/ipc]].

---

## Ej 2 — Equilibrio y elasticidad

**Enunciado.** $D = 20 - p$, $S = 10 + 4p$. (a) Cantidad y precio de equilibrio. (b) $\eta$ en $p=5$. (c) Interpretación.

### a) Equilibrio

Igualar $D = S$:
$$20 - p = 10 + 4p \;\Rightarrow\; 10 = 5p \;\Rightarrow\; p^* = 2$$
$$Q^* = 20 - 2 = 18 \quad (\text{verif.: } 10 + 4 \cdot 2 = 18)\;\checkmark$$

### b) Elasticidad en $p = 5$

Cantidad demandada en $p=5$: $Q = 20 - 5 = 15$. Derivada: $dQ/dp = -1$.

$$\eta = \frac{dQ}{dp} \cdot \frac{p}{Q} = -1 \cdot \frac{5}{15} = -\frac{1}{3} \approx -0{,}33$$

### c) Interpretación

$|\eta| < 1$ → **demanda inelástica** en ese punto. Una variación del 1% en el precio induce una variación en cantidad de solo ~0,33%. Subir el precio aumentaría el ingreso total (gasto del consumidor). Ver [[conceptos/elasticidad-precio-demanda]].

![[gp1-ej2-equilibrio.svg]]

---

## Ej 3 — Despejar la función de demanda

**Enunciado.** $D = a - bp$. Equilibrio en $(Q, P) = (80, 10)$, elasticidad en ese punto $\eta = -1/4$. Hallar $a$ y $b$.

**Planteo.** Para $D = a - bp$, $dQ/dp = -b$, entonces:
$$\eta = -b \cdot \frac{P}{Q}$$

**Cuentas.**

$$-\frac{1}{4} = -b \cdot \frac{10}{80} = -\frac{b}{8} \;\Rightarrow\; b = 2$$

Sustituyo en la función con el punto de equilibrio:
$$80 = a - 2 \cdot 10 \;\Rightarrow\; a = 100$$

**Resultado.** $\boxed{a = 100,\ b = 2,\ D = 100 - 2p}$.

---

## Ej 4 — Elasticidades en distintas funciones

### a) Elasticidad directa: $D = 100 - p_1^2$ en $(75, 25)$

> El punto se interpreta como $Q = 75$, con $p_1^2 = 25 \Rightarrow p_1 = 5$ (verifica: $100 - 25 = 75$ ✓).

Derivada: $\dfrac{dD}{dp_1} = -2p_1 = -10$ en $p_1=5$.

$$\eta = -2p_1 \cdot \frac{p_1}{Q} = -10 \cdot \frac{5}{75} = -\frac{50}{75} = -\frac{2}{3} \approx -0{,}67$$

**Interpretación.** Demanda **inelástica** en ese punto. Aumentar el precio incrementa el ingreso total.

### b) Elasticidad cruzada: $X_1 = 100 - p_1^2 + 2p_2$ con $X_1=74,\ p_1=6,\ p_2=5$

Verifica: $100 - 36 + 10 = 74$ ✓.

$$\eta_{12} = \frac{\partial X_1}{\partial p_2} \cdot \frac{p_2}{X_1} = 2 \cdot \frac{5}{74} = \frac{10}{74} \approx 0{,}135$$

**Interpretación.** $\eta_{12} > 0$ → bienes **sustitutos** (al subir el precio del bien 2, aumenta la cantidad demandada del bien 1). El valor es bajo, por lo que la sustituibilidad es débil. Ver [[conceptos/elasticidad-cruzada]] y [[conceptos/bienes-sustitutos-complementarios]].

### c) Elasticidad ingreso: $X_1 = \alpha m / p_1$ con $\alpha = 1/2,\ m = 1000,\ p_1 = 5,\ X_1 = 100$

Verifica: $0{,}5 \cdot 1000 / 5 = 100$ ✓.

$$\eta_m = \frac{\partial X_1}{\partial m} \cdot \frac{m}{X_1} = \frac{\alpha}{p_1} \cdot \frac{m}{X_1} = \frac{0{,}5}{5} \cdot \frac{1000}{100} = 0{,}1 \cdot 10 = 1$$

**Interpretación.** $\eta_m = 1$ → elasticidad ingreso **unitaria**. Bien normal con gasto que crece exactamente en la misma proporción que el ingreso (típico de funciones tipo Cobb-Douglas). En el límite entre bien básico ($\eta_m < 1$) y bien de lujo ($\eta_m > 1$). Ver [[conceptos/elasticidad-ingreso]] y [[conceptos/bienes-normales-inferiores]].

### d) Elasticidad de la oferta: $S = 3p^2 + 2p$ en $(85, 5)$

Verifica: $3(25) + 2(5) = 75 + 10 = 85$ ✓.

$$\frac{dS}{dp} = 6p + 2 = 6(5) + 2 = 32$$
$$\varepsilon = 32 \cdot \frac{5}{85} = \frac{160}{85} = \frac{32}{17} \approx 1{,}88$$

**Interpretación.** $\varepsilon > 1$ → oferta **elástica**. La cantidad ofrecida responde más que proporcionalmente al precio. Ver [[conceptos/elasticidad-precio-oferta]].

---

## Ej 5 — Precio máximo en mercado de paddle

**Datos.** $Q_d = 40000 - 2000P$, $Q_s = -10000 + 5000P$.

### a) Equilibrio libre y efecto del tope $P_{max} = 5$

Igualar $Q_d = Q_s$:
$$40000 - 2000P = -10000 + 5000P \;\Rightarrow\; 50000 = 7000P$$
$$P^* = \frac{50}{7} \approx 7{,}14 \quad ;\quad Q^* = 40000 - 2000 \cdot \tfrac{50}{7} = \frac{180000}{7} \approx 25714$$

Como $P_{max} = 5 < P^* \approx 7{,}14$ → el tope es **efectivo** (binding). Evaluamos cantidades en $P = 5$:

$$Q_d(5) = 40000 - 2000 \cdot 5 = 30000$$
$$Q_s(5) = -10000 + 5000 \cdot 5 = 15000$$

**Escasez** = $Q_d - Q_s = 30000 - 15000 = \boxed{15000}$ canchas-hora insatisfechas.

**Interpretación.** El tope genera exceso de demanda crónico. Aparecen colas, listas de espera, asignación por relaciones, mercado paralelo y deterioro de la calidad. Ver [[conceptos/controles-de-precios]].

### b) Tras la caída de moda: $Q_d = 20000 - 2000P$, mismo $P_{max} = 5$

Nuevo equilibrio libre:
$$20000 - 2000P = -10000 + 5000P \;\Rightarrow\; 30000 = 7000P$$
$$P^* = \frac{30}{7} \approx 4{,}29 \quad ;\quad Q^* = \frac{80000}{7} \approx 11429$$

Como $P_{max} = 5 > P^* \approx 4{,}29$ → el tope **no es efectivo** (no binding).

**Interpretación.** El precio máximo queda por encima del equilibrio de mercado, no llega a actuar; el mercado opera en $P^* \approx 4{,}29$ y $Q^* \approx 11{,}429$ sin escasez. Una regulación que antes generaba racionamiento ahora es irrelevante porque la demanda se contrajo lo suficiente.

![[gp1-ej5-precio-maximo-paddle.svg]]

---

## Ej 6 — Secuencia de shocks (melocotones)

**Punto de partida.** Equilibrio $(P_0, Q_0)$ en la intersección de $D_0$ y $S_0$.

| Paso | Shock              | Desplazamiento | Efecto sobre $P$ | Efecto sobre $Q$ |
|------|--------------------|----------------|------------------|------------------|
| 1    | ↑ oferta           | $S_0 \to S_1$ a la derecha | $P_1 < P_0$ | $Q_1 > Q_0$ |
| 2    | ↑ demanda          | $D_0 \to D_1$ a la derecha | $P_2 > P_1$ | $Q_2 > Q_1$ |
| 3    | ↑ oferta otra vez  | $S_1 \to S_2$ a la derecha | $P_3 < P_2$ | $Q_3 > Q_2$ |
| 4    | ↑ demanda otra vez | $D_1 \to D_2$ a la derecha | $P_4 > P_3$ | $Q_4 > Q_3$ |

**Proceso de ajuste (cualitativo).** En cada paso, partiendo del equilibrio anterior, el shock crea un desequilibrio momentáneo (exceso de oferta o de demanda al precio vigente) que se corrige por la "subasta walrasiana": si hay sobrante, los vendedores bajan precio hasta vaciar el mercado; si hay faltante, los compradores ofrecen más hasta atraer oferta. El sistema se estabiliza en la nueva intersección.

**Resultado neto.** $Q_4 \gg Q_0$ (la cantidad sube en los cuatro pasos). El precio final $P_4$ depende de la magnitud relativa de los desplazamientos: si los shocks de oferta dominan, $P_4 < P_0$; si dominan los de demanda, $P_4 > P_0$; si son equivalentes, $P_4 \approx P_0$.

Ver [[conceptos/desplazamientos-curvas]] y [[conceptos/equilibrio-mercado]].

---

## Ej 7 — Shock negativo de oferta (pasajes de avión) y bien complementario (valijas)

**Setup.** Mercado de pasajes con equilibrio inicial $(P_0, Q_0)$. La oferta se contrae (curva $S$ se desplaza a la izquierda → $S'$).

### a) Ajuste al nuevo equilibrio (sólo shock de oferta)

Con $D$ inalterada, la nueva intersección $D \times S'$ ocurre a un precio mayor y cantidad menor: $P_1 > P_0$, $Q_1 < Q_0$.

**Mecanismo de ajuste.** Al precio $P_0$, tras la contracción de oferta, hay exceso de demanda (compradores quieren $Q_0$ pero los vendedores ofrecen menos). Los compradores pujan al alza; el precio sube hasta que la cantidad demandada cae y se iguala a la nueva oferta. Resultado: pasajes más caros y menos viajes.

### b) Variación del precio de las valijas para mantener $P_0$

Las valijas son **complementarias** de los pasajes (se consumen juntos). Para mantener el equilibrio en $P_0$ con la oferta nueva $S'$, la demanda de pasajes debe caer hasta intersecar $S'$ exactamente en $P_0$. La nueva demanda $D'$ debe estar **a la izquierda** de $D$ (menos cantidad demandada a cada precio).

Como ↓ demanda de pasajes se logra con ↑ precio de un complemento:

$$\boxed{P_{valijas} \uparrow}$$

### c) Variación del precio de las valijas para mantener $Q_0$

Ahora se busca preservar la cantidad $Q_0$. En la nueva oferta $S'$, producir $Q_0$ requiere un precio $P_2 > P_0$. La nueva demanda $D''$ debe pasar por $(Q_0, P_2)$, es decir, debe estar **a la derecha** de $D$ (los consumidores aceptan precios más altos para la misma cantidad, o equivalentemente demandan más a cada precio).

Como ↑ demanda de pasajes se logra con ↓ precio de un complemento:

$$\boxed{P_{valijas} \downarrow}$$

**Interpretación general.** El sentido del cambio del precio del complemento depende de qué se quiere preservar: el precio (requiere desincentivar consumo del bien principal → encarecer el complemento) o la cantidad (requiere estimular consumo del bien principal → abaratar el complemento). Ver [[conceptos/bienes-sustitutos-complementarios]].

![[gp1-ej7-shock-valijas.svg]]

---

## Ej 8 — Elección de gerencia según elasticidad de oferta

**Setup.** Productos A y B con misma cantidad y precio iniciales. Difieren sólo en la elasticidad de oferta. Se anticipa un aumento en la demanda de ambos. El gerente cobra por cantidad vendida.

**Análisis.** Ante un desplazamiento idéntico de la demanda hacia la derecha, el reparto entre ↑P y ↑Q depende de la pendiente (elasticidad) de la oferta:

- Oferta **muy elástica** → la curva es casi plana → casi todo el ajuste se traduce en **mayor cantidad** y muy poco en mayor precio.
- Oferta **poco elástica** → casi todo el ajuste se traduce en **mayor precio** y poco en cantidad.

**Conclusión.** El gerente debe elegir el producto con **mayor elasticidad de oferta**, porque ahí el aumento de demanda se transformará en mayor cantidad vendida (que es la métrica que lo evalúa).

> Tip de examen: este ejercicio aparece a menudo invertido (gerente cobrado por margen / por precio): en ese caso convendría el producto con oferta MENOS elástica.

---

## Ej 9 — Maíz vs. soja (conceptual)

### a) ¿Ley de demanda o de oferta?

Ilustra la **ley de la oferta**. Un ↑ del precio del maíz induce un ↑ de la cantidad ofrecida de maíz: los productores que antes cultivaban soja reasignan tierra a maíz. Es un **movimiento sobre la curva de oferta** del maíz (más cantidad ofrecida al nuevo precio).

> Para la soja, en cambio, hay un **desplazamiento de la oferta hacia la izquierda**, porque el precio de un bien sustituto en la producción (el maíz) subió y eso desincentiva sembrar soja.

### b) ¿Por qué un agricultor de soja cambiaría a maíz?

Por **costo de oportunidad** y maximización de beneficio. La hectárea sembrada con soja tiene como costo de oportunidad el ingreso que se podría obtener sembrándola con maíz. Cuando el precio del maíz sube y los costos de producir maíz se mantienen, el ingreso por hectárea de maíz supera al de soja, y reasignar recursos al cultivo más rentable es la decisión racional.

Ver [[conceptos/costo-de-oportunidad]] y [[conceptos/oferta-demanda]].

---

## Ej 10 — Demanda de juegos de Xbox

> Para cada evento se distingue: efecto sobre la **demanda** (desplazamiento de la curva = $D$ ↑/↓) vs. efecto sobre la **cantidad demandada** (movimiento sobre la curva por cambio de precio).

| Evento | Demanda (curva) | Cantidad demandada | Razón |
|--------|-----------------|--------------------|-------|
| **a)** ↓ precio de Xbox (consola) | ↑ | ↑ | Xbox y juegos de Xbox son complementarios. Más consolas → más demanda de juegos. |
| **b)** ↓ precio de PS5 | ↓ | ↓ | PS5 sustituye a Xbox; al hacerse más barata se compran más PS5 y menos Xbox → cae la demanda de juegos de Xbox (efecto vía complementariedad). |
| **c)** ↑ número de productores de juegos de Xbox | sin cambios | ↑ | Afecta la **oferta** (no la demanda). Más oferta → ↓ precio → ↑ cantidad demandada (movimiento sobre la curva). |
| **d)** ↑ ingresos de los consumidores | ↑ | ↑ | Si los juegos son bien normal, sube la demanda. |
| **e)** ↑ costo de programadores | sin cambios | ↓ | Afecta la **oferta** (la reduce). ↑ precio de equilibrio → ↓ cantidad demandada (movimiento sobre la curva). |
| **f)** Expectativa de ↓ precio futuro | ↓ | ↓ | Los consumidores postergan compras → cae la demanda actual. |
| **g)** Aparece nueva consola sustituta del Xbox | ↓ | ↓ | ↓ demanda de Xbox → vía complementariedad, ↓ demanda de juegos de Xbox. |

**Regla mnemotécnica.** Si el evento cambia el precio del propio bien → **cantidad demandada** (movimiento sobre la curva). Si cambia cualquier otra variable (ingreso, precio de relacionados, expectativas, gustos, # consumidores) → **demanda** (desplazamiento). Ver [[conceptos/desplazamientos-curvas]].

---

## Ej 11 — Cascada de eventos (gasolina)

> Para cada evento, identificar efecto sobre demanda, oferta, cantidad demandada y cantidad ofrecida de gasolina. Cada evento se analiza partiendo del equilibrio inicial $(P_0, Q_0)$.

| Evento | Demanda | Oferta | Cant. demandada | Cant. ofrecida | Razón |
|--------|---------|--------|-----------------|----------------|-------|
| **i)** ↑ precio del petróleo crudo | — | ↓ | ↓ | ↓ | El crudo es **input** de la gasolina. ↑ costo → ↓ oferta. Nuevo eq.: $P↑$, $Q↓$ → cantidad demandada ↓ (movimiento sobre $D$). La cantidad ofrecida en el nuevo eq. también es menor. |
| **ii)** ↑ precio del automóvil | ↓ | — | ↓ | ↓ | El automóvil es **complemento** de la gasolina. ↑ $P_{auto}$ → ↓ demanda gasolina. Nuevo eq.: $P↓$, $Q↓$ → cantidad ofrecida ↓ (movimiento sobre $S$). |
| **iii)** Se eliminan los límites de velocidad | ↑ | — | ↑ | ↑ | A mayor velocidad mayor consumo por km y se incentiva a manejar más → ↑ demanda. Nuevo eq.: $P↑$, $Q↑$ → cantidad ofrecida ↑ (movimiento sobre $S$). |
| **iv)** Robots reducen costos de producción de autos | ↑ | — | ↑ | ↑ | Indirecto: ↓ costos autos → ↓ $P_{auto}$ → más autos en la calle → ↑ demanda gasolina (vía complementariedad). Nuevo eq.: $P↑$, $Q↑$ → cantidad ofrecida ↑ (movimiento sobre $S$). |

**Lectura clave.** Sólo los eventos (i) afectan directamente la **oferta** de gasolina (porque el petróleo es input). Los eventos (ii), (iii) y (iv) afectan la **demanda** (vía complementariedad con autos o vía hábito de uso). En todos los casos, la "cantidad demandada" o "cantidad ofrecida" cambia como **consecuencia** del nuevo precio de equilibrio (movimiento sobre la curva no desplazada).

---

## Conceptos que ejercita la guía

- [[conceptos/elasticidad]] — directa, cruzada, ingreso, oferta
- [[conceptos/elasticidad-precio-demanda]] — interpretación de $|\eta|$ vs. 1
- [[conceptos/elasticidad-precio-oferta]] — papel del plazo
- [[conceptos/elasticidad-cruzada]] — sustitutos vs. complementarios por signo
- [[conceptos/elasticidad-ingreso]] — normales (lujo / básico) vs. inferiores
- [[conceptos/oferta-demanda]] — equilibrio, ajuste walrasiano
- [[conceptos/desplazamientos-curvas]] — movimiento sobre la curva vs. desplazamiento
- [[conceptos/controles-de-precios]] — precio máximo efectivo vs. no efectivo
- [[conceptos/bienes-sustitutos-complementarios]]
- [[conceptos/bienes-normales-inferiores]]
- [[conceptos/ipc]] — deflactar series nominales

## Errores frecuentes detectados al resolver

1. **Confundir desplazamiento de la curva con movimiento sobre la curva** (Ej 10 c, e y Ej 11). Regla: cambia $P$ del propio bien → movimiento sobre la curva; cambia cualquier otra variable → desplazamiento.
2. **Olvidar el signo de la elasticidad cruzada** (Ej 4b): si es $> 0$ son sustitutos, $< 0$ complementarios.
3. **Asumir que cualquier precio máximo genera escasez** (Ej 5b): sólo si está por debajo del equilibrio.
4. **No verificar el punto de evaluación** antes de calcular elasticidad (Ej 4a, 4d): siempre confirmar que el par $(Q, P)$ pertenece a la curva.
5. **Invertir el sentido del precio del complemento** (Ej 7b/c): para preservar el precio, ↑ complemento; para preservar la cantidad, ↓ complemento.

## Ver también

- [[formulas/unidad-01]] — formulario completo con elasticidades, equilibrio, controles
- [[unidades/unidad-01-introduccion-oferta-demanda-elasticidades]] — síntesis teórica
- [[ejercicios/guia-2-resoluciones]] — más ejercicios resueltos de Unidad 1 (subsidios, comercio)
- [[examenes/parcial-1-analisis]] — patrones recurrentes en parciales
