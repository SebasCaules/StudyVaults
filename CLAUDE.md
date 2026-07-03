# StudyVaults ITBA — directrices del proyecto

> Instrucciones de proyecto para Claude Code. Se cargan en cada sesión sobre este repo.
> (El loader del sitio ignora `CLAUDE.md`, así que este archivo nunca se publica como nota.)

## Directriz general: usar las skills del proyecto

Este repo tiene una **suite de skills** en `.claude/skills/` que encapsulan sus workflows
repetibles. **A partir de ahora, para cualquier tarea que caiga en uno de estos workflows,
invocá la skill correspondiente en vez de improvisar** — garantizan determinismo, siguen el
estándar del repo y verifican el resultado.

Antes de trabajar en el sitio o el estándar, **leé `.claude/skills/_shared/PROJECT.md`** (contrato
común: arquitectura + convenciones + trampas). Índice de la suite: `.claude/skills/README.md`.

| Si la tarea es… | Usá la skill |
|---|---|
| crear/editar una página `.md` de wiki | `studyvault-page` |
| armar/extender una tool interactiva (`/[vault]/herramientas`) | `studyvault-toolkit` |
| armar/extender una hoja imprimible (`/[vault]/hojas`) | `studyvault-sheet` |
| agregar/modificar un componente de `@studyvaults/ui` | `studyvault-ui` |
| escribir un pipeline `scripts/build-*-data.mjs` | `studyvault-data` |
| ingestar material externo (PDFs/planillas/transcripts/horarios) al repo y al sitio | `studyvault-ingest` |
| verificar y/o publicar el sitio | `studyvault-ship` |
| editar/sincronizar el estándar `DESIGN.md` | `studyvault-design` |

**Triggers de lenguaje natural** (frases mías que rutean directo a una skill, sin improvisar):
- "pushea todo" / "push everything" / "commitea y pushea" ⇒ `studyvault-ship`. Si digo
  **"no chequees"**, saltá la Fase A (verificación) y andá directo a commit+push.
- "no veo los cambios" / "sigue igual en localhost" ⇒ NO debuggear a mano: `./run.sh` (dev) o
  `./run.sh build` (estático) — ambos limpian `.next` y cachés; esa es siempre la primera respuesta.
- "bajá/ingestá estos PDFs/planillas/horarios" ⇒ `studyvault-ingest`.

Si una tarea no calza en ninguna, trabajá normal — pero respetando las convenciones de
`PROJECT.md`. Si detectás un workflow repetible nuevo que merezca su skill, proponé crearla.

## Reglas duras siempre vigentes (resumen; detalle en PROJECT.md)

- **Vaults originales externos = SOLO LECTURA.** Todo lo nuevo se copia al repo.
- **Commits SIN trailer `Co-Authored-By: Claude`** (convención de este repo). Push directo a `main`,
  **solo cuando el usuario lo pide**. Push a `main` dispara el deploy a GitHub Pages.
- `DESIGN.md` existe en **3 copias byte-idénticas** (repo `_estandar/`, skill `studyvault-page/assets/`,
  master `~/Desktop/ITBA/_estandar/`): toda edición se replica a las 3 (lo maneja `studyvault-design`).
- **No reintroducir** framing personal (despersonalizado) ni la convención `log.md` (eliminada).
- **Static-export safe**: `window`/`localStorage` siempre detrás de guards.
- Antes de declarar algo hecho: `tsc` + `next build` limpios y verificación en el browser real.

## Reglas operativas (nacidas de la auditoría de sesiones 2026-07)

- **Rutas absolutas SIEMPRE en Bash.** El cwd se resetea entre llamadas: jamás `cd site && …`
  ni `cd Electivas && …` relativos. Prefijo canónico: `/Users/sebastiancaules/Desktop/ITBA/StudyVaultsITBA/`.
- **Verificación visual**: NUNCA usar el Chrome del usuario (`mcp__claude-in-chrome__*`) salvo que
  lo pida explícitamente en el turno. Verificar con Claude Preview contra el server correcto:
  `site` (dev con hot-reload) o `site-static` (build estático servido en `/StudyVaults/`).
  Las rutas `/[vault]/…` SOLO renderizan en el build estático — verificarlas ahí, nunca en dev.
  Si `preview_eval` falla con "Inspected target navigated or closed", re-adjuntarse a la página
  UNA vez y reintentar; no loopear.
- **Sesiones concurrentes**: este repo suele tener varias sesiones abiertas. Commitear temprano y
  seguido; jamás `git checkout -- <paths>` / `git clean` sobre archivos que esta sesión no creó.
  Después de que un subagente escriba un archivo, hacer `Read` antes de cualquier `Edit`.
- **Fuente de verdad de horarios de electivas**: `Electivas/horarios.json`. Leerlo antes de razonar
  sobre superposiciones, días o comisiones — nunca desde texto pegado o memoria.
- **Archivos entrantes/generados**: van a su lugar canónico (`<vault>/raw/`, `site/public/…`, o el
  scratchpad de la sesión). Nunca sueltos en `~/Desktop/ITBA/` ni quedarse en `~/Downloads/`.
- **Esperas**: nunca `sleep` en foreground; cargar `Monitor` vía ToolSearch (`select:Monitor`) y usar
  un until-loop. **Descargas masivas**: siempre scripteadas (curl/gdown + manifiesto), jamás archivo
  por archivo vía browser.
- **Tras una interrupción (Esc)**: resolver primero la objeción que la causó; nunca re-emitir la
  misma pregunta/acción idéntica.
