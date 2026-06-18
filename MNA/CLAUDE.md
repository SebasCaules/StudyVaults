# CLAUDE.md — MNA (copia publicable)

Esta carpeta es la **copia publicable y read-only** del vault de **Métodos Numéricos
Avanzados** (MNA, ITBA, 26-1C). Es una de las materias del repo StudyVaults. El
conocimiento vive en `wiki/`; no hay base cruda acá (ver más abajo).

## Qué es esta materia

MNA cubre álgebra lineal numérica y análisis aplicado: números complejos, vectores y
matrices en $\mathbb{K}^n$, determinantes, espacios vectoriales, transformaciones
lineales, diagonalización, factorizaciones (LU/PLU, QR, SVD), pseudoinversa de
Moore–Penrose, mínimos cuadrados, series de Fourier y transformada de Fourier. La
notación es fuertemente matemática (LaTeX `$...$` inline y `$$...$$` display).

## Estructura del vault publicado

```
wiki/
  index.md            # catálogo de todas las páginas — empezar acá
  00-mapa-temas.md    # tabla Unidad → Tema → páginas (qué entrena qué)
  AUDIT_REPORT.md     # informe de cobertura/consistencia de la wiki
  teoria/             # 4 páginas — teoría de Unidad I y II (slides)
  clases/             # 9 páginas cronológicas (12 mar → 14 may)
  pizarrones/         # 10 transcripciones de fotos de pizarrón
  guias/              # 9 guías TP con enunciados
  resueltos/          # 6 archivos de ejercicios resueltos paso a paso
  parciales/          # enunciados + resoluciones (IP/IIP/Final) + patrones.md
```

98 páginas `.md` bajo `wiki/`.

## Convenciones

- El estándar de formato de página vive en `../_estandar/DESIGN.md` (Markdown vanilla +
  wikilinks + LaTeX; cero callouts nativos, cero Dataview, cero HTML de render).
  Definiciones/teoremas en blockquote con etiqueta en negrita: `> **Definición.** ...`.
- Idioma: español rioplatense, técnico y conciso.
- Nombres de archivo en kebab-case, sin tildes ni ñ; prefijo numérico (`01-`, `02-`)
  cuando el orden importa.
- Navegación: cada página termina en `## Ver también` con wikilinks; el catálogo es
  `wiki/index.md`; el home del repo es `../HOME.md`.
- Wikilinks estilo Obsidian: `[[teoria/03-matrices]]`, con `|alias` cuando haga falta.

## Aclaración importante: `raw/` NO está incluido

Esta es una copia publicable. La base de conocimiento cruda del vault original
(`raw/` con PDFs de cátedra) y los entregables de estudio (`study/`: cheatsheet HTML y
scripts MicroPython para Casio fx-CG50) **no se incluyen** acá. Algunas referencias
internas de `wiki/index.md` apuntan a `../study/...` o `raw/...`: son ecos del vault
fuente y no resuelven en esta copia.

## Cómo pedirme cosas

- **Ingest no aplica.** Esta copia no tiene `raw/`, así que no se ingesta material nuevo
  acá; eso se hace en el vault fuente.
- **Consulta:** leé `wiki/index.md` primero para ubicar la página relevante, después la
  página concreta. Respondé con citas a las páginas de la wiki.
- **Generar páginas nuevas:** usá la skill `studyvault-page`, respetando
  `../_estandar/DESIGN.md`. Toda página nueva se lista en `wiki/index.md`.
