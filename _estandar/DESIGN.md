# DESIGN.md — Estándar canónico de diseño de páginas (StudyVaults)

> Documento del **Designer de documentación**. Es la fuente de verdad de CÓMO se ve y se
> estructura una página `.md` del wiki publicable. El objetivo es **determinismo**: dos páginas
> generadas por separado, a partir del mismo material, deben salir **idénticas en estructura**.
>
> **Output en español rioplatense, conciso.** Los vaults originales son SOLO LECTURA: este
> estándar describe el formato del repo publicable, **nunca** modifica los vaults fuente.
>
> Calibrado contra el vault de referencia (MNA): ver `MNA/wiki/teoria/02-vectores-cn-rn.md`
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

El sitio web **sí los renderiza** cuando aparecen: `> [!tipo] Título` mapea al **mismo** sistema visual de cajas etiquetadas `blockquote[data-env]` que `> **Label.**` (`note/info→note`, `tip/hint→intu`, `warning/danger/error→warn`, `important/definition→def`, `theorem→thm`, `proof→proof`, `example→ex`; desconocido→`note`). Es decir: adoptar `[!tipo]` en un vault renderiza consistente con el resto — pero el estilo **canónico y por defecto sigue siendo `> **Label.**`** (ver §12.4).

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
- `index.md` se mantiene aparte: es el catálogo navegable de todas las páginas del vault, agrupado por secciones.

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
- [ ] La página está listada en `wiki/index.md`.

---

## 12. Estética web — capa de presentación (portal StudyVaults)

> **ALCANCE — LEER PRIMERO.** Esta sección **NO aplica a las notas `.md` del wiki.** Rige **únicamente** la presentación web / portal / sitio de StudyVaults: landing, showcase de componentes y el futuro sitio. Al **generar páginas del vault**, la skill `studyvault-page` debe **IGNORAR esta sección por completo**: no es input, no es referencia, no existe para ese flujo. Las notas siguen siendo **Markdown vanilla** según el **Principio 0** (sección 0): cero callouts, cero Dataview, **cero HTML/CSS** salvo comentarios `<!-- -->`. Ni un `<div>`, ni un `style=`, ni un token de color entra jamás en una nota. Si estás escribiendo una nota y dudás, esta sección **no te concierne** — saltala. El CSS que aparece más abajo está permitido **solo** porque vive en la capa web (HTML/CSS real), nunca en `.md`.

Estética visual derivada del template Neuform **"Premium Agency Portal — Technical Split"** (autor: Meng To / @mengto). El sistema tiene **dos temas conmutables por toggle — dark (por defecto) y light** (ver 12.9). La **firma** es invariante en ambos: el coral `#F47C59` es siempre **acento** (nunca el canvas), display serif Newsreader y metadata mono. El canvas dark es un oscuro **sobrio y aclarado** (no negro puro); el light, un off-white cálido. Los paneles se elevan sobre el canvas y los neutros se derivan de la paleta.

### 12.1 Tokens de color

| Token | Hex | Rol |
|---|---|---|
| `--primary` | `#92CFF2` | Azul claro: links, focos, acentos secundarios, detalles |
| `--accent` | `#F47C59` | Coral: CTA principal, énfasis |
| `--background` | `#F47C59` | Coral: **acento de realce** (CTA, foco visual). El canvas de página **no** es coral — es `--surface` |
| `--surface` | `#241208` | Marrón casi negro: **ancla de tinta** (sombras, texto en light, on-accent) + base estructural |
| `--brown-soft` | `#382519` | Marrón cálido aclarado: **superficies del tema oscuro** (cards `#382519` / canvas `#4C3A30` / elevado `#54463E`) |
| `--secondary` | `#382519` | Marrón cálido (rol estructural, tema oscuro) |
| `--text-primary` | `#FFFFFF` | Texto principal (sobre surface o coral) |
| `--text-secondary` | `#A1A1AA` | Texto secundario / metadata atenuada |
| `--border` | `#27272A` | Bordes de cards, controls, divisores |
| `--status-go` / `--status-promo` / `--status-warn` / `--status-caution` | `#46A86E` / `#2F9F8F` / `#D8B279` / `#D68F85` | Estados semánticos (éxito·verde / promociona·teal / aviso·ámbar / conflicto·rojo). Relleno/borde/ícono a baja opacidad, nunca texto sobre superficie |

