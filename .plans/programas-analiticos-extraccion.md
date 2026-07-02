# Plan — Extracción de Programas Analíticos (PA) → pseudo-DB → feature de plan de cursada

> Fecha: 2026-07-01 · Estado: **plan aprobado, a la espera de los 614 PDFs y de cerrar 4 decisiones**
> Fuente de los PDFs: carpeta/hoja Google Drive **"PA (es)"** (spreadsheet `1sSf_oZNyTyuPZBF0TXYjGvSzSw-fNcGEYyG3-SZ8-eY`, gid `1336774520`).
> Script de descarga ya generado: `~/Downloads/descargar-programas-itba.js` (614 file IDs embebidos).

---

## 0. Contexto y objetivo

Bajar los **614 programas analíticos** del grado ITBA (PDF), extraer TODA su información, parsearla en
**bloques por tipo de contenido** (contenido, evaluaciones, asistencia, biblio, etc.), y materializar una
**pseudo base de datos de JSONs** dentro del site. Esa DB alimenta:

1. **Modals / cards por materia** en la página (detalle del programa).
2. Una **feature en el Combinador / Plan de cursada**: el usuario elige características y el sistema
   propone un plan de materias para un cuatrimestre dado (join con la oferta de `horarios.json`).

---

## 1. Veredicto de factibilidad: **SÍ, muy factible — sin OCR**

Evidencia (11 PDFs inspeccionados, distintos deptos y años 2023→2026):

- **Texto nativo**: `Producer: Skia/PDF … Google Docs Renderer`. `pdftotext -layout` y `pdfplumber`
  extraen el texto sin pérdida. **No hace falta OCR.**
- **Plantilla única y consistente**: encabezado + **11 secciones** marcadas con el bullet `➢`, siempre
  en el mismo orden, idénticas en los 11 samples.
- Costo: 614 PDFs × ~5 págs → extracción completa en **pocos minutos**.
- Tooling ya presente en la máquina: `pdftotext`, `pdfinfo`, `pdfplumber 0.11.9`, `pypdf`.

---

## 2. Anatomía del PDF (modelo de datos que sale)

**Encabezado** (antes del primer `➢`):
`Materia`, `Código`, `Créditos`, `Carga horaria total`, `Departamento`, `Año`,
`Carrera de` (varias, separadas por `/`), `Fecha última actualización`.

**Secciones `➢` (orden fijo):**

| # | Sección | Naturaleza | Clasificación |
|---|---|---|---|
| 1 | Carga horaria | tabla numérica (totales, semanales, teóricas, presencial, prácticas, a distancia, laboratorio) | **carga horaria** |
| 2 | Contenidos mínimos | párrafo | **contenido** |
| 3 | Presentación de la materia | párrafo | **contenido** |
| 4 | Objetivos de aprendizaje | bullets | **contenido** |
| 5 | Contenidos | tabla `Título \| Descripción` (unidades/temas) | **contenido** detallado |
| 6 | Estrategias de enseñanza | párrafo/bullets | **metodología** |
| 7 | Actividades | párrafo/bullets | **metodología** |
| 8 | Recursos didácticos | párrafo/bullets | **metodología** |
| 9 | Modalidad de evaluación y aprobación | sub-bloques `Modalidad de evaluación:` + `Requisitos de aprobación:` | **evaluaciones** + **asistencia** + **régimen** |
| 10 | Bibliografía obligatoria | tabla `N° \| Descripción` | **biblio** |
| 11 | Bibliografía complementaria | tabla `N° \| Descripción` | **biblio** |

**Gotchas confirmados que el extractor debe manejar:**
- **Footer ruidoso**: líneas `Generado: <fecha> … <nº pág>` intercaladas cortan secciones a la mitad → filtrar.
- **`asistencia`** vive como texto libre dentro de "Requisitos de aprobación" (ej. *"Asistencia al 80% de las clases"*).
- **Biblio**: filas numeradas vacías (N° 3–6) y a veces varios libros apilados en una sola celda multi-línea.
- **`Contenidos`**: celdas de tabla que ocupan varias líneas (título en 2 renglones, descripción larga).
- Posibles **variantes de plantilla** en años viejos (sin `➢`): requiere fallback + reporte QA.
- Algunas materias **no tienen PDF** (59 de Informática no figuran en la hoja) → la feature degrada elegante.

---

## 3. Arquitectura propuesta

