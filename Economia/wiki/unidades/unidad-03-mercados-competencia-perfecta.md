---
unit: 03
module: Microeconomía
title: Unidad 3 — Mercados — Competencia Perfecta
parcial: 1
sources: [Clase004eco2021.pdf, GP3_ePI_2026.pdf, GUIA 3.pdf]
last_updated: 2026-04-26
---

## Resumen

### Por qué empezar por competencia perfecta

La **competencia perfecta (CP)** es el modelo benchmark de la microeconomía. No describe ningún mercado real con exactitud, pero cumple dos funciones críticas:

1. **Punto de partida analítico:** integra producción (Unidad 2) con mercado (Unidad 1) y produce predicciones cuantitativas precisas.
2. **Estándar de bienestar:** en CP el mercado **maximiza el bienestar total** (suma de excedentes). Cualquier otra estructura — monopolio, oligopolio, regulación — se evalúa por *cuánto se aparta* del óptimo competitivo. Es la "barra alta" frente a la cual se mide la ineficiencia.

### Los cuatro supuestos

La CP requiere *simultáneamente* las cuatro [[competencia-perfecta-caracteristicas|características]]:

1. **Producto homogéneo:** todas las empresas venden bienes idénticos (commodities tipo trigo, electricidad mayorista). Implica que los compradores son indiferentes entre proveedores y solo compran a quien ofrezca el menor precio.
2. **Atomicidad:** muchas empresas pequeñas, ninguna con poder de mercado. Cada una representa una fracción minúscula de la oferta.
3. **Libre entrada y salida:** no hay barreras (legales, tecnológicas, de capital). Esta condición es la que disciplina los beneficios económicos en LP.
4. **Información perfecta:** todos los agentes conocen precios, calidades y oportunidades de manera instantánea y sin costo.

### La empresa precio-aceptante

De los supuestos se deriva el rasgo definitorio: la firma toma el precio de mercado **como dado** ([[empresa-precio-aceptante|precio-aceptante]] o *price-taker*). Si vendiera arriba del precio de mercado, no le compraría nadie (productos homogéneos + información perfecta). Si vendiera abajo, vendería todo lo que pueda a ese precio menor — pero al ser tan chica no le conviene cobrar menos.

Consecuencia gráfica: la **demanda individual** que enfrenta la firma es **horizontal** al precio de mercado $P^*$. De ahí:

$$P = IMg = IMe$$

Donde:
- $P$: precio de mercado (dado a la firma)
- $IMg$: ingreso marginal (por unidad adicional vendida)
- $IMe$: ingreso medio ($I/q$, el ingreso por unidad)

Cada unidad adicional vendida agrega exactamente $P$ al ingreso. Esto distingue a CP de cualquier estructura imperfecta (Unidad 4), donde $IMg < P$.

Atención a la doble lectura del gráfico: el mercado tiene una demanda con pendiente negativa (la suma de muchas demandas individuales), pero **cada empresa enfrenta una demanda horizontal** porque su efecto sobre el precio es despreciable.

![[competencia-perfecta-empresa.svg]]

### Decisión de producción en corto plazo

La empresa maximiza beneficio aplicando la regla universal $IMg = CMg$, que en CP se reduce a:

$$\boxed{P = CMg}$$

Donde:
- $CMg$: costo marginal (costo de producir una unidad más)

Esta condición determina el $q^*$ óptimo. El beneficio resultante es:

$$\pi = (P - CTMe(q^*)) \cdot q^*$$

Donde:
- $\pi$: beneficio económico
- $CTMe$: costo total medio ($CT/q$)
- $q^*$: cantidad óptima (la que cumple $P = CMg$)

Tres zonas según dónde caiga $P$:

| Posición de $P$ | Decisión | Resultado |
|---|---|---|
| $P > CTMe(q^*)$ | Producir | **Beneficios extraordinarios** ($\pi > 0$) |
| $CVMe(q^*) < P \leq CTMe(q^*)$ | Producir a pérdida | Pierde menos que cerrando — cubre parte del CF |
| $P \leq CVMe(q^*)$ | **Cerrar** | $q^* = 0$, pérdida $= -CF$ (lo mínimo posible) |

**Por qué seguir produciendo a pérdida tiene sentido:** los $CF$ son **costos hundidos** en el corto plazo (alquileres, máquinas) y se pagan se produzca o no. Mientras el ingreso por unidad cubra el $CVMe$, cada unidad vendida ayuda a recuperar parte del $CF$. Si no cubre ni $CVMe$, mejor parar — al menos no se gasta más en variables.

![[maximizacion-cp-zonas.svg]]

