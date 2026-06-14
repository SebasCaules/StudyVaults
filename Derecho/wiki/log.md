---
title: "Log de Operaciones"
type: log
fecha_creacion: 2026-04-12
ultima_actualizacion: 2026-06-02
---

# Log de Operaciones

## [2026-06-02] ingest | Parciales viejos del 2do Parcial — preguntas repetidas

### Que se hizo
- Ingesta de **3 fuentes nuevas** desde `raw/2doParcial/`: `Derecho - Segundos Parciales Viejos.docx` (7 examenes con respuestas: 2C-2025, 1C-2025, 2C-2024, 2C-2023 ×3, 1C-2023), `2020 2C.pdf` (parcial online 2020, 17 preguntas resueltas) y `Megadoc Derecho 2do Parcial.pdf` (compilado de rondas con respuestas y notas de alumnos, 27 pp).
- Extraccion: docx con `python-docx`; PDFs con `pypdf`.
- Cruce de los **9 examenes** para detectar preguntas recurrentes (~60 items distintos, rankeados por frecuencia 2×-8×).

### Hallazgos clave
- Pregunta de desarrollo mas repetida (8×): "invente un emprendimiento y compare ≥3 tipos de sociedades" (U6).
- Pregunta camaleon "Hoy es 21 de diciembre…" (7×): la respuesta cambia segun el escenario (accidente→eventual; vacaciones→plazo fijo; renuncia/jubilacion→indeterminado parcial/completo). Tabla resolutiva creada.
- Tema mas tomado de U8: garantia (6 nuevo / 3 usado, irrenunciable) y definicion de consumidor/usuario.
- Trampas estrella confirmadas: art. 14 vs 14 bis CN; planos de subordinacion (economico/tecnico/juridico, no moral/dolo/culpa); deberes del empleador vs del trabajador.
- **Discrepancias flageadas:** "consumidor expuesto" (derogado 2015), retractacion de la aceptacion (teoria de la recepcion vs nota erronea de alumno), sociedad de hecho (libro: solidaria e ilimitada / reforma: Seccion IV mancomunada art. 24), aviso telefonico por enfermedad (B,F,H vs solo B,H).

### Paginas creadas
- [[2doParcial/preguntas-repetidas-2do-parcial]] — preguntas repetidas con respuestas, explicaciones y trampas (ranking + por unidad).
- [[2doParcial/preguntas-repetidas-2do-parcial-print.html]] — imprimible A4 (boton imprimir / guardar como PDF).
- [[2doParcial/fuente-parciales-viejos-2do]] — resumen de las 3 fuentes y discrepancias.

### Paginas actualizadas
- [[2doParcial/INDEX]] (seccion NUEVO 2026-06-02), [[2doParcial/guia-maestra-2do-parcial]] (callout + fila en tabla de recursos), `wiki/index.md` (seccion material 2do parcial).

## [2026-06-02] mantenimiento | Carga de notas Parcialitos 4 y 5 — tracker actualizado

### Que se hizo
- El usuario informo las notas de los dos parcialitos que figuraban pendientes: **Parcialito 4 (U7+Suits) = 8** y **Parcialito 5 (Laboral/U9) = 8**.
- Actualizado el "Tracker de notas y ruta a final reducido" en `wiki/index.md`:
  - Parcialitos cerrados: **33/50** (promedio 6,6/10; subio desde 5,67).
  - Subtotal corrido asegurado: **51,7/100**. Maximo alcanzable: 76,7/100.
  - Reemplazadas las tablas de combinaciones P4/P5/Parcial 2 (ya obsoletas) por una unica tabla de sensibilidad sobre el **Parcial 2**, que es la unica variable restante.
- **Conclusion para el final reducido (70/100):** alcanza con **18,3/25 (73,2%)** en el Parcial 2; basicamente replicar el primer parcial (18,7/25 = 74,8%).

## [2026-06-01] ingest | TPE Vitae — nuevos documentos (TP final, borrador, slides)

### Que se hizo
- Ingesta de **3 documentos nuevos** aparecidos en `raw/TPE/`: `Vitae_TP_Derecho.docx` (TP final escrito, 10 secciones), `Derecho - TP.docx` (borrador anterior incompleto) y `Derecho - TP.pptx` (esqueleto de 6 slides).
- Extraccion: docx via `textutil`; pptx via script Python (zipfile + XML, texto de slides + notas — sin notas de orador).
- Creadas 3 paginas fuente: [[TPE/fuente-tp-final-vitae]], [[TPE/fuente-tp-borrador]], [[TPE/fuente-presentacion-slides]].

### Hallazgos clave
- **`Vitae_TP_Derecho.docx` es el entregable definitivo** y ya aplica el reencuadre de la docente: caso "Pedro" (mala praxis por dosis incorrecta), eje civil/consumeril, solucion REFEPS. Columna vertebral juridica = **CCyC art. 1716 + 1723 (obligacion de resultado → objetiva) + 732 (auxiliares) + art. 40 LDC**. Suma un **2° fallo de cartilla**: Juzgado Civ. y Com. N°10 La Plata (SAIJ **SUC0411048**), ademas del fallo Mercedes (OSDE).
- ⚠️ **Discrepancia detectada:** el escrito final elige **S.A.S.** (Ley 27.349) pero la **slide 3** del pptx titula **"¿Por que una S.A.?"**. Flag puesto en [[TPE/caso-vitae]], [[TPE/fuente-presentacion-slides]] y [[TPE/INDEX]] para unificar antes de exponer.
- El **borrador** (`Derecho - TP.docx`) esta marcado `[TO BE CONTINUED]` en la seccion 5 y aporta solo el caption completo del fallo dudoso "Lambare/Lamboré c/ Mercado Libre" y la "Figura 1 - Buscador de Vitae" (mockup UI).

### Paginas actualizadas (incorporan lo que aporta el TP final)
- [[TPE/problematica-juridica-vitae]] (caso "Pedro" + columna vertebral art. 1716/1723/732 + art. 40).
- [[TPE/mala-praxis-y-deber-seguridad]] (2° precedente de cartilla La Plata N°10 SAIJ SUC0411048 + art. 1723).
- [[TPE/caso-vitae]] (flag S.A./S.A.S. + detalle SAS: clases 42/44 INPI, art. 58 LGS, art. 23 LCT).
- [[TPE/INDEX]] y `wiki/index.md` (nuevas fuentes + discrepancia).

## [2026-06-01] examen | Re-lectura completa fuentes crudas U6-U9 + material 2do parcial

