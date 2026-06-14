# Log — Wiki 93.24 Probabilidad y Estadística

Registro cronológico append-only. Cada entrada empieza con:
`## [YYYY-MM-DD] <ingest|query|lint|setup> | <título>`

## [2026-05-30] setup | Inicialización del wiki
- Creada estructura de carpetas: `raw/` (+ `raw/assets/`) y `wiki/` con
  subcarpetas `fuentes/`, `conceptos/`, `distribuciones/`, `teoremas/`,
  `tecnicas/`, `formularios/`.
- Creado el schema `CLAUDE.md` (convenciones + flujos de ingesta/consulta/lint).
- Creados `index.md` y `log.md`.
- Próximo paso: descargar el material del campus ITBA y empezar a ingerir.

## [2026-05-30] descarga | Material del campus (Blackboard Ultra)
- Conectado a Chrome vía MCP al curso `_32899_1` (Comisión B, "20252Q").
- Mapeado el curso vía API interna de Blackboard: 358 nodos; 166 archivos,
  105 links externos, 10 foros, 9 tests, 4 documentos Ultra.
- **Descargados 96 documentos (≈114 MB)** a `raw/<unidad>/`, organizados por
  las 12 unidades del programa. Incluye teóricas (PDF/pptx), guías tp1–tp9 y
  19 evaluaciones (parciales, recuperatorios, finales y resoluciones).
- Método: navegación a URLs `bbcswebdav` (descarga directa con Chrome puesto en
  "Descargar PDFs") + reubicación con `raw/.dl_move.py`. `fetch`/blob bloqueado
  por CORS (CDN); iframes no disparan descarga.
- **No descargado:**
  - 68 imágenes = TODAS memes (carpetas "Memes de…"), sin valor de estudio → omitidas.
  - `ruido.wav` (audio, se abre inline) — pendiente manual.
  - `01 - Estadística Descriptiva - Introducción.txt` — dataset numérico (~200
    mediciones), se abre inline; capturado parcialmente, pendiente bajar entero.
- Próximo paso: ingerir el material al wiki (resúmenes de fuentes + páginas de
  conceptos/distribuciones/teoremas).

## [2026-05-30] ingest | Unidad 1 — Estadística Descriptiva (piloto)
- Fuentes leídas: `02 - Estadística Descriptiva - General.pdf` (44 págs) y
  `tp1_2024.pdf` (13 págs). (Falta el pptx de introducción.)
- Creadas 2 páginas de fuente: [[estadistica-descriptiva-general]],
  [[tp1-estadistica-descriptiva]].
- Creadas 8 páginas de concepto: [[estadistica-descriptiva]] (hub),
  [[poblacion-y-muestra]], [[medidas-de-tendencia-central]],
  [[medidas-de-dispersion]], [[cuartiles-y-percentiles]], [[asimetria-y-curtosis]],
  [[histograma-y-frecuencias]], [[boxplot]], [[datos-agrupados]].
- Creada 1 página de técnica: [[tecnica-datos-agrupados-interpolacion]].
- Actualizado `index.md`.
- Flag pendiente: la teórica define el signo de la curtosis ($\kappa<0$ ⇒ colas
  "más pesadas") al revés de la convención usual → anotado en
  [[asimetria-y-curtosis]] para verificar con la cátedra.
- Links forward sin página todavía: [[variable-aleatoria]], [[distribucion-normal]],
  [[inferencia-estadistica]].
- Piloto para calibrar estilo con Sebastián antes de seguir con las demás unidades.

## [2026-05-30] feedback | Calibración de estilo
- Sebastián pidió: **agregar ejercicios resueltos paso a paso (estilo parcial)** a
  cada página de concepto/técnica/distribución. Convención codificada en `CLAUDE.md`.
- Decisión: continuar la ingesta por la **Unidad 2 (Introducción a la Probabilidad)**.

## [2026-05-30] ingest | Unidad 2 — Introducción a la Probabilidad
- Fuentes leídas: `01 - Axiomas.pdf` (17), `01 - Independencia-Condicional-Bayes.pdf`
  (12), `01 - Regla de Laplace.pptx` (20 diapos, extraído con python-pptx).
  **Pendiente**: `tp2_2024.pdf` (53 págs) — lectura detallada para más ejercicios.
