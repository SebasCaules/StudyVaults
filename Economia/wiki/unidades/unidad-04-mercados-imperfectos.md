---
unit: 04
module: Microeconomía
title: Monopolio, Competencia Monopolística y Oligopolio
parcial: 1
sources: [Clase005eco2021.pdf]
last_updated: 2026-04-26
---

## Resumen

### Por qué los mercados se desvían de la competencia perfecta

La competencia perfecta requería cuatro supuestos simultáneos. En la realidad, casi ningún mercado los cumple todos: hay diferenciación de productos, número limitado de firmas, asimetrías de información, barreras a la entrada. Esta unidad estudia las tres estructuras imperfectas más relevantes, ordenadas por **grado de poder de mercado**:

| Estructura | Nº empresas | Producto | Barreras entrada | Poder de mercado |
|---|---|---|---|---|
| Competencia perfecta | Muchísimas | Homogéneo | Ninguna | Nulo |
| **Competencia monopolística** | Muchas | Diferenciado | Bajas | Bajo |
| **Oligopolio** | Pocas | Homogéneo o diferenciado | Altas | Alto |
| **Monopolio** | Una | Único (sin sustitutos cercanos) | Muy altas | Total |

### El rasgo común: pendiente negativa de la demanda

A diferencia de CP, en cualquier estructura imperfecta la **firma enfrenta una demanda con pendiente negativa**: si quiere vender más, debe bajar el precio. Esto trae una consecuencia algebraica con un peso enorme:

$$IMg < P$$

Donde:
- $IMg$: ingreso marginal (por la unidad adicional)
- $P$: precio de venta de cada unidad

Cuando el monopolista vende una unidad adicional, gana $P$ por esa unidad pero **pierde** ingreso en todas las unidades anteriores que ahora vende a un precio más bajo. El ingreso marginal incorpora ambos efectos:

$$IMg = \frac{dI}{dQ} = P + Q \cdot \frac{dP}{dQ} < P \quad (\text{porque } dP/dQ < 0)$$

Donde:
- $I$: ingreso total ($P \cdot Q$)
- $Q$: cantidad total vendida
- $dP/dQ$: pendiente de la demanda (negativa)

Para una demanda lineal $P = a - bQ$, el $IMg$ es $IMg = a - 2bQ$ — la **misma ordenada al origen pero el doble de pendiente**. Es un resultado que aparece prácticamente garantizado en parcial.

Donde:
- $a$: ordenada al origen (precio máximo de la demanda)
- $b$: pendiente (en módulo) de la demanda lineal

La regla universal $IMg = CMg$ sigue valiendo, pero al cumplirse en un punto donde $IMg < P$, el resultado es:

- **Precio más alto** que en CP.
- **Cantidad menor** que en CP.
- **Beneficios económicos positivos** sostenibles (por barreras a la entrada).
- **Pérdida de bienestar**: aparece DWL.

### Monopolio

Una sola empresa abastece todo el mercado. Su existencia depende de **[[barreras-entrada|barreras a la entrada]]** que pueden ser:

1. **Recurso único:** la firma controla el insumo crítico (De Beers con diamantes durante mucho tiempo).
2. **Concesión legal:** patente, licencia exclusiva, marca registrada (medicamentos bajo patente, monopolios estatales).
3. **[[monopolio-natural]]:** la tecnología tiene **economías de escala suficientemente grandes** como para que una sola firma produzca toda la demanda a costo menor que dos firmas. Típico de redes (electricidad, gas, agua, ferrocarriles).

**Decisión del monopolista:** elegir $Q^*$ donde $IMg(Q) = CMg(Q)$, fijar $P^*$ subiendo a la curva de demanda.

**Ejemplo numérico (clase):** $C(Q) = 50 + Q^2$ y $P(Q) = 40 - Q$:
- $CMg = 2Q$, $IMg = 40 - 2Q$.
- $IMg = CMg \Rightarrow 40 - 2Q = 2Q \Rightarrow Q^* = 10$.
- $P^* = 40 - 10 = 30$.
- $CMe = 50/10 + 10 = 15$.
- $\pi = (P - CMe) \cdot Q = (30 - 15) \cdot 10 = 150$.

