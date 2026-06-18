# Derecho para Ingenieros — copia publicable

Esta es la **copia publicable, read-only** del vault de estudio de **Derecho para Ingenieros**
(ITBA, 1C 2026). Es un "segundo cerebro" de la materia: apuntes, conceptos, fuentes, guías de
parcial y material de examen, escrito en **español** y navegable en Obsidian.

> **Importante.** Esta carpeta es una copia derivada de un vault privado. La base de
> conocimiento cruda (`raw/`: PDFs, clases, presentaciones, libro Perego) **no** se incluye
> acá: vive solo en el vault original de trabajo. Acá quedan únicamente las páginas `.md` del
> wiki y su material compañero (HTMLs de estudio, PDFs compilados, `.tex`). No intentes
> "ingestar" fuentes desde esta copia: el flujo de ingest no aplica.

## Qué materia es

Derecho para Ingenieros cubre los fundamentos legales para estudiantes de ingeniería a lo
largo de **9 unidades**: desde introducción al derecho hasta derecho laboral. El criterio de
aprobación de la cátedra es **final reducido = 70/100 puntos** acumulados entre 5 parcialitos
(10 pts c/u) y 2 parciales (25 pts c/u).

| Unidad | Tema |
|--------|------|
| 1 | Introducción al Derecho |
| 2 | Organización del Estado |
| 3 | Derecho Civil |
| 4 | Derecho Comercial |
| 5 | Propiedad Intelectual |
| 6 | Sociedades |
| 7 | Contratos Civiles y Comerciales |
| 8 | Derechos del Consumidor |
| 9 | Derecho Laboral |

## Estructura del vault publicado

```
wiki/
├── index.md            # Índice maestro: catálogo de páginas + tracker de notas
├── referencias/        # Material de referencia general (mapeo unidades ↔ libro, etc.)
├── parcialitos/        # Guías y mocks de los parcialitos individuales
├── 1erParcial/         # Material integrador del 1er parcial (resumen, PDF/tex compilados)
├── 2doParcial/         # Material integrador del 2do parcial (guía maestra, quizzes HTML)
├── TPE/                # Trabajo Práctico Especial (caso Vitae): consigna, rúbrica, análisis
└── unidad-N/           # Conceptos, entidades, fuentes y casos por unidad (1 a 9)
```

Cada `unidad-N/` agrupa páginas de tipo `concepto`, `entidad`, `resumen`, `fuente`,
`comparacion` y `examen`, todas enlazadas con `[[wikilinks]]`. El punto de entrada es
`wiki/index.md`.

## Convenciones

- **Estándar de diseño de páginas:** `../_estandar/DESIGN.md` — es la fuente de verdad de
  cómo se estructura una página `.md` (frontmatter, jerarquía de headings, blockquotes con
  etiqueta en negrita, naming kebab-case, navegación). Toda página nueva debe respetarlo.
- **Mapa del repo:** `../HOME.md` enlaza los vaults publicados de todas las materias.
- **Naming:** archivos en kebab-case, minúsculas, sin tildes ni ñ (`norma-juridica.md`,
  `unidad-1-resumen.md`, `fuente-clase-01-intro.md`). Los títulos en el H1/frontmatter sí
  llevan tildes.
- **Derecho no usa LaTeX.** No introducir matemática `$...$` donde la materia no la usa.
- **Definiciones y avisos:** blockquote con etiqueta en negrita (`> **Definición.**`,
  `> **Nota.**`, `> **Cuidado:**`). Cero callouts nativos `[!note]`, cero Dataview, cero HTML
  de render dentro del Markdown.
- **Citación:** las páginas citan normativa por número (`art. X CCyC`, `art. Y LGS`,
  `art. Z LCT`) y fuentes por página. La ruta `fuente:` del frontmatter apunta a `raw/…` del
  vault original, que acá no está presente (es esperado: es metadato de procedencia).

## Cómo pedirme cosas

- **Consulta:** preguntá sobre cualquier tema de la materia. Leo `wiki/index.md`, ubico las
  páginas relevantes y sintetizo la respuesta con `[[wikilinks]]` a las páginas que la
  respaldan.
- **Generar páginas nuevas:** para crear o ampliar una página del wiki respetando el estándar,
  usá la skill **studyvault-page**. Genera la página alineada a `../_estandar/DESIGN.md`
  (frontmatter canónico, headings, blockquotes, "Ver también") y la enlaza desde `index.md`.
- **Material de examen:** puedo armar guías de repaso, tablas comparativas o Q&A por unidad a
  partir de las páginas existentes.

> **Recordá.** No hay `raw/` acá. Si una tarea requiere leer la fuente cruda original, hay que
> hacerlo en el vault privado de trabajo, no en esta copia publicable.
