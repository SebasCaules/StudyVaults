# StudyVaults ITBA — referencia de proyecto (contrato compartido de skills)

> Documento **canónico** que comparten todas las skills `studyvault-*` de este repo.
> No es una skill (no tiene `SKILL.md`): es el mapa de arquitectura + convenciones +
> trampas que cada skill referencia con un "leé esto primero". Si algo de acá choca
> con lo que ves en el código, **gana el código** — y avisá para actualizar este doc.

---

## 1. Qué es el proyecto

Repo **publicable** (`https://github.com/SebasCaules/StudyVaults`, público, en vivo en
**https://sebascaules.github.io/StudyVaults/**) que empaqueta **7 vaults Obsidian de estudio**
de ITBA + un planificador de electivas + un **sitio web Next.js** que renderiza todo.

Pilares (cada uno tiene su skill):

| Pilar | Qué es | Skill |
|---|---|---|
| **Contenido** | páginas `.md` de wiki por materia | `studyvault-page` |
| **Toolkits** | herramientas interactivas React por materia (`/[vault]/herramientas`) | `studyvault-toolkit` |
| **Hojas** | formularios/conceptos imprimibles (`/[vault]/hojas`) | `studyvault-sheet` |
| **Design system** | librería `@studyvaults/ui` | `studyvault-ui` |
| **Datos** | pipelines `scripts/build-*-data.mjs` desde los vaults | `studyvault-data` |
| **Ingesta** | material externo (PDFs/planillas/horarios) → repo + sitio | `studyvault-ingest` |
| **Operación** | verificar + publicar el sitio | `studyvault-ship` |
| **Estándar** | mantener `DESIGN.md` | `studyvault-design` |

---

## 2. Layout del repo

```
StudyVaultsITBA/
├── MNA/ Derecho/ Economia/ Proba/ PAW/ SDS/ Inge2/   ← los 7 vaults (wiki/ + index.md)
├── Electivas/                                          ← webapp + fuente de datos del planner
├── _estandar/                                          ← el estándar DESIGN.md + FEATURES_* + web/
├── site/                                               ← el sitio Next.js (todo lo "web" vive acá)
├── HOME.md  README.md  run.sh
└── .claude/skills/                                     ← estas skills
```

Cada vault: `wiki/` con `index.md` (catálogo) + subcarpetas temáticas. **Excepción SDS**:
`index.md` en la raíz del vault, no en `wiki/` (ver `contentRoot`/`indexPath` en `vaults.ts`).

### Constraints que NO se derivan del repo (memorizar)

- **Los vaults ORIGINALES externos (`~/Desktop/ITBA/26-1C/*_Obsidian`, `~/Desktop/ITBA/Electivas/`)
  son SOLO LECTURA.** Nunca se modifican; todo lo nuevo se copia al repo. Los `.md` y datos fuente
  dentro del repo (`<Vault>/wiki/`, `Electivas/data.js`) sí se editan acá.
- El repo está **despersonalizado** para publicación divulgativa: nada de legajos, nombres de equipo,
  notas, ni paths privados en contenido publicado. Conservado a propósito: nombre del proyecto
  "Rent The Slopes" (tema de PAW), jurista "Picasso, Sebastián" (fuente de Derecho), el handle
  `SebasCaules` del link al repo. **No reintroducir framing personal.**
- La convención `log.md` fue **ELIMINADA** (2026-06-18): no existe en ningún vault ni en el estándar.
  **No recrearla** — el loader globea `**/*.md` y la publicaría.

---

## 3. El sitio (`site/`) — arquitectura

**Next.js 16 (App Router), `output: 'export'` (static), Tailwind v4.** Deploy a GitHub Pages vía
`.github/workflows/deploy.yml` en cada push a `main`. **basePath `/StudyVaults`.**

> ⚠️ **`site/AGENTS.md`**: este Next.js tiene breaking changes vs. lo que conocés. **Leé la guía
> relevante en `node_modules/next/dist/docs/` antes de escribir código de Next.** Respetá deprecations.

### Pipeline de contenido (`site/lib/content/`)
- El `.md` **NO se duplica**: el build lo lee desde `../<Vault>/` (`REPO_ROOT = process.cwd()/..`,
  cwd = `site/`). `discover → parse → manifest` (cacheado en `globalThis` para no re-globbear en las
  ~800 páginas) → `render` con `unified` (un processor compartido por variante math on/off).
  `remark-wikilink.ts` custom resuelve wikilinks scoped al vault (ruta → alias/título/basename lower).
- **Math por-vault**: `$...$` es KaTeX en **MNA / Economia / Proba / SDS**; en **PAW** `$...$` es
  código EL/JSP → **math OFF**; **Derecho / Inge2** sin math. Config en `lib/content/vaults.ts`.
- **`globalThis` sobrevive HMR** → tras tocar el pipeline (`lib/content/*`) hay que **reiniciar** el
  dev server para ver el cambio.

### Registro único de materias — `site/lib/content/vaults.ts`
**Única fuente de verdad** para nav/portal/sidebar/rendering. Cada `VaultConfig` tiene flags clave:
- `math: boolean` — ¿`$...$` es LaTeX?
- `toolkit?: boolean` — ¿tiene `/[vault]/herramientas`? → debe matchear `TOOLKITS` en `vault-tools/registry.tsx`.
- `sheets?: boolean` — ¿tiene `/[vault]/hojas`? → debe matchear `SHEETS` en `vault-sheets/registry.ts`.
- `library?: boolean` — ¿tiene `/[vault]/biblioteca`? → debe matchear `LIBRARIES` en `vault-library/registry.ts`.
- `navByUnit?` / `unitLabels?` — sidebar del wiki agrupado por unidad (hoy lo usa Proba).
- `apps?: VaultApp[]` — apps HTML estáticas servidas bajo `/apps/<vault>/`.

VaultIds: `mna · derecho · economia · proba · paw · sds · inge2`.

### Rutas (`site/app/`)
`[vault]/page.tsx` (índice de materia) · `[vault]/[...slug]/page.tsx` (nota; guard que filtra
`herramientas` si `toolkit` y `biblioteca` si `library` — **ojo: NO filtra `hojas`**, gap conocido) ·
`[vault]/herramientas/page.tsx` (toolkit, `WikiLayout wide` sin TOC) · `[vault]/hojas/page.tsx`
(hojas) · `[vault]/biblioteca/page.tsx` (biblioteca de recursos, flag `library`) ·
`electivas/page.tsx` (**pseudo-landing** explicativa con CTA) · `electivas/planificar/page.tsx`
(la app real del planner) · `interno/ui/page.tsx` (showcase del DS, `robots: noindex`) ·
`page.tsx` (home, con grafo 3D en el hero) · `graph.json/route.ts` (data del grafo, build-time) ·
`robots.ts` · `sitemap.ts` · `not-found.tsx`.

### Planner y grafo (arquitectura post-overhaul 2026-07, commit `25b93b4`)
El planner vive en `components/planner/**` + `lib/planner/**`: estado de 2 niveles por materia
(`estado: "regular" | "final"`), cuatris lockeables (`lockedIdx`, respetado por `optimize.ts`),
combinador de finales con export `.ics`, DnD nativo HTML5, tabs Calendario→Roadmap→Minors.
El hero de la home es un grafo 3D de notas/wikilinks (`react-force-graph-3d` + `three`, data
build-time en `app/graph.json/route.ts`). Otras deps visuales: `d3-force`, `katex`, `mermaid`, `shiki`.

### Design system — `@studyvaults/ui` (`site/packages/ui/`)
Package privado del workspace (`workspaces: ["packages/*"]`, `transpilePackages` en `next.config.ts`,
se distribuye TS/TSX crudo). ~47 componentes en 6 categorías (`primitives/ layout/ navigation/
feedback/ forms/ data/`). El CSS del DS vive en `packages/ui/src/styles/` (split por componente,
orquestado por `index.css`); `app/globals.css` lo importa + define el `@theme inline` + CSS de
páginas (wiki/prose/home/search). Tokens §12 con roles conmutados por `[data-theme]`. Doc completa:
`site/packages/ui/README.md`. Showcase vivo: `/interno/ui`.

### Scripts de build (`site/scripts/`, corren en `predev`/`prebuild`)
`copy-assets.mjs` (imágenes → `public/vault-assets/`) · `build-planner-data.mjs`
(`../Electivas/data.js` → `lib/planner/data.json`, gitignored) · `copy-vault-apps.mjs` (HTML →
`public/apps/`). Los `build-*-data.mjs` de toolkits (p. ej. `build-derecho-data.mjs`) se corren
**a mano** y se commitea el `data.ts` resultante (ver `studyvault-data`).

---

## 4. Correr y verificar — `./run.sh`

```
./run.sh         dev: limpia cachés, regenera contenido, next dev en :3000 (hot-reload)
./run.sh build   build estático fiel a GH Pages: next build + pagefind, sirve /StudyVaults/
./run.sh clean   solo borra cachés y artefactos generados
```

`run.sh` **siempre limpia** (`rm -rf .next out … lib/planner/data.json`) antes de arrancar. Build
sano actual: **~802 páginas**, `tsc` limpio.

### Trampas de verificación (críticas)
- **CSS stale (Turbopack)**: cambios en `app/globals.css` o `packages/ui/src/styles/` pueden NO
  reflejarse aun reiniciando → **`rm -rf .next` y reiniciar** (o `./run.sh clean`) antes de concluir
  "no anduvo".
- **No corras `next build` con `next dev` prendido**: comparten `.next` → corrompe el dev server;
  los "parse errors" de HMR que aparecen así son stale.
- **`globalThis` cache**: cambios en `lib/content/*` (manifest/processors) sobreviven HMR → reiniciar.
- Verificación en browser vía **Claude Preview MCP** (`preview_*`); nunca pedirle al usuario que
  chequee a mano — verificá y mostrá evidencia (screenshot/console/build verde).

---

## 5. Publicar (operación git)

- **Workflow solo-autor, push directo a `main`** (sin PRs). Se commitea+pushea **solo cuando el
  usuario lo pide** ("pushea").
- **Commits SIN trailer `Co-Authored-By: Claude`** (es la convención explícita de este repo, distinta
  del default global). Mensajes a nombre del usuario.
- Push a `main` dispara el deploy a GitHub Pages (`deploy.yml`: `npm ci && npm run build`).
- `gh` autenticado como `SebasCaules`. Las URLs `sebascaules.github.io` / `SebasCaules/StudyVaults`
  son infraestructura de deploy: no se tocan.

---

## 6. El estándar DESIGN.md

Fuente de verdad del diseño de **contenido** (§0–§11: Markdown vanilla para las notas) + la **capa
de presentación web** (§12: tokens de color/tipografía del sitio). Existe en **3 copias que DEBEN
quedar byte-idénticas** (mismo md5):
1. master externa `~/Desktop/ITBA/_estandar/DESIGN.md`,
2. repo `_estandar/DESIGN.md`,
3. skill `.claude/skills/studyvault-page/assets/DESIGN.md`.

Estado al 2026-07-04: **las 3 copias están en sync** (byte-idénticas). No fijes el hash acá —
envejece con cada edición; verificalo con `md5` en el momento. Toda edición futura del
estándar debe replicarse a las 3 y re-verificar md5 idéntico. Procedimiento en `studyvault-design`.

§12 (estética web) es capa de **presentación del sitio únicamente**: las notas `.md` la **ignoran**
(siguen §0). Los tokens §12 deben mantenerse coherentes con `packages/ui/src/styles/tokens.css`.

---

## 7. Convenciones transversales (todas las skills)

- **Idioma**: contenido y código en **español rioplatense**; JSDoc/comentarios en español. Vaults que
  nacen en inglés (PAW, Inge2) mantienen su idioma en el contenido.
- **Static-export safe**: todo acceso a `window`/`localStorage` detrás de guards (`typeof window !==
  "undefined"`). Los toolkits/planner son islas cliente (`"use client"`) hidratadas sobre HTML estático.
- **No reinventar**: la presentación sale de `@studyvaults/ui` y los tokens §12; la lógica nueva va en
  helpers puros (`lib/`). No hardcodear hex — usar roles/`color-mix()`.
- **Determinismo + verificación**: la corrección es sagrada. Re-leer la fuente, verificar en el browser
  real, `tsc` + `next build` limpios antes de declarar algo hecho.