- Creadas 3 páginas de fuente: [[axiomas-probabilidad]], [[regla-de-laplace]],
  [[independencia-condicional-bayes]].
- Creadas 7 páginas de concepto: [[probabilidad]] (hub),
  [[espacio-muestral-y-eventos]], [[axiomas-de-probabilidad]], [[regla-de-laplace]],
  [[probabilidad-condicional]], [[independencia]], [[probabilidad-total-y-bayes]].
- Creada 1 técnica: [[tecnica-conteo-combinatoria]].
- **Ejercicios resueltos** incluidos (nueva convención): suma=8 (Laplace), 4-o-11
  (unión m.e.), dados suma≥8 (condicional), dos tiradores (independencia),
  daltónicos (Bayes), póker y cumpleaños (combinatoria).
- Actualizado `index.md`. Nuevos forward-links: [[suma-de-variables-aleatorias]],
  [[De Morgan]].

## [2026-05-30] ingest | Ingesta masiva (workflow) — unidades 3 a 9 + Complementos + Evaluaciones
- Ingesta en **paralelo** de 9 lotes de fuentes. **123 páginas nuevas** creadas
  (total del wiki ahora: 71 fuentes, 47 conceptos, 10 distribuciones, 3 teoremas,
  11 técnicas, 4 formularios).
- **Páginas creadas por lote:**
  - **U3 Variables Aleatorias Discretas (21):** 5 conceptos fundacionales
    ([[variable-aleatoria]], [[esperanza]], [[varianza]],
    [[funcion-de-distribucion-acumulada]], [[funcion-generadora-de-momentos]]),
    6 distribuciones (Bernoulli, Binomial, Geométrica, Binomial Negativa,
    Hipergeométrica, Poisson), 1 técnica ([[reconocer-distribucion-discreta]]),
    9 fuentes (slides intro + 7 apuntes manuscritos + tp3).
  - **U4 Variables Aleatorias Continuas (12):** 2 conceptos
    ([[variable-aleatoria-continua]], [[funcion-de-densidad]]), 3 distribuciones
    (uniforme continua, exponencial, normal), 1 técnica
    ([[estandarizacion-y-tabla-normal]]), 1 formulario, 5 fuentes.
  - **U5 Función de V.A. y Bidimensionales (15):** 5 conceptos
    ([[funcion-de-variable-aleatoria]], [[variables-aleatorias-bidimensionales]],
    [[covarianza-y-correlacion]], [[independencia-de-variables-aleatorias]],
    [[mezcla-de-distribuciones]]), 1 técnica, 9 fuentes.
  - **U6 Procesos Estocásticos (12):** 6 conceptos ([[procesos-estocasticos]] hub,
    proceso de Bernoulli/Poisson, relación Bernoulli-Poisson, cadenas de Markov,
    caminata aleatoria), 6 fuentes.
  - **U7 Suma de V.A. (22):** 4 conceptos ([[suma-de-variables-aleatorias]] hub,
    suma de independientes, aprox. normal de la binomial, promedio muestral),
    3 teoremas ([[teorema-central-del-limite]], [[ley-de-grandes-numeros]],
    [[desigualdad-de-chebyshev]]), 1 formulario, 14 fuentes.
  - **U8 Inferencia Estadística (17):** 4 conceptos ([[inferencia-estadistica]] hub,
    estimación puntual, intervalos de confianza, varianza muestral), 1 distribución
    ([[distribucion-t-de-student]]), 1 formulario, 11 fuentes.
  - **U9 Pruebas de Hipótesis (15):** 6 conceptos ([[prueba-de-hipotesis]] hub +
    error I/II, valor p, estadístico de prueba, prueba para media y proporción),
    1 técnica, 1 formulario, 7 fuentes.
  - **Complementos Matemáticos (6):** 3 técnicas (integrales impropias, integrales
    dobles, derivadas parciales) + 3 fuentes. unidad: 0 (sin número).
  - **Evaluaciones (3):** 1 fuente ([[evaluaciones]], catálogo de 19 archivos) +
    2 técnicas con 15 ejercicios de parcial resueltos (probabilidad y estadística).