**Puntos críticos clave:**
- **[[punto-cierre|Punto de cierre]]:** $P_{cierre} = \min(CVMe)$ — abajo de esto, conviene salir aunque sea temporariamente.
- **[[umbral-rentabilidad|Umbral de rentabilidad]]:** $P_{UR} = \min(CTMe)$ — arriba de esto hay beneficios económicos positivos.

**Cierre (CP) vs Salida (LP) — distinción de clase:**

| | Cierre | Salida |
|---|---|---|
| Plazo | Corto plazo | Largo plazo |
| Condición | $P < \min(CVMe)$ | $P < \min(CMe_{LP})$ |
| ¿Sigue pagando $CF$? | **Sí** (los CF son hundidos) | No (liquida activos) |
| Pérdida | $-CF$ | 0 |
| Reversibilidad | Reversible | Definitiva |

El "cierre" es una decisión operativa transitoria: la planta queda parada pero la empresa existe. La "salida" es la decisión estructural que se vuelve posible solo en LP.

### La curva de oferta de la empresa y de la industria

La **curva de oferta de la empresa en corto plazo** es **el tramo del $CMg$ por encima del mínimo del $CVMe$**. Razonamiento: para cada precio dado, la empresa producirá donde $P = CMg$ — pero solo si está arriba del punto de cierre.

La **curva de oferta de la industria** es la **suma horizontal** de las ofertas individuales: a cada $P$, sumamos cantidades de todas las firmas. Esta es la curva de oferta de la Unidad 1 — finalmente "demostrada" desde primeros principios.

### Equilibrio de largo plazo: el rol de la libre entrada

El LP es donde la CP da sus resultados más potentes. Mecanismo:

- Si en CP las empresas tienen $\pi > 0$ → entran nuevas firmas (libre entrada) → aumenta la oferta de mercado → cae $P$ → cae $\pi$.
- Si en CP las empresas tienen $\pi < 0$ → salen firmas → cae oferta → sube $P$ → recupera $\pi$.

El proceso se detiene cuando los beneficios económicos llegan a cero — el **"beneficio normal"** (las firmas cubren costo de oportunidad del capital, ni más ni menos). En equilibrio de LP:

$$\boxed{P^* = CMg = \min(CMe_{LP})}$$

Donde:
- $P^*$: precio de equilibrio de largo plazo
- $CMe_{LP}$: costo medio de largo plazo (todos los factores variables)

**Tres consecuencias notables:**
1. El precio de LP queda determinado *exclusivamente* por la **tecnología** (el mínimo del $CMe_{LP}$), no por la demanda. Cambios de demanda solo afectan **cantidad**, no precio (en LP).
2. Cada firma sobreviviente opera a la **escala eficiente mínima**.
3. No hay "rentas" — los recursos están perfectamente asignados.

![[equilibrio-lp-cp.svg]]

### Análisis de bienestar

Dos áreas miden el valor que el mercado crea:

- **[[excedente-consumidor|Excedente del consumidor (EC)]]:** área entre la curva de demanda y el precio de mercado, hasta $Q^*$. Mide cuánto más estaba dispuesto a pagar el consumidor de lo que efectivamente pagó.
- **[[excedente-productor|Excedente del productor (EP)]]:** área entre el precio y la curva de oferta, hasta $Q^*$. Mide la diferencia entre lo que recibió la empresa y su costo (variable).

**Bienestar total:** $W = EC + EP$. El equilibrio competitivo lo **maximiza** — primer teorema fundamental de la economía del bienestar.

### Impuestos e incidencia: el caso emblemático

Un impuesto $t$ por unidad sobre el productor desplaza la oferta hacia arriba en exactamente $t$ (la firma necesita $t$ más por unidad para producir lo mismo). Resultado:

- Sube el precio que paga el consumidor: $P_c$.
- Baja el precio neto que recibe el productor: $P_p = P_c - t$.
- Cae la cantidad transada: $Q_2 < Q_1$.
- Aparece **recaudación fiscal:** $T = t \cdot Q_2$ (rectángulo).
- Aparece **[[deadweight-loss|pérdida irrecuperable de eficiencia (DWL)]]:** triángulo entre la nueva $Q_2$ y la $Q_1$ original. Son intercambios mutuamente beneficiosos que ya no ocurren — pérdida de bienestar pura.

**[[incidencia-impuestos|Incidencia]]: ¿quién paga realmente el impuesto?** La carga se reparte según las **elasticidades relativas**:

| Situación | Resultado |
|---|---|
| Demanda más inelástica que oferta | El consumidor carga la mayor parte |
| Oferta más inelástica que demanda | El productor carga la mayor parte |
| Demanda perfectamente inelástica | Consumidor paga 100% |
| Oferta perfectamente inelástica | Productor paga 100% |

**Lección central:** "el que no puede irse, paga". El agente menos elástico (menos opciones de fuga) carga más. Quién es legalmente responsable del impuesto **no determina** la incidencia económica.

