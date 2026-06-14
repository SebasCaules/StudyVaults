# Log — Economía para Ingenieros Wiki

Registro append-only de todas las operaciones. Formato: `## [YYYY-MM-DD] <operación> | <título> | <unidad>`

---

## [2026-04-17] setup | Vault inicializado | general
- Estructura inicial creada con 3 módulos y 8 unidades (corregida desde versión anterior)
- Fuentes ingresadas a raw/00-general: Programa-Analitico-6123.pdf, Cronograma-2026.pdf
- Páginas creadas: index.md, log.md, overview.md
- Fechas clave registradas: Parcial 1 → 5-May | Parcial 2 → 16-Jun | Recuperatorio → 23-Jun

## [2026-04-17] ingest | Programa Analítico 6123 + Cronograma 2026 | general
- Leídos: Programa Analítico de la Materia 6123 (2022) y Cronograma 1 2026
- Estructura del curso confirmada: 3 módulos, 8 unidades, 2 parciales
- Carpetas raw/ reestructuradas para coincidir con unidades reales
- CLAUDE.md, overview.md actualizados con información oficial del programa

## [2026-04-17] ingest | Clases 001-005 micro + Clase 1-2 macro | unidades 1-5
- Delegado a agentes paralelos el resumen de clases PDF grandes
- Páginas unidad-01..unidad-05 creadas con contenido, objetivos, conceptos, fórmulas
- Nota: Clase 2 macro cubre indicadores (inflación, desempleo, pobreza), NO ODA/política monetaria — gap señalado en unidad-05

## [2026-04-17] ingest | GP1/GP2/GUIA2/GP3/GUIA3 | unidades 1-4
- Páginas ejercicios/ creadas: gp1, gp2, guia-2-resoluciones, gp3
- GP3 mezcla Unidad 3 (Ej 1-4) y Unidad 4 (Ej 5-10)
- GUIA 2 es Unidad 1 temáticamente (demanda, elasticidad, subsidios, comercio)

## [2026-04-17] ingest | APUNTE EPI + Fórmulas + 4 Parciales viejos | parcial 1
- APUNTE EPI (78pp) contiene contabilidad, costos, VTD, evaluación proyectos (relevante Parcial 2)
- Fórmulas: agregados TCR, distinción Laspeyres/Paasche, Ec=CMg/CMe, índice Lerner
- 4 parciales viejos: estructura = 1 V/F + 2 numéricos. Temas top: monopolio/discriminación, impuestos, elasticidad, CP LP
- Nueva página: examenes/parcial-1-analisis con ranking de temas y tips estratégicos
- Conceptos añadidos: ipc-deflactor, tipo-de-cambio-real

## [2026-04-26] update | Resúmenes de unidades expandidos | unidades 1-5
- Reescritos los 5 resúmenes de unidad para Parcial 1 (Micro 1-4 + Macro 5)
- Estructura ampliada: marco conceptual, principios metodológicos, derivaciones, intuición económica, ejemplos numéricos
- Cada unidad ahora incluye sección "Errores comunes" para repaso pre-parcial
- Tablas comparativas agregadas (estructuras de mercado, tipos de costos, agregados monetarios, etc.)
- Conexiones entre unidades explicitadas con causalidad ("la oferta de Unidad 1 sale del CMg de Unidad 2")
- Páginas afectadas: unidades/unidad-01..05.md

## [2026-04-27] ingest | Clase 3 macro (Política Monetaria) + Excel GPN°1 | unidad 5
- Clase 3 (101 pp) ingerida: cubre el gap señalado en log anterior — sistema financiero, instrumentos (bonos/acciones), dinero y agregados, multiplicador del dinero, banco central, demanda de dinero, política monetaria, ODA, neutralidad del dinero, metas de inflación, instrumentos no convencionales (QE/ZLB)
- Excel GPN°1 2020 c1.xlsx: solo plantilla con un ejemplo de deflactar nafta (ya cubierto en formulas/unidad-01.md). No se crea contenido nuevo.
- Páginas modificadas: unidades/unidad-05-macroeconomia.md (sección Sistema Financiero/Dinero/Política Monetaria reescrita), formulas/unidad-05.md (agregadas tasa real, valuación bonos, multiplicador dinero), overview.md (gap macro marcado como cubierto)