```
Electivas/programas-pdf/<cod>.pdf          (614 renombrados; fuente read-only)
        │
        ├─[Electivas/build-programas.py]   extracción + parseo + derivación
        │        pdfplumber → limpieza footer → split ➢ → bloques → campos derivados
        ▼
site/public/programas/<cod>.json           1 "ficha" por materia (raw + bloques + derivado)
site/public/programas/index.json           índice liviano (filtrable) para el combinador
        │
        ├─ modals/cards por materia         (lazy-fetch del <cod>.json al abrir)
        └─ feature "armar plan"             (filtra index.json + join con horarios.json)
```

**Forma de `<cod>.json`:**
```jsonc
{
  "codigo":"72.41","nombre":"Base de Datos II","departamento":"...","anio":2025,
  "creditos":6,"cargaHorariaTotal":102,"carreras":["Ing. en Informática","..."],
  "cargaHoraria":{"semanales":6,"teoricas":51,"practicas":26,"laboratorio":25,"aDistancia":0},
  "bloques":{
    "contenidosMinimos":"…","presentacion":"…","objetivos":["…"],
    "contenidos":[{"titulo":"MongoDB","descripcion":"CRUD, Nesting…"}],
    "estrategias":"…","actividades":"…","recursos":"…",
    "evaluacion":{"modalidad":"…","requisitos":"…"},
    "bibliografia":{"obligatoria":["…"],"complementaria":["…"]}
  },
  "derivado":{ /* flags filtrables — ver §6 decisiones */ },
  "fuente":{"pdf":"programas-pdf/72.41.pdf","sha1":"…","generado":"…"},
  "raw":{"texto":"…"}   // verbatim: mostrar original + re-derivar sin re-parsear
}
```

**Índice `index.json`** (liviano, para filtrar sin bajar 614 fichas):
array de `{ codigo, nombre, departamento, creditos, cargaSemanal, area, derivado{flags} }`.

**Principio clave:** guardar **raw + bloques + derivado** separados. La UI muestra `bloques`, la feature
filtra por `derivado`, y si cambia la taxonomía se re-deriva desde `raw` sin tocar los PDFs.

---

## 4. Fases de implementación (cuando estén los 614 PDFs)

1. **Ingesta**: renombrar descargados a `<cod>.pdf` (local, con el manifiesto de 614 → `to-download-full.json`),
   mover a `Electivas/programas-pdf/`, diff contra los 614 para listar faltantes/re-descargar.
2. **Extractor** `Electivas/build-programas.py`: texto → limpieza footer → split `➢` → parseo por tipo
   (tablas vs párrafos vs bullets) → `bloques`. Emite `<cod>.json` + `index.json`.
3. **Derivación**: de `bloques` → `derivado` (flags). Método en decisión D3.
4. **QA/validación**: reporte de PDFs que no matchean las 11 secciones, biblio vacía, carga horaria no parseada.
   Umbral de cobertura mínimo antes de publicar.
5. **UI materia**: card/modal por materia (con `studyvault-ui` + lazy-fetch del JSON). Integra con la vista de electivas.
6. **Feature "armar plan"**: panel de características en `CombinadorView`/`PlannerApp` → filtra `index.json`,
   join con `horarios.json` (oferta del cuatri) → propone conjunto de materias + horario armable.
7. **Verificación**: `tsc` + `next build` limpios + browser real (via skill `studyvault-ship`).

**Skills del repo a usar:** `studyvault-data` (pipeline build-*), `studyvault-ui` (cards/modals),
`studyvault-toolkit`/planner (feature), `studyvault-ship` (verificar + publicar).

---

## 5. Estado de datos (al 2026-07-01)

| | |
|---|---|
| Programas en la hoja PA (todo el grado) | **614** con PDF en Drive |
| Materias Ing. Informática en el repo | 139 (44 obligatorias + 95 electivas) |
| …con programa disponible en la hoja | 80 |
| …ya descargados (repo `electivas-fichas/` + Downloads) | 41 |
| …que faltan | 39 |
| …que no figuran en la hoja | 59 |

Manifiestos generados (scratchpad de la sesión): `to-download-full.json` (614), `to-download-repo.json` (39),
`pa-parsed.json` (hoja completa parseada).

---

## 6. DECISIONES ABIERTAS (pendientes de confirmar — con recomendación por defecto)

**D1 — Estructuras EXTRA a derivar además de los 11 bloques crudos.**
Recomendado: **las 4** →
(a) carga horaria estructurada (números), (b) evaluación→flags (tieneParcial/Final/TP/promocionable),
(c) asistencia como campo (obligatoria s/n + %), (d) contenidos→keywords/temas para filtro por área.
Todas son baratas y de alto valor para la feature.

