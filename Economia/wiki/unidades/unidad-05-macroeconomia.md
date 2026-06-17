---
unit: 05
module: Macroeconomía
title: Unidad 5 — PBI, Ciclos, Inflación, Empleo, ODA, Política Fiscal, Dinero y Política Monetaria
parcial: 1
sources: [Clase 1.pdf, Clase 2.pdf, Clase 3.pdf]
last_updated: 2026-04-27
---

## Resumen

### Salto de escala: del individuo al agregado

La macroeconomía estudia el **comportamiento agregado** de la economía: producto total, empleo total, nivel general de precios, balanza externa. No es simplemente "micro × N": fenómenos como la inflación, las recesiones o el desempleo agregado tienen lógicas propias que requieren herramientas distintas.

**Origen histórico:** la macroeconomía como disciplina nace con la **Gran Depresión (1929)** y se consolida con **Keynes** en *La Teoría General* (1936). Antes de Keynes la ortodoxia era clásica: los mercados se autorregulan, el desempleo masivo no debería ocurrir y, si ocurre, no debería persistir. La Depresión refutó empíricamente esa visión. Keynes propuso una explicación alternativa: las crisis son problemas de **insuficiencia de demanda agregada** y el Estado debe intervenir activamente (política fiscal y monetaria) para sostener la demanda.

**Hitos posteriores:**
- **Hicks (1937):** modelo IS-LM, formalización gráfica de Keynes — equilibrio simultáneo en mercado de bienes (IS) y dinero (LM).
- **Friedman (1960s):** monetarismo. No hay relación de largo plazo entre inflación y desempleo (curva de Phillips de LP es vertical en la tasa natural). Inflación es un fenómeno monetario.
- **Lucas (1970s):** expectativas racionales. Las políticas anticipadas no afectan variables reales.

**Paradoja de la frugalidad (Keynes):** si todos los hogares deciden ahorrar más simultáneamente, la demanda agregada cae, el producto se contrae, los ingresos caen y, paradójicamente, **el ahorro agregado puede terminar siendo menor**. Lo que es virtuoso para el individuo (ahorrar) puede ser destructivo para el agregado (insuficiencia de demanda). Es un caso clásico de **falacia de composición**: lo que vale para uno no vale para todos a la vez.

**Objetivos típicos de política económica:**
1. **Pleno empleo** (tasa natural de desempleo).
2. **Estabilidad de precios** (inflación baja y predecible).
3. **Sostenibilidad externa** (cuenta corriente manejable).
4. **Crecimiento económico** sostenido.

Estos objetivos suelen entrar en **trade-off** entre sí: por ejemplo, bajar inflación puede requerir enfriar la economía y subir el desempleo (curva de Phillips de corto plazo).

### Ciclos económicos

La economía no crece a tasa constante — alterna **expansiones** (el producto crece sobre la tendencia) y **recesiones** (el producto cae o crece menos). Las fases típicas son: **expansión → pico → recesión → valle → recuperación**. Una recesión técnica suele definirse como dos trimestres consecutivos de caída del PBI real.

![[ciclo-economico.svg]]

El objetivo de los hacedores de política no es eliminar el ciclo (imposible) sino **suavizarlo**. Las políticas anti-cíclicas operan en sentido contrario al ciclo: estimulan la demanda en recesión y la enfrían en sobrecalentamiento.

### PBI: el indicador central

El **Producto Bruto Interno (PBI)** es el valor monetario de **todos los bienes y servicios finales producidos dentro de las fronteras de un país en un período**. Cuatro adjetivos importan:

| Distinción | Significado |
|---|---|
| **Bienes finales** vs intermedios | Solo los finales (evita doble contabilización; los insumos ya están incorporados en el precio del producto final) |
| **Bruto** vs Neto | Bruto no descuenta depreciación (consumo de capital fijo); Neto sí |
| **Interno** (PBI) vs Nacional (PNB) | Interno: dentro del país, sin importar nacionalidad. Nacional: producido por residentes, dentro o fuera |
| **Nominal** vs **Real** | Nominal a precios corrientes; Real a precios de un año base |

**Tres métodos de cálculo equivalentes** (deben dar lo mismo por construcción):

1. **Método del gasto:** $PBI = C + I + G + (X - M)$

   Donde:
   - $C$: consumo privado de los hogares
   - $I$: inversión bruta interna fija (FBKF + variación de existencias)
   - $G$: gasto público (consumo del gobierno)
   - $X$: exportaciones de bienes y servicios
   - $M$: importaciones de bienes y servicios

   Suma todo el gasto de los compradores finales: consumo privado, inversión, gasto público y exportaciones netas.
2. **Método del ingreso:** suma de remuneraciones al trabajo, excedente de explotación, depreciación e impuestos netos.
3. **Método del valor agregado:** suma de los valores agregados de cada sector productivo (output menos consumo intermedio).

**[[pbi-nominal-vs-real|PBI nominal vs real]]:** distinguir crecimiento por más cantidad vs crecimiento por más precios.

$$\text{Deflactor del PBI} = \frac{PBI_{nominal}}{PBI_{real}} \times 100$$

