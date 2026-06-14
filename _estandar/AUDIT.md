# AUDIT.md — Auditoría de los Vaults de Estudio (ITBA)

> Documento generado por el Auditor Sintetizador. Idempotente: se sobreescribe en cada corrida.
> **Output en español rioplatense. Los vaults originales son SOLO LECTURA: nunca se modifican.**
> Fecha de auditoría: 2026-06-14

---

## 1. Resumen ejecutivo

Se auditaron **7 vaults Obsidian** ubicados todos dentro de `~/Desktop/ITBA/26-1C/`. Los 7 siguen el **patrón "LLM Wiki"** documentado en su propio `CLAUDE.md`:

- **`raw/`** = fuente de verdad inmutable, solo lectura → **AUXILIAR** (no se publica).
- **`wiki/`** = base de conocimiento generada por Claude → **PERMANENTE** (es lo que se empaqueta).
- **`wiki/index.md`** = catálogo de páginas; **`wiki/log.md`** = bitácora append-only con entradas `## [YYYY-MM-DD] <op> | <subject>`.

**Hallazgos clave verificados contra el filesystem:**

1. **3 de los 7 vaults están anidados un nivel** dentro de una carpeta contenedora junto a TPs y material crudo:
   - `PAW/PAW_Obsidian/` (la carpeta `PAW/` también contiene `paw-2026a-10/`, `Clases/`, `Imagenes/`).
   - `SDS/SDS_Obsidian/` (la carpeta `SDS/` también contiene `TP2_SDS/`..`TP5_SDS/`).
   - `Inge2/Inge2_Obsidian/`.
   Los otros 4 (`MNA_Obsidian`, `Derecho_Obsidian`, `Economia_Obsidian`, `Proba_Obsidian`) son la raíz del vault directamente bajo `26-1C/`.
2. **SDS es la desviación de estructura**: `index.md` y `log.md` viven en la **RAÍZ del vault** (`SDS_Obsidian/`), no dentro de `wiki/`. Los otros 6 los tienen en `wiki/`.
3. **Convenciones casi universales**: frontmatter YAML, `[[wikilinks]]`, kebab-case (a veces con prefijo numérico `01-`, `02-`), definiciones por **blockquote con etiqueta en negrita** (`> **Definición.**`). **Cero callouts `[!type]`, cero Dataview.**
4. **LaTeX** fuerte en MNA / Economía / Proba; ausente en Derecho e Inge2; en PAW las `$...$` son código inline (nombres de clase/anotaciones), no matemática.
5. **Auxiliar pesado a excluir**: virtualenv Python embebido (SDS `raw/` = 3.6 G con cientos de `.py/.pyc/.f90`), sitios estáticos build (`_build/`, `study/vendor/`, `study/*.js`), `node_modules`, `.git`, audio `.m4a`, `*.app`/`*.command`, `raw/`, `study/`, `estudio/`, `prompts/`, `__pycache__`, `.DS_Store`.
6. **Regla conservadora**: ante la duda, **PERMANENTE** (nunca se descarta contenido de conocimiento).

**Vaults en scope para empaquetar (7):** MNA, Derecho, Economía, Proba, PAW, SDS, Inge2 — en cada caso se publica el contenido de `wiki/` (más, para SDS, `index.md`/`log.md` de la raíz, y para Economía/PAW/Inge2 los assets referenciados).

---

## 2. Árbol de carpetas de `~/Desktop/ITBA/` (alto nivel)