**Análisis de bienestar — por qué hay DWL:**
Comparando con CP (donde $P = CMg$ daría $Q_{CP} = 20$, $P_{CP} = 20$):
- **Área A** (rectángulo entre $P_{monop}$ y $P_{CP}$, hasta $Q^*$): **transferencia** de excedente del consumidor al productor. *No es pérdida social*, solo redistribución.
- **Áreas B + C** (triángulo entre $Q^*$ y $Q_{CP}$): **DWL** — intercambios mutuamente beneficiosos que no ocurren porque el monopolista restringe la oferta para mantener el precio alto. Es pérdida pura.

![[monopolio-equilibrio.svg]]

**[[indice-lerner|Índice de Lerner]]** mide el poder de mercado:

$$L = \frac{P - CMg}{P} = \frac{1}{|\varepsilon|}$$

Donde:
- $L$: índice de Lerner (margen relativo sobre el costo)
- $CMg$: costo marginal en $Q^*$
- $\varepsilon$: elasticidad precio de la demanda (en módulo)

- $L = 0$ → CP (sin poder de mercado, $P = CMg$).
- $L \to 1$ → poder máximo (demanda muy inelástica).

**Corolario importante:** el monopolista **nunca opera en el tramo inelástico** de la demanda ($|\varepsilon| < 1$). En esa región $IMg < 0$: bajar $Q$ aumenta el ingreso. El monopolista siempre opera donde $|\varepsilon| > 1$.

### Competencia monopolística

Muchas empresas con **productos diferenciados** (restaurantes, ropa, libros, software). La diferenciación da a cada firma un mini-monopolio sobre su versión del producto, pero los sustitutos cercanos limitan el poder.

**Características:**
- Demanda con pendiente negativa pero **muy elástica** (sustitutos abundantes).
- Libre entrada y salida.
- Productos diferenciados — competencia no solo en precio sino en calidad, marca, ubicación, publicidad.

**Equilibrio en CP (corto plazo):** como en monopolio: $IMg = CMg$, beneficios positivos.

**Equilibrio en LP:** la libre entrada erosiona los beneficios. Cuando llegan nuevas firmas, la demanda de cada firma existente se desplaza a la izquierda y se vuelve más elástica. El proceso para cuando $\pi_{econ} = 0$, lo que algebraicamente significa:

$$P = CMe \quad \text{y} \quad IMg = CMg$$

Es decir, la curva de demanda termina **tangente** a la $CMe$. Pero crucialmente, **persiste $P > CMg$** — entonces sigue habiendo DWL, aunque menor que en monopolio. Otra fuente de ineficiencia: las firmas operan con **exceso de capacidad** (no en el mínimo de $CMe$).

¿Por qué la sociedad tolera esta ineficiencia? Porque el costo se compensa con el **valor de la diversidad**: el consumidor prefiere elegir entre 20 marcas de cerveza aunque cada una sea un poco más cara que si hubiera una sola estandarizada.

![[competencia-monopolistica-lp.svg]]

### Oligopolio

Pocas empresas con **interdependencia estratégica**: la decisión de cada una afecta a las demás de manera no despreciable. Imposible analizar a una firma aisladamente — hay que modelar la interacción mediante **teoría de juegos**.

**Concepto central: [[teoria-juegos-nash|equilibrio de Nash]].** Una situación es un equilibrio de Nash si **ninguna firma puede mejorar cambiando unilateralmente su estrategia**, dado lo que hacen las demás. Es un punto de "estabilidad estratégica", no necesariamente eficiente.

**Cárteles ([[cartel|colusión explícita]], como OPEP):** las firmas acuerdan reducir la oferta y subir el precio, replicando el resultado del monopolio entre todas. Funciona si:
- Demanda inelástica (la subida de precio no espanta a los compradores).
- Pocas firmas y barreras a la entrada (sino entran outsiders).
- Mecanismos para detectar y sancionar "tramposos".

**Problema clásico — dilema del prisionero:** cada firma tiene incentivo individual a *desviarse* (producir más que la cuota acordada para ganar más a expensas de los socios). Si todas se desvían, vuelve el resultado competitivo. Por eso los cárteles tienden a ser inestables salvo que haya un mecanismo de enforcement creíble.

