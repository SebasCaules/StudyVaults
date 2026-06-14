# CLAUDE.md — Proba (93.24 Probabilidad y Estadística, ITBA)

Esta es la **copia publicable** del vault de **93.24 – Probabilidad y Estadística**
del ITBA. Es una base de conocimiento de solo lectura: páginas markdown
interconectadas (teoría, distribuciones, teoremas, técnicas y ejercicios
resueltos) extraídas y mantenidas a partir del material de la cátedra.

> Esta copia **no** contiene el material crudo. La carpeta `raw/` del vault
> original (PDFs, slides, apuntes manuscritos, parciales) **no se incluye** acá:
> es una publicación limpia derivada de esa base. Las referencias del tipo
> `raw/...` o `**Fuente:** archivo.pdf` que aparecen en las páginas son citas
> documentales al origen, no enlaces a archivos presentes en esta copia.

## Qué materia es

93.24 – Probabilidad y Estadística (ITBA). El wiki cubre el programa completo:
estadística descriptiva, fundamentos de probabilidad, variables aleatorias
discretas y continuas, distribuciones especiales, procesos estocásticos
(Bernoulli y Poisson), suma de variables aleatorias, inferencia estadística
(estimación puntual, intervalos de confianza) y pruebas de hipótesis, más
complementos matemáticos (integrales dobles, derivadas parciales).

## Estructura del vault publicado

Todo el contenido vive bajo `wiki/`:

| Carpeta | Qué contiene |
|---|---|
| `wiki/index.md` | Catálogo de todas las páginas, organizado por unidad y por categoría. **Empezá por acá.** |
| `wiki/log.md` | Bitácora cronológica append-only de las operaciones sobre el wiki. |
| `wiki/fuentes/` | Una página-resumen por cada fuente del material de cátedra (teóricas, guías TP, parciales, capítulos). |
| `wiki/conceptos/` | Conceptos: variable aleatoria, esperanza, varianza, independencia, FDA, etc. |
| `wiki/distribuciones/` | Una página por distribución (Bernoulli, Binomial, Poisson, Normal, Exponencial, …). |
| `wiki/teoremas/` | Teoremas y resultados (TCL, ley de grandes números, Bayes, Chebyshev, …). |
| `wiki/tecnicas/` | Técnicas y patrones de resolución, incluidos los compendios de ejercicios de parcial resueltos. |
| `wiki/formularios/` | Formularios y hojas de fórmulas / cheat-sheets por unidad o para el parcial. |

## Convenciones

- El formato de cada página sigue el estándar canónico de StudyVaults:
  ver **`../_estandar/DESIGN.md`** (anatomía de página, frontmatter, headings,
  bloques de definición/teorema, LaTeX, naming, navegación).
- Idioma: **español**, registro técnico y conciso. Términos en inglés entre
  paréntesis la primera vez si ayuda (p. ej. "función de masa (PMF)").
- Matemática en LaTeX de Obsidian: `$...$` inline, `$$...$$` display.
- Enlaces internos con wikilinks `[[nombre-archivo|Texto visible]]`; nombres de
  archivo en kebab-case, sin tildes ni ñ (el título del H1 sí lleva tildes).
- Navegación: cada página puede cerrar con `## Ver también`; el catálogo central
  es `wiki/index.md`, que apunta de vuelta al home del repo (**`../HOME.md`**).

## Cómo pedirle cosas a Claude sobre este vault

- **Ingesta: no aplica.** Esta es una copia publicable read-only; no se procesa
  material crudo nuevo acá (no hay `raw/`). La ingesta se hace en el vault
  original de trabajo, no en esta publicación.
- **Consulta.** Para responder preguntas: leer `wiki/index.md` para ubicar las
  páginas relevantes, leerlas y sintetizar una respuesta **con citas** a las
  páginas del wiki (`[[pagina]]`).
- **Generar páginas nuevas.** Para crear o completar páginas que respeten el
  estándar, usar la skill **`studyvault-page`**. La página resultante debe
  cumplir el checklist de `../_estandar/DESIGN.md` (frontmatter canónico, un solo
  H1, definiciones en blockquote con etiqueta en negrita, `## Ver también`) y
  quedar listada en `wiki/index.md` y registrada en `wiki/log.md`.