- **Forward-links pendientes** (válidos, sin página todavía): [[distribucion-erlang]]
  (tiempo al k-ésimo evento Poisson), [[distribucion-gamma]], [[distribucion-ji-cuadrado]]
  (referida desde U8), [[distribucion-weibull]], [[aproximacion-poisson-binomial]],
  [[covarianza]] (existe [[covarianza-y-correlacion]]), [[convolucion]].
- **Discrepancias / notas relevantes a verificar:**
  - **Convención de la cátedra (U3):** la Geométrica y la Binomial Negativa cuentan
    NÚMERO DE FRACASOS (no de ensayos) → soporte $\mathbb{N}_0$, $E=q/p$ (geom.),
    $E=rq/p$ (bin. neg.). Marcado con bloques ⚠️ en sus páginas y en
    [[reconocer-distribucion-discreta]] para evitar confusión con muchos libros.
  - **t de Student (U8):** la teórica manuscrita tabula E/V de la t usando $n$ donde
    los grados de libertad reales son $n-1$; aclarado en [[distribucion-t-de-student]]
    contra la convención estándar $V(T)=\nu/(\nu-2)$, $\nu=n-1$.
  - **Integrales dobles (Compl.):** el apunte omite el factor $1/2$ al calcular la
    masa (masa=1/12 y baricentro 1/5 en vez de 1/24 y 2/5); ⚠️ en
    [[tecnica-integrales-dobles]], a confirmar con el docente.
  - **Mezclas (U5):** la varianza NO se promedia linealmente (Var(T)=1131≠1110 en el
    ejemplo); única excepción a "incorrelación≠independencia" es el caso normal conjunto.
  - **Notación N(μ,σ):** el segundo parámetro es el DESVÍO (no la varianza) en toda
    la cátedra; consistente en U7.
- **Verificación de salud del consolidador:**
  - Sin nombres de archivo duplicados dentro de cada carpeta. `regla-de-laplace.md`
    existe en `fuentes/` y en `conceptos/` (capas distintas, intencional).
  - Sin huérfanas evidentes: todos los hubs/conceptos quedan enlazados desde el index
    y entre sí; [[inferencia-estadistica]] cierra el lazo con [[poblacion-y-muestra]].
  - **Enlaces rotos detectados (slug ≠ nombre real de archivo)** — corregir en próximo
    lint:
    - `[[ley-de-grandes-numeros]]` en `conceptos/inferencia-estadistica.md` →
      debería ser `[[ley-de-grandes-numeros]]`.
    - `[[distribucion-t-de-student]]` y `[[estimacion-puntual]]` en
      `tecnicas/ejercicios-de-parcial-resueltos-estadistica.md` → reales:
      `[[distribucion-t-de-student]]` y `[[estimacion-puntual]]`.
    - `[[intervalos-de-confianza]]` en `conceptos/prueba-de-hipotesis.md` y
      `conceptos/prueba-de-hipotesis-para-la-media.md` → real:
      `[[intervalos-de-confianza]]`.
    - `[[prueba-de-hipotesis]]`, `[[funcion-de-variable-aleatoria]]`,
      `[[cadenas-de-markov]]`, `[[variables-aleatorias-bidimensionales]]` en
      `tecnicas/ejercicios-de-parcial-resueltos*.md` y `fuentes/evaluaciones.md` →
      reales: `[[prueba-de-hipotesis]]`, `[[funcion-de-variable-aleatoria]]`,
      `[[cadenas-de-markov]]`, `[[variables-aleatorias-bidimensionales]]`.
  - Sugerencias para futuras fuentes/lint: crear [[distribucion-erlang]],
    [[distribucion-gamma]], [[distribucion-ji-cuadrado]] y una página de aproximación
    Poisson de la Binomial; revisar/aclarar la convención de curtosis (flag de U1).

