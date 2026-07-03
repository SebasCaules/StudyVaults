# Plan — mejoras de diseño

> 2026-07-03 (v2, con auditoría integrada). El spec vigente son los mockups aprobados de
> `_design-review/` (versionados). La auditoría confirmó que el núcleo es fiel al spec;
> lo que sigue son (a) divergencias que necesitan TU decisión, (b) pulido transversal.
> **[WIP]** = tocan archivos en edición por otra sesión — coordinar.

## D0 — Divergencias vs mockups: DECISIONES del usuario (spec manda salvo que apruebes el cambio)
1. **Paleta de hojas "refinada"**: los 12 hex implementados difieren del spec aprobado
   (foundations.html §2) — p.ej. def dark `#9AC7EA` vs `#9AB8D6`. La sync interna
   types↔css↔tex es perfecta y el comentario la llama "Paleta refinada (rework 2026-07)".
   Decidir: ¿manda el spec o el refinamiento? En ambos casos, replicar la ganadora a
   DESIGN.md §12 (skill `studyvault-design`) — hoy DESIGN.md no tiene NINGÚN hex de hojas.
2. **Hero-planner box de la landing** (module-a-landing:456-465): la caja destacada con
   eyebrow quedó reducida a un botón primario más — ¿reponer o aprobar la simplificación?
3. **Banda "Grafo" + vista de grafo completa** (module-a-landing:762-797): no existe ni la
   sección ni el link "Grafo" del nav; el grafo quedó solo como tarjeta del hero —
   ¿implementar la vista completa navegable o registrar el recorte?
4. **PlannerIntro feature 03**: el mockup dice "Recomendador de electivas"; la impl puso
   "Combinador de finales" (y cambió el orden de features) — ¿aprobar el swap?
5. **Recomendador del Plan**: usa cards (`rec-card`) donde el mockup module-c-recommend
   especifica filas slim `[dot][Nombre][N cr][+]` con fit en tooltip (el Combinador SÍ las
   implementó) — ¿migrar PlanView a slim o aprobar la divergencia?
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

## D3 — Pulido transversal (ejecutable sin decisiones)
1. **Anti-IA sweep** (la regla: dashed solo para vacío/placeholder; nada de ◆):
   - `◆` decorativo en TODOS los h2 de prosa — globals.css:456-463 **[WIP archivo]**.
   - dashed decorativo: separadores `.wikinav__grouppages` (globals:273) y proof env
     (globals:571); `.vtool-kv`/steps (toolkit.css:251,1270); chips informativos
     `rec-fit--soft/--nohor` y botón `.card__read` (planner.css:1523,1526,1850) → solid.
   - Verificado limpio: sin tags rotados ni ◆ en planner/toolkits/hojas (los rotate son
     chevrons/checkmarks funcionales).
2. **Tokens / theming**:
   - `--status-go/promo/warn/caution` fijos en `:root` sin variante light (el spec
     foundations los conmuta por tema); `#d8b279` rinde ~1.9:1 sobre blanco — tokens.css:57-64.
   - Hex hardcodeado → tokens: `.vl-cmd__code` (globals:1894), chevron del select
     (forms.css:16, no conmuta en light), `.vtool-code` + `--dvt-*` de quizzes
     (toolkit.css:409,1796-1804), paleta del editor de diagramas (diagram.css:270-290) —
     consolidar como tokens semánticos documentados en §12.
3. **A11y**: flechas de teclado en tablists (PlanView, PlannerIntro), focus-trap + foco
   inicial en modales del planner, contraste AA de status en light, reduced-motion ya OK.
4. **Print**: verificar la capa print de hojas y syllabus post-paleta (b/n legible, cortes).

## D4 — Fidelidad verificada OK (no tocar; base para el fidelity pass browser de P0)
GrafoView=module-b (pan/zoom/Ajustar sin overflow) · DetailDrawer=module-c-modal (X sticky,
grid simétrico, container queries) · cards=module-c-cards (5 señales+badge minor) ·
PlanView=module-e-planner (banner, tabs, 3-dots, lock chip, DnD hint) · Combinador=
module-e-combinador/overlays · doble-check=module-f-checks (salvo electivas, ver P1.4) ·
wiki prev/next=module-a-wiki-nav (mejorado: kbd+progreso) · toolkits bespoke=module-a-toolkits
· electivas-intro=module-a-electivas-intro (casi 1:1, reduced-motion OK).
