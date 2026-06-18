# SDS — Simulación de Sistemas (ITBA, 26-1C) — copia publicada

Esta es la **copia publicable, de solo lectura**, del wiki de la materia
**Simulación de Sistemas** (ITBA, 1.º cuatrimestre 2026). Vive dentro del repo
`StudyVaultsITBA`, junto a los otros seis vaults de materias.

El vault original sigue el patrón "LLM Wiki": el humano cura fuentes crudas en
`raw/` y Claude construye y mantiene `wiki/`. **Esta copia NO incluye `raw/`**
(PDFs de cátedra, enunciados, correcciones, código de TPs pasados, papers): es
una instantánea limpia y navegable solo del conocimiento destilado en `wiki/`,
más `index.md`. Por eso, las citas a `raw/...` que aparecen en el
frontmatter y en el cuerpo de las páginas son **referencias de procedencia**
que apuntan al vault privado original; los archivos a los que refieren **no
están** en esta copia.

## De qué trata la materia

Simulación de sistemas de partículas y agentes: modelos off-lattice (Vicsek),
dinámica molecular dirigida por eventos (EDMD) y por paso temporal (DM),
integradores numéricos (Euler, Verlet y variantes, Beeman, Gear
predictor-corrector), métodos de vecindad (cell index method, condiciones
periódicas de contorno) y los observables asociados a cada TP. El idioma es
español; se conservan los términos técnicos en inglés cuando son los estándar
(*off-lattice*, *Verlet*, *cell index method*, *lazy invalidation*).

## Estructura del vault publicado

```
SDS/
├── CLAUDE.md   # este archivo
├── README.md   # orientación para lector humano
├── index.md    # catálogo de toda la wiki (empezar acá)
└── wiki/
    ├── tps/            # una página por TP (TP2…TP5) + previsualización de gráficos
    ├── conceptos/      # conceptos teóricos (Vicsek, EDMD, integradores, polarización, …)
    ├── metodos/        # algoritmos y métodos numéricos (Euler, Verlet, Beeman, Gear, colisiones, …)
    ├── herramientas/   # convenciones de tooling del grupo (Java, matplotlib)
    └── fuentes/        # una página-resumen por cada fuente del vault original en raw/
```

## Convenciones

- **Estándar de páginas:** el formato de cada `.md` sigue el estándar canónico
  del repo en [`../_estandar/DESIGN.md`](../_estandar/DESIGN.md). Consultalo antes
  de crear o editar páginas (anatomía de página, frontmatter, headings,
  blockquotes para definiciones/teoremas, wikilinks, naming).
- **Naming:** SDS es la excepción histórica del repo y usa `_` (snake_case) en
  los nombres de archivo (`cell_index_method.md`, `velocity_verlet.md`), no
  kebab-case. Mantené esa convención dentro de este vault para no romper
  wikilinks existentes.
- **Wikilinks** estilo Obsidian con ruta de carpeta: `[[conceptos/cell_index_method]]`,
  `[[metodos/velocity_verlet]]`, `[[tps/TP4]]`. Sin links markdown.
- **Frontmatter YAML** (opcional pero recomendado): `tipo`, `tags`, `fuentes`,
  `actualizado`. Ver detalle en el estándar.
- **Matemática en LaTeX:** `$...$` inline y `$$...$$` display (SDS usa LaTeX de
  forma intensiva).
- **Navegación:** empezar por `index.md`. La cadena de navegación es
  página → `index.md` del vault → [`../HOME.md`](../HOME.md) del repo.

## Cómo pedirle cosas a Claude en esta copia

- **Ingest NO aplica acá.** El flujo de ingesta de fuentes (leer un PDF de
  `raw/`, discutirlo, crear `fuentes/` y actualizar páginas) vive en el vault
  privado original. Esta copia no tiene `raw/`, así que no hay nada que ingestar.
- **Consulta (query):** preguntá sobre cualquier tema de la materia. Claude debe
  leer `index.md` primero para ubicar páginas, drillear en ellas y responder con
  citas a páginas del wiki (`[[conceptos/...]]`, `[[metodos/...]]`). Si una cita
  apunta a `raw/...`, recordar que es procedencia hacia el vault original.
- **Generar páginas nuevas:** usar la skill **`studyvault-page`**, que produce
  páginas alineadas al estándar de [`../_estandar/DESIGN.md`](../_estandar/DESIGN.md)
  (frontmatter, headings, blockquotes, "Ver también", wikilinks). Después de
  crear una página, sumarla a `index.md`.

## Reglas duras

- **Es una copia read-only de la base de conocimiento.** No reintroducir `raw/`
  ni material crudo acá.
- **No inventar contenido.** Si algo no está respaldado por una fuente, marcarlo
  como interpretación o decisión del grupo.
- **Updates atómicos:** si se crea o edita una página, `index.md`
  queda consistente en la misma operación.