## [2026-04-27] update | 91 conceptos nuevos + reparación de wikilinks | todas
- 91 páginas de conceptos creadas (12 U1, 16 U2, 9 U3, 10 U4, 44 U5) llenando todos los wikilinks rotos referenciados desde resúmenes de unidad
- Conceptos clave nuevos para Parcial 1: equilibrio-mercado, desplazamientos-curvas, elasticidad-precio-demanda/oferta/ingreso/cruzada, etapas-produccion, ingreso-marginal, regla-IMg-CMg, indice-lerner, teoria-juegos-nash, multiplicador-dinero, neutralidad-dinero, etc.
- Wikilinks corregidos: ejercicios/gp3-competencia-perfecta y guia-3 (no existen) → reemplazados por gp3-competencia-monopolio (la guía mixta real); ejercicios/guia-2 → guia-2-resoluciones
- index.md totalmente reescrito con tablas de conceptos por unidad agrupados temáticamente
- Estado final: solo 3 wikilinks "rotos" remanentes — unidades 6/7/8 marcadas como TODO en overview.md (Parcial 2, materiales aún no ingeridos)

## [2026-04-27] update | Gráficos SVG y diagramas Mermaid agregados | todas
- 24 gráficos SVG generados con matplotlib (script reproducible en `assets/graficos/generar.py`):
  - U1 (7): FPP, oferta-demanda equilibrio, desplazamientos, elasticidades comparación, excedente C+P, precio máximo, precio mínimo
  - U2 (3): PT/PMe/PMg con etapas, curvas de costos CP, CMe LP envolvente
  - U3 (4): demanda horizontal CP, maximización tres zonas, equilibrio LP, impuesto y DWL
  - U4 (3): monopolio (ej. clase), discriminación 3er grado, comp. monopolística LP
  - U5 (7): ODA equilibrio, mercado dinero, política monetaria expansiva, multiplicador dinero cascada, ciclo económico, neutralidad dinero LP, bonos par/bajo/sobre la par
- 50 páginas con SVGs incrustados (5 resúmenes de unidad + 45 conceptos clave)
- 9 diagramas Mermaid agregados para flujos conceptuales: flujo circular (U1 + concepto), espectro de estructuras de mercado, mecanismo política monetaria, régimen monetario (4 niveles), componentes sistema financiero, métodos cálculo PBI, clasificación PEA-PEI, modelo de 3 brechas
- Embebidos vía sintaxis Obsidian: `![[grafico.svg]]` y `\`\`\`mermaid` ... `\`\`\``

## [2026-04-27] update | Gráficos rediseñados + desgloses de variables en fórmulas | todas
- **Gráficos SVG rediseñados** (24 archivos): script `generar.py` reescrito con diseño didáctico — ejes con flechas, fuentes legibles (12pt+), anotaciones con cajas de color, cuadrícula sutil, paleta consistente (rojo demanda / azul oferta / naranja CMg / verde CMe / morado DWL), figuras más grandes (8x5+ típico), etiquetas posicionadas para no solaparse
- **Desgloses de variables en fórmulas** (~128 desgloses en ~70 archivos): cada vez que una fórmula nueva aparece por primera vez en un archivo se agrega un bloque "Donde:" con definición concisa de cada variable. Convención aplicada:
  - Solo primera aparición — no se repite si la fórmula vuelve a salir más abajo
  - Variables ya definidas en el mismo archivo no se re-explican (solo las nuevas)
  - Una línea por variable, máximo 8-10 palabras de descripción
  - Aplicado a 5 resúmenes de unidad, 5 archivos de fórmulas y ~60 páginas de conceptos
- Resultado: el lector entiende cada fórmula sin tener que scrollear hasta el final ni cruzar referencias entre páginas

## [2026-04-28] resolucion | GP N°1 Microeconomía completa | unidad 01
- Página `ejercicios/gp1-microeconomia.md` reescrita con resolución paso a paso de los 11 ejercicios del PDF `GP1_ePI_24 (2).pdf`
- Cada ejercicio numérico (1, 2, 3, 4a-d, 5a-b): Datos → Planteo → Cuentas → Resultado → Interpretación
- Cada ejercicio conceptual (6, 7, 8, 9, 10, 11): análisis paso a paso + tablas comparativas + reglas mnemotécnicas
- Resultados clave: precios reales nafta (1,531 / 1,631 en pesos Jul-99), eq. paddle ($P^*=50/7$, escasez=15.000 con tope $5), elasticidades 4a-d (-2/3, +0,135, +1, +1,88), Ej 7 valijas (mantener P → ↑P_valijas; mantener Q → ↓P_valijas)
- Sección final añadida: "Errores frecuentes detectados al resolver" con 5 trampas típicas para repaso pre-parcial

