# BUILD_PLAN.md — Implementación del overhaul en `site/` real

> ⚠️ **HISTÓRICO (2026-07-03): este plan YA SE EJECUTÓ** — commit `25b93b4` (77 archivos).
> El estado vivo del proyecto está en `.claude/ESTADO.md`; el backlog en `.plans/plan-mejoras-*.md`.
> Se conserva como registro del contrato de la fase BUILD (referencias de mockups y ownership).

> **Fuente de verdad autocontenida para la fase de BUILD.** Se puede ejecutar sin la conversación
> previa. Contexto de diseño completo en `.claude/ORCHESTRATION.md`; convenciones en
> `.claude/skills/_shared/PROJECT.md`; el spec visual son los **mockups aprobados** en `_design-review/`.
> Aprobado por el usuario ("OK FINAL") + este plan aprobado para ejecutar.

## Qué es
Overhaul grande de UI/UX/features de StudyVaults, ya **diseñado y aprobado** como 17 mockups HTML en
`_design-review/` (+ `index.html`). Ahora hay que **implementarlo en el sitio Next.js real** (`site/`),
**módulo por módulo, verificando en build real**. Cada mockup `_design-review/<x>.html` es el spec
visual de lo que hay que construir en el código real correspondiente.

## Reglas duras (siempre)
- **Todo agente/subagente corre en Opus 4.8 1M** (`model: "opus"`). (Ver memoria `feedback-all-agents-opus`.)
- **NADA se pushea ni commitea sin que el usuario lo pida explícitamente.** Push a `main` dispara deploy.
- Commits SIN trailer `Co-Authored-By: Claude`.
- **Static-export safe**: `window`/`localStorage` detrás de guards.
- Presentación desde `@studyvaults/ui` + tokens §12; nada de hex hardcodeado — roles/`color-mix()`.
- **DESIGN.md en 3 copias byte-idénticas** (repo `_estandar/`, skill `studyvault-page/assets/`, master
  `~/Desktop/ITBA/_estandar/`): todo cambio de §12 se replica a las 3 (skill `studyvault-design`).
- Next.js 16 con breaking changes → leer `node_modules/next/dist/docs/` antes de código Next.
- **`next dev` tira 500 en `/[vault]/`** (bug pre-existente) → verificar esas rutas con **build estático**
  (`./run.sh build`), no con el dev server. Verificación en **browser real**.
