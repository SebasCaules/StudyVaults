# ORCHESTRATION.md — Overhaul StudyVaults (overseer working doc)

> ⚠️ **HISTÓRICO (2026-07-03): la fase BUILD ya se ejecutó** — commit `25b93b4`. La frase
> "nada construido en el sitio real todavía" quedó obsoleta. Estado vivo: `.claude/ESTADO.md`;
> backlog: `.plans/plan-mejoras-*.md`. Se conserva por las decisiones de diseño (D1–D7, §0b–0f).

> Living directive for the multi-module UI/UX/feature/architecture overhaul.
> Overseer (Opus) fija contratos + integra; workers (Sonnet) ejecutan; todo se verifica
> adversarialmente y en el browser real. **Self-healing:** actualizar este doc con cada
> decisión/patrón/edge-case nuevo (Section 2 del brief).
>
> Estado global: **DESIGN-FIRST** — se producen specs + mockups HTML por módulo para
> aprobación ANTES de escribir código de feature. Revisión **módulo por módulo**.
> No se pushea nunca sin pedido explícito (convención del repo).
>
> **POLÍTICA DE MODELOS (instrucción del usuario, 2026-07-02):** TODOS los agentes/subagentes
> corren en **Opus 4.8 1M** (`model: "opus"`), no Sonnet. Esto **invalida** el default de la skill
> /orquesta (workers en Sonnet). El overseer también en Opus. Aplica de acá en más a todo fan-out.

---

## 0. Decisiones LOCKED (round 1)

| # | Decisión | Valor |
|---|---|---|
| D1 | Cadencia de ejecución | **Design-first, then build** — specs+mockups por módulo → aprobación → build |
| D2 | Alcance Study Sheets (Mod D) | **Híbrido** — restyle + schema Units/Sub-units ahora; contenido comprehensivo incremental |
| D3 | Fuente de datos syllabus obligatorias | **El usuario provee la data** — genero skeleton pre-cargado con las materias/campos a completar |
| D4 | "Course images" | **7 ilustraciones de vault más ricas** (una por materia: MNA/Derecho/Economía/Proba/PAW/SDS/Inge2) |

| D5 | A1 Correlativas Pseudo-Landing | **Intro explainer arriba de `/electivas`** (antes de la app, con animaciones) |
| D6 | Formato de las 7 ilustraciones | **AI-generated raster**, altamente ilustrativas del contenido; en `public/`; aprobación por materia |
| D7 | A4 Toolkits rework | **Launcher bespoke por toolkit + identidad de iconos; runner compartido** (ToolkitShell se mantiene) |

Round 1+2: **0 dudas bloqueantes.** Todo lo demás en §4 = defaults aceptados (redirigibles en review).

## ✅ FASE DE DISEÑO APROBADA — "OK FINAL" (2026-07-02)

El usuario aprobó el estado final de TODOS los mockups. 17 páginas + `index.html` en `_design-review/`,
verificadas en browser. Feedback round aplicado (brown más claro parejo, fórmulas centradas, landing
CTA planner, toolkits grid continuo, syllabus TPs, promociona teal, finales .ics+reminder 72hs, modales
con margen). **Nada construido en el sitio real todavía** — falta la fase de BUILD (implementar módulo
por módulo, verificar en build real, pushear SOLO cuando el usuario lo pida).

Inputs pendientes del usuario para el build: datos reales de syllabus (materias obligatorias), fechas de
mesas de finales + correlativas de finales (hoy mock), y las 7 ilustraciones raster (track de imágenes
aparte — no hay generador de imágenes en este entorno).

## 0b. Entregables de review producidos + verificados (en `_design-review/`, servidos self-contained)

- **`foundations.html`** — lenguaje de diseño (6 secciones). VERIFICADO en browser real (dark). Self-contained (0 requests).
  - **Paleta sheets PROPUESTA** (mismo matiz, sat ~35-55%, L por tema; todos ≥4.46:1 AA):
    | kind | dark | light |
    |---|---|---|
    | def | `#9AB8D6` | `#295C8E` |
    | theorem | `#B6A4D6` | `#5E3B9B` |
    | formula | `#7CC0AF` | `#227762` |
    | method | `#D8B279` | `#8C6121` |
    | caution | `#D68F85` | `#AB3C2B` |
    | example | `#B1A8A0` | `#6D6155` |
    → al aprobar, replicar en las **3 copias sync**: `sheets.css` (light+dark+print), `exporters.ts` TEX_COLOR_DEFS, `types.ts` KIND_META.
  - Minor badge: pill de iniciales (CD/IRV/IA/ARQ) en color del minor + variante dot. Chips: BEFORE 11 chips → AFTER abbr + "N cr" + badge minor + dot disponibilidad + 1 icono régimen. CommissionSelect: 1 componente (reposo/hover/foco coral/truncado).