## [2026-04-28] resolucion | GP N°2 + GP N°3 Microeconomía completas | unidades 01-04
- Páginas `ejercicios/gp2-produccion-costos.md` y `ejercicios/gp3-competencia-monopolio.md` reescritas con resoluciones paso a paso completas (mismo formato que gp1)
- **GP2 (10 ejercicios, mezcla U1+U2):** demanda agregada con quiebres, EC con tarifa de dos partes ($T_{max}=51$), elasticidad-precio electricidad (recomendar bajar $P$ a 10), equivalencia subsidios productor/consumidor (90%-10%), comercio internacional (libre/autarquía/impuesto/arancel ranking EC y EP), tabla PT/PMe/PMg en Etapa II, $L^*\approx 15$ máximo PMe, cuadro costos $CTMe_{min}=160$ en $Q=15$, palos golf $Q^*=100$ escala eficiente
- **GP3 (10 ejercicios, mezcla U3+U4):** decisión CP entre $P_{cierre}$ y $P_{UR}$ ($Q^*=175$), oferta agregada con dos quiebres, impuesto unitario (CMg y CTMe suben en $t$), equilibrio CP-LP industria de 100→160 empresas, monopolio ($Q^*=471$, $\pi\approx 941.824$), monopolio con producción Cobb-Douglas (DWL≈35,9), regulación monopolio natural ($P=CTMe$, $Q=120$), incidencia impuesto en monopolio (50% al consumidor, no 100%), NStar (DWL=0,85), discriminación duplica beneficio ($94$ vs $46$)
- Sección "Errores frecuentes" en cada guía con 5-7 trampas típicas para Parcial 1

## [2026-04-28] update | 18 gráficos SVG para resoluciones GP1/GP2/GP3 | unidades 01-04
- Script nuevo `assets/graficos/generar_gp.py` con 18 figuras matplotlib siguiendo paleta y estilo de `generar.py` (ejes con flechas, BBOX en cajas, colores consistentes rojo demanda / azul oferta / naranja CMg / verde CTMe / morado DWL)
- **GP1 (3):** equilibrio Ej2 con punto de evaluación, precio máx paddle (efectivo vs no efectivo, 2 paneles), shock oferta + valijas (3 paneles: shock / mantener P / mantener Q)
- **GP2 (8):** agregación horizontal con quiebre (3 paneles), demanda discreta tenis con áreas EC, tarifa escalonada con bloques 5¢/10¢, libros (3 paneles eq/subv/precio máx), comercio internacional 4 paneles 18×14 grandes, PT/PMe/PMg en Etapa II, familia costos en U con CMg cruzando CTMe en Q=15, palos golf (CT y CMe/CMg)
- **GP3 (7):** decisión CP con tres zonas coloreadas (cierre/pérdida<CF/beneficio), oferta agregada escalera con quiebres en P=15 y P=20, shock CP→LP de 100 a 160 empresas (3 paneles), monopolio simple (D, IMg, CMg, π), regulación monopolio natural (3 escenarios: monopolio/CTMe/CMg first-best), NStar con DWL sombreado, discriminación 3er grado (3 paneles)
- Helper `draw_axes` extendido con parámetros `origin_x`/`origin_y` para datos que no empiezan en (0,0)
- SVGs embebidos en cada `.md` con sintaxis Obsidian `![[archivo.svg]]` justo después de la interpretación del ejercicio correspondiente

## [2026-04-28] update | Limpieza de superposiciones en gráficos + fullscreen Obsidian | general
- Refactor de `generar.py` y `generar_gp.py`: figuras más amplias, etiquetas con `bbox` opaco y `zorder` alto para que el texto siempre se lea encima de líneas y áreas
- Reemplazo de cajas pegadas a curvas por `ax.annotate(...)` con leader-lines hacia zonas vacías del gráfico (FPP, oda-equilibrio, mercado-dinero, neutralidad-dinero, monopolio-equilibrio, gp1-ej2, gp3-ej1, gp3-ej7, gp3-ej9, etc.)
- Leyendas movidas fuera del área de plot (`bbox_to_anchor=(1.02, 1.0)`) en gráficos densos para liberar espacio
- Ticks automáticos custom en `monopolio_equilibrio` y `gp1_ej2_equilibrio` para evitar que `Q*=10`, `Q*=18`, etc. choquen con números de la grilla
- Eje X de `bonos-par-bajo-sobre` anclado en `origin_y=50` (antes salía abajo del rango visible)
- CSS snippet `fullscreen-images.css` activado en `.obsidian/snippets/`: imágenes con cursor zoom-in, hover con sombra, popover ocupando 95vw/95vh — clic abre el SVG a pantalla completa

