# Plan — mejoras de diseño

> 2026-07-03 (v2, con auditoría integrada). El spec vigente son los mockups aprobados de
> `_design-review/` (versionados). La auditoría confirmó que el núcleo es fiel al spec;
> lo que sigue son (a) divergencias que necesitan TU decisión, (b) pulido transversal.
> **[WIP]** = tocan archivos en edición por otra sesión — coordinar.

## D0 — Divergencias vs mockups: DECISIONES del usuario (spec manda salvo que apruebes el cambio)
1. ✅ **RESUELTO 2026-07-04 — gana la paleta "refinada"** (decisión del usuario). Documentada
   en DESIGN.md **§12.10** (3 copias en sync, md5 `c6061c05…`); la sync types↔css↔tex ya era
   perfecta. La propuesta original de foundations.html queda como histórico del mockup.
2. **Hero-planner box de la landing** (module-a-landing:456-465): la caja destacada con
   eyebrow quedó reducida a un botón primario más — ¿reponer o aprobar la simplificación?
3. **Banda "Grafo" + vista de grafo completa** (module-a-landing:762-797): no existe ni la
   sección ni el link "Grafo" del nav; el grafo quedó solo como tarjeta del hero —
   ¿implementar la vista completa navegable o registrar el recorte?
4. **PlannerIntro feature 03**: el mockup dice "Recomendador de electivas"; la impl puso
   "Combinador de finales" (y cambió el orden de features) — ¿aprobar el swap?
5. ✅ **RESUELTO 2026-07-04 — recomendador del Plan migrado a filas slim** (rediseño
   `96b2912`/`0a69943`): vive en el rail `PlanRail` (tab Recomendadas) con filas
   `[dot][abbr][Nombre][N cr][+]` + línea de fit, alineado a module-c-recommend.
   Las `rec-card` viejas fueron purgadas del CSS.
6. **Tonos de toolkit**: `--role-theorem: var(--status-promo)` (teal) vs violeta `--k-def`
   del mockup module-a-toolkits — toolkit.css:913-918.
7. **Navbar/Footer menores**: search solo-ícono vs pill "Buscar ⌘K"; footer sin "Buscar ⌘K",
   sin link "Interno / UI" ni sello "Technical Split · v1.0"; cards de materia con
   "N páginas" vs meta "herramientas · hojas" — decidir por ítem.
8. **DetailDrawer con botón binario "marcar aprobada"** conviviendo con el tri-estado de
   CuatriView (dos semánticas de "aprobada") — unificar con `EstadoControl` (ver P1.4 del
   plan de correcciones).

## D1 — Grafo 3D del hero **[WIP — pasar estos hallazgos a la sesión que lo está reworkeando]**
- Paleta `VIVID` hardcodea 7 hex fuera del sistema (`derecho:#E06B4F`…) divergiendo de los
  tints `--vt-*`/BASE que sí están en sync — derivar del mismo BASE o documentar en §12.
- Tooltip ilegible en light (globals.css:956-960, brown-sobre-brown).
- Leaks: `SpriteMaterial` por nodo sin `dispose()` al desmontar, `setTimeout` de zoomToFit
  sin clear, props `light`/`selected` muertas (ForceGraph3DInner.tsx:88-100,193-196,292-305).
- Al aterrizar: knobs (opacidad edges, velocidad órbita, niebla), dark/light,
  `prefers-reduced-motion`, fallback sin WebGL. Y decidir si el grafo temporal 3D de
  correlativas (3d-temporal-graph.html) también entra o queda solo el de notas.

## D2 — Las 7 ilustraciones raster de materias (D6 aprobada; bloqueada por input tuyo)
Generar/conseguir las 7 (MNA/Derecho/Economía/Proba/PAW/SDS/Inge2), aprobación por materia,
optimizar y cablear en VaultBanners/cards/landing. Hoy: SVG placeholder ciclando 3 acentos.

## D3 — Pulido transversal — mayormente ✅ HECHO (batch 2026-07-04)
1. **Anti-IA sweep**: ✅ dashed→solid en toolkit.css (`.vtool-kv`, solución de ejercicios) y
   planner.css (`rec-fit--soft/--nohor`, `.card__read`). ⏸ Pendiente SOLO lo de globals.css
   (◆ en h2 de prosa, separadores wikinav/proof, `.vl-cmd__code` hex) — archivo caliente de
   la sesión del grafo/hero.
2. **Tokens / theming**: ✅ `--status-*` ahora conmutan por tema (variantes light profundas
   alineadas a la paleta de hojas; documentado en DESIGN.md §12, 3 copias md5 `d720a581…`).
   ⏸ Pendiente: `--dvt-*` de quizzes (toolkit.css:1796) y paleta del editor de diagramas
   (diagram.css) — consolidarlos como tokens semánticos requiere decisión de diseño; chevron
   de forms.css:16 (data-URI por tema) evaluado y dejado.
3. **A11y**: ✅ flechas en tablist de PlanView, autoplay/ARIA de PlannerIntro, foco accesible
   (inicial+trap+restore) en DetailDrawer/IOModal/MinorsModal/ResetConfirm, contraste de
   status en light.
4. **Print**: ⏳ verificar la capa print de hojas y syllabus post-paleta — va con la
   verificación P0 (browser real).

## D4 — Fidelidad verificada OK (no tocar; base para el fidelity pass browser de P0)
GrafoView=module-b (pan/zoom/Ajustar sin overflow) · DetailDrawer=module-c-modal (X sticky,
grid simétrico, container queries) · cards=module-c-cards (5 señales+badge minor) ·
PlanView=module-e-planner **[SUPERSEDIDO 2026-07-04 por el rediseño workbench `96b2912` —
el spec vigente de PlanView es esa impl, no el mockup]** · Combinador=
module-e-combinador/overlays · doble-check=module-f-checks (salvo electivas, ver P1.4) ·
wiki prev/next=module-a-wiki-nav (mejorado: kbd+progreso) · toolkits bespoke=module-a-toolkits
· electivas-intro=module-a-electivas-intro (casi 1:1, reduced-motion OK).
