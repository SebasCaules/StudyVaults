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

## Pendiente (backlog priorizado en `.plans/`)

- `.plans/plan-mejoras-correcciones.md` — correcciones y deuda (funcional).
- `.plans/plan-mejoras-diseno.md` — mejoras de diseño/pulido visual.
- **Inputs del usuario** que bloquean partes: datos reales de syllabus de obligatorias,
  fechas de mesas de finales + correlativas de finales (en curso vía ingest), y las
  **7 ilustraciones raster** de materias (D6 — hoy placeholders SVG).
- **Auditoría integral 2026-07-03**: 3 de 4 reportes integrados a los planes (v2) con los
  hallazgos alto re-verificados por el overseer. Falta el consolidado de directivas
  (alimentará P4 del plan de correcciones: claims stale de PROJECT.md/SKILL.md/READMEs).
- **Directivas con claims stale conocidos** (corregir con evidencia): PROJECT.md §1/§3 dice
  "NO hay lib 3D ni DnD" (ya falso: `react-force-graph-3d` + `three` + DnD nativo), conteo
  de páginas y fecha de sync de DESIGN.md pueden haber cambiado post-overhaul; revisar
  SKILL.md de sheet/ui/toolkit contra el schema/paleta/counts nuevos.