## [2026-04-29] update | Completar formularios y resúmenes U1-U5 con gaps detectados en raw | parcial 1
- Revisión cruzada exhaustiva entre raw/ (Clases 001-005, Clase 1-3 macro, hoja oficial de fórmulas, APUNTE EPI) y wiki/formulas + wiki/unidades
- **formulas/unidad-01:** agregados índices Laspeyres y Paasche, tabla numérica η-gasto (clase, demanda lineal Q=8000-1000P), elasticidad-precio en demanda lineal (intercepto, punto medio), excedente del productor, bienestar total, fórmulas explícitas para precio máx/mín
- **formulas/unidad-02:** función Cobb-Douglas con rendimientos según α+β y PMg explícitas, tipologías de costo (contable, económico, oportunidad, hundido, fijo, variable, marginal, recurrente, directo/indirecto, estándar), punto de equilibrio Q* = CF/(P-CV_u)
- **formulas/unidad-03:** distinción Cierre (CP) vs Salida (LP), recaudación fiscal T = t·Q₂, reparto cuantitativo de la incidencia (ΔPc/ΔPp = εs/|εd|), DWL ≈ ½·t·ΔQ, espejo del subsidio
- **formulas/unidad-04:** regla de markup P = CMg·|ε|/(|ε|-1), comparación CP vs Monopolio para demanda lineal con CMg constante, regulación de monopolio natural (3 esquemas), monopsonio (VPMg=CMg), formalización del equilibrio de Nash
- **formulas/unidad-05:** multiplicadores de transferencias k_TR=PMC/(1-PMC) e impuestos k_T=-PMC/(1-PMC), balanced-budget multiplier=1, resultado fiscal primario y financiero, sostenibilidad de deuda d* = -(r-γ)·b, pobreza/indigencia (CBA/CBT), Coeficiente de Gini, Ley de Okun, tasas equivalentes (TNA/TEA/TEM con capitalizaciones), anualidades y perpetuidades, balanza comercial, TCR, cuenta corriente
- **unidades/unidad-01:** tabla η-gasto (clase) y determinantes detallados de la elasticidad-precio
- **unidades/unidad-02:** tabla numérica PT/PMe/PMg de la clase con identificación de etapas, mención histórica de Malthus (rendimientos decrecientes superados por progreso técnico)
- **unidades/unidad-03:** distinción operativa Cierre (CP) vs Salida (LP) en tabla
- **unidades/unidad-04:** cárteles exitosos (OPEP) vs fracasados (CIPEC), explicación de por qué; sección monopsonio con condición de óptimo y oligopsonio
- **unidades/unidad-05:** Hicks/Friedman/Lucas como hitos macro post-Keynes, paradoja de la frugalidad como ejemplo de falacia de composición, sección completa de pobreza/indigencia/distribución (CBA, CBT, Curva de Lorenz, Gini con países comparados, brecha de deciles), multiplicador de transferencias e impuestos con ejemplo numérico, multiplicador de presupuesto equilibrado, estabilizadores automáticos, distinción entre déficit primario y financiero, condición de sostenibilidad d* = -(r-γ)·b con interpretación, pasivos contingentes, tres formas de financiar el déficit