## [2026-05-30] lint | Correcciones post-ingesta masiva
- **8 enlaces rotos corregidos** (slugs que algunos agentes escribieron distinto del
  nombre real del archivo): `ley-de-los-grandes-numeros`→`ley-de-grandes-numeros`,
  `distribucion-t-student`→`distribucion-t-de-student`,
  `estimador-de-maxima-verosimilitud`→`estimacion-puntual`,
  `intervalo-de-confianza`→`intervalos-de-confianza`,
  `test-de-hipotesis`→`prueba-de-hipotesis`,
  `transformacion-de-variable-aleatoria`→`funcion-de-variable-aleatoria`,
  `cadena-de-markov`→`cadenas-de-markov`,
  `distribucion-conjunta`→`variables-aleatorias-bidimensionales`.
- **Ambigüedad resuelta**: había `fuentes/regla-de-laplace.md` y
  `conceptos/regla-de-laplace.md` (mismo basename → wikilink ambiguo en Obsidian).
  La fuente se renombró a `fuentes/regla-de-laplace-slides.md` y se actualizaron las
  referencias-fuente (frontmatter de [[regla-de-laplace]], [[probabilidad]],
  [[tecnica-conteo-combinatoria]] y la entrada del índice). Los `[[regla-de-laplace]]`
  conceptuales ahora resuelven sin ambigüedad al concepto.
- Verificado: **0 basenames duplicados, 0 slugs rotos** de la lista anterior.
- Quedan como forward-links válidos (sin página aún, para futuras fuentes):
  [[distribucion-erlang]], [[distribucion-gamma]], [[distribucion-ji-cuadrado]],
  [[distribucion-weibull]], [[aproximacion-poisson-binomial]], [[De Morgan]].

## [2026-05-30] lint | Revisión multi-agente (overseers)
- **30 reportes de overseers** (10 unidades × 3 lentes: fidelidad matemática,
  cobertura/vacíos, estructura/enlaces/convenciones).
- **78 hallazgos consolidados** (deduplicados): **7 alta, 30 media, 41 baja**.
- Hallazgos altos: TP2 sin ingerir (U2); ji-cuadrado sin página (U8);
  datos de resumen incorrectos en [[tp7-suma-de-va]] (U7); falta técnica de
  diseño de prueba / tamaño muestral (U9); slug roto `[[distribucion-uniforme]]`
  (→ distribucion-uniforme-continua, 6 ubicaciones); pptx introductorio de U1
  sin página de fuente; árbol de probabilidades sin tratamiento propio (U2).
- Reclasificados de "roto" a forward-link pendiente válido: [[distribucion-erlang]],
  [[distribucion-gamma]], [[distribucion-ji-cuadrado]], [[distribucion-weibull]],
  [[De Morgan]], [[minimo-de-exponenciales]]. El caso `[[aproximacion-poisson-binomial]]`
  SÍ es enlace mal dirigido (el contenido ya existe en [[distribucion-poisson]]).
- Informe completo: `revision-wiki-2026-05-30.md` (archivo eliminado el 2026-06-06
  una vez aplicados los arreglos; ver entrada del 2026-06-06). No se modificó ninguna
  otra página en la revisión; los arreglos los decidió el usuario.

## [2026-05-30] lint | Aplicación de la revisión (workflow)
- Se aplicaron los arreglos derivados de la revisión multi-agente del 2026-05-30
  (78 hallazgos: 7 alta, 30 media, 41 baja), distribuidos por agentes de arreglo
  por unidad más este consolidador final.
- **14 páginas nuevas** creadas en esta corrida:
  - U1: [[estadistica-descriptiva-introduccion]] (fuente, pptx de 26 slides).
  - U2: [[tp2-calculo-de-probabilidades]] (fuente), [[arbol-de-probabilidades]],
    [[leyes-de-de-morgan]] (resuelve el forward-link `[[De Morgan]]`).
  - U3: [[teoria-de-la-decision-valor-esperado]] (técnica).
  - U4: [[distribucion-weibull]], [[tasa-de-fallas]], [[minimo-de-exponenciales]].
  - U5: [[esperanza-condicional]].
  - U7: [[distribucion-gamma]], [[distribucion-erlang]].
  - U8: [[distribucion-ji-cuadrado]].
  - U9: [[diseno-de-prueba-tamano-muestral]] (técnica).
