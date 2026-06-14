# DESIGN.md — Estándar canónico de diseño de páginas (StudyVaults)

> Documento del **Designer de documentación**. Es la fuente de verdad de CÓMO se ve y se
> estructura una página `.md` del wiki publicable. El objetivo es **determinismo**: dos páginas
> generadas por separado, a partir del mismo material, deben salir **idénticas en estructura**.
>
> **Output en español rioplatense, conciso.** Los vaults originales son SOLO LECTURA: este
> estándar describe el formato del repo publicable, **nunca** modifica los vaults fuente.
>
> Calibrado contra el vault de referencia (MNA): ver `26-1C/MNA_Obsidian/wiki/teoria/02-vectores-cn-rn.md`
> y `04-determinantes.md`. Estándar derivado de la auditoría: ver `AUDIT.md`.

Archivos compañeros de este estándar:

- **`TEMPLATE_pagina.md`** — template vacío, copy-paste, con placeholders y comentarios guía.
- **`EJEMPLO_pagina.md`** — página de teoría de MNA completa y realista (prueba de oro).

---

## 0. Principios

1. **Markdown vanilla + wikilinks + LaTeX.** Nada de plugins. **CERO** callouts `[!note]`/`[!warning]`, **CERO** Dataview, **CERO** HTML salvo comentarios `<!-- -->` (que no se renderizan).
2. **Determinismo estructural.** El orden de los bloques es fijo (sección 1). Ante dos formas válidas, se elige **siempre** la que dicta este documento.
3. **Conservador con el contenido.** Ante la duda sobre incluir conocimiento → se incluye. El estándar restringe el *formato*, no recorta el *saber*.
4. **Una página = una idea cohesiva.** Si una página crece sin foco, se parte en varias y se enlazan.
5. **Idioma.** Cuerpo y títulos en **español rioplatense**, registro técnico y conciso. Excepción: vaults que ya nacen en inglés (PAW, Inge2) mantienen su idioma; el estándar aplica igual.

---

## 1. Anatomía de una página (orden OBLIGATORIO)

Toda página tiene exactamente estos bloques, **en este orden**, sin excepción:

```
1. Frontmatter YAML      (entre --- y ---, primera línea del archivo)
2. H1 único              (# Título)   ← inmediatamente debajo del frontmatter
3. Cuerpo                (secciones H2 → subsecciones H3 → contenido)
4. Separador final       (---)        ← una sola línea horizontal
5. "## Ver también"      (lista de wikilinks de navegación)
```

Reglas de espaciado (deterministas):

- Exactamente **una línea en blanco** entre el cierre del frontmatter (`---`) y el `# H1`.
- Exactamente **una línea en blanco** entre el `# H1` y el primer `## H2`.
- Exactamente **una línea en blanco** antes de cada heading.
- El separador `---` del paso 4 va **precedido y seguido** por una línea en blanco.
- El archivo termina con **una** newline final (sin líneas en blanco de más).

---

## 2. Frontmatter YAML

Va delimitado por `---` en la primera línea y `---` de cierre. **Siempre presente.**

### 2.1 Bloque canónico (cópialo y completá)

```yaml
---
tags: [tipo, unidad-N, tema-principal, subtema]
fuente: raw/ruta/al/archivo-fuente.pdf
unidad: N
tipo: teoria
actualizado: AAAA-MM-DD
---
```

### 2.2 Claves: obligatorias vs opcionales

| Clave | Estado | Tipo / formato | Notas |
|---|---|---|---|
| `tags` | **Obligatoria** | Lista YAML inline `[a, b, c]`, valores en **kebab-case** | Primer tag = tipo de página (`teoria`, `clase`, `guia`, `resuelto`, `parcial`, `concepto`, `distribucion`, `teorema`, `tecnica`, `formulario`, `fuente`). Sin tildes ni ñ en los tags. |
| `fuente` / `fuentes` | **Obligatoria** | `fuente:` string (ruta a `raw/…`) **o** `fuentes:` lista | Singular si hay una sola fuente; plural (lista) si hay varias. Ruta relativa a la raíz del vault, o `[[wikilink]]` a una página de `fuentes/`. |
| `unidad` / `unit` | Opcional (recomendada si aplica) | Número romano (`II`) o entero (`2`) | Usar la convención de la materia. Omitir si la página es transversal. |
| `tipo` / `type` | Opcional (recomendada) | String (mismo vocabulario que el primer tag) | Redundante con el primer tag a propósito: facilita filtrado. |
| `actualizado` / `updated` | Opcional | Fecha ISO `AAAA-MM-DD` | Fecha de última edición de la página. |
| `tema` | Opcional | String kebab-case o frase corta | Tema dentro de la unidad. |
| `titulo` / `title` | Opcional | String con tildes y mayúsculas | Solo si el H1 no alcanza (p. ej. alias largo). Coincide con el H1. |
| `aliases` | Opcional | Lista YAML | Nombres alternativos para wikilinks. |
| `tiene_resolucion` | Opcional (parciales/guías) | `true`/`false` | Marca si el enunciado tiene resolución par. |
| `related` | Opcional | Lista de `[[wikilinks]]` | Cross-links destacados (además de "Ver también"). |