Donde:
- $PBI_{nominal}$: producto valuado a precios corrientes del período
- $PBI_{real}$: producto valuado a precios de un año base fijo

El deflactor es un índice de precios de toda la producción interna (más amplio que el IPC, que solo cubre la canasta del consumidor). Si crece, hay inflación — pero captada sobre la mezcla de producción del año en curso (índice de Paasche), no sobre canasta fija.

### Identidad fundamental y modelo de tres brechas

Toda economía cumple, **por definición contable**, la identidad:

$$C + S + T \equiv Y \equiv C + I + G + (X - M)$$

Donde:
- $Y$: ingreso / producto nacional
- $C$: consumo privado
- $S$: ahorro privado
- $T$: impuestos netos
- $I$: inversión bruta
- $G$: gasto público
- $X$: exportaciones
- $M$: importaciones

- Lado izquierdo: usos del ingreso (consumir $C$, ahorrar $S$, pagar impuestos $T$).
- Lado derecho: composición del producto por destino del gasto.

Reordenando:

$$\boxed{(S - I) + (T - G) + (M - X) \equiv 0}$$

Las **tres brechas**:
- $(S - I)$: brecha privada (ahorro privado menos inversión).
- $(T - G)$: brecha fiscal (resultado del gobierno).
- $(M - X)$: brecha externa con signo invertido — equivalente a $-(X - M)$.

**Interpretación:** los excesos y déficits sectoriales se compensan. Si el sector público tiene déficit ($T < G$), debe ser financiado por exceso de ahorro privado o por endeudamiento externo (déficit en cuenta corriente). Esta identidad anticipa por qué un país no puede tener simultáneamente déficit fiscal grande, baja inversión privada y superávit externo: aritméticamente imposible.

### Inflación

**Inflación:** aumento sostenido y generalizado del nivel de precios. Tres calificadores importan: *sostenido* (no un pico aislado), *generalizado* (no de un solo bien) y *del nivel de precios* (no de precios relativos).

**Medición:**
- **[[ipc|IPC]] (Índice de Precios al Consumidor):** mide costo de una **canasta fija** representativa del gasto familiar. Es un índice de Laspeyres — sobreestima inflación porque no captura sustitución hacia bienes que se abarataron relativamente.
- **Deflactor del PBI:** canasta variable (la del producto del período).
- **IPM, IPMP:** mayoristas, materias primas.

**Tasa de inflación mensual:** $\pi_t = (IPC_t - IPC_{t-1}) / IPC_{t-1} \times 100$.

Donde:
- $\pi_t$: tasa de inflación del período $t$ (en %)
- $IPC_t$: índice de precios al consumidor del período $t$
- $IPC_{t-1}$: IPC del período anterior

**[[costos-inflacion|Costos de la inflación]]:**
1. **Costos de suela de zapato:** la gente reduce tenencias de efectivo y va más seguido al banco — pérdida de tiempo.
2. **Costos de menú:** las firmas deben actualizar listas de precios constantemente.
3. **Pérdida de la unidad de cuenta:** la moneda deja de ser un medidor confiable; se "dolariza" mentalmente la economía.
4. **Redistribución arbitraria:** perdedores son los acreedores nominales y los que tienen ingresos fijos; ganadores son los deudores nominales.
5. **Distorsión de incentivos:** se invierte en cobertura (\$) en lugar de en producción.

**Hiperinflación:** ritmos > 50% mensual (criterio Cagan). Argentina la sufrió en 1989-90.

**Desinflación:** bajar la *tasa* de inflación (ej. de 30% a 10%). Costoso en el corto plazo (suele venir con recesión).

### Mercado de trabajo y desempleo

**Estructura conceptual:**
- **Población total** = PEA + PEI.
- **PEA (Población Económicamente Activa)** = Ocupados + Desocupados (los que trabajan o buscan trabajo).
- **PEI (Población Económicamente Inactiva)** = los que ni trabajan ni buscan (estudiantes, jubilados, amas de casa, desalentados).
- **Ocupados** se subdividen: plenos (35-45 hs), subocupados (<35 hs involuntariamente), sobreocupados (>45 hs).

**Tasas (cuidado, denominadores distintos):**
- **Tasa de actividad** $= PEA / Población$.
- **Tasa de ocupación** $= Ocupados / Población$.
- **Tasa de desocupación** $= Desocupados / PEA$.

**Tipos de desempleo:**
1. **Friccional:** búsqueda entre empleos (siempre hay rotación normal).
2. **Estructural:** desajuste calidades-vacantes (un soldador no calza en una vacante de programador).
3. **Cíclico:** asociado al ciclo económico (sube en recesión).

**Tasa natural de desempleo** = friccional + estructural. Es independiente del ciclo. El desempleo cíclico es la diferencia entre la tasa observada y la natural.

**Ley de Okun (regularidad empírica):** una caída del PBI real de 1% sobre el potencial está asociada a un aumento de la tasa de desempleo de aproximadamente 0,5 puntos.

### Pobreza, indigencia y distribución del ingreso

