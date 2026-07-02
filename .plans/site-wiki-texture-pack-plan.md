# Plan — Wiki del site con la estética del texture pack + code block "buen blog"

> Estado: **plan aprobado pendiente de arrancar**. Faltan 3 decisiones (§7).
> Objetivo: que `/[vault]/[...slug]` renderice con los componentes y la estética
> del texture pack (callouts, code blocks pulidos, figuras, headings con marcador),
> estandarizado en `DESIGN.md §12`, con el **bloque de código estilo blog: barra con
> lenguaje + botón copy-to-clipboard**.

---

## 1. Qué ya existe (reusar, no reinventar)

- **Pipeline** `site/lib/content/render.ts` — unified:
  `remarkParse → remarkGfm → remarkMermaid → remarkWikilink → [remarkMath] →`
  `remarkRehype → [rehypeKatex] → rehypeEnv → rehypeSlug → rehypeCollectToc →`
  `rehypeAutolinkHeadings → rehypePrettyCode(shiki, "github-dark-dimmed") → rehypeStringify`.
  Cacheado en `globalThis.__svProc` (2 variantes: math on/off).
- **Prosa** — clase `.prose-sv` en `site/app/globals.css` (~L427–699), inyectada por
  `site/components/wiki/Prose.tsx` vía `dangerouslySetInnerHTML`. La ruta que la usa es
  `site/app/[vault]/[...slug]/page.tsx` (server) → `<WikiLayout>` → `<Prose html={html}/>`.
- **Callouts (propio)** — `rehypeEnv` en render.ts convierte `> **Definición.** …` en
  `blockquote[data-env="def|thm|proof|ex|note|warn|intu"]`, ya estilados en globals.css
  (L524–596). **No** hay soporte `> [!tipo]` (Obsidian).
- **Syntax highlighting** — ya está (Shiki via `rehype-pretty-code`, `keepBackground:false`).
  El fondo del `<pre>` está **hardcodeado** `#1b1f24` en `.prose-sv pre` (L608–627).
  **No** hay botón copy en prosa.
- **@studyvaults/ui** (`site/packages/ui/src/`) — ya tiene `data/CopyButton.tsx`
  (isla cliente, `navigator.clipboard`), `data/CodeBlock.tsx` (solo `<pre>`), `layout/Note.tsx`.
  **No** hay `Callout` ni CodeBlock con copy acoplado.
- **Tokens §12** (`packages/ui/src/styles/tokens.css`) — coral `--accent #f47c59`,
  azul `--primary #92cff2`, `--accent-soft`/`--primary-soft`, Newsreader/JetBrains,
  `--r-card 8px`. Temas conmutados por `[data-theme]`.

## 2. El gap vs. el texture pack

| Pieza | Hoy | Objetivo |
|---|---|---|
| Code block | `<pre>` shiki pelado, fondo hardcode `#1b1f24`, sin barra/copy | Barra con **lenguaje + botón copy**, fondo por **token** (themea light/dark), estilo blog |
| Callouts | solo `> **Label.**` | + soporte **`> [!tipo]`** (Obsidian) → mismo sistema visual |
| Headings | h2 con border-bottom | + **rombo de acento** (`h2::before`) + kicker mono |
| Figuras | `<img>` con borde | `<figure>` + `<figcaption>` |
| Tags / inline / tablas | ya buenos | micro-ajustes para matchear el mock |

## 3. Decisión de arquitectura clave — el botón Copy (static-export safe)

**Híbrido build + una isla cliente** (sin flash, sin romper el export):

1. **Build — nuevo `rehypeCodeChrome`** en `render.ts`, **después** de `rehypePrettyCode`:
   envuelve cada `figure[data-rehype-pretty-code-figure]` y agrega una **barra**
   (`.wiki-code__bar`) con **pill de lenguaje** (de `pre[data-language]`) + un
   `<button class="wiki-code__copy">` (íconos copy/check inline, **sin handler** → HTML estático).
2. **Runtime — una isla `<CodeCopy>`** montada una vez en `[vault]/[...slug]/page.tsx`
   (o en `WikiLayout`): en `mount`, **un** listener delegado sobre `.prose-sv`; al click en
   `.wiki-code__copy` reconstruye el código crudo y copia con `navigator.clipboard` bajo guard,
   con estado "copiado". Reusa lógica/estilos de `CopyButton`.

