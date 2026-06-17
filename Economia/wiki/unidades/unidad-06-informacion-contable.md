---
unit: 06
module: Empresa
title: Unidad 6 — La Información Contable y Análisis de Costos
parcial: 2
sources: [raw/modulo-3-empresa/unidad-06-informacion-contable/epi09_contavs_09.pdf, raw/modulo-3-empresa/unidad-06-informacion-contable/epi09_costos_09.pdf, raw/modulo-3-empresa/unidad-06-informacion-contable/GP5_ePI_0209 (1).doc]
last_updated: 2026-06-12
---

## Resumen

Esta unidad abre el **Módulo Empresa** y cambia la mirada: hasta acá la empresa era una función de producción abstracta (Unidad 2); ahora es un **ente real que debe registrar, exponer y analizar** su actividad económica. La **contabilidad** es la técnica de registrar sistemáticamente — clasificando, ordenando, procesando, analizando e interpretando — toda la información referida a las transacciones económicas de una empresa. Su objetivo: proveer información sobre el **estado patrimonial** a una fecha y su **evolución económica y financiera** en el período, para facilitar la toma de decisiones y el control de gestión.

La unidad tiene dos mitades. La **contable**: estados contables (balance, cuadro de resultados, evolución del PN, origen y aplicación de fondos), la ecuación contable y la partida doble, el principio de lo devengado, amortizaciones, capital de trabajo y el análisis por ratios. La de **costos**: cómo se integra el costo de fabricación (MP + MOD + GGF), las clasificaciones de costos (directos/indirectos, del producto/del período), los sistemas de costeo (absorción, directo, estándar, ABC) y el punto de equilibrio.

Es la unidad-puente del Parcial 2: el [[conceptos/cuadro-de-resultados]] y la [[conceptos/amortizacion-contable]] son los insumos con los que la Unidad 8 construye el [[conceptos/flujo-de-fondos-proyecto]], y el [[conceptos/devengado-vs-percibido]] es la distinción que separa "utilidad" de "caja" — sin ella no se entiende ni el [[conceptos/escudo-fiscal]] ni por qué una empresa rentable puede quebrar.

## La contabilidad como sistema de información

La administración es un **proceso decisorio** (fijar objetivos → decidir → actuar → controlar) que requiere información **consistente, oportuna y comunicable**. Los **estados contables** son la salida formal de ese sistema.

**Usuarios (partes involucradas):**

| Internos | Externos |
|---|---|
| Accionistas actuales (resultado de su inversión, control de la gestión) | Potenciales inversores (¿invertir o prestar?) |
| Dirección y gerencia (decisiones, gestión, control) | Estado (impuestos), entidades financieras (¿prestar?), proveedores (¿financiar?), clientes (¿confiar en su solvencia?) |

**Tres funciones de la contabilidad de eficiencia:**

| Función | Objetivos típicos |
|---|---|
| Contabilidad financiera / de custodia | Control interno, determinación de utilidades |
| Contabilidad gerencial | Costos fabriles, presupuestos flexibles, valuación de inventarios, control de costos, rendimiento de la inversión |
| Planificación de la gestión | Pronósticos, planeamiento de producción, presupuestos financieros, financiamiento |

**Atributos de la información contable:** pertinencia, confiabilidad, sistematicidad, comparabilidad, claridad. **Restricciones:** oportunidad y equilibrio costo-beneficio.

**Presupuestos del medio económico:** *ente en marcha* (el ente ≠ el dueño, con proyección de futuro), *bienes económicos* (útiles, escasos, con valor de cambio), *ejercicio* (período en que se fracciona la vida del ente; al cierre se emiten los EECC) y *moneda de cuenta* (unidad de medida homogénea, normalmente la de curso legal).

## Los cuatro estados contables

| Estado | Qué muestra | Naturaleza |
|---|---|---|
| **Balance General** (Situación Patrimonial) — [[conceptos/balance-patrimonial]] | Bienes, derechos y obligaciones a una **fecha** | Foto (stock) |
| **Estado de Resultados** — [[conceptos/cuadro-de-resultados]] | Causas que generaron el resultado del **período** | Película (flujo devengado) |
| **Estado de Evolución del PN** | Cambios en la composición del PN durante el ejercicio | Película (flujo) |
| **Estado de Origen y Aplicación de Fondos** — [[conceptos/estado-origen-aplicacion-fondos]] | De dónde surgieron los fondos y en qué se usaron | Película (flujo de **caja**) |