**Otros modelos de oligopolio (mencionados):** Cournot (compiten en cantidades), Bertrand (compiten en precios), Stackelberg (líder y seguidor). No se desarrollan en profundidad, pero la idea común es que el resultado típicamente está **entre** monopolio y CP.

**Cárteles exitosos vs fracasados (clase):**

| Exitosos | Fracasados |
|---|---|
| OPEP (petróleo) | CIPEC (cobre) |
| Bauxita (parcial) | Estaño |
| Mercurio | Café, té, cacao |

**Por qué CIPEC fracasó frente a OPEP:** la **demanda total y la oferta competitiva del cobre son elásticas** (hay sustitutos como aluminio, países productores fuera del cártel reaccionan al precio). En cambio, la demanda de petróleo es muy inelástica en el corto plazo y los productores fuera de OPEP tenían capacidad limitada de aumentar oferta. Lección: un cártel funciona solo si controla suficiente oferta y enfrenta demanda inelástica.

### Monopsonio

Estructura simétrica al monopolio pero del lado de la **demanda del factor**: un solo comprador (típicamente, único empleador en una región o un único comprador de un insumo). Implicaciones:

- El monopsonista enfrenta una **curva de oferta del factor con pendiente positiva** — para contratar más trabajo (o comprar más insumos), debe pagar un salario mayor también a las unidades anteriores.
- Por eso el **costo marginal del factor** ($CMg_L$) es mayor que el salario promedio ($w$): cada nueva contratación encarece a todas las anteriores.
- Condición de óptimo: $VPMg_L = CMg_L$ (no $VPMg_L = w$).
- Resultado: el monopsonista contrata **menos** trabajo y paga **menos** salario que un mercado competitivo.

**Oligopsonio:** pocos compradores (acopiadores de granos en regiones aisladas, pocas terminales automotrices comprando autopartes a muchos talleres).

**Implicancia política:** justifica el salario mínimo en mercados con monopsonio — un piso salarial puede aumentar empleo y salario simultáneamente, a diferencia de un mercado competitivo donde solo genera desempleo.

### Discriminación de precios

Una herramienta del monopolista (y firmas con poder de mercado en general) para extraer más excedente. Tres grados:

| Grado | Mecanismo | Ejemplo |
|---|---|---|
| **1er grado (perfecta)** | Cobrar a cada consumidor exactamente su precio de reserva | Negociación uno-a-uno, subastas personalizadas |
| **2do grado** | Precio depende de la cantidad comprada (descuentos por volumen, tarifas en bloques) | "1 botella $6, 2 por $10", combos de fast-food |
| **3er grado** | Segmentar mercados con elasticidades distintas, cobrar precio diferente a cada segmento | Tarifas estudiantes/jubilados, precio diferencial por género o edad, geografía |

**Regla de la discriminación de 3er grado:** $IMg_1 = IMg_2 = CMg$ implica que **el mercado más inelástico paga más caro**. Es una aplicación directa del Índice de Lerner por segmento.

![[discriminacion-3er-grado.svg]]

**Condiciones para que sea factible:**
- La firma debe tener poder de mercado (no funciona en CP — habría arbitraje).
- Posibilidad de **segmentar** identificando el tipo de consumidor.
- Imposibilidad de **arbitraje** entre segmentos (el que compra barato no puede revender al de precio alto).

### Regulación de monopolios naturales

Los monopolios naturales generan un dilema regulatorio:

- **Si se obliga $P = CMg$** (eficiencia económica de CP): como hay economías de escala, $CMg < CMe$ — la firma operaría a **pérdida** y quebraría sin subsidios.
- **Si se obliga $P = CMe$** (regulación de costo medio): la firma cubre costos pero persiste algo de ineficiencia ($P > CMg$).
- **Permitir el monopolio + impuesto de suma fija:** preserva eficiencia interna pero captura parte de la renta para el Estado.
- **Subsidio:** se permite $P = CMg$ y el Estado cubre la diferencia. Eficiente, pero requiere recaudación tributaria que tiene su propio DWL.

No hay solución "limpia": cada esquema tiene trade-offs entre eficiencia, factibilidad financiera y costos administrativos.

## Conceptos clave