- **`3d-temporal-graph.html`** — grafo temporal 3D. VERIFICADO renderizando (WebGL ok): nodos por capa temporal (Y=avance), edges (spine+unlock) render, hover-tooltip, slider de reveal, legend con los 4 minors. Self-contained: `./three.min.js` (r160 UMD, stasheado como `__THREE160`) + `./3d-force-graph.min.js` (usa su three interno con Timer). file:// safe (sin ESM, DATA inline).
  - Bugs resueltos por el overseer: (1) `Ak.Timer is not a constructor` → separar instancias three; (2) `.controlType` no es método → va en el config del constructor `ForceGraph3D({controlType:'orbit'})`.
  - **DECISIÓN ABIERTA para el usuario:** este grafo usa la data de **correlativas de materias** (`data.json`, eje temporal año/cuatri+creditosReq) — NO el grafo de **notas/wikilinks** del landing (que es el que el brief llama "terrible"). Confirmar cuál quiere como reemplazo, o si ambos.
  - Notas de pulido: electivas con creditosReq=0 se apilan en sem1 (denso, rasgo real de la data); opacidad de edges y ángulo de cámara son knobs de pulido.

---

## 0c. Módulo A — mockups producidos + verificados en browser (`_design-review/`)

Los 4 self-contained (0 requests externos), sobre el lenguaje de Foundations, verificados por el overseer:
- `module-a-landing.html` — home recortada: hero con grafo a la derecha + más chico, grilla de 7 materias + planner con banners SVG bespoke, band de grafo ("en 3D"), CTA electivas, **footer rediseñado compacto** (brand + Materias 7 + Recursos 3 + strip). Nota: banners ciclan 3 colores de acento (placeholder hasta las ilustraciones ricas).
- `module-a-toolkits.html` — 3 identidades bespoke conmutables (MNA=matriz/LU, Proba=Gauss+histograma, Economía=oferta/demanda) con datos reales de tools + **runner compartido** demostrado. Worker fixeó bug real (`.tk-card` sin `color:var(--text)`).
- `module-a-electivas-intro.html` — pseudo-landing animada (IntersectionObserver): 6 feature blocks (plan/combinador/recomendador/correlativas/minors/finalizar) con colores reales de minors, `prefers-reduced-motion` respetado.
- `module-a-wiki-nav.html` — página wiki realista + **prev/next secuencial** + "X de N" + drawer mobile.

Pendiente de decisión del usuario: feedback de Módulo A; + las 2 abiertas (paleta hojas, dataset grafo 3D).

**Feedback del usuario aplicado a Módulo A (round 1):**
- Banners de materias rediseñados: Economía=oferta/demanda, SDS=partículas Vicsek+vectores, Inge2=arquitectura (caja→componentes→DB), Planificador=calendario. (MNA/Derecho/Proba/PAW intactos.)
- **Convención "menos IA" (aplica al BUILD real también):** nada de tags/stickers rotados en diagonal, nada de `◆` decorativos, nada de bordes `dashed` decorativos (dashed SOLO para vacío/placeholder/ghost). Tags rectos, hairline sólido, sobrios. Rotaciones permitidas solo si son funcionales (carets/chevrons, anillos de progreso, animación de candado).

## 0d. Módulo C — mockups producidos + verificados en browser (`_design-review/`)