**Roles.** Los tokens de **rol de color se conmutan por tema** (ver 12.9). En **dark** las superficies son un **marrón cálido aclarado y parejo**: cards `--surface = #382519` (`--brown-soft`), canvas `--background ≈ #4C3A30` (`color-mix(in srgb, var(--brown-soft) 90%, #FFFFFF)`) y elevado `≈ #54463E` — la tinta profunda `#241208` se reserva para sombras / on-accent / texto en light. En **light**, un off-white cálido. Los paneles/cards se elevan sobre el canvas con un derivado `--surface-2` + borde 1px `--border`. El **coral `#F47C59` es acento** —CTA, palabra de realce del hero, objeto focal, dots de estado—; el azul `#92CFF2` es acento secundario y focos (oscurecido en light para contraste). **No se inventan colores nuevos**: los neutros de cada tema se derivan vía `color-mix` de las hex base (6 + `--brown-soft`); los `--status-*` son los únicos semánticos.

### 12.2 Tipografía

Google Fonts: **Newsreader** (display + body) y **JetBrains Mono** (label/mono), con fallbacks de sistema.

| Rol | Familia | Tamaño | Line-height | Weight | Extra |
|---|---|---|---|---|---|
| Display / Hero | Newsreader, serif | 64px | 1.04 | 500 | letter-spacing 0 |
| H2 | Newsreader, serif | 40px | 1.1 | 500 | escala del hero |
| H3 | Newsreader, serif | 28px | 1.2 | 500 | escala del hero |
| Body | Newsreader, serif | 16px | 1.6 | 400 | — |
| Label / Mono | JetBrains Mono, monospace | 12px | 1.2 | 600 | metadata técnica, eyebrows, badges, coords |

El estilo mono se usa para señal técnica tipo `SYS.01 // Topo_Eval Coords: 34.05N`: eyebrows, IDs de sección, coordenadas, badges. Display y body en Newsreader; el contraste serif/mono es parte de la identidad.

### 12.3 Espaciado y radios

Escala de **8**:

| Token | Valor | Uso |
|---|---|---|
| `--space-base` | 8px | unidad base |
| `--space-gap` | 16px | gap entre elementos |
| `--space-card` | 24px | padding interno de cards/paneles |
| `--space-section` | 80px | padding vertical de secciones |

Radios:

| Token | Valor | Uso |
|---|---|---|
| `--radius-card` | 8px | cards, paneles |
| `--radius-control` | 8px | botones, inputs, code blocks |
| `--radius-pill` | 9999px | badges/pills, nav pills |

### 12.4 Componentes

Lenguaje común: mismo radio (8px en cards/controls, full en pills), borde `--border` de 1px, paneles elevados (`--surface-2` derivado) sobre el canvas oscuro `--surface`, texto blanco.

