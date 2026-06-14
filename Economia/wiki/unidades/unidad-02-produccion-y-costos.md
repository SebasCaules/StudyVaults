---
unit: 02
module: Microeconomía
title: Producción y Costos
parcial: 1
sources: [Clase003eco2023.pdf, GP2_ePI_2024.pdf, GUIA 2.pdf]
last_updated: 2026-04-26
---

## Resumen

### De dónde viene la oferta

La Unidad 1 tomó la curva de oferta como un dato. Esta unidad explica **de dónde sale**: del comportamiento de una empresa que combina factores de producción para generar un bien y minimizar costos. Toda curva de oferta es, en última instancia, una curva de costo marginal — una afirmación que se verá rigurosamente en la Unidad 3 pero cuya fundamentación está acá.

La empresa se modela mediante una **función de producción** $Q = F(K, L)$ que vincula los factores **capital ($K$)** y **trabajo ($L$)** con el output.

Donde:
- $Q$: producto total (output físico)
- $K$: capital (fijo en corto plazo)
- $L$: trabajo (factor variable)

La distinción clave es temporal:

- **Corto plazo (CP):** al menos un factor está fijo (típicamente $K$). Las decisiones se toman moviendo $L$.
- **Largo plazo (LP):** todos los factores son variables. La empresa puede expandir o cerrar plantas, cambiar tecnología, redimensionar.

La frontera entre CP y LP no es cronológica sino **tecnológica/contractual**: depende de cuán rápido puede ajustarse cada factor. Una panadería puede pasar a LP en meses; una refinería en años.

### Producción en corto plazo

Con $K$ fijo, la empresa contrata más $L$. Tres curvas conectan este proceso:

- **Producto total ($PT$ o $Q$):** crece con $L$, pero a tasa decreciente y eventualmente puede caer.
- **Producto medio ($PMe_L = Q/L$):** "productividad por trabajador". Tiene forma de U invertida.
- **Producto marginal ($PMg_L = \partial Q/\partial L$):** lo que aporta el trabajador adicional. También U invertida, *adelantada* respecto del PMe.

Donde:
- $PT$: producto total (output)
- $PMe_L$: productividad media del trabajo (output promedio por trabajador)
- $PMg_L$: productividad marginal del trabajo (aporte de la última unidad de $L$)

**Tabla de referencia (clase, $K = 10$ fijo):**

| $L$ | $Q$ ($PT$) | $PMe = Q/L$ | $PMg = \Delta Q$ | Etapa |
|---|---|---|---|---|
| 1 | 10 | 10 | 10 | I |
| 2 | 30 | 15 | 20 | I |
| 3 | 60 | 20 | 30 | I |
| 4 | 80 | **20** | 20 | I → II (máx PMe) |
| 5 | 95 | 19 | 15 | II |
| 6 | 108 | 18 | 13 | II |
| 7 | 112 | 16 | 4 | II |
| 8 | **112** | 14 | **0** | II → III (máx PT) |
| 9 | 108 | 12 | -4 | III |
| 10 | 100 | 10 | -8 | III |

Identificar las **transiciones**: máximo del PMe (L=4) cierra Etapa I; PMg=0 (L=8) cierra Etapa II. La empresa racional opera entre $L=4$ y $L=8$.

**Relaciones geométricas que aparecen en parciales:**
- $PMg$ corta a $PMe$ en el **máximo del PMe** (cuando el último trabajador rinde igual que el promedio, deja de tirar el promedio para arriba).
- Cuando $PMg = 0$, el $PT$ alcanza su **máximo** (el trabajador adicional no aporta nada).
- **Tres etapas de producción:**
  - **Etapa I:** $L$ bajo, $PMe$ creciente, especialización aún no agotada. *Subóptimo.*
  - **Etapa II:** $PMe$ decreciente pero $PMg > 0$. **Zona racional** — la empresa siempre opera aquí.
  - **Etapa III:** $PMg < 0$, agregar $L$ reduce $Q$. *Irracional.*

![[producto-total-marginal-medio.svg]]

### Ley de rendimientos marginales decrecientes

A partir de cierto nivel, agregar más unidades de un factor variable ($L$) manteniendo otros fijos ($K$) **reduce** el aporte marginal de ese factor. Es una ley **empírica del corto plazo**, no un teorema, y es la razón por la cual el $PMg$ termina cayendo. No debe confundirse con rendimientos a escala (LP).

### Costos en corto plazo

De la función de producción se derivan los costos. Si solo $L$ es variable y se compra a salario $w$:

- **Costo fijo ($CF$):** independiente de $Q$ (alquileres, máquinas).
- **Costo variable ($CV = w \cdot L$):** crece con la producción.
- **Costo total:** $CT = CF + CV$.
- **Promedios:** $CFMe = CF/Q$ (cae siempre, hipérbola), $CVMe = CV/Q$, $CTMe = CT/Q = CFMe + CVMe$.
- **Marginal:** $CMg = \partial CT/\partial Q = w/PMg_L$.