**Medición de pobreza por ingreso:**
- **Indigente:** hogar cuyo ingreso no cubre la **Canasta Básica Alimentaria (CBA)** — alimentos mínimos para sobrevivir.
- **Pobre:** hogar cuyo ingreso no cubre la **Canasta Básica Total (CBT)** = CBA + bienes y servicios no alimentarios (vivienda, indumentaria, transporte, salud, educación). $CBT = CBA \cdot k$, donde $k$ es la inversa del coeficiente de Engel (proporción del gasto destinada a alimentos).

**Distribución del ingreso — Curva de Lorenz y Coeficiente de Gini:**

La curva de Lorenz grafica la proporción acumulada del ingreso (eje Y) contra la proporción acumulada de la población ordenada de menor a mayor ingreso (eje X). La diagonal de 45° representa la igualdad perfecta.

$$G = \frac{A}{A + B}$$

Donde $A$ es el área entre la diagonal y la curva de Lorenz, y $B$ el área debajo de la curva.

- $G = 0$: igualdad perfecta (todos tienen el mismo ingreso).
- $G = 1$: desigualdad máxima (uno se queda con todo).
- Argentina ≈ 0,427; Brasil ≈ 0,513; EEUU ≈ 0,41; Finlandia ≈ 0,268; Zambia ≈ 0,575.

**Brecha de ingresos:** ratio entre el ingreso medio del decil 10 (10% más rico) y el del decil 1 (10% más pobre). Más intuitiva que el Gini pero menos sintética.

### Oferta y Demanda Agregadas (ODA)

Análogo macro a oferta y demanda micro, pero con **nivel general de precios ($P$) en el eje vertical** y **producto agregado real ($Y$)** en el horizontal.

**Demanda agregada (DA):** pendiente negativa por tres efectos cuando sube $P$:
1. **Efecto riqueza (Pigou):** sube $P$ → cae el valor real de los activos monetarios → cae $C$.
2. **Efecto tasa de interés:** sube $P$ → sube demanda de dinero → sube tasa de interés → cae $I$.
3. **Efecto comercio exterior:** sube $P$ doméstico → exportaciones se encarecen y caen → cae $(X-M)$.

**Oferta agregada de corto plazo (OACP):** pendiente positiva. Razón clave: **rigideces nominales** — salarios y precios pegajosos no se ajustan instantáneamente. En el muy corto plazo es casi horizontal (modelo keynesiano puro).

**Oferta agregada de largo plazo (OALP):** vertical en el **producto potencial** $Y_*$. En LP los precios y salarios se ajustan completamente; el nivel de producto depende solo de factores reales (capital, trabajo, tecnología), no del nivel de precios.

**Equilibrio:** intersección de DA con OA. Si la economía está en $Y < Y_*$ → recesión; si $Y > Y_*$ → sobrecalentamiento (presión inflacionaria).

![[oda-equilibrio.svg]]

### Política Fiscal

Uso del **gasto público ($G$)** y los **impuestos ($T$)** para influir en la actividad económica.

- **Política fiscal expansiva:** $\uparrow G$ o $\downarrow T$ → desplaza DA a la derecha → ↑ Y, ↑ P. Apropiada en recesión.
- **Política fiscal contractiva:** lo opuesto. Apropiada en sobrecalentamiento.

**Multiplicador keynesiano del gasto:**

$$k = \frac{1}{1 - PMC} = \frac{1}{PMS}$$

Donde:
- $k$: multiplicador keynesiano del gasto
- $PMC$: propensión marginal a consumir ($0 < PMC < 1$)
- $PMS$: propensión marginal a ahorrar ($PMS = 1 - PMC$)

Significa que un aumento autónomo del gasto $\Delta G$ genera un aumento del producto **mayor** que $\Delta G$:

$$\Delta Y = k \cdot \Delta G$$

Donde:
- $\Delta Y$: variación del producto agregado
- $\Delta G$: variación autónoma del gasto público

Lógica: el primer gasto se transforma en ingreso de alguien que consume una fracción $PMC$, generando un nuevo ingreso, etc. Serie geométrica que converge a $1/(1-PMC)$.

**Ejemplo:** si $PMC = 0,8$, $k = 5$. Un aumento de $G$ de 100 genera un aumento de $Y$ de 500.

**Multiplicador de transferencias e impuestos** (importante distinción):
- $\Delta Y = \dfrac{PMC}{1-PMC} \cdot \Delta TR$ (transferencias)
- $\Delta Y = -\dfrac{PMC}{1-PMC} \cdot \Delta T$ (impuestos suma fija)

Es **menor en módulo** que el del gasto: una transferencia de \$1 termina aumentando el consumo solo en $PMC \cdot 1$ peso (la fracción restante se ahorra). En cambio, el primer peso de gasto público va directo a demanda.

**Ejemplo (clase):** $PMC = 0{,}5$, $\Delta G =$ \$50M → $\Delta Y =$ \$100M (k=2). Misma transferencia $\Delta TR =$ \$50M → $\Delta Y =$ \$50M (k=1).

