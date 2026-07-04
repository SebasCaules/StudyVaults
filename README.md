# StudyVaults ITBA

Bases de conocimiento de materias del [ITBA](https://www.itba.edu.ar/) en formato [Obsidian](https://obsidian.md/), construidas con el patrón **"LLM Wiki"**: se parte de fuentes crudas (apuntes, clases, transcripciones, parciales, libros) y un asistente las **destila** en un wiki curado de páginas `.md` cortas, enlazadas entre sí, con un formato uniforme y determinista. La idea es simple: en vez de releer un PDF de 200 páginas, tenés un grafo de notas atómicas con definiciones, teoremas, ejemplos y links cruzados, navegable y buscable. Sirve para estudiar para parciales y finales, repasar conceptos sueltos, o como punto de partida para generar páginas nuevas siguiendo el mismo estándar.

> **Nota.** Este repo publica **solo el wiki curado**. El material crudo de cada materia (`raw/`, apuntes propios, audios, etc.) **no se incluye** — es privado y queda en los vaults originales. Lo que ves acá es el conocimiento ya procesado y listo para consultar.

---

## Cómo bajarlo y usarlo

```bash
git clone https://github.com/SebasCaules/StudyVaults.git StudyVaultsITBA
cd StudyVaultsITBA
```

Tenés dos formas de usarlo:

1. **Como vault de Obsidian (recomendado).** Abrí Obsidian → *Open folder as vault* → elegí la carpeta `StudyVaultsITBA` (o una materia puntual, p. ej. `MNA/`). Vas a tener wikilinks navegables, grafo, búsqueda y render de LaTeX. Arrancá por **`HOME.md`** en la raíz, que es el mapa de navegación a todos los vaults.
2. **Como Markdown en GitHub / cualquier editor.** Los archivos son Markdown vanilla: se leen perfectamente en GitHub, VS Code o cualquier visor. Los wikilinks `[[...]]` no son clickeables fuera de Obsidian, pero el texto se lee igual.

Empezá siempre por **`HOME.md`** (el índice central del repo), y dentro de cada materia por su `wiki/index.md`.

---

## Índice de vaults

| Materia | Carpeta | Páginas | Descripción |
|---|---|---:|---|
| Métodos Numéricos Avanzados | [`MNA/`](./MNA/) | 97 | Teoría, clases, pizarrones, guías, ejercicios resueltos y un banco grande de parciales. |
| Derecho | [`Derecho/`](./Derecho/) | 161 | Las 9 unidades del programa, parciales, TPE, parcialitos y referencias jurídicas. |
| Economía | [`Economia/`](./Economia/) | 179 | Micro y macro con gráficos vectoriales (SVG) embebidos y fuertes formulaciones en LaTeX. |
| Probabilidad y Estadística | [`Proba/`](./Proba/) | 160 | Conceptos, distribuciones, teoremas, técnicas y formularios, con fuentes documentadas. |
| Programación de Aplicaciones Web | [`PAW/`](./PAW/) | 46 | Entidades, conceptos y análisis del stack web; incluye imágenes de las teóricas. En inglés. |
| Simulación de Sistemas | [`SDS/`](./SDS/) | 40 | Teoría de simulación, TPs y notas; naming en `snake_case` por convención histórica. |
| Ingeniería del Software II | [`Inge2/`](./Inge2/) | 91 | Conceptos, clases, casos de estudio, ejercicios y fuentes de ISW II. En inglés. |

Total: **7 vaults**, ~774 páginas curadas (contando las `.md` de cada `wiki/`).

---

## El sitio web

Todo el repo se publica además como **portal web**: **<https://sebascaules.github.io/StudyVaults/>**.
Renderiza los 7 wikis (con LaTeX, wikilinks resueltos y búsqueda), e incluye el **planificador de
electivas** (plan de cursada, combinador de horarios y de finales), **hojas imprimibles** de fórmulas
y conceptos, y **toolkits interactivos** por materia. El código vive en [`site/`](./site/)
(Next.js, export estático); se corre local con `./run.sh` y se deploya solo a GitHub Pages en cada
push a `main`.

---

## Estructura del repo

```
StudyVaultsITBA/
├── HOME.md            ← mapa de navegación central a los 7 vaults
├── _estandar/         ← el estándar de diseño de las páginas (no es una materia)
├── MNA/               ┐
├── Derecho/           │
├── Economia/          │
├── Proba/             ├─ un directorio por materia
├── PAW/               │
├── SDS/               │
├── Inge2/             ┘
├── Electivas/         ← datos del planificador (materias, horarios, programas)
├── site/              ← el portal web Next.js (ver "El sitio web")
└── run.sh             ← correr/verificar el sitio en local
```

- **`HOME.md`** — índice central del repo: enlaza los 7 vaults y explica por dónde entrar. Es el punto de partida sugerido.
- **`_estandar/`** — la fuente de verdad de **cómo se ve y estructura** una página del wiki. No es una materia, es el manual de estilo del repo:
  - `DESIGN.md` — estándar canónico (frontmatter, headings, definiciones, wikilinks, LaTeX, naming).
  - `FEATURES_*.md` — guías profundas por tema: `frontmatter`, `callouts-y-bloques`, `formulas-y-codigo`, `navegacion`, `indices-y-logs`.
  - `TEMPLATE_pagina.md` — template vacío copy-paste para una página nueva.
  - `EJEMPLO_pagina.md` — una página real y completa como prueba de oro.
  - `AUDIT.md` — auditoría de los vaults que dio origen al estándar.
- **Una carpeta por vault** — cada materia trae:
  - `wiki/` — las páginas `.md` curadas (más su `index.md`).
  - `README.md` — qué es la materia y cómo está organizado su vault.
  - `CLAUDE.md` — instrucciones para el asistente al trabajar ese vault (convenciones propias, desviaciones, qué no tocar).

---

## Convenciones

Todas las páginas siguen [`_estandar/DESIGN.md`](./_estandar/DESIGN.md). En resumen:

- **Frontmatter YAML obligatorio** al tope de cada página: `tags`, `fuente(s)`, y opcionalmente `unidad`, `tipo`, `actualizado` — siempre en ese orden.
- **Wikilinks `[[archivo]]`** para enlazar páginas (nombre de archivo sin `.md`, en kebab-case), con alias `[[archivo|texto]]` cuando hace falta leer distinto.
- **Definiciones, teoremas y observaciones** como blockquote con etiqueta en negrita: `> **Definición.** ...`. Cero callouts nativos, cero Dataview, cero HTML de render.
- **Nombres de archivo en kebab-case**, sin tildes ni ñ, con prefijo numérico (`01-`, `02-`) cuando el orden importa. (SDS usa `snake_case` por convención histórica.)
- **LaTeX donde la materia lo usa**: `$...$` inline y `$$...$$` display en MNA, Economía, Proba y SDS; ausente en Derecho e Inge2; en PAW `$...$` se usa para código inline. No se introduce LaTeX donde la materia no lo usa.

---

## Generar páginas nuevas

El repo trae una **suite de 8 skills** para [Claude Code](https://claude.com/claude-code) en
[`.claude/skills/`](./.claude/skills/) (contenido, toolkits, hojas, UI, datos, ingesta, operación y
estándar — ver su [README](./.claude/skills/README.md)). La de contenido es la
**skill [`studyvault-page`](./.claude/skills/studyvault-page/)**. La skill toma material de una materia y produce una página `.md` que cumple el estándar de punta a punta: frontmatter correcto, jerarquía de headings, definiciones en blockquote, wikilinks, LaTeX según la materia, y la sección `## Ver también` al pie — además de listarla en `wiki/index.md`. Así dos páginas generadas por separado, a partir del mismo material, salen idénticas en estructura.

La skill es **autocontenida** (trae su propia copia del estándar en `assets/`, así funciona aunque la saques del repo). Tenés tres formas de usarla:

- **Ya viene activa al abrir este repo** con Claude Code: invocá `/studyvault-page` o pedí *"creá una página nueva siguiendo el estándar StudyVaults"* parado dentro de una materia.
- **Instalación global** (disponible en todos tus proyectos):

  ```bash
  cp -R .claude/skills/studyvault-page ~/.claude/skills/
  ```

- **Instalación por proyecto** (copiala al repo destino):

  ```bash
  cp -R .claude/skills/studyvault-page <otro-repo>/.claude/skills/
  ```

Detalle completo del procedimiento y las reglas en [`.claude/skills/studyvault-page/SKILL.md`](./.claude/skills/studyvault-page/SKILL.md).

---

## Licencia y uso

Material de **estudio personal**, compartido con fines **académicos y educativos**. Son apuntes de un estudiante del ITBA, no material oficial de la institución ni de las cátedras: pueden contener errores, omisiones o interpretaciones propias. Usalo para aprender y repasar, verificá siempre contra las fuentes oficiales de cada materia, y no lo presentes como producción de la cátedra. El material crudo y con derechos de terceros (libros, apuntes de cátedra, etc.) **no se publica** en este repo.