```
~/Desktop/ITBA/
├── 23-1C/                         [CÓDIGO] semestre viejo, TPs/proyectos (no wiki)
├── 23-2C/                         [CÓDIGO] semestre viejo (POO, EDA, etc.)
├── 24-1C/                         [CÓDIGO] semestre viejo
├── 24-2C/                         [CÓDIGO] semestre viejo
├── 25-1C/                         [CÓDIGO] semestre viejo
├── 25-2C/                         [CÓDIGO] semestre viejo (BD1, SO, HCI, etc.)
├── 26-1C/                         <<< CONTIENE LOS 7 VAULTS OBSIDIAN
│   ├── MNA_Obsidian/              [VAULT] Métodos Numéricos Avanzados (raíz = vault)
│   ├── Derecho_Obsidian/          [VAULT] Derecho para Ingenieros (raíz = vault)
│   ├── Economia_Obsidian/         [VAULT] Economía (raíz = vault)
│   │   └── Economia_Obsidian.zip  [SUELTO] backup zip (19 MB) — ignorar
│   ├── Proba_Obsidian/            [VAULT] Probabilidad y Estadística (raíz = vault)
│   ├── PAW/                       [MIXTO]
│   │   ├── PAW_Obsidian/          [VAULT] Programación de Aplicaciones Web (ANIDADO)
│   │   ├── paw-2026a-10/          [CÓDIGO] proyecto Spring MVC del equipo
│   │   ├── Clases/  Imagenes/     [SUELTO] material crudo
│   ├── SDS/                       [MIXTO]
│   │   ├── SDS_Obsidian/          [VAULT] Simulación de Sistemas (ANIDADO; index/log en raíz)
│   │   ├── TP2_SDS/ .. TP5_SDS/   [CÓDIGO] trabajos prácticos
│   ├── Inge2/                     [MIXTO]
│   │   └── Inge2_Obsidian/        [VAULT] Ingeniería de Software II (ANIDADO)
│   └── studyPlaner/               [CÓDIGO] herramienta auxiliar
├── Electivas/  electivaspagina/   [CÓDIGO] electivas / página
├── StudyVaults/                   [VACÍO] destino del empaquetado (output)
├── _overseer_progress.md          [SUELTO] notas de la auditoría
├── Duolingo English Test*.pdf     [SUELTO] PDFs
├── bolo.pdf                       [SUELTO] PDF
├── Any year one-month calendar1.xlsx, Ficha de Notas.xlsx, Electivas.zip  [SUELTO]
└── .DS_Store                      [SUELTO] metadatos macOS
```

**Leyenda:** `[VAULT]` = wiki Obsidian en scope · `[CÓDIGO]` = proyecto/TP, fuera de scope · `[SUELTO]` = archivo suelto, fuera de scope · `[MIXTO]` = carpeta que contiene un vault anidado + otras cosas · `[VACÍO]` = destino.

> Los semestres viejos (23-2C..25-2C) son proyectos de código. Sus miles de `.md` son `node_modules`, NO wikis. **Fuera de scope.**

---

## 3. Vault por vault

### 3.1 MNA — Métodos Numéricos Avanzados
- **Ruta vault:** `~/Desktop/ITBA/26-1C/MNA_Obsidian/`
- **Materia / qué es:** Álgebra Lineal Computacional (descomposiciones LU/QR/SVD, autovalores, transformaciones lineales, series de Fourier).
- **Páginas wiki:** 98 · index ✓ · log ✓
- **Taxonomía de `wiki/`:** `teoria/` (4), `clases/` (9, cronológicas), `guias/` (9, enunciados TP I–IX), `resueltos/` (6), `pizarrones/` (10, transcripciones de fotos), `parciales/` (56+, modelos IP/IIP/Final + patrones). Más `00-mapa-temas.md`, `index.md`, `log.md` en raíz de `wiki/`.
- **Convenciones propias:** kebab-case con prefijo numérico (`01-numeros-complejos`, `guia-01-complejos`, `clase-2026-03-12`); LaTeX MUY fuerte (~12.6k bloques `$$`); frontmatter casi universal (96/98); wikilinks sin pipes.
- **Desviaciones:** `wiki/AUDIT_REPORT.md` queda como archivo hermano de `00-mapa-temas.md` en raíz de `wiki/` (no en `meta/`). Es contenido generado → permanente igual.
- **Una línea:** Base de conocimiento de Álgebra Lineal Computacional ingerida desde ~70 PDFs en 98 páginas con resoluciones numéricamente verificadas.

