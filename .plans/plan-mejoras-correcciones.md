# Plan — mejoras y correcciones (funcional)

> v3 — 2026-07-04. **Batch autónomo EJECUTADO** (6 agentes + overseer, `tsc` verde ×3).
> Quedan solo los ítems bloqueados por (a) el WIP vivo de la sesión del grafo/hero,
> (b) decisiones/datos del usuario, y (c) la verificación en build+browser real.

## P0 — Verificación integral — ⏳ PENDIENTE (bloqueada)
`./run.sh build` + browser quedó **vedado durante el batch**: la sesión del grafo tiene su
dev server vivo en :3000 (comparten `.next`). Al aterrizar ese WIP → correr `studyvault-ship`
Fase A completa (build ~800 pág + smoke-tests + screenshots dark/light) sobre TODO lo de abajo.
Lo ejecutado se verificó con `tsc` limpio + revisión adversarial de diffs + spot-checks estáticos.

## P1 — Bugs altos — ✅ HECHO (4/5)
1. ✅ CommissionSelect legible en light (`forms.css`: option → `--surface-2`).
2. ✅ DnD no acepta drops en cuatris finalizados (SemCard: dropEffect none + drop ignorado).
3. ✅ Roadmap respeta `lockedIdx` (draggable/drops/quitar gateados + candado + chip + Desbloquear).
4. ✅ Electivas llegan a `estado:"final"`: `EstadoControl` en ElectCard y DetailDrawer; el action
   binario `TOGGLE_APPROVED` quedó huérfano y se eliminó (type + case). CSS `.btn-ap` huérfano fuera.
5. ⏸ Tooltip 3D en light — **probablemente obsoleto**: la sesión del grafo borró
   `ForceGraph3DInner` y está construyendo `HeroAtlas`; re-evaluar cuando aterrice.

## P1b — Estado / locks / persistencia — ✅ HECHO
1. ✅ "Guardar preferencia" excluye cuatris lockeados (+ estado local rancio saneado con `safeSaveIdx`).
2. ✅ Unlock ya no borra pines manuales: contrato `lockPins` completo — action
   `PLAN_TOGGLE_LOCK{pinnedByLock}`, `plan.lockPins` en el estado, persistencia
   `plan_lock_pins_v1` + `PreferenceBundle.lockPins` (compat con bundles viejos: unlock
   conservador que no borra nada), effect en PlannerApp, `finalizeCuatri` con dispatch único.
3. ✅ Migración `finalDone` filtrada con `tieneFinal` (+ saneo idempotente de datos ya
   contaminados al hidratar). Helpers puros movidos a `lib/planner/estado.ts` (fuente única).
4. ✅ localStorage de finales validado con `parseFinales` (corrupto → default, sin throw).
5. ✅ Guard `hojas` en `[...slug]/page.tsx`.
6. ⏸ `three` phantom dep — **bloqueado**: `package.json` caliente (sesión del grafo lo está
   tocando; puede que su rework ya lo resuelva). Verificar al aterrizar.

## P1c — Finales / .ics / export — ✅ HECHO
1. ✅ Dos finales el mismo día sin pisarse → aviso propio (warn) + texto de días consecutivos corregido.
2. ✅ .ics: `TZID=America/Argentina/Buenos_Aires` + VTIMEZONE, UID estable (code+período+año,
   re-importar actualiza), folding RFC 5545 (75 octetos, validado con script + roundtrip).
3. ✅ `texEscape`: tipográficos en modo texto (`—`→`---`, comillas curvas → TeX), math intacta.
4. ✅ Meta-note del export según método (ExportArgs.method, default compat) + los 2 call-sites
   de PlanView pasan `method: PL.method`.

## P2 — Menores y perf — ✅ HECHO
1. ✅ Reset despersonalizado y veraz ("¿Restablecer todas las materias a pendiente?").
2. ✅ Recomendador no computa oculto (memo gateado; antes ~90×optimizePlan por render).
3. ✅ Selects de fijar cuatri unificados en `MAX_PLAN_CUATRIS = 14` (`lib/planner/consts.ts`).
4. ✅ Tablist de PlanView con flechas/Home/End; foco accesible (`useModalFocus`: foco inicial +
   trap + restore) en DetailDrawer (extraído a `DrawerModal` montado-al-abrir), IOModal,
   MinorsModal y ResetConfirm.
5. ✅ PlannerIntro: click manual frena el autoplay; ARIA correcto (`role=group`+`aria-pressed`).
6. ✅ CopyButton emite `copied is-copied` (compat con el CSS de wiki sin tocar globals.css).
7. ✅ WikiRail: cierre en drawer no persiste; scroll-lock reacciona al cruce de breakpoint.
8. ✅ Sitemap con `/herramientas/`, `/hojas/`, `/biblioteca/` por flags.

## P3 — Deuda — parcial
1. ⏸ **Grafo 2D muerto** (ForceGraphInner + CSS + dep `react-force-graph-2d` + `html2canvas`) —
   bloqueado: la sesión del grafo está reemplazando ese subsistema entero (HeroAtlas); es
   probable que su rework lo limpie. Re-evaluar al aterrizar (ídem leftovers de
   `graph.json/route.ts` y clase `hero-graph__canvas--3d`).
2. ✅ `charFilters` eliminado (types+actions+helpers; el CSS lo barrió la pasada de planner.css).
3. ✅ `PlanState.result` eliminado (+ rama muerta del reducer + workaround de PlanView).
4. ✅ **planner.css: −341 líneas** (2143→1802) — familias muertas verificadas por grep
   (combinador viejo, drawer pre-modal, plan2-hero/seg/methodseg/controls/boardbar, cal-card,
   tokens `--a-*`) + dashed decorativos → solid (rec-fit, card__read). El agente dejó una
   **lista de candidatos 2ª tanda** (`.drawer`, `.cmb-grid`, `.cmbx*`, `.cmb2-*`, `.ctl*`…)
   conservados por prudencia — confirmar y barrer en una pasada futura.
5. ✅ IconLock/IconUnlock a `icons.tsx`; 27/14 → constantes; header honesto en wiki-hrefs.ts;
   `/public/electivas/` fuera de site/.gitignore; `use client` fuera de UseWithClaude;
   `.ico-*` huérfanas fuera de nav.css; `TEX_COLOR_DEFS` derivado de `KIND_META`
   (verificado byte-idéntico).
6. ⏭ ToolIcon poda — SKIPPED a propósito (17 íconos sin uso pero útiles para tools futuras).
7. 🧑‍🎓 Hojas PAW/Inge2 → esquema Unidad→Sub-unidad — requiere criterio editorial TUYO
   (cómo agrupar el contenido); no se automatizó.

## P4 — Directivas — ✅ CERRADO (2026-07-04)
Incluye las 3 BAJAs finales: smoke-tests en ship (con `/electivas/planificar/` y biblioteca),
patrón `launcher`/`poster` en TOOL_TEMPLATE, modo "Libro" documentado en la skill sheet.
