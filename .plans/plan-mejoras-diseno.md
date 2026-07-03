# Plan — mejoras de diseño

> 2026-07-03. El spec vigente son los mockups aprobados de `_design-review/` (versionados).
> Toda mejora se contrasta contra ellos + `foundations.html` + la convención anti-IA.
> Las marcadas **[audit]** se afinan con los hallazgos de la auditoría en curso.

## D0 — Fidelity pass módulo por módulo (con evidencia)
Recorrer cada módulo implementado vs su mockup en browser real (Preview MCP, dark y light),
screenshot lado a lado, y listar divergencias: A (landing/toolkits/electivas-intro/wiki-nav),
B (correlativas pan/zoom), C (cards/modal/recommend), D (hojas/syllabus), E (planner/
combinador/overlays), F (finales). Divergencia sin decisión nueva = bug de diseño. [audit]

## D1 — Grafo 3D del hero (WIP vivo de otra sesión — no tocar hasta que aterrice)
- Al aterrizar: pulir knobs (opacidad de edges, velocidad de órbita, densidad de niebla),
  verificar en dark/light, `prefers-reduced-motion`, y fallback si WebGL no está.
- Decidir si el grafo temporal 3D de correlativas (`3d-temporal-graph.html`) también entra
  (decisión abierta de ORCHESTRATION §0b) o queda solo el de notas.

## D2 — Las 7 ilustraciones raster de materias (D6 aprobada, bloqueada por input)
- Hoy: banners SVG placeholder. Falta: generar/conseguir las 7 ilustraciones ricas
  (MNA/Derecho/Economía/Proba/PAW/SDS/Inge2), aprobación por materia, optimizarlas
  (tamaño/format), cablearlas en `VaultBanners`/cards y en la landing.

## D3 — Pulido transversal
1. **Anti-IA sweep**: buscar y erradicar tags rotados, `◆`, dashed decorativo en todo
   `site/` (quedó alguno pre-overhaul). [audit]
2. **Tokens**: hex hardcodeado → roles/`color-mix()`; coherencia dark/light; verificar que
   DESIGN.md §12 == `tokens.css` y re-sincronizar las 3 copias (skill `studyvault-design`).
3. **A11y**: focus-visible consistente, aria en modales/nav nuevos (DetailDrawer, 3-dots,
   FinalesCombinador), contraste AA en la paleta de hojas, `prefers-reduced-motion` en
   animaciones nuevas (electivas-intro, grafo). [audit]
4. **Print**: hojas y syllabus — verificar la capa print post-paleta nueva (colores legibles
   en b/n, cortes de página).

## D4 — Ideas aprobadas no construidas / siguientes
- Footer/de-stick topbar en `/electivas`: confirmar contra mockup si quedó como spec. [audit]
- Micro-interacciones sobrias (hover states de cards/launchers) donde el mockup las define.
- Revisar tipografía/espaciado de la wiki contra `module-a-wiki-nav.html`.