Los 3 self-contained, reutilizando componentes de Foundations (Minor badge, chips, CommissionSelect), anti-IA:
- `module-c-modal.html` — DetailDrawer rediseñado: **X sticky** (fix A), fila de acciones simétrica en grid 3-col (fix B), **container query real** `@container (max-width:820px)` que apila (fix C). Estructura completa (identidad/áreas·minor IA/correlativas/horario con CommissionSelect+preview semana/descripción/programa).
- `module-c-cards.html` — chips **11→5 señales** (abbr+cr+badge minor+dot disponibilidad+ícono régimen); grilla de electivas con **badge de minor(s)** single y multi (Big Data=CD·IRV·IA, Cloud=CD·IA·ARQ); obligatorias sin minor.
- `module-c-recommend.html` — recomendador **slim de una línea** `[dot minor][Nombre][N cr][+]`, fit en tooltip hover/focus, 3 grupos por encaje, panel colapsable; **CommissionSelect unificado** en los 3 contextos (combinador/roadmap/pool) que hoy divergen.

Pendiente: feedback del usuario; próximo módulo (B/D/E). Abiertas: paleta hojas (bloquea D), dataset grafo 3D (B).

## 0e. FEATURE NUEVA — Plan de finales + Combinación de finales (planificada 2026-07-02)

Espejo del Plan de cursada, para finales. Decisiones del usuario:
- **Estado de 2 niveles por materia** (reemplaza el `approved` único): `estado: "regular" | "final"`
  (ausente=pendiente). **regular** = cursada aprobada, final pendiente (1 check gris). **final** =
  final aprobado, implica regular (2 checks verde). Control tri-estado. Migración: `approved` de hoy → `estado:"final"`.
  Materias `promocionable`/`sin-final`/`!tieneFinal` → el 2º check no aplica (regular = terminada).
- **Ubicación (decisión del usuario):** el doble-check se marca **en la primera tab donde hoy se marcan
  las cursadas aprobadas** (NO una tab "Plan de finales" aparte). + **UNA tab nueva "Combinación de finales"**.
- **Combinación de finales:** selector de **período Julio/Dic/Feb** + calendario donde se carga fecha+hora
  de cada final; **combina rendir finales distintos** (detecta conflictos de fecha/horario + margen de
  estudio entre finales); respeta **correlativas de finales** + regla "necesitás la cursada regular".
- **Fechas de mesas = HÍBRIDO:** autopoblar con oficiales cuando existan + override/carga manual.
- **Correlativas de finales = SÍ se modelan** (final→final). ⚠️ Dato NUEVO que el repo no tiene.
- **Dependencia de datos:** correlativas de finales y fechas oficiales de mesas NO están en el repo →
  para el MOCKUP usar data de ejemplo; datos reales = input posterior del usuario (o pipeline nuevo).
- Estado `estado` compartido (cursada usa regular/final p/ correlativas; finales mira `regular`).
  Export/import extiende `PreferenceBundle` con `estado`, fechas de finales, caps de período.
- Secuencia: mockup **después** de verificar los mockups de Módulo E (que están corriendo en Opus).

## 0f. Módulo E — mockups verificados en browser (`_design-review/`, Opus)

- `module-e-planner.html` — banner con selectores (empiezo a cursar/máx materias/máx créditos/optimizar) integrados sin overlap; tab strip **Calendario→Roadmap→Minors [NUEVO]** + botones fijos (recomendador toggle/reset/import-export); semestres uniformes con **menú 3-dots** (límites+descargar este calendario); estado **lockeado** ("finalizado · el optimizador no lo toca"); badge RECOMENDADA+dot minor; hint de drag&drop. VERIFICADO. (Opus fresco.)
- `module-e-combinador.html` — header compacto (chips materia + Presencial/Virtual + Superponer) con controles fijos a la derecha (Electivas/recomendador · Descargar · Guardar preferencia); calendario a todo el ancho con bloques. VERIFICADO.
- `module-e-overlays.html` — Reset confirm, Import/Export hub, opciones de descarga (Solo calendario/Calendario+programa/Solo programa), popover finalizar cuatri + chip lockeado, tooltips Auto+Comisiones. VERIFICADO.
- Nota autoría: E2/E3 los agentes Opus validaron drafts previos compliant en vez de reescribir (calidad confirmada). Reescritura estricta Opus disponible si el usuario la pide.

## 1. Mapa del terreno (scouts A–E)

**Sitio:** Next.js 16 App Router, `output:'export'`, Tailwind v4, basePath `/StudyVaults`, deploy a
GH Pages en push a `main`. Todo lo web bajo `site/`. 7 vaults (`mna·derecho·economia·proba·paw·sds·inge2`).