## [2026-05-02] ingest | 4 parciales viejos transcriptos con resolución | parcial 1
- Procesados los 4 PDFs de raw/parcial-1-microeconomia-macroeconomia/: P1 04052023, P1_Ecoi_0162 (2018), P1_Ecoi_0209 (2009), P1_Ecoi_0211 (2011)
- Páginas creadas (una por parcial): wiki/examenes/parcial-2009-10-09.md, parcial-2011-09-22.md, parcial-2018-09-27.md, parcial-2023-05-04.md
- Cada página: enunciado completo + resolución de V/F (con justificación) + resolución numérica de ej 2 y 3 con cuentas explícitas y links a conceptos del wiki
- Variantes de Tema 2 documentadas en parcial-2023-05-04 (impuesto t=5 en O/D, t=2 en monopolio)
- Insights:
  - Patrón macro 2018/2023 idénticos en V/F: PBI método ingreso (RA+EBE+ImpInd-Subs, NO restar depreciaciones), MIP (VBP=VA+CI), deflactor vs IPC
  - Patrón micro 2011/2018: discriminación 3er grado siempre con CMg constante, comparación contra precio único
  - Resolución pizzería 2009: Cobb-Douglas α+β=1 ⇒ rendimientos constantes a escala
  - Subsidio óptimo en monopolio (2023 ej2d): s = P*-CMg para alinear Q* con Q^so
- Páginas actualizadas: examenes/parcial-1-analisis.md (tabla de parciales individuales) + index.md (entradas en sección Exámenes)

## [2026-05-04] ingest | Banco V/F de parciales (pregs multiple choice) | Parcial 1 (Unidades 1-5)
- Fuente: pregs multiple.pdf (13 páginas) — copiada a raw/parcial-1-microeconomia-macroeconomia/pregs-multiple-choice-VF.pdf
- Contiene V/F del Ejercicio 1 de 7 parciales: 30-09-2025, 2C-2024, 1C-2023, 1C-2022, 2C-2019, 2018, 2011
- Incluye lista ordenada por frecuencia (3, 2, 1 apariciones)
- Páginas creadas: wiki/examenes/preguntas-multiple-choice-VF.md
- Páginas actualizadas: wiki/index.md
- Insights clave:
  - 5 preguntas se repiten 3 veces (entrada empresas en CP, política fiscal vs desastre, fórmulas PBI, MIP, calidad de vida)
  - Trampas recurrentes: mezclar instrumentos PM, confundir IPC/Deflactor PBI, desinflación vs deflación, inversión financiera vs económica
  - Cubre temas de las 5 unidades del Parcial 1; mayor concentración en Macro (Unidad 5)

## [2026-05-05] resumen | Hoja de estudio Microeconomía (Unidades 1-4) | Parcial 1
- Página creada: wiki/resumen-microeconomia.md
- Páginas actualizadas: wiki/index.md
- Contenido: definiciones compactas, fórmulas en LaTeX, tabla resumen, top 10 errores típicos
- Cubre: Oferta/Demanda/Elasticidades, Producción/Costos, Competencia Perfecta, Mercados Imperfectos

## [2026-05-05] resumen | Resumen Micro reescrito en formato descriptivo | Parcial 1
- Página actualizada: wiki/resumen-microeconomia.md (versión narrativa, menos fórmulas, más explicación con palabras)
- PDF regenerado: Resumen-Microeconomia.pdf (13 páginas, raíz + wiki/assets/)
- Estructura: las 4 unidades en prosa con secciones temáticas + síntesis final con 6 grandes ideas transversales

## [2026-05-05] resumen | Resumen Micro versión híbrida (bullets + fórmulas) | Parcial 1
- Página actualizada: wiki/resumen-microeconomia.md (formato bullets cortos + fórmulas + tablas + ejemplos breves)
- PDF regenerado: 10 páginas, raíz + wiki/assets/
- Mantiene fórmulas clave, agrega tablas comparativas y ejemplos (con 💡), errores típicos y 6 grandes ideas

## [2026-06-12] ingest | Módulo 3 (Empresa) completo + parciales viejos P2 | unidades 6-8 + Parcial 2
- Ingerido todo el material nuevo de `raw/modulo-3-empresa/` y `raw/parcial-2-empresa/` con 4 agentes en paralelo. **Cierra el curso: 8/8 unidades procesadas.** Quedan 4 días para el Parcial 2 (16-Jun-2026).
- Fuentes procesadas:
  - **U6:** epi09_contavs_09.pdf (69pp contabilidad), epi09_costos_09.pdf (23pp costos), GP5 (.doc, 7 ej. convertidos con textutil)
  - **U7:** 3_Valor Tiempo del Dinero_GF2020.pdf (73pp), Guía de Ejercicios cátedra (10pp), FAQ cátedra (5pp), Archivo VTD.xls (companion Brigham, dump con openpyxl/xlrd)
  - **U8:** epi09_pc 2.pdf (87pp, presupuesto de capital)
  - **Parciales P2:** P2 11112025 EP.docx + P2 C2 2025 44.xlsx (**solución oficial cátedra**, dump openpyxl), P2_SCE_022010_E.pdf (en realidad 19-11-2010, no Feb), p2_sce_09_e.pdf (19-06-2009)