**D2 — Características elegibles por el usuario en "armar plan".**
Recomendado: **las 4** → régimen (sin final / promocionable), sin asistencia obligatoria,
carga y modalidad (tope hs semanales, con/sin lab, presencial vs a distancia, créditos), área/temática + depto.

**D3 — Cómo derivar los campos difusos (promociona, asistencia %, parcial/final).**
Recomendado (default): **regex/heurística determinista** en Python (gratis, reproducible, rápido).
Si no se detecta un campo → `null` + se muestra el texto crudo (nunca inventar).
LLM opcional queda como enhancement futuro para casos dudosos.

**D4 — Dónde vive la pseudo-DB y alcance.**
Recomendado: **`site/public/programas/<cod>.json` + `index.json` (lazy fetch)**, alcance **las 614**
(la feature de Informática usa el subconjunto de ~139 vía join). No infla el bundle; modals on-demand.

> Cuando el usuario confirme/ajuste D1–D4, actualizar este doc y arrancar por la Fase 1.

---

## 7. Riesgos / mitigaciones

- **Variantes de plantilla** (años viejos, sin `➢`) → parser con fallback laxo + reporte QA que los liste.
- **Materias sin PDF** → la UI/feature muestran "sin programa" y no rompen el armado del plan.
- **Campos difusos mal redactados** → `null` + texto crudo visible; nunca inferir un dato que no está.
- **Static-export safe**: todo acceso a `window`/`localStorage`/`fetch` en la UI detrás de guards (convención del repo).
- **PDFs = fuente read-only**: viven en `Electivas/programas-pdf/`; los JSON son derivados regenerables.

---

## 8. EJECUTADO (2026-07-02) — el código gana sobre el plan original

Al implementar se descubrió que **la infraestructura ya existía** en el repo, así que se
reusó en vez de construir el pipeline Python + `public/programas/*.json` propuesto en §3:

- **Descarga**: 442 PDFs bajados (Chrome MCP) + 33 fichas ya en repo = **475/614**. Faltan **139**.
- **Ingesta**: `Electivas/programas-pdf/<cod>.pdf` (475, read-only, validados `%PDF`). Las **51**
  que corresponden a materias del planner de Informática se copiaron a `site/public/electivas-fichas/`.
- **Pipeline reusado**: `site/scripts/build-fichas-data.mjs` (ya existía, `pdftotext`-based) →
  `site/lib/planner/fichas.ts` (`FICHAS: Record<cod, Ficha>`), ahora **51 fichas** (antes 37).
  Se re-corre a mano; no va en CI.
- **Derivación (D1/D3)**: NO se persiste en fichas.ts. Vive en `site/lib/planner/programa.ts`
  como heurística determinista sobre `evaluacion` (raw + derivado separados → re-derivable sin
  re-parsear). `FichaDerivado = {tieneParcial, tieneFinal, tieneTP, promocionable, asistenciaObligatoria, asistenciaPct}`.
  Verificado adversarialmente contra las 51 (bugs corregidos: `final(es)?` y % de asistencia real vs peso de nota).
- **UI**: componente compartido `ProgramaChips.tsx` (chips régimen/asistencia + `ComingSoonBadge`),
  usado por `DetailDrawer`, `FichaReader`, `ElectivasView`, `CombinadorView`. CSS `.prog-*` en planner.css.
- **Feature (D2)**: filtros por características + "sugerir materias" en `CombinadorView` (view `combo`),
  atados a `state.charFilters` (`CharFilters`) vía `SET_CHAR_FILTERS`; cruzan con `matchesChars` +
  `generateCombos`/`hasHorario`. (El optimizador multi-cuatri de `PlanView` ya existía aparte.)
- **Coming soon (139)**: en el planner, "coming soon" = materia sin ficha (`!hasPrograma(cod)`):
  **88 de las 139** de Informática (29 de los 139 faltantes + 59 que no figuran en la hoja). Se
  muestran con `ComingSoonBadge`, no se procesan.

D4 quedó: DB liviana bundleada (`fichas.ts`, 51 fichas ≈ 400 KB) en vez de lazy-fetch, porque el
consumo actual (`FICHAS`) es síncrono y el único consumidor es el planner de Informática. Los 475
PDFs completos quedan archivados en `Electivas/programas-pdf/` para futura extensión 614-wide.