La pareja clave para el parcial es **Balance ↔ Cuadro de resultados** (stock vs flujo) y la pareja **Cuadro de resultados ↔ EOAF** (devengado vs percibido).

## El balance y la ecuación contable

$$\boxed{Activo = Pasivo + Patrimonio\ Neto}$$

**Donde:**
- $Activo$: recursos de propiedad de la empresa (destinos de fondos)
- $Pasivo$: obligaciones ciertas hacia terceros (fuente de fondos ajena)
- $Patrimonio\ Neto$: aportes de propietarios + resultados acumulados (fuente propia)

Todo aumento de un activo se financia con aumento de pasivo, aumento de PN o disminución de otro activo. Esta es la base de la [[conceptos/partida-doble]]: cada operación toca al menos dos cuentas y los débitos igualan a los créditos.

**Estructura típica (criterio corriente / no corriente, corte a 12 meses):**

| ACTIVO | PASIVO + PN |
|---|---|
| **Corriente:** Disponibilidades, Inversiones corrientes, Créditos por ventas, Bienes de cambio | **Pasivo corriente:** Deudas comerciales, bancarias, salarios y cargas, fiscales, provisiones |
| **No corriente:** Bienes de uso (neto de amortizaciones acumuladas), Inversiones no corrientes, Intangibles, Cargos diferidos | **Pasivo no corriente:** Deudas bancarias/documentadas LP, previsiones |
| | **PN:** Capital, Reservas, Resultados acumulados, Resultado del ejercicio |

Detalles que toman en parciales:

- **Cuentas regularizadoras:** restan dentro del activo — Amortizaciones Acumuladas (bienes de uso e intangibles), Previsión para Deudores Incobrables (créditos), Previsión por Desvalorización de Existencias (bienes de cambio). No son pasivos.
- **[[conceptos/bienes-de-cambio-vs-bienes-de-uso]]:** destinados a la venta vs destinados a usarse más de un año. Un mismo bien puede ir a distintos rubros según la **función** que cumpla (un inmueble es bien de cambio para una inmobiliaria, bien de uso para una fábrica, inversión si se alquila).
- **[[conceptos/previsiones-vs-provisiones]]:** provisión = obligación **cierta** devengada (sueldos a pagar, IG a pagar); previsión = hecho de **ocurrencia eventual** estimado estadísticamente (incobrables, despidos, siniestros). Ambas se constituyen cargando resultados.
- **PN = Activo − Pasivo:** es residual, **no es plata**. Incluye Capital (suscripto), Reservas (utilidades retenidas con destino: legal — 5% hasta 20% del capital por Ley 19.550 —, estatutarias, facultativas) y Resultados acumulados. Distribución de utilidades: dividendo en efectivo → deuda; dividendo en acciones → capital; honorarios directores → deuda.

## Principio de lo devengado

Los efectos patrimoniales se reconocen **en el período en que ocurren** ("devengan"), con independencia de cuándo se cobren o paguen. Ver [[conceptos/devengado-vs-percibido]].

| Regla | Ejemplo |
|---|---|
| Ingresos: cuando se **facturan**, no cuando se cobran | Venta a crédito de marzo es ingreso de marzo |
| Costos vinculados a ingresos → al período del ingreso | Comisiones por ventas, CMV |
| Costos vinculados a períodos → a ese período | Sueldos de administración |
| Sin vínculo con ninguno → cuando se conocen | Mermas |
| Pérdidas → cuando ocurre el hecho generador | Siniestro |

**Ejemplo numérico (GP5 Ej. 4):** un préstamo de \$2 MM al 10% recibido el 31/12/X genera **\$200.000 de interés devengado en X+1 y \$200.000 en X+2**, aunque los pagos se hagan el 2/1/X+2 y el 2/1/X+3. La utilidad de los años X y X+3 por esta operación es **cero** — los pagos de enero solo cancelan pasivos ya devengados.

Instrumentos contables del devengado: **provisiones** (gasto devengado impago), **previsiones** (egreso contingente), **cargos diferidos** (gasto pagado no devengado — se activa), **utilidades diferidas** (ingreso cobrado no devengado — pasivo).

## Estado de resultados: esquema elemental y financiero

**Esquema elemental:** Ingresos − Costos del negocio = **Utilidad operativa**; − intereses ± resultados de inversiones ± extraordinarios = **Utilidad antes de IG**; − IG = **Utilidad neta**.

**Esquema financiero** (el que usa la Unidad 8) — ver [[conceptos/ebit-ebitda]]:

