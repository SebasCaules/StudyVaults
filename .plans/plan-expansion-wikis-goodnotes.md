# Plan: expansión del universo de wikis desde apuntes GoodNotes

> Objetivo: convertir los apuntes simples de cuatrimestres pasados (GoodNotes) en vaults
> Obsidian completos dentro del repo, con wiki según `DESIGN.md` + **toolkits interactivos
> creativos por materia**. Estado: **esperando los PDFs exportados** (formato acordado: PDF).
> Todos los agentes corren en **Opus** (directiva vigente).

## Formato de entrega acordado

- **PDF, un archivo por cuaderno/materia**, exportado desde GoodNotes con anotaciones
  **aplanadas** (flattened). Nombre de archivo = nombre de la materia/cuaderno.
- Si GoodNotes ofrece incluir la capa de texto OCR, incluirla (ayuda, no es requisito:
  la manuscrita se lee visualmente página por página).
- Carpeta de entrega sugerida: `~/Downloads/goodnotes-export/` (una subcarpeta por materia
  si un cuaderno no alcanza). De ahí se ingesta scripteado, jamás archivo por archivo.

## Fases

### F0 — Triage e inventario (al recibir los PDFs)
- Inventariar: materias, cantidad de páginas, calidad de la letra, idioma, si hay fórmulas.
- Por materia decidir: `vaultId`, flag `math`, estructura de unidades (leyendo el índice
  real de los apuntes, no inventada).
- Entregable: tabla de triage aprobada por el usuario **antes** de transcribir nada.

### F1 — Ingesta canónica (`studyvault-ingest`)
- Archivar los PDFs en `<Vault>/raw/` con manifiesto. Los originales externos quedan intactos.

### F2 — Alta de vaults nuevos
- Crear `<Vault>/wiki/index.md` + subcarpetas temáticas según DESIGN.md.
- Registrar en `site/lib/content/vaults.ts` (id, math, orden en portal). Verificar que el
  build descubre las páginas nuevas (`./run.sh build`).

### F3 — Transcripción → wiki (fan-out grande, verificación adversarial)
- **Contratos primero (overseer)**: taxonomía de páginas por materia (index → unidades →
  páginas de tema), naming, frontmatter, convenciones de wikilinks. Recién ahí fan-out.
- Un agente por unidad/bloque de páginas: lee el PDF visualmente y produce páginas `.md`
  DESIGN.md-compliant (vía `studyvault-page` como referencia de estándar).
- **Verificación adversarial obligatoria**: lector independiente re-lee el PDF fuente y
  confirma/refuta cada definición y fórmula transcripta ("refutado si hay duda", effort
  xhigh). Es material de estudio: mejor menos páginas y 100% correctas.

### F4 — Toolkits creativos por materia (`studyvault-toolkit` + `studyvault-data`)
- Por materia: proponer 2–4 ideas de tools **ancladas al contenido real transcripto**
  (no genéricas) — quizzes, clasificadores, calculadoras, simuladores, flashcards con
  progreso tipo Inge2, según lo que la materia pida.
- Mostrar propuestas/mockups y **esperar OK del usuario** antes de buildear (convención
  de rondas de diseño del repo).
- Datos de las tools derivados del vault vía pipeline `scripts/build-*-data.mjs`.

### F5 — Hojas imprimibles (`studyvault-sheet`) — donde aplique
- Solo materias con densidad de fórmulas/conceptos que lo justifique.

### F6 — Verificación + publicación (`studyvault-ship`)
- `tsc` + `next build` limpios, verificación en build estático (las rutas `/[vault]/`
  no renderizan en dev), evidencia en browser. Push a `main` solo cuando el usuario lo pida.

## Riesgos conocidos
- Letra manuscrita ilegible en partes → el triage F0 lo detecta; lo dudoso se marca, no se inventa.
- Materias con math → flag correcto en `vaults.ts` desde el alta (F2) para no re-renderizar.
- Sesiones concurrentes → commitear temprano por fase.
