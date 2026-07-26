# Auditoría de fricción — qué se creó/cambió y para qué (2026-07-03/04)

> Referencia de todo lo nuevo que salió de la auditoría de las 49 sesiones de Claude Code
> (14/06 → 02/07). Cada ítem: qué es, dónde vive, qué problema ataca y cómo deshacerlo.
> Los números de errores citados salen de los transcripts reales de `~/.claude/projects/`.

## Resumen del diagnóstico

| Cluster de fricción | Evidencia | Fix principal |
|---|---|---|
| Verificación visual rota (preview/Chrome) | ~100 errores; 19 rondas "seguí mejorando" | Reglas en CLAUDE.md + higiene en `studyvault-ship` + server `site-static` |
| Sesiones concurrentes se pisan | 32+ errores de archivo stale; 40 archivos borrados una vez | Hook de aviso al inicio + regla Read-antes-de-Edit |
| Ritual de publicar manual | "pushea todo" en 20+ sesiones | Trigger en CLAUDE.md + fast path en `studyvault-ship` |
| `cd` relativo falla (cwd se resetea) | ~11 errores | Hook que lo bloquea |
| Ingesta de material a mano | 6+ sesiones; 614 PDFs vía browser | Skill nueva `studyvault-ingest` |
| Estándares re-explicados | fórmulas "estilo libro" ×4, horarios, modelos | DESIGN.md §6.1 + CLAUDE.md + skill orquesta |

---

## 1. `.claude/settings.json` (NUEVO — hooks + permisos)

Primera config de harness a nivel repo. Cuatro cosas adentro:

- **Hook `PreToolUse` (Bash): bloqueo de `cd` relativo.** Si un comando contiene `cd site`,
  `cd Electivas` o cualquier `cd` que no empiece con `/`, `~`, `"`, `'`, `$` o `-`, se **deniega**
  con un mensaje que pide ruta absoluta. Razón: el cwd de Bash se resetea entre llamadas y esto
  causó ~11 comandos fallidos. Verificado en vivo (denegó un `cd site` de prueba).
- **Hook `PreToolUse` (Bash): bloqueo del trailer de co-autoría.** Cualquier `git commit` cuyo
  mensaje contenga `Co-Authored-By: Claude` se deniega. Convierte la convención del repo
  (commits solo a tu nombre) en garantía, no en costumbre.
- **Hook `SessionStart`: aviso de sesiones concurrentes.** Al abrir una sesión, si el working
  tree tiene **>15 archivos sin commitear**, muestra un warning y le inyecta contexto al modelo:
  "commiteá temprano, Read antes de Edit, jamás `git checkout`/`clean` sobre archivos ajenos".
  Ataca el incidente de los 40 archivos borrados por otra sesión.
- **`permissions.allow`**: los comandos del loop de verificación que antes pedían permiso cada
  vez (`npx tsc --noEmit`, `npm run build`, `npx next build`, `./run.sh …`, `lsof`, `which`,
  `ls`, `wc`, `pgrep`). También evita que corridas programadas mueran esperando aprobación.
- **`attribution.commit: ""`**: el harness deja de inyectar su atribución en commits (capa
  extra además del hook).

**Deshacer:** borrar `.claude/settings.json` (o la clave puntual) y abrir `/hooks` o reiniciar.

## 2. `CLAUDE.md` — bloque "Reglas operativas" + triggers (MODIFICADO)

Dos agregados:

- **Triggers de lenguaje natural** en la tabla de skills: "pushea todo" ⇒ `studyvault-ship`
  (y "no chequees" ⇒ saltear verificación), "no veo los cambios" ⇒ `./run.sh` (nunca debuggear
  antes de limpiar caché), "ingestá/bajá PDFs" ⇒ `studyvault-ingest`.
- **Sección "Reglas operativas"**: rutas absolutas siempre; verificación visual SOLO con Claude
  Preview contra `site` o `site-static` (nunca tu Chrome salvo pedido explícito; rutas
  `/[vault]/…` solo en build estático); disciplina para sesiones concurrentes; 
  `Electivas/horarios.json` como fuente de verdad de horarios; archivos entrantes a su lugar
  canónico; `Monitor` en vez de `sleep`; descargas masivas siempre scripteadas; tras una
  interrupción resolver la objeción, no repetir la pregunta.

## 3. Skill nueva: `studyvault-ingest` (`.claude/skills/studyvault-ingest/`)

Octava skill de la suite (registrada en `.claude/skills/README.md` y en la tabla de CLAUDE.md).
Cubre el flujo que se improvisó a mano 6+ veces: **adquirir → archivar en destino canónico →
extraer → regenerar datos → verificar**. Incluye:

- Tabla de **destinos canónicos** (PDFs a `Electivas/programas-pdf/<código>.pdf`, horarios a
  `Electivas/horarios.json`, finales/apuntes a `<Vault>/raw/`, etc. — nada suelto en Downloads).
