---
name: studyvault-design
description: Mantené y extendé de forma segura el estándar de diseño DESIGN.md de StudyVaults (contenido §0-§11 + presentación web §12). Usala cuando el usuario pida "modificar/extender el estándar de diseño", "editar DESIGN.md", "agregar/cambiar una regla del estándar de páginas del vault", "sincronizar las copias de DESIGN.md", "verificar que las 3 copias de DESIGN.md coinciden", "cambiar los tokens §12 / la estética web del portal", "actualizar los companions FEATURES_* / TEMPLATE / EJEMPLO", o cualquier cambio a la fuente de verdad del formato de notas. NO genera páginas (eso es studyvault-page): esta skill MANTIENE el estándar que las demás consumen.
---

# studyvault-design

Esta skill mantiene **el estándar**, no escribe páginas. `studyvault-page` **consume** `DESIGN.md`
para generar notas; `studyvault-design` **edita y sincroniza** `DESIGN.md` y sus compañeros sin
romper a los consumidores. Antes de cualquier cambio leé el contrato del proyecto:
`.claude/skills/_shared/PROJECT.md` (sección 6 es el núcleo).

> **Regla de oro:** nunca edites una sola copia de `DESIGN.md`. El estándar vive en **3 copias que
> DEBEN quedar byte-idénticas** (mismo md5). Editar una y olvidar las otras desincroniza a
> `studyvault-page`. Toda edición termina con el check de sincronía verde (ver `assets/SYNC_CHECK.md`).

## La distinción clave: §0–§11 vs §12

`DESIGN.md` tiene dos capas con públicos distintos. Confundirlas es el error más caro.

| | **§0–§11 — estándar de CONTENIDO** | **§12 — capa de PRESENTACIÓN WEB** |
|---|---|---|
| Qué rige | el Markdown de las notas `.md` del wiki | la estética del portal/sitio Next.js |
| Público | las notas `.md` + la skill `studyvault-page` | el sitio `site/` + el showcase |
| Tecnología | Markdown vanilla (+ wikilinks + LaTeX) | tokens CSS, tipografía, temas light/dark |
| Las notas `.md` | **la aplican** | **la IGNORAN por completo** (siguen §0) |
| Espejo en código | — | `site/packages/ui/src/styles/tokens.css` |

Lo que esto implica al editar:

- **Tocás §0–§11** → cambiás el formato de las notas. Revisá si algún companion `FEATURES_*`,
  `TEMPLATE_pagina.md` o `EJEMPLO_pagina.md` queda desactualizado, y si el checklist §11 necesita
  un ítem nuevo. La skill `studyvault-page` empezará a aplicar la regla nueva en cuanto sincronices
  su copia de `DESIGN.md`.
- **Tocás §12** → cambiás la estética web. **No afecta ni una nota.** Pero §12 tiene un espejo real
  en código: `site/packages/ui/src/styles/tokens.css`. Si cambiás un token/hex/rol en §12, hay que
  reflejarlo en `tokens.css` (y viceversa), o la doc miente. El showcase visual vive en
  `_estandar/web/components.html` y en la app en `/interno/ui`.

> El propio §12 abre con un guardrail explícito (12.0 / "ALCANCE — LEER PRIMERO"): nada de §12 entra
> jamás en un `.md` — ni un `<div>`, ni un `style=`, ni un hex. Mantené ese límite intacto.

## La regla de las 3 copias

Las **3 copias byte-idénticas** de `DESIGN.md`:

1. `_estandar/DESIGN.md` — la del repo (fuente de trabajo).
2. `.claude/skills/studyvault-page/assets/DESIGN.md` — la que `studyvault-page` empaqueta para correr
   autocontenida (incluso fuera del repo).
3. `~/Desktop/ITBA/_estandar/DESIGN.md` — la **master externa** (fuera del repo; puede no existir).

Verificación rápida (las 3 deben dar el mismo hash):

```bash
md5 _estandar/DESIGN.md \
    .claude/skills/studyvault-page/assets/DESIGN.md \
    ~/Desktop/ITBA/_estandar/DESIGN.md
```

Detalle completo del check (incluyendo `diff` cuando difieren y qué hacer si la master no existe):
`assets/SYNC_CHECK.md`.

> **Estado actual conocido (verificar siempre, no asumir):** la **master externa estaba
> DESINCRONIZADA** tras la despersonalización del repo. Aún arrastra la convención `log.md`
> (eliminada) y paths privados tipo `26-1C/MNA_Obsidian/...`. Las dos copias del repo (1 y 2) sí
> coincidían entre sí. **Si vas a tocar el estándar, primero alineá la master a la versión del repo**
> (la del repo es la buena), después aplicá tu cambio a las 3. No copies la master hacia el repo:
> reintroducirías `log.md` y los paths privados.

## Constraints del estándar (no reintroducir)

- **`log.md` fue ELIMINADO** (PROJECT.md §2). No vuelve al estándar ni al checklist §11 ni a
  `FEATURES_indices-y-logs.md`. El loader del sitio globea `**/*.md` y lo publicaría.
- **Cero callouts `[!type]`** y **cero Dataview** por default en el estándar de contenido (§0,
  §4.2). Quedan documentados como "opcional, NO usar por defecto"; no los promuevas a default.
