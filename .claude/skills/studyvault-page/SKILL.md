---
name: studyvault-page
description: Genera una pagina nueva de wiki de estudio (StudyVaults) desde cero siguiendo el estandar DESIGN.md, con minima instruccion. Usala cuando el usuario pida "generar/crear una pagina de wiki de estudio siguiendo el estandar StudyVaults", "agregar una nota nueva al vault", "documentar un tema en el vault", "crear una pagina de teoria/guia/concepto" o similar, dentro de un vault de estudio (nuevo o existente). Infiere la materia, aplica el estandar, arma frontmatter + navegacion y enlaza a index.md / HOME.md.
---

# studyvault-page

Genera una pagina `.md` de wiki publicable para un vault de StudyVaults, siguiendo el estandar
canonico de diseno. El objetivo es **determinismo**: con minima instruccion del usuario, la skill
infiere la materia, ubica el material fuente, elige carpeta y nombre, y produce una pagina que pasa
el checklist de calidad de DESIGN.md, ademas de listarla en `index.md`.

## Patron LLM Wiki

Un vault StudyVaults separa **fuente** de **conocimiento generado**:

- **`raw/`** — material crudo de la materia (PDFs de catedra, slides, fotos, codigo de TPs). Es la
  fuente. Las copias publicables a veces NO incluyen `raw/` (es read-only y vive en el vault origen).
- **`wiki/`** — paginas `.md` generadas a partir del `raw/`. Es lo que esta skill escribe. Contiene
  `index.md` (catalogo) y subcarpetas tematicas (`teoria/`,
  `clases/`, `guias/`, `resueltos/`, `parciales/`, `conceptos/`, etc.). SDS es la excepcion: usa la
  raiz del vault en vez de `wiki/`.

Esta skill **nunca** modifica el `raw/`: solo lee la fuente y escribe en `wiki/`.

## El estandar (fuente de verdad: assets/DESIGN.md)

La fuente de verdad completa es **`assets/DESIGN.md`** (incluido junto a esta skill; si corres dentro
de un repo StudyVaults, podes preferir el `_estandar/DESIGN.md` del repo, que es la misma version
mantenida ahi). **Lee DESIGN.md siempre antes de generar.** Companeros: `assets/TEMPLATE_pagina.md`
(esqueleto copy-paste) y `assets/EJEMPLO_pagina.md` (pagina de oro de MNA, ejemplo lleno realista).

Reglas duras (resumen; el detalle esta en DESIGN.md):

- **Frontmatter YAML obligatorio** en la linea 1, entre `---` y `---`. Claves en orden canonico:
  `tags` -> `fuente(s)` -> `unidad` -> `tipo` -> `actualizado` -> resto. `tags` (lista kebab-case,
  primer tag = tipo de pagina) y `fuente:`/`fuentes:` son **obligatorias y no vacias**.
- **H1 unico** justo debajo del frontmatter. Nunca dos `# H1`. Jerarquia sin saltos (`#` -> `##` -> `###`).
- **Definiciones/teoremas en blockquote con etiqueta en negrita**: `> **Definicion.** ...`,
  `> **Teorema.** ...`, `> **Observacion.** ...`. Etiqueta en negrita + punto + espacio.
- **NADA de callouts** `> [!note]`/`[!warning]`/`[!tip]`. **NADA de Dataview.** Cero HTML de render
  (solo comentarios `<!-- -->`, que ademas se borran antes de publicar).
- **kebab-case sin tildes ni ñ** en nombres de archivo y carpeta (los titulos del H1/frontmatter SI
  llevan tildes). Prefijo numerico `01-`, `02-` cuando el orden importa.
- **LaTeX solo si la materia lo usa**: `$...$` inline, `$$...$$` display. Fuerte en MNA/Economia/
  Proba/SDS; ausente en Derecho/Inge2; en PAW `$...$` es codigo inline, no matematica. No introducir
  LaTeX donde la materia no lo usa.
- **Seccion final `## Ver tambien`** al pie, precedida por un separador `---`, con wikilinks
  descriptivos a paginas hermanas/relacionadas.
- **Listar en `index.md`** (entrada en la seccion correcta, con wikilink + descripcion corta).
- Tono: español rioplatense, tecnico, conciso. Excepcion: vaults que nacen en ingles (PAW, Inge2)
  mantienen su idioma.

## Procedimiento

Al invocarte, segui estos pasos en orden:

1. **Leer el estandar.** Abri `assets/DESIGN.md` (o `_estandar/DESIGN.md` si existe en el repo) y
   tene a mano `assets/TEMPLATE_pagina.md` y `assets/EJEMPLO_pagina.md`.

2. **Detectar el vault y la materia.** Ubica la raiz del vault (carpeta con `CLAUDE.md` + `wiki/`, o
   `index.md` en raiz para SDS). Lee el `CLAUDE.md` del vault para inferir la materia,
   idioma, si usa LaTeX, convencion de naming (`-` vs `_`), numeracion de unidades (romana vs entera)
   y subcarpetas existentes. Si hay duda de en que vault estas, mira `index.md` para confirmar la
   materia. Si el vault es nuevo y falta `index.md`, crealo minimo antes de seguir.

3. **Ubicar el material fuente del tema pedido.** Busca en `raw/` (y en paginas `fuentes/` si existen)
   el PDF/slide/archivo que cubre el tema. Si `raw/` no esta en esta copia, usa la ruta `raw/...` mas
   especifica conocida como valor de `fuente:` (es un eco del vault origen, no tiene que resolver
   localmente). Si el usuario da el contenido directo, esa es la fuente.