- **Cards.** panel elevado `--surface-2` (derivado de `--surface` vía `color-mix` con `#FFFFFF`) sobre el canvas oscuro, `--radius-card` 8px, borde 1px `--border`, padding `--space-card` 24px. Hover: **lift** (`translateY(-4px)` + sombra). No se aplanan a un grid genérico — se preserva densidad, jerarquía y el objeto focal.
- **Buttons.** `--radius-control` 8px. **Primario (CTA):** fondo `--accent` coral, texto `surface`/blanco. **Secundario:** outline 1px `--border` sobre `surface`, texto blanco. Hover: lift `translateY(-4px)` + sombra; transición suave. Mismo radio/borde que cards y badges.
- **Badges / Pills.** `--radius-pill` (full). Mono 12px/600. Variante outline (`--border`) o acento (azul `--primary` / coral). Para eyebrows y metadata técnica.
- **Nav.** Navbar en `surface`, sticky; ítems en mono o body chico; pills full-radius para el estado activo; acento azul `--primary` en hover/focus.
- **Code.** Bloques de código con **chrome de terminal**: barra superior con tres dots (semáforo mac: `#ff5f56`/`#ffbd2e`/`#27c93f`), **pill de lenguaje** (mono, se omite si el fence no declara lenguaje) y **botón copy** a la derecha; cuerpo en fondo oscuro **fijo** (`--code-bg`, igual en light y dark — es un terminal), JetBrains Mono, syntax highlighting Shiki. En la wiki lo aplica `rehypeCodeChrome` (post rehype-pretty-code) + la isla cliente `CodeCopy` (un listener delegado que reconstruye el código crudo uniendo los `span[data-line]` con `\n`, no `textContent` pelado). Como componente reusable: `CodeBlockChrome` en `@studyvaults/ui`. Inline code en mono con leve fondo.
- **Callouts / entornos.** Definiciones, teoremas, notas y avisos se pintan como cajas etiquetadas `blockquote[data-env]` (`def`/`thm`/`proof`/`ex`/`note`/`intu`/`warn`): barra de color por tipo + label run-in en negrita. La wiki las genera desde el estilo canónico `> **Label.**` **o** desde `> [!tipo]` estilo Obsidian — **ambas rutas mapean al mismo sistema visual** (ver §4.2). Como componente reusable: `Callout` en `@studyvaults/ui`.
- **Headings / figuras.** `h2` con **rombo de acento** (`◆` coral) antes del título, sobre el `border-bottom` de sección. Imágenes envueltas en `<figure>` con `<figcaption>` opcional.
- **Table.** Cabecera en mono/atenuada (`--text-secondary`), filas separadas por borde `--border` de 1px (sin zebra pesado), texto body blanco.
- **Forms.** Inputs `surface`, borde 1px `--border`, `--radius-control` 8px, texto blanco, placeholder `--text-secondary`. **Focus:** anillo/borde azul `--primary` (`#92CFF2`).

### 12.5 Motion

Suave y contenido. Easing `cubic-bezier(0.22, 1, 0.36, 1)`, duración **300–700ms**.

- **Masked reveal** en headings y secciones (`clip-path` / `translateY` + `mask`).
- **Staggered entrance**: las cards entran escalonadas (delay incremental).
- **Hover lift**: `translateY(-4px)` + sombra en cards y botones.
- **Scroll-triggered**: `IntersectionObserver` agrega la clase `.in-view` al entrar al viewport.
- **Ambient movement**: capa de gradiente/canvas detrás del contenido, lenta, performante, secundaria.

Toda animación respeta `prefers-reduced-motion`: si está activo, se desactivan reveals, stagger, lift y ambient (estado final inmediato).

### 12.6 WebGL / efectos ambient

Una **única** capa ambient (gradiente animado o canvas liviano) **detrás** del contenido, **nunca encima**. Requisitos: performante (sin jank, idealmente `requestAnimationFrame` con cap), responsive, y consciente de `prefers-reduced-motion` (se congela o desactiva). Es decorativa y secundaria: jamás compite con el texto ni reduce el contraste del contenido sobre `surface`.

### 12.7 Guardrails

Del spec Neuform — **no negociables**:

- **No aplanar** a un grid genérico de cards: se preserva la composición, la densidad y el objeto focal.
- **No cambiar la firma**: el coral (`--accent`) es siempre **acento**, nunca el canvas. El toggle light/dark conmuta los **neutros** (canvas + paneles + texto) pero mantiene la firma (coral de acento, serif display, mono técnico). El canvas nunca es coral.
- **Preservar la señal del primer viewport**: el hero mantiene jerarquía display + mono y su objeto focal.
- **Lenguaje consistente**: botones, cards y badges comparten radio y borde.
- **El ambient va detrás**, siempre; el contenido manda.
- **Accesibilidad**: contraste alto (blanco sobre `surface`), focos visibles en azul `--primary`, `prefers-reduced-motion` respetado.
- **Recordatorio de límite**: nada de esto toca las notas `.md` (sección 0 / 12.0).

### 12.8 Implementación y archivos

Tokens como CSS copy-paste (capa web — permitido aquí, **nunca** en `.md`). El `:root` de abajo lista la **paleta base**; los tokens de **rol de color** (canvas, superficies, texto, bordes) se conmutan por tema en bloques `[data-theme="dark"]` / `[data-theme="light"]` — ver 12.9. En el showcase real `--background` es el **canvas** (no el coral).