Reglas:

- **Nunca** dejes una clave obligatoria vacía. Si no hay fuente clara, `fuente: raw/` con la subcarpeta más específica conocida.
- Las claves van **siempre en el mismo orden** que el bloque canónico (2.1): `tags` → `fuente(s)` → `unidad` → `tipo` → `actualizado` → resto.
- Fechas SIEMPRE ISO `AAAA-MM-DD`.
- No mezclar singular/plural arbitrariamente: una sola fuente → `fuente:` (string); varias → `fuentes:` (lista).

---

## 3. Jerarquía de headings

| Nivel | Uso | Regla |
|---|---|---|
| `# H1` | **Título de la página** | **Exactamente uno** por archivo, justo debajo del frontmatter. Puede contener LaTeX inline (`# Vectores en $\mathbb{C}^n$`). |
| `## H2` | Secciones | El esqueleto temático. Title Case opcional; en la práctica se usa mayúscula inicial estilo oración o título según la materia — **elegir uno por vault y mantenerlo**. |
| `### H3` | Subsecciones | Detalle dentro de una sección. |
| `#### H4` | Excepcional | Solo si una H3 realmente lo necesita. Evitar bajar más. |

Reglas:

- **Nunca** dos `# H1`. **Nunca** saltar niveles (no pasar de `##` a `####`).
- El primer heading después del H1 es siempre un `## H2` (no `###`).
- Headings concisos, sin punto final, sin numeración manual (`## 1. …` solo si la materia lo usa como convención —MNA no lo hace en teoría—).
- La sección de cierre se llama **siempre** `## Ver también` (ver sección 9).

---

## 4. Definiciones, teoremas, observaciones (estilo CANÓNICO)

El estilo canónico es **blockquote con etiqueta en negrita y punto**. Es lo que ya usan los 7 vaults. **No** se usan callouts nativos.

### 4.1 Forma canónica (OBLIGATORIA)

```markdown
> **Definición.** Texto de la definición.
> $$formula$$

> **Teorema.** Enunciado.

> **Proposición.** Enunciado.

> **Observación.** Comentario.

> **Nota.** Aclaración o salvedad sobre la fuente.

> **Ejemplo.** Caso concreto.
```

Etiquetas canónicas (con punto final tras la palabra, en negrita): **Definición.**, **Teorema.**, **Proposición.**, **Lema.**, **Corolario.**, **Observación.**, **Nota.**, **Ejemplo.**, **Notación.**, **Cuidado:**, **Trampa:**, **Flag:** (las últimas tres usan dos puntos en vez de punto, siguiendo el uso real de Derecho/PAW).

Reglas:

- La etiqueta va **en negrita**, dentro del blockquote, seguida de punto (o dos puntos para avisos) y **un espacio**.
- Fórmulas dentro del bloque: cada línea del display va prefijada con `> `.
- Para varias entradas del mismo tipo, pluralizar la etiqueta: `> **Definiciones.**` y listar `i)`, `ii)`.
- Texto corto fuera de bloque (ejemplos, notaciones livianas) puede ir como párrafo con etiqueta en negrita sin blockquote: `**Observación.** …` — uso real en MNA. **Regla determinista:** si el contenido es un enunciado formal (definición/teorema/proposición) → **blockquote**; si es un comentario al margen → párrafo con etiqueta en negrita.

### 4.2 Callouts nativos (OPCIONAL, documentado, NO usar por defecto)