**Deps clave:** `react-force-graph-2d`+`d3-force` (grafo landing, canvas), `html2canvas` (raster),
`katex`+`rehype-katex`+`remark-math` (math), `mermaid`. **NO hay:** lib 3D (three/r3f/force-graph-3d),
lib DnD (dnd-kit/react-dnd), lib de estado (usa `useReducer`+Context).

### Módulo A — Landing/Nav/UI
- Home: `site/app/page.tsx` (305 líneas, 8 secciones) + `components/portal/home-bits.tsx`.
- Nav global: `packages/ui/src/navigation/Navbar.tsx` cfg `components/portal/Navbar.tsx` — `position:fixed`, `--nav-h:68px`.
- Footer: `packages/ui/src/navigation/Footer.tsx` cfg `components/portal/Footer.tsx` — **CORTO** (57 líneas CSS, 3 col). `ConditionalFooter.tsx` lo oculta en `/electivas`.
- "Header inamovible" de electivas = `components/planner/Topbar.tsx` `.topbar` **`position:sticky; top:var(--nav-h)`** (planner.css:70-71). El nav global SÍ se renderiza en /electivas.
- Toolkits: `app/[vault]/herramientas/page.tsx` → `components/vault-tools/ToolkitShell.tsx` (launcher de cards + 1 tool activa, URL `?tool=`). 6 vaults con toolkit (todos menos sds). Counts: economia 18, proba 13, paw 12, inge2 ~6, derecho 5, mna 4.
- Wiki nav: `components/wiki/WikiLayout.tsx` + `Sidebar.tsx` (árbol completo colapsable, persist localStorage). **NO hay prev/next.**

### Módulo B — Grafos/Mapas/Visuals
- Correlativas map: `components/planner/views/GrafoView.tsx` + `lib/planner/layoutGraph.ts` — **SVG hand-rolled** DAG L→R (reemplazó vis-network). **Overflow:** `.planner .network` fixed `height:640px` sin overflow/scroll ni pan/zoom (planner.css:299). Data: `PLAN.edges` (~122) de `data.json`.
- Grafo landing: `components/portal/GraphExplorer.tsx` + `ForceGraphInner.tsx` — `react-force-graph-2d` canvas, data build-time `app/graph.json/route.ts`. Contenedor `.graph__canvas` `height:min(66vh,580px)` (globals.css:1356).
- 3D: **inexistente**. Sería dep WebGL nueva.
- Imágenes de curso: **no existen per-course.** Solo 7 banners SVG inline `components/portal/VaultBanners.tsx`. (Además: figuras de notas copiadas a `public/vault-assets/`, y 51 PDFs de fichas.)

### Módulo C — Course components/Electives (todo dentro del planner)
- Modal de detalle: `components/planner/DetailDrawer.tsx` (es **modal centrado**, no drawer). Roto: botón cerrar `.dr-close` NO sticky (scrollea fuera en contenido alto), fila de acciones asimétrica (`.mini{flex:1}` vs `.dr-dl{flex:none}`), `font-size:15px` muerto. Grid 2-col colapsa ≤820px.
- Chips: 2 cards distintas — `ElectCard` (ElectivasView.tsx:52-129) y `qcard` (CuatriView.tsx:84-120). Área tag **truncado a primera palabra** (lossy). `ProgramaChips.tsx` emite Promociona/Con final/Asistencia/Parcial/TP.
- **Minor: NO hay tipo dedicado.** Es un `área` string. 4 minors en `Plan.areas` (data.json): "Ciencia de Datos", "Imágenes y Realidad Virtual", "Inteligencia Artificial", "Arquitectura de Software". Colores `AREA_COLOR` (model.ts:11-16). Iniciales `AREA_SHORT` solo en `MinorsModal.tsx:17-22`. MINOR_REQ=14 cr/área, ELEC_REQ=27 total.
- Recomendaciones: `Recommendations` (PlanView.tsx:556+), data `lib/planner/recommend.ts`. `.rec-card` grid `minmax(178px,1fr)`, altura por contenido. 3 grupos colapsables por fit.
- Comisiones: **3 estilos distintos** — `.cmb-chip__com` (10px, max 118px), `.rmap-mat__sel` (10.5px, max 160px), `.pool-item select` (11px, sin max). Todos `SET_FIXED_COM`.