### 3.2 Derecho — Derecho para Ingenieros
- **Ruta vault:** `~/Desktop/ITBA/26-1C/Derecho_Obsidian/`
- **Materia / qué es:** Derecho Civil, Comercial, Constitucional, del Consumidor y Laboral para ingenieros.
- **Páginas wiki:** 166 · index ✓ · log ✓
- **Taxonomía de `wiki/`:** `unidad-1/`..`unidad-9/`, `parcialitos/`, `referencias/`, `1erParcial/`, `2doParcial/`, `TPE/` (caso Vitae), más `index.md`/`log.md`.
- **Convenciones propias:** kebab-case con prefijo numérico opcional; `fuente-*.md` y `unidad-{N}-resumen.md`; frontmatter `title/type/unidades/fuentes/fecha_creacion/ultima_actualizacion`; blockquotes `> **Definicion.** / > **Trampa:** / > **Flag:**`. **Sin LaTeX.**
- **Desviaciones:** 3 herramientas HTML autocontenidas en `wiki/2doParcial/` (`quiz-2do-parcial.html`, `estudio-interactivo.html`, `preguntas-repetidas-2do-parcial-print.html`) — violación menor de "solo `.md`" pero son tools con JSON embebido, **permanente**. Existe `wiki/2doParcial/_build/` (extracciones `.md` + `preguntas.json`) que es artefacto intermedio → **auxiliar**. PDFs de libro viven en `raw/assets/` (auxiliar) y se referencian solo por `fuentes:` en frontmatter, no embebidos.
- **Una línea:** Wiki de Derecho para Ingenieros (9 unidades, 166 páginas) con separación estricta `raw/` (PDFs fuente) y `wiki/` (markdown generado), foco en exámenes y TPE caso Vitae.

### 3.3 Economía — Economía para Ingenieros (61.23)
- **Ruta vault:** `~/Desktop/ITBA/26-1C/Economia_Obsidian/`
- **Materia / qué es:** Micro, Macro, Finanzas y Evaluación de Proyectos.
- **Páginas wiki:** 180 · index ✓ · log ✓
- **Taxonomía de `wiki/`:** `conceptos/` (~144), `ejercicios/` (8 guías), `examenes/`, `formulas/` (8), `unidades/` (8), `assets/` (`graficos/` con 42 SVG embebidos + `Resumen-Microeconomia.pdf`), más `index.md`/`log.md`/`overview.md`/`resumen-microeconomia.md`.
- **Convenciones propias:** kebab-case sin prefijo numérico; frontmatter heterogéneo según tipo de página (`tags` casi universal, `aliases`, `unit`, `parcial`, `source/sources`); LaTeX moderado (585 `$$`, ~2966 inline) concentrado en `formulas/` y `unidades/`; wikilinks con alias `|` frecuentes; SVG embebidos con `![[archivo.svg]]`.
- **Desviaciones:** `Estudio.app` + `Estudio.command` en raíz (launchers locales → **excluir**). `Resumen-Microeconomia.pdf` también aparece suelto en la raíz del vault y duplicado en `wiki/assets/`. Dentro de `wiki/assets/graficos/` hay 2 scripts generadores (`generar.py`, `generar_gp.py`) y un `__pycache__/` → **excluir** (no son contenido publicable, solo documentan el origen de los SVG). `study/` contiene `vendor/` + JS (sitio build) → **auxiliar**.
- **Una línea:** Wiki comprimido de Economía (Micro/Macro/Empresa) con 180 páginas y 42 gráficos SVG, patrón LLM Wiki.

### 3.4 Proba — Probabilidad y Estadística (93.24)
- **Ruta vault:** `~/Desktop/ITBA/26-1C/Proba_Obsidian/`
- **Materia / qué es:** Probabilidad y Estadística.
- **Páginas wiki:** 161 · index ✓ · log ✓
- **Taxonomía de `wiki/`:** `fuentes/`, `conceptos/`, `distribuciones/`, `teoremas/`, `tecnicas/`, `formularios/`, más `index.md`/`log.md`.
- **Convenciones propias:** kebab-case en español sin tildes ni ñ en nombres de archivo (títulos en frontmatter sí con tildes); frontmatter `titulo/tipo/unidad/tags/fuentes/actualizado` (`tipo` con 6 valores); LaTeX fuerte; blockquotes con etiqueta. **Sin imágenes embebidas** (`raw/assets/` vacía).
- **Desviaciones:** carpeta auxiliar se llama `estudio/` (no `study/`). Conforme al patrón estándar (index/log en `wiki/`).
- **Una línea:** Wiki de Probabilidad y Estadística con 161 páginas en 6 carpetas temáticas, LaTeX fuerte, sin imágenes embebidas.