- **7 hallazgos altos resueltos:** TP2 ingerido (U2); ji-cuadrado con página (U8);
  datos de resumen corregidos en [[tp7-suma-de-va]] (fix de doble numeración; notas
  de discrepancia 3333/3334, 3523/3524, 13529/13530); técnica de diseño de prueba /
  tamaño muestral creada (U9); slug roto `[[distribucion-uniforme]]` uniformado a
  [[distribucion-uniforme-continua]] (6 ubicaciones); pptx introductorio de U1 con
  página de fuente; árbol de probabilidades con página propia (U2).
- **Cross-links de retorno aplicados por el consolidador** (enlaces entre unidades
  que los agentes de unidad no tocaron):
  - Origen combinatorio (TP2 ej. 4) reflejado en [[distribucion-binomial]] y
    [[distribucion-hipergeometrica]], con retorno a [[tecnica-conteo-combinatoria]].
  - [[distribucion-exponencial]]: Gamma/Erlang ahora como wikilink real (caso n=1) +
    mención a [[tecnica-integrales-impropias]].
  - [[distribucion-normal]]: retorno a [[distribucion-ji-cuadrado]], a las pruebas
    ([[prueba-de-hipotesis-para-la-media]] / [[prueba-de-hipotesis]]) y a
    [[tecnica-integrales-impropias]].
  - [[distribucion-hipergeometrica]] → [[intervalos-de-confianza]] (corrección por
    población finita, TP8 ej. 24).
  - [[datos-agrupados]] → [[intervalos-de-confianza]] (IC con datos agrupados, TP8 ej. 13).
  - [[varianza-muestral]] → [[prueba-de-hipotesis-para-la-media]] (ej. 20, IC de la varianza).
  - [[inferencia-estadistica]] → [[prueba-de-hipotesis]] + dualidad IC/prueba +
    [[formulario-pruebas-de-hipotesis]].
  - [[distribucion-t-de-student]] → [[prueba-de-hipotesis-para-la-media]] y
    [[diseno-de-prueba-tamano-muestral]].
  - Complementos Matemáticos: [[funcion-de-densidad]],
    [[funcion-de-distribucion-acumulada]] y [[variables-aleatorias-bidimensionales]]
    ahora enlazan de retorno a [[tecnica-integrales-impropias]],
    [[tecnica-integrales-dobles]] y/o [[tecnica-derivadas-parciales]];
    [[formulario-va-continuas]] menciona la técnica de integrales impropias.
- **Index actualizado**: las 14 páginas nuevas catalogadas en su categoría/unidad.
  Lista de pendientes vaciada — los forward-links [[distribucion-erlang]],
  [[distribucion-gamma]], [[distribucion-ji-cuadrado]], [[distribucion-weibull]],
  [[minimo-de-exponenciales]] y [[De Morgan]] ya tienen página propia.
- **CLAUDE.md**: documentada la convención del campo `unidad` (1-9 unidades del
  programa, `0` Complementos Matemáticos, `eval` Evaluaciones).
- **Verificación final**: 0 basenames duplicados; 0 slugs rotos conocidos
  (`distribucion-uniforme` pelado, `covarianza` pelado, etc.); todas las páginas de
  severidad alta existen.

## [2026-06-06] build | App de estudio HTML + borrado de la revisión
- **Eliminado** `wiki/revision-wiki-2026-05-30.md` a pedido del usuario (sus hallazgos
  ya fueron aplicados; ver entradas del 2026-05-30). Actualizada la referencia colgante
  en este log.
- **Creada** `estudio/` — aplicación web autónoma de estudio (un solo `index.html` que
  se abre con doble clic, sin servidor ni internet). Cubre end-to-end las 9 unidades +
  Complementos + Evaluaciones. Features: lector con KaTeX y wikilinks navegables,
  backlinks, TOC, búsqueda global (Cmd+K), modo claro/oscuro, flashcards con repetición
  espaciada, quizzes, mazo de ejercicios resueltos con solución revelable, explorador
  interactivo de distribuciones (PMF/PDF en vivo), calculadora de la tabla normal Φ y
  fractiles, asistente "¿qué distribución/prueba uso?", grafo de conexiones, panel de
  progreso, favoritos y notas personales. Todo el contenido se genera desde `wiki/`
  con `estudio/build.py` (regenerable). KaTeX y marked vendorizados en `estudio/vendor/`.

