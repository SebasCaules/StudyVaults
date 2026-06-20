---
name: studyvault-ship
description: Verifica y publica el sitio web de StudyVaults (Next.js → GitHub Pages). Workflow operativo de dos fases. Usala cuando el usuario pida "verificar el sitio antes de publicar", "buildear/servir el sitio", "correr run.sh", "levantar el dev server", "chequear que no rompí nada", "pushear/publicar los cambios", "deployar a GitHub Pages", "subir a producción", "commitear (sin co-autoría de Claude)" o similar dentro del repo StudyVaults. Fase A (verificar) corre run.sh + Claude Preview MCP y muestra evidencia; Fase B (publicar) commitea SIN trailer Co-Authored-By y pushea directo a main — SOLO cuando el usuario lo pide explícitamente.
---

# studyvault-ship

Skill de **operación** del repo StudyVaults: cómo **verificar** el sitio localmente y cómo
**publicarlo** a GitHub Pages. Es el complemento operativo de las skills de contenido
(`studyvault-page`, `studyvault-toolkit`, `studyvault-sheet`, etc.): esas escriben, esta corre,
verifica y publica.

**Leé primero `_shared/PROJECT.md`** (mismo repo, en `.claude/skills/_shared/PROJECT.md`) —
especialmente §4 "Correr y verificar" y §5 "Publicar", que son el núcleo de esta skill. Si algo
del doc choca con lo que ves en el código, **gana el código**.

El trabajo se divide en **dos fases**:

- **Fase A — Verificar**: siempre, antes de declarar algo hecho o de publicar.
- **Fase B — Publicar**: **SOLO cuando el usuario lo pide explícitamente** ("pushea", "publicá",
  "subilo", "deployá"). Nunca pushees por iniciativa propia.

---

## Fase A — Verificar

El sitio vive en `site/` (Next.js 16, App Router, `output: 'export'`, Tailwind v4). Todo se maneja
con el script `./run.sh` de la raíz del repo, que **siempre limpia las cachés antes de arrancar**
(`rm -rf .next out tsconfig.tsbuildinfo public/{apps,electivas,vault-assets,pagefind}
lib/planner/data.json .preview`) para que nunca queden cambios viejos pegados.

### Modos de `./run.sh`

| Comando | Qué hace |
|---|---|
| `./run.sh dev` (o `./run.sh`) | dev server con **hot-reload** en `http://localhost:3000` (sin basePath) |
| `./run.sh build` | build estático **fiel a GitHub Pages** (`next build` + `pagefind`), servido en `http://localhost:3000/StudyVaults/` |
| `./run.sh clean` | solo borra cachés y artefactos generados |

`run.sh` instala deps con `npm ci` si falta `node_modules`. El build sirve bajo `/StudyVaults/`
porque en producción `next.config.ts` aplica `basePath: "/StudyVaults"` (solo cuando
`NODE_ENV === "production"`; en dev el sitio queda en la raíz).

### Procedimiento de verificación

1. **Elegí el modo.**
   - Cambios de **contenido/UI iterativos** → `./run.sh dev` (hot-reload, sin basePath, más rápido).
   - **Antes de publicar** o ante cualquier duda de paridad con producción → `./run.sh build`
     (corre `tsc`/`next build` reales + `pagefind`, sirve bajo `/StudyVaults/` igual que GH Pages).
     Esta es la verificación que vale para dar luz verde a un push.

2. **Corré `./run.sh` en background** (no bloquea la terminal) y esperá a que levante el server.

3. **Verificá en el browser con Claude Preview MCP** (`preview_*`). **Nunca le pidas al usuario que
   chequee a mano** — abrí la URL, sacá screenshot, revisá la consola y mostrá la evidencia:
   - `preview_start` apuntando a `http://localhost:3000` (dev) o
     `http://localhost:3000/StudyVaults/` (build).
   - `preview_screenshot` de las páginas tocadas.
   - `preview_console_logs` para confirmar **0 errores de consola**.

4. **Referencia de build sano**: **~802 páginas** generadas, `tsc` limpio, **0 errores de consola**.
   Si el número de páginas baja mucho o aparecen errores de TS/consola, algo se rompió.

5. **Mostrá evidencia** (screenshot + consola limpia + build verde) antes de concluir. La corrección
   es sagrada: re-leé la fuente, verificá en el browser real, `tsc` + `next build` limpios antes de
   declarar algo hecho.

### Trampas críticas (de PROJECT.md §4) — NO concluir "no anduvo" sin descartarlas

- **CSS stale de Turbopack**: cambios en `app/globals.css` o `packages/ui/src/styles/` pueden NO
  reflejarse aun reiniciando el dev server. Antes de dar por roto un cambio de estilos:
  `rm -rf site/.next` (o `./run.sh clean`) y reiniciá.