**Multiplicador de presupuesto equilibrado:** $\Delta G = \Delta T \Rightarrow \Delta Y = \Delta G$ (multiplicador exactamente igual a 1).

**Estabilizadores automáticos:** componentes del presupuesto que actúan **anticíclicamente sin intervención discrecional**:
- Recaudación tributaria pro-cíclica (impuesto a las ganancias, IVA): cae en recesión y sube en expansión, suavizando el ingreso disponible.
- Gasto en seguro de desempleo: sube en recesión.
Argentina los tiene débiles porque su base impositiva es estrecha y volátil.

**Conceptos asociados:**
- **Déficit fiscal primario:** $G + TR - T > 0$ (sin contar intereses de deuda).
- **Déficit fiscal financiero:** primario + intereses ($i \cdot D$).
- **Deuda pública:** acumulación de déficits pasados financiados con bonos.
- **Sostenibilidad fiscal:** depende de la relación entre tasa de interés real ($r$) y crecimiento del PBI ($\gamma$).

**Condición de sostenibilidad de la deuda (en % del PBI):**
$$d^* = -(r - \gamma) \cdot b$$

Donde $b$ es Deuda/PBI y $d^*$ el déficit primario sostenible (negativo = se necesita superávit).
- Si $r > \gamma$: hace falta **superávit primario** para que $b$ no explote.
- Si $r < \gamma$: la economía "crece más rápido que la deuda" y se puede sostener cierto déficit.
- Ejemplo: $r = 6\%$, $\gamma = 5\%$, $b = 0{,}6$ → $d^* = -0{,}6\%$ (necesita superávit del 0,6% del PBI).

**Pasivos contingentes / implícitos:** sistema previsional desfinanciado, garantías estatales sobre deuda privada, demografía adversa. No figuran en deuda explícita pero comprometen futuras finanzas públicas.

**Tres formas de financiar el déficit fiscal:**
1. **Deuda doméstica** (bonos en pesos colocados en el mercado local).
2. **Deuda externa** (bonos en moneda extranjera).
3. **Emisión monetaria** (BC compra deuda del Tesoro) — la única que es necesariamente inflacionaria si la economía no crece.

### Sistema financiero, dinero y tasa de interés

#### Conceptos básicos de finanzas

La macroeconomía moderna requiere herramientas financieras básicas. Dos conceptos fundamentales:

- **Tasa de interés ($i$):** refleja el "valor tiempo" del dinero — el rendimiento exigido para postergar consumo. Es el costo de oportunidad del dinero. Permite comparar flujos en distintos momentos del tiempo.
- **Trade-off rendimiento esperado vs riesgo ($E(R)$ vs $\sigma$):** trade-off fundamental del sistema financiero. A mayor riesgo, mayor rendimiento exigido.

**Interés simple vs compuesto:**
- **Simple (TNA):** sin reinversión de pagos intermedios.
- **Compuesto (TEA):** se reinvierten/capitalizan los pagos. La mayoría de las variables macro (crecimiento, inflación, dinero) deben pensarse en términos compuestos. Diferencia importante a largo plazo: a 50 años, 1,5% anual lleva \$100 a \$210; 2% anual lleva \$100 a \$269 — diferencia 28%.

#### Tasa de interés real — corrección por inflación

$$1 + r = \frac{1 + i}{1 + \pi}$$

Donde:
- $r$: tasa de interés real (en términos de poder adquisitivo)
- $i$: tasa de interés nominal
- $\pi$: tasa de inflación del período

La tasa real ajusta la nominal por inflación, midiendo el poder adquisitivo real ganado/perdido. La aproximación de Taylor $r \approx i - \pi$ **NO sirve para Argentina** porque tenemos tasas altas:
- Inflación 50%, nominal 60% → real exacta = 6,66% (no 10%, error de 50%).

**Distinción ex-ante vs ex-post:**
- **Ex-ante (Paridad de Fisher):** $1 + r_t = (1+i_t)/(1+\pi^e_{t+1})$ — usa inflación *esperada*.
- **Ex-post:** usa inflación realizada — la tasa real efectivamente realizada.

#### Sistema financiero: rol macroeconómico

Un sistema financiero **conecta agentes con exceso de capital con agentes con necesidad de capital**. Sus componentes: prestamistas/inversores ↔ instrumentos financieros + intermediarios + mercados ↔ prestatarios, todo bajo organismos supervisores.

**Funciones:**
1. Canalizar el ahorro hacia la inversión.
2. Agregar capital (volumen).
3. Selección de proyectos con mejor relación riesgo-retorno.
4. Diversificación de riesgos.
5. Monitoreo de riesgos.

Empíricamente, sistemas financieros más profundos (mayor crédito y depósitos privados como % del PBI) se asocian a mayor crecimiento económico. Argentina tiene un sistema atípicamente pequeño: crédito privado **12,8% del PBI** (vs 41% promedio LatAm, 131% promedio desarrollados). En títulos públicos se concentra el grueso del volumen bursátil local.

#### Instrumentos financieros: renta fija y variable