| Línea | Resta |
|---|---|
| Ventas brutas | |
| | − Costos erogables |
| **EBITDA** | |
| | − Depreciaciones / Amortizaciones |
| **EBIT** (utilidad operativa) | |
| | − Intereses |
| **EBT** | |
| | − Impuesto a las ganancias |
| **EAT** (utilidad neta) | |

Solo se computan resultados **del período**, clasificados en ordinarios y extraordinarios. "Ganado o perdido" no es "cobrado o pagado".

## Amortización contable

La [[conceptos/amortizacion-contable]] convierte gradualmente el valor del activo fijo en gasto, reflejando desgaste, uso u obsolescencia:

$$Am = \frac{V.O. - V.R.}{V.U.} \qquad V.L. = V.O. - A.A.$$

**Donde:**
- $Am$: amortización del ejercicio (\$/período)
- $V.O.$: valor de origen (compra + gastos de puesta en marcha)
- $V.R.$: valor residual contable al final
- $V.U.$: vida útil contable (períodos)
- $V.L.$: valor de libros (valor contable neto)
- $A.A.$: amortizaciones acumuladas desde el alta

**Ejemplo:** maquinaria de \$1.000.000, $V.U.$ 10 años, $V.R.$ 10% → $Am = (1.000.000 - 100.000)/10 =$ \$90.000/año. A los 5 años: $V.L. = 1.000.000 - 450.000 =$ \$550.000.

Reglas: los **terrenos no se amortizan**; las **mejoras** que extienden vida útil o rendimiento se **activan** y se amortizan en la vida útil restante; la amortización es un gasto **que no eroga caja** (en el flujo de fondos se suma de vuelta). Al vender un bien de uso, el resultado es $Precio - V.L.$ (GP5 Ej. 2). La diferencia entre amortización contable e impositiva genera el [[conceptos/escudo-fiscal]] (GP5 Ej. 3).

## Capital de trabajo, ciclo de caja y NOF

$$KT = AC - PC$$

**Donde:**
- $KT$: capital de trabajo (fondo de maniobra)
- $AC$: activo corriente
- $PC$: pasivo corriente

Es la parte del activo corriente financiada a largo plazo: un colchón "libre en el giro", asociado a la liquidez ([[conceptos/capital-de-trabajo]]). Equivalentemente, **Fondo de maniobra = Recursos permanentes − Activos inmovilizados**.

El análisis fino separa tres grupos de cuentas: las de **largo plazo** (bienes de uso, deuda LP, PN → fondo de maniobra), las **operativas ligadas a ventas** (créditos, bienes de cambio, proveedores → $NOF = $ activos operativos − pasivos espontáneos) y las de **colchón financiero** (caja, inversiones CP, deuda financiera CP):

$$Superávit\ (déficit)\ financiero = FM - NOF$$

El [[conceptos/ciclo-de-caja]] mide en días cuánto tiempo hay que financiar el giro:

$$Ciclo\ operativo = días\ de\ inventario + días\ de\ cobranza$$
$$Ciclo\ de\ caja = Ciclo\ operativo - días\ de\ pago$$

**Ejemplo (GP5 Ej. 7):** con $AC = 2.500$ y $PC = 1.900$ (miles), $KT = 600$. Si las ventas crecen, créditos y bienes de cambio crecen proporcionalmente (necesidad de fondos), pero la deuda comercial también acompaña a las compras: es **financiamiento espontáneo** que cubre parte del crecimiento. Necesidades **transitorias** se financian a CP; **permanentes**, a LP (regla de calce de plazos).

## Análisis por ratios

Ver [[conceptos/ratios-financieros]] y el formulario [[formulas/unidad-06]]. Las cuatro familias:

| Familia | Ratio | Fórmula | Lectura |
|---|---|---|---|
| Liquidez | Corriente | $AC/PC$ | Medida cruda de liquidez |
| | Prueba ácida (seco) | $(AC - Bienes\ de\ cambio)/PC$ | Sin depender de vender stock |
| | Absoluta | $Disponibilidades/PC$ | Solo caja |
| Actividad | Período promedio de cobranza | $Créditos \times 360 / Ventas\ a\ crédito$ | Días que tarda en cobrar |
| | Período promedio de pago | $Deudas\ com. \times 360 / Compras$ | Días que tarda en pagar |
| | Días de existencias | $Bienes\ de\ cambio \times 360 / CMV$ | Días de stock |
| | Rotación de activos | $Ventas/Activo$ | Veces que "vende" su activo |
| Endeudamiento | Endeudamiento total | $Deuda\ total/Activo$ | Estructura de financiamiento |
| | Cobertura de intereses | $EBITDA/Intereses$ | Veces que el resultado cubre intereses |
| Rentabilidad | Margen neto | $Utilidad\ neta/Ventas$ | Eficiencia económica |
| | ROE | $Utilidad\ neta/PN$ | Rentabilidad del accionista |
| | Rentabilidad operativa | $EBIT/Activo$ | Rinde del activo sin mezcla financiera |

