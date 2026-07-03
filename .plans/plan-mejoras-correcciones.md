# Plan — mejoras y correcciones (funcional)

> 2026-07-03 (v2, con auditoría integrada). Fuente: auditoría de 4 agentes solo-lectura
> (portal/UI · planner · hojas/toolkits/pipelines · directivas) sobre el árbol post-overhaul
> `25b93b4`. Los hallazgos ALTO fueron re-verificados por el overseer leyendo el código.
> Ejecutar con las skills del repo; nada está "hecho" sin `tsc` + `./run.sh build` + browser.
> Marcados **[WIP]**: tocan archivos que otra sesión está editando (grafo 3D / finales) —
> coordinar antes de tocar. `tsc --noEmit` limpio al 2026-07-03.

## P0 — Verificación integral del overhaul
1. **Ship Fase A completa**: `./run.sh build` + recorrida browser (dark+light) de los módulos
   vs mockups, con screenshots. Hacerla cuando aterrice el WIP vivo (grafo 3D + finales).
2. Coordinar con las sesiones activas antes de cualquier build (comparten `.next`).

## P1 — Bugs confirmados (alto)
1. **Tema claro ilegible en CommissionSelect** — `packages/ui/src/styles/forms.css:59`:
   `option { color: var(--text-primary); background: var(--surface) }` y en light ambos
   resuelven a `--hex-brown` → texto invisible. Fix: fondo `var(--surface-2)`. ✅ verificado.
2. **DnD pisa cuatris finalizados** — `components/planner/views/PlanView.tsx:456-461`: el
   `onDrop` de SemCard dispara `PLAN_SET_FIXED` sin chequear `locked`. ✅ verificado.
3. **Roadmap ignora `lockedIdx` por completo** — PlanView.tsx:736-953/2129-2144: draggable,
   acepta drops, permite `PLAN_POOL_REMOVE` y no muestra candado en cuatris finalizados.
4. **Las electivas nunca llegan a `estado:"final"`** — ElectivasView.tsx:175 y
   DetailDrawer.tsx:551 usan `TOGGLE_APPROVED` binario; `EstadoControl` solo está en
   CuatriView → toda electiva aprobada queda como final-pendiente PARA SIEMPRE en la tab
   "Combinación de finales" (rows = `approved && !finalDone`). El mockup `module-f-checks`
   sí incluye electivas. Fix: `EstadoControl` en ElectCard/DetailDrawer. ✅ verificado.
5. **[WIP] Tooltip del grafo 3D ilegible en light** — globals.css:956-960, mismo choque
   brown-sobre-brown (avisar a la sesión del grafo).

## P1b — Bugs medios (estado/locks/persistencia)
1. "Guardar preferencia" ofrece cuatris lockeados como destino — CombinadorView.tsx:355-382.
2. Desbloquear un cuatri borra TODOS los pines de ese índice, incl. los manuales previos —
   state.tsx:317-320. Fix: recordar qué pines agregó el lock y liberar solo esos.
3. Migración `finalDone = new Set(approved)` mete promocionables/sin-final (muestran ✓✓
   en vez de tilde terminal) — state.tsx:52,141. Fix: filtrar con `tieneFinal(code)`.
4. `plan_finales_combo_v1` corrupto en localStorage hace throw en el reducer (la ruta
   localStorage no pasa por `parseFinales`) — persist.ts:63-70 + state.tsx:145-153.
5. Guard de rutas incompleto: `/[vault]/[...slug]` no filtra `hojas` (sí herramientas y
   biblioteca) — app/[vault]/[...slug]/page.tsx:24-30. Latente. ✅ patrón verificado.
6. **`three` phantom dependency** — se importa directo en ForceGraph3DInner pero no está en
   `package.json` (llega hoisted); riesgo ante `npm ci`/dedupe. Fix: declararla. ✅ verificado.

## P1c — Bugs medios (finales / .ics / export) **[WIP: coordinar con sesión de finales]**
1. Dos finales el MISMO día sin superponerse no generan ningún aviso (`prep = -1` descartado)
   — FinalesCombinadorView.tsx:228-240.
2. .ics sin `TZID`/`VTIMEZONE` (hora flotante: se corre si el calendario no está en TZ
   Argentina) — FinalesCombinadorView.tsx:350-357. + UID incluye la fecha (editar fecha y
   re-importar duplica el evento, :354) + sin folding RFC 5545 (:333-375).
3. `texEscape` manda tipográficos a modo math: `—`→`$---$` (imprime −−−), `–`, `’`, `“` —
   exporters.ts:83; ~118 ocurrencias en data de paw/inge2/mna/economia/proba.
4. Meta-note del export multi-cuatri dice siempre "minimiza cuatrimestres" aunque el método
   sea dias/balance — exportPlan.ts:876-879.