**Renta fija (bonos, ON):** instrumentos de **deuda** con flujo de pagos prefijado. El prospecto especifica cupones (intereses), amortización del capital, cláusulas. Se clasifican según deudor: títulos públicos vs Obligaciones Negociables (sector privado). Hay **mercado primario** (emisión) y **secundario** (compraventa posterior — donde se define el precio).

**Valuación de un bono:**

$$P^B = \frac{CF_1}{1+i} + \frac{CF_2}{(1+i)^2} + \cdots + \frac{CF_N}{(1+i)^N}$$

Donde:
- $P^B$: precio del bono (valor presente de los flujos)
- $CF_t$: cashflow del período $t$ (cupón + amortización)
- $i$: tasa de descuento (costo de oportunidad)
- $N$: cantidad de períodos hasta el vencimiento

$CF_t$ son los cashflows conocidos por contrato y $i$ es la tasa de descuento (costo de oportunidad).

**TIR (tasa interna de retorno):** la tasa que iguala el precio de mercado al valor presente de los flujos. Refleja el **rendimiento esperado** del bono al precio actual.

| Precio | TIR vs cupón | Cotiza |
|---|---|---|
| $P = 100$ (par) | TIR = cupón | a la par |
| $P < 100$ | TIR > cupón | bajo la par (el mercado exige más rentabilidad) |
| $P > 100$ | TIR < cupón | sobre la par |

![[bonos-par-bajo-sobre.svg]]

**Estructura de riesgo de las tasas:** $\text{TIR} = \text{tasa libre de riesgo} + \text{prima de riesgo}$. Bono USA (T-Bill/T-bond) es el benchmark libre de riesgo. La prima depende del tipo de emisor, liquidez, confianza, tratamiento impositivo y plazo.

**Rating crediticio (clave para la prima):** Moody's/S&P/Fitch escala AAA → D. Corte clave en BBB- (S&P)/Baa3 (Moody's): arriba es **investment grade**, abajo es **junk** (alto riesgo). Empíricamente, probabilidad de default a 5 años: ~2% para BBB, ~14,6% para B-.

**Renta variable (acciones):** participación directa en una empresa. No hay flujo prefijado — son perpetuidades de dividendos esperados. Valuación de perpetuidad constante:

$$P^A = \frac{D}{i}$$

Donde:
- $P^A$: precio de la acción (perpetuidad)
- $D$: dividendo proyectado constante
- $i$: tasa de descuento ajustada por riesgo

donde $D$ es el dividendo proyectado e $i$ la tasa de descuento relevante.

### Dinero, agregados y multiplicador

**Funciones del dinero:**
1. **Medio de cambio** — para comprar bienes y servicios.
2. **Unidad de cuenta** — precios y balances comunes.
3. **Reserva de valor** — acumular riqueza (función dañada por inflación alta).
4. **Patrón de pago diferido** — pagos a futuro.

**Tipos de dinero:** mercancía, con respaldo en mercancías, **fiduciario** (sin respaldo, basado en confianza — el caso moderno), electrónico.

**Características del dinero (debe cumplirlas todas):** portabilidad, escasez, aceptabilidad, durabilidad, uniformidad, divisibilidad. Crucialmente, la **tangibilidad NO es** una característica esencial (el dinero electrónico funciona perfectamente). La **rentabilidad tampoco** — el dinero per se no devenga interés.

**Agregados monetarios** (de más a menos líquidos):
- **Base monetaria (BM o M0):** billetes y monedas en circulación + reservas (encajes) de bancos en BCRA.
- **M1:** circulante en poder del público + cuentas corrientes (depósitos a la vista).
- **M2:** M1 + cajas de ahorro.
- **M3:** M2 + plazos fijos y otros depósitos.

#### El multiplicador del dinero

El BC controla la base monetaria, pero **la oferta monetaria total es mayor** porque los bancos comerciales crean "dinero secundario" prestando una fracción de los depósitos.

**Ejemplo intuitivo:** \$100 de BM con encaje 10% → primer banco presta \$90, ese \$90 vuelve como depósito → presta \$81 → etc. Suma geométrica: \$100/0,1 = \$1000 de oferta monetaria potencial.

![[multiplicador-dinero-cascada.svg]]

**Identidades clave:**
- $M = E + D$ (oferta monetaria = efectivo + depósitos)
- $BM = E + R$ (base = efectivo + reservas)
- $e = E/D$ (preferencia por efectivo del público)
- $r = R/D$ (coeficiente de encajes)
- **Multiplicador:** $m = M/BM = \dfrac{e+1}{e+r}$

  Donde:
  - $m$: multiplicador del dinero
  - $M$: oferta monetaria total
  - $BM$: base monetaria
  - $E$: efectivo en poder del público
  - $D$: depósitos del público en bancos
  - $R$: reservas (encajes) bancarias
  - $e = E/D$: preferencia del público por efectivo
  - $r = R/D$: coeficiente de encajes (reservas/depósitos)

- $M = m \cdot BM$, $R = r \cdot D$, Préstamos = $D - R$