### 3.5 PAW — Programación de Aplicaciones Web
- **Ruta vault:** `~/Desktop/ITBA/26-1C/PAW/PAW_Obsidian/` **(ANIDADO)**
- **Materia / qué es:** Spring MVC en Java.
- **Páginas wiki:** 47 · index ✓ · log ✓
- **Taxonomía de `wiki/`:** `entities/` (7, inventario de código), `concepts/` (17, patrones/arquitectura), `sources/` (13, destilado de docs), `analyses/` (6, roadmaps), más `index.md`/`log.md`.
- **Convenciones propias:** kebab-case sin prefijo; frontmatter 100% (`title/type/updated/created/tags/sources`); títulos en inglés con Title Case; nomenclatura en inglés. Las `$...$` son código inline (nombres de clase / anotaciones), **no** matemática.
- **Desviaciones:** vault anidado dentro de `PAW/` que también contiene el proyecto de código `paw-2026a-10/`. `wiki/sources/notion-teoricas-paw.md` referencia 71 screenshots vía `![alt](../../raw/assets/notion-paw-images/img-NNN.png)` → **las imágenes viven en `raw/` (auxiliar) pero las necesita la wiki**: para una copia que no rompa links hay que **copiar también `raw/assets/notion-paw-images/`**.
- **Una línea:** Wiki técnica de PAW (Spring MVC) con 47 páginas en 4 carpetas, destilada de 12 fuentes, seguidor estricto del patrón LLM Wiki.

### 3.6 SDS — Simulación de Sistemas
- **Ruta vault:** `~/Desktop/ITBA/26-1C/SDS/SDS_Obsidian/` **(ANIDADO)**
- **Materia / qué es:** física computacional, dinámica molecular, autómatas celulares, multi-agente.
- **Páginas wiki:** 40 · index ✓ · log ✓
- **Taxonomía de `wiki/`:** `conceptos/` (13), `metodos/` (11), `tps/` (4, TP2–TP5), `fuentes/` (10), `herramientas/` (2).
- **Convenciones propias:** kebab-case con `_` (`oscilador_amortiguado.md`, `cell_index_method.md`); TPs numerados (`TP2.md`...); frontmatter `tipo/tags/actualizado` 100%, más `fuentes/archivo/estado/nota`. LaTeX para ecuaciones, sin imágenes embebidas.
- **Desviaciones:** **ÚNICO vault con `index.md` y `log.md` en la RAÍZ** (`SDS_Obsidian/index.md`, `SDS_Obsidian/log.md`), NO en `wiki/`. No tiene `wiki/assets/`. `raw/` = **3.6 G** e incluye **virtualenv Python** (`raw/tps_pasados/TP2/.venv/` ~1.5 G), **historial git** (`raw/tps_pasados/TP3/.git/` ~500 M) y build artifacts → todo **auxiliar**.
- **Una línea:** Wiki de simulación numérica con 40 páginas (conceptos, métodos, TPs, fuentes) y documentación de TP2–TP5.

### 3.7 Inge2 — Ingeniería de Software II
- **Ruta vault:** `~/Desktop/ITBA/26-1C/Inge2/Inge2_Obsidian/` **(ANIDADO)**
- **Materia / qué es:** Arquitectura de software, diseño, atributos de calidad, patrones arquitectónicos.
- **Páginas wiki:** 92 · index ✓ · log ✓
- **Taxonomía de `wiki/`:** `classes/` (11), `concepts/` (56), `case-studies/` (5), `exercises/` (5), `sources/` (3), `analyses/`, más `index.md`/`log.md`.
- **Convenciones propias:** kebab-case con prefijo numérico opcional (`clase-00-introduccion-curso.md`); frontmatter `title/type/created/updated/tags/sources/related/aliases`; blockquotes con negrita. **Sin LaTeX** (salvo 3 páginas mínimas). **Sin Dataview.**
- **Desviaciones:** vault anidado dentro de `Inge2/`. En la raíz del vault hay audio `.m4a` + transcripciones `.txt` + un PDF mock → **auxiliar**. Las imágenes de pizarra (`Diagrama en blanco (N).png`) viven en `raw/classes/.../` (auxiliar); el único embed `![[...]]` aparece dentro de `wiki/log.md` describiendo la reorganización, no como contenido visual de página → **no requiere copiar assets**. `raw/TPE/AirflowDemo` tiene `.git`; `study/` tiene `node_modules` → auxiliar.
- **Una línea:** Wiki de Ingeniería de Software II (92 páginas) sobre arquitectura, diseño y atributos de calidad, patrón LLM Wiki con fuente inmutable en `raw/`.