Obsidian soporta `> [!note]`, `> [!tip]`, `> [!warning]`. **No forman parte del estándar** (cero ocurrencias en los vaults). Solo se permiten si un vault adopta explícitamente la convención en su `CLAUDE.md`; en ese caso se documenta ahí y se usa de forma consistente. Por defecto: **blockquote con etiqueta en negrita**.

---

## 5. Wikilinks (enlaces internos)

| Forma | Cuándo |
|---|---|
| `[[pagina]]` | Página en la misma carpeta o sin ambigüedad. |
| `[[carpeta/pagina]]` | Página en otra subcarpeta del wiki (`[[teoria/03-matrices]]`). |
| `[[pagina\|texto visible]]` | Cuando el texto del enlace debe leer distinto del nombre del archivo (alias). |

Reglas de cuándo enlazar:

- Enlazar la **primera** mención relevante de un concepto que tiene página propia.
- No saturar: no re-enlazar el mismo destino en cada párrafo.
- El nombre dentro de `[[ ]]` es el **nombre de archivo sin `.md`** (kebab-case), no el título humano.
- Usar `|alias` cuando el destino sea kebab-case sin tildes pero el texto deba leerse natural (`[[teorema-central-del-limite|TCL]]`).
- La sección `## Ver también` agrupa los cross-links de navegación al pie (sección 9).

---

## 6. Matemática, tablas y código

### 6.1 LaTeX

- **Inline:** `$ ... $` para símbolos en medio de prosa: `el espacio $\mathbb{K}^n$ con norma $\|v\|_2$`.
- **Display:** `$$ ... $$` para fórmulas centradas en su propia línea. Una fórmula por bloque salvo que se alineen con `\quad`/`\qquad`.
- LaTeX es **fuerte** en MNA, Economía, Proba, SDS; **ausente** en Derecho e Inge2. En PAW `$...$` se usa para *código inline* (nombres de clase/anotaciones), no matemática. Respetar el uso de cada materia: **no introducir LaTeX donde la materia no lo usa**.
- Matrices con `\begin{pmatrix} … \end{pmatrix}`; conjuntos numéricos con `\mathbb{}`.

### 6.2 Tablas

- Markdown estándar con cabecera y fila de separación `|---|---|`.
- Alinear las pipes visualmente en el fuente cuando sea barato; el render no lo exige pero ayuda al diff.
- Usar para comparaciones, propiedades, clasificaciones. No abusar: una lista suele ser más clara que una tabla de una columna.

### 6.3 Bloques de código

- Siempre con **lenguaje declarado**: ` ```python `, ` ```java `, ` ```yaml `, ` ```bash `.
- Código inline con backticks simples: `` `variable` ``, `` `Clase` ``.

---

## 7. Naming de archivos y carpetas

- **kebab-case** SIEMPRE: minúsculas, palabras separadas por `-`. SDS es la excepción histórica (usa `_`); en vaults nuevos usar `-`.
- **Sin tildes ni ñ** en nombres de archivo (los títulos en el H1/frontmatter SÍ llevan tildes). `distribucion-normal.md`, no `distribución-normal.md`.
- **Prefijo numérico** `01-`, `02-` cuando el orden importa (teoría secuencial, unidades): `01-numeros-complejos.md`, `04-determinantes.md`. Sin prefijo cuando el orden es irrelevante (conceptos sueltos).
- **Carpetas temáticas** por tipo de contenido: `teoria/`, `clases/`, `guias/`, `resueltos/`, `parciales/`, `conceptos/`, `distribuciones/`, `teoremas/`, `tecnicas/`, `formularios/`, `fuentes/`. Cada vault usa el subconjunto que le aplica (ver `AUDIT.md` §3).
- Prefijos de familia: `guia-01-…`, `clase-AAAA-MM-DD`, `ip-tema-NN`, `final-tema-NN`, `fuente-…`, `unidad-N-resumen`.

---

## 8. Paleta, estilo visual y tono

- **Sin estilos visuales custom.** El look lo da Obsidian/el renderer; el estándar controla solo la estructura del Markdown.
- **Tono:** español rioplatense, técnico, conciso. Frases cortas. Voz impersonal o "se define / se dice" (estilo apunte), evitando la primera persona salvo en notas de criterio.
- **Énfasis:** **negrita** para etiquetas y términos clave en su primera aparición; *cursiva* con moderación. No subrayar, no MAYÚSCULAS para énfasis.
- **Listas:** `-` para no ordenadas; `1.` para pasos ordenados; `i)`, `ii)` para enumerar propiedades dentro de definiciones/teoremas (uso real de MNA).
- **Fidelidad a la fuente:** cuando se transcribe literalmente algo del material crudo que difiere del estándar habitual, agregar `> **Nota.**` explicando la salvedad (patrón real en MNA, ver `02-vectores-cn-rn.md` líneas 54 y 71).