**Comparativa estática:**
| Si... | ...el multiplicador |
|---|---|
| ↑ $r$ (más encajes) | ↓ $m$ |
| ↑ $e$ (público guarda más efectivo) | ↓ $m$ |

**En Argentina (sept-2025):** $M_2/BM \approx 1,76$ — solo uno de cada dos pesos en circulación es producto directo de emisión del BC; el resto es creación secundaria del sistema bancario.

#### Banco Central — funciones y balance

**Funciones:**
- Preservar el valor de la moneda.
- Custodio de reservas internacionales (oro y divisas).
- Proveedor del dinero de curso legal.
- Ejecutor de la política cambiaria.
- Responsable de la política monetaria.
- Prestamista del gobierno y de bancos comerciales (banco de bancos, prestamista de última instancia).

**Balance del BC:**

| Activos | Pasivos |
|---|---|
| Reservas internacionales | Efectivo / circulante |
| Préstamos al tesoro (bonos) | Reservas legales (encajes) |
| Préstamos a bancos (redescuentos) | Letras del BC |

#### Demanda de dinero y mercado monetario

**Motivos keynesianos para mantener saldos líquidos:**
1. **Transacción** — compras cotidianas.
2. **Precaución** — gastos futuros inesperados.
3. **Especulación** — esperar oportunidades de inversión.

**Decisión marginal:** el costo de oportunidad de tener dinero es la rentabilidad de los activos no monetarios. Por eso la **curva de demanda de dinero ($MD$) tiene pendiente negativa** respecto a la tasa de interés: a mayor tasa, mayor costo de oportunidad → menos demanda de saldos líquidos.

**Desplazamientos de la curva $MD$:**
- ↑ nivel general de precios → $MD$ a la derecha (proporcional).
- ↑ PBI real (más transacciones) → $MD$ a la derecha.
- Avances tecnológicos (menos cash necesario) → $MD$ a la izquierda.
- Cambios institucionales (encajes, regulaciones).

**Equilibrio en el mercado de dinero:** la **oferta monetaria ($MS$) es vertical** (la elige el BC). Su intersección con $MD$ determina la **tasa de interés de equilibrio $r_E$**:
- Si $r > r_E$ → exceso de oferta de dinero → cae $r$.
- Si $r < r_E$ → exceso de demanda → sube $r$.

![[mercado-dinero.svg]]

### Política monetaria

**Definición:** acción de las autoridades monetarias para controlar la cantidad de dinero y, vía la tasa de interés, influir en la actividad económica.

**Mecanismo expansivo:** el BC aumenta $MS$ → cae $r$ → ↑ inversión y consumo → DA se desplaza a la derecha → ↑ $Y$ (CP) y/o ↑ $P$.

![[politica-monetaria-expansiva.svg]]

**Mecanismo contractivo:** lo opuesto. Apropiada para enfriar economía sobrecalentada.

**Herramientas (sobre BM y dinero secundario):**

| Instrumento | Tipo expansivo | Tipo contractivo |
|---|---|---|
| Operaciones cambiarias | Comprar divisa | Vender divisa |
| Operaciones de mercado abierto (OMA) | Comprar bonos / rescatar pases | Vender bonos / licitar pases |
| Adelantos al tesoro | Financia déficit fiscal | — |
| Política de redescuento | Bajar tasa de redescuento | Subir |
| Encajes (afecta dinero secundario) | Bajar tasa | Subir |
| Tasa de interés (de política) | Bajar | Subir |

**Régimen de política monetaria** — encadenamiento causal:

$$\text{Instrumentos} \to \text{Objetivo operativo} \to \text{Meta intermedia} \to \text{Objetivo final}$$

- **Instrumentos:** intervención cambiaria, encajes, OMAs, facilidades.
- **Objetivo operativo:** tipo de cambio fijo / base monetaria / tasa de corto plazo.
- **Meta intermedia (ancla nominal):** tipo de cambio / agregados monetarios / inflación esperada.
- **Objetivo final:** estabilidad de precios + estabilidad financiera + crecimiento de LP + pleno empleo.

#### Régimen de metas de inflación (inflation targeting)

Régimen dominante actualmente. El BC fija un **objetivo explícito de inflación** (típicamente IPC anual en torno a 2-3% para desarrollados, 3-4% para emergentes) y maneja la tasa de interés de corto plazo para alcanzarlo. Componentes:
- **Estrategia de comunicación clara y transparente.**
- **Evaluación prospectiva** de la dinámica macro.
- **Independencia operativa** del BC.

Empíricamente, países que adoptaron metas de inflación lograron bajar la inflación promedio. Pero el **prerrequisito controvertido** es la inflación de partida — Argentina lo intentó con 35,5% (2016), una situación atípicamente alta.

#### Ecuación cuantitativa y neutralidad del dinero

$$M \cdot V = P \cdot Y$$

Donde:
- $M$: oferta monetaria (cantidad de dinero)
- $V$: velocidad de circulación (rotaciones por año)
- $P$: nivel general de precios
- $Y$: producto real (PBI real)