- **Páginas creadas (47):**
  - Unidades: unidad-06/07/08
  - Fórmulas: formulas/unidad-06/07/08
  - Conceptos U6 (18): partida-doble, balance-patrimonial, cuadro-de-resultados, devengado-vs-percibido, amortizacion-contable, bienes-de-cambio-vs-bienes-de-uso, previsiones-vs-provisiones, estado-origen-aplicacion-fondos, ratios-financieros, ecuacion-dupont, ebit-ebitda, capital-de-trabajo, ciclo-de-caja, sistemas-de-costeo, costos-directos-indirectos, costos-producto-vs-periodo, contribucion-marginal, punto-de-equilibrio
  - Conceptos U7 (8): valor-tiempo-dinero, capitalizacion-actualizacion, tasas-equivalentes, anualidades, perpetuidades, sistemas-amortizacion, descuento-comercial, costo-financiero-total
  - Conceptos U8 (12): flujo-de-fondos-proyecto, van, tir, payback, trema, escudo-fiscal, costo-hundido, valor-residual, capital-de-trabajo-en-proyectos, costo-anual-equivalente, proyectos-mutuamente-excluyentes, tir-multiple
  - Ejercicios (3): gp5-informacion-contable (GP5 resuelta), guia-ejercicios-calculo-financiero (10 ej. VTD), casos-evaluacion-proyectos
  - Exámenes (4): parcial-2-2025-11-11 (con solución oficial), parcial-2-2010-11-19, parcial-2-2009-06-19, parcial-2-analisis
- **Páginas extendidas (2):** conceptos/tasa-interes y conceptos/tasa-interes-real — sumado tag unit-07 y profundidad (componentes de la tasa, tasas bancarias, tasa real de subperíodo); NO duplicadas.
- **Páginas actualizadas:** index.md (tablas de conceptos U6/U7/U8, fórmulas 6-8, ejercicios, sección Exámenes Parcial 2), overview.md (8/8, narrativa Empresa, 4 temas transversales nuevos), log.md.
- **Lint de cierre:** scan de wikilinks → 0 links .md rotos, 0 colisiones de slug, todos los .svg embebidos resuelven. Los 4 agentes integraron limpio (cross-links U6↔U7↔U8 verificados: escudo-fiscal, amortizacion-contable, devengado-vs-percibido, etc.).
- **Insights clave Parcial 2:**
  - Estructura actual (2025): 2 problemas grandes sin V/F — P1 decisión financiera (U7, comprar vs alquilar), P2 evaluación de proyecto (U8, VAN). Antes (2009/2010) había V/F contable + cálculo financiero + VAN.
  - El paso 1 SIEMPRE es convertir TNA a tasa efectiva del período: TNA 35% cap. diaria → TEM = (1+0,35/360)³⁰−1 ≈ 2,958%.
  - FEO = UN + Amort = (V−C)(1−t) + t·Amort. Amortización: resta para el IG y vuelve. Vida contable ≠ técnica; base excluye valor de rezago.
  - Escudo fiscal: importa el cuándo — amortizar más lento (15 vs 10 años) baja el VAN (resultado oficial 2025 P2b: "menor por menor escudo impositivo").
  - Costo hundido recurrente y disfrazado: consultora/estudios ya pagados NUNCA entran (en 2010 incluirlo cambia el signo del VAN). Alquileres ya pagados = hundidos.
  - Venta de activo: FEE = VM − t(VM − VL); si VL=0, toda la venta es ganancia gravada (300 → 210).
  - Cobertura de intereses: la cátedra la define con EBITDA, no EBIT (flaggeado en GP5 Ej.5).