---

## 9. Navegación

Tres niveles de navegación, en orden de proximidad:

1. **`## Ver también`** (al pie de cada página, OBLIGATORIO si hay páginas relacionadas). Lista de wikilinks con descripción corta:
   ```markdown
   ## Ver también

   - [[01-numeros-complejos]] — cuerpo base $\mathbb{C}$
   - [[03-matrices]] — generalización a arreglos $n \times m$
   ```
2. **Link al índice del vault.** El catálogo vive en `wiki/index.md` (o en la raíz para SDS). Las páginas no necesitan linkear el índice en cada una, pero `index.md` SÍ lista la página. Cuando convenga volver, usar `[[index]]`.
3. **Link a `HOME.md` del repo.** El repo publicable tiene un `HOME.md` raíz que enlaza los 7 vaults. El `index.md` de cada vault apunta de vuelta con `[[HOME]]` o ruta relativa al home del repo. Las páginas hoja **no** linkean a HOME directamente: la cadena es página → `index.md` del vault → `HOME.md` del repo.

Reglas:

- Cross-links inline (sección 5) para conexiones conceptuales dentro del cuerpo.
- "Ver también" para navegación lateral entre páginas hermanas/relacionadas.
- `index.md` y `log.md` se mantienen aparte: `index.md` cataloga, `log.md` es bitácora append-only con entradas `## [AAAA-MM-DD] <op> | <subject>`.

---

## 10. Template incrustado (referencia)

El template completo vive en `TEMPLATE_pagina.md`. Esqueleto mínimo:

```markdown
---
tags: [tipo, unidad-N, tema]
fuente: raw/ruta/fuente.pdf
unidad: N
tipo: teoria
actualizado: AAAA-MM-DD
---

# Título de la página

## Primera sección

> **Definición.** ...

### Subsección

Contenido con $LaTeX$ inline y display:

$$ formula $$

## Ver también

- [[pagina-relacionada]] — por qué importa
```

Fragmento del ejemplo lleno (ver `EJEMPLO_pagina.md` para la versión completa):

```markdown
# Producto interno y ortogonalidad en $\mathbb{K}^n$

## Producto interno

> **Definición.** Sean $u, v \in \mathbb{K}^n$. Se define el producto interno como
> $$\langle u, v \rangle = \sum_{i=1}^{n} u_i \, \overline{v_i}$$
```

---

## 11. Criterio de calidad — Checklist final de la página

Antes de dar por terminada una página, verificar **todos** estos puntos:

- [ ] El archivo abre con frontmatter `---` en la línea 1.
- [ ] `tags` presente, en kebab-case, primer tag = tipo de página.
- [ ] `fuente:`/`fuentes:` presente y no vacía.
- [ ] Claves del frontmatter en el orden canónico (sección 2.2).
- [ ] **Exactamente un** `# H1`, justo debajo del frontmatter.
- [ ] Jerarquía de headings sin saltos (`#` → `##` → `###`).
- [ ] Definiciones/teoremas en **blockquote con etiqueta en negrita** (`> **Definición.**`); **cero** callouts `[!type]`.
- [ ] LaTeX coherente con la materia (`$` inline, `$$` display); no se introdujo LaTeX donde la materia no lo usa.
- [ ] Tablas con cabecera + separador; bloques de código con lenguaje.
- [ ] Wikilinks con nombre de archivo correcto (kebab-case, sin `.md`); alias `|` donde haga falta.
- [ ] Nombre de archivo en kebab-case, sin tildes/ñ, con prefijo numérico si el orden importa, en la carpeta temática correcta.
- [ ] Separador `---` y sección `## Ver también` al pie con wikilinks descriptivos.
- [ ] Tono español rioplatense, conciso; cero callouts/Dataview/HTML de render.
- [ ] La página está listada en `wiki/index.md` y se registró la operación en `wiki/log.md`.

---

*Fin de DESIGN.md*