Si $V$ y $Y$ son estables, $\Delta M$ se traduce en $\Delta P$. Base de la **teoría cuantitativa del dinero** (Friedman) y argumento clásico contra emisión excesiva.

**Neutralidad del dinero (largo plazo):** un cambio en $M$ provoca un **cambio proporcional del nivel de precios** sin afectar variables reales. En el corto plazo la política monetaria sí afecta producto (rigideces); en el largo plazo no — solo el nivel general de precios.

**Implicancia gráfica:** un aumento de $M$ baja $r$ en CP, pero al subir $P$ la $MD$ se desplaza a la derecha hasta que $r$ vuelve a su nivel inicial.

![[neutralidad-dinero.svg]]

#### Instrumentos no convencionales (post-2008)

Tras la crisis financiera de 2008 muchos BCs hit el **Zero Lower Bound (ZLB)**: la tasa nominal de política llega a 0% y no puede bajar más, anulando la herramienta tradicional. Surgieron herramientas no convencionales:

1. **Inyecciones de liquidez** (subastas como TAF, programas de préstamo).
2. **Quantitative Easing (QE):** compras a gran escala de activos (bonos, MBS) para inyectar dinero en la economía.
3. **Forward Guidance:** manejo de expectativas — el BC pre-anuncia su política futura para influir tasas largas.
4. **Tasas nominales negativas** sobre reservas (UE y Japón).

**Aplicación argentina:** la inflación argentina se explica frecuentemente por crecimiento de $M$ (emisión para financiar déficit fiscal) que excede el crecimiento real de la economía. El financiamiento monetario del déficit es la conexión que hace que las dos políticas — fiscal y monetaria — no sean independientes en países con BC poco autónomo.

### Comercio internacional (apertura)

- **Exportaciones (X):** bienes y servicios vendidos al exterior.
- **Importaciones (M):** comprados al exterior.
- **Balanza comercial:** $X - M$. Componente de la cuenta corriente.
- **Tipo de cambio nominal ($e$):** precio de la moneda extranjera en moneda local.
- **[[tipo-de-cambio-real]] ($TCR$):** $TCR = e \cdot P^* / P$. Mide la competitividad relativa.

  Donde:
  - $TCR$: tipo de cambio real
  - $e$: tipo de cambio nominal (pesos por dólar)
  - $P^*$: nivel de precios extranjero
  - $P$: nivel de precios local
 Si sube → devaluación real → exportaciones más competitivas.

Las exportaciones netas $(X - M)$ entran en la DA: son demanda externa por producto local.

## Conceptos clave

### PBI y cuentas nacionales
- [[pbi]] — definición, tipos, métodos de cálculo
- [[pbi-nominal-vs-real]] — separar precios de cantidades
- [[deflactor]] — índice de precios del producto
- [[valor-agregado]] — método sectorial
- [[identidad-sectorial]] — modelo de 3 brechas

### Ciclos y empleo
- [[ciclo-economico]] — expansión, pico, recesión, valle
- [[tipos-desempleo]] — friccional, estructural, cíclico
- [[pea-pei]] — definiciones, tasas de actividad y desocupación
- [[tasa-natural-desempleo]] — friccional + estructural
- [[ley-okun]] — relación PBI-desempleo

### Inflación
- [[inflacion]] — definición, costos
- [[ipc]] — Laspeyres, sesgo de sustitución
- [[ipc-deflactor]] — comparación
- [[costos-inflacion]] — suela de zapato, menú, redistribución
- [[desinflacion]]

### Agregados macro
- [[demanda-agregada]] — pendiente negativa, 3 efectos
- [[oferta-agregada]] — CP positiva, LP vertical
- [[equilibrio-macroeconomico]]
- [[producto-potencial]]

### Política fiscal
- [[politica-fiscal]] — expansiva/contractiva
- [[multiplicador-gasto]] — $k = 1/(1-PMC)$
- [[deficit-fiscal]] — definición, sostenibilidad
- [[deuda-publica]]

### Sistema financiero y finanzas básicas
- [[tasa-interes]] — concepto, simple vs compuesto, TNA vs TEA
- [[tasa-interes-real]] — fórmula exacta vs aproximación, paridad de Fisher
- [[sistema-financiero]] — funciones, componentes, indicadores
- [[bonos-renta-fija]] — valuación, TIR, par/bajo/sobre la par
- [[rating-crediticio]] — escalas Moody's/S&P/Fitch, investment grade vs junk
- [[acciones-renta-variable]] — perpetuidad de dividendos

### Dinero
- [[dinero-funciones]] — medio de cambio, unidad de cuenta, reserva, pago diferido
- [[caracteristicas-dinero]] — portabilidad, escasez, aceptabilidad, etc.
- [[agregados-monetarios]] — BM, M1, M2, M3
- [[multiplicador-dinero]] — $m = (e+1)/(e+r)$, expansión secundaria
- [[demanda-dinero]] — motivos keynesianos, curva con pendiente negativa
- [[mercado-dinero]] — equilibrio MS=MD, determina $r$

