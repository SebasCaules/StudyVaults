# AUDIT.md — Origen del estándar (auditoría de los vaults de estudio)

> Documento del Auditor Sintetizador. Resume cómo se llegó al estándar de este repo a partir de
> los vaults de estudio originales.
> **Output en español rioplatense. Los vaults originales son SOLO LECTURA: nunca se modifican.**

---

## 1. Resumen ejecutivo

El estándar de este repo se destiló auditando **7 vaults Obsidian de estudio** (uno por materia).
Los 7 siguen el **patrón "LLM Wiki"** documentado en su propio `CLAUDE.md`:

- **`raw/`** = fuente de verdad inmutable, solo lectura → **AUXILIAR** (no se publica).
- **`wiki/`** = base de conocimiento generada por Claude → **PERMANENTE** (es lo que se empaqueta).
- **`wiki/index.md`** = catálogo navegable de las páginas del vault, agrupado por secciones.

**Hallazgos clave que se volvieron reglas del estándar:**

1. **Convenciones casi universales**: frontmatter YAML, `[[wikilinks]]`, naming en kebab-case (a
   veces con prefijo numérico `01-`, `02-`), definiciones por **blockquote con etiqueta en negrita**
   (`> **Definición.**`). **Cero callouts `[!type]`, cero Dataview.**
2. **LaTeX** fuerte en las materias matemáticas (Métodos Numéricos, Economía, Probabilidad);
   ausente en las de texto (Derecho, Ingeniería de Software). En la materia de programación web las
   `$...$` son código inline (nombres de clase / anotaciones), no matemática.
3. **Auxiliar pesado a excluir**: virtualenvs Python embebidos, sitios estáticos build (`_build/`,
   `vendor/`), `node_modules`, `.git`, audio `.m4a`, ejecutables/launchers, `raw/`, `study/`,
   `prompts/`, `__pycache__`, `.DS_Store`.
4. **Regla conservadora**: ante la duda, **PERMANENTE** (nunca se descarta contenido de
   conocimiento).
5. **Desviación de ubicación conocida**: un vault (Simulación de Sistemas) ubica su `index.md` en la
   **raíz del vault** en vez de dentro de `wiki/`. Es una excepción histórica aceptada, no un modelo
   a replicar en vaults nuevos.

---

## 2. Convenciones transversales (comunes a los 7 vaults)

| Convención | Detalle | Universalidad |
|---|---|---|
| **Frontmatter YAML** | Claves casi siempre presentes: `tags:`, `fuente:`/`fuentes:`/`sources:`; por materia `unidad:`/`unit:`, `tipo:`/`type:`, `actualizado:`/`updated:`. | ~95–100% de páginas en los 7 |
| **Wikilinks** | `[[pagina]]`, `[[carpeta/pagina]]`, y `[[pagina\|alias]]` (pipe frecuente en las materias de texto/matemáticas; casi nulo en las técnicas). | 7/7 |
| **Naming** | kebab-case; prefijo numérico `01-`, `02-` donde el orden importa; algunas materias evitan tildes/ñ en nombres de archivo; un vault usa `_` en vez de `-`. | 7/7 (kebab-case) |
| **LaTeX** | `$...$` / `$$...$$` fuerte en las materias matemáticas; ausente en las de texto; en la de programación web es código inline, no matemática. | 4/7 con LaTeX real |
| **Definiciones / blockquotes** | `> **Definición.**`, `> **Teorema.**`, `> **Cuidado:**`, etc. **CERO callouts `[!note]`/`[!warning]`. CERO Dataview.** | 7/7 |
| **Índice** | `index.md` = catálogo navegable. En `wiki/` para 6 vaults; **en la raíz para uno** (desviación histórica). | 7/7 (ubicación varía) |

---

## 3. Tabla de reglas de clasificación

> **Regla maestra (conservadora): ante la duda → PERMANENTE.** Nunca se descarta contenido de
> conocimiento. Solo se excluye lo que es inequívocamente fuente cruda, build, dependencia,
> ejecutable o metadato.