## P2 — Correcciones menores y perf
1. **Reset de aprobadas: texto personal Y falso** — Sidebar.tsx:230-233 describe el avance
   del autor ("1.º a 3.º + economía…") violando la despersonalización, y `aprobadasDefault`
   es `[]` → el confirm miente. Fix: "¿Restablecer todas las materias a pendiente?".
2. `recommendElectives(…, Infinity)` corre `optimizePlan` por ~90 candidatas en cada cambio,
   incluso con el recomendador oculto — PlanView.tsx:1589-1605. Gatear con `recOn` + memo.
3. Selects de "fijar cuatri" inconsistentes: 8 opciones (Roadmap/pool) vs 12 (combinador) vs
   N=14 del optimizer — PlanView.tsx:904,1410 / CombinadorView.tsx:361. Helper único.
4. Tablist del PlanView sin flechas de teclado (roving tabindex sin onKeyDown): Roadmap y
   Minors inalcanzables por teclado — PlanView.tsx:1993-2024. + Modales del planner sin
   focus-trap/foco inicial (DetailDrawer.tsx:504-510, IOModal, MinorsModal, ResetConfirm).
5. PlannerIntro: autoplay no se reinicia al click manual (pisa la elección a los ≤3.4s) y
   tablist ARIA incompleto — PlannerIntro.tsx:96-121.
6. `CopyButton` emite clase `copied` pero el CSS espera `.is-copied` → feedback visual del
   chrome de código nunca aplica — packages/ui/src/data/CopyButton.tsx:61 vs globals.css:685.
7. WikiRail: cerrar el drawer en mobile persiste `"0"` y deja el rail colapsado en desktop —
   WikiRail.tsx:98-125. No persistir cierres en modo drawer.
8. Sitemap sin `/herramientas/`, `/hojas/`, `/biblioteca/` — app/sitemap.ts:10-16.

## P3 — Deuda técnica (barridas)
1. **Camino muerto del grafo 2D**: `ForceGraphInner.tsx` (464 líneas, solo se usan sus types)
   + `GraphExplorer variant="full"` sin render + ~130 líneas `.graph__*` en globals.css +
   dep `react-force-graph-2d` + debug `window.__frame` (:188-219). Extraer types y borrar.
2. `html2canvas` declarada y sin ningún import — `npm uninstall`. ✅ verificado en package.json.
3. `charFilters` es estado muerto (actions/helpers/CSS sin consumidores) — types.ts:113-118,
   state.tsx:380-383, programa.ts:100-150, `cmbx-charpanel*` en planner.css.
4. `PlanState.result` nunca se escribe; rama de pineo muerta en `PLAN_TOGGLE_LOCK` —
   types.ts:222 + state.tsx:325.
5. **planner.css: ~125 clases sin consumidor** (combinador viejo `cmb-*`/`cmbx-*`, drawer
   lateral pre-modal `drawer__*`/`dr-*`/`pick-*`, PlanView viejo `plan2-hero*`…) en un
   archivo de 2142 líneas + tokens `--a-*` (:35-38) con colores DISTINTOS a los canónicos
   de `AREA_COLOR`. Barrida con cuidado de clases dinámicas (`plan2-recgrp__dot--`+tone).
6. Hojas: PAW/Inge2 sin migrar al esquema Unidad→Sub-unidad (mna/economia/proba sí; la UI
   pierde encabezados/filtro/códigos en esos dos vaults) — data/paw.ts + inge2.ts.
7. `TEX_COLOR_DEFS` hardcodea hex aparte de `KIND_META` (sync manual): generarlo desde
   `KIND_META.*.light` para hacer estructural la invariante — exporters.ts:117.
8. Menores: `IconLock` duplicado (PlanView:82-98, FinalesCombinadorView:1013-1029);
   `27`/`14` hardcodeados (Topbar.tsx:28-30, Sidebar.tsx:192,214); 17 íconos sin uso en
   ToolIcon.tsx; header AUTO-GENERADO sin comando en proba/finales/wiki-hrefs.ts;
   `/public/electivas/` stale en site/.gitignore; `"use client"` innecesario en
   UseWithClaude.tsx; leftovers en graph.json/route.ts (:114-116, campos `s`/`r` no
   consumidos); clase `hero-graph__canvas--3d` sin CSS; reglas `.nav__burger .ico-*`
   huérfanas en nav.css.

## P4 — Directivas stale (se completa con el reporte del auditor de directivas, pendiente)
- PROJECT.md: "NO hay lib 3D ni DnD" (falso post-overhaul), counts, fecha sync DESIGN.md.
- packages/ui/README.md: catálogo sin ToolCard/Callout/CommissionSelect/CodeCopy/
  CodeBlockChrome y árbol de styles incompleto — :67-75,100-106.
- types.ts:171 y sheets.css:15 dicen que la paleta "vive en DESIGN.md §12" pero DESIGN.md
  no tiene ningún hex de hojas — replicar vía `studyvault-design` o corregir el comentario.
- SKILL.md de sheet/ui/toolkit: contrastar contra schema subunit/paleta/counts nuevos.