### Política monetaria
- [[banco-central-herramientas]] — OMA, encajes, redescuento, intervención cambiaria
- [[politica-monetaria-expansiva-contractiva]]
- [[regimen-politica-monetaria]] — instrumentos → operativo → meta → objetivo
- [[metas-inflacion]] — inflation targeting
- [[ecuacion-cuantitativa]] — $MV = PY$
- [[teoria-cuantitativa-dinero]] — Friedman
- [[neutralidad-dinero]] — $\Delta M$ solo afecta $P$ en LP
- [[instrumentos-no-convencionales]] — QE, Forward Guidance, ZLB

### Sector externo
- [[balanza-comercial]] — X - M
- [[tipo-de-cambio-real]]
- [[cuenta-corriente]]

## Fórmulas principales

Ver [[formulas/unidad-05]]. Imprescindibles:
- $PBI = C + I + G + (X - M)$
- Identidad: $(S - I) + (T - G) + (M - X) \equiv 0$
- Deflactor $= PBI_{nom}/PBI_{real} \times 100$
- Tasa de inflación $= (IPC_t - IPC_{t-1})/IPC_{t-1} \times 100$
- Tasa de desocupación $= D/PEA$
- Multiplicador: $k = 1/(1-PMC)$, $\Delta Y = k \cdot \Delta G$
- $MV = PY$

## Conexiones

- **[[unidades/unidad-01-introduccion-oferta-demanda-elasticidades]]:** la lógica de oferta/demanda se generaliza a ODA; el flujo circular es prefiguración del SCN.
- **[[unidades/unidad-03-mercados-competencia-perfecta]]:** el análisis de bienestar reaparece como criterio de evaluación de políticas públicas.
- **[[unidades/unidad-04-mercados-imperfectos]]:** el poder de mercado tiene impacto macro vía mark-ups e inflación de costos.
- **Unidades 6-7-8 (parcial 2):** las cuentas nacionales son a la macro lo que la contabilidad a la empresa; las nociones de tasa de interés y descuento aparecen en cálculo financiero y evaluación de proyectos.

## Errores comunes (mirar antes del parcial)

1. **Sumar bienes intermedios al calcular PBI.** Solo cuentan los **finales**, o equivalentemente, la suma de valores agregados.
2. **Confundir PBI con PNB.** Interno (territorio) vs Nacional (residentes). En Argentina la diferencia (renta neta del exterior) suele ser negativa.
3. **Calcular crecimiento real con cifras nominales.** Hay que deflactar primero.
4. **Mezclar tasa de actividad con tasa de ocupación.** Denominadores distintos: actividad usa Población; desocupación usa PEA.
5. **Olvidar que el desempleo "cero" no es un objetivo.** El target es la tasa **natural** (friccional + estructural).
6. **Aplicar el multiplicador a $T$ con la misma fórmula que a $G$.** El multiplicador del gasto y el de impuestos no son iguales — el de $T$ tiene $-PMC$ en el numerador y es menor en valor absoluto.
7. **Interpretar la identidad de 3 brechas como causalidad.** Es **identidad contable**, no relación causal — siempre se cumple, por construcción.
8. **Pensar que más $M$ siempre genera más inflación a corto plazo.** En recesión profunda con alta capacidad ociosa, parte del aumento se traduce en $Y$, no en $P$ (los precios están "pegajosos").
9. **Asumir que un déficit fiscal "se paga con emisión".** Hay tres financiaciones posibles: deuda doméstica, deuda externa, emisión. Solo la última genera necesariamente presión inflacionaria.

## Temas sensibles para Parcial 1

- **Calcular PBI por los 3 métodos** dados datos sectoriales; distinguir bienes intermedios vs finales.
- **PBI real vs nominal y deflactor**: deflactar series, calcular tasa de crecimiento real.
- **Clasificar desempleo** y **calcular tasas** de actividad, ocupación, desocupación.
- **Identidad de 3 brechas:** dado déficit fiscal y resultado externo, deducir brecha privada.
- **Aplicar multiplicador** dado $PMC$: calcular $\Delta Y$ ante $\Delta G$.
- **Efecto cualitativo de política fiscal/monetaria** sobre DA y equilibrio macro (gráfico ODA).
- **Inflación con IPC**: tasas mensual, anual, comparación con deflactor.
- **Ecuación cuantitativa:** dado $\Delta M$, $\Delta V$, $\Delta Y$, deducir $\Delta P$.

## Nota sobre fuentes

- **Clase 1:** PBI y cuentas nacionales, métodos de cálculo, identidades.
- **Clase 2:** indicadores macroeconómicos — inflación, empleo, pobreza.
- **Clase 3 (Política Monetaria):** finanzas básicas, sistema financiero, bonos y acciones, dinero y agregados, multiplicador, banco central, demanda de dinero, política monetaria, ODA, neutralidad del dinero, metas de inflación, instrumentos no convencionales.

Las tres clases del profesor cubren prácticamente todo el programa de la Unidad 5. La sección de **Política Fiscal detallada** (multiplicador del gasto, déficit, deuda) está apoyada en el programa y bibliografía estándar — confirmar con clases adicionales si surgen.