⚠️ **Gotcha**: shiki renderiza líneas como grid de `<span data-line>`; para copiar el código
crudo hay que **unir los `[data-line]` con `\n`**, no usar `textContent` pelado.

**Extra "buen blog"**: pasar shiki a **tema dual** (`theme: { dark: "github-dark-dimmed",
light: "github-light" }`) y mover el fondo del code a un **token** `--code-bg` (light/dark),
para que el código respete el modo del sitio en lugar del `#1b1f24` fijo.

## 4. Plan por fases (archivos + skills)

**Fase 1 — Code block "buen blog" + copy** *(prioridad; lo pedido explícito)*
- `site/lib/content/render.ts`: `rehypeCodeChrome` (post pretty-code) + tema shiki dual.
- `site/packages/ui/src/data/CodeCopy.tsx`: isla delegada (o extender `CopyButton`). → **studyvault-ui**
- `site/app/globals.css`: `.wiki-code`, `.wiki-code__bar`, `__copy`; token `--code-bg` en
  `packages/ui/src/styles/tokens.css` (light/dark).
- `site/app/[vault]/[...slug]/page.tsx`: montar `<CodeCopy>`.

**Fase 2 — Callouts `[!tipo]`**
- `remarkCallout` en `render.ts` (entre `remarkWikilink` y `remarkRehype`):
  `> [!note] Título` → `blockquote[data-env]` reusando el **mismo** `rehypeEnv`/CSS.
  Mapear Obsidian↔env (note/tip→note, warning/caution→warn, info→ex, etc.).
- CSS: refinar `.prose-sv blockquote[data-env]` al look del mock (label mono, ícono opcional).

**Fase 3 — Pulido estético de prosa** *(solo presentación, cero cambio de contenido)*
- `globals.css .prose-sv`: rombo en `h2::before`, `figure`+`figcaption`, ajustes de
  tags/inline/tablas para matchear el mock.

**Fase 4 — Componentes en `@studyvaults/ui`** *(reutilizables fuera de prosa)*
- `layout/Callout.tsx` y CodeBlock con copy acoplado; registrar en barrel + showcase
  `/interno/ui`. → **studyvault-ui**

**Fase 5 — Estandarizar en DESIGN.md §12**
- Documentar code-block-con-copy, callouts `[!tipo]`, figuras; sincronizar las **3 copias**
  byte-idénticas. Ajustar el template de **studyvault-page**. → **studyvault-design**

**Fase 6 — Verificación**
- `tsc` + `next build` limpios (780+ páginas) + browser real (Claude Preview) sobre muestras:
  nota code-heavy (**PAW**), con math (**MNA/Proba**), con callouts (**Derecho**), light/dark,
  copy funcionando. → **studyvault-ship**

## 5. Riesgos / trampas (de PROJECT.md)

- `globalThis` cachea el processor → **reiniciar** el dev server tras tocar `render.ts`.
- CSS stale (Turbopack) → `rm -rf .next` (o `./run.sh clean`) antes de concluir "no anduvo".
- **Static-export safe**: `navigator`/`window` detrás de guards.
- Copy debe leer el **código crudo** (reconstruir de `[data-line]`), no los spans coloreados.
- No romper el build de 780 páginas ni el sistema env-callout existente.
- No correr `next build` con `next dev` prendido (comparten `.next`).

## 6. Orquestación sugerida

Fases 1+2+3 tocan archivos casi disjuntos (`render.ts` es el punto compartido → lo integra
el overseer). Fan-out posible: (A) code chrome + CodeCopy, (B) remarkCallout + CSS callouts,
(C) pulido `.prose-sv`. Verificación en browser real entre medio.

## 7. Decisiones pendientes (antes de implementar)

1. **Estilo del code block**: "buen blog" limpio (barra lenguaje + copy, fondo themeado —
   *recomendado*) vs. skeuomórfico **terminal** con dots como el mock.
2. **Callouts**: agregar soporte **`> [!tipo]`** (para que lo de Obsidian renderice igual)
   además del `> **Label.**` actual, o quedarse solo con el sistema actual.
3. **Alcance**: implementar las 6 fases de una, o arrancar por **Fase 1 (code block + copy)**.

---

## Anexo — pendiente aparte (fuera de este plan)

- **"Nodos sueltos" en el grafo**: revisar `graph.json` / `GraphExplorer` por nodos huérfanos
  (sin edges) y, si hace falta, un comando de limpieza + build limpio del sitio. Investigar
  aparte de este plan de estética.