- **NUNCA corras `next build` con `next dev` prendido**: comparten la carpeta `.next` → corrompe el
  dev server. Los "parse errors" de HMR que aparecen así son **stale**, no bugs reales. Pará el dev
  server antes de buildear (o usá solo uno a la vez).
- **Cache `globalThis` del manifest**: cambios en `lib/content/*` (manifest/processors/wikilinks)
  **sobreviven al HMR**. Tras tocar el pipeline de contenido hay que **reiniciar** el dev server
  (`./run.sh` de nuevo) para ver el cambio.

---

## Fase B — Publicar (SOLO cuando el usuario lo pide)

> **NO publiques por iniciativa propia.** Commitear + pushear pasa **únicamente** cuando el usuario
> lo pide de forma explícita ("pushea", "publicá", "subilo", "deployá"). Si no lo pidió, frená en
> Fase A.

### Reglas duras del repo (memorizar)

- **Workflow solo-autor, push directo a `main`. SIN PRs.**
- **Commits SIN trailer `Co-Authored-By: Claude`.** Es la convención **explícita de ESTE repo**, que
  **anula** el default global del harness. Los mensajes van a nombre del usuario
  (`SebasCaules <sebastiancaules5@gmail.com>`). Está en la memoria del proyecto como
  `feedback-no-claude-coauthor`. **No agregar la línea `Co-Authored-By: Claude` jamás.**
- **Mensaje de commit descriptivo en español rioplatense**, primera línea concisa (qué cambió y por
  qué), opcional cuerpo con detalle.
- `gh`/`git` autenticados como `SebasCaules`. Remote `origin` =
  `https://github.com/SebasCaules/StudyVaults.git`. Las URLs `sebascaules.github.io` /
  `SebasCaules/StudyVaults` son infraestructura de deploy: **no se tocan**.

### Cómo dispara el deploy

Cada push a `main` que toque `site/**`, cualquier vault, `Electivas/**`, `_estandar/**` o el propio
`.github/workflows/deploy.yml` dispara **`.github/workflows/deploy.yml`**, que:

1. `actions/checkout` (trae vaults + Electivas + _estandar + site),
2. `setup-node` (Node 22, cache npm),
3. **`npm ci`** y **`npm run build`** (= `next build` con `output:export` + `pagefind --site out`)
   dentro de `site/`,
4. `touch out/.nojekyll`,
5. sube `site/out` como artefacto de Pages y `deploy-pages` lo publica.

En vivo: **https://sebascaules.github.io/StudyVaults/** (basePath `/StudyVaults`). El deploy tarda
unos minutos; podés seguirlo con `gh run watch` / `gh run list --workflow=deploy.yml`.

### Procedimiento de publicación

1. **Pre-push checklist** (ver `assets/PREPUSH_CHECKLIST.md`) — **build verde primero**:
   - Corré **`./run.sh build`** y verificá en browser (Fase A): ~802 páginas, `tsc` limpio,
     0 errores de consola, screenshot de lo que cambió.
   - `git status` — revisá qué se va a commitear.
   - `git diff` (y `git diff --staged`) — leé los cambios reales, no asumas.
   - **No commitees artefactos generados/gitignored**: `site/.next`, `site/out`,
     `site/lib/planner/data.json`, `site/public/{apps,electivas,vault-assets,pagefind}`,
     `node_modules`. Confirmá con `git status --ignored` si dudás.
   - Confirmá que estás en `main` (`git branch --show-current`).

2. **Commitear SIN co-autoría.** Agregá los archivos relevantes y commiteá con mensaje en español.
   **No incluyas el trailer `Co-Authored-By: Claude`.** Ejemplo:

   ```bash
   git add <archivos-relevantes>
   git commit -m "Economía: agrega calculadora de elasticidad al toolkit del 2.º parcial"
   ```

   Para mensajes multilínea, usá `-m` repetido (título + cuerpo) sin trailer de coautoría:

   ```bash
   git commit -m "Inge2: nueva hoja de estudio de patrones GoF" \
              -m "Agrega SheetPatterns con los 5 patrones del recu y la enlaza en el index."
   ```

3. **Pushear a `main`.**

   ```bash
   git push origin main
   ```

4. **Confirmar el deploy.** Seguí el workflow y avisá la URL en vivo:

   ```bash
   gh run watch          # o: gh run list --workflow=deploy.yml --limit 3
   ```

   Reportá al usuario el commit, el estado del workflow y el link
   `https://sebascaules.github.io/StudyVaults/`.

---

## Resumen de seguridad

- **Verificá siempre** (Fase A) antes de publicar; mostrá evidencia con Claude Preview MCP.
- **Publicá solo cuando te lo piden** (Fase B); push directo a `main`, sin PRs.
- **Nunca** agregues `Co-Authored-By: Claude` a los commits de este repo.
- **Nunca** commitees artefactos generados ni paths privados/personales (el repo está
  despersonalizado para publicación — ver PROJECT.md §2).