- **Modo refresh de horarios SGA** apuntando a los scripts reales
  (`Electivas/scrape-sga-full.js`, `build-data.py`, docs en `SCRAPING.md`).
- **Regla dura**: >5 archivos ⇒ descarga scripteada con manifiesto + reintentos + verificación
  de count/extensión. Jamás archivo-por-archivo vía browser (la maratón de 614 PDFs costó 24
  timeouts, 3 desbloqueos manuales tuyos y 13,5 h de sesión).
- Delegación explícita a `studyvault-data` para los pipelines de extracción.

## 4. Skill parcheada: `studyvault-ship`

- **Fast path "no chequees"**: saltea la Fase A entera (solo `tsc` como sanity) y va directo a
  commit+push. Nace de tu interrupción "no chequees, dejá todo listo para pushear".
- **Higiene de preview** (los ~100 errores del cluster 1): solo servers `site`/`site-static`
  (no inventar nombres); `/[vault]/…` solo contra build estático; ante "Inspected target
  navigated or closed" re-adjuntarse UNA vez (no loopear); ids de preview muertos ⇒
  `preview_start` de nuevo; `Monitor` para esperar, nunca `sleep`; **nunca tu Chrome**.
- **Trampas nuevas**: "no veo los cambios" = caché stale primero (matar server + `run.sh`);
  tras una ola de subagentes que tocó `site/`, `tsc` + `next build` ANTES de reportar terminado
  (una migración masiva ya dejó el build roto una vez).

## 5. Skill parcheada: `orquesta` (global, `~/.claude/skills/orquesta/`)

- **§Modelos reescrito a TODO-OPUS** (tu decisión del 04/07): overseer y workers en
  `model: "opus"`; nunca bajar a Sonnet salvo que lo pidas en el momento; lo que se calibra por
  pieza es el **effort** (tabla low→xhigh).
- **Sección nueva "Esquemas de herramientas"** con los errores que ya pasaron: `TaskCreate` es
  una task por call (no existe `tasks[]`); scripts de Workflow en JS plano (no TypeScript, no
  `run_in_background`); `Read` antes de `Edit` después de que escribe un subagente (30+ errores);
  no re-emitir una `AskUserQuestion` rechazada; cargar `Monitor` vía ToolSearch antes de usarlo.

## 6. Estándar: DESIGN.md §6.1 "Estilo libro" (+ §11 + companion)

La regla que re-explicaste 4 veces en 2 días quedó codificada: toda fórmula relevante =
**intro en prosa → bloque display `$$…$$` en renglón propio → leyenda de variables** (todos los
símbolos); prohibida la "pared de fórmulas inline"; derivaciones con un display por paso.

- Ítem nuevo en el **checklist §11** (lo consume `studyvault-page` en cada página).
- Ejemplo completo en `_estandar/FEATURES_formulas-y-codigo.md` §1.3 bis.
- **3 copias re-sincronizadas** (repo `_estandar/`, `studyvault-page/assets/`, master externa)
  — md5 idéntico verificado.

## 7. `.claude/launch.json` — server `site-static` (MODIFICADO)

Config nueva que corre `./run.sh build` (limpia + build estático + sirve en
`/StudyVaults/`). Es el server contra el que se verifican las rutas `/[vault]/…` (que en dev
tiran 500 por el bug conocido de `generateStaticParams` + `output:export`). Antes Claude
inventaba nombres de server (`site-dev`) y fallaba.

## 8. Borrado: `~/.claude/skills/studyvault-page` (duplicada stale)

Copia vieja (14/06) de la skill del repo que además arrastraba una **4.ª copia desincronizada
de DESIGN.md** fuera del loop de sincronía, y hacía aparecer la skill dos veces en el listado.
La única `studyvault-page` válida es la del repo.

## 9. Alineación todo-Opus (04/07)

Cuatro lugares consistentes: skill `orquesta` (§Modelos, baked-in), memoria
`feedback-all-agents-opus` (actualizada: ya no dice "invalida el default", dice que está
integrado), `.claude/ORCHESTRATION.md` (header stale que decía "workers (Sonnet)" corregido),
`.claude/BUILD_PLAN.md` (ya estaba bien — línea "Todo agente/subagente corre en Opus").

---

## Qué quedó SIN hacer (decidido u opcional)

- **`run.sh` no se tocó**: ya hace limpieza de caché en `dev` y `build`; el problema era no
  usarlo, y eso lo resuelven CLAUDE.md + ship.
- El allowlist global de `~/.claude/settings.json` arrastra entradas muertas de otros proyectos
  (mvn de PAW, sorts de /tmp) — inofensivas; limpiar algún día con `/fewer-permission-prompts`.