### Que se hizo
- **4 agentes paralelos** releyeron exhaustivamente TODAS las fuentes crudas de las unidades 6, 7, 8 y 9 (PDF de slides, leyes, doctrina, fallos, estatutos modelo, parcialitos compilados y .ppt via `strings`), cotejando contra las paginas wiki existentes.
- Se generaron 4 dumps de estudio densos con cita por articulo y banco de preguntas validado por unidad: `wiki/2doParcial/_build/extraccion-u6.md` (45 preg.), `u7` (53), `u8` (54), `u9` (50).
- Consolidacion y validacion del banco: **202 preguntas** (141 MC + 61 V/F; 46 reales de parcialitos viejos; 79 trampas). Sin errores de schema. Se **rebalanceo** la posicion de la respuesta correcta a/b/c/d (antes concentrada en "b": 73/141 → ahora 35/36/35/35) para respetar la preferencia registrada. Guardado en `wiki/2doParcial/_build/preguntas.json`.
- **Paginas/herramientas creadas:**
  - [[2doParcial/guia-maestra-2do-parcial]] — guia maestra autocontenida (tabla maestra de numeros, 31 trampas, correcciones, casos, integradoras, plan de estudio).
  - `wiki/2doParcial/quiz-2do-parcial.html` — app interactiva self-contained con las 202 preguntas (validada con `node --check`). Modos: practicar/trampas/reales/flashcards/simulacro cronometrado/repaso de errores/marcadas; localStorage.

### Verificaciones web (registro obligatorio)
- **Locacion — plazo vigente:** Ley 27.551 (3 años) derogada por **DNU 70/2023** + **Ley Bases 27.742**; art. 1198 CCyC reformado → **minimo supletorio 2 años**. Fuente: https://www.argentina.gob.ar/normativa/nacional/ley-27551-339378/texto ; art. 1240 (3/4 partes) https://leyes-ar.com/codigo_civil_y_comercial/1240.htm
- **Dano punitivo — tope vigente:** art. 52 bis → art. 47 inc. b modificado por **Ley 27.701** (BO 1/12/2022): **0,5 a 2.100 CBT** tipo 3 (caduco el "$5.000.000"). Fuentes: https://www.palabrasdelderecho.com.ar/articulo/4018/ ; https://abogados.com.ar/defensa-del-consumidor-los-nuevos-montos-de-multas-y-de-danos-punitivos-y-el-costo-argentino/31816
- **Reforma laboral 2026:** confirmada la **Ley 27.802 de Modernizacion Laboral** (BO 6/3/2026, Decreto 137/2026, 218 arts.); periodo de prueba 6 meses (Ley Bases); art. 245 y tope subsisten; Vizzoti con rango legal; **FAL creado pero vigencia postergada**. Fuentes: EY Argentina, Boletin Oficial, U. de Palermo, Blog del Contador.

### Correcciones aplicadas a paginas existentes (datos desactualizados)
- Paginas actualizadas: [[unidad-7/locacion]] (plazo 3→2 años), [[unidad-6/sociedades-seccion-iv]] (responsabilidad mancomunada por partes iguales art. 24; subsanacion sin "mayoria"), [[unidad-6/ley-general-sociedades]] ("art. 54 ter" → art. 54 ult. parrafo).
- Otras discrepancias detectadas (documentadas en la guia maestra, seccion "Correcciones"): SAU exceptuada del min. 3 directores y sindicatura colegiada; SRL sindicatura no por "más de 20 socios"; periodo de prueba 6 meses; base art. 245 sin SAC; capital art. 299 inc. 2 = $2.000.000.000.

### Indices
- Actualizados [[2doParcial/INDEX]] y [[index]] con la guia maestra y el quiz v2.

## [2026-06-01] ingest | TPE Caso Vitae (correo + investigacion + consigna + rubrica)

### Que se hizo
- **Descarga del hilo de correo** con la docente (Sofia Lavandera) desde Gmail via Chrome MCP (expandir hilo + extraer texto de los 4 mensajes). Guardado en `raw/TPE/email-consulta-docente-tpe.md`.
- **Lectura completa** de las 4 fuentes del TPE: el correo, `Investigacion_Vitae.pdf` (54 pp.), `Consigna del Trabajo Práctico.docx` y `Rúbrica y lineamientos...docx`.
- Creacion de la carpeta `wiki/TPE/` con 9 paginas (4 fuente + 4 contenido + 1 indice integrador).

### Fuentes procesadas
- `raw/TPE/email-consulta-docente-tpe.md` (nuevo, descargado de Gmail).
- `raw/TPE/Investigacion_Vitae.pdf` (54 pp.: ejecutivo, casos ejercicio ilegal, jurisprudencia plataformas, CSJN intermediarios, normativa, doctrina, sintesis).
- `raw/TPE/Consigna del Trabajo Práctico.docx`.
- `raw/TPE/Rúbrica y lineamientos trabajo derecho para ingenieros.docx`.