### Módulo D — PDF/LaTeX/Sheets
- "Syllabus PDF" = **client-side `window.print()`**, sin lib PDF. `lib/planner/exportPlan.ts`: `buildPlanHTML` (multi-cuatri "Plan de cursada") y `buildComboHTML` (1 cuatri "Programa"). Per-curso de `FICHAS` (fichas.ts, auto-gen de PDFs) + `RESUMENES` (resumenes.json). **Obligatorias sin ficha → "próximamente".**
- Sheets: ruta `app/[vault]/hojas/page.tsx` → `SheetShell.tsx`. Autoría = data modules `components/vault-sheets/data/*.ts`. Registry `registry.ts` (SHEETS) + flag `sheets:true`. Con formulas KaTeX: mna/economia/proba.
- "Colores feos" = 6 tokens `EntryKind` en `packages/ui/src/styles/sheets.css` (def azul, theorem violeta, formula teal, method ámbar, caution rojo, example gris). **Triplicados** — sheets.css + `exporters.ts` TEX_COLOR_DEFS + `types.ts` KIND_META. Deben sincronizarse.
- Schema sheets (`components/vault-sheets/types.ts`): `Sheet→groups[]→entries[]`. `SheetGroup.unit`+`unitTitle` existe pero **usado por 0 sheets**. **No hay sub-unit.**

### Módulo E — Planner/Combinador
- SPA `components/planner/**` + `lib/planner/**`. Reducer+Context en `state.tsx`. Left-rail 6 views (`Sidebar.tsx`): cuatri·elect·combo·plan·grafo·ref.
- PlanView.tsx (1556 líneas): sub-toggle `.plan2-seg` **Roadmap→Calendarios** (default = **Calendarios**). "Minors" = **botón que abre modal**, no tab. Semestres = altura variable.
- "Semester Limits" = `CuatriCaps` `<details>` colapsable por card (no full line). State `capCredByIdx`/`capMatByIdx`.
- "Download only this calendar": **no existe** botón per-card; hoy es `IOModal` con chips de selección → `exportPlan(fmt, cuatris)`.
- Preferencias: optimizer `optimizePlan` (optimize.ts:543-610), overrides `plan.fixed: Map<code,idx>`. Métodos `OptMethod = cuatris|dias|balance`. Export/import prefs: `serializePreferences`/`PreferenceBundle` (persist.ts).
- **DnD: YA existe** (HTML5 nativo `dataTransfer`) en **Roadmap** (drop→`PLAN_SET_FIXED`). No en Calendarios.
- Reset: `PLAN_RESET` (sin confirm) + `RESET_APPROVED` (con confirm). Import/Export: `IOModal`.
- Combinador `CombinadorView.tsx` (795): tab hermana, state `combo` SEPARADO de `plan.pool`. Reusa CursadaCalendar/DetailDrawer/exportPlan. Recomendador: solo "Sugerir materias" (bulk-add), NO el recomendador con preview de PlanView. Download: 1 botón "Descargar programa" (opción visible). Comisiones: `.cmb-chip__com`.
- **Finalize/Lock: no existe.** Requiere state nuevo (`lockedIdx:Set<number>`) + soporte en optimize.ts.

---

## 2. Contratos que fija el OVERSEER (antes de fan-out)

1. **`Minor`** — `lib/planner/minors.ts`: `{ id, name, short, initials, color }` desde `Plan.areas`+`AREA_COLOR`+`AREA_SHORT`. Fuente única de badges (cards, recs, modal, sidebar).
2. **`<CommissionSelect>`** — un componente único (font/padding/max-width/truncado). Reemplaza los 3 estilos.
3. **Sheet schema v2** — agregar `subunit` anidado a `SheetGroup`; re-derivar los 6 tokens `EntryKind` en las **3** copias sincronizadas.
4. **Export taxonomy** — `download.ts` API `{ calendar | syllabus | both } × { plan | combo }`. Reusada por IOModal, combinador, y download per-card.
5. **Planner tab-strip** — Calendar / Roadmap / Minors (+ toggle recomendador fijo) como strip compartido.
6. **`lockedIdx: Set<number>`** en PlanState + optimizer que lo respeta (Finalize/Lock).

---

