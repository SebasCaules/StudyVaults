# ESTADO.md — estado del proyecto y qué se busca (leer al arrancar cualquier sesión)

> Snapshot al **2026-07-03**. Este archivo es la foto viva del proyecto: qué está hecho,
> qué está en curso, qué falta y con qué barra de calidad se trabaja. **Actualizalo al
> cerrar cualquier trabajo sustancial** (es la directiva que eleva el nivel de las
> sesiones — sin esto, cada sesión re-descubre el estado a ciegas o trabaja con datos viejos).

## Qué se busca (el norte)

StudyVaults es un sitio publicable de calidad de producto: 7 wikis de estudio + planner de
electivas + hojas + toolkits, en https://sebascaules.github.io/StudyVaults/. La vara:
1. **Fidelidad al spec aprobado**: los mockups de `_design-review/` (versionados, "OK FINAL"
   2026-07-02) son el spec visual vigente. Divergencia = bug de diseño, salvo decisión nueva.
2. **Estética sobria anti-IA**: sin tags rotados, sin `◆` decorativos, sin dashed decorativo
   (dashed solo para vacío/placeholder). Tokens §12, nada de hex hardcodeado.
3. **La corrección es sagrada**: nada está "hecho" sin `tsc` + `./run.sh build` limpios y
   verificación en browser real (Claude Preview; rutas `/[vault]/` SOLO en build estático).
4. **Trabajo orquestado en serio**: para tareas sustanciales, overseer que fija contratos +
   agentes paralelos sobre archivos DISJUNTOS + verificación adversarial. Todo subagente en
   el tier más alto disponible (Opus 4.8 1M o superior; nunca Sonnet para build/verify).

## Hecho (verificado)

- **Rework HCI del "Plan por cuatrimestre"** — `92ad4bf` (2026-07-04, aprobado con
  antes/después): timeline vertical por año (una carta partida en sus 2 cuatrimestres),
  filas checklist `[EstadoControl] código nombre … señal · créditos`, micro-barra de avance
  por año (terminadas/deben final), candado de disponibilidad unificado con Electivas
  (`CardSignals.tsx`, fuente única), sin tags en palabras. Verificado: tsc + build 804/804 +
  screenshots dark/light/mobile + click-through en browser real (control cicla y persiste,
  fila abre drawer, Esc cierra; verificado sobre build estático en worktree aislado con
  :3000 ocupado). **Pendiente menor**: limpiar `.cuatri-grid/.qcol/.qcard` muertos en
  planner.css (archivo caliente del track finales). **Bug transversal detectado**: `badge.css` del DS define
  `.tag::before{content:"#"}` y colisiona con los `.tag` del planner (visible hoy en
  DetailDrawer, "# disponible") — falta fix aparte.
- **Overhaul UI/UX implementado y commiteado** — `25b93b4` (77 archivos, +13.953): landing
  recortada + grafo 3D hero, pseudo-landing `/electivas` vs app `/electivas/planificar`,
  planner (estado 2 niveles cursada/final, combinador de finales + .ics, lock de cuatris,
  DnD, tabs Calendario→Roadmap→Minors, CommissionSelect, MinorBadge), hojas (paleta muted +
  unidad/subunidad), toolkits bespoke, wiki prev/next, tokens brown oscuro aclarado.
  ⚠️ Los docs `.claude/BUILD_PLAN.md` / `ORCHESTRATION.md` son **históricos** de esa fase.
- **Higiene** — `ce8e6c7`: `.idea/` ignorado y des-trackeado, `.DS_Store` fuera,
  `_design-review/` versionado (antes untracked, en riesgo).
- `tsc --noEmit` limpio al 2026-07-03 16:45.
- Suite de skills operativa (page/toolkit/sheet/ui/data/ship/design + **ingest**, nueva).

## En curso (otras sesiones — NO pisar)

- **Track finales/ingesta**: `site/lib/planner/finales/`, `FinalesIngesta.tsx`,
  `finalesData.ts`, `FinalesCombinadorView.tsx` (datos reales de mesas).
- **Rework grafo 3D del hero**: `ForceGraph3DInner.tsx` + `globals.css` (sprites luminosos +
  UnrealBloom + anti-solape de etiquetas).
- Regla: antes de tocar CUALQUIER archivo, `git status` + mtime; si está modificado y no lo
  modificaste vos, es de otra sesión. Commitear temprano y seguido, solo tus paths.

## Batch de correcciones EJECUTADO (2026-07-04)

Todo lo autónomo de los planes se aplicó (6 agentes en carriles disjuntos + overseer, `tsc`
verde): P1 bugs altos (CommissionSelect light, DnD/Roadmap respetan locks, tri-estado en
electivas/drawer), P1b (contrato `lockPins` completo con persistencia, migraciones saneadas),
P1c (.ics con TZID/UID estable/folding, texEscape), P2 (a11y de tablists y modales, perf del
recomendador, reset veraz, sitemap), P3 parcial (charFilters/result muertos fuera, planner.css
−341 líneas, TEX_COLOR_DEFS derivado), D3 (status por tema + DESIGN.md sync `d720a581…`).
**Falta la verificación P0 en build+browser** (vedada: dev server de la sesión del grafo vivo)
→ correr `studyvault-ship` Fase A al aterrizar ese WIP. Detalle ítem por ítem en los planes.

## Pendiente (backlog priorizado en `.plans/`)

- `.plans/plan-mejoras-correcciones.md` — correcciones y deuda (funcional).
- `.plans/plan-mejoras-diseno.md` — mejoras de diseño/pulido visual.
- **Inputs del usuario** que bloquean partes: datos reales de syllabus de obligatorias,
  fechas de mesas de finales + correlativas de finales (en curso vía ingest), y las
  **7 ilustraciones raster** de materias (D6 — hoy placeholders SVG).
- **Auditoría integral 2026-07-03/04: COMPLETA (4/4)** e integrada a los planes; hallazgos
  alto re-verificados por el overseer. P4 (directivas stale) **aplicado el 2026-07-04**:
  PROJECT.md, README raíz, HOME.md, SKILL.md (toolkit/sheet/ui/data/design), ui/README y
  headers de .plans viejos corregidos contra el código real. DESIGN.md §12 sincronizado el
  2026-07-04 (paleta de hojas refinada en §12.10 — decisión del usuario —, tints `--vt-*`,
  motion/espaciado/radios reales; 3 copias md5 `c6061c05…`).
- **Pendientes reales del overhaul** (verificado: TODO lo demás del BUILD_PLAN está
  implementado, incl. footer en /electivas y de-stick del topbar): (1) las 7 ilustraciones
  raster (hoy SVG placeholder), (2) syllabus real de obligatorias (placeholder "próximamente";
  139 PDFs faltantes), (3) mesas de finales oficiales + correlativas de final reales
  (finalesData.ts es MOCK declarado; la vía de ingesta ya existe — `FinalesIngesta`).
