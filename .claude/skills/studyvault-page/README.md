# studyvault-page

Skill de [Claude Code](https://claude.com/claude-code) que genera una **página nueva de wiki de estudio** para un vault de [StudyVaults ITBA](../../../README.md), siguiendo el estándar canónico de diseño (`assets/DESIGN.md`) de punta a punta: frontmatter YAML correcto, jerarquía de headings, definiciones en blockquote, wikilinks en kebab-case, LaTeX según la materia y la sección `## Ver también` al pie — además de listar la página en `wiki/index.md`.

Con mínima instrucción (p. ej. *"creá una página de teoría sobre la descomposición LU"*) infiere la materia, ubica el material fuente, elige carpeta y nombre, y produce una página que pasa el checklist de calidad del estándar.

## Es autocontenida

Trae su propia copia del estándar en `assets/`, así que **funciona aunque la copies a una máquina sin el repo StudyVaults**:

```
studyvault-page/
├── SKILL.md                    ← definición + procedimiento paso a paso
├── README.md                   ← este archivo
├── EJEMPLO_generado_MNA.md     ← una página real generada por la skill
└── assets/
    ├── DESIGN.md               ← el estándar canónico (fuente de verdad)
    ├── TEMPLATE_pagina.md      ← esqueleto copy-paste
    └── EJEMPLO_pagina.md       ← página de oro de referencia
```

## Instalación

- **Global** (disponible en todos tus proyectos de Claude Code):

  ```bash
  cp -R studyvault-page ~/.claude/skills/
  ```

- **Por proyecto** (solo en un repo concreto):

  ```bash
  cp -R studyvault-page <otro-repo>/.claude/skills/
  ```

Si abrís el repo StudyVaults con Claude Code, la skill **ya viene activa** sin instalar nada.

## Uso

Parado dentro de un vault de estudio, invocá la skill:

```
/studyvault-page
```

o simplemente pedíselo en lenguaje natural: *"agregá una página nueva al vault siguiendo el estándar StudyVaults sobre &lt;tema&gt;"*. La skill detecta el vault, lee su `CLAUDE.md` para respetar sus convenciones (idioma, naming, LaTeX) y genera la página.

El procedimiento completo, las reglas duras del estándar y un ejemplo end-to-end están en [`SKILL.md`](./SKILL.md).