⚠️ La cátedra define **cobertura de intereses con EBITDA** ("utilidades antes de intereses, impuestos y amortizaciones / pagos anuales de intereses"). Otros textos usan EBIT — en un parcial, usar la definición de la cátedra salvo que el enunciado diga otra cosa.

**La [[conceptos/ecuacion-dupont]]** descompone el ROE en sus tres palancas:

$$ROE = \underbrace{\frac{U.neta}{Ventas}}_{ef.\ económica} \times \underbrace{\frac{Ventas}{Activos}}_{ef.\ operativa} \times \underbrace{\frac{Activos}{PN}}_{apalancamiento}$$

Un mismo ROE puede venir de márgenes altos, de rotación alta o de deuda alta — diagnósticos y riesgos muy distintos.

## EOAF / Flujo de caja: utilidades ≠ caja

El [[conceptos/estado-origen-aplicacion-fondos]] parte de la ecuación contable en diferencias:

$$\Delta C = \Delta P + \Delta PN - \Delta A_{\neq C}$$

**Donde:**
- $\Delta C$: variación de caja del período
- $\Delta P, \Delta PN$: variaciones de pasivo y PN (**orígenes** si aumentan)
- $\Delta A_{\neq C}$: variación de activos no-caja (**aplicaciones** si aumentan)

Reordenando se obtiene el flujo por actividades:

| Actividad | Genera fondos (orígenes) | Aplica fondos |
|---|---|---|
| **Operativas** | Cobros por ventas, regalías, comisiones | Pagos a proveedores y empleados, IG |
| **Inversión** | Venta de activo fijo, cobro de préstamos otorgados | Compra de bienes de uso, intangibles |
| **Financiación** | Emisión de acciones, toma de préstamos | Dividendos, recompra de acciones, pago de préstamos |

Armado indirecto del flujo operativo: **Utilidad + Amortizaciones − ΔCréditos − ΔBienes de cambio + ΔDeudas comerciales**. El esquema FCFF/FCFE (flujo del activo vs flujo al accionista, con los intereses y su escudo fiscal reclasificados a financiación) es exactamente el que la Unidad 8 usa para armar el [[conceptos/flujo-de-fondos-proyecto]].

**Idea fuerza:** la empresa puede estar **bien en utilidades y mal en caja** (vende a crédito, acumula stock) o al revés. Por eso existen dos estados distintos.

## Análisis de costos

### Integración del costo de fabricación

$$Costo\ de\ fabricación = MP + MOD + GGF$$

**Donde:**
- $MP$: materias primas / materiales directos (integran físicamente el producto)
- $MOD$: mano de obra directa (rastreable al producto)
- $GGF$: gastos generales de fabricación (indirectos: MO indirecta, materiales indirectos, energía de planta, amortización fabril)

Clasificaciones que se cruzan (¡no son sinónimos!) — ver [[conceptos/costos-directos-indirectos]] y [[costos-fijos-variables]]:

| | Directo (rastreable a la unidad) | Indirecto |
|---|---|---|
| **Variable** | MP, MOD | Lubricantes, energía de máquinas |
| **Fijo** | — (raro) | Alquiler de planta, amortización fabril, vigilancia |

Otras categorías de la clasificación: costos recurrentes/no recurrentes, costo estándar, costo contable vs efectivo, [[conceptos/costo-hundido]] y [[costo-de-oportunidad]] — los dos últimos son el puente con [[costos-economicos-vs-contables]] (U2) y con las decisiones de proyectos (U8).

### Costos del producto vs costos del período

Ver [[conceptos/costos-producto-vs-periodo]]. Los costos **del producto** (MP + MOD + GGF) se **activan** en inventarios (MP → Producción en Proceso → Producto Terminado) y recién pasan al cuadro de resultados como **CMV cuando se vende**. Los costos **del período** (gastos de administración y comercialización) van directo a resultados del ejercicio. En una empresa industrial, las **cuentas transitorias de producción** acumulan los costos a medida que avanza la transformación.

