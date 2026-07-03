# Plan — mejoras y correcciones (funcional)

> 2026-07-03. Basado en lo verificado post-overhaul (`25b93b4`). Las secciones marcadas
> **[audit]** se completan con los hallazgos de la auditoría integral en curso (4 agentes:
> portal/UI · planner · hojas/toolkits/pipelines · directivas). Ejecutar con las skills del
> repo; verificar SIEMPRE con `tsc` + `./run.sh build` + browser real antes de dar por hecho.

## P0 — Verificación integral del overhaul (bloquea todo lo demás)
1. **Ship Fase A completa**: `./run.sh build` (≈800+ páginas) + recorrida en browser real de
   los módulos del overhaul contra sus mockups (`_design-review/module-*.html`), con
   screenshots como evidencia. Hacerlo cuando aterrice el WIP vivo (grafo 3D + finales),
   para no verificar un árbol a medias.
2. **Regla de concurrencia**: coordinar con la sesión de finales/grafo antes de builds.

## P1 — Correcciones de datos y estado
1. **Migración `approved` → `estado`**: test manual con localStorage viejo real (exportar un
   PreferenceBundle pre-overhaul, importarlo, verificar que nada se pierde). [audit]
2. **`lockedIdx` en el optimizer**: verificar que TODOS los caminos de `optimize.ts` lo
   respetan (incl. re-optimización post guardar-preferencia). [audit]
3. **Export .ics de finales**: validar escapes, timezone y reminder 72 hs contra un import
   real en Google Calendar / Apple Calendar.
4. **Datos reales**: syllabus de obligatorias + mesas/correlativas de finales (track ingest
   en curso). Al llegar, borrar los mocks y sus flags.

## P2 — Deuda técnica
1. **Dep sweep en `site/package.json`**: confirmar si `react-force-graph-2d` (y otros) quedó
   huérfano tras el grafo 3D; quitar lo no importado. [audit]
2. **CSS del planner**: el overhaul sumó 6 css nuevos (cards/combinador/detail-drawer/
   finales/grafo/planview) además de `planner.css` — deduplicar reglas y borrar selectores
   huérfanos. [audit]
3. **Static-export safety sweep**: grep de `window`/`localStorage`/`document` sin guard en
   componentes nuevos del overhaul. [audit]
4. **Directivas stale**: corregir PROJECT.md (claims "no hay 3D/DnD", counts, fecha sync
   DESIGN.md) y SKILL.md afectados (sheet: schema subunit + paleta nueva; ui: counts;
   toolkit: afiches bespoke). Usar `studyvault-design` para lo que toque DESIGN.md.
5. **Triple sync de la paleta de hojas**: verificar valor por valor `sheets.css` ↔
   `exporters.ts` TEX_COLOR_DEFS ↔ `types.ts` KIND_META contra la paleta aprobada. [audit]

## P3 — Hallazgos de auditoría
(Integrar acá la lista `[SEV][TIPO] archivo:línea` de los 4 auditores cuando reporten;
priorizar crítico/alto → P1, medio → P2, bajo → P3.)