## 3. Reglas duras heredadas (de PROJECT.md / CLAUDE.md)

- Vaults originales externos = SOLO LECTURA. Todo nuevo se copia al repo.
- Commits **sin** trailer `Co-Authored-By: Claude`. Push a `main` solo cuando el usuario lo pide (dispara deploy).
- DESIGN.md en **3 copias byte-idénticas** (repo `_estandar/`, skill `studyvault-page/assets/`, master externa) — sincronizar vía `studyvault-design`.
- Static-export safe: `window`/`localStorage` detrás de guards.
- Antes de "hecho": `tsc` + `next build` limpios + verificación en browser real (Preview MCP). CSS stale de Turbopack → `rm -rf .next` / `./run.sh clean`.
- `next dev` tira 500 en `/[vault]/` (bug pre-existente generateStaticParams+export) → verificar rutas de vault con **build estático**, no dev server.
- Next.js de este repo tiene breaking changes → leer `node_modules/next/dist/docs/` antes de código Next.

## 3b. Trampa de verificación de MOCKUPS (design-review)

- **El browser de review (Chrome MCP) NO tiene red externa.** Cualquier `<script>`/`<link>`/`@font-face`
  a un CDN (jsdelivr, Google Fonts, KaTeX) **cuelga** la carga → `document_idle` nunca dispara →
  el `screenshot` tira "Page still loading (45000ms)". Además el artefacto ni renderiza si su lib
  vive en CDN. **Regla: los HTML de `_design-review/` deben ser self-contained (0 requests externos).**
  Libs pesadas → descargarlas con Bash (Bash SÍ tiene red) y servirlas como **siblings locales**
  (`./three.min.js`, `./3d-force-graph.min.js`) cargadas classic; fuentes → system stack; math → estático.
- **three r0.179 NO tiene build UMD** (404); usar **r0.160 UMD** (`build/three.min.js`) que sí existe y
  cuyas APIs core son estables. `3d-force-graph@1.80` usa `window.THREE` si está presente → una sola three compartida.
- Verificación: servir `_design-review/` con `python3 -m http.server` desde MI sesión (no la del worker,
  que muere al terminar) y navegar a `http://127.0.0.1:<port>/<file>.html`.

---

## 4. Defaults propuestos (a confirmar en review de diseño; ⓘ = pendiente popup)

- A1 ⓘ Correlativas Pseudo-Landing: sección explainer arriba de `/electivas`.
- A2 Footer: rediseño limpio/denso, mismos links.
- A3 Landing: keep Hero+Materias+Grafo+Electivas CTA; cut/merge el resto.
- A4 ⓘ Toolkits: launcher bespoke por toolkit, runner compartido.
- A5 Wiki: prev/next por orden del árbol de sidebar.
- B1 Correlativas map: fix del SVG (pan/zoom + fit + responsive), no lib nueva.
- B2 Grafo landing: mover a la derecha del hero, más chico, sigue 2D. 3D solo en HTML temp.
- imagen ⓘ formato: vector / raster / híbrido.
- C1 Chips: Minor=badge iniciales; disponibilidad=1 dot; promoción/final=1 icono; créditos. Drop horario tag + área-first-word.
- C2 Rec single-line `[Name][Credits][+]`: fit-chips a tooltip hover.
- C3 DetailDrawer: reparación visual pura (sticky close, acciones simétricas, responsive).
- D1 Paleta sheets: muted low-saturation dentro de §12; espejar en export LaTeX.
- D3 Syllabus: doc unificado (tabla de evaluaciones combinada + biblio + contenidos por materia). Mantener print-to-PDF.
- E1 Tabs: reordenar Calendar→Roadmap; promover Minors de modal-botón a tab; toggle recomendador fijo en el strip.
- E2 Downloads: Only Calendar / Calendar+Syllabus / Only Syllabus en planner y combinador.
- E3 Save Preference (combo→plan): escribe pins `fixed` + re-optimiza el resto; caen en el próximo cuatri libre.
- E4 Finalize/Lock: lock de posición (optimizer no toca ese cuatri). Agrega `lockedIdx`.
- E5 DnD: extender el HTML5 nativo existente a la vista Calendarios.
- E6 Semester Limits → menú 3-dots {máx créditos, máx materias, auto/clear, descargar solo este calendario}.