Donde:
- $CF$: costo fijo (independiente de $Q$)
- $CV$: costo variable (depende de $Q$)
- $CT$: costo total
- $w$: salario unitario del trabajo
- $CFMe, CVMe, CTMe$: costos medios (fijo, variable, total)
- $CMg$: costo marginal (costo de la unidad adicional)

**Dato central — relaciones entre curvas (¡parcialmente garantizado!):**

| Si... | ...entonces |
|---|---|
| $CMg < CTMe$ | $CTMe$ está cayendo |
| $CMg > CTMe$ | $CTMe$ está subiendo |
| $CMg = CTMe$ | $CTMe$ está en su mínimo |

La misma relación vale para $CVMe$. **El $CMg$ corta al $CVMe$ y al $CTMe$ exactamente en sus mínimos.** Es la consecuencia matemática de que el marginal "tira" del promedio: si el siguiente está abajo, baja el promedio; si está arriba, lo sube.

**Forma típica de las curvas:** $CMg$ y los promedios son curvas en forma de **U** (excepto $CFMe$, que decrece monotónicamente). La razón económica es la ley de rendimientos decrecientes: al inicio agregar trabajadores es eficiente y los costos caen; pasado un punto, la planta se congestiona y los costos suben.

![[curvas-costos-corto-plazo.svg]]

### Producción y costos en largo plazo

En LP no hay factores fijos. La empresa elige la **escala** óptima. Aparecen los **rendimientos a escala** — propiedad distinta a los rendimientos marginales:

| Si al multiplicar $K$ y $L$ por $\lambda$, $Q$ se multiplica por... | Rendimientos | $CMe_{LP}$ | Estructura típica |
|---|---|---|---|
| $> \lambda$ | **Crecientes** (economías de escala) | Decreciente | Monopolio natural |
| $= \lambda$ | **Constantes** | Plano | Competencia |
| $< \lambda$ | **Decrecientes** (deseconomías) | Creciente | Múltiples firmas chicas |

La **escala eficiente mínima ([[escala-eficiente-minima]])** es el menor $Q$ que minimiza $CMe_{LP}$. Si la demanda total del mercado cabe en una sola empresa operando a escala eficiente → **monopolio natural**. Si se necesitan muchas → competencia. Esta lógica conecta directamente con la decisión de estructura de mercado de las Unidades 3 y 4.

La **curva $CMe_{LP}$ es la envolvente** de las $CMe_{CP}$: cada planta de tamaño dado tiene su propia curva de CP, y el LP "elige" la mejor planta para cada nivel de producción.

![[curva-cme-largo-plazo.svg]]

### El caso histórico: Malthus y los rendimientos decrecientes

Thomas Malthus (1798) predijo hambruna porque la **población crece geométricamente** mientras los **alimentos crecen aritméticamente** (consecuencia de los rendimientos decrecientes en agricultura, con tierra fija). La predicción **falló empíricamente**: el progreso tecnológico desplazó la función de producción hacia arriba más rápido de lo que crecía la población. Índice mundial de producción de alimentos per cápita: 100 (1961) → 151 (2013).

**Lección metodológica:** los rendimientos decrecientes son una propiedad de **una función de producción dada**; el cambio tecnológico es justamente lo que hace que esa función se mueva. El análisis estático con factores fijos puede engañar si se proyecta al largo plazo.

### Costos económicos vs contables

Una de las distinciones más importantes y olvidadas:

- **Costo contable:** desembolsos monetarios (lo que aparece en la factura).
- **Costo económico:** costo contable + **[[costo-de-oportunidad]] de los factores propios** (capital del dueño, tiempo, terreno propio).

Por lo tanto:
- **Beneficio contable:** $\pi_{cont} = I - wL$
- **Beneficio económico:** $\pi_{econ} = I - wL - rK$

Donde:
- $\pi_{cont}, \pi_{econ}$: beneficio contable y económico
- $I$: ingreso total
- $r$: costo de oportunidad del capital propio (rendimiento alternativo)

Una empresa puede tener beneficio contable positivo y beneficio económico nulo (o negativo): está cubriendo desembolsos pero **no genera más valor que el que generaría poniendo el capital en otra inversión**. El **"beneficio normal"** que se mencionará en la Unidad 3 es exactamente eso: $\pi_{econ} = 0$, lo justo para retener el capital en esa actividad.

### Maximización del beneficio: la regla universal

Para *cualquier* estructura de mercado (CP, monopolio, oligopolio), la empresa maximiza beneficio donde el ingreso marginal iguala el costo marginal:

$$\boxed{IMg = CMg}$$

Donde:
- $IMg$: ingreso marginal (variación del ingreso por la unidad adicional)
- $CMg$: costo marginal (variación del costo por la unidad adicional)

