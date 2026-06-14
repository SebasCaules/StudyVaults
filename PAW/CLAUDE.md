# PAW — Wiki publicada (copia read-only)

Esta es la **copia publicable** del vault de **Programación de Aplicaciones Web** (PAW, ITBA, cuatrimestre 2026-1C). El proyecto de la cátedra es una webapp Spring MVC apodada **Rent The Slopes**. La base de conocimiento documenta el código, los patrones y las decisiones de arquitectura del proyecto.

> **Importante.** Esto es una copia **read-only** publicada, no el vault de trabajo. El vault fuente vive aparte y es la única fuente de verdad editable. Acá solo se consulta y, si hace falta, se generan páginas nuevas alineadas al estándar.

## Qué materia es

- **Materia:** PAW — Programación de Aplicaciones Web (ITBA, 2026-1C).
- **Stack del proyecto:** Spring MVC (Java), JPA/Hibernate, Spring Security, Maven multi-módulo, JSP + custom tags, PostgreSQL/HSQLDB.
- **Enfoque:** conocimiento práctico orientado a implementación (cómo se hace algo en Spring y por qué), por encima de teoría pura.
- **Idioma:** el wiki está mayormente en español rioplatense; se conservan términos técnicos y nombres de código en inglés tal como aparecen en la fuente.

## Estructura del vault publicado

```
PAW/
├── CLAUDE.md            # Este archivo
├── README.md            # Orientación para lector humano
├── wiki/                # Base de conocimiento (47 páginas .md)
│   ├── index.md         # Catálogo completo, organizado por categoría
│   ├── log.md           # Bitácora append-only de operaciones
│   ├── entities/        # Inventario del código: clases, controllers, services, DAOs, views, tests
│   ├── concepts/        # Patrones, reglas y decisiones: MVC, DI, validación, seguridad, persistencia
│   ├── sources/         # Una página de resumen por fuente ingerida (clases, correcciones, Notion)
│   └── analyses/        # Comparaciones, deep dives y resultados de consultas que valió la pena guardar
└── raw/
    └── assets/notion-paw-images/   # Solo las imágenes embebidas que el wiki referencia
```

**Conteo:** 47 páginas `.md` bajo `wiki/` (`entities/` 7, `concepts/` 17, `sources/` 15, `analyses/` 6, más `index.md` y `log.md` en la raíz de `wiki/`). 71 imágenes PNG bajo `raw/assets/notion-paw-images/`.

### Aclaración sobre `raw/`

El `raw/` del vault original (PDFs de clases, correcciones, transcripciones, indicaciones de cátedra) **NO se incluye** en esta copia publicada. Solo se preserva `raw/assets/notion-paw-images/`, porque esas imágenes están embebidas en páginas del wiki (`wiki/sources/notion-teoricas-paw.md`) y sin ellas se romperían los enlaces. Cualquier referencia a otros archivos `raw/...` en el texto del wiki es un puntero histórico al vault de trabajo, no a contenido presente en esta copia.

## Convenciones

- **Estándar de páginas:** ver `../_estandar/DESIGN.md` (fuente de verdad de cómo se estructura una página `.md`: frontmatter, jerarquía de headings, blockquotes con etiqueta en negrita, wikilinks, naming kebab-case). Las páginas de este vault pueden anteceder al estándar; al editar o crear, alinearse a él.
- **Wikilinks** estilo Obsidian `[[pagina]]` para cross-references. El nombre dentro de `[[ ]]` es el nombre de archivo (o título) sin `.md`.
- **Navegación:** página → `wiki/index.md` (catálogo) → `../HOME.md` (home del repo que enlaza los 7 vaults). Para ubicarse, empezar siempre por `wiki/index.md`.
- **`index.md` cataloga; `log.md` es bitácora** append-only con entradas `## [AAAA-MM-DD] <op> | <subject>`.
- **LaTeX:** en PAW `$...$` se usa para *código inline* (nombres de clase, anotaciones), no para matemática. No introducir LaTeX matemático donde la materia no lo usa.
- **Código:** bloques con lenguaje declarado (` ```java `, ` ```yaml `, ` ```bash `).

## Cómo pedirle cosas a Claude sobre este vault

- **Consulta (lo más común).** Para responder una pregunta: leer primero `wiki/index.md` para localizar las páginas relevantes, después leer esas páginas y sintetizar la respuesta con `[[wikilinks]]` a lo citado. Bajar a una página puntual solo si el índice no alcanza.
- **Generar páginas nuevas.** Si la respuesta es sustancial y reutilizable, ofrecer guardarla como página nueva usando la skill **`studyvault-page`**, respetando `../_estandar/DESIGN.md` (frontmatter canónico, jerarquía de headings, sección "Ver también" al pie), agregándola a `wiki/index.md` y registrando la operación en `wiki/log.md`.
- **Ingest NO aplica.** Esta es una copia publicada read-only y sin el `raw/` de fuentes. El flujo de ingestión de documentos (leer un PDF nuevo y derivar páginas) corresponde al vault de trabajo original, no a esta copia.