- **Repo despersonalizado**: nada de legajos/nombres/paths privados en el estándar. Conservados a
  propósito (no tocar): "Rent The Slopes", "Picasso, Sebastián", el handle `SebasCaules`.
- **El código gana** (PROJECT.md): si §12 y `tokens.css` discrepan, la verdad es el código; ajustá
  §12 para que lo describa, y avisá.

## Mapa de companions (qué actualizar junto con DESIGN.md)

Viven en `_estandar/`. Cada uno **profundiza** una sección de `DESIGN.md` sin repetirla; ante
conflicto, manda `DESIGN.md`. Si tu edición toca la sección de la izquierda, revisá el companion.

| Editás en DESIGN.md | Revisá / actualizá |
|---|---|
| §2 Frontmatter | `FEATURES_frontmatter.md` |
| §4 Definiciones/teoremas/callouts | `FEATURES_callouts-y-bloques.md` |
| §6 LaTeX / tablas / código | `FEATURES_formulas-y-codigo.md` |
| §5 + §9 Wikilinks / navegación | `FEATURES_navegacion.md` |
| §9 (último bullet) Índices | `FEATURES_indices-y-logs.md` |
| §1 / §2 / §10 (anatomía, esqueleto) | `TEMPLATE_pagina.md` y `EJEMPLO_pagina.md` |
| §11 Checklist | mantenelo en sync con cualquier regla nueva de §0–§10 |
| §12 Tokens / estética | `site/packages/ui/src/styles/tokens.css`, `_estandar/web/components.html`, `_estandar/web/COMPONENT_LIBRARIES.md`, `_estandar/web/README.md` |

Origen del estándar (contexto, no se edita por rutina): `_estandar/AUDIT.md`.

> **Alcance de la regla de las 3 copias:** SOLO `DESIGN.md` se replica a las 3 ubicaciones. Los
> companions `FEATURES_*`, `TEMPLATE_pagina.md` y `EJEMPLO_pagina.md` viven en `_estandar/`; la
> carpeta `studyvault-page/assets/` solo empaqueta `DESIGN.md` + `TEMPLATE_pagina.md` +
> `EJEMPLO_pagina.md` (no los `FEATURES_*`). Si editás `TEMPLATE`/`EJEMPLO`, sincronizá **esas dos**
> copias también (repo `_estandar/` + `studyvault-page/assets/`).

## Procedimiento para extender el estándar

1. **Leé primero.** `_shared/PROJECT.md` (§6), la sección de `DESIGN.md` que vas a tocar, y el
   companion correspondiente. Corré el check de sincronía (`assets/SYNC_CHECK.md`) para saber del
   estado de partida — si la master ya estaba desincronizada, anotalo.
2. **Decidí la capa.** ¿§0–§11 (contenido) o §12 (web)? Determina qué se sincroniza después.
3. **Editá `_estandar/DESIGN.md`** (la copia de trabajo del repo). Conservá estilo, numeración y el
   guardrail de §12.0. No introduzcas `log.md`, callouts/Dataview por default, ni paths privados.
4. **Replicá a las 3 copias** byte a byte. Lo más seguro es copiar el archivo, no re-editar a mano:

   ```bash
   cp _estandar/DESIGN.md .claude/skills/studyvault-page/assets/DESIGN.md
   cp _estandar/DESIGN.md ~/Desktop/ITBA/_estandar/DESIGN.md   # crea/alinea la master externa
   ```

5. **Verificá md5 idéntico** en las 3 (ver `assets/SYNC_CHECK.md`). No cierres hasta que los 3
   hashes coincidan.
6. **Actualizá companions / TEMPLATE / EJEMPLO** según el mapa de arriba (y sincronizá las copias de
   `TEMPLATE`/`EJEMPLO` en `studyvault-page/assets/` si las tocaste). Si agregaste una regla de
   contenido, sumá su ítem al checklist §11.
7. **Si tocaste §12**: sincronizá `site/packages/ui/src/styles/tokens.css`; revisá el showcase
   `_estandar/web/components.html` y `/interno/ui`. Verificá en el sitio (ver `studyvault-ship` /
   `./run.sh`) que la estética siga coherente.
8. **Cerrá con el checklist de sincronía** (abajo) y reportá el estado (md5 de las 3 copias).

## Checklist de sincronía (antes de cerrar)

- [ ] La capa correcta editada (§0–§11 contenido **o** §12 web), sin mezclar.
- [ ] Las **3 copias** de `DESIGN.md` con **el mismo md5** (`assets/SYNC_CHECK.md`).
- [ ] Master externa alineada a la versión del repo (sin `log.md`, sin paths privados).
- [ ] No se reintrodujo `log.md`, callouts `[!type]`/Dataview por default, ni framing personal.
- [ ] Companion(s) `FEATURES_*` correspondiente(s) actualizado(s) si aplicó.
- [ ] `TEMPLATE_pagina.md` / `EJEMPLO_pagina.md` coherentes (y sus 2 copias en sync) si aplicó.
- [ ] Checklist §11 incluye toda regla de contenido nueva.
- [ ] Si tocaste §12: `tokens.css` sincronizado y showcase/`/interno/ui` verificados.
- [ ] El estándar sigue describiendo lo que hace el código (si no, ganó el código → ajustar doc y avisar).