- Diseño anti-IA: sin tags rotados/diagonales, sin `◆` decorativos, sin dashed decorativo (dashed sólo
  para vacío/placeholder). Brown del tema oscuro ya se aclaró en los mockups (canvas ~#4c3a30, cards ~#382519).

## PRINCIPIO ANTI-PISADA (clave de la paralelización)
Cada agente paralelo es **dueño exclusivo de un set de archivos DISJUNTO**. Los archivos **compartidos**
los escribe el OVERSEER (yo) en la **Fase 0**, ANTES de paralelizar. Así dos agentes nunca tocan el
mismo archivo. `planner.css`, registries y `Topbar.tsx`/`Sidebar.tsx` los integra el overseer.

---

## FASE 0 — Contratos y base (OVERSEER, secuencial). Empezar con un scout-relámpago de los archivos exactos.
1. **Brown más claro** → `packages/ui/src/styles/tokens.css` (canvas/surface del tema oscuro) + **sync
   DESIGN.md §12** (3 copias).
2. **Paleta de hojas** (6 EntryKind, muted) definida como spec para el stream de Hojas + sync DESIGN.md.
   Dark/light: def `#9AB8D6`/`#295C8E` · theorem `#B6A4D6`/`#5E3B9B` · formula `#7CC0AF`/`#227762` ·
   method `#D8B279`/`#8C6121` · caution `#D68F85`/`#AB3C2B` · example `#B1A8A0`/`#6D6155`.
   (En el código real viven en 3 lugares sincronizados: `packages/ui/src/styles/sheets.css`,
   `components/vault-sheets/exporters.ts` TEX_COLOR_DEFS, `components/vault-sheets/types.ts` KIND_META.
   → los toca el **Agente 4 (Hojas)** con esta spec; el overseer sólo da la paleta + sync DESIGN.md.)
3. **`Minor`** → `lib/planner/minors.ts` (NUEVO): `{ id, name, short, color }` desde `Plan.areas` +
   `AREA_COLOR` (model.ts) + `AREA_SHORT` (hoy en MinorsModal). Iniciales CD/IRV/IA/ARQ. Colores:
   CD `#85a2c2` · IRV `#c592ab` · IA `#a9b27e` · ARQ `#a497c0`.
4. **`CommissionSelect`** → componente NUEVO (planner-local `components/planner/CommissionSelect.tsx` o en
   `@studyvaults/ui`) + registro en barrel + showcase `/interno/ui`.
5. **Planner state/types** (los archivos MÁS compartidos — clavarlos primero) → `lib/planner/types.ts` +
   `components/planner/state.tsx`:
   - `estado` de 2 niveles por materia: `"regular" | "final"` (reemplaza/extiende `approved`; migración:
     `approved` de hoy → `estado:"final"`). Regla: finales mira `regular`; materias `promocionable`/
     `!tieneFinal` → sin 2º nivel.
   - `lockedIdx: Set<number>` (finalizar cuatri) + soporte en `optimize.ts` (el optimizer no toca cuatris lockeados).
   - Estado del **combinador de finales** (período Julio/Dic/Feb, fechas de mesa, correlativas de finales).
   - Acción **save-preference** (combinador→plan: escribe `fixed` + re-optimiza).
6. `tsc` limpio antes de seguir.

---

## OLA PARALELA — 10 agentes Opus sobre archivos DISJUNTOS (tras Fase 0)

| # | Agente | Dueño EXCLUSIVO de | Entrega (mockup ref) |
|---|---|---|---|
| 1 | Portal/Nav | `app/page.tsx`, `components/portal/*`, `packages/ui/src/navigation/*`, `app/layout.tsx`, secciones home de `app/globals.css` | landing recortada + CTA planner + grafo a la derecha + footer rediseñado + footer en /electivas + de-stick topbar (`module-a-landing`, `module-a-electivas-intro` para el CTA) |
| 2 | Toolkits | `components/vault-tools/*` (+ `packages/ui/src/styles/toolkit.css`) | launchers bespoke + grid continuo (`module-a-toolkits`) |
| 3 | Wiki nav | `components/wiki/*`, `app/[vault]/[...slug]/page.tsx` | prev/next (`module-a-wiki-nav`) |
| 4 | Hojas | `components/vault-sheets/*` (incl. `sheets.css`, sheets `types.ts`, `exporters.ts`, `data/*.ts`) | paleta nueva + Units/Sub-units + código, entradas con relleno de todo el cuadro + borde parejo, fórmulas centradas (`module-d-sheets`, `foundations`) |
| 5 | Correlativas | `components/planner/views/GrafoView.tsx`, `lib/planner/layoutGraph.ts`, **`components/planner/grafo.css` NUEVO** (no tocar `planner.css`) | pan/zoom + Ajustar, sin overflow (`module-b-correlativas`) |
| 6 | Modal curso | `components/planner/DetailDrawer.tsx` | X sticky, acciones simétricas, responsive, no toca bordes (`module-c-modal`) |
| 7 | Cards/chips | `components/planner/views/ElectivasView.tsx`, `CuatriView.tsx`, `ProgramaChips.tsx` | chips 11→5 + badges de minor (usa `Minor` de Fase 0) (`module-c-cards`) |
| 8 | PlanView | `components/planner/views/PlanView.tsx` | banner con selectores, tabs Calendario→Roadmap→Minors, 3-dot, lock, DnD (`module-e-planner`) |
| 9 | Combinador | `components/planner/views/CombinadorView.tsx` | recomendador slim, descargas 3-opciones, save-pref, tooltips (`module-e-combinador`) |
| 10 | Finales | **NUEVOS** `components/planner/views/FinalesView.tsx` + `FinalesCombinadorView.tsx` | doble-check en la tab de aprobadas + combinación de finales + .ics con reminder 72hs + correlativas + disclaimer (`module-f-checks`, `module-f-combinador`) |

**Compartidos que integra el OVERSEER (no los toca ningún agente):** `planner.css` (los agentes pasan su
CSS por vista o usan sub-archivos), `Topbar.tsx`, `Sidebar.tsx` (tabs/nav), registries.

Nota: Agentes 1–4 son subsistemas periféricos; 5–10 son planner (pero sobre archivos-vista disjuntos +
state/types ya escritos por el overseer en Fase 0). Todos pueden correr concurrentes.

---

## FASE 2 — Integración + verificación (OVERSEER)
- Cablear registries: tabs del planner (`Sidebar.tsx` views), `SHEETS` (`vault-sheets/registry.ts`),
  `TOOLKITS` (`vault-tools/registry.tsx`), flags en `lib/content/vaults.ts`.
- Integrar `planner.css` (estilos que pasaron los agentes) + `Topbar.tsx`/`Sidebar.tsx` (tabs, de-stick).
- Correr **`./run.sh build`** (build estático fiel a GH Pages, ~802 páginas) + `tsc` limpio + **verificar
  en browser real** (usar los mockups como referencia visual). Skill `studyvault-ship` Fase A.
- Reporte con evidencia (build verde + screenshots). **Push SOLO si el usuario lo pide** (Fase B de ship).

## Datos mock/placeholder hasta que el usuario los pase
- Syllabus: datos reales de materias obligatorias.
- Finales: fechas de mesas + correlativas de finales.
- 7 ilustraciones de materias: SVG ilustrativas por ahora (no hay generador raster en el entorno).

## Estado de arranque
- Aprobado para ejecutar. Empezar por **Fase 0** (scout-relámpago de archivos compartidos → escribir
  contratos → `tsc` verde) y recién ahí lanzar la ola paralela.