La diferencia entre estructuras está en *cómo se calcula el IMg*:
- **Competencia perfecta** (Unidad 3): $IMg = P$, porque la demanda individual es horizontal.
- **Monopolio / oligopolio** (Unidad 4): $IMg < P$, porque la demanda tiene pendiente negativa.

Pero el principio — producir mientras la próxima unidad agregue más al ingreso que al costo — es el mismo. Esa universalidad es el motivo por el cual esta unidad es la "columna vertebral" del módulo de microeconomía.

## Conceptos clave

### Producción
- [[funcion-produccion]] — $Q = F(K, L)$
- [[productividad-marginal]] — $PMg = \partial Q/\partial L$
- [[productividad-media]] — $PMe = Q/L$
- [[rendimientos-marginales-decrecientes]] — fenómeno de CP
- [[rendimientos-a-escala]] — fenómeno de LP (crecientes/constantes/decrecientes)
- [[corto-vs-largo-plazo]]
- [[etapas-produccion]] — I (subóptima), II (racional), III (irracional)

### Costos
- [[costos-economicos-vs-contables]] — distinción clave
- [[costo-de-oportunidad]]
- [[costos-fijos-variables]]
- [[costo-marginal]] — $CMg$
- [[costos-medios]] — $CFMe$, $CVMe$, $CTMe$
- [[curvas-costos]] — formas en U y relaciones entre ellas
- [[escala-eficiente-minima]] — mínimo de $CMe_{LP}$
- [[economias-deseconomias-escala]]

### Maximización del beneficio
- [[ingreso-marginal]] — $IMg$
- [[regla-IMg-CMg]] — condición de óptimo (universal)
- [[beneficio-economico]] vs contable

## Fórmulas principales

Ver [[formulas/unidad-02]]. Imprescindibles:
- $CMg = w / PMg_L$ (cuando solo $L$ es variable)
- $CMg$ corta $CVMe$ y $CTMe$ en sus **mínimos**
- $\pi_{econ} = I - wL - rK$
- Condición óptima: $IMg = CMg$

## Ejercicios

- [[ejercicios/gp2-produccion-costos]]
- [[ejercicios/guia-2-resoluciones]]

## Conexiones

- **[[unidades/unidad-01-introduccion-oferta-demanda-elasticidades]]:** la curva de oferta es (esencialmente) la curva de $CMg$ por encima del $CVMe$. La elasticidad de la oferta depende de cómo de "vertical" sea la $CMg$.
- **[[unidades/unidad-03-mercados-competencia-perfecta]]:** aplica estas curvas al óptimo competitivo ($P = CMg$); el equilibrio de LP es exactamente el mínimo del $CMe_{LP}$.
- **[[unidades/unidad-04-mercados-imperfectos]]:** mismas curvas de costos, pero la regla de demanda cambia ($IMg < P$).
- **Unidades 6-7 (parcial 2):** los conceptos de costos económicos vs contables y costo de oportunidad reaparecen al evaluar proyectos (TIR, VAN).

## Errores comunes (mirar antes del parcial)

1. **Confundir rendimientos marginales decrecientes con rendimientos a escala decrecientes.** El primero es de CP (un factor fijo); el segundo es de LP (todos varían).
2. **Decir que el $CMg$ corta al $CFMe$ en su mínimo.** No: $CFMe$ no tiene mínimo (es decreciente). El corte es con $CVMe$ y $CTMe$.
3. **Olvidar el $rK$ del costo económico.** Si la consigna pide beneficio económico, hay que incluir el costo de oportunidad del capital, no solo $wL$.
4. **Producir en Etapa III "porque el PT sigue siendo positivo".** Etapa III tiene $PMg < 0$: agregar $L$ reduce $Q$. Nunca racional.
5. **Asumir que los costos siempre son crecientes.** $CMg$ y $CMe$ pueden caer al inicio (etapa de especialización) antes de subir.
6. **Tratar la regla $IMg = CMg$ como exclusiva de monopolio.** Es universal; en CP simplemente se reduce a $P = CMg$ porque $IMg = P$.

## Temas sensibles para Parcial 1

- **Identificar etapas de producción** dado un cuadro de $L$, $Q$, $PMe$, $PMg$. Zona racional = entre máximo de $PMe$ y máximo de $PT$.
- **Dibujar curvas de costos** y mostrar cortes en mínimos (CMg con CVMe y CTMe).
- **Calcular $q^*$ que maximiza beneficio** dadas $C(q)$ e $I(q)$: derivar, igualar $IMg = CMg$, despejar.
- **Rendimientos a escala** dado $Q = K^\alpha L^\beta$ tipo Cobb-Douglas: si $\alpha + \beta > 1$ crecientes, $= 1$ constantes, $< 1$ decrecientes.
- **Distinción contable vs económico:** dada información de la empresa, calcular ambos beneficios y explicar diferencia.
- **Pasaje de productividad a costos:** si te dan $PMg$, recordar $CMg = w/PMg$.