---

## 4. Convenciones transversales (comunes a los 7 vaults)

| Convención | Detalle | Universalidad |
|---|---|---|
| **Frontmatter YAML** | Claves casi siempre presentes: `tags:`, `fuente:`/`fuentes:`/`sources:`; por materia `unidad:`/`unit:`, `tipo:`/`type:`, `actualizado:`/`updated:`. | ~95–100% de páginas en los 7 |
| **Wikilinks** | `[[pagina]]`, `[[carpeta/pagina]]`, y `[[pagina\|alias]]` (pipe usado en Economía/Derecho/Proba/SDS; casi nulo en MNA/PAW). | 7/7 |
| **Naming** | kebab-case; prefijo numérico `01-`,`02-` en MNA/Derecho/Inge2; sin prefijo en Economía/PAW; SDS usa `_`. Proba evita tildes/ñ en nombres de archivo. | 7/7 (kebab-case) |
| **LaTeX** | `$...$` / `$$...$$` fuerte en MNA, Economía, Proba; ausente en Derecho e Inge2; en PAW es código inline, no matemática. | 4/7 con LaTeX real |
| **Definiciones / blockquotes** | `> **Definición.**`, `> **Teorema.**`, `> **Cuidado:**`, etc. **CERO callouts `[!note]`/`[!warning]`. CERO Dataview.** | 7/7 |
| **index / log** | `index.md` = catálogo; `log.md` = bitácora append-only `## [YYYY-MM-DD] <op> | <subject>`. En `wiki/` para 6 vaults; **en la RAÍZ para SDS**. | 7/7 (ubicación varía) |

---

## 5. Tabla de reglas de clasificación

> **Regla maestra (conservadora): ante la duda → PERMANENTE.** Nunca se descarta contenido de conocimiento. Solo se excluye lo que es inequívocamente fuente cruda, build, dependencia, ejecutable o metadato.

| Patrón | Permanente / Auxiliar | Justificación (1 línea) |
|---|---|---|
| `wiki/` (carpeta entera) | **Permanente** | Base de conocimiento generada por Claude; es el producto publicable. |
| `wiki/index.md` | **Permanente** | Catálogo maestro de páginas. |
| `wiki/log.md` | **Permanente** | Bitácora append-only del trabajo del vault. |
| `index.md` / `log.md` en raíz (caso SDS) | **Permanente** | Mismo rol que en `wiki/`; SDS los ubica en raíz. |
| `README.md` | **Permanente** | Describe el vault; contenido útil, conservador. |
| `CLAUDE.md` | **Permanente** | Documenta el schema/convenciones del vault (no se descarta). |
| `raw/` | **Auxiliar** | Fuente de verdad inmutable solo-lectura; no se publica. |
| `study/` | **Auxiliar** | Sitio build / herramientas locales (incluye `vendor/`, JS). |
| `estudio/` (Proba) | **Auxiliar** | Variante de `study/`; material/herramientas de estudio crudas. |
| `prompts/` (PAW) | **Auxiliar** | Prompts de trabajo, no conocimiento publicable. |
| `node_modules/` | **Auxiliar** | Dependencias instaladas. |
| `.git/` | **Auxiliar** | Historial de control de versiones (puede pesar cientos de MB). |
| Virtualenv Python (`.venv/`, `venv/`) | **Auxiliar** | Entorno embebido (SDS ~1.5 G de `.py/.pyc/.f90`). |
| `*.pyc`, `*.pyi`, `__pycache__/` | **Auxiliar** | Bytecode/stubs Python; artefactos, no contenido. |
| Sitios build (`_build/`, `*.woff2`, `*.js`, `*.css` de build) | **Auxiliar** | Salida generada de un build estático, reproducible. |
| `*.app` / `*.command` (Economía) | **Auxiliar** | Ejecutables/launchers locales de macOS. |
| Audio `*.m4a` (Inge2) | **Auxiliar** | Grabaciones crudas de clase/exposición. |
| `*.DS_Store` | **Auxiliar** | Metadatos de Finder de macOS. |
| PDFs sueltos (Duolingo, `bolo.pdf`, etc. en `~/Desktop/ITBA/`) | **Auxiliar** | Archivos sueltos fuera de cualquier vault. |
| Semestres de código (`23-2C`..`25-2C`, `Electivas/`, `studyPlaner/`, `paw-2026a-10/`, `TP*_SDS/`) | **Auxiliar** | Proyectos/TPs de código, no wikis Obsidian. |
| HTML interactivo dentro de `wiki/` (Derecho `2doParcial/*.html`) | **Permanente** | Herramientas de estudio autocontenidas con datos embebidos; conservador. |
| `wiki/2doParcial/_build/` (Derecho) | **Auxiliar** | Artefacto intermedio de extracción (`.md` crudos + `preguntas.json`). |
| `wiki/assets/graficos/*.svg` (Economía) | **Permanente** | Gráficos embebidos en páginas vía `![[...]]`; rompen la wiki si faltan. |
| `wiki/assets/graficos/*.py` + `__pycache__/` (Economía) | **Auxiliar** | Scripts generadores y bytecode; documentan origen, no se publican. |
| `wiki/assets/*.pdf` (Economía `Resumen-Microeconomia.pdf`) | **Permanente** | Asset de referencia que vive dentro de `wiki/`. |
| `raw/assets/notion-paw-images/` (PAW) | **Permanente (excepción)** | Vive en `raw/` pero la wiki la referencia con rutas relativas; copiar para no romper links. |

