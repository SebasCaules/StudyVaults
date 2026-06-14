# CLAUDE.md — Economía para Ingenieros (copia publicada)

Este es el vault **publicable y de solo lectura** de **Economía para Ingenieros**
(ITBA, código 61.23, cátedra Cepeda, 2026 1C). Es una copia limpia derivada de la
base de conocimiento personal: contiene **únicamente** la wiki curada, sin las
fuentes crudas ni el material de estudio interno.

## Qué es esta copia

- Es la versión publicada de la materia dentro del repo **StudyVaultsITBA**.
- **No incluye `raw/`** (PDFs originales de clases, guías y parciales escaneados),
  ni la carpeta `study/`, ni binarios de la app de estudio. Esos vivían solo en el
  vault original privado. Por eso, las claves `fuente:`/`fuentes:` del frontmatter
  apuntan a rutas `raw/…` que **no existen acá**: son referencias de procedencia,
  no enlaces navegables. Es esperado y correcto.
- Lo que sí está completo: todas las páginas `.md` de la wiki y todos los gráficos
  SVG embebidos que esas páginas necesitan.

## Estructura del vault publicado

```
wiki/
  index.md          ← índice maestro: arrancá por acá
  overview.md       ← síntesis global del curso (módulos, parciales)
  log.md            ← bitácora cronológica append-only de la construcción del wiki
  resumen-microeconomia.md  ← hoja de estudio integral Unidades 1-4 (Parcial 1)
  unidades/         ← un resumen por unidad (01 a 08)
  conceptos/        ← una página por concepto/término (~142 páginas)
  formulas/         ← formularios por unidad (unidad-01.md … unidad-08.md)
  ejercicios/       ← guías prácticas resueltas (GP1-GP5, cálculo financiero, proyectos)
  examenes/         ← análisis de parciales y tipos de pregunta
  assets/
    graficos/       ← 42 gráficos SVG embebidos en las páginas vía ![[archivo.svg]]
CLAUDE.md           ← este archivo
README.md           ← presentación para lector humano
```

### Mapa de unidades

| Módulo | Unidades | Parcial |
|--------|----------|---------|
| Microeconomía | 01 Oferta/Demanda/Elasticidades · 02 Producción y Costos · 03 Competencia Perfecta · 04 Mercados Imperfectos | 1 |
| Macroeconomía | 05 PBI, Inflación, ODA, Política Fiscal/Monetaria, Comercio | 1 |
| Empresa | 06 Información Contable · 07 Cálculo Financiero · 08 Evaluación de Proyectos | 2 |

## Convenciones

- El formato de cada página `.md` sigue el estándar canónico del repo:
  **`../_estandar/DESIGN.md`** (frontmatter YAML, H1 único, blockquotes con etiqueta
  en negrita para definiciones/teoremas, LaTeX `$…$`/`$$…$$`, wikilinks kebab-case,
  cierre con `## Ver también`). Consultalo antes de crear o editar páginas.
- Naming: kebab-case, sin tildes ni ñ en nombres de archivo; prefijo numérico
  (`unidad-01-…`) cuando el orden importa.
- Wikilinks estilo Obsidian `[[carpeta/pagina]]`; gráficos embebidos con
  `![[nombre.svg]]` (los SVG viven en `wiki/assets/graficos/`).
- Idioma: español rioplatense, técnico y conciso.
- Navegación del repo: índice del vault en `wiki/index.md`; home global del repo en
  **`../HOME.md`** (enlaza los demás vaults de StudyVaultsITBA).

## Cómo pedirle cosas a Claude en este vault

- **Ingest NO aplica acá.** Esta es una copia publicable read-only; no hay `raw/`
  para ingerir. La ingesta de material crudo se hace en el vault original privado.
- **Consultas:** leé `wiki/index.md` para ubicar las páginas relevantes, después esas
  páginas, y respondé con citas a los wikilinks correspondientes.
- **Generar páginas nuevas** (un concepto, un resumen, un análisis): usá la skill
  **`studyvault-page`**, que produce páginas alineadas a `../_estandar/DESIGN.md`.
  Registrá la operación en `wiki/log.md` y enlazá la página desde `wiki/index.md`.
- **Nunca** modifiques el vault original en `26-1C/Economia_Obsidian` (es la fuente
  privada de solo lectura). Acá se trabaja sobre la copia publicada.