- [[barreras-entrada]] — recurso único, legal, monopolio natural
- [[monopolio]] — definición, origen, decisión
- [[monopolio-natural]] — economías de escala persistentes
- [[ingreso-marginal-monopolio]] — $IMg < P$, doble de pendiente
- [[indice-lerner]] — $L = (P-CMg)/P = 1/|\varepsilon|$
- [[competencia-monopolistica]] — diferenciación + libre entrada
- [[oligopolio]] — interdependencia estratégica
- [[teoria-juegos-nash]] — equilibrio de Nash, dilema del prisionero
- [[cartel]] — colusión explícita
- [[discriminacion-precios]] — 1er, 2do, 3er grado
- [[regulacion-monopolio]] — trade-offs regulatorios
- [[deadweight-loss]] — comparación con CP

## Fórmulas principales

Ver [[formulas/unidad-04]]. Imprescindibles:
- Maximización: $IMg = CMg$
- $IMg$ del monopolista: $IMg = P(1 - 1/|\varepsilon|)$
- Índice de Lerner: $L = (P - CMg)/P = 1/|\varepsilon|$
- Demanda lineal $P = a - bQ$ → $IMg = a - 2bQ$
- Discriminación 3er grado: $IMg_1 = IMg_2 = CMg$, mercado inelástico paga más

## Ejercicios

- [[ejercicios/gp3-competencia-monopolio]] — guía mixta (Ej 5-10 corresponden a esta unidad: monopolio, discriminación, oligopolio)

## Conexiones

- **[[unidades/unidad-03-mercados-competencia-perfecta]]:** contraste directo. CP es el benchmark; la "ineficiencia" del monopolio se mide como apartamiento del óptimo competitivo.
- **[[unidades/unidad-02-produccion-y-costos]]:** las curvas de costos son las mismas; cambia la regla de demanda.
- **[[unidades/unidad-01-introduccion-oferta-demanda-elasticidades]]:** la elasticidad determina el margen del monopolista (Lerner). Sin entender elasticidad no se entiende discriminación de 3er grado.
- **[[unidades/unidad-05-macroeconomia]]:** el poder de mercado tiene implicancias macro (mark-ups, inflación de costos); la regulación es tema de política económica.

## Errores comunes (mirar antes del parcial)

1. **Calcular $IMg = P$ en monopolio.** Error de base: $IMg < P$ siempre. Para demanda lineal: doble pendiente.
2. **Olvidar verificar el tramo elástico.** El monopolista **nunca** opera donde $|\varepsilon| < 1$. Si te da $Q^*$ en zona inelástica, hay error de cálculo.
3. **Confundir transferencia (área A) con DWL (áreas B+C).** A es redistribución (no es pérdida); B+C es ineficiencia.
4. **Decir que la competencia monopolística es eficiente porque $\pi = 0$.** En LP los beneficios son cero, pero $P > CMg$ — sigue habiendo ineficiencia.
5. **Asumir que el cártel siempre se mantiene.** Hay incentivo individual a desviarse (dilema del prisionero); se rompe sin enforcement.
6. **Aplicar $P = CMg$ a un monopolio natural sin pensar.** Lo lleva a la quiebra (pérdida = $CMe - CMg$ por unidad).
7. **Llamar "discriminación" a cualquier diferencia de precio.** La discriminación requiere segmentación con elasticidades distintas y ausencia de arbitraje. Cobrar más por un producto premium no es discriminación.

## Temas sensibles para Parcial 1

- **Calcular $Q^*$, $P^*$, $\pi$** en monopolio dados $C(Q)$ y $P(Q)$ lineales (siempre cae uno).
- **Comparar con resultado de CP**: $Q$, $P$, EC, EP, DWL.
- **Aplicar Índice de Lerner** dado $\varepsilon$.
- **Identificar tipo de discriminación** en un caso descrito (1er/2do/3er grado).
- **Analizar regulación de monopolio natural:** explicar por qué $P = CMg$ quiebra a la firma.
- **Equilibrio de Nash en juego 2×2:** identificar estrategia dominante, predecir resultado.
- **Cártel y dilema del prisionero:** explicar por qué hay incentivo a romper el acuerdo.
- **Competencia monopolística en LP:** mostrar gráficamente la tangencia $D - CMe$ y la persistencia de $P > CMg$.