## [2026-06-06] lint | Auditoría multi-agente de la app + pulido sin emojis
- **Auditoría de 8 agentes paralelos** (estética, tipografía, accesibilidad, lector,
  matemática, features, plataforma, copy) sobre `estudio/`. Matemática: 0 hallazgos
  (las 14 distribuciones pasaron verificación numérica). Total 36 hallazgos aplicados.
- **App**: eliminados todos los emojis (diseño sobrio); foco de teclado visible (WCAG
  2.4.7); contraste AA en tema claro (--text-3, callouts good/warn); wikilinks de ancla
  `[[#Heading]]` ahora navegables; TOC sin contaminación de KaTeX; fuga de listeners del
  grafo y del scroll-spy corregidas; tipografía H1 unificada; tabular-nums; tokens de
  radio/ sombra de control; persistencia de tema arreglada; extractor de ejercicios
  restringido (98 reales, 0 prosa, 96 con solución revelable); quiz ahora con E[X] y V(X).
- **Wiki (contenido)**: se agregó el marcador `**Resolución.**` a 3 ejercicios de bloque
  único para separar enunciado/solución en la app sin spoilear: [[axiomas-de-probabilidad]]
  (dados 4 o 11), [[leyes-de-de-morgan]] (grupo sanguíneo 0⁻), [[tecnica-conteo-combinatoria]]
  (cumpleaños). Regenerado `estudio/data.js`.

## [2026-06-06] build | Rework de diseño de la app (paleta + grafo)
- **Nueva dirección estética "almanaque científico"**: papel cálido + tinta (fuera el
  índigo/violeta genérico). Acento bermellón con enlaces y datos en verde-petróleo.
  Fuentes distintivas vendorizadas offline: Fraunces (display), Spectral (cuerpo serif,
  se funde con la matemática), Hanken Grotesk (UI) y JetBrains Mono (números/labels).
  Textura de grano, dots de unidad en diamante, tema claro/oscuro recalibrado.
- **Botones visibles**: los "ghost" ahora tienen fondo + borde; el tab activo del
  explorador es bermellón (arreglado el conflicto de especificidad ghost/primary).
- **Grafo reworkeado**: físicas con colisión y enfriamiento, distribución redondeada
  (no más amontonado), pan + zoom-al-cursor + drag, botones de zoom/encajar, fit-to-view,
  render on-demand (se congela al asentarse), labels legibles. Arreglado el bug de
  clic-para-navegar (se distingue clic de arrastre por distancia). Verificado en navegador.
- `estudio/vendor/fonts/` agregado (11 woff2). Sin cambios de contenido del wiki.

## [2026-06-06] lint+build | Apuntes mejorados (agentes) + features de notas + contraste
- **Mejora de contenido con 11 agentes paralelos** (uno por unidad, archivos disjuntos):
  **83 páginas** de conceptos/distribuciones/teoremas/técnicas mejoradas con una línea
  de síntesis `**En breve.**` (83 páginas), recuadros `**Intuición.**` en lenguaje llano
  (76 páginas) y enlaces cruzados reforzados — SIN tocar matemática, números ni los
  bloques de discrepancia. Varios agentes además arreglaron bugs reales de KaTeX
  (wikilinks anidados en `\text{}`/`\boxed{}`, U3 y U6). `actualizado: 2026-06-06`.
- **Fix de render (app)**: `renderMarkdown` ahora protege los dólares escapados `\$`
  (montos como `\$4`, `\$0,40`) para que no abran fórmulas espurias; se restauran como
  `$` literal en prosa y como `\$` dentro de la matemática. Verificado: **0 errores de
  KaTeX en las 161 páginas**. También se corrigieron 2 fórmulas inline que abarcaban dos
  líneas (geométrica y medidas-de-tendencia-central) pasándolas a display/una línea.
- **Ecuaciones con más contraste**: las display del lector se muestran como bloques
  destacados (fondo + borde de acento), matemática a tinta plena.
- **Apuntes personales (app)**: notas por página con vista previa markdown+KaTeX,
  contador y fecha; nueva sección **Mis apuntes** con borrador general, búsqueda,
  exportar a `.md`, copiar todo y exportar nota individual.
- Regenerado `estudio/data.js` (≈870 KB).