```css
:root {
  /* Color */
  --primary:        #92CFF2;
  --accent:         #F47C59;
  --background:     #F47C59;
  --surface:        #241208; /* ancla de tinta: sombras, on-accent, texto en light */
  --brown-soft:     #382519; /* superficies del tema oscuro (cards) */
  --secondary:      #382519;
  --text-primary:   #FFFFFF;
  --text-secondary: #A1A1AA;
  --border:         #27272A;
  --surface-2:      color-mix(in srgb, var(--brown-soft) 84%, #FFFFFF); /* panel elevado sobre el canvas oscuro */

  /* Estados semánticos */
  --status-go:      #46A86E; /* verde: éxito / final aprobado */
  --status-promo:   #2F9F8F; /* teal: promociona / sin final */
  --status-warn:    #D8B279; /* ámbar: aviso */
  --status-caution: #D68F85; /* rojo: conflicto */

  /* Tipografía */
  --font-display: "Newsreader", Georgia, "Times New Roman", serif;
  --font-body:    "Newsreader", Georgia, serif;
  --font-mono:    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, monospace;

  /* Espaciado (escala de 8) */
  --space-base:    8px;
  --space-gap:     16px;
  --space-card:    24px;
  --space-section: 80px;

  /* Radios */
  --radius-card:    8px;
  --radius-control: 8px;
  --radius-pill:    9999px;

  /* Motion */
  --ease-out:    cubic-bezier(0.22, 1, 0.36, 1);
  --dur-fast:    300ms;
  --dur-slow:    700ms;
}
```

Archivos de referencia:

- **`_estandar/web/components.html`** — showcase de referencia: implementa cards, buttons, badges, nav, code, table y forms con estos tokens. Es la fuente de verdad visual de la capa web.
- **`_estandar/web/COMPONENT_LIBRARIES.md`** — librerías y dependencias (fuentes, helpers de motion / IntersectionObserver, capa ambient WebGL/canvas) usadas por el portal.

### 12.9 Temas (light / dark)

La capa web tiene **dos temas** conmutables; el **dark es el default**. La firma (coral de acento, serif display, mono técnico) es idéntica en ambos: solo cambian los **neutros** (canvas, superficies, texto, bordes) y el azul de links/focos.

- **Mecánica.** Atributo `data-theme="dark"|"light"` en `<html>`. La elección persiste en `localStorage` (clave `sv-theme`) y se aplica en un `<script>` al inicio del `<head>` **antes de pintar** (sin flash). Toggle sol/luna en navbar + menú mobile (`aria-label`, `aria-pressed`). Transición suave, guardada por `prefers-reduced-motion`. Primera visita sin elección → **dark**.
- **Tokens por tema.** Las hex base (6 + `--brown-soft`) viven en `:root`; los tokens de **rol** (`--background`, `--surface`, `--surface-2/3`, `--text-*`, `--border`, hairlines, sombras, glows, ring de focus) se definen dentro de `[data-theme="dark"]` y `[data-theme="light"]`, **derivados 100%** por `color-mix`/alpha de esas bases. No se introduce ningún hex de color nuevo (salvo los `--status-*`, fijos en ambos temas).
- **Dark (default).** Superficies de **marrón cálido aclarado y parejo** ancladas en `--brown-soft #382519`: cards `--surface = #382519`, canvas `--background = color-mix(in srgb, var(--brown-soft) 90%, #FFFFFF)` (≈ `#4C3A30`), elevado `--surface-2 ≈ #54463E` (heads/inputs `--surface-3` un paso más claro). La tinta profunda `#241208` queda para sombras / on-accent. Texto blanco; acentos coral/azul.
- **Light.** Canvas off-white cálido (`color-mix(in srgb, #FFFFFF 96%, var(--surface) 4%)`); paneles blancos con borde claro derivado y sombras grises suaves. Texto `--text-primary = #241208`, secundario gris cálido derivado. El coral se mantiene; el **azul `#92CFF2` se oscurece** para links/focos/código (`color-mix` con `#241208`) por contraste sobre claro.
- **Accesibilidad.** Contraste **AA** medido en ambos temas; el ring de focus tiene color por tema para que sea siempre visible. La capa ambient adapta su alpha por tema (sutil en light).
- **Foundations.** Los swatches del style guide muestran las **6 hex base** en cualquier tema.

---

*Fin de DESIGN.md*