---

## 6. Vaults en scope y casos dudosos resueltos

### Vaults a empaquetar (7)
| Vault | Ruta del vault | Qué se publica |
|---|---|---|
| MNA | `26-1C/MNA_Obsidian/` | `wiki/` |
| Derecho | `26-1C/Derecho_Obsidian/` | `wiki/` (incluye los `.html`, excluye `2doParcial/_build/`) |
| Economía | `26-1C/Economia_Obsidian/` | `wiki/` (incluye SVG y PDF de `assets/`, excluye scripts `.py`/`__pycache__`) |
| Proba | `26-1C/Proba_Obsidian/` | `wiki/` |
| PAW | `26-1C/PAW/PAW_Obsidian/` | `wiki/` **+ `raw/assets/notion-paw-images/`** (assets referenciados) |
| SDS | `26-1C/SDS/SDS_Obsidian/` | `wiki/` **+ `index.md` + `log.md` de la raíz** |
| Inge2 | `26-1C/Inge2/Inge2_Obsidian/` | `wiki/` |

### Casos dudosos resueltos
1. **HTML interactivos en Derecho `wiki/2doParcial/`** → PERMANENTE. Son tools de estudio autocontenidas con JSON embebido; viven dentro de `wiki/`. (Pero `_build/` que las alimenta → auxiliar.)
2. **SVG de Economía (`wiki/assets/graficos/`)** → PERMANENTE: están embebidos con `![[...]]` y la wiki se rompe sin ellos. Los `.py`/`__pycache__` dentro de esa misma carpeta → AUXILIAR.
3. **Imágenes Notion de PAW (`raw/assets/notion-paw-images/`)** → se COPIAN aunque estén en `raw/`, porque `wiki/sources/notion-teoricas-paw.md` las referencia con rutas relativas `../../raw/assets/notion-paw-images/`. Excepción explícita al "raw es auxiliar".
4. **Imágenes de pizarra de Inge2 (`raw/classes/.../*.png`)** → AUXILIAR: el único `![[...]]` está en `wiki/log.md` describiendo una reorganización, no en una página de contenido. No se copian.
5. **`index.md`/`log.md` de SDS en la raíz** → PERMANENTE: misma función que en `wiki/`; el packager debe levantarlos desde la raíz del vault.
6. **`CLAUDE.md` y `README.md`** → PERMANENTES (conservador): documentan schema/contexto; no son secretos ni build.
7. **`Estudio.app`/`Estudio.command` (Economía), `*.m4a` (Inge2), `study/`, `estudio/`, `prompts/`, `raw/`** → AUXILIAR siempre (salvo la excepción Notion de PAW).
8. **Vaults anidados (PAW/SDS/Inge2)** → el vaultKey apunta a la subcarpeta `*_Obsidian`; todo lo demás dentro de `PAW/`, `SDS/`, `Inge2/` (proyectos, TPs, imágenes sueltas) está FUERA de scope.
9. **`Economia_Obsidian.zip`, semestres viejos, archivos sueltos de `~/Desktop/ITBA/`** → FUERA de scope.

---

*Fin de AUDIT.md*