| Patrón | Permanente / Auxiliar | Justificación (1 línea) |
|---|---|---|
| `wiki/` (carpeta entera) | **Permanente** | Base de conocimiento generada por Claude; es el producto publicable. |
| `wiki/index.md` | **Permanente** | Catálogo maestro de páginas. |
| `index.md` en raíz (desviación de un vault) | **Permanente** | Mismo rol que en `wiki/`; ese vault lo ubica en la raíz. |
| `README.md` | **Permanente** | Describe el vault; contenido útil, conservador. |
| `CLAUDE.md` | **Permanente** | Documenta el schema/convenciones del vault (no se descarta). |
| `raw/` | **Auxiliar** | Fuente de verdad inmutable solo-lectura; no se publica. |
| `study/` / `estudio/` | **Auxiliar** | Sitio build / herramientas locales (incluye `vendor/`, JS). |
| `prompts/` | **Auxiliar** | Prompts de trabajo, no conocimiento publicable. |
| `node_modules/` | **Auxiliar** | Dependencias instaladas. |
| `.git/` | **Auxiliar** | Historial de control de versiones (puede pesar cientos de MB). |
| Virtualenv Python (`.venv/`, `venv/`) | **Auxiliar** | Entorno embebido (puede pesar más de 1 G de `.py/.pyc/.f90`). |
| `*.pyc`, `*.pyi`, `__pycache__/` | **Auxiliar** | Bytecode/stubs Python; artefactos, no contenido. |
| Sitios build (`_build/`, `*.woff2`, `*.js`, `*.css` de build) | **Auxiliar** | Salida generada de un build estático, reproducible. |
| `*.app` / `*.command` | **Auxiliar** | Ejecutables/launchers locales de macOS. |
| Audio `*.m4a` | **Auxiliar** | Grabaciones crudas de clase/exposición. |
| `*.DS_Store` | **Auxiliar** | Metadatos de Finder de macOS. |
| PDFs sueltos fuera de cualquier vault | **Auxiliar** | Archivos sueltos sin relación con la wiki. |
| Proyectos/TPs de código (fuera de los vaults Obsidian) | **Auxiliar** | Código de cursada, no wikis Obsidian. |
| HTML interactivo dentro de `wiki/` | **Permanente** | Herramientas de estudio autocontenidas con datos embebidos; conservador. |
| Artefactos intermedios de extracción dentro de `wiki/` (`_build/`, `*.json` crudos) | **Auxiliar** | Insumos de un paso de extracción, no la página final. |
| Imágenes/SVG embebidos en páginas vía `![[...]]` | **Permanente** | La wiki se rompe visualmente si faltan. |
| Scripts generadores de assets + `__pycache__/` | **Auxiliar** | Documentan el origen de un asset; no se publican. |
| Assets de referencia que viven dentro de `wiki/` (`*.pdf`) | **Permanente** | Referenciados desde páginas del wiki. |
| Assets referenciados desde `wiki/` pero alojados en `raw/` | **Permanente (excepción)** | La wiki los referencia con rutas relativas; copiar para no romper links. |

---

## 4. Casos dudosos resueltos (criterios)

1. **HTML interactivos dentro de `wiki/`** → PERMANENTE. Son tools de estudio autocontenidas con
   JSON embebido y viven dentro de `wiki/`. (Los artefactos `_build/` que las alimentan → auxiliar.)
2. **SVG embebidos** → PERMANENTE: están referenciados con `![[...]]` y la wiki se rompe sin ellos.
   Los scripts `.py`/`__pycache__` que los generan → AUXILIAR.
3. **Assets alojados en `raw/` pero referenciados desde `wiki/`** → se COPIAN aunque estén en
   `raw/`, porque alguna página los referencia con rutas relativas. Excepción explícita al
   "raw es auxiliar".
4. **Imágenes crudas no referenciadas por ninguna página de contenido** → AUXILIAR. No se copian.
5. **`index.md` en la raíz (vault con desviación de ubicación)** → PERMANENTE: misma función que en
   `wiki/`; el packager debe levantarlo desde la raíz del vault.
6. **`CLAUDE.md` y `README.md`** → PERMANENTES (conservador): documentan schema/contexto; no son
   secretos ni build.
7. **Launchers (`*.app`/`*.command`), audio (`*.m4a`), `study/`, `estudio/`, `prompts/`, `raw/`** →
   AUXILIAR siempre (salvo la excepción de assets referenciados desde `wiki/`).
8. **Material fuera de los vaults Obsidian** (proyectos de código, TPs, archivos sueltos) → FUERA de
   scope.

---

*Fin de AUDIT.md*