### Busquedas web realizadas (registradas por directriz)
- WebFetch del articulo recomendado por la docente: [Camoron — responsabilidad solidaria prestador medico / prepaga](https://camoron.org.ar/nuevas-normas/responsabilidad-civil/es-mala-praxis-del-prestador-del-servicio-medico-y-la-prepaga-tambien-es-prestador-del-servicio-medico/) → identifico el fallo **"B.E.C. c/ D.R.S." (Cam. Civ. Com. Mercedes, 29/04/2020)**: quemadura por acido en concentracion inadecuada, OSDE responde por cartilla + deber de seguridad (art. 1198 CC / art. 5 LDC / art. 732 CCyC), condena $402.400.
- WebSearch "responsabilidad solidaria prepaga cartilla medica deber de seguridad art 40 LDC" → confirmo doctrina del art. 40 LDC objetiva y solidaria para prepagas por sistema de cartilla.

### Hallazgo clave (reencuadre)
- El correo de la docente **corrige el enfoque** de la investigacion del grupo: el `Investigacion_Vitae.pdf` esta muy cargado de **derecho penal** (Cap. 2 ejercicio ilegal), pero la docente pide **eje civil/consumeril** (sin daño no hay resarcimiento; simular mala praxis leve; centrar en responsabilidad solidaria por cartilla + deber de seguridad). Este reencuadre quedo destacado en [[TPE/fuente-email-consulta-docente]] y [[TPE/problematica-juridica-vitae]].

### Paginas creadas
- [[TPE/INDEX]], [[TPE/fuente-consigna-tpe]], [[TPE/fuente-rubrica-tpe]], [[TPE/fuente-investigacion-vitae]], [[TPE/fuente-email-consulta-docente]], [[TPE/caso-vitae]], [[TPE/problematica-juridica-vitae]], [[TPE/responsabilidad-plataformas-digitales]], [[TPE/mala-praxis-y-deber-seguridad]].

### Paginas actualizadas
- `wiki/index.md` (arbol de directorios + nueva seccion "Trabajo Practico — Caso Vitae").

## [2026-05-28] mantenimiento | Rework herramienta de estudio 2do Parcial

### Que se hizo
- Revision exhaustiva de raw/ y wiki/ (U6-U9) con 5 agentes paralelos para detectar material no incorporado.
- Expansion del banco de la herramienta interactiva de **112 a 209 preguntas**.
- Rediseno completo con paleta Claude (sin emojis) en 3 secciones: Practicar, Teoria, Progreso.

### Fuentes minadas (no exprimidas antes)
- `wiki/unidad-7/fuente-cuarto-parcialito-compilado.md`, `wiki/unidad-9/fuente-quinto-parcialito-compilado.md`, `wiki/unidad-8/fuente-preguntas-trabajo-consumidor.md`, mocks P4/P5 → **40 preguntas reales** de parcialitos viejos (tag real:true).
- Lectura profunda de los wikis U6/U7/U8/U9 → 57 preguntas nuevas de temas no cubiertos (capital/suscripcion, reorganizacion societaria, sena/arras, pacto comisorio, agencia/concesion, asociaciones de consumidores, sanciones LDC, regimenes laborales especiales 26.844/26.727, solidaridad arts. 30/31, prescripcion 256, etc.).

### Hallazgo de QA corregido
- `mix-1`: la explicacion citaba "Palomeque c/Benemeth" como confirmatorio del corrimiento del velo; en realidad la CSJN (2003) fijo criterio RESTRICTIVO. Corregido.

### Funciones nuevas de la herramienta
- Repeticion espaciada (Leitner, niveles 1-5) que alimenta "Repaso inteligente" y flashcards.
- Modos: Examen real (40 reales), Trampas (14), Flashcards con auto-evaluacion, Marcadas, repaso de errores.
- Seccion Teoria: 32 fichas de referencia navegables y buscables (U6-U9).
- Seccion Progreso: dominio general, distribucion por nivel, aciertos por unidad y por tema (debiles primero, clickeables).
- Exportar repaso a Markdown, dark mode, atajos, racha.

### Validacion
- Banco JSON valida sin errores; las 209 preguntas evaluan su respuesta correcta como OK; script ejecuta sin errores con DOM stub; 0 opciones duplicadas; matches con items/labels/correct consistentes.

### Paginas actualizadas
- [[2doParcial/estudio-interactivo.html]] (rework), [[2doParcial/INDEX]], [[index]].
- Fix menor: link roto `reglamento-interno-recursos-informaticos` en `derechos-deberes-laborales.md`.

---

## [2026-05-20] ingest | Quinto Parcialito - Compilado (21 preguntas viejas U9)

### Fuente procesada

- `raw/unidad-9/Quinto Parcialito - Compilado.docx` — docx con **21 preguntas con opciones** + un fragmento "Sin opciones" que solo repite la pregunta #11 (objetivo del principio protectorio) y no aporta contenido nuevo.

### Extraccion

- Texto via `python-docx` (160 paragrafos, 0 tablas). El documento se compone de enumeraciones planas; las "asociaciones" (pregs 12 y 18) estan escritas como `concepto → descripcion` en parrafos.
- 8120 caracteres totales. No hay imagenes con contenido (solo image1.png en header decorativo).

### Resolucion

Cada pregunta se respondio con:
- Opcion correcta marcada (✅) + por que se descartan las demas.
- Cita del articulo LCT / CN relevante (con texto literal cuando aporta).
- Wikilink al concepto desarrollado del wiki existente.

### Distribucion historica del P5 detectada

| Tema                                              | # preguntas | %    |
|---------------------------------------------------|-------------|------|
| Principios (protectorio, continuidad, primacia, irrenunciabilidad) | 8           | 38%  |
| Deberes / facultades del empleador               | 4           | 19%  |
| Subordinacion / dependencia                       | 2           | 10%  |
| Extincion del contrato                            | 2           | 10%  |
| Autonomia de voluntad / orden publico laboral     | 2           | 10%  |
| Art. 14 vs 14 bis CN (incluye trampa)             | 2           | 10%  |

### Paginas creadas

- [[unidad-9/fuente-quinto-parcialito-compilado]] — fuente con las 21 preguntas resueltas, mapa de temas, hoja de respuestas y conexiones.

### Paginas actualizadas

- [[index]] — agregado link a la nueva fuente en seccion "Compilados de parcialitos viejos por unidad" y en "Entidades y fuentes — Unidad 9".
- [[unidad-9/unidad-9-resumen]] — agregada la nueva fuente al frontmatter (`fuentes:` y `ultima_actualizacion`), a la tabla de paginas y a "Material de estudio recomendado". Resaltado el patron historico observado.

### Busquedas web

- No se realizaron. El compilado es **conceptual puro** sobre Cap. 9 Perego + LCT y no introduce normativa nueva ni jurisprudencia que requiriera contraste externo. Las reformas recientes (DNU 70/2023, Ley Bases, Ley 27.802) **NO** aparecen en el compilado historico — ya estan cubiertas por [[reformas-laborales-recientes]] desde el ingest del 2026-05-07.

### Hallazgos relevantes

1. **Trampa clasica 14 vs 14 bis CN** (pregunta #19): el enunciado dice "art. 14" cuando el contenido enumerado corresponde al "art. 14 bis" → respuesta **F**. Confirmado por contraste con pregunta #6 (mismo contenido, atribuido correctamente a 14 bis → V).
2. **Trampa irrenunciabilidad** (pregunta #10): redefine el principio mezclando "renunciar a derechos" con "renunciar al empleo" → F. La irrenunciabilidad (art. 12 LCT) protege derechos, no impide renunciar al vinculo.
3. **Confusion deberes empleador / trabajador** (pregunta #16): los distractores incluyen deberes del trabajador (diligencia, custodia, no concurrencia — arts. 84-88 LCT) y facultades del empleador (sancionar — art. 67) presentados como "deberes" del empleador.
4. **Repeticion textual** (pregs 1, 5 y 8 sobre continuidad + 13 y 14 sobre primacia de la realidad): la catedra reusa enunciados casi identicos en parcialitos distintos — memorizar definiciones literales del Perego garantiza puntos.
5. **Ausencia de reformas en el historico**: el compilado **no** trae preguntas sobre DNU 70/2023, periodo prueba 6 meses, FAL ni art. 245 bis. El docente anuncio que se sumaran en 2026 → estudiar [[reformas-laborales-recientes]] como complemento.

---

## [2026-05-07] ingest | Unidad 9 — Derecho Laboral (sin ART)

### Fuentes procesadas

| Archivo | Tipo | Cobertura |
|---------|------|-----------|
| `raw/unidad-9/laboral clase.ppt` | Slides catedra (PowerPoint binario, ~36 slides) | Panorama general |
| `raw/assets/LIBRO Nociones de Derecho - Perego (...).pdf` Cap. 9 | Texto del libro | pp. **201-224 (sin ART)** |

Extraccion del .ppt via `strings` (no hay libreoffice en el sistema). Lectura del libro en 2 pasadas (pp. 201-218, 219-228).

### Por consigna del docente

> "La actividad versara sobre el capitulo del libro, de derecho laboral; pero **sin incluir el tema de ART**. Vamos a arrancar desde ese punto para llegar, en clase, a **lo que recientemente se ha reformado**."

Se EXCLUYO la seccion sobre ART (pp. 225-228). Las reformas recientes (**DNU 70/2023**, **Ley Bases 27.742**, **Ley 27.802 Modernizacion Laboral 2026**) tienen pagina dedicada y son tema central del parcialito 5.

### Paginas creadas en `wiki/unidad-9/` (17)

| Pagina | Tipo |
|--------|------|
| [[unidad-9/fuente-laboral-clase-slides\|fuente-laboral-clase-slides]] | fuente |
| [[unidad-9/fuente-libro-perego-cap9\|fuente-libro-perego-cap9]] | fuente |
| [[unidad-9/ley-contrato-trabajo\|ley-contrato-trabajo]] | entidad |
| [[unidad-9/contrato-de-trabajo\|contrato-de-trabajo]] | concepto |
| [[unidad-9/relacion-de-dependencia\|relacion-de-dependencia]] | concepto |
| [[unidad-9/principios-derecho-laboral\|principios-derecho-laboral]] | concepto |
| [[unidad-9/modalidades-contratacion-laboral\|modalidades-contratacion-laboral]] | concepto |
| [[unidad-9/jornada-de-trabajo\|jornada-de-trabajo]] | concepto |
| [[unidad-9/remuneracion-salario\|remuneracion-salario]] | concepto |
| [[unidad-9/regimen-licencias\|regimen-licencias]] | concepto |
| [[unidad-9/derechos-deberes-laborales\|derechos-deberes-laborales]] | concepto |
| [[unidad-9/extincion-contrato-trabajo\|extincion-contrato-trabajo]] | concepto |
| [[unidad-9/indemnizaciones-laborales\|indemnizaciones-laborales]] | concepto |
| [[unidad-9/derecho-colectivo-trabajo\|derecho-colectivo-trabajo]] | concepto |
| [[unidad-9/convenios-colectivos-trabajo\|convenios-colectivos-trabajo]] | concepto |
| [[unidad-9/reformas-laborales-recientes\|reformas-laborales-recientes]] ⭐⭐ | concepto |
| [[unidad-9/unidad-9-resumen\|unidad-9-resumen]] | resumen |

### Jurisprudencia y casos referenciados

- **"Vizzoti, Carlos Alberto c/AMSA S.A."** CSJN 14/9/2004 — Tope art. 245 LCT.
- **"Bonanata, Gorizia, Emma c/Nestle S.A."** CNAT Fallo Plenario N 50, 13/5/1959 — Antiguedad en temporada.
- **"Acuna, Alejandro c/Frigorifico La Negra"** CNAT Fallo Plenario N 34, 24/7/1956.
- **"ATE c/Min Trabajo"** CSJN 2008 — Cuestionamiento al monopolio de personeria gremial.
- **"Pellicori"** CSJN 2011 — Ley 23.592 antidiscriminacion.

### Decisiones de criterio

1. **Periodo de prueba**: el slide dice "3 meses" (regimen historico). Las paginas wiki documentan tanto el **regimen historico** como el **vigente (6 meses por Ley Bases 27.742)**, marcando la diferencia.
2. **Multas por trabajo no registrado**: documentadas pero senalando que el **DNU 70/2023** las derogo o atenuo.
3. **Base art. 245**: documentada la formula original + la modificacion del **DNU 70/2023 + Ley 27.802** (sin SAC ni bonos).
4. **ART**: EXCLUIDO completamente conforme consigna del docente.

### Updates de index.md

- Agregado [[unidad-9/unidad-9-resumen|unidad-9-resumen]] a la lista de resumenes por unidad.
- Nueva seccion "Conceptos — Unidad 9" con las 16 paginas concepto/entidad/fuente.

## [2026-05-07] examen | Guia parcialito 5 — Derecho Laboral (Cap. 9 Perego sin ART)

### Solicitud del docente

> "La actividad versara sobre el capitulo del libro, de Derecho Laboral, **sin incluir el tema de ART** (Aseguradoras de Riesgo de Trabajo). Vamos a arrancar desde ese punto para llegar, en clase, a lo que **recientemente se ha reformado**. Cada curso en la fecha correspondiente. Un tema muy actual e importante en nuestro pais."

### Trabajo realizado

- **Fuente principal**: Libro Perego "Nociones de Derecho", **Cap. 9 — Derecho Laboral**, pp. 201-225 (PDF en `raw/assets/`). Excluye seccion 4 (pp. 226-228 = ART/LRT).
- **Pagina creada**: [[parcialitos/examen-parcialito-5-laboral|examen-parcialito-5-laboral]] — guia de estudio autocontenida, 13 secciones + tablas de referencia rapida + checklist examen.

### Web research realizada (para incorporar reformas no presentes en el libro 2015)

- `Ley Bases 27.742 reforma LCT periodo prueba indemnizacion despido 2024` — confirmado: la **Ley 27.742 "Ley Bases"** (BO 8/7/2024) extiende periodo de prueba a 6 meses (ampliable por CCT a 8/12 segun tamano), crea fondos de cese laboral, incorpora art. 245 bis LCT (despido discriminatorio +50%/100%). Reglamentada por Decreto 847/2024. Fuente: [O'Farrell](https://www.estudio-ofarrell.com/reforma-laboral-introducida-por-ley-bases-n-27-742/), [Estudio Vilaplana](https://estudiovilaplana.com.ar/2024/10/12/reforma-laboral-que-cambia-en-indemnizaciones-ley-bases-27742/).
- `Ley 27802 modernizacion laboral Argentina marzo 2026 reforma LCT` — **HALLAZGO CLAVE**: la **Ley 27.802 — Modernizacion Laboral** (BO 6/3/2026) es la reforma "muy actual" que el docente menciono. Modifica >38 leyes. Cambios: (a) excluye SAC + vacaciones + horas extra de la base de indemnizacion del art. 245; (b) crea **FAL (Fondo de Asistencia Laboral)** con aporte 1-2,5% mensual a entidades de la CNV; (c) registracion centralizada en **ARCA** (ex-AFIP) — nuevo art. 52 LCT; (d) promocion del empleo formal. Fuente: [argentina.gob.ar](https://www.argentina.gob.ar/normativa/nacional/ley-27802-423680), [Boletin Oficial](https://www.boletinoficial.gob.ar/detalleAviso/primera/339128/20260306), [Garcia Alonso comentada](https://garciaalonso.com.ar/blog/ley-27802-comentada-que-cambio/).
- `DNU 70/2023 reforma laboral LCT principales cambios` — confirmado: **DNU 70/2023** (BO 21/12/2023, vigente 29/12/2023): periodo prueba a 8 meses, eliminacion de multas por registracion deficiente, base art. 245 sin SAC ni bonificaciones, aportes sindicales con consentimiento expreso, registracion electronica. Fuente: [Errepar](https://documento.errepar.com/actualidad/reforma-laboral-los-cambios-mas-relevantes-en-la-lct-20231221185545060), [WSC Legal](https://wsclegal.com/es/decreto-70-23-reforma-laboral/).

### Estructura de la guia creada

1. Marco normativo y bases constitucionales (CN arts. 14 y 14 bis + piramide LCT)
2. Definicion y especialidad del Derecho del Trabajo (con division individual/colectivo + jornadas)
3. Principios generales (mnemotecnia "PIRC-BNGR")
4. Derechos y deberes de las partes
5. 5 modalidades de contratacion (plazo fijo, eventual, temporada, equipo, tiempo parcial)
6. Salario y administracion RRHH
7. Regimen de licencias (ordinaria/maternidad/enfermedad)
8. Sanciones y extincion del contrato
9. Indemnizaciones por despido (art. 245 + Vizzoti + agravadas)
10. Reglamento interno y uso de recursos informaticos
11. **Reformas recientes — DNU 70/2023, Ley Bases 27.742, Ley 27.802** (cuadro comparativo)
12. Mnemotecnia y tablas de referencia rapida (plazos, articulado clave, formulas)
13. Checklist examen (preguntas tipo + trampas + caso integrador)

Total: ~600 lineas de markdown, autocontenido para repaso pre-examen.

## [2026-05-07] examen | Mock parcialito 5 — Derecho Laboral

- **Pagina creada**: [[parcialitos/mock-parcialito-5-laboral|mock-parcialito-5-laboral]] — simulacro de 25 preguntas formato compatible con parcialitos historicos.
- **Estructura**: 14 multiple choice + 7 V/F + 2 completar + 2 numericas (calculo de indemnizacion + preaviso).
- **Cobertura**: marco constitucional, definicion contrato/relacion, subordinacion, principios (especialmente protectorio + primacia realidad), indemnizacion art. 245 + Vizzoti, vacaciones, jornadas, maternidad, irrenunciabilidad, despido con justa causa, **reformas recientes (DNU 70/2023, Ley Bases 27.742, Ley 27.802)**.
- **Distribucion** de respuestas correctas auditada: **4-4-4-4** entre a/b/c/d (cumple directiva del usuario de no concentrar en "b"). V/F: 4V + 3F.
- **Hoja de respuestas**: cada respuesta con fundamento + cita de articulo, tabla de auto-evaluacion, escala a 10, tabla de errores → seccion de la guia para repasar.

## [2026-05-06] mantenimiento | Reorganizacion de archivos sueltos del wiki

Se ordenaron los archivos sueltos de la raiz `wiki/` en carpetas tematicas y se eliminaron duplicados.

### Carpetas creadas

- **`parcialitos/`** — material individual de parcialitos (analisis transversal, mocks, guias).
- **`referencias/`** — material de referencia general (mapeo libro Perego, etc.).

### Movimientos

| Antes (raiz) | Ahora |
|---|---|
| `analisis-formato-parcialitos.md` | `parcialitos/analisis-formato-parcialitos.md` |
| `examen-parcialito-u7-suits.md` | `parcialitos/examen-parcialito-u7-suits.md` |
| `mock-parcialito-4-suits.md` | `parcialitos/mock-parcialito-4-suits.md` |
| `referencias-libro.md` | `referencias/referencias-libro.md` |

### Duplicados eliminados (eran identicos a las copias en `1erParcial/`)

- `fuente-megadoc-primer-parcial.md` (duplicado de `1erParcial/fuente-megadoc-primer-parcial.md`)
- `preguntas-megadoc-primer-parcial.md` (duplicado de `1erParcial/preguntas-megadoc-primer-parcial.md`)
- `sesion-estudio-preguntas-mixtas.md` (duplicado de `1erParcial/sesion-estudio-preguntas-mixtas.md`)

### Estado final de la raiz

```
wiki/
├── index.md          (entry point)
├── log.md            (esta bitacora)
├── referencias/      → referencias generales
├── parcialitos/      → guias y mocks de parcialitos individuales
├── 1erParcial/       → material integrador 1er parcial
└── unidad-N/         → unidades 1-9
```

Verificacion de duplicados: `diff -q` confirmo identidad byte a byte antes de borrar.
Wikilinks afectados: los basename-only (`[[mock-parcialito-4-suits]]`, etc.) auto-resuelven en Obsidian.
Se actualizaron en `index.md` los path-prefixed para reflejar la nueva ubicacion (ej. `[[parcialitos/mock-parcialito-4-suits]]`).

## [2026-05-06] ingest | Unidad 8 — Derechos del Consumidor

### Fuentes procesadas en `raw/unidad-8/`

| Archivo | Tipo | Paginas |
|---------|------|---------|
| `DERECHOS DEL CONSUMIDOR.pdf` | Slides catedra | 19 |
| `defensa del consumidor.pdf` | Texto Ley 24.240 (LDC) | 30 |
| `defensa de la competencia.pdf` | Texto Ley 25.156 | 17 |
| `ley de lealtad comercial.pdf` | Texto Ley 22.802 | 11 |
| `Fallo defensa del consumidor.pdf` | Sentencia Camara Tucuman 21/4/2021 | 5 |
| `Preguntas para trabajar defensa consumidor.pdf` | 8 casos practicos del docente | 2 |

(Los archivos `.doc` duplicados de la ley de lealtad comercial son version Word del mismo PDF.)

### Web research realizada

- `Ley 27442 defensa competencia Argentina 2018 reemplazo Ley 25156` — confirmado: la **Ley 27.442** (BO 15/5/2018) **derogo la Ley 25.156** y creo la **Autoridad Nacional de la Competencia (ANC)**. Fuente: [argentina.gob.ar](https://www.argentina.gob.ar/normativa/nacional/ley-27442-2018-310241), [UTDT](https://www.utdt.edu/ver_nota_prensa.php?id_nota_prensa=18739).
- `DNU 274/2019 Lealtad Comercial Argentina derogacion Ley 22802` — confirmado: el **DNU 274/2019** (BO 22/4/2019) **derogo la Ley 22.802**. Eleva multa a $200M, regula competencia desleal y publicidad comparativa. Fuente: [argentina.gob.ar](https://www.argentina.gob.ar/normativa/nacional/decreto-274-2019-322236), [Marval](https://www.marval.com/publicacion/nuevo-regimen-de-lealtad-comercial-en-la-argentina-13349).
- `daño punitivo Argentina Ley 27.701 monto máximo` — confirmado: la **Ley 27.701** (BO 1/12/2022) elevo el tope de multas (art. 47 inc. b) y dano punitivo (art. 52 bis) a **2.100 CBT** (Canasta Basica Total tipo 3 INDEC), actualizable mensualmente. A oct/2023 = ~$308.644.035. Fuente: [palabrasdelderecho.com.ar](https://www.palabrasdelderecho.com.ar/articulo/4018/Danos-Punitivos-aumenta-el-tope-economico-de-la-sancion).

### Paginas creadas (26 paginas en `wiki/unidad-8/`)

**Resumen y caso central**:
- [[unidad-8/unidad-8-resumen]] — autocontenido con 11 secciones segun directrices CLAUDE.md
- [[unidad-8/caso-pacheco-cetrogar]] — caso central con doctrina y aplicacion al examen

**Fuentes (5 paginas)**:
- [[unidad-8/fuente-derechos-del-consumidor-slides]]
- [[unidad-8/fuente-ley-24240-texto]]
- [[unidad-8/fuente-ley-25156-texto]]
- [[unidad-8/fuente-ley-22802-texto]]
- [[unidad-8/fuente-fallo-pacheco-cetrogar]]
- [[unidad-8/fuente-preguntas-trabajo-consumidor]] (los 8 casos del docente con respuestas)

**Entidades (5)**:
- [[unidad-8/ley-defensa-consumidor]] — Ley 24.240 entera
- [[unidad-8/ley-defensa-competencia]] — Ley 25.156 + nota 27.442
- [[unidad-8/ley-lealtad-comercial]] — Ley 22.802 + DNU 274/2019
- [[unidad-8/tribunal-defensa-competencia]] — TNDC + ANC
- [[unidad-8/asociaciones-consumidores]] — arts. 55-58 LDC

**Conceptos LDC (13)**:
- [[unidad-8/consumidor]], [[unidad-8/proveedor-consumo]], [[unidad-8/relacion-de-consumo]]
- [[unidad-8/deber-de-informacion]], [[unidad-8/oferta-publicidad-consumo]], [[unidad-8/trato-digno]]
- [[unidad-8/garantias-consumo]], [[unidad-8/clausulas-abusivas]], [[unidad-8/responsabilidad-solidaria-consumo]]
- [[unidad-8/dano-punitivo]], [[unidad-8/dano-directo]]
- [[unidad-8/servicios-publicos-domiciliarios]], [[unidad-8/venta-domiciliaria]], [[unidad-8/derecho-de-revocacion]]

**Conceptos Defensa Competencia + Lealtad (5)**:
- [[unidad-8/posicion-dominante]], [[unidad-8/concentracion-economica]], [[unidad-8/practicas-anticompetitivas]]
- [[unidad-8/publicidad-enganosa]], [[unidad-8/identificacion-mercaderias]]

### Notas relevantes

- La catedra trabaja con la Ley 25.156 (derogada) y Ley 22.802 (derogada) porque son los textos del material. El wiki documenta **ambos regimenes** (historico y vigente) — historico para parciales, vigente para context.
- Erratas detectadas en slides: "Ley 26.631" deberia ser **Ley 26.361** (la gran reforma de 2008).
- El fallo Pacheco c/ Cetrogar **aplica el DNU 274/2019** porque al momento del fallo (21/4/2021) ya estaba vigente — un buen ejemplo de la aplicacion de la lealtad comercial actualizada.

### Indice actualizado con la seccion "Conceptos — Unidad 8" y "Casos Practicos" extendida.

## [2026-04-28] mantenimiento | Re-ingesta del Compilado del Cuarto Parcialito (sin delta de contenido)
- El usuario envio una copia nueva del archivo `Cuarto Parcialito - Compilado.docx` desde `~/Downloads/` para reingerir.
- **Hash MD5 distinto** entre la copia previa (`7279ff...`) y la nueva (`a6a76a9...`), pero el **contenido textual del cuerpo del docx es identico** (verificado via `unzip` + parseo XML de `word/document.xml` y `diff` linea a linea: 144 paragrafos en ambas versiones, output `diff` vacio). La diferencia de hash es solo metadata interna de Word (timestamps de edicion, IDs de revision).
- Acciones:
  - Reemplazada la copia en `raw/unidad-7/Cuarto Parcialito - Compilado.docx` por la version nueva.
  - Backup `OLD-2026-04-21.docx` creado y luego eliminado al confirmar identidad textual.
  - Frontmatter de [[unidad-7/fuente-cuarto-parcialito-compilado]] actualizado con campo `re_ingesta`.
- **No se modificaron paginas concepto** porque el contenido es identico al ya documentado (las 30 preguntas con sus opciones, respuestas y fundamentos juridicos siguen siendo las mismas).
- Paginas afectadas: [[unidad-7/fuente-cuarto-parcialito-compilado]] (solo metadata).

## [2026-04-28] ingest | Compilados P1, P2, P3 + analisis de formato + mock P4
- Fuentes ingestadas a `raw/`:
  - `raw/unidad-2/Primer Parcialito - Compilado.docx` (15 preguntas con opciones del P1 + 100 del compilado — U2 Constitucion)
  - `raw/unidad-3/Segundo Parcialito - Compilado.docx` (23 preguntas + 32 del compilado — U3 Civil con aclaracion: 1C2026 sacaron obligaciones, agregaron Picasso)
  - `raw/unidad-4/Tercer Parcialito - Compilado.docx` (27 preguntas + 66 del compilado — U4 Comercial, mayoria V/F sobre Ley 11.867)
- Paginas creadas:
  - [[unidad-2/fuente-primer-parcialito-compilado]] — analisis del P1 con 15 preguntas reales + 100 del drilling, mapa de patrones, datos numericos a memorizar
  - [[unidad-3/fuente-segundo-parcialito-compilado]] — analisis del P2 con aclaracion 1C2026 (Picasso si, obligaciones no), modos de extincion como referencia, pregunta a desarrollar
  - [[unidad-4/fuente-tercer-parcialito-compilado]] — analisis del P3 con foco en Ley 11.867, trucos para V/F, historia del derecho comercial
  - [[analisis-formato-parcialitos]] ⭐ — analisis transversal del formato: estructura, tipos de pregunta (MC 60% / V/F 13% / completar 7% / numericas 7%), trampas, distractores, taxonomia de preguntas
  - [[mock-parcialito-4-suits]] ⭐⭐ — simulacro completo de 25 preguntas (14 MC + 7 V/F + 2 completar + 2 numericas) con hoja de respuestas, fundamentos por articulo, autoevaluacion y tips finales
- Actualizado `wiki/index.md`: nueva seccion "Material de Examen" estructurada por categoria

## [2026-04-28] ingest | Cuarto Parcialito Compilado + FORMA DE LOS CONTRATOS (Padilla) + research Suits S2E6
- Fuentes ingestadas a `raw/unidad-7/`:
  - `Cuarto Parcialito - Compilado.docx` (30 preguntas con opciones de parcialitos viejos)
  - `FORMA DE LOS CONTRATOS.pdf` (articulo de Rodrigo Padilla, Revista de Derecho Notarial y Registral 2022, version sin sufijo)
- Research web confirmado sobre **Suits T2 E6 "All In"** (USA Network, 26-jul-2012):
  - Trama A: Keith Hoyt (CEO empresa de energia limpia) firma cesion de su empresa en una **servilleta** tras 16 tragos en 11 horas (BAC 0,16%) contra Thomas Walsh
  - Trama B: locacion del salon de ballet con director Sergei Baskov malversando el fondo de reparacion
  - Resolucion: cesion → segundo juego de poker (Harvey con poder de Hoyt); ballet → renuncia del director + pago de la deuda
- Paginas creadas:
  - [[unidad-7/fuente-cuarto-parcialito-compilado]] — 30 preguntas con respuestas y articulos CCyC, mapa de patrones de pregunta
  - [[unidad-7/suits-s2e6-analisis-juridico]] — analisis juridico detallado: cesion en servilleta (260, 261, 332, 1015), locacion del ballet (1187, 1206-1223), mandato Hoyt-Harvey (1319-1320)
- Paginas actualizadas:
  - [[examen-parcialito-u7-suits]] — agregados datos factuales del episodio, top 5 articulos clave (260, 261, 957, 1015, 332), seccion 16 con 30 preguntas + respuestas tabla
  - [[contratos-elementos]] — agregada seccion 2.1 sobre acto voluntario (art. 260) y privacion accidental de la razon (art. 261); incorporada lesion (332)
  - [[contratos-forma-prueba]] — citas textuales de Padilla 2022 sobre funcion notarial, ventajas del formalismo, libertad de formas, retos modernos
  - `wiki/index.md` — agregadas paginas nuevas a la seccion Material de Examen
- Fuentes web consultadas:
  - https://suits.fandom.com/wiki/All_In
  - https://subslikescript.com/series/Suits-1632701/season-2/episode-6-All_In
  - https://www.tvfanatic.com/suits-season-2-episode-6-recap-all-in/
  - https://www.avclub.com/suits-all-in-1798173618

## [2026-04-28] examen | Guia parcialito U7 (analisis Suits S2E6 desde el CCyC)
- Creada [[examen-parcialito-u7-suits]] con 15 secciones: estrategia de analisis, definicion (art. 957), 5 elementos esenciales (CCOCF), formacion del consentimiento, vicios (error/dolo/violencia), objeto, causa, forma + funcion notarial (Padilla), prueba, adhesion, efectos, extincion, cuadro de nulidad, mini-template de respuesta, articulos imprescindibles, mini-checklist
- Actualizado `wiki/index.md` con nueva seccion "Material de Examen"
- Enfoque: aplicar el CCyC argentino a las situaciones contractuales de Suits T2 E6, sin atender al derecho estadounidense

## [2026-04-21] mantenimiento | Nuevas directrices + tracker de notas + reescritura de resumenes U1-U7
- `CLAUDE.md` actualizado con directrices obligatorias: ingest exhaustivo con citacion precisa `(fuente.pdf, p. N)` y `(art. X CCyC)`, complementacion con WebSearch/WebFetch, profundidad minima de paginas, estructura de 11 secciones para resumenes de unidad, mantenimiento del tracker de notas
- `wiki/index.md`: agregada seccion "Tracker de notas y ruta a final reducido" con estado actual (35,7/55 acumulado, meta 70/100) y 4 tablas de combinaciones (simetrica, asimetrica, conservadora replicando 18,7, estrategia recomendada)
- Resumenes de unidad reescritos con la nueva estructura de 11 secciones (descripcion / mapa conceptual / desarrollo / paginas / normativa / fuentes / casos / relacion otras unidades / checklist / libro / pendientes):
  - [[unidad-1-resumen]] (Introduccion al Derecho)
  - [[unidad-2-resumen]] (Organizacion del Estado)
  - [[unidad-3-resumen]] (Derecho Civil)
  - [[unidad-4-resumen]] (Derecho Comercial)
  - [[unidad-5-resumen]] (Propiedad Intelectual)
  - [[unidad-6-resumen]] (Sociedades) — ya rehecho previamente en sesion
  - [[unidad-7-resumen]] (Contratos) — ya rehecho previamente en sesion

## [2026-04-21] ingest | Unidad 7 — Contratos Civiles y Comerciales
- Fuentes procesadas: `CONTRATOS PARTE GENERAL (1).pdf`, `CONTRATOS EN PARTICULAR (1).pdf`, `FORMA DE LOS CONTRATOS (1).pdf`, Libro Cap 5 pts 1-4 y Cap 7 pt 2
- Paginas creadas (parte general): [[unidad-7-resumen]], [[contratos-elementos]], [[consentimiento-oferta-aceptacion]], [[contratos-clasificacion]], [[contratos-forma-prueba]], [[contratos-efectos]], [[contratos-extincion]]
- Paginas creadas (parte especial — contratos tipicos): [[compraventa]], [[permuta-suministro]], [[locacion]], [[leasing]], [[obra-y-servicios]], [[mandato-contrato]], [[agencia-concesion-distribucion]], [[franquicia]], [[donacion]], [[cesion-de-derechos]]
- Indice actualizado con las secciones "Conceptos — Unidad 7" (parte general y parte especial)
- Total: 17 paginas (1 resumen + 6 parte general + 10 contratos tipicos)

## [2026-04-21] ingest | Unidad 6 — Sociedades
- Fuentes procesadas: `SOCIEDADES (1).pdf`, `DOCTRINA SAS.pdf`, `LEY DE SOCIEDADES COMERCIALES.pdf`, `LEY DE APOYO AL CAPITAL EMPRENDEDOR.pdf`, `ESTATUTO MODELO DE SOCIEDAD ANONIMA SIN SINDICATURA.docx`, `estatuto-modelo-sas.pdf`, Libro Cap 7 pts 3-4
- Paginas creadas: [[unidad-6-resumen]], [[sociedades]], [[ley-general-sociedades]], [[tipos-societarios]], [[sociedad-responsabilidad-limitada]], [[sociedad-anonima]], [[sociedad-acciones-simplificada]], [[organos-sociales]], [[sociedades-seccion-iv]]
- Indice actualizado con la seccion "Conceptos — Unidad 6"
- Total: 9 paginas

## [2026-04-12] mantenimiento | Inicializacion del wiki
- Se creo la estructura del wiki: directorios `raw/`, `wiki/`, schema en `CLAUDE.md`
- Se creo `wiki/index.md` (indice maestro)
- Se creo `wiki/log.md` (este archivo)
- Wiki listo para recibir fuentes

## [2026-04-14] examen | Extraccion de preguntas del Megadoc 1er Parcial
- Se leyeron las 28 paginas del PDF `raw/assets/Megadoc Derecho 1er Parcial.pdf`
- Se extrajeron textualmente todas las preguntas agrupadas en 8 secciones
- Paginas creadas: [[preguntas-megadoc-primer-parcial]]
- Total: ~90 preguntas de examenes reales (2020) y listas de practica

## [2026-04-12] ingest | Unidad 1 — Introduccion al Derecho
- Fuentes procesadas: `UNIDAD I (DERECHO).pdf`, Libro Cap 1 pts 1-5
- Paginas creadas: [[unidad-1-resumen]], [[concepto-de-derecho]], [[norma-juridica]], [[fuentes-del-derecho]], [[interpretacion-del-derecho]], [[derecho-publico-y-privado]], [[derecho-natural-y-positivo]], [[common-law-vs-codificado]]
- Total: 8 paginas

## [2026-04-12] ingest | Unidad 2 — Organizacion del Estado
- Fuentes procesadas: `U2 CORREGIDO.pptx`, `UNIDAD II DERECHO CONSTITUCIONAL.docx`, Libro Cap 1 pt 6
- Paginas creadas: [[unidad-2-resumen]], [[constitucion-nacional]], [[derechos-y-garantias]], [[poder-ejecutivo]], [[poder-legislativo]], [[poder-judicial]], [[tratados-internacionales]], [[organizacion-federal]]
- Total: 8 paginas

## [2026-04-12] ingest | Unidad 3 — Derecho Civil
- Fuentes procesadas: `NOCIONES DE PERSONA u3.pptx`, `Obligaciones u3.pptx`, `RESPONSABILIDAD CIVIL.pptx`, `Picasso, Sebastián (1).pdf`, sentencias de danos y restriccion de capacidad, Libro Cap 3 completo
- Paginas creadas: [[unidad-3-resumen]], [[persona-fisica-y-juridica]], [[capacidad]], [[patrimonio]], [[obligaciones]], [[contratos-general]], [[mandato-y-poderes]], [[responsabilidad-civil]], [[caso-sentencia-danos]], [[caso-restriccion-capacidad]]
- Total: 10 paginas

## [2026-04-12] ingest | Unidad 4 — Derecho Comercial
- Fuentes procesadas: `derecho comercial 4.pptx`, `Concursos.pptx`, PDFs de fondo de comercio y transferencia, `youtube_links.txt`, Libro Cap 7 pts 1, 5, 6
- Paginas creadas: [[unidad-4-resumen]], [[derecho-comercial]], [[fondo-de-comercio]], [[titulos-de-credito]], [[seguros]], [[concursos-y-quiebras]], [[bolsas-y-mercados]]
- Total: 7 paginas

## [2026-04-12] ingest | Unidad 5 — Propiedad Intelectual
- Fuentes procesadas: `clase_itba_dpi.ppt`, `marcas.ppt`, `patentes.ppt`, `Caso BOCA JUNIORS MARCAS.docx`, `BOTOX CASO MARCA DILUCION MARCA NOTORIA.pdf`, `BUQUEBUS PUBLICIDAD.pdf`, Libro Cap 8 pt 1
- Paginas creadas: [[unidad-5-resumen]], [[patentes]], [[marcas]], [[disenos-industriales]], [[derechos-de-autor]], [[sistema-internacional-pi]], [[caso-botox-marca-notoria]], [[caso-boca-juniors-marcas]], [[caso-buquebus-publicidad]]
- Total: 9 paginas

## [2026-04-12] mantenimiento | Actualizacion de index.md
- Se actualizo el indice maestro con las 43 paginas creadas
- Se creo [[referencias-libro]] con el mapeo de unidades a capitulos del libro

## [2026-04-13] ingest | Megadoc Derecho 1er Parcial
- Fuente procesada: `Megadoc Derecho 1er Parcial.pdf` (raw/assets/)
- Compilacion de preguntas y respuestas de examenes anteriores (unidades 1-5)
- Patrones identificados: preguntas de multiple choice, V/F y desarrollo recurrentes
- Trampa clasica detectada: fondo de comercio NO incluye "derecho al local urbano"
- Paginas creadas: [[fuente-megadoc-primer-parcial]]
- Accion: creacion de pagina de resumen examen en Notion