4. **Elegir carpeta y nombre kebab-case.** Carpeta tematica segun el tipo (`teoria/`, `guias/`,
   `conceptos/`, etc.) usando el subconjunto que ya usa el vault. Nombre en kebab-case, sin tildes/ñ,
   con prefijo numerico (`01-`, `02-`) si el orden importa, respetando la convencion del vault
   (`-` salvo SDS que usa `_`). Verifica que no exista ya una pagina con ese nombre.

5. **Generar la pagina con el TEMPLATE.** Parti de `assets/TEMPLATE_pagina.md`, completa los
   placeholders y **borra todos los comentarios `<!-- -->`**. Cuerpo con secciones `## H2` ->
   `### H3`; definiciones/teoremas en blockquote con etiqueta en negrita. Conservador con el
   contenido (ante duda, incluir), restrictivo con el formato.

6. **Frontmatter completo.** `tags` en kebab-case (primer tag = tipo), `fuente:`/`fuentes:` no vacia,
   `unidad`/`tipo`/`actualizado` (fecha ISO de hoy) cuando apliquen, en el orden canonico.

7. **Cross-links + `## Ver tambien`.** Enlaza inline la primera mencion de conceptos con pagina
   propia (`[[carpeta/pagina]]`, con `|alias` si hace falta). Cierra con separador `---` y
   `## Ver tambien` listando paginas relacionadas con descripcion corta.

8. **Actualizar `index.md`.** Agrega la entrada de la pagina nueva en la seccion correcta
   de `index.md` (mismo formato de wikilink + descripcion corta que las vecinas) y toca la fecha
   `actualizado:` del indice.

9. **Checklist de calidad (DESIGN.md §11).** Antes de cerrar, verifica TODOS los puntos: frontmatter
   en linea 1; `tags`+`fuente` presentes y en orden; un solo `# H1` sin saltos de heading;
   definiciones en blockquote `> **Etiqueta.**` y cero callouts `[!type]`; LaTeX coherente con la
   materia; tablas con cabecera, codigo con lenguaje; wikilinks kebab-case sin `.md`; nombre de
   archivo kebab-case sin tildes en la carpeta correcta; separador `---` + `## Ver tambien`; tono
   rioplatense conciso; pagina listada en `index.md`.

## Ejemplo de invocacion end-to-end

**Prompt del usuario:**

> "Estoy en el vault de MNA. Crea una pagina nueva de teoria sobre la descomposicion LU."

**Que hace la skill:**

1. Lee `assets/DESIGN.md` + template + ejemplo.
2. Detecta el vault: `StudyVaultsITBA/MNA/`, lee `MNA/CLAUDE.md` -> materia algebra lineal numerica,
   español, LaTeX fuerte, naming con `-`, unidades en romano, ya existe `wiki/teoria/`.
3. Ubica la fuente: slide de factorizaciones en `raw/Teoricas/...` (o la ruta mas especifica
   conocida) y la clase relacionada `wiki/clases/clase-2026-05-07.md` (LU/PLU/QR).
4. Elige carpeta/nombre: `wiki/teoria/05-descomposicion-lu.md` (prefijo `05-` continua la serie
   `01-`..`04-` de teoria).
5. Genera la pagina con el template: H1 `# Descomposicion LU`, secciones con definicion de LU en
   blockquote, condiciones de existencia (pivoteo -> PLU), algoritmo de Doolittle, ejemplo con
   `$$...$$` y un bloque `python` de verificacion con numpy.
6. Frontmatter:

   ```yaml
   ---
   tags: [teoria, unidad-II, factorizaciones, lu, plu, doolittle]
   fuente: raw/Teoricas/Slides/MNA_Factorizaciones.pdf
   unidad: II
   tipo: teoria
   actualizado: 2026-06-14
   ---
   ```

7. Cross-links inline a `[[teoria/03-matrices]]` y cierre:

   ```markdown
   ## Ver también

   - [[teoria/03-matrices]] — operaciones matriciales y matrices triangulares
   - [[clases/clase-2026-05-07|Clase LU/QR]] — Doolittle aplicado en clase
   - [[teoria/04-determinantes]] — el determinante via producto de pivotes
   ```

8. Agrega `- [[teoria/05-descomposicion-lu]] — factorizacion LU/PLU, Doolittle, pivoteo` a la
   seccion "Teoria" de `wiki/index.md` y actualiza su fecha `actualizado:`.

9. Corre el checklist de DESIGN.md §11 y reporta el path generado.

**Archivo resultante:** `StudyVaultsITBA/MNA/wiki/teoria/05-descomposicion-lu.md`, mas la entrada
en `index.md`.

## Instalacion

La skill es **autocontenida**: trae su propio `assets/DESIGN.md`, `assets/TEMPLATE_pagina.md` y
`assets/EJEMPLO_pagina.md`, asi que funciona aunque la copies a una maquina sin el repo StudyVaults.

- **Ya viene incluida en este repo** en `.claude/skills/studyvault-page/`.
- **Instalacion global** (todos los proyectos): copia la carpeta a `~/.claude/skills/`:

  ```bash
  cp -R .claude/skills/studyvault-page ~/.claude/skills/
  ```

- **Instalacion por proyecto:** copia la carpeta a `.claude/skills/` del proyecto destino.

Si corres dentro de un repo StudyVaults, la skill puede preferir el estandar mantenido del repo en
`_estandar/DESIGN.md` (es la misma version que `assets/DESIGN.md`); fuera del repo, usa el de
`assets/`. La carpeta `studyvault-page/` debe quedar con su `SKILL.md` y su `assets/` juntos.