### Sistemas de costeo

Ver [[conceptos/sistemas-de-costeo]]:

| Sistema | Qué carga al producto | Uso |
|---|---|---|
| **Absorción** | MP + MOD + GGF variables **+ GGF fijos** | Presentación contable; inventarios "absorben" fijos |
| **Directo (variable)** | MP + MOD + GGF variables | Gestión; decisiones de CP vía [[conceptos/contribucion-marginal]] |
| **Estándar** | Costos predeterminados técnico-económicos | Control presupuestario, análisis de desvíos |
| **ABC** | Recursos → actividades → objetos de costo | Modelo gerencial de asignación de GGF |

Los gastos de administración, comercialización y finanzas **nunca** integran el costo del producto en ninguno de los dos primeros.

### Punto de equilibrio

Ver [[conceptos/punto-de-equilibrio]]. Con ingresos $IT = p \cdot q$ y costos $CT = CF + cv \cdot q$:

$$q^* = \frac{CF}{p - cv} = \frac{CF}{cm}$$

**Donde:**
- $q^*$: cantidad de equilibrio (beneficio nulo, $IT = CT$)
- $p$: precio unitario
- $cv$: costo variable unitario
- $CF$: costos fijos totales
- $cm = p - cv$: [[conceptos/contribucion-marginal]] unitaria

En multiproducto aparece el **pseudo-equilibrio**: con costos fijos *propios* del producto se alcanza el equilibrio antes que sumando también los fijos *asignados* por prorrateo. Entre ambos volúmenes el producto no cubre "su" costo total contable pero **sí contribuye** a los fijos comunes — eliminarlo empeoraría el resultado global. No confundir con el [[umbral-rentabilidad]] de la Unidad 3 (allí es el precio mínimo $= \min CTMe$ en competencia; acá es una cantidad, con $p$ dado y costos lineales).

### Costo del ciclo de vida y optimización del diseño

El costo de corregir un diseño **crece escalonadamente** con la etapa del ciclo de vida (evaluación → diseño conceptual → detallado → producción → operación): decidir temprano es barato. Para minimizar costos respecto de una variable de diseño $x$: plantear $C(x) = ax + b/x + k$, derivar e igualar a cero, verificar mínimo con la segunda derivada. **Ejemplo (avión comercial):** $CT = 0{,}04\,n\,v^{3/2} + 300.000\,n/v$ → $v^* = 490{,}68$ mph.

## Conceptos clave

### Contabilidad
- [[conceptos/balance-patrimonial]] — la foto: $A = P + PN$
- [[conceptos/cuadro-de-resultados]] — la película devengada
- [[conceptos/partida-doble]] — debe = haber, siempre
- [[conceptos/devengado-vs-percibido]] — la distinción madre
- [[conceptos/bienes-de-cambio-vs-bienes-de-uso]] — venta vs uso
- [[conceptos/amortizacion-contable]] — $(V.O.-V.R.)/V.U.$
- [[conceptos/previsiones-vs-provisiones]] — eventual vs cierto
- [[conceptos/ebit-ebitda]] — cascada del esquema financiero

### Análisis financiero
- [[conceptos/capital-de-trabajo]] — $AC - PC$, FM y NOF
- [[conceptos/ciclo-de-caja]] — días a financiar
- [[conceptos/ratios-financieros]] — liquidez, actividad, endeudamiento, rentabilidad
- [[conceptos/ecuacion-dupont]] — las 3 palancas del ROE
- [[conceptos/estado-origen-aplicacion-fondos]] — utilidades ≠ caja

### Costos
- [[conceptos/costos-directos-indirectos]] — MP/MOD vs GGF
- [[conceptos/costos-producto-vs-periodo]] — activable vs gasto
- [[conceptos/sistemas-de-costeo]] — absorción, directo, estándar, ABC
- [[conceptos/contribucion-marginal]] — $p - cv$
- [[conceptos/punto-de-equilibrio]] — $q^* = CF/cm$

## Fórmulas principales

Ver [[formulas/unidad-06]]. Imprescindibles:
- $A = P + PN$ y su versión en diferencias ($\Delta C = \Delta P + \Delta PN - \Delta A_{\neq C}$)
- $Am = (V.O. - V.R.)/V.U.$; $V.L. = V.O. - A.A.$
- Cascada EBITDA → EBIT → EBT → EAT
- $KT = AC - PC$; ciclo de caja = días inventario + días cobranza − días pago
- Ratios de liquidez/actividad/endeudamiento/rentabilidad + DuPont
- $q^* = CF/(p - cv)$

