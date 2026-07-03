---
name: studyvault-ingest
description: Ingesta material externo (PDFs, planillas, transcripts, horarios SGA, descargas masivas) al repo StudyVaults y lo cablea al sitio. Usala cuando el usuario pida "bajá/descargá estos PDFs/programas/fichas", "ingestá estos finales/apuntes/transcripciones", "movē esto de Downloads a donde va", "hacé el scraping de horarios de nuevo", "actualizá horarios.json para el cuatrimestre X", "poné al día el planner con el nuevo horario", o cualquier flujo adquirir→archivar→extraer→regenerar datos→verificar. Cubre descargas masivas SIEMPRE scripteadas (curl/gdown + manifiesto, jamás archivo por archivo vía browser) y delega la escritura de pipelines a studyvault-data.
---

# studyvault-ingest

Skill de **ingesta**: material externo (PDFs de programas/fichas/finales, planillas, transcripts
de videos, horarios del SGA, corpus descargados) → lugar canónico del repo → extracción →
módulo de datos → página del sitio → verificación.

**Leé primero `_shared/PROJECT.md`** (arquitectura + convenciones + trampas). Nació de la
auditoría de sesiones 2026-07: este flujo se re-improvisó a mano 6+ veces, incluida una descarga
de 614 PDFs archivo-por-archivo vía browser que costó 24 timeouts y 13 horas de sesión.

## Reglas duras

1. **Descargas masivas SIEMPRE scripteadas.** N > 5 archivos ⇒ escribí un script (curl / gdown /
   fetch con cookies) sobre un **manifiesto** (CSV/JSON de id → nombre destino), con reintentos y
   verificación de tamaño/extensión al final. **JAMÁS** bajar archivo por archivo con
   `mcp__claude-in-chrome__*` — los prompts de descarga de Chrome bloquean todo y obligan al
   usuario a babysittear.
2. **Nada queda suelto.** Todo archivo entrante tiene UN destino canónico (tabla abajo). Nunca
   dejar archivos en `~/Downloads/`, `~/Desktop/ITBA/` raíz, ni con sufijos `(1)`. Renombrar al
   patrón del directorio destino (ej. `72.41.pdf` por código de materia).
3. **Los originales externos son SOLO LECTURA** — siempre copiar al repo, nunca mover/editar los
   vaults originales.
4. **Rutas absolutas** en todos los comandos (el cwd de Bash se resetea entre llamadas).
5. La extracción/regeneración de datos para tools/hojas del sitio se escribe con la skill
   **`studyvault-data`** (modos data.ts committeado vs JSON gitignored, header AUTO-GENERADO).

## Destinos canónicos

| Material | Destino |
|---|---|
| PDFs de programas analíticos / fichas de electivas | `Electivas/programas-pdf/<código>.pdf` (475 ya viven ahí) + los expuestos al sitio en `site/public/electivas-fichas/` |
| Horarios SGA scrapeados | `Electivas/horarios.json` (cuatrimestre activo) y `Electivas/horarios-all.json` |
| Finales / parciales / apuntes de una materia | `<Vault>/raw/` del vault correspondiente (crearlo si no existe; patrón: `PAW/raw/`) |
| Transcripts de videos / clases | `<Vault>/raw/transcripts/` |
| Datos derivados para el planner | `Electivas/data.js` → lo consume `site/scripts/build-planner-data.mjs` |
| Corpus temporal de trabajo (descargas intermedias) | scratchpad de la sesión, NUNCA el repo |

## Modo: refresh de horarios SGA

Pipeline ya existente — **no reinventarlo** (docs en `Electivas/SCRAPING.md`):

1. Scraper: `Electivas/scrape-sga-full.js` (completo) o `scrape-sga-quick-test.js` (prueba).
   Correr con Node desde ruta absoluta; requiere sesión SGA (ver SCRAPING.md).
2. Salida → `Electivas/horarios.json` (+ `horarios-all.json` si aplica). Validar JSON y comparar
   contra el anterior (`git diff`) — un scrape a mitad de sesión SGA caída produce JSON vacío.
3. Regenerar datos del planner: `Electivas/build-data.py` y/o `npm run build` en `site/`
   (los hooks predev/prebuild corren `build-planner-data.mjs`).
4. Verificar el combinador/plan de cursada en el sitio (skill `studyvault-ship`, Fase A).

**`Electivas/horarios.json` es la fuente de verdad de horarios** para cualquier razonamiento
sobre superposiciones/comisiones — leerlo, no confiar en texto pegado.

## Modo: PDFs / documentos nuevos

1. **Adquirir**: si ya están en `~/Downloads/`, moverlos (no copiarlos) a su destino canónico con
   nombre normalizado. Si hay que bajarlos: script + manifiesto (regla dura #1).
2. **Archivar**: destino según tabla. Verificar count esperado vs real y extensiones válidas
   (un `.pdf` que empieza con `<!DOCTYPE` es una página de error, no un PDF).
3. **Extraer**: texto vía `pdftotext`/pdf-parse dentro de un pipeline `studyvault-data`
   (ver `Electivas/build-resumenes.py` como referencia de extracción existente).
4. **Cablear**: el módulo de datos a la tool/hoja/página que lo consume.
5. **Verificar**: la página renderiza el contenido nuevo (build estático + Claude Preview);
   spot-check de N ítems contra el PDF fuente (elegí ítems al azar, no los primeros).

## Checklist de cierre

- [ ] 0 archivos nuevos fuera de su destino canónico (`git status` no muestra sueltos raros)
- [ ] Manifiesto/count verificado: lo esperado == lo descargado/movido
- [ ] Pipeline de datos regenerado y committeable (o gitignored según el modo `studyvault-data`)
- [ ] Página consumidora verificada en el sitio real
- [ ] `~/Downloads/` sin residuos del trabajo