**El tamaño del DWL** crece con las elasticidades — cuanto más reactivos los agentes, más cantidad se "pierde" por el impuesto. Por eso los Estados gravan bienes **inelásticos** (cigarrillos, alcohol, combustibles) cuando buscan recaudación, y bienes **elásticos** cuando buscan desincentivar consumo.

![[impuesto-dwl.svg]]

## Conceptos clave

- [[estructuras-mercado]] — espectro de CP a monopolio
- [[competencia-perfecta-caracteristicas]] — los 4 supuestos
- [[empresa-precio-aceptante]] — demanda individual horizontal
- [[punto-cierre]] — $\min(CVMe)$
- [[umbral-rentabilidad]] — $\min(CTMe)$
- [[curva-oferta-empresa]] — $CMg$ arriba del cierre
- [[equilibrio-corto-vs-largo-plazo]]
- [[beneficios-normales-extraordinarios]] — $\pi_{econ} = 0$ en LP
- [[excedente-consumidor]]
- [[excedente-productor]]
- [[deadweight-loss]] — pérdida irrecuperable
- [[incidencia-impuestos]] — peso según elasticidades

## Fórmulas principales

Ver [[formulas/unidad-03]]. Imprescindibles:
- Maximización: $P = CMg$
- Beneficio: $\pi = (P - CTMe) \cdot q^*$
- Cierre: $P < CVMe$
- LP: $P^* = \min(CMe_{LP})$
- Beneficio económico: $I - wL - rK$ (incluye costo oportunidad del capital)

## Ejercicios

- [[ejercicios/gp3-competencia-monopolio]] — guía mixta (Ej 1-4 corresponden a CP, Ej 5-10 a Unidad 4)

## Conexiones

- **[[unidades/unidad-02-produccion-y-costos]]:** usa $CMg$, $CVMe$, $CTMe$ directamente; el equilibrio de LP es exactamente el mínimo del $CMe_{LP}$ derivado allí.
- **[[unidades/unidad-04-mercados-imperfectos]]:** contraste directo. En CP, $P = CMg$. En estructuras imperfectas, $P > CMg$ (Índice de Lerner > 0). El DWL del monopolio se mide respecto del óptimo competitivo.
- **[[unidades/unidad-01-introduccion-oferta-demanda-elasticidades]]:** la curva de oferta de la industria que se trabajaba allí se *deduce* aquí; la incidencia impositiva depende de las elasticidades introducidas en la Unidad 1.
- **[[unidades/unidad-05-macroeconomia]]:** el análisis de bienestar reaparece como criterio de evaluación de políticas (fiscal, monetaria, comercial).

## Errores comunes (mirar antes del parcial)

1. **Confundir la demanda de la industria con la demanda de la empresa.** La empresa enfrenta una demanda *horizontal*, aunque la del mercado tenga pendiente negativa.
2. **No cerrar cuando $P < CVMe$.** Hay que mirar el promedio variable, no el total. Si no cubre ni los variables, parar.
3. **Calcular $\pi = P \cdot Q - CV$ olvidando $CF$.** El beneficio es $P \cdot Q - CT = (P - CTMe) \cdot Q$.
4. **Confundir umbral de rentabilidad con punto de cierre.** UR = $\min(CTMe)$; cierre = $\min(CVMe)$. Entre ambos hay zona de pérdida con producción.
5. **Asumir que en LP los beneficios son siempre cero "porque sí".** Es consecuencia de la **libre entrada**: si hubiera barreras (Unidad 4), los beneficios pueden persistir.
6. **Decir que el productor paga el impuesto si la ley lo grava.** La incidencia económica depende de elasticidades, no de quién recauda.
7. **Olvidar que el DWL es área**, no diferencia de cantidades. Es un triángulo entre demanda, oferta original y la nueva cantidad transada.

## Temas sensibles para Parcial 1

- **Identificar zona** dado $P$ y curvas: ¿beneficio? ¿pérdida con producción? ¿cierre?
- **Determinar $q^*$** a partir de $P = CMg$ y calcular beneficio.
- **Equilibrio LP:** dado $CMe_{LP}$, encontrar precio de LP y verificar que $\pi = 0$.
- **Calcular DWL** tras un impuesto unitario $t$: identificar $Q_1$, $Q_2$, $P_c$, $P_p$ y construir el triángulo.
- **Distribución de la carga impositiva** con elasticidades dadas: $\Delta P_c / \Delta P_p$ depende de $\varepsilon_d / \varepsilon_s$.
- **Pasar de oferta individual a oferta de industria** sumando horizontalmente.
- **Comparar bienestar antes/después de una intervención** (subsidio, impuesto, control de precio): variación en EC, EP y eventual T.