- **Partes 2-3 de la Guía de Ejercicios resueltas (seguimiento mismo día):** página nueva `ejercicios/guia-ejercicios-evaluacion-proyectos.md` con los 6 ej. de evaluación de proyectos (Parte 2) + 2 de reemplazo (Parte 3) resueltos paso a paso. Validado contra la FAQ: ej. 3 da diferencia de VAN = $1.984 (oficial). Resultados: Ej1 VAN +568, Ej2 (Gatoturro) +2.782, Ej3 +1.984, Ej4 +646.788, Ej5 +3.860, Ej6 +232; reemplazo: vida económica Ej1 = 4 años, Ej2 = 1 año (solución de borde por O&M creciente). Catalogada en index.md y enlazada desde guia-ejercicios-calculo-financiero.md.
- **Lint final:** 180 páginas .md, 0 wikilinks rotos, 0 SVG faltantes.

## [2026-06-12] review | QA independiente del Módulo 3 + Parcial 2 | unidades 6-8 + Parcial 2
- 4 agentes revisores independientes y adversariales (recalcularon desde las fuentes crudas, no desde la wiki): A=ejercicios U7+U8, B=parciales P2, C=U6 contabilidad, D=convenciones/links/contradicciones.
- **Veredicto: 0 BLOCKERS, 0 MAJORS.** Verificado: los 18 ej. de la guía + 4 casos recomputan exactos; matchea los 2 resultados oficiales de la FAQ ($1.282,53 y $1.984); el parcial 2025 coincide al dígito con el Excel oficial (14 valores clave); 2010/2009 re-derivados de cero dan exacto; Tema 1 del P2 2025 = −97,87 MM confirmado; fechas reales 19-11-2010 y 19-jun-2009; balance GP5 Ej.1 cierra (4425=4425); reconstrucción por ratios Ej.5 consistente (DuPont 40% exacto); flag EBITDA en cobertura de intereses respaldado textualmente por la fuente.
- **Fixes aplicados (solo NITs cosméticos):** (1) `casos-evaluacion-proyectos` Caso 2: nota de que los VAN 1.501/1.401 vienen redondeados de la slide (exacto ≈1.507/1.405); (2) `formulas/unidad-06` FCFF/FCFE: unificada la alícuota de IG de α a `t` para coherencia con U8; (3) `parcial-2-2009-06-19` Ej.2: declarado el supuesto de que el equipo es mercadería de la Vendedora (acredita Bienes de Cambio); (4) `gp5-informacion-contable` Ej.5: aclarado que la tasa de IG residual ≈45% es atípica (el IG legal es 35%).
- **Dejado tal cual (fiel a la fuente):** números redondeados que reproducen las slides de la cátedra (Caso 2, ejemplo CAE VAN_B 4,123).

## [2026-06-12] build | App de estudio "Estudio" (study/) construida y verificada | general
- Construida la app web offline en `study/` (el lanzador `Estudio.command` existía desde abril pero la carpeta nunca se había creado). Arquitectura replicada de la app hermana de Probabilidad: SPA vanilla JS, KaTeX y marked vendorizados, funciona por `file://` o servida en `:8765`.
- **Componentes:** `build.py` (parsea `wiki/` → `data.js`, 180 páginas), `app.js` (lector, búsqueda Cmd+K, flashcards SM-2, quiz V/F, ejercicios con solución revelable, trampas, grafo, notas), `calc.js` (6 calculadoras financieras con paso a paso en KaTeX: tasas, anualidades, préstamos con cuadro de marcha, VAN/TIR con flujo editable, FEO/FEE, punto de equilibrio), `simulacro.js` (parciales viejos cronometrados con pasos revelables), `lib-fin.js` (matemática financiera pura), `study-data.js` (95 V/F + 85 flashcards + 10 trampas + recetas + plan 4 días).
- **Verificación adversarial (3 agentes):** 59/59 chequeos numéricos contra resultados oficiales (NIKITA 2010 VAN +39.905 reconstruido fila por fila, TNA 35%→TEM 2,958%, guía U7 Ej4 cuota 86.304, etc.); banco V/F auditado ítem por ítem contra el wiki; 18 hallazgos, todos los serios corregidos (bug crítico de apareamiento de `$` que rompía tablas con U$D, fugas de solución en 3 guías, anclas rotas, scroll).
- **Wiki tocado:** `ejercicios/guia-ejercicios-evaluacion-proyectos.md` — promovidos `### Ej. N` → `## Ej. N` (Partes 2 y 3) para que cada ejercicio tenga su propio botón de revelación en la app.
- **Pendiente de revisar (flag del auditor):** ítem del banco V/F "oferta perfectamente elástica ⇒ traslado a productores" (marcado V en el wiki) contradice la teoría estándar de incidencia — verificar contra el PDF fuente.
