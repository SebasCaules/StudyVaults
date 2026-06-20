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
| verificar y/o publicar el sitio | `studyvault-ship` |
| editar/sincronizar el estándar `DESIGN.md` | `studyvault-design` |

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