## Ejercicios

- [[ejercicios/gp5-informacion-contable]] — GP5 resuelta completa (balance y cuadro de CONTA, liquidación de bienes de uso, beneficio fiscal, devengamiento de intereses, reconstrucción por ratios, cobertura de intereses, capital de trabajo)

## Conexiones

- **[[unidades/unidad-02-produccion-y-costos]]:** acá se mide el costo **contable**; la U2 enseñó que el económico suma el [[costo-de-oportunidad]] ([[costos-economicos-vs-contables]]). El [[beneficio-economico]] puede ser nulo con utilidad contable positiva. Los [[costos-fijos-variables]] de la U2 reaparecen operativizados en el punto de equilibrio y el costeo directo; el [[costo-marginal]] y los [[costos-medios]] son los primos "continuos" del costo variable unitario.
- **Unidad 7 (Cálculo Financiero):** los ratios y estados comparan pesos de fechas distintas como si valieran lo mismo; el [[conceptos/valor-tiempo-dinero]] corrige eso. El beneficio real de la deducción acelerada (GP5 Ej. 3) solo se cuantifica descontando los flujos con las herramientas de U7 ([[conceptos/tasas-equivalentes]], [[conceptos/anualidades]]).
- **Unidad 8 (Evaluación de Proyectos):** el flujo de fondos del proyecto se construye desde EBIT/EBITDA sumando de vuelta las amortizaciones y restando ΔKT e inversiones — exactamente el FCFF del EOAF. El [[conceptos/escudo-fiscal]] nace de la amortización impositiva; el [[conceptos/valor-residual]] es el VR contable visto a valor de mercado; el KT inicial es inversión del proyecto y se recupera al final.

## Errores comunes (mirar antes del parcial)

1. **Confundir utilidad con caja.** Una empresa puede ganar plata (devengado) y quedarse sin caja (percibido) — y quebrar. Son dos estados distintos por una razón.
2. **No sumar de vuelta la amortización en el flujo de fondos** (o restarla dos veces). Es gasto devengado, no erogación.
3. **Amortizar terrenos o amortizar el valor residual.** Los terrenos no se amortizan; la base amortizable es $V.O. - V.R.$, no $V.O.$
4. **Tratar el PN como plata disponible.** Es $A - P$: una diferencia residual, no un cajón con billetes.
5. **Cobertura de intereses con EBIT cuando la cátedra la define con EBITDA.** Leer siempre qué numerador pide el enunciado.
6. **Mezclar las bases de los días:** existencias contra **CMV**; cobranza contra **ventas (a crédito)**; pago contra **compras**.
7. **Creer que directo = variable.** Directo/indirecto es por *rastreabilidad*; fijo/variable es por *comportamiento ante el volumen*. Hay indirectos variables (energía de máquina) y la amortización fabril es un fijo indirecto que **sí** va al producto en absorción.
8. **Cargar gastos de administración/comercialización al costo del producto.** Son costos del período, siempre a resultados.
9. **Calcular el punto de equilibrio con el costo medio total** en vez del costo variable unitario.
10. **Olvidar las cuentas regularizadoras:** amortizaciones acumuladas y previsiones restan **dentro del activo**; no son pasivo.

## Temas sensibles para Parcial 2

- **Armar balance + cuadro de resultados desde movimientos** (tipo CONTA): respetar partida doble, devengar gastos impagos, separar resultado por venta de inversiones de las ventas operativas.
- **Reconstruir un balance desde ratios** (tipo GP5 Ej. 5): arrancar por el dato completo (pasivo corriente), encadenar liquidez → composición del AC → totales → estructura de financiamiento → ROE → actividad → cuadro de arriba hacia abajo.
- **Resultado por venta de bienes de uso:** $Precio - V.L.$, con $V.L. = V.O. - A.A.$ Terrenos: $V.L. = V.O.$
- **Devengamiento de intereses multi-año** (tipo Ej. 4): la utilidad va al año que corre el interés, no al año del pago.
- **Cobertura de intereses para decidir renovación de crédito** (tipo Ej. 6): reconstruir EBIT desde el margen neto "grossing up" por la tasa de IG.
- **Capital de trabajo y financiamiento del crecimiento** (tipo Ej. 7): activos espontáneos vs deuda comercial espontánea; CP vs LP según permanencia de la necesidad.
